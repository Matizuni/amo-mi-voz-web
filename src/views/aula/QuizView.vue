<template>
  <section class="quiz-page">
    <!-- =====================================================
         CARGA
    ====================================================== -->
    <div
      v-if="isLoading"
      class="quiz-state"
    >
      <div class="quiz-spinner"></div>

      <strong>Preparando evaluación...</strong>

      <p>
        Estamos cargando tu evaluación y recuperando
        cualquier respuesta guardada.
      </p>
    </div>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <div
      v-else-if="loadError"
      class="quiz-state quiz-state--error"
    >
      <div class="quiz-state__icon">
        !
      </div>

      <strong>No pudimos abrir la evaluación</strong>

      <p>
        {{ loadError }}
      </p>

      <RouterLink
        :to="classworkUrl"
        class="quiz-button quiz-button--secondary"
      >
        Volver al trabajo de clase
      </RouterLink>
    </div>

    <!-- =====================================================
         RESULTADO
    ====================================================== -->
    <section
      v-else-if="submissionResult"
      class="result-screen"
    >
      <div class="result-screen__eyebrow">
        EVALUACIÓN ENTREGADA
      </div>

      <div
        class="result-screen__icon"
        :class="resultIconClass"
      >
        {{ resultIcon }}
      </div>

      <h1>
        {{ resultTitle }}
      </h1>

      <p class="result-screen__description">
        {{ resultDescription }}
      </p>

      <div
        v-if="
          submissionResult.status === 'graded' &&
          submissionResult.percentage !== null
        "
        class="result-score"
      >
        <div class="result-score__number">
          {{ formatPercentage(submissionResult.percentage) }}%
        </div>

        <div class="result-score__details">
          <span>
            Puntaje
          </span>

          <strong>
            {{ formatPoints(submissionResult.score) }}
            /
            {{ formatPoints(submissionResult.maxScore) }}
          </strong>
        </div>
      </div>

      <div
        v-if="submissionResult.passed !== null"
        class="result-status"
        :class="{
          'result-status--passed':
            submissionResult.passed,
          'result-status--failed':
            !submissionResult.passed,
        }"
      >
        {{
          submissionResult.passed
            ? 'Evaluación aprobada'
            : 'Evaluación no aprobada'
        }}
      </div>

      <div
        v-if="submissionResult.requiresManualGrading"
        class="manual-notice"
      >
        <div class="manual-notice__icon">
          ✎
        </div>

        <div>
          <strong>
            Corrección docente pendiente
          </strong>

          <p>
            Tu evaluación incluye preguntas de desarrollo
            o respuesta escrita. El profesor debe revisar
            esas respuestas antes de entregar la
            calificación definitiva.
          </p>
        </div>
      </div>

      <div class="result-screen__actions">
        <RouterLink
          :to="classworkUrl"
          class="quiz-button quiz-button--primary"
        >
          Volver al trabajo de clase
        </RouterLink>

        <RouterLink
          :to="`/aula/clase/${lessonId}`"
          class="quiz-button quiz-button--secondary"
        >
          Ir a la clase
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         PORTADA
    ====================================================== -->
    <template v-else-if="quiz && !attempt">
      <RouterLink
        :to="classworkUrl"
        class="quiz-back"
      >
        ← Volver al trabajo de clase
      </RouterLink>

      <header class="quiz-cover">
        <div class="quiz-cover__copy">
          <p class="quiz-eyebrow">
            {{
              quiz.assessmentType === 'test'
                ? 'PRUEBA'
                : 'QUIZ FORMATIVO'
            }}
          </p>

          <h1>
            {{ quiz.title }}
          </h1>

          <p class="quiz-cover__description">
            {{
              quiz.description ||
              'Lee atentamente las instrucciones antes de comenzar.'
            }}
          </p>
        </div>

        <div class="quiz-cover__badge">
          <span>
            PUNTAJE
          </span>

          <strong>
            {{ formatPoints(quiz.totalPoints) }}
          </strong>

          <small>
            puntos totales
          </small>
        </div>
      </header>

      <section class="quiz-instructions">
        <div class="quiz-instructions__heading">
          <span>ANTES DE COMENZAR</span>

          <h2>
            Información de la evaluación
          </h2>
        </div>

        <div class="quiz-info-grid">
          <article>
            <span>Preguntas</span>

            <strong>
              {{ questions.length }}
            </strong>

            <small>
              preguntas en total
            </small>
          </article>

          <article>
            <span>Tiempo</span>

            <strong>
              {{
                quiz.timeLimitMinutes
                  ? `${quiz.timeLimitMinutes} min`
                  : 'Sin límite'
              }}
            </strong>

            <small>
              desde que comienzas
            </small>
          </article>

          <article>
            <span>Intentos</span>

            <strong>
              {{
                quiz.attemptsAllowed ??
                'Ilimitados'
              }}
            </strong>

            <small>
              intentos permitidos
            </small>
          </article>

          <article>
            <span>Aprobación</span>

            <strong>
              {{
                quiz.passingPercentage !== null
                  ? `${quiz.passingPercentage}%`
                  : '—'
              }}
            </strong>

            <small>
              porcentaje requerido
            </small>
          </article>
        </div>

        <div class="instructions-card">
          <div class="instructions-card__number">
            01
          </div>

          <div>
            <strong>
              Tus respuestas se guardan automáticamente
            </strong>

            <p>
              Puedes avanzar entre preguntas sin perder
              lo que ya respondiste.
            </p>
          </div>
        </div>

        <div class="instructions-card">
          <div class="instructions-card__number">
            02
          </div>

          <div>
            <strong>
              Revisa antes de entregar
            </strong>

            <p>
              Al final podrás ver qué preguntas has
              respondido y cuáles siguen pendientes.
            </p>
          </div>
        </div>

        <div
          v-if="quiz.timeLimitMinutes"
          class="instructions-card instructions-card--warning"
        >
          <div class="instructions-card__number">
            !
          </div>

          <div>
            <strong>
              Esta evaluación tiene tiempo límite
            </strong>

            <p>
              El cronómetro comienza cuando presiones
              “Comenzar evaluación”.
            </p>
          </div>
        </div>

        <button
          type="button"
          class="start-button"
          :disabled="isStarting"
          @click="startAssessment"
        >
          <template v-if="isStarting">
            Preparando intento...
          </template>

          <template v-else>
            Comenzar evaluación →
          </template>
        </button>
      </section>
    </template>

    <!-- =====================================================
         EVALUACIÓN EN PROGRESO
    ====================================================== -->
    <template v-else-if="quiz && attempt">
      <header class="exam-header">
        <div class="exam-header__main">
          <RouterLink
            :to="classworkUrl"
            class="exam-header__back"
          >
            ←
          </RouterLink>

          <div class="exam-header__title">
            <span>
              {{
                quiz.assessmentType === 'test'
                  ? 'PRUEBA'
                  : 'QUIZ'
              }}
              · INTENTO {{ attempt.attemptNumber }}
            </span>

            <strong>
              {{ quiz.title }}
            </strong>
          </div>
        </div>

        <div class="exam-header__status">
          <div class="save-status">
            <span
              class="save-status__dot"
              :class="{
                'is-saving':
                  saveState === 'saving',
                'is-error':
                  saveState === 'error',
              }"
            ></span>

            <span>
              {{ saveStatusLabel }}
            </span>
          </div>

          <div
            class="timer"
            :class="{
              'timer--warning':
                isTimerWarning,
              'timer--critical':
                isTimerCritical,
            }"
          >
            <span>
              TIEMPO
            </span>

            <strong>
              {{ formattedRemainingTime }}
            </strong>
          </div>
        </div>
      </header>

      <div class="quiz-progress">
        <div class="quiz-progress__copy">
          <span>
            Progreso
          </span>

          <strong>
            {{ answeredCount }}
            /
            {{ questions.length }}
            respondidas
          </strong>
        </div>

        <div class="quiz-progress__track">
          <div
            class="quiz-progress__fill"
            :style="{
              width: `${progressPercentage}%`,
            }"
          ></div>
        </div>
      </div>

      <!-- ===================================================
           MODO RESPONDER
      ==================================================== -->
      <div
        v-if="!isReviewMode"
        class="exam-layout"
      >
        <aside class="question-navigation">
          <div class="question-navigation__heading">
            <span>
              PREGUNTAS
            </span>

            <strong>
              {{ answeredCount }}/{{ questions.length }}
            </strong>
          </div>

          <div class="question-navigation__grid">
            <button
              v-for="(
                navigationQuestion,
                index
              ) in questions"
              :key="navigationQuestion.id"
              type="button"
              class="question-nav-button"
              :class="{
                'is-current':
                  index ===
                  currentQuestionIndex,

                'is-answered':
                  isAnswered(
                    navigationQuestion,
                  ),

                'is-unanswered':
                  !isAnswered(
                    navigationQuestion,
                  ),
              }"
              @click="
                goToQuestion(
                  index,
                )
              "
            >
              {{ index + 1 }}
            </button>
          </div>

          <div class="question-navigation__legend">
            <span>
              <i class="legend-dot legend-dot--answered"></i>
              Respondida
            </span>

            <span>
              <i class="legend-dot legend-dot--pending"></i>
              Pendiente
            </span>
          </div>
        </aside>

        <main
          v-if="currentQuestion"
          class="question-panel"
        >
          <div class="question-panel__top">
            <div>
              <p>
                PREGUNTA
                {{ currentQuestionIndex + 1 }}
                DE
                {{ questions.length }}
              </p>

              <div class="question-meta">
                <span>
                  {{
                    getQuestionTypeLabel(
                      currentQuestion.type,
                    )
                  }}
                </span>

                <span>
                  {{
                    formatPoints(
                      currentQuestion.points,
                    )
                  }}
                  pts
                </span>

                <span
                  v-if="
                    currentQuestion.required
                  "
                >
                  Obligatoria
                </span>
              </div>
            </div>

            <div class="question-number">
              {{
                String(
                  currentQuestionIndex + 1,
                ).padStart(
                  2,
                  '0',
                )
              }}
            </div>
          </div>

          <div
            v-if="
              currentQuestion.mediaType !==
                'none' &&
              currentQuestion.mediaUrl
            "
            class="question-media"
          >
            <audio
              v-if="
                currentQuestion.mediaType ===
                'audio'
              "
              :src="currentQuestion.mediaUrl"
              controls
              preload="metadata"
            ></audio>

            <img
              v-else-if="
                currentQuestion.mediaType ===
                'image'
              "
              :src="currentQuestion.mediaUrl"
              alt="Material de la pregunta"
            >
          </div>

          <h2 class="question-prompt">
            {{ currentQuestion.prompt }}
          </h2>

          <!-- ===============================================
               SELECCIÓN ÚNICA / V-F
          ================================================ -->
          <div
            v-if="
              [
                'single_choice',
                'true_false',
              ].includes(
                currentQuestion.type,
              )
            "
            class="options-list"
          >
            <label
              v-for="(
                option,
                optionIndex
              ) in currentQuestion.options"
              :key="option.id"
              class="option-card"
              :class="{
                'is-selected':
                  currentAnswer
                    .selectedOptionIds
                    .includes(
                      option.id,
                    ),
              }"
            >
              <input
                type="radio"
                :name="`question-${currentQuestion.id}`"
                :value="option.id"
                :checked="
                  currentAnswer
                    .selectedOptionIds
                    .includes(
                      option.id,
                    )
                "
                @change="
                  selectSingleOption(
                    option.id,
                  )
                "
              >

              <span class="option-card__letter">
                {{
                  getOptionLetter(
                    optionIndex,
                  )
                }}
              </span>

              <span class="option-card__text">
                {{ option.text }}
              </span>

              <span class="option-card__check">
                ✓
              </span>
            </label>
          </div>

          <!-- ===============================================
               SELECCIÓN MÚLTIPLE
          ================================================ -->
          <div
            v-else-if="
              currentQuestion.type ===
                'multiple_choice'
            "
            class="options-list"
          >
            <p class="multiple-notice">
              Puedes seleccionar más de una alternativa.
            </p>

            <label
              v-for="(
                option,
                optionIndex
              ) in currentQuestion.options"
              :key="option.id"
              class="option-card"
              :class="{
                'is-selected':
                  currentAnswer
                    .selectedOptionIds
                    .includes(
                      option.id,
                    ),
              }"
            >
              <input
                type="checkbox"
                :value="option.id"
                :checked="
                  currentAnswer
                    .selectedOptionIds
                    .includes(
                      option.id,
                    )
                "
                @change="
                  toggleMultipleOption(
                    option.id,
                  )
                "
              >

              <span class="option-card__letter">
                {{
                  getOptionLetter(
                    optionIndex,
                  )
                }}
              </span>

              <span class="option-card__text">
                {{ option.text }}
              </span>

              <span class="option-card__check">
                ✓
              </span>
            </label>
          </div>

          <!-- ===============================================
               RESPUESTA CORTA
          ================================================ -->
          <div
            v-else-if="
              currentQuestion.type ===
                'short_answer'
            "
            class="text-answer"
          >
            <label>
              Tu respuesta
            </label>

            <input
              :value="
                currentAnswer.textAnswer
              "
              type="text"
              maxlength="500"
              placeholder="Escribe tu respuesta..."
              @input="
                updateTextAnswer(
                  $event.target.value,
                )
              "
            >

            <small>
              {{
                currentAnswer
                  .textAnswer
                  .length
              }}/500
            </small>
          </div>

          <!-- ===============================================
               DESARROLLO
          ================================================ -->
          <div
            v-else
            class="text-answer"
          >
            <label>
              Desarrolla tu respuesta
            </label>

            <textarea
              :value="
                currentAnswer.textAnswer
              "
              rows="9"
              maxlength="5000"
              placeholder="Escribe tu respuesta aquí..."
              @input="
                updateTextAnswer(
                  $event.target.value,
                )
              "
            ></textarea>

            <small>
              {{
                currentAnswer
                  .textAnswer
                  .length
              }}/5000
            </small>
          </div>

          <footer class="question-actions">
            <button
              type="button"
              class="quiz-button quiz-button--secondary"
              :disabled="
                currentQuestionIndex === 0
              "
              @click="previousQuestion"
            >
              ← Anterior
            </button>

            <div class="question-actions__save">
              {{ saveStatusLabel }}
            </div>

            <button
              v-if="
                currentQuestionIndex <
                questions.length - 1
              "
              type="button"
              class="quiz-button quiz-button--primary"
              @click="nextQuestion"
            >
              Siguiente →
            </button>

            <button
              v-else
              type="button"
              class="quiz-button quiz-button--primary"
              @click="openReview"
            >
              Revisar respuestas →
            </button>
          </footer>
        </main>
      </div>

      <!-- ===================================================
           REVISIÓN FINAL
      ==================================================== -->
      <section
        v-else
        class="review-screen"
      >
        <div class="review-screen__heading">
          <p>
            REVISIÓN FINAL
          </p>

          <h1>
            Antes de entregar
          </h1>

          <span>
            Revisa tu evaluación. Después de enviarla,
            este intento quedará cerrado.
          </span>
        </div>

        <div class="review-summary">
          <article>
            <span>Respondidas</span>

            <strong>
              {{ answeredCount }}
            </strong>
          </article>

          <article>
            <span>Pendientes</span>

            <strong>
              {{ unansweredCount }}
            </strong>
          </article>

          <article>
            <span>Total</span>

            <strong>
              {{ questions.length }}
            </strong>
          </article>

          <article>
            <span>Tiempo restante</span>

            <strong>
              {{ formattedRemainingTime }}
            </strong>
          </article>
        </div>

        <div class="review-questions">
          <button
            v-for="(
              question,
              index
            ) in questions"
            :key="question.id"
            type="button"
            class="review-question"
            :class="{
              'is-complete':
                isAnswered(
                  question,
                ),
              'is-pending':
                !isAnswered(
                  question,
                ),
            }"
            @click="
              editQuestion(
                index,
              )
            "
          >
            <div class="review-question__number">
              {{ index + 1 }}
            </div>

            <div class="review-question__copy">
              <span>
                Pregunta {{ index + 1 }}
              </span>

              <strong>
                {{
                  truncateText(
                    question.prompt,
                    75,
                  )
                }}
              </strong>
            </div>

            <div class="review-question__status">
              {{
                isAnswered(question)
                  ? 'Respondida'
                  : 'Pendiente'
              }}
            </div>

            <div class="review-question__arrow">
              →
            </div>
          </button>
        </div>

        <div
          v-if="unansweredRequiredCount > 0"
          class="review-warning"
        >
          <div>
            !
          </div>

          <p>
            Tienes
            <strong>
              {{ unansweredRequiredCount }}
            </strong>
            {{
              unansweredRequiredCount === 1
                ? 'pregunta obligatoria sin responder.'
                : 'preguntas obligatorias sin responder.'
            }}
          </p>
        </div>

        <div class="review-actions">
          <button
            type="button"
            class="quiz-button quiz-button--secondary"
            @click="
              isReviewMode = false
            "
          >
            ← Seguir revisando
          </button>

          <button
            type="button"
            class="submit-button"
            :disabled="isSubmitting"
            @click="requestSubmission"
          >
            {{
              isSubmitting
                ? 'Entregando...'
                : 'Entregar evaluación'
            }}
          </button>
        </div>
      </section>

      <!-- ===================================================
           CONFIRMACIÓN ENTREGA
      ==================================================== -->
      <Teleport to="body">
        <Transition name="modal">
          <div
            v-if="showSubmitConfirmation"
            class="modal-overlay"
            @click.self="
              showSubmitConfirmation =
                false
            "
          >
            <section class="confirmation-modal">
              <div class="confirmation-modal__icon">
                ✓
              </div>

              <p class="quiz-eyebrow">
                ENTREGA FINAL
              </p>

              <h2>
                ¿Entregar evaluación?
              </h2>

              <p>
                Has respondido
                <strong>
                  {{ answeredCount }}
                  de
                  {{ questions.length }}
                </strong>
                preguntas.
              </p>

              <p
                v-if="
                  unansweredRequiredCount >
                  0
                "
                class="confirmation-modal__warning"
              >
                Aún tienes
                {{ unansweredRequiredCount }}
                {{
                  unansweredRequiredCount ===
                  1
                    ? 'pregunta obligatoria pendiente.'
                    : 'preguntas obligatorias pendientes.'
                }}
              </p>

              <div class="confirmation-modal__actions">
                <button
                  type="button"
                  class="quiz-button quiz-button--secondary"
                  :disabled="isSubmitting"
                  @click="
                    showSubmitConfirmation =
                      false
                  "
                >
                  Seguir revisando
                </button>

                <button
                  type="button"
                  class="submit-button"
                  :disabled="isSubmitting"
                  @click="submitAssessment"
                >
                  {{
                    isSubmitting
                      ? 'Entregando...'
                      : 'Sí, entregar'
                  }}
                </button>
              </div>
            </section>
          </div>
        </Transition>
      </Teleport>
    </template>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Teleport to="body">
      <Transition name="toast">
        <div
          v-if="toastMessage"
          class="quiz-toast"
          :class="{
            'quiz-toast--error':
              toastType === 'error',
          }"
        >
          {{ toastMessage }}
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  reactive,
  ref,
} from 'vue'

