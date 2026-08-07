import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchMenuItems } from '../services/strapi'
import { FaAnglesDown, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'
import RiyalSymbol from './RiyalSymbol'

const PANEL_COUNT = 4

const staticFeatured = (t) => t.menu.items.filter((item) => item.featured).slice(0, PANEL_COUNT)

const FeaturedMenu = ({ scrollTargetId, minimal = false }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [items, setItems] = useState(staticFeatured(t))
  const [activeIndex, setActiveIndex] = useState(0)
  const panelRefs = useRef([])

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
    <section className={minimal ? 'featured-menu-section is-minimal' : 'section featured-menu-section'}>
      <div className="container">
        {!minimal ? (
          <div className="section-heading">
            <p className="eyebrow eyebrow-icon">
              <img src="/brand/icon-fork-spoon.png" alt="" />
              {t.featuredMenu.eyebrow}
            </p>
            <h2 className="section-title">{t.featuredMenu.title}</h2>
            <p className="section-copy">{t.featuredMenu.subtitle}</p>
          </div>
        ) : null}

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
          {scrollTargetId ? (
            <button
              type="button"
              className="btn btn-primary btn-scroll-explore"
              onClick={() => document.getElementById(scrollTargetId)?.scrollIntoView({ behavior: 'smooth' })}
            >
              {t.featuredMenu.scrollToExplore}
              <FaAnglesDown className="btn-scroll-explore-arrow" aria-hidden="true" />
            </button>
          ) : (
            <Link to="/menu" className="btn btn-primary btn-view-menu">
              {t.featuredMenu.viewFullMenu}
              {currentLang === 'ar' ? (
                <FaAnglesLeft className="btn-view-menu-arrow" aria-hidden="true" />
              ) : (
                <FaAnglesRight className="btn-view-menu-arrow" aria-hidden="true" />
              )}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default FeaturedMenu
