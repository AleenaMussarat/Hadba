import React, { useState, useEffect, useRef } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { FaUtensils, FaPhone, FaUser, FaBars, FaTimes } from 'react-icons/fa'

const Navbar = () => {
  const { currentLang, toggleLanguage } = useLanguage()
  const t = translations[currentLang]
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const mobileMenuRef = useRef(null)

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
      
      // Update active section based on scroll position
      const sections = ['home', 'about', 'menu', 'contact']
      const scrollPosition = window.scrollY + 100
      
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close mobile menu on resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsMobileMenuOpen(false)
    }
  }

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'about', label: t.nav.about },
    { id: 'menu', label: t.nav.menu },
    { id: 'contact', label: t.nav.contact }
  ]

  return (
    <>
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="container nav-container">
          {/* Logo */}
          <div className="logo" onClick={() => scrollToSection('home')}>
            <div className="logo-icon-wrapper">
              <FaUtensils className="logo-icon" />
            </div>
            <div className="logo-text">
              <span className="logo-main">Samdan</span>
              <span className="logo-sub">Mandi</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <ul className="nav-links">
            {navLinks.map((link) => (
              <li key={link.id}>
                <a
                  href={`#${link.id}`}
                  className={`nav-link ${activeSection === link.id ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(link.id)
                  }}
                >
                  <span className="nav-link-text">{link.label}</span>
                  <span className="nav-link-indicator"></span>
                </a>
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="nav-actions">
            {/* Language Toggle */}
            <div className="lang-toggle">
              <button
                className={currentLang === 'en' ? 'active' : ''}
                onClick={() => toggleLanguage('en')}
                aria-label="Switch to English"
              >
                EN
              </button>
              <div className="lang-divider"></div>
              <button
                className={currentLang === 'ar' ? 'active' : ''}
                onClick={() => toggleLanguage('ar')}
                aria-label="Switch to Arabic"
              >
                AR
              </button>
            </div>

            {/* Reserve Button */}
            <button 
              className="btn-reserve"
              onClick={() => scrollToSection('contact')}
            >
              <FaPhone className="btn-icon" />
              <span>{t.nav.reserve}</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile Menu */}
      <div 
        ref={mobileMenuRef}
        className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}
      >
        <div className="mobile-menu-header">
          <div className="logo">
            <div className="logo-icon-wrapper">
              <FaUtensils className="logo-icon" />
            </div>
            <div className="logo-text">
              <span className="logo-main">Samdan</span>
              <span className="logo-sub">Mandi</span>
            </div>
          </div>
          <button 
            className="mobile-menu-close"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <FaTimes />
          </button>
        </div>

        <ul className="mobile-nav-links">
          {navLinks.map((link, index) => (
            <li 
              key={link.id}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <a
                href={`#${link.id}`}
                className={`mobile-nav-link ${activeSection === link.id ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection(link.id)
                }}
              >
                <span className="mobile-nav-link-number">0{index + 1}</span>
                <span className="mobile-nav-link-text">{link.label}</span>
              </a>
            </li>
          ))}
        </ul>

        <div className="mobile-menu-footer">
          <button 
            className="btn-reserve mobile-reserve"
            onClick={() => scrollToSection('contact')}
          >
            <FaPhone className="btn-icon" />
            <span>{t.nav.reserve}</span>
          </button>
          <div className="mobile-social-icons">
            <a href="#" aria-label="Instagram"><span>📸</span></a>
            <a href="#" aria-label="Twitter"><span>🐦</span></a>
            <a href="#" aria-label="Facebook"><span>📘</span></a>
          </div>
        </div>
      </div>
    </>
  )
}

export default Navbar