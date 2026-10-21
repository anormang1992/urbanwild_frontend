// One-off asset conversion. Run: npm install --no-save sharp@0.35.5 && node scripts/make-assets.mjs
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'

const MARK = `<rect width="48" height="48" rx="12" fill="#14231B"/>
  <path d="M10.5 18 C9 11 12 7.5 17 9.5 C19 10.5 20 12 20 14 Z" fill="#9AA8A0"/>
  <path d="M37.5 18 C39 11 36 7.5 31 9.5 C29 10.5 28 12 28 14 Z" fill="#9AA8A0"/>
  <path d="M24 12.5 C32.5 12.5 38.5 16 40.5 22.5 L45 26 L39.5 28.5 C37 35.5 31 40 24 40 C17 40 11 35.5 8.5 28.5 L3 26 L7.5 22.5 C9.5 16 15.5 12.5 24 12.5 Z" fill="#C9D3CC"/>
  <path d="M9.5 23 C13 18.5 19 18 23 21 M38.5 23 C35 18.5 29 18 25 21" fill="none" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>
  <path d="M22.6 12.6 L25.4 12.6 L24.9 22 L23.1 22 Z" fill="#3F4A44"/>
  <path d="M7.5 26 C11 21.5 17.5 21.5 21.5 25 L24 27.5 L26.5 25 C30.5 21.5 37 21.5 40.5 26 C37.5 31 31.5 31.5 27.5 29.5 L24 32 L20.5 29.5 C16.5 31.5 10.5 31 7.5 26 Z" fill="#14231B"/>
  <circle cx="15.5" cy="26" r="1.9" fill="#FFFFFF"/>
  <circle cx="32.5" cy="26" r="1.9" fill="#FFFFFF"/>
  <ellipse cx="24" cy="35" rx="6.2" ry="4.4" fill="#FFFFFF"/>
  <ellipse cx="24" cy="33.4" rx="2.4" ry="1.7" fill="#14231B"/>`

const markSvg = (extra = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"${extra}>\n  ${MARK}\n</svg>\n`

await mkdir('src/assets/about', { recursive: true })
await mkdir('src/assets/sponsors', { recursive: true })

const photos = [
  ['susan_and_raven', 'susan-raven'],
  ['rex_and_owl', 'rex-owl'],
  ['rex_on_set', 'rex-on-set'],
]
for (const [from, to] of photos) {
  await sharp(`src/assets/images/about_page/${from}.png`)
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(`src/assets/about/${to}.webp`)
}

const logos = [
  ['Farm_Bureau_Ad', 'farm-bureau'],
  ['Rucci_Productions_Logo', 'rucci-productions'],
]
for (const [from, to] of logos) {
  await sharp(`src/assets/logos/${from}.png`)
    .resize({ width: 900, withoutEnlargement: true })
    .webp({ quality: 85, alphaQuality: 100 })
    .toFile(`src/assets/sponsors/${to}.webp`)
}

await writeFile('public/favicon.svg', markSvg())
await sharp(Buffer.from(markSvg(' width="180" height="180"')))
  .resize(180, 180)
  .png()
  .toFile('public/apple-touch-icon.png')

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F7F8F3"/>
  <svg x="480" y="120" width="240" height="240" viewBox="0 0 48 48">${MARK}</svg>
  <text x="600" y="486" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="800" font-size="104" letter-spacing="-2" fill="#14231B">Urban<tspan fill="#3B7A2B">Wild</tspan></text>
</svg>`
await sharp(Buffer.from(og)).png().toFile('public/og-image.png')
