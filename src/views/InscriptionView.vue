<template>
  <main class="inscription-page">
    <a class="skip-link" href="#formulario-inscripcion">
      Ir directamente al formulario
    </a>

    <section class="hero">
      <div class="hero__glow"></div>

      <div class="container hero__layout">
        <div class="hero__copy">
          <span class="eyebrow">INSCRIPCIONES · AMO MI VOZ</span>

          <h1>
            Inscribirte es
            <span>muy sencillo.</span>
          </h1>

          <p>
            Completa tus datos de contacto. No necesitas experiencia
            musical previa y el formulario toma solo unos minutos.
          </p>

          <a class="hero__cta" href="#formulario-inscripcion">
            Inscribirme ahora
            <span aria-hidden="true">↓</span>
          </a>
        </div>

        <aside class="hero__schedule" aria-label="Información de las clases">
          <span class="hero__schedule-label">CLASES PRESENCIALES</span>
          <strong>Sábados</strong>
          <p>16:00 a 18:00 hrs</p>
          <div></div>
          <small>Pueblito Artesanal La Calera</small>
          <small>Calle Iriarte 96, La Calera</small>
        </aside>
      </div>
    </section>

    <section
      id="formulario-inscripcion"
      class="form-area"
    >
      <div class="container form-layout">
        <div class="form-intro">
          <span class="section-label">INSCRIPCIÓN</span>
          <h2>Queremos conocerte.</h2>
          <p>
            Solo necesitamos tus datos básicos. Después de recibirlos,
            la academia se pondrá en contacto contigo.
          </p>

          <div class="help-card">
            <span class="help-card__icon" aria-hidden="true">✓</span>
            <div>
              <strong>No necesitas experiencia previa</strong>
              <p>
                Te orientaremos personalmente para encontrar el mejor
                punto de partida para tu voz.
              </p>
            </div>
          </div>

          <div class="contact-note">
            <strong>¿Necesitas ayuda para inscribirte?</strong>
            <p>
              No te preocupes. Puedes pedir ayuda a la academia y
              completaremos el proceso contigo.
            </p>
          </div>
        </div>

        <Transition name="success">
          <section
            v-if="submissionCompleted"
            class="success-card"
            aria-live="polite"
          >
            <div class="success-card__check">✓</div>
            <span class="section-label">INSCRIPCIÓN RECIBIDA</span>
            <h2>¡Gracias por inscribirte!</h2>
            <p>
              Recibimos correctamente tus datos. Nos pondremos en
              contacto contigo para continuar con tu inscripción.
            </p>

            <div class="success-card__steps">
              <div>
                <span>✓</span>
                <p><strong>Datos enviados</strong><small>Completado</small></p>
              </div>
              <div>
                <span>2</span>
                <p><strong>Contacto de la academia</strong><small>Siguiente paso</small></p>
              </div>
              <div>
                <span>3</span>
                <p><strong>Matrícula y acceso</strong><small>Cuando corresponda</small></p>
              </div>
            </div>

            <button
              type="button"
              class="secondary-button"
              @click="createAnotherRequest"
            >
              Enviar otra inscripción
            </button>
          </section>
        </Transition>

        <form
          v-if="!submissionCompleted"
          class="simple-form"
          novalidate
          @submit.prevent="submitForm"
        >
          <header class="simple-form__header">
            <span>FORMULARIO DE INSCRIPCIÓN</span>
            <h2>Completa tus datos</h2>
            <p>Los campos con * son obligatorios.</p>
          </header>

          <div class="fields">
            <label class="field field--full">
              <span>Nombre completo <b>*</b></span>
              <input
                v-model.trim="form.name"
                type="text"
                autocomplete="name"
                maxlength="120"
                placeholder="Ej: María González"
                :class="{ invalid: fieldErrors.name }"
                required
                @input="clearFieldError('name')"
              />
              <small v-if="fieldErrors.name" class="field__error">
                {{ fieldErrors.name }}
              </small>
            </label>

            <label class="field">
              <span>Edad <b>*</b></span>
              <input
                v-model.number="form.age"
                type="number"
                inputmode="numeric"
                min="4"
                max="100"
                placeholder="Ej: 65"
                :class="{ invalid: fieldErrors.age }"
                required
                @input="clearFieldError('age')"
              />
              <small v-if="fieldErrors.age" class="field__error">
                {{ fieldErrors.age }}
              </small>
            </label>

            <label class="field">
              <span>Teléfono / WhatsApp <b>*</b></span>
              <input
                v-model.trim="form.phone"
                type="tel"
                inputmode="tel"
                autocomplete="tel"
                maxlength="30"
                placeholder="Ej: +56 9 1234 5678"
                :class="{ invalid: fieldErrors.phone }"
                required
                @input="clearFieldError('phone')"
              />
              <small v-if="fieldErrors.phone" class="field__error">
                {{ fieldErrors.phone }}
              </small>
            </label>

            <label class="field field--full">
              <span>Correo electrónico <b>*</b></span>
              <input
                v-model.trim="form.email"
                type="email"
                inputmode="email"
                autocomplete="email"
                maxlength="160"
                placeholder="Ej: maria@gmail.com"
                :class="{ invalid: fieldErrors.email }"
                required
                @input="clearFieldError('email')"
              />
              <small class="field__hint">
                Puede ser Gmail, Hotmail, Outlook u otro correo que utilices.
              </small>
              <small v-if="fieldErrors.email" class="field__error">
                {{ fieldErrors.email }}
              </small>
            </label>
          </div>

          <Transition name="expand">
            <section v-if="isMinor" class="guardian-box">
              <div class="guardian-box__heading">
                <div>
                  <strong>Datos del apoderado</strong>
                  <p>Como el estudiante es menor de edad, necesitamos un contacto adulto.</p>
                </div>
                <span>APODERADO</span>
              </div>

              <div class="fields">
                <label class="field">
                  <span>Nombre del apoderado <b>*</b></span>
                  <input
                    v-model.trim="form.guardianName"
                    type="text"
                    autocomplete="name"
                    maxlength="120"
                    placeholder="Nombre completo"
                    :class="{ invalid: fieldErrors.guardianName }"
                    :required="isMinor"
                    @input="clearFieldError('guardianName')"
                  />
                  <small v-if="fieldErrors.guardianName" class="field__error">
                    {{ fieldErrors.guardianName }}
                  </small>
                </label>

                <label class="field">
                  <span>Teléfono del apoderado <b>*</b></span>
                  <input
                    v-model.trim="form.guardianPhone"
                    type="tel"
                    inputmode="tel"
                    autocomplete="tel"
                    maxlength="30"
                    placeholder="+56 9 1234 5678"
                    :class="{ invalid: fieldErrors.guardianPhone }"
                    :required="isMinor"
                    @input="clearFieldError('guardianPhone')"
                  />
                  <small v-if="fieldErrors.guardianPhone" class="field__error">
                    {{ fieldErrors.guardianPhone }}
                  </small>
                </label>
              </div>
            </section>
          </Transition>

          <label class="consent" :class="{ 'consent--invalid': fieldErrors.accepted }">
            <input
              v-model="form.accepted"
              type="checkbox"
              required
              @change="clearFieldError('accepted')"
            />
            <span>
              Autorizo a la Academia de Talentos Amo Mi Voz a utilizar
              estos datos únicamente para contactarme y gestionar mi inscripción.
            </span>
          </label>

          <small v-if="fieldErrors.accepted" class="consent-error">
            {{ fieldErrors.accepted }}
          </small>

          <label class="website-field" aria-hidden="true">
            Website
            <input
              v-model="form.website"
              type="text"
              tabindex="-1"
              autocomplete="off"
            />
          </label>

          <div
            v-if="errorMessage"
            class="form-error"
            role="alert"
          >
            <span>!</span>
            <div>
              <strong>No pudimos enviar tu inscripción</strong>
              <p>{{ errorMessage }}</p>
            </div>
          </div>

          <button
            class="submit-button"
            type="submit"
            :disabled="isSubmitting"
          >
            <template v-if="isSubmitting">
              <span class="spinner"></span>
              Enviando...
            </template>
            <template v-else>
              Enviar mi inscripción
              <span aria-hidden="true">→</span>
            </template>
          </button>

          <p class="privacy-note">
            Tus datos se envían de forma segura y no se utilizarán para otros fines.
          </p>
        </form>
      </div>
    </section>

    <section class="information-section">
      <div class="container">
        <header class="information-section__header">
          <span class="section-label">INFORMACIÓN DE LAS CLASES</span>
          <h2>Todo lo importante, después del formulario.</h2>
          <p>
            Si quieres conocer más antes de comenzar, aquí tienes la información principal.
          </p>
        </header>

        <div class="info-grid">
          <article>
            <span>01</span>
            <h3>¿Cuándo?</h3>
            <p><strong>Sábados</strong><br />16:00 a 18:00 hrs.</p>
          </article>

          <article>
            <span>02</span>
            <h3>¿Dónde?</h3>
            <p><strong>Pueblito Artesanal</strong><br />Calle Iriarte 96, La Calera.</p>
          </article>

          <article>
            <span>03</span>
            <h3>¿Necesito experiencia?</h3>
            <p>No. Trabajamos desde el nivel y las características de cada estudiante.</p>
          </article>

          <article>
            <span>04</span>
            <h3>¿Qué aprenderé?</h3>
            <p>Técnica vocal, teoría musical, repertorio, interpretación y escenario.</p>
          </article>
        </div>

        <div class="after-send">
          <div>
            <span>1</span>
            <p><strong>Envías tus datos</strong><small>Desde este formulario.</small></p>
          </div>
          <div class="after-send__line"></div>
          <div>
            <span>2</span>
            <p><strong>Te contactamos</strong><small>Conversamos contigo personalmente.</small></p>
          </div>
          <div class="after-send__line"></div>
          <div>
            <span>3</span>
            <p><strong>Comienzas</strong><small>Te orientamos para ingresar a la academia.</small></p>
          </div>
        </div>
      </div>
    </section>

    <PublicQuickActions />
  </main>
