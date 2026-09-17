<template>
  <section class="review">
    <nav class="review__nav" aria-label="Navegación de revisión">
      <RouterLink
        :to="`/aula/clase/${lessonId}/tarea/${taskId}/entregas`"
        class="review__back"
      >
        <span aria-hidden="true">←</span>
        Volver a entregas
      </RouterLink>
      <span class="review__crumb">Aula Virtual / Revisión de entrega</span>
    </nav>

    <section v-if="isLoading" class="state-card">
      <div class="loading-spinner"></div>
      <h1>Cargando entrega...</h1>
      <p>Sincronizando archivo y evaluación con Supabase.</p>
    </section>

    <section v-else-if="loadError" class="state-card state-card--error">
      <div class="state-card__icon">!</div>
      <h1>No pudimos cargar la entrega</h1>
      <p>{{ loadError }}</p>
      <div class="state-card__actions">
        <button type="button" @click="loadPage">Reintentar</button>
        <RouterLink :to="`/aula/clase/${lessonId}/tarea/${taskId}/entregas`">Volver</RouterLink>
      </div>
    </section>

    <section v-else-if="!isTeacher" class="state-card">
      <div class="state-card__icon">!</div>
      <h1>Vista exclusiva del profesor</h1>
      <p>La revisión de entregas está reservada al docente.</p>
    </section>

    <template v-else-if="submission && task">
      <header class="review__header">
        <div class="review__identity">
          <div class="review__avatar">{{ (submission.studentName || 'E').charAt(0).toUpperCase() }}</div>
          <div>
            <div class="review__eyebrow">
              <span>CLASE {{ lessonId }}</span>
              <span>{{ evaluationLabel }}</span>
            </div>
            <p class="review__kicker">Revisión de entrega</p>
            <h1>{{ submission.studentName }}</h1>
            <p class="review__task">{{ task.title }}</p>
          </div>
        </div>

        <aside class="review__status" :class="`review__status--${form.status}`">
          <span>ESTADO ACTUAL</span>
          <strong>{{ statusLabel }}</strong>
          <small>
            {{
              submission.reviewedAt
                ? `Última revisión: ${formatDateTime(submission.reviewedAt)}`
                : 'Pendiente de revisión docente'
            }}
          </small>
        </aside>
      </header>

      <section class="review__summary" aria-label="Resumen de la entrega">
        <div>
          <span>ARCHIVO</span>
          <strong>{{ submission.fileName || 'Sin nombre' }}</strong>
          <small>{{ fileTypeLabel }} · {{ formatFileSize(submission.fileSize) }}</small>
        </div>
        <div>
          <span>ENTREGADO</span>
          <strong>{{ submittedDate }}</strong>
          <small>{{ submittedTime }}</small>
        </div>
        <div>
          <span>EVALUACIÓN</span>
          <strong>{{ evaluationLabel }}</strong>
          <small>{{ usesRubric ? 'Con criterios de rúbrica' : usesGrade ? 'Con calificación' : 'Revisión y feedback' }}</small>
        </div>
        <div v-if="usesGrade">
          <span>NOTA</span>
          <strong>{{ form.grade || '—' }}</strong>
          <small>Escala 1,0–7,0</small>
        </div>
        <div v-if="usesRubric && rubricCriteria.length">
          <span>RÚBRICA</span>
          <strong>{{ rubricAverage }}/5</strong>
          <small>{{ rubricPerformanceLabel }}</small>
        </div>
      </section>

      <div class="review__layout">
        <aside class="review-file">
          <header class="card-heading">
            <div>
              <p>ENTREGA DEL ESTUDIANTE</p>
              <h2>Archivo entregado</h2>
            </div>
            <span class="private-chip">PRIVADO</span>
          </header>

          <div class="file-card">
            <div class="file-card__icon">{{ fileTypeLabel.charAt(0) }}</div>
            <div class="file-card__copy">
              <strong>{{ submission.fileName || 'Archivo del estudiante' }}</strong>
              <span>{{ fileTypeLabel }} · {{ formatFileSize(submission.fileSize) }}</span>
            </div>
          </div>

          <dl class="file-meta">
            <div><dt>Estudiante</dt><dd>{{ submission.studentName }}</dd></div>
            <div><dt>Entrega</dt><dd>{{ formatDateTime(submission.submittedAt) }}</dd></div>
            <div><dt>Actividad</dt><dd>{{ task.title }}</dd></div>
          </dl>

          <button
            type="button"
            class="review-file__open"
            :disabled="isOpeningFile"
            @click="openFile"
          >
            {{ isOpeningFile ? 'Preparando acceso...' : 'Abrir archivo entregado' }}
            <span aria-hidden="true">↗</span>
          </button>

          <div class="security-note">
            <span>✓</span>
            <div>
              <strong>Acceso seguro y temporal</strong>
              <p>El archivo se abre mediante una URL firmada temporal desde el almacenamiento privado.</p>
            </div>
          </div>
        </aside>

        <main class="evaluation">
          <form @submit.prevent="saveReview">
            <header class="card-heading evaluation__heading">
              <div>
                <p>EVALUACIÓN DOCENTE</p>
                <h2>Revisión del profesor</h2>
                <small>{{ evaluationLabel }}</small>
              </div>
              <span class="save-chip">SUPABASE</span>
            </header>

            <div
              v-if="saveMessage"
              class="evaluation__message"
              :class="{ 'evaluation__message--error': saveMessageType === 'error' }"
            >
              {{ saveMessage }}
            </div>

            <section class="evaluation-section">
              <div class="section-title">
                <span>01</span>
                <div><small>ESTADO</small><h3>Resultado de la revisión</h3></div>
              </div>
              <div class="form-group">
                <label for="status">Estado de la entrega</label>
                <select id="status" v-model="form.status">
                  <option value="delivered">Entregado</option>
                  <option value="reviewed">Revisado</option>
                  <option value="returned">Devuelto para corregir</option>
                </select>
                <small>“Revisado” completa la revisión. “Devuelto” solicita una nueva corrección al estudiante.</small>
              </div>
            </section>

            <section v-if="usesRubric" class="evaluation-section">
              <div class="section-title">
                <span>02</span>
                <div>
                  <small>{{ evaluationType === 'vocal_rubric' ? 'RÚBRICA VOCAL' : 'RÚBRICA' }}</small>
                  <h3>Criterios de evaluación</h3>
                </div>
              </div>

              <div v-if="rubricCriteria.length" class="rubric">
                <article v-for="criterion in rubricCriteria" :key="criterion.key" class="rubric__item">
                  <div class="rubric__top">
                    <div>
                      <strong>{{ criterion.label }}</strong>
                      <small>{{ criterion.description }}</small>
                    </div>
                    <label>
                      <select v-model.number="form.rubric[criterion.key]" :aria-label="criterion.label">
                        <option :value="1">1</option>
                        <option :value="2">2</option>
                        <option :value="3">3</option>
                        <option :value="4">4</option>
                        <option :value="5">5</option>
                      </select>
                      <span>/ 5</span>
                    </label>
                  </div>
                  <div class="rubric__bar">
                    <div :style="{ width: `${(Number(form.rubric[criterion.key]) / 5) * 100}%` }"></div>
                  </div>
                </article>

                <div class="rubric-summary">
                  <div><span>PROMEDIO</span><strong>{{ rubricAverage }}/5</strong></div>
                  <div><span>REFERENCIA</span><strong>{{ rubricPerformanceLabel }}</strong></div>
                </div>
              </div>

              <div v-else class="empty-rubric">
                <strong>Esta rúbrica aún no tiene criterios configurados.</strong>
                <p>Puedes guardar estado, nota y retroalimentación sin inventar criterios de evaluación.</p>
              </div>
            </section>

            <section v-if="usesGrade" class="evaluation-section">
              <div class="section-title">
                <span>{{ usesRubric ? '03' : '02' }}</span>
                <div><small>CALIFICACIÓN</small><h3>Nota final</h3></div>
              </div>
              <div class="grade-row">
                <div class="form-group">
                  <label for="grade">Nota final</label>
                  <input id="grade" v-model="form.grade" type="number" min="1" max="7" step="0.1" placeholder="Ej: 6.5">
                  <small>Escala chilena de 1,0 a 7,0.</small>
                </div>
                <div class="grade-preview"><span>NOTA</span><strong>{{ form.grade || '—' }}</strong></div>
              </div>
            </section>

            <section class="evaluation-section">
              <div class="section-title">
                <span>{{ usesRubric ? '04' : usesGrade ? '03' : '02' }}</span>
                <div><small>RETROALIMENTACIÓN</small><h3>Comentario para el estudiante</h3></div>
              </div>
              <div class="form-group">
                <label for="feedback">Observaciones del profesor</label>
                <textarea
                  id="feedback"
                  v-model.trim="form.feedback"
                  rows="7"
                  placeholder="Escribe una retroalimentación clara, concreta y útil para el estudiante..."
                ></textarea>
                <small>Este comentario aparecerá en la vista de la tarea del estudiante.</small>
              </div>
            </section>

            <footer class="evaluation__footer">
              <RouterLink :to="`/aula/clase/${lessonId}/tarea/${taskId}/entregas`" class="evaluation__cancel">
                Cancelar
              </RouterLink>
              <button type="submit" class="evaluation__save" :disabled="isSaving">
                {{ isSaving ? 'Guardando...' : 'Guardar revisión' }}
              </button>
            </footer>
          </form>
        </main>
      </div>
    </template>
  </section>
