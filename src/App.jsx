import React, { useState, useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider, getLanguageDir } from './i18n'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Menu from './components/Menu'
import About from './components/About'
import Branches from './components/Branches'
import Gallery from './components/Gallery'
import Contact from './components/Contact'
import NotFound from './components/NotFound'
import Footer from './components/Footer'
import LoadingScreen from './components/LoadingScreen'
import ReserveModal from './components/ReserveModal'
import ScrollToTop from './components/ScrollToTop'
import './App.css'

function App() {
  const [currentLang, setCurrentLang] = useState('en')
  const [isLoading, setIsLoading] = useState(true)
  const [isReserveOpen, setIsReserveOpen] = useState(false)

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Noto+Kufi+Arabic:wght@300;400;500;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    document.documentElement.dir = getLanguageDir(currentLang)
    document.documentElement.lang = currentLang

    return () => link.remove()
  }, [])

  const toggleLanguage = (lang) => {
    setCurrentLang(lang)
    document.documentElement.dir = getLanguageDir(lang)
    document.documentElement.lang = lang
  }

  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />
  }

  return (
    <LanguageProvider value={{ currentLang, toggleLanguage }}>
      <HashRouter>
        <div className="app">
          <ScrollToTop />
          <Navbar onReserveClick={() => setIsReserveOpen(true)} />
          <main>
            <Routes>
              <Route path="/" element={<Hero onReserveClick={() => setIsReserveOpen(true)} />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact onReserveClick={() => setIsReserveOpen(true)} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer onReserveClick={() => setIsReserveOpen(true)} />
          <ReserveModal isOpen={isReserveOpen} onClose={() => setIsReserveOpen(false)} />
        </div>
      </HashRouter>
    </LanguageProvider>
  )
}

export default App