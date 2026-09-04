<template>
  <section class="students">
    <!-- =====================================================
         CABECERA
    ====================================================== -->

    <header class="students__header">
      <div class="students__header-copy">
        <p class="students__eyebrow">
          Profesor · Aula Virtual
        </p>

        <h1>Alumnos</h1>

        <p class="students__description">
          Administra los estudiantes matriculados, revisa su
          clasificación vocal y controla sus cuentas de acceso
          al Aula Virtual.
        </p>
      </div>

      <button
        type="button"
        class="students__primary-action"
        @click="goToInscriptions"
      >
        <span aria-hidden="true">+</span>

        Nueva matrícula
      </button>
    </header>

    <!-- =====================================================
         BARRA INFORMATIVA
    ====================================================== -->

    <section class="students__info">
      <div class="students__info-icon">
        ♪
      </div>

      <div>
        <strong>
          Matrículas centralizadas
        </strong>

        <p>
          Las cuentas nuevas se crean desde Inscripciones.
          El alumno recibe una invitación por correo y crea
          personalmente su contraseña.
        </p>
      </div>

      <button
        type="button"
        @click="goToInscriptions"
      >
        Ver inscripciones
        <span aria-hidden="true">→</span>
      </button>
    </section>

    <!-- =====================================================
         CARGANDO
    ====================================================== -->

    <section
      v-if="isLoading"
      class="students-state"
    >
      <div class="students-state__spinner"></div>

      <div>
        <strong>
          Cargando estudiantes...
        </strong>

        <p>
          Sincronizando la información con Supabase.
        </p>
      </div>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->

    <section
      v-else-if="loadError"
      class="
        students-state
        students-state--error
      "
    >
      <div class="students-state__symbol">
        !
      </div>

      <div>
        <strong>
          No pudimos cargar los alumnos
        </strong>

        <p>
          {{ loadError }}
        </p>

        <button
          type="button"
          class="students-state__button"
          @click="loadStudents"
        >
          Reintentar
        </button>
      </div>
    </section>

    <!-- =====================================================
         CONTENIDO
    ====================================================== -->

    <template v-else>
      <!-- ===================================================
           RESUMEN
      ==================================================== -->

      <section class="students__summary">
        <article class="summary-card summary-card--main">
          <span>
            Estudiantes activos
          </span>

          <strong>
            {{ students.length }}
          </strong>

          <small>
            Matrículas vigentes
          </small>
        </article>

        <article class="summary-card">
          <span>
            Sopranos
          </span>

          <strong>
            {{ sopranoStudents.length }}
          </strong>

          <small>
            Voz aguda
          </small>
        </article>

        <article class="summary-card">
          <span>
            Altos
          </span>

          <strong>
            {{ altoStudents.length }}
          </strong>

          <small>
            Registro medio-grave
          </small>
        </article>

        <article class="summary-card">
          <span>
            Tenores
          </span>

          <strong>
            {{ tenorStudents.length }}
          </strong>

          <small>
            Voz aguda masculina
          </small>
        </article>

        <article class="summary-card">
          <span>
            Bajos
          </span>

          <strong>
            {{ bassStudents.length }}
          </strong>

          <small>
            Registro grave
          </small>
        </article>
      </section>

      <!-- ===================================================
           SIN ESTUDIANTES
      ==================================================== -->

      <section
        v-if="students.length === 0"
        class="students-empty"
      >
        <div class="students-empty__symbol">
          ♫
        </div>

        <p class="students-empty__eyebrow">
          Aula preparada
        </p>

        <h2>
          Todavía no hay alumnos activos
        </h2>

        <p>
          Cuando matricules a un estudiante desde el módulo
          de inscripciones, aparecerá automáticamente en
          esta sección.
        </p>

        <button
          type="button"
          class="students__primary-action"
          @click="goToInscriptions"
        >
          Ir a inscripciones
        </button>
      </section>

      <!-- ===================================================
           GRUPOS VOCALES
      ==================================================== -->

      <template v-else>
        <section
          v-for="group in voiceGroups"
          :key="group.voice"
          class="voice-section"
        >
          <header class="voice-section__header">
            <div class="voice-section__identity">
              <div class="voice-section__code">
                {{ group.code }}
              </div>

              <div>
                <p>
                  Clasificación vocal
                </p>

                <h2>
                  {{ group.voice }}
                </h2>
              </div>
            </div>

            <span class="voice-section__count">
              {{ group.students.length }}

              {{
                group.students.length === 1
                  ? 'estudiante'
                  : 'estudiantes'
              }}
            </span>
          </header>

          <div
            v-if="group.students.length"
            class="student-grid"
          >
            <article
              v-for="student in group.students"
              :key="student.id"
              class="student-card"
            >
              <!-- ===========================================
                   IDENTIDAD
              ============================================ -->

              <div class="student-card__identity">
                <div class="student-card__avatar">
                  {{ getInitials(student.name) }}
                </div>

                <div class="student-card__content">
                  <span class="student-card__voice">
                    {{ student.voice }}
                  </span>

                  <h3>
                    {{ student.name }}
                  </h3>

                  <div class="student-card__status">
                    <span></span>
                    Alumno activo
                  </div>
                </div>
              </div>

              <!-- ===========================================
                   INFORMACIÓN
              ============================================ -->

              <div class="student-card__meta">
                <div>
                  <span>
                    ID académico
                  </span>

                  <strong>
                    #{{ student.id }}
                  </strong>
                </div>

                <div>
                  <span>
                    Estado
                  </span>

                  <strong class="status-active">
                    Activo
                  </strong>
                </div>
              </div>

              <!-- ===========================================
                   ACCIONES
              ============================================ -->

              <div class="student-card__actions">
                <RouterLink
                  :to="`/aula/estudiante/${student.id}`"
                  class="
                    student-card__action
                    student-card__action--profile
                  "
                >
                  <span aria-hidden="true">
                    ↗
                  </span>

                  Ver perfil
                </RouterLink>

                <button
                  type="button"
                  class="
                    student-card__action
                    student-card__action--deactivate
                  "
                  :disabled="
                    isStudentBusy(student.id)
                  "
                  @click="
                    askDeactivateStudent(
                      student
                    )
                  "
                >
                  {{
                    deactivatingStudentId ===
                      student.id
                      ? 'Desactivando...'
                      : 'Desactivar'
                  }}
                </button>

                <button
                  type="button"
                  class="
                    student-card__action
                    student-card__action--delete
                  "
                  :disabled="
                    isStudentBusy(student.id)
                  "
                  @click="
                    askDeleteStudent(
                      student
                    )
                  "
                >
                  {{
                    deletingStudentId ===
                      student.id
                      ? 'Eliminando...'
                      : 'Eliminar'
                  }}
                </button>
              </div>
            </article>
          </div>

          <div
            v-else
            class="voice-section__empty"
          >
            <span aria-hidden="true">
              —
            </span>

            No hay estudiantes activos registrados
            en esta clasificación vocal.
          </div>
        </section>
      </template>
    </template>

    <!-- =====================================================
         MODAL DESACTIVAR
    ====================================================== -->

    <Transition name="modal">
      <div
        v-if="studentToDeactivate"
        class="students-modal"
        @click.self="
          cancelDeactivateStudent
        "
      >
        <section
          class="students-modal__card"
          role="dialog"
          aria-modal="true"
          aria-labelledby="deactivate-title"
        >
          <button
            type="button"
            class="students-modal__close"
            :disabled="isDeactivating"
            aria-label="Cerrar"
            @click="
              cancelDeactivateStudent
            "
          >
            ×
          </button>

          <div
            class="
              students-modal__icon
              students-modal__icon--warning
            "
          >
            ‖
          </div>

          <p class="students-modal__eyebrow">
            Gestión de acceso
          </p>

          <h2 id="deactivate-title">
            ¿Desactivar alumno?
          </h2>

          <p class="students-modal__lead">
            <strong>
              {{ studentToDeactivate.name }}
            </strong>

            dejará de aparecer entre los alumnos activos
            y no podrá ingresar normalmente al Aula Virtual.
          </p>

          <div class="students-modal__notice">
            <strong>
              Sus datos no serán eliminados
            </strong>

            <p>
              La asistencia, evaluaciones, tareas, progreso
              y ficha vocal permanecerán almacenados.
            </p>
          </div>

          <div class="students-modal__actions">
            <button
              type="button"
              class="modal-button modal-button--secondary"
              :disabled="isDeactivating"
              @click="
                cancelDeactivateStudent
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              class="modal-button modal-button--warning"
              :disabled="isDeactivating"
              @click="
                confirmDeactivateStudent
              "
            >
              {{
                isDeactivating
                  ? 'Desactivando...'
                  : 'Sí, desactivar'
              }}
            </button>
          </div>
        </section>
      </div>
    </Transition>

    <!-- =====================================================
         MODAL ELIMINAR
    ====================================================== -->

    <Transition name="modal">
      <div
        v-if="studentToDelete"
        class="students-modal"
        @click.self="
          cancelDeleteStudent
        "
      >
        <section
          class="
            students-modal__card
            students-modal__card--danger
          "
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <button
            type="button"
            class="students-modal__close"
            :disabled="isDeleting"
            aria-label="Cerrar"
            @click="
              cancelDeleteStudent
            "
          >
            ×
          </button>

          <div
            class="
              students-modal__icon
              students-modal__icon--danger
            "
          >
            !
          </div>

          <p
            class="
              students-modal__eyebrow
              students-modal__eyebrow--danger
            "
          >
            Acción irreversible
          </p>

          <h2 id="delete-title">
            Eliminar definitivamente
          </h2>

          <p class="students-modal__lead">
            Estás a punto de eliminar a

            <strong>
              {{ studentToDelete.name }}
            </strong>

            de la plataforma.
          </p>

          <div
            class="
              students-modal__notice
              students-modal__notice--danger
            "
          >
            <strong>
              Se eliminarán sus datos académicos
            </strong>

            <p>
              Cuenta de acceso, perfil, progreso,
              asistencia, entregas, evaluaciones
              y ficha vocal.
            </p>
          </div>

          <div class="students-modal__reset-info">
            <span aria-hidden="true">
              ↶
            </span>

            <p>
              Si encontramos su inscripción original,
              dejará de aparecer como matriculado y
              volverá al estado
              <strong>Aprobada</strong>.
            </p>
          </div>

          <label class="students-modal__confirmation">
            <span>
              Para confirmar, escribe
              <strong>ELIMINAR</strong>
            </span>

            <input
              v-model.trim="
                deleteConfirmation
              "
              type="text"
              autocomplete="off"
              placeholder="ELIMINAR"
              :disabled="isDeleting"
            />
          </label>

          <div class="students-modal__actions">
            <button
              type="button"
              class="modal-button modal-button--secondary"
              :disabled="isDeleting"
              @click="
                cancelDeleteStudent
              "
            >
              Cancelar
            </button>

            <button
              type="button"
              class="modal-button modal-button--danger"
              :disabled="
                !canConfirmDelete ||
                isDeleting
              "
              @click="
                confirmDeleteStudent
              "
            >
              {{
                isDeleting
                  ? 'Eliminando...'
                  : 'Eliminar definitivamente'
              }}
            </button>
          </div>
        </section>
      </div>
    </Transition>

    <!-- =====================================================
         TOAST
    ====================================================== -->

    <Transition name="toast">
      <div
        v-if="successMessage"
        class="students-toast"
        role="status"
        aria-live="polite"
      >
        <div class="students-toast__icon">
          ✓
        </div>

        <div>
          <strong>
            Operación completada
          </strong>

          <p>
            {{ successMessage }}
          </p>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import {
  RouterLink,
  useRouter,
} from 'vue-router'

