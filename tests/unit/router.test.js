import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { afterEach, describe, it, expect, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
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

  it('sets a per-route canonical link after navigation', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/about')
    const canonical = () => document.head.querySelectorAll('link[rel="canonical"]')
    expect(canonical()).toHaveLength(1)
    expect(canonical()[0].getAttribute('href')).toBe('https://urbanwild.tv/about')
    await router.push('/episodes/lady-eagle-dock-lake-auman?autoplay=1')
    expect(canonical()).toHaveLength(1)
    expect(canonical()[0].getAttribute('href')).toBe('https://urbanwild.tv/episodes/lady-eagle-dock-lake-auman')
    await router.push('/')
    expect(canonical()[0].getAttribute('href')).toBe('https://urbanwild.tv/')
  })

  it('index.html has no site-wide og:url or canonical', () => {
    const html = readFileSync(resolve(import.meta.dirname, '../../index.html'), 'utf8')
    expect(html).not.toMatch(/og:url/)
    expect(html).not.toMatch(/rel="canonical"/)
  })
})

describe('scroll behavior', () => {
  afterEach(() => vi.restoreAllMocks())

  it('does not scroll on a query-only navigation', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/episodes')
    await flushPromises()
    const scrollTo = vi.spyOn(window, 'scrollTo')
    await router.replace({ query: { q: 'eagle' } })
    await router.replace({ query: { q: 'eagle', sort: 'oldest' } })
    await flushPromises()
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('scrolls to the top when the path changes', async () => {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/episodes?q=eagle')
    await flushPromises()
    const scrollTo = vi.spyOn(window, 'scrollTo')
    await router.push('/about')
    await flushPromises()
    expect(scrollTo).toHaveBeenCalledTimes(1)
  })

  it('restores a saved position and returns false for same-path changes', () => {
    const { scrollBehavior } = createAppRouter(createMemoryHistory()).options
    const at = (path) => ({ path })
    expect(scrollBehavior(at('/episodes'), at('/episodes'), null)).toBe(false)
    expect(scrollBehavior(at('/about'), at('/episodes'), null)).toEqual({ top: 0 })
    expect(scrollBehavior(at('/episodes'), at('/episodes'), { left: 0, top: 500 })).toEqual({ left: 0, top: 500 })
  })
})
