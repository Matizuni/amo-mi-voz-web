<template>
  <section class="resources">
    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="resources__header">
      <div>
        <p class="resources__eyebrow">
          Aula Virtual · Recursos
        </p>

        <h1>Materiales</h1>

        <p>
          Partituras, guías vocales, audios,
          presentaciones y recursos correspondientes
          al programa formativo.
        </p>
      </div>

      <div
        v-if="isStudent && currentUser"
        class="student-voice-card"
      >
        <span>Mi sección</span>

        <strong>
          {{ currentUser.voice }}
        </strong>

        <small>
          Recursos General +
          {{ currentUser.voice }}
        </small>
      </div>

      <div
        v-else
        class="resources__counter"
      >
        <span>Recursos publicados</span>

        <strong>
          {{ materials.length }}
        </strong>
      </div>
    </header>

    <!-- =====================================================
         GESTIÓN PROFESOR
    ====================================================== -->

    <section
      v-if="isTeacher"
      class="teacher-actions"
    >
      <div>
        <span>
          GESTIÓN DE RECURSOS
        </span>

        <strong>
          Biblioteca del Aula Virtual
        </strong>

        <small>
          Publica, edita y elimina materiales
          disponibles para tus estudiantes.
        </small>
      </div>

      <RouterLink
        to="/aula/recursos/publicar"
        class="publish-button"
      >
        + Publicar recurso
      </RouterLink>
    </section>

    <!-- =====================================================
         FILTROS ALUMNO
    ====================================================== -->

    <section
      v-if="isStudent"
      class="student-resource-filter"
    >
      <button
        type="button"
        :class="{
          active:
            audienceFilter === 'mine'
        }"
        @click="audienceFilter = 'mine'"
      >
        Para mí
      </button>

      <button
        type="button"
        :class="{
          active:
            audienceFilter === 'all'
        }"
        @click="audienceFilter = 'all'"
      >
        Todos los recursos
      </button>
    </section>

    <!-- =====================================================
         BUSCADOR Y FILTROS
    ====================================================== -->

    <section class="resources__toolbar">
      <div class="resources__search">
        <span>⌕</span>

        <input
          v-model="search"
          type="text"
          placeholder="Buscar material..."
        >
      </div>

      <select v-model="selectedType">
        <option value="all">
          Todos los tipos
        </option>

        <option value="pdf">
          PDF
        </option>

        <option value="score">
          Partituras
        </option>

        <option value="audio">
          Audio
        </option>

        <option value="video">
          Video
        </option>

        <option value="other">
          Otros
        </option>
      </select>

      <select
        v-if="isTeacher"
        v-model="selectedVoice"
      >
        <option value="all">
          Todas las voces
        </option>

        <option value="general">
          General
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
    </section>

    <!-- =====================================================
         RESUMEN
    ====================================================== -->

    <section class="resources__summary">
      <article>
        <span>Visibles</span>

        <strong>
          {{ filteredMaterials.length }}
        </strong>
      </article>

      <article>
        <span>Generales</span>

        <strong>
          {{ countVoice('general') }}
        </strong>
      </article>

      <article>
        <span>Audios</span>

        <strong>
          {{ countType('audio') }}
        </strong>
      </article>

      <article>
        <span>Partituras</span>

        <strong>
          {{ countType('score') + countType('pdf') }}
        </strong>
      </article>
    </section>

    <!-- =====================================================
         RECURSOS
    ====================================================== -->

    <section class="resources__section">
      <div class="resources__section-title">
        <span>01</span>

        <div>
          <p>Biblioteca</p>

          <h2>
            Recursos del programa
          </h2>
        </div>
      </div>

      <div
        v-if="lessonGroups.length"
        class="lesson-groups"
      >
        <article
          v-for="group in lessonGroups"
          :key="group.lesson.id"
          class="lesson-group"
        >
          <!-- CLASE -->

          <header class="lesson-group__header">
            <div class="lesson-group__number">
              {{
                String(group.lesson.id)
                  .padStart(2, '0')
              }}
            </div>

            <div>
              <span>
                {{ group.lesson.date }}
              </span>

              <h3>
                {{ group.lesson.title }}
              </h3>
            </div>

            <RouterLink
              :to="`/aula/clase/${group.lesson.id}/trabajo`"
              class="lesson-group__link"
            >
              Ver clase →
            </RouterLink>
          </header>

          <!-- TARJETAS -->

          <div class="materials-grid">
            <article
              v-for="material in group.materials"
              :key="material.id"
              class="material-card"
              :class="{
                'material-card--my-voice':
                  isStudent &&
                  isForCurrentStudent(material) &&
                  getMaterialVoice(material) !== 'general'
              }"
              @click="openMaterial(material)"
            >
              <div class="material-card__top">
                <div class="material-card__icon">
                  {{
                    getMaterialIcon(
                      material.type
                    )
                  }}
                </div>

                <div
                  class="material-card__voice"
                  :class="{
                    'material-card__voice--general':
                      getMaterialVoice(material) ===
                      'general'
                  }"
                >
                  <span>
                    {{
                      getVoiceShort(
                        getMaterialVoice(
                          material
                        )
                      )
                    }}
                  </span>

                  {{
                    getVoiceLabel(
                      getMaterialVoice(
                        material
                      )
                    )
                  }}
                </div>
              </div>

              <div class="material-card__content">
                <span>
                  {{
                    getMaterialType(
                      material.type
                    )
                  }}
                </span>

                <h4>
                  {{ material.title }}
                </h4>

                <p>
                  {{
                    material.description ||
                    `Material correspondiente a la Clase ${group.lesson.id}.`
                  }}
                </p>

                <div
                  v-if="
                    material.fileName ||
                    material.fileSize
                  "
                  class="material-card__file"
                >
                  <span v-if="material.fileName">
                    {{ material.fileName }}
                  </span>

                  <small v-if="material.fileSize">
                    {{
                      formatBytes(
                        material.fileSize
                      )
                    }}
                  </small>
                </div>
              </div>

              <div
                v-if="
                  isStudent &&
                  getMaterialVoice(material) !==
                    'general' &&
                  isForCurrentStudent(material)
                "
                class="for-you-badge"
              >
                ★ Recurso para tu voz
              </div>

              <!-- PROFESOR -->

              <div
                v-if="isTeacher"
                class="material-admin"
                @click.stop
              >
                <button
                  type="button"
                  class="material-admin__edit"
                  @click="
                    openEditMaterial(
                      material
                    )
                  "
                >
                  ✎ Editar
                </button>

                <button
                  type="button"
                  class="material-admin__delete"
                  @click="
                    askDeleteMaterial(
                      material
                    )
                  "
                >
                  🗑 Eliminar
                </button>
              </div>

              <!-- FOOTER -->

              <div class="material-card__footer">
                <span>
                  Clase {{ group.lesson.id }}
                </span>

                <button
                  type="button"
                  @click.stop="
                    openMaterial(
                      material
                    )
                  "
                >
                  Ver recurso →
                </button>
              </div>
            </article>
          </div>
        </article>
      </div>

      <div
        v-else
        class="empty-state"
      >
        <div class="empty-state__icon">
          ♪
        </div>

        <div>
          <h3>
            {{
              isLoading
                ? 'Cargando materiales...'
                : 'No encontramos materiales'
            }}
          </h3>

          <p>
            {{
              isLoading
                ? 'Sincronizando la biblioteca con Supabase.'
                : 'Prueba cambiando los filtros o el texto de búsqueda.'
            }}
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
         VISOR
    ====================================================== -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="activeMaterial"
          class="resource-modal"
          @click.self="closeMaterial"
        >
          <article class="resource-modal__window">
            <header class="resource-modal__header">
              <div class="resource-modal__title-area">
                <div class="resource-modal__icon">
                  {{
                    getMaterialIcon(
                      activeMaterial.type
                    )
                  }}
                </div>

                <div>
                  <div class="resource-modal__badges">
                    <span>
                      {{
                        getMaterialType(
                          activeMaterial.type
                        )
                      }}
                    </span>

                    <span>
                      {{
                        getVoiceLabel(
                          getMaterialVoice(
                            activeMaterial
                          )
                        )
                      }}
                    </span>
                  </div>

                  <h2>
                    {{ activeMaterial.title }}
                  </h2>

                  <p
                    v-if="
                      activeMaterial.description
                    "
                  >
                    {{
                      activeMaterial.description
                    }}
                  </p>
                </div>
              </div>

              <div class="resource-modal__actions">
                <button
                  type="button"
                  class="modal-action"
                  :disabled="isDownloading"
                  @click="downloadMaterial"
                >
                  ↓ Descargar
                </button>

                <button
                  v-if="canPrint"
                  type="button"
                  class="modal-action"
                  @click="printMaterial"
                >
                  ⎙ Imprimir
                </button>

                <button
                  type="button"
                  class="modal-close"
                  @click="closeMaterial"
                >
                  ×
                </button>
              </div>
            </header>

            <div class="resource-modal__viewer">
              <!-- PDF -->

              <iframe
                v-if="previewKind === 'pdf'"
                :src="activeMaterial.url"
                class="resource-viewer--pdf"
                title="Vista previa del documento"
              ></iframe>

              <!-- AUDIO -->

              <div
                v-else-if="
                  previewKind === 'audio'
                "
                class="audio-viewer"
              >
                <div class="audio-viewer__art">
                  ♪
                </div>

                <h3>
                  {{ activeMaterial.title }}
                </h3>

                <p>
                  {{
                    getVoiceLabel(
                      getMaterialVoice(
                        activeMaterial
                      )
                    )
                  }}
                </p>

                <audio
                  :src="activeMaterial.url"
                  controls
                  preload="metadata"
                ></audio>
              </div>

              <!-- VIDEO -->

              <video
                v-else-if="
                  previewKind === 'video'
                "
                :src="activeMaterial.url"
                class="resource-viewer--video"
                controls
                playsinline
              ></video>

              <!-- IMAGEN -->

              <div
                v-else-if="
                  previewKind === 'image'
                "
                class="image-viewer"
              >
                <img
                  :src="activeMaterial.url"
                  :alt="
                    activeMaterial.title
                  "
                >
              </div>

              <!-- OTRO -->

              <div
                v-else
                class="unsupported-viewer"
              >
                <div class="unsupported-viewer__icon">
                  {{
                    getMaterialIcon(
                      activeMaterial.type
                    )
                  }}
                </div>

                <h3>
                  Vista previa no disponible
                </h3>

                <p>
                  Descarga el archivo para
                  abrirlo en tu dispositivo.
                </p>

                <button
                  type="button"
                  @click="downloadMaterial"
                >
                  ↓ Descargar archivo
                </button>
              </div>
            </div>

            <footer class="resource-modal__footer">
              <div>
                <span>Archivo</span>

                <strong>
                  {{
                    activeMaterial.fileName ||
                    activeMaterial.title
                  }}
                </strong>
              </div>

              <div
                v-if="
                  activeMaterial.fileSize
                "
              >
                <span>Tamaño</span>

                <strong>
                  {{
                    formatBytes(
                      activeMaterial.fileSize
                    )
                  }}
                </strong>
              </div>

              <div>
                <span>Destinatarios</span>

                <strong>
                  {{
                    getVoiceLabel(
                      getMaterialVoice(
                        activeMaterial
                      )
                    )
                  }}
                </strong>
              </div>
            </footer>
          </article>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         EDITAR RECURSO
    ====================================================== -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="editingMaterial"
          class="admin-modal"
          @click.self="closeEditMaterial"
        >
          <article class="admin-modal__window">
            <header class="admin-modal__header">
              <div>
                <span>
                  GESTIÓN · PROFESOR
                </span>

                <h2>
                  Editar recurso
                </h2>

                <p>
                  Modifica la información
                  visible para los estudiantes.
                </p>
              </div>

              <button
                type="button"
                class="admin-modal__close"
                @click="closeEditMaterial"
              >
                ×
              </button>
            </header>

            <form
              class="edit-form"
              @submit.prevent="saveEditedMaterial"
            >
              <div class="form-field">
                <label for="edit-title">
                  Título
                </label>

                <input
                  id="edit-title"
                  v-model.trim="
                    editForm.title
                  "
                  type="text"
                  required
                >
              </div>

              <div class="form-grid">
                <div class="form-field">
                  <label for="edit-lesson">
                    Clase
                  </label>

                  <select
                    id="edit-lesson"
                    v-model.number="
                      editForm.lessonId
                    "
                    required
                  >
                    <option
                      v-for="lesson in lessons"
                      :key="lesson.id"
                      :value="lesson.id"
                    >
                      Clase {{ lesson.id }} ·
                      {{ lesson.title }}
                    </option>
                  </select>
                </div>

                <div class="form-field">
                  <label for="edit-type">
                    Tipo
                  </label>

                  <select
                    id="edit-type"
                    v-model="
                      editForm.type
                    "
                  >
                    <option value="pdf">
                      PDF
                    </option>

                    <option value="score">
                      Partitura
                    </option>

                    <option value="audio">
                      Audio
                    </option>

                    <option value="video">
                      Video
                    </option>

                    <option value="other">
                      Otro
                    </option>
                  </select>
                </div>
              </div>

              <div class="form-field">
                <label>
                  Sección vocal
                </label>

                <div class="voice-selector">
                  <button
                    v-for="voice in voices"
                    :key="voice.value"
                    type="button"
                    :class="{
                      active:
                        editForm.voice ===
                        voice.value
                    }"
                    @click="
                      editForm.voice =
                        voice.value
                    "
                  >
                    <span>
                      {{ voice.short }}
                    </span>

                    {{ voice.label }}
                  </button>
                </div>
              </div>

              <div class="form-field">
                <label for="edit-description">
                  Descripción
                </label>

                <textarea
                  id="edit-description"
                  v-model.trim="
                    editForm.description
                  "
                  rows="5"
                ></textarea>
              </div>

              <div
                v-if="
                  editingMaterial.fileName
                "
                class="current-file"
              >
                <span>
                  Archivo actual
                </span>

                <strong>
                  {{
                    editingMaterial.fileName
                  }}
                </strong>

                <small>
                  En esta etapa editamos
                  los datos del recurso.
                  El archivo no se reemplaza.
                </small>
              </div>

              <footer class="admin-modal__actions">
                <button
                  type="button"
                  class="button-secondary"
                  @click="closeEditMaterial"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  class="button-primary"
                >
                  Guardar cambios
                </button>
              </footer>
            </form>
          </article>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         CONFIRMAR ELIMINACIÓN
    ====================================================== -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="materialToDelete"
          class="admin-modal admin-modal--danger"
          @click.self="
            closeDeleteConfirmation
          "
        >
          <article class="delete-dialog">
            <div class="delete-dialog__icon">
              !
            </div>

            <span class="delete-dialog__eyebrow">
              ELIMINAR RECURSO
            </span>

            <h2>
              ¿Eliminar este material?
            </h2>

            <strong class="delete-dialog__title">
              {{
                materialToDelete.title
              }}
            </strong>

            <p>
              Este recurso desaparecerá
              del Aula Virtual.
            </p>

            <div
              v-if="
                materialToDelete.storagePath
              "
              class="delete-dialog__warning"
            >
              El archivo también será
              eliminado de Supabase Storage.
            </div>

            <div
              v-else
              class="delete-dialog__warning"
            >
              Este recurso no tiene una ruta
              de Storage registrada. Solo se
              eliminará de la biblioteca.
            </div>

            <footer class="delete-dialog__actions">
              <button
                type="button"
                class="button-secondary"
                :disabled="isDeleting"
                @click="
                  closeDeleteConfirmation
                "
              >
                Cancelar
              </button>

              <button
                type="button"
                class="button-danger"
                :disabled="isDeleting"
                @click="deleteMaterial"
              >
                {{
                  isDeleting
                    ? 'Eliminando...'
                    : 'Eliminar recurso'
                }}
              </button>
            </footer>
          </article>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         NOTIFICACIÓN
    ====================================================== -->

    <Transition name="toast">
      <div
        v-if="toastMessage"
        class="toast-message"
        :class="{
          'toast-message--error':
            toastType === 'error'
        }"
      >
        <span>
          {{
            toastType === 'error'
              ? '!'
              : '✓'
          }}
        </span>

        {{ toastMessage }}
      </div>
    </Transition>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref
} from 'vue'

