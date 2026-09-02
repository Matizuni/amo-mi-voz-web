<template>
  <section class="create-assignment">
    <!-- =====================================================
         VOLVER
    ====================================================== -->

    <RouterLink
      :to="`/aula/clase/${lessonId}/trabajo`"
      class="create-assignment__back"
    >
      ← Volver a Trabajo de clase
    </RouterLink>

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="create-assignment__header">
      <div>
        <p>
          PROFESOR · CLASE {{ lessonId }}
        </p>

        <h1>
          Crear tarea
        </h1>

        <span>
          Diseña y publica una actividad
          para los estudiantes del Aula Virtual.
        </span>
      </div>

      <aside class="assignment-status-card">
        <span>
          ESTADO
        </span>

        <strong>
          {{
            form.status === 'published'
              ? 'Publicada'
              : 'Borrador'
          }}
        </strong>

        <small>
          Supabase Database
        </small>
      </aside>
    </header>

    <!-- =====================================================
         ERROR
    ====================================================== -->

    <div
      v-if="errorMessage"
      class="form-error"
    >
      <span>
        !
      </span>

      <div>
        <strong>
          No pudimos publicar la tarea
        </strong>

        <p>
          {{ errorMessage }}
        </p>
      </div>
    </div>

    <!-- =====================================================
         FORM
    ====================================================== -->

    <form
      class="assignment-form"
      @submit.prevent="createAssignment"
    >
      <!-- ===================================================
           01 · INFORMACIÓN
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            01
          </span>

          <div>
            <p>
              Información
            </p>

            <h2>
              Datos de la actividad
            </h2>
          </div>
        </header>

        <div class="form-group">
          <label for="title">
            Título de la tarea
          </label>

          <input
            id="title"
            v-model.trim="form.title"
            type="text"
            maxlength="120"
            placeholder="Ej. Ejercicio de afinación"
            required
          >

          <small>
            {{ form.title.length }}/120
          </small>
        </div>

        <div class="form-group">
          <label for="description">
            Instrucciones
          </label>

          <textarea
            id="description"
            v-model.trim="form.description"
            rows="8"
            placeholder="Explica claramente qué debe realizar el estudiante..."
            required
          ></textarea>

          <small>
            Describe objetivo, procedimiento
            y forma de entrega.
          </small>
        </div>
      </section>

      <!-- ===================================================
           02 · ACTIVIDAD
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            02
          </span>

          <div>
            <p>
              Actividad
            </p>

            <h2>
              Tipo de trabajo
            </h2>
          </div>
        </header>

        <div class="activity-types">
          <button
            v-for="type in activityTypes"
            :key="type.value"
            type="button"
            :class="{
              active:
                form.type === type.value
            }"
            @click="
              form.type = type.value
            "
          >
            <span>
              {{ type.icon }}
            </span>

            <strong>
              {{ type.label }}
            </strong>

            <small>
              {{ type.description }}
            </small>
          </button>
        </div>
      </section>

      <!-- ===================================================
           03 · ENTREGA
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            03
          </span>

          <div>
            <p>
              Entrega
            </p>

            <h2>
              Formato solicitado
            </h2>
          </div>
        </header>

        <div class="delivery-types">
          <button
            v-for="fileType in fileTypes"
            :key="fileType.value"
            type="button"
            :class="{
              active:
                form.acceptedFile ===
                fileType.value
            }"
            @click="
              form.acceptedFile =
                fileType.value
            "
          >
            <span>
              {{ fileType.icon }}
            </span>

            <strong>
              {{ fileType.label }}
            </strong>
          </button>
        </div>
      </section>

      <!-- ===================================================
           04 · EVALUACIÓN
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            04
          </span>

          <div>
            <p>
              Evaluación
            </p>

            <h2>
              Fecha y puntaje
            </h2>
          </div>
        </header>

        <div class="form-row">
          <div class="form-group">
            <label for="due-date">
              Fecha límite
            </label>

            <input
              id="due-date"
              v-model="form.dueDate"
              type="date"
            >

            <small>
              Opcional.
            </small>
          </div>

          <div class="form-group">
            <label for="points">
              Puntaje máximo
            </label>

            <input
              id="points"
              v-model.number="form.points"
              type="number"
              min="0"
              max="1000"
            >

            <small>
              Puntaje de referencia.
            </small>
          </div>
        </div>
      </section>

      <!-- ===================================================
           05 · PUBLICACIÓN
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            05
          </span>

          <div>
            <p>
              Publicación
            </p>

            <h2>
              Estado de la tarea
            </h2>
          </div>
        </header>

        <div class="status-selector">
          <button
            type="button"
            :class="{
              active:
                form.status ===
                'published'
            }"
            @click="
              form.status =
                'published'
            "
          >
            <span>
              ✓
            </span>

            <div>
              <strong>
                Publicada
              </strong>

              <small>
                Visible para los estudiantes.
              </small>
            </div>
          </button>

          <button
            type="button"
            :class="{
              active:
                form.status ===
                'draft'
            }"
            @click="
              form.status =
                'draft'
            "
          >
            <span>
              ○
            </span>

            <div>
              <strong>
                Borrador
              </strong>

              <small>
                Guardada para terminar después.
              </small>
            </div>
          </button>
        </div>
      </section>

      <!-- ===================================================
           PREVIEW
      ==================================================== -->

      <section class="assignment-preview">
        <header class="assignment-preview__top">
          <span>
            VISTA PREVIA
          </span>

          <span
            :class="{
              'assignment-preview__status--draft':
                form.status === 'draft'
            }"
          >
            {{
              form.status === 'published'
                ? 'PUBLICADA'
                : 'BORRADOR'
            }}
          </span>
        </header>

        <div class="assignment-preview__body">
          <div class="assignment-preview__icon">
            {{
              currentActivityType.icon
            }}
          </div>

          <div>
            <small>
              {{
                currentActivityType.label
              }}
            </small>

            <h2>
              {{
                form.title ||
                'Título de la tarea'
              }}
            </h2>

            <p>
              {{
                form.description ||
                'Aquí aparecerán las instrucciones de la actividad.'
              }}
            </p>
          </div>
        </div>

        <footer class="assignment-preview__meta">
          <span>
            Clase {{ lessonId }}
          </span>

          <span>
            Entrega:
            {{
              currentFileType.label
            }}
          </span>

          <span>
            {{ form.points }} pts
          </span>

          <span v-if="form.dueDate">
            Hasta:
            {{ formattedDueDate }}
          </span>

          <span v-else>
            Sin fecha límite
          </span>
        </footer>
      </section>

      <!-- ===================================================
           ACCIONES
      ==================================================== -->

      <footer class="form-actions">
        <RouterLink
          :to="`/aula/clase/${lessonId}/trabajo`"
          class="cancel-button"
        >
          Cancelar
        </RouterLink>

        <button
          type="submit"
          class="publish-button"
          :disabled="!canSubmit"
        >
          <template v-if="isSaving">
            Guardando...
          </template>

          <template v-else-if="form.status === 'draft'">
            Guardar borrador
          </template>

          <template v-else>
            Publicar tarea
          </template>
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
  useRoute,
  useRouter
} from 'vue-router'

