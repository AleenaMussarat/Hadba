import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const Contact = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang]

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="contact-grid">
          <div className="contact-info">
            <h2 className="section-title">{t.contact.title}</h2>
            <div className="contact-details">
              <div className="contact-item">
                <span className="contact-icon">📍</span>
                <p>{t.contact.address}</p>
              </div>
              <div className="contact-item">
                <span className="contact-icon">📞</span>
                <p>{t.contact.phone}</p>
              </div>
              <div className="contact-item">
                <span className="contact-icon">✉️</span>
                <p>{t.contact.email}</p>
              </div>
              <div className="contact-item">
                <span className="contact-icon">🕐</span>
                <p>{t.contact.hours}</p>
              </div>
            </div>
            <button className="btn-primary">{t.contact.button}</button>
          </div>
          <div className="contact-map">
            <div className="map-placeholder">
              <span>🗺️</span>
              <p>Google Maps</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact