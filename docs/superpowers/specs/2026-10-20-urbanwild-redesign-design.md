# UrbanWild frontend redesign: design

- **Date:** 2026-10-20
- **Owner:** Andrew Greene (webmaster), building for Susan and Rex Ballard
- **Visual reference:** clickable mockup at https://claude.ai/artifact/5YcJGK1GutCPjoXWzHX4JP. Its page sources are copied to `2026-10-20-urbanwild-redesign-mockup/` beside this file (reference only: image URLs inside them point at the mockup's asset store and won't load elsewhere).
- **Related repo:** `../urbanwild_api` (Django REST API, already upgraded to Django 6.1 / Python 3.14 and made read-only in October 2026).

## Why

UrbanWild (urbanwild.tv) is a small non-profit site run by Susan and Rex Ballard, two TV producers in Raleigh, NC. It hosts **On A WEM (Wildlife Educational Moment)** episodes: short Vimeo films made with licensed wildlife rehabilitators.

The current frontend was built in 2021–22 with Vue CLI 4 on Node 16. It:

- **Can't be deployed.** The Heroku app is on the end-of-life heroku-20 stack, which blocks new builds, and it uses the deprecated `heroku-buildpack-static`.
- **Looks dated.** Andrew calls the logo childish, and the pages are a collage of background photos and overlays.
- **Repeats itself.** The home page had several redundant routes into the same video library.
- **Doesn't state the trademark phrase.** Susan is renewing the registered "On a WEM(Wildlife Educational Moment)" trademark. Her lawyer says the exact phrase must appear on the site, because the mark covers online instruction in the field of wildlife. The videos already open with On A WEM front matter, and nobody wants to re-edit them.

## Goals

