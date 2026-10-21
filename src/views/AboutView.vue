<script setup>
import { SITE_EMAIL } from '../lib/brand.js'
import susanRaven from '@/assets/about/susan-raven.webp'
import rexOwl from '@/assets/about/rex-owl.webp'
import rexOnSet from '@/assets/about/rex-on-set.webp'
import farmBureau from '@/assets/sponsors/farm-bureau.webp'
import rucciLogo from '@/assets/sponsors/rucci-productions.webp'

const photos = [
  { src: susanRaven, alt: 'Susan smiling with a raven perched on her arm', initial: 'S', name: 'Susan Ballard', caption: 'Making friends with a raven', tone: 'green' },
  { src: rexOwl, alt: 'Rex filming with a barn owl perched on his shoulder', initial: 'R', name: 'Rex Ballard', caption: 'Filming, with a barn owl riding shotgun', tone: 'blue' },
  { src: rexOnSet, alt: 'Rex behind a camera on a tripod at the beach', initial: 'R', name: 'Rex Ballard', caption: 'Lining up the shot', tone: 'blue' },
]
const tones = {
  green: { badge: 'bg-green-soft text-green-text', label: 'text-green-text' },
  blue: { badge: 'bg-blue-soft text-blue-text', label: 'text-blue-text' },
}

const team = [
  ['Susan & Rex Ballard', 'Founders & producers', 'SR'],
  ['Scott Rucci', 'Chief video editor, Rucci Productions', 'SR'],
  ['Henry Wong', 'Animation', 'HW'],
  ['Andy Poe', 'Video production support', 'AP'],
  ['David Franks', 'Website consultant', 'DF'],
  ['Andrew Greene', 'Webmaster', 'AG'],
].map(([name, role, initials], i) => ({
  name,
  role,
  initials,
  tone: i % 2 === 0 ? 'bg-green-soft text-green-text' : 'bg-blue-soft text-blue-text',
}))
</script>

