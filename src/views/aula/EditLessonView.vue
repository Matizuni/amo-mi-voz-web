<template>
  <section class="edit-lesson">
    <!-- =====================================================
         LOADING
    ====================================================== -->

    <section
      v-if="isLoading"
      class="state-screen"
    >
      <div class="state-screen__loader"></div>

      <strong>
        Cargando editor
      </strong>

      <p>
        Preparando la clase, sus materiales y la unidad formativa.
      </p>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->

    <section
      v-else-if="loadError"
      class="state-screen state-screen--error"
    >
      <div class="state-screen__error-icon">
        !
      </div>

      <h1>
        No pudimos abrir esta clase
      </h1>

      <p>
        {{ loadError }}
      </p>

      <div class="state-screen__actions">
        <button
          type="button"
          @click="loadEditor"
        >
          Reintentar
        </button>

        <RouterLink
          to="/aula/programa-formativo"
        >
          Volver al programa
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         EDITOR
    ====================================================== -->

    <template v-else-if="lesson">
      <!-- ===================================================
           TOPBAR
      ==================================================== -->

      <div class="topbar">
        <RouterLink
          :to="`/aula/clase/${lesson.id}`"
          class="back-link"
        >
          <span>←</span>
          Volver a la clase
        </RouterLink>

        <div class="topbar__actions">
          <RouterLink
            :to="`/aula/clase/${lesson.id}/trabajo`"
            class="topbar-button"
          >
            Recursos y tareas
          </RouterLink>

          <RouterLink
            to="/aula/programa-formativo"
            class="topbar-button"
          >
            Programa
          </RouterLink>
        </div>
      </div>

      <!-- ===================================================
           HERO
      ==================================================== -->

      <header class="editor-hero">
        <div class="editor-hero__content">
          <div class="eyebrow">
            <span></span>

            Profesor · Gestión académica
          </div>

          <h1>
            Editar
            <strong>clase</strong>
          </h1>

          <p>
            Actualiza la sesión, administra su material principal
            y organiza la planificación sin llenar formularios
            innecesarios.
          </p>

          <div class="hero-state">
            <span
              class="hero-state__dot"
              :class="{
                'hero-state__dot--active':
                  hasChanges
              }"
            ></span>

            <strong>
              {{
                hasChanges
                  ? 'Cambios sin guardar'
                  : 'Todos los cambios están guardados'
              }}
            </strong>
          </div>
        </div>

        <aside class="class-identity">
          <span>
            CLASE
          </span>

          <strong>
            {{ classDisplayNumber }}
          </strong>

          <small>
            {{ lesson.title }}
          </small>
        </aside>
      </header>

      <!-- ===================================================
           FORM
      ==================================================== -->

      <form
        class="editor-form"
        @submit.prevent="saveChanges(false)"
      >
        <!-- =================================================
             01 · INFORMACIÓN
        ================================================== -->

        <section class="panel">
          <header class="panel__header">
            <div class="panel__number">
              01
            </div>

            <div>
              <span>
                Configuración
              </span>

              <h2>
                Información de la clase
              </h2>
            </div>

            <div class="panel-badge">
              Esencial
            </div>
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
              class="inline-state"
            >
              <span class="mini-spinner"></span>

              Cargando unidades...
            </div>

            <div
              v-else-if="unitsError"
              class="inline-error"
            >
              <span>!</span>

              {{ unitsError }}
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
              placeholder="Nombre de la clase"
            />
          </div>

          <!-- FECHA Y HORA -->

          <div class="two-columns">
            <div class="field">
              <label for="date">
                Fecha
                <strong>*</strong>
              </label>

              <input
                id="date"
                v-model="form.date"
                type="date"
                required
              />

              <small class="date-calendar-note">
                La clase se agregará automáticamente al calendario del aula.
              </small>
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
                Descripción para el alumno
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
              placeholder="Explica brevemente qué se trabajará en esta sesión..."
            ></textarea>

            <small>
              Esta descripción aparece en la portada de la clase.
            </small>
          </div>

          <div class="field lesson-cover-field">
            <div class="field__header">
              <label>Portada de la clase</label>
              <span>Imagen opcional</span>
            </div>
            <input ref="coverInput" class="hidden-input" type="file" accept="image/jpeg,image/png,image/webp" @change="handleCoverInput" />
            <div class="lesson-cover-editor" :class="{ 'lesson-cover-editor--has-image': coverUrl }">
              <div class="lesson-cover-editor__preview" :style="coverUrl ? { backgroundImage: `linear-gradient(90deg, rgba(16,25,40,.75), rgba(16,25,40,.16)), url(${coverUrl})` } : {}">
                <span>PORTADA</span>
                <strong>{{ form.title || 'Vista previa de la clase' }}</strong>
                <small>{{ coverUrl ? 'Tu imagen se verá con una capa de contraste para mantener la lectura.' : 'Añade una fotografía horizontal para personalizar la entrada a la clase.' }}</small>
              </div>
              <div class="lesson-cover-editor__actions">
                <button type="button" class="cover-action cover-action--primary" :disabled="isUploadingCover" @click="coverInput?.click()">{{ isUploadingCover ? 'Subiendo…' : (coverUrl ? 'Cambiar imagen' : 'Subir portada') }}</button>
                <button v-if="coverUrl" type="button" class="cover-action" :disabled="isUploadingCover" @click="removeCover">Quitar</button>
              </div>
            </div>
            <small v-if="coverError" class="cover-error">{{ coverError }}</small>
            <small>Recomendado: 1600 × 700 px, JPG/PNG/WebP, máximo 8 MB.</small>
          </div>
        </section>

        <!-- =================================================
             02 · MATERIAL PRINCIPAL
        ================================================== -->

        <section class="panel material-panel">
          <header class="panel__header">
            <div class="panel__number">
              02
            </div>

            <div>
              <span>
                Contenido
              </span>

              <h2>
                Material principal
              </h2>
            </div>

            <div
              class="panel-badge"
              :class="{
                'panel-badge--ready':
                  displayedPrimaryMaterial
              }"
            >
              {{
                displayedPrimaryMaterial
                  ? 'PDF disponible'
                  : 'Sin PDF'
              }}
            </div>
          </header>

          <p class="panel-description">
            Este es el documento que el alumno verá destacado al
            entrar a la clase.
          </p>

          <input
            ref="fileInput"
            class="hidden-input"
            type="file"
            accept=".pdf,application/pdf"
            @change="handleFileInput"
          />

          <!-- PDF NUEVO SELECCIONADO -->

          <article
            v-if="pendingFile"
            class="file-card file-card--new"
          >
            <div class="file-card__icon">
              PDF
            </div>

            <div class="file-card__body">
              <span>
                NUEVO MATERIAL
              </span>

              <strong>
                {{ pendingFile.name }}
              </strong>

              <small>
                {{ pendingFileSize }}
              </small>

              <div class="file-card__message">
                <span>✓</span>

                Se reemplazará el PDF actual cuando guardes.
              </div>
            </div>

            <div class="file-card__actions">
              <button
                type="button"
                @click="openFilePicker"
              >
                Cambiar
              </button>

              <button
                type="button"
                class="danger-button"
                @click="cancelPendingFile"
              >
                Quitar
              </button>
            </div>
          </article>

          <!-- PDF ACTUAL -->

          <article
            v-else-if="
              primaryMaterial &&
              !removePrimaryMaterial
            "
            class="file-card"
          >
            <div class="file-card__icon">
              PDF
            </div>

            <div class="file-card__body">
              <span>
                MATERIAL ACTUAL
              </span>

              <strong>
                {{
                  getMaterialDisplayName(
                    primaryMaterial
                  )
                }}
              </strong>

              <small>
                {{
                  primaryMaterial.fileSize
                    ? formatFileSize(
                        primaryMaterial.fileSize
                      )
                    : 'PDF de la clase'
                }}
              </small>
            </div>

            <div class="file-card__actions">
              <a
                v-if="primaryMaterial.url"
                :href="primaryMaterial.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir
              </a>

              <button
                type="button"
                @click="openFilePicker"
              >
                Reemplazar
              </button>

              <button
                type="button"
                class="danger-button"
                @click="
                  removePrimaryMaterial =
                    true
                "
              >
                Eliminar
              </button>
            </div>
          </article>

          <!-- MARCADO PARA ELIMINAR -->

          <div
            v-else-if="
              primaryMaterial &&
              removePrimaryMaterial
            "
            class="remove-state"
          >
            <div class="remove-state__icon">
              !
            </div>

            <div>
              <strong>
                El PDF se eliminará al guardar
              </strong>

              <p>
                El archivo todavía existe. Puedes cancelar esta
                acción antes de guardar.
              </p>
            </div>

            <button
              type="button"
              @click="
                removePrimaryMaterial =
                  false
              "
            >
              Deshacer
            </button>
          </div>

          <!-- SIN PDF -->

          <button
            v-else
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
              Agregar PDF principal
            </strong>

            <p>
              Arrastra el documento aquí o haz clic para
              seleccionarlo.
            </p>

            <span>
              PDF · máximo 50 MB
            </span>
          </button>

          <!-- ZONA DROP PARA REEMPLAZAR -->

          <button
            v-if="
              primaryMaterial &&
              !pendingFile &&
              !removePrimaryMaterial
            "
            type="button"
            class="replace-drop-zone"
            :class="{
              'replace-drop-zone--active':
                isDragging
            }"
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
            @click="openFilePicker"
          >
            <span>
              ↑
            </span>

            Arrastra aquí otro PDF para reemplazar el actual
          </button>

          <div
            v-if="fileError"
            class="file-error"
          >
            <span>!</span>

            {{ fileError }}
          </div>
        </section>

        <!-- =================================================
             03 · PUBLICACIÓN
        ================================================== -->

        <section class="panel">
          <header class="panel__header">
            <div class="panel__number">
              03
            </div>

            <div>
              <span>
                Disponibilidad
              </span>

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

        <!-- =================================================
             PLANIFICACIÓN AVANZADA
        ================================================== -->

        <section class="advanced-panel">
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
              <div class="advanced-toggle__icon">
                {{
                  showAdvanced
                    ? '−'
                    : '+'
                }}
              </div>

              <div>
                <span>
                  OPCIONAL
                </span>

                <strong>
                  Planificación docente avanzada
                </strong>

                <small>
                  Objetivos, contenidos, actividades, repertorio
                  y notas privadas.
                </small>
              </div>
            </div>

            <span>
              {{
                showAdvanced
                  ? 'Ocultar'
                  : 'Editar planificación'
              }}
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
                  <div class="field__header">
                    <label for="objectives">
                      Objetivos
                    </label>

                    <span>
                      {{ objectiveList.length }}
                    </span>
                  </div>

                  <textarea
                    id="objectives"
                    v-model="form.objectives"
                    rows="6"
                    placeholder="Un objetivo por línea..."
                  ></textarea>
                </div>

                <div class="field">
                  <div class="field__header">
                    <label for="contents">
                      Contenidos
                    </label>

                    <span>
                      {{ contentList.length }}
                    </span>
                  </div>

                  <textarea
                    id="contents"
                    v-model="form.contents"
                    rows="6"
                    placeholder="Un contenido por línea..."
                  ></textarea>
                </div>

                <div class="field">
                  <div class="field__header">
                    <label for="activities">
                      Actividades
                    </label>

                    <span>
                      {{ activityList.length }}
                    </span>
                  </div>

                  <textarea
                    id="activities"
                    v-model="form.activities"
                    rows="6"
                    placeholder="Una actividad por línea..."
                  ></textarea>
                </div>

                <div class="field">
                  <div class="field__header">
                    <label for="repertoire">
                      Repertorio
                    </label>

                    <span>
                      {{ repertoireList.length }}
                    </span>
                  </div>

                  <textarea
                    id="repertoire"
                    v-model="form.repertoire"
                    rows="6"
                    placeholder="Una obra por línea..."
                  ></textarea>
                </div>
              </div>

              <div class="field">
                <label for="supportMaterials">
                  Indicaciones docentes
                </label>

                <textarea
                  id="supportMaterials"
                  v-model.trim="form.supportMaterials"
                  rows="4"
                  maxlength="1200"
                  placeholder="Material adicional, observaciones metodológicas..."
                ></textarea>
              </div>

              <div class="field">
                <label for="notes">
                  Notas privadas
                </label>

                <textarea
                  id="notes"
                  v-model.trim="form.notes"
                  rows="5"
                  maxlength="1600"
                  placeholder="Estas observaciones son para el profesor."
                ></textarea>
              </div>
            </div>
          </Transition>
        </section>

        <!-- =================================================
             PREVIEW
        ================================================== -->

        <section class="preview">
          <div class="preview__top">
            <div>
              <span>
                VISTA PREVIA
              </span>

              <h2>
                {{
                  form.title ||
                  'Título de la clase'
                }}
              </h2>
            </div>

            <span class="preview-status">
              {{ statusLabel }}
            </span>
          </div>

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
                formattedLessonDate
              }}
            </span>

            <span>
              {{ form.modality }}
            </span>
          </div>

          <p>
            {{
              form.description ||
              'La descripción visible para el estudiante aparecerá aquí.'
            }}
          </p>

          <div class="preview__content-grid">
            <article>
              <span>
                Material principal
              </span>

              <strong>
                {{
                  displayedPrimaryMaterial
                    ? 'Disponible'
                    : 'Sin PDF'
                }}
              </strong>
            </article>

            <article>
              <span>
                Objetivos
              </span>

              <strong>
                {{ objectiveList.length }}
              </strong>
            </article>

            <article>
              <span>
                Contenidos
              </span>

              <strong>
                {{ contentList.length }}
              </strong>
            </article>

            <article>
              <span>
                Actividades
              </span>

              <strong>
                {{ activityList.length }}
              </strong>
            </article>
          </div>
        </section>

        <!-- =================================================
             ERROR
        ================================================== -->

        <div
          v-if="saveError"
          class="global-message global-message--error"
        >
          <span>!</span>

          <div>
            <strong>
              No pudimos guardar todos los cambios
            </strong>

            <p>
              {{ saveError }}
            </p>
          </div>
        </div>

        <!-- =================================================
             SUCCESS
        ================================================== -->

        <div
          v-if="successMessage"
          class="global-message global-message--success"
        >
          <span>✓</span>

          <div>
            <strong>
              Cambios guardados
            </strong>

            <p>
              {{ successMessage }}
            </p>
          </div>
        </div>

        <!-- =================================================
             SAVING
        ================================================== -->

        <div
          v-if="isSaving"
          class="saving-card"
        >
          <div class="saving-card__spinner"></div>

          <div>
            <strong>
              {{ savingLabel }}
            </strong>

            <p>
              Estamos sincronizando la clase con Supabase.
            </p>
          </div>
        </div>

        <!-- =================================================
             ACTION BAR
        ================================================== -->

        <footer class="action-bar">
          <div class="action-bar__status">
            <span
              class="change-dot"
              :class="{
                'change-dot--active':
                  hasChanges
              }"
            ></span>

            <div>
              <strong>
                {{
                  hasChanges
                    ? 'Cambios sin guardar'
                    : 'Todo guardado'
                }}
              </strong>

              <small>
                {{
                  hasChanges
                    ? 'Ctrl + S también guarda los cambios.'
                    : 'La información está sincronizada.'
                }}
              </small>
            </div>
          </div>

          <div class="action-bar__buttons">
            <button
              type="button"
              class="secondary-button"
              :disabled="
                !hasChanges ||
                isSaving
              "
              @click="resetEditor"
            >
              Restaurar
            </button>

            <button
              type="submit"
              class="secondary-button secondary-button--accent"
              :disabled="
                !hasChanges ||
                !canSave ||
                isSaving
              "
            >
              {{
                isSaving
                  ? 'Guardando...'
                  : 'Guardar'
              }}
            </button>

            <button
              type="button"
              class="primary-button"
              :disabled="
                !canSave ||
                isSaving
              "
              @click="saveChanges(true)"
            >
              <span
                v-if="isSaving"
                class="button-spinner"
              ></span>

              Guardar y ver clase
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
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from 'vue'

