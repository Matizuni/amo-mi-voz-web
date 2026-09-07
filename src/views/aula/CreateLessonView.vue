<template>
  <section class="create-lesson">
    <RouterLink
      to="/aula/programa-formativo"
      class="back-link"
    >
      <span>←</span>
      Programa formativo
    </RouterLink>

    <!-- =====================================================
         ENCABEZADO
    ====================================================== -->

    <header class="page-header">
      <div>
        <div class="eyebrow">
          <span></span>
          Gestión académica
        </div>

        <h1>
          Nueva
          <strong>clase</strong>
        </h1>

        <p>
          Diseña una sesión clara y atractiva para tus estudiantes.
          Organiza la información esencial, adjunta el material principal
          y publica cuando todo esté listo.
        </p>
      </div>

      <aside class="header-status">
        <div class="header-status__icon">
          AMV
        </div>

        <div>
          <small>Aula Virtual</small>
          <strong>
            Crear contenido
          </strong>

          <span>
            Listo para crear
          </span>
        </div>
      </aside>
    </header>

    <!-- =====================================================
         FORMULARIO
    ====================================================== -->

    <form
      class="lesson-form"
      @submit.prevent="submitLesson"
    >
      <!-- ===================================================
           CONFIGURACIÓN PRINCIPAL
      ==================================================== -->

      <section class="panel">
        <header class="panel__header">
          <div class="panel__number">
            01
          </div>

          <div>
            <span>Configuración</span>

            <h2>
              Información de la clase
            </h2>
          </div>

          <span class="required-badge">
            Esencial
          </span>
        </header>

        <!-- UNIDAD -->

        <div class="field">
          <div class="field__header">
            <label for="unit">
              Unidad formativa
            </label>

            <span>
              Organización del programa
            </span>
          </div>

          <select
            id="unit"
            v-model="form.unitId"
            :disabled="isLoadingUnits"
          >
            <option :value="null">
              Sin unidad
            </option>

            <option
              v-for="unit in units"
              :key="unit.id"
              :value="unit.id"
            >
              Unidad {{ unit.position }} · {{ unit.title }}
              {{
                unit.status === 'draft'
                  ? ' · Borrador'
                  : ''
              }}
            </option>
          </select>

          <div
            v-if="isLoadingUnits"
            class="field-message"
          >
            <span class="spinner"></span>
            Cargando unidades...
          </div>

          <div
            v-else-if="unitsError"
            class="field-error"
          >
            <span>!</span>

            <div>
              <strong>
                No pudimos cargar las unidades.
              </strong>

              <small>
                {{ unitsError }}
              </small>
            </div>

            <button
              type="button"
              @click="loadUnits"
            >
              Reintentar
            </button>
          </div>
        </div>

        <!-- TITULO -->

        <div class="field">
          <div class="field__header">
            <label for="title">
              Título
              <strong>*</strong>
            </label>

            <span>
              {{ form.title.length }}/120
            </span>
          </div>

          <input
            id="title"
            v-model.trim="form.title"
            type="text"
            maxlength="120"
            required
            autocomplete="off"
            placeholder="Ej. Respiración y apoyo"
          />
        </div>

        <!-- FECHA -->

        <div class="two-columns">
          <div class="field">
            <label for="date">
              Fecha
              <strong>*</strong>
            </label>

            <input
              id="date"
              v-model.trim="form.date"
              type="text"
              maxlength="80"
              required
              autocomplete="off"
              placeholder="Ej. 12 de septiembre"
            />
          </div>

          <div class="field">
            <label for="time">
              Horario
            </label>

            <input
              id="time"
              v-model.trim="form.time"
              type="text"
              maxlength="80"
              autocomplete="off"
              placeholder="Ej. 16:00 — 18:00"
            />
          </div>
        </div>

        <!-- DESCRIPCIÓN -->

        <div class="field">
          <div class="field__header">
            <label for="description">
              Descripción breve
            </label>

            <span>
              {{ form.description.length }}/700
            </span>
          </div>

          <textarea
            id="description"
            v-model.trim="form.description"
            rows="4"
            maxlength="700"
            placeholder="Cuéntale al estudiante qué aprenderá o trabajará en esta clase..."
          ></textarea>
        </div>
      </section>

      <!-- ===================================================
           MATERIAL PRINCIPAL
      ==================================================== -->

      <section class="panel material-panel">
        <header class="panel__header">
          <div class="panel__number">
            02
          </div>

          <div>
            <span>Contenido</span>

            <h2>
              Material principal
            </h2>
          </div>

          <span class="optional-badge">
            Recomendado
          </span>
        </header>

        <p class="panel-description">
          Sube el PDF que utilizarán tus alumnos para
          estudiar esta clase. Se asociará automáticamente
          a la sesión al momento de crearla.
        </p>

        <input
          ref="fileInput"
          class="hidden-file-input"
          type="file"
          accept=".pdf,application/pdf"
          @change="handleFileInput"
        />

        <!-- SIN ARCHIVO -->

        <button
          v-if="!selectedFile"
          type="button"
          class="drop-zone"
          :class="{
            'drop-zone--active':
              isDragging
          }"
          @click="openFilePicker"
          @dragenter.prevent="
            isDragging = true
          "
          @dragover.prevent="
            isDragging = true
          "
          @dragleave.prevent="
            isDragging = false
          "
          @drop.prevent="handleDrop"
        >
          <div class="drop-zone__icon">
            ↑
          </div>

          <strong>
            Sube el PDF de esta clase
          </strong>

          <p>
            Arrastra el archivo aquí o haz clic
            para seleccionarlo.
          </p>

          <span>
            PDF · máximo 50 MB
          </span>
        </button>

        <!-- ARCHIVO SELECCIONADO -->

        <article
          v-else
          class="selected-file"
        >
          <div class="selected-file__icon">
            PDF
          </div>

          <div class="selected-file__info">
            <small>
              Material principal
            </small>

            <strong>
              {{ selectedFile.name }}
            </strong>

            <span>
              {{ formattedFileSize }}
            </span>
          </div>

          <div class="selected-file__status">
            <span>✓</span>
            Listo
          </div>

          <div class="selected-file__actions">
            <button
              type="button"
              @click="openFilePicker"
            >
              Cambiar
            </button>

            <button
              type="button"
              class="danger-link"
              @click="removeSelectedFile"
            >
              Quitar
            </button>
          </div>
        </article>

        <div
          v-if="fileError"
          class="file-error"
        >
          <span>!</span>

          {{ fileError }}
        </div>

        <div
          v-if="selectedFile"
          class="upload-note"
        >
          <span>i</span>

          <p>
            El archivo todavía no se sube. Se cargará a
            Supabase cuando presiones
            <strong>Crear clase</strong>.
          </p>
        </div>
      </section>

      <!-- ===================================================
           PUBLICACIÓN
      ==================================================== -->

      <section class="panel">
        <header class="panel__header">
          <div class="panel__number">
            03
          </div>

          <div>
            <span>Disponibilidad</span>

            <h2>
              Publicación
            </h2>
          </div>
        </header>

        <div class="two-columns">
          <div class="field">
            <label for="status">
              Estado
            </label>

            <select
              id="status"
              v-model="form.status"
            >
              <option value="planned">
                Planificada
              </option>

              <option value="available">
                Disponible
              </option>

              <option value="published">
                Publicada
              </option>

              <option value="completed">
                Realizada
              </option>
            </select>

            <small>
              {{ statusDescription }}
            </small>
          </div>

          <div class="field">
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
        </div>

        <div class="two-columns">
          <div class="field">
            <label for="duration">
              Duración
            </label>

            <input
              id="duration"
              v-model.trim="form.duration"
              type="text"
              maxlength="60"
              placeholder="Ej. 2 horas"
            />
          </div>

          <div class="field">
            <label for="location">
              Lugar
            </label>

            <input
              id="location"
              v-model.trim="form.location"
              type="text"
              maxlength="160"
              placeholder="Lugar de la clase"
            />
          </div>
        </div>
      </section>

      <!-- ===================================================
           OPCIONES AVANZADAS
      ==================================================== -->

      <section class="advanced-section">
        <button
          type="button"
          class="advanced-toggle"
          :aria-expanded="showAdvanced"
          @click="
            showAdvanced =
              !showAdvanced
          "
        >
          <div>
            <span class="advanced-toggle__icon">
              {{ showAdvanced ? '−' : '+' }}
            </span>

            <div>
              <strong>
                Planificación docente
              </strong>

              <small>
                Objetivos, contenidos, actividades,
                repertorio y notas.
              </small>
            </div>
          </div>

          <span>
            Opcional
          </span>
        </button>

        <Transition name="advanced">
          <div
            v-if="showAdvanced"
            class="advanced-content"
          >
            <div class="field">
              <label for="focus">
                Foco pedagógico
              </label>

              <input
                id="focus"
                v-model.trim="form.focus"
                type="text"
                maxlength="160"
                placeholder="Ej. Respiración, resonancia y afinación"
              />
            </div>

            <div class="advanced-grid">
              <div class="field">
                <label for="objectives">
                  Objetivos
                </label>

                <textarea
                  id="objectives"
                  v-model="form.objectives"
                  rows="6"
                  placeholder="Un objetivo por línea..."
                ></textarea>

                <small>
                  {{ objectiveList.length }}
                  objetivos
                </small>
              </div>

              <div class="field">
                <label for="contents">
                  Contenidos
                </label>

                <textarea
                  id="contents"
                  v-model="form.contents"
                  rows="6"
                  placeholder="Un contenido por línea..."
                ></textarea>

                <small>
                  {{ contentList.length }}
                  contenidos
                </small>
              </div>

              <div class="field">
                <label for="activities">
                  Actividades
                </label>

                <textarea
                  id="activities"
                  v-model="form.activities"
                  rows="6"
                  placeholder="Una actividad por línea..."
                ></textarea>

                <small>
                  {{ activityList.length }}
                  actividades
                </small>
              </div>

              <div class="field">
                <label for="repertoire">
                  Repertorio
                </label>

                <textarea
                  id="repertoire"
                  v-model="form.repertoire"
                  rows="6"
                  placeholder="Una obra por línea..."
                ></textarea>

                <small>
                  {{ repertoireList.length }}
                  obras
                </small>
              </div>
            </div>

            <div class="field">
              <label for="notes">
                Notas privadas del profesor
              </label>

              <textarea
                id="notes"
                v-model.trim="form.notes"
                rows="5"
                maxlength="1600"
                placeholder="Observaciones internas sobre la clase..."
              ></textarea>
            </div>
          </div>
        </Transition>
      </section>

      <!-- ===================================================
           VISTA PREVIA
      ==================================================== -->

      <section class="preview">
        <header class="preview__header">
          <div>
            <span>
              Vista previa
            </span>

            <h2>
              {{
                form.title ||
                'Título de la clase'
              }}
            </h2>
          </div>

          <span class="status-pill">
            {{ statusLabel }}
          </span>
        </header>

        <div class="preview__meta">
          <span>
            {{
              selectedUnit
                ? `Unidad ${selectedUnit.position} · ${selectedUnit.title}`
                : 'Sin unidad'
            }}
          </span>

          <span>
            {{
              form.date ||
              'Fecha por definir'
            }}
          </span>

          <span v-if="form.modality">
            {{ form.modality }}
          </span>
        </div>

        <p>
          {{
            form.description ||
            'La descripción de la clase aparecerá aquí.'
          }}
        </p>

        <article
          v-if="selectedFile"
          class="preview-material"
        >
          <div>
            <span>
              PDF
            </span>
          </div>

          <section>
            <small>
              Material de la clase
            </small>

            <strong>
              {{ selectedFile.name }}
            </strong>

            <span>
              {{ formattedFileSize }}
            </span>
          </section>

          <span class="preview-material__ready">
            Listo
          </span>
        </article>

        <div
          v-else
          class="preview-empty"
        >
          Esta clase todavía no tiene material principal.
        </div>
      </section>

      <!-- ===================================================
           ERROR GENERAL
      ==================================================== -->

      <div
        v-if="errorMessage"
        class="global-error"
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

      <!-- ===================================================
           ESTADO DE GUARDADO
      ==================================================== -->

      <div
        v-if="isSaving"
        class="saving-progress"
      >
        <div class="saving-progress__spinner">
        </div>

        <div>
          <strong>
            {{ savingLabel }}
          </strong>

          <p>
            No cierres esta ventana mientras
            terminamos el proceso.
          </p>
        </div>
      </div>

      <!-- ===================================================
           ACCIONES
      ==================================================== -->

      <footer class="actions">
        <div>
          <strong>
            {{
              canSubmit
                ? 'Todo listo'
                : 'Falta información'
            }}
          </strong>

          <small>
            {{
              canSubmit
                ? selectedFile
                  ? 'La clase y su PDF se guardarán juntos.'
                  : 'Puedes crear la clase sin PDF y agregarlo después.'
                : 'Completa título y fecha para continuar.'
            }}
          </small>
        </div>

        <section>
          <RouterLink
            to="/aula/programa-formativo"
            class="cancel-button"
          >
            Cancelar
          </RouterLink>

          <button
            class="save-button"
            type="submit"
            :disabled="
              !canSubmit ||
              isSaving
            "
          >
            <span
              v-if="isSaving"
              class="button-spinner"
            ></span>

            {{
              isSaving
                ? 'Guardando...'
                : 'Crear clase'
            }}
          </button>
        </section>
      </footer>
    </form>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
} from 'vue'

import {
  RouterLink,
  useRouter,
} from 'vue-router'

import {
  insertLesson,
  removeLesson,
} from '@/services/lessonService'

import {
  fetchUnits,
} from '@/services/unitService'

import {
  createMaterialFromFile,
} from '@/services/materialService'

const router = useRouter()

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const MAX_PDF_SIZE =
  50 * 1024 * 1024

/* =========================================================
   ESTADO
========================================================= */

const units = ref([])
const isLoadingUnits = ref(true)
const unitsError = ref('')

const selectedFile = ref(null)
const fileInput = ref(null)
const fileError = ref('')
const isDragging = ref(false)

const showAdvanced = ref(false)

const isSaving = ref(false)
const savingStage = ref('')
const errorMessage = ref('')

/* =========================================================
   FORMULARIO
========================================================= */

const form = reactive({
  unitId: null,

  title: '',
  date: '',
  time: '',

  description: '',

  status: 'published',

  duration: '2 horas',

  modality: 'Presencial',

  location:
    'Pueblito Artesanal La Calera',

  focus: '',

  objectives: '',
  contents: '',
  activities: '',
  repertoire: '',

  notes: '',
})

/* =========================================================
   LISTAS
========================================================= */

const parseLines = value => {
  return String(
    value ||
    '',
  )
    .split('\n')
    .map(item =>
      item.trim(),
    )
    .filter(Boolean)
}

const objectiveList =
  computed(() =>
    parseLines(
      form.objectives,
    ),
  )

const contentList =
  computed(() =>
    parseLines(
      form.contents,
    ),
  )

const activityList =
  computed(() =>
    parseLines(
      form.activities,
    ),
  )

const repertoireList =
  computed(() =>
    parseLines(
      form.repertoire,
    ),
  )

/* =========================================================
   UNIDADES
========================================================= */

const loadUnits = async () => {
  isLoadingUnits.value = true
  unitsError.value = ''

  try {
    units.value =
      await fetchUnits()
  } catch (error) {
    console.error(
      'Error cargando unidades:',
      error,
    )

    unitsError.value =
      error?.message ||
      'No fue posible cargar las unidades.'
  } finally {
    isLoadingUnits.value = false
  }
}

const selectedUnit =
  computed(() => {
    if (!form.unitId) {
      return null
    }

    return (
      units.value.find(
        unit =>
          Number(unit.id) ===
          Number(form.unitId),
      ) ||
      null
    )
  })

/* =========================================================
   PDF
========================================================= */

const validatePdf = file => {
  fileError.value = ''

  if (!file) {
    return false
  }

  const fileName =
    String(
      file.name ||
      '',
    ).toLowerCase()

  const isPdf =
    file.type ===
      'application/pdf' ||
    fileName.endsWith(
      '.pdf',
    )

  if (!isPdf) {
    fileError.value =
      'El material principal debe ser un archivo PDF.'

    return false
  }

  if (
    Number(file.size) >
    MAX_PDF_SIZE
  ) {
    fileError.value =
      'El PDF supera el límite de 50 MB.'

    return false
  }

  return true
}

const selectPdf = file => {
  if (
    !validatePdf(file)
  ) {
    selectedFile.value =
      null

    return
  }

  selectedFile.value =
    file
}

const openFilePicker = () => {
  if (
    isSaving.value
  ) {
    return
  }

  fileInput.value?.click()
}

const handleFileInput = event => {
  const file =
    event.target
      ?.files
      ?.[0]

  selectPdf(file)

  /*
   * Permitimos seleccionar
   * nuevamente el mismo archivo
   * si el profesor lo quitó.
   */
  event.target.value = ''
}

const handleDrop = event => {
  isDragging.value =
    false

  if (
    isSaving.value
  ) {
    return
  }

  const file =
    event
      .dataTransfer
      ?.files
      ?.[0]

  selectPdf(file)
}

const removeSelectedFile = () => {
  if (
    isSaving.value
  ) {
    return
  }

  selectedFile.value =
    null

  fileError.value = ''
}

const formattedFileSize =
  computed(() => {
    if (
      !selectedFile.value
    ) {
      return ''
    }

    const bytes =
      Number(
        selectedFile
          .value
          .size ||
        0,
      )

    if (
      bytes <
      1024
    ) {
      return `${bytes} B`
    }

    if (
      bytes <
      1024 * 1024
    ) {
      return `${(
        bytes /
        1024
      ).toFixed(1)} KB`
    }

    return `${(
      bytes /
      (
        1024 *
        1024
      )
    ).toFixed(1)} MB`
  })

/* =========================================================
   ESTADO
========================================================= */

const canSubmit =
  computed(() => {
    return Boolean(
      form.title.trim() &&
      form.date.trim(),
    )
  })

const statusLabel =
  computed(() => {
    const labels = {
      planned:
        'Planificada',

      available:
        'Disponible',

      published:
        'Publicada',

      completed:
        'Realizada',
    }

    return (
      labels[
        form.status
      ] ||
      'Publicada'
    )
  })

const statusDescription =
  computed(() => {
    const descriptions = {
      planned:
        'La clase permanecerá en preparación.',

      available:
        'La clase estará disponible dentro del programa.',

      published:
        'La clase quedará publicada para los estudiantes.',

      completed:
        'Marca una sesión que ya fue realizada.',
    }

    return (
      descriptions[
        form.status
      ] ||
      ''
    )
  })

const savingLabel =
  computed(() => {
    const labels = {
      lesson:
        'Creando la clase...',

      material:
        'Subiendo el PDF...',

      metadata:
        'Organizando el contenido...',

      redirect:
        'Terminando...',
    }

    return (
      labels[
        savingStage.value
      ] ||
      'Guardando...'
    )
  })

/* =========================================================
   CREAR CLASE
========================================================= */

const submitLesson =
  async () => {
    if (
      !canSubmit.value ||
      isSaving.value
    ) {
      return
    }

    isSaving.value = true
    errorMessage.value = ''

    let createdLesson =
      null

    try {
      /*
       * PASO 1
       * Crear la clase.
       */
      savingStage.value =
        'lesson'

      createdLesson =
        await insertLesson({
          unitId:
            form.unitId
              ? Number(
                  form.unitId,
                )
              : null,

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
            '',

          notes:
            form.notes.trim(),
        })

      /*
       * PASO 2
       * Si hay PDF,
       * subirlo y crear material.
       */
      if (
        selectedFile.value
      ) {
        savingStage.value =
          'material'

        await createMaterialFromFile({
          file:
            selectedFile.value,

          lessonId:
            createdLesson.id,

          title:
            `Material principal · ${form.title.trim()}`,

          description:
            'Material principal de la clase.',

          type:
            'pdf',

          voice:
            'general',

          folder:
            'material-principal',
        })
      }

      /*
       * PASO 3
       * Navegar a la clase.
       */
      savingStage.value =
        'redirect'

      await router.push(
        `/aula/clase/${createdLesson.id}`,
      )
    } catch (error) {
      console.error(
        'Error creando la clase:',
        error,
      )

      /*
       * Si habíamos creado la clase
       * pero falló la subida del material,
       * intentamos revertir la clase
       * para evitar registros incompletos.
       */
      if (
        createdLesson?.id
      ) {
        try {
          await removeLesson(
            createdLesson.id,
          )
        } catch (
          rollbackError
        ) {
          console.error(
            'No se pudo revertir la clase:',
            rollbackError,
          )
        }
      }

      errorMessage.value =
        error?.message ||
        'No fue posible crear la clase.'
    } finally {
      isSaving.value = false
      savingStage.value = ''
    }
  }

/* =========================================================
   INICIO
========================================================= */

onMounted(() => {
  loadUnits()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.create-lesson {
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding-bottom: 6rem;
}

/* =========================================================
   VOLVER
========================================================= */

.back-link {
  display: inline-flex;
  gap: 0.55rem;
  align-items: center;
  margin-bottom: 1.5rem;
  color: variables.$color-primary;
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;
}

.back-link span {
  transition:
    transform
    0.18s ease;
}

.back-link:hover span {
  transform:
    translateX(-3px);
}

/* =========================================================
   HEADER
========================================================= */

.page-header {
  position: relative;
  display: grid;
  gap: 2rem;
  grid-template-columns:
    minmax(0, 1fr)
    280px;
  align-items: end;
  margin-bottom: 1.4rem;
  padding: 2.5rem;
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 88% 8%,
      rgba(
        255,
        196,
        0,
        0.13
      ),
      transparent 32%
    ),
    variables.$color-surface;
}

.page-header::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 105px;
  height: 3px;
  background:
    variables.$color-primary;
  content: '';
}

.eyebrow {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  margin-bottom: 1rem;
  color:
    variables.$color-primary;
  font-size: 0.67rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.eyebrow span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background:
    variables.$color-primary;
  box-shadow:
    0 0 0 5px
    rgba(
      255,
      196,
      0,
      0.08
    );
}

.page-header h1 {
  margin: 0;
  font-size:
    clamp(
      3rem,
      7vw,
      5.2rem
    );
  line-height: 0.92;
  letter-spacing: -0.05em;
}

.page-header h1 strong {
  display: block;
  color:
    variables.$color-primary;
}

.page-header p {
  max-width: 620px;
  margin:
    1.2rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.5
    );
  line-height: 1.7;
}

/* =========================================================
   HEADER STATUS
========================================================= */

.header-status {
  display: flex;
  gap: 0.9rem;
  padding: 1rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.25
    );
  border-radius: 16px;
  background:
    rgba(
      255,
      196,
      0,
      0.035
    );
}

.header-status__icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 12px;
  color:
    variables.$color-primary;
  font-size: 0.63rem;
  font-weight: 900;
}

.header-status small,
.header-status strong,
.header-status span {
  display: block;
}

