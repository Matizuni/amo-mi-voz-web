<template>
  <section class="voice-page">
    <div class="voice-shell">
      <!-- =====================================================
           ENCABEZADO
      ====================================================== -->
      <header class="voice-header">
        <div>
          <RouterLink
            :to="`/aula/estudiante/${studentId}`"
            class="back-link"
          >
            ← Volver al perfil
          </RouterLink>

          <div class="eyebrow">
            SEGUIMIENTO VOCAL
          </div>

          <h1>
            {{ student?.name || 'Estudiante' }}
          </h1>

          <p>
            Grabaciones, evolución técnica y análisis asistido por IA
            en ocho dimensiones del canto.
          </p>
        </div>

        <button
          type="button"
          class="primary-button"
          @click="openRecordingModal"
        >
          <span aria-hidden="true">＋</span>
          Nueva grabación
        </button>
      </header>

      <!-- =====================================================
           CARGA
      ====================================================== -->
      <div
        v-if="isLoading"
        class="loading-card"
      >
        <div class="loading-spinner"></div>
        <strong>Cargando seguimiento vocal…</strong>
        <span>Estamos preparando las muestras del estudiante.</span>
      </div>

      <!-- =====================================================
           ERROR
      ====================================================== -->
      <div
        v-else-if="loadError"
        class="alert-card alert-card--error"
        role="alert"
      >
        <strong>No pudimos cargar el seguimiento vocal</strong>
        <p>{{ loadError }}</p>
        <button
          type="button"
          class="secondary-button"
          @click="loadPage"
        >
          Intentar nuevamente
        </button>
      </div>

      <template v-else>
        <!-- ===================================================
             AVISO PEDAGÓGICO
        ==================================================== -->
        <section class="ai-notice">
          <div class="ai-notice__icon" aria-hidden="true">
            ✦
          </div>

          <div>
            <strong>IA como apoyo pedagógico</strong>
            <p>
              El análisis auditivo ayuda a observar patrones de la muestra.
              No diagnostica salud vocal ni afirma postura, tensión laríngea
              o coordinación respiratoria observable sin video o evaluación presencial.
            </p>
          </div>
        </section>

        <!-- ===================================================
             MAPA VOCAL
        ==================================================== -->
        <section class="panel">
          <div class="section-heading">
            <div>
              <span class="section-kicker">PERFIL ACTUAL</span>
              <h2>Mapa vocal</h2>
              <p>
                El radar muestra únicamente dimensiones con un puntaje de referencia
                válido. Los indicadores acústicos se presentan aparte.
              </p>
            </div>

            <div class="profile-meta">
              <span>{{ recordings.length }} {{ recordings.length === 1 ? 'muestra' : 'muestras' }}</span>
              <span v-if="latestAnalysisDate">
                Último análisis · {{ latestAnalysisDate }}
              </span>
            </div>
          </div>

          <div class="map-layout">
            <div class="radar-card">
              <svg
                class="radar"
                viewBox="0 0 520 520"
                role="img"
                aria-label="Mapa de dimensiones vocales"
              >
                <g class="radar-grid">
                  <polygon
                    v-for="level in radarLevels"
                    :key="`grid-${level}`"
                    :points="radarPolygon(level)"
                  />

                  <line
                    v-for="(dimension, index) in dimensions"
                    :key="`axis-${dimension.key}`"
                    x1="260"
                    y1="260"
                    :x2="radarPoint(index, 100).x"
                    :y2="radarPoint(index, 100).y"
                  />
                </g>

                <g v-if="hasReferenceScores">
                  <polygon
                    class="radar-area"
                    :points="radarScorePolygon"
                  />

                  <circle
                    v-for="(point, index) in radarScorePoints"
                    :key="`point-${dimensions[index].key}`"
                    class="radar-point"
                    :cx="point.x"
                    :cy="point.y"
                    r="5"
                  />
                </g>

                <g v-else class="radar-empty">
                  <circle
                    cx="260"
                    cy="260"
                    r="8"
                  />
                  <text
                    x="260"
                    y="246"
                    text-anchor="middle"
                  >
                    Sin referencia
                  </text>
                  <text
                    x="260"
                    y="270"
                    text-anchor="middle"
                  >
                    melódica todavía
                  </text>
                </g>

                <g class="radar-labels">
                  <text
                    v-for="(dimension, index) in dimensions"
                    :key="`label-${dimension.key}`"
                    :x="radarLabelPoint(index).x"
                    :y="radarLabelPoint(index).y"
                    :text-anchor="radarLabelPoint(index).anchor"
                  >
                    {{ dimension.shortLabel }}
                  </text>
                </g>
              </svg>
            </div>

            <div class="dimension-list">
              <article
                v-for="dimension in dimensions"
                :key="dimension.key"
                class="dimension-card"
              >
                <div class="dimension-card__top">
                  <div>
                    <span class="dimension-card__index">
                      {{ String(dimension.index).padStart(2, '0') }}
                    </span>
                    <h3>{{ dimension.label }}</h3>
                  </div>

                  <span
                    class="dimension-status"
                    :class="`dimension-status--${dimensionStatusClass(dimension.key)}`"
                  >
                    {{ dimensionStatusLabel(dimension.key) }}
                  </span>
                </div>

                <div class="dimension-value">
                  <strong v-if="dimensionReferenceScore(dimension.key) !== null">
                    {{ Math.round(dimensionReferenceScore(dimension.key)) }}
                  </strong>
                  <strong v-else-if="dimensionIndicatorScore(dimension.key) !== null">
                    {{ Math.round(dimensionIndicatorScore(dimension.key)) }}
                  </strong>
                  <strong v-else>—</strong>

                  <span v-if="dimensionReferenceScore(dimension.key) !== null">
                    / 100 · referencia
                  </span>
                  <span v-else-if="dimensionIndicatorScore(dimension.key) !== null">
                    / 100 · indicador
                  </span>
                  <span v-else>
                    Sin observación registrada todavía
                  </span>
                </div>

                <p>
                  {{ dimension.description }}
                </p>
              </article>
            </div>
          </div>
        </section>

        <!-- ===================================================
             ÚLTIMA MUESTRA
        ==================================================== -->
        <section
          v-if="latestRecording"
          class="latest-card"
        >
          <div class="latest-card__content">
            <span class="section-kicker">ÚLTIMA MUESTRA</span>
            <h2>{{ latestRecording.title }}</h2>
            <p v-if="latestRecording.song">
              {{ latestRecording.song }}
              <span v-if="latestRecording.artist"> · {{ latestRecording.artist }}</span>
            </p>
            <small>
              {{ formatDate(latestRecording.recordedAt) }}
            </small>
          </div>

          <div class="latest-card__actions">
            <audio
              v-if="latestRecording.audioUrl"
              :src="latestRecording.audioUrl"
              controls
              preload="none"
            ></audio>

            <button
              v-if="!latestRecording.analysis || latestRecording.analysis.status === 'failed'"
              type="button"
              class="secondary-button"
              :disabled="analyzingId === latestRecording.id"
              @click="analyzeRecording(latestRecording)"
            >
              {{ analyzingId === latestRecording.id ? 'Analizando…' : 'Analizar con IA' }}
            </button>
          </div>
        </section>

        <!-- ===================================================
             HISTORIAL
        ==================================================== -->
        <section class="panel">
          <div class="section-heading">
            <div>
              <span class="section-kicker">HISTORIAL</span>
              <h2>Grabaciones vocales</h2>
              <p>
                Cada muestra puede convertirse en una nueva referencia para el seguimiento.
              </p>
            </div>

            <span class="count-badge">
              {{ recordings.length }} {{ recordings.length === 1 ? 'muestra' : 'muestras' }}
            </span>
          </div>

          <div
            v-if="!recordings.length"
            class="empty-state"
          >
            <div class="empty-state__icon" aria-hidden="true">
              ♫
            </div>
            <div>
              <h3>Todavía no hay grabaciones</h3>
              <p>
                La primera muestra servirá como línea base para comenzar el seguimiento vocal.
              </p>
            </div>
            <button
              type="button"
              class="secondary-button"
              @click="openRecordingModal"
            >
              Crear primera muestra
            </button>
          </div>

          <div
            v-else
            class="recording-list"
          >
            <article
              v-for="recording in recordings"
              :key="recording.id"
              class="recording-card"
            >
              <div class="recording-card__main">
                <div class="recording-icon" aria-hidden="true">
                  ♪
                </div>

                <div>
                  <div class="recording-card__title-row">
                    <h3>{{ recording.title }}</h3>
                    <span
                      class="analysis-pill"
                      :class="`analysis-pill--${analysisStatusClass(recording.analysis)}`"
                    >
                      {{ analysisStatusLabel(recording.analysis) }}
                    </span>
                  </div>

                  <p v-if="recording.song">
                    {{ recording.song }}
                    <span v-if="recording.artist"> · {{ recording.artist }}</span>
                  </p>

                  <div class="recording-card__meta">
                    <small>{{ formatDate(recording.recordedAt) }}</small>
                    <span v-if="recording.referenceStatus === 'processed_deleted'">Referencia procesada ✓</span>
                    <span v-else-if="recording.referenceStatus === 'uploaded'">Referencia lista</span>
                    <span v-else-if="recording.referenceStatus === 'processing'">Procesando referencia…</span>
                  </div>
                </div>
              </div>

              <div class="recording-card__right">
                <audio
                  v-if="recording.audioUrl"
                  :src="recording.audioUrl"
                  controls
                  preload="none"
                ></audio>

                <button
                  v-if="!recording.analysis || recording.analysis.status === 'failed'"
                  type="button"
                  class="ghost-button"
                  :disabled="analyzingId === recording.id"
                  @click="analyzeRecording(recording)"
                >
                  {{ analyzingId === recording.id ? 'Analizando…' : 'Analizar' }}
                </button>

                <button
                  type="button"
                  class="danger-button"
                  :disabled="deletingId === recording.id"
                  @click="removeRecording(recording)"
                >
                  {{ deletingId === recording.id ? 'Eliminando…' : 'Eliminar' }}
                </button>
              </div>
            </article>
          </div>
        </section>
      </template>
    </div>

    <!-- =====================================================
         MODAL NUEVA GRABACIÓN
    ====================================================== -->
    <Transition name="modal">
      <div
        v-if="isRecordingModalOpen"
        class="modal-backdrop"
        @click.self="closeRecordingModal"
      >
        <section
          class="recording-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="new-recording-title"
        >
          <div class="recording-modal__header">
            <div>
              <span class="section-kicker">NUEVA MUESTRA</span>
              <h2 id="new-recording-title">Subir grabación vocal</h2>
              <p>
                Guarda una muestra limpia para iniciar o continuar el seguimiento.
              </p>
            </div>

            <button
              type="button"
              class="close-button"
              aria-label="Cerrar"
              @click="closeRecordingModal"
            >
              ×
            </button>
          </div>

          <form @submit.prevent="saveRecording">
            <div class="form-grid">
              <label class="field field--full">
                <span>Título de la muestra</span>
                <input
                  v-model="recordingForm.title"
                  type="text"
                  maxlength="120"
                  placeholder="Ej. Prueba vocal 01"
                />
              </label>

              <label class="field field--full">
                <span>Canción / ejercicio</span>
                <input
                  v-model="recordingForm.song"
                  type="text"
                  maxlength="160"
                  placeholder="Ej. Canción de prueba"
                />
              </label>

              <label class="field">
                <span>Artista original</span>
                <input
                  v-model="recordingForm.artist"
                  type="text"
                  maxlength="160"
                  placeholder="Ej. Artista"
                />
              </label>

              <label class="field">
                <span>Tipo</span>
                <select v-model="recordingForm.songType">
                  <option value="cover">Cover</option>
                  <option value="exercise">Ejercicio</option>
                  <option value="original">Original</option>
                </select>
              </label>

              <label class="field">
                <span>Tonalidad</span>
                <select v-model="recordingForm.key">
                  <option value="">Sin especificar</option>
                  <option v-for="note in keyOptions" :key="note" :value="note">
                    {{ note }}
                  </option>
                </select>
              </label>

              <label class="field">
                <span>Escala / modo</span>
                <select v-model="recordingForm.scale">
                  <option value="">Sin especificar</option>
                  <option
                    v-for="scale in scaleOptions"
                    :key="scale.value"
                    :value="scale.value"
                  >
                    {{ scale.label }}
                  </option>
                </select>
              </label>

              <label class="field">
                <span>BPM</span>
                <input
                  v-model="recordingForm.bpm"
                  type="number"
                  min="1"
                  max="300"
                  step="0.1"
                  placeholder="Ej. 120"
                />
              </label>

              <label class="field">
                <span>Compás</span>
                <input
                  v-model="recordingForm.timeSignature"
                  type="text"
                  maxlength="20"
                  placeholder="Ej. 4/4"
                />
              </label>

              <label class="field">
                <span>Transposición</span>
                <input
                  v-model="recordingForm.transpositionSemitones"
                  type="number"
                  min="-24"
                  max="24"
                  step="1"
                  placeholder="0"
                />
                <small>Semitonos respecto de la referencia.</small>
              </label>

              <label class="field field--full">
                <span>Enlace de YouTube · solo contexto</span>
                <input
                  v-model="recordingForm.youtubeUrl"
                  type="url"
                  maxlength="500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <small>AMV no descarga este enlace. Se guarda para identificar/reproducir la canción.</small>
              </label>

              <label class="field field--full">
                <span>Referencia AMV · MIDI o audio</span>
                <input
                  ref="referenceInput"
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.flac,.ogg,.webm,.mid,.midi"
                  @change="handleReferenceFile"
                />
                <small>
                  Esta es la referencia que AMV analizará. MIDI es la opción más ligera; con audio, AMV deriva un perfil musical y luego elimina el archivo temporal.
                </small>
              </label>

              <label class="field field--full">
                <span>Tu interpretación</span>
                <input
                  ref="audioInput"
                  type="file"
                  accept="audio/*,.mp3,.wav,.m4a,.ogg,.webm"
                  @change="handleAudioFile"
                />
                <small>
                  Recomendado: voz clara y lo más aislada posible de la pista.
                </small>
              </label>
            </div>

            <div
              v-if="selectedReferenceFile"
              class="selected-file selected-file--reference"
            >
              <span aria-hidden="true">🎼</span>
              <div>
                <strong>{{ selectedReferenceFile.name }}</strong>
                <small>{{ formatFileSize(selectedReferenceFile.size) }} · referencia AMV</small>
              </div>
            </div>

            <div
              v-if="selectedFile"
              class="selected-file"
            >
              <span aria-hidden="true">♫</span>
              <div>
                <strong>{{ selectedFile.name }}</strong>
                <small>{{ formatFileSize(selectedFile.size) }}</small>
              </div>
            </div>

            <div
              v-if="recordingFormError"
              class="form-error"
              role="alert"
            >
              {{ recordingFormError }}
            </div>

            <div class="recording-modal__footer">
              <button
                type="button"
                class="secondary-button"
                :disabled="isSavingRecording"
                @click="closeRecordingModal"
              >
                Cancelar
              </button>

              <button
                type="submit"
                class="primary-button"
                :disabled="isSavingRecording"
              >
                {{ isSavingRecording ? 'Subiendo…' : 'Guardar grabación' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  RouterLink,
  useRoute
} from 'vue-router'

import {
  fetchStudentById
} from '@/services/studentService'

import {
  createVocalRecordingSignedUrl,
  deleteVocalRecording,
  fetchVocalRecordings,
  getVocalDimensionValue,
  requestVocalAnalysis,
  uploadVocalRecording,
  VOCAL_DIMENSIONS
} from '@/services/VocalIntelligenceService'

/* =========================================================
   BASE
========================================================= */

const route = useRoute()

const studentId = computed(() =>
  Number(route.params.studentId)
)

const student = ref(null)
const recordings = ref([])

const isLoading = ref(true)
const loadError = ref('')

const analyzingId = ref(null)
const deletingId = ref(null)

/* =========================================================
   MODAL
========================================================= */

const isRecordingModalOpen = ref(false)
const isSavingRecording = ref(false)
const recordingFormError = ref('')
const selectedFile = ref(null)
const selectedReferenceFile = ref(null)
const audioInput = ref(null)
const referenceInput = ref(null)

const recordingForm = reactive({
  title: '',
  song: '',
  artist: '',
  songType: 'cover',
  key: '',
  scale: '',
  bpm: '',
  timeSignature: '4/4',
  youtubeUrl: '',
  transpositionSemitones: 0
})

const keyOptions = [
  'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb',
  'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B'
]

const scaleOptions = [
  { value: 'major', label: 'Mayor' },
  { value: 'minor', label: 'Menor' },
  { value: 'natural_minor', label: 'Menor natural' },
  { value: 'harmonic_minor', label: 'Menor armónica' },
  { value: 'melodic_minor', label: 'Menor melódica' },
  { value: 'dorian', label: 'Dórico' },
  { value: 'phrygian', label: 'Frigio' },
  { value: 'lydian', label: 'Lidio' },
  { value: 'mixolydian', label: 'Mixolidio' },
  { value: 'aeolian', label: 'Eólico' },
  { value: 'locrian', label: 'Locrio' },
  { value: 'pentatonic_major', label: 'Pentatónica mayor' },
  { value: 'pentatonic_minor', label: 'Pentatónica menor' },
  { value: 'blues', label: 'Blues' }
]


/* =========================================================
   DIMENSIONES
========================================================= */

const dimensions = computed(() =>
  VOCAL_DIMENSIONS.map((dimension, index) => ({
    ...dimension,
    index: index + 1
  }))
)

const latestRecording = computed(() =>
  recordings.value[0] || null
)

const latestAnalysis = computed(() =>
  latestRecording.value?.analysis || null
)

const latestAnalysisDate = computed(() =>
  latestAnalysis.value?.createdAt
    ? formatDate(latestAnalysis.value.createdAt)
    : ''
)

const hasReferenceScores = computed(() =>
  dimensions.value.some(dimension =>
    dimensionReferenceScore(dimension.key) !== null
  )
)

/* =========================================================
   RADAR
========================================================= */

const radarLevels = [20, 40, 60, 80, 100]
const radarCenter = 260
const radarRadius = 165

const radarPoint = (index, value) => {
  const angle =
    (-Math.PI / 2) +
    (index * (Math.PI * 2 / dimensions.value.length))

  const radius =
    radarRadius * (Math.max(0, Math.min(100, Number(value) || 0)) / 100)

  return {
    x: radarCenter + Math.cos(angle) * radius,
    y: radarCenter + Math.sin(angle) * radius
  }
}

const radarPolygon = value =>
  dimensions.value
    .map((_, index) => {
      const point = radarPoint(index, value)
      return `${point.x},${point.y}`
    })
    .join(' ')

const radarScorePoints = computed(() =>
  dimensions.value.map((dimension, index) =>
    radarPoint(
      index,
      dimensionReferenceScore(dimension.key) ?? 0
    )
  )
)

const radarScorePolygon = computed(() =>
  radarScorePoints.value
    .map(point => `${point.x},${point.y}`)
    .join(' ')
)

const radarLabelPoint = index => {
  const point = radarPoint(index, 118)
  const angle =
    (-Math.PI / 2) +
    (index * (Math.PI * 2 / dimensions.value.length))

  const cosine = Math.cos(angle)

  return {
    x: point.x,
    y: point.y,
    anchor:
      cosine > 0.35
        ? 'start'
        : cosine < -0.35
          ? 'end'
          : 'middle'
  }
}

/* =========================================================
   VALORES DE DIMENSIONES
========================================================= */

const dimensionObject = key =>
  getVocalDimensionValue(
    latestAnalysis.value,
    key
  )

const rawDimensionScore = key => {
  const value = dimensionObject(key)

  if (value === null || value === undefined) {
    return null
  }

  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : null
  }

  if (typeof value !== 'object') {
    return null
  }

  const candidates = [
    value.score,
    value.value,
    value.indicator,
    value.pedagogical_score
  ]

  const score = candidates.find(candidate =>
    Number.isFinite(Number(candidate))
  )

  return score === undefined
    ? null
    : Number(score)
}

