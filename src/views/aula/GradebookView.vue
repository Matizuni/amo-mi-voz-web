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

        <p>
          Vista general de evaluaciones, calificaciones
          y progreso académico de los estudiantes.
        </p>
      </div>

      <div class="gradebook__status">
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
    >
      <div class="loading-spinner"></div>

      <div>
        <strong>
          Cargando libro de notas...
        </strong>

        <p>
          Sincronizando alumnos, tareas y evaluaciones
          desde Supabase.
        </p>
      </div>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->

    <section
      v-else-if="loadError"
      class="state-card"
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
           RESUMEN GENERAL
      ====================================================== -->

      <section class="gradebook__summary">

        <article>
          <span>
            Estudiantes
          </span>

          <strong>
            {{ students.length }}
          </strong>

          <small>
            matrícula activa
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
            Evaluaciones
          </span>

          <strong>
            {{ reviewedCount }}
          </strong>

          <small>
            con calificación
          </small>
        </article>

        <article>
          <span>
            Promedio general
          </span>

          <strong>
            {{ globalAverage }}
          </strong>

          <small>
            notas evaluadas
          </small>
        </article>

        <article>
          <span>
            Entregas pendientes
          </span>

          <strong>
            {{ deliveredNotReviewedCount }}
          </strong>

          <small>
            por revisar
          </small>
        </article>

      </section>

      <!-- =====================================================
           01 · TABLA
      ====================================================== -->

      <section class="gradebook__section">

        <div class="gradebook__section-title">

          <span>
            01
          </span>

          <div>
            <p>
              Evaluaciones
            </p>

            <h2>
              Calificaciones por estudiante
            </h2>
          </div>

        </div>

        <!-- HAY ALUMNOS -->

        <template v-if="students.length">

          <!-- HAY TAREAS -->

          <div
            v-if="assignments.length"
            class="gradebook-table-wrapper"
          >
            <table class="gradebook-table">

              <thead>
                <tr>

                  <th class="gradebook-table__student-column">
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
                      Clase {{ task.lessonId }}
                    </span>

                    {{ task.title }}
                  </th>

                  <th>
                    Evaluadas
                  </th>

                  <th>
                    Promedio
                  </th>

                </tr>
              </thead>

              <tbody>

                <tr
                  v-for="row in studentRows"
                  :key="row.student.id"
                >

                  <!-- ALUMNO -->

                  <td class="gradebook-table__student">

                    <RouterLink
                      :to="`/aula/estudiante/${row.student.id}`"
                    >
                      <div class="gradebook-table__avatar">
                        {{
                          getInitials(
                            row.student.name
                          )
                        }}
                      </div>

                      <div>
                        <strong>
                          {{ row.student.name }}
                        </strong>

                        <span>
                          Ver perfil
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
                        hasGrade(
                          taskResult.submission
                        )
                      "
                      :to="reviewLink(taskResult)"
                      class="grade-link"
                      title="Abrir revisión"
                    >
                      {{
                        formatGrade(
                          taskResult.submission.grade
                        )
                      }}
                    </RouterLink>

                    <!-- ENTREGADA SIN NOTA -->

                    <RouterLink
                      v-else-if="taskResult.submission"
                      :to="reviewLink(taskResult)"
                      class="grade-status grade-status--link"
                    >
                      {{
                        getSubmissionStatus(
                          taskResult.submission
                        )
                      }}
                    </RouterLink>

                    <!-- SIN ENTREGA -->

                    <span
                      v-else
                      class="grade-empty"
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

          <!-- SIN TAREAS -->

          <div
            v-else
            class="empty-state"
          >
            <span>
              ♪
            </span>

            <div>
              <h3>
                Todavía no hay evaluaciones
              </h3>

              <p>
                Los estudiantes ya están registrados,
                pero todavía no existen tareas publicadas.
              </p>
            </div>
          </div>

        </template>

        <!-- SIN ESTUDIANTES -->

        <div
          v-else
          class="empty-state"
        >
          <span>
            !
          </span>

          <div>
            <h3>
              No hay estudiantes
            </h3>

            <p>
              Todavía no existen estudiantes activos
              registrados en el aula.
            </p>

            <RouterLink
              to="/aula/alumnos"
              class="empty-state__link"
            >
              Administrar alumnos →
            </RouterLink>
          </div>
        </div>

      </section>

      <!-- =====================================================
           02 · RENDIMIENTO
      ====================================================== -->

      <section
        v-if="students.length"
        class="gradebook__section"
      >

        <div class="gradebook__section-title">

          <span>
            02
          </span>

          <div>
            <p>
              Resumen
            </p>

            <h2>
              Rendimiento individual
            </h2>
          </div>

        </div>

        <div class="student-grade-grid">

          <RouterLink
            v-for="row in studentRows"
            :key="row.student.id"
            :to="`/aula/estudiante/${row.student.id}`"
            class="student-grade-card"
          >

            <div class="student-grade-card__header">

              <div class="student-grade-card__avatar">
                {{
                  getInitials(
                    row.student.name
                  )
                }}
              </div>

              <div>
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
                  Promedio
                </span>

                <strong>
                  {{ row.average }}
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

              <div class="student-grade-card__bar">
                <div
                  class="student-grade-card__fill"
                  :style="{
                    width:
                      `${row.progress}%`
                  }"
                ></div>
              </div>

            </div>

            <div class="student-grade-card__footer">
              Ver ficha completa →
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

