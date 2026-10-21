export const ANIMALS = [
  { id: 'birds', value: 'Bird', label: 'Birds' },
  { id: 'birds-of-prey', value: 'Raptor', label: 'Birds of prey' },
  { id: 'small-mammals', value: 'Mammal, Small', label: 'Small mammals' },
  { id: 'large-mammals', value: 'Mammal, Large', label: 'Large mammals' },
  { id: 'reptiles', value: 'Reptile', label: 'Reptiles' },
  { id: 'amphibians', value: 'Amphibian', label: 'Amphibians' },
  { id: 'fish', value: 'Fish', label: 'Fish' },
]

export const SORTS = [
  { id: 'newest', label: 'Newest first' },
  { id: 'oldest', label: 'Oldest first' },
  { id: 'popular', label: 'Most watched' },
  { id: 'title', label: 'A to Z' },
]

export function toEpisode(raw) {
  const animal = ANIMALS.find(a => a.value === raw.animal_class)
  const released = raw.released_at ? new Date(raw.released_at) : null
  return {
    id: raw.id,
    key: raw.key,
    title: raw.title,
    description: raw.description || '',
    videoLink: raw.video_link,
    animalId: animal ? animal.id : null,
    animalLabel: animal ? animal.label : '',
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    playCount: Number(raw.play_count) || 0,
    releasedAt: released && !Number.isNaN(released.getTime()) ? released : null,
    durationSeconds: typeof raw.duration === 'number' ? raw.duration : null,
    thumbnailUrl: raw.thumbnail_url || '',
    featured: Boolean(raw.featured),
  }
}

export function formatDuration(seconds) {
  if (seconds == null || Number.isNaN(seconds)) return ''
  const total = Math.round(seconds)
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`
}

const dateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
export function formatDate(date) {
  return date ? dateFormat.format(date) : ''
}

export function thumbnailAt(url, width) {
  return url ? url.replace(/-d_\d+/, `-d_${width}`) : ''
}

export function tagLabel(slug) {
  return String(slug).replace(/-/g, ' ')
}

const time = e => e.releasedAt.getTime()
const byIdDesc = (a, b) => b.id - a.id

function byDate(dir) {
  return (a, b) => {
    if (!a.releasedAt && !b.releasedAt) return byIdDesc(a, b)
    if (!a.releasedAt) return 1
    if (!b.releasedAt) return -1
    return dir * (time(a) - time(b)) || byIdDesc(a, b)
  }
}

export function sortEpisodes(list, sortId) {
  const copy = [...list]
  switch (sortId) {
    case 'oldest': return copy.sort(byDate(1))
    case 'popular': return copy.sort((a, b) => b.playCount - a.playCount || byIdDesc(a, b))
    case 'title': return copy.sort((a, b) => a.title.localeCompare(b.title, 'en', { sensitivity: 'base' }) || byIdDesc(a, b))
    default: return copy.sort(byDate(-1))
  }
}

export function filterEpisodes(list, { q = '', animal = 'all' } = {}) {
  const needle = q.trim().toLowerCase()
  return list.filter(e => {
    if (animal !== 'all' && e.animalId !== animal) return false
    if (!needle) return true
    const haystack = [e.title, e.description, e.animalLabel, ...e.tags, ...e.tags.map(tagLabel)]
    return haystack.some(s => s.toLowerCase().includes(needle))
  })
}

export function animalOptions(list) {
  const options = [{ id: 'all', label: 'All', count: list.length }]
  for (const a of ANIMALS) {
    const count = list.filter(e => e.animalId === a.id).length
    if (count > 0) options.push({ id: a.id, label: a.label, count })
  }
  return options
}

export function pickFeatured(list) {
  const newest = sortEpisodes(list, 'newest')
  return newest.find(e => e.featured) || newest[0] || null
}

export function latestEpisodes(list, { exclude = null, count = 3 } = {}) {
  return sortEpisodes(list, 'newest').filter(e => !exclude || e.id !== exclude.id).slice(0, count)
}

export function upNextFor(list, currentId) {
  const newest = sortEpisodes(list, 'newest')
  const index = newest.findIndex(e => e.id === currentId)
  if (index === -1) return newest
  return [...newest.slice(index + 1), ...newest.slice(0, index)]
}

export function isDefaultView({ q, animal, sort }) {
  return q === '' && animal === 'all' && sort === 'newest'
}

export function resultsHeading({ count, q, isDefault }) {
  if (isDefault) return 'More episodes'
  const base = `${count} ${count === 1 ? 'episode' : 'episodes'}`
  const term = (q || '').trim()
  return term ? `${base} for “${term}”` : base
}
