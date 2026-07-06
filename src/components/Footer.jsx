import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const Footer = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang]

  return (
    <footer className="footer">
      <div className="container footer-content">
        <div className="footer-brand">
          <h3>🍖 Hadba</h3>
          <p>{t.footer.rights}</p>
        </div>
        <div className="footer-social">
          <span>{t.footer.follow}</span>
          <div className="social-icons">
            <a href="#"><span>📱</span></a>
            <a href="#"><span>🐦</span></a>
            <a href="#"><span>📸</span></a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer