<template>
  <section class="vocal-evaluation-page">
    <section class="vocal-hero">
      <div class="vocal-hero__glow vocal-hero__glow--wine"></div>
      <div class="vocal-hero__glow vocal-hero__glow--gold"></div>
      <div class="vocal-hero__wave vocal-hero__wave--one"></div>
      <div class="vocal-hero__wave vocal-hero__wave--two"></div>
      <div class="vocal-hero__particles" aria-hidden="true">
        <i v-for="n in 10" :key="n" :style="{ '--i': n }"></i>
      </div>

      <div class="vocal-hero__copy">
        <span class="vocal-kicker">
          <i></i>
          AMV VOCAL ENGINE · EVALUACIÓN VOCAL
        </span>

        <h1>
          Tu voz.
          <span>Tu evolución.</span>
        </h1>

        <p>
          Un espacio dedicado exclusivamente a comprender tu desarrollo vocal
          a partir de los análisis realizados por AMV.
        </p>

        <div class="vocal-hero__chips">
          <span>8 dimensiones</span>
          <span>Evidencia acústica</span>
          <span>Progreso pedagógico</span>
        </div>
      </div>

      <div class="vocal-hero__score">
        <div class="vocal-score-ring" :class="{ 'is-ready': amvHasResult }">
          <div>
            <strong>{{ amvOverall ?? '—' }}</strong>
            <small>{{ amvOverall !== null ? 'Índice AMV' : 'Pendiente' }}</small>
          </div>
        </div>
        <span>{{ amvHasResult ? 'ÚLTIMO ANÁLISIS' : 'SIN ANÁLISIS CONECTADO' }}</span>
      </div>
    </section>

    <section class="vocal-intro">
      <div>
        <span class="vocal-section-label">EVALUACIÓN VOCAL</span>
        <h2>Tu perfil vocal</h2>
        <p>
          Aquí aparecerán tus resultados AMV, fortalezas y prioridades de
          práctica. No reemplaza la evaluación docente: la complementa con
          evidencia acústica.
        </p>
      </div>

      <div class="vocal-engine-status" :class="{ 'is-ready': amvHasResult }">
        <span></span>
        {{ amvHasResult ? 'ANÁLISIS DISPONIBLE' : 'MOTOR LISTO PARA CONECTAR' }}
      </div>
    </section>

    <template v-if="amvHasResult">
      <section class="vocal-metrics">
        <article>
          <span>RANGO OBSERVADO</span>
          <strong>{{ amvMeta.range }}</strong>
          <small>registro detectado por AMV</small>
        </article>

        <article>
          <span>ESTABILIDAD</span>
          <strong>{{ amvMeta.stability }}</strong>
          <small>comportamiento de la voz</small>
        </article>

        <article>
          <span>CONFIANZA</span>
          <strong>{{ amvMeta.confidence }}</strong>
          <small>calidad de la evidencia</small>
        </article>
      </section>

      <section class="vocal-panel vocal-panel--analysis">
        <div class="vocal-signal" aria-hidden="true">
          <span v-for="n in 28" :key="n" :style="{ '--i': n }"></span>
        </div>

        <header class="vocal-panel__header">
          <div>
            <span class="vocal-section-label">AMV ANALYSIS</span>
            <h2>Las 8 dimensiones de tu voz</h2>
          </div>
          <span class="vocal-panel__count">
            {{ amvAvailableDimensions.length }}/8 disponibles
          </span>
        </header>

        <div class="vocal-dimensions">
          <article
            v-for="dimension in amvDimensions"
            :key="dimension.key"
            class="vocal-dimension"
            :class="{ 'is-pending': !Number.isFinite(amvValue(dimension.key)) }"
          >
            <div class="vocal-dimension__icon">{{ dimension.icon }}</div>

            <div class="vocal-dimension__body">
              <div class="vocal-dimension__title">
                <strong>{{ dimension.label }}</strong>
                <b>
                  {{
                    Number.isFinite(amvValue(dimension.key))
                      ? `${amvValue(dimension.key)}%`
                      : 'Pendiente'
                  }}
                </b>
              </div>

              <div class="vocal-dimension__track">
                <span
                  :style="{
                    width: Number.isFinite(amvValue(dimension.key))
                      ? `${amvValue(dimension.key)}%`
                      : '0%'
                  }"
                ></span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section class="vocal-bottom-grid">
        <article class="vocal-insight vocal-insight--strength">
          <span>FORTALEZAS</span>
          <h3>Lo que estás construyendo</h3>
          <p>
            Cuando AMV entregue suficientes dimensiones, aquí se destacarán
            automáticamente tus áreas más sólidas.
          </p>
        </article>

        <article class="vocal-insight vocal-insight--focus">
          <span>PRÓXIMO FOCO</span>
          <h3>Lo que conviene trabajar</h3>
          <p>
            AMV podrá convertir tus resultados en prioridades concretas para
            tus próximas clases y ejercicios.
          </p>
        </article>
      </section>
    </template>

    <section v-else class="vocal-empty">
      <div class="vocal-empty__visual">
        <span class="vocal-empty__pulse"></span>
        <div class="vocal-empty__note">♪</div>
        <div class="vocal-empty__orbit vocal-empty__orbit--one"></div>
        <div class="vocal-empty__orbit vocal-empty__orbit--two"></div>
      </div>

      <div class="vocal-empty__copy">
        <span class="vocal-section-label">AMV VOCAL ENGINE</span>
        <h2>Tu evaluación vocal está esperando tu primera conexión.</h2>
        <p>
          Esta pantalla ya está preparada para recibir los resultados reales
          del motor: afinación, ritmo, fraseo, fonación, registro, resonancia,
          dicción y expresión.
        </p>

        <div class="vocal-empty__dimensions">
          <span v-for="dimension in amvDimensions" :key="dimension.key">
            <i>{{ dimension.icon }}</i>
            {{ dimension.label }}
          </span>
        </div>
      </div>
    </section>

    <footer class="vocal-footer">
      <div class="vocal-footer__line"></div>
      <span>AMO MI VOZ</span>
      <i></i>
      <span>AMV VOCAL INTELLIGENCE</span>
    </footer>
  </section>
</template>

<script setup>import {

  computed,

  onMounted,

  ref,

} from 'vue'

import {

  RouterLink,

} from 'vue-router'

import {

  fetchMyEvaluationAttempts,

  getAttemptDate,

  isFinishedAttempt,

} from '@/services/evaluationHistoryService'

/* =========================================================*

*   ESTADO*

*========================================================= */

// AMV: resultado persistido del Vocal Engine (se conectará al backend posteriormente).
const amvResult = ref(null)

const amvDimensions = [
  { key: 'intonation', label: 'Afinación', icon: '♪' },
  { key: 'rhythm', label: 'Ritmo y precisión', icon: '◷' },
  { key: 'air', label: 'Aire y fraseo', icon: '≈' },
  { key: 'phonation', label: 'Fonación y emisión', icon: '◉' },
  { key: 'register', label: 'Registro y transiciones', icon: '↕' },
  { key: 'resonance', label: 'Resonancia y timbre', icon: '◌' },
  { key: 'diction', label: 'Dicción y articulación', icon: 'A' },
  { key: 'expression', label: 'Expresión y musicalidad', icon: '✦' },
]

const amvHasResult = computed(() => Boolean(amvResult.value))

const amvScoreMap = {
  intonation: ['intonation', 'pitch', 'afinacion'],
  rhythm: ['rhythm', 'timing', 'ritmo'],
  air: ['air', 'phrasing', 'fraseo'],
  phonation: ['phonation', 'emission', 'fonacion'],
  register: ['register', 'transitions', 'registro'],
  resonance: ['resonance', 'timbre', 'resonancia'],
  diction: ['diction', 'articulation', 'diccion'],
  expression: ['expression', 'musicality', 'expresion'],
}

const amvValue = key => {
  const candidates = amvScoreMap[key] || [key]
  const containers = [
    amvResult.value?.dimensions,
    amvResult.value?.scoring,
    amvResult.value?.scores,
  ]

  for (const container of containers) {
    if (!container) continue

    for (const candidate of candidates) {
      const raw = container?.[candidate]?.score ?? container?.[candidate]
      if (Number.isFinite(Number(raw))) {
        return Math.round(Number(raw))
      }
    }
  }

  return null
}

const amvMeta = computed(() => ({
  range: amvResult.value?.features?.pitch?.rangeLabel || '—',
  stability: amvResult.value?.features?.pitch?.stabilityLabel || '—',
  confidence: amvResult.value?.confidence != null
    ? `${Math.round(Number(amvResult.value.confidence) * 100)}%`
    : '—',
}))

const attempts = ref([])

const isLoading = ref(true)

const loadError = ref('')

const activeFilter =

  ref('all')

/* =========================================================
   NAVEGACIÓN CONTEXTUAL · V10
========================================================= */
const activeEvaluationTab = ref('resumen')

const isEvaluationTab = tab =>
  activeEvaluationTab.value === tab

const setEvaluationTab = tab => {
  activeEvaluationTab.value = tab

  if (tab === 'historial') activeFilter.value = 'all'
  if (tab === 'quiz') activeFilter.value = 'quiz'
  if (tab === 'pruebas') activeFilter.value = 'test'
}


