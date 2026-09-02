<template>
  <section class="assignment">
    <RouterLink
      :to="`/aula/clase/${lessonId}/trabajo`"
      class="assignment__back"
    >
      ← Volver a Trabajo de clase
    </RouterLink>

    <!-- =====================================================
         CARGA
    ====================================================== -->
    <div
      v-if="isLoading"
      class="assignment-state"
    >
      <div class="loading-spinner"></div>
      <h1>Cargando tarea...</h1>
      <p>Sincronizando la actividad y sus entregas con Supabase.</p>
    </div>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <div
      v-else-if="loadError"
      class="assignment-state assignment-state--error"
    >
      <span>!</span>
      <h1>No pudimos cargar la tarea</h1>
      <p>{{ loadError }}</p>

      <div class="assignment-state__actions">
        <button
          type="button"
          @click="loadPage"
        >
          Reintentar
        </button>

        <RouterLink
          :to="`/aula/clase/${lessonId}/trabajo`"
        >
          Volver
        </RouterLink>
      </div>
    </div>

    <!-- =====================================================
         TAREA
    ====================================================== -->
    <template v-else-if="task">
      <header class="assignment__header">
        <div class="assignment__header-copy">
          <div class="assignment__badges">
            <span>CLASE {{ lessonId }}</span>
            <span>{{ typeLabel }}</span>

            <span
              :class="{
                'assignment__badge--draft':
                  task.status === 'draft'
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
          :class="{
            'assignment__status--delivered':
              delivered
          }"
        >
          <span>ESTADO</span>

          <strong>
            {{ assignmentStatusLabel }}
          </strong>

          <small>
            {{
              isTeacher
                ? 'Vista docente'
                : dueStatusLabel
            }}
          </small>
        </aside>
      </header>

      <!-- ===================================================
           RESUMEN
      ==================================================== -->
      <section class="assignment__summary">
        <article>
          <span>TIPO</span>
          <strong>{{ typeLabel }}</strong>
          <small>Actividad</small>
        </article>

        <article>
          <span>ENTREGA</span>
          <strong>{{ acceptedFilesLabel }}</strong>
          <small>Formato aceptado</small>
        </article>

        <article>
          <span>PUNTAJE</span>
          <strong>{{ task.points ?? 100 }} pts</strong>
          <small>Máximo</small>
        </article>

        <article>
          <span>FECHA LÍMITE</span>
          <strong>{{ dueDateLabel }}</strong>
          <small :class="{ overdue: isTaskOverdue }">
            {{ dueStatusLabel }}
          </small>
        </article>
      </section>

      <div class="assignment__layout">
        <!-- =================================================
             CONTENIDO
        ================================================== -->
        <main class="assignment__content">
          <article class="assignment-card assignment-card--instructions">
            <header class="assignment-card__header">
              <div class="assignment-card__number">01</div>

              <div>
                <p class="assignment-card__label">
                  Instrucciones
                </p>

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
                <strong>Clase {{ task.lessonId }}</strong>
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
                <p class="assignment-card__label">
                  Evaluación
                </p>

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
              La evaluación puede incluir nota, comentario
              y rúbrica de desempeño vocal.
            </p>
          </article>

          <article class="assignment-card">
            <header class="assignment-card__header">
              <div class="assignment-card__number">03</div>

              <div>
                <p class="assignment-card__label">
                  Condiciones
                </p>

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
                <span>Estado de publicación</span>
                <strong>{{ taskStatusLabel }}</strong>
              </div>

              <div>
                <span>Almacenamiento</span>
                <strong>Privado · Supabase Storage</strong>
              </div>
            </div>
          </article>
        </main>

        <!-- =================================================
             PANEL ALUMNO
        ================================================== -->
        <aside
          v-if="isStudent"
          class="submission"
        >
          <div class="submission__heading">
            <div>
              <p class="submission__label">Tu trabajo</p>

              <h2>
                {{
                  delivered
                    ? 'Trabajo entregado'
                    : 'Adjuntar archivo'
                }}
              </h2>
            </div>

            <span class="submission__secure">
              PRIVADO
            </span>
          </div>

          <div
            v-if="submissionMessage"
            class="submission__message"
            :class="{
              'submission__message--error':
                submissionMessageType === 'error'
            }"
          >
            {{ submissionMessage }}
          </div>

          <div
            v-if="isTaskOverdue && !delivered"
            class="submission__warning"
          >
            <strong>Fecha vencida</strong>

            <p>
              La fecha límite ya pasó. La plataforma permitirá
              la carga durante este prototipo, pero quedará marcada
              como entrega tardía.
            </p>
          </div>

          <!-- NO ENTREGADA -->
          <template v-if="!delivered">
            <label
              for="assignment-file"
              class="file-upload"
            >
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
            >

            <div
              v-if="fileError"
              class="submission__file-error"
            >
              {{ fileError }}
            </div>

            <div
              v-if="selectedFile"
              class="selected-file"
            >
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
              {{
                isSubmitting
                  ? 'Subiendo archivo...'
                  : 'Entregar tarea'
              }}
            </button>
          </template>

          <!-- YA ENTREGADA -->
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
                {{
                  isOpeningFile
                    ? 'Preparando...'
                    : 'Ver archivo entregado'
                }}
              </button>
            </div>

            <div class="resubmit">
              <p>¿Quieres reemplazar la entrega?</p>

              <label
                for="replacement-file"
                class="resubmit__picker"
              >
                Seleccionar nuevo archivo
              </label>

              <input
                id="replacement-file"
                ref="replacementFileInput"
                type="file"
                :accept="fileAccept"
                @change="handleReplacementFile"
              >

              <div
                v-if="replacementFile"
                class="selected-file"
              >
                <div>
                  <span>Nueva versión</span>
                  <strong>{{ replacementFile.name }}</strong>
                  <small>
                    {{ formatFileSize(replacementFile.size) }}
                  </small>
                </div>

                <button
                  type="button"
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
                {{
                  isSubmitting
                    ? 'Reemplazando...'
                    : 'Reemplazar entrega'
                }}
              </button>
            </div>

            <button
              type="button"
              class="cancel-button"
              :disabled="isCancelling"
              @click="cancelSubmission"
            >
              {{
                isCancelling
                  ? 'Anulando...'
                  : 'Anular entrega'
              }}
            </button>
          </template>

          <!-- RETROALIMENTACIÓN -->
          <section
            v-if="hasReview"
            class="feedback-card"
          >
            <div class="feedback-card__header">
              <span>RETROALIMENTACIÓN</span>
              <h3>Evaluación del profesor</h3>
            </div>

            <div class="feedback-card__content">
              <div class="feedback-card__item">
                <span>Estado</span>
                <strong>{{ reviewStatusLabel }}</strong>
              </div>

              <div
                v-if="currentSubmission?.grade"
                class="feedback-card__item"
              >
                <span>Nota</span>

                <strong class="feedback-card__grade">
                  {{ currentSubmission.grade }}
                </strong>
              </div>

              <div
                v-if="currentSubmission?.feedback"
                class="feedback-card__comment"
              >
                <span>Comentario del profesor</span>
                <p>{{ currentSubmission.feedback }}</p>
              </div>

              <div
                v-if="currentSubmission?.rubric"
                class="rubric-result"
              >
                <div class="rubric-result__header">
                  <span>RÚBRICA</span>
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
                        {{
                          currentSubmission.rubric[criterion.key] ?? 0
                        }}/5
                      </strong>
                    </div>

                    <div class="rubric-result__bar">
                      <div
                        class="rubric-result__fill"
                        :style="{
                          width: `${
                            (
                              Number(
                                currentSubmission.rubric[criterion.key] || 0
                              ) / 5
                            ) * 100
                          }%`
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
                Revisado:
                {{ formatDateTime(currentSubmission.reviewedAt) }}
              </small>
            </div>
          </section>
        </aside>

        <!-- =================================================
             PANEL PROFESOR
        ================================================== -->
        <aside
          v-if="isTeacher"
          class="teacher-panel"
        >
          <div class="teacher-panel__top">
            <p class="teacher-panel__label">Profesor</p>
            <span class="teacher-panel__sync">SUPABASE</span>
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
                :style="{
                  width: `${deliveryPercentage}%`
                }"
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
              {{
                isDeletingTask
                  ? 'Eliminando...'
                  : 'Eliminar tarea'
              }}
            </button>
          </div>

          <div class="teacher-panel__notice">
            <strong>Entregas reales</strong>

            <p>
              Los archivos de alumnos se guardan en un bucket privado.
              El acceso se realiza mediante enlaces temporales.
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

const isLoading = ref(true)
const loadError = ref('')

const loadPage = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const [
      loadedTask,
      loadedSubmissions,
      loadedStudents
    ] = await Promise.all([
      fetchAssignmentById(
        taskId.value
      ),

      fetchSubmissionsByAssignment(
        taskId.value
      ),

      /*
       * Solo necesitamos la lista completa para
       * calcular estadísticas del panel docente.
       */
      isTeacher.value
        ? fetchStudents()
        : Promise.resolve([])
    ])

    if (
      !loadedTask ||
      Number(
        loadedTask.lessonId
      ) !==
        lessonId.value
    ) {
      throw new Error(
        'La tarea no corresponde a esta clase.'
      )
    }

    task.value =
      loadedTask

    submissions.value =
      loadedSubmissions || []

    students.value =
      loadedStudents || []
  } catch (error) {
    console.error(
      'Error cargando tarea:',
      error
    )

    task.value = null
    submissions.value = []
    students.value = []

    loadError.value =
      error?.message ||
      'No se pudo cargar la tarea desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   INFORMACIÓN TAREA
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

  const due =
    new Date(`${task.value.dueDate}T23:59:59`)

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

const totalStudents =
  computed(() =>
    students.value.length
  )

const deliveryPercentage = computed(() => {
  if (!totalStudents.value) {
    return 0
  }

  return Math.round(
    (
      taskSubmissions.value.length /
      totalStudents.value
    ) * 100
  )
})

const reviewedCount = computed(() =>
  taskSubmissions.value.filter(
    submission =>
      submission.status === 'reviewed' ||
      submission.reviewedAt
  ).length
)

const pendingReviewCount = computed(() =>
  Math.max(
    0,
    taskSubmissions.value.length -
    reviewedCount.value
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

const MAX_FILE_SIZE =
  50 * 1024 * 1024

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

  const mime =
    String(file.type || '')
      .toLowerCase()

  const name =
    String(file.name || '')
      .toLowerCase()

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
  const file =
    event.target.files?.[0]

  if (!validateFile(file)) {
    event.target.value = ''
    selectedFile.value = null
    return
  }

  selectedFile.value = file
}

const handleReplacementFile = event => {
  const file =
    event.target.files?.[0]

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
  const safeName =
    sanitizeFileName(file.name)

  return [
    `tarea-${task.value.id}`,
    `estudiante-${currentUser.value.id}`,
    `${Date.now()}-${safeName}`
  ].join('/')
}

const uploadFile = async file => {
  const storagePath =
    createStoragePath(file)

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
    storagePath:
      data?.path || storagePath,
    fileName:
      file.name,
    fileSize:
      file.size,
    mimeType:
      file.type || ''
  }
}

const removeStorageFile = async storagePath => {
  if (!storagePath) {
    return true
  }

  const {
    error
  } = await supabase
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
    const uploaded =
      await uploadFile(
        selectedFile.value
      )

    uploadedPath =
      uploaded.storagePath

    const created =
      await insertSubmission({
        assignmentId:
          task.value.id,
        lessonId:
          lessonId.value,
        studentId:
          currentUser.value.id,
        studentName:
          currentUser.value.name,
        fileName:
          uploaded.fileName,
        fileUrl: '',
        storagePath:
          uploaded.storagePath,
        fileSize:
          uploaded.fileSize,
        mimeType:
          uploaded.mimeType,
        status:
          'delivered'
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
      await removeStorageFile(
        uploadedPath
      )
    }

    submissionMessageType.value =
      'error'

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

    const uploaded =
      await uploadFile(
        replacementFile.value
      )

    newPath = uploaded.storagePath

    const updated =
      await replaceSubmissionFile(
        currentSubmission.value.id,
        {
          fileName:
            uploaded.fileName,
          fileUrl: '',
          storagePath:
            uploaded.storagePath,
          fileSize:
            uploaded.fileSize,
          mimeType:
            uploaded.mimeType
        }
      )

    const index =
      submissions.value.findIndex(
        submission =>
          submission.id === updated.id
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
      await removeStorageFile(
        previousPath
      )
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
      await removeStorageFile(
        newPath
      )
    }

    submissionMessageType.value =
      'error'

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
    const signedUrl =
      await createSubmissionSignedUrl(
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

    submissionMessageType.value =
      'error'

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

  const confirmed =
    window.confirm(
      '¿Seguro que quieres anular esta entrega? El archivo será eliminado.'
    )

  if (!confirmed) {
    return
  }

  isCancelling.value = true
  submissionMessage.value = ''

  try {
    const submission =
      currentSubmission.value

    await removeSubmission(
      submission
    )

    submissions.value =
      submissions.value.filter(
        item =>
          item.id !== submission.id
      )

    submissionMessageType.value =
      'success'

    submissionMessage.value =
      'La entrega fue anulada.'
  } catch (error) {
    console.error(
      'Error anulando entrega:',
      error
    )

    submissionMessageType.value =
      'error'

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
  {
    key: 'tuning',
    label: 'Afinación'
  },
  {
    key: 'rhythm',
    label: 'Ritmo'
  },
  {
    key: 'breathing',
    label: 'Respiración'
  },
  {
    key: 'diction',
    label: 'Dicción'
  },
  {
    key: 'interpretation',
    label: 'Interpretación'
  }
]

const rubricAverage = computed(() => {
  const rubric =
    currentSubmission.value?.rubric

  if (!rubric) {
    return '0.0'
  }

  const values =
    Object.values(rubric)
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

const hasReview = computed(() => {
  const submission =
    currentSubmission.value

  if (!submission) {
    return false
  }

  return Boolean(
    submission.reviewedAt ||
    submission.grade ||
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
    labels[
      currentSubmission.value?.status
    ] ||
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

  if (
    currentSubmission.value.status ===
    'returned'
  ) {
    return 'Devuelta'
  }

  if (
    currentSubmission.value.status ===
      'reviewed' ||
    currentSubmission.value.reviewedAt
  ) {
    return 'Revisada'
  }

  return 'Entregada'
})

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

  const confirmed =
    window.confirm(
      `¿Eliminar la tarea "${task.value.title}"?`
    )

  if (!confirmed) {
    return
  }

  isDeletingTask.value = true

  try {
    /*
      La FK elimina registros de submissions con CASCADE.
      Los archivos físicos del bucket deben gestionarse antes
      de usar esto en producción si existen entregas reales.
    */

    if (taskSubmissions.value.length) {
      const secondConfirm =
        window.confirm(
          `Esta tarea tiene ${taskSubmissions.value.length} entrega(s). ` +
          'Para evitar archivos huérfanos, elimina primero las entregas. ¿Continuar de todos modos?'
        )

      if (!secondConfirm) {
        return
      }
    }

    await removeAssignment(
      task.value.id
    )

    router.push(
      `/aula/clase/${lessonId.value}/trabajo`
    )
  } catch (error) {
    console.error(
      'Error eliminando tarea:',
      error
    )

    window.alert(
      error?.message ||
      'No se pudo eliminar la tarea.'
    )
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

  const parts =
    String(value).split('-')

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
  const value = Number(bytes)

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

/* =========================================================
   CAMBIOS DE RUTA
========================================================= */

watch(
  () => [
    route.params.id,
    route.params.taskId
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

.assignment {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
}

.assignment__back {
  display: inline-block;
  margin-bottom: variables.$spacing-xl;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.assignment__header {
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
      circle at 88% 12%,
      rgba(variables.$color-primary, 0.18),
      transparent 36%
    ),
    variables.$color-surface;
}

.assignment__header-copy {
  max-width: 850px;
}

.assignment__badges {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: variables.$spacing-md;
}

.assignment__badges span {
  padding: 5px 9px;
  border: 1px solid variables.$color-primary;
  border-radius: 999px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.assignment__badge--draft {
  opacity: 0.45;
}

.assignment__header h1 {
  margin: 0 0 variables.$spacing-lg;
  font-size: clamp(3rem, 6vw, 5rem);
}

.assignment__description {
  max-width: 760px;
  margin: 0;
  line-height: 1.7;
  white-space: pre-line;
  opacity: 0.72;
}

.assignment__status {
  min-width: 190px;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.assignment__status--delivered {
  border-color: variables.$color-primary;
}

.assignment__status span,
.assignment__status strong,
.assignment__status small {
  display: block;
}

.assignment__status span {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.assignment__status strong {
  font-size: 1.2rem;
}

.assignment__status small {
  margin-top: 6px;
  opacity: 0.45;
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
  border: 1px solid variables.$color-border;
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
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.assignment__summary strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.assignment__summary small {
  margin-top: 4px;
  opacity: 0.45;
}

.assignment__summary .overdue {
  color: #ff7777;
  opacity: 1;
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
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.assignment-card--instructions {
  background:
    radial-gradient(
      circle at 95% 5%,
      rgba(variables.$color-primary, 0.08),
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
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-bold;
}

.assignment-card__label,
.submission__label,
.teacher-panel__label {
  margin: 0;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.assignment-card__header h2 {
  margin: 3px 0 0;
}

.assignment-card__description {
  line-height: 1.8;
  white-space: pre-line;
  opacity: 0.78;
}

.assignment-card__note {
  margin: variables.$spacing-xl 0 0;
  line-height: 1.65;
  opacity: 0.6;
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
  border: 1px solid variables.$color-border;
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
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.criteria {
  display: flex;
  gap: variables.$spacing-sm;
  flex-wrap: wrap;
}

.criteria span {
  padding: variables.$spacing-sm variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  background: variables.$color-background;
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
  margin: variables.$spacing-sm 0 variables.$spacing-xl;
}

.submission__secure,
.teacher-panel__sync {
  padding: 4px 7px;
  border: 1px solid variables.$color-primary;
  border-radius: 999px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.submission__warning,
.submission__file-error,
.submission__message {
  margin-bottom: variables.$spacing-lg;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.submission__warning,
.submission__file-error,
.submission__message--error {
  border-color: #d85151;
}

.submission__warning strong,
.submission__file-error,
.submission__message--error {
  color: #ff7777;
}

.submission__warning p {
  margin: 5px 0 0;
  font-size: variables.$font-size-sm;
  opacity: 0.7;
}

.file-upload {
  display: grid;
  min-height: 190px;
  gap: 7px;
  place-items: center;
  padding: variables.$spacing-xl;
  border: 1px dashed variables.$color-border;
  border-radius: variables.$radius-lg;
  text-align: center;
  cursor: pointer;
}

.file-upload:hover {
  border-color: variables.$color-primary;
}

.file-upload__icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: variables.$color-white;
  font-size: 2rem;
}

.file-upload strong,
.file-upload small,
.file-upload em {
  display: block;
}

.file-upload small {
  opacity: 0.65;
}

.file-upload em {
  font-size: variables.$font-size-xs;
  font-style: normal;
  opacity: 0.35;
}

.file-upload__input,
.resubmit input {
  display: none;
}

.selected-file {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  justify-content: space-between;
  margin-top: variables.$spacing-lg;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.selected-file span,
.selected-file strong,
.selected-file small {
  display: block;
}

.selected-file span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.selected-file strong {
  margin: 4px 0;
  word-break: break-word;
}

.selected-file small {
  opacity: 0.5;
}

.selected-file button {
  border: 0;
  background: transparent;
  color: variables.$color-primary;
  font-size: 1.7rem;
  cursor: pointer;
}

.submit-button,
.cancel-button,
.submission__file-actions button,
.resubmit__picker {
  width: 100%;
  margin-top: variables.$spacing-lg;
  padding: variables.$spacing-md;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-align: center;
  cursor: pointer;
}

.submit-button {
  border: 1px solid variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.submit-button:disabled,
.cancel-button:disabled,
.submission__file-actions button:disabled {
  opacity: 0.4;
  cursor: default;
}

.cancel-button,
.submission__file-actions button,
.resubmit__picker {
  border: 1px solid variables.$color-border;
  background: transparent;
  color: variables.$color-white;
}

.resubmit {
  margin-top: variables.$spacing-xl;
  padding-top: variables.$spacing-xl;
  border-top: 1px solid variables.$color-border;
}

.resubmit p {
  margin: 0;
  font-size: variables.$font-size-sm;
  opacity: 0.6;
}

.resubmit__picker {
  display: block;
}

.delivered-box {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.delivered-box__icon {
  display: grid;
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.delivered-box span,
.delivered-box strong,
.delivered-box small {
  display: block;
}

.delivered-box span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.delivered-box small {
  margin-top: 4px;
  opacity: 0.45;
}

.feedback-card {
  margin-top: variables.$spacing-xl;
  overflow: hidden;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.feedback-card__header {
  padding: variables.$spacing-lg;
  border-bottom: 1px solid variables.$color-border;
}

.feedback-card__header span {
  display: block;
  margin-bottom: variables.$spacing-xs;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.feedback-card__header h3 {
  margin: 0;
}

.feedback-card__content {
  display: grid;
  gap: variables.$spacing-lg;
  padding: variables.$spacing-lg;
}

.feedback-card__item {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  justify-content: space-between;
  padding-bottom: variables.$spacing-md;
  border-bottom: 1px solid variables.$color-border;
}

.feedback-card__item strong {
  color: variables.$color-primary;
}

.feedback-card__grade {
  display: grid;
  min-width: 60px;
  min-height: 60px;
  place-items: center;
  border: 2px solid variables.$color-primary;
  border-radius: 50%;
  font-size: 1.6rem;
}

.feedback-card__comment {
  padding: variables.$spacing-lg;
  border-left: 3px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.feedback-card__comment span {
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
}

.feedback-card__comment p {
  margin-bottom: 0;
  line-height: 1.7;
}

.feedback-card__date {
  opacity: 0.45;
}

.rubric-result {
  padding-top: variables.$spacing-lg;
  border-top: 1px solid variables.$color-border;
}

.rubric-result__header,
.rubric-result__info {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  justify-content: space-between;
}

.rubric-result__header {
  margin-bottom: variables.$spacing-lg;
}

.rubric-result__header span,
.rubric-result__header strong {
  color: variables.$color-primary;
}

.rubric-result__list {
  display: grid;
  gap: variables.$spacing-md;
}

.rubric-result__item {
  display: grid;
  gap: variables.$spacing-sm;
}

.rubric-result__bar {
  overflow: hidden;
  height: 7px;
  border-radius: 999px;
  background: variables.$color-border;
}

.rubric-result__fill {
  height: 100%;
  border-radius: inherit;
  background: variables.$color-primary;
}

.teacher-panel {
  background:
    radial-gradient(
      circle at 90% 5%,
      rgba(variables.$color-primary, 0.16),
      transparent 35%
    ),
    variables.$color-surface;
}

.teacher-panel__stats,
.teacher-panel__meta {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.teacher-panel__stats {
  margin-bottom: variables.$spacing-xl;
}

.teacher-panel__meta {
  margin: variables.$spacing-xl 0;
}

.teacher-panel__stats > div,
.teacher-panel__meta > div {
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
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
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.teacher-panel__stats strong {
  font-size: 2rem;
}

.teacher-panel__progress-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: variables.$spacing-sm;
  font-size: variables.$font-size-sm;
}

.teacher-panel__progress-bar {
  overflow: hidden;
  height: 8px;
  border-radius: 999px;
  background: variables.$color-background;
}

.teacher-panel__progress-fill {
  height: 100%;
  border-radius: inherit;
  background: variables.$color-primary;
}

.teacher-panel__actions {
  display: grid;
  gap: variables.$spacing-sm;
  margin-top: variables.$spacing-xl;
}

.teacher-panel__submissions,
.teacher-panel__edit,
.teacher-panel__delete {
  display: block;
  width: 100%;
  padding: variables.$spacing-md;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.teacher-panel__submissions {
  border: 1px solid variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.teacher-panel__edit,
.teacher-panel__delete {
  border: 1px solid variables.$color-border;
  background: variables.$color-background;
  color: variables.$color-white;
}

.teacher-panel__delete {
  color: variables.$color-primary;
}

.teacher-panel__notice {
  margin-top: variables.$spacing-xl;
  padding-top: variables.$spacing-xl;
  border-top: 1px solid variables.$color-border;
  font-size: variables.$font-size-sm;
}

.teacher-panel__notice strong {
  color: variables.$color-primary;
}

.teacher-panel__notice p {
  margin-bottom: 0;
  opacity: 0.6;
}

.assignment-state {
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

.assignment-state > span {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: variables.$color-white;
  font-size: 2rem;
}

.assignment-state__actions {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
}

.assignment-state__actions button,
.assignment-state__actions a {
  padding: variables.$spacing-sm variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: transparent;
  color: variables.$color-primary;
  font: inherit;
  text-decoration: none;
  cursor: pointer;
}

.assignment-state--error > span {
  background: #d85151;
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

@media (max-width: 1050px) {
  .assignment__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .assignment__layout {
    grid-template-columns: 1fr;
  }

  .submission,
  .teacher-panel {
    position: static;
  }
}

@media (max-width: 760px) {
  .assignment__header {
    align-items: stretch;
    flex-direction: column;
    padding: variables.$spacing-xl;
  }

  .assignment__status {
    width: 100%;
  }

  .assignment__summary,
  .task-information,
  .delivery-info {
    grid-template-columns: 1fr;
  }

  .assignment-card,
  .submission,
  .teacher-panel {
    padding: variables.$spacing-xl;
  }

  .assignment-state__actions {
    flex-direction: column;
  }
}
</style>
