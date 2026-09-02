<template>
  <section class="edit-lesson">
    <RouterLink
      to="/aula/programa-formativo"
      class="edit-lesson__back"
    >
      ← Volver al programa
    </RouterLink>

    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="spinner"></div>

      <h2>Cargando clase...</h2>

      <p>
        Obteniendo información desde Supabase.
      </p>
    </section>

    <section
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <div class="state-card__icon">
        !
      </div>

      <h2>
        No se pudo cargar la clase
      </h2>

      <p>
        {{ loadError }}
      </p>

      <button
        type="button"
        @click="loadLesson"
      >
        Reintentar
      </button>
    </section>

    <template v-else-if="lesson">
      <header class="edit-lesson__header">
        <div>
          <p class="edit-lesson__eyebrow">
            Profesor · Gestión académica
          </p>

          <h1>
            Editar Clase
            {{
              String(lesson.id)
                .padStart(2, '0')
            }}
          </h1>

          <p class="edit-lesson__subtitle">
            Modifica la planificación completa
            de esta clase.
          </p>
        </div>

        <aside class="lesson-number">
          <span>CLASE</span>

          <strong>
            {{
              String(lesson.id)
                .padStart(2, '0')
            }}
          </strong>
        </aside>
      </header>

      <form
        class="lesson-form"
        @submit.prevent="saveChanges"
      >
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

                <option value="completed">
                  Realizada
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
              placeholder="Ej. Ritmo, afinación y técnica vocal"
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
            ></textarea>
          </div>
        </section>

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
              rows="8"
              placeholder="Un objetivo por línea"
            ></textarea>

            <small>
              Un objetivo por línea.
            </small>
          </div>
        </section>

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
              rows="9"
              placeholder="Un contenido por línea"
            ></textarea>
          </div>
        </section>

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
              rows="8"
              placeholder="Una actividad por línea"
            ></textarea>
          </div>
        </section>

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
              rows="7"
              placeholder="Una obra por línea"
            ></textarea>
          </div>
        </section>

        <section class="form-section">
          <header class="form-section__header">
            <span>06</span>

            <div>
              <p>Profesor</p>
              <h2>Observaciones</h2>
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
              rows="6"
            ></textarea>
          </div>
        </section>

        <section class="lesson-preview">
          <span>
            VISTA PREVIA
          </span>

          <h2>
            {{ form.title }}
          </h2>

          <p class="lesson-preview__date">
            {{ form.date }}
          </p>

          <p>
            {{ form.description }}
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

        <footer class="form-actions">
          <div>
            <span
              class="change-dot"
              :class="{
                'change-dot--active':
                  hasChanges
              }"
            ></span>

            <small>
              {{
                hasChanges
                  ? 'Cambios sin guardar'
                  : 'Sin cambios pendientes'
              }}
            </small>
          </div>

          <div class="form-actions__buttons">
            <button
              type="button"
              class="secondary-button"
              :disabled="!hasChanges"
              @click="resetForm"
            >
              Restaurar
            </button>

            <RouterLink
              to="/aula/programa-formativo"
              class="secondary-button"
            >
              Cancelar
            </RouterLink>

            <button
              type="submit"
              class="primary-button"
              :disabled="
                isSaving ||
                !hasChanges
              "
            >
              {{
                isSaving
                  ? 'Guardando...'
                  : 'Guardar cambios'
              }}
            </button>
          </div>
        </footer>
      </form>
    </template>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'

import {
  RouterLink,
  useRoute,
  useRouter
} from 'vue-router'

import {
  fetchLessonById,
  updateLesson
} from '@/services/lessonService'

const route = useRoute()
const router = useRouter()

const lesson = ref(null)

const isLoading = ref(true)
const isSaving = ref(false)
const loadError = ref('')

const form = reactive({
  title: '',
  date: '',
  time: '',
  duration: '',
  status: 'available',
  modality: 'Presencial',
  location: '',
  focus: '',
  description: '',
  objectives: '',
  contents: '',
  activities: '',
  repertoire: '',
  supportMaterials: '',
  notes: ''
})

const originalForm = ref({})

const toMultiline = value => {
  if (Array.isArray(value)) {
    return value.join('\n')
  }

  return value || ''
}

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

const hasChanges =
  computed(() => {
    return JSON.stringify(form) !==
      JSON.stringify(
        originalForm.value
      )
  })

