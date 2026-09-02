<template>
  <section class="create-resource">
    <!-- =====================================================
         VOLVER
    ====================================================== -->

    <RouterLink
      to="/aula/recursos"
      class="create-resource__back"
    >
      ← Volver a Recursos
    </RouterLink>

    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="create-resource__header">
      <div>
        <p class="create-resource__eyebrow">
          Profesor · Biblioteca
        </p>

        <h1>
          Publicar recurso
        </h1>

        <p class="create-resource__subtitle">
          Sube partituras, audios, documentos y
          material de apoyo para tus estudiantes.
        </p>
      </div>

      <aside class="cloud-status">
        <span>
          SUPABASE
        </span>

        <strong>
          Almacenamiento en línea
        </strong>

        <small>
          Storage + Database
        </small>
      </aside>
    </header>

    <!-- =====================================================
         FORMULARIO
    ====================================================== -->

    <form
      class="resource-form"
      @submit.prevent="publishResource"
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
              Datos del recurso
            </h2>
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
            placeholder="Ej. Concierto Navidad · Soprano"
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
            placeholder="Describe para qué sirve este recurso..."
          ></textarea>
        </div>
      </section>

      <!-- ===================================================
           02 · CLASE
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            02
          </span>

          <div>
            <p>
              Programa
            </p>

            <h2>
              Clase asociada
            </h2>
          </div>
        </header>

        <div
          v-if="isLoadingLessons"
          class="lessons-loading"
        >
          Cargando clases...
        </div>

        <div
          v-else-if="lessonsError"
          class="inline-error"
        >
          <span>
            !
          </span>

          <div>
            <strong>
              No pudimos cargar las clases
            </strong>

            <p>
              {{ lessonsError }}
            </p>
          </div>

          <button
            type="button"
            @click="loadLessons"
          >
            Reintentar
          </button>
        </div>

        <div
          v-else
          class="form-group"
        >
          <label for="lesson">
            Clase
          </label>

          <select
            id="lesson"
            v-model.number="form.lessonId"
            required
          >
            <option
              disabled
              value=""
            >
              Selecciona una clase
            </option>

            <option
              v-for="lesson in lessons"
              :key="lesson.id"
              :value="lesson.id"
            >
              Clase
              {{ lesson.id }}
              ·
              {{ lesson.title }}
            </option>
          </select>
        </div>
      </section>

      <!-- ===================================================
           03 · TIPO
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            03
          </span>

          <div>
            <p>
              Formato
            </p>

            <h2>
              Tipo de material
            </h2>
          </div>
        </header>

        <div class="type-selector">
          <button
            v-for="type in resourceTypes"
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
           04 · VOZ
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            04
          </span>

          <div>
            <p>
              Destinatarios
            </p>

            <h2>
              Sección vocal
            </h2>
          </div>
        </header>

        <p class="form-help">
          General será visible para todos.
          Si eliges una cuerda, el recurso podrá
          destacarse para esos estudiantes.
        </p>

        <div class="voice-selector">
          <button
            v-for="voice in voices"
            :key="voice.value"
            type="button"
            :class="{
              active:
                form.voice === voice.value
            }"
            @click="
              form.voice = voice.value
            "
          >
            <span>
              {{ voice.short }}
            </span>

            <strong>
              {{ voice.label }}
            </strong>
          </button>
        </div>
      </section>

      <!-- ===================================================
           05 · ARCHIVO
      ==================================================== -->

      <section class="form-section">
        <header class="form-section__header">
          <span>
            05
          </span>

          <div>
            <p>
              Archivo
            </p>

            <h2>
              Subir material
            </h2>
          </div>
        </header>

        <label
          class="upload-zone"
          :class="{
            'upload-zone--selected':
              selectedFile
          }"
        >
          <input
            type="file"
            :accept="acceptTypes"
            required
            @change="handleFileChange"
          >

          <template v-if="!selectedFile">
            <div class="upload-zone__icon">
              ↑
            </div>

            <strong>
              Selecciona un archivo
            </strong>

            <span>
              PDF, audio, video o documento
            </span>

            <small>
              Tamaño máximo: 50 MB
            </small>
          </template>

          <template v-else>
            <div class="upload-zone__icon">
              ✓
            </div>

            <strong>
              {{ selectedFile.name }}
            </strong>

            <span>
              {{ formatBytes(selectedFile.size) }}
            </span>

            <small>
              {{
                selectedFile.type ||
                'Tipo de archivo desconocido'
              }}
            </small>
          </template>
        </label>

        <button
          v-if="selectedFile"
          type="button"
          class="remove-file"
          @click="clearFile"
        >
          Quitar archivo
        </button>
      </section>

      <!-- ===================================================
           PREVIEW
      ==================================================== -->

      <section class="resource-preview">
        <div class="resource-preview__top">
          <span>
            VISTA PREVIA
          </span>

          <span>
            {{
              getVoiceLabel(
                form.voice
              )
            }}
          </span>
        </div>

        <div class="resource-preview__content">
          <div class="resource-preview__icon">
            {{
              getTypeIcon(
                form.type
              )
            }}
          </div>

          <div>
            <small>
              {{
                getTypeLabel(
                  form.type
                )
              }}
            </small>

            <h2>
              {{
                form.title ||
                'Título del recurso'
              }}
            </h2>

            <p>
              {{
                form.description ||
                'Sin descripción.'
              }}
            </p>
          </div>
        </div>

        <div class="resource-preview__meta">
          <span>
            Clase
            {{
              form.lessonId ||
              '—'
            }}
          </span>

          <span>
            {{
              getVoiceLabel(
                form.voice
              )
            }}
          </span>

          <span v-if="selectedFile">
            {{
              formatBytes(
                selectedFile.size
              )
            }}
          </span>
        </div>
      </section>

      <!-- ===================================================
           PROGRESO
      ==================================================== -->

      <section
        v-if="isSaving"
        class="upload-progress"
      >
        <div
          class="upload-progress__bar"
        >
          <div
            :style="{
              width:
                `${progress}%`
            }"
          ></div>
        </div>

        <div class="upload-progress__text">
          <strong>
            {{ progressLabel }}
          </strong>

          <span>
            {{ progress }}%
          </span>
        </div>
      </section>

      <!-- ===================================================
           ERROR
      ==================================================== -->

      <section
        v-if="errorMessage"
        class="form-error"
      >
        <span>
          !
        </span>

        <div>
          <strong>
            No pudimos publicar el recurso
          </strong>

          <p>
            {{ errorMessage }}
          </p>
        </div>
      </section>

      <!-- ===================================================
           ACCIONES
      ==================================================== -->

      <footer class="form-actions">
        <RouterLink
          to="/aula/recursos"
          class="cancel-button"
        >
          Cancelar
        </RouterLink>

        <button
          type="submit"
          class="publish-button"
          :disabled="!canPublish"
        >
          {{
            isSaving
              ? 'Publicando...'
              : 'Publicar recurso'
          }}
        </button>
      </footer>
    </form>
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
  useRouter
} from 'vue-router'

import {
  supabase
} from '@/lib/supabase'

import {
  fetchLessons
} from '@/services/lessonService'

import {
  insertMaterial
} from '@/services/materialService'

const router = useRouter()

/* =========================================================
   ESTADO
========================================================= */

const lessons =
  ref([])

const isLoadingLessons =
  ref(true)

const lessonsError =
  ref('')

const selectedFile =
  ref(null)

const isSaving =
  ref(false)

const errorMessage =
  ref('')

const progress =
  ref(0)

const progressLabel =
  ref('Preparando archivo...')

/* =========================================================
   FORM
========================================================= */

const form =
  reactive({
    title: '',
    description: '',
    lessonId: '',
    type: 'pdf',
    voice: 'general'
  })

/* =========================================================
   TIPOS
========================================================= */

const resourceTypes = [
  {
    value: 'pdf',
    label: 'PDF',
    icon: 'PDF',
    description:
      'Guías y documentos'
  },
  {
    value: 'score',
    label: 'Partitura',
    icon: '♫',
    description:
      'Material musical'
  },
  {
    value: 'audio',
    label: 'Audio',
    icon: '♪',
    description:
      'Guías vocales'
  },
  {
    value: 'video',
    label: 'Video',
    icon: '▶',
    description:
      'Material audiovisual'
  },
  {
    value: 'other',
    label: 'Otro',
    icon: 'FILE',
    description:
      'Otros archivos'
  }
]

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