import {
  RouterLink,
  useRoute,
} from 'vue-router'

import {
  calculateRemainingSeconds,
  createEmptyAnswer,
  fetchAttemptAnswers,
  fetchStudentQuizContent,
  formatRemainingTime,
  isQuestionAnswered,
  saveQuizAnswer,
  startQuizAttempt,
  submitQuizAttempt,
} from '@/services/quizAttemptService'

import {
  useAuth,
} from '@/composables/useAuth'

/* =========================================================
   ROUTE / AUTH
========================================================= */

const route =
  useRoute()

const {
  isStudent,
} =
  useAuth()

const lessonId =
  computed(() =>
    Number(
      route.params.id,
    ),
  )

const quizId =
  computed(() =>
    Number(
      route.params.quizId,
    ),
  )

const classworkUrl =
  computed(() =>
    `/aula/clase/${lessonId.value}/trabajo`,
  )

/* =========================================================
   ESTADO
========================================================= */

const quiz =
  ref(null)

const questions =
  ref([])

const attempt =
  ref(null)

const answers =
  reactive({})

const isLoading =
  ref(true)

const isStarting =
  ref(false)

const isSubmitting =
  ref(false)

const loadError =
  ref('')

const currentQuestionIndex =
  ref(0)

const isReviewMode =
  ref(false)

const submissionResult =
  ref(null)

const showSubmitConfirmation =
  ref(false)

const remainingSeconds =
  ref(null)

const saveState =
  ref('saved')

const toastMessage =
  ref('')

const toastType =
  ref('success')

let timerInterval =
  null

let saveTimer =
  null

let toastTimer =
  null

let isAutoSubmitting =
  false

/* =========================================================
   PREGUNTA ACTUAL
========================================================= */

const currentQuestion =
  computed(() =>
    questions.value[
      currentQuestionIndex.value
    ] ||
    null,
  )

const currentAnswer =
  computed(() => {
    if (
      !currentQuestion.value
    ) {
      return {
        selectedOptionIds: [],
        textAnswer: '',
      }
    }

    return (
      answers[
        currentQuestion.value.id
      ] ||
      createEmptyAnswer(
        currentQuestion.value,
      )
    )
  })

/* =========================================================
   PROGRESO
========================================================= */

const answeredCount =
  computed(() =>
    questions.value.filter(
      question =>
        isAnswered(
          question,
        ),
    ).length,
  )

const unansweredCount =
  computed(() =>
    Math.max(
      0,
      questions.value.length -
        answeredCount.value,
    ),
  )

const unansweredRequiredCount =
  computed(() =>
    questions.value.filter(
      question =>
        question.required &&
        !isAnswered(
          question,
        ),
    ).length,
  )

