<template>

  <main class="inscriptions-page">
    <!-- =====================================================*

*         CABECERA*

*    ====================================================== -->
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
    <!-- =====================================================*

*         HERRAMIENTAS*

*    ====================================================== -->
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
    <!-- =====================================================*

*         FILTROS*

*    ====================================================== -->
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
    <!-- =====================================================*

*         MENSAJE GLOBAL*

*    ====================================================== -->
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
    <!-- =====================================================*

*         CONTENIDO*

*    ====================================================== -->
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

                v-if="inscription.status !== 'enrolled'"

                type="button"

                class="button button--delete"

                :disabled="

                  updatingId === inscription.id ||

                  deletingId === inscription.id

                "

                @click="removeInscription(inscription)"

              >

                {{

                  deletingId === inscription.id

                    ? 'Eliminando...'

                    : 'Eliminar solicitud'

                }}

              </button>

              <button

                v-if="inscription.status === 'approved'"

                type="button"

                class="button button--primary"

                :disabled="deletingId === inscription.id"

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
    <!-- =====================================================*

*         MODAL MATRÍCULA*

*    ====================================================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="selectedInscription"
          class="modal-backdrop"
          @click.self="closeEnrollment"
        >
          <section
            class="enrollment-modal enrollment-modal--premium"
            role="dialog"
            aria-modal="true"
            aria-labelledby="enrollment-title"
          >
            <div class="enrollment-modal__accent"></div>

            <header class="enrollment-modal__header">
              <div class="enrollment-modal__heading">
                <div class="enrollment-kicker">
                  <span class="enrollment-kicker__dot"></span>
                  MATRÍCULA ACADÉMICA
                </div>
                <h2 id="enrollment-title">Incorporar estudiante</h2>
                <p>
                  Confirma los datos académicos antes de crear el perfil del
                  estudiante y habilitar su acceso personal al Aula Virtual.
                </p>
              </div>

              <button
                type="button"
                class="modal-close"
                :disabled="isEnrolling"
                aria-label="Cerrar matrícula"
                @click="closeEnrollment"
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>

            <div class="enrollment-modal__body">
              <section class="student-preview">
                <div class="student-preview__avatar">
                  {{ getInitials(selectedInscription.name) }}
                </div>

                <div class="student-preview__data">
                  <span class="student-preview__label">ESTUDIANTE</span>
                  <strong>{{ selectedInscription.name }}</strong>
                  <span>{{ selectedInscription.email }}</span>
                  <small>
                    {{ selectedInscription.age }} años
                    <span class="meta-separator">•</span>
                    {{ getInterestLabel(selectedInscription.interest) }}
                  </small>
                </div>

                <span class="approved-indicator">
                  <span>✓</span>
                  Aprobada
                </span>
              </section>

              <div class="enrollment-form">
                <section class="enrollment-section">
                  <div class="enrollment-section__heading">
                    <div>
                      <span class="section-number">01</span>
                      <div>
                        <small>CLASIFICACIÓN ACADÉMICA</small>
                        <h3>Clasificación vocal</h3>
                      </div>
                    </div>
                    <p>
                      Selecciona la cuerda principal. Podrás modificarla
                      posteriormente desde la ficha académica del estudiante.
                    </p>
                  </div>

                  <div class="voice-options" role="radiogroup" aria-label="Clasificación vocal">
                    <button
                      v-for="voice in voices"
                      :key="voice"
                      type="button"
                      role="radio"
                      :aria-checked="enrollmentVoice === voice"
                      :disabled="isEnrolling"
                      :class="{ selected: enrollmentVoice === voice }"
                      @click="enrollmentVoice = voice"
                    >
                      <span class="voice-options__initial">{{ getVoiceInitial(voice) }}</span>
                      <span class="voice-options__copy">
                        <small>CUERDA VOCAL</small>
                        <strong>{{ voice }}</strong>
                      </span>
                      <span class="voice-options__check">
                        {{ enrollmentVoice === voice ? '✓' : '○' }}
                      </span>
                    </button>
                  </div>

                  <Transition name="fade">
                    <div v-if="enrollmentVoice" class="voice-selection">
                      <span class="voice-selection__icon">✓</span>
                      <div>
                        <small>CLASIFICACIÓN SELECCIONADA</small>
                        <strong>{{ enrollmentVoice }}</strong>
                      </div>
                      <span class="voice-selection__status">Lista</span>
                    </div>
                  </Transition>
                </section>

                <section class="enrollment-section">
                  <div class="enrollment-section__heading enrollment-section__heading--compact">
                    <div>
                      <span class="section-number">02</span>
                      <div>
                        <small>CURSO ACTUAL</small>
                        <h3>Información de la matrícula</h3>
                      </div>
                    </div>
                  </div>

                  <div class="enrollment-information">
                    <article>
                      <span class="enrollment-information__icon">◷</span>
                      <div>
                        <small>CLASES</small>
                        <strong>Sábados · 16:00–18:00</strong>
                      </div>
                    </article>
                    <article>
                      <span class="enrollment-information__icon">⌖</span>
                      <div>
                        <small>SEDE</small>
                        <strong>Pueblito Artesanal La Calera</strong>
                      </div>
                    </article>
                  </div>
                </section>

                <section class="enrollment-process">
                  <div class="enrollment-process__intro">
                    <span class="section-number">03</span>
                    <div>
                      <small>PROCESO AUTOMÁTICO</small>
                      <h3>¿Qué ocurrirá al confirmar?</h3>
                      <p>
                        El sistema completará estos pasos para dejar al
                        estudiante listo para ingresar al Aula Virtual.
                      </p>
                    </div>
                  </div>

                  <div class="enrollment-process__timeline">
                    <div class="process-step">
                      <span class="process-step__number">1</span>
                      <div><strong>Perfil académico</strong><p>Se creará el estudiante en la base académica.</p></div>
                    </div>
                    <div class="process-step">
                      <span class="process-step__number">2</span>
                      <div><strong>Cuenta personal</strong><p>Se generará su usuario mediante Supabase Auth.</p></div>
                    </div>
                    <div class="process-step">
                      <span class="process-step__number">3</span>
                      <div><strong>Vinculación segura</strong><p>La cuenta quedará asociada a su perfil del Aula Virtual.</p></div>
                    </div>
                    <div class="process-step">
                      <span class="process-step__number">4</span>
                      <div><strong>Matrícula completada</strong><p>La solicitud cambiará automáticamente a Matriculada.</p></div>
                    </div>
                  </div>
                </section>

                <Transition name="fade">
                  <div v-if="enrollmentError" class="enrollment-feedback enrollment-feedback--error" role="alert">
                    <span>!</span>
                    <div><strong>No pudimos completar la matrícula</strong><p>{{ enrollmentError }}</p></div>
                  </div>
                </Transition>

                <Transition name="fade">
                  <div v-if="enrollmentSuccess" class="enrollment-feedback enrollment-feedback--success" role="status">
                    <span>✓</span>
                    <div><strong>Matrícula completada</strong><p>{{ enrollmentSuccess }}</p></div>
                  </div>
                </Transition>
              </div>
            </div>

            <footer class="enrollment-modal__footer">
              <div class="enrollment-modal__footer-copy">
                <span class="footer-lock">✓</span>
                <div>
                  <strong>Proceso académico seguro</strong>
                  <small>Revisa la clasificación vocal antes de continuar.</small>
                </div>
              </div>

              <div class="enrollment-modal__actions">
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
                  :disabled="!enrollmentVoice || isEnrolling || Boolean(enrollmentSuccess)"
                  @click="prepareEnrollment"
                >
                  <template v-if="isEnrolling">
                    <span class="button-spinner"></span>
                    Matriculando...
                  </template>
                  <template v-else-if="enrollmentSuccess">
                    Matrícula completada <span>✓</span>
                  </template>
                  <template v-else>
                    Confirmar matrícula <span>→</span>
                  </template>
                </button>
              </div>
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

  deleteInscription,

  enrollInscription,

  fetchInscriptions,

  updateInscriptionStatus

} from '@/services/inscriptionService'

