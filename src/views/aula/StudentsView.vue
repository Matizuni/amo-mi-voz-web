<template>
  <section class="students">
    <!-- =====================================================
         HEADER
    ====================================================== -->
    <header class="students__header">
      <div class="students__header-copy">
        <p class="students__eyebrow">
          Profesor · Aula Virtual
        </p>

        <h1>
          Alumnos
        </h1>

        <p class="students__description">
          Gestiona la matrícula, clasificación vocal
          y acceso de tus estudiantes.
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
         LOADING
    ====================================================== -->
    <section
      v-if="isLoading"
      class="students-state"
      role="status"
      aria-live="polite"
    >
      <div class="students-state__spinner"></div>

      <div>
        <strong>
          Cargando estudiantes
        </strong>

        <p>
          Estamos sincronizando la matrícula.
        </p>
      </div>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="students-state students-state--error"
      role="alert"
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

    <template v-else>
      <!-- =====================================================
           RESUMEN
      ====================================================== -->
      <section
        class="students__summary"
        aria-label="Resumen de estudiantes"
      >
        <article class="summary-card summary-card--main">
          <span>
            Estudiantes
          </span>

          <strong>
            {{ students.length }}
          </strong>

          <small>
            matrícula activa
          </small>
        </article>

        <article>
          <span>
            Sopranos
          </span>

          <strong>
            {{ sopranoStudents.length }}
          </strong>

          <small>
            clasificación S
          </small>
        </article>

        <article>
          <span>
            Altos
          </span>

          <strong>
            {{ altoStudents.length }}
          </strong>

          <small>
            clasificación A
          </small>
        </article>

        <article>
          <span>
            Tenores
          </span>

          <strong>
            {{ tenorStudents.length }}
          </strong>

          <small>
            clasificación T
          </small>
        </article>

        <article>
          <span>
            Bajos
          </span>

          <strong>
            {{ bassStudents.length }}
          </strong>

          <small>
            clasificación B
          </small>
        </article>
      </section>

      <!-- =====================================================
           EMPTY GENERAL
      ====================================================== -->
      <section
        v-if="students.length === 0"
        class="students-empty"
      >
        <div class="students-empty__symbol">
          ♪
        </div>

        <p class="students-empty__eyebrow">
          Aula preparada
        </p>

        <h2>
          Todavía no hay alumnos
        </h2>

        <p>
          Matricula al primer estudiante
          desde el módulo de inscripciones.
        </p>

        <button
          type="button"
          class="students__primary-action"
          @click="goToInscriptions"
        >
          Nueva matrícula
        </button>
      </section>

      <template v-else>
        <!-- =====================================================
             TOOLBAR
        ====================================================== -->
        <section class="students-toolbar">
          <div class="students-toolbar__search">
            <label for="student-search">
              Buscar estudiante
            </label>

            <div class="students-search">
              <span aria-hidden="true">
                ⌕
              </span>

              <input
                id="student-search"
                v-model.trim="searchTerm"
                type="search"
                autocomplete="off"
                placeholder="Nombre o clasificación vocal..."
              />

              <button
                v-if="searchTerm"
                type="button"
                aria-label="Limpiar búsqueda"
                @click="searchTerm = ''"
              >
                ×
              </button>
            </div>
          </div>

          <div class="students-toolbar__filters">
            <span class="students-toolbar__label">
              Mostrar
            </span>

            <div
              class="voice-filters"
              role="group"
              aria-label="Filtrar por clasificación vocal"
            >
              <button
                v-for="filter in voiceFilters"
                :key="filter.value"
                type="button"
                :class="{
                  active:
                    selectedVoice === filter.value
                }"
                :aria-pressed="
                  selectedVoice === filter.value
                "
                @click="
                  selectedVoice = filter.value
                "
              >
                {{ filter.label }}

                <span>
                  {{ filter.count }}
                </span>
              </button>
            </div>
          </div>

          <div class="students-toolbar__result">
            <span>
              Mostrando
            </span>

            <strong>
              {{ filteredStudents.length }}
              de
              {{ students.length }}
            </strong>
          </div>
        </section>

        <!-- =====================================================
             INFO MATRICULACIÓN
        ====================================================== -->
        <section class="students__info">
          <div class="students__info-icon">
            ♪
          </div>

          <div>
            <strong>
              Matrículas desde Inscripciones
            </strong>

            <p>
              Las cuentas nuevas se crean desde el
              flujo de matrícula para mantener
              estudiantes y accesos sincronizados.
            </p>
          </div>

          <button
            type="button"
            @click="goToInscriptions"
          >
            Ver inscripciones

            <span aria-hidden="true">
              →
            </span>
          </button>
        </section>

        <!-- =====================================================
             RESULTADOS VACÍOS
        ====================================================== -->
        <section
          v-if="filteredStudents.length === 0"
          class="students-no-results"
        >
          <div class="students-no-results__symbol">
            ?
          </div>

          <div>
            <h2>
              No encontramos estudiantes
            </h2>

            <p>
              Prueba otro nombre o cambia
              la clasificación vocal seleccionada.
            </p>

            <button
              type="button"
              @click="clearFilters"
            >
              Limpiar filtros
            </button>
          </div>
        </section>

        <!-- =====================================================
             ALUMNOS
        ====================================================== -->
        <section
          v-else
          class="students-directory"
        >
          <header class="students-directory__header">
            <div>
              <p>
                Directorio
              </p>

              <h2>
                Estudiantes activos
              </h2>
            </div>

            <span>
              {{ filteredStudents.length }}
              {{
                filteredStudents.length === 1
                  ? 'estudiante'
                  : 'estudiantes'
              }}
            </span>
          </header>

          <div class="student-grid">
            <article
              v-for="student in filteredStudents"
              :key="student.id"
              class="student-card"
            >
              <!-- IDENTIDAD -->
              <div class="student-card__header">
                <div class="student-card__avatar">
                  {{ getInitials(student.name) }}
                </div>

                <div class="student-card__identity">
                  <span class="student-card__voice">
                    {{ student.voice || 'Sin clasificación' }}
                  </span>

                  <h3>
                    {{ student.name }}
                  </h3>

                  <div class="student-card__status">
                    <span></span>
                    Activo
                  </div>
                </div>

                <RouterLink
                  :to="`/aula/estudiante/${student.id}`"
                  class="student-card__profile-arrow"
                  :aria-label="`Abrir perfil de ${student.name}`"
                >
                  →
                </RouterLink>
              </div>

              <!-- INFORMACIÓN -->
              <div class="student-card__details">
                <div>
                  <span>
                    Clasificación
                  </span>

                  <strong>
                    {{ student.voice || 'Pendiente' }}
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

              <!-- ACCIÓN PRINCIPAL -->
              <RouterLink
                :to="`/aula/estudiante/${student.id}`"
                class="student-card__main-action"
              >
                Ver ficha del estudiante

                <span aria-hidden="true">
                  →
                </span>
              </RouterLink>

              <!-- ADMIN -->
              <div class="student-card__admin">
                <button
                  type="button"
                  :disabled="isStudentBusy(student.id)"
                  @click="
                    askDeactivateStudent(student)
                  "
                >
                  {{
                    deactivatingStudentId === student.id
                      ? 'Desactivando...'
                      : 'Desactivar'
                  }}
                </button>

                <button
                  type="button"
                  class="student-card__delete"
                  :disabled="isStudentBusy(student.id)"
                  @click="
                    askDeleteStudent(student)
                  "
                >
                  {{
                    deletingStudentId === student.id
                      ? 'Eliminando...'
                      : 'Eliminar'
                  }}
                </button>
              </div>
            </article>
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
        @click.self="cancelDeactivateStudent"
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
            @click="cancelDeactivateStudent"
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
              Sus datos se conservarán
            </strong>

            <p>
              Asistencia, evaluaciones, tareas,
              progreso y ficha vocal permanecerán almacenados.
            </p>
          </div>

          <div class="students-modal__actions">
            <button
              type="button"
              class="modal-button modal-button--secondary"
              :disabled="isDeactivating"
              @click="cancelDeactivateStudent"
            >
              Cancelar
            </button>

            <button
              type="button"
              class="modal-button modal-button--warning"
              :disabled="isDeactivating"
              @click="confirmDeactivateStudent"
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
        @click.self="cancelDeleteStudent"
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
            @click="cancelDeleteStudent"
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

          <label class="students-modal__confirmation">
            <span>
              Para confirmar escribe

              <strong>
                ELIMINAR
              </strong>
            </span>

            <input
              v-model.trim="deleteConfirmation"
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
              @click="cancelDeleteStudent"
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
              @click="confirmDeleteStudent"
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
        v-if="toastMessage"
        class="students-toast"
        :class="{
          'students-toast--error':
            toastType === 'error'
        }"
        role="status"
        aria-live="polite"
      >
        <div class="students-toast__icon">
          {{ toastType === 'error' ? '!' : '✓' }}
        </div>

        <div>
          <strong>
            {{
              toastType === 'error'
                ? 'No pudimos completar la operación'
                : 'Operación completada'
            }}
          </strong>

          <p>
            {{ toastMessage }}
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
  ref
} from 'vue'

