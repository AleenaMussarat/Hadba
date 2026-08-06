import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchMenuItems } from '../services/strapi'
import RiyalSymbol from './RiyalSymbol'

const PANEL_COUNT = 4

const staticFeatured = (t) => t.menu.items.filter((item) => item.featured).slice(0, PANEL_COUNT)

const FeaturedMenu = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [items, setItems] = useState(staticFeatured(t))
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let active = true
    setItems(staticFeatured(t))
    setActiveIndex(0)

    fetchMenuItems(currentLang, { featured: true, pageSize: PANEL_COUNT })
      .then((data) => {
        if (active && data.items.length > 0) {
          setItems(data.items)
          setActiveIndex(0)
        }
      })
      .catch(() => {
        // Strapi unavailable or empty — keep the static fallback already set above.
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang])

  if (items.length === 0) return null

  return (
    <section className="section featured-menu-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow eyebrow-icon">
            <img src="/brand/icon-fork-spoon.png" alt="" />
            {t.featuredMenu.eyebrow}
          </p>
          <h2 className="section-title">{t.featuredMenu.title}</h2>
          <p className="section-copy">{t.featuredMenu.subtitle}</p>
        </div>

        <div className="menu-expand-gallery">
          {items.map((item, i) => (
            <button
              type="button"
              key={`${item.name}-${i}`}
              className={`menu-expand-panel ${i === activeIndex ? 'is-active' : ''}`}
              style={{ backgroundImage: `url(${item.image})` }}
              onClick={() => setActiveIndex(i)}
              aria-expanded={i === activeIndex}
            >
              <span className="menu-expand-overlay" aria-hidden="true" />
              <span className="menu-expand-label"><span>{item.name}</span></span>
              <span className="menu-expand-details">
                <span className="menu-expand-details-row">
                  <span className="menu-expand-name">{item.name}</span>
                  <span className="menu-expand-price"><RiyalSymbol />{item.price}</span>
                </span>
                {item.description && <span className="menu-expand-desc">{item.description}</span>}
              </span>
            </button>
          ))}
        </div>

        <div className="featured-menu-cta">
          <Link to="/menu" className="btn btn-primary">{t.featuredMenu.viewFullMenu}</Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedMenu
