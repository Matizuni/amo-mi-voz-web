<template>
  <section class="submissions amv-view-shell">
    <RouterLink
      :to="`/aula/clase/${lessonId}/tarea/${taskId}`"
      class="submissions__back"
    >
      <span aria-hidden="true">←</span>
      Volver a la tarea
    </RouterLink>

    <section v-if="isLoading" class="state-card">
      <div class="loading-spinner"></div>
      <div>
        <h1>Cargando entregas...</h1>
        <p>Sincronizando estudiantes, tarea y archivos desde Supabase.</p>
      </div>
    </section>

    <section v-else-if="loadError" class="state-card state-card--error">
      <div class="state-card__icon">!</div>
      <div>
        <h1>No pudimos cargar las entregas</h1>
        <p>{{ loadError }}</p>
      </div>
      <div class="state-card__actions">
        <button type="button" @click="loadPage">Reintentar</button>
        <RouterLink :to="`/aula/clase/${lessonId}/tarea/${taskId}`">Volver</RouterLink>
      </div>
    </section>

    <template v-else-if="task">
      <header class="submissions__hero">
        <div class="submissions__hero-main">
          <div class="submissions__eyebrow">
            <span>CLASE {{ lessonDisplayNumber }}</span>
            <span>ENTREGAS</span>
            <span class="submissions__evaluation-chip">{{ evaluationLabel }}</span>
          </div>

          <h1>{{ task.title }}</h1>
          <p>
            Revisa el avance de la actividad, abre los archivos privados
            y gestiona la revisión individual de cada estudiante.
          </p>
        </div>

        <aside class="submissions__hero-status" aria-label="Progreso de entregas">
          <div class="submissions__progress-ring" :style="{ '--progress': `${deliveryPercentage * 3.6}deg` }">
            <div>
              <strong>{{ deliveryPercentage }}%</strong>
              <span>progreso</span>
            </div>
          </div>
          <p><strong>{{ deliveredStudentCount }}</strong> de {{ students.length }} estudiantes entregaron</p>
        </aside>
      </header>

      <section class="submissions__summary" aria-label="Resumen de entregas">
        <article>
          <span class="summary-icon">◎</span>
          <div><small>ESTUDIANTES</small><strong>{{ students.length }}</strong><p>matrícula activa</p></div>
        </article>
        <article>
          <span class="summary-icon summary-icon--green">✓</span>
          <div><small>ENTREGADAS</small><strong>{{ deliveredStudentCount }}</strong><p>con archivo enviado</p></div>
        </article>
        <article>
          <span class="summary-icon summary-icon--gold">○</span>
          <div><small>PENDIENTES</small><strong>{{ pendingStudents.length }}</strong><p>sin entrega</p></div>
        </article>
        <article>
          <span class="summary-icon summary-icon--wine">✓</span>
          <div><small>REVISADAS</small><strong>{{ reviewedCount }}</strong><p>con revisión docente</p></div>
        </article>
        <article>
          <span class="summary-icon summary-icon--red">!</span>
          <div><small>SIN REVISAR</small><strong>{{ pendingReviewCount }}</strong><p>requieren atención</p></div>
        </article>
        <article v-if="usesGrade">
          <span class="summary-icon summary-icon--wine">★</span>
          <div><small>PUNTAJE</small><strong>{{ task.points ?? 100 }}</strong><p>máximo de la actividad</p></div>
        </article>
      </section>

      <section class="progress-card">
        <div class="progress-card__header">
          <div>
            <span>PROGRESO GENERAL</span>
            <strong>{{ deliveredStudentCount }} / {{ students.length }} entregas</strong>
          </div>
          <strong>{{ deliveryPercentage }}%</strong>
        </div>
        <div class="progress-card__bar">
          <div class="progress-card__fill" :style="{ width: `${deliveryPercentage}%` }"></div>
        </div>
      </section>

      <section class="submissions__toolbar">
        <div class="submissions__filters" aria-label="Filtros de estudiantes">
          <button type="button" :class="{ active: activeFilter === 'all' }" @click="activeFilter = 'all'">
            Todos <span>{{ students.length }}</span>
          </button>
          <button type="button" :class="{ active: activeFilter === 'delivered' }" @click="activeFilter = 'delivered'">
            Entregadas <span>{{ deliveredStudentCount }}</span>
          </button>
          <button type="button" :class="{ active: activeFilter === 'pending' }" @click="activeFilter = 'pending'">
            Pendientes <span>{{ pendingStudents.length }}</span>
          </button>
          <button type="button" :class="{ active: activeFilter === 'reviewed' }" @click="activeFilter = 'reviewed'">
            Revisadas <span>{{ reviewedCount }}</span>
          </button>
          <button type="button" :class="{ active: activeFilter === 'unreviewed' }" @click="activeFilter = 'unreviewed'">
            Sin revisar <span>{{ pendingReviewCount }}</span>
          </button>
        </div>

        <label class="submissions__search">
          <span aria-hidden="true">⌕</span>
          <input v-model.trim="searchTerm" type="search" placeholder="Buscar estudiante..." />
        </label>
      </section>

      <section class="student-list">
        <article
          v-for="student in filteredStudents"
          :key="student.id"
          class="student-row"
          :class="{
            'student-row--delivered': getSubmission(student.id),
            'student-row--reviewed': isReviewed(student.id)
          }"
        >
          <div class="student-row__identity">
            <div class="student-avatar">{{ getInitials(student.name) }}</div>
            <div>
              <span>{{ student.voice || 'Voz no definida' }}</span>
              <strong>{{ student.name }}</strong>
            </div>
          </div>

          <div class="student-row__status">
            <template v-if="getSubmission(student.id)">
              <span class="status-pill" :class="{ 'status-pill--reviewed': isReviewed(student.id) }">
                {{ isReviewed(student.id) ? 'REVISADA' : 'ENTREGADA' }}
              </span>
              <small>{{ formatDateTime(getSubmission(student.id).submittedAt) }}</small>
            </template>
            <template v-else>
              <span class="status-pill status-pill--pending">PENDIENTE</span>
              <small>Sin archivo</small>
            </template>
          </div>

          <div class="student-row__file">
            <template v-if="getSubmission(student.id)">
              <span class="student-row__file-label">ARCHIVO</span>
              <strong>{{ getSubmission(student.id).fileName || 'Archivo' }}</strong>
              <small>{{ formatFileSize(getSubmission(student.id).fileSize) }}</small>
            </template>
            <template v-else>
              <span class="student-row__file-label">ARCHIVO</span>
              <strong>—</strong>
              <small>Sin entrega</small>
            </template>
          </div>

          <div v-if="usesGrade" class="student-row__grade">
            <span>NOTA</span>
            <strong>
              {{ hasGrade(getSubmission(student.id)) ? formatGrade(getSubmission(student.id).grade) : '—' }}
            </strong>
          </div>

          <div class="student-row__actions">
            <button
              v-if="getSubmission(student.id)"
              type="button"
              class="action-button action-button--secondary"
              :disabled="openingSubmissionId === getSubmission(student.id).id"
              @click="openFile(getSubmission(student.id))"
            >
              {{ openingSubmissionId === getSubmission(student.id).id ? 'Abriendo...' : 'Ver archivo' }}
            </button>

            <RouterLink
              v-if="getSubmission(student.id)"
              :to="`/aula/clase/${lessonId}/tarea/${taskId}/entregas/${getSubmission(student.id).id}`"
              class="action-button action-button--primary"
            >
              {{ isReviewed(student.id) ? 'Ver evaluación' : 'Revisar entrega' }}
            </RouterLink>

            <RouterLink
              :to="`/aula/estudiante/${student.id}`"
              class="action-button action-button--ghost"
            >
              Ver perfil
            </RouterLink>
          </div>
        </article>

        <div v-if="!filteredStudents.length" class="student-list__empty">
          <span>⌕</span>
          <div>
            <strong>No encontramos estudiantes</strong>
            <p>Prueba con otro filtro o término de búsqueda.</p>
          </div>
        </div>
      </section>

      <section class="submissions__footer">
        <RouterLink :to="`/aula/clase/${lessonId}/tarea/${taskId}`">← Volver a la tarea</RouterLink>
        <RouterLink :to="`/aula/clase/${lessonId}/trabajo`">Trabajo de clase →</RouterLink>
      </section>
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

  useRoute

} from 'vue-router'

import {

  fetchStudents

} from '@/services/studentService'

import {

  fetchAssignmentById

} from '@/services/assignmentService'

import {

  fetchLessonById

} from '@/services/lessonService'

import {

  createSubmissionSignedUrl,

  fetchSubmissionsByAssignment

} from '@/services/submissionService'

/* =========================================================

   ROUTE

========================================================= */

const route = useRoute()

const lessonId = computed(() =>

  Number(

    route.params.id

  )

)

const taskId = computed(() =>

  Number(

    route.params.taskId

  )

)

/* =========================================================

   DATOS

========================================================= */

const task = ref(null)

const lesson = ref(null)

const students = ref([])

const submissions = ref([])

const isLoading = ref(true)

const loadError = ref('')

const activeFilter = ref('all')

const searchTerm = ref('')

const openingSubmissionId =

  ref(null)

const lessonDisplayNumber = computed(() => {
  const number = Number(
    lesson.value?.lessonNumber
  )

  if (
    !Number.isInteger(number) ||
    number <= 0
  ) {
    return '—'
  }

  return String(number).padStart(2, '0')
})

/* =========================================================

   CARGAR PÁGINA

========================================================= */

const loadPage = async () => {

  isLoading.value = true

  loadError.value = ''

  try {

    const [

      loadedStudents,

      loadedLesson,

      loadedTask,

      loadedSubmissions

    ] = await Promise.all([

      fetchStudents(),

      fetchLessonById(

        lessonId.value

      ),

      fetchAssignmentById(

        taskId.value

      ),

      fetchSubmissionsByAssignment(

        taskId.value

      )

    ])

    if (

      !loadedTask ||

      Number(

        loadedTask.lessonId

      ) !==

        Number(

          lessonId.value

        )

    ) {

      throw new Error(

        'La tarea no corresponde a esta clase.'

      )

    }

    lesson.value =

      loadedLesson

    students.value =

      sortStudents(

        loadedStudents || []

      )

    task.value =

      loadedTask

    submissions.value =

      loadedSubmissions || []

  } catch (error) {

    console.error(

      'Error cargando entregas:',

      error

    )

    lesson.value = null

    students.value = []

    task.value = null

    submissions.value = []

    loadError.value =

      error?.message ||

      'No se pudieron cargar las entregas desde Supabase.'

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

        voiceOrder[a.voice] ||

        99

      const voiceB =

        voiceOrder[b.voice] ||

        99

      if (

        voiceA !== voiceB

      ) {

        return (

          voiceA -

          voiceB

        )

      }

      return String(

        a.name || ''

      ).localeCompare(

        String(

          b.name || ''

        ),

        'es'

      )

    }

  )

/* =========================================================

   MAPA DE ENTREGAS

========================================================= */

const submissionMap =

  computed(() => {

    const map =

      new Map()

    submissions.value.forEach(

      submission => {

        map.set(

          Number(

            submission.studentId

          ),

          submission

        )

      }

    )

    return map

  })

const getSubmission =

  studentId =>

    submissionMap.value.get(

      Number(studentId)

    ) || null

/* =========================================================

   ALUMNOS CON ENTREGA

========================================================= */

const deliveredStudents =

  computed(() =>

    students.value.filter(

      student =>

        Boolean(

          getSubmission(

            student.id

          )

        )

    )

  )

const deliveredStudentCount =

  computed(() =>

    deliveredStudents.value.length

  )

/* =========================================================

   PENDIENTES

========================================================= */

const pendingStudents =

  computed(() =>

    students.value.filter(

      student =>

        !getSubmission(

          student.id

        )

    )

  )

/* =========================================================

   REVISADAS

========================================================= */

const isReviewed = studentId => {

  const submission =

    getSubmission(

      studentId

    )

  if (!submission) {

    return false

  }

  return Boolean(

    submission.status ===

      'reviewed' ||

    submission.status ===

      'returned' ||

    submission.reviewedAt ||

    hasGrade(submission)

  )

}

const reviewedCount =

  computed(() =>

    students.value.filter(

      student =>

        isReviewed(

          student.id

        )

    ).length

  )

/* =========================================================

   SIN REVISAR

========================================================= */

const pendingReviewCount =

  computed(() =>

    students.value.filter(

      student => {

        const submission =

          getSubmission(

            student.id

          )

        return (

          Boolean(submission) &&

          !isReviewed(

            student.id

          )

        )

      }

    ).length

  )

/* =========================================================

   PORCENTAJE

========================================================= */

const deliveryPercentage =

  computed(() => {

    if (

      !students.value.length

    ) {

      return 0

    }

    return Math.round(

      (

        deliveredStudentCount.value /

        students.value.length

      ) * 100

    )

  })

/* =========================================================

   NOTAS

========================================================= */

const hasGrade = submission => {

  if (!submission) {

    return false

  }

  if (

    submission.grade === null ||

    submission.grade ===

      undefined ||

    submission.grade === ''

  ) {

    return false

  }

  return Number.isFinite(

    Number(

      submission.grade

    )

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

   FILTROS

========================================================= */

const filteredStudents =

  computed(() => {

    const term =

      searchTerm.value

        .trim()

        .toLowerCase()

    return students.value.filter(

      student => {

        const submission =

          getSubmission(

            student.id

          )

        const matchesSearch =

          !term ||

          String(

            student.name || ''

          )

            .toLowerCase()

            .includes(term) ||

          String(

            student.voice || ''

          )

            .toLowerCase()

            .includes(term)

        if (!matchesSearch) {

          return false

        }

        if (

          activeFilter.value ===

          'delivered'

        ) {

          return Boolean(

            submission

          )

        }

        if (

          activeFilter.value ===

          'pending'

        ) {

          return !submission

        }

        if (

          activeFilter.value ===

          'reviewed'

        ) {

          return isReviewed(

            student.id

          )

        }

        if (

          activeFilter.value ===

          'unreviewed'

        ) {

          return (

            Boolean(

              submission

            ) &&

            !isReviewed(

              student.id

            )

          )

        }

        return true

      }

    )

  })

/* =========================================================

   ABRIR ARCHIVO PRIVADO

========================================================= */

const openFile = async submission => {

  if (

    !submission?.storagePath ||

    openingSubmissionId.value

  ) {

    return

  }

  openingSubmissionId.value =

    submission.id

  try {

    const signedUrl =

      await createSubmissionSignedUrl(

        submission.storagePath,

        3600

      )

    if (!signedUrl) {

      throw new Error(

        'No se pudo generar el enlace temporal.'

      )

    }

    window.open(

      signedUrl,

      '_blank',

      'noopener,noreferrer'

    )

  } catch (error) {

    console.error(

      'Error abriendo entrega:',

      error

    )

    window.alert(

      error?.message ||

      'No se pudo abrir el archivo.'

    )

  } finally {

    openingSubmissionId.value =

      null

  }

}

/* =========================================================

   INICIALES

========================================================= */

const getInitials = name =>

  String(

    name || '?'

  )

    .trim()

    .split(/\s+/)

    .filter(Boolean)

    .slice(0, 2)

    .map(

      part =>

        part

          .charAt(0)

          .toUpperCase()

    )

    .join('')

/* =========================================================

   FECHA

========================================================= */

const formatDateTime = value => {

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

      dateStyle:

        'medium',

      timeStyle:

        'short'

    }

  ).format(date)

}

