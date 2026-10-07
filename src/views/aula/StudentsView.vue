<template>
  <section class="students">
    <!-- =====================================================
         HEADER
    ====================================================== -->
    <header class="students__header">
      <div class="students__header-copy">
        <p class="students__eyebrow">
          Profesor Â· Aula Virtual
        </p>

        <h1>
          Alumnos
        </h1>

        <p class="students__description">
          Gestiona la matrÃ­cula, clasificaciÃ³n vocal
          y acceso de tus estudiantes.
        </p>
      </div>

      <button
        type="button"
        class="students__primary-action"
        @click="goToInscriptions"
      >
        <span aria-hidden="true">+</span>
        Nueva matrÃ­cula
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
          Estamos sincronizando la matrÃ­cula.
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
      <section
        v-if="students.length === 0"
        class="students-empty"
      >
        <div class="students-empty__symbol">â™ª</div>
        <p class="students-empty__eyebrow">Aula preparada</p>
        <h2>TodavÃ­a no hay alumnos</h2>
        <p>Matricula al primer estudiante desde el mÃ³dulo de inscripciones.</p>
        <button
          type="button"
          class="students__primary-action"
          @click="goToInscriptions"
        >
          Nueva matrÃ­cula
        </button>
      </section>

      <div v-else class="students-directory-panel">
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
                âŒ•
              </span>

              <input
                id="student-search"
                v-model.trim="searchTerm"
                type="search"
                autocomplete="off"
                placeholder="Nombre o clasificaciÃ³n vocal..."
              />

              <button
                v-if="searchTerm"
                type="button"
                aria-label="Limpiar bÃºsqueda"
                @click="searchTerm = ''"
              >
                Ã—
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
              aria-label="Filtrar por clasificaciÃ³n vocal"
            >
              <button
                v-for="filter in voiceFilters"
                :key="filter.value"
                type="button"
                :class="{
                  active:
                    selectedVoice === filter.value
                }"
                :aria-pressed="selectedVoice === filter.value"
                @click="selectedVoice = filter.value"
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
             INFO MATRICULACIÃ“N
        ====================================================== -->
        <section class="students__info">
          <div class="students__info-icon">
            â™ª
          </div>

          <div>
            <strong>
              MatrÃ­culas desde Inscripciones
            </strong>

            <p>
              Las cuentas nuevas se crean desde el
              flujo de matrÃ­cula para mantener
              estudiantes y accesos sincronizados.
            </p>
          </div>

          <button
            type="button"
            @click="goToInscriptions"
          >
            Ver inscripciones

            <span aria-hidden="true">
              â†’
            </span>
          </button>
        </section>

        <!-- =====================================================
             RESULTADOS VACÃOS
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
              la clasificaciÃ³n vocal seleccionada.
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
              role="link"
              tabindex="0"
              @click="goToStudentProfile(student)"
              @keydown.enter="goToStudentProfile(student)"
            >
              <!-- IDENTIDAD -->
              <div class="student-card__header">
                <div class="student-card__avatar">
                  {{ getInitials(student.name) }}
                </div>

                <div class="student-card__identity">
                  <span class="student-card__voice">
                    {{ student.voice || 'Sin clasificaciÃ³n' }}
                  </span>

                  <h3>
                    {{ student.name }}
                  </h3>

                  <div class="student-card__status">
                    <span></span>
                    Activo
                  </div>
                </div>

                <span
                  class="student-card__profile-arrow"
                  aria-hidden="true"
                >
                  â†’
                </span>
              </div>

              <!-- INFORMACIÃ“N -->
              <div class="student-card__details">
                <div>
                  <span>
                    ClasificaciÃ³n
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

              <!-- ACCIÃ“N PRINCIPAL -->

              <!-- ADMIN -->
              <div class="student-card__admin">
                <button
                  type="button"
                  class="student-card__edit"
                  :disabled="isStudentBusy(student.id)"
                  @click.stop="openEditStudent(student)"
                >
                  âœŽ Editar datos
                </button>

                <button
                  type="button"
                  :disabled="isStudentBusy(student.id)"
                  @click.stop="askDeactivateStudent(student)"
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
                  @click.stop="askDeleteStudent(student)"
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
      </div>
    </template>

    <!-- =====================================================
         MODAL EDITAR
    ====================================================== -->
    <Transition name="modal">
      <div
        v-if="studentToEdit"
        class="students-modal"
        @click.self="cancelEditStudent"
      >
        <section class="students-modal__card students-edit-modal" role="dialog" aria-modal="true" aria-labelledby="edit-student-title">
          <button type="button" class="students-modal__close" :disabled="isSavingStudentEdit" aria-label="Cerrar" @click="cancelEditStudent">Ã—</button>
          <div class="students-modal__icon students-modal__icon--edit">âœŽ</div>
          <p class="students-modal__eyebrow">GestiÃ³n acadÃ©mica</p>
          <h2 id="edit-student-title">Editar estudiante</h2>
          <p class="students-modal__lead">Corrige los datos acadÃ©micos visibles de <strong>{{ studentToEdit.name }}</strong> sin tocar sus credenciales de acceso.</p>

          <form class="student-edit-form" @submit.prevent="saveStudentEdit">
            <label>
              <span>Nombre completo</span>
              <input v-model.trim="editStudentForm.name" type="text" maxlength="120" required />
            </label>

            <label>
              <span>ClasificaciÃ³n vocal</span>
              <select v-model="editStudentForm.voice">
                <option value="">Sin clasificar</option>
                <option value="Soprano">Soprano</option>
                <option value="Alto">Alto</option>
                <option value="Tenor">Tenor</option>
                <option value="Bajo">Bajo</option>
              </select>
            </label>

            <label class="student-edit-switch">
              <input v-model="editStudentForm.active" type="checkbox" />
              <span>
                <strong>Cuenta acadÃ©mica activa</strong>
                <small>Desactivar desde aquÃ­ mantiene los datos almacenados.</small>
              </span>
            </label>

            <div class="students-modal__actions">
              <button type="button" class="modal-button modal-button--secondary" :disabled="isSavingStudentEdit" @click="cancelEditStudent">Cancelar</button>
              <button type="submit" class="modal-button modal-button--edit" :disabled="isSavingStudentEdit">
                {{ isSavingStudentEdit ? 'Guardandoâ€¦' : 'Guardar cambios' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </Transition>

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
            Ã—
          </button>

          <div
            class="
              students-modal__icon
              students-modal__icon--warning
            "
          >
            â€–
          </div>

          <p class="students-modal__eyebrow">
            GestiÃ³n de acceso
          </p>

          <h2 id="deactivate-title">
            Â¿Desactivar alumno?
          </h2>

          <p class="students-modal__lead">
            <strong>
              {{ studentToDeactivate.name }}
            </strong>

            dejarÃ¡ de aparecer entre los alumnos activos
            y no podrÃ¡ ingresar normalmente al Aula Virtual.
          </p>

          <div class="students-modal__notice">
            <strong>
              Sus datos se conservarÃ¡n
            </strong>

            <p>
              Asistencia, evaluaciones, tareas,
              progreso y ficha vocal permanecerÃ¡n almacenados.
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
                  : 'SÃ­, desactivar'
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
            Ã—
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
            AcciÃ³n irreversible
          </p>

          <h2 id="delete-title">
            Eliminar definitivamente
          </h2>

          <p class="students-modal__lead">
            EstÃ¡s a punto de eliminar a

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
              Se eliminarÃ¡n sus datos acadÃ©micos
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
          {{ toastType === 'error' ? '!' : 'âœ“' }}
        </div>

        <div>
          <strong>
            {{
              toastType === 'error'
                ? 'No pudimos completar la operaciÃ³n'
                : 'OperaciÃ³n completada'
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
  useRouter
} from 'vue-router'

import {
  deactivateStudent,
  deleteStudentPermanently,
  fetchStudents
} from '@/services/studentService'

import {
  updateStudentByTeacher
} from '@/services/accountProfileService'

/* =========================================================
   ROUTER
========================================================= */

const router = useRouter()

const goToStudentProfile = student => {
  if (!student?.id) return
  router.push(`/aula/estudiante/${student.id}`)
}

/* =========================================================
   GENERAL
========================================================= */

const students = ref([])
const isLoading = ref(true)
const loadError = ref('')

const searchTerm = ref('')
const selectedVoice = ref('all')

/* =========================================================
   DIRECTORIO ACADÃ‰MICO Â· V10
========================================================= */
const activeStudentsTab = ref('directorio')

const isStudentsTab = tab =>
  activeStudentsTab.value === tab

const setStudentsTab = tab => {
  activeStudentsTab.value = tab
}

const unclassifiedStudents =
  computed(() =>
    students.value.filter(
      student => !student.voice
    )
  )


/* =========================================================
   TOAST
========================================================= */

const toastMessage = ref('')
const toastType = ref('success')

let toastTimer = null

/* =========================================================
   EDITAR DATOS ACADÃ‰MICOS
========================================================= */

const openEditStudent = student => {
  if (!student || isStudentBusy(student.id)) return
  studentToEdit.value = student
  editStudentForm.value = {
    name: student.name || '',
    voice: student.voice || '',
    active: student.active !== false,
  }
}

const cancelEditStudent = () => {
  if (isSavingStudentEdit.value) return
  studentToEdit.value = null
}

const saveStudentEdit = async () => {
  const student = studentToEdit.value
  if (!student || isSavingStudentEdit.value) return

  isSavingStudentEdit.value = true

  try {
    const updated = await updateStudentByTeacher(student.id, editStudentForm.value)
    studentToEdit.value = null
    await loadStudents()
    showToast(`${updated.name} fue actualizado correctamente.`, 'success')
  } catch (error) {
    console.error('Error editando estudiante:', error)
    showToast(error?.message || 'No fue posible actualizar al estudiante.', 'error')
  } finally {
    isSavingStudentEdit.value = false
  }
}

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
   EDITAR DATOS ACADÃ‰MICOS
========================================================= */
const studentToEdit = ref(null)
const editStudentForm = ref({ name: '', voice: '', active: true })
const isSavingStudentEdit = ref(false)

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
    },
    {
      value: 'unclassified',
      label: 'Sin clasificar',
      count: unclassifiedStudents.value.length
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
          (
            selectedVoice.value ===
              'unclassified'
              ? !student.voice
              : student.voice ===
                  selectedVoice.value
          )

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
    studentToEdit.value &&
    !isSavingStudentEdit.value
  ) {
    cancelEditStudent()
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

<style lang="scss" scoped>
/* =========================================================
   V5.1 Â· LIGHT LMS PATCH
   Scoped visual refinement: no backend or template logic touched.
========================================================= */
.students {
  --amv-bg: #f4f7fb;
  --amv-surface: #ffffff;
  --amv-surface-soft: #f8fafc;
  --amv-surface-warm: #fffaf0;
  --amv-ink: #172033;
  --amv-muted: #667085;
  --amv-border: #dbe3ee;
  --amv-border-strong: #c7d2e0;
  --amv-wine: #9f1d4a;
  --amv-gold: #c99424;
  --amv-gold-soft: #fff3cf;
  --amv-success: #1f8a62;
  color: var(--amv-ink);
}

.students__summary article,
.summary-card,
.students-toolbar,
.students__info,
.student-card,
.students-directory__header,
.students-empty,
.students-no-results,
.students-state,
.students-modal__card {
  background: var(--amv-surface) !important;
  color: var(--amv-ink) !important;
  border-color: var(--amv-border) !important;
  box-shadow: 0 12px 32px rgba(23, 32, 51, 0.06) !important;
}

.summary-card--main {
  background: linear-gradient(145deg, var(--amv-gold-soft), #ffffff 72%) !important;
  border-color: #ead59a !important;
}

.students__summary span,
.students__summary small,
.students-toolbar__label,
.students-toolbar__result,
.student-card__details,
.student-card__status,
.students__info p,
.students-state p,
.students-empty p,
.students-no-results p {
  color: var(--amv-muted) !important;
}

.students__summary strong,
.student-card__identity strong,
.student-card__main-action,
.students-directory__header h2,
.students-state strong,
.students-empty h2,
.students-no-results strong {
  color: var(--amv-ink) !important;
}

.students-search,
.students-search input {
  background: var(--amv-surface-soft) !important;
  color: var(--amv-ink) !important;
  border-color: var(--amv-border) !important;
}

.students-search input::placeholder { color: #98a2b3 !important; }

.voice-filters button {
  background: #ffffff !important;
  color: #344054 !important;
  border-color: var(--amv-border) !important;
}

.voice-filters button[aria-pressed='true'],
.voice-filters button.active {
  background: var(--amv-gold-soft) !important;
  color: #77580f !important;
  border-color: #e2bd55 !important;
}

.student-card__avatar {
  background: var(--amv-surface-warm) !important;
  color: var(--amv-gold) !important;
  border-color: #efd893 !important;
}

.student-card__voice {
  color: var(--amv-gold) !important;
}

.student-card__admin,
.student-card__delete {
  background: #ffffff !important;
  border-color: var(--amv-border) !important;
}

.student-card__admin { color: #475467 !important; }
.student-card__delete { color: #b42318 !important; }

.students__primary-action {
  background: var(--amv-wine) !important;
  border-color: var(--amv-wine) !important;
  color: #ffffff !important;
  box-shadow: 0 10px 24px rgba(159, 29, 74, 0.18) !important;
}

.students__primary-action:hover { background: #82173d !important; }

.students-modal {
  background: rgba(15, 23, 42, 0.48) !important;
  backdrop-filter: blur(4px);
}

.students-modal__notice,
.students-modal__confirmation {
  background: var(--amv-surface-soft) !important;
  border-color: var(--amv-border) !important;
  color: var(--amv-ink) !important;
}

@media (max-width: 760px) {
  .students__summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .students-toolbar { padding: 1rem !important; }
}


/* =========================================================
   AMV LMS UI SYSTEM Â· ACADEMIC EXPERIENCE v1.0
   Sistema visual comÃºn para el SaaS
========================================================= */
.students {
  --amv-canvas: #f5f7fb;
  --amv-card: #ffffff;
  --amv-ink: #172033;
  --amv-body: #344359;
  --amv-muted: #667085;
  --amv-line: #dbe3ec;
  --amv-wine: #9f1945;
  --amv-wine-dark: #7f1237;
  --amv-gold: #d9a91d;
  --amv-gold-soft: #fff8e7;
  --amv-green: #2d8a63;
  --amv-red: #be4856;
  --amv-shadow-sm: 0 8px 24px rgba(23, 32, 51, .055);
  --amv-shadow-md: 0 18px 46px rgba(23, 32, 51, .085);
  --amv-radius-sm: 12px;
  --amv-radius-md: 18px;
  --amv-radius-lg: 24px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.students :where(a, button, input, textarea, select, [role="button"]) {
  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
}

.students :where(a, button, input, textarea, select, [role="button"]):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.students :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.students :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

.students :where(table tbody tr) {
  transition: background-color .18s ease;
}

.students :where(table tbody tr):hover {
  background-color: rgba(159, 25, 69, .025);
}

.students :where(.card, [class*="-card"], [class*="__card"]) {
  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;
}

.students :where(.card, [class*="-card"], [class*="__card"]):hover {
  border-color: rgba(159, 25, 69, .16);
}

@media (prefers-reduced-motion: reduce) {
  .students *, .students *::before, .students *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* =========================================================
   AMV LMS Â· FLUID MOTION & PREMIUM INTERACTION v2.0
   Capa visual segura: no modifica lÃ³gica, datos ni estructura.
========================================================= */
.students {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.students :where(
  article,
  [class$="__card"],
  [class*="-card"],
  [class*="_card"]
) {
  transition:
    transform .24s cubic-bezier(.2,.75,.25,1),
    box-shadow .24s ease,
    border-color .24s ease,
    background-color .24s ease;
}

@media (hover: hover) and (pointer: fine) {
  .students :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .students :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .students :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .students :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.students :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.students :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.students :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.students ::selection {
  color: #ffffff;
  background: #9f1945;
}

@keyframes amvViewEnter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .students,
  .students *,
  .students *::before,
  .students *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}


/* =========================================================
   STUDENTS Â· DIRECTORIO ACADÃ‰MICO V10
========================================================= */
.students-context-nav {
  position: sticky;
  top: 14px;
  z-index: 30;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 7px;
  margin: 0 0 26px;
  padding: 7px;
  border: 1px solid #dbe3ec;
  border-radius: 18px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 14px 36px rgba(20,32,51,.08);
  backdrop-filter: blur(16px);
}

.students-context-nav button {
  min-height: 58px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 0;
  border-radius: 13px;
  padding: 10px 14px;
  color: #536176;
  background: transparent;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  transition: .2s ease;
}

.students-context-nav button > span {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 8px;
  color: #7a8798;
  background: #f2f5f8;
  font-size: 10px;
}

.students-context-nav button > small {
  padding: 3px 7px;
  border-radius: 999px;
  color: #667085;
  background: #f2f5f8;
  font-size: 11px;
}

.students-context-nav button:hover {
  transform: translateY(-1px);
  color: #9f1945;
  background: #faf7f8;
}

.students-context-nav button.is-active {
  color: #fff;
  background: #9f1945;
  box-shadow: 0 9px 22px rgba(159,25,69,.20);
}

.students-context-nav button.is-active > span,
.students-context-nav button.is-active > small {
  color: #fff;
  background: rgba(255,255,255,.16);
}

.students-overview,
.students-voices-panel {
  margin-bottom: 28px;
  padding: clamp(22px,3vw,32px);
  border: 1px solid #dbe3ec;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 16px 44px rgba(20,32,51,.07);
  animation: studentsPanelIn .35s cubic-bezier(.2,.75,.25,1);
}

.students-overview__header,
.students-voices-panel > header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 21px;
  border-bottom: 1px solid #e5eaf0;
}

.students-overview__header span,
.students-voices-panel > header span {
  color: #9f1945;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .12em;
}

.students-overview__header h2,
.students-voices-panel > header h2 {
  margin: 6px 0;
  color: #172033;
  font-size: clamp(24px,3vw,34px);
}

.students-overview__header p,
.students-voices-panel > header p {
  max-width: 680px;
  margin: 0;
  color: #667085;
  line-height: 1.6;
}

.students-overview__header button {
  min-height: 44px;
  padding: 0 17px;
  border: 1px solid #9f1945;
  border-radius: 12px;
  color: #fff;
  background: #9f1945;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.students-overview__actions {
  display: grid;
  grid-template-columns: repeat(3,minmax(0,1fr));
  gap: 15px;
  margin-top: 22px;
}

.students-overview__actions button {
  min-height: 174px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 21px;
  border: 1px solid #dbe3ec;
  border-radius: 18px;
  color: #172033;
  background: #f8fafc;
  text-align: left;
  cursor: pointer;
  transition: .22s ease;
}

.students-overview__actions button:hover {
  transform: translateY(-3px);
  border-color: rgba(159,25,69,.28);
  background: #fff;
  box-shadow: 0 13px 28px rgba(20,32,51,.08);
}

.students-overview__actions span {
  color: #9f1945;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: .1em;
}

.students-overview__actions strong {
  margin: 10px 0 4px;
  font-size: 36px;
}

.students-overview__actions small {
  color: #667085;
}

.students-overview__actions b {
  margin-top: auto;
  padding-top: 18px;
  color: #9f1945;
  font-size: 13px;
}

.students-voices-grid {
  display: grid;
  grid-template-columns: repeat(5,minmax(0,1fr));
  gap: 13px;
  margin-top: 22px;
}

.students-voices-grid button {
  min-height: 145px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 5px;
  border: 1px solid #dbe3ec;
  border-radius: 18px;
  color: #172033;
  background: #f8fafc;
  cursor: pointer;
  transition: .2s ease;
}

.students-voices-grid button:hover {
  transform: translateY(-3px);
  border-color: rgba(159,25,69,.3);
  background: #fff;
}

.students-voices-grid button > span {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  color: #9f1945;
  background: #fff0f5;
  font-weight: 900;
}

.students-voices-grid button > strong {
  color: #172033;
  font-size: 26px;
}

.students-voices-grid button > small {
  color: #667085;
}

.students-voices-grid button.is-pending > span {
  color: #8b6a12;
  background: #fff8e7;
}

.students-directory-panel {
  animation: studentsPanelIn .35s cubic-bezier(.2,.75,.25,1);
}

/* Light-first overrides para esta vista del SaaS */
.students .students__summary article,
.students .students-toolbar,
.students .students__info,
.students .student-card,
.students .students-empty,
.students .students-no-results,
.students .students-state {
  color: #172033;
  background: #fff;
  border-color: #dbe3ec;
}

.students .students-search input {
  color: #172033;
  background: #f8fafc;
  border-color: #dbe3ec;
}

.students .student-card:hover {
  background: #fff;
  border-color: rgba(159,25,69,.32);
  box-shadow: 0 13px 28px rgba(20,32,51,.08);
}

.students .student-card__details {
  background: #f8fafc;
  border-color: #e5eaf0;
}

.students .student-card__main-action {
  color: #9f1945;
  border-color: rgba(159,25,69,.25);
  background: #fff0f5;
}

.students .student-card__avatar {
  color: #9f1945;
  border-color: rgba(159,25,69,.25);
  background: #fff0f5;
}

@keyframes studentsPanelIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 900px) {
  .students-context-nav {
    grid-template-columns: none;
    grid-auto-flow: column;
    grid-auto-columns: minmax(155px,1fr);
    overflow-x: auto;
  }

  .students-overview__header {
    flex-direction: column;
  }

  .students-overview__actions,
  .students-voices-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .students-context-nav button,
  .students-overview,
  .students-voices-panel,
  .students-directory-panel {
    animation: none !important;
    transition: none !important;
  }
}

</style>


<style lang="scss" scoped>
.students .student-card__edit { color:#8d6c08; background:#fffaf0; border-color:#ebd38a; }
.students .student-card__edit:hover:not(:disabled) { color:#6f5200; background:#fff5dc; }
.students .students-edit-modal { border-color:#e2cf8d; background:linear-gradient(145deg,#fff,#fffaf1); }
.students .students-modal__icon--edit { color:#997100; background:#fff5d9; box-shadow:0 12px 26px rgba(217,169,29,.12); }
.students .student-edit-form { display:grid; gap:14px; }
.students .student-edit-form > label:not(.student-edit-switch) { display:grid; gap:7px; }
.students .student-edit-form > label > span { color:#455366; font-size:.72rem; font-weight:850; }
.students .student-edit-form input[type="text"],
.students .student-edit-form select { width:100%; min-height:46px; padding:0 12px; border:1px solid #dce3eb; border-radius:11px; background:#fff; color:#172033; outline:none; }
.students .student-edit-form input[type="text"]:focus,
.students .student-edit-form select:focus { border-color:#c39a24; box-shadow:0 0 0 3px rgba(195,154,36,.1); }
.students .student-edit-switch { display:flex; gap:11px; align-items:center; padding:13px 14px; border:1px solid #e5ebf1; border-radius:12px; background:#f8fafc; }
.students .student-edit-switch input { width:18px; height:18px; accent-color:#9f1945; }
.students .student-edit-switch strong,.students .student-edit-switch small { display:block; }
.students .student-edit-switch strong { color:#263449; font-size:.73rem; }
.students .student-edit-switch small { margin-top:3px; color:#7b8798; font-size:.62rem; }
.students .modal-button--edit { border:0; background:#9f1945; color:#fff; box-shadow:0 9px 22px rgba(159,25,69,.16); }


/* =========================================================
   DIRECTORIO SIMPLE Â· LISTA VERTICAL
   Sin dependencias de variables.scss.
========================================================= */
.students-directory-panel {
  width: 100%;
}

.students-directory__header {
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 14px;
}

.students-directory__header p {
  margin-bottom: 4px;
}

.students-directory__header h2 {
  font-size: clamp(1.35rem, 2vw, 1.8rem);
}

.student-grid {
  display: flex !important;
  flex-direction: column !important;
  gap: 10px !important;
  width: 100%;
}

.student-card {
  display: block;
  width: 100%;
  min-height: 78px;
  border: 1px solid #dbe3ec !important;
  border-radius: 14px !important;
  background: #fff !important;
  box-shadow: 0 5px 18px rgba(20,32,51,.045) !important;
  cursor: pointer;
  outline: none;
  transition: border-color .18s ease, box-shadow .18s ease, transform .18s ease !important;
}

.student-card:hover,
.student-card:focus-visible {
  border-color: rgba(159,25,69,.28) !important;
  box-shadow: 0 9px 24px rgba(20,32,51,.08) !important;
  transform: translateY(-1px) !important;
}

.student-card__header {
  min-height: 76px;
  padding: 12px 14px !important;
  gap: 13px !important;
}

.student-card__avatar {
  width: 46px !important;
  height: 46px !important;
  font-size: .78rem !important;
}

.student-card__identity {
  display: grid;
  align-content: center;
  gap: 2px;
}

.student-card__voice {
  margin: 0 !important;
  font-size: .66rem !important;
}

.student-card__identity h3 {
  font-size: .98rem !important;
  line-height: 1.25;
}

.student-card__status {
  margin-top: 1px !important;
  font-size: .68rem !important;
}

.student-card__profile-arrow {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 10px;
  text-decoration: none;
  color: #9f1945 !important;
  background: #fff0f5 !important;
}

.student-card__details,
.student-card__main-action {
  display: none !important;
}

.student-card__admin {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 0 14px 11px 73px !important;
  border: 0 !important;
}

.student-card__admin button {
  min-height: 30px;
  padding: 0 9px;
  border-radius: 8px;
  font-size: .67rem;
}

@media (max-width: 600px) {
  .students__header {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }

  .students__header h1 {
    font-size: 2.4rem;
  }

  .students__primary-action {
    width: 100%;
  }

  .students-directory__header {
    align-items: flex-start;
  }

  .student-card__header {
    min-height: 70px;
    padding: 10px 11px !important;
  }

  .student-card__avatar {
    width: 42px !important;
    height: 42px !important;
  }

  .student-card__admin {
    padding: 0 11px 10px 64px !important;
  }

  .student-card__admin button {
    flex: 1 1 auto;
  }
}
</style>


<style lang="scss" scoped>
/* =========================================================
   AMV Â· KAHOOT-INSPIRED MICROINTERACTIONS
   Visual only: no template/script/backend changes.
========================================================= */

.student-card {
  position: relative;
  cursor: pointer;
  isolation: isolate;
  will-change: transform;
  animation: amv-student-card-in 0.52s cubic-bezier(0.22, 1, 0.36, 1) both;
  box-shadow:
    0 8px 24px rgba(23, 32, 51, 0.055),
    0 1px 2px rgba(23, 32, 51, 0.04) !important;
}

.student-card::before {
  content: "";
  position: absolute;
  inset: 0 auto auto 0;
  width: 100%;
  height: 3px;
  z-index: 2;
  transform: scaleX(0);
  transform-origin: left center;
  background: linear-gradient(90deg, #c99424, #e6c45f, #9f1d4a);
  transition: transform 0.32s cubic-bezier(0.22, 1, 0.36, 1);
}

.student-card::after {
  content: "";
  position: absolute;
  top: -80%;
  left: -45%;
  width: 28%;
  height: 260%;
  z-index: 1;
  pointer-events: none;
  transform: rotate(18deg) translateX(-180%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.34),
    transparent
  );
  transition: transform 0.7s ease;
}

.student-card:hover {
  transform: translateY(-5px) scale(1.002);
  border-color: #e2bd55 !important;
  box-shadow:
    0 18px 38px rgba(23, 32, 51, 0.11),
    0 0 0 1px rgba(201, 148, 36, 0.08) !important;
}

.student-card:hover::before {
  transform: scaleX(1);
}

.student-card:hover::after {
  transform: rotate(18deg) translateX(560%);
}

.student-card:active {
  transform: translateY(-1px) scale(0.998);
  transition-duration: 0.08s;
}

.student-card:focus-visible {
  outline: 3px solid rgba(201, 148, 36, 0.28);
  outline-offset: 3px;
}

.student-card__avatar {
  position: relative;
  transition:
    transform 0.3s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.3s ease,
    background-color 0.3s ease;
}

.student-card:hover .student-card__avatar {
  transform: scale(1.08) rotate(-2deg);
  box-shadow: 0 8px 18px rgba(201, 148, 36, 0.14);
  background: #fff7df !important;
}

.student-card__status > span {
  animation: amv-status-pulse 2.2s ease-in-out infinite;
}

.student-card__profile-arrow {
  transition:
    transform 0.28s cubic-bezier(0.22, 1, 0.36, 1),
    background-color 0.25s ease,
    border-color 0.25s ease,
    color 0.25s ease,
    box-shadow 0.25s ease;
}

.student-card:hover .student-card__profile-arrow {
  transform: translateX(5px);
  border-color: #d7ae42;
  color: #9f1d4a;
  background: #fff8e6;
  box-shadow: 0 5px 14px rgba(201, 148, 36, 0.14);
}

.student-card__admin button {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.student-card__admin button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(23, 32, 51, 0.08);
}

.student-card__admin button:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}

.students__primary-action {
  position: relative;
  overflow: hidden;
}

.students__primary-action::after {
  content: "";
  position: absolute;
  inset: 0;
  transform: translateX(-110%);
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.38),
    transparent
  );
  transition: transform 0.55s ease;
}

.students__primary-action:hover::after {
  transform: translateX(110%);
}

.voice-filters button {
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.voice-filters button:hover {
  transform: translateY(-2px);
}

.voice-filters button:active {
  transform: translateY(0) scale(0.97);
}

.voice-filters button.active,
.voice-filters button[aria-pressed="true"] {
  box-shadow: 0 5px 14px rgba(201, 148, 36, 0.12);
}

.students-search input {
  transition:
    border-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.25s ease;
}

.students-search input:focus {
  transform: translateY(-1px);
}

@keyframes amv-student-card-in {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes amv-status-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 0.78;
  }

  50% {
    transform: scale(1.28);
    opacity: 1;
  }
}

.student-card:nth-child(1) { animation-delay: 0.02s; }
.student-card:nth-child(2) { animation-delay: 0.05s; }
.student-card:nth-child(3) { animation-delay: 0.08s; }
.student-card:nth-child(4) { animation-delay: 0.11s; }
.student-card:nth-child(5) { animation-delay: 0.14s; }
.student-card:nth-child(6) { animation-delay: 0.17s; }
.student-card:nth-child(7) { animation-delay: 0.20s; }
.student-card:nth-child(8) { animation-delay: 0.23s; }
.student-card:nth-child(9) { animation-delay: 0.26s; }
.student-card:nth-child(10) { animation-delay: 0.29s; }
.student-card:nth-child(11) { animation-delay: 0.32s; }
.student-card:nth-child(12) { animation-delay: 0.35s; }

@media (prefers-reduced-motion: reduce) {
  .student-card,
  .student-card__avatar,
  .student-card__profile-arrow,
  .student-card__admin button,
  .voice-filters button,
  .students-search input {
    animation: none !important;
    transition: none !important;
  }

  .student-card::after,
  .students__primary-action::after {
    display: none;
  }
}
</style>

