<template>

  <section class="classwork">

    <RouterLink

      :to="`/aula/clase/${lessonId}`"

      class="classwork__back"

    >

      ← Volver a la clase

    </RouterLink>

    <header class="classwork__hero">

      <div class="classwork__hero-copy">

        <p class="classwork__eyebrow">

          AULA VIRTUAL · CLASE {{ lessonId }}

        </p>

        <h1>Trabajo de clase</h1>

        <p>

          <template v-if="lesson">

            {{ lesson.title }}

          </template>

          <template v-else>

            Materiales, recursos y tareas de esta clase.

          </template>

        </p>

      </div>

      <div class="classwork__hero-status">

        <span>ESTADO</span>

        <strong>{{ syncStatusLabel }}</strong>

        <small>Supabase Database + Storage</small>

      </div>

    </header>

    <section

      v-if="loadError"

      class="system-message system-message--error"

    >

      <span>!</span>

      <div>

        <strong>No se pudo cargar el trabajo de clase</strong>

        <p>{{ loadError }}</p>

      </div>

      <button

        type="button"

        @click="loadClasswork"

      >

        Reintentar

      </button>

    </section>

    <section

      v-else

      class="classwork__summary"

      aria-label="Resumen de la clase"

    >

      <article>

        <span>RECURSOS</span>

        <strong>{{ visibleMaterials.length }}</strong>

        <small>materiales disponibles</small>

      </article>

      <article>

        <span>TAREAS</span>

        <strong>{{ visibleAssignments.length }}</strong>

        <small>actividades publicadas</small>

      </article>

      <article>

        <span>PRÓXIMA ENTREGA</span>

        <strong class="summary-date">

          {{ nextDueDateLabel }}

        </strong>

        <small>

          {{ nextDueAssignment?.title || 'Sin entregas próximas' }}

        </small>

      </article>

      <article>

        <span>EVALUACIONES</span>

        <strong>{{ visibleQuizzes.length }}</strong>

        <small>
          {{
            isTeacher
              ? `${publishedQuizCount} publicadas · ${draftQuizCount} borradores`
              : `${availableQuizCount} disponibles ahora`
          }}
        </small>

      </article>

      <article>

        <span>PERFIL</span>

        <strong>

          {{ isTeacher ? 'Profesor' : currentUser?.voice || 'Estudiante' }}

        </strong>

        <small>

          {{ isTeacher ? 'Vista administrativa' : 'Contenido personalizado' }}

        </small>

      </article>

    </section>

    <div

      v-if="isLoadingData"

      class="classwork__loading"

    >

      <div class="loading-spinner"></div>

      <strong>Sincronizando trabajo de clase...</strong>

      <p>Cargando materiales y tareas desde Supabase.</p>

    </div>

    <template v-else-if="!loadError">

      <!-- ===================================================*

           01 · ACTIVIDAD DE CLASE
*      ==================================================== -->

      <section class="classwork__section">

        <div class="classwork__section-title">

          <span>01</span>

          <div>

            <p>Actividades</p>

            <h2>Trabajo de la clase</h2>

          </div>

        </div>

        <article class="class-activity">

          <div class="class-activity__icon">♪</div>

          <div class="class-activity__content">

            <span>ACTIVIDAD PRESENCIAL</span>

            <h3>

              {{ lesson?.focus || 'Performance Lab' }}

            </h3>

            <p>

              {{

                lesson?.description ||

                `Actividad práctica correspondiente a la Clase ${lessonId}.`

              }}

            </p>

            <div class="meta-pills">

              <span>Clase {{ lessonId }}</span>

              <span>{{ lesson?.modality || 'Presencial' }}</span>

              <span v-if="lesson?.duration">{{ lesson.duration }}</span>

            </div>

          </div>

        </article>

      </section>

      <!-- ===================================================*

           02 · MATERIALES
*      ==================================================== -->

      <section class="classwork__section">

        <div class="classwork__section-title classwork__section-title--actions">

          <span>02</span>

          <div class="section-heading-copy">

            <p>Recursos</p>

            <h2>Material de estudio</h2>

          </div>

          <RouterLink

            v-if="isTeacher"

            to="/aula/recursos/publicar"

            class="secondary-action"

          >

            + Publicar recurso

          </RouterLink>

        </div>

        <div

          v-if="visibleMaterials.length"

          class="classwork__grid"

        >

          <article

            v-for="material in visibleMaterials"

            :key="material.id"

            class="resource-card"

            tabindex="0"

            role="button"

            :aria-label="`Abrir material: ${material.title}`"

            @click="openMaterial(material)"

            @keydown.enter="openMaterial(material)"

            @keydown.space.prevent="openMaterial(material)"

          >

            <div class="resource-card__top">

              <div class="resource-card__icon">

                {{ getMaterialIcon(material) }}

              </div>

              <div

                class="resource-card__voice"

                :class="{

                  'resource-card__voice--general':

                    getMaterialVoice(material) === 'general'

                }"

              >

                <span>

                  {{ getVoiceShort(getMaterialVoice(material)) }}

                </span>

                {{ getVoiceLabel(getMaterialVoice(material)) }}

              </div>

            </div>

            <span class="resource-card__type">

              {{ getMaterialType(material) }}

            </span>

            <h3>{{ material.title }}</h3>

            <p>

              {{

                material.description ||

                `Material correspondiente a la Clase ${lessonId}.`

              }}

            </p>

            <div

              v-if="material.fileName"

              class="resource-card__file"

            >

              <span>{{ material.fileName }}</span>

              <strong v-if="material.fileSize">

                {{ formatBytes(material.fileSize) }}

              </strong>

            </div>

            <button

              type="button"

              @click.stop="openMaterial(material)"

            >

              Ver material →

            </button>

          </article>

        </div>

        <div

          v-else

          class="empty-state"

        >

          <span>i</span>

          <div>

            <h3>No hay materiales publicados</h3>

            <p>

              Esta clase todavía no tiene recursos disponibles

              en Supabase.

            </p>

          </div>

        </div>

      </section>

      <!-- ===================================================*

           03 · TAREAS
