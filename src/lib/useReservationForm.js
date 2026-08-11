import { useState } from 'react'
import { submitInquiry } from '../services/strapi'

const emptyForm = { name: '', phone: '', guests: 2, date: '', time: '', notes: '' }

// The date field is typed/displayed as DD/MM/YYYY, but Strapi's date field
// needs ISO YYYY-MM-DD.
const ddmmyyyyToISO = (value) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (!match) return ''
  const [, dd, mm, yyyy] = match
  return `${yyyy}-${mm}-${dd}`
}

export function useReservationForm() {
  const [form, setForm] = useState(emptyForm)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(false)

  const reset = () => {
    setForm(emptyForm)
    setSubmitted(false)
    setSubmitError(false)
  }

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

  return { form, submitted, isSubmitting, submitError, handleChange, handleSubmit, reset }
}
