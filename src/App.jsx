import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider, getLanguageDir } from './i18n'
import { translations } from './i18n/translations'
import Navbar from './components/Navbar'
import PageBorders from './components/PageBorders'
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
import BackToTop from './components/BackToTop'
import MapPreload from './components/MapPreload'
import { startSmoothScroll, stopSmoothScroll } from './lib/smoothScroll'
import { checkReservationsEnabled, preloadHomeAssets, preloadRestOfSiteAssets } from './services/strapi'
import './App.css'

const LANG_STORAGE_KEY = 'samdan-lang'

function App() {
  const [currentLang, setCurrentLang] = useState(() => localStorage.getItem(LANG_STORAGE_KEY) || 'ar')
  const [isLoading, setIsLoading] = useState(true)
  const [homeReady, setHomeReady] = useState(false)
  const [isReserveOpen, setIsReserveOpen] = useState(false)

  // The home page is where nearly every visitor lands first, so its data AND
  // images are fully loaded while the splash screen is still up — the splash
  // won't finish until this resolves (see the `ready` prop below), so Hero/
  // HeroCarousel/FeaturedMenu can render real content immediately with no
  // loading state of their own. Every other page's data is only warmed in
  // the background, starting once the home preload is done so it isn't
  // competing with it for bandwidth — home genuinely finishes first, the
  // rest "depending" on whether a visitor gets there before it's done.
  useEffect(() => {
    let active = true
    preloadHomeAssets(currentLang)
      .catch(() => {})
      .finally(() => {
        if (!active) return
        setHomeReady(true)
        preloadRestOfSiteAssets(currentLang).catch(() => {})
      })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Noto+Kufi+Arabic:wght@300;400;500;600;700&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    document.documentElement.dir = getLanguageDir(currentLang)
    document.documentElement.lang = currentLang

    return () => link.remove()
  }, [])

  // Keep the browser-tab title in the active language (the static one in
  // index.html only covers the first paint, before React mounts).
  useEffect(() => {
    const t = translations[currentLang] || translations.en
    if (t.documentTitle) document.title = t.documentTitle
  }, [currentLang])

  // One smooth-scroll instance for the whole site (not just pages that
  // happen to mount ScrollStack) — see src/lib/smoothScroll.js.
  useEffect(() => {
    startSmoothScroll()
    return () => stopSmoothScroll()
  }, [])

  useEffect(() => {
    checkReservationsEnabled().then((enabled) => {
      if (!enabled) setIsReserveOpen(true)
    })
  }, [])

  const toggleLanguage = (lang) => {
    setCurrentLang(lang)
    document.documentElement.dir = getLanguageDir(lang)
    document.documentElement.lang = lang
    localStorage.setItem(LANG_STORAGE_KEY, lang)
  }

  if (isLoading) {
    return (
      <>
        <MapPreload />
        <LoadingScreen currentLang={currentLang} ready={homeReady} onFinish={() => setIsLoading(false)} />
      </>
    )
  }

  return (
    <LanguageProvider value={{ currentLang, toggleLanguage }}>
      <BrowserRouter>
        <div className="app">
          <MapPreload />
          <ScrollToTop />
          <Navbar onReserveClick={() => setIsReserveOpen(true)} />
          <main>
            <PageBorders />
            <Routes>
              <Route path="/" element={<Hero onReserveClick={() => setIsReserveOpen(true)} />} />
              <Route path="/about" element={<About />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer onReserveClick={() => setIsReserveOpen(true)} />
          <ReserveModal isOpen={isReserveOpen} onClose={() => setIsReserveOpen(false)} />
          <BackToTop />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App