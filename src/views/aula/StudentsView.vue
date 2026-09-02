<template>
  <section class="students">
    <header class="students__header">
      <div>
        <p class="students__eyebrow">
          Profesor · Aula Virtual
        </p>

        <h1>Alumnos</h1>

        <p>
          Revisa los estudiantes del curso, su clasificación vocal
          y administra sus cuentas de acceso al aula.
        </p>
      </div>

      <button
        type="button"
        class="students__add-button"
        @click="openCreateForm"
      >
        + Agregar alumno
      </button>
    </header>

    <!-- =========================================
         FORMULARIO NUEVO ALUMNO
    ========================================== -->

    <section
      v-if="showCreateForm"
      class="student-form"
    >
      <div class="student-form__header">
        <div>
          <span>Nueva matrícula</span>

          <h2>
            Crear estudiante y cuenta
          </h2>

          <p>
            El alumno podrá ingresar al Aula Virtual
            con su correo y contraseña.
          </p>
        </div>

        <button
          type="button"
          class="student-form__close"
          @click="closeCreateForm"
        >
          ×
        </button>
      </div>

      <form
        class="student-form__body"
        @submit.prevent="createStudent"
      >
        <label class="student-form__field">
          <span>Nombre completo</span>

          <input
            v-model.trim="studentForm.name"
            type="text"
            placeholder="Ej: Javiera González"
            autocomplete="name"
            required
          >
        </label>

        <label class="student-form__field">
          <span>Clasificación vocal</span>

          <select
            v-model="studentForm.voice"
            required
          >
            <option
              disabled
              value=""
            >
              Selecciona una voz
            </option>

            <option value="Soprano">
              Soprano
            </option>

            <option value="Alto">
              Alto
            </option>

            <option value="Tenor">
              Tenor
            </option>

            <option value="Bajo">
              Bajo
            </option>
          </select>
        </label>

        <label class="student-form__field">
          <span>Correo personal</span>

          <input
            v-model.trim="studentForm.email"
            type="email"
            placeholder="Ej: alumno@gmail.com"
            autocomplete="email"
            required
          >
        </label>

        <label class="student-form__field">
          <span>Contraseña temporal</span>

          <div class="password-field">
            <input
              v-model="studentForm.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Mínimo 8 caracteres"
              autocomplete="new-password"
              minlength="8"
              required
            >

            <button
              type="button"
              class="password-field__toggle"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Ocultar' : 'Ver' }}
            </button>
          </div>
        </label>

        <div class="student-form__notice">
          <strong>Cuenta de acceso</strong>

          <p>
            Guarda esta contraseña temporal para entregársela
            al estudiante. Su correo personal será su usuario
            para ingresar al Aula Virtual.
          </p>
        </div>

        <div
          v-if="formError"
          class="student-form__error"
        >
          {{ formError }}
        </div>

        <div class="student-form__actions">
          <button
            type="button"
            class="button-secondary"
            @click="closeCreateForm"
          >
            Cancelar
          </button>

          <button
            type="submit"
            class="button-primary"
            :disabled="isCreating"
          >
            {{
              isCreating
                ? 'Creando cuenta...'
                : 'Crear alumno'
            }}
          </button>
        </div>
      </form>
    </section>

    <!-- =========================================
         CARGANDO
    ========================================== -->

    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="loading-spinner"></div>

      <div>
        <strong>
          Cargando estudiantes...
        </strong>

        <p>
          Sincronizando alumnos desde Supabase.
        </p>
      </div>
    </section>

    <!-- =========================================
         ERROR DE CARGA
    ========================================== -->

    <section
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <span>!</span>

      <div>
        <h3>
          No pudimos cargar los alumnos
        </h3>

        <p>
          {{ loadError }}
        </p>

        <button
          type="button"
          @click="loadStudents"
        >
          Reintentar
        </button>
      </div>
    </section>

    <!-- =========================================
         CONTENIDO
    ========================================== -->

    <template v-else>
      <section class="students__summary">
        <article>
          <span>Total estudiantes</span>
          <strong>{{ students.length }}</strong>
        </article>

        <article>
          <span>Sopranos</span>
          <strong>{{ sopranoStudents.length }}</strong>
        </article>

        <article>
          <span>Altos</span>
          <strong>{{ altoStudents.length }}</strong>
        </article>

        <article>
          <span>Tenores</span>
          <strong>{{ tenorStudents.length }}</strong>
        </article>

        <article>
          <span>Bajos</span>
          <strong>{{ bassStudents.length }}</strong>
        </article>
      </section>

      <section
        v-for="group in voiceGroups"
        :key="group.voice"
        class="voice-section"
      >
        <div class="voice-section__title">
          <div>
            <p>
              {{ group.code }}
            </p>

            <h2>
              {{ group.voice }}
            </h2>
          </div>

          <span>
            {{ group.students.length }}
            {{
              group.students.length === 1
                ? 'estudiante'
                : 'estudiantes'
            }}
          </span>
        </div>

        <div
          v-if="group.students.length > 0"
          class="student-grid"
        >
          <article
            v-for="student in group.students"
            :key="student.id"
            class="student-card"
          >
            <div class="student-card__avatar">
              {{ getInitials(student.name) }}
            </div>

            <div class="student-card__content">
              <span>
                {{ student.voice }}
              </span>

              <h3>
                {{ student.name }}
              </h3>

              <p>
                Estudiante activo
              </p>
            </div>

            <div class="student-card__actions">
              <RouterLink
                :to="`/aula/estudiante/${student.id}`"
                class="student-card__button"
              >
                Ver perfil
              </RouterLink>

              <button
                type="button"
                class="student-card__remove"
                :disabled="
                  removingStudentId === student.id
                "
                @click="askRemoveStudent(student)"
              >
                {{
                  removingStudentId === student.id
                    ? 'Desactivando...'
                    : 'Desactivar'
                }}
              </button>
            </div>
          </article>
        </div>

        <div
          v-else
          class="empty-state"
        >
          No hay estudiantes registrados en esta voz.
        </div>
      </section>
    </template>

    <!-- =========================================
         MENSAJE ÉXITO
    ========================================== -->

    <Transition name="message">
      <div
        v-if="successMessage"
        class="students-message"
      >
        ✓ {{ successMessage }}
      </div>
    </Transition>

    <!-- =========================================
         MODAL DESACTIVAR
    ========================================== -->

    <div
      v-if="studentToRemove"
      class="modal"
      @click.self="cancelRemoveStudent"
    >
      <div class="modal__card">
        <span class="modal__eyebrow">
          Matrícula
        </span>

        <h2>
          ¿Desactivar alumno?
        </h2>

        <p>
          <strong>
            {{ studentToRemove.name }}
          </strong>

          dejará de aparecer como alumno activo.
        </p>

        <p class="modal__note">
          Su historial de asistencia, entregas,
          notas y ficha vocal no será eliminado.
        </p>

        <div class="modal__actions">
          <button
            type="button"
            class="button-secondary"
            @click="cancelRemoveStudent"
          >
            Cancelar
          </button>

          <button
            type="button"
            class="button-danger"
            :disabled="isRemoving"
            @click="confirmRemoveStudent"
          >
            {{
              isRemoving
                ? 'Desactivando...'
                : 'Sí, desactivar'
            }}
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  reactive,
  ref,
  onMounted,
} from 'vue'

