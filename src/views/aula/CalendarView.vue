<template>

  <section class="calendar-page">

    <header class="calendar-hero">

      <div>

        <span class="eyebrow">AULA VIRTUAL · PLANIFICACIÓN</span>

        <h1>Calendario</h1>

        <p>

          Revisa clases, entregas y fechas importantes del curso

          en un solo lugar.

        </p>

      </div>

      <div class="hero-date">

        <span>HOY</span>

        <strong>{{ todayDay }}</strong>

        <small>{{ todayMonth }}</small>

      </div>

    </header>

    <section v-if="isLoading" class="state-card">

      <span class="loader"></span>

      <strong>Organizando tu calendario…</strong>

    </section>

    <section v-else-if="errorMessage" class="state-card state-card--error">

      <strong>No pudimos cargar el calendario</strong>

      <p>{{ errorMessage }}</p>

      <button type="button" @click="loadCalendar">Reintentar</button>

    </section>

    <template v-else>

      <section class="calendar-overview" aria-label="Resumen del calendario">
        <article><span>CLASES</span><strong>{{ lessonEventCount }}</strong><small>Programadas</small></article>
        <article><span>TAREAS</span><strong>{{ assignmentEventCount }}</strong><small>Con fecha límite</small></article>
        <article><span>PRÓXIMA FECHA</span><strong>{{ nextEventDay }}</strong><small>{{ nextEventLabel }}</small></article>
        <article class="calendar-overview__accent"><span>ESTE MES</span><strong>{{ visibleMonthEventCount }}</strong><small>Actividades registradas</small></article>
      </section>

      <div class="calendar-toolbar">

        <div class="month-nav">

          <button type="button" aria-label="Mes anterior" @click="changeMonth(-1)">←</button>

          <div>

            <strong>{{ monthTitle }}</strong>

            <span>{{ events.length }} actividades registradas</span>

          </div>

          <button type="button" aria-label="Mes siguiente" @click="changeMonth(1)">→</button>

        </div>

        <div class="filters" aria-label="Filtrar calendario">

          <button

            v-for="filter in filters"

            :key="filter.value"

            type="button"

            :class="{ active: activeFilter === filter.value }"

            @click="activeFilter = filter.value"

          >

            <span :class="`dot dot--${filter.value}`"></span>

            {{ filter.label }}

          </button>

        </div>

        <button class="today-button" type="button" @click="goToday">

          Hoy

        </button>

      </div>

      <div class="calendar-layout">

        <section class="month-card">

          <div class="weekdays">

            <span v-for="day in weekdayLabels" :key="day">{{ day }}</span>

          </div>

          <div class="month-grid">

            <button

              v-for="cell in calendarCells"

              :key="cell.key"

              type="button"

              class="day-cell"

              :class="{

                'is-outside': !cell.isCurrentMonth,

                'is-today': cell.isToday,

                'is-selected': selectedDateKey === cell.key,

                'has-events': cell.events.length

              }"

              @click="selectedDateKey = cell.key"

            >

              <span class="day-number">{{ cell.day }}</span>

              <div class="day-events">

                <span

                  v-for="event in cell.events.slice(0, 3)"

                  :key="event.id"

                  class="event-chip"

                  :class="`event-chip--${event.type}`"

                >

                  {{ event.shortTitle }}

                </span>

                <small v-if="cell.events.length > 3">

                  +{{ cell.events.length - 3 }} más

                </small>

              </div>

            </button>

          </div>

        </section>

        <aside class="agenda-card">

          <header>

            <div>

              <span class="eyebrow">AGENDA</span>

              <h2>{{ selectedDateLabel }}</h2>

            </div>

            <span class="agenda-count">{{ selectedEvents.length }}</span>

          </header>

          <div v-if="selectedEvents.length" class="agenda-list">

            <article

              v-for="event in selectedEvents"

              :key="event.id"

              class="agenda-item"

            >

              <span class="agenda-marker" :class="`agenda-marker--${event.type}`"></span>

              <div>

                <small>{{ event.typeLabel }}</small>

                <strong>{{ event.title }}</strong>

                <p>{{ event.meta }}</p>

              </div>

              <RouterLink :to="event.to">Abrir →</RouterLink>

            </article>

          </div>

          <div v-else class="agenda-empty">

            <div>✓</div>

            <strong>Sin actividades</strong>

            <p>No hay clases ni entregas registradas para este día.</p>

          </div>

          <section class="upcoming">

            <header>

              <span>PRÓXIMAMENTE</span>

              <strong>Siguientes fechas</strong>

            </header>

            <RouterLink
              v-for="event in upcomingEvents.slice(0, 5)"
              :key="`up-${event.id}`"
              :to="event.to"
              class="upcoming-link"
            >

              <div class="upcoming-date">

                <strong>{{ formatDay(event.date) }}</strong>

                <span>{{ formatMonthShort(event.date) }}</span>

              </div>

              <div>

                <small>{{ event.typeLabel }}</small>

                <strong>{{ event.title }}</strong>

              </div>

            </RouterLink>

            <p v-if="!upcomingEvents.length" class="empty-inline">

              No hay próximas fechas registradas.

            </p>

          </section>

        </aside>

      </div>

    </template>

  </section>

