<template>
  <main class="inscriptions-page">
    <!-- =====================================================
         CABECERA
    ====================================================== -->
    <section class="page-header">
      <div class="page-header__intro">
        <span class="eyebrow">GESTIÓN ACADÉMICA</span>

        <h1>
          Inscripciones
          <span>de estudiantes.</span>
        </h1>

        <p>
          Revisa las solicitudes recibidas desde el sitio web,
          administra su proceso de admisión y matricula nuevos
          estudiantes en el Aula Virtual Amo Mi Voz.
        </p>
      </div>

      <div class="summary-grid">
        <article class="summary-card summary-card--highlight">
          <span>PENDIENTES</span>
          <strong>{{ pendingCount }}</strong>
          <small>Por revisar</small>
        </article>

        <article class="summary-card">
          <span>APROBADAS</span>
          <strong>{{ approvedCount }}</strong>
          <small>Listas para matrícula</small>
        </article>

        <article class="summary-card">
          <span>MATRICULADAS</span>
          <strong>{{ enrolledCount }}</strong>
          <small>Proceso completado</small>
        </article>
      </div>
    </section>

    <!-- =====================================================
         HERRAMIENTAS
    ====================================================== -->
    <section class="toolbar">
      <div class="search-box">
        <span class="search-box__icon">⌕</span>

        <input
          v-model.trim="searchQuery"
          type="search"
          placeholder="Buscar estudiante, correo o teléfono..."
          aria-label="Buscar inscripción"
        />

        <button
          v-if="searchQuery"
          type="button"
          class="search-box__clear"
          aria-label="Limpiar búsqueda"
          @click="searchQuery = ''"
        >
          ×
        </button>
      </div>

      <button
        type="button"
        class="refresh-button"
        :disabled="isLoading"
        @click="loadInscriptions"
      >
        <span :class="{ rotating: isLoading }">↻</span>
        Actualizar
      </button>
    </section>

    <!-- =====================================================
         FILTROS
    ====================================================== -->
    <section class="filter-tabs">
      <button
        v-for="filter in filters"
        :key="filter.value"
        type="button"
        :class="{ active: activeFilter === filter.value }"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}

        <span>
          {{ getFilterCount(filter.value) }}
        </span>
      </button>
    </section>

    <!-- =====================================================
         MENSAJE GLOBAL
    ====================================================== -->
    <div
      v-if="pageSuccess"
      class="page-feedback page-feedback--success"
      role="status"
    >
      <span>✓</span>

      <div>
        <strong>Proceso completado</strong>
        <p>{{ pageSuccess }}</p>
      </div>

      <button
        type="button"
        aria-label="Cerrar mensaje"
        @click="pageSuccess = ''"
      >
        ×
      </button>
    </div>

    <!-- =====================================================
         CONTENIDO
    ====================================================== -->
    <section class="inscriptions-content">
      <!-- CARGANDO -->
      <div
        v-if="isLoading"
        class="state-card"
      >
        <div class="loader"></div>

        <strong>Cargando inscripciones</strong>

        <span>
          Consultando las solicitudes registradas.
        </span>
      </div>

      <!-- ERROR -->
      <div
        v-else-if="errorMessage"
        class="state-card state-card--error"
      >
        <div class="state-icon">!</div>

        <strong>
          No pudimos cargar las inscripciones
        </strong>

        <span>{{ errorMessage }}</span>

        <button
          type="button"
          class="button button--secondary"
          @click="loadInscriptions"
        >
          Intentar nuevamente
        </button>
      </div>

      <!-- SIN RESULTADOS -->
      <div
        v-else-if="filteredInscriptions.length === 0"
        class="state-card"
      >
        <div class="state-icon">♪</div>

        <strong>
          {{
            searchQuery
              ? 'No encontramos coincidencias'
              : 'No hay solicitudes aquí'
          }}
        </strong>

        <span>
          {{
            searchQuery
              ? 'Prueba con otro nombre, correo o teléfono.'
              : 'Las solicitudes de esta categoría aparecerán en este espacio.'
          }}
        </span>
      </div>

      <!-- LISTADO -->
      <div
        v-else
        class="inscriptions-grid"
      >
        <article
          v-for="inscription in filteredInscriptions"
          :key="inscription.id"
          class="inscription-card"
        >
          <!-- HEADER TARJETA -->
          <header class="inscription-card__header">
            <div class="student-avatar">
              {{ getInitials(inscription.name) }}
            </div>

            <div class="student-identity">
              <div class="student-identity__top">
                <h2>
                  {{ inscription.name }}
                </h2>

                <span
                  class="status-badge"
                  :class="`status-badge--${inscription.status}`"
                >
                  {{ getStatusLabel(inscription.status) }}
                </span>
              </div>

              <p>
                Solicitud #{{ inscription.id }}
                · {{ inscription.age }} años
                · {{ getInterestLabel(inscription.interest) }}
              </p>
            </div>
          </header>

          <!-- CUERPO -->
          <div class="inscription-card__body">
            <div class="info-grid">
              <div class="info-item">
                <small>CORREO</small>

                <a :href="`mailto:${inscription.email}`">
                  {{ inscription.email }}
                </a>
              </div>

              <div class="info-item">
                <small>TELÉFONO</small>

                <a :href="`tel:${inscription.phone}`">
                  {{ inscription.phone }}
                </a>
              </div>

              <div class="info-item">
                <small>EXPERIENCIA</small>

                <strong>
                  {{ getExperienceLabel(inscription.experience) }}
                </strong>
              </div>

              <div class="info-item">
                <small>DISPONIBILIDAD</small>

                <strong
                  :class="
                    inscription.availability === 'yes'
                      ? 'availability-ok'
                      : 'availability-warning'
                  "
                >
                  {{
                    inscription.availability === 'yes'
                      ? 'Puede asistir'
                      : 'Necesita conversar'
                  }}
                </strong>
              </div>
            </div>

            <div class="detail-section">
              <small>OBJETIVOS DEL ESTUDIANTE</small>

              <p>
                {{ inscription.goals || 'Sin información adicional.' }}
              </p>
            </div>

            <div
              v-if="inscription.guardianName"
              class="detail-section"
            >
              <small>DATOS DEL APODERADO</small>

              <div class="guardian-row">
                <strong>
                  {{ inscription.guardianName }}
                </strong>

                <a
                  v-if="inscription.guardianPhone"
                  :href="`tel:${inscription.guardianPhone}`"
                >
                  {{ inscription.guardianPhone }}
                </a>
              </div>
            </div>

            <div
              v-if="inscription.message"
              class="detail-section"
            >
              <small>MENSAJE ADICIONAL</small>

              <p>
                {{ inscription.message }}
              </p>
            </div>
          </div>

          <!-- ACCIONES -->
          <footer class="inscription-card__footer">
            <div class="received-date">
              <small>RECIBIDA</small>

              <span>
                {{ formatDate(inscription.createdAt) }}
              </span>
            </div>

            <div class="card-actions">
              <button
                v-if="inscription.status === 'pending'"
                type="button"
                class="button button--secondary"
                :disabled="updatingId === inscription.id"
                @click="markAsReviewed(inscription)"
              >
                {{
                  updatingId === inscription.id
                    ? 'Actualizando...'
                    : 'Marcar revisada'
                }}
              </button>

              <button
                v-if="
                  inscription.status === 'pending' ||
                  inscription.status === 'reviewed'
                "
                type="button"
                class="button button--approve"
                :disabled="updatingId === inscription.id"
                @click="approveInscription(inscription)"
              >
                Aprobar
              </button>

              <button
                v-if="
                  inscription.status === 'pending' ||
                  inscription.status === 'reviewed'
                "
                type="button"
                class="button button--reject"
                :disabled="updatingId === inscription.id"
                @click="rejectInscription(inscription)"
              >
                Rechazar
              </button>

              <button
                v-if="inscription.status === 'approved'"
                type="button"
                class="button button--primary"
                @click="openEnrollment(inscription)"
              >
                Matricular estudiante
                <span>→</span>
              </button>

              <div
                v-if="inscription.status === 'enrolled'"
                class="enrolled-label"
              >
                <span>✓</span>

                <div>
                  <strong>Matrícula completada</strong>

                  <small v-if="inscription.enrolledAt">
                    {{ formatDate(inscription.enrolledAt) }}
                  </small>
                </div>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </section>

    <!-- =====================================================
         MODAL MATRÍCULA
    ====================================================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedInscription"
          class="modal-backdrop"
          @click.self="closeEnrollment"
        >
          <section
            class="enrollment-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enrollment-title"
          >
            <!-- HEADER -->
            <header class="enrollment-modal__header">
              <div>
                <span class="eyebrow">
                  MATRÍCULA ACADÉMICA
                </span>

                <h2 id="enrollment-title">
                  Incorporar estudiante
                </h2>

                <p>
                  Confirma la clasificación vocal.
                  Al completar este proceso se creará
                  su perfil académico y su acceso personal
                  al Aula Virtual Amo Mi Voz.
                </p>
              </div>

              <button
                type="button"
                class="modal-close"
                :disabled="isEnrolling"
                aria-label="Cerrar matrícula"
                @click="closeEnrollment"
              >
                ×
              </button>
            </header>

            <!-- ESTUDIANTE -->
            <div class="student-preview">
              <div class="student-preview__avatar">
                {{ getInitials(selectedInscription.name) }}
              </div>

              <div class="student-preview__data">
                <strong>
                  {{ selectedInscription.name }}
                </strong>

                <span>
                  {{ selectedInscription.email }}
                </span>

                <small>
                  {{ selectedInscription.age }} años
                  ·
                  {{ getInterestLabel(selectedInscription.interest) }}
                </small>
              </div>

              <span class="approved-indicator">
                APROBADA
              </span>
            </div>

            <!-- FORMULARIO -->
            <div class="enrollment-form">
              <div class="field-group">
                <label>
                  Clasificación vocal
                </label>

                <p>
                  Selecciona la cuerda principal del estudiante.
                  Esta clasificación podrá modificarse posteriormente
                  desde su ficha académica.
                </p>

                <div class="voice-options">
                  <button
                    v-for="voice in voices"
                    :key="voice"
                    type="button"
                    :disabled="isEnrolling"
                    :class="{
                      selected: enrollmentVoice === voice
                    }"
                    @click="enrollmentVoice = voice"
                  >
                    <span>
                      {{ getVoiceInitial(voice) }}
                    </span>

                    {{ voice }}
                  </button>
                </div>
              </div>

              <Transition name="fade">
                <div
                  v-if="enrollmentVoice"
                  class="voice-selection"
                >
                  <small>
                    CLASIFICACIÓN SELECCIONADA
                  </small>

                  <strong>
                    {{ enrollmentVoice }}
                  </strong>
                </div>
              </Transition>

              <!-- DATOS CLASE -->
              <div class="enrollment-information">
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

              <!-- QUÉ OCURRIRÁ -->
              <div class="enrollment-process">
                <span class="enrollment-process__title">
                  AL CONFIRMAR
                </span>

                <div class="process-step">
                  <span>1</span>
                  <p>
                    Se creará el estudiante en la base académica.
                  </p>
                </div>

                <div class="process-step">
                  <span>2</span>
                  <p>
                    Se generará su usuario personal mediante
                    Supabase Auth.
                  </p>
                </div>

                <div class="process-step">
                  <span>3</span>
                  <p>
                    Su cuenta quedará vinculada con su perfil
                    del Aula Virtual.
                  </p>
                </div>

                <div class="process-step">
                  <span>4</span>
                  <p>
                    La solicitud cambiará automáticamente a
                    Matriculada.
                  </p>
                </div>
              </div>

              <!-- ERROR -->
              <div
                v-if="enrollmentError"
                class="enrollment-feedback enrollment-feedback--error"
                role="alert"
              >
                <span>!</span>

                <div>
                  <strong>
                    No pudimos completar la matrícula
                  </strong>

                  <p>
                    {{ enrollmentError }}
                  </p>
                </div>
              </div>

              <!-- ÉXITO -->
              <div
                v-if="enrollmentSuccess"
                class="enrollment-feedback enrollment-feedback--success"
                role="status"
              >
                <span>✓</span>

                <div>
                  <strong>
                    Matrícula completada
                  </strong>

                  <p>
                    {{ enrollmentSuccess }}
                  </p>
                </div>
              </div>
            </div>

            <!-- FOOTER -->
            <footer class="enrollment-modal__footer">
              <button
                type="button"
                class="button button--secondary button--modal"
                :disabled="isEnrolling"
                @click="closeEnrollment"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="button button--primary button--large button--modal"
                :disabled="
                  !enrollmentVoice ||
                  isEnrolling ||
                  Boolean(enrollmentSuccess)
                "
                @click="prepareEnrollment"
              >
                <template v-if="isEnrolling">
                  <span class="button-spinner"></span>
                  Matriculando...
                </template>

                <template v-else-if="enrollmentSuccess">
                  Matrícula completada
                  <span>✓</span>
                </template>

                <template v-else>
                  Confirmar matrícula
                  <span>→</span>
                </template>
              </button>
            </footer>
          </section>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'