/* =========================================================

   TAMAÑO

========================================================= */

const formatFileSize = bytes => {

  const value =

    Number(bytes)

  if (

    !Number.isFinite(value) ||

    value <= 0

  ) {

    return '0 B'

  }

  if (

    value < 1024

  ) {

    return `${value} B`

  }

  if (

    value <

    1024 * 1024

  ) {

    return `${(

      value /

      1024

    ).toFixed(1)} KB`

  }

  return `${(

    value /

    (1024 * 1024)

  ).toFixed(1)} MB`

}

/* =========================================================

   CAMBIO DE RUTA

========================================================= */

watch(

  () => [

    route.params.id,

    route.params.taskId

  ],

  () => {

    activeFilter.value =

      'all'

    searchTerm.value =

      ''

    loadPage()

  }

)

/* =========================================================

   INICIO

========================================================= */

onMounted(
  loadPage
)

/* =========================================================
   TIPO DE EVALUACIÓN
========================================================= */

const evaluationType = computed(() =>
  task.value?.evaluationType ||
  'simple'
)

const usesGrade = computed(() =>
  [
    'graded',
    'vocal_rubric',
    'custom_rubric'
  ].includes(
    evaluationType.value
  )
)

const evaluationLabel = computed(() => {
  const labels = {
    simple: 'Entrega simple',
    graded: 'Calificada',
    vocal_rubric: 'Rúbrica vocal',
    custom_rubric: 'Rúbrica personalizada'
  }

  return (
    labels[evaluationType.value] ||
    'Entrega simple'
  )
})

</script>

<style scoped>
.submissions {
  --canvas: #f5f7fb;
  --card: #fff;
  --ink: #172033;
  --body: #344359;
  --muted: #667085;
  --line: #dbe3ec;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --wine-soft: #fff1f5;
  --gold: #d9a91d;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #eef9f4;
  --red: #be4856;
  --red-soft: #fff2f3;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  color: var(--ink);
  animation: view-enter .35s ease both;
}
* { box-sizing: border-box; }
.submissions__back {
  display: inline-flex; align-items: center; gap: 8px; margin-bottom: 22px;
  color: var(--wine); font-weight: 750; text-decoration: none;
}
.submissions__back:hover { color: var(--wine-dark); }

