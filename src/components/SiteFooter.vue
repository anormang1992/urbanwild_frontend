<script setup>
import SiteLogo from './SiteLogo.vue'
import { WEM_MARK, MARK_OWNER, SITE_EMAIL, MISSION } from '../lib/brand.js'

// Footer links use the custom slot so the markup stays identical on every route
// (no router-link-active classes or aria-current).
const year = new Date().getFullYear()
const link =
  'inline-flex min-h-11 items-center text-ink no-underline hover:underline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink'
</script>

<template>
  <footer class="border-t border-line bg-footer">
    <div class="mx-auto flex max-w-[1240px] flex-col gap-10 px-6 pb-8 pt-14">
      <div class="flex flex-wrap gap-x-16 gap-y-10">
        <div class="flex max-w-[440px] flex-[1_1_340px] flex-col gap-4">
          <SiteLogo size="footer" />
          <p class="text-[15px] text-muted">{{ MISSION }}</p>
        </div>
        <nav aria-label="Footer" class="flex flex-[0_1_160px] flex-col">
          <p class="mb-1 text-sm font-extrabold uppercase tracking-[0.08em]">Explore</p>
          <RouterLink v-slot="{ href, navigate }" to="/episodes" custom>
            <a :href="href" :class="link" @click="navigate">Episodes</a>
          </RouterLink>
          <RouterLink v-slot="{ href, navigate }" to="/about" custom>
            <a :href="href" :class="link" @click="navigate">About</a>
          </RouterLink>
        </nav>
        <div class="flex flex-[0_1_260px] flex-col">
          <p class="mb-1 text-sm font-extrabold uppercase tracking-[0.08em]">Contact</p>
          <a :href="`mailto:${SITE_EMAIL}`" :class="[link, 'underline']">{{ SITE_EMAIL }}</a>
        </div>
      </div>
      <div class="flex flex-col gap-1.5 border-t border-footer-rule pt-6 text-sm text-muted">
        <p>© {{ year }} UrbanWild · {{ MARK_OWNER }}</p>
        <p class="text-[13px]">{{ WEM_MARK }} is a registered trademark of {{ MARK_OWNER }}.</p>
      </div>
    </div>
  </footer>
</template>