</template>


<script setup>
import {
  computed,
  onMounted,
  reactive,
  ref,
  watch
} from 'vue'

import {
  RouterLink,
  useRoute,
  useRouter
} from 'vue-router'

import {
  useAuth
} from '@/composables/useAuth'

import {
  fetchAssignmentById
} from '@/services/assignmentService'

import {
  createSubmissionSignedUrl,
  fetchSubmissionsByAssignment,
  updateSubmission
} from '@/services/submissionService'

const route = useRoute()
const router = useRouter()

const {
  isTeacher
} = useAuth()

const lessonId = computed(() =>
  Number(route.params.id)
)

const taskId = computed(() =>
  Number(route.params.taskId)
)

const submissionId = computed(() =>
  Number(route.params.submissionId)
)

const task = ref(null)
const submission = ref(null)

const isLoading = ref(true)
const loadError = ref('')
const isSaving = ref(false)
const isOpeningFile = ref(false)

const saveMessage = ref('')
const saveMessageType = ref('success')

const vocalRubricCriteria = [
  { key: 'tuning', label: 'Afinación', description: 'Precisión, estabilidad y control de las alturas.' },
  { key: 'rhythm', label: 'Ritmo', description: 'Pulso, entradas, duración y precisión rítmica.' },
  { key: 'breathing', label: 'Respiración', description: 'Administración del aire y manejo de las frases.' },
  { key: 'diction', label: 'Dicción', description: 'Claridad del texto, consonantes y articulación.' },
  { key: 'interpretation', label: 'Interpretación', description: 'Expresión, intención, fraseo y musicalidad.' }
]

