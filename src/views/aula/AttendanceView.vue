<template>
  <section class="attendance">

    <!-- =========================================================
         HEADER
    ========================================================== -->

    <header class="attendance__header">

      <p class="attendance__eyebrow">
        Profesor · Aula Virtual
      </p>

      <h1>
        Asistencia
      </h1>

      <p>
        Registra y administra la asistencia
        de los estudiantes clase por clase.
      </p>

    </header>

    <!-- =========================================================
         SELECTOR DE CLASE
    ========================================================== -->

    <section class="attendance__lesson-selector">

      <div class="attendance__lesson-selector-main">

        <label for="lesson">
          Clase
        </label>

        <select
          id="lesson"
          v-model.number="selectedLessonId"
          @change="changeLesson"
        >
          <option
            v-for="lesson in lessons"
            :key="lesson.id"
            :value="lesson.id"
          >
            Clase {{ lesson.id }} · {{ lesson.date }}
          </option>
        </select>

      </div>

      <div
        v-if="selectedLesson"
        class="attendance__lesson-info"
      >

        <strong>
          {{ selectedLesson.title }}
        </strong>

        <span>
          {{ selectedLesson.date }}
        </span>

      </div>

    </section>

    <!-- =========================================================
         ESTADO DEL REGISTRO
    ========================================================== -->

    <section
      class="attendance-status"
      :class="{
        'attendance-status--saved':
          lessonIsSaved
      }"
    >

      <div class="attendance-status__icon">
        {{ lessonIsSaved ? '✓' : '!' }}
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
          Marca la asistencia y guarda
          el registro cuando termines.
        </span>

      </div>

      <button
        v-if="lessonIsSaved && !isEditing"
        type="button"
        class="attendance-status__edit"
        @click="startEditing"
      >
        Editar asistencia
      </button>

    </section>

    <!-- =========================================================
         RESUMEN
    ========================================================== -->

    <section class="attendance__summary">

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

      <article>
        <span>
          Asistencia
        </span>

        <strong>
          {{ attendancePercentage }}%
        </strong>
      </article>

    </section>

    <!-- =========================================================
         BARRA
    ========================================================== -->

    <div class="attendance-progress">

      <div
        class="attendance-progress__bar"
        :style="{
          width:
            `${attendancePercentage}%`
        }"
      ></div>

    </div>

    <!-- =========================================================
         ESTUDIANTES
    ========================================================== -->

    <section class="attendance__content">

      <div class="attendance__title">

        <span>
          {{
            String(
              selectedLessonId
            ).padStart(2, '0')
          }}
        </span>

        <div>

          <p>
            Registro
          </p>

          <h2>
            Estudiantes
          </h2>

        </div>

      </div>

      <div class="attendance-list">

        <article
          v-for="student in draftRows"
          :key="student.id"
          class="attendance-card"
        >

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

          <!-- ESTADOS -->
          <div class="attendance-card__statuses">

            <button
              type="button"
              :disabled="!canEdit"
              :class="{
                active:
                  student.status ===
                  'present'
              }"
              @click="
                setDraftStatus(
                  student.id,
                  'present'
                )
              "
            >
              Presente
            </button>

            <button
              type="button"
              :disabled="!canEdit"
              :class="{
                active:
                  student.status ===
                  'absent'
              }"
              @click="
                setDraftStatus(
                  student.id,
                  'absent'
                )
              "
            >
              Ausente
            </button>

            <button
              type="button"
              :disabled="!canEdit"
              :class="{
                active:
                  student.status ===
                  'justified'
              }"
              @click="
                setDraftStatus(
                  student.id,
                  'justified'
                )
              "
            >
              Justificado
            </button>

          </div>

          <!-- OBSERVACIÓN -->
          <div class="attendance-card__note">

            <input
              v-model="student.notes"
              type="text"
              :disabled="!canEdit"
              placeholder="Observación opcional..."
            >

          </div>

        </article>

      </div>

    </section>

    <!-- =========================================================
         ACCIONES
    ========================================================== -->

    <section
      v-if="canEdit"
      class="attendance-actions"
    >

      <div class="attendance-actions__info">

        <strong>
          {{
            lessonIsSaved
              ? 'Editando registro existente'
              : 'Registro nuevo'
          }}
        </strong>

        <span>
          Los cambios no se guardarán
          hasta que confirmes.
        </span>

      </div>

      <div class="attendance-actions__buttons">

        <button
          v-if="lessonIsSaved"
          type="button"
          class="attendance-actions__cancel"
          @click="cancelEditing"
        >
          Cancelar cambios
        </button>

        <button
          type="button"
          class="attendance-actions__save"
          :disabled="isSaving"
          @click="saveAttendance"
        >
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

    <!-- MENSAJE -->
    <Transition name="message">

      <div
        v-if="successMessage"
        class="attendance-message"
      >
        ✓ {{ successMessage }}
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
   DATOS
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
   CLASE SELECCIONADA
========================================================= */

const selectedLesson = computed(() =>
  lessons.value.find(
    lesson =>
      Number(lesson.id) ===
      Number(selectedLessonId.value)
  )
)

/* =========================================================
   ¿YA EXISTE ASISTENCIA?
========================================================= */

const lessonIsSaved = computed(() =>
  lessonAttendance.value.some(
    record =>
      record.status === 'present' ||
      record.status === 'absent' ||
      record.status === 'justified'
  )
)

/* =========================================================
   PERMISO DE EDICIÓN
========================================================= */

const canEdit = computed(() =>
  !lessonIsSaved.value ||
  isEditing.value
)

/* =========================================================
   CARGAR DATOS INICIALES
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
   CARGAR ASISTENCIA DE LA CLASE
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
      'No se pudo cargar la asistencia.'
  } finally {
    isLoadingAttendance.value = false
  }
}

/* =========================================================
   CARGAR BORRADOR
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
   EDITAR REGISTRO GUARDADO
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
   CAMBIAR ESTADO
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
   GUARDAR EN SUPABASE
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
          student.notes
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
      'Asistencia guardada correctamente en Supabase.'

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

const presentCount = computed(() =>
  draftRows.value.filter(
    student =>
      student.status === 'present'
  ).length
)

const absentCount = computed(() =>
  draftRows.value.filter(
    student =>
      student.status === 'absent'
  ).length
)

const justifiedCount = computed(() =>
  draftRows.value.filter(
    student =>
      student.status === 'justified'
  ).length
)

const registeredCount = computed(() =>
  presentCount.value +
  absentCount.value +
  justifiedCount.value
)

const unregisteredCount = computed(() =>
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

const lastUpdate = computed(() => {
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

  if (
    dates.length === 0
  ) {
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

  return name
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

.attendance {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* =========================================================
   HEADER
========================================================= */

.attendance__header {
  margin-bottom:
    variables.$spacing-2xl;
}

.attendance__eyebrow {
  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.15em;

  text-transform:
    uppercase;
}

.attendance__header h1 {
  margin-bottom:
    variables.$spacing-md;

  font-size:
    clamp(
      3rem,
      7vw,
      5rem
    );
}

.attendance__header > p:last-child {
  max-width: 700px;

  opacity: 0.7;
}

/* =========================================================
   SELECTOR
========================================================= */

.attendance__lesson-selector {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: end;

  justify-content:
    space-between;

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

  width: 100%;
  max-width: 520px;

  gap:
    variables.$spacing-sm;
}