const fillForm = data => {
  form.title =
    data.title || ''

  form.date =
    data.date || ''

  form.time =
    data.time || ''

  form.duration =
    data.duration || ''

  form.status =
    data.status || 'available'

  form.modality =
    data.modality || 'Presencial'

  form.location =
    data.location || ''

  form.focus =
    data.focus || ''

  form.description =
    data.description || ''

  form.objectives =
    toMultiline(
      data.objectives
    )

  form.contents =
    toMultiline(
      data.contents
    )

  form.activities =
    toMultiline(
      data.activities
    )

  form.repertoire =
    toMultiline(
      data.repertoire
    )

  form.supportMaterials =
    data.support_materials || ''

  form.notes =
    data.notes || ''

  originalForm.value =
    JSON.parse(
      JSON.stringify(form)
    )
}

const loadLesson = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const data =
      await fetchLessonById(
        route.params.id
      )

    lesson.value =
      data

    fillForm(data)
  } catch (error) {
    console.error(
      'Error cargando clase:',
      error
    )

    loadError.value =
      error?.message ||
      'No se pudo cargar la clase.'
  } finally {
    isLoading.value = false
  }
}

const resetForm = () => {
  Object.assign(
    form,
    JSON.parse(
      JSON.stringify(
        originalForm.value
      )
    )
  )
}

const saveChanges = async () => {
  if (
    !lesson.value ||
    !form.title.trim()
  ) {
    return
  }

  isSaving.value = true

  try {
    const updated =
      await updateLesson(
        lesson.value.id,
        {
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
        }
      )

    lesson.value =
      updated

    fillForm(updated)

    router.push(
      '/aula/programa-formativo'
    )
  } catch (error) {
    console.error(
      'Error guardando clase:',
      error
    )

    window.alert(
      error?.message ||
      'No se pudieron guardar los cambios.'
    )
  } finally {
    isSaving.value = false
  }
}

watch(
  () => route.params.id,
  () => {
    loadLesson()
  }
)

onMounted(() => {
  loadLesson()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.edit-lesson {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
}

.edit-lesson__back {
  display: inline-block;
  margin-bottom: variables.$spacing-xl;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.edit-lesson__header {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-3xl;
}

.edit-lesson__header > div {
  max-width: 800px;
}

.edit-lesson__eyebrow {
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.edit-lesson__header h1 {
  margin:
    variables.$spacing-sm
    0
    variables.$spacing-md;
  font-size:
    clamp(
      3rem,
      6vw,
      5rem
    );
}

.edit-lesson__subtitle {
  opacity: 0.6;
}

.lesson-number {
  display: grid;
  width: 130px;
  height: 130px;
  flex-shrink: 0;
  place-items: center;
  align-content: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
}

.lesson-number span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.lesson-number strong {
  color: variables.$color-primary;
  font-size: 2.5rem;
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

.form-actions {
  position: sticky;
  bottom: 10px;
  z-index: 30;
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  justify-content: space-between;
  padding: variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    rgba(
      18,
      18,
      18,
      0.96
    );
  backdrop-filter: blur(10px);
}

.form-actions > div:first-child {
  display: flex;
  gap: 8px;
  align-items: center;
}

.change-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #555;
}

.change-dot--active {
  background: variables.$color-primary;
}

.form-actions small {
  opacity: 0.55;
}

.form-actions__buttons {
  display: flex;
  gap: variables.$spacing-sm;
}

.secondary-button,
.primary-button {
  padding:
    variables.$spacing-md
    variables.$spacing-lg;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
}

.secondary-button {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color: variables.$color-white;
}

.primary-button {
  border:
    1px solid
    variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.secondary-button:disabled,
.primary-button:disabled {
  opacity: 0.35;
  cursor: default;
}

.state-card {
  display: grid;
  min-height: 350px;
  gap: variables.$spacing-md;
  place-items: center;
  align-content: center;
  padding: variables.$spacing-3xl;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  text-align: center;
}

.state-card p {
  margin: 0;
  opacity: 0.5;
}

.spinner {
  width: 45px;
  height: 45px;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin
    0.8s linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

.state-card__icon {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border: 1px solid #d85151;
  border-radius: 50%;
  color: #ff7474;
  font-size: 1.7rem;
}

.state-card button {
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border: 0;
  border-radius: variables.$radius-lg;
  background: variables.$color-primary;
  color: variables.$color-white;
  font: inherit;
}

@media (max-width: 800px) {
  .edit-lesson__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .lesson-number {
    width: 90px;
    height: 90px;
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
    align-items: stretch;
    flex-direction: column;
  }

  .form-actions__buttons {
    display: grid;
    grid-template-columns: 1fr;
  }

  .secondary-button,
  .primary-button {
    width: 100%;
    text-align: center;
  }
}
</style>