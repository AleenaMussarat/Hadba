import React, { useEffect, useRef } from 'react'

// Scroll-driven vertical pan: as the image's container moves through the
// viewport, the image itself shifts slightly slower/faster than the page,
// giving a sense of depth. The offset lives on a wrapper (not the img
// itself) with no CSS transition, since transitioning a value that JS is
// already updating every scroll frame just makes it lag behind its target
// instead of tracking smoothly.
const ParallaxImage = ({ src, alt = '', strength = 30, className = '' }) => {
  const rootRef = useRef(null)

  useEffect(() => {
    const el = rootRef.current
    if (!el) return

    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const mid = rect.top + rect.height / 2 - window.innerHeight / 2
      const progress = Math.max(-1, Math.min(1, mid / (window.innerHeight / 2)))
      el.style.setProperty('--parallax-y', `${progress * strength}px`)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [strength])

  return (
    <div className={`parallax-image ${className}`.trim()} ref={rootRef}>
      <div className="parallax-image-pan">
        <img src={src} alt={alt} />
      </div>
    </div>
  )
}

export default ParallaxImage
