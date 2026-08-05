import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const NotFound = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en

  return (
    <section className="section section-not-found">
      <div className="container not-found-content">
        <p className="not-found-code">404</p>
        <h2 className="section-title">{t.notFound.title}</h2>
        <p className="section-copy">{t.notFound.subtitle}</p>
        <Link to="/" className="btn btn-primary">{t.notFound.backHome}</Link>
      </div>
    </section>
  )
}

export default NotFound