/* =========================================================
   CLASES
========================================================= */

const loadLessons =
  async () => {
    isLoadingLessons.value =
      true

    lessonsError.value =
      ''

    try {
      lessons.value =
        await fetchLessons()
    } catch (error) {
      console.error(
        'Error cargando clases:',
        error
      )

      lessonsError.value =
        error?.message ||
        'No se pudieron cargar las clases.'
    } finally {
      isLoadingLessons.value =
        false
    }
  }

/* =========================================================
   ARCHIVO
========================================================= */

const handleFileChange =
  event => {
    const file =
      event.target.files?.[0]

    if (!file) {
      return
    }

    errorMessage.value =
      ''

    const maxSize =
      50 * 1024 * 1024

    if (
      file.size >
      maxSize
    ) {
      errorMessage.value =
        'El archivo supera el límite de 50 MB.'

      event.target.value = ''

      selectedFile.value =
        null

      return
    }

    selectedFile.value =
      file

    /*
     * Podemos sugerir automáticamente
     * el tipo según MIME.
     */

    if (
      file.type ===
      'application/pdf'
    ) {
      if (
        form.type !== 'score'
      ) {
        form.type = 'pdf'
      }
    } else if (
      file.type.startsWith(
        'audio/'
      )
    ) {
      form.type = 'audio'
    } else if (
      file.type.startsWith(
        'video/'
      )
    ) {
      form.type = 'video'
    }
  }

const clearFile = () => {
  selectedFile.value =
    null
}

/* =========================================================
   PUBLICAR
========================================================= */

const publishResource =
  async () => {
    if (
      !canPublish.value
    ) {
      return
    }

    const file =
      selectedFile.value

    isSaving.value =
      true

    errorMessage.value =
      ''

    progress.value = 10

    progressLabel.value =
      'Preparando archivo...'

    let uploadedStoragePath =
      ''

    try {
      /* ===============================================
         1. NOMBRE SEGURO
      ================================================ */

      const safeFileName =
        sanitizeFileName(
          file.name
        )

      const voiceFolder =
        String(
          form.voice ||
          'general'
        )
          .toLowerCase()
          .replace(/\s+/g, '-')

      const storagePath =
        [
          `clase-${form.lessonId}`,
          voiceFolder,
          `${Date.now()}-${safeFileName}`
        ].join('/')

      uploadedStoragePath =
        storagePath

      /* ===============================================
         2. STORAGE
      ================================================ */

      progress.value = 30

      progressLabel.value =
        'Subiendo archivo...'

      const {
        data: uploadData,
        error: uploadError
      } = await supabase
        .storage
        .from(
          'aula-materiales'
        )
        .upload(
          storagePath,
          file,
          {
            cacheControl:
              '3600',

            upsert:
              false,

            contentType:
              file.type ||
              undefined
          }
        )

      if (uploadError) {
        throw uploadError
      }

      progress.value = 65

      progressLabel.value =
        'Creando enlace...'

      /* ===============================================
         3. URL PÚBLICA
      ================================================ */

      const {
        data: publicUrlData
      } = supabase
        .storage
        .from(
          'aula-materiales'
        )
        .getPublicUrl(
          uploadData.path
        )

      const publicUrl =
        publicUrlData
          ?.publicUrl

      if (!publicUrl) {
        throw new Error(
          'No se pudo generar la URL pública del archivo.'
        )
      }

      /* ===============================================
         4. DATABASE
      ================================================ */

      progress.value = 80

      progressLabel.value =
        'Guardando recurso...'

      const createdMaterial =
        await insertMaterial({
          lessonId:
            Number(
              form.lessonId
            ),

          type:
            form.type,

          voice:
            form.voice,

          title:
            form.title.trim(),

          description:
            form.description.trim(),

          url:
            publicUrl,

          storagePath:
            uploadData.path,

          fileName:
            file.name,

          fileSize:
            file.size,

          mimeType:
            file.type
        })

      console.log(
        'Recurso guardado:',
        createdMaterial
      )

      progress.value = 100

      progressLabel.value =
        'Recurso publicado'

      setTimeout(() => {
        router.push(
          '/aula/recursos'
        )
      }, 500)
    } catch (error) {
      console.error(
        'Error publicando recurso:',
        error
      )

      /*
       * Si el archivo llegó a Storage
       * pero falló Database,
       * intentamos eliminarlo.
       */

      if (
        uploadedStoragePath
      ) {
        try {
          await supabase
            .storage
            .from(
              'aula-materiales'
            )
            .remove([
              uploadedStoragePath
            ])
        } catch (
          cleanupError
        ) {
          console.error(
            'Error limpiando archivo huérfano:',
            cleanupError
          )
        }
      }

      errorMessage.value =
        error?.message ||
        'No se pudo publicar el recurso.'

      progress.value = 0
    } finally {
      isSaving.value =
        false
    }
  }