const evaluationType = computed(() =>
  task.value?.evaluationType || 'simple'
)

const usesGrade = computed(() =>
  ['graded', 'vocal_rubric', 'custom_rubric'].includes(evaluationType.value)
)

const usesRubric = computed(() =>
  ['vocal_rubric', 'custom_rubric'].includes(evaluationType.value)
)

const evaluationLabel = computed(() => {
  const labels = {
    simple: 'Entrega simple',
    graded: 'Calificada',
    vocal_rubric: 'Rúbrica vocal',
    custom_rubric: 'Rúbrica personalizada'
  }
  return labels[evaluationType.value] || 'Entrega simple'
})

const customCriteria = computed(() => {
  const config = task.value?.rubricConfig || {}
  const raw = Array.isArray(config) ? config : config.criteria
  if (!Array.isArray(raw)) return []
  return raw
    .map((item, index) => ({
      key: String(item?.key || item?.id || `criterion_${index + 1}`),
      label: String(item?.label || item?.name || `Criterio ${index + 1}`),
      description: String(item?.description || '')
    }))
    .filter(item => item.key)
})

const rubricCriteria = computed(() => {
  if (evaluationType.value === 'custom_rubric' && customCriteria.value.length) {
    return customCriteria.value
  }
  return evaluationType.value === 'vocal_rubric'
    ? vocalRubricCriteria
    : []
})