import {
  insertAssignment
} from '@/services/assignmentService'

const route = useRoute()
const router = useRouter()

/* =========================================================
   ESTADO
========================================================= */

const isSaving = ref(false)

const errorMessage = ref('')

const lessonId = computed(() =>
  Number(route.params.id)
)

/* =========================================================
   FORM
========================================================= */

const form = reactive({
  title: '',
  description: '',
  type: 'assignment',
  acceptedFile: 'audio',
  dueDate: '',
  points: 100,
  status: 'published'
})

/* =========================================================
   TIPOS
========================================================= */

const activityTypes = [
  {
    value: 'assignment',
    label: 'Tarea',
    icon: '✓',
    description:
      'Actividad general'
  },
  {
    value: 'performance',
    label: 'Performance',
    icon: '★',
    description:
      'Interpretación vocal'
  },
  {
    value: 'audio',
    label: 'Audio',
    icon: '♪',
    description:
      'Grabación de voz'
  },
  {
    value: 'video',
    label: 'Video',
    icon: '▶',
    description:
      'Registro audiovisual'
  },
  {
    value: 'score',
    label: 'Partitura',
    icon: '♫',
    description:
      'Lectura o ejercicio musical'
  }
]

const fileTypes = [
  {
    value: 'audio',
    label: 'Audio',
    icon: '♪'
  },
  {
    value: 'video',
    label: 'Video',
    icon: '▶'
  },
  {
    value: 'document',
    label: 'Documento',
    icon: 'PDF'
  },
  {
    value: 'any',
    label: 'Cualquier archivo',
    icon: 'FILE'
  }
]

