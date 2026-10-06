<template>
  <section class="my-tasks amv-tasks-final amv-view-shell">
    <section v-if="isLoading" class="tasks-state">
      <div class="tasks-state__spinner"></div>
      <strong>Cargando tu aula…</strong>
      <span>Preparando tareas, quiz y pruebas de unidad.</span>
    </section>

    <section v-else-if="loadError" class="tasks-state tasks-state--error">
      <div class="tasks-state__icon">!</div>
      <strong>No pudimos cargar tus actividades</strong>
      <span>{{ loadError }}</span>
      <button type="button" @click="loadPage">Reintentar</button>
    </section>

    <template v-else>
      <header class="tasks-header">
        <div class="tasks-header__copy">
          <span class="tasks-kicker"><i></i> ESTUDIANTE · AULA VIRTUAL</span>
          <h1>Mis actividades<span>.</span></h1>
          <p>
            Todo lo que tienes que <b>hacer, entregar y revisar</b>,
            en un solo lugar.
          </p>
        </div>

        <div class="tasks-header__status">
          <div
            class="tasks-header__ring"
            :style="{ '--p': `${completionPercent * 3.6}deg` }"
          >
            <div>
              <strong>{{ completionPercent }}%</strong>
              <small>avance</small>
            </div>
          </div>

          <div>
            <small>ESTADO</small>
            <strong>
              {{
                pendingCount
                  ? `${pendingCount} pendiente${pendingCount === 1 ? '' : 's'}`
                  : 'Todo al día'
              }}
            </strong>
            <span>
              {{ totalActivityCount }}
              {{ totalActivityCount === 1 ? 'actividad publicada' : 'actividades publicadas' }}
            </span>
          </div>
        </div>
      </header>

      <div class="tasks-glance">
        <button
          class="glance-item glance-item--all"
          :class="{ active: activeFilter === 'all' }"
          type="button"
          @click="setTasksTab('todas')"
        >
          <span>01</span>
          <b>{{ totalActivityCount }}</b>
          <small>TODAS</small>
        </button>

        <button
          class="glance-item glance-item--pending"
          :class="{ active: activeFilter === 'pending' }"
          type="button"
          @click="setTasksTab('pendientes')"
        >
          <span>02</span>
          <b>{{ pendingCount }}</b>
          <small>PENDIENTES</small>
        </button>

        <button
          class="glance-item glance-item--delivered"
          :class="{ active: activeFilter === 'delivered' }"
          type="button"
          @click="setTasksTab('entregadas')"
        >
          <span>03</span>
          <b>{{ deliveredCount }}</b>
          <small>ENTREGADAS</small>
        </button>

        <button
          class="glance-item glance-item--reviewed"
          :class="{ active: activeFilter === 'reviewed' }"
          type="button"
          @click="setTasksTab('revisadas')"
        >
          <span>04</span>
          <b>{{ reviewedCount }}</b>
          <small>REVISADAS</small>
        </button>
      </div>

      <div class="activity-legend" aria-label="Tipos de actividad">
        <span class="activity-legend__title">TIPOS</span>
        <span class="activity-legend__item activity-legend__item--task">
          <i></i> Tareas
        </span>
        <span class="activity-legend__item activity-legend__item--quiz">
          <i></i> Quiz
        </span>
        <span class="activity-legend__item activity-legend__item--test">
          <i></i> Prueba de unidad
        </span>
      </div>

      <main class="tasks-workspace" ref="tasksListRef">
        <div class="tasks-workspace__top">
          <div>
            <span class="tasks-kicker">TU ESPACIO</span>
            <h2>{{ activeFilterLabel }}</h2>
          </div>

          <span class="activity-count">
            {{ filteredTasks.length }}
            {{ filteredTasks.length === 1 ? 'actividad' : 'actividades' }}
          </span>
        </div>

        <TransitionGroup
          v-if="filteredTasks.length"
          name="activity-list"
          tag="div"
          class="task-grid"
        >
          <RouterLink
            v-for="(item, index) in filteredTasks"
            :key="item.key"
            :to="item.route"
            class="task-card"
            :class="[
              `task-card--${item.status}`,
              `task-card--${item.visual.tone}`,
              `task-card--kind-${item.kind}`
            ]"
            :style="{ '--delay': `${Math.min(index, 8) * 55}ms` }"
          >
            <div class="task-card__visual">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="`Vista previa de ${item.title}`"
                loading="lazy"
              / decoding="async">

              <div v-else class="task-placeholder">
                <div class="task-placeholder__glow"></div>
                <div class="task-placeholder__orb"></div>

                <strong>{{ item.visual.glyph }}</strong>
                <span>{{ item.visual.label }}</span>
                <em>{{ String(index + 1).padStart(2, '0') }}</em>
              </div>

              <div class="task-card__shine"></div>

              <span class="task-card__status">
                {{ getActivityStatusLabel(item) }}
              </span>

              <span
                v-if="item.status === 'reviewed'"
                class="task-card__done"
              >
                ✓
              </span>

              <span class="task-card__kind-badge">
                {{ item.visual.label }}
              </span>
            </div>

            <div class="task-card__body">
              <div class="task-card__eyebrow">
                <span>{{ item.visual.label }}</span>
                <b :class="`deadline--${getDeadlineAccent(item)}`">
                  {{ getDeadlineCopy(item) }}
                </b>
              </div>

              <h3>{{ item.title }}</h3>

              <p>
                {{ item.description || defaultActivityDescription(item) }}
              </p>

              <div class="task-card__meta">
                <span>
                  <b>★</b>
                  {{ item.points ?? 0 }} pts
                </span>

                <span>
                  <b>{{ item.kind === 'assignment' ? '↳' : '?' }}</b>
                  {{ item.kind === 'assignment'
                    ? getAcceptedFileLabel(item.acceptedFile)
                    : item.kind === 'quiz'
                      ? 'Quiz formativo'
                      : 'Prueba evaluada'
                  }}
                </span>

                <span>
                  <b>◷</b>
                  {{ item.dueDate ? formatDate(item.dueDate) : 'Sin fecha límite' }}
                </span>
              </div>

              <div
                v-if="item.kind === 'assignment' && item.submission"
                class="task-card__submission"
              >
                <span
                  class="submission-dot"
                  :class="{ reviewed: item.status === 'reviewed' }"
                ></span>

                <div>
                  <small>ENTREGA REGISTRADA</small>
                  <strong>
                    {{ item.submission.fileName || 'Archivo entregado' }}
                  </strong>
                </div>

                <strong
                  v-if="item.submission.grade"
                  class="grade"
                >
                  {{ item.submission.grade }}
                </strong>
              </div>

              <div
                v-if="item.kind !== 'assignment' && item.attempt"
                class="task-card__submission task-card__submission--evaluation"
              >
                <span
                  class="submission-dot"
                  :class="{ reviewed: item.status === 'reviewed' }"
                ></span>

                <div>
                  <small>
                    {{ item.status === 'reviewed' ? 'RESULTADO' : 'ENTREGA REGISTRADA' }}
                  </small>
                  <strong>
                    {{
                      item.status === 'reviewed'
                        ? formatEvaluationResult(item.attempt)
                        : `Intento ${item.attempt.attemptNumber || 1}`
                    }}
                  </strong>
                </div>

                <strong
                  v-if="item.attempt.percentage !== null && item.attempt.percentage !== undefined"
                  class="grade"
                >
                  {{ Math.round(Number(item.attempt.percentage)) }}%
                </strong>
              </div>

              <div
                v-if="item.status === 'reviewed' && item.kind === 'assignment' && item.submission?.feedback"
                class="task-card__feedback"
              >
                <span>✓</span>
                <div>
                  <small>RETROALIMENTACIÓN</small>
                  <p>{{ item.submission.feedback }}</p>
                </div>
              </div>

              <div
                v-if="item.status === 'reviewed' && item.kind !== 'assignment'"
                class="task-card__feedback task-card__feedback--evaluation"
              >
                <span>✓</span>
                <div>
                  <small>RESULTADO DISPONIBLE</small>
                  <p>
                    {{
                      item.attempt?.passed === true
                        ? 'Evaluación aprobada.'
                        : item.attempt?.passed === false
                          ? 'Revisa los contenidos para reforzar.'
                          : 'Tu evaluación ya fue procesada.'
                    }}
                  </p>
                </div>
              </div>

              <footer>
                <strong>
                  {{
                    item.status === 'reviewed'
                      ? item.kind === 'assignment'
                        ? 'Ver evaluación'
                        : 'Ver resultado'
                      : item.status === 'delivered'
                        ? 'Ver entrega'
                        : item.kind === 'assignment'
                          ? 'Abrir actividad'
                          : 'Rendir evaluación'
                  }}
                </strong>
                <span>→</span>
              </footer>
            </div>
          </RouterLink>
        </TransitionGroup>

        <div v-else class="tasks-empty">
          <div>✓</div>
          <span>TODO AL DÍA</span>
          <h3>No hay actividades en esta categoría.</h3>
          <p>
            Cuando aparezca una tarea, quiz o prueba de unidad,
            la verás directamente aquí.
          </p>
          <button type="button" @click="setTasksTab('todas')">
            Ver todas
          </button>
        </div>
      </main>

      <footer class="tasks-footer">
        AMO MI VOZ · CANTA · APRENDE · CRECE
      </footer>
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
  fetchAssignments
} from '@/services/assignmentService'

import {
  fetchSubmissions
} from '@/services/submissionService'

import {
  fetchQuizzes
} from '@/services/quizService'

import {
  fetchMyEvaluationAttempts,
  getAttemptDate
} from '@/services/evaluationHistoryService'

const {
  currentUser,
  isStudent
} = useAuth()

const assignments = ref([])
const submissions = ref([])
const quizzes = ref([])
const evaluationAttempts = ref([])

const isLoading = ref(true)
const loadError = ref('')
const activeFilter = ref('all')
const activeTasksTab = ref('resumen')

const tasksListRef = ref(null)

const isTasksTab = tab =>
  activeTasksTab.value === tab

const setTasksTab = tab => {
  activeTasksTab.value = tab

  const filterByTab = {
    todas: 'all',
    pendientes: 'pending',
    entregadas: 'delivered',
    revisadas: 'reviewed'
  }

  if (filterByTab[tab]) {
    activeFilter.value = filterByTab[tab]
  }

  window.requestAnimationFrame(() => {
    tasksListRef.value?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
  })
}

const loadPage = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    if (!isStudent.value || !currentUser.value) {
      assignments.value = []
      submissions.value = []
      quizzes.value = []
      evaluationAttempts.value = []
      return
    }

    const [
      loadedAssignments,
      loadedSubmissions,
      loadedQuizzes,
      loadedEvaluationAttempts
    ] = await Promise.all([
      fetchAssignments(),
      fetchSubmissions(),
      fetchQuizzes(),
      fetchMyEvaluationAttempts()
    ])

    assignments.value =
      (loadedAssignments || []).filter(
        assignment =>
          assignment.status !== 'draft'
      )

    submissions.value =
      (loadedSubmissions || []).filter(
        submission =>
          Number(submission.studentId) ===
          Number(currentUser.value.id)
      )

    quizzes.value =
      (loadedQuizzes || []).filter(
        quiz =>
          quiz.status !== 'draft'
      )

    evaluationAttempts.value =
      loadedEvaluationAttempts || []
  } catch (error) {
    console.error(
      'Error cargando Mis actividades:',
      error
    )

    assignments.value = []
    submissions.value = []
    quizzes.value = []
    evaluationAttempts.value = []

    loadError.value =
      error?.message ||
      'No se pudieron cargar tus actividades desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

const getSubmission = assignmentId =>
  submissions.value.find(
    submission =>
      Number(submission.assignmentId) ===
      Number(assignmentId)
  ) || null

const getLatestAttempt = quizId => {
  const attempts =
    evaluationAttempts.value
      .filter(
        attempt =>
          Number(attempt.quizId) ===
          Number(quizId)
      )
      .sort(
        (a, b) =>
          new Date(
            getAttemptDate(b) || 0
          ) -
          new Date(
            getAttemptDate(a) || 0
          ) ||
          Number(b.attemptNumber || 0) -
          Number(a.attemptNumber || 0)
      )

  return attempts[0] || null
}

const getEvaluationStatus = attempt => {
  if (!attempt) {
    return 'pending'
  }

  if (attempt.status === 'graded') {
    return 'reviewed'
  }

  if (attempt.status === 'submitted') {
    return 'delivered'
  }

  return 'pending'
}

const assignmentItems = computed(() =>
  assignments.value.map(assignment => {
    const submission =
      getSubmission(assignment.id)

    let status = 'pending'

    if (submission) {
      status =
        submission.status === 'reviewed' ||
        submission.reviewedAt
          ? 'reviewed'
          : 'delivered'
    }

    return {
      key: `assignment-${assignment.id}`,
      kind: 'assignment',
      id: assignment.id,
      lessonId: assignment.lessonId,
      route:
        `/aula/clase/${assignment.lessonId}/tarea/${assignment.id}`,
      title:
        assignment.title || 'Actividad',
      description:
        assignment.description || '',
      points:
        assignment.points ?? 100,
      dueDate:
        assignment.dueDate || null,
      acceptedFile:
        assignment.acceptedFile || 'any',
      image:
        assignment.thumbnailUrl ||
        assignment.imageUrl ||
        assignment.coverUrl ||
        assignment.image ||
        assignment.thumbnail ||
        assignment.previewUrl ||
        '',
      assignment,
      submission,
      attempt: null,
      status,
      visual:
        getTaskVisual(assignment)
    }
  })
)

const evaluationItems = computed(() =>
  quizzes.value.map(quiz => {
    const attempt =
      getLatestAttempt(quiz.id)

    const kind =
      quiz.assessmentType === 'test'
        ? 'test'
        : 'quiz'

    const status =
      getEvaluationStatus(attempt)

    const visual =
      kind === 'test'
        ? {
            label: 'PRUEBA DE UNIDAD',
            glyph: '★',
            tone: 'gold'
          }
        : {
            label: 'QUIZ FORMATIVO',
            glyph: '?',
            tone: 'violet'
          }

    return {
      key: `${kind}-${quiz.id}`,
      kind,
      id: quiz.id,
      lessonId: quiz.lessonId,
      route:
        `/aula/clase/${quiz.lessonId}/evaluacion/${quiz.id}`,
      title:
        quiz.title ||
        (kind === 'test'
          ? 'Prueba de unidad'
          : 'Quiz formativo'),
      description:
        quiz.description || '',
      points:
        quiz.totalPoints ?? 0,
      dueDate:
        quiz.closesAt || null,
      acceptedFile:
        null,
      image:
        quiz.thumbnailUrl ||
        quiz.imageUrl ||
        quiz.coverUrl ||
        quiz.image ||
        quiz.thumbnail ||
        quiz.previewUrl ||
        '',
      assignment: null,
      submission: null,
      attempt,
      status,
      visual,
      quiz
    }
  })
)

const activityItems = computed(() =>
  [
    ...assignmentItems.value,
    ...evaluationItems.value
  ].sort((a, b) => {
    const dateA =
      a.dueDate
        ? new Date(a.dueDate).getTime()
        : Number.POSITIVE_INFINITY

    const dateB =
      b.dueDate
        ? new Date(b.dueDate).getTime()
        : Number.POSITIVE_INFINITY

    return dateA - dateB
  })
)

const taskItems = computed(() =>
  activityItems.value
)

const pendingCount = computed(() =>
  activityItems.value.filter(
    item => item.status === 'pending'
  ).length
)

const deliveredCount = computed(() =>
  activityItems.value.filter(
    item => item.status === 'delivered'
  ).length
)

const reviewedCount = computed(() =>
  activityItems.value.filter(
    item => item.status === 'reviewed'
  ).length
)

const totalActivityCount = computed(() =>
  activityItems.value.length
)

const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') {
    return activityItems.value
  }

  return activityItems.value.filter(
    item =>
      item.status === activeFilter.value
  )
})

