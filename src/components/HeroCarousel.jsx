import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchCarouselSlides } from '../services/strapi'

const STEP_COOLDOWN_MS = 400
const TOUCH_THRESHOLD = 25

const HeroCarousel = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [slides, setSlides] = useState(t.hero.carousel)
  const [activeIndex, setActiveIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const rootRef = useRef(null)
  const rafRef = useRef(null)
  const targetProgressRef = useRef(0)
  const currentProgressRef = useRef(0)
  const cooldownRef = useRef(false)
  const slidesLenRef = useRef(slides.length)
  const isInViewRef = useRef(false)

  slidesLenRef.current = slides.length

  // Only trap scroll while the carousel is actually visible — a scroll
  // position threshold isn't reliable since page content above it can vary.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewRef.current = entry.isIntersecting
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let isCurrent = true
    setSlides(t.hero.carousel)
    setActiveIndex(0)
    targetProgressRef.current = 0
    currentProgressRef.current = 0

    fetchCarouselSlides(currentLang)
      .then((data) => {
        if (isCurrent && data.length > 0) {
          setSlides(data)
          setActiveIndex(0)
          targetProgressRef.current = 0
          currentProgressRef.current = 0
        }
      })
      .catch(() => {
        // Strapi unavailable or empty — keep the static fallback already set above.
      })

    return () => {
      isCurrent = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang])

  // Physics loop: eases the visual position toward the target index instead
  // of snapping, so the 3D arc glides between slides.
  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor

    const tick = () => {
      const diff = Math.abs(targetProgressRef.current - currentProgressRef.current)
      if (diff > 0.0001) {
        currentProgressRef.current = lerp(currentProgressRef.current, targetProgressRef.current, 0.09)
      } else {
        currentProgressRef.current = targetProgressRef.current
      }
      setProgress(currentProgressRef.current)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  const navigateTo = useCallback((index) => {
    const clamped = Math.max(0, Math.min(slidesLenRef.current - 1, index))
    setActiveIndex(clamped)
    targetProgressRef.current = clamped
  }, [])

  // Wheel: traps scroll while the carousel is in view to cycle through
  // slides one at a time, then lets it through once the first/last slide is
  // reached (or the carousel has scrolled out of view entirely).
  useEffect(() => {
    const onWheel = (e) => {
      if (!isInViewRef.current) return

      const goingForward = e.deltaY > 0
      const atEnd = targetProgressRef.current >= slidesLenRef.current - 1
      const atStart = targetProgressRef.current <= 0

      if ((goingForward && atEnd) || (!goingForward && atStart)) return

      e.preventDefault()
      if (cooldownRef.current) return
      cooldownRef.current = true
      navigateTo(Math.round(targetProgressRef.current) + (goingForward ? 1 : -1))
      setTimeout(() => {
        cooldownRef.current = false
      }, STEP_COOLDOWN_MS)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [navigateTo])

  // Touch: same trap, driven by vertical swipe distance.
  useEffect(() => {
    let touchStartY = 0

    const onTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
    }

    const onTouchMove = (e) => {
      if (!isInViewRef.current) return

      const deltaY = touchStartY - e.touches[0].clientY
      if (Math.abs(deltaY) < TOUCH_THRESHOLD) return

      const goingForward = deltaY > 0
      const atEnd = targetProgressRef.current >= slidesLenRef.current - 1
      const atStart = targetProgressRef.current <= 0

      if ((goingForward && atEnd) || (!goingForward && atStart)) return

      if (e.cancelable) e.preventDefault()
      if (cooldownRef.current) return
      cooldownRef.current = true
      navigateTo(Math.round(targetProgressRef.current) + (goingForward ? 1 : -1))
      setTimeout(() => {
        cooldownRef.current = false
      }, STEP_COOLDOWN_MS + 50)
    }

    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [navigateTo])

  // Mirrors the 3D stack for Arabic: upcoming slides wait on the left and
  // arrive moving right-to-left, matching RTL reading order instead of the
  // LTR default (upcoming slides waiting on the right).
  const isRTL = currentLang === 'ar'

  const getCardStyle = (index) => {
    const offset = index - progress
    const absOffset = Math.abs(offset)
    const dirOffset = isRTL ? -offset : offset

    const translateZ = -absOffset * 190 + (1 - Math.min(absOffset, 1)) * 45
    const translateX = dirOffset * 480
    const translateY = Math.pow(absOffset, 1.25) * 18
    const rotateY = dirOffset * -24
    const scale = Math.max(0.62, 1 - absOffset * 0.15)
    const opacity = Math.max(0, 1 - absOffset * 0.35)
    const blur = Math.min(absOffset * 7, 14)
    const zIndex = Math.round(100 - absOffset * 20)

    return {
      transform: `translate(-50%, -50%) perspective(1200px) translate3d(${translateX}px, ${translateY}px, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
      opacity,
      filter: `blur(${blur}px)`,
      zIndex
    }
  }

  return (
    <div className="dish-carousel" ref={rootRef}>
      <div className="dish-carousel-stage">
        {slides.map((slide, index) => {
          const style = getCardStyle(index)
          const isCenter = Math.abs(index - progress) < 0.4
          return (
            <button
              type="button"
              key={`${slide.title}-${index}`}
              className={`dish-card ${isCenter ? 'is-center' : ''}`}
              style={style}
              onClick={() => navigateTo(index)}
              aria-current={index === activeIndex}
            >
              <div className="dish-card-media">
                <img src={slide.image} alt={slide.title} loading={index === 0 ? 'eager' : 'lazy'} />
                <span className="dish-card-scrim" aria-hidden="true" />
              </div>
              <div className="dish-card-content">
                {slide.badge ? <span className="dish-card-badge">{slide.badge}</span> : null}
                <h3>{slide.title}</h3>
                {slide.subtitle ? <p>{slide.subtitle}</p> : null}
              </div>
            </button>
          )
        })}
      </div>

      <div className="dish-carousel-controls">
        <div className="dish-carousel-dots">
          {slides.map((_, idx) => (
            <button
              key={idx}
              type="button"
              className={`dish-carousel-dot ${activeIndex === idx ? 'is-active' : ''}`}
              onClick={() => navigateTo(idx)}
              aria-label={`Go to dish ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default HeroCarousel
