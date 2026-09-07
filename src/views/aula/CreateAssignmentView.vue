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
          PROFESOR · NUEVA ACTIVIDAD
        </p>

        <h1>
          Crear tarea
        </h1>

        <span>
          Crea una actividad clara, define la forma de entrega y publícala cuando esté lista.
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
          Sincronizado con el aula
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
            <span class="form-section__hint">
              Define qué harán los estudiantes y qué esperas recibir.
            </span>
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
            <span class="form-section__hint">
              Elige la categoría que mejor representa la actividad.
            </span>
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
            <span class="form-section__hint">
              Indica qué tipo de archivo deberá entregar el estudiante.
            </span>
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
            <span class="form-section__hint">
              La fecha es opcional; el puntaje se usa como referencia académica.
            </span>
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
            <span class="form-section__hint">
              Publica ahora o guárdala como borrador para terminarla después.
            </span>
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
            Actividad del curso
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
   DESIGN SYSTEM · LIGHT LMS
========================================================= */

.create-assignment {
  --ink: #152033;
  --muted: #6f7c8f;
  --soft: #f6f8fb;
  --soft-blue: #eef3f8;
  --line: #dbe3ec;
  --line-strong: #cbd6e2;
  --card: #ffffff;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-soft: #fff8e6;
  --green: #2d8a63;
  --green-soft: #edf8f3;
  --blue: #3f6fa8;
  --blue-soft: #eef5fc;
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  color: var(--ink);
}

.create-assignment__back {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 26px;
  color: var(--wine);
  font-weight: 750;
  text-decoration: none;
  transition: transform .2s ease, color .2s ease;
}

.create-assignment__back:hover {
  color: var(--wine-dark);
  transform: translateX(-2px);
}

/* =========================================================
   HEADER
========================================================= */

