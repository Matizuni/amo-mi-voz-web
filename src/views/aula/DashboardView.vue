<template>

  <section class="dashboard">

    <!-- =========================================================
         ESTADOS DE CARGA
    ========================================================== -->
    <section
      v-if="isLoading"
      class="dashboard-state"
      role="status"
      aria-live="polite"
    >
      <div class="dashboard-state__spinner" aria-hidden="true"></div>

      <div>
        <strong>Preparando tu aula</strong>
        <p>Cargando clases, estudiantes y seguimiento académico.</p>
      </div>
    </section>

    <section
      v-else-if="loadError"
      class="dashboard-state dashboard-state--error"
      role="alert"
    >
      <span aria-hidden="true">!</span>

      <div>
        <strong>No pudimos cargar el Aula Virtual</strong>
        <p>{{ loadError }}</p>

        <button
          type="button"
          @click="loadDashboard"
        >
          Reintentar
        </button>
      </div>
    </section>

    <!-- =========================================================

         DASHBOARD PROFESOR

    ========================================================== -->

    <template v-else-if="isTeacher">

      <header class="dashboard__header">

        <p class="dashboard__eyebrow">

          Aula Virtual · Profesor

        </p>

        <h1>

          Hola, {{ firstName }}

        </h1>

        <p>

          Aquí tienes una vista general del curso,

          estudiantes, asistencia y evaluaciones.

        </p>

      </header>

      <!-- =====================================================

           RESUMEN PROFESOR

      ====================================================== -->

      <section class="dashboard__summary">

        <article class="summary-card">

          <span>

            Estudiantes

          </span>

          <strong>

            {{ students.length }}

          </strong>

          <RouterLink to="/aula/alumnos">

            Ver alumnos →

          </RouterLink>

        </article>

        <article class="summary-card">

          <span>

            Clases

          </span>

          <strong>

            {{ lessons.length }}

          </strong>

          <RouterLink to="/aula/programa-formativo">

            Ver programa →

          </RouterLink>

        </article>

        <article class="summary-card">

          <span>

            Asistencia general

          </span>

          <strong>

            {{ generalAttendancePercentage }}%

          </strong>

          <RouterLink to="/aula/asistencia">

            Ver asistencia →

          </RouterLink>

        </article>

        <article class="summary-card">

          <span>

            Por revisar

          </span>

          <strong>

            {{ pendingReviewCount }}

          </strong>

          <span class="summary-card__secondary">

            entregas

          </span>

        </article>

      </section>

      <!-- =====================================================

           PRÓXIMA CLASE PROFESOR

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            01

          </span>

          <div>

            <p>

              Programa

            </p>

            <h2>

              Próxima clase

            </h2>

          </div>

        </div>

        <article

          v-if="nextLesson"

          class="next-class"

        >

          <div class="next-class__number">

            {{

              String(nextLesson.id)

                .padStart(2, '0')

            }}

          </div>

          <div class="next-class__content">

            <span>

              {{ formatLessonDate(nextLesson.date) }}

            </span>

            <h3>

              {{ cleanLessonTitle(nextLesson.title) }}

            </h3>

            <p>

              {{ nextLesson.description }}

            </p>

          </div>

          <RouterLink

            :to="`/aula/clase/${nextLesson.id}`"

            class="dashboard-button"

          >

            Ver clase →

          </RouterLink>

        </article>

      </section>

      <!-- =====================================================

           ENTREGAS POR REVISAR

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            02

          </span>

          <div>

            <p>

              Evaluaciones

            </p>

            <h2>

              Entregas por revisar

            </h2>

          </div>

        </div>

        <div

          v-if="pendingReviews.length > 0"

          class="pending-list"

        >

          <article

            v-for="item in pendingReviews"

            :key="item.submission.id"

            class="pending-card"

          >

            <div class="pending-card__avatar">

              {{ getInitials(item.student?.name) }}

            </div>

            <div class="pending-card__content">

              <span>

                {{

                  item.student?.voice ||

                  'Estudiante'

                }}

              </span>

              <h3>

                {{

                  item.student?.name ||

                  'Estudiante'

                }}

              </h3>

              <p>

                {{

                  item.task?.title ||

                  'Tarea'

                }}

              </p>

            </div>

            <RouterLink

              v-if="item.task"

              :to="`/aula/clase/${item.task.lessonId}/tarea/${item.task.id}/entregas`"

              class="pending-card__button"

            >

              Revisar →

            </RouterLink>

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

              Todo al día

            </h3>

            <p>

              No tienes entregas pendientes

              de revisión.

            </p>

          </div>

        </div>

      </section>

      <!-- =====================================================

           ASISTENCIA PROFESOR

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            03

          </span>

          <div>

            <p>

              Seguimiento

            </p>

            <h2>

              Últimos registros de asistencia

            </h2>

          </div>

        </div>

        <div class="attendance-dashboard">

          <article

            v-for="row in lessonAttendanceRows"

            :key="row.lesson.id"

            class="attendance-dashboard__row"

          >

            <div class="attendance-dashboard__lesson">

              <span>

                Clase {{ getAcademicLessonNumber(row.lesson) }}

              </span>

              <strong>

                {{ cleanLessonTitle(row.lesson.title) }}

              </strong>

              <small>

                {{ formatLessonDate(row.lesson.date) }}

              </small>

            </div>

            <div class="attendance-dashboard__result">

              <template v-if="row.registered">

                <strong>

                  {{ row.present }}

                  /

                  {{ students.length }}

                </strong>

                <span>

                  presentes

                </span>

              </template>

              <span

                v-else

                class="attendance-dashboard__pending"

              >

                Sin registrar

              </span>

            </div>

          </article>

          <RouterLink

            to="/aula/asistencia"

            class="dashboard-link"

          >

            Administrar asistencia →

          </RouterLink>

        </div>

      </section>

      <!-- =====================================================

           ESTUDIANTES PROFESOR

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            04

          </span>

          <div>

            <p>

              Curso

            </p>

            <h2>

              Estudiantes

            </h2>

          </div>

        </div>

        <div class="student-dashboard-grid">

          <RouterLink

            v-for="studentRow in studentAttendanceRows"

            :key="studentRow.student.id"

            :to="`/aula/estudiante/${studentRow.student.id}`"

            class="student-dashboard-card"

          >

            <div class="student-dashboard-card__avatar">

              {{ getInitials(studentRow.student.name) }}

            </div>

            <div class="student-dashboard-card__info">

              <span>

                {{ studentRow.student.voice }}

              </span>

              <h3>

                {{ studentRow.student.name }}

              </h3>

              <p>

                {{

                  studentRow.registered > 0

                    ? `${studentRow.percentage}% asistencia`

                    : 'Sin asistencia registrada'

                }}

              </p>

            </div>

            <div class="student-dashboard-card__arrow">

              →

            </div>

          </RouterLink>

        </div>

        <RouterLink

          to="/aula/alumnos"

          class="dashboard-link"

        >

          Ver todos los alumnos →

        </RouterLink>

      </section>

    </template>

    <!-- =========================================================

         DASHBOARD ALUMNO

    ========================================================== -->

    <template v-else>

      <!-- =====================================================

           BIENVENIDA

      ====================================================== -->

      <header class="student-dashboard__hero">

        <div>

          <p class="dashboard__eyebrow">

            Aula Virtual · Estudiante

          </p>

          <h1>

            Hola, {{ firstName }}

          </h1>

          <div class="student-dashboard__identity">

            <span

              v-if="currentUser?.voice"

              class="student-voice"

            >

              {{ currentUser.voice }}

            </span>

            <span>

              Academia de Talentos Amo Mi Voz

            </span>

          </div>

        </div>

        <div class="student-dashboard__avatar">

          {{ getInitials(currentUser?.name) }}

        </div>

      </header>

      <!-- =====================================================

           RESUMEN ALUMNO

      ====================================================== -->

      <section class="student-summary">

        <article class="student-summary-card">

          <span>

            Tareas pendientes

          </span>

          <strong>

            {{ studentPendingTasks.length }}

          </strong>

          <RouterLink to="/aula/mis-tareas">

            Ver mis tareas →

          </RouterLink>

        </article>

        <article class="student-summary-card">

          <span>

            Asistencia

          </span>

          <strong>

            {{ studentAttendancePercentage }}%

          </strong>

          <small>

            {{ studentPresentCount }}

            presentes de

            {{ studentAttendanceRegistered }}

            registros

          </small>

        </article>

        <article class="student-summary-card">

          <span>

            Promedio

          </span>

          <strong>

            {{ studentAverageGrade }}

          </strong>

          <small>

            {{ studentReviewedSubmissions.length }}

            evaluaciones

          </small>

        </article>

        <article class="student-summary-card">

          <span>

            Entregas

          </span>

          <strong>

            {{ studentSubmissions.length }}

          </strong>

          <small>

            de {{ assignments.length }}

            tareas publicadas

          </small>

        </article>

      </section>

      <!-- =====================================================

           PRÓXIMA CLASE ALUMNO

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            01

          </span>

          <div>

            <p>

              Próxima actividad

            </p>

            <h2>

              Próxima clase

            </h2>

          </div>

        </div>

        <article

          v-if="nextLesson"

          class="next-class next-class--student"

        >

          <div class="next-class__number">

            {{

              String(nextLesson.id)

                .padStart(2, '0')

            }}

          </div>

          <div class="next-class__content">

            <span>

              {{ formatLessonDate(nextLesson.date) }}

            </span>

            <h3>

              {{ cleanLessonTitle(nextLesson.title) }}

            </h3>

            <p>

              {{ nextLesson.description }}

            </p>

          </div>

          <RouterLink

            :to="`/aula/clase/${nextLesson.id}`"

            class="dashboard-button"

          >

            Entrar a la clase →

          </RouterLink>

        </article>

      </section>

      <!-- =====================================================

           TAREAS PENDIENTES ALUMNO

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            02

          </span>

          <div>

            <p>

              Trabajo

            </p>

            <h2>

              Mis tareas pendientes

            </h2>

          </div>

        </div>

        <div

          v-if="studentPendingTasks.length > 0"

          class="student-task-list"

        >

          <RouterLink

            v-for="row in studentPendingTasks.slice(0, 3)"

            :key="row.task.id"

            :to="`/aula/clase/${row.task.lessonId}/tarea/${row.task.id}`"

            class="student-task-card"

          >

            <div class="student-task-card__icon">

              ♪

            </div>

            <div class="student-task-card__content">

              <span>

                Clase {{ getAcademicLessonNumberById(row.task.lessonId) }}

              </span>

              <h3>

                {{ row.task.title }}

              </h3>

              <p>

                {{ row.task.description }}

              </p>

            </div>

            <div class="student-task-card__status">

              Pendiente

            </div>

            <div class="student-task-card__arrow">

              →

            </div>

          </RouterLink>

          <RouterLink

            to="/aula/mis-tareas"

            class="dashboard-link"

          >

            Ver todas mis tareas →

          </RouterLink>

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

              Estás al día

            </h3>

            <p>

              No tienes tareas pendientes.

            </p>

          </div>

        </div>

      </section>

      <!-- =====================================================

           ÚLTIMA EVALUACIÓN

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            03

          </span>

          <div>

            <p>

              Retroalimentación

            </p>

            <h2>

              Última evaluación

            </h2>

          </div>

        </div>

        <article

          v-if="latestReviewedSubmission"

          class="latest-evaluation"

        >

          <div class="latest-evaluation__top">

            <div>

              <span>

                {{

                  getAssignmentTitle(

                    latestReviewedSubmission.taskId

                  )

                }}

              </span>

              <h3>

                Evaluación revisada

              </h3>

            </div>

            <div class="latest-evaluation__grade">

              <span>

                Nota

              </span>

              <strong>

                {{

                  hasGrade(

                    latestReviewedSubmission

                  )

                    ? latestReviewedSubmission.grade

                    : '—'

                }}

              </strong>

            </div>

          </div>

          <div

            v-if="latestReviewedSubmission.feedback"

            class="latest-evaluation__feedback"

          >

            <span>

              Comentario del profesor

            </span>

            <p>

              {{

                latestReviewedSubmission.feedback

              }}

            </p>

          </div>

          <RouterLink

            :to="

              getSubmissionTaskLink(

                latestReviewedSubmission

              )

            "

            class="dashboard-link"

          >

            Ver evaluación completa →

          </RouterLink>

        </article>

        <div

          v-else

          class="empty-state"

        >

          <span>

            i

          </span>

          <div>

            <h3>

              Aún no tienes evaluaciones

            </h3>

            <p>

              Cuando una entrega sea revisada,

              aparecerá aquí.

            </p>

          </div>

        </div>

      </section>

      <!-- =====================================================

           PROGRESO VOCAL

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            04

          </span>

          <div>

            <p>

              Desarrollo

            </p>

            <h2>

              Mi progreso vocal

            </h2>

          </div>

        </div>

        <div class="vocal-progress-card">

          <template v-if="hasRubricProgress">

            <article

              v-for="criterion in studentRubricProgress"

              :key="criterion.key"

              class="progress-row"

            >

              <div class="progress-row__header">

                <span>

                  {{ criterion.label }}

                </span>

                <strong>

                  {{ criterion.value.toFixed(1) }}

                  / 5

                </strong>

              </div>

              <div class="progress-row__bar">

                <div

                  class="progress-row__fill"

                  :style="{

                    width:

                      `${(criterion.value / 5) * 100}%`

                  }"

                ></div>

              </div>

            </article>

          </template>

          <div

            v-else

            class="progress-empty"

          >

            <span>

              ♪

            </span>

            <div>

              <h3>

                Tu progreso aparecerá aquí

              </h3>

              <p>

                Necesitas al menos una evaluación

                con rúbrica para generar tus indicadores.

              </p>

            </div>

          </div>

          <RouterLink

            v-if="currentUser"

            :to="`/aula/estudiante/${currentUser.id}`"

            class="dashboard-button dashboard-button--profile"

          >

            Ver mi ficha completa →

          </RouterLink>

        </div>

      </section>

      <!-- =====================================================

           ACCESOS RÁPIDOS

      ====================================================== -->

      <section class="dashboard__section">

        <div class="dashboard__section-title">

          <span>

            05

          </span>

          <div>

            <p>

              Aula Virtual

            </p>

            <h2>

              Accesos rápidos

            </h2>

          </div>

        </div>

        <div class="student-shortcuts">

          <RouterLink

            to="/aula/programa-formativo"

            class="shortcut-card"

          >

            <span class="shortcut-card__number">

              01

            </span>

            <h3>

              Programa formativo

            </h3>

            <p>

              Revisa las clases, contenidos

              y actividades del curso.

            </p>

            <strong>

              Ver programa →

            </strong>

          </RouterLink>

          <RouterLink

            to="/aula/mis-tareas"

            class="shortcut-card"

          >

            <span class="shortcut-card__number">

              02

            </span>

            <h3>

              Mis tareas

            </h3>

            <p>

              Revisa tus pendientes,

              entregas y evaluaciones.

            </p>

            <strong>

              Ver mis tareas →

            </strong>

          </RouterLink>

          <RouterLink

            v-if="currentUser"

            :to="`/aula/estudiante/${currentUser.id}`"

            class="shortcut-card"

          >

            <span class="shortcut-card__number">

              03

            </span>

            <h3>

              Mi progreso

            </h3>

            <p>

              Consulta asistencia,

              ficha vocal y rendimiento.

            </p>

            <strong>

              Ver mi progreso →

            </strong>

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

  useAuth

} from '@/composables/useAuth'

import {

  fetchLessons

} from '@/services/lessonService'

import {

  fetchAssignments

} from '@/services/assignmentService'

import {

  fetchSubmissions

} from '@/services/submissionService'

import {

  fetchAttendance

} from '@/services/attendanceService'

import {

  fetchStudents

} from '@/services/studentService'

/* =========================================================

   AUTENTICACIÓN

========================================================= */

const {

  currentUser,

  isTeacher

} = useAuth()

/* =========================================================

   DATOS SUPABASE

========================================================= */

const lessons = ref([])

const assignments = ref([])

const submissions = ref([])

const attendance = ref([])

const students = ref([])

const isLoading = ref(true)

const loadError = ref('')

/* =========================================================

   CARGAR DASHBOARD

========================================================= */

const loadDashboard = async () => {

  isLoading.value = true

  loadError.value = ''

  try {

    const [

      loadedLessons,

      loadedAssignments,

      loadedSubmissions,

      loadedAttendance,

      loadedStudents

    ] = await Promise.all([

      fetchLessons(),

      fetchAssignments(),

      fetchSubmissions(),

      fetchAttendance(),

      fetchStudents()

    ])

    lessons.value =

      loadedLessons || []

    /*

     * El profesor puede necesitar ver también borradores.

     * El alumno solamente debe trabajar con tareas publicadas.

     *

     * RLS ya protege esto en Supabase, pero además dejamos

     * esta segunda protección en el frontend.

     */

    assignments.value =

      isTeacher.value

        ? loadedAssignments || []

        : (loadedAssignments || []).filter(

            assignment =>

              assignment.status !== 'draft'

          )

    submissions.value =

      loadedSubmissions || []

    attendance.value =

      loadedAttendance || []

    students.value =

      loadedStudents || []

  } catch (error) {

    console.error(

      'Error cargando Dashboard:',

      error

    )

    lessons.value = []

    assignments.value = []

    submissions.value = []

    attendance.value = []

    students.value = []

    loadError.value =

      error?.message ||

      'No se pudo cargar la información del Aula Virtual.'

  } finally {

    isLoading.value = false

  }

}

