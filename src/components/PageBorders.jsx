import React from 'react'
import { useLocation } from 'react-router-dom'

const RED_PATTERN = '/brand/pattern-side-red.png'
const ORANGE_PATTERN = '/brand/pattern-side-orange.png'

// Alternates the border color by page order rather than tying it to any
// per-page theme, so navigating through the site visibly alternates red/orange.
const PAGE_ORDER = ['/', '/about', '/menu', '/branches', '/gallery', '/contact']

const PageBorders = () => {
  const { pathname } = useLocation()
  const index = PAGE_ORDER.indexOf(pathname)
  const pattern = index % 2 === 1 ? ORANGE_PATTERN : RED_PATTERN

  return (
    <>
      <div className="page-border page-border-left" style={{ backgroundImage: `url(${pattern})` }} aria-hidden="true" />
      <div className="page-border page-border-right" style={{ backgroundImage: `url(${pattern})` }} aria-hidden="true" />
    </>
  )
}

export default PageBorders