const filters = [

  {

    value: 'all',

    label: 'Todas',

  },

  {

    value: 'quiz',

    label: 'Quiz',

  },

  {

    value: 'test',

    label: 'Pruebas',

  },

]

/* =========================================================*

*   CARGA*

*========================================================= */

const loadEvaluations =

  async () => {

    isLoading.value = true

    loadError.value = ''

    try {

      attempts.value =

        await fetchMyEvaluationAttempts()

    } catch (error) {

      console.error(

        'Error cargando Mis evaluaciones:',

        error,

      )

      attempts.value = []

      loadError.value =

        error?.message ||

        'No fue posible cargar tus evaluaciones.'

    } finally {

      isLoading.value = false

    }

  }

/* =========================================================*

*   INTENTOS*

*========================================================= */

const finishedAttempts =

  computed(() =>

    attempts.value.filter(

      isFinishedAttempt,

    ),

  )

/* =========================================================*

*   AGRUPAR POR EVALUACIÓN*

*========================================================= */

const groupedEvaluations =

  computed(() => {

    const groups =

      new Map()

    for (

      const attempt of

      finishedAttempts.value

    ) {

      if (

        !groups.has(

          attempt.quizId,

        )

      ) {

        groups.set(

          attempt.quizId,

          {

            quizId:

              attempt.quizId,

            quizTitle:

              attempt.quizTitle,

            assessmentType:

              attempt.assessmentType,

            lessonId:

              attempt.lessonId,

            lessonTitle:

              attempt.lessonTitle,

            attempts: [],

          },

        )

      }

      groups

        .get(

          attempt.quizId,

        )

        .attempts

        .push(attempt)

    }

    return Array

      .from(

        groups.values(),

      )

      .map(group => {

        group.attempts.sort(

          (a, b) =>

            a.attemptNumber -

            b.attemptNumber,

        )

        const percentages =

          group.attempts

            .map(

              attempt =>

                attempt.percentage,

            )

            .filter(

              value =>

                Number.isFinite(

                  Number(value),

                ),

            )

            .map(Number)

        const latest =

          group.attempts[

            group.attempts.length -

            1

          ]

        return {

          ...group,

          bestPercentage:

            percentages.length

              ? Math.max(

                  ...percentages,

                )

              : null,

          firstPercentage:

            percentages.length

              ? percentages[0]

              : null,

          latestPercentage:

            latest?.percentage ??

            null,

          latestPassed:

            latest?.passed ??

            null,

          latestDate:

            getAttemptDate(

              latest,

            ),

        }

      })

      .sort(

        (a, b) =>

          new Date(

            b.latestDate || 0,

          ) -

          new Date(

            a.latestDate || 0,

          ),

      )

  })

const filteredGroups =

  computed(() => {

    if (

      activeFilter.value ===

      'all'

    ) {

      return groupedEvaluations.value

    }

    return groupedEvaluations.value

      .filter(

        group =>

          group.assessmentType ===

          activeFilter.value,

      )

  })

/* =========================================================*

*   RESUMEN*

*========================================================= */

const validPercentages =

  computed(() =>

    finishedAttempts.value

      .map(

        attempt =>

          attempt.percentage,

      )

      .filter(

        value =>

          Number.isFinite(

            Number(value),

          ),

      )

      .map(Number),

  )

const averagePercentage =

  computed(() => {

    if (

      !validPercentages.value

        .length

    ) {

      return null

    }

    const total =

      validPercentages.value

        .reduce(

          (sum, value) =>

            sum + value,

          0,

        )

    return (

      total /

      validPercentages.value.length

    )

  })

const bestPercentage =

  computed(() => {

    if (

      !validPercentages.value

        .length

    ) {

      return null

    }

    return Math.max(

      ...validPercentages.value,

    )

  })

const averagePercentageLabel =

  computed(() =>

    formatPercentage(

      averagePercentage.value,

    ),

  )

const bestPercentageLabel =

  computed(() =>

    formatPercentage(

      bestPercentage.value,

    ),

  )

/* =========================================================*

*   FILTROS*

*========================================================= */

const countByFilter =

  value => {

    if (

      value === 'all'

    ) {

      return groupedEvaluations

        .value.length

    }

    return groupedEvaluations

      .value

      .filter(

        group =>

          group.assessmentType ===

          value,

      )

      .length

  }

/* =========================================================*

*   EVOLUCIÓN*

*========================================================= */

