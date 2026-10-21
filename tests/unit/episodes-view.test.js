import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { fetchCatalog } from '../../src/lib/api.js'
import { resetCatalog } from '../../src/composables/useCatalog.js'
import { WEM_MARK } from '../../src/lib/brand.js'
import { catalog } from './fixtures.js'
import { mountApp } from './helpers.js'

vi.mock('../../src/lib/api.js', () => ({ fetchCatalog: vi.fn() }))

beforeEach(() => {
  resetCatalog()
  fetchCatalog.mockReset()
  fetchCatalog.mockResolvedValue(catalog)
})

const gridKeys = (wrapper) =>
  wrapper.findAll('[data-testid="grid"] a').map((a) => a.attributes('href').replace('/episodes/', ''))
const idsFor = (keys) => keys.map((k) => catalog.find((e) => e.key === k).id)

describe('Episodes page', () => {
  it('has the trademark H1 with no space between the lines', async () => {
    const { wrapper } = await mountApp('/episodes')
    const h1 = wrapper.find('h1')
    expect(h1.text()).toBe(WEM_MARK)
    expect(h1.element.textContent).toBe(WEM_MARK)
    expect(h1.element.firstChild.nodeType).toBe(3)
    expect(h1.find('span').text()).toBe('(Wildlife Educational Moment)')
  })

  it('gives the H1 the exact trademark as its accessible name', async () => {
    const { wrapper } = await mountApp('/episodes')
    expect(wrapper.find('h1').attributes('aria-label')).toBe(WEM_MARK)
  })

  it('shows the featured episode above every episode in the default view', async () => {
    const { wrapper } = await mountApp('/episodes')
    const featured = wrapper.find('[data-testid="featured"]')
    expect(featured.text()).toContain('Featured episode')
    expect(featured.text()).toContain('Lady Eagle Dock - Lake Auman')
    featured.findAll('a').forEach((a) => expect(a.attributes('href')).toBe('/episodes/lady-eagle-dock-lake-auman'))
    expect(featured.text()).toContain('Play episode')
    expect(wrapper.find('[data-testid="results-heading"]').text()).toBe('All episodes')
    expect(idsFor(gridKeys(wrapper))).toEqual([11, 8, 6, 1])
  })

  it('falls back to the newest episode when none is flagged featured', async () => {
    fetchCatalog.mockResolvedValue(catalog.map((e) => ({ ...e, featured: false })))
    const { wrapper } = await mountApp('/episodes')
    expect(wrapper.find('[data-testid="featured"]').text()).toContain("Nina's Chimney Swifts")
  })

  it('keeps the featured episode in place while filtering', async () => {
    const { wrapper } = await mountApp('/episodes')
    const chip = wrapper.findAll('[role="group"] button').find((c) => c.text().startsWith('Small mammals'))
    await chip.trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="featured"]').text()).toContain('Lady Eagle Dock - Lake Auman')
    expect(idsFor(gridKeys(wrapper))).toEqual([8])
  })

  it('searches and updates the URL', async () => {
    const { wrapper, router } = await mountApp('/episodes')
    await wrapper.find('input[type="search"]').setValue('eagle')
    await flushPromises()
    expect(router.currentRoute.value.query.q).toBe('eagle')
    expect(wrapper.find('[data-testid="featured"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="results-heading"]').text()).toBe('1 episode for “eagle”')
  })

  it('filters by animal chip', async () => {
    const { wrapper, router } = await mountApp('/episodes')
    const chips = wrapper.findAll('[role="group"] button')
    expect(chips.some((c) => c.text().startsWith('Reptiles'))).toBe(false)
    const chip = chips.find((c) => c.text().startsWith('Birds of prey'))
    await chip.trigger('click')
    await flushPromises()
    expect(chip.attributes('aria-pressed')).toBe('true')
    expect(router.currentRoute.value.query.animal).toBe('birds-of-prey')
    expect(wrapper.findAll('[data-testid="grid"] a')).toHaveLength(2)
  })

  it('sorts by most watched', async () => {
    const { wrapper, router } = await mountApp('/episodes')
    await wrapper.find('select').setValue('popular')
    await flushPromises()
    expect(router.currentRoute.value.query.sort).toBe('popular')
    expect(idsFor(gridKeys(wrapper))).toEqual([1, 11, 8, 6])
  })

  it('treats unknown query values as defaults', async () => {
    const { wrapper } = await mountApp('/episodes?animal=dragons&sort=zzz')
    expect(wrapper.find('[data-testid="results-heading"]').text()).toBe('All episodes')
  })

  it('shows an empty state and clears filters', async () => {
    const { wrapper, router } = await mountApp('/episodes?q=zzz')
    expect(wrapper.text()).toContain('Rats! Nothing matched that search.')
    const clear = wrapper.findAll('button').find((b) => b.text() === 'Clear filters')
    await clear.trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.query).toEqual({})
    expect(wrapper.find('[data-testid="results-heading"]').text()).toBe('All episodes')
  })

  it('shows Loading, not the empty state, while the catalog is pending', async () => {
    fetchCatalog.mockReturnValue(new Promise(() => {}))
    const { wrapper } = await mountApp('/episodes')
    expect(wrapper.text()).toContain('Loading episodes…')
    expect(wrapper.text()).not.toContain('Rats! Nothing matched that search.')
    expect(wrapper.find('[data-testid="results-heading"]').exists()).toBe(false)
  })

  it('shows an error with a working Try again', async () => {
    fetchCatalog.mockReset()
    fetchCatalog.mockRejectedValueOnce(new Error('down')).mockResolvedValue(catalog)
    const { wrapper } = await mountApp('/episodes')
    expect(wrapper.text()).toContain("We couldn't load the episodes right now.")
    expect(wrapper.text()).not.toContain('Rats! Nothing matched that search.')
    await wrapper.findAll('button').find((b) => b.text() === 'Try again').trigger('click')
    await flushPromises()
    expect(wrapper.findAll('[data-testid="grid"] a')).toHaveLength(4)
    expect(wrapper.text()).not.toContain("We couldn't load")
  })
})
