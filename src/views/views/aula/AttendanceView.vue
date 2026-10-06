<template>
  <section class="attendance amv-view-shell">
    <!-- =========================================================
         HEADER
    ========================================================== -->
    <header class="attendance__header">
      <div>
        <p class="attendance__eyebrow">
          Profesor · Aula Virtual
        </p>

        <h1>
          Asistencia
        </h1>

        <p class="attendance__description">
          Registra la asistencia de cada clase
          de forma rápida y ordenada.
        </p>
      </div>
    </header>

    <!-- =========================================================
         ESTADO DE CARGA
    ========================================================== -->
    <div
      v-if="isLoading"
      class="attendance-state attendance-state--loading"
      role="status"
      aria-live="polite"
    >
      <span class="attendance-spinner"></span>

      <div>
        <strong>
          Cargando asistencia
        </strong>

        <p>
          Estamos preparando las clases y estudiantes.
        </p>
      </div>
    </div>

    <template v-else>
      <!-- =========================================================
           ERROR
      ========================================================== -->
      <div
        v-if="errorMessage"
        class="attendance-alert attendance-alert--error"
        role="alert"
      >
        <div class="attendance-alert__icon">
          !
        </div>

        <div>
          <strong>
            No pudimos completar la acción
          </strong>

          <p>
            {{ errorMessage }}
          </p>
        </div>

        <button
          type="button"
          aria-label="Cerrar mensaje de error"
          @click="errorMessage = ''"
        >
          ×
        </button>
      </div>

      <!-- =========================================================
           SIN CLASES
      ========================================================== -->
      <div
        v-if="lessons.length === 0"
        class="attendance-state"
      >
        <div class="attendance-state__symbol">
          ♪
        </div>

        <div>
          <strong>
            Todavía no hay clases disponibles
          </strong>

          <p>
            Crea una clase para comenzar
            a registrar asistencia.
          </p>
        </div>
      </div>

      <template v-else>
        <!-- =========================================================
             SELECTOR
        ========================================================== -->
        <section class="attendance__lesson-selector">
          <div class="attendance__lesson-selector-main">
            <label for="lesson">
              Clase
            </label>

            <div class="attendance-select">
              <select
                id="lesson"
                v-model.number="selectedLessonId"
                :disabled="isLoadingAttendance"
                @change="changeLesson"
              >
                <option
                  v-for="lesson in lessons"
                  :key="lesson.id"
                  :value="lesson.id"
                >
                  {{ getLessonOptionLabel(lesson) }}
                </option>
              </select>
            </div>
          </div>

          <div
            v-if="selectedLesson"
            class="attendance__lesson-info"
          >
            <span>
              Clase {{ selectedLessonNumber }}
            </span>

            <strong>
              {{ cleanLessonTitle(selectedLesson.title) }}
            </strong>

            <small>
              {{ formatLessonDate(selectedLesson.date) }}
            </small>
          </div>
        </section>

        <!-- =========================================================
             NAVEGACIÓN CONTEXTUAL · V10
        ========================================================== -->
        <nav
          class="attendance-context-nav"
          aria-label="Secciones de asistencia"
        >
          <button
            type="button"
            :class="{ 'is-active': isAttendanceTab('resumen') }"
            @click="setAttendanceTab('resumen')"
          >
            <span>01</span>
            Resumen
          </button>

          <button
            type="button"
            :class="{ 'is-active': isAttendanceTab('registro') }"
            @click="setAttendanceTab('registro')"
          >
            <span>02</span>
            Tomar asistencia
            <small>{{ registeredCount }}/{{ students.length }}</small>
          </button>

          <button
            type="button"
            :class="{ 'is-active': isAttendanceTab('historial') }"
            @click="setAttendanceTab('historial')"
          >
            <span>03</span>
            Historial
          </button>
        </nav>


        <!-- =========================================================
             CARGANDO ASISTENCIA
        ========================================================== -->
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
          <!-- =========================================================
               ESTADO DEL REGISTRO
          ========================================================== -->
          <div v-show="isAttendanceTab('resumen')" class="attendance-panel attendance-panel--summary">
<section
            class="attendance-status"
            :class="{
              'attendance-status--saved': lessonIsSaved,
              'attendance-status--pending': !lessonIsSaved
            }"
          >
            <div class="attendance-status__icon">
              {{ lessonIsSaved ? '✓' : '•' }}
            </div>

            <div class="attendance-status__text">
              <strong>
                {{
                  lessonIsSaved
                    ? 'Asistencia guardada'
                    : 'Asistencia pendiente'
                }}
              </strong>

              <span v-if="lessonIsSaved">
                Última actualización:
                {{ formattedLastUpdate }}
              </span>

              <span v-else>
                Marca a los estudiantes y guarda
                cuando termines.
              </span>
            </div>

            <button
              v-if="lessonIsSaved && !isEditing"
              type="button"
              class="attendance-status__edit"
              @click="startEditing"
            >
              Editar
            </button>
          </section>

          <!-- =========================================================
               RESUMEN
          ========================================================== -->
          <section
            class="attendance__summary"
            aria-label="Resumen de asistencia"
          >
            <article class="summary-card summary-card--primary">
              <span>
                Asistencia
              </span>

              <strong>
                {{ attendancePercentage }}%
              </strong>
            </article>

            <article>
              <span>
                Presentes
              </span>

              <strong>
                {{ presentCount }}
              </strong>
            </article>

            <article>
              <span>
                Ausentes
              </span>

              <strong>
                {{ absentCount }}
              </strong>
            </article>

            <article>
              <span>
                Justificados
              </span>

              <strong>
                {{ justifiedCount }}
              </strong>
            </article>

            <article>
              <span>
                Sin registrar
              </span>

              <strong>
                {{ unregisteredCount }}
              </strong>
            </article>
          </section>

          <!-- =========================================================
               PROGRESO
          ========================================================== -->
          <div
            class="attendance-progress"
            :aria-label="`Asistencia: ${attendancePercentage}%`"
          >
            <div
              class="attendance-progress__bar"
              :style="{
                width: `${attendancePercentage}%`
              }"
            ></div>
          </div>

            <section class="attendance-overview">
              <article>
                <span>ESTADO DE LA CLASE</span>
                <strong>{{ lessonIsSaved ? 'Registro guardado' : 'Pendiente de registrar' }}</strong>
                <p>
                  {{
                    lessonIsSaved
                      ? `Última actualización: ${formattedLastUpdate}`
                      : 'Aún puedes completar la asistencia de esta clase.'
                  }}
                </p>
                <button type="button" @click="setAttendanceTab('registro')">
                  {{ lessonIsSaved ? 'Revisar registro →' : 'Tomar asistencia →' }}
                </button>
              </article>

              <article>
                <span>COBERTURA</span>
                <strong>{{ registeredCount }}/{{ students.length }}</strong>
                <p>Estudiantes con estado de asistencia registrado.</p>
                <button type="button" @click="setAttendanceTab('historial')">
                  Ver historial →
                </button>
              </article>
            </section>
          </div>


          <!-- =========================================================
               CABECERA ESTUDIANTES
          ========================================================== -->
          <div v-show="isAttendanceTab('registro')" class="attendance-panel attendance-panel--register">
<section class="attendance__content">
            <div class="attendance__toolbar">
              <div class="attendance__title">
                <span>
                  {{ formattedSelectedLessonNumber }}
                </span>

                <div>
                  <p>
                    Clase {{ selectedLessonNumber }}
                  </p>

                  <h2>
                    Estudiantes
                  </h2>
                </div>
              </div>

              <!-- ACCIONES RÁPIDAS -->
              <div
                v-if="canEdit && students.length"
                class="attendance__quick-actions"
              >
                <span>
                  Acciones rápidas
                </span>

                <div>
                  <button
                    type="button"
                    class="quick-action quick-action--present"
                    @click="markAllPresent"
                  >
                    <span aria-hidden="true">
                      ✓
                    </span>

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

            <!-- =========================================================
                 SIN ESTUDIANTES
            ========================================================== -->
            <div
              v-if="draftRows.length === 0"
              class="attendance-state attendance-state--compact"
            >
              <div class="attendance-state__symbol">
                +
              </div>

              <div>
                <strong>
                  No hay estudiantes matriculados
                </strong>

                <p>
                  Cuando existan estudiantes activos
                  aparecerán en esta lista.
                </p>
              </div>
            </div>

            <!-- =========================================================
                 LISTA
            ========================================================== -->
            <div
              v-else
              class="attendance-list"
            >
              <article
                v-for="student in draftRows"
                :key="student.id"
                class="attendance-card"
                :class="{
                  'attendance-card--present':
                    student.status === 'present',
                  'attendance-card--absent':
                    student.status === 'absent',
                  'attendance-card--justified':
                    student.status === 'justified'
                }"
              >
                <div class="attendance-card__identity">
                  <div class="attendance-card__avatar">
                    {{ getInitials(student.name) }}
                  </div>

                  <div class="attendance-card__student">
                    <span>
                      {{ student.voice }}
                    </span>

                    <h3>
                      {{ student.name }}
                    </h3>
                  </div>
                </div>

                <!-- ESTADOS -->
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
                    @click="
                      setDraftStatus(
                        student.id,
                        'present'
                      )
                    "
                  >
                    <span aria-hidden="true">
                      ✓
                    </span>

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
                    @click="
                      setDraftStatus(
                        student.id,
                        'absent'
                      )
                    "
                  >
                    <span aria-hidden="true">
                      ×
                    </span>

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
                    @click="
                      setDraftStatus(
                        student.id,
                        'justified'
                      )
                    "
                  >
                    <span aria-hidden="true">
                      !
                    </span>

                    Justificado
                  </button>
                </div>

                <!-- OBSERVACIÓN -->
                <div class="attendance-card__note">
                  <label
                    :for="`attendance-note-${student.id}`"
                  >
                    Observación
                  </label>

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

          <!-- =========================================================
               ACCIONES GUARDAR
          ========================================================== -->
          <section
            v-if="canEdit && draftRows.length"
            class="attendance-actions"
          >
            <div class="attendance-actions__info">
              <strong>
                {{
                  lessonIsSaved
                    ? 'Editando asistencia'
                    : 'Registro sin guardar'
                }}
              </strong>

              <span>
                {{
                  registeredCount
                }}
                de
                {{
                  students.length
                }}
                estudiantes registrados.
              </span>
            </div>

            <div class="attendance-actions__buttons">
              <button
                v-if="lessonIsSaved"
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

                {{
                  isSaving
                    ? 'Guardando...'
                    : lessonIsSaved
                      ? 'Guardar cambios'
                      : 'Guardar asistencia'
                }}
              </button>
            </div>
          </section>
          </div>

          <!-- =========================================================
               HISTORIAL · V10
          ========================================================== -->
          <section
            v-show="isAttendanceTab('historial')"
            class="attendance-panel attendance-history"
          >
            <header class="attendance-history__header">
              <div>
                <span>SEGUIMIENTO ACADÉMICO</span>
                <h2>Historial de asistencia</h2>
                <p>
                  Revisa rápidamente qué clases ya tienen registro
                  y cómo se distribuyó la asistencia.
                </p>
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
            >
              <span class="attendance-spinner"></span>
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

            <div
              v-else
              class="attendance-history__list"
            >
              <article
                v-for="item in attendanceHistory"
                :key="item.lesson.id"
                class="attendance-history-card"
                :class="{ 'is-pending': !item.saved }"
              >
                <div class="attendance-history-card__lesson">
                  <span>
                    CLASE {{ getAcademicLessonNumber(item.lesson) }}
                  </span>
                  <strong>
                    {{ cleanLessonTitle(item.lesson.title) }}
                  </strong>
                  <small>
                    {{ formatLessonDate(item.lesson.date) }}
                  </small>
                </div>

                <div class="attendance-history-card__stats">
                  <span>
                    <b>{{ item.present }}</b>
                    Presentes
                  </span>
                  <span>
                    <b>{{ item.absent }}</b>
                    Ausentes
                  </span>
                  <span>
                    <b>{{ item.justified }}</b>
                    Justificados
                  </span>
                </div>

                <div class="attendance-history-card__result">
                  <strong v-if="item.saved">
                    {{ item.percentage }}%
                  </strong>
                  <strong v-else>—</strong>
                  <small>
                    {{ item.saved ? 'Asistencia' : 'Sin registrar' }}
                  </small>
                </div>

                <button
                  type="button"
                  @click="
                    selectedLessonId = item.lesson.id;
                    changeLesson();
                    setAttendanceTab('registro')
                  "
                >
                  {{ item.saved ? 'Revisar' : 'Registrar' }}
                </button>
              </article>
            </div>
          </section>

        </template>
      </template>
    </template>

    <!-- =========================================================
         MENSAJE DE ÉXITO
    ========================================================== -->
    <Transition name="message">
      <div
        v-if="successMessage"
        class="attendance-message"
        role="status"
        aria-live="polite"
      >
        <span>
          ✓
        </span>

        {{ successMessage }}
      </div>
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

const isLoading = ref(true)
const isLoadingAttendance = ref(false)
const isSaving = ref(false)
const isEditing = ref(false)

const successMessage = ref('')
const errorMessage = ref('')

/* =========================================================
   NAVEGACIÓN CONTEXTUAL · V10
========================================================= */
const activeAttendanceTab = ref('resumen')
const isLoadingHistory = ref(false)
const historyLoaded = ref(false)
const attendanceHistory = ref([])

const isAttendanceTab = tab =>
  activeAttendanceTab.value === tab

const setAttendanceTab = async tab => {
  activeAttendanceTab.value = tab

  if (
    tab === 'historial' &&
    !historyLoaded.value
  ) {
    await loadAttendanceHistory()
  }
}

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
  computed(() =>
    !lessonIsSaved.value ||
    isEditing.value
  )

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
  isEditing.value = false
  successMessage.value = ''
  errorMessage.value = ''

  await loadAttendance()
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

onMounted(
  loadInitialData
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   PAGE
========================================================= */

.attendance {
  width: 100%;
  max-width: 1200px;

  margin: 0 auto;
  padding-bottom:
    variables.$spacing-4xl;
}

/* =========================================================
   HEADER
========================================================= */

.attendance__header {
  display: flex;

  align-items: end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-2xl;
}

.attendance__eyebrow {
  margin: 0 0
    variables.$spacing-sm;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.14em;

  text-transform:
    uppercase;
}

.attendance__header h1 {
  margin: 0;

  font-size:
    clamp(
      3rem,
      6vw,
      5.2rem
    );

  line-height:
    0.98;
}

.attendance__description {
  max-width: 620px;

  margin:
    variables.$spacing-lg
    0
    0;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-base;

  line-height:
    1.7;
}

/* =========================================================
   SELECTOR
========================================================= */

.attendance__lesson-selector {
  display: grid;

  gap:
    variables.$spacing-xl;

  align-items: end;

  margin-bottom:
    variables.$spacing-lg;

  padding:
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.attendance__lesson-selector-main {
  display: grid;

  gap:
    variables.$spacing-sm;
}

.attendance__lesson-selector label {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.attendance-select {
  position: relative;
}

.attendance-select::after {
  position: absolute;

  top: 50%;
  right: 1rem;

  content: '⌄';

  color:
    variables.$color-text-muted;

  pointer-events: none;

  transform:
    translateY(-58%);
}

.attendance__lesson-selector select {
  width: 100%;
  min-height:
    variables.$control-height-lg;

  padding:
    0
    3rem
    0
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-strong;

  border-radius:
    variables.$radius-md;

  outline: 0;

  appearance: none;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-background;

  font-size:
    variables.$font-size-base;

  cursor: pointer;

  transition:
    border-color
      variables.$transition-fast,
    box-shadow
      variables.$transition-fast;
}

.attendance__lesson-selector select:hover {
  border-color:
    variables.$color-border-primary;
}

.attendance__lesson-selector select:focus-visible {
  border-color:
    variables.$color-primary;

  box-shadow:
    0 0 0 3px
    rgba(
      variables.$color-primary,
      0.1
    );
}

.attendance__lesson-selector select:disabled {
  cursor: wait;
  opacity: 0.65;
}

.attendance__lesson-info {
  min-width: 0;
}

.attendance__lesson-info > span {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.08em;

  text-transform:
    uppercase;
}

.attendance__lesson-info strong {
  display: block;

  overflow: hidden;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.attendance__lesson-info small {
  display: block;

  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

@media (min-width: 850px) {
  .attendance__lesson-selector {
    grid-template-columns:
      minmax(300px, 1fr)
      minmax(220px, 0.65fr);
  }

  .attendance__lesson-info {
    text-align: right;
  }
}

/* =========================================================
   STATUS
========================================================= */

.attendance-status {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;

  margin-bottom:
    variables.$spacing-xl;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.attendance-status__icon {
  display: grid;

  width: 44px;
  height: 44px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 50%;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-bold;
}

.attendance-status--saved
.attendance-status__icon {
  color:
    variables.$color-success;

  background:
    variables.$color-success-soft;
}

.attendance-status--pending
.attendance-status__icon {
  color:
    variables.$color-warning;

  background:
    variables.$color-warning-soft;
}

.attendance-status__text {
  min-width: 0;
  flex: 1;
}

.attendance-status__text strong,
.attendance-status__text span {
  display: block;
}

.attendance-status__text strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-base;
}

.attendance-status__text span {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.attendance-status__edit {
  min-height:
    variables.$control-height-md;

  padding:
    0
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-strong;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    transparent;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  cursor: pointer;
}

.attendance-status__edit:hover {
  border-color:
    variables.$color-primary;
}

/* =========================================================
   SUMMARY
========================================================= */

.attendance__summary {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );

  margin-bottom:
    variables.$spacing-lg;
}

.attendance__summary article {
  min-width: 0;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.attendance__summary span,
.attendance__summary strong {
  display: block;
}

.attendance__summary span {
  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.attendance__summary strong {
  color:
    variables.$color-text-primary;

  font-size:
    clamp(
      1.5rem,
      3vw,
      2.15rem
    );

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

.attendance__summary
.summary-card--primary {
  border-color:
    variables.$color-border-primary;

  background:
    linear-gradient(
      145deg,
      rgba(
        variables.$color-primary,
        0.07
      ),
      variables.$color-surface
    );
}

.attendance__summary
.summary-card--primary strong {
  color:
    variables.$color-primary;
}

/* =========================================================
   PROGRESS
========================================================= */

.attendance-progress {
  overflow: hidden;

  height: 5px;

  margin-bottom:
    variables.$spacing-3xl;

  border-radius:
    variables.$radius-pill;

  background:
    variables.$color-border;
}

.attendance-progress__bar {
  height: 100%;

  border-radius: inherit;

  background:
    variables.$color-success;

  transition:
    width
      variables.$transition-normal;
}

/* =========================================================
   TOOLBAR
========================================================= */

.attendance__toolbar {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: center;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-xl;
}

.attendance__title {
  display: flex;

  min-width: 0;

  gap:
    variables.$spacing-md;

  align-items: center;
}

.attendance__title > span {
  display: grid;

  width: 50px;
  height: 50px;

  flex: 0 0 auto;

  place-items: center;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.04
    );

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

.attendance__title p {
  margin: 0 0
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.08em;

  text-transform:
    uppercase;
}

.attendance__title h2 {
  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-2xl;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.03em;
}

/* =========================================================
   QUICK ACTIONS
========================================================= */

.attendance__quick-actions {
  display: grid;

  gap:
    variables.$spacing-sm;

  justify-items: end;
}

.attendance__quick-actions > span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;
}

.attendance__quick-actions > div {
  display: flex;

  gap:
    variables.$spacing-sm;
}

.quick-action {
  min-height:
    variables.$control-height-md;

  padding:
    0
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-secondary;

  background:
    variables.$color-surface;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  cursor: pointer;
}

.quick-action:hover {
  border-color:
    variables.$color-border-strong;

  color:
    variables.$color-text-primary;
}

.quick-action--present {
  color:
    variables.$color-success;

  border-color:
    rgba(
      variables.$color-success,
      0.25
    );

  background:
    variables.$color-success-soft;
}

/* =========================================================
   CARDS
========================================================= */

.attendance-list {
  display: grid;

  gap:
    variables.$spacing-md;
}

.attendance-card {
  display: grid;

  gap:
    variables.$spacing-lg;

  align-items: center;

  grid-template-columns:
    minmax(190px, 0.8fr)
    minmax(390px, 1.3fr)
    minmax(170px, 0.75fr);

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;

  transition:
    border-color
      variables.$transition-fast,
    background-color
      variables.$transition-fast;
}

.attendance-card--present {
  border-color:
    rgba(
      variables.$color-success,
      0.18
    );
}

.attendance-card--absent {
  border-color:
    rgba(
      variables.$color-danger,
      0.18
    );
}

.attendance-card--justified {
  border-color:
    rgba(
      variables.$color-warning,
      0.18
    );
}

.attendance-card__identity {
  display: flex;

  min-width: 0;

  gap:
    variables.$spacing-md;

  align-items: center;
}

.attendance-card__avatar {
  display: grid;

  width: 48px;
  height: 48px;

  flex: 0 0 auto;

  place-items: center;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.07
    );

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.attendance-card__student {
  min-width: 0;
}

.attendance-card__student span {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.06em;

  text-transform:
    uppercase;
}

.attendance-card__student h3 {
  overflow: hidden;

  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-base;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.015em;

  text-overflow: ellipsis;
  white-space: nowrap;
}

/* =========================================================
   STATUS BUTTONS
========================================================= */

.attendance-card__statuses {
  display: flex;

  gap:
    variables.$spacing-sm;

  flex-wrap: wrap;
}

.attendance-card__statuses button {
  display: inline-flex;

  min-height: 42px;

  gap:
    variables.$spacing-xs;

  align-items: center;
  justify-content: center;

  padding:
    0
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-pill;

  color:
    variables.$color-text-secondary;

  background:
    transparent;

  font-size:
    0.82rem;

  font-weight:
    variables.$font-weight-medium;

  cursor: pointer;

  transition:
    color
      variables.$transition-fast,
    border-color
      variables.$transition-fast,
    background-color
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.attendance-card__statuses
button:hover:not(:disabled) {
  color:
    variables.$color-text-primary;

  border-color:
    variables.$color-border-strong;

  transform:
    translateY(-1px);
}

.attendance-card__statuses
button:disabled {
  cursor: default;
  opacity: 0.55;
}

.status-button--present.active {
  color:
    variables.$color-success;

  border-color:
    rgba(
      variables.$color-success,
      0.32
    );

  background:
    variables.$color-success-soft;
}

.status-button--absent.active {
  color:
    variables.$color-danger;

  border-color:
    rgba(
      variables.$color-danger,
      0.32
    );

  background:
    variables.$color-danger-soft;
}

.status-button--justified.active {
  color:
    variables.$color-warning;

  border-color:
    rgba(
      variables.$color-warning,
      0.32
    );

  background:
    variables.$color-warning-soft;
}

/* =========================================================
   NOTE
========================================================= */

.attendance-card__note {
  display: grid;

  gap:
    variables.$spacing-xs;
}

.attendance-card__note label {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;
}

.attendance-card__note input {
  width: 100%;
  min-height: 42px;

  padding:
    0
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  outline: 0;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-background;

  font-size:
    variables.$font-size-sm;

  transition:
    border-color
      variables.$transition-fast,
    box-shadow
      variables.$transition-fast;
}

.attendance-card__note input::placeholder {
  color:
    variables.$color-text-disabled;
}

.attendance-card__note input:focus-visible {
  border-color:
    variables.$color-primary;

  box-shadow:
    0 0 0 3px
    rgba(
      variables.$color-primary,
      0.09
    );
}

.attendance-card__note input:disabled {
  cursor: default;
  opacity: 0.6;
}

/* =========================================================
   SAVE AREA
========================================================= */

.attendance-actions {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: center;
  justify-content: space-between;

  margin-top:
    variables.$spacing-2xl;

  padding:
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface-elevated;
}

.attendance-actions__info strong,
.attendance-actions__info span {
  display: block;
}

.attendance-actions__info strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-base;
}

.attendance-actions__info span {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.attendance-actions__buttons {
  display: flex;

  gap:
    variables.$spacing-md;
}

.attendance-actions__cancel,
.attendance-actions__save {
  min-height:
    variables.$control-height-lg;

  padding:
    0
    variables.$spacing-xl;

  border-radius:
    variables.$radius-md;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  cursor: pointer;

  transition:
    transform
      variables.$transition-fast,
    opacity
      variables.$transition-fast;
}

.attendance-actions__cancel {
  border:
    1px solid
    variables.$color-border;

  color:
    variables.$color-text-primary;

  background:
    transparent;
}

.attendance-actions__save {
  display: inline-flex;

  gap:
    variables.$spacing-sm;

  align-items: center;
  justify-content: center;

  border:
    1px solid
    variables.$color-primary;

  color:
    variables.$color-black;

  background:
    variables.$color-primary;
}

.attendance-actions__save:hover:not(:disabled),
.attendance-actions__cancel:hover:not(:disabled) {
  transform:
    translateY(-1px);
}

.attendance-actions__save:disabled,
.attendance-actions__cancel:disabled {
  cursor: not-allowed;

  opacity: 0.5;
}

/* =========================================================
   ALERTS
========================================================= */

.attendance-alert {
  position: relative;

  display: flex;

  gap:
    variables.$spacing-md;

  align-items: flex-start;

  margin-bottom:
    variables.$spacing-lg;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.attendance-alert--error {
  border-color:
    rgba(
      variables.$color-danger,
      0.28
    );

  background:
    variables.$color-danger-soft;
}

.attendance-alert__icon {
  display: grid;

  width: 34px;
  height: 34px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-danger;

  background:
    rgba(
      variables.$color-danger,
      0.1
    );

  font-weight:
    variables.$font-weight-bold;
}

.attendance-alert strong {
  display: block;

  color:
    variables.$color-text-primary;
}

.attendance-alert p {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;
}

.attendance-alert > button {
  margin-left: auto;

  color:
    variables.$color-text-muted;

  background: transparent;

  font-size:
    1.4rem;

  cursor: pointer;
}

/* =========================================================
   EMPTY / LOADING
========================================================= */

.attendance-state {
  display: flex;

  gap:
    variables.$spacing-lg;

  align-items: center;

  padding:
    variables.$spacing-2xl;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.attendance-state--compact {
  padding:
    variables.$spacing-xl;
}

.attendance-state__symbol {
  display: grid;

  width: 48px;
  height: 48px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.08
    );
}

.attendance-state strong {
  color:
    variables.$color-text-primary;
}

.attendance-state p {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.attendance-inline-loading {
  display: flex;

  gap:
    variables.$spacing-sm;

  align-items: center;

  margin-bottom:
    variables.$spacing-lg;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   SPINNER
========================================================= */

.attendance-spinner {
  display: inline-block;

  width: 22px;
  height: 22px;

  flex: 0 0 auto;

  border:
    2px solid
    variables.$color-border-strong;

  border-top-color:
    variables.$color-primary;

  border-radius: 50%;

  animation:
    attendance-spin
    0.8s
    linear
    infinite;
}

.attendance-spinner--small {
  width: 16px;
  height: 16px;
}

.attendance-spinner--button {
  width: 15px;
  height: 15px;

  border-color:
    rgba(
      variables.$color-black,
      0.25
    );

  border-top-color:
    variables.$color-black;
}

@keyframes attendance-spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =========================================================
   SUCCESS TOAST
========================================================= */

.attendance-message {
  position: fixed;

  right: 2rem;
  bottom: 2rem;

  z-index: 500;

  display: flex;

  gap:
    variables.$spacing-sm;

  align-items: center;

  padding:
    variables.$spacing-md
    variables.$spacing-lg;

  border:
    1px solid
    rgba(
      variables.$color-success,
      0.3
    );

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-surface-elevated;

  box-shadow:
    variables.$shadow-lg;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;
}

.attendance-message span {
  color:
    variables.$color-success;
}

.message-enter-active,
.message-leave-active {
  transition:
    opacity
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;

  transform:
    translateY(8px);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .attendance__summary {
    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }

  .attendance-card {
    grid-template-columns:
      minmax(200px, 1fr)
      minmax(0, 1.5fr);
  }

  .attendance-card__note {
    grid-column:
      1 / -1;
  }
}

@media (max-width: 800px) {
  .attendance__toolbar,
  .attendance-actions,
  .attendance-status {
    align-items:
      stretch;

    flex-direction:
      column;
  }

  .attendance__toolbar {
    display: flex;
  }

  .attendance__quick-actions {
    justify-items:
      start;
  }

  .attendance-actions__buttons {
    width: 100%;
  }

  .attendance-actions__buttons button {
    flex: 1;
  }
}

@media (max-width: 700px) {
  .attendance {
    padding-bottom:
      variables.$spacing-3xl;
  }

  .attendance__header {
    margin-bottom:
      variables.$spacing-xl;
  }

  .attendance__header h1 {
    font-size:
      clamp(
        2.9rem,
        15vw,
        4.4rem
      );
  }

  .attendance__lesson-selector {
    padding:
      variables.$spacing-lg;
  }

  .attendance__summary {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .attendance__summary article {
    padding:
      variables.$spacing-md;
  }

  .attendance__summary
  .summary-card--primary {
    grid-column:
      1 / -1;
  }

  .attendance-card {
    grid-template-columns:
      1fr;

    padding:
      variables.$spacing-lg;
  }

  .attendance-card__statuses {
    display: grid;

    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }

  .attendance-card__statuses button {
    width: 100%;

    padding-inline:
      variables.$spacing-sm;
  }

  .attendance-card__note {
    grid-column:
      auto;
  }

  .attendance-actions__buttons {
    flex-direction:
      column-reverse;
  }

  .attendance-message {
    right:
      variables.$spacing-md;

    bottom:
      variables.$spacing-md;

    left:
      variables.$spacing-md;
  }
}

@media (max-width: 520px) {
  .attendance__summary {
    gap:
      variables.$spacing-sm;
  }

  .attendance__quick-actions,
  .attendance__quick-actions > div {
    width: 100%;
  }

  .attendance__quick-actions > div {
    display: grid;

    grid-template-columns:
      1fr 1fr;
  }

  .quick-action {
    width: 100%;
  }

  .attendance-card__statuses {
    grid-template-columns:
      1fr;
  }

  .attendance-card__statuses button {
    min-height:
      variables.$control-height-md;

    justify-content:
      flex-start;

    padding-inline:
      variables.$spacing-lg;
  }

  .attendance__title > span {
    width: 46px;
    height: 46px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .attendance-spinner {
    animation-duration:
      1.5s;
  }

  .attendance-card__statuses button,
  .attendance-actions__save,
  .attendance-actions__cancel {
    transition: none;
  }
}
</style>

<style lang="scss" scoped>
/* =========================================================
   V5.1 · LIGHT LMS PATCH
========================================================= */
.attendance {
  --amv-surface: #ffffff;
  --amv-soft: #f8fafc;
  --amv-ink: #172033;
  --amv-muted: #667085;
  --amv-border: #dbe3ee;
  --amv-wine: #9f1d4a;
  --amv-gold: #c99424;
  --amv-gold-soft: #fff4d6;
  --amv-green: #1f8a62;
  --amv-green-soft: #eef9f4;
  --amv-red: #b42318;
  --amv-red-soft: #fff4f2;
  color: var(--amv-ink);
}

.attendance__lesson-selector,
.attendance-status,
.attendance__summary article,
.attendance-card,
.attendance__toolbar,
.attendance-actions,
.attendance-state,
.attendance-alert,
.attendance-message {
  background: var(--amv-surface) !important;
  color: var(--amv-ink) !important;
  border-color: var(--amv-border) !important;
  box-shadow: 0 12px 30px rgba(23, 32, 51, 0.055) !important;
}

.attendance-select select,
.attendance-select {
  background: var(--amv-soft) !important;
  color: var(--amv-ink) !important;
  border-color: var(--amv-border) !important;
}

.attendance__lesson-selector label,
.attendance__lesson-info small,
.attendance-status__text span,
.attendance__summary span,
.attendance-card__identity small,
.attendance-card__note label,
.attendance-actions__info,
.attendance-state p {
  color: var(--amv-muted) !important;
}

.attendance__lesson-info strong,
.attendance-status__text strong,
.attendance-card__identity strong,
.attendance__summary strong {
  color: var(--amv-ink) !important;
}

.summary-card--primary {
  background: linear-gradient(145deg, var(--amv-green-soft), #ffffff) !important;
  border-color: #b8e2d1 !important;
}

.summary-card--primary strong { color: var(--amv-green) !important; }

.attendance-status--saved {
  background: var(--amv-green-soft) !important;
  border-color: #b8e2d1 !important;
}

.attendance-status--pending {
  background: #fffaf0 !important;
  border-color: #f0d99b !important;
}

.attendance-status__icon {
  background: #ffffff !important;
  color: var(--amv-green) !important;
  border: 1px solid #b8e2d1 !important;
}

.attendance-status__edit,
.attendance-actions__cancel {
  background: #ffffff !important;
  color: #344054 !important;
  border-color: var(--amv-border) !important;
}

.attendance-actions__save {
  background: var(--amv-wine) !important;
  border-color: var(--amv-wine) !important;
  color: #ffffff !important;
}

.attendance-card--present { border-left: 4px solid var(--amv-green) !important; }
.attendance-card--absent { border-left: 4px solid var(--amv-red) !important; }
.attendance-card--justified { border-left: 4px solid var(--amv-gold) !important; }

.status-button--present,
.status-button--absent,
.status-button--justified,
.quick-action {
  background: #ffffff !important;
  color: #344054 !important;
  border-color: var(--amv-border) !important;
}

.status-button--present.active,
.quick-action--present.active {
  background: var(--amv-green-soft) !important;
  color: var(--amv-green) !important;
  border-color: #9dd5bf !important;
}

.status-button--absent.active {
  background: var(--amv-red-soft) !important;
  color: var(--amv-red) !important;
  border-color: #f1b7b2 !important;
}

.status-button--justified.active {
  background: var(--amv-gold-soft) !important;
  color: #8a6510 !important;
  border-color: #e6c568 !important;
}

.attendance-card__avatar {
  background: #eef3f8 !important;
  color: #365f91 !important;
}

.attendance-card__note input,
.attendance-card__note textarea {
  background: var(--amv-soft) !important;
  color: var(--amv-ink) !important;
  border-color: var(--amv-border) !important;
}


/* =========================================================
   AMV LMS UI SYSTEM · ACADEMIC EXPERIENCE v1.0
   Sistema visual común para el SaaS
========================================================= */
.attendance {
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

.attendance :where(a, button, input, textarea, select, [role="button"]) {
  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
}

.attendance :where(a, button, input, textarea, select, [role="button"]):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.attendance :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.attendance :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

.attendance :where(table tbody tr) {
  transition: background-color .18s ease;
}

.attendance :where(table tbody tr):hover {
  background-color: rgba(159, 25, 69, .025);
}

.attendance :where(.card, [class*="-card"], [class*="__card"]) {
  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;
}

.attendance :where(.card, [class*="-card"], [class*="__card"]):hover {
  border-color: rgba(159, 25, 69, .16);
}

@media (prefers-reduced-motion: reduce) {
  .attendance *, .attendance *::before, .attendance *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* =========================================================
   AMV LMS · FLUID MOTION & PREMIUM INTERACTION v2.0
   Capa visual segura: no modifica lógica, datos ni estructura.
========================================================= */
.attendance {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.attendance :where(
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
  .attendance :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .attendance :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .attendance :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .attendance :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.attendance :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.attendance :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.attendance :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.attendance ::selection {
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
  .attendance,
  .attendance *,
  .attendance *::before,
  .attendance *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}


/* =========================================================
   CONTEXT NAVIGATION · V10
========================================================= */
.attendance-context-nav {
  position: sticky;
  top: 14px;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin: 0 0 26px;
  padding: 7px;
  border: 1px solid #dbe3ec;
  border-radius: 18px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 14px 36px rgba(20,32,51,.08);
  backdrop-filter: blur(16px);
}

.attendance-context-nav button {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 13px;
  padding: 10px 14px;
  background: transparent;
  color: #536176;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition: .2s ease;
}

.attendance-context-nav button > span {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 8px;
  background: #f2f5f8;
  color: #7a8798;
  font-size: 10px;
}

.attendance-context-nav button > small {
  padding: 3px 7px;
  border-radius: 999px;
  background: #f2f5f8;
  color: #667085;
  font-size: 11px;
}

.attendance-context-nav button:hover {
  transform: translateY(-1px);
  background: #faf7f8;
  color: #9f1945;
}

.attendance-context-nav button.is-active {
  background: #9f1945;
  color: #fff;
  box-shadow: 0 9px 22px rgba(159,25,69,.20);
}

.attendance-context-nav button.is-active > span,
.attendance-context-nav button.is-active > small {
  background: rgba(255,255,255,.16);
  color: #fff;
}

.attendance-panel {
  animation: attendancePanelIn .35s cubic-bezier(.2,.75,.25,1);
}

.attendance-overview {
  display: grid;
  grid-template-columns: repeat(2, minmax(0,1fr));
  gap: 16px;
  margin-top: 20px;
}

.attendance-overview article {
  padding: 22px;
  border: 1px solid #dbe3ec;
  border-radius: 18px;
  background: #fff;
}

.attendance-overview span,
.attendance-history__header > div:first-child > span {
  color: #9f1945;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .11em;
}

.attendance-overview strong {
  display: block;
  margin-top: 8px;
  color: #172033;
  font-size: 20px;
}

.attendance-overview p {
  min-height: 44px;
  color: #667085;
  line-height: 1.55;
}

.attendance-overview button,
.attendance-history-card > button {
  border: 0;
  background: transparent;
  color: #9f1945;
  font: inherit;
  font-size: 13px;
  font-weight: 900;
  cursor: pointer;
}

.attendance-history {
  padding: clamp(22px,3vw,32px);
  border: 1px solid #dbe3ec;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 16px 44px rgba(20,32,51,.07);
}

.attendance-history__header {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 22px;
  border-bottom: 1px solid #e5eaf0;
}

.attendance-history__header h2 {
  margin: 6px 0;
  color: #172033;
  font-size: clamp(24px,3vw,34px);
}

.attendance-history__header p {
  max-width: 650px;
  margin: 0;
  color: #667085;
  line-height: 1.6;
}

.attendance-history__metrics {
  display: flex;
  gap: 10px;
}

.attendance-history__metrics article {
  min-width: 125px;
  padding: 14px;
  border: 1px solid #dbe3ec;
  border-radius: 14px;
  background: #f8fafc;
}

.attendance-history__metrics small,
.attendance-history__metrics strong {
  display: block;
}

.attendance-history__metrics small {
  color: #667085;
  font-size: 11px;
}

.attendance-history__metrics strong {
  margin-top: 5px;
  color: #172033;
  font-size: 22px;
}

.attendance-history__list {
  display: grid;
  gap: 11px;
  margin-top: 20px;
}

.attendance-history-card {
  display: grid;
  grid-template-columns: minmax(210px,1.1fr) minmax(310px,1.4fr) 90px 90px;
  gap: 18px;
  align-items: center;
  padding: 17px;
  border: 1px solid #dbe3ec;
  border-radius: 16px;
  background: #fff;
}

.attendance-history-card.is-pending {
  background: #fafbfc;
  opacity: .82;
}

.attendance-history-card__lesson span,
.attendance-history-card__lesson strong,
.attendance-history-card__lesson small {
  display: block;
}

.attendance-history-card__lesson span {
  color: #9f1945;
  font-size: 10px;
  font-weight: 900;
  letter-spacing: .1em;
}

.attendance-history-card__lesson strong {
  margin: 4px 0;
  color: #172033;
}

.attendance-history-card__lesson small {
  color: #667085;
}

.attendance-history-card__stats {
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 8px;
}

.attendance-history-card__stats span {
  color: #667085;
  font-size: 11px;
}

.attendance-history-card__stats b {
  display: block;
  margin-bottom: 3px;
  color: #172033;
  font-size: 18px;
}

.attendance-history-card__result {
  text-align: center;
}

.attendance-history-card__result strong,
.attendance-history-card__result small {
  display: block;
}

.attendance-history-card__result strong {
  color: #2d8a63;
  font-size: 22px;
}

.attendance-history-card__result small {
  margin-top: 3px;
  color: #667085;
  font-size: 10px;
}

@keyframes attendancePanelIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .attendance-context-nav {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: minmax(170px,1fr);
    overflow-x: auto;
  }

  .attendance-overview {
    grid-template-columns: 1fr;
  }

  .attendance-history__header {
    flex-direction: column;
  }

  .attendance-history-card {
    grid-template-columns: 1fr;
  }

  .attendance-history-card__result {
    text-align: left;
  }

  .attendance-history__metrics {
    flex-wrap: wrap;
  }
}

@media (prefers-reduced-motion: reduce) {
  .attendance-context-nav button,
  .attendance-panel {
    animation: none !important;
    transition: none !important;
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