.header-status small {
  color:
    variables.$color-primary;
  font-size: 0.59rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.header-status strong {
  margin-top: 0.15rem;
  font-size: 0.8rem;
}

.header-status span {
  margin-top: 0.15rem;
  color:
    rgba(
      255,
      255,
      255,
      0.32
    );
  font-size: 0.62rem;
}

/* =========================================================
   FORM
========================================================= */

.lesson-form {
  display: grid;
  gap: 1.2rem;
}

/* =========================================================
   PANEL
========================================================= */

.panel {
  padding: 2rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 20px;
  background:
    variables.$color-surface;
}

.panel__header {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    auto
    1fr
    auto;
  align-items: center;
  margin-bottom: 1.8rem;
  padding-bottom: 1.1rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.panel__number {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.45
    );
  border-radius: 13px;
  color:
    variables.$color-primary;
  font-size: 0.7rem;
  font-weight: 900;
}

.panel__header > div:nth-child(2) span {
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 800;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.panel__header h2 {
  margin:
    0.2rem
    0
    0;
  font-size: 1.45rem;
}

.required-badge,
.optional-badge {
  padding:
    0.35rem
    0.6rem;
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 800;
}

.required-badge {
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.35
    );
  color:
    variables.$color-primary;
}

.optional-badge {
  border:
    1px solid
    variables.$color-border;
  color:
    rgba(
      255,
      255,
      255,
      0.38
    );
}

.panel-description {
  max-width: 750px;
  margin:
    -0.3rem
    0
    1.4rem;
  color:
    rgba(
      255,
      255,
      255,
      0.43
    );
  font-size: 0.78rem;
  line-height: 1.65;
}

/* =========================================================
   FIELDS
========================================================= */

.field {
  display: grid;
  gap: 0.55rem;
  margin-bottom: 1.3rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field__header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content:
    space-between;
}

.field label {
  color:
    rgba(
      255,
      255,
      255,
      0.78
    );
  font-size: 0.76rem;
  font-weight: 800;
}

.field label strong {
  color:
    variables.$color-primary;
}

.field__header > span {
  color:
    rgba(
      255,
      255,
      255,
      0.28
    );
  font-size: 0.62rem;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding:
    0.85rem
    0.95rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  outline: none;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
  transition:
    border-color
      0.18s ease,
    box-shadow
      0.18s ease;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color:
    variables.$color-primary;
  box-shadow:
    0 0 0 3px
    rgba(
      255,
      196,
      0,
      0.06
    );
}

.field input::placeholder,
.field textarea::placeholder {
  color:
    rgba(
      255,
      255,
      255,
      0.22
    );
}

.field textarea {
  line-height: 1.6;
  resize: vertical;
}

.field small {
  color:
    rgba(
      255,
      255,
      255,
      0.33
    );
  font-size: 0.64rem;
  line-height: 1.5;
}

.two-columns,
.advanced-grid {
  display: grid;
  gap: 1.1rem;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

/* =========================================================
   UNITS
========================================================= */

.field-message {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.67rem;
}

.spinner,
.button-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border:
    2px solid
    rgba(
      255,
      255,
      255,
      0.16
    );
  border-top-color:
    currentColor;
  border-radius: 50%;
  animation:
    spin
    0.7s
    linear
    infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

.field-error {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.8rem;
  border:
    1px solid
    rgba(
      255,
      100,
      100,
      0.28
    );
  border-radius: 10px;
  color: #ff7979;
  font-size: 0.68rem;
}

.field-error > span {
  display: grid;
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    currentColor;
  border-radius: 50%;
}

.field-error strong,
.field-error small {
  display: block;
}

.field-error small {
  margin-top: 0.2rem;
}

.field-error button {
  margin-left: auto;
  border: 0;
  background: none;
  color: inherit;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

/* =========================================================
   FILE DROP
========================================================= */

.hidden-file-input {
  display: none;
}

.drop-zone {
  display: grid;
  width: 100%;
  min-height: 230px;
  place-items: center;
  padding: 2rem;
  border:
    1px dashed
    rgba(
      255,
      196,
      0,
      0.4
    );
  border-radius: 17px;
  background:
    linear-gradient(
      145deg,
      rgba(
        255,
        196,
        0,
        0.035
      ),
      transparent
    );
  color:
    variables.$color-white;
  text-align: center;
  cursor: pointer;
  transition:
    border-color
      0.18s ease,
    background
      0.18s ease,
    transform
      0.18s ease;
}

.drop-zone:hover,
.drop-zone--active {
  border-color:
    variables.$color-primary;
  background:
    rgba(
      255,
      196,
      0,
      0.07
    );
}

.drop-zone--active {
  transform:
    scale(1.005);
}

.drop-zone__icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  margin-bottom: 0.8rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 17px;
  color:
    variables.$color-primary;
  font-size: 1.45rem;
}

.drop-zone strong {
  display: block;
  font-size: 1rem;
}

.drop-zone p {
  margin:
    0.4rem
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.42
    );
  font-size: 0.75rem;
}

.drop-zone > span {
  color:
    rgba(
      255,
      255,
      255,
      0.26
    );
  font-size: 0.62rem;
}

/* =========================================================
   SELECTED FILE
========================================================= */

.selected-file {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto
    auto;
  align-items: center;
  padding: 1rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.25
    );
  border-radius: 14px;
  background:
    rgba(
      255,
      196,
      0,
      0.025
    );
}

.selected-file__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 12px;
  color:
    variables.$color-primary;
  font-size: 0.63rem;
  font-weight: 900;
}

.selected-file__info small,
.selected-file__info strong,
.selected-file__info span {
  display: block;
}

.selected-file__info small {
  color:
    variables.$color-primary;
  font-size: 0.59rem;
  text-transform: uppercase;
}

.selected-file__info strong {
  margin-top: 0.2rem;
  overflow-wrap: anywhere;
  font-size: 0.8rem;
}

.selected-file__info span {
  margin-top: 0.15rem;
  color:
    rgba(
      255,
      255,
      255,
      0.35
    );
  font-size: 0.62rem;
}