import {
  RouterLink,
} from 'vue-router'

import {
  fetchStudents,
  removeStudent,
} from '@/services/studentService'

import {
  createStudentAccount,
} from '@/services/studentAccountService'

/* =========================================================
   DATOS
========================================================= */

const students = ref([])

const isLoading = ref(true)
const loadError = ref('')

const showCreateForm = ref(false)
const isCreating = ref(false)

const formError = ref('')
const successMessage = ref('')

const showPassword = ref(false)

const studentToRemove = ref(null)
const removingStudentId = ref(null)
const isRemoving = ref(false)

/* =========================================================
   FORMULARIO
========================================================= */

const studentForm = reactive({
  name: '',
  voice: '',
  email: '',
  password: '',
})

const resetStudentForm = () => {
  studentForm.name = ''
  studentForm.voice = ''
  studentForm.email = ''
  studentForm.password = ''

  showPassword.value = false
  formError.value = ''
}

const openCreateForm = () => {
  resetStudentForm()
  showCreateForm.value = true
}

const closeCreateForm = () => {
  if (isCreating.value) {
    return
  }

  showCreateForm.value = false
  resetStudentForm()
}

/* =========================================================
   CARGAR ESTUDIANTES
========================================================= */

const loadStudents = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    students.value =
      await fetchStudents()
  } catch (error) {
    console.error(
      'Error cargando estudiantes:',
      error,
    )

    students.value = []

    loadError.value =
      error?.message ||
      'No se pudieron cargar los estudiantes desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   CREAR ESTUDIANTE + CUENTA AUTH
========================================================= */

const createStudent = async () => {
  if (isCreating.value) {
    return
  }

  formError.value = ''

  if (!studentForm.name.trim()) {
    formError.value =
      'Debes ingresar el nombre del estudiante.'

    return
  }

  if (!studentForm.voice) {
    formError.value =
      'Debes seleccionar una clasificación vocal.'

    return
  }

  if (!studentForm.email.trim()) {
    formError.value =
      'Debes ingresar el correo del estudiante.'

    return
  }

  if (
    !studentForm.email.includes('@')
  ) {
    formError.value =
      'Debes ingresar un correo válido.'

    return
  }

  if (
    studentForm.password.length < 8
  ) {
    formError.value =
      'La contraseña debe tener al menos 8 caracteres.'

    return
  }

  isCreating.value = true

  try {
    const result =
      await createStudentAccount({
        name:
          studentForm.name,

        voice:
          studentForm.voice,

        email:
          studentForm.email,

        password:
          studentForm.password,
      })

    await loadStudents()

    showCreateForm.value = false

    const studentName =
      result?.student?.name ||
      studentForm.name

    resetStudentForm()

    successMessage.value =
      `${studentName} fue creado y su cuenta de acceso quedó lista.`

    window.setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    console.error(
      'Error creando cuenta de estudiante:',
      error,
    )

    formError.value =
      error?.message ||
      'No se pudo crear la cuenta del estudiante.'
  } finally {
    isCreating.value = false
  }
}

/* =========================================================
   DESACTIVAR ESTUDIANTE
========================================================= */

const askRemoveStudent = student => {
  studentToRemove.value =
    student
}

const cancelRemoveStudent = () => {
  if (isRemoving.value) {
    return
  }

  studentToRemove.value =
    null
}

const confirmRemoveStudent = async () => {
  if (
    !studentToRemove.value ||
    isRemoving.value
  ) {
    return
  }

  isRemoving.value = true

  removingStudentId.value =
    studentToRemove.value.id

  const studentName =
    studentToRemove.value.name

  try {
    await removeStudent(
      studentToRemove.value.id,
    )

    studentToRemove.value =
      null

    await loadStudents()

    successMessage.value =
      `${studentName} fue desactivado correctamente.`

    window.setTimeout(() => {
      successMessage.value = ''
    }, 3500)
  } catch (error) {
    console.error(
      'Error desactivando estudiante:',
      error,
    )

    window.alert(
      error?.message ||
      'No se pudo desactivar al estudiante.',
    )
  } finally {
    isRemoving.value = false
    removingStudentId.value = null
  }
}

/* =========================================================
   GRUPOS VOCALES
========================================================= */

const sopranoStudents = computed(() =>
  students.value.filter(
    student =>
      student.voice === 'Soprano',
  ),
)

const altoStudents = computed(() =>
  students.value.filter(
    student =>
      student.voice === 'Alto',
  ),
)

const tenorStudents = computed(() =>
  students.value.filter(
    student =>
      student.voice === 'Tenor',
  ),
)

const bassStudents = computed(() =>
  students.value.filter(
    student =>
      student.voice === 'Bajo',
  ),
)

const voiceGroups = computed(() => [
  {
    code: 'S',
    voice: 'Sopranos',
    students: sopranoStudents.value,
  },
  {
    code: 'A',
    voice: 'Altos',
    students: altoStudents.value,
  },
  {
    code: 'T',
    voice: 'Tenores',
    students: tenorStudents.value,
  },
  {
    code: 'B',
    voice: 'Bajos',
    students: bassStudents.value,
  },
])

/* =========================================================
   UTILIDADES
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
        word.charAt(0),
    )
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

/* =========================================================
   INICIO
========================================================= */

onMounted(
  loadStudents,
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.students {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.students__header {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-3xl;
}

.students__eyebrow {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.students__header h1 {
  margin-bottom: variables.$spacing-lg;
  font-size: clamp(3rem, 7vw, 5rem);
}

.students__header > div > p:last-child {
  max-width: 700px;
  opacity: 0.7;
}

.students__add-button,
.button-primary,
.button-secondary,
.button-danger {
  padding:
    variables.$spacing-md
    variables.$spacing-lg;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

.students__add-button,
.button-primary {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

.button-secondary {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
}

.button-danger {
  border:
    1px solid
    variables.$color-primary;
  background: transparent;
  color:
    variables.$color-primary;
}

button:disabled {
  cursor: wait;
  opacity: 0.6;
}

/* =========================================================
   FORMULARIO
========================================================= */

.student-form {
  margin-bottom:
    variables.$spacing-3xl;
  padding:
    variables.$spacing-xl;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.student-form__header {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom:
    variables.$spacing-xl;
}

.student-form__header span {
  display: block;
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  text-transform: uppercase;
}

.student-form__header h2 {
  margin-bottom:
    variables.$spacing-sm;
}

.student-form__header p {
  max-width: 650px;
  margin: 0;
  opacity: 0.6;
}

.student-form__close {
  border: 0;
  background: transparent;
  color:
    variables.$color-white;
  font-size: 2rem;
  cursor: pointer;
}

.student-form__body {
  display: grid;
  gap:
    variables.$spacing-lg;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
}

.student-form__field {
  display: grid;
  gap:
    variables.$spacing-sm;
}

.student-form__field > span {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
}

.student-form__field input,
.student-form__field select {
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

.student-form__field input:focus,
.student-form__field select:focus {
  border-color:
    variables.$color-primary;
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 85px;
}

.password-field__toggle {
  position: absolute;
  top: 50%;
  right:
    variables.$spacing-md;
  padding: 0;
  border: 0;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  cursor: pointer;
  transform: translateY(-50%);
}

.student-form__notice {
  grid-column:
    1 / -1;
  padding:
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
}

.student-form__notice strong {
  display: block;
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
}

.student-form__notice p {
  margin: 0;
  line-height: 1.6;
  opacity: 0.65;
}

.student-form__error {
  grid-column:
    1 / -1;
  padding:
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  color:
    variables.$color-primary;
}

.student-form__actions {
  display: flex;
  grid-column:
    1 / -1;
  gap:
    variables.$spacing-md;
  justify-content: flex-end;
}

/* =========================================================
   RESUMEN
========================================================= */

.students__summary {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));
  margin-bottom:
    variables.$spacing-3xl;
}

.students__summary article {
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

.students__summary span,
.students__summary strong {
  display: block;
}

.students__summary span {
  margin-bottom:
    variables.$spacing-sm;
  opacity: 0.55;
}

.students__summary strong {
  color:
    variables.$color-primary;
  font-size: 2rem;
}

/* =========================================================
   VOCES
========================================================= */

.voice-section {
  margin-bottom:
    variables.$spacing-3xl;
}

.voice-section__title {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap:
    variables.$spacing-lg;
  margin-bottom:
    variables.$spacing-xl;
  padding-bottom:
    variables.$spacing-md;
  border-bottom:
    1px solid
    variables.$color-border;
}

.voice-section__title p {
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  letter-spacing: 0.14em;
}

.voice-section__title h2 {
  margin: 0;
  font-size: 2rem;
}

.voice-section__title > span {
  opacity: 0.5;
  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   TARJETAS
========================================================= */

.student-grid {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
}

.student-card {
  display: grid;
  gap:
    variables.$spacing-lg;
  align-items: center;
  grid-template-columns:
    auto minmax(0, 1fr) auto;
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

.student-card__avatar {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
  font-weight:
    variables.$font-weight-bold;
}

.student-card__content span {
  display: block;
  margin-bottom:
    variables.$spacing-xs;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  font-weight:
    variables.$font-weight-semibold;
  text-transform: uppercase;
}

.student-card__content h3 {
  margin-bottom:
    variables.$spacing-xs;
}

.student-card__content p {
  margin: 0;
  opacity: 0.5;
}

.student-card__actions {
  display: grid;
  gap:
    variables.$spacing-sm;
}

.student-card__button,
.student-card__remove {
  min-width: 120px;
  padding:
    variables.$spacing-sm
    variables.$spacing-md;
  border-radius:
    variables.$radius-lg;
  font: inherit;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  text-align: center;
}

.student-card__button {
  border:
    1px solid
    variables.$color-primary;
  color:
    variables.$color-primary;
  text-decoration: none;
}

.student-card__button:hover {
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

.student-card__remove {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
  cursor: pointer;
  opacity: 0.6;
}

.student-card__remove:hover:not(:disabled) {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
  opacity: 1;
}

.empty-state {
  padding:
    variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
  opacity: 0.6;
}

/* =========================================================
   ESTADOS
========================================================= */

.state-card {
  display: flex;
  gap:
    variables.$spacing-lg;
  align-items: center;
  min-height: 180px;
  margin-bottom:
    variables.$spacing-3xl;
  padding:
    variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =========================================================
   MODAL
========================================================= */

.modal {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: grid;
  place-items: center;
  padding:
    variables.$spacing-lg;
  background:
    rgba(0, 0, 0, 0.75);
}

.modal__card {
  width: min(100%, 500px);
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

.modal__eyebrow {
  display: block;
  margin-bottom:
    variables.$spacing-sm;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  text-transform: uppercase;
}

.modal__card h2 {
  margin-bottom:
    variables.$spacing-lg;
}

.modal__card p {
  line-height: 1.6;
}

.modal__note {
  opacity: 0.6;
}

.modal__actions {
  display: flex;
  gap:
    variables.$spacing-md;
  justify-content: flex-end;
  margin-top:
    variables.$spacing-xl;
}

/* =========================================================
   MENSAJE
========================================================= */

.students-message {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1200;
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
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 950px) {
  .students__summary {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .students__header {
    align-items: flex-start;
    flex-direction: column;
  }
}

@media (max-width: 750px) {
  .student-grid {
    grid-template-columns: 1fr;
  }

  .student-form__body {
    grid-template-columns: 1fr;
  }

  .student-form__field,
  .student-form__notice,
  .student-form__error,
  .student-form__actions {
    grid-column: 1;
  }
}

@media (max-width: 600px) {
  .students__summary {
    grid-template-columns: 1fr;
  }

  .student-card {
    grid-template-columns:
      auto 1fr;
  }

  .student-card__actions {
    grid-column:
      1 / -1;
  }

  .voice-section__title {
    align-items: flex-start;
    flex-direction: column;
  }

  .students__add-button {
    width: 100%;
  }

  .student-form__actions,
  .modal__actions {
    flex-direction: column-reverse;
  }

  .student-form__actions button,
  .modal__actions button {
    width: 100%;
  }
}
</style>
