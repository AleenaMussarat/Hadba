import React, { useEffect, useRef, useState } from 'react'
import { menuImages, translations } from '../i18n/translations'

const HEX_IMAGES = [
  menuImages.lambKabsa,
  menuImages.coffeeDates,
  menuImages.hejaziMandi,
  menuImages.jarish,
  menuImages.saleeg,
  menuImages.fattoush
]

const TARGET_HEX_W = 280
const MIN_COLS = 2
const MIN_ROWS = 2
const MIN_DISPLAY_MS = 2400
const EXIT_MS = 900

// Progress used to just race to 100% on a fixed ~1.5s timer regardless of
// whether the real preload (see App.jsx's preloadHomeAssets) was anywhere
// near done — it would hit 100%, then sit there frozen for however much
// longer the images actually took, which read as stuck/broken rather than
// "still working". Instead it creeps toward CAP_WHILE_LOADING and visibly
// slows down as it nears it (the standard "indeterminate progress" trick)
// for as long as `ready` is false, then quickly catches up to 100% the
// moment the real data/images are actually in.
const CAP_WHILE_LOADING = 92
const TICK_MS = 60

// Column count adapts to viewport width (targeting a fixed tile size)
// instead of a hardcoded 3 columns — a fixed count sized for a phone-width
// screen produced enormous hexagons once stretched across a wide desktop
// viewport. Row count adapts to height the same way, for the same reason.
// Images repeat via modulo once rows/cols grow past HEX_IMAGES.length.
const buildHexGrid = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1440
  const height = typeof window !== 'undefined' ? window.innerHeight : 900
  const cols = Math.max(MIN_COLS, Math.round(width / TARGET_HEX_W))
  const hexW = width / (cols - 0.4)
  const hexH = hexW * 1.1547
  const rowSpacing = hexH * 0.78
  const rows = Math.max(MIN_ROWS, Math.ceil(height / rowSpacing) + 1)
  const gridHeight = rowSpacing * (rows - 1) + hexH
  const startY = (height - gridHeight) / 2

  const cells = []
  let imgIndex = 0
  for (let r = 0; r < rows; r++) {
    const offsetX = r % 2 === 0 ? 0 : hexW / 2
    for (let c = 0; c < cols; c++) {
      const x = c * hexW + offsetX - hexW / 2
      const y = startY + r * rowSpacing
      cells.push({ x, y, w: hexW, h: hexH, image: HEX_IMAGES[imgIndex % HEX_IMAGES.length] })
      imgIndex++
    }
  }
  return cells
}

const LoadingScreen = ({ onFinish, currentLang, ready = true }) => {
  const t = translations[currentLang] || translations.en
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [cells] = useState(buildHexGrid)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const target = ready ? 100 : CAP_WHILE_LOADING
        if (prev >= target) return prev
        // Asymptotic step — larger while far from the target, shrinking as
        // it closes in, so it's always visibly moving but never quite
        // arrives on its own (while loading) or snaps instantly (once
        // ready). Floored so it never fully stalls even at a tiny remainder.
        const step = Math.max((target - prev) * (ready ? 0.18 : 0.035), ready ? 0.6 : 0.12)
        return Math.min(target, prev + step)
      })
    }, TICK_MS)
    return () => clearInterval(interval)
  }, [ready])

  // Holds at 100% until the home page's data/images are actually ready (see
  // preloadHomeAssets in strapi.js and App.jsx) as well as its own minimum
  // branded display time — whichever finishes later. This is what lets Hero/
  // HeroCarousel/FeaturedMenu render with real content immediately once the
  // splash is gone, with no spinner of their own.
  useEffect(() => {
    if (progress < 100 || !ready) return
    const elapsed = Date.now() - startRef.current
    const wait = Math.max(MIN_DISPLAY_MS - elapsed, 0)
    const timer = setTimeout(() => setIsExiting(true), wait)
    return () => clearTimeout(timer)
  }, [progress, ready])

  useEffect(() => {
    if (!isExiting) return
    const timer = setTimeout(() => onFinish && onFinish(), EXIT_MS)
    return () => clearTimeout(timer)
  }, [isExiting, onFinish])

  return (
    <div className={`loading-screen ${isExiting ? 'exiting' : ''}`}>
      <div className="loading-hex-field">
        {cells.map((cell, i) => (
          <div
            className="loading-hex"
            key={i}
            style={{
              width: `${cell.w}px`,
              height: `${cell.h}px`,
              '--tx': `${cell.x}px`,
              '--ty': `${cell.y}px`
            }}
          >
            <img src={cell.image} alt="" loading="eager" />
          </div>
        ))}
      </div>

      <div className="loading-overlay">
        <div className="loading-glass">
          <div className="logo-container">
            <div className="logo-circle">
              <img className="logo-circle-icon" src="/brand/icon-knife-fork.webp" alt="" />
            </div>
            <img className="loading-logo-mark" src="/brand/logo-orange.webp" alt="SAMDAN" />
            <p className="logo-subtitle">{t.hero.eyebrow}</p>
          </div>

          <div className="loading-bar-container">
            <div className="loading-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="loading-percentage">{Math.round(progress)}%</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