.selected-file__status {
  display: flex;
  gap: 0.3rem;
  align-items: center;
  color:
    variables.$color-primary;
  font-size: 0.66rem;
  font-weight: 800;
}

.selected-file__status span {
  display: grid;
  width: 19px;
  height: 19px;
  place-items: center;
  border:
    1px solid
    currentColor;
  border-radius: 50%;
}

.selected-file__actions {
  display: flex;
  gap: 0.3rem;
}

.selected-file__actions button {
  padding:
    0.45rem
    0.55rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  background: transparent;
  color:
    variables.$color-white;
  font: inherit;
  font-size: 0.64rem;
  cursor: pointer;
}

.selected-file__actions .danger-link {
  color: #ff7a7a;
}

.file-error {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.8rem;
  color: #ff7a7a;
  font-size: 0.68rem;
}

.upload-note {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  margin-top: 0.9rem;
  padding: 0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
}

.upload-note > span {
  display: grid;
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 0.65rem;
}

.upload-note p {
  margin: 0;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.68rem;
  line-height: 1.55;
}

/* =========================================================
   ADVANCED
========================================================= */

.advanced-section {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 18px;
  background:
    variables.$color-surface;
}

.advanced-toggle {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content:
    space-between;
  padding: 1.15rem 1.3rem;
  border: 0;
  background: transparent;
  color:
    variables.$color-white;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.advanced-toggle > div {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.advanced-toggle__icon {
  display: grid;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.35
    );
  border-radius: 10px;
  color:
    variables.$color-primary;
  font-size: 1rem;
}

.advanced-toggle strong,
.advanced-toggle small {
  display: block;
}

.advanced-toggle strong {
  font-size: 0.8rem;
}

.advanced-toggle small {
  margin-top: 0.15rem;
  color:
    rgba(
      255,
      255,
      255,
      0.32
    );
  font-size: 0.63rem;
}

.advanced-toggle > span {
  color:
    rgba(
      255,
      255,
      255,
      0.28
    );
  font-size: 0.62rem;
}

.advanced-content {
  padding: 1.4rem;
  border-top:
    1px solid
    variables.$color-border;
}

.advanced-enter-active,
.advanced-leave-active {
  transition:
    opacity
      0.2s ease,
    transform
      0.2s ease;
}

.advanced-enter-from,
.advanced-leave-to {
  opacity: 0;
  transform:
    translateY(-8px);
}

/* =========================================================
   PREVIEW
========================================================= */

.preview {
  padding: 2rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.3
    );
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(
        255,
        196,
        0,
        0.08
      ),
      transparent 35%
    ),
    variables.$color-surface;
}

.preview__header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content:
    space-between;
}

.preview__header > div > span {
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.preview h2 {
  margin:
    0.35rem
    0
    0;
  font-size:
    clamp(
      1.6rem,
      4vw,
      2.2rem
    );
}

.status-pill {
  padding:
    0.35rem
    0.6rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.35
    );
  border-radius: 999px;
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 800;
}

.preview__meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.preview__meta span {
  padding:
    0.35rem
    0.55rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.63rem;
}

.preview > p {
  max-width: 760px;
  margin:
    1rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
  line-height: 1.65;
}

.preview-material {
  display: grid;
  gap: 0.8rem;
  grid-template-columns:
    auto
    1fr
    auto;
  align-items: center;
  margin-top: 1.2rem;
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 13px;
  background:
    variables.$color-background;
}

.preview-material > div {
  display: grid;
  width: 43px;
  height: 43px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 11px;
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
}

.preview-material section small,
.preview-material section strong,
.preview-material section span {
  display: block;
}

.preview-material section small {
  color:
    variables.$color-primary;
  font-size: 0.58rem;
}

.preview-material section strong {
  margin-top: 0.15rem;
  font-size: 0.76rem;
  overflow-wrap: anywhere;
}

.preview-material section span {
  margin-top: 0.12rem;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.6rem;
}

.preview-material__ready {
  color:
    variables.$color-primary;
  font-size: 0.65rem;
  font-weight: 800;
}

.preview-empty {
  margin-top: 1rem;
  padding: 1rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 11px;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.68rem;
}

/* =========================================================
   ERROR / SAVING
========================================================= */

.global-error,
.saving-progress {
  display: flex;
  gap: 0.8rem;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 13px;
}

.global-error {
  border:
    1px solid
    rgba(
      255,
      90,
      90,
      0.34
    );
  background:
    rgba(
      255,
      90,
      90,
      0.05
    );
  color: #ff7878;
}

.global-error > span {
  display: grid;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    currentColor;
  border-radius: 50%;
}

.global-error strong,
.global-error p,
.saving-progress strong,
.saving-progress p {
  display: block;
}

.global-error p,
.saving-progress p {
  margin:
    0.2rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.68rem;
}

.saving-progress {
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.28
    );
  background:
    rgba(
      255,
      196,
      0,
      0.035
    );
}

.saving-progress__spinner {
  width: 31px;
  height: 31px;
  flex-shrink: 0;
  border:
    3px solid
    rgba(
      255,
      196,
      0,
      0.12
    );
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin
    0.7s
    linear
    infinite;
}

/* =========================================================
   ACTIONS
========================================================= */

.actions {
  position: sticky;
  bottom: 1rem;
  z-index: 10;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content:
    space-between;
  padding: 1rem 1.15rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 15px;
  background:
    rgba(
      17,
      17,
      17,
      0.96
    );
  box-shadow:
    0 20px 50px
    rgba(
      0,
      0,
      0,
      0.38
    );
  backdrop-filter:
    blur(14px);
}

.actions > div strong,
.actions > div small {
  display: block;
}

.actions > div strong {
  font-size: 0.77rem;
}

.actions > div small {
  margin-top: 0.15rem;
  color:
    rgba(
      255,
      255,
      255,
      0.33
    );
  font-size: 0.62rem;
}

