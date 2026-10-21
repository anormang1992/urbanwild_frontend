<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalog } from '../composables/useCatalog.js'
import { WEM_MARK } from '../lib/brand.js'
import {
  ANIMALS,
  SORTS,
  sortEpisodes,
  filterEpisodes,
  animalOptions,
  isDefaultView,
  pickFeatured,
  resultsHeading,
  formatDate,
  formatDuration,
  thumbnailAt,
} from '../lib/episodes.js'
import EpisodeCard from '../components/EpisodeCard.vue'
import CatalogStatus from '../components/CatalogStatus.vue'

const route = useRoute()
const router = useRouter()
const { episodes, status, load, reload } = useCatalog()
onMounted(load)

const markMain = WEM_MARK.slice(0, WEM_MARK.indexOf('('))
const markSub = WEM_MARK.slice(WEM_MARK.indexOf('('))

const first = (v) => (Array.isArray(v) ? v[0] : v)
const q = computed(() => {
  const v = first(route.query.q)
  return typeof v === 'string' ? v : ''
})
const animal = computed(() => {
  const v = first(route.query.animal)
  return ANIMALS.some((a) => a.id === v) ? v : 'all'
})
const sort = computed(() => {
  const v = first(route.query.sort)
  return SORTS.some((s) => s.id === v) ? v : 'newest'
})

function update(patch) {
  const next = { q: q.value, animal: animal.value, sort: sort.value, ...patch }
  const query = {}
  if (next.q.trim() !== '') query.q = next.q
  if (next.animal !== 'all') query.animal = next.animal
  if (next.sort !== 'newest') query.sort = next.sort
  router.replace({ query })
}
const clearFilters = () => router.replace({ query: {} })

const isDefault = computed(() => isDefaultView({ q: q.value.trim(), animal: animal.value, sort: sort.value }))
const chips = computed(() => animalOptions(episodes.value))
const results = computed(() =>
  sortEpisodes(filterEpisodes(episodes.value, { q: q.value, animal: animal.value }), sort.value),
)
// The featured episode stays put whatever the filters, and is also listed in the grid,
// so filtering never makes the page jump.
const featured = computed(() => pickFeatured(episodes.value))
const grid = results
const heading = computed(() =>
  resultsHeading({ count: results.value.length, q: q.value, isDefault: isDefault.value }),
)
// Keep showing episodes during a reload; with none yet, anything but 'ready' (idle, loading, error)
// shows the status instead of an empty grid.
const statusMessage = computed(() => {
  if (episodes.value.length || status.value === 'ready') return ''
  return status.value === 'error' ? 'error' : 'loading'
})
</script>

