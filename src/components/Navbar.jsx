import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage, LANGUAGES } from '../i18n'
import { translations } from '../i18n/translations'
import { FaCalendarCheck, FaBars, FaXmark } from 'react-icons/fa6'
import { socialLinks } from '../data/social'

const Navbar = ({ onReserveClick }) => {
  const { currentLang, toggleLanguage } = useLanguage()
  const t = translations[currentLang] || translations.en
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const mobileMenuRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset'
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { path: '/', label: t.nav.home },
    { path: '/about', label: t.nav.about },
    { path: '/menu', label: t.nav.menu },
    { path: '/branches', label: t.nav.branches },
    { path: '/gallery', label: t.nav.gallery },
    { path: '/contact', label: t.nav.contact }
  ]

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          <Link className="logo" to="/">
            <img className="logo-mark" src="/brand/logo-red.png" alt="SAMDAN" />
          </Link>

          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  <span className="nav-link-text">{link.label}</span>
                  <span className="nav-link-indicator"></span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="nav-actions">
            <div className="lang-toggle">
              {LANGUAGES.map((lang, index) => (
                <React.Fragment key={lang.code}>
                  {index > 0 && <div className="lang-divider"></div>}
                  <button
                    className={currentLang === lang.code ? 'active' : ''}
                    onClick={() => toggleLanguage(lang.code)}
                    aria-label={`Switch to ${lang.name}`}
                  >
                    {lang.label}
                  </button>
                </React.Fragment>
              ))}
            </div>

            <button className="btn-reserve" onClick={onReserveClick}>
              <FaCalendarCheck className="btn-icon" />
              <span>{t.nav.reserve}</span>
            </button>

            <button className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Toggle menu">
              {isMobileMenuOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />

      <div ref={mobileMenuRef} className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <Link className="logo" to="/" onClick={() => setIsMobileMenuOpen(false)}>
            <img className="logo-mark" src="/brand/logo-red.png" alt="SAMDAN" />
            <span className="logo-sub">Saudi Heritage Dining</span>
          </Link>
          <button className="mobile-menu-close" onClick={() => setIsMobileMenuOpen(false)}>
            <FaXmark />
          </button>
        </div>

        <ul className="mobile-nav-links">
          {navLinks.map((link, index) => (
            <li key={link.path} style={{ animationDelay: `${index * 0.1}s` }}>
              <Link
                to={link.path}
                className={`mobile-nav-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                <span className="mobile-nav-link-number">0{index + 1}</span>
                <span className="mobile-nav-link-text">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-footer">
          <button
            className="btn-reserve mobile-reserve"
            onClick={() => { setIsMobileMenuOpen(false); onReserveClick() }}
          >
            <FaCalendarCheck className="btn-icon" />
            <span>{t.nav.reserve}</span>
          </button>
          <div className="mobile-social-icons">
            {socialLinks.map(({ key, url, label, Icon }) => (
              <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={label}><Icon /></a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar
