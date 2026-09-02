<template>
  <section class="student-profile">

    <RouterLink
      to="/aula/alumnos"
      class="student-profile__back"
    >
      ← Volver a alumnos
    </RouterLink>

    <!-- =====================================================
         CARGA
    ====================================================== -->

    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="loading-spinner"></div>

      <div>
        <strong>
          Cargando ficha del estudiante...
        </strong>

        <p>
          Sincronizando perfil, asistencia,
          entregas y evaluaciones.
        </p>
      </div>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->

    <section
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <span>!</span>

      <div>
        <h3>
          No pudimos cargar la ficha
        </h3>

        <p>
          {{ loadError }}
        </p>

        <button
          type="button"
          @click="loadProfile"
        >
          Reintentar
        </button>
      </div>
    </section>

    <!-- =====================================================
         PERFIL
    ====================================================== -->

    <template v-else-if="student">

      <!-- HEADER -->

      <header class="student-profile__header">

        <div class="student-profile__identity">

          <div class="student-profile__avatar">
            {{ initials }}
          </div>

          <div class="student-profile__identity-text">
            <p>
              Perfil del estudiante
            </p>

            <h1>
              {{ student.name }}
            </h1>

            <div class="student-profile__identity-meta">

              <span class="voice-badge">
                {{ vocalProfile?.voice || student.voice }}
              </span>

              <span
                v-if="student.active"
                class="status-badge"
              >
                Activo
              </span>

              <span
                v-else
                class="status-badge status-badge--inactive"
              >
                Inactivo
              </span>

            </div>
          </div>

        </div>

      </header>

      <!-- =====================================================
           RESUMEN
      ====================================================== -->

      <section class="student-profile__summary">

        <article>
          <span>
            Entregas
          </span>

          <strong>
            {{ studentSubmissions.length }}
          </strong>

          <small>
            trabajos enviados
          </small>
        </article>

        <article>
          <span>
            Evaluadas
          </span>

          <strong>
            {{ reviewedSubmissions.length }}
          </strong>

          <small>
            con revisión
          </small>
        </article>

        <article>
          <span>
            Promedio
          </span>

          <strong>
            {{ averageGrade }}
          </strong>

          <small>
            calificación general
          </small>
        </article>

        <article>
          <span>
            Asistencia
          </span>

          <strong>
            {{ attendancePercentage }}%
          </strong>

          <small>
            clases registradas
          </small>
        </article>

      </section>

      <!-- =====================================================
           01 · FICHA VOCAL
      ====================================================== -->

      <section class="student-profile__section">

        <div class="student-profile__section-title">

          <span>
            01
          </span>

          <div>
            <p>
              Perfil técnico
            </p>

            <h2>
              Ficha vocal
            </h2>
          </div>

        </div>

        <div class="vocal-card">

          <!-- VISUALIZACIÓN -->

          <template v-if="!isEditingVocalProfile">

            <div class="vocal-card__header">

              <div>
                <span>
                  Clasificación vocal
                </span>

                <strong>
                  {{
                    vocalProfile?.voice ||
                    student.voice ||
                    'Sin clasificación'
                  }}
                </strong>
              </div>

              <button
                v-if="isTeacher"
                type="button"
                class="vocal-card__edit"
                @click="startEditingVocalProfile"
              >
                Editar ficha vocal
              </button>

            </div>

            <div class="vocal-card__grid">

              <article>
                <span>
                  Tesitura
                </span>

                <strong>
                  {{
                    getRangeLabel(
                      vocalProfile?.tessituraLow,
                      vocalProfile?.tessituraHigh
                    )
                  }}
                </strong>
              </article>

              <article>
                <span>
                  Zona cómoda
                </span>

                <strong>
                  {{
                    getRangeLabel(
                      vocalProfile?.comfortableLow,
                      vocalProfile?.comfortableHigh
                    )
                  }}
                </strong>
              </article>

              <article>
                <span>
                  Passaggio
                </span>

                <strong>
                  {{
                    vocalProfile?.passaggio ||
                    'Sin registrar'
                  }}
                </strong>
              </article>

            </div>

            <div class="vocal-card__observations">

              <span>
                Observaciones del profesor
              </span>

              <p>
                {{
                  vocalProfile?.observations ||
                  'Todavía no hay observaciones registradas.'
                }}
              </p>

            </div>

            <small
              v-if="vocalProfile?.updatedAt"
              class="vocal-card__updated"
            >
              Última actualización:
              {{ formatDateTime(vocalProfile.updatedAt) }}
            </small>

          </template>

          <!-- EDICIÓN -->

          <form
            v-else
            class="vocal-form"
            @submit.prevent="saveVocalProfile"
          >

            <div class="vocal-form__header">

              <div>
                <span>
                  Profesor
                </span>

                <h3>
                  Editar ficha vocal
                </h3>
              </div>

              <span class="vocal-form__student">
                {{ student.name }}
              </span>

            </div>

            <div class="vocal-form__grid">

              <label class="vocal-form__field">
                <span>
                  Clasificación vocal
                </span>

                <select
                  v-model="vocalForm.voice"
                  required
                >
                  <option value="Soprano">
                    Soprano
                  </option>

                  <option value="Alto">
                    Alto
                  </option>

                  <option value="Tenor">
                    Tenor
                  </option>

                  <option value="Bajo">
                    Bajo
                  </option>
                </select>
              </label>

              <label class="vocal-form__field">
                <span>
                  Passaggio
                </span>

                <input
                  v-model.trim="vocalForm.passaggio"
                  type="text"
                  placeholder="Ej: F#4 - G4"
                >
              </label>

            </div>

            <div class="vocal-form__ranges">

              <div class="vocal-form__range-block">

                <h4>
                  Tesitura
                </h4>

                <div class="vocal-form__range">

                  <label class="vocal-form__field">
                    <span>
                      Nota inferior
                    </span>

                    <input
                      v-model.trim="vocalForm.tessituraLow"
                      type="text"
                      placeholder="Ej: C3"
                    >
                  </label>

                  <span class="vocal-form__range-separator">
                    →
                  </span>

                  <label class="vocal-form__field">
                    <span>
                      Nota superior
                    </span>

                    <input
                      v-model.trim="vocalForm.tessituraHigh"
                      type="text"
                      placeholder="Ej: A4"
                    >
                  </label>

                </div>

              </div>

              <div class="vocal-form__range-block">

                <h4>
                  Zona cómoda
                </h4>

                <div class="vocal-form__range">

                  <label class="vocal-form__field">
                    <span>
                      Nota inferior
                    </span>

                    <input
                      v-model.trim="vocalForm.comfortableLow"
                      type="text"
                      placeholder="Ej: E3"
                    >
                  </label>

                  <span class="vocal-form__range-separator">
                    →
                  </span>

                  <label class="vocal-form__field">
                    <span>
                      Nota superior
                    </span>

                    <input
                      v-model.trim="vocalForm.comfortableHigh"
                      type="text"
                      placeholder="Ej: G4"
                    >
                  </label>

                </div>

              </div>

            </div>

            <label class="vocal-form__field">
              <span>
                Observaciones del profesor
              </span>

              <textarea
                v-model.trim="vocalForm.observations"
                rows="6"
                placeholder="Fortalezas, aspectos a trabajar, respiración, afinación, resonancia, interpretación..."
              ></textarea>
            </label>

            <div
              v-if="vocalSaveError"
              class="form-message form-message--error"
            >
              {{ vocalSaveError }}
            </div>

            <div class="vocal-form__actions">

              <button
                type="button"
                class="button-secondary"
                :disabled="isSavingVocalProfile"
                @click="cancelVocalProfileEdit"
              >
                Cancelar
              </button>

              <button
                type="submit"
                class="button-primary"
                :disabled="isSavingVocalProfile"
              >
                {{
                  isSavingVocalProfile
                    ? 'Guardando...'
                    : 'Guardar ficha vocal'
                }}
              </button>

            </div>

          </form>

        </div>

      </section>

      <!-- =====================================================
           02 · ASISTENCIA
      ====================================================== -->

      <section class="student-profile__section">

        <div class="student-profile__section-title">

          <span>
            02
          </span>

          <div>
            <p>
              Seguimiento
            </p>

            <h2>
              Asistencia
            </h2>
          </div>

        </div>

        <div class="attendance-profile">

          <div class="attendance-profile__main">

            <div class="attendance-profile__percentage">

              <strong>
                {{ attendancePercentage }}%
              </strong>

              <span>
                asistencia
              </span>

            </div>

            <div class="attendance-profile__progress">

              <div class="attendance-profile__progress-info">

                <span>
                  Clases registradas
                </span>

                <strong>
                  {{ registeredAttendanceCount }}
                  /
                  {{ lessons.length }}
                </strong>

              </div>

              <div class="attendance-profile__bar">
                <div
                  class="attendance-profile__fill"
                  :style="{
                    width: `${attendancePercentage}%`
                  }"
                ></div>
              </div>

              <p class="attendance-profile__help">
                El porcentaje considera las clases donde
                existe un registro de asistencia para este estudiante.
              </p>

            </div>

          </div>

          <div class="attendance-profile__stats">

            <article>
              <span>
                Presentes
              </span>

              <strong>
                {{ presentCount }}
              </strong>
            </article>

            <article>
              <span>
                Ausencias
              </span>

              <strong>
                {{ absentCount }}
              </strong>
            </article>

            <article>
              <span>
                Justificadas
              </span>

              <strong>
                {{ justifiedCount }}
              </strong>
            </article>

            <article>
              <span>
                Sin registrar
              </span>

              <strong>
                {{ pendingAttendanceCount }}
              </strong>
            </article>

          </div>

          <div class="attendance-history">

            <div class="attendance-history__header">

              <div>
                <span>
                  Historial
                </span>

                <h3>
                  Clases del programa
                </h3>
              </div>

              <RouterLink
                v-if="isTeacher"
                to="/aula/asistencia"
                class="attendance-history__link"
              >
                Administrar asistencia →
              </RouterLink>

            </div>

            <div
              v-if="attendanceHistory.length"
              class="attendance-history__list"
            >

              <article
                v-for="item in attendanceHistory"
                :key="item.lesson.id"
                class="attendance-history__item"
              >

                <div class="attendance-history__lesson">

                  <span>
                    Clase {{ item.lesson.id }}
                  </span>

                  <strong>
                    {{ item.lesson.title }}
                  </strong>

                  <small>
                    {{ item.lesson.date }}
                  </small>

                </div>

                <div
                  class="attendance-history__status"
                  :class="
                    `attendance-history__status--${item.status}`
                  "
                >
                  {{
                    getAttendanceStatusLabel(
                      item.status
                    )
                  }}
                </div>

                <p
                  v-if="item.notes"
                  class="attendance-history__note"
                >
                  {{ item.notes }}
                </p>

              </article>

            </div>

            <div
              v-else
              class="empty-state empty-state--small"
            >
              <span>✓</span>

              <div>
                <h3>
                  Sin clases registradas
                </h3>

                <p>
                  El historial aparecerá cuando
                  existan clases en el programa.
                </p>
              </div>
            </div>

          </div>

        </div>

      </section>

      <!-- =====================================================
           03 · PROGRESO VOCAL
      ====================================================== -->

      <section class="student-profile__section">

        <div class="student-profile__section-title">

          <span>
            03
          </span>

          <div>
            <p>
              Evaluaciones
            </p>

            <h2>
              Progreso vocal
            </h2>
          </div>

        </div>

        <div
          v-if="rubricProgress"
          class="rubric-overview"
        >

          <div
            v-for="criterion in rubricCriteria"
            :key="criterion.key"
            class="rubric-overview__item"
          >

            <div class="rubric-overview__info">

              <span>
                {{ criterion.label }}
              </span>

              <strong>
                {{ rubricProgress[criterion.key] }}/5
              </strong>

            </div>

            <div class="rubric-overview__bar">
              <div
                class="rubric-overview__fill"
                :style="{
                  width:
                    `${
                      (
                        rubricProgress[criterion.key] /
                        5
                      ) * 100
                    }%`
                }"
              ></div>
            </div>

          </div>

        </div>

        <div
          v-else
          class="empty-state"
        >
          <span>♪</span>

          <div>
            <h3>
              Todavía no hay evaluaciones
            </h3>

            <p>
              El progreso aparecerá cuando existan
              rúbricas evaluadas.
            </p>
          </div>
        </div>

      </section>

      <!-- =====================================================
           04 · ENTREGAS
      ====================================================== -->

      <section class="student-profile__section">

        <div class="student-profile__section-title">

          <span>
            04
          </span>

          <div>
            <p>
              Historial
            </p>

            <h2>
              Entregas y evaluaciones
            </h2>
          </div>

        </div>

        <div
          v-if="studentSubmissions.length"
          class="history"
        >

          <article
            v-for="submission in studentSubmissions"
            :key="submission.id"
            class="history-card"
          >

            <div class="history-card__main">

              <span>
                {{ getStatusLabel(submission) }}
              </span>

              <h3>
                {{
                  getTaskTitle(
                    submission.assignmentId
                  )
                }}
              </h3>

              <p>
                {{
                  submission.fileName ||
                  'Entrega registrada'
                }}
              </p>

              <small>
                {{
                  formatDate(
                    submission.submittedAt
                  )
                }}
              </small>

              <p
                v-if="submission.feedback"
                class="history-card__feedback"
              >
                <strong>
                  Retroalimentación
                </strong>

                {{ submission.feedback }}
              </p>

            </div>

            <div class="history-card__actions">

              <div
                v-if="hasGrade(submission)"
                class="history-card__grade"
              >
                <span>
                  Nota
                </span>

                <strong>
                  {{ submission.grade }}
                </strong>
              </div>

              <RouterLink
                v-if="isTeacher"
                :to="reviewLink(submission)"
                class="history-card__review"
              >
                Abrir revisión
              </RouterLink>

              <RouterLink
                v-else
                :to="
                  `/aula/clase/${submission.lessonId}/tarea/${submission.assignmentId}`
                "
                class="history-card__review"
              >
                Ver evaluación
              </RouterLink>

            </div>

          </article>

        </div>

        <div
          v-else
          class="empty-state"
        >
          <span>✓</span>

          <div>
            <h3>
              Sin entregas todavía
            </h3>

            <p>
              Las tareas del estudiante
              aparecerán aquí.
            </p>
          </div>
        </div>

      </section>

    </template>

    <!-- =====================================================
         ESTUDIANTE NO ENCONTRADO
    ====================================================== -->

    <div
      v-else
      class="empty-state"
    >
      <span>!</span>

      <div>
        <h3>
          Estudiante no encontrado
        </h3>

        <p>
          No existe un estudiante con este identificador.
        </p>

        <RouterLink
          to="/aula/alumnos"
          class="empty-state__link"
        >
          Volver a alumnos
        </RouterLink>
      </div>
    </div>

    <!-- =====================================================
         MENSAJE
    ====================================================== -->

    <Transition name="toast">
      <div
        v-if="successMessage"
        class="profile-toast"
      >
        ✓ {{ successMessage }}
      </div>
    </Transition>

  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  RouterLink,
  useRoute
} from 'vue-router'

import {
  fetchStudentById
} from '@/services/studentService'

import {
  fetchVocalProfileByStudent,
  upsertVocalProfile
} from '@/services/vocalProfileService'

import {
  fetchAttendanceByStudent
} from '@/services/attendanceService'

import {
  fetchAssignments
} from '@/services/assignmentService'

import {
  fetchSubmissions
} from '@/services/submissionService'

import {
  fetchLessons
} from '@/services/lessonService'

import {
  useAuth
} from '@/composables/useAuth'

/* =========================================================
   BASE
========================================================= */

const route = useRoute()

const {
  isTeacher
} = useAuth()

const studentId = computed(() =>
  Number(route.params.studentId)
)

const student = ref(null)

const assignments = ref([])
const submissions = ref([])
const lessons = ref([])
const studentAttendance = ref([])
const vocalProfile = ref(null)

const isLoading = ref(true)
const loadError = ref('')

const successMessage = ref('')

/* =========================================================
   PERFIL
========================================================= */

const initials = computed(() => {
  if (!student.value?.name) {
    return '?'
  }

  return student.value.name
    .split(' ')
    .filter(Boolean)
    .map(
      word =>
        word.charAt(0)
    )
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

/* =========================================================
   CARGAR PERFIL COMPLETO
========================================================= */

const loadProfile = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const [
      loadedStudent,
      loadedAssignments,
      loadedSubmissions,
      loadedLessons,
      loadedAttendance,
      loadedVocalProfile
    ] = await Promise.all([
      fetchStudentById(
        studentId.value
      ),

      fetchAssignments(),

      fetchSubmissions(),

      fetchLessons(),

      fetchAttendanceByStudent(
        studentId.value
      ),

      fetchVocalProfileByStudent(
        studentId.value
      )
    ])

    student.value =
      loadedStudent || null

    assignments.value =
      (loadedAssignments || []).filter(
        assignment =>
          assignment.status !== 'draft'
      )

    submissions.value =
      loadedSubmissions || []

    lessons.value =
      loadedLessons || []

    studentAttendance.value =
      loadedAttendance || []

    vocalProfile.value =
      loadedVocalProfile || null

  } catch (error) {
    console.error(
      'Error cargando ficha del estudiante:',
      error
    )

    student.value = null
    assignments.value = []
    submissions.value = []
    lessons.value = []
    studentAttendance.value = []
    vocalProfile.value = null

    loadError.value =
      error?.message ||
      'No se pudo cargar la ficha desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   ENTREGAS
========================================================= */

const studentSubmissions = computed(() => {
  if (!student.value) {
    return []
  }

  return submissions.value
    .filter(
      submission =>
        Number(submission.studentId) ===
        Number(student.value.id)
    )
    .sort(
      (a, b) =>
        new Date(
          b.submittedAt ||
          b.createdAt ||
          0
        ) -
        new Date(
          a.submittedAt ||
          a.createdAt ||
          0
        )
    )
})

const reviewedSubmissions = computed(() =>
  studentSubmissions.value.filter(
    submission =>
      submission.status === 'reviewed' ||
      submission.status === 'returned' ||
      Boolean(submission.reviewedAt) ||
      hasGrade(submission)
  )
)

const averageGrade = computed(() => {
  const grades =
    reviewedSubmissions.value
      .map(
        submission =>
          Number(submission.grade)
      )
      .filter(
        grade =>
          Number.isFinite(grade) &&
          grade > 0
      )

  if (!grades.length) {
    return '—'
  }

  return (
    grades.reduce(
      (sum, grade) =>
        sum + grade,
      0
    ) / grades.length
  ).toFixed(1)
})

/* =========================================================
   ASISTENCIA
========================================================= */

const validAttendance = computed(() =>
  studentAttendance.value.filter(
    record =>
      record.status === 'present' ||
      record.status === 'absent' ||
      record.status === 'justified'
  )
)

const presentCount = computed(() =>
  validAttendance.value.filter(
    record =>
      record.status === 'present'
  ).length
)

const absentCount = computed(() =>
  validAttendance.value.filter(
    record =>
      record.status === 'absent'
  ).length
)

const justifiedCount = computed(() =>
  validAttendance.value.filter(
    record =>
      record.status === 'justified'
  ).length
)

const registeredAttendanceCount = computed(() =>
  validAttendance.value.length
)

const pendingAttendanceCount = computed(() =>
  Math.max(
    lessons.value.length -
      registeredAttendanceCount.value,
    0
  )
)

const attendancePercentage = computed(() => {
  if (
    registeredAttendanceCount.value === 0
  ) {
    return 0
  }

  return Math.round(
    (
      presentCount.value /
      registeredAttendanceCount.value
    ) * 100
  )
})

const attendanceHistory = computed(() =>
  lessons.value.map(lesson => {
    const record =
      studentAttendance.value.find(
        item =>
          Number(item.lessonId) ===
          Number(lesson.id)
      )

    return {
      lesson,

      status:
        record?.status ||
        'pending',

      notes:
        record?.notes ||
        ''
    }
  })
)

/* =========================================================
   FICHA VOCAL
========================================================= */

const isEditingVocalProfile = ref(false)
const isSavingVocalProfile = ref(false)
const vocalSaveError = ref('')

const vocalForm = reactive({
  voice: '',
  tessituraLow: '',
  tessituraHigh: '',
  comfortableLow: '',
  comfortableHigh: '',
  passaggio: '',
  observations: ''
})

const startEditingVocalProfile = () => {
  if (!student.value) {
    return
  }

  vocalSaveError.value = ''

  vocalForm.voice =
    vocalProfile.value?.voice ||
    student.value.voice ||
    ''

  vocalForm.tessituraLow =
    vocalProfile.value?.tessituraLow ||
    ''

  vocalForm.tessituraHigh =
    vocalProfile.value?.tessituraHigh ||
    ''

  vocalForm.comfortableLow =
    vocalProfile.value?.comfortableLow ||
    ''

  vocalForm.comfortableHigh =
    vocalProfile.value?.comfortableHigh ||
    ''

  vocalForm.passaggio =
    vocalProfile.value?.passaggio ||
    ''

  vocalForm.observations =
    vocalProfile.value?.observations ||
    ''

  isEditingVocalProfile.value = true
}

const cancelVocalProfileEdit = () => {
  if (isSavingVocalProfile.value) {
    return
  }

  vocalSaveError.value = ''
  isEditingVocalProfile.value = false
}

const saveVocalProfile = async () => {
  if (
    !student.value ||
    isSavingVocalProfile.value
  ) {
    return
  }

  if (!vocalForm.voice) {
    vocalSaveError.value =
      'Selecciona una clasificación vocal.'

    return
  }

  isSavingVocalProfile.value = true
  vocalSaveError.value = ''

  try {
    const savedProfile =
      await upsertVocalProfile({
        studentId:
          student.value.id,

        voice:
          vocalForm.voice,

        tessituraLow:
          vocalForm.tessituraLow,

        tessituraHigh:
          vocalForm.tessituraHigh,

        comfortableLow:
          vocalForm.comfortableLow,

        comfortableHigh:
          vocalForm.comfortableHigh,

        passaggio:
          vocalForm.passaggio,

        observations:
          vocalForm.observations
      })

    vocalProfile.value =
      savedProfile

    isEditingVocalProfile.value =
      false

    showSuccessMessage(
      'Ficha vocal guardada correctamente.'
    )

  } catch (error) {
    console.error(
      'Error guardando ficha vocal:',
      error
    )

    vocalSaveError.value =
      error?.message ||
      'No se pudo guardar la ficha vocal.'
  } finally {
    isSavingVocalProfile.value = false
  }
}

/* =========================================================
   RÚBRICA
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

const rubricProgress = computed(() => {
  const evaluated =
    reviewedSubmissions.value.filter(
      submission =>
        submission.rubric
    )

  if (!evaluated.length) {
    return null
  }

  const result = {}

  rubricCriteria.forEach(
    criterion => {
      const values =
        evaluated
          .map(
            submission =>
              Number(
                submission.rubric?.[
                  criterion.key
                ]
              )
          )
          .filter(
            value =>
              Number.isFinite(value) &&
              value > 0
          )

      if (!values.length) {
        result[criterion.key] = 0
        return
      }

      result[criterion.key] =
        Number(
          (
            values.reduce(
              (sum, value) =>
                sum + value,
              0
            ) /
            values.length
          ).toFixed(1)
        )
    }
  )

  return result
})

/* =========================================================
   UTILIDADES
========================================================= */

const getTaskTitle = assignmentId => {
  const task =
    assignments.value.find(
      assignment =>
        Number(assignment.id) ===
        Number(assignmentId)
    )

  return task?.title || 'Tarea'
}

const reviewLink = submission =>
  `/aula/clase/${submission.lessonId}/tarea/${submission.assignmentId}/entregas/${submission.id}`

const getStatusLabel = submission => {
  if (
    submission.status === 'returned'
  ) {
    return 'DEVUELTO'
  }

  if (
    submission.status === 'reviewed' ||
    submission.reviewedAt
  ) {
    return 'REVISADO'
  }

  return 'ENTREGADO'
}

const hasGrade = submission =>
  submission?.grade !== null &&
  submission?.grade !== undefined &&
  submission?.grade !== ''

const getAttendanceStatusLabel = status => {
  const labels = {
    present: 'Presente',
    absent: 'Ausente',
    justified: 'Justificado',
    pending: 'Sin registrar'
  }

  return (
    labels[status] ||
    'Sin registrar'
  )
}

const getRangeLabel = (
  low,
  high
) => {
  if (!low && !high) {
    return 'Sin registrar'
  }

  if (low && high) {
    return `${low} — ${high}`
  }

  return low || high
}

const formatDate = value => {
  if (!value) {
    return 'Sin fecha'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      dateStyle: 'medium'
    }
  ).format(date)
}

const formatDateTime = value => {
  if (!value) {
    return ''
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      dateStyle: 'medium',
      timeStyle: 'short'
    }
  ).format(date)
}

let successTimer = null

const showSuccessMessage = message => {
  successMessage.value = message

  if (successTimer) {
    window.clearTimeout(
      successTimer
    )
  }

  successTimer =
    window.setTimeout(() => {
      successMessage.value = ''
    }, 3500)
}

/* =========================================================
   INICIO
========================================================= */

onMounted(
  loadProfile
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.student-profile {
  width: 100%;
  max-width: 1150px;
  margin: 0 auto;
}

.student-profile__back {
  display: inline-flex;
  align-items: center;
  margin-bottom:
    variables.$spacing-xl;
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.student-profile__back:hover {
  transform:
    translateX(-4px);
  opacity: 0.8;
}

/* =========================================================
   HEADER
========================================================= */

.student-profile__header {
  margin-bottom:
    variables.$spacing-xl;
  padding:
    variables.$spacing-2xl;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.student-profile__identity {
  display: flex;
  gap:
    variables.$spacing-xl;
  align-items: center;
}

.student-profile__avatar {
  display: grid;
  width: 90px;
  height: 90px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
  font-size: 1.8rem;
  font-weight:
    variables.$font-weight-bold;
}

.student-profile__identity-text p {
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.student-profile__identity-text h1 {
  margin-bottom:
    variables.$spacing-sm;
  font-size:
    clamp(
      2.5rem,
      6vw,
      4.5rem
    );
}

.student-profile__identity-meta {
  display: flex;
  gap:
    variables.$spacing-sm;
  align-items: center;
  flex-wrap: wrap;
}

.voice-badge,
.status-badge {
  display: inline-flex;
  padding:
    0.4rem
    0.75rem;
  border-radius: 999px;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
}

.voice-badge {
  border:
    1px solid
    variables.$color-primary;
  color:
    variables.$color-primary;
}

.status-badge {
  border:
    1px solid
    variables.$color-border;
  opacity: 0.7;
}

.status-badge--inactive {
  opacity: 0.4;
}

/* =========================================================
   RESUMEN
========================================================= */

.student-profile__summary {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  margin-bottom:
    variables.$spacing-3xl;
}

.student-profile__summary article {
  padding:
    variables.$spacing-xl;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.student-profile__summary span,
.student-profile__summary strong,
.student-profile__summary small {
  display: block;
}

.student-profile__summary span {
  margin-bottom:
    variables.$spacing-sm;
  opacity: 0.55;
}

.student-profile__summary strong {
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size: 2rem;
}

.student-profile__summary small {
  opacity: 0.35;
}

/* =========================================================
   SECCIONES
========================================================= */

.student-profile__section {
  margin-bottom:
    variables.$spacing-3xl;
}

.student-profile__section-title {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  margin-bottom:
    variables.$spacing-xl;
}

.student-profile__section-title > span {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-bold;
}

.student-profile__section-title p {
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  text-transform: uppercase;
}

.student-profile__section-title h2 {
  margin: 0;
}

/* =========================================================
   FICHA VOCAL
========================================================= */

.vocal-card,
.attendance-profile,
.rubric-overview {
  padding:
    variables.$spacing-xl;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.vocal-card__header {
  display: flex;
  gap:
    variables.$spacing-xl;
  align-items: center;
  justify-content:
    space-between;
  margin-bottom:
    variables.$spacing-xl;
  padding-bottom:
    variables.$spacing-xl;
  border-bottom:
    1px solid
    variables.$color-border;
}

.vocal-card__header span,
.vocal-card__header strong {
  display: block;
}

.vocal-card__header span {
  margin-bottom:
    variables.$spacing-xs;
  opacity: 0.55;
}

.vocal-card__header strong {
  color:
    variables.$color-primary;
  font-size: 1.7rem;
}

.vocal-card__grid {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
  margin-bottom:
    variables.$spacing-xl;
}

.vocal-card__grid article,
.vocal-card__observations {
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
}

.vocal-card__grid span,
.vocal-card__grid strong {
  display: block;
}

.vocal-card__grid span {
  margin-bottom:
    variables.$spacing-sm;
  opacity: 0.5;
}

.vocal-card__grid strong {
  color:
    variables.$color-primary;
}

.vocal-card__observations span {
  display: block;
  margin-bottom:
    variables.$spacing-sm;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  text-transform: uppercase;
}

.vocal-card__observations p {
  margin: 0;
  line-height: 1.7;
  opacity: 0.75;
}

.vocal-card__updated {
  display: block;
  margin-top:
    variables.$spacing-md;
  opacity: 0.4;
}

/* =========================================================
   BOTONES
========================================================= */

.vocal-card__edit,
.button-primary,
.button-secondary {
  padding:
    variables.$spacing-md
    variables.$spacing-lg;
  border-radius:
    variables.$radius-lg;
  font: inherit;
  font-weight:
    variables.$font-weight-semibold;
  cursor: pointer;
}

.vocal-card__edit,
.button-secondary {
  border:
    1px solid
    variables.$color-primary;
  background:
    transparent;
  color:
    variables.$color-primary;
}

.button-primary {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

button:disabled {
  cursor: wait;
  opacity: 0.5;
}

/* =========================================================
   FORMULARIO VOCAL
========================================================= */

.vocal-form {
  display: grid;
  gap:
    variables.$spacing-xl;
}

.vocal-form__header {
  display: flex;
  gap:
    variables.$spacing-lg;
  align-items: center;
  justify-content:
    space-between;
}

.vocal-form__header span {
  color:
    variables.$color-primary;
}

.vocal-form__student {
  opacity: 0.7;
}

.vocal-form__grid,
.vocal-form__ranges {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

.vocal-form__range-block {
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
}

.vocal-form__range-block h4 {
  margin-bottom:
    variables.$spacing-lg;
}

.vocal-form__range {
  display: grid;
  gap:
    variables.$spacing-sm;
  align-items: end;
  grid-template-columns:
    1fr auto 1fr;
}

.vocal-form__range-separator {
  padding-bottom: 0.8rem;
  color:
    variables.$color-primary;
}

.vocal-form__field {
  display: grid;
  gap:
    variables.$spacing-sm;
}

.vocal-form__field > span {
  opacity: 0.6;
  font-size:
    variables.$font-size-sm;
}

.vocal-form__field input,
.vocal-form__field select,
.vocal-form__field textarea {
  width: 100%;
  padding:
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  outline: none;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
}

.vocal-form__field input:focus,
.vocal-form__field select:focus,
.vocal-form__field textarea:focus {
  border-color:
    variables.$color-primary;
}

.vocal-form__field textarea {
  resize: vertical;
}

.vocal-form__actions {
  display: flex;
  gap:
    variables.$spacing-md;
  justify-content:
    flex-end;
}

.form-message {
  padding:
    variables.$spacing-md;
  border-radius:
    variables.$radius-lg;
}

.form-message--error {
  border:
    1px solid
    variables.$color-primary;
  color:
    variables.$color-primary;
}

/* =========================================================
   ASISTENCIA
========================================================= */

.attendance-profile__main {
  display: grid;
  gap:
    variables.$spacing-xl;
  align-items: center;
  grid-template-columns:
    auto 1fr;
  margin-bottom:
    variables.$spacing-xl;
}

.attendance-profile__percentage {
  display: grid;
  width: 145px;
  height: 145px;
  place-items: center;
  align-content: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
}

.attendance-profile__percentage strong {
  color:
    variables.$color-primary;
  font-size: 2.3rem;
}

.attendance-profile__percentage span {
  margin-top: 4px;
  opacity: 0.55;
}

.attendance-profile__progress-info {
  display: flex;
  gap:
    variables.$spacing-md;
  justify-content:
    space-between;
  margin-bottom:
    variables.$spacing-sm;
}

.attendance-profile__progress-info span {
  opacity: 0.6;
}

.attendance-profile__progress-info strong {
  color:
    variables.$color-primary;
}

.attendance-profile__bar {
  overflow: hidden;
  height: 10px;
  border-radius: 999px;
  background:
    variables.$color-border;
}

.attendance-profile__fill {
  height: 100%;
  border-radius: inherit;
  background:
    variables.$color-primary;
  transition:
    width 0.3s ease;
}

.attendance-profile__help {
  margin:
    variables.$spacing-sm
    0 0;
  font-size:
    variables.$font-size-xs;
  opacity: 0.4;
}

.attendance-profile__stats {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  margin-bottom:
    variables.$spacing-2xl;
}

.attendance-profile__stats article {
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
}

.attendance-profile__stats span,
.attendance-profile__stats strong {
  display: block;
}

.attendance-profile__stats span {
  margin-bottom:
    variables.$spacing-xs;
  opacity: 0.55;
}

.attendance-profile__stats strong {
  color:
    variables.$color-primary;
  font-size: 1.6rem;
}

/* =========================================================
   HISTORIAL ASISTENCIA
========================================================= */

.attendance-history {
  padding-top:
    variables.$spacing-xl;
  border-top:
    1px solid
    variables.$color-border;
}

.attendance-history__header {
  display: flex;
  gap:
    variables.$spacing-lg;
  align-items: center;
  justify-content:
    space-between;
  margin-bottom:
    variables.$spacing-lg;
}

.attendance-history__header span {
  display: block;
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  text-transform: uppercase;
}

.attendance-history__header h3 {
  margin: 0;
}

.attendance-history__link {
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
}

.attendance-history__list {
  display: grid;
  gap:
    variables.$spacing-sm;
}

.attendance-history__item {
  display: grid;
  gap:
    variables.$spacing-md;
  align-items: center;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  padding:
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
}

.attendance-history__lesson span,
.attendance-history__lesson strong,
.attendance-history__lesson small {
  display: block;
}

.attendance-history__lesson span {
  margin-bottom: 3px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  text-transform: uppercase;
}

.attendance-history__lesson small {
  margin-top: 4px;
  opacity: 0.45;
}

.attendance-history__status {
  padding:
    0.45rem 0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  font-size:
    variables.$font-size-sm;
}

.attendance-history__status--present {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
}

.attendance-history__status--absent {
  opacity: 0.7;
}

.attendance-history__status--justified {
  border-color:
    variables.$color-primary;
  opacity: 0.85;
}

.attendance-history__status--pending {
  opacity: 0.35;
}

.attendance-history__note {
  grid-column: 1 / -1;
  margin: 0;
  padding-top:
    variables.$spacing-sm;
  border-top:
    1px solid
    variables.$color-border;
  opacity: 0.65;
}

/* =========================================================
   RÚBRICA
========================================================= */

.rubric-overview {
  display: grid;
  gap:
    variables.$spacing-lg;
}

.rubric-overview__item {
  display: grid;
  gap:
    variables.$spacing-sm;
}

.rubric-overview__info {
  display: flex;
  justify-content:
    space-between;
}

.rubric-overview__info strong {
  color:
    variables.$color-primary;
}

.rubric-overview__bar {
  overflow: hidden;
  height: 8px;
  border-radius: 999px;
  background:
    variables.$color-border;
}

.rubric-overview__fill {
  height: 100%;
  border-radius: inherit;
  background:
    variables.$color-primary;
  transition:
    width 0.3s ease;
}

/* =========================================================
   ENTREGAS
========================================================= */

.history {
  display: grid;
  gap:
    variables.$spacing-md;
}

.history-card {
  display: grid;
  gap:
    variables.$spacing-lg;
  align-items: center;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  padding:
    variables.$spacing-xl;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.history-card__main > span {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  font-weight:
    variables.$font-weight-semibold;
  letter-spacing: 0.08em;
}

.history-card__main h3 {
  margin:
    variables.$spacing-xs
    0;
}

.history-card__main p {
  margin-bottom:
    variables.$spacing-xs;
  opacity: 0.7;
}

.history-card__main small {
  opacity: 0.45;
}

.history-card__feedback {
  margin-top:
    variables.$spacing-md !important;
  padding-top:
    variables.$spacing-md;
  border-top:
    1px solid
    variables.$color-border;
  line-height: 1.6;
}

.history-card__feedback strong {
  display: block;
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
}

.history-card__actions {
  display: grid;
  gap:
    variables.$spacing-sm;
}

.history-card__grade {
  display: grid;
  min-width: 80px;
  place-items: center;
  padding:
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
}

.history-card__grade span {
  font-size:
    variables.$font-size-xs;
  opacity: 0.55;
}

.history-card__grade strong {
  color:
    variables.$color-primary;
  font-size: 1.6rem;
}

.history-card__review {
  padding:
    8px 10px;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  font-weight:
    variables.$font-weight-semibold;
  text-align: center;
  text-decoration: none;
}

/* =========================================================
   ESTADOS
========================================================= */

.empty-state,
.state-card {
  display: flex;
  gap:
    variables.$spacing-lg;
  align-items: center;
  padding:
    variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.empty-state > span,
.state-card > span {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

.empty-state h3,
.state-card h3 {
  margin-bottom:
    variables.$spacing-xs;
}

.empty-state p,
.state-card p {
  margin: 0;
  opacity: 0.6;
}

.empty-state--small {
  margin-top:
    variables.$spacing-md;
}

.empty-state__link {
  display: inline-block;
  margin-top:
    variables.$spacing-md;
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
}

.state-card {
  min-height: 220px;
  justify-content: center;
}

.state-card button {
  margin-top:
    variables.$spacing-sm;
  padding:
    variables.$spacing-sm
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  cursor: pointer;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =========================================================
   TOAST
========================================================= */

.profile-toast {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1000;
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
  color:
    variables.$color-white;
  box-shadow:
    0 15px 50px
    rgba(0, 0, 0, 0.35);
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform:
    translateY(10px);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 850px) {

  .student-profile__summary,
  .attendance-profile__stats {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .vocal-card__grid,
  .vocal-form__grid,
  .vocal-form__ranges {
    grid-template-columns: 1fr;
  }

  .vocal-form__range {
    grid-template-columns: 1fr;
  }

  .vocal-form__range-separator {
    display: none;
  }
}

@media (max-width: 650px) {

  .student-profile__identity,
  .vocal-card__header,
  .vocal-form__header,
  .attendance-history__header {
    align-items:
      flex-start;
    flex-direction:
      column;
  }

  .student-profile__summary,
  .attendance-profile__stats {
    grid-template-columns: 1fr;
  }

  .attendance-profile__main {
    grid-template-columns: 1fr;
  }

  .attendance-profile__percentage {
    justify-self: center;
  }

  .attendance-history__item,
  .history-card {
    grid-template-columns: 1fr;
  }

  .attendance-history__status {
    width: fit-content;
  }

  .vocal-form__actions {
    flex-direction:
      column-reverse;
  }

  .vocal-form__actions button,
  .vocal-card__edit {
    width: 100%;
  }

  .profile-toast {
    right:
      variables.$spacing-md;
    bottom:
      variables.$spacing-md;
    left:
      variables.$spacing-md;
  }
}
</style>
