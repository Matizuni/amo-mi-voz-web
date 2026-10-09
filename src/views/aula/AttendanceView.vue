<template>
  <section class="attendance amv-view-shell">
    <header class="attendance__header">
      <div>
        <p class="attendance__eyebrow">Profesor · Aula Virtual</p>
        <h1>Asistencia</h1>
        <p class="attendance__description">
          Revisa y registra la asistencia de cada clase en un solo lugar.
        </p>
      </div>
    </header>

    <div
      v-if="isLoading"
      class="attendance-state attendance-state--loading"
      role="status"
      aria-live="polite"
    >
      <span class="attendance-spinner"></span>
      <div>
        <strong>Cargando asistencia</strong>
        <p>Estamos preparando las clases y estudiantes.</p>
      </div>
    </div>

    <template v-else>
      <div
        v-if="errorMessage"
        class="attendance-alert attendance-alert--error"
        role="alert"
      >
        <div class="attendance-alert__icon">!</div>
        <div>
          <strong>No pudimos completar la acción</strong>
          <p>{{ errorMessage }}</p>
        </div>
        <button
          type="button"
          aria-label="Cerrar mensaje de error"
          @click="errorMessage = ''"
        >
          ×
        </button>
      </div>

      <div v-if="lessons.length === 0" class="attendance-state">
        <div class="attendance-state__symbol">♪</div>
        <div>
          <strong>Todavía no hay clases disponibles</strong>
          <p>Crea una clase para comenzar a registrar asistencia.</p>
        </div>
      </div>

      <template v-else>
        <section class="attendance__lesson-selector" aria-label="Seleccionar clase">
          <div class="attendance__lesson-selector-main">
            <label for="lesson">Clase / día</label>
            <div class="attendance-select-control">
              <button
                class="attendance-select-step"
                type="button"
                aria-label="Ir a la clase anterior"
                title="Clase anterior"
                :disabled="isLoadingAttendance || isSaving || isEditing || currentLessonIndex <= 0"
                @click="navigateLesson(-1)"
              >
                <span aria-hidden="true">‹</span>
              </button>

              <div
                ref="lessonDropdownRef"
                class="attendance-select"
                @keydown.esc.stop.prevent="closeLessonMenu"
              >
                <button
                  id="lesson"
                  type="button"
                  class="attendance-select-trigger"
                  :disabled="isLoadingAttendance || isSaving || isEditing"
                  :aria-expanded="isLessonMenuOpen"
                  aria-haspopup="listbox"
                  aria-controls="attendance-lesson-options"
                  @click="toggleLessonMenu"
                  @keydown.down.prevent="openLessonMenu"
                >
                  <span class="attendance-select-trigger__class">
                    Clase {{ selectedLessonNumber }}
                  </span>
                  <span class="attendance-select-trigger__date">
                    {{ selectedLesson ? formatLessonDate(selectedLesson.date) : 'Selecciona una clase' }}
                  </span>
                  <span
                    class="attendance-select-trigger__chevron"
                    :class="{ 'is-open': isLessonMenuOpen }"
                    aria-hidden="true"
                  >⌄</span>
                </button>

                <Transition name="lesson-dropdown">
                  <div
                    v-if="isLessonMenuOpen"
                    id="attendance-lesson-options"
                    class="attendance-select-menu"
                    role="listbox"
                    aria-label="Clases disponibles"
                  >
                    <div class="attendance-select-menu__heading">
                      <span>Elige una clase</span>
                      <small>{{ lessons.length }} {{ lessons.length === 1 ? 'clase' : 'clases' }}</small>
                    </div>

                    <button
                      v-for="lesson in lessons"
                      :key="lesson.id"
                      type="button"
                      role="option"
                      class="attendance-select-option"
                      :class="{ 'is-selected': Number(lesson.id) === Number(selectedLessonId) }"
                      :aria-selected="Number(lesson.id) === Number(selectedLessonId)"
                      @click="selectLesson(lesson)"
                    >
                      <span class="attendance-select-option__number">
                        {{ String(getAcademicLessonNumber(lesson)).padStart(2, '0') }}
                      </span>
                      <span class="attendance-select-option__copy">
                        <strong>{{ cleanLessonTitle(lesson.title) }}</strong>
                        <small>{{ formatLessonDate(lesson.date) }}</small>
                      </span>
                      <span class="attendance-select-option__indicator" aria-hidden="true">
                        {{ Number(lesson.id) === Number(selectedLessonId) ? '✓' : '›' }}
                      </span>
                    </button>
                  </div>
                </Transition>
              </div>

              <button
                class="attendance-select-step"
                type="button"
                aria-label="Ir a la clase siguiente"
                title="Clase siguiente"
                :disabled="isLoadingAttendance || isSaving || isEditing || currentLessonIndex < 0 || currentLessonIndex >= lessons.length - 1"
                @click="navigateLesson(1)"
              >
                <span aria-hidden="true">›</span>
              </button>
            </div>
          </div>

          <div v-if="selectedLesson" class="attendance__lesson-info">
            <span>Clase {{ selectedLessonNumber }}</span>
            <strong>{{ cleanLessonTitle(selectedLesson.title) }}</strong>
            <small>{{ formatLessonDate(selectedLesson.date) }}</small>
          </div>

          <div class="attendance__lesson-actions">
            <button
              v-if="!isEditing"
              type="button"
              class="attendance-edit-toggle"
              :disabled="isLoadingAttendance || isSaving || students.length === 0"
              @click="startEditing"
            >
              <span aria-hidden="true">✎</span>
              Editar asistencia
            </button>
            <span v-else class="attendance-editing-status" role="status">
              <span aria-hidden="true">●</span>
              Edición activa
            </span>
          </div>
        </section>

        <div
          v-if="isLoadingAttendance"
          class="attendance-inline-loading"
          role="status"
          aria-live="polite"
        >
          <span class="attendance-spinner attendance-spinner--small"></span>
          Cargando registro de la clase...
        </div>

        <template v-else>
          <section
            class="attendance-status"
            :class="{
              'attendance-status--saved': lessonIsSaved && !isEditing,
              'attendance-status--pending': !lessonIsSaved || isEditing,
              'attendance-status--editing': isEditing
            }"
            aria-live="polite"
          >
            <div class="attendance-status__icon">
              {{ isEditing ? '✎' : lessonIsSaved ? '✓' : '•' }}
            </div>
            <div class="attendance-status__text">
              <strong>
                {{
                  isEditing
                    ? 'Editando asistencia'
                    : lessonIsSaved
                      ? 'Asistencia guardada'
                      : 'Registro pendiente'
                }}
              </strong>
              <span v-if="isEditing">
                Marca a los estudiantes y guarda los cambios al terminar.
              </span>
              <span v-else-if="lessonIsSaved">
                Última actualización: {{ formattedLastUpdate }}
              </span>
              <span v-else>
                Pulsa «Editar asistencia» para comenzar el registro.
              </span>
            </div>
            <span class="attendance-status__coverage">
              {{ registeredCount }}/{{ students.length }} registrados
            </span>
          </section>

          <section class="attendance__summary" aria-label="Resumen de asistencia">
            <article class="summary-card summary-card--primary">
              <span>Asistencia</span>
              <strong>{{ attendancePercentage }}%</strong>
            </article>
            <article>
              <span>Presentes</span>
              <strong>{{ presentCount }}</strong>
            </article>
            <article>
              <span>Ausentes</span>
              <strong>{{ absentCount }}</strong>
            </article>
            <article>
              <span>Justificados</span>
              <strong>{{ justifiedCount }}</strong>
            </article>
            <article>
              <span>Sin registrar</span>
              <strong>{{ unregisteredCount }}</strong>
            </article>
          </section>

          <div
            class="attendance-progress"
            :aria-label="`Asistencia: ${attendancePercentage}%`"
          >
            <div
              class="attendance-progress__bar"
              :style="{ width: `${attendancePercentage}%` }"
            ></div>
          </div>

          <section class="attendance__content">
            <div class="attendance__toolbar">
              <div class="attendance__title">
                <span>{{ formattedSelectedLessonNumber }}</span>
                <div>
                  <p>Clase {{ selectedLessonNumber }}</p>
                  <h2>Estudiantes</h2>
                </div>
              </div>

              <div
                v-if="canEdit && students.length"
                class="attendance__quick-actions"
              >
                <span>Acciones rápidas</span>
                <div>
                  <button
                    type="button"
                    class="quick-action quick-action--present"
                    @click="markAllPresent"
                  >
                    <span aria-hidden="true">✓</span>
                    Todos presentes
                  </button>
                  <button
                    v-if="registeredCount > 0"
                    type="button"
                    class="quick-action"
                    @click="clearAllStatuses"
                  >
                    Limpiar
                  </button>
                </div>
              </div>
            </div>

            <div class="attendance-voice-legend" aria-label="Leyenda de colores por clasificación vocal">
              <span class="attendance-voice-legend__label">Grupos vocales</span>
              <span class="attendance-voice-chip attendance-voice-chip--soprano"><i aria-hidden="true"></i>Soprano</span>
              <span class="attendance-voice-chip attendance-voice-chip--alto"><i aria-hidden="true"></i>Alto</span>
              <span class="attendance-voice-chip attendance-voice-chip--tenor"><i aria-hidden="true"></i>Tenor</span>
              <span class="attendance-voice-chip attendance-voice-chip--bajo"><i aria-hidden="true"></i>Bajo</span>
              <span class="attendance-voice-chip attendance-voice-chip--unclassified"><i aria-hidden="true"></i>Sin clasificar</span>
            </div>

            <div
              v-if="draftRows.length === 0"
              class="attendance-state attendance-state--compact"
            >
              <div class="attendance-state__symbol">+</div>
              <div>
                <strong>No hay estudiantes matriculados</strong>
                <p>Cuando existan estudiantes activos aparecerán en esta lista.</p>
              </div>
            </div>

            <div v-else class="attendance-list">
              <article
                v-for="student in draftRows"
                :key="student.id"
                class="attendance-card"
                :class="[
                  {
                    'attendance-card--present': student.status === 'present',
                    'attendance-card--absent': student.status === 'absent',
                    'attendance-card--justified': student.status === 'justified'
                  },
                  `attendance-card--voice-${getVoiceClass(student.voice)}`
                ]"
              >
                <div class="attendance-card__identity">
                  <div class="attendance-card__avatar" aria-hidden="true">
                    <span class="attendance-card__avatar-initials">{{ getInitials(student.name) }}</span>
                  </div>
                  <div class="attendance-card__student">
                    <span>{{ student.voice }}</span>
                    <h3>{{ student.name }}</h3>
                  </div>
                </div>

                <div
                  class="attendance-card__statuses"
                  role="group"
                  :aria-label="`Asistencia de ${student.name}`"
                >
                  <button
                    type="button"
                    :disabled="!canEdit"
                    :aria-pressed="student.status === 'present'"
                    :class="{
                      active: student.status === 'present',
                      'status-button--present': true
                    }"
                    @click="setDraftStatus(student.id, 'present')"
                  >
                    <span aria-hidden="true">✓</span>
                    Presente
                  </button>
                  <button
                    type="button"
                    :disabled="!canEdit"
                    :aria-pressed="student.status === 'absent'"
                    :class="{
                      active: student.status === 'absent',
                      'status-button--absent': true
                    }"
                    @click="setDraftStatus(student.id, 'absent')"
                  >
                    <span aria-hidden="true">×</span>
                    Ausente
                  </button>
                  <button
                    type="button"
                    :disabled="!canEdit"
                    :aria-pressed="student.status === 'justified'"
                    :class="{
                      active: student.status === 'justified',
                      'status-button--justified': true
                    }"
                    @click="setDraftStatus(student.id, 'justified')"
                  >
                    <span aria-hidden="true">!</span>
                    Justificado
                  </button>
                </div>

                <div class="attendance-card__note">
                  <label :for="`attendance-note-${student.id}`">Observación</label>
                  <input
                    :id="`attendance-note-${student.id}`"
                    v-model="student.notes"
                    type="text"
                    :disabled="!canEdit"
                    maxlength="250"
                    placeholder="Opcional"
                  />
                </div>
              </article>
            </div>
          </section>

          <section
            v-if="canEdit && draftRows.length"
            class="attendance-actions"
          >
            <div class="attendance-actions__info">
              <strong>{{ lessonIsSaved ? 'Editando asistencia' : 'Nuevo registro de asistencia' }}</strong>
              <span>{{ registeredCount }} de {{ students.length }} estudiantes registrados.</span>
            </div>
            <div class="attendance-actions__buttons">
              <button
                type="button"
                class="attendance-actions__cancel"
                :disabled="isSaving"
                @click="cancelEditing"
              >
                Cancelar
              </button>
              <button
                type="button"
                class="attendance-actions__save"
                :disabled="isSaving || registeredCount === 0"
                @click="saveAttendance"
              >
                <span
                  v-if="isSaving"
                  class="attendance-spinner attendance-spinner--button"
                ></span>
                {{ isSaving ? 'Guardando...' : 'Guardar asistencia' }}
              </button>
            </div>
          </section>

          <section class="attendance-history-section">
            <button
              type="button"
              class="attendance-history-toggle"
              :aria-expanded="historyExpanded"
              @click="toggleHistory"
            >
              <span class="attendance-history-toggle__text">
                <strong>Historial de asistencia</strong>
                <small>{{ historyLoaded ? savedLessonsCount + '/' + lessons.length + ' clases con registro' : 'Consulta los registros de otras clases' }}</small>
              </span>
              <span class="attendance-history-toggle__icon" aria-hidden="true">
                {{ historyExpanded ? '−' : '+' }}
              </span>
            </button>

            <section v-if="historyExpanded" class="attendance-panel attendance-history">
              <header class="attendance-history__header">
                <div>
                  <span>SEGUIMIENTO ACADÉMICO</span>
                  <h2>Historial de asistencia</h2>
                  <p>Consulta los registros guardados y vuelve a una clase cuando lo necesites.</p>
                </div>
                <div class="attendance-history__metrics">
                  <article>
                    <small>Clases registradas</small>
                    <strong>{{ savedLessonsCount }}/{{ lessons.length }}</strong>
                  </article>
                  <article>
                    <small>Promedio registrado</small>
                    <strong>{{ historyAverage }}%</strong>
                  </article>
                </div>
              </header>

              <div
                v-if="isLoadingHistory"
                class="attendance-state attendance-state--compact"
                role="status"
              >
                <span class="attendance-spinner attendance-spinner--small"></span>
                <div>
                  <strong>Cargando historial</strong>
                  <p>Estamos reuniendo los registros de las clases.</p>
                </div>
              </div>

              <div
                v-else-if="attendanceHistory.length === 0"
                class="attendance-state attendance-state--compact"
              >
                <div class="attendance-state__symbol">○</div>
                <div>
                  <strong>Aún no hay historial disponible</strong>
                  <p>Los registros guardados aparecerán aquí.</p>
                </div>
              </div>

              <div v-else class="attendance-history__list">
                <article
                  v-for="item in attendanceHistory"
                  :key="item.lesson.id"
                  class="attendance-history-card"
                  :class="{ 'is-pending': !item.saved }"
                >
                  <div class="attendance-history-card__lesson">
                    <span>CLASE {{ getAcademicLessonNumber(item.lesson) }}</span>
                    <strong>{{ cleanLessonTitle(item.lesson.title) }}</strong>
                    <small>{{ formatLessonDate(item.lesson.date) }}</small>
                  </div>
                  <div class="attendance-history-card__stats">
                    <span><b>{{ item.present }}</b> Presentes</span>
                    <span><b>{{ item.absent }}</b> Ausentes</span>
                    <span><b>{{ item.justified }}</b> Justificados</span>
                  </div>
                  <div class="attendance-history-card__result">
                    <strong v-if="item.saved">{{ item.percentage }}%</strong>
                    <strong v-else>—</strong>
                    <small>{{ item.saved ? 'Asistencia' : 'Sin registrar' }}</small>
                  </div>
                  <button type="button" @click="openHistoryLesson(item.lesson)">
                    {{ item.saved ? 'Revisar clase' : 'Registrar' }}
                  </button>
                </article>
              </div>
            </section>
          </section>
        </template>
      </template>
    </template>

    <Transition name="message">
      <div
        v-if="successMessage"
        class="attendance-message"
        role="status"
        aria-live="polite"
      >
        <span aria-hidden="true">✓</span>
        {{ successMessage }}
      </div>
    </Transition>
  </section>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref
} from 'vue'

