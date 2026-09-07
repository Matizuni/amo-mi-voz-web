<template>
  <section class="student-profile">
    <!-- =====================================================
         VOLVER
    ====================================================== -->
    <RouterLink
      to="/aula/alumnos"
      class="student-profile__back"
    >
      <span aria-hidden="true">←</span>
      Alumnos
    </RouterLink>

    <!-- =====================================================
         CARGA
    ====================================================== -->
    <section
      v-if="isLoading"
      class="state-card"
      role="status"
      aria-live="polite"
    >
      <div class="loading-spinner"></div>

      <div>
        <strong>
          Preparando ficha del estudiante
        </strong>

        <p>
          Cargando perfil vocal, asistencia
          y evaluaciones.
        </p>
      </div>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="state-card state-card--error"
      role="alert"
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
      <!-- ===================================================
           HERO DEL ESTUDIANTE
      ==================================================== -->
      <header class="student-profile__hero">
        <div class="student-profile__identity">
          <div class="student-profile__avatar">
            {{ initials }}
          </div>

          <div class="student-profile__identity-copy">
            <p class="student-profile__eyebrow">
              Perfil académico
            </p>

            <h1>
              {{ student.name }}
            </h1>

            <div class="student-profile__badges">
              <span class="voice-badge">
                {{
                  vocalProfile?.voice ||
                  student.voice ||
                  'Sin clasificación'
                }}
              </span>

              <span
                class="status-badge"
                :class="{
                  'status-badge--inactive':
                    !student.active
                }"
              >
                <i></i>

                {{
                  student.active
                    ? 'Activo'
                    : 'Inactivo'
                }}
              </span>
            </div>
          </div>
        </div>

        <div class="student-profile__hero-actions">
          <button
            v-if="isTeacher"
            type="button"
            class="student-profile__edit-profile"
            @click="startEditingVocalProfile"
          >
            Editar ficha vocal
          </button>
        </div>
      </header>

      <!-- ===================================================
           RESUMEN
      ==================================================== -->
      <section
        class="student-profile__summary"
        aria-label="Resumen académico"
      >
        <article class="summary-card summary-card--primary">
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
      </section>

      <!-- ===================================================
           NAVEGACIÓN INTERNA
      ==================================================== -->
      <nav
        class="profile-nav"
        aria-label="Secciones de la ficha"
      >
        <a href="#ficha-vocal">
          Ficha vocal
        </a>

        <a href="#asistencia">
          Asistencia
        </a>

        <a href="#progreso">
          Progreso
        </a>

        <a href="#evaluaciones">
          Evaluaciones
        </a>
      </nav>

      <!-- =====================================================
           01 · FICHA VOCAL
      ====================================================== -->
      <section
        id="ficha-vocal"
        class="student-profile__section"
      >
        <div class="student-profile__section-header">
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

          <p>
            Registro vocal, seguimiento y observaciones para acompañar el desarrollo del estudiante.
          </p>
        </div>

        <div class="vocal-card">
          <!-- ===============================================
               VISUALIZACIÓN
          ================================================ -->
          <template v-if="!isEditingVocalProfile">
            <div class="vocal-card__classification">
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
                class="button-secondary"
                @click="startEditingVocalProfile"
              >
                Editar
              </button>
            </div>

            <div class="vocal-card__metrics">
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
              Actualizada
              {{ formatDateTime(vocalProfile.updatedAt) }}
            </small>
          </template>

          <!-- ===============================================
               EDICIÓN
          ================================================ -->
          <form
            v-else
            class="vocal-form"
            @submit.prevent="saveVocalProfile"
          >
            <header class="vocal-form__header">
              <div>
                <span>
                  Profesor
                </span>

                <h3>
                  Editar ficha vocal
                </h3>
              </div>

              <strong>
                {{ student.name }}
              </strong>
            </header>

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
                />
              </label>
            </div>

            <div class="vocal-form__ranges">
              <fieldset class="vocal-form__range-block">
                <legend>
                  Tesitura
                </legend>

                <div class="vocal-form__range">
                  <label class="vocal-form__field">
                    <span>
                      Nota inferior
                    </span>

                    <input
                      v-model.trim="vocalForm.tessituraLow"
                      type="text"
                      placeholder="Ej: C3"
                    />
                  </label>

                  <span
                    class="vocal-form__range-separator"
                    aria-hidden="true"
                  >
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
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset class="vocal-form__range-block">
                <legend>
                  Zona cómoda
                </legend>

                <div class="vocal-form__range">
                  <label class="vocal-form__field">
                    <span>
                      Nota inferior
                    </span>

                    <input
                      v-model.trim="vocalForm.comfortableLow"
                      type="text"
                      placeholder="Ej: E3"
                    />
                  </label>

                  <span
                    class="vocal-form__range-separator"
                    aria-hidden="true"
                  >
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
                    />
                  </label>
                </div>
              </fieldset>
            </div>

            <label class="vocal-form__field">
              <span>
                Observaciones del profesor
              </span>

              <textarea
                v-model.trim="vocalForm.observations"
                rows="5"
                maxlength="1500"
                placeholder="Fortalezas, respiración, afinación, resonancia, interpretación..."
              ></textarea>
            </label>

            <div
              v-if="vocalSaveError"
              class="form-message form-message--error"
              role="alert"
            >
              {{ vocalSaveError }}
            </div>

            <footer class="vocal-form__actions">
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
                    : 'Guardar ficha'
                }}
              </button>
            </footer>
          </form>
        </div>
      </section>

      <!-- =====================================================
           02 · ASISTENCIA
      ====================================================== -->
      <section
        id="asistencia"
        class="student-profile__section"
      >
        <div class="student-profile__section-header">
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

          <RouterLink
            v-if="isTeacher"
            to="/aula/asistencia"
            class="section-link"
          >
            Administrar
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <div class="attendance-profile">
          <div class="attendance-profile__overview">
            <div
              class="attendance-profile__percentage"
              :class="attendanceHealthClass"
            >
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
                  Clases con registro
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
                  :class="attendanceHealthClass"
                  :style="{
                    width: `${attendancePercentage}%`
                  }"
                ></div>
              </div>

              <p>
                El porcentaje se calcula sobre
                las clases donde existe un registro.
              </p>
            </div>
          </div>

          <div class="attendance-profile__stats">
            <article class="attendance-stat attendance-stat--present">
              <span>
                Presentes
              </span>

              <strong>
                {{ presentCount }}
              </strong>
            </article>

            <article class="attendance-stat attendance-stat--absent">
              <span>
                Ausencias
              </span>

              <strong>
                {{ absentCount }}
              </strong>
            </article>

            <article class="attendance-stat attendance-stat--justified">
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

          <!-- ===============================================
               HISTORIAL
          ================================================ -->
          <div class="attendance-history">
            <header class="attendance-history__header">
              <div>
                <span>
                  Historial
                </span>

                <h3>
                  Clases del programa
                </h3>
              </div>
            </header>

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
                    Clase
                    {{ getAcademicLessonNumber(item.lesson) }}
                  </span>

                  <strong>
                    {{ cleanLessonTitle(item.lesson.title) }}
                  </strong>

                  <small>
                    {{ formatLessonDate(item.lesson.date) }}
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
              <span>
                ♪
              </span>

              <div>
                <h3>
                  Sin clases registradas
                </h3>

                <p>
                  El historial aparecerá
                  cuando existan clases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =====================================================
           03 · PROGRESO VOCAL
      ====================================================== -->
      <section
        id="progreso"
        class="student-profile__section"
      >
        <div class="student-profile__section-header">
          <div class="student-profile__section-title">
            <span>
              03
            </span>

            <div>
              <p>
                Evaluación
              </p>

              <h2>
                Progreso vocal
              </h2>
            </div>
          </div>

          <p>
            Promedio de criterios evaluados
            mediante rúbricas.
          </p>
        </div>

        <div
          v-if="rubricProgress"
          class="rubric-overview"
        >
          <article
            v-for="criterion in rubricCriteria"
            :key="criterion.key"
            class="rubric-overview__item"
          >
            <div class="rubric-overview__top">
              <span>
                {{ criterion.label }}
              </span>

              <strong>
                {{ rubricProgress[criterion.key] }}
                <small>/ 5</small>
              </strong>
            </div>

            <div class="rubric-overview__bar">
              <div
                class="rubric-overview__fill"
                :style="{
                  width:
                    `${(
                      rubricProgress[criterion.key] /
                      5
                    ) * 100}%`
                }"
              ></div>
            </div>
          </article>
        </div>

        <div
          v-else
          class="empty-state"
        >
          <span>
            ♪
          </span>

          <div>
            <h3>
              Todavía no hay evaluaciones vocales
            </h3>

            <p>
              Los indicadores aparecerán
              cuando existan rúbricas evaluadas.
            </p>
          </div>
        </div>
      </section>

      <!-- =====================================================
           04 · ENTREGAS
      ====================================================== -->
      <section
        id="evaluaciones"
        class="student-profile__section"
      >
        <div class="student-profile__section-header">
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

          <p>
            Trabajos enviados,
            calificaciones y retroalimentación.
          </p>
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
              <div class="history-card__meta">
                <span
                  class="submission-status"
                  :class="
                    getSubmissionStatusClass(
                      submission
                    )
                  "
                >
                  {{ getStatusLabel(submission) }}
                </span>

                <span>
                  Clase
                  {{
                    getAcademicLessonNumberById(
                      submission.lessonId
                    )
                  }}
                </span>
              </div>

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

              <div
                v-if="submission.feedback"
                class="history-card__feedback"
              >
                <strong>
                  Retroalimentación
                </strong>

                <p>
                  {{ submission.feedback }}
                </p>
              </div>
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
                  {{ formatGrade(submission.grade) }}
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
          <span>
            ✓
          </span>

          <div>
            <h3>
              Sin entregas todavía
            </h3>

            <p>
              Los trabajos enviados
              aparecerán aquí.
            </p>
          </div>
        </div>
      </section>
    </template>

    <!-- =====================================================
         NO ENCONTRADO
    ====================================================== -->
    <section
      v-else
      class="empty-state"
    >
      <span>
        !
      </span>

      <div>
        <h3>
          Estudiante no encontrado
        </h3>

        <p>
          El perfil solicitado no existe
          o ya no está disponible.
        </p>

        <RouterLink
          to="/aula/alumnos"
          class="empty-state__link"
        >
          Volver a alumnos
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Transition name="toast">
      <div
        v-if="successMessage"
        class="profile-toast"
        role="status"
        aria-live="polite"
      >
        <span>
          ✓
        </span>

        {{ successMessage }}
      </div>
    </Transition>
  </section>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
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