/* =========================================================
   PREVIEW
========================================================= */

const currentActivityType =
  computed(() => {
    return (
      activityTypes.find(
        item =>
          item.value ===
          form.type
      ) ||
      activityTypes[0]
    )
  })

const currentFileType =
  computed(() => {
    return (
      fileTypes.find(
        item =>
          item.value ===
          form.acceptedFile
      ) ||
      fileTypes[0]
    )
  })

const formattedDueDate =
  computed(() => {
    if (!form.dueDate) {
      return ''
    }

    const [
      year,
      month,
      day
    ] = form.dueDate.split('-')

    return `${day}/${month}/${year}`
  })

/* =========================================================
   VALIDACIÓN
========================================================= */

const canSubmit =
  computed(() => {
    return Boolean(
      !isSaving.value &&
      lessonId.value &&
      form.title.trim() &&
      form.description.trim() &&
      form.type &&
      form.acceptedFile &&
      Number(form.points) >= 0
    )
  })

/* =========================================================
   CREAR
========================================================= */

const createAssignment =
  async () => {
    if (!canSubmit.value) {
      return
    }

    isSaving.value = true

    errorMessage.value = ''

    try {
      const created =
        await insertAssignment({
          lessonId:
            lessonId.value,

          title:
            form.title.trim(),

          description:
            form.description.trim(),

          type:
            form.type,

          acceptedFile:
            form.acceptedFile,

          dueDate:
            form.dueDate,

          points:
            Number(
              form.points
            ),

          status:
            form.status
        })

      console.log(
        'Tarea creada:',
        created
      )

      router.push(
        `/aula/clase/${lessonId.value}/trabajo`
      )
    } catch (error) {
      console.error(
        'Error creando tarea:',
        error
      )

      errorMessage.value =
        error?.message ||
        'No se pudo crear la tarea.'
    } finally {
      isSaving.value = false
    }
  }
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.create-assignment {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
}

.create-assignment__back {
  display: inline-block;
  margin-bottom:
    variables.$spacing-xl;
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
}

/* =========================================================
   HEADER
========================================================= */

.create-assignment__header {
  display: flex;
  gap:
    variables.$spacing-2xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom:
    variables.$spacing-3xl;
}

.create-assignment__header > div {
  max-width: 750px;
}

.create-assignment__header p {
  margin-bottom:
    variables.$spacing-sm;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  letter-spacing: 0.15em;
}

.create-assignment__header h1 {
  margin-bottom:
    variables.$spacing-md;
  font-size:
    clamp(
      3rem,
      6vw,
      5rem
    );
}

.create-assignment__header > div > span {
  line-height: 1.6;
  opacity: 0.65;
}