const dimensionSemantics = key => {
  const value = dimensionObject(key)

  if (!value || typeof value !== 'object') {
    return null
  }

  return (
    value.score_semantics ||
    value.semantics ||
    value.scoreSemantics ||
    null
  )
}

const dimensionReferenceScore = key => {
  if (dimensionSemantics(key) !== 'reference_score') {
    return null
  }

  return rawDimensionScore(key)
}

const dimensionIndicatorScore = key => {
  if (dimensionSemantics(key) !== 'acoustic_proxy') {
    return null
  }

  return rawDimensionScore(key)
}

const dimensionStatusClass = key => {
  if (dimensionReferenceScore(key) !== null) {
    return 'reference'
  }

  if (dimensionIndicatorScore(key) !== null) {
    return 'indicator'
  }

  const value = dimensionObject(key)

  if (value) {
    const semantics = dimensionSemantics(key)

    if (semantics === 'descriptive') {
      return 'descriptive'
    }

    if (semantics === 'not_scoreable') {
      return 'pending'
    }
  }

  return 'pending'
}

const dimensionStatusLabel = key => {
  if (dimensionReferenceScore(key) !== null) {
    return 'Referencia'
  }

  if (dimensionIndicatorScore(key) !== null) {
    return 'Indicador'
  }

  const semantics = dimensionSemantics(key)

  if (semantics === 'descriptive') {
    return 'Descriptivo'
  }

  return 'Sin datos'
}

