import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchMenuItems } from '../services/strapi'
import { FaAnglesDown, FaAnglesLeft, FaAnglesRight } from 'react-icons/fa6'
import RiyalSymbol from './RiyalSymbol'
import { getLenis } from '../lib/smoothScroll'

const PANEL_COUNT = 4
const MOBILE_QUERY = '(max-width: 768px)'

const staticFeatured = (t) => t.menu.items.filter((item) => item.featured).slice(0, PANEL_COUNT)

// Goes through the shared Lenis instance instead of the native
// scrollIntoView — Lenis drives all scrolling on this site, and fighting it
// with a native scroll call is why this didn't reliably land on target.
const scrollToTarget = (id) => {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el, { offset: -20 })
  } else {
    el.scrollIntoView({ behavior: 'smooth' })
  }
}

// Must be >= the .menu-expand-panel flex transition (0.6s in App.css) — a
// shorter interval retargets the CSS transition before it ever finishes,
// so each panel is still mid-open when the next step yanks it back closed
// instead of visibly completing its own open/close first.
const STEP_MS = 650

const FeaturedMenu = ({ scrollTargetId, minimal = false }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [items, setItems] = useState(staticFeatured(t))
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches
  )
  const galleryRef = useRef(null)
  const activeIndexRef = useRef(0)
  const targetIndexRef = useRef(0)
  const stepTimerRef = useRef(null)

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

  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const onChange = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])

  // Steps activeIndex toward targetIndexRef one index at a time, on a timer,
  // instead of jumping straight to it. A fast flick can move the scroll-
  // computed target from 0 to 3 in a single event — setting activeIndex
  // directly from that snapshot would skip panels 1 and 2 entirely (the
  // flex transition just retargets straight to panel 3, so 1 and 2 never
  // visibly get their turn). This guarantees every panel opens in sequence
  // regardless of scroll speed.
  const stepToward = useCallback(() => {
    if (stepTimerRef.current) return
    const advance = () => {
      const current = activeIndexRef.current
      const target = targetIndexRef.current
      if (current === target) {
        stepTimerRef.current = null
        return
      }
      const next = current < target ? current + 1 : current - 1
      activeIndexRef.current = next
      setActiveIndex(next)
      stepTimerRef.current = setTimeout(advance, STEP_MS)
    }
    advance()
  }, [])

  // On mobile the panels stack vertically with a fixed total height (the
  // active one grows, the rest collapse to a thin bar, but the *sum* never
  // changes) — so as the gallery itself scrolls past the viewport, its own
  // height and position stay perfectly stable, and we can safely use them
  // to drive which panel is active without any feedback loop. This
  // intentionally avoids position: sticky (which needs an unbroken chain of
  // non-overflow ancestors to actually pin, and didn't reliably track
  // scroll here) and avoids reserving huge amounts of extra scroll space —
  // the whole interaction plays out over exactly this block's own height.
  //
  // Progress is measured against the viewport (like the About page's
  // pattern-expand), not against the gallery's own top-reaches-0 point —
  // that older version only started reacting once the gallery had already
  // scrolled almost entirely off the top of the screen, which read as
  // "nothing happens until it's way outside the screen". Starting the
  // window while the gallery is still mostly below the fold and finishing
  // well before it reaches the top makes it open/close as it scrolls past,
  // in both directions, and finish inside a shorter, snappier distance.
  useEffect(() => {
    if (!isMobile) return
    const el = galleryRef.current
    if (!el || items.length === 0) return

    const updateActive = () => {
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      const start = viewportH * 0.85
      const end = viewportH * 0.2
      const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end)))
      const idx = Math.min(items.length - 1, Math.floor(progress * items.length))
      targetIndexRef.current = idx
      stepToward()
    }

    const lenis = getLenis()
    if (lenis) {
      lenis.on('scroll', updateActive)
    } else {
      window.addEventListener('scroll', updateActive, { passive: true })
    }
    updateActive()

    return () => {
      if (lenis) {
        lenis.off('scroll', updateActive)
      } else {
        window.removeEventListener('scroll', updateActive)
      }
      if (stepTimerRef.current) {
        clearTimeout(stepTimerRef.current)
        stepTimerRef.current = null
      }
    }
  }, [isMobile, items.length, stepToward])

  // A direct tap is an explicit choice, not a scroll-driven reveal — jump
  // straight there and cancel any in-flight step queue, but keep the refs
  // in sync so a subsequent scroll resumes stepping from this new position
  // instead of replaying whatever it missed while stepping was paused.
  const handlePanelClick = (i) => {
    if (stepTimerRef.current) {
      clearTimeout(stepTimerRef.current)
      stepTimerRef.current = null
    }
    activeIndexRef.current = i
    targetIndexRef.current = i
    setActiveIndex(i)
  }

  if (items.length === 0) return null

  const gallery = (
    <div className="menu-expand-gallery" ref={galleryRef}>
      {items.map((item, i) => (
        <button
          type="button"
          key={`${item.name}-${i}`}
          className={`menu-expand-panel ${i === activeIndex ? 'is-active' : ''} ${item.isPlaceholder ? 'is-placeholder' : ''}`}
          style={{ backgroundImage: `url(${item.image})` }}
          onClick={() => handlePanelClick(i)}
          aria-expanded={i === activeIndex}
        >
          <span className="menu-expand-overlay" aria-hidden="true" />
          <span className="menu-expand-label"><span>{item.name}</span></span>
          <span className="menu-expand-details">
            <span className="menu-expand-details-row">
              <span className="menu-expand-name">{item.name}</span>
              <span className="menu-expand-price"><RiyalSymbol value={item.price} /></span>
            </span>
            {item.description && <span className="menu-expand-desc">{item.description}</span>}
          </span>
        </button>
      ))}
    </div>
  )

  return (
    <section className={minimal ? 'featured-menu-section is-minimal' : 'section featured-menu-section'}>
      <div className="container">
        {!minimal ? (
          <div className="section-heading">
            <p className="eyebrow eyebrow-icon">
              <img src="/brand/icon-fork-spoon.webp" alt="" />
              {t.featuredMenu.eyebrow}
            </p>
            <h2 className="section-title">{t.featuredMenu.title}</h2>
            <p className="section-copy">{t.featuredMenu.subtitle}</p>
          </div>
        ) : null}

        {gallery}

        <div className="featured-menu-cta">
          {scrollTargetId ? (
            <button
              type="button"
              className="btn btn-primary btn-scroll-explore"
              onClick={() => scrollToTarget(scrollTargetId)}
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
