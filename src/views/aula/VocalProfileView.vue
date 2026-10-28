<template>
  <section class="vocal-page amv-page-shell amv-view-shell">
    <div v-if="loading" class="vocal-state amv-card">Preparando el perfil vocal…</div>
    <div v-else-if="errorMessage" class="vocal-state vocal-state--error amv-card">
      <strong>No pudimos cargar el perfil vocal</strong><p>{{ errorMessage }}</p><button type="button" class="amv-secondary-action" @click="load">Reintentar</button>
    </div>

    <template v-else>
      <header class="amv-page-header">
        <div>
          <RouterLink :to="`/aula/estudiante/${studentId}`" class="vocal-back">← Volver al estudiante</RouterLink>
          <span class="amv-page-header__eyebrow">SEGUIMIENTO VOCAL</span>
          <h1>{{ student?.name || 'Perfil vocal' }}</h1>
          <p>Grabaciones, evolución técnica y análisis asistido por IA en ocho dimensiones del canto.</p>
        </div>
        <div class="amv-page-header__actions">
          <button v-if="isTeacher" class="amv-primary-action" type="button" @click="uploadOpen = !uploadOpen">+ Nueva grabación</button>
        </div>
      </header>

      <section class="vocal-notice">
        <strong>IA como apoyo pedagógico</strong>
        <p>El análisis auditivo orienta el seguimiento, pero no diagnostica salud vocal ni afirma postura, tensión laríngea o coordinación respiratoria observable sin video/presencial.</p>
      </section>

      <section v-if="uploadOpen && isTeacher" class="upload-panel amv-card">
        <div class="amv-section-title"><span>NUEVA MUESTRA</span><h2>Agregar grabación</h2></div>
        <div class="upload-grid">
          <label><span>Título</span><input v-model="uploadForm.title" placeholder="Evaluación septiembre" /></label>
          <label><span>Canción</span><input v-model="uploadForm.song" placeholder="La Bikina" /></label>
          <label class="upload-file"><span>Audio del alumno</span><input type="file" accept="audio/*,.wav,.mp3,.m4a,.flac,.ogg" @change="onFile" /></label>
          <label class="upload-file"><span>Referencia musical (audio o MIDI)</span><input type="file" accept="audio/*,.wav,.mp3,.m4a,.flac,.ogg,.mid,.midi" @change="onReferenceFile" /><small>Necesaria para comparar afinación y ritmo con la canción de referencia.</small></label>
        </div>
        <div class="upload-actions">
          <button type="button" class="amv-secondary-action" @click="uploadOpen=false">Cancelar</button>
          <button type="button" class="amv-primary-action" :disabled="uploading || !uploadForm.file || !uploadForm.referenceFile" @click="handleUpload">{{ uploading ? 'Subiendo…' : 'Subir grabación y referencia' }}</button>
        </div>
      </section>

      <section class="vocal-overview">
        <article class="vocal-overview__radar amv-card">
          <div class="amv-section-title"><span>PERFIL ACTUAL</span><h2>Mapa vocal</h2></div>
          <VocalRadar :stats="radarStats" />
        </article>
        <article class="vocal-overview__summary amv-card">
          <div class="amv-section-title"><span>LECTURA PEDAGÓGICA</span><h2>{{ latestAnalysis ? 'Último análisis' : 'Aún no hay análisis IA' }}</h2></div>
          <template v-if="latestAnalysis">
            <p class="analysis-summary">{{ latestAnalysis.summary || 'Análisis disponible.' }}</p>
            <div class="summary-columns">
              <div><span>FORTALEZAS</span><ul><li v-for="item in latestAnalysis.strengths" :key="item">{{ item }}</li></ul></div>
              <div><span>PRIORIDADES</span><ul><li v-for="item in latestAnalysis.priorities" :key="item">{{ item }}</li></ul></div>
            </div>
          </template>
          <div v-else class="empty-copy">Sube una grabación y solicita un análisis para crear la primera línea base del estudiante.</div>
        </article>
      </section>

      <section class="stats-grid" aria-label="Ocho dimensiones vocales">
        <article v-for="stat in radarStats" :key="stat.key" class="stat-card amv-card">
          <div class="stat-card__top"><span>{{ stat.label }}</span><strong>{{ stat.value ? `${stat.value.toFixed(1)}/5` : '—' }}</strong></div>
          <div class="stat-track"><i :style="{ width: `${(stat.value / 5) * 100}%` }"></i></div>
          <p>{{ stat.observation || 'Sin observación registrada todavía.' }}</p>
        </article>
      </section>

      <section class="recordings amv-card">
        <div class="recordings__heading">
          <div class="amv-section-title"><span>HISTORIAL</span><h2>Grabaciones vocales</h2></div>
          <small>{{ recordings.length }} muestra{{ recordings.length === 1 ? '' : 's' }}</small>
        </div>
        <div v-if="recordings.length" class="recording-list">
          <article v-for="recording in recordings" :key="recording.id" class="recording-row">
            <button type="button" class="recording-play" @click="toggleAudio(recording)">{{ activeRecordingId === recording.id && playing ? '❚❚' : '▶' }}</button>
            <div class="recording-copy"><strong>{{ recording.title }}</strong><span>{{ recording.song || 'Muestra vocal' }} · {{ formatDate(recording.recordedAt || recording.createdAt) }}</span></div>
            <span class="analysis-chip" :class="`analysis-chip--${recording.analysis?.status || 'none'}`">{{ analysisStatus(recording) }}</span>
            <button v-if="isTeacher && !recording.analysis" type="button" class="analyze-button" :disabled="analyzingId === recording.id" @click="analyze(recording)">{{ analyzingId === recording.id ? 'Analizando…' : 'Analizar con IA' }}</button>
          </article>
        </div>
        <div v-else class="empty-copy">Todavía no hay grabaciones. La primera muestra servirá como línea base.</div>
        <audio ref="audioRef" @ended="playing=false" @pause="playing=false" @play="playing=true"></audio>
      </section>
      
      <section class="teacher-rubric amv-card" v-if="isTeacher">
        <div class="amv-section-title"><span>PAUTA DOCENTE</span><h2>Evaluación de audición</h2></div>
        <p class="rubric-intro">Califica cada dimensión de 1 a 5. Estas notas son tu evaluación pedagógica y se guardan separadas del análisis automático.</p>
        <label class="rubric-recording"><span>Grabación evaluada</span><select v-model="rubricRecordingId"><option value="">Selecciona una grabación</option><option v-for="recording in recordings" :key="recording.id" :value="String(recording.id)">{{ recording.title }} — {{ recording.song || 'Muestra vocal' }}</option></select></label>
        <div class="rubric-list">
          <div v-for="dimension in rubricDimensions" :key="dimension.key" class="rubric-row">
            <div class="rubric-copy"><strong>{{ dimension.number }}. {{ dimension.label }}</strong><small>{{ dimension.description }}</small></div>
            <div class="rubric-score" role="group" :aria-label="`Nota de ${dimension.label}`">
              <button v-for="score in [1,2,3,4,5]" :key="score" type="button" :class="{ 'is-selected': Number(rubric.scores[dimension.key]) === score }" :aria-pressed="Number(rubric.scores[dimension.key]) === score" @click="rubric.scores[dimension.key] = score">{{ score }}</button>
            </div>
          </div>
        </div>
        <label class="rubric-observations"><span>Observaciones del profesor</span><textarea v-model="rubric.observations" rows="3" placeholder="Fortalezas, aspectos por trabajar y recomendaciones…"></textarea></label>
        <div class="upload-actions"><span class="rubric-status" role="status">{{ rubricMessage }}</span><button type="button" class="amv-primary-action" :disabled="rubricSaving || !rubricRecordingId" @click="saveRubric">{{ rubricSaving ? 'Guardando…' : 'Guardar evaluación docente' }}</button></div>
        <p class="rubric-footnote">El punto 8 (Expresión) queda disponible, pero no se completa automáticamente. El análisis acústico no sustituye tu juicio docente.</p>
      </section>

    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { supabase } from '@/lib/supabase'
import { RouterLink, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { fetchStudentById } from '@/services/studentService'
import VocalRadar from '@/components/aula/VocalRadar.vue'
import {
  VOCAL_DIMENSIONS,
  fetchVocalRecordings,
  uploadVocalRecording,
  createVocalRecordingSignedUrl,
  requestVocalAnalysis
} from '@/services/vocalIntelligenceService'

const route = useRoute()
const { isTeacher } = useAuth()
const studentId = computed(() => Number(route.params.studentId))
const student = ref(null)
const recordings = ref([])
const loading = ref(true)
const errorMessage = ref('')
const uploadOpen = ref(false)
const uploading = ref(false)
const analyzingId = ref(null)
const activeRecordingId = ref(null)
const playing = ref(false)
const audioRef = ref(null)
const uploadForm = reactive({ title: '', song: '', file: null, referenceFile: null })
const rubricRecordingId = ref('')
const rubricSaving = ref(false)
const rubricMessage = ref('')
const rubric = reactive({ scores: { intonation: null, rhythm: null, air: null, phonation: null, register: null, resonance: null, diction: null, expression: null }, observations: '' })
const rubricDimensions = [
  { number: 1, key: 'intonation', label: 'Afinación', description: 'Canta las notas correctamente y mantiene la altura tonal.' },
  { number: 2, key: 'rhythm', label: 'Ritmo', description: 'Mantiene el pulso y respeta los tiempos de la canción.' },
  { number: 3, key: 'air', label: 'Aire y fraseo', description: 'Administra el aire y completa las frases musicales adecuadamente.' },
  { number: 4, key: 'phonation', label: 'Fonación', description: 'Produce la voz de manera coordinada, sin tensión excesiva observable.' },
  { number: 5, key: 'register', label: 'Registro', description: 'Utiliza adecuadamente su registro vocal y transita entre zonas de la voz.' },
  { number: 6, key: 'resonance', label: 'Resonancia', description: 'Consigue una emisión vocal clara y resonante.' },
  { number: 7, key: 'diction', label: 'Dicción', description: 'Articula las palabras y vocaliza con claridad.' },
  { number: 8, key: 'expression', label: 'Expresión', description: 'Transmite emociones e interpreta el sentido de la canción.' },
]

const latestAnalysis = computed(() => recordings.value.find(item => item.analysis?.status === 'completed')?.analysis || null)
const radarStats = computed(() => VOCAL_DIMENSIONS.map(item => {
  const raw = latestAnalysis.value?.dimensions?.[item.key]
  return {
    ...item,
    value: Number(raw?.score || raw?.value || 0),
    observation: raw?.observation || raw?.summary || ''
  }
}))

const load = async () => {
  loading.value = true
  errorMessage.value = ''
  try {
    const [loadedStudent, loadedRecordings] = await Promise.all([
      fetchStudentById(studentId.value),
      fetchVocalRecordings(studentId.value)
    ])
    student.value = loadedStudent
    recordings.value = loadedRecordings || []
  } catch (error) {
    console.error(error)
    errorMessage.value = error?.message || 'No fue posible cargar este seguimiento vocal.'
  } finally {
    loading.value = false
  }
}

const onFile = event => { uploadForm.file = event.target.files?.[0] || null }
const onReferenceFile = event => { uploadForm.referenceFile = event.target.files?.[0] || null }
const handleUpload = async () => {
  if (!uploadForm.file) return
  uploading.value = true
  try {
    await uploadVocalRecording({ studentId: studentId.value, file: uploadForm.file, referenceFile: uploadForm.referenceFile, title: uploadForm.title, song: uploadForm.song })
    uploadForm.title = ''; uploadForm.song = ''; uploadForm.file = null; uploadForm.referenceFile = null; uploadOpen.value = false
    await load()
  } catch (error) {
    errorMessage.value = error?.message || 'No pudimos subir la grabación.'
  } finally { uploading.value = false }
}

const toggleAudio = async recording => {
  if (!audioRef.value) return
  if (activeRecordingId.value === recording.id && !audioRef.value.paused) { audioRef.value.pause(); return }
  try {
    const url = recording.audioUrl || await createVocalRecordingSignedUrl(recording.storagePath)
    if (!url) return
    activeRecordingId.value = recording.id
    audioRef.value.src = url
    await audioRef.value.play()
  } catch (error) { console.error(error) }
}

const analyze = async recording => {
  analyzingId.value = recording.id
  try { await requestVocalAnalysis(recording.id); await load() }
  catch (error) { errorMessage.value = error?.message || 'No pudimos iniciar el análisis.' }
  finally { analyzingId.value = null }
}

const resetRubric = () => {
  rubric.scores = { intonation: null, rhythm: null, air: null, phonation: null, register: null, resonance: null, diction: null, expression: null }
  rubric.observations = ''
  rubricMessage.value = ''
}

const loadRubric = async () => {
  resetRubric()
  if (!rubricRecordingId.value) return
  try {
    const { data, error } = await supabase.from('vocal_teacher_evaluations').select('scores, observations').eq('recording_id', Number(rubricRecordingId.value)).maybeSingle()
    if (error) throw error
    if (data) { rubric.scores = { ...rubric.scores, ...(data.scores || {}) }; rubric.observations = data.observations || '' }
  } catch (error) {
    console.error('[AMV] No se pudo cargar la pauta docente:', error)
    rubricMessage.value = 'No se pudo cargar la pauta. Verifica que aplicaste la migración SQL incluida.'
  }
}

const saveRubric = async () => {
  if (!rubricRecordingId.value) return
  rubricSaving.value = true
  rubricMessage.value = ''
  try {
    const invalid = rubricDimensions.filter(d => !Number.isInteger(Number(rubric.scores[d.key])) || Number(rubric.scores[d.key]) < 1 || Number(rubric.scores[d.key]) > 5)
    if (invalid.length) throw new Error(`Completa las notas del 1 al 5: ${invalid.map(d => d.label).join(', ')}.`)
    const selected = recordings.value.find(item => Number(item.id) === Number(rubricRecordingId.value))
    const { data: userData, error: userError } = await supabase.auth.getUser()
    if (userError || !userData?.user?.id) throw new Error('Tu sesión expiró. Vuelve a iniciar sesión.')
    const payload = { recording_id: Number(rubricRecordingId.value), student_id: studentId.value, teacher_id: userData.user.id, scores: Object.fromEntries(Object.entries(rubric.scores).map(([key, value]) => [key, Number(value)])), observations: rubric.observations.trim() || null, updated_at: new Date().toISOString() }
    const { error } = await supabase.from('vocal_teacher_evaluations').upsert(payload, { onConflict: 'recording_id' })
    if (error) throw error
    rubricMessage.value = `Evaluación guardada${selected ? ` para ${selected.title}` : ''}.`
  } catch (error) {
    rubricMessage.value = error?.message || 'No fue posible guardar la evaluación.'
  } finally { rubricSaving.value = false }
}

watch(recordings, value => { if (!rubricRecordingId.value && value.length) rubricRecordingId.value = String(value[0].id) }, { immediate: true })
watch(rubricRecordingId, () => { if (rubricRecordingId.value) loadRubric() })

const analysisStatus = recording => {
  const status = recording.analysis?.status
  if (status === 'completed') return 'Analizado'
  if (status === 'processing') return 'Procesando'
  if (status === 'failed') return 'Revisar'
  return 'Sin análisis'
}
const formatDate = value => value ? new Intl.DateTimeFormat('es-CL', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(value)) : 'Sin fecha'
onMounted(load)
</script>

<style scoped>
.vocal-page{padding-bottom:56px}.teacher-rubric{padding:22px;margin-top:18px}.rubric-intro,.rubric-footnote{color:#667085;font-size:.86rem;line-height:1.5}.rubric-recording,.rubric-observations{display:grid;gap:8px;margin:16px 0;color:#475467;font-size:.8rem;font-weight:800}.rubric-recording select,.rubric-observations textarea{width:100%;padding:12px;border:1px solid #dbe3ec;border-radius:10px;background:#fff;color:#172033;font:inherit}.rubric-list{display:grid}.rubric-row{display:flex;justify-content:space-between;align-items:center;gap:18px;padding:14px 0;border-top:1px solid #edf0f4}.rubric-copy{display:grid;gap:5px}.rubric-copy strong{color:#172033}.rubric-copy small{color:#667085;max-width:560px;line-height:1.45}.rubric-score{display:flex;gap:6px;flex-shrink:0}.rubric-score button{width:36px;height:36px;border:1px solid #dbe3ec;border-radius:10px;background:#fff;color:#475467;font-weight:800;cursor:pointer}.rubric-score button.is-selected{background:#9f1945;border-color:#9f1945;color:white}.rubric-status{color:#20704f;font-size:.82rem}.upload-grid small{font-size:.72rem;color:#667085;font-weight:500}.recordings audio{display:block;width:100%;margin-top:12px}@media(max-width:680px){.rubric-row{align-items:flex-start;flex-direction:column}.rubric-score{width:100%}.rubric-score button{flex:1}.teacher-rubric{padding:16px}}.vocal-back{display:inline-flex;margin-bottom:18px;color:#667085;text-decoration:none;font-weight:750}.vocal-notice{margin-bottom:18px;padding:14px 16px;border:1px solid #eadcb0;border-radius:14px;background:#fff8e7;color:#5d4a16}.vocal-notice p{margin:4px 0 0;font-size:.85rem}.vocal-state{padding:24px}.vocal-state--error{border-color:#efc7cc}.upload-panel{padding:22px;margin-bottom:18px}.upload-grid{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:12px;margin-top:18px}.upload-grid label{display:grid;gap:7px;color:#475467;font-size:.78rem;font-weight:800}.upload-grid input{padding:0 12px;border:1px solid #dbe3ec;border-radius:10px;background:#fff;color:#172033}.upload-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:16px}.vocal-overview{display:grid;grid-template-columns:minmax(320px,.9fr) minmax(360px,1.1fr);gap:18px;margin-bottom:18px}.vocal-overview>article{padding:22px}.analysis-summary{margin:18px 0;color:#344359;font-size:1rem;line-height:1.7}.summary-columns{display:grid;grid-template-columns:1fr 1fr;gap:14px}.summary-columns>div{padding:14px;border-radius:12px;background:#f7f8fa}.summary-columns span{color:#9f1945;font-size:.7rem;font-weight:900;letter-spacing:.08em}.summary-columns ul{padding-left:18px;margin:10px 0 0;color:#475467}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}.stat-card{padding:16px}.stat-card__top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.stat-card__top span{color:#344359;font-size:.78rem;font-weight:800}.stat-card__top strong{white-space:nowrap;color:#9f1945}.stat-track{height:7px;margin:12px 0;background:#edf0f4;border-radius:999px;overflow:hidden}.stat-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#9f1945,#d9a91d)}.stat-card p{margin:0;color:#667085;font-size:.78rem}.recordings{padding:22px}.recordings__heading{display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.recordings__heading small{color:#667085}.recording-list{margin-top:18px;display:grid}.recording-row{display:grid;grid-template-columns:44px minmax(0,1fr) auto auto;gap:12px;align-items:center;padding:14px 0;border-top:1px solid #edf0f4}.recording-play{width:42px;height:42px;border:0;border-radius:50%;background:#172033;color:#fff;cursor:pointer}.recording-copy{display:grid;gap:4px}.recording-copy strong{color:#172033}.recording-copy span{color:#667085;font-size:.78rem}.analysis-chip{padding:7px 10px;border-radius:999px;background:#f2f4f7;color:#667085;font-size:.7rem;font-weight:850}.analysis-chip--completed{background:#eaf6f0;color:#20704f}.analysis-chip--processing{background:#fff8e7;color:#876810}.analysis-chip--failed{background:#fdecef;color:#a43544}.analyze-button{min-height:40px;padding:0 12px;border:1px solid #dbe3ec;border-radius:10px;background:#fff;color:#9f1945;font-weight:800;cursor:pointer}.empty-copy{margin-top:16px;padding:18px;border:1px dashed #ccd5df;border-radius:12px;background:#fafbfc;color:#667085}.recordings audio{display:none}@media(max-width:1000px){.stats-grid{grid-template-columns:repeat(2,1fr)}.vocal-overview{grid-template-columns:1fr}.upload-grid{grid-template-columns:1fr 1fr}.upload-file{grid-column:1/-1}}@media(max-width:680px){.stats-grid,.summary-columns,.upload-grid{grid-template-columns:1fr}.recording-row{grid-template-columns:42px 1fr}.analysis-chip,.analyze-button{grid-column:2}.upload-actions{display:grid;grid-template-columns:1fr}.upload-actions>*{width:100%}}
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
