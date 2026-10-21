import { describe, it, expect } from 'vitest'
import { mountApp } from './helpers.js'

async function about() {
  const { wrapper } = await mountApp('/about')
  return wrapper
}

describe('About page', () => {
  it('shows the intro H1', async () => {
    const w = await about()
    expect(w.find('h1').text()).toBe('It started with a turtle.')
  })

  it('renders the caption cards in order', async () => {
    const w = await about()
    const cards = w.findAll('figcaption').map((c) => {
      const spans = c.findAll('span').filter((s) => s.attributes('aria-hidden') !== 'true')
      const leaf = spans.filter((s) => s.findAll('span').length === 0).map((s) => s.text())
      return leaf
    })
    expect(cards).toEqual([
      ['Susan Ballard', 'Making friends with a raven'],
      ['Rex Ballard', 'Filming, with a barn owl riding shotgun'],
      ['Rex Ballard', 'Lining up the shot'],
    ])
  })

  it('lays out caption cards in flow with a 48px overlap and 96px min height', async () => {
    const w = await about()
    for (const c of w.findAll('figcaption')) {
      const cls = c.classes().join(' ')
      expect(cls).toContain('-mt-12')
      expect(cls).toContain('min-h-24')
      expect(cls).toContain('items-center')
      expect(cls).not.toMatch(/\babsolute\b/)
    }
  })

  it('renders all six team entries', async () => {
    const w = await about()
    const text = w.find('main').text()
    for (const s of [
      'Susan & Rex Ballard', 'Founders & producers',
      'Scott Rucci', 'Chief video editor, Rucci Productions',
      'Henry Wong', 'Animation',
      'Andy Poe', 'Video production support',
      'David Franks', 'Website consultant',
      'Andrew Greene', 'Webmaster',
    ]) expect(text).toContain(s)
    expect(w.findAll('[data-team-card]')).toHaveLength(6)
  })

  it('renders sponsors and the mailto link', async () => {
    const w = await about()
    const text = w.find('main').text()
    expect(text).toContain('Founding sponsor')
    expect(text).toContain('Patrick Cusack')
    expect(text).toContain('Production partner')
    expect(text).toContain('Want to support wildlife education in North Carolina?')
    const a = w.findAll('a').find((x) => x.text() === 'Become a sponsor')
    expect(a.attributes('href')).toBe('mailto:urbanwild.wems@gmail.com')
  })

  it('has exactly the expected images', async () => {
    const w = await about()
    expect(w.find('main').findAll('img').map((i) => i.attributes('alt'))).toEqual([
      'Susan smiling with a raven perched on her arm',
      'Rex filming with a barn owl perched on his shoulder',
      'Rex behind a camera on a tripod at the beach',
      'NC Farm Bureau Insurance',
      'Rucci Productions',
    ])
  })

  it('has no Get help content', async () => {
    const w = await about()
    expect(w.find('main').text()).not.toMatch(/get help|rescue guide/i)
  })
})