import {
  RouterLink,
  useRouter
} from 'vue-router'

import {
  deactivateStudent,
  deleteStudentPermanently,
  fetchStudents
} from '@/services/studentService'

/* =========================================================
   ROUTER
========================================================= */

const router = useRouter()

/* =========================================================
   GENERAL
========================================================= */

const students = ref([])
const isLoading = ref(true)
const loadError = ref('')

const searchTerm = ref('')
const selectedVoice = ref('all')

/* =========================================================
   TOAST
========================================================= */

const toastMessage = ref('')
const toastType = ref('success')

let toastTimer = null

/* =========================================================
   DESACTIVAR
========================================================= */

const studentToDeactivate = ref(null)
const isDeactivating = ref(false)
const deactivatingStudentId = ref(null)

/* =========================================================
   ELIMINAR
========================================================= */

const studentToDelete = ref(null)
const isDeleting = ref(false)
const deletingStudentId = ref(null)
const deleteConfirmation = ref('')

/* =========================================================
   CARGAR
========================================================= */

const loadStudents = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const loadedStudents =
      await fetchStudents()

    students.value =
      sortStudents(
        loadedStudents || []
      )
  } catch (error) {
    console.error(
      'Error cargando estudiantes:',
      error
    )

    students.value = []

    loadError.value =
      error?.message ||
      'No fue posible cargar los estudiantes.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   ORDEN
========================================================= */

const voiceOrder = {
  Soprano: 1,
  Alto: 2,
  Tenor: 3,
  Bajo: 4
}

const sortStudents = list =>
  [...list].sort(
    (a, b) => {
      const voiceA =
        voiceOrder[a.voice] || 99

      const voiceB =
        voiceOrder[b.voice] || 99

      if (voiceA !== voiceB) {
        return voiceA - voiceB
      }

      return String(
        a.name || ''
      ).localeCompare(
        String(b.name || ''),
        'es'
      )
    }
  )

/* =========================================================
   INSCRIPCIONES
========================================================= */

const goToInscriptions = () => {
  router.push({
    name: 'aula-inscriptions'
  })
}

/* =========================================================
   GRUPOS VOCALES
========================================================= */

const sopranoStudents =
  computed(() =>
    students.value.filter(
      student =>
        student.voice === 'Soprano'
    )
  )

const altoStudents =
  computed(() =>
    students.value.filter(
      student =>
        student.voice === 'Alto'
    )
  )

const tenorStudents =
  computed(() =>
    students.value.filter(
      student =>
        student.voice === 'Tenor'
    )
  )

const bassStudents =
  computed(() =>
    students.value.filter(
      student =>
        student.voice === 'Bajo'
    )
  )

const voiceFilters =
  computed(() => [
    {
      value: 'all',
      label: 'Todos',
      count: students.value.length
    },
    {
      value: 'Soprano',
      label: 'Sopranos',
      count: sopranoStudents.value.length
    },
    {
      value: 'Alto',
      label: 'Altos',
      count: altoStudents.value.length
    },
    {
      value: 'Tenor',
      label: 'Tenores',
      count: tenorStudents.value.length
    },
    {
      value: 'Bajo',
      label: 'Bajos',
      count: bassStudents.value.length
    }
  ])

/* =========================================================
   FILTROS
========================================================= */

const normalizedSearch =
  computed(() =>
    searchTerm.value
      .trim()
      .toLocaleLowerCase('es')
  )

const filteredStudents =
  computed(() =>
    students.value.filter(
      student => {
        const matchesVoice =
          selectedVoice.value === 'all' ||
          student.voice ===
            selectedVoice.value

        if (!matchesVoice) {
          return false
        }

        if (!normalizedSearch.value) {
          return true
        }

        const searchable =
          [
            student.name,
            student.voice
          ]
            .filter(Boolean)
            .join(' ')
            .toLocaleLowerCase('es')

        return searchable.includes(
          normalizedSearch.value
        )
      }
    )
  )

const clearFilters = () => {
  searchTerm.value = ''
  selectedVoice.value = 'all'
}

/* =========================================================
   DESACTIVAR
========================================================= */

const askDeactivateStudent =
  student => {
    if (
      isStudentBusy(student.id)
    ) {
      return
    }

    studentToDeactivate.value =
      student
  }

const cancelDeactivateStudent =
  () => {
    if (isDeactivating.value) {
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

    isDeactivating.value = true
    deactivatingStudentId.value =
      student.id

    try {
      await deactivateStudent(
        student.id
      )

      studentToDeactivate.value =
        null

      await loadStudents()

      showToast(
        `${student.name} fue desactivado correctamente.`,
        'success'
      )
    } catch (error) {
      console.error(
        'Error desactivando estudiante:',
        error
      )

      showToast(
        error?.message ||
          'No fue posible desactivar al estudiante.',
        'error'
      )
    } finally {
      isDeactivating.value = false
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
      isStudentBusy(student.id)
    ) {
      return
    }

    deleteConfirmation.value = ''
    studentToDelete.value =
      student
  }

const cancelDeleteStudent =
  () => {
    if (isDeleting.value) {
      return
    }

    studentToDelete.value = null
    deleteConfirmation.value = ''
  }

const canConfirmDelete =
  computed(() =>
    deleteConfirmation.value
      .trim()
      .toUpperCase() ===
    'ELIMINAR'
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

    isDeleting.value = true
    deletingStudentId.value =
      student.id

    try {
      const result =
        await deleteStudentPermanently(
          student.id
        )

      studentToDelete.value = null
      deleteConfirmation.value = ''

      await loadStudents()

      showToast(
        result?.message ||
          `${student.name} fue eliminado definitivamente.`,
        'success'
      )
    } catch (error) {
      console.error(
        'Error eliminando estudiante:',
        error
      )

      showToast(
        error?.message ||
          'No fue posible eliminar al estudiante.',
        'error'
      )
    } finally {
      isDeleting.value = false
      deletingStudentId.value =
        null
    }
  }

/* =========================================================
   BUSY
========================================================= */

const isStudentBusy =
  studentId =>
    deactivatingStudentId.value ===
      studentId ||
    deletingStudentId.value ===
      studentId

/* =========================================================
   TOAST
========================================================= */

const showToast = (
  message,
  type = 'success'
) => {
  toastMessage.value = message
  toastType.value = type

  if (toastTimer) {
    window.clearTimeout(
      toastTimer
    )
  }

  toastTimer =
    window.setTimeout(
      () => {
        toastMessage.value = ''
      },
      4500
    )
}

/* =========================================================
   INICIALES
========================================================= */

const getInitials = name => {
  if (!name) {
    return '?'
  }

  return String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(
      word =>
        word.charAt(0)
    )
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

/* =========================================================
   ESC
========================================================= */

const handleKeydown = event => {
  if (event.key !== 'Escape') {
    return
  }

  if (
    studentToDeactivate.value &&
    !isDeactivating.value
  ) {
    cancelDeactivateStudent()
  }

  if (
    studentToDelete.value &&
    !isDeleting.value
  ) {
    cancelDeleteStudent()
  }
}

/* =========================================================
   VIDA
========================================================= */

onMounted(() => {
  loadStudents()

  window.addEventListener(
    'keydown',
    handleKeydown
  )
})

onBeforeUnmount(() => {
  if (toastTimer) {
    window.clearTimeout(
      toastTimer
    )
  }

  window.removeEventListener(
    'keydown',
    handleKeydown
  )
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   PAGE
========================================================= */

.students {
  width: 100%;
  max-width: 1280px;

  margin: 0 auto;
  padding-bottom:
    variables.$spacing-4xl;
}

/* =========================================================
   HEADER
========================================================= */

.students__header {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-2xl;
}

.students__header-copy {
  max-width: 720px;
}

.students__eyebrow {
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

  letter-spacing:
    0.14em;

  text-transform:
    uppercase;
}

.students__header h1 {
  margin: 0;

  font-size:
    clamp(
      3rem,
      6vw,
      5.2rem
    );

  line-height: 0.98;
}

.students__description {
  max-width: 650px;

  margin:
    variables.$spacing-lg
    0
    0;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-base;

  line-height: 1.7;
}

/* =========================================================
   PRIMARY ACTION
========================================================= */

.students__primary-action {
  display: inline-flex;

  min-height:
    variables.$control-height-lg;

  gap:
    variables.$spacing-sm;

  align-items: center;
  justify-content: center;

  padding:
    0
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-primary;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-black;

  background:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  cursor: pointer;

  white-space: nowrap;

  box-shadow:
    variables.$shadow-primary;

  transition:
    transform
      variables.$transition-fast,
    background-color
      variables.$transition-fast;
}

.students__primary-action:hover {
  background:
    variables.$color-primary-light;

  transform:
    translateY(-2px);
}

.students__primary-action > span {
  font-size: 1.15rem;
}

/* =========================================================
   SUMMARY
========================================================= */

.students__summary {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      5,
      minmax(0, 1fr)
    );

  margin-bottom:
    variables.$spacing-xl;
}

.summary-card,
.students__summary article {
  min-width: 0;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.summary-card--main {
  border-color:
    variables.$color-border-primary;

  background:
    linear-gradient(
      145deg,
      rgba(
        variables.$color-primary,
        0.07
      ),
      variables.$color-surface
    );
}

.students__summary span,
.students__summary strong,
.students__summary small {
  display: block;
}

.students__summary span {
  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.students__summary strong {
  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-text-primary;

  font-size:
    clamp(
      1.6rem,
      3vw,
      2.1rem
    );

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

.summary-card--main strong {
  color:
    variables.$color-primary;
}

.students__summary small {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

/* =========================================================
   TOOLBAR
========================================================= */

.students-toolbar {
  display: grid;

  gap:
    variables.$spacing-xl;

  align-items: end;

  grid-template-columns:
    minmax(260px, 1fr)
    minmax(380px, auto)
    auto;

  margin-bottom:
    variables.$spacing-lg;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.students-toolbar__search label,
.students-toolbar__label {
  display: block;

  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;
}

.students-search {
  position: relative;

  display: flex;

  align-items: center;
}

.students-search > span {
  position: absolute;

  left:
    variables.$spacing-md;

  color:
    variables.$color-text-muted;

  pointer-events: none;
}

.students-search input {
  width: 100%;
  min-height:
    variables.$control-height-md;

  padding:
    0
    3rem
    0
    2.65rem;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  outline: 0;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-background;

  font-size:
    variables.$font-size-sm;

  transition:
    border-color
      variables.$transition-fast,
    box-shadow
      variables.$transition-fast;
}

.students-search input::placeholder {
  color:
    variables.$color-text-disabled;
}

.students-search input:focus-visible {
  border-color:
    variables.$color-primary;

  box-shadow:
    0 0 0 3px
    rgba(
      variables.$color-primary,
      0.08
    );
}

.students-search button {
  position: absolute;

  right:
    variables.$spacing-sm;

  display: grid;

  width: 34px;
  height: 34px;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-text-muted;

  background:
    transparent;

  font-size: 1.25rem;

  cursor: pointer;
}

/* =========================================================
   FILTERS
========================================================= */

.voice-filters {
  display: flex;

  gap:
    variables.$spacing-xs;

  flex-wrap: wrap;
}

.voice-filters button {
  display: inline-flex;

  min-height: 42px;

  gap:
    variables.$spacing-sm;

  align-items: center;

  padding:
    0
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-pill;

  color:
    variables.$color-text-secondary;

  background:
    transparent;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;

  cursor: pointer;

  transition:
    border-color
      variables.$transition-fast,
    background-color
      variables.$transition-fast,
    color
      variables.$transition-fast;
}

.voice-filters button span {
  display: grid;

  min-width: 22px;
  height: 22px;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-text-muted;

  background:
    variables.$color-surface-light;

  font-size:
    0.68rem;
}

.voice-filters button:hover {
  border-color:
    variables.$color-border-strong;

  color:
    variables.$color-text-primary;
}

.voice-filters button.active {
  border-color:
    variables.$color-border-primary;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.07
    );
}

.voice-filters button.active span {
  color:
    variables.$color-black;

  background:
    variables.$color-primary;
}

.students-toolbar__result {
  text-align: right;

  white-space: nowrap;
}

.students-toolbar__result span,
.students-toolbar__result strong {
  display: block;
}

.students-toolbar__result span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.students-toolbar__result strong {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   INFO
========================================================= */

.students__info {
  display: grid;

  gap:
    variables.$spacing-lg;

  align-items: center;

  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;

  margin-bottom:
    variables.$spacing-3xl;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.students__info-icon {
  display: grid;

  width: 42px;
  height: 42px;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.08
    );
}

.students__info strong {
  display: block;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;
}

.students__info p {
  max-width: 650px;

  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;

  line-height: 1.55;
}

.students__info button {
  display: inline-flex;

  gap:
    variables.$spacing-sm;

  align-items: center;

  border: 0;

  color:
    variables.$color-primary;

  background: transparent;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  cursor: pointer;
}

/* =========================================================
   DIRECTORY
========================================================= */

.students-directory__header {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-xl;

  padding-bottom:
    variables.$spacing-lg;

  border-bottom:
    1px solid
    variables.$color-border;
}

.students-directory__header p {
  margin:
    0
    0
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.08em;

  text-transform:
    uppercase;
}

.students-directory__header h2 {
  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-2xl;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.03em;
}

.students-directory__header > span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   GRID
========================================================= */

.student-grid {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
}

/* =========================================================
   CARD
========================================================= */

.student-card {
  min-width: 0;

  overflow: hidden;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;

  transition:
    border-color
      variables.$transition-normal,
    transform
      variables.$transition-normal,
    background-color
      variables.$transition-normal;
}

.student-card:hover {
  border-color:
    variables.$color-border-primary;

  background:
    variables.$color-surface-elevated;

  transform:
    translateY(-3px);
}

.student-card__header {
  display: flex;

  min-width: 0;

  gap:
    variables.$spacing-md;

  align-items: center;

  padding:
    variables.$spacing-xl;
}

.student-card__avatar {
  display: grid;

  width: 54px;
  height: 54px;

  flex: 0 0 auto;

  place-items: center;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.07
    );

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.student-card__identity {
  min-width: 0;
  flex: 1;
}

.student-card__voice {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.06em;

  text-transform:
    uppercase;
}

.student-card__identity h3 {
  overflow: hidden;

  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.02em;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-card__status {
  display: flex;

  gap: 7px;

  align-items: center;

  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.student-card__status > span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    variables.$color-success;
}

.student-card__profile-arrow {
  display: grid;

  width: 38px;
  height: 38px;

  flex: 0 0 auto;

  place-items: center;

  border:
    1px solid
    variables.$color-border;

  border-radius: 50%;

  color:
    variables.$color-text-muted;

  transition:
    color
      variables.$transition-fast,
    border-color
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.student-card__profile-arrow:hover {
  border-color:
    variables.$color-primary;

  color:
    variables.$color-primary;

  transform:
    translateX(2px);
}

/* =========================================================
   DETAILS
========================================================= */

.student-card__details {
  display: grid;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );

  border-block:
    1px solid
    variables.$color-border-soft;

  background:
    rgba(
      variables.$color-white,
      0.012
    );
}

.student-card__details div {
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
}

.student-card__details div + div {
  border-left:
    1px solid
    variables.$color-border-soft;
}

.student-card__details span,
.student-card__details strong {
  display: block;
}

.student-card__details span {
  margin-bottom: 4px;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.student-card__details strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;
}

.status-active {
  color:
    variables.$color-success !important;
}

/* =========================================================
   MAIN ACTION
========================================================= */

.student-card__main-action {
  display: flex;

  min-height:
    variables.$control-height-lg;

  align-items: center;
  justify-content: space-between;

  margin:
    variables.$spacing-lg
    variables.$spacing-lg
    variables.$spacing-sm;

  padding:
    0
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.055
    );

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  transition:
    background-color
      variables.$transition-fast,
    border-color
      variables.$transition-fast;
}

.student-card__main-action:hover {
  border-color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.1
    );
}

/* =========================================================
   ADMIN ACTIONS
========================================================= */

.student-card__admin {
  display: flex;

  gap:
    variables.$spacing-sm;

  justify-content: flex-end;

  padding:
    variables.$spacing-sm
    variables.$spacing-lg
    variables.$spacing-lg;
}

.student-card__admin button {
  min-height: 40px;

  padding:
    0
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-muted;

  background:
    transparent;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;

  cursor: pointer;

  transition:
    color
      variables.$transition-fast,
    border-color
      variables.$transition-fast,
    background-color
      variables.$transition-fast;
}

.student-card__admin button:hover:not(:disabled) {
  border-color:
    variables.$color-warning;

  color:
    variables.$color-warning;
}

.student-card__admin
.student-card__delete {
  color:
    variables.$color-text-muted;
}

.student-card__admin
.student-card__delete:hover:not(:disabled) {
  border-color:
    rgba(
      variables.$color-danger,
      0.5
    );

  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
}

.student-card__admin button:disabled {
  cursor: wait;
  opacity: 0.4;
}

/* =========================================================
   EMPTY
========================================================= */

.students-empty,
.students-no-results {
  display: grid;

  min-height: 360px;

  place-items: center;

  padding:
    variables.$spacing-3xl;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;

  text-align: center;
}

.students-empty > *,
.students-no-results > * {
  max-width: 580px;
}

.students-empty__symbol,
.students-no-results__symbol {
  display: grid;

  width: 64px;
  height: 64px;

  place-items: center;

  margin-bottom:
    variables.$spacing-lg;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.08
    );

  font-size: 1.5rem;
}

.students-empty__eyebrow {
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

  letter-spacing:
    0.1em;

  text-transform:
    uppercase;
}

.students-empty h2,
.students-no-results h2 {
  margin:
    0
    0
    variables.$spacing-md;

  font-size:
    clamp(
      2rem,
      5vw,
      3rem
    );
}

.students-empty > p:not(
  .students-empty__eyebrow
),
.students-no-results p {
  margin:
    0
    0
    variables.$spacing-xl;

  color:
    variables.$color-text-secondary;

  line-height: 1.65;
}

.students-no-results button {
  min-height:
    variables.$control-height-md;

  padding:
    0
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    transparent;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;

  cursor: pointer;
}

/* =========================================================
   STATE
========================================================= */

.students-state {
  display: flex;

  gap:
    variables.$spacing-lg;

  align-items: center;

  min-height: 220px;

  justify-content: center;

  padding:
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.students-state strong {
  display: block;

  color:
    variables.$color-text-primary;
}

.students-state p {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.students-state__spinner {
  width: 44px;
  height: 44px;

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

  width: 44px;
  height: 44px;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;

  font-weight:
    variables.$font-weight-bold;
}

.students-state--error {
  border-color:
    rgba(
      variables.$color-danger,
      0.25
    );
}

.students-state__button {
  min-height:
    variables.$control-height-md;

  margin-top:
    variables.$spacing-md;

  padding:
    0
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    transparent;

  cursor: pointer;
}

@keyframes students-spin {
  to {
    transform:
      rotate(360deg);
  }
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

  padding:
    variables.$spacing-xl;

  background:
    rgba(
      variables.$color-black,
      0.82
    );

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

  padding:
    variables.$spacing-2xl;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius:
    variables.$radius-xl;

  background:
    variables.$color-surface-elevated;

  box-shadow:
    variables.$shadow-lg;
}

.students-modal__card--danger {
  border-color:
    rgba(
      variables.$color-danger,
      0.3
    );
}

.students-modal__close {
  position: absolute;

  top:
    variables.$spacing-md;

  right:
    variables.$spacing-md;

  display: grid;

  width: 40px;
  height: 40px;

  place-items: center;

  border:
    1px solid
    variables.$color-border;

  border-radius: 50%;

  color:
    variables.$color-text-secondary;

  background:
    transparent;

  font-size: 1.4rem;

  cursor: pointer;
}

.students-modal__icon {
  display: grid;

  width: 56px;
  height: 56px;

  place-items: center;

  margin-bottom:
    variables.$spacing-lg;

  border-radius: 50%;

  font-size: 1.35rem;

  font-weight:
    variables.$font-weight-bold;
}

.students-modal__icon--warning {
  color:
    variables.$color-warning;

  background:
    variables.$color-warning-soft;
}

.students-modal__icon--danger {
  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
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

  letter-spacing:
    0.12em;

  text-transform:
    uppercase;
}

.students-modal__eyebrow--danger {
  color:
    variables.$color-danger;
}

.students-modal__card h2 {
  margin:
    0
    0
    variables.$spacing-lg;

  font-size:
    clamp(
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

  color:
    variables.$color-text-secondary;

  line-height: 1.7;
}

.students-modal__lead strong {
  color:
    variables.$color-text-primary;
}

.students-modal__notice {
  margin-bottom:
    variables.$spacing-xl;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    rgba(
      variables.$color-warning,
      0.2
    );

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-warning-soft;
}

.students-modal__notice--danger {
  border-color:
    rgba(
      variables.$color-danger,
      0.24
    );

  background:
    variables.$color-danger-soft;
}

.students-modal__notice strong {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-text-primary;
}

.students-modal__notice p {
  margin: 0;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  line-height: 1.6;
}

.students-modal__confirmation {
  display: grid;

  gap:
    variables.$spacing-sm;

  margin-bottom:
    variables.$spacing-xl;
}

.students-modal__confirmation > span {
  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;
}

.students-modal__confirmation input {
  width: 100%;
  min-height:
    variables.$control-height-lg;

  padding:
    0
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  outline: 0;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-background;

  font-size:
    variables.$font-size-base;

  font-weight:
    variables.$font-weight-semibold;

  text-transform:
    uppercase;
}

.students-modal__confirmation input:focus-visible {
  border-color:
    variables.$color-danger;

  box-shadow:
    0 0 0 3px
    rgba(
      variables.$color-danger,
      0.08
    );
}

.students-modal__actions {
  display: flex;

  gap:
    variables.$spacing-md;

  justify-content: flex-end;
}

.modal-button {
  min-height:
    variables.$control-height-lg;

  padding:
    0
    variables.$spacing-lg;

  border-radius:
    variables.$radius-md;

  font-size:
    variables.$font-size-sm;

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

  color:
    variables.$color-text-primary;

  background:
    transparent;
}

.modal-button--warning {
  border:
    1px solid
    variables.$color-warning;

  color:
    variables.$color-black;

  background:
    variables.$color-warning;
}

.modal-button--danger {
  border:
    1px solid
    variables.$color-danger;

  color:
    variables.$color-white;

  background:
    variables.$color-danger;
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

  gap:
    variables.$spacing-md;

  align-items: center;

  width:
    min(
      calc(100% - 2rem),
      440px
    );

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    rgba(
      variables.$color-success,
      0.3
    );

  border-radius:
    variables.$radius-lg;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-surface-elevated;

  box-shadow:
    variables.$shadow-lg;
}

.students-toast--error {
  border-color:
    rgba(
      variables.$color-danger,
      0.3
    );
}

.students-toast__icon {
  display: grid;

  width: 42px;
  height: 42px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 50%;

  color:
    variables.$color-success;

  background:
    variables.$color-success-soft;

  font-weight:
    variables.$font-weight-bold;
}

.students-toast--error
.students-toast__icon {
  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
}

.students-toast strong {
  display: block;

  margin-bottom:
    variables.$spacing-xs;
}

.students-toast p {
  margin: 0;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  line-height: 1.45;
}

/* =========================================================
   TRANSITIONS
========================================================= */

.modal-enter-active,
.modal-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform:
    translateY(10px);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1150px) {
  .students__summary {
    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }

  .students-toolbar {
    grid-template-columns:
      1fr;
  }

  .students-toolbar__result {
    text-align: left;
  }

  .student-grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 820px) {
  .students__header {
    align-items:
      stretch;

    flex-direction:
      column;
  }

  .students__info {
    grid-template-columns:
      auto
      minmax(0, 1fr);
  }

  .students__info button {
    grid-column:
      2;

    justify-self:
      flex-start;
  }
}

@media (max-width: 700px) {
  .students {
    padding-bottom:
      variables.$spacing-3xl;
  }

  .students__header h1 {
    font-size:
      clamp(
        2.9rem,
        15vw,
        4.4rem
      );
  }

  .students__primary-action {
    width: 100%;
  }

  .students__summary {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .summary-card--main {
    grid-column:
      1 / -1;
  }

  .students-toolbar {
    padding:
      variables.$spacing-md;
  }

  .voice-filters {
    display: grid;

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .voice-filters button:first-child {
    grid-column:
      1 / -1;
  }

  .voice-filters button {
    justify-content:
      space-between;
  }

  .students__info {
    grid-template-columns:
      1fr;
  }

  .students__info-icon {
    display: none;
  }

  .students__info button {
    grid-column:
      auto;
  }

  .students-directory__header {
    align-items:
      flex-start;

    flex-direction:
      column;
  }

  .student-grid {
    grid-template-columns:
      1fr;
  }

  .student-card__header {
    padding:
      variables.$spacing-lg;
  }

  .student-card__details div {
    padding:
      variables.$spacing-md
      variables.$spacing-lg;
  }

  .students-modal {
    padding:
      variables.$spacing-md;
  }

  .students-modal__card {
    padding:
      variables.$spacing-xl;
  }

  .students-modal__actions {
    flex-direction:
      column-reverse;
  }

  .students-modal__actions button {
    width: 100%;
  }

  .students-toast {
    right: 1rem;
    bottom: 1rem;
    left: 1rem;

    width: auto;
  }
}

@media (max-width: 430px) {
  .students__summary {
    gap:
      variables.$spacing-sm;
  }

  .students__summary article {
    padding:
      variables.$spacing-md;
  }

  .student-card__details {
    grid-template-columns:
      1fr;
  }

  .student-card__details div + div {
    border-top:
      1px solid
      variables.$color-border-soft;

    border-left: 0;
  }

  .student-card__admin {
    justify-content:
      stretch;
  }

  .student-card__admin button {
    flex: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .students-state__spinner {
    animation-duration: 1.5s;
  }

  .student-card,
  .students__primary-action,
  .student-card__profile-arrow {
    transition: none;
  }
}
</style>
