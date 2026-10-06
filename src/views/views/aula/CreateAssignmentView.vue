<template>
  <section class="create-assignment amv-view-shell">
    <!-- =====================================================*
*         VOLVER*
*    ====================================================== -->
    <RouterLink
      :to="`/aula/clase/${lessonId}/trabajo`"
      class="create-assignment__back"
    >
      ← Volver a Trabajo de clase
    </RouterLink>
    <!-- =====================================================*
*         HEADER*
*    ====================================================== -->
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
    <!-- =====================================================*
*         ERROR*
*    ====================================================== -->
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
    <!-- =====================================================*
*         FORM*
*    ====================================================== -->
    <form
      class="assignment-form"
      @submit.prevent="createAssignment"
    >
      <!-- ===================================================*
*           01 · INFORMACIÓN*
*      ==================================================== -->
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
      <!-- ===================================================*
*           02 · ACTIVIDAD*
*      ==================================================== -->
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
      <!-- ===================================================*
*           03 · ENTREGA*
*      ==================================================== -->
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
      <!-- ===================================================*
*           04 · EVALUACIÓN*
*      ==================================================== -->
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
              Método, fecha y calificación
            </h2>
            <span class="form-section__hint">
              Define cómo revisarás esta entrega. La interfaz de corrección se adaptará automáticamente.
            </span>
          </div>
        </header>
        <div class="deadline-panel">
          <div class="deadline-panel__choice">
            <button type="button" :class="{ active: !form.hasDueDate }" @click="disableDueDate">
              <span>∞</span><div><strong>Sin fecha límite</strong><small>La actividad permanecerá disponible sin vencimiento.</small></div>
            </button>
            <button type="button" :class="{ active: form.hasDueDate }" @click="enableDueDate">
              <span>◷</span><div><strong>Con fecha límite</strong><small>Define el día y la hora máxima para realizar la entrega.</small></div>
            </button>
          </div>
          <div v-if="form.hasDueDate" class="deadline-panel__fields">
            <div class="form-group"><label for="due-date">Fecha</label><input id="due-date" v-model="form.dueDate" type="date" :min="todayDate" required></div>
            <div class="form-group"><label for="due-time">Hora</label><input id="due-time" v-model="form.dueTime" type="time" required></div>
            <div class="deadline-panel__notice"><strong>Recordatorios académicos</strong><span>Esta fecha podrá utilizarse en Mis tareas, Calendario, Dashboard y notificaciones de vencimiento.</span></div>
          </div>
        </div>
        <div class="form-row form-row--points">
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
      <!-- ===================================================*
*           05 · PUBLICACIÓN*
*      ==================================================== -->
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
      <!-- ===================================================*
*           PREVIEW*
*      ==================================================== -->
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
          <span v-if="dueDateTime">
            Hasta:
            {{ formattedDueDate }}
          </span>
          <span v-else>
            Sin fecha límite
          </span>
        </footer>
      </section>
      <!-- ===================================================*
*           ACCIONES*
*      ==================================================== -->
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
  hasDueDate: false,
  dueDate: '',
  dueTime: '23:59',
  points: 100,
  status: 'published',
  evaluationType: 'simple',
  rubricConfig: {}
})
/* =========================================================
     TIPOS
========================================================= */
const evaluationMethods = [
  {
    value: 'simple',
    label: 'Entrega simple',
    icon: '✓',
    description: 'Revisión y comentarios',
    detail: 'Ideal para archivos que solo necesitan ser revisados, aprobados o devueltos con retroalimentación.'
  },
  {
    value: 'graded',
    label: 'Calificada',
    icon: '7.0',
    description: 'Nota y retroalimentación',
    detail: 'Permite registrar una calificación final en escala chilena y entregar comentarios al estudiante.'
  },
  {
    value: 'vocal_rubric',
    label: 'Rúbrica vocal',
    icon: '♪',
    description: 'Evaluación de interpretación',
    detail: 'Evalúa afinación, ritmo, respiración, dicción e interpretación, además de nota y retroalimentación.'
  },
  {
    value: 'custom_rubric',
    label: 'Rúbrica personalizada',
    icon: '⚙',
    description: 'Criterios configurables',
    detail: 'Deja preparada la actividad para utilizar criterios personalizados según la asignatura o academia.'
  }
]
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
const todayDate = computed(() => {
  const now = new Date()
  const offset = now.getTimezoneOffset()
  return new Date(now.getTime() - offset * 60000).toISOString().slice(0, 10)
})
const enableDueDate = () => { form.hasDueDate = true; if (!form.dueTime) form.dueTime = '23:59' }
const disableDueDate = () => { form.hasDueDate = false; form.dueDate = ''; form.dueTime = '23:59' }
const dueDateTime = computed(() => {
  if (!form.hasDueDate || !form.dueDate || !form.dueTime) return ''
  const d = new Date(`${form.dueDate}T${form.dueTime}:00`)
  return Number.isNaN(d.getTime()) ? '' : d.toISOString()
})

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
const currentEvaluationMethod = computed(() => {
  return (
    evaluationMethods.find(
      item => item.value === form.evaluationType
    ) || evaluationMethods[0]
  )
})
const usesPoints = computed(() =>
  ['graded', 'vocal_rubric', 'custom_rubric']
    .includes(form.evaluationType)
)
const formattedDueDate = computed(() => {
  if (!dueDateTime.value) return ''
  return new Intl.DateTimeFormat('es-CL', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(dueDateTime.value))
})

const canSubmit =
  computed(() => {
    return Boolean(
      !isSaving.value &&
      lessonId.value &&
      form.title.trim() &&
      form.description.trim() &&
      form.type &&
      form.acceptedFile &&
        Number(form.points) >= 0 &&
        (!form.hasDueDate || Boolean(dueDateTime.value))
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
          dueDate: dueDateTime.value || null,
          points:
            Number(
              form.points
            ),
          status: form.status,
          evaluationType: form.evaluationType,
          rubricConfig: form.rubricConfig
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
     DESIGN SYSTEM · LIGHT LMS**
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
     HEADER**
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
     ACTIVITY TYPE**
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
     DELIVERY**
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
     STATUS**
========================================================= */
.deadline-panel{display:grid;gap:16px;margin-bottom:20px}.deadline-panel__choice{display:grid;gap:12px;grid-template-columns:repeat(2,minmax(0,1fr))}.deadline-panel__choice button{display:flex;gap:14px;align-items:center;padding:18px;border:1px solid var(--line);border-radius:15px;color:#6b7889;background:#fbfcfe;font:inherit;text-align:left;cursor:pointer}.deadline-panel__choice button:hover{border-color:#c7d3df;background:#fff}.deadline-panel__choice button.active{border-color:#e2bd50;color:#805c00;background:var(--gold-soft);box-shadow:inset 0 0 0 1px rgba(217,169,29,.12)}.deadline-panel__choice button>span{display:grid;width:42px;height:42px;flex:0 0 auto;place-items:center;border:1px solid currentColor;border-radius:12px;background:#fff;font-weight:900}.deadline-panel__choice strong,.deadline-panel__choice small{display:block}.deadline-panel__choice strong{color:var(--ink);font-size:.86rem}.deadline-panel__choice small{margin-top:4px;color:var(--muted);font-size:.7rem;line-height:1.45}.deadline-panel__fields{display:grid;gap:18px;align-items:end;grid-template-columns:minmax(0,1fr) minmax(160px,.55fr);padding:18px;border:1px solid #ead8a4;border-radius:15px;background:linear-gradient(135deg,#fffdf7,#fff)}.deadline-panel__fields .form-group{margin-bottom:0}.deadline-panel__notice{display:grid;grid-column:1/-1;gap:4px;padding:13px 14px;border:1px solid #e7dfc8;border-radius:12px;background:rgba(255,248,230,.72)}.deadline-panel__notice strong{color:#805c00;font-size:.76rem}.deadline-panel__notice span{color:#7c7154;font-size:.7rem;line-height:1.5}.form-row--points{grid-template-columns:minmax(0,1fr)}

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
     ERROR**
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
     ACTIONS**
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
     RESPONSIVE**
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
  .deadline-panel__choice,
  .deadline-panel__fields,
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


/* =========================================================
     AMV LMS UI SYSTEM · ACADEMIC EXPERIENCE v1.0**
**   Sistema visual común para el SaaS**
========================================================= */
.create-assignment {
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
.create-assignment :where(a, button, input, textarea, select, [role="button"]) {
  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
}
.create-assignment :where(a, button, input, textarea, select, [role="button"]):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}
.create-assignment :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}
.create-assignment :where(input, textarea, select) {
  font-size: max(16px, 1em);
}
.create-assignment :where(table tbody tr) {
  transition: background-color .18s ease;
}
.create-assignment :where(table tbody tr):hover {
  background-color: rgba(159, 25, 69, .025);
}
.create-assignment :where(.card, [class*="-card"], [class*="__card"]) {
  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;
}
.create-assignment :where(.card, [class*="-card"], [class*="__card"]):hover {
  border-color: rgba(159, 25, 69, .16);
}
@media (prefers-reduced-motion: reduce) {
  .create-assignment *, .create-assignment *::before, .create-assignment *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* =========================================================
     AMV LMS · FLUID MOTION & PREMIUM INTERACTION v2.0**
**   Capa visual segura: no modifica lógica, datos ni estructura.**
========================================================= */
.create-assignment {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}
.create-assignment :where(
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
  .create-assignment :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }
  .create-assignment :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }
  .create-assignment :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }
  .create-assignment :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}
.create-assignment :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}
.create-assignment :where(input, textarea, select):focus {
  transform: translateY(-1px);
}
.create-assignment :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}
.create-assignment ::selection {
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
  .create-assignment,
  .create-assignment *,
  .create-assignment *::before,
  .create-assignment *::after {
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
