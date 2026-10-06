<template>
  <section class="resources resources--smart">
    <section v-if="isLoading" class="resources-state resources-state--loading">
      <div class="resources-state__spinner"></div>
      <span>Sincronizando la biblioteca…</span>
      <strong>Preparando tus recursos académicos.</strong>
    </section>

    <section v-else-if="loadError" class="resources-state resources-state--error">
      <div class="resources-state__icon">!</div>
      <span>Biblioteca</span>
      <strong>No pudimos cargar los recursos.</strong>
      <p>{{ loadError }}</p>
      <button type="button" @click="loadData">Reintentar</button>
    </section>

    <template v-else>
      <!-- =====================================================
           HERO · BIBLIOTECA INTELIGENTE
      ====================================================== -->
      <header class="resources-hero">
        <div class="resources-hero__glow resources-hero__glow--wine"></div>
        <div class="resources-hero__glow resources-hero__glow--gold"></div>
        <div class="resources-hero__grid"></div>

        <div class="resources-hero__copy">
          <span class="resources-hero__eyebrow">
            <i></i>
            AULA VIRTUAL · BIBLIOTECA
          </span>

          <h1>
            Tus recursos<span>.</span>
          </h1>

          <p>
            Documentos, partituras, audios, videos y material de clase
            reunidos en una biblioteca visual. <b>Un clic y estás dentro.</b>
          </p>

          <div class="resources-hero__quick">
            <span>{{ materials.length }} recursos</span>
            <span>{{ totalScores }} partituras / PDF</span>
            <span>{{ totalAudio }} audios</span>
            <span>{{ totalVideo }} videos</span>
          </div>
        </div>

        <div class="resources-hero__side">
          <div class="resources-hero__orb">
            <span>{{ filteredMaterials.length }}</span>
            <small>visibles</small>
          </div>

          <RouterLink
            v-if="isTeacher"
            to="/aula/recursos/publicar"
            class="resources-hero__publish"
          >
            <span>＋</span>
            Publicar recurso
          </RouterLink>
        </div>
      </header>

      <!-- =====================================================
           IDENTIDAD / VOZ ACTUAL
      ====================================================== -->
      <section
        v-if="isStudent && currentUser"
        class="resources-focus"
      >
        <div class="resources-focus__mark">
          {{ getVoiceShort(currentUser.voice) }}
        </div>

        <div>
          <span>CURACIÓN PERSONALIZADA</span>
          <strong>
            Recursos generales + material para {{ currentUser.voice }}
          </strong>
          <small>
            {{ audienceFilter === 'mine' ? 'Mostrando lo más relevante para tu voz.' : 'Mostrando toda la biblioteca disponible.' }}
          </small>
        </div>

        <button
          type="button"
          class="resources-focus__toggle"
          :class="{ 'is-active': audienceFilter === 'mine' }"
          @click="audienceFilter = audienceFilter === 'mine' ? 'all' : 'mine'"
        >
          <span></span>
          {{ audienceFilter === 'mine' ? 'Solo para mí' : 'Toda la biblioteca' }}
        </button>
      </section>

      <!-- =====================================================
           BUSQUEDA + FILTROS
      ====================================================== -->
      <section class="resources-controls">
        <label class="resources-search">
          <span>⌕</span>
          <input
            v-model="search"
            type="search"
            placeholder="Buscar por título, archivo o descripción…"
            aria-label="Buscar recursos"
          >
          <kbd>⌘ K</kbd>
        </label>

        <div class="resources-controls__row">
          <div class="resources-filter-pills" aria-label="Filtrar recursos por tipo">
            <button
              v-for="option in resourceFilterOptions"
              :key="option.value"
              type="button"
              class="resources-filter-pill"
              :class="{ 'is-active': selectedType === option.value }"
              @click="setResourceFilter(option.value)"
            >
              <span>{{ option.label }}</span>
              <small>{{ option.count }}</small>
            </button>
          </div>

          <label class="resources-sort">
            <span>Ordenar</span>
            <select v-model="sortMode">
              <option value="smart">Más relevantes</option>
              <option value="recent">Más recientes</option>
              <option value="alpha">A–Z</option>
            </select>
          </label>
        </div>
      </section>

      <!-- =====================================================
           RESUMEN RAPIDO
      ====================================================== -->
      <section class="resources-summary">
        <div>
          <span>RESULTADOS</span>
          <strong>{{ smartMaterials.length }}</strong>
          <small>recursos visibles</small>
        </div>

        <div>
          <span>GENERAL</span>
          <strong>{{ countVoice('general') }}</strong>
          <small>material compartido</small>
        </div>

        <div>
          <span>AUDIO</span>
          <strong>{{ countType('audio') }}</strong>
          <small>guías auditivas</small>
        </div>

        <div>
          <span>DOCUMENTOS</span>
          <strong>{{ countType('score') + countType('pdf') + countType('other') }}</strong>
          <small>lecturas y estudio</small>
        </div>
      </section>

      <!-- =====================================================
           BIBLIOTECA
      ====================================================== -->
      <section class="resources-library">
        <header class="resources-library__header">
          <div>
            <span>BIBLIOTECA ACADÉMICA</span>
            <h2>Explora todo sin perderte.</h2>
          </div>
          <p>
            Haz clic en cualquier recurso para abrir su visor, escuchar o ver el material.
          </p>
        </header>

        <TransitionGroup
          v-if="smartMaterials.length"
          name="resource-list"
          tag="div"
          class="resource-grid"
        >
          <article
            v-for="material in smartMaterials"
            :key="material.id"
            class="resource-card"
            :class="{
              'resource-card--personal': isPersonalResource(material),
              'resource-card--score': getResourceKind(material) === 'score',
              'resource-card--document': getResourceKind(material) === 'document',
              'resource-card--audio': getResourceKind(material) === 'audio',
              'resource-card--video': getResourceKind(material) === 'video',
              'resource-card--image': getResourceKind(material) === 'image',
              'resource-card--link': getResourceKind(material) === 'link',
            }"
            :style="{
              '--resource-accent': getResourceColor(material),
              '--resource-rgb': getResourceGlow(material),
            }"
            tabindex="0"
            role="button"
            :aria-label="`Abrir ${material.title}`"
            @click="openMaterial(material)"
            @keydown="handleResourceCardKey($event, material)"
          >
            <div class="resource-card__shine"></div>

            <div class="resource-card__preview">
              <div class="resource-card__preview-glow"></div>

              <!-- IMAGEN -->
              <img
                v-if="getResourceKind(material) === 'image'"
                :src="material.url"
                :alt="material.title"
                class="resource-card__media resource-card__media--image"
                loading="lazy"
              >

              <!-- PDF / PARTITURA -->
              <iframe
                v-else-if="['document', 'score'].includes(getResourceKind(material)) && material.url"
                :src="`${material.url}#page=1&toolbar=0&navpanes=0&scrollbar=0`"
                class="resource-card__media resource-card__media--pdf"
                loading="lazy"
                tabindex="-1"
                title="Vista previa del documento"
              ></iframe>

              <!-- VIDEO -->
              <video
                v-else-if="getResourceKind(material) === 'video' && material.url"
                :src="material.url"
                class="resource-card__media resource-card__media--video"
                muted
                playsinline
                preload="metadata"
              ></video>

              <!-- AUDIO -->
              <div
                v-else-if="getResourceKind(material) === 'audio'"
                class="resource-audio-preview"
              >
                <div class="resource-audio-preview__disc">
                  ♪
                </div>
                <div class="resource-audio-preview__bars" aria-hidden="true">
                  <i
                    v-for="bar in 24"
                    :key="bar"
                    :style="{ '--bar-h': `${18 + ((bar * 17) % 48)}%` }"
                  ></i>
                </div>
                <span>Escucha el material</span>
              </div>

              <!-- ENLACE -->
              <div
                v-else-if="getResourceKind(material) === 'link'"
                class="resource-link-preview"
              >
                <div class="resource-link-preview__browser">
                  <span></span><span></span><span></span>
                </div>
                <strong>{{ getResourceDomain(material) }}</strong>
                <small>Recurso externo</small>
              </div>

              <!-- OTRO -->
              <div v-else class="resource-file-preview">
                <div class="resource-file-preview__sheet">
                  <span>{{ getResourceIcon(material) }}</span>
                  <i></i><i></i><i></i>
                </div>
                <span>Vista previa del archivo</span>
              </div>

              <div class="resource-card__open">
                <span>↗</span>
                Abrir recurso
              </div>

              <div class="resource-card__category">
                <span>{{ getResourceIcon(material) }}</span>
                {{ getResourceLabel(material) }}
              </div>

              <div v-if="isPersonalResource(material)" class="resource-card__personal">
                ★ Para tu voz
              </div>
            </div>

            <div class="resource-card__body">
              <div class="resource-card__context">
                <span class="resource-card__lesson">
                  {{ getLessonTitleForMaterial(material) }}
                </span>
                <span v-if="getLessonDateForMaterial(material)">
                  {{ getLessonDateForMaterial(material) }}
                </span>
              </div>

              <h3>{{ material.title }}</h3>

              <p>
                {{ material.description || 'Material disponible en la biblioteca académica.' }}
              </p>

              <div class="resource-card__meta">
                <span v-if="material.fileName" class="resource-card__filename">
                  {{ material.fileName }}
                </span>
                <span v-if="material.fileSize">
                  {{ formatBytes(material.fileSize) }}
                </span>
                <span v-if="getMaterialVoice(material) !== 'general'">
                  {{ getVoiceLabel(getMaterialVoice(material)) }}
                </span>
              </div>
            </div>

            <div
              v-if="isTeacher"
              class="resource-card__admin"
              @click.stop
            >
              <button type="button" @click="openEditMaterial(material)">
                ✎ Editar
              </button>
              <button type="button" @click="askDeleteMaterial(material)">
                × Eliminar
              </button>
            </div>
          </article>
        </TransitionGroup>

        <div v-else class="resources-empty">
          <div class="resources-empty__icon">⌕</div>
          <span>Sin coincidencias</span>
          <h3>No encontramos recursos con estos filtros.</h3>
          <p>Prueba otra búsqueda o vuelve a mostrar toda la biblioteca.</p>
          <button
            type="button"
            @click="search = ''; selectedType = 'all'; audienceFilter = 'all'"
          >
            Ver todos los recursos
          </button>
        </div>
      </section>
    </template>

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

              <section class="resource-file-editor">
                <div
                  v-if="
                    editingMaterial.fileName
                  "
                  class="current-file"
                >
                  <div class="current-file__icon">
                    ARCH
                  </div>

                  <div>
                    <span>
                      Archivo actual
                    </span>

                    <strong>
                      {{
                        editingMaterial.fileName
                      }}
                    </strong>

                    <small>
                      {{
                        formatBytes(
                          editingMaterial.fileSize
                        )
                      }}
                    </small>
                  </div>
                </div>

                <div class="replacement-file">
                  <div class="replacement-file__heading">
                    <div>
                      <span>
                        REEMPLAZAR ARCHIVO
                      </span>

                      <strong>
                        Sube una nueva versión
                      </strong>
                    </div>

                    <small>
                      Opcional · máximo 100 MB
                    </small>
                  </div>

                  <input
                    ref="replacementFileInput"
                    id="edit-replacement-file"
                    class="replacement-file__input"
                    type="file"
                    :accept="formatReplacementAccept"
                    @change="handleReplacementFile"
                  >

                  <label
                    for="edit-replacement-file"
                    class="replacement-file__drop"
                    :class="{
                      'replacement-file__drop--selected':
                        replacementFile
                    }"
                  >
                    <span class="replacement-file__drop-icon">
                      ↑
                    </span>

                    <template v-if="!replacementFile">
                      <strong>
                        Seleccionar nuevo archivo
                      </strong>

                      <small>
                        PNG, PDF, audio, video u otro
                        formato según el tipo de recurso.
                      </small>
                    </template>

                    <template v-else>
                      <strong>
                        {{ replacementFile.name }}
                      </strong>

                      <small>
                        {{
                          formatBytes(
                            replacementFile.size
                          )
                        }}
                        · listo para reemplazar
                      </small>
                    </template>
                  </label>

                  <button
                    v-if="replacementFile"
                    type="button"
                    class="replacement-file__clear"
                    @click="clearReplacementFile"
                  >
                    Quitar archivo seleccionado
                  </button>

                  <p
                    v-if="replacementFileError"
                    class="replacement-file__error"
                  >
                    {{ replacementFileError }}
                  </p>

                  <p class="replacement-file__note">
                    El archivo nuevo reemplazará al actual
                    cuando presiones “Guardar cambios”.
                    El archivo anterior se eliminará de
                    Supabase Storage después de actualizar
                    correctamente el recurso.
                  </p>
                </div>
              </section>

              <footer class="admin-modal__actions">
                <button
                  type="button"
                  class="button-secondary"
                  :disabled="isSavingEdit"
                  @click="closeEditMaterial"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  class="button-primary"
                  :disabled="isSavingEdit"
                >
                  {{
                    isSavingEdit
                      ? 'Guardando...'
                      : replacementFile
                        ? 'Guardar y reemplazar'
                        : 'Guardar cambios'
                  }}
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
  removeMaterial,
  uploadMaterialFile,
  removeMaterialFile
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
   NAVEGACIÓN CONTEXTUAL · BIBLIOTECA V10
========================================================= */
const activeResourcesTab = ref('resumen')

const isResourcesTab = tab =>
  activeResourcesTab.value === tab

const setResourcesTab = tab => {
  activeResourcesTab.value = tab

  const typeByTab = {
    biblioteca: 'all',
    partituras: 'score',
    audio: 'audio',
    video: 'video'
  }

  if (typeByTab[tab]) {
    selectedType.value = typeByTab[tab]
  }
}

const totalScores = computed(() =>
  materials.value.filter(material =>
    ['score', 'pdf'].includes(material.type)
  ).length
)

const totalAudio = computed(() =>
  materials.value.filter(material =>
    material.type === 'audio'
  ).length
)

const totalVideo = computed(() =>
  materials.value.filter(material =>
    material.type === 'video'
  ).length
)


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

const replacementFile = ref(null)
const replacementFileInput = ref(null)
const replacementFileError = ref('')

const MAX_RESOURCE_FILE_SIZE =
  100 * 1024 * 1024

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
  const text = search.value.trim().toLowerCase()

  return materials.value.filter(material => {
    const title = String(material.title || '').toLowerCase()
    const description = String(material.description || '').toLowerCase()
    const fileName = String(material.fileName || '').toLowerCase()

    const matchesSearch =
      !text ||
      title.includes(text) ||
      description.includes(text) ||
      fileName.includes(text)

    const matchesType = (() => {
      switch (selectedType.value) {
        case 'documents':
          return ['pdf', 'other'].includes(material.type)
        case 'scores':
          return ['score', 'pdf'].includes(material.type)
        case 'links':
          return material.type === 'link'
        case 'all':
          return true
        default:
          return material.type === selectedType.value
      }
    })()

    let matchesVoice = true

    if (isTeacher.value && selectedVoice.value !== 'all') {
      matchesVoice =
        getMaterialVoice(material) === selectedVoice.value
    }

    let matchesAudience = true

    if (isStudent.value && audienceFilter.value === 'mine') {
      matchesAudience = isForCurrentStudent(material)
    }

    return (
      matchesSearch &&
      matchesType &&
      matchesVoice &&
      matchesAudience
    )
  })
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
   BIBLIOTECA INTELIGENTE · PRESENTACIÓN
========================================================= */

const resourceFilterOptions = computed(() => [
  {
    value: 'all',
    label: 'Todos',
    count: materials.value.length,
  },
  {
    value: 'documents',
    label: 'Documentos',
    count: materials.value.filter(material =>
      ['pdf', 'other'].includes(material.type)
    ).length,
  },
  {
    value: 'scores',
    label: 'Partituras',
    count: materials.value.filter(material =>
      ['score', 'pdf'].includes(material.type)
    ).length,
  },
  {
    value: 'audio',
    label: 'Audio',
    count: materials.value.filter(material =>
      material.type === 'audio'
    ).length,
  },
  {
    value: 'video',
    label: 'Video',
    count: materials.value.filter(material =>
      material.type === 'video'
    ).length,
  },
  {
    value: 'links',
    label: 'Enlaces',
    count: materials.value.filter(material =>
      material.type === 'link'
    ).length,
  },
])

const sortMode = ref('smart')

