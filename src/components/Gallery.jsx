import React, { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { fetchGalleryImages, fetchPageHero } from '../services/strapi'
import { FaXmark } from 'react-icons/fa6'
import Masonry from './reactbits/Masonry'

const Gallery = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [images, setImages] = useState(t.gallery.images)
  const [activeImage, setActiveImage] = useState(null)

  const [heroData, setHeroData] = useState(null)

  useEffect(() => {
    fetchPageHero('gallery', currentLang)
      .then((data) => setHeroData(data))
      .catch(() => setHeroData(null))
  }, [currentLang])

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

  const masonryItems = useMemo(
    () =>
      images.map((item, index) => ({
        id: `${item.caption}-${index}`,
        img: item.image,
        caption: item.caption
      })),
    [images]
  )

  const hero = heroData || {
    title: t.gallery.title,
    subtitle: t.gallery.subtitle,
    backgroundImage: '/brand/photo-sadu-interior.webp'
  }

  return (
    <section className="section section-gallery">
      <div className="page-intro-bg" style={{ backgroundImage: `url(${hero.backgroundImage})` }} aria-hidden="true" />
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-plate.webp" alt="" />
            {t.gallery.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{hero.title}</h2>
          <p className="section-copy fade-in-up" style={{ animationDelay: '0.25s' }}>{hero.subtitle}</p>
        </div>

        <div className="gallery-masonry-wrap">
          <Masonry
            items={masonryItems}
            onItemClick={(item) => setActiveImage({ image: item.img, caption: item.caption })}
          />
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