const getTrend =

  group => {

    const first =

      Number(

        group.firstPercentage,

      )

    const latest =

      Number(

        group.latestPercentage,

      )

    if (

      !Number.isFinite(first) ||

      !Number.isFinite(latest)

    ) {

      return null

    }

    return latest - first

  }

const getTrendLabel =

  group => {

    const trend =

      getTrend(group)

    if (

      trend === null

    ) {

      return 'Sin datos suficientes'

    }

    if (

      trend > 0

    ) {

      return `+${Math.round(trend)} puntos`

    }

    if (

      trend < 0

    ) {

      return `${Math.round(trend)} puntos`

    }

    return 'Resultado estable'

  }

const getTrendDescription =

  group => {

    const trend =

      getTrend(group)

    if (

      trend === null

    ) {

      return (

        'Completa más intentos para comparar tu progreso.'

      )

    }

    if (

      trend > 0

    ) {

      return (

        'Tu resultado más reciente mejoró respecto de tu primer intento.'

      )

    }

    if (

      trend < 0

    ) {

      return (

        'Conviene volver a revisar el material antes del próximo intento.'

      )

    }

    return (

      'Mantienes el mismo resultado. Puedes intentar reforzar los contenidos más difíciles.'

    )

  }

/* =========================================================*

*   FORMATO*

*========================================================= */

const formatPercentage =

  value => {

    const number =

      Number(value)

    if (

      !Number.isFinite(number)

    ) {

      return '—'

    }

    return `${Math.round(number)}%`

  }

const formatScore =

  value => {

    const number =

      Number(value)

    if (

      !Number.isFinite(number)

    ) {

      return '—'

    }

    return Number.isInteger(number)

      ? String(number)

      : number.toFixed(1)

  }

const formatDate =

  value => {

    if (!value) {

      return 'Sin fecha'

    }

    const date =

      new Date(value)

    if (

      Number.isNaN(

        date.getTime(),

      )

    ) {

      return 'Sin fecha'

    }

    return new Intl

      .DateTimeFormat(

        'es-CL',

        {

          day: '2-digit',

          month: 'short',

          year: 'numeric',

          hour: '2-digit',

          minute: '2-digit',

        },

      )

      .format(date)

  }

const getStatusLabel =

  status => {

    const labels = {

      in_progress:

        'En progreso',

      submitted:

        'Entregada',

      graded:

        'Corregida',

    }

    return (

      labels[status] ||

      'Registrada'

    )

  }

/* =========================================================*

*   LIFECYCLE*

*========================================================= */

onMounted(

  loadEvaluations,

)</script>

<style lang="scss" scoped>
.vocal-evaluation-page {
  --ink: #121b2e;
  --muted: #6f7c91;
  --line: #dfe5ed;
  --wine: #a81549;
  --wine-dark: #721132;
  --gold: #d5a51d;
  --green: #2c936b;
  width: min(1240px, calc(100% - 36px));
  margin: 0 auto;
  padding: 24px 0 56px;
  color: var(--ink);
}

.vocal-evaluation-page * { box-sizing: border-box; }

.vocal-hero {
  position: relative;
  min-height: 330px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
  padding: 48px 54px;
  overflow: hidden;
  border: 1px solid #e1e5ec;
  border-radius: 30px;
  background:
    radial-gradient(circle at 84% 30%, rgba(213,165,29,.18), transparent 26%),
    radial-gradient(circle at 62% 110%, rgba(168,21,73,.13), transparent 38%),
    linear-gradient(120deg, #fff 0%, #fbfcfe 58%, #fff9eb 100%);
  box-shadow: 0 24px 65px rgba(20,30,48,.08);
}

.vocal-hero:before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 190px;
  height: 4px;
  background: linear-gradient(90deg, var(--wine), var(--gold));
}

.vocal-hero__copy,
.vocal-hero__score { position: relative; z-index: 2; }

.vocal-hero__copy { max-width: 760px; }

.vocal-kicker,
.vocal-section-label {
  display: inline-flex;
  color: var(--wine);
  font-size: .69rem;
  font-weight: 900;
  letter-spacing: .14em;
}

.vocal-kicker {
  align-items: center;
  gap: 8px;
}

.vocal-kicker i,
.vocal-engine-status span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 0 4px rgba(213,165,29,.12);
}

.vocal-hero h1 {
  margin: 13px 0 13px;
  font-size: clamp(3.2rem, 6.4vw, 5.8rem);
  line-height: .88;
  letter-spacing: -.07em;
}

.vocal-hero h1 span {
  display: block;
  color: var(--gold);
}

.vocal-hero p {
  max-width: 680px;
  margin: 0;
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.7;
}

.vocal-hero__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 24px;
}