const studentId =
  computed(() =>
    Number(
      route.params.studentId
    )
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

let successTimer = null

/* =========================================================
   IDENTIDAD
========================================================= */

const initials =
  computed(() => {
    if (!student.value?.name) {
      return '?'
    }

    return String(
      student.value.name
    )
      .trim()
      .split(/\s+/)
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
   CARGAR PERFIL
========================================================= */

const loadProfile =
  async () => {
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
        (loadedAssignments || [])
          .filter(
            assignment =>
              assignment.status !==
              'draft'
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
        'No se pudo cargar la ficha del estudiante.'
    } finally {
      isLoading.value = false
    }
  }

/* =========================================================
   NUMERACIÓN ACADÉMICA
========================================================= */

const getLessonUnitId =
  lesson =>
    lesson?.unitId ??
    lesson?.unit_id ??
    null

/*
 * El id de Supabase identifica la fila.
 * El número académico corresponde a la
 * posición dentro de la unidad.
 */
const getAcademicLessonNumber =
  lesson => {
    if (!lesson) {
      return 0
    }

    const unitId =
      getLessonUnitId(
        lesson
      )

    const unitLessons =
      lessons.value.filter(
        item => {
          const itemUnitId =
            getLessonUnitId(
              item
            )

          if (
            unitId === null
          ) {
            return (
              itemUnitId === null
            )
          }

          return (
            String(itemUnitId) ===
            String(unitId)
          )
        }
      )

    const unitIndex =
      unitLessons.findIndex(
        item =>
          Number(item.id) ===
          Number(lesson.id)
      )

    if (unitIndex >= 0) {
      return unitIndex + 1
    }

    const globalIndex =
      lessons.value.findIndex(
        item =>
          Number(item.id) ===
          Number(lesson.id)
      )

    return globalIndex >= 0
      ? globalIndex + 1
      : 0
  }

const getAcademicLessonNumberById =
  lessonId => {
    const lesson =
      lessons.value.find(
        item =>
          Number(item.id) ===
          Number(lessonId)
      )

    return lesson
      ? getAcademicLessonNumber(
          lesson
        )
      : '—'
  }

const cleanLessonTitle =
  title => {
    if (!title) {
      return 'Clase sin título'
    }

    return String(title)
      .replace(
        /^\s*clase\s+\d+\s*[·:–—-]?\s*/i,
        ''
      )
      .trim()
  }

/* =========================================================
   ENTREGAS
========================================================= */

const studentSubmissions =
  computed(() => {
    if (!student.value) {
      return []
    }

    return submissions.value
      .filter(
        submission =>
          Number(
            submission.studentId
          ) ===
          Number(
            student.value.id
          )
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

const reviewedSubmissions =
  computed(() =>
    studentSubmissions.value.filter(
      submission =>
        submission.status ===
          'reviewed' ||
        submission.status ===
          'returned' ||
        Boolean(
          submission.reviewedAt
        ) ||
        hasGrade(
          submission
        )
    )
  )

const averageGrade =
  computed(() => {
    const grades =
      reviewedSubmissions.value
        .map(
          submission =>
            Number(
              submission.grade
            )
        )
        .filter(
          grade =>
            Number.isFinite(
              grade
            ) &&
            grade > 0
        )

    if (!grades.length) {
      return '—'
    }

    return (
      grades.reduce(
        (
          sum,
          grade
        ) =>
          sum + grade,
        0
      ) /
      grades.length
    ).toFixed(1)
  })

/* =========================================================
   ASISTENCIA
========================================================= */

const validAttendance =
  computed(() =>
    studentAttendance.value.filter(
      record =>
        record.status ===
          'present' ||
        record.status ===
          'absent' ||
        record.status ===
          'justified'
    )
  )

const presentCount =
  computed(() =>
    validAttendance.value.filter(
      record =>
        record.status ===
        'present'
    ).length
  )

const absentCount =
  computed(() =>
    validAttendance.value.filter(
      record =>
        record.status ===
        'absent'
    ).length
  )

const justifiedCount =
  computed(() =>
    validAttendance.value.filter(
      record =>
        record.status ===
        'justified'
    ).length
  )

const registeredAttendanceCount =
  computed(() =>
    validAttendance.value.length
  )

const pendingAttendanceCount =
  computed(() =>
    Math.max(
      lessons.value.length -
        registeredAttendanceCount.value,
      0
    )
  )

const attendancePercentage =
  computed(() => {
    if (
      registeredAttendanceCount.value ===
      0
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

const attendanceHealthClass =
  computed(() => {
    if (
      attendancePercentage.value >=
      85
    ) {
      return 'attendance-health--good'
    }

    if (
      attendancePercentage.value >=
      70
    ) {
      return 'attendance-health--warning'
    }

    return 'attendance-health--low'
  })

const attendanceHistory =
  computed(() =>
    lessons.value.map(
      lesson => {
        const record =
          studentAttendance.value.find(
            item =>
              Number(
                item.lessonId
              ) ===
              Number(
                lesson.id
              )
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
      }
    )
  )

/* =========================================================
   FICHA VOCAL
========================================================= */

const isEditingVocalProfile =
  ref(false)

const isSavingVocalProfile =
  ref(false)

const vocalSaveError =
  ref('')

const vocalForm =
  reactive({
    voice: '',
    tessituraLow: '',
    tessituraHigh: '',
    comfortableLow: '',
    comfortableHigh: '',
    passaggio: '',
    observations: ''
  })

const startEditingVocalProfile =
  () => {
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

    isEditingVocalProfile.value =
      true
  }

const cancelVocalProfileEdit =
  () => {
    if (
      isSavingVocalProfile.value
    ) {
      return
    }

    vocalSaveError.value = ''
    isEditingVocalProfile.value =
      false
  }

const saveVocalProfile =
  async () => {
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

    isSavingVocalProfile.value =
      true

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

      /*
       * Mantiene visible la nueva
       * clasificación inmediatamente.
       */
      if (
        student.value &&
        vocalForm.voice
      ) {
        student.value = {
          ...student.value,
          voice:
            vocalForm.voice
        }
      }

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
      isSavingVocalProfile.value =
        false
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

const rubricProgress =
  computed(() => {
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
                Number.isFinite(
                  value
                ) &&
                value > 0
            )

        if (!values.length) {
          result[
            criterion.key
          ] = 0

          return
        }

        result[
          criterion.key
        ] =
          Number(
            (
              values.reduce(
                (
                  sum,
                  value
                ) =>
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

const getTaskTitle =
  assignmentId => {
    const task =
      assignments.value.find(
        assignment =>
          Number(
            assignment.id
          ) ===
          Number(
            assignmentId
          )
      )

    return (
      task?.title ||
      'Tarea'
    )
  }

const reviewLink =
  submission =>
    `/aula/clase/${submission.lessonId}` +
    `/tarea/${submission.assignmentId}` +
    `/entregas/${submission.id}`

const getStatusLabel =
  submission => {
    if (
      submission.status ===
      'returned'
    ) {
      return 'Devuelto'
    }

    if (
      submission.status ===
        'reviewed' ||
      submission.reviewedAt
    ) {
      return 'Revisado'
    }

    return 'Entregado'
  }

const getSubmissionStatusClass =
  submission => {
    if (
      submission.status ===
      'returned'
    ) {
      return 'submission-status--returned'
    }

    if (
      submission.status ===
        'reviewed' ||
      submission.reviewedAt
    ) {
      return 'submission-status--reviewed'
    }

    return 'submission-status--delivered'
  }

const hasGrade =
  submission =>
    submission?.grade !== null &&
    submission?.grade !== undefined &&
    submission?.grade !== '' &&
    Number.isFinite(
      Number(
        submission.grade
      )
    )

const formatGrade =
  value => {
    const grade =
      Number(value)

    return Number.isFinite(
      grade
    )
      ? grade.toFixed(1)
      : '—'
  }

const getAttendanceStatusLabel =
  status => {
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

const getRangeLabel =
  (
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

/* =========================================================
   FECHAS
========================================================= */

const formatLessonDate =
  value => {
    if (!value) {
      return 'Sin fecha'
    }

    const raw =
      String(value).trim()

    const isoMatch =
      raw.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
      )

    if (!isoMatch) {
      return raw
    }

    const [
      ,
      year,
      month,
      day
    ] = isoMatch

    const date =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      )

    return new Intl.DateTimeFormat(
      'es-CL',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    ).format(date)
  }

const formatDate =
  value => {
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
      return String(value)
    }

    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium'
      }
    ).format(date)
  }

const formatDateTime =
  value => {
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

/* =========================================================
   MENSAJES
========================================================= */

const showSuccessMessage =
  message => {
    successMessage.value =
      message

    if (successTimer) {
      window.clearTimeout(
        successTimer
      )
    }

    successTimer =
      window.setTimeout(
        () => {
          successMessage.value =
            ''
        },
        3500
      )
  }

/* =========================================================
   VIDA
========================================================= */

onMounted(
  loadProfile
)

onBeforeUnmount(() => {
  if (successTimer) {
    window.clearTimeout(
      successTimer
    )
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.student-profile {
  width: 100%;
  max-width: 1200px;

  margin: 0 auto;

  padding-bottom:
    variables.$spacing-4xl;
}

.student-profile__back {
  display: inline-flex;

  min-height: 42px;

  gap:
    variables.$spacing-sm;

  align-items: center;

  margin-bottom:
    variables.$spacing-xl;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;

  transition:
    color
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.student-profile__back:hover {
  color:
    variables.$color-primary;

  transform:
    translateX(-3px);
}

/* =========================================================
   HERO
========================================================= */

.student-profile__hero {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: center;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-lg;

  padding:
    variables.$spacing-2xl;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-xl;

  background:
    linear-gradient(
      145deg,
      variables.$color-surface-elevated,
      variables.$color-surface
    );
}

.student-profile__identity {
  display: flex;

  min-width: 0;

  gap:
    variables.$spacing-xl;

  align-items: center;
}

.student-profile__avatar {
  display: grid;

  width: 86px;
  height: 86px;

  flex: 0 0 auto;

  place-items: center;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.07
    );

  font-size: 1.6rem;

  font-weight:
    variables.$font-weight-semibold;
}

.student-profile__identity-copy {
  min-width: 0;
}

.student-profile__eyebrow {
  margin:
    0
    0
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.1em;

  text-transform:
    uppercase;
}

.student-profile__identity-copy h1 {
  overflow: hidden;

  margin: 0;

  font-size:
    clamp(
      2.35rem,
      5vw,
      4.2rem
    );

  line-height: 1;

  text-overflow: ellipsis;
}

.student-profile__badges {
  display: flex;

  gap:
    variables.$spacing-sm;

  flex-wrap: wrap;

  margin-top:
    variables.$spacing-md;
}

.voice-badge,
.status-badge {
  display: inline-flex;

  min-height: 34px;

  gap: 7px;

  align-items: center;

  padding:
    0
    0.8rem;

  border-radius:
    variables.$radius-pill;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;
}

.voice-badge {
  border:
    1px solid
    variables.$color-border-primary;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.05
    );
}

.status-badge {
  border:
    1px solid
    rgba(
      variables.$color-success,
      0.25
    );

  color:
    variables.$color-success;

  background:
    variables.$color-success-soft;
}

.status-badge i {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    currentColor;
}

.status-badge--inactive {
  border-color:
    variables.$color-border;

  color:
    variables.$color-text-muted;

  background:
    variables.$color-surface-light;
}

.student-profile__edit-profile {
  min-height:
    variables.$control-height-md;

  padding:
    0
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    transparent;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  cursor: pointer;
}

.student-profile__edit-profile:hover {
  border-color:
    variables.$color-primary;
}

/* =========================================================
   SUMMARY
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
    variables.$spacing-lg;
}

.student-profile__summary article {
  min-width: 0;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

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

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.student-profile__summary strong {
  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-text-primary;

  font-size:
    clamp(
      1.6rem,
      3vw,
      2.1rem
    );

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

.student-profile__summary small {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.student-profile__summary
.summary-card--primary {
  border-color:
    variables.$color-border-primary;

  background:
    linear-gradient(
      145deg,
      rgba(
        variables.$color-primary,
        0.07
      ),
      variables.$color-surface
    );
}

.student-profile__summary
.summary-card--primary strong {
  color:
    variables.$color-primary;
}

/* =========================================================
   PROFILE NAV
========================================================= */

.profile-nav {
  position: sticky;

  top: 92px;

  z-index: 20;

  display: flex;

  gap:
    variables.$spacing-xs;

  overflow-x: auto;

  margin-bottom:
    variables.$spacing-3xl;

  padding:
    variables.$spacing-sm;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    rgba(
      variables.$color-surface,
      0.94
    );

  backdrop-filter:
    blur(12px);

  scrollbar-width: none;
}

.profile-nav::-webkit-scrollbar {
  display: none;
}

.profile-nav a {
  min-height: 40px;

  display: inline-flex;

  flex: 0 0 auto;

  align-items: center;

  padding:
    0
    variables.$spacing-md;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;
}

.profile-nav a:hover {
  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.06
    );
}

/* =========================================================
   SECTIONS
========================================================= */

.student-profile__section {
  scroll-margin-top: 160px;

  margin-bottom:
    variables.$spacing-4xl;
}

.student-profile__section-header {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-xl;
}

.student-profile__section-title {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;
}

.student-profile__section-title > span {
  display: grid;

  width: 48px;
  height: 48px;

  flex: 0 0 auto;

  place-items: center;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.04
    );

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.student-profile__section-title p {
  margin:
    0
    0
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.08em;

  text-transform:
    uppercase;
}

.student-profile__section-title h2 {
  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    clamp(
      1.55rem,
      3vw,
      2rem
    );

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.03em;
}

.student-profile__section-header > p {
  max-width: 360px;

  margin: 0;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;

  line-height: 1.6;

  text-align: right;
}

.section-link {
  display: inline-flex;

  gap:
    variables.$spacing-sm;

  align-items: center;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

/* =========================================================
   VOCAL CARD
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
    variables.$radius-xl;

  background:
    variables.$color-surface;
}

.vocal-card__classification {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: center;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-xl;

  padding-bottom:
    variables.$spacing-xl;

  border-bottom:
    1px solid
    variables.$color-border-soft;
}

.vocal-card__classification span,
.vocal-card__classification strong {
  display: block;
}

.vocal-card__classification span {
  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.vocal-card__classification strong {
  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-2xl;

  font-weight:
    variables.$font-weight-semibold;
}

.vocal-card__metrics {
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

.vocal-card__metrics article {
  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-background;
}

.vocal-card__metrics span,
.vocal-card__metrics strong {
  display: block;
}

.vocal-card__metrics span {
  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.vocal-card__metrics strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;
}

.vocal-card__observations {
  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-background;
}

.vocal-card__observations > span {
  display: block;

  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.05em;

  text-transform:
    uppercase;
}

.vocal-card__observations p {
  margin: 0;

  color:
    variables.$color-text-secondary;

  line-height: 1.7;
}

.vocal-card__updated {
  display: block;

  margin-top:
    variables.$spacing-md;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

/* =========================================================
   BUTTONS
========================================================= */

.button-primary,
.button-secondary {
  min-height:
    variables.$control-height-md;

  padding:
    0
    variables.$spacing-lg;

  border-radius:
    variables.$radius-md;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  cursor: pointer;
}

.button-primary {
  border:
    1px solid
    variables.$color-primary;

  color:
    variables.$color-black;

  background:
    variables.$color-primary;
}

.button-secondary {
  border:
    1px solid
    variables.$color-border;

  color:
    variables.$color-text-primary;

  background:
    transparent;
}

.button-secondary:hover {
  border-color:
    variables.$color-primary;
}

.button-primary:disabled,
.button-secondary:disabled {
  cursor: wait;

  opacity: 0.5;
}

/* =========================================================
   VOCAL FORM
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
  justify-content: space-between;

  padding-bottom:
    variables.$spacing-lg;

  border-bottom:
    1px solid
    variables.$color-border-soft;
}

.vocal-form__header span {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  text-transform:
    uppercase;
}

.vocal-form__header h3 {
  margin: 0;

  font-family:
    variables.$font-family-primary;
}

.vocal-form__header > strong {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
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
  min-width: 0;

  margin: 0;

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

.vocal-form__range-block legend {
  padding:
    0
    variables.$spacing-sm;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.vocal-form__range {
  display: grid;

  gap:
    variables.$spacing-sm;

  align-items: end;

  grid-template-columns:
    1fr
    auto
    1fr;
}

.vocal-form__range-separator {
  padding-bottom:
    0.85rem;

  color:
    variables.$color-text-muted;
}

.vocal-form__field {
  display: grid;

  gap:
    variables.$spacing-sm;
}

.vocal-form__field > span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.vocal-form__field input,
.vocal-form__field select,
.vocal-form__field textarea {
  width: 100%;
  min-height:
    variables.$control-height-md;

  padding:
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  outline: 0;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-background;

  font: inherit;

  transition:
    border-color
      variables.$transition-fast,
    box-shadow
      variables.$transition-fast;
}

.vocal-form__field textarea {
  min-height: 130px;

  resize: vertical;
}

.vocal-form__field input:focus-visible,
.vocal-form__field select:focus-visible,
.vocal-form__field textarea:focus-visible {
  border-color:
    variables.$color-primary;

  box-shadow:
    0 0 0 3px
    rgba(
      variables.$color-primary,
      0.08
    );
}

.vocal-form__actions {
  display: flex;

  gap:
    variables.$spacing-md;

  justify-content: flex-end;
}

.form-message {
  padding:
    variables.$spacing-md;

  border-radius:
    variables.$radius-md;
}

.form-message--error {
  border:
    1px solid
    rgba(
      variables.$color-danger,
      0.25
    );

  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
}

/* =========================================================
   ATTENDANCE
========================================================= */

.attendance-profile__overview {
  display: grid;

  gap:
    variables.$spacing-xl;

  align-items: center;

  grid-template-columns:
    auto
    minmax(0, 1fr);

  margin-bottom:
    variables.$spacing-xl;
}

.attendance-profile__percentage {
  display: grid;

  width: 138px;
  height: 138px;

  place-items: center;
  align-content: center;

  border:
    1px solid
    variables.$color-border;

  border-radius: 50%;

  background:
    variables.$color-background;
}

.attendance-profile__percentage strong {
  font-size:
    2.2rem;

  font-weight:
    variables.$font-weight-semibold;

  line-height: 1;

  font-variant-numeric:
    tabular-nums;
}

.attendance-profile__percentage span {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.attendance-health--good {
  color:
    variables.$color-success;
}

.attendance-health--warning {
  color:
    variables.$color-warning;
}

.attendance-health--low {
  color:
    variables.$color-danger;
}

.attendance-profile__percentage.attendance-health--good {
  border-color:
    rgba(
      variables.$color-success,
      0.25
    );
}

.attendance-profile__percentage.attendance-health--warning {
  border-color:
    rgba(
      variables.$color-warning,
      0.25
    );
}

.attendance-profile__percentage.attendance-health--low {
  border-color:
    rgba(
      variables.$color-danger,
      0.25
    );
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
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.attendance-profile__progress-info strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;
}

.attendance-profile__bar {
  overflow: hidden;

  height: 6px;

  border-radius:
    variables.$radius-pill;

  background:
    variables.$color-border;
}

.attendance-profile__fill {
  height: 100%;

  border-radius: inherit;

  background:
    currentColor;

  transition:
    width
      variables.$transition-normal;
}

.attendance-profile__progress > p {
  margin:
    variables.$spacing-sm
    0
    0;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
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
    variables.$color-border-soft;

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

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.attendance-profile__stats strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-xl;

  font-weight:
    variables.$font-weight-semibold;
}

.attendance-stat--present strong {
  color:
    variables.$color-success;
}

.attendance-stat--absent strong {
  color:
    variables.$color-danger;
}

.attendance-stat--justified strong {
  color:
    variables.$color-warning;
}

/* =========================================================
   ATTENDANCE HISTORY
========================================================= */

.attendance-history {
  padding-top:
    variables.$spacing-xl;

  border-top:
    1px solid
    variables.$color-border-soft;
}

.attendance-history__header {
  display: flex;

  align-items: center;
  justify-content: space-between;

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
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.07em;

  text-transform:
    uppercase;
}

.attendance-history__header h3 {
  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-md;
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
    variables.$spacing-md
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-md;

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

  font-weight:
    variables.$font-weight-semibold;

  text-transform:
    uppercase;
}

.attendance-history__lesson strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;
}

.attendance-history__lesson small {
  margin-top: 4px;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.attendance-history__status {
  display: inline-flex;

  min-height: 32px;

  align-items: center;

  padding:
    0
    0.75rem;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-pill;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;

  white-space: nowrap;
}

.attendance-history__status--present {
  border-color:
    rgba(
      variables.$color-success,
      0.25
    );

  color:
    variables.$color-success;

  background:
    variables.$color-success-soft;
}

.attendance-history__status--absent {
  border-color:
    rgba(
      variables.$color-danger,
      0.25
    );

  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
}

.attendance-history__status--justified {
  border-color:
    rgba(
      variables.$color-warning,
      0.25
    );

  color:
    variables.$color-warning;

  background:
    variables.$color-warning-soft;
}

.attendance-history__status--pending {
  color:
    variables.$color-text-muted;

  background:
    variables.$color-surface;
}

.attendance-history__note {
  grid-column:
    1 / -1;

  margin: 0;

  padding-top:
    variables.$spacing-sm;

  border-top:
    1px solid
    variables.$color-border-soft;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   RUBRIC
========================================================= */

.rubric-overview {
  display: grid;

  gap:
    variables.$spacing-sm;
}

.rubric-overview__item {
  display: grid;

  gap:
    variables.$spacing-sm;

  padding:
    variables.$spacing-md
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-md;

  background:
    variables.$color-background;
}

.rubric-overview__top {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;
  justify-content: space-between;
}

.rubric-overview__top > span {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;
}

.rubric-overview__top strong {
  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;
}

.rubric-overview__top small {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-regular;
}

.rubric-overview__bar {
  overflow: hidden;

  height: 5px;

  border-radius:
    variables.$radius-pill;

  background:
    variables.$color-border;
}

.rubric-overview__fill {
  height: 100%;

  border-radius: inherit;

  background:
    variables.$color-primary;

  transition:
    width
      variables.$transition-normal;
}

/* =========================================================
   HISTORY
========================================================= */

.history {
  display: grid;

  gap:
    variables.$spacing-md;
}

.history-card {
  display: grid;

  gap:
    variables.$spacing-xl;

  align-items: center;

  grid-template-columns:
    minmax(0, 1fr)
    auto;

  padding:
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.history-card__meta {
  display: flex;

  gap:
    variables.$spacing-sm;

  flex-wrap: wrap;

  align-items: center;

  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.submission-status {
  display: inline-flex;

  min-height: 28px;

  align-items: center;

  padding:
    0
    0.65rem;

  border-radius:
    variables.$radius-pill;

  font-size:
    0.7rem;

  font-weight:
    variables.$font-weight-semibold;

  text-transform:
    uppercase;
}

.submission-status--delivered {
  color:
    variables.$color-info;

  background:
    variables.$color-info-soft;
}

.submission-status--reviewed {
  color:
    variables.$color-success;

  background:
    variables.$color-success-soft;
}

.submission-status--returned {
  color:
    variables.$color-warning;

  background:
    variables.$color-warning-soft;
}

.history-card__main h3 {
  margin:
    0
    0
    variables.$spacing-xs;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;
}

.history-card__main > p {
  margin:
    0
    0
    variables.$spacing-xs;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;
}

.history-card__main > small {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.history-card__feedback {
  margin-top:
    variables.$spacing-lg;

  padding:
    variables.$spacing-md;

  border-left:
    2px solid
    variables.$color-primary;

  border-radius:
    0
    variables.$radius-md
    variables.$radius-md
    0;

  background:
    rgba(
      variables.$color-primary,
      0.035
    );
}

.history-card__feedback strong {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  text-transform:
    uppercase;
}

.history-card__feedback p {
  margin: 0;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  line-height: 1.6;
}

.history-card__actions {
  display: grid;

  min-width: 110px;

  gap:
    variables.$spacing-sm;
}

.history-card__grade {
  display: grid;

  place-items: center;

  padding:
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius:
    variables.$radius-md;

  background:
    rgba(
      variables.$color-primary,
      0.05
    );
}

.history-card__grade span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.history-card__grade strong {
  margin-top: 2px;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xl;

  font-weight:
    variables.$font-weight-semibold;
}

.history-card__review {
  display: inline-flex;

  min-height: 40px;

  align-items: center;
  justify-content: center;

  padding:
    0
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;
}

.history-card__review:hover {
  border-color:
    variables.$color-primary;

  color:
    variables.$color-primary;
}

/* =========================================================
   STATES
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
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.empty-state > span,
.state-card > span {
  display: grid;

  width: 46px;
  height: 46px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.08
    );
}

.empty-state h3,
.state-card h3 {
  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;
}

.empty-state p,
.state-card p {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.empty-state__link {
  display: inline-block;

  margin-top:
    variables.$spacing-md;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.empty-state--small {
  margin-top:
    variables.$spacing-md;
}

.state-card {
  min-height: 220px;

  justify-content: center;
}

.state-card--error > span {
  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
}

.state-card button {
  min-height:
    variables.$control-height-md;

  margin-top:
    variables.$spacing-md;

  padding:
    0
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    transparent;

  cursor: pointer;
}

.loading-spinner {
  width: 44px;
  height: 44px;

  flex: 0 0 auto;

  border:
    3px solid
    variables.$color-border;

  border-top-color:
    variables.$color-primary;

  border-radius: 50%;

  animation:
    profile-spin
    0.8s
    linear
    infinite;
}

@keyframes profile-spin {
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

  display: flex;

  gap:
    variables.$spacing-sm;

  align-items: center;

  padding:
    variables.$spacing-md
    variables.$spacing-lg;

  border:
    1px solid
    rgba(
      variables.$color-success,
      0.3
    );

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-surface-elevated;

  box-shadow:
    variables.$shadow-lg;

  font-size:
    variables.$font-size-sm;
}

.profile-toast > span {
  color:
    variables.$color-success;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform:
    translateY(8px);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .student-profile__summary,
  .attendance-profile__stats {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .vocal-card__metrics {
    grid-template-columns:
      1fr;
  }

  .vocal-form__grid,
  .vocal-form__ranges {
    grid-template-columns:
      1fr;
  }

  .vocal-form__range {
    grid-template-columns:
      1fr;
  }

  .vocal-form__range-separator {
    display: none;
  }
}

@media (max-width: 700px) {
  .student-profile {
    padding-bottom:
      variables.$spacing-3xl;
  }

  .student-profile__hero,
  .student-profile__identity,
  .student-profile__section-header,
  .vocal-card__classification,
  .vocal-form__header {
    align-items:
      flex-start;

    flex-direction:
      column;
  }

  .student-profile__hero-actions,
  .student-profile__edit-profile {
    width: 100%;
  }

  .student-profile__identity-copy h1 {
    font-size:
      clamp(
        2.5rem,
        12vw,
        3.8rem
      );
  }

  .student-profile__section-header > p {
    max-width: none;

    text-align: left;
  }

  .profile-nav {
    top: 78px;

    margin-inline:
      -0.25rem;
  }

  .attendance-profile__overview {
    grid-template-columns:
      1fr;
  }

  .attendance-profile__percentage {
    justify-self: center;
  }

  .attendance-history__item,
  .history-card {
    grid-template-columns:
      1fr;
  }

  .attendance-history__status {
    width: fit-content;
  }

  .history-card__actions {
    width: 100%;

    grid-template-columns:
      1fr 1fr;
  }

  .vocal-form__actions {
    flex-direction:
      column-reverse;
  }

  .vocal-form__actions button {
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

@media (max-width: 480px) {
  .student-profile__hero,
  .vocal-card,
  .attendance-profile,
  .rubric-overview {
    padding:
      variables.$spacing-lg;
  }

  .student-profile__avatar {
    width: 70px;
    height: 70px;
  }

  .student-profile__summary,
  .attendance-profile__stats {
    gap:
      variables.$spacing-sm;
  }

  .student-profile__summary article,
  .attendance-profile__stats article {
    padding:
      variables.$spacing-md;
  }

  .history-card__actions {
    grid-template-columns:
      1fr;
  }
}

@media (
  prefers-reduced-motion:
  reduce
) {
  .student-profile *,
  .student-profile *::before,
  .student-profile *::after {
    scroll-behavior: auto !important;

    animation-duration:
      0.01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      0.01ms !important;
  }
}


/* =========================================================
   V6.3 · STUDENT PROFILE · LIGHT LMS
   Rediseño visual completo de la ficha del estudiante.
   No modifica servicios, Supabase, datos ni eventos.
========================================================= */

.student-profile {
  --ink: #152033;
  --ink-soft: #344359;
  --muted: #6f7c8f;
  --muted-2: #8b98aa;
  --line: #dbe3ec;
  --line-strong: #cbd6e2;
  --surface: #ffffff;
  --surface-soft: #f7f9fc;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-dark: #9d7300;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #edf8f3;
  --red: #c94a57;
  --red-soft: #fff2f4;
  --blue: #3f6fa8;
  --blue-soft: #eef5fc;

  color: var(--ink);
}

/* VOLVER */
.student-profile__back {
  color: var(--wine);
  font-weight: 800;
  text-decoration: none;
}

.student-profile__back:hover {
  color: var(--wine-dark);
}

/* =========================================================
   HERO
========================================================= */

.student-profile__hero {
  position: relative;
  overflow: hidden;
  padding: 30px 32px;
  border: 1px solid var(--line);
  border-radius: 22px;
  color: var(--ink);
  background:
    radial-gradient(circle at 90% 5%, rgba(217,169,29,.13), transparent 31%),
    linear-gradient(135deg, #ffffff 0%, #fbfcfe 62%, #fffaf0 100%);
  box-shadow: 0 14px 36px rgba(31,48,73,.06);
}

.student-profile__hero::before {
  position: absolute;
  inset: 0 auto auto 0;
  width: 120px;
  height: 3px;
  content: "";
  background: linear-gradient(90deg, var(--wine), var(--gold));
}

.student-profile__identity {
  gap: 22px;
}

.student-profile__avatar {
  width: 82px;
  height: 82px;
  border: 1px solid #e3c65f;
  color: var(--gold-dark);
  background:
    linear-gradient(135deg, #fffaf0, #fff4cf);
  box-shadow: 0 10px 26px rgba(217,169,29,.10);
  font-size: 1.2rem;
  font-weight: 900;
}

.student-profile__eyebrow {
  color: var(--gold-dark);
  font-size: .66rem;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.student-profile__identity-copy h1 {
  max-width: 850px;
  margin: 6px 0 14px;
  color: var(--ink);
  font-size: clamp(2.1rem, 4vw, 3.6rem);
  line-height: 1;
  letter-spacing: -.045em;
}

.student-profile__badges {
  gap: 8px;
}

.voice-badge {
  border: 1px solid #e5ca72;
  color: #846100;
  background: var(--gold-soft);
}

.status-badge {
  border: 1px solid #c6dfd2;
  color: var(--green);
  background: var(--green-soft);
}

.status-badge i {
  background: var(--green);
}

.status-badge--inactive {
  border-color: #e0e5eb;
  color: #7d8998;
  background: #f4f6f8;
}

.status-badge--inactive i {
  background: #98a3af;
}

.student-profile__edit-profile {
  min-height: 44px;
  padding: 0 17px;
  border: 1px solid var(--wine);
  border-radius: 11px;
  color: #fff;
  background: var(--wine);
  font-weight: 800;
  box-shadow: 0 7px 18px rgba(159,25,69,.16);
}

.student-profile__edit-profile:hover {
  background: var(--wine-dark);
  transform: translateY(-1px);
}

/* =========================================================
   SUMMARY
========================================================= */

.student-profile__summary {
  gap: 14px;
  margin-top: 18px;
}

.student-profile__summary article {
  min-height: 128px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(31,48,73,.035);
}

.student-profile__summary article:nth-child(1) {
  border-color: #e6d39a;
  background:
    radial-gradient(circle at 90% 8%, rgba(217,169,29,.11), transparent 42%),
    #fffdf7;
}

.student-profile__summary article:nth-child(2) {
  border-color: #cbe1d5;
  background: linear-gradient(135deg, #fff, #f3fbf7);
}

.student-profile__summary article:nth-child(3) {
  border-color: #d2deeb;
  background: linear-gradient(135deg, #fff, #f5f9fd);
}

.student-profile__summary article:nth-child(4) {
  border-color: #dfd6e8;
  background: linear-gradient(135deg, #fff, #faf7fc);
}

.student-profile__summary span {
  color: var(--muted);
  font-size: .72rem;
}

.student-profile__summary strong {
  margin: 10px 0 5px;
  color: var(--ink);
  font-size: 1.85rem;
  line-height: 1;
}

.student-profile__summary article:nth-child(2) strong {
  color: var(--green);
}

.student-profile__summary small {
  color: var(--muted-2);
  font-size: .66rem;
}

.summary-card--primary strong {
  color: var(--gold-dark);
}

/* =========================================================
   INTERNAL NAV
========================================================= */

.profile-nav {
  position: sticky;
  top: 70px;
  z-index: 8;
  display: flex;
  gap: 4px;
  margin: 18px 0 34px;
  padding: 7px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255,255,255,.95);
  box-shadow: 0 8px 22px rgba(31,48,73,.05);
  backdrop-filter: blur(10px);
}

.profile-nav a {
  padding: 10px 14px;
  border-radius: 9px;
  color: #627186;
  font-size: .72rem;
  font-weight: 800;
  text-decoration: none;
  transition: color .2s ease, background .2s ease;
}

.profile-nav a:hover {
  color: var(--wine);
  background: #fff4f7;
}

/* =========================================================
   SECTION HEADERS
========================================================= */

.student-profile__section {
  scroll-margin-top: 150px;
  margin-bottom: 36px;
}

.student-profile__section-header {
  margin-bottom: 18px;
}

.student-profile__section-title > span {
  border-color: #ead17d;
  color: var(--gold-dark);
  background: var(--gold-soft);
}

.student-profile__section-title p {
  color: var(--gold-dark);
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.student-profile__section-title h2 {
  color: var(--ink);
  font-size: clamp(1.45rem, 2.4vw, 2rem);
  letter-spacing: -.03em;
}

.student-profile__section-header > p {
  max-width: 460px;
  color: var(--muted);
  line-height: 1.55;
}

/* =========================================================
   VOCAL PROFILE
========================================================= */

.vocal-card {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(31,48,73,.045);
}

.vocal-card__classification {
  padding-bottom: 22px;
  border-bottom: 1px solid #e8edf3;
}

.vocal-card__classification span {
  color: var(--muted);
}

.vocal-card__classification strong {
  color: var(--gold-dark);
  font-size: clamp(1.65rem, 3vw, 2.4rem);
}

.vocal-card__metrics {
  gap: 12px;
  margin: 22px 0;
}

.vocal-card__metrics article {
  min-height: 108px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: #f8fafc;
}

.vocal-card__metrics article:nth-child(1) {
  background: linear-gradient(135deg, #fff, #f5f9fd);
}

.vocal-card__metrics article:nth-child(2) {
  background: linear-gradient(135deg, #fff, #f3fbf7);
}

.vocal-card__metrics article:nth-child(3) {
  background: linear-gradient(135deg, #fff, #fffaf0);
}

.vocal-card__metrics span {
  color: var(--muted);
}

.vocal-card__metrics strong {
  color: var(--ink);
}

.vocal-card__observations {
  padding: 18px;
  border: 1px solid #e4eaf1;
  border-radius: 15px;
  background: #fbfcfe;
}

.vocal-card__observations > span {
  color: var(--gold-dark);
}

.vocal-card__observations p {
  color: var(--ink-soft);
}

.vocal-card__updated {
  color: var(--muted);
}

/* BUTTONS + FORM */
.button-secondary {
  border-color: var(--line-strong);
  color: #536276;
  background: #fff;
}

.button-secondary:hover {
  border-color: #b8c5d2;
  color: var(--wine);
  background: #fff7f9;
}

.button-primary {
  border-color: var(--wine);
  color: #fff;
  background: var(--wine);
}

.button-primary:hover:not(:disabled) {
  background: var(--wine-dark);
}

.vocal-form__header {
  border-bottom-color: #e8edf3;
}

.vocal-form__header span {
  color: var(--gold-dark);
}

.vocal-form__header h3 {
  color: var(--ink);
}

.vocal-form__header > strong {
  color: var(--muted);
}

.vocal-form__range-block {
  border-color: var(--line);
  background: #fbfcfe;
}

.vocal-form__range-block legend {
  color: var(--ink);
}

.vocal-form__field > span {
  color: var(--muted);
}

.vocal-form__field input,
.vocal-form__field select,
.vocal-form__field textarea {
  border-color: var(--line-strong);
  color: var(--ink);
  background: #fff;
}

.vocal-form__field input:focus-visible,
.vocal-form__field select:focus-visible,
.vocal-form__field textarea:focus-visible {
  border-color: #aebfd0;
  box-shadow: 0 0 0 4px rgba(63,111,168,.08);
}

/* =========================================================
   ATTENDANCE
========================================================= */

.attendance-profile {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(31,48,73,.045);
}

.attendance-profile__percentage {
  border-color: #c7e0d3;
  color: var(--green);
  background:
    radial-gradient(circle at center, #fff 52%, transparent 53%),
    #edf8f3;
}

.attendance-profile__percentage strong {
  color: var(--green);
}

.attendance-profile__percentage span {
  color: var(--muted);
}

.attendance-profile__progress-info span {
  color: var(--muted);
}

.attendance-profile__progress-info strong {
  color: var(--ink);
}

.attendance-profile__bar {
  background: #e8edf2;
}

.attendance-profile__fill {
  background: var(--green);
}

.attendance-profile__progress > p {
  color: var(--muted);
}

.attendance-profile__stats {
  gap: 12px;
}

.attendance-profile__stats article {
  min-height: 102px;
  padding: 17px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #f8fafc;
}

.attendance-profile__stats span {
  color: var(--muted);
}

.attendance-profile__stats strong {
  color: var(--ink);
}

.attendance-stat--present {
  background: var(--green-soft) !important;
  border-color: #c6dfd2 !important;
}

.attendance-stat--present strong {
  color: var(--green);
}

.attendance-stat--absent {
  background: var(--red-soft) !important;
  border-color: #edc9cf !important;
}

.attendance-stat--absent strong {
  color: var(--red);
}

.attendance-stat--justified {
  background: var(--gold-soft) !important;
  border-color: #e8d492 !important;
}

.attendance-stat--justified strong {
  color: var(--gold-dark);
}

.attendance-history {
  border-top-color: #e8edf3;
}

.attendance-history__header span {
  color: var(--gold-dark);
}

.attendance-history__header h3 {
  color: var(--ink);
}

.attendance-history__item {
  border-color: var(--line);
  background: #fbfcfe;
}

.attendance-history__lesson span {
  color: var(--gold-dark);
}

.attendance-history__lesson strong {
  color: var(--ink);
}

.attendance-history__lesson small {
  color: var(--muted);
}

.attendance-history__status--pending {
  color: #7b8797;
  background: #f3f5f7;
}

.attendance-history__note {
  border-top-color: #e4eaf1;
  color: var(--ink-soft);
}

/* =========================================================
   RUBRIC / PROGRESS
========================================================= */

.rubric-overview__item {
  border-color: var(--line);
  background: #fbfcfe;
}

.rubric-overview__top > span {
  color: var(--ink);
}

.rubric-overview__top strong {
  color: var(--wine);
}

.rubric-overview__top small {
  color: var(--muted);
}

.rubric-overview__bar {
  background: #e8edf2;
}

.rubric-overview__fill {
  background: linear-gradient(90deg, var(--wine), #c64b70);
}

/* =========================================================
   HISTORY / SUBMISSIONS
========================================================= */

.history-card {
  border-color: var(--line);
  background: #fff;
  box-shadow: 0 7px 20px rgba(31,48,73,.035);
}

.history-card__meta {
  color: var(--muted);
}

.history-card__main h3 {
  color: var(--ink);
}

.history-card__main > p {
  color: var(--ink-soft);
}

.history-card__main > small {
  color: var(--muted);
}

.history-card__feedback {
  border-left-color: var(--wine);
  background: #fff7f9;
}

.history-card__feedback strong {
  color: var(--wine);
}

.history-card__feedback p {
  color: var(--ink-soft);
}

.history-card__grade {
  border-color: #e4d29a;
  background: var(--gold-soft);
}

.history-card__grade span {
  color: var(--muted);
}

.history-card__grade strong {
  color: var(--gold-dark);
}

.history-card__review {
  border-color: var(--line-strong);
  color: #536276;
  background: #fff;
}

.history-card__review:hover {
  border-color: #d3a7b5;
  color: var(--wine);
  background: #fff7f9;
}

/* =========================================================
   EMPTY + LOADING STATES
========================================================= */

.empty-state,
.state-card {
  border-color: var(--line);
  background: #fff;
  box-shadow: 0 7px 20px rgba(31,48,73,.03);
}

.empty-state > span,
.state-card > span {
  color: var(--gold-dark);
  background: var(--gold-soft);
}

.empty-state h3,
.state-card h3 {
  color: var(--ink);
}

.empty-state p,
.state-card p {
  color: var(--muted);
}

.empty-state__link {
  color: var(--wine);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .student-profile__hero {
    gap: 22px;
    align-items: flex-start;
    flex-direction: column;
  }

  .student-profile__hero-actions,
  .student-profile__edit-profile {
    width: 100%;
  }

  .student-profile__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .attendance-profile__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .student-profile__hero,
  .vocal-card,
  .attendance-profile {
    padding: 22px;
  }

  .student-profile__identity {
    align-items: flex-start;
  }

  .student-profile__avatar {
    width: 66px;
    height: 66px;
  }

  .student-profile__summary,
  .vocal-card__metrics,
  .attendance-profile__stats {
    grid-template-columns: 1fr;
  }

  .profile-nav {
    overflow-x: auto;
    top: 58px;
  }

  .profile-nav a {
    flex: 0 0 auto;
  }

  .student-profile__section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .attendance-profile__overview {
    grid-template-columns: 1fr;
  }

  .attendance-profile__percentage {
    width: 112px;
    height: 112px;
  }

  .history-card {
    grid-template-columns: 1fr;
  }

  .history-card__actions {
    min-width: 0;
  }

  .vocal-form__grid,
  .vocal-form__ranges {
    grid-template-columns: 1fr;
  }
}

</style>
