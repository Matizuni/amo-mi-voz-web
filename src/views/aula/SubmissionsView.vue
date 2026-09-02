<template>
  <section class="submissions">

    <RouterLink
      :to="`/aula/clase/${lessonId}/tarea/${taskId}`"
      class="submissions__back"
    >
      ← Volver a la tarea
    </RouterLink>

    <!-- =====================================================
         CARGA
    ====================================================== -->

    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="loading-spinner"></div>

      <h1>
        Cargando entregas...
      </h1>

      <p>
        Sincronizando estudiantes,
        tarea y archivos desde Supabase.
      </p>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->

    <section
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <div class="state-card__icon">
        !
      </div>

      <h1>
        No pudimos cargar las entregas
      </h1>

      <p>
        {{ loadError }}
      </p>

      <div class="state-card__actions">

        <button
          type="button"
          @click="loadPage"
        >
          Reintentar
        </button>

        <RouterLink
          :to="`/aula/clase/${lessonId}/tarea/${taskId}`"
        >
          Volver
        </RouterLink>

      </div>
    </section>

    <!-- =====================================================
         CONTENIDO
    ====================================================== -->

    <template v-else-if="task">

      <!-- HERO -->

      <header class="submissions__hero">

        <div>

          <div class="submissions__eyebrow">
            <span>
              CLASE {{ lessonId }}
            </span>

            <span>
              ENTREGAS
            </span>

            <span>
              SUPABASE
            </span>
          </div>

          <h1>
            {{ task.title }}
          </h1>

          <p>
            Revisa el progreso de los estudiantes,
            abre sus archivos privados y accede a
            la evaluación individual.
          </p>

        </div>

        <aside class="submissions__hero-status">

          <span>
            PROGRESO
          </span>

          <strong>
            {{ deliveryPercentage }}%
          </strong>

          <small>
            {{ deliveredStudentCount }}
            de
            {{ students.length }}
            entregas
          </small>

        </aside>

      </header>

      <!-- ===================================================
           RESUMEN
      ==================================================== -->

      <section class="submissions__summary">

        <article>
          <span>
            ESTUDIANTES
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
            ENTREGADAS
          </span>

          <strong>
            {{ deliveredStudentCount }}
          </strong>

          <small>
            estudiantes con entrega
          </small>
        </article>

        <article>
          <span>
            PENDIENTES
          </span>

          <strong>
            {{ pendingStudents.length }}
          </strong>

          <small>
            sin entrega
          </small>
        </article>

        <article>
          <span>
            REVISADAS
          </span>

          <strong>
            {{ reviewedCount }}
          </strong>

          <small>
            con evaluación
          </small>
        </article>

        <article>
          <span>
            SIN REVISAR
          </span>

          <strong>
            {{ pendingReviewCount }}
          </strong>

          <small>
            requieren atención
          </small>
        </article>

        <article>
          <span>
            PUNTAJE
          </span>

          <strong>
            {{ task.points ?? 100 }}
          </strong>

          <small>
            máximo
          </small>
        </article>

      </section>

      <!-- ===================================================
           PROGRESO
      ==================================================== -->

      <section class="progress-card">

        <div class="progress-card__header">

          <div>
            <span>
              PROGRESO GENERAL
            </span>

            <strong>
              {{ deliveredStudentCount }}
              /
              {{ students.length }}
            </strong>
          </div>

          <strong>
            {{ deliveryPercentage }}%
          </strong>

        </div>

        <div class="progress-card__bar">
          <div
            class="progress-card__fill"
            :style="{
              width: `${deliveryPercentage}%`
            }"
          ></div>
        </div>

      </section>

      <!-- ===================================================
           FILTROS
      ==================================================== -->

      <section class="submissions__toolbar">

        <div class="submissions__filters">

          <button
            type="button"
            :class="{
              active:
                activeFilter === 'all'
            }"
            @click="activeFilter = 'all'"
          >
            Todos

            <span>
              {{ students.length }}
            </span>
          </button>

          <button
            type="button"
            :class="{
              active:
                activeFilter === 'delivered'
            }"
            @click="
              activeFilter = 'delivered'
            "
          >
            Entregadas

            <span>
              {{ deliveredStudentCount }}
            </span>
          </button>

          <button
            type="button"
            :class="{
              active:
                activeFilter === 'pending'
            }"
            @click="
              activeFilter = 'pending'
            "
          >
            Pendientes

            <span>
              {{ pendingStudents.length }}
            </span>
          </button>

          <button
            type="button"
            :class="{
              active:
                activeFilter === 'reviewed'
            }"
            @click="
              activeFilter = 'reviewed'
            "
          >
            Revisadas

            <span>
              {{ reviewedCount }}
            </span>
          </button>

          <button
            type="button"
            :class="{
              active:
                activeFilter === 'unreviewed'
            }"
            @click="
              activeFilter = 'unreviewed'
            "
          >
            Sin revisar

            <span>
              {{ pendingReviewCount }}
            </span>
          </button>

        </div>

        <div class="submissions__search">

          <input
            v-model.trim="searchTerm"
            type="search"
            placeholder="Buscar estudiante..."
          >

        </div>

      </section>

      <!-- ===================================================
           LISTADO
      ==================================================== -->

      <section class="student-list">

        <article
          v-for="student in filteredStudents"
          :key="student.id"
          class="student-row"
          :class="{
            'student-row--delivered':
              getSubmission(student.id),

            'student-row--reviewed':
              isReviewed(student.id)
          }"
        >

          <!-- IDENTIDAD -->

          <div class="student-row__identity">

            <div class="student-avatar">
              {{
                getInitials(
                  student.name
                )
              }}
            </div>

            <div>
              <span>
                {{
                  student.voice ||
                  'Voz no definida'
                }}
              </span>

              <strong>
                {{ student.name }}
              </strong>
            </div>

          </div>

          <!-- ESTADO -->

          <div class="student-row__status">

            <template
              v-if="getSubmission(student.id)"
            >

              <span
                class="status-pill"
                :class="{
                  'status-pill--reviewed':
                    isReviewed(
                      student.id
                    )
                }"
              >
                {{
                  isReviewed(student.id)
                    ? 'REVISADA'
                    : 'ENTREGADA'
                }}
              </span>

              <small>
                {{
                  formatDateTime(
                    getSubmission(
                      student.id
                    ).submittedAt
                  )
                }}
              </small>

            </template>

            <template v-else>

              <span
                class="
                  status-pill
                  status-pill--pending
                "
              >
                PENDIENTE
              </span>

              <small>
                Sin archivo
              </small>

            </template>

          </div>

          <!-- ARCHIVO -->

          <div class="student-row__file">

            <template
              v-if="getSubmission(student.id)"
            >

              <strong>
                {{
                  getSubmission(
                    student.id
                  ).fileName ||
                  'Archivo'
                }}
              </strong>

              <small>
                {{
                  formatFileSize(
                    getSubmission(
                      student.id
                    ).fileSize
                  )
                }}
              </small>

            </template>

            <template v-else>
              <span>
                —
              </span>

              <small>
                Sin entrega
              </small>
            </template>

          </div>

          <!-- NOTA -->

          <div class="student-row__grade">

            <span>
              NOTA
            </span>

            <strong>
              {{
                hasGrade(
                  getSubmission(
                    student.id
                  )
                )
                  ? formatGrade(
                      getSubmission(
                        student.id
                      ).grade
                    )
                  : '—'
              }}
            </strong>

          </div>

          <!-- ACCIONES -->

          <div class="student-row__actions">

            <button
              v-if="getSubmission(student.id)"
              type="button"
              :disabled="
                openingSubmissionId ===
                getSubmission(student.id).id
              "
              @click="
                openFile(
                  getSubmission(student.id)
                )
              "
            >
              {{
                openingSubmissionId ===
                getSubmission(student.id).id
                  ? 'Abriendo...'
                  : 'Ver archivo'
              }}
            </button>

            <RouterLink
              v-if="getSubmission(student.id)"
              :to="
                `/aula/clase/${lessonId}/tarea/${taskId}/entregas/${getSubmission(student.id).id}`
              "
              class="student-row__review"
            >
              {{
                isReviewed(student.id)
                  ? 'Ver evaluación'
                  : 'Revisar'
              }}
            </RouterLink>

            <RouterLink
              :to="
                `/aula/estudiante/${student.id}`
              "
              class="student-row__profile"
            >
              Ver perfil
            </RouterLink>

          </div>

        </article>

        <div
          v-if="!filteredStudents.length"
          class="student-list__empty"
        >
          <span>
            i
          </span>

          <div>
            <strong>
              No encontramos estudiantes
            </strong>

            <p>
              Prueba con otro filtro
              o término de búsqueda.
            </p>
          </div>
        </div>

      </section>

      <!-- ===================================================
           PIE
      ==================================================== -->

      <section class="submissions__footer">

        <RouterLink
          :to="
            `/aula/clase/${lessonId}/tarea/${taskId}`
          "
        >
          ← Volver a la tarea
        </RouterLink>

        <RouterLink
          :to="
            `/aula/clase/${lessonId}/trabajo`
          "
        >
          Trabajo de clase →
        </RouterLink>

      </section>

    </template>

  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch
} from 'vue'

import {
  RouterLink,
  useRoute
} from 'vue-router'

import {
  fetchStudents
} from '@/services/studentService'

import {
  fetchAssignmentById
} from '@/services/assignmentService'

import {
  createSubmissionSignedUrl,
  fetchSubmissionsByAssignment
} from '@/services/submissionService'

/* =========================================================
   ROUTE
========================================================= */

const route = useRoute()

const lessonId = computed(() =>
  Number(
    route.params.id
  )
)

const taskId = computed(() =>
  Number(
    route.params.taskId
  )
)

/* =========================================================
   DATOS
========================================================= */

const task = ref(null)

const students = ref([])

const submissions = ref([])

const isLoading = ref(true)

const loadError = ref('')

const activeFilter = ref('all')

const searchTerm = ref('')

const openingSubmissionId =
  ref(null)

/* =========================================================
   CARGAR PÁGINA
========================================================= */

const loadPage = async () => {
  isLoading.value = true

  loadError.value = ''

  try {
    const [
      loadedStudents,
      loadedTask,
      loadedSubmissions
    ] = await Promise.all([
      fetchStudents(),

      fetchAssignmentById(
        taskId.value
      ),

      fetchSubmissionsByAssignment(
        taskId.value
      )
    ])

    if (
      !loadedTask ||
      Number(
        loadedTask.lessonId
      ) !==
        Number(
          lessonId.value
        )
    ) {
      throw new Error(
        'La tarea no corresponde a esta clase.'
      )
    }

    students.value =
      sortStudents(
        loadedStudents || []
      )

    task.value =
      loadedTask

    submissions.value =
      loadedSubmissions || []

  } catch (error) {
    console.error(
      'Error cargando entregas:',
      error
    )

    students.value = []

    task.value = null

    submissions.value = []

    loadError.value =
      error?.message ||
      'No se pudieron cargar las entregas desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   ORDEN DE ESTUDIANTES
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
        voiceOrder[a.voice] ||
        99

      const voiceB =
        voiceOrder[b.voice] ||
        99

      if (
        voiceA !== voiceB
      ) {
        return (
          voiceA -
          voiceB
        )
      }

      return String(
        a.name || ''
      ).localeCompare(
        String(
          b.name || ''
        ),
        'es'
      )
    }
  )

