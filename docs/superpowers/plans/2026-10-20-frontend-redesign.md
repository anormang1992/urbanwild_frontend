# UrbanWild Frontend Redesign: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Vue CLI 4 site with the approved redesign (Home, Episodes, Watch, About) on Vue 3 + Vite + Tailwind 4, and launch it on the existing `urbanwild` Heroku app.

**Architecture:**
- **Pure logic:** a framework-free episode module (`src/lib/episodes.js`) holds all catalog logic: mapping, sorting, filtering, featured and up-next. It has thorough unit tests.
- **API access:** a thin client (`src/lib/api.js`) and a shared catalog composable feed the pages.
- **Pages:** small, focused components, with filter state kept in the URL.
- **Hosting:** Heroku builds with `heroku/nodejs` and serves `dist/` with `heroku-community/nginx` in static mode.

**Tech Stack:**
- Node 24 LTS, Vue 3.5, vue-router 5 (classic `createRouter` API), Vite 8, Tailwind CSS 4 (`@tailwindcss/vite`).
- `@vimeo/player`, `@fontsource-variable` fonts.
- Vitest 5, `@vue/test-utils`, jsdom.

**Spec:** `docs/superpowers/specs/2026-10-20-urbanwild-redesign-design.md`. Mockup sources are in `docs/superpowers/specs/2026-10-20-urbanwild-redesign-mockup/`, for exact copy and styles.

**Depends on:** `../urbanwild_api/docs/superpowers/plans/2026-10-20-api-redesign-support.md`, through its Task 5 (deployed). Development can start before then, but launch (Task 12) can't.

## Global Constraints

- **Engines:** `"node": "24.x"`, `"npm": ">=10"`. Local development works on Node ≥ 24.
- **Dependencies:**
  - runtime: `vue@^3.5.44`, `vue-router@^5.4.0`, `@vimeo/player@^2.30.4`, `@fontsource-variable/bricolage-grotesque@^5.3.0`, `@fontsource-variable/figtree@^5.3.0`;
  - dev: `vite@^8.3.4`, `@vitejs/plugin-vue@^6.0.10`, `tailwindcss@^4.3.3`, `@tailwindcss/vite@^4.3.3`, `vitest@^5.0.5`, `@vue/test-utils@^2.5.1`, `jsdom@^30.1.3`.
  - Nothing else at runtime. **No** `moment`, `axios`, Font Awesome, Vue CLI, Babel, `sass`, Pinia or a head library.
- **HTTP:** `fetch` only. The API base is `import.meta.env.VITE_API_BASE_URL || 'https://urbanwild-api.herokuapp.com'`.
- **Trademark:** the phrase constant is exactly `On a WEM(Wildlife Educational Moment)`: lowercase "a", no space before "(", no ™ or ®. The footer sentence is exactly `On a WEM(Wildlife Educational Moment) is a registered trademark of Ballard Productions LLC.`
- **No Get help:** no links, routes, copy or placeholders for Get help, the rescue guide or rehabilitators.
- **Navigation:** the header nav is exactly **Episodes**, **About**. The footer is one component, identical on every page.
- **Play counts:** recorded only when `location.hostname` is `urbanwild.tv` or `www.urbanwild.tv`.
- **Lead test ZIP:** `00000`. Use it for every manual lead test.
- **Copy:** use the spec's exact strings. Where the spec says "copy in mockup", take it verbatim from the mockup sources.
- **Visual tokens:** the spec's color table, type scale and radii, defined once in `@theme` in `src/styles/main.css`.
- **Accessibility:**
  - AA contrast; visible focus;
  - at least 44px touch targets;
  - real `<a>` and `<button>`;
  - `aria-label` on icon-only buttons;
  - works from 360px wide with no horizontal scroll.
- **Tests:** in `tests/unit/*.test.js`. Component tests mock `src/lib/api.js` with `vi.mock`; nothing calls the real network.

## Review Focus

1. **An episode with no thumbnail** (Vimeo lookup failed in the admin) shows a neutral placeholder, never a broken image. Tests in Task 5 (`EpisodeCard`) and Task 7 (player poster).
2. **The API slow or down** (Eco dynos sleep) shows "Loading episodes…" and then "We couldn't load the episodes right now." with a working **Try again**, never a blank page. Tests in Task 3 (`useCatalog`) and Task 5 (Home).
3. **An episode with no release date** shows no "Invalid Date" and sorts last in both date orders. Tests in Task 2.
4. **Search text with stray spaces or regex characters** (`"  (eagle "`) is trimmed and matched literally, with no exception. Test in Task 2.
5. **Sharing where neither `navigator.share` nor the clipboard works**, or the user cancels the share sheet, throws no error, and the URL is shown so it can be copied by hand. Test in Task 9.

## File Structure

```
index.html                       site-wide meta + Open Graph; mounts /src/main.js
vite.config.js                   vue + tailwind plugins; vitest (jsdom) config
Procfile                         web: bin/start-nginx-static
config/nginx.conf.erb            nginx static config (root dist, SPA fallback, caching)
scripts/make-assets.mjs          one-off: converts photos, builds favicon/og images (run once, outputs committed)
public/favicon.svg, apple-touch-icon.png, og-image.png
src/main.js                      app bootstrap (fonts, css, router)
src/App.vue                      skip link, SiteHeader, <main>, RouterView, SiteFooter
src/router.js                    routes, legacy /learn redirect, titles, scroll
src/styles/main.css              tailwind import + @theme tokens
src/lib/brand.js                 WEM_MARK, MARK_OWNER, SITE_EMAIL, MISSION, DEFAULT_DESCRIPTION
src/lib/episodes.js              pure catalog logic
src/lib/api.js                   fetch client (catalog, episode, play, lead) + error types
src/lib/vimeo.js                 embedUrl()
src/lib/lead.js                  validateLead() + messages
src/lib/head.js                  setPageMeta()
src/composables/useCatalog.js    shared, load-once catalog state
src/components/SiteLogo.vue, SiteHeader.vue, SiteFooter.vue
src/components/EpisodeCard.vue, VideoPlayer.vue, EndScreen.vue, LeadFormDialog.vue,
               ShareButton.vue, UpNextList.vue, CatalogStatus.vue
src/views/HomeView.vue, EpisodesView.vue, WatchView.vue, AboutView.vue, NotFoundView.vue
src/assets/about/*.webp, src/assets/sponsors/*.webp
tests/unit/fixtures.js, helpers.js, *.test.js
```

---

### Task 1: Replace Vue CLI with a Vite toolchain

