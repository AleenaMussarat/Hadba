import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchPageHero } from '../services/strapi'
import HeroCarousel from './HeroCarousel'
import FeaturedMenu from './FeaturedMenu'
import SectionLoader from './SectionLoader'

const Hero = ({ onReserveClick }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [heroData, setHeroData] = useState(null)
  const [heroLoading, setHeroLoading] = useState(true)

  useEffect(() => {
    let active = true
    setHeroLoading(true)
    fetchPageHero('home', currentLang)
      .then((data) => {
        if (active) setHeroData(data)
      })
      .catch(() => {
        if (active) setHeroData(null)
      })
      .finally(() => {
        if (active) setHeroLoading(false)
      })
    return () => {
      active = false
    }
  }, [currentLang])

  // Merged per-field (not all-or-nothing) — page-hero in Strapi only stores
  // title/subtitle/backgroundImage, so every other field here always comes
  // from the static translations regardless of whether a Strapi record exists.
  // backgroundImage has no static fallback on purpose — it's only ever shown
  // once the real CMS image is loaded (see the SectionLoader/is-cms-loaded
  // handling below), never a placeholder photo.
  const hero = {
    eyebrow: t.hero.eyebrow,
    tagline: t.hero.tagline,
    title: heroData?.title || t.hero.title,
    subtitle: heroData?.subtitle || t.hero.subtitle,
    promoTitle: t.hero.promoTitle,
    promoText: t.hero.promoText,
    hours: t.hero.hours,
    hoursValue: t.hero.hoursValue,
    ctaPrimary: t.hero.ctaPrimary,
    ctaSecondary: t.hero.ctaSecondary,
    backgroundImage: heroData?.backgroundImage || null,
    eyebrowIcon: 'brand/SingleRedBox.webp',
    cardIcon: '/brand/icon-table.webp',
    promoIcon: '/brand/icon-cloche-steam-orange.webp'
  }

  return (
    <>
      <section className="hero">
        {hero.backgroundImage ? (
          <div
            className="page-intro-bg is-cms-loaded"
            style={{ backgroundImage: `url(${hero.backgroundImage})` }}
            aria-hidden="true"
          />
        ) : heroLoading ? (
          <SectionLoader overlay />
        ) : null}

        <div className="container">
          <div className="section-heading">
            <p className="eyebrow eyebrow-icon">
              <img src={hero.eyebrowIcon} alt="" />
              {hero.eyebrow}
            </p>
            <h2 className="section-title" dangerouslySetInnerHTML={{ __html: hero.tagline }} />
          </div>
        </div>

        <div className="hero-visual">
          <HeroCarousel />
        </div>

        <div className="container hero-layout">
          <div className="hero-copy">
            <div className="hero-copy-details">
              <div className="hero-promo-banner">
                <div className="hero-promo-icon">
                  <img src={hero.promoIcon || '/brand/icon-cloche-steam-orange.webp'} alt="" />
                </div>
                <div className="hero-promo-copy">
                  <span className="hero-promo-eyebrow">{hero.promoTitle}</span>
                  <p>{hero.promoText}</p>
                </div>
              </div>

              <div className="hero-card">
                <div className="hero-card-icon-badge">
                  <img className="hero-card-icon" src={hero.cardIcon || '/brand/icon-table.webp'} alt="" />
                </div>
                <div>
                  <strong>{hero.hours}</strong>
                  <p>{hero.hoursValue}</p>
                </div>
              </div>
            </div>

            <div className="hero-copy-text">
              <h1 dangerouslySetInnerHTML={{ __html: hero.title }} />
              <div className="hero-divider" />
              <p className="hero-subtitle">{hero.subtitle}</p>

              <div className="hero-buttons">
                <Link to="/menu" className="btn btn-primary">{hero.ctaPrimary}</Link>
                <button type="button" className="btn btn-secondary" onClick={onReserveClick}>{hero.ctaSecondary}</button>
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