import {
  enrollInscription,
  fetchInscriptions,
  updateInscriptionStatus
} from '@/services/inscriptionService'

/* =========================================================
   ESTADO GENERAL
========================================================= */

const inscriptions = ref([])

const isLoading = ref(true)
const errorMessage = ref('')
const pageSuccess = ref('')

const activeFilter = ref('all')
const searchQuery = ref('')

const updatingId = ref(null)

/* =========================================================
   MATRÍCULA
========================================================= */

const selectedInscription = ref(null)
const enrollmentVoice = ref('')

const isEnrolling = ref(false)
const enrollmentError = ref('')
const enrollmentSuccess = ref('')

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const voices = [
  'Soprano',
  'Alto',
  'Tenor',
  'Bajo'
]

const filters = [
  {
    label: 'Todas',
    value: 'all'
  },
  {
    label: 'Pendientes',
    value: 'pending'
  },
  {
    label: 'Revisadas',
    value: 'reviewed'
  },
  {
    label: 'Aprobadas',
    value: 'approved'
  },
  {
    label: 'Matriculadas',
    value: 'enrolled'
  },
  {
    label: 'Rechazadas',
    value: 'rejected'
  }
]

/* =========================================================
   CONTADORES
========================================================= */

const pendingCount = computed(() =>
  inscriptions.value.filter(
    item => item.status === 'pending'
  ).length
)

