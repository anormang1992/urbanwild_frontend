<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import SiteLogo from './SiteLogo.vue'

const route = useRoute()
const section = computed(() => {
  if (route.name === 'episodes' || route.name === 'watch') return 'episodes'
  if (route.name === 'about') return 'about'
  return null
})
const links = [
  { to: '/episodes', label: 'Episodes', key: 'episodes' },
  { to: '/about', label: 'About', key: 'about' },
]
</script>

<template>
  <header class="sticky top-0 z-20 border-b border-line bg-paper/95">
    <div class="mx-auto flex max-w-[1240px] flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:gap-x-8 sm:px-6">
      <RouterLink
        to="/"
        aria-label="UrbanWild home"
        class="inline-flex min-h-11 flex-none items-center no-underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
      >
        <SiteLogo size="header" />
      </RouterLink>
      <nav aria-label="Main" class="flex flex-1 flex-wrap items-center justify-end gap-x-5 gap-y-1 text-base font-semibold sm:gap-x-7">
        <RouterLink
          v-for="l in links"
          :key="l.key"
          :to="l.to"
          :aria-current="section === l.key ? 'page' : undefined"
          class="inline-flex min-h-11 items-center border-b-[3px] border-transparent text-ink no-underline hover:text-green-text focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
          :class="section === l.key ? '!border-green' : ''"
        >
          {{ l.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>