.vocal-hero__chips span {
  padding: 8px 11px;
  border: 1px solid #e0e5eb;
  border-radius: 999px;
  background: rgba(255,255,255,.72);
  color: #68758a;
  font-size: .68rem;
  font-weight: 800;
}

.vocal-hero__score {
  display: grid;
  justify-items: center;
  gap: 12px;
  min-width: 190px;
}

.vocal-score-ring {
  width: 170px;
  height: 170px;
  padding: 9px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: conic-gradient(var(--wine) 0 20%, var(--gold) 20% 40%, #e8edf2 40% 100%);
  box-shadow: 0 18px 42px rgba(168,21,73,.12);
}

.vocal-score-ring > div {
  width: 100%;
  height: 100%;
  display: grid;
  place-content: center;
  text-align: center;
  border-radius: 50%;
  background: #fff;
}

.vocal-score-ring strong {
  font-size: 2.5rem;
  letter-spacing: -.06em;
}

.vocal-score-ring small {
  margin-top: 2px;
  color: #8a96a8;
  font-size: .62rem;
  font-weight: 800;
}

.vocal-hero__score > span {
  color: #8d6f12;
  font-size: .63rem;
  font-weight: 900;
  letter-spacing: .1em;
}

.vocal-intro {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin: 28px 0 16px;
  padding: 0 6px;
}

.vocal-intro h2 {
  margin: 7px 0 5px;
  font-size: 2rem;
  letter-spacing: -.045em;
}

.vocal-intro p {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.vocal-engine-status {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 10px 13px;
  border: 1px solid rgba(213,165,29,.25);
  border-radius: 999px;
  background: #fffaf0;
  color: #957516;
  font-size: .63rem;
  font-weight: 900;
  white-space: nowrap;
}

.vocal-engine-status.is-ready {
  border-color: rgba(44,147,107,.2);
  background: #f1faf6;
  color: #287a5b;
}

.vocal-engine-status.is-ready span {
  background: var(--green);
  box-shadow: 0 0 0 4px rgba(44,147,107,.1);
}

.vocal-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 16px;
}

.vocal-metrics article,
.vocal-panel,
.vocal-insight,
.vocal-empty {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 15px 38px rgba(20,30,48,.055);
}

.vocal-metrics article {
  padding: 20px;
}

.vocal-metrics span {
  display: block;
  color: #8a96a8;
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .11em;
}

.vocal-metrics strong {
  display: block;
  margin: 10px 0 3px;
  font-size: 1.55rem;
}

.vocal-metrics small { color: #8994a6; }

.vocal-panel { padding: 28px; }

.vocal-panel__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e7ebf0;
}

.vocal-panel__header h2 {
  margin: 7px 0 0;
  font-size: 1.8rem;
  letter-spacing: -.04em;
}

.vocal-panel__count {
  padding: 8px 10px;
  border-radius: 999px;
  background: #f6f7f9;
  color: #758196;
  font-size: .65rem;
  font-weight: 850;
}

.vocal-dimensions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 18px;
}

.vocal-dimension {
  display: grid;
  grid-template-columns: 42px 1fr;
  gap: 13px;
  align-items: center;
  padding: 16px;
  border: 1px solid #e3e8ee;
  border-radius: 16px;
  transition: transform .2s ease, box-shadow .2s ease;
}

.vocal-dimension:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 24px rgba(20,30,48,.07);
}

.vocal-dimension.is-pending { opacity: .58; }

.vocal-dimension__icon {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 13px;
  background: #f7edf1;
  color: var(--wine);
  font-weight: 900;
}

.vocal-dimension__title {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.vocal-dimension__title strong { font-size: .84rem; }
.vocal-dimension__title b {
  color: var(--wine);
  font-size: .75rem;
}

.vocal-dimension__track {
  height: 7px;
  overflow: hidden;
  border-radius: 99px;
  background: #edf0f4;
}

.vocal-dimension__track span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, var(--wine), var(--gold));
}

.vocal-bottom-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 16px;
}

.vocal-insight {
  padding: 24px;
}

.vocal-insight span {
  color: var(--wine);
  font-size: .63rem;
  font-weight: 900;
  letter-spacing: .12em;
}

.vocal-insight h3 {
  margin: 8px 0 7px;
  font-size: 1.2rem;
}

.vocal-insight p {
  margin: 0;
  color: var(--muted);
  line-height: 1.6;
}

