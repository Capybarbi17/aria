export function generateSlug(title) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)

  const suffix = Math.random().toString(36).slice(2, 8)
  return base ? `${base}-${suffix}` : `programme-${suffix}`
}

export function getApplyUrl(slug) {
  return `${window.location.origin}/apply/${slug}`
}
