<template>
  <main class="amv-student-page">
    <header class="hero">
      <div class="hero-copy">
        <span class="eyebrow"><i></i> AMO MI VOZ · AMV VOCAL ENGINE</span>
        <h1>Mis audiciones<span>Mi evolución vocal</span></h1>
        <p>Escucha tus interpretaciones y revisa los resultados de cada análisis en un solo lugar.</p>
        <div class="hero-tags">
          <span><icon aria-hidden="true">♫</icon> Mi historial</span>
          <span><icon aria-hidden="true">◉</icon> Evidencia acústica</span>
          <span><icon aria-hidden="true">↗</icon> Progreso pedagógico</span>
        </div>
      </div>
      <div class="hero-mark" aria-hidden="true"><span>AMV</span><small>VOCAL ENGINE</small></div>
    </header>

    <div v-if="loading" class="state-card"><span class="spinner"></span><div><strong>Preparando tus audiciones</strong><p>Estamos buscando tus grabaciones y resultados.</p></div></div>
    <div v-else-if="error" class="state-card state-card--error" role="alert"><strong>No pudimos cargar tus audiciones</strong><p>{{ error }}</p><button class="button button--secondary" @click="loadStudentAuditions">Reintentar</button></div>

    <template v-else>
      <section class="section-intro">
        <div><span class="section-label">TU ESPACIO VOCAL</span><h2>Elige una audición</h2><p>Selecciona una grabación para escucharla y consultar su análisis. Cada resultado corresponde únicamente a esa interpretación.</p></div>
        <span class="count-pill">{{ recordings.length }} {{ recordings.length === 1 ? 'audición' : 'audiciones' }}</span>
      </section>

      <section v-if="recordings.length" class="audition-layout">
        <aside class="history panel">
          <div class="panel-heading"><div><span class="section-label">HISTORIAL</span><h3>Mis grabaciones</h3></div><button class="icon-button" aria-label="Actualizar historial" title="Actualizar" @click="loadStudentAuditions">↻</button></div>
          <button v-for="recording in recordings" :key="recording.id" class="recording-option" :class="{ 'is-active': String(recording.id) === String(activeRecordingId) }" @click="selectRecording(recording)">
            <span class="recording-icon">♫</span>
            <span class="recording-copy"><strong>{{ recording.title || recording.song || 'Audición vocal' }}</strong><small>{{ recording.song || 'Canción sin título' }}<template v-if="recording.artist"> · {{ recording.artist }}</template></small><small>{{ formatDate(recording.recordedAt || recording.createdAt) }}</small></span>
            <span class="status-dot" :class="{ 'is-done': isCompleted(recording) }" :title="isCompleted(recording) ? 'Análisis completado' : 'Análisis pendiente'"></span>
          </button>
          <p class="history-note"><span class="legend-dot is-done"></span> Análisis completado <span class="legend-dot"></span> Pendiente o en proceso</p>
        </aside>

        <div v-if="activeRecording" class="results-column">
          <section class="selected-heading">
            <div><span class="section-label">AUDICIÓN SELECCIONADA</span><h2>{{ activeRecording.title || activeRecording.song || 'Mi audición' }}</h2><p>{{ activeRecording.song || 'Canción no indicada' }}<template v-if="activeRecording.artist"> · {{ activeRecording.artist }}</template></p></div>
            <span class="status-pill" :class="{ 'is-done': isCompleted(activeRecording) }"><i></i>{{ isCompleted(activeRecording) ? 'Análisis completado' : 'Análisis pendiente' }}</span>
          </section>

          <section class="panel audio-panel">
            <div class="audio-art"><span>♫</span><small>MI VOZ</small></div>
            <div class="audio-content">
              <span class="section-label">ESCUCHA TU INTERPRETACIÓN</span>
              <h3>{{ activeRecording.song || activeRecording.title || 'Grabación vocal' }}</h3>
              <p>{{ activeRecording.artist ? `Referencia: ${activeRecording.artist}` : 'Escucha con atención y piensa en lo que quieres mejorar.' }}</p>
              <div v-if="audioLoading" class="audio-message">Preparando reproductor seguro…</div>
              <audio v-else-if="audioUrl" :key="audioUrl" :src="audioUrl" controls preload="metadata">Tu navegador no puede reproducir este audio.</audio>
              <div v-else class="audio-message audio-message--error">{{ audioError || 'No se pudo generar el enlace temporal para reproducir esta grabación.' }}</div>
            </div>
          </section>

          <section class="panel result-panel">
            <div class="panel-heading result-heading"><div><span class="section-label">RESULTADO AMV</span><h3>Lo que observamos en esta interpretación</h3><p>Los indicadores describen esta grabación; no son un diagnóstico ni una clasificación vocal permanente.</p></div><span class="amv-badge">AMV</span></div>

            <div v-if="!isCompleted(activeRecording)" class="pending-result"><span class="pending-symbol">◷</span><div><strong>Tu análisis todavía no está disponible</strong><p>Cuando AMV termine el procesamiento, actualiza el historial para consultar tus resultados.</p></div><button class="button button--secondary" @click="loadStudentAuditions">Actualizar</button></div>

            <template v-else>
              <div class="metric-grid">
                <article class="metric-card"><span>RANGO OBSERVADO</span><strong>{{ studentSummary.observed_range || '—' }}</strong><small>Notas detectadas en esta toma</small></article>
                <article class="metric-card"><span>TESITURA OBSERVADA</span><strong>{{ studentSummary.observed_tessitura || '—' }}</strong><small>Zona central de la interpretación</small></article>
                <article class="metric-card"><span>AFINACIÓN</span><strong>{{ formatMetric(studentSummary.intonation_score) }}</strong><small>Comparación con la referencia, si está disponible</small></article>
                <article class="metric-card"><span>RITMO</span><strong>{{ formatMetric(studentSummary.rhythm_score) }}</strong><small>Correspondencia temporal, si está disponible</small></article>
              </div>

              <section class="radar-panel" aria-labelledby="student-radar-title">
                <div class="radar-heading">
                  <div>
                    <span class="section-label">AMV PROFILE</span>
                    <h3 id="student-radar-title">Radar de indicadores vocales</h3>
                    <p>Una vista técnica de las mediciones cuantificadas en esta audición. No representa una nota global ni una clasificación de voz.</p>
                  </div>
                  <span class="radar-count">{{ radarMetrics.length }} indicadores</span>
                </div>
                <div v-if="radarMetrics.length >= 3" class="radar-layout">
                  <div class="radar-visual">
                    <svg viewBox="0 0 360 330" role="img" aria-label="Radar de afinación, ritmo y estabilidad vocal, expresado sobre 100">
                      <g class="radar-grid">
                        <polygon points="180,40 301,250 59,250" />
                        <polygon points="180,68 277,236 83,236" />
                        <polygon points="180,96 253,222 107,222" />
                        <polygon points="180,124 229,208 131,208" />
                        <line x1="180" y1="180" x2="180" y2="40" />
                        <line x1="180" y1="180" x2="301" y2="250" />
                        <line x1="180" y1="180" x2="59" y2="250" />
                      </g>
                      <polygon class="radar-area" :points="studentRadarPoints" />
                      <g class="radar-markers">
                        <circle v-for="point in studentRadarDots" :key="point.key" :cx="point.x" :cy="point.y" r="5" />
                      </g>
                      <text x="180" y="23" text-anchor="middle">{{ radarMetrics[0].label.toUpperCase() }}</text>
                      <text x="311" y="269" text-anchor="end">{{ radarMetrics[1].label.toUpperCase() }}</text>
                      <text x="49" y="269" text-anchor="start">{{ radarMetrics[2].label.toUpperCase() }}</text>
                      <text x="180" y="305" text-anchor="middle" class="radar-scale-note">ESCALA NORMALIZADA 0–100</text>
                    </svg>
                  </div>
                  <div class="radar-indicators">
                    <article v-for="metric in radarMetrics" :key="metric.key" class="radar-indicator">
                      <div><span>{{ metric.label }}</span><strong>{{ metric.value.toFixed(1) }}<small>/100</small></strong></div>
                      <div class="radar-track"><i :style="{ width: `${Math.max(0, Math.min(100, metric.value))}%` }"></i></div>
                      <p>{{ metric.description }}</p>
                    </article>
                    <p class="radar-method-note">Estos valores describen señales de esta grabación. La calidad de comparación y la calidad acústica se mantienen fuera del radar porque describen la medición, no el desempeño vocal.</p>
                  </div>
                </div>
                <div v-else class="radar-unavailable">
                  <span>◌</span>
                  <div><strong>El radar necesita más indicadores disponibles</strong><p>AMV solo dibujará el perfil cuando existan al menos tres mediciones numéricas válidas. Así evitamos rellenar datos faltantes o sugerir una precisión que el análisis no ofrece.</p></div>
                </div>
              </section>

              <section class="teacher-report panel-subsection">
                <div class="subsection-heading"><div><span class="section-label">EVALUACIÓN DOCENTE</span><h3>La valoración de tu profesor</h3><p>La pauta docente complementa las mediciones automáticas de AMV.</p></div><span v-if="teacherEvaluation" class="teacher-average">{{ teacherAverage }}<small>/10</small></span></div>
                <div v-if="teacherEvaluationLoading" class="teacher-state">Cargando evaluación docente…</div>
                <div v-else-if="teacherEvaluationError" class="teacher-state teacher-state--error">{{ teacherEvaluationError }}</div>
                <div v-else-if="teacherEvaluation" class="teacher-report-content">
                  <div class="teacher-score-grid">
                    <article v-for="dimension in teacherDimensions" :key="dimension.key" class="teacher-score">
                      <div><strong>{{ dimension.label }}</strong><span>{{ teacherScore(dimension.key) !== null ? `${teacherScore(dimension.key)}/10` : 'Sin puntuar' }}</span></div>
                      <div class="teacher-score-track"><i :style="{ width: `${(teacherScore(dimension.key) || 0) * 10}%` }"></i></div>
                    </article>
                  </div>

                  <section class="teacher-radar-panel" aria-labelledby="teacher-radar-title">
                    <div class="teacher-radar-heading">
                      <div>
                        <span class="section-label">PERFIL PEDAGÓGICO</span>
                        <h4 id="teacher-radar-title">Radar de las ocho dimensiones vocales</h4>
                        <p>Visualiza la pauta de tu profesor en una escala de 1 a 10. Este radar representa la evaluación docente, no las mediciones automáticas de AMV.</p>
                      </div>
                      <span class="teacher-radar-badge">{{ teacherScoredDimensions }}/8 dimensiones</span>
                    </div>
                    <div v-if="teacherScoredDimensions >= 3" class="teacher-radar-layout">
                      <div class="teacher-radar-visual">
                        <svg viewBox="0 0 460 430" role="img" aria-label="Radar de ocho dimensiones de evaluación docente en escala de uno a diez">
                          <g class="teacher-radar-grid">
                            <polygon v-for="level in [2,4,6,8,10]" :key="'teacher-grid-'+level" :points="teacherRadarGrid(level)" />
                            <line v-for="(dimension,index) in teacherDimensions" :key="'teacher-axis-'+dimension.key" x1="230" y1="200" :x2="teacherRadarPoint(index,10).x" :y2="teacherRadarPoint(index,10).y" />
                          </g>
                          <polygon v-if="teacherScoredDimensions === 8" class="teacher-radar-area" :points="teacherRadarPolygon" />
                          <g class="teacher-radar-points">
                            <circle v-for="point in teacherRadarDots" :key="point.key" :cx="point.x" :cy="point.y" r="5" />
                          </g>
                          <g class="teacher-radar-labels">
                            <text v-for="(dimension,index) in teacherDimensions" :key="'teacher-label-'+dimension.key" :x="teacherRadarLabel(index).x" :y="teacherRadarLabel(index).y" :text-anchor="teacherRadarLabel(index).anchor">{{ teacherRadarShortLabel(dimension.label) }}</text>
                          </g>
                          <text x="230" y="414" text-anchor="middle" class="teacher-radar-scale">ESCALA DOCENTE · 1–10</text>
                        </svg>
                      </div>
                      <div class="teacher-radar-legend">
                        <article v-for="dimension in teacherDimensions" :key="'legend-'+dimension.key">
                          <span>{{ dimension.label }}</span>
                          <strong>{{ teacherScore(dimension.key) !== null ? `${teacherScore(dimension.key)}/10` : '—' }}</strong>
                          <div><i :style="{ width: `${(teacherScore(dimension.key) || 0) * 10}%` }"></i></div>
                        </article>
                      </div>
                    </div>
                    <div v-else class="teacher-radar-empty">
                      Todavía no hay suficientes puntuaciones docentes para construir el radar. Se necesitan al menos tres dimensiones calificadas.
                    </div>
                  </section>

                  <div class="teacher-comments-grid">
                    <article v-if="teacherEvaluation.strengths"><span class="section-label">FORTALEZAS OBSERVADAS</span><p>{{ teacherEvaluation.strengths }}</p></article>
                    <article v-if="teacherEvaluation.priorities"><span class="section-label">PRIORIDADES DE MEJORA</span><p>{{ teacherEvaluation.priorities }}</p></article>
                    <article v-if="teacherEvaluation.observations" class="teacher-comment-wide"><span class="section-label">COMENTARIOS DEL PROFESOR</span><p>{{ teacherEvaluation.observations }}</p></article>
                    <article v-if="teacherEvaluation.exercise_plan" class="teacher-comment-wide"><span class="section-label">PLAN DE EJERCICIOS</span><p>{{ teacherEvaluation.exercise_plan }}</p></article>
                  </div>
                  <p v-if="teacherEvaluation.updated_at" class="teacher-updated">Evaluación actualizada el {{ formatDate(teacherEvaluation.updated_at) }}</p>
                </div>
                <div v-else class="teacher-state">Tu profesor todavía no ha guardado una pauta docente para esta audición. Cuando la complete, sus puntuaciones y comentarios aparecerán aquí.</div>
              </section>

              <div class="learning-grid">
                <article class="learning-card learning-card--strength"><div class="learning-icon">✦</div><span class="section-label">FORTALEZAS</span><h3>Lo que estás construyendo</h3><ul v-if="studentSummary.strengths.length"><li v-for="(item, i) in studentSummary.strengths" :key="i">{{ item }}</li></ul><p v-else class="muted">El resumen de esta evaluación no incluye fortalezas específicas para mostrar.</p></article>
                <article class="learning-card learning-card--focus"><div class="learning-icon">◎</div><span class="section-label">PRÓXIMO OBJETIVO</span><h3>Qué puedes trabajar</h3><ul v-if="studentSummary.priority_areas.length"><li v-for="(item, i) in studentSummary.priority_areas" :key="i">{{ item }}</li></ul><p v-else class="muted">No se registraron prioridades específicas en el resumen de esta evaluación.</p></article>
              </div>

              <section v-if="studentSummary.practice_suggestions.length" class="practice-panel"><span class="section-label">PLAN DE PRÁCTICA</span><h3>Ideas para tu próxima práctica</h3><ol><li v-for="(item, i) in studentSummary.practice_suggestions" :key="i"><span>{{ String(i + 1).padStart(2, '0') }}</span><p>{{ item }}</p></li></ol></section>
              <details class="technical-details"><summary>Ver detalle técnico del análisis AMV</summary><p v-if="studentSummary.measurement_note" class="measurement-note">{{ studentSummary.measurement_note }}</p><pre>{{ JSON.stringify(technicalResult, null, 2) }}</pre></details>
              <div class="report-actions"><p>Guarda una copia de este informe con los resultados AMV y la evaluación docente disponible.</p><button class="button button--primary" type="button" @click="downloadReportPdf">↓ Descargar informe PDF</button></div>
            </template>
          </section>
        </div>
      </section>

      <section v-else class="empty-state panel"><div class="empty-note">♫</div><span class="section-label">TU HISTORIAL AMV</span><h2>Aún no hay audiciones disponibles</h2><p>Cuando tu profesor registre una audición y esté vinculada a tu cuenta, aparecerá aquí para que puedas escucharla y revisar sus resultados.</p></section>
    </template>

    <footer class="page-footer"><span>AMO MI VOZ</span><i></i><span>AMV VOCAL INTELLIGENCE</span></footer>
  </main>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { supabase } from '@/lib/supabase'
