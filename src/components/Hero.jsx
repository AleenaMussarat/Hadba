import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const Hero = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang]

  return (
    <section id="home" className="hero">
      <div className="container hero-content">
        <div className="hero-text">
          <h1 dangerouslySetInnerHTML={{ __html: t.hero.title }} />
          <p>{t.hero.subtitle}</p>
          <div className="hero-buttons">
            <button className="btn-primary">{t.hero.cta}</button>
            <button className="btn-secondary">{t.hero.cta2}</button>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-image-placeholder">
            <span>🍖</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero