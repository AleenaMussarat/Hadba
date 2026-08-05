import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchMenuItems } from '../services/strapi'
import RiyalSymbol from './RiyalSymbol'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

const AUTOPLAY_MS = 6000

const staticFeatured = (t) => t.menu.items.filter((item) => item.featured)

const FeaturedMenu = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [items, setItems] = useState(staticFeatured(t))
  const [spreadIndex, setSpreadIndex] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    let active = true
    setItems(staticFeatured(t))
    setSpreadIndex(0)

    fetchMenuItems(currentLang, { featured: true, pageSize: 8 })
      .then((data) => {
        if (active && data.items.length > 0) {
          setItems(data.items)
          setSpreadIndex(0)
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

  const spreads = []
  for (let i = 0; i < items.length; i += 2) {
    spreads.push(items.slice(i, i + 2))
  }

  useEffect(() => {
    if (spreads.length <= 1) return
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setSpreadIndex((prev) => (prev + 1) % spreads.length)
      }
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spreads.length])

  if (items.length === 0) return null

  const goTo = (i) => setSpreadIndex((i + spreads.length) % spreads.length)
  const [leftItem] = spreads[spreadIndex] || []
  const rightItems = spreads.map((spread) => spread[1])

  const renderPage = (item) => {
    if (!item) return <div className="menu-book-page menu-book-page-empty" />
    return (
      <div className="menu-book-page">
        {item.image && (
          <div className="menu-book-page-image">
            <img src={item.image} alt={item.name} />
          </div>
        )}
        <div className="menu-book-entry">
          <div className="menu-book-entry-row">
            <h4>{item.name}</h4>
            <span className="menu-book-dots" />
            <span className="menu-book-price"><RiyalSymbol />{item.price}</span>
          </div>
          {item.description && <p>{item.description}</p>}
        </div>
      </div>
    )
  }

  return (
    <section className="section featured-menu-section">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">{t.featuredMenu.eyebrow}</p>
          <h2 className="section-title">{t.featuredMenu.title}</h2>
          <p className="section-copy">{t.featuredMenu.subtitle}</p>
        </div>

        <div
          className="menu-book"
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          <div className="menu-book-spread">
            <div className="menu-book-page-settle" key={`left-${spreadIndex}`}>
              {renderPage(leftItem)}
            </div>
            <div className="menu-book-spine" />
            <div className="menu-book-right-stack">
              {rightItems.map((item, i) => (
                <div
                  key={i}
                  className={`menu-book-leaf ${i < spreadIndex ? 'is-flipped' : ''}`}
                  style={{ zIndex: rightItems.length - i }}
                >
                  {renderPage(item)}
                </div>
              ))}
            </div>
          </div>

          {spreads.length > 1 && (
            <>
              <button type="button" className="menu-book-arrow prev" onClick={() => goTo(spreadIndex - 1)} aria-label="Previous page">
                <FaChevronLeft />
              </button>
              <button type="button" className="menu-book-arrow next" onClick={() => goTo(spreadIndex + 1)} aria-label="Next page">
                <FaChevronRight />
              </button>
            </>
          )}
        </div>

        <div className="featured-menu-cta">
          <Link to="/menu" className="btn btn-primary">{t.featuredMenu.viewFullMenu}</Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedMenu
