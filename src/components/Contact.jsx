import React from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { useReservationForm } from '../lib/useReservationForm'
import { FaLocationDot, FaPhone, FaEnvelope, FaClock, FaCircleCheck, FaTriangleExclamation } from 'react-icons/fa6'
import { socialLinks } from '../data/social'
import { MAP_QUERY, MAP_EMBED_SRC } from '../lib/mapConfig'
import mapLocationIcon from '../../assets/images/Icons/Samdan Guidlines ICONS-08.webp'

const Contact = () => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const { form, submitted, isSubmitting, submitError, isReservationsClosed, handleChange, handleSubmit, reset } = useReservationForm()
  return (
    <section className="section contact-section">
      <div className="page-intro-bg" style={{ backgroundImage: 'url(/brand/photo-sadu-interior.webp)' }} aria-hidden="true" />
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow eyebrow-icon fade-in-up" style={{ animationDelay: '0.05s' }}>
            <img src="/brand/icon-cloche.webp" alt="" />
            {t.contact.eyebrow}
          </p>
          <h2 className="section-title fade-in-up" style={{ animationDelay: '0.15s' }}>{t.contact.title}</h2>
          <p className="section-copy fade-in-up" style={{ animationDelay: '0.25s' }}>{t.contact.description}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-panel">
            <div className="contact-details">
              <a className="contact-item" href={`https://maps.google.com/?q=${encodeURIComponent(MAP_QUERY)}`} target="_blank" rel="noreferrer">
                <span className="contact-item-icon"><FaLocationDot /></span>
                <span>{t.contact.address}</span>
              </a>
              <a className="contact-item" href="tel:+966555185657">
                <span className="contact-item-icon"><FaPhone /></span>
                <span dir="ltr">{t.contact.phone}</span>
              </a>
              <a className="contact-item" href="mailto:smdn.ksa@gmail.com">
                <span className="contact-item-icon"><FaEnvelope /></span>
                <span>{t.contact.email}</span>
              </a>
              <div className="contact-item">
                <span className="contact-item-icon"><FaClock /></span>
                <span>{t.contact.hours}</span>
              </div>
            </div>

            <div className="contact-actions">
              <div className="social-links">
                {socialLinks.map(({ key, url, label, Icon }) => (
                  <a key={key} href={url} target="_blank" rel="noreferrer" aria-label={label}><Icon /></a>
                ))}
              </div>
            </div>
          </div>

          <div className="contact-form-block">
            <div className="reserve-heading">
              <img className="reserve-icon" src="/brand/icon-table.webp" alt="" />
              <h3 className="reserve-title">{t.reserve.title}</h3>
            </div>
            <p className="reserve-subtitle">{t.reserve.subtitle}</p>

            {submitted ? (
              <div className="reserve-success">
                <FaCircleCheck className="reserve-success-icon" />
                <h3>{t.reserve.successTitle.replace('{name}', form.name || '')}</h3>
                <p>{t.reserve.successText}</p>
                <button type="button" className="btn btn-primary" onClick={reset}>{t.reserve.submit}</button>
              </div>
            ) : isReservationsClosed ? (
              <div className="reserve-closed">
                <FaTriangleExclamation className="reserve-closed-icon" />
                <h3>{t.reserve.closedTitle}</h3>
                <p>{t.reserve.closedMessage}</p>
                <p className="reserve-closed-phone">
                  {t.reserve.callPhone}
                  <br />
                  <strong dir="ltr">+966 55 518 5657 | +966 53 334 7721</strong>
                </p>
              </div>
            ) : (
              <form className="reserve-form" onSubmit={handleSubmit}>
                <label className="reserve-field">
                  <span>{t.reserve.name}</span>
                  <input type="text" required value={form.name} onChange={handleChange('name')} />
                </label>

                <label className="reserve-field">
                  <span>{t.reserve.phone}</span>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder="05XXXXXXXX (optional)"
                    pattern="^(\+?966|0)?5[0-9]{8}$"
                    title={t.reserve.phoneHint}
                  />
                </label>

                <div className="reserve-field-row">
                  <label className="reserve-field">
                    <span>{t.reserve.date}</span>
                    <input
                      type="text"
                      readOnly
                      placeholder="DD/MM/YYYY"
                      value={form.date}
                    />
                  </label>

                  <label className="reserve-field">
                    <span>{t.reserve.time}</span>
                    <select required value={form.time} onChange={handleChange('time')}>
                      <option value="">Select Time</option>
                      {['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'].map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </label>

                  <label className="reserve-field reserve-field-guests">
                    <span>{t.reserve.guests}</span>
                    <input type="number" min="1" max="20" required value={form.guests} onChange={handleChange('guests')} />
                  </label>
                </div>

                <label className="reserve-field">
                  <span>{t.reserve.notes}</span>
                  <textarea rows="3" placeholder={t.reserve.notesPlaceholder} value={form.notes} onChange={handleChange('notes')} />
                </label>

                {submitError ? (
                  <p className="reserve-error">
                    <FaTriangleExclamation /> {t.reserve.errorText}
                  </p>
                ) : null}

                <button type="submit" className="btn btn-primary reserve-submit" disabled={isSubmitting || isReservationsClosed}>
                  {isSubmitting ? t.reserve.submitting : t.reserve.submit}
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="map-section">
          <div className="map-embed-frame">
            <div className="map-embed-header">
              <img src={mapLocationIcon} alt="" loading="lazy" decoding="async" />
              <span>{t.contact.mapTitle || 'Our Location'}</span>
            </div>
            <iframe
              title="SAMDAN location"
              src={MAP_EMBED_SRC}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
