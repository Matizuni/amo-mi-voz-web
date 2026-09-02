import "@supabase/functions-js/edge-runtime.d.ts";
import { withSupabase } from "@supabase/server";

console.log("create-student-account ready");

const allowedVoices = [
  "Soprano",
  "Alto",
  "Tenor",
  "Bajo",
];

export default {
  fetch: withSupabase(
    { auth: "user" },

    async (req, ctx) => {
      /* =====================================================
         1. PERMITIR SOLO POST
      ====================================================== */

      if (req.method !== "POST") {
        return Response.json(
          {
            error: "Método no permitido.",
          },
          {
            status: 405,
          },
        );
      }

      /* =====================================================
         2. IDENTIFICAR USUARIO AUTENTICADO
      ====================================================== */

      const teacherUserId =
        ctx.userClaims?.id;

      if (!teacherUserId) {
        console.error(
          "No se encontró userClaims.id",
          ctx.userClaims,
        );

        return Response.json(
          {
            error:
              "No se pudo identificar al usuario autenticado.",
          },
          {
            status: 401,
          },
        );
      }

      console.log(
        "Usuario autenticado:",
        teacherUserId,
      );

      /* =====================================================
         3. VERIFICAR QUE SEA PROFESOR
      ====================================================== */

      const {
        data: teacherProfile,
        error: teacherProfileError,
      } = await ctx.supabaseAdmin
        .from("profiles")
        .select(
          "id, role, student_id, display_name",
        )
        .eq(
          "id",
          teacherUserId,
        )
        .maybeSingle();

      if (teacherProfileError) {
        console.error(
          "Error leyendo perfil del profesor:",
          teacherProfileError,
        );

        return Response.json(
          {
            error:
              "No se pudo verificar el perfil del profesor.",
          },
          {
            status: 500,
          },
        );
      }

      console.log(
        "Perfil encontrado:",
        teacherProfile,
      );

      if (!teacherProfile) {
        return Response.json(
          {
            error:
              "El usuario autenticado no tiene un perfil registrado.",
          },
          {
            status: 403,
          },
        );
      }

      if (
        teacherProfile.role !==
        "teacher"
      ) {
        console.error(
          "Usuario sin rol teacher:",
          teacherProfile,
        );

        return Response.json(
          {
            error:
              "No tienes permisos para crear cuentas de alumnos.",
          },
          {
            status: 403,
          },
        );
      }

      /* =====================================================
         4. LEER DATOS DEL FORMULARIO
      ====================================================== */

      let body;

      try {
        body =
          await req.json();
      } catch {
        return Response.json(
          {
            error:
              "Los datos enviados no son válidos.",
          },
          {
            status: 400,
          },
        );
      }

      const name =
        String(
          body?.name ?? "",
        ).trim();

      const email =
        String(
          body?.email ?? "",
        )
          .trim()
          .toLowerCase();

      const voice =
        String(
          body?.voice ?? "",
        ).trim();

      const password =
        String(
          body?.password ?? "",
        );

      /* =====================================================
         5. VALIDACIONES
      ====================================================== */

      if (!name) {
        return Response.json(
          {
            error:
              "Debes ingresar el nombre del alumno.",
          },
          {
            status: 400,
          },
        );
      }

      if (!email) {
        return Response.json(
          {
            error:
              "Debes ingresar el correo del alumno.",
          },
          {
            status: 400,
          },
        );
      }

      const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailPattern.test(email)
      ) {
        return Response.json(
          {
            error:
              "El correo ingresado no es válido.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        !allowedVoices.includes(
          voice,
        )
      ) {
        return Response.json(
          {
            error:
              "La clasificación vocal no es válida.",
          },
          {
            status: 400,
          },
        );
      }

      if (
        password.length < 8
      ) {
        return Response.json(
          {
            error:
              "La contraseña debe tener al menos 8 caracteres.",
          },
          {
            status: 400,
          },
        );
      }

      /* =====================================================
         6. COMPROBAR SI EL CORREO YA EXISTE
      ====================================================== */

      const {
        data: usersData,
        error: usersError,
      } =
        await ctx.supabaseAdmin
          .auth
          .admin
          .listUsers();

      if (usersError) {
        console.error(
          "Error consultando usuarios Auth:",
          usersError,
        );

        return Response.json(
          {
            error:
              "No se pudo comprobar si el correo ya está registrado.",
          },
          {
            status: 500,
          },
        );
      }

      const existingUser =
        usersData.users.find(
          user =>
            user.email
              ?.toLowerCase() ===
            email,
        );

      if (existingUser) {
        return Response.json(
          {
            error:
              "Ya existe una cuenta con ese correo electrónico.",
          },
          {
            status: 409,
          },
        );
      }

      /* =====================================================
         VARIABLES PARA ROLLBACK
      ====================================================== */

      let studentId:
        | number
        | null = null;

      let authUserId:
        | string
        | null = null;

      try {
        /* ===================================================
           7. CREAR FICHA DEL ALUMNO
        ==================================================== */

        const {
          data: createdStudent,
          error: studentError,
        } =
          await ctx.supabaseAdmin
            .from("students")
            .insert({
              name,
              voice,
              active: true,
            })
            .select(
              "id, name, voice, active",
            )
            .single();

        if (studentError) {
          console.error(
            "Error creando students:",
            studentError,
          );

          throw new Error(
            studentError.message,
          );
        }

        studentId =
          createdStudent.id;

        console.log(
          "Ficha de alumno creada:",
          studentId,
        );

        /* ===================================================
           8. CREAR USUARIO EN SUPABASE AUTH
        ==================================================== */

        const {
          data: createdAuth,
          error: authCreateError,
        } =
          await ctx.supabaseAdmin
            .auth
            .admin
            .createUser({
              email,
              password,

              email_confirm:
                true,

              user_metadata: {
                display_name:
                  name,
              },
            });

        if (
          authCreateError ||
          !createdAuth?.user
        ) {
          console.error(
            "Error creando Auth user:",
            authCreateError,
          );

          throw new Error(
            authCreateError?.message ||
              "No se pudo crear el usuario de acceso.",
          );
        }

        authUserId =
          createdAuth.user.id;

        console.log(
          "Usuario Auth creado:",
          authUserId,
        );

        /* ===================================================
           9. VINCULAR PROFILE CON STUDENT
        ==================================================== */

        const {
          data: linkedProfile,
          error: profileUpdateError,
        } =
          await ctx.supabaseAdmin
            .from("profiles")
            .update({
              role:
                "student",

              student_id:
                studentId,

              display_name:
                name,

              updated_at:
                new Date()
                  .toISOString(),
            })
            .eq(
              "id",
              authUserId,
            )
            .select(
              "id, role, student_id, display_name",
            )
            .maybeSingle();

        if (profileUpdateError) {
          console.error(
            "Error vinculando profile:",
            profileUpdateError,
          );

          throw new Error(
            profileUpdateError.message,
          );
        }

        if (!linkedProfile) {
          console.error(
            "No se encontró profile después de crear Auth user.",
          );

          throw new Error(
            "La cuenta se creó, pero no se pudo vincular con la ficha del alumno.",
          );
        }

        console.log(
          "Profile vinculado:",
          linkedProfile,
        );

        /* ===================================================
           10. RESPUESTA EXITOSA
        ==================================================== */

        return Response.json(
          {
            success: true,

            student: {
              id:
                createdStudent.id,

              name:
                createdStudent.name,

              voice:
                createdStudent.voice,

              email,
            },
          },
          {
            status: 200,
          },
        );
      } catch (error) {
        console.error(
          "Error general creando alumno:",
          error,
        );

        /* ===================================================
           11. ROLLBACK
        ==================================================== */

        if (authUserId) {
          const {
            error: deleteAuthError,
          } =
            await ctx.supabaseAdmin
              .auth
              .admin
              .deleteUser(
                authUserId,
              );

          if (deleteAuthError) {
            console.error(
              "Error rollback Auth:",
              deleteAuthError,
            );
          }
        }

        if (studentId) {
          const {
            error: deleteStudentError,
          } =
            await ctx.supabaseAdmin
              .from("students")
              .delete()
              .eq(
                "id",
                studentId,
              );

          if (deleteStudentError) {
            console.error(
              "Error rollback student:",
              deleteStudentError,
            );
          }
        }

        return Response.json(
          {
            error:
              error instanceof Error
                ? error.message
                : "No se pudo crear el alumno.",
          },
          {
            status: 500,
          },
        );
      }
    },
  ),
};
