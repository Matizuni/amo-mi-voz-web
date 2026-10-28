<template>
  <section class="calendar-page calendar-page--compact">
    <section v-if="isLoading" class="state-card" role="status" aria-live="polite">
      <span class="loader"></span>
      <strong>Organizando tu calendario…</strong>
    </section>

    <section v-else-if="errorMessage" class="state-card state-card--error" role="alert">
      <strong>No pudimos cargar el calendario</strong>
      <p>{{ errorMessage }}</p>
      <button type="button" @click="loadCalendar">Reintentar</button>
    </section>

    <template v-else>
      <header class="calendar-toolbar calendar-toolbar--compact">
        <div class="calendar-toolbar__top">
          <div class="month-nav" aria-label="Navegación mensual">
            <button type="button" aria-label="Mes anterior" @click="changeMonth(-1)">←</button>
            <div class="month-nav__label">
              <strong>{{ monthTitle }}</strong>
              <span>{{ filteredEvents.length }} {{ filteredEvents.length === 1 ? 'evento visible' : 'eventos visibles' }}</span>
            </div>
            <button type="button" aria-label="Mes siguiente" @click="changeMonth(1)">→</button>
          </div>

          <div class="calendar-toolbar__actions">
            <button class="today-button" type="button" @click="goToday">Hoy</button>
            <button
              v-if="isTeacher"
              type="button"
              class="primary-action primary-action--compact"
              @click="openCreateEvent(selectedDateKey)"
            >
              <span aria-hidden="true">＋</span> Nuevo evento
            </button>
          </div>
        </div>

        <div class="filters" aria-label="Filtrar calendario por tipo">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            :class="{ active: activeFilter === filter.value }"
            :aria-pressed="activeFilter === filter.value"
            @click="activeFilter = filter.value"
          >
            <span class="filter-dot" :class="`filter-dot--${filter.value}`"></span>
            {{ filter.label }}
          </button>
        </div>
      </header>

      <section class="month-card calendar-month-card" aria-label="Calendario mensual">
        <div class="weekdays">
          <span v-for="day in weekdayLabels" :key="day">{{ day }}</span>
        </div>

        <div class="month-grid">
          <div
            v-for="cell in calendarCells"
            :key="cell.key"
            class="day-cell"
            :class="{
              'is-outside': !cell.isCurrentMonth,
              'is-today': cell.isToday,
              'is-selected': selectedDateKey === cell.key,
              'has-events': cell.events.length,
            }"
            role="group"
            :aria-label="`Día ${cell.day}${cell.events.length ? `, ${cell.events.length} actividades` : ''}`"
          >
            <button
              type="button"
              class="day-cell__select"
              :aria-label="`Seleccionar día ${cell.day}`"
              :aria-pressed="selectedDateKey === cell.key"
              @click="selectCalendarDate(cell.key)"
            >
              <span class="day-number">{{ cell.day }}</span>
            </button>

            <div v-if="cell.events.length" class="day-events">
              <template v-for="event in cell.events.slice(0, 2)" :key="event.id">
                <RouterLink
                  v-if="event.to"
                  :to="event.to"
                  class="event-chip"
                  :class="`event-chip--${event.type}`"
                  :title="event.title"
                  @click.stop
                >
                  <span class="event-chip__dot"></span>
                  <span class="event-chip__label">{{ event.shortTitle }}</span>
                </RouterLink>
                <button
                  v-else
                  type="button"
                  class="event-chip"
                  :class="`event-chip--${event.type}`"
                  :title="event.title"
                  @click.stop="selectEventDate(event)"
                >
                  <span class="event-chip__dot"></span>
                  <span class="event-chip__label">{{ event.shortTitle }}</span>
                </button>
              </template>
              <button
                v-if="cell.events.length > 2"
                type="button"
                class="day-more"
                :aria-label="`Ver las ${cell.events.length} actividades del día ${cell.day}`"
                @click.stop="selectCalendarDate(cell.key, true)"
              >
                +{{ cell.events.length - 2 }} más
              </button>
            </div>
          </div>
        </div>
      </section>

      <aside ref="agendaCardRef" class="agenda-card calendar-agenda" aria-label="Agenda del día y próximos eventos">
        <header class="agenda-card__header">
          <div>
            <span class="eyebrow">AGENDA DEL DÍA</span>
            <h2>{{ selectedDateLabel }}</h2>
          </div>
          <span class="agenda-count" :aria-label="`${selectedEvents.length} actividades`">{{ selectedEvents.length }}</span>
        </header>

        <div v-if="selectedEvents.length" class="agenda-list">
          <article
            v-for="event in selectedEvents"
            :key="event.id"
            class="agenda-item"
            :class="`agenda-item--${event.type}`"
          >
            <div class="agenda-marker"></div>
            <div class="agenda-copy">
              <div class="agenda-topline">
                <small>{{ event.typeLabel }}</small>
                <span v-if="event.source === 'manual'" class="source-badge">EVENTO</span>
              </div>
              <strong>{{ event.title }}</strong>
              <p v-if="event.meta">{{ event.meta }}</p>
              <p v-if="event.location" class="agenda-location">⌖ {{ event.location }}</p>
            </div>

            <div class="agenda-actions">
              <RouterLink v-if="event.to" :to="event.to">Abrir →</RouterLink>
              <template v-else-if="isTeacher && event.source === 'manual'">
                <button type="button" @click="openEditEvent(event.raw)">Editar</button>
                <button type="button" class="danger-link" @click="confirmDelete(event.raw)">Eliminar</button>
              </template>
            </div>
          </article>
        </div>

        <div v-else class="agenda-empty">
          <div>✓</div>
          <strong>Sin actividades</strong>
          <p>No hay fechas programadas para este día.</p>
          <button v-if="isTeacher" type="button" @click="openCreateEvent(selectedDateKey)">＋ Agregar evento</button>
        </div>

        <section class="upcoming">
          <header>
            <span>PRÓXIMAMENTE</span>
            <strong>Próximos eventos</strong>
          </header>

          <template v-for="event in upcomingEvents.slice(0, 6)" :key="`up-${event.id}`">
            <RouterLink
              v-if="event.to"
              :to="event.to"
              class="upcoming-event"
              :class="`upcoming-event--${event.type}`"
            >
              <span class="upcoming-date" :class="`upcoming-date--${event.type}`">
                <strong>{{ formatDay(event.date) }}</strong>
                <small>{{ formatMonthShort(event.date) }}</small>
              </span>
              <span class="upcoming-event__copy">
                <small>{{ event.typeLabel }}</small>
                <strong>{{ event.title }}</strong>
              </span>
              <span class="upcoming-event__arrow" aria-hidden="true">→</span>
            </RouterLink>
            <button
              v-else
              type="button"
              class="upcoming-event"
              :class="`upcoming-event--${event.type}`"
              @click="selectEventDate(event)"
            >
              <span class="upcoming-date" :class="`upcoming-date--${event.type}`">
                <strong>{{ formatDay(event.date) }}</strong>
                <small>{{ formatMonthShort(event.date) }}</small>
              </span>
              <span class="upcoming-event__copy">
                <small>{{ event.typeLabel }}</small>
                <strong>{{ event.title }}</strong>
              </span>
              <span class="upcoming-event__arrow" aria-hidden="true">→</span>
            </button>
          </template>
          <p v-if="!upcomingEvents.length" class="empty-inline">No hay próximas fechas registradas.</p>
        </section>
      </aside>
    </template>
    <Transition name="modal-fade">
      <div v-if="isEventModalOpen" class="modal-backdrop" @click.self="closeEventModal">
        <section class="event-modal" role="dialog" aria-modal="true" aria-labelledby="calendar-event-title">
          <header class="event-modal__header">
            <div>
              <span class="eyebrow">GESTIÓN DEL CALENDARIO</span>
              <h2 id="calendar-event-title">{{ editingEvent ? 'Editar evento' : 'Nuevo evento' }}</h2>
              <p>Publica una fecha especial para todo el curso o solo para estudiantes.</p>
            </div>
            <button type="button" class="modal-close" aria-label="Cerrar" @click="closeEventModal">×</button>
          </header>

          <div class="event-type-grid">
            <button
              v-for="preset in eventPresets"
              :key="preset.value"
              type="button"
              class="event-type-option"
              :class="[
                `event-type-option--${preset.value}`,
                { active: form.eventType === preset.value },
              ]"
              @click="form.eventType = preset.value"
            >
              <span>{{ preset.glyph }}</span>
              <div>
                <strong>{{ preset.label }}</strong>
                <small>{{ preset.description }}</small>
              </div>
            </button>
          </div>

          <form class="event-form" @submit.prevent="saveEvent">
            <label>
              <span>Título</span>
              <input v-model="form.title" type="text" maxlength="120" placeholder="Ej.: Audición de repertorio" required />
            </label>

            <div class="form-grid form-grid--2">
              <label>
                <span>{{ form.allDay ? 'Fecha' : 'Inicio' }}</span>
                <input v-model="form.startsAt" :type="form.allDay ? 'date' : 'datetime-local'" required />
              </label>
              <label>
                <span>{{ form.allDay ? 'Fecha final' : 'Fin' }}</span>
                <input v-model="form.endsAt" :type="form.allDay ? 'date' : 'datetime-local'" />
              </label>
            </div>

            <label class="toggle-field">
              <input v-model="form.allDay" type="checkbox" />
              <span class="toggle-ui"></span>
              <div>
                <strong>Todo el día</strong>
                <small>Ideal para audiciones, feriados o anuncios.</small>
              </div>
            </label>

            <div class="form-grid form-grid--2">
              <label>
                <span>Lugar</span>
                <input v-model="form.location" type="text" maxlength="180" placeholder="Ej.: Pueblito Artesanal La Calera" />
              </label>
              <label>
                <span>Visible para</span>
                <select v-model="form.scope">
                  <option value="all">Todo el curso</option>
                  <option value="students">Solo estudiantes</option>
                  <option value="teachers">Solo profesores</option>
                </select>
              </label>
            </div>

            <label>
              <span>Descripción</span>
              <textarea v-model="form.description" rows="4" maxlength="1000" placeholder="Detalles, instrucciones o recordatorios."></textarea>
            </label>

            <p v-if="modalError" class="modal-error">{{ modalError }}</p>

            <footer class="event-modal__footer">
              <button type="button" class="ghost-action" @click="closeEventModal">Cancelar</button>
              <button type="submit" class="primary-action" :disabled="isSavingEvent">
                {{ isSavingEvent ? 'Guardando…' : editingEvent ? 'Guardar cambios' : 'Publicar evento' }}
              </button>
            </footer>
          </form>
        </section>
      </div>
    </Transition>

    <Transition name="modal-fade">
      <div v-if="eventToDelete" class="modal-backdrop" @click.self="eventToDelete = null">
        <section class="confirm-modal" role="dialog" aria-modal="true">
          <span class="confirm-icon">!</span>
          <h2>Eliminar evento</h2>
          <p>¿Seguro que quieres eliminar <strong>{{ eventToDelete.title }}</strong>? Esta acción no se puede deshacer.</p>
          <div class="confirm-actions">
            <button type="button" class="ghost-action" @click="eventToDelete = null">Cancelar</button>
            <button type="button" class="danger-action" :disabled="isDeletingEvent" @click="deleteEvent">{{ isDeletingEvent ? 'Eliminando…' : 'Eliminar evento' }}</button>
          </div>
        </section>
      </div>
    </Transition>

    <Transition name="toast">
      <div v-if="toastMessage" class="calendar-toast" :class="{ 'calendar-toast--error': toastType === 'error' }">
        <span>{{ toastType === 'error' ? '!' : '✓' }}</span>
        <div>
          <strong>{{ toastType === 'error' ? 'No pudimos actualizar' : 'Calendario actualizado' }}</strong>
          <small>{{ toastMessage }}</small>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted, nextTick } from 'vue'