/* =========================================================*

*   ESTADO GENERAL*

*========================================================= */

const inscriptions = ref([])

const isLoading = ref(true)

const errorMessage = ref('')

const pageSuccess = ref('')

const activeFilter = ref('all')

const searchQuery = ref('')

const updatingId = ref(null)

const deletingId = ref(null)

/* =========================================================*

*   MATRÍCULA*

*========================================================= */

const selectedInscription = ref(null)

const enrollmentVoice = ref('')

const isEnrolling = ref(false)

const enrollmentError = ref('')

const enrollmentSuccess = ref('')

/* =========================================================*

*   CONFIGURACIÓN*

*========================================================= */

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

/* =========================================================*

*   CONTADORES*

*========================================================= */

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

/* =========================================================*

*   FILTRO + BÚSQUEDA*

*========================================================= */

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

/* =========================================================*

*   CARGAR INSCRIPCIONES*

*========================================================= */

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

/* =========================================================*

*   CAMBIAR ESTADO*

*========================================================= */

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

/* =========================================================*

*   ELIMINAR SOLICITUD*

*========================================================= */

async function removeInscription(inscription) {

  if (

    !inscription?.id ||

    deletingId.value ||

    inscription.status === 'enrolled'

  ) {

    return

  }

  const accepted = window.confirm(

    `¿Eliminar la solicitud de ${inscription.name}?\n\n` +

    'Esta acción eliminará solamente esta solicitud de inscripción. ' +

    'No eliminará a un estudiante que ya haya sido matriculado mediante otra solicitud.\n\n' +

    'Esta acción no se puede deshacer.'

  )

  if (!accepted) {

    return

  }

  deletingId.value = inscription.id

  errorMessage.value = ''

  pageSuccess.value = ''

  try {

    await deleteInscription(inscription.id)

    inscriptions.value = inscriptions.value.filter(

      item => item.id !== inscription.id

    )

    pageSuccess.value =

      `La solicitud de ${inscription.name} fue eliminada correctamente.`

  } catch (error) {

    console.error(

      'Error eliminando inscripción:',

      error

    )

    errorMessage.value =

      'No pudimos eliminar la solicitud. Revisa tus permisos de Supabase e inténtalo nuevamente.'

  } finally {

    deletingId.value = null

  }

}

