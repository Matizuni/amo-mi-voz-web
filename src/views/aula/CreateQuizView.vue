<template>
  <section class="quiz-builder">
    <!-- =====================================================
         TOPBAR
    ====================================================== -->
    <header class="builder-topbar">
      <RouterLink
        :to="`/aula/clase/${lessonId}/trabajo`"
        class="back-link"
      >
        <span>←</span>
        Volver a la clase
      </RouterLink>

      <div class="builder-topbar__status">
        <span
          class="status-dot"
          :class="{
            'status-dot--saving': isSaving,
          }"
        ></span>

        {{
          isSaving
            ? 'Guardando evaluación...'
            : 'Constructor de evaluaciones'
        }}
      </div>
    </header>

    <!-- =====================================================
         ERROR DE CARGA
    ====================================================== -->
    <section
      v-if="pageError"
      class="page-error"
    >
      <div>!</div>

      <section>
        <strong>
          No podemos crear esta evaluación
        </strong>

        <p>
          {{ pageError }}
        </p>
      </section>

      <RouterLink
        to="/aula/programa-formativo"
      >
        Volver al programa
      </RouterLink>
    </section>

    <template v-else>
      <!-- ===================================================
           HERO
      ==================================================== -->
      <header class="builder-hero">
        <div class="builder-hero__content">
          <div class="eyebrow">
            <span></span>
            EVALUACIONES · AMO MI VOZ
          </div>

          <h1>
            Nueva evaluación
          </h1>

          <p>
            Diseña un quiz formativo o una prueba evaluada
            para esta clase.
          </p>

          <div
            v-if="lesson"
            class="lesson-context"
          >
            <span>
              CLASE
              {{ String(lesson.id).padStart(2, '0') }}
            </span>

            <strong>
              {{ lesson.title }}
            </strong>
          </div>
        </div>

        <div class="builder-hero__mark">
          <span>AMV</span>
          <strong>?</strong>
        </div>
      </header>

      <!-- ===================================================
           TIPO DE EVALUACIÓN
      ==================================================== -->
      <section class="builder-card">
        <header class="section-heading">
          <div>
            <span>
              01 · TIPO
            </span>

            <h2>
              ¿Qué quieres crear?
            </h2>

            <p>
              Elige el comportamiento principal de esta
              evaluación.
            </p>
          </div>
        </header>

        <div class="assessment-types">
          <button
            type="button"
            class="assessment-type"
            :class="{
              'assessment-type--active':
                form.assessmentType === 'quiz',
            }"
            @click="
              form.assessmentType = ('quiz')
            "
          >
            <div class="assessment-type__icon">
              ?
            </div>

            <section>
              <span>
                QUIZ FORMATIVO
              </span>

              <strong>
                Practicar y comprobar aprendizaje
              </strong>

              <p>
                Ideal para teoría, repaso, entrenamiento
                auditivo y actividades breves.
              </p>

              <small>
                Recomendado: varios intentos
              </small>
            </section>

            <div class="assessment-type__check">
              {{
                form.assessmentType === 'quiz'
                  ? '✓'
                  : ''
              }}
            </div>
          </button>

          <button
            type="button"
            class="assessment-type"
            :class="{
              'assessment-type--active':
                form.assessmentType === 'test',
            }"
            @click="
              form.assessmentType = ('test')
            "
          >
            <div class="assessment-type__icon">
              ★
            </div>

            <section>
              <span>
                PRUEBA EVALUADA
              </span>

              <strong>
                Medir y registrar resultados
              </strong>

              <p>
                Pensada para evaluaciones con puntaje,
                aprobación, intentos y tiempo límite.
              </p>

              <small>
                Recomendado: 1 intento
              </small>
            </section>

            <div class="assessment-type__check">
              {{
                form.assessmentType === 'test'
                  ? '✓'
                  : ''
              }}
            </div>
          </button>
        </div>
      </section>

      <!-- ===================================================
           INFORMACIÓN GENERAL
      ==================================================== -->
      <section class="builder-card">
        <header class="section-heading">
          <div>
            <span>
              02 · INFORMACIÓN
            </span>

            <h2>
              Datos principales
            </h2>

            <p>
              El alumno verá esta información antes de
              comenzar.
            </p>
          </div>
        </header>

        <div class="form-grid">
          <label class="field field--wide">
            <span>
              Título de la evaluación
            </span>

            <input
              v-model="form.title"
              type="text"
              maxlength="140"
              placeholder="Ej: Quiz · Fundamentos del sonido"
            />
          </label>

          <label class="field field--wide">
            <span>
              Descripción
            </span>

            <textarea
              v-model="form.description"
              rows="4"
              maxlength="1200"
              placeholder="Explica brevemente qué debe saber o hacer el alumno..."
            ></textarea>

            <small>
              {{ form.description.length }} / 1200
            </small>
          </label>
        </div>
      </section>

      <!-- ===================================================
           CONFIGURACIÓN
      ==================================================== -->
      <section class="builder-card">
        <header class="section-heading">
          <div>
            <span>
              03 · CONFIGURACIÓN
            </span>

            <h2>
              Reglas de la evaluación
            </h2>

            <p>
              Controla intentos, aprobación, tiempo y
              disponibilidad.
            </p>
          </div>
        </header>

        <div class="settings-grid">
          <label class="field">
            <span>
              Intentos permitidos
            </span>

            <input
              v-model.number="form.attemptsAllowed"
              type="number"
              min="1"
              max="50"
              placeholder="Sin límite"
            />

            <small>
              Vacío = sin límite
            </small>
          </label>

          <label class="field">
            <span>
              Porcentaje de aprobación
            </span>

            <div class="input-suffix">
              <input
                v-model.number="form.passingPercentage"
                type="number"
                min="0"
                max="100"
              />

              <b>%</b>
            </div>
          </label>

          <label class="field">
            <span>
              Tiempo límite
            </span>

            <div class="input-suffix">
              <input
                v-model.number="form.timeLimitMinutes"
                type="number"
                min="1"
                placeholder="Sin límite"
              />

              <b>min</b>
            </div>

            <small>
              Vacío = sin límite
            </small>
          </label>

          <label class="field">
            <span>
              Apertura
            </span>

            <input
              v-model="form.opensAt"
              type="datetime-local"
            />
          </label>

          <label class="field">
            <span>
              Cierre
            </span>

            <input
              v-model="form.closesAt"
              type="datetime-local"
            />
          </label>
        </div>

        <div class="switch-list">
          <label class="switch-row">
            <div>
              <strong>
                Mezclar preguntas
              </strong>

              <span>
                Presenta el orden de las preguntas de
                manera aleatoria.
              </span>
            </div>

            <input
              v-model="form.shuffleQuestions"
              type="checkbox"
            />

            <i></i>
          </label>

          <label class="switch-row">
            <div>
              <strong>
                Mostrar puntaje al terminar
              </strong>

              <span>
                El alumno podrá conocer su resultado
                inmediatamente.
              </span>
            </div>

            <input
              v-model="form.showScoreAfterSubmit"
              type="checkbox"
            />

            <i></i>
          </label>

          <label class="switch-row">
            <div>
              <strong>
                Mostrar respuestas correctas
              </strong>

              <span>
                Útil especialmente para quizzes
                formativos.
              </span>
            </div>

            <input
              v-model="form.showCorrectAnswers"
              type="checkbox"
            />

            <i></i>
          </label>
        </div>
      </section>

      <!-- ===================================================
           PREGUNTAS
      ==================================================== -->
      <section class="builder-card questions-section">
        <header class="section-heading">
          <div>
            <span>
              04 · PREGUNTAS
            </span>

            <h2>
              Constructor de preguntas
            </h2>

            <p>
              Cada pregunta puede tener su propio tipo,
              puntaje y respuesta correcta.
            </p>
          </div>

          <div class="questions-total">
            <small>
              PUNTAJE TOTAL
            </small>

            <strong>
              {{ calculatedTotalPoints }}
            </strong>

            <span>
              pts
            </span>
          </div>
        </header>

        <!-- SIN PREGUNTAS -->
        <div
          v-if="!questions.length"
          class="questions-empty"
        >
          <div class="questions-empty__icon">
            ?
          </div>

          <strong>
            Aún no hay preguntas
          </strong>

          <p>
            Agrega la primera pregunta de tu evaluación.
          </p>

          <button
            type="button"
            @click="addQuestion"
          >
            + Agregar primera pregunta
          </button>
        </div>

        <!-- LISTADO -->
        <div
          v-else
          class="question-list"
        >
          <article
            v-for="(question, questionIndex) in questions"
            :key="question.localId"
            class="question-card"
          >
            <header class="question-card__header">
              <div class="question-number">
                {{
                  String(
                    questionIndex + 1
                  ).padStart(2, '0')
                }}
              </div>

              <div class="question-type-label">
                {{
                  getQuestionTypeLabel(
                    question.type
                  )
                }}
              </div>

              <label class="points-field">
                <input
                  v-model.number="question.points"
                  type="number"
                  min="0"
                  step="0.5"
                />

                <span>
                  pts
                </span>
              </label>

              <div class="question-actions">
                <button
                  type="button"
                  title="Duplicar pregunta"
                  @click="
                    duplicateQuestion(
                      questionIndex
                    )
                  "
                >
                  ⧉
                </button>

                <button
                  type="button"
                  title="Mover arriba"
                  :disabled="questionIndex === 0"
                  @click="
                    moveQuestion(
                      questionIndex,
                      -1
                    )
                  "
                >
                  ↑
                </button>

                <button
                  type="button"
                  title="Mover abajo"
                  :disabled="
                    questionIndex ===
                    questions.length - 1
                  "
                  @click="
                    moveQuestion(
                      questionIndex,
                      1
                    )
                  "
                >
                  ↓
                </button>

                <button
                  type="button"
                  class="question-delete"
                  title="Eliminar pregunta"
                  @click="
                    removeQuestionLocal(
                      questionIndex
                    )
                  "
                >
                  ×
                </button>
              </div>
            </header>

            <div class="question-card__body">
              <div class="question-settings-row">
                <label class="field">
                  <span>
                    Tipo de pregunta
                  </span>

                  <select
                    v-model="question.type"
                    @change="
                      handleQuestionTypeChange(
                        question
                      )
                    "
                  >
                    <option value="single_choice">
                      Selección única
                    </option>

                    <option value="multiple_choice">
                      Selección múltiple
                    </option>

                    <option value="true_false">
                      Verdadero / falso
                    </option>

                    <option value="short_answer">
                      Respuesta corta
                    </option>

                    <option value="essay">
                      Desarrollo
                    </option>
                  </select>
                </label>

                <label class="field">
                  <span>
                    Recurso multimedia
                  </span>

                  <select
                    v-model="question.mediaType"
                  >
                    <option value="none">
                      Sin recurso
                    </option>

                    <option value="audio">
                      Audio
                    </option>

                    <option value="image">
                      Imagen
                    </option>
                  </select>
                </label>
              </div>

              <label class="field field--wide question-prompt">
                <span>
                  Pregunta
                </span>

                <textarea
                  v-model="question.prompt"
                  rows="3"
                  placeholder="Escribe aquí la pregunta..."
                ></textarea>
              </label>

              <!-- FUTURO AUDIO / IMAGEN -->
              <div
                v-if="question.mediaType !== 'none'"
                class="media-placeholder"
              >
                <div>
                  {{
                    question.mediaType === 'audio'
                      ? '♪'
                      : 'IMG'
                  }}
                </div>

                <section>
                  <strong>
                    {{
                      question.mediaType === 'audio'
                        ? 'Pregunta con audio'
                        : 'Pregunta con imagen'
                    }}
                  </strong>

                  <p>
                    La arquitectura ya está preparada.
                    En el siguiente módulo conectaremos
                    la subida de archivos multimedia.
                  </p>
                </section>
              </div>

              <!-- OPCIONES -->
              <div
                v-if="
                  questionHasOptions(
                    question.type
                  )
                "
                class="options-editor"
              >
                <header>
                  <div>
                    <span>
                      RESPUESTAS
                    </span>

                    <strong>
                      Marca la respuesta correcta
                    </strong>
                  </div>

                  <button
                    v-if="
                      question.type !==
                      'true_false'
                    "
                    type="button"
                    @click="
                      addOption(question)
                    "
                  >
                    + Opción
                  </button>
                </header>

                <div class="option-list">
                  <div
                    v-for="(
                      option,
                      optionIndex
                    ) in question.options"
                    :key="option.localId"
                    class="option-row"
                    :class="{
                      'option-row--correct':
                        option.isCorrect,
                    }"
                  >
                    <button
                      type="button"
                      class="correct-selector"
                      :class="{
                        'correct-selector--multiple':
                          question.type ===
                          'multiple_choice',
                      }"
                      @click="
                        toggleCorrectOption(
                          question,
                          optionIndex
                        )
                      "
                    >
                      {{
                        option.isCorrect
                          ? '✓'
                          : ''
                      }}
                    </button>

                    <input
                      v-model="option.text"
                      type="text"
                      :disabled="
                        question.type ===
                        'true_false'
                      "
                      :placeholder="
                        `Opción ${optionIndex + 1}`
                      "
                    />

                    <span
                      v-if="option.isCorrect"
                      class="correct-label"
                    >
                      CORRECTA
                    </span>

                    <button
                      v-if="
                        question.type !==
                        'true_false' &&
                        question.options.length > 2
                      "
                      type="button"
                      class="remove-option"
                      @click="
                        removeOptionLocal(
                          question,
                          optionIndex
                        )
                      "
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>

              <!-- RESPUESTA MANUAL -->
              <div
                v-else
                class="manual-question"
              >
                <div class="manual-question__icon">
                  ✎
                </div>

                <div>
                  <strong>
                    Corrección manual
                  </strong>

                  <p>
                    Esta respuesta será revisada por el
                    profesor después del envío.
                  </p>
                </div>
              </div>

              <!-- EXPLICACIÓN -->
              <details class="explanation-block">
                <summary>
                  + Agregar explicación de respuesta
                </summary>

                <label class="field field--wide">
                  <span>
                    Explicación
                  </span>

                  <textarea
                    v-model="question.explanation"
                    rows="3"
                    placeholder="Ej: Una octava duplica la frecuencia, por eso corresponde a una relación 2:1."
                  ></textarea>
                </label>
              </details>
            </div>
          </article>
        </div>

        <button
          v-if="questions.length"
          type="button"
          class="add-question-button"
          @click="addQuestion"
        >
          <span>+</span>

          <div>
            <strong>
              Agregar pregunta
            </strong>

            <small>
              Selección, verdadero/falso, respuesta
              corta o desarrollo
            </small>
          </div>
        </button>
      </section>

      <!-- ===================================================
           PREVIEW RESUMEN
      ==================================================== -->
      <section class="builder-summary">
        <div>
          <span>
            RESUMEN DE LA EVALUACIÓN
          </span>

          <h2>
            {{
              form.title ||
              'Evaluación sin título'
            }}
          </h2>

          <p>
            {{
              form.assessmentType === 'quiz'
                ? 'Quiz formativo'
                : 'Prueba evaluada'
            }}
            · {{ questions.length }}
            {{
              questions.length === 1
                ? 'pregunta'
                : 'preguntas'
            }}
            · {{ calculatedTotalPoints }} puntos
          </p>
        </div>

        <div class="summary-stats">
          <article>
            <span>
              {{ questions.length }}
            </span>

            <small>
              Preguntas
            </small>
          </article>

          <article>
            <span>
              {{ calculatedTotalPoints }}
            </span>

            <small>
              Puntos
            </small>
          </article>

          <article>
            <span>
              {{
                form.attemptsAllowed ||
                '∞'
              }}
            </span>

            <small>
              Intentos
            </small>
          </article>

          <article>
            <span>
              {{
                form.timeLimitMinutes
                  ? `${form.timeLimitMinutes}m`
                  : '∞'
              }}
            </span>

            <small>
              Tiempo
            </small>
          </article>
        </div>
      </section>

      <!-- ===================================================
           VALIDACIÓN
      ==================================================== -->
      <div
        v-if="validationError"
        class="validation-error"
      >
        <span>!</span>

        <p>
          {{ validationError }}
        </p>
      </div>

      <!-- ===================================================
           ACTIONS
      ==================================================== -->
      <footer class="builder-actions">
        <RouterLink
          :to="`/aula/clase/${lessonId}/trabajo`"
          class="cancel-button"
        >
          Cancelar
        </RouterLink>

        <div>
          <button
            type="button"
            class="save-button"
            :disabled="isSaving"
            @click="saveQuiz('draft')"
          >
            {{
              isSaving &&
              savingMode === 'draft'
                ? 'Guardando...'
                : 'Guardar borrador'
            }}
          </button>

          <button
            type="button"
            class="publish-button"
            :disabled="isSaving"
            @click="saveQuiz('published')"
          >
            {{
              isSaving &&
              savingMode === 'published'
                ? 'Publicando...'
                : 'Publicar evaluación'
            }}

            <span>
              →
            </span>
          </button>
        </div>
      </footer>
    </template>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Transition name="toast">
      <div
        v-if="toastMessage"
        class="builder-toast"
      >
        <span>
          ✓
        </span>

        <div>
          <strong>
            Evaluación guardada
          </strong>

          <small>
            {{ toastMessage }}
          </small>
        </div>
      </div>
    </Transition>
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
  useRouter,
} from 'vue-router'

import {
  fetchLessonById,
} from '@/services/lessonService'

import {
  createQuestionWithOptions,
  insertQuiz,
  publishQuiz,
  recalculateQuizTotalPoints,
} from '@/services/quizService'

import {
  useAuth,
} from '@/composables/useAuth'

const route = useRoute()
const router = useRouter()

const {
  isTeacher,
} = useAuth()

/* =========================================================
   ESTADO
========================================================= */

const lesson = ref(null)

const isSaving = ref(false)
const savingMode = ref('')

const pageError = ref('')
const validationError = ref('')

const toastMessage = ref('')

/* =========================================================
   LESSON ID
========================================================= */

const lessonId =
  computed(() => {
    const id =
      Number(
        route.params.id,
      )

    return (
      Number.isFinite(id) &&
      id > 0
        ? id
        : null
    )
  })

/* =========================================================
   FORMULARIO
========================================================= */

const form = ref({
  assessmentType:
    'quiz',

  title:
    '',

  description:
    '',

  passingPercentage:
    60,

  attemptsAllowed:
    3,

  timeLimitMinutes:
    null,

  opensAt:
    '',

  closesAt:
    '',

  shuffleQuestions:
    false,

  showScoreAfterSubmit:
    true,

  showCorrectAnswers:
    true,
})

/* =========================================================
   IDS LOCALES
========================================================= */

let localIdCounter = 0

const createLocalId = prefix => {
  localIdCounter += 1

  return `${prefix}-${Date.now()}-${localIdCounter}`
}

/* =========================================================
   PREGUNTAS
========================================================= */

const questions = ref([])

const createDefaultOptions = () => [
  {
    localId:
      createLocalId('option'),

    text:
      '',

    isCorrect:
      true,
  },

  {
    localId:
      createLocalId('option'),

    text:
      '',

    isCorrect:
      false,
  },
]

const createTrueFalseOptions =
  () => [
    {
      localId:
        createLocalId('option'),

      text:
        'Verdadero',

      isCorrect:
        true,
    },

    {
      localId:
        createLocalId('option'),

      text:
        'Falso',

      isCorrect:
        false,
    },
  ]

const createQuestion =
  () => ({
    localId:
      createLocalId('question'),

    type:
      'single_choice',

    prompt:
      '',

    explanation:
      '',

    points:
      1,

    required:
      true,

    autoGradable:
      true,

    mediaType:
      'none',

    mediaUrl:
      '',

    options:
      createDefaultOptions(),
  })

const addQuestion = () => {
  questions.value.push(
    createQuestion(),
  )
}

/* =========================================================
   DUPLICAR
========================================================= */

const duplicateQuestion =
  index => {
    const original =
      questions.value[index]

    if (!original) {
      return
    }

    const copy = {
      ...original,

      localId:
        createLocalId(
          'question',
        ),

      options:
        original.options.map(
          option => ({
            ...option,

            localId:
              createLocalId(
                'option',
              ),
          }),
        ),
    }

    questions.value.splice(
      index + 1,
      0,
      copy,
    )
  }

/* =========================================================
   ELIMINAR
========================================================= */

const removeQuestionLocal =
  index => {
    questions.value.splice(
      index,
      1,
    )
  }

/* =========================================================
   MOVER
========================================================= */

const moveQuestion = (
  index,
  direction,
) => {
  const target =
    index + direction

  if (
    target < 0 ||
    target >=
      questions.value.length
  ) {
    return
  }

  const [
    question,
  ] =
    questions.value.splice(
      index,
      1,
    )

  questions.value.splice(
    target,
    0,
    question,
  )
}

/* =========================================================
   TIPOS
========================================================= */

const questionHasOptions =
  type => {
    return [
      'single_choice',
      'multiple_choice',
      'true_false',
    ].includes(type)
  }

const handleQuestionTypeChange =
  question => {
    if (
      question.type ===
      'true_false'
    ) {
      question.options =
        createTrueFalseOptions()

      question.autoGradable =
        true

      return
    }

    if (
      question.type ===
        'single_choice' ||
      question.type ===
        'multiple_choice'
    ) {
      if (
        !question.options?.length
      ) {
        question.options =
          createDefaultOptions()
      }

      question.autoGradable =
        true

      return
    }

    question.options = []
    question.autoGradable =
      false
  }

/* =========================================================
   OPCIONES
========================================================= */

const addOption =
  question => {
    question.options.push({
      localId:
        createLocalId(
          'option',
        ),

      text:
        '',

      isCorrect:
        false,
    })
  }

const removeOptionLocal = (
  question,
  index,
) => {
  question.options.splice(
    index,
    1,
  )
}

const toggleCorrectOption = (
  question,
  index,
) => {
  if (
    question.type ===
    'multiple_choice'
  ) {
    question.options[
      index
    ].isCorrect =
      !question.options[
        index
      ].isCorrect

    return
  }

  question.options.forEach(
    (
      option,
      optionIndex,
    ) => {
      option.isCorrect =
        optionIndex ===
        index
    },
  )
}

/* =========================================================
   LABELS
========================================================= */

