import { supabase } from '@/lib/supabase'

/* =========================================================
   TIPOS DE EVALUACIÓN VÁLIDOS
========================================================= */

export const ASSIGNMENT_EVALUATION_TYPES = {
  SIMPLE: 'simple',
  GRADED: 'graded',
  VOCAL_RUBRIC: 'vocal_rubric',
  CUSTOM_RUBRIC: 'custom_rubric'
}

/* =========================================================
   NORMALIZAR
========================================================= */

const normalizeAssignment = assignment => {
  if (!assignment) {
    return null
  }

  return {
    id: assignment.id,

    lessonId:
      assignment.lesson_id,

    title:
      assignment.title,

    description:
      assignment.description || '',

    type:
      assignment.activity_type ||
      'assignment',

    acceptedFile:
      assignment.accepted_file ||
      'audio',

    acceptedFiles: [
      assignment.accepted_file ||
      'audio'
    ],

    dueDate:
      assignment.due_date || '',

    points:
      assignment.points ?? 100,

    status:
      assignment.status ||
      'published',

    /*
     * Método de evaluación.
     *
     * simple
     * graded
     * vocal_rubric
     * custom_rubric
     */
    evaluationType:
      assignment.evaluation_type ||
      ASSIGNMENT_EVALUATION_TYPES.SIMPLE,

    /*
     * Configuración de rúbrica.
     *
     * Actualmente puede quedar vacía.
     * Más adelante permitirá almacenar
     * criterios personalizados.
     */
    rubricConfig:
      assignment.rubric_config &&
        typeof assignment.rubric_config === 'object'
        ? assignment.rubric_config
        : {},

    createdAt:
      assignment.created_at,

    updatedAt:
      assignment.updated_at
  }
}

/* =========================================================
   NORMALIZAR CONFIGURACIÓN DE RÚBRICA
========================================================= */

const normalizeRubricConfig = rubricConfig => {
  if (
    !rubricConfig ||
    typeof rubricConfig !== 'object' ||
    Array.isArray(rubricConfig)
  ) {
    return {}
  }

  return rubricConfig
}

/* =========================================================
   VALIDAR TIPO DE EVALUACIÓN
========================================================= */

const normalizeEvaluationType = evaluationType => {
  const validTypes =
    Object.values(
      ASSIGNMENT_EVALUATION_TYPES
    )

  if (
    validTypes.includes(
      evaluationType
    )
  ) {
    return evaluationType
  }

  return ASSIGNMENT_EVALUATION_TYPES.SIMPLE
}

/* =========================================================
   CREAR PAYLOAD
========================================================= */

const createAssignmentPayload = assignment => {
  return {
    lesson_id:
      Number(
        assignment.lessonId
      ),

    title:
      assignment.title,

    description:
      assignment.description ||
      '',

    activity_type:
      assignment.type ||
      'assignment',

    accepted_file:
      assignment.acceptedFile ||
      'audio',

    due_date:
      assignment.dueDate ||
      '',

    points:
      Number(
        assignment.points ??
        100
      ),

    status:
      assignment.status ||
      'published',

    evaluation_type:
      normalizeEvaluationType(
        assignment.evaluationType
      ),

    rubric_config:
      normalizeRubricConfig(
        assignment.rubricConfig
      )
  }
}

/* =========================================================
   TODAS
========================================================= */

export const fetchAssignments = async () => {
  const {
    data,
    error
  } = await supabase
    .from('assignments')
    .select('*')
    .order(
      'lesson_id',
      {
        ascending: true
      }
    )
    .order(
      'id',
      {
        ascending: true
      }
    )

  if (error) {
    console.error(
      'Error obteniendo tareas:',
      error
    )

    throw error
  }

  return (
    data || []
  ).map(
    normalizeAssignment
  )
}

/* =========================================================
   POR CLASE
========================================================= */

export const fetchAssignmentsByLesson =
  async lessonId => {
    const {
      data,
      error
    } = await supabase
      .from('assignments')
      .select('*')
      .eq(
        'lesson_id',
        Number(lessonId)
      )
      .order(
        'id',
        {
          ascending: true
        }
      )

    if (error) {
      console.error(
        'Error obteniendo tareas de la clase:',
        error
      )

      throw error
    }

    return (
      data || []
    ).map(
      normalizeAssignment
    )
  }

/* =========================================================
   UNA TAREA
========================================================= */

export const fetchAssignmentById =
  async assignmentId => {
    const {
      data,
      error
    } = await supabase
      .from('assignments')
      .select('*')
      .eq(
        'id',
        Number(assignmentId)
      )
      .single()

    if (error) {
      console.error(
        'Error obteniendo tarea:',
        error
      )

      throw error
    }

    return normalizeAssignment(
      data
    )
  }

/* =========================================================
   CREAR
========================================================= */

export const insertAssignment =
  async assignment => {
    const payload =
      createAssignmentPayload(
        assignment
      )

    const {
      data,
      error
    } = await supabase
      .from('assignments')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error(
        'Error creando tarea:',
        error
      )

      throw error
    }

    return normalizeAssignment(
      data
    )
  }

/* =========================================================
   ACTUALIZAR
========================================================= */

export const updateAssignment =
  async (
    assignmentId,
    assignment
  ) => {
    const payload = {
      ...createAssignmentPayload(
        assignment
      ),

      updated_at:
        new Date().toISOString()
    }

    const {
      data,
      error
    } = await supabase
      .from('assignments')
      .update(payload)
      .eq(
        'id',
        Number(assignmentId)
      )
      .select()
      .single()

    if (error) {
      console.error(
        'Error actualizando tarea:',
        error
      )

      throw error
    }

    return normalizeAssignment(
      data
    )
  }

/* =========================================================
   ELIMINAR
========================================================= */

export const removeAssignment =
  async assignmentId => {
    const {
      error
    } = await supabase
      .from('assignments')
      .delete()
      .eq(
        'id',
        Number(assignmentId)
      )

    if (error) {
      console.error(
        'Error eliminando tarea:',
        error
      )

      throw error
    }

    return true
  }
