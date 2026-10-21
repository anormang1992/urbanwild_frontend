import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createMemoryHistory } from 'vue-router'
import { createAppRouter } from '../../src/router.js'
import { fetchCatalog } from '../../src/lib/api.js'
import { resetCatalog } from '../../src/composables/useCatalog.js'
import EpisodeCard from '../../src/components/EpisodeCard.vue'
import { catalog } from './fixtures.js'
import { mountApp } from './helpers.js'

vi.mock('../../src/lib/api.js', () => ({ fetchCatalog: vi.fn() }))

beforeEach(() => {
  resetCatalog()
  fetchCatalog.mockReset()
  fetchCatalog.mockResolvedValue(catalog)
})

describe('Home', () => {
  it('shows the featured episode as a link to its Watch page', async () => {
    const { wrapper } = await mountApp('/')
    const link = wrapper.find('[data-testid="featured"]')
    expect(link.attributes('href')).toBe('/episodes/lady-eagle-dock-lake-auman')
    expect(link.text()).toContain('Featured episode')
    expect(link.text()).toContain('Lady Eagle Dock - Lake Auman')
  })

  it('lists the three newest other episodes in order', async () => {
    const { wrapper } = await mountApp('/')
    const titles = wrapper.findAll('[data-testid="latest"] [data-testid="card-title"]').map((t) => t.text())
    expect(titles).toEqual(["Nina's Chimney Swifts", 'Jimmy the Beaver Goes Free', "Byron's Hawk in the Crepe Myrtle Tree"])
  })

  it('has exactly one See all link in main', async () => {
    const { wrapper } = await mountApp('/')
    const links = wrapper.find('main').findAll('a[href="/episodes"]')
    expect(links).toHaveLength(1)
    expect(links[0].text()).toContain('See all 4 episodes')
  })

  it('has no buttons in the hero', async () => {
    const { wrapper } = await mountApp('/')
    const hero = wrapper.find('[data-testid="hero"]')
    expect(hero.exists()).toBe(true)
    expect(hero.find('button').exists()).toBe(false)
  })

  it('shows an error with a working Try again', async () => {
    fetchCatalog.mockReset()
    fetchCatalog.mockRejectedValueOnce(new Error('down')).mockResolvedValue(catalog)
    const { wrapper } = await mountApp('/')
    expect(wrapper.text()).toContain("We couldn't load the episodes right now.")
    expect(wrapper.find('[data-testid="featured"]').exists()).toBe(false)
    const retry = wrapper.findAll('button').find((b) => b.text() === 'Try again')
    await retry.trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="featured"]').exists()).toBe(true)
    expect(wrapper.text()).not.toContain("We couldn't load")
  })

  it('shows Loading episodes while the first load is pending', async () => {
    fetchCatalog.mockReset()
    fetchCatalog.mockReturnValue(new Promise(() => {}))
    const { wrapper } = await mountApp('/')
    expect(wrapper.text()).toContain('Loading episodes…')
  })
})

describe('EpisodeCard', () => {
  async function mountCard(episode) {
    const router = createAppRouter(createMemoryHistory())
    await router.push('/')
    return mount(EpisodeCard, { props: { episode }, global: { plugins: [router] } })
  }

  it('renders a lazy 16:9 thumbnail, duration, chip and title in one link, with no date', async () => {
    const w = await mountCard(catalog[3])
    expect(w.findAll('a')).toHaveLength(1)
    const img = w.find('img')
    expect(img.attributes('loading')).toBe('lazy')
    expect(img.attributes('src')).toContain('-d_640')
    expect(w.text()).toContain('2:36')
    expect(w.text()).toContain('Birds of prey')
    expect(w.text()).not.toContain('May 20, 2022')
  })

  it('renders a placeholder, not an img, when there is no thumbnail', async () => {
    const w = await mountCard({ ...catalog[0], thumbnailUrl: '' })
    expect(w.find('[data-testid=thumb-placeholder]').exists()).toBe(true)
    expect(w.find('img').exists()).toBe(false)
  })
})
