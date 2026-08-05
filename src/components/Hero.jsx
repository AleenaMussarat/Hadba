import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import HeroCarousel from './HeroCarousel'
import FeaturedMenu from './FeaturedMenu'

const Hero = ({ onReserveClick }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en

  return (
    <>
    <section className="hero">
      <div className="hero-visual">
        <HeroCarousel />
      </div>

      <div className="container hero-layout">
        <div className="hero-copy">
          <div className="hero-copy-details">
            <div className="hero-promo-banner">
              <div className="hero-promo-icon">
                <img src="/brand/icon-cloche-steam-orange.png" alt="" />
              </div>
              <div className="hero-promo-copy">
                <span className="hero-promo-eyebrow">{t.hero.promoTitle}</span>
                <p>{t.hero.promoText}</p>
              </div>
            </div>

            <div className="hero-card">
              <div className="hero-card-icon-badge">
                <img className="hero-card-icon" src="/brand/icon-table.png" alt="" />
              </div>
              <div>
                <strong>{t.hero.hours}</strong>
                <p>{t.hero.hoursValue}</p>
              </div>
            </div>
          </div>

          <div className="hero-copy-text">
            <p className="eyebrow">{t.hero.eyebrow}</p>
            <h1 dangerouslySetInnerHTML={{ __html: t.hero.title }} />
            <div className="hero-divider" />
            <p className="hero-subtitle">{t.hero.subtitle}</p>
            <p className="hero-tagline">{t.hero.tagline}</p>

            <div className="hero-buttons">
              <Link to="/menu" className="btn btn-primary">{t.hero.ctaPrimary}</Link>
              <button type="button" className="btn btn-secondary" onClick={onReserveClick}>{t.hero.ctaSecondary}</button>
            </div>
          </div>
        </div>
      </div>
    </section>
    <FeaturedMenu />
    </>
  )
}

export default Hero