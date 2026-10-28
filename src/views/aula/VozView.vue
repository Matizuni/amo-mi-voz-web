<template>

  <main class="amv-page">

    <header class="hero">

      <div>

        <p class="eyebrow">AMO MI VOZ · VOCAL ENGINE</p>

        <h1>Audición y evaluación integral</h1>

        <p class="subtitle">Análisis acústico AMV + criterio docente + plan de práctica.</p>

      </div>

      <div class="hero-mark">AMV</div>

    </header>

    <p v-if="error" class="notice error" role="alert">{{ error }}</p>

    <p v-if="message" class="notice success" role="status">{{ message }}</p>

    <section class="layout">

      <aside class="panel students-panel">

        <div class="section-heading">

          <div><p class="eyebrow">GESTIÓN DOCENTE</p><h2>Alumnos</h2></div>

          <span class="count">{{ filteredStudents.length }}</span>

        </div>

        <input v-model="search" class="field" placeholder="Buscar alumno…" aria-label="Buscar alumno" />

        <div v-if="loadingStudents" class="muted">Cargando alumnos…</div>

        <button

          v-for="student in filteredStudents"

          :key="student.id"

          class="student-option"

          :class="{ selected: String(selectedStudentId) === String(student.id) }"

          @click="selectStudent(student)"

        >

          <span class="avatar">{{ initials(student.name) }}</span>

          <span class="student-copy"><strong>{{ student.name }}</strong><small>{{ student.voice || 'Voz por registrar' }}</small></span>

          <span class="chevron">›</span>

        </button>

        <p v-if="!loadingStudents && !filteredStudents.length" class="muted">No hay alumnos que coincidan con la búsqueda.</p>

      </aside>

      <section class="workspace">

        <section v-if="!selectedStudent" class="panel empty-state">

          <div class="empty-icon">♫</div>

          <h2>Selecciona un alumno</h2>

          <p>Luego podrás iniciar una audición, ejecutar el análisis AMV y completar tu pauta docente.</p>

        </section>

        <template v-else>

          <section class="panel student-summary">

            <div class="avatar large">{{ initials(selectedStudent.name) }}</div>

            <div class="student-heading">

              <p class="eyebrow">FICHA VOCAL</p>

              <h2>{{ selectedStudent.name }}</h2>

              <p class="muted">{{ selectedStudent.voice || 'Clasificación vocal pendiente' }}</p>

            </div>

            <button class="primary" @click="showNewAudition = !showNewAudition">

              {{ showNewAudition ? 'Cerrar formulario' : '+ Nueva audición' }}

            </button>

          </section>

          <section v-if="showNewAudition" class="panel">

            <div class="section-heading"><div><p class="eyebrow">PASO 1</p><h2>Registrar audición</h2></div><span class="step">01 / 03</span></div>

            <form class="form-grid" @submit.prevent="createAudition">

              <label class="wide">Título de la audición

                <input v-model.trim="form.title" class="field" required placeholder="Ej. Audición de octubre" />

              </label>

              <label>Canción

                <input v-model.trim="form.song" class="field" placeholder="Nombre de la canción" />

              </label>

              <label>Artista / referencia

                <input v-model.trim="form.artist" class="field" placeholder="Artista original" />

              </label>

              <label class="wide">Audio del alumno

                <input class="field file-field" type="file" accept="audio/*,.wav,.mp3,.m4a,.flac,.ogg" required @change="form.audio = $event.target.files?.[0] || null" />

              </label>

              <label class="wide">Archivo de referencia MIDI o audio

                <input class="field file-field" type="file" accept="audio/*,.mid,.midi,.wav,.mp3,.m4a,.flac,.ogg" required @change="form.referenceFile = $event.target.files?.[0] || null" />

                <small class="muted">El servicio AMV disponible actualmente exige una referencia para comparar la interpretación.</small>

              </label>

              <label>Tipo de audición

                <select v-model="form.songType" class="field"><option value="cover">Cover</option><option value="original">Canción original</option><option value="exercise">Ejercicio vocal</option></select>

              </label>

              <label>Tonalidad (opcional)

                <input v-model.trim="form.key" class="field" placeholder="Ej. Sol mayor" />

              </label>

              <label class="wide">Observación inicial (opcional)

                <textarea v-model.trim="form.context" class="field" rows="2" placeholder="Objetivo de esta audición, contexto o dificultad que observarás." />

              </label>

              <div class="wide form-actions">

                <button class="primary" :disabled="busy" type="submit">{{ busy ? 'Subiendo audición…' : 'Guardar audición y analizar' }}</button>

                <span class="muted">Subida segura mediante el servicio existente; el análisis se solicita a la Edge Function.</span>

              </div>

            </form>

          </section>

          <section class="panel">

            <div class="section-heading"><div><p class="eyebrow">PASO 2</p><h2>Historial de audiciones</h2></div><button class="secondary" :disabled="loadingRecordings" @click="loadRecordings">Actualizar</button></div>

            <p v-if="loadingRecordings" class="muted">Cargando historial…</p>

            <div v-else-if="!recordings.length" class="muted empty-inline">Este alumno todavía no tiene audiciones registradas.</div>

            <button v-for="recording in recordings" :key="recording.id" class="recording-row" :class="{ active: String(activeRecordingId) === String(recording.id) }" @click="selectRecording(recording)">

              <span class="record-icon">♫</span>

              <span class="record-copy"><strong>{{ recording.title || recording.song || 'Audición vocal' }}</strong><small>{{ formatDate(recording.recordedAt) }} · {{ recording.song || 'Canción no indicada' }}</small></span>

              <span class="status" :class="recording.analysis ? 'done' : 'pending'">{{ recording.analysis ? 'Analizada' : 'Pendiente' }}</span>

            </button>

          </section>

          <template v-if="activeRecording">

            <section class="panel">

              <div class="section-heading"><div><p class="eyebrow">EVIDENCIA DEL MOTOR</p><h2>{{ activeRecording.title || 'Análisis AMV' }}</h2></div><span class="status" :class="activeRecording.analysis ? 'done' : 'pending'">{{ activeRecording.analysis ? 'Resultado disponible' : 'Sin resultado visible' }}</span></div>

              <p class="muted">Las mediciones automáticas se conservan como evidencia independiente. No reemplazan la pauta docente ni generan por sí solas un diagnóstico vocal.</p>

              <pre v-if="activeRecording.analysis" class="analysis-json">{{ JSON.stringify(activeRecording.analysis.workerResult || activeRecording.analysis.worker_result || activeRecording.analysis, null, 2) }}</pre>

              <p v-else class="muted">Esta audición no muestra un análisis asociado todavía. Puedes solicitarlo nuevamente.</p>

              <button class="secondary" :disabled="busy" @click="runAnalysis">{{ busy ? 'Procesando solicitud…' : 'Solicitar / reintentar análisis AMV' }}</button>

            </section>

            <section class="panel">

              <div class="section-heading"><div><p class="eyebrow">PASO 3</p><h2>Tu evaluación docente</h2></div><span class="step">OCHO DIMENSIONES</span></div>

              <p class="muted">Evalúa cada dimensión de 1 a 10 según la pauta pedagógica. 1–2 = requiere apoyo prioritario; 3–4 = desarrollo inicial; 5–6 = en desarrollo; 7–8 = buen desempeño; 9–10 = desempeño destacado. No dejes dimensiones sin evaluar.</p>

              <div class="evaluation-progress" aria-live="polite">
                <div class="evaluation-progress__copy">
                  <span>PROGRESO DE LA PAUTA</span>
                  <strong>{{ completedDimensions }} de 8 dimensiones</strong>
                </div>
                <div class="evaluation-progress__track" role="progressbar" :aria-valuenow="completedDimensions" aria-valuemin="0" aria-valuemax="8" :aria-label="`${completedDimensions} de 8 dimensiones evaluadas`">
                  <span :style="{ width: `${(completedDimensions / 8) * 100}%` }"></span>
                </div>
                <div class="evaluation-progress__average">
                  <small>Promedio actual</small>
                  <strong>{{ teacherAverage }}<small>/10</small></strong>
                </div>
              </div>

              <form @submit.prevent="saveEvaluation">

                <div class="proposal-toolbar">

                  <div>

                    <strong>Asistente pedagógico</strong>

                    <p class="muted">Genera un borrador editable desde tus ocho puntuaciones. No sustituye tu criterio ni presenta el análisis AMV como una medición que no está validada.</p>

                  </div>

                  <button class="secondary" type="button" @click="generatePedagogicalProposal">Generar propuesta</button>

                </div>

                <div class="dimension-grid">

                  <article v-for="dimension in dimensions" :key="dimension.key" class="dimension-card">

                    <div><h3>{{ dimension.label }}</h3><p>{{ dimension.prompt }}</p></div>

                    <div

  class="rating-row"

  role="group"

  :aria-label="`Puntuación docente: ${dimension.label}`"

