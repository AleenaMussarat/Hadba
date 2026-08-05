import React, { useEffect, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchGalleryImages } from '../services/strapi'
import { FaXmark } from 'react-icons/fa6'

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

  return (
    <section className="section section-gallery">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">{t.gallery.eyebrow}</p>
          <h2 className="section-title">{t.gallery.title}</h2>
          <p className="section-copy">{t.gallery.subtitle}</p>
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