.actions > section {
  display: flex;
  gap: 0.55rem;
}

.cancel-button,
.save-button {
  display: inline-flex;
  min-height: 43px;
  gap: 0.45rem;
  align-items: center;
  justify-content: center;
  padding:
    0.7rem
    1rem;
  border-radius: 10px;
  font: inherit;
  font-size: 0.74rem;
  font-weight: 800;
  text-decoration: none;
}

.cancel-button {
  border:
    1px solid
    variables.$color-border;
  color:
    variables.$color-white;
}

.save-button {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #080808;
  cursor: pointer;
}

.save-button:disabled {
  opacity: 0.4;
  cursor: default;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (
  max-width: 900px
) {
  .page-header {
    grid-template-columns:
      1fr;
  }

  .header-status {
    max-width: 430px;
  }

  .selected-file {
    grid-template-columns:
      auto
      minmax(0, 1fr);
  }

  .selected-file__status,
  .selected-file__actions {
    grid-column: 2;
  }
}

@media (
  max-width: 700px
) {
  .page-header,
  .panel,
  .preview {
    padding: 1.35rem;
  }

  .two-columns,
  .advanced-grid {
    grid-template-columns:
      1fr;
    gap: 0;
  }

  .panel__header {
    grid-template-columns:
      auto
      1fr;
  }

  .required-badge,
  .optional-badge {
    grid-column:
      1 / -1;
    width: fit-content;
  }

  .actions {
    position: static;
    align-items: stretch;
    flex-direction: column;
  }

  .actions > section {
    width: 100%;
  }

  .cancel-button,
  .save-button {
    flex: 1;
  }
}

@media (
  max-width: 500px
) {
  .page-header {
    border-radius: 18px;
  }

  .page-header h1 {
    font-size:
      clamp(
        2.6rem,
        14vw,
        4rem
      );
  }

  .panel {
    padding: 1.1rem;
  }

  .drop-zone {
    min-height: 200px;
    padding: 1.3rem;
  }

  .selected-file {
    grid-template-columns:
      1fr;
    text-align: left;
  }

  .selected-file__status,
  .selected-file__actions {
    grid-column: 1;
  }

  .preview__header {
    flex-direction: column;
  }

  .preview-material {
    grid-template-columns:
      auto
      1fr;
  }

  .preview-material__ready {
    grid-column: 2;
  }

  .advanced-toggle {
    align-items: flex-start;
  }

  .advanced-toggle > span {
    display: none;
  }

  .actions > section {
    flex-direction: column;
  }

  .cancel-button,
  .save-button {
    width: 100%;
  }
}


/* =========================================================
   V5.8 · LIGHT LMS VISUAL SYSTEM
   Overrides visuales: mantiene intacta toda la lógica.
========================================================= */

.create-lesson {
  --ink: #152033;
  --muted: #6f7c8f;
  --muted-2: #8a97a9;
  --line: #dbe3ec;
  --line-strong: #cbd6e2;
  --surface: #ffffff;
  --surface-soft: #f7f9fc;
  --surface-blue: #eef4fa;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-dark: #a97800;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #eef8f3;
  color: var(--ink);
}

/* VOLVER */
.back-link {
  color: var(--wine);
}

.back-link:hover {
  color: var(--wine-dark);
}

/* HEADER */
.page-header {
  border-color: var(--line);
  background:
    radial-gradient(circle at 90% 8%, rgba(217, 169, 29, .13), transparent 31%),
    linear-gradient(135deg, #ffffff 0%, #fbfcfe 62%, #f8f3e6 100%);
  box-shadow: 0 14px 36px rgba(31, 48, 73, .06);
}

.page-header::before {
  background: linear-gradient(90deg, var(--wine), var(--gold));
}

.eyebrow {
  color: var(--gold-dark);
}

.eyebrow span {
  background: var(--gold);
  box-shadow: 0 0 0 5px rgba(217, 169, 29, .10);
}

.page-header h1 {
  color: var(--ink);
}

.page-header h1 strong {
  color: var(--wine);
}

.page-header p {
  color: var(--muted);
}

.header-status {
  border-color: #e7d5a0;
  background: rgba(255, 252, 242, .9);
  box-shadow: 0 8px 20px rgba(31, 48, 73, .04);
}

.header-status__icon {
  border-color: #e0bd55;
  color: var(--gold-dark);
  background: #fff;
}

.header-status small {
  color: var(--gold-dark);
}

.header-status strong {
  color: var(--ink);
}

.header-status span {
  color: var(--muted);
}

/* PANELES */
.panel {
  border-color: var(--line);
  background: var(--surface);
  box-shadow: 0 10px 28px rgba(31, 48, 73, .045);
}

.panel__header {
  border-bottom-color: #e8edf3;
}

.panel__number {
  border-color: #ead17d;
  color: var(--gold-dark);
  background: var(--gold-soft);
}

.panel__header > div:nth-child(2) span {
  color: var(--gold-dark);
}

.panel__header h2 {
  color: var(--ink);
}

.required-badge,
.optional-badge {
  border-color: #e5d9b3;
  color: #856400;
  background: #fffaf0;
}

.panel-description {
  color: var(--muted);
}

/* CAMPOS */
.field label {
  color: #334258;
}

.field label strong {
  color: var(--wine);
}

.field__header > span,
.field small {
  color: var(--muted-2);
}

.field input,
.field textarea,
.field select {
  border: 1px solid var(--line-strong);
  color: var(--ink);
  background: #fbfcfe;
  box-shadow: none;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #9aa6b7;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color: #aec0d3;
  outline: none;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(63, 111, 168, .08);
}

/* MENSAJES DE UNIDADES */
.field-message {
  color: var(--muted);
}

.field-error,
.file-error,
.global-error {
  border-color: #ecc7cb;
  color: #8d3042;
  background: #fff4f5;
}

.field-error > span,
.global-error > span {
  color: #a93649;
  background: #fff;
  border-color: #dd939d;
}

.field-error small,
.global-error p {
  color: #8c6170;
}

.field-error button {
  border-color: #ddb2b9;
  color: #9d3447;
  background: #fff;
}

/* PDF */
.drop-zone {
  border-color: #d8c16e;
  color: var(--ink);
  background:
    linear-gradient(135deg, #fffdf8, #fffaf0);
}

.drop-zone:hover,
.drop-zone--active {
  border-color: var(--gold);
  background: #fff8e6;
  box-shadow: 0 8px 24px rgba(217, 169, 29, .08);
}

.drop-zone__icon {
  border-color: #dfbd50;
  color: var(--gold-dark);
  background: #fff;
}

.drop-zone strong {
  color: var(--ink);
}

.drop-zone p,
.drop-zone > span {
  color: var(--muted);
}

.selected-file {
  border-color: #e2d4a4;
  background: #fffdf7;
}

.selected-file__icon {
  border-color: #e0bd55;
  color: var(--gold-dark);
  background: var(--gold-soft);
}

.selected-file__info small {
  color: var(--gold-dark);
}

.selected-file__info strong {
  color: var(--ink);
}

.selected-file__info span {
  color: var(--muted);
}

.selected-file__status {
  color: var(--green);
}

.selected-file__status span {
  color: #fff;
  background: var(--green);
}

.selected-file__actions button {
  border-color: var(--line-strong);
  color: #536276;
  background: #fff;
}

.selected-file__actions button:hover {
  background: #f7f9fc;
}

.selected-file__actions .danger-link {
  border-color: #ebc5cb;
  color: #a93649;
  background: #fff7f8;
}

.upload-note {
  border-color: #cfe3f5;
  background: #f3f8fd;
}

.upload-note > span {
  color: #3e6d9f;
  background: #e6f0fa;
}

.upload-note p {
  color: #60748b;
}

/* AVANZADO */
.advanced-section {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: var(--surface);
  box-shadow: 0 9px 25px rgba(31, 48, 73, .04);
}

.advanced-toggle {
  color: var(--ink);
  background: transparent;
}

.advanced-toggle:hover {
  background: #fbfcfe;
}

.advanced-toggle__icon {
  border-color: #e0bd55;
  color: var(--gold-dark);
  background: var(--gold-soft);
}

.advanced-toggle strong {
  color: var(--ink);
}

.advanced-toggle small,
.advanced-toggle > span {
  color: var(--muted);
}

.advanced-content {
  border-top-color: #e8edf3;
  background: #fbfcfe;
}

/* PREVIEW */
.preview {
  border-color: #ead8a4;
  background:
    radial-gradient(circle at 90% 7%, rgba(217, 169, 29, .12), transparent 30%),
    linear-gradient(135deg, #ffffff 0%, #fffdf7 100%);
  box-shadow: 0 10px 28px rgba(31, 48, 73, .045);
}

.preview__header > div > span {
  color: var(--gold-dark);
}

.preview h2 {
  color: var(--ink);
}

.status-pill {
  border-color: #e1bd50;
  color: #8b6600;
  background: var(--gold-soft);
}

.preview__meta span {
  border-color: #e1e7ee;
  color: #66768a;
  background: rgba(255, 255, 255, .8);
}

.preview > p {
  color: var(--muted);
}

.preview-material {
  border-color: #e3d6a9;
  background: #fffdf8;
}

.preview-material > div {
  border-color: #e0bd55;
  color: var(--gold-dark);
  background: var(--gold-soft);
}

.preview-material section small {
  color: var(--gold-dark);
}

.preview-material section strong {
  color: var(--ink);
}

.preview-material section span {
  color: var(--muted);
}

.preview-material__ready {
  color: var(--green);
}

.preview-empty {
  border-color: #dfe6ee;
  color: var(--muted);
  background: #f8fafc;
}

/* GUARDANDO */
.saving-progress {
  border-color: #cfe3f5;
  background: #f3f8fd;
}

.saving-progress strong {
  color: #345d89;
}

.saving-progress p {
  color: #6b7f93;
}

.saving-progress__spinner {
  border-color: #d5e3f1;
  border-top-color: #4b78a8;
}

/* ACCIONES */
.actions {
  border-color: var(--line);
  background: rgba(255, 255, 255, .97);
  box-shadow: 0 16px 35px rgba(31, 48, 73, .08);
}

.actions > div strong {
  color: var(--ink);
}

.actions > div small {
  color: var(--muted);
}

.cancel-button {
  border-color: var(--line-strong);
  color: #536276;
  background: #fff;
}

.cancel-button:hover {
  background: #f7f9fc;
}

.save-button {
  border-color: var(--wine);
  color: #fff;
  background: var(--wine);
  box-shadow: 0 7px 18px rgba(159, 25, 69, .18);
}

.save-button:hover:not(:disabled) {
  background: var(--wine-dark);
  box-shadow: 0 10px 24px rgba(159, 25, 69, .22);
}

.save-button:disabled {
  border-color: #d9dee6;
  color: #9da7b3;
  background: #eef1f5;
  box-shadow: none;
}

/* RESPONSIVE */
@media (max-width: 860px) {
  .page-header {
    grid-template-columns: 1fr;
  }

  .header-status {
    width: 100%;
  }
}

@media (max-width: 700px) {
  .page-header,
  .panel,
  .preview {
    padding: 1.35rem;
  }

  .two-columns,
  .advanced-grid {
    grid-template-columns: 1fr;
  }

  .panel__header {
    grid-template-columns: auto 1fr;
  }

  .required-badge,
  .optional-badge {
    grid-column: 2;
    justify-self: start;
  }

  .actions {
    align-items: stretch;
    flex-direction: column;
  }

  .actions > section {
    width: 100%;
  }

  .cancel-button,
  .save-button {
    flex: 1;
  }
}

</style>
