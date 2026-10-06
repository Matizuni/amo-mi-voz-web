<template>
  <section class="edit-assignment amv-view-shell">
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


/* =========================================================
   AMV LMS UI SYSTEM · ACADEMIC EXPERIENCE v1.0
   Sistema visual común para el SaaS
========================================================= */
.edit-assignment {
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

.edit-assignment :where(a, button, input, textarea, select, [role="button"]) {
  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
}

.edit-assignment :where(a, button, input, textarea, select, [role="button"]):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.edit-assignment :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.edit-assignment :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

.edit-assignment :where(table tbody tr) {
  transition: background-color .18s ease;
}

.edit-assignment :where(table tbody tr):hover {
  background-color: rgba(159, 25, 69, .025);
}

.edit-assignment :where(.card, [class*="-card"], [class*="__card"]) {
  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;
}

.edit-assignment :where(.card, [class*="-card"], [class*="__card"]):hover {
  border-color: rgba(159, 25, 69, .16);
}

@media (prefers-reduced-motion: reduce) {
  .edit-assignment *, .edit-assignment *::before, .edit-assignment *::after {
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
.edit-assignment {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.edit-assignment :where(
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
  .edit-assignment :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .edit-assignment :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .edit-assignment :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .edit-assignment :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.edit-assignment :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.edit-assignment :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.edit-assignment :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.edit-assignment ::selection {
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
  .edit-assignment,
  .edit-assignment *,
  .edit-assignment *::before,
  .edit-assignment *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
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
