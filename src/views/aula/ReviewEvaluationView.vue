<template>
  <section class="review-page">
    <section
      v-if="isLoading"
      class="state-screen"
    >
      <div class="spinner"></div>

      <span>
        REVISIÓN
      </span>

      <h1>
        Preparando tu resultado
      </h1>

      <p>
        Estamos cargando tus respuestas y la retroalimentación disponible.
      </p>
    </section>

    <section
      v-else-if="loadError"
      class="state-screen state-screen--error"
    >
      <div class="state-icon">
        !
      </div>

      <span>
        NO PUDIMOS CONTINUAR
      </span>

      <h1>
        No pudimos abrir esta revisión
      </h1>

      <p>
        {{ loadError }}
      </p>

      <div class="state-actions">
        <button
          type="button"
          @click="loadReview"
        >
          Reintentar
        </button>

        <RouterLink
          to="/aula/evaluaciones"
        >
          Volver a Mis evaluaciones
        </RouterLink>
      </div>
    </section>

    <template v-else-if="attempt">
      <header class="review-hero">
        <div>
          <RouterLink
            to="/aula/evaluaciones"
            class="back-link"
          >
            ← Mis evaluaciones
          </RouterLink>

          <div class="review-hero__eyebrow">
            <span>
              {{
                attempt.assessmentType === 'test'
                  ? 'PRUEBA EVALUADA'
                  : 'QUIZ FORMATIVO'
              }}
            </span>

            <span>
              Intento {{ attempt.attemptNumber }}
            </span>
          </div>

          <h1>
            {{ attempt.quizTitle }}
          </h1>

          <p>
            {{ attempt.lessonTitle }}
          </p>
        </div>

        <aside class="result-badge">
          <small>
            RESULTADO
          </small>

          <strong>
            {{ percentageLabel }}
          </strong>

          <span
            :class="{
              'is-passed':
                attempt.passed === true,
              'is-failed':
                attempt.passed === false
            }"
          >
            {{
              attempt.passed === true
                ? 'Aprobada'
                : attempt.passed === false
                  ? 'Por reforzar'
                  : 'Pendiente'
            }}
          </span>
        </aside>
      </header>

      <section class="summary-grid">
        <article>
          <span>
            Correctas
          </span>

          <strong class="summary-good">
            {{ correctCount }}
          </strong>

          <small>
            respuestas acertadas
          </small>
        </article>

        <article>
          <span>
            Por reforzar
          </span>

          <strong class="summary-bad">
            {{ incorrectCount }}
          </strong>

          <small>
            respuestas incorrectas
          </small>
        </article>

        <article>
          <span>
            Pendientes
          </span>

          <strong>
            {{ pendingCount }}
          </strong>

          <small>
            revisión manual
          </small>
        </article>

        <article>
          <span>
            Puntaje
          </span>

          <strong>
            {{ scoreLabel }}
          </strong>

          <small>
            puntaje obtenido
          </small>
        </article>
      </section>

      <section
        v-if="!attempt.showCorrectAnswers"
        class="privacy-notice"
      >
        <div>
          i
        </div>

        <div>
          <strong>
            Revisión limitada por el profesor
          </strong>

          <p>
            Puedes ver tu puntaje y retroalimentación, pero las respuestas
            correctas de esta evaluación están ocultas.
          </p>
        </div>
      </section>

      <section
        v-if="incorrectCount"
        class="reinforcement-panel"
      >
        <div class="reinforcement-panel__icon">
          ↗
        </div>

        <div>
          <span>
            PARA REFORZAR
          </span>

          <h2>
            Hay {{ incorrectCount }}
            {{
              incorrectCount === 1
                ? 'pregunta que conviene revisar'
                : 'preguntas que conviene revisar'
            }}
          </h2>

          <p>
            Lee la explicación de cada respuesta incorrecta y vuelve al
            material de la clase antes de repetir el quiz.
          </p>
        </div>

        <RouterLink
          :to="`/aula/clase/${attempt.lessonId}`"
        >
          Volver a la clase
          <span>→</span>
        </RouterLink>
      </section>

      <section class="filter-bar">
        <button
          v-for="filter in filters"
          :key="filter.value"
          type="button"
          :class="{
            'filter-button--active':
              activeFilter === filter.value
          }"
          @click="
            activeFilter =
              filter.value
          "
        >
          {{ filter.label }}

          <span>
            {{ countForFilter(filter.value) }}
          </span>
        </button>
      </section>

      <section class="question-list">
        <article
          v-for="question in filteredQuestions"
          :key="question.id"
          class="question-card"
          :class="`question-card--${getQuestionState(question)}`"
        >
          <header class="question-card__header">
            <div>
              <span>
                PREGUNTA
                {{ String(question.position).padStart(2, '0') }}
              </span>

              <strong>
                {{ question.points }}
                {{
                  Number(question.points) === 1
                    ? 'punto'
                    : 'puntos'
                }}
              </strong>
            </div>

            <div
              class="question-state"
              :class="`question-state--${getQuestionState(question)}`"
            >
              {{ getQuestionStateLabel(question) }}
            </div>
          </header>

          <div class="question-card__body">
            <h2>
              {{ question.prompt }}
            </h2>

            <div
              v-if="hasOptions(question)"
              class="answer-options"
            >
              <article
                v-for="option in question.options"
                :key="option.id"
                class="answer-option"
                :class="{
                  'answer-option--selected':
                    isSelected(question, option.id),
                  'answer-option--correct':
                    isCorrectOption(question, option.id),
                  'answer-option--wrong-selected':
                    isSelected(question, option.id) &&
                    attempt.showCorrectAnswers &&
                    !isCorrectOption(question, option.id)
                }"
              >
                <span class="answer-option__marker">
                  {{
                    getOptionLetter(
                      question.options,
                      option.id,
                    )
                  }}
                </span>

                <strong>
                  {{ option.text }}
                </strong>

                <small
                  v-if="isSelected(question, option.id)"
                >
                  Tu respuesta
                </small>

                <small
                  v-if="isCorrectOption(question, option.id)"
                  class="correct-label"
                >
                  Correcta
                </small>
              </article>
            </div>

            <section
              v-if="question.textAnswer"
              class="text-answer"
            >
              <span>
                TU RESPUESTA
              </span>

              <p>
                {{ question.textAnswer }}
              </p>
            </section>

            <section
              v-if="
                question.scoreAwarded !== null
              "
              class="awarded-score"
            >
              <span>
                PUNTAJE OBTENIDO
              </span>

              <strong>
                {{ formatScore(question.scoreAwarded) }}
                /
                {{ formatScore(question.points) }}
              </strong>
            </section>

            <section
              v-if="
                attempt.showCorrectAnswers &&
                question.explanation
              "
              class="explanation-box"
            >
              <span>
                ¿POR QUÉ?
              </span>

              <p>
                {{ question.explanation }}
              </p>
            </section>

            <section
              v-if="question.teacherFeedback"
              class="feedback-box"
            >
              <span>
                RETROALIMENTACIÓN DEL PROFESOR
              </span>

              <p>
                {{ question.teacherFeedback }}
              </p>
            </section>

            <section
              v-if="
                getQuestionState(question) === 'incorrect'
              "
              class="reinforce-box"
            >
              <span>
                REFORZAR
              </span>

              <p>
                Revisa este concepto en el material de la clase antes de
                realizar un nuevo intento.
              </p>
            </section>
          </div>
        </article>
      </section>

      <footer class="review-footer">
        <div>
          <span>
            SIGUIENTE PASO
          </span>

          <strong>
            {{
              attempt.assessmentType === 'quiz'
                ? 'Revisa, refuerza y vuelve a practicar'
                : 'Continúa con tu programa formativo'
            }}
          </strong>
        </div>

        <div class="review-footer__actions">
          <RouterLink
            :to="`/aula/clase/${attempt.lessonId}`"
            class="secondary-action"
          >
            Ver clase
          </RouterLink>

          <RouterLink
            v-if="attempt.assessmentType === 'quiz'"
            :to="
              `/aula/clase/${attempt.lessonId}/evaluacion/${attempt.quizId}`
            "
            class="primary-action"
          >
            Practicar nuevamente
            <span>→</span>
          </RouterLink>
        </div>
      </footer>
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
  useRoute,
} from 'vue-router'

import {
  fetchMyEvaluationReview,
  getReviewQuestionState,
} from '@/services/evaluationReviewService'

const route =
  useRoute()

const attempt =
  ref(null)

const questions =
  ref([])

const isLoading =
  ref(true)

const loadError =
  ref('')

const activeFilter =
  ref('all')

const filters = [
  {
    value: 'all',
    label: 'Todas',
  },
  {
    value: 'correct',
    label: 'Correctas',
  },
  {
    value: 'incorrect',
    label: 'Por reforzar',
  },
  {
    value: 'pending',
    label: 'Pendientes',
  },
]

const attemptId =
  computed(() =>
    Number(
      route.params.attemptId,
    ),
  )

const loadReview =
  async () => {
    isLoading.value = true
    loadError.value = ''

    try {
      const review =
        await fetchMyEvaluationReview(
          attemptId.value,
        )

      attempt.value =
        review.attempt

      questions.value =
        review.questions
    } catch (error) {
      console.error(
        'Error cargando revisión:',
        error,
      )

      attempt.value = null
      questions.value = []

      loadError.value =
        error?.message ||
        'No fue posible cargar esta revisión.'
    } finally {
      isLoading.value = false
    }
  }

const getQuestionState =
  question =>
    getReviewQuestionState(
      question,
    )

const correctCount =
  computed(() =>
    questions.value.filter(
      question =>
        getQuestionState(question) ===
        'correct',
    ).length,
  )

const incorrectCount =
  computed(() =>
    questions.value.filter(
      question =>
        getQuestionState(question) ===
        'incorrect',
    ).length,
  )

const pendingCount =
  computed(() =>
    questions.value.filter(
      question =>
        [
          'pending',
          'reviewed',
        ].includes(
          getQuestionState(
            question,
          ),
        ),
    ).length,
  )

const filteredQuestions =
  computed(() => {
    if (
      activeFilter.value ===
      'all'
    ) {
      return questions.value
    }

    if (
      activeFilter.value ===
      'pending'
    ) {
      return questions.value.filter(
        question =>
          [
            'pending',
            'reviewed',
          ].includes(
            getQuestionState(
              question,
            ),
          ),
      )
    }

    return questions.value.filter(
      question =>
        getQuestionState(
          question,
        ) ===
        activeFilter.value,
    )
  })

const percentageLabel =
  computed(() => {
    const value =
      Number(
        attempt.value
          ?.percentage,
      )

    return Number.isFinite(value)
      ? `${Math.round(value)}%`
      : '—'
  })

const scoreLabel =
  computed(() => {
    const score =
      attempt.value?.score

    const max =
      attempt.value?.maxScore

    if (
      score === null ||
      max === null
    ) {
      return '—'
    }

    return `${formatScore(score)} / ${formatScore(max)}`
  })

const countForFilter =
  value => {
    if (
      value === 'all'
    ) {
      return questions.value.length
    }

    if (
      value === 'correct'
    ) {
      return correctCount.value
    }

    if (
      value === 'incorrect'
    ) {
      return incorrectCount.value
    }

    return pendingCount.value
  }

const getQuestionStateLabel =
  question => {
    const state =
      getQuestionState(
        question,
      )

    const labels = {
      correct:
        '✓ Correcta',
      incorrect:
        '✕ Por reforzar',
      reviewed:
        'Revisada',
      pending:
        'Pendiente',
    }

    return (
      labels[state] ||
      'Pendiente'
    )
  }

const hasOptions =
  question =>
    Array.isArray(
      question?.options,
    ) &&
    question.options.length > 0

const isSelected = (
  question,
  optionId,
) =>
  (
    question
      ?.selectedOptionIds ||
    []
  )
    .map(Number)
    .includes(
      Number(optionId),
    )

const isCorrectOption = (
  question,
  optionId,
) => {
  if (
    !attempt.value
      ?.showCorrectAnswers ||
    !Array.isArray(
      question?.correctOptionIds,
    )
  ) {
    return false
  }

  return question
    .correctOptionIds
    .map(Number)
    .includes(
      Number(optionId),
    )
}

const getOptionLetter = (
  options,
  optionId,
) => {
  const index =
    options.findIndex(
      option =>
        Number(option.id) ===
        Number(optionId),
    )

  return index >= 0
    ? String.fromCharCode(
        65 + index,
      )
    : '•'
}

const formatScore =
  value => {
    const number =
      Number(value)

    if (
      !Number.isFinite(number)
    ) {
      return '0'
    }

    return Number.isInteger(number)
      ? String(number)
      : number.toFixed(1)
  }