*      ==================================================== -->

      <section class="classwork__section">

        <div class="classwork__section-title classwork__section-title--actions">

          <span>03</span>

          <div class="section-heading-copy">

            <p>Entregas</p>

            <h2>Tareas</h2>

          </div>

          <RouterLink

            v-if="isTeacher"

            :to="`/aula/clase/${lessonId}/crear-tarea`"

            class="primary-action"

          >

            + Crear tarea

          </RouterLink>

        </div>

        <div

          v-if="visibleAssignments.length"

          class="tasks"

        >

          <RouterLink

            v-for="task in visibleAssignments"

            :key="task.id"

            :to="`/aula/clase/${lessonId}/tarea/${task.id}`"

            class="task-card"

          >

            <div class="task-card__icon">

              {{ getTaskIcon(task.type) }}

            </div>

            <div class="task-card__content">

              <div class="task-card__badges">

                <span

                  class="task-status"

                  :class="`task-status--${task.status || 'published'}`"

                >

                  {{ getTaskStatusLabel(task.status) }}

                </span>

                <span>

                  {{ getTaskTypeLabel(task.type) }}

                </span>

              </div>

              <h3>{{ task.title }}</h3>

              <p>

                {{ task.description || 'Actividad sin instrucciones adicionales.' }}

              </p>

              <div class="task-card__meta">

                <span>

                  {{ task.points ?? 100 }} pts

                </span>

                <span>

                  Entrega: {{ getAcceptedFileLabel(task.acceptedFile) }}

                </span>

                <span

                  v-if="task.dueDate"

                  :class="{ 'is-overdue': isOverdue(task) }"

                >

                  {{ isOverdue(task) ? 'Venció' : 'Hasta' }}:

                  {{ formatDate(task.dueDate) }}

                </span>

                <span v-else>

                  Sin fecha límite

                </span>

              </div>

            </div>

            <div class="task-card__arrow">→</div>

          </RouterLink>

        </div>

        <div

          v-else

          class="empty-state"

        >

          <span>✓</span>

          <div>

            <h3>No hay tareas disponibles</h3>

            <p>

              {{

                isTeacher

                  ? 'Esta clase todavía no tiene tareas creadas.'

                  : 'Esta clase todavía no tiene tareas publicadas.'

              }}

            </p>

          </div>

        </div>

      </section>

      <!-- ===================================================
           04 · EVALUACIONES
      ==================================================== -->

      <section class="classwork__section">
        <div class="classwork__section-title classwork__section-title--actions">
          <span>04</span>

          <div class="section-heading-copy">
            <p>Evaluaciones</p>
            <h2>Quiz y pruebas</h2>
            <small class="section-description">
              Evaluaciones formativas y calificadas con control de
              disponibilidad, intentos y tiempo límite.
            </small>
          </div>

          <RouterLink
            v-if="isTeacher"
            :to="`/aula/clase/${lessonId}/evaluacion/nueva`"
            class="primary-action"
          >
            + Crear evaluación
          </RouterLink>
        </div>

        <div
          v-if="visibleQuizzes.length"
          class="quiz-grid"
        >
          <article
            v-for="quiz in visibleQuizzes"
            :key="quiz.id"
            class="quiz-card"
            :class="[
              `quiz-card--${quiz.assessmentType}`,
              `quiz-card--${quiz.status}`,
              `quiz-card--runtime-${getQuizRuntimeState(quiz).state}`
            ]"
          >
            <div class="quiz-card__top">
              <div
                class="quiz-card__icon"
                aria-hidden="true"
              >
                {{ quiz.assessmentType === 'test' ? '★' : '?' }}
              </div>

              <div class="quiz-card__badges">
                <span>
                  {{ getQuizTypeLabel(quiz.assessmentType) }}
                </span>

                <span
                  class="quiz-card__status"
                  :class="`quiz-card__status--${quiz.status}`"
                >
                  {{ getQuizStatusLabel(quiz.status) }}
                </span>
              </div>
            </div>

            <div class="quiz-card__content">
              <span class="quiz-card__eyebrow">
                EVALUACIÓN · {{ quiz.totalPoints || 0 }} PTS
              </span>

              <h3>{{ quiz.title }}</h3>

              <p>
                {{
                  quiz.description ||
                  'Evaluación asociada a esta clase.'
                }}
              </p>
            </div>

            <div class="quiz-card__stats">
              <article>
                <strong>{{ quiz.totalPoints || 0 }}</strong>
                <small>Puntos</small>
              </article>

              <article>
                <strong>
                  {{ quiz.passingPercentage ?? '—' }}
                  <template v-if="quiz.passingPercentage !== null">%</template>
                </strong>
                <small>Aprobación</small>
              </article>

              <article>
                <strong>{{ quiz.attemptsAllowed || '∞' }}</strong>
                <small>Intentos</small>
              </article>

              <article>
                <strong>
                  {{
                    quiz.timeLimitMinutes
                      ? `${quiz.timeLimitMinutes}m`
                      : '∞'
                  }}
                </strong>
                <small>Tiempo</small>
              </article>
            </div>

            <div
              class="quiz-card__availability"
              :class="`quiz-card__availability--${getQuizRuntimeState(quiz).state}`"
            >
              <span
                class="availability-dot"
                :class="{
                  'availability-dot--active':
                    getQuizRuntimeState(quiz).state === 'available',
                  'availability-dot--warning':
                    getQuizRuntimeState(quiz).state === 'upcoming',
                  'availability-dot--closed':
                    ['expired', 'closed'].includes(
                      getQuizRuntimeState(quiz).state
                    )
                }"
                aria-hidden="true"
              ></span>

              <span>
                {{ getQuizAvailabilityLabel(quiz) }}
              </span>
            </div>

            <div
              v-if="quiz.opensAt || quiz.closesAt"
              class="quiz-card__window"
            >
              <span v-if="quiz.opensAt">
                <small>APERTURA</small>
                <strong>{{ formatDateTime(quiz.opensAt) }}</strong>
              </span>

              <span v-if="quiz.closesAt">
                <small>CIERRE</small>
                <strong>{{ formatDateTime(quiz.closesAt) }}</strong>
              </span>
            </div>

            <div
              v-if="isTeacher"
              class="quiz-card__actions"
            >
              <button
                v-if="quiz.status !== 'published'"
                type="button"
                :disabled="isChangingQuiz === quiz.id"
                :aria-label="`Publicar ${quiz.title}`"
                @click="changeQuizStatus(quiz, 'published')"
              >
                Publicar
              </button>

              <button
                v-if="quiz.status === 'published'"
                type="button"
                :disabled="isChangingQuiz === quiz.id"
                :aria-label="`Cerrar ${quiz.title}`"
                @click="changeQuizStatus(quiz, 'closed')"
              >
                Cerrar
              </button>

              <button
                v-if="quiz.status !== 'draft'"
                type="button"
                :disabled="isChangingQuiz === quiz.id"
                :aria-label="`Mover ${quiz.title} a borrador`"
                @click="changeQuizStatus(quiz, 'draft')"
              >
                Borrador
              </button>

              <button
                type="button"
                class="quiz-card__delete"
                :disabled="isChangingQuiz === quiz.id"
                :aria-label="`Eliminar ${quiz.title}`"
                @click="deleteQuiz(quiz)"
              >
                Eliminar
              </button>
            </div>

            <div
              v-else
              class="quiz-card__student-footer"
            >
              <RouterLink
                v-if="isQuizAvailableNow(quiz)"
                :to="`/aula/clase/${lessonId}/evaluacion/${quiz.id}`"
                class="quiz-card__student-action"
                :aria-label="`Rendir evaluación: ${quiz.title}`"
              >
                <span>
                  RENDIR EVALUACIÓN
                </span>

                <strong>
                  Comenzar →
                </strong>
              </RouterLink>

              <div
                v-else
                class="quiz-card__student-action quiz-card__student-action--disabled"
                aria-disabled="true"
              >
                <span>
                  {{ getQuizStudentActionLabel(quiz) }}
                </span>

                <strong>
                  {{ getQuizAvailabilityLabel(quiz) }}
                </strong>
              </div>
            </div>
          </article>
        </div>

        <div
          v-else
          class="empty-state empty-state--evaluation"
        >
          <span>?</span>

          <div>
            <h3>
              {{
                isTeacher
                  ? 'Todavía no hay evaluaciones'
                  : 'No hay evaluaciones disponibles'
              }}
            </h3>

            <p>
              {{
                isTeacher
                  ? 'Crea un quiz formativo o una prueba evaluada para esta clase.'
                  : 'El profesor todavía no ha publicado evaluaciones para esta sesión.'
              }}
            </p>
          </div>

          <RouterLink
            v-if="isTeacher"
            :to="`/aula/clase/${lessonId}/evaluacion/nueva`"
            class="empty-state__action"
          >
            Crear primera evaluación
          </RouterLink>
        </div>
      </section>

    </template>

    <!-- =====================================================*

         VISOR PROFESIONAL DE RECURSOS