</template>

<script setup>
import {
  computed,
  nextTick,
  reactive,
  ref
} from 'vue'

import PublicQuickActions from '@/components/public/PublicQuickActions.vue'
import { supabase } from '@/lib/supabase'

const isSubmitting = ref(false)
const submissionCompleted = ref(false)
const errorMessage = ref('')
const fieldErrors = reactive({})

const form = reactive({
  name: '',
  age: '',
  phone: '',
  email: '',
  guardianName: '',
  guardianPhone: '',
  accepted: false,
  website: ''
})

const isMinor = computed(() => {
  const age = Number(form.age)

  return (
    Number.isFinite(age) &&
    age >= 4 &&
    age < 18
  )
})

function clearErrors() {
  Object.keys(fieldErrors).forEach(key => {
    delete fieldErrors[key]
  })

  errorMessage.value = ''
}

function clearFieldError(field) {
  if (fieldErrors[field]) {
    delete fieldErrors[field]
  }

  if (errorMessage.value) {
    errorMessage.value = ''
  }
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function normalizePhone(phone) {
  return String(phone || '')
    .trim()
    .replace(/\s+/g, ' ')
}

function hasEnoughPhoneDigits(phone) {
  return String(phone || '')
    .replace(/\D/g, '')
    .length >= 8
}

function validateForm() {
  clearErrors()

  const age = Number(form.age)

  if (!form.name || form.name.trim().length < 3) {
    fieldErrors.name = 'Escribe tu nombre completo.'
  }

  if (!Number.isInteger(age) || age < 4 || age > 100) {
    fieldErrors.age = 'Escribe una edad válida.'
  }

  if (!form.phone || !hasEnoughPhoneDigits(form.phone)) {
    fieldErrors.phone = 'Escribe un teléfono de contacto válido.'
  }

  if (!form.email || !isValidEmail(form.email.trim())) {
    fieldErrors.email = 'Escribe un correo electrónico válido.'
  }

  if (isMinor.value) {
    if (!form.guardianName || form.guardianName.trim().length < 3) {
      fieldErrors.guardianName = 'Escribe el nombre del apoderado.'
    }

    if (!form.guardianPhone || !hasEnoughPhoneDigits(form.guardianPhone)) {
      fieldErrors.guardianPhone = 'Escribe un teléfono válido del apoderado.'
    }
  }

  if (!form.accepted) {
    fieldErrors.accepted = 'Marca esta casilla para poder enviar la inscripción.'
  }

  return Object.keys(fieldErrors).length === 0
}

async function focusFirstError() {
  await nextTick()

  const firstInvalid = document.querySelector(
    '.simple-form .invalid, .consent--invalid'
  )

  if (!firstInvalid) {
    return
  }

  firstInvalid.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })

  const input = firstInvalid.matches('input')
    ? firstInvalid
    : firstInvalid.querySelector('input')

  input?.focus?.()
}