.submissions__hero {
  display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 32px; align-items: center;
  margin-bottom: 18px; padding: clamp(26px, 4vw, 42px);
  border: 1px solid var(--line); border-radius: 24px; background:
  radial-gradient(circle at 92% 10%, rgba(217,169,29,.13), transparent 30%),
  linear-gradient(135deg, #fff 0%, #fbfcfe 100%);
  box-shadow: 0 18px 45px rgba(23,32,51,.07);
}
.submissions__hero-main { max-width: 900px; }
.submissions__eyebrow { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:14px; }
.submissions__eyebrow span {
  padding: 6px 10px; border: 1px solid #e4e8ef; border-radius:999px;
  background:#fff; color:var(--muted); font-size:.72rem; font-weight:800; letter-spacing:.05em;
}
.submissions__eyebrow .submissions__evaluation-chip {
  border-color: rgba(159,25,69,.18); background:var(--wine-soft); color:var(--wine);
}
.submissions__hero h1 {
  margin:0 0 10px; color:var(--ink); font-size:clamp(2rem,4vw,3.5rem);
  line-height:1.02; letter-spacing:-.045em;
}
.submissions__hero h1::after {
  content:""; display:block; width:74px; height:4px; margin-top:15px;
  border-radius:999px; background:linear-gradient(90deg,var(--gold),#f0ca58);
}
.submissions__hero p { max-width:760px; margin:15px 0 0; color:var(--body); line-height:1.65; }

.submissions__hero-status {
  display:flex; align-items:center; gap:16px; min-width:290px; padding:18px;
  border:1px solid var(--line); border-radius:20px; background:rgba(255,255,255,.84);
}
.submissions__progress-ring {
  --progress: 0deg; display:grid; width:94px; height:94px; flex:0 0 auto; place-items:center;
  border-radius:50%; background:conic-gradient(var(--wine) var(--progress), #edf1f5 0);
}
.submissions__progress-ring::before {
  content:""; grid-area:1/1; width:76px; height:76px; border-radius:50%; background:#fff;
}
.submissions__progress-ring > div { grid-area:1/1; z-index:1; text-align:center; }
.submissions__progress-ring strong { display:block; font-size:1.35rem; color:var(--wine); }
.submissions__progress-ring span { display:block; margin-top:1px; color:var(--muted); font-size:.68rem; }
.submissions__hero-status p { margin:0; color:var(--muted); font-size:.9rem; line-height:1.45; }
.submissions__hero-status p strong { color:var(--ink); }

.submissions__summary {
  display:grid; grid-template-columns:repeat(5,minmax(0,1fr)); gap:12px; margin-bottom:14px;
}
.submissions__summary:has(article:nth-child(6)) { grid-template-columns:repeat(6,minmax(0,1fr)); }
.submissions__summary article {
  display:flex; gap:12px; align-items:center; min-width:0; padding:17px;
  border:1px solid var(--line); border-radius:17px; background:var(--card);
  box-shadow:0 8px 24px rgba(23,32,51,.04);
}
.summary-icon {
  display:grid; width:38px; height:38px; flex:0 0 auto; place-items:center;
  border-radius:12px; background:#f1f4f8; color:var(--ink); font-weight:900;
}
.summary-icon--green { background:var(--green-soft); color:var(--green); }
.summary-icon--gold { background:var(--gold-soft); color:#9a7100; }
.summary-icon--wine { background:var(--wine-soft); color:var(--wine); }
.summary-icon--red { background:var(--red-soft); color:var(--red); }
.submissions__summary small { display:block; color:var(--muted); font-size:.65rem; font-weight:850; letter-spacing:.055em; }
.submissions__summary strong { display:block; margin-top:2px; color:var(--ink); font-size:1.35rem; }
.submissions__summary p { margin:1px 0 0; overflow:hidden; color:var(--muted); font-size:.73rem; text-overflow:ellipsis; white-space:nowrap; }

.progress-card {
  margin-bottom:20px; padding:16px 18px; border:1px solid var(--line); border-radius:17px; background:#fff;
}
.progress-card__header { display:flex; justify-content:space-between; align-items:flex-end; gap:16px; margin-bottom:11px; }
.progress-card__header span { display:block; margin-bottom:3px; color:var(--muted); font-size:.67rem; font-weight:850; letter-spacing:.055em; }
.progress-card__header strong { color:var(--ink); }
.progress-card__header > strong { color:var(--wine); font-size:1.15rem; }
.progress-card__bar { overflow:hidden; height:7px; border-radius:999px; background:#edf1f5; }
.progress-card__fill { height:100%; border-radius:inherit; background:linear-gradient(90deg,var(--wine),#c94d75); transition:width .35s ease; }

.submissions__toolbar {
  display:flex; align-items:center; justify-content:space-between; gap:18px; margin-bottom:14px;
}
.submissions__filters { display:flex; flex-wrap:wrap; gap:7px; }
.submissions__filters button {
  display:flex; align-items:center; gap:7px; padding:8px 11px; border:1px solid var(--line);
  border-radius:999px; background:#fff; color:var(--body); font:inherit; font-size:.8rem;
  font-weight:700; cursor:pointer;
}
.submissions__filters button:hover { border-color:rgba(159,25,69,.35); color:var(--wine); }
.submissions__filters button.active { border-color:var(--wine); background:var(--wine); color:#fff; }
.submissions__filters button span {
  display:grid; min-width:21px; height:21px; padding:0 5px; place-items:center; border-radius:999px;
  background:#f1f4f8; color:var(--muted); font-size:.68rem;
}
.submissions__filters button.active span { background:rgba(255,255,255,.18); color:#fff; }
.submissions__search {
  display:flex; align-items:center; gap:8px; min-width:260px; padding:0 12px;
  border:1px solid var(--line); border-radius:13px; background:#fff; color:var(--muted);
}
.submissions__search:focus-within { border-color:rgba(159,25,69,.5); box-shadow:0 0 0 3px rgba(159,25,69,.08); }
.submissions__search input { width:100%; padding:10px 0; border:0; outline:0; background:transparent; color:var(--ink); font:inherit; font-size:16px; }

.student-list { display:grid; gap:9px; }
.student-row {
  display:grid; grid-template-columns:minmax(220px,1.35fr) minmax(145px,.8fr) minmax(170px,1fr) minmax(270px,auto);
  gap:16px; align-items:center; padding:16px 17px; border:1px solid var(--line);
  border-radius:17px; background:#fff; box-shadow:0 6px 20px rgba(23,32,51,.035);
  transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease;
}
.student-row:has(.student-row__grade) {
  grid-template-columns:minmax(220px,1.35fr) minmax(145px,.8fr) minmax(170px,1fr) 70px minmax(270px,auto);
}
.student-row:hover { transform:translateY(-1px); border-color:rgba(159,25,69,.18); box-shadow:0 12px 28px rgba(23,32,51,.065); }
.student-row--delivered { border-left:4px solid var(--gold); }
.student-row--reviewed { border-left-color:var(--green); background:linear-gradient(90deg,rgba(45,138,99,.035),#fff 16%); }

.student-row__identity { display:flex; align-items:center; gap:12px; min-width:0; }
.student-avatar {
  display:grid; width:44px; height:44px; flex:0 0 auto; place-items:center; border:1px solid #ead78f;
  border-radius:14px; background:var(--gold-soft); color:#8a6811; font-weight:850;
}
.student-row__identity span { display:block; margin-bottom:2px; color:var(--wine); font-size:.72rem; font-weight:750; }
.student-row__identity strong { display:block; overflow:hidden; color:var(--ink); font-size:.94rem; text-overflow:ellipsis; white-space:nowrap; }
.student-row__status, .student-row__file, .student-row__grade { min-width:0; }
.status-pill {
  display:inline-flex; padding:5px 8px; border:1px solid #ead78f; border-radius:999px;
  background:var(--gold-soft); color:#8a6811; font-size:.66rem; font-weight:850;
}
.status-pill--reviewed { border-color:#bfe2d2; background:var(--green-soft); color:var(--green); }
.status-pill--pending { border-color:#e1e6ed; background:#f7f9fb; color:var(--muted); }
.student-row__status small, .student-row__file small { display:block; margin-top:5px; color:var(--muted); font-size:.72rem; }
.student-row__file-label, .student-row__grade span { display:block; margin-bottom:3px; color:var(--muted); font-size:.64rem; font-weight:850; letter-spacing:.055em; }
.student-row__file strong { display:block; overflow:hidden; color:var(--ink); font-size:.85rem; text-overflow:ellipsis; white-space:nowrap; }
.student-row__grade strong { color:var(--ink); font-size:1.05rem; }

.student-row__actions { display:flex; justify-content:flex-end; flex-wrap:wrap; gap:7px; }
.action-button {
  display:inline-flex; align-items:center; justify-content:center; min-height:36px; padding:8px 11px;
  border-radius:11px; font:inherit; font-size:.74rem; font-weight:800; text-decoration:none; cursor:pointer;
}
.action-button--secondary { border:1px solid var(--line); background:#fff; color:var(--body); }
.action-button--secondary:hover, .action-button--ghost:hover { border-color:rgba(159,25,69,.3); color:var(--wine); }
.action-button--primary { border:1px solid var(--wine); background:var(--wine); color:#fff; }
.action-button--primary:hover { border-color:var(--wine-dark); background:var(--wine-dark); }
.action-button--ghost { border:1px solid transparent; background:#f6f8fb; color:var(--muted); }
.action-button:disabled { opacity:.45; cursor:default; }

.student-list__empty {
  display:flex; align-items:center; gap:14px; padding:30px; border:1px dashed #ccd5df;
  border-radius:18px; background:#fff; color:var(--body);
}
.student-list__empty > span { display:grid; width:42px; height:42px; place-items:center; border-radius:13px; background:var(--wine-soft); color:var(--wine); }
.student-list__empty p { margin:4px 0 0; color:var(--muted); }

.submissions__footer {
  display:flex; justify-content:space-between; gap:16px; margin-top:22px; padding:20px 2px 4px;
  border-top:1px solid var(--line);
}
.submissions__footer a { color:var(--wine); font-weight:750; text-decoration:none; }

.state-card {
  display:flex; min-height:360px; flex-direction:column; align-items:center; justify-content:center;
  gap:14px; padding:40px; border:1px solid var(--line); border-radius:22px; background:#fff; text-align:center;
}
.state-card h1 { margin:0; color:var(--ink); }
.state-card p { margin:5px 0 0; color:var(--muted); }
.state-card__icon { display:grid; width:52px; height:52px; place-items:center; border-radius:15px; background:var(--red-soft); color:var(--red); font-size:1.4rem; font-weight:900; }
.state-card__actions { display:flex; gap:10px; }
.state-card__actions button, .state-card__actions a { padding:9px 13px; border:1px solid var(--wine); border-radius:11px; background:#fff; color:var(--wine); font:inherit; font-weight:750; text-decoration:none; cursor:pointer; }
.loading-spinner { width:42px; height:42px; border:3px solid #e6ebf1; border-top-color:var(--wine); border-radius:50%; animation:spin .8s linear infinite; }

@keyframes spin { to { transform:rotate(360deg); } }
@keyframes view-enter { from { opacity:0; transform:translateY(5px); } to { opacity:1; transform:none; } }

@media (max-width:1180px) {
  .submissions__summary, .submissions__summary:has(article:nth-child(6)) { grid-template-columns:repeat(3,minmax(0,1fr)); }
  .student-row, .student-row:has(.student-row__grade) { grid-template-columns:1.2fr .8fr 1fr; }
  .student-row__actions { grid-column:1/-1; justify-content:flex-start; }
}
@media (max-width:820px) {
  .submissions__hero { grid-template-columns:1fr; }
  .submissions__hero-status { min-width:0; }
  .submissions__toolbar { align-items:stretch; flex-direction:column; }
  .submissions__search { width:100%; min-width:0; }
  .student-row, .student-row:has(.student-row__grade) { grid-template-columns:1fr 1fr; }
  .student-row__identity, .student-row__actions { grid-column:1/-1; }
}
@media (max-width:560px) {
  .submissions__summary, .submissions__summary:has(article:nth-child(6)) { grid-template-columns:1fr 1fr; }
  .submissions__hero { padding:22px; }
  .submissions__hero-status { align-items:flex-start; }
  .student-row, .student-row:has(.student-row__grade) { grid-template-columns:1fr; }
  .student-row__identity, .student-row__actions { grid-column:auto; }
  .student-row__actions { flex-direction:column; }
  .action-button { width:100%; }
  .submissions__footer { align-items:flex-start; flex-direction:column; }
}
@media (prefers-reduced-motion:reduce) {
  .submissions, .submissions * { animation-duration:.01ms !important; transition-duration:.01ms !important; }
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