const completionPercent = computed(() => {
  const total =
    activityItems.value.length

  return total
    ? Math.round(
        (reviewedCount.value / total) *
        100
      )
    : 0
})

const activeFilterLabel = computed(() => ({
  all: 'Todas tus actividades',
  pending: 'Por hacer',
  delivered: 'En revisión',
  reviewed: 'Revisadas'
}[activeFilter.value] || 'Todas tus actividades'))

const getStatusLabel = status => {
  const labels = {
    pending: 'PENDIENTE',
    delivered: 'ENTREGADA',
    reviewed: 'REVISADA'
  }

  return labels[status] || status
}

const getActivityStatusLabel = item => {
  if (
    item.kind !== 'assignment' &&
    item.status === 'delivered'
  ) {
    return 'ENVIADA'
  }

  if (
    item.kind !== 'assignment' &&
    item.status === 'reviewed'
  ) {
    return 'CORREGIDA'
  }

  return getStatusLabel(item.status)
}

const getTypeLabel = type => {
  const labels = {
    assignment: 'Tarea',
    performance: 'Performance',
    audio: 'Audio',
    video: 'Video',
    score: 'Partitura'
  }

  return labels[type] || 'Tarea'
}

const getAcceptedFileLabel = type => {
  const labels = {
    audio: 'Audio',
    video: 'Video',
    document: 'Documento',
    any: 'Cualquier archivo'
  }

  return labels[type] ||
    type ||
    'Audio'
}