import {
  RouterLink,
  useRoute,
  useRouter,
} from 'vue-router'

import {
  fetchLessonById,
  updateLesson,
} from '@/services/lessonService'

import {
  fetchUnits,
} from '@/services/unitService'

import {
  createMaterialFromFile,
  fetchMaterialsByLesson,
  removeMaterial,
} from '@/services/materialService'

import {
  clearLessonCover,
  getLessonAppearance,
  uploadLessonCover,
} from '@/services/lessonAppearanceService'

const route = useRoute()
const router = useRouter()

/* =========================================================
   CONSTANTES
========================================================= */

const MAX_PDF_SIZE =
  50 * 1024 * 1024

/* =========================================================
   ESTADO
========================================================= */

const lesson = ref(null)

// Número visible de la clase. Nunca usamos el ID de base de datos como número académico.
// Ej.: "Clase II - Tiempo..." => "II" aunque el registro tenga id 6.
const classDisplayNumber = computed(() => {
  const title = String(lesson.value?.title || '').trim()
  const match = title.match(/\bclase\s+([ivxlcdm]+|\d+)\b/i)

  if (match?.[1]) {
    return match[1].toUpperCase()
  }

  const academicNumber =
    lesson.value?.position ??
    lesson.value?.sequence ??
    lesson.value?.order ??
    lesson.value?.lesson_number

  if (academicNumber !== null && academicNumber !== undefined) {
    return String(academicNumber).padStart(2, '0')
  }

  return '—'
})
const units = ref([])
const materials = ref([])