import {
  RouterLink
} from 'vue-router'

import {
  useAuth
} from '@/composables/useAuth'

import {
  fetchLessons
} from '@/services/lessonService'

import {
  fetchMaterials,
  updateMaterial,
  removeMaterial
} from '@/services/materialService'

const {
  currentUser,
  isTeacher,
  isStudent
} = useAuth()

/* =========================================================
   DATOS REMOTOS
========================================================= */

const lessons = ref([])
const materials = ref([])

const isLoading = ref(true)
const loadError = ref('')

const loadData = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const [
      loadedLessons,
      loadedMaterials
    ] = await Promise.all([
      fetchLessons(),
      fetchMaterials()
    ])

    lessons.value = loadedLessons
    materials.value = loadedMaterials
  } catch (error) {
    console.error(
      'Error cargando biblioteca:',
      error
    )

    loadError.value =
      error?.message ||
      'No se pudo cargar la biblioteca.'

    showToast(
      'No se pudieron cargar los recursos.',
      'error'
    )
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   FILTROS
========================================================= */

const search = ref('')
const selectedType = ref('all')
const selectedVoice = ref('all')
const audienceFilter = ref('mine')

/* =========================================================
   VISOR
========================================================= */

const activeMaterial = ref(null)
const isDownloading = ref(false)

/* =========================================================
   ADMIN
========================================================= */

const editingMaterial = ref(null)
const materialToDelete = ref(null)
const isDeleting = ref(false)
const isSavingEdit = ref(false)

const toastMessage = ref('')
const toastType = ref('success')

let toastTimer = null

const voices = [
  {
    value: 'general',
    label: 'General',
    short: 'ALL'
  },
  {
    value: 'Soprano',
    label: 'Soprano',
    short: 'S'
  },
  {
    value: 'Alto',
    label: 'Alto',
    short: 'A'
  },
  {
    value: 'Tenor',
    label: 'Tenor',
    short: 'T'
  },
  {
    value: 'Bajo',
    label: 'Bajo',
    short: 'B'
  }
]

const editForm = reactive({
  title: '',
  lessonId: '',
  type: 'pdf',
  voice: 'general',
  description: ''
})

/* =========================================================
   NOTIFICACIONES
========================================================= */

const showToast = (
  message,
  type = 'success'
) => {
  clearTimeout(toastTimer)

  toastMessage.value = message
  toastType.value = type

  toastTimer = setTimeout(() => {
    toastMessage.value = ''
  }, 3000)
}

/* =========================================================
   VOZ
========================================================= */

const getMaterialVoice = material => {
  return (
    material?.voice ||
    'general'
  )
}

const isForCurrentStudent = material => {
  if (!currentUser.value) {
    return false
  }

  const voice =
    getMaterialVoice(material)

  return (
    voice === 'general' ||
    voice ===
      currentUser.value.voice
  )
}

const getVoiceLabel = voice => {
  if (
    !voice ||
    voice === 'general'
  ) {
    return 'General'
  }

  return voice
}

const getVoiceShort = voice => {
  const labels = {
    general: 'ALL',
    Soprano: 'S',
    Alto: 'A',
    Tenor: 'T',
    Bajo: 'B'
  }

  return (
    labels[voice] ||
    'ALL'
  )
}

/* =========================================================
   FILTRADO
========================================================= */

const filteredMaterials = computed(() => {
  const text =
    search.value
      .trim()
      .toLowerCase()

  return materials.value.filter(
    material => {
      const title =
        String(
          material.title ||
          ''
        ).toLowerCase()

      const description =
        String(
          material.description ||
          ''
        ).toLowerCase()

      const matchesSearch =
        !text ||
        title.includes(text) ||
        description.includes(text)

      const matchesType =
        selectedType.value ===
          'all' ||
        material.type ===
          selectedType.value

      let matchesVoice = true

      if (
        isTeacher.value &&
        selectedVoice.value !==
          'all'
      ) {
        matchesVoice =
          getMaterialVoice(
            material
          ) ===
          selectedVoice.value
      }

      let matchesAudience = true

      if (
        isStudent.value &&
        audienceFilter.value ===
          'mine'
      ) {
        matchesAudience =
          isForCurrentStudent(
            material
          )
      }

      return (
        matchesSearch &&
        matchesType &&
        matchesVoice &&
        matchesAudience
      )
    }
  )
})

/* =========================================================
   AGRUPAR POR CLASE
========================================================= */

const lessonGroups = computed(() => {
  return lessons.value
    .map(lesson => {
      const lessonMaterials =
        filteredMaterials.value.filter(
          material =>
            Number(
              material.lessonId
            ) ===
            Number(
              lesson.id
            )
        )

      return {
        lesson,
        materials:
          lessonMaterials
      }
    })
    .filter(
      group =>
        group.materials.length > 0
    )
})

/* =========================================================
   CONTADORES
========================================================= */

const countVoice = voice => {
  return filteredMaterials.value
    .filter(
      material =>
        getMaterialVoice(
          material
        ) === voice
    )
    .length
}

const countType = type => {
  return filteredMaterials.value
    .filter(
      material =>
        material.type === type
    )
    .length
}

/* =========================================================
   TIPO
========================================================= */

const getMaterialType = type => {
  const types = {
    pdf: 'PDF',
    score: 'Partitura',
    audio: 'Audio',
    video: 'Video',
    link: 'Enlace',
    other: 'Archivo'
  }

  return (
    types[type] ||
    'Material'
  )
}

const getMaterialIcon = type => {
  const icons = {
    pdf: 'PDF',
    score: '♫',
    audio: '♪',
    video: '▶',
    link: '↗',
    other: 'FILE'
  }

  return (
    icons[type] ||
    '•'
  )
}

/* =========================================================
   ABRIR / CERRAR VISOR
========================================================= */

const openMaterial = material => {
  if (!material?.url) {
    showToast(
      'Este recurso no tiene un archivo asociado.',
      'error'
    )

    return
  }

  activeMaterial.value =
    material

  document.body.style.overflow =
    'hidden'
}

const closeMaterial = () => {
  activeMaterial.value = null

  document.body.style.overflow =
    ''
}

/* =========================================================
   VISTA PREVIA
========================================================= */

const previewKind = computed(() => {
  const material =
    activeMaterial.value

  if (!material) {
    return 'other'
  }

  const mime =
    String(
      material.mimeType ||
      ''
    ).toLowerCase()

  const fileName =
    String(
      material.fileName ||
      material.url ||
      ''
    ).toLowerCase()

  if (
    mime.includes('pdf') ||
    fileName.includes('.pdf') ||
    material.type === 'pdf' ||
    (
      material.type ===
        'score' &&
      fileName.includes('.pdf')
    )
  ) {
    return 'pdf'
  }

  if (
    mime.startsWith('audio/') ||
    /\.(mp3|wav|m4a|aac|ogg|flac)$/i
      .test(fileName) ||
    material.type === 'audio'
  ) {
    return 'audio'
  }

  if (
    mime.startsWith('video/') ||
    /\.(mp4|webm|mov|m4v)$/i
      .test(fileName) ||
    material.type === 'video'
  ) {
    return 'video'
  }

  if (
    mime.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif)$/i
      .test(fileName)
  ) {
    return 'image'
  }

  return 'other'
})

