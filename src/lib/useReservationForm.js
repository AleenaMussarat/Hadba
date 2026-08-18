import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { submitInquiry, checkReservationsEnabled, RESERVATION_CLOSED_MESSAGE } from '../services/strapi'
import useReservationForm from '../lib/useReservationForm'

export default function Contact() {
  const { t, i18n } = useTranslation()
  const [reservationsEnabled, setReservationsEnabled] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | 'closed' | null
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showClosedModal, setShowClosedModal] = useState(false)

  const {
    formData,
    errors,
    handleChange,
    handleSubmit
  } = useReservationForm()

  // Check if reservations are enabled on mount
  useEffect(() => {
    async function checkStatus() {
      const enabled = await checkReservationsEnabled()
      setReservationsEnabled(enabled)
    }
    checkStatus()
  }, [])

  const onSubmit = async (e) => {
    e.preventDefault()

    // Validate date is today
    const today = new Date().toISOString().split('T')[0]
    if (formData.date !== today) {
      setSubmitStatus('error')
      setErrorMessage(t('reserve.dateError', 'Reservations can only be made for today'))
      return
    }

    setIsSubmitting(true)
    setSubmitStatus(null)
    setErrorMessage('')

    const result = await submitInquiry({
      name: formData.name,
      phone: formData.phone || '',
      guests: formData.guests,
      date: formData.date,
      time: formData.time,
      notes: formData.notes || ''
    })

    setIsSubmitting(false)

    if (result.success) {
      setSubmitStatus('success')
      setShowSuccess(true)
      // Reset form after successful submission
      handleChange({ target: { name: 'name', value: '' } })
      handleChange({ target: { name: 'phone', value: '' } })
      handleChange({ target: { name: 'guests', value: '2' } })
      handleChange({ target: { name: 'notes', value: '' } })
    } else {
      // Check if it's the "reservations closed" error
      if (result.isClosed || result.error === RESERVATION_CLOSED_MESSAGE) {
        setShowClosedModal(true)
        setSubmitStatus('closed')
        setErrorMessage(result.error || t('reserve.closedMessage'))
      } else {
        setSubmitStatus('error')
        setErrorMessage(result.error || t('reserve.errorText'))
      }
    }
  }

  // Format today's date for display
  const today = new Date().toISOString().split('T')[0]
  const displayDate = new Date().toLocaleDateString(
    i18n.language === 'ar' ? 'ar-SA' : 'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  )

  // Generate time slots
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 12; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        const displayHour = hour > 12 ? hour - 12 : hour
        const ampm = hour >= 12 ? 'PM' : 'AM'
        const displayString = `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`
        slots.push(
          <option key={timeString} value={timeString}>
            {displayString}
          </option>
        )
      }
    }
    return slots
  }

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-info">
            <span className="eyebrow">{t('contact.eyebrow')}</span>
            <h2>{t('contact.title')}</h2>
            <p>{t('contact.description')}</p>

            <div className="info-items">
              <div className="info-item">
                <i className="icon-map"></i>
                <div>
                  <strong>{t('footer.addressTitle')}</strong>
                  <p>{t('contact.address')}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="icon-phone"></i>
                <div>
                  <strong>{t('footer.contactTitle')}</strong>
                  <p>{t('contact.phone')}</p>
                </div>
              </div>
              <div className="info-item">
                <i className="icon-clock"></i>
                <div>
                  <strong>{t('footer.hoursTitle')}</strong>
                  <p>{t('contact.hours')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-wrapper">
            <h3>{t('reserve.title')}</h3>
            <p className="form-subtitle">{t('reserve.subtitle')}</p>

            {!reservationsEnabled ? (
              <div className="reserve-notice">
                <p>{t('reserve.closedMessage')}</p>
                <p className="call-phone">{t('reserve.callPhone') || 'Please call us at +966 55 518 5657'}</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="reservation-form">
                <div className="form-group">
                  <label htmlFor="name">{t('reserve.name')} *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="phone">{t('reserve.phone')}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    placeholder={t('reserve.phoneHint')}
                    className={errors.phone ? 'error' : ''}
                  />
                  <small className="hint">{t('reserve.phoneHint')}</small>
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="guests">{t('reserve.guests')} *</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    value={formData.guests}
                    onChange={handleChange}
                    min="1"
                    max="20"
                    required
                    className={errors.guests ? 'error' : ''}
                  />
                  {errors.guests && <span className="error-message">{errors.guests}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="date">{t('reserve.date')} *</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={today}
                    max={today}
                    readOnly
                    required
                    className="readonly-input"
                  />
                  <small className="hint">
                    {t('reserve.todayOnly', 'Reservations are available for today only: {date}', { date: displayDate })}
                  </small>
                  {errors.date && <span className="error-message">{errors.date}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="time">{t('reserve.time')} *</label>
                  <select
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    required
                    className={errors.time ? 'error' : ''}
                  >
                    <option value="">{t('reserve.selectTime', 'Select a time')}</option>
                    {generateTimeSlots()}
                  </select>
                  {errors.time && <span className="error-message">{errors.time}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="notes">{t('reserve.notes')}</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    placeholder={t('reserve.notesPlaceholder')}
                    rows="3"
                  />
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('reserve.submitting') : t('reserve.submit')}
                </button>

                {submitStatus === 'error' && !showClosedModal && (
                  <div className="error-message-box">
                    <p>{errorMessage}</p>
                  </div>
                )}
              </form>
            )}

            {/* Success Modal */}
            {showSuccess && (
              <div className="success-modal" onClick={() => setShowSuccess(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <h3>{t('reserve.successTitle', { name: formData.name })}</h3>
                  <p>{t('reserve.successText')}</p>
                  <button onClick={() => setShowSuccess(false)}>
                    {t('reserve.close')}
                  </button>
                </div>
              </div>
            )}

            {/* Reservations Closed Modal - POPUP */}
            {showClosedModal && (
              <div className="closed-modal-overlay" onClick={() => setShowClosedModal(false)}>
                <div className="closed-modal" onClick={(e) => e.stopPropagation()}>
                  <div className="closed-modal-icon">🚫</div>
                  <h2>{t('reserve.closedTitle', 'Reservations Currently Unavailable')}</h2>
                  <p>{t('reserve.closedMessage')}</p>
                  <p className="closed-modal-phone">
                    {t('reserve.callPhone', 'Please call us directly at:')}
                    <br />
                    <strong>+966 55 518 5657 | +966 53 334 7721</strong>
                  </p>
                  <button
                    className="closed-modal-btn"
                    onClick={() => setShowClosedModal(false)}
                  >
                    {t('reserve.close', 'Close')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}