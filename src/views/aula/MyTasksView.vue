<template>
  <section class="my-tasks">
    <header class="my-tasks__hero">
      <p>ESTUDIANTE · AULA VIRTUAL</p>
      <h1>Mis tareas</h1>
      <span>
        Revisa tus actividades, entregas, evaluaciones y retroalimentación.
      </span>
    </header>

    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="loading-spinner"></div>
      <strong>Cargando tus tareas...</strong>
      <p>Sincronizando actividades y evaluaciones desde Supabase.</p>
    </section>

    <section
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <div class="state-card__icon">!</div>
      <strong>No pudimos cargar tus tareas</strong>
      <p>{{ loadError }}</p>

      <button
        type="button"
        @click="loadPage"
      >
        Reintentar
      </button>
    </section>

    <template v-else>
      <section class="my-tasks__summary">
        <article>
          <span>Total</span>
          <strong>{{ assignments.length }}</strong>
        </article>

        <article>
          <span>Pendientes</span>
          <strong>{{ pendingCount }}</strong>
        </article>

        <article>
          <span>Entregadas</span>
          <strong>{{ deliveredCount }}</strong>
        </article>

        <article>
          <span>Revisadas</span>
          <strong>{{ reviewedCount }}</strong>
        </article>
      </section>

      <section class="my-tasks__filters">
        <button
          type="button"
          :class="{ active: activeFilter === 'all' }"
          @click="activeFilter = 'all'"
        >
          Todas
        </button>

        <button
          type="button"
          :class="{ active: activeFilter === 'pending' }"
          @click="activeFilter = 'pending'"
        >
          Pendientes
        </button>

        <button
          type="button"
          :class="{ active: activeFilter === 'delivered' }"
          @click="activeFilter = 'delivered'"
        >
          Entregadas
        </button>

        <button
          type="button"
          :class="{ active: activeFilter === 'reviewed' }"
          @click="activeFilter = 'reviewed'"
        >
          Revisadas
        </button>
      </section>

      <section class="tasks-section">
        <div class="tasks-section__heading">
          <span>01</span>

          <div>
            <p>ACTIVIDADES</p>
            <h2>Tareas del programa</h2>
          </div>
        </div>

        <div
          v-if="filteredTasks.length"
          class="task-list"
        >
          <RouterLink
            v-for="item in filteredTasks"
            :key="item.assignment.id"
            :to="`/aula/clase/${item.assignment.lessonId}/tarea/${item.assignment.id}`"
            class="task-card"
          >
            <div class="task-card__top">
              <div>
                <div class="task-card__badges">
                  <span>
                    CLASE {{ item.assignment.lessonId }}
                  </span>

                  <span
                    class="task-card__status"
                    :class="`task-card__status--${item.status}`"
                  >
                    {{ getStatusLabel(item.status) }}
                  </span>
                </div>

                <h3>{{ item.assignment.title }}</h3>

                <p>
                  {{
                    item.assignment.description ||
                    'Sin instrucciones adicionales.'
                  }}
                </p>
              </div>

              <strong class="task-card__points">
                {{ item.assignment.points ?? 100 }} pts
              </strong>
            </div>

            <div class="task-card__meta">
              <span>
                {{ getTypeLabel(item.assignment.type) }}
              </span>

              <span>
                Entrega:
                {{ getAcceptedFileLabel(item.assignment.acceptedFile) }}
              </span>

              <span>
                {{
                  item.assignment.dueDate
                    ? `Fecha límite: ${formatDate(item.assignment.dueDate)}`
                    : 'Sin fecha límite'
                }}
              </span>
            </div>

            <div
              v-if="item.submission"
              class="task-card__submission"
            >
              <div>
                <span>ARCHIVO</span>
                <strong>
                  {{ item.submission.fileName || 'Entrega registrada' }}
                </strong>
              </div>

              <div v-if="item.submission.grade">
                <span>NOTA</span>
                <strong class="task-card__grade">
                  {{ item.submission.grade }}
                </strong>
              </div>
            </div>

            <div
              v-if="item.status === 'reviewed'"
              class="task-card__feedback"
            >
              <div>
                <span>RETROALIMENTACIÓN</span>
                <strong>Evaluación disponible</strong>
              </div>

              <p v-if="item.submission.feedback">
                {{ item.submission.feedback }}
              </p>

              <small v-if="item.submission.reviewedAt">
                Revisado:
                {{ formatDateTime(item.submission.reviewedAt) }}
              </small>
            </div>

            <div class="task-card__footer">
              <span>
                {{
                  item.status === 'reviewed'
                    ? 'Ver evaluación'
                    : item.status === 'delivered'
                      ? 'Ver entrega'
                      : 'Abrir tarea'
                }}
              </span>

              <b>→</b>
            </div>
          </RouterLink>
        </div>

        <div
          v-else
          class="empty-state"
        >
          <div>✓</div>

          <div>
            <strong>No hay tareas en esta categoría</strong>
            <p>Prueba seleccionando otro filtro.</p>
          </div>
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
  fetchAssignments
} from '@/services/assignmentService'

import {
  fetchSubmissions
} from '@/services/submissionService'

const {
  currentUser,
  isStudent
} = useAuth()

const assignments = ref([])
const submissions = ref([])

const isLoading = ref(true)
const loadError = ref('')
const activeFilter = ref('all')

const loadPage = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    if (!isStudent.value || !currentUser.value) {
      assignments.value = []
      submissions.value = []
      return
    }

    const [
      loadedAssignments,
      loadedSubmissions
    ] = await Promise.all([
      fetchAssignments(),
      fetchSubmissions()
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
  } catch (error) {
    console.error(
      'Error cargando Mis tareas:',
      error
    )

    assignments.value = []
    submissions.value = []

    loadError.value =
      error?.message ||
      'No se pudieron cargar tus tareas desde Supabase.'
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

const taskItems = computed(() =>
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
      assignment,
      submission,
      status
    }
  })
)

const pendingCount = computed(() =>
  taskItems.value.filter(
    item => item.status === 'pending'
  ).length
)

const deliveredCount = computed(() =>
  taskItems.value.filter(
    item => item.status === 'delivered'
  ).length
)

const reviewedCount = computed(() =>
  taskItems.value.filter(
    item => item.status === 'reviewed'
  ).length
)

const filteredTasks = computed(() => {
  if (activeFilter.value === 'all') {
    return taskItems.value
  }

  return taskItems.value.filter(
    item =>
      item.status === activeFilter.value
  )
})

const getStatusLabel = status => {
  const labels = {
    pending: 'PENDIENTE',
    delivered: 'ENTREGADA',
    reviewed: 'REVISADA'
  }

  return labels[status] || status
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

  return labels[type] || type || 'Audio'
}

const formatDate = value => {
  if (!value) {
    return '—'
  }

  const parts =
    String(value).split('-')

  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

  return value
}

const formatDateTime = value => {
  if (!value) {
    return ''
  }

  try {
    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    ).format(
      new Date(value)
    )
  } catch {
    return value
  }
}