**Files:**
- Delete:
  - `babel.config.js`, `postcss.config.js`, `tailwind.config.js`, `.browserslistrc`, `static.json`, `public/index.html`;
  - everything under `src/` **except** these 5 files, which later tasks convert:
    - `src/assets/images/about_page/rex_and_owl.png`, `susan_and_raven.png`, `rex_on_set.png`;
    - `src/assets/logos/Farm_Bureau_Ad.png`, `Rucci_Productions_Logo.png`.
- Rewrite: `package.json`. Regenerate `package-lock.json`.
- Create: `index.html`, `vite.config.js`, `src/main.js`, `src/App.vue` (placeholder), `src/styles/main.css`, `tests/unit/smoke.test.js`.

**Interfaces:**
- **npm scripts:** `dev` (`vite`), `build` (`vite build`), `preview` (`vite preview`), `test` (`vitest run`).
- **`@theme` tokens** in `main.css`, used as Tailwind classes by every later task:
  - colors: `--color-ink`, `--color-muted`, `--color-text-strong`, `--color-paper`, `--color-surface`, `--color-line`, `--color-line-strong`, `--color-footer`, `--color-footer-rule`, `--color-forest`, `--color-on-forest`, `--color-on-forest-strong`, `--color-leaf`, `--color-green`, `--color-green-text`, `--color-green-soft`, `--color-blue-text`, `--color-blue-soft`;
  - fonts: `--font-display: 'Bricolage Grotesque Variable', sans-serif`, `--font-sans: 'Figtree Variable', system-ui, sans-serif`.
  - The values come from the spec's color table.

- [ ] **Step 1: Write the smoke test.** It mounts `App` and expects `wrapper.exists()` to be true.
- [ ] **Step 2: Remove the old toolchain and source.** Keep the 5 asset files listed above.
- [ ] **Step 3: Create the new files.**
  - **`package.json`:** `"type": "module"`, the engines and dependencies from Global Constraints, and the scripts above.
  - **`vite.config.js`:** `plugins: [vue(), tailwindcss()]` and `test: { environment: 'jsdom' }`.
  - **`main.js`:** imports both fontsource packages and `./styles/main.css`, then mounts `App`.
  - **`index.html`:**
    - `lang="en"`; title `UrbanWild`;
    - meta description = `DEFAULT_DESCRIPTION` (Task 4);
    - `<link rel="canonical" href="https://urbanwild.tv/">`;
    - Open Graph tags (`og:site_name` UrbanWild, `og:title`, `og:description`, `og:image` `https://urbanwild.tv/og-image.png`, `og:url`) and `twitter:card` `summary_large_image`;
    - `favicon.svg` and `apple-touch-icon.png` links;
    - `<div id="app">`.
- [ ] **Step 4: Install and verify.**

  Run: `npm install && npm test && npm run build`
  Expected:
  - 1 test passes;
  - `dist/index.html` exists;
  - no warnings beyond the expected 404s for the not-yet-made favicon/og files.
- [ ] **Step 5: Commit.** `git commit -am "Replace Vue CLI with Vite, Vue 3.5, Tailwind 4 and Vitest"`, adding the new files first.

---

### Task 2: Episode logic module

**Files:**
- Create: `src/lib/episodes.js`, `tests/unit/fixtures.js`, `tests/unit/episodes.test.js`

**Interfaces:**
- Produces (`src/lib/episodes.js`):
  - **`ANIMALS`:** ordered `[{ id, value, label }]`:

    | id | value | label |
    |---|---|---|
    | `birds` | `Bird` | Birds |
    | `birds-of-prey` | `Raptor` | Birds of prey |
    | `small-mammals` | `Mammal, Small` | Small mammals |
    | `large-mammals` | `Mammal, Large` | Large mammals |
    | `reptiles` | `Reptile` | Reptiles |
    | `amphibians` | `Amphibian` | Amphibians |
    | `fish` | `Fish` | Fish |

  - **`SORTS`:** `[{id:'newest',label:'Newest first'},{id:'oldest',label:'Oldest first'},{id:'popular',label:'Most watched'},{id:'title',label:'A to Z'}]`.
  - **`toEpisode(raw) -> Episode`**, where an `Episode` is:
    - `{ id, key, title, description: string ('' if null), videoLink, animalId: string|null, animalLabel: string ('' if none), tags: string[], playCount: number, releasedAt: Date|null, durationSeconds: number|null, thumbnailUrl: string ('' if blank), featured: boolean }`
  - **Formatting:**
    - `formatDuration(seconds|null) -> string`
    - `formatDate(Date|null) -> string`: `Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })`.
    - `thumbnailAt(url, width) -> string`: replaces a `-d_<n>` size segment with `-d_<width>`.
    - `tagLabel(slug) -> string`: hyphens become spaces.
  - **List operations:**
    - `sortEpisodes(list, sortId) -> Episode[]`: a new array. Date sorts put nulls last. Ties break by id descending.
    - `filterEpisodes(list, { q = '', animal = 'all' }) -> Episode[]`: `q` is trimmed, then matched as a case-insensitive literal substring of the title, description, animal label, raw tag slugs and `tagLabel(tag)`.
    - `animalOptions(list) -> [{ id, label, count }]`: `{id:'all',label:'All',count:list.length}` first, then each `ANIMALS` entry with a count above zero, in `ANIMALS` order.
    - `pickFeatured(list) -> Episode|null`: the newest featured episode, or else the newest overall.
    - `latestEpisodes(list, { exclude = null, count = 3 }) -> Episode[]`: newest first.
    - `upNextFor(list, currentId) -> Episode[]`: newest-first order rotated to start after the current episode, excluding it.
  - **View helpers:**
    - `isDefaultView({ q, animal, sort }) -> boolean`: true when `q` is `''`, `animal` is `'all'` and `sort` is `'newest'`.
    - `resultsHeading({ count, q, isDefault }) -> string`.
- **Fixtures (`tests/unit/fixtures.js`):** `rawEpisodes`, 4 raw API objects with real data, and `catalog = rawEpisodes.map(toEpisode)`. Every component task reuses them.

  | id | key | title | animal_class | released_at | play_count | duration | featured | tags | video_link |
  |---|---|---|---|---|---|---|---|---|---|
  | 11 | `ninas-chimney-swifts` | Nina's Chimney Swifts | Bird | 2022-11-02T00:00:00Z | 52 | 350 | false | birds, chimney-swifts, lees-mcrae | `https://player.vimeo.com/video/766193890?h=bbf13fc37c` |
  | 8 | `jimmy-the-beaver-goes-free` | Jimmy the Beaver Goes Free | Mammal, Small | 2022-09-19T00:00:00Z | 15 | 195 | false | beaver, byron, release | `https://player.vimeo.com/video/693738907?h=aaffeb9532` |
  | 6 | `byrons-hawk-in-the-crepe-myrtle-tree` | Byron's Hawk in the Crepe Myrtle Tree | Raptor | 2022-08-22T00:00:00Z | 11 | 157 | false | bird, byron, hawk, red-tailed-hawk, rescue | `https://player.vimeo.com/video/703316078?h=07b3163870` |
  | 1 | `lady-eagle-dock-lake-auman` | Lady Eagle Dock - Lake Auman | Raptor | 2022-05-20T00:00:00Z | 62 | 156 | true | bald-eagle, lake, release, rescue | `https://player.vimeo.com/video/693713363?h=6cff38f7a4` |

  - Every thumbnail is `https://i.vimeocdn.com/video/<id>-abc-d_1280?region=us`.
  - Jimmy's description is the real one: "Byron is back with Jimmy the Beaver! Learn more about beavers and their habitats in this WEM, and watch Byron release Jimmy back into the wild."
  - The other three descriptions are null.