<template>
  <div>
    <section class="mx-auto flex max-w-[760px] flex-col gap-[22px] px-6 pt-[88px] pb-6">
      <p class="text-sm font-bold tracking-[0.1em] text-green-text uppercase">About UrbanWild</p>
      <h1 class="font-display text-[clamp(44px,5.4vw,72px)] leading-[1.02] font-extrabold tracking-[-0.025em]">It started with a turtle.</h1>
      <p class="max-w-[32em] text-xl text-muted">Susan and Rex Ballard have been television producers for more than three decades. About ten years ago, they turned their cameras on the people who give injured wildlife a second chance.</p>
    </section>

    <section class="mx-auto flex max-w-[760px] flex-col gap-6 px-6 pt-6 pb-[72px] text-[19px] text-[#26362d]">
      <p>It all started when Susan picked up a turtle in the middle of the road that had been hit by a car. She rushed it to a local licensed wildlife rehabilitator. Once she learned how many North American wildlife species are given a second chance at life in wildlife clinics, hospitals and sanctuaries, her world would never be the same.</p>
      <p>She rushed home and asked Rex to grab his video camera. There were lots of wildlife stories out there, just waiting to be told.</p>
      <blockquote class="font-display my-4 py-2 text-[32px] leading-[1.2] font-bold tracking-[-0.01em] text-green-text">“Visual education would be paramount to protecting the wildlife around us.”</blockquote>
      <p>Soon Rex and Susan were filming all over North Carolina with federally and state licensed wildlife rehabilitators. A sad reality quickly became clear: most wildlife injuries are the result of human interaction, one way or another. Helping people understand the animals around them became the mission.</p>
    </section>

    <section aria-labelledby="bts-title" class="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 pt-10 pb-28">
      <div class="flex flex-col gap-2.5">
        <p class="text-sm font-bold tracking-[0.1em] text-green-text uppercase">Behind the scenes</p>
        <h2 id="bts-title" class="font-display text-[44px] leading-[1.08] font-extrabold tracking-[-0.02em]">Out in the field</h2>
      </div>
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-x-6 gap-y-8">
        <figure v-for="p in photos" :key="p.src" class="m-0 flex flex-col">
          <img :src="p.src" :alt="p.alt" loading="lazy" class="block aspect-[4/5] w-full rounded-3xl object-cover" />
          <figcaption class="relative z-0 mx-4 -mt-12 box-border flex min-h-24 items-center gap-3 rounded-2xl bg-surface px-4 py-3.5 shadow-[0_10px_28px_rgba(16,34,26,0.14)]">
            <span aria-hidden="true" class="font-display flex size-10 flex-none items-center justify-center rounded-full text-base font-extrabold" :class="tones[p.tone].badge">{{ p.initial }}</span>
            <span class="flex min-w-0 flex-col gap-0.5">
              <span class="text-xs font-extrabold tracking-[0.1em] uppercase" :class="tones[p.tone].label">{{ p.name }}</span>
              <span class="font-display text-lg leading-[1.25] font-bold text-ink">{{ p.caption }}</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>

    <section class="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 pb-24">
      <div class="flex flex-col gap-2.5">
        <p class="text-sm font-bold tracking-[0.1em] text-green-text uppercase">The team</p>
        <h2 class="font-display text-[44px] leading-[1.08] font-extrabold tracking-[-0.02em]">Our awesome team of talented humans</h2>
      </div>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(min(100%,260px),1fr))] gap-4">
        <div v-for="p in team" :key="p.name" data-team-card class="flex items-center gap-4 rounded-[18px] border border-line bg-surface p-[18px]">
          <span aria-hidden="true" class="font-display flex size-[52px] flex-none items-center justify-center rounded-full text-lg font-extrabold" :class="p.tone">{{ p.initials }}</span>
          <span class="flex flex-col gap-0.5">
            <span class="text-[17px] leading-[1.3] font-bold">{{ p.name }}</span>
            <span class="text-[15px] text-muted">{{ p.role }}</span>
          </span>
        </div>
      </div>
    </section>

    <section class="mx-auto max-w-[1240px] px-6 pb-24">
      <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,440px),1fr))] gap-10 rounded-[28px] bg-forest p-6 text-white sm:p-14">
        <div class="flex flex-col gap-[18px]">
          <p class="text-sm font-bold tracking-[0.1em] text-leaf uppercase">A thank-you</p>
          <h2 class="font-display text-4xl leading-[1.12] font-extrabold">To every wildlife clinic, hospital and sanctuary that let us in</h2>
        </div>
        <div class="flex flex-col gap-4 text-lg text-on-forest-strong">
          <p>You are beautiful souls who work long, hard hours to selflessly give our precious wildlife a second chance at life. Without you all, we simply could not do the work that we do.</p>
          <p class="font-display text-[22px] font-bold text-white">With eternal thanks,<br />Susan and Rex</p>
        </div>
      </div>
    </section>

    <section class="border-t border-line bg-surface">
      <div class="mx-auto flex max-w-[1240px] flex-col gap-8 px-6 py-[88px]">
        <div class="flex max-w-[760px] flex-col gap-2.5">
          <p class="text-sm font-bold tracking-[0.1em] text-green-text uppercase">Sponsors &amp; partners</p>
          <h2 class="font-display text-[44px] leading-[1.08] font-extrabold tracking-[-0.02em]">Made possible by generous supporters</h2>
        </div>
        <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-6">
          <div class="flex flex-col gap-4 rounded-3xl border border-line bg-paper p-8">
            <img :src="farmBureau" alt="NC Farm Bureau Insurance" class="h-[88px] w-auto self-start mix-blend-multiply" />
            <p class="text-[13px] font-extrabold tracking-[0.1em] text-muted uppercase">Founding sponsor</p>
            <p class="text-text-strong">When Patrick Cusack, an NC Farm Bureau agency manager, learned what the Ballards were doing, he saw how well Farm Bureau's beliefs matched their mission, and a good match was found.</p>
          </div>
          <div class="flex flex-col gap-4 rounded-3xl border border-line bg-paper p-8">
            <img :src="rucciLogo" alt="Rucci Productions" class="h-[88px] w-auto self-start mix-blend-multiply" />
            <p class="text-[13px] font-extrabold tracking-[0.1em] text-muted uppercase">Production partner</p>
            <p class="text-text-strong">Scott Rucci of Rucci Productions is our chief video editor.</p>
          </div>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-green-soft px-8 py-7">
          <p class="font-display text-2xl font-extrabold">Want to support wildlife education in North Carolina?</p>
          <a :href="`mailto:${SITE_EMAIL}`" class="inline-flex min-h-12 items-center rounded-full bg-green px-[22px] font-bold text-white no-underline">Become a sponsor</a>
        </div>
      </div>
    </section>
  </div>
</template>