const isLoading = ref(true)
const isLoadingUnits = ref(false)
const isSaving = ref(false)

const loadError = ref('')
const unitsError = ref('')
const saveError = ref('')
const successMessage = ref('')

const showAdvanced = ref(false)

const fileInput = ref(null)
const pendingFile = ref(null)

const isDragging = ref(false)
const fileError = ref('')
const coverInput = ref(null)
const coverUrl = ref('')
const isUploadingCover = ref(false)
const coverError = ref('')

const removePrimaryMaterial =
  ref(false)

const savingStage =
  ref('')

/* =========================================================
   PORTADA VISUAL
========================================================= */
const syncCover = () => {
  if (!lesson.value?.id) return
  coverUrl.value = getLessonAppearance(lesson.value.id)?.coverUrl || ''
}

const handleCoverInput = async event => {
  const file = event?.target?.files?.[0]
  if (!file || !lesson.value?.id) return
  coverError.value = ''
  isUploadingCover.value = true
  try {
    const appearance = await uploadLessonCover({ lessonId: lesson.value.id, file })
    coverUrl.value = appearance.coverUrl || ''
    successMessage.value = 'Portada actualizada correctamente.'
  } catch (error) {
    console.error(error)
    coverError.value = error?.message || 'No fue posible subir la portada.'
  } finally {
    isUploadingCover.value = false
    if (coverInput.value) coverInput.value.value = ''
  }
}

const removeCover = () => {
  if (!lesson.value?.id) return
  clearLessonCover(lesson.value.id)
  coverUrl.value = ''
  successMessage.value = 'Portada eliminada.'
}

/* =========================================================
   FORM
========================================================= */

const form = reactive({
  unitId: null,

  title: '',
  date: '',
  time: '',

  duration: '',

  status: 'published',

  modality: 'Presencial',

  location: '',

  description: '',

  focus: '',

  objectives: '',
  contents: '',
  activities: '',
  repertoire: '',

  supportMaterials: '',
  notes: '',
})

const originalForm =
  ref({})

/* =========================================================
   HELPERS
========================================================= */

const toMultiline = value => {
  if (
    Array.isArray(value)
  ) {
    return value.join('\n')
  }

  return value || ''
}

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

const cloneForm = () =>
  JSON.parse(
    JSON.stringify(form),
  )

/* =========================================================
   ARRAYS
========================================================= */

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
   UNIDAD
========================================================= */

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
   MATERIAL PRINCIPAL
========================================================= */

const primaryMaterial =
  computed(() => {
    if (
      !materials.value.length
    ) {
      return null
    }

    const explicit =
      materials.value.find(
        material =>
          String(
            material.storagePath ||
            '',
          ).includes(
            '/material-principal/',
          ),
      )

    if (explicit) {
      return explicit
    }

    const byTitle =
      materials.value.find(
        material =>
          String(
            material.title ||
            '',
          )
            .toLowerCase()
            .includes(
              'material principal',
            ),
      )

    if (byTitle) {
      return byTitle
    }

    return (
      materials.value.find(
        material =>
          material.type ===
            'pdf' ||
          material.mimeType ===
            'application/pdf',
      ) ||
      null
    )
  })

const displayedPrimaryMaterial =
  computed(() => {
    if (
      pendingFile.value
    ) {
      return {
        fileName:
          pendingFile.value.name,
      }
    }

    if (
      removePrimaryMaterial.value
    ) {
      return null
    }

    return primaryMaterial.value
  })

/* =========================================================
   CHANGE DETECTION
========================================================= */

const formChanged =
  computed(() => {
    return (
      JSON.stringify(form) !==
      JSON.stringify(
        originalForm.value,
      )
    )
  })

const fileChanged =
  computed(() => {
    return Boolean(
      pendingFile.value ||
      removePrimaryMaterial.value,
    )
  })

const hasChanges =
  computed(() => {
    return (
      formChanged.value ||
      fileChanged.value
    )
  })

const canSave =
  computed(() => {
    return Boolean(
      form.title.trim() &&
      form.date.trim(),
    )
  })

/* =========================================================
   STATUS
========================================================= */

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
        'La clase estará publicada para los estudiantes.',

      completed:
        'La sesión queda registrada como realizada.',
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
        'Guardando información de la clase...',

      upload:
        'Subiendo nuevo PDF...',

      remove:
        'Actualizando material principal...',

      finish:
        'Finalizando cambios...',
    }

    return (
      labels[
        savingStage.value
      ] ||
      'Guardando cambios...'
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
      'Solo puedes utilizar un archivo PDF como material principal.'

    return false
  }

  if (
    Number(file.size) >
    MAX_PDF_SIZE
  ) {
    fileError.value =
      'El archivo supera el límite de 50 MB.'

    return false
  }

  return true
}

const selectPdf = file => {
  if (
    !validatePdf(file)
  ) {
    return
  }

  pendingFile.value =
    file

  removePrimaryMaterial.value =
    false
}

const openFilePicker = () => {
  if (
    isSaving.value
  ) {
    return
  }

  fileInput.value
    ?.click()
}

const handleFileInput = event => {
  const file =
    event.target
      ?.files
      ?.[0]

  selectPdf(file)

  event.target.value = ''
}

const handleDrop = event => {
  isDragging.value = false

  if (
    isSaving.value
  ) {
    return
  }

  const file =
    event.dataTransfer
      ?.files
      ?.[0]

  selectPdf(file)
}

const cancelPendingFile = () => {
  pendingFile.value = null
  fileError.value = ''
}

const pendingFileSize =
  computed(() => {
    if (
      !pendingFile.value
    ) {
      return ''
    }

    return formatFileSize(
      pendingFile.value.size,
    )
  })

/* =========================================================
   FORMAT
========================================================= */

const formatFileSize = bytes => {
  const value =
    Number(
      bytes ||
      0,
    )

  if (!value) {
    return ''
  }

  if (
    value < 1024
  ) {
    return `${value} B`
  }

  if (
    value <
    1024 * 1024
  ) {
    return `${(
      value /
      1024
    ).toFixed(1)} KB`
  }

  return `${(
    value /
    (
      1024 *
      1024
    )
  ).toFixed(1)} MB`
}

const getMaterialDisplayName =
  material => {
    return (
      material?.fileName ||
      material?.title ||
      'Material principal'
    )
  }

/* =========================================================
   FECHAS
========================================================= */

const monthMap = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  setiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
}