const getResourceKind = material => {
  if (!material) return 'other'

  const mime = String(material.mimeType || '').toLowerCase()
  const fileName = String(
    material.fileName || material.url || ''
  ).toLowerCase()

  if (material.type === 'score') {
    return 'score'
  }

  if (
    material.type === 'pdf' ||
    mime.includes('pdf') ||
    /\.pdf(?:$|[?#])/i.test(fileName)
  ) {
    return 'document'
  }

  if (
    material.type === 'audio' ||
    mime.startsWith('audio/') ||
    /\.(mp3|wav|m4a|aac|ogg|flac)(?:$|[?#])/i.test(fileName)
  ) {
    return 'audio'
  }

  if (
    material.type === 'video' ||
    mime.startsWith('video/') ||
    /\.(mp4|webm|mov|m4v)(?:$|[?#])/i.test(fileName)
  ) {
    return 'video'
  }

  if (
    mime.startsWith('image/') ||
    /\.(jpg|jpeg|png|webp|gif|svg)(?:$|[?#])/i.test(fileName)
  ) {
    return 'image'
  }

  if (material.type === 'link') {
    return 'link'
  }

  return 'other'
}

const getResourceLabel = material => {
  const kind = getResourceKind(material)
  const labels = {
    score: 'Partitura',
    document: 'Documento',
    audio: 'Audio',
    video: 'Video',
    image: 'Imagen',
    link: 'Enlace',
    other: 'Archivo',
  }
  return labels[kind] || 'Recurso'
}

const getResourceIcon = material => {
  const kind = getResourceKind(material)
  const icons = {
    score: '♫',
    document: 'DOC',
    audio: '♪',
    video: '▶',
    image: 'IMG',
    link: '↗',
    other: 'FILE',
  }
  return icons[kind] || '•'
}

const getResourceColor = material => {
  const kind = getResourceKind(material)
  const colors = {
    score: '#d7a51c',
    document: '#b33d68',
    audio: '#7657d9',
    video: '#3777d6',
    image: '#2c9d77',
    link: '#328c9a',
    other: '#7f879c',
  }
  return colors[kind] || colors.other
}

const getResourceGlow = material => {
  const kind = getResourceKind(material)
  const glows = {
    score: '215, 165, 28',
    document: '179, 61, 104',
    audio: '118, 87, 217',
    video: '55, 119, 214',
    image: '44, 157, 119',
    link: '50, 140, 154',
    other: '127, 135, 156',
  }
  return glows[kind] || glows.other
}

const getLessonForMaterial = material => {
  if (!material?.lessonId) return null
  return lessons.value.find(
    lesson => Number(lesson.id) === Number(material.lessonId)
  ) || null
}

const getLessonTitleForMaterial = material =>
  getLessonForMaterial(material)?.title ||
  (material?.lessonId ? `Clase ${material.lessonId}` : 'Biblioteca general')

const getLessonDateForMaterial = material =>
  getLessonForMaterial(material)?.date || ''

const getResourceDomain = material => {
  try {
    const url = new URL(material?.url || '')
    return url.hostname.replace(/^www\./, '')
  } catch {
    return 'Recurso externo'
  }
}

const isPersonalResource = material =>
  isStudent.value &&
  getMaterialVoice(material) !== 'general' &&
  isForCurrentStudent(material)

const smartMaterials = computed(() => {
  const list = [...filteredMaterials.value]

  const priority = material => {
    let score = 0

    if (isPersonalResource(material)) score += 1000
    if (material.lessonId) score += 100
    if (material.type === 'score') score += 20
    if (material.type === 'audio') score += 10
    return score
  }

  if (sortMode.value === 'alpha') {
    return list.sort((a, b) =>
      String(a.title || '').localeCompare(
        String(b.title || ''),
        'es',
        { sensitivity: 'base' },
      )
    )
  }

  if (sortMode.value === 'recent') {
    return list.sort(
      (a, b) => Number(b.id || 0) - Number(a.id || 0),
    )
  }

  return list.sort((a, b) => {
    const diff = priority(b) - priority(a)
    if (diff !== 0) return diff
    return Number(b.id || 0) - Number(a.id || 0)
  })
})

const setResourceFilter = value => {
  selectedType.value = value
}

const handleResourceCardKey = (event, material) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    openMaterial(material)
  }
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

  replacementFile.value = null
  replacementFileError.value = ''

  if (replacementFileInput.value) {
    replacementFileInput.value.value = ''
  }

  document.body.style.overflow =
    'hidden'
}

const closeEditMaterial = () => {
  if (isSavingEdit.value) {
    return
  }

  editingMaterial.value = null
  replacementFile.value = null
  replacementFileError.value = ''

  if (replacementFileInput.value) {
    replacementFileInput.value.value = ''
  }

  document.body.style.overflow =
    ''
}


const formatReplacementAccept = computed(() => {
  const type = editForm.type

  const accepts = {
    pdf:
      '.pdf,application/pdf',

    score:
      '.pdf,application/pdf,image/png,image/jpeg,.png,.jpg,.jpeg',

    audio:
      'audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac',

    video:
      'video/*,.mp4,.webm,.mov,.m4v',

    other:
      '*/*'
  }

  return accepts[type] || '*/*'
})

const handleReplacementFile = event => {
  const file =
    event.target.files?.[0]

  replacementFileError.value = ''

  if (!file) {
    replacementFile.value = null
    return
  }

  if (
    file.size >
    MAX_RESOURCE_FILE_SIZE
  ) {
    replacementFileError.value =
      'El archivo supera el máximo permitido de 100 MB.'

    event.target.value = ''
    replacementFile.value = null
    return
  }

  replacementFile.value = file
}

const clearReplacementFile = () => {
  replacementFile.value = null
  replacementFileError.value = ''

  if (replacementFileInput.value) {
    replacementFileInput.value.value = ''
  }
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
  replacementFileError.value = ''

  const originalMaterial =
    editingMaterial.value

  let uploadedReplacement = null

  try {
    /*
     * Si el profesor seleccionó un archivo nuevo,
     * primero lo subimos a Storage.
     */
    if (replacementFile.value) {
      uploadedReplacement =
        await uploadMaterialFile({
          file:
            replacementFile.value,

          lessonId:
            Number(
              editForm.lessonId
            ),

          folder:
            String(
              editForm.voice ||
              'general'
            )
              .toLowerCase()
              .replace(/\s+/g, '-')
        })
    }

    /*
     * Actualizamos el registro.
     * Si no hay archivo nuevo, updateMaterial
     * conserva los datos del archivo existente.
     */
    const payload = {
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

    if (uploadedReplacement) {
      payload.url =
        uploadedReplacement.url

      payload.storagePath =
        uploadedReplacement.storagePath

      payload.fileName =
        uploadedReplacement.fileName

      payload.fileSize =
        uploadedReplacement.fileSize

      payload.mimeType =
        uploadedReplacement.mimeType
    }

    const updated =
      await updateMaterial(
        originalMaterial.id,
        payload
      )

    /*
     * El registro ya apunta al nuevo archivo.
     * Ahora eliminamos el archivo anterior.
     */
    if (
      uploadedReplacement &&
      originalMaterial.storagePath &&
      originalMaterial.storagePath !==
        uploadedReplacement.storagePath
    ) {
      try {
        await removeMaterialFile(
          originalMaterial.storagePath
        )
      } catch (cleanupError) {
        console.error(
          'El recurso se actualizó, pero no se pudo eliminar el archivo anterior:',
          cleanupError
        )
      }
    }

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
    replacementFile.value = null
    replacementFileError.value = ''

    if (replacementFileInput.value) {
      replacementFileInput.value.value = ''
    }

    document.body.style.overflow = ''

    showToast(
      uploadedReplacement
        ? 'Recurso y archivo actualizados correctamente.'
        : 'Recurso actualizado en Supabase.'
    )
  } catch (error) {
    console.error(
      'Error actualizando recurso:',
      error
    )

    /*
     * Si subimos un archivo nuevo pero falló
     * la actualización de Database, lo limpiamos.
     */
    if (
      uploadedReplacement?.storagePath
    ) {
      try {
        await removeMaterialFile(
          uploadedReplacement.storagePath
        )
      } catch (cleanupError) {
        console.error(
          'No se pudo limpiar el archivo nuevo después del error:',
          cleanupError
        )
      }
    }

    replacementFileError.value =
      error?.message ||
      'No se pudo actualizar el recurso.'

    showToast(
      replacementFileError.value,
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


/* =========================================================
   V5.9 · VISOR DE RECURSOS · LIGHT LMS
   Mantiene intacta la lógica del visor y del PDF.
========================================================= */

.resource-modal {
  padding: 24px;
  background: rgba(19, 31, 48, 0.48);
  backdrop-filter: blur(12px);
}

.resource-modal__window {
  width: min(1280px, 96vw);
  height: min(860px, 94vh);
  border: 1px solid #dbe3ec;
  border-radius: 22px;
  background: #ffffff;
  box-shadow: 0 28px 80px rgba(20, 34, 53, 0.24);
}

/* HEADER DEL RECURSO */
.resource-modal__header {
  gap: 24px;
  padding: 20px 24px;
  border-bottom: 1px solid #e4eaf1;
  background:
    radial-gradient(circle at 88% 0%, rgba(217, 169, 29, 0.11), transparent 30%),
    linear-gradient(135deg, #ffffff 0%, #fbfcfe 70%, #fffaf0 100%);
}

.resource-modal__title-area {
  min-width: 0;
  gap: 16px;
}

.resource-modal__icon {
  width: 48px;
  height: 48px;
  border: 1px solid #e2bd50;
  border-radius: 14px;
  color: #9b7200;
  background: #fff8e7;
  font-size: 0.85rem;
  font-weight: 900;
}

.resource-modal__badges {
  gap: 7px;
  flex-wrap: wrap;
}

.resource-modal__badges span {
  padding: 5px 9px;
  border: 1px solid #e5d8aa;
  border-radius: 999px;
  color: #8a6500;
  background: #fffaf0;
  font-size: 0.62rem;
  font-weight: 850;
}

.resource-modal__title-area h2 {
  max-width: 760px;
  margin: 8px 0 4px;
  color: #152033;
  font-family: inherit;
  font-size: clamp(1.25rem, 2.1vw, 1.75rem);
  font-weight: 850;
  line-height: 1.18;
  letter-spacing: -0.025em;
}

.resource-modal__title-area p {
  max-width: 760px;
  margin: 0;
  color: #748195;
  font-size: 0.78rem;
  line-height: 1.5;
  opacity: 1;
}

/* ACCIONES */
.resource-modal__actions {
  flex: 0 0 auto;
  gap: 8px;
}

.modal-action {
  min-height: 40px;
  padding: 9px 13px;
  border: 1px solid #cfd8e3;
  border-radius: 10px;
  color: #435268;
  background: #ffffff;
  font: inherit;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    background 0.2s ease,
    transform 0.2s ease;
}

.modal-action:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: #b9c7d7;
  background: #f6f8fb;
}

.resource-modal .modal-close {
  width: 40px;
  height: 40px;
  border: 1px solid #d3dce6;
  border-radius: 11px;
  color: #66768a;
  background: #ffffff;
  font-size: 1.35rem;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.resource-modal .modal-close:hover {
  color: #9f1945;
  border-color: #e1bcc8;
  background: #fff6f8;
}

/* VISOR: el documento mantiene un entorno neutro para no alterar su color */
.resource-modal__viewer {
  background: #e9edf2;
}

.resource-viewer--pdf {
  background: #ffffff;
}

.resource-viewer--video {
  background: #182232;
}

.image-viewer {
  background: #eef2f6;
}

.audio-viewer {
  border: 1px solid #dbe3ec;
  border-radius: 18px;
  color: #152033;
  background: #ffffff;
  box-shadow: 0 12px 32px rgba(31, 48, 73, 0.08);
}

.audio-viewer h3 {
  color: #152033;
}

.audio-viewer p {
  color: #6f7c8f;
}

.audio-viewer__art {
  border: 1px solid #e2bd50;
  color: #9b7200;
  background: #fff8e7;
}

.unsupported-viewer {
  color: #607086;
}

.unsupported-viewer h3 {
  color: #152033;
}

.unsupported-viewer__icon {
  border: 1px solid #e2bd50;
  color: #9b7200;
  background: #fff8e7;
}

.unsupported-viewer button {
  border: 1px solid #9f1945;
  border-radius: 10px;
  color: #ffffff;
  background: #9f1945;
  font-weight: 800;
}

/* PIE DEL RECURSO */
.resource-modal__footer {
  gap: 34px;
  padding: 13px 24px;
  border-top: 1px solid #e4eaf1;
  color: #152033;
  background: #ffffff;
}

.resource-modal__footer div {
  gap: 2px;
}

.resource-modal__footer span {
  color: #8a97a9;
  font-size: 0.62rem;
  font-weight: 700;
  opacity: 1;
}

.resource-modal__footer strong {
  color: #344359;
  font-size: 0.75rem;
}

/* RESPONSIVE DEL VISOR */
@media (max-width: 760px) {
  .resource-modal {
    padding: 10px;
  }

  .resource-modal__window {
    width: 100%;
    height: 96vh;
    border-radius: 16px;
  }

  .resource-modal__header {
    align-items: flex-start;
    flex-direction: column;
    padding: 16px;
  }

  .resource-modal__actions {
    width: 100%;
  }

  .modal-action {
    flex: 1;
  }

  .resource-modal__icon {
    width: 42px;
    height: 42px;
  }

  .resource-modal__footer {
    gap: 16px;
    padding: 12px 16px;
  }
}



/* =========================================================
   V6.0 · GESTIÓN DE RECURSOS · PROFESOR
   Acciones visibles, claras y coherentes con el LMS light
========================================================= */

.resources-page .material-admin {
  display: flex !important;
  gap: 12px !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-top: 18px !important;
  padding: 12px !important;
  border: 1px solid #dbe3ec !important;
  border-radius: 12px !important;
  background: #f8fafc !important;
}

.resources-page .material-admin__label {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 2px;
}

.resources-page .material-admin__label span {
  color: #987000 !important;
  font-size: .58rem !important;
  font-weight: 900 !important;
  letter-spacing: .08em !important;
}

.resources-page .material-admin__label small {
  color: #7b8797 !important;
  font-size: .58rem !important;
}

.resources-page .material-admin__actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.resources-page .material-admin button {
  display: inline-flex !important;
  min-height: 38px !important;
  gap: 7px !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 11px !important;
  border-radius: 9px !important;
  font-size: .66rem !important;
  font-weight: 900 !important;
  line-height: 1 !important;
  cursor: pointer !important;
  transition:
    border-color .18s ease,
    background .18s ease,
    color .18s ease,
    transform .18s ease !important;
}

.resources-page .material-admin__edit {
  border: 1px solid #cbd6e2 !important;
  background: #ffffff !important;
  color: #344359 !important;
}

.resources-page .material-admin__edit:hover {
  border-color: #9f1945 !important;
  background: #fffafb !important;
  color: #9f1945 !important;
  transform: translateY(-1px);
}

.resources-page .material-admin__delete {
  border: 1px solid #e6b6bd !important;
  background: #fff5f6 !important;
  color: #b93849 !important;
}

.resources-page .material-admin__delete:hover {
  border-color: #be4856 !important;
  background: #fff0f2 !important;
  color: #a72c3c !important;
  transform: translateY(-1px);
}

.resources-page .material-admin button:focus-visible {
  outline: 3px solid rgba(159, 25, 69, .14) !important;
  outline-offset: 2px !important;
}

/* Modal admin: asegurar contraste light también al usar Teleport */
.admin-modal .admin-modal__window,
.admin-modal .delete-dialog {
  background: #ffffff !important;
  color: #152033 !important;
}

.admin-modal .admin-modal__header h2,
.admin-modal .delete-dialog h2,
.admin-modal .delete-dialog__title {
  color: #152033 !important;
}

.admin-modal .admin-modal__header p,
.admin-modal .current-file small,
.admin-modal .delete-dialog p {
  color: #6f7c8f !important;
  opacity: 1 !important;
}

.admin-modal .edit-field label,
.admin-modal .admin-modal__form label {
  color: #344359 !important;
}

.admin-modal input,
.admin-modal textarea,
.admin-modal select {
  border-color: #dbe3ec !important;
  background: #ffffff !important;
  color: #152033 !important;
}

.admin-modal input:focus,
.admin-modal textarea:focus,
.admin-modal select:focus {
  border-color: #9f1945 !important;
  box-shadow: 0 0 0 3px rgba(159, 25, 69, .1) !important;
}

.admin-modal .current-file {
  border-color: #dbe3ec !important;
  background: #f8fafc !important;
}

.admin-modal .current-file span {
  color: #987000 !important;
}

.admin-modal .current-file strong {
  color: #152033 !important;
}

.admin-modal .button-primary {
  border-color: #9f1945 !important;
  background: #9f1945 !important;
  color: #ffffff !important;
}

.admin-modal .button-primary:hover {
  border-color: #7f1237 !important;
  background: #7f1237 !important;
}

.admin-modal .button-secondary {
  border-color: #cbd6e2 !important;
  background: #ffffff !important;
  color: #344359 !important;
}

.admin-modal .button-danger {
  border-color: #be4856 !important;
  background: #be4856 !important;
  color: #ffffff !important;
}

.admin-modal .delete-dialog__warning {
  border-color: #ead6a0 !important;
  background: #fff9eb !important;
  color: #715a12 !important;
}

@media (max-width: 640px) {
  .resources-page .material-admin {
    align-items: stretch !important;
    flex-direction: column !important;
  }

  .resources-page .material-admin__actions {
    width: 100%;
  }

  .resources-page .material-admin__actions button {
    flex: 1 1 0;
  }
}



/* =========================================================
   V6.1 · MODAL EDITAR RECURSO · PREMIUM LIGHT
   Teleport no hereda variables del contenedor principal.
========================================================= */

.admin-modal {
  background: rgba(12, 20, 34, .54) !important;
  backdrop-filter: blur(7px) !important;
}

.admin-modal .admin-modal__window {
  overflow: hidden !important;
  border: 1px solid #dbe3ec !important;
  border-radius: 20px !important;
  background: #ffffff !important;
  color: #152033 !important;
  box-shadow:
    0 26px 80px rgba(17, 28, 45, .22) !important;
}

.admin-modal .admin-modal__header {
  padding: 26px 30px 22px !important;
  border-bottom: 1px solid #e6ebf1 !important;
  background:
    radial-gradient(
      circle at 92% 8%,
      rgba(217, 169, 29, .10),
      transparent 30%
    ),
    #ffffff !important;
}

.admin-modal .admin-modal__header span {
  color: #987000 !important;
}

.admin-modal .admin-modal__header h2 {
  color: #152033 !important;
}

.admin-modal .admin-modal__header p {
  color: #667085 !important;
}

.admin-modal .admin-modal__close {
  border: 1px solid #dbe3ec !important;
  background: #ffffff !important;
  color: #344359 !important;
}

.admin-modal .admin-modal__close:hover {
  border-color: #9f1945 !important;
  background: #fffafb !important;
  color: #9f1945 !important;
}

.admin-modal .edit-form {
  background: #ffffff !important;
}

.admin-modal .form-field label {
  color: #344359 !important;
}

.admin-modal .form-field input,
.admin-modal .form-field textarea,
.admin-modal .form-field select {
  border: 1px solid #dbe3ec !important;
  background: #ffffff !important;
  color: #152033 !important;
}

.admin-modal .form-field input:focus,
.admin-modal .form-field textarea:focus,
.admin-modal .form-field select:focus {
  border-color: #9f1945 !important;
  box-shadow: 0 0 0 3px rgba(159, 25, 69, .10) !important;
}

.admin-modal .voice-selector button {
  border-color: #dbe3ec !important;
  background: #f8fafc !important;
  color: #344359 !important;
  opacity: 1 !important;
}

.admin-modal .voice-selector button span {
  border-color: #cbd6e2 !important;
  background: #ffffff !important;
  color: #667085 !important;
}

.admin-modal .voice-selector button.active {
  border-color: #d9a91d !important;
  background: #fff8e7 !important;
  color: #987000 !important;
}

.admin-modal .voice-selector button.active span {
  border-color: #d9a91d !important;
  color: #987000 !important;
}

/* =========================================================
   ARCHIVO ACTUAL + REEMPLAZO
========================================================= */

.admin-modal .resource-file-editor {
  display: grid;
  gap: 12px;
  margin-top: 4px;
}

.admin-modal .current-file {
  display: flex !important;
  gap: 14px !important;
  align-items: center !important;
  padding: 15px 16px !important;
  border: 1px solid #dbe3ec !important;
  border-radius: 13px !important;
  background: #f8fafc !important;
}

.admin-modal .current-file__icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border: 1px solid #e4c35a;
  border-radius: 11px;
  background: #fff8e7;
  color: #987000;
  font-size: .54rem;
  font-weight: 900;
}

.admin-modal .current-file > div:last-child {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
}

.admin-modal .current-file span {
  color: #987000 !important;
  font-size: .60rem !important;
  font-weight: 900 !important;
}

.admin-modal .current-file strong {
  overflow: hidden;
  color: #152033 !important;
  font-size: .88rem !important;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.admin-modal .current-file small {
  color: #667085 !important;
}

.admin-modal .replacement-file {
  padding: 16px;
  border: 1px solid #dbe3ec;
  border-radius: 14px;
  background: #ffffff;
}

.admin-modal .replacement-file__heading {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.admin-modal .replacement-file__heading > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.admin-modal .replacement-file__heading span {
  color: #987000;
  font-size: .58rem;
  font-weight: 900;
  letter-spacing: .08em;
}

.admin-modal .replacement-file__heading strong {
  color: #152033;
  font-size: .86rem;
}

.admin-modal .replacement-file__heading small {
  color: #7b8797;
  font-size: .60rem;
  white-space: nowrap;
}

.admin-modal .replacement-file__input {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  clip: rect(0 0 0 0) !important;
  clip-path: inset(50%) !important;
  white-space: nowrap !important;
}

.admin-modal .replacement-file__drop {
  display: flex;
  min-height: 118px;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding: 18px;
  border: 1px dashed #bdc9d6;
  border-radius: 12px;
  background: #f8fafc;
  text-align: center;
  cursor: pointer;
  flex-direction: column;
  transition:
    border-color .18s ease,
    background .18s ease;
}

.admin-modal .replacement-file__drop:hover,
.admin-modal .replacement-file__drop--selected {
  border-color: #9f1945;
  background: #fffafb;
}

.admin-modal .replacement-file__drop-icon {
  display: grid;
  width: 38px;
  height: 38px;
  margin-bottom: 3px;
  place-items: center;
  border: 1px solid #e4c35a;
  border-radius: 50%;
  background: #fff8e7;
  color: #987000;
  font-size: 1rem;
  font-weight: 900;
}

.admin-modal .replacement-file__drop strong {
  color: #152033;
  font-size: .78rem;
}

.admin-modal .replacement-file__drop small {
  color: #667085;
  font-size: .66rem;
  line-height: 1.45;
}

.admin-modal .replacement-file__clear {
  margin-top: 9px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #be4856;
  font: inherit;
  font-size: .64rem;
  font-weight: 800;
  cursor: pointer;
}

.admin-modal .replacement-file__error {
  margin-top: 9px;
  padding: 9px 11px;
  border: 1px solid #e4b8be;
  border-radius: 9px;
  background: #fff3f5;
  color: #a72c3c;
  font-size: .66rem;
  font-weight: 700;
}

.admin-modal .replacement-file__note {
  margin: 10px 0 0 !important;
  color: #667085 !important;
  font-size: .64rem !important;
  line-height: 1.55 !important;
}

.admin-modal .admin-modal__actions {
  border-top: 1px solid #e6ebf1 !important;
  background: #ffffff !important;
}

.admin-modal .button-secondary {
  border: 1px solid #cbd6e2 !important;
  background: #ffffff !important;
  color: #344359 !important;
}

.admin-modal .button-primary {
  border: 1px solid #9f1945 !important;
  background: #9f1945 !important;
  color: #ffffff !important;
  box-shadow: 0 7px 16px rgba(159, 25, 69, .14) !important;
}

.admin-modal .button-primary:hover:not(:disabled) {
  border-color: #7f1237 !important;
  background: #7f1237 !important;
}

.admin-modal .button-primary:disabled,
.admin-modal .button-secondary:disabled {
  cursor: wait !important;
  opacity: .62 !important;
}

@media (max-width: 640px) {
  .admin-modal .admin-modal__header {
    padding: 20px !important;
  }

  .admin-modal .replacement-file__heading {
    flex-direction: column;
  }

  .admin-modal .replacement-file__heading small {
    white-space: normal;
  }
}



/* =========================================================
   V6.2 · MODAL EDITAR RECURSO · SCROLL CORRECTO
   Header fijo + cuerpo desplazable + acciones visibles
========================================================= */

.admin-modal {
  overflow: hidden !important;
  padding: 18px !important;
}

.admin-modal .admin-modal__window {
  display: flex !important;
  width: min(900px, 96vw) !important;
  max-height: calc(100dvh - 36px) !important;
  overflow: hidden !important;
  flex-direction: column !important;
}

/* La cabecera queda siempre visible */
.admin-modal .admin-modal__header {
  position: relative !important;
  z-index: 3 !important;
  flex: 0 0 auto !important;
}

/* El formulario es ahora la zona con scroll */
.admin-modal .edit-form {
  min-height: 0 !important;
  overflow-y: auto !important;
  overscroll-behavior: contain !important;
  scrollbar-gutter: stable !important;
}

/* Scroll elegante y visible */
.admin-modal .edit-form::-webkit-scrollbar {
  width: 10px;
}

.admin-modal .edit-form::-webkit-scrollbar-track {
  background: #f1f4f8;
}

.admin-modal .edit-form::-webkit-scrollbar-thumb {
  border: 2px solid #f1f4f8;
  border-radius: 999px;
  background: #b8c3d1;
}

.admin-modal .edit-form::-webkit-scrollbar-thumb:hover {
  background: #95a3b5;
}

.admin-modal .edit-form {
  scrollbar-width: thin;
  scrollbar-color: #b8c3d1 #f1f4f8;
}

/* Footer pegado al borde inferior mientras se desplaza */
.admin-modal .admin-modal__actions {
  position: sticky !important;
  z-index: 4 !important;
  bottom: 0 !important;
  margin:
    18px
    -30px
    -30px !important;
  padding:
    18px
    30px !important;
  border-top: 1px solid #e6ebf1 !important;
  background:
    rgba(255, 255, 255, .97) !important;
  box-shadow:
    0 -10px 24px
    rgba(31, 48, 73, .05) !important;
  backdrop-filter: blur(8px) !important;
}

/* Espacio para que el último contenido no quede bajo el footer */
.admin-modal .resource-file-editor {
  padding-bottom: 6px !important;
}

/* Alturas pequeñas / notebook */
@media (max-height: 760px) {
  .admin-modal {
    padding: 10px !important;
  }

  .admin-modal .admin-modal__window {
    max-height: calc(100dvh - 20px) !important;
  }

  .admin-modal .admin-modal__header {
    padding:
      18px
      24px !important;
  }

  .admin-modal .admin-modal__header h2 {
    margin:
      5px
      0 !important;
    font-size: 1.65rem !important;
  }

  .admin-modal .admin-modal__header p {
    margin: 0 !important;
    font-size: .8rem !important;
  }
}

/* Móvil */
@media (max-width: 640px) {
  .admin-modal {
    padding: 0 !important;
    place-items: stretch !important;
  }

  .admin-modal .admin-modal__window {
    width: 100% !important;
    height: 100dvh !important;
    max-height: 100dvh !important;
    border: 0 !important;
    border-radius: 0 !important;
  }

  .admin-modal .admin-modal__actions {
    margin:
      16px
      -20px
      -20px !important;
    padding:
      14px
      20px
      calc(14px + env(safe-area-inset-bottom)) !important;
  }
}



/* =========================================================
   V6.3 · TARJETA "MI SECCIÓN" · ALUMNO · PREMIUM LIGHT
   Corrige bloque negro heredado del tema global
========================================================= */

.resources .student-voice-card {
  min-width: 220px !important;
  padding: 22px 24px !important;
  border: 1px solid #dfd4ae !important;
  border-radius: 18px !important;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(217, 169, 29, .10),
      transparent 36%
    ),
    #ffffff !important;
  color: #152033 !important;
  box-shadow:
    0 10px 28px
    rgba(31, 48, 73, .05) !important;
}

.resources .student-voice-card span {
  display: block !important;
  margin-bottom: 8px !important;
  color: #6f7c8f !important;
  font-size: .68rem !important;
  font-weight: 800 !important;
  letter-spacing: .02em !important;
  opacity: 1 !important;
}

.resources .student-voice-card strong {
  display: block !important;
  color: #987000 !important;
  font-size: 1.45rem !important;
  font-weight: 900 !important;
  line-height: 1.15 !important;
}

.resources .student-voice-card small {
  display: block !important;
  margin-top: 10px !important;
  color: #667085 !important;
  font-size: .72rem !important;
  line-height: 1.45 !important;
  opacity: 1 !important;
}

/* Mantener coherencia con el header del alumno */
.resources .resources__header {
  align-items: center !important;
}

@media (max-width: 820px) {
  .resources .student-voice-card {
    width: 100% !important;
    min-width: 0 !important;
  }
}



/* =========================================================
   AMV LMS UI SYSTEM · ACADEMIC EXPERIENCE v1.0
   Sistema visual común para el SaaS
========================================================= */
.resources {
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

.resources :where(a, button, input, textarea, select, [role="button"]) {
  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
}

.resources :where(a, button, input, textarea, select, [role="button"]):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.resources :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.resources :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

.resources :where(table tbody tr) {
  transition: background-color .18s ease;
}

.resources :where(table tbody tr):hover {
  background-color: rgba(159, 25, 69, .025);
}

.resources :where(.card, [class*="-card"], [class*="__card"]) {
  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;
}

.resources :where(.card, [class*="-card"], [class*="__card"]):hover {
  border-color: rgba(159, 25, 69, .16);
}

@media (prefers-reduced-motion: reduce) {
  .resources *, .resources *::before, .resources *::after {
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
.resources {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.resources :where(
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
  .resources :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .resources :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .resources :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .resources :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.resources :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.resources :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.resources :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.resources ::selection {
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
  .resources,
  .resources *,
  .resources *::before,
  .resources *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}


/* =========================================================
   RESOURCES · ADVANCED LIBRARY V10
========================================================= */
.resources-context-nav {
  position: sticky;
  top: 14px;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 7px;
  margin: 0 0 26px;
  padding: 7px;
  border: 1px solid #dbe3ec;
  border-radius: 18px;
  background: rgba(255,255,255,.95);
  box-shadow: 0 14px 36px rgba(20,32,51,.08);
  backdrop-filter: blur(16px);
}

.resources-context-nav button {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 11px;
  border: 0;
  border-radius: 13px;
  background: transparent;
  color: #536176;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition: .2s ease;
}

.resources-context-nav button > span {
  display: grid;
  width: 25px;
  height: 25px;
  place-items: center;
  border-radius: 8px;
  background: #f2f5f8;
  color: #7a8798;
  font-size: 10px;
}

.resources-context-nav button > small {
  padding: 3px 7px;
  border-radius: 999px;
  background: #f2f5f8;
  color: #667085;
  font-size: 11px;
}

.resources-context-nav button:hover {
  transform: translateY(-1px);
  background: #faf7f8;
  color: #9f1945;
}

.resources-context-nav button.is-active {
  background: #9f1945;
  color: #fff;
  box-shadow: 0 9px 22px rgba(159,25,69,.20);
}

.resources-context-nav button.is-active > span,
.resources-context-nav button.is-active > small {
  background: rgba(255,255,255,.16);
  color: #fff;
}

.resources-dashboard {
  margin-bottom: 30px;
  padding: clamp(22px,3vw,32px);
  border: 1px solid #dbe3ec;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 16px 44px rgba(20,32,51,.07);
  animation: resourcesPanelIn .35s cubic-bezier(.2,.75,.25,1);
}

.resources-dashboard__header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 22px;
  padding-bottom: 21px;
  border-bottom: 1px solid #e5eaf0;
}

.resources-dashboard__header > div > span,
.resources-dashboard__voice span {
  color: #9f1945;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .12em;
}

.resources-dashboard__header h2 {
  margin: 6px 0;
  color: #172033;
  font-size: clamp(25px,3vw,35px);
}

.resources-dashboard__header p {
  max-width: 700px;
  margin: 0;
  color: #667085;
  line-height: 1.6;
}

.resources-dashboard__publish {
  flex: 0 0 auto;
  padding: 12px 17px;
  border-radius: 12px;
  background: #9f1945;
  color: #fff !important;
  font-weight: 900;
  text-decoration: none;
  box-shadow: 0 8px 20px rgba(159,25,69,.18);
}

.resources-dashboard__grid {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 14px;
  margin-top: 22px;
}

.resources-dashboard__grid button {
  min-height: 176px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  border: 1px solid #dbe3ec;
  border-radius: 18px;
  background: #f8fafc;
  color: #172033;
  text-align: left;
  cursor: pointer;
  transition: .22s ease;
}

.resources-dashboard__grid button:hover {
  transform: translateY(-3px);
  border-color: rgba(159,25,69,.28);
  background: #fff;
  box-shadow: 0 13px 28px rgba(20,32,51,.08);
}

.resources-dashboard__grid button > span {
  color: #9f1945;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .09em;
}

.resources-dashboard__grid button > strong {
  margin: 10px 0 4px;
  font-size: 35px;
}

.resources-dashboard__grid button > small {
  color: #667085;
}

.resources-dashboard__grid button > b {
  margin-top: auto;
  padding-top: 17px;
  color: #9f1945;
  font-size: 13px;
}

.resources-dashboard__voice {
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 16px;
  align-items: center;
  margin-top: 18px;
  padding: 19px;
  border: 1px solid #eadfbd;
  border-radius: 18px;
  background: #fffaf0;
}

.resources-dashboard__voice-mark {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 14px;
  background: #172033;
  color: #fff;
  font-weight: 900;
}

.resources-dashboard__voice h3 {
  margin: 4px 0;
  color: #172033;
}

.resources-dashboard__voice p {
  margin: 0;
  color: #667085;
  line-height: 1.5;
}

.resources-dashboard__voice button {
  border: 0;
  background: transparent;
  color: #9f1945;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
}

/* Light-first: unifica las superficies antiguas del módulo */
.resources .resources__counter,
.resources .student-voice-card,
.resources .teacher-actions,
.resources .resources__search,
.resources .resources__toolbar select,
.resources .resources__summary article,
.resources .lesson-group,
.resources .material-card,
.resources .empty-state {
  background: #fff !important;
  border-color: #dbe3ec !important;
  color: #172033 !important;
}

.resources .resources__header h1,
.resources .resources__section-title h2,
.resources .lesson-group__header h3,
.resources .material-card h4 {
  color: #172033 !important;
}

.resources .resources__header p,
.resources .student-voice-card small,
.resources .teacher-actions small,
.resources .material-card p,
.resources .empty-state p {
  color: #667085 !important;
  opacity: 1 !important;
}

.resources .resources__eyebrow,
.resources .teacher-actions span,
.resources .resources__section-title p,
.resources .resources__section-title > span,
.resources .resources__counter strong,
.resources .student-voice-card strong {
  color: #9f1945 !important;
}

.resources .resources__search input,
.resources .resources__toolbar select {
  color: #172033 !important;
}

.resources .student-resource-filter button {
  border-color: #dbe3ec !important;
  background: #fff !important;
  color: #536176 !important;
  opacity: 1 !important;
}

.resources .student-resource-filter button.active {
  border-color: #9f1945 !important;
  background: #9f1945 !important;
  color: #fff !important;
}

.resources .publish-button {
  background: #9f1945 !important;
  color: #fff !important;
}

.resources .lesson-group,
.resources .material-card {
  box-shadow: 0 10px 28px rgba(20,32,51,.055);
}

.resources .material-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 32px rgba(20,32,51,.09);
}

@keyframes resourcesPanelIn {
  from { opacity:0; transform:translateY(8px); }
  to { opacity:1; transform:translateY(0); }
}

@media (max-width: 1000px) {
  .resources-context-nav {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: minmax(155px,1fr);
    overflow-x: auto;
  }

  .resources-dashboard__grid {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}

@media (max-width: 700px) {
  .resources-dashboard__header,
  .resources-dashboard__voice {
    align-items: flex-start;
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .resources-dashboard__grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .resources-context-nav button,
  .resources-dashboard,
  .resources .material-card {
    animation: none !important;
    transition: none !important;
  }
}

</style>
<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.resources {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-bottom: 3rem;
  color: #182136;
}

.resources--smart {
  --wine: #a9164b;
  --wine-deep: #7e123a;
  --gold: #d7a51c;
  --ink: #182136;
  --muted: #70809d;
  --line: #e3e8f0;
  --surface: #ffffff;
  --surface-soft: #f6f8fb;
  --shadow: 0 20px 55px rgba(25, 38, 61, .08);
}

.resources-hero {
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  min-height: 280px;
  margin-bottom: 1.5rem;
  padding: 2.4rem 2.6rem;
  overflow: hidden;
  border: 1px solid rgba(222, 228, 238, .9);
  border-radius: 28px;
  background:
    radial-gradient(circle at 90% 15%, rgba(215, 165, 28, .18), transparent 28%),
    radial-gradient(circle at 20% 110%, rgba(169, 22, 75, .11), transparent 35%),
    linear-gradient(135deg, #fff 0%, #fbfcfe 52%, #f9eef3 100%);
  box-shadow: 0 24px 65px rgba(30, 45, 72, .08);
}

.resources-hero::before {
  content: '';
  position: absolute;
  inset: 0;
  border-top: 3px solid transparent;
  border-image: linear-gradient(90deg, var(--wine), var(--gold)) 1;
  pointer-events: none;
}

.resources-hero__copy,
.resources-hero__side {
  position: relative;
  z-index: 2;
}

.resources-hero__copy {
  max-width: 820px;
  align-self: center;
}

.resources-hero__eyebrow {
  display: inline-flex;
  gap: .5rem;
  align-items: center;
  margin-bottom: .6rem;
  color: #9a6f03;
  font-size: .68rem;
  font-weight: 800;
  letter-spacing: .18em;
  text-transform: uppercase;
}

.resources-hero__eyebrow i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 5px rgba(215, 165, 28, .12);
}

.resources-hero h1 {
  margin: 0;
  font-size: clamp(3.4rem, 7vw, 5.8rem);
  line-height: .92;
  letter-spacing: -.065em;
  font-weight: 850;
}

.resources-hero h1 span {
  color: var(--gold);
}

.resources-hero p {
  max-width: 780px;
  margin: 1rem 0 1.25rem;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.7;
}

.resources-hero p b {
  color: var(--ink);
}

.resources-hero__quick {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
}

.resources-hero__quick span {
  padding: .55rem .75rem;
  border: 1px solid rgba(210, 218, 229, .95);
  border-radius: 999px;
  background: rgba(255,255,255,.74);
  color: #66748d;
  font-size: .72rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
}

.resources-hero__side {
  display: flex;
  min-width: 190px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.resources-hero__orb {
  width: 134px;
  height: 134px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(215, 165, 28, .42);
  border-radius: 50%;
  background: radial-gradient(circle, #fffdf7 0 48%, rgba(215,165,28,.13) 50%, transparent 70%);
  box-shadow: inset 0 0 30px rgba(215,165,28,.10), 0 15px 35px rgba(215,165,28,.10);
  text-align: center;
}

.resources-hero__orb span,
.resources-hero__orb small {
  display: block;
}

.resources-hero__orb span {
  font-size: 2.3rem;
  font-weight: 850;
  line-height: 1;
}

.resources-hero__orb small {
  margin-top: .25rem;
  color: #9a7a27;
  font-size: .64rem;
  font-weight: 800;
  letter-spacing: .12em;
  text-transform: uppercase;
}

.resources-hero__publish {
  display: inline-flex;
  align-items: center;
  gap: .55rem;
  padding: .75rem 1rem;
  border-radius: 14px;
  background: var(--wine);
  color: #fff;
  font-weight: 800;
  text-decoration: none;
  box-shadow: 0 13px 28px rgba(169, 22, 75, .24);
  transition: transform .25s ease, box-shadow .25s ease;
}

.resources-hero__publish:hover {
  transform: translateY(-2px);
  box-shadow: 0 17px 36px rgba(169, 22, 75, .30);
}

.resources-hero__publish span {
  font-size: 1.15rem;
}

.resources-hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(20px);
  pointer-events: none;
}

.resources-hero__glow--wine {
  width: 180px;
  height: 180px;
  right: 16%;
  bottom: -110px;
  background: rgba(169, 22, 75, .12);
}

.resources-hero__glow--gold {
  width: 160px;
  height: 160px;
  right: -30px;
  top: -70px;
  background: rgba(215, 165, 28, .16);
}

.resources-hero__grid {
  position: absolute;
  inset: 0;
  opacity: .26;
  background-image: linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(215,165,28,.1) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(90deg, rgba(0,0,0,.55), transparent 80%);
}

.resources-focus,
.resources-controls,
.resources-summary,
.resources-library {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: var(--surface);
  box-shadow: var(--shadow);
}

.resources-focus {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.25rem;
  padding: 1rem 1.2rem;
}

.resources-focus__mark {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  border-radius: 14px;
  background: linear-gradient(135deg, var(--wine), #d33f73);
  color: #fff;
  font-weight: 900;
  box-shadow: 0 10px 24px rgba(169,22,75,.18);
}

.resources-focus div:nth-child(2) {
  min-width: 0;
  flex: 1;
}

.resources-focus span,
.resources-focus strong,
.resources-focus small {
  display: block;
}

.resources-focus span {
  margin-bottom: .2rem;
  color: #9c6f09;
  font-size: .62rem;
  font-weight: 850;
  letter-spacing: .15em;
}

.resources-focus strong {
  color: var(--ink);
  font-size: .95rem;
}

.resources-focus small {
  margin-top: .18rem;
  color: var(--muted);
}

.resources-focus__toggle {
  display: inline-flex;
  align-items: center;
  gap: .55rem;
  padding: .65rem .85rem;
  border: 1px solid var(--line);
  border-radius: 999px;
  background: #fff;
  color: #65738a;
  font-weight: 750;
  cursor: pointer;
  transition: all .25s ease;
}

.resources-focus__toggle span {
  width: 8px;
  height: 8px;
  margin: 0;
  border-radius: 50%;
  background: #c7ced9;
  box-shadow: none;
}

.resources-focus__toggle.is-active {
  border-color: rgba(169,22,75,.22);
  background: rgba(169,22,75,.055);
  color: var(--wine);
}

.resources-focus__toggle.is-active span {
  background: #33a271;
  box-shadow: 0 0 0 4px rgba(51,162,113,.11);
}

.resources-controls {
  margin-bottom: 1.25rem;
  padding: 1rem;
}

.resources-search {
  display: flex;
  gap: .75rem;
  align-items: center;
  padding: .1rem .3rem .1rem .9rem;
  border: 1px solid #dde4ee;
  border-radius: 16px;
  background: #fafbfd;
  transition: box-shadow .2s ease, border-color .2s ease;
}

.resources-search:focus-within {
  border-color: rgba(169,22,75,.35);
  box-shadow: 0 0 0 4px rgba(169,22,75,.06);
}

.resources-search > span {
  color: #8793a8;
  font-size: 1.2rem;
}

.resources-search input {
  flex: 1;
  min-width: 0;
  padding: .8rem 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: var(--ink);
  font: inherit;
}

.resources-search kbd {
  padding: .34rem .5rem;
  border: 1px solid #dbe1eb;
  border-radius: 7px;
  background: #fff;
  color: #99a3b5;
  font-size: .63rem;
}

.resources-controls__row {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: .9rem;
}

.resources-filter-pills {
  display: flex;
  gap: .45rem;
  flex-wrap: wrap;
}

.resources-filter-pill {
  display: inline-flex;
  gap: .4rem;
  align-items: center;
  padding: .58rem .72rem;
  border: 1px solid #e1e6ef;
  border-radius: 999px;
  background: #fff;
  color: #66748b;
  font: inherit;
  font-size: .78rem;
  font-weight: 760;
  cursor: pointer;
  transition: all .22s ease;
}

.resources-filter-pill small {
  min-width: 18px;
  padding: .08rem .28rem;
  border-radius: 999px;
  background: #f0f3f7;
  color: #7b879a;
  text-align: center;
  font-size: .62rem;
}

.resources-filter-pill:hover {
  transform: translateY(-1px);
  border-color: rgba(169,22,75,.25);
}

.resources-filter-pill.is-active {
  border-color: transparent;
  background: var(--ink);
  color: #fff;
  box-shadow: 0 8px 18px rgba(24,33,54,.13);
}

.resources-filter-pill.is-active small {
  background: rgba(255,255,255,.16);
  color: #fff;
}

.resources-sort {
  display: flex;
  gap: .5rem;
  align-items: center;
  color: #8792a5;
  font-size: .72rem;
  font-weight: 800;
  white-space: nowrap;
}

.resources-sort select {
  padding: .56rem .75rem;
  border: 1px solid #e1e6ef;
  border-radius: 11px;
  background: #fff;
  color: var(--ink);
  font: inherit;
}

.resources-summary {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: 1.25rem;
  overflow: hidden;
}

.resources-summary > div {
  padding: 1rem 1.1rem;
  border-right: 1px solid var(--line);
}

.resources-summary > div:last-child {
  border-right: 0;
}

.resources-summary span,
.resources-summary strong,
.resources-summary small {
  display: block;
}

.resources-summary span {
  color: #9a6e04;
  font-size: .6rem;
  font-weight: 850;
  letter-spacing: .14em;
}

.resources-summary strong {
  margin-top: .15rem;
  font-size: 1.55rem;
  letter-spacing: -.03em;
}

.resources-summary small {
  margin-top: .15rem;
  color: var(--muted);
  font-size: .7rem;
}

.resources-library {
  padding: 1.2rem;
}

.resources-library__header {
  display: flex;
  gap: 1rem;
  align-items: end;
  justify-content: space-between;
  padding: .3rem .3rem 1rem;
  border-bottom: 1px solid var(--line);
}

.resources-library__header span {
  color: #9a6e04;
  font-size: .62rem;
  font-weight: 850;
  letter-spacing: .14em;
}

.resources-library__header h2 {
  margin: .25rem 0 0;
  font-size: clamp(1.55rem, 3vw, 2.15rem);
  letter-spacing: -.035em;
}

.resources-library__header p {
  max-width: 420px;
  margin: 0;
  color: var(--muted);
  text-align: right;
  line-height: 1.55;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.resource-card {
  position: relative;
  display: flex;
  min-width: 0;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #e1e6ee;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 34px rgba(27,38,61,.07);
  cursor: pointer;
  outline: 0;
  isolation: isolate;
  transition: transform .26s cubic-bezier(.2,.75,.2,1), box-shadow .26s ease, border-color .26s ease;
}

.resource-card:hover,
.resource-card:focus-visible {
  transform: translateY(-5px);
  border-color: color-mix(in srgb, var(--resource-accent) 32%, #e1e6ee);
  box-shadow: 0 24px 50px rgba(27,38,61,.13), 0 0 30px rgba(var(--resource-rgb), .14);
}

.resource-card::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px rgba(var(--resource-rgb), .06),
    0 0 32px rgba(var(--resource-rgb), .09);
  pointer-events: none;
}

/* V12 · aura cromática viva por tipo de recurso */
.resource-card::before {
  content: '';
  position: absolute;
  inset: -1px;
  z-index: -2;
  border-radius: inherit;
  background:
    radial-gradient(circle at 18% 8%, rgba(var(--resource-rgb), .30), transparent 29%),
    radial-gradient(circle at 86% 86%, rgba(var(--resource-rgb), .20), transparent 34%);
  filter: blur(18px);
  opacity: .42;
  transform: scale(.97);
  transition: opacity .35s ease, transform .35s cubic-bezier(.2,.75,.2,1);
  pointer-events: none;
}

.resource-card:hover::before,
.resource-card:focus-visible::before {
  opacity: .92;
  transform: scale(1.025);
}

.resource-card:hover::after,
.resource-card:focus-visible::after {
  box-shadow:
    inset 0 0 0 1px rgba(var(--resource-rgb), .14),
    0 0 42px rgba(var(--resource-rgb), .18),
    0 18px 55px rgba(27,38,61,.10);
}

.resource-card__shine {
  position: absolute;
  top: -70px;
  right: -40px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background:
    radial-gradient(circle, rgba(var(--resource-rgb), .34) 0%, rgba(var(--resource-rgb), .16) 34%, transparent 72%);
  filter: blur(18px);
  opacity: .55;
  transform: scale(.92);
  animation: resourceAuraPulse 4.8s ease-in-out infinite;
  pointer-events: none;
}

.resource-card:hover .resource-card__shine,
.resource-card:focus-visible .resource-card__shine {
  opacity: .96;
  animation-duration: 2.6s;
}

.resource-card__preview {
  position: relative;
  height: 176px;
  overflow: hidden;
  background: linear-gradient(135deg, #edf1f6, #fafbfd);
}

.resource-card__preview-glow {
  position: absolute;
  inset: -30%;
  background:
    radial-gradient(circle at 68% 18%, rgba(var(--resource-rgb), .30), transparent 42%),
    radial-gradient(circle at 18% 90%, rgba(var(--resource-rgb), .15), transparent 34%);
  filter: blur(4px);
  opacity: .78;
  transform: scale(.94);
  transition: opacity .35s ease, transform .45s cubic-bezier(.2,.75,.2,1);
  pointer-events: none;
  z-index: 2;
}

.resource-card:hover .resource-card__preview-glow,
.resource-card:focus-visible .resource-card__preview-glow {
  opacity: 1;
  transform: scale(1.08);
}

.resource-card__media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  border: 0;
}

.resource-card__media--image,
.resource-card__media--video {
  object-fit: cover;
}

.resource-card__media--pdf {
  transform: scale(1.28);
  transform-origin: center top;
  pointer-events: none;
  background: #f4f6f8;
}

.resource-card--document .resource-card__media--pdf {
  filter: saturate(.92);
}

.resource-card__preview::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 4;
  background:
    linear-gradient(115deg, transparent 0 38%, rgba(255,255,255,.34) 48%, transparent 58%),
    linear-gradient(180deg, rgba(255,255,255,.08), transparent 42%, rgba(16,25,41,.08));
  background-size: 220% 100%, 100% 100%;
  background-position: 135% 0, 0 0;
  opacity: .65;
  transition: opacity .35s ease;
  pointer-events: none;
}

.resource-card:hover .resource-card__preview::after,
.resource-card:focus-visible .resource-card__preview::after {
  opacity: .95;
  animation: resourceSheen 1.15s cubic-bezier(.2,.7,.2,1) both;
}

.resource-card__media--image,
.resource-card__media--video,
.resource-card__media--pdf {
  transition: transform .55s cubic-bezier(.2,.75,.2,1), filter .35s ease;
}

.resource-card:hover .resource-card__media--image,
.resource-card:hover .resource-card__media--video {
  transform: scale(1.035);
}

.resource-card:hover .resource-card__media--pdf {
  transform: scale(1.32) translateY(-1%);
  filter: saturate(1.02) contrast(1.015);
}

.resource-card__open {
  position: absolute;
  left: 50%;
  bottom: 1rem;
  display: inline-flex;
  gap: .45rem;
  align-items: center;
  padding: .5rem .68rem;
  border-radius: 999px;
  background: rgba(24,33,54,.82);
  color: #fff;
  font-size: .67rem;
  font-weight: 800;
  opacity: 0;
  transform: translate(-50%, 7px);
  backdrop-filter: blur(8px);
  transition: opacity .22s ease, transform .22s ease;
  z-index: 5;
}

.resource-card:hover .resource-card__open,
.resource-card:focus-visible .resource-card__open {
  opacity: 1;
  transform: translate(-50%, 0);
}

.resource-card__category {
  position: absolute;
  top: .8rem;
  left: .8rem;
  z-index: 5;
  display: inline-flex;
  gap: .4rem;
  align-items: center;
  padding: .42rem .55rem;
  border: 1px solid rgba(255,255,255,.5);
  border-radius: 999px;
  background: rgba(255,255,255,.76);
  color: var(--resource-accent);
  font-size: .63rem;
  font-weight: 850;
  backdrop-filter: blur(10px);
}

.resource-card__category > span {
  display: inline-grid;
  width: 20px;
  height: 20px;
  place-items: center;
  border-radius: 6px;
  background: var(--resource-accent);
  color: #fff;
  font-size: .63rem;
}

.resource-card__category {
  box-shadow: 0 8px 20px rgba(var(--resource-rgb), .10);
  transition: transform .3s ease, box-shadow .3s ease, background .3s ease;
}

.resource-card:hover .resource-card__category,
.resource-card:focus-visible .resource-card__category {
  transform: translateY(-2px);
  background: rgba(255,255,255,.90);
  box-shadow: 0 10px 25px rgba(var(--resource-rgb), .18);
}

.resource-card__personal {
  position: absolute;
  top: .8rem;
  right: .8rem;
  z-index: 5;
  padding: .42rem .55rem;
  border-radius: 999px;
  background: rgba(44, 157, 119, .92);
  color: #fff;
  font-size: .61rem;
  font-weight: 800;
  box-shadow: 0 8px 18px rgba(44,157,119,.22);
}

.resource-audio-preview,
.resource-link-preview,
.resource-file-preview {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
}

.resource-audio-preview {
  background: linear-gradient(135deg, rgba(118,87,217,.14), rgba(118,87,217,.03));
}

.resource-audio-preview__disc {
  position: absolute;
  top: 1.1rem;
  left: 1.1rem;
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 50%;
  background: var(--resource-accent);
  color: #fff;
  font-size: 1.4rem;
  box-shadow: 0 15px 30px rgba(var(--resource-rgb), .25);
}

.resource-audio-preview__bars {
  display: flex;
  gap: 4px;
  height: 68px;
  align-items: center;
  padding: 0 1rem;
}

.resource-audio-preview__bars i {
  width: 5px;
  height: var(--bar-h);
  border-radius: 99px;
  background: linear-gradient(180deg, #9b8ae7, var(--resource-accent));
  opacity: .82;
  animation: resourceWave 1.65s ease-in-out infinite alternate;
  animation-delay: calc(var(--bar-h) * -0.01s);
}

.resource-audio-preview > span {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: #654fc1;
  font-size: .67rem;
  font-weight: 800;
  letter-spacing: .08em;
  text-transform: uppercase;
}

@keyframes resourceWave {
  from { transform: scaleY(.72); opacity: .55; }
  to { transform: scaleY(1.05); opacity: .98; }
}

.resource-link-preview {
  align-content: center;
  padding: 1.2rem;
  background: linear-gradient(135deg, rgba(50,140,154,.14), rgba(50,140,154,.035));
  text-align: center;
}

.resource-link-preview__browser {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  height: 30px;
  display: flex;
  gap: 5px;
  align-items: center;
  padding: 0 .6rem;
  border-radius: 9px 9px 0 0;
  background: rgba(255,255,255,.78);
  border: 1px solid rgba(255,255,255,.82);
}

.resource-link-preview__browser span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: rgba(50,140,154,.35);
}

.resource-link-preview strong {
  margin-top: 1.7rem;
  font-size: 1.25rem;
  color: #2c7782;
}

.resource-link-preview small {
  margin-top: .35rem;
  color: #66929a;
}

.resource-file-preview {
  background: linear-gradient(135deg, rgba(127,135,156,.12), rgba(127,135,156,.025));
}

.resource-file-preview__sheet {
  display: grid;
  width: 84px;
  height: 104px;
  place-items: center;
  align-content: center;
  gap: 8px;
  border-radius: 12px;
  background: rgba(255,255,255,.86);
  box-shadow: 0 14px 28px rgba(31,42,64,.10);
  transform: rotate(-2deg);
}

.resource-file-preview__sheet span {
  color: var(--resource-accent);
  font-weight: 900;
  font-size: .78rem;
}

.resource-file-preview__sheet i {
  width: 46px;
  height: 4px;
  border-radius: 99px;
  background: #dce2ea;
}

.resource-file-preview > span {
  position: absolute;
  bottom: 1rem;
  color: #748096;
  font-size: .68rem;
  font-weight: 800;
}

.resource-card__body {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  padding: 1rem 1rem .9rem;
}

.resource-card__context {
  display: flex;
  gap: .45rem;
  align-items: center;
  justify-content: space-between;
  color: #99a3b4;
  font-size: .65rem;
}

.resource-card__lesson {
  min-width: 0;
  overflow: hidden;
  color: var(--wine);
  font-weight: 800;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resource-card h3 {
  margin: .45rem 0 .35rem;
  font-size: 1.05rem;
  line-height: 1.18;
  letter-spacing: -.025em;
}

.resource-card p {
  display: -webkit-box;
  min-height: 2.8em;
  overflow: hidden;
  margin: 0;
  color: #6f7d95;
  font-size: .78rem;
  line-height: 1.55;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.resource-card__meta {
  display: flex;
  gap: .4rem;
  flex-wrap: wrap;
  margin-top: .8rem;
  color: #8a96aa;
  font-size: .63rem;
}

.resource-card__meta span {
  max-width: 100%;
  padding: .3rem .45rem;
  border-radius: 7px;
  background: #f4f6f9;
}

.resource-card__filename {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.resource-card__admin {
  display: flex;
  gap: .5rem;
  padding: 0 1rem .9rem;
}

.resource-card__admin button {
  flex: 1;
  padding: .52rem .6rem;
  border: 1px solid #e3e7ef;
  border-radius: 9px;
  background: #fff;
  color: #6c788d;
  font: inherit;
  font-size: .67rem;
  font-weight: 800;
  cursor: pointer;
}

.resource-card__admin button:first-child:hover {
  color: var(--wine);
  border-color: rgba(169,22,75,.25);
}

.resource-card__admin button:last-child:hover {
  color: #a22d3f;
  border-color: rgba(162,45,63,.25);
  background: #fff8f9;
}


@keyframes resourceAuraPulse {
  0%, 100% {
    transform: scale(.88);
    opacity: .44;
  }
  50% {
    transform: scale(1.08);
    opacity: .78;
  }
}

@keyframes resourceSheen {
  0% { background-position: 135% 0, 0 0; }
  100% { background-position: -35% 0, 0 0; }
}

.resource-list-enter-active,
.resource-list-leave-active {
  transition:
    opacity .32s ease,
    transform .32s cubic-bezier(.2,.75,.25,1);
}

.resource-list-enter-from,
.resource-list-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(.985);
}

.resource-list-leave-active {
  position: absolute;
}

.resource-list-move {
  transition: transform .38s cubic-bezier(.2,.75,.25,1);
}

.resources-empty,
.resources-state {
  display: grid;
  justify-items: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.resources-empty__icon,
.resources-state__icon {
  display: grid;
  width: 58px;
  height: 58px;
  margin-bottom: .8rem;
  place-items: center;
  border-radius: 16px;
  background: #f1f4f8;
  color: #77849b;
  font-weight: 900;
}

.resources-empty span,
.resources-state span {
  color: #9a6e04;
  font-size: .65rem;
  font-weight: 850;
  letter-spacing: .14em;
}

.resources-empty h3,
.resources-state strong {
  margin: .4rem 0 0;
  font-size: 1.2rem;
}

.resources-empty p,
.resources-state p {
  max-width: 430px;
  margin: .4rem 0 1rem;
  color: var(--muted);
}

.resources-empty button,
.resources-state button {
  padding: .65rem .9rem;
  border: 0;
  border-radius: 10px;
  background: var(--wine);
  color: #fff;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.resources-state {
  min-height: 280px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background: #fff;
}

.resources-state--loading span {
  color: #75839b;
  font-size: .78rem;
  letter-spacing: .02em;
}

.resources-state__spinner {
  width: 42px;
  height: 42px;
  margin-bottom: 1rem;
  border: 3px solid #e8ecf3;
  border-top-color: var(--wine);
  border-radius: 50%;
  animation: resourcesSpin .8s linear infinite;
}

@keyframes resourcesSpin {
  to { transform: rotate(360deg); }
}

/* Mantener consistencia con el visor/CRUD ya existente. */
.resource-modal,
.admin-modal,
.delete-dialog,
.toast-message {
  z-index: 1000;
}

@media (max-width: 980px) {
  .resources-hero {
    flex-direction: column;
  }

  .resources-hero__side {
    flex-direction: row;
    justify-content: flex-start;
  }

  .resources-controls__row,
  .resources-library__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .resources-sort {
    width: 100%;
    justify-content: space-between;
  }

  .resources-sort select {
    flex: 1;
  }
}

@media (max-width: 720px) {
  .resources-hero {
    padding: 1.7rem;
    border-radius: 22px;
  }

  .resources-hero__side {
    align-items: flex-start;
  }

  .resources-summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .resources-summary > div:nth-child(2) {
    border-right: 0;
  }

  .resources-summary > div:nth-child(-n+2) {
    border-bottom: 1px solid var(--line);
  }

  .resources-focus {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .resources-focus__toggle {
    margin-left: 58px;
  }

  .resource-grid {
    grid-template-columns: 1fr;
  }

  .resources-search kbd {
    display: none;
  }
}
</style>

