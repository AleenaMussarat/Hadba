import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'

const Menu = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang]

  return (
    <section id="menu" className="menu">
      <div className="container">
        <div className="menu-header">
          <h2 className="section-title">{t.menu.title}</h2>
          <p className="section-subtitle">{t.menu.subtitle}</p>
        </div>
        <div className="menu-grid">
          {t.menu.items.map((item, index) => (
            <div key={index} className="menu-card">
              <div className="menu-card-content">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <span className="menu-price">{item.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Menu