const normalizeDateInputValue =
  value => {
    const raw =
      String(
        value ||
        '',
      ).trim()

    if (!raw) {
      return ''
    }

    const iso =
      raw.match(
        /^(\d{4})-(\d{2})-(\d{2})/,
      )

    if (iso) {
      return `${iso[1]}-${iso[2]}-${iso[3]}`
    }

    const spanish =
      raw
        .toLowerCase()
        .normalize('NFD')
        .replace(
          /[\u0300-\u036f]/g,
          '',
        )
        .match(
          /^(\d{1,2})\s+de\s+([a-z]+)(?:\s+de\s+(\d{4}))?$/,
        )

    if (spanish) {
      const day =
        Number(spanish[1])

      const month =
        monthMap[
          spanish[2]
        ]

      const year =
        Number(
          spanish[3] ||
          new Date().getFullYear(),
        )

      if (
        month !== undefined &&
        Number.isFinite(day) &&
        day >= 1 &&
        day <= 31
      ) {
        return [
          String(year)
            .padStart(4, '0'),
          String(month + 1)
            .padStart(2, '0'),
          String(day)
            .padStart(2, '0'),
        ].join('-')
      }
    }

    const parsed =
      new Date(raw)

    if (
      Number.isNaN(
        parsed.getTime(),
      )
    ) {
      return ''
    }

    return [
      parsed.getFullYear(),
      String(
        parsed.getMonth() + 1,
      ).padStart(2, '0'),
      String(
        parsed.getDate(),
      ).padStart(2, '0'),
    ].join('-')
  }

const formattedLessonDate =
  computed(() => {
    if (!form.date) {
      return 'Fecha por definir'
    }

    const [
      year,
      month,
      day,
    ] =
      form.date
        .split('-')
        .map(Number)

    if (
      !year ||
      !month ||
      !day
    ) {
      return form.date
    }

    const date =
      new Date(
        year,
        month - 1,
        day,
      )

    return new Intl.DateTimeFormat(
      'es-CL',
      {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      },
    ).format(date)
  })

/* =========================================================
   FORM FILL
========================================================= */

const fillForm = data => {
  form.unitId =
    data.unitId ??
    data.unit_id ??
    null

  form.title =
    data.title ||
    ''

  form.date =
    normalizeDateInputValue(
      data.date,
    )

  form.time =
    data.time ||
    ''

  form.duration =
    data.duration ||
    ''

  form.status =
    data.status ||
    'published'

  form.modality =
    data.modality ||
    'Presencial'

  form.location =
    data.location ||
    ''

  form.description =
    data.description ||
    ''

  form.focus =
    data.focus ||
    ''

  form.objectives =
    toMultiline(
      data.objectives,
    )

  form.contents =
    toMultiline(
      data.contents,
    )

  form.activities =
    toMultiline(
      data.activities,
    )

  form.repertoire =
    toMultiline(
      data.repertoire,
    )

  form.supportMaterials =
    data.supportMaterials ||
    data.support_materials ||
    ''

  form.notes =
    data.notes ||
    ''

  originalForm.value =
    cloneForm()
}

/* =========================================================
   LOAD
========================================================= */

const loadEditor = async () => {
  isLoading.value = true

  loadError.value = ''
  unitsError.value = ''

  try {
    const id =
      Number(
        route.params.id,
      )

    if (
      !Number.isFinite(id) ||
      id <= 0
    ) {
      throw new Error(
        'La clase solicitada no es válida.',
      )
    }

    isLoadingUnits.value =
      true

    const [
      loadedLesson,
      loadedMaterials,
      loadedUnits,
    ] = await Promise.all([
      fetchLessonById(id),

      fetchMaterialsByLesson(
        id,
      ),

      fetchUnits(),
    ])

    lesson.value =
      loadedLesson

    materials.value =
      loadedMaterials ||
      []

    units.value =
      loadedUnits ||
      []

    fillForm(
      loadedLesson,
    )

    pendingFile.value =
      null

    removePrimaryMaterial.value =
      false
  } catch (error) {
    console.error(
      'Error cargando editor:',
      error,
    )

    loadError.value =
      error?.message ||
      'No fue posible cargar la clase.'
  } finally {
    isLoading.value = false
    isLoadingUnits.value = false
  }
}

/* =========================================================
   RESET
========================================================= */

const resetEditor = () => {
  Object.assign(
    form,
    JSON.parse(
      JSON.stringify(
        originalForm.value,
      ),
    ),
  )

  pendingFile.value =
    null

  removePrimaryMaterial.value =
    false

  fileError.value =
    ''

  saveError.value =
    ''

  successMessage.value =
    ''
}

/* =========================================================
   SAVE
========================================================= */

