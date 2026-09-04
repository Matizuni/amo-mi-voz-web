import { supabase } from '@/lib/supabase'

/* =========================================================
   TIPOS VÁLIDOS
========================================================= */

export const LEARNING_ITEM_TYPES = {
  LESSON: 'lesson',
  MATERIAL: 'material',
  ASSIGNMENT: 'assignment',
  QUIZ: 'quiz',
}

export const LEARNING_ITEM_STATUS = {
  VIEWED: 'viewed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
}

/* =========================================================
   HELPERS
========================================================= */

const parseId = value => {
  const parsed = Number(value)

  return (
    Number.isFinite(parsed) &&
    parsed > 0
  )
    ? parsed
    : null
}

const normalizeProgressItem = row => {
  if (!row) {
    return null
  }

  return {
    itemType:
      row.item_type || '',

    itemId:
      Number(row.item_id),

    status:
      row.status || 'viewed',

    firstViewedAt:
      row.first_viewed_at ||
      null,

    lastViewedAt:
      row.last_viewed_at ||
      null,

    completedAt:
      row.completed_at ||
      null,
  }
}

const validateItem = (
  lessonId,
  itemType,
  itemId,
) => {
  const parsedLessonId =
    parseId(lessonId)

  const parsedItemId =
    parseId(itemId)

  const validTypes =
    Object.values(
      LEARNING_ITEM_TYPES,
    )

  if (!parsedLessonId) {
    throw new Error(
      'La clase no es válida.',
    )
  }

  if (!parsedItemId) {
    throw new Error(
      'El elemento académico no es válido.',
    )
  }

  if (
    !validTypes.includes(
      itemType,
    )
  ) {
    throw new Error(
      'El tipo de elemento académico no es válido.',
    )
  }

  return {
    lessonId:
      parsedLessonId,

    itemId:
      parsedItemId,

    itemType,
  }
}

/* =========================================================
   MARCAR COMO VISTO
========================================================= */

export async function markLearningItemViewed({
  lessonId,
  itemType,
  itemId,
}) {
  const parsed =
    validateItem(
      lessonId,
      itemType,
      itemId,
    )

  const {
    error,
  } =
    await supabase.rpc(
      'mark_learning_item_viewed',
      {
        p_lesson_id:
          parsed.lessonId,

        p_item_type:
          parsed.itemType,

        p_item_id:
          parsed.itemId,
      },
    )

  if (error) {
    console.error(
      'Error registrando elemento visto:',
      error,
    )

    throw new Error(
      error?.message ||
      'No fue posible registrar el avance.',
    )
  }

  return true
}

/* =========================================================
   MARCAR COMO COMPLETADO
========================================================= */

export async function markLearningItemCompleted({
  lessonId,
  itemType,
  itemId,
}) {
  const parsed =
    validateItem(
      lessonId,
      itemType,
      itemId,
    )

  const {
    error,
  } =
    await supabase.rpc(
      'mark_learning_item_completed',
      {
        p_lesson_id:
          parsed.lessonId,

        p_item_type:
          parsed.itemType,

        p_item_id:
          parsed.itemId,
      },
    )

  if (error) {
    console.error(
      'Error registrando elemento completado:',
      error,
    )

    throw new Error(
      error?.message ||
      'No fue posible completar el elemento.',
    )
  }

  return true
}

/* =========================================================
   OBTENER PROGRESO DE UNA CLASE
========================================================= */

export async function fetchMyLessonLearningProgress(
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
    await supabase.rpc(
      'get_my_lesson_learning_progress',
      {
        p_lesson_id:
          parsedLessonId,
      },
    )

  if (error) {
    console.error(
      'Error obteniendo progreso académico:',
      error,
    )

    throw new Error(
      error?.message ||
      'No fue posible obtener tu progreso.',
    )
  }

  return (
    data || []
  )
    .map(
      normalizeProgressItem,
    )
    .filter(Boolean)
}

/* =========================================================
   CONSULTAR ESTADO DE UN ITEM
========================================================= */

export const findLearningItemProgress = (
  progress,
  itemType,
  itemId,
) => {
  const parsedItemId =
    Number(itemId)

  return (
    progress || []
  ).find(
    item =>
      item.itemType ===
      itemType &&
      Number(
        item.itemId,
      ) ===
      parsedItemId,
  ) || null
}

export const isLearningItemViewed = (
  progress,
  itemType,
  itemId,
) => {
  const item =
    findLearningItemProgress(
      progress,
      itemType,
      itemId,
    )

  return Boolean(item)
}

export const isLearningItemCompleted = (
  progress,
  itemType,
  itemId,
) => {
  const item =
    findLearningItemProgress(
      progress,
      itemType,
      itemId,
    )

  return (
    item?.status ===
    LEARNING_ITEM_STATUS.COMPLETED
  )
}

/* =========================================================
   RESUMEN DE PROGRESO
========================================================= */

export const calculateLessonItemProgress = ({
  progress = [],
  materials = [],
  assignments = [],
  quizzes = [],
}) => {
  const requiredItems = []

  for (
    const material of
    materials
  ) {
    if (!material?.id) {
      continue
    }

    requiredItems.push({
      type:
        LEARNING_ITEM_TYPES.MATERIAL,

      id:
        Number(material.id),
    })
  }

  for (
    const assignment of
    assignments
  ) {
    if (
      !assignment?.id ||
      assignment.status ===
      'draft'
    ) {
      continue
    }

    requiredItems.push({
      type:
        LEARNING_ITEM_TYPES.ASSIGNMENT,

      id:
        Number(
          assignment.id,
        ),
    })
  }

  for (
    const quiz of
    quizzes
  ) {
    if (
      !quiz?.id ||
      quiz.status !==
      'published'
    ) {
      continue
    }

    requiredItems.push({
      type:
        LEARNING_ITEM_TYPES.QUIZ,

      id:
        Number(quiz.id),
    })
  }

  const total =
    requiredItems.length

  const completed =
    requiredItems.filter(
      item =>
        isLearningItemCompleted(
          progress,
          item.type,
          item.id,
        ),
    ).length

  const viewed =
    requiredItems.filter(
      item =>
        isLearningItemViewed(
          progress,
          item.type,
          item.id,
        ),
    ).length

  const percentage =
    total > 0
      ? Math.round(
        (
          completed /
          total
        ) *
        100,
      )
      : 0

  return {
    total,
    completed,
    viewed,
    pending:
      Math.max(
        0,
        total -
        completed,
      ),

    percentage,

    isComplete:
      total > 0 &&
      completed ===
      total,
  }
}
