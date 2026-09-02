<template>
  <section class="edit-assignment">
    <RouterLink
      :to="taskRoute"
      class="edit-assignment__back"
    >
      ← Volver a la tarea
    </RouterLink>

    <!-- =====================================================
         CARGANDO
    ====================================================== -->
    <div
      v-if="isLoading"
      class="state-card"
    >
      <div class="state-card__loader"></div>

      <div>
        <h1>Cargando tarea</h1>
        <p>
          Estamos obteniendo la información desde el aula virtual.
        </p>
      </div>
    </div>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <div
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <span class="state-card__icon">
        !
      </span>

      <div>
        <h1>No pudimos cargar la tarea</h1>

        <p>
          {{ loadError }}
        </p>

        <button
          type="button"
          class="state-card__button"
          @click="loadTask"
        >
          Intentar nuevamente
        </button>
      </div>
    </div>

    <!-- =====================================================
         TAREA
    ====================================================== -->
    <template v-else-if="task">
      <header class="edit-assignment__header">
        <div>
          <span class="edit-assignment__eyebrow">
            PROFESOR · CLASE {{ lessonId }}
          </span>

          <h1>
            Editar tarea
          </h1>

          <p>
            Modifica la información de esta actividad y guarda
            los cambios directamente en el Aula Virtual.
          </p>
        </div>

        <div class="edit-assignment__status">
          <span></span>
          Supabase conectado
        </div>
      </header>

      <form
        class="assignment-form"
        @submit.prevent="saveChanges"
      >
        <!-- TÍTULO -->
        <div class="form-group">
          <label for="title">
            Título de la actividad
          </label>

          <input
            id="title"
            v-model.trim="form.title"
            type="text"
            maxlength="120"
            autocomplete="off"
            required
            :disabled="isSaving"
          />

          <small>
            Utiliza un nombre breve y reconocible para tus estudiantes.
          </small>
        </div>

        <!-- DESCRIPCIÓN -->
        <div class="form-group">
          <label for="description">
            Instrucciones
          </label>

          <textarea
            id="description"
            v-model.trim="form.description"
            rows="7"
            required
            :disabled="isSaving"
          ></textarea>

          <small>
            Explica claramente qué debe realizar y entregar el estudiante.
          </small>
        </div>

        <!-- CONFIGURACIÓN -->
        <div class="form-row">
          <div class="form-group">
            <label for="type">
              Tipo de actividad
            </label>

            <select
              id="type"
              v-model="form.type"
              :disabled="isSaving"
            >
              <option value="assignment">
                Tarea
              </option>

              <option value="performance">
                Interpretación
              </option>

              <option value="audio">
                Trabajo de audio
              </option>

              <option value="video">
                Trabajo de video
              </option>

              <option value="score">
                Partitura
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="acceptedFile">
              Tipo de entrega
            </label>

            <select
              id="acceptedFile"
              v-model="form.acceptedFile"
              :disabled="isSaving"
            >
              <option value="audio">
                Audio
              </option>

              <option value="video">
                Video
              </option>

              <option value="document">
                Documento
              </option>

              <option value="any">
                Cualquier archivo
              </option>
            </select>
          </div>
        </div>

        <!-- INFORMACIÓN -->
        <div class="form-row">
          <div class="form-group">
            <label for="dueDate">
              Fecha límite
            </label>

            <input
              id="dueDate"
              v-model="form.dueDate"
              type="date"
              :disabled="isSaving"
            />
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
              :disabled="isSaving"
            />
          </div>
        </div>

        <!-- ESTADO -->
        <div class="form-group">
          <label for="status">
            Estado
          </label>

          <select
            id="status"
            v-model="form.status"
            :disabled="isSaving"
          >
            <option value="published">
              Publicada
            </option>

            <option value="draft">
              Borrador
            </option>
          </select>
        </div>

        <!-- =================================================
             VISTA PREVIA
        ================================================== -->
        <section class="assignment-preview">
          <div class="assignment-preview__top">
            <span>
              VISTA PREVIA
            </span>

            <small>
              Clase {{ lessonId }}
            </small>
          </div>

          <h2>
            {{ form.title || 'Título de la tarea' }}
          </h2>

          <p>
            {{
              form.description ||
              'Las instrucciones de la actividad aparecerán aquí.'
            }}
          </p>

          <div class="assignment-preview__meta">
            <span>
              {{ activityTypeLabel }}
            </span>

            <span>
              Entrega: {{ acceptedFileLabel }}
            </span>

            <span v-if="form.points !== ''">
              {{ form.points }} pts
            </span>
          </div>
        </section>

        <!-- =================================================
             MENSAJE
        ================================================== -->
        <p
          v-if="saveError"
          class="form-message form-message--error"
          role="alert"
        >
          {{ saveError }}
        </p>

        <!-- =================================================
             ACCIONES
        ================================================== -->
        <div class="form-actions">
          <RouterLink
            :to="taskRoute"
            class="cancel-button"
            :class="{ 'is-disabled': isSaving }"
          >
            Cancelar
          </RouterLink>

          <button
            type="submit"
            class="save-button"
            :disabled="isSaving || !canSave"
          >
            <span v-if="isSaving">
              Guardando...
            </span>

            <span v-else>
              Guardar cambios
            </span>
          </button>
        </div>
      </form>
    </template>

    <!-- =====================================================
         NO ENCONTRADA
    ====================================================== -->
    <div
      v-else
      class="state-card"
    >
      <span class="state-card__icon">
        ?
      </span>

      <div>
        <h1>
          Tarea no encontrada
        </h1>

        <p>
          No encontramos esta actividad dentro de la clase seleccionada.
        </p>

        <RouterLink
          :to="classworkRoute"
          class="state-card__link"
        >
          Volver a Trabajo de clase
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  RouterLink,
  useRoute,
  useRouter
} from 'vue-router'

