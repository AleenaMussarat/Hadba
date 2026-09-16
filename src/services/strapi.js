const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337'
// The CMS runs as a Node app behind a proxy that cold-starts it after idle
// periods (first request can take 20-40s). App.jsx now preloads each page's
// data (and images) ahead of time — starting with the home page during the
// splash screen — instead of a page showing its own spinner while this is in
// flight, so the timeout needs to comfortably outlast a real cold start
// rather than fail fast into one.
const FETCH_TIMEOUT_MS = 35000

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

// In-memory only (cleared on full page reload) — keyed by call + locale +
// params, so App.jsx's preload during the splash screen and a page
// component's own later fetch for the exact same data share one in-flight
// request/result instead of hitting the CMS twice. A failed fetch evicts its
// own key so the next call (e.g. a manual retry, or navigating to the page
// again) gets a fresh attempt rather than being stuck replaying the same
// rejection forever.
const requestCache = new Map()

function cached(key, loader) {
  if (requestCache.has(key)) return requestCache.get(key)
  const promise = loader()
  requestCache.set(key, promise)
  promise.catch(() => requestCache.delete(key))
  return promise
}

// Warms the browser's own image cache so that by the time a component
// renders an <img>/backgroundImage using this URL, the bytes are already
// downloaded and decoded — resolving the CMS fetch alone isn't enough for
// that, the image itself still has to actually download. Never rejects
// (a broken/missing image shouldn't fail the whole preload batch it's part
// of) and no-ops on a falsy url.
function preloadImage(url) {
  return new Promise((resolve) => {
    if (!url) {
      resolve()
      return
    }
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = url
  })
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
export function fetchMenuCategories(locale) {
  return cached(`categories:${locale}`, () => fetchMenuCategoriesUncached(locale))
}

async function fetchMenuCategoriesUncached(locale) {
  const json = await strapiFetch('menu-categories?sort=order:asc')
  const data = json.data || []

  return data.map((category) => ({
    id: category.id,
    // Strapi v5: direct access, no .attributes
    name: locale === 'ar' ? category.nameAr : category.nameEn
  }))
}

// FETCH MENU ITEMS - Updated for Strapi v5
export function fetchMenuItems(locale, options = {}) {
  const { categoryId, featured, page = 1, pageSize = 10 } = options
  const key = `menuItems:${locale}:cat=${categoryId || 'all'}:feat=${!!featured}:page=${page}:size=${pageSize}`
  return cached(key, () => fetchMenuItemsUncached(locale, options))
}

async function fetchMenuItemsUncached(locale, { categoryId, featured, page = 1, pageSize = 10 } = {}) {
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

  // Unfiltered browsing is paginated server-side (pagination[page]/[pageSize]
  // above), so `mapped` already IS just this page's items — re-slicing it by
  // an absolute (page-1)*pageSize offset returned an empty array on every
  // page past the first. Category-filtered browsing fetches every matching
  // item unpaginated and slices client-side instead, so that path still needs
  // the slice.
  return {
    items: categoryId ? filtered.slice(start, start + pageSize) : filtered,
    pageCount: categoryId ? pageCount : json.meta?.pagination?.pageCount || pageCount,
    total: filtered.length
  }
}

export async function submitInquiry({ name, phone, guests, date, time, notes }) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)
  try {
    // First check if reservations are enabled (optional, but good for UX)
    const enabled = await checkReservationsEnabled()
    if (!enabled) {
      return {
        success: false,
        error: RESERVATION_CLOSED_MESSAGE,
        isClosed: true
      }
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

    // Handle 403 Forbidden - reservations disabled
    if (res.status === 403) {
      const errorData = await res.json()
      return {
        success: false,
        error: errorData?.error?.message || RESERVATION_CLOSED_MESSAGE,
        isClosed: true
      }
    }

    if (!res.ok) {
      const errorData = await res.json()
      console.error('Submission error:', errorData)
      return {
        success: false,
        error: errorData?.error?.message || 'Failed to submit inquiry',
        isClosed: false
      }
    }

    return { success: true }
  } catch (e) {
    console.error('Submission failed:', e)
    return {
      success: false,
      error: e.message || 'Network error',
      isClosed: false
    }
  } finally {
    clearTimeout(timeout)
  }
}

export function fetchCarouselSlides(locale) {
  return cached(`carousel:${locale}`, () => fetchCarouselSlidesUncached(locale))
}

