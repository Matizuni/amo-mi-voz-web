<template>
  <main class="inscription-page">
    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="hero">
      <div class="hero__grid"></div>
      <div class="hero__glow hero__glow--right"></div>
      <div class="hero__glow hero__glow--left"></div>

      <div class="container hero__container">
        <div class="hero__content">
          <div class="hero__eyebrow">
            <span class="hero__eyebrow-dot"></span>
            INSCRIPCIONES · AMO MI VOZ
          </div>

          <h1>
            Tu voz puede ser
            <span>el comienzo de algo grande.</span>
          </h1>

          <p class="hero__lead">
            Formación artística y vocal pensada para acompañarte
            desde tu propio punto de partida. No necesitas experiencia
            previa: queremos conocer tu voz, tus intereses y tus metas.
          </p>

          <div class="journey">
            <article class="journey__item">
              <span>01</span>

              <div>
                <strong>Te conocemos</strong>

                <p>
                  Nos cuentas sobre tu experiencia,
                  intereses y objetivos.
                </p>
              </div>
            </article>

            <article class="journey__item">
              <span>02</span>

              <div>
                <strong>Orientamos tu proceso</strong>

                <p>
                  Revisamos tu solicitud y definimos
                  el mejor punto de partida.
                </p>
              </div>
            </article>

            <article class="journey__item">
              <span>03</span>

              <div>
                <strong>Comenzamos a trabajar</strong>

                <p>
                  Técnica vocal, música, repertorio
                  y experiencia escénica.
                </p>
              </div>
            </article>
          </div>
        </div>

        <!-- =================================================
             TARJETA DE HORARIO
        ================================================== -->
        <aside class="schedule-card">
          <div class="schedule-card__status">
            <span></span>
            FORMACIÓN PRESENCIAL
          </div>

          <div class="schedule-card__brand">
            <div class="schedule-card__monogram">
              AMV
            </div>

            <div>
              <small>ACADEMIA DE TALENTOS</small>
              <strong>Amo Mi Voz</strong>
            </div>
          </div>

          <div class="schedule-card__divider"></div>

          <div class="schedule-card__main">
            <small>CLASES REGULARES</small>

            <strong>Sábados</strong>

            <span>
              16:00 — 18:00 hrs
            </span>
          </div>

          <div class="schedule-card__location">
            <div class="schedule-card__location-icon">
              ◆
            </div>

            <div>
              <small>SEDE</small>

              <strong>
                Pueblito Artesanal La Calera
              </strong>

              <span>
                Calle Iriarte 96, La Calera
              </span>
            </div>
          </div>

          <a
            class="schedule-card__map"
            href="https://www.google.com/maps/search/?api=1&query=Pueblito+Artesanal+La+Calera+Calle+Iriarte+96"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Ver ubicación</span>
            <span>↗</span>
          </a>

          <div class="schedule-card__footer">
            <span>♪</span>

            <p>
              Canto, teoría musical, interpretación,
              repertorio y experiencia de escenario.
            </p>
          </div>
        </aside>
      </div>
    </section>

    <!-- =====================================================
         CONTENIDO
    ====================================================== -->
    <section class="content-section">
      <div class="container content-layout">
        <!-- =================================================
             COLUMNA INFORMATIVA
        ================================================== -->
        <aside class="form-sidebar">
          <span class="section-eyebrow">
            SOLICITUD DE INSCRIPCIÓN
          </span>

          <h2>
            Queremos saber
            <span>un poco sobre ti.</span>
          </h2>

          <p class="form-sidebar__lead">
            Esta solicitud nos permite conocerte antes
            de iniciar el proceso. Completarla no requiere
            experiencia musical previa.
          </p>

          <div class="notice-card">
            <div class="notice-card__icon">
              ♪
            </div>

            <div>
              <strong>
                No necesitas experiencia previa
              </strong>

              <p>
                Trabajamos desde las características,
                necesidades y nivel de cada estudiante.
              </p>
            </div>
          </div>

          <div class="academy-details">
            <div>
              <small>MODALIDAD</small>
              <strong>Presencial</strong>
            </div>

            <div>
              <small>DÍA</small>
              <strong>Sábados</strong>
            </div>

            <div>
              <small>HORARIO</small>
              <strong>16:00–18:00</strong>
            </div>

            <div>
              <small>SEDE</small>
              <strong>Pueblito Artesanal</strong>
            </div>
          </div>

          <div class="sidebar-process">
            <small>DESPUÉS DE ENVIAR</small>

            <div class="sidebar-process__step">
              <span>1</span>
              <p>Recibimos tu solicitud.</p>
            </div>

            <div class="sidebar-process__step">
              <span>2</span>
              <p>La academia revisa tus antecedentes.</p>
            </div>

            <div class="sidebar-process__step">
              <span>3</span>
              <p>Nos ponemos en contacto contigo.</p>
            </div>

            <div class="sidebar-process__step">
              <span>4</span>
              <p>
                Una vez aprobada, realizamos tu matrícula.
              </p>
            </div>
          </div>
        </aside>

        <!-- =================================================
             ÉXITO FINAL
        ================================================== -->
        <Transition name="success">
          <section
            v-if="submissionCompleted"
            class="success-card"
            aria-live="polite"
          >
            <div class="success-card__icon">
              ✓
            </div>

            <span class="section-eyebrow">
              SOLICITUD RECIBIDA
            </span>

            <h2>
              Gracias por querer ser parte de
              <span>Amo Mi Voz.</span>
            </h2>

            <p>
              Tu solicitud fue enviada correctamente.
              Revisaremos tus antecedentes y nos pondremos
              en contacto utilizando los datos que registraste.
            </p>

            <div class="success-card__timeline">
              <div>
                <span>✓</span>

                <div>
                  <strong>Solicitud enviada</strong>
                  <small>Completado</small>
                </div>
              </div>

              <div>
                <span>2</span>

                <div>
                  <strong>Revisión de antecedentes</strong>
                  <small>Siguiente etapa</small>
                </div>
              </div>

              <div>
                <span>3</span>

                <div>
                  <strong>Contacto de la academia</strong>
                  <small>Posterior a la revisión</small>
                </div>
              </div>
            </div>

            <div class="success-card__notice">
              <span>i</span>

              <p>
                La solicitud no crea automáticamente una cuenta
                del Aula Virtual. El acceso se habilita únicamente
                una vez realizada la matrícula.
              </p>
            </div>

            <button
              type="button"
              class="secondary-action"
              @click="createAnotherRequest"
            >
              Enviar otra solicitud
            </button>
          </section>
        </Transition>

        <!-- =================================================
             FORMULARIO
        ================================================== -->
        <form
          v-if="!submissionCompleted"
          class="inscription-form"
          novalidate
          @submit.prevent="submitForm"
        >
          <!-- ===============================================
               PROGRESO
          ================================================ -->
          <div class="form-progress">
            <div
              v-for="step in steps"
              :key="step.number"
              class="form-progress__item"
            >
              <span>
                {{ step.number }}
              </span>

              <small>
                {{ step.label }}
              </small>
            </div>
          </div>

          <!-- ===============================================
               01 DATOS PERSONALES
          ================================================ -->
          <section class="form-section">
            <header class="form-section__header">
              <div class="form-section__number">
                01
              </div>

              <div>
                <h3>Datos del estudiante</h3>

                <p>
                  Comencemos con la información básica.
                </p>
              </div>
            </header>

            <div class="form-grid">
              <label class="field field--full">
                <span>
                  Nombre completo
                  <b>*</b>
                </span>

                <input
                  v-model.trim="form.name"
                  type="text"
                  autocomplete="name"
                  maxlength="120"
                  placeholder="Nombre y apellido"
                  :class="{ invalid: fieldErrors.name }"
                  required
                  @input="clearFieldError('name')"
                />

                <small
                  v-if="fieldErrors.name"
                  class="field__error"
                >
                  {{ fieldErrors.name }}
                </small>
              </label>

              <label class="field">
                <span>
                  Edad
                  <b>*</b>
                </span>

                <input
                  v-model.number="form.age"
                  type="number"
                  inputmode="numeric"
                  min="4"
                  max="100"
                  placeholder="Ej: 18"
                  :class="{ invalid: fieldErrors.age }"
                  required
                  @input="clearFieldError('age')"
                />

                <small
                  v-if="fieldErrors.age"
                  class="field__error"
                >
                  {{ fieldErrors.age }}
                </small>
              </label>

              <label class="field">
                <span>
                  Teléfono de contacto
                  <b>*</b>
                </span>

                <input
                  v-model.trim="form.phone"
                  type="tel"
                  autocomplete="tel"
                  maxlength="30"
                  placeholder="+56 9 1234 5678"
                  :class="{ invalid: fieldErrors.phone }"
                  required
                  @input="clearFieldError('phone')"
                />

                <small
                  v-if="fieldErrors.phone"
                  class="field__error"
                >
                  {{ fieldErrors.phone }}
                </small>
              </label>

              <label class="field field--full">
                <span>
                  Correo electrónico
                  <b>*</b>
                </span>

                <input
                  v-model.trim="form.email"
                  type="email"
                  autocomplete="email"
                  maxlength="160"
                  placeholder="nombre@correo.cl"
                  :class="{ invalid: fieldErrors.email }"
                  required
                  @input="clearFieldError('email')"
                />

                <small
                  v-if="fieldErrors.email"
                  class="field__error"
                >
                  {{ fieldErrors.email }}
                </small>
              </label>
            </div>

            <!-- =============================================
                 APODERADO
            ============================================== -->
            <Transition name="expand">
              <div
                v-if="isMinor"
                class="guardian-card"
              >
                <div class="guardian-card__header">
                  <div>
                    <span>
                      Estudiante menor de edad
                    </span>

                    <small>
                      Necesitamos los datos de una persona
                      adulta responsable.
                    </small>
                  </div>

                  <span class="guardian-card__badge">
                    APODERADO
                  </span>
                </div>

                <div class="form-grid">
                  <label class="field">
                    <span>
                      Nombre del apoderado
                      <b>*</b>
                    </span>

                    <input
                      v-model.trim="form.guardianName"
                      type="text"
                      autocomplete="name"
                      maxlength="120"
                      placeholder="Nombre completo"
                      :class="{
                        invalid:
                          fieldErrors.guardianName
                      }"
                      :required="isMinor"
                      @input="
                        clearFieldError(
                          'guardianName'
                        )
                      "
                    />

                    <small
                      v-if="fieldErrors.guardianName"
                      class="field__error"
                    >
                      {{ fieldErrors.guardianName }}
                    </small>
                  </label>

                  <label class="field">
                    <span>
                      Teléfono del apoderado
                      <b>*</b>
                    </span>

                    <input
                      v-model.trim="form.guardianPhone"
                      type="tel"
                      autocomplete="tel"
                      maxlength="30"
                      placeholder="+56 9 1234 5678"
                      :class="{
                        invalid:
                          fieldErrors.guardianPhone
                      }"
                      :required="isMinor"
                      @input="
                        clearFieldError(
                          'guardianPhone'
                        )
                      "
                    />

                    <small
                      v-if="fieldErrors.guardianPhone"
                      class="field__error"
                    >
                      {{ fieldErrors.guardianPhone }}
                    </small>
                  </label>
                </div>
              </div>
            </Transition>
          </section>

          <!-- ===============================================
               02 PERFIL ARTÍSTICO
          ================================================ -->
          <section class="form-section">
            <header class="form-section__header">
              <div class="form-section__number">
                02
              </div>

              <div>
                <h3>Tu perfil artístico</h3>

                <p>
                  No buscamos respuestas perfectas.
                  Queremos saber qué quieres desarrollar.
                </p>
              </div>
            </header>

            <div class="form-grid">
              <label class="field">
                <span>
                  Área principal de interés
                  <b>*</b>
                </span>

                <select
                  v-model="form.interest"
                  :class="{
                    invalid:
                      fieldErrors.interest
                  }"
                  required
                  @change="
                    clearFieldError('interest')
                  "
                >
                  <option
                    disabled
                    value=""
                  >
                    Selecciona una opción
                  </option>

                  <option value="Canto y técnica vocal">
                    Canto y técnica vocal
                  </option>

                  <option value="Coro y ensamble">
                    Coro y ensamble
                  </option>

                  <option value="Interpretación escénica">
                    Interpretación escénica
                  </option>

                  <option value="Teatro musical">
                    Teatro musical
                  </option>

                  <option value="Producción musical">
                    Producción musical
                  </option>

                  <option value="Preparación para conciertos">
                    Preparación para conciertos
                  </option>

                  <option value="Quiero orientación">
                    No estoy seguro/a, quiero orientación
                  </option>
                </select>

                <small
                  v-if="fieldErrors.interest"
                  class="field__error"
                >
                  {{ fieldErrors.interest }}
                </small>
              </label>

              <label class="field">
                <span>
                  Experiencia previa
                  <b>*</b>
                </span>

                <select
                  v-model="form.experience"
                  :class="{
                    invalid:
                      fieldErrors.experience
                  }"
                  required
                  @change="
                    clearFieldError('experience')
                  "
                >
                  <option
                    disabled
                    value=""
                  >
                    Selecciona una opción
                  </option>

                  <option value="Sin experiencia">
                    Estoy comenzando
                  </option>

                  <option value="Hobby">
                    Canto o hago música por hobby
                  </option>

                  <option value="Clases previas">
                    He tomado clases anteriormente
                  </option>

                  <option value="Coro">
                    He participado en coro o ensamble
                  </option>

                  <option value="Escenario">
                    He cantado o actuado en público
                  </option>

                  <option value="Experiencia musical">
                    Tengo experiencia musical previa
                  </option>
                </select>

                <small
                  v-if="fieldErrors.experience"
                  class="field__error"
                >
                  {{ fieldErrors.experience }}
                </small>
              </label>

              <label class="field field--full">
                <span>
                  ¿Qué te gustaría aprender o mejorar?
                  <b>*</b>
                </span>

                <textarea
                  v-model.trim="form.goals"
                  rows="5"
                  maxlength="1000"
                  placeholder="Por ejemplo: mejorar afinación, respiración, confianza escénica, conocer mejor mi voz, aprender repertorio..."
                  :class="{
                    invalid:
                      fieldErrors.goals
                  }"
                  required
                  @input="
                    clearFieldError('goals')
                  "
                ></textarea>

                <div class="field__bottom">
                  <small
                    v-if="fieldErrors.goals"
                    class="field__error"
                  >
                    {{ fieldErrors.goals }}
                  </small>

                  <small class="field__counter">
                    {{ form.goals.length }}/1000
                  </small>
                </div>
              </label>
            </div>
          </section>

          <!-- ===============================================
               03 ASISTENCIA
          ================================================ -->
          <section class="form-section">
            <header class="form-section__header">
              <div class="form-section__number">
                03
              </div>

              <div>
                <h3>Clases y asistencia</h3>

                <p>
                  Confirma que conoces el horario
                  antes de enviar tu solicitud.
                </p>
              </div>
            </header>

            <div class="class-information">
              <article>
                <div class="class-information__icon">
                  S
                </div>

                <div>
                  <small>DÍA</small>
                  <strong>Todos los sábados</strong>
                </div>
              </article>

              <article>
                <div class="class-information__icon">
                  16
                </div>

                <div>
                  <small>HORARIO</small>
                  <strong>16:00 a 18:00 hrs</strong>
                </div>
              </article>

              <article>
                <div class="class-information__icon">
                  P
                </div>

                <div>
                  <small>SEDE</small>
                  <strong>Pueblito Artesanal</strong>
                </div>
              </article>

              <article>
                <div class="class-information__icon">
                  LC
                </div>

                <div>
                  <small>DIRECCIÓN</small>
                  <strong>
                    Calle Iriarte 96, La Calera
                  </strong>
                </div>
              </article>
            </div>

            <div class="form-grid">
              <label class="field field--full">
                <span>
                  ¿Puedes asistir los sábados
                  de 16:00 a 18:00?
                  <b>*</b>
                </span>

                <select
                  v-model="form.availability"
                  :class="{
                    invalid:
                      fieldErrors.availability
                  }"
                  required
                  @change="
                    clearFieldError(
                      'availability'
                    )
                  "
                >
                  <option
                    disabled
                    value=""
                  >
                    Selecciona una opción
                  </option>

                  <option value="yes">
                    Sí, puedo asistir en ese horario
                  </option>

                  <option value="question">
                    Necesito conversar mi situación
                  </option>
                </select>

                <small
                  v-if="fieldErrors.availability"
                  class="field__error"
                >
                  {{ fieldErrors.availability }}
                </small>
              </label>

              <Transition name="expand">
                <div
                  v-if="form.availability === 'question'"
                  class="availability-notice field--full"
                >
                  <span>i</span>

                  <p>
                    No hay problema. Cuéntanos tu situación
                    en el mensaje de abajo para poder
                    considerarla al revisar tu solicitud.
                  </p>
                </div>
              </Transition>

              <label class="field field--full">
                <span>
                  ¿Hay algo más que quieras contarnos?
                </span>

                <textarea
                  v-model.trim="form.message"
                  rows="4"
                  maxlength="1000"
                  placeholder="Puedes contarnos cualquier antecedente, necesidad, experiencia o consulta que consideres importante."
                ></textarea>

                <small class="field__counter">
                  {{ form.message.length }}/1000
                </small>
              </label>
            </div>
          </section>

          <!-- ===============================================
               04 CONFIRMACIÓN
          ================================================ -->
          <section class="form-section form-section--final">
            <header class="form-section__header">
              <div class="form-section__number">
                04
              </div>

              <div>
                <h3>Revisión y envío</h3>

                <p>
                  Verifica tus datos antes de enviarnos
                  la solicitud.
                </p>
              </div>
            </header>

            <div class="request-summary">
              <div>
                <small>ESTUDIANTE</small>

                <strong>
                  {{ form.name || 'Por completar' }}
                </strong>
              </div>

              <div>
                <small>INTERÉS</small>

                <strong>
                  {{ form.interest || 'Por seleccionar' }}
                </strong>
              </div>

              <div>
                <small>CLASES</small>

                <strong>
                  Sábados · 16:00–18:00
                </strong>
              </div>

              <div>
                <small>SEDE</small>

                <strong>
                  Pueblito Artesanal La Calera
                </strong>
              </div>
            </div>

            <!-- Honeypot antispam -->
            <label
              class="website-field"
              aria-hidden="true"
            >
              Website

              <input
                v-model="form.website"
                type="text"
                tabindex="-1"
                autocomplete="off"
              />
            </label>

            <label
              class="consent"
              :class="{
                'consent--invalid':
                  fieldErrors.accepted
              }"
            >
              <input
                v-model="form.accepted"
                type="checkbox"
                required
                @change="
                  clearFieldError('accepted')
                "
              />

              <span>
                Confirmo que los datos ingresados son correctos
                y autorizo a la Academia de Talentos Amo Mi Voz
                a utilizar esta información exclusivamente para
                gestionar y contactarme respecto de esta solicitud
                de inscripción.
              </span>
            </label>

            <small
              v-if="fieldErrors.accepted"
              class="consent-error"
            >
              {{ fieldErrors.accepted }}
            </small>

            <div
              v-if="errorMessage"
              class="form-feedback form-feedback--error"
              role="alert"
            >
              <span>!</span>

              <div>
                <strong>
                  No pudimos enviar tu solicitud
                </strong>

                <p>
                  {{ errorMessage }}
                </p>
              </div>
            </div>

            <button
              class="submit-button"
              type="submit"
              :disabled="isSubmitting"
            >
              <template v-if="isSubmitting">
                <span class="submit-spinner"></span>
                Enviando solicitud...
              </template>

              <template v-else>
                <span>
                  Enviar solicitud de inscripción
                </span>

                <span class="submit-button__arrow">
                  →
                </span>
              </template>
            </button>

            <div class="form-security">
              <span>●</span>

              <p>
                Tus datos se envían de forma segura y serán
                utilizados únicamente para gestionar tu
                proceso de inscripción.
              </p>
            </div>
          </section>
        </form>
      </div>
    </section>
  </main>
</template>

<script setup>
import {
  computed,
  nextTick,
  reactive,
  ref
} from 'vue'

import { supabase } from '@/lib/supabase'

/* =========================================================
   ESTADO
========================================================= */

const isSubmitting = ref(false)
const submissionCompleted = ref(false)
const errorMessage = ref('')

const fieldErrors = reactive({})

const steps = [
  {
    number: '01',
    label: 'Datos'
  },
  {
    number: '02',
    label: 'Perfil'
  },
  {
    number: '03',
    label: 'Clases'
  },
  {
    number: '04',
    label: 'Enviar'
  }
]

/* =========================================================
   FORMULARIO
========================================================= */

const form = reactive({
  name: '',
  age: '',
  phone: '',
  email: '',

  guardianName: '',
  guardianPhone: '',

  interest: '',
  experience: '',
  goals: '',

  availability: '',
  message: '',

  accepted: false,

  /*
   * Honeypot.
   * Las personas reales nunca ven este campo.
   */
  website: ''
})

/* =========================================================
   COMPUTADOS
========================================================= */

const isMinor = computed(() => {
  const age = Number(form.age)

  return (
    Number.isFinite(age) &&
    age >= 4 &&
    age < 18
  )
})

/* =========================================================
   VALIDACIÓN
========================================================= */

function clearErrors() {
  Object.keys(fieldErrors)
    .forEach(key => {
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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email)
}

function normalizePhone(phone) {
  return String(phone || '')
    .trim()
    .replace(/\s+/g, ' ')
}

function hasEnoughPhoneDigits(phone) {
  const digits =
    String(phone || '')
      .replace(/\D/g, '')

  return digits.length >= 8
}

function validateForm() {
  clearErrors()

  const age = Number(form.age)

  if (
    !form.name ||
    form.name.trim().length < 3
  ) {
    fieldErrors.name =
      'Ingresa el nombre completo del estudiante.'
  }

  if (
    !Number.isInteger(age) ||
    age < 4 ||
    age > 100
  ) {
    fieldErrors.age =
      'Ingresa una edad válida entre 4 y 100 años.'
  }

  if (
    !form.phone ||
    !hasEnoughPhoneDigits(form.phone)
  ) {
    fieldErrors.phone =
      'Ingresa un teléfono de contacto válido.'
  }

  if (
    !form.email ||
    !isValidEmail(
      form.email.trim()
    )
  ) {
    fieldErrors.email =
      'Ingresa un correo electrónico válido.'
  }

  if (isMinor.value) {
    if (
      !form.guardianName ||
      form.guardianName.trim().length < 3
    ) {
      fieldErrors.guardianName =
        'Ingresa el nombre del apoderado.'
    }

    if (
      !form.guardianPhone ||
      !hasEnoughPhoneDigits(
        form.guardianPhone
      )
    ) {
      fieldErrors.guardianPhone =
        'Ingresa un teléfono válido del apoderado.'
    }
  }

  if (!form.interest) {
    fieldErrors.interest =
      'Selecciona el área que más te interesa.'
  }

  if (!form.experience) {
    fieldErrors.experience =
      'Selecciona tu nivel de experiencia.'
  }

  if (
    !form.goals ||
    form.goals.trim().length < 10
  ) {
    fieldErrors.goals =
      'Cuéntanos un poco más sobre lo que quieres aprender o mejorar.'
  }

  if (!form.availability) {
    fieldErrors.availability =
      'Confirma tu disponibilidad para asistir.'
  }

  if (!form.accepted) {
    fieldErrors.accepted =
      'Debes aceptar esta autorización para enviar la solicitud.'
  }

  return (
    Object.keys(fieldErrors)
      .length === 0
  )
}

/* =========================================================
   SCROLL AL PRIMER ERROR
========================================================= */

async function focusFirstError() {
  await nextTick()

  const firstInvalid =
    document.querySelector(
      '.inscription-form .invalid, .consent--invalid'
    )

  if (!firstInvalid) {
    return
  }

  firstInvalid.scrollIntoView({
    behavior: 'smooth',
    block: 'center'
  })

  const input =
    firstInvalid.matches(
      'input, select, textarea'
    )
      ? firstInvalid
      : firstInvalid.querySelector(
          'input, select, textarea'
        )

  input?.focus?.()
}

/* =========================================================
   ENVIAR
========================================================= */

async function submitForm() {
  if (isSubmitting.value) {
    return
  }

  /*
   * Honeypot:
   * si un bot completó este campo,
   * simulamos éxito sin insertar datos.
   */
  if (form.website) {
    submissionCompleted.value = true
    return
  }

  if (!validateForm()) {
    errorMessage.value =
      'Revisa los campos marcados antes de enviar tu solicitud.'

    await focusFirstError()

    return
  }

  isSubmitting.value = true
  errorMessage.value = ''

  try {
    const payload = {
      name:
        form.name
          .trim()
          .replace(/\s+/g, ' '),

      age:
        Number(form.age),

      phone:
        normalizePhone(
          form.phone
        ),

      email:
        form.email
          .trim()
          .toLowerCase(),

      guardian_name:
        isMinor.value
          ? form.guardianName
              .trim()
              .replace(/\s+/g, ' ')
          : null,

      guardian_phone:
        isMinor.value
          ? normalizePhone(
              form.guardianPhone
            )
          : null,

      interest:
        form.interest,

      experience:
        form.experience,

      goals:
        form.goals.trim(),

      availability:
        form.availability,

      message:
        form.message.trim() ||
        null,

      status:
        'pending'
    }

    const {
      error
    } =
      await supabase
        .from('inscriptions')
        .insert(payload)

    if (error) {
      throw error
    }

    submissionCompleted.value =
      true

    resetForm()

    await nextTick()

    window.scrollTo({
      top:
        document.querySelector(
          '.content-section'
        )?.offsetTop ?? 0,

      behavior:
        'smooth'
    })
  } catch (error) {
    console.error(
      'Error enviando inscripción:',
      error
    )

    errorMessage.value =
      getSubmitErrorMessage(error)

    await nextTick()

    document
      .querySelector(
        '.form-feedback--error'
      )
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })
  } finally {
    isSubmitting.value = false
  }
}

