<template>
  <section class="evaluations-page">
    <!-- =====================================================
         HERO
    ====================================================== -->
    <header class="evaluations-hero">
      <div class="evaluations-hero__copy">
        <span class="eyebrow">
          MI APRENDIZAJE
        </span>

        <h1>
          Mis
          <span>evaluaciones</span>
        </h1>

        <p>
          Revisa tus quiz, pruebas, intentos y resultados.
          Los quiz te ayudan a practicar; las pruebas registran
          una evaluación formal.
        </p>
      </div>

      <div class="evaluations-hero__badge">
        <small>
          HISTORIAL
        </small>

        <strong>
          {{ finishedAttempts.length }}
        </strong>

        <span>
          intentos registrados
        </span>
      </div>
    </header>

    <!-- =====================================================
         LOADING
    ====================================================== -->
    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="spinner"></div>

      <strong>
        Preparando tus resultados
      </strong>

      <p>
        Estamos obteniendo tu historial desde Supabase.
      </p>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <div class="state-card__icon">
        !
      </div>

      <h2>
        No pudimos cargar tus evaluaciones
      </h2>

      <p>
        {{ loadError }}
      </p>

      <button
        type="button"
        @click="loadEvaluations"
      >
        Reintentar
      </button>
    </section>

    <template v-else>
      <!-- ===================================================
           RESUMEN
      ==================================================== -->
      <section class="summary-grid">
        <article>
          <span>
            Evaluaciones
          </span>

          <strong>
            {{ groupedEvaluations.length }}
          </strong>

          <small>
            diferentes
          </small>
        </article>

        <article>
          <span>
            Intentos
          </span>

          <strong>
            {{ finishedAttempts.length }}
          </strong>

          <small>
            completados
          </small>
        </article>

        <article>
          <span>
            Promedio
          </span>

          <strong>
            {{ averagePercentageLabel }}
          </strong>

          <small>
            resultados disponibles
          </small>
        </article>

        <article>
          <span>
            Mejor resultado
          </span>

          <strong>
            {{ bestPercentageLabel }}
          </strong>

          <small>
            mejor intento
          </small>
        </article>
      </section>

      <!-- ===================================================
           FILTROS
      ==================================================== -->
      <section class="filter-bar">
        <div class="filter-tabs">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            :class="{
              'filter-tab--active':
                activeFilter === filter.value
            }"
            @click="
              activeFilter =
                filter.value
            "
          >
            {{ filter.label }}

            <span>
              {{
                countByFilter(
                  filter.value,
                )
              }}
            </span>
          </button>
        </div>
      </section>

      <!-- ===================================================
           VACÍO
      ==================================================== -->
      <section
        v-if="!filteredGroups.length"
        class="empty-state"
      >
        <div>
          ♪
        </div>

        <span>
          SIN RESULTADOS
        </span>

        <h2>
          Todavía no hay evaluaciones aquí
        </h2>

        <p>
          Cuando completes un quiz o una prueba,
          aparecerá en este historial.
        </p>

        <RouterLink
          to="/aula/programa-formativo"
        >
          Ir al programa
          <span>→</span>
        </RouterLink>
      </section>

      <!-- ===================================================
           HISTORIAL
      ==================================================== -->
      <section
        v-else
        class="evaluation-list"
      >
        <article
          v-for="group in filteredGroups"
          :key="group.quizId"
          class="evaluation-card"
          :class="{
            'evaluation-card--test':
              group.assessmentType === 'test'
          }"
        >
          <!-- CABECERA -->
          <header class="evaluation-card__header">
            <div class="evaluation-card__identity">
              <div class="evaluation-card__icon">
                {{
                  group.assessmentType === 'test'
                    ? 'PR'
                    : 'QZ'
                }}
              </div>

              <div>
                <div class="evaluation-card__badges">
                  <span>
                    {{
                      group.assessmentType === 'test'
                        ? 'Prueba evaluada'
                        : 'Quiz formativo'
                    }}
                  </span>

                  <span>
                    {{ group.attempts.length }}
                    {{
                      group.attempts.length === 1
                        ? 'intento'
                        : 'intentos'
                    }}
                  </span>
                </div>

                <h2>
                  {{ group.quizTitle }}
                </h2>

                <p>
                  {{ group.lessonTitle }}
                </p>
              </div>
            </div>

            <div class="evaluation-card__best">
              <small>
                MEJOR RESULTADO
              </small>

              <strong>
                {{ formatPercentage(group.bestPercentage) }}
              </strong>

              <span
                v-if="group.latestPassed !== null"
                :class="{
                  'is-passed':
                    group.latestPassed,
                  'is-failed':
                    !group.latestPassed
                }"
              >
                {{
                  group.latestPassed
                    ? 'Aprobada'
                    : 'Por reforzar'
                }}
              </span>
            </div>
          </header>

          <!-- PROGRESO QUIZ -->
          <section
            v-if="
              group.assessmentType === 'quiz' &&
              group.attempts.length > 1
            "
            class="progress-insight"
          >
            <div>
              <span>
                EVOLUCIÓN
              </span>

              <strong>
                {{ getTrendLabel(group) }}
              </strong>
            </div>

            <div class="progress-insight__bar">
              <span
                :style="{
                  width:
                    `${Math.max(0, Math.min(100, group.bestPercentage || 0))}%`
                }"
              ></span>
            </div>

            <p>
              {{
                getTrendDescription(
                  group,
                )
              }}
            </p>
          </section>

          <!-- INTENTOS -->
          <div class="attempts">
            <article
              v-for="attempt in group.attempts"
              :key="attempt.attemptId"
              class="attempt-row"
            >
              <div class="attempt-row__number">
                <span>
                  INTENTO
                </span>

                <strong>
                  {{ attempt.attemptNumber }}
                </strong>
              </div>

              <div class="attempt-row__date">
                <span>
                  {{
                    formatDate(
                      getAttemptDate(
                        attempt,
                      ),
                    )
                  }}
                </span>

                <small>
                  {{ getStatusLabel(attempt.status) }}
                </small>
              </div>

              <div class="attempt-row__score">
                <span>
                  {{
                    attempt.score !== null &&
                    attempt.maxScore !== null
                      ? `${formatScore(attempt.score)} / ${formatScore(attempt.maxScore)}`
                      : 'Puntaje pendiente'
                  }}
                </span>

                <strong>
                  {{
                    formatPercentage(
                      attempt.percentage,
                    )
                  }}
                </strong>
              </div>

              <div
                class="attempt-row__result"
                :class="{
                  'attempt-row__result--passed':
                    attempt.passed === true,
                  'attempt-row__result--failed':
                    attempt.passed === false,
                  'attempt-row__result--pending':
                    attempt.passed === null
                }"
              >
                {{
                  attempt.passed === true
                    ? '✓ Aprobada'
                    : attempt.passed === false
                      ? 'Por reforzar'
                      : 'Pendiente'
                }}
              </div>
            </article>
          </div>

          <!-- ACCIONES -->
          <footer class="evaluation-card__footer">
            <div class="learning-note">
              <span>
                {{
                  group.assessmentType === 'quiz'
                    ? 'PRÁCTICA'
                    : 'EVALUACIÓN'
                }}
              </span>

              <p>
                {{
                  group.assessmentType === 'quiz'
                    ? 'Puedes volver a practicar si aún tienes intentos disponibles.'
                    : 'Las pruebas respetan el límite de intentos definido por el profesor.'
                }}
              </p>
            </div>

            <RouterLink
              v-if="
                group.assessmentType === 'quiz'
              "
              :to="
                `/aula/clase/${group.lessonId}/evaluacion/${group.quizId}`
              "
              class="evaluation-action"
            >
              Practicar nuevamente
              <span>→</span>
            </RouterLink>

            <RouterLink
              v-else
              :to="
                `/aula/clase/${group.lessonId}`
              "
              class="evaluation-action evaluation-action--secondary"
            >
              Volver a la clase
              <span>→</span>
            </RouterLink>
          </footer>
        </article>
      </section>

      <!-- ===================================================
           APRENDIZAJE
      ==================================================== -->
      <section
        v-if="groupedEvaluations.length"
        class="learning-panel"
      >
        <div class="learning-panel__icon">
          ♪
        </div>

        <div>
          <span>
            PRÓXIMO NIVEL
          </span>

          <h2>
            Revisión de respuestas
          </h2>

          <p>
            Este historial ya muestra tus resultados reales.
            El siguiente módulo permitirá revisar pregunta por
            pregunta qué acertaste, qué fallaste y qué contenido
            conviene reforzar, siempre respetando la configuración
            del profesor.
          </p>
        </div>
      </section>
    </template>
  </section>
</template>

<script setup>
import {
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

/* =========================================================
   ESTADO
========================================================= */

const attempts = ref([])

const isLoading = ref(true)

const loadError = ref('')

const activeFilter =
  ref('all')

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

/* =========================================================
   CARGA
========================================================= */

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

/* =========================================================
   INTENTOS
========================================================= */

const finishedAttempts =
  computed(() =>
    attempts.value.filter(
      isFinishedAttempt,
    ),
  )

/* =========================================================
   AGRUPAR POR EVALUACIÓN
========================================================= */

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

/* =========================================================
   RESUMEN
========================================================= */

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

/* =========================================================
   FILTROS
========================================================= */

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

/* =========================================================
   EVOLUCIÓN
========================================================= */

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

/* =========================================================
   FORMATO
========================================================= */

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

/* =========================================================
   LIFECYCLE
========================================================= */

onMounted(
  loadEvaluations,
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   PAGE
========================================================= */

.evaluations-page {
  width:
    min(
      1400px,
      100%
    );
  margin:
    0 auto;
  padding:
    clamp(
      1rem,
      3vw,
      2.4rem
    )
    clamp(
      1rem,
      3vw,
      2.5rem
    )
    5rem;
}

/* =========================================================
   HERO
========================================================= */

.evaluations-hero {
  display: grid;
  gap: 2rem;
  grid-template-columns:
    minmax(
      0,
      1fr
    )
    auto;
  align-items: end;
  margin-bottom: 1.2rem;
  padding:
    clamp(
      1.4rem,
      4vw,
      3rem
    );
  overflow: hidden;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.22
    );
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 90% 0%,
      rgba(
        255,
        196,
        0,
        0.1
      ),
      transparent 32%
    ),
    variables.$color-surface;
}

