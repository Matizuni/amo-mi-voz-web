<template>
  <section class="gradebook">
    <!-- =====================================================
         HEADER
    ====================================================== -->
    <header class="gradebook__header">
      <div>
        <p class="gradebook__eyebrow">
          Profesor · Aula Virtual
        </p>

        <h1>
          Libro de notas
        </h1>

        <p class="gradebook__description">
          Revisa calificaciones, entregas
          y avance académico en un solo lugar.
        </p>
      </div>

      <div
        v-if="!isLoading"
        class="gradebook__enrollment"
      >
        <span>
          Matrícula activa
        </span>

        <strong>
          {{ students.length }}
        </strong>

        <small>
          estudiantes
        </small>
      </div>
    </header>

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
          Preparando el libro de notas
        </strong>

        <p>
          Estamos cargando estudiantes,
          clases, tareas y entregas.
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
      <span>
        !
      </span>

      <div>
        <h3>
          No pudimos cargar las calificaciones
        </h3>

        <p>
          {{ loadError }}
        </p>

        <button
          type="button"
          @click="loadGradebook"
        >
          Reintentar
        </button>
      </div>
    </section>

    <template v-else>
      <!-- =====================================================
           RESUMEN
      ====================================================== -->
      <section
        class="gradebook__summary"
        aria-label="Resumen general"
      >
        <article class="summary-card summary-card--primary">
          <span>
            Promedio general
          </span>

          <strong>
            {{ globalAverage }}
          </strong>

          <small>
            notas registradas
          </small>
        </article>

        <article>
          <span>
            Estudiantes
          </span>

          <strong>
            {{ students.length }}
          </strong>

          <small>
            activos
          </small>
        </article>

        <article>
          <span>
            Tareas
          </span>

          <strong>
            {{ assignments.length }}
          </strong>

          <small>
            publicadas
          </small>
        </article>

        <article>
          <span>
            Calificadas
          </span>

          <strong>
            {{ reviewedCount }}
          </strong>

          <small>
            entregas
          </small>
        </article>

        <article
          :class="{
            'summary-card--attention':
              deliveredNotReviewedCount > 0
          }"
        >
          <span>
            Por revisar
          </span>

          <strong>
            {{ deliveredNotReviewedCount }}
          </strong>

          <small>
            entregas
          </small>
        </article>
      </section>

      <!-- =====================================================
           HERRAMIENTAS
      ====================================================== -->
      <section
        v-if="students.length || assignments.length"
        class="gradebook-toolbar"
      >
        <div class="gradebook-toolbar__search">
          <label for="gradebook-search">
            Buscar
          </label>

          <div class="gradebook-search">
            <span aria-hidden="true">
              ⌕
            </span>

            <input
              id="gradebook-search"
              v-model.trim="searchTerm"
              type="search"
              autocomplete="off"
              placeholder="Buscar estudiante..."
            />

            <button
              v-if="searchTerm"
              type="button"
              aria-label="Limpiar búsqueda"
              @click="searchTerm = ''"
            >
              ×
            </button>
          </div>
        </div>

        <div class="gradebook-toolbar__meta">
          <span>
            Mostrando
          </span>

          <strong>
            {{ filteredStudentRows.length }}
            de
            {{ students.length }}
          </strong>
        </div>
      </section>

      <!-- =====================================================
           01 · MATRIZ DE CALIFICACIONES
      ====================================================== -->
      <section class="gradebook__section">
        <div class="gradebook__section-header">
          <div class="gradebook__section-title">
            <span>
              01
            </span>

            <div>
              <p>
                Evaluación
              </p>

              <h2>
                Calificaciones por estudiante
              </h2>
            </div>
          </div>

          <p
            v-if="assignments.length"
            class="gradebook__section-description"
          >
            Selecciona una nota o entrega
            para abrir su revisión.
          </p>
        </div>

        <!-- SIN ESTUDIANTES -->
        <div
          v-if="students.length === 0"
          class="empty-state"
        >
          <span>
            +
          </span>

          <div>
            <h3>
              No hay estudiantes activos
            </h3>

            <p>
              Cuando existan estudiantes matriculados
              aparecerán aquí.
            </p>

            <RouterLink
              to="/aula/alumnos"
              class="empty-state__link"
            >
              Administrar estudiantes
              <span aria-hidden="true">→</span>
            </RouterLink>
          </div>
        </div>

        <!-- SIN TAREAS -->
        <div
          v-else-if="assignments.length === 0"
          class="empty-state"
        >
          <span>
            ♪
          </span>

          <div>
            <h3>
              Todavía no hay tareas evaluables
            </h3>

            <p>
              Las tareas publicadas aparecerán
              automáticamente en este libro.
            </p>
          </div>
        </div>

        <!-- SIN RESULTADOS -->
        <div
          v-else-if="filteredStudentRows.length === 0"
          class="empty-state"
        >
          <span>
            ?
          </span>

          <div>
            <h3>
              No encontramos estudiantes
            </h3>

            <p>
              Prueba con otro nombre.
            </p>

            <button
              type="button"
              class="empty-state__button"
              @click="searchTerm = ''"
            >
              Limpiar búsqueda
            </button>
          </div>
        </div>

        <!-- TABLA -->
        <div
          v-else
          class="gradebook-table-wrapper"
        >
          <table class="gradebook-table">
            <thead>
              <tr>
                <th
                  class="
                    gradebook-table__student-column
                    gradebook-table__sticky
                  "
                >
                  Estudiante
                </th>

                <th>
                  Voz
                </th>

                <th
                  v-for="task in assignments"
                  :key="task.id"
                  class="gradebook-table__task"
                >
                  <span>
                    Clase
                    {{ getAcademicLessonNumberById(task.lessonId) }}
                  </span>

                  <strong>
                    {{ task.title }}
                  </strong>
                </th>

                <th class="gradebook-table__compact">
                  Evaluadas
                </th>

                <th class="gradebook-table__compact">
                  Promedio
                </th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="row in filteredStudentRows"
                :key="row.student.id"
              >
                <!-- ESTUDIANTE -->
                <td
                  class="
                    gradebook-table__student
                    gradebook-table__sticky
                  "
                >
                  <RouterLink
                    :to="`/aula/estudiante/${row.student.id}`"
                  >
                    <div class="gradebook-table__avatar">
                      {{ getInitials(row.student.name) }}
                    </div>

                    <div>
                      <strong>
                        {{ row.student.name }}
                      </strong>

                      <span>
                        Ver ficha
                      </span>
                    </div>
                  </RouterLink>
                </td>

                <!-- VOZ -->
                <td>
                  <span class="voice-badge">
                    {{
                      row.student.voice ||
                      'Sin clasificación'
                    }}
                  </span>
                </td>

                <!-- TAREAS -->
                <td
                  v-for="taskResult in row.tasks"
                  :key="taskResult.task.id"
                  class="gradebook-table__grade-cell"
                >
                  <!-- CON NOTA -->
                  <RouterLink
                    v-if="
                      taskResult.submission &&
                      hasGrade(taskResult.submission)
                    "
                    :to="reviewLink(taskResult)"
                    class="grade-pill grade-pill--graded"
                    :title="
                      `Abrir revisión de ${taskResult.task.title}`
                    "
                  >
                    {{
                      formatGrade(
                        taskResult.submission.grade
                      )
                    }}
                  </RouterLink>

                  <!-- ENTREGADA -->
                  <RouterLink
                    v-else-if="taskResult.submission"
                    :to="reviewLink(taskResult)"
                    class="grade-status grade-status--submitted"
                  >
                    <span>
                      {{ getSubmissionStatus(taskResult.submission) }}
                    </span>
                  </RouterLink>

                  <!-- SIN ENTREGA -->
                  <span
                    v-else
                    class="grade-status grade-status--empty"
                    title="Sin entrega"
                  >
                    —
                  </span>
                </td>

                <!-- EVALUADAS -->
                <td class="gradebook-table__center">
                  <strong>
                    {{ row.reviewed }}
                  </strong>

                  <span>
                    / {{ assignments.length }}
                  </span>
                </td>

                <!-- PROMEDIO -->
                <td class="gradebook-table__average">
                  <strong>
                    {{ row.average }}
                  </strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- =====================================================
           02 · RENDIMIENTO INDIVIDUAL
      ====================================================== -->
      <section
        v-if="
          students.length &&
          filteredStudentRows.length
        "
        class="gradebook__section"
      >
        <div class="gradebook__section-header">
          <div class="gradebook__section-title">
            <span>
              02
            </span>

            <div>
              <p>
                Seguimiento
              </p>

              <h2>
                Rendimiento individual
              </h2>
            </div>
          </div>

          <p class="gradebook__section-description">
            Una vista rápida antes de entrar
            a la ficha completa del estudiante.
          </p>
        </div>

        <div class="student-grade-grid">
          <RouterLink
            v-for="row in filteredStudentRows"
            :key="row.student.id"
            :to="`/aula/estudiante/${row.student.id}`"
            class="student-grade-card"
          >
            <div class="student-grade-card__header">
              <div class="student-grade-card__avatar">
                {{ getInitials(row.student.name) }}
              </div>

              <div class="student-grade-card__identity">
                <span>
                  {{
                    row.student.voice ||
                    'Sin clasificación'
                  }}
                </span>

                <h3>
                  {{ row.student.name }}
                </h3>
              </div>

              <span
                class="student-grade-card__arrow"
                aria-hidden="true"
              >
                →
              </span>
            </div>

            <div class="student-grade-card__primary">
              <span>
                Promedio
              </span>

              <strong>
                {{ row.average }}
              </strong>
            </div>

            <div class="student-grade-card__stats">
              <div>
                <span>
                  Entregadas
                </span>

                <strong>
                  {{ row.delivered }}
                </strong>
              </div>

              <div>
                <span>
                  Evaluadas
                </span>

                <strong>
                  {{ row.reviewed }}
                </strong>
              </div>

              <div>
                <span>
                  Pendientes
                </span>

                <strong>
                  {{ row.pending }}
                </strong>
              </div>
            </div>

            <div
              v-if="assignments.length"
              class="student-grade-card__progress"
            >
              <div class="student-grade-card__progress-info">
                <span>
                  Progreso evaluado
                </span>

                <strong>
                  {{ row.progress }}%
                </strong>
              </div>

              <div
                class="student-grade-card__bar"
                :aria-label="
                  `Progreso evaluado ${row.progress}%`
                "
              >
                <div
                  class="student-grade-card__fill"
                  :style="{
                    width: `${row.progress}%`
                  }"
                ></div>
              </div>
            </div>

            <div class="student-grade-card__footer">
              Ver ficha completa
              <span aria-hidden="true">
                →
              </span>
            </div>
          </RouterLink>
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  RouterLink
} from 'vue-router'