import { RouterLink } from 'vue-router'
import { fetchLessons } from '@/services/lessonService'
import { fetchAssignments } from '@/services/assignmentService'
import { fetchQuizzes } from '@/services/quizService'
import {
  fetchCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} from '@/services/calendarEventService'
import { useAuth } from '@/composables/useAuth'

const { isTeacher } = useAuth()

// El destino cambia según el rol: los profesores revisan intentos;
// los estudiantes ingresan a rendir la evaluación.
const isTeacherAccount = computed(() => Boolean(isTeacher?.value ?? isTeacher))

// Destino único para el profesor: listado de intentos y seguimiento.
const getQuizDestination = quiz => {
  const base = `/aula/clase/${quiz.lessonId}/evaluacion/${quiz.id}`
  return isTeacherAccount.value ? `${base}/intentos` : base
}

const isLoading = ref(true)
const errorMessage = ref('')
const lessons = ref([])
const assignments = ref([])
const quizzes = ref([])
const manualEvents = ref([])
const activeFilter = ref('all')
const selectedDateKey = ref('')
const agendaCardRef = ref(null)
const visibleMonth = ref(startOfMonth(new Date()))

const isEventModalOpen = ref(false)
const editingEvent = ref(null)
const eventToDelete = ref(null)
const isSavingEvent = ref(false)
const isDeletingEvent = ref(false)
const modalError = ref('')
const toastMessage = ref('')
const toastType = ref('success')
let toastTimer = null

const form = ref(emptyForm())