const saveChanges = async (
  navigateAfter = false,
) => {
  if (
    !lesson.value ||
    !canSave.value ||
    isSaving.value
  ) {
    return
  }

  /*
   * Si no hay cambios pero el profesor
   * eligió "Guardar y ver clase",
   * simplemente navegamos.
   */
  if (
    !hasChanges.value
  ) {
    if (
      navigateAfter
    ) {
      await router.push(
        `/aula/clase/${lesson.value.id}`,
      )
    }

    return
  }

  isSaving.value = true

  saveError.value = ''
  successMessage.value = ''

  const oldPrimary =
    primaryMaterial.value

  let newlyCreatedMaterial =
    null

  try {
    /* =====================================================
       PASO 1
       GUARDAR INFORMACIÓN
    ====================================================== */

    savingStage.value =
      'lesson'

    const updatedLesson =
      await updateLesson(
        lesson.value.id,
        {
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

          description:
            form.description.trim(),

          focus:
            form.focus.trim(),

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
            form.notes.trim(),
        },
      )

    lesson.value =
      updatedLesson

    /* =====================================================
       PASO 2
       NUEVO PDF

       Primero subimos el nuevo.
       Solo si funciona eliminamos el anterior.
       Así nunca dejamos la clase sin material por un
       fallo durante la subida.
    ====================================================== */

    if (
      pendingFile.value
    ) {
      savingStage.value =
        'upload'

      newlyCreatedMaterial =
        await createMaterialFromFile({
          file:
            pendingFile.value,

          lessonId:
            lesson.value.id,

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

      if (
        oldPrimary
      ) {
        savingStage.value =
          'remove'

        await removeMaterial(
          oldPrimary,
        )
      }
    }

    /* =====================================================
       PASO 3
       ELIMINACIÓN SIN REEMPLAZO
    ====================================================== */

    else if (
      removePrimaryMaterial.value &&
      oldPrimary
    ) {
      savingStage.value =
        'remove'

      await removeMaterial(
        oldPrimary,
      )
    }

    /* =====================================================
       PASO 4
       REFRESCAR MATERIALES
    ====================================================== */

    savingStage.value =
      'finish'

    materials.value =
      await fetchMaterialsByLesson(
        lesson.value.id,
      )

    fillForm(
      updatedLesson,
    )

    pendingFile.value =
      null

    removePrimaryMaterial.value =
      false

    successMessage.value =
      'La clase y sus materiales quedaron sincronizados correctamente.'

    if (
      navigateAfter
    ) {
      await router.push(
        `/aula/clase/${lesson.value.id}`,
      )
    }
  } catch (error) {
    console.error(
      'Error guardando clase:',
      error,
    )

    /*
     * Si alcanzamos a crear un PDF nuevo pero después
     * falló la eliminación del antiguo, preferimos
     * conservar ambos antes que perder el material.
     *
     * El siguiente reload mostrará lo que realmente
     * quedó guardado en Supabase.
     */

    if (
      newlyCreatedMaterial
    ) {
      console.info(
        'El nuevo material fue creado antes del error:',
        newlyCreatedMaterial.id,
      )
    }

    saveError.value =
      error?.message ||
      'No fue posible completar la operación.'

    /*
     * Refrescamos para que el editor represente
     * el estado real del servidor.
     */
    try {
      materials.value =
        await fetchMaterialsByLesson(
          lesson.value.id,
        )
    } catch (
      refreshError
    ) {
      console.error(
        'No se pudieron refrescar los materiales:',
        refreshError,
      )
    }
  } finally {
    isSaving.value =
      false

    savingStage.value =
      ''
  }
}

/* =========================================================
   CTRL / CMD + S
========================================================= */

const handleKeyboardShortcut =
  event => {
    const isSave =
      (
        event.ctrlKey ||
        event.metaKey
      ) &&
      String(
        event.key,
      ).toLowerCase() ===
        's'

    if (!isSave) {
      return
    }

    event.preventDefault()

    if (
      hasChanges.value &&
      canSave.value &&
      !isSaving.value
    ) {
      saveChanges(false)
    }
  }

/* =========================================================
   PREVENIR SALIDA ACCIDENTAL
========================================================= */

const handleBeforeUnload =
  event => {
    if (
      !hasChanges.value
    ) {
      return
    }

    event.preventDefault()

    event.returnValue = ''
  }

/* =========================================================
   ROUTE
========================================================= */

watch(
  () =>
    route.params.id,

  (
    newId,
    oldId,
  ) => {
    if (
      newId !==
      oldId
    ) {
      loadEditor()
    }
  },
)

/* =========================================================
   MOUNT
========================================================= */

watch(() => lesson.value?.id, () => syncCover())

onMounted(() => {
  loadEditor()

  window.addEventListener(
    'keydown',
    handleKeyboardShortcut,
  )

  window.addEventListener(
    'beforeunload',
    handleBeforeUnload,
  )
})

onBeforeUnmount(() => {
  window.removeEventListener(
    'keydown',
    handleKeyboardShortcut,
  )

  window.removeEventListener(
    'beforeunload',
    handleBeforeUnload,
  )
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.edit-lesson {
  width: 100%;
  max-width: 1140px;
  margin: 0 auto;
  padding-bottom: 6rem;
}

/* =========================================================
   TOPBAR
========================================================= */

.topbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.4rem;
}

.back-link {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color:
    variables.$color-primary;
  font-size: 0.76rem;
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

.topbar__actions {
  display: flex;
  gap: 0.45rem;
}

.topbar-button {
  padding:
    0.58rem
    0.72rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  color:
    variables.$color-white;
  font-size: 0.65rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   HERO
========================================================= */

.editor-hero {
  position: relative;
  display: grid;
  gap: 2rem;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  align-items: center;
  margin-bottom: 1.3rem;
  padding: 2.5rem;
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(
        255,
        196,
        0,
        0.13
      ),
      transparent 34%
    ),
    variables.$color-surface;
}

.editor-hero::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 110px;
  height: 3px;
  background:
    variables.$color-primary;
  content: '';
}

.eyebrow {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  color:
    variables.$color-primary;
  font-size: 0.64rem;
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

.editor-hero h1 {
  margin:
    0.8rem
    0
    0;
  font-size:
    clamp(
      3rem,
      7vw,
      5.3rem
    );
  line-height: 0.92;
  letter-spacing: -0.05em;
}

.editor-hero h1 strong {
  display: block;
  color:
    variables.$color-primary;
}

.editor-hero p {
  max-width: 650px;
  margin:
    1.1rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
  line-height: 1.7;
}

.hero-state {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1.1rem;
  color:
    rgba(
      255,
      255,
      255,
      0.38
    );
  font-size: 0.64rem;
}

.hero-state__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background:
    rgba(
      255,
      255,
      255,
      0.25
    );
}

.hero-state__dot--active {
  background:
    variables.$color-primary;
  box-shadow:
    0 0 0 5px
    rgba(
      255,
      196,
      0,
      0.07
    );
}

.class-identity {
  display: grid;
  width: 125px;
  height: 125px;
  place-items: center;
  align-content: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.55
    );
  border-radius: 50%;
}

.class-identity span,
.class-identity strong,
.class-identity small {
  display: block;
}

.class-identity span {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.class-identity strong {
  color:
    variables.$color-primary;
  font-size: 2.7rem;
  line-height: 1;
}

.class-identity small {
  margin-top: 0.2rem;
  color:
    rgba(
      255,
      255,
      255,
      0.27
    );
  font-size: 0.54rem;
}

/* =========================================================
   FORM
========================================================= */

.editor-form {
  display: grid;
  gap: 1.1rem;
}

/* =========================================================
   PANEL
========================================================= */

.panel {
  padding: 1.9rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 19px;
  background:
    variables.$color-surface;
}

.panel__header {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  margin-bottom: 1.6rem;
  padding-bottom: 1.05rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.panel__number {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.45
    );
  border-radius: 12px;
  color:
    variables.$color-primary;
  font-size: 0.67rem;
  font-weight: 900;
}

.panel__header > div:nth-child(2) > span {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.11em;
  text-transform: uppercase;
}

.panel__header h2 {
  margin:
    0.2rem
    0
    0;
  font-size: 1.35rem;
}

.panel-badge {
  padding:
    0.32rem
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
      0.35
    );
  font-size: 0.58rem;
  font-weight: 800;
}

.panel-badge--ready {
  border-color:
    rgba(
      255,
      196,
      0,
      0.34
    );
  color:
    variables.$color-primary;
}

.panel-description {
  max-width: 760px;
  margin:
    -0.2rem
    0
    1.3rem;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.72rem;
  line-height: 1.6;
}

/* =========================================================
   FIELDS
========================================================= */

.field {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.2rem;
}

.field:last-child {
  margin-bottom: 0;
}

.field__header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.field label {
  color:
    rgba(
      255,
      255,
      255,
      0.77
    );
  font-size: 0.73rem;
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
      0.27
    );
  font-size: 0.59rem;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding:
    0.82rem
    0.9rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
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
      0.2
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
      0.3
    );
  font-size: 0.61rem;
  line-height: 1.45;
}

.two-columns,
.advanced-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

/* =========================================================
   INLINE STATES
========================================================= */

.inline-state {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  color:
    rgba(
      255,
      255,
      255,
      0.35
    );
  font-size: 0.62rem;
}

.mini-spinner,
.button-spinner {
  width: 13px;
  height: 13px;
  border:
    2px solid
    rgba(
      255,
      255,
      255,
      0.16
    );
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin
    0.7s linear infinite;
}

.inline-error {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  color: #ff7777;
  font-size: 0.63rem;
}

/* =========================================================
   FILE
========================================================= */

.hidden-input {
  display: none;
}

.file-card {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1.05rem;
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
    variables.$color-background;
}

.file-card--new {
  border-color:
    variables.$color-primary;
}

.file-card__icon {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 12px;
  color:
    variables.$color-primary;
  font-size: 0.6rem;
  font-weight: 900;
}

.file-card__body > span,
.file-card__body > strong,
.file-card__body > small {
  display: block;
}

.file-card__body > span {
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.file-card__body > strong {
  margin-top: 0.18rem;
  overflow-wrap: anywhere;
  font-size: 0.76rem;
}

.file-card__body > small {
  margin-top: 0.15rem;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.59rem;
}

.file-card__message {
  display: flex;
  gap: 0.35rem;
  align-items: center;
  margin-top: 0.45rem;
  color:
    variables.$color-primary;
  font-size: 0.59rem;
}

.file-card__actions {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.file-card__actions a,
.file-card__actions button {
  padding:
    0.48rem
    0.6rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  background: transparent;
  color:
    variables.$color-white;
  font: inherit;
  font-size: 0.61rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.file-card__actions .danger-button {
  color: #ff7979;
}

/* =========================================================
   DROP ZONES
========================================================= */

.drop-zone {
  display: grid;
  width: 100%;
  min-height: 210px;
  place-items: center;
  padding: 1.6rem;
  border:
    1px dashed
    rgba(
      255,
      196,
      0,
      0.38
    );
  border-radius: 15px;
  background:
    rgba(
      255,
      196,
      0,
      0.02
    );
  color:
    variables.$color-white;
  text-align: center;
  cursor: pointer;
}

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

.drop-zone__icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  margin-bottom: 0.7rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 15px;
  color:
    variables.$color-primary;
  font-size: 1.25rem;
}

.drop-zone strong {
  font-size: 0.88rem;
}

.drop-zone p {
  margin:
    0.35rem
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.69rem;
}

.drop-zone > span {
  color:
    rgba(
      255,
      255,
      255,
      0.25
    );
  font-size: 0.58rem;
}

.replace-drop-zone {
  display: flex;
  width: 100%;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-top: 0.7rem;
  padding: 0.7rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 10px;
  background: transparent;
  color:
    rgba(
      255,
      255,
      255,
      0.32
    );
  font: inherit;
  font-size: 0.62rem;
  cursor: pointer;
}

.replace-drop-zone > span {
  color:
    variables.$color-primary;
}

.replace-drop-zone--active {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
}

/* =========================================================
   REMOVE STATE
========================================================= */

.remove-state {
  display: grid;
  gap: 0.8rem;
  grid-template-columns:
    auto
    1fr
    auto;
  align-items: center;
  padding: 1rem;
  border:
    1px solid
    rgba(
      255,
      100,
      100,
      0.3
    );
  border-radius: 12px;
  background:
    rgba(
      255,
      90,
      90,
      0.04
    );
}

.remove-state__icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border:
    1px solid
    #ff7979;
  border-radius: 50%;
  color: #ff7979;
}

.remove-state strong {
  font-size: 0.7rem;
}

.remove-state p {
  margin:
    0.2rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.36
    );
  font-size: 0.61rem;
}

