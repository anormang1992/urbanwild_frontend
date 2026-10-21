import { computed, ref } from 'vue'

// The Episodes page's search, filter and sort, remembered so an episode's back link
// returns the visitor to the same list.
const lastQuery = ref({})

export function resetEpisodesReturn() {
  lastQuery.value = {}
}

export function useEpisodesReturn() {
  const remember = (query) => {
    lastQuery.value = { ...query }
  }
  const backTo = computed(() => ({ name: 'episodes', query: lastQuery.value }))
  const isFiltered = computed(() => Object.keys(lastQuery.value).length > 0)
  return { remember, backTo, isFiltered }
}