- [ ] **Step 1: Write the failing tests** (`ids = list => list.map(e => e.id)`):

```js
test('maps raw API episodes', () => {
  const eagle = catalog.find(e => e.id === 1)
  expect(eagle.animalLabel).toBe('Birds of prey')
  expect(eagle.releasedAt).toEqual(new Date('2022-05-20T00:00:00Z'))
  expect(catalog[0].description).toBe('')
})
test('formats durations and dates', () => {
  expect(formatDuration(156)).toBe('2:36'); expect(formatDuration(350)).toBe('5:50'); expect(formatDuration(null)).toBe('')
  expect(formatDate(new Date('2022-05-20T00:00:00Z'))).toBe('May 20, 2022'); expect(formatDate(null)).toBe('')
})
test('resizes Vimeo thumbnails', () => {
  expect(thumbnailAt('https://i.vimeocdn.com/video/1-abc-d_1280?region=us', 640)).toBe('https://i.vimeocdn.com/video/1-abc-d_640?region=us')
  expect(thumbnailAt('', 640)).toBe('')
})
test('sorts', () => {
  expect(ids(sortEpisodes(catalog, 'newest'))).toEqual([11, 8, 6, 1])
  expect(ids(sortEpisodes(catalog, 'oldest'))).toEqual([1, 6, 8, 11])
  expect(ids(sortEpisodes(catalog, 'popular'))).toEqual([1, 11, 8, 6])
  expect(ids(sortEpisodes(catalog, 'title'))).toEqual([6, 8, 1, 11])
})
test('undated episodes sort last both ways', () => {
  const list = [...catalog, { ...catalog[1], id: 99, releasedAt: null }]
  expect(ids(sortEpisodes(list, 'newest')).at(-1)).toBe(99)
  expect(ids(sortEpisodes(list, 'oldest')).at(-1)).toBe(99)
})
test('filters by text, tags and animal', () => {
  expect(ids(filterEpisodes(catalog, { q: 'EAGLE' }))).toEqual([1])
  expect(ids(filterEpisodes(catalog, { q: '  red tailed ' }))).toEqual([6])
  expect(filterEpisodes(catalog, { q: '  (eagle ' })).toEqual([])
  expect(ids(filterEpisodes(catalog, { animal: 'birds-of-prey' }))).toEqual([6, 1])
})
test('animal options only list classes present', () => {
  expect(animalOptions(catalog)).toEqual([
    { id: 'all', label: 'All', count: 4 }, { id: 'birds', label: 'Birds', count: 1 },
    { id: 'birds-of-prey', label: 'Birds of prey', count: 2 }, { id: 'small-mammals', label: 'Small mammals', count: 1 }])
})
test('featured, latest and up next', () => {
  expect(pickFeatured(catalog).id).toBe(1)
  expect(pickFeatured(catalog.map(e => ({ ...e, featured: false }))).id).toBe(11)
  expect(ids(latestEpisodes(catalog, { exclude: pickFeatured(catalog) }))).toEqual([11, 8, 6])
  expect(ids(upNextFor(catalog, 8))).toEqual([6, 1, 11])
  expect(ids(upNextFor(catalog, 1))).toEqual([11, 8, 6])
})
test('view helpers', () => {
  expect(isDefaultView({ q: '', animal: 'all', sort: 'newest' })).toBe(true)
  expect(isDefaultView({ q: '', animal: 'all', sort: 'oldest' })).toBe(false)
  expect(resultsHeading({ count: 3, q: '', isDefault: true })).toBe('More episodes')
  expect(resultsHeading({ count: 1, q: '', isDefault: false })).toBe('1 episode')
  expect(resultsHeading({ count: 2, q: 'eagle', isDefault: false })).toBe('2 episodes for “eagle”')
})
```

  Note: `filterEpisodes` preserves input order. The animal test passes `catalog`, which is newest first, so the result is `[6, 1]`.

- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/episodes.test.js`. Expected: FAIL, because the module isn't found.
- [ ] **Step 3: Implement `src/lib/episodes.js`** to the Interfaces above.
- [ ] **Step 4: Run them again.** Expected: PASS.
- [ ] **Step 5: Commit** with the message "Add episode catalog logic".

---

### Task 3: API client and shared catalog

**Files:**
- Create: `src/lib/api.js`, `src/composables/useCatalog.js`, `tests/unit/api.test.js`, `tests/unit/useCatalog.test.js`

**Interfaces:**
- Consumes: `toEpisode` (Task 2).
- Produces:
  - **From `src/lib/api.js`:**
    - `API_BASE`
    - `class ApiError extends Error { status }`
    - `class LeadError extends Error { status, fieldErrors }`: `fieldErrors` maps field name to a message string. The API's arrays are joined.
    - `RATE_LIMIT_MESSAGE = "You've sent a few requests already. Please try again later."`
    - `GENERIC_LEAD_MESSAGE = 'Something went wrong. Please try again.'`
  - **Catalog calls:**
    - `fetchCatalog() -> Promise<Episode[]>`: `GET ${API_BASE}/api/v1/wems/?wem_locked=False&limit=100`.
    - `fetchEpisode(key) -> Promise<Episode|null>`: `GET ${API_BASE}/api/v1/wems/?wem_locked=False&key=${encodeURIComponent(key)}`.
  - **Play calls:**
    - `shouldRecordPlays(hostname) -> boolean`
    - `recordPlay(id, hostname = window.location.hostname) -> Promise<void>`: POSTs `${API_BASE}/api/v1/wems/${id}/play/`. It never rejects.
  - **Lead call:** `sendLead({ name, zip, email, phone, consent }) -> Promise<void>`: POSTs JSON to `${API_BASE}/send-lead-message/`.
  - **From `src/composables/useCatalog.js`:**
    - `useCatalog() -> { episodes: Ref<Episode[]>, status: Ref<'idle'|'loading'|'ready'|'error'>, load(): Promise<void>, reload(): Promise<void> }`. The state is shared at module level. `load` runs only once (concurrent calls share one request); `reload` always refetches.
    - `resetCatalog()`, for tests.

- [ ] **Step 1: Write the failing tests.** Stub `fetch` with `vi.stubGlobal('fetch', vi.fn())`.
  - **`fetchCatalog`:**
    - requests exactly the catalog URL and returns `catalog`-shaped episodes;
    - throws `ApiError` with `status` 500 on a 500.
  - **`fetchEpisode('lady-eagle-dock-lake-auman')`:** requests the key URL. With `{ results: [] }` it resolves to `null`.
  - **`shouldRecordPlays`:**
    - true for `urbanwild.tv` and `www.urbanwild.tv`;
    - false for `localhost` and `urbanwild.herokuapp.com`.
  - **`recordPlay`:**
    - `recordPlay(1, 'urbanwild.tv')` POSTs to `…/api/v1/wems/1/play/`;
    - `recordPlay(1, 'localhost')` never calls `fetch`;
    - a rejected `fetch` resolves without throwing.
  - **`sendLead` errors:**
    - a 400 with body `{ zip: ['Enter a valid value.'] }` rejects with a `LeadError` whose `fieldErrors` is `{ zip: 'Enter a valid value.' }`;
    - a 429 rejects with `RATE_LIMIT_MESSAGE`;
    - a network failure rejects with `GENERIC_LEAD_MESSAGE`.
  - **`useCatalog`:**
    - two concurrent `load()` calls fetch once and leave `status` at `'ready'`;
    - a failing fetch sets `'error'`, and then `reload()` with a succeeding fetch sets `'ready'` with 4 episodes.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/api.test.js tests/unit/useCatalog.test.js`. Expected: FAIL, because the modules aren't found.
