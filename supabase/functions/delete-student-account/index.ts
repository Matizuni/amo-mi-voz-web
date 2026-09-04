import {
  createClient,
} from 'jsr:@supabase/supabase-js@2'

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const corsHeaders = {
  'Access-Control-Allow-Origin':
    '*',

  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',

  'Access-Control-Allow-Methods':
    'POST, OPTIONS',
}

const TEACHER_ROLE =
  'teacher'

const STUDENT_ROLE =
  'student'

const SUBMISSIONS_BUCKET =
  'entregas-alumnos'

/* =========================================================
   TIPOS
========================================================= */

type RequestBody = {
  studentId?: unknown
  deleteInscription?: unknown
}

type AdminClient =
  ReturnType<
    typeof createClient
  >

/* =========================================================
   EDGE FUNCTION
========================================================= */

Deno.serve(async req => {
  const requestId =
    crypto.randomUUID()

  const startedAt =
    Date.now()

  /* =======================================================
     CORS
  ======================================================== */

  if (
    req.method ===
    'OPTIONS'
  ) {
    return new Response(
      'ok',
      {
        headers:
          corsHeaders,
      },
    )
  }

  if (
    req.method !==
    'POST'
  ) {
    return jsonResponse(
      {
        success:
          false,

        error:
          'Método no permitido.',

        requestId,
      },

      405,
    )
  }

  try {
    /* =====================================================
       VARIABLES DE ENTORNO
    ====================================================== */

    const supabaseUrl =
      Deno.env.get(
        'SUPABASE_URL',
      )

    const supabaseAnonKey =
      Deno.env.get(
        'SUPABASE_ANON_KEY',
      )

    const serviceRoleKey =
      Deno.env.get(
        'SUPABASE_SERVICE_ROLE_KEY',
      )

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !serviceRoleKey
    ) {
      console.error(
        `[${requestId}] Faltan variables de entorno`,
      )

      return jsonResponse(
        {
          success:
            false,

          error:
            'La función no está configurada correctamente.',

          requestId,
        },

        500,
      )
    }

    /* =====================================================
       AUTORIZACIÓN
    ====================================================== */

    const authorization =
      req.headers.get(
        'Authorization',
      )

    if (!authorization) {
      return jsonResponse(
        {
          success:
            false,

          error:
            'No existe una sesión válida.',

          requestId,
        },

        401,
      )
    }

    /* =====================================================
       CLIENTE DEL USUARIO
    ====================================================== */

    const userClient =
      createClient(
        supabaseUrl,
        supabaseAnonKey,
        {
          global: {
            headers: {
              Authorization:
                authorization,
            },
          },

          auth: {
            autoRefreshToken:
              false,

            persistSession:
              false,
          },
        },
      )

    /* =====================================================
       VALIDAR SESIÓN
    ====================================================== */

    const {
      data: {
        user,
      },

      error:
        userError,
    } =
      await userClient.auth
        .getUser()

    if (
      userError ||
      !user
    ) {
      console.warn(
        `[${requestId}] Sesión inválida`,
        userError,
      )

      return jsonResponse(
        {
          success:
            false,

          error:
            'No fue posible validar tu sesión. Vuelve a iniciar sesión.',

          requestId,
        },

        401,
      )
    }

    /* =====================================================
       CLIENTE ADMINISTRATIVO
    ====================================================== */

    const admin =
      createClient(
        supabaseUrl,
        serviceRoleKey,
        {
          auth: {
            autoRefreshToken:
              false,

            persistSession:
              false,
          },
        },
      )

    /* =====================================================
       COMPROBAR PROFESOR
    ====================================================== */

    const {
      data:
        teacherProfile,

      error:
        teacherError,
    } =
      await admin
        .from(
          'profiles',
        )
        .select(`
          id,
          role,
          display_name
        `)
        .eq(
          'id',
          user.id,
        )
        .maybeSingle()

    if (teacherError) {
      console.error(
        `[${requestId}] Error consultando perfil del profesor:`,
        teacherError,
      )

      return jsonResponse(
        {
          success:
            false,

          error:
            'No pudimos comprobar tus permisos.',

          requestId,
        },

        500,
      )
    }

    if (
      !teacherProfile ||
      teacherProfile.role !==
        TEACHER_ROLE
    ) {
      console.warn(
        `[${requestId}] Usuario sin permisos de eliminación`,
        {
          userId:
            user.id,

          role:
            teacherProfile?.role ||
            null,
        },
      )

      return jsonResponse(
        {
          success:
            false,

          error:
            'Solo un profesor puede eliminar estudiantes.',

          requestId,
        },

        403,
      )
    }

    /* =====================================================
       LEER BODY
    ====================================================== */

    let body:
      RequestBody

    try {
      body =
        await req.json()
    } catch {
      return jsonResponse(
        {
          success:
            false,

          error:
            'Los datos enviados no son válidos.',

          requestId,
        },

        400,
      )
    }

    const studentId =
      Number(
        body.studentId,
      )

    /*
     * IMPORTANTE:
     *
     * El borrado definitivo elimina también la inscripción
     * POR DEFECTO.
     *
     * Solamente se conservará si explícitamente recibimos:
     *
     * deleteInscription: false
     */

    const deleteInscription =
      body.deleteInscription !==
      false

    /* =====================================================
       VALIDAR ID
    ====================================================== */

    if (
      !Number.isSafeInteger(
        studentId,
      ) ||
      studentId <= 0
    ) {
      return jsonResponse(
        {
          success:
            false,

          error:
            'El estudiante seleccionado no es válido.',

          requestId,
        },

        400,
      )
    }

    console.log(
      `[${requestId}] Solicitud de eliminación`,
      {
        teacherId:
          user.id,

        studentId,

        deleteInscription,
      },
    )

    /* =====================================================
       BUSCAR ESTUDIANTE
    ====================================================== */

    const {
      data:
        student,

      error:
        studentError,
    } =
      await admin
        .from(
          'students',
        )
        .select(`
          id,
          name,
          voice,
          active,
          created_at
        `)
        .eq(
          'id',
          studentId,
        )
        .maybeSingle()

    if (studentError) {
      console.error(
        `[${requestId}] Error consultando estudiante:`,
        studentError,
      )

      return jsonResponse(
        {
          success:
            false,

          error:
            'No pudimos consultar el estudiante.',

          requestId,
        },

        500,
      )
    }

    if (!student) {
      return jsonResponse(
        {
          success:
            false,

          error:
            'El estudiante ya no existe.',

          requestId,
        },

        404,
      )
    }

    /* =====================================================
       BUSCAR PROFILE
    ====================================================== */

    const {
      data:
        studentProfile,

      error:
        profileError,
    } =
      await admin
        .from(
          'profiles',
        )
        .select(`
          id,
          role,
          student_id,
          display_name,
          account_status
        `)
        .eq(
          'student_id',
          studentId,
        )
        .eq(
          'role',
          STUDENT_ROLE,
        )
        .maybeSingle()

    if (profileError) {
      console.error(
        `[${requestId}] Error consultando perfil:`,
        profileError,
      )

      return jsonResponse(
        {
          success:
            false,

          error:
            'No pudimos consultar la cuenta del estudiante.',

          requestId,
        },

        500,
      )
    }

    /* =====================================================
       PROTECCIÓN CONTRA AUTOELIMINACIÓN
    ====================================================== */

    if (
      studentProfile?.id ===
      user.id
    ) {
      console.error(
        `[${requestId}] Intento de autoeliminación bloqueado`,
      )

      return jsonResponse(
        {
          success:
            false,

          error:
            'No puedes eliminar tu propia cuenta desde esta operación.',

          requestId,
        },

        403,
      )
    }

    /* =====================================================
       OBTENER EMAIL AUTH
    ====================================================== */

    let studentEmail =
      ''

    if (
      studentProfile?.id
    ) {
      const {
        data:
          authUserData,

        error:
          authUserError,
      } =
        await admin.auth.admin
          .getUserById(
            studentProfile.id,
          )

      if (authUserError) {
        console.warn(
          `[${requestId}] No pudimos obtener el usuario Auth`,
          authUserError,
        )
      }

      studentEmail =
        normalizeEmail(
          authUserData
            ?.user
            ?.email,
        )
    }

    /* =====================================================
       BUSCAR INSCRIPCIONES RELACIONADAS

       Las guardamos antes de eliminar Auth.
    ====================================================== */

    let relatedInscriptionIds:
      number[] =
      []

    if (studentEmail) {
      const {
        data:
          inscriptions,

        error:
          inscriptionLookupError,
      } =
        await admin
          .from(
            'inscriptions',
          )
          .select(
            'id',
          )
          .eq(
            'email',
            studentEmail,
          )

      if (
        inscriptionLookupError
      ) {
        console.error(
          `[${requestId}] Error consultando inscripciones:`,
          inscriptionLookupError,
        )

        return jsonResponse(
          {
            success:
              false,

            error:
              'No pudimos comprobar la inscripción vinculada al estudiante.',

            requestId,
          },

          500,
        )
      }

      relatedInscriptionIds =
        (
          inscriptions ||
          []
        )
          .map(
            inscription =>
              Number(
                inscription.id,
              ),
          )
          .filter(
            id =>
              Number.isSafeInteger(
                id,
              ),
          )
    }

    /* =====================================================
       OBTENER ARCHIVOS DE ENTREGAS

       Esto evita dejar archivos huérfanos en Storage.
    ====================================================== */

    const submissionPaths =
      await getSubmissionStoragePaths(
        admin,
        studentId,
        requestId,
      )

    /* =====================================================
       LIMPIAR STORAGE

       No bloqueamos toda la eliminación si solamente
       falla la limpieza del archivo.
    ====================================================== */

    const warnings:
      string[] =
      []

    if (
      submissionPaths.length >
      0
    ) {
      const {
        error:
          storageError,
      } =
        await admin.storage
          .from(
            SUBMISSIONS_BUCKET,
          )
          .remove(
            submissionPaths,
          )

      if (storageError) {
        console.error(
          `[${requestId}] Error limpiando Storage:`,
          storageError,
        )

        warnings.push(
          'No pudimos eliminar uno o más archivos privados de entregas. Revisa Storage.',
        )
      }
    }

    /* =====================================================
       QUIZZES
    ====================================================== */

    await deleteQuizData(
      admin,
      studentId,
      requestId,
    )

    /* =====================================================
       PROGRESO GRANULAR
    ====================================================== */

    await deleteByStudentId(
      admin,
      'learning_item_progress',
      studentId,
      requestId,
    )

    /* =====================================================
       PROGRESO DE CLASE
    ====================================================== */

    await deleteByStudentId(
      admin,
      'lesson_progress',
      studentId,
      requestId,
    )

    /* =====================================================
       ENTREGAS
    ====================================================== */

    await deleteByStudentId(
      admin,
      'submissions',
      studentId,
      requestId,
    )

    /* =====================================================
       ASISTENCIA
    ====================================================== */

    await deleteByStudentId(
      admin,
      'attendance',
      studentId,
      requestId,
    )

    /* =====================================================
       PERFIL VOCAL
    ====================================================== */

    await deleteByStudentId(
      admin,
      'vocal_profiles',
      studentId,
      requestId,
    )

    /* =====================================================
       PROFILE
    ====================================================== */

    let profileDeleted =
      false

    if (
      studentProfile?.id
    ) {
      const {
        error:
          deleteProfileError,
      } =
        await admin
          .from(
            'profiles',
          )
          .delete()
          .eq(
            'id',
            studentProfile.id,
          )
          .eq(
            'role',
            STUDENT_ROLE,
          )

      if (
        deleteProfileError
      ) {
        console.error(
          `[${requestId}] Error eliminando profile:`,
          deleteProfileError,
        )

        return jsonResponse(
          {
            success:
              false,

            error:
              'No pudimos eliminar el perfil del estudiante.',

            requestId,
          },

          500,
        )
      }

      profileDeleted =
        true
    }

    /* =====================================================
       STUDENT
    ====================================================== */

    const {
      error:
        deleteStudentError,
    } =
      await admin
        .from(
          'students',
        )
        .delete()
        .eq(
          'id',
          studentId,
        )

    if (
      deleteStudentError
    ) {
      console.error(
        `[${requestId}] Error eliminando estudiante:`,
        deleteStudentError,
      )

      return jsonResponse(
        {
          success:
            false,

          error:
            'No pudimos eliminar el registro académico del estudiante.',

          requestId,
        },

        500,
      )
    }

    /* =====================================================
       AUTH

       Va después de eliminar la información académica.
    ====================================================== */

    let authDeleted =
      false

    if (
      studentProfile?.id
    ) {
      const {
        error:
          deleteAuthError,
      } =
        await admin.auth.admin
          .deleteUser(
            studentProfile.id,
          )

      if (
        deleteAuthError
      ) {
        console.error(
          `[${requestId}] Error eliminando Auth:`,
          deleteAuthError,
        )

        return jsonResponse(
          {
            success:
              false,

            partial:
              true,

            error:
              'Los datos académicos fueron eliminados, pero no pudimos eliminar la cuenta de acceso.',

            requestId,
          },

          500,
        )
      }

      authDeleted =
        true
    }

    /* =====================================================
       INSCRIPCIÓN

       ELIMINACIÓN DEFINITIVA:
       también desaparece de Inscripciones.

       Si en el futuro enviamos:
       deleteInscription: false

       volverá a Aprobada.
    ====================================================== */

    let inscriptionAction:
      'deleted' |
      'restored' |
      'not_found' |
      'failed' =
      'not_found'

    if (
      relatedInscriptionIds.length >
      0
    ) {
      if (
        deleteInscription
      ) {
        const {
          error:
            deleteInscriptionError,
        } =
          await admin
            .from(
              'inscriptions',
            )
            .delete()
            .in(
              'id',
              relatedInscriptionIds,
            )

        if (
          deleteInscriptionError
        ) {
          inscriptionAction =
            'failed'

          warnings.push(
            'El alumno fue eliminado, pero no pudimos borrar su inscripción.',
          )

          console.error(
            `[${requestId}] Error eliminando inscripción:`,
            deleteInscriptionError,
          )
        } else {
          inscriptionAction =
            'deleted'
        }
      } else {
        const {
          error:
            restoreInscriptionError,
        } =
          await admin
            .from(
              'inscriptions',
            )
            .update({
              status:
                'approved',

              enrolled_at:
                null,

              updated_at:
                new Date()
                  .toISOString(),
            })
            .in(
              'id',
              relatedInscriptionIds,
            )

        if (
          restoreInscriptionError
        ) {
          inscriptionAction =
            'failed'

          warnings.push(
            'El alumno fue eliminado, pero no pudimos restablecer su inscripción.',
          )

          console.error(
            `[${requestId}] Error restableciendo inscripción:`,
            restoreInscriptionError,
          )
        } else {
          inscriptionAction =
            'restored'
        }
      }
    }

    /* =====================================================
       AUDITORÍA
    ====================================================== */

    const durationMs =
      Date.now() -
      startedAt

    console.log(
      `[${requestId}] Eliminación completada`,
      {
        teacherId:
          user.id,

        teacherName:
          teacherProfile.display_name ||
          null,

        studentId:
          student.id,

        studentName:
          student.name,

        authUserId:
          studentProfile?.id ||
          null,

        authDeleted,

        profileDeleted,

        deleteInscription,

        inscriptionAction,

        inscriptionsAffected:
          relatedInscriptionIds.length,

        storageFiles:
          submissionPaths.length,

        warnings,

        durationMs,
      },
    )

    /* =====================================================
       RESPUESTA
    ====================================================== */

    return jsonResponse(
      {
        success:
          true,

        message:
          buildSuccessMessage(
            student.name,
            inscriptionAction,
          ),

        student: {
          id:
            student.id,

          name:
            student.name,

          voice:
            student.voice,
        },

        deletion: {
          academicDataDeleted:
            true,

          profileDeleted,

          authDeleted,

          storageFilesProcessed:
            submissionPaths.length,

          inscription: {
            requestedDeletion:
              deleteInscription,

            action:
              inscriptionAction,

            affected:
              relatedInscriptionIds.length,
          },
        },

        warnings,

        requestId,

        durationMs,
      },

      200,
    )
  } catch (error) {
    console.error(
      `[${requestId}] Error inesperado eliminando estudiante:`,
      error,
    )

    return jsonResponse(
      {
        success:
          false,

        error:
          'Ocurrió un error interno eliminando al estudiante.',

        requestId,
      },

      500,
    )
  }
})