*    ====================================================== -->

    <Teleport to="body">

      <Transition name="viewer">

        <div

          v-if="activeMaterial"

          class="viewer-overlay"

          @click.self="closeMaterial"

        >

          <section
            ref="viewerWindow"
            class="viewer-window"
            role="dialog"
            aria-modal="true"
            :aria-label="activeMaterial?.title || 'Visor de material'"
            tabindex="-1"
          >

            <header class="viewer-header">

              <div class="viewer-header__main">

                <div class="viewer-header__icon">

                  {{ getMaterialIcon(activeMaterial) }}

                </div>

                <div class="viewer-header__info">

                  <div class="viewer-badges">

                    <span>{{ getMaterialType(activeMaterial) }}</span>

                    <span>

                      {{ getVoiceLabel(getMaterialVoice(activeMaterial)) }}

                    </span>

                  </div>

                  <h2>{{ activeMaterial.title }}</h2>

                  <p>

                    Clase {{ lessonId }}

                    <template v-if="activeMaterial.fileSize">

                      · {{ formatBytes(activeMaterial.fileSize) }}

                    </template>

                  </p>

                </div>

              </div>

              <div class="viewer-header__actions">

                <button

                  type="button"

                  title="Descargar"
                  aria-label="Descargar material"

                  @click="downloadMaterial"

                >

                  ↓ <span>Descargar</span>

                </button>

                <button

                  v-if="canPrint"

                  type="button"

                  title="Abrir archivo"
                  aria-label="Abrir material en una nueva pestaña"

                  @click="openPrintVersion"

                >

                  ↗ <span>Abrir</span>

                </button>

                <button

                  type="button"

                  class="viewer-close"

                  title="Cerrar"
                  aria-label="Cerrar visor"

                  @click="closeMaterial"

                >

                  ×

                </button>

              </div>

            </header>

            <nav

              v-if="previewKind === 'pdf'"

              class="pdf-toolbar"

            >

              <div class="pdf-toolbar__pages">

                <button

                  type="button"

                  :disabled="currentPage <= 1 || isRenderingPdf"

                  @click="previousPage"

                >

                  ‹

                </button>

                <span>

                  Página <strong>{{ currentPage }}</strong>

                  de <strong>{{ pageCount }}</strong>

                </span>

                <button

                  type="button"

                  :disabled="currentPage >= pageCount || isRenderingPdf"

                  @click="nextPage"

                >

                  ›

                </button>

              </div>

              <div class="pdf-toolbar__zoom">

                <button

                  type="button"

                  :disabled="zoom <= 0.7"

                  @click="zoomOut"

                >

                  −

                </button>

                <span>{{ Math.round(zoom * 100) }}%</span>

                <button

                  type="button"

                  :disabled="zoom >= 2.2"

                  @click="zoomIn"

                >

                  +

                </button>

                <button

                  type="button"

                  class="fit-button"

                  @click="fitWidth"

                >

                  Ajustar

                </button>

              </div>

            </nav>

            <main

              ref="viewerBody"

              class="viewer-body"

            >

              <div

                v-if="isLoadingViewer"

                class="viewer-loading"

              >

                <div class="loading-spinner"></div>

                <strong>Preparando material...</strong>

                <p>Cargando el archivo.</p>

              </div>

              <div

                v-else-if="viewerError"

                class="viewer-error"

              >

                <div class="viewer-error__icon">!</div>

                <h3>No se pudo mostrar el archivo</h3>

                <p>

                  Puedes descargarlo para abrirlo directamente

                  en tu dispositivo.

                </p>

                <button

                  type="button"

                  @click="downloadMaterial"

                >

                  ↓ Descargar archivo

                </button>

              </div>

              <section

                v-show="

                  !isLoadingViewer &&

                  !viewerError &&

                  previewKind === 'pdf'

                "

                class="pdf-stage"

              >

                <div

                  v-if="isRenderingPdf"

                  class="pdf-rendering"

                >

                  Cargando página...

                </div>

                <div class="pdf-paper">

                  <canvas

                    ref="pdfCanvas"

                    class="pdf-canvas"

                  ></canvas>

                </div>

              </section>

              <section

                v-if="

                  !isLoadingViewer &&

                  !viewerError &&

                  previewKind === 'audio'

                "

                class="audio-viewer"

              >

                <div class="audio-viewer__icon">♪</div>

                <span>GUÍA DE AUDIO</span>

                <h3>{{ activeMaterial.title }}</h3>

                <p>

                  {{ getVoiceLabel(getMaterialVoice(activeMaterial)) }}

                </p>

                <audio

                  :src="activeMaterial.url"

                  controls

                  preload="metadata"

                ></audio>

              </section>

              <video

                v-if="

                  !isLoadingViewer &&

                  !viewerError &&

                  previewKind === 'video'

                "

                :src="activeMaterial.url"

                class="video-viewer"

                controls

                playsinline

              ></video>

              <section

                v-if="

                  !isLoadingViewer &&

                  !viewerError &&

                  previewKind === 'image'

                "

                class="image-viewer"

              >

                <img

                  :src="activeMaterial.url"

                  :alt="activeMaterial.title"

                >

              </section>

              <section

                v-if="

                  !isLoadingViewer &&

                  !viewerError &&

                  previewKind === 'other'

                "

                class="other-viewer"

              >

                <div>FILE</div>

                <h3>Archivo disponible</h3>

                <p>

                  Este formato no tiene vista previa dentro del Aula Virtual.

                </p>

                <button

                  type="button"

                  @click="downloadMaterial"

                >

                  ↓ Descargar

                </button>

              </section>

            </main>

            <footer class="mobile-actions">

              <button

                type="button"

                @click="downloadMaterial"

              >

                <strong>↓</strong>

                Descargar

              </button>

              <button

                v-if="canPrint"

                type="button"

                @click="openPrintVersion"

              >

                <strong>↗</strong>

                Abrir

              </button>

              <button

                type="button"

                @click="closeMaterial"

              >

                <strong>×</strong>

                Cerrar

              </button>

            </footer>

          </section>

        </div>

      </Transition>

    </Teleport>

    <Teleport to="body">
      <Transition name="notice">
        <div
          v-if="uiMessage"
          class="classwork-notice"
          :class="`classwork-notice--${uiMessageType}`"
          role="status"
          aria-live="polite"
        >
          <span aria-hidden="true">
            {{ uiMessageType === 'error' ? '!' : '✓' }}
          </span>
          <p>{{ uiMessage }}</p>
        </div>
      </Transition>
    </Teleport>

  </section>

</template>

<script setup>

import {

  computed,

  nextTick,

  onMounted,

  onUnmounted,

  ref,

  watch

} from 'vue'

import {

  RouterLink,

  useRoute

} from 'vue-router'

import {

  fetchLessonById

} from '@/services/lessonService'

import {

  fetchMaterialsByLesson

} from '@/services/materialService'

import {

  fetchAssignmentsByLesson

} from '@/services/assignmentService'

import {
  closeQuiz,
  draftQuiz,
  fetchQuizzesByLesson,
  publishQuiz,
  removeQuiz
} from '@/services/quizService'

import {

  useAuth

} from '@/composables/useAuth'

import * as pdfjsLib from 'pdfjs-dist'

import pdfWorker from

  'pdfjs-dist/build/pdf.worker.min.mjs?url'

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker

const route = useRoute()

const {

  currentUser,

  isTeacher

} = useAuth()

/* =========================================================
   DATOS DE CLASE
========================================================= */
const lesson = ref(null)

const materials = ref([])

const assignments = ref([])

const quizzes = ref([])

const isLoadingData = ref(true)

const loadError = ref('')

const nowMs = ref(Date.now())

const uiMessage = ref('')
const uiMessageType = ref('success')

let availabilityTimer = null
let uiMessageTimer = null
let loadRequestId = 0

const showUiMessage = (message, type = 'success') => {
  clearTimeout(uiMessageTimer)

  uiMessage.value = message
  uiMessageType.value = type

  uiMessageTimer = setTimeout(() => {
    uiMessage.value = ''
  }, 3600)
}

const lessonId = computed(() =>

  Number(route.params.id)

)

const visibleMaterials = computed(() => {

  if (isTeacher.value) {

    return materials.value

  }

  const voice = currentUser.value?.voice

  return materials.value.filter(material => {

    const materialVoice =

      material.voice || 'general'

    return (

      materialVoice === 'general' ||

      materialVoice === voice

    )

  })

})

const visibleAssignments = computed(() => {

  if (isTeacher.value) {

    return assignments.value

  }

  return assignments.value.filter(

    assignment =>

      assignment.status !== 'draft'

  )

})

const visibleQuizzes = computed(() => {
  if (isTeacher.value) {
    return quizzes.value
  }

  return quizzes.value.filter(
    quiz => quiz.status === 'published'
  )
})

const publishedQuizCount = computed(() =>
  quizzes.value.filter(
    quiz => quiz.status === 'published'
  ).length
)

const draftQuizCount = computed(() =>
  quizzes.value.filter(
    quiz => quiz.status === 'draft'
  ).length
)

const availableQuizCount = computed(() =>
  visibleQuizzes.value.filter(
    quiz => isQuizAvailableNow(quiz)
  ).length
)

const nextDueAssignment = computed(() => {

  const now = new Date()

  return visibleAssignments.value

    .filter(task => task.dueDate)

    .map(task => ({

      ...task,

      due: new Date(`${task.dueDate}T23:59:59`)

    }))

    .filter(task => !Number.isNaN(task.due.getTime()))

    .filter(task => task.due >= now)

    .sort((a, b) => a.due - b.due)[0] || null

})

const nextDueDateLabel = computed(() => {

  if (!nextDueAssignment.value) {

    return '—'

  }

  return formatDate(

    nextDueAssignment.value.dueDate

  )

})

const syncStatusLabel = computed(() => {

  if (isLoadingData.value) {

    return 'Sincronizando'

  }

  if (loadError.value) {

    return 'Con error'

  }

  return 'Sincronizado'

})

const loadClasswork = async () => {
  const currentRequestId = ++loadRequestId

  if (!lessonId.value) {
    loadError.value =
      'El identificador de la clase no es válido.'
    isLoadingData.value = false
    return
  }

  isLoadingData.value = true
  loadError.value = ''

  try {
    const [
      loadedLesson,
      loadedMaterials,
      loadedAssignments,
      loadedQuizzes
    ] = await Promise.all([
      fetchLessonById(lessonId.value),
      fetchMaterialsByLesson(lessonId.value),
      fetchAssignmentsByLesson(lessonId.value),
      fetchQuizzesByLesson(lessonId.value)
    ])

    if (currentRequestId !== loadRequestId) {
      return
    }

    lesson.value = loadedLesson
    materials.value = loadedMaterials || []
    assignments.value = loadedAssignments || []
    quizzes.value = loadedQuizzes || []
  } catch (error) {
    if (currentRequestId !== loadRequestId) {
      return
    }

    console.error(
      'Error cargando Trabajo de clase:',
      error
    )

    loadError.value =
      error?.message ||
      'No se pudieron sincronizar los datos de esta clase.'
  } finally {
    if (currentRequestId === loadRequestId) {
      isLoadingData.value = false
    }
  }
}

/* =========================================================
   TAREAS
========================================================= */
const taskTypeLabels = {

  assignment: 'Tarea',

  performance: 'Performance',

  audio: 'Audio',

  video: 'Video',

  score: 'Partitura'

}

const taskTypeIcons = {

  assignment: '✓',

  performance: '★',

  audio: '♪',

  video: '▶',

  score: '♫'

}

const fileTypeLabels = {

  audio: 'Audio',

  video: 'Video',

  document: 'Documento',

  any: 'Cualquier archivo'

}

const getTaskTypeLabel = type =>

  taskTypeLabels[type] || 'Tarea'

const getTaskIcon = type =>

  taskTypeIcons[type] || '✓'

const getAcceptedFileLabel = type =>

  fileTypeLabels[type] || 'Archivo'

const getTaskStatusLabel = status => {

  const labels = {

    published: 'PUBLICADA',

    draft: 'BORRADOR',

    pending: 'PENDIENTE',

    completed: 'COMPLETADA'

  }

  return labels[status] || String(status || 'PUBLICADA').toUpperCase()

}

const quizTypeLabels = {
  quiz: 'Quiz formativo',
  test: 'Prueba evaluada'
}

const quizStatusLabels = {
  draft: 'BORRADOR',
  published: 'PUBLICADA',
  closed: 'CERRADA'
}

const getQuizTypeLabel = type =>
  quizTypeLabels[type] || 'Evaluación'

const getQuizStatusLabel = status =>
  quizStatusLabels[status] ||
  String(status || 'draft').toUpperCase()

const formatDateTime = value => {
  if (!value) {
    return 'Sin fecha'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return 'Sin fecha'
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  ).format(date)
}

function getQuizRuntimeState(quiz) {
  if (!quiz) {
    return { state: 'closed' }
  }

  if (quiz.status === 'draft') {
    return { state: 'draft' }
  }

  if (quiz.status === 'closed') {
    return { state: 'closed' }
  }

  const currentTime = nowMs.value
  const opensAt = quiz.opensAt
    ? new Date(quiz.opensAt).getTime()
    : null
  const closesAt = quiz.closesAt
    ? new Date(quiz.closesAt).getTime()
    : null

  if (opensAt && !Number.isNaN(opensAt) && currentTime < opensAt) {
    return { state: 'upcoming', opensAt }
  }

  if (closesAt && !Number.isNaN(closesAt) && currentTime > closesAt) {
    return { state: 'expired', closesAt }
  }

  return { state: 'available' }
}

function isQuizAvailableNow(quiz) {
  return getQuizRuntimeState(quiz).state === 'available'
}

const getQuizAvailabilityLabel = quiz => {
  const runtime = getQuizRuntimeState(quiz)

  if (runtime.state === 'draft') {
    return 'Solo profesor'
  }

  if (runtime.state === 'closed') {
    return 'Evaluación cerrada'
  }

  if (runtime.state === 'upcoming') {
    return `Abre ${formatDateTime(quiz.opensAt)}`
  }

  if (runtime.state === 'expired') {
    return `Cerró ${formatDateTime(quiz.closesAt)}`
  }

  if (quiz.closesAt) {
    return `Disponible · cierra ${formatDateTime(quiz.closesAt)}`
  }

  return 'Disponible ahora'
}

const getQuizStudentActionLabel = quiz => {
  const state = getQuizRuntimeState(quiz).state

  if (state === 'upcoming') {
    return 'PRÓXIMAMENTE'
  }

  if (state === 'expired' || state === 'closed') {
    return 'EVALUACIÓN CERRADA'
  }

  return 'NO DISPONIBLE'
}

const isChangingQuiz = ref(null)

const changeQuizStatus = async (
  quiz,
  nextStatus
) => {
  if (
    !isTeacher.value ||
    !quiz?.id ||
    isChangingQuiz.value
  ) {
    return
  }

  isChangingQuiz.value = quiz.id

  try {
    if (nextStatus === 'published') {
      await publishQuiz(quiz.id)
    } else if (nextStatus === 'closed') {
      await closeQuiz(quiz.id)
    } else {
      await draftQuiz(quiz.id)
    }

    quizzes.value =
      await fetchQuizzesByLesson(
        lessonId.value
      )

    showUiMessage(
      nextStatus === 'published'
        ? 'Evaluación publicada correctamente.'
        : nextStatus === 'closed'
          ? 'Evaluación cerrada correctamente.'
          : 'Evaluación movida a borrador.'
    )
  } catch (error) {
    console.error(
      'Error cambiando evaluación:',
      error
    )

    showUiMessage(
      error?.message ||
      'No se pudo actualizar la evaluación.',
      'error'
    )
  } finally {
    isChangingQuiz.value = null
  }
}

const deleteQuiz = async quiz => {
  if (
    !isTeacher.value ||
    !quiz?.id
  ) {
    return
  }

  const confirmed =
    window.confirm(
      `¿Eliminar "${quiz.title}"? Esta acción eliminará sus preguntas e intentos asociados.`
    )

  if (!confirmed) {
    return
  }

  isChangingQuiz.value = quiz.id

  try {
    await removeQuiz(quiz.id)

    quizzes.value =
      quizzes.value.filter(
        item => item.id !== quiz.id
      )

    showUiMessage('Evaluación eliminada correctamente.')
  } catch (error) {
    console.error(
      'Error eliminando evaluación:',
      error
    )

    showUiMessage(
      error?.message ||
      'No se pudo eliminar la evaluación.',
      'error'
    )
  } finally {
    isChangingQuiz.value = null
  }
}

const formatDate = value => {

  if (!value) {

    return '—'

  }

  const parts = String(value).split('-')

  if (parts.length === 3) {

    const [year, month, day] = parts

    return `${day}/${month}/${year}`

  }

  return value

}

const isOverdue = task => {

  if (!task?.dueDate) {

    return false

  }

  const dueDate =

    new Date(`${task.dueDate}T23:59:59`)

  return (

    !Number.isNaN(dueDate.getTime()) &&

    dueDate < new Date()

  )

}

/* =========================================================
   MATERIALES
========================================================= */
const getMaterialVoice = material =>

  material?.voice || 'general'

const getVoiceLabel = voice => {

  if (!voice || voice === 'general') {

    return 'General'

  }

  return voice

}

const getVoiceShort = voice => {

  const labels = {

    general: 'ALL',

    Soprano: 'S',

    Alto: 'A',

    Tenor: 'T',

    Bajo: 'B'

  }

  return labels[voice] || 'ALL'

}

const getMaterialType = material => {

  const labels = {

    pdf: 'PDF',

    score: 'Partitura',

    audio: 'Audio',

    video: 'Video',

    image: 'Imagen',

    other: 'Archivo'

  }

  return labels[material?.type] || 'Material'

}

const getMaterialIcon = material => {

  const icons = {

    pdf: 'PDF',

    score: '♫',

    audio: '♪',

    video: '▶',

    image: 'IMG',

    other: 'FILE'

  }

  return icons[material?.type] || '•'

}

/* =========================================================
   VISOR
========================================================= */
const activeMaterial = ref(null)

const viewerWindow = ref(null)

const viewerBody = ref(null)

const pdfCanvas = ref(null)

const isLoadingViewer = ref(false)

const isRenderingPdf = ref(false)

const viewerError = ref('')

const pdfDocument = ref(null)

const currentPage = ref(1)

const pageCount = ref(0)

const zoom = ref(1)

let currentRenderTask = null
let pdfLoadingTask = null
let pdfFetchController = null
let lastFocusedElement = null
let previousBodyOverflow = ''

const previewKind = computed(() => {

  const material = activeMaterial.value

  if (!material) {

    return 'other'

  }

  const mime =

    String(material.mimeType || '')

      .toLowerCase()

  const fileName =

    String(

      material.fileName ||

      material.url ||

      ''

    ).toLowerCase()

  if (

    mime.includes('pdf') ||

    fileName.includes('.pdf') ||

    material.type === 'pdf' ||

    (

      material.type === 'score' &&

      (

        mime.includes('pdf') ||

        fileName.includes('.pdf')

      )

    )

  ) {

    return 'pdf'

  }

  if (

    mime.startsWith('audio/') ||

    /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(fileName) ||

    material.type === 'audio'

  ) {

    return 'audio'

  }

  if (

    mime.startsWith('video/') ||

    /\.(mp4|webm|mov|m4v)$/i.test(fileName) ||

    material.type === 'video'

  ) {

    return 'video'

  }

  if (

    mime.startsWith('image/') ||

    /\.(jpg|jpeg|png|webp|gif)$/i.test(fileName) ||

    material.type === 'image'

  ) {

    return 'image'

  }

  return 'other'

})

const canPrint = computed(() =>

  previewKind.value === 'pdf' ||

  previewKind.value === 'image'

)

const destroyPdfResources = async () => {
  if (currentRenderTask) {
    try {
      currentRenderTask.cancel()
    } catch {
      // Render ya finalizado.
    }
    currentRenderTask = null
  }

  if (pdfFetchController) {
    pdfFetchController.abort()
    pdfFetchController = null
  }

  if (pdfLoadingTask) {
    try {
      await pdfLoadingTask.destroy()
    } catch {
      // La tarea ya puede haberse destruido.
    }
    pdfLoadingTask = null
  }

  if (pdfDocument.value) {
    try {
      await pdfDocument.value.destroy()
    } catch {
      // Documento ya liberado.
    }
    pdfDocument.value = null
  }
}

const openMaterial = async material => {
  if (!material?.url) {
    showUiMessage(
      'Este material todavía no tiene archivo.',
      'error'
    )
    return
  }

  await destroyPdfResources()

  lastFocusedElement = document.activeElement
  activeMaterial.value = material

  previousBodyOverflow = document.body.style.overflow
  document.body.style.overflow = 'hidden'

  viewerError.value = ''
  currentPage.value = 1
  pageCount.value = 0
  zoom.value = 1

  await nextTick()
  viewerWindow.value?.focus()

  if (previewKind.value === 'pdf') {
    await loadPdf()
  }
}

const loadPdf = async () => {

  const material = activeMaterial.value

  if (!material?.url) {

    return

  }

  isLoadingViewer.value = true

  viewerError.value = ''

  try {

    pdfFetchController = new AbortController()

    const response = await fetch(
      material.url,
      {
        cache: 'no-store',
        signal: pdfFetchController.signal
      }
    )

    if (!response.ok) {

      throw new Error(

        `HTTP ${response.status}`

      )

    }

    const arrayBuffer =

      await response.arrayBuffer()

    pdfLoadingTask =
      pdfjsLib.getDocument({
        data: arrayBuffer
      })

    pdfDocument.value =
      await pdfLoadingTask.promise

    pdfLoadingTask = null
    pdfFetchController = null

    pageCount.value =

      pdfDocument.value.numPages

    await nextTick()

    await renderPdfPage()

  } catch (error) {
    if (error?.name !== 'AbortError') {
      console.error(
        'Error cargando PDF:',
        error
      )

      viewerError.value =
        'No se pudo cargar el PDF.'
    }
  } finally {

    isLoadingViewer.value = false

  }

}

const renderPdfPage = async () => {

  if (

    !pdfDocument.value ||

    !pdfCanvas.value

  ) {

    return

  }

  isRenderingPdf.value = true

  try {

    if (currentRenderTask) {

      try {

        currentRenderTask.cancel()

      } catch {

        // Sin acción.

      }

      currentRenderTask = null

    }

    const page =

      await pdfDocument.value.getPage(

        currentPage.value

      )

    const baseViewport =

      page.getViewport({

        scale: 1

      })

    const containerWidth =

      viewerBody.value?.clientWidth ||

      window.innerWidth

    const availableWidth =

      Math.max(

        280,

        containerWidth - 24

      )

    const fitScale =

      availableWidth /

      baseViewport.width

    const finalScale =

      fitScale * zoom.value

    const viewport =

      page.getViewport({

        scale: finalScale

      })

    const canvas = pdfCanvas.value

    const context =

      canvas.getContext('2d')

    const pixelRatio =

      Math.min(

        window.devicePixelRatio || 1,

        2

      )

    canvas.width =

      Math.floor(

        viewport.width *

        pixelRatio

      )

    canvas.height =

      Math.floor(

        viewport.height *

        pixelRatio

      )

    canvas.style.width =

      `${viewport.width}px`

    canvas.style.height =

      `${viewport.height}px`

    context.setTransform(

      pixelRatio,

      0,

      0,

      pixelRatio,

      0,

      0

    )

    currentRenderTask =

      page.render({

        canvasContext: context,

        viewport

      })

    await currentRenderTask.promise

    currentRenderTask = null

  } catch (error) {

    if (

      error?.name !==

      'RenderingCancelledException'

    ) {

      console.error(

        'Error renderizando PDF:',

        error

      )

    }

  } finally {

    isRenderingPdf.value = false

  }

}

const previousPage = async () => {

  if (currentPage.value <= 1) {

    return

  }

  currentPage.value--

  viewerBody.value?.scrollTo({

    top: 0,

    behavior: 'smooth'

  })

  await renderPdfPage()

}

const nextPage = async () => {

  if (

    currentPage.value >=

    pageCount.value

  ) {

    return

  }

  currentPage.value++

  viewerBody.value?.scrollTo({

    top: 0,

    behavior: 'smooth'

  })

  await renderPdfPage()

}

const zoomIn = async () => {

  zoom.value =

    Math.min(

      2.2,

      zoom.value + 0.15

    )

  await renderPdfPage()

}

const zoomOut = async () => {

  zoom.value =

    Math.max(

      0.7,

      zoom.value - 0.15

    )

  await renderPdfPage()

}

const fitWidth = async () => {

  zoom.value = 1

  await renderPdfPage()

}

const closeMaterial = async () => {
  await destroyPdfResources()

  activeMaterial.value = null
  viewerError.value = ''
  isLoadingViewer.value = false
  isRenderingPdf.value = false
  currentPage.value = 1
  pageCount.value = 0
  zoom.value = 1

  document.body.style.overflow = previousBodyOverflow

  await nextTick()

  if (
    lastFocusedElement &&
    typeof lastFocusedElement.focus === 'function'
  ) {
    lastFocusedElement.focus()
  }

  lastFocusedElement = null
}

const downloadMaterial = async () => {

  const material = activeMaterial.value

  if (!material?.url) {

    return

  }

  try {

    const response =

      await fetch(material.url)

    if (!response.ok) {

      throw new Error(

        `HTTP ${response.status}`

      )

    }

    const blob =

      await response.blob()

    const objectUrl =

      URL.createObjectURL(blob)

    const link =

      document.createElement('a')

    link.href = objectUrl

    link.download =

      material.fileName ||

      material.title ||

      'material'

    document.body.appendChild(link)

    link.click()

    link.remove()

    setTimeout(() => {

      URL.revokeObjectURL(objectUrl)

    }, 1500)

  } catch (error) {

    console.error(

      'Error descargando material:',

      error

    )

    window.open(

      material.url,

      '_blank',

      'noopener,noreferrer'

    )

  }

}

const openPrintVersion = () => {

  const material = activeMaterial.value

  if (!material?.url) {

    return

  }

  window.open(

    material.url,

    '_blank',

    'noopener,noreferrer'

  )

}

const formatBytes = bytes => {

  const value = Number(bytes)

  if (!value) {

    return '—'

  }

  if (value < 1024) {

    return `${value} B`

  }

  if (value < 1024 * 1024) {

    return `${(

      value / 1024

    ).toFixed(1)} KB`

  }

  return `${(

    value /

    (1024 * 1024)

  ).toFixed(1)} MB`

}

/* =========================================================
   EVENTOS
========================================================= */
const handleEscape = event => {

  if (

    event.key === 'Escape' &&

    activeMaterial.value

  ) {

    closeMaterial()

  }

}

let resizeTimer = null

const handleResize = () => {

  if (

    previewKind.value !== 'pdf' ||

    !pdfDocument.value

  ) {

    return

  }

  clearTimeout(resizeTimer)

  resizeTimer =

    setTimeout(() => {

      renderPdfPage()

    }, 180)

}

watch(

  () => route.params.id,

  () => {

    closeMaterial()

    loadClasswork()

  }

)

onMounted(() => {
  loadClasswork()

  availabilityTimer = window.setInterval(() => {
    nowMs.value = Date.now()
  }, 30000)

  window.addEventListener(
    'keydown',
    handleEscape
  )

  window.addEventListener(
    'resize',
    handleResize
  )
})

onUnmounted(() => {
  loadRequestId++

  window.removeEventListener(
    'keydown',
    handleEscape
  )

  window.removeEventListener(
    'resize',
    handleResize
  )

  clearTimeout(resizeTimer)
  clearTimeout(uiMessageTimer)

  if (availabilityTimer) {
    window.clearInterval(availabilityTimer)
    availabilityTimer = null
  }

  destroyPdfResources()
  document.body.style.overflow = previousBodyOverflow
})

</script>

<style lang="scss" scoped>

@use '@/assets/styles/abstracts/variables' as variables;

.classwork {

  width: 100%;

  max-width: 1220px;

  margin: 0 auto;

}

.classwork__back {

  display: inline-block;

  margin-bottom: variables.$spacing-xl;

  color: variables.$color-primary;

  font-weight: variables.$font-weight-semibold;

  text-decoration: none;

}

.classwork__back:hover {

  text-decoration: underline;

}

.classwork__hero {

  display: flex;

  gap: variables.$spacing-2xl;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: variables.$spacing-2xl;

}

.classwork__hero-copy {

  max-width: 820px;

}

.classwork__eyebrow {

  margin: 0 0 variables.$spacing-sm;

  color: variables.$color-primary;

  font-size: variables.$font-size-sm;

  font-weight: variables.$font-weight-semibold;

  letter-spacing: 0.15em;

  text-transform: uppercase;

}

.classwork__hero h1 {

  margin: 0 0 variables.$spacing-md;

  font-size: clamp(3rem, 6vw, 5rem);

}

.classwork__hero-copy > p:last-child {

  margin: 0;

  line-height: 1.65;

  opacity: 0.65;

}

.classwork__hero-status {

  min-width: 230px;

  padding: variables.$spacing-lg;

  border: 1px solid variables.$color-primary;

  border-radius: variables.$radius-lg;

  background: variables.$color-surface;

}

.classwork__hero-status span,

.classwork__hero-status strong,

.classwork__hero-status small {

  display: block;

}

.classwork__hero-status span {

  color: variables.$color-primary;

  font-size: variables.$font-size-xs;

  letter-spacing: 0.12em;

}

.classwork__hero-status strong {

  margin: 5px 0;

  font-size: 1.25rem;

}

.classwork__hero-status small {

  opacity: 0.45;

}

.classwork__summary {

  display: grid;

  gap: variables.$spacing-md;

  grid-template-columns: repeat(5, minmax(0, 1fr));

  margin-bottom: variables.$spacing-3xl;

}

.classwork__summary article {

  min-width: 0;

  padding: variables.$spacing-lg;

  border: 1px solid variables.$color-border;

  border-radius: variables.$radius-lg;

  background: variables.$color-surface;

}

.classwork__summary span,

.classwork__summary strong,

