<template>
  <section class="create-lesson">
    <RouterLink
      to="/aula/programa-formativo"
      class="create-lesson__back"
    >
      ← Volver al programa
    </RouterLink>

    <header class="create-lesson__header">
      <div>
        <p>
          Profesor · Gestión académica
        </p>

        <h1>
          Nueva clase
        </h1>

        <span>
          Crea una nueva sesión del programa
          y guárdala directamente en Supabase.
        </span>
      </div>

      <aside class="cloud-badge">
        <span>SUPABASE</span>
        <strong>En línea</strong>
      </aside>
    </header>

    <form
      class="lesson-form"
      @submit.prevent="submitLesson"
    >
      <!-- 01 -->

      <section class="form-section">
        <header class="form-section__header">
          <span>01</span>

          <div>
            <p>Información general</p>
            <h2>Datos de la clase</h2>
          </div>
        </header>

        <div class="form-group">
          <label for="title">
            Título
          </label>

          <input
            id="title"
            v-model.trim="form.title"
            type="text"
            required
            placeholder="Nombre de la nueva clase"
          >
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="date">
              Fecha
            </label>

            <input
              id="date"
              v-model.trim="form.date"
              type="text"
              required
              placeholder="5 de diciembre"
            >
          </div>

          <div class="form-group">
            <label for="time">
              Hora
            </label>

            <input
              id="time"
              v-model.trim="form.time"
              type="text"
              placeholder="18:00 — 21:00"
            >
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="duration">
              Duración
            </label>

            <input
              id="duration"
              v-model.trim="form.duration"
              type="text"
            >
          </div>

          <div class="form-group">
            <label for="status">
              Estado
            </label>

            <select
              id="status"
              v-model="form.status"
            >
              <option value="available">
                Disponible
              </option>

              <option value="planned">
                Planificada
              </option>

              <option value="published">
                Publicada
              </option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="modality">
              Modalidad
            </label>

            <select
              id="modality"
              v-model="form.modality"
            >
              <option value="Presencial">
                Presencial
              </option>

              <option value="Online">
                Online
              </option>

              <option value="Híbrida">
                Híbrida
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="location">
              Lugar
            </label>

            <input
              id="location"
              v-model.trim="form.location"
              type="text"
            >
          </div>
        </div>

        <div class="form-group">
          <label for="focus">
            Foco pedagógico
          </label>

          <input
            id="focus"
            v-model.trim="form.focus"
            type="text"
            placeholder="Ej. Afinación, ritmo y técnica vocal"
          >
        </div>

        <div class="form-group">
          <label for="description">
            Descripción
          </label>

          <textarea
            id="description"
            v-model.trim="form.description"
            rows="5"
            placeholder="Descripción general de la clase..."
          ></textarea>
        </div>
      </section>

      <!-- 02 -->

      <section class="form-section">
        <header class="form-section__header">
          <span>02</span>

          <div>
            <p>Aprendizaje</p>
            <h2>Objetivos</h2>
          </div>
        </header>

        <div class="form-group">
          <label for="objectives">
            Objetivos de aprendizaje
          </label>

          <textarea
            id="objectives"
            v-model="form.objectives"
            rows="7"
            placeholder="Un objetivo por línea"
          ></textarea>

          <small>
            Un objetivo por línea.
          </small>
        </div>
      </section>

      <!-- 03 -->

      <section class="form-section">
        <header class="form-section__header">
          <span>03</span>

          <div>
            <p>Contenido</p>
            <h2>Materias de la clase</h2>
          </div>
        </header>

        <div class="form-group">
          <label for="contents">
            Contenidos
          </label>

          <textarea
            id="contents"
            v-model="form.contents"
            rows="8"
            placeholder="Un contenido por línea"
          ></textarea>
        </div>
      </section>

      <!-- 04 -->

      <section class="form-section">
        <header class="form-section__header">
          <span>04</span>

          <div>
            <p>Aplicación</p>
            <h2>Actividades</h2>
          </div>
        </header>

        <div class="form-group">
          <label for="activities">
            Actividades prácticas
          </label>

          <textarea
            id="activities"
            v-model="form.activities"
            rows="7"
            placeholder="Una actividad por línea"
          ></textarea>
        </div>
      </section>

      <!-- 05 -->

      <section class="form-section">
        <header class="form-section__header">
          <span>05</span>

          <div>
            <p>Interpretación</p>
            <h2>Repertorio</h2>
          </div>
        </header>

        <div class="form-group">
          <label for="repertoire">
            Repertorio
          </label>

          <textarea
            id="repertoire"
            v-model="form.repertoire"
            rows="6"
            placeholder="Una obra por línea"
          ></textarea>
        </div>
      </section>

      <!-- 06 -->

      <section class="form-section">
        <header class="form-section__header">
          <span>06</span>

          <div>
            <p>Profesor</p>
            <h2>Apoyo y observaciones</h2>
          </div>
        </header>

        <div class="form-group">
          <label for="supportMaterials">
            Material de apoyo
          </label>

          <textarea
            id="supportMaterials"
            v-model.trim="form.supportMaterials"
            rows="4"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="notes">
            Notas del profesor
          </label>

          <textarea
            id="notes"
            v-model.trim="form.notes"
            rows="5"
          ></textarea>
        </div>
      </section>

      <!-- PREVIEW -->

      <section class="lesson-preview">
        <span>
          VISTA PREVIA
        </span>

        <h2>
          {{
            form.title ||
            'Nueva clase'
          }}
        </h2>

        <p class="lesson-preview__date">
          {{
            form.date ||
            'Fecha por definir'
          }}
        </p>

        <p>
          {{
            form.description ||
            'Sin descripción todavía.'
          }}
        </p>

        <div class="lesson-preview__stats">
          <article>
            <strong>
              {{ objectiveList.length }}
            </strong>

            <span>
              Objetivos
            </span>
          </article>

          <article>
            <strong>
              {{ contentList.length }}
            </strong>

            <span>
              Contenidos
            </span>
          </article>

          <article>
            <strong>
              {{ activityList.length }}
            </strong>

            <span>
              Actividades
            </span>
          </article>

          <article>
            <strong>
              {{ repertoireList.length }}
            </strong>

            <span>
              Repertorio
            </span>
          </article>
        </div>
      </section>

      <!-- ERROR -->

      <div
        v-if="errorMessage"
        class="form-error"
      >
        <span>!</span>

        <div>
          <strong>
            No pudimos crear la clase
          </strong>

          <p>
            {{ errorMessage }}
          </p>
        </div>
      </div>

      <!-- ACCIONES -->

      <footer class="form-actions">
        <RouterLink
          to="/aula/programa-formativo"
          class="cancel-button"
        >
          Cancelar
        </RouterLink>

        <button
          type="submit"
          class="save-button"
          :disabled="
            isSaving ||
            !form.title.trim() ||
            !form.date.trim()
          "
        >
          {{
            isSaving
              ? 'Creando clase...'
              : 'Crear clase'
          }}
        </button>
      </footer>
    </form>
  </section>
