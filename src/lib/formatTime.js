// "18:30" -> "6:30 PM". AM/PM stays in Latin letters in Arabic too. The form
// still submits the 24-hour value — only what the guest sees changes.
export const formatTime12 = (time) => {
  const [hourStr, minute] = time.split(':')
  const hour = Number(hourStr)
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12}:${minute} ${hour >= 12 ? 'PM' : 'AM'}`
}