.classwork__summary small {

  display: block;

}

.classwork__summary span {

  margin-bottom: 8px;

  color: variables.$color-primary;

  font-size: variables.$font-size-xs;

  letter-spacing: 0.1em;

}

.classwork__summary strong {

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 1.35rem;

}

.classwork__summary small {

  margin-top: 4px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  opacity: 0.45;

}

.summary-date {

  font-size: 1.05rem !important;

}

.system-message {

  display: flex;

  gap: variables.$spacing-md;

  align-items: center;

  margin-bottom: variables.$spacing-2xl;

  padding: variables.$spacing-lg;

  border: 1px solid variables.$color-border;

  border-radius: variables.$radius-lg;

  background: variables.$color-surface;

}

.system-message > span {

  display: grid;

  width: 42px;

  height: 42px;

  flex-shrink: 0;

  place-items: center;

  border-radius: 50%;

}

.system-message div {

  min-width: 0;

  flex: 1;

}

.system-message p {

  margin: 4px 0 0;

  opacity: 0.6;

}

.system-message button {

  padding: variables.$spacing-sm variables.$spacing-md;

  border: 1px solid currentColor;

  border-radius: variables.$radius-lg;

  background: transparent;

  color: inherit;

  font: inherit;

  cursor: pointer;

}

.system-message--error {

  border-color: #d85151;

}

.system-message--error > span,

.system-message--error strong {

  color: #ff7777;

}

.classwork__loading {

  display: grid;

  min-height: 280px;

  gap: variables.$spacing-sm;

  place-items: center;

  align-content: center;

  margin-bottom: variables.$spacing-3xl;

  padding: variables.$spacing-2xl;

  border: 1px dashed variables.$color-border;

  border-radius: variables.$radius-lg;

  text-align: center;

}

.classwork__loading p {

  margin: 0;

  opacity: 0.45;

}

.classwork__section {

  margin-bottom: variables.$spacing-3xl;

}

.classwork__section-title {

  display: flex;

  gap: variables.$spacing-lg;

  align-items: center;

  margin-bottom: variables.$spacing-xl;

}

.classwork__section-title > span {

  display: grid;

  width: 52px;

  height: 52px;

  flex-shrink: 0;

  place-items: center;

  border: 1px solid variables.$color-primary;

  border-radius: 50%;

  color: variables.$color-primary;

  font-weight: variables.$font-weight-bold;

}

.classwork__section-title p {

  margin: 0;

  color: variables.$color-primary;

  font-size: variables.$font-size-sm;

  font-weight: variables.$font-weight-semibold;

  text-transform: uppercase;

}

.classwork__section-title h2 {

  margin: 0;

  font-size: clamp(2rem, 4vw, 3rem);

}

.classwork__section-title--actions .section-heading-copy {

  flex: 1;

}

.primary-action,

.secondary-action {

  padding: variables.$spacing-sm variables.$spacing-md;

  border-radius: variables.$radius-lg;

  font-weight: variables.$font-weight-semibold;

  text-decoration: none;

}

.primary-action {

  border: 1px solid variables.$color-primary;

  background: variables.$color-primary;

  color: variables.$color-white;

}

.secondary-action {

  border: 1px solid variables.$color-primary;

  background: transparent;

  color: variables.$color-primary;

}

.class-activity {

  display: grid;

  gap: variables.$spacing-xl;

  align-items: start;

  min-height: 220px;

  padding: variables.$spacing-2xl;

  border: 1px solid variables.$color-border;

  border-radius: variables.$radius-lg;

  background:

    radial-gradient(

      circle at 90% 10%,

      rgba(variables.$color-primary, 0.14),

      transparent 35%

    ),

    variables.$color-surface;

  grid-template-columns: auto 1fr;

}

.class-activity__icon {

  display: grid;

  width: 70px;

  height: 70px;

  place-items: center;

  border: 1px solid variables.$color-primary;

  border-radius: 50%;

  color: variables.$color-primary;

  font-size: 1.8rem;

}

.class-activity__content > span {

  color: variables.$color-primary;

  font-size: variables.$font-size-xs;

  letter-spacing: 0.12em;

}

.class-activity__content h3 {

  margin: variables.$spacing-sm 0 variables.$spacing-md;

  font-size: variables.$font-size-xl;

}

.class-activity__content p {

  max-width: 800px;

  line-height: 1.65;

  opacity: 0.65;

}

.meta-pills {

  display: flex;

  gap: variables.$spacing-sm;

  flex-wrap: wrap;

  margin-top: variables.$spacing-lg;

}

.meta-pills span {

  padding: 6px 10px;

  border: 1px solid variables.$color-border;

  border-radius: 999px;

  font-size: variables.$font-size-xs;

  opacity: 0.65;

}

.classwork__grid {

  display: grid;

  gap: variables.$spacing-lg;

  grid-template-columns: repeat(2, minmax(0, 1fr));

}

.resource-card {

  display: flex;

  min-height: 320px;

  padding: variables.$spacing-xl;

  border: 1px solid variables.$color-border;

  border-radius: variables.$radius-lg;

  outline: none;

  background: variables.$color-surface;

  flex-direction: column;

  cursor: pointer;

  transition: 0.2s ease;

}

.resource-card:hover,

.resource-card:focus-visible {

  border-color: variables.$color-primary;

  transform: translateY(-3px);

}

.resource-card__top {

  display: flex;

  align-items: center;

  justify-content: space-between;

  margin-bottom: variables.$spacing-lg;

}

.resource-card__icon {

  display: grid;

  width: 58px;

  height: 58px;

  place-items: center;

  border: 1px solid variables.$color-primary;

  border-radius: 50%;

  color: variables.$color-primary;

  font-size: 0.8rem;

  font-weight: variables.$font-weight-bold;

}

.resource-card__voice {

  display: flex;

  gap: 6px;

  align-items: center;

  padding: 0.35rem 0.65rem;

  border: 1px solid variables.$color-primary;

  border-radius: 999px;

  color: variables.$color-primary;

  font-size: variables.$font-size-xs;

}

.resource-card__voice span {

  display: grid;

  width: 23px;

  height: 23px;

  place-items: center;

  border-radius: 50%;

  background: variables.$color-primary;

  color: variables.$color-white;

}

.resource-card__voice--general {

  border-color: variables.$color-border;

  color: variables.$color-white;

  opacity: 0.55;

}

.resource-card__voice--general span {

  background: variables.$color-border;

}

.resource-card__type {

  margin-bottom: variables.$spacing-md;

  color: variables.$color-primary;

  font-size: variables.$font-size-sm;

  font-weight: variables.$font-weight-semibold;

  letter-spacing: 0.1em;

  text-transform: uppercase;

}

.resource-card h3 {

  margin: 0 0 variables.$spacing-md;

  font-size: variables.$font-size-xl;

}

.resource-card p {

  margin: 0 0 variables.$spacing-xl;

  line-height: 1.55;

  opacity: 0.65;

}

.resource-card__file {

  display: flex;

  gap: 10px;

  justify-content: space-between;

  margin-bottom: variables.$spacing-lg;

  padding: variables.$spacing-sm variables.$spacing-md;

  border: 1px solid variables.$color-border;

  border-radius: variables.$radius-lg;

  font-size: variables.$font-size-xs;

  opacity: 0.55;

}

.resource-card__file span {

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

}

.resource-card button {

  margin-top: auto;

  padding: 0;

  border: 0;

  background: transparent;

  color: variables.$color-primary;

  font: inherit;

  font-weight: variables.$font-weight-semibold;

  text-align: left;

  cursor: pointer;

}

.tasks {

  display: grid;

  gap: variables.$spacing-md;

}

.task-card {

  display: grid;

  gap: variables.$spacing-lg;

  align-items: center;

  padding: variables.$spacing-xl;

  border: 1px solid variables.$color-border;

  border-radius: variables.$radius-lg;

  background: variables.$color-surface;

  color: inherit;

  text-decoration: none;

  grid-template-columns: auto 1fr auto;

  transition: 0.2s ease;

}

.task-card:hover {

  border-color: variables.$color-primary;

  transform: translateY(-2px);

}

.task-card__icon {

  display: grid;

  width: 58px;

  height: 58px;

  place-items: center;

  border-radius: 50%;

  background: variables.$color-primary;

  color: variables.$color-white;

  font-size: 1.15rem;

}

.task-card__badges {

  display: flex;

  gap: 7px;

  flex-wrap: wrap;

}

.task-card__badges span {

  padding: 4px 8px;

  border: 1px solid variables.$color-border;

  border-radius: 999px;

  color: variables.$color-primary;

  font-size: variables.$font-size-xs;

}

.task-status--draft {

  opacity: 0.5;

}

.task-card__content h3 {

  margin: variables.$spacing-sm 0;

}

.task-card__content > p {

  margin: 0;

  line-height: 1.55;

  opacity: 0.65;

}

.task-card__meta {

  display: flex;

  gap: 7px;

  flex-wrap: wrap;

  margin-top: variables.$spacing-md;

}

.task-card__meta span {

  padding: 5px 8px;

  border: 1px solid variables.$color-border;

  border-radius: 999px;

  font-size: variables.$font-size-xs;

  opacity: 0.65;

}

