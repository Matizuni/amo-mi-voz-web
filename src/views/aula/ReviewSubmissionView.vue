<template>
  <section class="review">
    <RouterLink
      :to="`/aula/clase/${lessonId}/tarea/${taskId}/entregas`"
      class="review__back"
    >
      ← Volver a entregas
    </RouterLink>

    <!-- =====================================================
         CARGA
    ====================================================== -->
    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="loading-spinner"></div>
      <h1>Cargando entrega...</h1>
      <p>Sincronizando archivo y evaluación con Supabase.</p>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <div class="state-card__icon">!</div>

      <h1>No pudimos cargar la entrega</h1>

      <p>{{ loadError }}</p>

      <div class="state-card__actions">
        <button
          type="button"
          @click="loadPage"
        >
          Reintentar
        </button>

        <RouterLink
          :to="`/aula/clase/${lessonId}/tarea/${taskId}/entregas`"
        >
          Volver
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         SIN PERMISO
    ====================================================== -->
    <section
      v-else-if="!isTeacher"
      class="state-card"
    >
      <div class="state-card__icon">!</div>
      <h1>Vista exclusiva del profesor</h1>
      <p>La revisión y calificación de entregas está reservada al docente.</p>
    </section>

    <!-- =====================================================
         REVISIÓN
    ====================================================== -->
    <template v-else-if="submission && task">
      <header class="review__hero">
        <div>
          <div class="review__eyebrow">
            <span>CLASE {{ lessonId }}</span>
            <span>{{ task.title }}</span>
            <span>SUPABASE</span>
          </div>

          <p class="review__kicker">Revisión de entrega</p>

          <h1>{{ submission.studentName }}</h1>

          <p class="review__description">
            Evalúa el trabajo del estudiante, revisa el archivo enviado
            y guarda la retroalimentación directamente en Supabase.
          </p>
        </div>

        <aside
          class="review__status"
          :class="{
            'review__status--reviewed':
              form.status === 'reviewed'
          }"
        >
          <span>ESTADO</span>
          <strong>{{ statusLabel }}</strong>

          <small>
            {{
              submission.reviewedAt
                ? `Última revisión: ${formatDateTime(submission.reviewedAt)}`
                : 'Aún sin revisión'
            }}
          </small>
        </aside>
      </header>

      <!-- ===================================================
           RESUMEN
      ==================================================== -->
      <section class="review__summary">
        <article>
          <span>ESTUDIANTE</span>
          <strong>{{ submission.studentName }}</strong>
          <small>ID {{ submission.studentId }}</small>
        </article>

        <article>
          <span>ARCHIVO</span>
          <strong>{{ submission.fileName || 'Sin nombre' }}</strong>
          <small>{{ formatFileSize(submission.fileSize) }}</small>
        </article>

        <article>
          <span>ENTREGADO</span>
          <strong>{{ submittedDate }}</strong>
          <small>{{ submittedTime }}</small>
        </article>

        <article>
          <span>PUNTAJE TAREA</span>
          <strong>{{ task.points ?? 100 }} pts</strong>
          <small>máximo</small>
        </article>

        <article>
          <span>NOTA</span>
          <strong>{{ form.grade || '—' }}</strong>
          <small>escala 1,0–7,0</small>
        </article>

        <article>
          <span>RÚBRICA</span>
          <strong>{{ rubricAverage }}/5</strong>
          <small>promedio actual</small>
        </article>
      </section>

      <div class="review__layout">
        <!-- =================================================
             ARCHIVO
        ================================================== -->
        <aside class="review-file">
          <div class="review-file__top">
            <div>
              <p class="review-file__label">Archivo entregado</p>
              <h2>{{ submission.fileName || 'Archivo del estudiante' }}</h2>
            </div>

            <span class="review-file__private">
              PRIVADO
            </span>
          </div>

          <div class="review-file__meta">
            <div>
              <span>Tipo</span>
              <strong>{{ fileTypeLabel }}</strong>
            </div>

            <div>
              <span>Tamaño</span>
              <strong>{{ formatFileSize(submission.fileSize) }}</strong>
            </div>

            <div>
              <span>Entrega</span>
              <strong>{{ formatDateTime(submission.submittedAt) }}</strong>
            </div>
          </div>

          <button
            type="button"
            class="review-file__open"
            :disabled="isOpeningFile"
            @click="openFile"
          >
            {{
              isOpeningFile
                ? 'Preparando archivo...'
                : 'Abrir archivo entregado'
            }}
          </button>

          <div class="review-file__notice">
            <strong>Acceso temporal</strong>
            <p>
              El archivo está almacenado en un bucket privado.
              Se abre mediante una URL firmada temporal.
            </p>
          </div>
        </aside>

        <!-- =================================================
             FORMULARIO
        ================================================== -->
        <main class="evaluation">
          <form @submit.prevent="saveReview">
            <header class="evaluation__header">
              <div>
                <p class="evaluation__label">Evaluación docente</p>
                <h2>Revisión del profesor</h2>
              </div>

              <span>GUARDADO EN SUPABASE</span>
            </header>

            <div
              v-if="saveMessage"
              class="evaluation__message"
              :class="{
                'evaluation__message--error':
                  saveMessageType === 'error'
              }"
            >
              {{ saveMessage }}
            </div>

            <!-- ESTADO -->
            <section class="evaluation-section">
              <div class="evaluation-section__heading">
                <span>01</span>

                <div>
                  <p>Estado</p>
                  <h3>Resultado de la revisión</h3>
                </div>
              </div>

              <div class="form-group">
                <label for="status">
                  Estado de la entrega
                </label>

                <select
                  id="status"
                  v-model="form.status"
                >
                  <option value="delivered">
                    Entregado
                  </option>

                  <option value="reviewed">
                    Revisado
                  </option>

                  <option value="returned">
                    Devuelto
                  </option>
                </select>

                <small>
                  “Revisado” marca la evaluación como completada.
                  “Devuelto” indica que el estudiante debe corregir.
                </small>
              </div>
            </section>

            <!-- RÚBRICA -->
            <section class="evaluation-section">
              <div class="evaluation-section__heading">
                <span>02</span>

                <div>
                  <p>Rúbrica vocal</p>
                  <h3>Criterios de evaluación</h3>
                </div>
              </div>

              <div class="rubric">
                <article
                  v-for="criterion in rubricCriteria"
                  :key="criterion.key"
                  class="rubric__item"
                >
                  <div class="rubric__copy">
                    <strong>{{ criterion.label }}</strong>
                    <small>{{ criterion.description }}</small>
                  </div>

                  <div class="rubric__control">
                    <select
                      v-model.number="form.rubric[criterion.key]"
                      :aria-label="criterion.label"
                    >
                      <option :value="1">1</option>
                      <option :value="2">2</option>
                      <option :value="3">3</option>
                      <option :value="4">4</option>
                      <option :value="5">5</option>
                    </select>

                    <span>/ 5</span>
                  </div>

                  <div class="rubric__bar">
                    <div
                      class="rubric__fill"
                      :style="{
                        width: `${
                          (
                            Number(form.rubric[criterion.key]) /
                            5
                          ) * 100
                        }%`
                      }"
                    ></div>
                  </div>
                </article>
              </div>

              <div class="rubric-summary">
                <div>
                  <span>PROMEDIO RÚBRICA</span>
                  <strong>{{ rubricAverage }}/5</strong>
                </div>

                <div>
                  <span>REFERENCIA</span>
                  <strong>{{ rubricPerformanceLabel }}</strong>
                </div>
              </div>
            </section>

            <!-- NOTA -->
            <section class="evaluation-section">
              <div class="evaluation-section__heading">
                <span>03</span>

                <div>
                  <p>Calificación</p>
                  <h3>Nota final</h3>
                </div>
              </div>

              <div class="grade-row">
                <div class="form-group">
                  <label for="grade">
                    Nota final
                  </label>

                  <input
                    id="grade"
                    v-model="form.grade"
                    type="number"
                    min="1"
                    max="7"
                    step="0.1"
                    placeholder="Ej: 6.5"
                  >

                  <small>
                    Escala chilena de 1,0 a 7,0.
                  </small>
                </div>

                <div class="grade-preview">
                  <span>NOTA</span>
                  <strong>{{ form.grade || '—' }}</strong>
                </div>
              </div>
            </section>

            <!-- FEEDBACK -->
            <section class="evaluation-section">
              <div class="evaluation-section__heading">
                <span>04</span>

                <div>
                  <p>Retroalimentación</p>
                  <h3>Comentario para el estudiante</h3>
                </div>
              </div>

              <div class="form-group">
                <label for="feedback">
                  Observaciones del profesor
                </label>

                <textarea
                  id="feedback"
                  v-model.trim="form.feedback"
                  rows="8"
                  placeholder="Ej: Muy buen control respiratorio. Trabajar la afinación en las notas largas y mantener mayor claridad en las consonantes..."
                ></textarea>

                <small>
                  Este comentario aparecerá en la vista de la tarea del alumno.
                </small>
              </div>
            </section>

            <!-- GUARDAR -->
            <footer class="evaluation__footer">
              <RouterLink
                :to="`/aula/clase/${lessonId}/tarea/${taskId}/entregas`"
                class="evaluation__cancel"
              >
                Cancelar
              </RouterLink>

              <button
                type="submit"
                class="evaluation__save"
                :disabled="isSaving"
              >
                {{
                  isSaving
                    ? 'Guardando evaluación...'
                    : 'Guardar evaluación'
                }}
              </button>
            </footer>
          </form>
        </main>
      </div>
    </template>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'

import {
  RouterLink,
  useRoute,
  useRouter
} from 'vue-router'

import {
  useAuth
} from '@/composables/useAuth'

import {
  fetchAssignmentById
} from '@/services/assignmentService'

import {
  createSubmissionSignedUrl,
  fetchSubmissionsByAssignment,
  updateSubmission
} from '@/services/submissionService'

const route = useRoute()
const router = useRouter()

const {
  isTeacher
} = useAuth()

const lessonId = computed(() =>
  Number(route.params.id)
)

const taskId = computed(() =>
  Number(route.params.taskId)
)

const submissionId = computed(() =>
  Number(route.params.submissionId)
)

const task = ref(null)
const submission = ref(null)

const isLoading = ref(true)
const loadError = ref('')
const isSaving = ref(false)
const isOpeningFile = ref(false)

const saveMessage = ref('')
const saveMessageType = ref('success')

const rubricCriteria = [
  {
    key: 'tuning',
    label: 'Afinación',
    description:
      'Precisión, estabilidad y control de las alturas.'
  },
  {
    key: 'rhythm',
    label: 'Ritmo',
    description:
      'Pulso, entradas, duración y precisión rítmica.'
  },
  {
    key: 'breathing',
    label: 'Respiración',
    description:
      'Administración del aire y manejo de las frases.'
  },
  {
    key: 'diction',
    label: 'Dicción',
    description:
      'Claridad del texto, consonantes y articulación.'
  },
  {
    key: 'interpretation',
    label: 'Interpretación',
    description:
      'Expresión, intención, fraseo y musicalidad.'
  }
]