/* =========================================================
   ESTADOS DE ANÁLISIS
========================================================= */

const analysisStatusClass = analysis => {
  if (!analysis) {
    return 'pending'
  }

  switch (analysis.status) {
    case 'completed':
      return 'completed'
    case 'processing':
      return 'processing'
    case 'failed':
      return 'failed'
    default:
      return 'pending'
  }
}

const analysisStatusLabel = analysis => {
  if (!analysis) {
    return 'Pendiente de análisis'
  }

  switch (analysis.status) {
    case 'completed':
      return 'Análisis disponible'
    case 'processing':
      return 'Procesando'
    case 'failed':
      return 'Análisis fallido'
    default:
      return 'Pendiente'
  }
}

/* =========================================================
   CARGA
========================================================= */

const loadStudent = async () => {
  const id = Number(studentId.value)

  if (!Number.isFinite(id)) {
    throw new Error('El ID del estudiante no es válido.')
  }

  return fetchStudentById(id)
}

const attachAudioUrls = async sourceRecordings => {
  return Promise.all(
    sourceRecordings.map(async recording => {
      if (!recording?.storagePath) {
        return recording
      }

      try {
        const audioUrl =
          await createVocalRecordingSignedUrl(
            recording.storagePath
          )

        return {
          ...recording,
          audioUrl
        }
      } catch (error) {
        console.warn(
          '[VozView] No fue posible crear URL temporal:',
          error
        )

        return recording
      }
    })
  )
}

