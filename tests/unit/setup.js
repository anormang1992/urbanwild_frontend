import { afterEach, expect } from 'vitest'

window.scrollTo = () => {}

// Tests must never reach a real server (API_BASE falls back to the production API).
// A fetch that no test stubbed is rejected and fails the test that made it.
const unmockedRequests = []
globalThis.fetch = (input) => {
  unmockedRequests.push(String(input?.url ?? input))
  return Promise.reject(new TypeError('Network access is disabled in tests'))
}

afterEach(() => {
  expect(unmockedRequests.splice(0), 'unmocked fetch calls').toEqual([])
})