const progressPercentage =
  computed(() => {
    if (
      !questions.value.length
    ) {
      return 0
    }

    return Math.round(
      (
        answeredCount.value /
        questions.value.length
      ) *
        100,
    )
  })

/* =========================================================
   GUARDADO
========================================================= */

const saveStatusLabel =
  computed(() => {
    const labels = {
      saved:
        'Guardado ✓',

      saving:
        'Guardando...',

      error:
        'Error al guardar',
    }

    return (
      labels[
        saveState.value
      ] ||
      'Guardado'
    )
  })

/* =========================================================
   CRONÓMETRO
========================================================= */

const formattedRemainingTime =
  computed(() =>
    formatRemainingTime(
      remainingSeconds.value,
    ),
  )

const isTimerWarning =
  computed(() =>
    remainingSeconds.value !==
      null &&
    remainingSeconds.value <=
      300 &&
    remainingSeconds.value >
      60,
  )

const isTimerCritical =
  computed(() =>
    remainingSeconds.value !==
      null &&
    remainingSeconds.value <=
      60,
  )

/* =========================================================
   RESULTADO
========================================================= */

const resultIcon =
  computed(() => {
    if (
      submissionResult.value
        ?.requiresManualGrading
    ) {
      return '…'
    }

    if (
      submissionResult.value
        ?.passed === true
    ) {
      return '✓'
    }

    if (
      submissionResult.value
        ?.passed === false
    ) {
      return '!'
    }

    return '✓'
  })

const resultIconClass =
  computed(() => ({
    'result-screen__icon--passed':
      submissionResult.value
        ?.passed === true,

    'result-screen__icon--failed':
      submissionResult.value
        ?.passed === false,

    'result-screen__icon--pending':
      submissionResult.value
        ?.requiresManualGrading,
  }))

const resultTitle =
  computed(() => {
    if (
      submissionResult.value
        ?.requiresManualGrading
    ) {
      return 'Evaluación recibida'
    }

    if (
      submissionResult.value
        ?.passed === true
    ) {
      return '¡Evaluación aprobada!'
    }

    if (
      submissionResult.value
        ?.passed === false
    ) {
      return 'Evaluación finalizada'
    }

    return 'Evaluación entregada'
  })

const resultDescription =
  computed(() => {
    if (
      submissionResult.value
        ?.requiresManualGrading
    ) {
      return 'Tus respuestas fueron guardadas correctamente. La calificación final estará disponible después de la revisión docente.'
    }

    if (
      submissionResult.value
        ?.percentage !== null
    ) {
      return 'Tu evaluación fue corregida automáticamente y el resultado quedó registrado.'
    }

    return 'Tu evaluación fue entregada correctamente.'
  })

/* =========================================================
   CARGA INICIAL
========================================================= */

const loadQuiz =
  async () => {
    isLoading.value =
      true

    loadError.value =
      ''

    try {
      if (
        !isStudent.value
      ) {
        throw new Error(
          'Esta evaluación debe ser rendida desde una cuenta de estudiante.',
        )
      }

      if (
        !lessonId.value ||
        !quizId.value
      ) {
        throw new Error(
          'La evaluación solicitada no es válida.',
        )
      }

      const {
        quiz:
          loadedQuiz,

        questions:
          loadedQuestions,
      } =
        await fetchStudentQuizContent(
          quizId.value,
        )

      if (
        Number(
          loadedQuiz.lessonId,
        ) !==
        lessonId.value
      ) {
        throw new Error(
          'Esta evaluación no pertenece a la clase indicada.',
        )
      }

      quiz.value =
        loadedQuiz

      questions.value =
        loadedQuestions

      initializeAnswers()
    } catch (error) {
      console.error(
        'Error cargando evaluación:',
        error,
      )

      loadError.value =
        error?.message ||
        'No fue posible cargar la evaluación.'
    } finally {
      isLoading.value =
        false
    }
  }

/* =========================================================
   RESPUESTAS VACÍAS
========================================================= */

const initializeAnswers =
  () => {
    questions.value.forEach(
      question => {
        answers[
          question.id
        ] =
          createEmptyAnswer(
            question,
          )
      },
    )
  }

/* =========================================================
   INICIAR EVALUACIÓN
========================================================= */

const startAssessment =
  async () => {
    if (
      isStarting.value
    ) {
      return
    }

    isStarting.value =
      true

    try {
      const startedAttempt =
        await startQuizAttempt(
          quizId.value,
        )

      attempt.value =
        startedAttempt

      const storedAnswers =
        await fetchAttemptAnswers(
          startedAttempt.id,
        )

      restoreAnswers(
        storedAnswers,
      )

      startTimer()

      if (
        startedAttempt.resumed
      ) {
        showToast(
          'Continuamos tu intento anterior.',
        )
      } else {
        showToast(
          'Evaluación iniciada.',
        )
      }
    } catch (error) {
      console.error(
        'Error iniciando evaluación:',
        error,
      )

      showToast(
        error?.message ||
          'No fue posible iniciar la evaluación.',
        'error',
      )
    } finally {
      isStarting.value =
        false
    }
  }

/* =========================================================
   RESTAURAR RESPUESTAS
========================================================= */

const restoreAnswers =
  storedAnswers => {
    storedAnswers.forEach(
      storedAnswer => {
        if (
          !answers[
            storedAnswer
              .questionId
          ]
        ) {
          return
        }

        answers[
          storedAnswer
            .questionId
        ] = {
          questionId:
            storedAnswer
              .questionId,

          selectedOptionIds:
            [
              ...storedAnswer
                .selectedOptionIds,
            ],

          textAnswer:
            storedAnswer
              .textAnswer ||
            '',
        }
      },
    )
  }

/* =========================================================
   SABER SI ESTÁ RESPONDIDA
========================================================= */

const isAnswered =
  question =>
    isQuestionAnswered({
      question,

      answer:
        answers[
          question.id
        ],
    })

/* =========================================================
   RESPUESTA ÚNICA
========================================================= */

