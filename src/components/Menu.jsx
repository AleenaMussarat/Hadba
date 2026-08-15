import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations, CAT, CATEGORY_ORDER } from '../i18n/translations'
import { fetchMenuItems } from '../services/strapi'
import RiyalSymbol from './RiyalSymbol'
import FeaturedMenu from './FeaturedMenu'
import { getLenis } from '../lib/smoothScroll'

const PAGE_SIZE = 20
const MOBILE_QUERY = '(max-width: 768px)'

// Client-side filter + slice used whenever Strapi is unavailable — mirrors
// the server-side filters[category] + pagination query so both paths agree.
const paginateStatic = (allItems, categoryName, page) => {
  const filtered = categoryName ? allItems.filter((item) => item.category === categoryName) : allItems
  const pageCount = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1)
  const start = (page - 1) * PAGE_SIZE
  return {
    items: filtered.slice(start, start + PAGE_SIZE),
    pageCount,
    total: filtered.length
  }
}

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
  const [pageCount, setPageCount] = useState(1)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  )
  const itemRefs = useRef([])

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
    let active = true
    const categoryName = activeCategory ? CAT[activeCategory][currentLang] : undefined

    const fallback = paginateStatic(t.menu.items, categoryName, page)
    setItems(fallback.items)
    setPageCount(fallback.pageCount)

    fetchMenuItems(currentLang, { category: categoryName, page, pageSize: PAGE_SIZE })
      .then((data) => {
        if (!active) return
        setItems(data.items)
        setPageCount(data.pageCount)
      })
      .catch(() => {
        // Strapi unavailable or empty — keep the static fallback already set above.
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang, activeCategory, page])

  const filters = useMemo(
    () => [
      { key: null, label: t.menu.filterAll },
      ...CATEGORY_ORDER.map((key) => ({ key, label: CAT[key][currentLang] }))
    ],
    [currentLang, t.menu.filterAll]
  )

  const pageLabel = t.menu.pageOf.replace('{page}', page).replace('{count}', pageCount)

  return (
    <section className="section section-menu">
      <div className="page-intro-bg" style={{ backgroundImage: 'url(/brand/photo-sadu-interior.webp)' }} aria-hidden="true" />
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-knife-fork.webp" alt="" />
            {t.menu.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{t.menu.title}</h2>
          <p className="section-copy fade-in-up" style={{ animationDelay: '0.25s' }}>{t.menu.subtitle}</p>
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
                  <img src={item.image} alt={item.name} loading="lazy" />
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