const form = reactive({
  status: 'delivered',
  grade: '',
  feedback: '',
  rubric: {
    tuning: 3,
    rhythm: 3,
    breathing: 3,
    diction: 3,
    interpretation: 3
  }
})

const hydrateForm = value => {
  form.status =
    value?.status ||
    'delivered'

  form.grade =
    value?.grade ??
    ''

  form.feedback =
    value?.feedback ||
    ''

  form.rubric.tuning =
    Number(value?.rubric?.tuning ?? 3)

  form.rubric.rhythm =
    Number(value?.rubric?.rhythm ?? 3)

  form.rubric.breathing =
    Number(value?.rubric?.breathing ?? 3)

  form.rubric.diction =
    Number(value?.rubric?.diction ?? 3)

  form.rubric.interpretation =
    Number(value?.rubric?.interpretation ?? 3)

  rubricCriteria.value.forEach(criterion => {
    if (!(criterion.key in form.rubric)) {
      form.rubric[criterion.key] =
        Number(value?.rubric?.[criterion.key] ?? 3)
    }
  })
}

const loadPage = async () => {
  isLoading.value = true
  loadError.value = ''
  saveMessage.value = ''

  try {
    const [
      loadedTask,
      loadedSubmissions
    ] = await Promise.all([
      fetchAssignmentById(taskId.value),
      fetchSubmissionsByAssignment(taskId.value)
    ])

    if (
      !loadedTask ||
      Number(loadedTask.lessonId) !== lessonId.value
    ) {
      throw new Error(
        'La tarea no corresponde a esta clase.'
      )
    }

    const loadedSubmission =
      (loadedSubmissions || []).find(
        item =>
          Number(item.id) === submissionId.value
      )

    if (!loadedSubmission) {
      throw new Error(
        'No pudimos encontrar esta entrega.'
      )
    }

    task.value = loadedTask
    submission.value = loadedSubmission

    hydrateForm(
      loadedSubmission
    )
  } catch (error) {
    console.error(
      'Error cargando revisión:',
      error
    )

    task.value = null
    submission.value = null

    loadError.value =
      error?.message ||
      'No se pudo cargar la entrega desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

const rubricAverage = computed(() => {
  const values =
    rubricCriteria.value
      .map(criterion => Number(form.rubric[criterion.key]))
      .filter(Number.isFinite)

  if (!values.length) {
    return '0.0'
  }

  const total =
    values.reduce(
      (sum, value) =>
        sum + value,
      0
    )

  return (
    total / values.length
  ).toFixed(1)
})

const rubricPerformanceLabel = computed(() => {
  const value =
    Number(rubricAverage.value)

  if (value >= 4.5) {
    return 'Excelente'
  }

  if (value >= 3.8) {
    return 'Muy buen desempeño'
  }

  if (value >= 3) {
    return 'Adecuado'
  }

  if (value >= 2) {
    return 'En desarrollo'
  }

  return 'Requiere refuerzo'
})

const statusLabel = computed(() => {
  const labels = {
    delivered: 'ENTREGADO',
    reviewed: 'REVISADO',
    returned: 'DEVUELTO'
  }

  return (
    labels[form.status] ||
    String(form.status || '').toUpperCase()
  )
})

const fileTypeLabel = computed(() => {
  const mime =
    String(
      submission.value?.mimeType ||
      ''
    ).toLowerCase()

  if (mime.startsWith('audio/')) {
    return 'Audio'
  }

  if (mime.startsWith('video/')) {
    return 'Video'
  }

  if (
    mime.includes('pdf') ||
    mime.includes('document') ||
    mime.includes('word')
  ) {
    return 'Documento'
  }

  return (
    submission.value?.mimeType ||
    'Archivo'
  )
})

const submittedDate = computed(() => {
  if (!submission.value?.submittedAt) {
    return 'Sin fecha'
  }

  try {
    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium'
      }
    ).format(
      new Date(
        submission.value.submittedAt
      )
    )
  } catch {
    return 'Sin fecha'
  }
})

