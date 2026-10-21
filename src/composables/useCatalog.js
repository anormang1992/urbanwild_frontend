import { ref } from 'vue'
import { fetchCatalog } from '../lib/api.js'

const episodes = ref([])
const status = ref('idle')
let inflight = null

function fetchInto() {
  status.value = 'loading'
  const p = fetchCatalog()
    .then(list => {
      if (inflight !== p) return
      episodes.value = list
      status.value = 'ready'
    })
    .catch(() => {
      if (inflight !== p) return
      status.value = 'error'
    })
    .finally(() => {
      if (inflight === p) inflight = null
    })
  inflight = p
  return p
}

function load() {
  if (inflight) return inflight
  if (status.value === 'ready') return Promise.resolve()
  return fetchInto()
}

function reload() {
  return fetchInto()
}

export function resetCatalog() {
  episodes.value = []
  status.value = 'idle'
  inflight = null
}

export function useCatalog() {
  return { episodes, status, load, reload }
}
