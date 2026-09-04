import { createClient } from 'jsr:@supabase/supabase-js@2'

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods':
    'POST, OPTIONS',
}

const VALID_VOICES = new Set([
  'Soprano',
  'Alto',
  'Tenor',
  'Bajo',
])

/* =========================================================
   EDGE FUNCTION
========================================================= */

Deno.serve(async (req) => {
  const requestId = crypto.randomUUID()

  /* =======================================================
     CORS
  ======================================================= */

  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders,
    })
  }

  if (req.method !== 'POST') {
    return jsonResponse(
      {
        error:
          'Método no permitido.',
        requestId,
      },
      405
    )
  }

  console.log(
    `[${requestId}] Iniciando matrícula`
  )

  try {
    /* =====================================================
       VARIABLES DE ENTORNO
    ====================================================== */

    const supabaseUrl =
      Deno.env.get(
        'SUPABASE_URL'
      )

    const supabaseAnonKey =
      Deno.env.get(
        'SUPABASE_ANON_KEY'
      )

    const serviceRoleKey =
      Deno.env.get(
        'SUPABASE_SERVICE_ROLE_KEY'
      )

    const appUrl =
      String(
        Deno.env.get('APP_URL') ||
        'https://amo-mi-voz-web.vercel.app'
      )
        .trim()
        .replace(/\/$/, '')

    const activationRedirectUrl =
      `${appUrl}/aula/activar-cuenta`

    if (
      !supabaseUrl ||
      !supabaseAnonKey ||
      !serviceRoleKey
    ) {
      console.error(
        `[${requestId}] Faltan variables de entorno`
      )

      return jsonResponse(
        {
          error:
            'La función no está configurada correctamente.',
          requestId,
        },
        500
      )
    }

    /* =====================================================
       AUTORIZACIÓN
    ====================================================== */

    const authorization =
      req.headers.get(
        'Authorization'
      )

    if (!authorization) {
      return jsonResponse(
        {
          error:
            'No existe una sesión válida.',
          requestId,
        },
        401
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
        }
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
        userError
      )

      return jsonResponse(
        {
          error:
            'No fue posible validar tu sesión. Vuelve a iniciar sesión.',
          requestId,
        },
        401
      )
    }

    console.log(
      `[${requestId}] Usuario autenticado:`,
      user.id
    )

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
        }
      )

    /* =====================================================
       COMPROBAR ROL PROFESOR
    ====================================================== */

    const {
      data: teacherProfile,
      error: teacherError,
    } =
      await admin
        .from('profiles')
        .select(
          'id, role, display_name'
        )
        .eq(
          'id',
          user.id
        )
        .maybeSingle()

    if (teacherError) {
      console.error(
        `[${requestId}] Error consultando perfil del profesor:`,
        teacherError
      )

      return jsonResponse(
        {
          error:
            'No pudimos comprobar los permisos del usuario.',
          requestId,
        },
        500
      )
    }

    if (
      !teacherProfile ||
      teacherProfile.role !==
        'teacher'
    ) {
      console.warn(
        `[${requestId}] Usuario sin rol teacher`
      )

      return jsonResponse(
        {
          error:
            'Solo un profesor puede matricular estudiantes.',
          requestId,
        },
        403
      )
    }

    /* =====================================================
       LEER BODY
    ====================================================== */

    let body:
      Record<string, unknown>

    try {
      body = await req.json()
    } catch {
      return jsonResponse(
        {
          error:
            'Los datos enviados no son válidos.',
          requestId,
        },
        400
      )
    }

    const inscriptionId =
      Number(
        body.inscriptionId
      )

    const voice =
      String(
        body.voice ?? ''
      ).trim()

    /* =====================================================
       VALIDAR ID
    ====================================================== */

    if (
      !Number.isSafeInteger(
        inscriptionId
      ) ||
      inscriptionId <= 0
    ) {
      return jsonResponse(
        {
          error:
            'La inscripción seleccionada no es válida.',
          requestId,
        },
        400
      )
    }

    /* =====================================================
       VALIDAR VOZ
    ====================================================== */

    if (
      !VALID_VOICES.has(
        voice
      )
    ) {
      return jsonResponse(
        {
          error:
            'Selecciona una clasificación vocal válida.',
          requestId,
        },
        400
      )
    }

    console.log(
      `[${requestId}] Solicitud recibida`,
      {
        inscriptionId,
        voice,
      }
    )

    /* =====================================================
       BUSCAR INSCRIPCIÓN

       IMPORTANTE:
       Separamos "error de BD"
       de "registro inexistente".
    ====================================================== */

    const {
      data: inscription,
      error: inscriptionError,
    } =
      await admin
        .from('inscriptions')
        .select(`
          id,
          name,
          age,
          phone,
          email,
          guardian_name,
          guardian_phone,
          interest,
          experience,
          goals,
          availability,
          message,
          status,
          reviewed_at,
          enrolled_at,
          created_at
        `)
        .eq(
          'id',
          inscriptionId
        )
        .maybeSingle()

    /*
     * Antes cualquier inscriptionError
     * terminaba como 404.
     *
     * Ahora veremos el error real
     * en los logs de Supabase.
     */

    if (inscriptionError) {
      console.error(
        `[${requestId}] Error consultando inscriptions:`,
        {
          code:
            inscriptionError.code,

          message:
            inscriptionError.message,

          details:
            inscriptionError.details,

          hint:
            inscriptionError.hint,
        }
      )

      return jsonResponse(
        {
          error:
            'La función no pudo consultar la inscripción en la base de datos.',
          requestId,
        },
        500
      )
    }

    if (!inscription) {
      console.warn(
        `[${requestId}] Inscripción ${inscriptionId} inexistente`
      )

      return jsonResponse(
        {
          error:
            'No encontramos la inscripción solicitada.',
          requestId,
        },
        404
      )
    }

    console.log(
      `[${requestId}] Inscripción encontrada:`,
      {
        id:
          inscription.id,

        status:
          inscription.status,
      }
    )

    /* =====================================================
       VALIDAR ESTADO
    ====================================================== */

    if (
      inscription.status ===
      'enrolled'
    ) {
      return jsonResponse(
        {
          error:
            'Esta inscripción ya fue matriculada.',
          requestId,
        },
        409
      )
    }

    if (
      inscription.status !==
      'approved'
    ) {
      return jsonResponse(
        {
          error:
            'La solicitud debe estar aprobada antes de matricular.',
          requestId,
        },
        409
      )
    }

    /* =====================================================
       NORMALIZAR DATOS
    ====================================================== */

    const name =
      normalizeText(
        inscription.name
      )

    const email =
      normalizeEmail(
        inscription.email
      )

    if (!name) {
      return jsonResponse(
        {
          error:
            'La inscripción no contiene un nombre válido.',
          requestId,
        },
        400
      )
    }

    if (
      !email ||
      !isValidEmail(email)
    ) {
      return jsonResponse(
        {
          error:
            'La inscripción no contiene un correo electrónico válido.',
          requestId,
        },
        400
      )
    }

    /* =====================================================
       VERIFICAR DUPLICADOS
    ====================================================== */

    const {
      data: existingStudent,
      error: existingStudentError,
    } =
      await admin
        .from('students')
        .select('id, name, active')
        .ilike('name', name)
        .eq('active', true)
        .maybeSingle()

    if (existingStudentError) {
      console.error(
        `[${requestId}] Error buscando estudiante existente:`,
        existingStudentError
      )

      return jsonResponse(
        {
          error:
            'No fue posible comprobar si el estudiante ya existe.',
          requestId,
        },
        500
      )
    }

    if (existingStudent) {
      return jsonResponse(
        {
          error:
            'Ya existe un estudiante activo con este nombre.',
          requestId,
        },
        409
      )
    }

    /* =====================================================
       CREAR ESTUDIANTE
    ====================================================== */

    console.log(
      `[${requestId}] Creando estudiante`
    )

    const {
      data: student,
      error: studentError,
    } =
      await admin
        .from('students')
        .insert({
          name,
          voice,
          active: true,
        })
        .select(
          'id, name, voice, active'
        )
        .single()

    if (
      studentError ||
      !student
    ) {
      console.error(
        `[${requestId}] Error creando estudiante:`,
        studentError
      )

      return jsonResponse(
        {
          error:
            'No fue posible crear el perfil académico del estudiante.',
          requestId,
        },
        500
      )
    }

    console.log(
      `[${requestId}] Estudiante creado:`,
      student.id
    )

    /* =====================================================
       INVITAR USUARIO A SUPABASE AUTH
    ====================================================== */

    console.log(
      `[${requestId}] Creando cuenta Auth para ${email}`
    )

    const {
      data: inviteData,
      error: inviteError,
    } =
      await admin.auth.admin
        .inviteUserByEmail(
          email,
          {
            data: {
              display_name:
                name,

              role:
                'student',
            },

            redirectTo:
              activationRedirectUrl,
          }
        )

    if (
      inviteError ||
      !inviteData?.user
    ) {
      console.error(
        `[${requestId}] Error Auth:`,
        inviteError
      )

      /*
       * Rollback del estudiante:
       * no dejamos una matrícula
       * académica huérfana.
       */

      await safeDeleteStudent(
        admin,
        student.id,
        requestId
      )

      return jsonResponse(
        {
          error:
            getInviteErrorMessage(
              inviteError
            ),

          requestId,
        },
        409
      )
    }

    const authUser =
      inviteData.user

    console.log(
      `[${requestId}] Usuario Auth creado:`,
      authUser.id
    )

    /* =====================================================
       VINCULAR PROFILE CON STUDENT
    ====================================================== */

    const {
      data: linkedProfile,
      error: linkError,
    } =
      await admin
        .from('profiles')
        .update({
          role:
            'student',

          student_id:
            student.id,

          display_name:
            name,

          account_status:
            'invited',

          activated_at:
            null,
        })
        .eq(
          'id',
          authUser.id
        )
        .select(
          'id, role, student_id, display_name, account_status, activated_at'
        )
        .maybeSingle()

    if (
      linkError ||
      !linkedProfile
    ) {
      console.error(
        `[${requestId}] Error vinculando profile:`,
        linkError
      )

      /*
       * Rollback:
       * eliminamos Auth y student.
       */

      await safeDeleteAuthUser(
        admin,
        authUser.id,
        requestId
      )

      await safeDeleteStudent(
        admin,
        student.id,
        requestId
      )

      return jsonResponse(
        {
          error:
            'No fue posible vincular la cuenta con el estudiante.',
          requestId,
        },
        500
      )
    }

    console.log(
      `[${requestId}] Profile vinculado correctamente`
    )

    /* =====================================================
       MARCAR INSCRIPCIÓN COMO MATRICULADA
    ====================================================== */

    const enrolledAt =
      new Date()
        .toISOString()

    const {
      data: updatedInscription,
      error:
        inscriptionUpdateError,
    } =
      await admin
        .from('inscriptions')
        .update({
          status:
            'enrolled',

          enrolled_at:
            enrolledAt,
        })
        .eq(
          'id',
          inscription.id
        )
        .eq(
          'status',
          'approved'
        )
        .select(`
          id,
          name,
          email,
          status,
          enrolled_at,
          updated_at
        `)
        .maybeSingle()

    if (
      inscriptionUpdateError ||
      !updatedInscription
    ) {
      console.error(
        `[${requestId}] Error finalizando inscripción:`,
        inscriptionUpdateError
      )

      /*
       * Rollback de consistencia.
       *
       * Si no podemos completar el
       * registro administrativo,
       * eliminamos las entidades
       * recién creadas.
       */

      await safeDeleteAuthUser(
        admin,
        authUser.id,
        requestId
      )

      await safeDeleteStudent(
        admin,
        student.id,
        requestId
      )

      return jsonResponse(
        {
          error:
            'No pudimos completar el registro administrativo de la matrícula.',
          requestId,
        },
        500
      )
    }

    /* =====================================================
       ÉXITO
    ====================================================== */

    console.log(
      `[${requestId}] Matrícula completada`,
      {
        inscriptionId:
          inscription.id,

        studentId:
          student.id,

        authUserId:
          authUser.id,
      }
    )

    return jsonResponse(
      {
        success: true,

        message:
          'Matrícula completada correctamente.',

        student: {
          id:
            student.id,

          name:
            student.name,

          voice:
            student.voice,

          active:
            student.active,
        },

        authUser: {
          id:
            authUser.id,

          email:
            authUser.email,

          accountStatus:
            linkedProfile.account_status,
        },

        activation: {
          status:
            linkedProfile.account_status,

          redirectTo:
            activationRedirectUrl,
        },

        profile: {
          id:
            linkedProfile.id,

          role:
            linkedProfile.role,

          student_id:
            linkedProfile.student_id,

          display_name:
            linkedProfile.display_name,

          account_status:
            linkedProfile.account_status,

          activated_at:
            linkedProfile.activated_at,
        },

        inscription:
          updatedInscription,

        requestId,
      },
      200
    )
  } catch (error) {
    console.error(
      `[${requestId}] Error no controlado:`,
      error
    )

    return jsonResponse(
      {
        error:
          'Ocurrió un error interno durante la matrícula.',

        requestId,
      },
      500
    )
  }
})