async function submitForm() {
  if (isSubmitting.value) {
    return
  }

  if (form.website) {
    submissionCompleted.value = true
    return
  }

  if (!validateForm()) {
    errorMessage.value = 'Revisa los campos marcados para continuar.'
    await focusFirstError()
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    /*
     * Conservamos las columnas del sistema actual para no romper
     * el panel administrativo ni exigir una migración de Supabase.
     * Los datos que ya no pedimos públicamente quedan con valores
     * neutros y se conversan después con la academia.
     */
    const payload = {
      name: form.name
        .trim()
        .replace(/\s+/g, ' '),

      age: Number(form.age),

      phone: normalizePhone(form.phone),

      email: form.email
        .trim()
        .toLowerCase(),

      guardian_name: isMinor.value
        ? form.guardianName
            .trim()
            .replace(/\s+/g, ' ')
        : null,

      guardian_phone: isMinor.value
        ? normalizePhone(form.guardianPhone)
        : null,

      interest: 'Quiero orientación',
      experience: 'Sin especificar',
      goals: 'Por conversar con la academia',
      availability: 'question',
      message: null,
      status: 'pending'
    }

    const { error } = await supabase
      .from('inscriptions')
      .insert(payload)

    if (error) {
      throw error
    }

    submissionCompleted.value = true
    resetForm()

    await nextTick()

    document
      .querySelector('#formulario-inscripcion')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
  } catch (error) {
    console.error('Error enviando inscripción:', error)

    errorMessage.value = getSubmitErrorMessage(error)

    await nextTick()

    document
      .querySelector('.form-error')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
  } finally {
    isSubmitting.value = false
  }
}