import {
  fetchStudents
} from '@/services/studentService'

import {
  fetchAssignments
} from '@/services/assignmentService'

import {
  fetchSubmissions
} from '@/services/submissionService'

import {
  fetchLessons
} from '@/services/lessonService'

/* =========================================================
   ESTADO
========================================================= */

const students = ref([])
const lessons = ref([])
const assignments = ref([])
const submissions = ref([])

const isLoading = ref(true)
const loadError = ref('')
const searchTerm = ref('')

/* =========================================================
   CARGAR DATOS
========================================================= */

const loadGradebook = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const [
      loadedStudents,
      loadedLessons,
      loadedAssignments,
      loadedSubmissions
    ] = await Promise.all([
      fetchStudents(),
      fetchLessons(),
      fetchAssignments(),
      fetchSubmissions()
    ])

    students.value =
      sortStudents(
        loadedStudents || []
      )

    lessons.value =
      loadedLessons || []

    assignments.value =
      (loadedAssignments || [])
        .filter(
          assignment =>
            assignment.status !== 'draft'
        )
        .sort(
          compareAssignments
        )

    submissions.value =
      loadedSubmissions || []
  } catch (error) {
    console.error(
      'Error cargando libro de notas:',
      error
    )

    students.value = []
    lessons.value = []
    assignments.value = []
    submissions.value = []

    loadError.value =
      error?.message ||
      'No se pudo cargar el libro de notas.'
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

/*
 * El ID de Supabase identifica técnicamente la clase,
 * pero no representa su número académico.
 *
 * Ejemplo:
 * id = 5
 * posición dentro de la unidad = Clase 1
 */
const getAcademicLessonNumber = lesson => {
  if (!lesson) {
    return 0
  }

  const unitId =
    getLessonUnitId(lesson)

  const unitLessons =
    lessons.value.filter(item => {
      const itemUnitId =
        getLessonUnitId(item)

      if (unitId === null) {
        return itemUnitId === null
      }

      return (
        String(itemUnitId) ===
        String(unitId)
      )
    })

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

    if (!lesson) {
      return '—'
    }

    return getAcademicLessonNumber(
      lesson
    )
  }

/* =========================================================
   ORDEN DE TAREAS
========================================================= */

const compareAssignments = (
  a,
  b
) => {
  const lessonA =
    lessons.value.find(
      lesson =>
        Number(lesson.id) ===
        Number(a.lessonId)
    )

  const lessonB =
    lessons.value.find(
      lesson =>
        Number(lesson.id) ===
        Number(b.lessonId)
    )

  const academicA =
    getAcademicLessonNumber(
      lessonA
    )

  const academicB =
    getAcademicLessonNumber(
      lessonB
    )

  if (
    academicA !== academicB
  ) {
    return academicA - academicB
  }

  return (
    Number(a.id) -
    Number(b.id)
  )
}

/* =========================================================
   ESTUDIANTES
========================================================= */

const voiceOrder = {
  Soprano: 1,
  Alto: 2,
  Tenor: 3,
  Bajo: 4
}

const sortStudents = list =>
  [...list].sort(
    (a, b) => {
      const voiceA =
        voiceOrder[a.voice] || 99

      const voiceB =
        voiceOrder[b.voice] || 99

      if (voiceA !== voiceB) {
        return voiceA - voiceB
      }

      return (
        a.name || ''
      ).localeCompare(
        b.name || '',
        'es'
      )
    }
  )

/* =========================================================
   NOTAS
========================================================= */

const hasGrade = submission => {
  if (!submission) {
    return false
  }

  if (
    submission.grade === null ||
    submission.grade === undefined ||
    submission.grade === ''
  ) {
    return false
  }

  const grade =
    Number(
      submission.grade
    )

  return Number.isFinite(
    grade
  )
}

const formatGrade = value => {
  const grade =
    Number(value)

  if (
    !Number.isFinite(
      grade
    )
  ) {
    return '—'
  }

  return grade.toFixed(1)
}

/* =========================================================
   ENTREGA
========================================================= */

const findSubmission = (
  studentId,
  assignmentId
) =>
  submissions.value.find(
    item =>
      Number(item.studentId) ===
        Number(studentId) &&
      Number(item.assignmentId) ===
        Number(assignmentId)
  ) || null

/* =========================================================
   FILAS
========================================================= */

const studentRows =
  computed(() =>
    students.value.map(
      student => {
        const tasks =
          assignments.value.map(
            task => ({
              task,

              submission:
                findSubmission(
                  student.id,
                  task.id
                )
            })
          )

        const delivered =
          tasks.filter(
            item =>
              Boolean(
                item.submission
              )
          ).length

        const graded =
          tasks
            .map(
              item =>
                item.submission
            )
            .filter(
              submission =>
                submission &&
                hasGrade(
                  submission
                )
            )

        const grades =
          graded
            .map(
              submission =>
                Number(
                  submission.grade
                )
            )
            .filter(
              Number.isFinite
            )

        const average =
          grades.length
            ? (
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
            : '—'

        const pending =
          Math.max(
            assignments.value.length -
              delivered,
            0
          )

        const progress =
          assignments.value.length
            ? Math.round(
                (
                  graded.length /
                  assignments.value.length
                ) * 100
              )
            : 0

        return {
          student,
          tasks,
          delivered,

          reviewed:
            graded.length,

          pending,
          average,
          progress
        }
      }
    )
  )

/* =========================================================
   BÚSQUEDA
========================================================= */

const normalizedSearch =
  computed(() =>
    searchTerm.value
      .trim()
      .toLocaleLowerCase(
        'es'
      )
  )

const filteredStudentRows =
  computed(() => {
    if (
      !normalizedSearch.value
    ) {
      return studentRows.value
    }

    return studentRows.value.filter(
      row => {
        const searchable =
          [
            row.student.name,
            row.student.voice
          ]
            .filter(Boolean)
            .join(' ')
            .toLocaleLowerCase(
              'es'
            )

        return searchable.includes(
          normalizedSearch.value
        )
      }
    )
  })

/* =========================================================
   RESUMEN
========================================================= */

const reviewedCount =
  computed(() =>
    submissions.value.filter(
      submission =>
        hasGrade(
          submission
        )
    ).length
  )

const deliveredNotReviewedCount =
  computed(() =>
    submissions.value.filter(
      submission =>
        !hasGrade(
          submission
        ) &&
        (
          submission.status ===
            'delivered' ||
          submission.status ===
            'returned' ||
          submission.status ===
            'reviewed'
        )
    ).length
  )

const globalAverage =
  computed(() => {
    const grades =
      submissions.value
        .filter(
          submission =>
            hasGrade(
              submission
            )
        )
        .map(
          submission =>
            Number(
              submission.grade
            )
        )
        .filter(
          Number.isFinite
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
   RUTAS
========================================================= */

const reviewLink =
  taskResult => {
    const task =
      taskResult.task

    const submission =
      taskResult.submission

    if (
      !task ||
      !submission
    ) {
      return '/aula/calificaciones'
    }

    return (
      `/aula/clase/${task.lessonId}` +
      `/tarea/${task.id}` +
      `/entregas/${submission.id}`
    )
  }

/* =========================================================
   ESTADO DE ENTREGA
========================================================= */

const getSubmissionStatus =
  submission => {
    if (!submission) {
      return 'Sin entregar'
    }

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

/* =========================================================
   INICIALES
========================================================= */

const getInitials = name => {
  if (!name) {
    return '?'
  }

  return String(name)
    .split(' ')
    .filter(Boolean)
    .map(
      word =>
        word.charAt(0)
    )
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/* =========================================================
   INICIO
========================================================= */

onMounted(
  loadGradebook
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.gradebook {
  width: 100%;
  max-width: 1400px;

  margin: 0 auto;
  padding-bottom:
    variables.$spacing-4xl;
}

/* =========================================================
   HEADER
========================================================= */

.gradebook__header {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-2xl;
}

.gradebook__eyebrow {
  margin:
    0
    0
    variables.$spacing-sm;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.14em;

  text-transform:
    uppercase;
}

.gradebook__header h1 {
  margin: 0;

  font-size:
    clamp(
      3rem,
      6vw,
      5.2rem
    );

  line-height:
    0.98;
}

.gradebook__description {
  max-width: 650px;

  margin:
    variables.$spacing-lg
    0
    0;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-base;

  line-height:
    1.7;
}

.gradebook__enrollment {
  min-width: 190px;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.gradebook__enrollment span,
.gradebook__enrollment strong,
.gradebook__enrollment small {
  display: block;
}

.gradebook__enrollment span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.gradebook__enrollment strong {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-primary;

  font-size: 2rem;

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

.gradebook__enrollment small {
  margin-top: 2px;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

/* =========================================================
   SUMMARY
========================================================= */

.gradebook__summary {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );

  margin-bottom:
    variables.$spacing-xl;
}

.gradebook__summary article {
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

.gradebook__summary span,
.gradebook__summary strong,
.gradebook__summary small {
  display: block;
}

.gradebook__summary span {
  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.gradebook__summary strong {
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

.gradebook__summary small {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.summary-card--primary {
  border-color:
    variables.$color-border-primary !important;

  background:
    linear-gradient(
      145deg,
      rgba(
        variables.$color-primary,
        0.07
      ),
      variables.$color-surface
    ) !important;
}

.summary-card--primary strong {
  color:
    variables.$color-primary;
}

.summary-card--attention {
  border-color:
    rgba(
      variables.$color-warning,
      0.22
    ) !important;
}

.summary-card--attention strong {
  color:
    variables.$color-warning;
}

/* =========================================================
   TOOLBAR
========================================================= */

.gradebook-toolbar {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-3xl;

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

.gradebook-toolbar__search {
  width: min(
    100%,
    420px
  );
}

.gradebook-toolbar__search label {
  display: block;

  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;
}

.gradebook-search {
  position: relative;

  display: flex;

  align-items: center;
}

.gradebook-search > span {
  position: absolute;

  left:
    variables.$spacing-md;

  color:
    variables.$color-text-muted;

  pointer-events: none;
}

.gradebook-search input {
  width: 100%;
  min-height:
    variables.$control-height-md;

  padding:
    0
    3rem
    0
    2.65rem;

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

  font-size:
    variables.$font-size-sm;

  transition:
    border-color
      variables.$transition-fast,
    box-shadow
      variables.$transition-fast;
}

.gradebook-search input::placeholder {
  color:
    variables.$color-text-disabled;
}

.gradebook-search input:focus-visible {
  border-color:
    variables.$color-primary;

  box-shadow:
    0 0 0 3px
    rgba(
      variables.$color-primary,
      0.08
    );
}

.gradebook-search button {
  position: absolute;

  right:
    variables.$spacing-sm;

  display: grid;

  width: 34px;
  height: 34px;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-text-muted;

  background:
    transparent;

  font-size: 1.25rem;

  cursor: pointer;
}

.gradebook-search button:hover {
  color:
    variables.$color-text-primary;

  background:
    variables.$color-surface-hover;
}

.gradebook-toolbar__meta {
  text-align: right;
}

.gradebook-toolbar__meta span,
.gradebook-toolbar__meta strong {
  display: block;
}

.gradebook-toolbar__meta span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.gradebook-toolbar__meta strong {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   SECCIONES
========================================================= */

.gradebook__section {
  margin-bottom:
    variables.$spacing-4xl;
}

.gradebook__section-header {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-xl;
}

.gradebook__section-title {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;
}

.gradebook__section-title > span {
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

  font-variant-numeric:
    tabular-nums;
}

.gradebook__section-title p {
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

.gradebook__section-title h2 {
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

.gradebook__section-description {
  max-width: 360px;

  margin: 0;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;

  line-height:
    1.6;

  text-align: right;
}

/* =========================================================
   TABLA
========================================================= */

.gradebook-table-wrapper {
  position: relative;

  overflow: auto;

  max-width: 100%;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;

  scrollbar-width: thin;
}

.gradebook-table {
  width: 100%;

  min-width: 1000px;

  border-collapse:
    separate;

  border-spacing: 0;
}

.gradebook-table th {
  position: sticky;

  top: 0;

  z-index: 3;

  padding:
    variables.$spacing-md;

  border-bottom:
    1px solid
    variables.$color-border;

  color:
    variables.$color-text-secondary;

  background:
    variables.$color-surface-elevated;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  line-height: 1.4;

  text-align: left;
  vertical-align: bottom;
}

.gradebook-table th > span {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size: 0.7rem;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.04em;

  text-transform:
    uppercase;
}

.gradebook-table th > strong {
  display: block;

  max-width: 180px;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;
}

.gradebook-table td {
  padding:
    variables.$spacing-md;

  border-bottom:
    1px solid
    variables.$color-border-soft;

  color:
    variables.$color-text-secondary;

  background:
    variables.$color-surface;

  font-size:
    variables.$font-size-sm;

  vertical-align: middle;
}

.gradebook-table tbody tr:last-child td {
  border-bottom: 0;
}

.gradebook-table tbody tr:hover td {
  background:
    variables.$color-surface-elevated;
}

.gradebook-table__student-column {
  min-width: 230px;
}

.gradebook-table__task {
  min-width: 160px;
}

.gradebook-table__compact {
  min-width: 105px;

  text-align: center !important;
}

.gradebook-table__sticky {
  position: sticky;

  left: 0;

  z-index: 4;
}

.gradebook-table th.gradebook-table__sticky {
  z-index: 6;
}

.gradebook-table td.gradebook-table__sticky {
  box-shadow:
    1px 0 0
    variables.$color-border;
}

/* =========================================================
   ESTUDIANTE
========================================================= */

.gradebook-table__student a {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;

  color:
    variables.$color-text-primary;
}

.gradebook-table__student a > div:last-child {
  min-width: 0;
}

.gradebook-table__student strong,
.gradebook-table__student span {
  display: block;
}

.gradebook-table__student strong {
  overflow: hidden;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.gradebook-table__student span {
  margin-top: 3px;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.gradebook-table__avatar,
.student-grade-card__avatar {
  display: grid;

  width: 44px;
  height: 44px;

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

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;
}

.voice-badge {
  display: inline-flex;

  min-height: 30px;

  align-items: center;

  padding:
    0
    0.75rem;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-pill;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-xs;

  white-space: nowrap;
}

/* =========================================================
   CALIFICACIONES
========================================================= */

.gradebook-table__grade-cell,
.gradebook-table__center,
.gradebook-table__average {
  text-align: center;
}

.grade-pill {
  display: inline-grid;

  min-width: 46px;
  height: 40px;

  place-items: center;

  border-radius:
    variables.$radius-md;

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;

  transition:
    transform
      variables.$transition-fast,
    border-color
      variables.$transition-fast,
    background-color
      variables.$transition-fast;
}

.grade-pill--graded {
  border:
    1px solid
    variables.$color-border-primary;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.055
    );
}

.grade-pill--graded:hover {
  border-color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.1
    );

  transform:
    translateY(-1px);
}

.grade-status {
  display: inline-flex;

  min-height: 32px;

  align-items: center;

  padding:
    0
    0.7rem;

  border-radius:
    variables.$radius-pill;

  font-size: 0.72rem;

  font-weight:
    variables.$font-weight-medium;

  white-space: nowrap;
}

.grade-status--submitted {
  border:
    1px solid
    rgba(
      variables.$color-info,
      0.22
    );

  color:
    variables.$color-info;

  background:
    variables.$color-info-soft;
}

.grade-status--submitted:hover {
  border-color:
    rgba(
      variables.$color-info,
      0.45
    );
}

.grade-status--empty {
  justify-content: center;

  color:
    variables.$color-text-disabled;
}

.gradebook-table__center strong {
  color:
    variables.$color-text-primary;

  font-variant-numeric:
    tabular-nums;
}

.gradebook-table__center span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.gradebook-table__average strong {
  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

/* =========================================================
   STUDENT CARDS
========================================================= */

.student-grade-grid {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
}

.student-grade-card {
  display: block;

  padding:
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-surface;

  transition:
    border-color
      variables.$transition-normal,
    transform
      variables.$transition-normal,
    background-color
      variables.$transition-normal;
}

.student-grade-card:hover {
  border-color:
    variables.$color-border-primary;

  background:
    variables.$color-surface-elevated;

  transform:
    translateY(-3px);
}

.student-grade-card__header {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;

  margin-bottom:
    variables.$spacing-xl;
}

.student-grade-card__identity {
  min-width: 0;
  flex: 1;
}

.student-grade-card__identity span {
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
    0.04em;

  text-transform:
    uppercase;
}

.student-grade-card__identity h3 {
  overflow: hidden;

  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-base;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.015em;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-grade-card__arrow {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-lg;

  transition:
    transform
      variables.$transition-fast,
    color
      variables.$transition-fast;
}

.student-grade-card:hover
.student-grade-card__arrow {
  color:
    variables.$color-primary;

  transform:
    translateX(3px);
}

.student-grade-card__primary {
  display: flex;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-md;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius:
    variables.$radius-lg;

  background:
    linear-gradient(
      145deg,
      rgba(
        variables.$color-primary,
        0.07
      ),
      rgba(
        variables.$color-primary,
        0.015
      )
    );
}

.student-grade-card__primary span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.student-grade-card__primary strong {
  color:
    variables.$color-primary;

  font-size:
    2rem;

  font-weight:
    variables.$font-weight-semibold;

  line-height: 1;

  font-variant-numeric:
    tabular-nums;
}

.student-grade-card__stats {
  display: grid;

  gap:
    variables.$spacing-sm;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  margin-bottom:
    variables.$spacing-lg;
}

.student-grade-card__stats div {
  padding:
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-md;

  background:
    variables.$color-background;
}

.student-grade-card__stats span,
.student-grade-card__stats strong {
  display: block;
}

.student-grade-card__stats span {
  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size: 0.72rem;
}

.student-grade-card__stats strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

/* =========================================================
   PROGRESS
========================================================= */

.student-grade-card__progress {
  margin-bottom:
    variables.$spacing-lg;
}

.student-grade-card__progress-info {
  display: flex;

  justify-content:
    space-between;

  margin-bottom:
    variables.$spacing-sm;

  font-size:
    variables.$font-size-xs;
}

.student-grade-card__progress-info span {
  color:
    variables.$color-text-muted;
}

.student-grade-card__progress-info strong {
  color:
    variables.$color-text-secondary;

  font-variant-numeric:
    tabular-nums;
}

.student-grade-card__bar {
  overflow: hidden;

  height: 5px;

  border-radius:
    variables.$radius-pill;

  background:
    variables.$color-border;
}

.student-grade-card__fill {
  height: 100%;

  border-radius: inherit;

  background:
    variables.$color-primary;

  transition:
    width
      variables.$transition-normal;
}

.student-grade-card__footer {
  display: flex;

  align-items: center;
  justify-content: space-between;

  padding-top:
    variables.$spacing-md;

  border-top:
    1px solid
    variables.$color-border-soft;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;
}

.student-grade-card__footer span {
  color:
    variables.$color-primary;
}

/* =========================================================
   EMPTY / LOADING
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

  width: 48px;
  height: 48px;

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

  font-weight:
    variables.$font-weight-semibold;
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

  line-height:
    1.6;
}

.empty-state__link {
  display: inline-flex;

  gap:
    variables.$spacing-sm;

  align-items: center;

  margin-top:
    variables.$spacing-md;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.empty-state__button {
  margin-top:
    variables.$spacing-md;

  padding:
    variables.$spacing-sm
    variables.$spacing-md;

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

  cursor: pointer;
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
    variables.$color-border-strong;

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

.state-card button:hover {
  border-color:
    variables.$color-primary;
}

/* =========================================================
   SPINNER
========================================================= */

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
    gradebook-spin
    0.8s
    linear
    infinite;
}

@keyframes gradebook-spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1150px) {
  .gradebook__summary {
    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }

  .student-grade-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 850px) {
  .gradebook__header,
  .gradebook__section-header,
  .gradebook-toolbar {
    align-items:
      stretch;

    flex-direction:
      column;
  }

  .gradebook__enrollment {
    width: 100%;
  }

  .gradebook__section-description {
    max-width: 100%;

    text-align: left;
  }

  .gradebook-toolbar__search {
    width: 100%;
    max-width: none;
  }

  .gradebook-toolbar__meta {
    text-align: left;
  }
}

@media (max-width: 700px) {
  .gradebook {
    padding-bottom:
      variables.$spacing-3xl;
  }

  .gradebook__header h1 {
    font-size:
      clamp(
        2.9rem,
        15vw,
        4.4rem
      );
  }

  .gradebook__summary {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .gradebook__summary
  .summary-card--primary {
    grid-column:
      1 / -1;
  }

  .student-grade-grid {
    grid-template-columns:
      1fr;
  }

  .student-grade-card {
    padding:
      variables.$spacing-lg;
  }

  .gradebook__section-title > span {
    width: 46px;
    height: 46px;
  }
}

@media (max-width: 480px) {
  .gradebook__summary {
    gap:
      variables.$spacing-sm;
  }

  .gradebook__summary article {
    padding:
      variables.$spacing-md;
  }

  .student-grade-card__stats {
    gap:
      variables.$spacing-xs;
  }

  .student-grade-card__stats div {
    padding:
      variables.$spacing-sm;
  }
}

@media (prefers-reduced-motion: reduce) {
  .student-grade-card,
  .grade-pill,
  .loading-spinner {
    transition: none;
  }

  .loading-spinner {
    animation-duration: 1.5s;
  }
}
</style>
