import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { FaLocationDot, FaPhone, FaEnvelope, FaClock } from 'react-icons/fa6'
import { socialLinks } from '../data/social'

const MAP_QUERY = 'Khalid bin Al Waleed Street, Qurtubah, Riyadh, Saudi Arabia'

const Contact = ({ onReserveClick }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en

  return (
    <section className="section contact-section">
      <div className="page-intro-bg" style={{ backgroundImage: 'url(/brand/photo-sadu-interior.jpg)' }} aria-hidden="true" />
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-cloche.png" alt="" />
            {t.contact.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{t.contact.title}</h2>
          <p className="section-copy fade-in-up" style={{ animationDelay: '0.25s' }}>{t.contact.description}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-panel">
            <div className="contact-details">
              <a className="contact-item" href={`https://maps.google.com/?q=${encodeURIComponent(MAP_QUERY)}`} target="_blank" rel="noreferrer">
                <span className="contact-item-icon"><FaLocationDot /></span>
                <span>{t.contact.address}</span>
              </a>
              <a className="contact-item" href="tel:+966555185657">
                <span className="contact-item-icon"><FaPhone /></span>
                <span>{t.contact.phone}</span>
              </a>
              <a className="contact-item" href="mailto:reservations@samdan.sa">
                <span className="contact-item-icon"><FaEnvelope /></span>
                <span>{t.contact.email}</span>
              </a>
              <div className="contact-item">
                <span className="contact-item-icon"><FaClock /></span>
                <span>{t.contact.hours}</span>
              </div>
            </div>

            <div className="contact-actions">
              <button type="button" className="btn btn-primary" onClick={onReserveClick}>{t.hero.ctaSecondary}</button>
              <div className="social-links">
                {socialLinks.map(({ key, url, label, Icon }) => (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={label}><Icon /></a>
                ))}
              </div>
            </div>
          </div>

          <div className="map-card">
            <iframe
              title="SAMDAN location"
              src={`https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&z=16&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact