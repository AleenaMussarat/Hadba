import React, { useEffect, useRef, useState } from 'react'

// Fades an <img> in once its bytes have actually finished loading, instead
// of it popping in abruptly the instant `src` is set — the same progressive-
// reveal pattern most sites use for images. In this app the common case is
// that App.jsx already preloaded the image before this ever mounts (see
// preloadHomeAssets/preloadRestOfSiteAssets in services/strapi.js), so it's
// already in the browser's cache and this resolves as loaded essentially
// immediately; the transition only becomes visible for the images that
// genuinely weren't preloaded yet, so it never looks like it "popped in".
//
// Checks `.complete` on mount/src-change rather than relying on onLoad
// alone: a cached image can finish loading before React even attaches the
// listener, and onLoad never fires again for it — that would leave the
// image stuck invisible.
const FadeImage = ({ src, alt = '', className = '', ...rest }) => {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  useEffect(() => {
    setLoaded(Boolean(imgRef.current?.complete))
  }, [src])

  return (
    <img
      ref={imgRef}
      src={src}
      alt={alt}
      className={`fade-image ${loaded ? 'is-loaded' : ''} ${className}`.trim()}
      onLoad={() => setLoaded(true)}
      {...rest}
    />
  )
}

export default FadeImage
