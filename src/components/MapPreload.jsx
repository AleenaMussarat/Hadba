import React from 'react'
import { MAP_EMBED_SRC } from '../lib/mapConfig'

// Mounted once at the app root, on every route — not just the Contact page —
// so the map embed's underlying resources start fetching and land in the
// browser cache as soon as the site loads. An iframe's src loads regardless
// of it being visually hidden, so by the time someone actually navigates to
// Contact, its visible iframe (same URL) loads from cache instead of cold.
const MapPreload = () => (
  <iframe
    src={MAP_EMBED_SRC}
    title=""
    aria-hidden="true"
    tabIndex={-1}
    style={{
      position: 'fixed',
      top: -9999,
      left: -9999,
      width: 1,
      height: 1,
      opacity: 0,
      border: 0,
      pointerEvents: 'none'
    }}
  />
)

export default MapPreload