const approvedCount = computed(() =>
  inscriptions.value.filter(
    item => item.status === 'approved'
  ).length
)

const enrolledCount = computed(() =>
  inscriptions.value.filter(
    item => item.status === 'enrolled'
  ).length
)

/* =========================================================
   FILTRO + BÚSQUEDA
========================================================= */

const filteredInscriptions = computed(() => {
  let result = [...inscriptions.value]

  if (activeFilter.value !== 'all') {
    result = result.filter(
      item =>
        item.status === activeFilter.value
    )
  }

  const query =
    searchQuery.value
      .trim()
      .toLowerCase()

  if (!query) {
    return result
  }

  return result.filter(item => {
    const searchable = [
      item.name,
      item.email,
      item.phone,
      item.guardianName,
      item.guardianPhone,
      item.interest
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()

    return searchable.includes(query)
  })
})

function getFilterCount(status) {
  if (status === 'all') {
    return inscriptions.value.length
  }

  return inscriptions.value.filter(
    item => item.status === status
  ).length
}

/* =========================================================
   CARGAR INSCRIPCIONES
========================================================= */

async function loadInscriptions() {
  isLoading.value = true
  errorMessage.value = ''

  try {
    inscriptions.value =
      await fetchInscriptions()
  } catch (error) {
    console.error(
      'Error cargando inscripciones:',
      error
    )

    errorMessage.value =
      'No pudimos consultar las solicitudes registradas. Comprueba tu conexión e inténtalo nuevamente.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   CAMBIAR ESTADO
========================================================= */

async function changeStatus(
  inscription,
  status
) {
  if (
    !inscription?.id ||
    updatingId.value
  ) {
    return
  }

  updatingId.value = inscription.id
  errorMessage.value = ''
  pageSuccess.value = ''

  try {
    const updated =
      await updateInscriptionStatus(
        inscription.id,
        status
      )

    replaceInscription(updated)

    return updated
  } catch (error) {
    console.error(
      'Error actualizando inscripción:',
      error
    )

    errorMessage.value =
      'No pudimos actualizar el estado de la solicitud.'

    return null
  } finally {
    updatingId.value = null
  }
}

async function markAsReviewed(inscription) {
  const updated =
    await changeStatus(
      inscription,
      'reviewed'
    )

  if (updated) {
    pageSuccess.value =
      `La solicitud de ${inscription.name} fue marcada como revisada.`
  }
}

async function approveInscription(inscription) {
  const updated =
    await changeStatus(
      inscription,
      'approved'
    )

  if (updated) {
    pageSuccess.value =
      `La solicitud de ${inscription.name} fue aprobada y ya está lista para matrícula.`
  }
}

async function rejectInscription(inscription) {
  const accepted = window.confirm(
    `¿Quieres rechazar la solicitud de ${inscription.name}?`
  )

  if (!accepted) {
    return
  }

  const updated =
    await changeStatus(
      inscription,
      'rejected'
    )

  if (updated) {
    pageSuccess.value =
      `La solicitud de ${inscription.name} fue rechazada.`
  }
}

/* =========================================================
   ABRIR / CERRAR MATRÍCULA
========================================================= */

function openEnrollment(inscription) {
  if (
    !inscription ||
    inscription.status !== 'approved'
  ) {
    return
  }

  selectedInscription.value =
    inscription

  enrollmentVoice.value = ''
  enrollmentError.value = ''
  enrollmentSuccess.value = ''

  document.body.style.overflow =
    'hidden'
}

function closeEnrollment() {
  if (isEnrolling.value) {
    return
  }

  selectedInscription.value = null

  enrollmentVoice.value = ''
  enrollmentError.value = ''
  enrollmentSuccess.value = ''

  document.body.style.overflow = ''
}

/* =========================================================
   MATRÍCULA REAL
========================================================= */

async function prepareEnrollment() {
  if (
    !selectedInscription.value ||
    !enrollmentVoice.value ||
    isEnrolling.value
  ) {
    return
  }

  const inscription =
    selectedInscription.value

  const voice =
    enrollmentVoice.value

  isEnrolling.value = true

  enrollmentError.value = ''
  enrollmentSuccess.value = ''
  pageSuccess.value = ''

  try {
    const result =
      await enrollInscription({
        inscriptionId:
          inscription.id,

        voice
      })

    /*
     * La Edge Function realiza:
     *
     * 1. Creación del estudiante.
     * 2. Creación/invitación Auth.
     * 3. Vinculación del profile.
     * 4. Cambio de inscripción a enrolled.
     */

    const updated = {
      ...inscription,

      status: 'enrolled',

      enrolledAt:
        result?.inscription
          ?.enrolled_at ??
        new Date().toISOString()
    }

    replaceInscription(updated)

    enrollmentSuccess.value =
      `${inscription.name} fue matriculado correctamente. Su perfil académico y su cuenta del Aula Virtual fueron creados.`

    /*
     * Volvemos a consultar Supabase.
     * Así la interfaz refleja el estado
     * real guardado en la base.
     */

    try {
      inscriptions.value =
        await fetchInscriptions()
    } catch (refreshError) {
      console.warn(
        'La matrícula se completó, pero no fue posible refrescar inmediatamente la lista:',
        refreshError
      )
    }

    /*
     * Dejamos visible la confirmación
     * antes de cerrar el modal.
     */

    window.setTimeout(() => {
      if (!selectedInscription.value) {
        return
      }

      selectedInscription.value = null
      enrollmentVoice.value = ''
      enrollmentError.value = ''
      enrollmentSuccess.value = ''

      document.body.style.overflow = ''

      pageSuccess.value =
        `${inscription.name} fue matriculado correctamente en Amo Mi Voz.`
    }, 2200)

  } catch (error) {
    console.error(
      'Error matriculando estudiante:',
      error
    )

    enrollmentError.value =
      getEnrollmentErrorMessage(error)
  } finally {
    isEnrolling.value = false
  }
}

/* =========================================================
   HELPERS
========================================================= */

function replaceInscription(updated) {
  if (!updated?.id) {
    return
  }

  const index =
    inscriptions.value.findIndex(
      item => item.id === updated.id
    )

  if (index === -1) {
    return
  }

  inscriptions.value[index] =
    updated
}

function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(word =>
      word.charAt(0)
    )
    .join('')
    .toUpperCase()
}

function getVoiceInitial(voice) {
  const initials = {
    Soprano: 'S',
    Alto: 'A',
    Tenor: 'T',
    Bajo: 'B'
  }

  return initials[voice] ?? '?'
}

function getStatusLabel(status) {
  const labels = {
    pending: 'Nueva',
    reviewed: 'Revisada',
    approved: 'Aprobada',
    rejected: 'Rechazada',
    enrolled: 'Matriculada'
  }

  return labels[status] ?? status
}

function getInterestLabel(value) {
  const labels = {
    singing: 'Canto',
    choir: 'Coro',
    musical: 'Teatro musical',
    technique: 'Técnica vocal',
    general: 'Formación musical'
  }

  return labels[value] ?? value ?? 'Sin especificar'
}

function getExperienceLabel(value) {
  const labels = {
    none: 'Sin experiencia',
    beginner: 'Inicial',
    intermediate: 'Intermedia',
    advanced: 'Avanzada'
  }

  return labels[value] ?? value ?? 'Sin especificar'
}

function formatDate(date) {
  if (!date) {
    return ''
  }

  const parsed = new Date(date)

  if (Number.isNaN(parsed.getTime())) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  ).format(parsed)
}

function getEnrollmentErrorMessage(error) {
  const message =
    error?.message ??
    error?.context?.message ??
    ''

  const normalized =
    String(message).toLowerCase()

  if (
    normalized.includes('already') &&
    normalized.includes('registered')
  ) {
    return 'Ya existe una cuenta registrada con este correo electrónico.'
  }

  if (
    normalized.includes('already') &&
    normalized.includes('enrolled')
  ) {
    return 'Esta inscripción ya fue matriculada anteriormente.'
  }

  if (
    normalized.includes('approved')
  ) {
    return 'La solicitud debe estar aprobada antes de realizar la matrícula.'
  }

  if (
    normalized.includes('unauthorized') ||
    normalized.includes('jwt') ||
    normalized.includes('401')
  ) {
    return 'Tu sesión del Aula Virtual no pudo ser validada. Cierra sesión, vuelve a ingresar e inténtalo nuevamente.'
  }

  if (
    normalized.includes('forbidden') ||
    normalized.includes('teacher') ||
    normalized.includes('403')
  ) {
    return 'Tu usuario no tiene permisos de profesor para realizar matrículas.'
  }

  if (
    normalized.includes('duplicate') ||
    normalized.includes('unique')
  ) {
    return 'Ya existe un registro asociado a este estudiante.'
  }

  if (message) {
    return message
  }

  return 'Ocurrió un problema al crear la matrícula. Revisa la consola del navegador para obtener más información.'
}

/* =========================================================
   TECLADO
========================================================= */

function handleKeydown(event) {
  if (
    event.key === 'Escape' &&
    selectedInscription.value &&
    !isEnrolling.value
  ) {
    closeEnrollment()
  }
}

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(() => {
  loadInscriptions()

  window.addEventListener(
    'keydown',
    handleKeydown
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'keydown',
    handleKeydown
  )

  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.inscriptions-page {
  min-height: 100vh;
  color: #fff;
}

.eyebrow {
  display: block;
  color: variables.$color-primary;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.2em;
}

/* =========================================================
   HEADER
========================================================= */

.page-header {
  display: grid;
  gap: 36px;
  padding-bottom: 34px;
  border-bottom: 1px solid #252525;

  @include mixins.respond-to(md) {
    grid-template-columns:
      minmax(0, 1fr)
      auto;
    align-items: end;
  }
}

.page-header__intro {
  max-width: 760px;
}

.page-header h1 {
  margin: 14px 0 18px;
  font-size: clamp(2.7rem, 5vw, 5rem);
  line-height: 0.94;
  letter-spacing: -0.05em;
}

.page-header h1 span {
  display: block;
  color: variables.$color-primary;
}

.page-header p {
  max-width: 680px;
  margin: 0;
  color: #8c8c8c;
  line-height: 1.75;
}

/* =========================================================
   RESUMEN
========================================================= */

.summary-grid {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(120px, 1fr));
  gap: 10px;
}

.summary-card {
  min-width: 135px;
  padding: 18px;
  border: 1px solid #292929;
  border-radius: 15px;
  background: #101010;
}

.summary-card--highlight {
  border-color:
    rgba(212, 175, 55, 0.28);
  background:
    rgba(212, 175, 55, 0.035);
}

.summary-card span,
.summary-card strong,
.summary-card small {
  display: block;
}

.summary-card span {
  color: #666;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.summary-card strong {
  margin: 5px 0 2px;
  color: variables.$color-primary;
  font-size: 2rem;
}

.summary-card small {
  color: #606060;
  font-size: 0.58rem;
}

/* =========================================================
   TOOLBAR
========================================================= */

.toolbar {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 560px;
}

.search-box input {
  width: 100%;
  min-height: 44px;
  padding:
    0 44px
    0 42px;
  border: 1px solid #292929;
  border-radius: 11px;
  outline: none;
  color: #eee;
  background: #101010;
  font: inherit;
  font-size: 0.73rem;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.search-box input:focus {
  border-color:
    rgba(212, 175, 55, 0.55);
  box-shadow:
    0 0 0 3px
    rgba(212, 175, 55, 0.05);
}

.search-box__icon {
  position: absolute;
  top: 50%;
  left: 15px;
  color: #777;
  transform: translateY(-50%);
}

.search-box__clear {
  position: absolute;
  top: 50%;
  right: 12px;
  border: 0;
  color: #777;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
  transform: translateY(-50%);
}

.refresh-button {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 0 15px;
  border: 1px solid #303030;
  border-radius: 10px;
  color: #999;
  background: #101010;
  font: inherit;
  font-size: 0.67rem;
  font-weight: 800;
  cursor: pointer;
}

.refresh-button:hover:not(:disabled) {
  color: #fff;
  border-color: #484848;
}

.rotating {
  display: inline-block;
  animation: spin 0.7s linear infinite;
}

/* =========================================================
   FILTROS
========================================================= */

.filter-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding: 20px 0 26px;
}

.filter-tabs button {
  display: flex;
  flex: 0 0 auto;
  gap: 8px;
  align-items: center;
  padding: 10px 15px;
  border: 1px solid #292929;
  border-radius: 999px;
  color: #818181;
  background: #101010;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 800;
  cursor: pointer;
}

.filter-tabs button span {
  display: grid;
  min-width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 50%;
  background: #1c1c1c;
  font-size: 0.57rem;
}

.filter-tabs button:hover {
  color: #fff;
  border-color: #444;
}

.filter-tabs button.active {
  color: #090909;
  border-color: variables.$color-primary;
  background: variables.$color-primary;
}

.filter-tabs button.active span {
  background: rgba(0, 0, 0, 0.15);
}

/* =========================================================
   FEEDBACK
========================================================= */

.page-feedback {
  display: flex;
  gap: 13px;
  align-items: center;
  margin-bottom: 20px;
  padding: 14px 17px;
  border-radius: 12px;
}

.page-feedback--success {
  border: 1px solid
    rgba(73, 190, 111, 0.25);
  background:
    rgba(73, 190, 111, 0.06);
}

.page-feedback > span {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #07140b;
  background: #71d493;
  font-weight: 900;
}

.page-feedback div {
  flex: 1;
}

.page-feedback strong,
.page-feedback p {
  display: block;
  margin: 0;
}

.page-feedback strong {
  color: #8ce0a9;
  font-size: 0.75rem;
}

.page-feedback p {
  margin-top: 3px;
  color: #819a89;
  font-size: 0.67rem;
}

.page-feedback button {
  border: 0;
  color: #78857c;
  background: transparent;
  font-size: 1.2rem;
  cursor: pointer;
}

/* =========================================================
   TARJETAS
========================================================= */

.inscriptions-grid {
  display: grid;
  gap: 18px;
}

.inscription-card {
  overflow: hidden;
  border: 1px solid #282828;
  border-radius: 18px;
  background: #101010;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.inscription-card:hover {
  transform: translateY(-2px);
  border-color: #393939;
  box-shadow:
    0 18px 45px
    rgba(0, 0, 0, 0.2);
}

.inscription-card__header {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 22px 24px;
  border-bottom: 1px solid #242424;
}

.student-avatar {
  display: grid;
  width: 52px;
  height: 52px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid
    rgba(212, 175, 55, 0.3);
  border-radius: 50%;
  color: variables.$color-primary;
  background:
    rgba(212, 175, 55, 0.05);
  font-size: 0.72rem;
  font-weight: 900;
}

.student-identity {
  min-width: 0;
  flex: 1;
}

.student-identity__top {
  display: flex;
  gap: 14px;
  align-items: center;
  justify-content: space-between;
}

.student-identity h2 {
  margin: 0;
  font-size: 1.05rem;
}

.student-identity p {
  margin: 6px 0 0;
  color: #707070;
  font-size: 0.68rem;
}

/* =========================================================
   STATUS
========================================================= */

.status-badge {
  flex: 0 0 auto;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.54rem;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status-badge--pending {
  color: variables.$color-primary;
  background:
    rgba(212, 175, 55, 0.09);
}

.status-badge--reviewed {
  color: #9fbfff;
  background:
    rgba(80, 120, 220, 0.12);
}

.status-badge--approved {
  color: #70d494;
  background:
    rgba(70, 190, 100, 0.1);
}

.status-badge--rejected {
  color: #e88585;
  background:
    rgba(210, 70, 70, 0.1);
}

.status-badge--enrolled {
  color: #f1f1f1;
  background: #292929;
}

/* =========================================================
   INFORMACIÓN
========================================================= */

.inscription-card__body {
  padding: 24px;
}

.info-grid {
  display: grid;
  gap: 20px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(4, minmax(0, 1fr));
  }
}

.info-item small,
.info-item strong,
.info-item a {
  display: block;
}

.info-item small,
.detail-section small,
.received-date small {
  margin-bottom: 6px;
  color: #616161;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.info-item strong,
.info-item a {
  color: #d8d8d8;
  font-size: 0.73rem;
  text-decoration: none;
  overflow-wrap: anywhere;
}

.info-item a:hover {
  color: variables.$color-primary;
}

.availability-ok {
  color: #72ce92 !important;
}

.availability-warning {
  color: #e8bd6b !important;
}

.detail-section {
  margin-top: 22px;
  padding-top: 20px;
  border-top: 1px solid #242424;
}

.detail-section p {
  max-width: 880px;
  margin: 0;
  color: #999;
  font-size: 0.76rem;
  line-height: 1.7;
}

.guardian-row {
  display: flex;
  gap: 15px;
  align-items: center;
  flex-wrap: wrap;
}

.guardian-row strong {
  font-size: 0.76rem;
}

.guardian-row a {
  color: variables.$color-primary;
  font-size: 0.7rem;
  text-decoration: none;
}

/* =========================================================
   FOOTER TARJETA
========================================================= */

.inscription-card__footer {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-top: 1px solid #242424;
  background: #0d0d0d;
}

.received-date small,
.received-date span {
  display: block;
}

.received-date span {
  color: #6c6c6c;
  font-size: 0.65rem;
}

.card-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.enrolled-label {
  display: flex;
  gap: 9px;
  align-items: center;
  color: #75cf94;
}

.enrolled-label > span {
  display: grid;
  width: 27px;
  height: 27px;
  place-items: center;
  border-radius: 50%;
  color: #07130b;
  background: #75cf94;
  font-size: 0.65rem;
  font-weight: 900;
}

.enrolled-label strong,
.enrolled-label small {
  display: block;
}

.enrolled-label strong {
  font-size: 0.67rem;
}

.enrolled-label small {
  margin-top: 2px;
  color: #5c7a66;
  font-size: 0.55rem;
}

/* =========================================================
   BOTONES
========================================================= */

.button {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  min-height: 36px;
  padding: 9px 14px;
  border-radius: 8px;
  font: inherit;
  font-size: 0.65rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    opacity 0.2s ease;
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.button--secondary {
  border: 1px solid #353535;
  color: #aaa;
  background: transparent;
}

.button--approve {
  border: 1px solid #365f45;
  color: #84d7a2;
  background:
    rgba(60, 160, 90, 0.08);
}

.button--reject {
  border: 1px solid #543333;
  color: #d98b8b;
  background:
    rgba(180, 60, 60, 0.06);
}

.button--primary {
  border: 1px solid
    variables.$color-primary;
  color: #090909;
  background:
    variables.$color-primary;
}

.button--large {
  min-height: 44px;
  padding-right: 20px;
  padding-left: 20px;
}

/* =========================================================
   ESTADOS
========================================================= */

.state-card {
  display: grid;
  gap: 10px;
  justify-items: center;
  padding: 55px 30px;
  border: 1px solid #292929;
  border-radius: 18px;
  color: #777;
  text-align: center;
  background: #101010;
}

.state-card strong {
  color: #ddd;
}

.state-card span {
  max-width: 420px;
  font-size: 0.75rem;
  line-height: 1.6;
}

.state-card--error strong {
  color: #ff9292;
}

.state-icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border: 1px solid
    rgba(212, 175, 55, 0.25);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 1.3rem;
}

.loader {
  width: 28px;
  height: 28px;
  border: 2px solid #292929;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   MODAL
========================================================= */

.modal-backdrop {
  position: fixed;
  z-index: 9999;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(9px);
}

.enrollment-modal {
  width: min(760px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  border: 1px solid #303030;
  border-radius: 20px;
  color: #fff;
  background: #101010;
  box-shadow:
    0 40px 100px
    rgba(0, 0, 0, 0.65);
}

.enrollment-modal__header {
  display: flex;
  gap: 25px;
  justify-content: space-between;
  padding: 27px;
  border-bottom: 1px solid #292929;
}

.enrollment-modal__header h2 {
  margin: 10px 0 7px;
  font-size:
    clamp(1.7rem, 4vw, 2.3rem);
}

.enrollment-modal__header p {
  max-width: 540px;
  margin: 0;
  color: #777;
  font-size: 0.75rem;
  line-height: 1.6;
}

.modal-close {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #333;
  border-radius: 50%;
  color: #aaa;
  background: transparent;
  font-size: 1.4rem;
  cursor: pointer;
}

.modal-close:hover:not(:disabled) {
  color: variables.$color-primary;
  border-color:
    variables.$color-primary;
}

/* =========================================================
   PREVIEW
========================================================= */

.student-preview {
  display: flex;
  gap: 15px;
  align-items: center;
  margin: 25px 27px 0;
  padding: 17px;
  border: 1px solid #292929;
  border-radius: 13px;
  background: #0c0c0c;
}

.student-preview__avatar {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #090909;
  background:
    variables.$color-primary;
  font-size: 0.7rem;
  font-weight: 900;
}

.student-preview__data {
  min-width: 0;
  flex: 1;
}

.student-preview__data strong,
.student-preview__data span,
.student-preview__data small {
  display: block;
}

.student-preview__data span {
  margin-top: 3px;
  color: #919191;
  font-size: 0.7rem;
  overflow-wrap: anywhere;
}

.student-preview__data small {
  margin-top: 4px;
  color: #5d5d5d;
  font-size: 0.61rem;
}

.approved-indicator {
  padding: 6px 9px;
  border-radius: 999px;
  color: #75d397;
  background:
    rgba(70, 190, 100, 0.09);
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

/* =========================================================
   FORM MATRÍCULA
========================================================= */

.enrollment-form {
  padding: 27px;
}

.field-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
}

.field-group > p {
  max-width: 600px;
  margin: 6px 0 17px;
  color: #707070;
  font-size: 0.7rem;
  line-height: 1.55;
}

.voice-options {
  display: grid;
  grid-template-columns:
    repeat(4, 1fr);
  gap: 9px;
}

.voice-options button {
  display: grid;
  gap: 8px;
  justify-items: center;
  padding: 17px 10px;
  border: 1px solid #2d2d2d;
  border-radius: 12px;
  color: #8a8a8a;
  background: #0c0c0c;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
}

.voice-options button span {
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  border: 1px solid #343434;
  border-radius: 50%;
  font-size: 0.64rem;
}

.voice-options button:hover:not(:disabled) {
  color: #fff;
  border-color: #555;
}

.voice-options button.selected {
  color: variables.$color-primary;
  border-color:
    variables.$color-primary;
  background:
    rgba(212, 175, 55, 0.06);
}

.voice-options button.selected span {
  color: #090909;
  border-color:
    variables.$color-primary;
  background:
    variables.$color-primary;
}

.voice-selection {
  margin-top: 14px;
  padding: 13px 15px;
  border: 1px solid
    rgba(212, 175, 55, 0.2);
  border-radius: 10px;
  background:
    rgba(212, 175, 55, 0.035);
}

.voice-selection small,
.voice-selection strong {
  display: block;
}

.voice-selection small {
  color: #756c4c;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.voice-selection strong {
  margin-top: 3px;
  color: variables.$color-primary;
  font-size: 0.8rem;
}

/* =========================================================
   INFORMACIÓN MATRÍCULA
========================================================= */

.enrollment-information {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #292929;
}

.enrollment-information div {
  padding: 14px;
  border: 1px solid #292929;
  border-radius: 10px;
  background: #0c0c0c;
}

.enrollment-information small,
.enrollment-information strong {
  display: block;
}

.enrollment-information small {
  margin-bottom: 5px;
  color: #555;
  font-size: 0.51rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.enrollment-information strong {
  font-size: 0.7rem;
}

/* =========================================================
   PROCESO
========================================================= */

.enrollment-process {
  margin-top: 20px;
  padding: 17px;
  border: 1px solid #292929;
  border-radius: 12px;
  background: #0c0c0c;
}

.enrollment-process__title {
  display: block;
  margin-bottom: 13px;
  color: #5d5d5d;
  font-size: 0.51rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.process-step {
  display: flex;
  gap: 11px;
  align-items: flex-start;
}

.process-step + .process-step {
  margin-top: 10px;
}

.process-step > span {
  display: grid;
  width: 23px;
  height: 23px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #353535;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
}

.process-step p {
  margin: 3px 0 0;
  color: #858585;
  font-size: 0.67rem;
  line-height: 1.5;
}

/* =========================================================
   FEEDBACK MATRÍCULA
========================================================= */

.enrollment-feedback {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  padding: 15px;
  border-radius: 11px;
}

.enrollment-feedback > span {
  display: grid;
  width: 27px;
  height: 27px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  font-size: 0.65rem;
  font-weight: 900;
}

.enrollment-feedback strong,
.enrollment-feedback p {
  display: block;
  margin: 0;
}

.enrollment-feedback strong {
  font-size: 0.7rem;
}

.enrollment-feedback p {
  margin-top: 4px;
  font-size: 0.65rem;
  line-height: 1.55;
}

.enrollment-feedback--error {
  border: 1px solid
    rgba(210, 70, 70, 0.25);
  background:
    rgba(210, 70, 70, 0.06);
}

.enrollment-feedback--error > span {
  color: #190707;
  background: #e78484;
}

.enrollment-feedback--error strong {
  color: #ef9b9b;
}

.enrollment-feedback--error p {
  color: #a97777;
}

.enrollment-feedback--success {
  border: 1px solid
    rgba(70, 190, 100, 0.25);
  background:
    rgba(70, 190, 100, 0.06);
}

.enrollment-feedback--success > span {
  color: #07140b;
  background: #75d397;
}

.enrollment-feedback--success strong {
  color: #86daa3;
}

.enrollment-feedback--success p {
  color: #789282;
}

/* =========================================================
   FOOTER MODAL
========================================================= */

.enrollment-modal__footer {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  padding: 20px 27px;
  border-top: 1px solid #292929;
  background: #0c0c0c;
}

.button-spinner {
  width: 13px;
  height: 13px;
  border: 2px solid
    rgba(0, 0, 0, 0.25);
  border-top-color: #090909;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

/* =========================================================
   TRANSICIONES
========================================================= */

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-active .enrollment-modal,
.modal-leave-active .enrollment-modal {
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .enrollment-modal {
  opacity: 0;
  transform:
    translateY(12px)
    scale(0.985);
}

.modal-leave-to .enrollment-modal {
  opacity: 0;
  transform:
    translateY(8px)
    scale(0.99);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.18s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 850px) {
  .summary-grid {
    grid-template-columns:
      repeat(3, 1fr);
  }

  .info-grid {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

@media (max-width: 700px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .toolbar {
    flex-direction: column;
  }

  .search-box {
    max-width: none;
  }

  .refresh-button {
    min-height: 42px;
    justify-content: center;
  }

  .student-identity__top {
    align-items: flex-start;
    flex-direction: column;
    gap: 7px;
  }

  .inscription-card__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .card-actions {
    width: 100%;
  }

  .card-actions .button {
    flex: 1;
  }

  .voice-options {
    grid-template-columns:
      repeat(2, 1fr);
  }

  .enrollment-information {
    grid-template-columns: 1fr;
  }

  .approved-indicator {
    display: none;
  }
}

@media (max-width: 500px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .inscription-card__header,
  .inscription-card__body,
  .inscription-card__footer {
    padding-right: 18px;
    padding-left: 18px;
  }

  .modal-backdrop {
    padding: 10px;
  }

  .enrollment-modal {
    max-height:
      calc(100vh - 20px);
    border-radius: 15px;
  }

  .enrollment-modal__header,
  .enrollment-form {
    padding: 20px;
  }

  .student-preview {
    margin: 20px 20px 0;
  }

  .enrollment-modal__footer {
    padding: 17px 20px;
    flex-direction: column-reverse;
  }

  .enrollment-modal__footer .button {
    width: 100%;
  }
}
</style>
