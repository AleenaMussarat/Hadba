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

const COLS = 3
const ROWS = 2
const MIN_DISPLAY_MS = 2400
const EXIT_MS = 900

// Exactly one large hexagon per image (COLS * ROWS === HEX_IMAGES.length) — no repeats.
const buildHexGrid = () => {
  const width = typeof window !== 'undefined' ? window.innerWidth : 1440
  const height = typeof window !== 'undefined' ? window.innerHeight : 900
  const hexW = width / (COLS - 0.4)
  const hexH = hexW * 1.1547
  const rowSpacing = hexH * 0.78
  const gridHeight = rowSpacing * (ROWS - 1) + hexH
  const startY = (height - gridHeight) / 2

  const cells = []
  let imgIndex = 0
  for (let r = 0; r < ROWS; r++) {
    const offsetX = r % 2 === 0 ? 0 : hexW / 2
    for (let c = 0; c < COLS; c++) {
      const x = c * hexW + offsetX - hexW / 2
      const y = startY + r * rowSpacing
      cells.push({ x, y, w: hexW, h: hexH, image: HEX_IMAGES[imgIndex % HEX_IMAGES.length] })
      imgIndex++
    }
  }
  return cells
}

const LoadingScreen = ({ onFinish, currentLang }) => {
  const t = translations[currentLang] || translations.en
  const [progress, setProgress] = useState(0)
  const [isExiting, setIsExiting] = useState(false)
  const [cells] = useState(buildHexGrid)
  const startRef = useRef(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 2
      })
    }, 30)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (progress < 100) return
    const elapsed = Date.now() - startRef.current
    const wait = Math.max(MIN_DISPLAY_MS - elapsed, 0)
    const timer = setTimeout(() => setIsExiting(true), wait)
    return () => clearTimeout(timer)
  }, [progress])

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
              <img className="logo-circle-icon" src="/brand/icon-knife-fork.png" alt="" />
            </div>
            <img className="loading-logo-mark" src="/brand/logo-orange.png" alt="SAMDAN" />
            <p className="logo-subtitle">{t.hero.eyebrow}</p>
          </div>

          <div className="loading-bar-container">
            <div className="loading-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="loading-percentage">{progress}%</p>
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