/* =========================================================
   MENSAJES DE ERROR
========================================================= */

function getSubmitErrorMessage(error) {
  const message =
    String(
      error?.message || ''
    )
      .toLowerCase()

  if (
    message.includes('network') ||
    message.includes('fetch')
  ) {
    return 'No pudimos conectarnos con el servidor. Revisa tu conexión a internet e inténtalo nuevamente.'
  }

  if (
    message.includes('row-level') ||
    message.includes('policy')
  ) {
    return 'El formulario no tiene autorización para registrar la solicitud. Contacta a la academia.'
  }

  return 'Ocurrió un problema al enviar tu solicitud. Tus datos no fueron registrados. Inténtalo nuevamente.'
}

/* =========================================================
   REINICIAR
========================================================= */

function resetForm() {
  form.name = ''
  form.age = ''
  form.phone = ''
  form.email = ''

  form.guardianName = ''
  form.guardianPhone = ''

  form.interest = ''
  form.experience = ''
  form.goals = ''

  form.availability = ''
  form.message = ''

  form.accepted = false
  form.website = ''

  clearErrors()
}

function createAnotherRequest() {
  submissionCompleted.value =
    false

  resetForm()

  nextTick(() => {
    document
      .querySelector(
        '.content-section'
      )
      ?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
  })
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.inscription-page {
  min-height: 100vh;
  color: #f5f5f5;
  background: #080808;
}

.container {
  width: min(1180px, 100%);
  margin: 0 auto;
}

.section-eyebrow {
  display: block;
  color: variables.$color-primary;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* =========================================================
   HERO
========================================================= */

.hero {
  position: relative;
  overflow: hidden;
  padding: 175px 24px 110px;
  background:
    linear-gradient(
      180deg,
      rgba(255, 255, 255, 0.015),
      transparent 45%
    ),
    #090909;
}

.hero__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.014) 1px,
      transparent 1px
    ),
    linear-gradient(
      rgba(255, 255, 255, 0.014) 1px,
      transparent 1px
    );
  background-size: 72px 72px;
  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent 90%
    );
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(130px);
}