const form = reactive({
  status: 'delivered',
  grade: '',
  feedback: '',
  rubric: {
    tuning: 3,
    rhythm: 3,
    breathing: 3,
    diction: 3,
    interpretation: 3
  }
})

const hydrateForm = value => {
  form.status =
    value?.status ||
    'delivered'

  form.grade =
    value?.grade ??
    ''

  form.feedback =
    value?.feedback ||
    ''

  form.rubric.tuning =
    Number(value?.rubric?.tuning ?? 3)

  form.rubric.rhythm =
    Number(value?.rubric?.rhythm ?? 3)

  form.rubric.breathing =
    Number(value?.rubric?.breathing ?? 3)

  form.rubric.diction =
    Number(value?.rubric?.diction ?? 3)

  form.rubric.interpretation =
    Number(value?.rubric?.interpretation ?? 3)
}

const loadPage = async () => {
  isLoading.value = true
  loadError.value = ''
  saveMessage.value = ''

  try {
    const [
      loadedTask,
      loadedSubmissions
    ] = await Promise.all([
      fetchAssignmentById(taskId.value),
      fetchSubmissionsByAssignment(taskId.value)
    ])

    if (
      !loadedTask ||
      Number(loadedTask.lessonId) !== lessonId.value
    ) {
      throw new Error(
        'La tarea no corresponde a esta clase.'
      )
    }

    const loadedSubmission =
      (loadedSubmissions || []).find(
        item =>
          Number(item.id) === submissionId.value
      )

    if (!loadedSubmission) {
      throw new Error(
        'No pudimos encontrar esta entrega.'
      )
    }

    task.value = loadedTask
    submission.value = loadedSubmission

    hydrateForm(
      loadedSubmission
    )
  } catch (error) {
    console.error(
      'Error cargando revisión:',
      error
    )

    task.value = null
    submission.value = null

    loadError.value =
      error?.message ||
      'No se pudo cargar la entrega desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

const rubricAverage = computed(() => {
  const values =
    Object.values(form.rubric)
      .map(Number)
      .filter(Number.isFinite)

  if (!values.length) {
    return '0.0'
  }

  const total =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    )

  return (
    total / values.length
  ).toFixed(1)
})

const rubricPerformanceLabel = computed(() => {
  const value =
    Number(rubricAverage.value)

  if (value >= 4.5) {
    return 'Excelente'
  }

  if (value >= 3.8) {
    return 'Muy buen desempeño'
  }

  if (value >= 3) {
    return 'Adecuado'
  }

  if (value >= 2) {
    return 'En desarrollo'
  }

  return 'Requiere refuerzo'
})

const statusLabel = computed(() => {
  const labels = {
    delivered: 'ENTREGADO',
    reviewed: 'REVISADO',
    returned: 'DEVUELTO'
  }

  return (
    labels[form.status] ||
    String(form.status || '').toUpperCase()
  )
})

const fileTypeLabel = computed(() => {
  const mime =
    String(
      submission.value?.mimeType ||
      ''
    ).toLowerCase()

  if (mime.startsWith('audio/')) {
    return 'Audio'
  }

  if (mime.startsWith('video/')) {
    return 'Video'
  }

  if (
    mime.includes('pdf') ||
    mime.includes('document') ||
    mime.includes('word')
  ) {
    return 'Documento'
  }

  return (
    submission.value?.mimeType ||
    'Archivo'
  )
})

const submittedDate = computed(() => {
  if (!submission.value?.submittedAt) {
    return 'Sin fecha'
  }

  try {
    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium'
      }
    ).format(
      new Date(
        submission.value.submittedAt
      )
    )
  } catch {
    return 'Sin fecha'
  }
})

