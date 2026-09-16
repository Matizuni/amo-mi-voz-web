<template>

  <section class="my-tasks">

    

    <header class="tasks-hero">

      <div>

        <span class="eyebrow">ESTUDIANTE · AULA VIRTUAL</span>

        <h1>Mis tareas</h1>

        <p>

          Revisa tus actividades, entregas, evaluaciones y retroalimentación

          en un solo lugar.

        </p>

      </div>

      <div class="tasks-hero__status">

        <span class="tasks-hero__status-icon">✓</span>

        <div>

          <small>SEGUIMIENTO</small>

          <strong>{{ pendingCount ? `${pendingCount} pendiente${pendingCount === 1 ? '' : 's'}` : 'Todo al día' }}</strong>

          <span>{{ assignments.length }} actividad{{ assignments.length === 1 ? '' : 'es' }} publicada{{ assignments.length === 1 ? '' : 's' }}</span>

        </div>

      </div>

    </header>

    

    <section

      v-if="isLoading"

      class="state-card"

    >

      <div class="loading-spinner"></div>

      <strong>Cargando tus tareas...</strong>

      <p>Sincronizando actividades y evaluaciones.</p>

    </section>

    <section

      v-else-if="loadError"

      class="state-card state-card--error"

    >

      <div class="state-card__icon">!</div>

      <strong>No pudimos cargar tus tareas</strong>

      <p>{{ loadError }}</p>

      <button type="button" @click="loadPage">

        Reintentar

      </button>

    </section>

    <template v-else>

      

      <section class="tasks-summary" aria-label="Resumen de tareas" v-show="isTasksTab('resumen')">

        <article class="summary-card summary-card--total">

          <span class="summary-card__icon">01</span>

          <div>

            <small>TOTAL</small>

            <strong>{{ assignments.length }}</strong>

            <p>actividades publicadas</p>

          </div>

        </article>

        <article class="summary-card summary-card--pending">

          <span class="summary-card__icon">!</span>

          <div>

            <small>PENDIENTES</small>

            <strong>{{ pendingCount }}</strong>

            <p>requieren tu atención</p>

          </div>

        </article>

        <article class="summary-card summary-card--delivered">

          <span class="summary-card__icon">↑</span>

          <div>

            <small>ENTREGADAS</small>

            <strong>{{ deliveredCount }}</strong>

            <p>esperando revisión</p>

          </div>

        </article>

        <article class="summary-card summary-card--reviewed">

          <span class="summary-card__icon">✓</span>

          <div>

            <small>REVISADAS</small>

            <strong>{{ reviewedCount }}</strong>

            <p>con evaluación disponible</p>

          </div>

        </article>

      </section>

      

      <section v-show="isTasksTab('resumen')" class="tasks-priority" :class="{ 'is-clear': !nextPendingTask }">

        <div class="tasks-priority__icon">{{ nextPendingTask ? '!' : '✓' }}</div>

        <div class="tasks-priority__copy">

          <span>{{ nextPendingTask ? 'PRÓXIMA TAREA PENDIENTE' : 'AGENDA DE TAREAS' }}</span>

          <strong>{{ nextPendingTask ? nextPendingTask.assignment.title : 'No tienes entregas pendientes' }}</strong>

          <p v-if="nextPendingTask">

            {{ nextPendingTask.assignment.dueDate

              ? `Fecha límite: ${formatDate(nextPendingTask.assignment.dueDate)}`

              : 'Esta actividad no tiene fecha límite definida.' }}

          </p>

          <p v-else>Todo lo publicado hasta ahora está entregado o revisado.</p>

        </div>

        <RouterLink

          v-if="nextPendingTask"

          :to="`/aula/clase/${nextPendingTask.assignment.lessonId}/tarea/${nextPendingTask.assignment.id}`"

          class="tasks-priority__action"

        >Continuar tarea →</RouterLink>

      </section>

      <nav

        class="tasks-context-nav"

        aria-label="Secciones de mis tareas"

      >

        <button type="button"

          :class="{ 'is-active': isTasksTab('resumen') }"

          @click="setTasksTab('resumen')">

          <span>01</span> Resumen

        </button>

        <button type="button"

          :class="{ 'is-active': isTasksTab('pendientes') }"

          @click="setTasksTab('pendientes')">

          <span>02</span> Pendientes

          <small>{{ pendingCount }}</small>

        </button>

        <button type="button"

          :class="{ 'is-active': isTasksTab('entregadas') }"

          @click="setTasksTab('entregadas')">

          <span>03</span> Entregadas

          <small>{{ deliveredCount }}</small>

        </button>

        <button type="button"

          :class="{ 'is-active': isTasksTab('revisadas') }"

          @click="setTasksTab('revisadas')">

          <span>04</span> Revisadas

          <small>{{ reviewedCount }}</small>

        </button>

        <button type="button"

          :class="{ 'is-active': isTasksTab('todas') }"

          @click="setTasksTab('todas')">

          <span>05</span> Todas

          <small>{{ assignments.length }}</small>

        </button>

      </nav>

      <section

        v-show="isTasksTab('resumen')"

        class="tasks-overview"

      >

        <header class="tasks-overview__header">

          <span>SEGUIMIENTO ACADÉMICO</span>

          <h2>Resumen de tus tareas</h2>

          <p>

            Consulta rápidamente qué requiere tu atención,

            qué ya entregaste y qué actividades tienen

            retroalimentación disponible.

          </p>

        </header>

        <div class="tasks-overview__grid">

          <button type="button" @click="setTasksTab('pendientes')">

            <span>PENDIENTES</span>

            <strong>{{ pendingCount }}</strong>

            <small>requieren tu atención</small>

            <b>Revisar pendientes →</b>

          </button>

          <button type="button" @click="setTasksTab('entregadas')">

            <span>ENTREGADAS</span>

            <strong>{{ deliveredCount }}</strong>

            <small>esperando revisión</small>

            <b>Ver entregas →</b>

          </button>

          <button type="button" @click="setTasksTab('revisadas')">

            <span>REVISADAS</span>

            <strong>{{ reviewedCount }}</strong>

            <small>con evaluación disponible</small>

            <b>Ver retroalimentación →</b>

          </button>

        </div>

        <article class="tasks-overview__status"

          :class="{ 'is-complete': pendingCount === 0 }">

          <div class="tasks-overview__status-icon">

            {{ pendingCount ? '!' : '✓' }}

          </div>

          <div>

            <span>ESTADO ACTUAL</span>

            <h3>

              {{

                pendingCount

                  ? `${pendingCount} tarea${pendingCount === 1 ? '' : 's'} pendiente${pendingCount === 1 ? '' : 's'}`

                  : 'Todo al día'

              }}

            </h3>

            <p>

              {{

                pendingCount

                  ? 'Entra a Pendientes para continuar con las actividades que todavía no has entregado.'

                  : 'No tienes tareas pendientes en este momento.'

              }}

            </p>

          </div>

        </article>

      </section>





      









      

      <section class="tasks-section" v-show="!isTasksTab('resumen')">

        <header class="section-header">

          <div class="section-heading">

            <span>01</span>

            <div>

              <small>{{ activeTaskPanelMeta.eyebrow }}</small>

              <h2>{{ activeTaskPanelMeta.title }}</h2>

            </div>

          </div>

          <p>

            {{ activeTaskPanelMeta.description }}

          </p>

        </header>

        <div

          v-if="filteredTasks.length"

          class="task-list"

        >

          <RouterLink

            v-for="item in filteredTasks"

            :key="item.assignment.id"

            :to="`/aula/clase/${item.assignment.lessonId}/tarea/${item.assignment.id}`"

            class="task-card"

            :class="`task-card--${item.status}`"

          >

            <div class="task-card__marker">

              <span>

                {{

                  item.status === 'reviewed'

                    ? '✓'

                    : item.status === 'delivered'

                      ? '↑'

                      : '!'

                }}

              </span>

            </div>

            <div class="task-card__body">

              <div class="task-card__heading">

                <div>

                  <div class="task-card__badges">

                    <span class="task-card__type">

                      {{ getTypeLabel(item.assignment.type) }}

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

                      'Esta actividad no incluye instrucciones adicionales.'

                    }}

                  </p>

                </div>

                <div class="task-card__points">

                  <strong>{{ item.assignment.points ?? 100 }}</strong>

                  <span>pts</span>

                </div>

              </div>

              <div class="task-card__meta">

                <article>

                  <small>ENTREGA</small>

                  <strong>

                    {{ getAcceptedFileLabel(item.assignment.acceptedFile) }}

                  </strong>

                </article>

                <article>

                  <small>FECHA LÍMITE</small>

                  <strong>

                    {{

                      item.assignment.dueDate

                        ? formatDate(item.assignment.dueDate)

                        : 'Sin fecha límite'

                    }}

                  </strong>

                </article>

                <article>

                  <small>ESTADO</small>

                  <strong>{{ getStatusLabel(item.status) }}</strong>

                </article>

              </div>

              <div

                v-if="item.submission"

                class="task-card__submission"

              >

                <div>

                  <small>ARCHIVO ENTREGADO</small>

                  <strong>

                    {{ item.submission.fileName || 'Entrega registrada' }}

                  </strong>

                </div>

                <div v-if="item.submission.grade">

                  <small>CALIFICACIÓN</small>

                  <strong class="task-card__grade">

                    {{ item.submission.grade }}

                  </strong>

                </div>

              </div>

              <div

                v-if="item.status === 'reviewed'"

                class="task-card__feedback"

              >

                <div class="task-card__feedback-icon">✓</div>

                <div>

                  <small>RETROALIMENTACIÓN DISPONIBLE</small>

                  <strong>Tu actividad ya fue revisada</strong>

                  <p v-if="item.submission.feedback">

                    {{ item.submission.feedback }}

                  </p>

                  <span v-if="item.submission.reviewedAt">

                    Revisado {{ formatDateTime(item.submission.reviewedAt) }}

                  </span>

                </div>

              </div>

              <footer class="task-card__footer">

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

              </footer>

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

            <p>

              {{

                activeFilter === 'all'

                  ? 'Todavía no tienes actividades publicadas.'

                  : 'Prueba seleccionando otro filtro.'

              }}

            </p>

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

