import { test, expect } from 'vitest'
import { catalog } from './fixtures.js'
import {
  formatDuration, thumbnailAt, sortEpisodes, filterEpisodes, animalOptions,
  pickFeatured, latestEpisodes, upNextFor, isDefaultView, resultsHeading,
} from '../../src/lib/episodes.js'

const ids = list => list.map(e => e.id)

test('maps raw API episodes', () => {
  const eagle = catalog.find(e => e.id === 1)
  expect(eagle.animalLabel).toBe('Birds of prey')
  expect(eagle.releasedAt).toEqual(new Date('2022-05-20T00:00:00Z'))
  expect(catalog[0].description).toBe('')
})
test('formats durations', () => {
  expect(formatDuration(156)).toBe('2:36'); expect(formatDuration(350)).toBe('5:50'); expect(formatDuration(null)).toBe('')
})
test('resizes Vimeo thumbnails', () => {
  expect(thumbnailAt('https://i.vimeocdn.com/video/1-abc-d_1280?region=us', 640)).toBe('https://i.vimeocdn.com/video/1-abc-d_640?region=us')
  expect(thumbnailAt('', 640)).toBe('')
})
test('sorts', () => {
  expect(ids(sortEpisodes(catalog, 'newest'))).toEqual([11, 8, 6, 1])
  expect(ids(sortEpisodes(catalog, 'oldest'))).toEqual([1, 6, 8, 11])
  expect(ids(sortEpisodes(catalog, 'popular'))).toEqual([1, 11, 8, 6])
  expect(ids(sortEpisodes(catalog, 'title'))).toEqual([6, 8, 1, 11])
})
test('undated episodes sort last both ways', () => {
  const list = [...catalog, { ...catalog[1], id: 99, releasedAt: null }]
  expect(ids(sortEpisodes(list, 'newest')).at(-1)).toBe(99)
  expect(ids(sortEpisodes(list, 'oldest')).at(-1)).toBe(99)
})
test('filters by text, tags and animal', () => {
  expect(ids(filterEpisodes(catalog, { q: 'EAGLE' }))).toEqual([1])
  expect(ids(filterEpisodes(catalog, { q: '  red tailed ' }))).toEqual([6])
  expect(filterEpisodes(catalog, { q: '  (eagle ' })).toEqual([])
  expect(ids(filterEpisodes(catalog, { animal: 'birds-of-prey' }))).toEqual([6, 1])
})
test('animal options only list classes present', () => {
  expect(animalOptions(catalog)).toEqual([
    { id: 'all', label: 'All', count: 4 }, { id: 'birds', label: 'Birds', count: 1 },
    { id: 'birds-of-prey', label: 'Birds of prey', count: 2 }, { id: 'small-mammals', label: 'Small mammals', count: 1 }])
})
test('featured, latest and up next', () => {
  expect(pickFeatured(catalog).id).toBe(1)
  expect(pickFeatured(catalog.map(e => ({ ...e, featured: false }))).id).toBe(11)
  expect(ids(latestEpisodes(catalog, { exclude: pickFeatured(catalog) }))).toEqual([11, 8, 6])
  expect(ids(upNextFor(catalog, 8))).toEqual([6, 1, 11])
  expect(ids(upNextFor(catalog, 1))).toEqual([11, 8, 6])
})
test('view helpers', () => {
  expect(isDefaultView({ q: '', animal: 'all', sort: 'newest' })).toBe(true)
  expect(isDefaultView({ q: '', animal: 'all', sort: 'oldest' })).toBe(false)
  expect(resultsHeading({ count: 3, q: '', isDefault: true })).toBe('All episodes')
  expect(resultsHeading({ count: 1, q: '', isDefault: false })).toBe('1 episode')
  expect(resultsHeading({ count: 2, q: 'eagle', isDefault: false })).toBe('2 episodes for “eagle”')
})
