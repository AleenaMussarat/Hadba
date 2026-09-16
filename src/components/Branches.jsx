import React, { useEffect, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchBranches, fetchPageHero } from '../services/strapi'
import { FaLocationDot, FaClock, FaDiamondTurnRight } from 'react-icons/fa6'
import ParallaxImage from './ParallaxImage'

const Branches = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  // No static fallback — only ever shows what Strapi returns. App.jsx warms
  // this in the background after the splash screen (preloadRestOfSiteAssets).
  const [branches, setBranches] = useState([])

  const [heroData, setHeroData] = useState(null)

  useEffect(() => {
    let active = true
    fetchPageHero('branches', currentLang)
      .then((data) => {
        if (active) setHeroData(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [currentLang])

  useEffect(() => {
    let active = true
    fetchBranches(currentLang)
      .then((data) => {
        if (active) setBranches(data)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [currentLang])

  const hero = {
    title: heroData?.title || t.branches.title,
    subtitle: heroData?.subtitle || t.branches.subtitle,
    backgroundImage: heroData?.backgroundImage || null
  }

  return (
    <section className="section section-branches">
      {hero.backgroundImage ? (
        <div
          className="page-intro-bg is-cms-loaded"
          style={{ backgroundImage: `url(${hero.backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-table.webp" alt="" />
            {t.branches.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{hero.title}</h2>
          <p className="section-copy fade-in-up" style={{ animationDelay: '0.25s' }}>{hero.subtitle}</p>
        </div>

        <div className="branches-box">
          <div className="branches-grid">
            {branches.map((branch) => (
              <article className="branch-card" key={branch.name}>
                <div className="branch-card-image">
                  <ParallaxImage src={branch.image} alt={branch.name} strength={20} />
                </div>
                <div className="branch-card-body">
                  <h3>{branch.name}</h3>
                  <p className="branch-detail">
                    <span className="contact-item-icon"><FaLocationDot /></span>
                    <span>{branch.location}</span>
                  </p>
                  <p className="branch-detail">
                    <span className="contact-item-icon"><FaClock /></span>
                    <span>{branch.hours}</span>
                  </p>
                  <a className="btn btn-primary branch-directions" href={branch.mapsLink} target="_blank" rel="noreferrer">
                    <FaDiamondTurnRight />
                    {t.branches.directionsLabel}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Branches
