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

      <section class="dashboard-focus" :class="{ 'dashboard-focus--clear': !primaryAction }">
          <div class="dashboard-focus__icon">{{ primaryAction ? '→' : '✓' }}</div>
          <div class="dashboard-focus__copy">
            <span>{{ isTeacher ? 'PRIORIDAD DOCENTE' : 'SIGUIENTE PASO' }}</span>
            <strong>{{ primaryAction?.title || (isTeacher ? 'El aula está al día' : 'Estás al día') }}</strong>
            <p>{{ primaryAction?.description || (isTeacher ? 'No hay entregas pendientes de revisión en este momento.' : 'No tienes tareas pendientes registradas en este momento.') }}</p>
          </div>
          <RouterLink v-if="primaryAction" :to="primaryAction.to" class="dashboard-focus__action">
            {{ primaryAction.label }}
          </RouterLink>
        </section>

        <nav class="dashboard-context-nav" aria-label="Secciones del dashboard">

        <button type="button" :class="{ 'is-active': isDashboardTab('resumen') }" @click="setDashboardTab('resumen')"><span>01</span> Resumen</button>

        <button type="button" :class="{ 'is-active': isDashboardTab('academico') }" @click="setDashboardTab('academico')"><span>02</span> Académico</button>

        <button type="button" :class="{ 'is-active': isDashboardTab('seguimiento') }" @click="setDashboardTab('seguimiento')"><span>03</span> Seguimiento</button>

        <button type="button" :class="{ 'is-active': isDashboardTab('accesos') }" @click="setDashboardTab('accesos')"><span>04</span> Accesos</button>

      </nav>

      <section v-show="isDashboardTab('accesos')" class="dashboard-access-center">

        <header>

          <span>ACCESOS RÁPIDOS</span>

          <h2>{{ isTeacher ? 'Gestión del aula' : 'Mi espacio académico' }}</h2>

          <p>{{ isTeacher ? 'Entra directamente a las áreas principales de administración y seguimiento.' : 'Accede rápidamente a tus clases, tareas, evaluaciones y recursos.' }}</p>

        </header>

        <div class="dashboard-access-center__grid">

          <template v-if="isTeacher">

            <RouterLink to="/aula/programa-formativo"><span>Programa formativo</span><b>Clases y unidades →</b></RouterLink>

            <RouterLink to="/aula/alumnos"><span>Estudiantes</span><b>Directorio académico →</b></RouterLink>

            <RouterLink to="/aula/asistencia"><span>Asistencia</span><b>Registro y seguimiento →</b></RouterLink>

            <RouterLink to="/aula/calificaciones"><span>Libro de notas</span><b>Resultados y ponderaciones →</b></RouterLink>

            <RouterLink to="/aula/recursos"><span>Biblioteca</span><b>Material académico →</b></RouterLink>

            <RouterLink to="/aula/inscripciones"><span>Inscripciones</span><b>Gestión de postulantes →</b></RouterLink>

          </template>

          <template v-else>

            <RouterLink to="/aula/programa-formativo"><span>Programa formativo</span><b>Continuar aprendiendo →</b></RouterLink>

            <RouterLink to="/aula/mis-tareas"><span>Mis tareas</span><b>Pendientes y entregas →</b></RouterLink>

            <RouterLink to="/aula/evaluaciones"><span>Mis evaluaciones</span><b>Resultados y progreso →</b></RouterLink>

            <RouterLink to="/aula/asistencia"><span>Mi asistencia</span><b>Revisar registros →</b></RouterLink>

            <RouterLink to="/aula/recursos"><span>Biblioteca</span><b>Material de estudio →</b></RouterLink>

          </template>

        </div>

      </section>

      <template v-if="isTeacher">

        <section v-show="isDashboardTab('resumen')" class="command-overview">

          <div class="command-overview__intro"><span>CENTRO DE CONTROL DOCENTE</span><h2>Lo importante del aula, en una sola vista</h2><p>Supervisa estudiantes, clases, asistencia y entregas que requieren revisión.</p></div>

          <div class="command-overview__cards">

            <button type="button" @click="setDashboardTab('academico')"><span>PROGRAMA</span><strong>{{ lessons.length }}</strong><small>clases organizadas</small><b>Ver académico →</b></button>

            <button type="button" @click="setDashboardTab('seguimiento')"><span>POR REVISAR</span><strong>{{ pendingReviewCount }}</strong><small>entregas pendientes</small><b>Ir a seguimiento →</b></button>

            <RouterLink to="/aula/alumnos"><span>ESTUDIANTES</span><strong>{{ students.length }}</strong><small>matriculados</small><b>Abrir directorio →</b></RouterLink>

            <RouterLink to="/aula/asistencia"><span>ASISTENCIA</span><strong>{{ generalAttendancePercentage }}%</strong><small>promedio registrado</small><b>Gestionar →</b></RouterLink>

          </div>

        </section>

        <section class="panel recent-activity dashboard-summary-activity">
  <div class="panel-heading"><div><span>ACTIVIDAD RECIENTE</span><h2>Movimiento del aula</h2></div></div>
  <div v-if="teacherRecentActivity.length" class="activity-feed">
    <RouterLink v-for="item in teacherRecentActivity" :key="item.key" :to="item.to" class="activity-row">
      <span class="activity-icon" :class="`activity-icon--${item.tone}`">{{ item.icon }}</span>
      <span class="activity-copy"><strong>{{ item.title }}</strong><small>{{ item.description }}</small></span>
      <time>{{ item.when }}</time><b>→</b>
    </RouterLink>
  </div>
  <div v-else class="activity-empty"><strong>Aún no hay movimientos recientes.</strong><small>Las entregas del curso aparecerán aquí automáticamente.</small></div>
</section>

          <section v-show="isDashboardTab('resumen')" class="metric-grid dashboard-legacy-metrics">

          <RouterLink to="/aula/alumnos" class="metric-card"><span class="metric-label">Estudiantes</span><strong>{{ students.length }}</strong><small>Matriculados en el aula</small><i>→</i></RouterLink>

          <RouterLink to="/aula/programa-formativo" class="metric-card"><span class="metric-label">Clases</span><strong>{{ lessons.length }}</strong><small>En el programa formativo</small><i>→</i></RouterLink>

          <RouterLink to="/aula/asistencia" class="metric-card"><span class="metric-label">Asistencia</span><strong>{{ generalAttendancePercentage }}%</strong><small>Promedio general registrado</small><i>→</i></RouterLink>

          <RouterLink to="/aula/calificaciones" class="metric-card" :class="{ 'metric-card--alert': pendingReviewCount > 0 }"><span class="metric-label">Por revisar</span><strong>{{ pendingReviewCount }}</strong><small>Entregas requieren atención</small><i>→</i></RouterLink>

        </section>

        <div class="dashboard-grid" v-show="isDashboardTab('academico')">

          <section class="panel panel--wide">

            <div class="panel-heading"><div><span>PRÓXIMO</span><h2>Clase del programa</h2></div><RouterLink to="/aula/programa-formativo">Ver programa →</RouterLink></div>

            <article
                v-if="nextLesson"
                class="next-lesson"
                :class="{ 'next-lesson--with-cover': nextLessonCoverUrl }"
                :style="nextLessonCoverStyle"
              >
                <div
                  v-if="nextLessonCoverUrl"
                  class="next-lesson__wallpaper"
                  aria-hidden="true"
                ></div>

              <div class="lesson-index">{{ String(getAcademicLessonNumber(nextLesson)).padStart(2,'0') }}</div>

              <div class="next-lesson__body"><span>{{ formatLessonDate(nextLesson.date) }}</span><h3>{{ cleanLessonTitle(nextLesson.title) }}</h3><p>{{ nextLesson.description || 'Clase programada en el Aula Virtual.' }}</p></div>

              <RouterLink :to="`/aula/clase/${nextLesson.id}`" class="button button--dark">Abrir clase →</RouterLink>

            </article>

            <div v-else class="empty-state"><strong>Aún no hay clases publicadas</strong><p>Crea la primera clase para comenzar a organizar el programa.</p><RouterLink to="/aula/clases/nueva">Crear clase</RouterLink></div>

          </section>

          <aside class="panel attention-panel academic-progress">
            <div class="panel-heading">
              <div><span>ESTADO ACADÉMICO</span><h2>Estado del curso</h2></div>
              <RouterLink to="/aula/calificaciones">Libro de notas →</RouterLink>
            </div>

            <div class="teacher-academic-score">
              <div><span>PROMEDIO ACTUAL</span><strong>{{ teacherAcademicAverageGrade }}</strong><small>entre estudiantes con resultados</small></div>
              <div><span>CON RESULTADOS</span><strong>{{ teacherEvaluatedStudents }}/{{ students.length }}</strong><small>estudiantes evaluados</small></div>
            </div>

            <div class="attention-item"><span class="attention-dot attention-dot--wine"></span><div><strong>{{ pendingReviewCount }} entregas pendientes</strong><small>Requieren revisión y retroalimentación.</small></div></div>
            <div class="attention-item"><span class="attention-dot attention-dot--gold"></span><div><strong>{{ configuredAcademicWeight }}% ponderación configurada</strong><small>Distribución académica activa.</small></div></div>
            <div class="attention-item"><span class="attention-dot attention-dot--green"></span><div><strong>{{ generalAttendancePercentage }}% asistencia</strong><small>Promedio de registros disponibles.</small></div></div>

            <p v-if="academicProgressWarning" class="academic-warning">{{ academicProgressWarning }}</p>
          </aside>

        </div>

        <div class="dashboard-grid dashboard-grid--lower" v-show="isDashboardTab('seguimiento')">

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

        <section v-show="isDashboardTab('resumen')" class="command-overview">

          <div class="command-overview__intro"><span>MI CENTRO ACADÉMICO</span><h2>Tu avance, tus pendientes y tu próxima clase</h2><p>Continúa tu formación desde un resumen claro de lo que necesita tu atención.</p></div>

          <div class="command-overview__cards command-overview__cards--student">

            <button type="button" @click="setDashboardTab('academico')"><span>PRÓXIMA CLASE</span><strong>{{ nextLesson ? String(getAcademicLessonNumber(nextLesson)).padStart(2,'0') : '—' }}</strong><small>continuar programa</small><b>Ver académico →</b></button>

            <RouterLink to="/aula/mis-tareas"><span>PENDIENTES</span><strong>{{ studentPendingTasks.length }}</strong><small>tareas por completar</small><b>Ver mis tareas →</b></RouterLink>

            <button type="button" @click="setDashboardTab('seguimiento')"><span>ASISTENCIA</span><strong>{{ studentAttendancePercentage }}%</strong><small>{{ studentPresentCount }} presentes</small><b>Ver seguimiento →</b></button>

          </div>

        </section>



        <section v-show="isDashboardTab('resumen')" class="metric-grid metric-grid--student">

          <RouterLink to="/aula/mis-tareas" class="metric-card"><span class="metric-label">Pendientes</span><strong>{{ studentPendingTasks.length }}</strong><small>Tareas por completar</small><i>→</i></RouterLink>

          <RouterLink to="/aula/asistencia" class="metric-card"><span class="metric-label">Mi asistencia</span><strong>{{ studentAttendancePercentage }}%</strong><small>{{ studentPresentCount }} de {{ studentAttendanceRegistered }} registros presentes</small><i>→</i></RouterLink>

          <RouterLink to="/aula/evaluaciones" class="metric-card"><span class="metric-label">Promedio</span><strong>{{ studentAverageGrade }}</strong><small>En entregas calificadas</small><i>→</i></RouterLink>

        </section>

        <div class="dashboard-grid" v-show="isDashboardTab('academico')">

          <section class="panel panel--wide">

            <div class="panel-heading"><div><span>CONTINÚA APRENDIENDO</span><h2>Próxima clase</h2></div><RouterLink to="/aula/programa-formativo">Ver programa →</RouterLink></div>

            <article
                v-if="nextLesson"
                class="next-lesson"
                :class="{ 'next-lesson--with-cover': nextLessonCoverUrl }"
                :style="nextLessonCoverStyle"
              >
                <div
                  v-if="nextLessonCoverUrl"
                  class="next-lesson__wallpaper"
                  aria-hidden="true"
                ></div>

              <div class="lesson-index">{{ String(getAcademicLessonNumber(nextLesson)).padStart(2,'0') }}</div>

              <div class="next-lesson__body"><span>{{ formatLessonDate(nextLesson.date) }}</span><h3>{{ cleanLessonTitle(nextLesson.title) }}</h3><p>{{ nextLesson.description || 'Continúa avanzando en tu programa formativo.' }}</p></div>

              <RouterLink :to="`/aula/clase/${nextLesson.id}`" class="button button--dark">Entrar a la clase →</RouterLink>

            </article>

          </section>

          <aside class="panel progress-panel academic-progress">
            <div class="panel-heading">
              <div><span>MI PROGRESO</span><h2>Progreso académico</h2></div>
              <RouterLink to="/aula/evaluaciones">Ver resultados →</RouterLink>
            </div>

            <div class="academic-score">
              <div>
                <span>RESULTADO ACTUAL</span>
                <strong>{{ studentAcademicGrade }}</strong>
                <small>Nota ponderada · escala 1–7</small>
              </div>
              <div class="academic-score__percentage">
                <strong>{{ studentAcademicPercentage === null ? '—' : `${studentAcademicPercentage}%` }}</strong>
                <span>resultado</span>
              </div>
            </div>

            <div class="academic-evaluated">
              <div>
                <span>Programa evaluado</span>
                <strong>{{ studentEvaluatedWeight }}%</strong>
              </div>
              <div class="academic-track">
                <i :style="{ width: `${Math.min(100, studentEvaluatedWeight)}%` }"></i>
              </div>
              <small>No representa avance de contenidos; indica cuánto peso académico ya tiene resultados.</small>
            </div>

            <div class="academic-mini-grid">
              <div><span>Tareas</span><strong>{{ studentCompletedAssignments }}/{{ assignments.length }}</strong><small>con entrega</small></div>
              <div><span>Evaluaciones</span><strong>{{ studentCompletedQuizCount }}/{{ quizzes.length }}</strong><small>realizadas</small></div>
              <div><span>Asistencia</span><strong>{{ studentAttendancePercentage }}%</strong><small>{{ studentPresentCount }} presentes</small></div>
            </div>

            <p v-if="academicProgressWarning" class="academic-warning">{{ academicProgressWarning }}</p>
          </aside>

        </div>

        <div class="dashboard-grid dashboard-grid--lower" v-show="isDashboardTab('seguimiento')">

          <section class="panel panel--wide">

            <div class="panel-heading"><div><span>PENDIENTES</span><h2>Mis próximas tareas</h2></div><RouterLink to="/aula/mis-tareas">Ver todas →</RouterLink></div>

            <div v-if="studentPendingTasks.length" class="activity-list">

              <article v-for="row in studentPendingTasks.slice(0,5)" :key="row.task.id" class="activity-row">

                <div class="activity-number activity-number--task">✓</div>

                <div class="activity-copy">
                  <strong>{{ row.task.title || 'Tarea' }}</strong>
                  <span>
                    Clase {{ getAcademicLessonNumberById(row.task.lessonId) }}
                    · {{ row.deadline?.label || 'Pendiente' }}
                    <template v-if="row.task.dueDate || row.task.due_date">
                      · {{ formatAssignmentDeadline(row.task.dueDate ?? row.task.due_date) }}
                    </template>
                  </span>
                </div>

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
import { getLessonAppearance } from '@/services/lessonAppearanceService'
import { fetchQuizzes } from '@/services/quizService'
import { fetchMyEvaluationAttempts } from '@/services/evaluationHistoryService'
import { fetchTeacherQuizAttempts } from '@/services/teacherEvaluationService'
import {
  fetchGradingConfiguration,
  percentageToChileanGrade,
  normalizeResultToPercentage,
  calculateWeightedResult
} from '@/services/gradingService'



const {

  currentUser,

  isTeacher

} = useAuth()



const lessons = ref([])

const assignments = ref([])

const submissions = ref([])

const attendance = ref([])

const students = ref([])
const quizzes = ref([])
const quizAttempts = ref([])
const gradingConfiguration = ref({
  settings: {
    gradingScale: 'chilean_1_7',
    minimumGrade: 1,
    maximumGrade: 7,
    passingGrade: 4,
    exigencyPercentage: 60,
    decimals: 1,
    useWeights: true
  },
  categories: []
})
const academicProgressWarning = ref('')

const isLoading = ref(true)

const loadError = ref('')



const activeDashboardTab = ref('resumen')

const isDashboardTab = tab => activeDashboardTab.value === tab

const setDashboardTab = tab => { activeDashboardTab.value = tab }





const loadDashboard = async () => {
  isLoading.value = true
  loadError.value = ''
  academicProgressWarning.value = ''

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

    lessons.value = loadedLessons || []
    assignments.value = isTeacher.value
      ? loadedAssignments || []
      : (loadedAssignments || []).filter(
          assignment => assignment.status !== 'draft'
        )
    submissions.value = loadedSubmissions || []
    attendance.value = loadedAttendance || []
    students.value = loadedStudents || []

    const [quizResult, gradingResult] = await Promise.allSettled([
      fetchQuizzes(),
      fetchGradingConfiguration()
    ])

    quizzes.value = quizResult.status === 'fulfilled'
      ? (quizResult.value || []).filter(quiz => quiz.status !== 'draft')
      : []

    if (gradingResult.status === 'fulfilled') {
      gradingConfiguration.value = gradingResult.value || gradingConfiguration.value
    } else {
      academicProgressWarning.value =
        'No fue posible cargar la configuración de ponderaciones.'
    }

    try {
      if (isTeacher.value) {
        const groups = await Promise.all(
          quizzes.value.map(async quiz => {
            try {
              return await fetchTeacherQuizAttempts(quiz.id)
            } catch {
              return []
            }
          })
        )
        quizAttempts.value = groups.flat()
      } else {
        quizAttempts.value = await fetchMyEvaluationAttempts()
      }
    } catch (error) {
      console.error('No fue posible cargar historial de evaluaciones:', error)
      quizAttempts.value = []
    }
  } catch (error) {
    console.error('Error cargando Dashboard:', error)
    lessons.value = []
    assignments.value = []
    submissions.value = []
    attendance.value = []
    students.value = []
    quizzes.value = []
    quizAttempts.value = []
    loadError.value =
      error?.message ||
      'No se pudo cargar la información del Aula Virtual.'
  } finally {
    isLoading.value = false
  }
}

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

const getLessonDate = lesson => {

  const rawDate =

    String(

      lesson?.date || ''

    ).trim()

  if (!rawDate) {

    return null

  }

  

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
   WALLPAPER REAL DE LA PRÓXIMA CLASE
   Mismo contrato usado por CourseHubView.
========================================================= */
const lessonCoverUrl = lesson => {
  if (!lesson) return ''

  const direct =
    lesson.cover_url ||
    lesson.coverUrl ||
    lesson.cover ||
    lesson.image_url ||
    lesson.imageUrl ||
    lesson.thumbnail_url ||
    lesson.thumbnailUrl ||
    ''

  if (direct) return direct

  const appearance = getLessonAppearance(lesson.id)
  return appearance?.coverUrl || ''
}

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

    return (

      orderedLessons.value[

        orderedLessons.value.length - 1

      ] ||

      null

    )

  })



const nextLessonCoverUrl = computed(() =>
  lessonCoverUrl(nextLesson.value)
)

const nextLessonCoverStyle = computed(() =>
  nextLessonCoverUrl.value
    ? { '--next-cover': `url("${nextLessonCoverUrl.value}")` }
    : {}
)

const validAttendance =

  computed(() => {

    return attendance.value.filter(

      record =>

        record.status === 'present' ||

        record.status === 'absent' ||

        record.status === 'justified'

    )

  })



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
   DASHBOARD V11.3 · MOTOR DE PROGRESO ACADÉMICO
   Respeta las mismas reglas del Libro de notas:
   tareas 1–7 -> porcentaje; quiz/prueba -> porcentaje;
   categorías sin resultados NO se convierten en cero.
========================================================= */
const gradingSettings = computed(() =>
  gradingConfiguration.value?.settings || {}
)

const gradingCategories = computed(() =>
  (gradingConfiguration.value?.categories || [])
    .filter(category => category.enabled !== false)
)