const loadRecordings = async () => {
  const loaded = await fetchVocalRecordings(
    studentId.value
  )

  recordings.value =
    await attachAudioUrls(loaded || [])
}

const loadPage = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const [loadedStudent] =
      await Promise.all([
        loadStudent(),
        loadRecordings()
      ])

    student.value =
      loadedStudent || null
  } catch (error) {
    console.error(
      '[VozView] Error cargando seguimiento vocal:',
      error
    )

    student.value = null
    recordings.value = []

    loadError.value =
      error?.message ||
      'No pudimos cargar el seguimiento vocal.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   MODAL
========================================================= */

const resetRecordingForm = () => {
  recordingForm.title = ''
  recordingForm.song = ''
  recordingForm.artist = ''
  recordingForm.songType = 'cover'
  recordingForm.key = ''
  recordingForm.scale = ''
  recordingForm.bpm = ''
  recordingForm.timeSignature = '4/4'
  recordingForm.youtubeUrl = ''
  recordingForm.transpositionSemitones = 0
  selectedFile.value = null
  selectedReferenceFile.value = null
  recordingFormError.value = ''

  if (audioInput.value) {
    audioInput.value.value = ''
  }

  if (referenceInput.value) {
    referenceInput.value.value = ''
  }
}

const openRecordingModal = async () => {
  resetRecordingForm()
  isRecordingModalOpen.value = true

  await nextTick()
}

const closeRecordingModal = () => {
  if (isSavingRecording.value) {
    return
  }

  isRecordingModalOpen.value = false
  resetRecordingForm()
}

const handleAudioFile = event => {
  const file = event?.target?.files?.[0] || null
  selectedFile.value = file
  recordingFormError.value = ''

  if (!file) {
    return
  }

  if (!file.type.startsWith('audio/')) {
    recordingFormError.value =
      'Selecciona un archivo de audio válido.'
    selectedFile.value = null
    return
  }

  const maxSize = 100 * 1024 * 1024

  if (file.size > maxSize) {
    recordingFormError.value =
      'El archivo supera el límite de 100 MB.'
    selectedFile.value = null
  }
}

const handleReferenceFile = event => {
  const file = event?.target?.files?.[0] || null
  selectedReferenceFile.value = file
  recordingFormError.value = ''

  if (!file) {
    return
  }

  const isAudio = file.type.startsWith('audio/')
  const isMidi = /\.(mid|midi)$/i.test(file.name)

  if (!isAudio && !isMidi) {
    recordingFormError.value =
      'La referencia debe ser un archivo MIDI o de audio.'
    selectedReferenceFile.value = null
    return
  }

  const maxSize = 200 * 1024 * 1024

  if (file.size > maxSize) {
    recordingFormError.value =
      'La referencia supera el límite de 200 MB.'
    selectedReferenceFile.value = null
  }
}

const saveRecording = async () => {
  recordingFormError.value = ''

  if (!selectedFile.value) {
    recordingFormError.value =
      'Selecciona la grabación de la estudiante antes de continuar.'
    return
  }

  if (!selectedReferenceFile.value) {
    recordingFormError.value =
      'Selecciona la referencia MIDI o audio que AMV usará para comparar.'
    return
  }

  if (recordingForm.songType === 'cover' && !recordingForm.song.trim()) {
    recordingFormError.value =
      'Indica el nombre de la canción para una referencia de cover.'
    return
  }

  isSavingRecording.value = true

  try {
    await uploadVocalRecording({
      studentId: studentId.value,
      file: selectedFile.value,
      title: recordingForm.title,
      song: recordingForm.song,
      artist: recordingForm.artist,
      songType: recordingForm.songType,
      key: recordingForm.key,
      scale: recordingForm.scale,
      bpm: recordingForm.bpm,
      timeSignature: recordingForm.timeSignature,
      youtubeUrl: recordingForm.youtubeUrl,
      referenceFile: selectedReferenceFile.value,
      transpositionSemitones: recordingForm.transpositionSemitones,
      recordedAt: new Date().toISOString()
    })

    isRecordingModalOpen.value = false
    resetRecordingForm()

    await loadRecordings()
  } catch (error) {
    console.error(
      '[VozView] Error guardando grabación:',
      error
    )

    recordingFormError.value =
      error?.message ||
      'No fue posible guardar la grabación.'
  } finally {
    isSavingRecording.value = false
  }
}

/* =========================================================
   ANÁLISIS
========================================================= */

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms))

