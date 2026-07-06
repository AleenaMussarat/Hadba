import React, { useState, useEffect } from 'react'
import { LanguageProvider } from './i18n'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Contact from './components/Contact'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import './App.css'

function App() {
  const [currentLang, setCurrentLang] = useState('en')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load fonts
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Noto+Kufi+Arabic:wght@300;400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    // Simulate loading time (minimum 1.5 seconds)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000) // Show logo for 2 seconds

    return () => clearTimeout(timer)
  }, [])

  const toggleLanguage = (lang) => {
    setCurrentLang(lang)
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.body.className = lang === 'ar' ? 'lang-ar' : ''
  }

  if (isLoading) {
    return <LoadingScreen />
  }

  return (
    <LanguageProvider value={{ currentLang, toggleLanguage }}>
      <div className={`app ${currentLang === 'ar' ? 'lang-ar' : ''}`}>
        <Navbar />
        <Hero />
        <About />
        <Menu />
        <Contact />
        <Footer />
      </div>
    </LanguageProvider>
  )
}

export default App