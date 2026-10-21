import { describe, it, expect } from 'vitest'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../../src/router.js'
import { mountApp } from './helpers.js'

describe('router', () => {
  it('redirects /learn to episodes', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/learn')
    expect(router.currentRoute.value.name).toBe('episodes')
  })

  it('redirects /learn?key=K to watch', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/learn?key=lady-eagle-dock-lake-auman')
    expect(router.currentRoute.value.name).toBe('watch')
    expect(router.currentRoute.value.params.key).toBe('lady-eagle-dock-lake-auman')
  })

  it('renders the not-found page for unknown paths', async () => {
    const { wrapper } = await mountApp('/nope')
    expect(wrapper.text()).toContain("We couldn't find that page.")
  })

  it('sets the document title after navigation', async () => {
    const { router } = await mountApp('/')
    await router.push('/about')
    expect(document.title).toBe('About · UrbanWild')
  })
})
