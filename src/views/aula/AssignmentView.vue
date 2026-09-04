<template>
  <section class="assignment">
    <RouterLink
      :to="`/aula/clase/${lessonId}/trabajo`"
      class="assignment__back"
    >
      <span aria-hidden="true">←</span>
      Trabajo de clase
    </RouterLink>

    <section
      v-if="isLoading"
      class="assignment-state"
      role="status"
      aria-live="polite"
    >
      <div class="loading-spinner"></div>
      <div>
        <h1>Cargando tarea</h1>
        <p>Preparando la actividad y sus entregas.</p>
      </div>
    </section>

    <section
      v-else-if="loadError"
      class="assignment-state assignment-state--error"
      role="alert"
    >
      <span>!</span>
      <div>
        <h1>No pudimos cargar la tarea</h1>
        <p>{{ loadError }}</p>
        <div class="assignment-state__actions">
          <button type="button" @click="loadPage">Reintentar</button>
          <RouterLink :to="`/aula/clase/${lessonId}/trabajo`">Volver</RouterLink>
        </div>
      </div>
    </section>

    <template v-else-if="task">
      <header class="assignment__header">
        <div class="assignment__header-copy">
          <div class="assignment__badges">
            <span>CLASE {{ academicLessonNumber }}</span>
            <span>{{ typeLabel }}</span>
            <span
              :class="{
                'assignment__badge--draft': task.status === 'draft'
              }"
            >
              {{ taskStatusLabel }}
            </span>
          </div>

          <h1>{{ task.title }}</h1>

          <p class="assignment__description">
            {{
              task.description ||
              'Esta tarea no tiene instrucciones adicionales.'
            }}
          </p>
        </div>

        <aside
          class="assignment__status"
          :class="statusToneClass"
        >
          <span>Estado</span>
          <strong>{{ assignmentStatusLabel }}</strong>
          <small>
            {{ isTeacher ? 'Vista docente' : dueStatusLabel }}
          </small>
        </aside>
      </header>

      <section class="assignment__summary" aria-label="Resumen de la tarea">
        <article>
          <span>Tipo</span>
          <strong>{{ typeLabel }}</strong>
          <small>Actividad</small>
        </article>

        <article>
          <span>Entrega</span>
          <strong>{{ acceptedFilesLabel }}</strong>
          <small>Formato aceptado</small>
        </article>

        <article class="assignment__summary-primary">
          <span>Puntaje</span>
          <strong>{{ task.points ?? 100 }} pts</strong>
          <small>Máximo</small>
        </article>

        <article>
          <span>Fecha límite</span>
          <strong>{{ dueDateLabel }}</strong>
          <small :class="{ overdue: isTaskOverdue }">
            {{ dueStatusLabel }}
          </small>
        </article>
      </section>

      <div class="assignment__layout">
        <main class="assignment__content">
          <article class="assignment-card assignment-card--instructions">
            <header class="assignment-card__header">
              <div class="assignment-card__number">01</div>
              <div>
                <p class="assignment-card__label">Instrucciones</p>
                <h2>Qué debes realizar</h2>
              </div>
            </header>

            <div class="assignment-card__description">
              {{
                task.description ||
                'El profesor aún no ha agregado instrucciones detalladas.'
              }}
            </div>

            <div class="task-information">
              <div>
                <span>Tipo</span>
                <strong>{{ typeLabel }}</strong>
              </div>

              <div>
                <span>Clase</span>
                <strong>Clase {{ academicLessonNumber }}</strong>
              </div>

              <div>
                <span>Entrega</span>
                <strong>{{ acceptedFilesLabel }}</strong>
              </div>

              <div>
                <span>Puntaje</span>
                <strong>{{ task.points ?? 100 }} pts</strong>
              </div>
            </div>
          </article>

          <article class="assignment-card">
            <header class="assignment-card__header">
              <div class="assignment-card__number">02</div>
              <div>
                <p class="assignment-card__label">Evaluación</p>
                <h2>Criterios generales</h2>
              </div>
            </header>

            <div class="criteria">
              <span>Afinación</span>
              <span>Ritmo</span>
              <span>Respiración</span>
              <span>Dicción</span>
              <span>Interpretación</span>
            </div>

            <p class="assignment-card__note">
              La evaluación puede incluir nota, comentario y rúbrica de desempeño vocal.
            </p>
          </article>

          <article class="assignment-card">
            <header class="assignment-card__header">
              <div class="assignment-card__number">03</div>
              <div>
                <p class="assignment-card__label">Condiciones</p>
                <h2>Información de entrega</h2>
              </div>
            </header>

            <div class="delivery-info">
              <div>
                <span>Formato solicitado</span>
                <strong>{{ acceptedFilesLabel }}</strong>
              </div>

              <div>
                <span>Fecha límite</span>
                <strong>{{ dueDateLabel }}</strong>
              </div>

              <div>
                <span>Publicación</span>
                <strong>{{ taskStatusLabel }}</strong>
              </div>

              <div>
                <span>Archivos</span>
                <strong>Privados · almacenamiento seguro</strong>
              </div>
            </div>
          </article>
        </main>

        <aside v-if="isStudent" class="submission">
          <div class="submission__heading">
            <div>
              <p class="submission__label">Tu trabajo</p>
              <h2>{{ delivered ? 'Trabajo entregado' : 'Adjuntar archivo' }}</h2>
            </div>
            <span class="submission__secure">PRIVADO</span>
          </div>

          <div
            v-if="submissionMessage"
            class="submission__message"
            :class="{
              'submission__message--error': submissionMessageType === 'error'
            }"
            role="status"
          >
            {{ submissionMessage }}
          </div>

          <div
            v-if="isTaskOverdue && !delivered"
            class="submission__warning"
          >
            <strong>Fecha vencida</strong>
            <p>
              La fecha límite ya pasó. La entrega todavía puede enviarse,
              pero quedará registrada como tardía.
            </p>
          </div>

          <template v-if="!delivered">
            <label for="assignment-file" class="file-upload">
              <span class="file-upload__icon">+</span>
              <strong>Seleccionar archivo</strong>
              <small>{{ acceptedFilesLabel }}</small>
              <em>Máximo: 50 MB</em>
            </label>

            <input
              id="assignment-file"
              ref="fileInput"
              class="file-upload__input"
              type="file"
              :accept="fileAccept"
              @change="handleFile"
            />

            <div v-if="fileError" class="submission__file-error" role="alert">
              {{ fileError }}
            </div>

            <div v-if="selectedFile" class="selected-file">
              <div>
                <span>Archivo seleccionado</span>
                <strong>{{ selectedFile.name }}</strong>
                <small>{{ formatFileSize(selectedFile.size) }}</small>
              </div>
              <button
                type="button"
                aria-label="Quitar archivo"
                @click="removeSelectedFile"
              >
                ×
              </button>
            </div>

            <button
              type="button"
              class="submit-button"
              :disabled="!selectedFile || isSubmitting"
              @click="submitAssignment"
            >
              {{ isSubmitting ? 'Subiendo archivo...' : 'Entregar tarea' }}
            </button>
          </template>

          <template v-else>
            <div class="delivered-box">
              <div class="delivered-box__icon">✓</div>
              <div>
                <span>Entregado</span>
                <strong>{{ currentSubmission.fileName }}</strong>
                <small v-if="currentSubmission.submittedAt">
                  {{ formatDateTime(currentSubmission.submittedAt) }}
                </small>
              </div>
            </div>

            <div class="submission__file-actions">
              <button
                type="button"
                :disabled="isOpeningFile"
                @click="openSubmittedFile"
              >
                {{ isOpeningFile ? 'Preparando...' : 'Ver archivo entregado' }}
              </button>
            </div>

            <div class="resubmit">
              <p>¿Quieres reemplazar la entrega?</p>

              <label for="replacement-file" class="resubmit__picker">
                Seleccionar nuevo archivo
              </label>

              <input
                id="replacement-file"
                ref="replacementFileInput"
                type="file"
                :accept="fileAccept"
                @change="handleReplacementFile"
              />

              <div v-if="replacementFile" class="selected-file">
                <div>
                  <span>Nueva versión</span>
                  <strong>{{ replacementFile.name }}</strong>
                  <small>{{ formatFileSize(replacementFile.size) }}</small>
                </div>
                <button
                  type="button"
                  aria-label="Quitar nuevo archivo"
                  @click="removeReplacementFile"
                >
                  ×
                </button>
              </div>

              <button
                v-if="replacementFile"
                type="button"
                class="submit-button"
                :disabled="isSubmitting"
                @click="replaceSubmission"
              >
                {{ isSubmitting ? 'Reemplazando...' : 'Reemplazar entrega' }}
              </button>
            </div>

            <button
              type="button"
              class="cancel-button"
              :disabled="isCancelling"
              @click="cancelSubmission"
            >
              {{ isCancelling ? 'Anulando...' : 'Anular entrega' }}
            </button>
          </template>

          <section v-if="hasReview" class="feedback-card">
            <div class="feedback-card__header">
              <span>Retroalimentación</span>
              <h3>Evaluación del profesor</h3>
            </div>

            <div class="feedback-card__content">
              <div class="feedback-card__item">
                <span>Estado</span>
                <strong>{{ reviewStatusLabel }}</strong>
              </div>

              <div
                v-if="hasSubmissionGrade"
                class="feedback-card__item"
              >
                <span>Nota</span>
                <strong class="feedback-card__grade">
                  {{ formatGrade(currentSubmission.grade) }}
                </strong>
              </div>

              <div
                v-if="currentSubmission?.feedback"
                class="feedback-card__comment"
              >
                <span>Comentario del profesor</span>
                <p>{{ currentSubmission.feedback }}</p>
              </div>

              <div v-if="currentSubmission?.rubric" class="rubric-result">
                <div class="rubric-result__header">
                  <span>Rúbrica</span>
                  <strong>{{ rubricAverage }}/5</strong>
                </div>

                <div class="rubric-result__list">
                  <div
                    v-for="criterion in rubricCriteria"
                    :key="criterion.key"
                    class="rubric-result__item"
                  >
                    <div class="rubric-result__info">
                      <span>{{ criterion.label }}</span>
                      <strong>
                        {{ currentSubmission.rubric[criterion.key] ?? 0 }}/5
                      </strong>
                    </div>
                    <div class="rubric-result__bar">
                      <div
                        class="rubric-result__fill"
                        :style="{
                          width: `${(Number(currentSubmission.rubric[criterion.key] || 0) / 5) * 100}%`
                        }"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <small
                v-if="currentSubmission?.reviewedAt"
                class="feedback-card__date"
              >
                Revisado: {{ formatDateTime(currentSubmission.reviewedAt) }}
              </small>
            </div>
          </section>
        </aside>

        <aside v-if="isTeacher" class="teacher-panel">
          <div class="teacher-panel__top">
            <p class="teacher-panel__label">Profesor</p>
            <span class="teacher-panel__sync">GESTIÓN DOCENTE</span>
          </div>

          <h2>Gestión de la tarea</h2>

          <div class="teacher-panel__stats">
            <div>
              <span>Entregas</span>
              <strong>{{ taskSubmissions.length }}</strong>
            </div>
            <div>
              <span>Estudiantes</span>
              <strong>{{ totalStudents }}</strong>
            </div>
          </div>

          <div class="teacher-panel__progress">
            <div class="teacher-panel__progress-header">
              <span>Progreso de entregas</span>
              <strong>{{ deliveryPercentage }}%</strong>
            </div>
            <div class="teacher-panel__progress-bar">
              <div
                class="teacher-panel__progress-fill"
                :style="{ width: `${deliveryPercentage}%` }"
              ></div>
            </div>
          </div>

          <div class="teacher-panel__meta">
            <div>
              <span>Sin revisar</span>
              <strong>{{ pendingReviewCount }}</strong>
            </div>
            <div>
              <span>Revisadas</span>
              <strong>{{ reviewedCount }}</strong>
            </div>
          </div>

          <div v-if="teacherMessage" class="teacher-panel__message" role="alert">
            {{ teacherMessage }}
          </div>

          <div class="teacher-panel__actions">
            <RouterLink
              :to="`/aula/clase/${lessonId}/tarea/${taskId}/entregas`"
              class="teacher-panel__submissions"
            >
              Ver entregas
            </RouterLink>

            <RouterLink
              :to="`/aula/clase/${lessonId}/tarea/${taskId}/editar`"
              class="teacher-panel__edit"
            >
              Editar tarea
            </RouterLink>

            <button
              type="button"
              class="teacher-panel__delete"
              :disabled="isDeletingTask"
              @click="deleteAssignment"
            >
              {{ isDeletingTask ? 'Eliminando...' : 'Eliminar tarea' }}
            </button>
          </div>

          <div class="teacher-panel__notice">
            <strong>Entregas protegidas</strong>
            <p>
              Los archivos de los estudiantes son privados y se abren mediante
              enlaces temporales.
            </p>
          </div>
        </aside>
      </div>
    </template>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'