/* =========================================================

   NOMBRE

========================================================= */

const firstName = computed(() => {

  const name =

    currentUser.value?.name

  if (!name) {

    return ''

  }

  return String(name)

    .trim()

    .split(/\s+/)[0]

})

/* =========================================================

   FECHAS

========================================================= */

const spanishMonths = {

  enero: 0,

  febrero: 1,

  marzo: 2,

  abril: 3,

  mayo: 4,

  junio: 5,

  julio: 6,

  agosto: 7,

  septiembre: 8,

  setiembre: 8,

  octubre: 9,

  noviembre: 10,

  diciembre: 11

}

/*

 * Convierte distintos formatos de fecha que pueda contener

 * una clase a un objeto Date.

 *

 * Soporta, por ejemplo:

 *

 * 2026-09-05

 * 05/09/2026

 * 5 de septiembre

 * 5 de septiembre de 2026

 */

const getLessonDate = lesson => {

  const rawDate =

    String(

      lesson?.date || ''

    ).trim()

  if (!rawDate) {

    return null

  }

  /* =====================================================

     YYYY-MM-DD

  ====================================================== */

  const isoMatch =

    rawDate.match(

      /^(\d{4})-(\d{1,2})-(\d{1,2})/

    )

  if (isoMatch) {

    const year =

      Number(isoMatch[1])

    const month =

      Number(isoMatch[2]) - 1

    const day =

      Number(isoMatch[3])

    return new Date(

      year,

      month,

      day,

      23,

      59,

      59

    )

  }

  /* =====================================================

     DD/MM/YYYY

  ====================================================== */

  const slashMatch =

    rawDate.match(

      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/

    )

  if (slashMatch) {

    const day =

      Number(slashMatch[1])

    const month =

      Number(slashMatch[2]) - 1

    const year =

      Number(slashMatch[3])

    return new Date(

      year,

      month,

      day,

      23,

      59,

      59

    )

  }

  /* =====================================================

     "5 de septiembre"

     "5 de septiembre de 2026"

  ====================================================== */

  const normalized =

    rawDate

      .toLowerCase()

      .replace(/\s+/g, ' ')

      .trim()

  const spanishMatch =

    normalized.match(

      /^(\d{1,2}) de ([a-záéíóúñ]+)(?: de (\d{4}))?$/

    )

  if (spanishMatch) {

    const day =

      Number(spanishMatch[1])

    const monthName =

      spanishMatch[2]

    const year =

      spanishMatch[3]

        ? Number(spanishMatch[3])

        : 2026

    const month =

      spanishMonths[monthName]

    if (

      Number.isNaN(day) ||

      month === undefined ||

      Number.isNaN(year)

    ) {

      return null

    }

    return new Date(

      year,

      month,

      day,

      23,

      59,

      59

    )

  }

  /* =====================================================

     ÚLTIMO INTENTO

  ====================================================== */

  const parsed =

    new Date(rawDate)

  if (

    Number.isNaN(

      parsed.getTime()

    )

  ) {

    return null

  }

  return parsed

}

