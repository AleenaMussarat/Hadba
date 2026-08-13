import React, { useEffect } from 'react'
import { useLanguage } from '../i18n'
import { translations } from '../i18n/translations'
import { useReservationForm } from '../lib/useReservationForm'
import { FaXmark, FaCircleCheck, FaTriangleExclamation } from 'react-icons/fa6'

const ReserveModal = ({ isOpen, onClose }) => {
  const { currentLang } = useLanguage()
  const t = translations[currentLang] || translations.en
  const { form, submitted, isSubmitting, submitError, handleChange, handleSubmit, reset } = useReservationForm()

  useEffect(() => {
    if (isOpen) reset()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  return (
    <div className="reserve-overlay" onClick={onClose}>
      <div className="reserve-modal" onClick={(e) => e.stopPropagation()}>
        <div className="reserve-modal-bg" aria-hidden="true" />

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
