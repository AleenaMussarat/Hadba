import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import ScrollStack, { ScrollStackItem } from './reactbits/ScrollStack'
import { getLenis } from '../lib/smoothScroll'
import patternBg from '../../assets/images/GuidlinePictures/Pattern.jpeg'

const HIGHLIGHT_ICONS = [
  '/brand/icon-highlight-chefhat.png',
  '/brand/icon-highlight-table.png',
  '/brand/icon-highlight-cloche.png',
  '/brand/icon-highlight-cutlery.png'
]

const CARDS_IN_AT = 0.55

const About = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const visualRef = useRef(null)
  const [progress, setProgress] = useState(0)

  // Continuous scroll progress (not a boolean) so the pattern image can
  // expand smoothly as this section scrolls into view, rather than
  // snapping. The highlight cards then slide in once progress crosses
  // CARDS_IN_AT, so they visibly follow the image's expand instead of
  // arriving at the same time as it.
  useEffect(() => {
    const el = visualRef.current
    if (!el) return

    const updateProgress = () => {
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      const start = viewportH * 0.9
      const end = viewportH * 0.35
      const p = (start - rect.top) / (start - end)
      setProgress(Math.min(1, Math.max(0, p)))
    }

    const lenis = getLenis()
    if (lenis) {
      lenis.on('scroll', updateProgress)
    } else {
      window.addEventListener('scroll', updateProgress, { passive: true })
    }
    updateProgress()

    return () => {
      if (lenis) {
        lenis.off('scroll', updateProgress)
      } else {
        window.removeEventListener('scroll', updateProgress)
      }
    }
  }, [])

  const patternScale = 0.55 + progress * 0.45
  const flanksOpen = progress > CARDS_IN_AT

  return (
    <section className="section section-about">
      <div className="page-intro-bg" style={{ backgroundImage: 'url(/brand/photo-sadu-interior.jpg)' }} aria-hidden="true" />

      <div className="container">
        <div className="about-intro">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-story-eyebrow.png" alt="" />
            {t.story.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{t.story.title}</h2>
          <p className="section-copy section-intro fade-in-up" style={{ animationDelay: '0.25s' }}>{t.story.intro}</p>
        </div>

        <div ref={visualRef} className={`about-intro-visual fade-in-up ${flanksOpen ? 'is-open' : ''}`} style={{ animationDelay: '0.3s' }}>
          <div className="about-intro-pattern">
            <div className="about-intro-pattern-inner" style={{ transform: `scaleX(${patternScale})` }}>
              <img src={patternBg} alt="" />
              <span className="about-intro-pattern-vignette" aria-hidden="true" />
            </div>
          </div>

          <div className="about-intro-visual-content">
            <div className="about-intro-flank left">
              {t.story.highlights.slice(0, 2).map((item, i) => (
                <div key={item} className="highlight-card">
                  <img src={HIGHLIGHT_ICONS[i]} alt="" />
                  <span>{item}</span>
                </div>
              ))}
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
        </div>

        <div className="about-story-band">
          <p className="section-copy fade-in-up" style={{ animationDelay: '0.4s' }}>{t.story.description}</p>

          <ScrollStack
            useWindowScroll
            className="story-scroll-stack"
            itemDistance={40}
            stackPosition="12%"
            scaleEndPosition="45%"
            blurAmount={1}
          >
            <ScrollStackItem itemClassName="story-card-panel story-card-chef">
              <img className="story-card-icon" src="/brand/icon-knife-fork.png" alt="" />
              <h3>{t.story.chefTitle}</h3>
              <p className="info-card-name">
                {t.story.chefName}
                <span className="info-card-role">{t.story.chefRole}</span>
              </p>
              <p>{t.story.chefBio}</p>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="story-card-panel story-card-promise">
              <img className="story-card-icon" src="/brand/icon-cloche.png" alt="" />
              <h3>{t.story.qualityTitle}</h3>
              <p>{t.story.qualityText}</p>
            </ScrollStackItem>

            <ScrollStackItem itemClassName="story-card-panel story-card-ambience">
              <img className="story-card-icon" src="/brand/icon-table.png" alt="" />
              <h3>{t.story.ambienceTitle}</h3>
              <p>{t.story.ambienceText}</p>
            </ScrollStackItem>
          </ScrollStack>
        </div>
      </div>

    </section>
  )
}

export default About