</template>

<script setup>

import { computed, onMounted, ref } from 'vue'

import { RouterLink } from 'vue-router'

import { fetchLessons } from '@/services/lessonService'

import { fetchAssignments } from '@/services/assignmentService'

const isLoading = ref(true)

const errorMessage = ref('')

const lessons = ref([])

const assignments = ref([])

const activeFilter = ref('all')

const selectedDateKey = ref('')

const visibleMonth = ref(startOfMonth(new Date()))

const filters = [

  { label: 'Todo', value: 'all' },

  { label: 'Clases', value: 'lesson' },

  { label: 'Tareas', value: 'assignment' },

]

const weekdayLabels = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']

const monthNames = [

  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',

  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'

]

function startOfMonth(date) {

  return new Date(date.getFullYear(), date.getMonth(), 1)

}

function dateKey(date) {

  return [

    date.getFullYear(),

    String(date.getMonth() + 1).padStart(2, '0'),

    String(date.getDate()).padStart(2, '0'),

  ].join('-')

}

function normalizeText(value = '') {

  return String(value).trim().toLowerCase()

}

function parseDateValue(value) {

  if (!value) {

    return null

  }

  if (

    value instanceof Date &&

    !Number.isNaN(

      value.getTime(),

    )

  ) {

    return value

  }

  const raw =

    String(value).trim()

  

  const iso =

    raw.match(

      /^(\d{4})-(\d{2})-(\d{2})/,

    )

  if (iso) {

    return new Date(

      Number(iso[1]),

      Number(iso[2]) - 1,

      Number(iso[3]),

    )

  }



  

  const cl =

    raw.match(

      /^(\d{1,2})-(\d{1,2})-(\d{4})/,

    )

  if (cl) {

    return new Date(

      Number(cl[3]),

      Number(cl[2]) - 1,

      Number(cl[1]),

    )

  }



  

  const monthMap = {

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

    diciembre: 11,

  }



  

  const spanishWithYear =

    raw.match(

      /^(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i,

    )

  if (spanishWithYear) {

    const month =

      monthMap[

        normalizeText(

          spanishWithYear[2],

        )

      ]

    if (

      month !== undefined

    ) {

      return new Date(

        Number(

          spanishWithYear[3],

        ),

        month,

        Number(

          spanishWithYear[1],

        ),

      )

    }

  }



  

  const spanishWithoutYear =

    raw.match(

      /^(\d{1,2})\s+de\s+([a-záéíóúñ]+)$/i,

    )

  if (spanishWithoutYear) {

    const month =

      monthMap[

        normalizeText(

          spanishWithoutYear[2],

        )

      ]

    if (

      month !== undefined

    ) {

      return new Date(

        new Date().getFullYear(),

        month,

        Number(

          spanishWithoutYear[1],

        ),

      )

    }

  }



  

  const parsed =

    new Date(raw)

  return Number.isNaN(

    parsed.getTime(),

  )

    ? null

    : parsed

}

const events = computed(() => {

  const lessonEvents = lessons.value

    .map(lesson => {

      const date = parseDateValue(lesson.date)

      if (!date) return null

      return {

        id: `lesson-${lesson.id}`,

        type: 'lesson',

        typeLabel: 'CLASE',

        date,

        title: lesson.title || 'Clase del programa',

        shortTitle: lesson.title?.replace(/^Clase\s+[IVXLCDM0-9]+\s*[-·:]?\s*/i, '') || 'Clase',

        meta: [lesson.time, lesson.modality, lesson.location].filter(Boolean).join(' · '),

        to: `/aula/clase/${lesson.id}`,

      }

    })

    .filter(Boolean)

  const assignmentEvents = assignments.value

    .map(assignment => {

      const date = parseDateValue(assignment.dueDate)

      if (!date) return null

      return {

        id: `assignment-${assignment.id}`,

        type: 'assignment',

        typeLabel: 'ENTREGA',

        date,

        title: assignment.title || 'Tarea del curso',

        shortTitle: assignment.title || 'Tarea',

        meta: `${assignment.points ?? 100} pts · Fecha límite`,

        to: `/aula/clase/${assignment.lessonId}/tarea/${assignment.id}`,

      }

    })

    .filter(Boolean)

  return [...lessonEvents, ...assignmentEvents].sort((a, b) => a.date - b.date)

})

const filteredEvents = computed(() =>

  activeFilter.value === 'all'

    ? events.value

    : events.value.filter(event => event.type === activeFilter.value)

)

const calendarCells = computed(() => {

  const year = visibleMonth.value.getFullYear()

  const month = visibleMonth.value.getMonth()

  const first = new Date(year, month, 1)

  const mondayOffset = (first.getDay() + 6) % 7

  const start = new Date(year, month, 1 - mondayOffset)

  const todayKey = dateKey(new Date())

  return Array.from({ length: 42 }, (_, index) => {

    const date = new Date(start)

    date.setDate(start.getDate() + index)

    const key = dateKey(date)

    return {

      key,

      date,

      day: date.getDate(),

      isCurrentMonth: date.getMonth() === month,

      isToday: key === todayKey,

      events: filteredEvents.value.filter(event => dateKey(event.date) === key),

    }

  })

})

const selectedEvents = computed(() =>

  filteredEvents.value.filter(event => dateKey(event.date) === selectedDateKey.value)

)

const upcomingEvents = computed(() => {

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  return filteredEvents.value.filter(event => event.date >= today)

})

const lessonEventCount = computed(() =>
  events.value.filter(event => event.type === 'lesson').length
)

const assignmentEventCount = computed(() =>
  events.value.filter(event => event.type === 'assignment').length
)

const nextAcademicEvent = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return events.value.find(event => event.date >= today) || null
})