import {
  fetchLessons
} from '@/services/lessonService'

import {
  fetchAttendanceByLesson,
  upsertAttendanceRows
} from '@/services/attendanceService'

import {
  fetchStudents
} from '@/services/studentService'

/* =========================================================
   ESTADO
========================================================= */

const lessons = ref([])
const students = ref([])
const lessonAttendance = ref([])
const draftRows = ref([])

const selectedLessonId = ref(null)
const isLessonMenuOpen = ref(false)
const lessonDropdownRef = ref(null)

const isLoading = ref(true)
const isLoadingAttendance = ref(false)
const isSaving = ref(false)
const isEditing = ref(false)

const successMessage = ref('')
const errorMessage = ref('')

/* =========================================================
   HISTORIAL DESPLEGABLE
========================================================= */
const isLoadingHistory = ref(false)
const historyLoaded = ref(false)
const attendanceHistory = ref([])
const historyExpanded = ref(false)

const loadAttendanceHistory = async () => {
  if (
    isLoadingHistory.value ||
    historyLoaded.value
  ) {
    return
  }

  isLoadingHistory.value = true

  try {
    const rows =
      await Promise.all(
        lessons.value.map(async lesson => {
          const records =
            await fetchAttendanceByLesson(
              lesson.id
            )

          const present =
            (records || []).filter(
              item =>
                item.status === 'present'
            ).length

          const absent =
            (records || []).filter(
              item =>
                item.status === 'absent'
            ).length

          const justified =
            (records || []).filter(
              item =>
                item.status === 'justified'
            ).length

          const registered =
            present +
            absent +
            justified

          const total =
            students.value.length

          return {
            lesson,
            present,
            absent,
            justified,
            registered,
            total,
            percentage:
              total > 0
                ? Math.round(
                    (present / total) * 100
                  )
                : 0,
            saved:
              registered > 0
          }
        })
      )

    attendanceHistory.value = rows
    historyLoaded.value = true
  } catch (error) {
    console.error(
      'Error cargando historial de asistencia:',
      error
    )

    errorMessage.value =
      error?.message ||
      'No se pudo cargar el historial de asistencia.'
  } finally {
    isLoadingHistory.value = false
  }
}

const toggleHistory = async () => {
  historyExpanded.value = !historyExpanded.value

  if (historyExpanded.value && !historyLoaded.value) {
    await loadAttendanceHistory()
  }
}

const openHistoryLesson = async lesson => {
  if (!lesson?.id) return

  historyExpanded.value = false
  selectedLessonId.value = lesson.id
  await changeLesson()
}

const savedLessonsCount =
  computed(() =>
    attendanceHistory.value.filter(
      item => item.saved
    ).length
  )

const historyAverage =
  computed(() => {
    const saved =
      attendanceHistory.value.filter(
        item => item.saved
      )

    if (!saved.length) {
      return 0
    }

    return Math.round(
      saved.reduce(
        (sum, item) =>
          sum + item.percentage,
        0
      ) / saved.length
    )
  })


/* =========================================================
   HELPERS DE CLASE
========================================================= */

const getLessonUnitId = lesson =>
  lesson?.unitId ??
  lesson?.unit_id ??
  null

/*
 * IMPORTANTE:
 * lesson.id es solamente el ID interno de Supabase.
 *
 * La numeración visible se obtiene desde la posición
 * académica de la clase dentro de su unidad.
 */
