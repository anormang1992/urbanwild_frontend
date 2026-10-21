const ZIP_RE = /^\d{5}(-\d{4})?$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Formats a US phone number as it's typed: "(828", "(828) 262", "(828) 262-2605".
// It never adds a trailing character, so backspace isn't trapped behind a ")" or "-".
export function formatPhone(input) {
  let digits = String(input || '').replace(/\D/g, '')
  if (digits.length > 10 && digits[0] === '1') digits = digits.slice(1)
  digits = digits.slice(0, 10)
  if (!digits) return ''
  if (digits.length <= 3) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}

export function validateLead({ name, zip, email, phone, consent } = {}) {
  const errors = {}
  if (!String(name || '').trim()) errors.name = 'Enter your name.'
  if (!ZIP_RE.test(String(zip || '').trim())) errors.zip = 'Enter a 5-digit ZIP code.'
  const mail = String(email || '').trim()
  const tel = String(phone || '').trim()
  if (!mail && !tel) errors.email = 'Enter an email address or a phone number.'
  else if (mail && !EMAIL_RE.test(mail)) errors.email = 'Enter a valid email address.'
  if (tel && tel.replace(/\D/g, '').length !== 10) errors.phone = 'Enter a 10-digit phone number.'
  if (!consent) errors.consent = 'Please agree to be contacted.'
  return errors
}
