import { supabase } from '@/lib/supabase'

/* =========================================================
   HELPERS
========================================================= */

const parseId = value => {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null
}

const throwServiceError = (
  message,
  error,
) => {
  console.error(
    message,
    error,
  )

  throw new Error(
    error?.message ||
    message,
  )
}

const normalizeStudentQuiz = quiz => {
  if (!quiz) {
    return null
  }

  return {
    id:
      Number(quiz.id),

    lessonId:
      Number(quiz.lessonId),

    title:
      quiz.title || '',

    description:
      quiz.description || '',

    assessmentType:
      quiz.assessmentType || 'quiz',

    status:
      quiz.status || 'published',

    totalPoints:
      Number(quiz.totalPoints || 0),

    passingPercentage:
      quiz.passingPercentage === null
        ? null
        : Number(
          quiz.passingPercentage,
        ),

    attemptsAllowed:
      quiz.attemptsAllowed === null
        ? null
        : Number(
          quiz.attemptsAllowed,
        ),

    timeLimitMinutes:
      quiz.timeLimitMinutes === null
        ? null
        : Number(
          quiz.timeLimitMinutes,
        ),

    opensAt:
      quiz.opensAt || null,

    closesAt:
      quiz.closesAt || null,

    shuffleQuestions:
      Boolean(
        quiz.shuffleQuestions,
      ),

    showScoreAfterSubmit:
      Boolean(
        quiz.showScoreAfterSubmit,
      ),

    showCorrectAnswers:
      Boolean(
        quiz.showCorrectAnswers,
      ),
  }
}

const normalizeStudentOption =
  option => {
    if (!option) {
      return null
    }

    return {
      id:
        Number(option.id),

      questionId:
        Number(
          option.questionId,
        ),

      text:
        option.text || '',

      position:
        Number(
          option.position || 1,
        ),
    }
  }

const normalizeStudentQuestion =
  question => {
    if (!question) {
      return null
    }

    return {
      id:
        Number(question.id),

      quizId:
        Number(question.quizId),

      type:
        question.type ||
        'single_choice',

      prompt:
        question.prompt || '',

      points:
        Number(
          question.points || 0,
        ),

      position:
        Number(
          question.position || 1,
        ),

      required:
        Boolean(
          question.required,
        ),

      mediaType:
        question.mediaType ||
        'none',

      mediaUrl:
        question.mediaUrl || '',

      options:
        Array.isArray(
          question.options,
        )
          ? question.options
            .map(
              normalizeStudentOption,
            )
            .sort(
              (a, b) =>
                a.position -
                b.position,
            )
          : [],
    }
  }

const normalizeAttempt =
  attempt => {
    if (!attempt) {
      return null
    }

    return {
      id:
        Number(attempt.id),

      quizId:
        Number(attempt.quizId),

      studentId:
        Number(
          attempt.studentId,
        ),

      attemptNumber:
        Number(
          attempt.attemptNumber ||
          1,
        ),

      status:
        attempt.status ||
        'in_progress',

      score:
        attempt.score === null ||
          attempt.score === undefined
          ? null
          : Number(
            attempt.score,
          ),

      maxScore:
        attempt.maxScore === null ||
          attempt.maxScore === undefined
          ? null
          : Number(
            attempt.maxScore,
          ),

      percentage:
        attempt.percentage === null ||
          attempt.percentage === undefined
          ? null
          : Number(
            attempt.percentage,
          ),

      passed:
        attempt.passed === null ||
          attempt.passed === undefined
          ? null
          : Boolean(
            attempt.passed,
          ),

      startedAt:
        attempt.startedAt ||
        null,

      submittedAt:
        attempt.submittedAt ||
        null,

      gradedAt:
        attempt.gradedAt ||
        null,

      resumed:
        Boolean(
          attempt.resumed,
        ),

      requiresManualGrading:
        Boolean(
          attempt
            .requiresManualGrading,
        ),
    }
  }

