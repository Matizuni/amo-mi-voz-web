<template>
  <section class="dashboard-v3 amv-view-shell">
    <Transition name="page-fade" appear>
      <section
        v-if="isLoading"
        class="dashboard-v3__state dashboard-v3__state--loading"
        role="status"
        aria-live="polite"
      >
        <div class="state-orbit" aria-hidden="true">
          <span></span><span></span><span></span>
        </div>
        <div>
          <span class="eyebrow">AMO MI VOZ · AULA VIRTUAL</span>
          <h2>Preparando tu espacio...</h2>
          <p>Estamos reuniendo clases, actividades y seguimiento académico.</p>
        </div>
      </section>
    </Transition>

    <Transition name="page-fade" mode="out-in">
      <section
        v-if="!isLoading && loadError"
        class="dashboard-v3__state dashboard-v3__state--error"
        role="alert"
      >
        <div class="state-icon">!</div>
        <div>
          <span class="eyebrow">AULA VIRTUAL</span>
          <h2>No pudimos cargar tu aula</h2>
          <p>{{ loadError }}</p>
          <button class="lux-button lux-button--primary" type="button" @click="loadDashboard">
            Reintentar <span>↗</span>
          </button>
        </div>
      </section>

      <template v-else-if="!isLoading && isTeacher">
        <div class="dashboard-v3__content dashboard-v3__content--teacher">
          <header class="hero-panel hero-panel--teacher">
            <div class="hero-panel__ambient hero-panel__ambient--wine"></div>
            <div class="hero-panel__ambient hero-panel__ambient--gold"></div>
            <div class="hero-panel__grid"></div>
            <div class="hero-panel__copy">
              <span class="eyebrow eyebrow--light"><i></i> AULA VIRTUAL · PROFESOR</span>
              <h1>Hola, <strong>{{ firstName }}</strong><span>.</span></h1>
              <p>Tu centro de mando para seguir el curso, detectar lo importante y actuar con menos clics.</p>
              <div class="hero-panel__chips">
                <span>✦ Curso activo</span>
                <span>◌ {{ students.length }} estudiantes</span>
                <span>↗ {{ lessons.length }} clases</span>
              </div>
            </div>
            <div class="hero-panel__visual hero-panel__visual--teacher">
              <div class="hero-visual-card hero-visual-card--teacher">
                <span class="hero-visual-card__label">ESTADO DEL AULA</span>
                <strong>{{ pendingReviewCount > 0 ? `${pendingReviewCount} pendientes` : 'Todo al día' }}</strong>
                <small>{{ generalAttendancePercentage }}% asistencia general</small>
                <div class="hero-visual-card__meter"><span :style="{ width: `${generalAttendancePercentage}%` }"></span></div>
              </div>
              <div class="floating-orb floating-orb--one">✦</div>
              <div class="floating-orb floating-orb--two">♫</div>
            </div>
          </header>

          <section class="metric-grid metric-grid--teacher">
            <RouterLink to="/aula/alumnos" class="metric-card metric-card--wine">
              <div class="metric-card__icon">👥</div>
              <div class="metric-card__body"><span>ESTUDIANTES</span><strong>{{ students.length }}</strong><small>ver curso completo →</small></div>
            </RouterLink>
            <RouterLink to="/aula/programa-formativo" class="metric-card metric-card--gold">
              <div class="metric-card__icon">🎼</div>
              <div class="metric-card__body"><span>CLASES</span><strong>{{ lessons.length }}</strong><small>explorar programa →</small></div>
            </RouterLink>
            <RouterLink to="/aula/asistencia" class="metric-card metric-card--green">
              <div class="metric-card__icon">✓</div>
              <div class="metric-card__body"><span>ASISTENCIA</span><strong>{{ generalAttendancePercentage }}%</strong><small>ver seguimiento →</small></div>
            </RouterLink>
            <article class="metric-card metric-card--purple">
              <div class="metric-card__icon">📝</div>
              <div class="metric-card__body"><span>POR REVISAR</span><strong>{{ pendingReviewCount }}</strong><small>entregas pendientes</small></div>
            </article>
          </section>

          <section class="focus-grid focus-grid--teacher">
            <article class="focus-card focus-card--next">
              <div class="section-heading section-heading--compact">
                <span class="section-index">01</span>
                <div><span>PROGRAMA</span><h2>Próxima clase</h2></div>
              </div>
              <div v-if="nextLesson" class="next-class-card">
                <div class="next-class-card__visual next-class-card__visual--gold">
                  <span>{{ String(nextLesson.id).padStart(2, '0') }}</span>
                  <i>🎤</i>
                  <em>PRÓXIMO</em>
                </div>
                <div class="next-class-card__content">
                  <span>{{ formatLessonDate(nextLesson.date) }}</span>
                  <h3>{{ cleanLessonTitle(nextLesson.title) }}</h3>
                  <p>{{ nextLesson.description || 'Prepara tu siguiente sesión y continúa con el programa.' }}</p>
                  <RouterLink :to="`/aula/clase/${nextLesson.id}`" class="lux-button lux-button--gold">Ver clase <span>→</span></RouterLink>
                </div>
              </div>
              <div v-else class="empty-inline"><span>✨</span><div><strong>No hay una próxima clase registrada.</strong><small>El programa aparecerá aquí cuando exista una fecha disponible.</small></div></div>
            </article>

            <article class="focus-card focus-card--reviews">
              <div class="section-heading section-heading--compact">
                <span class="section-index">02</span>
                <div><span>EVALUACIONES</span><h2>Por revisar</h2></div>
              </div>
              <div v-if="pendingReviews.length" class="review-list">
                <RouterLink v-for="item in pendingReviews.slice(0, 4)" :key="item.submission.id" :to="item.task ? `/aula/clase/${item.task.lessonId}/tarea/${item.task.id}/entregas` : '/aula/mis-tareas'" class="review-row">
                  <div class="review-row__avatar">{{ getInitials(item.student?.name) }}</div>
                  <div class="review-row__body"><span>{{ item.student?.voice || 'Estudiante' }}</span><strong>{{ item.student?.name || 'Estudiante' }}</strong><small>{{ item.task?.title || 'Tarea' }}</small></div>
                  <i>→</i>
                </RouterLink>
                <RouterLink to="/aula/calificaciones" class="text-link">Ver todos →</RouterLink>
              </div>
              <div v-else class="success-empty"><div>✓</div><div><strong>Todo al día</strong><span>No tienes entregas esperando revisión.</span></div></div>
            </article>
          </section>

          <section class="wide-panel">
            <div class="section-heading section-heading--wide"><span class="section-index">03</span><div><span>SEGUIMIENTO</span><h2>Asistencia reciente</h2><p>Una lectura rápida de cómo viene avanzando el curso.</p></div><RouterLink to="/aula/asistencia" class="section-link">Administrar →</RouterLink></div>
            <div class="attendance-strip">
              <article v-for="row in lessonAttendanceRows.slice(0, 5)" :key="row.lesson.id" class="attendance-item">
                <div class="attendance-item__top"><span>CLASE {{ getAcademicLessonNumber(row.lesson) }}</span><em :class="{ 'is-active': row.registered }">{{ row.registered ? 'REGISTRADA' : 'SIN REGISTRAR' }}</em></div>
                <strong>{{ cleanLessonTitle(row.lesson.title) }}</strong>
                <small>{{ formatLessonDate(row.lesson.date) }}</small>
                <div v-if="row.registered" class="attendance-item__result"><b>{{ row.present }}/{{ students.length }}</b><span>presentes</span></div>
              </article>
            </div>
          </section>

          <section class="wide-panel wide-panel--students">
            <div class="section-heading section-heading--wide"><span class="section-index">04</span><div><span>CURSO</span><h2>Tu grupo</h2><p>Acceso directo a la ficha de cada estudiante.</p></div><RouterLink to="/aula/alumnos" class="section-link">Ver todos →</RouterLink></div>
            <div class="student-grid">
              <RouterLink v-for="studentRow in studentAttendanceRows.slice(0, 6)" :key="studentRow.student.id" :to="`/aula/estudiante/${studentRow.student.id}`" class="student-card">
                <div class="student-card__halo"><div class="student-card__avatar">{{ getInitials(studentRow.student.name) }}</div></div>
                <div class="student-card__info"><span>{{ studentRow.student.voice || 'General' }}</span><strong>{{ studentRow.student.name }}</strong><small>{{ studentRow.registered > 0 ? `${studentRow.percentage}% asistencia` : 'Sin registros' }}</small></div>
                <i>↗</i>
              </RouterLink>
            </div>
          </section>
        </div>
      </template>

      <template v-else>
        <div class="dashboard-v3__content dashboard-v3__content--student">
          <header class="hero-panel hero-panel--student">
            <div class="hero-panel__ambient hero-panel__ambient--wine"></div>
            <div class="hero-panel__ambient hero-panel__ambient--gold"></div>
            <div class="hero-panel__grid"></div>
            <div class="hero-panel__copy">
              <span class="eyebrow"><i></i> AULA VIRTUAL · ESTUDIANTE</span>
              <h1>Hola, <strong>{{ firstName }}</strong><span>.</span></h1>
              <p>Tu aula en una mirada. Mira qué necesita tu atención y continúa donde lo dejaste.</p>
              <div class="hero-panel__chips">
                <span v-if="currentUser?.voice">🎤 {{ currentUser.voice }}</span>
                <span>✦ Academia Amo Mi Voz</span>
                <span>● Plataforma activa</span>
              </div>
            </div>
            <div class="hero-panel__visual hero-panel__visual--student">
              <div class="student-life-card">
                <div class="student-life-card__top"><span>MI ESTADO</span><b>{{ studentPendingTasks.length ? `${studentPendingTasks.length} pendientes` : 'Todo al día' }}</b></div>
                <div class="student-life-card__rings"><div class="life-ring"><strong>{{ studentAttendancePercentage }}%</strong><small>asistencia</small></div><div class="life-ring life-ring--gold"><strong>{{ studentAverageGrade }}</strong><small>promedio</small></div></div>
                <div class="student-life-card__quote">“Un paso más y seguimos avanzando.”</div>
              </div>
              <div class="floating-orb floating-orb--one">♪</div>
              <div class="floating-orb floating-orb--two">✦</div>
            </div>
          </header>

          <section class="smart-strip">
            <RouterLink to="/aula/mis-tareas" class="smart-item smart-item--wine"><span>📝</span><div><small>PENDIENTES</small><strong>{{ studentPendingTasks.length }}</strong></div><i>→</i></RouterLink>
            <RouterLink :to="currentUser?.studentId ? `/aula/estudiante/${currentUser.studentId}` : '/aula/cuenta'" class="smart-item smart-item--green"><span>✓</span><div><small>ASISTENCIA</small><strong>{{ studentAttendancePercentage }}%</strong></div><i>→</i></RouterLink>
            <RouterLink to="/aula/evaluaciones" class="smart-item smart-item--gold"><span>★</span><div><small>RENDIMIENTO</small><strong>{{ studentAverageGrade }}</strong></div><i>→</i></RouterLink>
            <RouterLink to="/aula/recursos" class="smart-item smart-item--purple"><span>📚</span><div><small>RECURSOS</small><strong>{{ lessons.length }}</strong></div><i>→</i></RouterLink>
          </section>

          <section class="student-focus-grid">
            <article class="focus-card focus-card--next">
              <div class="section-heading section-heading--compact"><span class="section-index">01</span><div><span>CONTINUIDAD</span><h2>Tu próximo paso</h2></div></div>
              <div v-if="nextLesson" class="next-class-card next-class-card--student">
                <div class="next-class-card__visual next-class-card__visual--wine"><span>{{ String(nextLesson.id).padStart(2, '0') }}</span><i>🎤</i><em>{{ formatLessonDate(nextLesson.date) }}</em></div>
                <div class="next-class-card__content"><span>PRÓXIMA CLASE</span><h3>{{ cleanLessonTitle(nextLesson.title) }}</h3><p>{{ nextLesson.description || 'Continúa con tu programa formativo y sigue construyendo tu voz.' }}</p><RouterLink :to="`/aula/clase/${nextLesson.id}`" class="lux-button lux-button--primary">Entrar a la clase <span>→</span></RouterLink></div>
              </div>
              <div v-else class="empty-inline"><span>✨</span><div><strong>Tu siguiente clase aparecerá aquí.</strong><small>Cuando el programa tenga una nueva sesión disponible, la tendrás a mano.</small></div></div>
            </article>

            <article class="focus-card focus-card--tasks">
              <div class="section-heading section-heading--compact"><span class="section-index">02</span><div><span>TRABAJO</span><h2>Lo que necesita tu atención</h2></div></div>
              <div v-if="studentPendingTasks.length" class="task-stack">
                <RouterLink v-for="row in studentPendingTasks.slice(0, 3)" :key="row.task.id" :to="`/aula/clase/${row.task.lessonId}/tarea/${row.task.id}`" class="task-row">
                  <div class="task-row__icon">{{ row.task?.acceptedFile === 'audio' ? '🎧' : row.task?.acceptedFile === 'video' ? '🎬' : '📝' }}</div>
                  <div><span>CLASE {{ getAcademicLessonNumberById(row.task.lessonId) }}</span><strong>{{ row.task.title }}</strong><small>{{ row.task.description || 'Actividad pendiente' }}</small></div><i>→</i>
                </RouterLink>
              </div>
              <div v-else class="success-empty"><div>✓</div><div><strong>Todo al día</strong><span>No tienes tareas pendientes ahora mismo.</span></div></div>
              <RouterLink to="/aula/mis-tareas" class="text-link">Abrir mis actividades →</RouterLink>
            </article>
          </section>

          <section class="wide-panel wide-panel--result">
            <div class="section-heading section-heading--wide"><span class="section-index">03</span><div><span>MI EVOLUCIÓN</span><h2>Último resultado</h2><p>Tu avance se convierte en decisiones concretas para la siguiente clase.</p></div><RouterLink to="/aula/evaluaciones" class="section-link">Ver evaluaciones →</RouterLink></div>
            <div v-if="latestReviewedSubmission" class="latest-result">
              <div class="latest-result__preview latest-result__preview--purple"><span>RESULTADO</span><strong>{{ Number(latestReviewedSubmission.grade ?? latestReviewedSubmission.score ?? 0).toFixed(0) }}%</strong><small>{{ getAssignmentTitle(latestReviewedSubmission.taskId ?? latestReviewedSubmission.assignmentId) }}</small></div>
              <div class="latest-result__body"><div class="result-badge">✓ EVALUACIÓN REVISADA</div><h3>{{ getAssignmentTitle(latestReviewedSubmission.taskId ?? latestReviewedSubmission.assignmentId) }}</h3><p>Tu docente ya entregó retroalimentación. Revisa el detalle y úsalo para preparar tu próxima práctica.</p><RouterLink :to="getSubmissionTaskLink(latestReviewedSubmission)" class="lux-button lux-button--purple">Ver retroalimentación <span>→</span></RouterLink></div>
              <div class="latest-result__sparkles" aria-hidden="true">✦<br>· ✦ ·<br>✧</div>
            </div>
            <div v-else class="empty-inline empty-inline--large"><span>🎼</span><div><strong>Aún no tienes un resultado revisado.</strong><small>Cuando tu profesor corrija una entrega, aparecerá aquí.</small></div><RouterLink to="/aula/mis-tareas" class="lux-button lux-button--ghost">Ver actividades <span>→</span></RouterLink></div>
          </section>

          <section class="wide-panel wide-panel--resources">
            <div class="section-heading section-heading--wide"><span class="section-index">04</span><div><span>EXPLORA</span><h2>Tu biblioteca rápida</h2><p>Entra directo a los recursos que sostienen tu práctica.</p></div></div>
            <div class="quick-resource-grid">
              <RouterLink to="/aula/recursos" class="quick-resource quick-resource--wine"><div class="quick-resource__visual">📖</div><div><span>RECURSOS</span><strong>Biblioteca del aula</strong><small>Partituras, audios, documentos y más.</small></div><i>↗</i></RouterLink>
              <RouterLink to="/aula/calendario" class="quick-resource quick-resource--gold"><div class="quick-resource__visual">🗓️</div><div><span>CALENDARIO</span><strong>Próximas fechas</strong><small>Clases, pruebas, quiz y eventos.</small></div><i>↗</i></RouterLink>
              <RouterLink to="/aula/evaluaciones" class="quick-resource quick-resource--purple"><div class="quick-resource__visual">🎯</div><div><span>EVALUACIÓN</span><strong>Mis resultados</strong><small>Historial, quiz y pruebas.</small></div><i>↗</i></RouterLink>
            </div>
          </section>

          <section v-if="hasRubricProgress" class="wide-panel wide-panel--voice">
            <div class="section-heading section-heading--wide"><span class="section-index">05</span><div><span>DESARROLLO VOCAL</span><h2>Tu evolución técnica</h2><p>Una lectura rápida de las áreas trabajadas en tus evaluaciones revisadas.</p></div><RouterLink to="/aula/evaluaciones" class="section-link">Ver detalle →</RouterLink></div>
            <div class="rubric-grid">
              <article v-for="item in studentRubricProgress" :key="item.key" class="rubric-card">
                <div class="rubric-card__top"><span>{{ item.label }}</span><strong>{{ item.value ? `${Math.round(item.value)}%` : '—' }}</strong></div>
                <div class="rubric-card__track"><span :style="{ width: `${Math.min(100, Math.max(0, item.value || 0))}%` }"></span></div>
              </article>
            </div>
          </section>
        </div>
      </template>
    </Transition>
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

<style scoped lang="scss">
.dashboard-v3 {
  --ink: #18243a;
  --ink-soft: #5d6b7f;
  --muted: #8a96a7;
  --line: #dde5ee;
  --surface: #ffffff;
  --bg: #f4f6f9;
  --wine: #a9154c;
  --wine-dark: #7d0d39;
  --wine-soft: #fff0f5;
  --gold: #d8a919;
  --gold-dark: #966f00;
  --gold-soft: #fff8e3;
  --purple: #7650a8;
  --purple-soft: #f4effa;
  --green: #2c956e;
  --green-soft: #edf9f4;
  --blue: #4f77bd;
  --blue-soft: #eef4ff;
  width: 100%;
  max-width: 1380px;
  margin: 0 auto;
  padding: 1rem 0 5rem;
}
.dashboard-v3 *, .dashboard-v3 *::before, .dashboard-v3 *::after { box-sizing: border-box; }
.dashboard-v3 a { text-decoration: none; }
.dashboard-v3__content { display: grid; gap: 1.2rem; }
.dashboard-v3__state { min-height: 360px; display:grid; place-items:center; grid-template-columns:auto auto; gap:1.25rem; padding:3rem; border:1px solid var(--line); border-radius:28px; background:rgba(255,255,255,.86); box-shadow:0 22px 70px rgba(24,36,58,.07); color:var(--ink); }
.dashboard-v3__state h2 { margin:.3rem 0 .35rem; font-size:clamp(2rem,4vw,3.7rem); letter-spacing:-.045em; }
.dashboard-v3__state p { margin:0 0 1rem; color:var(--ink-soft); }
.eyebrow { display:inline-flex; align-items:center; gap:.5rem; color:var(--gold-dark); font-size:.68rem; font-weight:900; letter-spacing:.18em; text-transform:uppercase; }
.eyebrow i { width:7px; height:7px; border-radius:50%; background:var(--green); box-shadow:0 0 0 5px rgba(44,149,110,.12), 0 0 18px rgba(44,149,110,.4); }
.eyebrow--light { color:rgba(255,255,255,.72); }
.eyebrow--light i { background:#8cf0bf; box-shadow:0 0 0 5px rgba(140,240,191,.12),0 0 18px rgba(140,240,191,.42); }
.hero-panel { position:relative; overflow:hidden; display:grid; grid-template-columns:minmax(0,1.35fr) minmax(320px,.65fr); min-height:340px; padding:2.2rem; border-radius:30px; color:#fff; isolation:isolate; box-shadow:0 26px 90px rgba(24,36,58,.15); }
.hero-panel::after { position:absolute; inset:auto -10% -65% -10%; height:75%; background:radial-gradient(ellipse, rgba(255,255,255,.14), transparent 65%); content:""; pointer-events:none; }
.hero-panel--teacher { background:linear-gradient(135deg,#141d2e 0%,#1e2537 60%,#4d2237 100%); }
.hero-panel--student { background:linear-gradient(135deg,#161e30 0%,#1d2335 55%,#4f213b 100%); }
.hero-panel__grid { position:absolute; inset:0; background-image:linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px); background-size:42px 42px; mask-image:linear-gradient(to bottom,black,transparent 85%); opacity:.55; }
.hero-panel__ambient { position:absolute; border-radius:50%; filter:blur(4px); opacity:.75; pointer-events:none; }
.hero-panel__ambient--wine { width:300px; height:300px; right:18%; top:-120px; background:radial-gradient(circle,rgba(201,35,94,.38),transparent 64%); }
.hero-panel__ambient--gold { width:250px; height:250px; left:40%; bottom:-150px; background:radial-gradient(circle,rgba(221,174,32,.28),transparent 68%); }
.hero-panel__copy { position:relative; z-index:2; align-self:center; max-width:760px; padding:1rem 0; }
.hero-panel h1 { margin:.65rem 0 .45rem; font-size:clamp(3.6rem,6vw,6.8rem); font-weight:950; letter-spacing:-.075em; line-height:.93; }
.hero-panel h1 strong { font-weight:950; }
.hero-panel h1 span { color:#d8a919; }
.hero-panel p { max-width:650px; margin:0; color:rgba(255,255,255,.72); font-size:1rem; line-height:1.6; }
.hero-panel__chips { display:flex; flex-wrap:wrap; gap:.55rem; margin-top:1.2rem; }
.hero-panel__chips span { display:inline-flex; align-items:center; min-height:34px; padding:0 .82rem; border:1px solid rgba(255,255,255,.12); border-radius:999px; background:rgba(255,255,255,.055); color:rgba(255,255,255,.8); font-size:.68rem; font-weight:800; backdrop-filter:blur(14px); }
.hero-panel__visual { position:relative; display:flex; align-items:center; justify-content:center; }
.hero-visual-card, .student-life-card { position:relative; z-index:2; width:min(100%,370px); padding:1.35rem; border:1px solid rgba(255,255,255,.11); border-radius:24px; background:rgba(255,255,255,.065); box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 25px 70px rgba(0,0,0,.2); backdrop-filter:blur(20px); }
.hero-visual-card__label, .student-life-card__top span { color:rgba(255,255,255,.53); font-size:.59rem; font-weight:900; letter-spacing:.14em; }
.hero-visual-card strong { display:block; margin:.55rem 0 .35rem; font-size:2rem; letter-spacing:-.045em; }
.hero-visual-card small { color:rgba(255,255,255,.62); }
.hero-visual-card__meter { height:8px; margin-top:1rem; overflow:hidden; border-radius:999px; background:rgba(255,255,255,.09); }
.hero-visual-card__meter span { display:block; height:100%; border-radius:999px; background:linear-gradient(90deg,#d9a91b,#fff1a4); box-shadow:0 0 18px rgba(217,169,27,.45); }
.floating-orb { position:absolute; display:grid; width:64px; height:64px; place-items:center; border:1px solid rgba(255,255,255,.16); border-radius:50%; background:rgba(255,255,255,.06); color:#fff3be; box-shadow:0 12px 35px rgba(0,0,0,.22),0 0 30px rgba(217,169,27,.14); backdrop-filter:blur(12px); animation:floatOrb 5.4s ease-in-out infinite; }
.floating-orb--one { top:12%; right:4%; }
.floating-orb--two { bottom:10%; left:6%; animation-delay:-2.4s; color:#ffc1d7; box-shadow:0 12px 35px rgba(0,0,0,.22),0 0 30px rgba(169,21,76,.2); }
@keyframes floatOrb { 0%,100% { transform:translate3d(0,0,0) rotate(0); } 50% { transform:translate3d(0,-10px,0) rotate(6deg); } }
.metric-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.85rem; }
.metric-card { position:relative; overflow:hidden; display:flex; min-height:132px; align-items:center; gap:.9rem; padding:1rem; border:1px solid var(--line); border-radius:22px; background:var(--surface); box-shadow:0 10px 28px rgba(24,36,58,.04); color:var(--ink); transition:transform .32s ease, box-shadow .32s ease, border-color .32s ease; }
.metric-card::before { position:absolute; inset:-45% auto auto -20%; width:120px; height:120px; border-radius:50%; background:var(--tone-glow,rgba(216,169,25,.12)); filter:blur(14px); content:""; }
.metric-card:hover { transform:translateY(-5px); box-shadow:0 18px 42px rgba(24,36,58,.1),0 0 0 1px var(--tone-border,rgba(216,169,25,.25)); }
.metric-card__icon { position:relative; z-index:1; display:grid; width:54px; height:54px; flex:0 0 54px; place-items:center; border-radius:17px; background:var(--tone-soft,#fff8e3); color:var(--tone,#a06e00); font-size:1.3rem; box-shadow:inset 0 0 0 1px var(--tone-border,rgba(216,169,25,.16)); }
.metric-card__body { position:relative; z-index:1; min-width:0; }
.metric-card__body span { display:block; color:var(--muted); font-size:.56rem; font-weight:900; letter-spacing:.13em; }
.metric-card__body strong { display:block; margin:.18rem 0 .12rem; color:var(--ink); font-size:2rem; letter-spacing:-.055em; }
.metric-card__body small { color:var(--tone,#a06e00); font-size:.62rem; font-weight:850; }
.metric-card--wine { --tone:var(--wine); --tone-soft:var(--wine-soft); --tone-border:rgba(169,21,76,.18); --tone-glow:rgba(169,21,76,.1); }
.metric-card--gold { --tone:var(--gold-dark); --tone-soft:var(--gold-soft); --tone-border:rgba(216,169,25,.19); --tone-glow:rgba(216,169,25,.12); }
.metric-card--green { --tone:var(--green); --tone-soft:var(--green-soft); --tone-border:rgba(44,149,110,.18); --tone-glow:rgba(44,149,110,.1); }
.metric-card--purple { --tone:var(--purple); --tone-soft:var(--purple-soft); --tone-border:rgba(118,80,168,.18); --tone-glow:rgba(118,80,168,.1); }
.focus-grid { display:grid; grid-template-columns:minmax(0,1.25fr) minmax(320px,.75fr); gap:1rem; }
.focus-card, .wide-panel { position:relative; overflow:hidden; padding:1.35rem; border:1px solid var(--line); border-radius:26px; background:var(--surface); box-shadow:0 12px 32px rgba(24,36,58,.045); }
.focus-card::after, .wide-panel::after { position:absolute; top:-70px; right:-70px; width:180px; height:180px; border-radius:50%; background:radial-gradient(circle,rgba(216,169,25,.08),transparent 68%); content:""; pointer-events:none; }
.section-heading { position:relative; z-index:1; display:flex; align-items:center; gap:.9rem; }
.section-heading--compact { margin-bottom:1rem; }
.section-heading--wide { margin-bottom:1.1rem; }
.section-heading .section-index { display:grid; width:42px; height:42px; flex:0 0 42px; place-items:center; border:1px solid rgba(216,169,25,.45); border-radius:50%; color:var(--gold-dark); font-size:.65rem; font-weight:900; }
.section-heading--wide .section-index { width:44px; height:44px; }
.section-heading > div { min-width:0; flex:1; }
.section-heading span:not(.section-index) { display:block; color:var(--gold-dark); font-size:.58rem; font-weight:900; letter-spacing:.15em; }
.section-heading h2 { margin:.12rem 0 0; color:var(--ink); font-size:clamp(1.65rem,2.6vw,2.6rem); letter-spacing:-.05em; line-height:1; }
.section-heading p { margin:.35rem 0 0; color:var(--ink-soft); font-size:.76rem; }
.section-link, .text-link { color:var(--wine); font-size:.68rem; font-weight:900; }
.next-class-card { display:grid; grid-template-columns:150px minmax(0,1fr); gap:1rem; align-items:stretch; }
.next-class-card__visual { position:relative; overflow:hidden; min-height:210px; display:flex; flex-direction:column; align-items:flex-start; justify-content:space-between; padding:1rem; border-radius:22px; color:#fff; box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 14px 32px rgba(24,36,58,.11); }
.next-class-card__visual::after { position:absolute; width:180px; height:180px; right:-85px; bottom:-90px; border-radius:50%; border:1px solid rgba(255,255,255,.14); box-shadow:0 0 0 22px rgba(255,255,255,.035),0 0 0 44px rgba(255,255,255,.025); content:""; }
.next-class-card__visual--gold { background:linear-gradient(150deg,#c18d0c,#e2b72e 55%,#8c6700); }
.next-class-card__visual--wine { background:linear-gradient(150deg,#9d1248,#c12860 55%,#6b0e33); }
.next-class-card__visual span { position:relative; z-index:1; display:grid; width:52px; height:52px; place-items:center; border:1px solid rgba(255,255,255,.3); border-radius:50%; background:rgba(255,255,255,.08); font-weight:950; }
.next-class-card__visual i { position:relative; z-index:1; font-size:2.8rem; font-style:normal; filter:drop-shadow(0 8px 15px rgba(0,0,0,.2)); }
.next-class-card__visual em { position:relative; z-index:1; font-size:.56rem; font-style:normal; font-weight:950; letter-spacing:.13em; }
.next-class-card__content { display:flex; min-width:0; flex-direction:column; justify-content:center; padding:.35rem .25rem; }
.next-class-card__content > span { color:var(--gold-dark); font-size:.61rem; font-weight:900; letter-spacing:.13em; }
.next-class-card__content h3 { margin:.35rem 0 .4rem; color:var(--ink); font-size:clamp(1.55rem,2.5vw,2.4rem); letter-spacing:-.055em; line-height:1; }
.next-class-card__content p { margin:0 0 1rem; color:var(--ink-soft); font-size:.75rem; line-height:1.5; }
.lux-button { display:inline-flex; width:max-content; min-height:42px; align-items:center; justify-content:center; gap:.55rem; padding:0 1rem; border-radius:12px; font-size:.67rem; font-weight:900; transition:transform .25s ease, box-shadow .25s ease, background .25s ease; }
.lux-button:hover { transform:translateY(-2px); }
.lux-button--primary { color:#fff; background:linear-gradient(135deg,var(--wine),#c42963); box-shadow:0 10px 24px rgba(169,21,76,.24); }
.lux-button--gold { color:#fff; background:linear-gradient(135deg,#b1800c,#d8a919); box-shadow:0 10px 24px rgba(216,169,25,.22); }
.lux-button--purple { color:#fff; background:linear-gradient(135deg,#67409a,#8761b6); box-shadow:0 10px 24px rgba(118,80,168,.22); }
.lux-button--ghost { color:var(--ink); background:#fff; border:1px solid var(--line); }
.review-list, .task-stack { display:grid; gap:.35rem; }
.review-row, .task-row { display:grid; grid-template-columns:44px minmax(0,1fr) auto; gap:.75rem; align-items:center; padding:.72rem .7rem; border-radius:16px; color:var(--ink); transition:background .25s ease, transform .25s ease; }
.review-row:hover, .task-row:hover { background:#f8fafc; transform:translateX(3px); }
.review-row__avatar { display:grid; width:44px; height:44px; place-items:center; border-radius:14px; background:linear-gradient(145deg,#ffe3eb,#fff5f8); color:var(--wine); font-size:.68rem; font-weight:950; }
.review-row__body span, .task-row__body span, .review-row__body small, .task-row small { display:block; color:var(--muted); font-size:.55rem; font-weight:850; }
.review-row__body span, .task-row > div:nth-child(2) > span { color:var(--gold-dark); text-transform:uppercase; letter-spacing:.09em; }
.review-row__body strong, .task-row strong { display:block; margin:.12rem 0; font-size:.82rem; }
.review-row i, .task-row i { color:var(--wine); font-style:normal; font-weight:950; }
.success-empty, .empty-inline { display:flex; align-items:center; gap:.8rem; padding:1rem; border:1px dashed rgba(44,149,110,.25); border-radius:18px; background:linear-gradient(145deg,#fbfffd,#f3fbf7); }
.success-empty > div:first-child { display:grid; width:46px; height:46px; flex:0 0 46px; place-items:center; border-radius:15px; background:#e8f7f0; color:var(--green); font-size:1.1rem; font-weight:950; }
.success-empty strong, .empty-inline strong { display:block; color:var(--ink); font-size:.82rem; }
.success-empty span, .empty-inline small { display:block; margin-top:.15rem; color:var(--ink-soft); font-size:.64rem; line-height:1.4; }
.empty-inline > span { display:grid; width:48px; height:48px; flex:0 0 48px; place-items:center; border-radius:16px; background:var(--gold-soft); font-size:1.2rem; }
.empty-inline--large { justify-content:space-between; }
.attendance-strip { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:.6rem; }
.attendance-item { padding:.85rem; border:1px solid var(--line); border-radius:18px; background:linear-gradient(180deg,#fff,#fbfcfe); transition:transform .28s ease, box-shadow .28s ease; }
.attendance-item:hover { transform:translateY(-3px); box-shadow:0 12px 28px rgba(24,36,58,.08); }
.attendance-item__top { display:flex; align-items:center; justify-content:space-between; gap:.4rem; }
.attendance-item__top span { color:var(--gold-dark); font-size:.5rem; font-weight:950; letter-spacing:.11em; }
.attendance-item__top em { padding:.2rem .42rem; border-radius:999px; background:#f4f5f7; color:var(--muted); font-size:.45rem; font-style:normal; font-weight:900; }
.attendance-item__top em.is-active { background:var(--green-soft); color:var(--green); }
.attendance-item strong { display:block; margin:.5rem 0 .22rem; color:var(--ink); font-size:.75rem; line-height:1.3; }
.attendance-item small { color:var(--muted); font-size:.55rem; }
.attendance-item__result { display:flex; align-items:end; justify-content:space-between; margin-top:.7rem; padding-top:.6rem; border-top:1px solid var(--line); }
.attendance-item__result b { color:var(--ink); font-size:1rem; }
.attendance-item__result span { color:var(--muted); font-size:.52rem; }
.student-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.7rem; }
.student-card { position:relative; overflow:hidden; display:grid; grid-template-columns:54px minmax(0,1fr) auto; gap:.75rem; align-items:center; padding:.9rem; border:1px solid var(--line); border-radius:18px; background:#fff; color:var(--ink); transition:transform .28s ease, box-shadow .28s ease, border-color .28s ease; }
.student-card:hover { transform:translateY(-4px); border-color:rgba(169,21,76,.22); box-shadow:0 16px 34px rgba(24,36,58,.09); }
.student-card__halo { display:grid; width:54px; height:54px; place-items:center; border-radius:17px; background:radial-gradient(circle at 45% 30%,#fff3c7,transparent 60%),linear-gradient(145deg,#f8e9ee,#fff); }
.student-card__avatar { display:grid; width:42px; height:42px; place-items:center; border-radius:14px; background:linear-gradient(145deg,var(--wine),#d14576); color:#fff; font-size:.64rem; font-weight:950; }
.student-card__info span { color:var(--gold-dark); font-size:.52rem; font-weight:900; letter-spacing:.1em; text-transform:uppercase; }
.student-card__info strong { display:block; margin:.15rem 0; font-size:.78rem; line-height:1.2; }
.student-card__info small { color:var(--muted); font-size:.54rem; }
.student-card > i { color:var(--wine); font-style:normal; font-weight:950; }
.student-life-card__top { display:flex; align-items:center; justify-content:space-between; gap:1rem; }
.student-life-card__top b { color:#fff4bb; font-size:.68rem; }
.student-life-card__rings { display:flex; justify-content:space-between; gap:.65rem; margin:1rem 0 .9rem; }
.life-ring { position:relative; display:grid; width:105px; height:105px; place-items:center; align-content:center; border-radius:50%; background:radial-gradient(circle,#202a3d 57%,transparent 58%),conic-gradient(#3ca97f 0 67%,rgba(255,255,255,.09) 67%); box-shadow:0 0 0 8px rgba(60,169,127,.06),0 0 32px rgba(60,169,127,.12); }
.life-ring--gold { background:radial-gradient(circle,#202a3d 57%,transparent 58%),conic-gradient(#e0b52c 0 52%,rgba(255,255,255,.09) 52%); box-shadow:0 0 0 8px rgba(224,181,44,.06),0 0 32px rgba(224,181,44,.12); }
.life-ring strong { font-size:1.35rem; letter-spacing:-.04em; }
.life-ring small { margin-top:.14rem; color:rgba(255,255,255,.55); font-size:.49rem; text-transform:uppercase; letter-spacing:.1em; }
.student-life-card__quote { padding:.7rem .8rem; border:1px solid rgba(255,255,255,.08); border-radius:14px; background:rgba(255,255,255,.035); color:rgba(255,255,255,.68); font-size:.63rem; }
.smart-strip { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:.7rem; }
.smart-item { display:grid; grid-template-columns:46px minmax(0,1fr) auto; gap:.7rem; align-items:center; padding:.9rem 1rem; border:1px solid var(--line); border-radius:18px; background:#fff; color:var(--ink); transition:transform .28s ease, box-shadow .28s ease; }
.smart-item:hover { transform:translateY(-4px); box-shadow:0 16px 32px rgba(24,36,58,.08); }
.smart-item > span { display:grid; width:46px; height:46px; place-items:center; border-radius:15px; background:var(--smart-soft,#fff8e3); color:var(--smart-color,#a06e00); font-size:1rem; }
.smart-item--wine { --smart-color:var(--wine); --smart-soft:var(--wine-soft); }
.smart-item--green { --smart-color:var(--green); --smart-soft:var(--green-soft); }
.smart-item--gold { --smart-color:var(--gold-dark); --smart-soft:var(--gold-soft); }
.smart-item--purple { --smart-color:var(--purple); --smart-soft:var(--purple-soft); }
.smart-item small { display:block; color:var(--muted); font-size:.52rem; font-weight:900; letter-spacing:.1em; }
.smart-item strong { display:block; margin-top:.12rem; font-size:1.1rem; }
.smart-item i { color:var(--smart-color,#a06e00); font-style:normal; }
.student-focus-grid { display:grid; grid-template-columns:minmax(0,1.1fr) minmax(350px,.9fr); gap:1rem; }
.quick-resource-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.7rem; }
.quick-resource { display:grid; grid-template-columns:54px minmax(0,1fr) auto; gap:.8rem; align-items:center; padding:1rem; border:1px solid var(--line); border-radius:20px; background:#fff; color:var(--ink); transition:transform .28s ease, box-shadow .28s ease; }
.quick-resource:hover { transform:translateY(-4px); box-shadow:0 16px 36px rgba(24,36,58,.09); }
.quick-resource__visual { display:grid; width:54px; height:54px; place-items:center; border-radius:18px; background:var(--quick-soft,#fff8e3); color:var(--quick-color,#a06e00); font-size:1.35rem; }
.quick-resource--wine { --quick-color:var(--wine); --quick-soft:var(--wine-soft); }
.quick-resource--gold { --quick-color:var(--gold-dark); --quick-soft:var(--gold-soft); }
.quick-resource--purple { --quick-color:var(--purple); --quick-soft:var(--purple-soft); }
.quick-resource span { display:block; color:var(--quick-color,#a06e00); font-size:.52rem; font-weight:900; letter-spacing:.1em; }
.quick-resource strong { display:block; margin:.14rem 0; font-size:.78rem; }
.quick-resource small { display:block; color:var(--muted); font-size:.57rem; line-height:1.35; }
.quick-resource i { color:var(--quick-color,#a06e00); font-style:normal; }
.latest-result { position:relative; display:grid; grid-template-columns:175px minmax(0,1fr) 80px; gap:1rem; align-items:center; padding:.35rem; }
.latest-result__preview { position:relative; overflow:hidden; min-height:180px; display:flex; flex-direction:column; justify-content:flex-end; padding:1rem; border-radius:22px; color:#fff; }
.latest-result__preview::before { position:absolute; inset:-30%; background:radial-gradient(circle at 50% 20%,rgba(255,255,255,.28),transparent 38%); content:""; }
.latest-result__preview--purple { background:linear-gradient(150deg,#674092,#8a67b6 55%,#4b316d); box-shadow:0 18px 40px rgba(118,80,168,.2); }
.latest-result__preview span, .latest-result__preview strong, .latest-result__preview small { position:relative; z-index:1; }
.latest-result__preview span { font-size:.55rem; font-weight:900; letter-spacing:.13em; }
.latest-result__preview strong { margin:.25rem 0; font-size:2.6rem; letter-spacing:-.06em; }
.latest-result__preview small { color:rgba(255,255,255,.72); line-height:1.25; }
.latest-result__body h3 { margin:.42rem 0 .35rem; font-size:1.65rem; letter-spacing:-.045em; }
.latest-result__body p { max-width:620px; margin:0 0 .9rem; color:var(--ink-soft); font-size:.76rem; line-height:1.55; }
.result-badge { display:inline-flex; padding:.32rem .5rem; border-radius:999px; background:var(--green-soft); color:var(--green); font-size:.5rem; font-weight:950; letter-spacing:.09em; }
.latest-result__sparkles { align-self:start; color:#c59d2a; font-size:1rem; line-height:1.8; opacity:.65; text-align:center; }
.rubric-grid { display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:.7rem; }
.rubric-card { padding:.85rem; border:1px solid var(--line); border-radius:18px; background:#fbfcfe; }
.rubric-card__top { display:flex; justify-content:space-between; gap:.5rem; align-items:end; }
.rubric-card__top span { color:var(--ink-soft); font-size:.58rem; font-weight:850; }
.rubric-card__top strong { color:var(--wine); font-size:.72rem; }
.rubric-card__track { height:8px; margin-top:.7rem; overflow:hidden; border-radius:999px; background:#edf1f5; }
.rubric-card__track span { display:block; height:100%; border-radius:999px; background:linear-gradient(90deg,var(--wine),#d2527a); box-shadow:0 0 18px rgba(169,21,76,.2); }
.page-fade-enter-active,.page-fade-leave-active { transition:opacity .32s ease, transform .32s ease; }
.page-fade-enter-from,.page-fade-leave-to { opacity:0; transform:translateY(8px); }
.state-orbit { position:relative; width:84px; height:84px; }
.state-orbit::before,.state-orbit::after,.state-orbit span { position:absolute; inset:0; border:1px solid rgba(169,21,76,.18); border-radius:50%; content:""; }
.state-orbit::after { inset:13px; border-color:rgba(216,169,25,.28); animation:spin 5s linear infinite; }
.state-orbit span { inset:27px; display:block; background:linear-gradient(145deg,var(--wine),var(--gold)); box-shadow:0 0 30px rgba(169,21,76,.24); animation:pulse 2s ease-in-out infinite; }
@keyframes spin { to { transform:rotate(360deg); } }
@keyframes pulse { 50% { transform:scale(.82); opacity:.68; } }
.state-icon { display:grid; width:70px; height:70px; place-items:center; border-radius:24px; background:#fff1f4; color:var(--wine); font-size:1.6rem; font-weight:950; }

@media (max-width:1100px) {
  .hero-panel { grid-template-columns:1fr; }
  .hero-panel__visual { min-height:180px; justify-content:flex-start; }
  .metric-grid, .smart-strip { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .focus-grid, .student-focus-grid { grid-template-columns:1fr; }
  .attendance-strip { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .student-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .rubric-grid { grid-template-columns:repeat(3,minmax(0,1fr)); }
}
@media (max-width:720px) {
  .dashboard-v3 { padding-inline:.25rem; }
  .hero-panel { padding:1.25rem; border-radius:24px; }
  .hero-panel h1 { font-size:clamp(3rem,14vw,4.5rem); }
  .metric-grid, .smart-strip, .attendance-strip, .student-grid, .quick-resource-grid, .rubric-grid { grid-template-columns:1fr; }
  .next-class-card, .latest-result { grid-template-columns:1fr; }
  .next-class-card__visual { min-height:160px; }
  .latest-result__sparkles { display:none; }
  .section-heading--wide { align-items:flex-start; }
  .section-link { margin-left:auto; }
  .hero-panel__visual { min-height:230px; }
  .floating-orb--one { right:1%; top:2%; }
  .floating-orb--two { left:1%; bottom:1%; }
}
@media (prefers-reduced-motion: reduce) {
  .dashboard-v3 *, .dashboard-v3 *::before, .dashboard-v3 *::after { animation-duration:.001ms !important; animation-iteration-count:1 !important; transition-duration:.001ms !important; scroll-behavior:auto !important; }
}


/* =========================================================
   V4 · CINEMATIC GLOW / LIGHTFIELD
   Corrección: contraste real del nombre + profundidad +
   partículas, halos, reflejos y microinteracciones.
========================================================= */
.dashboard-v3 {
  --shadow-deep: 0 24px 70px rgba(24, 36, 58, .10);
}

/* ---------- HERO · CONTRASTE + ATMÓSFERA ---------- */
.hero-panel {
  min-height: 360px;
  border: 1px solid rgba(255,255,255,.10);
  box-shadow:
    0 30px 90px rgba(24,36,58,.18),
    0 0 0 1px rgba(255,255,255,.03) inset;
}

.hero-panel::before {
  position:absolute;
  inset:-18%;
  z-index:0;
  content:"";
  pointer-events:none;
  background:
    radial-gradient(circle at 14% 88%, rgba(169,21,76,.22), transparent 24%),
    radial-gradient(circle at 54% 112%, rgba(216,169,25,.24), transparent 22%),
    radial-gradient(circle at 82% 12%, rgba(214,74,127,.18), transparent 22%);
  filter: blur(12px);
  transform: translate3d(0,0,0) scale(1);
  animation: heroLightfield 14s ease-in-out infinite alternate;
}

.hero-panel::after {
  z-index:0;
  background:
    radial-gradient(ellipse at 50% 100%, rgba(255,255,255,.17), transparent 58%),
    linear-gradient(120deg, transparent 18%, rgba(255,255,255,.045) 42%, transparent 60%);
  animation: heroSheen 12s ease-in-out infinite;
}

.hero-panel__grid {
  z-index:1;
  background-image:
    linear-gradient(rgba(255,255,255,.027) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,.027) 1px, transparent 1px),
    radial-gradient(circle, rgba(255,255,255,.16) 0 1px, transparent 1.5px),
    radial-gradient(circle, rgba(216,169,25,.18) 0 1px, transparent 1.7px),
    radial-gradient(circle, rgba(201,35,94,.18) 0 1px, transparent 1.6px);
  background-size:42px 42px,42px 42px,86px 86px,124px 124px,156px 156px;
  background-position:0 0,0 0,8px 18px,34px 10px,64px 48px;
  opacity:.7;
  animation: particleDrift 22s linear infinite;
}

.hero-panel__grid::before,
.hero-panel__grid::after {
  position:absolute;
  inset:0;
  content:"";
  pointer-events:none;
  mix-blend-mode:screen;
}
.hero-panel__grid::before {
  background:radial-gradient(circle at 22% 28%, rgba(255,255,255,.12) 0 1px, transparent 1.6px),
             radial-gradient(circle at 74% 34%, rgba(255,255,255,.10) 0 1px, transparent 1.7px),
             radial-gradient(circle at 60% 74%, rgba(216,169,25,.14) 0 1px, transparent 1.6px);
  background-size:120px 120px,150px 150px,180px 180px;
  animation: microStars 8s ease-in-out infinite alternate;
}
.hero-panel__grid::after {
  background:linear-gradient(115deg, transparent 22%, rgba(255,255,255,.06) 46%, transparent 67%);
  transform:translateX(-120%);
  animation: lightSweep 9s ease-in-out infinite;
}

.hero-panel__ambient--wine {
  width:380px;
  height:380px;
  right:10%;
  top:-170px;
  filter:blur(10px);
  background:radial-gradient(circle, rgba(201,35,94,.46), rgba(201,35,94,.12) 35%, transparent 68%);
  animation: ambientWine 10s ease-in-out infinite alternate;
}
.hero-panel__ambient--gold {
  width:340px;
  height:340px;
  left:36%;
  bottom:-210px;
  filter:blur(9px);
  background:radial-gradient(circle, rgba(221,174,32,.34), rgba(221,174,32,.10) 35%, transparent 70%);
  animation: ambientGold 12s ease-in-out infinite alternate;
}

.hero-panel__copy {
  z-index:3;
}

/* Corrige definitivamente el problema de contraste del nombre. */
.hero-panel h1,
.hero-panel h1 strong {
  color:#fff !important;
  text-shadow:0 9px 28px rgba(0,0,0,.22);
}
.hero-panel h1 strong {
  position:relative;
  display:inline-block;
  letter-spacing:-.085em;
}
.hero-panel h1 strong::after {
  position:absolute;
  left:0;
  right:0;
  bottom:-.04em;
  height:4px;
  content:"";
  border-radius:999px;
  background:linear-gradient(90deg, rgba(216,169,25,0), rgba(216,169,25,.95), rgba(216,169,25,0));
  filter:blur(1px);
  opacity:.56;
  transform:scaleX(.72);
  animation:nameUnderline 4.8s ease-in-out infinite;
}
.hero-panel h1 span {
  color:#e6b92c !important;
  text-shadow:0 0 26px rgba(216,169,25,.34);
}

.hero-panel p {
  color:rgba(255,255,255,.80) !important;
  text-shadow:0 2px 16px rgba(0,0,0,.12);
}

.hero-panel__chips span {
  position:relative;
  overflow:hidden;
  border-color:rgba(255,255,255,.16);
  box-shadow:0 8px 30px rgba(0,0,0,.08), inset 0 1px 0 rgba(255,255,255,.06);
  transition:transform .35s ease, border-color .35s ease, background .35s ease, box-shadow .35s ease;
}
.hero-panel__chips span::after {
  position:absolute;
  top:0;
  left:-80%;
  width:45%;
  height:100%;
  content:"";
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.18), transparent);
  transform:skewX(-18deg);
  animation:chipSweep 6.5s ease-in-out infinite;
}
.hero-panel__chips span:hover {
  transform:translateY(-3px);
  border-color:rgba(255,255,255,.26);
  background:rgba(255,255,255,.085);
  box-shadow:0 12px 34px rgba(0,0,0,.12), 0 0 24px rgba(216,169,25,.06);
}

/* ---------- VISUAL CARD ---------- */
.hero-visual-card,
.student-life-card {
  overflow:hidden;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.14),
    inset 0 0 0 1px rgba(255,255,255,.035),
    0 30px 80px rgba(0,0,0,.24),
    0 0 60px rgba(169,21,76,.08);
}
.hero-visual-card::before,
.student-life-card::before {
  position:absolute;
  inset:-40%;
  content:"";
  background:conic-gradient(from 180deg, transparent 0 28%, rgba(255,255,255,.08) 38%, transparent 48% 65%, rgba(216,169,25,.07) 73%, transparent 82%);
  animation: cardOrbit 13s linear infinite;
  pointer-events:none;
}
.hero-visual-card > *,
.student-life-card > * {
  position:relative;
  z-index:1;
}
.hero-visual-card strong {
  color:#fff !important;
  text-shadow:0 6px 18px rgba(0,0,0,.20);
}
.hero-visual-card small {
  color:rgba(255,255,255,.72) !important;
}
.hero-visual-card__meter span {
  position:relative;
  overflow:hidden;
  background:linear-gradient(90deg,#d9a91b,#fff1a4,#d9a91b);
  background-size:200% 100%;
  animation:meterFlow 4s linear infinite;
}
.hero-visual-card__meter span::after {
  position:absolute;
  inset:0;
  content:"";
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
  transform:translateX(-100%);
  animation:meterSweep 3.8s ease-in-out infinite;
}

.floating-orb {
  border-color:rgba(255,255,255,.22);
  box-shadow:0 16px 42px rgba(0,0,0,.26), 0 0 38px rgba(216,169,25,.18);
  backdrop-filter:blur(16px);
}
.floating-orb::before {
  position:absolute;
  inset:7px;
  border:1px solid rgba(255,255,255,.10);
  border-radius:50%;
  content:"";
  animation:orbRing 6s linear infinite;
}

/* ---------- METRIC CARDS · VIDA / LUZ ---------- */
.metric-card {
  border-color:rgba(221,229,238,.95);
  box-shadow:0 12px 30px rgba(24,36,58,.045), inset 0 1px 0 rgba(255,255,255,.82);
  transition:transform .42s cubic-bezier(.2,.75,.2,1), box-shadow .42s ease, border-color .42s ease;
}
.metric-card::before {
  width:220px;
  height:220px;
  inset:-90px auto auto -68px;
  filter:blur(24px);
  opacity:.9;
  transform:scale(.88);
  transition:transform .55s ease, opacity .45s ease;
}
.metric-card::after {
  position:absolute;
  inset:0;
  content:"";
  background:linear-gradient(115deg, transparent 32%, rgba(255,255,255,.42) 46%, transparent 60%);
  transform:translateX(-130%);
  pointer-events:none;
}
.metric-card:hover {
  transform:translateY(-8px) scale(1.012);
  box-shadow:
    0 24px 54px rgba(24,36,58,.11),
    0 0 0 1px var(--tone-border,rgba(216,169,25,.25)),
    0 0 36px var(--tone-glow,rgba(216,169,25,.10));
}
.metric-card:hover::before { transform:scale(1.18); opacity:1; }
.metric-card:hover::after { animation:metricSweep 1.2s ease forwards; }
.metric-card__icon {
  transition:transform .42s cubic-bezier(.2,.75,.2,1), box-shadow .42s ease;
}
.metric-card:hover .metric-card__icon {
  transform:translateY(-2px) rotate(-3deg) scale(1.06);
  box-shadow:
    inset 0 0 0 1px var(--tone-border,rgba(216,169,25,.18)),
    0 8px 22px var(--tone-glow,rgba(216,169,25,.12));
}
.metric-card__body strong {
  transition:transform .35s ease, text-shadow .35s ease;
}
.metric-card:hover .metric-card__body strong {
  transform:translateX(2px);
  text-shadow:0 6px 20px var(--tone-glow,rgba(216,169,25,.10));
}

/* ---------- BLOQUES INTERIORES ---------- */
.focus-card,
.wide-panel {
  border-color:rgba(221,229,238,.96);
  box-shadow:0 14px 36px rgba(24,36,58,.05), inset 0 1px 0 rgba(255,255,255,.88);
  transition:transform .4s cubic-bezier(.2,.75,.2,1), box-shadow .4s ease, border-color .4s ease;
}
.focus-card::before,
.wide-panel::before {
  position:absolute;
  inset:0;
  content:"";
  background:radial-gradient(circle at 84% 8%, rgba(216,169,25,.09), transparent 22%);
  pointer-events:none;
}
.focus-card:hover,
.wide-panel:hover {
  transform:translateY(-4px);
  border-color:rgba(169,21,76,.14);
  box-shadow:0 24px 58px rgba(24,36,58,.08), 0 0 34px rgba(169,21,76,.035);
}
.section-heading .section-index {
  position:relative;
  overflow:hidden;
  box-shadow:0 0 0 5px rgba(216,169,25,.035), 0 0 24px rgba(216,169,25,.08);
}
.section-heading .section-index::after {
  position:absolute;
  top:-30%;
  left:-70%;
  width:45%;
  height:160%;
  content:"";
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.7), transparent);
  transform:rotate(18deg);
  animation:indexSweep 5.6s ease-in-out infinite;
}

/* ---------- NEXT CLASS ---------- */
.next-class-card {
  box-shadow:0 16px 36px rgba(24,36,58,.07);
  transition:transform .42s cubic-bezier(.2,.75,.2,1), box-shadow .42s ease;
}
.next-class-card:hover {
  transform:translateY(-5px);
  box-shadow:0 26px 54px rgba(24,36,58,.11), 0 0 34px rgba(216,169,25,.07);
}
.next-class-card__visual {
  overflow:hidden;
}
.next-class-card__visual::before {
  position:absolute;
  inset:-30%;
  content:"";
  background:radial-gradient(circle at 50% 45%, rgba(255,255,255,.18), transparent 28%);
  animation:visualPulse 6s ease-in-out infinite;
}
.next-class-card__visual::after {
  position:absolute;
  top:-120%;
  left:-35%;
  width:35%;
  height:300%;
  content:"";
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.16), transparent);
  transform:rotate(18deg);
  animation:visualSweep 7.5s ease-in-out infinite;
}
.next-class-card__visual > * { position:relative; z-index:1; }

/* ---------- ASISTENCIA / ALUMNOS ---------- */
.attendance-item,
.student-card,
.review-row,
.task-row,
.smart-item,
.quick-resource {
  transition:transform .36s cubic-bezier(.2,.75,.2,1), box-shadow .36s ease, border-color .36s ease, background .36s ease;
}
.attendance-item:hover,
.student-card:hover,
.review-row:hover,
.task-row:hover,
.smart-item:hover,
.quick-resource:hover {
  transform:translateY(-5px);
  box-shadow:0 18px 42px rgba(24,36,58,.09), 0 0 26px rgba(169,21,76,.035);
}
.attendance-item::before,
.student-card::before,
.smart-item::before,
.quick-resource::before {
  position:absolute;
  width:120px;
  height:120px;
  top:-65px;
  right:-45px;
  border-radius:50%;
  content:"";
  background:radial-gradient(circle, rgba(216,169,25,.10), transparent 68%);
  filter:blur(10px);
  pointer-events:none;
}

/* ---------- STUDENT LIFE ---------- */
.life-ring {
  animation:lifeBreathe 4.8s ease-in-out infinite;
}
.life-ring--gold { animation-delay:-1.7s; }
.student-life-card__quote {
  position:relative;
  overflow:hidden;
}
.student-life-card__quote::after {
  position:absolute;
  top:0;
  left:-70%;
  width:45%;
  height:100%;
  content:"";
  background:linear-gradient(90deg, transparent, rgba(255,255,255,.10), transparent);
  transform:skewX(-18deg);
  animation:quoteSweep 7s ease-in-out infinite;
}

/* ---------- TOAST / STATES ---------- */
.lux-button,
.section-link,
.text-link,
.dashboard-v3 a {
  -webkit-tap-highlight-color:transparent;
}
.lux-button {
  transition:transform .3s cubic-bezier(.2,.75,.2,1), box-shadow .3s ease, filter .3s ease;
}
.lux-button:hover {
  transform:translateY(-2px);
  filter:saturate(1.05);
}

/* ---------- KEYFRAMES ---------- */
@keyframes heroLightfield {
  0% { transform:translate3d(-1%,0,0) scale(.98); }
  100% { transform:translate3d(3%,-2%,0) scale(1.04); }
}
@keyframes heroSheen {
  0%, 72% { opacity:.7; background-position:-120% 0; }
  88%,100% { opacity:1; background-position:120% 0; }
}
@keyframes particleDrift {
  from { background-position:0 0, 0 0, 8px 18px, 34px 10px, 64px 48px; }
  to { background-position:0 42px, 42px 0, 46px 66px, -24px 52px, 118px -22px; }
}
@keyframes microStars {
  0% { opacity:.35; transform:translate3d(0,0,0); }
  100% { opacity:.8; transform:translate3d(8px,-5px,0); }
}
@keyframes lightSweep { 0%, 58% { transform:translateX(-120%); opacity:0; } 68% { opacity:.75; } 82%,100% { transform:translateX(120%); opacity:0; } }
@keyframes ambientWine { from { transform:translate3d(-10px,0,0) scale(.96); } to { transform:translate3d(18px,12px,0) scale(1.08); } }
@keyframes ambientGold { from { transform:translate3d(-10px,12px,0) scale(.94); } to { transform:translate3d(16px,-12px,0) scale(1.07); } }
@keyframes nameUnderline { 0%,100% { opacity:.28; transform:scaleX(.65); } 50% { opacity:.78; transform:scaleX(1); } }
@keyframes chipSweep { 0%,68% { left:-80%; } 88%,100% { left:140%; } }
@keyframes cardOrbit { to { transform:rotate(360deg); } }
@keyframes meterFlow { to { background-position:200% 0; } }
@keyframes meterSweep { 0%,45% { transform:translateX(-100%); } 72%,100% { transform:translateX(110%); } }
@keyframes orbRing { to { transform:rotate(360deg); } }
@keyframes metricSweep { from { transform:translateX(-130%); } to { transform:translateX(140%); } }
@keyframes indexSweep { 0%,60% { left:-70%; } 80%,100% { left:140%; } }
@keyframes visualPulse { 0%,100% { transform:scale(.92); opacity:.45; } 50% { transform:scale(1.08); opacity:.9; } }
@keyframes visualSweep { 0%,58% { transform:translate3d(-100%,-100%,0) rotate(18deg); opacity:0; } 70% { opacity:.9; } 86%,100% { transform:translate3d(420%,140%,0) rotate(18deg); opacity:0; } }
@keyframes lifeBreathe { 0%,100% { transform:scale(1); box-shadow:0 0 0 8px rgba(60,169,127,.06),0 0 32px rgba(60,169,127,.12); } 50% { transform:scale(1.025); box-shadow:0 0 0 11px rgba(60,169,127,.045),0 0 44px rgba(60,169,127,.18); } }
@keyframes quoteSweep { 0%,65% { left:-70%; } 82%,100% { left:140%; } }

@media (prefers-reduced-motion: reduce) {
  .hero-panel::before,
  .hero-panel::after,
  .hero-panel__grid,
  .hero-panel__grid::before,
  .hero-panel__grid::after,
  .hero-panel__ambient,
  .hero-panel h1 strong::after,
  .hero-panel__chips span::after,
  .hero-visual-card::before,
  .student-life-card::before,
  .floating-orb::before,
  .hero-visual-card__meter span,
  .hero-visual-card__meter span::after,
  .metric-card::after,
  .section-heading .section-index::after,
  .next-class-card__visual::before,
  .next-class-card__visual::after,
  .student-life-card__quote::after,
  .life-ring {
    animation:none !important;
  }
}

</style>


<style lang="scss">
/* AMV UI POLISH 2026 — visual consistency, accessibility and mobile resilience. */
.amv-view-shell {
  --amv-ui-wine: #9f1945;
  --amv-ui-wine-deep: #7f1237;
  --amv-ui-gold: #d9a91d;
  --amv-ui-purple: #7657d9;
  --amv-ui-cyan: #20b8ae;
  --amv-ui-ink: #172033;
  --amv-ui-muted: #6f7c8f;
  --amv-ui-line: rgba(122, 137, 158, 0.20);
  --amv-ui-focus: rgba(159, 25, 69, 0.38);
  --amv-ui-radius-sm: 12px;
  --amv-ui-radius-md: 18px;
  --amv-ui-radius-lg: 26px;
  --amv-ui-shadow: 0 18px 55px rgba(17, 25, 39, 0.09);
  --amv-ui-shadow-hover: 0 22px 65px rgba(17, 25, 39, 0.14);
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  isolation: isolate;
  overflow-x: clip;
  -webkit-tap-highlight-color: transparent;
}

.amv-view-shell::before {
  content: '';
  position: absolute;
  inset: -150px -120px auto auto;
  width: 420px;
  height: 420px;
  pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(159, 25, 69, 0.10), transparent 52%),
    radial-gradient(circle at 68% 62%, rgba(217, 169, 29, 0.08), transparent 58%);
  filter: blur(6px);
  opacity: 0.82;
  z-index: -1;
}

.amv-view-shell :where(*, *::before, *::after) {
  box-sizing: border-box;
}

.amv-view-shell :where(img, video, svg, canvas) {
  max-width: 100%;
}

.amv-view-shell :where(h1, h2, h3, h4, h5, h6) {
  text-wrap: balance;
}

.amv-view-shell :where(p, li, td, th, label, small) {
  overflow-wrap: anywhere;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']) {
  touch-action: manipulation;
}

.amv-view-shell :where(button, input, select, textarea) {
  font: inherit;
}

.amv-view-shell :where(button) {
  min-height: 42px;
}

.amv-view-shell :where(input, select, textarea) {
  max-width: 100%;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']):focus-visible {
  outline: 3px solid var(--amv-ui-focus);
  outline-offset: 3px;
}

.amv-view-shell :where(button, [role='button']):disabled,
.amv-view-shell :where(input, select, textarea):disabled {
  cursor: not-allowed;
}

.amv-view-shell :where(.button, .btn, .lux-button, .amv-primary-btn, .amv-secondary-action,
  .primary-action, .secondary-action, .danger-action, .text-link, .action-link,
  .lightbox__close, .lightbox__nav, .today-button, .quick-action) {
  -webkit-user-select: none;
  user-select: none;
}

/* Premium surface language without changing each view's semantic palette. */
.amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
  .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
  .resource-card, .student-card, .lesson-card, .task-card, .format-card,
  .production, .sound-console, .state-card, .empty-card, .workspace,
  .profile-card, .profile-panel, .vocal-card, .weighted-student, .weighted-category) {
  border-radius: var(--amv-ui-radius-md);
}

.amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
  .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
  .task-card, .format-card, .production, .state-card, .empty-card) {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
    .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
    .task-card, .format-card, .production):not(.is-disabled):hover {
    transform: translateY(-2px);
  }
}

/* Toolbars wrap rather than squeezing controls into unreadable rows. */
.amv-view-shell :where(.toolbar, .students-toolbar, .calendar-toolbar, .resources-controls,
  .resources-controls__row, .gradebook-legacy-toolbar, .hero-actions, .actions,
  .action-row, .question-actions, .filters, .public-jump-nav, .classes-header__actions,
  .result-action-row, .form-actions, .footer-actions) {
  min-width: 0;
}

.amv-view-shell :where(.table-shell, .quiz-table-wrap, .table-wrap, .grade-table-wrap,
  .data-table-wrap, .scroll-region, .horizontal-scroll) {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.amv-view-shell :where(.table-shell table, .quiz-table-wrap table, .table-wrap table,
  .grade-table-wrap table, .data-table-wrap table) {
  max-width: none;
}

/* Prevent long controls and badges from forcing page-level horizontal overflow. */
.amv-view-shell :where(.badge, .pill, .chip, .status-pill, .source-badge, .event-chip,
  .lesson-detail, .student-card__voice, .student-card__status, .course-kicker,
  .hero-stat, .count, .filename, .meta, .eyebrow) {
  max-width: 100%;
}

/* Dialogs/lightboxes stay usable on short laptop and phone viewports. */
.amv-view-shell :where(.modal, .dialog, .drawer, .lightbox, .lightbox__content,
  .modal__content, .dialog__content, [role='dialog']) {
  max-width: min(100%, 100vw);
}

.amv-view-shell :where(.modal__content, .dialog__content, .lightbox__content,
  [role='dialog']) {
  max-height: calc(100dvh - 28px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Public pages: a cleaner editorial frame around content-heavy sections. */
.amv-view-shell :where(.hero, .hero-panel, .calendar-hero, .resources-hero, .amv-hero,
  .students__header, .gradebook__hero, .classes-header, .contact-hero, .training-hero,
  .academy-hero, .inscription-hero) {
  isolation: isolate;
}

.amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid) {
  min-width: 0;
}

/* Mobile-first resilience. Existing view-specific breakpoints still win where more
   specific rules exist, while these defaults catch edge cases and tiny screens. */
@media (max-width: 760px) {
  .amv-view-shell {
    overflow-x: clip;
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 22px;
  }

  .amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid,
    .calendar-layout, .quiz-layout, .program-layout, .student-profile__grid,
    .dashboard-grid, .content-grid, .page-grid, .split-layout) {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .amv-view-shell :where(.hero-actions, .actions, .action-row, .form-actions,
    .footer-actions, .question-actions, .students__header-actions, .hero-stat,
    .calendar-toolbar, .resources-controls__row) {
    flex-wrap: wrap;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    min-width: min(100%, 190px);
  }

  .amv-view-shell :where(.display-title, .page-title, .hero-title, .section-title,
    .hero-panel__title, .amv-hero h1, .calendar-hero h1, .students__header h1,
    .gradebook__hero h1) {
    font-size: clamp(1.8rem, 7vw, 3rem);
    line-height: 1.05;
  }

  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .amv-view-shell :where(.students-toolbar, .resources-controls, .calendar-toolbar,
    .gradebook-legacy-toolbar, .classes-header, .section-heading, .profile-actions) {
    gap: 10px;
  }

  .amv-view-shell :where(input, select, textarea, .select, .search-input) {
    min-height: 44px;
  }
}

@media (max-width: 520px) {
  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: minmax(0, 1fr);
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 18px;
  }

  .amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
    .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
    .resource-card, .student-card, .lesson-card, .task-card, .format-card,
    .production, .state-card, .empty-card) {
    border-radius: 16px;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    width: 100%;
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .amv-view-shell,
  .amv-view-shell :where(*, *::before, *::after) {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
