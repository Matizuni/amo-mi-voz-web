import { supabase } from '@/lib/supabase'

const QUIZZES_TABLE = 'quizzes'
const QUESTIONS_TABLE = 'quiz_questions'
const OPTIONS_TABLE = 'quiz_question_options'

/* =========================================================
   HELPERS
========================================================= */

const parseId = value => {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0
    ? parsed
    : null
}

const normalizeQuiz = quiz => {
  if (!quiz) {
    return null
  }

  return {
    id: Number(quiz.id),

    lessonId:
      Number(quiz.lesson_id),

    title:
      quiz.title || '',

    description:
      quiz.description || '',

    assessmentType:
      quiz.assessment_type || 'quiz',

    status:
      quiz.status || 'draft',

    totalPoints:
      Number(quiz.total_points || 0),

    passingPercentage:
      quiz.passing_percentage === null
        ? null
        : Number(quiz.passing_percentage),

    attemptsAllowed:
      quiz.attempts_allowed === null
        ? null
        : Number(quiz.attempts_allowed),

    timeLimitMinutes:
      quiz.time_limit_minutes === null
        ? null
        : Number(quiz.time_limit_minutes),

    opensAt:
      quiz.opens_at || null,

    closesAt:
      quiz.closes_at || null,

    shuffleQuestions:
      Boolean(quiz.shuffle_questions),

    showScoreAfterSubmit:
      Boolean(quiz.show_score_after_submit),

    showCorrectAnswers:
      Boolean(quiz.show_correct_answers),

    createdAt:
      quiz.created_at || null,

    updatedAt:
      quiz.updated_at || null,
  }
}

const normalizeOption = option => {
  if (!option) {
    return null
  }

  return {
    id:
      Number(option.id),

    questionId:
      Number(option.question_id),

    text:
      option.option_text || '',

    isCorrect:
      Boolean(option.is_correct),

    position:
      Number(option.position || 1),

    createdAt:
      option.created_at || null,
  }
}

