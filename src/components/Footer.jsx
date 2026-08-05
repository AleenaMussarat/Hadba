import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { socialLinks } from '../data/social'

const Footer = ({ onReserveClick }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en

  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-brand">
          <img className="footer-logo" src="/brand/logo-orange.png" alt="SAMDAN" />
          <span className="footer-divider" />
          <p className="footer-quote">{t.hero.tagline}</p>
        </div>

        <div className="footer-col">
          <h4>{t.footer.linksTitle}</h4>
          <div className="footer-links">
            <Link to="/">{t.nav.home}</Link>
            <Link to="/about">{t.nav.about}</Link>
            <Link to="/menu">{t.nav.menu}</Link>
            <Link to="/branches">{t.nav.branches}</Link>
            <Link to="/gallery">{t.nav.gallery}</Link>
            <Link to="/contact">{t.nav.contact}</Link>
          </div>
        </div>

        <div className="footer-col footer-col-contact">
          <div>
            <h4>{t.footer.contactTitle}</h4>
            <p>{t.contact.address}</p>
            <p>{t.contact.phone}</p>
            <p>{t.contact.hours}</p>
          </div>

          <div className="footer-follow">
            <h4>{t.footer.follow}</h4>
            <div className="social-icons">
              {socialLinks.map(({ key, url, label, Icon }) => (
                <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={label}><Icon /></a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>{t.footer.rights}</p>
      </div>

      <button className="sticky-cta" onClick={onReserveClick}>{t.footer.cta}</button>
    </footer>
  )
}

export default Footer
