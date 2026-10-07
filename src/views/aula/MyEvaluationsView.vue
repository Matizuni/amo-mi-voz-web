<template>
  <section class="vocal-evaluation-page amv-view-shell">
    <!-- =========================================================
         HERO
    ========================================================== -->
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
          <span v-if="amvSongTitle">{{ amvSongTitle }} · {{ amvArtist || 'Referencia' }}</span>
        </div>
      </div>

      <div class="vocal-hero__score">
        <div class="vocal-score-ring" :class="{ 'is-ready': amvHasResult }">
          <div>
            <strong>{{ amvComparisonQuality ?? '—' }}</strong>
            <small>{{ amvHasResult ? 'Calidad de comparación' : 'Pendiente' }}</small>
          </div>
        </div>
        <span>{{ amvHasResult ? 'ÚLTIMO ANÁLISIS' : 'SIN ANÁLISIS CONECTADO' }}</span>
      </div>
    </section>

    <!-- =========================================================
         INTRO / ESTADO
    ========================================================== -->
    <section class="vocal-intro">
      <div>
        <span class="vocal-section-label">EVALUACIÓN VOCAL</span>
        <h2>Tu perfil vocal</h2>
        <p>
          Resultados AMV, fortalezas y prioridades de práctica. No reemplaza
          la evaluación docente: la complementa con evidencia acústica.
        </p>
      </div>

      <div class="vocal-engine-status" :class="{ 'is-ready': amvHasResult }">
        <span></span>
        {{ amvHasResult ? 'ANÁLISIS DISPONIBLE' : 'MOTOR LISTO PARA CONECTAR' }}
      </div>
    </section>

    <div v-if="amvLoadError" class="amv-load-error" role="alert">
      <strong>No se pudo cargar el análisis AMV.</strong>
      <span>{{ amvLoadError }}</span>
      <button type="button" @click="loadAmvProfile">Reintentar</button>
    </div>

    <template v-if="amvHasResult">
      <!-- =======================================================
           METADATOS PRINCIPALES
      ======================================================== -->
      <section class="vocal-metrics">
        <article>
          <span>RANGO OBSERVADO</span>
          <strong>{{ amvRange }}</strong>
          <small>registro detectado por AMV</small>
        </article>

        <article>
          <span>TESITURA OBSERVADA</span>
          <strong>{{ amvTessitura }}</strong>
          <small>zona central observada</small>
        </article>

        <article>
          <span>CALIDAD DE COMPARACIÓN</span>
          <strong>{{ amvComparisonQuality !== null ? `${amvComparisonQuality}/100` : '—' }}</strong>
          <small>{{ amvComparisonStatus }}</small>
        </article>
      </section>

      <!-- =======================================================
           RADAR — SOLO INDICADORES CUANTIFICADOS
           No mezcla calidad de medición con desempeño.
      ======================================================== -->
      <section class="vocal-panel vocal-panel--radar">
        <header class="vocal-panel__header">
          <div>
            <span class="vocal-section-label">AMV PROFILE</span>
            <h2>Radar de indicadores cuantificados</h2>
            <p class="amv-panel-subtitle">
              Lecturas numéricas que AMV puede sostener con evidencia en esta evaluación.
            </p>
          </div>
          <span class="vocal-panel__count">{{ amvScoredIndicatorCount }} indicadores</span>
        </header>

        <div class="amv-radar-layout amv-radar-layout--clean">
          <div class="amv-radar" aria-label="Radar AMV de afinación, ritmo y estabilidad">
            <svg viewBox="0 0 360 360" role="img" aria-labelledby="amv-radar-title amv-radar-desc">
              <title id="amv-radar-title">Radar de indicadores cuantificados</title>
              <desc id="amv-radar-desc">
                Resultado de afinación, ritmo y estabilidad de la interpretación analizada por AMV.
              </desc>

              <g class="amv-radar-grid amv-radar-grid--triangle">
                <polygon points="180,42 311,275 49,275"></polygon>
                <polygon points="180,76 282,258 78,258"></polygon>
                <polygon points="180,110 253,241 107,241"></polygon>
                <polygon points="180,144 224,224 136,224"></polygon>
                <line x1="180" y1="180" x2="180" y2="42"></line>
                <line x1="180" y1="180" x2="311" y2="275"></line>
                <line x1="180" y1="180" x2="49" y2="275"></line>
              </g>

              <polygon
                class="amv-radar-shape"
                :points="amvRadarPoints"
              ></polygon>

              <g class="amv-radar-dot">
                <circle
                  v-for="point in amvRadarDots"
                  :key="point.key"
                  :cx="point.x"
                  :cy="point.y"
                  r="5"
                ></circle>
              </g>

              <text x="180" y="25">AFINACIÓN</text>
              <text x="318" y="284">RITMO</text>
              <text x="12" y="284">ESTABILIDAD</text>
            </svg>
          </div>

          <div class="amv-radar-stats">
            <article class="amv-score-card amv-score-card--focus">
              <span>AFINACIÓN</span>
              <strong>{{ formatScore(amvIntonation) }}</strong>
              <small>comparación con la referencia</small>
            </article>

            <article class="amv-score-card amv-score-card--strength">
              <span>RITMO Y PRECISIÓN</span>
              <strong>{{ formatScore(amvRhythm) }}</strong>
              <small>correspondencia temporal</small>
            </article>

            <article class="amv-score-card">
              <span>ESTABILIDAD</span>
              <strong>{{ formatScore(amvStability) }}</strong>
              <small>índice descriptivo · {{ amvStabilityStatus }}</small>
            </article>

            <article class="amv-score-card">
              <span>CALIDAD ACÚSTICA</span>
              <strong>{{ formatScore(amvAcousticScore) }}</strong>
              <small>calidad de la medición</small>
            </article>
          </div>
        </div>
      </section>

      <!-- =======================================================
           OCHO DIMENSIONES
      ======================================================== -->
      <section class="vocal-panel vocal-panel--analysis">
        <div class="vocal-signal" aria-hidden="true">
          <span v-for="n in 28" :key="n" :style="{ '--i': n }"></span>
        </div>

        <header class="vocal-panel__header">
          <div>
            <span class="vocal-section-label">AMV ANALYSIS</span>
            <h2>Las 8 dimensiones de tu voz</h2>
            <p class="amv-panel-subtitle">
              Una dimensión puede estar puntuada, observada o todavía en desarrollo. AMV no convierte la falta de medición en un cero.
            </p>
          </div>

          <div class="amv-dimension-summary" aria-label="Resumen de cobertura de las 8 dimensiones">
            <span><b>{{ amvScoredDimensionCount }}</b> puntuadas</span>
            <span><b>{{ amvObservedDimensionCount }}</b> observadas</span>
            <span><b>{{ amvPendingDimensionCount }}</b> en desarrollo</span>
          </div>
        </header>

        <div class="vocal-dimensions">
          <article
            v-for="dimension in amvDimensions"
            :key="dimension.key"
            class="vocal-dimension amv-dimension-card"
            :class="`is-${amvDimensionState(dimension.key)}`"
          >
            <div class="vocal-dimension__icon">{{ dimension.icon }}</div>

            <div class="vocal-dimension__body">
              <div class="vocal-dimension__title">
                <strong>{{ dimension.label }}</strong>
                <b>{{ amvDimensionValueLabel(dimension.key) }}</b>
              </div>

              <div v-if="amvDimensionState(dimension.key) === 'score'" class="vocal-dimension__track">
                <span :style="{ width: `${amvValue(dimension.key)}%` }"></span>
              </div>
              <div v-else class="amv-dimension-evidence">
                <span>{{ amvDimensionEvidence(dimension.key) }}</span>
              </div>

              <small class="amv-dimension-note">
                {{ amvDimensionNote(dimension.key) }}
              </small>
            </div>
          </article>
        </div>
      </section>

      <!-- =======================================================
           EVIDENCIA ACÚSTICA
      ======================================================== -->
      <section class="vocal-panel amv-acoustic-panel">
        <header class="vocal-panel__header">
          <div>
            <span class="vocal-section-label">EVIDENCIA ACÚSTICA</span>
            <h2>Lo que AMV observó en esta grabación</h2>
            <p class="amv-panel-subtitle">
              Descriptores de la toma analizada. No equivalen por sí solos a diagnóstico clínico ni a un tipo de voz permanente.
            </p>
          </div>
          <span class="vocal-panel__count">{{ amvAcousticStatusLabel }}</span>
        </header>

        <div class="amv-acoustic-grid">
          <article class="amv-acoustic-card">
            <span>VIBRATO</span>
            <strong>{{ amvVibratoRate !== null ? `${amvVibratoRate.toFixed(2)} Hz` : '—' }}</strong>
            <small>
              {{ amvVibratoDepth !== null ? `${amvVibratoDepth.toFixed(1)} cents p-p` : 'Sin dato de profundidad' }}
              · {{ amvVibratoSegments }} segmentos
            </small>
          </article>

          <article class="amv-acoustic-card">
            <span>DINÁMICA OBSERVADA</span>
            <strong>{{ amvDynamics !== null ? `${amvDynamics.toFixed(2)} dB` : '—' }}</strong>
            <small>rango dinámico observado en frames con F0 válido</small>
          </article>

          <article class="amv-acoustic-card">
            <span>FORMANTES</span>
            <strong>{{ amvF1 !== null ? `${amvF1.toFixed(0)} / ${amvF2.toFixed(0)}` : '—' }}</strong>
            <small>F1 / F2 mediana · F3 {{ amvF3 !== null ? amvF3.toFixed(0) : '—' }} Hz</small>
          </article>

          <article class="amv-acoustic-card">
            <span>PAUSAS VOCALES</span>
            <strong>{{ amvPauseCount }}</strong>
            <small>
              pausas ≥ 0,20 s · mediana {{ amvPauseMedian !== null ? `${amvPauseMedian.toFixed(3)} s` : '—' }}
            </small>
          </article>
        </div>
      </section>

      <!-- =======================================================
           PEDAGOGÍA
      ======================================================== -->
      <section class="vocal-bottom-grid amv-pedagogy-grid">
        <article class="vocal-insight vocal-insight--strength">
          <span>FORTALEZAS</span>
          <h3>Lo que estás construyendo</h3>
          <p v-if="amvStrengths.length">{{ amvStrengths[0] }}</p>
          <p v-else>AMV mostrará aquí tus áreas más sólidas cuando exista evidencia suficiente.</p>
        </article>

        <article class="vocal-insight vocal-insight--focus">
          <span>PRÓXIMO FOCO</span>
          <h3>Lo que conviene trabajar</h3>
          <p v-if="amvPriorities.length">{{ amvPriorities[0] }}</p>
          <p v-else>AMV mostrará aquí las prioridades pedagógicas detectadas.</p>
        </article>
      </section>

      <section class="vocal-panel amv-practice-panel">
        <header class="vocal-panel__header">
          <div>
            <span class="vocal-section-label">PRÁCTICA SUGERIDA</span>
            <h2>Cómo llevar estos resultados a tu próxima clase</h2>
          </div>
        </header>

        <div class="amv-practice-list">
          <article v-for="(suggestion, index) in amvSuggestions" :key="`${suggestion}-${index}`">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <p>{{ suggestion }}</p>
          </article>
          <p v-if="!amvSuggestions.length" class="amv-empty-copy">
            Las sugerencias aparecerán cuando AMV tenga evidencia pedagógica suficiente.
          </p>
        </div>

        <div class="amv-measurement-note">
          <strong>Lectura responsable del resultado</strong>
          <p>{{ amvMeasurementNote }}</p>
        </div>
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
          Esta pantalla está preparada para recibir los resultados reales del
          motor y convertirlos en una ficha vocal educativa.
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

<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'

/* =========================================================
   ESTADO AMV
========================================================= */
const amvResult = ref(null)
const amvLoadError = ref('')
const AMV_PROFILE_URL = '/amv/student_vocal_profile_v3.json'

const loadAmvProfile = async () => {
  try {
    amvLoadError.value = ''

    const response = await fetch(AMV_PROFILE_URL, {
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`No se pudo cargar el perfil AMV (${response.status}).`)
    }

    const profile = await response.json()

    if (!profile || typeof profile !== 'object') {
      throw new Error('El perfil AMV no tiene un formato válido.')
    }

    amvResult.value = profile
  } catch (error) {
    console.error('Error cargando perfil AMV:', error)
    amvResult.value = null
    amvLoadError.value =
      error?.message ||
      'No fue posible cargar el análisis AMV.'
  }
}

/* =========================================================
   DIMENSIONES PEDAGÓGICAS
========================================================= */
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

const amvValue = key => {
  const value = amvResult.value?.pedagogical_dimensions?.[key]?.score_0_100
  return Number.isFinite(Number(value)) ? Number(value) : null
}

const amvIntonation = computed(() => amvValue('intonation'))
const amvRhythm = computed(() => amvValue('rhythm'))
const amvStability = computed(() => {
  const value = amvResult.value?.pedagogical_dimensions?.stability?.index_0_100
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvStabilityStatus = computed(() =>
  amvResult.value?.pedagogical_dimensions?.stability?.status || 'observada',
)

const amvScoredIndicatorCount = computed(() =>
  [amvIntonation.value, amvRhythm.value, amvStability.value]
    .filter(value => Number.isFinite(Number(value))).length,
)

const amvDimensionState = key => {
  if (['intonation', 'rhythm'].includes(key)) {
    return Number.isFinite(amvValue(key)) ? 'score' : 'pending'
  }

  if (key === 'air') {
    return amvResult.value?.acoustic_profile?.breath_activity_proxy?.available
      ? 'observed'
      : 'pending'
  }

  if (key === 'register') {
    return amvResult.value?.observed_pitch ? 'observed' : 'pending'
  }

  if (key === 'resonance') {
    return amvResult.value?.acoustic_profile?.formants?.available
      ? 'observed'
      : 'pending'
  }

  return 'pending'
}

const amvDimensionValueLabel = key => {
  const state = amvDimensionState(key)

  if (state === 'score') {
    return `${formatScore(amvValue(key))}%`
  }

  if (key === 'air' && state === 'observed') {
    return 'Evidencia parcial'
  }

  if (key === 'register' && state === 'observed') {
    return amvRange.value
  }

  if (key === 'resonance' && state === 'observed') {
    return 'Descriptivo'
  }

  return 'En desarrollo'
}

const amvDimensionEvidence = key => {
  if (!amvResult.value) return 'Sin datos'

  if (key === 'air') {
    const count = amvPauseCount.value
    return count !== null ? `${count} pausas vocales` : 'Proxy no disponible'
  }

  if (key === 'register') {
    return amvTessitura.value !== '—'
      ? `Tesitura ${amvTessitura.value}`
      : 'Rango no disponible'
  }

  if (key === 'resonance') {
    return amvF1.value !== null && amvF2.value !== null
      ? `F1 ${Math.round(amvF1.value)} · F2 ${Math.round(amvF2.value)} Hz`
      : 'Formantes no disponibles'
  }

  return 'Sin evidencia directa'
}

const amvDimensionNote = key => {
  const notes = {
    intonation: 'Puntuación basada en la comparación contra la referencia validada.',
    rhythm: 'Puntuación temporal frente a la referencia; depende de la calidad de alineación.',
    air: 'Proxy de pausas vocales. No mide respiración fisiológica ni soporte respiratorio.',
    phonation: 'AMV todavía no emite una puntuación directa de fonación y emisión.',
    register: 'Rango y tesitura observados en esta interpretación; no definen un tipo de voz permanente.',
    resonance: 'Formantes y timbre son descriptores acústicos de esta toma, no una etiqueta permanente.',
    diction: 'No existe todavía una medición directa de dicción/articulación en este perfil.',
    expression: 'No existe todavía una puntuación directa de expresión/musicalidad en este perfil.',
  }

  return notes[key] || 'Estado del indicador no disponible.'
}

const amvScoredDimensionCount = computed(() =>
  amvDimensions.filter(d => amvDimensionState(d.key) === 'score').length,
)

const amvObservedDimensionCount = computed(() =>
  amvDimensions.filter(d => amvDimensionState(d.key) === 'observed').length,
)

const amvPendingDimensionCount = computed(() =>
  amvDimensions.filter(d => amvDimensionState(d.key) === 'pending').length,
)

/* =========================================================
   METADATOS REALES
========================================================= */
const amvRange = computed(() => {
  const pitch = amvResult.value?.observed_pitch
  const low = pitch?.lowest_note
  const high = pitch?.highest_note
  return low && high ? `${low}–${high}` : '—'
})

const amvTessitura = computed(() => {
  const pitch = amvResult.value?.observed_pitch
  const low = pitch?.p10_note
  const high = pitch?.p90_note
  return low && high ? `${low}–${high}` : '—'
})

const amvComparisonQuality = computed(() => {
  const value =
    amvResult.value?.measurement_quality?.comparison_score_0_100 ??
    amvResult.value?.comparison_quality?.score_0_100
  return Number.isFinite(Number(value)) ? Math.round(Number(value)) : null
})

const amvComparisonStatus = computed(() =>
  amvResult.value?.measurement_quality?.comparison_status ||
  amvResult.value?.comparison_quality?.status ||
  '—',
)

const amvAcousticScore = computed(() => {
  const value = amvResult.value?.measurement_quality?.acoustic_score_0_100
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvAcousticStatusLabel = computed(() =>
  amvResult.value?.measurement_quality?.acoustic_status === 'strong'
    ? 'EVIDENCIA FUERTE'
    : 'EVIDENCIA DISPONIBLE',
)

const amvSongTitle = computed(() =>
  amvResult.value?.assessment_context?.song_title || '',
)

const amvArtist = computed(() =>
  amvResult.value?.assessment_context?.artist || '',
)

const amvConfidence = computed(() => {
  const value = amvResult.value?.comparison_quality?.alignment_confidence
  return Number.isFinite(Number(value)) ? Number(value) * 100 : null
})

/* =========================================================
   EVIDENCIA ACÚSTICA
========================================================= */
const amvVibrato = computed(() =>
  amvResult.value?.pedagogical_dimensions?.vibrato ||
  amvResult.value?.acoustic_profile?.vibrato ||
  null,
)

const amvVibratoRate = computed(() => {
  const value = amvVibrato.value?.rate_hz
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvVibratoDepth = computed(() => {
  const value = amvVibrato.value?.depth_cents_peak_to_peak
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvVibratoSegments = computed(() => {
  const value = amvVibrato.value?.segments ?? amvVibrato.value?.segments_analyzed
  return Number.isFinite(Number(value)) ? Number(value) : 0
})

const amvDynamics = computed(() => {
  const value = amvResult.value?.acoustic_profile?.dynamics?.observed_dynamic_range_db
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvF1 = computed(() => {
  const value = amvResult.value?.acoustic_profile?.formants?.f1_hz?.median
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvF2 = computed(() => {
  const value = amvResult.value?.acoustic_profile?.formants?.f2_hz?.median
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvF3 = computed(() => {
  const value = amvResult.value?.acoustic_profile?.formants?.f3_hz?.median
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvPauseCount = computed(() => {
  const value = amvResult.value?.acoustic_profile?.breath_activity_proxy?.pause_segments_ge_0_20s
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvPauseMedian = computed(() => {
  const value = amvResult.value?.acoustic_profile?.breath_activity_proxy?.median_pause_seconds
  return Number.isFinite(Number(value)) ? Number(value) : null
})

const amvMeasurementNote = computed(() =>
  amvResult.value?.pedagogical_summary_v321?.student_facing?.measurement_note ||
  amvResult.value?.measurement_quality?.note ||
  'Interpreta los resultados junto con el contexto de la clase y las condiciones de captura.',
)

/* =========================================================
   RADAR TRIANGULAR — AFINACIÓN / RITMO / ESTABILIDAD
========================================================= */
const radarPoint = (value, angleDegrees) => {
  const center = 180
  const radius = 138
  const radians = (angleDegrees * Math.PI) / 180
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0))

  return {
    x: center + Math.cos(radians) * radius * (safeValue / 100),
    y: center + Math.sin(radians) * radius * (safeValue / 100),
  }
}

const amvRadarPoints = computed(() => {
  const points = [
    radarPoint(amvIntonation.value, -90),
    radarPoint(amvRhythm.value, 30),
    radarPoint(amvStability.value, 150),
  ]

  return points
    .map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`)
    .join(' ')
})

const amvRadarDots = computed(() => [
  { key: 'intonation', ...radarPoint(amvIntonation.value, -90) },
  { key: 'rhythm', ...radarPoint(amvRhythm.value, 30) },
  { key: 'stability', ...radarPoint(amvStability.value, 150) },
])

/* =========================================================
   PEDAGOGÍA
========================================================= */
const amvStrengths = computed(() =>
  amvResult.value?.pedagogical_summary_v321?.student_facing?.strengths || [],
)

const amvPriorities = computed(() =>
  amvResult.value?.pedagogical_summary_v321?.student_facing?.priority_areas || [],
)

const amvSuggestions = computed(() =>
  amvResult.value?.pedagogical_summary_v321?.student_facing?.practice_suggestions || [],
)

/* =========================================================
   FORMATO
========================================================= */
const formatScore = value => {
  const number = Number(value)
  return Number.isFinite(number) ? number.toFixed(1) : '—'
}

/* =========================================================
   CICLO DE VIDA
========================================================= */
onMounted(loadAmvProfile)
</script>

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



/* =========================================================
   AMV RADAR / DIMENSIONS / EVIDENCE · FINAL
========================================================= */
.amv-panel-subtitle {
  margin: 8px 0 0;
  max-width: 760px;
  color: var(--muted);
  font-size: .82rem;
  line-height: 1.55;
}

.amv-load-error {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 14px;
  margin: 0 0 16px;
  padding: 14px 16px;
  border: 1px solid rgba(168,21,73,.16);
  border-radius: 16px;
  background: #fff6f8;
  color: #7b2747;
  box-shadow: 0 10px 25px rgba(168,21,73,.05);
}

.amv-load-error strong { font-size: .82rem; }
.amv-load-error span { color: #7e7d85; font-size: .76rem; }
.amv-load-error button {
  margin-left: auto;
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid rgba(168,21,73,.18);
  border-radius: 10px;
  background: #fff;
  color: var(--wine);
  font-size: .72rem;
  font-weight: 900;
  cursor: pointer;
}

.amv-radar-layout--clean {
  grid-template-columns: minmax(320px, 1.1fr) minmax(290px, .9fr);
  align-items: center;
}

.amv-radar-grid--triangle polygon {
  fill: none;
}

.amv-radar-grid--triangle line {
  stroke: rgba(111,124,145,.22);
}

.amv-radar-stats {
  align-content: center;
}

.amv-score-card {
  position: relative;
  overflow: hidden;
}

.amv-score-card--focus {
  border-color: rgba(168,21,73,.14);
  background: linear-gradient(145deg, #fff, #fff7fa);
}

.amv-score-card--strength {
  border-color: rgba(44,147,107,.15);
  background: linear-gradient(145deg, #fff, #f6fcf9);
}

.amv-score-card--focus:before,
.amv-score-card--strength:before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 2px;
  background: linear-gradient(90deg, var(--wine), var(--gold));
}

.amv-dimension-summary {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 7px;
}

.amv-dimension-summary span {
  padding: 8px 10px;
  border: 1px solid #e4e8ee;
  border-radius: 999px;
  background: #fafbfc;
  color: #7c8798;
  font-size: .62rem;
  font-weight: 800;
  white-space: nowrap;
}

.amv-dimension-summary b {
  color: var(--ink);
  margin-right: 3px;
}

.amv-dimension-card.is-observed {
  border-color: rgba(213,165,29,.22);
  background: linear-gradient(145deg, #fff, #fffdf6);
}

.amv-dimension-card.is-pending {
  opacity: .72;
}

.amv-dimension-card.is-score .vocal-dimension__title b {
  color: var(--wine);
}

.amv-dimension-card.is-observed .vocal-dimension__title b {
  color: #9a7615;
}

.amv-dimension-evidence {
  min-height: 7px;
  display: flex;
  align-items: center;
  margin-top: 3px;
}

.amv-dimension-evidence span {
  display: inline-flex;
  padding: 6px 9px;
  border-radius: 8px;
  background: #fbf7e9;
  color: #8c711e;
  font-size: .68rem;
  font-weight: 850;
}

.amv-dimension-note {
  display: block;
  margin-top: 7px;
  color: #8792a3;
  font-size: .67rem;
  line-height: 1.45;
}

.amv-acoustic-panel {
  margin-top: 16px;
}

.amv-acoustic-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 18px;
}

.amv-acoustic-card {
  min-height: 132px;
  padding: 18px;
  border: 1px solid #e4e9ef;
  border-radius: 17px;
  background: linear-gradient(145deg, #fff, #fbfcfe);
  transition: transform .25s ease, box-shadow .25s ease, border-color .25s ease;
}

.amv-acoustic-card:hover {
  transform: translateY(-3px);
  border-color: rgba(168,21,73,.12);
  box-shadow: 0 14px 30px rgba(20,30,48,.06);
}

.amv-acoustic-card > span {
  display: block;
  color: #8994a5;
  font-size: .6rem;
  font-weight: 900;
  letter-spacing: .1em;
}

.amv-acoustic-card strong {
  display: block;
  margin: 9px 0 4px;
  color: var(--ink);
  font-size: 1.35rem;
  letter-spacing: -.04em;
}

.amv-acoustic-card small {
  color: #7f8a9d;
  font-size: .67rem;
  line-height: 1.45;
}

.amv-pedagogy-grid {
  margin-top: 16px;
}

.amv-practice-panel {
  margin-top: 16px;
}

.amv-practice-list {
  display: grid;
  gap: 10px;
  margin-top: 18px;
}

.amv-practice-list article {
  display: grid;
  grid-template-columns: 38px 1fr;
  gap: 13px;
  align-items: start;
  padding: 14px 15px;
  border: 1px solid #e6eaf0;
  border-radius: 15px;
  background: #fbfcfd;
}

.amv-practice-list article > span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 9px;
  background: #f7edf1;
  color: var(--wine);
  font-size: .65rem;
  font-weight: 900;
}

.amv-practice-list p {
  margin: 2px 0 0;
  color: #657287;
  font-size: .78rem;
  line-height: 1.55;
}

.amv-empty-copy {
  margin: 0;
  color: #7b8798;
}

.amv-measurement-note {
  margin-top: 17px;
  padding: 16px;
  border: 1px solid rgba(213,165,29,.2);
  border-radius: 15px;
  background: #fffaf0;
}

.amv-measurement-note strong {
  color: #8e7114;
  font-size: .72rem;
  letter-spacing: .04em;
}

.amv-measurement-note p {
  margin: 6px 0 0;
  color: #726f66;
  font-size: .72rem;
  line-height: 1.55;
}

@media (max-width: 980px) {
  .amv-radar-layout--clean { grid-template-columns: 1fr; }
  .amv-acoustic-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .amv-dimension-summary { justify-content: flex-start; }
}

@media (max-width: 700px) {
  .amv-acoustic-grid { grid-template-columns: 1fr; }
  .amv-load-error button { width: 100%; margin-left: 0; }
}
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

/* AMV RADAR 3.2.2 */
.vocal-panel--radar { margin-bottom: 16px; }
.amv-radar-layout {
  display: grid;
  grid-template-columns: minmax(320px, 1.15fr) minmax(280px, .85fr);
  gap: 28px;
  align-items: center;
  padding-top: 18px;
}
.amv-radar {
  min-height: 380px;
  display: grid;
  place-items: center;
  border-radius: 26px;
  background: radial-gradient(circle, rgba(168,21,73,.055), transparent 62%), #fbfcfe;
  border: 1px solid #e7ebf0;
}
.amv-radar svg { width: min(100%, 410px); height: auto; overflow: visible; }
.amv-radar-grid polygon { fill: none; stroke: #dfe5ed; stroke-width: 1; }
.amv-radar-grid line { stroke: #e7ebf0; stroke-width: 1; }
.amv-radar-shape { fill: rgba(168,21,73,.14); stroke: var(--wine); stroke-width: 3; stroke-linejoin: round; }
.amv-radar-dot circle { fill: var(--gold); stroke: #fff; stroke-width: 2; }
.amv-radar text { fill: #6f7c91; font-size: 9px; font-weight: 900; letter-spacing: .07em; text-anchor: middle; }
.amv-radar-stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; }
.amv-radar-stats article {
  padding: 16px; border: 1px solid #e3e8ee; border-radius: 16px; background: #fff;
}
.amv-radar-stats span { display:block; color:#8a96a8; font-size:.59rem; font-weight:900; letter-spacing:.1em; }
.amv-radar-stats strong { display:block; margin-top:7px; color:var(--wine); font-size:1.45rem; letter-spacing:-.04em; }
.amv-radar-stats small { color:#8994a6; line-height:1.45; }
.amv-load-error {
  margin: 0 0 16px; padding: 12px 15px; border-radius: 14px; border:1px solid rgba(168,21,73,.18);
  background:#fff6f8; color:var(--wine); font-size:.78rem; font-weight:800;
}
@media (max-width: 900px) {
  .amv-radar-layout { grid-template-columns: 1fr; }
  .amv-radar { min-height: 320px; }
}
@media (max-width: 520px) {
  .amv-radar-stats { grid-template-columns: 1fr; }
}
</style>