const filters = [
  { label: 'Todo', value: 'all' },
  { label: 'Clases', value: 'lesson' },
  { label: 'Tareas', value: 'assignment' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Pruebas', value: 'test' },
  { label: 'Eventos', value: 'manual' },
]

const eventPresets = [
  { value: 'audition', label: 'Audición', glyph: '♪', description: 'Evaluación o muestra vocal' },
  { value: 'rehearsal', label: 'Ensayo', glyph: '♫', description: 'Preparación y práctica' },
  { value: 'concert', label: 'Concierto', glyph: '★', description: 'Presentación o cierre' },
  { value: 'meeting', label: 'Reunión', glyph: '◉', description: 'Coordinación académica' },
  { value: 'announcement', label: 'Anuncio', glyph: '!', description: 'Información importante' },
  { value: 'holiday', label: 'Feriado', glyph: '☼', description: 'Día sin clases' },
  { value: 'other', label: 'Otro', glyph: '＋', description: 'Fecha especial' },
]

const weekdayLabels = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const monthNames = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']

function emptyForm() {
  return {
    title: '',
    eventType: 'audition',
    startsAt: dateToInputValue(new Date(), false),
    endsAt: '',
    allDay: false,
    location: '',
    scope: 'all',
    description: '',
  }
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

function dateKey(date) {
  return [date.getFullYear(), String(date.getMonth()+1).padStart(2,'0'), String(date.getDate()).padStart(2,'0')].join('-')
}

function parseDateValue(value) {
  if (!value) return null
  if (value instanceof Date && !Number.isNaN(value.getTime())) return new Date(value)
  const raw = String(value).trim()
  if (raw.includes('T') && /(?:Z|[+-]\d{2}:?\d{2})$/.test(raw)) {
    const zoned = new Date(raw)
    return Number.isNaN(zoned.getTime()) ? null : zoned
  }
  const iso = raw.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/)
  if (iso) return new Date(Number(iso[1]), Number(iso[2])-1, Number(iso[3]), Number(iso[4] || 0), Number(iso[5] || 0))
  const cl = raw.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/)
  if (cl) return new Date(Number(cl[3]), Number(cl[2])-1, Number(cl[1]))
  const parsed = new Date(raw)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

function normalizeAssessmentType(value) {
  const type = String(value || '').trim().toLowerCase()
  return ['test','prueba','exam','examen'].some(item => type.includes(item)) ? 'test' : 'quiz'
}

function dateToInputValue(date, allDay) {
  const safe = date instanceof Date ? date : parseDateValue(date)
  if (!safe) return ''
  const base = `${safe.getFullYear()}-${String(safe.getMonth()+1).padStart(2,'0')}-${String(safe.getDate()).padStart(2,'0')}`
  if (allDay) return base
  return `${base}T${String(safe.getHours()).padStart(2,'0')}:${String(safe.getMinutes()).padStart(2,'0')}`
}

function localInputToISO(value, allDay = false) {
  if (!value) return null
  if (allDay) {
    const date = parseDateValue(`${value}T00:00`)
    return date ? date.toISOString() : null
  }
  const date = parseDateValue(value)
  return date ? date.toISOString() : null
}

const eventTypeLabel = value => {
  const labels = {
    audition: 'AUDICIÓN',
    rehearsal: 'ENSAYO',
    concert: 'CONCIERTO',
    meeting: 'REUNIÓN',
    announcement: 'ANUNCIO',
    holiday: 'FERIADO',
    other: 'EVENTO',
  }
  return labels[value] || 'EVENTO'
}

const toCalendarEvent = raw => {
  const type = raw?.eventType || raw?.event_type || 'other'
  const date = parseDateValue(raw?.startsAt || raw?.starts_at)
  return {
    id: `manual-${raw.id}`,
    source: 'manual',
    type: 'manual',
    date,
    raw,
    title: raw.title,
    shortTitle: raw.title,
    typeLabel: eventTypeLabel(type),
    location: raw.location || '',
    meta: raw.allDay ? 'Todo el día' : timeRangeLabel(raw.startsAt, raw.endsAt),
    to: null,
  }
}

function timeRangeLabel(start, end) {
  const s = parseDateValue(start)
  const e = parseDateValue(end)
  if (!s) return ''
  const formatter = new Intl.DateTimeFormat('es-CL', { hour:'2-digit', minute:'2-digit' })
  return e ? `${formatter.format(s)} — ${formatter.format(e)}` : formatter.format(s)
}

const lessonEvents = computed(() => lessons.value.map(lesson => {
  const date = parseDateValue(lesson.date)
  if (!date) return null
  return {
    id:`lesson-${lesson.id}`,
    source:'generated',
    type:'lesson',
    date,
    title:lesson.title || 'Clase del programa',
    shortTitle:String(lesson.title || 'Clase').replace(/^Clase\s+[IVXLCDM0-9]+\s*[-·:]?\s*/i,'') || 'Clase',
    typeLabel:'CLASE',
    meta:[lesson.time, lesson.modality].filter(Boolean).join(' · '),
    location:lesson.location || '',
    to:`/aula/clase/${lesson.id}`,
  }
}).filter(Boolean))

const assignmentEvents = computed(() => assignments.value.map(assignment => {
  const date = parseDateValue(assignment.dueDate)
  if (!date || assignment.status === 'draft') return null
  return {
    id:`assignment-${assignment.id}`,
    source:'generated',
    type:'assignment',
    date,
    title:assignment.title || 'Tarea del curso',
    shortTitle:assignment.title || 'Tarea',
    typeLabel:'TAREA',
    meta:`${assignment.points ?? 100} pts · Fecha límite`,
    location:'',
    to:`/aula/clase/${assignment.lessonId}/tarea/${assignment.id}`,
  }
}).filter(Boolean))

const quizEvents = computed(() => quizzes.value.map(quiz => {
  if (quiz.status !== 'published') return null
  const rawDate = quiz.closesAt || quiz.opensAt
  const date = parseDateValue(rawDate)
  if (!date) return null
  const type = normalizeAssessmentType(quiz.assessmentType)
  return {
    id:`${type}-${quiz.id}`,
    source:'generated',
    type,
    date,
    title:quiz.title || (type === 'test' ? 'Prueba de unidad' : 'Quiz formativo'),
    shortTitle:quiz.title || (type === 'test' ? 'Prueba' : 'Quiz'),
    typeLabel:type === 'test' ? 'PRUEBA' : 'QUIZ',
    meta:[quiz.opensAt ? `Abre ${timeRangeLabel(quiz.opensAt)}` : '', quiz.closesAt ? `Cierra ${timeRangeLabel(quiz.closesAt)}` : ''].filter(Boolean).join(' · '),
    location:'',
    to: getQuizDestination(quiz),
  }
}).filter(Boolean))

const events = computed(() => [
  ...lessonEvents.value,
  ...assignmentEvents.value,
  ...quizEvents.value,
  ...manualEvents.value.map(toCalendarEvent),
].filter(event => event.date && !Number.isNaN(event.date.getTime())).sort((a,b) => a.date - b.date))

const filteredEvents = computed(() => activeFilter.value === 'all' ? events.value : events.value.filter(event => event.type === activeFilter.value))

const calendarCells = computed(() => {
  const year = visibleMonth.value.getFullYear()
  const month = visibleMonth.value.getMonth()
  const first = new Date(year, month, 1)
  const mondayOffset = (first.getDay()+6)%7
  const start = new Date(year, month, 1-mondayOffset)
  const todayKey = dateKey(new Date())
  return Array.from({length:42},(_,index)=>{
    const date = new Date(start)
    date.setDate(start.getDate()+index)
    const key = dateKey(date)
    return {
      key,
      date,
      day:date.getDate(),
      isCurrentMonth:date.getMonth()===month,
      isToday:key===todayKey,
      events:filteredEvents.value.filter(event=>dateKey(event.date)===key),
    }
  })
})

const selectedEvents = computed(() => filteredEvents.value.filter(event => dateKey(event.date) === selectedDateKey.value))

const upcomingEvents = computed(() => {
  const today = new Date()
  today.setHours(0,0,0,0)
  return filteredEvents.value.filter(event => event.date >= today)
})

const monthTitle = computed(() => `${monthNames[visibleMonth.value.getMonth()]} ${visibleMonth.value.getFullYear()}`)
const selectedDateLabel = computed(() => {
  const date = parseDateValue(selectedDateKey.value)
  if (!date) return 'Selecciona un día'
  return new Intl.DateTimeFormat('es-CL',{weekday:'long',day:'numeric',month:'long'}).format(date)
})


function formatDay(date) { return String(date.getDate()).padStart(2,'0') }
function formatMonthShort(date) { return new Intl.DateTimeFormat('es-CL',{month:'short'}).format(date).replace('.','').toUpperCase() }

function changeMonth(offset) {
  const date = new Date(visibleMonth.value)
  date.setMonth(date.getMonth()+offset)
  visibleMonth.value = startOfMonth(date)
  selectedDateKey.value = dateKey(visibleMonth.value)
}

function goToday() {
  const today = new Date()
  visibleMonth.value = startOfMonth(today)
  selectedDateKey.value = dateKey(today)
}

function selectCalendarDate(key, scrollToAgenda = false) {
  const date = parseDateValue(key)
  if (!date) return

  visibleMonth.value = startOfMonth(date)
  selectedDateKey.value = dateKey(date)

  if (scrollToAgenda) scrollAgendaIntoView()
}

function selectEventDate(event, shouldScroll = true) {
  if (!event?.date) return
  selectCalendarDate(dateKey(event.date), false)
  if (shouldScroll) scrollAgendaIntoView()
}

function scrollAgendaIntoView() {
  nextTick(() => {
    agendaCardRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

function openCreateEvent(selectedKey = '') {
  editingEvent.value = null
  modalError.value = ''
  form.value = emptyForm()
  if (selectedKey) {
    form.value.startsAt = dateToInputValue(parseDateValue(`${selectedKey}T16:00`), false)
  }
  isEventModalOpen.value = true
}

function openEditEvent(event) {
  editingEvent.value = event
  modalError.value = ''
  const allDay = Boolean(event.allDay)
  form.value = {
    title:event.title || '',
    eventType:event.eventType || 'other',
    startsAt:dateToInputValue(event.startsAt, allDay),
    endsAt:dateToInputValue(event.endsAt, allDay),
    allDay,
    location:event.location || '',
    scope:event.scope || 'all',
    description:event.description || '',
  }
  isEventModalOpen.value = true
}

function closeEventModal() {
  isEventModalOpen.value = false
  editingEvent.value = null
  modalError.value = ''
}

function confirmDelete(event) {
  eventToDelete.value = event
}

async function saveEvent() {
  modalError.value = ''
  if (!form.value.title.trim()) {
    modalError.value = 'Escribe un título para el evento.'
    return
  }
  const startsAt = localInputToISO(form.value.startsAt, form.value.allDay)
  const endsAt = form.value.endsAt ? localInputToISO(form.value.endsAt, form.value.allDay) : null
  if (!startsAt) {
    modalError.value = 'Selecciona una fecha válida.'
    return
  }
  if (endsAt && new Date(endsAt) < new Date(startsAt)) {
    modalError.value = 'La fecha de término no puede ser anterior al inicio.'
    return
  }

  isSavingEvent.value = true
  try {
    const payload = {
      title:form.value.title,
      eventType:form.value.eventType,
      startsAt,
      endsAt,
      allDay:form.value.allDay,
      location:form.value.location,
      scope:form.value.scope,
      description:form.value.description,
    }
    const saved = editingEvent.value
      ? await updateCalendarEvent(editingEvent.value.id, payload)
      : await createCalendarEvent(payload)

    if (editingEvent.value) {
      const index = manualEvents.value.findIndex(item=>Number(item.id)===Number(saved.id))
      if (index>=0) manualEvents.value[index] = saved
      else manualEvents.value.push(saved)
    } else {
      manualEvents.value.push(saved)
    }

    const date = parseDateValue(saved.startsAt)
    if (date) {
      visibleMonth.value = startOfMonth(date)
      selectedDateKey.value = dateKey(date)
    }
    closeEventModal()
    showToast(editingEvent.value ? 'Evento actualizado.' : 'Evento publicado.')
  } catch (error) {
    console.error('Error guardando evento:', error)
    modalError.value = error?.message || 'No fue posible guardar el evento.'
  } finally {
    isSavingEvent.value = false
  }
}

async function deleteEvent() {
  if (!eventToDelete.value?.id) return
  isDeletingEvent.value = true
  try {
    await deleteCalendarEvent(eventToDelete.value.id)
    manualEvents.value = manualEvents.value.filter(item=>Number(item.id)!==Number(eventToDelete.value.id))
    selectedDateKey.value = selectedDateKey.value || dateKey(new Date())
    showToast('Evento eliminado.')
    eventToDelete.value = null
  } catch (error) {
    console.error('Error eliminando evento:', error)
    showToast(error?.message || 'No fue posible eliminar el evento.','error')
  } finally {
    isDeletingEvent.value = false
  }
}

function showToast(message,type='success') {
  clearTimeout(toastTimer)
  toastType.value = type
  toastMessage.value = message
  toastTimer = setTimeout(()=>{ toastMessage.value='' },3500)
}

async function loadCalendar() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    const results = await Promise.all([
      fetchLessons(),
      fetchAssignments(),
      fetchQuizzes(),
      fetchCalendarEvents(),
    ])
    lessons.value = results[0] || []
    assignments.value = results[1] || []
    quizzes.value = results[2] || []
    manualEvents.value = results[3] || []
    goToday()
  } catch (error) {
    console.error('Error cargando calendario:', error)
    errorMessage.value = error?.message || 'No fue posible consultar el calendario.'
  } finally {
    isLoading.value = false
  }
}

function handleKeydown(event) {
  if (event.key === 'Escape') {
    if (isEventModalOpen.value) closeEventModal()
    if (eventToDelete.value) eventToDelete.value = null
  }
}

onMounted(() => {
  loadCalendar()
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  clearTimeout(toastTimer)
})
</script>

<style scoped lang="scss">
.calendar-page {
  --ink:#152033;
  --muted:#748095;
  --line:#dde5ed;
  --soft:#f5f7fa;
  --wine:#a7194b;
  --wine-dark:#7f1039;
  --wine-soft:#fff0f4;
  --gold:#d6a51d;
  --gold-dark:#92700a;
  --gold-soft:#fff6dc;
  --violet:#8062b9;
  --violet-soft:#f2edfb;
  --green:#2c8b63;
  --green-soft:#ebf8f1;
  --slate:#53647b;
  display:grid;
  gap:18px;
  color:var(--ink);
}

button,input,select,textarea { font:inherit; }
button { cursor:pointer; }

.calendar-hero {
  display:flex;
  justify-content:space-between;
  gap:28px;
  align-items:stretch;
  padding:28px;
  border:1px solid var(--line);
  border-radius:24px;
  background:
    radial-gradient(circle at 92% 15%, rgba(167,25,75,.12), transparent 28%),
    radial-gradient(circle at 50% 100%, rgba(214,165,29,.08), transparent 32%),
    linear-gradient(135deg,#ffffff,#fbfcfe 64%,#fffaf2);
  box-shadow:0 18px 44px rgba(28,43,64,.065);
}

.calendar-hero__copy { flex:1; min-width:0; }
.eyebrow { color:#a67807; font-size:.62rem; font-weight:950; letter-spacing:.16em; text-transform:uppercase; }

.hero-title-row { display:flex; justify-content:space-between; align-items:flex-end; gap:22px; margin-top:8px; }
.calendar-hero h1 { margin:0; font-size:clamp(2.3rem,5vw,4rem); line-height:.98; letter-spacing:-.06em; }
.calendar-hero p { max-width:720px; margin:10px 0 0; color:var(--muted); line-height:1.55; }

.hero-date { width:92px; min-width:92px; height:92px; display:grid; place-items:center; align-content:center; border:1px solid rgba(214,165,29,.42); border-radius:20px; background:rgba(255,250,238,.88); box-shadow:0 10px 25px rgba(116,89,20,.08); }
.hero-date span,.hero-date small { color:#a37b12; font-size:.52rem; font-weight:900; letter-spacing:.13em; }
.hero-date strong { font-size:1.9rem; line-height:1; }

.hero-actions { display:flex; flex-direction:column; justify-content:space-between; align-items:flex-end; gap:14px; min-width:290px; }
.hero-stat { min-width:250px; padding:14px 16px; border:1px solid #e6eaf0; border-radius:15px; background:rgba(255,255,255,.78); }
.hero-stat span { display:block; color:#a67807; font-size:.53rem; font-weight:900; letter-spacing:.13em; }
.hero-stat strong { display:block; margin-top:4px; font-size:.82rem; }
.hero-stat small { display:block; margin-top:4px; color:#8b96a7; font-size:.62rem; text-transform:capitalize; }

.primary-action { border:0; border-radius:11px; padding:11px 16px; color:#fff; background:linear-gradient(135deg,var(--wine),var(--wine-dark)); font-size:.7rem; font-weight:850; box-shadow:0 10px 22px rgba(167,25,75,.2); }
.primary-action:hover { transform:translateY(-1px); }
.primary-action:disabled { opacity:.6; transform:none; cursor:not-allowed; }
.ghost-action { border:1px solid #d4dde7; border-radius:10px; padding:10px 14px; color:#5e6d82; background:#fff; font-size:.69rem; font-weight:800; }

.calendar-insight-row { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:12px; }
.insight-card { display:flex; align-items:center; gap:12px; min-width:0; padding:14px; border:1px solid var(--line); border-radius:16px; background:#fff; box-shadow:0 7px 20px rgba(28,43,64,.035); }
.insight-icon { width:42px; height:42px; min-width:42px; display:grid; place-items:center; border-radius:13px; font-size:1rem; font-weight:900; }
.insight-card small { display:block; font-size:.52rem; font-weight:900; letter-spacing:.12em; }
.insight-card strong { display:block; margin-top:2px; font-size:1.15rem; }
.insight-card p { margin:2px 0 0; color:#8b96a7; font-size:.6rem; line-height:1.35; }
.insight-card--wine .insight-icon { color:var(--wine); background:var(--wine-soft); }
.insight-card--wine small { color:var(--wine); }
.insight-card--gold .insight-icon { color:var(--gold-dark); background:var(--gold-soft); }
.insight-card--gold small { color:var(--gold-dark); }
.insight-card--green .insight-icon { color:var(--green); background:var(--green-soft); }
.insight-card--green small { color:var(--green); }
.insight-card--slate .insight-icon { color:var(--slate); background:#eef2f7; }
.insight-card--slate small { color:var(--slate); }

.calendar-toolbar { display:grid; grid-template-columns:auto auto 1fr auto; gap:12px; align-items:center; padding:12px; border:1px solid var(--line); border-radius:16px; background:#fff; }
.month-nav { display:flex; gap:9px; align-items:center; }
.month-nav button,.today-button { height:40px; min-width:40px; border:1px solid #d2dbe6; border-radius:10px; color:#55657a; background:#fff; font-weight:800; }
.month-nav button:hover,.today-button:hover { border-color:#b8c5d3; }
.month-nav div { min-width:150px; }
.month-nav strong { display:block; text-transform:capitalize; font-size:.78rem; }
.month-nav span { display:block; margin-top:2px; color:#8d98a8; font-size:.57rem; }

.view-switch { display:flex; padding:3px; border:1px solid #e1e7ee; border-radius:10px; background:#f6f8fa; }
.view-switch button { border:0; border-radius:7px; padding:8px 11px; color:#7a8797; background:transparent; font-size:.64rem; font-weight:800; }
.view-switch button.active { color:var(--ink); background:#fff; box-shadow:0 3px 10px rgba(28,43,64,.07); }

.filters { display:flex; justify-content:center; gap:6px; flex-wrap:wrap; }
.filters button { display:flex; align-items:center; gap:6px; border:1px solid transparent; border-radius:9px; padding:8px 10px; color:#748095; background:#f7f9fb; font-size:.61rem; font-weight:800; }
.filters button.active { color:#3d4a5d; border-color:#dce4eb; background:#fff; box-shadow:0 3px 10px rgba(28,43,64,.05); }
.filter-dot { width:7px; height:7px; border-radius:50%; background:#8794a7; }
.filter-dot--lesson { background:var(--wine); }
.filter-dot--assignment { background:#d15a5a; }
.filter-dot--quiz { background:var(--violet); }
.filter-dot--test { background:var(--gold); }
.filter-dot--manual { background:var(--green); }

.calendar-layout { display:grid; grid-template-columns:minmax(0,1.72fr) minmax(320px,.68fr); gap:16px; }
.month-card,.agenda-card,.agenda-full-card { overflow:hidden; border:1px solid var(--line); border-radius:20px; background:#fff; box-shadow:0 9px 28px rgba(28,43,64,.04); }
.weekdays { display:grid; grid-template-columns:repeat(7,1fr); border-bottom:1px solid #e6ebf0; background:#f8fafb; }
.weekdays span { padding:11px 6px; color:#8b97a8; font-size:.55rem; font-weight:900; text-align:center; letter-spacing:.08em; }
.month-grid { display:grid; grid-template-columns:repeat(7,1fr); }
.day-cell { min-height:128px; padding:9px; border:0; border-right:1px solid #edf1f4; border-bottom:1px solid #edf1f4; color:var(--ink); background:#fff; text-align:left; }
.day-cell:nth-child(7n) { border-right:0; }
.day-cell:hover { background:#fcfdfe; }
.day-cell.is-outside { background:#fafbfd; color:#b1bac5; }
.day-cell.is-selected { box-shadow:inset 0 0 0 2px rgba(167,25,75,.2); }
.day-cell.is-today .day-number { color:#fff; background:var(--wine); }
.day-number { width:28px; height:28px; display:grid; place-items:center; border-radius:9px; font-size:.72rem; font-weight:850; }
.day-events { display:grid; gap:4px; margin-top:7px; }
.event-chip { display:flex; align-items:center; gap:5px; overflow:hidden; max-width:100%; padding:5px 6px; border-radius:7px; font-size:.53rem; font-weight:800; white-space:nowrap; text-overflow:ellipsis; }
.event-chip__dot { width:6px; height:6px; min-width:6px; border-radius:50%; background:currentColor; opacity:.7; }
.event-chip--lesson { color:var(--wine); background:var(--wine-soft); }
.event-chip--assignment { color:#b33d49; background:#fff1f2; }
.event-chip--quiz { color:#7255a7; background:var(--violet-soft); }
.event-chip--test { color:var(--gold-dark); background:var(--gold-soft); }
.event-chip--manual { color:var(--green); background:var(--green-soft); }
.day-events small { color:#8f9aaa; font-size:.53rem; }

.agenda-card { padding:19px; }
.agenda-card__header { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; padding-bottom:14px; border-bottom:1px solid #e8edf2; }
.agenda-card h2 { margin:4px 0 0; text-transform:capitalize; font-size:1.08rem; }
.agenda-count { width:34px; height:34px; display:grid; place-items:center; border-radius:10px; color:var(--wine); background:var(--wine-soft); font-size:.72rem; font-weight:900; }
.agenda-list { display:grid; }
.agenda-item { display:grid; grid-template-columns:8px minmax(0,1fr) auto; gap:10px; padding:14px 0; border-bottom:1px solid #edf1f4; }
.agenda-marker { width:6px; height:100%; min-height:42px; border-radius:8px; background:#b1bbc7; }
.agenda-item--lesson .agenda-marker { background:var(--wine); }
.agenda-item--assignment .agenda-marker { background:#c64c58; }
.agenda-item--quiz .agenda-marker { background:var(--violet); }
.agenda-item--test .agenda-marker { background:var(--gold); }
.agenda-item--manual .agenda-marker { background:var(--green); }
.agenda-topline { display:flex; align-items:center; gap:6px; }
.agenda-item small { color:#8c98a8; font-size:.52rem; font-weight:900; letter-spacing:.08em; }
.source-badge { padding:3px 5px; border-radius:5px; color:var(--green); background:var(--green-soft); font-size:.45rem; font-weight:900; }
.agenda-copy>strong { display:block; margin-top:3px; font-size:.75rem; line-height:1.25; }
.agenda-copy p { margin:4px 0 0; color:#8290a1; font-size:.59rem; line-height:1.45; }
.agenda-location { color:#6c788a !important; }
.agenda-actions { display:flex; flex-direction:column; align-items:flex-end; gap:5px; }
.agenda-actions a,.agenda-actions button { border:0; padding:0; color:var(--wine); background:transparent; font-size:.59rem; font-weight:850; text-decoration:none; }
.agenda-actions button.danger-link { color:#b23d4f; }
.agenda-empty { display:grid; place-items:center; align-content:center; min-height:180px; text-align:center; }
.agenda-empty div { width:44px; height:44px; display:grid; place-items:center; border-radius:13px; color:var(--green); background:var(--green-soft); font-weight:900; }
.agenda-empty strong { margin-top:10px; font-size:.8rem; }
.agenda-empty p { max-width:240px; margin:5px 0 0; color:#8a96a6; font-size:.63rem; line-height:1.5; }
.agenda-empty button { margin-top:11px; border:1px solid #d8e0e8; border-radius:9px; padding:8px 11px; color:var(--wine); background:#fff; font-size:.61rem; font-weight:850; }

.upcoming { margin-top:18px; padding-top:17px; border-top:1px solid #e8edf2; }
.upcoming>header span { color:#a67807; font-size:.52rem; font-weight:900; letter-spacing:.12em; }
.upcoming>header strong { display:block; margin-top:3px; font-size:.78rem; }
.upcoming article { display:grid; grid-template-columns:42px 1fr; gap:9px; align-items:center; padding:9px 0; }
.upcoming-date { display:grid; place-items:center; align-content:center; width:42px; height:42px; border-radius:10px; background:#f5f7fa; }
.upcoming-date strong { font-size:.75rem; }
.upcoming-date span { color:#8c98a8; font-size:.48rem; font-weight:900; }
.upcoming-date--lesson { background:var(--wine-soft); color:var(--wine); }
.upcoming-date--assignment { background:#fff1f2; color:#b33d49; }
.upcoming-date--quiz { background:var(--violet-soft); color:#7255a7; }
.upcoming-date--test { background:var(--gold-soft); color:var(--gold-dark); }
.upcoming-date--manual { background:var(--green-soft); color:var(--green); }
.upcoming article small { color:#8d99a9; font-size:.5rem; }
.upcoming article>div:last-child>strong { display:block; margin-top:2px; font-size:.64rem; }
.empty-inline { color:#8a96a6; font-size:.62rem; }

.agenda-full-card { padding:22px; }
.agenda-full-card__header { display:flex; justify-content:space-between; align-items:flex-end; gap:16px; padding-bottom:18px; border-bottom:1px solid #e8edf2; }
.agenda-full-card__header h2 { margin:4px 0 3px; font-size:1.3rem; }
.agenda-full-card__header p { margin:0; color:#7f8b9d; font-size:.67rem; }
.agenda-timeline { padding:16px 0 4px; }
.timeline-item { display:grid; grid-template-columns:54px 20px minmax(0,1fr); gap:10px; align-items:start; padding:12px 0; }
.timeline-date { display:grid; place-items:center; align-content:center; width:54px; height:54px; border:1px solid #e2e8ee; border-radius:14px; background:#fbfcfd; }
.timeline-date strong { font-size:.9rem; }
.timeline-date span { color:#9aa5b4; font-size:.5rem; font-weight:900; }
.timeline-line { position:relative; height:100%; min-height:54px; display:flex; justify-content:center; }
.timeline-line::before { content:''; position:absolute; top:0; bottom:-24px; width:1px; background:#e8edf2; }
.timeline-line span { position:relative; z-index:1; width:9px; height:9px; margin-top:16px; border-radius:50%; background:#94a1b2; }
.timeline-item--lesson .timeline-line span { background:var(--wine); }
.timeline-item--assignment .timeline-line span { background:#c64c58; }
.timeline-item--quiz .timeline-line span { background:var(--violet); }
.timeline-item--test .timeline-line span { background:var(--gold); }
.timeline-item--manual .timeline-line span { background:var(--green); }
.timeline-body { padding:3px 0 12px; border-bottom:1px solid #eef1f4; }
.timeline-heading { display:flex; flex-direction:column; gap:4px; }
.timeline-kind { color:#a67807; font-size:.52rem; font-weight:900; letter-spacing:.11em; }
.timeline-heading strong { font-size:.9rem; }
.timeline-body p { margin:5px 0 0; color:#7f8b9d; font-size:.64rem; }
.timeline-actions { display:flex; gap:10px; margin-top:8px; }
.timeline-actions a,.timeline-actions button { border:0; padding:0; color:var(--wine); background:transparent; font-size:.6rem; font-weight:850; text-decoration:none; }
.timeline-actions .danger-link { color:#b23d4f; }
.agenda-empty--large { min-height:260px; }

.state-card { min-height:240px; display:grid; place-items:center; align-content:center; gap:10px; border:1px solid var(--line); border-radius:18px; background:#fff; color:#55657a; }
.loader { width:30px; height:30px; border:3px solid #e0e6ec; border-top-color:var(--wine); border-radius:50%; animation:spin .8s linear infinite; }
.state-card--error p { margin:0; color:#8793a4; }
.state-card--error button { border:1px solid #ccd6df; border-radius:9px; padding:8px 12px; color:var(--wine); background:#fff; }

.modal-backdrop { position:fixed; inset:0; z-index:1000; display:grid; place-items:center; padding:22px; background:rgba(8,16,28,.55); backdrop-filter:blur(9px); }
.event-modal,.confirm-modal { width:min(760px,100%); max-height:min(90vh,900px); overflow:auto; border:1px solid rgba(255,255,255,.4); border-radius:22px; background:#fff; box-shadow:0 35px 80px rgba(8,16,28,.28); }
.event-modal__header { display:flex; justify-content:space-between; gap:16px; padding:22px 22px 15px; border-bottom:1px solid #e8edf2; }
.event-modal__header h2 { margin:5px 0 4px; font-size:1.35rem; }
.event-modal__header p { margin:0; color:#7f8b9d; font-size:.65rem; }
.modal-close { width:34px; height:34px; border:1px solid #dde4eb; border-radius:10px; color:#6b788a; background:#fff; font-size:1.25rem; }
.event-type-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; padding:16px 22px 0; }
.event-type-option { display:flex; gap:8px; align-items:center; min-width:0; padding:9px; border:1px solid #e2e8ee; border-radius:11px; text-align:left; background:#fbfcfd; }
.event-type-option>span { width:32px; height:32px; display:grid; place-items:center; flex:none; border-radius:9px; background:#edf1f5; font-weight:900; }
.event-type-option strong { display:block; font-size:.63rem; }
.event-type-option small { display:block; margin-top:2px; color:#8b96a7; font-size:.46rem; line-height:1.2; }
.event-type-option--audition.active,.event-type-option--rehearsal.active,.event-type-option--concert.active { border-color:rgba(44,139,99,.45); background:var(--green-soft); }
.event-type-option--audition.active>span,.event-type-option--rehearsal.active>span,.event-type-option--concert.active>span { color:var(--green); background:#d8f1e4; }
.event-type-option--meeting.active,.event-type-option--announcement.active,.event-type-option--other.active { border-color:rgba(167,25,75,.3); background:var(--wine-soft); }
.event-type-option--meeting.active>span,.event-type-option--announcement.active>span,.event-type-option--other.active>span { color:var(--wine); background:#fbe0e9; }
.event-type-option--holiday.active { border-color:rgba(214,165,29,.45); background:var(--gold-soft); }
.event-type-option--holiday.active>span { color:var(--gold-dark); background:#ffedb7; }

.event-form { display:grid; gap:14px; padding:18px 22px 22px; }
.event-form label { display:grid; gap:6px; }
.event-form label>span { color:#5f6c7e; font-size:.61rem; font-weight:850; }
.event-form input,.event-form select,.event-form textarea { width:100%; border:1px solid #dce4eb; border-radius:10px; padding:10px 11px; outline:none; color:var(--ink); background:#fff; font-size:.68rem; }
.event-form input:focus,.event-form select:focus,.event-form textarea:focus { border-color:rgba(167,25,75,.5); box-shadow:0 0 0 3px rgba(167,25,75,.07); }
.form-grid { display:grid; gap:11px; }
.form-grid--2 { grid-template-columns:1fr 1fr; }
.toggle-field { display:flex !important; grid-template-columns:none !important; align-items:center; gap:10px !important; padding:10px 12px; border:1px solid #e4e9ef; border-radius:11px; background:#fbfcfd; }
.toggle-field input { display:none; }
.toggle-ui { width:36px; height:20px; flex:none; border-radius:999px; background:#d5dde6; position:relative; }
.toggle-ui::after { content:''; position:absolute; top:3px; left:3px; width:14px; height:14px; border-radius:50%; background:#fff; box-shadow:0 2px 4px rgba(0,0,0,.15); transition:transform .2s ease; }
.toggle-field input:checked + .toggle-ui { background:var(--wine); }
.toggle-field input:checked + .toggle-ui::after { transform:translateX(16px); }
.toggle-field strong { display:block; font-size:.65rem; }
.toggle-field small { display:block; margin-top:2px; color:#8b96a7; font-size:.52rem; }
.modal-error { margin:0; padding:10px 11px; border-radius:9px; color:#a33c4e; background:#fff1f3; font-size:.62rem; }
.event-modal__footer { display:flex; justify-content:flex-end; gap:9px; padding-top:2px; }

.confirm-modal { width:min(420px,100%); padding:24px; text-align:center; }
.confirm-icon { width:48px; height:48px; margin:0 auto; display:grid; place-items:center; border-radius:15px; color:#ad3a4d; background:#fff0f3; font-weight:900; }
.confirm-modal h2 { margin:12px 0 6px; font-size:1.1rem; }
.confirm-modal p { margin:0; color:#7e8a9a; font-size:.68rem; line-height:1.55; }
.confirm-actions { display:flex; justify-content:center; gap:8px; margin-top:18px; }
.danger-action { border:0; border-radius:10px; padding:10px 14px; color:#fff; background:#ae3d50; font-size:.65rem; font-weight:850; }
.danger-action:disabled { opacity:.6; }

.calendar-toast { position:fixed; right:20px; bottom:20px; z-index:1200; display:flex; gap:10px; align-items:center; max-width:340px; padding:12px 14px; border:1px solid #dce7e1; border-radius:14px; background:#f6fcf8; box-shadow:0 16px 34px rgba(28,43,64,.15); }
.calendar-toast>span { width:28px; height:28px; display:grid; place-items:center; border-radius:9px; color:var(--green); background:#dff3e7; font-weight:900; }
.calendar-toast strong { display:block; font-size:.65rem; }
.calendar-toast small { display:block; margin-top:2px; color:#6f7f78; font-size:.55rem; }
.calendar-toast--error { border-color:#f0d4da; background:#fff7f8; }
.calendar-toast--error>span { color:#b03f53; background:#fbe1e6; }

.modal-fade-enter-active,.modal-fade-leave-active,.toast-enter-active,.toast-leave-active { transition:opacity .18s ease; }
.modal-fade-enter-from,.modal-fade-leave-to,.toast-enter-from,.toast-leave-to { opacity:0; }
@keyframes spin { to { transform:rotate(360deg); } }

@media (max-width: 1180px) {
  .calendar-insight-row { grid-template-columns:repeat(2,1fr); }
  .calendar-toolbar { grid-template-columns:auto auto 1fr; }
  .today-button { justify-self:end; }
  .filters { grid-column:1/-1; justify-content:flex-start; }
  .event-type-grid { grid-template-columns:repeat(3,1fr); }
}

@media (max-width: 980px) {
  .calendar-hero { flex-direction:column; }
  .hero-actions { align-items:stretch; min-width:0; }
  .hero-stat { min-width:0; }
  .calendar-layout { grid-template-columns:1fr; }
}

@media (max-width: 720px) {
  .calendar-hero { padding:21px; border-radius:19px; }
  .hero-title-row { align-items:flex-start; }
  .hero-date { width:78px; min-width:78px; height:78px; }
  .calendar-insight-row { grid-template-columns:1fr 1fr; }
  .calendar-toolbar { grid-template-columns:1fr auto; }
  .view-switch { justify-self:end; }
  .month-nav div { min-width:125px; }
  .month-grid { grid-auto-rows:minmax(78px,auto); }
  .day-cell { min-height:78px; padding:6px; }
  .event-chip { width:7px; height:7px; padding:0; border-radius:50%; }
  .event-chip__dot { display:none; }
  .event-chip { font-size:0; }
  .event-type-grid { grid-template-columns:1fr 1fr; }
  .form-grid--2 { grid-template-columns:1fr; }
}

@media (max-width: 500px) {
  .calendar-insight-row { grid-template-columns:1fr; }
  .calendar-hero h1 { font-size:2.15rem; }
  .hero-title-row { flex-direction:column; }
  .calendar-toolbar { grid-template-columns:1fr; }
  .view-switch,.today-button { justify-self:start; }
  .weekdays span { padding:8px 2px; font-size:.47rem; }
  .day-number { width:25px; height:25px; font-size:.65rem; }
  .day-cell { min-height:70px; }
  .event-modal { border-radius:18px; }
  .event-modal__header { padding:18px; }
  .event-form { padding:15px 18px 18px; }
  .event-type-grid { padding:14px 18px 0; }
}


/* =========================================================
   CALENDARIO COMPACTO · MES PRIMERO + AGENDA DEBAJO
   ========================================================= */
.calendar-page--compact {
  gap: 12px;
  min-width: 0;
}
.calendar-page--compact .calendar-toolbar {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid rgba(221, 229, 237, .95);
  border-radius: 18px;
  background: rgba(255, 255, 255, .94);
  box-shadow: 0 8px 24px rgba(28, 43, 64, .045);
}
.calendar-toolbar__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  min-width: 0;
}
.calendar-page--compact .month-nav {
  flex: 1 1 250px;
  min-width: 0;
  gap: 10px;
}
.calendar-page--compact .month-nav button,
.calendar-page--compact .today-button {
  flex: 0 0 40px;
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 13px;
  border-color: #d9e1eb;
  color: var(--wine);
  background: linear-gradient(145deg, #fff, #f9fafd);
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
}
.calendar-page--compact .month-nav button:hover,
.calendar-page--compact .today-button:hover {
  transform: translateY(-1px);
  border-color: rgba(167, 25, 75, .28);
  box-shadow: 0 5px 13px rgba(167, 25, 75, .08);
}
.calendar-page--compact .month-nav__label {
  flex: 1 1 auto;
  min-width: 0;
}
.calendar-page--compact .month-nav strong {
  overflow: hidden;
  color: var(--ink);
  font-size: clamp(.9rem, 2vw, 1.05rem);
  font-weight: 900;
  letter-spacing: -.025em;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.calendar-page--compact .month-nav span { font-size: .65rem; }
.calendar-toolbar__actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex: 0 0 auto;
  gap: 8px;
}
.calendar-page--compact .primary-action--compact {
  min-height: 40px;
  border-radius: 13px;
  padding: 10px 14px;
  font-size: .72rem;
  white-space: nowrap;
}
.calendar-page--compact .filters {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 7px;
  min-width: 0;
}
.calendar-page--compact .filters button {
  min-height: 35px;
  border: 1px solid transparent;
  border-radius: 999px;
  padding: 8px 12px;
  background: #f6f8fb;
  font-size: .67rem;
  transition: background .18s ease, border-color .18s ease, color .18s ease;
}
.calendar-page--compact .filters button.active {
  border-color: rgba(167, 25, 75, .22);
  color: var(--wine-dark);
  background: var(--wine-soft);
  box-shadow: inset 0 0 0 1px rgba(167, 25, 75, .025);
}
.calendar-page--compact .month-card,
.calendar-page--compact .agenda-card {
  width: 100%;
  min-width: 0;
  border: 1px solid rgba(215, 225, 235, .98);
  border-radius: 20px;
  background: rgba(255, 255, 255, .97);
  box-shadow: 0 10px 26px rgba(28, 43, 64, .045);
}
.calendar-page--compact .month-card { overflow: hidden; }
.calendar-page--compact .weekdays { background: linear-gradient(180deg, #fbfcfe, #f5f7fa); }
.calendar-page--compact .weekdays span { padding: 11px 2px; font-size: .61rem; }
.calendar-page--compact .month-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.calendar-page--compact .day-cell {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 4px;
  min-width: 0;
  min-height: 108px;
  padding: 7px;
  border: 0;
  border-right: 1px solid #edf1f5;
  border-bottom: 1px solid #edf1f5;
  background: rgba(255, 255, 255, .92);
  transition: background .16s ease, box-shadow .16s ease;
}
.calendar-page--compact .day-cell:nth-child(7n) { border-right: 0; }
.calendar-page--compact .day-cell:hover { background: #fdfbfc; }
.calendar-page--compact .day-cell.is-outside { color: #aeb8c5; background: #fafbfd; }
.calendar-page--compact .day-cell.is-selected {
  position: relative;
  z-index: 1;
  background: linear-gradient(145deg, rgba(255, 245, 249, .98), rgba(255, 255, 255, .94));
  box-shadow: inset 0 0 0 2px rgba(167, 25, 75, .2);
}
.calendar-page--compact .day-cell__select {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  align-self: flex-start;
  width: 100%;
  min-width: 0;
  min-height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  text-align: left;
  cursor: pointer;
}
.calendar-page--compact .day-number {
  display: grid;
  place-items: center;
  width: 27px;
  height: 27px;
  border-radius: 9px;
  color: var(--ink);
  font-size: .72rem;
  font-weight: 900;
  transition: background .16s ease, color .16s ease;
}
.calendar-page--compact .day-cell.is-today .day-number { color: #fff; background: var(--wine); }
.calendar-page--compact .day-cell.is-selected:not(.is-today) .day-number { color: var(--wine); background: #fbe2eb; }
.calendar-page--compact .day-events {
  display: grid;
  gap: 3px;
  align-content: start;
  min-width: 0;
  margin: 0;
}
.calendar-page--compact .event-chip {
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
  min-width: 0;
  min-height: 19px;
  overflow: hidden;
  padding: 3px 5px;
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: .54rem;
  font-weight: 800;
  line-height: 1.2;
  text-align: left;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
}
.calendar-page--compact .event-chip:hover { filter: saturate(1.12); border-color: currentColor; }
.calendar-page--compact .event-chip__dot { display: inline-block; width: 5px; height: 5px; min-width: 5px; border-radius: 50%; background: currentColor; opacity: .78; }
.calendar-page--compact .event-chip__label { display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.calendar-page--compact .day-more {
  justify-self: start;
  padding: 1px 3px;
  border: 0;
  color: var(--wine);
  background: transparent;
  font-size: .5rem;
  font-weight: 900;
  text-align: left;
  white-space: nowrap;
}
.calendar-page--compact .calendar-agenda {
  align-self: start;
  margin: 0;
  padding: 20px;
  scroll-margin-top: 18px;
}
.calendar-page--compact .agenda-card__header { align-items: center; }
.calendar-page--compact .agenda-card h2 { font-size: clamp(1rem, 2.5vw, 1.22rem); letter-spacing: -.025em; }
.calendar-page--compact .agenda-item { grid-template-columns: 6px minmax(0, 1fr) auto; gap: 12px; }
.calendar-page--compact .agenda-copy>strong { font-size: .83rem; line-height: 1.35; }
.calendar-page--compact .agenda-item small { font-size: .62rem; }
.calendar-page--compact .agenda-copy p { font-size: .68rem; }
.calendar-page--compact .agenda-actions a,
.calendar-page--compact .agenda-actions button { font-size: .67rem; }
.calendar-page--compact .upcoming { margin-top: 20px; padding-top: 18px; }
.calendar-page--compact .upcoming>header span { font-size: .58rem; }
.calendar-page--compact .upcoming>header strong { font-size: .95rem; }
.calendar-page--compact .upcoming-event {
  display: grid;
  grid-template-columns: 46px minmax(0, 1fr) auto;
  align-items: center;
  gap: 11px;
  width: 100%;
  padding: 10px 8px;
  border: 1px solid transparent;
  border-radius: 13px;
  color: inherit;
  background: transparent;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
  transition: background .16s ease, border-color .16s ease, transform .16s ease;
}
.calendar-page--compact .upcoming-event:hover { border-color: #e5eaf0; background: #fbfcfe; transform: translateY(-1px); }
.calendar-page--compact .upcoming-date { width: 46px; height: 46px; border-radius: 13px; }
.calendar-page--compact .upcoming-date strong { font-size: .83rem; }
.calendar-page--compact .upcoming-date small { font-size: .53rem; font-weight: 900; }
.calendar-page--compact .upcoming-event__copy { display: block; min-width: 0; }
.calendar-page--compact .upcoming-event__copy small { display: block; color: #8793a4; font-size: .58rem; }
.calendar-page--compact .upcoming-event__copy strong { display: block; margin-top: 3px; overflow-wrap: anywhere; font-size: .77rem; line-height: 1.35; }
.calendar-page--compact .upcoming-event__arrow { color: var(--wine); font-size: 1rem; font-weight: 900; }
.calendar-page--compact .empty-inline { font-size: .72rem; }
.calendar-page--compact button:focus-visible,
.calendar-page--compact a:focus-visible { outline: 3px solid rgba(167, 25, 75, .28); outline-offset: 2px; }

@media (max-width: 720px) {
  .calendar-page--compact { gap: 10px; }
  .calendar-page--compact .calendar-toolbar { padding: 10px; border-radius: 15px; gap: 10px; }
  .calendar-toolbar__top { gap: 10px; }
  .calendar-page--compact .month-nav { gap: 7px; }
  .calendar-page--compact .month-nav button { flex-basis: 36px; width: 36px; min-width: 36px; height: 36px; border-radius: 11px; }
  .calendar-page--compact .month-nav strong { font-size: .9rem; }
  .calendar-page--compact .month-nav span { font-size: .59rem; }
  .calendar-toolbar__actions { gap: 6px; }
  .calendar-page--compact .today-button { flex-basis: 36px; width: auto; min-width: 44px; height: 36px; padding: 0 10px; }
  .calendar-page--compact .primary-action--compact { min-height: 36px; padding: 8px 10px; font-size: .66rem; }
  .calendar-page--compact .filters { flex-wrap: nowrap; overflow-x: auto; padding: 1px 1px 4px; scrollbar-width: none; -webkit-overflow-scrolling: touch; }
  .calendar-page--compact .filters::-webkit-scrollbar { display: none; }
  .calendar-page--compact .filters button { flex: 0 0 auto; min-height: 33px; padding: 7px 10px; font-size: .62rem; }
  .calendar-page--compact .weekdays span { padding: 9px 1px; font-size: .54rem; letter-spacing: .035em; }
  .calendar-page--compact .day-cell { gap: 3px; min-height: 81px; padding: 4px 3px; }
  .calendar-page--compact .day-cell__select { min-height: 23px; }
  .calendar-page--compact .day-number { width: 22px; height: 22px; border-radius: 7px; font-size: .63rem; }
  .calendar-page--compact .day-events { gap: 2px; }
  .calendar-page--compact .event-chip { min-height: 14px; gap: 2px; padding: 2px 3px; border-radius: 4px; font-size: .44rem; line-height: 1.12; }
  .calendar-page--compact .event-chip__dot { width: 4px; height: 4px; min-width: 4px; }
  .calendar-page--compact .day-more { padding: 0 1px; font-size: .42rem; }
  .calendar-page--compact .calendar-agenda { padding: 15px 13px; border-radius: 17px; }
  .calendar-page--compact .agenda-item { grid-template-columns: 5px minmax(0, 1fr) auto; gap: 8px; padding: 12px 0; }
  .calendar-page--compact .agenda-actions { gap: 8px; }
  .calendar-page--compact .agenda-actions a,
  .calendar-page--compact .agenda-actions button { font-size: .62rem; }
  .calendar-page--compact .upcoming-event { grid-template-columns: 43px minmax(0, 1fr) 14px; gap: 9px; padding: 9px 4px; }
  .calendar-page--compact .upcoming-date { width: 43px; height: 43px; }
  .calendar-page--compact .upcoming-event__copy strong { font-size: .72rem; }
  .calendar-page--compact .upcoming-event__copy small { font-size: .53rem; }
}

@media (max-width: 500px) {
  .calendar-page--compact .calendar-toolbar__top { display: grid; grid-template-columns: minmax(0, 1fr); }
  .calendar-page--compact .month-nav { width: 100%; }
  .calendar-page--compact .calendar-toolbar__actions { justify-content: space-between; width: 100%; }
  .calendar-page--compact .primary-action--compact { margin-left: auto; }
  .calendar-page--compact .day-cell { min-height: 76px; padding: 3px 2px; }
  .calendar-page--compact .day-cell__select { min-height: 21px; }
  .calendar-page--compact .day-number { width: 20px; height: 20px; font-size: .59rem; }
  .calendar-page--compact .event-chip { min-height: 13px; padding: 2px; font-size: .4rem; }
  .calendar-page--compact .event-chip__dot { display: none; }
  .calendar-page--compact .day-more { font-size: .4rem; }
  .calendar-page--compact .agenda-card__header { gap: 8px; }
  .calendar-page--compact .agenda-item { grid-template-columns: 4px minmax(0, 1fr); }
  .calendar-page--compact .agenda-actions { grid-column: 2; flex-direction: row; justify-content: flex-start; align-items: center; padding-top: 2px; }
}
</style>
