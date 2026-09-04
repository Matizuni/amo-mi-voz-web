<template>
  <section class="attendance">
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

          <!-- =========================================================
               CABECERA ESTUDIANTES
          ========================================================== -->
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