.task-card__meta .is-overdue {

  border-color: #d85151;

  color: #ff7777;

  opacity: 1;

}

.task-card__arrow {

  color: variables.$color-primary;

  font-size: 2rem;

}

.empty-state {

  display: flex;

  gap: variables.$spacing-xl;

  align-items: center;

  padding: variables.$spacing-xl;

  border: 1px dashed variables.$color-border;

  border-radius: variables.$radius-lg;

}

.empty-state > span {

  display: grid;

  width: 52px;

  height: 52px;

  flex-shrink: 0;

  place-items: center;

  border-radius: 50%;

  background: variables.$color-surface;

  color: variables.$color-primary;

}

.empty-state h3,

.empty-state p {

  margin: 0;

}

.empty-state p {

  margin-top: 4px;

  opacity: 0.55;

}

/* =========================================================
   VISOR
========================================================= */

.section-description {
  display: block;
  margin-top: 6px;
  color: rgba(255, 255, 255, 0.48);
  font-size: 0.78rem;
  line-height: 1.5;
}

.quiz-grid {
  display: grid;
  gap: variables.$spacing-lg;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.quiz-card {
  position: relative;
  display: flex;
  min-height: 360px;
  padding: variables.$spacing-xl;
  overflow: hidden;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(variables.$color-primary, 0.08),
      transparent 35%
    ),
    variables.$color-surface;
  flex-direction: column;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;
}

.quiz-card:hover {
  border-color: rgba(variables.$color-primary, 0.7);
  transform: translateY(-2px);
}

.quiz-card--draft {
  opacity: 0.82;
}

.quiz-card--closed {
  background: variables.$color-surface;
}

