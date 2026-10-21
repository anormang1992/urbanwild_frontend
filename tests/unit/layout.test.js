import { beforeEach, describe, it, expect, vi } from 'vitest'
import { fetchCatalog, fetchEpisode } from '../../src/lib/api.js'
import { resetCatalog } from '../../src/composables/useCatalog.js'
import { WEM_MARK } from '../../src/lib/brand.js'
import { catalog } from './fixtures.js'
import { mountApp } from './helpers.js'

vi.mock('../../src/lib/api.js', () => ({
  fetchCatalog: vi.fn(),
  fetchEpisode: vi.fn(),
  recordPlay: vi.fn(),
}))

beforeEach(() => {
  resetCatalog()
  fetchCatalog.mockReset().mockResolvedValue(catalog)
  fetchEpisode.mockReset().mockResolvedValue(null)
})

describe('layout', () => {
  it('exposes the exact trademark phrase', () => {
    expect(WEM_MARK).toBe('On a WEM(Wildlife Educational Moment)')
  })

  it('renders the same footer with the trademark line on every route', async () => {
    const htmls = []
    for (const path of ['/', '/episodes', '/about']) {
      const { wrapper } = await mountApp(path)
      const footer = wrapper.find('footer')
      expect(footer.text()).toContain(
        'On a WEM(Wildlife Educational Moment) is a registered trademark of Ballard Productions LLC.',
      )
      htmls.push(footer.html())
    }
    expect(htmls[1]).toBe(htmls[0])
    expect(htmls[2]).toBe(htmls[0])
  })

  it('marks the current section in the nav', async () => {
    let { wrapper } = await mountApp('/episodes/anything')
    const link = (w, text) => w.findAll('header nav a').find((a) => a.text() === text)
    expect(link(wrapper, 'Episodes').attributes('aria-current')).toBe('page')
    expect(link(wrapper, 'About').attributes('aria-current')).toBeUndefined()
    ;({ wrapper } = await mountApp('/about'))
    expect(link(wrapper, 'About').attributes('aria-current')).toBe('page')
  })

  it('has exactly two header nav links', async () => {
    const { wrapper } = await mountApp('/')
    expect(wrapper.findAll('header nav a')).toHaveLength(2)
  })

  it('has no Get help content in header or footer', async () => {
    const { wrapper } = await mountApp('/')
    expect(wrapper.find('header').text()).not.toMatch(/get help|rescue guide/i)
    expect(wrapper.find('footer').text()).not.toMatch(/get help|rescue guide/i)
  })

  it('has a skip link to #main', async () => {
    const { wrapper } = await mountApp('/')
    expect(wrapper.find('a[href="#main"]').exists()).toBe(true)
  })
})