import {
  deactivateStudent,
  deleteStudentPermanently,
  fetchStudents,
} from '@/services/studentService'

/* =========================================================
   ROUTER
========================================================= */

const router =
  useRouter()

/* =========================================================
   ESTADO GENERAL
========================================================= */

const students =
  ref([])

const isLoading =
  ref(true)

const loadError =
  ref('')

const successMessage =
  ref('')

let successTimer =
  null

/* =========================================================
   DESACTIVAR
========================================================= */

const studentToDeactivate =
  ref(null)

const isDeactivating =
  ref(false)

const deactivatingStudentId =
  ref(null)

/* =========================================================
   ELIMINAR
========================================================= */

const studentToDelete =
  ref(null)

const isDeleting =
  ref(false)

const deletingStudentId =
  ref(null)

const deleteConfirmation =
  ref('')

/* =========================================================
   CARGAR ESTUDIANTES
========================================================= */

const loadStudents =
  async () => {
    isLoading.value =
      true

    loadError.value =
      ''

    try {
      students.value =
        await fetchStudents()
    } catch (error) {
      console.error(
        'Error cargando estudiantes:',
        error,
      )

      students.value =
        []

      loadError.value =
        error?.message ||
        'No fue posible cargar los estudiantes desde Supabase.'
    } finally {
      isLoading.value =
        false
    }
  }