const submittedTime = computed(() => {
  if (!submission.value?.submittedAt) {
    return ''
  }

  try {
    return new Intl.DateTimeFormat(
      'es-CL',
      {
        timeStyle: 'short'
      }
    ).format(
      new Date(
        submission.value.submittedAt
      )
    )
  } catch {
    return ''
  }
})

const openFile = async () => {
  if (
    !submission.value?.storagePath ||
    isOpeningFile.value
  ) {
    return
  }

  isOpeningFile.value = true
  saveMessage.value = ''

  try {
    const signedUrl =
      await createSubmissionSignedUrl(
        submission.value.storagePath,
        3600
      )

    if (!signedUrl) {
      throw new Error(
        'No se pudo generar el enlace temporal.'
      )
    }

    window.open(
      signedUrl,
      '_blank',
      'noopener,noreferrer'
    )
  } catch (error) {
    console.error(
      'Error abriendo archivo:',
      error
    )

    saveMessageType.value =
      'error'

    saveMessage.value =
      error?.message ||
      'No se pudo abrir el archivo.'
  } finally {
    isOpeningFile.value = false
  }
}

const saveReview = async () => {
  if (
    !submission.value ||
    isSaving.value
  ) {
    return
  }

  isSaving.value = true
  saveMessage.value = ''
  saveMessageType.value = 'success'

  try {
    const gradeValue =
      form.grade === '' ||
      form.grade === null
        ? ''
        : String(form.grade)

    if (gradeValue !== '') {
      const numericGrade =
        Number(gradeValue)

      if (
        !Number.isFinite(numericGrade) ||
        numericGrade < 1 ||
        numericGrade > 7
      ) {
        throw new Error(
          'La nota debe estar entre 1,0 y 7,0.'
        )
      }
    }

    const reviewedAt =
      new Date().toISOString()

    const updated =
      await updateSubmission(
        submission.value.id,
        {
          status:
            form.status,
          grade:
            gradeValue,
          feedback:
            form.feedback,
          rubric: {
            tuning:
              Number(form.rubric.tuning),
            rhythm:
              Number(form.rubric.rhythm),
            breathing:
              Number(form.rubric.breathing),
            diction:
              Number(form.rubric.diction),
            interpretation:
              Number(form.rubric.interpretation)
          },
          reviewedAt
        }
      )

    submission.value =
      updated

    hydrateForm(
      updated
    )

    saveMessage.value =
      'Evaluación guardada correctamente en Supabase.'

    setTimeout(() => {
      router.push(
        `/aula/clase/${lessonId.value}/tarea/${taskId.value}/entregas`
      )
    }, 500)
  } catch (error) {
    console.error(
      'Error guardando evaluación:',
      error
    )

    saveMessageType.value =
      'error'

    saveMessage.value =
      error?.message ||
      'No se pudo guardar la evaluación.'
  } finally {
    isSaving.value = false
  }
}

const formatDateTime = value => {
  if (!value) {
    return 'Sin fecha'
  }

  try {
    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    ).format(
      new Date(value)
    )
  } catch {
    return value
  }
}

