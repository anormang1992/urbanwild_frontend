<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCatalog } from '../composables/useCatalog.js'
import { fetchEpisode, recordPlay } from '../lib/api.js'
import { DEFAULT_DESCRIPTION, WEM_MARK } from '../lib/brand.js'
import { setPageMeta } from '../lib/head.js'
import { formatDate, formatDuration, tagLabel, upNextFor } from '../lib/episodes.js'
import VideoPlayer from '../components/VideoPlayer.vue'
import LeadFormDialog from '../components/LeadFormDialog.vue'
import EndScreen from '../components/EndScreen.vue'
import ShareButton from '../components/ShareButton.vue'
import UpNextList from '../components/UpNextList.vue'
import NotFoundView from './NotFoundView.vue'

const route = useRoute()
const router = useRouter()
const { episodes, load } = useCatalog()
onMounted(load)

const key = computed(() => String(route.params.key))
const episode = ref(null)
const lookup = ref('loading') // 'loading' | 'found' | 'missing'
const ended = ref(false)
const leadOpen = ref(false)
const player = ref(null)
let playRecorded = false
let token = 0

async function resolve(k) {
  const mine = ++token
  ended.value = false
  leadOpen.value = false
  playRecorded = false
  const cached = episodes.value.find((e) => e.key === k)
  if (cached) {
    episode.value = cached
    lookup.value = 'found'
    return
  }
  episode.value = null
  lookup.value = 'loading'
  let found = null
  try {
    found = await fetchEpisode(k)
  } catch {
    found = null
  }
  if (mine !== token) return
  episode.value = found
  lookup.value = found ? 'found' : 'missing'
}
watch(key, resolve, { immediate: true })

watch(episode, (e) => {
  if (e) {
    setPageMeta({
      title: `${e.title} · On a WEM · UrbanWild`,
      description: e.description || DEFAULT_DESCRIPTION,
    })
  }
})

const upNext = computed(() => (episode.value ? upNextFor(episodes.value, episode.value.id) : []))
const next = computed(() => upNext.value[0] || null)
const shareUrl = computed(() => `https://urbanwild.tv/episodes/${key.value}`)
const autostart = computed(() => route.query.autoplay === '1')

function onEnded() {
  if (!playRecorded) {
    playRecorded = true
    recordPlay(episode.value.id)
  }
  ended.value = true
}
function playNext() {
  router.push({ name: 'watch', params: { key: next.value.key }, query: { autoplay: '1' } })
}
function replay() {
  ended.value = false
  player.value?.replay()
}
</script>

<template>
  <NotFoundView v-if="lookup === 'missing'" />
  <p v-else-if="lookup === 'loading'" role="status" class="mx-auto max-w-[1240px] px-6 py-24 text-lg text-muted">Loading…</p>
  <section v-else class="mx-auto flex max-w-[1240px] flex-col gap-5 px-6 pb-24 pt-6">
    <RouterLink
      :to="{ name: 'episodes' }"
      class="inline-flex min-h-11 items-center gap-2 self-start px-1 font-bold text-green-text no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
      All episodes
    </RouterLink>

    <div class="flex flex-wrap items-start gap-10">
      <div class="flex min-w-0 flex-[999_1_620px] flex-col gap-6">
        <div class="relative">
          <VideoPlayer
            ref="player"
            :video-link="episode.videoLink"
            :thumbnail-url="episode.thumbnailUrl"
            :title="episode.title"
            :duration-label="formatDuration(episode.durationSeconds)"
            :autostart="autostart"
            @ended="onEnded"
          />
          <EndScreen
            v-if="ended"
            :next="next"
            class="rounded-[20px]"
            @play-next="playNext"
            @replay="replay"
            @get-quote="leadOpen = true"
          />
        </div>

        <div class="flex flex-col gap-3">
          <p data-testid="wem-label" class="text-[13px] font-extrabold uppercase tracking-[0.1em] text-green-text">{{ WEM_MARK }}</p>
          <p data-testid="meta" class="flex flex-wrap items-center gap-2.5 text-[15px]">
            <span v-if="episode.animalLabel" class="rounded-full bg-green-soft px-2.5 py-[3px] font-bold text-green-text">{{ episode.animalLabel }}</span>
            <span class="text-muted"
              >{{ formatDate(episode.releasedAt) }}<template v-if="formatDate(episode.releasedAt) && formatDuration(episode.durationSeconds)"> · </template>{{ formatDuration(episode.durationSeconds) }}</span
            >
          </p>
          <h1 class="font-display text-[clamp(30px,3.4vw,42px)] font-extrabold leading-[1.1] tracking-[-0.02em]">{{ episode.title }}</h1>
          <p v-if="episode.description" class="max-w-[46em] text-lg text-text-strong">{{ episode.description }}</p>
          <div v-if="episode.tags.length" class="flex flex-wrap items-center gap-2 pt-1">
            <RouterLink
              v-for="tag in episode.tags"
              :key="tag"
              :to="{ name: 'episodes', query: { q: tag } }"
              class="inline-flex min-h-11 items-center rounded-full border border-line-strong bg-surface px-3 text-sm font-semibold text-text-strong no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
              >#{{ tagLabel(tag) }}</RouterLink
            >
          </div>
          <ShareButton :url="shareUrl" :title="episode.title" />
        </div>
      </div>

      <aside aria-label="Up next" class="flex min-w-0 flex-[1_1_320px] flex-col gap-3.5">
        <h2 class="font-display text-[22px] font-extrabold">Up next</h2>
        <UpNextList :episodes="upNext" />
      </aside>
    </div>

    <LeadFormDialog :open="leadOpen" @close="leadOpen = false" />
  </section>
</template>
