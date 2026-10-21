import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { fetchCatalog, fetchEpisode, recordPlay } from '../../src/lib/api.js'
import { resetCatalog } from '../../src/composables/useCatalog.js'
import { WEM_MARK } from '../../src/lib/brand.js'
import { catalog } from './fixtures.js'
import { mountApp } from './helpers.js'

vi.mock('../../src/lib/api.js', () => ({
  fetchCatalog: vi.fn(),
  fetchEpisode: vi.fn(),
  recordPlay: vi.fn(),
}))

const replay = vi.hoisted(() => vi.fn())
vi.mock('../../src/components/VideoPlayer.vue', async () => {
  const { defineComponent, h } = await import('vue')
  return {
    default: defineComponent({
      props: ['videoLink', 'thumbnailUrl', 'title', 'durationLabel', 'autostart'],
      emits: ['ended'],
      setup(props, { emit, expose }) {
        expose({ replay })
        return () => h('button', { 'data-testid': 'end-video', onClick: () => emit('ended') }, 'end')
      },
    }),
  }
})

const KEY = '/episodes/lady-eagle-dock-lake-auman'
const showModal = vi.fn()

beforeEach(() => {
  resetCatalog()
  fetchCatalog.mockReset().mockResolvedValue(catalog)
  fetchEpisode.mockReset().mockImplementation(async (key) => catalog.find((e) => e.key === key) || null)
  recordPlay.mockReset()
  replay.mockReset()
  showModal.mockReset()
  HTMLDialogElement.prototype.showModal = showModal
  HTMLDialogElement.prototype.close = vi.fn()
})

afterEach(() => {
  delete navigator.share
  delete navigator.clipboard
})

describe('Watch details', () => {
  it('renders label, meta, title, tags and page title', async () => {
    const { wrapper } = await mountApp(KEY)
    expect(wrapper.find('[data-testid="wem-label"]').text()).toBe(WEM_MARK)
    expect(wrapper.find('h1').text()).toBe('Lady Eagle Dock - Lake Auman')
    const meta = wrapper.find('[data-testid="meta"]').text()
    expect(meta).toContain('Birds of prey')
    expect(meta).toContain('May 20, 2022')
    expect(meta).toContain('2:36')
    expect(document.title).toBe('Lady Eagle Dock - Lake Auman · On a WEM · UrbanWild')
    const tag = wrapper.findAll('a').find((a) => a.text() === '#bald eagle')
    expect(tag.attributes('href')).toBe('/episodes?q=bald-eagle')
  })

  it('lists Up next in order', async () => {
    const { wrapper } = await mountApp(KEY)
    const titles = wrapper.findAll('[data-testid="up-next-title"]').map((t) => t.text())
    expect(titles).toEqual(["Nina's Chimney Swifts", 'Jimmy the Beaver Goes Free', "Byron's Hawk in the Crepe Myrtle Tree"])
  })

  it('renders the 404 for an unknown key', async () => {
    const { wrapper } = await mountApp('/episodes/does-not-exist')
    expect(wrapper.text()).toContain("We couldn't find that page.")
  })
})

describe('Play recording and end screen', () => {
  it('records once per view, resetting on navigation', async () => {
    const { wrapper, router } = await mountApp(KEY)
    await wrapper.find('[data-testid="end-video"]').trigger('click')
    await wrapper.find('[data-testid="end-video"]').trigger('click')
    expect(recordPlay).toHaveBeenCalledTimes(1)
    expect(recordPlay).toHaveBeenCalledWith(1)
    await router.push('/episodes/ninas-chimney-swifts')
    await flushPromises()
    expect(wrapper.find('[data-testid="end-screen"]').exists()).toBe(false)
    await wrapper.find('[data-testid="end-video"]').trigger('click')
    expect(recordPlay).toHaveBeenCalledTimes(2)
    expect(recordPlay).toHaveBeenLastCalledWith(11)
  })

  it('shows the end screen with next, replay and quote actions', async () => {
    const { wrapper, router } = await mountApp(KEY)
    expect(wrapper.find('[data-testid="end-screen"]').exists()).toBe(false)
    await wrapper.find('[data-testid="end-video"]').trigger('click')
    const end = wrapper.find('[data-testid="end-screen"]')
    expect(end.text()).toContain('Up next')
    expect(end.text()).toContain("Nina's Chimney Swifts")
    expect(end.text()).toContain('This episode is supported by')

    const btn = (label) => end.findAll('button').find((b) => b.text() === label)
    await btn('Replay').trigger('click')
    expect(replay).toHaveBeenCalled()
    expect(wrapper.find('[data-testid="end-screen"]').exists()).toBe(false)

    await wrapper.find('[data-testid="end-video"]').trigger('click')
    await wrapper.find('[data-testid="end-screen"]').findAll('button').find((b) => b.text() === 'Get a free quote').trigger('click')
    await flushPromises()
    expect(showModal).toHaveBeenCalled()

    await wrapper.find('[data-testid="end-screen"]').findAll('button').find((b) => b.text() === 'Play next').trigger('click')
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe('/episodes/ninas-chimney-swifts?autoplay=1')
  })
})

describe('Share', () => {
  const shareBtn = (wrapper) => wrapper.findAll('button').find((b) => b.text().startsWith('Share'))

  it('uses navigator.share when available', async () => {
    const share = vi.fn().mockRejectedValue(new Error('cancelled'))
    Object.defineProperty(navigator, 'share', { value: share, configurable: true })
    const { wrapper } = await mountApp(KEY)
    await shareBtn(wrapper).trigger('click')
    await flushPromises()
    expect(share).toHaveBeenCalledWith({
      title: 'Lady Eagle Dock - Lake Auman',
      url: 'https://urbanwild.tv/episodes/lady-eagle-dock-lake-auman',
    })
  })

  it('copies to the clipboard otherwise', async () => {
    const writeText = vi.fn().mockResolvedValue()
    Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true })
    const { wrapper } = await mountApp(KEY)
    await shareBtn(wrapper).trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith('https://urbanwild.tv/episodes/lady-eagle-dock-lake-auman')
    expect(wrapper.text()).toContain('Link copied')
  })

  it('shows the URL as text when neither works, without throwing', async () => {
    const { wrapper } = await mountApp(KEY)
    await shareBtn(wrapper).trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="share-url"]').text()).toBe(
      'https://urbanwild.tv/episodes/lady-eagle-dock-lake-auman',
    )
  })
})