const configuredAcademicWeight = computed(() =>
  gradingCategories.value.reduce(
    (sum, category) => sum + Number(category.weight || 0),
    0
  )
)

const studentIdFrom = record =>
  Number(
    record?.studentId ??
    record?.student_id ??
    record?.userId ??
    record?.user_id
  )

const quizIdFromAttempt = attempt =>
  Number(attempt?.quizId ?? attempt?.quiz_id)

const completedAcademicAttempts = computed(() =>
  quizAttempts.value.filter(attempt =>
    Number.isFinite(Number(attempt?.percentage))
  )
)

const bestAttemptsForStudent = studentId => {
  const grouped = new Map()

  completedAcademicAttempts.value
    .filter(attempt => studentIdFrom(attempt) === Number(studentId))
    .forEach(attempt => {
      const quizId = quizIdFromAttempt(attempt)
      if (!quizId) return

      const current = grouped.get(quizId)
      if (
        !current ||
        Number(attempt.percentage) > Number(current.percentage)
      ) {
        grouped.set(quizId, attempt)
      }
    })

  return [...grouped.values()]
}

const assessmentTypeOfAttempt = attempt => {
  const quiz = quizzes.value.find(
    item => Number(item.id) === quizIdFromAttempt(attempt)
  )

  return String(
    attempt?.assessmentType ??
    attempt?.assessment_type ??
    quiz?.assessmentType ??
    'quiz'
  ).toLowerCase()
}

const averageAcademicNumbers = values => {
  const valid = values
    .map(Number)
    .filter(Number.isFinite)

  if (!valid.length) return null

  return valid.reduce((sum, value) => sum + value, 0) / valid.length
}

const assignmentPercentagesForStudent = studentId =>
  submissions.value
    .filter(submission =>
      studentIdFrom(submission) === Number(studentId) &&
      Number.isFinite(Number(submission?.grade))
    )
    .map(submission =>
      normalizeResultToPercentage(
        Number(submission.grade),
        'chilean_1_7',
        gradingSettings.value
      )
    )
    .filter(Number.isFinite)

const categoryPercentageForStudent = (studentId, category) => {
  const key = String(category?.key || '').toLowerCase()

  if (['assignments', 'tasks', 'tareas'].includes(key)) {
    return averageAcademicNumbers(
      assignmentPercentagesForStudent(studentId)
    )
  }

  const attempts = bestAttemptsForStudent(studentId)

  if (['quiz', 'quizzes'].includes(key)) {
    return averageAcademicNumbers(
      attempts
        .filter(attempt => assessmentTypeOfAttempt(attempt) === 'quiz')
        .map(attempt => attempt.percentage)
    )
  }

  if (['test', 'tests', 'pruebas'].includes(key)) {
    return averageAcademicNumbers(
      attempts
        .filter(attempt => assessmentTypeOfAttempt(attempt) === 'test')
        .map(attempt => attempt.percentage)
    )
  }

  return null
}

const buildAcademicSummary = studentId => {
  const categoryResults = {}

  const details = gradingCategories.value.map(category => {
    const percentage = categoryPercentageForStudent(studentId, category)
    const evaluated = Number.isFinite(Number(percentage))

    if (evaluated) {
      categoryResults[category.key] = Number(percentage)
    }

    return {
      ...category,
      evaluated,
      percentage: evaluated ? Number(percentage) : null
    }
  })

  const evaluatedWeight = details
    .filter(item => item.evaluated)
    .reduce((sum, item) => sum + Number(item.weight || 0), 0)

  const currentPercentage = calculateWeightedResult(
    categoryResults,
    gradingCategories.value
  )

  const currentGrade = Number.isFinite(Number(currentPercentage))
    ? percentageToChileanGrade(
        Number(currentPercentage),
        gradingSettings.value
      )
    : null

  return {
    details,
    evaluatedWeight,
    pendingWeight: Math.max(
      0,
      configuredAcademicWeight.value - evaluatedWeight
    ),
    currentPercentage,
    currentGrade
  }
}

const studentAcademicSummary = computed(() => {
  if (!currentUser.value) return null
  return buildAcademicSummary(currentUser.value.id)
})

const studentAcademicGrade = computed(() => {
  const grade = Number(studentAcademicSummary.value?.currentGrade)
  return Number.isFinite(grade) ? grade.toFixed(1) : '—'
})

const studentAcademicPercentage = computed(() => {
  const value = Number(studentAcademicSummary.value?.currentPercentage)
  return Number.isFinite(value) ? Math.round(value) : null
})

const studentEvaluatedWeight = computed(() =>
  Math.round(Number(studentAcademicSummary.value?.evaluatedWeight || 0))
)

const studentCompletedAssignments = computed(() =>
  studentTaskRows.value.filter(row => row.submission).length
)

const studentCompletedQuizCount = computed(() =>
  new Set(
    bestAttemptsForStudent(currentUser.value?.id)
      .map(attempt => quizIdFromAttempt(attempt))
      .filter(Boolean)
  ).size
)

const teacherAcademicRows = computed(() =>
  students.value.map(student => ({
    student,
    ...buildAcademicSummary(student.id)
  }))
)

const teacherEvaluatedStudents = computed(() =>
  teacherAcademicRows.value.filter(row => row.evaluatedWeight > 0).length
)

const teacherAcademicAverageGrade = computed(() => {
  const grades = teacherAcademicRows.value
    .map(row => Number(row.currentGrade))
    .filter(Number.isFinite)

  if (!grades.length) return '—'

  return (
    grades.reduce((sum, grade) => sum + grade, 0) / grades.length
  ).toFixed(1)
})

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
   DASHBOARD V11.6 · SMART DEADLINES
   Misma semántica académica usada por Mis tareas.
   Zona horaria oficial: America/Santiago.
========================================================= */
const ACADEMIC_TIME_ZONE = 'America/Santiago'

const chileDateParts = value => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: ACADEMIC_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date)

  const get = type => Number(parts.find(part => part.type === type)?.value)
  const year = get('year')
  const month = get('month')
  const day = get('day')

  if (!year || !month || !day) return null
  return { year, month, day }
}

const academicDayNumber = value => {
  const parts = chileDateParts(value)
  if (!parts) return null
  return Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / 86400000)
}