>

                      <button v-for="n in 10" :key="n" type="button" class="rating" :class="{ chosen: Number(scores[dimension.key]) === n }" :aria-pressed="Number(scores[dimension.key]) === n" @click="scores[dimension.key] = n">{{ n }}</button>

                    </div>

                  </article>

                </div>

                <div class="form-grid">

                  <label>Fortalezas observadas<textarea v-model.trim="strengths" class="field" rows="3" placeholder="¿Qué hizo bien? ¿Qué conviene mantener?" /></label>

                  <label>Prioridades de mejora<textarea v-model.trim="priorities" class="field" rows="3" placeholder="¿Qué necesita trabajar primero y por qué?" /></label>

                  <label class="wide">Observaciones del profesor<textarea v-model.trim="observations" class="field" rows="3" placeholder="Evidencia escuchada, contexto, matices o discrepancias con AMV." /></label>

                  <label class="wide">Plan de ejercicios para la próxima clase<textarea v-model.trim="exercisePlan" class="field" rows="4" placeholder="Ejercicio, instrucciones, duración/repeticiones y criterio de logro. Fundamentar en las fuentes de estudio AMV." /></label>

                </div>

                <div class="form-actions">

                  <button class="primary" :disabled="busy" type="submit">{{ busy ? 'Guardando…' : 'Guardar evaluación docente' }}</button>

                  <span class="muted">La evaluación queda vinculada a esta audición.</span>

                </div>

              </form>

            </section>

            <section class="panel">

              <p class="eyebrow">SÍNTESIS ACTUAL</p>

              <h2>Resultado docente y siguiente paso</h2>

              <p class="muted">La puntuación mostrada aquí resume tu pauta. La evidencia AMV se conserva aparte hasta que se validen reglas de integración específicas para cada dimensión; así no fingimos que el motor mide aspectos que no puede medir.</p>

              <div class="summary-grid">

                <div class="metric"><span>Promedio docente</span><strong>{{ teacherAverage }}</strong><small>Escala 1–10 · ocho dimensiones</small></div>

                <div class="metric"><span>Dimensiones evaluadas</span><strong>{{ completedDimensions }}/8</strong><small>Evaluación docente</small></div>

              </div>

              <div v-if="completedDimensions === 8" class="recommendation">

                <strong>Próximo paso pedagógico</strong>

                <p>{{ derivedNextStep }}</p>

              </div>

            </section>

          </template>

        </template>

      </section>

    </section>

    <footer>AMV Vocal Engine · Evaluación pedagógica asistida · La valoración docente y la evidencia automática permanecen diferenciadas.</footer>

  </main>

