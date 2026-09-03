import { supabase } from '@/lib/supabase'

/* =========================================================
   CONSTANTES
========================================================= */

const LESSONS_TABLE = 'lessons'

const DEFAULT_LESSON = Object.freeze({
  date: '',
  title: '',
  description: '',
  status: 'available',
  time: '',
  duration: '3 horas',
  modality: 'Presencial',
  location: 'Academia Amo Mi Voz',
  focus: '',
  objectives: [],
  contents: [],
  activities: [],
  repertoire: [],
  supportMaterials: '',
  notes: '',
  unitId: null,
})

/* =========================================================
   UTILIDADES INTERNAS
========================================================= */

const parseLessonId = lessonId => {
  const parsedId = Number(lessonId)

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error(
      `ID de clase inválido: ${lessonId}`,
    )
  }

  return parsedId
}

const parseOptionalUnitId = unitId => {
  if (
    unitId === null ||
    unitId === undefined ||
    unitId === ''
  ) {
    return null
  }

  const parsedId = Number(unitId)

  if (!Number.isInteger(parsedId) || parsedId <= 0) {
    throw new Error(
      `ID de unidad inválido: ${unitId}`,
    )
  }

  return parsedId
}

const ensureArray = value => {
  return Array.isArray(value)
    ? value
    : []
}

const ensureText = (
  value,
  fallback = '',
) => {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback
  }

  return String(value).trim()
}

/* =========================================================
   NORMALIZAR CLASE

   Conservamos también los nombres originales provenientes
   de Supabase para no romper componentes existentes.
========================================================= */

const normalizeLesson = lesson => {
  if (!lesson) {
    return null
  }

  return {
    ...lesson,

    id: Number(lesson.id),

    unitId:
      lesson.unit_id !== null &&
        lesson.unit_id !== undefined
        ? Number(lesson.unit_id)
        : null,

    date: lesson.date || '',
    title: lesson.title || '',
    description: lesson.description || '',
    status: lesson.status || 'available',
    time: lesson.time || '',
    duration: lesson.duration || '',
    modality: lesson.modality || '',
    location: lesson.location || '',
    focus: lesson.focus || '',

    objectives: ensureArray(
      lesson.objectives,
    ),

    contents: ensureArray(
      lesson.contents,
    ),

    activities: ensureArray(
      lesson.activities,
    ),

    repertoire: ensureArray(
      lesson.repertoire,
    ),

    supportMaterials:
      lesson.support_materials || '',

    notes: lesson.notes || '',

    createdAt:
      lesson.created_at || null,

    updatedAt:
      lesson.updated_at || null,
  }
}

/* =========================================================
   CREAR PAYLOAD

   Toda creación y edición pasa por aquí.
   Esto evita duplicar lógica y mantiene consistencia.
========================================================= */

const buildLessonPayload = (
  lesson = {},
  {
    isUpdate = false,
  } = {},
) => {
  const title = ensureText(
    lesson.title,
  )

  if (!title) {
    throw new Error(
      'La clase debe tener un título.',
    )
  }

  const payload = {
    unit_id: parseOptionalUnitId(
      lesson.unitId ??
      lesson.unit_id ??
      null,
    ),

    date: ensureText(
      lesson.date,
      DEFAULT_LESSON.date,
    ),

    title,

    description: ensureText(
      lesson.description,
      DEFAULT_LESSON.description,
    ),

    status: ensureText(
      lesson.status,
      DEFAULT_LESSON.status,
    ),

    time: ensureText(
      lesson.time,
      DEFAULT_LESSON.time,
    ),

    duration: ensureText(
      lesson.duration,
      DEFAULT_LESSON.duration,
    ),

    modality: ensureText(
      lesson.modality,
      DEFAULT_LESSON.modality,
    ),

    location: ensureText(
      lesson.location,
      DEFAULT_LESSON.location,
    ),

    focus: ensureText(
      lesson.focus,
      DEFAULT_LESSON.focus,
    ),

    objectives: ensureArray(
      lesson.objectives,
    ),

    contents: ensureArray(
      lesson.contents,
    ),

    activities: ensureArray(
      lesson.activities,
    ),

    repertoire: ensureArray(
      lesson.repertoire,
    ),

    support_materials: ensureText(
      lesson.supportMaterials ??
      lesson.support_materials,
      DEFAULT_LESSON.supportMaterials,
    ),

    notes: ensureText(
      lesson.notes,
      DEFAULT_LESSON.notes,
    ),
  }

  if (isUpdate) {
    payload.updated_at =
      new Date().toISOString()
  }

  return payload
}

/* =========================================================
   MANEJO DE ERRORES
========================================================= */

const throwServiceError = (
  context,
  error,
) => {
  console.error(
    `[lessonService] ${context}:`,
    error,
  )

  throw error
}

/* =========================================================
   OBTENER TODAS LAS CLASES
========================================================= */

export const fetchLessons = async () => {
  const {
    data,
    error,
  } = await supabase
    .from(LESSONS_TABLE)
    .select('*')
    .order('id', {
      ascending: true,
    })

  if (error) {
    throwServiceError(
      'Error obteniendo las clases',
      error,
    )
  }

  return (data || []).map(
    normalizeLesson,
  )
}

/* =========================================================
   OBTENER UNA CLASE
========================================================= */

export const fetchLessonById =
  async lessonId => {
    const id = parseLessonId(
      lessonId,
    )

    const {
      data,
      error,
    } = await supabase
      .from(LESSONS_TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throwServiceError(
        `Error obteniendo la clase ${id}`,
        error,
      )
    }

    return normalizeLesson(data)
  }

/* =========================================================
   OBTENER CLASES DE UNA UNIDAD
========================================================= */

export const fetchLessonsByUnit =
  async unitId => {
    const id = parseOptionalUnitId(
      unitId,
    )

    if (!id) {
      return []
    }

    const {
      data,
      error,
    } = await supabase
      .from(LESSONS_TABLE)
      .select('*')
      .eq('unit_id', id)
      .order('id', {
        ascending: true,
      })

    if (error) {
      throwServiceError(
        `Error obteniendo las clases de la unidad ${id}`,
        error,
      )
    }

    return (data || []).map(
      normalizeLesson,
    )
  }

/* =========================================================
   OBTENER CLASES SIN UNIDAD

   Será útil durante la migración y para el panel del profesor.
========================================================= */

export const fetchUnassignedLessons =
  async () => {
    const {
      data,
      error,
    } = await supabase
      .from(LESSONS_TABLE)
      .select('*')
      .is('unit_id', null)
      .order('id', {
        ascending: true,
      })

    if (error) {
      throwServiceError(
        'Error obteniendo clases sin unidad',
        error,
      )
    }

    return (data || []).map(
      normalizeLesson,
    )
  }

/* =========================================================
   CREAR CLASE
========================================================= */

export const insertLesson =
  async lesson => {
    const payload =
      buildLessonPayload(lesson)

    const {
      data,
      error,
    } = await supabase
      .from(LESSONS_TABLE)
      .insert(payload)
      .select()
      .single()

    if (error) {
      throwServiceError(
        'Error creando la clase',
        error,
      )
    }

    return normalizeLesson(data)
  }

/* =========================================================
   ACTUALIZAR CLASE
========================================================= */

export const updateLesson =
  async (
    lessonId,
    lesson,
  ) => {
    const id = parseLessonId(
      lessonId,
    )

    const payload =
      buildLessonPayload(
        lesson,
        {
          isUpdate: true,
        },
      )

    const {
      data,
      error,
    } = await supabase
      .from(LESSONS_TABLE)
      .update(payload)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throwServiceError(
        `Error actualizando la clase ${id}`,
        error,
      )
    }

    return normalizeLesson(data)
  }

/* =========================================================
   ASIGNAR CLASE A UNA UNIDAD

   Permite mover una clase sin tener que editarla completa.
========================================================= */

export const assignLessonToUnit =
  async (
    lessonId,
    unitId,
  ) => {
    const id = parseLessonId(
      lessonId,
    )

    const normalizedUnitId =
      parseOptionalUnitId(unitId)

    const {
      data,
      error,
    } = await supabase
      .from(LESSONS_TABLE)
      .update({
        unit_id: normalizedUnitId,
        updated_at:
          new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throwServiceError(
        `Error asignando la clase ${id} a una unidad`,
        error,
      )
    }

    return normalizeLesson(data)
  }

/* =========================================================
   QUITAR CLASE DE UNA UNIDAD
========================================================= */

export const removeLessonFromUnit =
  async lessonId => {
    return assignLessonToUnit(
      lessonId,
      null,
    )
  }

/* =========================================================
   ELIMINAR CLASE
========================================================= */

export const removeLesson =
  async lessonId => {
    const id = parseLessonId(
      lessonId,
    )

    const {
      error,
    } = await supabase
      .from(LESSONS_TABLE)
      .delete()
      .eq('id', id)

    if (error) {
      throwServiceError(
        `Error eliminando la clase ${id}`,
        error,
      )
    }

    return true
  }

/* =========================================================
   DUPLICAR CLASE

   La copia conserva la unidad original.
   No copia ID ni timestamps.
========================================================= */

export const cloneLesson =
  async lesson => {
    if (!lesson) {
      throw new Error(
        'No se recibió una clase para duplicar.',
      )
    }

    const originalTitle =
      ensureText(lesson.title)

    if (!originalTitle) {
      throw new Error(
        'La clase original no tiene título.',
      )
    }

    return insertLesson({
      unitId:
        lesson.unitId ??
        lesson.unit_id ??
        null,

      date: 'Fecha por definir',

      title:
        `${originalTitle} · Copia`,

      description:
        lesson.description || '',

      status: 'available',

      time:
        lesson.time || '',

      duration:
        lesson.duration ||
        DEFAULT_LESSON.duration,

      modality:
        lesson.modality ||
        DEFAULT_LESSON.modality,

      location:
        lesson.location ||
        DEFAULT_LESSON.location,

      focus:
        lesson.focus || '',

      objectives:
        ensureArray(
          lesson.objectives,
        ),

      contents:
        ensureArray(
          lesson.contents,
        ),

      activities:
        ensureArray(
          lesson.activities,
        ),

      repertoire:
        ensureArray(
          lesson.repertoire,
        ),

      supportMaterials:
        lesson.supportMaterials ??
        lesson.support_materials ??
        '',

      notes:
        lesson.notes || '',
    })
  }

/* =========================================================
   EXPORTAR NORMALIZADOR

   Puede ser útil más adelante en composables o tests.
========================================================= */

export {
  normalizeLesson,
}