const formatFileSize = bytes => {
  const value =
    Number(bytes)

  if (!value) {
    return '0 B'
  }

  if (value < 1024) {
    return `${value} B`
  }

  if (
    value <
    1024 * 1024
  ) {
    return `${(
      value / 1024
    ).toFixed(1)} KB`
  }

  return `${(
    value /
    (1024 * 1024)
  ).toFixed(1)} MB`
}

watch(
  () => [
    route.params.id,
    route.params.taskId,
    route.params.submissionId
  ],
  () => {
    loadPage()
  }
)

onMounted(() => {
  loadPage()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.review {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.review__back {
  display: inline-block;
  margin-bottom: variables.$spacing-xl;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.review__hero {
  display: flex;
  gap: variables.$spacing-2xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-xl;
  padding: variables.$spacing-3xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(variables.$color-primary, 0.18),
      transparent 36%
    ),
    variables.$color-surface;
}

.review__hero > div {
  max-width: 900px;
}

.review__eyebrow {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: variables.$spacing-md;
}

.review__eyebrow span {
  padding: 5px 9px;
  border: 1px solid variables.$color-primary;
  border-radius: 999px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.review__kicker {
  margin: 0 0 variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.review__hero h1 {
  margin: 0 0 variables.$spacing-md;
  font-size: clamp(3rem, 6vw, 5rem);
}

.review__description {
  max-width: 760px;
  margin: 0;
  line-height: 1.7;
  opacity: 0.68;
}

.review__status {
  min-width: 220px;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.review__status--reviewed {
  border-color: variables.$color-primary;
}

.review__status span,
.review__status strong,
.review__status small {
  display: block;
}

.review__status span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.review__status strong {
  margin: variables.$spacing-sm 0;
  font-size: 1.2rem;
}

.review__status small {
  opacity: 0.5;
}

.review__summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-bottom: variables.$spacing-xl;
}

.review__summary article {
  min-width: 0;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.review__summary span,
.review__summary strong,
.review__summary small {
  display: block;
}

.review__summary span {
  margin-bottom: 6px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.review__summary strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.review__summary small {
  margin-top: 4px;
  opacity: 0.45;
}

.review__layout {
  display: grid;
  gap: variables.$spacing-xl;
  grid-template-columns: 370px minmax(0, 1fr);
}

.review-file,
.evaluation {
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.review-file {
  position: sticky;
  top: 2rem;
  align-self: start;
  padding: variables.$spacing-xl;
}

.review-file__top {
  display: flex;
  gap: variables.$spacing-md;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: variables.$spacing-xl;
}

.review-file__label,
.evaluation__label {
  margin: 0;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.review-file__top h2 {
  margin: variables.$spacing-sm 0 0;
  word-break: break-word;
}

.review-file__private,
.evaluation__header > span {
  flex-shrink: 0;
  padding: 4px 7px;
  border: 1px solid variables.$color-primary;
  border-radius: 999px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.review-file__meta {
  display: grid;
  gap: variables.$spacing-sm;
}

.review-file__meta > div {
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.review-file__meta span,
.review-file__meta strong {
  display: block;
}

.review-file__meta span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.review-file__open {
  width: 100%;
  margin-top: variables.$spacing-lg;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-primary;
  color: variables.$color-white;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

.review-file__open:disabled {
  opacity: 0.45;
  cursor: default;
}

.review-file__notice {
  margin-top: variables.$spacing-xl;
  padding-top: variables.$spacing-xl;
  border-top: 1px solid variables.$color-border;
}

.review-file__notice strong {
  color: variables.$color-primary;
}

.review-file__notice p {
  margin-bottom: 0;
  line-height: 1.6;
  font-size: variables.$font-size-sm;
  opacity: 0.55;
}

.evaluation {
  overflow: hidden;
}

.evaluation form {
  display: grid;
}

.evaluation__header {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: flex-start;
  justify-content: space-between;
  padding: variables.$spacing-2xl;
  border-bottom: 1px solid variables.$color-border;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(variables.$color-primary, 0.08),
      transparent 35%
    ),
    variables.$color-surface;
}

.evaluation__header h2 {
  margin: variables.$spacing-sm 0 0;
  font-size: clamp(2rem, 4vw, 3rem);
}

.evaluation__message {
  margin: variables.$spacing-xl variables.$spacing-2xl 0;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
  color: variables.$color-primary;
}

.evaluation__message--error {
  border-color: #d85151;
  color: #ff7777;
}

.evaluation-section {
  padding: variables.$spacing-2xl;
  border-bottom: 1px solid variables.$color-border;
}

.evaluation-section__heading {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-bottom: variables.$spacing-xl;
}

.evaluation-section__heading > span {
  display: grid;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
}

.evaluation-section__heading p {
  margin: 0;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.evaluation-section__heading h3 {
  margin: 3px 0 0;
  font-size: 1.5rem;
}

.form-group {
  display: grid;
  gap: variables.$spacing-sm;
}

.form-group label {
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  outline: 0;
  background: variables.$color-background;
  color: variables.$color-white;
  font: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: variables.$color-primary;
}

.form-group textarea {
  resize: vertical;
}

.form-group small {
  line-height: 1.55;
  opacity: 0.48;
}

.rubric {
  display: grid;
  gap: variables.$spacing-md;
}

.rubric__item {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: minmax(0, 1fr) 115px;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.rubric__copy strong,
.rubric__copy small {
  display: block;
}

.rubric__copy small {
  margin-top: 5px;
  line-height: 1.5;
  opacity: 0.52;
}

.rubric__control {
  display: flex;
  gap: 7px;
  align-items: center;
  justify-content: flex-end;
}

.rubric__control select {
  width: 72px;
  padding: 10px;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  outline: 0;
  background: variables.$color-surface;
  color: variables.$color-white;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-align: center;
}

.rubric__control span {
  opacity: 0.5;
}

.rubric__bar {
  overflow: hidden;
  height: 7px;
  grid-column: 1 / -1;
  border-radius: 999px;
  background: variables.$color-surface;
}

.rubric__fill {
  height: 100%;
  border-radius: inherit;
  background: variables.$color-primary;
}

.rubric-summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: variables.$spacing-lg;
}

.rubric-summary > div {
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: rgba(variables.$color-primary, 0.05);
}

.rubric-summary span,
.rubric-summary strong {
  display: block;
}

.rubric-summary span {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.rubric-summary strong {
  font-size: 1.3rem;
}

.grade-row {
  display: grid;
  gap: variables.$spacing-lg;
  grid-template-columns: minmax(0, 1fr) 140px;
}

.grade-preview {
  display: grid;
  place-items: center;
  align-content: center;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.grade-preview span,
.grade-preview strong {
  display: block;
}

.grade-preview span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.grade-preview strong {
  margin-top: 6px;
  color: variables.$color-primary;
  font-size: 2rem;
}

.evaluation__footer {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  justify-content: flex-end;
  padding: variables.$spacing-2xl;
}

.evaluation__cancel,
.evaluation__save {
  padding: variables.$spacing-md variables.$spacing-xl;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.evaluation__cancel {
  border: 1px solid variables.$color-border;
  color: variables.$color-white;
}

.evaluation__save {
  border: 1px solid variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
  cursor: pointer;
}

.evaluation__save:disabled {
  opacity: 0.45;
  cursor: default;
}

.state-card {
  display: grid;
  min-height: 420px;
  gap: variables.$spacing-md;
  place-items: center;
  align-content: center;
  padding: variables.$spacing-3xl;
  border: 1px dashed variables.$color-border;
  border-radius: variables.$radius-lg;
  text-align: center;
}

.state-card p {
  margin: 0;
  opacity: 0.55;
}

.state-card__icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background: #d85151;
  color: variables.$color-white;
  font-size: 2rem;
}

.state-card__actions {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-top: variables.$spacing-md;
}

.state-card__actions button,
.state-card__actions a {
  padding: variables.$spacing-sm variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: transparent;
  color: variables.$color-primary;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
}

.loading-spinner {
  width: 48px;
  height: 48px;
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

@media (max-width: 1150px) {
  .review__summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .review__layout {
    grid-template-columns: 1fr;
  }

  .review-file {
    position: static;
  }
}

@media (max-width: 760px) {
  .review__hero {
    align-items: stretch;
    flex-direction: column;
    padding: variables.$spacing-xl;
  }

  .review__status {
    width: 100%;
  }

  .review__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .evaluation__header,
  .evaluation__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .evaluation-section {
    padding: variables.$spacing-xl;
  }

  .rubric__item,
  .grade-row,
  .rubric-summary {
    grid-template-columns: 1fr;
  }

  .rubric__control {
    justify-content: flex-start;
  }

  .evaluation__cancel,
  .evaluation__save {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 520px) {
  .review__summary {
    grid-template-columns: 1fr;
  }
}
</style>