const waitForAnalysis = async recordingId => {
  // El análisis completo puede tardar varios minutos, especialmente
  // cuando la referencia es un tema completo y requiere separación Demucs.
  // 180 intentos x 4 s = hasta 12 minutos de espera activa en la UI.
  const maxAttempts = 180
  const pollIntervalMs = 4000

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    await sleep(pollIntervalMs)
    await loadRecordings()

    const current = recordings.value.find(
      recording => Number(recording.id) === Number(recordingId)
    )

    const status = current?.analysis?.status

    if (status === 'completed' || status === 'failed') {
      return current
    }
  }

  return recordings.value.find(
    recording => Number(recording.id) === Number(recordingId)
  ) || null
}

const analyzeRecording = async recording => {
  if (!recording?.id || analyzingId.value) {
    return
  }

  analyzingId.value = recording.id
  loadError.value = ''

  try {
    await requestVocalAnalysis(recording.id)
    await loadRecordings()
    await waitForAnalysis(recording.id)
  } catch (error) {
    console.error(
      '[VozView] Error solicitando análisis:',
      error
    )

    loadError.value =
      error?.message ||
      'No fue posible solicitar el análisis vocal.'
  } finally {
    analyzingId.value = null
  }
}

/* =========================================================
   ELIMINAR
========================================================= */