const normalizeQuestion = question => {
  if (!question) {
    return null
  }

  return {
    id:
      Number(question.id),

    quizId:
      Number(question.quiz_id),

    type:
      question.question_type ||
      'single_choice',

    prompt:
      question.prompt || '',

    explanation:
      question.explanation || '',

    points:
      Number(question.points || 0),

    position:
      Number(question.position || 1),

    required:
      Boolean(question.required),

    autoGradable:
      Boolean(question.auto_gradable),

    mediaType:
      question.media_type || 'none',

    mediaUrl:
      question.media_url || '',

    createdAt:
      question.created_at || null,

    updatedAt:
      question.updated_at || null,

    options:
      Array.isArray(
        question.quiz_question_options,
      )
        ? question.quiz_question_options
          .map(normalizeOption)
          .sort(
            (a, b) =>
              a.position -
              b.position,
          )
        : [],
  }
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

/* =========================================================
   QUIZZES
========================================================= */

export async function fetchQuizzes() {
  const {
    data,
    error,
  } =
    await supabase
      .from(QUIZZES_TABLE)
      .select('*')
      .order(
        'created_at',
        {
          ascending: false,
        },
      )

  if (error) {
    throwServiceError(
      'No fue posible obtener las evaluaciones.',
      error,
    )
  }

  return (data || [])
    .map(normalizeQuiz)
}

/* =========================================================
   QUIZZES POR CLASE
========================================================= */

export async function fetchQuizzesByLesson(
  lessonId,
) {
  const parsedLessonId =
    parseId(lessonId)

  if (!parsedLessonId) {
    return []
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(QUIZZES_TABLE)
      .select('*')
      .eq(
        'lesson_id',
        parsedLessonId,
      )
      .order(
        'created_at',
        {
          ascending: true,
        },
      )

  if (error) {
    throwServiceError(
      'No fue posible obtener las evaluaciones de la clase.',
      error,
    )
  }

  return (data || [])
    .map(normalizeQuiz)
}

/* =========================================================
   QUIZ INDIVIDUAL
========================================================= */

export async function fetchQuizById(
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
    await supabase
      .from(QUIZZES_TABLE)
      .select('*')
      .eq(
        'id',
        parsedQuizId,
      )
      .single()

  if (error) {
    throwServiceError(
      'No fue posible obtener la evaluación.',
      error,
    )
  }

  return normalizeQuiz(data)
}

/* =========================================================
   QUIZ COMPLETO
   Incluye preguntas y opciones
========================================================= */

export async function fetchQuizWithQuestions(
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
    await supabase
      .from(QUIZZES_TABLE)
      .select(`
        *,
        quiz_questions (
          *,
          quiz_question_options (
            *
          )
        )
      `)
      .eq(
        'id',
        parsedQuizId,
      )
      .single()

  if (error) {
    throwServiceError(
      'No fue posible obtener la evaluación completa.',
      error,
    )
  }

  return {
    ...normalizeQuiz(data),

    questions:
      Array.isArray(
        data.quiz_questions,
      )
        ? data.quiz_questions
          .map(
            normalizeQuestion,
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
   CREAR QUIZ
========================================================= */

export async function insertQuiz(
  quiz,
) {
  const lessonId =
    parseId(
      quiz.lessonId,
    )

  if (!lessonId) {
    throw new Error(
      'Debes seleccionar una clase válida.',
    )
  }

  const title =
    String(
      quiz.title || '',
    ).trim()

  if (!title) {
    throw new Error(
      'La evaluación necesita un título.',
    )
  }

  const payload = {
    lesson_id:
      lessonId,

    title,

    description:
      String(
        quiz.description || '',
      ).trim() ||
      null,

    assessment_type:
      quiz.assessmentType ||
      'quiz',

    status:
      quiz.status ||
      'draft',

    total_points:
      Number(
        quiz.totalPoints || 0,
      ),

    passing_percentage:
      quiz.passingPercentage ===
        null ||
        quiz.passingPercentage ===
        ''
        ? null
        : Number(
          quiz.passingPercentage,
        ),

    attempts_allowed:
      quiz.attemptsAllowed ===
        null ||
        quiz.attemptsAllowed ===
        ''
        ? null
        : Number(
          quiz.attemptsAllowed,
        ),

    time_limit_minutes:
      quiz.timeLimitMinutes ===
        null ||
        quiz.timeLimitMinutes ===
        ''
        ? null
        : Number(
          quiz.timeLimitMinutes,
        ),

    opens_at:
      quiz.opensAt ||
      null,

    closes_at:
      quiz.closesAt ||
      null,

    shuffle_questions:
      Boolean(
        quiz.shuffleQuestions,
      ),

    show_score_after_submit:
      quiz.showScoreAfterSubmit !==
      false,

    show_correct_answers:
      Boolean(
        quiz.showCorrectAnswers,
      ),
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(QUIZZES_TABLE)
      .insert(
        payload,
      )
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible crear la evaluación.',
      error,
    )
  }

  return normalizeQuiz(data)
}

/* =========================================================
   ACTUALIZAR QUIZ
========================================================= */

export async function updateQuiz(
  quizId,
  quiz,
) {
  const parsedQuizId =
    parseId(quizId)

  if (!parsedQuizId) {
    throw new Error(
      'La evaluación no es válida.',
    )
  }

  const payload = {
    title:
      String(
        quiz.title || '',
      ).trim(),

    description:
      String(
        quiz.description || '',
      ).trim() ||
      null,

    assessment_type:
      quiz.assessmentType ||
      'quiz',

    status:
      quiz.status ||
      'draft',

    total_points:
      Number(
        quiz.totalPoints || 0,
      ),

    passing_percentage:
      quiz.passingPercentage ===
        null ||
        quiz.passingPercentage ===
        ''
        ? null
        : Number(
          quiz.passingPercentage,
        ),

    attempts_allowed:
      quiz.attemptsAllowed ===
        null ||
        quiz.attemptsAllowed ===
        ''
        ? null
        : Number(
          quiz.attemptsAllowed,
        ),

    time_limit_minutes:
      quiz.timeLimitMinutes ===
        null ||
        quiz.timeLimitMinutes ===
        ''
        ? null
        : Number(
          quiz.timeLimitMinutes,
        ),

    opens_at:
      quiz.opensAt ||
      null,

    closes_at:
      quiz.closesAt ||
      null,

    shuffle_questions:
      Boolean(
        quiz.shuffleQuestions,
      ),

    show_score_after_submit:
      quiz.showScoreAfterSubmit !==
      false,

    show_correct_answers:
      Boolean(
        quiz.showCorrectAnswers,
      ),

    updated_at:
      new Date().toISOString(),
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(QUIZZES_TABLE)
      .update(
        payload,
      )
      .eq(
        'id',
        parsedQuizId,
      )
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible actualizar la evaluación.',
      error,
    )
  }

  return normalizeQuiz(data)
}

/* =========================================================
   PUBLICAR
========================================================= */

export async function publishQuiz(
  quizId,
) {
  return updateQuizStatus(
    quizId,
    'published',
  )
}

/* =========================================================
   CERRAR
========================================================= */

export async function closeQuiz(
  quizId,
) {
  return updateQuizStatus(
    quizId,
    'closed',
  )
}

/* =========================================================
   BORRADOR
========================================================= */

export async function draftQuiz(
  quizId,
) {
  return updateQuizStatus(
    quizId,
    'draft',
  )
}

async function updateQuizStatus(
  quizId,
  status,
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
    await supabase
      .from(QUIZZES_TABLE)
      .update({
        status,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        parsedQuizId,
      )
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible cambiar el estado de la evaluación.',
      error,
    )
  }

  return normalizeQuiz(data)
}

/* =========================================================
   ELIMINAR QUIZ
========================================================= */

export async function removeQuiz(
  quizId,
) {
  const parsedQuizId =
    parseId(quizId)

  if (!parsedQuizId) {
    return false
  }

  const {
    error,
  } =
    await supabase
      .from(QUIZZES_TABLE)
      .delete()
      .eq(
        'id',
        parsedQuizId,
      )

  if (error) {
    throwServiceError(
      'No fue posible eliminar la evaluación.',
      error,
    )
  }

  return true
}

/* =========================================================
   PREGUNTAS
========================================================= */

export async function fetchQuestionsByQuiz(
  quizId,
) {
  const parsedQuizId =
    parseId(quizId)

  if (!parsedQuizId) {
    return []
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(QUESTIONS_TABLE)
      .select(`
        *,
        quiz_question_options (
          *
        )
      `)
      .eq(
        'quiz_id',
        parsedQuizId,
      )
      .order(
        'position',
        {
          ascending: true,
        },
      )

  if (error) {
    throwServiceError(
      'No fue posible obtener las preguntas.',
      error,
    )
  }

  return (data || [])
    .map(
      normalizeQuestion,
    )
}

/* =========================================================
   CREAR PREGUNTA
========================================================= */

export async function insertQuestion(
  question,
) {
  const quizId =
    parseId(
      question.quizId,
    )

  if (!quizId) {
    throw new Error(
      'La evaluación no es válida.',
    )
  }

  const prompt =
    String(
      question.prompt || '',
    ).trim()

  if (!prompt) {
    throw new Error(
      'La pregunta no puede estar vacía.',
    )
  }

  const payload = {
    quiz_id:
      quizId,

    question_type:
      question.type ||
      'single_choice',

    prompt,

    explanation:
      String(
        question.explanation || '',
      ).trim() ||
      null,

    points:
      Number(
        question.points ?? 1,
      ),

    position:
      Number(
        question.position ?? 1,
      ),

    required:
      question.required !==
      false,

    auto_gradable:
      question.autoGradable !==
      false,

    media_type:
      question.mediaType ||
      'none',

    media_url:
      question.mediaUrl ||
      null,
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(QUESTIONS_TABLE)
      .insert(
        payload,
      )
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible crear la pregunta.',
      error,
    )
  }

  return normalizeQuestion(data)
}

/* =========================================================
   ACTUALIZAR PREGUNTA
========================================================= */

export async function updateQuestion(
  questionId,
  question,
) {
  const parsedQuestionId =
    parseId(questionId)

  if (!parsedQuestionId) {
    throw new Error(
      'La pregunta no es válida.',
    )
  }

  const payload = {
    question_type:
      question.type ||
      'single_choice',

    prompt:
      String(
        question.prompt || '',
      ).trim(),

    explanation:
      String(
        question.explanation || '',
      ).trim() ||
      null,

    points:
      Number(
        question.points ?? 1,
      ),

    position:
      Number(
        question.position ?? 1,
      ),

    required:
      question.required !==
      false,

    auto_gradable:
      question.autoGradable !==
      false,

    media_type:
      question.mediaType ||
      'none',

    media_url:
      question.mediaUrl ||
      null,

    updated_at:
      new Date()
        .toISOString(),
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(QUESTIONS_TABLE)
      .update(
        payload,
      )
      .eq(
        'id',
        parsedQuestionId,
      )
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible actualizar la pregunta.',
      error,
    )
  }

  return normalizeQuestion(data)
}

/* =========================================================
   ELIMINAR PREGUNTA
========================================================= */

export async function removeQuestion(
  questionId,
) {
  const parsedQuestionId =
    parseId(questionId)

  if (!parsedQuestionId) {
    return false
  }

  const {
    error,
  } =
    await supabase
      .from(QUESTIONS_TABLE)
      .delete()
      .eq(
        'id',
        parsedQuestionId,
      )

  if (error) {
    throwServiceError(
      'No fue posible eliminar la pregunta.',
      error,
    )
  }

  return true
}

/* =========================================================
   OPCIONES
========================================================= */

export async function insertOption(
  option,
) {
  const questionId =
    parseId(
      option.questionId,
    )

  if (!questionId) {
    throw new Error(
      'La pregunta no es válida.',
    )
  }

  const optionText =
    String(
      option.text || '',
    ).trim()

  if (!optionText) {
    throw new Error(
      'La opción no puede estar vacía.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(OPTIONS_TABLE)
      .insert({
        question_id:
          questionId,

        option_text:
          optionText,

        is_correct:
          Boolean(
            option.isCorrect,
          ),

        position:
          Number(
            option.position ?? 1,
          ),
      })
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible crear la opción.',
      error,
    )
  }

  return normalizeOption(data)
}

/* =========================================================
   ACTUALIZAR OPCIÓN
========================================================= */

export async function updateOption(
  optionId,
  option,
) {
  const parsedOptionId =
    parseId(optionId)

  if (!parsedOptionId) {
    throw new Error(
      'La opción no es válida.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(OPTIONS_TABLE)
      .update({
        option_text:
          String(
            option.text || '',
          ).trim(),

        is_correct:
          Boolean(
            option.isCorrect,
          ),

        position:
          Number(
            option.position ?? 1,
          ),
      })
      .eq(
        'id',
        parsedOptionId,
      )
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible actualizar la opción.',
      error,
    )
  }

  return normalizeOption(data)
}

/* =========================================================
   ELIMINAR OPCIÓN
========================================================= */

export async function removeOption(
  optionId,
) {
  const parsedOptionId =
    parseId(optionId)

  if (!parsedOptionId) {
    return false
  }

  const {
    error,
  } =
    await supabase
      .from(OPTIONS_TABLE)
      .delete()
      .eq(
        'id',
        parsedOptionId,
      )

  if (error) {
    throwServiceError(
      'No fue posible eliminar la opción.',
      error,
    )
  }

  return true
}

/* =========================================================
   REEMPLAZAR TODAS LAS OPCIONES
========================================================= */

export async function replaceQuestionOptions({
  questionId,
  options,
}) {
  const parsedQuestionId =
    parseId(questionId)

  if (!parsedQuestionId) {
    throw new Error(
      'La pregunta no es válida.',
    )
  }

  const normalizedOptions =
    Array.isArray(options)
      ? options
        .map(
          (
            option,
            index,
          ) => ({
            question_id:
              parsedQuestionId,

            option_text:
              String(
                option.text || '',
              ).trim(),

            is_correct:
              Boolean(
                option.isCorrect,
              ),

            position:
              index + 1,
          }),
        )
        .filter(
          option =>
            option.option_text,
        )
      : []

  const {
    error: deleteError,
  } =
    await supabase
      .from(OPTIONS_TABLE)
      .delete()
      .eq(
        'question_id',
        parsedQuestionId,
      )

  if (deleteError) {
    throwServiceError(
      'No fue posible actualizar las opciones.',
      deleteError,
    )
  }

  if (
    !normalizedOptions.length
  ) {
    return []
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(OPTIONS_TABLE)
      .insert(
        normalizedOptions,
      )
      .select()

  if (error) {
    throwServiceError(
      'No fue posible guardar las opciones.',
      error,
    )
  }

  return (data || [])
    .map(normalizeOption)
    .sort(
      (a, b) =>
        a.position -
        b.position,
    )
}

/* =========================================================
   GUARDAR PREGUNTA COMPLETA
========================================================= */

export async function createQuestionWithOptions(
  question,
) {
  const createdQuestion =
    await insertQuestion(
      question,
    )

  const typesWithOptions =
    new Set([
      'single_choice',
      'multiple_choice',
      'true_false',
    ])

  if (
    typesWithOptions.has(
      createdQuestion.type,
    )
  ) {
    const options =
      Array.isArray(
        question.options,
      )
        ? question.options
        : []

    await replaceQuestionOptions({
      questionId:
        createdQuestion.id,

      options,
    })
  }

  return fetchQuestionById(
    createdQuestion.id,
  )
}

/* =========================================================
   OBTENER PREGUNTA COMPLETA
========================================================= */

export async function fetchQuestionById(
  questionId,
) {
  const parsedQuestionId =
    parseId(questionId)

  if (!parsedQuestionId) {
    throw new Error(
      'La pregunta no es válida.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(QUESTIONS_TABLE)
      .select(`
        *,
        quiz_question_options (
          *
        )
      `)
      .eq(
        'id',
        parsedQuestionId,
      )
      .single()

  if (error) {
    throwServiceError(
      'No fue posible obtener la pregunta.',
      error,
    )
  }

  return normalizeQuestion(data)
}

/* =========================================================
   ACTUALIZAR PREGUNTA COMPLETA
========================================================= */

export async function updateQuestionWithOptions(
  questionId,
  question,
) {
  const updatedQuestion =
    await updateQuestion(
      questionId,
      question,
    )

  const typesWithOptions =
    new Set([
      'single_choice',
      'multiple_choice',
      'true_false',
    ])

  if (
    typesWithOptions.has(
      updatedQuestion.type,
    )
  ) {
    await replaceQuestionOptions({
      questionId:
        updatedQuestion.id,

      options:
        question.options || [],
    })
  } else {
    await replaceQuestionOptions({
      questionId:
        updatedQuestion.id,

      options: [],
    })
  }

  return fetchQuestionById(
    updatedQuestion.id,
  )
}

/* =========================================================
   RECALCULAR PUNTAJE TOTAL
========================================================= */

export async function recalculateQuizTotalPoints(
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
    data: questions,
    error: questionsError,
  } =
    await supabase
      .from(QUESTIONS_TABLE)
      .select('points')
      .eq(
        'quiz_id',
        parsedQuizId,
      )

  if (questionsError) {
    throwServiceError(
      'No fue posible calcular el puntaje de la evaluación.',
      questionsError,
    )
  }

  const totalPoints =
    (questions || [])
      .reduce(
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
      )

  const {
    data,
    error,
  } =
    await supabase
      .from(QUIZZES_TABLE)
      .update({
        total_points:
          totalPoints,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        'id',
        parsedQuizId,
      )
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible actualizar el puntaje total.',
      error,
    )
  }

  return normalizeQuiz(data)
}

export {
  normalizeQuiz,
  normalizeQuestion,
  normalizeOption,
}