.create-assignment__header {
  display: grid;
  gap: 28px;
  align-items: end;
  grid-template-columns: minmax(0, 1fr) minmax(230px, 290px);
  margin-bottom: 34px;
  padding: 30px 32px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background:
    radial-gradient(circle at 88% 8%, rgba(217, 169, 29, .12), transparent 31%),
    linear-gradient(135deg, #ffffff 0%, #fbfcfe 58%, #f7f2e6 100%);
  box-shadow: 0 14px 35px rgba(31, 48, 73, .06);
}

.create-assignment__header > div {
  max-width: 760px;
}

.create-assignment__header p {
  margin: 0 0 9px;
  color: #b27d00;
  font-size: .72rem;
  font-weight: 900;
  letter-spacing: .17em;
  text-transform: uppercase;
}

.create-assignment__header h1 {
  margin: 0;
  color: var(--ink);
  font-size: clamp(2.7rem, 5vw, 4.6rem);
  line-height: .97;
  letter-spacing: -.045em;
}

.create-assignment__header > div > span {
  display: block;
  max-width: 680px;
  margin-top: 16px;
  color: var(--muted);
  font-size: .98rem;
  line-height: 1.65;
}

.assignment-status-card {
  min-width: 0;
  padding: 20px;
  border: 1px solid var(--line-strong);
  border-radius: 17px;
  background: rgba(255, 255, 255, .88);
  box-shadow: 0 8px 25px rgba(31, 48, 73, .05);
}

.assignment-status-card span,
.assignment-status-card strong,
.assignment-status-card small {
  display: block;
}

.assignment-status-card span {
  color: #9b7200;
  font-size: .61rem;
  font-weight: 900;
  letter-spacing: .15em;
}

.assignment-status-card strong {
  margin: 7px 0 4px;
  color: var(--ink);
  font-size: 1.18rem;
}

.assignment-status-card small {
  color: var(--muted);
  font-size: .73rem;
}

/* =========================================================
   FORM
========================================================= */

.assignment-form {
  display: grid;
  gap: 20px;
}

.form-section {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: var(--card);
  box-shadow: 0 10px 28px rgba(31, 48, 73, .045);
}

.form-section__header {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8edf3;
}

.form-section__header > span {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #ecd17b;
  border-radius: 13px;
  color: #a47300;
  background: var(--gold-soft);
  font-size: .8rem;
  font-weight: 900;
}

.form-section__header > div {
  min-width: 0;
}

.form-section__header p {
  margin: 1px 0 3px;
  color: #b27d00;
  font-size: .64rem;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.form-section__header h2 {
  margin: 0;
  color: var(--ink);
  font-size: clamp(1.25rem, 2vw, 1.65rem);
  letter-spacing: -.025em;
}

.form-section__hint {
  display: block;
  margin-top: 5px;
  color: var(--muted);
  font-size: .76rem;
  line-height: 1.5;
}

.form-group {
  display: grid;
  gap: 8px;
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-group label {
  color: #344359;
  font-size: .79rem;
  font-weight: 800;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 13px 14px;
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  outline: none;
  color: var(--ink);
  background: #fbfcfe;
  font: inherit;
  transition:
    border-color .2s ease,
    box-shadow .2s ease,
    background .2s ease;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #9aa6b7;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color: #b8c7d7;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(63, 111, 168, .08);
}

.form-group textarea {
  min-height: 150px;
  line-height: 1.65;
  resize: vertical;
}

.form-group small {
  color: #8a97a9;
  font-size: .7rem;
}

.form-row {
  display: grid;
  gap: 18px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

/* =========================================================
   ACTIVITY TYPE
========================================================= */

.activity-types {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.activity-types button {
  display: grid;
  min-height: 132px;
  gap: 7px;
  padding: 17px 12px;
  place-items: center;
  border: 1px solid var(--line);
  border-radius: 15px;
  color: #58677b;
  background: #fbfcfe;
  font: inherit;
  text-align: center;
  cursor: pointer;
  transition:
    transform .2s ease,
    border-color .2s ease,
    box-shadow .2s ease,
    background .2s ease,
    color .2s ease;
}

.activity-types button:hover {
  transform: translateY(-2px);
  border-color: #c8d4e0;
  background: #fff;
  box-shadow: 0 10px 22px rgba(31, 48, 73, .06);
}

.activity-types button.active {
  border-color: #e2bd50;
  color: #805c00;
  background: var(--gold-soft);
  box-shadow: inset 0 0 0 1px rgba(217, 169, 29, .12);
}

.activity-types button > span {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 12px;
  background: rgba(255,255,255,.72);
  font-weight: 900;
}

.activity-types button strong {
  color: var(--ink);
  font-size: .82rem;
}

.activity-types button small {
  color: #8995a5;
  font-size: .66rem;
  line-height: 1.35;
}

/* =========================================================
   DELIVERY
========================================================= */

.delivery-types {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(4, minmax(0, 1fr));
}

.delivery-types button {
  display: flex;
  min-height: 78px;
  gap: 11px;
  align-items: center;
  justify-content: flex-start;
  padding: 15px;
  border: 1px solid var(--line);
  border-radius: 14px;
  color: #607086;
  background: #fbfcfe;
  font: inherit;
  cursor: pointer;
  transition: border-color .2s ease, background .2s ease, transform .2s ease;
}

.delivery-types button:hover {
  transform: translateY(-1px);
  border-color: #c7d3df;
  background: #fff;
}

.delivery-types button.active {
  border-color: #e2bd50;
  color: #805c00;
  background: var(--gold-soft);
}

.delivery-types button strong {
  color: var(--ink);
  font-size: .8rem;
}

.delivery-types span {
  display: grid;
  min-width: 38px;
  height: 38px;
  padding: 0 5px;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 11px;
  background: #fff;
  font-size: .68rem;
  font-weight: 900;
}

/* =========================================================
   STATUS
========================================================= */

.status-selector {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr 1fr;
}

.status-selector button {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 15px;
  color: #6b7889;
  background: #fbfcfe;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color .2s ease, background .2s ease, transform .2s ease;
}

.status-selector button:hover {
  transform: translateY(-1px);
  border-color: #c7d3df;
  background: #fff;
}

.status-selector button.active {
  border-color: #c0d9cd;
  background: var(--green-soft);
  color: var(--green);
}

.status-selector button:nth-child(2).active {
  border-color: #cdd8e5;
  background: var(--blue-soft);
  color: var(--blue);
}

.status-selector button > span {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 12px;
  background: #fff;
  font-weight: 900;
}

.status-selector strong,
.status-selector small {
  display: block;
}

.status-selector strong {
  color: var(--ink);
  font-size: .86rem;
}

.status-selector small {
  margin-top: 4px;
  color: var(--muted);
  font-size: .7rem;
}

/* =========================================================
   PREVIEW
========================================================= */

.assignment-preview {
  padding: 28px;
  border: 1px solid #ead8a4;
  border-radius: 19px;
  background:
    radial-gradient(circle at 91% 8%, rgba(217, 169, 29, .13), transparent 30%),
    linear-gradient(135deg, #ffffff 0%, #fffdf7 100%);
  box-shadow: 0 10px 28px rgba(31, 48, 73, .045);
}

.assignment-preview__top {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  margin-bottom: 22px;
}

.assignment-preview__top span {
  color: #a47300;
  font-size: .64rem;
  font-weight: 900;
  letter-spacing: .13em;
}

.assignment-preview__status--draft {
  color: #5d6f83 !important;
}

.assignment-preview__body {
  display: grid;
  gap: 18px;
  align-items: start;
  grid-template-columns: auto 1fr;
}

.assignment-preview__icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border: 1px solid #e2bd50;
  border-radius: 16px;
  color: #9b7200;
  background: var(--gold-soft);
  font-size: 1.2rem;
  font-weight: 900;
}

.assignment-preview__body small {
  color: #a47300;
  font-weight: 800;
}

.assignment-preview__body h2 {
  margin: 5px 0 8px;
  color: var(--ink);
  font-size: clamp(1.45rem, 2.7vw, 2.15rem);
  letter-spacing: -.035em;
}

.assignment-preview__body p {
  max-width: 820px;
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
  white-space: pre-line;
}

.assignment-preview__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.assignment-preview__meta span {
  padding: 7px 10px;
  border: 1px solid #e3e8ee;
  border-radius: 999px;
  color: #68778a;
  background: rgba(255,255,255,.72);
  font-size: .69rem;
}

/* =========================================================
   ERROR
========================================================= */

.form-error {
  display: flex;
  gap: 13px;
  align-items: center;
  margin-bottom: 20px;
  padding: 15px 17px;
  border: 1px solid #ecc7cb;
  border-radius: 14px;
  background: #fff4f5;
}

.form-error > span {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #dd939d;
  border-radius: 11px;
  color: #a93649;
  background: #fff;
  font-weight: 900;
}

.form-error strong {
  color: #902c3e;
}

.form-error p {
  margin: 3px 0 0;
  color: #8c6170;
  font-size: .77rem;
}

/* =========================================================
   ACTIONS
========================================================= */

.form-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: flex-end;
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 12px 30px rgba(31, 48, 73, .06);
}

.cancel-button,
.publish-button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  padding: 11px 20px;
  border-radius: 11px;
  font: inherit;
  font-weight: 800;
  text-decoration: none;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}

.cancel-button {
  border: 1px solid var(--line-strong);
  color: #536276;
  background: #fff;
}

.cancel-button:hover {
  background: #f7f9fc;
}

.publish-button {
  border: 1px solid var(--wine);
  color: #fff;
  background: var(--wine);
  cursor: pointer;
  box-shadow: 0 7px 18px rgba(159, 25, 69, .16);
}

.publish-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--wine-dark);
  box-shadow: 0 10px 22px rgba(159, 25, 69, .2);
}

.publish-button:disabled {
  opacity: .4;
  cursor: not-allowed;
  box-shadow: none;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 920px) {
  .create-assignment__header {
    grid-template-columns: 1fr;
  }

  .assignment-status-card {
    width: 100%;
  }

  .activity-types {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .delivery-types {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .create-assignment__header,
  .form-section,
  .assignment-preview {
    padding: 22px;
  }

  .form-row,
  .status-selector,
  .activity-types,
  .delivery-types {
    grid-template-columns: 1fr;
  }

  .assignment-preview__body {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .cancel-button,
  .publish-button {
    width: 100%;
  }
}
</style>