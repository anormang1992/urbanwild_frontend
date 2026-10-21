import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  API_BASE, ApiError, LeadError, RATE_LIMIT_MESSAGE, GENERIC_LEAD_MESSAGE,
  fetchCatalog, fetchEpisode, shouldRecordPlays, recordPlay, sendLead,
} from '../../src/lib/api.js'
import { catalog, rawEpisodes } from './fixtures.js'

const json = (body, status = 200) => ({ ok: status >= 200 && status < 300, status, json: async () => body })
const lead = { name: 'A', zip: '00000', email: 'a@b.co', phone: '', consent: true }

beforeEach(() => vi.stubGlobal('fetch', vi.fn()))
afterEach(() => vi.unstubAllGlobals())

describe('fetchCatalog', () => {
  it('requests the catalog URL and returns episodes', async () => {
    fetch.mockResolvedValue(json({ count: 4, next: null, previous: null, results: rawEpisodes }))
    expect(await fetchCatalog()).toEqual(catalog)
    expect(fetch.mock.calls[0][0]).toBe(`${API_BASE}/api/v1/wems/?wem_locked=False&limit=100`)
  })
  it('throws ApiError on 500', async () => {
    fetch.mockResolvedValue(json({}, 500))
    await expect(fetchCatalog()).rejects.toMatchObject({ name: 'ApiError', status: 500 })
    await expect(fetchCatalog()).rejects.toBeInstanceOf(ApiError)
  })
})

describe('fetchEpisode', () => {
  it('requests the key URL and returns null when empty', async () => {
    fetch.mockResolvedValue(json({ results: [] }))
    expect(await fetchEpisode('lady-eagle-dock-lake-auman')).toBeNull()
    expect(fetch.mock.calls[0][0]).toBe(`${API_BASE}/api/v1/wems/?wem_locked=False&key=lady-eagle-dock-lake-auman`)
  })
  it('returns the episode when found', async () => {
    fetch.mockResolvedValue(json({ results: [rawEpisodes[3]] }))
    expect(await fetchEpisode('x')).toEqual(catalog[3])
  })
})

describe('shouldRecordPlays', () => {
  it('only for production hosts', () => {
    expect(shouldRecordPlays('urbanwild.tv')).toBe(true)
    expect(shouldRecordPlays('www.urbanwild.tv')).toBe(true)
    expect(shouldRecordPlays('localhost')).toBe(false)
    expect(shouldRecordPlays('urbanwild.herokuapp.com')).toBe(false)
  })
})

describe('recordPlay', () => {
  it('POSTs on production', async () => {
    fetch.mockResolvedValue(json({}))
    await recordPlay(1, 'urbanwild.tv')
    expect(fetch.mock.calls[0][0]).toBe(`${API_BASE}/api/v1/wems/1/play/`)
    expect(fetch.mock.calls[0][1].method).toBe('POST')
  })
  it('does nothing elsewhere', async () => {
    await recordPlay(1, 'localhost')
    expect(fetch).not.toHaveBeenCalled()
  })
  it('never throws', async () => {
    fetch.mockRejectedValue(new Error('offline'))
    await expect(recordPlay(1, 'urbanwild.tv')).resolves.toBeUndefined()
  })
})

describe('sendLead', () => {
  it('POSTs JSON', async () => {
    fetch.mockResolvedValue(json({}, 200))
    await sendLead(lead)
    expect(fetch.mock.calls[0][0]).toBe(`${API_BASE}/send-lead-message/`)
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual(lead)
  })
  it('maps 400 field errors', async () => {
    fetch.mockResolvedValue(json({ zip: ['Enter a valid value.'], non_field_errors: ['a', 'b'] }, 400))
    const err = await sendLead(lead).catch(e => e)
    expect(err).toBeInstanceOf(LeadError)
    expect(err.status).toBe(400)
    expect(err.fieldErrors).toEqual({ zip: 'Enter a valid value.', non_field_errors: 'a b' })
  })
  it('429 gives the rate limit message', async () => {
    fetch.mockResolvedValue(json({}, 429))
    await expect(sendLead(lead)).rejects.toThrow(RATE_LIMIT_MESSAGE)
  })
  it('network failure gives the generic message', async () => {
    fetch.mockRejectedValue(new TypeError('Failed to fetch'))
    await expect(sendLead(lead)).rejects.toThrow(GENERIC_LEAD_MESSAGE)
  })
  it('other statuses give the generic message', async () => {
    fetch.mockResolvedValue(json({}, 500))
    await expect(sendLead(lead)).rejects.toThrow(GENERIC_LEAD_MESSAGE)
  })
})
