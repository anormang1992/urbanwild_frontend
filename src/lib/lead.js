const ZIP_RE = /^\d{5}(-\d{4})?$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLead({ name, zip, email, phone, consent } = {}) {
  const errors = {}
  if (!String(name || '').trim()) errors.name = 'Enter your name.'
  if (!ZIP_RE.test(String(zip || '').trim())) errors.zip = 'Enter a 5-digit ZIP code.'
  const mail = String(email || '').trim()
  const tel = String(phone || '').trim()
  if (!mail && !tel) errors.email = 'Enter an email address or a phone number.'
  else if (mail && !EMAIL_RE.test(mail)) errors.email = 'Enter a valid email address.'
  if (!consent) errors.consent = 'Please agree to be contacted.'
  return errors
}