const removeRecording = async recording => {
  if (!recording?.id) {
    return
  }

  const confirmed = window.confirm(
    `¿Eliminar la grabación "${recording.title}"? Esta acción también eliminará su análisis asociado.`
  )

  if (!confirmed) {
    return
  }

  deletingId.value = recording.id
  loadError.value = ''

  try {
    await deleteVocalRecording(recording)
    await loadRecordings()
  } catch (error) {
    console.error(
      '[VozView] Error eliminando grabación:',
      error
    )

    loadError.value =
      error?.message ||
      'No fue posible eliminar la grabación.'
  } finally {
    deletingId.value = null
  }
}

/* =========================================================
   FORMATO
========================================================= */

const formatDate = value => {
  if (!value) {
    return 'Fecha no disponible'
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      dateStyle: 'medium',
      timeStyle: 'short'
    }
  ).format(date)
}

const formatFileSize = bytes => {
  const value = Number(bytes)

  if (!Number.isFinite(value) || value <= 0) {
    return 'Tamaño no disponible'
  }

  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(0)} KB`
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`
}

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(loadPage)

onBeforeUnmount(() => {
  recordings.value = []
})
</script>

<style scoped>
:global(*) {
  box-sizing: border-box;
}

.voice-page {
  min-height: 100%;
  padding: 32px 24px 64px;
  background:
    radial-gradient(circle at top right, rgba(87, 92, 255, 0.07), transparent 32%),
    #f6f7fb;
  color: #172033;
}

.voice-shell {
  width: min(1380px, 100%);
  margin: 0 auto;
}

.voice-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 28px;
}

.back-link {
  display: inline-flex;
  margin-bottom: 22px;
  color: #5e687b;
  font-size: 0.9rem;
  font-weight: 700;
  text-decoration: none;
}

.back-link:hover {
  color: #4f46e5;
}

.eyebrow,
.section-kicker {
  display: block;
  color: #64748b;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.voice-header h1 {
  margin: 6px 0 8px;
  color: #111827;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1.05;
  letter-spacing: -0.04em;
}

.voice-header p {
  max-width: 760px;
  margin: 0;
  color: #687386;
  font-size: 1rem;
  line-height: 1.65;
}

.primary-button,
.secondary-button,
.ghost-button,
.danger-button,
.close-button {
  border: 0;
  font: inherit;
  cursor: pointer;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease,
    background 160ms ease,
    color 160ms ease;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 46px;
  padding: 0 18px;
  border-radius: 13px;
  background: #4f46e5;
  color: #fff;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(79, 70, 229, 0.2);
}

.primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #4338ca;
}

.secondary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 42px;
  padding: 0 15px;
  border: 1px solid #d8deea;
  border-radius: 11px;
  background: #fff;
  color: #334155;
  font-weight: 800;
}

.secondary-button:hover:not(:disabled) {
  border-color: #b9c1d1;
  background: #f8fafc;
}

