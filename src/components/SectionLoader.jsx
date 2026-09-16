import React from 'react'

// Shown in place of any CMS-sourced image/content block while its fetch is
// still in flight — replaces the old pattern of seeding state with a local
// stock/placeholder image and silently swapping it for the real one later,
// which read as "images don't load properly, then they load".
//
// `overlay` renders as the same absolutely-positioned box every page's
// .page-intro-bg photo band occupies (top:0, 500px tall) so it can stand in
// for that band before a CMS backgroundImage is available, without
// disturbing the rest of the page's layout the way a normal block element
// would. Default (no `overlay`) is a plain in-flow centered spinner, used
// for content grids (menu items, gallery, branches, the dish carousel).
const SectionLoader = ({ minHeight, overlay }) => {
  if (overlay) {
    return (
      <div className="page-intro-bg-loader" aria-hidden="true">
        <span className="section-loader-spinner" aria-hidden="true" />
      </div>
    )
  }

  return (
    <div className="section-loader" style={minHeight ? { minHeight } : undefined}>
      <span className="section-loader-spinner" aria-hidden="true" />
    </div>
  )
}

export default SectionLoader
