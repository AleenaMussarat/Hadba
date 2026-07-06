import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const Navbar = () => {
  const { currentLang, toggleLanguage } = useLanguage()
  const t = translations[currentLang]

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="logo">
          <span className="logo-icon">🍖</span> Hadba
        </div>

        <div className="nav-links">
          <a href="#home">{t.nav.home}</a>
          <a href="#about">{t.nav.about}</a>
          <a href="#menu">{t.nav.menu}</a>
          <a href="#contact">{t.nav.contact}</a>
        </div>

        <div className="nav-actions">
          <button className="btn-reserve">{t.nav.reserve}</button>
          <div className="lang-toggle">
            <button 
              className={currentLang === 'en' ? 'active' : ''}
              onClick={() => toggleLanguage('en')}
            >
              EN
            </button>
            <button 
              className={currentLang === 'ar' ? 'active' : ''}
              onClick={() => toggleLanguage('ar')}
            >
              AR
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar