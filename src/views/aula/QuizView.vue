<template>
  <section
    class="quiz-page"
    :class="{
      'quiz-page--test': quiz?.assessmentType === 'test',
      'quiz-page--quiz': quiz?.assessmentType === 'quiz',
    }"
  >
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

        <div
          class="quiz-topbar__status"
          aria-live="polite"
        >
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

        <div
          class="quiz-progress__question-map"
          role="navigation"
          aria-label="Navegación rápida por preguntas"
        >
          <div class="quiz-progress__question-meta">
            <span>PREGUNTAS</span>
            <strong>
              {{ currentQuestionIndex + 1 }} / {{ questions.length }}
            </strong>
          </div>

          <div class="quiz-progress__question-track">
            <button
              v-for="(question, index) in questions"
              :key="`quick-${question.id}`"
              type="button"
              class="quiz-quick-dot"
              :class="[`quiz-quick-dot--tone-${index % 4}`, {
                'quiz-quick-dot--current':
                  index === currentQuestionIndex,
                'quiz-quick-dot--answered':
                  isQuestionAnswered(
                    question,
                    getAnswer(question.id),
                  ),
              }]"
              :aria-label="`Ir a pregunta ${index + 1}`"
              :aria-current="
                index === currentQuestionIndex
                  ? 'step'
                  : undefined
              "
              @click="goToQuestion(index)"
            >
              <span>{{ index + 1 }}</span>
              <i
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
              </i>
            </button>
          </div>

          <div class="quiz-progress__question-hint">
            <span>●</span>
            <span>respondida</span>
            <span>○</span>
            <span>pendiente</span>
          </div>
        </div>
      </section>

      <!-- MAIN LAYOUT -->
      <div class="quiz-layout">
        <!-- QUESTION -->
        <main class="question-panel">
          <Transition
            name="quiz-question"
            mode="out-in"
          >
            <div
              v-if="currentQuestion"
              :key="currentQuestion.id"
              class="question-stage"
              :data-question="currentQuestionIndex + 1"
            >
              <section class="question-content">
            <div class="question-meta-rail">
              <div class="question-meta-rail__left">
                <span class="question-meta-pill question-meta-pill--number">
                  PREGUNTA {{ String(currentQuestionIndex + 1).padStart(2, '0') }}
                </span>
                <span class="question-meta-pill question-meta-pill--type">
                  {{ questionTypeLabel(currentQuestion.type) }}
                </span>
                <span
                  v-if="currentQuestion.required"
                  class="question-meta-pill question-meta-pill--required"
                >
                  Obligatoria
                </span>
              </div>
              <span class="question-meta-pill question-meta-pill--points">
                {{ currentQuestion.points }} {{ Number(currentQuestion.points) === 1 ? 'punto' : 'puntos' }}
              </span>
            </div>


            <h2>
              {{ currentQuestion.prompt }}
            </h2>

            <div
              v-if="currentQuestion.mediaUrl"
              class="question-media"
            >
              <div
                v-if="currentQuestion.mediaType === 'audio'"
                class="audio-experience"
              >
                <div class="audio-experience__icon" aria-hidden="true">♪</div>
                <div class="audio-experience__content">
                  <span>ESCUCHA CON ATENCIÓN</span>
                  <strong>Reproduce el audio antes de responder</strong>
                  <audio
                    :src="currentQuestion.mediaUrl"
                    controls
                    preload="metadata"
                  ></audio>
                  <small>Puedes volver a escucharlo mientras la evaluación esté abierta.</small>
                </div>
              </div>

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
                currentQuestion.type === 'true_false' ||
                currentQuestion.type === 'audio_choice'
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

            <!-- EMPAREJAMIENTO -->
            <div
              v-else-if="currentQuestion.type === 'matching'"
              class="matching-question interactive-question"
            >
              <div class="interactive-question__intro">
                <div>
                  <span>EMPAREJAMIENTO</span>
                  <p class="question-hint">Relaciona cada concepto con una respuesta. Cada alternativa puede usarse una sola vez.</p>
                </div>
                <strong>{{ getMatchingCompletedCount(currentQuestion) }}/{{ getMatchingPairs(currentQuestion).length }}</strong>
              </div>

              <div class="matching-question__list">
                <article
                  v-for="(pair, pairIndex) in getMatchingPairs(currentQuestion)"
                  :key="`${pair.left}-${pairIndex}`"
                  class="matching-question__row"
                  :class="{
                    'matching-question__row--complete': getMatchingSelection(currentQuestion.id, pair.left)
                  }"
                >
                  <span class="matching-question__number">{{ pairIndex + 1 }}</span>

                  <div class="matching-question__concept">
                    <span>CONCEPTO</span>
                    <strong>{{ pair.left }}</strong>
                  </div>

                  <span class="matching-question__arrow" aria-hidden="true">→</span>

                  <details class="matching-select">
                    <summary
                      class="matching-select__trigger"
                      :aria-label="`Seleccionar respuesta para ${pair.left}`"
                    >
                      <span
                        :class="{
                          'matching-select__placeholder': !getMatchingSelection(currentQuestion.id, pair.left),
                        }"
                      >
                        {{
                          getMatchingSelection(currentQuestion.id, pair.left) ||
                          'Selecciona una respuesta...'
                        }}
                      </span>
                      <b aria-hidden="true">⌄</b>
                    </summary>

                    <div class="matching-select__menu">
                      <button
                        v-for="choice in getMatchingChoices(currentQuestion)"
                        :key="choice"
                        type="button"
                        class="matching-select__option"
                        :class="{
                          'matching-select__option--selected':
                            getMatchingSelection(currentQuestion.id, pair.left) === choice,
                        }"
                        :disabled="
                          isMatchingChoiceUsed(currentQuestion, pair.left, choice)
                        "
                        @click="
                          updateMatchingSelection(currentQuestion, pair.left, choice);
                          $event.currentTarget.closest('details').open = false
                        "
                      >
                        <span class="matching-select__option-dot" aria-hidden="true"></span>
                        <span>{{ choice }}</span>
                        <b v-if="getMatchingSelection(currentQuestion.id, pair.left) === choice" aria-hidden="true">✓</b>
                      </button>
                    </div>
                  </details>

                  <button
                    v-if="getMatchingSelection(currentQuestion.id, pair.left)"
                    type="button"
                    class="matching-question__clear"
                    :aria-label="`Borrar relación de ${pair.left}`"
                    @click="updateMatchingSelection(currentQuestion, pair.left, '')"
                  >
                    ×
                  </button>
                </article>
              </div>
            </div>

            <!-- ORDENAR ELEMENTOS -->
            <div
              v-else-if="currentQuestion.type === 'ordering'"
              class="ordering-question interactive-question"
            >
              <div class="interactive-question__intro">
                <div>
                  <span>ORDENAMIENTO</span>
                  <p class="question-hint">Arrastra los elementos o usa las flechas. Cuando estés conforme, confirma el orden.</p>
                </div>
                <strong>{{ getOrderingAnswer(currentQuestion).length }} elementos</strong>
              </div>

              <div class="ordering-question__list">
                <article
                  v-for="(item, itemIndex) in getOrderingAnswer(currentQuestion)"
                  :key="item.id"
                  class="ordering-question__item"
                  :class="{ 'ordering-question__item--dragging': draggedOrderingIndex === itemIndex }"
                  draggable="true"
                  @dragstart="startOrderingDrag(itemIndex)"
                  @dragover.prevent
                  @drop="dropOrderingItem(currentQuestion, itemIndex)"
                  @dragend="endOrderingDrag"
                >
                  <span class="ordering-question__position">{{ itemIndex + 1 }}</span>
                  <span class="ordering-question__handle" aria-hidden="true">⋮⋮</span>
                  <strong>{{ item.text }}</strong>
                  <div class="ordering-question__controls">
                    <button
                      type="button"
                      :disabled="itemIndex === 0"
                      :aria-label="`Mover ${item.text} arriba`"
                      @click="moveOrderingAnswer(currentQuestion, itemIndex, -1)"
                    >↑</button>
                    <button
                      type="button"
                      :disabled="itemIndex === getOrderingAnswer(currentQuestion).length - 1"
                      :aria-label="`Mover ${item.text} abajo`"
                      @click="moveOrderingAnswer(currentQuestion, itemIndex, 1)"
                    >↓</button>
                  </div>
                </article>
              </div>

              <div class="ordering-question__footer">
                <button type="button" class="interactive-secondary" @click="resetOrderingAnswer(currentQuestion)">Restablecer mezcla</button>
                <button type="button" class="interactive-primary" @click="confirmOrderingAnswer(currentQuestion)">✓ Confirmar este orden</button>
              </div>
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
              <strong>Pregunta abierta</strong>
              <span>Escribe tu respuesta para continuar.</span>
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
            </div>
          </Transition>
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
const draggedOrderingIndex = ref(null)

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

const normalizeQuestionType = value => {
  const raw = String(value ?? '').trim().toLowerCase()

  const aliases = {
    single: 'single_choice',
    single_choice: 'single_choice',
    singlechoice: 'single_choice',
    choice: 'single_choice',
    radio: 'single_choice',
    multiple: 'multiple_choice',
    multiple_choice: 'multiple_choice',
    multiplechoice: 'multiple_choice',
    checkbox: 'multiple_choice',
    checkboxes: 'multiple_choice',
    truefalse: 'true_false',
    true_false: 'true_false',
    boolean: 'true_false',
    verdadero_falso: 'true_false',
    short: 'short_answer',
    short_answer: 'short_answer',
    shortanswer: 'short_answer',
    text: 'short_answer',
    text_answer: 'short_answer',
    input: 'short_answer',
    essay: 'essay',
    long_answer: 'essay',
    longanswer: 'essay',
    development: 'essay',
    desarrollo: 'essay',
    matching: 'matching',
    match: 'matching',
    pairs: 'matching',
    emparejamiento: 'matching',
    ordering: 'ordering',
    order: 'ordering',
    sort: 'ordering',
    ranking: 'ordering',
    ordenamiento: 'ordering',
    audio_choice: 'audio_choice',
    audio: 'audio_choice',
  }

  return aliases[raw] || raw
}

const normalizeStudentQuestion =
  question => {
    const options =
      Array.isArray(
        question?.options,
      )
        ? question.options
        : []

    const rawType =
      question?.type ??
      question?.questionType ??
      question?.question_type ??
      ''

    let normalizedType =
      normalizeQuestionType(rawType)

    // Compatibilidad con preguntas antiguas que no guardaron el tipo
    // estándar. Si existen opciones, se muestran como selección única;
    // si el formato usa el separador de pares, se interpreta como matching.
    if (!['single_choice','multiple_choice','true_false','short_answer','essay','matching','ordering','audio_choice'].includes(normalizedType)) {
      const optionTexts = options.map(option =>
        String(option?.text ?? option?.optionText ?? option?.option_text ?? '')
      )
      if (optionTexts.some(text => text.includes('|||'))) {
        normalizedType = 'matching'
      } else if (options.length > 0) {
        normalizedType = 'single_choice'
      } else {
        normalizedType = 'short_answer'
      }
    }

    return {
      ...question,

      id:
        Number(
          question?.id,
        ),

      type:
        normalizedType,

      questionType:
        normalizedType,

      prompt:
        question?.prompt ??
        question?.question ??
        '',

      mediaType:
        question?.mediaType ??
        question?.media_type ??
        'none',

      mediaUrl:
        question?.mediaUrl ??
        question?.media_url ??
        '',

      points:
        Number(
          question?.points ??
          0,
        ),

      required:
        Boolean(
          question?.required,
        ),

      autoGradable:
        Boolean(
          question?.autoGradable ??
          question?.auto_gradable,
        ),

      options:
        options
          .map(
            option => ({
              ...option,

              id:
                Number(
                  option?.id,
                ),

              text:
                option?.text ??
                option?.optionText ??
                option?.option_text ??
                '',

              position:
                Number(
                  option?.position ??
                  0,
                ),
            }),
          )
          .sort(
            (a, b) =>
              Number(
                a.position,
              ) -
              Number(
                b.position,
              ),
          ),
    }
  }

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
              .map(
                normalizeStudentQuestion,
              )
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

const questionTypeLabel = type => ({
  single_choice: 'Selección única',
  multiple_choice: 'Selección múltiple',
  true_false: 'Verdadero / falso',
  short_answer: 'Respuesta corta',
  essay: 'Desarrollo',
  matching: 'Emparejamiento',
  ordering: 'Ordenamiento',
  audio_choice: 'Escucha y responde',
}[type] || 'Pregunta')

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
  if (!question || !answer) return false

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

  if ([
    'single_choice',
    'multiple_choice',
    'true_false',
    'audio_choice',
  ].includes(questionType)) {
    return Array.isArray(selectedOptionIds) && selectedOptionIds.length > 0
  }

  if (['short_answer', 'short', 'essay'].includes(questionType)) {
    return Boolean(String(textAnswer || '').trim())
  }

  if (questionType === 'matching') {
    let parsed = null
    try { parsed = JSON.parse(String(textAnswer || '')) } catch { parsed = null }
    const pairs = getMatchingPairs(question)
    if (parsed?.kind !== 'matching' || !pairs.length) return false
    const values = pairs.map(pair => String(parsed.matches?.[pair.left] || '').trim())
    return values.every(Boolean) && new Set(values).size === values.length
  }

  if (questionType === 'ordering') {
    let parsed = null
    try { parsed = JSON.parse(String(textAnswer || '')) } catch { parsed = null }
    return parsed?.kind === 'ordering' &&
      parsed?.confirmed === true &&
      Array.isArray(parsed.items) &&
      parsed.items.length === (question?.options || []).length
  }

  return Boolean(
    (Array.isArray(selectedOptionIds) && selectedOptionIds.length > 0) ||
    String(textAnswer || '').trim(),
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
   EMPAREJAMIENTO · V9
========================================================= */

const parseMatchingOption = option => {
  const raw = String(
    option?.text ?? option?.optionText ?? option?.option_text ?? '',
  )
  const separatorIndex = raw.indexOf('|||')

  if (option?.left && option?.right) {
    return {
      left: String(option.left).trim(),
      right: String(option.right).trim(),
    }
  }

  if (separatorIndex < 0) {
    return { left: raw.trim(), right: raw.trim() }
  }

  return {
    left: raw.slice(0, separatorIndex).trim(),
    right: raw.slice(separatorIndex + 3).trim(),
  }
}

const getMatchingPairs = question =>
  (question?.options || [])
    .map(parseMatchingOption)
    .filter(pair => pair.left && pair.right)

const stableShuffle = (values, seedValue = 1) => {
  const result = [...values]
  let seed = Math.max(1, Number(seedValue) || 1)
  for (let index = result.length - 1; index > 0; index -= 1) {
    seed = (seed * 9301 + 49297) % 233280
    const target = Math.floor((seed / 233280) * (index + 1))
    ;[result[index], result[target]] = [result[target], result[index]]
  }
  return result
}

const getMatchingChoices = question => {
  const choices = getMatchingPairs(question).map(pair => pair.right)
  return stableShuffle(choices, Number(question?.id) + 17)
}

const readStructuredAnswer = questionId => {
  const raw = getAnswer(questionId).textAnswer
  if (!raw) return null
  try { return JSON.parse(raw) } catch { return null }
}

const getMatchingSelection = (questionId, left) => {
  const parsed = readStructuredAnswer(questionId)
  return parsed?.kind === 'matching' ? parsed.matches?.[left] || '' : ''
}

const getMatchingCompletedCount = question =>
  getMatchingPairs(question).filter(pair =>
    Boolean(getMatchingSelection(question.id, pair.left)),
  ).length

const isMatchingChoiceUsed = (question, currentLeft, choice) => {
  const parsed = readStructuredAnswer(question.id)
  if (parsed?.kind !== 'matching') return false
  return Object.entries(parsed.matches || {}).some(([left, selected]) =>
    left !== currentLeft && selected === choice,
  )
}

const updateMatchingSelection = (question, left, value) => {
  const current = readStructuredAnswer(question.id)
  const matches = {
    ...(current?.kind === 'matching' ? current.matches : {}),
  }

  const normalizedValue = String(value || '')
  if (normalizedValue) {
    Object.keys(matches).forEach(key => {
      if (key !== left && matches[key] === normalizedValue) matches[key] = ''
    })
  }
  matches[left] = normalizedValue

  answers.value = {
    ...answers.value,
    [question.id]: {
      ...getAnswer(question.id),
      textAnswer: JSON.stringify({ kind: 'matching', matches }),
    },
  }
  scheduleAnswerSave(question.id, 200)
}

/* =========================================================
   ORDENAR · V9
========================================================= */

const makeInitialOrdering = question => {
  const base = (question?.options || []).map(option => ({
    id: Number(option.id),
    text: option.text,
  }))
  const mixed = stableShuffle(base, Number(question?.id) + 31)

  // Garantiza que no se muestre accidentalmente el orden correcto.
  if (mixed.length > 1 && mixed.every((item, index) => item.id === base[index]?.id)) {
    mixed.push(mixed.shift())
  }
  return mixed
}

const getOrderingAnswer = question => {
  const parsed = readStructuredAnswer(question.id)
  if (parsed?.kind === 'ordering' && Array.isArray(parsed.items)) return parsed.items
  return makeInitialOrdering(question)
}

const persistOrderingState = (question, items, confirmed = false) => {
  answers.value = {
    ...answers.value,
    [question.id]: {
      ...getAnswer(question.id),
      textAnswer: JSON.stringify({ kind: 'ordering', items, confirmed }),
    },
  }
  scheduleAnswerSave(question.id, 200)
}

const moveOrderingAnswer = (question, index, direction) => {
  const items = [...getOrderingAnswer(question)]
  const target = index + direction
  if (target < 0 || target >= items.length) return
  const [item] = items.splice(index, 1)
  items.splice(target, 0, item)
  persistOrderingState(question, items, false)
}

const startOrderingDrag = index => {
  draggedOrderingIndex.value = index
}

const endOrderingDrag = () => {
  draggedOrderingIndex.value = null
}

const dropOrderingItem = (question, targetIndex) => {
  const sourceIndex = draggedOrderingIndex.value
  if (sourceIndex === null || sourceIndex === targetIndex) {
    endOrderingDrag()
    return
  }
  const items = [...getOrderingAnswer(question)]
  const [item] = items.splice(sourceIndex, 1)
  items.splice(targetIndex, 0, item)
  persistOrderingState(question, items, false)
  endOrderingDrag()
}

const resetOrderingAnswer = question => {
  persistOrderingState(question, makeInitialOrdering(question), false)
}

const confirmOrderingAnswer = question => {
  persistOrderingState(question, [...getOrderingAnswer(question)], true)
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



/* =========================================================
   V7.5 · SUBMIT MODAL FIX
   El modal usa Teleport a <body>, por eso NO hereda las
   variables CSS definidas dentro de .quiz-page.
   Aquí usamos colores directos para asegurar contraste real.
========================================================= */

.modal-backdrop {
  position: fixed !important;
  z-index: 9999 !important;
  inset: 0 !important;
  display: grid !important;
  place-items: center !important;
  padding: 22px !important;
  overflow-y: auto !important;
  background: rgba(15, 23, 42, .56) !important;
  backdrop-filter: blur(12px) !important;
}

.submit-dialog {
  position: relative !important;
  width: min(620px, 100%) !important;
  max-height: calc(100dvh - 44px) !important;
  overflow-y: auto !important;
  padding: 30px !important;
  border: 1px solid #dbe3ec !important;
  border-radius: 22px !important;
  color: #152033 !important;
  background:
    radial-gradient(circle at 95% 3%, rgba(217,169,29,.10), transparent 28%),
    #ffffff !important;
  box-shadow: 0 34px 90px rgba(15, 23, 42, .24) !important;
}

.submit-dialog::before {
  position: absolute !important;
  top: 0 !important;
  left: 0 !important;
  width: 122px !important;
  height: 3px !important;
  content: '' !important;
  background: linear-gradient(90deg, #9f1945, #d9a91d) !important;
}

.submit-dialog__icon {
  display: grid !important;
  width: 54px !important;
  height: 54px !important;
  place-items: center !important;
  margin-bottom: 18px !important;
  border: 1px solid #bfe0cd !important;
  border-radius: 15px !important;
  color: #ffffff !important;
  background: #2d8a63 !important;
  box-shadow: 0 8px 20px rgba(45, 138, 99, .15) !important;
  font-size: 1rem !important;
  font-weight: 900 !important;
}

.submit-dialog__eyebrow {
  display: block !important;
  margin-bottom: 6px !important;
  color: #987000 !important;
  font-size: .58rem !important;
  font-weight: 900 !important;
  letter-spacing: .13em !important;
}

.submit-dialog h2 {
  margin: 0 !important;
  color: #152033 !important;
  font-size: clamp(1.75rem, 4vw, 2.45rem) !important;
  line-height: 1.08 !important;
  letter-spacing: -.035em !important;
}

.submit-dialog > p {
  margin: 11px 0 0 !important;
  color: #6f7c8f !important;
  font-size: .78rem !important;
  line-height: 1.65 !important;
}

.submit-dialog > p strong {
  color: #344359 !important;
  font-weight: 900 !important;
}

/* Estados */
.submit-warning,
.submit-notice,
.submit-success {
  margin-top: 18px !important;
  padding: 15px 16px !important;
  border-radius: 13px !important;
}

.submit-warning {
  border: 1px solid #ead79c !important;
  background: #fff8e7 !important;
}

.submit-warning strong {
  display: block !important;
  color: #8a6500 !important;
  font-size: .72rem !important;
}

.submit-warning p {
  margin: 5px 0 0 !important;
  color: #7b704f !important;
  font-size: .65rem !important;
  line-height: 1.5 !important;
}

.submit-notice {
  border: 1px solid #d7e2ed !important;
  color: #456a95 !important;
  background: #eef5fc !important;
  font-size: .7rem !important;
  font-weight: 750 !important;
}

.submit-success {
  border: 1px solid #c7e0d2 !important;
  background: #edf8f3 !important;
}

.submit-success strong {
  display: block !important;
  color: #2d8a63 !important;
  font-size: .78rem !important;
  font-weight: 900 !important;
}

.submit-success p {
  margin: 5px 0 0 !important;
  color: #5c7868 !important;
  font-size: .65rem !important;
  line-height: 1.5 !important;
}

/* Footer de acciones */
.submit-dialog__actions {
  display: grid !important;
  grid-template-columns: 1fr 1.15fr !important;
  gap: 10px !important;
  margin-top: 22px !important;
  padding-top: 18px !important;
  border-top: 1px solid #e7ecf1 !important;
}

.submit-dialog__actions .button {
  display: inline-flex !important;
  min-height: 48px !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 17px !important;
  border-radius: 10px !important;
  font-size: .7rem !important;
  font-weight: 900 !important;
  cursor: pointer !important;
  transition:
    transform .18s ease,
    box-shadow .18s ease,
    background .18s ease !important;
}

.submit-dialog__actions .button--secondary {
  border: 1px solid #cbd6e2 !important;
  color: #344359 !important;
  background: #ffffff !important;
}

.submit-dialog__actions .button--secondary:hover:not(:disabled) {
  border-color: #b7c4d2 !important;
  background: #f8fafc !important;
}

.submit-dialog__actions .button--primary {
  border: 1px solid #9f1945 !important;
  color: #ffffff !important;
  background: #9f1945 !important;
  box-shadow: 0 8px 20px rgba(159,25,69,.14) !important;
}

.submit-dialog__actions .button--primary:hover:not(:disabled) {
  background: #7f1237 !important;
  transform: translateY(-1px) !important;
}

.submit-dialog__actions .button:disabled {
  border-color: #d8dee5 !important;
  color: #9aa4b0 !important;
  background: #edf1f5 !important;
  box-shadow: none !important;
  cursor: not-allowed !important;
}

/* Evita que estilos globales de la web pública coloreen el modal */
.submit-dialog,
.submit-dialog * {
  text-shadow: none !important;
}

@media (max-width: 600px) {
  .modal-backdrop {
    align-items: end !important;
    padding: 10px !important;
  }

  .submit-dialog {
    width: 100% !important;
    max-height: 92dvh !important;
    padding: 22px !important;
    border-radius: 20px 20px 14px 14px !important;
  }

  .submit-dialog__actions {
    grid-template-columns: 1fr !important;
  }

  .submit-dialog__actions .button--primary {
    order: -1 !important;
  }
}



/* =========================================================
   V7.6 · RESULT NEXT STEP · PREMIUM LIGHT
   Corrige el último bloque oscuro de la pantalla de resultado.
========================================================= */

.result-next-step {
  width: min(900px, 100%) !important;
  margin-top: 1rem !important;
  padding: clamp(1.15rem, 3vw, 1.5rem) !important;
  border: 1px solid #dbe3ec !important;
  border-radius: 18px !important;
  background:
    radial-gradient(circle at 96% 4%, rgba(217,169,29,.08), transparent 32%),
    #ffffff !important;
  box-shadow: 0 10px 28px rgba(31, 48, 73, .045) !important;
  text-align: left !important;
}

.result-next-step__copy > span {
  color: #987000 !important;
  font-size: .58rem !important;
  font-weight: 900 !important;
  letter-spacing: .12em !important;
}

.result-next-step__copy h2 {
  margin: .35rem 0 0 !important;
  color: #152033 !important;
  font-size: clamp(1.35rem, 3vw, 1.85rem) !important;
  line-height: 1.14 !important;
  letter-spacing: -.025em !important;
}

.result-next-step__copy p {
  max-width: 760px !important;
  margin: .5rem 0 0 !important;
  color: #6f7c8f !important;
  font-size: .72rem !important;
  line-height: 1.6 !important;
}

.result-next-step__actions {
  display: grid !important;
  gap: .7rem !important;
  grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
  margin-top: 1.05rem !important;
}

.result-action {
  display: grid !important;
  min-height: 88px !important;
  gap: .75rem !important;
  grid-template-columns: auto minmax(0,1fr) auto !important;
  align-items: center !important;
  padding: .9rem !important;
  border: 1px solid #dfe5ec !important;
  border-radius: 13px !important;
  color: #152033 !important;
  background: #f8fafc !important;
  text-decoration: none !important;
  box-shadow: none !important;
  transition:
    border-color .18s ease,
    background .18s ease,
    box-shadow .18s ease,
    transform .18s ease !important;
}

.result-action:hover {
  border-color: #c9d5e0 !important;
  background: #ffffff !important;
  box-shadow: 0 7px 20px rgba(31,48,73,.045) !important;
  transform: translateY(-1px) !important;
}

.result-action--primary {
  border-color: #e5cf82 !important;
  background: #fff8e7 !important;
}

.result-action--primary:hover {
  border-color: #d7b02f !important;
  background: #fffaf0 !important;
}

.result-action__icon {
  display: grid !important;
  width: 42px !important;
  height: 42px !important;
  place-items: center !important;
  border: 1px solid #e4cf86 !important;
  border-radius: 12px !important;
  color: #987000 !important;
  background: #fff8e7 !important;
  font-weight: 900 !important;
}

.result-action--primary .result-action__icon {
  border-color: #d8b22e !important;
  color: #775900 !important;
  background: #f3d15d !important;
}

.result-action small,
.result-action strong {
  display: block !important;
}

.result-action small {
  margin-bottom: .2rem !important;
  color: #8b98aa !important;
  font-size: .52rem !important;
  font-weight: 900 !important;
  letter-spacing: .08em !important;
}

.result-action strong {
  color: #26364f !important;
  font-size: .78rem !important;
  line-height: 1.35 !important;
}

.result-action b {
  color: #9f1945 !important;
  font-size: .9rem !important;
}

.result-action--primary b {
  color: #987000 !important;
}

@media (max-width: 760px) {
  .result-next-step__actions {
    grid-template-columns: 1fr !important;
  }

  .result-action {
    min-height: 76px !important;
  }
}



/* =========================================================
   V8 · EVALUACIÓN FLUIDA · PREMIUM MOTION SYSTEM
   Visual-only enhancement. Business logic preserved.
========================================================= */

.quiz-page {
  --quiz-motion-fast: 160ms;
  --quiz-motion: 280ms;
  --quiz-motion-slow: 520ms;
  --quiz-ease: cubic-bezier(.2,.75,.2,1);
  --quiz-wine-rgb: 159,25,69;
  --quiz-gold-rgb: 217,169,29;
  position: relative;
  isolation: isolate;
  min-width: 0;
}

.quiz-page::before,
.quiz-page::after {
  position: fixed;
  z-index: -1;
  width: 42vw;
  height: 42vw;
  max-width: 620px;
  max-height: 620px;
  content: '';
  pointer-events: none;
  filter: blur(54px);
  opacity: .24;
  transform: translate3d(0,0,0);
  animation: quizAmbientDrift 14s ease-in-out infinite alternate;
}

.quiz-page::before {
  top: 6rem;
  left: -22rem;
  background: radial-gradient(circle, rgba(var(--quiz-wine-rgb),.2), transparent 68%);
}

.quiz-page::after {
  right: -20rem;
  bottom: 8rem;
  background: radial-gradient(circle, rgba(var(--quiz-gold-rgb),.23), transparent 68%);
  animation-delay: -5s;
}

@keyframes quizAmbientDrift {
  0% {
    transform: translate3d(0, 0, 0) scale(1);
  }
  100% {
    transform: translate3d(2.5rem, -1.25rem, 0) scale(1.08);
  }
}

/* =========================================================
   TOPBAR — minimal
========================================================= */

.quiz-topbar {
  min-height: 40px;
  margin-bottom: 10px !important;
}

.quiz-back {
  position: relative;
  padding: 7px 10px;
  border-radius: 999px;
  transition:
    color var(--quiz-motion-fast) ease,
    background var(--quiz-motion-fast) ease,
    transform var(--quiz-motion-fast) var(--quiz-ease);
}

.quiz-back:hover {
  background: rgba(159,25,69,.055);
  transform: translateX(-2px);
}

/* =========================================================
   HERO — compacto, vivo y enfocado
========================================================= */

.quiz-hero {
  min-height: 0;
  margin-bottom: 10px !important;
  padding: clamp(16px, 2.2vw, 24px) clamp(18px, 2.8vw, 28px) !important;
  border-radius: 24px !important;
  background:
    radial-gradient(circle at 93% 12%, rgba(217,169,29,.16), transparent 22%),
    radial-gradient(circle at 78% 100%, rgba(159,25,69,.055), transparent 30%),
    linear-gradient(135deg, #fff 0%, #fbfcfe 56%, #fffaf0 100%) !important;
  box-shadow:
    0 18px 45px rgba(31,48,73,.055),
    inset 0 1px 0 rgba(255,255,255,.95);
  transition:
    transform var(--quiz-motion) var(--quiz-ease),
    box-shadow var(--quiz-motion) ease;
}

.quiz-hero:hover {
  transform: translateY(-2px);
  box-shadow:
    0 22px 55px rgba(31,48,73,.08),
    inset 0 1px 0 rgba(255,255,255,.98);
}

.quiz-hero::after {
  position: absolute;
  top: -70px;
  right: -70px;
  width: 190px;
  height: 190px;
  content: '';
  border: 1px solid rgba(217,169,29,.22);
  border-radius: 50%;
  opacity: .5;
  animation: quizOrbit 10s linear infinite;
}

@keyframes quizOrbit {
  to {
    transform: rotate(360deg);
  }
}

.quiz-hero__eyebrow {
  margin-bottom: 8px !important;
}

.quiz-hero__eyebrow span {
  transition:
    transform var(--quiz-motion-fast) var(--quiz-ease),
    box-shadow var(--quiz-motion-fast) ease;
}

.quiz-hero__eyebrow span:hover {
  transform: translateY(-1px);
  box-shadow: 0 5px 12px rgba(217,169,29,.1);
}

.quiz-hero h1 {
  max-width: 860px !important;
  font-size: clamp(1.9rem, 3.55vw, 3rem) !important;
  line-height: 1.02 !important;
}

.quiz-hero__main > p {
  max-width: 700px !important;
  margin-top: 8px !important;
}

.assessment-purpose {
  max-width: 760px;
  margin-top: 10px !important;
  padding: 10px 12px !important;
  border-radius: 14px !important;
  transition:
    transform var(--quiz-motion-fast) var(--quiz-ease),
    box-shadow var(--quiz-motion-fast) ease;
}

.assessment-purpose:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(31,48,73,.04);
}

.quiz-hero__meta {
  margin-top: 10px !important;
}

.timer-card {
  min-width: 148px !important;
  border-radius: 18px !important;
  transition:
    transform var(--quiz-motion) var(--quiz-ease),
    box-shadow var(--quiz-motion) ease;
}

.timer-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 26px rgba(217,169,29,.12) !important;
}

.timer-card strong {
  font-variant-numeric: tabular-nums;
}

/* Distinción de tipo */
.quiz-page--test .quiz-hero {
  background:
    radial-gradient(circle at 93% 12%, rgba(159,25,69,.12), transparent 24%),
    radial-gradient(circle at 78% 100%, rgba(217,169,29,.08), transparent 28%),
    linear-gradient(135deg, #fff 0%, #fcfafb 60%, #fffaf0 100%) !important;
}

.quiz-page--test .quiz-hero::before {
  background: linear-gradient(90deg, var(--quiz-wine), var(--quiz-gold));
}

/* =========================================================
   PROGRESO + NAVEGACIÓN RÁPIDA
========================================================= */

.quiz-progress {
  position: sticky;
  top: 8px;
  z-index: 30;
  margin-bottom: 12px !important;
  padding: 12px 14px !important;
  border-radius: 18px !important;
  backdrop-filter: blur(18px);
  box-shadow:
    0 12px 30px rgba(31,48,73,.045),
    0 0 0 1px rgba(255,255,255,.55) inset;
}

.quiz-progress__heading {
  margin-bottom: 7px !important;
}

.quiz-progress__bar {
  height: 6px !important;
  margin-top: 7px !important;
}

.quiz-progress__bar span {
  position: relative;
  background: linear-gradient(90deg, #a61648 0%, #c52c66 48%, #d9a91d 100%) !important;
  box-shadow: 0 0 14px rgba(159,25,69,.16);
  transition: width .46s var(--quiz-ease) !important;
}

.quiz-progress__bar span::after {
  position: absolute;
  top: 50%;
  right: 0;
  width: 10px;
  height: 10px;
  content: '';
  border-radius: 50%;
  background: #fff;
  box-shadow:
    0 0 0 2px rgba(217,169,29,.4),
    0 0 14px rgba(217,169,29,.28);
  transform: translate(50%,-50%);
}

.quiz-progress__question-map {
  display: grid;
  gap: 9px;
  grid-template-columns: auto minmax(0,1fr) auto;
  align-items: center;
  margin-top: 10px;
  padding-top: 9px;
  border-top: 1px solid rgba(219,227,236,.9);
}

.quiz-progress__question-meta {
  display: flex;
  min-width: 56px;
  gap: 2px;
  flex-direction: column;
}

.quiz-progress__question-meta span {
  color: #987000;
  font-size: .5rem;
  font-weight: 900;
  letter-spacing: .1em;
}

.quiz-progress__question-meta strong {
  color: #152033;
  font-size: .74rem;
  font-variant-numeric: tabular-nums;
}

.quiz-progress__question-track {
  display: flex;
  min-width: 0;
  gap: 7px;
  overflow-x: auto;
  padding: 2px 1px 4px;
  scrollbar-width: thin;
  overscroll-behavior-inline: contain;
}

.quiz-progress__question-track::-webkit-scrollbar {
  height: 4px;
}

.quiz-progress__question-track::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(152,112,0,.2);
}

.quiz-quick-dot {
  position: relative;
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  place-items: center;
  padding: 0;
  border: 1px solid #d7e0e8;
  border-radius: 12px;
  color: #708096;
  background: rgba(248,250,252,.96);
  font: inherit;
  font-size: .62rem;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform var(--quiz-motion-fast) var(--quiz-ease),
    border-color var(--quiz-motion-fast) ease,
    background var(--quiz-motion-fast) ease,
    color var(--quiz-motion-fast) ease,
    box-shadow var(--quiz-motion-fast) ease;
}

.quiz-quick-dot i {
  position: absolute;
  right: 2px;
  bottom: 2px;
  font-size: .43rem;
  font-style: normal;
}

.quiz-quick-dot:hover {
  transform: translateY(-2px);
  border-color: #d0af42;
  color: #765a00;
  background: #fffaf0;
  box-shadow: 0 7px 16px rgba(31,48,73,.08);
}

.quiz-quick-dot--answered {
  border-color: #b9dcc9;
  color: #2d8a63;
  background: #f0f9f4;
}

.quiz-quick-dot--current {
  border-color: var(--quiz-wine);
  color: #fff;
  background: linear-gradient(135deg, #9f1945, #b42d5d);
  box-shadow:
    0 8px 18px rgba(159,25,69,.18),
    0 0 0 3px rgba(159,25,69,.07);
  animation: quickCurrentPulse 2.8s ease-in-out infinite;
}

.quiz-quick-dot--current.quiz-quick-dot--answered {
  border-color: var(--quiz-wine);
  color: #fff;
  background: linear-gradient(135deg, #9f1945, #b42d5d);
}

@keyframes quickCurrentPulse {
  0%, 100% {
    box-shadow:
      0 8px 18px rgba(159,25,69,.17),
      0 0 0 3px rgba(159,25,69,.06);
  }
  50% {
    box-shadow:
      0 9px 22px rgba(159,25,69,.22),
      0 0 0 5px rgba(159,25,69,.025);
  }
}

.quiz-progress__question-hint {
  display: flex;
  gap: 4px;
  align-items: center;
  color: #8390a2;
  font-size: .5rem;
  white-space: nowrap;
}

.quiz-progress__question-hint span:nth-child(1) {
  color: #2d8a63;
}

.quiz-progress__question-hint span:nth-child(3) {
  color: #b3bfca;
  margin-left: 4px;
}

/* =========================================================
   MAIN LAYOUT
========================================================= */

.quiz-layout {
  gap: 13px !important;
}

.question-panel {
  border-radius: 22px !important;
  box-shadow:
    0 16px 36px rgba(31,48,73,.055),
    0 0 0 1px rgba(255,255,255,.65) inset !important;
  transition:
    transform var(--quiz-motion) var(--quiz-ease),
    box-shadow var(--quiz-motion) ease;
}

.question-panel:hover {
  transform: translateY(-1px);
  box-shadow:
    0 20px 44px rgba(31,48,73,.07),
    0 0 0 1px rgba(255,255,255,.78) inset !important;
}

.question-stage {
  min-width: 0;
}

.question-header {
  padding: 14px 18px !important;
  background:
    linear-gradient(135deg, rgba(255,255,255,.98), rgba(248,250,252,.95)) !important;
}

.question-header::before {
  position: absolute;
  left: 0;
  width: 80px;
  height: 2px;
  content: '';
  background: linear-gradient(90deg, var(--quiz-wine), var(--quiz-gold));
}

.question-header {
  position: relative;
}

.question-content {
  min-height: 350px !important;
  padding: clamp(20px, 2.6vw, 30px) !important;
}

.question-content h2 {
  margin-bottom: 15px !important;
  font-size: clamp(1.38rem, 2.65vw, 2.08rem) !important;
}

.option-card {
  min-height: 66px !important;
  padding: 12px 14px !important;
  border-radius: 16px !important;
  background:
    linear-gradient(180deg, #fff 0%, #fbfcfe 100%) !important;
  transform: translate3d(0,0,0);
  will-change: transform;
  transition:
    transform var(--quiz-motion) var(--quiz-ease),
    border-color var(--quiz-motion-fast) ease,
    background var(--quiz-motion-fast) ease,
    box-shadow var(--quiz-motion) ease !important;
}

.option-card:hover {
  transform: translate3d(0,-3px,0) scale(1.005) !important;
  border-color: #d5b34b !important;
  box-shadow:
    0 11px 24px rgba(31,48,73,.075),
    0 0 0 3px rgba(217,169,29,.035);
}

.option-card--selected {
  transform: translate3d(0,-2px,0) !important;
  border-color: #cda82a !important;
  background:
    linear-gradient(135deg, #fffaf0, #fff 78%) !important;
  box-shadow:
    0 10px 24px rgba(217,169,29,.09),
    inset 0 0 0 1px rgba(217,169,29,.08) !important;
}

.option-card__marker {
  transition:
    transform var(--quiz-motion-fast) var(--quiz-ease),
    background var(--quiz-motion-fast) ease,
    border-color var(--quiz-motion-fast) ease;
}

.option-card:hover .option-card__marker,
.option-card--selected .option-card__marker {
  transform: scale(1.05);
}

.option-card--selected .option-card__marker {
  animation: answerMarkerPop .34s var(--quiz-ease);
}

@keyframes answerMarkerPop {
  0% { transform: scale(.84); }
  65% { transform: scale(1.11); }
  100% { transform: scale(1.05); }
}

/* Transition between questions */
.quiz-question-enter-active,
.quiz-question-leave-active {
  transition:
    opacity var(--quiz-motion) ease,
    transform var(--quiz-motion) var(--quiz-ease),
    filter var(--quiz-motion) ease;
}

.quiz-question-enter-from {
  opacity: 0;
  transform: translate3d(18px, 0, 0);
  filter: blur(3px);
}

.quiz-question-leave-to {
  opacity: 0;
  transform: translate3d(-18px, 0, 0);
  filter: blur(3px);
}

.question-stage {
  backface-visibility: hidden;
}

/* Navigation buttons */
.question-actions .button {
  border-radius: 13px !important;
  transition:
    transform var(--quiz-motion-fast) var(--quiz-ease),
    box-shadow var(--quiz-motion-fast) ease,
    background var(--quiz-motion-fast) ease;
}

.question-actions .button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.question-actions .button--primary {
  box-shadow: 0 10px 22px rgba(159,25,69,.13) !important;
}

.question-actions .button--primary:hover:not(:disabled) {
  box-shadow: 0 13px 25px rgba(159,25,69,.2) !important;
}

/* =========================================================
   SIDEBAR — complementar, no protagonista
========================================================= */

.question-sidebar {
  gap: 10px !important;
}

.question-sidebar .navigator-card,
.question-sidebar .summary-card,
.question-sidebar .autosave-card {
  border-radius: 18px !important;
  transition:
    transform var(--quiz-motion) var(--quiz-ease),
    box-shadow var(--quiz-motion) ease;
}

.question-sidebar .navigator-card:hover,
.question-sidebar .summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 13px 28px rgba(31,48,73,.065);
}

.question-dot {
  border-radius: 13px !important;
  transition:
    transform var(--quiz-motion-fast) var(--quiz-ease),
    box-shadow var(--quiz-motion-fast) ease,
    background var(--quiz-motion-fast) ease,
    border-color var(--quiz-motion-fast) ease !important;
}

.question-dot:hover {
  transform: translateY(-2px);
}

.submit-sidebar-button {
  border-radius: 13px !important;
  transition:
    transform var(--quiz-motion-fast) var(--quiz-ease),
    box-shadow var(--quiz-motion-fast) ease,
    background var(--quiz-motion-fast) ease !important;
}

.submit-sidebar-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 13px 24px rgba(159,25,69,.18);
}

/* =========================================================
   RESULTADO / CARGA
========================================================= */

.result-screen {
  position: relative;
  overflow: hidden;
  padding: clamp(1.25rem, 3vw, 2rem);
}

.result-screen::before {
  position: absolute;
  top: -90px;
  right: -90px;
  width: 220px;
  height: 220px;
  content: '';
  border: 1px solid rgba(217,169,29,.18);
  border-radius: 50%;
  animation: quizOrbit 12s linear infinite;
}

.result-score > div,
.result-guidance > div,
.result-learning-box,
.result-notice,
.result-next-step,
.result-action,
.result-learning-summary {
  transition:
    transform var(--quiz-motion) var(--quiz-ease),
    box-shadow var(--quiz-motion) ease,
    border-color var(--quiz-motion-fast) ease;
}

.result-score > div:hover,
.result-guidance > div:hover,
.result-action:hover,
.result-learning-summary:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(31,48,73,.07);
}

.result-screen__icon {
  animation:
    resultPop .65s var(--quiz-ease) both,
    resultGlow 3.2s ease-in-out 1s infinite;
}

@keyframes resultPop {
  from {
    opacity: 0;
    transform: scale(.72);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes resultGlow {
  50% {
    box-shadow: 0 0 0 8px rgba(45,138,99,.045);
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 1000px) {
  .quiz-progress {
    position: sticky;
    top: 6px;
  }
}

@media (max-width: 760px) {
  .quiz-page {
    padding:
      .55rem .65rem 3.25rem !important;
  }

  .quiz-topbar {
    min-height: 36px;
    margin-bottom: 7px !important;
  }

  .quiz-back {
    padding-inline: 4px;
  }

  .quiz-topbar__status {
    font-size: .56rem !important;
  }

  .quiz-hero {
    margin-bottom: 8px !important;
    padding: 15px 15px 14px !important;
    border-radius: 20px !important;
  }

  .quiz-hero h1 {
    font-size: clamp(1.65rem, 7vw, 2.35rem) !important;
    letter-spacing: -.035em;
  }

  .quiz-hero__main > p {
    font-size: .68rem !important;
  }

  .assessment-purpose {
    margin-top: 8px !important;
    padding: 9px 10px !important;
  }

  .assessment-purpose span {
    font-size: .67rem !important;
  }

  .quiz-hero__meta span {
    padding: 5px 8px !important;
  }

  .timer-card {
    width: 100%;
    min-height: 76px;
  }

  .quiz-progress {
    top: 4px;
    margin-bottom: 9px !important;
    padding: 10px !important;
    border-radius: 16px !important;
  }

  .quiz-progress__question-map {
    grid-template-columns: auto minmax(0,1fr);
    gap: 7px;
  }

  .quiz-progress__question-hint {
    display: none;
  }

  .quiz-quick-dot {
    width: 32px;
    height: 32px;
    flex-basis: 32px;
    border-radius: 10px;
  }

  .question-panel {
    border-radius: 19px !important;
  }

  .question-content {
    min-height: auto !important;
    padding: 18px 15px !important;
  }

  .question-content h2 {
    font-size: clamp(1.28rem, 6vw, 1.72rem) !important;
    line-height: 1.18 !important;
  }

  .option-card {
    min-height: 62px !important;
    border-radius: 15px !important;
    padding: 11px 12px !important;
  }

  .question-sidebar {
    display: none !important;
  }

  .question-actions {
    padding: 12px 14px !important;
  }

  .result-screen {
    border-radius: 20px !important;
  }

  .result-guidance,
  .result-score,
  .result-next-step__actions {
    grid-template-columns: 1fr !important;
  }

  .quiz-page::before,
  .quiz-page::after {
    width: 65vw;
    height: 65vw;
    filter: blur(42px);
    opacity: .18;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-page::before,
  .quiz-page::after,
  .quiz-hero::after,
  .quiz-quick-dot--current,
  .option-card--selected .option-card__marker,
  .result-screen__icon,
  .result-screen::before {
    animation: none !important;
  }

  .quiz-hero,
  .option-card,
  .quiz-quick-dot,
  .question-dot,
  .question-panel,
  .question-sidebar .navigator-card,
  .question-sidebar .summary-card,
  .result-score > div,
  .result-guidance > div,
  .result-action,
  .result-learning-summary {
    transition: none !important;
  }
}


@media (min-width: 1001px) {
  .question-sidebar .navigator-card {
    display: none !important;
  }
}

.quiz-page--quiz .quiz-quick-dot--current,
.quiz-page--quiz .quiz-quick-dot--current.quiz-quick-dot--answered {
  border-color: #c69c12;
  background: linear-gradient(135deg, #d3a51c, #e8c34f);
  color: #5e4600;
  box-shadow:
    0 8px 18px rgba(217,169,29,.2),
    0 0 0 3px rgba(217,169,29,.08);
}

.quiz-page--quiz .quiz-quick-dot--current {
  animation-name: quickCurrentPulseGold;
}

@keyframes quickCurrentPulseGold {
  0%, 100% {
    box-shadow:
      0 8px 18px rgba(217,169,29,.18),
      0 0 0 3px rgba(217,169,29,.06);
  }
  50% {
    box-shadow:
      0 9px 22px rgba(217,169,29,.26),
      0 0 0 5px rgba(217,169,29,.025);
  }
}


/* =========================================================
   V9 · AMV GAME MODE · COLOR + MOTION EXPERIENCE
   Inspirada en dinámicas de quiz visuales y juegos de respuesta,
   pero con identidad propia de AMO MI VOZ.
========================================================= */

.quiz-page {
  --game-wine: #a71952;
  --game-violet: #7657d7;
  --game-blue: #3d73c7;
  --game-teal: #2d9c8b;
  --game-gold: #e2b83e;
  --game-ink: #182238;
  --game-spring: cubic-bezier(.18,.82,.22,1);
  --game-pop: cubic-bezier(.17,1.35,.35,1);
  position: relative;
  overflow: clip;
}

/* Fondo vivo: luces que respiran lentamente. */
.quiz-page::before,
.quiz-page::after {
  opacity: .42 !important;
  filter: blur(62px) !important;
  animation-duration: 18s !important;
}

.quiz-page::before {
  background:
    radial-gradient(circle at 20% 30%, rgba(167,25,82,.15), transparent 34%),
    radial-gradient(circle at 75% 70%, rgba(118,87,215,.12), transparent 36%) !important;
}

.quiz-page::after {
  background:
    radial-gradient(circle at 28% 40%, rgba(61,115,199,.14), transparent 32%),
    radial-gradient(circle at 80% 60%, rgba(45,156,139,.11), transparent 34%) !important;
}

/* Textura de puntos para sensación de arena/juego. */
.quiz-page > .quiz-topbar,
.quiz-page > .quiz-hero,
.quiz-page > .quiz-progress,
.quiz-page > .quiz-layout,
.quiz-page > .result-screen,
.quiz-page > .quiz-state {
  position: relative;
  z-index: 1;
}

.quiz-page > .quiz-hero::after {
  width: 220px !important;
  height: 220px !important;
  border: 0 !important;
  opacity: .55 !important;
  background:
    radial-gradient(circle at center, rgba(226,184,62,.14), transparent 62%) !important;
  animation: gameOrbFloat 8s ease-in-out infinite !important;
}

@keyframes gameOrbFloat {
  0%, 100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(-18px, 10px, 0) scale(1.12); }
}

/* Hero compacto: menos portada, más acción inmediata. */
.quiz-hero {
  min-height: 0 !important;
  padding: 17px 20px !important;
  border-radius: 26px !important;
  border-color: #e5e9ef !important;
  background:
    linear-gradient(120deg, rgba(255,255,255,.98), rgba(255,252,245,.92)) !important;
  box-shadow:
    0 18px 44px rgba(24,34,56,.055),
    0 0 0 1px rgba(255,255,255,.96) inset !important;
}

.quiz-hero__main {
  position: relative;
  z-index: 2;
}

.quiz-hero__eyebrow span:first-child {
  border-color: rgba(167,25,82,.22) !important;
  color: var(--game-wine) !important;
  background: rgba(167,25,82,.055) !important;
}

.quiz-page--test .quiz-hero__eyebrow span:first-child {
  border-color: rgba(226,184,62,.38) !important;
  color: #8a6907 !important;
  background: rgba(226,184,62,.10) !important;
}

.quiz-hero h1 {
  font-size: clamp(1.75rem, 3vw, 2.9rem) !important;
  text-wrap: balance;
}

.quiz-hero__meta span {
  transition: transform .25s var(--game-spring), box-shadow .25s ease;
}

.quiz-hero__meta span:hover {
  transform: translateY(-2px) rotate(-.7deg);
  box-shadow: 0 8px 18px rgba(24,34,56,.08);
}

/* Barra de progreso tipo arena: brillante, con pulso y desplazamiento. */
.quiz-progress {
  overflow: hidden;
  border-radius: 22px !important;
  background: rgba(255,255,255,.90) !important;
  box-shadow:
    0 14px 32px rgba(24,34,56,.055),
    inset 0 1px 0 rgba(255,255,255,.96) !important;
}

.quiz-progress__bar {
  position: relative;
  overflow: visible !important;
  height: 9px !important;
  background: #ebeff4 !important;
}

.quiz-progress__bar span {
  background:
    linear-gradient(90deg,
      var(--game-wine) 0%,
      var(--game-violet) 36%,
      var(--game-blue) 68%,
      var(--game-teal) 100%) !important;
  box-shadow:
    0 0 14px rgba(118,87,215,.18),
    0 0 26px rgba(45,156,139,.11) !important;
}

.quiz-progress__bar span::before {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(110deg, transparent 0 30%, rgba(255,255,255,.42) 45%, transparent 58% 100%);
  background-size: 220% 100%;
  animation: progressShine 2.4s linear infinite;
}

@keyframes progressShine {
  from { background-position: 120% 0; }
  to { background-position: -120% 0; }
}

/* Mapa de preguntas: más parecido a un tablero de juego. */
.quiz-progress__question-map {
  margin-top: 8px !important;
  padding-top: 8px !important;
  border-top-color: #edf0f4 !important;
}

.quiz-quick-dot {
  overflow: hidden;
  border-radius: 13px !important;
  transition:
    transform .25s var(--game-spring),
    box-shadow .25s ease,
    border-color .22s ease,
    background .22s ease !important;
}

.quiz-quick-dot::before {
  position: absolute;
  inset: -30% auto auto -30%;
  width: 70%;
  height: 70%;
  content: '';
  border-radius: 50%;
  opacity: .18;
  filter: blur(8px);
  background: currentColor;
  transform: scale(.7);
  transition: transform .35s var(--game-spring);
}

.quiz-quick-dot:hover::before {
  transform: scale(1.25);
}

.quiz-quick-dot--tone-0 {
  --quick-tint: rgba(167,25,82,.055);
}

.quiz-quick-dot--tone-1 {
  --quick-tint: rgba(118,87,215,.06);
}

.quiz-quick-dot--tone-2 {
  --quick-tint: rgba(61,115,199,.06);
}

.quiz-quick-dot--tone-3 {
  --quick-tint: rgba(45,156,139,.06);
}

.quiz-quick-dot:not(.quiz-quick-dot--current):not(.quiz-quick-dot--answered) {
  background: linear-gradient(180deg, #fff, var(--quick-tint, #f8fafc)) !important;
}

.quiz-quick-dot:hover {
  transform: translateY(-4px) scale(1.04) rotate(-1deg) !important;
  box-shadow: 0 10px 20px rgba(24,34,56,.10) !important;
}

.quiz-quick-dot--current {
  transform: translateY(-2px) scale(1.05) !important;
  box-shadow:
    0 10px 20px rgba(167,25,82,.18),
    0 0 0 4px rgba(167,25,82,.055) !important;
  animation: gameCurrentBounce 2.2s var(--game-ease, ease-in-out) infinite;
}

@keyframes gameCurrentBounce {
  0%, 100% { transform: translateY(-2px) scale(1.05) rotate(0deg); }
  50% { transform: translateY(-4px) scale(1.08) rotate(-1deg); }
}

/* Pregunta principal: protagonista absoluta. */
.question-panel {
  position: relative;
  overflow: hidden;
  border-radius: 28px !important;
  box-shadow:
    0 20px 48px rgba(24,34,56,.075),
    0 0 0 1px rgba(255,255,255,.94) inset !important;
}

.question-stage {
  position: relative;
  overflow: hidden;
}

.question-stage::before {
  position: absolute;
  top: 12px;
  right: 20px;
  content: attr(data-question);
  z-index: 0;
  color: rgba(21,32,51,.045);
  font-size: clamp(5rem, 10vw, 8rem);
  font-weight: 1000;
  line-height: 1;
  pointer-events: none;
  user-select: none;
  transform: rotate(-5deg);
}

.question-stage::after {
  position: absolute;
  top: 34px;
  right: 78px;
  width: 8px;
  height: 8px;
  content: '';
  border-radius: 50%;
  background: var(--game-gold);
  box-shadow:
    26px 16px 0 rgba(118,87,215,.5),
    -18px 40px 0 rgba(45,156,139,.35),
    34px 58px 0 rgba(167,25,82,.28);
  animation: tinyFloat 4.5s ease-in-out infinite;
}

@keyframes tinyFloat {
  50% { transform: translate3d(0, -6px, 0) scale(1.15); }
}

.question-header,
.question-content,
.question-actions {
  position: relative;
  z-index: 2;
}

.question-header {
  padding: 14px 19px !important;
  background: linear-gradient(90deg, #fff, #fbfcff) !important;
}

.question-header::before {
  width: 120px !important;
  height: 3px !important;
  background: linear-gradient(90deg, var(--game-wine), var(--game-violet), var(--game-blue), var(--game-teal)) !important;
}

.question-content {
  padding: clamp(20px, 3vw, 30px) !important;
  background:
    radial-gradient(circle at 96% 2%, rgba(118,87,215,.045), transparent 24%),
    radial-gradient(circle at 6% 90%, rgba(45,156,139,.035), transparent 25%),
    #fff !important;
}

.question-content h2 {
  position: relative;
  z-index: 2;
  max-width: 920px !important;
  margin: 0 auto 20px !important;
  text-align: center;
  font-size: clamp(1.55rem, 3.1vw, 2.5rem) !important;
  line-height: 1.18 !important;
  letter-spacing: -.035em !important;
  text-wrap: balance;
}

/* Respuestas: cuatro energías visuales. */
.options-list {
  position: relative;
  z-index: 3;
  display: grid !important;
  gap: 12px !important;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  max-width: 980px;
  margin: 0 auto;
}

.option-card {
  position: relative;
  overflow: hidden;
  min-height: 90px !important;
  padding: 14px 16px !important;
  border-width: 2px !important;
  border-radius: 21px !important;
  background: #fff !important;
  box-shadow: 0 7px 18px rgba(24,34,56,.035) !important;
  transform: translate3d(0,0,0);
}

.option-card::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 6px;
  content: '';
  background: var(--answer-tone);
  opacity: .92;
}

.option-card::after {
  position: absolute;
  top: -45px;
  right: -35px;
  width: 110px;
  height: 110px;
  content: '';
  border-radius: 50%;
  background: radial-gradient(circle, var(--answer-glow), transparent 70%);
  opacity: .55;
  transition: transform .35s var(--game-spring), opacity .35s ease;
}

.option-card--tone-0 {
  --answer-tone: #c42f62;
  --answer-glow: rgba(196,47,98,.17);
  border-color: #f0d4de !important;
  background: linear-gradient(135deg, #fff, #fff9fb) !important;
}

.option-card--tone-1 {
  --answer-tone: #6f59ce;
  --answer-glow: rgba(111,89,206,.17);
  border-color: #e1dcf3 !important;
  background: linear-gradient(135deg, #fff, #faf9ff) !important;
}

.option-card--tone-2 {
  --answer-tone: #3d73c7;
  --answer-glow: rgba(61,115,199,.17);
  border-color: #d8e3f4 !important;
  background: linear-gradient(135deg, #fff, #f8fbff) !important;
}

.option-card--tone-3 {
  --answer-tone: #2d9c8b;
  --answer-glow: rgba(45,156,139,.17);
  border-color: #d4ece7 !important;
  background: linear-gradient(135deg, #fff, #f7fcfb) !important;
}

.option-card:hover {
  transform: translate3d(0,-5px,0) scale(1.012) rotate(-.25deg) !important;
  border-color: var(--answer-tone) !important;
  box-shadow:
    0 14px 26px rgba(24,34,56,.10),
    0 0 0 4px color-mix(in srgb, var(--answer-tone) 8%, transparent) !important;
}

.option-card:hover::after {
  transform: scale(1.35);
  opacity: .9;
}

.option-card--selected {
  border-color: var(--answer-tone) !important;
  background: linear-gradient(135deg, #fff, rgba(248,248,255,.96)) !important;
  box-shadow:
    0 16px 30px rgba(24,34,56,.11),
    0 0 0 5px color-mix(in srgb, var(--answer-tone) 11%, transparent) !important;
  transform: translateY(-4px) scale(1.012) !important;
}

.option-card--selected::before {
  animation: answerStripe 1.6s ease-in-out infinite;
}

@keyframes answerStripe {
  0%,100% { opacity: .82; }
  50% { opacity: 1; box-shadow: 0 0 18px var(--answer-tone); }
}

.option-card input {
  position: relative;
  z-index: 4;
  accent-color: var(--answer-tone) !important;
}

.option-card__marker {
  position: relative;
  z-index: 3;
  width: 42px !important;
  height: 42px !important;
  border-width: 2px !important;
  border-color: color-mix(in srgb, var(--answer-tone) 32%, #dce3ea) !important;
  color: var(--answer-tone) !important;
  transition:
    transform .32s var(--game-pop),
    background .22s ease,
    box-shadow .22s ease !important;
}

.option-card:hover .option-card__marker {
  transform: scale(1.10) rotate(-5deg) !important;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--answer-tone) 18%, transparent);
}

.option-card--selected .option-card__marker {
  color: #fff !important;
  border-color: var(--answer-tone) !important;
  background: var(--answer-tone) !important;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--answer-tone) 22%, transparent);
  animation: optionPop .38s var(--game-pop);
}

@keyframes optionPop {
  0% { transform: scale(.82) rotate(-7deg); }
  70% { transform: scale(1.16) rotate(4deg); }
  100% { transform: scale(1.06) rotate(0deg); }
}

.option-card strong {
  position: relative;
  z-index: 3;
  color: #23344d !important;
  font-size: .86rem !important;
  line-height: 1.46 !important;
}

/* Entrada escalonada de las respuestas al cambiar de pregunta. */
.quiz-question-enter-active .option-card {
  animation: optionIn .44s var(--game-spring) both;
}

.quiz-question-enter-active .option-card:nth-child(1) { animation-delay: 35ms; }
.quiz-question-enter-active .option-card:nth-child(2) { animation-delay: 70ms; }
.quiz-question-enter-active .option-card:nth-child(3) { animation-delay: 105ms; }
.quiz-question-enter-active .option-card:nth-child(4) { animation-delay: 140ms; }
.quiz-question-enter-active .option-card:nth-child(5) { animation-delay: 175ms; }
.quiz-question-enter-active .option-card:nth-child(6) { animation-delay: 210ms; }

@keyframes optionIn {
  from {
    opacity: 0;
    transform: translate3d(0,18px,0) scale(.98);
  }
  to {
    opacity: 1;
    transform: translate3d(0,0,0) scale(1);
  }
}

/* Navegación: botones más agradables y grandes. */
.question-actions {
  padding: 13px 18px !important;
  background: linear-gradient(90deg, #fbfcff, #fff) !important;
}

.question-actions .button {
  min-height: 48px !important;
  padding-inline: 16px !important;
  border-radius: 15px !important;
  transition:
    transform .24s var(--game-spring),
    box-shadow .24s ease,
    background .2s ease !important;
}

.question-actions .button--primary {
  position: relative;
  overflow: hidden;
  border-color: var(--game-wine) !important;
  background: linear-gradient(135deg, #a71952, #c33067) !important;
  box-shadow: 0 10px 24px rgba(167,25,82,.16) !important;
}

.question-actions .button--primary::after {
  position: absolute;
  top: 0;
  left: -40%;
  width: 25%;
  height: 100%;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
  transform: skewX(-20deg);
  animation: buttonShimmer 2.8s ease-in-out infinite;
}

@keyframes buttonShimmer {
  0%, 52% { left: -40%; }
  100% { left: 140%; }
}

.question-actions .button:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.015) !important;
}

/* Timer como componente de juego. */
.timer-card {
  border-radius: 21px !important;
  background: linear-gradient(145deg, #fffdf2, #fff7d9) !important;
  box-shadow: 0 10px 24px rgba(226,184,62,.10) !important;
}

.timer-card strong {
  animation: timerBreath 2.6s ease-in-out infinite;
}

@keyframes timerBreath {
  50% { transform: scale(1.03); }
}

.timer-card--critical {
  animation: criticalShake .9s ease-in-out infinite;
}

@keyframes criticalShake {
  0%,100% { transform: translate3d(0,0,0); }
  25% { transform: translate3d(1px,0,0); }
  75% { transform: translate3d(-1px,0,0); }
}

/* Resultado: más celebratorio. */
.result-screen {
  position: relative;
  overflow: hidden;
  border-radius: 30px !important;
}

.result-screen::after {
  position: absolute;
  top: -30px;
  left: 8%;
  width: 18px;
  height: 34px;
  content: '';
  border-radius: 8px;
  background: var(--game-wine);
  transform: rotate(18deg);
  box-shadow:
    70px 24px 0 var(--game-gold),
    145px 4px 0 var(--game-violet),
    240px 40px 0 var(--game-teal),
    320px 18px 0 var(--game-blue);
  animation: confettiDrop 4.6s ease-in-out infinite;
}

@keyframes confettiDrop {
  0%,100% { transform: translateY(-6px) rotate(18deg); }
  50% { transform: translateY(30px) rotate(34deg); }
}

/* MOBILE: la experiencia sigue siendo juego, pero compacta. */
@media (max-width: 900px) {
  .options-list {
    grid-template-columns: 1fr;
  }

  .question-content h2 {
    text-align: left;
    margin-inline: 0 !important;
  }
}

@media (max-width: 760px) {
  .quiz-hero {
    padding: 14px 14px !important;
    border-radius: 22px !important;
  }

  .quiz-progress {
    border-radius: 18px !important;
  }

  .quiz-progress__question-meta strong {
    font-size: .68rem !important;
  }

  .quiz-quick-dot {
    width: 34px;
    height: 34px;
    flex-basis: 34px;
    border-radius: 11px !important;
  }

  .question-panel {
    border-radius: 22px !important;
  }

  .question-stage::before {
    top: 8px;
    right: 12px;
    font-size: 5rem;
  }

  .question-content {
    padding: 17px 14px !important;
  }

  .question-content h2 {
    font-size: clamp(1.32rem, 6.5vw, 1.8rem) !important;
  }

  .option-card {
    min-height: 72px !important;
    border-radius: 18px !important;
  }

  .option-card__marker {
    width: 38px !important;
    height: 38px !important;
  }

  .question-actions {
    padding: 11px 12px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-page::before,
  .quiz-page::after,
  .quiz-page > .quiz-hero::after,
  .quiz-progress__bar span::before,
  .quiz-quick-dot--current,
  .question-stage::after,
  .option-card--selected::before,
  .option-card--selected .option-card__marker,
  .quiz-question-enter-active .option-card,
  .question-actions .button--primary::after,
  .timer-card strong,
  .timer-card--critical,
  .result-screen::after {
    animation: none !important;
  }
}



/* =========================================================
   V10 · AMV GAME MODE · VISUAL POLISH + QUESTION TYPES
========================================================= */
.quiz-page { position:relative; isolation:isolate; overflow-x:clip; }
.quiz-hero { min-height:150px; padding-block:20px !important; border-radius:26px !important; }
.quiz-progress { position:sticky; top:8px; z-index:40; backdrop-filter:blur(16px); background:rgba(255,255,255,.92) !important; box-shadow:0 14px 34px rgba(23,32,51,.07) !important; }
.quiz-progress__bar span { position:relative; overflow:hidden; background:linear-gradient(90deg,#a81752 0%,#7657d7 34%,#3f78c8 68%,#2d9c8b 100%) !important; box-shadow:0 3px 12px rgba(118,87,215,.18); }
.quiz-progress__bar span::after { position:absolute; inset:0 auto 0 -50px; width:42px; content:''; background:linear-gradient(90deg,transparent,rgba(255,255,255,.58),transparent); animation:progressShimmer 2.4s linear infinite; }
@keyframes progressShimmer { from { transform:translateX(0); } to { transform:translateX(980px); } }

/* Elimina la barra roja y el encabezado que cruzaba la pregunta. */
.question-header, .question-header::before { display:none !important; height:0 !important; border:0 !important; content:none !important; }
.question-panel { overflow:visible !important; border-radius:30px !important; box-shadow:0 22px 58px rgba(25,35,56,.08),0 0 0 1px rgba(255,255,255,.9) inset !important; }
.question-content { position:relative; overflow:hidden; min-height:390px !important; padding:clamp(20px,3vw,34px) !important; border-radius:30px 30px 0 0; }
.question-content::before,.question-content::after { position:absolute; content:''; pointer-events:none; }
.question-content::before { top:55px; right:-45px; width:190px; height:190px; border-radius:50%; background:radial-gradient(circle,rgba(118,87,215,.09),transparent 66%); animation:qGlow 8s ease-in-out infinite alternate; }
.question-content::after { left:-25px; bottom:-85px; width:190px; height:190px; border-radius:50%; background:radial-gradient(circle,rgba(45,156,139,.08),transparent 66%); animation:qGlow2 10s ease-in-out infinite alternate; }
@keyframes qGlow { from { transform:translate3d(0,0,0) scale(.92); opacity:.4; } to { transform:translate3d(-12px,10px,0) scale(1.08); opacity:1; } }
@keyframes qGlow2 { from { transform:translate3d(0,5px,0) scale(1); opacity:.3; } to { transform:translate3d(12px,-8px,0) scale(1.12); opacity:.75; } }
.question-content > * { position:relative; z-index:3; }

.question-meta-rail { display:flex; gap:10px; align-items:center; justify-content:space-between; margin-bottom:16px; }
.question-meta-rail__left { display:flex; gap:8px; align-items:center; flex-wrap:wrap; }
.question-meta-pill { display:inline-flex; min-height:34px; align-items:center; padding:0 11px; border:1px solid #dce4ec; border-radius:999px; color:#718096; background:rgba(255,255,255,.88); font-size:.56rem; font-weight:900; letter-spacing:.06em; box-shadow:0 5px 16px rgba(31,48,73,.04); backdrop-filter:blur(7px); }
.question-meta-pill--number { border-color:#e5cad8; color:#9f1945; background:#fff5f8; }
.question-meta-pill--required { border-color:#ead79c; color:#806000; background:#fff9e9; }
.question-meta-pill--points { border-color:#d9cef0; color:#6d57a7; background:#faf7ff; }
.question-content h2 { font-size:clamp(1.65rem,3.5vw,2.7rem) !important; line-height:1.13 !important; letter-spacing:-.035em !important; margin-bottom:22px !important; }

/* Respuestas vivas y táctiles. */
.option-card { position:relative; overflow:hidden; min-height:84px !important; border-radius:22px !important; transform:translate3d(0,0,0); transition:transform .25s cubic-bezier(.2,.8,.2,1),box-shadow .25s ease,border-color .22s ease,background .22s ease !important; }
.option-card::before { position:absolute; left:0; top:0; bottom:0; width:5px; content:''; border-radius:999px; background:var(--answer-tone); transform:scaleY(.28); transition:transform .25s ease; }
.option-card::after { position:absolute; top:-50%; left:-25%; width:30%; height:200%; content:''; background:linear-gradient(90deg,transparent,rgba(255,255,255,.62),transparent); opacity:0; transform:rotate(14deg) translateX(-100%); pointer-events:none; }
.option-card:hover { transform:translateY(-4px) scale(1.008) !important; box-shadow:0 16px 34px color-mix(in srgb,var(--answer-tone) 14%,transparent),0 0 0 1px rgba(255,255,255,.75) inset !important; }
.option-card:hover::before,.option-card--selected::before { transform:scaleY(.86); }
.option-card:hover::after { opacity:.8; animation:answerSweep .78s ease; }
@keyframes answerSweep { to { transform:rotate(14deg) translateX(410%); } }
.option-card--selected { transform:translateY(-3px) scale(1.01) !important; border-color:var(--answer-tone) !important; background:color-mix(in srgb,var(--answer-tone) 8%,#fff) !important; box-shadow:0 15px 34px color-mix(in srgb,var(--answer-tone) 17%,transparent),inset 0 0 0 1px color-mix(in srgb,var(--answer-tone) 12%,transparent) !important; }

.question-meta-pill--type { border-color:#d8e4f0; color:#48657f; background:#f4f8fc; }
.audio-experience { display:grid; grid-template-columns:auto minmax(0,1fr); gap:14px; align-items:center; padding:15px 16px; border:1px solid #dfe7ef; border-radius:18px; background:linear-gradient(135deg,#fbfcff,#f2f7fb); box-shadow:0 8px 22px rgba(31,48,73,.045); }
.audio-experience__icon { display:grid; width:56px; height:56px; place-items:center; border-radius:16px; color:#9f1945; background:#fff1f5; border:1px solid #edcbd8; font-size:1.25rem; box-shadow:0 8px 18px rgba(159,25,69,.08); animation:audioPulse 2.4s ease-in-out infinite; }
.audio-experience__content { display:grid; gap:6px; min-width:0; }
.audio-experience__content > span { color:#987000; font-size:.56rem; font-weight:900; letter-spacing:.1em; }
.audio-experience__content > strong { color:#152033; font-size:.9rem; }
.audio-experience__content audio { width:100%; margin-top:3px; }
.audio-experience__content small { color:#718096; font-size:.68rem; }
@keyframes audioPulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.045); } }

/* Tipos interactivos: matching / ordering */
.interactive-question { display:grid; gap:14px; }
.interactive-question__intro { display:flex; gap:14px; align-items:flex-start; justify-content:space-between; padding:13px 14px; border:1px solid #e4eaf0; border-radius:17px; background:linear-gradient(135deg,#fbfcff,#f6f8fb); }
.interactive-question__intro > div > span { display:block; color:#987000; font-size:.54rem; font-weight:900; letter-spacing:.1em; }
.interactive-question__intro > div p { margin:4px 0 0 !important; color:#6f7c8f !important; font-size:.7rem !important; }
.interactive-question__intro > strong { color:#9f1945; font-size:.7rem; white-space:nowrap; }
.matching-question__list,.ordering-question__list { display:grid; gap:10px; }
.matching-question__row { display:grid; gap:10px; grid-template-columns:32px minmax(140px,.95fr) 28px minmax(170px,1.2fr) 34px; align-items:center; min-height:72px; padding:11px 12px; border:1px solid #dfe6ed; border-radius:18px; background:#fff; transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,background .22s ease; }
.matching-question__row:hover { transform:translateY(-2px); border-color:#cad6e1; box-shadow:0 10px 24px rgba(31,48,73,.06); }
.matching-question__row--complete { border-color:#b8dcc8; background:#fbfffd; box-shadow:0 9px 24px rgba(45,138,99,.06); }
.matching-question__number { display:grid; width:30px; height:30px; place-items:center; border-radius:10px; color:#9f1945; background:#fff1f5; font-size:.65rem; font-weight:900; }
.matching-question__arrow { color:#b18400; font-size:1rem; }
.matching-question__row select { min-height:46px !important; border:1px solid #ccd7e2 !important; border-radius:12px !important; color:#344359 !important; background:#fff !important; font:inherit; padding:0 10px; }
.matching-question__clear { display:grid; width:32px; height:32px; place-items:center; border:1px solid #d9e1ea; border-radius:10px; color:#7b8798; background:#fff; cursor:pointer; }
.matching-question__clear:hover { color:#be4856; border-color:#efcbd1; background:#fff5f6; }
.ordering-question__item { display:grid !important; gap:10px; grid-template-columns:40px 24px minmax(0,1fr) auto; align-items:center; min-height:64px; padding:10px 12px; border:1px solid #dfe6ed; border-radius:18px; background:#fff; cursor:grab; user-select:none; transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,opacity .2s ease; }
.ordering-question__item:hover { transform:translateY(-2px); border-color:#c8d4df; box-shadow:0 10px 24px rgba(31,48,73,.06); }
.ordering-question__item--dragging { opacity:.52; transform:scale(.985); }
.ordering-question__position { display:grid; width:36px; height:36px; place-items:center; border-radius:11px; color:#9f1945; background:#fff1f5; font-size:.66rem; font-weight:900; }
.ordering-question__handle { color:#98a4b3; font-size:1rem; letter-spacing:-.2em; }
.ordering-question__controls { display:flex; gap:6px; }
.ordering-question__controls button { width:32px; height:32px; min-height:32px !important; border:1px solid #dbe3ea; border-radius:10px; color:#66768a; background:#fff; cursor:pointer; }
.ordering-question__controls button:hover:not(:disabled) { border-color:#bfcbd7; background:#f8fafc; transform:translateY(-1px); }
.ordering-question__footer { display:flex; justify-content:flex-end; gap:9px; flex-wrap:wrap; padding-top:2px; }
.interactive-secondary,.interactive-primary { min-height:42px; padding:0 14px; border-radius:12px; font:inherit; font-size:.68rem; font-weight:900; cursor:pointer; transition:transform .2s ease,box-shadow .2s ease; }
.interactive-secondary { border:1px solid #ccd7e2; color:#44546a; background:#fff; }
.interactive-primary { border:1px solid #9f1945; color:#fff; background:linear-gradient(135deg,#a91752,#8b153f); box-shadow:0 9px 22px rgba(159,25,69,.16); }
.interactive-primary:hover { transform:translateY(-2px); box-shadow:0 13px 28px rgba(159,25,69,.22); }

/* Preguntas: más juego, menos formulario. */
.question-dot { border-radius:14px !important; transition:transform .22s cubic-bezier(.2,.8,.2,1),box-shadow .22s ease !important; }
.question-dot:hover { transform:translateY(-3px) scale(1.03); }
.question-dot--current { animation:dotPulse 2.2s ease-in-out infinite; }
@keyframes dotPulse { 0%,100% { transform:translateY(0) scale(1); } 50% { transform:translateY(-2px) scale(1.035); } }
.question-actions .button--primary { position:relative; overflow:hidden; }
.question-actions .button--primary::after { position:absolute; top:-50%; left:-25%; width:25%; height:200%; content:''; background:linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent); transform:rotate(14deg) translateX(-100%); animation:navSweep 3.8s ease-in-out infinite; }
@keyframes navSweep { 0%,60% { transform:rotate(14deg) translateX(-100%); } 82%,100% { transform:rotate(14deg) translateX(520%); } }

@media (max-width:980px) { .quiz-progress { top:6px; } }
@media (max-width:720px) {
  .quiz-hero { min-height:0; }
  .question-content { min-height:auto !important; padding:20px 17px !important; border-radius:26px 26px 0 0; }
  .question-meta-rail { margin-bottom:13px; }
  .matching-question__row { grid-template-columns:30px minmax(0,1fr) 28px 32px !important; }
  .matching-question__row > strong { grid-column:2 / -1; }
  .matching-question__arrow { grid-column:2 / 3; transform:rotate(90deg); justify-self:start; }
  .matching-question__row select { grid-column:2 / 4; }
  .matching-question__clear { grid-column:4 / 5; grid-row:3; }
  .ordering-question__item { grid-template-columns:38px 22px minmax(0,1fr) !important; }
  .ordering-question__controls { grid-column:1 / -1; justify-content:flex-end; }
  .ordering-question__footer { display:grid; grid-template-columns:1fr; }
  .interactive-secondary,.interactive-primary { width:100%; }
}
@media (max-width:520px) {
  .quiz-progress__questions { overflow-x:auto; padding-bottom:2px; }
  .quiz-progress__questions::-webkit-scrollbar { height:0; }
  .question-meta-rail { align-items:flex-start; }
  .question-meta-rail__left { max-width:76%; }
  .option-card { min-height:76px !important; border-radius:19px !important; }
}
@media (prefers-reduced-motion:reduce) {
  .quiz-page::before,.quiz-page::after,.quiz-hero::after,.quiz-progress__bar span::after,.question-content::before,.question-content::after,.option-card::after,.question-dot--current,.question-actions .button--primary::after { animation:none !important; }
}


/* =========================================================
   V13 · AMV KAHOOT DELUXE
   SOLO VISUAL · SIN CAMBIAR LÓGICA
   ========================================================= */

/* El breadcrumb superior pertenece al layout del aula. En la
   experiencia de evaluación queremos una inmersión completa. */
:global(.aula-topbar) {
  display: none !important;
}

:global(.aula-footer) {
  display: none !important;
}

.quiz-page {
  position: relative;
  isolation: isolate;
  width: min(1540px, 100%);
  padding-top: clamp(.5rem, 1vw, .9rem) !important;
  padding-right: clamp(.8rem, 2vw, 1.4rem) !important;
  padding-left: clamp(.8rem, 2vw, 1.4rem) !important;
  overflow: clip;
  background:
    radial-gradient(circle at 6% 20%, rgba(255, 76, 126, .07), transparent 25%),
    radial-gradient(circle at 94% 18%, rgba(117, 92, 255, .08), transparent 26%),
    radial-gradient(circle at 50% 100%, rgba(35, 208, 190, .06), transparent 30%);
}

.quiz-page::before,
.quiz-page::after {
  position: fixed;
  z-index: -2;
  width: 22rem;
  height: 22rem;
  border-radius: 50%;
  content: '';
  pointer-events: none;
  filter: blur(60px);
  opacity: .48;
}

.quiz-page::before {
  top: 12%;
  left: -10rem;
  background: rgba(255, 63, 114, .12);
  animation: amvFloatOne 10s ease-in-out infinite;
}

.quiz-page::after {
  right: -10rem;
  bottom: 2%;
  background: rgba(93, 94, 255, .12);
  animation: amvFloatTwo 12s ease-in-out infinite;
}

@keyframes amvFloatOne {
  0%,100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(2.5rem,1.5rem,0) scale(1.08); }
}

@keyframes amvFloatTwo {
  0%,100% { transform: translate3d(0,0,0) scale(1); }
  50% { transform: translate3d(-2rem,-2rem,0) scale(1.1); }
}

/* =========================================================
   BARRA DE CONTEXTO
   ========================================================= */

.quiz-topbar {
  position: relative;
  z-index: 5;
  min-height: 34px;
  margin-bottom: .55rem !important;
  padding: 0 .2rem;
}

.quiz-back {
  position: relative;
  padding: .35rem .7rem .35rem .1rem;
  border-radius: 999px;
  color: #65748a !important;
  transition: color .2s ease, transform .2s ease, background .2s ease;
}

.quiz-back:hover {
  color: #9f1945 !important;
  background: rgba(159,25,69,.055);
  transform: translateX(3px);
}

.quiz-topbar__status {
  padding: .38rem .7rem;
  border: 1px solid #dbe8e1 !important;
  border-radius: 999px;
  background: rgba(255,255,255,.78);
  box-shadow: 0 6px 18px rgba(31,48,73,.035);
  backdrop-filter: blur(12px);
}

/* =========================================================
   HERO · MÁS COMPACTO Y MÁS JUGUETÓN
   ========================================================= */

.quiz-hero {
  position: relative;
  min-height: 186px;
  margin-bottom: 12px !important;
  padding: 23px 25px !important;
  border-radius: 28px !important;
  border: 1px solid rgba(218,224,234,.95) !important;
  background:
    radial-gradient(circle at 88% 16%, rgba(255,202,63,.19), transparent 26%),
    radial-gradient(circle at 74% 95%, rgba(110,89,255,.075), transparent 29%),
    linear-gradient(135deg, #ffffff 0%, #fbfcff 52%, #fff9ed 100%) !important;
  box-shadow:
    0 18px 42px rgba(31,48,73,.07),
    inset 0 1px 0 rgba(255,255,255,.95) !important;
  overflow: hidden;
}

.quiz-hero::after {
  position: absolute;
  top: -42%;
  right: 7%;
  width: 360px;
  height: 240px;
  border-radius: 48%;
  content: '';
  background: linear-gradient(110deg, transparent 20%, rgba(255,255,255,.9) 48%, transparent 68%);
  transform: translateX(140%) rotate(8deg);
  opacity: .5;
  animation: heroShimmer 8s ease-in-out infinite;
  pointer-events: none;
}

@keyframes heroShimmer {
  0%, 63% { transform: translateX(140%) rotate(8deg); opacity: 0; }
  69% { opacity: .42; }
  77%, 100% { transform: translateX(-80%) rotate(8deg); opacity: 0; }
}

.quiz-hero::before {
  width: 190px !important;
  height: 5px !important;
  border-radius: 0 999px 999px 0;
  background: linear-gradient(90deg, #a9164d 0%, #7655dd 48%, #25bcae 100%) !important;
  box-shadow: 0 0 18px rgba(118,85,221,.18);
}

.quiz-hero__main {
  position: relative;
  z-index: 1;
}

.quiz-hero__eyebrow span:first-child {
  border-color: #f0b4c8 !important;
  color: #a9164d !important;
  background: #fff3f7 !important;
  box-shadow: 0 5px 12px rgba(169,22,77,.06);
}

.quiz-hero__eyebrow span:nth-child(2) {
  border-color: #ead699 !important;
  color: #876900 !important;
  background: #fffaf0 !important;
}

.quiz-hero h1 {
  font-size: clamp(1.95rem, 4vw, 3.45rem) !important;
  line-height: 1 !important;
  letter-spacing: -.045em !important;
}

.quiz-hero p {
  font-size: .82rem !important;
  max-width: 700px;
}

.assessment-purpose {
  width: fit-content;
  max-width: min(820px, 100%);
  min-height: 42px;
  margin-top: .85rem !important;
  border-radius: 999px !important;
  box-shadow: 0 8px 18px rgba(45,138,99,.045);
}

.quiz-hero__meta span {
  transition: transform .18s ease, box-shadow .18s ease;
}

.quiz-hero__meta span:hover {
  transform: translateY(-2px);
  box-shadow: 0 7px 14px rgba(31,48,73,.055);
}

.timer-card {
  position: relative;
  z-index: 1;
  min-width: 150px !important;
  border-radius: 22px !important;
  background: rgba(255,250,240,.8) !important;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 24px rgba(217,169,29,.08) !important;
}

.timer-card strong {
  font-size: 2.15rem !important;
}

.timer-card--critical {
  animation: criticalBreath 1.25s ease-in-out infinite;
}

@keyframes criticalBreath {
  0%,100% { transform: scale(1); box-shadow: 0 0 0 rgba(190,72,86,0); }
  50% { transform: scale(1.025); box-shadow: 0 12px 28px rgba(190,72,86,.12); }
}

/* =========================================================
   PROGRESO · HUD
   ========================================================= */

.quiz-progress {
  position: sticky;
  z-index: 40;
  top: .65rem;
  margin-bottom: 12px !important;
  padding: 14px 17px 13px !important;
  border-radius: 24px !important;
  background: rgba(255,255,255,.9) !important;
  box-shadow:
    0 14px 30px rgba(31,48,73,.06),
    inset 0 1px 0 rgba(255,255,255,.95) !important;
  backdrop-filter: blur(16px) saturate(1.08);
}

.quiz-progress__heading {
  margin-bottom: .45rem !important;
}

.quiz-progress__bar {
  position: relative;
  height: 9px !important;
  overflow: hidden;
  border-radius: 999px !important;
  background: #edf1f6 !important;
  box-shadow: inset 0 1px 2px rgba(31,48,73,.05);
}

.quiz-progress__bar span {
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #b11755 0%, #7758de 48%, #30b6ab 100%) !important;
  box-shadow: 0 0 16px rgba(119,88,222,.18);
}

.quiz-progress__bar span::after {
  position: absolute;
  top: 0;
  left: -22%;
  width: 22%;
  height: 100%;
  border-radius: inherit;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.8), transparent);
  animation: progressGlint 2.8s ease-in-out infinite;
}

@keyframes progressGlint {
  0%, 55% { transform: translateX(0); opacity: 0; }
  65% { opacity: .85; }
  100% { transform: translateX(650%); opacity: 0; }
}

.quiz-progress__question-map {
  position: relative;
  display: grid;
  gap: .85rem;
  grid-template-columns: auto minmax(0,1fr) auto;
  align-items: center;
  margin-top: .7rem;
  padding-top: .65rem;
  border-top: 1px solid #edf0f4;
}

.quiz-progress__question-meta span {
  color: #9f1945 !important;
  font-size: .51rem !important;
  font-weight: 900;
  letter-spacing: .11em;
}

.quiz-progress__question-meta strong {
  display: block;
  margin-top: .12rem;
  color: #56657b;
  font-size: .62rem;
}

.quiz-progress__question-track {
  display: flex;
  gap: .48rem;
  overflow-x: auto;
  padding: .16rem .25rem .2rem;
  scrollbar-width: none;
}

.quiz-progress__question-track::-webkit-scrollbar {
  display: none;
}

.quiz-quick-dot {
  position: relative;
  flex: 0 0 47px;
  width: 47px !important;
  min-height: 47px !important;
  border-radius: 15px !important;
  color: #728197 !important;
  background: linear-gradient(145deg,#fff,#f7f9fc) !important;
  box-shadow: 0 6px 14px rgba(31,48,73,.035) !important;
  transition: transform .2s cubic-bezier(.2,.8,.2,1), box-shadow .2s ease, border-color .2s ease !important;
}

.quiz-quick-dot::before {
  position: absolute;
  top: 5px;
  left: 6px;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  content: '';
  background: currentColor;
  opacity: .15;
}

.quiz-quick-dot:nth-child(4n + 1) { --quick-tone: #ff477e; }
.quiz-quick-dot:nth-child(4n + 2) { --quick-tone: #695ce9; }
.quiz-quick-dot:nth-child(4n + 3) { --quick-tone: #2bb5c0; }
.quiz-quick-dot:nth-child(4n + 4) { --quick-tone: #f0aa34; }

.quiz-quick-dot:hover {
  transform: translateY(-3px) scale(1.04);
  border-color: color-mix(in srgb, var(--quick-tone) 52%, #d9e0e9) !important;
  box-shadow: 0 10px 22px color-mix(in srgb, var(--quick-tone) 13%, transparent) !important;
}

.quiz-quick-dot--answered {
  border-color: color-mix(in srgb, var(--quick-tone) 36%, #d7e0e7) !important;
  color: color-mix(in srgb, var(--quick-tone) 68%, #334155) !important;
  background: color-mix(in srgb, var(--quick-tone) 8%, #fff) !important;
}

.quiz-quick-dot--current {
  border-color: var(--quick-tone) !important;
  color: #fff !important;
  background: linear-gradient(145deg, color-mix(in srgb, var(--quick-tone) 83%, #fff), color-mix(in srgb, var(--quick-tone) 68%, #111)) !important;
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--quick-tone) 17%, transparent),
    0 11px 24px color-mix(in srgb, var(--quick-tone) 22%, transparent) !important;
  animation: quickBounce 2.2s ease-in-out infinite;
}

.quiz-quick-dot--current::after {
  position: absolute;
  inset: 3px;
  border: 1px solid rgba(255,255,255,.5);
  border-radius: 12px;
  content: '';
  opacity: .75;
  pointer-events: none;
}

@keyframes quickBounce {
  0%,100% { transform: translateY(0) scale(1); }
  45% { transform: translateY(-2px) scale(1.04); }
}

.quiz-progress__question-hint {
  display: flex;
  gap: .28rem;
  align-items: center;
  color: #8b98aa !important;
  font-size: .5rem !important;
  white-space: nowrap;
}

/* =========================================================
   PREGUNTA · TARJETA PREMIUM
   ========================================================= */

.quiz-layout {
  position: relative;
  gap: 14px !important;
  grid-template-columns: minmax(0, 1fr) minmax(255px, 292px) !important;
}

.question-panel {
  position: relative;
  overflow: hidden;
  border-radius: 30px !important;
  border-color: #dfe5ed !important;
  background:
    radial-gradient(circle at 92% 10%, rgba(106,88,236,.055), transparent 24%),
    radial-gradient(circle at 4% 90%, rgba(36,185,171,.045), transparent 22%),
    #fff !important;
  box-shadow:
    0 20px 46px rgba(31,48,73,.07),
    inset 0 1px 0 rgba(255,255,255,.95) !important;
}

.question-panel::before {
  position: absolute;
  z-index: 0;
  top: -110px;
  right: -90px;
  width: 300px;
  height: 300px;
  border: 1px solid rgba(118,85,221,.08);
  border-radius: 50%;
  content: '';
  box-shadow: 0 0 0 28px rgba(118,85,221,.018), 0 0 0 56px rgba(118,85,221,.012);
  animation: panelOrb 8s ease-in-out infinite;
  pointer-events: none;
}

.question-panel::after {
  position: absolute;
  z-index: 0;
  bottom: -85px;
  left: -70px;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  content: '';
  background: radial-gradient(circle, rgba(32,190,174,.08), transparent 68%);
  animation: panelGlow 9s ease-in-out infinite;
  pointer-events: none;
}

@keyframes panelOrb {
  0%,100% { transform: translate(0,0) rotate(0); }
  50% { transform: translate(-12px,10px) rotate(8deg); }
}

@keyframes panelGlow {
  0%,100% { transform: scale(.92); opacity: .7; }
  50% { transform: scale(1.08); opacity: 1; }
}

.question-stage {
  position: relative;
  z-index: 2;
}

.question-meta-rail {
  position: relative;
  z-index: 2;
  display: flex;
  gap: .55rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.question-meta-rail__left {
  display: flex;
  gap: .5rem;
  flex-wrap: wrap;
}

.question-meta-pill {
  min-height: 30px;
  padding: .42rem .68rem;
  border-radius: 999px !important;
  box-shadow: 0 5px 12px rgba(31,48,73,.035);
}

.question-meta-pill--number {
  border-color: #efbfd0 !important;
  color: #a9164d !important;
  background: #fff4f8 !important;
}

.question-meta-pill--type {
  border-color: #ccdff2 !important;
  color: #426783 !important;
  background: #f2f8fd !important;
}

.question-meta-pill--required {
  border-color: #ebd58d !important;
  color: #856800 !important;
  background: #fff9e9 !important;
}

.question-meta-pill--points {
  border-color: #dfd1f4 !important;
  color: #6951aa !important;
  background: #faf6ff !important;
}

.question-content {
  position: relative;
  min-height: 0 !important;
  padding: clamp(24px, 3vw, 36px) !important;
}

.question-content h2 {
  position: relative;
  z-index: 2;
  max-width: 980px !important;
  margin: 0 auto 23px !important;
  color: #162239 !important;
  font-size: clamp(1.75rem, 3.25vw, 3rem) !important;
  line-height: 1.08 !important;
  letter-spacing: -.045em !important;
  text-align: center;
  text-wrap: balance;
}

.question-content h2::selection {
  background: rgba(159,25,69,.12);
}

.question-media {
  position: relative;
  z-index: 2;
  margin-bottom: 18px !important;
}

/* =========================================================
   RESPUESTAS · CUATRO COLORES TIPO GAME SHOW
   ========================================================= */

.options-list {
  position: relative;
  z-index: 3;
  display: grid;
  gap: 13px !important;
  grid-template-columns: repeat(2, minmax(0,1fr));
}

.option-card {
  --answer-tone: #ff477e;
  position: relative;
  min-height: 88px !important;
  overflow: hidden;
  grid-template-columns: auto auto minmax(0,1fr) !important;
  gap: 12px !important;
  padding: 14px 18px !important;
  border: 2px solid color-mix(in srgb, var(--answer-tone) 25%, #dfe6ed) !important;
  border-radius: 22px !important;
  color: #17243a !important;
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--answer-tone) 5%, #fff) 0%,
      #fff 74%) !important;
  box-shadow:
    0 8px 20px rgba(31,48,73,.045),
    inset 0 1px 0 rgba(255,255,255,.95) !important;
  transform: translateZ(0);
  transition:
    transform .25s cubic-bezier(.2,.8,.2,1),
    border-color .25s ease,
    box-shadow .25s ease,
    background .25s ease;
  animation: answerEnter .45s both cubic-bezier(.2,.8,.2,1);
}

.option-card:nth-child(4n + 1) { --answer-tone: #ff477e; }
.option-card:nth-child(4n + 2) { --answer-tone: #6f5eea; }
.option-card:nth-child(4n + 3) { --answer-tone: #2db8c0; }
.option-card:nth-child(4n + 4) { --answer-tone: #f0ad3b; }

.option-card:nth-child(2) { animation-delay: 55ms; }
.option-card:nth-child(3) { animation-delay: 110ms; }
.option-card:nth-child(4) { animation-delay: 165ms; }
.option-card:nth-child(5) { animation-delay: 220ms; }
.option-card:nth-child(6) { animation-delay: 275ms; }

@keyframes answerEnter {
  from { opacity: 0; transform: translateY(9px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.option-card::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 7px;
  border-radius: 22px 0 0 22px;
  content: '';
  background: linear-gradient(180deg, color-mix(in srgb, var(--answer-tone) 86%, #fff), color-mix(in srgb, var(--answer-tone) 62%, #111));
  box-shadow: 0 0 16px color-mix(in srgb, var(--answer-tone) 18%, transparent);
}

.option-card::after {
  position: absolute;
  top: -70%;
  left: -35%;
  width: 36%;
  height: 240%;
  content: '';
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.72), transparent);
  transform: rotate(14deg) translateX(-120%);
  opacity: 0;
  pointer-events: none;
}

.option-card:hover {
  z-index: 4;
  border-color: color-mix(in srgb, var(--answer-tone) 62%, #dfe6ed) !important;
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--answer-tone) 10%, #fff) 0%,
      #fff 78%) !important;
  box-shadow:
    0 18px 32px color-mix(in srgb, var(--answer-tone) 16%, transparent),
    0 0 0 1px rgba(255,255,255,.85) inset !important;
  transform: translateY(-5px) scale(1.012);
}

.option-card:hover::after {
  opacity: .65;
  animation: answerSweepDeluxe .8s ease;
}

@keyframes answerSweepDeluxe {
  0% { transform: rotate(14deg) translateX(-120%); }
  100% { transform: rotate(14deg) translateX(520%); }
}

.option-card--selected {
  z-index: 5;
  border-color: var(--answer-tone) !important;
  background:
    linear-gradient(135deg,
      color-mix(in srgb, var(--answer-tone) 16%, #fff) 0%,
      color-mix(in srgb, var(--answer-tone) 4%, #fff) 82%) !important;
  box-shadow:
    0 20px 38px color-mix(in srgb, var(--answer-tone) 22%, transparent),
    inset 0 0 0 1px color-mix(in srgb, var(--answer-tone) 10%, transparent) !important;
  transform: translateY(-4px) scale(1.018);
  animation: selectedPop .32s cubic-bezier(.2,.9,.2,1);
}

@keyframes selectedPop {
  0% { transform: translateY(0) scale(.985); }
  55% { transform: translateY(-5px) scale(1.024); }
  100% { transform: translateY(-4px) scale(1.018); }
}

.option-card input {
  position: relative;
  z-index: 2;
  flex-shrink: 0;
}

.option-card__marker {
  position: relative;
  z-index: 2;
  width: 44px !important;
  height: 44px !important;
  border: 2px solid color-mix(in srgb, var(--answer-tone) 45%, #d6dee7) !important;
  border-radius: 15px !important;
  color: color-mix(in srgb, var(--answer-tone) 72%, #1e293b) !important;
  background: color-mix(in srgb, var(--answer-tone) 7%, #fff) !important;
  box-shadow: 0 5px 12px color-mix(in srgb, var(--answer-tone) 8%, transparent);
  transition: transform .22s ease, background .22s ease, color .22s ease, border-color .22s ease;
}

.option-card:hover .option-card__marker,
.option-card--selected .option-card__marker {
  border-color: var(--answer-tone) !important;
  color: #fff !important;
  background: linear-gradient(145deg,
    color-mix(in srgb, var(--answer-tone) 84%, #fff),
    color-mix(in srgb, var(--answer-tone) 66%, #111)) !important;
  transform: rotate(-3deg) scale(1.04);
}

.option-card strong {
  position: relative;
  z-index: 2;
  color: #24344b !important;
  font-size: .9rem !important;
  line-height: 1.45 !important;
}

.option-card:hover strong,
.option-card--selected strong {
  color: #17243a !important;
}

/* =========================================================
   ESTADOS · CHECK E ICONOS
   ========================================================= */

.option-card input[type='radio'],
.option-card input[type='checkbox'] {
  accent-color: var(--answer-tone) !important;
}

.question-actions {
  position: relative;
  z-index: 4;
  padding: 15px 20px !important;
  background: linear-gradient(180deg, rgba(248,250,253,.92), #f7f9fc) !important;
}

.question-actions .button {
  min-height: 48px !important;
  border-radius: 15px !important;
  transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
}

.question-actions .button--secondary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(31,48,73,.06);
}

.question-actions .button--primary {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #aa1753, #8d153f) !important;
  box-shadow: 0 10px 24px rgba(159,25,69,.18) !important;
}

.question-actions .button--primary:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.015);
  box-shadow: 0 14px 28px rgba(159,25,69,.23) !important;
}

.question-actions .button--primary::after {
  width: 30% !important;
  animation-duration: 2.9s !important;
}

/* =========================================================
   SIDEBAR · MÁS VIVO
   ========================================================= */

.question-sidebar {
  top: 5.15rem !important;
  gap: 11px !important;
}

.question-sidebar .navigator-card,
.question-sidebar .summary-card,
.question-sidebar .autosave-card {
  position: relative;
  overflow: hidden;
  border-radius: 24px !important;
  box-shadow: 0 12px 28px rgba(31,48,73,.05) !important;
}

.question-sidebar .navigator-card::before,
.question-sidebar .summary-card::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 74px;
  height: 4px;
  border-radius: 0 999px 999px 0;
  content: '';
  background: linear-gradient(90deg, #ff477e, #7358db);
}

.question-sidebar .summary-card::before {
  background: linear-gradient(90deg, #f0ad3b, #d9a91d);
}

.question-sidebar .submit-sidebar-button {
  min-height: 50px !important;
  border-radius: 15px !important;
  background: linear-gradient(135deg,#ac1754,#8b153f) !important;
  box-shadow: 0 11px 22px rgba(159,25,69,.16) !important;
  transition: transform .2s ease, box-shadow .2s ease;
}

.question-sidebar .submit-sidebar-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 30px rgba(159,25,69,.2) !important;
}

.question-sidebar .autosave-card {
  background: linear-gradient(145deg,#f2fbf7,#ebf8f1) !important;
}

/* =========================================================
   TRANSICIÓN DE PREGUNTAS · MÁS CINÉTICA
   ========================================================= */

.quiz-question-enter-active,
.quiz-question-leave-active {
  transition:
    opacity .28s ease,
    transform .32s cubic-bezier(.2,.8,.2,1),
    filter .25s ease;
}

.quiz-question-enter-from {
  opacity: 0;
  transform: translateX(28px) scale(.985);
  filter: blur(4px);
}

.quiz-question-leave-to {
  opacity: 0;
  transform: translateX(-22px) scale(.992);
  filter: blur(3px);
}

/* =========================================================
   TIPOS INTERACTIVOS
   ========================================================= */

.interactive-question__intro {
  border-radius: 20px !important;
  background:
    linear-gradient(135deg,#fbfcff,#f8f4ff) !important;
  box-shadow: 0 8px 20px rgba(105,88,234,.045);
}

.matching-question__row,
.ordering-question__item {
  border-radius: 20px !important;
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease, background .22s ease !important;
}

.matching-question__row:hover,
.ordering-question__item:hover {
  transform: translateY(-3px) scale(1.006) !important;
}

.interactive-primary {
  min-height: 46px !important;
  border-radius: 14px !important;
  background: linear-gradient(135deg,#aa1753,#8d153f) !important;
  box-shadow: 0 10px 22px rgba(159,25,69,.15);
}

.interactive-primary:hover {
  transform: translateY(-2px) scale(1.012) !important;
}

/* =========================================================
   MÓVIL
   ========================================================= */

@media (max-width: 980px) {
  .quiz-progress {
    top: .35rem;
  }

  .quiz-layout {
    grid-template-columns: 1fr !important;
  }

  .question-sidebar {
    position: static !important;
    top: auto !important;
  }
}

@media (max-width: 760px) {
  .quiz-page {
    padding: .45rem .65rem 2rem !important;
  }

  .quiz-topbar {
    min-height: 30px;
  }

  .quiz-hero {
    min-height: 0 !important;
    padding: 19px !important;
    border-radius: 24px !important;
  }

  .quiz-hero h1 {
    font-size: clamp(1.75rem, 8vw, 2.45rem) !important;
  }

  .assessment-purpose {
    border-radius: 17px !important;
  }

  .quiz-progress {
    border-radius: 20px !important;
    padding: 12px !important;
  }

  .quiz-progress__question-map {
    grid-template-columns: 1fr;
    gap: .35rem;
  }

  .quiz-progress__question-meta {
    display: flex;
    gap: .45rem;
    align-items: baseline;
    justify-content: space-between;
  }

  .quiz-progress__question-hint {
    display: none;
  }

  .quiz-progress__question-track {
    padding-left: 0;
  }

  .quiz-quick-dot {
    flex-basis: 45px;
    width: 45px !important;
    min-height: 45px !important;
  }

  .question-panel {
    border-radius: 25px !important;
  }

  .question-content {
    padding: 21px 15px !important;
  }

  .question-content h2 {
    margin-bottom: 19px !important;
    font-size: clamp(1.52rem, 7vw, 2.15rem) !important;
  }

  .options-list {
    grid-template-columns: 1fr;
    gap: 11px !important;
  }

  .option-card {
    min-height: 78px !important;
    padding: 13px 14px !important;
    border-radius: 19px !important;
  }

  .option-card__marker {
    width: 42px !important;
    height: 42px !important;
  }

  .question-meta-rail {
    align-items: flex-start;
  }

  .question-meta-rail__left {
    max-width: 76%;
  }
}

@media (max-width: 520px) {
  .quiz-topbar__status {
    font-size: .58rem;
  }

  .quiz-hero__meta span {
    font-size: .52rem !important;
  }

  .quiz-progress__question-track {
    margin-inline: -4px;
    padding-inline: 4px;
  }

  .quiz-quick-dot {
    flex-basis: 43px;
    width: 43px !important;
    min-height: 43px !important;
    border-radius: 14px !important;
  }

  .option-card {
    grid-template-columns: auto minmax(0,1fr) !important;
  }

  .option-card input {
    position: absolute;
    width: 1px;
    height: 1px;
    opacity: 0;
    pointer-events: none;
  }

  .option-card__marker {
    grid-row: auto;
  }

  .question-actions {
    padding: 13px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-page::before,
  .quiz-page::after,
  .quiz-hero::after,
  .timer-card--critical,
  .quiz-progress__bar span::after,
  .quiz-quick-dot--current,
  .question-panel::before,
  .question-panel::after,
  .option-card,
  .quiz-question-enter-active,
  .quiz-question-leave-active {
    animation: none !important;
    transition-duration: .01ms !important;
  }
}


/* =========================================================
   V14 · AMV KAHOOT DELUXE · VISUAL REFINEMENT
   Solo UI: no toca lógica ni datos.
========================================================= */

/* 1) El héroe/cabecera de la evaluación desaparece por completo. */
.quiz-page > .quiz-hero {
  display: none !important;
}
.quiz-page > .quiz-topbar {
  margin-bottom: 14px !important;
  padding: 0 2px !important;
}

/* 2) HUD más limpio: deja toda la atención en progreso + pregunta. */
.quiz-page {
  min-height: 100%;
  padding-top: .35rem !important;
}
.quiz-page > .quiz-progress {
  margin-top: 0 !important;
}

/* 3) Quita el control nativo que estaba produciendo el rectángulo amarillo.
      El marcador circular ya comunica la selección. */
.option-card {
  position: relative;
  isolation: isolate;
}
.option-card input[type="radio"],
.option-card input[type="checkbox"] {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  margin: -1px !important;
  padding: 0 !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  clip-path: inset(50%) !important;
  border: 0 !important;
  white-space: nowrap !important;
  opacity: 0 !important;
  accent-color: transparent !important;
}

.option-card:has(input:focus-visible) {
  outline: 3px solid color-mix(in srgb, var(--answer-tone) 38%, transparent) !important;
  outline-offset: 3px !important;
}

.option-card__marker {
  position: relative;
  z-index: 3;
  flex: 0 0 auto;
  overflow: hidden;
  border: 2px solid color-mix(in srgb, var(--answer-tone) 32%, #d7e0ea) !important;
  color: color-mix(in srgb, var(--answer-tone) 88%, #26344a) !important;
  background: linear-gradient(145deg, #fff, color-mix(in srgb, var(--answer-tone) 7%, #fff)) !important;
  box-shadow: 0 5px 13px color-mix(in srgb, var(--answer-tone) 10%, transparent) !important;
  transition: transform .24s cubic-bezier(.2,.8,.2,1), box-shadow .24s ease, border-color .24s ease, background .24s ease !important;
}
.option-card:hover .option-card__marker {
  transform: translateY(-1px) rotate(-2deg) scale(1.05) !important;
  border-color: var(--answer-tone) !important;
  box-shadow: 0 8px 18px color-mix(in srgb, var(--answer-tone) 16%, transparent) !important;
}
.option-card--selected .option-card__marker {
  border-color: var(--answer-tone) !important;
  color: #fff !important;
  background: linear-gradient(145deg, var(--answer-tone), color-mix(in srgb, var(--answer-tone) 70%, #7b1c48)) !important;
  box-shadow: 0 10px 22px color-mix(in srgb, var(--answer-tone) 25%, transparent), 0 0 0 5px color-mix(in srgb, var(--answer-tone) 9%, transparent) !important;
  animation: amvMarkerPop .42s cubic-bezier(.2,1.35,.35,1) both;
}
@keyframes amvMarkerPop {
  0% { transform: scale(.78) rotate(-5deg); }
  65% { transform: scale(1.08) rotate(2deg); }
  100% { transform: scale(1) rotate(0); }
}

/* 4) Respuestas aún más "game show": tarjetas asimétricas, glow y profundidad. */
.options-list {
  perspective: 1100px;
}
.option-card {
  min-height: 98px !important;
  border-radius: 25px !important;
  border-width: 2px !important;
  box-shadow:
    0 10px 24px rgba(25,35,56,.055),
    inset 0 1px 0 rgba(255,255,255,.98) !important;
  transition:
    transform .28s cubic-bezier(.2,.85,.25,1.2),
    border-color .25s ease,
    box-shadow .25s ease,
    background .25s ease !important;
}
.option-card:nth-child(4n + 1) { --answer-tone:#ff477e !important; --answer-soft:rgba(255,71,126,.10); }
.option-card:nth-child(4n + 2) { --answer-tone:#6f5eea !important; --answer-soft:rgba(111,94,234,.10); }
.option-card:nth-child(4n + 3) { --answer-tone:#2db8c0 !important; --answer-soft:rgba(45,184,192,.10); }
.option-card:nth-child(4n + 4) { --answer-tone:#f0ad3b !important; --answer-soft:rgba(240,173,59,.11); }
.option-card::before {
  width: 9px !important;
  background: linear-gradient(180deg, color-mix(in srgb, var(--answer-tone) 92%, #fff), var(--answer-tone)) !important;
  box-shadow: 0 0 20px color-mix(in srgb, var(--answer-tone) 24%, transparent) !important;
}
.option-card::after {
  top: -90px !important;
  right: -90px !important;
  width: 190px !important;
  height: 190px !important;
  background: radial-gradient(circle, var(--answer-soft), transparent 69%) !important;
  opacity: .9 !important;
  transition: transform .45s cubic-bezier(.2,.8,.2,1), opacity .35s ease !important;
}
.option-card:hover::after,
.option-card--selected::after {
  transform: scale(1.18) translate(-6px, 5px) !important;
  opacity: 1 !important;
}
.option-card--selected {
  transform: translateY(-4px) scale(1.012) !important;
  box-shadow:
    0 18px 40px color-mix(in srgb, var(--answer-tone) 18%, transparent),
    0 0 0 4px color-mix(in srgb, var(--answer-tone) 8%, transparent),
    inset 0 1px 0 rgba(255,255,255,.98) !important;
  background: linear-gradient(135deg, color-mix(in srgb, var(--answer-tone) 10%, #fff) 0%, #fff 76%) !important;
}
.option-card strong {
  position: relative;
  z-index: 3;
  color: #17243a !important;
  font-size: .87rem !important;
  line-height: 1.5 !important;
}

/* 5) Matching: deixa de parecer um formulário e passa a parecer um desafio. */
.matching-question,
.ordering-question {
  position: relative;
}
.matching-question::before {
  position: absolute;
  top: -8px;
  right: 0;
  width: 110px;
  height: 110px;
  border-radius: 50%;
  content: '';
  background: radial-gradient(circle, rgba(111,94,234,.12), transparent 68%);
  filter: blur(2px);
  animation: matchingFloat 6s ease-in-out infinite alternate;
  pointer-events: none;
}
@keyframes matchingFloat {
  from { transform: translate3d(6px,0,0) scale(.92); opacity:.5; }
  to { transform: translate3d(-8px,10px,0) scale(1.08); opacity:1; }
}
.matching-question__intro {
  position: relative;
  z-index: 2;
  overflow: hidden;
  border: 1px solid #e5dff2 !important;
  border-radius: 20px !important;
  padding: 15px 16px !important;
  background:
    linear-gradient(135deg, rgba(111,94,234,.055), rgba(45,184,192,.04)),
    #fbfcff !important;
  box-shadow: 0 10px 24px rgba(78,70,126,.045) !important;
}
.matching-question__intro::after {
  position: absolute;
  inset: auto -40px -42px auto;
  width: 120px;
  height: 120px;
  border: 1px solid rgba(111,94,234,.10);
  border-radius: 50%;
  content: '';
  animation: matchingOrbit 7s linear infinite;
  pointer-events: none;
}
@keyframes matchingOrbit { to { transform: rotate(360deg); } }
.matching-question__intro > strong {
  display: grid;
  width: 48px;
  min-height: 42px;
  place-items: center;
  border: 1px solid #e4d79d;
  border-radius: 14px;
  color: #806000 !important;
  background: #fff9e8;
  box-shadow: 0 7px 16px rgba(217,169,29,.10);
}
.matching-question__list {
  position: relative;
  z-index: 2;
  gap: 11px !important;
}
.matching-question__row {
  position: relative;
  overflow: hidden;
  min-height: 82px !important;
  padding: 12px 14px !important;
  border: 2px solid #e2e8ef !important;
  border-radius: 22px !important;
  background: linear-gradient(135deg,#fff,#fbfcfe) !important;
  box-shadow: 0 9px 22px rgba(31,48,73,.045) !important;
  transition: transform .26s cubic-bezier(.2,.85,.25,1.2), border-color .22s ease, box-shadow .22s ease, background .22s ease !important;
}
.matching-question__row::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 6px;
  border-radius: inherit;
  content: '';
  background: linear-gradient(180deg, #ff477e, #6f5eea);
  opacity: .88;
}
.matching-question__row:nth-child(2n)::before { background: linear-gradient(180deg,#6f5eea,#2db8c0); }
.matching-question__row:nth-child(3n)::before { background: linear-gradient(180deg,#2db8c0,#f0ad3b); }
.matching-question__row:nth-child(4n)::before { background: linear-gradient(180deg,#f0ad3b,#ff477e); }
.matching-question__row:hover {
  transform: translateY(-4px) scale(1.005) !important;
  border-color: #c9d4df !important;
  box-shadow: 0 17px 34px rgba(31,48,73,.08) !important;
}
.matching-question__row--complete {
  border-color: #a9d9bf !important;
  background: linear-gradient(135deg,#f9fffc,#ffffff) !important;
  box-shadow: 0 14px 28px rgba(45,138,99,.09) !important;
}
.matching-question__number {
  width: 38px !important;
  height: 38px !important;
  border-radius: 12px !important;
  color: #fff !important;
  background: linear-gradient(145deg,#ff477e,#b51e56) !important;
  box-shadow: 0 8px 16px rgba(255,71,126,.16) !important;
}
.matching-question__row:nth-child(2n) .matching-question__number { background: linear-gradient(145deg,#6f5eea,#5044ad) !important; box-shadow:0 8px 16px rgba(111,94,234,.15) !important; }
.matching-question__row:nth-child(3n) .matching-question__number { background: linear-gradient(145deg,#2db8c0,#208891) !important; box-shadow:0 8px 16px rgba(45,184,192,.15) !important; }
.matching-question__row:nth-child(4n) .matching-question__number { background: linear-gradient(145deg,#f0ad3b,#c27e16) !important; box-shadow:0 8px 16px rgba(240,173,59,.15) !important; }
.matching-question__row > strong {
  position: relative;
  z-index: 2;
  color: #23324a !important;
  font-size: .86rem !important;
}
.matching-question__arrow {
  position: relative;
  z-index: 2;
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid #e9d796;
  border-radius: 50%;
  color: #a97800 !important;
  background: #fffaf0;
  animation: arrowBreathe 2.4s ease-in-out infinite;
}
@keyframes arrowBreathe { 0%,100%{ transform:translateX(0); } 50%{ transform:translateX(3px); } }
.matching-question__row select {
  position: relative;
  z-index: 2;
  min-height: 50px !important;
  padding: 0 42px 0 15px !important;
  border: 2px solid #d8e1ea !important;
  border-radius: 15px !important;
  color: #33445d !important;
  background:
    linear-gradient(135deg,#fff,#f8fafc) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.95), 0 6px 14px rgba(31,48,73,.025) !important;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease !important;
}
.matching-question__row select:hover,
.matching-question__row select:focus {
  border-color: #8e7adf !important;
  box-shadow: 0 0 0 4px rgba(111,94,234,.08), 0 9px 18px rgba(111,94,234,.07) !important;
  outline: none !important;
}
.matching-question__row--complete select {
  border-color: #a8d7bb !important;
  background: #f6fff9 !important;
}
.matching-question__clear {
  position: relative;
  z-index: 3;
  width: 34px !important;
  height: 34px !important;
  min-height: 34px !important;
  border-radius: 11px !important;
  transition: transform .2s ease, border-color .2s ease, background .2s ease !important;
}
.matching-question__clear:hover {
  transform: rotate(8deg) scale(1.06);
}

/* 6) Footer de la pregunta: más juego, menos formulario. */
.question-actions {
  border-top: 1px solid #edf0f4 !important;
  background: linear-gradient(180deg,#fbfcfe,#f7f9fc) !important;
}
.question-actions .button {
  min-height: 50px !important;
  border-radius: 16px !important;
  transition: transform .22s cubic-bezier(.2,.8,.2,1), box-shadow .22s ease, border-color .2s ease !important;
}
.question-actions .button--primary {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg,#b11755,#8d1943) !important;
  box-shadow: 0 12px 24px rgba(159,25,69,.19) !important;
}
.question-actions .button--primary::after {
  position: absolute;
  top: -45%;
  left: -20%;
  width: 20%;
  height: 190%;
  content: '';
  background: linear-gradient(90deg,transparent,rgba(255,255,255,.42),transparent);
  transform: rotate(14deg) translateX(-120%);
  pointer-events: none;
}
.question-actions .button--primary:hover:not(:disabled) {
  transform: translateY(-3px) scale(1.015) !important;
  box-shadow: 0 17px 30px rgba(159,25,69,.24) !important;
}
.question-actions .button--primary:hover:not(:disabled)::after {
  animation: nextButtonSweep .72s ease;
}
@keyframes nextButtonSweep { to { transform:rotate(14deg) translateX(500%); } }

/* 7) El progreso queda como HUD central y con mayor jerarquía. */
.quiz-progress {
  border-radius: 26px !important;
  box-shadow: 0 18px 42px rgba(31,48,73,.065), inset 0 1px 0 rgba(255,255,255,.98) !important;
}
.quiz-progress__heading b {
  display: inline-flex;
  min-width: 52px;
  min-height: 34px;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  border: 1px solid #ead79c;
  border-radius: 999px;
  color: #806000 !important;
  background: #fff9e9;
  box-shadow: 0 7px 16px rgba(217,169,29,.08);
}
.quiz-progress__question-map {
  padding-top: .8rem !important;
  margin-top: .75rem !important;
}
.quiz-quick-dot {
  flex-basis: 52px !important;
  width: 52px !important;
  min-height: 52px !important;
  border-radius: 16px !important;
  box-shadow: 0 7px 16px rgba(31,48,73,.04) !important;
}
.quiz-quick-dot:hover {
  transform: translateY(-4px) rotate(-1deg) scale(1.04) !important;
}

/* 8) Mobile: conservar el look de juego, sin apretar controles. */
@media (max-width: 720px) {
  .quiz-page {
    padding-top: .15rem !important;
  }
  .quiz-topbar {
    margin-bottom: 10px !important;
  }
  .question-panel {
    border-radius: 24px !important;
  }
  .question-content {
    padding: 18px 14px !important;
  }
  .options-list {
    gap: 10px !important;
  }
  .option-card {
    min-height: 86px !important;
    padding: 12px 14px !important;
    border-radius: 20px !important;
  }
  .option-card__marker {
    width: 40px !important;
    height: 40px !important;
  }
  .matching-question__row {
    min-height: auto !important;
    padding: 12px !important;
  }
  .matching-question__row select {
    min-height: 52px !important;
  }
  .quiz-quick-dot {
    flex-basis: 46px !important;
    width: 46px !important;
    min-height: 46px !important;
  }
}

@media (max-width: 520px) {
  .quiz-topbar__status {
    font-size: .56rem !important;
  }
  .question-content h2 {
    font-size: clamp(1.6rem, 8vw, 2.1rem) !important;
  }
  .option-card strong {
    font-size: .81rem !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .matching-question::before,
  .matching-question__intro::after,
  .matching-question__arrow,
  .option-card--selected .option-card__marker {
    animation: none !important;
  }
}



/* =========================================================
   V15 · AMV GAME EXPERIENCE · VISUAL FINISH
   - Custom dropdown for matching (no native browser popup)
   - Deeper game-show hierarchy
   - Refined ordering cards
   - Removes residual form-like visual language
========================================================= */

.quiz-page {
  --amv-game-coral: #ff477e;
  --amv-game-violet: #725be8;
  --amv-game-cyan: #2bbcc4;
  --amv-game-gold: #f0ad3b;
  --amv-game-ink: #152033;
  position: relative;
  isolation: isolate;
}

.quiz-page::before,
.quiz-page::after {
  position: fixed;
  z-index: -1;
  width: 330px;
  height: 330px;
  border-radius: 50%;
  content: '';
  pointer-events: none;
  filter: blur(26px);
  opacity: .34;
}

.quiz-page::before {
  top: 9vh;
  left: -170px;
  background: radial-gradient(circle, rgba(255,71,126,.16), transparent 67%);
  animation: amvPageAura 10s ease-in-out infinite alternate;
}

.quiz-page::after {
  right: -170px;
  bottom: 6vh;
  background: radial-gradient(circle, rgba(111,94,234,.14), transparent 67%);
  animation: amvPageAura 12s ease-in-out infinite alternate-reverse;
}

@keyframes amvPageAura {
  from { transform: translate3d(0,0,0) scale(.88); }
  to { transform: translate3d(40px,-22px,0) scale(1.08); }
}

/* Matching: custom selector, fully controlled visually */
.matching-question__concept {
  position: relative;
  z-index: 2;
  min-width: 0;
  display: grid;
  gap: 3px;
}

.matching-question__concept > span {
  color: #9b7890;
  font-size: .47rem;
  font-weight: 950;
  letter-spacing: .12em;
}

.matching-question__concept strong {
  color: #1f2e46 !important;
  font-size: .92rem !important;
  line-height: 1.35;
}

.matching-select {
  position: relative;
  z-index: 5;
  min-width: 0;
}

.matching-select[open] {
  z-index: 30;
}

.matching-select__trigger {
  display: flex;
  width: 100%;
  min-height: 52px;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px 0 16px;
  overflow: hidden;
  border: 2px solid #d8e1ea;
  border-radius: 16px;
  color: #33445d;
  background: linear-gradient(135deg,#fff,#f8fafc);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.96), 0 7px 17px rgba(31,48,73,.035);
  cursor: pointer;
  list-style: none;
  transition: border-color .2s ease, box-shadow .2s ease, transform .2s ease, background .2s ease;
}

.matching-select__trigger::-webkit-details-marker {
  display: none;
}

.matching-select__trigger::after {
  display: block;
  width: 8px;
  height: 8px;
  flex: 0 0 8px;
  margin-left: auto;
  border-right: 2px solid #7a8799;
  border-bottom: 2px solid #7a8799;
  content: '';
  transform: translateY(-2px) rotate(45deg);
  transition: transform .2s ease, border-color .2s ease;
}

.matching-select__trigger > b {
  display: none;
}

.matching-select[open] .matching-select__trigger {
  border-color: #7a68db;
  background: linear-gradient(135deg,#fff,#f7f4ff);
  box-shadow: 0 0 0 4px rgba(114,91,232,.08), 0 12px 26px rgba(114,91,232,.08);
}

.matching-select[open] .matching-select__trigger::after {
  border-color: #6a57cd;
  transform: translateY(2px) rotate(225deg);
}

.matching-select__trigger > span {
  min-width: 0;
  overflow: hidden;
  color: #31415a;
  font-size: .78rem;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.matching-select__trigger .matching-select__placeholder {
  color: #8995a6;
  font-weight: 550;
}

.matching-select__menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  left: 0;
  max-height: 280px;
  overflow: auto;
  padding: 7px;
  border: 1px solid #dfe5ee;
  border-radius: 18px;
  background: rgba(255,255,255,.98);
  box-shadow: 0 22px 44px rgba(24,34,54,.14), 0 0 0 1px rgba(114,91,232,.04);
  backdrop-filter: blur(16px);
  animation: amvDropdownIn .18s cubic-bezier(.2,.9,.2,1);
}

@keyframes amvDropdownIn {
  from { opacity: 0; transform: translateY(-6px) scale(.985); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

.matching-select__option {
  display: grid;
  width: 100%;
  min-height: 44px;
  grid-template-columns: 10px minmax(0,1fr) auto;
  gap: 10px;
  align-items: center;
  padding: 9px 10px;
  border: 0;
  border-radius: 12px;
  color: #25344b;
  background: transparent;
  font: inherit;
  font-size: .73rem;
  font-weight: 700;
  text-align: left;
  cursor: pointer;
  transition: background .16s ease, transform .16s ease, color .16s ease;
}

.matching-select__option:hover:not(:disabled) {
  color: #7440a8;
  background: linear-gradient(90deg,#f4efff,#fbf8ff);
  transform: translateX(2px);
}

.matching-select__option:disabled {
  color: #b0b8c4;
  cursor: not-allowed;
  opacity: .55;
}

.matching-select__option--selected {
  color: #8e1746 !important;
  background: linear-gradient(90deg,#fff0f5,#fff9fb);
}

.matching-select__option-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #dfe5ec;
  transition: transform .18s ease, background .18s ease;
}

.matching-select__option:hover:not(:disabled) .matching-select__option-dot {
  background: #725be8;
  transform: scale(1.35);
}

.matching-select__option--selected .matching-select__option-dot {
  background: #ff477e;
  box-shadow: 0 0 0 4px rgba(255,71,126,.09);
}

.matching-select__option > b {
  color: #2d8a63;
}

.matching-question__clear {
  border-color: #e4dce2 !important;
  color: #9d7088 !important;
  background: #fff !important;
  box-shadow: 0 6px 12px rgba(31,48,73,.04);
}

.matching-question__clear:hover {
  border-color: #f0a6b8 !important;
  color: #c33a68 !important;
  background: #fff3f6 !important;
  box-shadow: 0 8px 16px rgba(255,71,126,.10);
}

/* Ordering: more game-board, less list */
.ordering-question {
  position: relative;
  padding-top: 2px;
}

.ordering-question::before {
  position: absolute;
  top: -18px;
  left: 45%;
  width: 220px;
  height: 70px;
  border-radius: 50%;
  content: '';
  background: radial-gradient(circle, rgba(255,71,126,.10), transparent 68%);
  filter: blur(8px);
  pointer-events: none;
  animation: amvOrderGlow 5.5s ease-in-out infinite alternate;
}

@keyframes amvOrderGlow {
  from { transform: translateX(-18px) scale(.9); opacity:.55; }
  to { transform: translateX(18px) scale(1.1); opacity:1; }
}

.ordering-question__list {
  gap: 12px !important;
  perspective: 1200px;
}

.ordering-question__item {
  position: relative;
  overflow: hidden;
  min-height: 76px !important;
  padding: 11px 14px !important;
  border: 2px solid #e0e7ee !important;
  border-radius: 22px !important;
  background: linear-gradient(135deg,#fff 0%,#fcfdff 72%,#faf7ff 100%) !important;
  box-shadow: 0 9px 22px rgba(31,48,73,.045), inset 0 1px 0 rgba(255,255,255,.95) !important;
  transition: transform .28s cubic-bezier(.2,.86,.25,1.15), border-color .22s ease, box-shadow .22s ease, background .22s ease !important;
}

.ordering-question__item::before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 7px;
  content: '';
  background: linear-gradient(180deg,#ff477e,#725be8);
  opacity: .9;
}

.ordering-question__item:nth-child(2)::before { background: linear-gradient(180deg,#725be8,#2bbcc4); }
.ordering-question__item:nth-child(3)::before { background: linear-gradient(180deg,#2bbcc4,#f0ad3b); }
.ordering-question__item:nth-child(4)::before { background: linear-gradient(180deg,#f0ad3b,#ff477e); }
.ordering-question__item:nth-child(5)::before { background: linear-gradient(180deg,#ff477e,#2bbcc4); }

.ordering-question__item:hover {
  transform: translateY(-4px) rotateX(1deg);
  border-color: #ccd7e2 !important;
  box-shadow: 0 18px 34px rgba(31,48,73,.09), 0 0 0 3px rgba(114,91,232,.035) !important;
}

.ordering-question__item--dragging {
  opacity: .72;
  transform: scale(.985) rotate(-.4deg) !important;
  box-shadow: 0 20px 36px rgba(31,48,73,.14) !important;
}

.ordering-question__position {
  position: relative;
  z-index: 2;
  width: 40px !important;
  height: 40px !important;
  border-radius: 13px !important;
  color: #fff !important;
  background: linear-gradient(145deg,#ff477e,#c41c5d) !important;
  box-shadow: 0 10px 18px rgba(255,71,126,.16);
}

.ordering-question__item:nth-child(2) .ordering-question__position { background: linear-gradient(145deg,#725be8,#5142b6) !important; box-shadow:0 10px 18px rgba(114,91,232,.15); }
.ordering-question__item:nth-child(3) .ordering-question__position { background: linear-gradient(145deg,#2bbcc4,#208f96) !important; box-shadow:0 10px 18px rgba(43,188,196,.15); }
.ordering-question__item:nth-child(4) .ordering-question__position { background: linear-gradient(145deg,#f0ad3b,#c58318) !important; box-shadow:0 10px 18px rgba(240,173,59,.15); }
.ordering-question__item:nth-child(5) .ordering-question__position { background: linear-gradient(145deg,#ff477e,#2bbcc4) !important; }

.ordering-question__handle {
  position: relative;
  z-index: 2;
  color: #a6b0bd !important;
  transition: color .18s ease, transform .18s ease;
}

.ordering-question__item:hover .ordering-question__handle {
  color: #725be8 !important;
  transform: scale(1.08);
}

.ordering-question__item > strong {
  position: relative;
  z-index: 2;
  color: #203048 !important;
  font-size: .88rem !important;
}

.ordering-question__controls {
  position: relative;
  z-index: 3;
}

.ordering-question__controls button {
  width: 38px !important;
  height: 38px !important;
  min-height: 38px !important;
  border: 1px solid #d9e2ea !important;
  border-radius: 12px !important;
  color: #5e6d80 !important;
  background: rgba(255,255,255,.92) !important;
  box-shadow: 0 5px 12px rgba(31,48,73,.04);
  transition: transform .18s ease, border-color .18s ease, color .18s ease, background .18s ease;
}

.ordering-question__controls button:hover:not(:disabled) {
  color: #9f1945 !important;
  border-color: #ddb5c5 !important;
  background: #fff3f6 !important;
  transform: translateY(-2px) scale(1.05);
}

.ordering-question__footer {
  padding-top: 8px !important;
}

.interactive-secondary,
.interactive-primary {
  min-height: 46px !important;
  border-radius: 15px !important;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease !important;
}

.interactive-primary {
  position: relative;
  overflow: hidden;
  border-color: #9f1945 !important;
  background: linear-gradient(135deg,#c01c5a,#8f173f) !important;
  box-shadow: 0 12px 24px rgba(159,25,69,.18) !important;
}

.interactive-primary::after {
  position: absolute;
  top: -60%;
  left: -25%;
  width: 28%;
  height: 220%;
  content: '';
  background: linear-gradient(90deg,transparent,rgba(255,255,255,.36),transparent);
  transform: rotate(14deg) translateX(-180%);
  pointer-events: none;
}

.interactive-primary:hover {
  transform: translateY(-3px) scale(1.015);
  box-shadow: 0 17px 31px rgba(159,25,69,.24) !important;
}

.interactive-primary:hover::after {
  animation: amvPrimarySweep .72s ease;
}

@keyframes amvPrimarySweep { to { transform: rotate(14deg) translateX(560%); } }

/* Close the browser-default feel on details and focus states */
.matching-select__trigger:focus-visible,
.matching-select__option:focus-visible,
.matching-question__clear:focus-visible {
  outline: 3px solid rgba(114,91,232,.25);
  outline-offset: 3px;
}

/* Mobile */
@media (max-width: 760px) {
  .matching-question__row {
    grid-template-columns: 38px minmax(0,1fr) 30px !important;
  }

  .matching-question__concept {
    grid-column: 2 / -1;
  }

  .matching-question__arrow {
    grid-column: 2 / 3 !important;
    grid-row: 2;
    justify-self: start;
    transform: rotate(90deg);
  }

  .matching-select {
    grid-column: 2 / -1;
    grid-row: 3;
  }

  .matching-question__clear {
    grid-column: 3 / 4;
    grid-row: 3;
  }

  .matching-select__menu {
    position: fixed;
    top: auto;
    right: 12px;
    bottom: 12px;
    left: 12px;
    width: auto;
    max-height: min(55dvh, 360px);
  }

  .ordering-question__item {
    grid-template-columns: 40px 22px minmax(0,1fr) !important;
    row-gap: 8px;
  }

  .ordering-question__controls {
    grid-column: 3;
    justify-content: flex-end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-page::before,
  .quiz-page::after,
  .ordering-question::before {
    animation: none !important;
  }
}



/* =========================================================
   V17 · AMV SAAS PREMIUM SIDEBAR
   Sidebar + resumen + autosave · visual only
========================================================= */

.question-sidebar {
  position: sticky !important;
  top: 18px !important;
  display: grid !important;
  gap: 14px !important;
  align-self: start !important;
  min-width: 0 !important;
}

.navigator-card,
.summary-card,
.autosave-card {
  position: relative !important;
  overflow: hidden !important;
  border: 1px solid rgba(216, 224, 234, 0.95) !important;
  border-radius: 22px !important;
  background:
    radial-gradient(circle at 100% 0%, rgba(159,25,69,.045), transparent 34%),
    linear-gradient(180deg, rgba(255,255,255,.99), rgba(249,251,253,.99)) !important;
  box-shadow:
    0 16px 40px rgba(31,48,73,.055),
    inset 0 1px 0 rgba(255,255,255,.92) !important;
  transform: translateZ(0);
  transition:
    transform .28s cubic-bezier(.22,.61,.36,1),
    box-shadow .28s ease,
    border-color .28s ease;
}

.navigator-card::before,
.summary-card::before,
.autosave-card::before {
  position: absolute;
  top: 0;
  left: 24px;
  right: 24px;
  height: 3px;
  border-radius: 0 0 999px 999px;
  content: '';
  background: linear-gradient(90deg, #9f1945 0%, #8157d7 48%, #2fa7a4 100%);
  opacity: .86;
}

.navigator-card::after,
.summary-card::after {
  position: absolute;
  width: 110px;
  height: 110px;
  right: -55px;
  top: -58px;
  border: 1px solid rgba(129,87,215,.10);
  border-radius: 50%;
  content: '';
  pointer-events: none;
}

.navigator-card:hover,
.summary-card:hover {
  transform: translateY(-2px);
  border-color: rgba(201, 211, 223, .98) !important;
  box-shadow:
    0 22px 48px rgba(31,48,73,.075),
    inset 0 1px 0 rgba(255,255,255,.96) !important;
}

.navigator-card,
.summary-card {
  padding: 18px !important;
}

.navigator-card__eyebrow {
  position: relative;
  z-index: 2;
  display: flex !important;
  align-items: center;
  gap: 8px !important;
  margin: 0 0 13px !important;
  color: #8f6a00 !important;
  font-size: .53rem !important;
  font-weight: 950 !important;
  letter-spacing: .14em !important;
}

.navigator-card__eyebrow::before {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  content: '';
  background: #d9a91d;
  box-shadow: 0 0 0 4px rgba(217,169,29,.10);
}

/* -------------------------
   RESUMEN · STAT ROWS
------------------------- */

.summary-card {
  padding: 19px 18px 18px !important;
}

.summary-card .navigator-card__eyebrow {
  margin-bottom: 7px !important;
}

.summary-row {
  position: relative;
  display: flex !important;
  min-height: 54px !important;
  gap: 16px !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding: 11px 0 !important;
  border-bottom: 1px solid rgba(229,235,241,.96) !important;
  isolation: isolate;
}

.summary-row::after {
  position: absolute;
  inset: 6px -7px;
  z-index: -1;
  border-radius: 13px;
  content: '';
  background: linear-gradient(90deg, rgba(159,25,69,.00), rgba(129,87,215,.055), rgba(47,167,164,.00));
  opacity: 0;
  transform: scaleX(.96);
  transform-origin: center;
  transition: opacity .2s ease, transform .2s ease;
}

.summary-row:hover::after {
  opacity: 1;
  transform: scaleX(1);
}

.summary-row:last-of-type {
  border-bottom: 0 !important;
}

.summary-row span {
  color: #69788d !important;
  font-size: .72rem !important;
  font-weight: 700 !important;
  line-height: 1.45 !important;
}

.summary-row strong {
  position: relative;
  display: inline-grid;
  min-width: 34px;
  height: 34px;
  place-items: center;
  padding: 0 8px;
  border: 1px solid #eadca8;
  border-radius: 11px;
  color: #916d00 !important;
  background: linear-gradient(160deg, #fffdf7, #fff8e7) !important;
  box-shadow:
    0 5px 12px rgba(143,106,0,.06),
    inset 0 1px 0 rgba(255,255,255,.92);
  font-size: .9rem !important;
  font-weight: 950 !important;
  line-height: 1;
}

.summary-row:first-of-type strong {
  border-color: #cde5d9;
  color: #2d8a63 !important;
  background: linear-gradient(160deg, #ffffff, #edf8f3) !important;
  box-shadow: 0 5px 12px rgba(45,138,99,.07);
}

.summary-row:nth-of-type(3) strong {
  border-color: #efcbd1;
  color: #ae4050 !important;
  background: linear-gradient(160deg, #fff, #fff3f5) !important;
  box-shadow: 0 5px 12px rgba(174,64,80,.06);
}

/* -------------------------
   ENTREGA · CTA DE SAAS
------------------------- */

.submit-sidebar-button {
  position: relative !important;
  isolation: isolate;
  display: flex !important;
  width: 100% !important;
  min-height: 52px !important;
  gap: .75rem !important;
  align-items: center !important;
  justify-content: space-between !important;
  margin-top: 14px !important;
  padding: 0 16px 0 17px !important;
  overflow: hidden !important;
  border: 1px solid rgba(159,25,69,.95) !important;
  border-radius: 15px !important;
  color: #fff !important;
  background:
    linear-gradient(135deg, #9f1945 0%, #b31f57 48%, #8e2aa0 100%) !important;
  box-shadow:
    0 12px 26px rgba(159,25,69,.18),
    inset 0 1px 0 rgba(255,255,255,.18) !important;
  font-size: .74rem !important;
  font-weight: 950 !important;
  letter-spacing: -.01em;
  transition:
    transform .2s cubic-bezier(.22,.61,.36,1),
    box-shadow .2s ease,
    filter .2s ease;
}

.submit-sidebar-button::before {
  position: absolute;
  inset: 0;
  z-index: -1;
  content: '';
  background: linear-gradient(110deg, transparent 25%, rgba(255,255,255,.19) 47%, transparent 69%);
  transform: translateX(-120%);
  transition: transform .65s ease;
}

.submit-sidebar-button:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: saturate(1.04) brightness(1.02);
  box-shadow:
    0 16px 32px rgba(159,25,69,.22),
    0 0 0 5px rgba(159,25,69,.055),
    inset 0 1px 0 rgba(255,255,255,.20) !important;
}

.submit-sidebar-button:hover:not(:disabled)::before {
  transform: translateX(120%);
}

.submit-sidebar-button:active:not(:disabled) {
  transform: translateY(0) scale(.985);
}

.submit-sidebar-button > span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border: 1px solid rgba(255,255,255,.20);
  border-radius: 10px;
  background: rgba(255,255,255,.10);
  font-size: .8rem;
  transition: transform .2s ease, background .2s ease;
}

.submit-sidebar-button:hover:not(:disabled) > span {
  transform: translateX(3px);
  background: rgba(255,255,255,.16);
}

.submit-sidebar-button:disabled {
  transform: none !important;
  border-color: #d7dee6 !important;
  color: #9aa5b2 !important;
  background: #edf1f5 !important;
  box-shadow: none !important;
}

/* -------------------------
   AUTOSAVE · LIVE STATUS CARD
------------------------- */

.autosave-card {
  display: grid !important;
  grid-template-columns: auto minmax(0, 1fr) !important;
  gap: 12px !important;
  align-items: center !important;
  padding: 15px 15px !important;
  border-color: #cbe1d4 !important;
  background:
    radial-gradient(circle at 0% 100%, rgba(45,138,99,.07), transparent 34%),
    linear-gradient(145deg, #fbfffd 0%, #edf8f3 100%) !important;
  box-shadow:
    0 12px 28px rgba(45,138,99,.055),
    inset 0 1px 0 rgba(255,255,255,.98) !important;
}

.autosave-card::before {
  height: 2px;
  right: 34px;
  left: 34px;
  background: linear-gradient(90deg, #67bf8a, #2d8a63, #58b98d);
}

.autosave-card > div {
  position: relative;
  display: grid !important;
  width: 42px !important;
  height: 42px !important;
  place-items: center !important;
  border: 1px solid #bcdcca !important;
  border-radius: 14px !important;
  color: #2d8a63 !important;
  background: rgba(255,255,255,.88) !important;
  box-shadow:
    0 8px 18px rgba(45,138,99,.08),
    inset 0 1px 0 rgba(255,255,255,.98);
  font-size: .84rem !important;
  font-weight: 950 !important;
}

.autosave-card:not(.autosave-card--error) > div::before {
  position: absolute;
  inset: -4px;
  border: 1px solid rgba(45,138,99,.10);
  border-radius: 16px;
  content: '';
  animation: amvStatusRing 2.8s ease-in-out infinite;
}

@keyframes amvStatusRing {
  0%, 100% { transform: scale(.96); opacity: .28; }
  50% { transform: scale(1.04); opacity: .72; }
}

.autosave-card p {
  margin: 0 !important;
  color: #547565 !important;
  font-size: .67rem !important;
  font-weight: 700 !important;
  line-height: 1.55 !important;
}

.autosave-card--error {
  border-color: #efcbd1 !important;
  background: linear-gradient(145deg, #fff 0%, #fff3f5 100%) !important;
}

.autosave-card--error::before {
  background: linear-gradient(90deg, #d96b78, #be4856, #d96b78);
}

.autosave-card--error > div {
  border-color: #efcbd1 !important;
  color: #be4856 !important;
  background: #fff !important;
}

/* -------------------------
   NAVIGATOR · MINI GAME BOARD
------------------------- */

.question-grid {
  gap: 7px !important;
}

.question-dot {
  position: relative !important;
  min-height: 46px !important;
  border-radius: 13px !important;
  border-color: #d9e2ea !important;
  background: linear-gradient(160deg, #fff, #f7f9fb) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.9);
  transition:
    transform .18s ease,
    border-color .18s ease,
    box-shadow .18s ease,
    background .18s ease;
}

.question-dot:hover:not(.question-dot--current) {
  transform: translateY(-2px) scale(1.025);
  border-color: #c9d4df !important;
  box-shadow: 0 8px 18px rgba(31,48,73,.06);
}

.question-dot--current {
  border-color: #a34b75 !important;
  background: linear-gradient(145deg, #b21f57, #8f2d73) !important;
  color: #fff !important;
  box-shadow:
    0 10px 22px rgba(159,25,69,.18),
    0 0 0 4px rgba(159,25,69,.07) !important;
  animation: amvCurrentQuestion .9s ease-out;
}

@keyframes amvCurrentQuestion {
  0% { transform: scale(.93); }
  60% { transform: scale(1.035); }
  100% { transform: scale(1); }
}

.question-dot--answered {
  border-color: #a9d4bb !important;
  color: #2d8a63 !important;
  background: linear-gradient(145deg, #fff, #eef8f3) !important;
}

.question-dot > b {
  font-size: .62rem !important;
}

/* -------------------------
   MOBILE
------------------------- */

@media (max-width: 760px) {
  .question-sidebar {
    position: static !important;
    gap: 11px !important;
  }

  .navigator-card,
  .summary-card,
  .autosave-card {
    border-radius: 18px !important;
  }

  .summary-card {
    padding: 16px !important;
  }

  .summary-row {
    min-height: 52px !important;
  }

  .submit-sidebar-button {
    min-height: 54px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .navigator-card,
  .summary-card,
  .submit-sidebar-button,
  .question-dot,
  .autosave-card,
  .summary-row::after,
  .autosave-card:not(.autosave-card--error) > div::before {
    animation: none !important;
    transition: none !important;
  }
}

</style>

<style lang="scss">
/* =========================================================
   V18 · AMV STATUS LANGUAGE
   Respondida = verde · Pendiente = amarillo
   La pregunta actual conserva el estado real y añade
   una señal de foco AMV.
========================================================= */

/* -------------------------
   QUESTION NAVIGATOR
------------------------- */
.quiz-page .question-dot--pending,
.quiz-page .question-dot--pending:not(.question-dot--current) {
  border-color: #e8ce72 !important;
  color: #8a6900 !important;
  background:
    linear-gradient(145deg, #fffef8 0%, #fff4c9 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.95),
    0 5px 14px rgba(217,169,29,.08) !important;
}

.quiz-page .question-dot--pending:hover:not(.question-dot--current) {
  border-color: #d8b63b !important;
  background:
    linear-gradient(145deg, #fffefb 0%, #ffefb0 100%) !important;
  box-shadow:
    0 9px 20px rgba(217,169,29,.14),
    0 0 0 3px rgba(217,169,29,.055) !important;
}

.quiz-page .question-dot--answered,
.quiz-page .question-dot--answered:not(.question-dot--current) {
  border-color: #a6d7bb !important;
  color: #267b58 !important;
  background:
    linear-gradient(145deg, #fbfffd 0%, #dff5e8 100%) !important;
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.95),
    0 5px 14px rgba(45,138,99,.075) !important;
}

.quiz-page .question-dot--answered:hover:not(.question-dot--current) {
  border-color: #7fc39f !important;
  background:
    linear-gradient(145deg, #ffffff 0%, #d5f0df 100%) !important;
  box-shadow:
    0 9px 20px rgba(45,138,99,.13),
    0 0 0 3px rgba(45,138,99,.05) !important;
}

/* Actual + pendiente: amarillo.
   Se distingue del resto con anillo AMV y una luz suave. */
.quiz-page .question-dot--current.question-dot--pending {
  border-color: #d4a91e !important;
  color: #5f4800 !important;
  background:
    linear-gradient(145deg, #ffe990 0%, #f3c833 100%) !important;
  box-shadow:
    0 0 0 4px rgba(217,169,29,.14),
    0 12px 26px rgba(217,169,29,.22),
    inset 0 1px 0 rgba(255,255,255,.48) !important;
}

/* Actual + respondida: verde. */
.quiz-page .question-dot--current.question-dot--answered {
  border-color: #2d8a63 !important;
  color: #ffffff !important;
  background:
    linear-gradient(145deg, #3cae79 0%, #24845d 100%) !important;
  box-shadow:
    0 0 0 4px rgba(45,138,99,.13),
    0 12px 26px rgba(45,138,99,.22),
    inset 0 1px 0 rgba(255,255,255,.28) !important;
}

.quiz-page .question-dot--current.question-dot--answered > b,
.quiz-page .question-dot--current.question-dot--pending > b {
  display: none !important;
}

/* -------------------------
   SUMMARY CARD
------------------------- */
.question-sidebar .summary-row {
  position: relative;
  border-bottom-color: #e5ebf0 !important;
}

.question-sidebar .summary-row::before {
  width: 6px;
  height: 6px;
  margin-right: 3px;
  flex: 0 0 auto;
  border-radius: 50%;
  content: '';
  background: #d9a91d;
  box-shadow: 0 0 0 4px rgba(217,169,29,.08);
}

.question-sidebar .summary-row > span {
  display: flex !important;
  align-items: center;
  gap: 6px;
}

/* Respondidas · verde */
.question-sidebar .summary-row:first-of-type::before {
  background: #2d8a63;
  box-shadow: 0 0 0 4px rgba(45,138,99,.08);
}

.question-sidebar .summary-row:first-of-type strong {
  border-color: #b7dec9 !important;
  color: #267b58 !important;
  background:
    linear-gradient(160deg, #ffffff 0%, #e3f6eb 100%) !important;
  box-shadow:
    0 6px 15px rgba(45,138,99,.09),
    inset 0 1px 0 rgba(255,255,255,.98) !important;
}

/* Pendientes · amarillo */
.question-sidebar .summary-row:nth-of-type(2)::before {
  background: #d9a91d;
  box-shadow: 0 0 0 4px rgba(217,169,29,.08);
}

.question-sidebar .summary-row:nth-of-type(2) strong {
  border-color: #ead27a !important;
  color: #8a6900 !important;
  background:
    linear-gradient(160deg, #fffef9 0%, #fff3c7 100%) !important;
  box-shadow:
    0 6px 15px rgba(217,169,29,.08),
    inset 0 1px 0 rgba(255,255,255,.98) !important;
}

.question-sidebar .summary-row:nth-of-type(3) strong {
  border-color: #ead27a !important;
  color: #8a6900 !important;
  background:
    linear-gradient(160deg, #fffef9 0%, #fff3c7 100%) !important;
  box-shadow:
    0 6px 15px rgba(217,169,29,.08),
    inset 0 1px 0 rgba(255,255,255,.98) !important;
}

/* Hover de cada estado */
.question-sidebar .summary-row:first-of-type:hover::after {
  background: linear-gradient(90deg, transparent, rgba(45,138,99,.065), transparent) !important;
}

.question-sidebar .summary-row:nth-of-type(2):hover::after,
.question-sidebar .summary-row:nth-of-type(3):hover::after {
  background: linear-gradient(90deg, transparent, rgba(217,169,29,.075), transparent) !important;
}

/* -------------------------
   PEQUEÑO RESPIRO ANIMADO
------------------------- */
@keyframes amvPendingGlow {
  0%, 100% { box-shadow: 0 0 0 4px rgba(217,169,29,.11), 0 12px 24px rgba(217,169,29,.16), inset 0 1px 0 rgba(255,255,255,.48); }
  50% { box-shadow: 0 0 0 6px rgba(217,169,29,.065), 0 16px 30px rgba(217,169,29,.20), inset 0 1px 0 rgba(255,255,255,.56); }
}

@keyframes amvAnsweredGlow {
  0%, 100% { box-shadow: 0 0 0 4px rgba(45,138,99,.11), 0 12px 24px rgba(45,138,99,.16), inset 0 1px 0 rgba(255,255,255,.28); }
  50% { box-shadow: 0 0 0 6px rgba(45,138,99,.06), 0 16px 30px rgba(45,138,99,.20), inset 0 1px 0 rgba(255,255,255,.34); }
}

.quiz-page .question-dot--current.question-dot--pending {
  animation: amvPendingGlow 2.4s ease-in-out infinite;
}

.quiz-page .question-dot--current.question-dot--answered {
  animation: amvAnsweredGlow 2.4s ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  .quiz-page .question-dot--current.question-dot--pending,
  .quiz-page .question-dot--current.question-dot--answered {
    animation: none !important;
  }
}


/* =========================================================
   V20 · AMV STATUS LANGUAGE — DEFINITIVE
   🟢 respondida · 🟡 pendiente
   La posición ya no determina el color.
========================================================= */

/* QUICK NAV SUPERIOR — todos pendientes amarillos */
.quiz-page .quiz-quick-dot {
  --quick-tone: #d9a91d !important;
  border: 1px solid #e7cf73 !important;
  color: #866600 !important;
  background: linear-gradient(145deg, #fffef9 0%, #fff3c8 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.96), 0 5px 14px rgba(217,169,29,.08) !important;
}

/* Neutraliza por completo los tonos por posición que estaban heredados. */
.quiz-page .quiz-quick-dot:nth-child(4n + 1),
.quiz-page .quiz-quick-dot:nth-child(4n + 2),
.quiz-page .quiz-quick-dot:nth-child(4n + 3),
.quiz-page .quiz-quick-dot:nth-child(4n + 4) {
  --quick-tone: #d9a91d !important;
  border-color: #e7cf73 !important;
  color: #866600 !important;
  background: linear-gradient(145deg, #fffef9 0%, #fff3c8 100%) !important;
}

.quiz-page .quiz-quick-dot:hover:not(.quiz-quick-dot--current):not(.quiz-quick-dot--answered) {
  border-color: #d3af32 !important;
  color: #765800 !important;
  background: linear-gradient(145deg, #fffefa 0%, #ffefad 100%) !important;
  box-shadow: 0 9px 20px rgba(217,169,29,.13), 0 0 0 3px rgba(217,169,29,.05) !important;
}

/* Respondida = VERDE */
.quiz-page .quiz-quick-dot.quiz-quick-dot--answered,
.quiz-page .quiz-quick-dot.quiz-quick-dot--answered:not(.quiz-quick-dot--current) {
  border-color: #a9d8bc !important;
  color: #267b58 !important;
  background: linear-gradient(145deg, #fbfffd 0%, #def4e7 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.96), 0 6px 15px rgba(45,138,99,.08) !important;
}

.quiz-page .quiz-quick-dot.quiz-quick-dot--answered:hover:not(.quiz-quick-dot--current) {
  border-color: #7fbe9d !important;
  background: linear-gradient(145deg, #ffffff 0%, #d3efdf 100%) !important;
  box-shadow: 0 10px 22px rgba(45,138,99,.14), 0 0 0 3px rgba(45,138,99,.05) !important;
}

/* Actual + pendiente = AMARILLO */
.quiz-page .quiz-quick-dot.quiz-quick-dot--current:not(.quiz-quick-dot--answered) {
  border-color: #d2a91a !important;
  color: #664c00 !important;
  background: linear-gradient(145deg, #ffe98d 0%, #f1c53c 100%) !important;
  box-shadow: 0 0 0 4px rgba(217,169,29,.14), 0 10px 24px rgba(217,169,29,.19), inset 0 1px 0 rgba(255,255,255,.52) !important;
}

/* Actual + respondida = VERDE */
.quiz-page .quiz-quick-dot.quiz-quick-dot--current.quiz-quick-dot--answered {
  border-color: #2e8b65 !important;
  color: #fff !important;
  background: linear-gradient(145deg, #43b97e 0%, #23855f 100%) !important;
  box-shadow: 0 0 0 4px rgba(45,138,99,.13), 0 10px 24px rgba(45,138,99,.20), inset 0 1px 0 rgba(255,255,255,.28) !important;
}

/* NAVEGADOR LATERAL — misma regla */
.quiz-page .question-dot,
.quiz-page .question-dot--pending {
  border-color: #e7cf73 !important;
  color: #866600 !important;
  background: linear-gradient(145deg, #fffef9 0%, #fff3c8 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.96), 0 5px 14px rgba(217,169,29,.08) !important;
}

.quiz-page .question-dot:hover:not(.question-dot--current):not(.question-dot--answered) {
  border-color: #d3af32 !important;
  color: #765800 !important;
  background: linear-gradient(145deg, #fffefa 0%, #ffefad 100%) !important;
  box-shadow: 0 9px 20px rgba(217,169,29,.13), 0 0 0 3px rgba(217,169,29,.05) !important;
}

.quiz-page .question-dot.question-dot--answered,
.quiz-page .question-dot.question-dot--answered:not(.question-dot--current) {
  border-color: #a9d8bc !important;
  color: #267b58 !important;
  background: linear-gradient(145deg, #fbfffd 0%, #def4e7 100%) !important;
  box-shadow: inset 0 1px 0 rgba(255,255,255,.96), 0 6px 15px rgba(45,138,99,.08) !important;
}

.quiz-page .question-dot.question-dot--answered:hover:not(.question-dot--current) {
  border-color: #7fbe9d !important;
  background: linear-gradient(145deg, #ffffff 0%, #d3efdf 100%) !important;
  box-shadow: 0 10px 22px rgba(45,138,99,.14), 0 0 0 3px rgba(45,138,99,.05) !important;
}

.quiz-page .question-dot.question-dot--current:not(.question-dot--answered) {
  border-color: #d2a91a !important;
  color: #664c00 !important;
  background: linear-gradient(145deg, #ffe98d 0%, #f1c53c 100%) !important;
  box-shadow: 0 0 0 4px rgba(217,169,29,.14), 0 10px 24px rgba(217,169,29,.19), inset 0 1px 0 rgba(255,255,255,.52) !important;
}

.quiz-page .question-dot.question-dot--current.question-dot--answered {
  border-color: #2e8b65 !important;
  color: #fff !important;
  background: linear-gradient(145deg, #43b97e 0%, #23855f 100%) !important;
  box-shadow: 0 0 0 4px rgba(45,138,99,.13), 0 10px 24px rgba(45,138,99,.20), inset 0 1px 0 rgba(255,255,255,.28) !important;
}

/* Estados y leyenda */
.quiz-page .quiz-quick-dot--answered i,
.quiz-page .question-dot--answered b {
  color: currentColor !important;
  opacity: .95;
}

.quiz-page .legend-box--current,
.quiz-page .legend-box--pending {
  border-color: #d9a91d !important;
  background: #ffe88a !important;
}

.quiz-page .legend-box--answered {
  border-color: #83bf9f !important;
  background: #d9f0e1 !important;
}

@keyframes amvStatusPulse {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-1px) scale(1.025); }
}

.quiz-page .quiz-quick-dot--current,
.quiz-page .question-dot--current {
  animation: amvStatusPulse 2.6s ease-in-out infinite !important;
}

@media (prefers-reduced-motion: reduce) {
  .quiz-page .quiz-quick-dot--current,
  .quiz-page .question-dot--current {
    animation: none !important;
  }
}

</style>