import { fetchVocalRecordings, createVocalRecordingSignedUrl } from '@/services/vocalIntelligenceService'

const loading = ref(true)
const error = ref('')
const studentId = ref(null)
const studentDisplayName = ref('')
const studentVoiceType = ref('')
const recordings = ref([])
const activeRecordingId = ref(null)
const audioUrl = ref('')
const audioLoading = ref(false)
const audioError = ref('')
const teacherEvaluation = ref(null)
const teacherEvaluationLoading = ref(false)
const teacherEvaluationError = ref('')
const teacherDimensions = [
  { key: 'intonation', label: 'Afinación' },
  { key: 'rhythm', label: 'Ritmo y precisión' },
  { key: 'air', label: 'Aire y fraseo' },
  { key: 'phonation', label: 'Fonación y emisión' },
  { key: 'register', label: 'Registro y transiciones' },
  { key: 'resonance', label: 'Resonancia y timbre' },
  { key: 'diction', label: 'Dicción y articulación' },
  { key: 'expression', label: 'Expresión y musicalidad' },
]

const activeRecording = computed(() =>
  recordings.value.find(item => String(item.id) === String(activeRecordingId.value)) || null
)

const rawAnalysis = computed(() => activeRecording.value?.analysis || null)

function parseObject(value) {
  if (!value) return {}
  if (typeof value === 'object' && !Array.isArray(value)) return value
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return parsed && typeof parsed === 'object' ? parsed : {}
    } catch { return {} }
  }
  return {}
}

