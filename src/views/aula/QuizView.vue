<template>
  <section class="quiz-page">
    <!-- =====================================================
         LOADING
    ====================================================== -->
    <section
      v-if="isLoading"
      class="quiz-state"
    >
      <div class="quiz-state__spinner"></div>

      <span class="quiz-state__eyebrow">
        EVALUACIÓN
      </span>

      <h1>
        Preparando tu evaluación
      </h1>

      <p>
        Estamos cargando las preguntas y recuperando
        tu avance guardado.
      </p>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="quiz-state quiz-state--error"
    >
      <div class="quiz-state__icon">
        !
      </div>

      <span class="quiz-state__eyebrow">
        NO PUDIMOS CONTINUAR
      </span>

      <h1>
        Ocurrió un problema
      </h1>

      <p>
        {{ loadError }}
      </p>

      <div class="quiz-state__actions">
        <button
          type="button"
          @click="loadQuiz"
        >
          Reintentar
        </button>

        <RouterLink
          :to="lessonRoute"
        >
          Volver a la clase
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         RESULTADO
    ====================================================== -->
    <section
      v-else-if="submissionResult"
      class="result-screen"
    >
      <div
        class="result-screen__icon"
        :class="{
          'result-screen__icon--pending':
            submissionResult.requiresManualGrading
        }"
      >
        {{
          submissionResult.requiresManualGrading
            ? '…'
            : '✓'
        }}
      </div>

      <span class="result-screen__eyebrow">
        EVALUACIÓN ENTREGADA
      </span>

      <h1>
        {{
          submissionResult.requiresManualGrading
            ? 'Tu evaluación fue enviada'
            : 'Tu evaluación fue corregida'
        }}
      </h1>

      <p>
        {{
          submissionResult.requiresManualGrading
            ? 'Hay respuestas que deben ser revisadas por tu profesor. Tu entrega quedó registrada correctamente.'
            : 'Tu entrega quedó registrada correctamente.'
        }}
      </p>

      <div
        v-if="
          submissionResult.score !== null &&
          submissionResult.score !== undefined
        "
        class="result-score"
      >
        <div>
          <small>
            PUNTAJE
          </small>

          <strong>
            {{ formatScore(submissionResult.score) }}
            /
            {{ formatScore(submissionResult.maxScore) }}
          </strong>
        </div>

        <div
          v-if="
            submissionResult.percentage !== null &&
            submissionResult.percentage !== undefined
          "
        >
          <small>
            RESULTADO
          </small>

          <strong>
            {{ Math.round(submissionResult.percentage) }}%
          </strong>
        </div>

        <div
          v-if="
            submissionResult.passed !== null &&
            submissionResult.passed !== undefined
          "
        >
          <small>
            ESTADO
          </small>

          <strong
            :class="{
              'result-score__passed':
                submissionResult.passed,
              'result-score__failed':
                !submissionResult.passed
            }"
          >
            {{
              submissionResult.passed
                ? 'Aprobada'
                : 'Por reforzar'
            }}
          </strong>
        </div>
      </div>

      <div
        v-else
        class="result-notice"
      >
        <strong>
          Entrega registrada
        </strong>

        <p>
          El resultado no está configurado para mostrarse
          inmediatamente.
        </p>
      </div>

      <section class="result-guidance">
        <div>
          <small>
            TIPO DE EVALUACIÓN
          </small>

          <strong>
            {{
              quiz?.assessmentType === 'test'
                ? 'Prueba evaluada'
                : 'Quiz formativo'
            }}
          </strong>
        </div>

        <div>
          <small>
            INTENTOS
          </small>

          <strong>
            {{ attemptRuleLabel }}
          </strong>
        </div>

        <div>
          <small>
            SIGUIENTE PASO
          </small>

          <strong>
            {{ resultNextStepLabel }}
          </strong>
        </div>
      </section>

      <div
        v-if="
          quiz?.assessmentType === 'quiz' &&
          canRetakeQuiz
        "
        class="result-learning-box"
      >
        <span>
          QUIZ FORMATIVO
        </span>

        <h2>
          Puedes volver a intentarlo
        </h2>

        <p>
          Los quiz están pensados para practicar,
          detectar qué contenidos debes reforzar y
          comparar tu progreso entre intentos.
        </p>

        <button
          type="button"
          class="button button--primary"
          @click="startNewPracticeAttempt"
        >
          Reintentar quiz
        </button>
      </div>

      <div
        v-else-if="
          quiz?.assessmentType === 'test'
        "
        class="result-learning-box result-learning-box--locked"
      >
        <span>
          PRUEBA EVALUADA
        </span>

        <h2>
          Intento registrado
        </h2>

        <p>
          Las pruebas respetan el número de intentos
          definido por el profesor. Si el límite es uno,
          no podrás rendirla nuevamente.
        </p>
      </div>

      <section class="result-next-step">
        <div class="result-next-step__copy">
          <span>
            SIGUIENTE PASO
          </span>

          <h2>
            {{
              submissionResult.requiresManualGrading
                ? 'Espera la revisión del profesor'
                : submissionResult.percentage >= 80
                  ? 'Revisa tus respuestas y consolida lo aprendido'
                  : 'Revisa tus errores antes de volver a practicar'
            }}
          </h2>

          <p>
            {{
              submissionResult.requiresManualGrading
                ? 'Tu entrega quedó registrada. Cuando el profesor termine la corrección podrás revisar el resultado desde Mis evaluaciones.'
                : 'Abre la revisión completa para ver qué respuestas estuvieron correctas, cuáles debes reforzar y la explicación disponible para cada pregunta.'
            }}
          </p>
        </div>

        <div class="result-next-step__actions">
          <RouterLink
            v-if="reviewAttemptId"
            :to="`/aula/evaluaciones/intento/${reviewAttemptId}`"
            class="result-action result-action--primary"
          >
            <span class="result-action__icon">
              ✓
            </span>

            <div>
              <small>
                APRENDER DEL RESULTADO
              </small>

              <strong>
                Ver revisión completa
              </strong>
            </div>

            <b>
              →
            </b>
          </RouterLink>

          <RouterLink
            to="/aula/evaluaciones"
            class="result-action"
          >
            <span class="result-action__icon">
              %
            </span>

            <div>
              <small>
                MI HISTORIAL
              </small>

              <strong>
                Mis evaluaciones
              </strong>
            </div>

            <b>
              →
            </b>
          </RouterLink>

          <RouterLink
            :to="lessonRoute"
            class="result-action"
          >
            <span class="result-action__icon">
              ♪
            </span>

            <div>
              <small>
                VOLVER A ESTUDIAR
              </small>

              <strong>
                Material de la clase
              </strong>
            </div>

            <b>
              →
            </b>
          </RouterLink>
        </div>
      </section>

      <div
        v-if="
          !submissionResult.requiresManualGrading &&
          submissionResult.percentage !== null &&
          submissionResult.percentage !== undefined
        "
        class="result-learning-summary"
        :class="{
          'result-learning-summary--excellent':
            submissionResult.percentage >= 90,
          'result-learning-summary--good':
            submissionResult.percentage >= 70 &&
            submissionResult.percentage < 90,
          'result-learning-summary--reinforce':
            submissionResult.percentage < 70
        }"
      >
        <div class="result-learning-summary__icon">
          {{
            submissionResult.percentage >= 90
              ? '★'
              : submissionResult.percentage >= 70
                ? '✓'
                : '↗'
          }}
        </div>

        <div>
          <span>
            LECTURA PEDAGÓGICA
          </span>

          <h2>
            {{
              submissionResult.percentage >= 90
                ? 'Dominio muy sólido'
                : submissionResult.percentage >= 70
                  ? 'Buen avance'
                  : 'Hay contenidos que conviene reforzar'
            }}
          </h2>

          <p>
            {{
              submissionResult.percentage >= 90
                ? 'Tu resultado muestra un dominio muy sólido de los contenidos evaluados. Revisa igualmente las preguntas para consolidar los conceptos.'
                : submissionResult.percentage >= 70
                  ? 'Vas por buen camino. La revisión te ayudará a detectar los conceptos que todavía necesitan práctica.'
                  : 'Antes de repetir el quiz, revisa las preguntas incorrectas y vuelve al material de la clase.'
            }}
          </p>
        </div>
      </div>

      <div class="result-screen__actions result-screen__actions--secondary">
        <RouterLink
          to="/aula/programa-formativo"
          class="button button--secondary"
        >
          Ver programa completo
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         QUIZ
    ====================================================== -->
    <template v-else-if="quiz && attempt">
      <!-- TOPBAR -->
      <header class="quiz-topbar">
        <RouterLink
          :to="lessonRoute"
          class="quiz-back"
        >
          <span>←</span>
          Volver a la clase
        </RouterLink>

        <div class="quiz-topbar__status">
          <span
            class="save-indicator"
            :class="{
              'save-indicator--saving':
                isSavingAnyAnswer,
              'save-indicator--error':
                Boolean(saveError)
            }"
          ></span>

          {{
            saveError
              ? 'No se pudo guardar una respuesta'
              : isSavingAnyAnswer
                ? 'Guardando...'
                : 'Respuestas guardadas'
          }}
        </div>
      </header>

      <!-- HERO -->
      <section class="quiz-hero">
        <div class="quiz-hero__main">
          <div class="quiz-hero__eyebrow">
            <span>
              {{
                quiz.assessmentType === 'test'
                  ? 'PRUEBA'
                  : 'QUIZ'
              }}
            </span>

            <span>
              Clase {{ lessonNumberLabel }}
            </span>
          </div>

          <h1>
            {{ quiz.title }}
          </h1>

          <p v-if="quiz.description">
            {{ quiz.description }}
          </p>

          <div
            class="assessment-purpose"
            :class="{
              'assessment-purpose--test':
                quiz.assessmentType === 'test'
            }"
          >
            <strong>
              {{
                quiz.assessmentType === 'test'
                  ? 'Prueba evaluada'
                  : 'Quiz formativo'
              }}
            </strong>

            <span>
              {{
                quiz.assessmentType === 'test'
                  ? 'Tu resultado quedará registrado como evaluación formal.'
                  : 'Úsalo para practicar, detectar errores y reforzar contenidos.'
              }}
            </span>
          </div>

          <div class="quiz-hero__meta">
            <span>
              {{ quiz.totalPoints || totalQuestionPoints }} pts
            </span>

            <span>
              {{ questions.length }}
              {{
                questions.length === 1
                  ? 'pregunta'
                  : 'preguntas'
              }}
            </span>

            <span v-if="quiz.attemptsAllowed">
              {{
                quiz.attemptsAllowed === 1
                  ? '1 intento'
                  : `${quiz.attemptsAllowed} intentos`
              }}
            </span>

            <span v-if="quiz.timeLimitMinutes">
              {{ quiz.timeLimitMinutes }} min
            </span>
          </div>
        </div>

        <aside
          v-if="quiz.timeLimitMinutes"
          class="timer-card"
          :class="{
            'timer-card--warning':
              remainingSeconds <= 300 &&
              remainingSeconds > 60,
            'timer-card--critical':
              remainingSeconds <= 60
          }"
        >
          <small>
            TIEMPO RESTANTE
          </small>

          <strong>
            {{ remainingTimeLabel }}
          </strong>

          <span>
            {{
              remainingSeconds <= 60
                ? 'Entrega pronto'
                : 'Tu progreso se guarda'
            }}
          </span>
        </aside>
      </section>

      <!-- PROGRESS -->
      <section class="quiz-progress">
        <div class="quiz-progress__heading">
          <div>
            <span>
              TU AVANCE
            </span>

            <strong>
              {{ answeredCount }}
              de {{ questions.length }}
              respondidas
            </strong>
          </div>

          <b>
            {{ progressPercentage }}%
          </b>
        </div>

        <div class="quiz-progress__bar">
          <span
            :style="{
              width: `${progressPercentage}%`
            }"
          ></span>
        </div>
      </section>

      <!-- MAIN LAYOUT -->
      <div class="quiz-layout">
        <!-- QUESTION -->
        <main class="question-panel">
          <header class="question-header">
            <div>
              <span class="question-number">
                PREGUNTA
                {{
                  String(
                    currentQuestionIndex + 1,
                  ).padStart(2, '0')
                }}
              </span>

              <span
                v-if="currentQuestion.required"
                class="required-badge"
              >
                Obligatoria
              </span>
            </div>

            <strong>
              {{ currentQuestion.points }}
              {{
                Number(currentQuestion.points) === 1
                  ? 'punto'
                  : 'puntos'
              }}
            </strong>
          </header>

          <section class="question-content">
            <h2>
              {{ currentQuestion.prompt }}
            </h2>

            <div
              v-if="currentQuestion.mediaUrl"
              class="question-media"
            >
              <audio
                v-if="currentQuestion.mediaType === 'audio'"
                :src="currentQuestion.mediaUrl"
                controls
                preload="metadata"
              ></audio>

              <img
                v-else-if="currentQuestion.mediaType === 'image'"
                :src="currentQuestion.mediaUrl"
                alt="Material visual de la pregunta"
              >
            </div>

            <!-- SINGLE / TRUE FALSE -->
            <div
              v-if="
                currentQuestion.type === 'single_choice' ||
                currentQuestion.type === 'true_false'
              "
              class="options-list"
            >
              <label
                v-for="option in currentQuestion.options"
                :key="option.id"
                class="option-card"
                :class="{
                  'option-card--selected':
                    isOptionSelected(
                      currentQuestion.id,
                      option.id,
                    )
                }"
              >
                <input
                  type="radio"
                  :name="`question-${currentQuestion.id}`"
                  :value="option.id"
                  :checked="
                    isOptionSelected(
                      currentQuestion.id,
                      option.id,
                    )
                  "
                  @change="
                    selectSingleOption(
                      currentQuestion,
                      option.id,
                    )
                  "
                >

                <span class="option-card__marker">
                  {{
                    optionLetter(
                      currentQuestion.options,
                      option.id,
                    )
                  }}
                </span>

                <strong>
                  {{ option.text }}
                </strong>
              </label>
            </div>

            <!-- MULTIPLE -->
            <div
              v-else-if="
                currentQuestion.type === 'multiple_choice'
              "
              class="options-list"
            >
              <p class="question-hint">
                Puedes seleccionar más de una alternativa.
              </p>

              <label
                v-for="option in currentQuestion.options"
                :key="option.id"
                class="option-card"
                :class="{
                  'option-card--selected':
                    isOptionSelected(
                      currentQuestion.id,
                      option.id,
                    )
                }"
              >
                <input
                  type="checkbox"
                  :value="option.id"
                  :checked="
                    isOptionSelected(
                      currentQuestion.id,
                      option.id,
                    )
                  "
                  @change="
                    toggleMultipleOption(
                      currentQuestion,
                      option.id,
                    )
                  "
                >

                <span class="option-card__marker">
                  {{
                    optionLetter(
                      currentQuestion.options,
                      option.id,
                    )
                  }}
                </span>

                <strong>
                  {{ option.text }}
                </strong>
              </label>
            </div>

            <!-- SHORT -->
            <div
              v-else-if="
                currentQuestion.type === 'short_answer'
              "
              class="text-answer"
            >
              <label
                :for="`answer-${currentQuestion.id}`"
              >
                Tu respuesta
              </label>

              <input
                :id="`answer-${currentQuestion.id}`"
                :value="
                  getAnswer(
                    currentQuestion.id,
                  ).textAnswer
                "
                type="text"
                maxlength="500"
                placeholder="Escribe tu respuesta aquí..."
                @input="
                  updateTextAnswer(
                    currentQuestion,
                    $event.target.value,
                  )
                "
                @blur="
                  flushQuestionSave(
                    currentQuestion.id,
                  )
                "
              >
            </div>

            <!-- ESSAY -->
            <div
              v-else-if="
                currentQuestion.type === 'essay'
              "
              class="text-answer"
            >
              <label
                :for="`answer-${currentQuestion.id}`"
              >
                Tu respuesta
              </label>

              <textarea
                :id="`answer-${currentQuestion.id}`"
                :value="
                  getAnswer(
                    currentQuestion.id,
                  ).textAnswer
                "
                rows="10"
                maxlength="10000"
                placeholder="Desarrolla tu respuesta..."
                @input="
                  updateTextAnswer(
                    currentQuestion,
                    $event.target.value,
                  )
                "
                @blur="
                  flushQuestionSave(
                    currentQuestion.id,
                  )
                "
              ></textarea>
            </div>

            <div
              v-else
              class="unsupported-question"
            >
              Esta pregunta utiliza un formato que todavía
              no está habilitado.
            </div>
          </section>

          <!-- QUESTION NAV -->
          <footer class="question-actions">
            <button
              type="button"
              class="button button--secondary"
              :disabled="currentQuestionIndex === 0"
              @click="previousQuestion"
            >
              ← Anterior
            </button>

            <div class="question-actions__center">
              <span
                v-if="currentQuestion.required"
              >
                {{
                  isQuestionAnswered(
                    currentQuestion,
                    getAnswer(currentQuestion.id),
                  )
                    ? '✓ Respondida'
                    : 'Respuesta obligatoria'
                }}
              </span>
            </div>

            <button
              v-if="
                currentQuestionIndex <
                questions.length - 1
              "
              type="button"
              class="button button--primary"
              @click="nextQuestion"
            >
              Siguiente →
            </button>

            <button
              v-else
              type="button"
              class="button button--primary"
              @click="openSubmitDialog"
            >
              Revisar y entregar →
            </button>
          </footer>
        </main>

        <!-- SIDEBAR -->
        <aside class="question-sidebar">
          <section class="navigator-card">
            <span class="navigator-card__eyebrow">
              PREGUNTAS
            </span>

            <div class="question-grid">
              <button
                v-for="(question, index) in questions"
                :key="question.id"
                type="button"
                class="question-dot"
                :class="{
                  'question-dot--current':
                    index === currentQuestionIndex,
                  'question-dot--answered':
                    isQuestionAnswered(
                      question,
                      getAnswer(question.id),
                    ),
                  'question-dot--pending':
                    !isQuestionAnswered(
                      question,
                      getAnswer(question.id),
                    ),
                  'question-dot--required':
                    question.required
                }"
                :aria-label="
                  `Ir a pregunta ${index + 1}`
                "
                @click="
                  goToQuestion(index)
                "
              >
                <span>
                  {{ index + 1 }}
                </span>

                <b
                  v-if="
                    isQuestionAnswered(
                      question,
                      getAnswer(question.id),
                    ) &&
                    index !== currentQuestionIndex
                  "
                  aria-hidden="true"
                >
                  ✓
                </b>
              </button>
            </div>

            <div class="navigator-legend">
              <span>
                <i class="legend-box legend-box--current"></i>
                Actual
              </span>

              <span>
                <i class="legend-box legend-box--answered"></i>
                Respondida
              </span>

              <span>
                <i class="legend-box legend-box--pending"></i>
                Pendiente
              </span>
            </div>
          </section>

          <section class="summary-card">
            <span class="navigator-card__eyebrow">
              RESUMEN
            </span>

            <div class="summary-row">
              <span>
                Respondidas
              </span>

              <strong>
                {{ answeredCount }}
              </strong>
            </div>

            <div class="summary-row">
              <span>
                Pendientes
              </span>

              <strong>
                {{ unansweredCount }}
              </strong>
            </div>

            <div class="summary-row">
              <span>
                Obligatorias pendientes
              </span>

              <strong>
                {{ requiredUnansweredCount }}
              </strong>
            </div>

            <button
              type="button"
              class="submit-sidebar-button"
              :disabled="
                isSubmitting ||
                isSavingAnyAnswer ||
                Boolean(saveError)
              "
              @click="openSubmitDialog"
            >
              Entregar evaluación
              <span>→</span>
            </button>
          </section>

          <section
            class="autosave-card"
            :class="{
              'autosave-card--error':
                Boolean(saveError)
            }"
          >
            <div>
              {{ saveError ? '!' : '✓' }}
            </div>

            <p>
              {{
                saveError
                  ? 'Hubo un problema de conexión. Revisa internet antes de entregar.'
                  : 'Tus respuestas se guardan automáticamente mientras avanzas.'
              }}
            </p>
          </section>
        </aside>
      </div>
    </template>

    <!-- =====================================================
         CONFIRMAR ENTREGA
    ====================================================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showSubmitDialog"
          class="modal-backdrop"
          @click.self="
            !isSubmitting &&
            closeSubmitDialog()
          "
        >
          <article
            class="submit-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="submit-dialog-title"
          >
            <div class="submit-dialog__icon">
              ✓
            </div>

            <span class="submit-dialog__eyebrow">
              ENTREGA FINAL
            </span>

            <h2 id="submit-dialog-title">
              ¿Entregar esta evaluación?
            </h2>

            <p>
              Has respondido
              <strong>{{ answeredCount }}</strong>
              de
              <strong>{{ questions.length }}</strong>
              preguntas.
            </p>

            <div
              v-if="requiredUnansweredCount"
              class="submit-warning"
            >
              <strong>
                Te faltan
                {{ requiredUnansweredCount }}
                {{
                  requiredUnansweredCount === 1
                    ? 'pregunta obligatoria'
                    : 'preguntas obligatorias'
                }}.
              </strong>

              <p>
                Puedes volver y responderlas antes de entregar.
              </p>
            </div>

            <div
              v-else-if="unansweredCount"
              class="submit-notice"
            >
              Quedan {{ unansweredCount }}
              {{
                unansweredCount === 1
                  ? 'pregunta sin responder'
                  : 'preguntas sin responder'
              }}.
            </div>

            <div
              v-else
              class="submit-success"
            >
              <strong>
                ✓ Todas las preguntas están respondidas
              </strong>

              <p>
                Revisa una última vez y entrega cuando estés listo.
              </p>
            </div>

            <div class="submit-dialog__actions">
              <button
                type="button"
                class="button button--secondary"
                :disabled="isSubmitting"
                @click="closeSubmitDialog"
              >
                Seguir revisando
              </button>

              <button
                type="button"
                class="button button--primary"
                :disabled="
                  isSubmitting ||
                  isSavingAnyAnswer ||
                  Boolean(saveError) ||
                  requiredUnansweredCount > 0
                "
                @click="submitEvaluation"
              >
                {{
                  isSubmitting
                    ? 'Entregando...'
                    : 'Sí, entregar'
                }}
              </button>
            </div>
          </article>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<script setup>
