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