const selectSingleOption =
  optionId => {
    if (
      !currentQuestion.value
    ) {
      return
    }

    const answer =
      answers[
        currentQuestion.value.id
      ]

    answer.selectedOptionIds =
      [
        Number(
          optionId,
        ),
      ]

    scheduleSave(
      currentQuestion.value.id,
    )
  }

/* =========================================================
   RESPUESTA MÚLTIPLE
========================================================= */

const toggleMultipleOption =
  optionId => {
    if (
      !currentQuestion.value
    ) {
      return
    }

    const answer =
      answers[
        currentQuestion.value.id
      ]

    const id =
      Number(optionId)

    if (
      answer
        .selectedOptionIds
        .includes(id)
    ) {
      answer.selectedOptionIds =
        answer
          .selectedOptionIds
          .filter(
            selectedId =>
              selectedId !==
              id,
          )
    } else {
      answer.selectedOptionIds =
        [
          ...answer
            .selectedOptionIds,
          id,
        ]
    }

    scheduleSave(
      currentQuestion.value.id,
    )
  }

/* =========================================================
   RESPUESTA DE TEXTO
========================================================= */

const updateTextAnswer =
  value => {
    if (
      !currentQuestion.value
    ) {
      return
    }

    answers[
      currentQuestion.value.id
    ].textAnswer =
      value

    scheduleSave(
      currentQuestion.value.id,
    )
  }

/* =========================================================
   AUTOGUARDADO
========================================================= */

const scheduleSave =
  questionId => {
    clearTimeout(
      saveTimer,
    )

    saveState.value =
      'saving'

    saveTimer =
      setTimeout(
        () => {
          persistAnswer(
            questionId,
          )
        },
        650,
      )
  }

const persistAnswer =
  async questionId => {
    if (
      !attempt.value?.id
    ) {
      return
    }

    const answer =
      answers[
        questionId
      ]

    if (!answer) {
      return
    }

    saveState.value =
      'saving'

    try {
      await saveQuizAnswer({
        attemptId:
          attempt.value.id,

        questionId,

        selectedOptionIds:
          answer
            .selectedOptionIds,

        textAnswer:
          answer
            .textAnswer,
      })

      saveState.value =
        'saved'
    } catch (error) {
      console.error(
        'Error guardando respuesta:',
        error,
      )

      saveState.value =
        'error'

      showToast(
        error?.message ||
          'No se pudo guardar una respuesta.',
        'error',
      )
    }
  }

/* =========================================================
   GUARDAR TODO ANTES DE ENTREGAR
========================================================= */

const saveAllAnswers =
  async () => {
    clearTimeout(
      saveTimer,
    )

    saveState.value =
      'saving'

    for (
      const question
      of questions.value
    ) {
      const answer =
        answers[
          question.id
        ]

      if (!answer) {
        continue
      }

      await saveQuizAnswer({
        attemptId:
          attempt.value.id,

        questionId:
          question.id,

        selectedOptionIds:
          answer
            .selectedOptionIds,

        textAnswer:
          answer
            .textAnswer,
      })
    }

    saveState.value =
      'saved'
  }

/* =========================================================
   NAVEGACIÓN
========================================================= */