const technicalResult = computed(() => {
  const analysis = rawAnalysis.value || {}
  const summary = parseObject(analysis.summary)
  const worker = parseObject(analysis.workerResult || analysis.worker_result)
  return Object.keys(worker).length ? worker : (Object.keys(summary).length ? summary : analysis)
})

const studentSummary = computed(() => {
  const analysis = rawAnalysis.value || {}
  const root = technicalResult.value
  const summary = parseObject(root.summary || analysis.summary)
  const candidates = [
    root.student_facing,
    root.pedagogical_summary_v321?.student_facing,
    root.pedagogical_summary?.student_facing,
    summary.student_facing,
    summary.pedagogical_summary_v321?.student_facing,
    summary.pedagogical_summary?.student_facing,
    root,
  ]
  const data = candidates.find(item => item && typeof item === 'object' && (
    item.strengths || item.priority_areas || item.practice_suggestions ||
    item.observed_range || item.observed_tessitura || item.intonation_score !== undefined
  )) || {}
  const list = value => Array.isArray(value) ? value.map(item => typeof item === 'string' ? item : item?.text || item?.label || '').filter(Boolean) : typeof value === 'string' && value.trim() ? [value.trim()] : []
  return {
    observed_range: data.observed_range || data.range || root.observed_pitch?.range || '',
    observed_tessitura: data.observed_tessitura || data.tessitura || '',
    intonation_score: firstNumeric(
      data.intonation_score, data.intonation_score_0_100, data.intonation?.score_0_100,
      root.intonation_score, root.intonation_score_0_100,
      root.pedagogical_dimensions?.intonation?.score_0_100,
      root.comparison?.intonation_score_0_100, root.comparison?.intonation?.score_0_100,
      findMetric(root, ['intonation_score_0_100', 'intonation_score'])
    ),
    rhythm_score: firstNumeric(
      data.rhythm_score, data.rhythm_score_0_100, data.rhythm?.score_0_100,
      root.rhythm_score, root.rhythm_score_0_100,
      root.pedagogical_dimensions?.rhythm?.score_0_100,
      root.comparison?.rhythm_score_0_100, root.comparison?.rhythm?.score_0_100,
      findMetric(root, ['rhythm_score_0_100', 'rhythm_score'])
    ),
    stability_score: firstNumeric(
      data.stability_score_0_100, data.stability_score, data.pitch_stability_score_0_100,
      root.stability_score_0_100, root.stability_index_0_100, root.pitch_stability_score_0_100,
      root.pedagogical_dimensions?.stability?.score_0_100,
      root.stability?.score_0_100, root.pitch_stability?.score_0_100,
      findMetric(root, ['stability_score_0_100', 'stability_index_0_100', 'pitch_stability_score_0_100'])
    ),
    strengths: list(data.strengths || analysis.strengths),
    priority_areas: list(data.priority_areas || data.priorities || analysis.priorities),
    practice_suggestions: list(data.practice_suggestions || data.suggestions),
    measurement_note: data.measurement_note || data.note || root.measurement_quality?.note || '',
  }
})

const radarMetrics = computed(() => {
  const summary = studentSummary.value
  const candidates = [
    { key: 'intonation', label: 'Afinación', value: summary.intonation_score, description: 'Correspondencia tonal con la referencia, si está disponible.' },
    { key: 'rhythm', label: 'Ritmo', value: summary.rhythm_score, description: 'Correspondencia temporal y coordinación rítmica.' },
    { key: 'stability', label: 'Estabilidad', value: summary.stability_score, description: 'Estabilidad de la señal vocal durante los eventos analizados.' },
  ]
  return candidates.filter(item => item.value !== null && item.value !== undefined && Number.isFinite(Number(item.value)) && Number(item.value) >= 0 && Number(item.value) <= 100).map(item => ({ ...item, value: Number(item.value) }))
})

function radarPoint(index, value) {
  const center = { x: 180, y: 180 }
  const vertices = [{ x: 180, y: 40 }, { x: 301, y: 250 }, { x: 59, y: 250 }]
  const vertex = vertices[index]
  const scale = Math.max(0, Math.min(100, Number(value))) / 100
  return { x: center.x + (vertex.x - center.x) * scale, y: center.y + (vertex.y - center.y) * scale }
}

const studentRadarPoints = computed(() => radarMetrics.value.map((metric, index) => {
  const point = radarPoint(index, metric.value)
  return `${point.x},${point.y}`
}).join(' '))

const studentRadarDots = computed(() => radarMetrics.value.map((metric, index) => ({ key: metric.key, ...radarPoint(index, metric.value) })))

function firstNumeric(...values) {
  for (const value of values) {
    if (value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value))) return Number(value)
  }
  return null
}

function findMetric(object, keys, depth = 0) {
  if (!object || typeof object !== 'object' || depth > 7) return null
  for (const key of keys) {
    const value = object[key]
    if (value !== null && value !== undefined && value !== '' && Number.isFinite(Number(value))) return Number(value)
  }
  for (const [key, value] of Object.entries(object)) {
    if (value && typeof value === 'object') {
      const found = findMetric(value, keys, depth + 1)
      if (found !== null) return found
    }
  }
  return null
}

function isCompleted(recording) {
  const status = String(recording?.analysis?.status || '').toLowerCase()
  return ['completed', 'complete', 'success', 'usable_for_comparison'].includes(status)
}

function formatMetric(value) {
  if (value === null || value === undefined || value === '') return '—'
  const number = Number(value)
  return Number.isFinite(number) ? `${number.toFixed(1)}${number <= 1 && number >= 0 ? '' : ''}` : String(value)
}

function formatDate(value) {
  if (!value) return 'Fecha sin registrar'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'Fecha sin registrar' : new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(date)
}

async function loadTeacherEvaluation(recordingId) {
  teacherEvaluationLoading.value = true
  teacherEvaluationError.value = ''
  try {
    // The student can only request the evaluation for the currently selected recording.
    // Supabase RLS must permit SELECT for the owner of that student recording.
    const { data, error: queryError } = await supabase
      .from('vocal_teacher_evaluations')
      .select('recording_id, scores, observations, strengths, priorities, exercise_plan, created_at, updated_at')
      .eq('recording_id', Number(recordingId))
      .maybeSingle()
    if (queryError) throw queryError
    teacherEvaluation.value = data || null
  } catch (e) {
    console.warn('[Mis evaluaciones AMV] No se pudo cargar la pauta docente:', e)
    teacherEvaluationError.value = 'No fue posible consultar la evaluación docente. Si ya fue guardada, hay que revisar la política RLS de lectura para el alumno.'
  } finally {
    teacherEvaluationLoading.value = false
  }
}

const teacherAverage = computed(() => {
  if (!teacherEvaluation.value?.scores) return '—'
  const values = teacherDimensions.map(d => Number(teacherEvaluation.value.scores[d.key])).filter(n => Number.isFinite(n) && n >= 1 && n <= 10)
  return values.length ? (values.reduce((sum, n) => sum + n, 0) / values.length).toFixed(1) : '—'
})

function teacherScore(key) {
  const value = teacherEvaluation.value?.scores?.[key]
  const number = Number(value)
  return value !== null && value !== undefined && value !== '' && Number.isFinite(number) && number >= 1 && number <= 10 ? number : null
}

const teacherScoredDimensions = computed(() =>
  teacherDimensions.filter(dimension => teacherScore(dimension.key) !== null).length
)

function teacherRadarPoint(index, score) {
  const center = { x: 230, y: 200 }
  const radius = 132
  const angle = (-Math.PI / 2) + (index * 2 * Math.PI / teacherDimensions.length)
  const scale = Math.max(0, Math.min(10, Number(score))) / 10
  return {
    x: center.x + Math.cos(angle) * radius * scale,
    y: center.y + Math.sin(angle) * radius * scale,
  }
}

function teacherRadarGrid(level) {
  return teacherDimensions.map((_, index) => {
    const point = teacherRadarPoint(index, level)
    return `${point.x},${point.y}`
  }).join(' ')
}

const teacherRadarPolygon = computed(() =>
  teacherDimensions.map((dimension, index) => {
    const point = teacherRadarPoint(index, teacherScore(dimension.key) || 0)
    return `${point.x},${point.y}`
  }).join(' ')
)

const teacherRadarDots = computed(() =>
  teacherDimensions
    .map((dimension, index) => {
      const score = teacherScore(dimension.key)
      if (score === null) return null
      return { key: dimension.key, ...teacherRadarPoint(index, score) }
    })
    .filter(Boolean)
)