/* =========================================================
   DATOS
========================================================= */

const students = ref([])
const assignments = ref([])
const submissions = ref([])

const isLoading = ref(true)
const loadError = ref('')

/* =========================================================
   CARGAR TODO DESDE SUPABASE
========================================================= */

const loadGradebook = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const [
      loadedStudents,
      loadedAssignments,
      loadedSubmissions
    ] = await Promise.all([
      fetchStudents(),
      fetchAssignments(),
      fetchSubmissions()
    ])

    students.value =
      sortStudents(
        loadedStudents || []
      )

    assignments.value =
      (loadedAssignments || [])
        .filter(
          assignment =>
            assignment.status !== 'draft'
        )
        .sort(
          (a, b) =>
            Number(a.id) -
            Number(b.id)
        )

    submissions.value =
      loadedSubmissions || []

  } catch (error) {
    console.error(
      'Error cargando libro de notas:',
      error
    )

    students.value = []
    assignments.value = []
    submissions.value = []

    loadError.value =
      error?.message ||
      'No se pudo cargar el libro de notas desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   ORDEN DE ESTUDIANTES
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
    Number(submission.grade)

  return Number.isFinite(grade)
}

const formatGrade = value => {
  const grade =
    Number(value)

  if (
    !Number.isFinite(grade)
  ) {
    return '—'
  }

  return grade.toFixed(1)
}

/* =========================================================
   ENCONTRAR ENTREGA
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

const studentRows = computed(() =>
  students.value.map(student => {

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
            hasGrade(submission)
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
              (sum, grade) =>
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
  })
)

/* =========================================================
   RESUMEN GENERAL
========================================================= */

const reviewedCount = computed(() =>
  submissions.value.filter(
    submission =>
      hasGrade(submission)
  ).length
)