import {
  RouterLink,
  useRoute,
  useRouter
} from 'vue-router'

import {
  fetchStudents
} from '@/services/studentService'

import {
  fetchLessons
} from '@/services/lessonService'

import {
  useAuth
} from '@/composables/useAuth'

import {
  supabase
} from '@/lib/supabase'

import {
  fetchAssignmentById,
  removeAssignment
} from '@/services/assignmentService'

import {
  createSubmissionSignedUrl,
  fetchSubmissionsByAssignment,
  insertSubmission,
  removeSubmission,
  replaceSubmissionFile
} from '@/services/submissionService'

const route = useRoute()
const router = useRouter()

const {
  currentUser,
  isTeacher,
  isStudent
} = useAuth()

/* =========================================================
   ROUTE
========================================================= */

const lessonId = computed(() =>
  Number(route.params.id)
)

const taskId = computed(() =>
  Number(route.params.taskId)
)

/* =========================================================
   DATOS
========================================================= */

const task = ref(null)
const submissions = ref([])
const students = ref([])
const lessons = ref([])

const isLoading = ref(true)
const loadError = ref('')
const teacherMessage = ref('')

const loadPage = async () => {
  isLoading.value = true
  loadError.value = ''
  teacherMessage.value = ''

  try {
    const [
      loadedTask,
      loadedSubmissions,
      loadedStudents,
      loadedLessons
    ] = await Promise.all([
      fetchAssignmentById(taskId.value),
      fetchSubmissionsByAssignment(taskId.value),
      isTeacher.value
        ? fetchStudents()
        : Promise.resolve([]),
      fetchLessons()
    ])

    if (
      !loadedTask ||
      Number(loadedTask.lessonId) !== lessonId.value
    ) {
      throw new Error(
        'La tarea no corresponde a esta clase.'
      )
    }

    task.value = loadedTask
    submissions.value = loadedSubmissions || []
    students.value = loadedStudents || []
    lessons.value = loadedLessons || []
  } catch (error) {
    console.error(
      'Error cargando tarea:',
      error
    )

    task.value = null
    submissions.value = []
    students.value = []
    lessons.value = []

    loadError.value =
      error?.message ||
      'No se pudo cargar la tarea.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   NUMERACIÓN ACADÉMICA
========================================================= */

const getLessonUnitId = lesson =>
  lesson?.unitId ??
  lesson?.unit_id ??
  null

const currentLesson = computed(() =>
  lessons.value.find(
    lesson =>
      Number(lesson.id) ===
      Number(lessonId.value)
  ) || null
)

const academicLessonNumber = computed(() => {
  const lesson = currentLesson.value

  if (!lesson) {
    return '—'
  }

  const unitId = getLessonUnitId(lesson)

  const unitLessons = lessons.value.filter(
    item => {
      const itemUnitId = getLessonUnitId(item)

      if (unitId === null) {
        return itemUnitId === null
      }

      return String(itemUnitId) === String(unitId)
    }
  )

  const unitIndex = unitLessons.findIndex(
    item => Number(item.id) === Number(lesson.id)
  )

  if (unitIndex >= 0) {
    return unitIndex + 1
  }

  const globalIndex = lessons.value.findIndex(
    item => Number(item.id) === Number(lesson.id)
  )

  return globalIndex >= 0
    ? globalIndex + 1
    : '—'
})

/* =========================================================
   INFORMACIÓN DE TAREA
========================================================= */

const typeLabel = computed(() => {
  const labels = {
    assignment: 'Tarea',
    performance: 'Performance',
    audio: 'Audio',
    video: 'Video',
    score: 'Partitura'
  }

  return labels[task.value?.type] || 'Tarea'
})

const taskStatusLabel = computed(() => {
  const labels = {
    published: 'PUBLICADA',
    draft: 'BORRADOR',
    pending: 'PENDIENTE',
    completed: 'COMPLETADA'
  }

  return (
    labels[task.value?.status] ||
    String(task.value?.status || 'published').toUpperCase()
  )
})

const acceptedFiles = computed(() => {
  if (!task.value) return []

  if (Array.isArray(task.value.acceptedFiles)) {
    return task.value.acceptedFiles
  }

  if (task.value.acceptedFile) {
    return [task.value.acceptedFile]
  }

  return ['any']
})

const acceptedFilesLabel = computed(() => {
  const labels = {
    audio: 'Audio',
    video: 'Video',
    document: 'Documento',
    any: 'Cualquier archivo'
  }

  return acceptedFiles.value
    .map(file => labels[file] || file)
    .join(', ')
})

const fileAccept = computed(() => {
  const files = acceptedFiles.value

  if (files.includes('any')) {
    return '*/*'
  }

  const accepted = []

  if (files.includes('audio')) {
    accepted.push('audio/*')
  }

  if (files.includes('video')) {
    accepted.push('video/*')
  }

  if (files.includes('document')) {
    accepted.push(
      '.pdf',
      '.doc',
      '.docx'
    )
  }

  return accepted.join(',')
})

const dueDateLabel = computed(() => {
  if (!task.value?.dueDate) {
    return 'Sin fecha límite'
  }

  return formatDate(task.value.dueDate)
})

const isTaskOverdue = computed(() => {
  if (!task.value?.dueDate) {
    return false
  }

  const due = new Date(
    `${task.value.dueDate}T23:59:59`
  )

  return (
    !Number.isNaN(due.getTime()) &&
    due < new Date()
  )
})

const dueStatusLabel = computed(() => {
  if (!task.value?.dueDate) {
    return 'Sin fecha límite'
  }

  return isTaskOverdue.value
    ? 'Fecha vencida'
    : 'Entrega vigente'
})

/* =========================================================
   ENTREGAS
========================================================= */

const currentSubmission = computed(() => {
  if (!currentUser.value) {
    return null
  }

  return submissions.value.find(
    submission =>
      Number(submission.studentId) ===
      Number(currentUser.value.id)
  ) || null
})

const taskSubmissions = computed(() =>
  submissions.value
)

const delivered = computed(() =>
  Boolean(currentSubmission.value)
)

const totalStudents = computed(() =>
  students.value.length
)

const deliveryPercentage = computed(() => {
  if (!totalStudents.value) {
    return 0
  }

  return Math.min(
    100,
    Math.round(
      (
        taskSubmissions.value.length /
        totalStudents.value
      ) * 100
    )
  )
})

const reviewedCount = computed(() =>
  taskSubmissions.value.filter(
    submission =>
      submission.status === 'reviewed' ||
      submission.status === 'returned' ||
      Boolean(submission.reviewedAt)
  ).length
)

const pendingReviewCount = computed(() =>
  Math.max(
    0,
    taskSubmissions.value.length - reviewedCount.value
  )
)

/* =========================================================
   ARCHIVOS
========================================================= */

const selectedFile = ref(null)
const replacementFile = ref(null)
const fileInput = ref(null)
const replacementFileInput = ref(null)
const fileError = ref('')
const submissionMessage = ref('')
const submissionMessageType = ref('success')
const isSubmitting = ref(false)
const isCancelling = ref(false)
const isOpeningFile = ref(false)

const MAX_FILE_SIZE = 50 * 1024 * 1024

const validateFile = file => {
  fileError.value = ''

  if (!file) {
    return false
  }

  if (file.size > MAX_FILE_SIZE) {
    fileError.value =
      'El archivo supera el máximo permitido de 50 MB.'
    return false
  }

  if (acceptedFiles.value.includes('any')) {
    return true
  }

  const mime = String(file.type || '').toLowerCase()
  const name = String(file.name || '').toLowerCase()

  const valid = acceptedFiles.value.some(type => {
    if (type === 'audio') {
      return (
        mime.startsWith('audio/') ||
        /\.(mp3|wav|m4a|aac|ogg|flac)$/i.test(name)
      )
    }

    if (type === 'video') {
      return (
        mime.startsWith('video/') ||
        /\.(mp4|webm|mov|m4v)$/i.test(name)
      )
    }

    if (type === 'document') {
      return /\.(pdf|doc|docx)$/i.test(name)
    }

    return false
  })

  if (!valid) {
    fileError.value =
      `Formato no permitido. Esta tarea acepta: ${acceptedFilesLabel.value}.`
  }

  return valid
}

const handleFile = event => {
  const file = event.target.files?.[0]

  if (!validateFile(file)) {
    event.target.value = ''
    selectedFile.value = null
    return
  }

  selectedFile.value = file
}

const handleReplacementFile = event => {
  const file = event.target.files?.[0]

  if (!validateFile(file)) {
    event.target.value = ''
    replacementFile.value = null
    return
  }

  replacementFile.value = file
}

const removeSelectedFile = () => {
  selectedFile.value = null
  fileError.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeReplacementFile = () => {
  replacementFile.value = null
  fileError.value = ''

  if (replacementFileInput.value) {
    replacementFileInput.value.value = ''
  }
}

const sanitizeFileName = fileName =>
  String(fileName || 'archivo')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/-+/g, '-')

const createStoragePath = file => {
  const safeName = sanitizeFileName(file.name)

  return [
    `tarea-${task.value.id}`,
    `estudiante-${currentUser.value.id}`,
    `${Date.now()}-${safeName}`
  ].join('/')
}

const uploadFile = async file => {
  const storagePath = createStoragePath(file)

  const {
    data,
    error
  } = await supabase
    .storage
    .from('entregas-alumnos')
    .upload(
      storagePath,
      file,
      {
        cacheControl: '3600',
        upsert: false,
        contentType:
          file.type ||
          'application/octet-stream'
      }
    )

  if (error) {
    throw error
  }

  return {
    storagePath: data?.path || storagePath,
    fileName: file.name,
    fileSize: file.size,
    mimeType: file.type || ''
  }
}

const removeStorageFile = async storagePath => {
  if (!storagePath) {
    return true
  }

  const { error } = await supabase
    .storage
    .from('entregas-alumnos')
    .remove([storagePath])

  if (error) {
    console.error(
      'Error eliminando archivo anterior:',
      error
    )

    return false
  }

  return true
}

/* =========================================================
   CREAR ENTREGA
========================================================= */

const submitAssignment = async () => {
  if (
    !selectedFile.value ||
    !task.value ||
    !currentUser.value ||
    isSubmitting.value
  ) {
    return
  }

  isSubmitting.value = true
  submissionMessage.value = ''
  submissionMessageType.value = 'success'

  let uploadedPath = ''

  try {
    const uploaded = await uploadFile(
      selectedFile.value
    )

    uploadedPath = uploaded.storagePath

    const created = await insertSubmission({
      assignmentId: task.value.id,
      lessonId: lessonId.value,
      studentId: currentUser.value.id,
      studentName: currentUser.value.name,
      fileName: uploaded.fileName,
      fileUrl: '',
      storagePath: uploaded.storagePath,
      fileSize: uploaded.fileSize,
      mimeType: uploaded.mimeType,
      status: 'delivered'
    })

    submissions.value = [
      ...submissions.value,
      created
    ]

    removeSelectedFile()

    submissionMessage.value =
      'Tu tarea fue entregada correctamente.'
  } catch (error) {
    console.error(
      'Error entregando tarea:',
      error
    )

    if (uploadedPath) {
      await removeStorageFile(uploadedPath)
    }

    submissionMessageType.value = 'error'
    submissionMessage.value =
      error?.message ||
      'No se pudo entregar la tarea.'
  } finally {
    isSubmitting.value = false
  }
}

/* =========================================================
   REEMPLAZAR ENTREGA
========================================================= */

const replaceSubmission = async () => {
  if (
    !replacementFile.value ||
    !currentSubmission.value ||
    isSubmitting.value
  ) {
    return
  }

  isSubmitting.value = true
  submissionMessage.value = ''
  submissionMessageType.value = 'success'

  let newPath = ''

  try {
    const previousPath =
      currentSubmission.value.storagePath

    const uploaded = await uploadFile(
      replacementFile.value
    )

    newPath = uploaded.storagePath

    const updated = await replaceSubmissionFile(
      currentSubmission.value.id,
      {
        fileName: uploaded.fileName,
        fileUrl: '',
        storagePath: uploaded.storagePath,
        fileSize: uploaded.fileSize,
        mimeType: uploaded.mimeType
      }
    )

    const index = submissions.value.findIndex(
      submission => submission.id === updated.id
    )

    if (index !== -1) {
      submissions.value.splice(
        index,
        1,
        updated
      )
    }

    if (
      previousPath &&
      previousPath !== newPath
    ) {
      await removeStorageFile(previousPath)
    }

    removeReplacementFile()

    submissionMessage.value =
      'La entrega fue reemplazada correctamente.'
  } catch (error) {
    console.error(
      'Error reemplazando entrega:',
      error
    )

    if (newPath) {
      await removeStorageFile(newPath)
    }

    submissionMessageType.value = 'error'
    submissionMessage.value =
      error?.message ||
      'No se pudo reemplazar la entrega.'
  } finally {
    isSubmitting.value = false
  }
}

/* =========================================================
   VER ARCHIVO PRIVADO
========================================================= */

const openSubmittedFile = async () => {
  if (
    !currentSubmission.value?.storagePath ||
    isOpeningFile.value
  ) {
    return
  }

  isOpeningFile.value = true

  try {
    const signedUrl = await createSubmissionSignedUrl(
      currentSubmission.value.storagePath,
      3600
    )

    if (!signedUrl) {
      throw new Error(
        'No se pudo crear el enlace temporal.'
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

    submissionMessageType.value = 'error'
    submissionMessage.value =
      error?.message ||
      'No se pudo abrir el archivo.'
  } finally {
    isOpeningFile.value = false
  }
}

/* =========================================================
   ANULAR ENTREGA
========================================================= */

const cancelSubmission = async () => {
  if (
    !currentSubmission.value ||
    isCancelling.value
  ) {
    return
  }

  const confirmed = window.confirm(
    '¿Seguro que quieres anular esta entrega? El archivo será eliminado.'
  )

  if (!confirmed) {
    return
  }

  isCancelling.value = true
  submissionMessage.value = ''

  try {
    const submission = currentSubmission.value

    await removeSubmission(submission)

    submissions.value = submissions.value.filter(
      item => item.id !== submission.id
    )

    submissionMessageType.value = 'success'
    submissionMessage.value =
      'La entrega fue anulada.'
  } catch (error) {
    console.error(
      'Error anulando entrega:',
      error
    )

    submissionMessageType.value = 'error'
    submissionMessage.value =
      error?.message ||
      'No se pudo anular la entrega.'
  } finally {
    isCancelling.value = false
  }
}

/* =========================================================
   EVALUACIÓN
========================================================= */

const rubricCriteria = [
  { key: 'tuning', label: 'Afinación' },
  { key: 'rhythm', label: 'Ritmo' },
  { key: 'breathing', label: 'Respiración' },
  { key: 'diction', label: 'Dicción' },
  { key: 'interpretation', label: 'Interpretación' }
]

const rubricAverage = computed(() => {
  const rubric = currentSubmission.value?.rubric

  if (!rubric) {
    return '0.0'
  }

  const values = Object.values(rubric)
    .map(Number)
    .filter(Number.isFinite)

  if (!values.length) {
    return '0.0'
  }

  const total = values.reduce(
    (sum, value) => sum + value,
    0
  )

  return (total / values.length).toFixed(1)
})

const hasSubmissionGrade = computed(() => {
  const grade = currentSubmission.value?.grade

  return (
    grade !== null &&
    grade !== undefined &&
    grade !== ''
  )
})

const hasReview = computed(() => {
  const submission = currentSubmission.value

  if (!submission) {
    return false
  }

  return Boolean(
    submission.reviewedAt ||
    hasSubmissionGrade.value ||
    submission.feedback ||
    submission.rubric
  )
})

const reviewStatusLabel = computed(() => {
  const labels = {
    delivered: 'Entregado',
    reviewed: 'Revisado',
    returned: 'Devuelto'
  }

  return (
    labels[currentSubmission.value?.status] ||
    currentSubmission.value?.status ||
    ''
  )
})

/* =========================================================
   ESTADO GENERAL
========================================================= */

const assignmentStatusLabel = computed(() => {
  if (isTeacher.value) {
    return taskStatusLabel.value
  }

  if (!currentSubmission.value) {
    return isTaskOverdue.value
      ? 'Atrasada'
      : 'Pendiente'
  }

  if (currentSubmission.value.status === 'returned') {
    return 'Devuelta'
  }

  if (
    currentSubmission.value.status === 'reviewed' ||
    currentSubmission.value.reviewedAt
  ) {
    return 'Revisada'
  }

  return 'Entregada'
})

const statusToneClass = computed(() => ({
  'assignment__status--success':
    assignmentStatusLabel.value === 'Entregada' ||
    assignmentStatusLabel.value === 'Revisada' ||
    assignmentStatusLabel.value === 'COMPLETADA',

  'assignment__status--danger':
    assignmentStatusLabel.value === 'Atrasada',

  'assignment__status--warning':
    assignmentStatusLabel.value === 'Devuelta' ||
    assignmentStatusLabel.value === 'BORRADOR'
}))

/* =========================================================
   ELIMINAR TAREA
========================================================= */

const isDeletingTask = ref(false)

const deleteAssignment = async () => {
  if (
    !task.value ||
    isDeletingTask.value
  ) {
    return
  }

  teacherMessage.value = ''

  const confirmed = window.confirm(
    `¿Eliminar la tarea "${task.value.title}"?`
  )

  if (!confirmed) {
    return
  }

  if (taskSubmissions.value.length) {
    const secondConfirm = window.confirm(
      `Esta tarea tiene ${taskSubmissions.value.length} entrega(s). ` +
      'Para evitar archivos huérfanos, elimina primero las entregas. ¿Continuar de todos modos?'
    )

    if (!secondConfirm) {
      return
    }
  }

  isDeletingTask.value = true

  try {
    await removeAssignment(task.value.id)

    await router.push(
      `/aula/clase/${lessonId.value}/trabajo`
    )
  } catch (error) {
    console.error(
      'Error eliminando tarea:',
      error
    )

    teacherMessage.value =
      error?.message ||
      'No se pudo eliminar la tarea.'
  } finally {
    isDeletingTask.value = false
  }
}

/* =========================================================
   FORMATOS
========================================================= */

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

const formatDateTime = value => {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      dateStyle: 'medium',
      timeStyle: 'short'
    }
  ).format(date)
}

const formatFileSize = bytes => {
  const value = Number(bytes)

  if (!value) {
    return '0 B'
  }

  if (value < 1024) {
    return `${value} B`
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`
  }

  return `${(
    value /
    (1024 * 1024)
  ).toFixed(1)} MB`
}

const formatGrade = value => {
  const grade = Number(value)

  return Number.isFinite(grade)
    ? grade.toFixed(1)
    : '—'
}

/* =========================================================
   CAMBIOS DE RUTA
========================================================= */

watch(
  () => [
    route.params.id,
    route.params.taskId
  ],
  () => {
    selectedFile.value = null
    replacementFile.value = null
    fileError.value = ''
    submissionMessage.value = ''
    loadPage()
  }
)

onMounted(() => {
  loadPage()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.assignment {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-bottom: variables.$spacing-4xl;
}

.assignment__back {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  gap: variables.$spacing-sm;
  margin-bottom: variables.$spacing-xl;
  color: variables.$color-text-secondary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-medium;
  transition:
    color variables.$transition-fast,
    transform variables.$transition-fast;
}

.assignment__back:hover {
  color: variables.$color-primary;
  transform: translateX(-3px);
}

.assignment__header {
  display: flex;
  gap: variables.$spacing-2xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-lg;
  padding: variables.$spacing-2xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-xl;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(variables.$color-primary, 0.1),
      transparent 34%
    ),
    linear-gradient(
      145deg,
      variables.$color-surface-elevated,
      variables.$color-surface
    );
}

.assignment__header-copy {
  min-width: 0;
  max-width: 850px;
}

.assignment__badges {
  display: flex;
  gap: variables.$spacing-sm;
  flex-wrap: wrap;
  margin-bottom: variables.$spacing-md;
}

.assignment__badges span {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 0.75rem;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-pill;
  color: variables.$color-text-secondary;
  background: rgba(variables.$color-black, 0.16);
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.assignment__badges span:first-child {
  border-color: variables.$color-border-primary;
  color: variables.$color-primary;
}

.assignment__badge--draft {
  opacity: 0.65;
}

.assignment__header h1 {
  margin: 0 0 variables.$spacing-lg;
  font-size: clamp(2.7rem, 6vw, 5rem);
  line-height: 0.98;
}

.assignment__description {
  max-width: 760px;
  margin: 0;
  color: variables.$color-text-secondary;
  line-height: 1.7;
  white-space: pre-line;
}

.assignment__status {
  min-width: 190px;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.assignment__status span,
.assignment__status strong,
.assignment__status small {
  display: block;
}

.assignment__status span {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  text-transform: uppercase;
}

.assignment__status strong {
  color: variables.$color-text-primary;
  font-size: variables.$font-size-md;
}

.assignment__status small {
  margin-top: 6px;
  color: variables.$color-text-muted;
}

.assignment__status--success {
  border-color: rgba(variables.$color-success, 0.28);
}

.assignment__status--success strong {
  color: variables.$color-success;
}

.assignment__status--danger {
  border-color: rgba(variables.$color-danger, 0.28);
}

.assignment__status--danger strong {
  color: variables.$color-danger;
}

.assignment__status--warning {
  border-color: rgba(variables.$color-warning, 0.28);
}

.assignment__status--warning strong {
  color: variables.$color-warning;
}

.assignment__summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: variables.$spacing-2xl;
}

.assignment__summary article {
  min-width: 0;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border-soft;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.assignment__summary span,
.assignment__summary strong,
.assignment__summary small {
  display: block;
}

.assignment__summary span {
  margin-bottom: 7px;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  text-transform: uppercase;
}

.assignment__summary strong {
  overflow: hidden;
  color: variables.$color-text-primary;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.assignment__summary small {
  margin-top: 4px;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
}

.assignment__summary-primary {
  border-color: variables.$color-border-primary !important;
  background: rgba(variables.$color-primary, 0.045) !important;
}

.assignment__summary-primary strong {
  color: variables.$color-primary;
}

.assignment__summary .overdue {
  color: variables.$color-danger;
}

.assignment__layout {
  display: grid;
  gap: variables.$spacing-xl;
  grid-template-columns: minmax(0, 1fr) 390px;
}

.assignment__content {
  display: grid;
  gap: variables.$spacing-xl;
}

.assignment-card,
.submission,
.teacher-panel {
  padding: variables.$spacing-2xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-xl;
  background: variables.$color-surface;
}

.assignment-card--instructions {
  background:
    radial-gradient(
      circle at 95% 5%,
      rgba(variables.$color-primary, 0.06),
      transparent 32%
    ),
    variables.$color-surface;
}

.assignment-card__header {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-bottom: variables.$spacing-xl;
}

.assignment-card__number {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid variables.$color-border-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  background: rgba(variables.$color-primary, 0.04);
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
}

.assignment-card__label,
.submission__label,
.teacher-panel__label {
  margin: 0;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.assignment-card__header h2,
.submission__heading h2,
.teacher-panel h2 {
  margin: 4px 0 0;
  font-family: variables.$font-family-primary;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: -0.03em;
}

.assignment-card__description {
  color: variables.$color-text-secondary;
  line-height: 1.75;
  white-space: pre-line;
}

.assignment-card__note {
  margin: variables.$spacing-xl 0 0;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-sm;
  line-height: 1.65;
}

.task-information,
.delivery-info {
  display: grid;
  gap: variables.$spacing-md;
  margin-top: variables.$spacing-xl;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.task-information > div,
.delivery-info > div {
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border-soft;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.task-information span,
.task-information strong,
.delivery-info span,
.delivery-info strong {
  display: block;
}

.task-information span,
.delivery-info span {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
}

.task-information strong,
.delivery-info strong {
  color: variables.$color-text-primary;
  font-size: variables.$font-size-sm;
}

.criteria {
  display: flex;
  gap: variables.$spacing-sm;
  flex-wrap: wrap;
}

.criteria span {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  padding: 0 variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-pill;
  color: variables.$color-text-secondary;
  background: variables.$color-background;
  font-size: variables.$font-size-sm;
}

.submission,
.teacher-panel {
  position: sticky;
  top: 2rem;
  align-self: start;
}

.submission__heading,
.teacher-panel__top {
  display: flex;
  gap: variables.$spacing-md;
  align-items: flex-start;
  justify-content: space-between;
}

.submission__heading h2,
.teacher-panel h2 {
  margin-top: variables.$spacing-sm;
  margin-bottom: variables.$spacing-xl;
}

.submission__secure,
.teacher-panel__sync {
  display: inline-flex;
  min-height: 30px;
  align-items: center;
  padding: 0 0.65rem;
  border: 1px solid variables.$color-border-primary;
  border-radius: variables.$radius-pill;
  color: variables.$color-primary;
  font-size: 0.68rem;
  font-weight: variables.$font-weight-semibold;
  white-space: nowrap;
}

.submission__warning,
.submission__file-error,
.submission__message,
.teacher-panel__message {
  margin-bottom: variables.$spacing-lg;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-md;
  background: variables.$color-background;
  font-size: variables.$font-size-sm;
  line-height: 1.55;
}

.submission__message {
  border-color: rgba(variables.$color-success, 0.25);
  color: variables.$color-success;
  background: variables.$color-success-soft;
}

.submission__warning,
.submission__file-error,
.submission__message--error,
.teacher-panel__message {
  border-color: rgba(variables.$color-danger, 0.25);
  color: variables.$color-danger;
  background: variables.$color-danger-soft;
}

.submission__warning strong {
  color: variables.$color-danger;
}

.submission__warning p {
  margin: 5px 0 0;
  color: variables.$color-text-secondary;
}

.file-upload {
  display: grid;
  min-height: 190px;
  place-items: center;
  align-content: center;
  gap: variables.$spacing-sm;
  padding: variables.$spacing-xl;
  border: 1px dashed variables.$color-border-strong;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
  text-align: center;
  cursor: pointer;
  transition:
    border-color variables.$transition-fast,
    background variables.$transition-fast;
}

.file-upload:hover {
  border-color: variables.$color-primary;
  background: rgba(variables.$color-primary, 0.025);
}

.file-upload__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border: 1px solid variables.$color-border-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: variables.$font-size-xl;
}

.file-upload small,
.file-upload em {
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
  font-style: normal;
}

.file-upload__input,
.resubmit input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  white-space: nowrap;
}

.selected-file,
.delivered-box {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  justify-content: space-between;
  margin-top: variables.$spacing-md;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-md;
  background: variables.$color-background;
}

.selected-file > div,
.delivered-box > div:last-child {
  min-width: 0;
}

.selected-file span,
.selected-file strong,
.selected-file small,
.delivered-box span,
.delivered-box strong,
.delivered-box small {
  display: block;
}

.selected-file span,
.delivered-box span {
  margin-bottom: 3px;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
}

.selected-file strong,
.delivered-box strong {
  overflow: hidden;
  color: variables.$color-text-primary;
  font-size: variables.$font-size-sm;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-file small,
.delivered-box small {
  margin-top: 3px;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
}

.selected-file button {
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  border: 1px solid variables.$color-border;
  border-radius: 50%;
  color: variables.$color-text-secondary;
  background: transparent;
  cursor: pointer;
}

.submit-button,
.cancel-button,
.submission__file-actions button,
.resubmit__picker,
.teacher-panel__submissions,
.teacher-panel__edit,
.teacher-panel__delete {
  display: inline-flex;
  width: 100%;
  min-height: variables.$control-height-md;
  align-items: center;
  justify-content: center;
  padding: 0 variables.$spacing-lg;
  border-radius: variables.$radius-md;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  text-align: center;
  cursor: pointer;
}

.submit-button,
.teacher-panel__submissions {
  margin-top: variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  color: variables.$color-black;
  background: variables.$color-primary;
}

.submission__file-actions button,
.resubmit__picker,
.teacher-panel__edit {
  border: 1px solid variables.$color-border;
  color: variables.$color-text-primary;
  background: transparent;
}

.submission__file-actions {
  margin-top: variables.$spacing-md;
}

.resubmit {
  display: grid;
  gap: variables.$spacing-sm;
  margin-top: variables.$spacing-xl;
  padding-top: variables.$spacing-xl;
  border-top: 1px solid variables.$color-border-soft;
}

.resubmit p {
  margin: 0;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-sm;
}

.cancel-button,
.teacher-panel__delete {
  margin-top: variables.$spacing-sm;
  border: 1px solid rgba(variables.$color-danger, 0.22);
  color: variables.$color-danger;
  background: transparent;
}

.submit-button:disabled,
.cancel-button:disabled,
.submission__file-actions button:disabled,
.teacher-panel__delete:disabled {
  cursor: wait;
  opacity: 0.5;
}

.delivered-box {
  border-color: rgba(variables.$color-success, 0.25);
  background: variables.$color-success-soft;
}

.delivered-box__icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: variables.$color-success;
  background: rgba(variables.$color-success, 0.1);
  font-weight: variables.$font-weight-bold;
}

.feedback-card {
  margin-top: variables.$spacing-xl;
  padding-top: variables.$spacing-xl;
  border-top: 1px solid variables.$color-border-soft;
}

.feedback-card__header > span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.feedback-card__header h3 {
  margin: 4px 0 variables.$spacing-md;
  font-family: variables.$font-family-primary;
  font-size: variables.$font-size-md;
}

.feedback-card__content {
  display: grid;
  gap: variables.$spacing-sm;
}

.feedback-card__item,
.feedback-card__comment {
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border-soft;
  border-radius: variables.$radius-md;
  background: variables.$color-background;
}

.feedback-card__item span,
.feedback-card__comment span {
  display: block;
  margin-bottom: 4px;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
}

.feedback-card__grade {
  color: variables.$color-primary;
  font-size: variables.$font-size-xl;
}

.feedback-card__comment p {
  margin: 0;
  color: variables.$color-text-secondary;
  font-size: variables.$font-size-sm;
  line-height: 1.6;
}

.feedback-card__date {
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
}

.rubric-result {
  display: grid;
  gap: variables.$spacing-md;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border-soft;
  border-radius: variables.$radius-md;
  background: variables.$color-background;
}

.rubric-result__header,
.rubric-result__info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: variables.$spacing-md;
}

.rubric-result__header span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  text-transform: uppercase;
}

.rubric-result__header strong {
  color: variables.$color-primary;
}

.rubric-result__list {
  display: grid;
  gap: variables.$spacing-md;
}

.rubric-result__item {
  display: grid;
  gap: variables.$spacing-xs;
}

.rubric-result__info {
  color: variables.$color-text-secondary;
  font-size: variables.$font-size-xs;
}

.rubric-result__bar,
.teacher-panel__progress-bar {
  overflow: hidden;
  height: 6px;
  border-radius: variables.$radius-pill;
  background: variables.$color-border;
}

.rubric-result__fill,
.teacher-panel__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: variables.$color-primary;
  transition: width variables.$transition-normal;
}

.teacher-panel__stats,
.teacher-panel__meta {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.teacher-panel__stats > div,
.teacher-panel__meta > div {
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border-soft;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.teacher-panel__stats span,
.teacher-panel__stats strong,
.teacher-panel__meta span,
.teacher-panel__meta strong {
  display: block;
}

.teacher-panel__stats span,
.teacher-panel__meta span {
  margin-bottom: 5px;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
}

.teacher-panel__stats strong,
.teacher-panel__meta strong {
  color: variables.$color-text-primary;
  font-size: variables.$font-size-xl;
  font-weight: variables.$font-weight-semibold;
}

.teacher-panel__progress {
  margin: variables.$spacing-xl 0;
}

.teacher-panel__progress-header {
  display: flex;
  justify-content: space-between;
  gap: variables.$spacing-md;
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-text-secondary;
  font-size: variables.$font-size-sm;
}

.teacher-panel__progress-header strong {
  color: variables.$color-primary;
}

.teacher-panel__actions {
  display: grid;
  gap: variables.$spacing-sm;
  margin-top: variables.$spacing-xl;
}

.teacher-panel__submissions,
.teacher-panel__edit,
.teacher-panel__delete {
  margin-top: 0;
}

.teacher-panel__notice {
  margin-top: variables.$spacing-xl;
  padding-top: variables.$spacing-xl;
  border-top: 1px solid variables.$color-border-soft;
}

.teacher-panel__notice strong {
  display: block;
  margin-bottom: 5px;
  color: variables.$color-text-primary;
  font-size: variables.$font-size-sm;
}

.teacher-panel__notice p {
  margin: 0;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-xs;
  line-height: 1.6;
}

.assignment-state {
  display: flex;
  min-height: 240px;
  gap: variables.$spacing-lg;
  align-items: center;
  justify-content: center;
  padding: variables.$spacing-2xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-xl;
  background: variables.$color-surface;
}

.assignment-state > span {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: variables.$color-danger;
  background: variables.$color-danger-soft;
}

.assignment-state h1 {
  margin: 0;
  font-family: variables.$font-family-primary;
  font-size: variables.$font-size-xl;
}

.assignment-state p {
  margin-top: variables.$spacing-xs;
  color: variables.$color-text-muted;
}

.assignment-state__actions {
  display: flex;
  gap: variables.$spacing-sm;
  margin-top: variables.$spacing-md;
}

.assignment-state__actions button,
.assignment-state__actions a {
  display: inline-flex;
  min-height: variables.$control-height-md;
  align-items: center;
  justify-content: center;
  padding: 0 variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-md;
  color: variables.$color-text-primary;
  background: transparent;
  font-size: variables.$font-size-sm;
  cursor: pointer;
}

.loading-spinner {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 3px solid variables.$color-border;
  border-top-color: variables.$color-primary;
  border-radius: 50%;
  animation: assignment-spin 0.8s linear infinite;
}

@keyframes assignment-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1120px) {
  .assignment__layout {
    grid-template-columns: 1fr;
  }

  .submission,
  .teacher-panel {
    position: static;
  }
}

@media (max-width: 850px) {
  .assignment__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .assignment__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .assignment__status {
    width: 100%;
  }
}

@media (max-width: 650px) {
  .assignment__header,
  .assignment-card,
  .submission,
  .teacher-panel {
    padding: variables.$spacing-lg;
  }

  .assignment__header h1 {
    font-size: clamp(2.45rem, 12vw, 3.8rem);
  }

  .task-information,
  .delivery-info {
    grid-template-columns: 1fr;
  }

  .assignment-state {
    align-items: flex-start;
    flex-direction: column;
  }

  .assignment-state__actions {
    width: 100%;
    flex-direction: column;
  }

  .submission__heading,
  .teacher-panel__top {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 430px) {
  .assignment__summary {
    gap: variables.$spacing-sm;
  }

  .assignment__summary article {
    padding: variables.$spacing-md;
  }

  .teacher-panel__stats,
  .teacher-panel__meta {
    grid-template-columns: 1fr 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .assignment *,
  .assignment *::before,
  .assignment *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
