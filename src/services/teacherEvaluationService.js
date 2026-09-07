import { supabase } from '@/lib/supabase'

const toNumberOrNull = value => {
  if (
    value === null ||
    value === undefined ||
    value === ''
  ) {
    return null
  }

  const parsed = Number(value)

  return Number.isFinite(parsed)
    ? parsed
    : null
}

const normalizeOption = option => ({
  id:
    Number(option?.id),

  text:
    option?.text || '',

  position:
    Number(
      option?.position || 1,
    ),

  isCorrect:
    Boolean(
      option?.isCorrect ??
      option?.is_correct,
    ),
})

const normalizeAttempt = row => ({
  id:
    Number(row.attempt_id),

  quizId:
    Number(row.quiz_id),

  quizTitle:
    row.quiz_title ||
    'Evaluación',

  lessonId:
    Number(row.lesson_id),

  lessonTitle:
    row.lesson_title ||
    'Clase',

  studentId:
    Number(row.student_id),

  studentName:
    row.student_name ||
    'Estudiante',

  studentVoice:
    row.student_voice ||
    'Sin clasificar',

  attemptNumber:
    Number(
      row.attempt_number || 1,
    ),

  status:
    row.attempt_status ||
    'submitted',

  score:
    toNumberOrNull(
      row.score,
    ),

  maxScore:
    toNumberOrNull(
      row.max_score,
    ),

  percentage:
    toNumberOrNull(
      row.percentage,
    ),

  passed:
    row.passed === null ||
      row.passed === undefined
      ? null
      : Boolean(
        row.passed,
      ),

  submittedAt:
    row.submitted_at || null,

  gradedAt:
    row.graded_at || null,

  manualTotal:
    Number(
      row.manual_total || 0,
    ),

  pendingManual:
    Number(
      row.pending_manual || 0,
    ),
})

const normalizeReviewRow = row => ({
  attemptId:
    Number(row.attempt_id),

  quizId:
    Number(row.quiz_id),

  quizTitle:
    row.quiz_title ||
    'Evaluación',

  assessmentType:
    row.assessment_type ||
    'quiz',

  lessonId:
    Number(row.lesson_id),

  lessonTitle:
    row.lesson_title ||
    'Clase',

  passingPercentage:
    toNumberOrNull(
      row.passing_percentage,
    ),

  studentId:
    Number(row.student_id),

  studentName:
    row.student_name ||
    'Estudiante',

  studentVoice:
    row.student_voice ||
    'Sin clasificar',

  attemptNumber:
    Number(
      row.attempt_number || 1,
    ),

  attemptStatus:
    row.attempt_status ||
    'submitted',

  score:
    toNumberOrNull(
      row.score,
    ),

  maxScore:
    toNumberOrNull(
      row.max_score,
    ),

  percentage:
    toNumberOrNull(
      row.percentage,
    ),

  passed:
    row.passed === null ||
      row.passed === undefined
      ? null
      : Boolean(
        row.passed,
      ),

  submittedAt:
    row.submitted_at || null,

  gradedAt:
    row.graded_at || null,

  questionId:
    Number(row.question_id),

  questionPosition:
    Number(
      row.question_position || 1,
    ),

  questionType:
    row.question_type ||
    'single_choice',

  prompt:
    row.prompt || '',

  explanation:
    row.explanation || '',

  questionPoints:
    toNumberOrNull(
      row.question_points,
    ) ?? 0,

  required:
    Boolean(
      row.required,
    ),

  autoGradable:
    Boolean(
      row.auto_gradable,
    ),

  selectedOptionIds:
    Array.isArray(
      row.selected_option_ids,
    )
      ? row.selected_option_ids
        .map(Number)
        .filter(
          Number.isFinite,
        )
      : [],

  textAnswer:
    row.text_answer || '',

  isCorrect:
    row.is_correct === null ||
      row.is_correct === undefined
      ? null
      : Boolean(
        row.is_correct,
      ),

  scoreAwarded:
    toNumberOrNull(
      row.score_awarded,
    ),

  teacherFeedback:
    row.teacher_feedback || '',

  options:
    Array.isArray(
      row.options,
    )
      ? row.options
        .map(
          normalizeOption,
        )
        .sort(
          (a, b) =>
            a.position -
            b.position,
        )
      : [],

  correctOptionIds:
    Array.isArray(
      row.correct_option_ids,
    )
      ? row.correct_option_ids
        .map(Number)
        .filter(
          Number.isFinite,
        )
      : [],
})