const deliveredNotReviewedCount =
  computed(() =>
    submissions.value.filter(
      submission =>
        !hasGrade(submission) &&
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

const globalAverage = computed(() => {
  const grades =
    submissions.value
      .filter(
        submission =>
          hasGrade(submission)
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
      (sum, grade) =>
        sum + grade,
      0
    ) /
    grades.length
  ).toFixed(1)
})

/* =========================================================
   RUTAS
========================================================= */

const reviewLink = taskResult => {
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

const getSubmissionStatus = submission => {
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

  return name
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
}

/* =========================================================
   HEADER
========================================================= */

.gradebook__header {
  display: flex;
  gap:
    variables.$spacing-xl;
  align-items: flex-end;
  justify-content:
    space-between;
  margin-bottom:
    variables.$spacing-2xl;
}

.gradebook__eyebrow {
  margin-bottom:
    variables.$spacing-sm;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.gradebook__header h1 {
  margin-bottom:
    variables.$spacing-md;
  font-size:
    clamp(
      3rem,
      7vw,
      5rem
    );
}

.gradebook__header > div:first-child > p:last-child {
  max-width: 700px;
  opacity: 0.7;
}

.gradebook__status {
  min-width: 190px;
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.gradebook__status span,
.gradebook__status strong,
.gradebook__status small {
  display: block;
}

.gradebook__status span {
  margin-bottom:
    variables.$spacing-xs;
  opacity: 0.5;
}

.gradebook__status strong {
  color:
    variables.$color-primary;
  font-size: 2rem;
}

.gradebook__status small {
  margin-top: 3px;
  opacity: 0.4;
}

/* =========================================================
   RESUMEN
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
    variables.$spacing-3xl;
}

.gradebook__summary article {
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

.gradebook__summary span,
.gradebook__summary strong,
.gradebook__summary small {
  display: block;
}

.gradebook__summary span {
  margin-bottom:
    variables.$spacing-sm;
  opacity: 0.55;
}

.gradebook__summary strong {
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size: 2rem;
}

.gradebook__summary small {
  opacity: 0.35;
}

/* =========================================================
   SECCIONES
========================================================= */

.gradebook__section {
  margin-bottom:
    variables.$spacing-3xl;
}

.gradebook__section-title {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  margin-bottom:
    variables.$spacing-xl;
}

.gradebook__section-title > span {
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

.gradebook__section-title p {
  margin:
    0 0
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  text-transform: uppercase;
}

.gradebook__section-title h2 {
  margin: 0;
}

/* =========================================================
   TABLA
========================================================= */

.gradebook-table-wrapper {
  overflow-x: auto;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.gradebook-table {
  width: 100%;
  min-width: 900px;
  border-collapse: collapse;
}

.gradebook-table th {
  position: sticky;
  top: 0;
  z-index: 2;
  padding:
    variables.$spacing-md;
  border-bottom:
    1px solid
    variables.$color-border;
  background:
    variables.$color-background;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  text-align: left;
  vertical-align: bottom;
}

.gradebook-table th span {
  display: block;
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-white;
  font-size:
    variables.$font-size-xs;
  font-weight: 400;
  opacity: 0.4;
}

.gradebook-table td {
  padding:
    variables.$spacing-md;
  border-bottom:
    1px solid
    variables.$color-border;
}

.gradebook-table tbody tr:last-child td {
  border-bottom: none;
}

.gradebook-table tbody tr {
  transition:
    background 0.2s ease;
}

.gradebook-table tbody tr:hover {
  background:
    rgba(
      255,
      255,
      255,
      0.02
    );
}

.gradebook-table__student-column {
  min-width: 220px;
}

.gradebook-table__task {
  min-width: 150px;
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
    variables.$color-white;
  text-decoration: none;
}

.gradebook-table__student strong,
.gradebook-table__student span {
  display: block;
}

.gradebook-table__student span {
  margin-top: 3px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

.gradebook-table__avatar,
.student-grade-card__avatar {
  display: grid;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
  font-weight:
    variables.$font-weight-bold;
}

.voice-badge {
  display: inline-block;
  padding:
    0.35rem
    0.65rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  font-size:
    variables.$font-size-xs;
  opacity: 0.7;
}

/* =========================================================
   NOTAS
========================================================= */

.gradebook-table__grade-cell,
.gradebook-table__center,
.gradebook-table__average {
  text-align: center;
}

.grade-link {
  display: inline-grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-bold;
  text-decoration: none;
  transition:
    background 0.2s ease,
    color 0.2s ease,
    transform 0.2s ease;
}

.grade-link:hover {
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
  transform:
    translateY(-2px);
}

.grade-status {
  font-size:
    variables.$font-size-xs;
  opacity: 0.55;
}

.grade-status--link {
  color:
    variables.$color-primary;
  text-decoration: none;
}

.grade-status--link:hover {
  opacity: 1;
}

.grade-empty {
  opacity: 0.25;
}

.gradebook-table__center span {
  opacity: 0.4;
}

.gradebook-table__average strong {
  color:
    variables.$color-primary;
  font-size: 1.35rem;
}

/* =========================================================
   TARJETAS
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
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
  color:
    variables.$color-white;
  text-decoration: none;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.student-grade-card:hover {
  border-color:
    variables.$color-primary;
  transform:
    translateY(-2px);
}

.student-grade-card__header {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  margin-bottom:
    variables.$spacing-xl;
}

.student-grade-card__header span {
  display: block;
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  text-transform: uppercase;
}

.student-grade-card__header h3 {
  margin: 0;
}

.student-grade-card__stats {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    repeat(
      2,
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
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
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
  font-size:
    variables.$font-size-xs;
  opacity: 0.5;
}

.student-grade-card__stats strong {
  color:
    variables.$color-primary;
  font-size: 1.4rem;
}

/* =========================================================
   PROGRESO
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
  opacity: 0.45;
}

.student-grade-card__progress-info strong {
  color:
    variables.$color-primary;
}

.student-grade-card__bar {
  overflow: hidden;
  height: 7px;
  border-radius: 999px;
  background:
    variables.$color-border;
}

.student-grade-card__fill {
  height: 100%;
  border-radius: inherit;
  background:
    variables.$color-primary;
  transition:
    width 0.3s ease;
}

.student-grade-card__footer {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
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
}

@media (max-width: 1000px) {

  .student-grade-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .gradebook__header {
    align-items:
      flex-start;
    flex-direction:
      column;
  }
}

@media (max-width: 700px) {

  .gradebook__summary,
  .student-grade-grid {
    grid-template-columns: 1fr;
  }

  .gradebook__status {
    width: 100%;
  }
}
</style>