/* =========================================================
   HELPERS
========================================================= */

function normalizeText(
  value: unknown
) {
  return String(
    value ?? ''
  )
    .trim()
    .replace(
      /\s+/g,
      ' '
    )
}

function normalizeEmail(
  value: unknown
) {
  return String(
    value ?? ''
  )
    .trim()
    .toLowerCase()
}

function isValidEmail(
  email: string
) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email)
}

/* =========================================================
   MENSAJES AUTH
========================================================= */

function getInviteErrorMessage(
  error: {
    message?: string
  } | null
) {
  const message =
    String(
      error?.message ?? ''
    )
      .toLowerCase()

  if (
    message.includes(
      'already'
    ) ||
    message.includes(
      'registered'
    ) ||
    message.includes(
      'exists'
    )
  ) {
    return 'Ya existe una cuenta registrada con este correo electrónico.'
  }

  if (
    message.includes(
      'email'
    )
  ) {
    return 'No fue posible crear la cuenta con el correo registrado.'
  }

  return 'No fue posible crear la cuenta del estudiante.'
}

/* =========================================================
   ROLLBACK SEGURO
========================================================= */

async function safeDeleteStudent(
  admin: ReturnType<
    typeof createClient
  >,
  studentId: number,
  requestId: string
) {
  try {
    const {
      error,
    } =
      await admin
        .from('students')
        .delete()
        .eq(
          'id',
          studentId
        )

    if (error) {
      console.error(
        `[${requestId}] Rollback student falló:`,
        error
      )
    }
  } catch (error) {
    console.error(
      `[${requestId}] Excepción rollback student:`,
      error
    )
  }
}

async function safeDeleteAuthUser(
  admin: ReturnType<
    typeof createClient
  >,
  authUserId: string,
  requestId: string
) {
  try {
    const {
      error,
    } =
      await admin.auth.admin
        .deleteUser(
          authUserId
        )

    if (error) {
      console.error(
        `[${requestId}] Rollback Auth falló:`,
        error
      )
    }
  } catch (error) {
    console.error(
      `[${requestId}] Excepción rollback Auth:`,
      error
    )
  }
}

/* =========================================================
   RESPUESTA JSON
========================================================= */

function jsonResponse(
  body:
    Record<string, unknown>,
  status = 200
) {
  return new Response(
    JSON.stringify(body),
    {
      status,

      headers: {
        ...corsHeaders,

        'Content-Type':
          'application/json; charset=utf-8',

        'Cache-Control':
          'no-store',
      },
    }
  )
}
