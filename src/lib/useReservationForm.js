import { useEffect, useState } from 'react'
import { checkReservationsEnabled, submitInquiry } from '../services/strapi'

const emptyForm = { name: '', phone: '', guests: 2, date: '', time: '', notes: '' }

const getTodayDateString = () => {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  return `${day}/${month}/${year}`
}

// The date field is typed/displayed as DD/MM/YYYY, but Strapi's date field
// needs ISO YYYY-MM-DD.
const ddmmyyyyToISO = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return ''
  const [, dd, mm, yyyy] = match
  return `${yyyy}-${mm}-${dd}`
}

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

  const fetchReservationStatus = async () => {
    const enabled = await checkReservationsEnabled()
    setIsReservationsClosed(!enabled)
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
      if (result.isClosed) {
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
    handleChange,
    handleSubmit,
    reset,
    generateTimeSlots,
    fetchReservationStatus
  }
}