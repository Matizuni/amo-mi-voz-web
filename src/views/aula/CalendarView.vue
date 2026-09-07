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

            <article v-for="event in upcomingEvents.slice(0, 5)" :key="`up-${event.id}`">
              <div class="upcoming-date">
                <strong>{{ formatDay(event.date) }}</strong>
                <span>{{ formatMonthShort(event.date) }}</span>
              </div>
              <div>
                <small>{{ event.typeLabel }}</small>
                <strong>{{ event.title }}</strong>
              </div>
            </article>

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
  if (!value) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value

  const raw = String(value).trim()

  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (iso) {
    return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  }

  const cl = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/)
  if (cl) {
    return new Date(Number(cl[3]), Number(cl[2]) - 1, Number(cl[1]))
  }

  const spanish = raw.match(
    /^(\d{1,2})\s+de\s+([a-záéíóúñ]+)\s+de\s+(\d{4})/i
  )

  if (spanish) {
    const map = {
      enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
      julio: 6, agosto: 7, septiembre: 8, setiembre: 8,
      octubre: 9, noviembre: 10, diciembre: 11,
    }
    const month = map[normalizeText(spanish[2])]
    if (month !== undefined) {
      return new Date(Number(spanish[3]), month, Number(spanish[1]))
    }
  }

  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed
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
</style>