onMounted(() => {
  loadPage()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.my-tasks {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.my-tasks__hero {
  margin-bottom: variables.$spacing-2xl;
}

.my-tasks__hero p {
  margin: 0 0 variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.15em;
}

.my-tasks__hero h1 {
  margin: 0 0 variables.$spacing-md;
  font-size: clamp(3.5rem, 7vw, 6rem);
}

.my-tasks__hero span {
  opacity: 0.6;
}

.my-tasks__summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: variables.$spacing-xl;
}

.my-tasks__summary article {
  padding: variables.$spacing-xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.my-tasks__summary span,
.my-tasks__summary strong {
  display: block;
}

.my-tasks__summary span {
  margin-bottom: variables.$spacing-md;
  opacity: 0.55;
}

.my-tasks__summary strong {
  color: variables.$color-primary;
  font-size: 2rem;
}

.my-tasks__filters {
  display: flex;
  gap: variables.$spacing-sm;
  flex-wrap: wrap;
  margin-bottom: variables.$spacing-3xl;
}

.my-tasks__filters button {
  padding: 10px 18px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  background: transparent;
  color: variables.$color-white;
  font: inherit;
  cursor: pointer;
}

.my-tasks__filters button.active {
  border-color: variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.tasks-section__heading {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-bottom: variables.$spacing-xl;
}

.tasks-section__heading > span {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
}

.tasks-section__heading p {
  margin: 0;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.tasks-section__heading h2 {
  margin: 4px 0 0;
}

.task-list {
  display: grid;
  gap: variables.$spacing-md;
}

.task-card {
  display: block;
  padding: variables.$spacing-xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  color: variables.$color-white;
  text-decoration: none;
}

.task-card:hover {
  border-color: variables.$color-primary;
}

.task-card__top {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: flex-start;
  justify-content: space-between;
}

.task-card__badges {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom: variables.$spacing-sm;
}

.task-card__badges span {
  padding: 4px 7px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  font-size: variables.$font-size-xs;
}

.task-card__status--pending {
  color: variables.$color-white;
  opacity: 0.55;
}

.task-card__status--delivered,
.task-card__status--reviewed {
  border-color: variables.$color-primary !important;
  color: variables.$color-primary;
  opacity: 1 !important;
}

.task-card h3 {
  margin: 0 0 variables.$spacing-sm;
  font-size: 1.5rem;
}

.task-card p {
  margin: 0;
  line-height: 1.65;
  opacity: 0.6;
}

.task-card__points {
  flex-shrink: 0;
  color: variables.$color-primary;
}

.task-card__meta {
  display: flex;
  gap: variables.$spacing-sm;
  flex-wrap: wrap;
  margin-top: variables.$spacing-lg;
}

.task-card__meta span {
  padding: 6px 9px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  font-size: variables.$font-size-xs;
  opacity: 0.65;
}

.task-card__submission,
.task-card__feedback {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  justify-content: space-between;
  margin-top: variables.$spacing-lg;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.task-card__submission span,
.task-card__submission strong,
.task-card__feedback span,
.task-card__feedback strong,
.task-card__feedback small {
  display: block;
}

.task-card__submission span,
.task-card__feedback span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.task-card__grade {
  color: variables.$color-primary;
  font-size: 1.5rem;
}

.task-card__feedback {
  align-items: flex-start;
  flex-direction: column;
  border-color: variables.$color-primary;
}

.task-card__feedback p {
  opacity: 0.8;
}

.task-card__feedback small {
  opacity: 0.45;
}

.task-card__footer {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  justify-content: space-between;
  margin-top: variables.$spacing-lg;
  padding-top: variables.$spacing-lg;
  border-top: 1px solid variables.$color-border;
}

.task-card__footer span,
.task-card__footer b {
  color: variables.$color-primary;
}

.empty-state,
.state-card {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  padding: variables.$spacing-xl;
  border: 1px dashed variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.empty-state > div:first-child,
.state-card__icon {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.empty-state p,
.state-card p {
  margin: 4px 0 0;
  opacity: 0.55;
}

.state-card {
  min-height: 220px;
  justify-content: center;
  text-align: center;
}

.state-card {
  flex-direction: column;
}

.state-card button {
  padding: variables.$spacing-sm variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: transparent;
  color: variables.$color-primary;
  font: inherit;
  cursor: pointer;
}

.state-card--error .state-card__icon {
  background: #d85151;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid variables.$color-border;
  border-top-color: variables.$color-primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .my-tasks__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .my-tasks__summary {
    grid-template-columns: 1fr;
  }

  .task-card__top {
    flex-direction: column;
  }

  .task-card__submission {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