- [ ] **Step 3: Implement** both files to the Interfaces above.
- [ ] **Step 4: Run them again.** Expected: PASS.
- [ ] **Step 5: Commit** with the message "Add API client and shared catalog".

---

### Task 4: Router, layout shell, brand and static assets

**Files:**
- Create:
  - code: `src/router.js`, `src/lib/brand.js`, `src/lib/head.js`, `src/components/SiteLogo.vue`, `SiteHeader.vue`, `SiteFooter.vue`, `src/views/NotFoundView.vue`, and placeholder `HomeView.vue`, `EpisodesView.vue`, `WatchView.vue`, `AboutView.vue` (each just an `<h1>`);
  - tests: `tests/unit/helpers.js`, `tests/unit/layout.test.js`, `tests/unit/router.test.js`;
  - assets: `scripts/make-assets.mjs`, `public/favicon.svg`, `public/apple-touch-icon.png`, `public/og-image.png`, `src/assets/about/susan-raven.webp`, `rex-owl.webp`, `rex-on-set.webp`, `src/assets/sponsors/farm-bureau.webp`, `rucci-productions.webp`.
- Modify: `src/App.vue`, `src/main.js` (install the router).
- Delete: the 5 original PNGs after conversion.

**Interfaces:**
- Produces:
  - **`brand.js`:**
    - `WEM_MARK = 'On a WEM(Wildlife Educational Moment)'`
    - `MARK_OWNER = 'Ballard Productions LLC'`
    - `SITE_EMAIL = 'urbanwild.wems@gmail.com'`
    - `MISSION`, the spec's footer sentence
    - `DEFAULT_DESCRIPTION = 'Short films about the animals that share our neighborhoods, made alongside the licensed wildlife rehabilitators who care for them.'`
  - **`head.js`:** `setPageMeta({ title, description = DEFAULT_DESCRIPTION })` sets `document.title` and `meta[name=description]`.
  - **`router.js`:**
    - **`createAppRouter(history = createWebHistory()) -> Router`.** Routes are named `home` (`/`), `episodes` (`/episodes`), `watch` (`/episodes/:key`), `about` (`/about`), `learn` (`/learn`, a redirect) and `not-found` (`/:pathMatch(.*)*`).
    - **`meta.title`:**

      | Route | Title |
      |---|---|
      | `home` | `UrbanWild · Saving the wild, one life at a time` |
      | `episodes` | `Episodes · UrbanWild` |
      | `about` | `About · UrbanWild` |
      | `not-found` | `Page not found · UrbanWild` |

    - **Page titles:** `afterEach` calls `setPageMeta` with these. Watch sets its own title (Task 9).
    - **Legacy redirect:** `/learn?key=K` goes to `{ name: 'watch', params: { key: K } }`; plain `/learn` goes to `{ name: 'episodes' }`.
    - **Scrolling:** `scrollBehavior` returns `savedPosition`, or the top of the page.
  - **`SiteLogo`:** props `{ size: 'header' | 'footer' }`. The mark is the spec's Appendix A SVG, at 40px or 36px. The wordmark is 26px or 23px.
  - **`SiteHeader`:**
    - nav links "Episodes" (`/episodes`) and "About" (`/about`);
    - the link for the current section gets `aria-current="page"` and the 3px green underline. Routes `episodes` and `watch` both mean the Episodes section.
  - **`SiteFooter`:** the spec's footer. The bottom lines are `© {year} UrbanWild · Ballard Productions LLC` and `${WEM_MARK} is a registered trademark of ${MARK_OWNER}.`
  - **`NotFoundView`:** H1 "We couldn't find that page.", the text "The page may have moved, or the link may be mistyped.", and a "Browse all episodes" link to `/episodes`.
  - **Test helper (`tests/unit/helpers.js`):** `mountApp(path) -> Promise<{ wrapper, router }>`. It builds `createAppRouter(createMemoryHistory())`, pushes `path`, mounts `App`, then awaits `router.isReady()` and `flushPromises()`.
  - **Asset imports:** `@/assets/about/*.webp` and `@/assets/sponsors/*.webp`. Add the `@` alias to `src` in `vite.config.js`.

- [ ] **Step 1: Write the failing tests.**
  - **`router.test.js`:**
    - `/learn` resolves to route name `episodes`;
    - `/learn?key=lady-eagle-dock-lake-auman` resolves to `watch` with that key;
    - `/nope` renders "We couldn't find that page.";
    - after navigating to `/about`, `document.title` is `About · UrbanWild`.
  - **`layout.test.js`:**
    - `WEM_MARK` equals `'On a WEM(Wildlife Educational Moment)'`.
    - On `/`, `/episodes` and `/about`, the footer text includes `On a WEM(Wildlife Educational Moment) is a registered trademark of Ballard Productions LLC.` and its HTML is identical across the three routes.
    - On `/episodes/anything`, the Episodes nav link has `aria-current="page"`; on `/about`, About has it.
    - The header's nav contains exactly two links.
    - Neither the header nor the footer contains the text "help".
    - The skip link `href="#main"` exists.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/router.test.js tests/unit/layout.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** the router, brand, head, logo, header, footer, NotFound and `App.vue` (skip link "Skip to content", `<main id="main" tabindex="-1">`).
- [ ] **Step 4: Write `scripts/make-assets.mjs` and run it once.**

  Run: `npm install --no-save sharp@0.35.5 && node scripts/make-assets.mjs`
  - **Photos:** the three about photos become WebP at max 1600px wide, quality 78. The two sponsor logos become WebP at max 900px wide, keeping transparency.
  - **Icons:** `favicon.svg` is the Appendix A mark. `apple-touch-icon.png` is the mark rendered at 180×180.
  - **Share image:** `og-image.png` is 1200×630: paper background, the mark at 240px centered above "UrbanWild" in ink and green, rendered from SVG by sharp. Any sans-serif fallback font is fine.

  Expected: each about photo is ≤ 250 KB (`ls -la src/assets/about`). Delete the original PNGs and don't add sharp to `package.json`.
- [ ] **Step 5: Run all tests and the build.** Run `npm test && npm run build`. Expected: all pass, and `dist/` contains `favicon.svg` and `og-image.png`.
- [ ] **Step 6: Commit** with the message "Add router, layout, brand and converted assets".

---

### Task 5: Home page and episode cards

**Files:**
- Create: `src/components/EpisodeCard.vue`, `src/components/CatalogStatus.vue`, `tests/unit/home.test.js`
- Modify: `src/views/HomeView.vue`

**Interfaces:**
- Consumes: `useCatalog`, `pickFeatured`, `latestEpisodes`, `formatDuration`, `formatDate`, `thumbnailAt` and `mountApp`.
- Produces:
  - **`EpisodeCard`:**
    - props `{ episode: Episode }`;
    - a single `RouterLink` to `{ name: 'watch', params: { key } }`;
    - a 16:9 thumbnail at `thumbnailAt(url, 640)` with `loading="lazy"`;
    - a placeholder `<div data-testid="thumb-placeholder">` (line color) when `thumbnailUrl` is `''`;
    - a duration badge when there's a duration, then the animal chip, the date and the title.
  - **`CatalogStatus`:**
    - props `{ status }`;
    - shows "Loading episodes…" (`aria-live="polite"`) while loading;
    - on error, shows "We couldn't load the episodes right now." and a "Try again" button that emits `retry`.

- [ ] **Step 1: Write the failing tests.** Mock `src/lib/api.js` so `fetchCatalog` resolves `catalog`, and mount `/`.
  - **Featured card:** links to `/episodes/lady-eagle-dock-lake-auman` and contains "Featured episode" and "Lady Eagle Dock - Lake Auman".
  - **Latest episodes:** the card titles, in order, are Nina's Chimney Swifts, Jimmy the Beaver Goes Free, then Byron's Hawk in the Crepe Myrtle Tree.
  - **One "See all" link:** within `<main>`, exactly **one** link has `href="/episodes"`, with the text "See all 4 episodes".
  - **No buttons in the hero:** the hero contains no `<button>`.
  - **Placeholder thumbnail:** mounting `EpisodeCard` with `{ ...catalog[0], thumbnailUrl: '' }` renders `[data-testid=thumb-placeholder]` and no `<img>`.
  - **Error and retry:** when `fetchCatalog` rejects once and then resolves, Home shows "We couldn't load the episodes right now.". Clicking "Try again" renders the featured card.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/home.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** the cards and `HomeView`: hero, featured, latest, story band (with `rex-owl.webp`) and sponsor. Copy comes from the spec and `Home.dc.html`.
- [ ] **Step 4: Run them again.** Expected: PASS. Then run `npm test`, and everything passes.
- [ ] **Step 5: Commit** with the message "Build the Home page".

---

### Task 6: Episodes page

**Files:**
- Modify: `src/views/EpisodesView.vue`
- Test: `tests/unit/episodes-view.test.js`

**Interfaces:**
- Consumes: `useCatalog`, `EpisodeCard`, `CatalogStatus`, `ANIMALS`, `SORTS`, `sortEpisodes`, `filterEpisodes`, `animalOptions`, `isDefaultView`, `resultsHeading` and `WEM_MARK`.
- Produces: URL query contract `q` (string), `animal` (an `ANIMALS` id or `all`, the default) and `sort` (a `SORTS` id or `newest`, the default). Default values are left out of the URL. Update the URL with `router.replace`.

- [ ] **Step 1: Write the failing tests.** Mock the catalog as in Task 5.
  - **Trademark heading:** the H1 `textContent` is exactly `WEM_MARK`. The two visual lines are a text node and a `<span>`, with no whitespace between.
  - **Default view:**
    - shows "Newest episode" with Nina's Chimney Swifts;
    - the results heading is "More episodes";
    - the grid shows ids `[8, 6, 1]`.
  - **Search:** typing `eagle` updates `route.query.q` to `eagle`, hides the newest-episode block, and shows the heading `1 episode for “eagle”`.
  - **Animal chips:**
    - clicking "Birds of prey" gives it `aria-pressed="true"`, sets `route.query.animal` to `birds-of-prey` and shows 2 cards;
    - there's no "Reptiles" chip.
  - **Sort:** choosing "Most watched" sets `route.query.sort` to `popular` and orders the cards `[1, 11, 8, 6]`.
  - **Empty state:** mounting `/episodes?q=zzz` shows "Rats! Nothing matched that search.". "Clear filters" empties the query and shows the default view.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/episodes-view.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement `EpisodesView`.**
  - The forest header, H1 and lede.
  - The newest-episode block, only in the default view.
  - The toolbar:
    - a search `<input type="search">` with a visually hidden label "Search episodes";
    - the chips, in a `role="group"` labeled "Filter by animal";
    - a sort `<select>` labeled "Sort".
  - The results heading, the grid and the empty state. Use `CatalogStatus` for loading and error.
- [ ] **Step 4: Run them again.** Expected: PASS. Then run `npm test`, and everything passes.
- [ ] **Step 5: Commit** with the message "Build the Episodes page".

---

### Task 7: Video player

**Files:**
- Create: `src/lib/vimeo.js`, `src/components/VideoPlayer.vue`, `tests/unit/video-player.test.js`

