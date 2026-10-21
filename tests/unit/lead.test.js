import { beforeEach, describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'

vi.mock('../../src/lib/api.js', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, sendLead: vi.fn() }
})

import { GENERIC_LEAD_MESSAGE, LeadError, RATE_LIMIT_MESSAGE, sendLead } from '../../src/lib/api.js'
import { validateLead } from '../../src/lib/lead.js'
import LeadFormDialog from '../../src/components/LeadFormDialog.vue'

beforeEach(() => {
  vi.clearAllMocks()
  HTMLDialogElement.prototype.showModal = vi.fn()
  HTMLDialogElement.prototype.close = vi.fn()
})

const valid = { name: 'Pat', zip: '00000', email: 'pat@example.com', consent: true }

describe('validateLead', () => {
  it('flags every required field on an empty form', () => {
    expect(Object.keys(validateLead({})).sort()).toEqual(['consent', 'email', 'name', 'zip'])
  })
  it('accepts a valid form', () => {
    expect(validateLead(valid)).toEqual({})
  })
  it('accepts ZIP+4 and phone instead of email', () => {
    expect(validateLead({ ...valid, zip: '27601-1234', email: '', phone: '555' })).toEqual({})
  })
  it('flags only a bad ZIP', () => {
    expect(validateLead({ ...valid, zip: '2760' })).toEqual({ zip: 'Enter a 5-digit ZIP code.' })
  })
  it('flags an invalid email', () => {
    expect(validateLead({ ...valid, email: 'nope' })).toEqual({ email: 'Enter a valid email address.' })
  })
  it('needs email or phone', () => {
    expect(validateLead({ ...valid, email: '' }).email).toBe('Enter an email address or a phone number.')
  })
})

async function fill(wrapper, { name = 'Pat', zip = '00000', email = 'pat@example.com', phone = '', consent = true } = {}) {
  await wrapper.get('input[autocomplete="name"]').setValue(name)
  await wrapper.get('input[autocomplete="postal-code"]').setValue(zip)
  await wrapper.get('input[type="email"]').setValue(email)
  await wrapper.get('input[type="tel"]').setValue(phone)
  await wrapper.get('input[type="checkbox"]').setValue(consent)
}

function mountOpen() {
  return mount(LeadFormDialog, { props: { open: true } })
}

describe('LeadFormDialog', () => {
  it('opens the modal when open becomes true', async () => {
    const w = mount(LeadFormDialog, { props: { open: false } })
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled()
    await w.setProps({ open: true })
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalledTimes(1)
  })

  it('shows validation errors and does not send', async () => {
    const w = mountOpen()
    await w.get('form').trigger('submit')
    expect(w.text()).toContain('Enter your name.')
    expect(w.get('input[autocomplete="name"]').attributes('aria-invalid')).toBe('true')
    expect(w.get('input[autocomplete="name"]').attributes('aria-describedby')).toBeTruthy()
    expect(sendLead).not.toHaveBeenCalled()
  })

  it('sends a valid form and shows the success state', async () => {
    sendLead.mockResolvedValue()
    const w = mountOpen()
    await fill(w)
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(sendLead).toHaveBeenCalledWith({ name: 'Pat', zip: '00000', email: 'pat@example.com', phone: '', consent: true })
    expect(w.text()).toContain("Thanks! You're all set.")
    const back = w.findAll('button').find((b) => b.text() === 'Back to the video')
    await back.trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
  })

  it('shows API field errors under the field', async () => {
    sendLead.mockRejectedValue(new LeadError('x', 400, { zip: 'Enter a valid value.' }))
    const w = mountOpen()
    await fill(w)
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(w.text()).toContain('Enter a valid value.')
    const id = w.get('input[autocomplete="postal-code"]').attributes('aria-describedby')
    expect(w.get(`#${id}`).text()).toBe('Enter a valid value.')
  })

  it('shows non_field_errors as a general error', async () => {
    sendLead.mockRejectedValue(new LeadError('x', 400, { non_field_errors: 'Provide an email or phone.' }))
    const w = mountOpen()
    await fill(w)
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(w.get('[role="alert"]').text()).toBe('Provide an email or phone.')
  })

  it('shows the rate-limit message', async () => {
    sendLead.mockRejectedValue(new Error(RATE_LIMIT_MESSAGE))
    const w = mountOpen()
    await fill(w)
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(w.get('[role="alert"]').text()).toBe(RATE_LIMIT_MESSAGE)
  })

  it('shows the generic message on other failures and re-enables submit', async () => {
    sendLead.mockRejectedValue(new Error(GENERIC_LEAD_MESSAGE))
    const w = mountOpen()
    await fill(w)
    await w.get('form').trigger('submit')
    await flushPromises()
    expect(w.get('[role="alert"]').text()).toBe(GENERIC_LEAD_MESSAGE)
    expect(w.get('button[type="submit"]').attributes('disabled')).toBeUndefined()
  })

  it('disables submit while sending', async () => {
    sendLead.mockReturnValue(new Promise(() => {}))
    const w = mountOpen()
    await fill(w)
    await w.get('form').trigger('submit')
    expect(w.get('button[type="submit"]').attributes('disabled')).toBeDefined()
  })

  it('emits close on Esc (cancel) without letting the browser close it', async () => {
    const w = mountOpen()
    const ev = new Event('cancel', { cancelable: true })
    w.get('dialog').element.dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
    expect(w.emitted('close')).toHaveLength(1)
  })

  it('emits close from the close button', async () => {
    const w = mountOpen()
    await w.get('button[aria-label="Close"]').trigger('click')
    expect(w.emitted('close')).toHaveLength(1)
  })

  it('closes the native dialog when open becomes false', async () => {
    const w = mountOpen()
    await w.setProps({ open: false })
    expect(HTMLDialogElement.prototype.close).toHaveBeenCalled()
  })

  it('starts fresh when reopened after success', async () => {
    sendLead.mockResolvedValue()
    const w = mountOpen()
    await fill(w)
    await w.get('form').trigger('submit')
    await flushPromises()
    await w.setProps({ open: false })
    await w.setProps({ open: true })
    expect(w.text()).not.toContain("Thanks! You're all set.")
    expect(w.get('input[autocomplete="name"]').element.value).toBe('')
  })
})
