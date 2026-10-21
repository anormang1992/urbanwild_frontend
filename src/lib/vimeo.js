export function embedUrl(videoLink, { autoplay = false } = {}) {
  const url = new URL(videoLink)
  url.searchParams.set('title', '0')
  url.searchParams.set('byline', '0')
  url.searchParams.set('portrait', '0')
  if (autoplay) url.searchParams.set('autoplay', '1')
  return url.toString()
}