/* =========================================================*

*   ABRIR / CERRAR MATRÍCULA*

*========================================================= */

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

/* =========================================================*

*   MATRÍCULA REAL*

*========================================================= */

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

    /**

*     \* La Edge Function realiza:*

*     \**

*     \* 1. Creación del estudiante.*

*     \* 2. Creación/invitación Auth.*

*     \* 3. Vinculación del profile.*

*     \* 4. Cambio de inscripción a enrolled.*

*     */

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

    /**

*     \* Volvemos a consultar Supabase.*

*     \* Así la interfaz refleja el estado*

*     \* real guardado en la base.*

*     */

    try {

      inscriptions.value =

        await fetchInscriptions()

    } catch (refreshError) {

      console.warn(

        'La matrícula se completó, pero no fue posible refrescar inmediatamente la lista:',

        refreshError

      )

    }

    /**

*     \* Dejamos visible la confirmación*

*     \* antes de cerrar el modal.*

*     */

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

/* =========================================================*

*   HELPERS*

*========================================================= */

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

/* =========================================================*

*   TECLADO*

*========================================================= */

function handleKeydown(event) {

  if (

    event.key === 'Escape' &&

    selectedInscription.value &&

    !isEnrolling.value

  ) {

    closeEnrollment()

  }

}

/* =========================================================*

*   CICLO DE VIDA*

*========================================================= */

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

/* =========================================================*

*   BASE*

*========================================================= */

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

/* =========================================================*

*   HEADER*

*========================================================= */

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

/* =========================================================*

*   RESUMEN*

*========================================================= */

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

/* =========================================================*

*   TOOLBAR*

*========================================================= */

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

/* =========================================================*

*   FILTROS*

*========================================================= */

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

/* =========================================================*

*   FEEDBACK*

*========================================================= */

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

/* =========================================================*

*   TARJETAS*

*========================================================= */

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

/* =========================================================*

*   STATUS*

*========================================================= */

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

/* =========================================================*

*   INFORMACIÓN*

*========================================================= */

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

/* =========================================================*

*   FOOTER TARJETA*

*========================================================= */

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

/* =========================================================*

*   BOTONES*

*========================================================= */

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

.button--delete {

  border: 1px solid #e8c9cf;

  color: #a51f43;

  background: #fff7f8;

}

.button--delete:hover:not(:disabled) {

  border-color: #c85a72;

  color: #851633;

  background: #fff0f3;

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

/* =========================================================*

*   ESTADOS*

*========================================================= */

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

/* =========================================================*

*   MODAL*

*========================================================= */

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

/* =========================================================*

*   PREVIEW*

*========================================================= */

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

/* =========================================================*

*   FORM MATRÍCULA*

*========================================================= */

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

/* =========================================================*

*   INFORMACIÓN MATRÍCULA*

*========================================================= */

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

/* =========================================================*

*   PROCESO*

*========================================================= */

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

/* =========================================================*

*   FEEDBACK MATRÍCULA*

*========================================================= */

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

/* =========================================================*

*   FOOTER MODAL*

*========================================================= */

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

/* =========================================================*

*   TRANSICIONES*

*========================================================= */

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

/* =========================================================*

*   RESPONSIVE*

*========================================================= */

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



/* =========================================================*

*   SAAS LIGHT THEME OVERRIDES*

*   Sustituye los bloques negros por superficies claras.*

*========================================================= */

.page-header {

  border-bottom-color: #dfe4ea;

}

.page-header p {

  color: #667085;

}

.summary-card {

  border-color: #e0e5eb;

  background: #ffffff;

  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.045);

}