/* =========================================================
   MAPA DE ENTREGAS
========================================================= */

const submissionMap =
  computed(() => {
    const map =
      new Map()

    submissions.value.forEach(
      submission => {
        map.set(
          Number(
            submission.studentId
          ),
          submission
        )
      }
    )

    return map
  })

const getSubmission =
  studentId =>
    submissionMap.value.get(
      Number(studentId)
    ) || null

/* =========================================================
   ALUMNOS CON ENTREGA
========================================================= */

const deliveredStudents =
  computed(() =>
    students.value.filter(
      student =>
        Boolean(
          getSubmission(
            student.id
          )
        )
    )
  )

const deliveredStudentCount =
  computed(() =>
    deliveredStudents.value.length
  )

/* =========================================================
   PENDIENTES
========================================================= */

const pendingStudents =
  computed(() =>
    students.value.filter(
      student =>
        !getSubmission(
          student.id
        )
    )
  )

/* =========================================================
   REVISADAS
========================================================= */

const isReviewed = studentId => {
  const submission =
    getSubmission(
      studentId
    )

  if (!submission) {
    return false
  }

  return Boolean(
    submission.status ===
      'reviewed' ||
    submission.status ===
      'returned' ||
    submission.reviewedAt ||
    hasGrade(submission)
  )
}

const reviewedCount =
  computed(() =>
    students.value.filter(
      student =>
        isReviewed(
          student.id
        )
    ).length
  )

/* =========================================================
   SIN REVISAR
========================================================= */

const pendingReviewCount =
  computed(() =>
    students.value.filter(
      student => {
        const submission =
          getSubmission(
            student.id
          )

        return (
          Boolean(submission) &&
          !isReviewed(
            student.id
          )
        )
      }
    ).length
  )

/* =========================================================
   PORCENTAJE
========================================================= */

