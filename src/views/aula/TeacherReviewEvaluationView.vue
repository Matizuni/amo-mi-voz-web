<template>
  <main class="teacher-review">
    <RouterLink
      :to="attemptsRoute"
      class="teacher-review__back"
    >
      ← Volver a intentos
    </RouterLink>

    <section
      v-if="isLoading"
      class="teacher-review__state"
    >
      <span class="teacher-review__spinner"></span>
      <p>Preparando la corrección...</p>
    </section>

    <section
      v-else-if="loadError"
      class="teacher-review__state teacher-review__state--error"
    >
      <strong>
        No pudimos abrir esta evaluación
      </strong>

      <p>{{ loadError }}</p>

      <button
        type="button"
        @click="loadReview"
      >
        Reintentar
      </button>
    </section>

    <template v-else-if="attempt">
      <header class="teacher-review__hero">
        <div>
          <span class="teacher-review__eyebrow">
            CORRECCIÓN · PROFESOR
          </span>

          <h1>
            {{ attempt.studentName }}
          </h1>

          <p>
            {{ attempt.quizTitle }}
            ·
            Intento {{ attempt.attemptNumber }}
          </p>

          <div class="teacher-review__chips">
            <span>
              {{ attempt.studentVoice }}
            </span>

            <span>
              {{ attempt.lessonTitle }}
            </span>

            <span>
              Entregado
              {{ formatDate(attempt.submittedAt) }}
            </span>
          </div>
        </div>

        <aside
          class="teacher-review__result"
          :class="{
            'teacher-review__result--done':
              attempt.status ===
              'graded'
          }"
        >
          <small>
            {{
              attempt.status ===
              'graded'
                ? 'RESULTADO FINAL'
                : 'ESTADO'
            }}
          </small>

          <strong>
            {{
              attempt.status ===
              'graded'
                ? percentageLabel
                : `${pendingManualCount} pendientes`
            }}
          </strong>

          <span>
            {{
              attempt.status ===
              'graded'
                ? passLabel
                : 'En revisión'
            }}
          </span>
        </aside>
      </header>

      <section class="teacher-review__summary">
        <article>
          <span>Automáticas</span>
          <strong>{{ autoQuestions.length }}</strong>
          <small>corregidas por el sistema</small>
        </article>

        <article>
          <span>Manuales</span>
          <strong>{{ manualQuestions.length }}</strong>
          <small>requieren criterio docente</small>
        </article>

        <article>
          <span>Pendientes</span>
          <strong>{{ pendingManualCount }}</strong>
          <small>faltan por puntuar</small>
        </article>

        <article>
          <span>Puntaje actual</span>
          <strong>{{ currentScoreLabel }}</strong>
          <small>sobre {{ maxScoreLabel }} puntos</small>
        </article>
      </section>

      <section class="teacher-review__notice">
        <div>
          <span>✓</span>
        </div>

        <div>
          <strong>
            Corrección segura
          </strong>

          <p>
            Las preguntas automáticas se muestran solo como referencia.
            Las preguntas manuales permiten asignar puntaje y retroalimentación.
          </p>
        </div>
      </section>

      <section class="teacher-review__questions">
        <article
          v-for="question in questions"
          :key="question.id"
          class="review-question"
          :class="{
            'review-question--manual':
              !question.autoGradable,
            'review-question--pending':
              !question.autoGradable &&
              question.scoreAwarded ===
                null
          }"
        >
          <header class="review-question__header">
            <div>
              <span>
                PREGUNTA
                {{
                  String(
                    question.position,
                  ).padStart(
                    2,
                    '0',
                  )
                }}
              </span>

              <b
                v-if="question.autoGradable"
                class="review-question__mode review-question__mode--auto"
              >
                Automática
              </b>

              <b
                v-else
                class="review-question__mode review-question__mode--manual"
              >
                Revisión manual
              </b>
            </div>

            <strong>
              {{ formatScore(question.points) }}
              {{
                Number(question.points) ===
                  1
                  ? 'punto'
                  : 'puntos'
              }}
            </strong>
          </header>

          <div class="review-question__body">
            <h2>
              {{ question.prompt }}
            </h2>

            <div
              v-if="question.options.length"
              class="review-question__options"
            >
              <div
                v-for="option in question.options"
                :key="option.id"
                class="review-option"
                :class="{
                  'review-option--selected':
                    isSelected(
                      question,
                      option.id,
                    ),
                  'review-option--correct':
                    option.isCorrect,
                  'review-option--wrong':
                    isSelected(
                      question,
                      option.id,
                    ) &&
                    !option.isCorrect
                }"
              >
                <span>
                  {{
                    optionLetter(
                      question.options,
                      option.id,
                    )
                  }}
                </span>

                <strong>
                  {{ option.text }}
                </strong>

                <small
                  v-if="option.isCorrect"
                >
                  Respuesta correcta
                </small>

                <small
                  v-if="
                    isSelected(
                      question,
                      option.id,
                    )
                  "
                >
                  Elegida por el alumno
                </small>
              </div>
            </div>

            <section
              v-if="question.textAnswer"
              class="review-question__answer"
            >
              <span>
                RESPUESTA DEL ALUMNO
              </span>

              <p>
                {{ question.textAnswer }}
              </p>
            </section>

            <section
              v-else-if="
                !question.options.length
              "
              class="review-question__answer review-question__answer--empty"
            >
              <span>
                RESPUESTA DEL ALUMNO
              </span>

              <p>
                No se registró una respuesta textual.
              </p>
            </section>

            <section
              v-if="
                question.autoGradable
              "
              class="review-question__automatic-result"
            >
              <div>
                <span>
                  RESULTADO AUTOMÁTICO
                </span>

                <strong
                  :class="{
                    'is-correct':
                      question.isCorrect ===
                      true,
                    'is-incorrect':
                      question.isCorrect ===
                      false
                  }"
                >
                  {{
                    question.isCorrect ===
                      true
                      ? 'Correcta'
                      : question.isCorrect ===
                          false
                        ? 'Incorrecta'
                        : 'Sin resultado'
                  }}
                </strong>
              </div>

              <div>
                <span>
                  PUNTAJE
                </span>

                <strong>
                  {{ formatScore(question.scoreAwarded) }}
                  /
                  {{ formatScore(question.points) }}
                </strong>
              </div>
            </section>

            <section
              v-else
              class="review-question__teacher"
            >
              <div class="review-question__teacher-heading">
                <div>
                  <span>
                    CORRECCIÓN DOCENTE
                  </span>

                  <strong>
                    Asigna el puntaje de esta respuesta
                  </strong>
                </div>

                <span
                  v-if="
                    savedQuestionIds.has(
                      question.id,
                    )
                  "
                  class="review-question__saved"
                >
                  ✓ Guardado
                </span>
              </div>

              <div class="review-question__teacher-grid">
                <label>
                  <span>
                    Puntaje
                  </span>

                  <div class="score-input">
                    <input
                      v-model.number="
                        question.scoreAwarded
                      "
                      type="number"
                      min="0"
                      :max="question.points"
                      step="0.1"
                      :disabled="
                        isQuestionSaving(
                          question.id,
                        )
                      "
                    >

                    <b>
                      / {{ formatScore(question.points) }}
                    </b>
                  </div>
                </label>

                <label>
                  <span>
                    Retroalimentación
                  </span>

                  <textarea
                    v-model="
                      question.teacherFeedback
                    "
                    rows="4"
                    maxlength="1600"
                    placeholder="Explica brevemente qué estuvo bien y qué debería reforzar..."
                    :disabled="
                      isQuestionSaving(
                        question.id,
                      )
                    "
                  ></textarea>
                </label>
              </div>

              <div class="review-question__teacher-actions">
                <p
                  v-if="
                    questionErrors[
                      question.id
                    ]
                  "
                >
                  {{
                    questionErrors[
                      question.id
                    ]
                  }}
                </p>

                <button
                  type="button"
                  :disabled="
                    isQuestionSaving(
                      question.id,
                    )
                  "
                  @click="
                    saveQuestion(
                      question,
                    )
                  "
                >
                  {{
                    isQuestionSaving(
                      question.id,
                    )
                      ? 'Guardando...'
                      : 'Guardar corrección'
                  }}
                </button>
              </div>
            </section>

            <section
              v-if="
                question.explanation
              "
              class="review-question__explanation"
            >
              <span>
                EXPLICACIÓN DEL CONTENIDO
              </span>

              <p>
                {{ question.explanation }}
              </p>
            </section>
          </div>
        </article>
      </section>

      <section class="teacher-review__footer">
        <div>
          <span class="teacher-review__eyebrow">
            ESTADO DE LA REVISIÓN
          </span>

          <strong>
            {{
              pendingManualCount
                ? `Faltan ${pendingManualCount} pregunta(s) manual(es) por puntuar`
                : 'La evaluación está lista para finalizar'
            }}
          </strong>

          <p>
            Al finalizar, el puntaje total, porcentaje y estado quedarán
            visibles para el estudiante según la configuración de la evaluación.
          </p>

          <p
            v-if="finalizeError"
            class="teacher-review__footer-error"
          >
            {{ finalizeError }}
          </p>

          <p
            v-if="successMessage"
            class="teacher-review__footer-success"
          >
            {{ successMessage }}
          </p>
        </div>

        <div class="teacher-review__footer-actions">
          <RouterLink
            :to="attemptsRoute"
          >
            Volver a intentos
          </RouterLink>

          <button
            type="button"
            :disabled="
              isFinalizing ||
              isSavingAnyQuestion ||
              pendingManualCount > 0
            "
            @click="finalizeReview"
          >
            {{
              isFinalizing
                ? 'Finalizando...'
                : attempt.status ===
                    'graded'
                  ? 'Recalcular y guardar'
                  : 'Finalizar corrección'
            }}
            →
          </button>
        </div>
      </section>
    </template>
  </main>
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
  fetchTeacherEvaluationReview,
  finalizeTeacherEvaluationReview,
  saveTeacherQuestionReview,
} from '@/services/teacherEvaluationService'

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