.summary-card:nth-child(1) {

  background: linear-gradient(145deg, #fffdf6, #ffffff);

}

.summary-card:nth-child(2) {

  background: linear-gradient(145deg, #fff8fa, #ffffff);

}

.summary-card:nth-child(3) {

  background: linear-gradient(145deg, #f6fbf8, #ffffff);

}

.summary-card--highlight {

  border-color: #ead79a;

  background: linear-gradient(145deg, #fff9e8, #ffffff);

}

.summary-card span,

.summary-card small {

  color: #737e8f;

}

.search-box input {

  border-color: #dce2e9;

  color: #17202a;

  background: #ffffff;

  box-shadow: 0 5px 16px rgba(15, 23, 42, 0.035);

}

.search-box input::placeholder {

  color: #98a2b3;

}

.search-box__icon,

.search-box__clear {

  color: #7b8798;

}

.refresh-button {

  border-color: #dce2e9;

  color: #475467;

  background: #ffffff;

}

.refresh-button:hover:not(:disabled) {

  color: #17202a;

  border-color: #bfc8d4;

  background: #f8fafc;

}

.filter-tabs button {

  border-color: #dfe4ea;

  color: #596579;

  background: #ffffff;

}

.filter-tabs button span {

  color: #596579;

  background: #eef1f5;

}

.filter-tabs button:hover {

  color: #17202a;

  border-color: #c3ccd7;

  background: #f8fafc;

}

.filter-tabs button.active {

  color: #5d4600;

  border-color: #e0b327;

  background: #f8d866;

  box-shadow: 0 5px 14px rgba(207, 163, 31, 0.16);

}

.filter-tabs button.active span {

  color: #5d4600;

  background: rgba(255, 255, 255, 0.62);

}

.inscription-card {

  border-color: #e0e5eb;

  background: #ffffff;

  box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);

}

.inscription-card:hover {

  border-color: #cbd4df;

  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.08);

}

.inscription-card__header,

.inscription-card__body,

.inscription-card__footer {

  border-color: #e8ecf1;

}

.student-avatar {

  color: #8a6811;

  border-color: #ead79a;

  background: #fff8df;

}

.student-identity h2,

.info-item strong,

.detail-section h3,

.enrollment-process__title,

.student-preview__data strong {

  color: #17202a;

}

.student-identity p,

.info-item span,

.info-item small,

.detail-section p,

.received-date,

.guardian-row,

.student-preview__data span {

  color: #6b7687;

}

.status-badge--enrolled,

.status-badge--approved {

  color: #216744;

  border-color: #c9e6d6;

  background: #eef9f2;

}

.status-badge--pending,

.status-badge--reviewed {

  color: #725700;

  border-color: #e9daa3;

  background: #fff8df;

}

.status-badge--rejected {

  color: #9c2f3d;

  border-color: #f0c9cf;

  background: #fff1f3;

}

.info-grid,

.detail-section,

.guardian-row,

.enrollment-information,

.enrollment-process {

  border-color: #e6eaf0;

}

.button--secondary {

  color: #344054;

  border-color: #d7dee7;

  background: #ffffff;

}

.button--secondary:hover:not(:disabled) {

  background: #f6f8fa;

}

.state-card {

  border-color: #dfe5ec;

  background: #ffffff;

}

.enrollment-modal {

  border-color: #dfe4ea;

  background: #ffffff;

  box-shadow: 0 28px 70px rgba(15, 23, 42, 0.22);

}

.enrollment-modal__header,

.enrollment-modal__footer,

.student-preview,

.field-group,

.voice-selection,

.process-step {

  border-color: #e5e9ef;

}

.student-preview,

.field-group,

.process-step {

  background: #f8fafc;

}

.enrollment-form input,

.enrollment-form textarea,

.enrollment-form select {

  color: #17202a;

  border-color: #d9e0e8;

  background: #ffffff;

}

.modal-backdrop {

  background: rgba(15, 23, 42, 0.42);

  backdrop-filter: blur(5px);

}


/* =========================================================
   MATRÍCULA PREMIUM · AMO MI VOZ
========================================================= */
.modal-backdrop {
  padding: clamp(14px, 2.5vw, 32px);
  background: rgba(8, 13, 24, 0.58);
  backdrop-filter: blur(14px) saturate(0.8);
}

.enrollment-modal--premium {
  position: relative;
  width: min(980px, 100%);
  max-height: calc(100dvh - 48px);
  overflow: hidden;
  border: 1px solid #dfe4ea;
  border-radius: 26px;
  color: #13233f;
  background: #f8fafc;
  box-shadow: 0 32px 90px rgba(15, 23, 42, .25), 0 8px 28px rgba(15, 23, 42, .08);
}

.enrollment-modal__accent {
  position: absolute;
  z-index: 4;
  top: 0;
  left: 0;
  width: 180px;
  height: 4px;
  background: variables.$color-primary;
}

.enrollment-modal--premium .enrollment-modal__header {
  position: relative;
  z-index: 3;
  align-items: flex-start;
  padding: 32px 36px 28px;
  border-bottom: 1px solid #e5e9ef;
  background: radial-gradient(circle at 88% 10%, rgba(212,175,55,.09), transparent 28%), #fff;
}

.enrollment-kicker {
  display: flex;
  gap: 9px;
  align-items: center;
  color: #9a7311;
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .18em;
}

.enrollment-kicker__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: variables.$color-primary;
  box-shadow: 0 0 0 5px rgba(212,175,55,.1);
}

.enrollment-modal--premium .enrollment-modal__header h2 {
  margin: 11px 0 9px;
  color: #10213f;
  font-size: clamp(2rem, 4vw, 3.35rem);
  line-height: .98;
  letter-spacing: -.045em;
}

.enrollment-modal--premium .enrollment-modal__header p {
  max-width: 650px;
  color: #667085;
  font-size: .78rem;
  line-height: 1.7;
}

.enrollment-modal--premium .modal-close {
  width: 43px;
  height: 43px;
  border-color: #d7dde5;
  color: #697586;
  background: #fff;
  box-shadow: 0 4px 12px rgba(15,23,42,.04);
}

.enrollment-modal--premium .modal-close:hover:not(:disabled) {
  color: #10213f;
  border-color: #c3cbd6;
  background: #f7f9fb;
  transform: rotate(4deg);
}

.enrollment-modal__body {
  max-height: calc(100dvh - 250px);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #d4af37 #eef1f5;
}

.enrollment-modal__body::-webkit-scrollbar { width: 8px; }
.enrollment-modal__body::-webkit-scrollbar-track { background: #eef1f5; }
.enrollment-modal__body::-webkit-scrollbar-thumb {
  border: 2px solid #eef1f5;
  border-radius: 999px;
  background: #d4af37;
}

.enrollment-modal--premium .student-preview {
  gap: 17px;
  margin: 24px 36px 0;
  padding: 19px 21px;
  border: 1px solid #e0e6ed;
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 7px 20px rgba(15,23,42,.045);
}

.enrollment-modal--premium .student-preview__avatar {
  width: 58px;
  height: 58px;
  color: #6c5107;
  border: 1px solid #e5c75e;
  background: linear-gradient(145deg, #f8d866, #e1b62a);
  box-shadow: 0 7px 18px rgba(207,163,31,.18);
  font-size: .82rem;
}

.student-preview__label {
  margin-bottom: 4px;
  color: #9a7311 !important;
  font-size: .51rem !important;
  font-weight: 900;
  letter-spacing: .14em;
}

.enrollment-modal--premium .student-preview__data strong { color: #15233d; font-size: .96rem; }
.enrollment-modal--premium .student-preview__data > span:not(.student-preview__label) { color: #667085; }
.enrollment-modal--premium .student-preview__data small { color: #8993a3; }
.meta-separator { padding: 0 4px; color: #c4a337; }

.enrollment-modal--premium .approved-indicator {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  padding: 8px 11px;
  color: #25714a;
  border: 1px solid #cde7d8;
  background: #eef9f3;
}

.enrollment-modal--premium .approved-indicator > span {
  display: grid;
  width: 17px;
  height: 17px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: #45a873;
  font-size: .48rem;
}

.enrollment-modal--premium .enrollment-form { padding: 24px 36px 32px; }

.enrollment-section,
.enrollment-modal--premium .enrollment-process {
  padding: 25px;
  border: 1px solid #e1e6ec;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 6px 18px rgba(15,23,42,.035);
}

.enrollment-section + .enrollment-section,
.enrollment-section + .enrollment-process,
.enrollment-process + .enrollment-feedback { margin-top: 16px; }

.enrollment-section__heading {
  display: flex;
  gap: 28px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.enrollment-section__heading > div,
.enrollment-process__intro {
  display: flex;
  gap: 13px;
  align-items: flex-start;
}

.enrollment-section__heading > p {
  max-width: 390px;
  margin: 2px 0 0;
  color: #7b8493;
  font-size: .69rem;
  line-height: 1.55;
}

.section-number {
  display: grid;
  width: 35px;
  height: 35px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #ead89d;
  border-radius: 50%;
  color: #a77c0c;
  background: #fffaf0;
  font-size: .58rem;
  font-weight: 900;
}

.enrollment-section__heading small,
.enrollment-process__intro small {
  display: block;
  margin: 1px 0 4px;
  color: #a77c0c;
  font-size: .5rem;
  font-weight: 900;
  letter-spacing: .13em;
}

.enrollment-section__heading h3,
.enrollment-process__intro h3 {
  margin: 0;
  color: #142440;
  font-size: 1.05rem;
  letter-spacing: -.02em;
}

.enrollment-section__heading--compact { margin-bottom: 17px; }

.enrollment-modal--premium .voice-options { gap: 11px; }

.enrollment-modal--premium .voice-options button {
  display: flex;
  min-width: 0;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border: 1px solid #dfe5ec;
  border-radius: 14px;
  color: #4f5c70;
  background: #f9fafb;
  text-align: left;
  transition: transform .2s ease, border-color .2s ease, background .2s ease, box-shadow .2s ease;
}

.enrollment-modal--premium .voice-options button:hover:not(:disabled) {
  color: #17233a;
  border-color: #d5bd67;
  background: #fffdf7;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(15,23,42,.06);
}

.enrollment-modal--premium .voice-options button.selected {
  color: #15233d;
  border-color: #d8ad20;
  background: linear-gradient(145deg, #fff9e7, #fff);
  box-shadow: inset 0 0 0 1px rgba(216,173,32,.18), 0 8px 22px rgba(207,163,31,.11);
}

.enrollment-modal--premium .voice-options__initial {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #dce2e9;
  border-radius: 11px;
  color: #677386;
  background: #fff;
  font-size: .68rem;
  font-weight: 900;
}

.enrollment-modal--premium .voice-options button.selected .voice-options__initial {
  color: #5d4600;
  border-color: #e1b629;
  background: #f8d866;
}

.voice-options__copy {
  display: block !important;
  min-width: 0;
  width: auto !important;
  height: auto !important;
  flex: 1;
  border: 0 !important;
  border-radius: 0 !important;
  background: transparent !important;
}

.voice-options__copy small,
.voice-options__copy strong { display: block; }
.voice-options__copy small {
  margin-bottom: 2px;
  color: #9aa3b1;
  font-size: .45rem;
  font-weight: 900;
  letter-spacing: .09em;
}
.voice-options__copy strong { color: #26364f; font-size: .72rem; }

.voice-options__check {
  display: grid !important;
  width: 22px !important;
  height: 22px !important;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #dce2e9 !important;
  border-radius: 50% !important;
  color: #a6afbc;
  background: #fff !important;
  font-size: .55rem !important;
}

.enrollment-modal--premium .voice-options button.selected .voice-options__check {
  color: #fff;
  border-color: #b98e0b !important;
  background: #b98e0b !important;
}

.enrollment-modal--premium .voice-selection {
  display: flex;
  gap: 11px;
  align-items: center;
  margin-top: 13px;
  padding: 12px 14px;
  border: 1px solid #e8d798;
  border-radius: 12px;
  background: #fffaf0;
}

.voice-selection__icon {
  display: grid;
  width: 27px;
  height: 27px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: #b98e0b;
  font-size: .6rem;
  font-weight: 900;
}

.enrollment-modal--premium .voice-selection div { flex: 1; }
.enrollment-modal--premium .voice-selection small { color: #8d7a43; }
.enrollment-modal--premium .voice-selection strong { color: #725700; }

.voice-selection__status {
  padding: 5px 8px;
  border-radius: 999px;
  color: #216744;
  background: #eaf7ef;
  font-size: .5rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .07em;
}

.enrollment-modal--premium .enrollment-information {
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 11px;
  margin: 0;
  padding: 0;
  border: 0;
}

.enrollment-modal--premium .enrollment-information article {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 15px;
  border: 1px solid #e2e7ed;
  border-radius: 13px;
  background: #f8fafc;
}

.enrollment-information__icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e7d69a;
  border-radius: 10px;
  color: #9a7311;
  background: #fffaf0;
  font-size: .8rem;
}

.enrollment-modal--premium .enrollment-information small { margin-bottom: 3px; color: #8d97a7; }
.enrollment-modal--premium .enrollment-information strong { color: #26364f; font-size: .72rem; }

.enrollment-modal--premium .enrollment-process {
  margin-top: 16px;
  background: linear-gradient(135deg, rgba(212,175,55,.045), transparent 42%), #fff;
}

.enrollment-process__intro { margin-bottom: 22px; }
.enrollment-process__intro > div { min-width: 0; }
.enrollment-process__intro p {
  max-width: 590px;
  margin: 6px 0 0;
  color: #7b8493;
  font-size: .68rem;
  line-height: 1.55;
}

.enrollment-process__timeline {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.enrollment-process__timeline::before {
  position: absolute;
  top: 18px;
  right: 10%;
  left: 10%;
  height: 1px;
  background: #e5d7a8;
  content: '';
}

.enrollment-modal--premium .process-step {
  position: relative;
  z-index: 1;
  display: block;
  margin: 0 !important;
  padding: 0 5px;
  border: 0;
  background: transparent;
  text-align: center;
}

.process-step__number {
  display: grid;
  width: 37px;
  height: 37px;
  margin: 0 auto 11px;
  place-items: center;
  border: 1px solid #e0bd4d;
  border-radius: 50%;
  color: #6d5207;
  background: #fff9e8;
  box-shadow: 0 0 0 5px #fff;
  font-size: .59rem;
  font-weight: 900;
}

.enrollment-modal--premium .process-step strong { display: block; color: #26364f; font-size: .66rem; }
.enrollment-modal--premium .process-step p { margin: 4px 0 0; color: #8993a3; font-size: .58rem; line-height: 1.45; }

.enrollment-modal--premium .enrollment-feedback { border-radius: 14px; }
.enrollment-modal--premium .enrollment-feedback--error { border-color: #efcdd2; background: #fff4f5; }
.enrollment-modal--premium .enrollment-feedback--error strong { color: #982f3d; }
.enrollment-modal--premium .enrollment-feedback--error p { color: #8a5960; }
.enrollment-modal--premium .enrollment-feedback--success { border-color: #cce7d7; background: #f0faf4; }
.enrollment-modal--premium .enrollment-feedback--success strong { color: #256c48; }
.enrollment-modal--premium .enrollment-feedback--success p { color: #527361; }

.enrollment-modal--premium .enrollment-modal__footer {
  position: relative;
  z-index: 3;
  align-items: center;
  justify-content: space-between;
  padding: 18px 36px;
  border-top: 1px solid #e1e6ec;
  background: rgba(255,255,255,.96);
  box-shadow: 0 -8px 24px rgba(15,23,42,.035);
  backdrop-filter: blur(12px);
}

.enrollment-modal__footer-copy,
.enrollment-modal__actions { display: flex; gap: 10px; align-items: center; }

.footer-lock {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #725700;
  background: #fff5d6;
  font-size: .6rem;
  font-weight: 900;
}

.enrollment-modal__footer-copy strong,
.enrollment-modal__footer-copy small { display: block; }
.enrollment-modal__footer-copy strong { color: #344054; font-size: .64rem; }
.enrollment-modal__footer-copy small { margin-top: 2px; color: #98a2b3; font-size: .54rem; }

.enrollment-modal--premium .button--modal { min-height: 43px; border-radius: 10px; }
.enrollment-modal--premium .button--secondary { color: #344054; border-color: #d6dde6; background: #fff; }
.enrollment-modal--premium .button--primary {
  min-width: 190px;
  color: #342700;
  border-color: #d6aa20;
  background: linear-gradient(180deg, #f1cb4e, #dfb429);
  box-shadow: 0 8px 18px rgba(194,148,11,.17);
}
.enrollment-modal--premium .button--primary:hover:not(:disabled) { box-shadow: 0 11px 23px rgba(194,148,11,.24); }
.enrollment-modal--premium .button--primary:disabled {
  color: #91835b;
  border-color: #e5d7a7;
  background: #f4ebce;
  box-shadow: none;
}
.enrollment-modal--premium .button-spinner { border-color: rgba(52,39,0,.2); border-top-color: #342700; }

@media (max-width: 820px) {
  .enrollment-modal--premium { max-height: calc(100dvh - 24px); }
  .enrollment-modal__body { max-height: calc(100dvh - 225px); }
  .enrollment-modal--premium .voice-options { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .enrollment-process__timeline { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 18px 10px; }
  .enrollment-process__timeline::before { display: none; }
  .enrollment-section__heading { flex-direction: column; gap: 10px; }
  .enrollment-section__heading > p { max-width: none; padding-left: 48px; }
  .enrollment-modal__footer-copy { display: none; }
  .enrollment-modal--premium .enrollment-modal__footer { justify-content: flex-end; }
}

@media (max-width: 560px) {
  .modal-backdrop { align-items: end; padding: 0; }
  .enrollment-modal--premium {
    width: 100%;
    max-height: 96dvh;
    border-right: 0;
    border-bottom: 0;
    border-left: 0;
    border-radius: 22px 22px 0 0;
  }
  .enrollment-modal--premium .enrollment-modal__header { padding: 25px 20px 21px; }
  .enrollment-modal--premium .enrollment-modal__header h2 { padding-right: 8px; font-size: 2rem; }
  .enrollment-modal__body { max-height: calc(96dvh - 214px); }
  .enrollment-modal--premium .student-preview { margin: 17px 16px 0; padding: 15px; }
  .enrollment-modal--premium .student-preview__avatar { width: 48px; height: 48px; }
  .enrollment-modal--premium .approved-indicator { display: none; }
  .enrollment-modal--premium .enrollment-form { padding: 16px 16px 24px; }
  .enrollment-section, .enrollment-modal--premium .enrollment-process { padding: 19px 16px; border-radius: 15px; }
  .enrollment-modal--premium .voice-options,
  .enrollment-modal--premium .enrollment-information { grid-template-columns: 1fr; }
  .enrollment-process__timeline { grid-template-columns: 1fr; gap: 0; }
  .enrollment-modal--premium .process-step {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 9px 0;
    text-align: left;
  }
  .process-step__number { width: 32px; height: 32px; margin: 0; flex: 0 0 auto; box-shadow: none; }
  .enrollment-section__heading > p { padding-left: 0; }
  .enrollment-modal--premium .enrollment-modal__footer { padding: 14px 16px; }
  .enrollment-modal__actions { width: 100%; }
  .enrollment-modal__actions .button { flex: 1; }
  .enrollment-modal--premium .button--primary { min-width: 0; }
}



/* =========================================================
   V6.6 · FIX MODAL MATRÍCULA
   - Evita que el modal quede cortado
   - Elimina estilos negros heredados en Clases / Sede
========================================================= */

.modal-backdrop {
  overflow: hidden;
}

.enrollment-modal--premium {
  display: flex;
  flex-direction: column;
  height: min(900px, calc(100dvh - 40px));
  max-height: calc(100dvh - 40px);
}

.enrollment-modal--premium .enrollment-modal__header {
  flex: 0 0 auto;
}

.enrollment-modal--premium .enrollment-modal__body {
  flex: 1 1 auto;
  min-height: 0;
  max-height: none;
  overflow-y: auto;
  overscroll-behavior: contain;
}

.enrollment-modal--premium .enrollment-modal__footer {
  flex: 0 0 auto;
}

/* Neutraliza el CSS antiguo:
   .enrollment-information div { background:#0c0c0c; ... } */
.enrollment-modal--premium .enrollment-information article > div {
  min-width: 0;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
}

.enrollment-modal--premium .enrollment-information article {
  min-height: 86px;
  padding: 17px 18px;
  border: 1px solid #dfe6ee;
  background:
    linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  box-shadow: 0 4px 14px rgba(31, 48, 73, 0.035);
}

.enrollment-modal--premium .enrollment-information__icon {
  width: 38px;
  height: 38px;
  border-color: #ead696;
  color: #9a7311;
  background: #fff9e9;
}

.enrollment-modal--premium .enrollment-information small {
  margin: 0 0 4px;
  color: #9a7311;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.enrollment-modal--premium .enrollment-information strong {
  color: #26364f;
  font-size: 0.74rem;
  font-weight: 800;
  line-height: 1.4;
}

/* Más aire al final del contenido antes del footer */
.enrollment-modal--premium .enrollment-form {
  padding-bottom: 34px;
}

@media (max-width: 820px) {
  .enrollment-modal--premium {
    height: calc(100dvh - 20px);
    max-height: calc(100dvh - 20px);
  }

  .enrollment-modal--premium .enrollment-modal__body {
    max-height: none;
  }
}

@media (max-width: 560px) {
  .modal-backdrop {
    align-items: flex-end;
  }

  .enrollment-modal--premium {
    height: 96dvh;
    max-height: 96dvh;
  }

  .enrollment-modal--premium .enrollment-modal__body {
    max-height: none;
  }

  .enrollment-modal--premium .enrollment-information article {
    min-height: 74px;
  }
}

</style>