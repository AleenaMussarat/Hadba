import { useEffect, useState } from 'react'
import { checkReservationsEnabled, RESERVATION_CLOSED_MESSAGE, submitInquiry } from '../services/strapi'

const emptyForm = { name: '', phone: '', guests: 2, date: '', time: '', notes: '' }

// Generate today's date in DD/MM/YYYY format
const getTodayDateString = () => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  return `${day}/${month}/${year}`
}

// Get today's date in ISO format (YYYY-MM-DD)
const getTodayISO = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// The date field is typed/displayed as DD/MM/YYYY, but Strapi's date field
// needs ISO YYYY-MM-DD.
const ddmmyyyyToISO = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return ''
  const [, dd, mm, yyyy] = match
  return `${yyyy}-${mm}-${dd}`
}

// Generate time slots (30-minute intervals from 12:00 to 23:30)
const generateTimeSlots = () => {
  const slots = []
  for (let hour = 12; hour < 24; hour++) {
    for (let min = 0; min < 60; min += 30) {
      const hh = String(hour).padStart(2, '0')
      const mm = String(min).padStart(2, '0')
      slots.push(`${hh}:${mm}`)
    }
  }
  return slots
}

export function useReservationForm() {
  const [form, setForm] = useState({ ...emptyForm, date: getTodayDateString() })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)
  const [isReservationsClosed, setIsReservationsClosed] = useState(false)
  const [closedMessage, setClosedMessage] = useState(RESERVATION_CLOSED_MESSAGE)

  const fetchReservationStatus = async () => {
    const enabled = await checkReservationsEnabled()
    setIsReservationsClosed(!enabled)
    setClosedMessage(RESERVATION_CLOSED_MESSAGE)
  }

  useEffect(() => {
    fetchReservationStatus()
  }, [])

  const reset = () => {
    setForm({ ...emptyForm, date: getTodayDateString() })
    setSubmitted(false)
    setSubmitError(false)
    fetchReservationStatus()
  }

  const handleChange = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isReservationsClosed) {
      setSubmitError(true)
      setClosedMessage(RESERVATION_CLOSED_MESSAGE)
      return
    }

    setIsSubmitting(true)
    setSubmitError(false)
    const isoDate = ddmmyyyyToISO(form.date)
    if (!isoDate) {
      setIsSubmitting(false)
      setSubmitError(true)
      return
    }
    const result = await submitInquiry({ ...form, date: isoDate })
    setIsSubmitting(false)
    if (result.success) {
      setSubmitted(true)
      setIsReservationsClosed(false)
    } else {
      setSubmitError(true)
      if (result.error === RESERVATION_CLOSED_MESSAGE) {
        setIsReservationsClosed(true)
      }
    }
  }

  return {
    form,
    submitted,
    isSubmitting,
    submitError,
    isReservationsClosed,
    closedMessage,
    handleChange,
    handleSubmit,
    reset,
    generateTimeSlots,
    fetchReservationStatus
  }
}