</template>

<script setup>
import {
  computed,
  reactive,
  ref
} from 'vue'

import {
  RouterLink,
  useRouter
} from 'vue-router'

import {
  insertLesson
} from '@/services/lessonService'

const router = useRouter()

const isSaving = ref(false)
const errorMessage = ref('')

const form = reactive({
  title: '',
  date: '',
  time: '',
  duration: '3 horas',
  status: 'available',
  modality: 'Presencial',
  location: 'Academia Amo Mi Voz',
  focus: '',
  description: '',
  objectives: '',
  contents: '',
  activities: '',
  repertoire: '',
  supportMaterials: '',
  notes: ''
})

const parseLines = value => {
  return String(value || '')
    .split('\n')
    .map(item =>
      item.trim()
    )
    .filter(Boolean)
}

const objectiveList =
  computed(() =>
    parseLines(
      form.objectives
    )
  )

const contentList =
  computed(() =>
    parseLines(
      form.contents
    )
  )

const activityList =
  computed(() =>
    parseLines(
      form.activities
    )
  )

const repertoireList =
  computed(() =>
    parseLines(
      form.repertoire
    )
  )

const submitLesson = async () => {
  if (
    !form.title.trim() ||
    !form.date.trim()
  ) {
    return
  }

  isSaving.value = true
  errorMessage.value = ''

  try {
    const created =
      await insertLesson({
        title:
          form.title.trim(),

        date:
          form.date.trim(),

        time:
          form.time.trim(),

        duration:
          form.duration.trim(),

        status:
          form.status,

        modality:
          form.modality,

        location:
          form.location.trim(),

        focus:
          form.focus.trim(),

        description:
          form.description.trim(),

        objectives:
          objectiveList.value,

        contents:
          contentList.value,

        activities:
          activityList.value,

        repertoire:
          repertoireList.value,

        supportMaterials:
          form.supportMaterials.trim(),

        notes:
          form.notes.trim()
      })

    router.push(
      `/aula/clase/${created.id}/editar`
    )
  } catch (error) {
    console.error(
      'Error creando clase:',
      error
    )

    errorMessage.value =
      error?.message ||
      'No se pudo guardar la nueva clase.'
  } finally {
    isSaving.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.create-lesson {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
}

.create-lesson__back {
  display: inline-block;
  margin-bottom: variables.$spacing-xl;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.create-lesson__header {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-3xl;
}

.create-lesson__header > div {
  max-width: 800px;
}

.create-lesson__header p {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.create-lesson__header h1 {
  margin-bottom: variables.$spacing-md;
  font-size:
    clamp(
      3rem,
      6vw,
      5rem
    );
}

.create-lesson__header span {
  opacity: 0.65;
}

.cloud-badge {
  min-width: 150px;
  padding: variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.cloud-badge span,
.cloud-badge strong {
  display: block;
}

.cloud-badge span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.lesson-form {
  display: grid;
  gap: variables.$spacing-xl;
}

.form-section {
  padding: variables.$spacing-2xl;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.form-section__header {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-bottom: variables.$spacing-xl;
}

.form-section__header > span {
  display: grid;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
}

.form-section__header p {
  margin: 0;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  text-transform: uppercase;
}

.form-section__header h2 {
  margin:
    3px
    0
    0;
}

.form-group {
  display: grid;
  gap: variables.$spacing-sm;
  margin-bottom: variables.$spacing-lg;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  outline: none;
  background: variables.$color-background;
  color: variables.$color-white;
  font: inherit;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: variables.$color-primary;
}

.form-group textarea {
  line-height: 1.6;
  resize: vertical;
}

.form-group small {
  opacity: 0.45;
}

.form-row {
  display: grid;
  gap: variables.$spacing-lg;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

.lesson-preview {
  padding: variables.$spacing-2xl;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.lesson-preview > span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.lesson-preview h2 {
  margin:
    variables.$spacing-md
    0
    variables.$spacing-sm;
}

.lesson-preview__date {
  color: variables.$color-primary;
}

.lesson-preview > p:last-of-type {
  opacity: 0.6;
}

.lesson-preview__stats {
  display: grid;
  gap: variables.$spacing-sm;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  margin-top: variables.$spacing-xl;
}

.lesson-preview__stats article {
  padding: variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.lesson-preview__stats strong,
.lesson-preview__stats span {
  display: block;
}

.lesson-preview__stats strong {
  color: variables.$color-primary;
  font-size: 1.5rem;
}

.lesson-preview__stats span {
  font-size: variables.$font-size-xs;
  opacity: 0.45;
}

.form-error {
  display: flex;
  gap: variables.$spacing-md;
  align-items: flex-start;
  padding: variables.$spacing-lg;
  border:
    1px solid
    #d85151;
  border-radius: variables.$radius-lg;
  background:
    rgba(
      216,
      81,
      81,
      0.07
    );
}

.form-error > span {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    #d85151;
  border-radius: 50%;
  color: #ff7777;
}

.form-error strong {
  color: #ff7777;
}

.form-error p {
  margin:
    4px
    0
    0;
  opacity: 0.65;
}

.form-actions {
  display: flex;
  gap: variables.$spacing-md;
  justify-content: flex-end;
  padding: variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.cancel-button,
.save-button {
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
}

.cancel-button {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color: variables.$color-white;
}

.save-button {
  border:
    1px solid
    variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.save-button:disabled {
  opacity: 0.4;
  cursor: default;
}

@media (max-width: 800px) {
  .create-lesson__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .cloud-badge {
    width: 100%;
  }

  .lesson-preview__stats {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 700px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-section,
  .lesson-preview {
    padding: variables.$spacing-xl;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-button,
  .save-button {
    width: 100%;
    text-align: center;
  }
}
</style>