const deliveryPercentage =
  computed(() => {
    if (
      !students.value.length
    ) {
      return 0
    }

    return Math.round(
      (
        deliveredStudentCount.value /
        students.value.length
      ) * 100
    )
  })

/* =========================================================
   NOTAS
========================================================= */

const hasGrade = submission => {
  if (!submission) {
    return false
  }

  if (
    submission.grade === null ||
    submission.grade ===
      undefined ||
    submission.grade === ''
  ) {
    return false
  }

  return Number.isFinite(
    Number(
      submission.grade
    )
  )
}

const formatGrade = value => {
  const grade =
    Number(value)

  if (
    !Number.isFinite(
      grade
    )
  ) {
    return '—'
  }

  return grade.toFixed(1)
}

/* =========================================================
   FILTROS
========================================================= */

const filteredStudents =
  computed(() => {
    const term =
      searchTerm.value
        .trim()
        .toLowerCase()

    return students.value.filter(
      student => {
        const submission =
          getSubmission(
            student.id
          )

        const matchesSearch =
          !term ||
          String(
            student.name || ''
          )
            .toLowerCase()
            .includes(term) ||
          String(
            student.voice || ''
          )
            .toLowerCase()
            .includes(term)

        if (!matchesSearch) {
          return false
        }

        if (
          activeFilter.value ===
          'delivered'
        ) {
          return Boolean(
            submission
          )
        }

        if (
          activeFilter.value ===
          'pending'
        ) {
          return !submission
        }

        if (
          activeFilter.value ===
          'reviewed'
        ) {
          return isReviewed(
            student.id
          )
        }

        if (
          activeFilter.value ===
          'unreviewed'
        ) {
          return (
            Boolean(
              submission
            ) &&
            !isReviewed(
              student.id
            )
          )
        }

        return true
      }
    )
  })

/* =========================================================
   ABRIR ARCHIVO PRIVADO
========================================================= */

const openFile = async submission => {
  if (
    !submission?.storagePath ||
    openingSubmissionId.value
  ) {
    return
  }

  openingSubmissionId.value =
    submission.id

  try {
    const signedUrl =
      await createSubmissionSignedUrl(
        submission.storagePath,
        3600
      )

    if (!signedUrl) {
      throw new Error(
        'No se pudo generar el enlace temporal.'
      )
    }

    window.open(
      signedUrl,
      '_blank',
      'noopener,noreferrer'
    )

  } catch (error) {
    console.error(
      'Error abriendo entrega:',
      error
    )

    window.alert(
      error?.message ||
      'No se pudo abrir el archivo.'
    )

  } finally {
    openingSubmissionId.value =
      null
  }
}

/* =========================================================
   INICIALES
========================================================= */

const getInitials = name =>
  String(
    name || '?'
  )
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(
      part =>
        part
          .charAt(0)
          .toUpperCase()
    )
    .join('')

/* =========================================================
   FECHA
========================================================= */

const formatDateTime = value => {
  if (!value) {
    return 'Sin fecha'
  }

  const date =
    new Date(value)

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      dateStyle:
        'medium',

      timeStyle:
        'short'
    }
  ).format(date)
}

/* =========================================================
   TAMAÑO
========================================================= */

const formatFileSize = bytes => {
  const value =
    Number(bytes)

  if (
    !Number.isFinite(value) ||
    value <= 0
  ) {
    return '0 B'
  }

  if (
    value < 1024
  ) {
    return `${value} B`
  }

  if (
    value <
    1024 * 1024
  ) {
    return `${(
      value /
      1024
    ).toFixed(1)} KB`
  }

  return `${(
    value /
    (1024 * 1024)
  ).toFixed(1)} MB`
}

/* =========================================================
   CAMBIO DE RUTA
========================================================= */

watch(
  () => [
    route.params.id,
    route.params.taskId
  ],

  () => {
    activeFilter.value =
      'all'

    searchTerm.value =
      ''

    loadPage()
  }
)

/* =========================================================
   INICIO
========================================================= */

