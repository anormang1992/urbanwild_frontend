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

describe('Watch page meta', () => {
  const description = () => document.head.querySelector('meta[name="description"]').getAttribute('content')

  it('sets the title and description when arriving from Home with the catalog cached', async () => {
    const { router } = await mountApp('/')
    expect(document.title).toBe('UrbanWild · Saving the wild, one life at a time')
    await router.push('/episodes/jimmy-the-beaver-goes-free')
    await flushPromises()
    expect(fetchEpisode).not.toHaveBeenCalled()
    expect(document.title).toBe('Jimmy the Beaver Goes Free · On a WEM · UrbanWild')
    expect(description()).toBe(catalog.find((e) => e.key === 'jimmy-the-beaver-goes-free').description)
  })

  it('updates the title when moving between cached episodes', async () => {
    const { router } = await mountApp(KEY)
    await router.push('/episodes/ninas-chimney-swifts')
    await flushPromises()
    expect(document.title).toBe("Nina's Chimney Swifts · On a WEM · UrbanWild")
  })

  it('uses the not-found title when moving to an unknown key', async () => {
    const { wrapper, router } = await mountApp(KEY)
    expect(document.title).toBe('Lady Eagle Dock - Lake Auman · On a WEM · UrbanWild')
    await router.push('/episodes/does-not-exist')
    await flushPromises()
    expect(wrapper.text()).toContain("We couldn't find that page.")
    expect(document.title).toBe('Page not found · UrbanWild')
  })
})

describe('Watch lookup failures', () => {
  const tryAgain = (wrapper) => wrapper.findAll('button').find((b) => b.text() === 'Try again')

  it('shows a retryable error, not the 404, when the API is down', async () => {
    fetchCatalog.mockReset().mockRejectedValueOnce(new Error('down')).mockResolvedValue(catalog)
    fetchEpisode.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    const { wrapper } = await mountApp(KEY)
    expect(wrapper.text()).toContain("We couldn't load the episodes right now.")
    expect(wrapper.text()).not.toContain("We couldn't find that page.")
    expect(document.title).toBe('UrbanWild')

    await tryAgain(wrapper).trigger('click')
    await flushPromises()
    expect(fetchEpisode).toHaveBeenCalledTimes(2)
    expect(wrapper.find('h1').text()).toBe('Lady Eagle Dock - Lake Auman')
    expect(document.title).toBe('Lady Eagle Dock - Lake Auman · On a WEM · UrbanWild')
    expect(wrapper.findAll('[data-testid="up-next-title"]')).toHaveLength(3)
  })

  it('falls back to the catalog when only the episode request fails', async () => {
    fetchEpisode.mockRejectedValueOnce(new TypeError('Failed to fetch'))
    const { wrapper } = await mountApp(KEY)
    expect(wrapper.text()).not.toContain("We couldn't load the episodes right now.")
    expect(wrapper.find('h1').text()).toBe('Lady Eagle Dock - Lake Auman')
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

  const URL_ = 'https://urbanwild.tv/episodes/lady-eagle-dock-lake-auman'
  const stub = (prop, value) => Object.defineProperty(navigator, prop, { value, configurable: true })

  it('uses navigator.share when available', async () => {
    const share = vi.fn().mockResolvedValue()
    stub('share', share)
    const { wrapper } = await mountApp(KEY)
    await shareBtn(wrapper).trigger('click')
    await flushPromises()
    expect(share).toHaveBeenCalledWith({ title: 'Lady Eagle Dock - Lake Auman', url: URL_ })
    expect(wrapper.find('[data-testid="share-url"]').exists()).toBe(false)
  })

  it('shows the URL when the share sheet is cancelled', async () => {
    stub('share', vi.fn().mockRejectedValue(new DOMException('Share canceled', 'AbortError')))
    const writeText = vi.fn().mockResolvedValue()
    stub('clipboard', { writeText })
    const { wrapper } = await mountApp(KEY)
    await shareBtn(wrapper).trigger('click')
    await flushPromises()
    expect(writeText).not.toHaveBeenCalled()
    expect(wrapper.find('[data-testid="share-url"]').text()).toBe(URL_)
  })

  it('falls back to the clipboard when sharing fails for another reason', async () => {
    stub('share', vi.fn().mockRejectedValue(new DOMException('Not allowed', 'NotAllowedError')))
    const writeText = vi.fn().mockResolvedValue()
    stub('clipboard', { writeText })
    const { wrapper } = await mountApp(KEY)
    await shareBtn(wrapper).trigger('click')
    await flushPromises()
    expect(writeText).toHaveBeenCalledWith(URL_)
    expect(wrapper.text()).toContain('Link copied')
    expect(wrapper.find('[data-testid="share-url"]').text()).toBe(URL_)
  })

  it('shows the URL when sharing fails and the clipboard is unavailable', async () => {
    stub('share', vi.fn().mockRejectedValue(new TypeError('share() failed')))
    const { wrapper } = await mountApp(KEY)
    await shareBtn(wrapper).trigger('click')
    await flushPromises()
    expect(wrapper.find('[data-testid="share-url"]').text()).toBe(URL_)
    expect(wrapper.text()).not.toContain('Link copied')
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