function teacherRadarLabel(index) {
  const center = { x: 230, y: 200 }
  const radius = 166
  const angle = (-Math.PI / 2) + (index * 2 * Math.PI / teacherDimensions.length)
  const x = center.x + Math.cos(angle) * radius
  const y = center.y + Math.sin(angle) * radius
  const cos = Math.cos(angle)
  return {
    x,
    y,
    anchor: cos > 0.35 ? 'start' : cos < -0.35 ? 'end' : 'middle',
  }
}

function teacherRadarShortLabel(label) {
  const labels = {
    'Afinación': 'AFINACIÓN',
    'Ritmo y precisión': 'RITMO',
    'Aire y fraseo': 'AIRE Y FRASEO',
    'Fonación y emisión': 'EMISIÓN',
    'Registro y transiciones': 'REGISTRO',
    'Resonancia y timbre': 'RESONANCIA',
    'Dicción y articulación': 'DICCIÓN',
    'Expresión y musicalidad': 'EXPRESIÓN',
  }
  return labels[label] || label.toUpperCase()
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character])
}

function downloadReportPdf() {
  if (!activeRecording.value) {
    error.value = 'Selecciona una audición antes de exportar el informe.'
    return
  }

  const recording = activeRecording.value
  const studentName = studentDisplayName.value || 'Mi informe vocal'
  const songName = recording.song || recording.title || 'Audición vocal'
  const voiceType = studentVoiceType.value || 'Clasificación vocal no registrada'
  const dateLabel = formatDate(recording.recordedAt || recording.createdAt || recording.recorded_at || recording.created_at)
  const esc = escapeHtml
  const logoUrl = `${window.location.origin}/amo-mi-voz-logo.png`
  const teacher = teacherEvaluation.value || {}
  const average = teacherAverage.value === '—' ? 'Pendiente' : `${teacherAverage.value}/10`
  const scoreRows = teacherDimensions.map(dimension => {
    const score = teacherScore(dimension.key)
    const safeScore = score === null ? 0 : Math.max(0, Math.min(10, score))
    return `<article class="score-card"><div class="score-line"><span>${esc(dimension.label)}</span><strong>${score === null ? '—' : `${score}/10`}</strong></div><div class="track"><i style="width:${safeScore * 10}%"></i></div></article>`
  }).join('')
  const acousticValues = [
    ['Rango observado', studentSummary.value.observed_range || '—'],
    ['Tesitura observada', studentSummary.value.observed_tessitura || '—'],
    ['Afinación automática', formatMetric(studentSummary.value.intonation_score)],
    ['Correspondencia rítmica', formatMetric(studentSummary.value.rhythm_score)],
  ]
  const acousticRows = acousticValues.map(([label, value]) => `<div class="metric"><span>${esc(label)}</span><strong>${esc(value)}</strong></div>`).join('')
  const listHtml = items => items?.length
    ? `<ul>${items.slice(0, 3).map(item => `<li>${esc(item)}</li>`).join('')}</ul>`
    : '<p class="muted">Esta sección se completará cuando el profesor registre observaciones específicas.</p>'

  const makeRadar = (dimensions, getScore, { max = 10, size = 360, center = 180, radius = 112, labelRadius = 148, title = 'Radar de evaluación' } = {}) => {
    const angleFor = index => -Math.PI / 2 + index * 2 * Math.PI / dimensions.length
    const point = (index, value, r = radius) => {
      const scaled = Math.max(0, Math.min(max, Number(value) || 0)) / max * r
      return { x: center + Math.cos(angleFor(index)) * scaled, y: center + Math.sin(angleFor(index)) * scaled }
    }
    const gridLevels = max === 100 ? [20, 40, 60, 80, 100] : [2, 4, 6, 8, 10]
    const grid = gridLevels.filter(level => level <= max).map(level => {
      const points = dimensions.map((_, i) => {
        const p = point(i, level, radius)
        return `${p.x},${p.y}`
      }).join(' ')
      return `<polygon points="${points}"/>`
    }).join('')
    const axes = dimensions.map((_, i) => {
      const p = point(i, max, radius)
      return `<line x1="${center}" y1="${center}" x2="${p.x}" y2="${p.y}"/>`
    }).join('')
    const values = dimensions.map((dimension, i) => {
      const score = getScore(dimension)
      return score === null || score === undefined ? null : { dimension, score: Number(score), point: point(i, score) }
    })
    const polygon = values.every(Boolean)
      ? `<polygon class="radar-area" points="${values.map(item => `${item.point.x},${item.point.y}`).join(' ')}"/>`
      : ''
    const dots = values.filter(Boolean).map(item => `<circle cx="${item.point.x}" cy="${item.point.y}" r="4"/>`).join('')
    const labels = dimensions.map((dimension, i) => {
      const x = center + Math.cos(angleFor(i)) * labelRadius
      const y = center + Math.sin(angleFor(i)) * labelRadius
      const anchor = Math.cos(angleFor(i)) > .35 ? 'start' : Math.cos(angleFor(i)) < -.35 ? 'end' : 'middle'
      const short = dimension.short || dimension.label
      return `<text x="${x}" y="${y}" text-anchor="${anchor}">${esc(short.toUpperCase())}</text>`
    }).join('')
    return `<svg class="report-radar" viewBox="0 0 ${size} ${size}" role="img" aria-label="${esc(title)}"><g class="radar-grid">${grid}${axes}</g>${polygon}<g class="radar-dots">${dots}</g><g class="radar-labels">${labels}</g><text class="radar-scale" x="${center}" y="${size - 8}" text-anchor="middle">ESCALA 0–${max}</text></svg>`
  }

  const teacherRadar = teacherScoredDimensions.value >= 3
    ? makeRadar(teacherDimensions.map(d => ({ ...d, short: ({ 'Ritmo y precisión': 'RITMO', 'Aire y fraseo': 'AIRE', 'Fonación y emisión': 'EMISIÓN', 'Registro y transiciones': 'REGISTRO', 'Resonancia y timbre': 'TIMBRE', 'Dicción y articulación': 'DICCIÓN', 'Expresión y musicalidad': 'EXPRESIÓN' })[d.label] || d.label })), d => teacherScore(d.key), { max: 10, title: 'Radar de evaluación docente' })
    : '<p class="muted">El radar docente aparecerá cuando existan al menos tres dimensiones puntuadas.</p>'

  const acousticRadar = radarMetrics.value.length >= 3
    ? makeRadar(radarMetrics.value.map(d => ({ ...d, short: d.label })), d => d.value, { max: 100, title: 'Radar de indicadores acústicos' })
    : '<p class="muted">No hay suficientes mediciones acústicas válidas para construir un radar en esta audición.</p>'

  const practiceItems = (teacher.exercise_plan || '').trim()
    ? `<div class="teacher-note">${esc(teacher.exercise_plan)}</div>`
    : listHtml(studentSummary.value.practice_suggestions)
  const hasPractice = Boolean((teacher.exercise_plan || '').trim() || studentSummary.value.practice_suggestions.length)
  const strengthsContent = teacher.strengths?.trim() ? `<p>${esc(teacher.strengths)}</p>` : listHtml(studentSummary.value.strengths)
  const prioritiesContent = teacher.priorities?.trim() ? `<p>${esc(teacher.priorities)}</p>` : listHtml(studentSummary.value.priority_areas)

  const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Informe vocal · ${esc(studentName)}</title><style>
  @page{size:A4;margin:11mm 13mm 13mm}*{box-sizing:border-box}html{color:#242332;background:#fff}body{margin:0;font:9.2pt/1.42 'Aptos','Segoe UI',Arial,sans-serif;color:#30313c;-webkit-print-color-adjust:exact;print-color-adjust:exact}h1,h2,h3,p{margin-top:0}h1,h2,h3{line-height:1.18}h1{font-size:29pt;letter-spacing:-1px;margin:19mm 0 4mm;color:#fff}h2{font-size:17pt;color:#252437;margin:0 0 3mm}h3{font-size:10.5pt;color:#92123d;margin:0 0 2mm}.cover{height:270mm;position:relative;overflow:hidden;padding:15mm;background:linear-gradient(145deg,#17131b 0%,#351321 50%,#8f1038 100%);color:#fff;page-break-after:always;break-after:page;display:flex;flex-direction:column;justify-content:space-between}.cover:before{content:'';position:absolute;width:170mm;height:170mm;border:1px solid #ffffff25;border-radius:50%;right:-65mm;top:-45mm}.cover:after{content:'';position:absolute;width:115mm;height:115mm;border:1px solid #e2b54b55;border-radius:50%;right:-30mm;top:-12mm}.cover-top,.cover-main,.cover-bottom{position:relative;z-index:1}.brand{display:flex;align-items:center;gap:7mm}.brand img{width:42mm;max-height:31mm;object-fit:contain;object-position:left center}.brand-copy{font-size:7.5pt;letter-spacing:1.5px;text-transform:uppercase;color:#f2dce4}.brand-copy strong{display:block;color:#e9bd57;font-size:8.5pt;margin-bottom:2mm}.cover-kicker{font-size:8pt;letter-spacing:2.5px;color:#f1c75f;font-weight:800;text-transform:uppercase}.cover h1 span{display:block;color:#f2c65c}.cover-subtitle{font-size:12pt;max-width:125mm;color:#f4e9ed}.cover-rule{width:35mm;height:2px;background:#e7bb51;margin:8mm 0}.cover-identity{margin-top:12mm;padding:7mm;border:1px solid #ffffff35;background:#ffffff0b;border-radius:4mm}.cover-identity small{display:block;color:#f0c45c;font-size:7pt;letter-spacing:2px;text-transform:uppercase;margin-bottom:2mm}.cover-identity strong{display:block;font-size:18pt;color:white;overflow-wrap:anywhere}.cover-identity p{margin:2mm 0 0;color:#f2e5e9;font-size:8.5pt}.cover-bottom{display:flex;justify-content:space-between;align-items:end;border-top:1px solid #ffffff35;padding-top:5mm;color:#eadde2;font-size:8pt}.cover-bottom strong{letter-spacing:2px;color:#f1c65b}.report-page{min-height:0;page-break-after:auto;break-after:auto;padding:0 0 7mm}.report-page + .report-page{margin-top:4mm;padding-top:5mm;border-top:1px solid #e9e0e6}.report-page:last-child{page-break-after:auto;break-after:auto}.eyebrow{font-size:7pt;letter-spacing:1.6px;text-transform:uppercase;color:#a11242;font-weight:800;margin-bottom:2mm}.intro{padding:5mm;background:#f8f2f5;border-left:3px solid #a11242;border-radius:0 3mm 3mm 0;margin:0 0 4mm}.intro p:last-child{margin-bottom:0}.summary-grid{display:grid;grid-template-columns:1fr 1fr;gap:3mm;margin:3mm 0 5mm}.summary-card{padding:3.5mm;border:1px solid #e7dfe4;border-radius:3mm}.summary-card span,.metric span{display:block;font-size:7pt;color:#77717c;margin-bottom:1mm}.summary-card strong{font-size:15pt;color:#a11242}.score-grid{display:grid;grid-template-columns:1fr 1fr;gap:2.2mm}.score-card{padding:2.8mm 3mm;border:1px solid #e9e4e8;border-radius:2.5mm;break-inside:avoid}.score-line{display:flex;justify-content:space-between;gap:4mm;font-size:8.2pt}.score-line strong{color:#a11242;white-space:nowrap}.track{height:3px;border-radius:99px;background:#eee8ec;margin-top:2mm;overflow:hidden}.track i{display:block;height:100%;background:linear-gradient(90deg,#8e1038,#e2b64f);border-radius:99px}.metrics{display:grid;grid-template-columns:repeat(2,1fr);gap:2.5mm}.metric{padding:3mm;background:#faf8f9;border:1px solid #ece6ea;border-radius:2.5mm}.metric strong{font-size:10pt;color:#252437}.columns{display:grid;grid-template-columns:1fr 1fr;gap:4mm}.note-card{padding:4mm;border:1px solid #e7dfe4;border-radius:3mm;break-inside:avoid}.note-card p:last-child,.note-card ul:last-child{margin-bottom:0}ul,ol{padding-left:5mm;margin:2mm 0}li{margin-bottom:1.5mm}.teacher-note{padding:4mm;background:#f8f5f6;border-radius:3mm;white-space:pre-wrap;overflow-wrap:anywhere}.muted{color:#77717c;font-size:8pt}.footer{margin-top:5mm;padding-top:3mm;border-top:1px solid #e6dfe3;font-size:7pt;color:#77717c;display:flex;justify-content:space-between;gap:5mm}.page-label{color:#a11242;font-weight:800;letter-spacing:1px}.radar-grid polygon{fill:none;stroke:#dfe4ee;stroke-width:1}.radar-grid line{stroke:#e5e8f0;stroke-width:1}.report-radar{display:block;width:100%;max-height:91mm;margin:auto;overflow:visible}.radar-area{fill:rgba(178,13,74,.16);stroke:#b20d4a;stroke-width:2.5;stroke-linejoin:round}.radar-dots circle{fill:#e3b526;stroke:#fff;stroke-width:1.5}.radar-labels text{fill:#64718a;font-size:8px;font-weight:800;letter-spacing:.15px}.radar-scale{fill:#8994a8;font-size:7px;font-weight:800;letter-spacing:.5px}.radar-block{display:grid;grid-template-columns:1fr 1fr;gap:4mm;align-items:center;margin-top:4mm}.radar-card{padding:3mm;border:1px solid #e7dfe4;border-radius:3mm;min-width:0}.radar-card h3{margin-bottom:1mm}.radar-card .muted{margin-bottom:0}.subheading{margin:4mm 0 2mm;font-size:10pt;color:#92123d}.section-spacer{margin-top:4mm}@media print{.report-page{break-inside:avoid}.score-card,.metric,.note-card,.radar-card{break-inside:avoid}h2,h3{break-after:avoid}img{max-width:100%}}
  </style></head><body>
  <section class="cover"><div class="cover-top"><div class="brand"><img src="${logoUrl}" alt="Academia de Talentos Amo mi Voz"><div class="brand-copy"><strong>Academia de Talentos</strong>AMO MI VOZ · Vocal Engine</div></div></div><div class="cover-main"><div class="cover-kicker">Informe de progreso vocal</div><h1>Mi voz.<br><span>Mi evolución.</span></h1><p class="cover-subtitle">Un registro de tu interpretación, tus fortalezas y los próximos pasos para seguir desarrollando tu voz.</p><div class="cover-rule"></div><div class="cover-identity"><small>Informe individual de</small><strong>${esc(studentName)}</strong><p>${esc(songName)} · ${esc(dateLabel)}</p><p>Clasificación vocal: ${esc(voiceType)}</p></div></div><div class="cover-bottom"><span>Documento pedagógico personal</span><strong>AMV · ${new Date().getFullYear()}</strong></div></section>
  <section class="report-page"><p class="eyebrow">01 · Resumen de la audición</p><h2>Tu perfil vocal</h2><div class="intro"><p>Este informe reúne los indicadores acústicos disponibles y la evaluación docente de una interpretación específica. Las puntuaciones describen esta audición; no definen tu talento ni constituyen un diagnóstico médico.</p></div><div class="summary-grid"><div class="summary-card"><span>Promedio de evaluación docente</span><strong>${esc(average)}</strong></div><div class="summary-card"><span>Dimensiones evaluadas</span><strong>${teacherScoredDimensions.value}/8</strong></div></div><h3 class="subheading">Evaluación docente por dimensiones</h3><div class="score-grid">${scoreRows}</div><div class="radar-block"><article class="radar-card"><h3>Radar de evaluación docente</h3><p class="muted">Escala del profesor de 1 a 10.</p>${teacherRadar}</article><article class="radar-card"><h3>Radar de indicadores acústicos</h3><p class="muted">Solo mediciones disponibles, escala 0–100.</p>${acousticRadar}</article></div><div class="footer"><span>AMO MI VOZ · Academia de Talentos</span><span class="page-label">01 / Perfil vocal</span></div></section>
  <section class="report-page"><p class="eyebrow">02 · Evidencia acústica</p><h2>Indicadores de esta grabación</h2><div class="metrics">${acousticRows}</div><p class="muted section-spacer">Las mediciones automáticas dependen de la calidad de la grabación y de la disponibilidad de una referencia. Se interpretan junto con la escucha y el criterio docente.</p><h3 class="subheading">Retroalimentación pedagógica</h3><div class="columns"><article class="note-card"><h3>Fortalezas observadas</h3>${strengthsContent}</article><article class="note-card"><h3>Prioridades de mejora</h3>${prioritiesContent}</article></div>${teacher.observations?.trim() ? `<div class="section-spacer"><h3>Comentario del profesor</h3><div class="teacher-note">${esc(teacher.observations)}</div></div>` : ''}<div class="footer"><span>AMO MI VOZ · Academia de Talentos</span><span class="page-label">02 / Retroalimentación</span></div></section>
  <section class="report-page"><p class="eyebrow">03 · Próxima clase</p><h2>Plan de práctica</h2>${hasPractice ? practiceItems : '<p class="muted">El profesor todavía no ha registrado un plan específico para esta audición.</p>'}<h3 class="subheading">Cómo reconocer tu progreso</h3><ol><li>Elige un objetivo concreto antes de comenzar.</li><li>Practica en fragmentos breves, con comodidad y pausas.</li><li>Vuelve a interpretar la misma frase y compara qué cambió.</li><li>Registra qué estrategia te ayudó y qué necesitas seguir trabajando.</li></ol><div class="intro section-spacer"><p>No fuerces la voz. Si aparece dolor, ronquera persistente o tensión creciente, detén la práctica y coméntalo con tu profesor.</p></div><div class="footer"><span>AMO MI VOZ · Academia de Talentos</span><span class="page-label">03 / Continuidad pedagógica</span></div></section>
  <script>window.addEventListener('load',()=>setTimeout(()=>window.print(),700))<\/script></body></html>`

  const reportWindow = window.open('', '_blank')
  if (!reportWindow) {
    error.value = 'El navegador bloqueó la ventana del informe. Permite las ventanas emergentes para generar el PDF.'
    return
  }
  reportWindow.document.open()
  reportWindow.document.write(html)
  reportWindow.document.close()
}

async function resolveStudentId() {
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  if (!user) throw new Error('Inicia sesión con tu cuenta de alumno para ver tus audiciones.')
  const metadata = user.user_metadata || {}
  studentDisplayName.value = metadata.full_name || metadata.name || metadata.display_name || [metadata.first_name, metadata.last_name].filter(Boolean).join(' ') || user.email?.split('@')[0] || ''
  studentVoiceType.value = metadata.voice_type || metadata.voice || ''

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('student_id, role')
    .eq('id', user.id)
    .maybeSingle()

  if (profileError) throw profileError
  if (!profile || profile.role !== 'student' || !profile.student_id) {
    throw new Error('Tu cuenta todavía no está vinculada a una ficha de alumno. Pide a tu profesor que revise la vinculación.')
  }
  return Number(profile.student_id)
}

async function loadStudentAuditions() {
  loading.value = true
  error.value = ''
  try {
    if (!studentId.value) studentId.value = await resolveStudentId()
    const items = await fetchVocalRecordings(studentId.value)
    recordings.value = items
    const current = items.find(item => String(item.id) === String(activeRecordingId.value))
    const selected = current || items[0] || null
    if (selected) await selectRecording(selected)
    else {
      activeRecordingId.value = null
      audioUrl.value = ''
    }
  } catch (e) {
    console.error('[Mis evaluaciones AMV] No se pudieron cargar audiciones:', e)
    error.value = e?.message || 'No fue posible recuperar tus audiciones.'
  } finally {
    loading.value = false
  }
}

async function selectRecording(recording) {
  activeRecordingId.value = recording.id
  teacherEvaluation.value = null
  teacherEvaluationError.value = ''
  teacherEvaluationLoading.value = true
  void loadTeacherEvaluation(recording.id)
  audioUrl.value = ''
  audioError.value = ''
  audioLoading.value = true
  try {
    if (recording.audioUrl) {
      audioUrl.value = recording.audioUrl
    } else if (recording.storagePath) {
      audioUrl.value = await createVocalRecordingSignedUrl(recording.storagePath)
      if (!audioUrl.value) audioError.value = 'No se recibió un enlace temporal para esta grabación.'
    } else {
      audioError.value = 'Esta audición no tiene una ruta de audio registrada.'
    }
  } catch (e) {
    console.error('[Mis evaluaciones AMV] Error creando URL de audio:', e)
    audioError.value = 'No se pudo acceder al audio. La grabación puede seguir en Storage; revisaremos el acceso y la ruta.'
  } finally {
    audioLoading.value = false
  }
}

onMounted(loadStudentAuditions)
</script>

<style scoped>
.amv-student-page{--ink:#172033;--muted:#728097;--line:#e1e7f0;--wine:#b20d4a;--wine-dark:#760d32;--gold:#e3b526;--green:#238b68;width:min(1440px,calc(100% - 36px));margin:0 auto;padding:24px 0 48px;color:var(--ink);font:15px/1.55 Inter,ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
.amv-student-page *{box-sizing:border-box}
.hero{position:relative;display:flex;justify-content:space-between;align-items:center;gap:28px;overflow:hidden;min-height:270px;padding:clamp(26px,4vw,52px);margin-bottom:30px;border-radius:22px;color:#fff;background:radial-gradient(circle at 83% 22%,rgba(255,255,255,.12),transparent 25%),linear-gradient(118deg,#7c1036 0%,#b70c4b 58%,#ce174f 100%);box-shadow:0 18px 42px rgba(104,15,52,.15)}
.hero:after{content:"";position:absolute;width:300px;height:300px;right:8%;top:-210px;border:1px solid #ffffff30;border-radius:50%;box-shadow:0 0 0 30px #ffffff08,0 0 0 65px #ffffff06;pointer-events:none}
.hero-copy{position:relative;z-index:1;max-width:760px}.eyebrow,.section-label{display:block;font-size:.72rem;letter-spacing:.14em;font-weight:850}.eyebrow{color:#ffe5ee}.eyebrow i,.status-pill i{display:inline-block;width:8px;height:8px;margin-right:8px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 5px #ffffff12}
.hero h1{margin:18px 0 14px;font-size:clamp(2.35rem,4vw,4rem);line-height:.98;letter-spacing:-.055em;font-weight:850}.hero h1 span{display:block;color:#ffe4ec}.hero p{max-width:700px;margin:0;color:#ffedf2;font-size:1.03rem;line-height:1.7}
.hero-tags{display:flex;flex-wrap:wrap;gap:9px;margin-top:24px}.hero-tags span{padding:7px 12px;border:1px solid #ffffff50;border-radius:999px;background:#ffffff14;font-size:.76rem;font-weight:750}
.hero-mark{position:relative;z-index:1;flex:0 0 148px;width:148px;height:148px;display:flex;flex-direction:column;align-items:center;justify-content:center;border:1px solid #ffffff70;border-radius:50%;background:#ffffff12;box-shadow:inset 0 0 0 9px #ffffff0b}.hero-mark span{font-size:2.1rem;font-weight:900;letter-spacing:-.08em}.hero-mark small{font-size:.55rem;letter-spacing:.16em;font-weight:800}
.section-intro{display:flex;align-items:end;justify-content:space-between;gap:18px;margin:0 4px 18px}.section-label{color:var(--wine)}.section-intro h2,.selected-heading h2{margin:6px 0;font-size:clamp(1.5rem,2.5vw,2.05rem);letter-spacing:-.045em;line-height:1.15}.section-intro p,.selected-heading p{margin:7px 0 0;color:var(--muted);max-width:760px}.count-pill{flex-shrink:0;padding:8px 13px;border-radius:999px;background:#fff;border:1px solid var(--line);font-size:.8rem;font-weight:800;color:#58657a}
.audition-layout{display:grid;grid-template-columns:minmax(270px,350px) minmax(0,1fr);gap:20px;align-items:start}.panel{border:1px solid var(--line);border-radius:20px;background:#fff;box-shadow:0 10px 32px #18243b08}.history{padding:18px;position:sticky;top:16px}.panel-heading{display:flex;justify-content:space-between;align-items:center;gap:12px}.panel-heading h3,.audio-content h3,.learning-card h3,.practice-panel h3{margin:5px 0 0;font-size:1.2rem;letter-spacing:-.035em}.icon-button{width:36px;height:36px;border:1px solid var(--line);border-radius:11px;background:#fff;color:var(--wine);font-size:1.3rem;cursor:pointer}.recording-option{display:flex;align-items:center;gap:11px;width:100%;margin-top:10px;padding:12px 10px;border:1px solid transparent;border-radius:14px;text-align:left;background:#f8f9fc;color:var(--ink);cursor:pointer;transition:background .18s,border-color .18s,transform .18s}.recording-option:hover{border-color:#e9b7ca;transform:translateY(-1px)}.recording-option.is-active{border-color:#e8a5bd;background:#fff0f5;box-shadow:inset 3px 0 var(--wine)}.recording-icon{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border-radius:12px;background:#f4dce6;color:var(--wine);font-size:1.35rem}.recording-copy{display:flex;flex:1;min-width:0;flex-direction:column;gap:3px}.recording-copy strong{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:.86rem}.recording-copy small{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--muted);font-size:.73rem}.status-dot,.legend-dot{flex:0 0 8px;width:8px;height:8px;border-radius:50%;background:#d4a12a}.status-dot.is-done,.legend-dot.is-done{background:var(--green)}.history-note{display:flex;align-items:center;gap:7px;flex-wrap:wrap;margin:16px 2px 0;color:var(--muted);font-size:.68rem}.results-column{display:grid;gap:18px;min-width:0}.selected-heading{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:6px 2px}.selected-heading>div{min-width:0}.selected-heading h2{overflow-wrap:anywhere}.status-pill{display:inline-flex;align-items:center;gap:5px;flex-shrink:0;padding:8px 12px;border-radius:999px;background:#fff5dc;color:#956a12;border:1px solid #f0dfad;font-size:.7rem;font-weight:850}.status-pill i{width:7px;height:7px;margin:0;background:currentColor;box-shadow:none}.status-pill.is-done{background:#effaf5;border-color:#c8eadb;color:#237b5d}
.audio-panel{display:flex;align-items:center;gap:20px;padding:22px}.audio-art{display:flex;flex:0 0 112px;height:112px;flex-direction:column;align-items:center;justify-content:center;border-radius:17px;color:#fff;background:linear-gradient(145deg,#7f1038,#c51150);box-shadow:0 10px 24px #a8154928}.audio-art span{font-size:2.6rem;line-height:1}.audio-art small{margin-top:8px;font-size:.56rem;letter-spacing:.16em;font-weight:850}.audio-content{min-width:0;flex:1}.audio-content p{margin:5px 0 14px;color:var(--muted);font-size:.85rem}.audio-content audio{display:block;width:100%;height:42px;max-width:720px}.audio-message{padding:11px 13px;border-radius:10px;background:#f5f7fb;color:#68768b;font-size:.8rem}.audio-message--error{background:#fff4f6;color:#a51a48}
.result-panel{padding:22px}.result-heading{align-items:flex-start;margin-bottom:20px}.result-heading>div{min-width:0}.result-heading p{margin:8px 0 0;color:var(--muted);font-size:.84rem}.amv-badge{display:grid;place-items:center;flex:0 0 42px;height:42px;border-radius:13px;background:#f8e5ed;color:var(--wine);font-size:.78rem;font-weight:900}
.metric-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:11px}.metric-card{padding:16px;border:1px solid var(--line);border-radius:15px;background:linear-gradient(145deg,#fff,#fbfcfe)}.metric-card span{display:block;color:#8b97aa;font-size:.63rem;letter-spacing:.09em;font-weight:850}.metric-card strong{display:block;margin:10px 0 5px;font-size:clamp(1.15rem,2vw,1.65rem);letter-spacing:-.05em;overflow-wrap:anywhere}.metric-card small{color:var(--muted);font-size:.72rem;line-height:1.4}
.radar-panel{margin-top:14px;padding:22px;border:1px solid var(--line);border-radius:18px;background:radial-gradient(circle at 16% 15%,#fbf0f5 0,transparent 36%),linear-gradient(145deg,#fff,#fbfcff);overflow:hidden}.radar-heading{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding-bottom:16px;border-bottom:1px solid #e9edf4}.radar-heading h3{margin:5px 0;font-size:1.22rem;letter-spacing:-.04em}.radar-heading p{max-width:680px;margin:5px 0 0;color:var(--muted);font-size:.82rem}.radar-count{flex-shrink:0;padding:7px 11px;border-radius:999px;background:#f6e6ed;color:var(--wine);font-size:.72rem;font-weight:850}.radar-layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,.95fr);gap:22px;align-items:center;padding-top:18px}.radar-visual{display:grid;place-items:center;min-width:0;min-height:310px;border:1px solid #e8edf5;border-radius:16px;background:radial-gradient(circle,#fff 0,#fbfcff 70%)}.radar-visual svg{display:block;width:100%;max-width:430px;height:auto;overflow:visible}.radar-grid polygon{fill:none;stroke:#dce4ef;stroke-width:1.1}.radar-grid line{stroke:#dce4ef;stroke-width:1.1}.radar-area{fill:#b20d4a26;stroke:#b20d4a;stroke-width:3;stroke-linejoin:round;filter:drop-shadow(0 4px 5px #b20d4a1a)}.radar-markers circle{fill:#e3b526;stroke:#fff;stroke-width:2.5}.radar-visual svg text{fill:#66748b;font-size:9px;font-weight:850;letter-spacing:.05em}.radar-visual svg .radar-scale-note{fill:#9aa5b6;font-size:8px;letter-spacing:.14em}.radar-indicators{display:grid;gap:11px}.radar-indicator{padding:13px 14px;border:1px solid var(--line);border-radius:13px;background:#ffffffd9}.radar-indicator>div:first-child{display:flex;align-items:center;justify-content:space-between;gap:12px}.radar-indicator span{color:#647189;font-size:.76rem;font-weight:800}.radar-indicator strong{color:var(--ink);font-size:1.05rem;font-weight:900}.radar-indicator strong small{margin-left:2px;color:#98a2b2;font-size:.65rem}.radar-track{height:6px;margin-top:9px;overflow:hidden;border-radius:999px;background:#edf0f6}.radar-track i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#b20d4a,#e3b526)}.radar-indicator p{margin:7px 0 0;color:var(--muted);font-size:.72rem}.radar-method-note{margin:0;padding:11px 12px;border-left:3px solid #e3b526;border-radius:0 9px 9px 0;background:#fff9e9;color:#7b6a43;font-size:.7rem;line-height:1.5}.radar-unavailable{display:flex;align-items:center;gap:14px;margin-top:16px;padding:17px;border:1px dashed #d9e0eb;border-radius:14px;background:#fbfcfe}.radar-unavailable>span{display:grid;place-items:center;flex:0 0 42px;width:42px;height:42px;border-radius:12px;background:#f8e5ed;color:var(--wine);font-size:1.6rem}.radar-unavailable strong{font-size:.86rem}.radar-unavailable p{margin:4px 0 0;color:var(--muted);font-size:.78rem}
.learning-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}.learning-card{padding:19px;border:1px solid var(--line);border-radius:16px}.learning-card--strength{background:linear-gradient(140deg,#f3fbf7,#fff);border-color:#d5eee2}.learning-card--focus{background:linear-gradient(140deg,#fff8ed,#fff);border-color:#f3e5c9}.learning-icon{display:grid;place-items:center;width:34px;height:34px;margin-bottom:14px;border-radius:10px;background:#dff3e9;color:#247c5c;font-size:1.2rem}.learning-card--focus .learning-icon{background:#ffedcb;color:#9a6a12}.learning-card .section-label{font-size:.65rem}.learning-card h3{margin:7px 0 12px}.learning-card ul{margin:0;padding-left:19px}.learning-card li{margin:7px 0;color:#48556a;font-size:.86rem}.muted{color:var(--muted);font-size:.84rem}.learning-card p{margin:0;color:var(--muted);font-size:.84rem}
.practice-panel{padding:21px;border:1px solid var(--line);border-radius:18px;background:#fff}.practice-panel h3{margin-bottom:12px}.practice-panel ol{list-style:none;padding:0;margin:0}.practice-panel li{display:flex;gap:13px;align-items:flex-start;padding:12px 0;border-top:1px solid #edf0f5}.practice-panel li>span{display:grid;place-items:center;flex:0 0 34px;height:34px;border-radius:10px;background:#f8e5ed;color:var(--wine);font-size:.72rem;font-weight:850}.practice-panel li p{margin:4px 0 0;color:#4d5a70;font-size:.86rem}
.panel-subsection{margin-top:14px;padding:20px;border:1px solid var(--line);border-radius:17px;background:#fff}.subsection-heading{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:17px}.subsection-heading h3{margin:5px 0;font-size:1.15rem;letter-spacing:-.03em}.subsection-heading p{margin:0;color:var(--muted);font-size:.82rem}.teacher-average{flex-shrink:0;padding:9px 12px;border-radius:12px;background:#f8e5ed;color:var(--wine);font-size:1.3rem;font-weight:900}.teacher-average small{font-size:.7rem}.teacher-state{padding:14px;border-radius:11px;background:#f7f8fb;color:var(--muted);font-size:.84rem}.teacher-state--error{background:#fff4f6;color:#a51a48}.teacher-radar-panel{margin-top:24px;padding:22px;border:1px solid var(--line);border-radius:20px;background:linear-gradient(145deg,#fff 0%,#fcf9fb 100%)}
.teacher-radar-heading{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:18px}
.teacher-radar-heading h4{margin:4px 0 6px;font-size:20px;letter-spacing:-.035em}
.teacher-radar-heading p{max-width:700px;margin:0;color:var(--muted);line-height:1.65}
.teacher-radar-badge{flex:none;padding:8px 12px;border-radius:999px;background:#f8e5ed;color:var(--wine);font-size:12px;font-weight:800}
.teacher-radar-layout{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(260px,.95fr);align-items:center;gap:24px}
.teacher-radar-visual{min-width:0;padding:12px;border:1px solid #e8eaf1;border-radius:18px;background:radial-gradient(circle at 50% 45%,#fff 0%,#fbf8fa 75%)}
.teacher-radar-visual svg{display:block;width:100%;height:auto;overflow:visible}
.teacher-radar-grid polygon{fill:none;stroke:#dfe4ee;stroke-width:1}
.teacher-radar-grid line{stroke:#e5e8f0;stroke-width:1}
.teacher-radar-area{fill:rgba(178,13,74,.17);stroke:#b20d4a;stroke-width:2.8;stroke-linejoin:round}
.teacher-radar-points circle{fill:#e3b526;stroke:#fff;stroke-width:2}
.teacher-radar-labels text{fill:#64718a;font-size:10px;font-weight:800;letter-spacing:.35px}
.teacher-radar-scale{fill:#8994a8;font-size:10px;font-weight:800;letter-spacing:1px}
.teacher-radar-legend{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.teacher-radar-legend article{padding:12px;border:1px solid var(--line);border-radius:12px;background:#fff;min-width:0}
.teacher-radar-legend article span{display:block;color:var(--muted);font-size:11px;font-weight:700;line-height:1.4}
.teacher-radar-legend article strong{display:block;margin:4px 0 8px;color:var(--wine);font-size:20px}
.teacher-radar-legend article div{height:5px;overflow:hidden;border-radius:99px;background:#edf0f5}
.teacher-radar-legend article i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#b20d4a,#e3b526)}
.teacher-radar-empty{padding:18px;border:1px dashed #d9deea;border-radius:14px;color:var(--muted);background:#fafbfe}
@media(max-width:760px){.teacher-radar-heading{display:block}.teacher-radar-badge{display:inline-block;margin-top:12px}.teacher-radar-layout{grid-template-columns:1fr}.teacher-radar-legend{grid-template-columns:1fr 1fr}}
@media(max-width:430px){.teacher-radar-legend{grid-template-columns:1fr}.teacher-radar-panel{padding:14px}}
.teacher-score-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px}.teacher-score{padding:12px;border:1px solid var(--line);border-radius:12px}.teacher-score>div:first-child{display:flex;justify-content:space-between;gap:12px;align-items:center}.teacher-score strong{font-size:.8rem}.teacher-score span{font-size:.8rem;font-weight:850;color:var(--wine)}.teacher-score-track{height:6px;margin-top:10px;overflow:hidden;border-radius:999px;background:#edf0f6}.teacher-score-track i{display:block;height:100%;border-radius:999px;background:linear-gradient(90deg,#a80f48,#e3b526)}.teacher-comments-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;margin-top:14px}.teacher-comments-grid article{padding:14px;border-radius:12px;background:#f8f9fc}.teacher-comments-grid p{margin:8px 0 0;color:#48556a;font-size:.85rem;white-space:pre-wrap;overflow-wrap:anywhere}.teacher-comment-wide{grid-column:1/-1}.teacher-updated{margin:12px 0 0;color:var(--muted);font-size:.72rem}.report-actions{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-top:14px;padding:18px;border:1px solid #f0d6e0;border-radius:15px;background:#fff8fb}.report-actions p{margin:0;color:var(--muted);font-size:.82rem}.technical-details{margin-top:14px;padding:15px 17px;border:1px solid var(--line);border-radius:14px;background:#f9fafc}.technical-details summary{cursor:pointer;color:#59667a;font-size:.82rem;font-weight:800}.technical-details pre{max-height:360px;overflow:auto;padding:14px;border-radius:10px;background:#172033;color:#dce5f3;font-size:.72rem;white-space:pre-wrap;overflow-wrap:anywhere}.measurement-note{color:var(--muted);font-size:.8rem}.pending-result{display:flex;align-items:center;gap:14px;padding:20px;border:1px solid #f1dfb2;border-radius:15px;background:#fffaf0}.pending-symbol{font-size:1.8rem;color:#b17c14}.pending-result div{flex:1}.pending-result strong{font-size:.92rem}.pending-result p{margin:5px 0 0;color:var(--muted);font-size:.8rem}
.button{border:0;border-radius:11px;padding:10px 14px;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}.button--primary{background:linear-gradient(120deg,#a80f48,#c41452);color:#fff;box-shadow:0 8px 20px #a8154926}.button--secondary{border:1px solid #dce2eb;background:#fff;color:#455169}.state-card{display:flex;align-items:center;gap:15px;padding:22px;border:1px solid var(--line);border-radius:16px;background:#fff}.state-card p{margin:5px 0 0;color:var(--muted);font-size:.85rem}.state-card--error{align-items:flex-start;flex-direction:column;border-color:#f0c9d5;background:#fff7f9}.state-card--error strong{color:#a51a48}.spinner{width:25px;height:25px;border:3px solid #f1cbd9;border-top-color:var(--wine);border-radius:50%;animation:spin .8s linear infinite}@keyframes spin{to{transform:rotate(360deg)}}
.empty-state{padding:clamp(28px,5vw,56px);text-align:center}.empty-note{display:grid;place-items:center;width:70px;height:70px;margin:0 auto 18px;border-radius:20px;background:#f8e5ed;color:var(--wine);font-size:2.3rem}.empty-state .section-label{margin-bottom:8px}.empty-state h2{margin:0;font-size:1.6rem;letter-spacing:-.04em}.empty-state p{max-width:560px;margin:10px auto 0;color:var(--muted);font-size:.9rem}.page-footer{display:flex;align-items:center;justify-content:center;gap:12px;margin-top:32px;color:#929db0;font-size:.65rem;font-weight:850;letter-spacing:.13em}.page-footer i{width:5px;height:5px;border-radius:50%;background:var(--gold)}
@media(max-width:1000px){.audition-layout{grid-template-columns:1fr}.history{position:static}.history .recording-option{display:inline-flex;vertical-align:top;width:calc(50% - 6px);margin-right:5px}.metric-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:760px){.radar-layout{grid-template-columns:1fr}.radar-visual{min-height:0}.radar-visual svg{max-width:360px}}
@media(max-width:640px){.radar-panel{padding:15px}.radar-heading{align-items:flex-start}.radar-count{font-size:.65rem}.radar-visual{padding:6px}.teacher-score-grid,.teacher-comments-grid{grid-template-columns:1fr}.teacher-comment-wide{grid-column:auto}.subsection-heading{align-items:flex-start}.report-actions{align-items:stretch;flex-direction:column}.amv-student-page{width:calc(100% - 24px);padding-top:12px}.hero{min-height:0;padding:25px 21px;border-radius:18px}.hero-mark{display:none}.hero h1{font-size:2.45rem}.hero p{font-size:.92rem}.section-intro{align-items:flex-start;flex-direction:column}.history,.result-panel{padding:15px}.history .recording-option{width:100%;margin-right:0}.selected-heading{align-items:flex-start;flex-direction:column}.audio-panel{align-items:flex-start;gap:14px;padding:16px}.audio-art{flex-basis:68px;width:68px;height:68px;border-radius:13px}.audio-art span{font-size:1.9rem}.audio-art small{display:none}.audio-content h3{font-size:1rem}.metric-grid,.learning-grid{grid-template-columns:1fr}.metric-card{padding:14px}.pending-result{align-items:flex-start;flex-wrap:wrap}.pending-result .button{margin-left:40px}.result-heading h3{font-size:1.05rem}.page-footer{font-size:.53rem;letter-spacing:.08em}}
@media(prefers-reduced-motion:reduce){.amv-student-page *{animation-duration:.01ms!important;transition-duration:.01ms!important}}
@media print {
  @page { size: A4; margin: 14mm; }
  .amv-student-page { width:100%; max-width:none; padding:0; color:#172033; }
  .amv-student-page .hero { min-height:0; padding:22px; margin-bottom:16px; box-shadow:none; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
  .amv-student-page .hero-mark { display:flex; }
  .amv-student-page .history, .amv-student-page .icon-button, .amv-student-page .audio-panel, .amv-student-page .report-actions, .amv-student-page .technical-details, .amv-student-page .page-footer, .amv-student-page .section-intro, .amv-student-page .status-pill { display:none!important; }
  .amv-student-page .audition-layout { display:block; }
  .amv-student-page .results-column { display:block; }
  .amv-student-page .selected-heading { margin-bottom:12px; }
  .amv-student-page .panel { box-shadow:none; break-inside:avoid; }
  .amv-student-page .result-panel { padding:16px; }
  .amv-student-page .metric-grid { grid-template-columns:repeat(4,minmax(0,1fr)); }
  .amv-student-page .teacher-score-grid, .amv-student-page .teacher-comments-grid { grid-template-columns:repeat(2,minmax(0,1fr)); }
  .amv-student-page .radar-layout { grid-template-columns:1fr 1fr; }
  .amv-student-page .radar-panel, .amv-student-page .radar-visual { break-inside:avoid; box-shadow:none; }
  .amv-student-page .learning-card, .amv-student-page .practice-panel, .amv-student-page .panel-subsection { break-inside:avoid; }
  .amv-student-page .technical-details pre { display:none; }
}
</style>
