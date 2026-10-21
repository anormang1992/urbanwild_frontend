import { DEFAULT_DESCRIPTION } from './brand.js'

export function setPageMeta({ title, description = DEFAULT_DESCRIPTION }) {
  if (title) document.title = title
  let meta = document.head.querySelector('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', description)
}

export const SITE_ORIGIN = 'https://urbanwild.tv'

export function setCanonical(path) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', `${SITE_ORIGIN}${path}`)
}
