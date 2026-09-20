// The restaurant is open 24/7, so every half hour of the day is bookable:
// "00:00", "00:30", ... "23:30" (48 slots).
export const RESERVATION_TIMES = Array.from({ length: 48 }, (_, i) => {
  const hour = String(Math.floor(i / 2)).padStart(2, '0')
  return `${hour}:${i % 2 === 0 ? '00' : '30'}`
})

// "18:30" -> "6:30 PM". AM/PM stays in Latin letters in Arabic too. The form
// still submits the 24-hour value — only what the guest sees changes.
export const formatTime12 = (time) => {
  const [hourStr, minute] = time.split(':')
  const hour = Number(hourStr)
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  // Wrapped in a left-to-right isolate (U+2066 ... U+2069): inside an RTL
  // page the bidi algorithm otherwise flips the Latin AM/PM ahead of the
  // digits ("PM 12:00"). <option> text can't take a dir attribute reliably,
  // so the isolate has to live in the string itself.
  return `⁦${hour12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}⁩`
}
