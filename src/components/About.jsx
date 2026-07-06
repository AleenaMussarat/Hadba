import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const About = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang]

  return (
    <section id="about" className="about">
      <div className="container">
        <div className="about-grid">
          <div className="about-image">
            <div className="about-image-placeholder">
              <span>🏺</span>
            </div>
          </div>
          <div className="about-text">
            <h2 className="section-title">{t.about.title}</h2>
            <p className="about-description">{t.about.description}</p>
            <div className="features">
              <div className="feature">
                <span className="feature-icon">👨‍🍳</span>
                <h3>{t.about.feature1}</h3>
              </div>
              <div className="feature">
                <span className="feature-icon">🌿</span>
                <h3>{t.about.feature2}</h3>
              </div>
              <div className="feature">
                <span className="feature-icon">❤️</span>
                <h3>{t.about.feature3}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About