/* =========================================================
   VALIDACIÓN
========================================================= */

const canPublish =
  computed(() => {
    return Boolean(
      !isSaving.value &&
      form.title.trim() &&
      form.lessonId &&
      form.type &&
      form.voice &&
      selectedFile.value
    )
  })

/* =========================================================
   ACCEPT
========================================================= */

const acceptTypes =
  computed(() => {
    const accepts = {
      pdf:
        '.pdf,application/pdf',

      score:
        '.pdf,application/pdf',

      audio:
        'audio/*,.mp3,.wav,.m4a,.aac,.ogg,.flac',

      video:
        'video/*,.mp4,.webm,.mov,.m4v',

      other:
        '*/*'
    }

    return (
      accepts[form.type] ||
      '*/*'
    )
  })

/* =========================================================
   HELPERS
========================================================= */

const sanitizeFileName =
  fileName => {
    return String(fileName)
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        ''
      )
      .replace(
        /[^a-zA-Z0-9._-]/g,
        '-'
      )
      .replace(
        /-+/g,
        '-'
      )
  }

const getTypeLabel = type => {
  return (
    resourceTypes.find(
      item =>
        item.value === type
    )?.label ||
    'Material'
  )
}

const getTypeIcon = type => {
  return (
    resourceTypes.find(
      item =>
        item.value === type
    )?.icon ||
    'FILE'
  )
}

const getVoiceLabel = voice => {
  return (
    voices.find(
      item =>
        item.value === voice
    )?.label ||
    'General'
  )
}