**Interfaces:**
- Produces:
  - **`embedUrl(videoLink, { autoplay = false } = {}) -> string`:**
    - keeps every existing query parameter, including `h`;
    - sets `title=0`, `byline=0` and `portrait=0`;
    - adds `autoplay=1` when asked.
  - **`VideoPlayer`:**
    - props `{ videoLink, thumbnailUrl, title, durationLabel, autostart = false }`;
    - emits `ended`;
    - `defineExpose({ replay })`, where `replay()` calls `setCurrentTime(0)` then `play()`.
    - **Poster state:**
      - an `<img>` at `thumbnailAt(url, 1280)`, or a placeholder div when there's no thumbnail;
      - a play `<button aria-label="Play {title}">`;
      - the duration badge.
    - **Playing state:** an `<iframe allow="autoplay; fullscreen; picture-in-picture" allowfullscreen>` whose `src` is `embedUrl(videoLink, { autoplay: true })`, wrapped by `new Player(iframe)`. Listen with `player.on('ended', …)` and destroy the player on unmount.

- [ ] **Step 1: Write the failing tests.**
  - **Mock the player:** `vi.mock('@vimeo/player', …)` returns a fake class that records `on` handlers, `setCurrentTime`, `play` and `destroy`.
  - **`embedUrl`:**
    - `embedUrl('https://player.vimeo.com/video/693713363?h=6cff38f7a4')` equals `'https://player.vimeo.com/video/693713363?h=6cff38f7a4&title=0&byline=0&portrait=0'`;
    - the `{ autoplay: true }` variant ends with `&autoplay=1`.
  - **Before play:**
    - the poster `<img>` src ends with `-d_1280?region=us`;
    - there's no `<iframe>`;
    - the button has the label "Play Lady Eagle Dock - Lake Auman".
  - **Click to play:**
    - clicking the button renders an `<iframe>` whose `src` contains `h=6cff38f7a4` and `autoplay=1`;
    - the fake Player was constructed with that iframe.
  - **Ended:** firing the fake `ended` handler makes the component emit `ended`.
  - **Autostart:** `autostart: true` renders the iframe immediately.
  - **No thumbnail:** `thumbnailUrl: ''` renders a placeholder and no `<img>`.
  - **Replay:** `wrapper.vm.replay()` calls `setCurrentTime(0)` and then `play()`.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/video-player.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** `vimeo.js` and `VideoPlayer.vue`: 16:9 with a 20px radius, the spec's poster styling, and Vimeo's own controls (no custom bar).
- [ ] **Step 4: Run them again.** Expected: PASS.
- [ ] **Step 5: Commit** with the message "Add the Vimeo video player with a click-to-play poster".

---

### Task 8: Lead form dialog

**Files:**
- Create: `src/lib/lead.js`, `src/components/LeadFormDialog.vue`, `tests/unit/lead.test.js`

**Interfaces:**
- Consumes: `sendLead`, `LeadError` and `RATE_LIMIT_MESSAGE` (Task 3).
- Produces:
  - **`validateLead({ name, zip, email, phone, consent }) -> Record<string,string>`** returns an object of error messages, empty when the form is valid:

    | Key | Condition | Message |
    |---|---|---|
    | `name` | name missing | `Enter your name.` |
    | `zip` | not `^\d{5}(-\d{4})?$` | `Enter a 5-digit ZIP code.` |
    | `email` | no email and no phone | `Enter an email address or a phone number.` |
    | `email` | email present but invalid | `Enter a valid email address.` |
    | `consent` | box not ticked | `Please agree to be contacted.` |

  - **`LeadFormDialog`:**
    - props `{ open: boolean }`; emits `close`.
    - **Dialog behavior:** uses a native `<dialog>`. It calls `showModal()` when `open` becomes true; on Esc (the `cancel` event) or the close button, it emits `close`. Focus returns to the opener natively.
    - **Copy and fields:** the spec's copy; fields labeled "Full name", "ZIP code", "Email" and "Phone"; the consent checkbox; and a "Request my quote" button.
    - **Errors:** each shows under its field, and the field gets `aria-invalid="true"` and `aria-describedby`.

- [ ] **Step 1: Write the failing tests.**
  - **Setup:** stub `HTMLDialogElement.prototype.showModal` and `close` in the test.
  - **`validateLead`:**
    - `validateLead({})` has exactly the keys `name`, `zip`, `email` and `consent`;
    - a valid `{ name: 'Pat', zip: '00000', email: 'pat@example.com', consent: true }` returns `{}`;
    - `{ ..., zip: '2760' }` returns only the `zip` error.
  - **Invalid submit:** shows "Enter your name." and doesn't call `sendLead`.
  - **Valid submit:**
    - calls `sendLead` with `{ name: 'Pat', zip: '00000', email: 'pat@example.com', phone: '', consent: true }`;
    - then shows "Thanks! You're all set.";
    - "Back to the video" emits `close`.
  - **API field error:** `sendLead` rejecting with a 400 and `fieldErrors: { zip: 'Enter a valid value.' }` shows that text under ZIP.
  - **Rate limit:** a 429 rejection shows `RATE_LIMIT_MESSAGE`.
  - **Esc:** dispatching `cancel` on the dialog emits `close`.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/lead.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** `lead.js` and `LeadFormDialog.vue`. The Farm Bureau logo comes from `@/assets/sponsors/farm-bureau.webp`.
- [ ] **Step 4: Run them again.** Expected: PASS.
- [ ] **Step 5: Commit** with the message "Add the Farm Bureau lead form dialog".

---

### Task 9: Watch page

**Files:**
- Create: `src/components/EndScreen.vue`, `src/components/ShareButton.vue`, `src/components/UpNextList.vue`, `tests/unit/watch.test.js`
- Modify: `src/views/WatchView.vue`

**Interfaces:**
- Consumes:
  - `useCatalog`, `fetchEpisode`, `recordPlay`, `upNextFor` and the formatters;
  - `tagLabel`, `WEM_MARK`, `setPageMeta`, `VideoPlayer` (ref with `replay`), `LeadFormDialog` and `NotFoundView`.