.vocal-insight--focus { background: linear-gradient(135deg, #fff, #fffaf0); }

.vocal-empty {
  position: relative;
  display: grid;
  grid-template-columns: 230px 1fr;
  gap: 42px;
  align-items: center;
  min-height: 390px;
  padding: 50px;
  overflow: hidden;
  background:
    radial-gradient(circle at 13% 50%, rgba(168,21,73,.08), transparent 23%),
    radial-gradient(circle at 85% 20%, rgba(213,165,29,.10), transparent 25%),
    #fff;
}

.vocal-empty__visual {
  position: relative;
  width: 210px;
  height: 210px;
  display: grid;
  place-items: center;
}

.vocal-empty__note {
  position: relative;
  z-index: 2;
  width: 96px;
  height: 96px;
  display: grid;
  place-items: center;
  border-radius: 28px;
  background: linear-gradient(145deg, var(--wine), #c14270);
  color: #fff;
  font-size: 2.4rem;
  box-shadow: 0 20px 45px rgba(168,21,73,.22);
}

.vocal-empty__orbit {
  position: absolute;
  border: 1px solid rgba(168,21,73,.16);
  border-radius: 50%;
}

.vocal-empty__orbit--one {
  width: 150px;
  height: 150px;
}

.vocal-empty__orbit--two {
  width: 210px;
  height: 210px;
  border-color: rgba(213,165,29,.18);
}

.vocal-empty__copy h2 {
  max-width: 700px;
  margin: 9px 0 10px;
  font-size: clamp(2rem, 4vw, 3.25rem);
  line-height: .98;
  letter-spacing: -.055em;
}

.vocal-empty__copy > p {
  max-width: 760px;
  margin: 0;
  color: var(--muted);
  line-height: 1.7;
}

.vocal-empty__dimensions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 22px;
  margin-top: 25px;
}

.vocal-empty__dimensions span {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #67748a;
  font-size: .73rem;
  font-weight: 750;
}

.vocal-empty__dimensions i {
  width: 25px;
  height: 25px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: #f7edf1;
  color: var(--wine);
  font-style: normal;
}

.vocal-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 25px;
  color: #98a2b1;
  font-size: .58rem;
  font-weight: 900;
  letter-spacing: .12em;
}

.vocal-footer i {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--gold);
}

@media (max-width: 900px) {
  .vocal-hero { padding: 38px; }
  .vocal-hero__score { min-width: 145px; }
  .vocal-score-ring { width: 135px; height: 135px; }
  .vocal-empty { grid-template-columns: 1fr; }
  .vocal-empty__visual { margin: 0 auto; }
}

@media (max-width: 700px) {
  .vocal-evaluation-page { width: min(100% - 24px, 1240px); }
  .vocal-hero { flex-direction: column; align-items: flex-start; }
  .vocal-hero__score { align-self: center; }
  .vocal-intro { flex-direction: column; align-items: flex-start; }
  .vocal-metrics,
  .vocal-dimensions,
  .vocal-bottom-grid { grid-template-columns: 1fr; }
  .vocal-empty { padding: 30px 24px; }
  .vocal-empty__dimensions { grid-template-columns: 1fr; }
}

/* =========================================================
   AMV VISUAL LAYER · MAX
   Animaciones decorativas, profundidad y microinteracciones.
   No altera la lógica académica ni los datos.
========================================================= */

.vocal-hero {
  isolation: isolate;
  animation: amvHeroIn .65s cubic-bezier(.2,.8,.2,1) both;
}

.vocal-hero__glow {
  position: absolute;
  pointer-events: none;
  border-radius: 50%;
  filter: blur(2px);
  animation: amvGlowFloat 8s ease-in-out infinite;
}

.vocal-hero__glow--wine {
  width: 260px;
  height: 260px;
  left: -100px;
  bottom: -150px;
  background: radial-gradient(circle, rgba(168,21,73,.16), transparent 68%);
}

.vocal-hero__glow--gold {
  width: 330px;
  height: 330px;
  right: 5%;
  top: -190px;
  background: radial-gradient(circle, rgba(213,165,29,.16), transparent 68%);
  animation-delay: -3s;
}

.vocal-hero__wave {
  position: absolute;
  z-index: 1;
  right: 17%;
  bottom: -80px;
  width: 430px;
  height: 170px;
  border: 1px solid rgba(168,21,73,.08);
  border-radius: 50%;
  transform: rotate(-8deg);
  pointer-events: none;
}

.vocal-hero__wave--two {
  right: 9%;
  bottom: -105px;
  width: 500px;
  height: 210px;
  border-color: rgba(213,165,29,.08);
  transform: rotate(-12deg);
}

.vocal-hero__particles {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.vocal-hero__particles i {
  position: absolute;
  left: calc((var(--i) * 9%) - 2%);
  top: calc(12% + (var(--i) * 6%));
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(168,21,73,.2);
  animation: amvParticle 5s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.42s);
}