/* =========================================================
   INSCRIPCIONES
========================================================= */

const goToInscriptions =
  () => {
    router.push({
      name:
        'aula-inscriptions',
    })
  }

/* =========================================================
   DESACTIVAR
========================================================= */

const askDeactivateStudent =
  student => {
    if (
      isStudentBusy(
        student.id,
      )
    ) {
      return
    }

    studentToDeactivate.value =
      student
  }

const cancelDeactivateStudent =
  () => {
    if (
      isDeactivating.value
    ) {
      return
    }

    studentToDeactivate.value =
      null
  }

const confirmDeactivateStudent =
  async () => {
    if (
      !studentToDeactivate.value ||
      isDeactivating.value
    ) {
      return
    }

    const student =
      studentToDeactivate.value

    isDeactivating.value =
      true

    deactivatingStudentId.value =
      student.id

    try {
      await deactivateStudent(
        student.id,
      )

      studentToDeactivate.value =
        null

      await loadStudents()

      showSuccess(
        `${student.name} fue desactivado correctamente.`,
      )
    } catch (error) {
      console.error(
        'Error desactivando estudiante:',
        error,
      )

      window.alert(
        error?.message ||
        'No fue posible desactivar al estudiante.',
      )
    } finally {
      isDeactivating.value =
        false

      deactivatingStudentId.value =
        null
    }
  }

/* =========================================================
   ELIMINAR
========================================================= */

const askDeleteStudent =
  student => {
    if (
      isStudentBusy(
        student.id,
      )
    ) {
      return
    }

    deleteConfirmation.value =
      ''

    studentToDelete.value =
      student
  }

const cancelDeleteStudent =
  () => {
    if (
      isDeleting.value
    ) {
      return
    }

    studentToDelete.value =
      null

    deleteConfirmation.value =
      ''
  }

const canConfirmDelete =
  computed(
    () =>
      deleteConfirmation.value
        .trim()
        .toUpperCase() ===
      'ELIMINAR',
  )

const confirmDeleteStudent =
  async () => {
    if (
      !studentToDelete.value ||
      isDeleting.value ||
      !canConfirmDelete.value
    ) {
      return
    }

    const student =
      studentToDelete.value

    isDeleting.value =
      true

    deletingStudentId.value =
      student.id

    try {
      const result =
        await deleteStudentPermanently(
          student.id,
        )

      studentToDelete.value =
        null

      deleteConfirmation.value =
        ''

      await loadStudents()

      showSuccess(
        result?.message ||
        `${student.name} fue eliminado definitivamente.`,
      )
    } catch (error) {
      console.error(
        'Error eliminando estudiante:',
        error,
      )

      window.alert(
        error?.message ||
        'No fue posible eliminar al estudiante.',
      )
    } finally {
      isDeleting.value =
        false

      deletingStudentId.value =
        null
    }
  }

/* =========================================================
   ESTADOS DE OPERACIÓN
========================================================= */

const isStudentBusy =
  studentId =>
    deactivatingStudentId.value ===
      studentId ||
    deletingStudentId.value ===
      studentId

/* =========================================================
   MENSAJES
========================================================= */

const showSuccess =
  message => {
    successMessage.value =
      message

    if (successTimer) {
      window.clearTimeout(
        successTimer,
      )
    }

    successTimer =
      window.setTimeout(
        () => {
          successMessage.value =
            ''
        },

        4500,
      )
  }

/* =========================================================
   GRUPOS VOCALES
========================================================= */

const sopranoStudents =
  computed(
    () =>
      students.value.filter(
        student =>
          student.voice ===
          'Soprano',
      ),
  )

const altoStudents =
  computed(
    () =>
      students.value.filter(
        student =>
          student.voice ===
          'Alto',
      ),
  )

const tenorStudents =
  computed(
    () =>
      students.value.filter(
        student =>
          student.voice ===
          'Tenor',
      ),
  )