.quiz-card__top {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.quiz-card__icon {
  display: grid;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 1.25rem;
  font-weight: 800;
}

.quiz-card--test .quiz-card__icon {
  background: variables.$color-primary;
  color: #090909;
}

.quiz-card__badges {
  display: flex;
  gap: 6px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.quiz-card__badges span {
  padding: 4px 8px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.quiz-card__status--published {
  border-color: rgba(variables.$color-primary, 0.65) !important;
}

.quiz-card__status--draft {
  color: rgba(255, 255, 255, 0.45) !important;
}

.quiz-card__status--closed {
  color: #ffb66d !important;
}

.quiz-card__content {
  margin-top: variables.$spacing-xl;
}

.quiz-card__eyebrow {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.1em;
}

.quiz-card__content h3 {
  margin: variables.$spacing-sm 0 variables.$spacing-md;
  font-size: 1.35rem;
}

.quiz-card__content p {
  margin: 0;
  color: rgba(255, 255, 255, 0.58);
  line-height: 1.55;
}

.quiz-card__stats {
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-top: variables.$spacing-xl;
}

.quiz-card__stats article {
  min-width: 0;
  padding: 10px 7px;
  border: 1px solid variables.$color-border;
  border-radius: 10px;
  text-align: center;
}

.quiz-card__stats strong,
.quiz-card__stats small {
  display: block;
}

.quiz-card__stats strong {
  overflow: hidden;
  color: variables.$color-primary;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.88rem;
}

.quiz-card__stats small {
  margin-top: 3px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.62rem;
}

.quiz-card__availability {
  display: flex;
  gap: 7px;
  align-items: center;
  margin-top: variables.$spacing-lg;
  color: rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
}

.availability-dot {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.availability-dot--active {
  background: variables.$color-primary;
  box-shadow: 0 0 0 5px rgba(variables.$color-primary, 0.08);
}

.quiz-card__actions {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: auto;
  padding-top: variables.$spacing-lg;
}

.quiz-card__actions button {
  min-height: 36px;
  padding: 7px 11px;
  border: 1px solid variables.$color-border;
  border-radius: 9px;
  background: transparent;
  color: variables.$color-white;
  font: inherit;
  font-size: 0.72rem;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

.quiz-card__actions button:hover:not(:disabled) {
  border-color: variables.$color-primary;
  color: variables.$color-primary;
}

.quiz-card__actions button:disabled {
  opacity: 0.4;
  cursor: wait;
}

.quiz-card__actions .quiz-card__delete:hover:not(:disabled) {
  border-color: #d85151;
  color: #ff7777;
}


.quiz-card__student-message strong {
  font-size: 0.72rem;
}

.quiz-card__student-message small {
  margin-top: 2px;
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.65rem;
}

.empty-state--evaluation {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
}

.empty-state__action {
  padding: variables.$spacing-sm variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  color: variables.$color-primary;
  font-size: 0.8rem;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.viewer-overlay {

  position: fixed;

  inset: 0;

  z-index: 99999;

  display: grid;

  place-items: center;

  padding: 16px;

  background: rgba(0, 0, 0, 0.96);

}

.viewer-window {

  display: flex;

  width: min(1400px, 98vw);

  height: 96vh;

  overflow: hidden;

  border: 1px solid variables.$color-border;

  border-radius: variables.$radius-lg;

  background: variables.$color-background;

  flex-direction: column;

}

.viewer-header {

  display: flex;

  gap: 16px;

  align-items: center;

  justify-content: space-between;

  padding: 10px 14px;

  border-bottom: 1px solid variables.$color-border;

  background: variables.$color-surface;

}

.viewer-header__main {

  display: flex;

  gap: 12px;

  align-items: center;

  min-width: 0;

}

.viewer-header__icon {

  display: grid;

  width: 44px;

  height: 44px;

  flex-shrink: 0;

  place-items: center;

  border: 1px solid variables.$color-primary;

  border-radius: 50%;

  color: variables.$color-primary;

  font-size: 0.7rem;

}

.viewer-header__info {

  min-width: 0;

}

.viewer-header__info h2 {

  margin: 4px 0;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  font-size: 1.1rem;

}

.viewer-header__info p {

  margin: 0;

  font-size: 0.72rem;

  opacity: 0.5;

}

.viewer-badges {

  display: flex;

  gap: 5px;

}

.viewer-badges span {

  padding: 2px 6px;

  border: 1px solid variables.$color-primary;

  border-radius: 999px;

  color: variables.$color-primary;

  font-size: 0.6rem;

}

.viewer-header__actions {

  display: flex;

  gap: 7px;

}

.viewer-header__actions button {

  padding: 8px 11px;

  border: 1px solid variables.$color-border;

  border-radius: variables.$radius-lg;

  background: variables.$color-background;

  color: variables.$color-white;

  font: inherit;

  cursor: pointer;

}

.viewer-header__actions button:hover {

  border-color: variables.$color-primary;

  color: variables.$color-primary;

}

.viewer-close {

  width: 42px;

  font-size: 1.5rem !important;

}

.pdf-toolbar {

  display: flex;

  gap: 12px;

  align-items: center;

  justify-content: space-between;

  padding: 8px 12px;

  border-bottom: 1px solid variables.$color-border;

  background: #171717;

}

.pdf-toolbar__pages,

.pdf-toolbar__zoom {

  display: flex;

  gap: 7px;

  align-items: center;

}

.pdf-toolbar button {

  min-width: 38px;

  min-height: 38px;

  padding: 6px 10px;

  border: 1px solid variables.$color-border;

  border-radius: 8px;

  background: variables.$color-surface;

  color: variables.$color-white;

  font: inherit;

  cursor: pointer;

}

.pdf-toolbar button:hover:not(:disabled) {

  border-color: variables.$color-primary;

  color: variables.$color-primary;

}

.pdf-toolbar button:disabled {

  opacity: 0.25;

  cursor: default;

}

.pdf-toolbar span {

  font-size: 0.8rem;

}

.pdf-toolbar strong {

  color: variables.$color-primary;

}

.fit-button {

  min-width: 75px !important;

}

.viewer-body {

  position: relative;

  min-height: 0;

  flex: 1;

  overflow: auto;

  background: #383838;

  overscroll-behavior: contain;

}

.pdf-stage {

  position: relative;

  display: flex;

  min-height: 100%;

  padding: 12px;

  align-items: flex-start;

  justify-content: center;

}

.pdf-paper {

  flex-shrink: 0;

  overflow: hidden;

  background: white;

  box-shadow: 0 8px 35px rgba(0, 0, 0, 0.55);

}

.pdf-canvas {

  display: block;

  max-width: none;

  background: white;

}

.pdf-rendering {

  position: absolute;

  top: 20px;

  left: 50%;

  z-index: 20;

  padding: 7px 12px;

  border-radius: 999px;

  background: rgba(0, 0, 0, 0.8);

  color: white;

  font-size: 0.7rem;

  transform: translateX(-50%);

}

.viewer-loading,

.viewer-error {

  display: grid;

  min-height: 100%;

  gap: 12px;

  place-items: center;

  align-content: center;

  padding: 30px;

  text-align: center;

}

.viewer-loading p,

.viewer-error p {

  margin: 0;

  opacity: 0.5;

}

.loading-spinner {

  width: 46px;

  height: 46px;

  border: 3px solid variables.$color-border;

  border-top-color: variables.$color-primary;

  border-radius: 50%;

  animation: spin 0.8s linear infinite;

}

@keyframes spin {

  to {

    transform: rotate(360deg);

  }

}

.viewer-error__icon {

  display: grid;

  width: 70px;

  height: 70px;

  place-items: center;

  border: 1px solid variables.$color-primary;

  border-radius: 50%;

  color: variables.$color-primary;

  font-size: 2rem;

}

.viewer-error button,

.other-viewer button {

  padding: variables.$spacing-md variables.$spacing-xl;

  border: 0;

  border-radius: variables.$radius-lg;

  background: variables.$color-primary;

  color: variables.$color-white;

  cursor: pointer;

}

.audio-viewer,

.other-viewer {

  display: grid;

  min-height: 100%;

  gap: 12px;

  place-items: center;

  align-content: center;

  padding: 30px;

  text-align: center;

}

.audio-viewer__icon {

  display: grid;

  width: 90px;

  height: 90px;

  place-items: center;

  border: 1px solid variables.$color-primary;

  border-radius: 50%;

  color: variables.$color-primary;

  font-size: 2rem;

}

.audio-viewer > span {

  color: variables.$color-primary;

  font-size: variables.$font-size-xs;

  letter-spacing: 0.12em;

}

.audio-viewer h3,

.audio-viewer p {

  margin: 0;

}

.audio-viewer p {

  opacity: 0.55;

}

.audio-viewer audio {

  width: min(600px, 90vw);

  margin-top: variables.$spacing-lg;

}

.video-viewer {

  width: 100%;

  height: 100%;

  background: black;

  object-fit: contain;

}

.image-viewer {

  display: grid;

  min-height: 100%;

  place-items: center;

  padding: 15px;

}

.image-viewer img {

  max-width: 100%;

  max-height: 100%;

  object-fit: contain;

}

.other-viewer > div {

  display: grid;

  width: 90px;

  height: 90px;

  place-items: center;

  border: 1px solid variables.$color-primary;

  border-radius: 50%;

  color: variables.$color-primary;

  font-size: 0.8rem;

}

.other-viewer h3,

.other-viewer p {

  margin: 0;

}

.other-viewer p {

  opacity: 0.55;

}

.mobile-actions {

  display: none;

}

.viewer-enter-active,

.viewer-leave-active {

  transition: opacity 0.18s ease;

}

.viewer-enter-from,

.viewer-leave-to {

  opacity: 0;

}

/* =========================================================
   RESPONSIVE
========================================================= */
@media (max-width: 1000px) {

  .classwork__summary {

    grid-template-columns: repeat(2, minmax(0, 1fr));

  }

  .classwork__grid,
  .quiz-grid {

    grid-template-columns: 1fr;

  }

}

@media (max-width: 760px) {

  .classwork__hero {

    align-items: stretch;

    flex-direction: column;

  }

  .classwork__hero-status {

    width: 100%;

  }

  .classwork__section-title--actions {

    align-items: stretch;

    flex-wrap: wrap;

  }

  .classwork__section-title--actions .section-heading-copy {

    min-width: calc(100% - 75px);

  }

  .primary-action,

  .secondary-action {

    width: 100%;

    text-align: center;

  }

  .class-activity {

    grid-template-columns: 1fr;

  }

  .task-card {

    align-items: start;

    grid-template-columns: auto 1fr;

  }

  .task-card__arrow {

    display: none;

  }

  .viewer-overlay {

    padding: 0;

  }

  .viewer-window {

    width: 100vw;

    height: 100dvh;

    border: 0;

    border-radius: 0;

  }

  .viewer-header {

    padding: 8px 10px;

  }

  .viewer-header__actions button span {

    display: none;

  }

  .pdf-toolbar {

    flex-wrap: wrap;

  }

  .mobile-actions {

    display: grid;

    padding: 8px;

    border-top: 1px solid variables.$color-border;

    background: variables.$color-surface;

    grid-template-columns: repeat(3, 1fr);

  }

  .mobile-actions button {

    display: grid;

    gap: 3px;

    place-items: center;

    padding: 7px;

    border: 0;

    background: transparent;

    color: variables.$color-white;

    font: inherit;

    font-size: 0.65rem;

  }

  .mobile-actions strong {

    color: variables.$color-primary;

    font-size: 1.15rem;

  }

}

@media (max-width: 760px) {
  .empty-state--evaluation {
    grid-template-columns: auto minmax(0, 1fr);
  }

  .empty-state__action {
    grid-column: 2;
    justify-self: start;
  }
}

@media (max-width: 560px) {

  .classwork__summary {

    grid-template-columns: 1fr;

  }

  .task-card {

    grid-template-columns: 1fr;

  }

  .quiz-card__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .empty-state--evaluation {
    grid-template-columns: 1fr;
  }

  .empty-state__action {
    grid-column: auto;
  }

  .task-card__icon {

    width: 48px;

    height: 48px;

  }

  .empty-state {

    align-items: flex-start;

  }

  .pdf-toolbar {

    justify-content: center;

  }

}

/* =========================================================
   EVALUACIONES · DISPONIBILIDAD Y ACCESO
========================================================= */

.quiz-card__window {
  display: grid;
  gap: 8px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: 12px;
}

.quiz-card__window > span {
  min-width: 0;
  padding: 9px 10px;
  border: 1px solid variables.$color-border;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.015);
}

.quiz-card__window small,
.quiz-card__window strong {
  display: block;
}

.quiz-card__window small {
  margin-bottom: 3px;
  color: rgba(255, 255, 255, 0.35);
  font-size: 0.58rem;
  letter-spacing: 0.08em;
}

.quiz-card__window strong {
  overflow: hidden;
  color: rgba(255, 255, 255, 0.76);
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.68rem;
  font-weight: variables.$font-weight-semibold;
}

.availability-dot--warning {
  background: #e5ac43;
  box-shadow: 0 0 0 5px rgba(229, 172, 67, 0.08);
}

.availability-dot--closed {
  background: #d85151;
  box-shadow: 0 0 0 5px rgba(216, 81, 81, 0.07);
}

.quiz-card__availability--available {
  color: rgba(255, 255, 255, 0.62);
}

.quiz-card__availability--upcoming {
  color: #ffd071;
}

.quiz-card__availability--expired,
.quiz-card__availability--closed {
  color: #ff8a8a;
}

.quiz-card--runtime-upcoming,
.quiz-card--runtime-expired {
  border-color: rgba(255, 255, 255, 0.12);
}

.quiz-card__student-footer {
  margin-top: auto;
  padding-top: variables.$spacing-lg;
}

.quiz-card__student-action {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  min-height: 52px;
  padding: 14px 16px;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background:
    linear-gradient(
      135deg,
      rgba(variables.$color-primary, 0.12),
      rgba(variables.$color-primary, 0.03)
    );
  color: variables.$color-white;
  text-decoration: none;
  transition:
    transform 0.18s ease,
    background 0.18s ease,
    border-color 0.18s ease;
}

.quiz-card__student-action:hover,
.quiz-card__student-action:focus-visible {
  border-color: variables.$color-primary;
  outline: none;
  transform: translateY(-2px);
  background:
    linear-gradient(
      135deg,
      rgba(variables.$color-primary, 0.18),
      rgba(variables.$color-primary, 0.05)
    );
}

.quiz-card__student-action span {
  color: variables.$color-primary;
  font-size: 0.68rem;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.11em;
}

.quiz-card__student-action strong {
  font-size: 0.82rem;
}

.quiz-card__student-action--disabled {
  border-color: variables.$color-border;
  background: rgba(255, 255, 255, 0.02);
  cursor: not-allowed;
  opacity: 0.62;
}

.quiz-card__student-action--disabled:hover {
  transform: none;
  background: rgba(255, 255, 255, 0.02);
}

.quiz-card__student-action--disabled span {
  color: rgba(255, 255, 255, 0.45);
}

/* =========================================================
   NOTIFICACIONES
========================================================= */

.classwork-notice {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100001;
  display: flex;
  gap: 10px;
  align-items: center;
  width: min(430px, calc(100vw - 32px));
  padding: 13px 15px;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  color: variables.$color-white;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.42);
}

.classwork-notice > span {
  display: grid;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.75rem;
  font-weight: 800;
}

.classwork-notice p {
  margin: 0;
  line-height: 1.45;
}

.classwork-notice--error {
  border-color: #d85151;
}

.classwork-notice--error > span {
  border-color: #d85151;
  color: #ff8a8a;
}

.notice-enter-active,
.notice-leave-active {
  transition:
    opacity 0.18s ease,
    transform 0.18s ease;
}

.notice-enter-from,
.notice-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@media (max-width: 560px) {
  .quiz-card__window {
    grid-template-columns: 1fr;
  }

  .quiz-card__student-action {
    align-items: flex-start;
    flex-direction: column;
  }

  .classwork-notice {
    right: 16px;
    bottom: 16px;
    left: 16px;
    width: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-card,
  .quiz-card__student-action,
  .notice-enter-active,
  .notice-leave-active,
  .viewer-enter-active,
  .viewer-leave-active {
    transition: none !important;
  }

  .loading-spinner {
    animation-duration: 1.8s;
  }
}

</style>
