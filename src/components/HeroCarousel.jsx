import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchCarouselSlides } from '../services/strapi'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

const AUTOPLAY_MS = 5000

const HeroCarousel = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [slides, setSlides] = useState(t.hero.carousel)
  const [index, setIndex] = useState(0)
  const pausedRef = useRef(false)

  useEffect(() => {
    let active = true
    setSlides(t.hero.carousel)
    setIndex(0)

    fetchCarouselSlides(currentLang)
      .then((data) => {
        if (active) {
          setSlides(data)
          setIndex(0)
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
    const id = setInterval(() => {
      if (!pausedRef.current) {
        setIndex((prev) => (prev + 1) % slides.length)
      }
    }, AUTOPLAY_MS)
    return () => clearInterval(id)
  }, [slides.length])

  const goTo = (i) => setIndex((i + slides.length) % slides.length)

  return (
    <div
      className="hero-carousel"
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className="hero-carousel-track">
        {slides.map((slide, i) => (
          <div className={`hero-carousel-slide ${i === index ? 'active' : ''}`} key={i} aria-hidden={i !== index}>
            {slide.isVideo ? (
              <video
                src={slide.image}
                autoPlay
                muted
                loop
                playsInline
                preload={i === 0 ? 'auto' : 'metadata'}
              />
            ) : (
              <img src={slide.image} alt={slide.title} loading={i === 0 ? 'eager' : 'lazy'} />
            )}
            <div className="hero-carousel-scrim" />
            <div className="hero-carousel-caption">
              <span className="hero-carousel-badge">{slide.badge}</span>
              <h3>{slide.title}</h3>
              <p>{slide.subtitle}</p>
            </div>
          </div>
        ))}
      </div>

      <button type="button" className="hero-carousel-arrow prev" onClick={() => goTo(index - 1)} aria-label="Previous slide">
        <FaChevronLeft />
      </button>
      <button type="button" className="hero-carousel-arrow next" onClick={() => goTo(index + 1)} aria-label="Next slide">
        <FaChevronRight />
      </button>

      <div className="hero-carousel-dots">
        {slides.map((_, i) => (
          <button
            type="button"
            key={i}
            className={`hero-carousel-dot ${i === index ? 'active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default HeroCarousel
