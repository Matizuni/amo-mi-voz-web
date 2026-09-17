import { supabase } from '@/lib/supabase'

/* =========================================================
   CONSTANTES
========================================================= */

const LESSONS_TABLE = 'lessons'

const DEFAULT_LESSON = Object.freeze({
  lessonNumber: null,
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
  unitId: null
})

/* =========================================================
   UTILIDADES INTERNAS
========================================================= */

const parseLessonId = lessonId => {
  const parsedId = Number(lessonId)

  if (
    !Number.isInteger(parsedId) ||
    parsedId <= 0
  ) {
    throw new Error(
      `ID de clase inválido: ${lessonId}`
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

  if (
    !Number.isInteger(parsedId) ||
    parsedId <= 0
  ) {
    throw new Error(
      `ID de unidad inválido: ${unitId}`
    )
  }

  return parsedId
}

const parseOptionalLessonNumber = lessonNumber => {
  if (
    lessonNumber === null ||
    lessonNumber === undefined ||
    lessonNumber === ''
  ) {
    return null
  }

  const parsedNumber = Number(lessonNumber)

  if (
    !Number.isInteger(parsedNumber) ||
    parsedNumber <= 0
  ) {
    throw new Error(
      `Número de clase inválido: ${lessonNumber}`
    )
  }

  return parsedNumber
}

const ensureArray = value => {
  return Array.isArray(value)
    ? value
    : []
}

const ensureText = (
  value,
  fallback = ''
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

   ID:
   Identificador técnico de Supabase.

   lessonNumber:
   Número académico visible para el usuario.

   Ejemplo:
   id = 5
   lessonNumber = 1
   → visualmente: CLASE 01
========================================================= */

const normalizeLesson = lesson => {
  if (!lesson) {
    return null
  }

  return {
    ...lesson,

    id: Number(lesson.id),

    lessonNumber:
      lesson.lesson_number !== null &&
        lesson.lesson_number !== undefined
        ? Number(lesson.lesson_number)
        : null,

    unitId:
      lesson.unit_id !== null &&
        lesson.unit_id !== undefined
        ? Number(lesson.unit_id)
        : null,

    date:
      lesson.date || '',

    title:
      lesson.title || '',

    description:
      lesson.description || '',

    status:
      lesson.status || 'available',

    time:
      lesson.time || '',

    duration:
      lesson.duration || '',

    modality:
      lesson.modality || '',

    location:
      lesson.location || '',

    focus:
      lesson.focus || '',

    objectives:
      ensureArray(
        lesson.objectives
      ),

    contents:
      ensureArray(
        lesson.contents
      ),

    activities:
      ensureArray(
        lesson.activities
      ),

    repertoire:
      ensureArray(
        lesson.repertoire
      ),

    supportMaterials:
      lesson.support_materials || '',

    notes:
      lesson.notes || '',

    /* =====================================================
       PORTADA
    ===================================================== */

    coverUrl:
      lesson.cover_url || '',

    coverPath:
      lesson.cover_path || '',

    createdAt:
      lesson.created_at || null,

    updatedAt:
      lesson.updated_at || null
  }
}

/* =========================================================
   CREAR PAYLOAD

   Toda creación y edición pasa por aquí.
========================================================= */

const buildLessonPayload = (
  lesson = {},
  {
    isUpdate = false
  } = {}
) => {
  const title = ensureText(
    lesson.title
  )

  if (!title) {
    throw new Error(
      'La clase debe tener un título.'
    )
  }

  const payload = {
    unit_id:
      parseOptionalUnitId(
        lesson.unitId ??
        lesson.unit_id ??
        null
      ),

    lesson_number:
      parseOptionalLessonNumber(
        lesson.lessonNumber ??
        lesson.lesson_number ??
        null
      ),

    date:
      ensureText(
        lesson.date,
        DEFAULT_LESSON.date
      ),

    title,

    description:
      ensureText(
        lesson.description,
        DEFAULT_LESSON.description
      ),

    status:
      ensureText(
        lesson.status,
        DEFAULT_LESSON.status
      ),

    time:
      ensureText(
        lesson.time,
        DEFAULT_LESSON.time
      ),

    duration:
      ensureText(
        lesson.duration,
        DEFAULT_LESSON.duration
      ),

    modality:
      ensureText(
        lesson.modality,
        DEFAULT_LESSON.modality
      ),

    location:
      ensureText(
        lesson.location,
        DEFAULT_LESSON.location
      ),

    focus:
      ensureText(
        lesson.focus,
        DEFAULT_LESSON.focus
      ),

    objectives:
      ensureArray(
        lesson.objectives
      ),

    contents:
      ensureArray(
        lesson.contents
      ),

    activities:
      ensureArray(
        lesson.activities
      ),

    repertoire:
      ensureArray(
        lesson.repertoire
      ),

    support_materials:
      ensureText(
        lesson.supportMaterials ??
        lesson.support_materials,
        DEFAULT_LESSON.supportMaterials
      ),

    notes:
      ensureText(
        lesson.notes,
        DEFAULT_LESSON.notes
      )
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
  error
) => {
  console.error(
    `[lessonService] ${context}:`,
    error
  )

  throw error
}

/* =========================================================
   OBTENER TODAS LAS CLASES

   Orden académico:
   Clase 01, Clase 02, Clase 03...
========================================================= */

export const fetchLessons = async () => {
  const {
    data,
    error
  } = await supabase
    .from(LESSONS_TABLE)
    .select('*')
    .order('lesson_number', {
      ascending: true,
      nullsFirst: false
    })
    .order('id', {
      ascending: true
    })

  if (error) {
    throwServiceError(
      'Error obteniendo las clases',
      error
    )
  }

  return (
    data || []
  ).map(
    normalizeLesson
  )
}

/* =========================================================
   OBTENER UNA CLASE
========================================================= */

export const fetchLessonById =
  async lessonId => {
    const id = parseLessonId(
      lessonId
    )

    const {
      data,
      error
    } = await supabase
      .from(LESSONS_TABLE)
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      throwServiceError(
        `Error obteniendo la clase ${id}`,
        error
      )
    }

    return normalizeLesson(
      data
    )
  }

/* =========================================================
   OBTENER CLASES DE UNA UNIDAD
========================================================= */

export const fetchLessonsByUnit =
  async unitId => {
    const id =
      parseOptionalUnitId(
        unitId
      )

    if (!id) {
      return []
    }

    const {
      data,
      error
    } = await supabase
      .from(LESSONS_TABLE)
      .select('*')
      .eq(
        'unit_id',
        id
      )
      .order(
        'lesson_number',
        {
          ascending: true,
          nullsFirst: false
        }
      )
      .order(
        'id',
        {
          ascending: true
        }
      )

    if (error) {
      throwServiceError(
        `Error obteniendo las clases de la unidad ${id}`,
        error
      )
    }

    return (
      data || []
    ).map(
      normalizeLesson
    )
  }

/* =========================================================
   OBTENER CLASES SIN UNIDAD
========================================================= */

export const fetchUnassignedLessons =
  async () => {
    const {
      data,
      error
    } = await supabase
      .from(LESSONS_TABLE)
      .select('*')
      .is(
        'unit_id',
        null
      )
      .order(
        'lesson_number',
        {
          ascending: true,
          nullsFirst: false
        }
      )
      .order(
        'id',
        {
          ascending: true
        }
      )

    if (error) {
      throwServiceError(
        'Error obteniendo clases sin unidad',
        error
      )
    }

    return (
      data || []
    ).map(
      normalizeLesson
    )
  }

/* =========================================================
   OBTENER SIGUIENTE NÚMERO DE CLASE

   Busca el mayor lesson_number existente
   y devuelve el siguiente.

   01, 02, 03, 04 → devuelve 05
========================================================= */

export const fetchNextLessonNumber =
  async () => {
    const {
      data,
      error
    } = await supabase
      .from(LESSONS_TABLE)
      .select(
        'lesson_number'
      )
      .not(
        'lesson_number',
        'is',
        null
      )
      .order(
        'lesson_number',
        {
          ascending: false
        }
      )
      .limit(1)

    if (error) {
      throwServiceError(
        'Error obteniendo el siguiente número de clase',
        error
      )
    }

    const currentMaximum =
      Number(
        data?.[0]?.lesson_number
      )

    if (
      !Number.isInteger(
        currentMaximum
      ) ||
      currentMaximum <= 0
    ) {
      return 1
    }

    return currentMaximum + 1
  }

/* =========================================================
   CREAR CLASE
========================================================= */

export const insertLesson =
  async lesson => {
    const payload =
      buildLessonPayload(
        lesson
      )

    /*
     * Si la pantalla que crea la clase todavía
     * no envía lessonNumber, lo calculamos aquí.
     *
     * De esta forma la siguiente clase puede ser
     * automáticamente Clase 05, 06, 07...
     */
    if (
      payload.lesson_number === null
    ) {
      payload.lesson_number =
        await fetchNextLessonNumber()
    }

    const {
      data,
      error
    } = await supabase
      .from(LESSONS_TABLE)
      .insert(
        payload
      )
      .select()
      .single()

    if (error) {
      throwServiceError(
        'Error creando clase',
        error
      )
    }

    return normalizeLesson(
      data
    )
  }

/* =========================================================
   ACTUALIZAR CLASE
========================================================= */

export const updateLesson =
  async (
    lessonId,
    lesson
  ) => {
    const id =
      parseLessonId(
        lessonId
      )

    const payload =
      buildLessonPayload(
        lesson,
        {
          isUpdate: true
        }
      )

    /*
     * IMPORTANTE:
     * Si una vista antigua todavía no envía
     * lessonNumber al editar, no queremos
     * borrar el número académico existente.
     */
    if (
      payload.lesson_number === null
    ) {
      delete payload.lesson_number
    }

    const {
      data,
      error
    } = await supabase
      .from(LESSONS_TABLE)
      .update(
        payload
      )
      .eq(
        'id',
        id
      )
      .select()
      .single()

    if (error) {
      throwServiceError(
        `Error actualizando la clase ${id}`,
        error
      )
    }

    return normalizeLesson(
      data
    )
  }

/* =========================================================
   ASIGNAR CLASE A UNA UNIDAD
========================================================= */

export const assignLessonToUnit =
  async (
    lessonId,
    unitId
  ) => {
    const id =
      parseLessonId(
        lessonId
      )

    const normalizedUnitId =
      parseOptionalUnitId(
        unitId
      )

    const {
      data,
      error
    } = await supabase
      .from(LESSONS_TABLE)
      .update({
        unit_id:
          normalizedUnitId,

        updated_at:
          new Date().toISOString()
      })
      .eq(
        'id',
        id
      )
      .select()
      .single()

    if (error) {
      throwServiceError(
        `Error asignando la clase ${id} a una unidad`,
        error
      )
    }

    return normalizeLesson(
      data
    )
  }

/* =========================================================
   QUITAR CLASE DE UNA UNIDAD
========================================================= */

export const removeLessonFromUnit =
  async lessonId => {
    return assignLessonToUnit(
      lessonId,
      null
    )
  }

/* =========================================================
   ELIMINAR CLASE
========================================================= */

export const removeLesson =
  async lessonId => {
    const id =
      parseLessonId(
        lessonId
      )

    const {
      error
    } = await supabase
      .from(LESSONS_TABLE)
      .delete()
      .eq(
        'id',
        id
      )

    if (error) {
      throwServiceError(
        `Error eliminando la clase ${id}`,
        error
      )
    }

    return true
  }

/* =========================================================
   DUPLICAR CLASE

   La copia conserva la unidad original,
   pero recibe un NUEVO número de clase.
========================================================= */

export const cloneLesson =
  async lesson => {
    if (!lesson) {
      throw new Error(
        'No se recibió una clase para duplicar.'
      )
    }

    const originalTitle =
      ensureText(
        lesson.title
      )

    if (!originalTitle) {
      throw new Error(
        'La clase original no tiene título.'
      )
    }

    /*
     * No enviamos lessonNumber.
     * insertLesson() asignará automáticamente
     * el siguiente número disponible.
     */
    return insertLesson({
      unitId:
        lesson.unitId ??
        lesson.unit_id ??
        null,

      date:
        'Fecha por definir',

      title:
        `${originalTitle} · Copia`,

      description:
        lesson.description || '',

      status:
        'available',

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
          lesson.objectives
        ),

      contents:
        ensureArray(
          lesson.contents
        ),

      activities:
        ensureArray(
          lesson.activities
        ),

      repertoire:
        ensureArray(
          lesson.repertoire
        ),

      supportMaterials:
        lesson.supportMaterials ??
        lesson.support_materials ??
        '',

      notes:
        lesson.notes || ''
    })
  }

/* =========================================================
   EXPORTAR NORMALIZADOR
========================================================= */

export {
  normalizeLesson
}