.ghost-button {
  padding: 8px 10px;
  border-radius: 9px;
  background: #eef2ff;
  color: #4338ca;
  font-size: 0.8rem;
  font-weight: 800;
}

.ghost-button:hover:not(:disabled) {
  background: #e0e7ff;
}

.danger-button {
  padding: 8px 10px;
  border-radius: 9px;
  background: #fff1f2;
  color: #be123c;
  font-size: 0.8rem;
  font-weight: 800;
}

.danger-button:hover:not(:disabled) {
  background: #ffe4e6;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

.loading-card,
.alert-card,
.ai-notice,
.panel,
.latest-card {
  border: 1px solid #e4e8f0;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 12px 38px rgba(31, 41, 55, 0.055);
}

.loading-card {
  display: flex;
  min-height: 240px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #64748b;
  text-align: center;
}

.loading-card strong {
  color: #1f2937;
}

.loading-spinner {
  width: 34px;
  height: 34px;
  margin-bottom: 8px;
  border: 3px solid #e0e7ff;
  border-top-color: #4f46e5;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.alert-card {
  padding: 24px;
}

.alert-card--error {
  border-color: #fecdd3;
  background: #fff7f8;
}

.alert-card strong {
  color: #9f1239;
}

.alert-card p {
  margin: 8px 0 16px;
  color: #64748b;
  line-height: 1.6;
}

.ai-notice {
  display: flex;
  gap: 14px;
  margin-bottom: 22px;
  padding: 18px 20px;
  border-color: #dbe4ff;
  background: linear-gradient(135deg, #f8faff, #f3f5ff);
}

.ai-notice__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 38px;
  place-items: center;
  border-radius: 12px;
  background: #e0e7ff;
  color: #4f46e5;
  font-weight: 900;
}

.ai-notice strong {
  color: #27327a;
}

.ai-notice p {
  margin: 4px 0 0;
  color: #59647a;
  font-size: 0.9rem;
  line-height: 1.55;
}

.panel {
  margin-bottom: 22px;
  padding: 26px;
}

.section-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 24px;
}

.section-heading h2,
.latest-card h2,
.recording-modal h2 {
  margin: 5px 0 7px;
  color: #111827;
  font-size: 1.55rem;
  letter-spacing: -0.025em;
}

.section-heading p,
.recording-modal__header p {
  max-width: 760px;
  margin: 0;
  color: #738095;
  font-size: 0.9rem;
  line-height: 1.55;
}

.profile-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
  color: #64748b;
  font-size: 0.78rem;
  font-weight: 700;
  text-align: right;
}

.profile-meta span {
  padding: 7px 10px;
  border-radius: 999px;
  background: #f1f5f9;
}

.count-badge {
  flex: 0 0 auto;
  padding: 8px 11px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.78rem;
  font-weight: 800;
}

.map-layout {
  display: grid;
  grid-template-columns: minmax(380px, 0.9fr) minmax(0, 1.1fr);
  gap: 28px;
  align-items: stretch;
}

.radar-card {
  display: flex;
  min-height: 600px;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #edf0f5;
  border-radius: 18px;
  background: linear-gradient(145deg, #fbfcff, #f7f8fc);
}

.radar {
  width: min(100%, 560px);
  height: auto;
  overflow: visible;
}

.radar-grid polygon,
.radar-grid line {
  fill: none;
  stroke: #dce2ed;
  stroke-width: 1;
}

.radar-area {
  fill: rgba(79, 70, 229, 0.14);
  stroke: #4f46e5;
  stroke-width: 3;
}

.radar-point {
  fill: #4f46e5;
  stroke: #fff;
  stroke-width: 3;
}

.radar-labels text {
  fill: #475569;
  font-size: 11px;
  font-weight: 800;
}

.radar-empty circle {
  fill: #e2e8f0;
}

.radar-empty text {
  fill: #94a3b8;
  font-size: 13px;
  font-weight: 800;
}

.dimension-list {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.dimension-card {
  min-width: 0;
  padding: 16px;
  border: 1px solid #e7ebf2;
  border-radius: 15px;
  background: #fff;
}

.dimension-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.dimension-card__top > div {
  display: flex;
  min-width: 0;
  gap: 9px;
}

.dimension-card__index {
  color: #a1aabb;
  font-size: 0.7rem;
  font-weight: 900;
}

.dimension-card h3 {
  margin: 0;
  color: #1f2937;
  font-size: 0.9rem;
  line-height: 1.3;
}

.dimension-status,
.analysis-pill {
  flex: 0 0 auto;
  padding: 5px 8px;
  border-radius: 999px;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.02em;
}

.dimension-status--reference,
.analysis-pill--completed {
  background: #ecfdf5;
  color: #047857;
}

.dimension-status--indicator {
  background: #eff6ff;
  color: #1d4ed8;
}

.dimension-status--descriptive {
  background: #f5f3ff;
  color: #6d28d9;
}

.dimension-status--pending,
.analysis-pill--pending {
  background: #f1f5f9;
  color: #64748b;
}

.analysis-pill--processing {
  background: #fff7ed;
  color: #c2410c;
}

.analysis-pill--failed {
  background: #fff1f2;
  color: #be123c;
}

.dimension-value {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin: 17px 0 7px;
}

.dimension-value strong {
  color: #111827;
  font-size: 1.55rem;
  letter-spacing: -0.03em;
}

.dimension-value span {
  color: #94a3b8;
  font-size: 0.68rem;
  font-weight: 700;
}

.dimension-card p {
  margin: 0;
  color: #7b8798;
  font-size: 0.75rem;
  line-height: 1.5;
}

.latest-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
  padding: 22px 24px;
  background: linear-gradient(135deg, #ffffff, #f8f9ff);
}

.latest-card__content h2 {
  margin-bottom: 3px;
}

.latest-card__content p {
  margin: 0 0 4px;
  color: #5f6b7d;
}

.latest-card__content small {
  color: #9aa4b4;
}

.latest-card__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
}

.latest-card audio,
.recording-card audio {
  max-width: 320px;
  height: 36px;
}

.empty-state {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px dashed #d8dee9;
  border-radius: 15px;
  background: #fbfcfe;
}

.empty-state__icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 13px;
  background: #eef2ff;
  color: #4f46e5;
  font-size: 1.2rem;
  font-weight: 900;
}

