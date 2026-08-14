import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { socialLinks } from '../data/social'
import { FaLocationDot, FaPhone, FaClock } from 'react-icons/fa6'

const FooterLinkIcon = () => <img className="footer-link-icon" src="/brand/icon-chef-hat.png" alt="" />

const Footer = ({ onReserveClick }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en

  return (
    <footer className="footer">
      <div className="container footer-shell">
        <div className="footer-brand">
          <img className="footer-logo" src="/brand/logo-orange.png" alt="SAMDAN" />
          <span className="footer-divider" />
          <p className="footer-quote" dangerouslySetInnerHTML={{ __html: t.hero.tagline }} />
        </div>

        <div className="footer-col">
          <h4>{t.footer.linksTitle}</h4>
          <div className="footer-links">
            <Link to="/"><FooterLinkIcon />{t.nav.home}</Link>
            <Link to="/about"><FooterLinkIcon />{t.nav.about}</Link>
            <Link to="/menu"><FooterLinkIcon />{t.nav.menu}</Link>
            <Link to="/branches"><FooterLinkIcon />{t.nav.branches}</Link>
            <Link to="/gallery"><FooterLinkIcon />{t.nav.gallery}</Link>
            <Link to="/contact"><FooterLinkIcon />{t.nav.contact}</Link>
          </div>
        </div>

        <div className="footer-col footer-col-contact">
          <div className="footer-contact-list">
            <h4>{t.footer.contactTitle}</h4>
            <div className="footer-contact-rows">
              <p><FaLocationDot className="footer-contact-icon" /><span>{t.contact.address}</span></p>
              <p><FaPhone className="footer-contact-icon" /><span dir="ltr">{t.contact.phone}</span></p>
              <p><FaClock className="footer-contact-icon" /><span>{t.contact.hours}</span></p>
            </div>
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