const activeTasksTab = ref('resumen')

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

}





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

const nextPendingTask = computed(() => {

  const pending = taskItems.value.filter(item => item.status === 'pending')

  return [...pending].sort((a, b) => {

    const dateA = a.assignment.dueDate

      ? new Date(`${a.assignment.dueDate}T12:00:00`).getTime()

      : Number.POSITIVE_INFINITY

    const dateB = b.assignment.dueDate

      ? new Date(`${b.assignment.dueDate}T12:00:00`).getTime()

      : Number.POSITIVE_INFINITY

    return dateA - dateB

  })[0] || null

})

const filteredTasks = computed(() => {

  if (activeFilter.value === 'all') {

    return taskItems.value

  }

  return taskItems.value.filter(

    item =>

      item.status === activeFilter.value

  )

})

const activeTaskPanelMeta = computed(() => {

  const metaByTab = {

    pendientes: { eyebrow: 'POR HACER', title: 'Tareas pendientes', description: 'Actividades que todavía requieren una entrega.' },

    entregadas: { eyebrow: 'EN REVISIÓN', title: 'Tareas entregadas', description: 'Entregas registradas que están esperando revisión.' },

    revisadas: { eyebrow: 'RETROALIMENTACIÓN', title: 'Tareas revisadas', description: 'Actividades con evaluación o retroalimentación disponible.' },

    todas: { eyebrow: 'ACTIVIDADES', title: 'Todas las tareas', description: 'Consulta el historial completo de actividades publicadas.' }

  }

  return metaByTab[activeTasksTab.value] || metaByTab.todas

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

.my-tasks {

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

  --gold-dark: #987000;

  --gold-soft: #fff8e7;

  --green: #2d8a63;

  --green-soft: #edf8f3;

  --blue: #3f6fa8;

  --blue-soft: #eef5fc;

  --danger: #be4856;

  --danger-soft: #fff3f5;

  width: min(1180px, calc(100% - 40px));

  margin-inline: auto;

  padding: 38px 0 72px;

  color: var(--ink);

}

.tasks-hero {

  position: relative;

  display: flex;

  gap: 30px;

  align-items: center;

  justify-content: space-between;

  overflow: hidden;

  margin-bottom: 16px;

  padding: 30px 32px;

  border: 1px solid var(--line);

  border-radius: 22px;

  background:

    radial-gradient(circle at 91% 6%, rgba(217,169,29,.12), transparent 30%),

    linear-gradient(135deg, #fff 0%, #fbfcfe 68%, #fffaf0 100%);

  box-shadow: 0 14px 36px rgba(31,48,73,.055);

}

.tasks-hero::before {

  position: absolute;

  inset: 0 auto auto 0;

  width: 125px;

  height: 3px;

  content: '';

  background: linear-gradient(90deg, var(--wine), var(--gold));

}

.eyebrow {

  color: var(--gold-dark);

  font-size: .62rem;

  font-weight: 900;

  letter-spacing: .15em;

}

.tasks-hero h1 {

  margin: 7px 0 10px;

  color: var(--ink);

  font-size: clamp(2.6rem, 5.5vw, 4.5rem);

  line-height: .98;

  letter-spacing: -.045em;

}

.tasks-hero > div:first-child > p {

  max-width: 650px;

  margin: 0;

  color: var(--muted);

  font-size: .84rem;

  line-height: 1.65;

}

.tasks-hero__status {

  display: flex;

  min-width: 215px;

  gap: 11px;

  align-items: center;

  padding: 15px;

  border: 1px solid #d8e5dd;

  border-radius: 14px;

  background: rgba(255,255,255,.78);

}

.tasks-hero__status-icon {

  display: grid;

  width: 39px;

  height: 39px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 12px;

  color: #fff;

  background: var(--green);

  font-size: .7rem;

  font-weight: 900;

}

.tasks-hero__status small,

.tasks-hero__status strong,

.tasks-hero__status div > span {

  display: block;

}

.tasks-hero__status small {

  color: #6b8c79;

  font-size: .46rem;

  font-weight: 900;

  letter-spacing: .1em;

}

.tasks-hero__status strong {

  margin: 2px 0;

  color: #285f44;

  font-size: .7rem;

}

.tasks-hero__status div > span {

  color: var(--muted);

  font-size: .56rem;

}

.tasks-summary {

  display: grid;

  grid-template-columns: repeat(4, minmax(0,1fr));

  gap: 12px;

  margin-bottom: 16px;

}

.summary-card {

  display: flex;

  min-height: 112px;

  gap: 12px;

  align-items: flex-start;

  padding: 17px;

  border: 1px solid var(--line);

  border-radius: 16px;

  background: #fff;

  box-shadow: 0 7px 20px rgba(31,48,73,.035);

}

.summary-card__icon {

  display: grid;

  width: 35px;

  height: 35px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 10px;

  font-size: .56rem;

  font-weight: 900;

}

.summary-card small,

.summary-card strong,

.summary-card p {

  display: block;

}

.summary-card small {

  color: var(--muted-2);

  font-size: .47rem;

  font-weight: 900;

  letter-spacing: .09em;

}

.summary-card strong {

  margin-top: 4px;

  color: var(--ink);

  font-size: 1.45rem;

  line-height: 1;

}

.summary-card p {

  margin: 5px 0 0;

  color: var(--muted);

  font-size: .57rem;

  line-height: 1.4;

}

.summary-card--total .summary-card__icon {

  color: var(--gold-dark);

  background: var(--gold-soft);

}

.summary-card--pending {

  border-color: #ead5da;

  background: linear-gradient(145deg, #fff, #fff7f8);

}

.summary-card--pending .summary-card__icon {

  color: var(--danger);

  background: var(--danger-soft);

}

.summary-card--delivered {

  border-color: #d7e2ed;

  background: linear-gradient(145deg, #fff, #f6f9fd);

}

.summary-card--delivered .summary-card__icon {

  color: var(--blue);

  background: var(--blue-soft);

}

.summary-card--reviewed {

  border-color: #cde2d6;

  background: linear-gradient(145deg, #fff, #f4faf7);

}

.summary-card--reviewed .summary-card__icon {

  color: var(--green);

  background: var(--green-soft);

}

.tasks-toolbar {

  display: flex;

  gap: 18px;

  align-items: center;

  justify-content: space-between;

  margin-bottom: 32px;

  padding: 12px;

  border: 1px solid var(--line);

  border-radius: 14px;

  background: #fff;

  box-shadow: 0 7px 20px rgba(31,48,73,.03);

}

.tasks-toolbar__eyebrow {

  display: block;

  margin: 0 0 7px 4px;

  color: var(--gold-dark);

  font-size: .48rem;

  font-weight: 900;

  letter-spacing: .11em;

}

.tasks-filters {

  display: flex;

  gap: 6px;

  flex-wrap: wrap;

}

.tasks-filters button {

  display: inline-flex;

  gap: 8px;

  align-items: center;

  padding: 9px 11px;

  border: 1px solid transparent;

  border-radius: 9px;

  color: #617084;

  background: #f7f9fc;

  font: inherit;

  font-size: .66rem;

  font-weight: 800;

  cursor: pointer;

}

.tasks-filters button > span {

  display: grid;

  min-width: 20px;

  height: 20px;

  place-items: center;

  padding: 0 5px;

  border-radius: 999px;

  color: #718095;

  background: #fff;

  font-size: .52rem;

}

.tasks-filters button.active {

  border-color: #e2ca78;

  color: #765800;

  background: var(--gold-soft);

}

.tasks-filters button.active > span {

  color: #765800;

  background: #f5d66f;

}

.tasks-toolbar__count {

  flex: 0 0 auto;

  color: var(--muted);

  font-size: .61rem;

}

.tasks-toolbar__count strong {

  color: var(--ink);

}

.section-header {

  display: flex;

  gap: 22px;

  align-items: flex-end;

  justify-content: space-between;

  margin-bottom: 17px;

}

.section-heading {

  display: flex;

  gap: 12px;

  align-items: center;

}

.section-heading > span {

  display: grid;

  width: 39px;

  height: 39px;

  flex: 0 0 auto;

  place-items: center;

  border: 1px solid #ead17d;

  border-radius: 50%;

  color: var(--gold-dark);

  background: var(--gold-soft);

  font-size: .58rem;

  font-weight: 900;

}

.section-heading small {

  display: block;

  margin-bottom: 3px;

  color: var(--gold-dark);

  font-size: .52rem;

  font-weight: 900;

  letter-spacing: .12em;

}

.section-heading h2 {

  margin: 0;

  color: var(--ink);

  font-size: clamp(1.4rem,2.5vw,1.9rem);

  letter-spacing: -.03em;

}

.section-header > p {

  max-width: 410px;

  margin: 0;

  color: var(--muted);

  font-size: .67rem;

  line-height: 1.55;

  text-align: right;

}

.task-list {

  display: grid;

  gap: 12px;

}

.task-card {

  display: grid;

  grid-template-columns: auto minmax(0,1fr);

  gap: 16px;

  padding: 18px;

  border: 1px solid var(--line);

  border-radius: 17px;

  color: var(--ink);

  background: #fff;

  box-shadow: 0 8px 23px rgba(31,48,73,.035);

  text-decoration: none;

  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;

}

.task-card:hover {

  border-color: #c6d2df;

  box-shadow: 0 11px 28px rgba(31,48,73,.07);

  transform: translateY(-2px);

}

.task-card--pending {

  border-left: 4px solid #d7a91f;

}

.task-card--delivered {

  border-left: 4px solid var(--blue);

}

.task-card--reviewed {

  border-left: 4px solid var(--green);

}

.task-card__marker > span {

  display: grid;

  width: 38px;

  height: 38px;

  place-items: center;

  border-radius: 11px;

  color: #816000;

  background: var(--gold-soft);

  font-size: .65rem;

  font-weight: 900;

}

.task-card--delivered .task-card__marker > span {

  color: var(--blue);

  background: var(--blue-soft);

}

.task-card--reviewed .task-card__marker > span {

  color: var(--green);

  background: var(--green-soft);

}

.task-card__heading {

  display: flex;

  gap: 18px;

  align-items: flex-start;

  justify-content: space-between;

}

.task-card__badges {

  display: flex;

  gap: 6px;

  flex-wrap: wrap;

  margin-bottom: 7px;

}

.task-card__badges span {

  padding: 5px 7px;

  border-radius: 999px;

  font-size: .5rem;

  font-weight: 900;

  letter-spacing: .06em;

}

.task-card__type {

  border: 1px solid #e3d394;

  color: var(--gold-dark);

  background: var(--gold-soft);

}

.task-card__status {

  border: 1px solid #dfe5ec;

  color: #6f7d8f;

  background: #f8fafc;

}

.task-card__status--delivered {

  border-color: #cbdced;

  color: var(--blue);

  background: var(--blue-soft);

}

.task-card__status--reviewed {

  border-color: #c7e0d2;

  color: var(--green);

  background: var(--green-soft);

}

.task-card h3 {

  margin: 0 0 6px;

  color: var(--ink);

  font-size: 1rem;

  letter-spacing: -.015em;

}

.task-card__heading p {

  max-width: 720px;

  margin: 0;

  color: var(--muted);

  font-size: .66rem;

  line-height: 1.55;

}

.task-card__points {

  display: flex;

  min-width: 70px;

  gap: 3px;

  align-items: baseline;

  justify-content: center;

  padding: 10px 11px;

  border: 1px solid #e4d18e;

  border-radius: 11px;

  background: #fffaf0;

}

.task-card__points strong {

  color: var(--gold-dark);

  font-size: 1.05rem;

}

.task-card__points span {

  color: #8d7c48;

  font-size: .5rem;

  font-weight: 900;

}

.task-card__meta {

  display: grid;

  grid-template-columns: repeat(3,minmax(0,1fr));

  gap: 9px;

  margin-top: 14px;

}

.task-card__meta article {

  min-width: 0;

  padding: 11px 12px;

  border: 1px solid #e3e8ee;

  border-radius: 10px;

  background: #f8fafc;

}

.task-card__meta small,

.task-card__meta strong {

  display: block;

}

.task-card__meta small {

  color: var(--muted-2);

  font-size: .44rem;

  font-weight: 900;

  letter-spacing: .08em;

}

.task-card__meta strong {

  overflow: hidden;

  margin-top: 4px;

  color: var(--ink-soft);

  font-size: .62rem;

  text-overflow: ellipsis;

  white-space: nowrap;

}

.task-card__submission {

  display: flex;

  gap: 18px;

  align-items: center;

  justify-content: space-between;

  margin-top: 12px;

  padding: 12px 13px;

  border: 1px solid #d8e3ed;

  border-radius: 11px;

  background: #f7fafe;

}

.task-card__submission small,

.task-card__submission strong {

  display: block;

}

.task-card__submission small {

  color: var(--blue);

  font-size: .46rem;

  font-weight: 900;

  letter-spacing: .08em;

}

.task-card__submission strong {

  margin-top: 3px;

  color: var(--ink-soft);

  font-size: .64rem;

}

.task-card__grade {

  color: var(--green) !important;

  font-size: 1.15rem !important;

}

.task-card__feedback {

  display: grid;

  grid-template-columns: auto 1fr;

  gap: 11px;

  margin-top: 12px;

  padding: 13px;

  border: 1px solid #c9e1d3;

  border-radius: 11px;

  background: var(--green-soft);

}

.task-card__feedback-icon {

  display: grid;

  width: 30px;

  height: 30px;

  place-items: center;

  border-radius: 9px;

  color: #fff;

  background: var(--green);

  font-size: .56rem;

  font-weight: 900;

}

.task-card__feedback small,

.task-card__feedback strong,

.task-card__feedback span {

  display: block;

}

.task-card__feedback small {

  color: #438061;

  font-size: .44rem;

  font-weight: 900;

  letter-spacing: .08em;

}

.task-card__feedback strong {

  margin-top: 3px;

  color: #276145;

  font-size: .67rem;

}

.task-card__feedback p {

  margin: 6px 0 0;

  color: #577564;

  font-size: .62rem;

  line-height: 1.5;

}

.task-card__feedback span {

  margin-top: 5px;

  color: #70917f;

  font-size: .54rem;

}

.task-card__footer {

  display: flex;

  gap: 14px;

  align-items: center;

  justify-content: space-between;

  margin-top: 14px;

  padding-top: 13px;

  border-top: 1px solid #e8edf2;

}

.task-card__footer span,

.task-card__footer b {

  color: var(--wine);

  font-size: .64rem;

  font-weight: 900;

}

.empty-state,

.state-card {

  display: flex;

  gap: 13px;

  align-items: center;

  padding: 22px;

  border: 1px solid var(--line);

  border-radius: 16px;

  background: #fff;

}

.empty-state > div:first-child,

.state-card__icon {

  display: grid;

  width: 43px;

  height: 43px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 12px;

  color: var(--green);

  background: var(--green-soft);

  font-size: .7rem;

  font-weight: 900;

}

.empty-state strong,

.state-card strong {

  color: var(--ink);

}

.empty-state p,

.state-card p {

  margin: 4px 0 0;

  color: var(--muted);

  font-size: .65rem;

}

.state-card {

  min-height: 220px;

  justify-content: center;

  flex-direction: column;

  text-align: center;

}

.state-card button {

  padding: 9px 13px;

  border: 1px solid var(--wine);

  border-radius: 9px;

  color: var(--wine);

  background: #fff;

  font: inherit;

  font-size: .65rem;

  font-weight: 850;

  cursor: pointer;

}

.state-card--error .state-card__icon {

  color: #fff;

  background: var(--danger);

}

.loading-spinner {

  width: 42px;

  height: 42px;

  border: 3px solid #e5eaf0;

  border-top-color: var(--wine);

  border-radius: 50%;

  animation: spin .8s linear infinite;

}

@keyframes spin {

  to { transform: rotate(360deg); }

}

@media (max-width: 900px) {

  .tasks-summary {

    grid-template-columns: repeat(2,minmax(0,1fr));

  }

  .tasks-hero {

    align-items: flex-start;

    flex-direction: column;

  }

  .tasks-hero__status {

    width: 100%;

  }

}

@media (max-width: 700px) {

  .my-tasks {

    width: min(100% - 28px, 1180px);

    padding: 28px 0 54px;

  }

  .tasks-toolbar,

  .section-header {

    align-items: flex-start;

    flex-direction: column;

  }

  .tasks-toolbar__count {

    align-self: flex-end;

  }

  .section-header > p {

    max-width: none;

    text-align: left;

  }

  .task-card__heading {

    flex-direction: column;

  }

  .task-card__points {

    align-self: flex-start;

  }

  .task-card__meta {

    grid-template-columns: 1fr;

  }

}

@media (max-width: 520px) {

  .tasks-summary {

    grid-template-columns: 1fr;

  }

  .tasks-hero {

    padding: 23px;

  }

  .task-card {

    grid-template-columns: 1fr;

  }

  .task-card__marker {

    display: none;

  }

  .task-card__submission {

    align-items: flex-start;

    flex-direction: column;

  }

}

.my-tasks {

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

.my-tasks :where(a, button, input, textarea, select, [role="button"]) {

  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;

}

.my-tasks :where(a, button, input, textarea, select, [role="button"]):focus-visible {

  outline: 3px solid rgba(159, 25, 69, .22) !important;

  outline-offset: 3px;

}

.my-tasks :where(button, [role="button"], .button, .btn):not(:disabled):active {

  transform: translateY(1px) scale(.99);

}

.my-tasks :where(input, textarea, select) {

  font-size: max(16px, 1em);

}

.my-tasks :where(table tbody tr) {

  transition: background-color .18s ease;

}

.my-tasks :where(table tbody tr):hover {

  background-color: rgba(159, 25, 69, .025);

}

.my-tasks :where(.card, [class*="-card"], [class*="__card"]) {

  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;

}

.my-tasks :where(.card, [class*="-card"], [class*="__card"]):hover {

  border-color: rgba(159, 25, 69, .16);

}

@media (prefers-reduced-motion: reduce) {
  .my-tasks,
  .my-tasks *,
  .my-tasks *::before,
  .my-tasks *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}





.my-tasks {

  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;

}

.my-tasks :where(

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

  .my-tasks :where(

    article,

    [class$="__card"],

    [class*="-card"],

    [class*="_card"]

  ):hover {

    transform: translateY(-2px);

  }

  .my-tasks :where(

    button,

    .button,

    .btn,

    a[class*="button"],

    a[class*="cta"]

  ):not(:disabled):hover {

    transform: translateY(-2px);

    filter: saturate(1.04);

  }

  .my-tasks :where(img) {

    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;

  }

  .my-tasks :where(

    [class*="cover"],

    [class*="hero"],

    [class*="visual"],

    [class*="gallery"]

  ):hover img {

    transform: scale(1.018);

  }

}

.my-tasks :where(

  button,

  .button,

  .btn,

  a[class*="button"],

  a[class*="cta"]

) {

  will-change: transform;

}

.my-tasks :where(input, textarea, select):focus {

  transform: translateY(-1px);

}

.my-tasks :where(

  [class*="progress"] > *,

  [class*="bar"] > *,

  progress

) {

  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;

}

.my-tasks ::selection {

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
  .my-tasks,
  .my-tasks *,
  .my-tasks *::before,
  .my-tasks *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.tasks-context-nav {

  position:sticky; top:14px; z-index:30;

  display:grid; grid-template-columns:repeat(5,minmax(0,1fr));

  gap:7px; margin:0 0 26px; padding:7px;

  border:1px solid #dbe3ec; border-radius:18px;

  background:rgba(255,255,255,.94);

  box-shadow:0 14px 36px rgba(20,32,51,.08);

  backdrop-filter:blur(16px);

}

.tasks-context-nav button {

  min-height:58px; display:flex; align-items:center; justify-content:center;

  gap:8px; padding:10px 11px; border:0; border-radius:13px;

  color:#536176; background:transparent; font:inherit; font-weight:800;

  cursor:pointer; transition:.2s ease;

}

.tasks-context-nav button > span {

  display:grid; width:25px; height:25px; place-items:center;

  border-radius:8px; color:#7a8798; background:#f2f5f8; font-size:10px;

}

.tasks-context-nav button > small {

  padding:3px 7px; border-radius:999px;

  color:#667085; background:#f2f5f8; font-size:11px;

}

.tasks-context-nav button:hover {

  transform:translateY(-1px); color:#9f1945; background:#faf7f8;

}

.tasks-context-nav button.is-active {

  color:#fff; background:#9f1945;

  box-shadow:0 9px 22px rgba(159,25,69,.20);

}

.tasks-context-nav button.is-active > span,

.tasks-context-nav button.is-active > small {

  color:#fff; background:rgba(255,255,255,.16);

}

.tasks-overview {

  margin-bottom:28px; padding:clamp(22px,3vw,32px);

  border:1px solid #dbe3ec; border-radius:24px; background:#fff;

  box-shadow:0 16px 44px rgba(20,32,51,.07);

  animation:tasksPanelIn .35s cubic-bezier(.2,.75,.25,1);

}

.tasks-overview__header {

  padding-bottom:20px; border-bottom:1px solid #e5eaf0;

}

.tasks-overview__header > span,

.tasks-overview__status span {

  color:#9f1945; font-size:11px; font-weight:900; letter-spacing:.12em;

}

.tasks-overview__header h2 {

  margin:6px 0; color:#172033; font-size:clamp(24px,3vw,34px);

}

.tasks-overview__header p {

  max-width:700px; margin:0; color:#667085; line-height:1.6;

}

.tasks-overview__grid {

  display:grid; grid-template-columns:repeat(3,minmax(0,1fr));

  gap:15px; margin-top:22px;

}

.tasks-overview__grid button {

  min-height:174px; display:flex; flex-direction:column; align-items:flex-start;

  padding:21px; border:1px solid #dbe3ec; border-radius:18px;

  color:#172033; background:#f8fafc; text-align:left; cursor:pointer;

  transition:.22s ease;

}

.tasks-overview__grid button:hover {

  transform:translateY(-3px); border-color:rgba(159,25,69,.28);

  background:#fff; box-shadow:0 13px 28px rgba(20,32,51,.08);

}

.tasks-overview__grid button > span {

  color:#9f1945; font-size:11px; font-weight:900; letter-spacing:.1em;

}

.tasks-overview__grid button > strong { margin:10px 0 4px; font-size:36px; }

.tasks-overview__grid button > small { color:#667085; }

.tasks-overview__grid button > b {

  margin-top:auto; padding-top:18px; color:#9f1945; font-size:13px;

}

.tasks-overview__status {

  display:grid; grid-template-columns:auto 1fr; gap:15px; align-items:center;

  margin-top:18px; padding:19px; border:1px solid #eadfbd;

  border-radius:18px; background:#fffaf0;

}

.tasks-overview__status.is-complete {

  border-color:#d7ece2; background:#edf8f3;

}

.tasks-overview__status-icon {

  display:grid; width:43px; height:43px; place-items:center;

  border-radius:13px; color:#fff; background:#d9a91d; font-weight:900;

}

.tasks-overview__status.is-complete .tasks-overview__status-icon {

  background:#2d8a63;

}

.tasks-overview__status h3 { margin:4px 0; color:#172033; }

.tasks-overview__status p { margin:0; color:#667085; line-height:1.5; }

.tasks-section {

  animation:tasksPanelIn .35s cubic-bezier(.2,.75,.25,1);

}

@keyframes tasksPanelIn {

  from { opacity:0; transform:translateY(8px); }

  to { opacity:1; transform:translateY(0); }

}

@media (max-width:900px) {

  .tasks-context-nav {

    grid-template-columns:none; grid-auto-flow:column;

    grid-auto-columns:minmax(155px,1fr); overflow-x:auto;

  }

  .tasks-overview__grid { grid-template-columns:1fr; }

}

@media (max-width:600px) {

  .tasks-overview__status {

    grid-template-columns:1fr; align-items:flex-start;

  }

}

@media (prefers-reduced-motion:reduce) {

  .tasks-context-nav button,

  .tasks-overview,

  .tasks-section {

    animation:none !important; transition:none !important;

  }

}





*/* AMV · MY TASKS v11.0 · AGENDA DE ENTREGAS PRO */*

.tasks-hero{

  min-height:210px;padding:34px 36px!important;border-radius:26px!important;

  background:radial-gradient(circle at 91% 7%,rgba(217,169,29,.16),transparent 27%),

  radial-gradient(circle at 76% 120%,rgba(159,25,69,.08),transparent 34%),

  linear-gradient(135deg,#fff 0%,#fbfcfe 66%,#fff9eb 100%)!important;

  box-shadow:0 18px 46px rgba(23,32,51,.065)!important

}

.tasks-hero h1{font-size:clamp(3rem,5.6vw,4.8rem)!important;font-weight:950}

.tasks-hero__status{border-color:rgba(159,25,69,.13)!important;background:rgba(255,255,255,.88)!important;box-shadow:0 12px 28px rgba(23,32,51,.055)}

.tasks-context-nav{top:14px!important;margin-bottom:22px!important;border-radius:18px!important}

.tasks-summary{gap:12px!important;margin-bottom:12px!important}

.summary-card{min-height:120px!important;border-radius:18px!important}

.tasks-priority{

  display:grid;grid-template-columns:auto minmax(0,1fr) auto;gap:15px;align-items:center;

  margin:0 0 18px;padding:17px 18px;border:1px solid #ead9de;border-radius:17px;

  background:radial-gradient(circle at 100% 0,rgba(217,169,29,.10),transparent 34%),linear-gradient(145deg,#fff,#fff8fa);

  box-shadow:0 8px 24px rgba(31,48,73,.035)

}

.tasks-priority.is-clear{border-color:#cee2d7;background:linear-gradient(145deg,#fff,#f4faf7)}

.tasks-priority__icon{display:grid;width:42px;height:42px;place-items:center;border-radius:12px;color:#fff;background:var(--wine);font-size:.72rem;font-weight:950;box-shadow:0 8px 18px rgba(159,25,69,.16)}

.tasks-priority.is-clear .tasks-priority__icon{background:var(--green)}

.tasks-priority__copy{min-width:0}

.tasks-priority__copy span{display:block;color:var(--wine);font-size:.49rem;font-weight:950;letter-spacing:.11em}

.tasks-priority.is-clear .tasks-priority__copy span{color:var(--green)}

.tasks-priority__copy strong{display:block;overflow:hidden;margin-top:4px;color:var(--ink);font-size:.82rem;text-overflow:ellipsis;white-space:nowrap}

.tasks-priority__copy p{margin:4px 0 0;color:var(--muted);font-size:.61rem}

.tasks-priority__action{padding:10px 13px;border:1px solid rgba(159,25,69,.20);border-radius:10px;color:var(--wine);background:#fff;font-size:.62rem;font-weight:900;text-decoration:none;white-space:nowrap}

.tasks-priority__action:hover{color:#fff;background:var(--wine)}

.tasks-overview,.task-card{box-shadow:0 12px 34px rgba(31,48,73,.045)!important}

@media(max-width:720px){

  .tasks-priority{grid-template-columns:auto minmax(0,1fr)}

  .tasks-priority__action{grid-column:1/-1;text-align:center}

  .tasks-context-nav{display:flex!important;overflow-x:auto;justify-content:flex-start!important;scrollbar-width:thin}

  .tasks-context-nav button{min-width:150px;flex:0 0 auto}

}

</style>