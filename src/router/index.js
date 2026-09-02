import {
  createRouter,
  createWebHistory
} from 'vue-router'


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
import InscriptionsView from '@/views/aula/InscriptionsView.vue'

/* =========================================================
   ROUTER
========================================================= */

const router = createRouter({
  history: createWebHistory(
    import.meta.env.BASE_URL
  ),

  routes: [
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
          component: HomeView
        },

        {
          path: 'academia',
          name: 'academy',
          component: AcademyView
        },

        {
          path: 'programa',
          alias: '/formacion',
          name: 'program',
          component: TrainingView
        },

        {
          path: 'musicales',
          name: 'musicals',
          component: MusicalsView
        },

        {
          path: 'galeria',
          name: 'gallery',
          component: GalleryView
        },

        {
          path: 'contacto',
          name: 'contact',
          component: ContactView
        },

        /* =================================================
           INSCRIPCIÓN
        ================================================== */

        {
          path: 'inscripcion',
          name: 'inscription',
          component: InscriptionView
        }
      ]
    },

    /* =====================================================
       AULA VIRTUAL
    ====================================================== */

    {
      path: '/aula',
      component: AulaLayout,

      children: [
        /* DASHBOARD */

        {
          path: '',
          name: 'aula',

          component: () =>
            import(
              '@/views/aula/DashboardView.vue'
            )
        },

        /* =================================================
           PROGRAMA
        ================================================== */

        {
          path: 'programa-formativo',
          name: 'aula-programa',

          component: () =>
            import(
              '@/views/aula/ProgramView.vue'
            )
        },

        /* CREAR CLASE */

        {
          path: 'clases/nueva',
          name: 'aula-crear-clase',

          component: () =>
            import(
              '@/views/aula/CreateLessonView.vue'
            )
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
            )
        },

        {
          path: 'estudiante/:studentId',
          name: 'aula-estudiante',

          component: () =>
            import(
              '@/views/aula/StudentProfileView.vue'
            )
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
            )
        },

        {
          path: 'clase/:id/editar',
          name: 'aula-editar-clase',

          component: () =>
            import(
              '@/views/aula/EditLessonView.vue'
            )
        },

        /* TRABAJO */

        {
          path: 'clase/:id/trabajo',
          name: 'aula-trabajo',

          component: () =>
            import(
              '@/views/aula/ClassworkView.vue'
            )
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
            )
        },

        {
          path: 'clase/:id/crear-tarea',
          name: 'aula-crear-tarea',

          component: () =>
            import(
              '@/views/aula/CreateAssignmentView.vue'
            )
        },

        {
          path: 'clase/:id/tarea/:taskId/editar',
          name: 'aula-editar-tarea',

          component: () =>
            import(
              '@/views/aula/EditAssignmentView.vue'
            )
        },

        {
          path: 'clase/:id/tarea/:taskId/entregas',
          name: 'aula-entregas',

          component: () =>
            import(
              '@/views/aula/SubmissionsView.vue'
            )
        },

        {
          path: 'clase/:id/tarea/:taskId/entregas/:submissionId',
          name: 'aula-revisar-entrega',

          component: () =>
            import(
              '@/views/aula/ReviewSubmissionView.vue'
            )
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
            )
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
            )
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
            )
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
            )
        },

        {
          path: 'recursos/publicar',
          name: 'aula-publicar-recurso',

          component: () =>
            import(
              '@/views/aula/CreateResourceView.vue'
            )
        },
        {
          path: 'inscripciones',
          name: 'aula-inscriptions',
          component: InscriptionsView
        }
      ]
    }
  ],

  scrollBehavior() {
    return {
      top: 0,
      behavior: 'smooth'
    }
  }
})

export default router