.remove-state button {
  border: 0;
  background: none;
  color:
    variables.$color-primary;
  font: inherit;
  font-size: 0.62rem;
  font-weight: 800;
  cursor: pointer;
}

.file-error {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  margin-top: 0.7rem;
  color: #ff7979;
  font-size: 0.63rem;
}

/* =========================================================
   ADVANCED
========================================================= */

.advanced-panel {
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
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.15rem 1.25rem;
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
  gap: 0.75rem;
  align-items: center;
}

.advanced-toggle__icon {
  display: grid;
  width: 37px;
  height: 37px;
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
}

.advanced-toggle span,
.advanced-toggle strong,
.advanced-toggle small {
  display: block;
}

.advanced-toggle > div > div:last-child > span {
  color:
    variables.$color-primary;
  font-size: 0.54rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.advanced-toggle strong {
  margin-top: 0.13rem;
  font-size: 0.76rem;
}

.advanced-toggle small {
  margin-top: 0.12rem;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.59rem;
}

.advanced-toggle > span {
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.6rem;
}

.advanced-content {
  padding: 1.35rem;
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
    translateY(-7px);
}

/* =========================================================
   PREVIEW
========================================================= */

.preview {
  padding: 1.8rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.3
    );
  border-radius: 18px;
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

.preview__top {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
}

.preview__top > div > span {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.preview h2 {
  margin:
    0.3rem
    0
    0;
  font-size:
    clamp(
      1.5rem,
      4vw,
      2.1rem
    );
}

.preview-status {
  padding:
    0.35rem
    0.58rem;
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
  font-size: 0.59rem;
  font-weight: 800;
}

.preview__meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
}

.preview__meta span {
  padding:
    0.3rem
    0.5rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.37
    );
  font-size: 0.59rem;
}

.preview > p {
  max-width: 760px;
  margin:
    0.9rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.44
    );
  font-size: 0.72rem;
  line-height: 1.6;
}

.preview__content-grid {
  display: grid;
  gap: 0.55rem;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  margin-top: 1rem;
}

.preview__content-grid article {
  padding: 0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  background:
    variables.$color-background;
}

.preview__content-grid span,
.preview__content-grid strong {
  display: block;
}

.preview__content-grid span {
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.55rem;
}

.preview__content-grid strong {
  margin-top: 0.2rem;
  color:
    variables.$color-primary;
  font-size: 0.72rem;
}

/* =========================================================
   MESSAGES
========================================================= */

.global-message,
.saving-card {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
  padding: 0.95rem;
  border-radius: 12px;
}

.global-message > span {
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

.global-message strong,
.global-message p {
  display: block;
}

.global-message p {
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
  font-size: 0.64rem;
}

.global-message--error {
  border:
    1px solid
    rgba(
      255,
      100,
      100,
      0.3
    );
  color: #ff7979;
}

.global-message--success {
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.3
    );
  color:
    variables.$color-primary;
}

.saving-card {
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.25
    );
  background:
    rgba(
      255,
      196,
      0,
      0.025
    );
}

.saving-card__spinner {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border:
    3px solid
    rgba(
      255,
      196,
      0,
      0.1
    );
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin
    0.7s linear infinite;
}

.saving-card strong {
  font-size: 0.7rem;
}

.saving-card p {
  margin:
    0.18rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.34
    );
  font-size: 0.61rem;
}

/* =========================================================
   ACTION BAR
========================================================= */

.action-bar {
  position: sticky;
  bottom: 1rem;
  z-index: 20;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.95rem 1.05rem;
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
      0.4
    );
  backdrop-filter:
    blur(14px);
}

.action-bar__status {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.change-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background:
    rgba(
      255,
      255,
      255,
      0.25
    );
}

.change-dot--active {
  background:
    variables.$color-primary;
  box-shadow:
    0 0 0 5px
    rgba(
      255,
      196,
      0,
      0.07
    );
}

.action-bar__status strong,
.action-bar__status small {
  display: block;
}

.action-bar__status strong {
  font-size: 0.69rem;
}

.action-bar__status small {
  margin-top: 0.1rem;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.56rem;
}

.action-bar__buttons {
  display: flex;
  gap: 0.5rem;
}

.secondary-button,
.primary-button {
  display: inline-flex;
  min-height: 40px;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  padding:
    0.65rem
    0.8rem;
  border-radius: 9px;
  font: inherit;
  font-size: 0.65rem;
  font-weight: 800;
  cursor: pointer;
}

.secondary-button {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
}

.secondary-button--accent {
  border-color:
    rgba(
      255,
      196,
      0,
      0.45
    );
  color:
    variables.$color-primary;
}

.primary-button {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #070707;
}

.secondary-button:disabled,
.primary-button:disabled {
  opacity: 0.35;
  cursor: default;
}

/* =========================================================
   STATE SCREEN
========================================================= */

.state-screen {
  display: grid;
  min-height: 430px;
  gap: 0.7rem;
  place-items: center;
  align-content: center;
  padding: 2rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 18px;
  text-align: center;
}

.state-screen p {
  margin: 0;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
}

.state-screen__loader {
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
    0.75s linear infinite;
}

.state-screen__error-icon {
  display: grid;
  width: 55px;
  height: 55px;
  place-items: center;
  border:
    1px solid
    #ff7777;
  border-radius: 50%;
  color: #ff7777;
  font-size: 1.4rem;
}

.state-screen__actions {
  display: flex;
  gap: 0.5rem;
}

.state-screen__actions button,
.state-screen__actions a {
  padding:
    0.6rem
    0.75rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 9px;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-size: 0.65rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .preview__content-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 760px) {
  .topbar {
    align-items: stretch;
    flex-direction: column;
  }

  .topbar__actions {
    width: 100%;
  }

  .topbar-button {
    flex: 1;
    text-align: center;
  }

  .editor-hero {
    grid-template-columns: 1fr;
  }

  .class-identity {
    width: 85px;
    height: 85px;
  }

  .class-identity strong {
    font-size: 1.8rem;
  }

  .panel,
  .preview {
    padding: 1.3rem;
  }

  .panel__header {
    grid-template-columns:
      auto
      1fr;
  }

  .panel-badge {
    grid-column:
      1 / -1;
    width: fit-content;
  }

  .two-columns,
  .advanced-grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .file-card {
    grid-template-columns:
      auto
      1fr;
  }

  .file-card__actions {
    grid-column: 2;
    justify-content: flex-start;
  }

  .remove-state {
    grid-template-columns:
      auto
      1fr;
  }

  .remove-state button {
    grid-column: 2;
    justify-self: start;
  }

  .action-bar {
    position: static;
    align-items: stretch;
    flex-direction: column;
  }

  .action-bar__buttons {
    width: 100%;
  }

  .secondary-button,
  .primary-button {
    flex: 1;
  }
}

@media (max-width: 520px) {
  .editor-hero {
    padding: 1.35rem;
    border-radius: 18px;
  }

  .editor-hero h1 {
    font-size:
      clamp(
        2.6rem,
        14vw,
        4rem
      );
  }

  .panel {
    padding: 1.05rem;
  }

  .topbar__actions {
    flex-direction: column;
  }

  .file-card {
    grid-template-columns: 1fr;
  }

  .file-card__actions {
    grid-column: 1;
  }

  .remove-state {
    grid-template-columns: 1fr;
  }

  .remove-state button {
    grid-column: 1;
  }

  .advanced-toggle {
    align-items: flex-start;
  }

  .advanced-toggle > span {
    display: none;
  }

  .preview__top {
    flex-direction: column;
  }

  .preview__content-grid {
    grid-template-columns: 1fr 1fr;
  }

  .action-bar__buttons {
    flex-direction: column;
  }

  .secondary-button,
  .primary-button {
    width: 100%;
  }
}