.empty-state h3 {
  margin: 0 0 4px;
  color: #1f2937;
  font-size: 0.95rem;
}

.empty-state p {
  margin: 0;
  color: #7b8798;
  font-size: 0.82rem;
  line-height: 1.5;
}

.empty-state .secondary-button {
  margin-left: auto;
}

.recording-list {
  display: grid;
  gap: 10px;
}

.recording-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px;
  border: 1px solid #e8ebf1;
  border-radius: 15px;
  background: #fff;
}

.recording-card__main {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 13px;
}

.recording-icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 42px;
  place-items: center;
  border-radius: 12px;
  background: #f1f5ff;
  color: #4f46e5;
  font-weight: 900;
}

.recording-card__title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.recording-card h3 {
  overflow: hidden;
  margin: 0;
  color: #1f2937;
  font-size: 0.92rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recording-card p {
  margin: 0 0 3px;
  color: #667286;
  font-size: 0.8rem;
}

.recording-card small {
  color: #a0a9b8;
  font-size: 0.7rem;
}

.recording-card__right {
  display: flex;
  flex: 0 0 auto;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  overflow: auto;
  place-items: center;
  padding: 24px;
  background: rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(5px);
}

.recording-modal {
  width: min(620px, 100%);
  padding: 24px;
  border: 1px solid #e4e8f0;
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.2);
}

.recording-modal__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 22px;
}

.close-button {
  display: grid;
  width: 36px;
  height: 36px;
  flex: 0 0 36px;
  place-items: center;
  border-radius: 10px;
  background: #f1f5f9;
  color: #64748b;
  font-size: 1.4rem;
}

.close-button:hover {
  background: #e2e8f0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field {
  display: grid;
  gap: 7px;
}

.field--full {
  grid-column: 1 / -1;
}

.field > span {
  color: #334155;
  font-size: 0.8rem;
  font-weight: 800;
}

.field input {
  width: 100%;
  min-height: 44px;
  padding: 0 12px;
  border: 1px solid #d9dfe9;
  border-radius: 11px;
  outline: none;
  background: #fff;
  color: #1f2937;
  font: inherit;
}

.field input:focus {
  border-color: #818cf8;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.field input[type='file'] {
  min-height: auto;
  padding: 10px;
  background: #f8fafc;
  cursor: pointer;
}

.field small {
  color: #94a3b8;
  font-size: 0.72rem;
  line-height: 1.4;
}

.recording-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
  color: #7a8495;
}

.recording-card__meta span {
  display: inline-flex;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.72rem;
  font-weight: 800;
}

.selected-file--reference {
  border-color: #c7d2fe;
  background: #eef2ff;
}

.selected-file {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 16px;
  padding: 12px;
  border: 1px solid #dbe4ff;
  border-radius: 12px;
  background: #f8faff;
  color: #4f46e5;
}

.selected-file > div {
  display: grid;
  min-width: 0;
}

.selected-file strong {
  overflow: hidden;
  color: #334155;
  font-size: 0.8rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.selected-file small {
  color: #94a3b8;
}

.form-error {
  margin-top: 14px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff1f2;
  color: #be123c;
  font-size: 0.78rem;
  line-height: 1.45;
}

.recording-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 24px;
  padding-top: 18px;
  border-top: 1px solid #edf0f4;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 180ms ease;
}

.modal-enter-active .recording-modal,
.modal-leave-active .recording-modal {
  transition: transform 180ms ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .recording-modal,
.modal-leave-to .recording-modal {
  transform: translateY(10px) scale(0.99);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .map-layout {
    grid-template-columns: 1fr;
  }

  .radar-card {
    min-height: 520px;
  }
}

@media (max-width: 760px) {
  .voice-page {
    padding: 22px 14px 44px;
  }

  .voice-header,
  .latest-card,
  .recording-card,
  .empty-state {
    align-items: stretch;
    flex-direction: column;
  }

  .voice-header .primary-button,
  .empty-state .secondary-button {
    width: 100%;
    margin-left: 0;
  }

  .panel {
    padding: 18px;
  }

  .section-heading {
    flex-direction: column;
  }

  .profile-meta {
    justify-content: flex-start;
    text-align: left;
  }

  .dimension-list {
    grid-template-columns: 1fr;
  }

  .radar-card {
    min-height: 420px;
  }

  .latest-card__actions,
  .recording-card__right {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .latest-card audio,
  .recording-card audio {
    width: 100%;
    max-width: none;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .field--full {
    grid-column: auto;
  }
}
</style>
