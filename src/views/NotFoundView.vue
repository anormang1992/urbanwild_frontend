<template>
  <section class="mx-auto max-w-[1240px] px-6 py-24">
    <h1 class="font-display text-[clamp(32px,4vw,48px)] font-extrabold leading-[1.05] tracking-[-0.025em]">
      We couldn't find that page.
    </h1>
    <p class="mt-4 text-lg text-muted">The page may have moved, or the link may be mistyped.</p>
    <RouterLink
      to="/episodes"
      class="mt-8 inline-flex min-h-11 items-center rounded-lg bg-green px-6 font-bold text-white hover:bg-green-text focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      Browse all episodes
    </RouterLink>
  </section>
</template>