const isFinalizing =
  ref(false)

const finalizeError =
  ref('')

const successMessage =
  ref('')

const savingQuestionIds =
  ref(
    new Set(),
  )

const savedQuestionIds =
  ref(
    new Set(),
  )

const questionErrors =
  ref({})

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

const attemptId =
  computed(() =>
    Number(
      route.params.attemptId,
    ),
  )

const attemptsRoute =
  computed(() =>
    `/aula/clase/${lessonId.value}/evaluacion/${quizId.value}/intentos`,
  )

const autoQuestions =
  computed(() =>
    questions.value.filter(
      question =>
        question.autoGradable,
    ),
  )

const manualQuestions =
  computed(() =>
    questions.value.filter(
      question =>
        !question.autoGradable,
    ),
  )

const pendingManualCount =
  computed(() =>
    manualQuestions.value.filter(
      question =>
        question.scoreAwarded ===
          null ||
        question.scoreAwarded ===
          undefined ||
        question.scoreAwarded ===
          '',
    ).length,
  )

const isSavingAnyQuestion =
  computed(() =>
    savingQuestionIds.value
      .size > 0,
  )

const currentScore =
  computed(() =>
    questions.value.reduce(
      (
        total,
        question,
      ) => {
        const score =
          Number(
            question.scoreAwarded,
          )

        return (
          total +
          (
            Number.isFinite(
              score,
            )
              ? score
              : 0
          )
        )
      },
      0,
    ),
  )

const calculatedMaxScore =
  computed(() =>
    questions.value.reduce(
      (
        total,
        question,
      ) =>
        total +
        Number(
          question.points ||
          0,
        ),
      0,
    ),
  )

const currentScoreLabel =
  computed(() =>
    formatScore(
      currentScore.value,
    ),
  )

const maxScoreLabel =
  computed(() =>
    formatScore(
      attempt.value
        ?.maxScore ??
      calculatedMaxScore.value,
    ),
  )

const percentageLabel =
  computed(() => {
    const value =
      Number(
        attempt.value
          ?.percentage,
      )

    return Number.isFinite(
      value,
    )
      ? `${Math.round(value)}%`
      : '—'
  })

const passLabel =
  computed(() => {
    if (
      attempt.value
        ?.passed === true
    ) {
      return 'Aprobada'
    }

    if (
      attempt.value
        ?.passed === false
    ) {
      return 'Por reforzar'
    }

    return 'Sin criterio de aprobación'
  })

const loadReview =
  async () => {
    isLoading.value =
      true

    loadError.value =
      ''

    finalizeError.value =
      ''

    try {
      const review =
        await fetchTeacherEvaluationReview(
          attemptId.value,
        )

      attempt.value =
        review.attempt

      questions.value =
        review.questions
    } catch (error) {
      console.error(
        'Error cargando revisión docente:',
        error,
      )

      attempt.value =
        null

      questions.value =
        []

      loadError.value =
        error?.message ||
        'No fue posible cargar esta evaluación.'
    } finally {
      isLoading.value =
        false
    }
  }

const setQuestionSaving =
  (
    questionId,
    saving,
  ) => {
    const next =
      new Set(
        savingQuestionIds.value,
      )

    if (saving) {
      next.add(
        Number(
          questionId,
        ),
      )
    } else {
      next.delete(
        Number(
          questionId,
        ),
      )
    }

    savingQuestionIds.value =
      next
  }

const isQuestionSaving =
  questionId =>
    savingQuestionIds.value
      .has(
        Number(
          questionId,
        ),
      )

const saveQuestion =
  async question => {
    if (
      question.autoGradable
    ) {
      return
    }

    questionErrors.value = {
      ...questionErrors.value,
      [question.id]:
        '',
    }

    successMessage.value =
      ''

    const score =
      Number(
        question.scoreAwarded,
      )

    if (
      !Number.isFinite(
        score,
      )
    ) {
      questionErrors.value = {
        ...questionErrors.value,
        [question.id]:
          'Ingresa un puntaje para esta pregunta.',
      }

      return
    }

    if (
      score < 0 ||
      score >
        Number(
          question.points,
        )
    ) {
      questionErrors.value = {
        ...questionErrors.value,
        [question.id]:
          `El puntaje debe estar entre 0 y ${formatScore(question.points)}.`,
      }

      return
    }

    setQuestionSaving(
      question.id,
      true,
    )

    try {
      const saved =
        await saveTeacherQuestionReview({
          attemptId:
            attemptId.value,

          questionId:
            question.id,

          scoreAwarded:
            score,

          teacherFeedback:
            question.teacherFeedback,
        })

      question.scoreAwarded =
        saved.scoreAwarded

      question.teacherFeedback =
        saved.teacherFeedback

      const next =
        new Set(
          savedQuestionIds.value,
        )

      next.add(
        Number(
          question.id,
        ),
      )

      savedQuestionIds.value =
        next
    } catch (error) {
      questionErrors.value = {
        ...questionErrors.value,
        [question.id]:
          error?.message ||
          'No fue posible guardar esta corrección.',
      }
    } finally {
      setQuestionSaving(
        question.id,
        false,
      )
    }
  }

const finalizeReview =
  async () => {
    if (
      isFinalizing.value ||
      isSavingAnyQuestion.value ||
      pendingManualCount.value >
        0
    ) {
      return
    }

    isFinalizing.value =
      true

    finalizeError.value =
      ''

    successMessage.value =
      ''

    try {
      const result =
        await finalizeTeacherEvaluationReview(
          attemptId.value,
        )

      attempt.value = {
        ...attempt.value,
        status:
          result.status,
        score:
          result.score,
        maxScore:
          result.maxScore,
        percentage:
          result.percentage,
        passed:
          result.passed,
        gradedAt:
          result.gradedAt,
      }

      successMessage.value =
        'Corrección finalizada. El resultado del estudiante quedó actualizado.'

      await loadReview()

      successMessage.value =
        'Corrección finalizada. El resultado del estudiante quedó actualizado.'
    } catch (error) {
      finalizeError.value =
        error?.message ||
        'No fue posible finalizar la corrección.'
    } finally {
      isFinalizing.value =
        false
    }
  }

const isSelected =
  (
    question,
    optionId,
  ) =>
    question
      .selectedOptionIds
      .map(Number)
      .includes(
        Number(
          optionId,
        ),
      )

const optionLetter =
  (
    options,
    optionId,
  ) => {
    const index =
      options.findIndex(
        option =>
          Number(
            option.id,
          ) ===
          Number(
            optionId,
          ),
      )

    if (index < 0) {
      return '•'
    }

    return String
      .fromCharCode(
        65 +
        index,
      )
  }

const formatScore =
  value => {
    const number =
      Number(value)

    if (
      !Number.isFinite(
        number,
      )
    ) {
      return '—'
    }

    return Number.isInteger(
      number,
    )
      ? String(number)
      : number.toFixed(1)
  }

const formatDate =
  value => {
    if (!value) {
      return 'sin fecha'
    }

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return 'sin fecha'
    }

    return new Intl
      .DateTimeFormat(
        'es-CL',
        {
          day:
            'numeric',
          month:
            'short',
          year:
            'numeric',
          hour:
            '2-digit',
          minute:
            '2-digit',
        },
      )
      .format(date)
  }

