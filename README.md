# urbanwild.tv

The front end for urbanwild.tv, the home of "On a WEM(Wildlife Educational Moment)" episodes. It is a Vue 3 single-page app (Vite, Tailwind 4) that reads the episode catalog from the Urban Wild API and plays episodes from Vimeo.

## Requirements

- Node 24 (`24.x`) and npm 10 or newer

## Setup

```
npm install
```

## Scripts

- `npm run dev` starts the Vite dev server with hot reload.
- `npm run build` writes the production site to `dist/`.
- `npm run preview` serves the built `dist/` locally.
- `npm test` runs the unit tests (Vitest).

## Configuration

`VITE_API_BASE_URL` sets the API the app talks to. It defaults to `https://urbanwild-api.herokuapp.com`. Set it at build time, for example in a `.env.local` file.

## Hosting

Production runs on the Heroku app `urbanwild` (stack heroku-24) with two buildpacks, in this order:

1. `heroku/nodejs` runs `npm run build`, which produces `dist/`.
2. `heroku-community/nginx` serves `dist/` as a static site.

`Procfile` starts nginx (`web: bin/start-nginx-static`). `config/nginx.conf.erb` is the nginx config: it serves `/app/dist`, falls back to `index.html` for client-side routes, caches `/assets/` for a year (the files are fingerprinted), and sends `index.html` with `no-cache`.

Cloudflare sits in front of Heroku for `urbanwild.tv` and `www.urbanwild.tv` and redirects HTTP to HTTPS at its edge. The nginx config deliberately has no HTTPS redirect of its own; with Cloudflare's "Flexible" origin mode, one would redirect forever.

To check the nginx config locally, render it with `erb` and run `nginx -t` in the `nginx:stable-alpine` image, with the repo mounted at `/app`.

## Before launch

Run `npm run build && npx vite preview --port 5173`, open `http://localhost:5173` at 375px and 1440px wide, and check:

- [ ] **Navigation:** every page loads; there are only two nav links; the footer is identical everywhere.
- [ ] **Episodes:** search, chips and sort update the URL, and the URL reloads to the same view.
- [ ] **Watch:** an episode plays to the end and the end screen appears. Plays aren't recorded on localhost; that's expected.
- [ ] **Lead form:** keyboard only (Tab, Shift+Tab, Space, Esc), with ZIP `00000`. A `[TEST]` email arrives at urbanwild.wems@gmail.com.
- [ ] **Share:** shows the copied URL.
- [ ] **Old links:** `/learn?key=lady-eagle-dock-lake-auman` lands on the episode.
- [ ] **404:** `/nope` shows the 404 page.
- [ ] **About:** the caption cards line up.