const getDeadlineStatus = (
  dueDate,
  academicStatus = 'pending'
) => {
  if (academicStatus !== 'pending') {
    return 'completed'
  }

  if (!dueDate) {
    return 'none'
  }

  const due = new Date(dueDate)

  if (Number.isNaN(due.getTime())) {
    return 'none'
  }

  const now = new Date()

  const localToday =
    new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    )

  const localDueDay =
    new Date(
      due.getFullYear(),
      due.getMonth(),
      due.getDate()
    )

  const dayDifference =
    Math.round(
      (localDueDay - localToday) /
      86400000
    )

  if (due.getTime() < now.getTime()) {
    return 'overdue'
  }

  if (dayDifference === 0) {
    return 'today'
  }

  if (dayDifference === 1) {
    return 'tomorrow'
  }

  return 'upcoming'
}

const getDeadlineLabel = item => {
  const labels = {
    none: 'SIN FECHA LÍMITE',
    upcoming: 'PRÓXIMA',
    tomorrow: 'VENCE MAÑANA',
    today: 'VENCE HOY',
    overdue: 'ATRASADA',
    completed: 'COMPLETADA'
  }

  return labels[item?.deadlineStatus] ||
    'SIN FECHA LÍMITE'
}

const formatDeadline = value => {
  if (!value) {
    return 'Sin fecha límite'
  }

  try {
    return new Intl.DateTimeFormat(
      'es-CL',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(new Date(value))
  } catch {
    return value
  }
}

const formatDate = value =>
  formatDeadline(value)

const getDeadlineAccent = item =>
  getDeadlineStatus(
    item?.dueDate,
    item?.status
  )

const getDeadlineCopy = item =>
  getDeadlineLabel({
    deadlineStatus:
      getDeadlineStatus(
        item?.dueDate,
        item?.status
      )
  })

const formatEvaluationResult = attempt => {
  const percentage =
    Number(attempt?.percentage)

  if (Number.isFinite(percentage)) {
    return `${Math.round(percentage)}%`
  }

  const score =
    Number(attempt?.score)

  const maxScore =
    Number(attempt?.maxScore)

  if (
    Number.isFinite(score) &&
    Number.isFinite(maxScore)
  ) {
    return `${score} / ${maxScore}`
  }

  return 'Evaluación corregida'
}

const defaultActivityDescription = item => {
  if (item.kind === 'quiz') {
    return 'Quiz formativo para practicar y comprobar lo aprendido.'
  }

  if (item.kind === 'test') {
    return 'Prueba de unidad para medir y registrar tu aprendizaje.'
  }

  return 'Actividad de aprendizaje de AMO MI VOZ.'
}

const getTaskVisual = assignment => {
  const type =
    String(
      assignment?.type ||
      assignment?.acceptedFile ||
      'assignment'
    ).toLowerCase()

  if (
    type.includes('performance')
  ) {
    return {
      label: 'PERFORMANCE',
      glyph: '🎤',
      tone: 'wine'
    }
  }

  if (
    type.includes('audio')
  ) {
    return {
      label: 'AUDIO',
      glyph: '🎧',
      tone: 'violet'
    }
  }

  if (
    type.includes('video')
  ) {
    return {
      label: 'VIDEO',
      glyph: '▶',
      tone: 'blue'
    }
  }

  if (
    type.includes('score') ||
    type.includes('partitura')
  ) {
    return {
      label: 'PARTITURA',
      glyph: '♫',
      tone: 'gold'
    }
  }

  return {
    label:
      getTypeLabel(
        assignment?.type
      ).toUpperCase(),
    glyph: '✦',
    tone: 'wine'
  }
}

onMounted(() => {
  loadPage()
})
</script>


<style lang="scss" scoped>

.my-tasks.amv-tasks-final{

 --ink:#121b2e;--muted:#68758a;--line:#dce3ec;--wine:#a81549;--gold:#d5a51d;--green:#2c936b;--blue:#467db9;

 width:min(1240px,calc(100% - 36px));margin:0 auto;padding:18px 0 52px;color:var(--ink);font-family:inherit;

}

.my-tasks.amv-tasks-final *{box-sizing:border-box}.my-tasks.amv-tasks-final button,.my-tasks.amv-tasks-final a{transition:.22s cubic-bezier(.2,.75,.25,1)}

.tasks-header{position:relative;display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:190px;padding:30px 34px;margin-bottom:12px;overflow:hidden;border:1px solid var(--line);border-radius:25px;background:radial-gradient(circle at 88% 18%,rgba(213,165,29,.18),transparent 25%),radial-gradient(circle at 65% 90%,rgba(168,21,73,.11),transparent 34%),linear-gradient(120deg,#fff 0%,#fbfcfe 64%,#fff9eb 100%);box-shadow:0 18px 48px rgba(20,30,48,.065)}

.tasks-header:before{content:"";position:absolute;left:0;top:0;width:160px;height:3px;background:linear-gradient(90deg,var(--wine),var(--gold))}.tasks-header:after{content:"";position:absolute;right:-110px;top:-150px;width:330px;height:330px;border:1px solid rgba(168,21,73,.09);border-radius:50%;box-shadow:0 0 0 45px rgba(213,165,29,.025),0 0 0 90px rgba(168,21,73,.018)}

.tasks-header__copy{position:relative;z-index:2}.tasks-kicker{display:flex;align-items:center;gap:7px;color:#927000;font-size:10px;font-weight:950;letter-spacing:.14em}.tasks-kicker i{width:7px;height:7px;border-radius:50%;background:#31a474;box-shadow:0 0 0 4px rgba(49,164,116,.11)}

.tasks-header h1{margin:8px 0 7px;font-size:clamp(3rem,6vw,5.2rem);line-height:.88;letter-spacing:-.065em}.tasks-header h1 span{color:var(--gold)}.tasks-header p{margin:0;color:var(--muted);font-size:13px}.tasks-header p b{color:var(--ink)}

.tasks-header__status{position:relative;z-index:2;display:flex;align-items:center;gap:12px;min-width:205px;padding:12px 14px;border:1px solid #e5dfe1;border-radius:17px;background:rgba(255,255,255,.82);box-shadow:0 10px 28px rgba(20,30,48,.06);backdrop-filter:blur(12px)}

.tasks-header__status>div:last-child>*{display:block}.tasks-header__status small{color:#82909f;font-size:7px;font-weight:950;letter-spacing:.1em}.tasks-header__status strong{margin:3px 0;color:#245f47;font-size:13px}.tasks-header__status span{color:var(--muted);font-size:9px}.tasks-header__ring{display:grid;place-items:center;width:60px;height:60px;border-radius:50%;background:conic-gradient(var(--green) var(--p),#e7edf1 0);padding:6px}.tasks-header__ring>div{display:grid;place-items:center;width:100%;height:100%;border-radius:50%;background:#fff}.tasks-header__ring strong{font-size:13px;color:var(--ink)}.tasks-header__ring small{font-size:7px!important;color:#8792a0!important;letter-spacing:0!important}

.tasks-glance{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-bottom:16px}.glance-item{display:grid;grid-template-columns:auto auto 1fr;align-items:center;gap:10px;min-height:62px;padding:9px 14px;border:1px solid var(--line);border-radius:15px;background:#fff;color:var(--ink);text-align:left;cursor:pointer;box-shadow:0 7px 20px rgba(20,30,48,.035)}.glance-item:hover{transform:translateY(-2px);box-shadow:0 12px 28px rgba(20,30,48,.08);border-color:#cbd5e1}.glance-item>span{display:grid;place-items:center;width:25px;height:25px;border-radius:8px;background:#f2f5f8;color:#778497;font-size:8px;font-weight:950}.glance-item>b{font-size:21px;line-height:1}.glance-item>small{justify-self:end;color:#7c8999;font-size:8px;font-weight:950;letter-spacing:.09em}.glance-item--pending{background:linear-gradient(135deg,#fff,#fff8f9)}.glance-item--pending b{color:#b23b50}.glance-item--delivered{background:linear-gradient(135deg,#fff,#f6f9fd)}.glance-item--delivered b{color:var(--blue)}.glance-item--reviewed{background:linear-gradient(135deg,#fff,#f3faf7)}.glance-item--reviewed b{color:var(--green)}

.tasks-workspace{padding:22px 22px 24px;border:1px solid var(--line);border-radius:23px;background:#fff;box-shadow:0 16px 44px rgba(20,30,48,.06)}.tasks-workspace__top{display:flex;align-items:center;justify-content:space-between;gap:20px;margin-bottom:17px;padding-bottom:15px;border-bottom:1px solid #e7ebf0}.tasks-workspace__top h2{margin:3px 0 0;font-size:25px;letter-spacing:-.035em}.tasks-filters{display:flex;gap:5px;padding:4px;border:1px solid #e0e6ed;border-radius:12px;background:#f7f9fb}.tasks-filters button{border:0;border-radius:9px;padding:8px 10px;color:#66758a;background:transparent;font:inherit;font-size:10px;font-weight:850;cursor:pointer}.tasks-filters button b{display:inline-grid;min-width:18px;margin-left:4px;padding:2px 5px;border-radius:99px;background:#e9edf2;color:#748196;font-size:8px}.tasks-filters button:hover{color:var(--wine);background:#fff}.tasks-filters button.active{color:#fff;background:var(--wine);box-shadow:0 6px 14px rgba(168,21,73,.2)}.tasks-filters button.active b{color:#fff;background:rgba(255,255,255,.17)}

.task-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.task-card{position:relative;display:grid;grid-template-columns:145px minmax(0,1fr);min-height:205px;overflow:hidden;border:1px solid var(--line);border-radius:18px;color:var(--ink);text-decoration:none;background:#fff;box-shadow:0 7px 23px rgba(20,30,48,.045)}.task-card:before{content:"";position:absolute;left:0;top:0;bottom:0;width:4px;background:var(--accent,var(--wine));z-index:4}.task-card:hover{transform:translateY(-3px);border-color:#c9d4df;box-shadow:0 17px 38px rgba(20,30,48,.1)}.task-card--pending{--accent:#c79718}.task-card--delivered{--accent:var(--blue)}.task-card--reviewed{--accent:var(--green)}.task-card--violet{--accent:#8c5ac9}.task-card--blue{--accent:#3975b9}.task-card--gold{--accent:#d2a01d}.task-card--wine{--accent:var(--wine)}

.task-card__visual{position:relative;overflow:hidden;background:#172035}.task-card__visual:after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,13,25,.02),rgba(8,13,25,.68))}.task-card__visual img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .55s ease}.task-card:hover .task-card__visual img{transform:scale(1.06)}.task-placeholder{position:absolute;inset:0;overflow:hidden;background:radial-gradient(circle at 75% 20%,rgba(255,210,90,.25),transparent 22%),radial-gradient(circle at 20% 75%,rgba(222,38,113,.35),transparent 35%),linear-gradient(145deg,#531c3d,#101626)}.task-card--violet .task-placeholder{background:radial-gradient(circle at 70% 20%,rgba(206,153,255,.3),transparent 25%),linear-gradient(145deg,#4e3277,#171326)}.task-card--blue .task-placeholder{background:radial-gradient(circle at 70% 20%,rgba(105,188,255,.28),transparent 25%),linear-gradient(145deg,#214b79,#111a29)}.task-card--gold .task-placeholder{background:radial-gradient(circle at 70% 20%,rgba(255,225,110,.35),transparent 25%),linear-gradient(145deg,#735314,#18140b)}.task-placeholder__glow{position:absolute;width:120px;height:120px;right:-40px;top:-40px;border:1px solid rgba(255,255,255,.14);border-radius:50%;box-shadow:0 0 0 25px rgba(255,255,255,.02),0 0 0 50px rgba(255,255,255,.015)}.task-placeholder strong{position:absolute;left:22px;top:50%;transform:translateY(-60%);font-size:44px;filter:drop-shadow(0 8px 14px rgba(0,0,0,.3))}.task-placeholder span{position:absolute;left:22px;bottom:17px;color:rgba(255,255,255,.8);font-size:8px;font-weight:950;letter-spacing:.14em}.task-placeholder em{position:absolute;right:14px;bottom:9px;color:rgba(255,255,255,.2);font-size:28px;font-style:normal;font-weight:950}.task-card__status{position:absolute;z-index:5;left:12px;top:11px;padding:5px 7px;border:1px solid rgba(255,255,255,.2);border-radius:99px;color:#fff;background:rgba(9,14,26,.62);font-size:7px;font-weight:950;letter-spacing:.08em;backdrop-filter:blur(8px)}.task-card__done{position:absolute;z-index:5;right:10px;top:10px;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;color:#fff;background:var(--green);font-size:11px;font-weight:950;box-shadow:0 6px 15px rgba(44,147,107,.3)}

.task-card__body{display:flex;flex-direction:column;min-width:0;padding:17px 18px 14px}.task-card__eyebrow{display:flex;justify-content:space-between;align-items:center;gap:8px}.task-card__eyebrow>span{color:#8c6907;font-size:8px;font-weight:950;letter-spacing:.12em}.task-card__eyebrow>b{padding:4px 7px;border:1px solid #e2e7ed;border-radius:99px;color:#718095;background:#f7f9fb;font-size:7px;white-space:nowrap}.deadline--today{color:var(--wine)!important;background:#fff1f5!important;border-color:#efc4d1!important}.deadline--tomorrow{color:#8c6907!important;background:#fff8df!important;border-color:#ebd68e!important}.deadline--overdue{color:#b13a4f!important;background:#fff0f3!important;border-color:#edc3ca!important}.deadline--completed{color:var(--green)!important;background:#edf8f3!important;border-color:#c8e6d8!important}.task-card h3{margin:7px 0 5px;font-size:20px;line-height:1.05;letter-spacing:-.035em}.task-card__body>p{margin:0;color:#6b788c;font-size:9px;line-height:1.5;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.task-card__meta{display:flex;flex-wrap:wrap;gap:5px;margin-top:11px}.task-card__meta span{padding:5px 6px;border:1px solid #e3e8ee;border-radius:7px;color:#6b788b;background:#f8fafc;font-size:7px}.task-card__meta b{color:var(--accent,var(--wine));font-size:9px}.task-card__submission{display:flex;align-items:center;gap:7px;margin-top:8px;padding:7px 8px;border:1px solid #dce7f1;border-radius:8px;background:#f7fafe}.submission-dot{width:7px;height:7px;border-radius:50%;background:#4b82bd;box-shadow:0 0 0 3px #e7f0fa}.submission-dot.reviewed{background:var(--green);box-shadow:0 0 0 3px #e3f5ec}.task-card__submission small{display:block;color:#74849a;font-size:6px;font-weight:950;letter-spacing:.08em}.task-card__submission strong{display:block;color:#34445a;font-size:8px}.task-card__submission .grade{margin-left:auto;color:var(--green);font-size:13px}.task-card__feedback{display:flex;gap:6px;margin-top:7px;padding:7px;border:1px solid #cce7d9;border-radius:8px;background:#edf8f3}.task-card__feedback>span{display:grid;place-items:center;width:19px;height:19px;border-radius:6px;color:#fff;background:var(--green);font-size:7px}.task-card__feedback small{color:#4d856e;font-size:6px;font-weight:950}.task-card__feedback p{margin:2px 0 0;color:#557567;font-size:7px;line-height:1.3}.task-card footer{display:flex;justify-content:space-between;align-items:center;margin-top:auto;padding-top:10px;border-top:1px solid #edf0f4;color:var(--wine);font-size:9px;font-weight:950}.task-card footer span{display:grid;place-items:center;width:25px;height:25px;border-radius:8px;color:#fff;background:var(--wine)}.task-card:hover footer span{transform:translateX(3px)}

.tasks-empty{min-height:240px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;border:1px dashed #ccd6e2;border-radius:18px;background:#fafbfd}.tasks-empty>div{display:grid;place-items:center;width:50px;height:50px;border-radius:15px;color:#fff;background:var(--green);box-shadow:0 10px 22px rgba(44,147,107,.22)}.tasks-empty>span{margin-top:12px;color:var(--green);font-size:8px;font-weight:950;letter-spacing:.13em}.tasks-empty h3{margin:5px 0;font-size:20px}.tasks-empty p{margin:0;color:var(--muted);font-size:10px}.tasks-empty button{margin-top:13px;border:0;border-radius:9px;padding:8px 12px;color:#fff;background:var(--wine);font:inherit;font-size:9px;font-weight:900;cursor:pointer}

.tasks-footer{text-align:center;margin-top:17px;color:#929dad;font-size:7px;letter-spacing:.13em}.tasks-state{min-height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;border:1px solid var(--line);border-radius:22px;background:#fff}.tasks-state span{color:var(--muted);font-size:10px}.tasks-state__spinner{width:38px;height:38px;border:3px solid #e6ebf0;border-top-color:var(--wine);border-radius:50%;animation:spin .8s linear infinite}.tasks-state__icon{display:grid;place-items:center;width:44px;height:44px;border-radius:13px;color:#fff;background:#be4856}.tasks-state button{margin-top:6px;border:0;border-radius:9px;padding:8px 12px;color:#fff;background:var(--wine);font:inherit;font-size:9px;font-weight:900;cursor:pointer}

@keyframes spin{to{transform:rotate(360deg)}}

@media(max-width:900px){.tasks-header{align-items:flex-start;flex-direction:column}.tasks-header__status{width:100%}.task-grid{grid-template-columns:1fr}}

@media(max-width:650px){.my-tasks.amv-tasks-final{width:min(100% - 22px,1240px);padding-top:12px}.tasks-header{padding:23px;min-height:0}.tasks-header h1{font-size:3.25rem}.tasks-glance{grid-template-columns:repeat(2,1fr)}.glance-item{min-height:58px;padding:8px}.tasks-workspace{padding:15px}.tasks-workspace__top{align-items:flex-start;flex-direction:column}.tasks-filters{width:100%;overflow-x:auto}.tasks-filters button{white-space:nowrap}.task-card{grid-template-columns:112px minmax(0,1fr)}.task-card__body{padding:14px}.task-card h3{font-size:17px}.task-card__meta{display:grid;grid-template-columns:1fr}.task-card__meta span{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}}

@media(max-width:480px){.task-card{grid-template-columns:1fr}.task-card__visual{min-height:145px}.task-card__visual img{min-height:145px}.tasks-header__status{min-width:0}.tasks-glance{gap:6px}.glance-item{grid-template-columns:auto auto;gap:7px}.glance-item>small{grid-column:2;justify-self:start}}

@media(prefers-reduced-motion:reduce){.my-tasks.amv-tasks-final *{scroll-behavior:auto!important;animation-duration:.01ms!important;transition-duration:.01ms!important}}


/* =========================================================
   AMV MAX · ACTIVIDADES UNIFICADAS
========================================================= */

.activity-legend{
  display:flex;
  align-items:center;
  gap:12px;
  margin:0 0 12px;
  padding:0 4px;
  color:#718095;
  font-size:8px;
  font-weight:900;
  letter-spacing:.08em;
}

.activity-legend__title{
  color:#a0aab7;
  margin-right:2px;
  letter-spacing:.14em;
}

.activity-legend__item{
  display:inline-flex;
  align-items:center;
  gap:5px;
  padding:5px 8px;
  border:1px solid #e6eaf0;
  border-radius:999px;
  background:#fff;
  box-shadow:0 4px 12px rgba(20,30,48,.025);
  letter-spacing:.03em;
}

.activity-legend__item i{
  width:6px;
  height:6px;
  border-radius:50%;
  display:block;
}

.activity-legend__item--task i{background:var(--wine);box-shadow:0 0 0 3px rgba(168,21,73,.08)}
.activity-legend__item--quiz i{background:#8c5ac9;box-shadow:0 0 0 3px rgba(140,90,201,.10)}
.activity-legend__item--test i{background:#d2a01d;box-shadow:0 0 0 3px rgba(210,160,29,.10)}

.activity-count{
  display:inline-flex;
  align-items:center;
  padding:7px 10px;
  border:1px solid #e4e9ef;
  border-radius:999px;
  color:#718095;
  background:#f8fafc;
  font-size:8px;
  font-weight:900;
  white-space:nowrap;
}

.glance-item.active{
  border-color:currentColor;
  box-shadow:0 12px 30px rgba(20,30,48,.10);
  transform:translateY(-2px);
}

.glance-item--all.active{color:var(--wine)}
.glance-item--pending.active{color:#b23b50}
.glance-item--delivered.active{color:var(--blue)}
.glance-item--reviewed.active{color:var(--green)}

.task-card{
  animation:amvActivityIn .55s cubic-bezier(.2,.75,.25,1) both;
  animation-delay:var(--delay,0ms);
  will-change:transform,box-shadow;
}

.task-card__shine{
  position:absolute;
  z-index:3;
  top:-20%;
  left:-80%;
  width:55%;
  height:140%;
  transform:skewX(-18deg);
  background:linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,.16),
    transparent
  );
  pointer-events:none;
  transition:left .7s cubic-bezier(.2,.75,.25,1);
}

.task-card:hover .task-card__shine{
  left:125%;
}

.task-card__kind-badge{
  position:absolute;
  z-index:6;
  left:11px;
  bottom:10px;
  padding:5px 7px;
  border:1px solid rgba(255,255,255,.20);
  border-radius:7px;
  color:rgba(255,255,255,.92);
  background:rgba(8,13,25,.52);
  backdrop-filter:blur(8px);
  font-size:6px;
  font-weight:950;
  letter-spacing:.10em;
}

.task-card--kind-quiz .task-card__kind-badge{
  background:rgba(92,57,137,.62);
}

.task-card--kind-test .task-card__kind-badge{
  background:rgba(111,78,12,.68);
}

.task-card--kind-quiz .task-card__eyebrow > span{
  color:#8151b9;
}

.task-card--kind-test .task-card__eyebrow > span{
  color:#a77d10;
}

.task-card--kind-quiz{
  --accent:#8c5ac9;
}

.task-card--kind-test{
  --accent:#d2a01d;
}

.task-card--kind-quiz:hover{
  box-shadow:
    0 18px 42px rgba(140,90,201,.15),
    0 0 0 1px rgba(140,90,201,.08);
}

.task-card--kind-test:hover{
  box-shadow:
    0 18px 42px rgba(210,160,29,.15),
    0 0 0 1px rgba(210,160,29,.08);
}

.task-card--kind-quiz .task-placeholder{
  background:
    radial-gradient(circle at 72% 18%,rgba(222,183,255,.34),transparent 24%),
    radial-gradient(circle at 20% 78%,rgba(130,83,194,.34),transparent 36%),
    linear-gradient(145deg,#513178,#151022);
}

.task-card--kind-test .task-placeholder{
  background:
    radial-gradient(circle at 72% 18%,rgba(255,225,115,.38),transparent 24%),
    radial-gradient(circle at 20% 78%,rgba(182,129,18,.30),transparent 36%),
    linear-gradient(145deg,#725313,#181309);
}

.task-placeholder__orb{
  position:absolute;
  width:72px;
  height:72px;
  right:20px;
  top:38px;
  border:1px solid rgba(255,255,255,.16);
  border-radius:50%;
  box-shadow:
    0 0 0 12px rgba(255,255,255,.025),
    0 0 0 24px rgba(255,255,255,.018);
  animation:amvPulse 3.4s ease-in-out infinite;
}

.task-card--kind-quiz .task-placeholder__orb{
  border-color:rgba(220,183,255,.34);
}

.task-card--kind-test .task-placeholder__orb{
  border-color:rgba(255,225,115,.34);
}

.task-card__submission--evaluation{
  border-color:#e5ddf1;
  background:#faf7fd;
}

.task-card__feedback--evaluation{
  border-color:#e5ddf1;
  background:#faf7fd;
}

.activity-list-enter-active,
.activity-list-leave-active{
  transition:all .38s cubic-bezier(.2,.75,.25,1);
}

.activity-list-enter-from,
.activity-list-leave-to{
  opacity:0;
  transform:translateY(10px) scale(.985);
}

@keyframes amvActivityIn{
  from{
    opacity:0;
    transform:translateY(12px) scale(.985);
  }
  to{
    opacity:1;
    transform:translateY(0) scale(1);
  }
}

@keyframes amvPulse{
  0%,100%{transform:scale(.96);opacity:.68}
  50%{transform:scale(1.04);opacity:1}
}

@media (prefers-reduced-motion:reduce){
  .task-card,
  .task-placeholder__orb{
    animation:none!important;
  }

  .task-card__shine{
    display:none;
  }
}

@media (max-width:760px){
  .activity-legend{
    flex-wrap:wrap;
    gap:7px;
  }

  .activity-legend__title{
    width:100%;
  }

  .activity-count{
    display:none;
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