onMounted(
  loadReview,
)
</script>

<style scoped lang="scss">
.teacher-review {
  --ink: #152033;
  --ink-soft: #344359;
  --muted: #718095;
  --line: #dbe3ec;
  --line-strong: #cbd6e2;
  --surface-soft: #f7f9fc;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-dark: #987000;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #edf8f3;
  --red: #be4856;
  --red-soft: #fff3f5;
  --blue: #3f6fa8;
  --blue-soft: #eef5fc;

  width:
    min(
      1240px,
      calc(
        100% -
        40px
      )
    );
  margin-inline:
    auto;
  padding:
    34px
    0
    80px;
  color:
    var(--ink);
}

.teacher-review__back {
  display:
    inline-flex;
  margin-bottom:
    22px;
  color:
    var(--wine);
  font-size:
    .82rem;
  font-weight:
    850;
  text-decoration:
    none;
}

.teacher-review__hero {
  display:
    grid;
  grid-template-columns:
    minmax(
      0,
      1fr
    )
    180px;
  gap:
    28px;
  align-items:
    center;
  padding:
    34px;
  border:
    1px solid
    var(--line);
  border-radius:
    22px;
  background:
    radial-gradient(
      circle at
      100% 0,
      #fff8e7 0,
      transparent 35%
    ),
    #fff;
  box-shadow:
    0 18px
    48px
    rgba(
      35,
      50,
      72,
      .08
    );
}

.teacher-review__eyebrow {
  color:
    var(--gold-dark);
  font-size:
    .68rem;
  font-weight:
    950;
  letter-spacing:
    .14em;
}

.teacher-review__hero h1 {
  margin:
    7px
    0
    8px;
  color:
    var(--ink);
  font-size:
    clamp(
      2.2rem,
      5vw,
      4.4rem
    );
  line-height:
    .95;
  letter-spacing:
    -.045em;
}

.teacher-review__hero p {
  margin:
    0;
  color:
    var(--muted);
}

.teacher-review__chips {
  display:
    flex;
  gap:
    8px;
  flex-wrap:
    wrap;
  margin-top:
    16px;
}

.teacher-review__chips span {
  padding:
    6px
    9px;
  border:
    1px solid
    var(--line);
  border-radius:
    999px;
  background:
    #fff;
  color:
    var(--ink-soft);
  font-size:
    .66rem;
  font-weight:
    800;
}

.teacher-review__result {
  display:
    grid;
  min-height:
    150px;
  place-content:
    center;
  padding:
    15px;
  border:
    1px solid
    #ead79c;
  border-radius:
    20px;
  background:
    var(--gold-soft);
  text-align:
    center;
}

.teacher-review__result--done {
  border-color:
    #bfe0cd;
  background:
    var(--green-soft);
}

.teacher-review__result small {
  color:
    var(--muted);
  font-size:
    .58rem;
  font-weight:
    900;
  letter-spacing:
    .1em;
}

.teacher-review__result strong {
  margin:
    6px 0;
  color:
    var(--gold-dark);
  font-size:
    1.55rem;
}

.teacher-review__result--done strong {
  color:
    var(--green);
}

.teacher-review__result span {
  color:
    var(--ink-soft);
  font-size:
    .72rem;
}

.teacher-review__summary {
  display:
    grid;
  grid-template-columns:
    repeat(
      4,
      minmax(
        0,
        1fr
      )
    );
  gap:
    12px;
  margin-top:
    16px;
}

.teacher-review__summary article {
  min-height:
    120px;
  padding:
    19px;
  border:
    1px solid
    var(--line);
  border-radius:
    15px;
  background:
    #fff;
}

.teacher-review__summary span {
  color:
    var(--muted);
  font-size:
    .68rem;
}

.teacher-review__summary strong {
  display:
    block;
  margin:
    9px 0
    4px;
  color:
    var(--gold-dark);
  font-size:
    1.55rem;
}

.teacher-review__summary small {
  color:
    var(--muted);
  font-size:
    .7rem;
}

.teacher-review__notice {
  display:
    grid;
  grid-template-columns:
    auto
    minmax(
      0,
      1fr
    );
  gap:
    14px;
  align-items:
    center;
  margin-top:
    16px;
  padding:
    17px
    20px;
  border:
    1px solid
    #cfe7db;
  border-radius:
    14px;
  background:
    var(--green-soft);
}

.teacher-review__notice >
div:first-child {
  display:
    grid;
  width:
    38px;
  height:
    38px;
  place-items:
    center;
  border:
    1px solid
    #b8ddc9;
  border-radius:
    50%;
  color:
    var(--green);
}

.teacher-review__notice strong {
  color:
    var(--ink);
}

.teacher-review__notice p {
  margin:
    4px 0
    0;
  color:
    var(--muted);
  font-size:
    .75rem;
  line-height:
    1.55;
}

.teacher-review__questions {
  display:
    grid;
  gap:
    16px;
  margin-top:
    18px;
}

.review-question {
  overflow:
    hidden;
  border:
    1px solid
    var(--line);
  border-radius:
    18px;
  background:
    #fff;
  box-shadow:
    0 10px
    28px
    rgba(
      35,
      50,
      72,
      .045
    );
}

.review-question--manual {
  border-color:
    #e8d596;
}

.review-question--pending {
  box-shadow:
    inset 4px
    0 0
    var(--gold),
    0 10px
    28px
    rgba(
      35,
      50,
      72,
      .045
    );
}

.review-question__header {
  display:
    flex;
  gap:
    16px;
  align-items:
    center;
  justify-content:
    space-between;
  padding:
    18px
    22px;
  border-bottom:
    1px solid
    var(--line);
  background:
    var(--surface-soft);
}

.review-question__header >
div {
  display:
    flex;
  gap:
    9px;
  align-items:
    center;
  flex-wrap:
    wrap;
}

.review-question__header >
div >
span {
  color:
    var(--gold-dark);
  font-size:
    .68rem;
  font-weight:
    950;
  letter-spacing:
    .12em;
}

.review-question__header >
strong {
  color:
    var(--ink-soft);
  font-size:
    .76rem;
}

.review-question__mode {
  padding:
    5px
    8px;
  border-radius:
    999px;
  font-size:
    .58rem;
  font-weight:
    900;
}

.review-question__mode--auto {
  border:
    1px solid
    #c9dced;
  background:
    var(--blue-soft);
  color:
    var(--blue);
}

.review-question__mode--manual {
  border:
    1px solid
    #ead79c;
  background:
    var(--gold-soft);
  color:
    var(--gold-dark);
}

.review-question__body {
  padding:
    24px;
}

.review-question__body h2 {
  max-width:
    900px;
  margin:
    0 0
    20px;
  color:
    var(--ink);
  font-size:
    clamp(
      1.25rem,
      2.4vw,
      2rem
    );
  line-height:
    1.25;
}

.review-question__options {
  display:
    grid;
  gap:
    8px;
}

.review-option {
  display:
    grid;
  grid-template-columns:
    38px
    minmax(
      0,
      1fr
    )
    auto
    auto;
  gap:
    10px;
  align-items:
    center;
  min-height:
    58px;
  padding:
    9px
    12px;
  border:
    1px solid
    var(--line);
  border-radius:
    11px;
  background:
    #fff;
}

.review-option >
span {
  display:
    grid;
  width:
    34px;
  height:
    34px;
  place-items:
    center;
  border:
    1px solid
    var(--line-strong);
  border-radius:
    50%;
  color:
    var(--gold-dark);
  font-size:
    .72rem;
  font-weight:
    950;
}

.review-option strong {
  color:
    var(--ink-soft);
  font-size:
    .82rem;
}

.review-option small {
  color:
    var(--muted);
  font-size:
    .6rem;
  font-weight:
    850;
}

.review-option--selected {
  border-color:
    #e6ca72;
  background:
    var(--gold-soft);
}

.review-option--correct {
  border-color:
    #bfe0cd;
  background:
    var(--green-soft);
}

.review-option--wrong {
  border-color:
    #efcbd1;
  background:
    var(--red-soft);
}

.review-question__answer,
.review-question__explanation,
.review-question__automatic-result,
.review-question__teacher {
  margin-top:
    16px;
  padding:
    16px;
  border:
    1px solid
    var(--line);
  border-radius:
    12px;
  background:
    var(--surface-soft);
}

.review-question__answer >
span,
.review-question__explanation >
span,
.review-question__automatic-result span,
.review-question__teacher-heading >
div >
span,
.review-question__teacher label >
span {
  color:
    var(--gold-dark);
  font-size:
    .62rem;
  font-weight:
    950;
  letter-spacing:
    .09em;
}