import {
  fetchAssignmentById,
  updateAssignment
} from '@/services/assignmentService'

const route = useRoute()
const router = useRouter()

/* =========================================================
   ROUTE
========================================================= */

const lessonId = computed(() =>
  Number(route.params.id)
)

const taskId = computed(() =>
  Number(route.params.taskId)
)

const taskRoute = computed(() =>
  `/aula/clase/${lessonId.value}/tarea/${taskId.value}`
)

const classworkRoute = computed(() =>
  `/aula/clase/${lessonId.value}/trabajo`
)

/* =========================================================
   STATE
========================================================= */

const task = ref(null)

const isLoading = ref(true)
const isSaving = ref(false)

const loadError = ref('')
const saveError = ref('')

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
   CARGAR FORMULARIO
========================================================= */

const fillForm = assignment => {
  form.title =
    assignment?.title || ''

  form.description =
    assignment?.description || ''

  form.type =
    assignment?.type ||
    'assignment'

  form.acceptedFile =
    assignment?.acceptedFile ||
    assignment?.acceptedFiles?.[0] ||
    'audio'

  form.dueDate =
    assignment?.dueDate || ''

  form.points =
    assignment?.points ?? 100

  form.status =
    assignment?.status ||
    'published'
}

/* =========================================================
   CARGAR TAREA DESDE SUPABASE
========================================================= */