</template>

<script setup>

import { computed, onMounted, reactive, ref } from 'vue'

import { fetchStudents } from '@/services/studentService'

import {

  fetchVocalRecordings,

  uploadVocalRecording,

  requestVocalAnalysis,

  fetchVocalRecordingById

} from '@/services/vocalIntelligenceService'

import {

  AMV_DIMENSIONS,

  fetchTeacherEvaluation,

  saveTeacherEvaluation as persistTeacherEvaluation

} from '@/services/vocalTeacherEvaluationService'

const dimensions = AMV_DIMENSIONS

const students = ref([])

const selectedStudent = ref(null)

const selectedStudentId = ref(null)

const recordings = ref([])

const activeRecording = ref(null)

const activeRecordingId = ref(null)

const search = ref('')

const loadingStudents = ref(false)

const loadingRecordings = ref(false)

const showNewAudition = ref(false)

const busy = ref(false)

const error = ref('')

const message = ref('')

const scores = reactive(Object.fromEntries(dimensions.map(d => [d.key, null])))

const observations = ref('')

const strengths = ref('')

const priorities = ref('')

const exercisePlan = ref('')

const form = reactive({ title: '', song: '', artist: '', songType: 'cover', key: '', audio: null, referenceFile: null, context: '' })

const filteredStudents = computed(() => students.value.filter(s => s.name.toLowerCase().includes(search.value.toLowerCase())))

const completedDimensions = computed(() => dimensions.filter(d => { const value = Number(scores[d.key]); return Number.isInteger(value) && value >= 1 && value <= 10 }).length)

const teacherAverage = computed(() => completedDimensions.value ? (dimensions.reduce((sum, d) => sum + (Number(scores[d.key]) || 0), 0) / completedDimensions.value).toFixed(2) : '—')

const derivedNextStep = computed(() => {

  const weakest = [...dimensions].filter(d => scores[d.key] != null).sort((a, b) => scores[a.key] - scores[b.key])[0]

  if (!weakest) return 'Completa la pauta docente.'

  return `Prioriza ${weakest.label.toLowerCase()} en la próxima clase. Define un ejercicio concreto y vuelve a observar esta dimensión en la siguiente audición.`

})

onMounted(loadStudents)

async function loadStudents() {

  loadingStudents.value = true

  error.value = ''

  try { students.value = await fetchStudents() }

  catch (e) { error.value = readableError(e, 'No se pudieron cargar los alumnos.') }

  finally { loadingStudents.value = false }

}

async function selectStudent(student) {

  selectedStudent.value = student

  selectedStudentId.value = student.id

  activeRecording.value = null

  activeRecordingId.value = null

  showNewAudition.value = false

  resetEvaluation()

  await loadRecordings()

}