.eyebrow {
  color:
    variables.$color-primary;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.evaluations-hero h1 {
  margin:
    0.45rem
    0
    0;
  font-size:
    clamp(
      2.8rem,
      7vw,
      6rem
    );
  line-height: 0.95;
}

.evaluations-hero h1 span {
  color:
    variables.$color-primary;
}

.evaluations-hero p {
  max-width: 760px;
  margin:
    1rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.6
    );
  font-size: 0.98rem;
  line-height: 1.7;
}

.evaluations-hero__badge {
  display: grid;
  width: 150px;
  min-height: 150px;
  place-items: center;
  align-content: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  text-align: center;
}

.evaluations-hero__badge small,
.evaluations-hero__badge span {
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
  font-size: 0.66rem;
}

.evaluations-hero__badge strong {
  margin:
    0.2rem
    0;
  color:
    variables.$color-primary;
  font-size: 2.5rem;
}

/* =========================================================
   STATES
========================================================= */

.state-card,
.empty-state {
  display: grid;
  min-height: 360px;
  gap: 0.75rem;
  place-items: center;
  align-content: center;
  padding: 2rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 18px;
  background:
    variables.$color-surface;
  text-align: center;
}

.spinner {
  width: 42px;
  height: 42px;
  border:
    3px solid
    rgba(
      255,
      255,
      255,
      0.08
    );
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin 0.8s
    linear
    infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

.state-card p,
.empty-state p {
  max-width: 600px;
  margin: 0;
  color:
    rgba(
      255,
      255,
      255,
      0.5
    );
  line-height: 1.65;
}

.state-card button,
.empty-state a {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  margin-top: 0.6rem;
  padding:
    0.7rem
    1rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 10px;
  background:
    transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
}

.state-card--error {
  border-color:
    rgba(
      239,
      103,
      103,
      0.4
    );
}

.state-card__icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border:
    1px solid
    #ef6767;
  border-radius: 50%;
  color:
    #ff8585;
  font-size: 1.2rem;
  font-weight: 900;
}

/* =========================================================
   SUMMARY
========================================================= */

.summary-grid {
  display: grid;
  gap: 0.8rem;
  grid-template-columns:
    repeat(
      4,
      minmax(
        0,
        1fr
      )
    );
  margin-bottom: 1rem;
}

.summary-grid article {
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 14px;
  background:
    variables.$color-surface;
}

.summary-grid span,
.summary-grid strong,
.summary-grid small {
  display: block;
}

.summary-grid span {
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
  font-size: 0.74rem;
  font-weight: 800;
}

.summary-grid strong {
  margin:
    0.3rem
    0
    0.1rem;
  color:
    variables.$color-primary;
  font-size: 2rem;
}

.summary-grid small {
  color:
    rgba(
      255,
      255,
      255,
      0.34
    );
  font-size: 0.68rem;
}

/* =========================================================
   FILTER
========================================================= */

.filter-bar {
  margin-bottom: 1rem;
}

.filter-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.filter-tabs button {
  display: inline-flex;
  min-height: 44px;
  gap: 0.55rem;
  align-items: center;
  padding:
    0.65rem
    0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  background:
    transparent;
  color:
    rgba(
      255,
      255,
      255,
      0.58
    );
  font: inherit;
  font-size: 0.8rem;
  font-weight: 900;
  cursor: pointer;
}

.filter-tabs button span {
  display: grid;
  min-width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 999px;
  background:
    rgba(
      255,
      255,
      255,
      0.06
    );
  font-size: 0.68rem;
}

.filter-tabs
button.filter-tab--active {
  border-color:
    variables.$color-primary;
  background:
    rgba(
      255,
      196,
      0,
      0.08
    );
  color:
    variables.$color-primary;
}

/* =========================================================
   CARDS
========================================================= */

.evaluation-list {
  display: grid;
  gap: 1rem;
}

.evaluation-card {
  overflow: hidden;
  border:
    1px solid
    rgba(
      103,
      217,
      139,
      0.26
    );
  border-radius: 18px;
  background:
    variables.$color-surface;
}

.evaluation-card--test {
  border-color:
    rgba(
      255,
      196,
      0,
      0.28
    );
}

.evaluation-card__header {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.evaluation-card__identity {
  display: flex;
  min-width: 0;
  gap: 1rem;
  align-items: center;
}

.evaluation-card__icon {
  display: grid;
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 15px;
  color:
    variables.$color-primary;
  font-size: 0.8rem;
  font-weight: 900;
}

.evaluation-card__badges {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.4rem;
}

.evaluation-card__badges span {
  padding:
    0.28rem
    0.5rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
  font-size: 0.68rem;
  font-weight: 800;
}

.evaluation-card h2 {
  margin: 0;
  overflow-wrap: anywhere;
  font-size:
    clamp(
      1.2rem,
      3vw,
      1.6rem
    );
}

.evaluation-card__identity p {
  margin:
    0.3rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.45
    );
  font-size: 0.82rem;
}

.evaluation-card__best {
  min-width: 120px;
  text-align: right;
}

.evaluation-card__best small,
.evaluation-card__best strong,
.evaluation-card__best span {
  display: block;
}

.evaluation-card__best small {
  color:
    rgba(
      255,
      255,
      255,
      0.38
    );
  font-size: 0.62rem;
  font-weight: 900;
}

.evaluation-card__best strong {
  margin:
    0.25rem
    0;
  color:
    variables.$color-primary;
  font-size: 1.8rem;
}

.evaluation-card__best span {
  font-size: 0.72rem;
  font-weight: 900;
}

.is-passed {
  color: #79df98;
}

.is-failed {
  color: #ef8585;
}

/* =========================================================
   INSIGHT
========================================================= */

.progress-insight {
  display: grid;
  gap: 0.45rem;
  padding:
    0.9rem
    1.2rem;
  border-bottom:
    1px solid
    variables.$color-border;
  background:
    rgba(
      103,
      217,
      139,
      0.035
    );
}

.progress-insight > div:first-child {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.progress-insight span {
  color: #8ee3a7;
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.progress-insight strong {
  color: #8ee3a7;
  font-size: 0.82rem;
}

.progress-insight__bar {
  height: 5px;
  overflow: hidden;
  border-radius: 999px;
  background:
    rgba(
      255,
      255,
      255,
      0.06
    );
}

.progress-insight__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background: #79df98;
}

.progress-insight p {
  margin: 0;
  color:
    rgba(
      255,
      255,
      255,
      0.46
    );
  font-size: 0.75rem;
}

/* =========================================================
   ATTEMPTS
========================================================= */

.attempts {
  display: grid;
}

.attempt-row {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    90px
    minmax(
      150px,
      1fr
    )
    minmax(
      140px,
      auto
    )
    auto;
  align-items: center;
  padding:
    0.9rem
    1.2rem;
  border-bottom:
    1px solid
    rgba(
      255,
      255,
      255,
      0.05
    );
}

.attempt-row:last-child {
  border-bottom: 0;
}

.attempt-row__number span,
.attempt-row__number strong {
  display: block;
}

.attempt-row__number span {
  color:
    rgba(
      255,
      255,
      255,
      0.36
    );
  font-size: 0.6rem;
  font-weight: 900;
}

.attempt-row__number strong {
  margin-top: 0.15rem;
  color:
    variables.$color-primary;
  font-size: 1.2rem;
}

.attempt-row__date span,
.attempt-row__date small,
.attempt-row__score span,
.attempt-row__score strong {
  display: block;
}

.attempt-row__date span {
  font-size: 0.78rem;
}

.attempt-row__date small {
  margin-top: 0.2rem;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.68rem;
}

.attempt-row__score {
  text-align: right;
}

.attempt-row__score span {
  color:
    rgba(
      255,
      255,
      255,
      0.42
    );
  font-size: 0.7rem;
}

.attempt-row__score strong {
  margin-top: 0.1rem;
  color:
    variables.$color-primary;
  font-size: 1.1rem;
}

.attempt-row__result {
  min-width: 100px;
  padding:
    0.45rem
    0.6rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.5
    );
  font-size: 0.68rem;
  font-weight: 900;
  text-align: center;
}