<template>
  <section class="bg-forest text-white">
    <div class="mx-auto flex max-w-[1240px] flex-col gap-9 px-6 pb-16 pt-14">
      <div class="flex max-w-[760px] flex-col gap-2.5">
        <h1 :aria-label="WEM_MARK" class="font-display text-[clamp(44px,5.4vw,68px)] font-extrabold leading-[1.02] tracking-[-0.025em]">{{ markMain }}<span class="mt-2 block text-[0.42em] font-bold tracking-[-0.01em] text-leaf">{{ markSub }}</span></h1>
        <p class="text-[19px] text-on-forest">
          Short films about the animals in your backyard, made alongside the licensed rehabilitators who care for them.
        </p>
      </div>

      <div
        v-if="featured"
        data-testid="featured"
        class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-8"
      >
        <RouterLink
          :to="{ name: 'watch', params: { key: featured.key } }"
          :aria-label="`Play ${featured.title}`"
          class="relative block aspect-video overflow-hidden rounded-[22px] bg-[#0b1712] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-leaf"
        >
          <img
            v-if="featured.thumbnailUrl"
            :src="thumbnailAt(featured.thumbnailUrl, 960)"
            alt=""
            class="absolute inset-0 block h-full w-full object-cover"
          />
          <span class="absolute inset-0 flex items-center justify-center bg-[#0b1712]/20">
            <span class="flex size-21 items-center justify-center rounded-full bg-white text-ink">
              <svg width="30" height="30" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
            </span>
          </span>
          <span
            v-if="formatDuration(featured.durationSeconds)"
            class="absolute bottom-3.5 right-3.5 rounded-lg bg-[#0b1712]/90 px-2.5 py-1 text-sm font-bold text-white"
            >{{ formatDuration(featured.durationSeconds) }}</span
          >
        </RouterLink>
        <div class="flex flex-col gap-4">
          <p class="flex flex-wrap items-center gap-2.5 text-sm">
            <span class="rounded-full bg-leaf px-3 py-1 font-extrabold text-forest">Featured episode</span>
            <span class="text-on-forest"
              >{{ formatDate(featured.releasedAt) }}<template v-if="formatDate(featured.releasedAt) && featured.animalLabel"> · </template>{{ featured.animalLabel }}</span
            >
          </p>
          <h2 class="font-display text-[44px] font-extrabold leading-[1.05] tracking-[-0.02em]">{{ featured.title }}</h2>
          <RouterLink
            :to="{ name: 'watch', params: { key: featured.key } }"
            class="inline-flex min-h-13 items-center gap-2.5 self-start rounded-full bg-white px-6.5 font-bold text-forest no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
            Play episode
          </RouterLink>
        </div>
      </div>
    </div>
  </section>

  <section class="mx-auto flex max-w-[1240px] flex-col gap-7 px-6 pb-24 pt-10">
    <div class="flex flex-wrap items-center gap-4">
      <div class="relative max-w-[420px] flex-[1_1_280px]">
        <label for="ep-search" class="absolute size-px overflow-hidden whitespace-nowrap [clip:rect(0,0,0,0)]">Search episodes</label>
        <span class="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 text-muted">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></svg>
        </span>
        <input
          id="ep-search"
          type="search"
          placeholder="Search eagles, beavers, rescue…"
          :value="q"
          class="box-border h-12 w-full rounded-full border-[1.5px] border-line-strong bg-surface pl-11 pr-4 text-base text-ink placeholder:text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
          @input="update({ q: $event.target.value })"
        />
      </div>
      <div role="group" aria-label="Filter by animal" class="flex flex-[1_1_auto] flex-wrap gap-2">
        <button
          v-for="chip in chips"
          :key="chip.id"
          type="button"
          :aria-pressed="animal === chip.id ? 'true' : 'false'"
          class="min-h-11 cursor-pointer rounded-full border-[1.5px] px-4 text-[15px] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
          :class="animal === chip.id ? 'border-ink bg-ink text-white' : 'border-line-strong bg-surface text-ink'"
          @click="update({ animal: chip.id })"
        >
          {{ chip.label }} <span class="font-semibold opacity-75">{{ chip.count }}</span>
        </button>
      </div>
      <div class="flex items-center gap-2">
        <label for="ep-sort" class="text-[15px] font-semibold text-muted">Sort</label>
        <select
          id="ep-sort"
          :value="sort"
          class="h-11 rounded-full border-[1.5px] border-line-strong bg-surface px-3.5 text-[15px] font-semibold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
          @change="update({ sort: $event.target.value })"
        >
          <option v-for="s in SORTS" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
      </div>
    </div>

    <CatalogStatus v-if="statusMessage" :status="statusMessage" @retry="reload" />
    <template v-else>
      <h2 data-testid="results-heading" class="mt-2 font-display text-[28px] font-extrabold leading-[1.2]">{{ heading }}</h2>
      <div
        v-if="results.length"
        data-testid="grid"
        class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,280px),1fr))] gap-x-6 gap-y-8"
      >
        <EpisodeCard v-for="episode in grid" :key="episode.id" :episode="episode" />
      </div>
      <div
        v-else
        class="flex flex-col items-center gap-3 rounded-3xl border-[1.5px] border-dashed border-line-strong px-6 py-16 text-center"
      >
        <p class="font-display text-[26px] font-extrabold">Rats! Nothing matched that search.</p>
        <p class="text-muted">Try another animal, or clear your filters to see every episode.</p>
        <button
          type="button"
          class="min-h-11 cursor-pointer rounded-full border-[1.5px] border-ink bg-surface px-5 font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
          @click="clearFilters"
        >
          Clear filters
        </button>
      </div>
    </template>
  </section>
</template>
