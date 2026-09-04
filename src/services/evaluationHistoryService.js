import { supabase } from '@/lib/supabase'

/* =========================================================
   NORMALIZACIÓN
========================================================= */

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

const normalizeEvaluationAttempt =
  row => {
    if (!row) {
      return null
    }

    return {
      attemptId:
        Number(
          row.attempt_id,
        ),

      quizId:
        Number(
          row.quiz_id,
        ),

      quizTitle:
        row.quiz_title ||
        'Evaluación',

      assessmentType:
        row.assessment_type ||
        'quiz',

      lessonId:
        Number(
          row.lesson_id,
        ),

      lessonTitle:
        row.lesson_title ||
        'Clase',

      attemptNumber:
        Number(
          row.attempt_number ||
          1,
        ),

      status:
        row.status ||
        'in_progress',

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

      startedAt:
        row.started_at ||
        null,

      submittedAt:
        row.submitted_at ||
        null,

      gradedAt:
        row.graded_at ||
        null,
    }
  }

/* =========================================================
   HISTORIAL DEL ALUMNO
========================================================= */

export async function fetchMyEvaluationAttempts() {
  const {
    data,
    error,
  } =
    await supabase.rpc(
      'get_my_quiz_attempts',
    )

  if (error) {
    console.error(
      'Error obteniendo historial de evaluaciones:',
      error,
    )

    throw new Error(
      error?.message ||
      'No fue posible obtener tu historial de evaluaciones.',
    )
  }

  return (
    data || []
  )
    .map(
      normalizeEvaluationAttempt,
    )
    .filter(Boolean)
}

/* =========================================================
   HELPERS
========================================================= */

export const isFinishedAttempt =
  attempt =>
    [
      'submitted',
      'graded',
    ].includes(
      attempt?.status,
    )

export const getAttemptDate =
  attempt =>
    attempt?.gradedAt ||
    attempt?.submittedAt ||
    attempt?.startedAt ||
    null

export {
  normalizeEvaluationAttempt,
}