.vocal-hero__particles i:nth-child(3n) {
  width: 5px;
  height: 5px;
  background: rgba(213,165,29,.23);
}

.vocal-score-ring {
  position: relative;
  transition: transform .35s ease, box-shadow .35s ease;
  animation: amvScoreFloat 5s ease-in-out infinite;
}

.vocal-score-ring:hover {
  transform: translateY(-5px) scale(1.025);
  box-shadow: 0 24px 55px rgba(168,21,73,.18);
}

.vocal-score-ring.is-ready {
  background: conic-gradient(
    var(--green) 0 72%,
    var(--gold) 72% 86%,
    #e8edf2 86% 100%
  );
}

.vocal-score-ring.is-ready:after {
  content: "";
  position: absolute;
  inset: -7px;
  border: 1px solid rgba(44,147,107,.15);
  border-radius: 50%;
  animation: amvRingPulse 2.8s ease-in-out infinite;
}

.vocal-hero__chips span {
  transition: transform .25s ease, border-color .25s ease, box-shadow .25s ease;
}

.vocal-hero__chips span:hover {
  transform: translateY(-3px);
  border-color: rgba(168,21,73,.2);
  box-shadow: 0 9px 22px rgba(20,30,48,.07);
}

.vocal-intro {
  animation: amvFadeUp .7s .08s both;
}

.vocal-engine-status {
  transition: transform .25s ease, box-shadow .25s ease;
}

.vocal-engine-status:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(213,165,29,.1);
}

.vocal-metrics {
  perspective: 900px;
}

.vocal-metrics article {
  position: relative;
  overflow: hidden;
  transition: transform .28s cubic-bezier(.2,.8,.2,1),
              box-shadow .28s ease,
              border-color .28s ease;
  animation: amvFadeUp .65s both;
}

.vocal-metrics article:nth-child(2) { animation-delay: .08s; }
.vocal-metrics article:nth-child(3) { animation-delay: .16s; }

.vocal-metrics article:before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 42%;
  height: 2px;
  background: linear-gradient(90deg, var(--wine), var(--gold));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform .35s ease;
}

.vocal-metrics article:hover {
  transform: translateY(-5px) rotateX(1deg);
  border-color: rgba(168,21,73,.16);
  box-shadow: 0 20px 42px rgba(20,30,48,.09);
}

.vocal-metrics article:hover:before {
  transform: scaleX(1);
}

.vocal-metrics strong {
  transition: color .25s ease, transform .25s ease;
}

.vocal-metrics article:hover strong {
  color: var(--wine);
  transform: translateX(2px);
}

.vocal-panel {
  position: relative;
  overflow: hidden;
  animation: amvFadeUp .75s .2s both;
}

.vocal-panel--analysis:after {
  content: "";
  position: absolute;
  width: 280px;
  height: 280px;
  right: -150px;
  top: -160px;
  border: 1px solid rgba(213,165,29,.08);
  border-radius: 50%;
  box-shadow: 0 0 0 35px rgba(168,21,73,.025);
  pointer-events: none;
}

.vocal-signal {
  position: absolute;
  right: 28px;
  top: 24px;
  height: 28px;
  display: flex;
  align-items: center;
  gap: 3px;
  opacity: .5;
  pointer-events: none;
}

.vocal-signal span {
  width: 2px;
  height: 14px;
  border-radius: 5px;
  background: linear-gradient(to top, var(--wine), var(--gold));
  animation: amvSignal 1.6s ease-in-out infinite;
  animation-delay: calc(var(--i) * -0.055s);
}

.vocal-dimension {
  position: relative;
  overflow: hidden;
  animation: amvDimensionIn .55s both;
}

.vocal-dimension:nth-child(1) { animation-delay: .03s; }
.vocal-dimension:nth-child(2) { animation-delay: .07s; }
.vocal-dimension:nth-child(3) { animation-delay: .11s; }
.vocal-dimension:nth-child(4) { animation-delay: .15s; }
.vocal-dimension:nth-child(5) { animation-delay: .19s; }
.vocal-dimension:nth-child(6) { animation-delay: .23s; }
.vocal-dimension:nth-child(7) { animation-delay: .27s; }
.vocal-dimension:nth-child(8) { animation-delay: .31s; }

.vocal-dimension:after {
  content: "";
  position: absolute;
  top: 0;
  left: -120%;
  width: 70%;
  height: 100%;
  background: linear-gradient(
    100deg,
    transparent,
    rgba(255,255,255,.55),
    transparent
  );
  transform: skewX(-18deg);
  transition: left .65s ease;
  pointer-events: none;
}

.vocal-dimension:hover:after {
  left: 140%;
}

