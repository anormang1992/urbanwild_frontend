<script setup>
import { formatDuration, thumbnailAt } from '../lib/episodes.js'

defineProps({ episode: { type: Object, required: true } })
</script>

<template>
  <RouterLink
    :to="{ name: 'watch', params: { key: episode.key } }"
    class="group flex flex-col gap-3 text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-text"
  >
    <span class="relative block aspect-video overflow-hidden rounded-2xl bg-line">
      <img
        v-if="episode.thumbnailUrl"
        :src="thumbnailAt(episode.thumbnailUrl, 640)"
        alt=""
        loading="lazy"
        class="block h-full w-full object-cover"
      />
      <span v-else data-testid="thumb-placeholder" class="block h-full w-full bg-line"></span>
      <span
        v-if="formatDuration(episode.durationSeconds)"
        class="absolute bottom-2.5 right-2.5 rounded-md bg-forest/90 px-2 py-0.5 text-[13px] font-bold text-white"
        >{{ formatDuration(episode.durationSeconds) }}</span
      >
    </span>
    <span v-if="episode.animalLabel" class="self-start rounded-full bg-green-soft px-2.5 py-0.5 text-sm font-bold text-green-text">{{ episode.animalLabel }}</span>
    <span data-testid="card-title" class="font-display text-[22px] font-bold leading-tight group-hover:underline">{{ episode.title }}</span>
  </RouterLink>
</template>