.attendance__lesson-selector label {
  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.attendance__lesson-selector select {
  width: 100%;

  padding:
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  outline: none;

  background:
    variables.$color-background;

  color:
    variables.$color-white;

  font: inherit;
}

.attendance__lesson-selector select:focus {
  border-color:
    variables.$color-primary;
}

.attendance__lesson-info {
  text-align: right;
}

.attendance__lesson-info strong,
.attendance__lesson-info span {
  display: block;
}

.attendance__lesson-info strong {
  margin-bottom:
    variables.$spacing-xs;
}

.attendance__lesson-info span {
  opacity: 0.5;
}

/* =========================================================
   ESTADO
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

.attendance-status--saved {
  border-color:
    variables.$color-primary;
}

.attendance-status__icon {
  display: grid;

  width: 44px;
  height: 44px;

  flex-shrink: 0;

  place-items: center;

  border-radius: 50%;

  background:
    variables.$color-primary;

  color:
    variables.$color-white;

  font-weight: 700;
}

.attendance-status__text {
  flex: 1;
}

.attendance-status__text strong,
.attendance-status__text span {
  display: block;
}

.attendance-status__text strong {
  margin-bottom:
    variables.$spacing-xs;
}

.attendance-status__text span {
  font-size:
    variables.$font-size-sm;

  opacity: 0.55;
}

.attendance-status__edit {
  padding:
    variables.$spacing-sm
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-primary;

  border-radius:
    variables.$radius-lg;

  background:
    transparent;

  color:
    variables.$color-primary;

  font: inherit;

  font-weight: 600;

  cursor: pointer;
}

/* =========================================================
   RESUMEN
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

.attendance__summary span,
.attendance__summary strong {
  display: block;
}

.attendance__summary span {
  margin-bottom:
    variables.$spacing-sm;

  opacity: 0.55;
}

.attendance__summary strong {
  color:
    variables.$color-primary;

  font-size: 1.8rem;
}

/* =========================================================
   PROGRESO
========================================================= */

.attendance-progress {
  overflow: hidden;

  height: 8px;

  margin-bottom:
    variables.$spacing-3xl;

  border-radius: 999px;

  background:
    variables.$color-border;
}

.attendance-progress__bar {
  height: 100%;

  border-radius: inherit;

  background:
    variables.$color-primary;

  transition:
    width 0.3s ease;
}

/* =========================================================
   TÍTULO
========================================================= */

.attendance__title {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;

  margin-bottom:
    variables.$spacing-xl;
}

.attendance__title > span {
  display: grid;

  width: 48px;
  height: 48px;

  place-items: center;

  border:
    1px solid
    variables.$color-primary;

  border-radius: 50%;

  color:
    variables.$color-primary;

  font-weight:
    variables.$font-weight-bold;
}

.attendance__title p {
  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  text-transform:
    uppercase;
}

.attendance__title h2 {
  margin: 0;
}

/* =========================================================
   TARJETAS
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
    auto
    minmax(150px, 1fr)
    minmax(360px, auto)
    minmax(180px, 1fr);

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

.attendance-card__avatar {
  display: grid;

  width: 52px;
  height: 52px;

  place-items: center;

  border-radius: 50%;

  background:
    variables.$color-primary;

  color:
    variables.$color-white;

  font-weight:
    variables.$font-weight-bold;
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

  text-transform:
    uppercase;
}

.attendance-card__student h3 {
  margin: 0;
}

/* =========================================================
   ESTADOS
========================================================= */

.attendance-card__statuses {
  display: flex;

  gap:
    variables.$spacing-sm;

  flex-wrap: wrap;
}

.attendance-card__statuses button {
  padding:
    variables.$spacing-sm
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius: 999px;

  background:
    transparent;

  color:
    variables.$color-white;

  font: inherit;

  font-size:
    variables.$font-size-sm;

  cursor: pointer;

  opacity: 0.6;
}

.attendance-card__statuses button:hover:not(:disabled) {
  border-color:
    variables.$color-primary;

  opacity: 1;
}

.attendance-card__statuses button.active {
  border-color:
    variables.$color-primary;

  background:
    variables.$color-primary;

  color:
    variables.$color-white;

  opacity: 1;
}

.attendance-card__statuses button:disabled {
  cursor: default;
}

/* =========================================================
   OBSERVACIÓN
========================================================= */

.attendance-card__note input {
  width: 100%;

  padding:
    variables.$spacing-sm
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  outline: none;

  background:
    variables.$color-background;

  color:
    variables.$color-white;

  font: inherit;

  font-size:
    variables.$font-size-sm;
}

.attendance-card__note input:focus {
  border-color:
    variables.$color-primary;
}

.attendance-card__note input:disabled {
  cursor: default;

  opacity: 0.6;
}

/* =========================================================
   ACCIONES
========================================================= */

.attendance-actions {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: center;

  justify-content:
    space-between;

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
    variables.$color-surface;
}

.attendance-actions__info strong,
.attendance-actions__info span {
  display: block;
}

.attendance-actions__info strong {
  margin-bottom:
    variables.$spacing-xs;
}

.attendance-actions__info span {
  opacity: 0.55;

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
  padding:
    variables.$spacing-md
    variables.$spacing-xl;

  border-radius:
    variables.$radius-lg;

  font: inherit;

  font-weight: 600;

  cursor: pointer;
}

.attendance-actions__cancel {
  border:
    1px solid
    variables.$color-border;

  background:
    transparent;

  color:
    variables.$color-white;
}

.attendance-actions__save {
  border:
    1px solid
    variables.$color-primary;

  background:
    variables.$color-primary;

  color:
    variables.$color-white;
}

/* =========================================================
   MENSAJE
========================================================= */

.attendance-message {
  position: fixed;

  right: 2rem;
  bottom: 2rem;

  z-index: 500;

  padding:
    variables.$spacing-md
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-primary;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;

  color:
    variables.$color-white;

  box-shadow:
    0 15px 50px
    rgba(0, 0, 0, 0.3);
}

.message-enter-active,
.message-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.message-enter-from,
.message-leave-to {
  opacity: 0;

  transform:
    translateY(10px);
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
      auto
      1fr;
  }

  .attendance-card__statuses,
  .attendance-card__note {
    grid-column:
      1 / -1;
  }

}

@media (max-width: 750px) {

  .attendance__lesson-selector,
  .attendance-status,
  .attendance-actions {
    align-items:
      stretch;

    flex-direction:
      column;
  }

  .attendance__lesson-info {
    text-align: left;
  }

  .attendance-status__edit {
    width: 100%;
  }

  .attendance-actions__buttons {
    flex-direction:
      column-reverse;
  }

  .attendance-actions__buttons button {
    width: 100%;
  }

}

@media (max-width: 700px) {

  .attendance__summary {
    grid-template-columns:
      1fr;
  }

  .attendance-card {
    grid-template-columns:
      auto
      1fr;
  }

  .attendance-card__statuses {
    display: grid;

    grid-template-columns:
      1fr;
  }

  .attendance-card__statuses button {
    width: 100%;
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
</style>
