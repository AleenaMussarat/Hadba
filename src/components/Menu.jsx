import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import RiyalSymbol from './RiyalSymbol'
import FeaturedMenu from './FeaturedMenu'
import FadeImage from './FadeImage'
import { getLenis } from '../lib/smoothScroll'
import { fetchMenuCategories, fetchMenuItems, fetchPageHero } from '../services/strapi'

const PAGE_SIZE = 8
const MOBILE_QUERY = '(max-width: 768px)'

// The site drives all scrolling through a shared Lenis instance — calling
// the browser's native scrollIntoView fights it instead of landing where
// asked, the same reason BackToTop.jsx goes through Lenis too.
const scrollToMenuGrid = () => {
  const el = document.getElementById('menu-items-grid')
  if (!el) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: -20 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const Menu = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [activeCategory, setActiveCategory] = useState(null)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [pageCount, setPageCount] = useState(1)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  )
  const itemRefs = useRef([])
  const [heroData, setHeroData] = useState(null)

  useEffect(() => {
    setPage(1)
  }, [activeCategory, currentLang])

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!isMobile) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    )

    itemRefs.current.forEach((el) => el && observer.observe(el))
    return () => observer.disconnect()
  }, [isMobile, items])

  useEffect(() => {
    fetchMenuCategories(currentLang)
      .then((data) => setCategories(data))
      .catch(() => setCategories([]))
  }, [currentLang])

  useEffect(() => {
    let active = true
    fetchPageHero('menu', currentLang)
      .then((data) => {
        if (active) setHeroData(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [currentLang])

  // App.jsx warms this exact call in the background shortly after the splash
  // screen finishes (see preloadRestOfSiteAssets), so this is often already
  // cached by the time a visitor navigates here. Doesn't reset items to
  // empty first, so a page/category change just keeps the previous (still
  // valid) grid on screen until the new one resolves, instead of a blank gap.
  useEffect(() => {
    let active = true
    const activeDynamicCategory = activeCategory != null
      ? categories.find((category) => category.id === activeCategory)
      : undefined
    const categoryId = activeDynamicCategory?.id

    fetchMenuItems(currentLang, { categoryId, page, pageSize: PAGE_SIZE })
      .then((data) => {
        if (!active) return
        setItems(data.items)
        setPageCount(data.pageCount)
      })
      .catch(() => {})

    return () => {
      active = false
    }
  }, [currentLang, activeCategory, page, categories])

  // Strapi categories are the only source here — no static category list to
  // fall back to, so until they've loaded the filter bar is just "All".
  const filters = useMemo(
    () => [
      { key: null, label: t.menu.filterAll },
      ...categories.map((category) => ({ key: category.id, label: category.name }))
    ],
    [categories, t.menu.filterAll]
  )

  const pageLabel = t.menu.pageOf.replace('{page}', page).replace('{count}', pageCount)

  // title/subtitle keep the static-text fallback (not images — Strapi's
  // page-hero only optionally overrides site copy that already exists).
  // backgroundImage has no fallback: only ever the real CMS photo, shown
  // once loaded.
  const hero = {
    title: heroData?.title || t.menu.title,
    subtitle: heroData?.subtitle || t.menu.subtitle,
    backgroundImage: heroData?.backgroundImage || null
  }

  return (
    <section className="section section-menu">
      {hero.backgroundImage ? (
        <div
          className="page-intro-bg is-cms-loaded"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-knife-fork.webp" alt="" />
            {t.menu.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{hero.title}</h2>
          <p className="section-copy fade-in-up" style={{ animationDelay: '0.25s' }}>{hero.subtitle}</p>
        </div>
      </div>

      <FeaturedMenu scrollTargetId="menu-items-grid" minimal />

      <div className="container menu-curated-section">
        <div className="menu-curated-content">
          <div id="menu-items-grid" className="menu-separator">
            <img className="menu-separator-icon" src="/brand/icon-plate.webp" alt="" />
            <h3 className="menu-separator-heading">{t.menu.fullMenuHeading}</h3>
            <p className="menu-separator-subtitle">{t.menu.fullMenuSubtitle}</p>
          </div>

          <div className="menu-filters">
            {filters.map((filter) => (
              <button
                key={filter.key || 'all'}
                type="button"
                className={`menu-filter-pill ${activeCategory === filter.key ? 'active' : ''}`}
                onClick={() => setActiveCategory(filter.key)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="menu-items">
            {items.map((item, index) => (
              <article
                key={`${item.name}-${index}`}
                ref={(el) => (itemRefs.current[index] = el)}
                className={`menu-item ${isMobile ? 'menu-item-reveal' : 'fade-in-up'} ${item.featured ? 'featured' : ''}`}
                style={isMobile ? undefined : { animationDelay: `${(index % 8) * 0.08}s` }}
              >
                <div className={`menu-item-media ${item.isPlaceholder ? 'is-placeholder' : ''}`}>
                  <FadeImage src={item.image} alt={item.name} loading="lazy" />
                  {item.featured ? (
                    <span className="menu-badge">
                      <img src="/brand/icon-cloche-steam.webp" alt="" />
                      {t.menu.recommended}
                    </span>
                  ) : null}
                </div>
                <div className="menu-item-top">
                  <span className="menu-item-category">{item.category}</span>
                  <div className="menu-item-title-row">
                    <h4>{item.name}</h4>
                    <span className="menu-price"><RiyalSymbol value={item.price} /></span>
                  </div>
                  <p>{item.description}</p>
                  {item.calories ? <span className="menu-item-calories">{item.calories} {t.menu.caloriesLabel}</span> : null}
                </div>
              </article>
            ))}
          </div>

          <div className="menu-pagination">
            <button
              type="button"
              className="menu-page-btn"
              onClick={() => {
                setPage((p) => Math.max(p - 1, 1))
                scrollToMenuGrid()
              }}
              disabled={page <= 1}
            >
              {t.menu.prev}
            </button>
            <span className="menu-page-label">{pageLabel}</span>
            <button
              type="button"
              className="menu-page-btn"
              onClick={() => {
                setPage((p) => Math.min(p + 1, pageCount))
                scrollToMenuGrid()
              }}
              disabled={page >= pageCount}
            >
              {t.menu.next}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Menu