.assignment-status-card {
  min-width: 210px;
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.assignment-status-card span,
.assignment-status-card strong,
.assignment-status-card small {
  display: block;
}

.assignment-status-card span {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.assignment-status-card strong {
  margin: 5px 0;
  font-size: 1.3rem;
}

.assignment-status-card small {
  opacity: 0.45;
}

/* =========================================================
   FORM
========================================================= */

.assignment-form {
  display: grid;
  gap:
    variables.$spacing-xl;
}

.form-section {
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

.form-section__header {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  margin-bottom:
    variables.$spacing-xl;
}

.form-section__header > span {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
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

.form-section__header p {
  margin: 0;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  letter-spacing: 0.1em;
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
  gap:
    variables.$spacing-sm;
  margin-bottom:
    variables.$spacing-lg;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
}

.form-group input,
.form-group textarea,
.form-group select {
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
  transition:
    border-color
    0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color:
    variables.$color-primary;
}

.form-group textarea {
  line-height: 1.65;
  resize: vertical;
}

.form-group small {
  opacity: 0.45;
}

.form-row {
  display: grid;
  gap:
    variables.$spacing-lg;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

/* =========================================================
   ACTIVIDAD
========================================================= */

.activity-types {
  display: grid;
  gap: 10px;
  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );
}

.activity-types button {
  display: grid;
  min-height: 145px;
  gap: 8px;
  padding:
    variables.$spacing-md;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
  text-align: center;
  cursor: pointer;
  opacity: 0.55;
}

.activity-types button.active {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
  opacity: 1;
}

.activity-types button > span {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border:
    1px solid
    currentColor;
  border-radius: 50%;
}

.activity-types button small {
  opacity: 0.55;
}

/* =========================================================
   ENTREGA
========================================================= */

.delivery-types {
  display: grid;
  gap: 10px;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
}

.delivery-types button {
  display: flex;
  min-height: 85px;
  gap:
    variables.$spacing-sm;
  align-items: center;
  justify-content: center;
  padding:
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
  cursor: pointer;
  opacity: 0.55;
}

.delivery-types button.active {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
  opacity: 1;
}

.delivery-types span {
  display: grid;
  min-width: 38px;
  height: 38px;
  padding: 0 4px;
  place-items: center;
  border:
    1px solid
    currentColor;
  border-radius: 50%;
  font-size: 0.7rem;
}

/* =========================================================
   STATUS
========================================================= */

.status-selector {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns: 1fr 1fr;
}

.status-selector button {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
  text-align: left;
  cursor: pointer;
  opacity: 0.55;
}

.status-selector button.active {
  border-color:
    variables.$color-primary;
  opacity: 1;
}

.status-selector button > span {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.status-selector strong,
.status-selector small {
  display: block;
}

.status-selector small {
  margin-top: 4px;
  opacity: 0.5;
}

/* =========================================================
   PREVIEW
========================================================= */

.assignment-preview {
  padding:
    variables.$spacing-2xl;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(
        variables.$color-primary,
        0.12
      ),
      transparent 35%
    ),
    variables.$color-surface;
}

.assignment-preview__top {
  display: flex;
  justify-content: space-between;
  margin-bottom:
    variables.$spacing-xl;
}

.assignment-preview__top span {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.assignment-preview__status--draft {
  opacity: 0.45;
}

.assignment-preview__body {
  display: grid;
  gap:
    variables.$spacing-lg;
  align-items: start;
  grid-template-columns:
    auto
    1fr;
}

.assignment-preview__icon {
  display: grid;
  width: 70px;
  height: 70px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 1.4rem;
}

.assignment-preview__body small {
  color:
    variables.$color-primary;
}

.assignment-preview__body h2 {
  margin:
    variables.$spacing-xs
    0
    variables.$spacing-sm;
}

.assignment-preview__body p {
  margin: 0;
  line-height: 1.6;
  white-space: pre-line;
  opacity: 0.6;
}

.assignment-preview__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top:
    variables.$spacing-xl;
}

.assignment-preview__meta span {
  padding:
    6px
    10px;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  font-size:
    variables.$font-size-xs;
  opacity: 0.65;
}

/* =========================================================
   ERROR
========================================================= */

.form-error {
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
    #d85151;
  border-radius:
    variables.$radius-lg;
  background:
    rgba(
      216,
      81,
      81,
      0.06
    );
}

.form-error > span {
  display: grid;
  width: 38px;
  height: 38px;
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

/* =========================================================
   ACTIONS
========================================================= */

.form-actions {
  display: flex;
  gap:
    variables.$spacing-md;
  justify-content: flex-end;
  padding:
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.cancel-button,
.publish-button {
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-radius:
    variables.$radius-lg;
  font: inherit;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
}

.cancel-button {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
}

.publish-button {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

.publish-button:disabled {
  opacity: 0.35;
  cursor: default;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .create-assignment__header {
    align-items: stretch;
    flex-direction: column;
  }

  .assignment-status-card {
    width: 100%;
  }

  .activity-types {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .delivery-types {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 700px) {
  .form-row,
  .status-selector,
  .activity-types,
  .delivery-types {
    grid-template-columns: 1fr;
  }

  .form-section,
  .assignment-preview {
    padding:
      variables.$spacing-xl;
  }

  .assignment-preview__body {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-button,
  .publish-button {
    width: 100%;
    text-align: center;
  }
}
</style>