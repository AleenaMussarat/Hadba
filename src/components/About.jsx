import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations, menuImages } from '../i18n/translations'
import ScrollStack, { ScrollStackItem } from './reactbits/ScrollStack'
import ParallaxImage from './ParallaxImage'

const HIGHLIGHT_ICONS = [
  '/brand/icon-highlight-chefhat.png',
  '/brand/icon-highlight-table.png',
  '/brand/icon-highlight-cloche.png',
  '/brand/icon-highlight-cutlery.png'
]

const About = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const visualRef = useRef(null)
  const [flanksOpen, setFlanksOpen] = useState(false)

  useEffect(() => {
    const el = visualRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => setFlanksOpen(entry.isIntersecting),
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section section-about">
      <div className="page-intro-bg" style={{ backgroundImage: 'url(/brand/photo-riyadh-skyline.jpg)' }} aria-hidden="true" />

      <div className="container">
        <div className="about-intro">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-story-eyebrow.png" alt="" />
            {t.story.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{t.story.title}</h2>
          <p className="section-copy section-intro fade-in-up" style={{ animationDelay: '0.25s' }}>{t.story.intro}</p>

          <div ref={visualRef} className={`about-intro-visual fade-in-up ${flanksOpen ? 'is-open' : ''}`} style={{ animationDelay: '0.3s' }}>
            <div className="about-intro-flank left">
              {t.story.highlights.slice(0, 2).map((item, i) => (
                <div key={item} className="highlight-card">
                  <img src={HIGHLIGHT_ICONS[i]} alt="" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="about-intro-photo">
              <img src={menuImages.hejaziMandi} alt="Signature Hejazi Mandi at SAMDAN" />
            </div>

            <div className="about-intro-flank right">
              {t.story.highlights.slice(2, 4).map((item, i) => (
                <div key={item} className="highlight-card">
                  <img src={HIGHLIGHT_ICONS[i + 2]} alt="" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="section-copy fade-in-up" style={{ animationDelay: '0.4s' }}>{t.story.description}</p>
        </div>

        <ScrollStack
          useWindowScroll
          className="story-scroll-stack"
          itemDistance={40}
          stackPosition="12%"
          scaleEndPosition="45%"
          blurAmount={1}
        >
          <ScrollStackItem itemClassName="story-card-panel">
            <img className="story-card-icon" src="/brand/icon-knife-fork.png" alt="" />
            <h3>{t.story.chefTitle}</h3>
            <p className="info-card-name">
              {t.story.chefName}
              <span className="info-card-role">{t.story.chefRole}</span>
            </p>
            <p>{t.story.chefBio}</p>
          </ScrollStackItem>

          <ScrollStackItem itemClassName="story-card-panel">
            <img className="story-card-icon" src="/brand/icon-cloche.png" alt="" />
            <h3>{t.story.qualityTitle}</h3>
            <p>{t.story.qualityText}</p>
          </ScrollStackItem>
        </ScrollStack>
      </div>

      <div className="container">
        <div className="about-block">
          <div className="about-block-image">
            <ParallaxImage src="/brand/photo-ambience-interior.png" alt="Traditional Najdi architecture" />
          </div>
          <div className="about-block-copy">
            <img className="info-card-icon" src="/brand/icon-table.png" alt="" />
            <h3>{t.story.ambienceTitle}</h3>
            <p>{t.story.ambienceText}</p>
          </div>
        </div>
      </div>

    </section>
  )
}

export default About
