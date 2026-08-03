import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations, CAT, CATEGORY_ORDER } from '../i18n/translations'
import { fetchMenuItems } from '../services/strapi'
import RiyalSymbol from './RiyalSymbol'

const PAGE_SIZE = 20

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

const Menu = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [activeCategory, setActiveCategory] = useState(null)
  const [page, setPage] = useState(1)
  const [items, setItems] = useState([])
  const [pageCount, setPageCount] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [activeCategory, currentLang])

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
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">{t.menu.eyebrow}</p>
          <h2 className="section-title">{t.menu.title}</h2>
          <p className="section-copy">{t.menu.subtitle}</p>
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
            <article key={`${item.name}-${index}`} className={`menu-item ${item.featured ? 'featured' : ''}`}>
              <div className="menu-item-media">
                <img src={item.image} alt={item.name} loading="lazy" />
                {item.featured ? (
                  <span className="menu-badge">
                    <img src="/brand/icon-cloche-steam.png" alt="" />
                    {t.menu.recommended}
                  </span>
                ) : null}
              </div>
              <div className="menu-item-top">
                <span className="menu-item-category">{item.category}</span>
                <div className="menu-item-title-row">
                  <h4>{item.name}</h4>
                  <span className="menu-price"><RiyalSymbol />{item.price}</span>
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
              window.scrollTo({ top: 0, behavior: 'smooth' })
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
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            disabled={page >= pageCount}
          >
            {t.menu.next}
          </button>
        </div>
      </div>
    </section>
  )
}

export default Menu
