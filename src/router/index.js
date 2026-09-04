import {
  createRouter,
  createWebHistory,
} from 'vue-router'

import { supabase } from '@/lib/supabase'

/* =========================================================
   LAYOUTS
========================================================= */

import PublicLayout from '@/layouts/PublicLayout.vue'
import AulaLayout from '@/layouts/AulaLayout.vue'

/* =========================================================
   VISTAS PÚBLICAS
========================================================= */

import HomeView from '@/views/HomeView.vue'
import AcademyView from '@/views/AcademyView.vue'
import TrainingView from '@/views/TrainingView.vue'
import MusicalsView from '@/views/MusicalsView.vue'
import GalleryView from '@/views/GalleryView.vue'
import ContactView from '@/views/ContactView.vue'
import InscriptionView from '@/views/InscriptionView.vue'

/* =========================================================
   VISTAS DEL AULA
========================================================= */

import InscriptionsView from '@/views/aula/InscriptionsView.vue'

/* =========================================================
   CONSTANTES
========================================================= */

const ACTIVATION_ROUTE_NAME = 'activate-account'
const AULA_ROUTE_NAME = 'aula'

/* =========================================================
   ROUTER
========================================================= */

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL,
  ),

  routes: [
    /* =====================================================
       ACTIVACIÓN DE CUENTA

       IMPORTANTE:
       Esta ruta vive FUERA de AulaLayout porque un alumno
       invitado todavía no ha terminado de activar su cuenta.
    ====================================================== */

    {
      path: '/aula/activar-cuenta',
      name: ACTIVATION_ROUTE_NAME,

      component: () =>
        import(
          '@/views/aula/ActivateAccountView.vue'
        ),

      meta: {
        activationRoute: true,
      },
    },

    /* =====================================================
       SITIO PÚBLICO
    ====================================================== */

    {
      path: '/',
      component: PublicLayout,

      children: [
        {
          path: '',
          name: 'home',
          component: HomeView,
        },

        {
          path: 'academia',
          name: 'academy',
          component: AcademyView,
        },

        {
          path: 'programa',
          alias: '/formacion',
          name: 'program',
          component: TrainingView,
        },

        {
          path: 'musicales',
          name: 'musicals',
          component: MusicalsView,
        },

        {
          path: 'galeria',
          name: 'gallery',
          component: GalleryView,
        },

        {
          path: 'contacto',
          name: 'contact',
          component: ContactView,
        },

        {
          path: 'inscripcion',
          name: 'inscription',
          component: InscriptionView,
        },
      ],
    },

    /* =====================================================
       AULA VIRTUAL
    ====================================================== */

    {
      path: '/aula',
      component: AulaLayout,

      meta: {
        aulaRoute: true,
      },

      children: [
        /* =================================================
           DASHBOARD
        ================================================== */

        {
          path: '',
          name: AULA_ROUTE_NAME,

          component: () =>
            import(
              '@/views/aula/DashboardView.vue'
            ),
        },

        /* =================================================
           PROGRAMA FORMATIVO
        ================================================== */

        {
          path: 'programa-formativo',
          name: 'aula-programa',

          component: () =>
            import(
              '@/views/aula/ProgramView.vue'
            ),
        },

        /* =================================================
           CREAR CLASE
        ================================================== */

        {
          path: 'clases/nueva',
          name: 'aula-crear-clase',

          component: () =>
            import(
              '@/views/aula/CreateLessonView.vue'
            ),
        },

        /* =================================================
           ALUMNOS
        ================================================== */

        {
          path: 'alumnos',
          name: 'aula-alumnos',

          component: () =>
            import(
              '@/views/aula/StudentsView.vue'
            ),
        },

        {
          path: 'estudiante/:studentId',
          name: 'aula-estudiante',

          component: () =>
            import(
              '@/views/aula/StudentProfileView.vue'
            ),
        },

        /* =================================================
           CLASE
        ================================================== */

        {
          path: 'clase/:id',
          name: 'aula-clase',

          component: () =>
            import(
              '@/views/aula/LessonView.vue'
            ),
        },

        {
          path: 'clase/:id/editar',
          name: 'aula-editar-clase',

          component: () =>
            import(
              '@/views/aula/EditLessonView.vue'
            ),
        },

        /* =================================================
           TRABAJO DE CLASE
        ================================================== */

        {
          path: 'clase/:id/trabajo',
          name: 'aula-trabajo',

          component: () =>
            import(
              '@/views/aula/ClassworkView.vue'
            ),
        },

        /* =================================================
           TAREAS
        ================================================== */

        {
          path: 'clase/:id/tarea/:taskId',
          name: 'aula-tarea',

          component: () =>
            import(
              '@/views/aula/AssignmentView.vue'
            ),
        },

        {
          path: 'clase/:id/crear-tarea',
          name: 'aula-crear-tarea',

          component: () =>
            import(
              '@/views/aula/CreateAssignmentView.vue'
            ),
        },

        {
          path: 'clase/:id/tarea/:taskId/editar',
          name: 'aula-editar-tarea',

          component: () =>
            import(
              '@/views/aula/EditAssignmentView.vue'
            ),
        },

        {
          path: 'clase/:id/tarea/:taskId/entregas',
          name: 'aula-entregas',

          component: () =>
            import(
              '@/views/aula/SubmissionsView.vue'
            ),
        },

        {
          path:
            'clase/:id/tarea/:taskId/entregas/:submissionId',

          name: 'aula-revisar-entrega',

          component: () =>
            import(
              '@/views/aula/ReviewSubmissionView.vue'
            ),
        },

        /* =================================================
           ASISTENCIA
        ================================================== */

        {
          path: 'asistencia',
          name: 'aula-asistencia',

          component: () =>
            import(
              '@/views/aula/AttendanceView.vue'
            ),
        },

        /* =================================================
           CALIFICACIONES
        ================================================== */

        {
          path: 'calificaciones',
          name: 'aula-calificaciones',

          component: () =>
            import(
              '@/views/aula/GradebookView.vue'
            ),
        },

        /* =================================================
           MIS TAREAS
        ================================================== */

        {
          path: 'mis-tareas',
          name: 'aula-mis-tareas',

          component: () =>
            import(
              '@/views/aula/MyTasksView.vue'
            ),
        },

        /* =================================================
           RECURSOS
        ================================================== */

        {
          path: 'recursos',
          name: 'aula-recursos',

          component: () =>
            import(
              '@/views/aula/ResourcesView.vue'
            ),
        },

        {
          path: 'recursos/publicar',
          name: 'aula-publicar-recurso',

          component: () =>
            import(
              '@/views/aula/CreateResourceView.vue'
            ),
        },

        /* =================================================
           INSCRIPCIONES
        ================================================== */

        {
          path: 'inscripciones',
          name: 'aula-inscriptions',
          component: InscriptionsView,
        },

        /* =================================================
           CUENTA
        ================================================== */

        {
          path: 'cuenta',
          name: 'aula-account',

          component: () =>
            import(
              '@/views/aula/AccountView.vue'
            ),
        },

        /* =================================================
           EVALUACIONES
        ================================================== */

        {
          path: 'clase/:id/evaluacion/nueva',
          name: 'aula-crear-evaluacion',

          component: () =>
            import(
              '@/views/aula/CreateQuizView.vue'
            ),
        },

        {
          path: 'clase/:id/evaluacion/:quizId',
          name: 'aula-evaluacion',

          component: () =>
            import(
              '@/views/aula/QuizView.vue'
            ),
        },

        {
          path: 'evaluaciones',
          name: 'aula-mis-evaluaciones',

          component: () =>
            import(
              '@/views/aula/MyEvaluationsView.vue'
            ),
        },

        {
          path: 'evaluaciones/intento/:attemptId',
          name: 'aula-evaluacion-revision',

          component: () =>
            import(
              '@/views/aula/ReviewEvaluationView.vue'
            ),
        },
      ],
    },

    /* =====================================================
       404
    ====================================================== */

    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],

  /* =======================================================
     SCROLL
  ======================================================== */

  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth',
    }
  },
})

/* =========================================================
   GUARD DE ACTIVACIÓN DE CUENTA

   REGLAS:

   TEACHER
   → utiliza el Aula normalmente.

   STUDENT + INVITED
   → solamente puede acceder a /aula/activar-cuenta.

   STUDENT + ACTIVE
   → utiliza el Aula normalmente.

   STUDENT + INACTIVE
   → no puede acceder al Aula.

   SIN SESIÓN
   → dejamos que AulaLayout maneje el login habitual.
========================================================= */

router.beforeEach(async to => {
  const isActivationRoute =
    to.name === ACTIVATION_ROUTE_NAME

  const isAulaRoute =
    to.matched.some(
      record =>
        record.meta?.aulaRoute === true,
    )

  /* =======================================================
     RUTA PÚBLICA

     Si no estamos entrando al Aula ni a la activación,
     no necesitamos consultar Supabase.
  ======================================================== */

  if (
    !isActivationRoute &&
    !isAulaRoute
  ) {
    return true
  }

  try {
    /* =====================================================
       OBTENER SESIÓN
    ====================================================== */

    const {
      data: sessionData,
      error: sessionError,
    } =
      await supabase.auth
        .getSession()

    if (sessionError) {
      console.error(
        'Router: no fue posible consultar la sesión:',
        sessionError,
      )

      /*
       * No dejamos la aplicación bloqueada.
       *
       * AulaLayout mantiene su propio sistema de login
       * y Supabase RLS sigue protegiendo los datos.
       */
      return true
    }

    const session =
      sessionData?.session ||
      null

    /* =====================================================
       NO HAY SESIÓN
    ====================================================== */

    if (!session?.user?.id) {
      /*
       * /aula:
       * AulaLayout mostrará el login normalmente.
       *
       * /aula/activar-cuenta:
       * ActivateAccountView comprobará si el enlace
       * de invitación puede establecer una sesión.
       */

      return true
    }

    /* =====================================================
       BUSCAR PERFIL
    ====================================================== */

    const {
      data: profile,
      error: profileError,
    } =
      await supabase
        .from('profiles')
        .select(`
          id,
          role,
          account_status
        `)
        .eq(
          'id',
          session.user.id,
        )
        .maybeSingle()

    if (profileError) {
      console.error(
        'Router: no fue posible consultar el perfil:',
        profileError,
      )

      return true
    }

    if (!profile) {
      console.warn(
        'Router: la sesión actual no tiene un perfil asociado.',
      )

      return true
    }

    /* =====================================================
       NORMALIZAR ROL Y ESTADO
    ====================================================== */

    const role =
      String(
        profile.role ||
        '',
      )
        .trim()
        .toLowerCase()

    const accountStatus =
      String(
        profile.account_status ||
        'active',
      )
        .trim()
        .toLowerCase()

    /* =====================================================
       PROFESOR
    ====================================================== */

    if (role === 'teacher') {
      /*
       * Un profesor no necesita visitar
       * /aula/activar-cuenta.
       */

      if (isActivationRoute) {
        return {
          name: AULA_ROUTE_NAME,
          replace: true,
        }
      }

      return true
    }

    /* =====================================================
       OTROS ROLES

       Por ahora el sistema trabaja con:
       teacher / student.
    ====================================================== */

    if (role !== 'student') {
      return true
    }

    /* =====================================================
       ESTUDIANTE INVITADO
    ====================================================== */

    if (
      accountStatus ===
      'invited'
    ) {
      /*
       * Si intenta escribir:
       *
       * /aula
       * /aula/programa-formativo
       * /aula/clase/1
       * etc.
       *
       * siempre vuelve a activación.
       */

      if (!isActivationRoute) {
        return {
          name:
            ACTIVATION_ROUTE_NAME,

          replace:
            true,
        }
      }

      return true
    }

    /* =====================================================
       ESTUDIANTE ACTIVO
    ====================================================== */

    if (
      accountStatus ===
      'active'
    ) {
      /*
       * Si ya activó su cuenta y vuelve accidentalmente
       * a /aula/activar-cuenta, lo enviamos al dashboard.
       */

      if (isActivationRoute) {
        return {
          name:
            AULA_ROUTE_NAME,

          replace:
            true,
        }
      }

      return true
    }

    /* =====================================================
       ESTUDIANTE INACTIVO
    ====================================================== */

    if (
      accountStatus ===
      'inactive'
    ) {
      /*
       * Cerramos su sesión.
       *
       * No queremos que una cuenta deshabilitada conserve
       * una sesión abierta dentro del Aula.
       */

      await supabase.auth
        .signOut()

      return {
        name: 'home',
        replace: true,
      }
    }

    /* =====================================================
       ESTADO DESCONOCIDO

       Si apareciera accidentalmente otro valor,
       preferimos no permitir el acceso al Aula.
    ====================================================== */

    if (isAulaRoute) {
      return {
        name:
          ACTIVATION_ROUTE_NAME,

        replace:
          true,
      }
    }

    return true
  } catch (error) {
    console.error(
      'Router: error inesperado en el guard de activación:',
      error,
    )

    /*
     * No dejamos la SPA completamente inutilizable
     * por un fallo inesperado del guard.
     *
     * Supabase RLS continúa siendo la barrera de
     * seguridad del backend.
     */

    return true
  }
})

export default router
