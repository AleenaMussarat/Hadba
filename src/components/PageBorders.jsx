import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

const RED_PATTERN = '/brand/pattern-side-red.png'
const ORANGE_PATTERN = '/brand/pattern-side-orange.png'

// Alternates the border color by page order rather than tying it to any
// per-page theme, so navigating through the site visibly alternates red/orange.
const PAGE_ORDER = ['/', '/about', '/menu', '/branches', '/gallery', '/contact']

// Pages don't span the pattern the full page height by default — some clip
// it to a specific section of the page instead. `end` is a selector for the
// element marking where the pattern should stop (at its top edge). `start`
// is a selector for where it should begin (from its bottom edge); `topPx`
// is a fixed pixel offset used instead, when the page wants a fixed start
// regardless of content height.
const PAGE_SPAN = {
  '/': { topPx: 520, end: '.featured-menu-section' },
  '/menu': { start: '.section-menu .section-heading', end: '.menu-curated-section' }
}

// Pages that get no side pattern at all.
const NO_BORDER_PAGES = ['/about']

const PageBorders = () => {
  const { pathname } = useLocation()
  const index = PAGE_ORDER.indexOf(pathname)
  const pattern = index % 2 === 1 ? ORANGE_PATTERN : RED_PATTERN
  const config = PAGE_SPAN[pathname]
  const [span, setSpan] = useState(null)

  useEffect(() => {
    setSpan(null)
    if (!config) return undefined

    let frame = null
    const measure = () => {
      const main = document.querySelector('main')
      const endEl = document.querySelector(config.end)
      if (!main || !endEl) return

      let top
      if (config.topPx != null) {
        top = config.topPx
      } else {
        const startEl = document.querySelector(config.start)
        if (!startEl) return
        top = Math.max(0, startEl.getBoundingClientRect().bottom - main.getBoundingClientRect().top)
      }

      const mainRect = main.getBoundingClientRect()
      const endRect = endEl.getBoundingClientRect()

      setSpan({
        top,
        bottom: Math.max(0, mainRect.bottom - endRect.top)
      })
    }

    const scheduleMeasure = () => {
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(measure)
    }

    scheduleMeasure()

    // Layout keeps shifting after mount (carousel images, fonts, fetched
    // menu items), so this stays subscribed rather than measuring once.
    const resizeObserver = new ResizeObserver(scheduleMeasure)
    resizeObserver.observe(document.body)
    window.addEventListener('resize', scheduleMeasure)

    return () => {
      if (frame) cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      window.removeEventListener('resize', scheduleMeasure)
    }
  }, [pathname, config])

  if (NO_BORDER_PAGES.includes(pathname)) return null
  // A configured page renders nothing until its span is measured, rather
  // than flashing the default full-height pattern first.
  if (config && !span) return null

  const style = span
    ? { backgroundImage: `url(${pattern})`, top: `${span.top}px`, bottom: `${span.bottom}px` }
    : { backgroundImage: `url(${pattern})` }

  return (
    <>
      <div className="page-border page-border-left" style={style} aria-hidden="true" />
      <div className="page-border page-border-right" style={style} aria-hidden="true" />
    </>
  )
}

export default PageBorders
