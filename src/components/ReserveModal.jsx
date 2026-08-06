import React, { useEffect, useState } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { submitInquiry } from '../services/strapi'
import { FaXmark, FaCircleCheck, FaTriangleExclamation } from 'react-icons/fa6'

const emptyForm = { name: '', phone: '', guests: 2, date: '', time: '', notes: '' }

// The date field is typed/displayed as DD/MM/YYYY, but Strapi's date field
// needs ISO YYYY-MM-DD.
const ddmmyyyyToISO = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return ''
  const [, dd, mm, yyyy] = match
  return `${yyyy}-${mm}-${dd}`
}

const ReserveModal = ({ isOpen, onClose }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setForm(emptyForm)
      setSubmitted(false)
      setSubmitError(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(false)
    const isoDate = ddmmyyyyToISO(form.date)
    if (!isoDate) {
      setIsSubmitting(false)
      setSubmitError(true)
      return
    }
    const ok = await submitInquiry({ ...form, date: isoDate })
    setIsSubmitting(false)
    if (ok) {
      setSubmitted(true)
    } else {
      setSubmitError(true)
    }
  }

  return (
    <div className="reserve-overlay" onClick={onClose}>
      <div className="reserve-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reserve-modal-bg" aria-hidden="true">
          <img src="/brand/photo-palm-sunset.png" alt="" />
        </div>

        <div className="reserve-modal-content">
          <button type="button" className="reserve-close" onClick={onClose} aria-label={t.reserve.close}>
            <FaXmark />
          </button>

          {submitted ? (
            <div className="reserve-success">
              <FaCircleCheck className="reserve-success-icon" />
              <h3>{t.reserve.successTitle.replace('{name}', form.name || '')}</h3>
              <p>{t.reserve.successText}</p>
              <button type="button" className="btn btn-primary" onClick={onClose}>{t.reserve.close}</button>
            </div>
          ) : (
            <>
              <div className="reserve-heading">
                <img className="reserve-icon" src="/brand/icon-table.png" alt="" />
                <h3 className="reserve-title">{t.reserve.title}</h3>
              </div>
              <p className="reserve-subtitle">{t.reserve.subtitle}</p>

              <form className="reserve-form" onSubmit={handleSubmit}>
                <label className="reserve-field">
                  <span>{t.reserve.name}</span>
                  <input type="text" required value={form.name} onChange={handleChange('name')} />
                </label>

                <label className="reserve-field">
                  <span>{t.reserve.phone}</span>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={handleChange('phone')}
                    placeholder="05XXXXXXXX"
                    pattern="^(\+?966|0)?5[0-9]{8}$"
                    title={t.reserve.phoneHint}
                  />
                </label>

                <div className="reserve-field-row">
                  <label className="reserve-field">
                    <span>{t.reserve.date}</span>
                    <input
                      type="text"
                      required
                      inputMode="numeric"
                      placeholder="DD/MM/YYYY"
                      pattern="\d{2}/\d{2}/\d{4}"
                      title="DD/MM/YYYY"
                      value={form.date}
                      onChange={handleChange('date')}
                    />
                  </label>

                  <label className="reserve-field">
                    <span>{t.reserve.time}</span>
                    <input type="time" required value={form.time} onChange={handleChange('time')} />
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

                <button type="submit" className="btn btn-primary reserve-submit" disabled={isSubmitting}>
                  {isSubmitting ? t.reserve.submitting : t.reserve.submit}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default ReserveModal