import {
  computed,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from 'vue'

import {
  RouterLink,
  useRoute,
} from 'vue-router'

import {
  calculateRemainingSeconds,
  fetchAttemptAnswers,
  fetchStudentQuizContent,
  formatRemainingTime,
  saveQuizAnswer,
  startQuizAttempt,
  submitQuizAttempt,
} from '@/services/quizAttemptService'

import {
  fetchLessonById,
  fetchLessons,
} from '@/services/lessonService'

import {
  useAuth,
} from '@/composables/useAuth'

const route = useRoute()

const {
  isStudent,
} = useAuth()

/* =========================================================
   IDS
========================================================= */

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

const lessonRoute =
  computed(() =>
    `/aula/clase/${lessonId.value}`,
  )

const resultStorageKey =
  computed(() =>
    `amv-quiz-result-${quizId.value}`,
  )

const saveResultCache =
  result => {
    try {
      window.localStorage
        .setItem(
          resultStorageKey.value,
          JSON.stringify({
            ...result,
            quizId:
              quizId.value,
            savedAt:
              new Date()
                .toISOString(),
          }),
        )
    } catch {
      // El cache local es solo una ayuda visual.
    }
  }

const readResultCache =
  () => {
    try {
      const raw =
        window.localStorage
          .getItem(
            resultStorageKey.value,
          )

      if (!raw) {
        return null
      }

      const parsed =
        JSON.parse(raw)

      if (
        Number(parsed?.quizId) !==
        Number(quizId.value)
      ) {
        return null
      }

      return parsed
    } catch {
      return null
    }
  }

const clearResultCache =
  () => {
    try {
      window.localStorage
        .removeItem(
          resultStorageKey.value,
        )
    } catch {
      // Sin acción.
    }
  }

/* =========================================================
   ESTADO
========================================================= */

const quiz = ref(null)
const questions = ref([])
const attempt = ref(null)
const lesson = ref(null)
const allLessons = ref([])

const answers = ref({})

const isLoading = ref(true)
const isSubmitting = ref(false)

const loadError = ref('')
const saveError = ref('')

const currentQuestionIndex = ref(0)

const submissionResult = ref(null)

const showSubmitDialog = ref(false)

const remainingSeconds = ref(0)

const resultWasRestored =
  ref(false)

const savingQuestionIds =
  ref(new Set())

const saveTimers =
  new Map()

let timerInterval = null
let hasAutoSubmitted = false

/* =========================================================
   CARGA
========================================================= */

const loadQuiz =
  async () => {
    isLoading.value = true
    loadError.value = ''
    saveError.value = ''
    submissionResult.value = null

    try {
      if (
        !isStudent.value
      ) {
        throw new Error(
          'Esta evaluación está disponible para estudiantes.',
        )
      }

      if (
        !Number.isFinite(
          lessonId.value,
        ) ||
        lessonId.value <= 0 ||
        !Number.isFinite(
          quizId.value,
        ) ||
        quizId.value <= 0
      ) {
        throw new Error(
          'La evaluación solicitada no es válida.',
        )
      }

      const [
        loadedLesson,
        loadedLessons,
        loadedQuiz,
      ] =
        await Promise.all([
          fetchLessonById(
            lessonId.value,
          ),

          fetchLessons(),

          fetchStudentQuizContent(
            quizId.value,
          ),
        ])

      lesson.value =
        loadedLesson

      allLessons.value =
        loadedLessons || []

      quiz.value =
        loadedQuiz

      questions.value =
        Array.isArray(
          loadedQuiz?.questions,
        )
          ? loadedQuiz.questions
          : []

      /*
       * El RPC seguro puede responder en camelCase o snake_case.
       * Solo bloqueamos si realmente recibimos un lessonId válido
       * y este corresponde a otra clase.
       */
      const loadedQuizLessonId =
        Number(
          loadedQuiz?.lessonId ??
          loadedQuiz?.lesson_id ??
          loadedQuiz?.quiz?.lessonId ??
          loadedQuiz?.quiz?.lesson_id ??
          0,
        )

      if (
        loadedQuizLessonId > 0 &&
        loadedQuizLessonId !==
          Number(
            lessonId.value,
          )
      ) {
        throw new Error(
          'Esta evaluación pertenece a otra clase.',
        )
      }

      if (
        !questions.value.length
      ) {
        throw new Error(
          'La evaluación todavía no tiene preguntas disponibles.',
        )
      }

      /*
       * Si existe un resultado reciente en este dispositivo,
       * lo mostramos antes de iniciar automáticamente otro intento.
       * El servidor sigue siendo quien debe hacer cumplir
       * attempts_allowed.
       */
      const cachedResult =
        readResultCache()

      if (
        cachedResult &&
        cachedResult.status ===
          'submitted'
      ) {
        submissionResult.value =
          cachedResult

        resultWasRestored.value =
          true

        return
      }

      attempt.value =
        await startQuizAttempt(
          quizId.value,
        )

      const savedAnswers =
        await fetchAttemptAnswers(
          attempt.value.id,
        )

      answers.value = {}

      for (
        const question of
        questions.value
      ) {
        answers.value[
          question.id
        ] = {
          questionId:
            question.id,

          selectedOptionIds:
            [],

          textAnswer:
            '',
        }
      }

      for (
        const saved of
        savedAnswers || []
      ) {
        const savedQuestionId =
          Number(
            saved.questionId ??
            saved.question_id,
          )

        if (
          !Number.isFinite(
            savedQuestionId,
          )
        ) {
          continue
        }

        const selectedOptionIds =
          saved.selectedOptionIds ??
          saved.selected_option_ids ??
          []

        const textAnswer =
          saved.textAnswer ??
          saved.text_answer ??
          ''

        answers.value[
          savedQuestionId
        ] = {
          questionId:
            savedQuestionId,

          selectedOptionIds:
            Array.isArray(
              selectedOptionIds,
            )
              ? selectedOptionIds
                  .map(Number)
                  .filter(Number.isFinite)
              : [],

          textAnswer:
            String(
              textAnswer || '',
            ),
        }
      }

      startTimer()
    } catch (error) {
      console.error(
        'Error cargando evaluación:',
        error,
      )

      loadError.value =
        error?.message ||
        'No fue posible cargar la evaluación.'
    } finally {
      isLoading.value = false
    }
  }

/* =========================================================
   NÚMERO ACADÉMICO
========================================================= */

const unitLessons =
  computed(() => {
    const unitId =
      Number(
        lesson.value?.unitId,
      )

    if (!unitId) {
      return []
    }

    return allLessons.value
      .filter(
        item =>
          Number(item.unitId) ===
          unitId,
      )
      .sort(
        (a, b) =>
          Number(a.id) -
          Number(b.id),
      )
  })

const lessonNumber =
  computed(() => {
    const index =
      unitLessons.value
        .findIndex(
          item =>
            Number(item.id) ===
            Number(
              lesson.value?.id,
            ),
        )

    return index >= 0
      ? index + 1
      : 1
  })

const lessonNumberLabel =
  computed(() =>
    String(
      lessonNumber.value,
    ).padStart(2, '0'),
  )

/* =========================================================
   PREGUNTA ACTUAL
========================================================= */

const currentQuestion =
  computed(() =>
    questions.value[
      currentQuestionIndex.value
    ] ||
    questions.value[0] ||
    null,
  )

const getAnswer =
  questionId => {
    return (
      answers.value[
        questionId
      ] || {
        questionId:
          Number(questionId),

        selectedOptionIds:
          [],

        textAnswer:
          '',
      }
    )
  }

/* =========================================================
   DETECTAR RESPUESTAS
   Compatible con estado local y respuestas del RPC
========================================================= */

const isQuestionAnswered = (
  question,
  answer,
) => {
  if (
    !question ||
    !answer
  ) {
    return false
  }

  const selectedOptionIds =
    answer.selectedOptionIds ??
    answer.selected_option_ids ??
    []

  const textAnswer =
    answer.textAnswer ??
    answer.text_answer ??
    ''

  const questionType =
    question.type ??
    question.questionType ??
    question.question_type ??
    ''

  if (
    questionType ===
      'single_choice' ||
    questionType ===
      'multiple_choice' ||
    questionType ===
      'true_false'
  ) {
    return (
      Array.isArray(
        selectedOptionIds,
      ) &&
      selectedOptionIds.length >
        0
    )
  }

  if (
    questionType ===
      'short_answer' ||
    questionType ===
      'short' ||
    questionType ===
      'essay'
  ) {
    return Boolean(
      String(
        textAnswer || '',
      ).trim(),
    )
  }

  return Boolean(
    (
      Array.isArray(
        selectedOptionIds,
      ) &&
      selectedOptionIds.length >
        0
    ) ||
    String(
      textAnswer || '',
    ).trim(),
  )
}

/* =========================================================
   CONTADORES
========================================================= */

const answeredCount =
  computed(() =>
    questions.value
      .filter(
        question =>
          isQuestionAnswered(
            question,
            getAnswer(question.id),
          ),
      )
      .length,
  )

const unansweredCount =
  computed(() =>
    Math.max(
      0,
      questions.value.length -
      answeredCount.value,
    ),
  )

const requiredUnansweredCount =
  computed(() =>
    questions.value
      .filter(
        question =>
          question.required &&
          !isQuestionAnswered(
            question,
            getAnswer(question.id),
          ),
      )
      .length,
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

const totalQuestionPoints =
  computed(() =>
    questions.value.reduce(
      (
        total,
        question,
      ) =>
        total +
        Number(
          question.points || 0,
        ),
      0,
    ),
  )

/* =========================================================
   OPCIONES
========================================================= */

const isOptionSelected = (
  questionId,
  optionId,
) => {
  return getAnswer(
    questionId,
  ).selectedOptionIds
    .map(Number)
    .includes(
      Number(optionId),
    )
}

const optionLetter = (
  options,
  optionId,
) => {
  const index =
    options.findIndex(
      option =>
        Number(option.id) ===
        Number(optionId),
    )

  if (
    index < 0
  ) {
    return '•'
  }

  return String.fromCharCode(
    65 + index,
  )
}

const selectSingleOption = (
  question,
  optionId,
) => {
  answers.value = {
    ...answers.value,

    [question.id]: {
      ...getAnswer(
        question.id,
      ),

      selectedOptionIds: [
        Number(optionId),
      ],
    },
  }

  scheduleAnswerSave(
    question.id,
    150,
  )
}

const toggleMultipleOption = (
  question,
  optionId,
) => {
  const current =
    new Set(
      getAnswer(
        question.id,
      ).selectedOptionIds
        .map(Number),
    )

  const parsed =
    Number(optionId)

  if (
    current.has(parsed)
  ) {
    current.delete(parsed)
  } else {
    current.add(parsed)
  }

  answers.value = {
    ...answers.value,

    [question.id]: {
      ...getAnswer(
        question.id,
      ),

      selectedOptionIds:
        Array.from(current),
    },
  }

  scheduleAnswerSave(
    question.id,
    250,
  )
}

/* =========================================================
   TEXTO
========================================================= */

const updateTextAnswer = (
  question,
  value,
) => {
  answers.value = {
    ...answers.value,

    [question.id]: {
      ...getAnswer(
        question.id,
      ),

      textAnswer:
        String(
          value || '',
        ),
    },
  }

  scheduleAnswerSave(
    question.id,
    700,
  )
}

/* =========================================================
   AUTOGUARDADO
========================================================= */

const isSavingAnyAnswer =
  computed(() =>
    savingQuestionIds.value
      .size > 0,
  )

const setQuestionSaving = (
  questionId,
  saving,
) => {
  const next =
    new Set(
      savingQuestionIds.value,
    )

  if (saving) {
    next.add(
      Number(questionId),
    )
  } else {
    next.delete(
      Number(questionId),
    )
  }

  savingQuestionIds.value =
    next
}

const persistAnswer =
  async questionId => {
    if (
      !attempt.value?.id
    ) {
      return
    }

    const answer =
      getAnswer(
        questionId,
      )

    setQuestionSaving(
      questionId,
      true,
    )

    saveError.value = ''

    try {
      const saved =
        await saveQuizAnswer({
          attemptId:
            attempt.value.id,

          questionId:
            Number(questionId),

          selectedOptionIds:
            answer
              .selectedOptionIds,

          textAnswer:
            answer.textAnswer,
        })

      const savedSelectedOptionIds =
        saved?.selectedOptionIds ??
        saved?.selected_option_ids

      const savedTextAnswer =
        saved?.textAnswer ??
        saved?.text_answer

      answers.value = {
        ...answers.value,

        [questionId]: {
          questionId:
            Number(questionId),

          selectedOptionIds:
            Array.isArray(
              savedSelectedOptionIds,
            )
              ? savedSelectedOptionIds
                  .map(Number)
                  .filter(Number.isFinite)
              : answer.selectedOptionIds,

          textAnswer:
            savedTextAnswer ??
            answer.textAnswer,
        },
      }
    } catch (error) {
      console.error(
        'Error guardando respuesta:',
        error,
      )

      saveError.value =
        error?.message ||
        'No se pudo guardar una respuesta.'
    } finally {
      setQuestionSaving(
        questionId,
        false,
      )
    }
  }

const scheduleAnswerSave = (
  questionId,
  delay = 500,
) => {
  const id =
    Number(questionId)

  if (
    saveTimers.has(id)
  ) {
    clearTimeout(
      saveTimers.get(id),
    )
  }

  const timer =
    setTimeout(
      async () => {
        saveTimers.delete(id)
        await persistAnswer(id)
      },
      delay,
    )

  saveTimers.set(
    id,
    timer,
  )
}

const flushQuestionSave =
  async questionId => {
    const id =
      Number(questionId)

    if (
      saveTimers.has(id)
    ) {
      clearTimeout(
        saveTimers.get(id),
      )

      saveTimers.delete(id)
    }

    await persistAnswer(id)
  }

const flushAllSaves =
  async () => {
    const ids =
      Array.from(
        saveTimers.keys(),
      )

    for (
      const id of ids
    ) {
      clearTimeout(
        saveTimers.get(id),
      )

      saveTimers.delete(id)
    }

    await Promise.all(
      questions.value.map(
        question =>
          persistAnswer(
            question.id,
          ),
      ),
    )
  }

/* =========================================================
   NAVEGACIÓN
========================================================= */

const scrollQuestionTop =
  async () => {
    await nextTick()

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

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

    scrollQuestionTop()
  }

const previousQuestion = () => {
  goToQuestion(
    currentQuestionIndex.value -
      1,
  )
}

const nextQuestion = () => {
  goToQuestion(
    currentQuestionIndex.value +
      1,
  )
}

/* =========================================================
   TIMER
========================================================= */

const remainingTimeLabel =
  computed(() =>
    formatRemainingTime(
      remainingSeconds.value,
    ),
  )

const refreshRemainingTime =
  async () => {
    if (
      !quiz.value
        ?.timeLimitMinutes ||
      !attempt.value
        ?.startedAt
    ) {
      remainingSeconds.value =
        0

      return
    }

    remainingSeconds.value =
      calculateRemainingSeconds(
        attempt.value.startedAt,
        quiz.value
          .timeLimitMinutes,
      )

    if (
      remainingSeconds.value <=
        0 &&
      !hasAutoSubmitted &&
      !submissionResult.value
    ) {
      hasAutoSubmitted = true

      await autoSubmitExpired()
    }
  }

const startTimer = () => {
  stopTimer()

  hasAutoSubmitted = false

  if (
    !quiz.value
      ?.timeLimitMinutes ||
    !attempt.value
      ?.startedAt
  ) {
    return
  }

  refreshRemainingTime()

  timerInterval =
    setInterval(
      refreshRemainingTime,
      1000,
    )
}

const stopTimer = () => {
  if (
    timerInterval
  ) {
    clearInterval(
      timerInterval,
    )

    timerInterval = null
  }
}

const autoSubmitExpired =
  async () => {
    try {
      /*
       * Guardamos todo lo que alcance a estar pendiente.
       * El servidor sigue siendo la autoridad final sobre
       * el tiempo permitido.
       */
      try {
        await flushAllSaves()
      } catch {
        // El RPC puede rechazar saves si el tiempo ya expiró.
      }

      await performSubmit()
    } catch (error) {
      console.error(
        'Error entregando por tiempo:',
        error,
      )

      loadError.value =
        error?.message ||
        'Se acabó el tiempo y no pudimos completar la entrega automáticamente.'
    }
  }

/* =========================================================
   ENTREGA
========================================================= */

const openSubmitDialog = () => {
  showSubmitDialog.value =
    true
}

const closeSubmitDialog = () => {
  if (
    isSubmitting.value
  ) {
    return
  }

  showSubmitDialog.value =
    false
}

const performSubmit =
  async () => {
    if (
      isSubmitting.value ||
      !attempt.value?.id
    ) {
      return
    }

    isSubmitting.value =
      true

    try {
      await flushAllSaves()

      const result =
        await submitQuizAttempt(
          attempt.value.id,
        )

      submissionResult.value = {
        ...result,

        attemptId:
          Number(
            result?.attemptId ??
            result?.attempt_id ??
            attempt.value?.id ??
            0,
          ) || null,

        status:
          'submitted',

        requiresManualGrading:
          Boolean(
            result?.requiresManualGrading ??
            result?.requires_manual_grading ??
            false,
          ),

        score:
          result?.score ??
          null,

        maxScore:
          result?.maxScore ??
          result?.max_score ??
          null,

        percentage:
          result?.percentage ??
          null,

        passed:
          result?.passed ??
          null,
      }

      saveResultCache(
        submissionResult.value,
      )

      resultWasRestored.value =
        false

      showSubmitDialog.value =
        false

      stopTimer()
    } finally {
      isSubmitting.value =
        false
    }
  }

const submitEvaluation =
  async () => {
    if (
      requiredUnansweredCount
        .value > 0
    ) {
      return
    }

    try {
      await performSubmit()
    } catch (error) {
      console.error(
        'Error entregando evaluación:',
        error,
      )

      saveError.value =
        error?.message ||
        'No fue posible entregar la evaluación.'
    }
  }

const reviewAttemptId =
  computed(() => {
    const id =
      Number(
        submissionResult.value
          ?.attemptId ??
        submissionResult.value
          ?.attempt_id ??
        attempt.value
          ?.id ??
        0,
      )

    return (
      Number.isFinite(id) &&
      id > 0
    )
      ? id
      : null
  })

/* =========================================================
   REGLAS DE INTENTOS / RESULTADOS
========================================================= */

const attemptsAllowed =
  computed(() => {
    const value =
      Number(
        quiz.value
          ?.attemptsAllowed,
      )

    if (
      !Number.isFinite(value) ||
      value <= 0
    ) {
      return null
    }

    return value
  })

const currentAttemptNumber =
  computed(() => {
    const value =
      Number(
        attempt.value
          ?.attemptNumber ??
        attempt.value
          ?.attempt_number ??
        submissionResult.value
          ?.attemptNumber ??
        submissionResult.value
          ?.attempt_number ??
        1,
      )

    return (
      Number.isFinite(value) &&
      value > 0
    )
      ? value
      : 1
  })

const canRetakeQuiz =
  computed(() => {
    if (
      quiz.value
        ?.assessmentType !==
      'quiz'
    ) {
      return false
    }

    if (
      attemptsAllowed.value ===
      null
    ) {
      return true
    }

    return (
      currentAttemptNumber.value <
      attemptsAllowed.value
    )
  })

const attemptRuleLabel =
  computed(() => {
    if (
      attemptsAllowed.value ===
      null
    ) {
      return (
        quiz.value
          ?.assessmentType ===
        'quiz'
          ? 'Práctica disponible'
          : 'Según configuración'
      )
    }

    return `${currentAttemptNumber.value} de ${attemptsAllowed.value}`
  })

const resultNextStepLabel =
  computed(() => {
    if (
      submissionResult.value
        ?.requiresManualGrading
    ) {
      return 'Esperar revisión'
    }

    if (
      quiz.value
        ?.assessmentType ===
        'quiz' &&
      canRetakeQuiz.value
    ) {
      return 'Revisar y practicar'
    }

    return 'Continuar aprendiendo'
  })

const startNewPracticeAttempt =
  async () => {
    if (
      !canRetakeQuiz.value
    ) {
      return
    }

    clearResultCache()

    submissionResult.value =
      null

    resultWasRestored.value =
      false

    attempt.value =
      null

    answers.value = {}

    currentQuestionIndex.value =
      0

    await loadQuiz()
  }

/* =========================================================
   HELPERS
========================================================= */

const formatScore =
  value => {
    const number =
      Number(value)

    if (
      !Number.isFinite(number)
    ) {
      return '0'
    }

    return Number.isInteger(
      number,
    )
      ? String(number)
      : number.toFixed(1)
  }

/* =========================================================
   WATCH / LIFECYCLE
========================================================= */

watch(
  () => [
    route.params.id,
    route.params.quizId,
  ],
  async () => {
    stopTimer()

    for (
      const timer of
      saveTimers.values()
    ) {
      clearTimeout(timer)
    }

    saveTimers.clear()

    currentQuestionIndex.value =
      0

    await loadQuiz()
  },
)

onMounted(
  loadQuiz,
)

onBeforeUnmount(() => {
  stopTimer()

  for (
    const timer of
    saveTimers.values()
  ) {
    clearTimeout(timer)
  }

  saveTimers.clear()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   PAGE
========================================================= */

.quiz-page {
  width: min(1440px, 100%);
  margin: 0 auto;
  padding:
    clamp(1rem, 2vw, 2rem)
    clamp(1rem, 3vw, 2.5rem)
    5rem;
}

/* =========================================================
   STATE
========================================================= */

.quiz-state,
.result-screen {
  display: grid;
  min-height: 62vh;
  gap: 1rem;
  place-items: center;
  align-content: center;
  text-align: center;
}

.quiz-state__spinner {
  width: 52px;
  height: 52px;
  border:
    3px solid
    rgba(255, 255, 255, 0.1);
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

.quiz-state__eyebrow,
.result-screen__eyebrow {
  color:
    variables.$color-primary;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.quiz-state h1,
.result-screen h1 {
  max-width: 760px;
  margin: 0;
  font-size:
    clamp(2rem, 5vw, 4rem);
  line-height: 1.05;
}

.quiz-state p,
.result-screen > p {
  max-width: 650px;
  margin: 0;
  color:
    rgba(255, 255, 255, 0.58);
  font-size: 1rem;
  line-height: 1.7;
}

.quiz-state__icon,
.result-screen__icon {
  display: grid;
  width: 72px;
  height: 72px;
  place-items: center;
  border:
    1px solid
    #ef6767;
  border-radius: 50%;
  color: #ff7b7b;
  font-size: 1.7rem;
  font-weight: 900;
}

.result-screen__icon {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
}

.result-screen__icon--pending {
  font-size: 2rem;
}

.quiz-state__actions,
.result-screen__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}

.quiz-state__actions button,
.quiz-state__actions a {
  min-height: 46px;
  padding:
    0.75rem
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
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

/* =========================================================
   TOPBAR
========================================================= */

.quiz-topbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.quiz-back {
  display: inline-flex;
  min-height: 44px;
  gap: 0.55rem;
  align-items: center;
  color:
    rgba(255, 255, 255, 0.75);
  font-size: 0.86rem;
  font-weight: 800;
  text-decoration: none;
}

.quiz-topbar__status {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color:
    rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
}

.save-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background:
    #67d98b;
}

.save-indicator--saving {
  background:
    variables.$color-primary;
  animation:
    pulse 0.8s ease infinite;
}

.save-indicator--error {
  background:
    #ef6767;
}

@keyframes pulse {
  50% {
    opacity: 0.35;
  }
}

/* =========================================================
   HERO
========================================================= */

.quiz-hero {
  display: grid;
  gap: 1.25rem;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  align-items: stretch;
  margin-bottom: 1rem;
  padding:
    clamp(1.3rem, 3vw, 2.4rem);
  border:
    1px solid
    rgba(255, 196, 0, 0.2);
  border-radius: 22px;
  background:
    radial-gradient(
      circle at top right,
      rgba(255, 196, 0, 0.08),
      transparent 38%
    ),
    variables.$color-surface;
}

.quiz-hero__eyebrow {
  display: flex;
  gap: 0.55rem;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;
}

.quiz-hero__eyebrow span {
  padding:
    0.3rem
    0.55rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.3);
  border-radius: 999px;
  color:
    variables.$color-primary;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.quiz-hero h1 {
  max-width: 920px;
  margin: 0;
  font-size:
    clamp(2rem, 4vw, 3.7rem);
  line-height: 1.05;
}

.quiz-hero p {
  max-width: 760px;
  margin:
    0.9rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.6);
  font-size: 0.98rem;
  line-height: 1.7;
}

.quiz-hero__meta {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1.2rem;
}

.quiz-hero__meta span {
  padding:
    0.35rem
    0.55rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  color:
    rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

.timer-card {
  display: grid;
  min-width: 170px;
  place-items: center;
  align-content: center;
  padding: 1rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.3);
  border-radius: 18px;
  text-align: center;
}

.timer-card small {
  color:
    variables.$color-primary;
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.timer-card strong {
  margin:
    0.4rem
    0;
  color:
    variables.$color-primary;
  font-size: 2rem;
  line-height: 1;
}

.timer-card span {
  color:
    rgba(255, 255, 255, 0.48);
  font-size: 0.75rem;
}

.timer-card--warning {
  border-color:
    #e7a93b;
}

.timer-card--critical {
  border-color:
    #ef6767;
  background:
    rgba(239, 103, 103, 0.06);
}

.timer-card--critical strong,
.timer-card--critical small {
  color:
    #ff8080;
}

.assessment-purpose {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding:
    0.75rem
    0.85rem;
  border:
    1px solid
    rgba(103, 217, 139, 0.26);
  border-radius: 11px;
  background:
    rgba(103, 217, 139, 0.045);
}

.assessment-purpose strong {
  color:
    #8ee3a7;
  font-size: 0.78rem;
}

.assessment-purpose span {
  color:
    rgba(255, 255, 255, 0.57);
  font-size: 0.79rem;
  line-height: 1.5;
}

.assessment-purpose--test {
  border-color:
    rgba(255, 196, 0, 0.28);
  background:
    rgba(255, 196, 0, 0.045);
}

.assessment-purpose--test strong {
  color:
    variables.$color-primary;
}

/* =========================================================
   PROGRESS
========================================================= */

.quiz-progress {
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 14px;
  background:
    variables.$color-surface;
}

.quiz-progress__heading {
  display: flex;
  gap: 1rem;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 0.7rem;
}

.quiz-progress__heading span,
.quiz-progress__heading strong {
  display: block;
}

.quiz-progress__heading span {
  margin-bottom: 0.2rem;
  color:
    variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.quiz-progress__heading strong {
  font-size: 0.9rem;
}

.quiz-progress__heading b {
  color:
    variables.$color-primary;
  font-size: 1.2rem;
}

.quiz-progress__bar {
  height: 7px;
  overflow: hidden;
  border-radius: 999px;
  background:
    rgba(255, 255, 255, 0.07);
}

.quiz-progress__bar span {
  display: block;
  width: 0;
  height: 100%;
  border-radius: inherit;
  background:
    variables.$color-primary;
  transition:
    width 0.25s ease;
}

/* =========================================================
   LAYOUT
========================================================= */

.quiz-layout {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    minmax(0, 1fr)
    minmax(260px, 320px);
  align-items: start;
}

/* =========================================================
   QUESTION
========================================================= */

.question-panel {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 20px;
  background:
    variables.$color-surface;
}

.question-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding:
    1rem
    1.2rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.question-header > div {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.question-number {
  color:
    variables.$color-primary;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.required-badge {
  padding:
    0.25rem
    0.45rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.28);
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.68);
  font-size: 0.7rem;
  font-weight: 800;
}

.question-header > strong {
  color:
    rgba(255, 255, 255, 0.54);
  font-size: 0.8rem;
}

.question-content {
  min-height: 420px;
  padding:
    clamp(1.2rem, 3vw, 2.2rem);
}

.question-content h2 {
  max-width: 960px;
  margin:
    0
    0
    1.6rem;
  font-size:
    clamp(1.4rem, 3vw, 2rem);
  line-height: 1.35;
}

.question-media {
  margin:
    0
    0
    1.4rem;
}

.question-media audio {
  width: 100%;
}

.question-media img {
  display: block;
  max-width: 100%;
  max-height: 480px;
  object-fit: contain;
  border-radius: 14px;
}

/* =========================================================
   OPTIONS
========================================================= */

.options-list {
  display: grid;
  gap: 0.7rem;
}

.question-hint {
  margin:
    0
    0
    0.2rem;
  color:
    rgba(255, 255, 255, 0.52);
  font-size: 0.86rem;
}

.option-card {
  display: grid;
  min-height: 64px;
  gap: 0.85rem;
  grid-template-columns:
    auto
    auto
    minmax(0, 1fr);
  align-items: center;
  padding:
    0.8rem
    1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 13px;
  background:
    rgba(255, 255, 255, 0.018);
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
}

.option-card:hover {
  border-color:
    rgba(255, 196, 0, 0.34);
  transform:
    translateY(-1px);
}

.option-card--selected {
  border-color:
    variables.$color-primary;
  background:
    rgba(255, 196, 0, 0.07);
}

.option-card input {
  width: 18px;
  height: 18px;
  accent-color:
    variables.$color-primary;
}

.option-card__marker {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 0.8rem;
  font-weight: 900;
}

.option-card strong {
  font-size: 0.98rem;
  font-weight: 700;
  line-height: 1.5;
}

/* =========================================================
   TEXT ANSWERS
========================================================= */

.text-answer {
  display: grid;
  gap: 0.55rem;
}

.text-answer label {
  color:
    variables.$color-primary;
  font-size: 0.8rem;
  font-weight: 900;
}

.text-answer input,
.text-answer textarea {
  width: 100%;
  border:
    1px solid
    variables.$color-border;
  border-radius: 12px;
  outline: none;
  background:
    rgba(255, 255, 255, 0.025);
  color:
    variables.$color-white;
  font: inherit;
  font-size: 1rem;
}

.text-answer input {
  min-height: 52px;
  padding:
    0
    0.9rem;
}

.text-answer textarea {
  min-height: 200px;
  padding: 0.9rem;
  resize: vertical;
  line-height: 1.65;
}

.text-answer input:focus,
.text-answer textarea:focus {
  border-color:
    variables.$color-primary;
}

.unsupported-question {
  padding: 1rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 12px;
  color:
    rgba(255, 255, 255, 0.55);
}

/* =========================================================
   ACTIONS
========================================================= */

.question-actions {
  display: grid;
  gap: 0.75rem;
  grid-template-columns:
    auto
    1fr
    auto;
  align-items: center;
  padding:
    1rem
    1.2rem;
  border-top:
    1px solid
    variables.$color-border;
}

.question-actions__center {
  text-align: center;
}

.question-actions__center span {
  color:
    rgba(255, 255, 255, 0.5);
  font-size: 0.76rem;
}

.button {
  display: inline-flex;
  min-height: 46px;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  padding:
    0.72rem
    1rem;
  border-radius: 10px;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.button--primary {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #080808;
}

.button--secondary {
  border:
    1px solid
    variables.$color-border;
  background:
    transparent;
  color:
    variables.$color-white;
}

/* =========================================================
   SIDEBAR
========================================================= */

.question-sidebar {
  position: sticky;
  top: 1rem;
  display: grid;
  gap: 0.8rem;
}

.navigator-card,
.summary-card,
.autosave-card {
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 16px;
  background:
    variables.$color-surface;
}

.navigator-card__eyebrow {
  display: block;
  margin-bottom: 0.8rem;
  color:
    variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.question-grid {
  display: grid;
  gap: 0.45rem;
  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );
}

.question-dot {
  aspect-ratio: 1;
  min-height: 42px;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  background:
    transparent;
  color:
    rgba(255, 255, 255, 0.55);
  font: inherit;
  font-size: 0.78rem;
  font-weight: 900;
  cursor: pointer;
}

.question-dot {
  position: relative;
}

.question-dot > span {
  position: relative;
  z-index: 1;
}

.question-dot > b {
  position: absolute;
  right: 5px;
  bottom: 4px;
  color:
    #8ee3a7;
  font-size: 0.62rem;
  line-height: 1;
}

.question-dot--pending {
  border-color:
    rgba(255, 255, 255, 0.11);
  background:
    rgba(255, 255, 255, 0.018);
  color:
    rgba(255, 255, 255, 0.5);
}

.question-dot--answered {
  border-color:
    rgba(103, 217, 139, 0.62);
  background:
    rgba(103, 217, 139, 0.12);
  color:
    #9be7b0;
  box-shadow:
    inset 0 0 0 1px
    rgba(103, 217, 139, 0.08);
}

.question-dot--answered:hover {
  border-color:
    #79df98;
  background:
    rgba(103, 217, 139, 0.18);
}

.question-dot--current,
.question-dot--current.question-dot--answered {
  border-color:
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #080808;
  box-shadow:
    0 0 0 3px
    rgba(255, 196, 0, 0.12);
}

.question-dot--current > b {
  display: none;
}

.question-dot--required:not(
  .question-dot--answered
) {
  box-shadow:
    inset 0 0 0 1px
    rgba(255, 255, 255, 0.05);
}

.navigator-legend {
  display: flex;
  gap: 0.7rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
  color:
    rgba(255, 255, 255, 0.44);
  font-size: 0.7rem;
}

.navigator-legend span {
  display: flex;
  gap: 0.35rem;
  align-items: center;
}

.legend-box {
  width: 10px;
  height: 10px;
  border:
    1px solid
    variables.$color-border;
  border-radius: 3px;
}

.legend-box--current {
  border-color:
    variables.$color-primary;
  background:
    variables.$color-primary;
}

.legend-box--answered {
  border-color:
    rgba(103, 217, 139, 0.62);
  background:
    rgba(103, 217, 139, 0.18);
}

.legend-box--pending {
  border-color:
    rgba(255, 255, 255, 0.15);
  background:
    rgba(255, 255, 255, 0.025);
}

.summary-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding:
    0.55rem
    0;
  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.05);
}

.summary-row span {
  color:
    rgba(255, 255, 255, 0.52);
  font-size: 0.8rem;
}

.summary-row strong {
  color:
    variables.$color-primary;
}

.submit-sidebar-button {
  display: flex;
  width: 100%;
  min-height: 48px;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.8rem;
  padding:
    0
    0.9rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 10px;
  background:
    variables.$color-primary;
  color: #080808;
  font: inherit;
  font-size: 0.8rem;
  font-weight: 900;
  cursor: pointer;
}

.submit-sidebar-button:disabled {
  opacity: 0.5;
  cursor: wait;
}

.autosave-card {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.autosave-card > div {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    rgba(255, 196, 0, 0.3);
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-weight: 900;
}

.autosave-card p {
  margin: 0;
  color:
    rgba(255, 255, 255, 0.48);
  font-size: 0.76rem;
  line-height: 1.55;
}

.autosave-card--error {
  border-color:
    rgba(239, 103, 103, 0.45);
  background:
    rgba(239, 103, 103, 0.055);
}

.autosave-card--error > div {
  border-color:
    rgba(239, 103, 103, 0.55);
  color:
    #ff8585;
}

/* =========================================================
   MODAL
========================================================= */

.modal-backdrop {
  position: fixed;
  z-index: 9999;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  background:
    rgba(0, 0, 0, 0.78);
  backdrop-filter:
    blur(9px);
}

.submit-dialog {
  width: min(520px, 100%);
  padding:
    clamp(1.3rem, 3vw, 2rem);
  border:
    1px solid
    rgba(255, 196, 0, 0.25);
  border-radius: 20px;
  background:
    #111;
  box-shadow:
    0 25px 80px
    rgba(0, 0, 0, 0.55);
}

.submit-dialog__icon {
  display: grid;
  width: 54px;
  height: 54px;
  place-items: center;
  margin-bottom: 1rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 1.2rem;
  font-weight: 900;
}

.submit-dialog__eyebrow {
  color:
    variables.$color-primary;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.submit-dialog h2 {
  margin:
    0.4rem
    0
    0;
  font-size:
    clamp(1.5rem, 4vw, 2rem);
}

.submit-dialog > p {
  margin:
    0.7rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.58);
  line-height: 1.6;
}

.submit-warning,
.submit-notice {
  margin-top: 1rem;
  padding: 0.9rem;
  border:
    1px solid
    #d89a42;
  border-radius: 11px;
  background:
    rgba(216, 154, 66, 0.06);
}

.submit-warning strong {
  color:
    #efb55c;
}

.submit-warning p,
.submit-notice {
  color:
    rgba(255, 255, 255, 0.58);
  font-size: 0.82rem;
  line-height: 1.55;
}

.submit-warning p {
  margin:
    0.35rem
    0
    0;
}


.submit-success {
  margin-top: 1rem;
  padding: 0.9rem;
  border:
    1px solid
    rgba(103, 217, 139, 0.38);
  border-radius: 11px;
  background:
    rgba(103, 217, 139, 0.055);
}

.submit-success strong {
  color:
    #79df98;
}

.submit-success p {
  margin:
    0.3rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.58);
  font-size: 0.82rem;
  line-height: 1.55;
}

.submit-dialog__actions {
  display: flex;
  gap: 0.7rem;
  justify-content: flex-end;
  margin-top: 1.2rem;
}

.modal-enter-active,
.modal-leave-active {
  transition:
    opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.result-guidance {
  display: grid;
  width: min(760px, 100%);
  gap: 0.7rem;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
  margin-top: 0.9rem;
}

.result-guidance > div {
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 13px;
  background:
    variables.$color-surface;
  text-align: left;
}

.result-guidance small,
.result-guidance strong {
  display: block;
}

.result-guidance small {
  margin-bottom: 0.3rem;
  color:
    rgba(255, 255, 255, 0.43);
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.result-guidance strong {
  font-size: 0.9rem;
}

.result-learning-box {
  width: min(760px, 100%);
  margin-top: 0.9rem;
  padding: 1.1rem;
  border:
    1px solid
    rgba(103, 217, 139, 0.3);
  border-radius: 15px;
  background:
    linear-gradient(
      135deg,
      rgba(103, 217, 139, 0.055),
      transparent 70%
    ),
    variables.$color-surface;
  text-align: left;
}

.result-learning-box > span {
  color:
    #8ee3a7;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.result-learning-box h2 {
  margin:
    0.35rem
    0
    0;
  font-size: 1.25rem;
}

.result-learning-box p {
  margin:
    0.45rem
    0
    0.9rem;
  color:
    rgba(255, 255, 255, 0.56);
  font-size: 0.88rem;
  line-height: 1.6;
}

.result-learning-box--locked {
  border-color:
    rgba(255, 196, 0, 0.28);
  background:
    linear-gradient(
      135deg,
      rgba(255, 196, 0, 0.05),
      transparent 70%
    ),
    variables.$color-surface;
}

.result-learning-box--locked > span {
  color:
    variables.$color-primary;
}

.result-next-step {
  width: min(900px, 100%);
  margin-top: 1rem;
  padding:
    clamp(1rem, 3vw, 1.4rem);
  border:
    1px solid
    rgba(255, 196, 0, 0.25);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(255, 196, 0, 0.075),
      transparent 35%
    ),
    variables.$color-surface;
  text-align: left;
}

.result-next-step__copy > span,
.result-learning-summary span {
  color:
    variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.result-next-step__copy h2,
.result-learning-summary h2 {
  margin:
    0.35rem
    0
    0;
  font-size:
    clamp(1.3rem, 3vw, 1.8rem);
}

.result-next-step__copy p,
.result-learning-summary p {
  max-width: 760px;
  margin:
    0.45rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.56);
  font-size: 0.88rem;
  line-height: 1.65;
}

.result-next-step__actions {
  display: grid;
  gap: 0.7rem;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
  margin-top: 1rem;
}

.result-action {
  display: grid;
  min-height: 78px;
  gap: 0.75rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding:
    0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 13px;
  color:
    variables.$color-white;
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    background 0.18s ease,
    transform 0.18s ease;
}

.result-action:hover {
  border-color:
    rgba(255, 196, 0, 0.42);
  background:
    rgba(255, 196, 0, 0.035);
  transform:
    translateY(-1px);
}

.result-action--primary {
  border-color:
    variables.$color-primary;
  background:
    rgba(255, 196, 0, 0.065);
}

.result-action__icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border:
    1px solid
    rgba(255, 196, 0, 0.3);
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-weight: 900;
}

.result-action small,
.result-action strong {
  display: block;
}

.result-action small {
  margin-bottom: 0.2rem;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.result-action strong {
  font-size: 0.85rem;
  line-height: 1.35;
}

.result-action b {
  color:
    variables.$color-primary;
  font-size: 1rem;
}

.result-learning-summary {
  display: grid;
  width: min(900px, 100%);
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(0, 1fr);
  align-items: start;
  margin-top: 0.8rem;
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 15px;
  background:
    variables.$color-surface;
  text-align: left;
}

.result-learning-summary__icon {
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
  font-size: 1rem;
  font-weight: 900;
}

.result-learning-summary--excellent {
  border-color:
    rgba(103, 217, 139, 0.34);
}

.result-learning-summary--excellent
.result-learning-summary__icon {
  border-color:
    #79df98;
  color:
    #79df98;
}

.result-learning-summary--good {
  border-color:
    rgba(255, 196, 0, 0.3);
}

.result-learning-summary--reinforce {
  border-color:
    rgba(239, 103, 103, 0.34);
}

.result-learning-summary--reinforce
.result-learning-summary__icon {
  border-color:
    #ef8585;
  color:
    #ef8585;
}

.result-screen__actions--secondary {
  margin-top: 0.75rem;
}

/* =========================================================
   RESULT
========================================================= */

.result-score {
  display: grid;
  width: min(680px, 100%);
  gap: 0.7rem;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
  margin-top: 0.8rem;
}

.result-score > div {
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 14px;
  background:
    variables.$color-surface;
}

.result-score small,
.result-score strong {
  display: block;
}

.result-score small {
  margin-bottom: 0.35rem;
  color:
    rgba(255, 255, 255, 0.48);
  font-size: 0.68rem;
  font-weight: 900;
}

.result-score strong {
  color:
    variables.$color-primary;
  font-size: 1.3rem;
}

.result-score__passed {
  color:
    #6ed58b !important;
}

.result-score__failed {
  color:
    #ef7878 !important;
}

.result-notice {
  width: min(580px, 100%);
  margin-top: 0.8rem;
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 13px;
  background:
    variables.$color-surface;
}

.result-notice p {
  margin:
    0.35rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.5);
  font-size: 0.86rem;
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

.quiz-page button,
.quiz-page a {
  min-height: 44px;
}

.quiz-page button:focus-visible,
.quiz-page a:focus-visible,
.quiz-page input:focus-visible,
.quiz-page textarea:focus-visible {
  outline:
    3px solid
    rgba(255, 196, 0, 0.62);
  outline-offset: 3px;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (
  max-width: 980px
) {
  .quiz-layout {
    grid-template-columns: 1fr;
  }

  .question-sidebar {
    position: static;
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .autosave-card {
    grid-column:
      1 / -1;
  }
}

@media (
  max-width: 720px
) {
  .quiz-page {
    padding:
      0.85rem
      0.75rem
      4rem;
  }

  .quiz-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .quiz-hero {
    grid-template-columns: 1fr;
  }

  .timer-card {
    min-width: 0;
  }

  .question-content {
    min-height: 360px;
    padding: 1rem;
  }

  .question-actions {
    grid-template-columns:
      1fr
      1fr;
  }

  .question-actions__center {
    grid-column:
      1 / -1;
    grid-row: 1;
  }

  .question-sidebar {
    grid-template-columns: 1fr;
  }

  .autosave-card {
    grid-column: auto;
  }

  .result-score,
  .result-guidance,
  .result-next-step__actions {
    grid-template-columns: 1fr;
  }

  .submit-dialog__actions {
    flex-direction: column-reverse;
  }

  .submit-dialog__actions .button {
    width: 100%;
  }
}

@media (
  max-width: 480px
) {
  .question-grid {
    grid-template-columns:
      repeat(
        4,
        minmax(0, 1fr)
      );
  }

  .option-card {
    gap: 0.6rem;
    grid-template-columns:
      auto
      minmax(0, 1fr);
  }

  .option-card input {
    display: none;
  }

  .option-card__marker {
    width: 34px;
    height: 34px;
  }

  .question-actions {
    grid-template-columns: 1fr;
  }

  .question-actions__center {
    grid-column: auto;
  }

  .question-actions .button {
    width: 100%;
  }
}


/* =========================================================
   V7.3 · QUIZ VIEW · PREMIUM LIGHT LMS
   Experiencia de evaluación del estudiante
========================================================= */

.quiz-page,
.quiz-view,
.quiz-shell {
  --quiz-ink: #152033;
  --quiz-ink-soft: #344359;
  --quiz-muted: #6f7c8f;
  --quiz-muted-2: #8b98aa;
  --quiz-line: #dbe3ec;
  --quiz-line-strong: #cbd6e2;
  --quiz-surface: #ffffff;
  --quiz-surface-soft: #f7f9fc;
  --quiz-wine: #9f1945;
  --quiz-wine-dark: #7f1237;
  --quiz-gold: #d9a91d;
  --quiz-gold-dark: #987000;
  --quiz-gold-soft: #fff8e7;
  --quiz-green: #2d8a63;
  --quiz-green-soft: #edf8f3;
  --quiz-blue: #3f6fa8;
  --quiz-blue-soft: #eef5fc;
  --quiz-danger: #be4856;
  --quiz-danger-soft: #fff3f5;
}

/* Fallback para la raíz real del componente */
:deep(.quiz-page),
:deep(.quiz-view),
:deep(.quiz-shell) {
  color: var(--quiz-ink);
}

/* =========================================================
   TOPBAR
========================================================= */

.quiz-topbar {
  margin-bottom: 18px;
  padding: 0 2px;
}

.quiz-back {
  color: #718096 !important;
  font-weight: 800;
}

.quiz-back:hover {
  color: var(--quiz-wine) !important;
}

.quiz-topbar__status {
  color: #657386 !important;
  font-size: .64rem;
  font-weight: 750;
}

.save-indicator {
  background: var(--quiz-green) !important;
  box-shadow: 0 0 0 4px rgba(45,138,99,.08);
}

.save-indicator--saving {
  background: var(--quiz-gold) !important;
}

.save-indicator--error {
  background: var(--quiz-danger) !important;
}

/* =========================================================
   HERO
========================================================= */

.quiz-hero {
  position: relative;
  display: flex;
  gap: 28px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding: 28px 30px;
  overflow: hidden;
  border: 1px solid var(--quiz-line) !important;
  border-radius: 22px;
  background:
    radial-gradient(circle at 92% 8%, rgba(217,169,29,.12), transparent 30%),
    linear-gradient(135deg, #fff 0%, #fbfcfe 68%, #fffaf0 100%) !important;
  box-shadow: 0 14px 36px rgba(31,48,73,.055);
}

.quiz-hero::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 130px;
  height: 3px;
  content: '';
  background: linear-gradient(90deg, var(--quiz-wine), var(--quiz-gold));
}

.quiz-hero__eyebrow {
  gap: 7px;
  margin-bottom: 12px;
}

.quiz-hero__eyebrow span {
  padding: 6px 9px;
  border: 1px solid #e1d08f !important;
  border-radius: 999px;
  color: var(--quiz-gold-dark) !important;
  background: var(--quiz-gold-soft) !important;
  font-size: .53rem;
  font-weight: 900;
  letter-spacing: .07em;
}

.quiz-hero h1 {
  color: var(--quiz-ink) !important;
  font-size: clamp(2.45rem, 5.2vw, 4.5rem);
  line-height: .98;
  letter-spacing: -.045em;
}

.quiz-hero__main > p {
  max-width: 760px;
  color: var(--quiz-muted) !important;
  font-size: .8rem;
  line-height: 1.65;
}

.assessment-purpose {
  margin-top: 16px;
  padding: 13px 14px;
  border: 1px solid #cfe3d8 !important;
  border-radius: 12px;
  background: var(--quiz-green-soft) !important;
}

.assessment-purpose strong {
  color: var(--quiz-green) !important;
}

.assessment-purpose span {
  color: #577565 !important;
}

.assessment-purpose--test {
  border-color: #e8d69d !important;
  background: var(--quiz-gold-soft) !important;
}

.assessment-purpose--test strong {
  color: var(--quiz-gold-dark) !important;
}

.assessment-purpose--test span {
  color: #7d7048 !important;
}

.quiz-hero__meta {
  gap: 7px;
  margin-top: 14px;
}

.quiz-hero__meta span {
  padding: 6px 9px;
  border: 1px solid #dfe5ec !important;
  border-radius: 999px;
  color: #68768a !important;
  background: #fff !important;
  font-size: .55rem;
}

/* =========================================================
   TIMER
========================================================= */

.timer-card {
  min-width: 175px;
  padding: 16px;
  border: 1px solid #ead79c !important;
  border-radius: 14px;
  background: var(--quiz-gold-soft) !important;
  box-shadow: none !important;
}

.timer-card small {
  color: #8b7c4d !important;
}

.timer-card strong {
  color: var(--quiz-gold-dark) !important;
}

.timer-card span {
  color: #7c704e !important;
}

.timer-card--warning {
  border-color: #efd79e !important;
  background: #fff7e8 !important;
}

.timer-card--critical {
  border-color: #efcbd1 !important;
  background: var(--quiz-danger-soft) !important;
}

.timer-card--critical strong {
  color: var(--quiz-danger) !important;
}

/* =========================================================
   PROGRESO
========================================================= */

.quiz-progress {
  margin-bottom: 16px;
  padding: 16px 18px;
  border: 1px solid var(--quiz-line) !important;
  border-radius: 15px;
  background: #fff !important;
  box-shadow: 0 7px 20px rgba(31,48,73,.03);
}

.quiz-progress__heading > div > span {
  color: var(--quiz-gold-dark) !important;
  font-size: .52rem;
  font-weight: 900;
  letter-spacing: .11em;
}

.quiz-progress__heading strong {
  color: var(--quiz-ink-soft) !important;
}

.quiz-progress__heading b {
  color: var(--quiz-gold-dark) !important;
  font-size: 1rem;
}

.quiz-progress__bar {
  height: 7px;
  margin-top: 11px;
  border-radius: 999px;
  background: #e8edf2 !important;
}

.quiz-progress__bar span {
  background: linear-gradient(90deg, #b98a00, #d9a91d) !important;
}

/* =========================================================
   LAYOUT
========================================================= */

.quiz-layout {
  gap: 14px;
}

.quiz-main {
  min-width: 0;
}

.quiz-sidebar {
  gap: 12px;
}

/* =========================================================
   TARJETA DE PREGUNTA
========================================================= */

.question-card {
  overflow: hidden;
  border: 1px solid var(--quiz-line) !important;
  border-radius: 18px;
  background: #fff !important;
  box-shadow: 0 9px 26px rgba(31,48,73,.04);
}

.question-card__top {
  padding: 16px 20px;
  border-bottom: 1px solid #e7ecf1 !important;
  background: #f8fafc !important;
}

.question-card__top > div:first-child > span:first-child,
.question-card__eyebrow {
  color: var(--quiz-gold-dark) !important;
  font-size: .55rem;
  font-weight: 900;
  letter-spacing: .1em;
}

.question-required {
  border-color: #e4d18d !important;
  color: #7b5d00 !important;
  background: var(--quiz-gold-soft) !important;
}

.question-points {
  color: #68768a !important;
}

.question-card__body {
  padding: 24px 22px;
}

.question-card__body h2 {
  max-width: 900px;
  margin-bottom: 12px;
  color: var(--quiz-ink) !important;
  font-size: clamp(1.45rem,3vw,2.2rem);
  line-height: 1.2;
  letter-spacing: -.025em;
}

.question-help {
  color: var(--quiz-muted) !important;
  font-size: .68rem;
}

/* =========================================================
   OPCIONES
========================================================= */

.answer-options {
  gap: 10px;
  margin-top: 18px;
}

.answer-option {
  min-height: 70px;
  padding: 14px 16px;
  border: 1px solid #dfe5ec !important;
  border-radius: 13px;
  color: var(--quiz-ink) !important;
  background: #fbfcfe !important;
  transition:
    border-color .18s ease,
    background .18s ease,
    box-shadow .18s ease,
    transform .18s ease;
}

.answer-option:hover {
  border-color: #c9d5e0 !important;
  background: #fff !important;
  box-shadow: 0 6px 18px rgba(31,48,73,.04);
  transform: translateY(-1px);
}

.answer-option--selected {
  border-color: #d8b02d !important;
  background: #fffaf0 !important;
  box-shadow: inset 0 0 0 1px rgba(216,176,45,.12);
}

.answer-option__letter {
  border: 1px solid #d6dee7 !important;
  color: #68768a !important;
  background: #fff !important;
}

.answer-option--selected .answer-option__letter {
  border-color: #d7b02f !important;
  color: #6d5200 !important;
  background: #f3d15d !important;
}

.answer-option__text,
.answer-option strong,
.answer-option span {
  color: var(--quiz-ink-soft) !important;
}

.answer-option input[type="checkbox"],
.answer-option input[type="radio"] {
  accent-color: var(--quiz-wine);
}

/* =========================================================
   RESPUESTAS ABIERTAS
========================================================= */

.text-answer,
textarea,
input[type="text"].text-answer {
  border: 1px solid var(--quiz-line-strong) !important;
  color: var(--quiz-ink) !important;
  background: #fbfcfe !important;
}

.text-answer:focus,
textarea:focus {
  border-color: #aebfd0 !important;
  background: #fff !important;
  box-shadow: 0 0 0 4px rgba(63,111,168,.08);
}

/* =========================================================
   NAVEGACIÓN DE PREGUNTA
========================================================= */

.question-card__footer {
  padding: 14px 20px;
  border-top: 1px solid #e7ecf1 !important;
  background: #f8fafc !important;
}

.question-card__footer > span {
  color: var(--quiz-muted) !important;
}

.question-nav-button {
  min-height: 44px;
  border: 1px solid var(--quiz-line-strong) !important;
  border-radius: 10px;
  color: var(--quiz-ink-soft) !important;
  background: #fff !important;
}

.question-nav-button--primary {
  border-color: var(--quiz-wine) !important;
  color: #fff !important;
  background: var(--quiz-wine) !important;
}

.question-nav-button--primary:hover:not(:disabled) {
  background: var(--quiz-wine-dark) !important;
}

.question-nav-button:disabled {
  opacity: .5;
  cursor: not-allowed;
}

/* =========================================================
   SIDEBAR
========================================================= */

.navigator-card,
.summary-card,
.autosave-card {
  border: 1px solid var(--quiz-line) !important;
  border-radius: 16px;
  background: #fff !important;
  box-shadow: 0 8px 22px rgba(31,48,73,.035);
}

.navigator-card,
.summary-card {
  padding: 17px;
}

.navigator-card__eyebrow {
  color: var(--quiz-gold-dark) !important;
  font-size: .53rem;
  font-weight: 900;
  letter-spacing: .1em;
}

.question-dots {
  gap: 7px;
  margin-top: 12px;
}

.question-dot {
  min-width: 46px;
  min-height: 46px;
  border: 1px solid #dce3ea !important;
  border-radius: 10px;
  color: #6f7c8f !important;
  background: #f8fafc !important;
}

.question-dot--current {
  border-color: #d5aa22 !important;
  color: #624900 !important;
  background: #f0c943 !important;
}

.question-dot--answered {
  border-color: #bfe0cd !important;
  color: var(--quiz-green) !important;
  background: var(--quiz-green-soft) !important;
}

.question-dot--required:not(.question-dot--current):not(.question-dot--answered) {
  box-shadow: inset 0 0 0 1px rgba(217,169,29,.1);
}

.navigator-legend {
  gap: 10px;
  margin-top: 12px;
}

.navigator-legend span {
  color: var(--quiz-muted) !important;
  font-size: .55rem;
}

.legend-box--current {
  background: var(--quiz-gold) !important;
}

.legend-box--answered {
  border-color: var(--quiz-green) !important;
  background: var(--quiz-green-soft) !important;
}

.legend-box--pending {
  border-color: #cfd8e1 !important;
  background: #f8fafc !important;
}

/* =========================================================
   RESUMEN SIDEBAR
========================================================= */

.summary-row {
  padding: 11px 0;
  border-bottom: 1px solid #e9edf2 !important;
}

.summary-row span {
  color: var(--quiz-muted) !important;
}

.summary-row strong {
  color: var(--quiz-gold-dark) !important;
}

.submit-sidebar-button {
  width: 100%;
  min-height: 46px;
  margin-top: 14px;
  border: 1px solid var(--quiz-wine) !important;
  border-radius: 10px;
  color: #fff !important;
  background: var(--quiz-wine) !important;
  box-shadow: 0 8px 20px rgba(159,25,69,.14);
}

.submit-sidebar-button:hover:not(:disabled) {
  background: var(--quiz-wine-dark) !important;
}

.submit-sidebar-button:disabled {
  border-color: #d8dee5 !important;
  color: #9aa4b0 !important;
  background: #edf1f5 !important;
  box-shadow: none;
}

/* =========================================================
   AUTOGUARDADO
========================================================= */

.autosave-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 10px;
  align-items: center;
  padding: 14px;
  border-color: #cfe3d8 !important;
  background: var(--quiz-green-soft) !important;
}

.autosave-card > div {
  border-color: #b9ddc8 !important;
  color: var(--quiz-green) !important;
  background: #fff !important;
}

.autosave-card p {
  color: #557565 !important;
}

.autosave-card--error {
  border-color: #efcbd1 !important;
  background: var(--quiz-danger-soft) !important;
}

.autosave-card--error > div {
  color: var(--quiz-danger) !important;
}

/* =========================================================
   MODAL ENTREGA
========================================================= */

.modal-backdrop {
  background: rgba(15,23,42,.55) !important;
  backdrop-filter: blur(12px);
}

.submit-dialog {
  border: 1px solid var(--quiz-line) !important;
  border-radius: 20px;
  color: var(--quiz-ink) !important;
  background: #fff !important;
  box-shadow: 0 30px 80px rgba(15,23,42,.2);
}

.submit-dialog__icon {
  color: #fff !important;
  background: var(--quiz-green) !important;
}

.submit-dialog__eyebrow {
  color: var(--quiz-gold-dark) !important;
}

.submit-dialog h2 {
  color: var(--quiz-ink) !important;
}

.submit-dialog > p {
  color: var(--quiz-muted) !important;
}

.submit-warning {
  border-color: #ead79c !important;
  background: var(--quiz-gold-soft) !important;
}

.submit-warning strong {
  color: var(--quiz-gold-dark) !important;
}

.submit-warning p {
  color: #7c704d !important;
}

.submit-notice {
  border-color: #d7e2ed !important;
  color: #4f6f95 !important;
  background: var(--quiz-blue-soft) !important;
}

.submit-success {
  border-color: #c7e0d2 !important;
  color: var(--quiz-green) !important;
  background: var(--quiz-green-soft) !important;
}

.submit-dialog__actions .button--secondary {
  border-color: var(--quiz-line-strong) !important;
  color: var(--quiz-ink-soft) !important;
  background: #fff !important;
}

.submit-dialog__actions .button--primary {
  border-color: var(--quiz-wine) !important;
  color: #fff !important;
  background: var(--quiz-wine) !important;
}

/* =========================================================
   RESULTADOS
========================================================= */

.result-screen {
  border: 1px solid var(--quiz-line) !important;
  border-radius: 22px;
  background:
    radial-gradient(circle at 90% 8%, rgba(217,169,29,.1), transparent 28%),
    #fff !important;
  box-shadow: 0 14px 36px rgba(31,48,73,.055);
}

.result-screen__eyebrow {
  color: var(--quiz-gold-dark) !important;
}

.result-screen h1,
.result-screen h2 {
  color: var(--quiz-ink) !important;
}

.result-screen > p,
.result-learning-box p,
.result-notice p {
  color: var(--quiz-muted) !important;
}

.result-score > div,
.result-guidance > div,
.result-learning-box,
.result-notice {
  border-color: #e3e8ee !important;
  background: #f8fafc !important;
}

.result-score small,
.result-guidance small,
.result-learning-box > span {
  color: var(--quiz-muted-2) !important;
}

.result-score strong,
.result-guidance strong {
  color: var(--quiz-ink) !important;
}

.result-score__passed {
  color: var(--quiz-green) !important;
}

.result-score__failed {
  color: var(--quiz-danger) !important;
}

.result-learning-box {
  border-color: #d9e5de !important;
  background: var(--quiz-green-soft) !important;
}

.result-learning-box--locked {
  border-color: #e6d495 !important;
  background: var(--quiz-gold-soft) !important;
}

.result-screen__actions .button--primary {
  border-color: var(--quiz-wine) !important;
  color: #fff !important;
  background: var(--quiz-wine) !important;
}

.result-screen__actions .button--secondary {
  border-color: var(--quiz-line-strong) !important;
  color: var(--quiz-ink-soft) !important;
  background: #fff !important;
}

/* =========================================================
   LOADING / ERROR
========================================================= */

.quiz-state {
  border: 1px solid var(--quiz-line) !important;
  border-radius: 18px;
  background: #fff !important;
}

.quiz-state h1,
.quiz-state h2,
.quiz-state strong {
  color: var(--quiz-ink) !important;
}

.quiz-state p {
  color: var(--quiz-muted) !important;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1000px) {
  .quiz-layout {
    grid-template-columns: 1fr !important;
  }

  .quiz-sidebar {
    position: static !important;
  }

  .navigator-card,
  .summary-card,
  .autosave-card {
    position: static !important;
  }
}

@media (max-width: 760px) {
  .quiz-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 22px;
  }

  .timer-card {
    width: 100%;
    min-width: 0;
  }

  .question-card__body {
    padding: 20px 17px;
  }

  .question-card__top,
  .question-card__footer {
    padding-inline: 17px;
  }

  .question-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .question-nav-button {
    width: 100%;
  }

  .question-dots {
    grid-template-columns: repeat(5, minmax(0,1fr));
  }
}

@media (max-width: 520px) {
  .quiz-topbar {
    align-items: flex-start;
    flex-direction: column;
    gap: 10px;
  }

  .question-dots {
    grid-template-columns: repeat(4, minmax(0,1fr));
  }

  .answer-option {
    align-items: flex-start;
  }
}



/* =========================================================
   V7.4 · QUIZ QUESTION PANEL FIX
   Corrige el bloque oscuro restante usando las clases REALES
   del componente: question-panel, question-header,
   question-content, option-card y question-actions.
========================================================= */

.question-panel {
  overflow: hidden;
  border: 1px solid #dbe3ec !important;
  border-radius: 18px !important;
  background: #ffffff !important;
  box-shadow: 0 10px 28px rgba(31, 48, 73, 0.05) !important;
}

.question-header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px !important;
  border-bottom: 1px solid #e7ecf1 !important;
  background:
    linear-gradient(135deg, #ffffff 0%, #f8fafc 100%) !important;
}

.question-number {
  color: #987000 !important;
  font-size: 0.58rem !important;
  font-weight: 900 !important;
  letter-spacing: 0.11em !important;
}

.required-badge {
  padding: 5px 8px !important;
  border: 1px solid #e4d18d !important;
  border-radius: 999px !important;
  color: #795b00 !important;
  background: #fff8e7 !important;
  font-size: 0.54rem !important;
  font-weight: 900 !important;
}

.question-header > strong {
  color: #667589 !important;
  font-size: 0.67rem !important;
  font-weight: 800 !important;
}

.question-content {
  min-height: 420px;
  padding: clamp(22px, 3vw, 34px) !important;
  background:
    radial-gradient(circle at 96% 5%, rgba(217,169,29,.045), transparent 28%),
    #ffffff !important;
}

.question-content h2 {
  max-width: 880px !important;
  margin: 0 0 18px !important;
  color: #152033 !important;
  font-size: clamp(1.55rem, 3vw, 2.35rem) !important;
  line-height: 1.22 !important;
  letter-spacing: -0.03em !important;
}

.question-hint {
  margin: 0 0 10px !important;
  color: #6f7c8f !important;
  font-size: 0.72rem !important;
  line-height: 1.55 !important;
}

.options-list {
  display: grid;
  gap: 10px !important;
}

.option-card {
  display: grid;
  min-height: 70px !important;
  gap: 12px !important;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: center;
  padding: 14px 16px !important;
  border: 1px solid #dfe5ec !important;
  border-radius: 13px !important;
  background: #fbfcfe !important;
  cursor: pointer;
  box-shadow: none !important;
  transition:
    border-color .18s ease,
    background .18s ease,
    box-shadow .18s ease,
    transform .18s ease;
}

.option-card:hover {
  border-color: #c8d4df !important;
  background: #ffffff !important;
  box-shadow: 0 7px 20px rgba(31,48,73,.045) !important;
  transform: translateY(-1px) !important;
}

.option-card--selected {
  border-color: #d7b02f !important;
  background: #fffaf0 !important;
  box-shadow: inset 0 0 0 1px rgba(215,176,47,.12) !important;
}

.option-card input {
  width: 18px !important;
  height: 18px !important;
  accent-color: #9f1945 !important;
}

.option-card__marker {
  display: grid;
  width: 36px !important;
  height: 36px !important;
  place-items: center;
  border: 1px solid #d6dee7 !important;
  border-radius: 50% !important;
  color: #68768a !important;
  background: #ffffff !important;
  font-size: .76rem !important;
  font-weight: 900 !important;
}

.option-card--selected .option-card__marker {
  border-color: #d7b02f !important;
  color: #684d00 !important;
  background: #f3d15d !important;
}

.option-card strong {
  color: #26364f !important;
  font-size: .82rem !important;
  font-weight: 800 !important;
  line-height: 1.45 !important;
}

.text-answer label {
  color: #987000 !important;
}

.text-answer input,
.text-answer textarea {
  border: 1px solid #cbd6e2 !important;
  color: #152033 !important;
  background: #fbfcfe !important;
}

.text-answer input:focus,
.text-answer textarea:focus {
  border-color: #aec0d3 !important;
  background: #fff !important;
  box-shadow: 0 0 0 4px rgba(63,111,168,.08) !important;
}

.unsupported-question {
  border-color: #d6dfe8 !important;
  color: #6f7c8f !important;
  background: #f8fafc !important;
}

/* Footer de navegación */
.question-actions {
  display: grid;
  gap: 12px;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 14px 20px !important;
  border-top: 1px solid #e7ecf1 !important;
  background: #f8fafc !important;
}

.question-actions__center span {
  color: #6f7c8f !important;
  font-size: .64rem !important;
}

.question-actions .button {
  min-height: 44px !important;
  border-radius: 10px !important;
  font-size: .68rem !important;
  font-weight: 900 !important;
}

.question-actions .button--secondary {
  border: 1px solid #cbd6e2 !important;
  color: #344359 !important;
  background: #ffffff !important;
}

.question-actions .button--primary {
  border: 1px solid #9f1945 !important;
  color: #ffffff !important;
  background: #9f1945 !important;
  box-shadow: 0 8px 18px rgba(159,25,69,.12) !important;
}

.question-actions .button--primary:hover:not(:disabled) {
  background: #7f1237 !important;
}

/* Sidebar real */
.question-sidebar {
  position: sticky;
  top: 1rem;
  display: grid;
  gap: 12px;
}

.question-sidebar .navigator-card,
.question-sidebar .summary-card {
  border: 1px solid #dbe3ec !important;
  background: #ffffff !important;
}

.question-grid {
  display: grid;
  gap: 8px !important;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.question-dot {
  min-height: 48px !important;
  border: 1px solid #d8e0e8 !important;
  color: #68768a !important;
  background: #f8fafc !important;
  box-shadow: none !important;
}

.question-dot--current {
  border-color: #d6aa1d !important;
  color: #5e4600 !important;
  background: #f2cc42 !important;
}

.question-dot--answered {
  border-color: #bfe0cd !important;
  color: #2d8a63 !important;
  background: #edf8f3 !important;
}

.question-sidebar .summary-row {
  border-bottom-color: #e8edf2 !important;
}

.question-sidebar .summary-row span {
  color: #6f7c8f !important;
}

.question-sidebar .summary-row strong {
  color: #987000 !important;
}

.question-sidebar .submit-sidebar-button {
  border-color: #9f1945 !important;
  color: #fff !important;
  background: #9f1945 !important;
}

.question-sidebar .submit-sidebar-button:hover:not(:disabled) {
  background: #7f1237 !important;
}

@media (max-width: 760px) {
  .question-content {
    min-height: auto !important;
    padding: 20px 17px !important;
  }

  .question-actions {
    grid-template-columns: 1fr !important;
  }

  .question-actions__center {
    order: -1;
    text-align: left;
  }

  .question-actions .button {
    width: 100%;
  }
}

</style>