function getSubmitErrorMessage(error) {
  const message = String(error?.message || '').toLowerCase()

  if (
    message.includes('network') ||
    message.includes('fetch')
  ) {
    return 'No pudimos conectarnos. Revisa tu conexión a internet e inténtalo nuevamente.'
  }

  if (
    message.includes('row-level') ||
    message.includes('policy')
  ) {
    return 'El formulario no tiene autorización para registrar la inscripción. Contacta a la academia.'
  }

  return 'Ocurrió un problema al enviar tu inscripción. Inténtalo nuevamente.'
}

function resetForm() {
  form.name = ''
  form.age = ''
  form.phone = ''
  form.email = ''
  form.guardianName = ''
  form.guardianPhone = ''
  form.accepted = false
  form.website = ''

  clearErrors()
}

function createAnotherRequest() {
  submissionCompleted.value = false
  resetForm()

  nextTick(() => {
    document
      .querySelector('#formulario-inscripcion')
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
  })
}
</script>

<style scoped lang="scss">
.inscription-page {
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --wine-soft: #fff1f5;
  --gold: #d9a91d;
  --navy: #152033;
  --text: #344359;
  --muted: #667085;
  --line: #dbe3ec;
  --canvas: #f5f7fb;
  --soft: #f8fafc;

  min-height: 100vh;
  overflow: clip;
  color: var(--navy);
  background: var(--canvas);
}

* {
  box-sizing: border-box;
}

.container {
  width: min(1120px, calc(100% - 40px));
  margin: 0 auto;
}

.skip-link {
  position: fixed;
  z-index: 9999;
  top: 10px;
  left: 10px;
  padding: 12px 16px;
  border-radius: 10px;
  color: #fff;
  background: var(--wine);
  font-weight: 800;
  text-decoration: none;
  transform: translateY(-160%);
}

.skip-link:focus {
  transform: translateY(0);
}

.hero {
  position: relative;
  overflow: hidden;
  padding: 150px 0 72px;
  color: #fff;
  background:
    radial-gradient(circle at 82% 18%, rgba(217, 169, 29, 0.16), transparent 27%),
    radial-gradient(circle at 18% 88%, rgba(159, 25, 69, 0.22), transparent 32%),
    linear-gradient(135deg, #101a2d, #18263e);
}

.hero__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(255,255,255,.025) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.025) 1px, transparent 1px);
  background-size: 64px 64px;
  mask-image: linear-gradient(to bottom, #000, transparent 92%);
}

.hero__layout {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, .65fr);
  gap: 70px;
  align-items: center;
}

