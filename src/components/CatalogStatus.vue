<script setup>
defineProps({ status: { type: String, required: true } })
defineEmits(['retry'])
</script>

<template>
  <p v-if="status === 'loading'" aria-live="polite" class="py-10 text-center text-muted">Loading episodes…</p>
  <div v-else-if="status === 'error'" role="alert" class="flex flex-col items-center gap-4 py-10 text-center">
    <p class="text-ink">We couldn't load the episodes right now.</p>
    <button
      type="button"
      class="min-h-11 cursor-pointer rounded-full bg-ink px-6 font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-text"
      @click="$emit('retry')"
    >
      Try again
    </button>
  </div>
</template>
