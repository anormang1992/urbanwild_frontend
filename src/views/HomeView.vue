<script setup>
import { computed, onMounted } from 'vue'
import { useCatalog } from '../composables/useCatalog.js'
import { pickFeatured, latestEpisodes, formatDate, formatDuration, thumbnailAt } from '../lib/episodes.js'
import EpisodeCard from '../components/EpisodeCard.vue'
import CatalogStatus from '../components/CatalogStatus.vue'
import rexOwl from '../assets/about/rex-owl.webp'
import farmBureau from '../assets/sponsors/farm-bureau.webp'

const { episodes, status, load, reload } = useCatalog()
onMounted(load)

const featured = computed(() => pickFeatured(episodes.value))
const latest = computed(() => latestEpisodes(episodes.value, { exclude: featured.value, count: 3 }))
// Keep showing episodes during a reload; only show "Loading" when there are none yet.
const shownStatus = computed(() => (episodes.value.length ? 'ready' : status.value))
const statusMessage = computed(() => (shownStatus.value === 'loading' || shownStatus.value === 'error' ? shownStatus.value : ''))
</script>

<template>
  <section
    data-testid="hero"
    class="mx-auto grid max-w-[1240px] items-center gap-14 px-6 pb-22 pt-18 md:grid-cols-2"
  >
    <div class="flex flex-col gap-6.5">
      <p class="self-start rounded-full bg-green-soft px-3.5 py-1.5 text-sm font-bold text-green-text">Wildlife education · Raleigh, NC</p>
      <h1 class="font-display text-[clamp(44px,5.6vw,78px)] font-extrabold leading-[1.02] tracking-[-0.025em]">
        Saving the <span class="text-green">wild</span>, one <span class="text-green">life</span> at a time.
      </h1>
      <p class="max-w-[30em] text-xl leading-[1.55] text-muted">
        Short films about the animals that share our neighborhoods, made alongside the licensed wildlife rehabilitators who care for them.
      </p>
    </div>

    <RouterLink
      v-if="featured"
      data-testid="featured"
      :to="{ name: 'watch', params: { key: featured.key } }"
      class="flex flex-col gap-4 text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-text"
    >
      <span class="relative block aspect-[16/10] overflow-hidden rounded-3xl bg-line">
        <img
          v-if="featured.thumbnailUrl"
          :src="thumbnailAt(featured.thumbnailUrl, 960)"
          alt=""
          class="absolute inset-0 block h-full w-full object-cover"
        />
        <span class="absolute inset-0 flex items-center justify-center" :class="featured.thumbnailUrl ? 'bg-forest/20' : ''">
          <span class="flex size-22 items-center justify-center rounded-full bg-white text-ink shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <svg width="32" height="32" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
          </span>
        </span>
        <span
          v-if="formatDuration(featured.durationSeconds)"
          class="absolute bottom-3.5 right-3.5 rounded-lg bg-forest/90 px-2.5 py-1 text-sm font-bold text-white"
          >{{ formatDuration(featured.durationSeconds) }}</span
        >
      </span>
      <span class="flex flex-col gap-1">
        <span class="text-[13px] font-extrabold uppercase tracking-[0.1em] text-green-text">Featured episode</span>
        <span class="font-display text-[28px] font-extrabold leading-[1.15]">{{ featured.title }}</span>
        <span class="text-[15px] text-muted"
          >{{ featured.animalLabel }}<template v-if="featured.animalLabel && featured.releasedAt"> · </template>{{ formatDate(featured.releasedAt) }}</span
        >
      </span>
    </RouterLink>
  </section>

  <section class="mx-auto flex max-w-[1240px] flex-col gap-7 px-6 pb-24">
    <div class="flex flex-wrap items-end justify-between gap-3">
      <h2 class="font-display text-[40px] font-extrabold leading-[1.1] tracking-[-0.02em]">Latest episodes</h2>
      <RouterLink
        v-if="episodes.length"
        to="/episodes"
        class="inline-flex min-h-11 items-center gap-2 font-bold text-green-text no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
      >
        See all {{ episodes.length }} episodes
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
      </RouterLink>
    </div>
    <CatalogStatus v-if="statusMessage" :status="statusMessage" @retry="reload" />
    <div v-else data-testid="latest" class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,300px),1fr))] gap-7">
      <EpisodeCard v-for="episode in latest" :key="episode.id" :episode="episode" />
    </div>
  </section>

  <section class="border-y border-line bg-surface">
    <div class="mx-auto grid max-w-[1240px] items-center gap-14 px-6 py-22 md:grid-cols-2">
      <img
        :src="rexOwl"
        alt="Rex Ballard films with a professional camera while a barn owl perches on his shoulder"
        loading="lazy"
        class="block aspect-square w-full rounded-[28px] object-cover"
      />
      <div class="flex flex-col gap-5">
        <p class="text-sm font-bold uppercase tracking-[0.08em] text-green-text">Our story</p>
        <h2 class="font-display text-[clamp(32px,4vw,44px)] font-extrabold leading-[1.08] tracking-[-0.02em]">
          Two TV producers, one turtle, and a lot of wildlife stories.
        </h2>
        <p class="text-[19px] text-text-strong">
          About a decade ago, Susan Ballard stopped to help a turtle that had been hit by a car and rushed it to a licensed wildlife rehabilitator. She went home and asked her husband Rex to grab his camera. They have been filming rescues across North Carolina ever since.
        </p>
        <p class="text-[19px] text-text-strong">
          Most wildlife injuries are caused, one way or another, by people. We think good stories are the best way to change that.
        </p>
        <RouterLink
          to="/about"
          class="inline-flex min-h-11 items-center gap-2 self-start font-bold text-green-text no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
        >
          Read our story
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
        </RouterLink>
      </div>
    </div>
  </section>

  <section class="mx-auto flex max-w-[1240px] flex-col items-center gap-5 px-6 py-22 text-center">
    <p class="text-sm font-bold uppercase tracking-[0.1em] text-muted">Proudly supported by</p>
    <div class="flex items-center justify-center rounded-[20px] border border-line bg-surface px-8 py-5">
      <img :src="farmBureau" alt="NC Farm Bureau Insurance" class="block h-24 w-auto" />
    </div>
    <p class="max-w-[36em] text-muted">
      Want to help bring wildlife education to more families?
      <a href="mailto:urbanwild.wems@gmail.com" class="inline-block py-3 font-bold text-green-text underline">Talk to us about sponsorship</a>.
    </p>
  </section>
</template>