.lesson-cover-editor{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:14px;align-items:center;padding:12px;border:1px solid #dfe5ec;border-radius:16px;background:#f8fafc}.lesson-cover-editor__preview{min-height:180px;display:flex;flex-direction:column;justify-content:flex-end;gap:6px;padding:24px;border-radius:12px;background:linear-gradient(135deg,#172033,#2d3a50);background-size:cover;background-position:center;color:#fff;overflow:hidden}.lesson-cover-editor__preview span{color:#f2c84b;font-size:.64rem;font-weight:850;letter-spacing:.14em}.lesson-cover-editor__preview strong{color:#fff;font-size:1.45rem;line-height:1.1}.lesson-cover-editor__preview small{max-width:620px;color:rgba(255,255,255,.78);line-height:1.5}.lesson-cover-editor__actions{display:grid;gap:8px;min-width:150px}.cover-action{padding:11px 13px;border:1px solid #d7dee7;border-radius:10px;background:#fff;color:#334155;font-weight:750;cursor:pointer}.cover-action--primary{background:#8f1d42;color:#fff;border-color:#8f1d42}.cover-action:disabled{opacity:.6;cursor:wait}.cover-error{color:#b4233d!important}@media(max-width:700px){.lesson-cover-editor{grid-template-columns:1fr}.lesson-cover-editor__actions{grid-template-columns:1fr 1fr;min-width:0}}


/* =========================================================
   V5.3 · LIGHT LMS EDITOR
   El editor deja de usar superficies negras. El contraste
   fuerte queda reservado a acciones y pequeños acentos.
========================================================= */

.edit-lesson {
  --editor-bg: #f4f7fb;
  --editor-card: #ffffff;
  --editor-soft: #f8fafc;
  --editor-soft-gold: #fffaf0;
  --editor-border: #dbe3ec;
  --editor-border-strong: #cbd6e2;
  --editor-text: #172033;
  --editor-muted: #64748b;
  --editor-wine: #9f1f48;
  --editor-wine-dark: #7f1839;
  --editor-gold: #d9a91c;
  --editor-green: #16845b;

  color: var(--editor-text);
}

.topbar-button {
  border-color: var(--editor-border);
  background: rgba(255,255,255,.72);
  color: #475569;
}

.topbar-button:hover {
  border-color: #bcc9d8;
  background: #fff;
  color: var(--editor-text);
}

.editor-hero {
  border-color: #e4d6aa;
  background:
    radial-gradient(circle at 92% 18%, rgba(217,169,28,.15), transparent 30%),
    linear-gradient(135deg, #ffffff 0%, #fffdfa 58%, #fff8e8 100%);
  box-shadow: 0 18px 48px rgba(31, 45, 61, .07);
}

.editor-hero::before {
  background: linear-gradient(90deg, var(--editor-wine), var(--editor-gold));
}

.editor-hero h1,
.editor-hero h1 strong {
  color: var(--editor-text);
}

.editor-hero h1 strong {
  color: var(--editor-wine);
}

.editor-hero p {
  color: var(--editor-muted);
}

.eyebrow,
.eyebrow span,
.panel__header > div > span,
.panel-description strong {
  color: #a27700;
}

.eyebrow span {
  background: var(--editor-gold);
  box-shadow: 0 0 0 5px rgba(217,169,28,.11);
}

.hero-state {
  color: #526174;
}

.hero-state__dot {
  background: #aeb9c6;
}

.hero-state__dot--active {
  background: var(--editor-wine);
}

.class-identity {
  min-width: 150px;
  border: 1px solid #ead598;
  background: rgba(255,255,255,.78);
  box-shadow: inset 0 0 0 1px rgba(255,255,255,.55);
}

.class-identity span {
  color: #987000;
}

.class-identity strong {
  color: var(--editor-wine);
}

.class-identity small {
  max-width: 140px;
  color: var(--editor-muted);
  line-height: 1.35;
  text-align: center;
}

.editor-form {
  gap: 1rem;
}

.panel,
.advanced-panel,
.preview {
  border-color: var(--editor-border);
  background: var(--editor-card);
  box-shadow: 0 12px 32px rgba(31,45,61,.055);
}

.panel__header {
  border-bottom-color: #e8edf3;
}

.panel__number,
.advanced-toggle__icon {
  border-color: #e6c665;
  background: var(--editor-soft-gold);
  color: #9b7300;
}

.panel__header h2,
.advanced-toggle strong,
.preview h2 {
  color: var(--editor-text);
}

.panel-badge,
.panel-badge--ready,
.preview-status {
  border-color: #d7e0e9;
  background: #f8fafc;
  color: #64748b;
}

.panel-badge--ready,
.preview-status {
  border-color: #bfe4d4;
  background: #effaf5;
  color: var(--editor-green);
}

.field__header label,
.field > label {
  color: #334155;
}

.field__header span,
.panel-description,
.inline-state,
.preview__meta,
.file-card__message {
  color: var(--editor-muted);
}

.field input,
.field select,
.field textarea,
.two-columns input,
.two-columns select,
.advanced-grid input,
.advanced-grid textarea,
.advanced-grid select {
  border-color: var(--editor-border-strong);
  background: #fff;
  color: var(--editor-text);
  box-shadow: inset 0 1px 2px rgba(15,23,42,.02);
}

.field input::placeholder,
.field textarea::placeholder,
.advanced-grid input::placeholder,
.advanced-grid textarea::placeholder {
  color: #9aa8b8;
}

.field input:focus,
.field select:focus,
.field textarea:focus,
.two-columns input:focus,
.two-columns select:focus,
.advanced-grid input:focus,
.advanced-grid textarea:focus,
.advanced-grid select:focus {
  border-color: #b88a18;
  outline: 3px solid rgba(217,169,28,.13);
  background: #fff;
}

.lesson-cover-editor {
  border-color: var(--editor-border);
  background: #f7f9fc;
}

.lesson-cover-editor__preview {
  background: linear-gradient(135deg, #26354d, #5f2940);
}

.cover-action {
  border-color: var(--editor-border-strong);
  background: #fff;
  color: #334155;
}

.cover-action--primary {
  border-color: var(--editor-wine);
  background: var(--editor-wine);
  color: #fff;
}

.cover-action--primary:hover {
  background: var(--editor-wine-dark);
}

.file-card,
.remove-state,
.drop-zone,
.replace-drop-zone {
  border-color: var(--editor-border);
  background: var(--editor-soft);
}

.file-card--new {
  border-color: #e6cf83;
  background: #fffcf3;
}

.file-card__icon,
.remove-state__icon,
.drop-zone__icon {
  border-color: #e3c760;
  background: #fff9e7;
  color: #987000;
}

.file-card__body strong,
.remove-state strong,
.drop-zone strong {
  color: var(--editor-text);
}

.file-card__body span,
.remove-state p,
.drop-zone p {
  color: var(--editor-muted);
}

.file-card__actions button,
.secondary-button {
  border-color: var(--editor-border-strong);
  background: #fff;
  color: #334155;
}

.file-card__actions button:hover,
.secondary-button:hover {
  border-color: #aebdcd;
  background: #f8fafc;
}

.file-card__actions button:last-child {
  border-color: #f0c9d2;
  color: #b42348;
}

.advanced-toggle {
  border-color: var(--editor-border);
  background: var(--editor-card);
  box-shadow: 0 10px 26px rgba(31,45,61,.045);
}

.advanced-toggle:hover {
  border-color: #c8d3df;
  background: #fbfcfe;
}

.preview {
  border-color: #dfd4ae;
  background:
    radial-gradient(circle at 100% 0%, rgba(217,169,28,.09), transparent 34%),
    #fff;
}

.preview__meta span,
.preview__content-grid > div {
  border-color: var(--editor-border);
  background: #f8fafc;
}

.preview__content-grid strong {
  color: var(--editor-text);
}

.action-bar {
  border-color: var(--editor-border);
  background: rgba(255,255,255,.96);
  box-shadow: 0 -8px 28px rgba(31,45,61,.09);
  backdrop-filter: blur(12px);
}

.action-bar__status strong {
  color: var(--editor-text);
}

.action-bar__status span {
  color: var(--editor-muted);
}

.primary-button {
  border-color: var(--editor-wine);
  background: var(--editor-wine);
  color: #fff;
}

.primary-button:hover:not(:disabled) {
  border-color: var(--editor-wine-dark);
  background: var(--editor-wine-dark);
}

.secondary-button--accent {
  border-color: #e3c65e;
  background: #fff7db;
  color: #7d5d00;
}

.global-message--success {
  border-color: #bfe4d4;
  background: #effaf5;
  color: #166b4b;
}

.global-message--error,
.inline-error,
.file-error,
.cover-error {
  color: #b42348;
}

.state-screen {
  border-color: var(--editor-border);
  background: #fff;
  color: var(--editor-text);
}

@media (max-width: 700px) {
  .class-identity {
    width: 100%;
    min-width: 0;
  }
}



/* =========================================================
   V5.4 · EDITAR CLASE · PREVIEW + ACTION BAR LIGHT
   Corrige tarjetas negras heredadas y metadatos con bajo contraste
========================================================= */

.edit-lesson-page .preview {
  border: 1px solid #dfd4ae !important;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(217, 169, 28, .09),
      transparent 34%
    ),
    #ffffff !important;
  box-shadow:
    0 12px 32px
    rgba(31, 45, 61, .055) !important;
}

.edit-lesson-page .preview__top > div > span {
  color: #987000 !important;
}

.edit-lesson-page .preview h2 {
  color: #152033 !important;
}

.edit-lesson-page .preview-status {
  border-color: #bfe4d4 !important;
  background: #effaf5 !important;
  color: #2d8a63 !important;
}

.edit-lesson-page .preview__meta span {
  border: 1px solid #dbe3ec !important;
  background: #f8fafc !important;
  color: #667085 !important;
  opacity: 1 !important;
}

.edit-lesson-page .preview > p {
  color: #667085 !important;
  opacity: 1 !important;
}

/* El template usa ARTICLE, no DIV */
.edit-lesson-page .preview__content-grid article {
  padding: 14px 16px !important;
  border: 1px solid #dbe3ec !important;
  border-radius: 12px !important;
  background: #f8fafc !important;
  box-shadow: none !important;
}

.edit-lesson-page .preview__content-grid article:hover {
  border-color: #cbd6e2 !important;
  background: #ffffff !important;
}

.edit-lesson-page .preview__content-grid span {
  color: #6f7c8f !important;
  opacity: 1 !important;
  font-size: .60rem !important;
  font-weight: 700 !important;
}

.edit-lesson-page .preview__content-grid strong {
  margin-top: 5px !important;
  color: #152033 !important;
  font-size: .82rem !important;
  font-weight: 900 !important;
}

/* Destacar disponibilidad del material sin usar bloques negros */
.edit-lesson-page .preview__content-grid article:first-child {
  border-color: #d8c16a !important;
  background: #fffaf0 !important;
}

.edit-lesson-page .preview__content-grid article:first-child strong {
  color: #987000 !important;
}

/* Barra final */
.edit-lesson-page .action-bar {
  border: 1px solid #dbe3ec !important;
  background: rgba(255, 255, 255, .97) !important;
  box-shadow:
    0 8px 24px
    rgba(31, 48, 73, .055) !important;
  backdrop-filter: blur(10px) !important;
}

.edit-lesson-page .action-bar__status strong {
  color: #152033 !important;
}

.edit-lesson-page .action-bar__status small {
  color: #6f7c8f !important;
  opacity: 1 !important;
}

.edit-lesson-page .secondary-button {
  border-color: #cbd6e2 !important;
  background: #ffffff !important;
  color: #344359 !important;
}

.edit-lesson-page .secondary-button:hover:not(:disabled) {
  border-color: #aebdcd !important;
  background: #f8fafc !important;
}

.edit-lesson-page .secondary-button:disabled {
  border-color: #e2e8f0 !important;
  background: #f8fafc !important;
  color: #a0aaba !important;
  opacity: 1 !important;
}

.edit-lesson-page .primary-button {
  border-color: #9f1945 !important;
  background: #9f1945 !important;
  color: #ffffff !important;
  box-shadow:
    0 7px 16px
    rgba(159, 25, 69, .14) !important;
}

.edit-lesson-page .primary-button:hover:not(:disabled) {
  border-color: #7f1237 !important;
  background: #7f1237 !important;
}

.edit-lesson-page .primary-button:disabled {
  border-color: #e0e6ed !important;
  background: #eef2f6 !important;
  color: #9aa6b5 !important;
  box-shadow: none !important;
  opacity: 1 !important;
}

@media (max-width: 760px) {
  .edit-lesson-page .preview__content-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  }
}

@media (max-width: 480px) {
  .edit-lesson-page .preview__content-grid {
    grid-template-columns: 1fr !important;
  }
}



/* =========================================================
   V5.5 · FIX REAL PREVIEW · ROOT CORRECTO .edit-lesson
   El template usa .edit-lesson, no .edit-lesson-page
========================================================= */

.edit-lesson .preview {
  border: 1px solid #dfd4ae !important;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(217, 169, 28, .09),
      transparent 34%
    ),
    #ffffff !important;
  box-shadow:
    0 12px 32px
    rgba(31, 45, 61, .055) !important;
}