async function fetchCarouselSlidesUncached(locale) {
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

export function fetchBranches(locale) {
  return cached(`branches:${locale}`, () => fetchBranchesUncached(locale))
}

async function fetchBranchesUncached(locale) {
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

export function fetchPageHero(pageKey, locale) {
  return cached(`pageHero:${pageKey}:${locale}`, () => fetchPageHeroUncached(pageKey, locale))
}

async function fetchPageHeroUncached(pageKey, locale) {
  const json = await strapiFetch(`page-heros?filters[pageKey][$eq]=${pageKey}&populate=backgroundImage`)
  const entry = json.data?.[0]
  if (!entry) return null

  return {
    title: locale === 'ar' ? entry.titleAr : entry.titleEn,
    subtitle: locale === 'ar' ? entry.subtitleAr : entry.subtitleEn,
    backgroundImage: mediaUrl(entry.backgroundImage)
  }
}

export function fetchGalleryImages(locale) {
  return cached(`gallery:${locale}`, () => fetchGalleryImagesUncached(locale))
}

async function fetchGalleryImagesUncached(locale) {
  const json = await strapiFetch(`gallery-images?populate=image&sort=order:asc`)
  const data = json.data || []
  if (data.length === 0) throw new Error('No gallery images returned by Strapi')

  return data.map((item) => ({
    caption: locale === 'ar' ? item.captionAr : item.captionEn,
    image: mediaUrl(item.image)
  }))
}

export async function fetchSiteSettings(locale) {
  const endpoints = ['site-setting', 'site-settings']

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(`${STRAPI_URL}/api/${endpoint}`)
      if (!res.ok) continue
      const json = await res.json()
      const record = Array.isArray(json?.data) ? json.data[0] : json?.data
      if (!record) continue

      return {
        tagline: locale === 'ar' ? record.taglineAr : record.taglineEn,
        address: locale === 'ar' ? record.addressAr : record.addressEn,
        phone: record.phone,
        email: record.email,
        hours: locale === 'ar' ? record.hoursAr : record.hoursEn,
        instagramUrl: record.instagramUrl,
        xUrl: record.xUrl,
        snapchatUrl: record.snapchatUrl,
        tiktokUrl: record.tiktokUrl,
        facebookUrl: record.facebookUrl,
        whatsappUrl: record.whatsappUrl,
        telegramUrl: record.telegramUrl,
        youtubeUrl: record.youtubeUrl
      }
    } catch (error) {
      console.warn(`Unable to fetch site settings from ${endpoint}:`, error)
    }
  }

  return null
}

// Called from App.jsx's splash screen — the home page is what nearly every
// visitor lands on first, so its data AND images are fully loaded (not just
// fetched — actually downloaded and decoded, via preloadImage) before the
// splash finishes, instead of Hero/HeroCarousel/FeaturedMenu each showing
// their own placeholder while this happens after the splash is gone. Never
// rejects — a CMS-down visitor still gets the branded splash's minimum
// display time and then the (empty) home page, not a hang.
export async function preloadHomeAssets(locale) {
  const [hero, carousel, featured] = await Promise.all([
    fetchPageHero('home', locale).catch(() => null),
    fetchCarouselSlides(locale).catch(() => []),
    fetchMenuItems(locale, { featured: true, pageSize: 4 }).catch(() => ({ items: [] }))
  ])

  const imageUrls = [
    hero?.backgroundImage,
    ...carousel.map((slide) => slide.image),
    ...featured.items.map((item) => item.image)
  ].filter(Boolean)

  await Promise.all(imageUrls.map(preloadImage))
}

// Fired in the background alongside preloadHomeAssets (not awaited by it) —
// warms every other page's data and images too, on the assumption most
// visitors land on the home page first per preloadHomeAssets above, so this
// has a head start before they navigate anywhere else. Each fetch here uses
// the exact same cache key a page's own component fetch will use, so if this
// finishes first (the common case) that component's fetch resolves from
// cache instantly with no network wait; if the visitor gets there first,
// nothing here is wasted either — the component's own fetch just wins the
// race and this backfills the cache for next time.
export async function preloadRestOfSiteAssets(locale) {
  const [categories, menuHero, menuItems, galleryHero, gallery, branchesHero, branches] = await Promise.all([
    fetchMenuCategories(locale).catch(() => []),
    fetchPageHero('menu', locale).catch(() => null),
    fetchMenuItems(locale, { page: 1, pageSize: 8 }).catch(() => ({ items: [] })),
    fetchPageHero('gallery', locale).catch(() => null),
    fetchGalleryImages(locale).catch(() => []),
    fetchPageHero('branches', locale).catch(() => null),
    fetchBranches(locale).catch(() => [])
  ])

  const imageUrls = [
    menuHero?.backgroundImage,
    galleryHero?.backgroundImage,
    branchesHero?.backgroundImage,
    ...menuItems.items.map((item) => item.image),
    ...gallery.map((item) => item.image),
    ...branches.map((branch) => branch.image)
  ].filter(Boolean)

  await Promise.all(imageUrls.map(preloadImage))
  // categories has no images of its own — fetched only to warm its cache key.
  void categories
}