/* =========================================================
   OBTENER ARCHIVOS DE ENTREGAS
========================================================= */

async function getSubmissionStoragePaths(
  admin:
    AdminClient,

  studentId:
    number,

  requestId:
    string,
) {
  const {
    data,
    error,
  } =
    await admin
      .from(
        'submissions',
      )
      .select(
        'storage_path',
      )
      .eq(
        'student_id',
        studentId,
      )

  if (error) {
    console.warn(
      `[${requestId}] No pudimos consultar archivos de entregas:`,
      error,
    )

    return []
  }

  return [
    ...new Set(
      (
        data ||
        []
      )
        .map(
          submission =>
            String(
              submission.storage_path ||
              '',
            ).trim(),
        )
        .filter(Boolean),
    ),
  ]
}

/* =========================================================
   BORRAR REGISTROS POR student_id
========================================================= */

async function deleteByStudentId(
  admin:
    AdminClient,

  table:
    string,

  studentId:
    number,

  requestId:
    string,
) {
  const {
    error,
  } =
    await admin
      .from(table)
      .delete()
      .eq(
        'student_id',
        studentId,
      )

  if (error) {
    console.error(
      `[${requestId}] Error limpiando ${table}:`,
      error,
    )

    throw error
  }
}

/* =========================================================
   QUIZZES
========================================================= */

async function deleteQuizData(
  admin:
    AdminClient,

  studentId:
    number,

  requestId:
    string,
) {
  const {
    data:
      attempts,

    error:
      attemptsError,
  } =
    await admin
      .from(
        'quiz_attempts',
      )
      .select(
        'id',
      )
      .eq(
        'student_id',
        studentId,
      )

  if (
    attemptsError
  ) {
    console.error(
      `[${requestId}] Error consultando intentos de quiz:`,
      attemptsError,
    )

    throw attemptsError
  }

  const attemptIds =
    (
      attempts ||
      []
    )
      .map(
        attempt =>
          attempt.id,
      )

  if (
    attemptIds.length >
    0
  ) {
    const {
      error:
        answersError,
    } =
      await admin
        .from(
          'quiz_answers',
        )
        .delete()
        .in(
          'attempt_id',
          attemptIds,
        )

    if (
      answersError
    ) {
      console.error(
        `[${requestId}] Error eliminando respuestas de quiz:`,
        answersError,
      )

      throw answersError
    }
  }

  const {
    error:
      attemptsDeleteError,
  } =
    await admin
      .from(
        'quiz_attempts',
      )
      .delete()
      .eq(
        'student_id',
        studentId,
      )

  if (
    attemptsDeleteError
  ) {
    console.error(
      `[${requestId}] Error eliminando intentos de quiz:`,
      attemptsDeleteError,
    )

    throw attemptsDeleteError
  }
}