/* =========================================================

   CLASES ORDENADAS

========================================================= */

const orderedLessons =

  computed(() => {

    return [

      ...lessons.value

    ].sort(

      (a, b) => {

        const dateA =

          getLessonDate(a)

        const dateB =

          getLessonDate(b)

        if (

          dateA &&

          dateB

        ) {

          return (

            dateA.getTime() -

            dateB.getTime()

          )

        }

        if (dateA) {

          return -1

        }

        if (dateB) {

          return 1

        }

        return (

          Number(a.id) -

          Number(b.id)

        )

      }

    )

  })

/* =========================================================

   NUMERACIÓN ACADÉMICA

========================================================= */

const getLessonUnitId = lesson =>
  lesson?.unitId ??
  lesson?.unit_id ??
  null

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

    return lesson
      ? getAcademicLessonNumber(lesson)
      : '—'
  }

const cleanLessonTitle = title => {
  if (!title) {
    return 'Clase sin título'
  }

  return String(title)
    .replace(
      /^\s*clase\s+(?:\d+|[ivxlcdm]+)\s*[·:–—-]?\s*/i,
      ''
    )
    .trim()
}

const formatLessonDate = value => {
  const parsed =
    getLessonDate({
      date: value
    })

  if (!parsed) {
    return value || 'Sin fecha'
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

/* =========================================================

   PRÓXIMA CLASE

========================================================= */

const nextLesson =

  computed(() => {

    if (

      orderedLessons.value.length === 0

    ) {

      return null

    }

    const now =

      new Date()

    const futureLesson =

      orderedLessons.value.find(

        lesson => {

          const date =

            getLessonDate(

              lesson

            )

          return (

            date &&

            date >= now

          )

        }

      )

    if (futureLesson) {

      return futureLesson

    }

    /*

     * Si el ciclo ya terminó, mantenemos el comportamiento

     * anterior del Dashboard y mostramos la última clase.

     */

    return (

      orderedLessons.value[

        orderedLessons.value.length - 1

      ] ||

      null

    )

  })

/* =========================================================

   ASISTENCIA VÁLIDA

========================================================= */

const validAttendance =

  computed(() => {

    return attendance.value.filter(

      record =>

        record.status === 'present' ||

        record.status === 'absent' ||

        record.status === 'justified'

    )

  })

/* =========================================================

   ASISTENCIA GENERAL PROFESOR

========================================================= */

const generalAttendancePercentage =

  computed(() => {

    const records =

      validAttendance.value

    if (

      records.length === 0

    ) {

      return 0

    }

    const present =

      records.filter(

        record =>

          record.status === 'present'

      ).length

    return Math.round(

      (

        present /

        records.length

      ) * 100

    )

  })

/* =========================================================

   ENTREGAS PENDIENTES PROFESOR

========================================================= */

const pendingReviews =

  computed(() => {

    return submissions.value

      .filter(

        submission => {

          const hasNoGrade =

            submission.grade === undefined ||

            submission.grade === null ||

            submission.grade === ''

          const hasNotBeenReviewed =

            !submission.reviewedAt

          return (

            hasNoGrade &&

            hasNotBeenReviewed

          )

        }

      )

      .map(

        submission => {

          const student =

            students.value.find(

              student =>

                Number(student.id) ===

                Number(

                  submission.studentId

                )

            )

          const task =

            assignments.value.find(

              assignment =>

                Number(

                  assignment.id

                ) ===

                Number(

                  submission.taskId ??

                  submission.assignmentId

                )

            )

          /*

           * Si por alguna razón el estudiante ya no está

           * activo, mantenemos igualmente el nombre guardado

           * en la entrega.

           */

          const normalizedStudent =

            student || {

              id:

                submission.studentId,

              name:

                submission.studentName ||

                'Estudiante',

              voice:

                ''

            }

          return {

            submission,

            student:

              normalizedStudent,

            task

          }

        }

      )

  })

const pendingReviewCount =

  computed(() =>

    pendingReviews.value.length

  )

/* =========================================================

   ASISTENCIA POR CLASE

========================================================= */

const lessonAttendanceRows =

  computed(() => {

    return [

      ...orderedLessons.value

    ]

      .reverse()

      .map(

        lesson => {

          const records =

            validAttendance.value.filter(

              record =>

                Number(

                  record.lessonId

                ) ===

                Number(

                  lesson.id

                )

            )

          const present =

            records.filter(

              record =>

                record.status ===

                'present'

            ).length

          return {

            lesson,

            present,

            registered:

              records.length > 0,

            total:

              records.length

          }

        }

      )

      .slice(0, 5)

  })

/* =========================================================

   ASISTENCIA POR ESTUDIANTE

========================================================= */

const studentAttendanceRows =

  computed(() => {

    return students.value.map(

      student => {

        const records =

          validAttendance.value.filter(

            record =>

              Number(

                record.studentId

              ) ===

              Number(

                student.id

              )

          )

        const present =

          records.filter(

            record =>

              record.status ===

              'present'

          ).length

        const percentage =

          records.length > 0

            ? Math.round(

                (

                  present /

                  records.length

                ) * 100

              )

            : 0

        return {

          student,

          present,

          registered:

            records.length,

          percentage

        }

      }

    )

  })

/* =========================================================

   ENTREGAS DEL ALUMNO

========================================================= */

const studentSubmissions =

  computed(() => {

    if (

      !currentUser.value

    ) {

      return []

    }

    return submissions.value.filter(

      submission =>

        Number(

          submission.studentId

        ) ===

        Number(

          currentUser.value.id

        )

    )

  })

/* =========================================================

   TAREAS DEL ALUMNO

========================================================= */

const studentTaskRows =

  computed(() => {

    if (

      !currentUser.value

    ) {

      return []

    }

    return assignments.value

      .filter(

        task =>

          task.status !== 'draft'

      )

      .map(

        task => {

          const submission =

            studentSubmissions.value.find(

              item =>

                Number(

                  item.taskId ??

                  item.assignmentId

                ) ===

                Number(

                  task.id

                )

            )

          let status =

            'pending'

          if (submission) {

            if (

              submission.status ===

                'reviewed' ||

              submission.status ===

                'returned' ||

              submission.reviewedAt

            ) {

              status =

                'reviewed'

            } else {

              status =

                'submitted'

            }

          }

          return {

            task,

            submission,

            status

          }

        }

      )

  })

const studentPendingTasks =

  computed(() =>

    studentTaskRows.value.filter(

      row =>

        row.status ===

        'pending'

    )

  )

/* =========================================================

   ASISTENCIA DEL ALUMNO

========================================================= */

const studentAttendanceRecords =

  computed(() => {

    if (

      !currentUser.value

    ) {

      return []

    }

    return validAttendance.value.filter(

      record =>

        Number(

          record.studentId

        ) ===

        Number(

          currentUser.value.id

        )

    )

  })

const studentPresentCount =

  computed(() =>

    studentAttendanceRecords.value

      .filter(

        record =>

          record.status ===

          'present'

      )

      .length

  )

const studentAttendanceRegistered =

  computed(() =>

    studentAttendanceRecords.value

      .length

  )

const studentAttendancePercentage =

  computed(() => {

    if (

      studentAttendanceRegistered.value ===

      0

    ) {

      return 0

    }

    return Math.round(

      (

        studentPresentCount.value /

        studentAttendanceRegistered.value

      ) * 100

    )

  })

/* =========================================================

   EVALUACIONES DEL ALUMNO

========================================================= */

const hasGrade =

  submission => {

    return (

      submission?.grade !==

        undefined &&

      submission?.grade !==

        null &&

      submission?.grade !==

        ''

    )

  }

const studentReviewedSubmissions =

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

/* =========================================================

   PROMEDIO

========================================================= */

const studentAverageGrade =

  computed(() => {

    const grades =

      studentReviewedSubmissions.value

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

          grade =>

            Number.isFinite(

              grade

            )

        )

    if (

      grades.length === 0

    ) {

      return '—'

    }

    const total =

      grades.reduce(

        (

          sum,

          grade

        ) =>

          sum + grade,

        0

      )

    return (

      total /

      grades.length

    ).toFixed(1)

  })

/* =========================================================

   ÚLTIMA EVALUACIÓN

========================================================= */

const latestReviewedSubmission =

  computed(() => {

    const reviewed = [

      ...studentReviewedSubmissions.value

    ]

    if (

      reviewed.length === 0

    ) {

      return null

    }

    reviewed.sort(

      (

        a,

        b

      ) => {

        const dateA =

          new Date(

            a.reviewedAt ||

            a.updatedAt ||

            a.submittedAt ||

            0

          ).getTime()

        const dateB =

          new Date(

            b.reviewedAt ||

            b.updatedAt ||

            b.submittedAt ||

            0

          ).getTime()

        return (

          dateB -

          dateA

        )

      }

    )

    return reviewed[0]

  })

/* =========================================================

   NOMBRE DE TAREA

========================================================= */

const getAssignmentTitle =

  taskId => {

    const task =

      assignments.value.find(

        assignment =>

          Number(

            assignment.id

          ) ===

          Number(

            taskId

          )

      )

    return (

      task?.title ||

      'Evaluación'

    )

  }

/* =========================================================

   LINK DE ENTREGA

========================================================= */

const getSubmissionTaskLink =

  submission => {

    const submissionTaskId =

      submission?.taskId ??

      submission?.assignmentId

    const task =

      assignments.value.find(

        assignment =>

          Number(

            assignment.id

          ) ===

          Number(

            submissionTaskId

          )

      )

    if (!task) {

      return '/aula/mis-tareas'

    }

    return (

      `/aula/clase/${task.lessonId}` +

      `/tarea/${task.id}`

    )

  }

/* =========================================================

   PROGRESO VOCAL

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

const studentRubricProgress =

  computed(() => {

    return rubricCriteria.map(

      criterion => {

        const values =

          studentReviewedSubmissions.value

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

        const average =

          values.length > 0

            ? values.reduce(

                (

                  sum,

                  value

                ) =>

                  sum + value,

                0

              ) /

              values.length

            : 0

        return {

          ...criterion,

          value:

            average

        }

      }

    )

  })

const hasRubricProgress =

  computed(() =>

    studentRubricProgress.value.some(

      criterion =>

        criterion.value > 0

    )

  )

/* =========================================================

   INICIALES

========================================================= */

const getInitials =

  name => {

    if (!name) {

      return '?'

    }

    return String(name)

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

  }

/* =========================================================

   INICIAR

========================================================= */

onMounted(

  loadDashboard

)

</script>

<style lang="scss" scoped>

@use '@/assets/styles/abstracts/variables' as variables;

.dashboard {

  width: 100%;

  max-width: 1250px;

  margin: 0 auto;

}

/* =========================================================

   ESTADOS

========================================================= */

.dashboard-state {
  display: flex;
  min-height: 220px;
  gap: variables.$spacing-lg;
  align-items: center;
  justify-content: center;
  padding: variables.$spacing-2xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-xl;
  background: variables.$color-surface;
}

.dashboard-state > span {
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: variables.$color-danger;
  background: variables.$color-danger-soft;
  font-weight: variables.$font-weight-bold;
}

.dashboard-state strong {
  display: block;
  margin-bottom: variables.$spacing-xs;
  color: variables.$color-text-primary;
  font-size: variables.$font-size-md;
}

.dashboard-state p {
  margin: 0;
  color: variables.$color-text-muted;
  font-size: variables.$font-size-sm;
}

.dashboard-state button {
  min-height: variables.$control-height-md;
  margin-top: variables.$spacing-md;
  padding: 0 variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-md;
  color: variables.$color-text-primary;
  background: transparent;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

.dashboard-state button:hover {
  border-color: variables.$color-primary;
  color: variables.$color-primary;
}

.dashboard-state__spinner {
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  border: 3px solid variables.$color-border;
  border-top-color: variables.$color-primary;
  border-radius: 50%;
  animation: dashboard-spin 0.8s linear infinite;
}

@keyframes dashboard-spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================

   HEADER GENERAL

========================================================= */

.dashboard__header {

  margin-bottom:

    variables.$spacing-2xl;

}

.dashboard__eyebrow {

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

.dashboard__header h1,

.student-dashboard__hero h1 {

  margin-bottom:

    variables.$spacing-md;

  font-size:

    clamp(

      3rem,

      7vw,

      5rem

    );

}

.dashboard__header > p:last-child {

  max-width: 700px;

  opacity: 0.7;

}

/* =========================================================

   RESUMEN PROFESOR

========================================================= */

.dashboard__summary {

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

.summary-card {

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

.summary-card > span,

.summary-card > strong,

.summary-card > a {

  display: block;

}

.summary-card > span:first-child {

  margin-bottom:

    variables.$spacing-sm;

  opacity: 0.55;

}

.summary-card > strong {

  margin-bottom:

    variables.$spacing-sm;

  color:

    variables.$color-primary;

  font-size: 2rem;

}

.summary-card a {

  margin-top:

    variables.$spacing-md;

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-sm;

  font-weight:

    variables.$font-weight-semibold;

  text-decoration: none;

}

.summary-card__secondary {

  font-size:

    variables.$font-size-sm;

  opacity: 0.4 !important;

}

/* =========================================================

   SECCIONES

========================================================= */

.dashboard__section {

  margin-bottom:

    variables.$spacing-3xl;

}

.dashboard__section-title {

  display: flex;

  gap:

    variables.$spacing-md;

  align-items: center;

  margin-bottom:

    variables.$spacing-xl;

}

.dashboard__section-title > span {

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

.dashboard__section-title p {

  margin-bottom:

    variables.$spacing-xs;

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-sm;

  text-transform: uppercase;

}

.dashboard__section-title h2 {

  margin: 0;

}

/* =========================================================

   PRÓXIMA CLASE

========================================================= */

.next-class {

  display: grid;

  gap:

    variables.$spacing-xl;

  align-items: center;

  grid-template-columns:

    auto

    1fr

    auto;

  padding:

    variables.$spacing-2xl;

  border:

    1px solid

    variables.$color-primary;

  border-radius:

    variables.$radius-lg;

  background:

    variables.$color-surface;

}

.next-class__number {

  display: grid;

  width: 78px;

  height: 78px;

  place-items: center;

  border-radius: 50%;

  background:

    variables.$color-primary;

  color:

    variables.$color-white;

  font-size: 1.5rem;

  font-weight:

    variables.$font-weight-bold;

}

.next-class__content span {

  display: block;

  margin-bottom:

    variables.$spacing-xs;

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-sm;

}

.next-class__content h3 {

  margin-bottom:

    variables.$spacing-sm;

  font-size: 1.6rem;

}

.next-class__content p {

  margin: 0;

  opacity: 0.65;

}

.dashboard-button {

  display: inline-block;

  padding:

    variables.$spacing-md

    variables.$spacing-xl;

  border-radius:

    variables.$radius-lg;

  background:

    variables.$color-primary;

  color:

    variables.$color-white;

  font-weight:

    variables.$font-weight-semibold;

  text-decoration: none;

  transition:

    opacity 0.2s ease,

    transform 0.2s ease;

}

.dashboard-button:hover {

  opacity: 0.9;

  transform:

    translateY(-2px);

}

/* =========================================================

   PROFESOR · PENDIENTES

========================================================= */

.pending-list {

  display: grid;

  gap:

    variables.$spacing-md;

}

.pending-card {

  display: grid;

  gap:

    variables.$spacing-lg;

  align-items: center;

  grid-template-columns:

    auto

    1fr

    auto;

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

.pending-card__avatar {

  display: grid;

  width: 50px;

  height: 50px;

  place-items: center;

  border-radius: 50%;

  background:

    variables.$color-primary;

  color:

    variables.$color-white;

  font-weight:

    variables.$font-weight-bold;

}

.pending-card__content span {

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-xs;

  text-transform: uppercase;

}

.pending-card__content h3 {

  margin:

    variables.$spacing-xs

    0;

}

.pending-card__content p {

  margin: 0;

  opacity: 0.55;

}

.pending-card__button {

  color:

    variables.$color-primary;

  font-weight:

    variables.$font-weight-semibold;

  text-decoration: none;

}

/* =========================================================

   PROFESOR · ASISTENCIA

========================================================= */

.attendance-dashboard {

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

.attendance-dashboard__row {

  display: flex;

  gap:

    variables.$spacing-xl;

  align-items: center;

  justify-content:

    space-between;

  padding:

    variables.$spacing-md

    0;

  border-bottom:

    1px solid

    variables.$color-border;

}

.attendance-dashboard__lesson span,

.attendance-dashboard__lesson strong,

.attendance-dashboard__lesson small {

  display: block;

}

.attendance-dashboard__lesson span {

  margin-bottom: 3px;

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-xs;

  text-transform: uppercase;

}

.attendance-dashboard__lesson small {

  margin-top: 4px;

  opacity: 0.4;

}

.attendance-dashboard__result {

  text-align: right;

}

.attendance-dashboard__result strong,

.attendance-dashboard__result span {

  display: block;

}

.attendance-dashboard__result strong {

  color:

    variables.$color-primary;

  font-size: 1.3rem;

}

.attendance-dashboard__result span {

  font-size:

    variables.$font-size-xs;

  opacity: 0.5;

}

.attendance-dashboard__pending {

  opacity: 0.35 !important;

}

/* =========================================================

   PROFESOR · ESTUDIANTES

========================================================= */

.student-dashboard-grid {

  display: grid;

  gap:

    variables.$spacing-md;

  grid-template-columns:

    repeat(

      3,

      minmax(0, 1fr)

    );

}

.student-dashboard-card {

  display: grid;

  gap:

    variables.$spacing-md;

  align-items: center;

  grid-template-columns:

    auto

    1fr

    auto;

  padding:

    variables.$spacing-lg;

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

.student-dashboard-card:hover {

  border-color:

    variables.$color-primary;

  transform:

    translateY(-2px);

}

.student-dashboard-card__avatar {

  display: grid;

  width: 50px;

  height: 50px;

  place-items: center;

  border-radius: 50%;

  background:

    variables.$color-primary;

  color:

    variables.$color-white;

  font-weight:

    variables.$font-weight-bold;

}

.student-dashboard-card__info span {

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-xs;

  text-transform: uppercase;

}

.student-dashboard-card__info h3 {

  margin:

    3px

    0;

}

.student-dashboard-card__info p {

  margin: 0;

  font-size:

    variables.$font-size-sm;

  opacity: 0.5;

}

.student-dashboard-card__arrow {

  color:

    variables.$color-primary;

}

/* =========================================================

   ALUMNO · HERO

========================================================= */

.student-dashboard__hero {

  display: flex;

  gap:

    variables.$spacing-xl;

  align-items: center;

  justify-content:

    space-between;

  margin-bottom:

    variables.$spacing-2xl;

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

.student-dashboard__hero h1 {

  margin:

    0

    0

    variables.$spacing-md;

}

.student-dashboard__identity {

  display: flex;

  gap:

    variables.$spacing-md;

  align-items: center;

  flex-wrap: wrap;

  opacity: 0.65;

}

.student-voice {

  padding:

    0.4rem

    0.8rem;

  border:

    1px solid

    variables.$color-primary;

  border-radius: 999px;

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-sm;

  opacity: 1;

}

.student-dashboard__avatar {

  display: grid;

  width: 110px;

  height: 110px;

  flex-shrink: 0;

  place-items: center;

  border:

    2px solid

    variables.$color-primary;

  border-radius: 50%;

  background:

    variables.$color-background;

  color:

    variables.$color-primary;

  font-size: 2rem;

  font-weight:

    variables.$font-weight-bold;

}

/* =========================================================

   ALUMNO · RESUMEN

========================================================= */

.student-summary {

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

.student-summary-card {

  min-height: 170px;

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

.student-summary-card > span,

.student-summary-card > strong,

.student-summary-card > small,

.student-summary-card > a {

  display: block;

}

.student-summary-card > span {

  margin-bottom:

    variables.$spacing-md;

  opacity: 0.55;

}

.student-summary-card > strong {

  margin-bottom:

    variables.$spacing-sm;

  color:

    variables.$color-primary;

  font-size: 2.3rem;

}

.student-summary-card > small {

  line-height: 1.5;

  opacity: 0.45;

}

.student-summary-card > a {

  margin-top:

    variables.$spacing-md;

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-sm;

  font-weight:

    variables.$font-weight-semibold;

  text-decoration: none;

}

/* =========================================================

   ALUMNO · TAREAS

========================================================= */

.student-task-list {

  display: grid;

  gap:

    variables.$spacing-md;

}

.student-task-card {

  display: grid;

  gap:

    variables.$spacing-lg;

  align-items: center;

  grid-template-columns:

    auto

    1fr

    auto

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

  color:

    variables.$color-white;

  text-decoration: none;

  transition:

    border-color 0.2s ease,

    transform 0.2s ease;

}

.student-task-card:hover {

  border-color:

    variables.$color-primary;

  transform:

    translateY(-2px);

}

.student-task-card__icon {

  display: grid;

  width: 54px;

  height: 54px;

  place-items: center;

  border:

    1px solid

    variables.$color-primary;

  border-radius: 50%;

  color:

    variables.$color-primary;

  font-size: 1.4rem;

}

.student-task-card__content span {

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-xs;

  text-transform: uppercase;

}

.student-task-card__content h3 {

  margin:

    variables.$spacing-xs

    0;

}

.student-task-card__content p {

  margin: 0;

  opacity: 0.55;

}

.student-task-card__status {

  padding:

    0.4rem

    0.75rem;

  border:

    1px solid

    variables.$color-border;

  border-radius:

    999px;

  font-size:

    variables.$font-size-xs;

  opacity: 0.65;

}

.student-task-card__arrow {

  color:

    variables.$color-primary;

}

/* =========================================================

   ALUMNO · ÚLTIMA EVALUACIÓN

========================================================= */

.latest-evaluation {

  padding:

    variables.$spacing-2xl;

  border:

    1px solid

    variables.$color-primary;

  border-radius:

    variables.$radius-lg;

  background:

    variables.$color-surface;

}

.latest-evaluation__top {

  display: flex;

  gap:

    variables.$spacing-xl;

  align-items: center;

  justify-content:

    space-between;

}

.latest-evaluation__top > div:first-child > span {

  display: block;

  margin-bottom:

    variables.$spacing-xs;

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-sm;

}

.latest-evaluation__top h3 {

  margin: 0;

}

.latest-evaluation__grade {

  min-width: 90px;

  text-align: center;

}

.latest-evaluation__grade span,

.latest-evaluation__grade strong {

  display: block;

}

.latest-evaluation__grade span {

  margin-bottom:

    variables.$spacing-xs;

  font-size:

    variables.$font-size-xs;

  opacity: 0.45;

}

.latest-evaluation__grade strong {

  color:

    variables.$color-primary;

  font-size: 2.2rem;

}

.latest-evaluation__feedback {

  margin-top:

    variables.$spacing-xl;

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

.latest-evaluation__feedback span {

  display: block;

  margin-bottom:

    variables.$spacing-sm;

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-xs;

  font-weight:

    variables.$font-weight-semibold;

  text-transform: uppercase;

}

.latest-evaluation__feedback p {

  margin: 0;

  line-height: 1.7;

  opacity: 0.75;

}

/* =========================================================

   ALUMNO · PROGRESO VOCAL

========================================================= */

.vocal-progress-card {

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

.progress-row {

  margin-bottom:

    variables.$spacing-lg;

}

.progress-row:last-of-type {

  margin-bottom: 0;

}

.progress-row__header {

  display: flex;

  align-items: center;

  justify-content:

    space-between;

  margin-bottom:

    variables.$spacing-sm;

}

.progress-row__header span {

  font-weight:

    variables.$font-weight-semibold;

}

.progress-row__header strong {

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-sm;

}

.progress-row__bar {

  width: 100%;

  height: 10px;

  overflow: hidden;

  border-radius: 999px;

  background:

    variables.$color-background;

}

.progress-row__fill {

  height: 100%;

  border-radius: 999px;

  background:

    variables.$color-primary;

  transition:

    width 0.3s ease;

}

.progress-empty {

  display: flex;

  gap:

    variables.$spacing-lg;

  align-items: center;

}

.progress-empty > span {

  display: grid;

  width: 52px;

  height: 52px;

  flex-shrink: 0;

  place-items: center;

  border:

    1px solid

    variables.$color-primary;

  border-radius: 50%;

  color:

    variables.$color-primary;

  font-size: 1.3rem;

}

.progress-empty h3 {

  margin-bottom:

    variables.$spacing-xs;

}

.progress-empty p {

  margin: 0;

  opacity: 0.55;

}

.dashboard-button--profile {

  margin-top:

    variables.$spacing-xl;

}

/* =========================================================

   ALUMNO · ACCESOS RÁPIDOS

========================================================= */

.student-shortcuts {

  display: grid;

  gap:

    variables.$spacing-md;

  grid-template-columns:

    repeat(

      3,

      minmax(0, 1fr)

    );

}

.shortcut-card {

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

.shortcut-card:hover {

  border-color:

    variables.$color-primary;

  transform:

    translateY(-2px);

}

.shortcut-card__number {

  display: grid;

  width: 44px;

  height: 44px;

  margin-bottom:

    variables.$spacing-lg;

  place-items: center;

  border:

    1px solid

    variables.$color-primary;

  border-radius: 50%;

  color:

    variables.$color-primary;

}

.shortcut-card h3 {

  margin-bottom:

    variables.$spacing-sm;

}

.shortcut-card p {

  min-height: 48px;

  margin-bottom:

    variables.$spacing-lg;

  line-height: 1.5;

  opacity: 0.55;

}

.shortcut-card strong {

  color:

    variables.$color-primary;

  font-size:

    variables.$font-size-sm;

}

/* =========================================================

   GENERAL

========================================================= */

.dashboard-link {

  display: inline-block;

  margin-top:

    variables.$spacing-lg;

  color:

    variables.$color-primary;

  font-weight:

    variables.$font-weight-semibold;

  text-decoration: none;

}

.empty-state {

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

.empty-state > span {

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

/* =========================================================

   RESPONSIVE

========================================================= */

@media (max-width: 1050px) {

  .dashboard__summary,

  .student-summary {

    grid-template-columns:

      repeat(

        2,

        minmax(0, 1fr)

      );

  }

  .student-dashboard-grid,

  .student-shortcuts {

    grid-template-columns:

      repeat(

        2,

        minmax(0, 1fr)

      );

  }

}

@media (max-width: 800px) {

  .next-class,

  .pending-card {

    grid-template-columns:

      auto

      1fr;

  }

  .next-class .dashboard-button,

  .pending-card__button {

    grid-column:

      1 / -1;

  }

  .next-class .dashboard-button {

    text-align: center;

  }

  .student-task-card {

    grid-template-columns:

      auto

      1fr

      auto;

  }

  .student-task-card__status {

    grid-column:

      2 / 3;

  }

}

@media (max-width: 650px) {

  .dashboard__summary,

  .student-summary,

  .student-dashboard-grid,

  .student-shortcuts {

    grid-template-columns: 1fr;

  }

  .student-dashboard__hero {

    align-items:

      flex-start;

    flex-direction:

      column-reverse;

  }

  .student-dashboard__avatar {

    width: 78px;

    height: 78px;

    font-size: 1.4rem;

  }

  .attendance-dashboard__row {

    align-items:

      flex-start;

    flex-direction:

      column;

  }

  .attendance-dashboard__result {

    text-align: left;

  }

  .latest-evaluation__top {

    align-items:

      flex-start;

    flex-direction:

      column;

  }

  .latest-evaluation__grade {

    text-align: left;

  }

}

@media (max-width: 500px) {

  .next-class {

    grid-template-columns: 1fr;

  }

  .next-class__number {

    width: 58px;

    height: 58px;

  }

  .student-task-card {

    grid-template-columns:

      1fr;

  }

  .student-task-card__status {

    grid-column: auto;

    width: fit-content;

  }

  .student-task-card__arrow {

    display: none;

  }

}

@media (prefers-reduced-motion: reduce) {
  .dashboard-state__spinner {
    animation-duration: 1.6s;
  }

  .dashboard *,
  .dashboard *::before,
  .dashboard *::after {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
  }
}

</style>
