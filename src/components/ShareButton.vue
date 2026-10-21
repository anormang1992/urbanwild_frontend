<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ url: { type: String, required: true }, title: { type: String, default: '' } })

// 'idle' | 'copied' | 'manual'
const state = ref('idle')
watch(() => props.url, () => (state.value = 'idle'))

async function share() {
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
      await navigator.share({ title: props.title, url: props.url })
      return
    }
  } catch {
    return // the user cancelled the share sheet
  }
  try {
    await navigator.clipboard.writeText(props.url)
    state.value = 'copied'
  } catch {
    state.value = 'manual'
  }
}
</script>

<template>
  <div class="flex flex-wrap items-center gap-2.5 pt-2">
    <button
      type="button"
      class="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-[1.5px] border-ink bg-surface px-[18px] font-bold text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
      @click="share"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" /></svg>
      {{ state === 'copied' ? 'Link copied' : 'Share' }}
    </button>
    <span v-if="state !== 'idle'" data-testid="share-url" class="break-all text-sm text-muted">{{ url }}</span>
    <span class="sr-only" role="status">{{ state === 'copied' ? 'Link copied' : '' }}</span>
  </div>
</template>