const getQuestionTypeLabel =
  type => {
    const labels = {
      single_choice:
        'Selección única',

      multiple_choice:
        'Selección múltiple',

      true_false:
        'Verdadero / falso',

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

/* =========================================================
   TOTAL
========================================================= */

const calculatedTotalPoints =
  computed(() => {
    return questions.value.reduce(
      (
        total,
        question,
      ) => {
        const points =
          Number(
            question.points ||
            0,
          )

        return (
          total +
          (
            Number.isFinite(
              points,
            )
              ? points
              : 0
          )
        )
      },
      0,
    )
  })

/* =========================================================
   FECHAS
========================================================= */

const toIsoDate =
  value => {
    if (!value) {
      return null
    }

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return null
    }

    return date.toISOString()
  }

/* =========================================================
   VALIDACIÓN
========================================================= */

const validateQuiz =
  publish => {
    validationError.value =
      ''

    if (
      !form.value.title.trim()
    ) {
      validationError.value =
        'Escribe un título para la evaluación.'

      return false
    }

    if (
      form.value.passingPercentage !==
        null &&
      form.value.passingPercentage !==
        '' &&
      (
        Number(
          form.value
            .passingPercentage,
        ) < 0 ||
        Number(
          form.value
            .passingPercentage,
        ) > 100
      )
    ) {
      validationError.value =
        'El porcentaje de aprobación debe estar entre 0 y 100.'

      return false
    }

    if (
      form.value.opensAt &&
      form.value.closesAt &&
      new Date(
        form.value.closesAt,
      ) <=
        new Date(
          form.value.opensAt,
        )
    ) {
      validationError.value =
        'La fecha de cierre debe ser posterior a la apertura.'

      return false
    }

    /*
     * Podemos guardar un borrador
     * sin preguntas.
     */
    if (
      !publish
    ) {
      return true
    }

    if (
      !questions.value.length
    ) {
      validationError.value =
        'Agrega al menos una pregunta antes de publicar.'

      return false
    }

    for (
      let index = 0;
      index <
      questions.value.length;
      index += 1
    ) {
      const question =
        questions.value[
          index
        ]

      if (
        !question.prompt.trim()
      ) {
        validationError.value =
          `La pregunta ${index + 1} está vacía.`

        return false
      }

      if (
        Number(
          question.points,
        ) < 0
      ) {
        validationError.value =
          `La pregunta ${index + 1} tiene un puntaje inválido.`

        return false
      }

      if (
        questionHasOptions(
          question.type,
        )
      ) {
        const validOptions =
          question.options.filter(
            option =>
              option.text.trim(),
          )

        if (
          validOptions.length < 2
        ) {
          validationError.value =
            `La pregunta ${index + 1} necesita al menos dos opciones.`

          return false
        }

        const correctOptions =
          validOptions.filter(
            option =>
              option.isCorrect,
          )

        if (
          !correctOptions.length
        ) {
          validationError.value =
            `Marca la respuesta correcta en la pregunta ${index + 1}.`

          return false
        }

        if (
          question.type ===
            'single_choice' &&
          correctOptions.length !==
            1
        ) {
          validationError.value =
            `La pregunta ${index + 1} debe tener exactamente una respuesta correcta.`

          return false
        }
      }
    }

    return true
  }

/* =========================================================
   GUARDAR
========================================================= */

const saveQuiz =
  async status => {
    const publish =
      status ===
      'published'

    if (
      !validateQuiz(
        publish,
      )
    ) {
      return
    }

    if (
      !lessonId.value ||
      isSaving.value
    ) {
      return
    }

    isSaving.value = true
    savingMode.value =
      status

    try {
      /*
       * Primero siempre creamos como
       * borrador.
       *
       * Así evitamos publicar una
       * evaluación incompleta si
       * falla alguna pregunta.
       */
      const createdQuiz =
        await insertQuiz({
          lessonId:
            lessonId.value,

          title:
            form.value.title,

          description:
            form.value
              .description,

          assessmentType:
            form.value
              .assessmentType,

          status:
            'draft',

          totalPoints:
            0,

          passingPercentage:
            form.value
              .passingPercentage,

          attemptsAllowed:
            form.value
              .attemptsAllowed ||
            null,

          timeLimitMinutes:
            form.value
              .timeLimitMinutes ||
            null,

          opensAt:
            toIsoDate(
              form.value.opensAt,
            ),

          closesAt:
            toIsoDate(
              form.value.closesAt,
            ),

          shuffleQuestions:
            form.value
              .shuffleQuestions,

          showScoreAfterSubmit:
            form.value
              .showScoreAfterSubmit,

          showCorrectAnswers:
            form.value
              .showCorrectAnswers,
        })

      /*
       * Ahora creamos una por una
       * las preguntas.
       */
      for (
        let index = 0;
        index <
        questions.value.length;
        index += 1
      ) {
        const question =
          questions.value[
            index
          ]

        await createQuestionWithOptions({
          quizId:
            createdQuiz.id,

          type:
            question.type,

          prompt:
            question.prompt.trim(),

          explanation:
            question.explanation
              .trim(),

          points:
            Number(
              question.points ||
              0,
            ),

          position:
            index + 1,

          required:
            question.required,

          autoGradable:
            question.autoGradable,

          mediaType:
            question.mediaType,

          mediaUrl:
            question.mediaUrl,

          options:
            question.options
              .filter(
                option =>
                  option.text
                    .trim(),
              )
              .map(
                option => ({
                  text:
                    option.text
                      .trim(),

                  isCorrect:
                    option
                      .isCorrect,
                }),
              ),
        })
      }

      /*
       * Supabase recalcula el
       * puntaje según preguntas.
       */
      await recalculateQuizTotalPoints(
        createdQuiz.id,
      )

      /*
       * Solo publicamos cuando todo
       * lo anterior funcionó.
       */
      if (publish) {
        await publishQuiz(
          createdQuiz.id,
        )
      }

      toastMessage.value =
        publish
          ? 'La evaluación fue publicada correctamente.'
          : 'El borrador fue guardado correctamente.'

      /*
       * Pequeño retraso visual para
       * mostrar confirmación antes
       * de volver a la clase.
       */
      setTimeout(() => {
        router.push(
          `/aula/clase/${lessonId.value}/trabajo`,
        )
      }, 700)
    } catch (error) {
      console.error(
        'Error guardando evaluación:',
        error,
      )

      validationError.value =
        error?.message ||
        'No fue posible guardar la evaluación.'
    } finally {
      isSaving.value =
        false

      savingMode.value =
        ''
    }
  }

/* =========================================================
   CARGA
========================================================= */

const loadPage =
  async () => {
    pageError.value =
      ''

    if (
      !isTeacher.value
    ) {
      pageError.value =
        'Solo el profesor puede crear evaluaciones.'

      return
    }

    if (
      !lessonId.value
    ) {
      pageError.value =
        'La clase seleccionada no es válida.'

      return
    }

    try {
      lesson.value =
        await fetchLessonById(
          lessonId.value,
        )
    } catch (error) {
      console.error(
        'Error cargando clase:',
        error,
      )

      pageError.value =
        error?.message ||
        'No fue posible cargar la clase.'
    }
  }

/* =========================================================
   DEFAULTS SEGÚN TIPO
========================================================= */

const applyAssessmentDefaults =
  type => {
    if (
      type === 'quiz'
    ) {
      form.value
        .attemptsAllowed =
        3

      form.value
        .showCorrectAnswers =
        true

      return
    }

    form.value
      .attemptsAllowed =
      1

    form.value
      .showCorrectAnswers =
      false
  }

/*
 * Aplicamos algunos valores
 * iniciales dependiendo de la
 * selección.
 */
const selectAssessmentType =
  type => {
    form.value.assessmentType =
      type

    applyAssessmentDefaults(
      type,
    )
  }

/*
 * Esta función queda disponible
 * para una futura extracción del
 * selector de tipo.
 */
void selectAssessmentType

onMounted(() => {
  loadPage()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.quiz-builder {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding-bottom: 6rem;
}

/* =========================================================
   TOPBAR
========================================================= */

.builder-topbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.back-link {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color:
    variables.$color-primary;
  font-size: 0.7rem;
  font-weight: 800;
  text-decoration: none;
}

.back-link span {
  transition:
    transform 0.18s ease;
}

.back-link:hover span {
  transform:
    translateX(-3px);
}

.builder-topbar__status {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  color:
    rgba(255, 255, 255, 0.34);
  font-size: 0.59rem;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background:
    variables.$color-primary;
}

.status-dot--saving {
  animation:
    pulseStatus
    0.8s
    ease-in-out
    infinite alternate;
}

@keyframes pulseStatus {
  to {
    opacity: 0.25;
  }
}

/* =========================================================
   HERO
========================================================= */

.builder-hero {
  position: relative;
  display: grid;
  gap: 2rem;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  align-items: center;
  margin-bottom: 0.8rem;
  padding: 2.5rem;
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 22px;
  background:
    radial-gradient(
      circle at 95% 0%,
      rgba(255, 196, 0, 0.15),
      transparent 34%
    ),
    variables.$color-surface;
}

.builder-hero::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 110px;
  height: 3px;
  background:
    variables.$color-primary;
  content: '';
}

.eyebrow {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.11em;
}

.eyebrow > span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background:
    variables.$color-primary;
}

.builder-hero h1 {
  margin:
    0.8rem
    0
    0;
  font-size:
    clamp(
      2.7rem,
      7vw,
      5.2rem
    );
  line-height: 0.94;
  letter-spacing: -0.045em;
}

.builder-hero__content > p {
  max-width: 700px;
  margin:
    1rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.45);
  line-height: 1.6;
}

.lesson-context {
  display: inline-flex;
  gap: 0.6rem;
  align-items: center;
  margin-top: 1.2rem;
  padding:
    0.55rem
    0.7rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.25);
  border-radius: 9px;
}

.lesson-context span {
  color:
    variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
}

.lesson-context strong {
  font-size: 0.62rem;
}

.builder-hero__mark {
  display: grid;
  width: 125px;
  height: 125px;
  place-items: center;
  align-content: center;
  border:
    1px solid
    rgba(255, 196, 0, 0.45);
  border-radius: 50%;
}

.builder-hero__mark span {
  color:
    rgba(255, 255, 255, 0.25);
  font-size: 0.52rem;
  font-weight: 900;
}

.builder-hero__mark strong {
  margin-top: 0.15rem;
  color:
    variables.$color-primary;
  font-size: 3.2rem;
  line-height: 1;
}

/* =========================================================
   CARD
========================================================= */

.builder-card {
  margin-top: 0.8rem;
  padding: 1.7rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 18px;
  background:
    variables.$color-surface;
}

.section-heading {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.3rem;
}

.section-heading > div > span {
  color:
    variables.$color-primary;
  font-size: 0.53rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.section-heading h2 {
  margin:
    0.2rem
    0
    0;
  font-size:
    clamp(
      1.35rem,
      3vw,
      1.9rem
    );
}

.section-heading p {
  margin:
    0.3rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.32);
  font-size: 0.63rem;
}

/* =========================================================
   TYPE
========================================================= */

.assessment-types {
  display: grid;
  gap: 0.65rem;
  grid-template-columns:
    1fr
    1fr;
}

.assessment-type {
  display: grid;
  gap: 0.9rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1.1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 13px;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease,
    background 0.18s ease;
}

.assessment-type:hover {
  border-color:
    rgba(255, 196, 0, 0.45);
  transform:
    translateY(-1px);
}

.assessment-type--active {
  border-color:
    variables.$color-primary;
  background:
    rgba(255, 196, 0, 0.04);
}

.assessment-type__icon {
  display: grid;
  width: 45px;
  height: 45px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 11px;
  color:
    variables.$color-primary;
  font-size: 1rem;
}

.assessment-type section > span,
.assessment-type section > strong,
.assessment-type section > small {
  display: block;
}

.assessment-type section > span {
  color:
    variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.assessment-type section > strong {
  margin-top: 0.15rem;
  font-size: 0.73rem;
}

.assessment-type section p {
  margin:
    0.25rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.34);
  font-size: 0.59rem;
  line-height: 1.45;
}

.assessment-type section small {
  margin-top: 0.45rem;
  color:
    rgba(255, 255, 255, 0.23);
  font-size: 0.51rem;
}

.assessment-type__check {
  display: grid;
  width: 24px;
  height: 24px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

/* =========================================================
   FORMS
========================================================= */

.form-grid,
.settings-grid {
  display: grid;
  gap: 0.8rem;
}

.form-grid {
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

.settings-grid {
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
}

.field {
  display: grid;
  gap: 0.4rem;
}

.field--wide {
  grid-column:
    1 / -1;
}

.field > span {
  color:
    rgba(255, 255, 255, 0.55);
  font-size: 0.58rem;
  font-weight: 800;
}

.field input,
.field textarea,
.field select {
  width: 100%;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  outline: 0;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
  font-size: 0.69rem;
  transition:
    border-color 0.18s ease;
}

.field input,
.field select {
  min-height: 43px;
  padding:
    0
    0.75rem;
}

.field textarea {
  resize: vertical;
  padding: 0.75rem;
  line-height: 1.55;
}

.field input:focus,
.field textarea:focus,
.field select:focus {
  border-color:
    variables.$color-primary;
}

.field small {
  justify-self: end;
  color:
    rgba(255, 255, 255, 0.22);
  font-size: 0.51rem;
}

.input-suffix {
  position: relative;
}

.input-suffix input {
  padding-right: 3.2rem;
}

.input-suffix b {
  position: absolute;
  top: 50%;
  right: 0.8rem;
  color:
    variables.$color-primary;
  font-size: 0.6rem;
  transform:
    translateY(-50%);
}

/* =========================================================
   SWITCH
========================================================= */

.switch-list {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
}

.switch-row {
  position: relative;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  background:
    variables.$color-background;
  cursor: pointer;
}

.switch-row strong,
.switch-row span {
  display: block;
}

.switch-row strong {
  font-size: 0.66rem;
}

.switch-row span {
  margin-top: 0.15rem;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.55rem;
}

.switch-row input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.switch-row i {
  position: relative;
  width: 38px;
  height: 21px;
  flex-shrink: 0;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  background:
    rgba(255, 255, 255, 0.04);
}

.switch-row i::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background:
    rgba(255, 255, 255, 0.35);
  content: '';
  transition:
    transform 0.18s ease,
    background 0.18s ease;
}

.switch-row input:checked + i {
  border-color:
    variables.$color-primary;
  background:
    rgba(255, 196, 0, 0.08);
}

.switch-row input:checked + i::after {
  background:
    variables.$color-primary;
  transform:
    translateX(17px);
}

/* =========================================================
   QUESTIONS
========================================================= */

.questions-total {
  display: flex;
  gap: 0.35rem;
  align-items: baseline;
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.3);
  border-radius: 10px;
}

