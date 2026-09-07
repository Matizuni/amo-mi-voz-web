<template>
  <section class="saas-dashboard">
    <div v-if="isLoading" class="state-card">
      <div class="state-spinner"></div>
      <div><strong>Cargando tu espacio académico</strong><p>Estamos reuniendo clases, estudiantes y actividad reciente.</p></div>
    </div>

    <div v-else-if="loadError" class="state-card state-card--error">
      <span class="state-icon">!</span>
      <div><strong>No pudimos cargar el dashboard</strong><p>{{ loadError }}</p><button type="button" @click="loadDashboard">Reintentar</button></div>
    </div>

    <template v-else>
      <header class="page-hero">
        <div>
          <span class="page-kicker">{{ isTeacher ? 'PANEL DOCENTE' : 'MI AULA' }}</span>
          <h1>{{ greeting }}, {{ firstName }}</h1>
          <p>{{ isTeacher ? 'Administra el curso y revisa lo que necesita tu atención.' : 'Aquí tienes lo más importante para continuar tu formación.' }}</p>
        </div>
        <div class="hero-actions">
          <RouterLink v-if="isTeacher" to="/aula/clases/nueva" class="button button--primary">+ Nueva clase</RouterLink>
          <RouterLink v-if="isTeacher" to="/aula/recursos/publicar" class="button button--secondary">Publicar recurso</RouterLink>
          <RouterLink v-else to="/aula/mis-tareas" class="button button--primary">Ver mis tareas</RouterLink>
        </div>
      </header>

      <template v-if="isTeacher">
        <section class="metric-grid">
          <RouterLink to="/aula/alumnos" class="metric-card"><span class="metric-label">Estudiantes</span><strong>{{ students.length }}</strong><small>Matriculados en el aula</small><i>→</i></RouterLink>
          <RouterLink to="/aula/programa-formativo" class="metric-card"><span class="metric-label">Clases</span><strong>{{ lessons.length }}</strong><small>En el programa formativo</small><i>→</i></RouterLink>
          <RouterLink to="/aula/asistencia" class="metric-card"><span class="metric-label">Asistencia</span><strong>{{ generalAttendancePercentage }}%</strong><small>Promedio general registrado</small><i>→</i></RouterLink>
          <RouterLink to="/aula/calificaciones" class="metric-card" :class="{ 'metric-card--alert': pendingReviewCount > 0 }"><span class="metric-label">Por revisar</span><strong>{{ pendingReviewCount }}</strong><small>Entregas requieren atención</small><i>→</i></RouterLink>
        </section>

        <div class="dashboard-grid">
          <section class="panel panel--wide">
            <div class="panel-heading"><div><span>PRÓXIMO</span><h2>Clase del programa</h2></div><RouterLink to="/aula/programa-formativo">Ver programa →</RouterLink></div>
            <article v-if="nextLesson" class="next-lesson">
              <div class="lesson-index">{{ String(getAcademicLessonNumber(nextLesson)).padStart(2,'0') }}</div>
              <div class="next-lesson__body"><span>{{ formatLessonDate(nextLesson.date) }}</span><h3>{{ cleanLessonTitle(nextLesson.title) }}</h3><p>{{ nextLesson.description || 'Clase programada en el Aula Virtual.' }}</p></div>
              <RouterLink :to="`/aula/clase/${nextLesson.id}`" class="button button--dark">Abrir clase →</RouterLink>
            </article>
            <div v-else class="empty-state"><strong>Aún no hay clases publicadas</strong><p>Crea la primera clase para comenzar a organizar el programa.</p><RouterLink to="/aula/clases/nueva">Crear clase</RouterLink></div>
          </section>

          <aside class="panel attention-panel">
            <div class="panel-heading"><div><span>ATENCIÓN</span><h2>Estado del curso</h2></div></div>
            <div class="attention-item"><span class="attention-dot attention-dot--wine"></span><div><strong>{{ pendingReviewCount }} entregas pendientes</strong><small>Revisa y entrega retroalimentación.</small></div></div>
            <div class="attention-item"><span class="attention-dot attention-dot--gold"></span><div><strong>{{ students.length }} estudiantes activos</strong><small>Seguimiento centralizado del grupo.</small></div></div>
            <div class="attention-item"><span class="attention-dot attention-dot--green"></span><div><strong>{{ generalAttendancePercentage }}% asistencia</strong><small>Promedio de registros disponibles.</small></div></div>
          </aside>
        </div>

        <div class="dashboard-grid dashboard-grid--lower">
          <section class="panel panel--wide">
            <div class="panel-heading"><div><span>ASISTENCIA</span><h2>Últimas clases registradas</h2></div><RouterLink to="/aula/asistencia">Gestionar →</RouterLink></div>
            <div v-if="lessonAttendanceRows.length" class="activity-list">
              <article v-for="row in lessonAttendanceRows" :key="row.lesson.id" class="activity-row">
                <div class="activity-number">{{ String(getAcademicLessonNumber(row.lesson)).padStart(2,'0') }}</div>
                <div class="activity-copy"><strong>{{ cleanLessonTitle(row.lesson.title) }}</strong><span>{{ formatLessonDate(row.lesson.date) }}</span></div>
                <div class="activity-value"><strong>{{ row.registered ? row.present : '—' }}</strong><span>{{ row.registered ? `de ${row.total} presentes` : 'Sin registro' }}</span></div>
              </article>
            </div>
            <div v-else class="empty-inline">Todavía no hay registros de asistencia.</div>
          </section>

          <aside class="panel quick-panel">
            <div class="panel-heading"><div><span>ACCESOS</span><h2>Gestión rápida</h2></div></div>
            <RouterLink to="/aula/alumnos"><span>Alumnos</span><b>→</b></RouterLink>
            <RouterLink to="/aula/inscripciones"><span>Inscripciones</span><b>→</b></RouterLink>
            <RouterLink to="/aula/calificaciones"><span>Calificaciones</span><b>→</b></RouterLink>
            <RouterLink to="/aula/recursos"><span>Biblioteca de recursos</span><b>→</b></RouterLink>
          </aside>
        </div>
      </template>

      <template v-else>
        <section class="metric-grid metric-grid--student">
          <RouterLink to="/aula/mis-tareas" class="metric-card"><span class="metric-label">Pendientes</span><strong>{{ studentPendingTasks.length }}</strong><small>Tareas por completar</small><i>→</i></RouterLink>
          <RouterLink to="/aula/asistencia" class="metric-card"><span class="metric-label">Mi asistencia</span><strong>{{ studentAttendancePercentage }}%</strong><small>{{ studentPresentCount }} de {{ studentAttendanceRegistered }} registros presentes</small><i>→</i></RouterLink>
          <RouterLink to="/aula/evaluaciones" class="metric-card"><span class="metric-label">Promedio</span><strong>{{ studentAverageGrade }}</strong><small>En entregas calificadas</small><i>→</i></RouterLink>
        </section>

        <div class="dashboard-grid">
          <section class="panel panel--wide">
            <div class="panel-heading"><div><span>CONTINÚA APRENDIENDO</span><h2>Próxima clase</h2></div><RouterLink to="/aula/programa-formativo">Ver programa →</RouterLink></div>
            <article v-if="nextLesson" class="next-lesson">
              <div class="lesson-index">{{ String(getAcademicLessonNumber(nextLesson)).padStart(2,'0') }}</div>
              <div class="next-lesson__body"><span>{{ formatLessonDate(nextLesson.date) }}</span><h3>{{ cleanLessonTitle(nextLesson.title) }}</h3><p>{{ nextLesson.description || 'Continúa avanzando en tu programa formativo.' }}</p></div>
              <RouterLink :to="`/aula/clase/${nextLesson.id}`" class="button button--dark">Entrar a la clase →</RouterLink>
            </article>
          </section>

          <aside class="panel progress-panel">
            <div class="panel-heading"><div><span>MI PROGRESO</span><h2>Desempeño vocal</h2></div></div>
            <template v-if="hasRubricProgress">
              <div v-for="criterion in studentRubricProgress" :key="criterion.key" class="progress-row">
                <div><span>{{ criterion.label }}</span><strong>{{ criterion.value ? criterion.value.toFixed(1) : '—' }}</strong></div>
                <div class="progress-track"><i :style="{ width: `${Math.min(100, (criterion.value / 7) * 100)}%` }"></i></div>
              </div>
            </template>
            <div v-else class="empty-inline">Tu progreso aparecerá cuando recibas evaluaciones con rúbrica.</div>
          </aside>
        </div>

        <div class="dashboard-grid dashboard-grid--lower">
          <section class="panel panel--wide">
            <div class="panel-heading"><div><span>PENDIENTES</span><h2>Mis próximas tareas</h2></div><RouterLink to="/aula/mis-tareas">Ver todas →</RouterLink></div>
            <div v-if="studentPendingTasks.length" class="activity-list">
              <article v-for="row in studentPendingTasks.slice(0,5)" :key="row.task.id" class="activity-row">
                <div class="activity-number activity-number--task">✓</div>
                <div class="activity-copy"><strong>{{ row.task.title || 'Tarea' }}</strong><span>Clase {{ getAcademicLessonNumberById(row.task.lessonId) }}</span></div>
                <RouterLink :to="`/aula/clase/${row.task.lessonId}/tarea/${row.task.id}`" class="row-link">Abrir →</RouterLink>
              </article>
            </div>
            <div v-else class="empty-state empty-state--success"><strong>Estás al día</strong><p>No tienes tareas pendientes en este momento.</p></div>
          </section>

          <aside class="panel latest-panel">
            <div class="panel-heading"><div><span>ÚLTIMO RESULTADO</span><h2>Evaluación reciente</h2></div></div>
            <template v-if="latestReviewedSubmission">
              <div class="grade-circle">{{ hasGrade(latestReviewedSubmission) ? latestReviewedSubmission.grade : '✓' }}</div>
              <strong>{{ getAssignmentTitle(latestReviewedSubmission.taskId ?? latestReviewedSubmission.assignmentId) }}</strong>
              <span>Revisada por tu profesor</span>
              <RouterLink :to="getSubmissionTaskLink(latestReviewedSubmission)">Ver retroalimentación →</RouterLink>
            </template>
            <div v-else class="empty-inline">Aún no tienes evaluaciones revisadas.</div>
          </aside>
        </div>
      </template>
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

const greeting = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Buenos días'
  if (hour < 20) return 'Buenas tardes'
  return 'Buenas noches'
})

/* =========================================================

   INICIAR

========================================================= */

onMounted(

  loadDashboard

)

</script>

<style lang="scss" scoped>
.saas-dashboard{--text:#17202a;--muted:#667085;--border:#e1e6ec;--wine:#8b1e3f;--gold:#b68b19;color:var(--text)}
.page-hero{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;margin-bottom:28px}.page-kicker,.panel-heading span{display:block;color:#9b7516;font-size:.64rem;font-weight:800;letter-spacing:.13em}.page-hero h1{margin:7px 0 7px;font-size:clamp(2rem,3.7vw,3.1rem);line-height:1.05;letter-spacing:-.045em}.page-hero p{margin:0;color:var(--muted);font-size:.9rem}.hero-actions{display:flex;gap:9px;flex-wrap:wrap}.button{min-height:40px;padding:0 15px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--border);border-radius:9px;text-decoration:none;font-size:.75rem;font-weight:750;transition:.18s}.button--primary{background:var(--wine);border-color:var(--wine);color:#fff}.button--primary:hover{background:#761933}.button--secondary{background:#fff;color:#344054}.button--dark{background:#17202a;border-color:#17202a;color:#fff;white-space:nowrap}
.metric-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:13px;margin-bottom:18px}.metric-grid--student{grid-template-columns:repeat(3,1fr)}.metric-card{position:relative;min-height:145px;padding:20px;background:#fff;border:1px solid var(--border);border-radius:12px;color:var(--text);text-decoration:none;box-shadow:0 4px 14px rgba(15,23,42,.025);transition:.18s}.metric-card:hover{transform:translateY(-2px);border-color:#ccd3dc;box-shadow:0 10px 25px rgba(15,23,42,.06)}.metric-card--alert{border-left:3px solid var(--wine)}.metric-label{display:block;color:var(--muted);font-size:.69rem;font-weight:700}.metric-card>strong{display:block;margin:10px 0 2px;font-size:2rem;line-height:1;letter-spacing:-.04em}.metric-card small{color:#98a2b3;font-size:.65rem}.metric-card i{position:absolute;right:18px;bottom:17px;color:#98a2b3;font-style:normal}
.dashboard-grid{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(260px,.72fr);gap:16px}.dashboard-grid--lower{margin-top:16px}.panel{min-width:0;padding:22px;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:0 4px 14px rgba(15,23,42,.025)}.panel-heading{min-height:42px;display:flex;align-items:flex-start;justify-content:space-between;gap:15px;margin-bottom:18px}.panel-heading h2{margin:4px 0 0;font-size:1.04rem;letter-spacing:-.025em}.panel-heading>a{color:#7a2641;text-decoration:none;font-size:.68rem;font-weight:750}
.next-lesson{min-height:180px;padding:24px;display:grid;grid-template-columns:auto 1fr auto;gap:22px;align-items:center;border-radius:11px;background:linear-gradient(135deg,#f7f8fa,#f1f3f5);border:1px solid #e2e6eb}.lesson-index{width:58px;height:58px;display:grid;place-items:center;border-radius:12px;background:#17202a;color:#fff;font-size:1.1rem;font-weight:800}.next-lesson__body>span{color:#9b7516;font-size:.66rem;font-weight:800;text-transform:uppercase}.next-lesson__body h3{margin:6px 0 7px;font-size:1.35rem}.next-lesson__body p{margin:0;color:var(--muted);font-size:.77rem;line-height:1.6;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.attention-item{display:flex;gap:11px;padding:13px 0;border-bottom:1px solid #eef0f2}.attention-item:last-child{border-bottom:0}.attention-dot{width:9px;height:9px;margin-top:4px;border-radius:50%}.attention-dot--wine{background:#8b1e3f}.attention-dot--gold{background:#c99e2d}.attention-dot--green{background:#3fb375}.attention-item strong,.attention-item small{display:block}.attention-item strong{font-size:.73rem}.attention-item small{margin-top:3px;color:#98a2b3;font-size:.64rem;line-height:1.4}
.activity-list{border:1px solid #e7eaee;border-radius:10px;overflow:hidden}.activity-row{min-height:68px;padding:10px 13px;display:flex;align-items:center;gap:12px;border-bottom:1px solid #edf0f2}.activity-row:last-child{border-bottom:0}.activity-number{width:34px;height:34px;display:grid;place-items:center;border-radius:8px;background:#f1f3f5;color:#475467;font-size:.69rem;font-weight:800}.activity-number--task{background:#f8f0f3;color:#8b1e3f}.activity-copy{min-width:0;flex:1}.activity-copy strong,.activity-copy span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.activity-copy strong{font-size:.73rem}.activity-copy span{margin-top:3px;color:#98a2b3;font-size:.62rem}.activity-value{text-align:right}.activity-value strong,.activity-value span{display:block}.activity-value strong{font-size:.76rem}.activity-value span{color:#98a2b3;font-size:.6rem}.row-link{color:#7a2641;text-decoration:none;font-size:.66rem;font-weight:800}.quick-panel{display:flex;flex-direction:column}.quick-panel .panel-heading{margin-bottom:8px}.quick-panel>a{min-height:45px;padding:0 3px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #edf0f2;color:#344054;text-decoration:none;font-size:.71rem;font-weight:650}.quick-panel>a:last-child{border:0}.quick-panel b{color:#98a2b3}
.progress-row{margin:14px 0}.progress-row>div:first-child{display:flex;justify-content:space-between;color:#667085;font-size:.65rem}.progress-row strong{color:#344054}.progress-track{height:6px;margin-top:6px;border-radius:999px;background:#edf0f2;overflow:hidden}.progress-track i{display:block;height:100%;border-radius:inherit;background:#8b1e3f}.latest-panel{text-align:center}.latest-panel .panel-heading{text-align:left}.grade-circle{width:76px;height:76px;margin:10px auto 14px;display:grid;place-items:center;border:7px solid #edf0f2;border-top-color:#b68b19;border-radius:50%;font-size:1.25rem;font-weight:800}.latest-panel>strong,.latest-panel>span{display:block}.latest-panel>strong{font-size:.8rem}.latest-panel>span{margin:4px 0 13px;color:#98a2b3;font-size:.64rem}.latest-panel>a{color:#7a2641;text-decoration:none;font-size:.67rem;font-weight:800}
.empty-state{padding:35px;text-align:center;border:1px dashed #d7dce3;border-radius:10px;background:#fafbfc}.empty-state strong{display:block;font-size:.82rem}.empty-state p{margin:6px 0 12px;color:#98a2b3;font-size:.68rem}.empty-state a{color:#7a2641;font-size:.7rem;font-weight:800;text-decoration:none}.empty-state--success{background:#f5fbf7}.empty-inline{padding:24px 10px;color:#98a2b3;text-align:center;font-size:.7rem}.state-card{min-height:160px;padding:24px;display:flex;align-items:center;gap:16px;background:#fff;border:1px solid var(--border);border-radius:12px}.state-card p{margin:4px 0 0;color:#98a2b3;font-size:.75rem}.state-card button{margin-top:9px;padding:7px 11px;border:0;border-radius:7px;background:#8b1e3f;color:#fff}.state-spinner{width:25px;height:25px;border:2px solid #e2e6eb;border-top-color:#8b1e3f;border-radius:50%;animation:dashspin .8s linear infinite}.state-icon{width:35px;height:35px;display:grid;place-items:center;border-radius:50%;background:#fef2f2;color:#991b1b;font-weight:800}@keyframes dashspin{to{transform:rotate(360deg)}}
@media(max-width:1100px){.metric-grid{grid-template-columns:repeat(2,1fr)}.dashboard-grid{grid-template-columns:1fr}.attention-panel,.quick-panel,.progress-panel,.latest-panel{min-height:auto}}
@media(max-width:680px){.page-hero{display:block}.hero-actions{margin-top:17px}.hero-actions .button{flex:1}.metric-grid,.metric-grid--student{grid-template-columns:1fr 1fr}.metric-card{min-height:125px;padding:16px}.next-lesson{grid-template-columns:auto 1fr;padding:18px;gap:14px}.next-lesson .button{grid-column:1/-1}.lesson-index{width:45px;height:45px}.panel{padding:16px}.metric-card>strong{font-size:1.7rem}}
@media(max-width:420px){.metric-grid,.metric-grid--student{grid-template-columns:1fr}.page-hero h1{font-size:2rem}.metric-card{min-height:112px}.activity-value{display:none}}
</style>