import { supabase } from '@/lib/supabase'

/* =========================================================
   NORMALIZAR
========================================================= */

const normalizeSubmission = submission => {
  if (!submission) {
    return null
  }

  return {
    id: submission.id,

    assignmentId:
      submission.assignment_id,

    taskId:
      submission.assignment_id,

    lessonId:
      submission.lesson_id,

    studentId:
      submission.student_id,

    studentName:
      submission.student_name,

    fileName:
      submission.file_name || '',

    fileUrl:
      submission.file_url || '',

    storagePath:
      submission.storage_path || '',

    fileSize:
      submission.file_size || 0,

    mimeType:
      submission.mime_type || '',

    status:
      submission.status || 'delivered',

    grade:
      submission.grade || '',

    feedback:
      submission.feedback || '',

    rubric:
      submission.rubric || null,

    submittedAt:
      submission.submitted_at,

    reviewedAt:
      submission.reviewed_at,

    createdAt:
      submission.created_at,

    updatedAt:
      submission.updated_at
  }
}

/* =========================================================
   TODAS LAS ENTREGAS
========================================================= */

export const fetchSubmissions = async () => {
  const {
    data,
    error
  } = await supabase
    .from('submissions')
    .select('*')
    .order(
      'submitted_at',
      {
        ascending: false
      }
    )

  if (error) {
    console.error(
      'Error obteniendo entregas:',
      error
    )

    throw error
  }

  return (
    data || []
  ).map(
    normalizeSubmission
  )
}

/* =========================================================
   ENTREGAS DE UNA TAREA
========================================================= */

export const fetchSubmissionsByAssignment =
  async assignmentId => {
    const {
      data,
      error
    } = await supabase
      .from('submissions')
      .select('*')
      .eq(
        'assignment_id',
        Number(assignmentId)
      )
      .order(
        'submitted_at',
        {
          ascending: false
        }
      )

    if (error) {
      console.error(
        'Error obteniendo entregas de la tarea:',
        error
      )

      throw error
    }

    return (
      data || []
    ).map(
      normalizeSubmission
    )
  }

/* =========================================================
   ENTREGA DE UN ALUMNO
========================================================= */

export const fetchStudentSubmission =
  async (
    assignmentId,
    studentId
  ) => {
    const {
      data,
      error
    } = await supabase
      .from('submissions')
      .select('*')
      .eq(
        'assignment_id',
        Number(assignmentId)
      )
      .eq(
        'student_id',
        Number(studentId)
      )
      .maybeSingle()

    if (error) {
      console.error(
        'Error obteniendo entrega del estudiante:',
        error
      )

      throw error
    }

    return normalizeSubmission(
      data
    )
  }

/* =========================================================
   CREAR ENTREGA
========================================================= */

export const insertSubmission =
  async submission => {
    const payload = {
      assignment_id:
        Number(
          submission.assignmentId ??
          submission.taskId
        ),

      lesson_id:
        Number(
          submission.lessonId
        ),

      student_id:
        Number(
          submission.studentId
        ),

      student_name:
        submission.studentName,

      file_name:
        submission.fileName || '',

      file_url:
        submission.fileUrl || '',

      storage_path:
        submission.storagePath || '',

      file_size:
        Number(
          submission.fileSize || 0
        ),

      mime_type:
        submission.mimeType || '',

      status:
        submission.status ||
        'delivered',

      grade:
        submission.grade || '',

      feedback:
        submission.feedback || '',

      rubric:
        submission.rubric || null,

      submitted_at:
        submission.submittedAt ||
        new Date().toISOString()
    }

    const {
      data,
      error
    } = await supabase
      .from('submissions')
      .insert(payload)
      .select()
      .single()

    if (error) {
      console.error(
        'Error creando entrega:',
        error
      )

      throw error
    }

    return normalizeSubmission(
      data
    )
  }

/* =========================================================
   ACTUALIZAR ENTREGA
========================================================= */

export const updateSubmission =
  async (
    submissionId,
    submission
  ) => {
    const payload = {
      status:
        submission.status ||
        'delivered',

      grade:
        submission.grade || '',

      feedback:
        submission.feedback || '',

      rubric:
        submission.rubric || null,

      reviewed_at:
        submission.reviewedAt ||
        null,

      updated_at:
        new Date().toISOString()
    }

    const {
      data,
      error
    } = await supabase
      .from('submissions')
      .update(payload)
      .eq(
        'id',
        Number(submissionId)
      )
      .select()
      .single()

    if (error) {
      console.error(
        'Error actualizando entrega:',
        error
      )

      throw error
    }

    return normalizeSubmission(
      data
    )
  }

/* =========================================================
   REEMPLAZAR ARCHIVO DE UNA ENTREGA
========================================================= */

export const replaceSubmissionFile =
  async (
    submissionId,
    fileData
  ) => {
    const payload = {
      file_name:
        fileData.fileName || '',

      file_url:
        fileData.fileUrl || '',

      storage_path:
        fileData.storagePath || '',

      file_size:
        Number(
          fileData.fileSize || 0
        ),

      mime_type:
        fileData.mimeType || '',

      status:
        'delivered',

      submitted_at:
        new Date().toISOString(),

      grade:
        '',

      feedback:
        '',

      rubric:
        null,

      reviewed_at:
        null,

      updated_at:
        new Date().toISOString()
    }

    const {
      data,
      error
    } = await supabase
      .from('submissions')
      .update(payload)
      .eq(
        'id',
        Number(submissionId)
      )
      .select()
      .single()

    if (error) {
      console.error(
        'Error reemplazando archivo de la entrega:',
        error
      )

      throw error
    }

    return normalizeSubmission(
      data
    )
  }

/* =========================================================
   ELIMINAR REGISTRO
========================================================= */

export const removeSubmissionRecord =
  async submissionId => {
    const {
      error
    } = await supabase
      .from('submissions')
      .delete()
      .eq(
        'id',
        Number(submissionId)
      )

    if (error) {
      console.error(
        'Error eliminando registro de entrega:',
        error
      )

      throw error
    }

    return true
  }

/* =========================================================
   ELIMINAR ENTREGA COMPLETA
========================================================= */

export const removeSubmission =
  async submission => {
    if (!submission) {
      return false
    }

    if (submission.storagePath) {
      const {
        error: storageError
      } = await supabase
        .storage
        .from('entregas-alumnos')
        .remove([
          submission.storagePath
        ])

      if (storageError) {
        console.error(
          'Error eliminando archivo de la entrega:',
          storageError
        )

        throw storageError
      }
    }

    await removeSubmissionRecord(
      submission.id
    )

    return true
  }

/* =========================================================
   URL TEMPORAL PARA ARCHIVO PRIVADO
========================================================= */

export const createSubmissionSignedUrl =
  async (
    storagePath,
    expiresIn = 3600
  ) => {
    if (!storagePath) {
      return ''
    }

    const {
      data,
      error
    } = await supabase
      .storage
      .from('entregas-alumnos')
      .createSignedUrl(
        storagePath,
        expiresIn
      )

    if (error) {
      console.error(
        'Error creando URL temporal:',
        error
      )

      throw error
    }

    return data?.signedUrl || ''
  }
