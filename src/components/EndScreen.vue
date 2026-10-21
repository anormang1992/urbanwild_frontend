<script setup>
import { thumbnailAt } from '../lib/episodes.js'
import farmBureau from '../assets/sponsors/farm-bureau.webp'

defineProps({ next: { type: Object, default: null } })
defineEmits(['play-next', 'replay', 'get-quote'])
</script>

<template>
  <!--
    Overlays the player only once the player (the parent @container) is wide enough for the
    content to fit its 16:9 box; narrower, it sits in normal flow below the player so nothing
    needs scrolling inside a small box.
  -->
  <div
    data-testid="end-screen"
    class="mt-4 grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-6 bg-forest p-7 text-white @min-[700px]:absolute @min-[700px]:inset-0 @min-[700px]:mt-0 @min-[700px]:content-center-safe @min-[700px]:overflow-auto"
  >
    <div class="flex flex-col gap-3">
      <p class="text-[13px] font-extrabold uppercase tracking-[0.1em] text-leaf">Up next</p>
      <template v-if="next">
        <img v-if="next.thumbnailUrl" :src="thumbnailAt(next.thumbnailUrl, 640)" alt="" class="block aspect-video w-full rounded-xl object-cover" />
        <p class="font-display text-xl font-bold leading-[1.2]">{{ next.title }}</p>
      </template>
      <div class="flex flex-wrap gap-2">
        <button
          v-if="next"
          type="button"
          class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-0 bg-white px-[18px] font-bold text-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          @click="$emit('play-next')"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
          Play next
        </button>
        <button
          type="button"
          class="min-h-11 cursor-pointer rounded-full border-[1.5px] border-white/60 bg-transparent px-[18px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-leaf"
          @click="$emit('replay')"
        >
          Replay
        </button>
      </div>
    </div>
    <div class="flex flex-col gap-3.5 rounded-[18px] bg-surface p-[22px] text-ink">
      <p class="text-[13px] font-extrabold uppercase tracking-[0.1em] text-muted">This episode is supported by</p>
      <img :src="farmBureau" alt="NC Farm Bureau Insurance" class="h-18 w-auto self-start" />
      <p class="text-base text-text-strong">
        Home, auto, life and farm insurance from people who share our love of North Carolina's wild places.
      </p>
      <button
        type="button"
        class="min-h-11 cursor-pointer self-start rounded-full border-0 bg-green-text px-[18px] font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        @click="$emit('get-quote')"
      >
        Get a free quote
      </button>
    </div>
  </div>
</template>
