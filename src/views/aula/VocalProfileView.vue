<template>
  <section class="vocal-page amv-page-shell">
    <div v-if="loading" class="vocal-state amv-card">Preparando el perfil vocal…</div>
    <div v-else-if="errorMessage" class="vocal-state vocal-state--error amv-card">
      <strong>No pudimos cargar el perfil vocal</strong><p>{{ errorMessage }}</p><button class="amv-secondary-action" @click="load">Reintentar</button>
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
          <label class="upload-file"><span>Archivo de audio</span><input type="file" accept="audio/*" @change="onFile" /></label>
        </div>
        <div class="upload-actions">
          <button type="button" class="amv-secondary-action" @click="uploadOpen=false">Cancelar</button>
          <button type="button" class="amv-primary-action" :disabled="uploading || !uploadForm.file" @click="handleUpload">{{ uploading ? 'Subiendo…' : 'Subir grabación' }}</button>
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
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
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
const uploadForm = reactive({ title: '', song: '', file: null })

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
const handleUpload = async () => {
  if (!uploadForm.file) return
  uploading.value = true
  try {
    await uploadVocalRecording({ studentId: studentId.value, file: uploadForm.file, title: uploadForm.title, song: uploadForm.song })
    uploadForm.title = ''; uploadForm.song = ''; uploadForm.file = null; uploadOpen.value = false
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
.vocal-page{padding-bottom:56px}.vocal-back{display:inline-flex;margin-bottom:18px;color:#667085;text-decoration:none;font-weight:750}.vocal-notice{margin-bottom:18px;padding:14px 16px;border:1px solid #eadcb0;border-radius:14px;background:#fff8e7;color:#5d4a16}.vocal-notice p{margin:4px 0 0;font-size:.85rem}.vocal-state{padding:24px}.vocal-state--error{border-color:#efc7cc}.upload-panel{padding:22px;margin-bottom:18px}.upload-grid{display:grid;grid-template-columns:1fr 1fr 1.3fr;gap:12px;margin-top:18px}.upload-grid label{display:grid;gap:7px;color:#475467;font-size:.78rem;font-weight:800}.upload-grid input{padding:0 12px;border:1px solid #dbe3ec;border-radius:10px;background:#fff;color:#172033}.upload-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:16px}.vocal-overview{display:grid;grid-template-columns:minmax(320px,.9fr) minmax(360px,1.1fr);gap:18px;margin-bottom:18px}.vocal-overview>article{padding:22px}.analysis-summary{margin:18px 0;color:#344359;font-size:1rem;line-height:1.7}.summary-columns{display:grid;grid-template-columns:1fr 1fr;gap:14px}.summary-columns>div{padding:14px;border-radius:12px;background:#f7f8fa}.summary-columns span{color:#9f1945;font-size:.7rem;font-weight:900;letter-spacing:.08em}.summary-columns ul{padding-left:18px;margin:10px 0 0;color:#475467}.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:18px}.stat-card{padding:16px}.stat-card__top{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.stat-card__top span{color:#344359;font-size:.78rem;font-weight:800}.stat-card__top strong{white-space:nowrap;color:#9f1945}.stat-track{height:7px;margin:12px 0;background:#edf0f4;border-radius:999px;overflow:hidden}.stat-track i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,#9f1945,#d9a91d)}.stat-card p{margin:0;color:#667085;font-size:.78rem}.recordings{padding:22px}.recordings__heading{display:flex;align-items:flex-end;justify-content:space-between;gap:20px}.recordings__heading small{color:#667085}.recording-list{margin-top:18px;display:grid}.recording-row{display:grid;grid-template-columns:44px minmax(0,1fr) auto auto;gap:12px;align-items:center;padding:14px 0;border-top:1px solid #edf0f4}.recording-play{width:42px;height:42px;border:0;border-radius:50%;background:#172033;color:#fff;cursor:pointer}.recording-copy{display:grid;gap:4px}.recording-copy strong{color:#172033}.recording-copy span{color:#667085;font-size:.78rem}.analysis-chip{padding:7px 10px;border-radius:999px;background:#f2f4f7;color:#667085;font-size:.7rem;font-weight:850}.analysis-chip--completed{background:#eaf6f0;color:#20704f}.analysis-chip--processing{background:#fff8e7;color:#876810}.analysis-chip--failed{background:#fdecef;color:#a43544}.analyze-button{min-height:40px;padding:0 12px;border:1px solid #dbe3ec;border-radius:10px;background:#fff;color:#9f1945;font-weight:800;cursor:pointer}.empty-copy{margin-top:16px;padding:18px;border:1px dashed #ccd5df;border-radius:12px;background:#fafbfc;color:#667085}.recordings audio{display:none}@media(max-width:1000px){.stats-grid{grid-template-columns:repeat(2,1fr)}.vocal-overview{grid-template-columns:1fr}.upload-grid{grid-template-columns:1fr 1fr}.upload-file{grid-column:1/-1}}@media(max-width:680px){.stats-grid,.summary-columns,.upload-grid{grid-template-columns:1fr}.recording-row{grid-template-columns:42px 1fr}.analysis-chip,.analyze-button{grid-column:2}.upload-actions{display:grid;grid-template-columns:1fr}.upload-actions>*{width:100%}}
</style>