/* =========================================================
   DESCARGAR
========================================================= */

const downloadMaterial = async () => {
  const material =
    activeMaterial.value

  if (
    !material?.url ||
    isDownloading.value
  ) {
    return
  }

  isDownloading.value = true

  try {
    const response =
      await fetch(
        material.url
      )

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}`
      )
    }

    const blob =
      await response.blob()

    const objectUrl =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href =
      objectUrl

    link.download =
      material.fileName ||
      material.title ||
      'material'

    document.body.appendChild(
      link
    )

    link.click()
    link.remove()

    setTimeout(() => {
      URL.revokeObjectURL(
        objectUrl
      )
    }, 1000)
  } catch (error) {
    console.error(
      'Error descargando:',
      error
    )

    showToast(
      'No se pudo descargar el archivo.',
      'error'
    )
  } finally {
    isDownloading.value = false
  }
}

/* =========================================================
   IMPRIMIR
========================================================= */

const canPrint = computed(() => {
  return (
    previewKind.value === 'pdf' ||
    previewKind.value === 'image'
  )
})

const printMaterial = () => {
  const material =
    activeMaterial.value

  if (!material?.url) {
    return
  }

  window.open(
    material.url,
    '_blank',
    'noopener,noreferrer'
  )
}

/* =========================================================
   EDITAR RECURSO
========================================================= */

const openEditMaterial = material => {
  if (!isTeacher.value) {
    return
  }

  activeMaterial.value = null

  editingMaterial.value =
    material

  editForm.title =
    material.title || ''

  editForm.lessonId =
    Number(
      material.lessonId
    )

  editForm.type =
    material.type || 'pdf'

  editForm.voice =
    getMaterialVoice(
      material
    )

  editForm.description =
    material.description ||
    ''

  document.body.style.overflow =
    'hidden'
}

const closeEditMaterial = () => {
  if (isSavingEdit.value) {
    return
  }

  editingMaterial.value = null

  document.body.style.overflow =
    ''
}

const saveEditedMaterial = async () => {
  if (
    !editingMaterial.value ||
    !editForm.title.trim() ||
    isSavingEdit.value
  ) {
    return
  }

  isSavingEdit.value = true

  try {
    const updated =
      await updateMaterial(
        editingMaterial.value.id,
        {
          lessonId:
            Number(
              editForm.lessonId
            ),
          title:
            editForm.title.trim(),
          type:
            editForm.type,
          voice:
            editForm.voice,
          description:
            editForm.description.trim()
        }
      )

    const index =
      materials.value.findIndex(
        item =>
          Number(item.id) ===
          Number(updated.id)
      )

    if (index !== -1) {
      materials.value.splice(
        index,
        1,
        updated
      )
    }

    editingMaterial.value = null
    document.body.style.overflow = ''

    showToast(
      'Recurso actualizado en Supabase.'
    )
  } catch (error) {
    console.error(
      'Error actualizando recurso:',
      error
    )

    showToast(
      error?.message ||
      'No se pudo actualizar el recurso.',
      'error'
    )
  } finally {
    isSavingEdit.value = false
  }
}

/* =========================================================
   ELIMINAR
========================================================= */

const askDeleteMaterial = material => {
  if (!isTeacher.value) {
    return
  }

  activeMaterial.value = null
  materialToDelete.value = material

  document.body.style.overflow =
    'hidden'
}

const closeDeleteConfirmation = () => {
  if (isDeleting.value) {
    return
  }

  materialToDelete.value = null

  document.body.style.overflow =
    ''
}

const deleteMaterial = async () => {
  const material =
    materialToDelete.value

  if (
    !material ||
    isDeleting.value
  ) {
    return
  }

  isDeleting.value = true

  try {
    await removeMaterial(
      material
    )

    materials.value =
      materials.value.filter(
        item =>
          Number(item.id) !==
          Number(material.id)
      )

    if (
      activeMaterial.value &&
      Number(
        activeMaterial.value.id
      ) ===
      Number(material.id)
    ) {
      activeMaterial.value = null
    }

    materialToDelete.value = null

    document.body.style.overflow =
      ''

    showToast(
      'Recurso eliminado de Database y Storage.'
    )
  } catch (error) {
    console.error(
      'Error eliminando recurso:',
      error
    )

    showToast(
      error?.message ||
      'No se pudo eliminar el recurso.',
      'error'
    )
  } finally {
    isDeleting.value = false
  }
}

/* =========================================================
   FORMATO
========================================================= */

const formatBytes = bytes => {
  const value =
    Number(bytes)

  if (!value) {
    return '—'
  }

  if (value < 1024) {
    return `${value} B`
  }

  if (
    value <
    1024 * 1024
  ) {
    return `${(
      value / 1024
    ).toFixed(1)} KB`
  }

  return `${(
    value /
    (1024 * 1024)
  ).toFixed(1)} MB`
}

/* =========================================================
   ESC
========================================================= */

const handleEscape = event => {
  if (
    event.key !== 'Escape'
  ) {
    return
  }

  if (materialToDelete.value) {
    closeDeleteConfirmation()
    return
  }

  if (editingMaterial.value) {
    closeEditMaterial()
    return
  }

  if (activeMaterial.value) {
    closeMaterial()
  }
}

/* =========================================================
   INIT
========================================================= */

onMounted(() => {
  loadData()

  window.addEventListener(
    'keydown',
    handleEscape
  )
})

onUnmounted(() => {
  window.removeEventListener(
    'keydown',
    handleEscape
  )

  clearTimeout(
    toastTimer
  )

  document.body.style.overflow =
    ''
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.resources {
  width: 100%;
  max-width: 1250px;
  margin: 0 auto;
}

.resources__header {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-2xl;
}

.resources__eyebrow {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.resources__header h1 {
  margin-bottom: variables.$spacing-md;
  font-size:
    clamp(
      3rem,
      7vw,
      5rem
    );
}

.resources__header p:last-child {
  max-width: 720px;
  line-height: 1.6;
  opacity: 0.65;
}

.resources__counter,
.student-voice-card {
  min-width: 200px;
  padding: variables.$spacing-xl;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.resources__counter span,
.resources__counter strong,
.student-voice-card span,
.student-voice-card strong,
.student-voice-card small {
  display: block;
}

.resources__counter span,
.student-voice-card span {
  margin-bottom: variables.$spacing-sm;
  opacity: 0.5;
}

.resources__counter strong,
.student-voice-card strong {
  color: variables.$color-primary;
  font-size: 1.8rem;
}

.student-voice-card small {
  margin-top: variables.$spacing-sm;
  opacity: 0.45;
}

/* =========================================================
   PROFESOR
========================================================= */

.teacher-actions {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: center;
  justify-content: space-between;
  margin-bottom: variables.$spacing-xl;
  padding: variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.teacher-actions span,
.teacher-actions strong,
.teacher-actions small {
  display: block;
}

.teacher-actions span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.1em;
}

.teacher-actions small {
  margin-top: 5px;
  opacity: 0.5;
}

.publish-button {
  flex-shrink: 0;
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-radius: variables.$radius-lg;
  background: variables.$color-primary;
  color: variables.$color-white;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

/* =========================================================
   FILTRO ALUMNO
========================================================= */

.student-resource-filter {
  display: flex;
  gap: variables.$spacing-sm;
  flex-wrap: wrap;
  margin-bottom: variables.$spacing-xl;
}

.student-resource-filter button {
  padding:
    variables.$spacing-sm
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  background: transparent;
  color: variables.$color-white;
  font: inherit;
  cursor: pointer;
  opacity: 0.55;
}

.student-resource-filter button.active {
  border-color: variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
  opacity: 1;
}

/* =========================================================
   TOOLBAR
========================================================= */

.resources__toolbar {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns:
    1fr
    210px
    210px;
  margin-bottom: variables.$spacing-xl;
}

.resources__search {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  padding:
    0
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.resources__search > span {
  color: variables.$color-primary;
}

.resources__search input {
  width: 100%;
  padding:
    variables.$spacing-md
    0;
  border: 0;
  outline: 0;
  background: transparent;
  color: variables.$color-white;
  font: inherit;
}

.resources__toolbar select {
  padding:
    variables.$spacing-md
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  color: variables.$color-white;
  font: inherit;
}

/* =========================================================
   RESUMEN
========================================================= */

.resources__summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  margin-bottom: variables.$spacing-3xl;
}

.resources__summary article {
  padding: variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.resources__summary span,
.resources__summary strong {
  display: block;
}

.resources__summary span {
  margin-bottom: variables.$spacing-sm;
  opacity: 0.5;
}

.resources__summary strong {
  color: variables.$color-primary;
  font-size: 1.8rem;
}

/* =========================================================
   SECCIÓN
========================================================= */

.resources__section {
  margin-bottom: variables.$spacing-3xl;
}

.resources__section-title {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-bottom: variables.$spacing-xl;
}

.resources__section-title > span {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-bold;
}

.resources__section-title p {
  margin: 0;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  text-transform: uppercase;
}

.resources__section-title h2 {
  margin: 0;
}

/* =========================================================
   CLASES
========================================================= */

.lesson-groups {
  display: grid;
  gap: variables.$spacing-2xl;
}

.lesson-group {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.lesson-group__header {
  display: grid;
  gap: variables.$spacing-lg;
  align-items: center;
  grid-template-columns:
    auto
    1fr
    auto;
  padding: variables.$spacing-xl;
  border-bottom:
    1px solid
    variables.$color-border;
  background: variables.$color-background;
}

.lesson-group__number {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-bold;
}

.lesson-group__header span {
  display: block;
  margin-bottom: variables.$spacing-xs;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.lesson-group__header h3 {
  margin: 0;
}

.lesson-group__link {
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

/* =========================================================
   TARJETAS
========================================================= */

.materials-grid {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
  padding: variables.$spacing-xl;
}

.material-card {
  display: flex;
  min-height: 310px;
  padding: variables.$spacing-xl;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
  flex-direction: column;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.material-card:hover {
  border-color: variables.$color-primary;
  transform: translateY(-2px);
}

.material-card--my-voice {
  border-color: variables.$color-primary;
}

.material-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: variables.$spacing-lg;
}

.material-card__icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-bold;
}

.material-card__voice {
  display: flex;
  gap: 5px;
  align-items: center;
  padding:
    0.35rem
    0.65rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 999px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.material-card__voice span {
  display: grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: variables.$color-white;
  font-size: 0.65rem;
}

.material-card__voice--general {
  border-color: variables.$color-border;
  color: variables.$color-white;
  opacity: 0.55;
}

.material-card__voice--general span {
  background: variables.$color-border;
}

.material-card__content {
  flex: 1;
}

.material-card__content > span {
  display: block;
  margin-bottom: variables.$spacing-xs;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
}

.material-card__content h4 {
  margin-bottom: variables.$spacing-sm;
  font-size: 1.2rem;
}

.material-card__content p {
  line-height: 1.55;
  opacity: 0.5;
}

.material-card__file {
  display: flex;
  gap: 8px;
  justify-content: space-between;
  margin-top: variables.$spacing-md;
  padding: 8px 10px;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  font-size: variables.$font-size-xs;
  opacity: 0.55;
}

.material-card__file span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.for-you-badge {
  width: fit-content;
  margin-top: variables.$spacing-md;
  padding:
    0.4rem
    0.7rem;
  border-radius: 999px;
  background: variables.$color-primary;
  color: variables.$color-white;
  font-size: variables.$font-size-xs;
}

/* =========================================================
   ADMIN TARJETA
========================================================= */

.material-admin {
  display: grid;
  gap: 8px;
  grid-template-columns: 1fr 1fr;
  margin-top: variables.$spacing-lg;
}

.material-admin button {
  padding:
    9px
    10px;
  border-radius: variables.$radius-lg;
  background: transparent;
  font: inherit;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

.material-admin__edit {
  border:
    1px solid
    variables.$color-primary;
  color: variables.$color-primary;
}

.material-admin__delete {
  border:
    1px solid
    rgba(
      230,
      80,
      80,
      0.55
    );
  color: #ff7777;
}

.material-admin__delete:hover {
  background:
    rgba(
      230,
      80,
      80,
      0.1
    );
}

/* =========================================================
   FOOTER TARJETA
========================================================= */

.material-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: variables.$spacing-lg;
  padding-top: variables.$spacing-md;
  border-top:
    1px solid
    variables.$color-border;
}

.material-card__footer span {
  font-size: variables.$font-size-xs;
  opacity: 0.4;
}

.material-card__footer button {
  padding: 0;
  border: 0;
  background: transparent;
  color: variables.$color-primary;
  font: inherit;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

/* =========================================================
   VISOR
========================================================= */

.resource-modal,
.admin-modal {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  padding: 20px;
  place-items: center;
  background:
    rgba(
      0,
      0,
      0,
      0.92
    );
  backdrop-filter: blur(10px);
}

.resource-modal__window {
  display: flex;
  width: min(1250px, 96vw);
  height: min(850px, 94vh);
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
  flex-direction: column;
}

.resource-modal__header {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: center;
  justify-content: space-between;
  padding: variables.$spacing-lg;
  border-bottom:
    1px solid
    variables.$color-border;
  background: variables.$color-surface;
}

.resource-modal__title-area {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
}

.resource-modal__icon {
  display: grid;
  width: 55px;
  height: 55px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
}

.resource-modal__badges {
  display: flex;
  gap: 6px;
}

.resource-modal__badges span {
  padding:
    3px
    7px;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 999px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.resource-modal__title-area h2 {
  margin: 6px 0;
}

.resource-modal__title-area p {
  margin: 0;
  opacity: 0.5;
}

.resource-modal__actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.modal-action {
  padding:
    9px
    12px;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: transparent;
  color: variables.$color-white;
  font: inherit;
  cursor: pointer;
}

.modal-close,
.admin-modal__close {
  display: grid;
  width: 42px;
  height: 42px;
  padding: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 50%;
  background: transparent;
  color: variables.$color-white;
  font-size: 1.7rem;
  cursor: pointer;
}

.resource-modal__viewer {
  display: grid;
  min-height: 0;
  flex: 1;
  place-items: center;
  overflow: auto;
  background: #111;
}

.resource-viewer--pdf {
  width: 100%;
  height: 100%;
  min-height: 500px;
  border: 0;
  background: white;
}

.resource-viewer--video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: black;
}

.image-viewer {
  display: grid;
  width: 100%;
  height: 100%;
  padding: variables.$spacing-xl;
  place-items: center;
}

.image-viewer img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.audio-viewer {
  display: grid;
  width: min(650px, 90%);
  gap: variables.$spacing-lg;
  padding: variables.$spacing-3xl;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  text-align: center;
}

.audio-viewer__art {
  display: grid;
  width: 120px;
  height: 120px;
  margin: 0 auto;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 4rem;
}

.audio-viewer audio {
  width: 100%;
}

.unsupported-viewer {
  max-width: 500px;
  padding: variables.$spacing-3xl;
  text-align: center;
}

.unsupported-viewer__icon {
  display: grid;
  width: 90px;
  height: 90px;
  margin:
    0 auto
    variables.$spacing-xl;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
}

.unsupported-viewer button {
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border: 0;
  border-radius: variables.$radius-lg;
  background: variables.$color-primary;
  color: variables.$color-white;
  cursor: pointer;
}

.resource-modal__footer {
  display: flex;
  gap: variables.$spacing-2xl;
  flex-wrap: wrap;
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-top:
    1px solid
    variables.$color-border;
  background: variables.$color-surface;
}

.resource-modal__footer div {
  display: grid;
}

.resource-modal__footer span {
  font-size: variables.$font-size-xs;
  opacity: 0.4;
}

/* =========================================================
   EDITAR
========================================================= */

.admin-modal__window {
  width: min(750px, 96vw);
  max-height: 92vh;
  overflow: auto;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.admin-modal__header {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: flex-start;
  justify-content: space-between;
  padding: variables.$spacing-xl;
  border-bottom:
    1px solid
    variables.$color-border;
  background: variables.$color-surface;
}

.admin-modal__header > div > span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
}

.admin-modal__header h2 {
  margin:
    variables.$spacing-sm
    0;
  font-size: 2rem;
}

.admin-modal__header p {
  margin: 0;
  opacity: 0.5;
}

.edit-form {
  display: grid;
  gap: variables.$spacing-xl;
  padding: variables.$spacing-xl;
}

.form-grid {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: 1fr 1fr;
}

.form-field {
  display: grid;
  gap: variables.$spacing-sm;
}

.form-field label {
  font-weight: variables.$font-weight-semibold;
}

.form-field input,
.form-field select,
.form-field textarea {
  width: 100%;
  padding: variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  outline: 0;
  background: variables.$color-surface;
  color: variables.$color-white;
  font: inherit;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: variables.$color-primary;
}

.form-field textarea {
  resize: vertical;
}

.voice-selector {
  display: grid;
  gap: 8px;
  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );
}

.voice-selector button {
  display: grid;
  gap: 5px;
  padding: 10px 5px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: transparent;
  color: variables.$color-white;
  font: inherit;
  font-size: variables.$font-size-xs;
  cursor: pointer;
  opacity: 0.55;
}

.voice-selector button.active {
  border-color: variables.$color-primary;
  color: variables.$color-primary;
  opacity: 1;
}

.voice-selector button span {
  display: grid;
  min-width: 28px;
  height: 28px;
  padding: 0 4px;
  place-items: center;
  border:
    1px solid
    currentColor;
  border-radius: 50%;
}

.current-file {
  display: grid;
  gap: 4px;
  padding: variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.current-file span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.current-file small {
  margin-top: 5px;
  opacity: 0.45;
}

.admin-modal__actions {
  display: flex;
  gap: variables.$spacing-md;
  justify-content: flex-end;
}

.button-primary,
.button-secondary,
.button-danger {
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

.button-primary {
  border:
    1px solid
    variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.button-secondary {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color: variables.$color-white;
}

.button-danger {
  border: 1px solid #d95151;
  background: #b83636;
  color: white;
}

.button-danger:disabled,
.button-secondary:disabled {
  opacity: 0.45;
  cursor: wait;
}

/* =========================================================
   ELIMINAR
========================================================= */

.delete-dialog {
  width: min(520px, 94vw);
  padding: variables.$spacing-2xl;
  border:
    1px solid
    rgba(
      230,
      80,
      80,
      0.55
    );
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
  text-align: center;
}

.delete-dialog__icon {
  display: grid;
  width: 70px;
  height: 70px;
  margin:
    0 auto
    variables.$spacing-lg;
  place-items: center;
  border: 1px solid #e35e5e;
  border-radius: 50%;
  color: #ff7474;
  font-size: 2rem;
}

.delete-dialog__eyebrow {
  color: #ff7474;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
}

.delete-dialog h2 {
  margin:
    variables.$spacing-sm
    0
    variables.$spacing-md;
}

.delete-dialog__title {
  display: block;
  margin-bottom: variables.$spacing-lg;
  color: variables.$color-primary;
}

.delete-dialog p {
  opacity: 0.6;
}

.delete-dialog__warning {
  margin:
    variables.$spacing-lg
    0;
  padding: variables.$spacing-md;
  border:
    1px solid
    rgba(
      230,
      80,
      80,
      0.25
    );
  border-radius: variables.$radius-lg;
  background:
    rgba(
      230,
      80,
      80,
      0.06
    );
  font-size: variables.$font-size-sm;
}

.delete-dialog__actions {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: 1fr 1fr;
}

/* =========================================================
   TOAST
========================================================= */

.toast-message {
  position: fixed;
  right: 25px;
  bottom: 25px;
  z-index: 200000;
  display: flex;
  gap: 10px;
  align-items: center;
  max-width: 380px;
  padding:
    variables.$spacing-md
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  color: variables.$color-primary;
  box-shadow:
    0 15px 50px
    rgba(
      0,
      0,
      0,
      0.4
    );
}

.toast-message--error {
  border-color: #d95151;
  color: #ff7474;
}

/* =========================================================
   VACÍO
========================================================= */

.empty-state {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  padding: variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.empty-state__icon {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.empty-state h3 {
  margin-bottom: variables.$spacing-xs;
}

.empty-state p {
  margin: 0;
  opacity: 0.5;
}

/* =========================================================
   TRANSICIONES
========================================================= */

.modal-enter-active,
.modal-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to,
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1050px) {
  .materials-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .resources__summary {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 800px) {
  .resources__header {
    align-items: stretch;
    flex-direction: column;
  }

  .resources__counter,
  .student-voice-card {
    width: 100%;
  }

  .resources__toolbar {
    grid-template-columns: 1fr;
  }

  .teacher-actions {
    align-items: flex-start;
    flex-direction: column;
  }

  .lesson-group__header {
    grid-template-columns:
      auto
      1fr;
  }

  .lesson-group__link {
    grid-column: 1 / -1;
  }

  .resource-modal {
    padding: 8px;
  }

  .resource-modal__window {
    width: 100%;
    height: 97vh;
  }

  .resource-modal__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .resource-modal__actions {
    width: 100%;
  }

  .modal-action {
    flex: 1;
  }

  .voice-selector {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 600px) {
  .materials-grid,
  .resources__summary,
  .form-grid {
    grid-template-columns: 1fr;
  }

  .lesson-group__header {
    grid-template-columns: 1fr;
  }

  .lesson-group__number {
    width: 48px;
    height: 48px;
  }

  .materials-grid {
    padding: variables.$spacing-md;
  }

  .material-admin {
    grid-template-columns: 1fr;
  }

  .admin-modal {
    padding: 8px;
  }

  .admin-modal__window {
    width: 100%;
    max-height: 96vh;
  }

  .admin-modal__actions {
    flex-direction: column-reverse;
  }

  .button-primary,
  .button-secondary {
    width: 100%;
  }

  .delete-dialog__actions {
    grid-template-columns: 1fr;
  }

  .toast-message {
    right: 12px;
    bottom: 12px;
    left: 12px;
    max-width: none;
  }
}
</style>