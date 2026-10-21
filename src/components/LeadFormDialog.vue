<script setup>
import { reactive, ref, watch } from 'vue'
import farmBureauLogo from '@/assets/sponsors/farm-bureau.webp'
import { LeadError, sendLead } from '../lib/api.js'
import { validateLead } from '../lib/lead.js'

const props = defineProps({ open: { type: Boolean, default: false } })
const emit = defineEmits(['close'])

const dialog = ref(null)
const form = reactive({ name: '', zip: '', email: '', phone: '', consent: false })
const errors = ref({})
const generalError = ref('')
const sending = ref(false)
const sent = ref(false)

const inputClass =
  'h-[46px] rounded-[12px] border-[1.5px] border-line-strong bg-surface px-3.5 text-base font-normal text-ink aria-[invalid=true]:border-red-700'

function reset() {
  Object.assign(form, { name: '', zip: '', email: '', phone: '', consent: false })
  errors.value = {}
  generalError.value = ''
  sending.value = false
  sent.value = false
}

watch(
  () => props.open,
  (open) => {
    const el = dialog.value
    if (open) {
      reset()
      if (el && !el.open) el.showModal()
    } else if (el) {
      el.close()
    }
  },
  { immediate: true, flush: 'post' },
)

function onCancel(event) {
  event.preventDefault()
  emit('close')
}

async function submit() {
  if (sending.value) return
  generalError.value = ''
  const found = validateLead(form)
  errors.value = found
  if (Object.keys(found).length) return
  sending.value = true
  try {
    await sendLead({
      name: form.name.trim(),
      zip: form.zip.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      consent: true,
    })
    sent.value = true
  } catch (err) {
    const { non_field_errors: general, ...fields } = err instanceof LeadError ? err.fieldErrors || {} : {}
    if (Object.keys(fields).length) errors.value = fields
    generalError.value = general || (Object.keys(fields).length ? '' : err?.message || 'Something went wrong. Please try again.')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <dialog
    ref="dialog"
    aria-labelledby="lead-title"
    class="relative m-auto w-[calc(100%-32px)] max-w-[520px] overflow-auto rounded-[24px] bg-surface p-8 text-ink backdrop:bg-[rgba(11,23,18,0.6)]"
    @cancel="onCancel"
  >
    <button
      type="button"
      aria-label="Close"
      class="absolute right-3.5 top-3.5 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-footer text-ink"
      @click="emit('close')"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
    </button>
    <div class="flex flex-col gap-[18px]">
      <img :src="farmBureauLogo" alt="NC Farm Bureau Insurance" class="h-16 w-auto self-start" />
      <template v-if="!sent">
        <h2 id="lead-title" class="m-0 font-display text-[28px] font-extrabold leading-[1.15]">Helping you is what we do best.</h2>
        <p class="m-0 text-base text-text-strong">
          Home, auto, life and health insurance, plus farm, crop, commercial and personal liability policies. Leave your details and a local agent will be in touch.
        </p>
        <form novalidate class="flex flex-col gap-[18px]" @submit.prevent="submit">
          <div class="grid grid-cols-[repeat(auto-fit,minmax(min(100%,200px),1fr))] gap-3.5">
            <label class="flex flex-col gap-1.5 text-sm font-bold">
              Full name
              <input v-model="form.name" type="text" autocomplete="name" :class="inputClass" :aria-invalid="errors.name ? 'true' : undefined" :aria-describedby="errors.name ? 'lead-name-error' : undefined" />
              <span v-if="errors.name" id="lead-name-error" class="text-sm font-normal text-red-700">{{ errors.name }}</span>
            </label>
            <label class="flex flex-col gap-1.5 text-sm font-bold">
              ZIP code
              <input v-model="form.zip" type="text" inputmode="numeric" autocomplete="postal-code" :class="inputClass" :aria-invalid="errors.zip ? 'true' : undefined" :aria-describedby="errors.zip ? 'lead-zip-error' : undefined" />
              <span v-if="errors.zip" id="lead-zip-error" class="text-sm font-normal text-red-700">{{ errors.zip }}</span>
            </label>
            <label class="flex flex-col gap-1.5 text-sm font-bold">
              Email
              <input v-model="form.email" type="email" autocomplete="email" :class="inputClass" :aria-invalid="errors.email ? 'true' : undefined" :aria-describedby="errors.email ? 'lead-email-error' : undefined" />
              <span v-if="errors.email" id="lead-email-error" class="text-sm font-normal text-red-700">{{ errors.email }}</span>
            </label>
            <label class="flex flex-col gap-1.5 text-sm font-bold">
              Phone
              <input v-model="form.phone" type="tel" autocomplete="tel" :class="inputClass" :aria-invalid="errors.phone ? 'true' : undefined" :aria-describedby="errors.phone ? 'lead-phone-error' : undefined" />
              <span v-if="errors.phone" id="lead-phone-error" class="text-sm font-normal text-red-700">{{ errors.phone }}</span>
            </label>
          </div>
          <div class="flex flex-col gap-1.5">
            <label class="flex items-start gap-2.5 text-sm text-text-strong">
              <input v-model="form.consent" type="checkbox" class="mt-0.5 h-5 w-5 flex-none" :aria-invalid="errors.consent ? 'true' : undefined" :aria-describedby="errors.consent ? 'lead-consent-error' : undefined" />
              I agree to be contacted by an NC Farm Bureau agent about insurance products.
            </label>
            <span v-if="errors.consent" id="lead-consent-error" class="text-sm text-red-700">{{ errors.consent }}</span>
          </div>
          <p v-if="generalError" role="alert" class="m-0 text-sm font-bold text-red-700">{{ generalError }}</p>
          <button
            type="submit"
            :disabled="sending"
            class="min-h-[50px] cursor-pointer rounded-full border-none bg-green-text px-6 text-[17px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            Request my quote
          </button>
        </form>
      </template>
      <template v-else>
        <h2 id="lead-title" class="m-0 font-display text-[28px] font-extrabold leading-[1.15]">Thanks! You're all set.</h2>
        <p class="m-0 text-text-strong">A local NC Farm Bureau agent will reach out soon. Thanks for supporting wildlife education.</p>
        <button type="button" class="min-h-[50px] cursor-pointer rounded-full border-[1.5px] border-ink bg-surface px-6 font-bold text-ink" @click="emit('close')">Back to the video</button>
      </template>
    </div>
  </dialog>
</template>
