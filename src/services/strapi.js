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

export const RESERVATION_CLOSED_MESSAGE = 'sorry, bookings are full try another day'

export async function checkReservationsEnabled() {
  const endpoints = ['reservation-setting', 'reservation-settings']

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/${endpoint}`)
      if (!res.ok) continue
      const json = await res.json()
      // Strapi v5: data is direct, no attributes wrapper
      const record = Array.isArray(json?.data) ? json.data[0] : json?.data
      const value = record?.acceptingReservations
      if (typeof value === 'boolean') return value
    } catch (error) {
      console.warn(`Unable to fetch reservation settings from ${endpoint}:`, error)
    }
  }

  return true
}

// FETCH CATEGORIES - Updated for Strapi v5 (no attributes wrapper)
export async function fetchMenuCategories(locale) {
  const json = await strapiFetch('menu-categories?sort=order:asc')
  const data = json.data || []

  return data.map((category) => ({
    id: category.id,
    // Strapi v5: direct access, no .attributes
    name: locale === 'ar' ? category.nameAr : category.nameEn
  }))
}

// FETCH MENU ITEMS - Updated for Strapi v5
export async function fetchMenuItems(locale, { categoryId, featured, page = 1, pageSize = 10 } = {}) {
  const params = new URLSearchParams({
    populate: 'image,menuCategory',
    sort: 'order:asc'
  })

  if (!categoryId) {
    params.set('pagination[page]', String(page))
    params.set('pagination[pageSize]', String(pageSize))
  }

  if (featured) params.set('filters[featured][$eq]', 'true')
  
  // Filter by category ID if provided
  if (categoryId) {
    params.set('filters[menuCategory][id][$eq]', categoryId)
  }

  const json = await strapiFetch(`menu-items?${params.toString()}`)
  const data = json.data || []

  const mapped = data.map((item) => ({
    id: item.id,
    name: locale === 'ar' ? item.nameAr : item.nameEn,
    description: locale === 'ar' ? item.descriptionAr : item.descriptionEn,
    // Strapi v5: direct access to relation, no .attributes
    category: locale === 'ar' ? item.menuCategory?.nameAr : item.menuCategory?.nameEn,
    categoryId: item.menuCategory?.id || null,
    calories: item.calories,
    price: String(item.price),
    image: mediaUrl(item.image),
    featured: !!item.featured
  }))

  const filtered = categoryId
    ? mapped.filter((item) => item.categoryId === categoryId)
    : mapped

  const pageCount = Math.max(Math.ceil(filtered.length / pageSize), 1)
  const start = (page - 1) * pageSize

  return {
    items: categoryId ? filtered.slice(start, start + pageSize) : filtered.slice(start, start + pageSize),
    pageCount: categoryId ? pageCount : json.meta?.pagination?.pageCount || pageCount,
    total: filtered.length
  }
}

export async function submitInquiry({ name, phone, guests, date, time, notes }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    const enabled = await checkReservationsEnabled()
    if (!enabled) {
      return { success: false, error: RESERVATION_CLOSED_MESSAGE }
    }

    const res = await fetch(`${STRAPI_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        data: {
          name,
          phone: phone || '',
          guests: Number(guests),
          date,
          time: time?.length === 5 ? `${time}:00` : time,
          notes: notes || ''
        }
      })
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Submission error:', errorData)
      return { success: false, error: errorData?.error?.message || 'Failed to submit inquiry' }
    }

    return { success: true }
  } catch (e) {
    console.error('Submission failed:', e)
    return { success: false, error: e.message || 'Network error' }
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
    image: mediaUrl(slide.image),
    isVideo: !!slide.image?.mime?.startsWith('video/')
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

export async function fetchPageHero(pageKey, locale) {
  const json = await strapiFetch(`page-heros?filters[pageKey][$eq]=${pageKey}&populate=backgroundImage,eyebrowIcon,cardIcon`)
  const entry = json.data?.[0]
  if (!entry) return null

  return {
    eyebrow: locale === 'ar' ? entry.eyebrowAr : entry.eyebrowEn,
    title: locale === 'ar' ? entry.titleAr : entry.titleEn,
    subtitle: locale === 'ar' ? entry.subtitleAr : entry.subtitleEn,
    tagline: locale === 'ar' ? entry.taglineAr : entry.taglineEn,
    promoTitle: locale === 'ar' ? entry.promoTitleAr : entry.promoTitleEn,
    promoText: locale === 'ar' ? entry.promoTextAr : entry.promoTextEn,
    hours: locale === 'ar' ? entry.hoursAr : entry.hoursEn,
    hoursValue: locale === 'ar' ? entry.hoursValueAr : entry.hoursValueEn,
    ctaPrimary: locale === 'ar' ? entry.ctaPrimaryAr : entry.ctaPrimaryEn,
    ctaSecondary: locale === 'ar' ? entry.ctaSecondaryAr : entry.ctaSecondaryEn,
    backgroundImage: mediaUrl(entry.backgroundImage),
    eyebrowIcon: mediaUrl(entry.eyebrowIcon),
    cardIcon: mediaUrl(entry.cardIcon)
  }
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