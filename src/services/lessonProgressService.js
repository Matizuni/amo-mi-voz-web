import { supabase } from '@/lib/supabase'

const TABLE_NAME = 'lesson_progress'

/* =========================================================
   HELPERS
========================================================= */

const parseId = value => {
  const parsed = Number(value)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null
  }

  return parsed
}

const normalizeProgress = row => {
  if (!row) {
    return null
  }

  return {
    id: Number(row.id),

    studentId:
      Number(row.student_id),

    lessonId:
      Number(row.lesson_id),

    completed:
      Boolean(row.completed),

    completedAt:
      row.completed_at || null,

    createdAt:
      row.created_at || null,

    updatedAt:
      row.updated_at || null,
  }
}

const throwServiceError = (
  message,
  error,
) => {
  console.error(message, error)

  throw new Error(
    error?.message ||
    message,
  )
}

/* =========================================================
   TODO EL PROGRESO
   Profesor
========================================================= */

export async function fetchAllLessonProgress() {
  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select('*')
      .order('student_id', {
        ascending: true,
      })
      .order('lesson_id', {
        ascending: true,
      })

  if (error) {
    throwServiceError(
      'No fue posible obtener el progreso.',
      error,
    )
  }

  return (data || [])
    .map(normalizeProgress)
}

/* =========================================================
   PROGRESO DE UN ALUMNO
========================================================= */

export async function fetchProgressByStudent(
  studentId,
) {
  const parsedStudentId =
    parseId(studentId)

  if (!parsedStudentId) {
    return []
  }

  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq(
        'student_id',
        parsedStudentId,
      )
      .order('lesson_id', {
        ascending: true,
      })

  if (error) {
    throwServiceError(
      'No fue posible obtener el progreso del alumno.',
      error,
    )
  }

  return (data || [])
    .map(normalizeProgress)
}

/* =========================================================
   PROGRESO DE UNA CLASE
========================================================= */

export async function fetchProgressByLesson(
  lessonId,
) {
  const parsedLessonId =
    parseId(lessonId)

  if (!parsedLessonId) {
    return []
  }

  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq(
        'lesson_id',
        parsedLessonId,
      )
      .order('student_id', {
        ascending: true,
      })

  if (error) {
    throwServiceError(
      'No fue posible obtener el progreso de la clase.',
      error,
    )
  }

  return (data || [])
    .map(normalizeProgress)
}

/* =========================================================
   PROGRESO ESPECÍFICO
========================================================= */

export async function fetchLessonProgress({
  studentId,
  lessonId,
}) {
  const parsedStudentId =
    parseId(studentId)

  const parsedLessonId =
    parseId(lessonId)

  if (
    !parsedStudentId ||
    !parsedLessonId
  ) {
    return null
  }

  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq(
        'student_id',
        parsedStudentId,
      )
      .eq(
        'lesson_id',
        parsedLessonId,
      )
      .maybeSingle()

  if (error) {
    throwServiceError(
      'No fue posible obtener el progreso de la clase.',
      error,
    )
  }

  return normalizeProgress(data)
}

/* =========================================================
   CREAR O ACTUALIZAR PROGRESO
========================================================= */

export async function upsertLessonProgress({
  studentId,
  lessonId,
  completed,
}) {
  const parsedStudentId =
    parseId(studentId)

  const parsedLessonId =
    parseId(lessonId)

  if (!parsedStudentId) {
    throw new Error(
      'El alumno no es válido.',
    )
  }

  if (!parsedLessonId) {
    throw new Error(
      'La clase no es válida.',
    )
  }

  const isCompleted =
    Boolean(completed)

  const payload = {
    student_id:
      parsedStudentId,

    lesson_id:
      parsedLessonId,

    completed:
      isCompleted,

    completed_at:
      isCompleted
        ? new Date().toISOString()
        : null,

    updated_at:
      new Date().toISOString(),
  }

  const { data, error } =
    await supabase
      .from(TABLE_NAME)
      .upsert(
        payload,
        {
          onConflict:
            'student_id,lesson_id',
        },
      )
      .select()
      .single()

  if (error) {
    throwServiceError(
      'No fue posible actualizar el progreso.',
      error,
    )
  }

  return normalizeProgress(data)
}

/* =========================================================
   MARCAR COMPLETADA
========================================================= */

export async function markLessonCompleted({
  studentId,
  lessonId,
}) {
  return upsertLessonProgress({
    studentId,
    lessonId,
    completed: true,
  })
}

/* =========================================================
   MARCAR PENDIENTE
========================================================= */

export async function markLessonPending({
  studentId,
  lessonId,
}) {
  return upsertLessonProgress({
    studentId,
    lessonId,
    completed: false,
  })
}

/* =========================================================
   ELIMINAR REGISTRO
========================================================= */

export async function removeLessonProgress(
  progressId,
) {
  const parsedId =
    parseId(progressId)

  if (!parsedId) {
    return false
  }

  const { error } =
    await supabase
      .from(TABLE_NAME)
      .delete()
      .eq(
        'id',
        parsedId,
      )

  if (error) {
    throwServiceError(
      'No fue posible eliminar el progreso.',
      error,
    )
  }

  return true
}

/* =========================================================
   CALCULAR PROGRESO POR UNIDAD
========================================================= */

export function calculateUnitProgress({
  lessons,
  progressRows,
}) {
  const normalizedLessons =
    Array.isArray(lessons)
      ? lessons
      : []

  const normalizedProgress =
    Array.isArray(progressRows)
      ? progressRows
      : []

  if (!normalizedLessons.length) {
    return {
      totalLessons: 0,
      completedLessons: 0,
      percentage: 0,
    }
  }

  const lessonIds =
    new Set(
      normalizedLessons.map(
        lesson =>
          Number(lesson.id),
      ),
    )

  const completedLessons =
    normalizedProgress.filter(
      row =>
        row.completed &&
        lessonIds.has(
          Number(row.lessonId),
        ),
    ).length

  const percentage =
    Math.round(
      (
        completedLessons /
        normalizedLessons.length
      ) * 100,
    )

  return {
    totalLessons:
      normalizedLessons.length,

    completedLessons,

    percentage,
  }
}

/* =========================================================
   CALCULAR PROGRESO GENERAL
========================================================= */

export function calculateOverallProgress({
  lessons,
  progressRows,
}) {
  return calculateUnitProgress({
    lessons,
    progressRows,
  })
}

export {
  normalizeProgress,
}
