import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useCatalog, resetCatalog } from '../../src/composables/useCatalog.js'
import { rawEpisodes } from './fixtures.js'

const ok = { ok: true, status: 200, json: async () => ({ results: rawEpisodes }) }

beforeEach(() => { vi.stubGlobal('fetch', vi.fn()); resetCatalog() })
afterEach(() => vi.unstubAllGlobals())

describe('useCatalog', () => {
  it('concurrent loads fetch once', async () => {
    fetch.mockResolvedValue(ok)
    const { load, status, episodes } = useCatalog()
    expect(status.value).toBe('idle')
    const p = Promise.all([load(), useCatalog().load()])
    expect(status.value).toBe('loading')
    await p
    expect(fetch).toHaveBeenCalledTimes(1)
    expect(status.value).toBe('ready')
    expect(episodes.value).toHaveLength(4)
  })
  it('errors, then reload recovers', async () => {
    fetch.mockRejectedValueOnce(new Error('down'))
    const { load, reload, status, episodes } = useCatalog()
    await load()
    expect(status.value).toBe('error')
    fetch.mockResolvedValue(ok)
    await reload()
    expect(status.value).toBe('ready')
    expect(episodes.value).toHaveLength(4)
  })
})