const submittedTime = computed(() => {
  if (!submission.value?.submittedAt) {
    return ''
  }

  try {
    return new Intl.DateTimeFormat(
      'es-CL',
      {
        timeStyle: 'short'
      }
    ).format(
      new Date(
        submission.value.submittedAt
      )
    )
  } catch {
    return ''
  }
})

const openFile = async () => {
  if (
    !submission.value?.storagePath ||
    isOpeningFile.value
  ) {
    return
  }

  isOpeningFile.value = true
  saveMessage.value = ''

  try {
    const signedUrl =
      await createSubmissionSignedUrl(
        submission.value.storagePath,
        3600
      )

    if (!signedUrl) {
      throw new Error(
        'No se pudo generar el enlace temporal.'
      )
    }

    window.open(
      signedUrl,
      '_blank',
      'noopener,noreferrer'
    )
  } catch (error) {
    console.error(
      'Error abriendo archivo:',
      error
    )

    saveMessageType.value =
      'error'

    saveMessage.value =
      error?.message ||
      'No se pudo abrir el archivo.'
  } finally {
    isOpeningFile.value = false
  }
}

const saveReview = async () => {
  if (!submission.value || isSaving.value) return

  isSaving.value = true
  saveMessage.value = ''
  saveMessageType.value = 'success'

  try {
    let gradeValue = ''

    if (usesGrade.value) {
      gradeValue =
        form.grade === '' || form.grade === null
          ? ''
          : String(form.grade)

      if (gradeValue !== '') {
        const numericGrade = Number(gradeValue)

        if (
          !Number.isFinite(numericGrade) ||
          numericGrade < 1 ||
          numericGrade > 7
        ) {
          throw new Error('La nota debe estar entre 1,0 y 7,0.')
        }
      }
    }

    let rubricValue = null

    if (usesRubric.value && rubricCriteria.value.length) {
      rubricValue = rubricCriteria.value.reduce((result, criterion) => {
        result[criterion.key] = Number(form.rubric[criterion.key] ?? 3)
        return result
      }, {})
    }

    const updated = await updateSubmission(
      submission.value.id,
      {
        status: form.status,
        grade: gradeValue,
        feedback: form.feedback,
        rubric: rubricValue,
        reviewedAt: new Date().toISOString()
      }
    )

    submission.value = updated
    hydrateForm(updated)

    saveMessage.value = 'Revisión guardada correctamente.'

    setTimeout(() => {
      router.push(
        `/aula/clase/${lessonId.value}/tarea/${taskId.value}/entregas`
      )
    }, 500)
  } catch (error) {
    console.error('Error guardando evaluación:', error)
    saveMessageType.value = 'error'
    saveMessage.value =
      error?.message ||
      'No se pudo guardar la evaluación.'
  } finally {
    isSaving.value = false
  }
}

const formatDateTime = value => {
  if (!value) {
    return 'Sin fecha'
  }

  try {
    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    ).format(
      new Date(value)
    )
  } catch {
    return value
  }
}