export async function fetchTeacherQuizAttempts(
  quizId,
) {
  const parsedQuizId =
    Number(quizId)

  if (
    !Number.isFinite(
      parsedQuizId,
    ) ||
    parsedQuizId <= 0
  ) {
    throw new Error(
      'La evaluación seleccionada no es válida.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'get_teacher_quiz_attempts',
      {
        p_quiz_id:
          parsedQuizId,
      },
    )

  if (error) {
    console.error(
      'Error obteniendo intentos del quiz:',
      error,
    )

    throw new Error(
      error?.message ||
      'No fue posible obtener los intentos de esta evaluación.',
    )
  }

  return (data || [])
    .map(
      normalizeAttempt,
    )
    .filter(Boolean)
}

export async function fetchTeacherEvaluationReview(
  attemptId,
) {
  const parsedAttemptId =
    Number(attemptId)

  if (
    !Number.isFinite(
      parsedAttemptId,
    ) ||
    parsedAttemptId <= 0
  ) {
    throw new Error(
      'El intento seleccionado no es válido.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'get_teacher_quiz_attempt_review',
      {
        p_attempt_id:
          parsedAttemptId,
      },
    )

  if (error) {
    console.error(
      'Error cargando revisión del profesor:',
      error,
    )

    throw new Error(
      error?.message ||
      'No fue posible abrir esta revisión.',
    )
  }

  const rows =
    (data || [])
      .map(
        normalizeReviewRow,
      )
      .filter(Boolean)

  if (!rows.length) {
    throw new Error(
      'No encontramos información para este intento.',
    )
  }

  const first =
    rows[0]

  return {
    attempt: {
      id:
        first.attemptId,

      quizId:
        first.quizId,

      quizTitle:
        first.quizTitle,

      assessmentType:
        first.assessmentType,

      lessonId:
        first.lessonId,

      lessonTitle:
        first.lessonTitle,

      passingPercentage:
        first.passingPercentage,

      studentId:
        first.studentId,

      studentName:
        first.studentName,

      studentVoice:
        first.studentVoice,

      attemptNumber:
        first.attemptNumber,

      status:
        first.attemptStatus,

      score:
        first.score,

      maxScore:
        first.maxScore,

      percentage:
        first.percentage,

      passed:
        first.passed,

      submittedAt:
        first.submittedAt,

      gradedAt:
        first.gradedAt,
    },

    questions:
      rows.map(row => ({
        id:
          row.questionId,

        position:
          row.questionPosition,

        type:
          row.questionType,

        prompt:
          row.prompt,

        explanation:
          row.explanation,

        points:
          row.questionPoints,

        required:
          row.required,

        autoGradable:
          row.autoGradable,

        selectedOptionIds:
          row.selectedOptionIds,

        textAnswer:
          row.textAnswer,

        isCorrect:
          row.isCorrect,

        scoreAwarded:
          row.scoreAwarded,

        teacherFeedback:
          row.teacherFeedback,

        options:
          row.options,

        correctOptionIds:
          row.correctOptionIds,
      })),
  }
}

export async function saveTeacherQuestionReview({
  attemptId,
  questionId,
  scoreAwarded,
  teacherFeedback,
}) {
  const parsedAttemptId =
    Number(attemptId)

  const parsedQuestionId =
    Number(questionId)

  const parsedScore =
    Number(scoreAwarded)

  if (
    !Number.isFinite(
      parsedAttemptId,
    ) ||
    parsedAttemptId <= 0 ||
    !Number.isFinite(
      parsedQuestionId,
    ) ||
    parsedQuestionId <= 0 ||
    !Number.isFinite(
      parsedScore,
    )
  ) {
    throw new Error(
      'Los datos de corrección no son válidos.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'save_teacher_quiz_answer_review',
      {
        p_attempt_id:
          parsedAttemptId,

        p_question_id:
          parsedQuestionId,

        p_score_awarded:
          parsedScore,

        p_teacher_feedback:
          String(
            teacherFeedback || '',
          ).trim() ||
          null,
      },
    )

  if (error) {
    console.error(
      'Error guardando corrección:',
      error,
    )

    throw new Error(
      error?.message ||
      'No fue posible guardar esta corrección.',
    )
  }

  const row =
    Array.isArray(data)
      ? data[0]
      : data

  return {
    attemptId:
      Number(
        row?.attempt_id ||
        parsedAttemptId,
      ),

    questionId:
      Number(
        row?.question_id ||
        parsedQuestionId,
      ),

    scoreAwarded:
      toNumberOrNull(
        row?.score_awarded,
      ),

    teacherFeedback:
      row?.teacher_feedback ||
      '',
  }
}

export async function finalizeTeacherEvaluationReview(
  attemptId,
) {
  const parsedAttemptId =
    Number(attemptId)

  if (
    !Number.isFinite(
      parsedAttemptId,
    ) ||
    parsedAttemptId <= 0
  ) {
    throw new Error(
      'El intento seleccionado no es válido.',
    )
  }

  const {
    data,
    error,
  } =
    await supabase.rpc(
      'finalize_teacher_quiz_attempt',
      {
        p_attempt_id:
          parsedAttemptId,
      },
    )

  if (error) {
    console.error(
      'Error finalizando corrección:',
      error,
    )

    throw new Error(
      error?.message ||
      'No fue posible finalizar la corrección.',
    )
  }

  const row =
    Array.isArray(data)
      ? data[0]
      : data

  return {
    id:
      Number(
        row?.attempt_id ||
        parsedAttemptId,
      ),

    status:
      row?.status ||
      'graded',

    score:
      toNumberOrNull(
        row?.score,
      ),

    maxScore:
      toNumberOrNull(
        row?.max_score,
      ),

    percentage:
      toNumberOrNull(
        row?.percentage,
      ),

    passed:
      row?.passed === null ||
        row?.passed === undefined
        ? null
        : Boolean(
          row.passed,
        ),

    gradedAt:
      row?.graded_at ||
      null,
  }
}
