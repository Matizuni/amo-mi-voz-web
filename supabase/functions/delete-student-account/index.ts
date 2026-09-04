import {
  createClient,
} from 'jsr:@supabase/supabase-js@2'

/* =========================================================
   CORS
========================================================= */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',

  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',

  'Access-Control-Allow-Methods':
    'POST, OPTIONS',
}

/* =========================================================
   EDGE FUNCTION
========================================================= */

Deno.serve(async req => {
  const requestId =
    crypto.randomUUID()

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

      error: userError,
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
       COMPROBAR ROL PROFESOR
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
        .select(
          'id, role, display_name',
        )
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
          error:
            'No pudimos comprobar los permisos del usuario.',

          requestId,
        },

        500,
      )
    }

    if (
      !teacherProfile ||
      teacherProfile.role !==
        'teacher'
    ) {
      return jsonResponse(
        {
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
      Record<string, unknown>

    try {
      body =
        await req.json()
    } catch {
      return jsonResponse(
        {
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

    if (
      !Number.isSafeInteger(
        studentId,
      ) ||
      studentId <= 0
    ) {
      return jsonResponse(
        {
          error:
            'El estudiante seleccionado no es válido.',

          requestId,
        },

        400,
      )
    }

    /* =====================================================
       BUSCAR ESTUDIANTE
    ====================================================== */

    const {
      data: student,
      error: studentError,
    } =
      await admin
        .from(
          'students',
        )
        .select(
          'id, name, voice, active, created_at',
        )
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
          'student',
        )
        .maybeSingle()

    if (profileError) {
      console.error(
        `[${requestId}] Error consultando perfil del estudiante:`,
        profileError,
      )

      return jsonResponse(
        {
          error:
            'No pudimos consultar la cuenta del estudiante.',

          requestId,
        },

        500,
      )
    }

    /* =====================================================
       OBTENER CORREO AUTH
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
          `[${requestId}] No se pudo obtener el usuario Auth:`,
          authUserError,
        )
      }

      studentEmail =
        String(
          authUserData
            ?.user
            ?.email ||
          '',
        )
          .trim()
          .toLowerCase()
    }

    /* =====================================================
       ELIMINAR RESPUESTAS / INTENTOS DE QUIZ
    ====================================================== */

    await deleteQuizData(
      admin,
      studentId,
      requestId,
    )

    /* =====================================================
       ELIMINAR PROGRESO
    ====================================================== */

    await deleteByStudentId(
      admin,
      'learning_item_progress',
      studentId,
      requestId,
    )

    await deleteByStudentId(
      admin,
      'lesson_progress',
      studentId,
      requestId,
    )

    /* =====================================================
       ELIMINAR ENTREGAS
    ====================================================== */

    await deleteByStudentId(
      admin,
      'submissions',
      studentId,
      requestId,
    )

    /* =====================================================
       ELIMINAR ASISTENCIA
    ====================================================== */

    await deleteByStudentId(
      admin,
      'attendance',
      studentId,
      requestId,
    )

    /* =====================================================
       ELIMINAR PERFIL VOCAL
    ====================================================== */

    await deleteByStudentId(
      admin,
      'vocal_profiles',
      studentId,
      requestId,
    )

    /* =====================================================
       RESTABLECER INSCRIPCIÓN

       Si estaba matriculada, vuelve a approved.
    ====================================================== */

    let inscriptionReset =
      false

    if (studentEmail) {
      const {
        data:
          resetInscriptions,

        error:
          inscriptionError,
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
          .eq(
            'email',
            studentEmail,
          )
          .eq(
            'status',
            'enrolled',
          )
          .select(
            'id, status',
          )

      if (inscriptionError) {
        console.error(
          `[${requestId}] Error restableciendo inscripción:`,
          inscriptionError,
        )

        return jsonResponse(
          {
            error:
              'No pudimos restablecer la inscripción del estudiante.',

            requestId,
          },

          500,
        )
      }

      inscriptionReset =
        Boolean(
          resetInscriptions
            ?.length,
        )
    }

    /* =====================================================
       ELIMINAR PROFILE
    ====================================================== */

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
            'student',
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
            error:
              'No pudimos eliminar el perfil del estudiante.',

            requestId,
          },

          500,
        )
      }
    }

    /* =====================================================
       ELIMINAR STUDENT
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
          error:
            'No pudimos eliminar el registro académico del estudiante.',

          requestId,
        },

        500,
      )
    }

    /* =====================================================
       ELIMINAR AUTH

       Va al final porque es la parte más sensible.
    ====================================================== */

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
            error:
              'El alumno académico fue eliminado, pero no pudimos eliminar su cuenta de acceso.',

            requestId,
          },

          500,
        )
      }
    }

    /* =====================================================
       ÉXITO
    ====================================================== */

    console.log(
      `[${requestId}] Estudiante eliminado definitivamente`,
      {
        studentId:
          student.id,

        studentName:
          student.name,

        authUserId:
          studentProfile?.id ||
          null,

        inscriptionReset,
      },
    )

    return jsonResponse(
      {
        success:
          true,

        message:
          `${student.name} fue eliminado definitivamente.`,

        student: {
          id:
            student.id,

          name:
            student.name,

          voice:
            student.voice,
        },

        inscriptionReset,

        requestId,
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
        error:
          'Ocurrió un error interno eliminando al estudiante.',

        requestId,
      },

      500,
    )
  }
})

/* =========================================================
   BORRAR REGISTROS POR student_id
========================================================= */

async function deleteByStudentId(
  admin:
    ReturnType<
      typeof createClient
    >,

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

    throw new Error(
      `No pudimos limpiar los datos de ${table}.`,
    )
  }
}

/* =========================================================
   QUIZZES

   quiz_answers depende de quiz_attempts.
========================================================= */

async function deleteQuizData(
  admin:
    ReturnType<
      typeof createClient
    >,

  studentId:
    number,

  requestId:
    string,
) {
  const {
    data: attempts,
    error: attemptsError,
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
      attempts || []
    )
      .map(
        attempt =>
          attempt.id,
      )

  if (
    attemptIds.length > 0
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
      },
    },
  )
}
