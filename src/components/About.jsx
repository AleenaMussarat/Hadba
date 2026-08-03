import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const About = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en

  return (
    <section className="section section-about">
      <div className="container about-grid">
        <div className="about-content">
          <p className="eyebrow">{t.story.eyebrow}</p>
          <h2 className="section-title">{t.story.title}</h2>
          <p className="section-copy section-intro">{t.story.intro}</p>
          <p className="section-copy">{t.story.description}</p>

          <div className="about-cards">
            <article className="info-card">
              <img className="info-card-icon" src="/brand/icon-knife-fork.png" alt="" />
              <h3>{t.story.chefTitle}</h3>
              <p className="info-card-name">
                {t.story.chefName}
                <span className="info-card-role">{t.story.chefRole}</span>
              </p>
              <p>{t.story.chefBio}</p>
            </article>
            <article className="info-card">
              <img className="info-card-icon" src="/brand/icon-cloche.png" alt="" />
              <h3>{t.story.qualityTitle}</h3>
              <p>{t.story.qualityText}</p>
            </article>
          </div>

          <div className="highlights">
            {t.story.highlights.map((item) => (
              <div key={item} className="highlight-pill">{item}</div>
            ))}
          </div>
        </div>

        <div className="about-visuals">
          <img src="/brand/photo-najdi-architecture.jpg" alt="Traditional Najdi architecture" />
          <div className="about-visual-stack">
            <img src="/brand/photo-sadu-interior.jpg" alt="Sadu-woven interior detail" />
            <div className="ambient-card">
              <h3>{t.story.ambienceTitle}</h3>
              <p>{t.story.ambienceText}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About