.hero__glow--right {
  top: 80px;
  right: -180px;
  width: 580px;
  height: 580px;
  background:
    rgba(212, 175, 55, 0.11);
}

.hero__glow--left {
  bottom: -220px;
  left: -180px;
  width: 480px;
  height: 480px;
  background:
    rgba(212, 175, 55, 0.035);
}

.hero__container {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 1.35fr)
      minmax(340px, 0.65fr);
    align-items: center;
  }
}

.hero__eyebrow {
  display: flex;
  gap: 9px;
  align-items: center;
  color: variables.$color-primary;
  font-size: 0.67rem;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.hero__eyebrow-dot {
  display: block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: variables.$color-primary;
  box-shadow:
    0 0 14px
    rgba(212, 175, 55, 0.65);
}

.hero h1 {
  max-width: 900px;
  margin: 22px 0 0;
  font-size:
    clamp(3.4rem, 6.6vw, 6.5rem);
  line-height: 0.91;
  letter-spacing: -0.065em;
}

.hero h1 span {
  display: block;
  margin-top: 8px;
  color: variables.$color-primary;
}

.hero__lead {
  max-width: 760px;
  margin: 31px 0 0;
  color: #999;
  font-size: 1rem;
  line-height: 1.85;
}

/* =========================================================
   JOURNEY
========================================================= */

.journey {
  display: grid;
  gap: 11px;
  margin-top: 40px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

.journey__item {
  display: flex;
  gap: 14px;
  min-height: 118px;
  padding: 18px;
  border: 1px solid #262626;
  border-radius: 14px;
  background:
    rgba(255, 255, 255, 0.02);
  transition:
    transform 0.25s ease,
    border-color 0.25s ease;
}

.journey__item:hover {
  transform: translateY(-3px);
  border-color:
    rgba(212, 175, 55, 0.3);
}

.journey__item > span {
  color: variables.$color-primary;
  font-size: 0.63rem;
  font-weight: 900;
}

.journey__item strong {
  display: block;
  margin-bottom: 6px;
  font-size: 0.8rem;
}

.journey__item p {
  margin: 0;
  color: #6d6d6d;
  font-size: 0.68rem;
  line-height: 1.55;
}

/* =========================================================
   SCHEDULE CARD
========================================================= */

.schedule-card {
  overflow: hidden;
  padding: 29px;
  border:
    1px solid
    rgba(212, 175, 55, 0.27);
  border-radius: 24px;
  background:
    linear-gradient(
      145deg,
      rgba(212, 175, 55, 0.075),
      rgba(255, 255, 255, 0.018)
    ),
    #0d0d0d;
  box-shadow:
    0 40px 100px
    rgba(0, 0, 0, 0.48);
}

.schedule-card__status {
  display: flex;
  gap: 9px;
  align-items: center;
  color: #777;
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.schedule-card__status > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: variables.$color-primary;
  box-shadow:
    0 0 12px
    rgba(212, 175, 55, 0.55);
}

.schedule-card__brand {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-top: 28px;
}

.schedule-card__monogram {
  display: grid;
  width: 55px;
  height: 55px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 15px;
  color: #090909;
  background: variables.$color-primary;
  font-weight: 950;
}

.schedule-card__brand small,
.schedule-card__brand strong {
  display: block;
}

.schedule-card__brand small {
  margin-bottom: 4px;
  color: #6c6c6c;
  font-size: 0.52rem;
  letter-spacing: 0.14em;
}

.schedule-card__brand strong {
  font-size: 1.05rem;
}

.schedule-card__divider {
  height: 1px;
  margin: 29px 0;
  background: #292929;
}

.schedule-card__main small,
.schedule-card__main strong,
.schedule-card__main span {
  display: block;
}

.schedule-card__main small {
  margin-bottom: 7px;
  color: variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.schedule-card__main strong {
  font-size: 3rem;
  line-height: 1;
}

.schedule-card__main span {
  margin-top: 8px;
  color: #9c9c9c;
}

.schedule-card__location {
  display: flex;
  gap: 14px;
  margin-top: 28px;
  padding: 17px;
  border: 1px solid #292929;
  border-radius: 13px;
  background:
    rgba(0, 0, 0, 0.25);
}

.schedule-card__location-icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: variables.$color-primary;
  background:
    rgba(212, 175, 55, 0.08);
}

.schedule-card__location small,
.schedule-card__location strong,
.schedule-card__location span {
  display: block;
}

.schedule-card__location small {
  color: variables.$color-primary;
  font-size: 0.53rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.schedule-card__location strong {
  margin: 4px 0;
  font-size: 0.8rem;
}

.schedule-card__location span {
  color: #737373;
  font-size: 0.68rem;
}

.schedule-card__map {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 13px;
  padding: 13px 15px;
  border: 1px solid #303030;
  border-radius: 10px;
  color: #ddd;
  text-decoration: none;
  font-size: 0.7rem;
  font-weight: 800;
  transition: 0.2s ease;
}

.schedule-card__map:hover {
  color: variables.$color-primary;
  border-color:
    variables.$color-primary;
}

.schedule-card__footer {
  display: flex;
  gap: 10px;
  margin-top: 17px;
  padding-top: 17px;
  border-top: 1px solid #292929;
}

.schedule-card__footer > span {
  color: variables.$color-primary;
}

.schedule-card__footer p {
  margin: 0;
  color: #666;
  font-size: 0.63rem;
  line-height: 1.55;
}

/* =========================================================
   CONTENT
========================================================= */

.content-section {
  padding: 115px 24px 140px;
  background:
    linear-gradient(
      180deg,
      #080808,
      #0a0a0a
    );
}

.content-layout {
  display: grid;
  gap: 65px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(270px, 0.43fr)
      minmax(0, 1.57fr);
    align-items: start;
  }
}

/* =========================================================
   SIDEBAR
========================================================= */

.form-sidebar {
  @include mixins.respond-to(lg) {
    position: sticky;
    top: 125px;
  }
}

.form-sidebar h2 {
  margin: 18px 0 0;
  font-size:
    clamp(2.7rem, 4vw, 4.3rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.form-sidebar h2 span {
  display: block;
  color: variables.$color-primary;
}

.form-sidebar__lead {
  margin-top: 24px;
  color: #858585;
  font-size: 0.88rem;
  line-height: 1.75;
}

.notice-card {
  display: flex;
  gap: 14px;
  margin-top: 28px;
  padding: 17px;
  border:
    1px solid
    rgba(212, 175, 55, 0.18);
  border-radius: 13px;
  background:
    rgba(212, 175, 55, 0.035);
}

.notice-card__icon {
  color: variables.$color-primary;
  font-size: 1.05rem;
}

.notice-card strong {
  display: block;
  font-size: 0.76rem;
}

.notice-card p {
  margin: 5px 0 0;
  color: #777;
  font-size: 0.67rem;
  line-height: 1.55;
}

.academy-details {
  display: grid;
  grid-template-columns:
    repeat(2, 1fr);
  gap: 1px;
  overflow: hidden;
  margin-top: 18px;
  border: 1px solid #242424;
  border-radius: 12px;
  background: #242424;
}

.academy-details > div {
  padding: 14px;
  background: #0e0e0e;
}

.academy-details small,
.academy-details strong {
  display: block;
}

.academy-details small {
  margin-bottom: 5px;
  color: #606060;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.academy-details strong {
  font-size: 0.68rem;
}

.sidebar-process {
  margin-top: 20px;
  padding: 18px;
  border: 1px solid #242424;
  border-radius: 12px;
  background: #0d0d0d;
}

.sidebar-process > small {
  display: block;
  margin-bottom: 15px;
  color: #5d5d5d;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.sidebar-process__step {
  display: flex;
  gap: 10px;
  align-items: center;
}

.sidebar-process__step + .sidebar-process__step {
  margin-top: 11px;
}

.sidebar-process__step > span {
  display: grid;
  width: 22px;
  height: 22px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.25);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
}

.sidebar-process__step p {
  margin: 0;
  color: #777;
  font-size: 0.65rem;
}

/* =========================================================
   FORM
========================================================= */

.inscription-form {
  overflow: hidden;
  border: 1px solid #282828;
  border-radius: 24px;
  background: #101010;
  box-shadow:
    0 40px 100px
    rgba(0, 0, 0, 0.35);
}

.form-progress {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 1px;
  border-bottom: 1px solid #252525;
  background: #252525;
}

.form-progress__item {
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 14px 18px;
  background: #0c0c0c;
}

.form-progress__item > span {
  color: variables.$color-primary;
  font-size: 0.56rem;
  font-weight: 900;
}

.form-progress__item small {
  color: #676767;
  font-size: 0.57rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.form-section {
  padding: 38px;
  border-bottom: 1px solid #262626;
}

.form-section--final {
  border-bottom: 0;
}

.form-section__header {
  display: flex;
  gap: 17px;
  margin-bottom: 29px;
}

.form-section__number {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.6rem;
  font-weight: 900;
}

.form-section__header h3 {
  margin: 0 0 5px;
  font-size: 1.13rem;
}

.form-section__header p {
  margin: 0;
  color: #747474;
  font-size: 0.74rem;
}

/* =========================================================
   FIELDS
========================================================= */

.form-grid {
  display: grid;
  gap: 20px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

.field {
  position: relative;
  display: grid;
  gap: 9px;
}

.field--full {
  grid-column: 1 / -1;
}

.field > span {
  color: #cacaca;
  font-size: 0.71rem;
  font-weight: 700;
}

.field > span b {
  color: variables.$color-primary;
  font-weight: 900;
}

.field input,
.field select,
.field textarea {
  width: 100%;
  padding: 15px 16px;
  border: 1px solid #323232;
  border-radius: 10px;
  outline: 0;
  color: #f2f2f2;
  background: #090909;
  font: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #505050;
}

.field textarea {
  min-height: 120px;
  resize: vertical;
}

.field select {
  cursor: pointer;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color:
    variables.$color-primary;
  background: #0b0b0b;
  box-shadow:
    0 0 0 3px
    rgba(212, 175, 55, 0.07);
}

.field input.invalid,
.field select.invalid,
.field textarea.invalid {
  border-color:
    rgba(230, 85, 85, 0.75);
}

.field__bottom {
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: space-between;
}

.field__counter {
  margin-left: auto;
  color: #555;
  font-size: 0.58rem;
}

.field__error {
  color: #e88888;
  font-size: 0.61rem;
  line-height: 1.4;
}

/* =========================================================
   GUARDIAN
========================================================= */

.guardian-card {
  margin-top: 25px;
  padding: 22px;
  border:
    1px solid
    rgba(212, 175, 55, 0.22);
  border-radius: 14px;
  background:
    rgba(212, 175, 55, 0.025);
}

.guardian-card__header {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.guardian-card__header > div > span,
.guardian-card__header > div > small {
  display: block;
}

.guardian-card__header > div > span {
  color: variables.$color-primary;
  font-size: 0.76rem;
  font-weight: 800;
}

.guardian-card__header > div > small {
  margin-top: 4px;
  color: #737373;
  font-size: 0.65rem;
}

.guardian-card__badge {
  padding: 6px 9px;
  border-radius: 999px;
  color: variables.$color-primary;
  background:
    rgba(212, 175, 55, 0.08);
  font-size: 0.48rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

/* =========================================================
   CLASS INFO
========================================================= */

.class-information {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 11px;
  margin-bottom: 25px;
}

.class-information article {
  display: flex;
  gap: 13px;
  align-items: center;
  min-height: 86px;
  padding: 16px;
  border: 1px solid #2d2d2d;
  border-radius: 13px;
  background:
    linear-gradient(
      135deg,
      rgba(212, 175, 55, 0.035),
      rgba(255, 255, 255, 0.012)
    );
}

.class-information__icon {
  display: grid;
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.59rem;
  font-weight: 900;
}

.class-information small,
.class-information strong {
  display: block;
}

.class-information small {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.class-information strong {
  font-size: 0.75rem;
  line-height: 1.4;
}

.availability-notice {
  display: flex;
  gap: 11px;
  padding: 14px;
  border:
    1px solid
    rgba(212, 175, 55, 0.17);
  border-radius: 10px;
  background:
    rgba(212, 175, 55, 0.025);
}

.availability-notice > span {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #090909;
  background: variables.$color-primary;
  font-size: 0.6rem;
  font-weight: 900;
}

.availability-notice p {
  margin: 2px 0 0;
  color: #818181;
  font-size: 0.66rem;
  line-height: 1.55;
}

/* =========================================================
   SUMMARY
========================================================= */

.request-summary {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 1px;
  overflow: hidden;
  margin-bottom: 24px;
  border: 1px solid #292929;
  border-radius: 12px;
  background: #292929;
}

.request-summary > div {
  padding: 15px;
  background: #0c0c0c;
}

.request-summary small,
.request-summary strong {
  display: block;
}

.request-summary small {
  margin-bottom: 5px;
  color: #5d5d5d;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.request-summary strong {
  color: #ccc;
  font-size: 0.69rem;
}

/* =========================================================
   CONSENT
========================================================= */

.website-field {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
}

.consent {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  border: 1px solid transparent;
  border-radius: 10px;
  color: #7d7d7d;
  font-size: 0.68rem;
  line-height: 1.6;
  cursor: pointer;
}

.consent--invalid {
  border-color:
    rgba(220, 70, 70, 0.24);
  background:
    rgba(220, 70, 70, 0.025);
}

.consent input {
  flex: 0 0 auto;
  margin-top: 4px;
  accent-color:
    variables.$color-primary;
}

.consent-error {
  display: block;
  margin:
    5px 0
    0 14px;
  color: #e88888;
  font-size: 0.6rem;
}

/* =========================================================
   FEEDBACK
========================================================= */

.form-feedback {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  padding: 15px;
  border-radius: 11px;
}

.form-feedback > span {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 900;
}

.form-feedback strong,
.form-feedback p {
  display: block;
  margin: 0;
}

.form-feedback strong {
  font-size: 0.72rem;
}

.form-feedback p {
  margin-top: 4px;
  font-size: 0.66rem;
  line-height: 1.5;
}

.form-feedback--error {
  border:
    1px solid
    rgba(220, 70, 70, 0.25);
  color: #e98c8c;
  background:
    rgba(220, 70, 70, 0.05);
}

.form-feedback--error > span {
  color: #190707;
  background: #e98c8c;
}

/* =========================================================
   SUBMIT
========================================================= */

.submit-button {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-height: 54px;
  margin-top: 24px;
  padding: 15px 19px;
  border: 0;
  border-radius: 11px;
  color: #090909;
  background: variables.$color-primary;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.2s ease;
}

.submit-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow:
    0 18px 40px
    rgba(212, 175, 55, 0.17);
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: wait;
}

.submit-button__arrow {
  font-size: 1.1rem;
}

.submit-spinner {
  width: 15px;
  height: 15px;
  border:
    2px solid
    rgba(0, 0, 0, 0.22);
  border-top-color: #090909;
  border-radius: 50%;
  animation:
    spin 0.65s linear infinite;
}

.form-security {
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: center;
  max-width: 530px;
  margin: 13px auto 0;
  color: #555;
  text-align: center;
}

.form-security > span {
  color: #69816f;
  font-size: 0.43rem;
  margin-top: 5px;
}

.form-security p {
  margin: 0;
  font-size: 0.58rem;
  line-height: 1.45;
}

/* =========================================================
   SUCCESS
========================================================= */

.success-card {
  padding:
    55px
    clamp(25px, 5vw, 60px);
  border:
    1px solid
    rgba(212, 175, 55, 0.25);
  border-radius: 24px;
  background:
    radial-gradient(
      circle at top right,
      rgba(212, 175, 55, 0.07),
      transparent 40%
    ),
    #101010;
  box-shadow:
    0 40px 100px
    rgba(0, 0, 0, 0.35);
}

.success-card__icon {
  display: grid;
  width: 62px;
  height: 62px;
  margin-bottom: 28px;
  place-items: center;
  border-radius: 50%;
  color: #090909;
  background: variables.$color-primary;
  font-size: 1.3rem;
  font-weight: 900;
  box-shadow:
    0 0 35px
    rgba(212, 175, 55, 0.16);
}

.success-card h2 {
  max-width: 650px;
  margin: 17px 0 0;
  font-size:
    clamp(2.4rem, 5vw, 4rem);
  line-height: 1;
  letter-spacing: -0.045em;
}

.success-card h2 span {
  display: block;
  color: variables.$color-primary;
}

.success-card > p {
  max-width: 650px;
  margin: 22px 0 0;
  color: #8c8c8c;
  font-size: 0.86rem;
  line-height: 1.75;
}

.success-card__timeline {
  display: grid;
  gap: 1px;
  overflow: hidden;
  margin-top: 30px;
  border: 1px solid #282828;
  border-radius: 13px;
  background: #282828;
}

.success-card__timeline > div {
  display: flex;
  gap: 13px;
  align-items: center;
  padding: 16px;
  background: #0c0c0c;
}

.success-card__timeline > div > span {
  display: grid;
  width: 29px;
  height: 29px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.28);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
}

.success-card__timeline strong,
.success-card__timeline small {
  display: block;
}

.success-card__timeline strong {
  font-size: 0.72rem;
}

.success-card__timeline small {
  margin-top: 3px;
  color: #5e5e5e;
  font-size: 0.58rem;
}

.success-card__notice {
  display: flex;
  gap: 11px;
  margin-top: 21px;
  padding: 14px;
  border:
    1px solid
    rgba(212, 175, 55, 0.16);
  border-radius: 10px;
  background:
    rgba(212, 175, 55, 0.025);
}

.success-card__notice > span {
  display: grid;
  width: 24px;
  height: 24px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #090909;
  background: variables.$color-primary;
  font-size: 0.6rem;
  font-weight: 900;
}

.success-card__notice p {
  margin: 2px 0 0;
  color: #777;
  font-size: 0.64rem;
  line-height: 1.55;
}

.secondary-action {
  margin-top: 24px;
  padding: 12px 16px;
  border: 1px solid #373737;
  border-radius: 9px;
  color: #bbb;
  background: transparent;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 800;
  cursor: pointer;
}

.secondary-action:hover {
  color: variables.$color-primary;
  border-color:
    variables.$color-primary;
}

/* =========================================================
   TRANSITIONS
========================================================= */

.expand-enter-active,
.expand-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.success-enter-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease;
}

.success-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .hero {
    padding:
      145px 20px
      90px;
  }

  .content-section {
    padding:
      90px 20px
      110px;
  }
}

@media (max-width: 700px) {
  .hero h1 {
    font-size:
      clamp(
        3rem,
        13vw,
        4.8rem
      );
  }

  .form-progress {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .class-information {
    grid-template-columns: 1fr;
  }

  .request-summary {
    grid-template-columns: 1fr;
  }

  .form-section {
    padding: 28px 22px;
  }
}

@media (max-width: 520px) {
  .hero {
    padding:
      130px 17px
      75px;
  }

  .content-section {
    padding:
      75px 17px
      90px;
  }

  .schedule-card {
    padding: 22px;
  }

  .schedule-card__main strong {
    font-size: 2.4rem;
  }

  .academy-details {
    grid-template-columns: 1fr;
  }

  .guardian-card {
    padding: 17px;
  }

  .guardian-card__header {
    flex-direction: column;
  }

  .form-progress__item {
    padding: 12px;
  }

  .success-card {
    padding: 35px 22px;
  }
}
</style>