.eyebrow,
.section-label {
  display: block;
  color: var(--gold);
  font-size: .72rem;
  font-weight: 900;
  letter-spacing: .16em;
  text-transform: uppercase;
}

.hero h1 {
  max-width: 760px;
  margin: 20px 0 0;
  color: #fff;
  font-size: clamp(3.2rem, 6vw, 5.8rem);
  line-height: .94;
  letter-spacing: -.055em;
}

.hero h1 span {
  display: block;
  color: #f0c748;
}

.hero__copy > p {
  max-width: 650px;
  margin: 25px 0 0;
  color: rgba(255,255,255,.78);
  font-size: 1.08rem;
  line-height: 1.7;
}

.hero__cta {
  display: inline-flex;
  min-height: 58px;
  gap: 22px;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
  padding: 0 25px;
  border-radius: 12px;
  color: #fff;
  background: var(--wine);
  box-shadow: 0 14px 30px rgba(159,25,69,.25);
  font-size: 1rem;
  font-weight: 850;
  text-decoration: none;
  transition: transform .2s ease, background .2s ease;
}

.hero__cta:hover {
  transform: translateY(-2px);
  background: var(--wine-dark);
}

.hero__schedule {
  padding: 28px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 22px;
  background: rgba(255,255,255,.08);
  box-shadow: 0 28px 70px rgba(0,0,0,.2);
  backdrop-filter: blur(16px);
}

.hero__schedule-label {
  display: block;
  color: #f0c748;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .14em;
}

.hero__schedule strong {
  display: block;
  margin-top: 17px;
  color: #fff;
  font-size: 2.4rem;
}

.hero__schedule p {
  margin: 5px 0 0;
  color: rgba(255,255,255,.82);
  font-size: 1.05rem;
}

.hero__schedule div {
  height: 1px;
  margin: 22px 0;
  background: rgba(255,255,255,.14);
}

.hero__schedule small {
  display: block;
  margin-top: 5px;
  color: rgba(255,255,255,.72);
  font-size: .86rem;
}

.form-area {
  scroll-margin-top: 100px;
  padding: 80px 0 92px;
  background: var(--canvas);
}

.form-layout {
  display: grid;
  grid-template-columns: minmax(250px, .65fr) minmax(0, 1.35fr);
  gap: 56px;
  align-items: start;
}

.form-intro {
  position: sticky;
  top: 110px;
}

.form-intro h2,
.information-section h2,
.success-card h2,
.simple-form__header h2 {
  color: var(--navy);
}

.form-intro h2 {
  margin: 14px 0 0;
  font-size: clamp(2.4rem, 4vw, 3.7rem);
  line-height: 1;
  letter-spacing: -.04em;
}

.form-intro > p {
  margin: 20px 0 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.7;
}

.help-card,
.contact-note {
  margin-top: 24px;
  padding: 19px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
}

.help-card {
  display: flex;
  gap: 13px;
}

.help-card__icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: #2d8a63;
  font-weight: 900;
}

.help-card strong,
.contact-note strong {
  color: var(--navy);
  font-size: .94rem;
}

.help-card p,
.contact-note p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: .86rem;
  line-height: 1.55;
}

.contact-note {
  border-color: #eadfae;
  background: #fffaf0;
}

.simple-form,
.success-card {
  overflow: hidden;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 20px 50px rgba(31,48,73,.08);
}

.simple-form {
  padding: 34px;
}

.simple-form__header {
  padding-bottom: 25px;
  border-bottom: 1px solid var(--line);
}

.simple-form__header > span {
  color: var(--wine);
  font-size: .7rem;
  font-weight: 900;
  letter-spacing: .14em;
}

.simple-form__header h2 {
  margin: 8px 0 0;
  font-size: 2rem;
  letter-spacing: -.03em;
}

.simple-form__header p {
  margin: 7px 0 0;
  color: var(--muted);
  font-size: .9rem;
}

.fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 22px;
  margin-top: 28px;
}

.field--full {
  grid-column: 1 / -1;
}

.field {
  display: block;
}

.field > span {
  display: block;
  margin-bottom: 9px;
  color: var(--navy);
  font-size: 1rem;
  font-weight: 800;
}

.field b {
  color: var(--wine);
}