.vocal-dimension__icon {
  transition: transform .25s ease, background .25s ease, box-shadow .25s ease;
}

.vocal-dimension:hover .vocal-dimension__icon {
  transform: rotate(-4deg) scale(1.07);
  background: linear-gradient(145deg, #f7edf1, #fff7e5);
  box-shadow: 0 7px 17px rgba(168,21,73,.1);
}

.vocal-dimension__track span {
  position: relative;
  overflow: hidden;
  animation: amvBarIn .9s cubic-bezier(.2,.8,.2,1) both;
}

.vocal-dimension__track span:after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255,255,255,.55),
    transparent
  );
  transform: translateX(-100%);
  animation: amvBarShine 2.8s 1s ease-in-out infinite;
}

.vocal-bottom-grid {
  animation: amvFadeUp .7s .35s both;
}

.vocal-insight {
  position: relative;
  overflow: hidden;
  transition: transform .28s ease, box-shadow .28s ease;
}

.vocal-insight:after {
  content: "✦";
  position: absolute;
  right: 22px;
  top: 17px;
  color: rgba(168,21,73,.09);
  font-size: 2.5rem;
  transform: rotate(15deg);
}

.vocal-insight:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 38px rgba(20,30,48,.08);
}

.vocal-empty {
  animation: amvEmptyIn .8s cubic-bezier(.2,.8,.2,1) both;
}

.vocal-empty__visual {
  animation: amvVisualFloat 5s ease-in-out infinite;
}

.vocal-empty__note {
  position: relative;
  transition: transform .3s ease, box-shadow .3s ease;
}

.vocal-empty__note:hover {
  transform: scale(1.06) rotate(-3deg);
  box-shadow: 0 24px 55px rgba(168,21,73,.28);
}

.vocal-empty__pulse {
  position: absolute;
  width: 96px;
  height: 96px;
  border: 1px solid rgba(168,21,73,.16);
  border-radius: 28px;
  animation: amvEmptyPulse 2.8s ease-out infinite;
}

.vocal-empty__orbit--one {
  animation: amvOrbit 9s linear infinite;
}

.vocal-empty__orbit--two {
  animation: amvOrbitReverse 13s linear infinite;
}

.vocal-empty__dimensions span {
  transition: transform .2s ease, color .2s ease;
}

.vocal-empty__dimensions span:hover {
  transform: translateX(4px);
  color: var(--wine);
}

.vocal-empty__dimensions i {
  transition: transform .2s ease, box-shadow .2s ease;
}

.vocal-empty__dimensions span:hover i {
  transform: scale(1.08);
  box-shadow: 0 5px 14px rgba(168,21,73,.1);
}

.vocal-footer {
  position: relative;
  animation: amvFadeUp .7s .45s both;
}

.vocal-footer__line {
  position: absolute;
  left: 50%;
  top: -13px;
  width: 70px;
  height: 1px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
}

@keyframes amvHeroIn {
  from { opacity: 0; transform: translateY(12px) scale(.992); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

@keyframes amvFadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes amvDimensionIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes amvEmptyIn {
  from { opacity: 0; transform: scale(.985); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes amvGlowFloat {
  0%, 100% { transform: translate3d(0,0,0); }
  50% { transform: translate3d(14px,10px,0); }
}

@keyframes amvScoreFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

@keyframes amvRingPulse {
  0%, 100% { opacity: .25; transform: scale(1); }
  50% { opacity: .7; transform: scale(1.035); }
}

@keyframes amvParticle {
  0%, 100% { opacity: .1; transform: translateY(10px) scale(.8); }
  50% { opacity: .8; transform: translateY(-14px) scale(1.2); }
}

@keyframes amvSignal {
  0%, 100% { transform: scaleY(.65); opacity: .35; }
  50% { transform: scaleY(1.35); opacity: .85; }
}

@keyframes amvBarIn {
  from { transform: scaleX(0); transform-origin: left; }
  to { transform: scaleX(1); transform-origin: left; }
}

@keyframes amvBarShine {
  0%, 55% { transform: translateX(-100%); }
  75%, 100% { transform: translateX(140%); }
}

@keyframes amvVisualFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-7px); }
}

@keyframes amvEmptyPulse {
  0% { opacity: .65; transform: scale(.95); }
  70%, 100% { opacity: 0; transform: scale(1.65); }
}

@keyframes amvOrbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes amvOrbitReverse {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

@media (prefers-reduced-motion: reduce) {
  .vocal-evaluation-page *,
  .vocal-evaluation-page *:before,
  .vocal-evaluation-page *:after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: .01ms !important;
  }
}

</style>
