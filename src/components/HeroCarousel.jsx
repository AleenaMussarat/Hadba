import React, { useEffect, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchCarouselSlides } from '../services/strapi'
import DepthCarousel from './reactbits/DepthCarousel'

const HeroCarousel = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [slides, setSlides] = useState(t.hero.carousel)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let isCurrent = true
    setSlides(t.hero.carousel)
    setActiveIndex(0)

    fetchCarouselSlides(currentLang)
      .then((data) => {
        if (isCurrent && data.length > 0) {
          setSlides(data)
          setActiveIndex(0)
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

  const items = slides.map((slide) => ({ image: slide.image, alt: slide.title }))
  const activeSlide = slides[activeIndex]

  return (
    <div className="hero-carousel">
      <div className="hero-carousel-stage">
        <DepthCarousel
          items={items}
          cardWidth={420}
          cardHeight={360}
          depth={220}
          spread={110}
          perspective={1600}
          autoplay
          autoplayDelay={5000}
          onChange={setActiveIndex}
        />
      </div>
      {activeSlide ? (
        <div className="hero-carousel-caption">
          <span className="hero-carousel-badge">{activeSlide.badge}</span>
          <h3>{activeSlide.title}</h3>
          <p>{activeSlide.subtitle}</p>
        </div>
      ) : null}
    </div>
  )
}

export default HeroCarousel