.field input {
  width: 100%;
  min-height: 58px;
  padding: 0 16px;
  border: 1.5px solid #cfd9e5;
  border-radius: 11px;
  outline: none;
  color: var(--navy);
  background: #fff;
  font: inherit;
  font-size: 1rem;
  transition: border-color .2s ease, box-shadow .2s ease;
}

.field input::placeholder {
  color: #98a2b3;
}

.field input:focus {
  border-color: var(--wine);
  box-shadow: 0 0 0 4px rgba(159,25,69,.10);
}

.field input.invalid {
  border-color: #be4856;
  background: #fffafb;
}

.field__hint,
.field__error {
  display: block;
  margin-top: 7px;
  line-height: 1.45;
}

.field__hint {
  color: var(--muted);
  font-size: .8rem;
}

.field__error,
.consent-error {
  color: #a82f3d;
  font-size: .82rem;
  font-weight: 750;
}

.guardian-box {
  margin-top: 26px;
  padding: 22px;
  border: 1px solid #eadfae;
  border-radius: 16px;
  background: #fffaf0;
}

.guardian-box__heading {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
}

.guardian-box__heading strong {
  color: var(--navy);
  font-size: 1rem;
}

.guardian-box__heading p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: .85rem;
}

.guardian-box__heading > span {
  padding: 7px 10px;
  border-radius: 999px;
  color: #7b5b00;
  background: #fff1b8;
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .1em;
}

.guardian-box .fields {
  margin-top: 20px;
}

.consent {
  display: flex;
  gap: 13px;
  align-items: flex-start;
  margin-top: 28px;
  padding: 17px;
  border: 1px solid var(--line);
  border-radius: 13px;
  background: var(--soft);
  cursor: pointer;
}

.consent input {
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  margin: 1px 0 0;
  accent-color: var(--wine);
}

.consent span {
  color: var(--text);
  font-size: .91rem;
  line-height: 1.55;
}

.consent--invalid {
  border-color: #be4856;
  background: #fff6f7;
}

.consent-error {
  display: block;
  margin-top: 7px;
}

.website-field {
  position: absolute !important;
  left: -10000px !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
}

.form-error {
  display: flex;
  gap: 13px;
  margin-top: 20px;
  padding: 16px;
  border: 1px solid #efc5ca;
  border-radius: 12px;
  background: #fff5f6;
}

.form-error > span {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: #be4856;
  font-weight: 900;
}

.form-error strong {
  color: #8f2532;
}

.form-error p {
  margin: 4px 0 0;
  color: #8f4750;
  font-size: .87rem;
}

.submit-button {
  display: flex;
  width: 100%;
  min-height: 64px;
  gap: 16px;
  align-items: center;
  justify-content: center;
  margin-top: 22px;
  border: 0;
  border-radius: 12px;
  color: #fff;
  background: var(--wine);
  box-shadow: 0 12px 26px rgba(159,25,69,.20);
  font: inherit;
  font-size: 1.05rem;
  font-weight: 900;
  cursor: pointer;
  transition: transform .2s ease, background .2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  background: var(--wine-dark);
}

.submit-button:disabled {
  opacity: .65;
  cursor: wait;
}

.spinner {
  width: 19px;
  height: 19px;
  border: 2px solid rgba(255,255,255,.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

.privacy-note {
  margin: 13px 0 0;
  color: var(--muted);
  font-size: .78rem;
  line-height: 1.5;
  text-align: center;
}

.success-card {
  padding: 42px;
  text-align: center;
}

.success-card__check {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  margin: 0 auto 20px;
  border-radius: 50%;
  color: #fff;
  background: #2d8a63;
  font-size: 1.7rem;
  font-weight: 900;
}

.success-card .section-label {
  text-align: center;
}

.success-card h2 {
  margin: 10px 0 0;
  font-size: 2.2rem;
}

.success-card > p {
  max-width: 580px;
  margin: 15px auto 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.65;
}

.success-card__steps {
  display: grid;
  gap: 10px;
  margin-top: 28px;
  text-align: left;
}

.success-card__steps > div {
  display: flex;
  gap: 13px;
  align-items: center;
  padding: 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--soft);
}

.success-card__steps > div > span {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: var(--wine);
  font-size: .78rem;
  font-weight: 900;
}

.success-card__steps p {
  margin: 0;
}

.success-card__steps strong,
.success-card__steps small {
  display: block;
}

.success-card__steps strong {
  color: var(--navy);
}

.success-card__steps small {
  margin-top: 3px;
  color: var(--muted);
}

.secondary-button {
  min-height: 50px;
  margin-top: 25px;
  padding: 0 20px;
  border: 1px solid var(--line);
  border-radius: 10px;
  color: var(--wine);
  background: #fff;
  font: inherit;
  font-weight: 850;
  cursor: pointer;
}

.information-section {
  padding: 90px 0 100px;
  border-top: 1px solid var(--line);
  background: #fff;
}

.information-section__header {
  max-width: 720px;
}

.information-section__header h2 {
  margin: 12px 0 0;
  font-size: clamp(2.3rem, 4vw, 3.7rem);
  line-height: 1.05;
  letter-spacing: -.04em;
}

.information-section__header p {
  margin: 16px 0 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.65;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-top: 38px;
}

.info-grid article {
  min-height: 190px;
  padding: 23px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--soft);
}