- Produces:
  - **`EndScreen`:**
    - props `{ next: Episode|null }`; emits `play-next`, `replay` and `get-quote`;
    - the spec's Up next block and sponsor card, with the copy from the spec.
  - **`ShareButton`:**
    - props `{ url, title }`;
    - **share sheet:** if `navigator.share` exists, it calls `navigator.share({ title, url })` and ignores rejection (the user cancelled);
    - **clipboard fallback:** otherwise it tries `navigator.clipboard.writeText(url)` and shows "Link copied";
    - **manual fallback:** if neither works, it shows the URL in a `<span>` for copying by hand. It never throws.
  - **`UpNextList`:** props `{ episodes }`; compact rows linking to `watch`.
  - **`WatchView` behavior:**
    - **Loading the episode:** uses the catalog when it's loaded, otherwise `fetchEpisode(route.params.key)`. Unknown or locked keys render `NotFoundView`.
    - **Page title:** `setPageMeta({ title: \`${episode.title} · On a WEM · UrbanWild\`, description: episode.description || DEFAULT_DESCRIPTION })`.
    - **Recording plays:** on the player's `ended` event, call `recordPlay(episode.id)` **at most once per episode view**. The flag resets when `route.params.key` changes. Then show `EndScreen` over the player.
    - **End screen actions:**
      - `play-next` does `router.push({ name: 'watch', params: { key: next.key }, query: { autoplay: '1' } })`;
      - `replay` hides the end screen and calls `player.replay()`;
      - `get-quote` opens `LeadFormDialog`.
    - **Autostart:** `route.query.autoplay === '1'` sets the player's `autostart`.
    - **Below the player, in order:**
      - the label `<p>` containing `WEM_MARK`, styled uppercase in CSS;
      - the meta row (animal chip, date, duration);
      - the H1 title;
      - the description, if any;
      - tag links to `{ name: 'episodes', query: { q: tag } }`, labeled `#${tagLabel(tag)}`;
      - `ShareButton` with `url` `https://urbanwild.tv/episodes/${key}`.
    - **Up next:** `UpNextList` with `upNextFor(catalog, episode.id)`.

- [ ] **Step 1: Write the failing tests.**
  - **Setup:**
    - mock `src/lib/api.js`: catalog from fixtures; `fetchEpisode` resolves `null` for unknown keys; `recordPlay` is a `vi.fn()`;
    - stub `VideoPlayer` with a component that exposes `replay: vi.fn()` and a button that emits `ended`.
  - **Episode details:** on `/episodes/lady-eagle-dock-lake-auman`:
    - the label's `textContent` is exactly `WEM_MARK`;
    - the H1 is "Lady Eagle Dock - Lake Auman";
    - the meta row shows "Birds of prey", "May 20, 2022" and "2:36";
    - `document.title` is `Lady Eagle Dock - Lake Auman · On a WEM · UrbanWild`;
    - the `#bald eagle` link goes to `/episodes?q=bald-eagle`.
  - **Play recording:** emitting `ended` twice calls `recordPlay` once, with `1`. After navigating to `/episodes/ninas-chimney-swifts` and emitting `ended`, it's called with `11`.
  - **End screen:** after `ended`:
    - the end screen shows "Nina's Chimney Swifts" as Up next;
    - "Play next" navigates to `/episodes/ninas-chimney-swifts?autoplay=1`;
    - "Replay" calls the stub's `replay`;
    - "Get a free quote" opens the dialog (`showModal` called).
  - **Up next sidebar:** the titles are, in order, Nina's, Jimmy's, then Byron's.
  - **Unknown key:** `/episodes/does-not-exist` renders "We couldn't find that page.".
  - **Share:**
    - with `navigator.share` defined, clicking Share calls it with `{ title: 'Lady Eagle Dock - Lake Auman', url: 'https://urbanwild.tv/episodes/lady-eagle-dock-lake-auman' }`;
    - with neither `share` nor `clipboard`, clicking Share shows that URL as text and throws nothing.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/watch.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement** the three components and `WatchView`. Layout:
  - "← All episodes" link;
  - a two-column flex-wrap: main `flex: 999 1 620px`, sidebar `flex: 1 1 320px`.
- [ ] **Step 4: Run them again.** Expected: PASS. Then run `npm test`, and everything passes.
- [ ] **Step 5: Commit** with the message "Build the Watch page".

---

### Task 10: About page

**Files:**
- Modify: `src/views/AboutView.vue`
- Test: `tests/unit/about.test.js`

**Interfaces:**
- Consumes: the converted assets (Task 4) and `SITE_EMAIL`.

- [ ] **Step 1: Write the failing tests.** Mount `/about`.
  - **Intro:** the H1 is "It started with a turtle.".
  - **Caption cards:** the name/caption pairs, in order, are below. The name label's text is "Susan Ballard"; CSS displays it in caps.
    - Susan Ballard / "Making friends with a raven"
    - Rex Ballard / "Filming, with a barn owl riding shotgun"
    - Rex Ballard / "Lining up the shot"
  - **Team:** all six team entries from the spec render.
  - **Sponsors:** both sponsor cards and the "Become a sponsor" `mailto:urbanwild.wems@gmail.com` link render.
  - **Images:** the page `<img>` alts are exactly the three photo alts plus "NC Farm Bureau Insurance" and "Rucci Productions". There's no photo of Susan and Rex together.
  - **No Get help:** the text "help" doesn't appear anywhere in `<main>`.
- [ ] **Step 2: Run them and confirm they fail.** Run `npx vitest run tests/unit/about.test.js`. Expected: FAIL.
- [ ] **Step 3: Implement `AboutView`** from the spec and `About.dc.html`. Caption cards follow the spec's layout rules:
  - a 48px negative top margin and 16px side insets;
  - `min-height: 96px` with contents vertically centered;
  - never absolutely positioned.
- [ ] **Step 4: Run them again.** Expected: PASS. Then run `npm test`, and everything passes.
- [ ] **Step 5: Commit** with the message "Build the About page".

---

### Task 11: Heroku hosting config and local verification

**Files:**
- Create: `Procfile`, `config/nginx.conf.erb`
- Modify: `README.md` (rewrite: setup, scripts, `VITE_API_BASE_URL`, deploy notes)

**Interfaces:**
- **`Procfile`:** exactly `web: bin/start-nginx-static`.
- **`config/nginx.conf.erb`:** a copy of `https://raw.githubusercontent.com/heroku/heroku-buildpack-nginx/main/config/nginx-static.conf.erb` with these edits:
  - **Delete the "HTTPS Only" `if` block.** Cloudflare already redirects to HTTPS. If its origin mode is "Flexible", this block would loop forever.
  - **Keep** `root /app/dist;`.
  - **Inside `location /`,** enable `error_page 404 = /index.html;`.
  - **Add two locations:**
    - `location /assets/ { add_header Cache-Control "public, max-age=31536000, immutable"; }`
    - `location = /index.html { add_header Cache-Control "no-cache"; }`
  - **Add** `gzip_types text/css application/javascript application/json image/svg+xml;`.

- [ ] **Step 1: Write the config files** above.
- [ ] **Step 2: Validate the nginx config in Docker.** Docker Desktop must be running.

  Run:
  ```bash
  npm run build
  docker run --rm -e PORT=8080 -v "$PWD":/app -w /app ruby:3.4-alpine erb config/nginx.conf.erb > /tmp/uw-nginx.conf
  docker run --rm -v /tmp/uw-nginx.conf:/etc/nginx/nginx.conf:ro -v "$PWD":/app nginx:stable-alpine nginx -t
  ```
  Expected: `syntax is ok` and `test is successful`.
