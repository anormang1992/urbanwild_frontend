import { toEpisode } from './episodes.js'

export const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'https://urbanwild-api.herokuapp.com').replace(/\/+$/, '')
export const RATE_LIMIT_MESSAGE = "You've sent a few requests already. Please try again later."
export const GENERIC_LEAD_MESSAGE = 'Something went wrong. Please try again.'

const PLAY_HOSTS = ['urbanwild.tv', 'www.urbanwild.tv']

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export class LeadError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message)
    this.name = 'LeadError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function getJson(url) {
  const res = await fetch(url)
  if (!res.ok) throw new ApiError(`Request failed with status ${res.status}`, res.status)
  return res.json()
}

export async function fetchCatalog() {
  const data = await getJson(`${API_BASE}/api/v1/wems/?wem_locked=False&limit=100`)
  return (data.results || []).map(toEpisode)
}

export async function fetchEpisode(key) {
  const data = await getJson(`${API_BASE}/api/v1/wems/?wem_locked=False&key=${encodeURIComponent(key)}`)
  const first = (data.results || [])[0]
  return first ? toEpisode(first) : null
}

export function shouldRecordPlays(hostname) {
  return PLAY_HOSTS.includes(hostname)
}

export async function recordPlay(id, hostname = window.location.hostname) {
  if (!shouldRecordPlays(hostname)) return
  try {
    await fetch(`${API_BASE}/api/v1/wems/${id}/play/`, { method: 'POST' })
  } catch {
    // play counts are best-effort
  }
}

export async function sendLead({ name, zip, email, phone, consent }) {
  let res
  try {
    res = await fetch(`${API_BASE}/send-lead-message/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, zip, email, phone, consent }),
    })
  } catch {
    throw new Error(GENERIC_LEAD_MESSAGE)
  }
  if (res.ok) return
  if (res.status === 429) throw new Error(RATE_LIMIT_MESSAGE)
  if (res.status === 400) {
    let body = null
    try { body = await res.json() } catch { /* fall through */ }
    const fieldErrors = {}
    if (body && typeof body === 'object') {
      for (const [key, value] of Object.entries(body)) {
        fieldErrors[key] = Array.isArray(value) ? value.join(' ') : String(value)
      }
    }
    throw new LeadError(GENERIC_LEAD_MESSAGE, 400, fieldErrors)
  }
  throw new Error(GENERIC_LEAD_MESSAGE)
}