.info-grid article > span {
  color: var(--gold);
  font-size: .7rem;
  font-weight: 900;
}

.info-grid h3 {
  margin: 22px 0 0;
  color: var(--navy);
  font-size: 1.08rem;
}

.info-grid p {
  margin: 10px 0 0;
  color: var(--muted);
  font-size: .9rem;
  line-height: 1.55;
}

.info-grid strong {
  color: var(--navy);
}

.after-send {
  display: flex;
  align-items: center;
  margin-top: 28px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
}

.after-send > div:not(.after-send__line) {
  display: flex;
  min-width: 0;
  flex: 1;
  gap: 12px;
  align-items: center;
}

.after-send > div > span {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: var(--wine);
  font-size: .76rem;
  font-weight: 900;
}

.after-send p {
  margin: 0;
}

.after-send strong,
.after-send small {
  display: block;
}

.after-send strong {
  color: var(--navy);
  font-size: .88rem;
}

.after-send small {
  margin-top: 3px;
  color: var(--muted);
  font-size: .76rem;
}

.after-send__line {
  width: 45px;
  height: 1px;
  flex: 0 0 auto !important;
  margin: 0 15px;
  background: var(--line);
}

:where(a, button, input):focus-visible {
  outline: 3px solid rgba(159,25,69,.28);
  outline-offset: 3px;
}

.success-enter-active,
.success-leave-active,
.expand-enter-active,
.expand-leave-active {
  transition: all .25s ease;
}

.success-enter-from,
.success-leave-to,
.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .hero {
    padding: 125px 0 60px;
  }

  .hero__layout,
  .form-layout {
    grid-template-columns: 1fr;
  }

  .hero__layout {
    gap: 34px;
  }

  .form-layout {
    gap: 30px;
  }

  .form-intro {
    position: static;
  }

  .info-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .container {
    width: min(100% - 24px, 1120px);
  }

  .hero {
    padding: 105px 0 38px;
  }

  .hero h1 {
    font-size: clamp(2.75rem, 14vw, 4rem);
  }

  .hero__copy > p {
    font-size: 1rem;
  }

  .hero__cta {
    width: 100%;
    min-height: 62px;
    font-size: 1.05rem;
  }

  .hero__schedule {
    padding: 21px;
  }

  .hero__schedule strong {
    font-size: 2rem;
  }

  .form-area {
    padding: 44px 0 60px;
  }

  .form-intro h2 {
    font-size: 2.35rem;
  }

  .simple-form,
  .success-card {
    border-radius: 17px;
  }

  .simple-form {
    padding: 22px 17px;
  }

  .simple-form__header h2 {
    font-size: 1.7rem;
  }

  .fields {
    grid-template-columns: 1fr;
    gap: 19px;
  }

  .field--full {
    grid-column: auto;
  }

  .field > span {
    font-size: 1.04rem;
  }

  .field input {
    min-height: 62px;
    font-size: 16px;
  }

  .consent {
    padding: 15px;
  }

  .consent span {
    font-size: .94rem;
  }

  .submit-button {
    min-height: 66px;
    font-size: 1.08rem;
  }

  .success-card {
    padding: 30px 19px;
  }

  .information-section {
    padding: 60px 0 70px;
  }

  .information-section__header h2 {
    font-size: 2.25rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-grid article {
    min-height: auto;
  }

  .after-send {
    display: grid;
    gap: 12px;
  }

  .after-send__line {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