const bassStudents =
  computed(
    () =>
      students.value.filter(
        student =>
          student.voice ===
          'Bajo',
      ),
  )

const voiceGroups =
  computed(
    () => [
      {
        code:
          'S',

        voice:
          'Sopranos',

        students:
          sopranoStudents.value,
      },

      {
        code:
          'A',

        voice:
          'Altos',

        students:
          altoStudents.value,
      },

      {
        code:
          'T',

        voice:
          'Tenores',

        students:
          tenorStudents.value,
      },

      {
        code:
          'B',

        voice:
          'Bajos',

        students:
          bassStudents.value,
      },
    ],
  )

/* =========================================================
   INICIALES
========================================================= */

const getInitials =
  name => {
    if (!name) {
      return '?'
    }

    return String(
      name,
    )
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map(
        word =>
          word.charAt(0),
      )
      .join('')
      .slice(
        0,
        2,
      )
      .toUpperCase()
  }

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(
  loadStudents,
)

onBeforeUnmount(
  () => {
    if (successTimer) {
      window.clearTimeout(
        successTimer,
      )
    }
  },
)
</script>

<style
  lang="scss"
  scoped
>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   CONTENEDOR
========================================================= */

.students {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
}

/* =========================================================
   CABECERA
========================================================= */

.students__header {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-xl;
}

.students__header-copy {
  max-width: 760px;
}