onMounted(
  loadPage
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.submissions {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.submissions__back {
  display: inline-block;
  margin-bottom:
    variables.$spacing-xl;
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
}

.submissions__back:hover {
  opacity: 0.8;
}

/* =========================================================
   HERO
========================================================= */

.submissions__hero {
  display: flex;
  gap:
    variables.$spacing-2xl;
  align-items: flex-end;
  justify-content:
    space-between;
  margin-bottom:
    variables.$spacing-xl;
  padding:
    variables.$spacing-3xl;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    radial-gradient(
      circle at 88% 12%,
      rgba(
        variables.$color-primary,
        0.18
      ),
      transparent 36%
    ),
    variables.$color-surface;
}

.submissions__hero > div:first-child {
  max-width: 900px;
}

.submissions__eyebrow {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-bottom:
    variables.$spacing-md;
}

.submissions__eyebrow span {
  padding: 5px 9px;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 999px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

.submissions__hero h1 {
  margin:
    0 0
    variables.$spacing-md;
  font-size:
    clamp(
      3rem,
      6vw,
      5rem
    );
}

.submissions__hero p {
  max-width: 760px;
  margin: 0;
  line-height: 1.7;
  opacity: 0.68;
}

.submissions__hero-status {
  min-width: 200px;
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
}

.submissions__hero-status span,
.submissions__hero-status strong,
.submissions__hero-status small {
  display: block;
}

.submissions__hero-status span {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

.submissions__hero-status strong {
  margin:
    variables.$spacing-sm
    0;
  color:
    variables.$color-primary;
  font-size: 2.4rem;
}

.submissions__hero-status small {
  opacity: 0.5;
}

/* =========================================================
   RESUMEN
========================================================= */

.submissions__summary {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    repeat(
      6,
      minmax(0, 1fr)
    );
  margin-bottom:
    variables.$spacing-xl;
}

.submissions__summary article {
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.submissions__summary span,
.submissions__summary strong,
.submissions__summary small {
  display: block;
}

.submissions__summary span {
  margin-bottom:
    variables.$spacing-sm;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

.submissions__summary strong {
  font-size: 1.8rem;
}

.submissions__summary small {
  margin-top: 4px;
  opacity: 0.42;
}

/* =========================================================
   PROGRESO
========================================================= */

.progress-card {
  margin-bottom:
    variables.$spacing-xl;
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
}

.progress-card__header {
  display: flex;
  gap:
    variables.$spacing-lg;
  align-items: center;
  justify-content:
    space-between;
  margin-bottom:
    variables.$spacing-md;
}

.progress-card__header span,
.progress-card__header strong {
  display: block;
}

.progress-card__header span {
  margin-bottom: 4px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

.progress-card__header > strong {
  color:
    variables.$color-primary;
  font-size: 1.5rem;
}

.progress-card__bar {
  overflow: hidden;
  height: 9px;
  border-radius: 999px;
  background:
    variables.$color-background;
}

.progress-card__fill {
  height: 100%;
  border-radius: inherit;
  background:
    variables.$color-primary;
  transition:
    width 0.3s ease;
}

/* =========================================================
   TOOLBAR
========================================================= */

.submissions__toolbar {
  display: flex;
  gap:
    variables.$spacing-lg;
  align-items: center;
  justify-content:
    space-between;
  margin-bottom:
    variables.$spacing-lg;
}

.submissions__filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.submissions__filters button {
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 8px 11px;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  background:
    variables.$color-surface;
  color:
    variables.$color-white;
  font: inherit;
  font-size:
    variables.$font-size-sm;
  cursor: pointer;
}

.submissions__filters button:hover {
  border-color:
    variables.$color-primary;
}

.submissions__filters button.active {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
}

.submissions__filters button span {
  display: grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 999px;
  background:
    variables.$color-background;
  font-size:
    variables.$font-size-xs;
}

.submissions__search input {
  min-width: 260px;
  padding: 10px 12px;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  outline: 0;
  background:
    variables.$color-surface;
  color:
    variables.$color-white;
  font: inherit;
}

.submissions__search input:focus {
  border-color:
    variables.$color-primary;
}

/* =========================================================
   LISTADO
========================================================= */

.student-list {
  display: grid;
  gap:
    variables.$spacing-sm;
}

.student-row {
  display: grid;
  gap:
    variables.$spacing-md;
  align-items: center;
  grid-template-columns:
    minmax(220px, 1.4fr)
    minmax(135px, 0.8fr)
    minmax(180px, 1fr)
    80px
    minmax(230px, auto);
  padding:
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-surface;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
}

.student-row--delivered {
  border-color:
    rgba(
      variables.$color-primary,
      0.55
    );
}

.student-row--reviewed {
  background:
    linear-gradient(
      90deg,
      rgba(
        variables.$color-primary,
        0.06
      ),
      transparent 35%
    ),
    variables.$color-surface;
}

/* =========================================================
   IDENTIDAD
========================================================= */

.student-row__identity {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
}

.student-avatar {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-semibold;
}

.student-row__identity span,
.student-row__identity strong {
  display: block;
}

.student-row__identity span {
  margin-bottom: 3px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

/* =========================================================
   STATUS / FILE
========================================================= */

.student-row__status,
.student-row__file,
.student-row__grade {
  min-width: 0;
}

.student-row__status small,
.student-row__file small {
  display: block;
  margin-top: 5px;
  font-size:
    variables.$font-size-xs;
  opacity: 0.42;
}

.student-row__file strong {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-pill {
  display: inline-block;
  padding: 5px 8px;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 999px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

.status-pill--reviewed {
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

.status-pill--pending {
  border-color:
    variables.$color-border;
  color:
    variables.$color-white;
  opacity: 0.48;
}

/* =========================================================
   NOTA
========================================================= */

.student-row__grade span,
.student-row__grade strong {
  display: block;
}

.student-row__grade span {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

.student-row__grade strong {
  margin-top: 4px;
  font-size: 1.25rem;
}

/* =========================================================
   ACCIONES
========================================================= */

.student-row__actions {
  display: flex;
  gap: 7px;
  justify-content:
    flex-end;
  flex-wrap: wrap;
}

.student-row__actions button,
.student-row__review,
.student-row__profile {
  padding: 8px 10px;
  border-radius:
    variables.$radius-lg;
  font: inherit;
  font-size:
    variables.$font-size-xs;
  font-weight:
    variables.$font-weight-semibold;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}

.student-row__actions button {
  border:
    1px solid
    variables.$color-border;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
}

.student-row__actions button:disabled {
  opacity: 0.4;
  cursor: default;
}

.student-row__review {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
}

.student-row__profile {
  border:
    1px solid
    variables.$color-border;
  color:
    variables.$color-white;
}

/* =========================================================
   VACÍO
========================================================= */

.student-list__empty {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  padding:
    variables.$spacing-xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
}

.student-list__empty > span {
  display: grid;
  width: 42px;
  height: 42px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.student-list__empty p {
  margin:
    4px 0 0;
  opacity: 0.5;
}

/* =========================================================
   FOOTER
========================================================= */

.submissions__footer {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  justify-content:
    space-between;
  margin-top:
    variables.$spacing-xl;
  padding-top:
    variables.$spacing-xl;
  border-top:
    1px solid
    variables.$color-border;
}

.submissions__footer a {
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
}

/* =========================================================
   STATE
========================================================= */

.state-card {
  display: grid;
  min-height: 420px;
  gap:
    variables.$spacing-md;
  place-items: center;
  align-content: center;
  padding:
    variables.$spacing-3xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  text-align: center;
}

.state-card p {
  margin: 0;
  opacity: 0.55;
}

.state-card__icon {
  display: grid;
  width: 64px;
  height: 64px;
  place-items: center;
  border-radius: 50%;
  background: #d85151;
  color:
    variables.$color-white;
  font-size: 2rem;
}

.state-card__actions {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  margin-top:
    variables.$spacing-md;
}

.state-card__actions button,
.state-card__actions a {
  padding:
    variables.$spacing-sm
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background:
    transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1180px) {

  .submissions__summary {
    grid-template-columns:
      repeat(
        3,
        minmax(0, 1fr)
      );
  }

  .student-row {
    grid-template-columns:
      minmax(220px, 1.3fr)
      minmax(140px, 0.8fr)
      minmax(180px, 1fr)
      70px;
  }

  .student-row__actions {
    grid-column:
      1 / -1;
    justify-content:
      flex-start;
  }
}

@media (max-width: 820px) {

  .submissions__hero {
    align-items: stretch;
    flex-direction: column;
    padding:
      variables.$spacing-xl;
  }

  .submissions__hero-status {
    width: 100%;
  }

  .submissions__toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .submissions__search input {
    width: 100%;
    min-width: 0;
  }

  .student-row {
    grid-template-columns:
      1fr 1fr;
  }

  .student-row__identity,
  .student-row__actions {
    grid-column:
      1 / -1;
  }
}

@media (max-width: 600px) {

  .submissions__summary {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .student-row {
    grid-template-columns:
      1fr;
  }

  .student-row__identity,
  .student-row__actions {
    grid-column: auto;
  }

  .student-row__actions {
    flex-direction:
      column;
  }

  .student-row__actions button,
  .student-row__review,
  .student-row__profile {
    width: 100%;
  }

  .submissions__footer {
    align-items:
      stretch;
    flex-direction:
      column;
  }
}
</style>