.edit-lesson .preview__top > div > span {
  color: #987000 !important;
}

.edit-lesson .preview h2 {
  color: #152033 !important;
}

.edit-lesson .preview-status {
  border: 1px solid #bfe4d4 !important;
  background: #effaf5 !important;
  color: #2d8a63 !important;
}

.edit-lesson .preview__meta span {
  border: 1px solid #dbe3ec !important;
  background: #f8fafc !important;
  color: #667085 !important;
  opacity: 1 !important;
}

.edit-lesson .preview > p {
  color: #667085 !important;
  opacity: 1 !important;
}

/* TARJETAS REALES: article */
.edit-lesson .preview__content-grid article {
  padding: 14px 16px !important;
  border: 1px solid #dbe3ec !important;
  border-radius: 12px !important;
  background: #f8fafc !important;
  color: #152033 !important;
  box-shadow: none !important;
}

.edit-lesson .preview__content-grid article:first-child {
  border-color: #dfc76d !important;
  background: #fffaf0 !important;
}

.edit-lesson .preview__content-grid article:hover {
  border-color: #cbd6e2 !important;
  background: #ffffff !important;
}

.edit-lesson .preview__content-grid span {
  display: block !important;
  color: #6f7c8f !important;
  opacity: 1 !important;
  font-size: .60rem !important;
  font-weight: 700 !important;
}

.edit-lesson .preview__content-grid strong {
  display: block !important;
  margin-top: 5px !important;
  color: #152033 !important;
  font-size: .82rem !important;
  font-weight: 900 !important;
}

.edit-lesson .preview__content-grid article:first-child strong {
  color: #987000 !important;
}

/* ACTION BAR */
.edit-lesson .action-bar {
  border: 1px solid #dbe3ec !important;
  background: rgba(255,255,255,.97) !important;
  box-shadow:
    0 8px 24px
    rgba(31,48,73,.055) !important;
  backdrop-filter: blur(10px) !important;
}

.edit-lesson .action-bar__status strong {
  color: #152033 !important;
}

.edit-lesson .action-bar__status small {
  color: #6f7c8f !important;
  opacity: 1 !important;
}

.edit-lesson .secondary-button {
  border-color: #cbd6e2 !important;
  background: #ffffff !important;
  color: #344359 !important;
}

.edit-lesson .secondary-button:hover:not(:disabled) {
  border-color: #aebdcd !important;
  background: #f8fafc !important;
}

.edit-lesson .secondary-button:disabled {
  border-color: #e2e8f0 !important;
  background: #f8fafc !important;
  color: #a0aaba !important;
  opacity: 1 !important;
}

.edit-lesson .primary-button {
  border-color: #9f1945 !important;
  background: #9f1945 !important;
  color: #ffffff !important;
  box-shadow:
    0 7px 16px
    rgba(159,25,69,.14) !important;
}

.edit-lesson .primary-button:hover:not(:disabled) {
  border-color: #7f1237 !important;
  background: #7f1237 !important;
}

.edit-lesson .primary-button:disabled {
  border-color: #e0e6ed !important;
  background: #eef2f6 !important;
  color: #9aa6b5 !important;
  box-shadow: none !important;
  opacity: 1 !important;
}

@media (max-width: 760px) {
  .edit-lesson .preview__content-grid {
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
  }
}

@media (max-width: 480px) {
  .edit-lesson .preview__content-grid {
    grid-template-columns: 1fr !important;
  }
}

</style>