const loadTask = async () => {
  isLoading.value = true
  loadError.value = ''
  task.value = null

  try {
    if (
      !Number.isInteger(taskId.value) ||
      taskId.value <= 0
    ) {
      throw new Error(
        'El identificador de la tarea no es válido.'
      )
    }

    const assignment =
      await fetchAssignmentById(
        taskId.value
      )

    if (
      !assignment ||
      Number(assignment.lessonId) !==
        Number(lessonId.value)
    ) {
      task.value = null
      return
    }

    task.value = assignment
    fillForm(assignment)
  } catch (error) {
    console.error(
      'Error cargando tarea:',
      error
    )

    loadError.value =
      error?.message ||
      'No se pudo obtener la tarea.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   VALIDACIÓN
========================================================= */

const canSave = computed(() => {
  return (
    form.title.trim().length > 0 &&
    form.description.trim().length > 0 &&
    Number(form.points) >= 0
  )
})

/* =========================================================
   LABELS
========================================================= */

const activityTypeLabel = computed(() => {
  const labels = {
    assignment: 'Tarea',
    performance: 'Interpretación',
    audio: 'Audio',
    video: 'Video',
    score: 'Partitura'
  }

  return (
    labels[form.type] ||
    'Actividad'
  )
})

const acceptedFileLabel = computed(() => {
  const labels = {
    audio: 'Audio',
    video: 'Video',
    document: 'Documento',
    any: 'Cualquier archivo'
  }

  return (
    labels[form.acceptedFile] ||
    'Archivo'
  )
})

/* =========================================================
   GUARDAR EN SUPABASE
========================================================= */

const saveChanges = async () => {
  if (
    !task.value ||
    !canSave.value ||
    isSaving.value
  ) {
    return
  }

  isSaving.value = true
  saveError.value = ''

  try {
    const updated =
      await updateAssignment(
        taskId.value,
        {
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
            Number(form.points),

          status:
            form.status
        }
      )

    task.value = updated

    await router.push(
      taskRoute.value
    )
  } catch (error) {
    console.error(
      'Error guardando tarea:',
      error
    )

    saveError.value =
      error?.message ||
      'No se pudieron guardar los cambios.'
  } finally {
    isSaving.value = false
  }
}

/* =========================================================
   INIT
========================================================= */

onMounted(
  loadTask
)
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   PAGE
========================================================= */

.edit-assignment {
  width: min(950px, 100%);
  margin: 0 auto;
}

.edit-assignment__back {
  display: inline-flex;
  margin-bottom: variables.$spacing-xl;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.edit-assignment__back:hover {
  opacity: 0.8;
  transform: translateX(-2px);
}

.edit-assignment__back:focus-visible {
  outline:
    2px solid
    variables.$color-primary;
  outline-offset: 4px;
}

/* =========================================================
   HEADER
========================================================= */

.edit-assignment__header {
  display: flex;
  gap: 28px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-3xl;
}

.edit-assignment__eyebrow {
  display: inline-block;
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.15em;
}

.edit-assignment__header h1 {
  margin: 0 0 variables.$spacing-md;
  font-size:
    clamp(
      2.8rem,
      6vw,
      5rem
    );
  line-height: 0.96;
  letter-spacing: -0.05em;
}

.edit-assignment__header p {
  max-width: 580px;
  margin: 0;
  opacity: 0.62;
  line-height: 1.7;
}

.edit-assignment__status {
  display: inline-flex;
  flex: 0 0 auto;
  gap: 8px;
  align-items: center;
  padding: 9px 12px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  color: #777;
  font-size: 0.65rem;
  font-weight: 700;
}

.edit-assignment__status span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: variables.$color-primary;
}

/* =========================================================
   FORM
========================================================= */

.assignment-form {
  display: grid;
  gap: variables.$spacing-xl;
  padding: variables.$spacing-2xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.form-group {
  display: grid;
  gap: variables.$spacing-sm;
}

.form-group label {
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
}

.form-group small {
  color: #666;
  font-size: 0.7rem;
  line-height: 1.5;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  outline: none;
  color: variables.$color-white;
  background: variables.$color-background;
  font: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: variables.$color-primary;
  box-shadow:
    0 0 0 3px
    rgba(244, 196, 48, 0.08);
}

.form-group input:disabled,
.form-group textarea:disabled,
.form-group select:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.form-group textarea {
  min-height: 150px;
  resize: vertical;
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

/* =========================================================
   PREVIEW
========================================================= */

.assignment-preview {
  padding: variables.$spacing-xl;
  border: 1px dashed variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    linear-gradient(
      145deg,
      rgba(244, 196, 48, 0.025),
      transparent 42%
    ),
    variables.$color-background;
}

.assignment-preview__top {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: variables.$spacing-md;
}

.assignment-preview__top > span {
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.1em;
}

.assignment-preview__top small {
  color: #666;
}

.assignment-preview h2 {
  margin:
    0
    0
    variables.$spacing-md;
}

.assignment-preview p {
  margin: 0;
  opacity: 0.7;
  white-space: pre-line;
  line-height: 1.7;
}

.assignment-preview__meta {
  display: flex;
  gap: 8px;
  margin-top: 22px;
  flex-wrap: wrap;
}

.assignment-preview__meta span {
  padding: 7px 10px;
  border: 1px solid #292929;
  border-radius: 999px;
  color: #777;
  background: #111;
  font-size: 0.65rem;
}

/* =========================================================
   MESSAGE
========================================================= */

.form-message {
  margin: 0;
  padding: 13px 15px;
  border-radius: variables.$radius-lg;
  font-size: 0.82rem;
}

.form-message--error {
  border: 1px solid rgba(255, 90, 90, 0.25);
  color: #ff9c9c;
  background: rgba(255, 90, 90, 0.06);
}

/* =========================================================
   ACTIONS
========================================================= */

.form-actions {
  display: flex;
  gap: variables.$spacing-md;
  justify-content: flex-end;
}

.cancel-button,
.save-button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding:
    0
    variables.$spacing-xl;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.cancel-button {
  border: 1px solid variables.$color-border;
  color: variables.$color-white;
  background: transparent;
}

.save-button {
  border: 1px solid variables.$color-primary;
  color: #080808;
  background: variables.$color-primary;
  cursor: pointer;
}

.save-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.cancel-button.is-disabled {
  pointer-events: none;
  opacity: 0.5;
}

/* =========================================================
   STATES
========================================================= */

.state-card {
  display: flex;
  gap: 20px;
  align-items: center;
  padding: variables.$spacing-3xl;
  border: 1px dashed variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.state-card h1 {
  margin: 0 0 8px;
}

.state-card p {
  margin: 0;
  color: #777;
  line-height: 1.6;
}

.state-card__icon {
  display: grid;
  flex: 0 0 auto;
  width: 46px;
  height: 46px;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-weight: 900;
}

.state-card__loader {
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border:
    3px solid
    rgba(244, 196, 48, 0.15);
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin 0.8s linear infinite;
}

.state-card__button,
.state-card__link {
  display: inline-flex;
  margin-top: 15px;
  padding: 10px 15px;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  color: #090909;
  background: variables.$color-primary;
  font: inherit;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

/* =========================================================
   ANIMATION
========================================================= */

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {
  .edit-assignment__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .edit-assignment__status {
    align-self: flex-start;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .assignment-form {
    padding: variables.$spacing-xl;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-button,
  .save-button {
    width: 100%;
  }

  .state-card {
    align-items: flex-start;
    padding: variables.$spacing-xl;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .edit-assignment__back {
    transition: none;
  }

  .state-card__loader {
    animation: none;
  }
}
</style>