async function loadRecordings() {

  if (!selectedStudentId.value) return

  loadingRecordings.value = true

  error.value = ''

  try {

    recordings.value = await fetchVocalRecordings(selectedStudentId.value)

    if (recordings.value.length && !activeRecordingId.value) await selectRecording(recordings.value[0])

  } catch (e) { error.value = readableError(e, 'No se pudo cargar el historial de audiciones.') }

  finally { loadingRecordings.value = false }

}

async function selectRecording(recording) {

  activeRecording.value = recording

  activeRecordingId.value = recording.id

  resetEvaluation()

  error.value = ''

  try {

    const saved = await fetchTeacherEvaluation(recording.id)

    if (saved) {

      for (const d of dimensions) scores[d.key] = saved.scores?.[d.key] ?? null

      observations.value = saved.observations || ''

      strengths.value = saved.strengths || ''

      priorities.value = saved.priorities || ''

      exercisePlan.value = saved.exercise_plan || ''

    }

  } catch (e) { error.value = readableError(e, 'No se pudo recuperar la evaluación docente. Revisa la migración y las políticas RLS.') }

}

async function createAudition() {

  if (!selectedStudentId.value) return

  if (!form.audio || !form.referenceFile) { error.value = 'Selecciona el audio del alumno y el archivo de referencia.'; return }

  busy.value = true

  error.value = ''

  message.value = ''

  try {

    const recording = await uploadVocalRecording({

      studentId: selectedStudentId.value,

      file: form.audio,

      referenceFile: form.referenceFile,

      title: form.title,

      song: form.song,

      artist: form.artist,

      songType: form.songType,

      key: form.key,

      recordedAt: new Date().toISOString()

    })

    await requestVocalAnalysis(recording.id)

    message.value = 'Audición guardada y solicitud de análisis enviada. Actualiza el historial cuando el procesamiento termine.'

    form.title = ''; form.song = ''; form.artist = ''; form.key = ''; form.audio = null; form.referenceFile = null; form.context = ''

    showNewAudition.value = false

    await loadRecordings()

    const fresh = await fetchVocalRecordingById(recording.id)

    await selectRecording(fresh)

  } catch (e) {

    error.value = readableError(e, 'No se pudo completar la audición. Comprueba los requisitos de AMV y vuelve a intentarlo.')

  } finally { busy.value = false }

}

async function runAnalysis() {

  if (!activeRecording.value) return

  busy.value = true; error.value = ''; message.value = ''

  try {

    await requestVocalAnalysis(activeRecording.value.id)

    message.value = 'Solicitud enviada a AMV. Si el análisis es asíncrono, actualiza el historial después de que termine.'

    const fresh = await fetchVocalRecordingById(activeRecording.value.id)

    await selectRecording(fresh)

    await loadRecordings()

  } catch (e) { error.value = readableError(e, 'No se pudo solicitar el análisis AMV.') }

  finally { busy.value = false }

}