const parseDueDate = value => {
  if (!value) return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

const getDeadlineState = task => {
  const due = parseDueDate(task?.dueDate ?? task?.due_date)
  if (!due) {
    return {
      key: 'no-date',
      label: 'Sin fecha límite',
      tone: 'neutral',
      priority: 5,
      timestamp: Number.POSITIVE_INFINITY
    }
  }

  const now = new Date()
  const today = academicDayNumber(now)
  const dueDay = academicDayNumber(due)

  if (due.getTime() <= now.getTime()) {
    return {
      key: 'overdue',
      label: 'Atrasada',
      tone: 'danger',
      priority: 0,
      timestamp: due.getTime()
    }
  }

  const difference = dueDay - today

  if (difference === 0) {
    return {
      key: 'today',
      label: 'Vence hoy',
      tone: 'danger',
      priority: 1,
      timestamp: due.getTime()
    }
  }

  if (difference === 1) {
    return {
      key: 'tomorrow',
      label: 'Vence mañana',
      tone: 'warning',
      priority: 2,
      timestamp: due.getTime()
    }
  }

  return {
    key: 'upcoming',
    label: 'Próxima',
    tone: 'info',
    priority: 3,
    timestamp: due.getTime()
  }
}

const formatAssignmentDeadline = value => {
  const due = parseDueDate(value)
  if (!due) return 'Sin fecha límite'

  return new Intl.DateTimeFormat('es-CL', {
    timeZone: ACADEMIC_TIME_ZONE,
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(due)
}

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

            status,

            deadline: status === 'pending'
              ? getDeadlineState(task)
              : null

          }

        }

      )

  })

const studentPendingTasks =
  computed(() =>
    studentTaskRows.value
      .filter(row => row.status === 'pending')
      .sort((a, b) => {
        const priorityA = a.deadline?.priority ?? 5
        const priorityB = b.deadline?.priority ?? 5
        if (priorityA !== priorityB) return priorityA - priorityB

        const timeA = a.deadline?.timestamp ?? Number.POSITIVE_INFINITY
        const timeB = b.deadline?.timestamp ?? Number.POSITIVE_INFINITY
        return timeA - timeB
      })
  )



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

const primaryAction = computed(() => {
  if (isTeacher.value) {
    const review = pendingReviews.value[0]
    if (review?.task) {
      return {
        title: `${pendingReviewCount.value} entrega${pendingReviewCount.value === 1 ? '' : 's'} por revisar`,
        description: `${review.student?.name || 'Un estudiante'} espera retroalimentación en “${review.task.title || 'una actividad'}”.`,
        to: '/aula/calificaciones',
        label: 'Revisar entregas →'
      }
    }
    if (nextLesson.value) {
      return {
        title: cleanLessonTitle(nextLesson.value.title),
        description: `Próxima clase del programa · ${formatLessonDate(nextLesson.value.date)}.`,
        to: `/aula/clase/${nextLesson.value.id}`,
        label: 'Abrir clase →'
      }
    }
    return null
  }

  const pending = studentPendingTasks.value[0]
  if (pending?.task) {
    const deadline = pending.deadline || getDeadlineState(pending.task)
    const dueValue = pending.task.dueDate ?? pending.task.due_date

    return {
      title: pending.task.title || 'Tarea pendiente',
      description: dueValue
        ? `${deadline.label} · ${formatAssignmentDeadline(dueValue)}.`
        : 'Sin fecha límite · Tienes una actividad pendiente de entrega.',
      to: `/aula/clase/${pending.task.lessonId}/tarea/${pending.task.id}`,
      label: 'Continuar tarea →'
    }
  }

  if (nextLesson.value) {
    return {
      title: cleanLessonTitle(nextLesson.value.title),
      description: `Continúa tu programa · ${formatLessonDate(nextLesson.value.date)}.`,
      to: `/aula/clase/${nextLesson.value.id}`,
      label: 'Continuar clase →'
    }
  }
  return null
})

const greeting = computed(() => {

  const hour = new Date().getHours()

  if (hour < 12) return 'Buenos días'

  if (hour < 20) return 'Buenas tardes'

  return 'Buenas noches'

})




/* DASHBOARD V11.4 · ACTIVIDAD RECIENTE */
const activityTimestamp = record => {
  const raw = record?.gradedAt ?? record?.graded_at ?? record?.submittedAt ??
    record?.submitted_at ?? record?.updatedAt ?? record?.updated_at ??
    record?.createdAt ?? record?.created_at
  if (!raw) return 0
  const value = new Date(raw).getTime()
  return Number.isFinite(value) ? value : 0
}