const getAcademicLessonNumber = lesson => {
  if (!lesson) {
    return 0
  }

  const unitId =
    getLessonUnitId(lesson)

  const lessonsInSameUnit =
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
    lessonsInSameUnit.findIndex(
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

const cleanLessonTitle = title => {
  if (!title) {
    return 'Clase sin título'
  }

  return String(title)
    .replace(
      /^\s*clase\s+\d+\s*[·:–—-]?\s*/i,
      ''
    )
    .trim()
}

const formatLessonDate = date => {
  if (!date) {
    return 'Sin fecha'
  }

  /*
   * Si lessonService ya devuelve una fecha legible,
   * la respetamos.
   */
  const rawDate =
    String(date).trim()

  const isoMatch =
    rawDate.match(
      /^(\d{4})-(\d{2})-(\d{2})$/
    )

  if (!isoMatch) {
    return rawDate
  }

  const [, year, month, day] =
    isoMatch

  const parsed =
    new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    )

  if (
    Number.isNaN(
      parsed.getTime()
    )
  ) {
    return rawDate
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

const getLessonOptionLabel = lesson => {
  const number =
    getAcademicLessonNumber(lesson)

  const date =
    formatLessonDate(
      lesson?.date
    )

  return `Clase ${number} · ${date}`
}

/* =========================================================
   CLASE SELECCIONADA
========================================================= */

const selectedLesson =
  computed(() =>
    lessons.value.find(
      lesson =>
        Number(lesson.id) ===
        Number(selectedLessonId.value)
    ) || null
  )

const selectedLessonNumber =
  computed(() =>
    getAcademicLessonNumber(
      selectedLesson.value
    )
  )

const currentLessonIndex =
  computed(() =>
    lessons.value.findIndex(
      lesson =>
        Number(lesson.id) ===
        Number(selectedLessonId.value)
    )
  )

const formattedSelectedLessonNumber =
  computed(() =>
    String(
      selectedLessonNumber.value || 0
    ).padStart(2, '0')
  )

/* =========================================================
   ¿YA EXISTE ASISTENCIA?
========================================================= */

const lessonIsSaved =
  computed(() =>
    lessonAttendance.value.some(
      record =>
        record.status === 'present' ||
        record.status === 'absent' ||
        record.status === 'justified'
    )
  )

/* =========================================================
   PERMISO EDICIÓN
========================================================= */

const canEdit =
  computed(() => isEditing.value)

/* =========================================================
   CARGA INICIAL
========================================================= */

const loadInitialData = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const [
      loadedLessons,
      loadedStudents
    ] = await Promise.all([
      fetchLessons(),
      fetchStudents()
    ])

    lessons.value =
      loadedLessons || []

    students.value =
      loadedStudents || []

    if (
      lessons.value.length > 0 &&
      !selectedLessonId.value
    ) {
      selectedLessonId.value =
        lessons.value[0].id
    }

    if (selectedLessonId.value) {
      await loadAttendance()
    } else {
      loadDraft()
    }
  } catch (error) {
    console.error(
      'Error cargando datos de asistencia:',
      error
    )

    lessons.value = []
    students.value = []
    lessonAttendance.value = []
    draftRows.value = []

    errorMessage.value =
      error?.message ||
      'No se pudieron cargar los datos de asistencia.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   CARGAR ASISTENCIA
========================================================= */

const loadAttendance = async () => {
  if (!selectedLessonId.value) {
    lessonAttendance.value = []
    draftRows.value = []
    return
  }

  isLoadingAttendance.value = true
  errorMessage.value = ''

  try {
    lessonAttendance.value =
      await fetchAttendanceByLesson(
        selectedLessonId.value
      )

    loadDraft()
  } catch (error) {
    console.error(
      'Error cargando asistencia:',
      error
    )

    lessonAttendance.value = []
    loadDraft()

    errorMessage.value =
      error?.message ||
      'No se pudo cargar la asistencia de esta clase.'
  } finally {
    isLoadingAttendance.value = false
  }
}

/* =========================================================
   BORRADOR
========================================================= */

const loadDraft = () => {
  draftRows.value =
    students.value.map(student => {
      const existingRecord =
        lessonAttendance.value.find(
          record =>
            Number(record.studentId) ===
            Number(student.id)
        )

      return {
        id:
          student.id,

        name:
          student.name,

        voice:
          student.voice ||
          'Sin clasificación',

        status:
          existingRecord?.status ||
          '',

        notes:
          existingRecord?.notes ||
          ''
      }
    })
}

/* =========================================================
   CAMBIAR CLASE
========================================================= */

const changeLesson = async () => {
  isLessonMenuOpen.value = false
  isEditing.value = false
  successMessage.value = ''
  errorMessage.value = ''

  await loadAttendance()
}

const openLessonMenu = () => {
  if (isLoadingAttendance.value || isSaving.value || isEditing.value) return
  isLessonMenuOpen.value = true
}

const closeLessonMenu = () => {
  isLessonMenuOpen.value = false
}

const toggleLessonMenu = () => {
  if (isLessonMenuOpen.value) {
    closeLessonMenu()
    return
  }

  openLessonMenu()
}

const selectLesson = async lesson => {
  if (!lesson) return

  selectedLessonId.value = lesson.id
  closeLessonMenu()
  await changeLesson()
}

const handleLessonMenuOutsidePointer = event => {
  if (!lessonDropdownRef.value?.contains(event.target)) {
    closeLessonMenu()
  }
}

const navigateLesson = async step => {
  if (
    isLoadingAttendance.value ||
    isSaving.value ||
    !lessons.value.length
  ) {
    return
  }

  const nextIndex =
    currentLessonIndex.value + step

  if (
    nextIndex < 0 ||
    nextIndex >= lessons.value.length
  ) {
    return
  }

  selectedLessonId.value =
    lessons.value[nextIndex].id

  await changeLesson()
}

/* =========================================================
   EDITAR
========================================================= */

const startEditing = () => {
  loadDraft()

  isEditing.value = true
  successMessage.value = ''
  errorMessage.value = ''
}

/* =========================================================
   CANCELAR
========================================================= */

const cancelEditing = () => {
  loadDraft()

  isEditing.value = false
  successMessage.value = ''
  errorMessage.value = ''
}

/* =========================================================
   ESTADO INDIVIDUAL
========================================================= */

const setDraftStatus = (
  studentId,
  status
) => {
  if (!canEdit.value) {
    return
  }

  const student =
    draftRows.value.find(
      item =>
        Number(item.id) ===
        Number(studentId)
    )

  if (!student) {
    return
  }

  student.status = status
}

/* =========================================================
   ACCIONES RÁPIDAS
========================================================= */

const markAllPresent = () => {
  if (!canEdit.value) {
    return
  }

  draftRows.value.forEach(
    student => {
      student.status =
        'present'
    }
  )
}

const clearAllStatuses = () => {
  if (!canEdit.value) {
    return
  }

  draftRows.value.forEach(
    student => {
      student.status = ''
    }
  )
}

/* =========================================================
   GUARDAR
========================================================= */

const saveAttendance = async () => {
  if (
    !selectedLessonId.value ||
    isSaving.value
  ) {
    return
  }

  errorMessage.value = ''
  successMessage.value = ''

  const rowsToSave =
    draftRows.value
      .filter(
        student =>
          student.status === 'present' ||
          student.status === 'absent' ||
          student.status === 'justified'
      )
      .map(student => ({
        lessonId:
          selectedLessonId.value,

        studentId:
          student.id,

        studentName:
          student.name,

        status:
          student.status,

        notes:
          student.notes?.trim() || ''
      }))

  if (!rowsToSave.length) {
    errorMessage.value =
      'Debes registrar al menos un estudiante antes de guardar.'

    return
  }

  isSaving.value = true

  try {
    await upsertAttendanceRows(
      rowsToSave
    )

    lessonAttendance.value =
      await fetchAttendanceByLesson(
        selectedLessonId.value
      )

    loadDraft()

    isEditing.value = false

    historyLoaded.value = false
    attendanceHistory.value = []
    historyExpanded.value = false

    successMessage.value =
      'Asistencia guardada correctamente.'

    window.setTimeout(() => {
      successMessage.value = ''
    }, 3500)
  } catch (error) {
    console.error(
      'Error guardando asistencia:',
      error
    )

    errorMessage.value =
      error?.message ||
      'No se pudo guardar la asistencia.'
  } finally {
    isSaving.value = false
  }
}

/* =========================================================
   RESUMEN
========================================================= */

const presentCount =
  computed(() =>
    draftRows.value.filter(
      student =>
        student.status === 'present'
    ).length
  )

const absentCount =
  computed(() =>
    draftRows.value.filter(
      student =>
        student.status === 'absent'
    ).length
  )

const justifiedCount =
  computed(() =>
    draftRows.value.filter(
      student =>
        student.status === 'justified'
    ).length
  )

const registeredCount =
  computed(() =>
    presentCount.value +
    absentCount.value +
    justifiedCount.value
  )

const unregisteredCount =
  computed(() =>
    Math.max(
      students.value.length -
        registeredCount.value,
      0
    )
  )

/* =========================================================
   PORCENTAJE
========================================================= */

const attendancePercentage =
  computed(() => {
    if (
      students.value.length === 0
    ) {
      return 0
    }

    return Math.round(
      (
        presentCount.value /
        students.value.length
      ) * 100
    )
  })

/* =========================================================
   ÚLTIMA ACTUALIZACIÓN
========================================================= */

const lastUpdate =
  computed(() => {
    const dates =
      lessonAttendance.value
        .map(
          record =>
            record.updatedAt
        )
        .filter(Boolean)
        .map(
          date =>
            new Date(date)
        )
        .filter(
          date =>
            !Number.isNaN(
              date.getTime()
            )
        )

    if (!dates.length) {
      return null
    }

    return new Date(
      Math.max(
        ...dates.map(
          date =>
            date.getTime()
        )
      )
    )
  })

const formattedLastUpdate =
  computed(() => {
    if (!lastUpdate.value) {
      return 'Sin fecha'
    }

    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    ).format(
      lastUpdate.value
    )
  })

/* =========================================================
   INICIALES
========================================================= */

const getVoiceClass = voice => {
  const normalized = String(voice || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim()
    .toLowerCase()

  if (normalized.includes('sopr')) return 'soprano'
  if (normalized.includes('alto')) return 'alto'
  if (normalized.includes('tenor')) return 'tenor'
  if (normalized.includes('bajo') || normalized.includes('bass')) return 'bajo'
  return 'unclassified'
}

const getInitials = name => {
  if (!name) {
    return '?'
  }

  return String(name)
    .split(' ')
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
   INICIO
========================================================= */

onMounted(() => {
  document.addEventListener('pointerdown', handleLessonMenuOutsidePointer)
  loadInitialData()
})

onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', handleLessonMenuOutsidePointer)
})
</script>

<style lang="scss" scoped>
.attendance {
  --attendance-ink: #2b2025;
  --attendance-muted: #776b70;
  --attendance-line: #e8dfe2;
  --attendance-surface: #ffffff;
  --attendance-canvas: #fbf8f9;
  --attendance-wine: #7a2948;
  --attendance-wine-dark: #602039;
  --attendance-wine-soft: #f7edf1;
  --attendance-green: #26734e;
  --attendance-green-soft: #eaf6ef;
  --attendance-red: #a63f4e;
  --attendance-red-soft: #fbefef;
  --attendance-amber: #94651c;
  --attendance-amber-soft: #fff6e6;

  width: min(100%, 1180px);
  margin-inline: auto;
  padding: 0 0 2rem;
  color: var(--attendance-ink);
}

.attendance,
.attendance * {
  box-sizing: border-box;
}

.attendance button,
.attendance input,
.attendance select {
  font: inherit;
}

.attendance button {
  -webkit-tap-highlight-color: transparent;
}

.attendance__header {
  margin: 0 0 1.35rem;
}

.attendance__eyebrow {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.45rem;
  color: var(--attendance-wine);
  font-size: 0.72rem;
  font-weight: 750;
  letter-spacing: 0.12em;
  line-height: 1.4;
  text-transform: uppercase;
}

.attendance__header h1 {
  margin: 0;
  color: var(--attendance-ink);
  font-size: clamp(2rem, 4vw, 2.8rem);
  font-weight: 760;
  letter-spacing: -0.055em;
  line-height: 1.05;
}

.attendance__description {
  max-width: 38rem;
  margin: 0.65rem 0 0;
  color: var(--attendance-muted);
  font-size: 0.94rem;
  line-height: 1.6;
}

/* Selector de clase */
.attendance__lesson-selector {
  display: grid;
  grid-template-columns: minmax(260px, 1.1fr) minmax(220px, 0.9fr);
  gap: 1.25rem;
  align-items: end;
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--attendance-line);
  border-radius: 16px;
  background: var(--attendance-surface);
  box-shadow: 0 5px 20px rgb(58 29 41 / 3%);
}

.attendance__lesson-selector-main {
  display: grid;
  gap: 0.5rem;
  min-width: 0;
}

.attendance__lesson-selector label {
  color: var(--attendance-muted);
  font-size: 0.76rem;
  font-weight: 750;
  letter-spacing: 0.04em;
}

.attendance-select-control {
  display: flex;
  gap: 0.45rem;
  min-width: 0;
  align-items: stretch;
}

.attendance-select {
  position: relative;
  flex: 1 1 auto;
  min-width: 0;
}

.attendance-select::after {
  position: absolute;
  top: 50%;
  right: 0.85rem;
  color: #84757b;
  content: '⌄';
  font-size: 1.05rem;
  pointer-events: none;
  transform: translateY(-58%);
}

.attendance__lesson-selector select {
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 0 2.5rem 0 0.85rem;
  border: 1px solid #ded0d5;
  border-radius: 10px;
  outline: none;
  appearance: none;
  background: #fff;
  color: var(--attendance-ink);
  font-size: 0.88rem;
  font-weight: 620;
  cursor: pointer;
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.attendance__lesson-selector select:hover:not(:disabled) {
  border-color: #bc9ba8;
}

.attendance__lesson-selector select:focus-visible {
  border-color: var(--attendance-wine);
  box-shadow: 0 0 0 3px rgb(122 41 72 / 12%);
}

.attendance__lesson-selector select:disabled {
  cursor: wait;
  opacity: 0.65;
}

.attendance-select-step {
  display: grid;
  width: 44px;
  min-width: 44px;
  min-height: 44px;
  place-items: center;
  padding: 0;
  border: 1px solid var(--attendance-line);
  border-radius: 10px;
  background: #fff;
  color: var(--attendance-wine);
  cursor: pointer;
  transition: background 160ms ease, border-color 160ms ease, transform 160ms ease;
}

.attendance-select-step span {
  position: relative;
  top: -1px;
  font-family: Arial, sans-serif;
  font-size: 1.8rem;
  font-weight: 400;
  line-height: 1;
}

.attendance-select-step:hover:not(:disabled) {
  border-color: #c9a8b5;
  background: var(--attendance-wine-soft);
}

.attendance-select-step:active:not(:disabled) {
  transform: scale(0.97);
}

.attendance-select-step:disabled {
  color: #b6a8ad;
  background: #faf8f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.attendance__lesson-info {
  min-width: 0;
  align-self: center;
  padding-left: 1rem;
  border-left: 1px solid var(--attendance-line);
}

.attendance__lesson-info > span {
  display: block;
  margin-bottom: 0.22rem;
  color: var(--attendance-wine);
  font-size: 0.69rem;
  font-weight: 800;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.attendance__lesson-info strong {
  display: block;
  overflow: hidden;
  color: var(--attendance-ink);
  font-size: 0.98rem;
  font-weight: 740;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendance__lesson-info small {
  display: block;
  margin-top: 0.22rem;
  color: var(--attendance-muted);
  font-size: 0.78rem;
}

/* Carga y mensajes */
.attendance-state,
.attendance-inline-loading {
  display: flex;
  gap: 0.9rem;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid var(--attendance-line);
  border-radius: 14px;
  background: var(--attendance-surface);
  color: var(--attendance-ink);
}

.attendance-state {
  margin: 0 0 1rem;
}

.attendance-state--loading {
  min-height: 150px;
  justify-content: center;
}

.attendance-state--compact {
  padding: 1rem;
}

.attendance-state strong,
.attendance-inline-loading strong {
  display: block;
  font-size: 0.92rem;
  font-weight: 750;
}

.attendance-state p {
  margin: 0.3rem 0 0;
  color: var(--attendance-muted);
  font-size: 0.83rem;
  line-height: 1.5;
}

.attendance-state__symbol {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 12px;
  background: var(--attendance-wine-soft);
  color: var(--attendance-wine);
  font-size: 1.2rem;
}

.attendance-inline-loading {
  justify-content: center;
  margin-bottom: 1rem;
  color: var(--attendance-muted);
  font-size: 0.86rem;
}

.attendance-spinner {
  display: inline-block;
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
  border: 3px solid #eadde2;
  border-top-color: var(--attendance-wine);
  border-radius: 50%;
  animation: attendance-spin 700ms linear infinite;
}

.attendance-spinner--small {
  width: 19px;
  height: 19px;
  border-width: 2px;
}

.attendance-spinner--button {
  width: 15px;
  height: 15px;
  border-width: 2px;
  border-color: rgb(255 255 255 / 40%);
  border-top-color: #fff;
}

@keyframes attendance-spin {
  to { transform: rotate(360deg); }
}

.attendance-alert {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding: 0.9rem 1rem;
  border: 1px solid #efd0d5;
  border-radius: 12px;
  background: var(--attendance-red-soft);
  color: #71303a;
}

.attendance-alert__icon {
  display: grid;
  width: 27px;
  height: 27px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #f2d5d9;
  font-weight: 800;
}

.attendance-alert > div:nth-child(2) {
  flex: 1;
  min-width: 0;
}

.attendance-alert strong {
  font-size: 0.86rem;
}

.attendance-alert p {
  margin: 0.2rem 0 0;
  font-size: 0.82rem;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

.attendance-alert > button {
  border: 0;
  background: transparent;
  color: inherit;
  font-size: 1.35rem;
  cursor: pointer;
}

/* Resumen de la clase */
.attendance-panel {
  min-width: 0;
}

.attendance-panel--summary {
  animation: attendance-enter 220ms ease both;
}

.attendance-status {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  margin-bottom: 0.9rem;
  padding: 0.85rem 1rem;
  border: 1px solid var(--attendance-line);
  border-radius: 13px;
  background: #fff;
}

.attendance-status--saved {
  border-color: #d4e8da;
  background: #f7fcf8;
}

.attendance-status--pending {
  border-color: #eadde2;
  background: #fffafb;
}

.attendance-status__icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 11px;
  background: var(--attendance-green-soft);
  color: var(--attendance-green);
  font-size: 1rem;
  font-weight: 850;
}

.attendance-status--pending .attendance-status__icon {
  background: var(--attendance-amber-soft);
  color: var(--attendance-amber);
}

.attendance-status__text {
  flex: 1 1 auto;
  min-width: 0;
}

.attendance-status__text strong,
.attendance-status__text span {
  display: block;
}

.attendance-status__text strong {
  color: var(--attendance-ink);
  font-size: 0.88rem;
  font-weight: 760;
}

.attendance-status__text span {
  margin-top: 0.2rem;
  color: var(--attendance-muted);
  font-size: 0.77rem;
  line-height: 1.45;
}

.attendance-status__edit {
  min-height: 36px;
  padding: 0.4rem 0.8rem;
  border: 1px solid #dec4cf;
  border-radius: 9px;
  background: #fff;
  color: var(--attendance-wine);
  font-size: 0.8rem;
  font-weight: 750;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
}

.attendance-status__edit:hover {
  border-color: var(--attendance-wine);
  background: var(--attendance-wine-soft);
}

.attendance__summary {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 0.7rem;
  margin-bottom: 0.9rem;
}

.attendance__summary article {
  min-width: 0;
  padding: 0.9rem 1rem;
  border: 1px solid var(--attendance-line);
  border-radius: 13px;
  background: #fff;
}

.attendance__summary span,
.attendance__summary strong {
  display: block;
}

.attendance__summary span {
  min-height: 1.2rem;
  margin-bottom: 0.48rem;
  color: var(--attendance-muted);
  font-size: 0.75rem;
  font-weight: 620;
  line-height: 1.35;
}

.attendance__summary strong {
  color: var(--attendance-ink);
  font-size: clamp(1.55rem, 2.7vw, 2rem);
  font-weight: 780;
  letter-spacing: -0.05em;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
}

.attendance__summary .summary-card--primary {
  border-color: #e7cfd8;
  background: linear-gradient(145deg, #fbf2f5, #fff 90%);
}

.attendance__summary .summary-card--primary span,
.attendance__summary .summary-card--primary strong {
  color: var(--attendance-wine);
}

.attendance-progress {
  overflow: hidden;
  height: 6px;
  margin-bottom: 1.2rem;
  border-radius: 999px;
  background: #eee6e9;
}

.attendance-progress__bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #7a2948, #bd7b94);
  transition: width 220ms ease;
}

/* Lista de estudiantes */
.attendance__content {
  min-width: 0;
}

.attendance__toolbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin: 0 0 0.85rem;
}

.attendance__title {
  display: flex;
  gap: 0.8rem;
  min-width: 0;
  align-items: center;
}

.attendance__title > span {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e8d2db;
  border-radius: 12px;
  background: var(--attendance-wine-soft);
  color: var(--attendance-wine);
  font-size: 0.82rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.attendance__title p {
  margin: 0 0 0.15rem;
  color: var(--attendance-muted);
  font-size: 0.7rem;
  font-weight: 750;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.attendance__title h2,
.attendance-history__header h2 {
  margin: 0;
  color: var(--attendance-ink);
  font-size: 1.45rem;
  font-weight: 770;
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.attendance__quick-actions {
  display: grid;
  justify-items: end;
  gap: 0.35rem;
}

.attendance__quick-actions > span {
  color: var(--attendance-muted);
  font-size: 0.7rem;
  font-weight: 700;
}

.attendance__quick-actions > div {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.quick-action {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  justify-content: center;
  min-height: 34px;
  padding: 0.4rem 0.7rem;
  border: 1px solid var(--attendance-line);
  border-radius: 9px;
  background: #fff;
  color: var(--attendance-muted);
  font-size: 0.76rem;
  font-weight: 720;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
}

.quick-action:hover {
  border-color: #cdb2bd;
  color: var(--attendance-wine);
}

.quick-action--present {
  border-color: #cbe5d3;
  background: var(--attendance-green-soft);
  color: var(--attendance-green);
}

.quick-action--present:hover {
  border-color: #9acbad;
  background: #def1e5;
  color: #205d40;
}

.attendance-list {
  display: grid;
  gap: 0.55rem;
}

.attendance-card {
  display: grid;
  grid-template-columns: minmax(180px, 0.82fr) minmax(320px, 1.3fr) minmax(150px, 0.7fr);
  gap: 0.85rem;
  align-items: center;
  min-width: 0;
  padding: 0.8rem 0.9rem;
  border: 1px solid var(--attendance-line);
  border-radius: 13px;
  background: #fff;
  transition: border-color 150ms ease, background 150ms ease;
}

.attendance-card--present {
  border-color: #d7e9dd;
  background: linear-gradient(90deg, #fbfefc, #fff 40%);
}

.attendance-card--absent {
  border-color: #efdadd;
  background: linear-gradient(90deg, #fffafa, #fff 40%);
}

.attendance-card--justified {
  border-color: #f0e3c8;
  background: linear-gradient(90deg, #fffdf8, #fff 40%);
}

.attendance-card__identity {
  display: flex;
  gap: 0.65rem;
  min-width: 0;
  align-items: center;
}

.attendance-card__avatar {
  display: grid;
  width: 40px;
  height: 40px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e8d2db;
  border-radius: 12px;
  background: var(--attendance-wine-soft);
  color: var(--attendance-wine);
  font-size: 0.75rem;
  font-weight: 800;
}

.attendance-card__student {
  min-width: 0;
}

.attendance-card__student span {
  display: block;
  overflow: hidden;
  margin-bottom: 0.12rem;
  color: var(--attendance-wine);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.07em;
  text-overflow: ellipsis;
  text-transform: uppercase;
  white-space: nowrap;
}

.attendance-card__student h3 {
  overflow: hidden;
  margin: 0;
  color: var(--attendance-ink);
  font-size: 0.86rem;
  font-weight: 750;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendance-card__statuses {
  display: flex;
  gap: 0.32rem;
  align-items: center;
  flex-wrap: wrap;
}

.attendance-card__statuses button {
  display: inline-flex;
  gap: 0.28rem;
  align-items: center;
  justify-content: center;
  min-height: 35px;
  padding: 0.35rem 0.55rem;
  border: 1px solid #e7e0e3;
  border-radius: 9px;
  background: #fff;
  color: #756870;
  font-size: 0.72rem;
  font-weight: 720;
  white-space: nowrap;
  cursor: pointer;
  transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
}

.attendance-card__statuses button:hover:not(:disabled) {
  border-color: #cdb5bf;
  color: var(--attendance-ink);
}

.attendance-card__statuses button:disabled {
  cursor: default;
  opacity: 0.75;
}

.status-button--present.active {
  border-color: #b9ddc6;
  background: var(--attendance-green-soft);
  color: var(--attendance-green);
}

.status-button--absent.active {
  border-color: #e8c4ca;
  background: var(--attendance-red-soft);
  color: var(--attendance-red);
}

.status-button--justified.active {
  border-color: #ead6ad;
  background: var(--attendance-amber-soft);
  color: var(--attendance-amber);
}

.attendance-card__note {
  display: grid;
  gap: 0.3rem;
  min-width: 0;
}

.attendance-card__note label {
  color: var(--attendance-muted);
  font-size: 0.68rem;
  font-weight: 700;
}

.attendance-card__note input {
  width: 100%;
  min-width: 0;
  min-height: 35px;
  padding: 0.4rem 0.6rem;
  border: 1px solid #e7dfe2;
  border-radius: 8px;
  outline: 0;
  background: #fff;
  color: var(--attendance-ink);
  font-size: 0.76rem;
  transition: border-color 150ms ease, box-shadow 150ms ease;
}

.attendance-card__note input::placeholder {
  color: #aa9da2;
}

.attendance-card__note input:focus-visible {
  border-color: var(--attendance-wine);
  box-shadow: 0 0 0 3px rgb(122 41 72 / 10%);
}

.attendance-card__note input:disabled {
  background: #faf8f9;
  color: #82767b;
}

/* Barra para guardar: queda a mano al recorrer muchos alumnos */
.attendance-actions {
  position: sticky;
  z-index: 4;
  bottom: 0.7rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.9rem;
  padding: 0.8rem 0.9rem;
  border: 1px solid #e4d4db;
  border-radius: 14px;
  background: rgb(255 252 253 / 94%);
  box-shadow: 0 8px 28px rgb(44 21 31 / 10%);
  backdrop-filter: blur(12px);
}

.attendance-actions__info {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

.attendance-actions__info strong {
  color: var(--attendance-ink);
  font-size: 0.82rem;
  font-weight: 780;
}

.attendance-actions__info span {
  color: var(--attendance-muted);
  font-size: 0.74rem;
  line-height: 1.4;
}

.attendance-actions__buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex: 0 0 auto;
}

.attendance-actions__cancel,
.attendance-actions__save {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0.55rem 0.9rem;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 0.8rem;
  font-weight: 760;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease, transform 150ms ease;
}

.attendance-actions__cancel {
  border-color: var(--attendance-line);
  background: #fff;
  color: var(--attendance-muted);
}

.attendance-actions__cancel:hover:not(:disabled) {
  border-color: #cbb8c0;
  color: var(--attendance-ink);
}

.attendance-actions__save {
  border-color: var(--attendance-wine);
  background: var(--attendance-wine);
  color: #fff;
  box-shadow: 0 3px 8px rgb(122 41 72 / 15%);
}

.attendance-actions__save:hover:not(:disabled) {
  border-color: var(--attendance-wine-dark);
  background: var(--attendance-wine-dark);
  transform: translateY(-1px);
}

.attendance-actions__save:disabled,
.attendance-actions__cancel:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none;
}

/* Historial */
.attendance-history {
  padding: 1rem;
  border: 1px solid var(--attendance-line);
  border-radius: 15px;
  background: #fff;
  animation: attendance-enter 220ms ease both;
}

.attendance-history__header {
  display: flex;
  gap: 1.2rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f0e7ea;
}

.attendance-history__header > div:first-child > span {
  display: block;
  margin-bottom: 0.4rem;
  color: var(--attendance-wine);
  font-size: 0.67rem;
  font-weight: 800;
  letter-spacing: 0.1em;
}

.attendance-history__header p {
  max-width: 35rem;
  margin: 0.4rem 0 0;
  color: var(--attendance-muted);
  font-size: 0.8rem;
  line-height: 1.5;
}

.attendance-history__metrics {
  display: flex;
  gap: 0.55rem;
  flex: 0 0 auto;
}

.attendance-history__metrics article {
  min-width: 112px;
  padding: 0.65rem 0.75rem;
  border: 1px solid var(--attendance-line);
  border-radius: 10px;
  background: var(--attendance-canvas);
}

.attendance-history__metrics small,
.attendance-history__metrics strong {
  display: block;
}

.attendance-history__metrics small {
  margin-bottom: 0.25rem;
  color: var(--attendance-muted);
  font-size: 0.67rem;
  line-height: 1.35;
}

.attendance-history__metrics strong {
  color: var(--attendance-wine);
  font-size: 1.15rem;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

.attendance-history__list {
  display: grid;
  gap: 0.55rem;
}

.attendance-history-card {
  display: grid;
  grid-template-columns: minmax(170px, 1.2fr) minmax(220px, 1.3fr) 75px auto;
  gap: 0.85rem;
  align-items: center;
  min-width: 0;
  padding: 0.75rem 0.8rem;
  border: 1px solid var(--attendance-line);
  border-radius: 11px;
  background: #fff;
}

.attendance-history-card.is-pending {
  background: #fcfafb;
}

.attendance-history-card__lesson {
  display: grid;
  gap: 0.15rem;
  min-width: 0;
}

.attendance-history-card__lesson span {
  color: var(--attendance-wine);
  font-size: 0.64rem;
  font-weight: 800;
  letter-spacing: 0.07em;
}

.attendance-history-card__lesson strong {
  overflow: hidden;
  color: var(--attendance-ink);
  font-size: 0.83rem;
  font-weight: 730;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendance-history-card__lesson small {
  color: var(--attendance-muted);
  font-size: 0.72rem;
}

.attendance-history-card__stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem 0.8rem;
  align-items: center;
}

.attendance-history-card__stats span {
  display: inline-flex;
  gap: 0.28rem;
  align-items: baseline;
  color: var(--attendance-muted);
  font-size: 0.7rem;
  white-space: nowrap;
}

.attendance-history-card__stats b {
  color: var(--attendance-ink);
  font-size: 0.8rem;
  font-weight: 800;
}

.attendance-history-card__result {
  display: grid;
  gap: 0.08rem;
  text-align: center;
}

.attendance-history-card__result strong {
  color: var(--attendance-wine);
  font-size: 1.12rem;
  font-weight: 820;
  font-variant-numeric: tabular-nums;
}

.attendance-history-card__result small {
  color: var(--attendance-muted);
  font-size: 0.65rem;
}

.attendance-history-card > button {
  min-height: 35px;
  padding: 0.4rem 0.7rem;
  border: 1px solid #e2cbd4;
  border-radius: 9px;
  background: #fff;
  color: var(--attendance-wine);
  font-size: 0.75rem;
  font-weight: 750;
  white-space: nowrap;
  cursor: pointer;
  transition: background 150ms ease, border-color 150ms ease;
}

.attendance-history-card > button:hover {
  border-color: #c89eaf;
  background: var(--attendance-wine-soft);
}

/* Mensaje de éxito */
.attendance-message {
  position: fixed;
  z-index: 100;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  display: flex;
  gap: 0.65rem;
  align-items: center;
  max-width: min(28rem, calc(100vw - 2rem));
  padding: 0.85rem 1rem;
  border: 1px solid #c9e6d3;
  border-radius: 12px;
  background: #f3fbf6;
  color: #215f40;
  box-shadow: 0 8px 30px rgb(29 69 46 / 14%);
  font-size: 0.84rem;
  font-weight: 700;
}

.attendance-message > span {
  display: grid;
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background: #d8f0e1;
  font-weight: 850;
}

.message-enter-active,
.message-leave-active {
  transition: opacity 180ms ease, transform 180ms ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;
  transform: translateY(8px);
}

@keyframes attendance-enter {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Accesibilidad y adaptación a pantallas */
.attendance :where(button, input, select):focus-visible {
  outline: 3px solid rgb(122 41 72 / 20%);
  outline-offset: 2px;
}

@media (max-width: 1050px) {
  .attendance-card {
    grid-template-columns: minmax(170px, 0.8fr) minmax(300px, 1.2fr);
  }

  .attendance-card__note {
    grid-column: 1 / -1;
    grid-template-columns: 100px minmax(0, 1fr);
    gap: 0.6rem;
    align-items: center;
  }

  .attendance-history-card {
    grid-template-columns: minmax(150px, 1fr) minmax(180px, 1fr) 65px auto;
  }
}

@media (max-width: 760px) {
  .attendance__lesson-selector {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.85rem;
    padding: 0.9rem;
  }

  .attendance__lesson-info {
    padding: 0.7rem 0 0;
    border-top: 1px solid var(--attendance-line);
    border-left: 0;
  }

  .attendance__lesson-info strong {
    white-space: normal;
  }

  .attendance__summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .attendance__summary article {
    padding: 0.75rem;
  }

  .attendance__summary span {
    min-height: 0;
    font-size: 0.7rem;
  }

  .attendance__toolbar {
    align-items: flex-start;
  }

  .attendance__quick-actions > span {
    display: none;
  }

  .attendance__quick-actions {
    padding-top: 0.15rem;
  }

  .attendance-card {
    grid-template-columns: minmax(0, 1fr);
    gap: 0.65rem;
    padding: 0.8rem;
  }

  .attendance-card__statuses {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .attendance-card__statuses button {
    padding-inline: 0.35rem;
    font-size: 0.7rem;
  }

  .attendance-card__note {
    grid-column: auto;
  }

  .attendance-actions {
    bottom: 0.35rem;
    align-items: flex-start;
  }

  .attendance-history__header {
    flex-direction: column;
  }

  .attendance-history__metrics {
    width: 100%;
  }

  .attendance-history__metrics article {
    flex: 1;
  }

  .attendance-history-card {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.65rem;
  }

  .attendance-history-card__stats {
    grid-column: 1 / -1;
    grid-row: 2;
  }

  .attendance-history-card__result {
    grid-column: 2;
    grid-row: 1;
  }

  .attendance-history-card > button {
    grid-column: 1 / -1;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .attendance__header h1 {
    font-size: 2rem;
  }

  .attendance__description {
    font-size: 0.85rem;
  }

  .attendance-status {
    align-items: flex-start;
    padding: 0.75rem;
  }

  .attendance-status__icon {
    width: 32px;
    height: 32px;
  }

  .attendance-status__edit {
    min-height: 32px;
    padding-inline: 0.6rem;
  }

  .attendance__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .attendance__summary .summary-card--primary {
    grid-column: 1 / -1;
  }

  .attendance__toolbar {
    flex-direction: column;
    gap: 0.7rem;
  }

  .attendance__quick-actions {
    width: 100%;
    justify-items: stretch;
  }

  .attendance__quick-actions > div {
    justify-content: flex-start;
  }

  .attendance-actions {
    flex-direction: column;
    gap: 0.65rem;
    padding: 0.75rem;
  }

  .attendance-actions__buttons {
    width: 100%;
  }

  .attendance-actions__cancel,
  .attendance-actions__save {
    flex: 1;
  }

  .attendance-history {
    padding: 0.7rem;
  }

  .attendance-history__header h2 {
    font-size: 1.25rem;
  }

  .attendance-history__metrics article {
    min-width: 0;
    padding: 0.55rem;
  }

  .attendance-history__metrics small {
    font-size: 0.62rem;
  }

  .attendance-history-card__stats {
    gap: 0.35rem 0.65rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .attendance,
  .attendance :where(*, *::before, *::after) {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}


/* Vista de una sola pantalla: selector, lista y acciones sin pestañas */
.attendance__lesson-selector {
  grid-template-columns: minmax(260px, 1.1fr) minmax(200px, 0.85fr) auto;
  gap: 1rem;
  align-items: center;
}

.attendance__lesson-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-width: max-content;
}

.attendance-edit-toggle {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  justify-content: center;
  min-height: 43px;
  padding: 0.65rem 0.9rem;
  border: 1px solid var(--attendance-wine);
  border-radius: 10px;
  background: var(--attendance-wine);
  color: #fff;
  font-size: 0.82rem;
  font-weight: 760;
  white-space: nowrap;
  cursor: pointer;
  transition: background 150ms ease, transform 150ms ease;
}

.attendance-edit-toggle:hover:not(:disabled) {
  background: var(--attendance-wine-dark);
  transform: translateY(-1px);
}

.attendance-edit-toggle:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.attendance-editing-status {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  min-height: 42px;
  padding: 0.55rem 0.8rem;
  border: 1px solid #e8d2db;
  border-radius: 10px;
  background: var(--attendance-wine-soft);
  color: var(--attendance-wine);
  font-size: 0.8rem;
  font-weight: 760;
  white-space: nowrap;
}

.attendance-editing-status > span {
  color: #b56e87;
  font-size: 0.7rem;
}

.attendance-status--editing {
  border-color: #e8d2db;
  background: #fff8fb;
}

.attendance-status__coverage {
  flex: 0 0 auto;
  color: var(--attendance-muted);
  font-size: 0.76rem;
  font-weight: 720;
  white-space: nowrap;
}

.attendance__content {
  margin-top: 0.7rem;
  padding: 1rem;
  border: 1px solid var(--attendance-line);
  border-radius: 15px;
  background: #fff;
}

.attendance__title > span {
  border-radius: 11px;
}

.attendance-history-section {
  margin-top: 1.1rem;
}

.attendance-history-toggle {
  display: flex;
  width: 100%;
  min-height: 62px;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border: 1px solid var(--attendance-line);
  border-radius: 13px;
  background: #fff;
  color: var(--attendance-ink);
  text-align: left;
  cursor: pointer;
  transition: border-color 150ms ease, background 150ms ease;
}

.attendance-history-toggle:hover {
  border-color: #d8bbc7;
  background: #fffafb;
}

.attendance-history-toggle__text {
  display: grid;
  gap: 0.2rem;
  min-width: 0;
}

.attendance-history-toggle__text strong {
  font-size: 0.88rem;
  font-weight: 780;
}

.attendance-history-toggle__text small {
  color: var(--attendance-muted);
  font-size: 0.75rem;
}

.attendance-history-toggle__icon {
  display: grid;
  width: 31px;
  height: 31px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e8d2db;
  border-radius: 9px;
  background: var(--attendance-wine-soft);
  color: var(--attendance-wine);
  font-size: 1.2rem;
  line-height: 1;
}

.attendance-history {
  margin-top: 0.65rem;
}

@media (max-width: 960px) {
  .attendance__lesson-selector {
    grid-template-columns: minmax(0, 1fr) auto;
  }

  .attendance__lesson-info {
    grid-column: 1;
    padding: 0.7rem 0 0;
    border-top: 1px solid var(--attendance-line);
    border-left: 0;
  }

  .attendance__lesson-actions {
    grid-column: 2;
    grid-row: 2;
  }
}

@media (max-width: 760px) {
  .attendance__lesson-selector {
    grid-template-columns: minmax(0, 1fr);
  }

  .attendance__lesson-actions,
  .attendance__lesson-info {
    grid-column: 1;
    grid-row: auto;
    width: 100%;
  }

  .attendance__lesson-actions {
    justify-content: stretch;
  }

  .attendance-edit-toggle,
  .attendance-editing-status {
    width: 100%;
    justify-content: center;
  }

  .attendance-status {
    flex-wrap: wrap;
  }

  .attendance-status__coverage {
    width: 100%;
    padding-left: calc(32px + 0.75rem);
  }

  .attendance__content {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .attendance__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .attendance__summary .summary-card--primary {
    grid-column: 1 / -1;
  }

  .attendance-actions__buttons {
    display: grid;
    grid-template-columns: 1fr 1.4fr;
  }
}


/* =========================================================
   AMV KAHOOT COLOR SYSTEM · clasificación vocal + microinteracciones
   Soprano: fucsia | Alto: violeta | Tenor: azul | Bajo: turquesa
========================================================= */
.attendance {
  --voice-soprano: #b51f5b;
  --voice-soprano-soft: #ffe3ee;
  --voice-soprano-bg: #fff3f7;

  --voice-alto: #7651d7;
  --voice-alto-soft: #e8e0ff;
  --voice-alto-bg: #f7f3ff;

  --voice-tenor: #3675d3;
  --voice-tenor-soft: #dceaff;
  --voice-tenor-bg: #f1f7ff;

  --voice-bajo: #229b88;
  --voice-bajo-soft: #d8f2ed;
  --voice-bajo-bg: #effaf8;

  --voice-unclassified: #aa7815;
  --voice-unclassified-soft: #ffedbf;
  --voice-unclassified-bg: #fff9e9;

  --kahoot-purple: #7040d4;
  --kahoot-purple-deep: #502ba8;
  --kahoot-pink: #b51f5b;
}

.attendance__header h1 {
  background: linear-gradient(105deg, #241c27 0%, #58317e 48%, #9c275b 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.attendance__lesson-selector {
  border-color: #e8dce8;
  background: linear-gradient(115deg, #fff 0%, #fffafd 58%, #f7f3ff 100%);
  box-shadow: 0 8px 26px rgb(74 42 84 / 6%);
}

.attendance-edit-toggle,
.attendance-actions__save {
  border-color: transparent;
  background: linear-gradient(110deg, var(--kahoot-purple), var(--kahoot-pink));
  box-shadow: 0 5px 13px rgb(112 64 212 / 20%);
}

.attendance-edit-toggle:hover:not(:disabled),
.attendance-actions__save:hover:not(:disabled) {
  border-color: transparent;
  background: linear-gradient(110deg, var(--kahoot-purple-deep), #901a4a);
  box-shadow: 0 7px 17px rgb(112 64 212 / 24%);
  transform: translateY(-2px);
}

.attendance-status--editing {
  border-color: #d9cbfb;
  background: linear-gradient(110deg, #fbf8ff, #fff8fb);
}

.attendance-status--editing .attendance-status__icon {
  background: #eee7ff;
  color: var(--kahoot-purple);
}

.attendance__summary article {
  position: relative;
  overflow: hidden;
  border-color: #ece4ed;
  box-shadow: 0 4px 12px rgb(45 28 52 / 3%);
  transition: transform 180ms ease, box-shadow 180ms ease;
}

.attendance__summary article::before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 3px;
  background: #d7cde3;
  content: '';
}

.attendance__summary article:nth-child(1)::before { background: linear-gradient(90deg, #7040d4, #b51f5b); }
.attendance__summary article:nth-child(2)::before { background: #229b88; }
.attendance__summary article:nth-child(3)::before { background: #e05268; }
.attendance__summary article:nth-child(4)::before { background: #d69a24; }
.attendance__summary article:nth-child(5)::before { background: #3675d3; }

.attendance__summary article:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 19px rgb(45 28 52 / 7%);
}

.attendance__summary article:nth-child(2) strong { color: #188566; }
.attendance__summary article:nth-child(3) strong { color: #ca4057; }
.attendance__summary article:nth-child(4) strong { color: #ad7715; }
.attendance__summary article:nth-child(5) strong { color: #3675d3; }

.attendance-progress {
  height: 7px;
  background: #eee8f3;
}

.attendance-progress__bar {
  background: linear-gradient(90deg, #229b88 0%, #3675d3 48%, #7651d7 75%, #b51f5b 100%);
}

.attendance__content {
  padding: 1.05rem;
  border: 1px solid #e7dfee;
  border-radius: 18px;
  background: linear-gradient(150deg, #fff 0%, #fff 68%, #fcf9ff 100%);
  box-shadow: 0 8px 24px rgb(63 36 81 / 4%);
}

.attendance__title > span {
  border-color: #ded2fb;
  background: linear-gradient(145deg, #f1eaff, #fff0f6);
  color: var(--kahoot-purple);
  box-shadow: 0 3px 9px rgb(112 64 212 / 7%);
}

.attendance-voice-legend {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  flex-wrap: wrap;
  margin: -0.1rem 0 0.85rem;
}

.attendance-voice-legend__label {
  margin-right: 0.15rem;
  color: #8b7b8e;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.055em;
  text-transform: uppercase;
}

.attendance-voice-chip {
  display: inline-flex;
  gap: 0.35rem;
  align-items: center;
  min-height: 27px;
  padding: 0.28rem 0.55rem;
  border: 1px solid transparent;
  border-radius: 999px;
  font-size: 0.68rem;
  font-weight: 750;
  line-height: 1;
  white-space: nowrap;
}

.attendance-voice-chip i {
  display: inline-block;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 3px rgb(255 255 255 / 65%);
}

.attendance-voice-chip--soprano { border-color: #f6c7d9; background: var(--voice-soprano-bg); color: var(--voice-soprano); }
.attendance-voice-chip--alto { border-color: #d9cefb; background: var(--voice-alto-bg); color: var(--voice-alto); }
.attendance-voice-chip--tenor { border-color: #cbdfff; background: var(--voice-tenor-bg); color: var(--voice-tenor); }
.attendance-voice-chip--bajo { border-color: #c2e9e2; background: var(--voice-bajo-bg); color: var(--voice-bajo); }
.attendance-voice-chip--unclassified { border-color: #f2dfb0; background: var(--voice-unclassified-bg); color: var(--voice-unclassified); }

.attendance-card {
  --voice-color: var(--voice-unclassified);
  --voice-soft: var(--voice-unclassified-soft);
  --voice-bg: var(--voice-unclassified-bg);

  position: relative;
  overflow: hidden;
  border-color: #e8e2ee;
  border-left: 4px solid var(--voice-color);
  border-radius: 15px;
  background: linear-gradient(100deg, var(--voice-bg) 0%, #fff 34%);
  box-shadow: 0 3px 10px rgb(42 30 49 / 3%);
  transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
}

.attendance-card--voice-soprano {
  --voice-color: var(--voice-soprano);
  --voice-soft: var(--voice-soprano-soft);
  --voice-bg: var(--voice-soprano-bg);
}

.attendance-card--voice-alto {
  --voice-color: var(--voice-alto);
  --voice-soft: var(--voice-alto-soft);
  --voice-bg: var(--voice-alto-bg);
}

.attendance-card--voice-tenor {
  --voice-color: var(--voice-tenor);
  --voice-soft: var(--voice-tenor-soft);
  --voice-bg: var(--voice-tenor-bg);
}

.attendance-card--voice-bajo {
  --voice-color: var(--voice-bajo);
  --voice-soft: var(--voice-bajo-soft);
  --voice-bg: var(--voice-bajo-bg);
}

.attendance-card--voice-unclassified {
  --voice-color: var(--voice-unclassified);
  --voice-soft: var(--voice-unclassified-soft);
  --voice-bg: var(--voice-unclassified-bg);
}

.attendance-card:hover {
  z-index: 1;
  border-color: var(--voice-soft);
  border-left-color: var(--voice-color);
  box-shadow: 0 8px 20px rgb(42 30 49 / 8%);
  transform: translateY(-2px);
}

.attendance-card__avatar {
  border-color: var(--voice-soft);
  border-radius: 13px;
  background: linear-gradient(145deg, #fff 0%, var(--voice-soft) 100%);
  color: var(--voice-color);
  box-shadow: 0 3px 8px rgb(42 30 49 / 5%);
}

.attendance-card__student span {
  display: inline-flex;
  max-width: 100%;
  width: fit-content;
  align-items: center;
  padding: 0.18rem 0.44rem;
  border-radius: 999px;
  background: var(--voice-soft);
  color: var(--voice-color);
  font-size: 0.62rem;
  letter-spacing: 0.045em;
  line-height: 1.25;
}

.attendance-card__student h3 {
  font-size: 0.88rem;
  letter-spacing: -0.015em;
}

.attendance-card__statuses button {
  min-height: 36px;
  border-radius: 10px;
  transition: transform 150ms ease, background 150ms ease, box-shadow 150ms ease, border-color 150ms ease;
}

.attendance-card__statuses button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.status-button--present.active {
  border-color: #199866;
  background: linear-gradient(130deg, #219c6b, #12865b);
  color: #fff;
  box-shadow: 0 3px 8px rgb(25 152 102 / 19%);
}

.status-button--absent.active {
  border-color: #d9435e;
  background: linear-gradient(130deg, #ec5b70, #d9435e);
  color: #fff;
  box-shadow: 0 3px 8px rgb(217 67 94 / 17%);
}

.status-button--justified.active {
  border-color: #c98a15;
  background: linear-gradient(130deg, #e5a62c, #c98a15);
  color: #fff;
  box-shadow: 0 3px 8px rgb(201 138 21 / 18%);
}

.attendance-card__note input:focus-visible {
  border-color: var(--voice-color);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--voice-color) 15%, transparent);
}

.attendance-actions {
  border-color: #dfd3f0;
  background: rgb(255 253 255 / 94%);
  box-shadow: 0 10px 30px rgb(73 43 104 / 12%);
}

.attendance-actions__save {
  min-width: 150px;
  border-radius: 11px;
  font-weight: 800;
}

.attendance-actions__cancel {
  border-radius: 11px;
}

.attendance-history-toggle {
  border-color: #e6dcef;
  background: linear-gradient(100deg, #fff, #fbf8ff);
  box-shadow: 0 4px 12px rgb(63 36 81 / 3%);
}

.attendance-history-toggle:hover {
  border-color: #d5c3f1;
  background: linear-gradient(100deg, #fff, #f5f0ff);
}

.attendance-history-toggle__icon {
  border-color: #ded2fb;
  background: #f0eaff;
  color: var(--kahoot-purple);
}

.attendance-history-card {
  border-color: #ebe3f1;
  border-radius: 13px;
  box-shadow: 0 3px 9px rgb(42 30 49 / 3%);
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;
}

.attendance-history-card:hover {
  border-color: #d7c7f2;
  box-shadow: 0 6px 15px rgb(42 30 49 / 6%);
  transform: translateY(-1px);
}

.attendance-history-card > button {
  border-color: #d9cbfb;
  border-radius: 9px;
  background: #f5f0ff;
  color: var(--kahoot-purple);
  font-weight: 780;
}

.attendance-history-card > button:hover {
  border-color: var(--kahoot-purple);
  background: var(--kahoot-purple);
  color: #fff;
}

.attendance-message {
  border: 1px solid #c7e9d5;
  background: linear-gradient(110deg, #edfff4, #f2f1ff);
  box-shadow: 0 12px 34px rgb(35 75 58 / 14%);
}

.attendance button:focus-visible,
.attendance select:focus-visible,
.attendance input:focus-visible {
  outline: 3px solid rgb(112 64 212 / 22%);
  outline-offset: 2px;
}

@media (max-width: 760px) {
  .attendance-voice-legend {
    gap: 0.35rem;
  }

  .attendance-voice-legend__label {
    width: 100%;
    margin-bottom: 0.05rem;
  }

  .attendance-voice-chip {
    min-height: 25px;
    padding-inline: 0.45rem;
    font-size: 0.65rem;
  }

  .attendance-card {
    border-left-width: 4px;
    background: linear-gradient(100deg, var(--voice-bg) 0%, #fff 48%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .attendance-card,
  .attendance__summary article,
  .attendance-history-card {
    transition: none;
  }
}



/* =========================================================
   ACABADO PREMIUM · selector a medida + glass vocal
========================================================= */
.attendance__lesson-selector {
  position: relative;
  z-index: 12;
  overflow: visible;
  border: 1px solid rgb(255 255 255 / 88%);
  border-radius: 24px;
  background:
    radial-gradient(ellipse at 5% 0%, rgb(255 231 243 / 55%), transparent 48%),
    linear-gradient(130deg, rgb(255 255 255 / 86%), rgb(250 246 255 / 76%));
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 96%),
    0 12px 32px rgb(63 36 81 / 7%),
    0 2px 6px rgb(63 36 81 / 3%);
  -webkit-backdrop-filter: blur(18px) saturate(145%);
  backdrop-filter: blur(18px) saturate(145%);
}

.attendance-select {
  z-index: 20;
}

.attendance-select::after {
  display: none;
  content: none;
}

.attendance-select-trigger {
  display: flex;
  width: 100%;
  min-width: 0;
  min-height: 52px;
  align-items: center;
  gap: 0.72rem;
  padding: 0.42rem 0.55rem 0.42rem 0.65rem;
  border: 1px solid rgb(139 73 113 / 18%);
  border-radius: 17px;
  background: linear-gradient(135deg, rgb(255 255 255 / 96%), rgb(255 249 253 / 91%));
  color: var(--attendance-ink);
  text-align: left;
  cursor: pointer;
  box-shadow: inset 0 1px 0 #fff, 0 4px 11px rgb(70 35 78 / 4%);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease, background 180ms ease;
}

.attendance-select-trigger:hover:not(:disabled),
.attendance-select-trigger[aria-expanded='true'] {
  border-color: rgb(112 64 212 / 38%);
  background: linear-gradient(135deg, #fff, #fbf6ff 65%, #fff5fa);
  box-shadow: 0 0 0 3px rgb(112 64 212 / 7%), 0 8px 22px rgb(112 64 212 / 9%), inset 0 1px 0 #fff;
}

.attendance-select-trigger:active:not(:disabled) {
  transform: translateY(1px);
}

.attendance-select-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.72;
}

.attendance-select-trigger__class {
  display: inline-flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  min-height: 31px;
  padding: 0.36rem 0.68rem;
  border: 1px solid rgb(255 255 255 / 40%);
  border-radius: 999px;
  background: linear-gradient(115deg, #7040d4, #a82a76 92%);
  color: #fff;
  font-size: 0.76rem;
  font-weight: 820;
  letter-spacing: 0.01em;
  white-space: nowrap;
  box-shadow: 0 3px 8px rgb(112 64 212 / 19%);
}

.attendance-select-trigger__date {
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  color: #42333f;
  font-size: 0.87rem;
  font-weight: 720;
  line-height: 1.4;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendance-select-trigger__chevron {
  display: grid;
  width: 29px;
  height: 29px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgb(112 64 212 / 12%);
  border-radius: 50%;
  background: linear-gradient(145deg, #fff, #f2edff);
  color: #7040d4;
  font-size: 1rem;
  line-height: 1;
  transition: transform 180ms ease, background 180ms ease;
}

.attendance-select-trigger__chevron.is-open {
  transform: rotate(180deg);
  background: #eee6ff;
}

.attendance-select-menu {
  position: absolute;
  z-index: 80;
  top: calc(100% + 0.55rem);
  right: 0;
  left: 0;
  max-height: min(360px, 58vh);
  overflow: auto;
  padding: 0.55rem;
  border: 1px solid rgb(255 255 255 / 88%);
  border-radius: 22px;
  background: linear-gradient(145deg, rgb(255 255 255 / 96%), rgb(250 246 255 / 92%));
  -webkit-backdrop-filter: blur(24px) saturate(155%);
  backdrop-filter: blur(24px) saturate(155%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 98%),
    0 22px 60px rgb(44 26 58 / 19%),
    0 4px 14px rgb(112 64 212 / 8%);
  scrollbar-width: thin;
  scrollbar-color: #d4c4ee transparent;
}

.attendance-select-menu__heading {
  display: flex;
  min-height: 34px;
  align-items: center;
  justify-content: space-between;
  gap: 0.8rem;
  padding: 0.15rem 0.55rem 0.45rem;
  color: #8c6c83;
  font-size: 0.69rem;
  font-weight: 850;
  letter-spacing: 0.085em;
  text-transform: uppercase;
}

.attendance-select-menu__heading small {
  padding: 0.25rem 0.48rem;
  border: 1px solid #e8def8;
  border-radius: 999px;
  background: #f6f1ff;
  color: #7040d4;
  font-size: 0.66rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: none;
}

.attendance-select-option {
  display: flex;
  width: 100%;
  min-height: 64px;
  align-items: center;
  gap: 0.72rem;
  margin: 0 0 0.3rem;
  padding: 0.56rem 0.64rem;
  border: 1px solid transparent;
  border-radius: 15px;
  background: transparent;
  color: var(--attendance-ink);
  text-align: left;
  cursor: pointer;
  transition: transform 160ms ease, border-color 160ms ease, background 160ms ease, box-shadow 160ms ease;
}

.attendance-select-option:last-child {
  margin-bottom: 0;
}

.attendance-select-option:hover {
  border-color: rgb(112 64 212 / 17%);
  background: linear-gradient(105deg, rgb(248 243 255 / 92%), rgb(255 245 250 / 92%));
  box-shadow: 0 4px 12px rgb(74 42 84 / 5%);
  transform: translateY(-1px);
}

.attendance-select-option.is-selected {
  border-color: rgb(112 64 212 / 25%);
  background: linear-gradient(105deg, rgb(242 235 255 / 96%), rgb(255 239 247 / 92%));
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 80%), 0 4px 12px rgb(112 64 212 / 7%);
}

.attendance-select-option__number {
  display: grid;
  width: 41px;
  height: 41px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e8def9;
  border-radius: 13px;
  background: linear-gradient(145deg, #fff, #eee7ff 80%);
  color: #7040d4;
  font-size: 0.76rem;
  font-weight: 900;
  box-shadow: inset 0 1px 0 #fff, 0 2px 7px rgb(112 64 212 / 7%);
}

.attendance-select-option.is-selected .attendance-select-option__number {
  border-color: transparent;
  background: linear-gradient(145deg, #7040d4, #a82a76);
  color: #fff;
  box-shadow: 0 4px 9px rgb(112 64 212 / 21%);
}

.attendance-select-option__copy {
  display: grid;
  min-width: 0;
  flex: 1 1 auto;
  gap: 0.18rem;
}

.attendance-select-option__copy strong {
  overflow: hidden;
  color: #362938;
  font-size: 0.83rem;
  font-weight: 790;
  line-height: 1.35;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendance-select-option__copy small {
  color: #897b8d;
  font-size: 0.73rem;
  font-weight: 570;
}

.attendance-select-option__indicator {
  display: grid;
  width: 28px;
  height: 28px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #eee6f4;
  border-radius: 50%;
  background: rgb(255 255 255 / 82%);
  color: #a491ac;
  font-size: 1.1rem;
  font-weight: 700;
}

.attendance-select-option.is-selected .attendance-select-option__indicator {
  border-color: transparent;
  background: #7040d4;
  color: #fff;
  font-size: 0.8rem;
  box-shadow: 0 3px 8px rgb(112 64 212 / 20%);
}

.lesson-dropdown-enter-active,
.lesson-dropdown-leave-active {
  transform-origin: top center;
  transition: opacity 160ms ease, transform 160ms ease;
}

.lesson-dropdown-enter-from,
.lesson-dropdown-leave-to {
  opacity: 0;
  transform: translateY(-5px) scale(0.99);
}

/* Tarjetas de alumnos tipo glass: conserva el color de la cuerda vocal */
.attendance-card,
.attendance-card--present,
.attendance-card--absent,
.attendance-card--justified {
  border: 1px solid color-mix(in srgb, var(--voice-color) 22%, #ffffff);
  border-left: 4px solid var(--voice-color);
  border-radius: 20px;
  background:
    radial-gradient(ellipse at 100% 0%, color-mix(in srgb, var(--voice-soft) 39%, transparent), transparent 48%),
    linear-gradient(115deg, color-mix(in srgb, var(--voice-bg) 78%, transparent) 0%, rgb(255 255 255 / 77%) 65%, rgb(255 255 255 / 69%) 100%);
  -webkit-backdrop-filter: blur(16px) saturate(142%);
  backdrop-filter: blur(16px) saturate(142%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 92%),
    0 5px 18px rgb(42 30 49 / 5%),
    0 1px 3px rgb(42 30 49 / 3%);
}

.attendance-card:hover {
  border-color: color-mix(in srgb, var(--voice-color) 36%, #ffffff);
  border-left-color: var(--voice-color);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 96%),
    0 12px 28px color-mix(in srgb, var(--voice-color) 12%, transparent),
    0 3px 8px rgb(42 30 49 / 4%);
  transform: translateY(-2px);
}

.attendance-card__avatar {
  border: 1px solid color-mix(in srgb, var(--voice-color) 24%, #ffffff);
  background: linear-gradient(145deg, rgb(255 255 255 / 96%), color-mix(in srgb, var(--voice-bg) 79%, #ffffff));
  box-shadow: inset 0 1px 0 #fff, 0 4px 10px color-mix(in srgb, var(--voice-color) 9%, transparent);
}

.attendance-card__student span {
  border: 1px solid color-mix(in srgb, var(--voice-color) 17%, #ffffff);
  background: color-mix(in srgb, var(--voice-bg) 79%, rgb(255 255 255 / 76%));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 85%);
}

.attendance-card__statuses button {
  border-radius: 999px;
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 78%);
  font-weight: 760;
}

.attendance-card__note input {
  border-radius: 12px;
  border-color: color-mix(in srgb, var(--voice-color) 16%, #ffffff);
  background: rgb(255 255 255 / 66%);
  box-shadow: inset 0 1px 3px rgb(44 26 58 / 3%);
}

.attendance__summary article,
.attendance-status,
.attendance-history-toggle,
.attendance-history-card {
  border-radius: 19px;
  background: linear-gradient(135deg, rgb(255 255 255 / 89%), rgb(251 247 255 / 75%));
  -webkit-backdrop-filter: blur(14px) saturate(135%);
  backdrop-filter: blur(14px) saturate(135%);
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 92%), 0 6px 18px rgb(63 36 81 / 5%);
}

.attendance__summary article:hover {
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 96%), 0 11px 24px rgb(63 36 81 / 8%);
}

.attendance-edit-toggle,
.attendance-actions__save,
.attendance-history-card > button {
  border-radius: 999px;
  font-weight: 820;
}

.attendance-select-trigger:focus-visible,
.attendance-select-option:focus-visible {
  outline: 3px solid rgb(112 64 212 / 27%);
  outline-offset: 2px;
}

@media (max-width: 760px) {
  .attendance-select-trigger {
    min-height: 50px;
    gap: 0.45rem;
    padding-inline: 0.45rem;
  }

  .attendance-select-trigger__class {
    min-height: 28px;
    padding-inline: 0.52rem;
    font-size: 0.68rem;
  }

  .attendance-select-trigger__date {
    font-size: 0.78rem;
  }

  .attendance-select-menu {
    max-height: 54vh;
    border-radius: 18px;
  }

  .attendance-select-option {
    min-height: 60px;
    gap: 0.58rem;
    padding: 0.5rem;
    border-radius: 13px;
  }

  .attendance-select-option__number {
    width: 36px;
    height: 36px;
    border-radius: 11px;
  }

  .attendance-card,
  .attendance-card--present,
  .attendance-card--absent,
  .attendance-card--justified {
    border-radius: 18px;
    background:
      radial-gradient(ellipse at 100% 0%, color-mix(in srgb, var(--voice-soft) 35%, transparent), transparent 52%),
      linear-gradient(125deg, color-mix(in srgb, var(--voice-bg) 76%, transparent), rgb(255 255 255 / 78%));
  }
}

@media (prefers-reduced-motion: reduce) {
  .attendance-select-trigger,
  .attendance-select-option,
  .lesson-dropdown-enter-active,
  .lesson-dropdown-leave-active,
  .attendance-card {
    transition: none !important;
  }
}


/* =========================================================
   GLASS VOCAL V2 · tintes más visibles + monograma refinado
   No altera la lógica ni el comportamiento del registro.
========================================================= */
.attendance-list .attendance-card,
.attendance-list .attendance-card--present,
.attendance-list .attendance-card--absent,
.attendance-list .attendance-card--justified {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--voice-color) 27%, #ffffff);
  border-left: 4px solid color-mix(in srgb, var(--voice-color) 88%, #ffffff);
  border-radius: 22px;
  background:
    radial-gradient(ellipse at 2% 50%, color-mix(in srgb, var(--voice-color) 13%, transparent) 0%, transparent 56%),
    radial-gradient(ellipse at 100% 0%, color-mix(in srgb, var(--voice-soft) 62%, transparent) 0%, transparent 48%),
    linear-gradient(112deg,
      color-mix(in srgb, var(--voice-bg) 80%, rgb(255 255 255 / 52%)) 0%,
      rgb(255 255 255 / 67%) 61%,
      rgb(255 255 255 / 74%) 100%);
  -webkit-backdrop-filter: blur(18px) saturate(158%);
  backdrop-filter: blur(18px) saturate(158%);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 96%),
    inset 0 -1px 0 color-mix(in srgb, var(--voice-color) 8%, transparent),
    0 7px 20px color-mix(in srgb, var(--voice-color) 7%, transparent),
    0 2px 5px rgb(43 32 48 / 3%);
  transition: border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease;
}

.attendance-list .attendance-card::before {
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(125deg, rgb(255 255 255 / 55%) 0%, transparent 36%, transparent 78%, color-mix(in srgb, var(--voice-color) 5%, transparent) 100%);
  content: '';
  pointer-events: none;
}

.attendance-list .attendance-card:hover {
  border-color: color-mix(in srgb, var(--voice-color) 42%, #ffffff);
  border-left-color: var(--voice-color);
  box-shadow:
    inset 0 1px 0 #ffffff,
    0 13px 29px color-mix(in srgb, var(--voice-color) 13%, transparent),
    0 3px 8px rgb(43 32 48 / 4%);
  transform: translateY(-2px);
}

/* Avatar tipo medallón: el color vocal se reconoce incluso de reojo. */
.attendance-list .attendance-card__avatar {
  position: relative;
  display: grid;
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  place-items: center;
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--voice-color) 34%, #ffffff);
  border-radius: 50%;
  background:
    radial-gradient(circle at 29% 19%, rgb(255 255 255 / 96%) 0%, rgb(255 255 255 / 50%) 19%, transparent 44%),
    linear-gradient(145deg,
      color-mix(in srgb, var(--voice-color) 20%, #ffffff) 0%,
      color-mix(in srgb, var(--voice-soft) 76%, #ffffff) 52%,
      color-mix(in srgb, var(--voice-color) 13%, #ffffff) 100%);
  color: var(--voice-color);
  box-shadow:
    inset 0 1px 0 rgb(255 255 255 / 97%),
    inset 0 -3px 7px color-mix(in srgb, var(--voice-color) 9%, transparent),
    0 0 0 3px color-mix(in srgb, var(--voice-color) 8%, transparent),
    0 7px 16px color-mix(in srgb, var(--voice-color) 17%, transparent);
  isolation: isolate;
}

.attendance-list .attendance-card__avatar::before {
  position: absolute;
  inset: 4px;
  border: 1px solid rgb(255 255 255 / 65%);
  border-radius: inherit;
  content: '';
  pointer-events: none;
}

.attendance-list .attendance-card__avatar::after {
  position: absolute;
  top: 4px;
  left: 10px;
  width: 15px;
  height: 7px;
  border-radius: 50%;
  background: rgb(255 255 255 / 55%);
  content: '';
  filter: blur(1px);
  transform: rotate(-28deg);
  pointer-events: none;
}

.attendance-card__avatar-initials {
  position: relative;
  z-index: 1;
  display: block;
  max-width: 100%;
  padding-inline: 2px;
  color: var(--voice-color);
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.035em;
  line-height: 1;
  text-shadow: 0 1px 0 rgb(255 255 255 / 70%);
}

.attendance-list .attendance-card__student span {
  padding: 0.2rem 0.56rem;
  border: 1px solid color-mix(in srgb, var(--voice-color) 19%, #ffffff);
  border-radius: 999px;
  background: color-mix(in srgb, var(--voice-bg) 72%, rgb(255 255 255 / 80%));
  box-shadow: inset 0 1px 0 rgb(255 255 255 / 94%);
  color: var(--voice-color);
  font-size: 0.64rem;
  font-weight: 850;
  letter-spacing: 0.055em;
}

.attendance-list .attendance-card__student h3 {
  color: #28212d;
  font-weight: 800;
  letter-spacing: -0.018em;
}

.attendance-list .attendance-card__note input {
  border-color: color-mix(in srgb, var(--voice-color) 20%, #ffffff);
  border-radius: 13px;
  background: rgb(255 255 255 / 61%);
  box-shadow: inset 0 1px 2px rgb(39 29 47 / 3%), 0 1px 0 rgb(255 255 255 / 70%);
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}

.attendance-list .attendance-card__note input:focus-visible {
  border-color: color-mix(in srgb, var(--voice-color) 63%, #ffffff);
  background: rgb(255 255 255 / 88%);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--voice-color) 15%, transparent);
}

@media (max-width: 760px) {
  .attendance-list .attendance-card,
  .attendance-list .attendance-card--present,
  .attendance-list .attendance-card--absent,
  .attendance-list .attendance-card--justified {
    border-radius: 19px;
    background:
      radial-gradient(ellipse at 0% 0%, color-mix(in srgb, var(--voice-color) 12%, transparent), transparent 56%),
      linear-gradient(120deg, color-mix(in srgb, var(--voice-bg) 77%, rgb(255 255 255 / 50%)), rgb(255 255 255 / 75%));
  }

  .attendance-list .attendance-card__avatar {
    width: 44px;
    height: 44px;
    flex-basis: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .attendance-list .attendance-card,
  .attendance-list .attendance-card__avatar {
    transition: none !important;
  }
}

</style>