const nextEventDay = computed(() =>
  nextAcademicEvent.value
    ? `${formatDay(nextAcademicEvent.value.date)} ${formatMonthShort(nextAcademicEvent.value.date)}`
    : '—'
)

const nextEventLabel = computed(() =>
  nextAcademicEvent.value?.title || 'Sin próximas fechas'
)

const visibleMonthEventCount = computed(() => {
  const year = visibleMonth.value.getFullYear()
  const month = visibleMonth.value.getMonth()
  return events.value.filter(event =>
    event.date.getFullYear() === year &&
    event.date.getMonth() === month
  ).length
})

const monthTitle = computed(() => {

  const date = visibleMonth.value

  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`

})

const selectedDateLabel = computed(() => {

  const parsed = parseDateValue(selectedDateKey.value)

  if (!parsed) return 'Selecciona un día'

  return new Intl.DateTimeFormat('es-CL', {

    weekday: 'long',

    day: 'numeric',

    month: 'long',

  }).format(parsed)

})

const todayDay = computed(() => new Date().getDate())

const todayMonth = computed(() =>

  new Intl.DateTimeFormat('es-CL', { month: 'short' })

    .format(new Date())

    .replace('.', '')

    .toUpperCase()

)

function formatDay(date) {

  return String(date.getDate()).padStart(2, '0')

}

function formatMonthShort(date) {

  return new Intl.DateTimeFormat('es-CL', { month: 'short' })

    .format(date)

    .replace('.', '')

    .toUpperCase()

}

function changeMonth(offset) {

  const date = new Date(visibleMonth.value)

  date.setMonth(date.getMonth() + offset)

  visibleMonth.value = startOfMonth(date)

  selectedDateKey.value = dateKey(visibleMonth.value)

}

function goToday() {

  const today = new Date()

  visibleMonth.value = startOfMonth(today)

  selectedDateKey.value = dateKey(today)

}

async function loadCalendar() {

  isLoading.value = true

  errorMessage.value = ''

  try {

    const [lessonData, assignmentData] = await Promise.all([

      fetchLessons(),

      fetchAssignments(),

    ])

    lessons.value = lessonData || []

    assignments.value = assignmentData || []

    const today = new Date()

    visibleMonth.value = startOfMonth(today)

    selectedDateKey.value = dateKey(today)

  } catch (error) {

    console.error('Error cargando calendario:', error)

    errorMessage.value =

      'No fue posible consultar las clases y tareas del curso.'

  } finally {

    isLoading.value = false

  }

}

onMounted(loadCalendar)

</script>

<style scoped lang="scss">

.calendar-page {

  --ink:#152033;

  --muted:#6f7c8f;

  --line:#dbe3ec;

  --wine:#9f1945;

  --gold:#d9a91d;

  --green:#2d8a63;

  display:grid;

  gap:18px;

  color:var(--ink);

}

.calendar-hero {

  display:flex;

  justify-content:space-between;

  gap:30px;

  align-items:end;

  padding:30px 32px;

  border:1px solid var(--line);

  border-radius:22px;

  background:

    radial-gradient(circle at 91% 5%,rgba(217,169,29,.13),transparent 31%),

    linear-gradient(135deg,#fff 0%,#fbfcfe 65%,#fffaf0 100%);

  box-shadow:0 14px 35px rgba(31,48,73,.05);

}

.eyebrow {

  color:#a87900;

  font-size:.65rem;

  font-weight:900;

  letter-spacing:.15em;

}

.calendar-hero h1 {

  margin:8px 0 8px;

  font-size:clamp(2.5rem,5vw,4.2rem);

  line-height:1;

  letter-spacing:-.05em;

}

.calendar-hero p {

  max-width:650px;

  margin:0;

  color:var(--muted);

  line-height:1.6;

}

.hero-date {

  width:104px;

  height:104px;

  display:grid;

  place-items:center;

  align-content:center;

  border:1px solid #ead17d;

  border-radius:20px;

  background:#fffaf0;

}

.hero-date span,.hero-date small {

  color:#9c750d;

  font-size:.58rem;

  font-weight:900;

  letter-spacing:.12em;

}

.hero-date strong {

  color:var(--ink);

  font-size:2rem;

  line-height:1.1;

}

.calendar-toolbar {

  display:grid;

  grid-template-columns:auto 1fr auto;

  gap:16px;

  align-items:center;

  padding:12px;

  border:1px solid var(--line);

  border-radius:15px;

  background:#fff;

}

.month-nav {

  display:flex;

  gap:10px;

  align-items:center;

}

.month-nav button,.today-button {

  height:40px;

  min-width:40px;

  border:1px solid #ccd6e1;

  border-radius:10px;

  color:#536276;

  background:#fff;

  font-weight:800;

  cursor:pointer;

}

.month-nav div {

  min-width:150px;

}

.month-nav strong {

  display:block;

  text-transform:capitalize;

}

.month-nav span {

  display:block;

  margin-top:2px;

  color:#8a97a9;

  font-size:.62rem;

}

.filters {

  display:flex;

  gap:7px;

  justify-content:center;

  flex-wrap:wrap;

}

.filters button {

  display:flex;

  align-items:center;

  gap:7px;

  padding:9px 12px;

  border:1px solid transparent;

  border-radius:9px;

  color:#68778a;

  background:#f7f9fc;

  font-size:.7rem;

  font-weight:750;

  cursor:pointer;

}

.filters button.active {

  border-color:#d7e0e8;

  color:#344359;

  background:#fff;

  box-shadow:0 4px 12px rgba(31,48,73,.05);

}

.dot {

  width:7px;

  height:7px;

  border-radius:50%;

  background:#8996a7;

}

.dot--lesson{background:var(--gold)}

.dot--assignment{background:var(--wine)}

.dot--all{background:#607086}

.calendar-layout {

  display:grid;

  grid-template-columns:minmax(0,1.65fr) minmax(300px,.62fr);

  gap:18px;

}

.month-card,.agenda-card {

  border:1px solid var(--line);

  border-radius:18px;

  background:#fff;

  box-shadow:0 8px 24px rgba(31,48,73,.035);

  overflow:hidden;

}

.weekdays {

  display:grid;

  grid-template-columns:repeat(7,1fr);

  border-bottom:1px solid #e7ecf1;

  background:#f8fafc;

}

.weekdays span {

  padding:11px;

  color:#8a97a9;

  font-size:.58rem;

  font-weight:850;

  text-align:center;

}

.month-grid {

  display:grid;

  grid-template-columns:repeat(7,1fr);

}

.day-cell {

  min-height:118px;

  padding:10px;

  border:0;

  border-right:1px solid #edf1f4;

  border-bottom:1px solid #edf1f4;

  color:var(--ink);

  background:#fff;

  text-align:left;

  cursor:pointer;

}

.day-cell:nth-child(7n) { border-right:0; }

.day-cell.is-outside { background:#fafbfd; color:#b0bac6; }

.day-cell.is-selected { box-shadow:inset 0 0 0 2px rgba(159,25,69,.22); }

.day-cell.is-today .day-number {

  color:#fff;

  background:var(--wine);

}

.day-number {

  width:28px;

  height:28px;

  display:grid;

  place-items:center;

  border-radius:9px;

  font-size:.72rem;

  font-weight:800;

}

.day-events {

  display:grid;

  gap:5px;

  margin-top:7px;

}

.event-chip {

  overflow:hidden;

  padding:5px 6px;

  border-radius:6px;

  font-size:.56rem;

  font-weight:750;

  white-space:nowrap;

  text-overflow:ellipsis;

}

.event-chip--lesson {

  color:#80600b;

  background:#fff5d7;

}

.event-chip--assignment {

  color:#8d2444;

  background:#fff0f4;

}

.day-events small {

  color:#8b97a7;

  font-size:.53rem;

}

.agenda-card {

  padding:20px;

}

.agenda-card>header {

  display:flex;

  justify-content:space-between;

  gap:14px;

  align-items:flex-start;

  padding-bottom:16px;

  border-bottom:1px solid #e8edf2;

}

.agenda-card h2 {

  margin:4px 0 0;

  text-transform:capitalize;

  font-size:1.12rem;

}

.agenda-count {

  min-width:34px;

  height:34px;

  display:grid;

  place-items:center;

  border-radius:10px;

  color:#7c5d08;

  background:#fff6db;

  font-size:.74rem;

  font-weight:850;

}

.agenda-list {

  display:grid;

}

.agenda-item {

  display:grid;

  grid-template-columns:auto minmax(0,1fr) auto;

  gap:11px;

  align-items:start;

  padding:15px 0;

  border-bottom:1px solid #edf1f4;

}

.agenda-marker {

  width:9px;

  height:9px;

  margin-top:5px;

  border-radius:50%;

}

.agenda-marker--lesson{background:var(--gold)}

.agenda-marker--assignment{background:var(--wine)}

.agenda-item small {

  color:#9b770e;

  font-size:.54rem;

  font-weight:850;

}

.agenda-item strong {

  display:block;

  margin-top:3px;

  font-size:.76rem;

}

.agenda-item p {

  margin:4px 0 0;

  color:#7d8999;

  font-size:.63rem;

  line-height:1.45;

}

.agenda-item a {

  color:var(--wine);

  font-size:.62rem;

  font-weight:800;

  text-decoration:none;

}

.agenda-empty {

  min-height:190px;

  display:grid;

  place-items:center;

  align-content:center;

  text-align:center;

}

.agenda-empty div {

  width:44px;

  height:44px;

  display:grid;

  place-items:center;

  border-radius:13px;

  color:var(--green);

  background:#edf8f3;

  font-weight:900;

}

.agenda-empty strong {

  margin-top:10px;

}

.agenda-empty p {

  max-width:230px;

  margin:5px 0 0;

  color:#8a97a9;

  font-size:.67rem;

  line-height:1.5;

}

.upcoming {

  margin-top:20px;

  padding-top:18px;

  border-top:1px solid #e8edf2;

}

.upcoming>header span {

  color:#a87900;

  font-size:.56rem;

  font-weight:900;

  letter-spacing:.12em;

}

.upcoming>header strong {

  display:block;

  margin-top:3px;

  font-size:.83rem;

}

.upcoming article {

  display:grid;

  grid-template-columns:42px 1fr;

  gap:10px;

  align-items:center;

  padding:10px 0;

}

.upcoming-date {

  height:42px;

  display:grid;

  place-items:center;

  align-content:center;

  border-radius:10px;

  background:#f5f7fa;

}

.upcoming-date strong {

  font-size:.8rem;

}

.upcoming-date span {

  color:#9c760d;

  font-size:.48rem;

  font-weight:850;

}

.upcoming article small {

  color:#8e9baa;

  font-size:.52rem;

}

.upcoming article>div:last-child>strong {

  display:block;

  margin-top:2px;

  font-size:.68rem;

}

.state-card {

  min-height:220px;

  display:grid;

  gap:10px;

  place-items:center;

  align-content:center;

  border:1px solid var(--line);

  border-radius:18px;

  background:#fff;

  color:#536276;

}

.loader {

  width:28px;

  height:28px;

  border:3px solid #e1e7ed;

  border-top-color:var(--wine);

  border-radius:50%;

  animation:spin .8s linear infinite;

}

.state-card--error p {

  margin:0;

  color:#8794a4;

}

.state-card--error button {

  padding:8px 12px;

  border:1px solid #ccd6e1;

  border-radius:9px;

  color:var(--wine);

  background:#fff;

}

.empty-inline {

  color:#8a97a9;

  font-size:.66rem;

}

@keyframes spin { to { transform:rotate(360deg) } }

@media (max-width: 1050px) {

  .calendar-layout { grid-template-columns:1fr; }

  .agenda-card { display:grid; grid-template-columns:1fr 1fr; gap:20px; }

  .agenda-card>header { grid-column:1/-1; }

  .upcoming { margin:0; padding:0 0 0 20px; border-top:0; border-left:1px solid #e8edf2; }

}

@media (max-width: 760px) {

  .calendar-hero { align-items:flex-start; flex-direction:column; padding:24px; }

  .hero-date { width:86px; height:86px; }

  .calendar-toolbar { grid-template-columns:1fr auto; }

  .filters { grid-column:1/-1; justify-content:flex-start; }

  .weekdays span { font-size:.5rem; padding:9px 3px; }

  .day-cell { min-height:84px; padding:6px; }

  .event-chip { font-size:0; width:7px; height:7px; padding:0; border-radius:50%; }

  .day-events { display:flex; gap:3px; }

  .agenda-card { display:block; }

  .upcoming { margin-top:20px; padding:18px 0 0; border-left:0; border-top:1px solid #e8edf2; }

}





.calendar-page {

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

.calendar-page :where(a, button, input, textarea, select, [role="button"]) {

  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;

}

.calendar-page :where(a, button, input, textarea, select, [role="button"]):focus-visible {

  outline: 3px solid rgba(159, 25, 69, .22) !important;

  outline-offset: 3px;

}

.calendar-page :where(button, [role="button"], .button, .btn):not(:disabled):active {

  transform: translateY(1px) scale(.99);

}

.calendar-page :where(input, textarea, select) {

  font-size: max(16px, 1em);

}

.calendar-page :where(table tbody tr) {

  transition: background-color .18s ease;

}

.calendar-page :where(table tbody tr):hover {

  background-color: rgba(159, 25, 69, .025);

}

.calendar-page :where(.card, [class*="-card"], [class*="__card"]) {

  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;

}

.calendar-page :where(.card, [class*="-card"], [class*="__card"]):hover {

  border-color: rgba(159, 25, 69, .16);

}

@media (prefers-reduced-motion: reduce) {

  .calendar-page *, .calendar-page *::before, .calendar-page *::after {

    scroll-behavior: auto !important;

    animation-duration: .01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: .01ms !important;

  }

}





.calendar-page {

  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;

}

.calendar-page :where(

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

  .calendar-page :where(

    article,

    [class$="__card"],

    [class*="-card"],

    [class*="_card"]

  ):hover {

    transform: translateY(-2px);

  }

  .calendar-page :where(

    button,

    .button,

    .btn,

    a[class*="button"],

    a[class*="cta"]

  ):not(:disabled):hover {

    transform: translateY(-2px);

    filter: saturate(1.04);

  }

  .calendar-page :where(img) {

    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;

  }

  .calendar-page :where(

    [class*="cover"],

    [class*="hero"],

    [class*="visual"],

    [class*="gallery"]

  ):hover img {

    transform: scale(1.018);

  }

}

.calendar-page :where(

  button,

  .button,

  .btn,

  a[class*="button"],

  a[class*="cta"]

) {

  will-change: transform;

}

.calendar-page :where(input, textarea, select):focus {

  transform: translateY(-1px);

}

.calendar-page :where(

  [class*="progress"] > *,

  [class*="bar"] > *,

  progress

) {

  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;

}

.calendar-page ::selection {

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

  .calendar-page,

  .calendar-page *,

  .calendar-page *::before,

  .calendar-page *::after {

    animation-duration: .01ms !important;

    animation-iteration-count: 1 !important;

    transition-duration: .01ms !important;

    scroll-behavior: auto !important;

  }

}



/* =========================================================
   AMV · CALENDAR v11.0 · AGENDA ACADÉMICA PRO
========================================================= */
.calendar-page{gap:22px!important}
.calendar-hero{
  position:relative;overflow:hidden;min-height:220px;align-items:center!important;
  padding:34px 38px!important;border-radius:26px!important;
  background:radial-gradient(circle at 88% 15%,rgba(217,169,29,.20),transparent 25%),
             radial-gradient(circle at 72% 115%,rgba(159,25,69,.12),transparent 35%),
             linear-gradient(135deg,#fff 0%,#fbfcfe 62%,#fff8e7 100%)!important;
  box-shadow:0 18px 46px rgba(23,32,51,.07)!important
}
.calendar-hero::after{
  content:'';position:absolute;right:-70px;top:-95px;width:310px;height:310px;
  border:1px solid rgba(217,169,29,.18);border-radius:50%;
  box-shadow:0 0 0 38px rgba(217,169,29,.035),0 0 0 78px rgba(159,25,69,.025);
  pointer-events:none
}
.calendar-hero>*{position:relative;z-index:1}
.calendar-hero h1{color:#172033!important;font-size:clamp(3rem,5.4vw,4.8rem)!important;font-weight:950}
.hero-date{
  width:112px!important;height:112px!important;border-color:rgba(217,169,29,.52)!important;
  background:linear-gradient(145deg,#9f1945,#771033)!important;
  box-shadow:0 16px 34px rgba(111,17,53,.20)
}
.hero-date span,.hero-date small{color:#ffe17d!important}
.hero-date strong{color:#fff!important;font-size:2.2rem!important}

.calendar-overview{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
.calendar-overview article{
  min-width:0;padding:18px 20px;border:1px solid var(--line);border-radius:17px;
  background:#fff;box-shadow:0 8px 24px rgba(31,48,73,.035)
}
.calendar-overview article span{display:block;color:#8b6b0d;font-size:.61rem;font-weight:950;letter-spacing:.10em}
.calendar-overview article strong{
  display:block;overflow:hidden;margin-top:6px;color:#172033;font-size:1.45rem;
  font-weight:950;white-space:nowrap;text-overflow:ellipsis
}
.calendar-overview article small{
  display:block;overflow:hidden;margin-top:3px;color:#7a8798;font-size:.66rem;
  white-space:nowrap;text-overflow:ellipsis
}
.calendar-overview__accent{
  border-color:rgba(159,25,69,.18)!important;
  background:radial-gradient(circle at 100% 0,rgba(217,169,29,.12),transparent 38%),
             linear-gradient(145deg,#fff,#fff8fb)!important
}
.calendar-overview__accent strong{color:#9f1945!important}

.calendar-toolbar{padding:14px!important;border-radius:18px!important;box-shadow:0 8px 24px rgba(31,48,73,.035)}
.month-nav button,.today-button{border-color:#d9e0e8!important;background:#fff!important}
.month-nav button:hover,.today-button:hover{
  border-color:rgba(159,25,69,.28)!important;color:#9f1945!important;background:#fff8fb!important
}
.filters button.active{
  border-color:rgba(159,25,69,.20)!important;color:#8b153d!important;
  background:#fff7fa!important;box-shadow:0 5px 14px rgba(159,25,69,.07)!important
}
.month-card,.agenda-card{border-radius:22px!important;box-shadow:0 12px 34px rgba(31,48,73,.05)!important}
.weekdays{background:linear-gradient(180deg,#fafbfd,#f6f8fb)!important}
.day-cell{transition:background-color .18s ease,box-shadow .18s ease,transform .18s ease!important}
.day-cell:hover{position:relative;z-index:1;background:#fffafc!important;box-shadow:inset 0 0 0 1px rgba(159,25,69,.12)}
.day-cell.is-selected{background:#fff9fb!important;box-shadow:inset 0 0 0 2px rgba(159,25,69,.32)!important}
.day-cell.is-today .day-number{box-shadow:0 5px 13px rgba(159,25,69,.20)}
.event-chip--lesson{border-left:3px solid #d9a91d;color:#725506!important;background:#fff7dd!important}
.event-chip--assignment{border-left:3px solid #9f1945;color:#8d2444!important;background:#fff0f4!important}
.agenda-card{background:linear-gradient(180deg,#fff 0%,#fff 72%,#fffcf5 100%)!important}
.agenda-count{color:#fff!important;background:linear-gradient(145deg,#9f1945,#7f1237)!important}
.agenda-item{border-radius:12px;padding:15px 9px!important;transition:background-color .18s ease,transform .18s ease}
.agenda-item:hover{background:#fafbfd}
.agenda-item a{padding:7px 9px;border-radius:8px;background:#fff3f7}
.upcoming-link{
  display:grid;grid-template-columns:42px minmax(0,1fr);gap:10px;align-items:center;
  padding:10px 0;color:inherit;text-decoration:none;border-radius:11px
}
.upcoming-link:hover{padding-left:7px;padding-right:7px;background:#fafbfd}
.upcoming-link .upcoming-date{border:1px solid rgba(217,169,29,.24);background:#fff8e7!important}

@media(max-width:900px){.calendar-overview{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:620px){
  .calendar-hero{min-height:0;padding:25px 20px!important}
  .calendar-hero h1{font-size:2.7rem!important}
  .calendar-overview{grid-template-columns:1fr 1fr;gap:8px}
  .calendar-overview article{padding:15px}
  .calendar-overview article strong{font-size:1.18rem}
  .calendar-layout{gap:13px!important}
}

</style>