1. A clean, professional site whose main job is watching On A WEM episodes, plus an About page for the story, team and sponsors.
2. The registered wordmark "On a WEM(Wildlife Educational Moment)" appears exactly as registered in the places listed under [Trademark phrase](#trademark-phrase).
3. Deployable again, on the **same Heroku app** (`urbanwild`), so urbanwild.tv and www.urbanwild.tv keep working through Cloudflare with no DNS changes.
4. Keep what works today:
   - play counting;
   - the NC Farm Bureau sponsor end screen and lead form;
   - shareable links to individual episodes;
   - all content managed in the Django admin.

## Non-goals (v1)

- **Get help / rescue guide / rehabilitator lookup.** Deferred: Andrew has his own plans for the rehabilitator lookup. No links, routes or placeholders for it in v1.
- **News or "Wildlife Stories" posts.** The API's `Post` model has zero posts, and nothing links to it.
- **Global search across content types.** Search lives only on the Episodes page.
- **Series pages.** No series exist in the data.
- **"Coming soon" / locked episodes UI.** No locked episodes exist today. The frontend only ever requests unlocked ones.
- **Per-episode link previews** (Open Graph tags that differ per episode). That needs prerendering or server-side injection, so v1 uses site-wide preview tags.
- **Re-editing videos, user accounts, comments.**

## Anti-goals (would make this a failure even if it works)

- Play counts stop being recorded, or Farm Bureau leads stop arriving, during or after cutover.
- urbanwild.tv goes down because of DNS or Cloudflare changes. None are needed; don't make any.
- A ™ or ® symbol next to the phrase. Andrew removed it for now and may add it back later.
- Redundant navigation creeping back: several buttons on one page that all go to the same place.

## Decisions made by Andrew

- Keep **Vue**.
- Stay on **Heroku**:
  - reuse the existing `urbanwild` app and its custom domains;
  - move it to `heroku-24`;
  - replace the static buildpack with `heroku-community/nginx`.
- **Drop the Get help side** for now.
- **Home**, one entry point per purpose:
  - a featured episode;
  - the latest three;
  - a single "See all" link;
  - the story and sponsor sections.
- **Nav:** just **Episodes** and **About**.
- **Logo:** use **mark B** (the geometric raccoon) with the "UrbanWild" wordmark. Source is in the [appendix](#appendix-a-logo).
- **Trademark phrase:** include it **exactly as registered**: lowercase "a", no space before the parenthesis, no symbol. The footer says it "is a registered trademark of Ballard Productions LLC".
- **About page:**
  - no photo of Susan and Rex at the top (the existing one is grainy);
  - the three behind-the-scenes photos get the caption-card treatment shown in the mockup.
- **The mockup as it stands is approved.**
- **The footer** is identical on every page.
- **No separate staging site.** Verify locally before launch.
- **Lead form:**
  - **No street address.** The form stays short.
  - **Test switch:** ZIP `00000` goes only to the site inbox, so the form can be tested without emailing real Farm Bureau agents.

## Technical constraints

- **API:** `https://urbanwild-api.herokuapp.com`, read-only.
  - The only public writes are `POST /api/v1/wems/{id}/play/` and `POST /send-lead-message/`.
  - CORS origins come from the API's `CORS_ALLOWED_ORIGINS` config var.
- **Videos:** hosted on Vimeo. `video_link` looks like `https://player.vimeo.com/video/<id>?h=<hash>` (unlisted videos carry the `h` hash).
- **Dynos:** both Heroku apps run on Eco dynos, which sleep after about 30 minutes idle and share one monthly hours pool.
- **Editors:** Susan and Andrew edit content only in the Django admin.

## Stack (builder may adjust within these lines)

- Vue 3 (Composition API, `<script setup>`), Vue Router 5 (the current major; same `createRouter` API as v4, with no breaking changes for this usage), Vite, Tailwind CSS 4.
- Node 24 LTS, pinned in `package.json` `engines`.
- `@vimeo/player` from npm, replacing the global `player.vimeo.com/api/player.js` script tag.
- **Drop:**
  - `moment` (use `Intl.DateTimeFormat`);
  - the Font Awesome kit (use inline SVG icons);
  - `@cloudgeek/vue3-video-player`;
  - Vue CLI and Babel;
  - `sass`, unless the builder wants it.
- **HTTP:** the builder may use `fetch` or current `axios`.
- **State:** no Pinia needed. Page state lives in components, and Episodes filter state lives in the URL query.
- **Rebuild, don't upgrade.** Scaffold fresh rather than upgrading Vue CLI in place, keeping the git history. Carry over only the assets listed under [Assets](#assets).

## Routes and information architecture

| Path | Page | Notes |
|---|---|---|
| `/` | Home | |
| `/episodes` | Episodes library | Filter state in query: `q`, `animal`, `sort` |
| `/episodes/:key` | Watch | `key` is the WEM's slug (`WEM.key`) |
| `/about` | About | |
| `/learn` | redirect | → `/episodes`. With `?key=K` → `/episodes/K`, so links the old site shared keep working |
| anything else | 404 page | Friendly message and a link to Episodes |

**Header, on every page:**
- logo (links home) on the left;
- nav on the right: **Episodes**, **About**;
- the current page is marked with a 3px green underline and `aria-current="page"`;
- sticky, with a bottom border.

**Footer, on every page:**
- logo, plus the one-line mission: "UrbanWild is a non-profit based in Raleigh, North Carolina, dedicated to rescuing and protecting wildlife from the threats of urbanization.";
- an Explore column (Episodes, About);
- a Contact column (`urbanwild.wems@gmail.com`);
- a bottom rule with "© {current year} UrbanWild · Ballard Productions LLC", then the trademark line.

The footer is **identical on every page**, including Episodes and Watch. Andrew asked for this; no compact variant.

## Visual system

Match the mockup. The tokens:

**Color**

| Token | Value | Use |
|---|---|---|
| ink | `#14231B` | Body text, headings |
| muted | `#4B5B53` | Secondary text (passes AA on paper) |
| text-strong | `#33443B` | Long-form body on white |
| paper | `#F7F8F3` | Page background |
| surface | `#FFFFFF` | Cards |
| line | `#DCE3D8` | Borders and dividers |
| line-strong | `#C9D3C4` | Input and chip borders |
| footer | `#E8EEE3` | Footer background (rule `#D3DCCD`) |
| forest | `#10221A` | Dark bands (Episodes header, thank-you band) |
| on-forest | `#C9D8CE` / `#E3ECE6` | Text on forest |
| leaf | `#A9D79A` | Accent text on forest |
| green | `#3B7A2B` | Primary buttons, accent words, active nav underline |
| green-text | `#2F6322` | Green text and links on light backgrounds |
| green-soft | `#E3EFDA` | Chips, soft panels |
| blue-text | `#135C90` | Secondary accent (Rex's caption badge, alternate team avatars) |
| blue-soft | `#E1EEF8` | Secondary soft background |

**Type**
- **Families:** Bricolage Grotesque (weights 600/700/800, optical-size axis) for headings and display; Figtree (400–700) for everything else. Self-host or use Google Fonts; builder's call.
- **Page H1:** `clamp(44px, 5.6vw, 78px)`, weight 800, line-height 1.02, letter-spacing −0.025em.
- **Section H2:** 40–44px, weight 800.
- **Card titles:** 20–22px, weight 700.
- **Body:** 17px, line-height 1.55. Lede 19–20px.
- **Eyebrow labels:** 12–14px, weight 700–800, uppercase, letter-spacing 0.08–0.1em, in green-text (or leaf on forest).

**Shape and layout**
- **Content width:** max 1240px with 24px side padding. Long-form text columns max 760px.
- **Section spacing:** 88–96px vertical.
- **Radius:**
  - pills, buttons, chips and avatars: 999px;
  - small cards and thumbnails: 16px;
  - large media and panels: 24–28px.
- **Buttons:** pill-shaped, at least 44px tall (52px for primary hero actions).
- **Grids:** `repeat(auto-fill, minmax(min(100%, 280–300px), 1fr))`.
- **Shadows:** used sparingly, only on floating cards. The caption cards use `0 10px 28px rgba(16,34,26,.14)`.

**Icons:** inline stroke SVGs (play, arrow, search, share, close, pause, fullscreen). No icon font, no emoji.

## Pages

### Home

1. **Hero**, two columns that stack on mobile:
   - **Left column:**
     - pill "Wildlife education · Raleigh, NC";
     - H1 "Saving the **wild**, one **life** at a time." (the bolded words in green);
     - lede "Short films about the animals that share our neighborhoods, made alongside the licensed wildlife rehabilitators who care for them."
     - **No buttons.**
   - **Right column:** the **featured episode** as one large link to its Watch page:
     - a 16:10 thumbnail with a centered play disc and a duration badge;
     - under it, the "Featured episode" eyebrow, the title, and the "{animal label} · {release date}" line.
2. **Latest episodes:**
   - H2 "Latest episodes", with one "See all {N} episodes →" link on the right. N is the API count of unlocked episodes.
   - Three cards: the newest released, excluding the featured episode. Each card shows a 16:9 thumbnail with a duration badge, an animal chip and the title (no date), and links to its Watch page.
3. **Our story band** (white):
   - the photo of Rex filming with a barn owl;
   - eyebrow "Our story", H2 "Two TV producers, one turtle, and a lot of wildlife stories.";
   - two short paragraphs (copy in mockup), then a "Read our story →" link to About.
4. **Sponsor:**
   - "Proudly supported by" over the NC Farm Bureau logo in a white card;
   - "Want to help bring wildlife education to more families? Talk to us about sponsorship." The link is a mailto to `urbanwild.wems@gmail.com`.

**Featured episode rule:** use the most recently released episode with `featured = true`. If none is flagged, use the most recently released episode.

### Episodes (`/episodes`)

1. **Forest-colored header band:**
   - **H1:** "On a WEM", with "(Wildlife Educational Moment)" on a second, smaller line in leaf green. Both parts sit in the **same `<h1>`**, with **no space** between them in the text, so the accessible name and the page text read exactly "On a WEM(Wildlife Educational Moment)". The accessible name is provided with `aria-label="On a WEM(Wildlife Educational Moment)"` on the `<h1>`, because the second line is a block box and some browsers' accessibility trees otherwise insert a space before it. This is a trademark placement.
   - **Lede:** "Short films about the animals in your backyard, made alongside the licensed rehabilitators who care for them."
   - **Featured episode:** a large thumbnail with a play button, plus the "Featured episode" pill, date, animal, title and a "Play episode" button. It uses the same featured-episode rule as Home.
     - **Always shown,** whatever the search, animal or sort. Andrew's call: hiding it while filtering made the page jump, and the feature is featured for a reason.
     - **Also listed in the grid** like any other episode.
2. **Toolbar** (wraps on mobile):
   - **Search input:** matches title, description, tags and animal label, case-insensitive.
   - **Animal chips:** "All" plus one chip per animal class that has at least one unlocked episode, each with a count. The selected chip is filled ink. Chips are toggle buttons with `aria-pressed`.
   - **Sort select:** Newest first (default), Oldest first, Most watched, A to Z.
3. **Results heading:** "All episodes" in the default view. Otherwise "{n} episode(s)", plus ` for "{q}"` when there's search text.
4. **Grid:** the same cards as Home. A card opens `/episodes/:key`.
5. **Empty state:** "Rats! Nothing matched that search." / "Try another animal, or clear your filters to see every episode." / a "Clear filters" button.

**Filter state** lives in the URL query (`?q=&animal=&sort=`). Use `router.replace` while the user types, so filtered views can be shared and back/forward works.

**Animal class labels.** The API stores `WEM.animal_class` values; display them as:

| API value | Label |
|---|---|
| Bird | Birds |
| Raptor | Birds of prey |
| Mammal, Small | Small mammals |
| Mammal, Large | Large mammals |
| Reptile | Reptiles |
| Amphibian | Amphibians |
| Fish | Fish |

### Watch (`/episodes/:key`)

1. "← All episodes" link, back to `/episodes` (keeping any previous query if practical).
2. **Two columns** that stack on mobile: the main column, plus an "Up next" sidebar about 320px wide.
3. **Player:** a Vimeo embed via `@vimeo/player`, 16:9, radius 20px, built from `video_link` (keep its `h` parameter; add `title=0&byline=0&portrait=0`).
   - **Use Vimeo's native controls.** The control bar drawn in the mockup was only a stand-in for a real player; don't build custom controls.
   - **Before playback**, show the poster from the mockup: the thumbnail, a centered play disc and a duration badge. Pressing it loads the Vimeo player and starts playback. This also keeps the page light.
   - When the video **ends**:
     - **Record a play:** send `POST /api/v1/wems/{id}/play/` once per page view of that episode. Don't count replays in the same view, and don't retry on failure.
     - **Show the end screen** over the player, on a forest background. Where the player is too narrow for it to fit (phones, and narrow two-column layouts), it sits directly below the player instead, so nothing has to scroll inside the 16:9 box:
       - **Up next:** the next episode's thumbnail and title, with "Play next" and "Replay" buttons.
       - **Sponsor card** (white): "This episode is supported by", the Farm Bureau logo, the line "Home, auto, life and farm insurance from people who share our love of North Carolina's wild places.", and a "Get a free quote" button that opens the lead form.
   - **"Next" episode:** the first item in the "Up next" list (see below). That's the next *older* episode, wrapping around to the newest after the oldest, so "Play next" walks the whole catalog instead of bouncing between the two newest.
4. **Below the player, in order:**
   - **Trademark label:** "On a WEM(Wildlife Educational Moment)" as an uppercase green eyebrow. It renders "ON A WEM(WILDLIFE EDUCATIONAL MOMENT)", identical to the registered wordmark. This is a trademark placement.
   - **Meta row:** animal chip, release date, duration.
   - **H1:** the episode title.
   - **Description,** if any.
   - **Tag buttons** (`#bald eagle`, etc.). Clicking one goes to `/episodes?q={tag}`.
   - **Share button:** uses `navigator.share` where available, otherwise copies `https://urbanwild.tv/episodes/{key}` to the clipboard. The label changes to "Link copied" and the URL shows beside it.
5. **Up next sidebar:** every other unlocked episode. Start with the one after the current episode in newest-first order, continue to the oldest, then wrap round to the newest. Each is a compact row (144px thumbnail with duration, title, "{animal} · {date}").
6. **Unknown or locked key:** the 404 page.
7. **Page title:** `{episode title} · On a WEM · UrbanWild`.

### Lead form (modal, opened from the end screen)

- Accessible dialog with a focus trap. Esc and the close button close it, and focus returns to the trigger.
- **Contents:**
  - the Farm Bureau logo;
  - H2 "Helping you is what we do best.";
  - intro "Home, auto, life and health insurance, plus farm, crop, commercial and personal liability policies. Leave your details and a local agent will be in touch.";
  - fields: **Full name**, **ZIP code**, **Email**, **Phone**;
  - a consent checkbox, "I agree to be contacted by an NC Farm Bureau agent about insurance products.", required to submit;
  - a "Request my quote" button.
- **Client-side validation mirrors the API:** name required; ZIP as 5 digits or ZIP+4; at least one of email or phone; email format when given.
- **Phone formatting:** the phone field formats US numbers as they're typed, as "(828) 262-2605", and sends the formatted value, so agents see it formatted in the email. A phone number that's given must have 10 digits ("Enter a 10-digit phone number."). Andrew asked for this.
- **Submitting:** `POST /send-lead-message/` with `{name, zip, email, phone, consent: true}`.
- **Consent is recorded.**
  - The API accepts an optional `consent` boolean. It must stay optional, so the old frontend keeps working until cutover.
  - The agents' email gets a "Consent to contact: Yes" line when it's true.
  - The email template drops lines for blank fields, such as Address.
  - This API change ships with the other API changes, before the frontend launches.
  - **400:** show the API's field errors.
  - **429:** "You've sent a few requests already. Please try again later."
  - **Success:** "Thanks! You're all set." / "A local NC Farm Bureau agent will reach out soon. Thanks for supporting wildlife education." / "Back to the video".

### About (`/about`)

1. **Intro**, text only, in a 760px column:
   - eyebrow "About UrbanWild";
   - H1 "It started with a turtle.";
   - lede "Susan and Rex Ballard have been television producers for more than three decades. About ten years ago, they turned their cameras on the people who give injured wildlife a second chance."
2. **Story:** three paragraphs plus the pull quote "Visual education would be paramount to protecting the wildlife around us." Copy in mockup.
3. **Behind the scenes:**
   - eyebrow "Behind the scenes", H2 "Out in the field";
   - three photos (4:5, radius 24px), each with a **caption card**:
     - **Layout:** a white card that overlaps the bottom of its photo by exactly 48px and is inset 16px left and right. Every card has a minimum height of 96px, with its contents vertically centered, so cards line up whether the caption is one line or two. Don't pin the cards to the photo's bottom edge: that misaligns them when captions wrap.
     - **Contents:** a 40px initials badge, a small uppercase name label in the badge's color, and the caption in Bricolage 18px/700.
   - The three captions:
     - **Susan Ballard** (green badge "S"): "Making friends with a raven"
     - **Rex Ballard** (blue badge "R"): "Filming, with a barn owl riding shotgun"
     - **Rex Ballard** (blue badge "R"): "Lining up the shot"
4. **The team:** H2 "Our awesome team of talented humans", then a grid of cards, each with an initials avatar (alternating green and blue), a name and a role:
   - Susan & Rex Ballard: founders & producers
   - Scott Rucci: chief video editor, Rucci Productions
   - Henry Wong: animation
   - Andy Poe: video production support
   - David Franks: website consultant
   - Andrew Greene: webmaster
5. **Thank-you band** (forest): the thank-you to rehabilitation clinics, hospitals and sanctuaries, signed "With eternal thanks, Susan and Rex".
6. **Sponsors & partners:**
   - an NC Farm Bureau card (founding sponsor, with the Patrick Cusack story);
   - a Rucci Productions card (production partner);
   - a "Want to support wildlife education in North Carolina? / Become a sponsor" panel (mailto).

## Trademark phrase

- **The registration:** USPTO serial 88593927, live and registered, class 041 (educational services, namely online instruction in the field of wildlife). The owner is Ballard Productions LLC, a North Carolina LLC.
- **Exact text:** "On a WEM(Wildlife Educational Moment)".
  - This matches the registration drawing: lowercase "a", **no space** before "(".
  - The registered wordmark reads "ON A WEM(WILDLIFE EDUCATIONAL MOMENT)".
  - Keep the phrase in **one constant** so any change the lawyer asks for is one line.
  - No symbol for now. If one is added later, use ®, because the mark is registered.
- **Placements:**
  1. The Episodes page H1, as two visual lines but one heading whose text is exactly the phrase.
  2. The eyebrow label above every episode's metadata on its Watch page, displayed uppercase via CSS. The underlying text is the phrase.
  3. The footer on every page: "On a WEM(Wildlife Educational Moment) is a registered trademark of Ballard Productions LLC."
- The phrase must be **real text in the HTML**, not baked into an image.

## Data and API

**Calls the frontend makes** (base URL from `VITE_API_BASE_URL`; production `https://urbanwild-api.herokuapp.com`):
- `GET /api/v1/wems/?wem_locked=False&limit=100`: the whole public catalog, currently 9 episodes. Fetch it once and filter and sort on the client. Re-evaluate if the catalog passes ~100.
- `GET /api/v1/wems/?wem_locked=False&key={key}`: a single episode for direct loads of `/episodes/:key`. The list can be reused when it's already loaded.
- `POST /api/v1/wems/{id}/play/`: 204 on success.
- `POST /send-lead-message/`: 200 on success, 400 with field errors, 429 when rate-limited.

**Episode fields used:** `id`, `key`, `title`, `description`, `video_link`, `animal_class`, `tags` (slugs), `play_count`, `released_at`, `wem_locked`, plus the new fields below. Sort "Newest" uses `released_at`, which can be null; nulls sort last.

**API changes required** (in `../urbanwild_api`, test-first, same style as the upgrade):
1. **`thumbnail_url`** (URLField, blank) and **`duration`** (positive int seconds, null).
   - Filled from Vimeo oEmbed (`https://vimeo.com/api/oembed.json?url=https://vimeo.com/<id>`) when an episode is saved in the admin and either field is blank or `video_link` changed.
   - Plus a `backfill_vimeo_metadata` management command for the existing episodes.
   - oEmbed by bare video ID worked for all 9 current (unlisted) videos in October 2026.
   - Request a ~1280px thumbnail. The frontend may swap the size suffix for smaller cards.
   - If Vimeo is unreachable, the save still succeeds, with the fields left blank.
2. **`featured`** (BooleanField, default false): an admin checkbox, plus a `?featured=true` filter.
3. **Sort by plays:** `plays` / `-plays` sort keys in `SortFilter`, mapping to `play_count`.
4. **Lead endpoint:**
   - **Test ZIP:** a submission with ZIP `00000` is emailed **only** to `urbanwild.wems@gmail.com`, with "[TEST]" in the subject. It skips Ultimatecrane@aol.com and every agent.
   - **Consent:** the optional `consent` field described under the lead form.
   - **Template:** the email omits blank lines.
   - **Tests:** cover the test ZIP, the normal routing for Mills River and Asheville, and the old frontend's payload without `consent`.
5. **Admin conveniences for Susan:** `WEMAdmin` gets `list_display` (title, animal class, released, featured, locked, plays), `list_filter` (animal class, featured, locked) and `search_fields` (title, tags).
6. **After launch:** remove the temporary `partial_update` / `get_permissions` shim in `WEMViewSet` and its tests. That shim counts the old frontend's `PATCH {"play_count": N}` as one play.

## SEO, sharing, accessibility

- **Page titles and meta descriptions:** set per route. Site-wide Open Graph and Twitter tags in `index.html` (site name, description, a share image built from the logo).
- **Canonical host:** `https://urbanwild.tv`.
- **Accessibility:**
  - WCAG 2.2 AA contrast; the palette above passes on its intended backgrounds;
  - visible focus styles, a skip link, keyboard-operable everything;
  - 44px minimum touch targets;
  - real buttons and links;
  - `aria-label` on icon-only buttons;
  - meaningful `alt` on photos; decorative thumbnails get empty alt beside a visible title.
- **Responsive:**
  - every page works from 360px wide up;
  - no horizontal scroll;
  - the header nav stays visible at phone width (two links fit, no hamburger needed).

## Assets

- **Keep:**
  - `src/assets/images/about_page/rex_and_owl.png`, `susan_and_raven.png`, `rex_on_set.png`, converted to WebP/AVIF at ≤ 1600px, about 200KB each or less;
  - `src/assets/logos/Farm_Bureau_Ad.png`;
  - `src/assets/logos/Rucci_Productions_Logo.png`.
- **Don't carry over:**
  - the old logos;
  - the 9.8MB `uw_animated_logo.mp4`;
  - the background photos (`*_bg.*`);
  - `the_ballards.png`;
  - `active_link_owl.png`.
  
  They stay in git history.
- **Episode thumbnails:** from Vimeo's CDN via `thumbnail_url`, lazy-loaded below the fold, with fixed aspect-ratio boxes so layout doesn't shift.
- **Logo:** inline SVG, from the [appendix](#appendix-a-logo). Also produce a favicon (mark only) and an Apple touch icon.

## Hosting and deploy

**Production:** the existing Heroku app `urbanwild`, which serves urbanwild.tv and www.urbanwild.tv via Cloudflare. Leave both domains and DNS alone.

- **Stack:** `heroku-24`.
- **Buildpacks, in order:**
  1. `heroku/nodejs`, which runs `npm run build` and outputs to `dist/`;
  2. `heroku-community/nginx`, in static mode.
- **`Procfile`:** `web: bin/start-nginx-static`.
- **`config/nginx.conf.erb`**, from the buildpack's static template:
  - document root `dist`;
  - SPA fallback `error_page 404 = /index.html;`;
  - `Cache-Control: public, max-age=31536000, immutable` for `/assets/*`;
  - `no-cache` for `index.html`;
  - gzip on;
  - a 301 for `/learn` and `/learn?key=K`, if done at nginx rather than in the router (builder's choice; one is enough).
- **Config var:** `VITE_API_BASE_URL`, available at build time.

**No staging site** (Andrew's decision). Verify before launch with a local production build against the production API:
- **CORS:** the API's default allowed origins already include `http://localhost:5173` and `http://localhost:8080`. Production doesn't set `CORS_ALLOWED_ORIGINS`, so the defaults apply. Serve the local preview on one of those ports, for example `vite preview --port 5173`.
- **Play counts:** only record plays when the site runs on urbanwild.tv or www.urbanwild.tv, so local testing doesn't inflate them. The builder decides how.
- **Lead tests:** use ZIP `00000`, locally and after launch.

**Cutover:**
1. Verify the redesign locally, as above.
2. Run:
   ```sh
   heroku stack:set heroku-24 -a urbanwild
   heroku buildpacks:remove https://github.com/heroku/heroku-buildpack-static -a urbanwild
   heroku buildpacks:add heroku-community/nginx -a urbanwild
   ```
3. Merge to `main` and deploy.

The stack change only takes effect on the next build. If that build fails, the current site keeps running. Rolling back to a heroku-20 release after a successful heroku-24 deploy isn't guaranteed, so fix forward. Before cutover, tag the current `main` as `legacy-frontend` for reference.

**After launch:**
- Remove the API play-count shim.
- Confirm plays are still counted.
- On production:
  - submit a lead with ZIP `00000` and confirm it reaches urbanwild.wems@gmail.com;
  - watch an episode to the end and confirm its play count rose by one.
- Watch the Eco hours pool, which both apps share.

## Testing

- **Vitest + Vue Test Utils for logic and components:**
  - search, filter and sort, including null `released_at`;
  - featured-episode selection and its fallback;
  - the animal-label mapping;
  - legacy `/learn` redirects;
  - the play call fires exactly once per view on `ended`;
  - lead-form validation and API error handling, including 429;
  - the trademark phrase is rendered in all three placements (guards against accidental removal).
- **API changes:** Django tests, as in the upgrade.
- **Before cutover:** a short manual QA pass on the local production build at phone and desktop widths, including keyboard-only use of the lead form (with ZIP `00000`).

## Content tasks for Susan (parallel; not blocking the build)

- Descriptions for the 4 episodes that have none: Nina's Chimney Swifts; Elissa's Baby Bird Caught in a Nest; Dr. Joni, Sky Bird, and Curly the Vulture; Big Boy Herring Gull.
- Pick the featured episode. The mockup used Lady Eagle Dock - Lake Auman.
- Final approval of logo mark B.
- Optional: ask the lawyer whether the missing space in "WEM(" must be reproduced. The site reproduces it for now.
- Optionally tidy tags in the admin (`bird`/`birds`, `drjoni`/`dr-joni`).

## Calls made in this design (not from Andrew; check these)

- **Featured fallback:** with nothing flagged, use the newest episode.
- **Client-side catalog:** load all episodes once and filter in the browser.
- **Legacy redirect:** `/learn?key=K` → `/episodes/K` to preserve old share links.
- **Episode URL:** `/episodes/:key`, replacing `/learn?key=`.
- **Locked episodes:** never shown.
- **Lead form:** a required consent checkbox is added.
- **Share:** uses the native share sheet when available.
- **Player:** Vimeo's native controls, behind a click-to-play poster. No custom control bar.
- **Lead consent:** recorded in the agents' email through an optional `consent` field on the API.
- **"Play next":** walks to the next older episode and wraps round, rather than always going to the newest.
- **Previews:** site-wide only, no per-episode Open Graph in v1.
- **Local checks:** plays are only recorded on the production hostnames, and test leads are flagged "[TEST]" in the subject.
- **Stack:** Node 24, Tailwind 4, `@vimeo/player`; `moment`, Font Awesome and Vue CLI dropped.

## Left to the builder

- Component breakdown and file structure.
- `fetch` vs `axios`.
- Self-hosted vs Google Fonts.
- The image conversion tooling.
- Where the `/learn` redirect lives: router or nginx.
- Test granularity beyond the list above.
- Exact responsive breakpoints, as long as the 360px+ rule holds.

## Appendix A: logo

**Mark B (raccoon).** `viewBox="0 0 48 48"`, shown at 40px in the header and 36px in the footer, beside the wordmark "Urban" (ink) + "Wild" (green `#3B7A2B`) in Bricolage Grotesque 800, letter-spacing −0.02em, 26px in the header and 23px in the footer.

```html
<svg viewBox="0 0 48 48" aria-hidden="true">
  <rect width="48" height="48" rx="12" fill="#14231B"/>
  <path d="M10.5 18 C9 11 12 7.5 17 9.5 C19 10.5 20 12 20 14 Z" fill="#9AA8A0"/>
  <path d="M37.5 18 C39 11 36 7.5 31 9.5 C29 10.5 28 12 28 14 Z" fill="#9AA8A0"/>
  <path d="M24 12.5 C32.5 12.5 38.5 16 40.5 22.5 L45 26 L39.5 28.5 C37 35.5 31 40 24 40 C17 40 11 35.5 8.5 28.5 L3 26 L7.5 22.5 C9.5 16 15.5 12.5 24 12.5 Z" fill="#C9D3CC"/>
  <path d="M9.5 23 C13 18.5 19 18 23 21 M38.5 23 C35 18.5 29 18 25 21" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M22.6 12.6 L25.4 12.6 L24.9 22 L23.1 22 Z" fill="#3F4A44"/>
  <path d="M7.5 26 C11 21.5 17.5 21.5 21.5 25 L24 27.5 L26.5 25 C30.5 21.5 37 21.5 40.5 26 C37.5 31 31.5 31.5 27.5 29.5 L24 32 L20.5 29.5 C16.5 31.5 10.5 31 7.5 26 Z" fill="#14231B"/>
  <circle cx="15.5" cy="26" r="1.9" fill="#FFFFFF"/>
  <circle cx="32.5" cy="26" r="1.9" fill="#FFFFFF"/>
  <ellipse cx="24" cy="35" rx="6.2" ry="4.4" fill="#FFFFFF"/>
  <ellipse cx="24" cy="33.4" rx="2.4" ry="1.7" fill="#14231B"/>
</svg>
```

The header logo is a link with `aria-label="UrbanWild home"`. The SVG is decorative, and the wordmark text gives the accessible name.