const activityWhen = timestamp => {
  if (!timestamp) return 'Reciente'
  const days = Math.floor((Date.now() - timestamp) / 86400000)
  if (days <= 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  return new Intl.DateTimeFormat('es-CL', { day:'2-digit', month:'short' })
    .format(new Date(timestamp))
}

const activityAssignment = submission =>
  assignments.value.find(item =>
    Number(item.id) === Number(submission?.assignmentId ?? submission?.assignment_id)
  )

const activityStudentName = id =>
  students.value.find(student => Number(student.id) === Number(id))?.name || 'Estudiante'

const studentRecentActivity = computed(() => {
  const id = Number(currentUser.value?.id)
  return submissions.value
    .filter(item => studentIdFrom(item) === id)
    .map(item => {
      const assignment = activityAssignment(item)
      const timestamp = activityTimestamp(item)
      const graded = Number.isFinite(Number(item?.grade))
      return {
        key:`submission-${item.id}`, timestamp,
        icon: graded ? '★' : '✓', tone: graded ? 'gold' : 'green',
        title: graded ? 'Tarea revisada' : 'Tarea entregada',
        description: graded
          ? `${assignment?.title || 'Actividad'} · Nota ${Number(item.grade).toFixed(1)}`
          : (assignment?.title || 'Actividad'),
        when:activityWhen(timestamp),
        to: assignment ? `/aula/clase/${assignment.lessonId}/tarea/${assignment.id}` : '/aula/tareas'
      }
    })
    .sort((a,b) => b.timestamp-a.timestamp).slice(0,5)
})

const teacherRecentActivity = computed(() =>
  submissions.value.map(item => {
    const assignment = activityAssignment(item)
    const timestamp = activityTimestamp(item)
    const graded = Number.isFinite(Number(item?.grade))
    return {
      key:`teacher-submission-${item.id}`, timestamp,
      icon:graded ? '★' : '✓', tone:graded ? 'gold' : 'green',
      title:graded ? 'Tarea calificada' : 'Nueva entrega',
      description:`${activityStudentName(studentIdFrom(item))} · ${assignment?.title || 'Actividad'}`,
      when:activityWhen(timestamp),
      to: assignment
        ? `/aula/clase/${assignment.lessonId}/tarea/${assignment.id}/entregas/${item.id}`
        : '/aula/calificaciones'
    }
  }).sort((a,b) => b.timestamp-a.timestamp).slice(0,6)
)

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







.saas-dashboard {

  --amv-canvas: #f5f7fb;

  --amv-card: #ffffff;

  --amv-ink: #172033;

  --amv-body: #344359;

  --amv-muted: #667085;

  --amv-line: #dbe3ec;

  --amv-wine: #9f1945;

  --amv-wine-dark: #7f1237;

  --amv-gold: #d9a91d;

  --amv-gold-soft: #fff8e7;

  --amv-green: #2d8a63;

  --amv-red: #be4856;

  --amv-shadow-sm: 0 8px 24px rgba(23, 32, 51, .055);

  --amv-shadow-md: 0 18px 46px rgba(23, 32, 51, .085);

  --amv-radius-sm: 12px;

  --amv-radius-md: 18px;

  --amv-radius-lg: 24px;

  text-rendering: optimizeLegibility;

  -webkit-font-smoothing: antialiased;

}

.saas-dashboard :where(a, button, input, textarea, select, [role="button"]) {

  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;

}

.saas-dashboard :where(a, button, input, textarea, select, [role="button"]):focus-visible {

  outline: 3px solid rgba(159, 25, 69, .22) !important;

  outline-offset: 3px;

}

.saas-dashboard :where(button, [role="button"], .button, .btn):not(:disabled):active {

  transform: translateY(1px) scale(.99);

}

.saas-dashboard :where(input, textarea, select) {

  font-size: max(16px, 1em);

}

.saas-dashboard :where(table tbody tr) {

  transition: background-color .18s ease;

}

.saas-dashboard :where(table tbody tr):hover {

  background-color: rgba(159, 25, 69, .025);

}

.saas-dashboard :where(.card, [class*="-card"], [class*="__card"]) {

  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;

}

.saas-dashboard :where(.card, [class*="-card"], [class*="__card"]):hover {

  border-color: rgba(159, 25, 69, .16);

}

@media (prefers-reduced-motion: reduce) {

  .saas-dashboard *, .saas-dashboard *::before, .saas-dashboard *::after {

    scroll-behavior: auto !important;

    animation-duration: .01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: .01ms !important;

  }

}







.saas-dashboard {

  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;

}

.saas-dashboard :where(

  article,

  [class$="__card"],

  [class*="-card"],

  [class*="_card"]

) {

  transition:

    transform .24s cubic-bezier(.2,.75,.25,1),

    box-shadow .24s ease,

    border-color .24s ease,

    background-color .24s ease;

}

@media (hover: hover) and (pointer: fine) {

  .saas-dashboard :where(

    article,

    [class$="__card"],

    [class*="-card"],

    [class*="_card"]

  ):hover {

    transform: translateY(-2px);

  }

  .saas-dashboard :where(

    button,

    .button,

    .btn,

    a[class*="button"],

    a[class*="cta"]

  ):not(:disabled):hover {

    transform: translateY(-2px);

    filter: saturate(1.04);

  }

  .saas-dashboard :where(img) {

    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;

  }

  .saas-dashboard :where(

    [class*="cover"],

    [class*="hero"],

    [class*="visual"],

    [class*="gallery"]

  ):hover img {

    transform: scale(1.018);

  }

}

.saas-dashboard :where(

  button,

  .button,

  .btn,

  a[class*="button"],

  a[class*="cta"]

) {

  will-change: transform;

}

.saas-dashboard :where(input, textarea, select):focus {

  transform: translateY(-1px);

}

.saas-dashboard :where(

  [class*="progress"] > *,

  [class*="bar"] > *,

  progress

) {

  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;

}

.saas-dashboard ::selection {

  color: #ffffff;

  background: #9f1945;

}

@keyframes amvViewEnter {

  from {

    opacity: 0;

    transform: translateY(8px);

  }

  to {

    opacity: 1;

    transform: translateY(0);

  }

}

@media (prefers-reduced-motion: reduce) {

  .saas-dashboard,

  .saas-dashboard *,

  .saas-dashboard *::before,

  .saas-dashboard *::after {

    animation-duration: .01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: .01ms !important;

    scroll-behavior: auto !important;

  }

}





.dashboard-context-nav{position:sticky;top:14px;z-index:35;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px;margin:0 0 25px;padding:7px;border:1px solid #dbe3ec;border-radius:18px;background:rgba(255,255,255,.95);box-shadow:0 14px 36px rgba(20,32,51,.08);backdrop-filter:blur(16px)}

.dashboard-context-nav button{min-height:58px;display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:13px;background:transparent;color:#536176;font:inherit;font-weight:850;cursor:pointer}

.dashboard-context-nav button span{display:grid;width:25px;height:25px;place-items:center;border-radius:8px;background:#f2f5f8;color:#7a8798;font-size:10px}

.dashboard-context-nav button:hover{background:#faf7f8;color:#9f1945;transform:translateY(-1px)}

.dashboard-context-nav button.is-active{background:#9f1945;color:#fff;box-shadow:0 9px 22px rgba(159,25,69,.20)}

.dashboard-context-nav button.is-active span{background:rgba(255,255,255,.16);color:#fff}

.command-overview,.dashboard-access-center{margin-bottom:20px;padding:clamp(22px,3vw,31px);border:1px solid #dbe3ec;border-radius:24px;background:#fff;box-shadow:0 16px 44px rgba(20,32,51,.07);animation:dashPanelIn .35s cubic-bezier(.2,.75,.25,1)}

.command-overview__intro,.dashboard-access-center>header{padding-bottom:19px;border-bottom:1px solid #e5eaf0}

.command-overview__intro span,.dashboard-access-center>header span{color:#9f1945;font-size:11px;font-weight:900;letter-spacing:.12em}

.command-overview__intro h2,.dashboard-access-center>header h2{margin:6px 0;color:#172033;font-size:clamp(24px,3vw,34px)}

.command-overview__intro p,.dashboard-access-center>header p{max-width:720px;margin:0;color:#667085;line-height:1.6}

.command-overview__cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px;margin-top:20px}.command-overview__cards--student{grid-template-columns:repeat(3,minmax(0,1fr))}

.command-overview__cards>a,.command-overview__cards>button{min-height:164px;display:flex;flex-direction:column;align-items:flex-start;padding:19px;border:1px solid #dbe3ec;border-radius:18px;background:#f8fafc;color:#172033;text-align:left;text-decoration:none;font:inherit;cursor:pointer}

.command-overview__cards>a:hover,.command-overview__cards>button:hover{transform:translateY(-3px);border-color:rgba(159,25,69,.28);background:#fff;box-shadow:0 13px 28px rgba(20,32,51,.08)}

.command-overview__cards span{color:#9f1945;font-size:11px;font-weight:900;letter-spacing:.09em}.command-overview__cards strong{margin:9px 0 3px;font-size:34px}.command-overview__cards small{color:#667085}.command-overview__cards b{margin-top:auto;padding-top:15px;color:#9f1945;font-size:13px}

.dashboard-access-center__grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:13px;margin-top:20px}.dashboard-access-center__grid>a{min-height:112px;display:flex;flex-direction:column;justify-content:space-between;padding:18px;border:1px solid #dbe3ec;border-radius:16px;background:#f8fafc;color:#172033;text-decoration:none}.dashboard-access-center__grid>a:hover{transform:translateY(-3px);border-color:rgba(159,25,69,.28);background:#fff;box-shadow:0 12px 26px rgba(20,32,51,.08)}.dashboard-access-center__grid span{font-weight:900}.dashboard-access-center__grid b{color:#9f1945;font-size:12px}

@keyframes dashPanelIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}@media(max-width:900px){.dashboard-context-nav{grid-template-columns:none;grid-auto-flow:column;grid-auto-columns:minmax(155px,1fr);overflow-x:auto}.command-overview__cards,.command-overview__cards--student,.dashboard-access-center__grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:560px){.command-overview__cards,.command-overview__cards--student,.dashboard-access-center__grid{grid-template-columns:1fr}}@media(prefers-reduced-motion:reduce){.dashboard-context-nav button,.command-overview,.dashboard-access-center{animation:none!important;transition:none!important}}


/* Dashboard inteligente · foco de acción */
.dashboard-focus {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 16px;
  align-items: center;
  margin: 0 0 18px;
  padding: 18px 20px;
  border: 1px solid #ead9df;
  border-radius: 18px;
  background: linear-gradient(135deg, #fff 0%, #fffafb 72%, #fff8e7 100%);
  box-shadow: 0 10px 28px rgba(23, 32, 51, .05);
}
.dashboard-focus--clear { border-color: #d6e7dd; background: linear-gradient(135deg,#fff,#f4faf7); }
.dashboard-focus__icon {
  display: grid; width: 42px; height: 42px; place-items: center;
  border-radius: 12px; color: #fff; background: #9f1945; font-weight: 900;
}
.dashboard-focus--clear .dashboard-focus__icon { background: #2d8a63; }
.dashboard-focus__copy span { display:block; color:#9f1945; font-size:.56rem; font-weight:900; letter-spacing:.12em; }
.dashboard-focus__copy strong { display:block; margin:3px 0; color:#172033; font-size:.88rem; }
.dashboard-focus__copy p { margin:0; color:#667085; font-size:.68rem; line-height:1.5; }
.dashboard-focus__action {
  min-height: 42px; display:inline-flex; align-items:center; justify-content:center;
  padding:0 14px; border-radius:10px; color:#fff; background:#9f1945;
  text-decoration:none; font-size:.68rem; font-weight:850;
}
.dashboard-focus__action:hover { background:#7f1237; transform:translateY(-1px); }

@media (max-width: 680px) {
  .dashboard-focus { grid-template-columns:auto 1fr; }
  .dashboard-focus__action { grid-column:1/-1; width:100%; }
}
@media (prefers-reduced-motion: reduce) {
  .saas-dashboard,
  .saas-dashboard *,
  .saas-dashboard *::before,
  .saas-dashboard *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}


/* =========================================================
   PRÓXIMA CLASE · CINEMATIC ACADEMIC CARD v11.1
   Reutiliza la estética aprobada del CourseHub/Programa.
========================================================= */
.next-lesson {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 230px;
  padding: 28px;
  border: 1px solid rgba(217, 169, 29, .78);
  border-radius: 18px;
  background:
    linear-gradient(100deg, rgba(13, 24, 44, .97) 0%, rgba(19, 32, 55, .92) 48%, rgba(31, 25, 37, .78) 100%),
    radial-gradient(circle at 82% 18%, rgba(217, 169, 29, .20), transparent 34%),
    linear-gradient(135deg, #14213a, #2c1730);
  box-shadow:
    0 18px 40px rgba(23, 32, 51, .14),
    inset 0 0 0 1px rgba(255,255,255,.04);
}
.next-lesson::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  opacity: .42;
  background:
    radial-gradient(circle at 78% 35%, rgba(217,169,29,.28) 0 1px, transparent 2px),
    repeating-linear-gradient(165deg, transparent 0 31px, rgba(255,255,255,.025) 32px 33px);
  pointer-events: none;
}
.next-lesson::after {
  content: "";
  position: absolute;
  left: 0;
  top: 22px;
  bottom: 22px;
  width: 3px;
  border-radius: 0 999px 999px 0;
  background: linear-gradient(#f2d46b, #b98712);
  box-shadow: 0 0 18px rgba(217,169,29,.35);
}
.lesson-index {
  width: 68px;
  height: 76px;
  border: 1px solid rgba(235, 196, 73, .78);
  border-radius: 14px;
  background: linear-gradient(145deg, #a81747, #73152f);
  color: #fff7df;
  box-shadow: 0 12px 24px rgba(0,0,0,.22);
  font-size: 1.15rem;
}
.next-lesson__body > span {
  color: #e7c34f;
  letter-spacing: .10em;
  text-shadow: 0 1px 10px rgba(0,0,0,.35);
}
.next-lesson__body h3 {
  color: #fff7df;
  font-size: clamp(1.28rem, 2vw, 1.65rem);
  line-height: 1.15;
  text-shadow: 0 2px 14px rgba(0,0,0,.42);
}
.next-lesson__body p {
  color: rgba(240,244,250,.78);
  max-width: 760px;
  font-size: .78rem;
}
.next-lesson .button--dark {
  min-height: 46px;
  padding-inline: 18px;
  border: 1px solid rgba(226,184,54,.72);
  background: linear-gradient(135deg, #a81747, #821438);
  color: #fff;
  box-shadow: 0 10px 22px rgba(94, 15, 47, .24);
}
.next-lesson .button--dark:hover {
  background: linear-gradient(135deg, #b61b50, #901641);
  transform: translateY(-2px);
}
@media (max-width: 680px) {
  .next-lesson { min-height: 0; padding: 20px; }
  .lesson-index { width: 52px; height: 58px; }
}


/* =========================================================
   DASHBOARD · PRÓXIMA CLASE CON PORTADA REAL v11.2
   Misma lógica visual aprobada en CourseHubView.
========================================================= */
.next-lesson {
  position: relative;
  min-height: 330px;
  overflow: hidden;
  isolation: isolate;
  border: 1px solid #dbe3ec;
  border-radius: 20px;
  background: #f7f9fc;
}
.next-lesson__wallpaper {
  position: absolute;
  inset: 0;
  z-index: -3;
  background-image: var(--next-cover);
  background-size: cover;
  background-position: center;
  transform: scale(1.01);
}
.next-lesson--with-cover {
  border-color: rgba(217,169,29,.82);
  box-shadow: 0 18px 42px rgba(23,32,51,.16);
}
.next-lesson--with-cover::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background: linear-gradient(
    90deg,
    rgba(12,23,38,.96) 0%,
    rgba(12,23,38,.90) 34%,
    rgba(12,23,38,.68) 68%,
    rgba(12,23,38,.46) 100%
  );
}
.next-lesson--with-cover::after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 55%;
  z-index: -1;
  background: linear-gradient(0deg, rgba(8,17,29,.38), transparent);
}
.next-lesson--with-cover .lesson-index {
  width: 76px;
  height: 94px;
  border: 1px solid rgba(217,169,29,.9);
  border-radius: 18px;
  background: linear-gradient(145deg,#a81747,#761431);
  color: #fff7df;
  box-shadow: 0 12px 30px rgba(0,0,0,.25);
  backdrop-filter: blur(10px);
}
.next-lesson--with-cover .next-lesson__body > span {
  color: #f4ca55;
  font-weight: 900;
  letter-spacing: .08em;
}
.next-lesson--with-cover .next-lesson__body h3 {
  position: relative;
  display: inline-block;
  margin: 9px 0 13px;
  padding-bottom: 12px;
  color: #fff7df !important;
  font-size: clamp(1.45rem,2.4vw,2rem);
  line-height: 1.08;
  text-shadow: 0 2px 14px rgba(0,0,0,.42);
}
.next-lesson--with-cover .next-lesson__body h3::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 64px;
  height: 3px;
  border-radius: 999px;
  background: #d9a91d;
}
.next-lesson--with-cover .next-lesson__body p {
  max-width: 720px;
  color: rgba(255,255,255,.84);
  font-size: .82rem;
  line-height: 1.7;
  text-shadow: 0 1px 8px rgba(0,0,0,.24);
  -webkit-line-clamp: 4;
}
.next-lesson--with-cover .button--dark {
  min-height: 54px;
  padding: 0 20px;
  border: 1px solid rgba(217,169,29,.72);
  border-radius: 13px;
  background: #9f1945;
  color: #fff;
  box-shadow: 0 12px 28px rgba(159,25,69,.28);
}
.next-lesson--with-cover .button--dark:hover {
  background: #7f1237;
  transform: translateY(-2px);
}
@media (max-width: 680px) {
  .next-lesson { min-height: 300px; }
  .next-lesson--with-cover .lesson-index { width: 58px; height: 68px; }
}


/* =========================================================
   DASHBOARD V11.3 · PROGRESO ACADÉMICO REAL
========================================================= */
.academic-progress { align-content:start; }
.academic-score {
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:18px;
  align-items:center;
  padding:18px;
  margin-bottom:16px;
  border:1px solid #eadfbd;
  border-radius:16px;
  background:linear-gradient(135deg,#fffaf0,#fff);
}
.academic-score span,.academic-score small,
.teacher-academic-score span,.teacher-academic-score small {
  display:block;
  color:#667085;
  font-size:.63rem;
}
.academic-score > div:first-child > span,
.teacher-academic-score span {
  color:#8d6a0b;
  font-weight:900;
  letter-spacing:.08em;
}
.academic-score > div:first-child > strong {
  display:block;
  margin:4px 0;
  color:#172033;
  font-size:2.35rem;
  line-height:1;
}
.academic-score__percentage {
  min-width:82px;
  padding:12px;
  border-radius:13px;
  background:#172033;
  text-align:center;
}
.academic-score__percentage strong {
  display:block;
  color:#fff7df;
  font-size:1.2rem;
}
.academic-score__percentage span { color:#f4ca55; }
.academic-evaluated {
  padding:15px 2px 17px;
  border-bottom:1px solid #e8edf2;
}
.academic-evaluated > div:first-child {
  display:flex;
  justify-content:space-between;
  gap:12px;
  color:#344359;
  font-size:.72rem;
}
.academic-evaluated > div:first-child strong { color:#9f1945; }
.academic-track {
  height:7px;
  overflow:hidden;
  margin:9px 0 8px;
  border-radius:999px;
  background:#e9edf2;
}
.academic-track i {
  display:block;
  height:100%;
  border-radius:inherit;
  background:linear-gradient(90deg,#9f1945,#d9a91d);
}
.academic-evaluated small {
  display:block;
  color:#7b8798;
  font-size:.58rem;
  line-height:1.45;
}
.academic-mini-grid {
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:8px;
  margin-top:15px;
}
.academic-mini-grid > div {
  padding:12px 10px;
  border:1px solid #e3e8ee;
  border-radius:12px;
  background:#fafbfd;
}
.academic-mini-grid span,.academic-mini-grid small {
  display:block;
  color:#748195;
  font-size:.57rem;
}
.academic-mini-grid strong {
  display:block;
  margin:4px 0 2px;
  color:#253247;
  font-size:1rem;
}
.teacher-academic-score {
  display:grid;
  grid-template-columns:repeat(2,minmax(0,1fr));
  gap:9px;
  margin-bottom:14px;
}
.teacher-academic-score > div {
  padding:15px;
  border:1px solid #e5e9ef;
  border-radius:13px;
  background:#fafbfd;
}
.teacher-academic-score strong {
  display:block;
  margin:5px 0 3px;
  color:#172033;
  font-size:1.35rem;
}
.academic-warning {
  margin:13px 0 0;
  padding:9px 10px;
  border:1px solid #f0ddb7;
  border-radius:9px;
  background:#fff8e8;
  color:#8a6510;
  font-size:.61rem;
  line-height:1.45;
}
@media(max-width:680px) {
  .academic-mini-grid { grid-template-columns:1fr; }
  .teacher-academic-score { grid-template-columns:1fr; }
}


/* DASHBOARD V11.4 · ACTIVIDAD RECIENTE */
.recent-activity{padding:0;overflow:hidden}
.recent-activity .panel-heading{padding:20px 22px 14px;margin:0}
.activity-feed{border-top:1px solid #e6ebf1}
.activity-row{display:grid;grid-template-columns:38px minmax(0,1fr) auto 18px;gap:12px;align-items:center;min-height:66px;padding:10px 20px;border-bottom:1px solid #edf0f4;color:inherit;text-decoration:none;transition:.18s ease}
.activity-row:hover{background:#fafbfd;transform:translateX(2px)}
.activity-icon{display:grid;place-items:center;width:34px;height:34px;border-radius:11px;font-size:.78rem;font-weight:900}
.activity-icon--green{background:#edf8f3;color:#2d8a63}
.activity-icon--gold{background:#fff8e7;color:#9a7411}
.activity-copy{min-width:0}
.activity-copy strong,.activity-copy small{display:block}
.activity-copy strong{color:#253247;font-size:.72rem}
.activity-copy small{margin-top:3px;overflow:hidden;color:#748195;font-size:.62rem;text-overflow:ellipsis;white-space:nowrap}
.activity-row time{color:#8a95a5;font-size:.58rem;font-weight:700;white-space:nowrap}
.activity-row b{color:#9f1945}
.activity-empty{padding:22px;border-top:1px solid #e6ebf1}
.activity-empty strong,.activity-empty small{display:block}
.activity-empty strong{color:#344359;font-size:.72rem}
.activity-empty small{margin-top:5px;color:#7b8798;font-size:.62rem}
@media(max-width:680px){.activity-row{grid-template-columns:34px minmax(0,1fr) 14px}.activity-row time{display:none}}


/* DASHBOARD V11.6 · SMART DEADLINES */
.dashboard-legacy-metrics{display:none!important}
.dashboard-summary-activity{
  margin-top:16px;
  border:1px solid #dbe3ec;
  border-radius:18px;
  background:#fff;
  box-shadow:0 10px 28px rgba(23,32,51,.055)
}

</style>