.review-question__answer p,
.review-question__explanation p {
  margin:
    7px 0
    0;
  color:
    var(--ink-soft);
  line-height:
    1.65;
}

.review-question__answer--empty p {
  color:
    var(--muted);
  font-style:
    italic;
}

.review-question__automatic-result {
  display:
    grid;
  grid-template-columns:
    1fr
    1fr;
  gap:
    12px;
}

.review-question__automatic-result >
div {
  padding:
    12px;
  border:
    1px solid
    var(--line);
  border-radius:
    10px;
  background:
    #fff;
}

.review-question__automatic-result strong {
  display:
    block;
  margin-top:
    6px;
  color:
    var(--ink);
}

.review-question__automatic-result
strong.is-correct {
  color:
    var(--green);
}

.review-question__automatic-result
strong.is-incorrect {
  color:
    var(--red);
}

.review-question__teacher {
  border-color:
    #e6cf88;
  background:
    #fffdf7;
}

.review-question__teacher-heading {
  display:
    flex;
  gap:
    16px;
  align-items:
    center;
  justify-content:
    space-between;
  margin-bottom:
    14px;
}

.review-question__teacher-heading strong {
  display:
    block;
  margin-top:
    4px;
  color:
    var(--ink);
}

.review-question__saved {
  padding:
    5px
    8px;
  border:
    1px solid
    #bfe0cd;
  border-radius:
    999px;
  background:
    var(--green-soft);
  color:
    var(--green);
  font-size:
    .6rem;
  font-weight:
    900;
}

.review-question__teacher-grid {
  display:
    grid;
  grid-template-columns:
    minmax(
      160px,
      220px
    )
    minmax(
      0,
      1fr
    );
  gap:
    14px;
}

.review-question__teacher label {
  display:
    block;
}

.score-input {
  display:
    grid;
  grid-template-columns:
    minmax(
      0,
      1fr
    )
    auto;
  align-items:
    center;
  margin-top:
    6px;
  overflow:
    hidden;
  border:
    1px solid
    var(--line-strong);
  border-radius:
    10px;
  background:
    #fff;
}

.score-input input {
  width:
    100%;
  min-height:
    48px;
  padding:
    0
    12px;
  border:
    0;
  outline:
    0;
  background:
    transparent;
  color:
    var(--ink);
  font:
    inherit;
  font-weight:
    850;
}

.score-input b {
  padding:
    0
    12px;
  color:
    var(--muted);
  font-size:
    .72rem;
}

.review-question__teacher textarea {
  width:
    100%;
  min-height:
    98px;
  margin-top:
    6px;
  padding:
    12px;
  resize:
    vertical;
  border:
    1px solid
    var(--line-strong);
  border-radius:
    10px;
  outline:
    none;
  background:
    #fff;
  color:
    var(--ink);
  font:
    inherit;
  line-height:
    1.55;
}

.review-question__teacher textarea:focus,
.score-input:focus-within {
  border-color:
    var(--gold);
  box-shadow:
    0 0 0
    3px
    rgba(
      217,
      169,
      29,
      .12
    );
}

.review-question__teacher-actions {
  display:
    flex;
  gap:
    12px;
  align-items:
    center;
  justify-content:
    flex-end;
  margin-top:
    12px;
}

.review-question__teacher-actions p {
  margin:
    0;
  color:
    var(--red);
  font-size:
    .7rem;
}

.review-question__teacher-actions button {
  min-height:
    40px;
  padding:
    0 13px;
  border:
    1px solid
    var(--wine);
  border-radius:
    9px;
  background:
    var(--wine);
  color:
    #fff;
  font:
    inherit;
  font-size:
    .7rem;
  font-weight:
    900;
  cursor:
    pointer;
}

.review-question__teacher-actions button:hover:not(:disabled) {
  background:
    var(--wine-dark);
}

.review-question__teacher-actions button:disabled {
  opacity:
    .55;
  cursor:
    default;
}

.teacher-review__footer {
  display:
    grid;
  grid-template-columns:
    minmax(
      0,
      1fr
    )
    auto;
  gap:
    22px;
  align-items:
    center;
  margin-top:
    18px;
  padding:
    24px;
  border:
    1px solid
    var(--line);
  border-radius:
    18px;
  background:
    #fff;
  box-shadow:
    0 14px
    36px
    rgba(
      35,
      50,
      72,
      .06
    );
}

.teacher-review__footer strong {
  display:
    block;
  margin-top:
    5px;
  color:
    var(--ink);
}

.teacher-review__footer p {
  max-width:
    760px;
  margin:
    5px 0
    0;
  color:
    var(--muted);
  font-size:
    .73rem;
  line-height:
    1.55;
}

.teacher-review__footer-error {
  color:
    var(--red) !important;
}

.teacher-review__footer-success {
  color:
    var(--green) !important;
  font-weight:
    800;
}

.teacher-review__footer-actions {
  display:
    flex;
  gap:
    9px;
  flex-wrap:
    wrap;
  justify-content:
    flex-end;
}

.teacher-review__footer-actions a,
.teacher-review__footer-actions button {
  display:
    inline-flex;
  min-height:
    44px;
  align-items:
    center;
  justify-content:
    center;
  padding:
    0 15px;
  border-radius:
    10px;
  font:
    inherit;
  font-size:
    .72rem;
  font-weight:
    900;
  text-decoration:
    none;
}

.teacher-review__footer-actions a {
  border:
    1px solid
    var(--line-strong);
  background:
    #fff;
  color:
    var(--ink-soft);
}

.teacher-review__footer-actions button {
  border:
    1px solid
    var(--wine);
  background:
    var(--wine);
  color:
    #fff;
  cursor:
    pointer;
}

.teacher-review__footer-actions button:hover:not(:disabled) {
  background:
    var(--wine-dark);
}

.teacher-review__footer-actions button:disabled {
  border-color:
    #d9dde3;
  background:
    #e9edf1;
  color:
    #9ba5b2;
  cursor:
    default;
}

.teacher-review__state {
  display:
    grid;
  min-height:
    55vh;
  place-content:
    center;
  padding:
    30px;
  border:
    1px solid
    var(--line);
  border-radius:
    18px;
  background:
    #fff;
  text-align:
    center;
}

.teacher-review__state p {
  color:
    var(--muted);
}

.teacher-review__state button {
  justify-self:
    center;
  min-height:
    40px;
  padding:
    0 14px;
  border:
    0;
  border-radius:
    9px;
  background:
    var(--wine);
  color:
    #fff;
  font:
    inherit;
  font-size:
    .72rem;
  font-weight:
    900;
  cursor:
    pointer;
}

.teacher-review__state--error {
  color:
    var(--red);
}

.teacher-review__spinner {
  width:
    34px;
  height:
    34px;
  justify-self:
    center;
  border:
    3px solid
    #e3e9ef;
  border-top-color:
    var(--wine);
  border-radius:
    50%;
  animation:
    spin
    .8s
    linear
    infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(
        360deg
      );
  }
}

@media (
  max-width:
    900px
) {
  .teacher-review__hero {
    grid-template-columns:
      1fr;
  }

  .teacher-review__result {
    min-height:
      110px;
  }

  .teacher-review__summary {
    grid-template-columns:
      repeat(
        2,
        minmax(
          0,
          1fr
        )
      );
  }

  .teacher-review__footer {
    grid-template-columns:
      1fr;
  }

  .teacher-review__footer-actions {
    justify-content:
      flex-start;
  }
}

@media (
  max-width:
    680px
) {
  .teacher-review {
    width:
      min(
        100% -
        24px,
        1240px
      );
    padding-top:
      24px;
  }

  .teacher-review__hero {
    padding:
      22px;
  }

  .teacher-review__summary {
    grid-template-columns:
      1fr
      1fr;
  }

  .review-question__body {
    padding:
      18px;
  }

  .review-option {
    grid-template-columns:
      34px
      minmax(
        0,
        1fr
      );
  }

  .review-option small {
    grid-column:
      2;
  }

  .review-question__teacher-grid {
    grid-template-columns:
      1fr;
  }

  .review-question__automatic-result {
    grid-template-columns:
      1fr;
  }

  .review-question__teacher-actions {
    align-items:
      stretch;
    flex-direction:
      column;
  }

  .review-question__teacher-actions button {
    width:
      100%;
  }
}

@media (
  max-width:
    430px
) {
  .teacher-review__summary {
    grid-template-columns:
      1fr;
  }

  .teacher-review__footer-actions {
    flex-direction:
      column;
  }

  .teacher-review__footer-actions a,
  .teacher-review__footer-actions button {
    width:
      100%;
  }
}
</style>
