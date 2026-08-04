const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
const FETCH_TIMEOUT_MS = 2500

async function strapiFetch(path) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(`${STRAPI_URL}/api/${path}`, { signal: controller.signal })
    if (!res.ok) throw new Error(`Strapi request failed: ${res.status}`)
    const json = await res.json()
    return json
  } finally {
    clearTimeout(timeout)
  }
}

const mediaUrl = (media) => {
  if (!media?.url) return null
  return media.url.startsWith('http') ? media.url : `${STRAPI_URL}${media.url}`
}

// Throws on any failure (network, timeout, empty data) — callers are expected
// to fall back to the static content in i18n/translations.jsx.
// Paginated + optionally filtered by category so the menu page never has to
// pull the entire catalog over the wire at once. Each entry holds both
// languages at once (nameEn/nameAr, etc.) — the caller's locale picks which
// side is projected into the flat `name`/`description`/`category` shape.
export async function fetchMenuItems(locale, { category, page = 1, pageSize = 10 } = {}) {
  const categoryField = locale === 'ar' ? 'categoryAr' : 'categoryEn'
  const params = new URLSearchParams({
    populate: 'image',
    sort: 'order:asc',
    'pagination[page]': page,
    'pagination[pageSize]': pageSize
  })
  if (category) params.set(`filters[${categoryField}][$eq]`, category)

  const json = await strapiFetch(`menu-items?${params.toString()}`)
  const data = json.data || []
  if (data.length === 0) throw new Error('No menu items returned by Strapi')

  return {
    items: data.map((item) => ({
      name: locale === 'ar' ? item.nameAr : item.nameEn,
      description: locale === 'ar' ? item.descriptionAr : item.descriptionEn,
      category: locale === 'ar' ? item.categoryAr : item.categoryEn,
      calories: item.calories,
      price: String(item.price),
      image: mediaUrl(item.image),
      featured: !!item.featured
    })),
    pageCount: json.meta?.pagination?.pageCount || 1,
    total: json.meta?.pagination?.total || data.length
  }
}

// Unlike the fetch* helpers above, this does NOT fall back silently — a
// reservation inquiry either really reached the restaurant or it didn't, so
// callers need the true/false result to decide what to tell the guest.
export async function submitInquiry({ name, phone, guests, date, time, notes }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const res = await fetch(`${STRAPI_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        // The <input type="time"> value is "HH:mm" — Strapi's time field wants "HH:mm:ss".
        data: { name, phone, guests: Number(guests), date, time: time?.length === 5 ? `${time}:00` : time, notes }
      })
    })
    return res.ok
  } catch (e) {
    return false
  } finally {
    clearTimeout(timeout)
  }
}

export async function fetchCarouselSlides(locale) {
  const json = await strapiFetch(`carousel-slides?filters[isActive][$eq]=true&populate=image&sort=order:asc`)
  const slides = json.data || []
  if (slides.length === 0) throw new Error('No carousel slides returned by Strapi')

  return slides.map((slide) => ({
    badge: locale === 'ar' ? slide.badgeAr : slide.badgeEn,
    title: locale === 'ar' ? slide.titleAr : slide.titleEn,
    subtitle: locale === 'ar' ? slide.subtitleAr : slide.subtitleEn,
    image: mediaUrl(slide.image)
  }))
}

export async function fetchBranches(locale) {
  const json = await strapiFetch(`branches?populate=image&sort=order:asc`)
  const data = json.data || []
  if (data.length === 0) throw new Error('No branches returned by Strapi')

  return data.map((branch) => ({
    name: locale === 'ar' ? branch.nameAr : branch.nameEn,
    location: locale === 'ar' ? branch.locationAr : branch.locationEn,
    hours: locale === 'ar' ? branch.hoursAr : branch.hoursEn,
    mapsLink: branch.mapsLink,
    image: mediaUrl(branch.image)
  }))
}

export async function fetchGalleryImages(locale) {
  const json = await strapiFetch(`gallery-images?populate=image&sort=order:asc`)
  const data = json.data || []
  if (data.length === 0) throw new Error('No gallery images returned by Strapi')

  return data.map((item) => ({
    caption: locale === 'ar' ? item.captionAr : item.captionEn,
    image: mediaUrl(item.image)
  }))
}
