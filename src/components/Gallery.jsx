import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchGalleryImages } from '../services/strapi'
import { FaXmark } from 'react-icons/fa6'
import CircularGallery from './reactbits/CircularGallery'

const Gallery = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [images, setImages] = useState(t.gallery.images)
  const [activeImage, setActiveImage] = useState(null)

  useEffect(() => {
    let active = true
    setImages(t.gallery.images)

    fetchGalleryImages(currentLang)
      .then((data) => {
        if (active) setImages(data)
      })
      .catch(() => {
        // Strapi unavailable or empty — keep the static fallback already set above.
      })

    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLang])

  useEffect(() => {
    if (!activeImage) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setActiveImage(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeImage])

  const circularItems = useMemo(
    () => images.map((item) => ({ image: item.image, text: item.caption || '' })),
    [images]
  )

  return (
    <section className="section section-gallery">
      <div className="page-intro-bg" style={{ backgroundImage: 'url(/brand/photo-najdi-architecture.jpg)' }} aria-hidden="true" />
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-plate.png" alt="" />
            {t.gallery.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{t.gallery.title}</h2>
          <p className="section-copy fade-in-up" style={{ animationDelay: '0.25s' }}>{t.gallery.subtitle}</p>
        </div>

        <div className="gallery-grid">
          {images.map((item, index) => (
            <button
              type="button"
              className={`gallery-item gallery-item-${(index % 4) + 1}`}
              key={`${item.caption}-${index}`}
              onClick={() => setActiveImage(item)}
            >
              <img src={item.image} alt={item.caption} loading="lazy" />
              {item.caption && <span className="gallery-item-caption">{item.caption}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="circular-gallery-section">
        <div className="container">
          <h3 className="circular-gallery-heading">
            {currentLang === 'ar' ? 'استكشف بمنظور دائري' : 'Explore in 360°'}
          </h3>
        </div>
        <div className="circular-gallery-wrap">
          <CircularGallery items={circularItems} bend={3} textColor="#F5ECE1" borderRadius={0.05} />
        </div>
      </div>

      {activeImage && (
        <div className="gallery-lightbox" onClick={() => setActiveImage(null)}>
          <button type="button" className="gallery-lightbox-close" aria-label="Close" onClick={() => setActiveImage(null)}>
            <FaXmark />
          </button>
          <img src={activeImage.image} alt={activeImage.caption} onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </section>
  )
}

export default Gallery
