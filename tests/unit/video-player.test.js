import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'

const players = vi.hoisted(() => [])
vi.mock('@vimeo/player', () => ({
  default: class FakePlayer {
    constructor(el) {
      this.el = el
      this.handlers = {}
      this.setCurrentTime = vi.fn(() => Promise.resolve(0))
      this.play = vi.fn(() => Promise.resolve())
      this.destroy = vi.fn(() => Promise.resolve())
      players.push(this)
    }
    on(name, cb) {
      this.handlers[name] = cb
    }
  },
}))

import VideoPlayer from '../../src/components/VideoPlayer.vue'
import { embedUrl } from '../../src/lib/vimeo.js'

const LINK = 'https://player.vimeo.com/video/693713363?h=6cff38f7a4'
const props = {
  videoLink: LINK,
  thumbnailUrl: 'https://i.vimeocdn.com/video/1-abc-d_640?region=us',
  title: 'Lady Eagle Dock - Lake Auman',
  durationLabel: '2:10',
}
const make = (extra = {}) => mount(VideoPlayer, { props: { ...props, ...extra }, attachTo: document.body })

beforeEach(() => {
  players.length = 0
})

describe('embedUrl', () => {
  it('keeps h and adds the display params', () => {
    expect(embedUrl(LINK)).toBe('https://player.vimeo.com/video/693713363?h=6cff38f7a4&title=0&byline=0&portrait=0')
  })
  it('adds autoplay last', () => {
    expect(embedUrl(LINK, { autoplay: true })).toBe(
      'https://player.vimeo.com/video/693713363?h=6cff38f7a4&title=0&byline=0&portrait=0&autoplay=1',
    )
  })
})

describe('VideoPlayer', () => {
  it('shows the poster before play', () => {
    const w = make()
    expect(w.get('img').attributes('src')).toMatch(/-d_1280\?region=us$/)
    expect(w.find('iframe').exists()).toBe(false)
    expect(w.get('button').attributes('aria-label')).toBe('Play Lady Eagle Dock - Lake Auman')
    expect(w.text()).toContain('2:10')
  })

  it('loads the iframe and a Player on click', async () => {
    const w = make()
    await w.get('button').trigger('click')
    await flushPromises()
    const iframe = w.get('iframe')
    expect(iframe.attributes('src')).toContain('h=6cff38f7a4')
    expect(iframe.attributes('src')).toContain('autoplay=1')
    expect(players).toHaveLength(1)
    expect(players[0].el).toBe(iframe.element)
  })

  it('emits ended', async () => {
    const w = make({ autostart: true })
    await flushPromises()
    players[0].handlers.ended()
    expect(w.emitted('ended')).toHaveLength(1)
  })

  it('renders the iframe immediately with autostart', async () => {
    const w = make({ autostart: true })
    await flushPromises()
    expect(w.find('iframe').exists()).toBe(true)
    expect(players).toHaveLength(1)
  })

  it('shows a placeholder, not an img, without a thumbnail', () => {
    const w = make({ thumbnailUrl: '' })
    expect(w.find('img').exists()).toBe(false)
    expect(w.find('[data-testid="poster-placeholder"]').exists()).toBe(true)
  })

  it('replay seeks to 0 then plays', async () => {
    const w = make({ autostart: true })
    await flushPromises()
    await w.vm.replay()
    expect(players[0].setCurrentTime).toHaveBeenCalledWith(0)
    expect(players[0].play).toHaveBeenCalled()
    expect(players[0].setCurrentTime.mock.invocationCallOrder[0]).toBeLessThan(players[0].play.mock.invocationCallOrder[0])
  })

  it('destroys the player on unmount', async () => {
    const w = make({ autostart: true })
    await flushPromises()
    w.unmount()
    expect(players[0].destroy).toHaveBeenCalled()
  })

  it('rebuilds the player when videoLink changes', async () => {
    const w = make({ autostart: true })
    await flushPromises()
    const old = players[0]
    const B = 'https://player.vimeo.com/video/111222333?h=bbbb'
    await w.setProps({ videoLink: B })
    await flushPromises()
    expect(old.destroy).toHaveBeenCalled()
    expect(players).toHaveLength(2)
    const iframe = w.get('iframe')
    expect(iframe.attributes('src')).toContain('111222333')
    expect(players[1].el).toBe(iframe.element)
    players[1].handlers.ended()
    expect(w.emitted('ended')).toHaveLength(1)

    await w.setProps({ videoLink: 'https://player.vimeo.com/video/444555666?h=cccc', autostart: false })
    await flushPromises()
    expect(players[1].destroy).toHaveBeenCalled()
    expect(w.find('iframe').exists()).toBe(false)
    expect(w.find('img').exists()).toBe(true)
  })

  it('replay never rejects', async () => {
    const w = make({ autostart: true })
    await flushPromises()
    players[0].play = vi.fn(() => Promise.reject(new Error('NotAllowedError')))
    await expect(w.vm.replay()).resolves.toBeUndefined()
  })
})
