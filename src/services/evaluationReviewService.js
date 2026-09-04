import { supabase } from '@/lib/supabase'

/* =========================================================
   UTILIDADES
========================================================= */

const toNumber = value => {
  if (value === null || value === undefined || value === '') {
    return null
  }

  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

/* =========================================================
   OBTENER REVISIÓN DE UN INTENTO
========================================================= */

export async function fetchMyEvaluationReview(attemptId) {
  const { data, error } = await supabase.rpc(
    'get_my_quiz_attempt_review',
    {
      p_attempt_id: Number(attemptId)
    }
  )

  if (error) throw error

  if (!data || data.length === 0) {
    throw new Error('No existe información para este intento.')
  }

  const first = data[0]

  return {
    attempt: {
      id: first.attempt_id,
      quizId: first.quiz_id,
      quizTitle: first.quiz_title,
      assessmentType: first.assessment_type,
      lessonId: first.lesson_id,
      lessonTitle: first.lesson_title,

      showCorrectAnswers:
        first.show_correct_answers,

      attemptNumber: first.attempt_number,
      status: first.attempt_status,

      score: toNumber(first.score),
      maxScore: toNumber(first.max_score),
      percentage: toNumber(first.percentage),

      passed: first.passed,

      submittedAt: first.submitted_at,
      gradedAt: first.graded_at
    },

    questions: data.map(row => ({
      id: row.question_id,

      position: row.question_position,

      type: row.question_type,

      prompt: row.prompt,

      explanation: row.explanation,

      points: toNumber(row.question_points),

      selectedOptionIds:
        row.selected_option_ids || [],

      textAnswer: row.text_answer,

      isCorrect: row.is_correct,

      scoreAwarded: toNumber(row.score_awarded),

      teacherFeedback: row.teacher_feedback,

      options: row.options || [],

      correctOptionIds:
        row.correct_option_ids || []
    }))
  }
}

/* =========================================================
   ESTADO VISUAL DE CADA PREGUNTA
========================================================= */

export function getReviewQuestionState(question) {
  if (question.isCorrect === true) {
    return 'correct'
  }

  if (question.isCorrect === false) {
    return 'incorrect'
  }

  if (question.scoreAwarded !== null) {
    return 'reviewed'
  }

  return 'pending'
}

/* =========================================================
   ESTADÍSTICAS
========================================================= */

export function buildReviewStats(questions) {
  const stats = {
    total: questions.length,
    correct: 0,
    incorrect: 0,
    pending: 0,
    reviewed: 0
  }

  questions.forEach(question => {
    const state =
      getReviewQuestionState(question)

    if (state === 'correct') stats.correct++

    else if (state === 'incorrect')
      stats.incorrect++

    else if (state === 'reviewed')
      stats.reviewed++

    else stats.pending++
  })

  return stats
}