.students__eyebrow {
  margin: 0 0 variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.students__header h1 {
  margin: 0 0 variables.$spacing-lg;
  font-size: clamp(3rem, 7vw, 5rem);
  line-height: 0.95;
}

.students__description {
  max-width: 720px;
  margin: 0;
  line-height: 1.7;
  opacity: 0.7;
}

.students__primary-action {
  display: inline-flex;
  gap: variables.$spacing-sm;
  align-items: center;
  justify-content: center;
  min-height: 50px;
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-primary;
  color: variables.$color-white;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
  white-space: nowrap;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.students__primary-action:hover {
  transform: translateY(-2px);
  box-shadow:
    0 16px 40px
    rgba(255, 190, 0, 0.12);
}

.students__primary-action > span {
  font-size: 1.2rem;
}

/* =========================================================
   BARRA INFO
========================================================= */

.students__info {
  display: grid;
  gap: variables.$spacing-lg;
  align-items: center;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  margin-bottom: variables.$spacing-3xl;
  padding: variables.$spacing-lg;
  border:
    1px solid
    rgba(255, 190, 0, 0.24);
  border-radius: variables.$radius-lg;
  background:
    linear-gradient(
      135deg,
      rgba(255, 190, 0, 0.08),
      rgba(255, 190, 0, 0.015)
    );
}

.students__info-icon {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: variables.$color-white;
  font-size: 1.3rem;
  font-weight: bold;
}

.students__info strong {
  display: block;
  margin-bottom: 4px;
}

.students__info p {
  margin: 0;
  line-height: 1.55;
  opacity: 0.65;
}

.students__info button {
  display: inline-flex;
  gap: variables.$spacing-sm;
  align-items: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: variables.$color-primary;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

/* =========================================================
   RESUMEN
========================================================= */

.students__summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );
  margin-bottom: variables.$spacing-3xl;
}

.summary-card {
  min-height: 150px;
  padding: variables.$spacing-xl;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    variables.$color-surface;
}

.summary-card--main {
  border-color:
    rgba(255, 190, 0, 0.42);

  background:
    linear-gradient(
      145deg,
      rgba(255, 190, 0, 0.08),
      variables.$color-surface
    );
}

.summary-card span,
.summary-card strong,
.summary-card small {
  display: block;
}

.summary-card span {
  margin-bottom: variables.$spacing-md;
  font-size: variables.$font-size-sm;
  opacity: 0.58;
}

.summary-card strong {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: 2.3rem;
  line-height: 1;
}

.summary-card small {
  opacity: 0.42;
}

/* =========================================================
   ESTADOS
========================================================= */

.students-state {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  min-height: 200px;
  padding: variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    variables.$color-surface;
}

.students-state strong {
  display: block;
  margin-bottom: variables.$spacing-xs;
}

.students-state p {
  margin: 0;
  opacity: 0.6;
}

.students-state__spinner {
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    students-spin
    0.8s
    linear
    infinite;
}

.students-state__symbol {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background:
    rgba(255, 85, 85, 0.12);
  color: #ff6b6b;
  font-size: 1.2rem;
  font-weight: bold;
}

.students-state--error {
  border-color:
    rgba(255, 85, 85, 0.35);
}

.students-state__button {
  margin-top: variables.$spacing-md;
  padding:
    variables.$spacing-sm
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: transparent;
  color: variables.$color-primary;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

@keyframes students-spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   VACÍO
========================================================= */

.students-empty {
  display: grid;
  min-height: 420px;
  place-items: center;
  padding:
    variables.$spacing-3xl
    variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    variables.$color-surface;
  text-align: center;
}

.students-empty > * {
  max-width: 620px;
}

.students-empty__symbol {
  display: grid;
  width: 70px;
  height: 70px;
  place-items: center;
  margin-bottom: variables.$spacing-lg;
  border:
    1px solid
    rgba(255, 190, 0, 0.35);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 2rem;
}

.students-empty__eyebrow {
  margin:
    0
    0
    variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.students-empty h2 {
  margin:
    0
    0
    variables.$spacing-md;
  font-size: clamp(
    2rem,
    5vw,
    3rem
  );
}

.students-empty > p:not(
  .students-empty__eyebrow
) {
  margin:
    0
    0
    variables.$spacing-xl;
  line-height: 1.65;
  opacity: 0.62;
}

/* =========================================================
   VOZ
========================================================= */

.voice-section {
  margin-bottom: variables.$spacing-3xl;
}

.voice-section__header {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-xl;
  padding-bottom: variables.$spacing-lg;
  border-bottom:
    1px solid
    variables.$color-border;
}

.voice-section__identity {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
}

.voice-section__code {
  display: grid;
  width: 48px;
  height: 48px;
  place-items: center;
  border:
    1px solid
    rgba(255, 190, 0, 0.4);
  border-radius: 50%;
  background:
    rgba(255, 190, 0, 0.07);
  color: variables.$color-primary;
  font-weight: variables.$font-weight-bold;
}

.voice-section__identity p {
  margin:
    0
    0
    variables.$spacing-xs;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.voice-section__identity h2 {
  margin: 0;
  font-size: 2rem;
}

.voice-section__count {
  opacity: 0.5;
}

.voice-section__empty {
  padding: variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius: variables.$radius-lg;
  opacity: 0.5;
}

/* =========================================================
   GRID
========================================================= */

.student-grid {
  display: grid;
  gap: variables.$spacing-lg;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

/* =========================================================
   CARD
========================================================= */

.student-card {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.student-card:hover {
  border-color:
    rgba(255, 190, 0, 0.34);
  transform:
    translateY(-2px);
}

.student-card__identity {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  padding: variables.$spacing-xl;
}

.student-card__avatar {
  display: grid;
  width: 62px;
  height: 62px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background:
    linear-gradient(
      145deg,
      variables.$color-primary,
      rgba(255, 190, 0, 0.65)
    );
  color: variables.$color-white;
  font-weight:
    variables.$font-weight-bold;
}

.student-card__content {
  min-width: 0;
}

.student-card__voice {
  display: block;
  margin-bottom: variables.$spacing-xs;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  font-weight:
    variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.student-card__content h3 {
  overflow: hidden;
  margin:
    0
    0
    variables.$spacing-xs;
  font-size: 1.25rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-card__status {
  display: flex;
  gap: 7px;
  align-items: center;
  font-size: variables.$font-size-sm;
  opacity: 0.58;
}

.student-card__status > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #5fd38d;
  box-shadow:
    0
    0
    10px
    rgba(95, 211, 141, 0.4);
}

/* =========================================================
   META
========================================================= */

.student-card__meta {
  display: grid;
  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-top:
    1px solid
    variables.$color-border;
  border-bottom:
    1px solid
    variables.$color-border;
  background:
    rgba(255, 255, 255, 0.015);
}

.student-card__meta div {
  display: grid;
  gap: 4px;
}

.student-card__meta div + div {
  padding-left:
    variables.$spacing-lg;
  border-left:
    1px solid
    variables.$color-border;
}

.student-card__meta span {
  font-size: variables.$font-size-xs;
  opacity: 0.45;
}

.student-card__meta strong {
  font-size: variables.$font-size-sm;
}

.status-active {
  color: #79db9c;
}

/* =========================================================
   ACCIONES
========================================================= */

.student-card__actions {
  display: grid;
  gap: variables.$spacing-sm;
  grid-template-columns:
    1fr
    1fr
    1fr;
  padding: variables.$spacing-lg;
}

.student-card__action {
  min-height: 42px;
  display: inline-flex;
  gap: 6px;
  align-items: center;
  justify-content: center;
  padding:
    variables.$spacing-sm
    variables.$spacing-md;
  border-radius:
    variables.$radius-lg;
  font: inherit;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    opacity 0.2s ease;
}

.student-card__action:disabled {
  cursor: wait;
  opacity: 0.45;
}

.student-card__action--profile {
  border:
    1px solid
    variables.$color-primary;
  color:
    variables.$color-primary;
}

.student-card__action--profile:hover {
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

.student-card__action--deactivate {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
}

.student-card__action--deactivate:hover:not(
  :disabled
) {
  border-color:
    rgba(255, 190, 0, 0.55);
  color:
    variables.$color-primary;
}

.student-card__action--delete {
  border:
    1px solid
    rgba(255, 83, 83, 0.32);
  background:
    rgba(255, 83, 83, 0.04);
  color: #ff7b7b;
}

.student-card__action--delete:hover:not(
  :disabled
) {
  border-color: #ff6b6b;
  background:
    rgba(255, 83, 83, 0.1);
}

/* =========================================================
   MODAL
========================================================= */

.students-modal {
  position: fixed;
  inset: 0;
  z-index: 1500;
  display: grid;
  place-items: center;
  overflow-y: auto;
  padding: variables.$spacing-xl;
  background:
    rgba(0, 0, 0, 0.82);
  backdrop-filter:
    blur(12px);
}

.students-modal__card {
  position: relative;
  width:
    min(
      100%,
      560px
    );
  padding: variables.$spacing-2xl;
  border:
    1px solid
    rgba(255, 190, 0, 0.3);
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
  box-shadow:
    0
    30px
    100px
    rgba(0, 0, 0, 0.55);
}

.students-modal__card--danger {
  border-color:
    rgba(255, 85, 85, 0.32);
}

.students-modal__close {
  position: absolute;
  top: variables.$spacing-md;
  right: variables.$spacing-md;
  width: 38px;
  height: 38px;
  border:
    1px solid
    variables.$color-border;
  border-radius: 50%;
  background: transparent;
  color:
    variables.$color-white;
  font-size: 1.5rem;
  cursor: pointer;
}

.students-modal__icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  margin-bottom: variables.$spacing-lg;
  border-radius: 50%;
  font-size: 1.5rem;
  font-weight: bold;
}

.students-modal__icon--warning {
  background:
    rgba(255, 190, 0, 0.12);
  color:
    variables.$color-primary;
}

.students-modal__icon--danger {
  background:
    rgba(255, 85, 85, 0.12);
  color: #ff6b6b;
}

.students-modal__eyebrow {
  margin:
    0
    0
    variables.$spacing-sm;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  font-weight:
    variables.$font-weight-semibold;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.students-modal__eyebrow--danger {
  color: #ff6b6b;
}

.students-modal__card h2 {
  margin:
    0
    0
    variables.$spacing-lg;
  font-size: clamp(
    2rem,
    5vw,
    2.8rem
  );
}

.students-modal__lead {
  margin:
    0
    0
    variables.$spacing-xl;
  line-height: 1.7;
  opacity: 0.75;
}

.students-modal__notice {
  margin-bottom: variables.$spacing-lg;
  padding: variables.$spacing-lg;
  border:
    1px solid
    rgba(255, 190, 0, 0.2);
  border-radius:
    variables.$radius-lg;
  background:
    rgba(255, 190, 0, 0.05);
}

.students-modal__notice--danger {
  border-color:
    rgba(255, 85, 85, 0.25);
  background:
    rgba(255, 85, 85, 0.05);
}

.students-modal__notice strong {
  display: block;
  margin-bottom:
    variables.$spacing-xs;
}

.students-modal__notice p {
  margin: 0;
  line-height: 1.6;
  opacity: 0.6;
}

.students-modal__reset-info {
  display: flex;
  gap: variables.$spacing-md;
  align-items: flex-start;
  margin-bottom: variables.$spacing-xl;
  padding: variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
}

.students-modal__reset-info > span {
  color:
    variables.$color-primary;
  font-size: 1.3rem;
}

.students-modal__reset-info p {
  margin: 0;
  line-height: 1.55;
  opacity: 0.65;
}

.students-modal__confirmation {
  display: grid;
  gap: variables.$spacing-sm;
  margin-bottom: variables.$spacing-xl;
}

.students-modal__confirmation > span {
  font-size: variables.$font-size-sm;
}

.students-modal__confirmation input {
  width: 100%;
  padding: variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  outline: none;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
  text-transform: uppercase;
}

.students-modal__confirmation input:focus {
  border-color: #ff6b6b;
}

.students-modal__actions {
  display: flex;
  gap: variables.$spacing-md;
  justify-content: flex-end;
}

.modal-button {
  min-height: 46px;
  padding:
    variables.$spacing-sm
    variables.$spacing-lg;
  border-radius:
    variables.$radius-lg;
  font: inherit;
  font-weight:
    variables.$font-weight-semibold;
  cursor: pointer;
}

.modal-button:disabled {
  cursor: not-allowed;
  opacity: 0.42;
}

.modal-button--secondary {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
}

.modal-button--warning {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

.modal-button--danger {
  border:
    1px solid
    #ff6b6b;
  background: #ff5757;
  color: white;
}

/* =========================================================
   TOAST
========================================================= */

.students-toast {
  position: fixed;
  right: 2rem;
  bottom: 2rem;
  z-index: 1700;
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  width:
    min(
      calc(100% - 2rem),
      440px
    );
  padding: variables.$spacing-lg;
  border:
    1px solid
    rgba(102, 221, 143, 0.3);
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
  box-shadow:
    0
    20px
    70px
    rgba(0, 0, 0, 0.4);
}

.students-toast__icon {
  display: grid;
  width: 42px;
  height: 42px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  background:
    rgba(102, 221, 143, 0.1);
  color: #66dd8f;
  font-weight: bold;
}

.students-toast strong {
  display: block;
  margin-bottom: 3px;
}

.students-toast p {
  margin: 0;
  font-size: variables.$font-size-sm;
  line-height: 1.45;
  opacity: 0.65;
}

/* =========================================================
   TRANSICIONES
========================================================= */

.modal-enter-active,
.modal-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform:
    translateY(12px);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (
  max-width: 1050px
) {
  .students__summary {
    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }

  .student-grid {
    grid-template-columns: 1fr;
  }
}

@media (
  max-width: 820px
) {
  .students__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .students__info {
    grid-template-columns:
      auto
      minmax(0, 1fr);
  }

  .students__info button {
    grid-column:
      2;
    justify-self: flex-start;
  }

  .students__summary {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (
  max-width: 620px
) {
  .students__header h1 {
    font-size:
      clamp(
        2.6rem,
        15vw,
        4rem
      );
  }

  .students__primary-action {
    width: 100%;
  }

  .students__info {
    grid-template-columns: 1fr;
  }

  .students__info-icon {
    display: none;
  }

  .students__info button {
    grid-column: auto;
  }

  .students__summary {
    grid-template-columns: 1fr;
  }

  .voice-section__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .student-card__identity {
    padding: variables.$spacing-lg;
  }

  .student-card__meta {
    padding:
      variables.$spacing-md
      variables.$spacing-lg;
  }

  .student-card__actions {
    grid-template-columns: 1fr;
  }

  .students-modal {
    padding: variables.$spacing-md;
  }

  .students-modal__card {
    padding:
      variables.$spacing-xl;
  }

  .students-modal__actions {
    flex-direction: column-reverse;
  }

  .students-modal__actions button {
    width: 100%;
  }

  .students-toast {
    right: 1rem;
    bottom: 1rem;
  }
}

@media (
  prefers-reduced-motion:
  reduce
) {
  .students *,
  .students *::before,
  .students *::after {
    animation-duration:
      0.01ms !important;
    animation-iteration-count:
      1 !important;
    transition-duration:
      0.01ms !important;
  }
}
</style>