.questions-total small {
  margin-right: 0.3rem;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.49rem;
}

.questions-total strong {
  color:
    variables.$color-primary;
  font-size: 1.25rem;
}

.questions-total span {
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.52rem;
}

.questions-empty {
  display: grid;
  min-height: 260px;
  place-items: center;
  align-content: center;
  padding: 2rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 13px;
  text-align: center;
}

.questions-empty__icon {
  display: grid;
  width: 55px;
  height: 55px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 1.5rem;
}

.questions-empty strong {
  margin-top: 0.7rem;
  font-size: 0.8rem;
}

.questions-empty p {
  margin:
    0.2rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.59rem;
}

.questions-empty button {
  margin-top: 0.8rem;
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 9px;
  background:
    variables.$color-primary;
  color: #080808;
  font: inherit;
  font-size: 0.62rem;
  font-weight: 900;
  cursor: pointer;
}

/* =========================================================
   QUESTION CARD
========================================================= */

.question-list {
  display: grid;
  gap: 0.8rem;
}

.question-card {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 14px;
  background:
    variables.$color-background;
}

.question-card__header {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  padding: 0.75rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.question-number {
  display: grid;
  width: 33px;
  height: 33px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 8px;
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
}

.question-type-label {
  flex: 1;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.58rem;
  font-weight: 700;
}

.points-field {
  display: flex;
  align-items: center;
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
}

.points-field input {
  width: 55px;
  min-height: 32px;
  padding:
    0
    0.4rem;
  border: 0;
  outline: 0;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-size: 0.62rem;
  font-weight: 900;
}

.points-field span {
  padding-right: 0.5rem;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.5rem;
}

.question-actions {
  display: flex;
  gap: 0.25rem;
}

.question-actions button {
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 7px;
  background: transparent;
  color:
    rgba(255, 255, 255, 0.45);
  cursor: pointer;
}

.question-actions button:hover:not(:disabled) {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
}

.question-actions button:disabled {
  opacity: 0.2;
  cursor: default;
}

.question-actions .question-delete:hover {
  border-color:
    #ff6868;
  color:
    #ff6868;
}

.question-card__body {
  padding: 1rem;
}

.question-settings-row {
  display: grid;
  gap: 0.65rem;
  grid-template-columns:
    1fr
    1fr;
}

.question-prompt {
  margin-top: 0.8rem;
}

/* =========================================================
   MEDIA
========================================================= */

.media-placeholder {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-top: 0.8rem;
  padding: 0.8rem;
  border:
    1px dashed
    rgba(255, 196, 0, 0.3);
  border-radius: 10px;
}

.media-placeholder > div {
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 9px;
  color:
    variables.$color-primary;
  font-size: 0.55rem;
}

.media-placeholder strong {
  font-size: 0.63rem;
}

.media-placeholder p {
  margin:
    0.17rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.54rem;
}

/* =========================================================
   OPTIONS
========================================================= */

.options-editor {
  margin-top: 0.9rem;
  padding: 0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
}

.options-editor > header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.options-editor > header span,
.options-editor > header strong {
  display: block;
}

.options-editor > header span {
  color:
    variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.options-editor > header strong {
  margin-top: 0.1rem;
  font-size: 0.63rem;
}

.options-editor > header button {
  padding:
    0.42rem
    0.58rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 7px;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-size: 0.54rem;
  font-weight: 800;
  cursor: pointer;
}

.option-list {
  display: grid;
  gap: 0.4rem;
}

.option-row {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.45rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
}

.option-row--correct {
  border-color:
    rgba(255, 196, 0, 0.4);
  background:
    rgba(255, 196, 0, 0.025);
}

.correct-selector {
  display: grid;
  width: 25px;
  height: 25px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    rgba(255, 255, 255, 0.24);
  border-radius: 50%;
  background: transparent;
  color:
    variables.$color-primary;
  font-size: 0.54rem;
  cursor: pointer;
}

.correct-selector--multiple {
  border-radius: 6px;
}

.option-row--correct
.correct-selector {
  border-color:
    variables.$color-primary;
}

.option-row input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  background: transparent;
  color:
    variables.$color-white;
  font: inherit;
  font-size: 0.63rem;
}

.correct-label {
  color:
    variables.$color-primary;
  font-size: 0.45rem;
  font-weight: 900;
}

.remove-option {
  border: 0;
  background: transparent;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 1rem;
  cursor: pointer;
}

.remove-option:hover {
  color: #ff6868;
}

/* =========================================================
   MANUAL
========================================================= */

.manual-question {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-top: 0.9rem;
  padding: 0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
}

.manual-question__icon {
  display: grid;
  width: 37px;
  height: 37px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 9px;
  color:
    variables.$color-primary;
}

.manual-question strong {
  font-size: 0.62rem;
}

.manual-question p {
  margin:
    0.15rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.54rem;
}

/* =========================================================
   EXPLANATION
========================================================= */

.explanation-block {
  margin-top: 0.8rem;
  border-top:
    1px solid
    variables.$color-border;
  padding-top: 0.7rem;
}

.explanation-block summary {
  color:
    variables.$color-primary;
  font-size: 0.56rem;
  font-weight: 800;
  cursor: pointer;
  list-style: none;
}

.explanation-block .field {
  margin-top: 0.7rem;
}

/* =========================================================
   ADD QUESTION
========================================================= */

.add-question-button {
  display: flex;
  width: 100%;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.8rem;
  padding: 0.8rem;
  border:
    1px dashed
    rgba(255, 196, 0, 0.35);
  border-radius: 11px;
  background: transparent;
  color:
    variables.$color-white;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.add-question-button > span {
  display: grid;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.add-question-button strong,
.add-question-button small {
  display: block;
}

.add-question-button strong {
  font-size: 0.64rem;
}

.add-question-button small {
  margin-top: 0.1rem;
  color:
    rgba(255, 255, 255, 0.27);
  font-size: 0.53rem;
}

/* =========================================================
   SUMMARY
========================================================= */

.builder-summary {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  align-items: center;
  margin-top: 0.8rem;
  padding: 1.3rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.28);
  border-radius: 15px;
  background:
    rgba(255, 196, 0, 0.025);
}

.builder-summary > div:first-child > span {
  color:
    variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.builder-summary h2 {
  margin:
    0.2rem
    0
    0;
  font-size: 1.05rem;
}

.builder-summary p {
  margin:
    0.2rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.32);
  font-size: 0.58rem;
}

.summary-stats {
  display: grid;
  gap: 0.4rem;
  grid-template-columns:
    repeat(
      4,
      minmax(60px, 1fr)
    );
}

.summary-stats article {
  padding: 0.6rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  text-align: center;
}

.summary-stats span,
.summary-stats small {
  display: block;
}

.summary-stats span {
  color:
    variables.$color-primary;
  font-size: 0.9rem;
  font-weight: 900;
}

.summary-stats small {
  margin-top: 0.1rem;
  color:
    rgba(255, 255, 255, 0.25);
  font-size: 0.48rem;
}

/* =========================================================
   ERROR
========================================================= */

.validation-error,
.page-error {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-top: 0.8rem;
  padding: 0.9rem;
  border:
    1px solid
    rgba(255, 90, 90, 0.4);
  border-radius: 11px;
  background:
    rgba(255, 90, 90, 0.035);
}

.validation-error > span,
.page-error > div {
  display: grid;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    #ff6b6b;
  border-radius: 50%;
  color:
    #ff6b6b;
}

.validation-error p,
.page-error p {
  margin: 0;
  color:
    rgba(255, 255, 255, 0.5);
  font-size: 0.59rem;
}

.page-error strong {
  font-size: 0.65rem;
}

.page-error a {
  margin-left: auto;
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   ACTIONS
========================================================= */

.builder-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top:
    1px solid
    variables.$color-border;
}

.builder-actions > div {
  display: flex;
  gap: 0.5rem;
}

.cancel-button,
.save-button,
.publish-button {
  display: inline-flex;
  min-height: 42px;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  padding:
    0.65rem
    0.85rem;
  border-radius: 9px;
  font: inherit;
  font-size: 0.61rem;
  font-weight: 900;
  text-decoration: none;
}

.cancel-button {
  color:
    rgba(255, 255, 255, 0.4);
}

.save-button {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
  cursor: pointer;
}

.publish-button {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #070707;
  cursor: pointer;
}

.save-button:disabled,
.publish-button:disabled {
  opacity: 0.5;
  cursor: wait;
}

/* =========================================================
   TOAST
========================================================= */

.builder-toast {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1000;
  display: flex;
  max-width: 360px;
  gap: 0.65rem;
  align-items: center;
  padding: 0.85rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.4);
  border-radius: 11px;
  background:
    rgba(16, 16, 16, 0.97);
  box-shadow:
    0 20px 50px
    rgba(0, 0, 0, 0.5);
}

.builder-toast > span {
  display: grid;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color: #070707;
}

.builder-toast strong,
.builder-toast small {
  display: block;
}

.builder-toast strong {
  font-size: 0.62rem;
}

.builder-toast small {
  margin-top: 0.1rem;
  color:
    rgba(255, 255, 255, 0.32);
  font-size: 0.54rem;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform:
    translateY(8px);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .settings-grid {
    grid-template-columns:
      1fr
      1fr;
  }

  .builder-summary {
    grid-template-columns:
      1fr;
  }
}

@media (max-width: 700px) {
  .builder-hero {
    grid-template-columns:
      1fr;
    padding: 1.4rem;
  }

  .builder-hero__mark {
    width: 85px;
    height: 85px;
  }

  .builder-hero__mark strong {
    font-size: 2rem;
  }

  .assessment-types,
  .settings-grid,
  .form-grid {
    grid-template-columns:
      1fr;
  }

  .builder-card {
    padding: 1.2rem;
  }

  .question-settings-row {
    grid-template-columns:
      1fr;
  }

  .question-card__header {
    flex-wrap: wrap;
  }

  .question-type-label {
    min-width: 120px;
  }

  .question-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .summary-stats {
    grid-template-columns:
      1fr
      1fr;
  }
}

@media (max-width: 520px) {
  .builder-topbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .builder-hero h1 {
    font-size:
      clamp(
        2.5rem,
        14vw,
        4rem
      );
  }

  .assessment-type {
    grid-template-columns:
      auto
      1fr;
  }

  .assessment-type__check {
    grid-column: 2;
  }

  .section-heading {
    flex-direction: column;
  }

  .questions-total {
    align-self: flex-start;
  }

  .option-row {
    flex-wrap: wrap;
  }

  .option-row input {
    min-width: 150px;
  }

  .builder-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .builder-actions > div {
    flex-direction: column;
  }

  .cancel-button,
  .save-button,
  .publish-button {
    width: 100%;
  }

  .builder-toast {
    right: 0.75rem;
    bottom: 0.75rem;
    left: 0.75rem;
    max-width: none;
  }
}
</style>