const normalizeAnswer =
  answer => {
    if (!answer) {
      return null
    }

    return {
      id:
        answer.id
          ? Number(answer.id)
          : null,

      attemptId:
        Number(
          answer.attemptId,
        ),

      questionId:
        Number(
          answer.questionId,
        ),

      selectedOptionIds:
        Array.isArray(
          answer.selectedOptionIds,
        )
          ? answer.selectedOptionIds
            .map(Number)
            .filter(
              Number.isFinite,
            )
          : [],

      textAnswer:
        answer.textAnswer ||
        '',

      savedAt:
        answer.savedAt ||
        answer.updatedAt ||
        null,

      updatedAt:
        answer.updatedAt ||
        answer.savedAt ||
        null,
    }
  }

/* =========================================================
   OBTENER CONTENIDO SEGURO PARA EL ALUMNO

   IMPORTANTE:
   Esta función NO recibe is_correct ni explanation.
========================================================= */

export async function fetchStudentQuizContent(
  quizId,
) {
  const parsedQuizId =
    parseId(quizId)

  if (!parsedQuizId) {
    throw new Error(
      'La evaluación no es válida.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'get_student_quiz_content',
      {
        p_quiz_id:
          parsedQuizId,
      },
    )

  if (error) {
    throwServiceError(
      'No fue posible cargar la evaluación.',
      error,
    )
  }

  if (!data?.quiz) {
    throw new Error(
      'No fue posible obtener la evaluación.',
    )
  }

  return {
    quiz:
      normalizeStudentQuiz(
        data.quiz,
      ),

    questions:
      Array.isArray(
        data.questions,
      )
        ? data.questions
          .map(
            normalizeStudentQuestion,
          )
          .sort(
            (a, b) =>
              a.position -
              b.position,
          )
        : [],
  }
}

/* =========================================================
   INICIAR / REANUDAR INTENTO
========================================================= */

export async function startQuizAttempt(
  quizId,
) {
  const parsedQuizId =
    parseId(quizId)

  if (!parsedQuizId) {
    throw new Error(
      'La evaluación no es válida.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'start_quiz_attempt',
      {
        p_quiz_id:
          parsedQuizId,
      },
    )

  if (error) {
    throwServiceError(
      'No fue posible iniciar la evaluación.',
      error,
    )
  }

  return normalizeAttempt(
    data,
  )
}

/* =========================================================
   OBTENER RESPUESTAS YA GUARDADAS

   Esto permite recuperar un intento si el alumno:
   - cierra el navegador
   - cambia de página
   - pierde conexión momentáneamente
========================================================= */

export async function fetchAttemptAnswers(
  attemptId,
) {
  const parsedAttemptId =
    parseId(attemptId)

  if (!parsedAttemptId) {
    return []
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'get_student_attempt_answers',
      {
        p_attempt_id:
          parsedAttemptId,
      },
    )

  if (error) {
    throwServiceError(
      'No fue posible recuperar las respuestas guardadas.',
      error,
    )
  }

  return Array.isArray(data)
    ? data.map(
      normalizeAnswer,
    )
    : []
}

/* =========================================================
   GUARDAR RESPUESTA

   El alumno solo envía:
   - attemptId
   - questionId
   - opciones seleccionadas
   - texto

   NO envía nota.
   NO envía isCorrect.
========================================================= */

export async function saveQuizAnswer({
  attemptId,
  questionId,
  selectedOptionIds = [],
  textAnswer = '',
}) {
  const parsedAttemptId =
    parseId(attemptId)

  const parsedQuestionId =
    parseId(questionId)

  if (!parsedAttemptId) {
    throw new Error(
      'El intento no es válido.',
    )
  }

  if (!parsedQuestionId) {
    throw new Error(
      'La pregunta no es válida.',
    )
  }

  const safeOptionIds =
    Array.isArray(
      selectedOptionIds,
    )
      ? selectedOptionIds
        .map(Number)
        .filter(
          id =>
            Number.isFinite(id) &&
            id > 0,
        )
      : []

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'save_quiz_answer',
      {
        p_attempt_id:
          parsedAttemptId,

        p_question_id:
          parsedQuestionId,

        p_selected_option_ids:
          safeOptionIds,

        p_text_answer:
          String(
            textAnswer || '',
          ),
      },
    )

  if (error) {
    throwServiceError(
      'No fue posible guardar la respuesta.',
      error,
    )
  }

  return normalizeAnswer(
    data,
  )
}

/* =========================================================
   ENTREGAR EVALUACIÓN

   La corrección ocurre en PostgreSQL.
========================================================= */

export async function submitQuizAttempt(
  attemptId,
) {
  const parsedAttemptId =
    parseId(attemptId)

  if (!parsedAttemptId) {
    throw new Error(
      'El intento no es válido.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'submit_quiz_attempt',
      {
        p_attempt_id:
          parsedAttemptId,
      },
    )

  if (error) {
    throwServiceError(
      'No fue posible entregar la evaluación.',
      error,
    )
  }

  return normalizeAttempt(
    data,
  )
}

/* =========================================================
   HELPERS PARA LA INTERFAZ
========================================================= */

export function questionHasOptions(
  type,
) {
  return [
    'single_choice',
    'multiple_choice',
    'true_false',
  ].includes(type)
}

export function isManualQuestion(
  type,
) {
  return [
    'short_answer',
    'essay',
  ].includes(type)
}

export function createEmptyAnswer(
  question,
) {
  return {
    questionId:
      Number(
        question.id,
      ),

    selectedOptionIds:
      [],

    textAnswer:
      '',
  }
}

/* =========================================================
   ¿ESTÁ RESPONDIDA?
========================================================= */

export function isQuestionAnswered({
  question,
  answer,
}) {
  if (
    !question ||
    !answer
  ) {
    return false
  }

  if (
    questionHasOptions(
      question.type,
    )
  ) {
    return (
      Array.isArray(
        answer
          .selectedOptionIds,
      ) &&
      answer
        .selectedOptionIds
        .length > 0
    )
  }

  return Boolean(
    String(
      answer.textAnswer ||
      '',
    ).trim(),
  )
}

/* =========================================================
   TIEMPO RESTANTE

   Devuelve segundos.

   null = sin límite.
========================================================= */

export function calculateRemainingSeconds({
  startedAt,
  timeLimitMinutes,
}) {
  const minutes =
    Number(
      timeLimitMinutes,
    )

  if (
    !startedAt ||
    !Number.isFinite(
      minutes,
    ) ||
    minutes <= 0
  ) {
    return null
  }

  const start =
    new Date(
      startedAt,
    ).getTime()

  if (
    Number.isNaN(start)
  ) {
    return null
  }

  const end =
    start +
    minutes *
    60 *
    1000

  const remaining =
    Math.ceil(
      (
        end -
        Date.now()
      ) /
      1000,
    )

  return Math.max(
    0,
    remaining,
  )
}

/* =========================================================
   FORMATEAR CRONÓMETRO
========================================================= */

export function formatRemainingTime(
  totalSeconds,
) {
  if (
    totalSeconds === null
  ) {
    return 'Sin límite'
  }

  const safeSeconds =
    Math.max(
      0,
      Number(
        totalSeconds || 0,
      ),
    )

  const hours =
    Math.floor(
      safeSeconds /
      3600,
    )

  const minutes =
    Math.floor(
      (
        safeSeconds %
        3600
      ) /
      60,
    )

  const seconds =
    safeSeconds %
    60

  if (hours > 0) {
    return [
      String(
        hours,
      ).padStart(
        2,
        '0',
      ),

      String(
        minutes,
      ).padStart(
        2,
        '0',
      ),

      String(
        seconds,
      ).padStart(
        2,
        '0',
      ),
    ].join(':')
  }

  return [
    String(
      minutes,
    ).padStart(
      2,
      '0',
    ),

    String(
      seconds,
    ).padStart(
      2,
      '0',
    ),
  ].join(':')
}

/* =========================================================
   EXPORTS DE NORMALIZACIÓN
========================================================= */

export {
  normalizeStudentQuiz,
  normalizeStudentQuestion,
  normalizeStudentOption,
  normalizeAttempt,
  normalizeAnswer,
}