onMounted(
  loadReview,
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.review-page {
  width: min(1400px, 100%);
  margin: 0 auto;
  padding:
    clamp(1rem, 3vw, 2.4rem)
    clamp(1rem, 3vw, 2.5rem)
    5rem;
}

.state-screen {
  display: grid;
  min-height: 62vh;
  gap: 0.8rem;
  place-items: center;
  align-content: center;
  text-align: center;
}

.spinner {
  width: 48px;
  height: 48px;
  border:
    3px solid
    rgba(255, 255, 255, 0.08);
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.state-screen > span,
.review-hero__eyebrow span,
.question-card__header span,
.reinforcement-panel span,
.review-footer > div > span {
  color:
    variables.$color-primary;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.state-screen h1 {
  margin: 0;
  font-size:
    clamp(2rem, 5vw, 4rem);
}

.state-screen p {
  max-width: 650px;
  margin: 0;
  color:
    rgba(255, 255, 255, 0.55);
  line-height: 1.65;
}

.state-icon {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border:
    1px solid
    #ef6767;
  border-radius: 50%;
  color: #ff8585;
  font-size: 1.4rem;
  font-weight: 900;
}

.state-actions {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-top: 0.7rem;
}

.state-actions button,
.state-actions a {
  min-height: 46px;
  padding:
    0.7rem
    1rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 10px;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
}

.review-hero {
  display: grid;
  gap: 2rem;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  align-items: end;
  margin-bottom: 1rem;
  padding:
    clamp(1.4rem, 4vw, 3rem);
  border:
    1px solid
    rgba(255, 196, 0, 0.23);
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 90% 0%,
      rgba(255, 196, 0, 0.1),
      transparent 35%
    ),
    variables.$color-surface;
}

.back-link {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  margin-bottom: 1rem;
  color:
    rgba(255, 255, 255, 0.62);
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
}

.review-hero__eyebrow {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
}

.review-hero__eyebrow span {
  padding:
    0.3rem
    0.55rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.28);
  border-radius: 999px;
}

.review-hero h1 {
  margin:
    0.65rem
    0
    0;
  font-size:
    clamp(2.5rem, 6vw, 5.5rem);
  line-height: 0.98;
}

.review-hero p {
  margin:
    0.6rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.52);
}

.result-badge {
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

.result-badge small,
.result-badge span {
  color:
    rgba(255, 255, 255, 0.48);
  font-size: 0.68rem;
}

.result-badge strong {
  margin:
    0.25rem
    0;
  color:
    variables.$color-primary;
  font-size: 2.5rem;
}

.result-badge .is-passed {
  color: #79df98;
}

.result-badge .is-failed {
  color: #ef8585;
}

.summary-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
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
    rgba(255, 255, 255, 0.48);
  font-size: 0.75rem;
  font-weight: 800;
}

.summary-grid strong {
  margin:
    0.3rem
    0
    0.1rem;
  color:
    variables.$color-primary;
  font-size: 1.9rem;
}

.summary-grid .summary-good {
  color: #79df98;
}

.summary-grid .summary-bad {
  color: #ef8585;
}

.summary-grid small {
  color:
    rgba(255, 255, 255, 0.35);
  font-size: 0.68rem;
}

.privacy-notice,
.reinforcement-panel {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(0, 1fr);
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 15px;
  background:
    variables.$color-surface;
}

.privacy-notice > div:first-child,
.reinforcement-panel__icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-weight: 900;
}

.privacy-notice p,
.reinforcement-panel p {
  margin:
    0.25rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.5);
  font-size: 0.82rem;
  line-height: 1.6;
}

.reinforcement-panel {
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  border-color:
    rgba(239, 103, 103, 0.28);
  background:
    rgba(239, 103, 103, 0.035);
}

.reinforcement-panel h2 {
  margin:
    0.25rem
    0
    0;
  font-size: 1.15rem;
}

.reinforcement-panel a {
  display: inline-flex;
  min-height: 44px;
  gap: 0.5rem;
  align-items: center;
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 9px;
  color:
    variables.$color-primary;
  font-size: 0.78rem;
  font-weight: 900;
  text-decoration: none;
}

.filter-bar {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.filter-bar button {
  display: inline-flex;
  min-height: 44px;
  gap: 0.5rem;
  align-items: center;
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  background: transparent;
  color:
    rgba(255, 255, 255, 0.6);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
}

.filter-bar button span {
  display: grid;
  min-width: 23px;
  height: 23px;
  place-items: center;
  border-radius: 999px;
  background:
    rgba(255, 255, 255, 0.06);
  font-size: 0.67rem;
}

.filter-bar
button.filter-button--active {
  border-color:
    variables.$color-primary;
  background:
    rgba(255, 196, 0, 0.08);
  color:
    variables.$color-primary;
}

.question-list {
  display: grid;
  gap: 0.9rem;
}

.question-card {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 17px;
  background:
    variables.$color-surface;
}

.question-card--correct {
  border-color:
    rgba(103, 217, 139, 0.35);
}

.question-card--incorrect {
  border-color:
    rgba(239, 103, 103, 0.35);
}

.question-card__header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding:
    0.85rem
    1rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.question-card__header > div:first-child {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  flex-wrap: wrap;
}

.question-card__header strong {
  color:
    rgba(255, 255, 255, 0.46);
  font-size: 0.72rem;
}

.question-state {
  padding:
    0.35rem
    0.55rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 900;
}

.question-state--correct {
  border-color:
    rgba(103, 217, 139, 0.42);
  color: #8ee3a7;
}

.question-state--incorrect {
  border-color:
    rgba(239, 103, 103, 0.42);
  color: #ef8585;
}

.question-card__body {
  padding:
    clamp(1rem, 3vw, 1.6rem);
}

.question-card h2 {
  max-width: 980px;
  margin:
    0
    0
    1rem;
  font-size:
    clamp(1.15rem, 3vw, 1.55rem);
  line-height: 1.4;
}

.answer-options {
  display: grid;
  gap: 0.55rem;
}

.answer-option {
  display: grid;
  gap: 0.7rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto
    auto;
  align-items: center;
  min-height: 54px;
  padding:
    0.7rem
    0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
}

.answer-option__marker {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 0.78rem;
  font-weight: 900;
}

.answer-option strong {
  font-size: 0.88rem;
}

.answer-option small {
  color:
    rgba(255, 255, 255, 0.45);
  font-size: 0.67rem;
  font-weight: 800;
}

.answer-option--selected {
  border-color:
    rgba(255, 196, 0, 0.36);
  background:
    rgba(255, 196, 0, 0.04);
}

.answer-option--correct {
  border-color:
    rgba(103, 217, 139, 0.5);
  background:
    rgba(103, 217, 139, 0.06);
}

.answer-option--wrong-selected {
  border-color:
    rgba(239, 103, 103, 0.5);
  background:
    rgba(239, 103, 103, 0.055);
}

.correct-label {
  color:
    #8ee3a7 !important;
}

.text-answer,
.awarded-score,
.explanation-box,
.feedback-box,
.reinforce-box {
  margin-top: 0.8rem;
  padding: 0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  background:
    rgba(255, 255, 255, 0.018);
}

.text-answer span,
.awarded-score span,
.explanation-box span,
.feedback-box span,
.reinforce-box span {
  color:
    variables.$color-primary;
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.text-answer p,
.explanation-box p,
.feedback-box p,
.reinforce-box p {
  margin:
    0.35rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.58);
  font-size: 0.85rem;
  line-height: 1.65;
}

.awarded-score strong {
  display: block;
  margin-top: 0.3rem;
  color:
    variables.$color-primary;
  font-size: 1rem;
}

.feedback-box {
  border-color:
    rgba(255, 196, 0, 0.25);
}

.reinforce-box {
  border-color:
    rgba(239, 103, 103, 0.3);
  background:
    rgba(239, 103, 103, 0.04);
}

.review-footer {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 1.1rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.25);
  border-radius: 15px;
  background:
    variables.$color-surface;
}

.review-footer strong {
  display: block;
  margin-top: 0.25rem;
}

.review-footer__actions {
  display: flex;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.primary-action,
.secondary-action {
  display: inline-flex;
  min-height: 46px;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  padding:
    0.7rem
    0.9rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 10px;
  font-size: 0.78rem;
  font-weight: 900;
  text-decoration: none;
}

.primary-action {
  background:
    variables.$color-primary;
  color: #080808;
}

.secondary-action {
  color:
    variables.$color-primary;
}

.review-page button:focus-visible,
.review-page a:focus-visible {
  outline:
    3px solid
    rgba(255, 196, 0, 0.58);
  outline-offset: 3px;
}

@media (
  max-width: 850px
) {
  .summary-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .reinforcement-panel {
    grid-template-columns:
      auto
      minmax(0, 1fr);
  }

  .reinforcement-panel a {
    grid-column: 2;
    justify-self: start;
  }
}

@media (
  max-width: 680px
) {
  .review-page {
    padding:
      0.85rem
      0.75rem
      4rem;
  }

  .review-hero {
    grid-template-columns: 1fr;
  }

  .result-badge {
    width: 120px;
    min-height: 120px;
  }

  .answer-option {
    grid-template-columns:
      auto
      minmax(0, 1fr);
  }

  .answer-option small {
    grid-column: 2;
  }

  .review-footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .review-footer__actions {
    width: 100%;
  }

  .primary-action,
  .secondary-action {
    flex: 1;
  }
}

@media (
  max-width: 460px
) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .reinforcement-panel {
    grid-template-columns: 1fr;
  }

  .reinforcement-panel a {
    grid-column: auto;
  }

  .primary-action,
  .secondary-action {
    width: 100%;
  }
}
</style>