const formatBytes = bytes => {
  const value =
    Number(bytes)

  if (!value) {
    return '0 B'
  }

  if (value < 1024) {
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
    (1024 * 1024)
  ).toFixed(1)} MB`
}

/* =========================================================
   INIT
========================================================= */

onMounted(() => {
  loadLessons()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.create-resource {
  width: 100%;
  max-width: 1050px;
  margin: 0 auto;
}

.create-resource__back {
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

.create-resource__header {
  display: flex;
  gap:
    variables.$spacing-2xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom:
    variables.$spacing-3xl;
}

.create-resource__header > div {
  max-width: 800px;
}

.create-resource__eyebrow {
  margin-bottom:
    variables.$spacing-sm;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

.create-resource__header h1 {
  margin-bottom:
    variables.$spacing-md;
  font-size:
    clamp(
      3rem,
      6vw,
      5rem
    );
}

.create-resource__subtitle {
  max-width: 700px;
  line-height: 1.6;
  opacity: 0.6;
}

.cloud-status {
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

.cloud-status span,
.cloud-status strong,
.cloud-status small {
  display: block;
}

.cloud-status span {
  margin-bottom: 5px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.cloud-status small {
  margin-top: 5px;
  opacity: 0.45;
}

/* =========================================================
   FORM
========================================================= */

.resource-form {
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
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  border-color:
    variables.$color-primary;
}

.form-group textarea {
  line-height: 1.6;
  resize: vertical;
}

.form-help {
  margin:
    0
    0
    variables.$spacing-lg;
  line-height: 1.55;
  opacity: 0.5;
}

/* =========================================================
   TIPOS
========================================================= */

.type-selector {
  display: grid;
  gap: 10px;
  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );
}

.type-selector button {
  display: grid;
  gap: 7px;
  min-height: 130px;
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
  cursor: pointer;
  opacity: 0.55;
}

.type-selector button.active {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
  opacity: 1;
}

.type-selector button > span {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border:
    1px solid
    currentColor;
  border-radius: 50%;
  font-size: 0.7rem;
}

.type-selector small {
  text-align: center;
}

/* =========================================================
   VOZ
========================================================= */

.voice-selector {
  display: grid;
  gap: 10px;
  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );
}

.voice-selector button {
  display: grid;
  gap: 7px;
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
  cursor: pointer;
  opacity: 0.55;
}

.voice-selector button.active {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
  opacity: 1;
}

.voice-selector button span {
  display: grid;
  min-width: 38px;
  height: 38px;
  padding:
    0
    5px;
  place-items: center;
  border:
    1px solid
    currentColor;
  border-radius: 50%;
}

/* =========================================================
   UPLOAD
========================================================= */

.upload-zone {
  display: grid;
  min-height: 260px;
  gap: 8px;
  place-items: center;
  align-content: center;
  padding:
    variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
  text-align: center;
  cursor: pointer;
}

.upload-zone:hover,
.upload-zone--selected {
  border-color:
    variables.$color-primary;
}

.upload-zone input {
  display: none;
}

.upload-zone__icon {
  display: grid;
  width: 70px;
  height: 70px;
  margin-bottom: 8px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 1.8rem;
}

.upload-zone > span,
.upload-zone > small {
  opacity: 0.5;
}

.remove-file {
  margin-top:
    variables.$spacing-md;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ff7777;
  font: inherit;
  cursor: pointer;
}

/* =========================================================
   PREVIEW
========================================================= */

.resource-preview {
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
        0.13
      ),
      transparent 35%
    ),
    variables.$color-surface;
}

.resource-preview__top {
  display: flex;
  justify-content: space-between;
  margin-bottom:
    variables.$spacing-xl;
}

.resource-preview__top span {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  letter-spacing: 0.1em;
}

.resource-preview__content {
  display: grid;
  gap:
    variables.$spacing-lg;
  align-items: center;
  grid-template-columns:
    auto
    1fr;
}

.resource-preview__icon {
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
}

.resource-preview__content small {
  color:
    variables.$color-primary;
}

.resource-preview__content h2 {
  margin:
    5px
    0;
}

.resource-preview__content p {
  margin: 0;
  opacity: 0.55;
}

.resource-preview__meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top:
    variables.$spacing-xl;
}

.resource-preview__meta span {
  padding:
    5px
    9px;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  font-size:
    variables.$font-size-xs;
  opacity: 0.6;
}

/* =========================================================
   PROGRESO
========================================================= */

.upload-progress {
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.upload-progress__bar {
  height: 6px;
  overflow: hidden;
  border-radius: 999px;
  background:
    variables.$color-background;
}

.upload-progress__bar div {
  height: 100%;
  border-radius: inherit;
  background:
    variables.$color-primary;
  transition:
    width
    0.2s ease;
}

.upload-progress__text {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.upload-progress__text strong {
  color:
    variables.$color-primary;
}

/* =========================================================
   ERROR
========================================================= */

.form-error,
.inline-error {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
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

.form-error > span,
.inline-error > span {
  display: grid;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    #d85151;
  border-radius: 50%;
  color: #ff7777;
}

.form-error strong,
.inline-error strong {
  color: #ff7777;
}

.form-error p,
.inline-error p {
  margin:
    4px
    0
    0;
  opacity: 0.65;
}

.inline-error button {
  margin-left: auto;
  padding:
    8px
    12px;
  border:
    1px solid
    #d85151;
  border-radius:
    variables.$radius-lg;
  background: transparent;
  color: #ff7777;
  font: inherit;
  cursor: pointer;
}

.lessons-loading {
  opacity: 0.5;
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
  .create-resource__header {
    align-items: stretch;
    flex-direction: column;
  }

  .cloud-status {
    width: 100%;
  }

  .type-selector {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .voice-selector {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 650px) {
  .form-section,
  .resource-preview {
    padding:
      variables.$spacing-xl;
  }

  .type-selector,
  .voice-selector {
    grid-template-columns: 1fr;
  }

  .resource-preview__content {
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