- [ ] **Step 3: Serve it and check the behavior.**

  Run:
  ```bash
  docker run --rm -d --name uw-nginx -p 8080:8080 -v /tmp/uw-nginx.conf:/etc/nginx/nginx.conf:ro -v "$PWD":/app nginx:stable-alpine nginx
  curl -s -o /dev/null -w '%{http_code}\n' localhost:8080/
  curl -s localhost:8080/episodes/lady-eagle-dock-lake-auman | grep -c 'id="app"'
  curl -sI localhost:8080/assets/$(ls dist/assets | grep '\.js$' | head -1) | grep -i cache-control
  curl -sI localhost:8080/ | grep -i cache-control
  docker rm -f uw-nginx
  ```
  Expected, in order:
  1. `200`;
  2. `1` (the SPA fallback works);
  3. `public, max-age=31536000, immutable`;
  4. `no-cache`.
- [ ] **Step 4: Manual QA against the production API** (Andrew).

  Run `npm run build && npx vite preview --port 5173`, open `http://localhost:5173` at 375px and 1440px wide, and check:
  - **Navigation:** every page loads; there are only two nav links; the footer is identical everywhere.
  - **Episodes:** search, chips and sort update the URL, and the URL reloads to the same view.
  - **Watch:** an episode plays to the end and the end screen appears. Plays aren't recorded on localhost; that's expected.
  - **Lead form:** keyboard only (Tab, Shift+Tab, Space, Esc), with ZIP `00000`. A `[TEST]` email arrives at urbanwild.wems@gmail.com.
  - **Share:** shows the copied URL.
  - **Old links:** `/learn?key=lady-eagle-dock-lake-auman` lands on the episode.
  - **404:** `/nope` shows the 404 page.
  - **About:** the caption cards line up.
- [ ] **Step 5: Commit** with the message "Add Heroku nginx config and README".

---

### Task 12: Launch on the existing `urbanwild` app (with Andrew)

**Files:** none. This task is operational.

**Prerequisite:** the API plan's Task 5 is done, so `thumbnail_url`, `duration` and `featured` are live.

- [ ] **Step 1: Find out how `urbanwild` deploys.**

  Run: `heroku releases -a urbanwild -n 3`

  If GitHub auto-deploy is on, merging to `main` starts the deploy. In that case, **finish steps 2 to 4 before merging**.
- [ ] **Step 2: Tag the legacy frontend.**

  Run: `git tag legacy-frontend origin/main && git push origin legacy-frontend`
- [ ] **Step 3: Set the API URL config var.**

  Run: `heroku config:set VITE_API_BASE_URL=https://urbanwild-api.herokuapp.com -a urbanwild`
  Expected: the app restarts. The old site is unaffected.
- [ ] **Step 4: Switch the stack and buildpacks.**

  Run:
  ```bash
  heroku stack:set heroku-24 -a urbanwild
  heroku buildpacks:remove https://github.com/heroku/heroku-buildpack-static -a urbanwild
  heroku buildpacks:add heroku-community/nginx -a urbanwild
  heroku buildpacks -a urbanwild
  ```
  Expected: `1. heroku/nodejs`, `2. heroku-community/nginx`. Nothing changes live until the next build.
- [ ] **Step 5: Merge and deploy.** Merge `redesign` into `main`, then either push to `origin` (auto-deploy) or run `heroku git:remote -a urbanwild && git push heroku main`.

  Expected build log: Node 24.x, `vite build`, and the nginx buildpack. Then `heroku ps -a urbanwild` shows `web.1: up`.
- [ ] **Step 6: Check the live site.**

  Run: `for u in https://urbanwild.tv/ https://www.urbanwild.tv/ https://urbanwild.tv/episodes/lady-eagle-dock-lake-auman https://urbanwild.tv/about; do curl -s -o /dev/null -w "$u %{http_code}\n" "$u"; done`
  Expected: four `200`s. Then, in a browser, `https://urbanwild.tv/learn?key=lady-eagle-dock-lake-auman` lands on the episode.
- [ ] **Step 7: Check plays and leads on production.**
  - **Play counts:** note `play_count` from `curl -s 'https://urbanwild-api.herokuapp.com/api/v1/wems/?key=ninas-chimney-swifts'`, watch that episode to the end on urbanwild.tv, and re-run the curl. Expected: up by exactly 1.
  - **Leads:** submit the lead form with ZIP `00000`. Expected: a `[TEST]` email at urbanwild.wems@gmail.com only.
- [ ] **Step 8: If the dyno crashes or the pages fail,** read `heroku logs --tail -a urbanwild` and fix forward. A heroku-20 rollback isn't guaranteed.

---

### Task 13: Remove the API's temporary play-count bridge

**Files** (in `../urbanwild_api`):
- Modify: `urbanwild/views.py` (`WEMViewSet.get_permissions` and `partial_update`)
- Modify: `urbanwild/tests.py` (`LegacyPlayCountPatchTests`, `ReadOnlyApiTests`)

**Prerequisite:** Task 12 is verified. Old pages cached in visitors' browsers stop recording plays after this, which is acceptable.

- [ ] **Step 1: Change the tests.**
  - Delete the `LegacyPlayCountPatchTests` class.
  - Add to `ReadOnlyApiTests`:

```python
    def test_anonymous_patch_of_play_count_is_rejected(self):
        self.assert_rejected(self.client.patch(f'/api/v1/wems/{self.eagle.id}/', {'play_count': 9999}, format='json'))

        self.eagle.refresh_from_db()
        self.assertEqual(self.eagle.play_count, 62)
```

- [ ] **Step 2: Run it and confirm it fails.**

  Run: `.venv/bin/python manage.py test urbanwild.tests.ReadOnlyApiTests --noinput`
  Expected: FAIL, `204 not found in (401, 403, 405)`.
- [ ] **Step 3: Remove the shim.** Delete the TEMPORARY comment block, `get_permissions` and `partial_update` from `WEMViewSet`.
- [ ] **Step 4: Run the full suite.**

  Run: `.venv/bin/python manage.py test urbanwild --noinput`
  Expected: all pass.
- [ ] **Step 5: Commit, push and verify.**
  - Commit with the message "Remove the temporary PATCH play-count bridge".
  - Andrew pushes to deploy.
  - Then run `curl -s -o /dev/null -w '%{http_code}\n' -X PATCH -H 'Content-Type: application/json' -d '{"play_count":1}' https://urbanwild-api.herokuapp.com/api/v1/wems/1/`. Expected: `403`.
