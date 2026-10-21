<script setup>
import { formatDuration, thumbnailAt } from '../lib/episodes.js'

defineProps({ episodes: { type: Array, required: true } })
</script>

<template>
  <ul class="m-0 flex list-none flex-col gap-3 p-0">
    <li v-for="e in episodes" :key="e.id">
      <RouterLink
        :to="{ name: 'watch', params: { key: e.key } }"
        class="-mx-1.5 flex items-start gap-3.5 rounded-[14px] p-1.5 text-ink no-underline hover:bg-line/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
      >
        <span class="relative block aspect-video w-36 flex-none overflow-hidden rounded-[10px] bg-line">
          <img v-if="e.thumbnailUrl" :src="thumbnailAt(e.thumbnailUrl, 320)" alt="" loading="lazy" class="block h-full w-full object-cover" />
          <span
            v-if="formatDuration(e.durationSeconds)"
            class="absolute bottom-1.5 right-1.5 rounded-[5px] bg-forest/90 px-1.5 text-xs font-bold text-white"
            >{{ formatDuration(e.durationSeconds) }}</span
          >
        </span>
        <span class="flex min-w-0 flex-col gap-1">
          <span data-testid="up-next-title" class="text-base font-bold leading-[1.3]">{{ e.title }}</span>
          <span v-if="e.animalLabel" class="text-sm text-muted">{{ e.animalLabel }}</span>
        </span>
      </RouterLink>
    </li>
  </ul>
</template>