.attempt-row__result--passed {
  border-color:
    rgba(
      103,
      217,
      139,
      0.42
    );
  color: #8ee3a7;
}

.attempt-row__result--failed {
  border-color:
    rgba(
      239,
      103,
      103,
      0.42
    );
  color: #ef8585;
}

/* =========================================================
   FOOTER
========================================================= */

.evaluation-card__footer {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.2rem;
  border-top:
    1px solid
    variables.$color-border;
  background:
    rgba(
      255,
      255,
      255,
      0.015
    );
}

.learning-note span {
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.learning-note p {
  max-width: 650px;
  margin:
    0.3rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.45
    );
  font-size: 0.75rem;
  line-height: 1.5;
}

.evaluation-action {
  display: inline-flex;
  min-height: 46px;
  gap: 0.55rem;
  align-items: center;
  justify-content: center;
  padding:
    0.7rem
    0.9rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 10px;
  background:
    variables.$color-primary;
  color: #080808;
  font-size: 0.78rem;
  font-weight: 900;
  text-decoration: none;
  white-space: nowrap;
}

.evaluation-action--secondary {
  background:
    transparent;
  color:
    variables.$color-primary;
}

/* =========================================================
   LEARNING PANEL
========================================================= */

.learning-panel {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(
      0,
      1fr
    );
  align-items: start;
  margin-top: 1rem;
  padding: 1.2rem;
  border:
    1px dashed
    rgba(
      255,
      196,
      0,
      0.3
    );
  border-radius: 16px;
  background:
    rgba(
      255,
      196,
      0,
      0.025
    );
}

.learning-panel__icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.learning-panel span {
  color:
    variables.$color-primary;
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.learning-panel h2 {
  margin:
    0.25rem
    0
    0;
}

.learning-panel p {
  max-width: 820px;
  margin:
    0.4rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
  font-size: 0.82rem;
  line-height: 1.65;
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

.evaluations-page button,
.evaluations-page a {
  min-height: 44px;
}

.evaluations-page button:focus-visible,
.evaluations-page a:focus-visible {
  outline:
    3px solid
    rgba(
      255,
      196,
      0,
      0.58
    );
  outline-offset: 3px;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (
  max-width: 900px
) {
  .summary-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(
          0,
          1fr
        )
      );
  }

  .attempt-row {
    grid-template-columns:
      80px
      1fr
      auto;
  }

  .attempt-row__result {
    grid-column:
      2 / -1;
    justify-self: start;
  }
}

@media (
  max-width: 680px
) {
  .evaluations-page {
    padding:
      0.85rem
      0.75rem
      4rem;
  }

  .evaluations-hero {
    grid-template-columns:
      1fr;
  }

  .evaluations-hero__badge {
    width: 120px;
    min-height: 120px;
  }

  .evaluation-card__header,
  .evaluation-card__footer {
    align-items:
      flex-start;
    flex-direction:
      column;
  }

  .evaluation-card__best {
    text-align: left;
  }

  .attempt-row {
    grid-template-columns:
      70px
      1fr;
  }

  .attempt-row__score,
  .attempt-row__result {
    grid-column:
      2;
    justify-self:
      start;
    text-align: left;
  }

  .evaluation-action {
    width: 100%;
  }
}

@media (
  max-width: 460px
) {
  .summary-grid {
    grid-template-columns:
      1fr;
  }

  .evaluation-card__identity {
    align-items:
      flex-start;
  }

  .evaluation-card__icon {
    width: 48px;
    height: 48px;
  }
}
</style>