function generatePedagogicalProposal() {

  if (completedDimensions.value !== 8) {

    error.value = `Para generar la propuesta, completa las ocho puntuaciones. Llevas ${completedDimensions.value} de 8.`

    return

  }

  // Normaliza valores que puedan venir de Supabase como texto.

  for (const d of dimensions) scores[d.key] = Number(scores[d.key])

  const ordered = dimensions

    .map(d => ({ ...d, score: Number(scores[d.key]) }))

    .sort((a, b) => a.score - b.score)

  const strong = ordered.filter(d => d.score >= 7).sort((a, b) => b.score - a.score)

  const priority = ordered.filter(d => d.score <= 4)

  const developing = ordered.filter(d => d.score >= 5 && d.score <= 6)

  const analysisAvailable = Boolean(

    activeRecording.value?.analysis ||

    activeRecording.value?.workerResult ||

    activeRecording.value?.worker_result

  )

  strengths.value = strong.length

    ? strong.map(d => `${d.label} (${d.score}/10): desempeño valorado como sólido en la pauta docente; conviene mantenerlo y observar su consistencia en la próxima audición.`).join('\n')

    : 'La pauta aún no identifica dimensiones con puntuaciones 7–10. Vuelve a escuchar la audición y registra conductas concretas que el alumno ya realiza bien.'

  priorities.value = priority.length

    ? priority.map((d, i) => `${i + 1}. ${d.label} (${d.score}/10): prioridad de trabajo. Anota qué escuchaste específicamente y compara el resultado en la siguiente audición.`).join('\n')

    : developing.length

      ? `No hay puntuaciones de 1–4. Enfoca la práctica en consolidar: ${developing.map(d => `${d.label} (${d.score}/10)`).join(', ')}.`

      : 'No se detectan prioridades bajas en esta pauta. Mantén el trabajo y comprueba la estabilidad del desempeño en otra interpretación.'

  const exerciseByKey = {

    intonation: 'Afinación: sostener notas cómodas con una referencia tonal; realizar patrones cortos de 3–5 notas y comprobar cada repetición contra la referencia.',

    rhythm: 'Ritmo: marcar el pulso con palmas o pasos, practicar entradas y frases lentas con metrónomo, y luego acercarse al tempo de la canción.',

    air: 'Aire y fraseo: planificar respiraciones sobre el texto; cantar frases breves sin forzar y revisar que el final de frase conserve estabilidad.',

    phonation: 'Fonación y emisión: realizar inicio suave con vocales cómodas y ejercicios breves de resonancia sin empujar ni aumentar el volumen.',

    register: 'Registro: trabajar transiciones en rango cómodo con patrones ascendentes y descendentes suaves; detenerse si aparece tensión.',

    resonance: 'Resonancia y timbre: comparar vocales sostenidas en una intensidad cómoda y buscar claridad sin apretar la garganta.',

    diction: 'Dicción: recitar el texto con pulso, exagerar suavemente consonantes difíciles y luego cantar manteniendo la inteligibilidad.',

    expression: 'Expresión: definir intención por frase, marcar palabras clave y repetir la interpretación variando dinámicas sin perder afinación ni claridad.'

  }

  const focus = (priority.length ? priority : ordered.slice(0, 2))

    .slice(0, 3)

    .map((d, i) => `${i + 1}. ${exerciseByKey[d.key] || `Practicar ${d.label.toLowerCase()} con una consigna concreta y volver a observarla.`}`)

  exercisePlan.value = `${focus.join('\n\n')}\n\nCriterio de logro: repetir una toma breve y comparar la misma dimensión con la pauta docente. Registrar qué cambió y qué necesita otra práctica. Ajustar el ejercicio según la respuesta del alumno; suspenderlo si genera dolor o tensión.`

  observations.value = [

    'Borrador generado a partir de la pauta docente; revisar y editar antes de guardar.',

    analysisAvailable

      ? 'Hay un resultado AMV asociado a la audición. Esta propuesta no fusiona automáticamente sus datos con las notas docentes: contrasta las mediciones disponibles por separado y evita inferir dimensiones no medidas.'

      : 'No se detecta un resultado AMV asociado a esta audición. La propuesta se basa únicamente en las puntuaciones docentes.'

  ].join('\n\n')

  message.value = 'Propuesta pedagógica generada. Revísala y edítala antes de guardar.'

  error.value = ''

}

async function saveEvaluation() {

  if (!activeRecording.value) return

  if (completedDimensions.value !== 8) { error.value = 'Evalúa las ocho dimensiones antes de guardar.'; return }

  busy.value = true; error.value = ''; message.value = ''

  try {

    await persistTeacherEvaluation({

      recordingId: activeRecording.value.id,

      studentId: selectedStudentId.value,

      scores: { ...scores },

      observations: observations.value,

      strengths: strengths.value,

      priorities: priorities.value,

      exercisePlan: exercisePlan.value,

      integratedResult: { status: 'teacher_only_until_rules_validated', note: 'Las evidencias automáticas se mantienen separadas hasta validar reglas de combinación por dimensión.', amv_analysis_available: Boolean(activeRecording.value?.analysis || activeRecording.value?.workerResult || activeRecording.value?.worker_result), proposal_generated_from: 'teacher_scores', generated_at: new Date().toISOString() }

    })

    message.value = 'Evaluación docente guardada correctamente.'

  } catch (e) { error.value = readableError(e, 'No se pudo guardar. Revisa la migración y las políticas de acceso.') }

  finally { busy.value = false }

}

function resetEvaluation() {

  for (const d of dimensions) scores[d.key] = null

  observations.value = ''; strengths.value = ''; priorities.value = ''; exercisePlan.value = ''

}

function initials(name) { return String(name || '?').split(/\s+/).slice(0, 2).map(part => part[0] || '').join('').toUpperCase() }

function formatDate(value) { if (!value) return 'Fecha sin registrar'; const date = new Date(value); return Number.isNaN(date.getTime()) ? 'Fecha sin registrar' : new Intl.DateTimeFormat('es-CL', { dateStyle: 'medium' }).format(date) }

function readableError(e, fallback) { return e?.message || fallback }

</script>


<style>
/* AMV Vocal Engine — visual system 2026 */
.amv-page {
  --amv-ink: #172033;
  --amv-muted: #667085;
  --amv-line: #e4e8f0;
  --amv-paper: #ffffff;
  --amv-canvas: #f5f7fb;
  --amv-indigo: #4f46e5;
  --amv-indigo-dark: #3730a3;
  --amv-indigo-soft: #eef2ff;
  max-width: 1600px;
  padding: clamp(16px, 2.4vw, 36px);
  margin: 0 auto;
  color: var(--amv-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  font-size: 14px;
  line-height: 1.5;
}
.amv-page, .amv-page * { box-sizing: border-box; }
.amv-page .hero {
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  min-height: 190px;
  padding: clamp(24px, 4vw, 44px);
  margin-bottom: 24px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 24px;
  color: #fff;
  background:
    radial-gradient(circle at 82% 15%, rgba(129,140,248,.32), transparent 28%),
    radial-gradient(circle at 70% 110%, rgba(99,102,241,.28), transparent 36%),
    linear-gradient(125deg, #111827 0%, #202b49 58%, #3730a3 100%);
  box-shadow: 0 18px 50px rgba(27, 39, 78, .14);
}
.amv-page .hero:after {
  content: "";
  position: absolute;
  width: 280px; height: 280px;
  right: 8%; top: -170px;
  border: 1px solid rgba(255,255,255,.13);
  border-radius: 50%;
  box-shadow: 0 0 0 28px rgba(255,255,255,.025), 0 0 0 58px rgba(255,255,255,.02);
  pointer-events: none;
}
.amv-page .hero > div:first-child { position: relative; z-index: 1; }
.amv-page .hero .eyebrow { color: #c7d2fe; letter-spacing: .16em; }
.amv-page .hero h1 { max-width: 760px; margin: 0 0 10px; font-size: clamp(28px, 3.2vw, 42px); font-weight: 760; letter-spacing: -.045em; line-height: 1.12; }
.amv-page .subtitle { max-width: 680px; color: #d7def1; font-size: 15px; }
.amv-page .hero-mark {
  position: relative; z-index: 1; display: grid; place-items: center;
  width: 82px; height: 82px; flex: 0 0 auto;
  border: 1px solid rgba(255,255,255,.28); border-radius: 24px;
  color: #fff; background: rgba(255,255,255,.08); backdrop-filter: blur(8px);
  font-size: 19px; font-weight: 850; letter-spacing: .08em;
}
.amv-page .layout { display: grid; grid-template-columns: minmax(245px, 285px) minmax(0,1fr); gap: 22px; align-items: start; }
.amv-page .panel {
  min-width: 0; padding: clamp(18px, 2vw, 26px); margin-bottom: 20px;
  border: 1px solid var(--amv-line); border-radius: 18px; background: var(--amv-paper);
  box-shadow: 0 3px 10px rgba(16,24,40,.025), 0 12px 28px rgba(16,24,40,.025);
}
.amv-page .students-panel { position: sticky; top: 18px; max-height: calc(100vh - 36px); overflow: auto; }
.amv-page .section-heading { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 18px; }
.amv-page .section-heading h2, .amv-page .student-heading h2 { margin: 0; color: var(--amv-ink); font-size: 20px; font-weight: 750; letter-spacing: -.025em; }
.amv-page .eyebrow { margin: 0 0 6px; color: #7c83a0; font-size: 10px; font-weight: 800; letter-spacing: .14em; }
.amv-page .muted { color: var(--amv-muted); font-size: 13px; line-height: 1.6; }
.amv-page .count, .amv-page .step {
  display: inline-flex; align-items: center; justify-content: center; min-height: 28px; padding: 5px 9px;
  border: 1px solid #e0e7ff; border-radius: 8px; color: #4338ca; background: #eef2ff;
  font-size: 11px; font-weight: 800; white-space: nowrap;
}
.amv-page .field {
  display: block; width: 100%; min-width: 0; min-height: 43px; margin-top: 7px; padding: 10px 12px;
  border: 1px solid #d9deea; border-radius: 10px; outline: none; color: #172033; background: #fff;
  font: inherit; transition: border-color .18s ease, box-shadow .18s ease;
}
.amv-page textarea.field { min-height: 92px; resize: vertical; }
.amv-page .field:focus { border-color: #818cf8; box-shadow: 0 0 0 4px rgba(99,102,241,.12); }
.amv-page label { display: block; color: #344054; font-size: 12px; font-weight: 700; }
.amv-page .file-field { padding: 9px; font-size: 12px; }
.amv-page .student-option, .amv-page .recording-row {
  display: flex; align-items: center; gap: 11px; width: 100%; min-width: 0; padding: 11px 10px; margin-top: 6px;
  border: 1px solid transparent; border-radius: 12px; color: inherit; background: transparent; text-align: left; cursor: pointer;
  transition: background .18s ease, border-color .18s ease, transform .18s ease;
}
.amv-page .student-option:hover, .amv-page .recording-row:hover { background: #f8f9ff; border-color: #e7e9fb; }
.amv-page .student-option.selected, .amv-page .recording-row.active { border-color: #c7d2fe; background: #eef2ff; }
.amv-page .avatar { display: grid; place-items: center; width: 40px; height: 40px; flex: 0 0 auto; border-radius: 13px; color: #4338ca; background: #eef2ff; font-size: 12px; font-weight: 850; }
.amv-page .avatar.large { width: 60px; height: 60px; border-radius: 17px; font-size: 17px; }
.amv-page .student-copy, .amv-page .record-copy { display: grid; gap: 3px; min-width: 0; flex: 1; }
.amv-page .student-copy strong, .amv-page .record-copy strong { overflow: hidden; color: #202a40; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; font-weight: 750; }
.amv-page .student-copy small, .amv-page .record-copy small { overflow: hidden; color: #7b8498; text-overflow: ellipsis; white-space: nowrap; font-size: 11px; }
.amv-page .chevron { color: #98a2b3; font-size: 22px; }
.amv-page .student-summary { display: flex; align-items: center; gap: 15px; }
.amv-page .student-heading { min-width: 0; flex: 1; }
.amv-page .student-heading .muted { margin: 4px 0 0; }
.amv-page .primary, .amv-page .secondary {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px; min-height: 42px; padding: 10px 15px;
  border: 1px solid transparent; border-radius: 10px; font: inherit; font-size: 12px; font-weight: 800; cursor: pointer;
  transition: transform .16s ease, box-shadow .16s ease, background .16s ease;
}
.amv-page .primary { color: #fff; background: linear-gradient(135deg, #4f46e5, #3730a3); box-shadow: 0 5px 12px rgba(79,70,229,.15); }
.amv-page .primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 18px rgba(79,70,229,.22); }
.amv-page .secondary { color: #344054; border-color: #dce1ec; background: #fff; }
.amv-page .secondary:hover:not(:disabled) { border-color: #c7d2fe; background: #f8f9ff; }
.amv-page button:focus-visible { outline: 3px solid rgba(99,102,241,.35); outline-offset: 2px; }
.amv-page button:disabled { opacity: .55; cursor: not-allowed; }
.amv-page .form-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 17px; }
.amv-page .wide { grid-column: 1 / -1; }
.amv-page .form-actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; margin-top: 18px; }
.amv-page .form-actions .muted { flex: 1; }
.amv-page .empty-state { display: grid; justify-items: center; padding: 70px 24px; text-align: center; }
.amv-page .empty-state h2 { margin: 10px 0 5px; }
.amv-page .empty-state p { max-width: 430px; color: var(--amv-muted); }
.amv-page .empty-icon { display: grid; place-items: center; width: 64px; height: 64px; margin-bottom: 8px; border: 1px solid #e0e7ff; border-radius: 20px; color: #4f46e5; background: #eef2ff; font-size: 30px; }
.amv-page .empty-inline { padding: 20px 0; }
.amv-page .record-icon { display: grid; place-items: center; width: 39px; height: 39px; flex: 0 0 auto; border-radius: 12px; color: #4f46e5; background: #eef2ff; }
.amv-page .status { display: inline-flex; align-items: center; padding: 6px 9px; border-radius: 999px; font-size: 10px; font-weight: 800; white-space: nowrap; }
.amv-page .status.done { color: #067647; background: #e7f8ef; }
.amv-page .status.pending { color: #925f12; background: #fff4d6; }
.amv-page .dimension-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; margin: 18px 0 22px; }
.amv-page .dimension-card {
  display: flex; flex-direction: column; justify-content: space-between; gap: 18px; min-width: 0; padding: 17px;
  border: 1px solid #e5e9f2; border-radius: 14px; background: linear-gradient(180deg,#fff,#fcfcff);
  transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease;
}
.amv-page .dimension-card:focus-within { border-color: #c7d2fe; box-shadow: 0 0 0 3px rgba(99,102,241,.07); }
.amv-page .dimension-card h3 { margin: 0 0 5px; color: #202a40; font-size: 13px; font-weight: 800; letter-spacing: -.01em; }
.amv-page .dimension-card p { margin: 0; color: #727d91; font-size: 11px; line-height: 1.55; }
.amv-page .rating-row { display: grid; grid-template-columns: repeat(10,minmax(0,1fr)); gap: 5px; }
.amv-page .rating {
  display: grid; place-items: center; min-width: 0; height: 35px; padding: 0;
  border: 1px solid #dfe4ee; border-radius: 8px; color: #526078; background: #fff;
  font-size: 12px; font-weight: 800; cursor: pointer; transition: color .15s ease, background .15s ease, border-color .15s ease, transform .15s ease;
}
.amv-page .rating:hover { border-color: #a5b4fc; color: #4338ca; background: #f5f6ff; }
.amv-page .rating.chosen { border-color: #4338ca; color: #fff; background: #4338ca; box-shadow: 0 3px 8px rgba(67,56,202,.18); }
.amv-page .analysis-json { max-height: 340px; overflow: auto; padding: 15px; border: 1px solid #28324a; border-radius: 12px; color: #dbe5ff; background: #111827; font: 11px/1.6 ui-monospace, SFMono-Regular, Consolas, monospace; white-space: pre-wrap; overflow-wrap: anywhere; }
.amv-page .summary-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; margin: 18px 0; }
.amv-page .metric { display: grid; gap: 6px; padding: 17px; border: 1px solid #e5e9f2; border-radius: 13px; background: #fbfcff; }
.amv-page .metric span, .amv-page .metric small { color: #737e92; font-size: 11px; }
.amv-page .metric strong { color: #222c43; font-size: 27px; font-weight: 800; letter-spacing: -.04em; }
.amv-page .recommendation { padding: 17px; border: 1px solid #dfe5ff; border-radius: 13px; color: #27335b; background: #f5f6ff; line-height: 1.6; }
.amv-page .recommendation p { margin: 6px 0 0; color: #596582; font-size: 12px; }
.amv-page .notice { padding: 13px 15px; margin: 0 0 17px; border: 1px solid transparent; border-radius: 12px; font-size: 13px; }
.amv-page .notice.error { border-color: #fecdd3; color: #9f1239; background: #fff1f2; }
.amv-page .notice.success { border-color: #bbf7d0; color: #166534; background: #f0fdf4; }
.amv-page .proposal-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 18px; padding: 16px; margin: 18px 0; border: 1px solid #e3e7f2; border-radius: 13px; background: #f8f9fd; }
.amv-page .proposal-toolbar strong { display: block; margin-bottom: 5px; color: #28334b; font-size: 13px; }
.amv-page .proposal-toolbar p { max-width: 720px; margin: 0; }
.amv-page .evaluation-progress {
  display: grid; grid-template-columns: minmax(150px,1fr) minmax(120px,1.5fr) auto; align-items: center; gap: 16px;
  padding: 15px 17px; border: 1px solid #e0e7ff; border-radius: 14px; background: linear-gradient(100deg,#f7f8ff,#fff);
}
.amv-page .evaluation-progress__copy { display: grid; gap: 3px; }
.amv-page .evaluation-progress__copy span { color: #737e92; font-size: 9px; font-weight: 850; letter-spacing: .12em; }
.amv-page .evaluation-progress__copy strong { color: #293450; font-size: 12px; }
.amv-page .evaluation-progress__track { height: 7px; overflow: hidden; border-radius: 999px; background: #e5e7eb; }
.amv-page .evaluation-progress__track span { display: block; height: 100%; border-radius: inherit; background: linear-gradient(90deg,#6366f1,#4338ca); transition: width .25s ease; }
.amv-page .evaluation-progress__average { display: grid; gap: 1px; text-align: right; }
.amv-page .evaluation-progress__average > small { color: #737e92; font-size: 10px; }
.amv-page .evaluation-progress__average strong { color: #3730a3; font-size: 21px; font-weight: 850; line-height: 1.1; }
.amv-page .evaluation-progress__average strong small { color: #7c83a0; font-size: 11px; }
.amv-page footer { padding: 12px 3px 25px; color: #8790a2; font-size: 11px; text-align: center; }
@media (max-width: 1050px) {
  .amv-page .layout { grid-template-columns: 1fr; }
  .amv-page .students-panel { position: static; max-height: none; }
  .amv-page .students-panel .student-option { display: inline-flex; width: calc(50% - 5px); vertical-align: top; }
}
@media (max-width: 700px) {
  .amv-page { padding: 12px; }
  .amv-page .hero { min-height: 0; padding: 24px 20px; border-radius: 18px; }
  .amv-page .hero-mark { display: none; }
  .amv-page .panel { padding: 16px; border-radius: 15px; }
  .amv-page .form-grid, .amv-page .dimension-grid, .amv-page .summary-grid { grid-template-columns: 1fr; }
  .amv-page .form-grid .wide { grid-column: auto; }
  .amv-page .student-summary { flex-wrap: wrap; }
  .amv-page .student-summary .primary { width: 100%; }
  .amv-page .students-panel .student-option { width: 100%; }
  .amv-page .rating-row { gap: 4px; }
  .amv-page .rating { height: 32px; border-radius: 7px; font-size: 11px; }
  .amv-page .evaluation-progress { grid-template-columns: 1fr auto; gap: 10px 14px; }
  .amv-page .evaluation-progress__track { grid-column: 1 / -1; grid-row: 2; }
  .amv-page .proposal-toolbar { align-items: stretch; flex-direction: column; }
  .amv-page .proposal-toolbar .secondary { width: 100%; }
}
@media (prefers-reduced-motion: reduce) {
  .amv-page *, .amv-page *::before, .amv-page *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; scroll-behavior: auto !important; }
}
</style>
