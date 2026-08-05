import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const About = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en

  return (
    <section className="section section-about">
      <div className="about-intro-bg" aria-hidden="true">
        <img src="/brand/photo-riyadh-skyline.jpg" alt="" />
      </div>

      <div className="container">
        <div className="about-intro">
          <p className="eyebrow about-fade-in" style={{ animationDelay: '0.05s' }}>{t.story.eyebrow}</p>
          <h2 className="section-title about-fade-in" style={{ animationDelay: '0.15s' }}>{t.story.title}</h2>
          <p className="section-copy section-intro about-fade-in" style={{ animationDelay: '0.25s' }}>{t.story.intro}</p>
          <div className="about-intro-rule about-fade-in" style={{ animationDelay: '0.35s' }} aria-hidden="true" />
          <p className="section-copy about-fade-in" style={{ animationDelay: '0.4s' }}>{t.story.description}</p>
        </div>

        <div className="highlights about-highlights-centered about-fade-in" style={{ animationDelay: '0.5s' }}>
          {t.story.highlights.map((item) => (
            <div key={item} className="highlight-pill">{item}</div>
          ))}
        </div>

        <div className="story-card">
          <div className="story-card-panel">
            <img className="story-card-icon" src="/brand/icon-knife-fork.png" alt="" />
            <h3>{t.story.chefTitle}</h3>
            <p className="info-card-name">
              {t.story.chefName}
              <span className="info-card-role">{t.story.chefRole}</span>
            </p>
            <p>{t.story.chefBio}</p>
          </div>

          <div className="story-card-divider" aria-hidden="true" />

          <div className="story-card-panel">
            <img className="story-card-icon" src="/brand/icon-cloche.png" alt="" />
            <h3>{t.story.qualityTitle}</h3>
            <p>{t.story.qualityText}</p>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="about-block">
          <div className="about-block-image">
            <img src="/brand/photo-najdi-architecture.jpg" alt="Traditional Najdi architecture" />
          </div>
          <div className="about-block-copy">
            <img className="info-card-icon" src="/brand/icon-table.png" alt="" />
            <h3>{t.story.ambienceTitle}</h3>
            <p>{t.story.ambienceText}</p>
          </div>
        </div>

        <div className="about-gallery-strip">
          <img src="/brand/photo-sadu-interior.jpg" alt="Sadu-woven interior detail" />
        </div>
      </div>
    </section>
  )
}

export default About