const goToQuestion =
  index => {
    if (
      index < 0 ||
      index >=
        questions.value.length
    ) {
      return
    }

    currentQuestionIndex.value =
      index

    isReviewMode.value =
      false

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

const previousQuestion =
  () => {
    goToQuestion(
      currentQuestionIndex.value -
        1,
    )
  }

const nextQuestion =
  () => {
    goToQuestion(
      currentQuestionIndex.value +
        1,
    )
  }

const editQuestion =
  index => {
    goToQuestion(
      index,
    )
  }

const openReview =
  () => {
    isReviewMode.value =
      true

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

/* =========================================================
   ENTREGAR
========================================================= */

const requestSubmission =
  () => {
    showSubmitConfirmation.value =
      true
  }

const submitAssessment =
  async ({
    automatic = false,
  } = {}) => {
    if (
      isSubmitting.value ||
      !attempt.value?.id
    ) {
      return
    }

    isSubmitting.value =
      true

    showSubmitConfirmation.value =
      false

    try {
      /*
       * Para una entrega normal guardamos todo
       * antes de cerrar el intento.
       *
       * Si el tiempo expiró, el servidor puede
       * rechazar nuevos guardados. En ese caso
       * entregamos lo último que ya alcanzó
       * a guardarse.
       */
      if (!automatic) {
        await saveAllAnswers()
      }

      const result =
        await submitQuizAttempt(
          attempt.value.id,
        )

      stopTimer()

      submissionResult.value =
        result

      attempt.value =
        null

      isReviewMode.value =
        false

      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    } catch (error) {
      console.error(
        'Error entregando evaluación:',
        error,
      )

      showToast(
        error?.message ||
          'No fue posible entregar la evaluación.',
        'error',
      )
    } finally {
      isSubmitting.value =
        false
    }
  }

/* =========================================================
   CRONÓMETRO
========================================================= */

const startTimer =
  () => {
    stopTimer()

    remainingSeconds.value =
      calculateRemainingSeconds({
        startedAt:
          attempt.value
            ?.startedAt,

        timeLimitMinutes:
          quiz.value
            ?.timeLimitMinutes,
      })

    if (
      remainingSeconds.value ===
      null
    ) {
      return
    }

    if (
      remainingSeconds.value <=
      0
    ) {
      handleTimeExpired()
      return
    }

    timerInterval =
      window.setInterval(
        () => {
          remainingSeconds.value =
            calculateRemainingSeconds({
              startedAt:
                attempt.value
                  ?.startedAt,

              timeLimitMinutes:
                quiz.value
                  ?.timeLimitMinutes,
            })

          if (
            remainingSeconds.value <=
            0
          ) {
            handleTimeExpired()
          }
        },
        1000,
      )
  }

const stopTimer =
  () => {
    if (
      timerInterval
    ) {
      window.clearInterval(
        timerInterval,
      )

      timerInterval =
        null
    }
  }

const handleTimeExpired =
  async () => {
    if (
      isAutoSubmitting
    ) {
      return
    }

    isAutoSubmitting =
      true

    stopTimer()

    showSubmitConfirmation.value =
      false

    showToast(
      'El tiempo terminó. Estamos entregando tu evaluación.',
    )

    await submitAssessment({
      automatic: true,
    })

    isAutoSubmitting =
      false
  }

/* =========================================================
   FORMATOS
========================================================= */

const getQuestionTypeLabel =
  type => {
    const labels = {
      single_choice:
        'Selección única',

      multiple_choice:
        'Selección múltiple',

      true_false:
        'Verdadero o falso',

      short_answer:
        'Respuesta corta',

      essay:
        'Desarrollo',
    }

    return (
      labels[type] ||
      'Pregunta'
    )
  }

const getOptionLetter =
  index =>
    String.fromCharCode(
      65 + index,
    )

const formatPoints =
  value => {
    const number =
      Number(value)

    if (
      !Number.isFinite(
        number,
      )
    ) {
      return '0'
    }

    return Number.isInteger(
      number,
    )
      ? String(number)
      : number.toFixed(1)
  }

const formatPercentage =
  value => {
    const number =
      Number(value)

    if (
      !Number.isFinite(
        number,
      )
    ) {
      return '0'
    }

    return Number.isInteger(
      number,
    )
      ? String(number)
      : number.toFixed(1)
  }

const truncateText =
  (
    value,
    length = 70,
  ) => {
    const text =
      String(
        value || '',
      )

    if (
      text.length <=
      length
    ) {
      return text
    }

    return `${text.slice(
      0,
      length,
    )}…`
  }

/* =========================================================
   TOAST
========================================================= */

const showToast =
  (
    message,
    type = 'success',
  ) => {
    clearTimeout(
      toastTimer,
    )

    toastMessage.value =
      message

    toastType.value =
      type

    toastTimer =
      setTimeout(
        () => {
          toastMessage.value =
            ''
        },
        3500,
      )
  }

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(() => {
  loadQuiz()
})

onUnmounted(() => {
  clearTimeout(
    saveTimer,
  )

  clearTimeout(
    toastTimer,
  )

  stopTimer()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.quiz-page {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

/* =========================================================
   ESTADOS
========================================================= */

.quiz-state {
  display: grid;
  min-height: 520px;
  gap: 12px;
  place-items: center;
  align-content: center;
  padding: 40px 20px;
  text-align: center;
}

.quiz-state p {
  max-width: 540px;
  margin: 0;
  line-height: 1.6;
  opacity: 0.55;
}

.quiz-state--error strong {
  color: #ff7676;
}

.quiz-state__icon {
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border: 1px solid #d85151;
  border-radius: 50%;
  color: #ff7676;
  font-size: 2rem;
}

.quiz-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid variables.$color-border;
  border-top-color: variables.$color-primary;
  border-radius: 50%;
  animation: quiz-spin 0.8s linear infinite;
}

@keyframes quiz-spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   BOTONES
========================================================= */

.quiz-button,
.start-button,
.submit-button {
  display: inline-flex;
  min-height: 46px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    opacity 0.18s ease;
}

.quiz-button:hover:not(:disabled),
.start-button:hover:not(:disabled),
.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.quiz-button:disabled,
.start-button:disabled,
.submit-button:disabled {
  opacity: 0.45;
  cursor: default;
}

.quiz-button--primary,
.start-button,
.submit-button {
  border: 1px solid variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.quiz-button--secondary {
  border: 1px solid variables.$color-border;
  background: variables.$color-surface;
  color: variables.$color-white;
}

.quiz-button--secondary:hover:not(:disabled) {
  border-color: variables.$color-primary;
  color: variables.$color-primary;
}

/* =========================================================
   PORTADA
========================================================= */

.quiz-back {
  display: inline-block;
  margin-bottom: variables.$spacing-xl;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.quiz-cover {
  display: flex;
  gap: variables.$spacing-2xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-3xl;
}

.quiz-cover__copy {
  max-width: 850px;
}

.quiz-eyebrow {
  margin: 0 0 10px;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.quiz-cover h1 {
  margin: 0;
  max-width: 900px;
  font-size: clamp(2.8rem, 6vw, 5.5rem);
  line-height: 0.98;
}

.quiz-cover__description {
  max-width: 760px;
  margin: variables.$spacing-xl 0 0;
  font-size: 1.05rem;
  line-height: 1.7;
  opacity: 0.65;
}

.quiz-cover__badge {
  min-width: 210px;
  padding: variables.$spacing-xl;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background:
    radial-gradient(
      circle at 100% 0,
      rgba(variables.$color-primary, 0.16),
      transparent 50%
    ),
    variables.$color-surface;
}

.quiz-cover__badge span,
.quiz-cover__badge strong,
.quiz-cover__badge small {
  display: block;
}

.quiz-cover__badge span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.quiz-cover__badge strong {
  margin: 5px 0;
  font-size: 2.4rem;
}

.quiz-cover__badge small {
  opacity: 0.45;
}

/* =========================================================
   INSTRUCCIONES
========================================================= */

.quiz-instructions {
  max-width: 1000px;
}

.quiz-instructions__heading {
  margin-bottom: variables.$spacing-xl;
}

.quiz-instructions__heading span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.13em;
}

.quiz-instructions__heading h2 {
  margin: 8px 0 0;
  font-size: clamp(2rem, 4vw, 3rem);
}

.quiz-info-grid {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  margin-bottom: variables.$spacing-xl;
}

.quiz-info-grid article {
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.quiz-info-grid span,
.quiz-info-grid strong,
.quiz-info-grid small {
  display: block;
}

.quiz-info-grid span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.quiz-info-grid strong {
  margin: 8px 0 4px;
  font-size: 1.4rem;
}

.quiz-info-grid small {
  opacity: 0.45;
}

.instructions-card {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  margin-bottom: variables.$spacing-md;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
}

.instructions-card__number {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-bold;
}

.instructions-card strong,
.instructions-card p {
  margin: 0;
}

.instructions-card p {
  margin-top: 5px;
  line-height: 1.55;
  opacity: 0.55;
}

.instructions-card--warning {
  border-color: rgba(255, 187, 69, 0.45);
}

.start-button {
  min-width: 260px;
  margin-top: variables.$spacing-xl;
}

/* =========================================================
   HEADER EXAMEN
========================================================= */

.exam-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  gap: variables.$spacing-xl;
  align-items: center;
  justify-content: space-between;
  margin: -10px 0 variables.$spacing-lg;
  padding: 12px 0;
  border-bottom: 1px solid variables.$color-border;
  background: variables.$color-background;
}

.exam-header__main,
.exam-header__status {
  display: flex;
  gap: 14px;
  align-items: center;
}

.exam-header__back {
  display: grid;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-border;
  border-radius: 50%;
  color: variables.$color-white;
  text-decoration: none;
}

.exam-header__back:hover {
  border-color: variables.$color-primary;
  color: variables.$color-primary;
}

.exam-header__title {
  min-width: 0;
}

.exam-header__title span,
.exam-header__title strong {
  display: block;
}

.exam-header__title span {
  margin-bottom: 3px;
  color: variables.$color-primary;
  font-size: 0.68rem;
  letter-spacing: 0.12em;
}

.exam-header__title strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 1rem;
}

.save-status {
  display: flex;
  gap: 7px;
  align-items: center;
  font-size: 0.75rem;
  opacity: 0.6;
}

.save-status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #63c481;
}

.save-status__dot.is-saving {
  background: variables.$color-primary;
  animation: pulse-save 0.8s infinite alternate;
}

.save-status__dot.is-error {
  background: #ff6767;
}

@keyframes pulse-save {
  to {
    opacity: 0.25;
  }
}

.timer {
  min-width: 115px;
  padding: 8px 12px;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  text-align: center;
}

.timer span,
.timer strong {
  display: block;
}

.timer span {
  font-size: 0.58rem;
  letter-spacing: 0.12em;
  opacity: 0.45;
}

.timer strong {
  margin-top: 2px;
  font-variant-numeric: tabular-nums;
  font-size: 1.1rem;
}

.timer--warning {
  border-color: #e5ac43;
  color: #ffd071;
}

.timer--critical {
  border-color: #d85151;
  color: #ff7777;
}

/* =========================================================
   PROGRESO
========================================================= */

.quiz-progress {
  margin-bottom: variables.$spacing-xl;
}

.quiz-progress__copy {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.76rem;
}

.quiz-progress__copy span {
  opacity: 0.5;
}

.quiz-progress__track {
  height: 5px;
  overflow: hidden;
  border-radius: 99px;
  background: variables.$color-border;
}

.quiz-progress__fill {
  height: 100%;
  border-radius: inherit;
  background: variables.$color-primary;
  transition: width 0.3s ease;
}

/* =========================================================
   LAYOUT EXAMEN
========================================================= */

.exam-layout {
  display: grid;
  gap: variables.$spacing-xl;
  align-items: start;
  grid-template-columns: 220px minmax(0, 1fr);
}

.question-navigation {
  position: sticky;
  top: 90px;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.question-navigation__heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: variables.$spacing-md;
}

.question-navigation__heading span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.1em;
}

.question-navigation__heading strong {
  font-size: 0.8rem;
  opacity: 0.5;
}

.question-navigation__grid {
  display: grid;
  gap: 7px;
  grid-template-columns: repeat(4, 1fr);
}

.question-nav-button {
  aspect-ratio: 1;
  border: 1px solid variables.$color-border;
  border-radius: 8px;
  background: transparent;
  color: variables.$color-white;
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
}

.question-nav-button.is-answered {
  border-color: rgba(variables.$color-primary, 0.5);
  color: variables.$color-primary;
}

.question-nav-button.is-current {
  border-color: variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.question-navigation__legend {
  display: grid;
  gap: 7px;
  margin-top: variables.$spacing-lg;
  padding-top: variables.$spacing-md;
  border-top: 1px solid variables.$color-border;
}

.question-navigation__legend span {
  display: flex;
  gap: 7px;
  align-items: center;
  font-size: 0.68rem;
  opacity: 0.55;
}

.legend-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot--answered {
  background: variables.$color-primary;
}

.legend-dot--pending {
  border: 1px solid variables.$color-border;
}

/* =========================================================
   PREGUNTA
========================================================= */

.question-panel {
  min-height: 590px;
  padding: clamp(24px, 5vw, 52px);
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    radial-gradient(
      circle at 100% 0,
      rgba(variables.$color-primary, 0.08),
      transparent 35%
    ),
    variables.$color-surface;
}

.question-panel__top {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: variables.$spacing-2xl;
}

.question-panel__top p {
  margin: 0 0 8px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
}

.question-meta {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
}

.question-meta span {
  padding: 4px 8px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  font-size: 0.65rem;
  opacity: 0.55;
}

.question-number {
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: variables.$font-weight-bold;
  line-height: 1;
  opacity: 0.08;
}

.question-prompt {
  max-width: 850px;
  margin: 0 0 variables.$spacing-2xl;
  font-size: clamp(1.5rem, 3vw, 2.35rem);
  line-height: 1.25;
}

.question-media {
  margin-bottom: variables.$spacing-xl;
}

.question-media audio {
  width: min(650px, 100%);
}

.question-media img {
  display: block;
  max-width: min(760px, 100%);
  max-height: 440px;
  border-radius: variables.$radius-lg;
  object-fit: contain;
}

/* =========================================================
   OPCIONES
========================================================= */

.options-list {
  display: grid;
  gap: 12px;
}

.multiple-notice {
  margin: -8px 0 8px;
  font-size: 0.78rem;
  opacity: 0.5;
}

.option-card {
  display: grid;
  gap: 14px;
  align-items: center;
  min-height: 70px;
  padding: 12px 16px;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  cursor: pointer;
  grid-template-columns: auto 1fr auto;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
}

.option-card:hover {
  border-color: rgba(variables.$color-primary, 0.6);
  transform: translateY(-1px);
}

.option-card.is-selected {
  border-color: variables.$color-primary;
  background: rgba(variables.$color-primary, 0.07);
}

.option-card input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.option-card__letter {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border: 1px solid variables.$color-border;
  border-radius: 50%;
  font-size: 0.78rem;
  font-weight: variables.$font-weight-bold;
}

.option-card.is-selected .option-card__letter {
  border-color: variables.$color-primary;
  background: variables.$color-primary;
  color: variables.$color-white;
}

.option-card__text {
  line-height: 1.5;
}

.option-card__check {
  color: variables.$color-primary;
  opacity: 0;
}

.option-card.is-selected .option-card__check {
  opacity: 1;
}

/* =========================================================
   TEXTO
========================================================= */

.text-answer {
  display: grid;
  gap: 8px;
}

.text-answer label {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.text-answer input,
.text-answer textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  outline: none;
  background: variables.$color-background;
  color: variables.$color-white;
  font: inherit;
  line-height: 1.6;
  resize: vertical;
}

.text-answer input:focus,
.text-answer textarea:focus {
  border-color: variables.$color-primary;
}

.text-answer small {
  justify-self: end;
  opacity: 0.4;
}

/* =========================================================
   ACCIONES DE PREGUNTA
========================================================= */

.question-actions {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  margin-top: variables.$spacing-3xl;
  padding-top: variables.$spacing-xl;
  border-top: 1px solid variables.$color-border;
}

.question-actions__save {
  flex: 1;
  text-align: center;
  font-size: 0.72rem;
  opacity: 0.45;
}

/* =========================================================
   REVISIÓN
========================================================= */

.review-screen {
  max-width: 1000px;
  margin: 0 auto;
}

.review-screen__heading {
  margin: variables.$spacing-xl 0 variables.$spacing-2xl;
  text-align: center;
}

.review-screen__heading p {
  margin: 0 0 8px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.13em;
}

.review-screen__heading h1 {
  margin: 0;
  font-size: clamp(2.7rem, 6vw, 5rem);
}

.review-screen__heading > span {
  display: block;
  max-width: 620px;
  margin: variables.$spacing-md auto 0;
  line-height: 1.6;
  opacity: 0.55;
}

.review-summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: variables.$spacing-xl;
}

.review-summary article {
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  text-align: center;
}

.review-summary span,
.review-summary strong {
  display: block;
}

.review-summary span {
  margin-bottom: 7px;
  font-size: variables.$font-size-xs;
  opacity: 0.45;
}

.review-summary strong {
  color: variables.$color-primary;
  font-size: 1.4rem;
}

.review-questions {
  display: grid;
  gap: 10px;
}

.review-question {
  display: grid;
  gap: 14px;
  align-items: center;
  width: 100%;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  color: variables.$color-white;
  font: inherit;
  text-align: left;
  cursor: pointer;
  grid-template-columns: auto 1fr auto auto;
}

.review-question:hover {
  border-color: variables.$color-primary;
}

.review-question__number {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid variables.$color-border;
  border-radius: 50%;
  font-size: 0.72rem;
}

.review-question.is-complete .review-question__number {
  border-color: variables.$color-primary;
  color: variables.$color-primary;
}

.review-question.is-pending {
  border-color: rgba(216, 81, 81, 0.4);
}

.review-question__copy {
  min-width: 0;
}

.review-question__copy span,
.review-question__copy strong {
  display: block;
}

.review-question__copy span {
  margin-bottom: 3px;
  color: variables.$color-primary;
  font-size: 0.65rem;
}

.review-question__copy strong {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.88rem;
}

.review-question__status {
  padding: 5px 9px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  font-size: 0.65rem;
}

.review-question.is-complete .review-question__status {
  color: variables.$color-primary;
}

.review-question.is-pending .review-question__status {
  color: #ff7777;
}

.review-question__arrow {
  color: variables.$color-primary;
}

.review-warning {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-top: variables.$spacing-xl;
  padding: variables.$spacing-lg;
  border: 1px solid #d85151;
  border-radius: variables.$radius-lg;
}

.review-warning > div {
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: #d85151;
  color: white;
}

.review-warning p {
  margin: 0;
}

.review-actions {
  display: flex;
  gap: variables.$spacing-md;
  justify-content: flex-end;
  margin-top: variables.$spacing-2xl;
}

/* =========================================================
   RESULTADO
========================================================= */

.result-screen {
  display: grid;
  max-width: 800px;
  min-height: 620px;
  margin: 0 auto;
  place-items: center;
  align-content: center;
  padding: 40px 20px;
  text-align: center;
}

.result-screen__eyebrow {
  margin-bottom: variables.$spacing-lg;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.15em;
}

.result-screen__icon {
  display: grid;
  width: 96px;
  height: 96px;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 2.6rem;
}

.result-screen__icon--failed {
  border-color: #d85151;
  color: #ff7777;
}

.result-screen__icon--pending {
  border-color: #e5ac43;
  color: #ffd071;
}

.result-screen h1 {
  margin: variables.$spacing-xl 0 variables.$spacing-md;
  font-size: clamp(2.5rem, 6vw, 4.5rem);
}

.result-screen__description {
  max-width: 650px;
  margin: 0;
  line-height: 1.65;
  opacity: 0.6;
}

.result-score {
  display: flex;
  gap: variables.$spacing-2xl;
  align-items: center;
  margin-top: variables.$spacing-2xl;
  padding: variables.$spacing-xl variables.$spacing-2xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.result-score__number {
  color: variables.$color-primary;
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: variables.$font-weight-bold;
  line-height: 1;
}

.result-score__details {
  text-align: left;
}

.result-score__details span,
.result-score__details strong {
  display: block;
}

.result-score__details span {
  font-size: variables.$font-size-xs;
  opacity: 0.45;
}

.result-score__details strong {
  margin-top: 5px;
  font-size: 1.2rem;
}

.result-status {
  margin-top: variables.$spacing-lg;
  padding: 8px 14px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: variables.$font-weight-semibold;
}

.result-status--passed {
  border-color: #4caa6d;
  color: #70d892;
}

.result-status--failed {
  border-color: #d85151;
  color: #ff7777;
}

.manual-notice {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  max-width: 700px;
  margin-top: variables.$spacing-xl;
  padding: variables.$spacing-lg;
  border: 1px solid rgba(229, 172, 67, 0.5);
  border-radius: variables.$radius-lg;
  text-align: left;
}

.manual-notice__icon {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid #e5ac43;
  border-radius: 50%;
  color: #ffd071;
}

.manual-notice p {
  margin: 5px 0 0;
  line-height: 1.5;
  opacity: 0.55;
}

.result-screen__actions {
  display: flex;
  gap: variables.$spacing-md;
  margin-top: variables.$spacing-2xl;
}

/* =========================================================
   MODAL
========================================================= */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
}

.confirmation-modal {
  width: min(520px, 100%);
  padding: clamp(24px, 5vw, 42px);
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  text-align: center;
}

.confirmation-modal__icon {
  display: grid;
  width: 70px;
  height: 70px;
  place-items: center;
  margin: 0 auto variables.$spacing-lg;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 1.8rem;
}

.confirmation-modal h2 {
  margin: 0 0 variables.$spacing-md;
  font-size: 2rem;
}

.confirmation-modal > p {
  line-height: 1.55;
  opacity: 0.6;
}

.confirmation-modal__warning {
  padding: 10px;
  border: 1px solid rgba(216, 81, 81, 0.4);
  border-radius: variables.$radius-lg;
  color: #ff7777;
  opacity: 1 !important;
}

.confirmation-modal__actions {
  display: grid;
  gap: 10px;
  margin-top: variables.$spacing-xl;
  grid-template-columns: repeat(2, 1fr);
}

/* =========================================================
   TOAST
========================================================= */

.quiz-toast {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 100000;
  max-width: min(420px, calc(100vw - 32px));
  padding: 13px 17px;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  color: variables.$color-white;
  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.4);
}

.quiz-toast--error {
  border-color: #d85151;
  color: #ff8a8a;
}

.toast-enter-active,
.toast-leave-active,
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.18s ease;
}

.toast-enter-from,
.toast-leave-to,
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1000px) {
  .quiz-info-grid,
  .review-summary {
    grid-template-columns: repeat(2, 1fr);
  }

  .exam-layout {
    grid-template-columns: 1fr;
  }

  .question-navigation {
    position: static;
  }

  .question-navigation__grid {
    grid-template-columns: repeat(8, 1fr);
  }
}

@media (max-width: 760px) {
  .quiz-cover {
    align-items: stretch;
    flex-direction: column;
  }

  .quiz-cover__badge {
    width: 100%;
  }

  .exam-header {
    align-items: stretch;
    flex-direction: column;
  }

  .exam-header__status {
    justify-content: space-between;
  }

  .save-status {
    flex: 1;
  }

  .question-navigation__grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .question-panel {
    padding: 22px 18px;
  }

  .question-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .question-actions__save {
    order: -1;
  }

  .review-question {
    grid-template-columns: auto 1fr auto;
  }

  .review-question__status {
    grid-column: 2 / 4;
    justify-self: start;
  }

  .review-actions,
  .result-screen__actions {
    align-items: stretch;
    flex-direction: column;
    width: 100%;
  }

  .result-score {
    align-items: center;
    flex-direction: column;
    text-align: center;
  }

  .result-score__details {
    text-align: center;
  }
}

@media (max-width: 560px) {
  .quiz-info-grid,
  .review-summary {
    grid-template-columns: 1fr 1fr;
  }

  .question-navigation__grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .question-prompt {
    font-size: 1.45rem;
  }

  .option-card {
    grid-template-columns: auto 1fr;
  }

  .option-card__check {
    display: none;
  }

  .confirmation-modal__actions {
    grid-template-columns: 1fr;
  }

  .quiz-toast {
    right: 16px;
    bottom: 16px;
    left: 16px;
  }
}
</style>
