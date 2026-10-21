<script setup>
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <div class="min-h-screen bg-paper text-[17px] leading-[1.55] text-ink">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
      >Skip to content</a
    >
    <SiteHeader />
    <main id="main" tabindex="-1" class="outline-none">
      <RouterView />
    </main>
    <SiteFooter />
  </div>
</template>
