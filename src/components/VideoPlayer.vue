<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import Player from '@vimeo/player'
import { thumbnailAt } from '../lib/episodes.js'
import { embedUrl } from '../lib/vimeo.js'

const props = defineProps({
  videoLink: { type: String, required: true },
  thumbnailUrl: { type: String, default: '' },
  title: { type: String, required: true },
  durationLabel: { type: String, default: '' },
  autostart: { type: Boolean, default: false },
})
const emit = defineEmits(['ended'])

const playing = ref(false)
const iframe = ref(null)
let player = null
let unmounted = false

const src = computed(() => embedUrl(props.videoLink, { autoplay: true }))

async function start() {
  playing.value = true
  await nextTick()
  if (unmounted || !iframe.value || player) return
  player = new Player(iframe.value)
  player.on('ended', () => emit('ended'))
}

async function replay() {
  if (!player) return
  try {
    await player.setCurrentTime(0)
    await player.play()
  } catch {
    // Playback can be refused (e.g. NotAllowedError); never reject to the caller.
  }
}

function disposePlayer() {
  if (player) {
    player.destroy().catch(() => {})
    player = null
  }
}

watch(
  () => props.videoLink,
  () => {
    disposePlayer()
    if (props.autostart) start()
    else playing.value = false
  },
)

onMounted(() => {
  if (props.autostart) start()
})
onBeforeUnmount(() => {
  unmounted = true
  disposePlayer()
})

defineExpose({ replay })
</script>

<template>
  <div class="relative aspect-video overflow-hidden rounded-[20px] bg-forest">
    <iframe
      v-if="playing"
      ref="iframe"
      :key="videoLink"
      :src="src"
      :title="title"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
      class="absolute inset-0 h-full w-full border-0"
    ></iframe>
    <template v-else>
      <img v-if="thumbnailUrl" :src="thumbnailAt(thumbnailUrl, 1280)" alt="" class="absolute inset-0 block h-full w-full object-cover" />
      <div v-else data-testid="poster-placeholder" class="absolute inset-0 bg-forest"></div>
      <div class="absolute inset-0 flex items-center justify-center bg-forest/20">
        <button
          type="button"
          :aria-label="`Play ${title}`"
          class="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border-0 bg-white text-ink shadow-[0_10px_30px_rgba(0,0,0,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          @click="start"
        >
          <svg width="36" height="36" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4.5v15l12.5-7.5z" fill="currentColor" /></svg>
        </button>
        <span v-if="durationLabel" class="absolute bottom-4 left-4 rounded-lg bg-forest/90 px-2.5 py-1 text-sm font-bold text-white">{{ durationLabel }}</span>
      </div>
    </template>
  </div>
</template>