/* =========================================================
   NORMALIZAR EMAIL
========================================================= */

function normalizeEmail(
  value:
    unknown,
) {
  return String(
    value ??
    '',
  )
    .trim()
    .toLowerCase()
}

/* =========================================================
   MENSAJE DE ÉXITO
========================================================= */

function buildSuccessMessage(
  studentName:
    string,

  inscriptionAction:
    'deleted' |
    'restored' |
    'not_found' |
    'failed',
) {
  if (
    inscriptionAction ===
    'deleted'
  ) {
    return `${studentName} y su inscripción fueron eliminados definitivamente.`
  }

  if (
    inscriptionAction ===
    'restored'
  ) {
    return `${studentName} fue eliminado y su inscripción volvió al estado Aprobada.`
  }

  if (
    inscriptionAction ===
    'failed'
  ) {
    return `${studentName} fue eliminado, pero su inscripción requiere revisión.`
  }

  return `${studentName} fue eliminado definitivamente.`
}

/* =========================================================
   RESPUESTA JSON
========================================================= */

function jsonResponse(
  body:
    Record<
      string,
      unknown
    >,

  status =
    200,
) {
  return new Response(
    JSON.stringify(
      body,
    ),

    {
      status,

      headers: {
        ...corsHeaders,

        'Content-Type':
          'application/json; charset=utf-8',

        'Cache-Control':
          'no-store',

        'X-Request-Id':
          String(
            body.requestId ??
            '',
          ),
      },
    },
  )
}