const formatFileSize = bytes => {
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
      value / 1024
    ).toFixed(1)} KB`
  }

  return `${(
    value /
    (1024 * 1024)
  ).toFixed(1)} MB`
}

watch(
  () => [
    route.params.id,
    route.params.taskId,
    route.params.submissionId
  ],
  () => {
    loadPage()
  }
)

onMounted(() => {
  loadPage()
})
</script>

<style scoped>
.review {
  --ink:#172033; --body:#344359; --muted:#667085; --line:#dbe3ec;
  --canvas:#f5f7fb; --wine:#9f1945; --wine-dark:#7f1237; --gold:#d9a91d;
  --green:#2d8a63; --red:#be4856;
  min-height:100%; padding:clamp(18px,3vw,34px); color:var(--body);
  background:var(--canvas);
}
.review__nav { display:flex; align-items:center; justify-content:space-between; gap:16px; margin:0 auto 18px; max-width:1440px; }
.review__back { display:inline-flex; align-items:center; gap:9px; color:var(--ink); font-weight:800; text-decoration:none; }
.review__back:hover { color:var(--wine); }
.review__crumb { color:var(--muted); font-size:.76rem; }
.review__header {
  max-width:1440px; margin:0 auto; padding:25px 28px; display:flex; justify-content:space-between; gap:24px; align-items:center;
  border:1px solid var(--line); border-radius:20px; background:#fff; box-shadow:0 12px 32px rgba(31,48,73,.06);
}
.review__identity { display:flex; align-items:center; gap:18px; min-width:0; }
.review__avatar { display:grid; place-items:center; width:62px; height:62px; flex:0 0 auto; border-radius:18px; color:#fff; background:linear-gradient(145deg,var(--wine),var(--wine-dark)); font-size:1.55rem; font-weight:900; box-shadow:0 9px 20px rgba(159,25,69,.2); }
.review__eyebrow { display:flex; flex-wrap:wrap; gap:7px; margin-bottom:7px; }
.review__eyebrow span { padding:5px 8px; border:1px solid #ead8a4; border-radius:999px; color:#8c6807; background:#fff9e9; font-size:.59rem; font-weight:900; letter-spacing:.08em; text-transform:uppercase; }
.review__kicker { margin:0 0 3px; color:var(--wine); font-size:.68rem; font-weight:900; letter-spacing:.11em; text-transform:uppercase; }
.review__header h1 { margin:0; color:var(--ink); font-size:clamp(1.55rem,3vw,2.35rem); line-height:1.05; }
.review__task { margin:7px 0 0; color:var(--muted); font-size:.92rem; }
.review__status { min-width:220px; padding:15px 17px; border:1px solid #ead8a4; border-radius:15px; background:#fffaf0; }
.review__status span,.review__status strong,.review__status small { display:block; }
.review__status span { color:#9a7312; font-size:.59rem; font-weight:900; letter-spacing:.1em; }
.review__status strong { margin:4px 0; color:var(--ink); font-size:.9rem; }
.review__status small { color:var(--muted); font-size:.68rem; line-height:1.4; }
.review__status--reviewed { border-color:#bfe2d3; background:#f1faf6; }
.review__status--reviewed strong { color:var(--green); }
.review__status--returned { border-color:#efcbd0; background:#fff5f6; }
.review__status--returned strong { color:var(--red); }

.review__summary { max-width:1440px; margin:14px auto 0; display:flex; flex-wrap:wrap; gap:0; overflow:hidden; border:1px solid var(--line); border-radius:16px; background:#fff; }
.review__summary > div { min-width:170px; flex:1 1 180px; padding:15px 18px; border-right:1px solid #edf1f5; }
.review__summary > div:last-child { border-right:0; }
.review__summary span,.review__summary strong,.review__summary small { display:block; }
.review__summary span { color:var(--muted); font-size:.58rem; font-weight:900; letter-spacing:.09em; }
.review__summary strong { margin-top:4px; overflow:hidden; color:var(--ink); font-size:.83rem; text-overflow:ellipsis; white-space:nowrap; }
.review__summary small { margin-top:2px; color:var(--muted); font-size:.67rem; }

.review__layout { max-width:1440px; margin:18px auto 0; display:grid; grid-template-columns:minmax(300px,.8fr) minmax(520px,1.4fr); gap:18px; align-items:start; }
.review-file,.evaluation { border:1px solid var(--line); border-radius:18px; background:#fff; box-shadow:0 10px 28px rgba(31,48,73,.045); }
.review-file { padding:22px; position:sticky; top:18px; }
.evaluation form { padding:22px; }
.card-heading { display:flex; justify-content:space-between; gap:16px; align-items:flex-start; padding-bottom:17px; border-bottom:1px solid #edf1f5; }
.card-heading p { margin:0 0 4px; color:var(--wine); font-size:.61rem; font-weight:900; letter-spacing:.1em; }
.card-heading h2 { margin:0; color:var(--ink); font-size:1.08rem; }
.card-heading small { display:block; margin-top:5px; color:var(--muted); }
.private-chip,.save-chip { padding:6px 8px; border:1px solid #ead8a4; border-radius:999px; color:#8c6807; background:#fff9e9; font-size:.56rem; font-weight:900; letter-spacing:.08em; }

.file-card { display:flex; gap:13px; align-items:center; margin:18px 0; padding:15px; border:1px solid #e3e9f0; border-radius:14px; background:#f8fafc; }
.file-card__icon { display:grid; place-items:center; width:44px; height:44px; flex:0 0 auto; border-radius:12px; color:#fff; background:var(--wine); font-weight:900; }
.file-card__copy { min-width:0; }
.file-card__copy strong,.file-card__copy span { display:block; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.file-card__copy strong { color:var(--ink); font-size:.82rem; }
.file-card__copy span { margin-top:4px; color:var(--muted); font-size:.68rem; }
.file-meta { margin:0 0 18px; }
.file-meta div { display:flex; justify-content:space-between; gap:14px; padding:11px 0; border-bottom:1px solid #edf1f5; }
.file-meta dt { color:var(--muted); font-size:.68rem; }
.file-meta dd { margin:0; max-width:65%; color:var(--ink); font-size:.69rem; font-weight:750; text-align:right; }
.review-file__open { width:100%; min-height:44px; display:flex; justify-content:center; align-items:center; gap:8px; border:0; border-radius:12px; color:#fff; background:var(--wine); font:inherit; font-size:.75rem; font-weight:850; cursor:pointer; }
.review-file__open:hover:not(:disabled),.evaluation__save:hover:not(:disabled) { background:var(--wine-dark); transform:translateY(-1px); }
.review-file__open:disabled,.evaluation__save:disabled { opacity:.6; cursor:not-allowed; }
.security-note { display:flex; gap:10px; margin-top:15px; padding:13px; border:1px solid #dce8e2; border-radius:12px; background:#f6fbf8; }
.security-note > span { color:var(--green); font-weight:900; }
.security-note strong { display:block; color:var(--ink); font-size:.69rem; }
.security-note p { margin:3px 0 0; color:var(--muted); font-size:.64rem; line-height:1.45; }

.evaluation__message { margin:16px 0 0; padding:11px 13px; border:1px solid #bfe2d3; border-radius:11px; color:#246f51; background:#f1faf6; font-size:.72rem; font-weight:700; }
.evaluation__message--error { border-color:#efcbd0; color:#a33b48; background:#fff5f6; }
.evaluation-section { padding:22px 0; border-bottom:1px solid #edf1f5; }
.section-title { display:flex; gap:11px; align-items:center; margin-bottom:16px; }
.section-title > span { display:grid; place-items:center; width:31px; height:31px; border:1px solid #ead8a4; border-radius:9px; color:#9a7312; background:#fff9e9; font-size:.63rem; font-weight:900; }
.section-title small { display:block; color:var(--wine); font-size:.57rem; font-weight:900; letter-spacing:.09em; }
.section-title h3 { margin:2px 0 0; color:var(--ink); font-size:.9rem; }
.form-group label { display:block; margin-bottom:7px; color:var(--ink); font-size:.7rem; font-weight:800; }
.form-group select,.form-group input,.form-group textarea,.rubric select { width:100%; border:1px solid #cfd8e3; border-radius:11px; outline:0; color:var(--ink); background:#fff; font:inherit; }
.form-group select,.form-group input { height:43px; padding:0 12px; }
.form-group textarea { min-height:140px; padding:12px; resize:vertical; line-height:1.55; }
.form-group select:focus,.form-group input:focus,.form-group textarea:focus,.rubric select:focus { border-color:rgba(159,25,69,.6); box-shadow:0 0 0 3px rgba(159,25,69,.08); }
.form-group > small { display:block; margin-top:6px; color:var(--muted); font-size:.64rem; line-height:1.45; }

.rubric { display:grid; gap:10px; }
.rubric__item { padding:14px; border:1px solid #e1e7ee; border-radius:13px; background:#fbfcfe; }
.rubric__top { display:flex; justify-content:space-between; gap:16px; align-items:center; }
.rubric__top strong { display:block; color:var(--ink); font-size:.76rem; }
.rubric__top small { display:block; margin-top:3px; color:var(--muted); font-size:.63rem; line-height:1.35; }
.rubric__top label { display:flex; align-items:center; gap:6px; flex:0 0 auto; color:var(--muted); font-size:.68rem; }
.rubric__top select { width:58px; height:36px; padding:0 8px; }
.rubric__bar { height:5px; margin-top:11px; overflow:hidden; border-radius:999px; background:#e8edf3; }
.rubric__bar div { height:100%; border-radius:inherit; background:linear-gradient(90deg,var(--wine),var(--gold)); transition:width .2s ease; }
.rubric-summary { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:2px; }
.rubric-summary > div { padding:12px 14px; border:1px solid #ead8a4; border-radius:11px; background:#fffaf0; }
.rubric-summary span,.rubric-summary strong { display:block; }
.rubric-summary span { color:#9a7312; font-size:.55rem; font-weight:900; letter-spacing:.08em; }
.rubric-summary strong { margin-top:3px; color:var(--ink); font-size:.78rem; }
.empty-rubric { padding:16px; border:1px dashed #cbd5e1; border-radius:12px; background:#f8fafc; }
.empty-rubric strong { color:var(--ink); font-size:.76rem; }
.empty-rubric p { margin:5px 0 0; color:var(--muted); font-size:.67rem; line-height:1.5; }

.grade-row { display:grid; grid-template-columns:minmax(0,1fr) 110px; gap:12px; align-items:end; }
.grade-preview { display:grid; min-height:72px; place-items:center; align-content:center; border:1px solid #ead8a4; border-radius:12px; background:#fffaf0; }
.grade-preview span { color:#9a7312; font-size:.56rem; font-weight:900; letter-spacing:.08em; }
.grade-preview strong { margin-top:2px; color:var(--wine); font-size:1.25rem; }
.evaluation__footer { display:flex; justify-content:flex-end; gap:10px; padding-top:20px; }
.evaluation__cancel,.evaluation__save { min-height:42px; padding:0 17px; border-radius:11px; font:inherit; font-size:.72rem; font-weight:850; text-decoration:none; }
.evaluation__cancel { display:inline-flex; align-items:center; border:1px solid #d4dce6; color:var(--ink); background:#fff; }
.evaluation__save { border:0; color:#fff; background:var(--wine); cursor:pointer; }

.state-card { max-width:760px; margin:80px auto; padding:38px; border:1px solid var(--line); border-radius:18px; background:#fff; text-align:center; }
.state-card h1 { color:var(--ink); }
.state-card p { color:var(--muted); }
.state-card__icon { display:grid; width:44px; height:44px; margin:0 auto; place-items:center; border-radius:50%; color:#fff; background:var(--wine); font-weight:900; }
.state-card__actions { display:flex; justify-content:center; gap:10px; margin-top:18px; }
.state-card__actions a,.state-card__actions button { padding:10px 14px; border:1px solid var(--line); border-radius:10px; color:var(--ink); background:#fff; font:inherit; font-weight:800; text-decoration:none; cursor:pointer; }
.loading-spinner { width:36px; height:36px; margin:0 auto 15px; border:3px solid #e5eaf0; border-top-color:var(--wine); border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

@media (max-width:1000px) {
  .review__layout { grid-template-columns:1fr; }
  .review-file { position:static; }
}
@media (max-width:700px) {
  .review { padding:14px; }
  .review__crumb { display:none; }
  .review__header { align-items:flex-start; flex-direction:column; padding:20px; }
  .review__status { width:100%; min-width:0; }
  .review__summary { display:grid; grid-template-columns:1fr 1fr; }
  .review__summary > div { min-width:0; border-bottom:1px solid #edf1f5; }
  .evaluation form,.review-file { padding:17px; }
  .rubric__top { align-items:flex-start; }
}
@media (max-width:480px) {
  .review__identity { align-items:flex-start; }
  .review__avatar { width:48px; height:48px; border-radius:14px; }
  .review__summary { grid-template-columns:1fr; }
  .grade-row,.rubric-summary { grid-template-columns:1fr; }
  .evaluation__footer { flex-direction:column-reverse; }
  .evaluation__cancel,.evaluation__save { justify-content:center; width:100%; }
}
@media (prefers-reduced-motion:reduce) {
  * { scroll-behavior:auto !important; transition:none !important; animation-duration:.01ms !important; }
}
</style>
