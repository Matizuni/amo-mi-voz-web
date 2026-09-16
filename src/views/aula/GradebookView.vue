<template>
  <main class="gradebook">
    <header class="gradebook__hero">
      <div>
        <p class="eyebrow">PROFESOR · AULA VIRTUAL</p>
        <h1>Libro de notas</h1>
        <p class="hero-copy">
          Seguimiento académico integral de tareas, evaluaciones e intentos
          de tus estudiantes.
        </p>
      </div>

      <div class="hero-status">
        <span>Matrícula activa</span>
        <strong>{{ students.length }}</strong>
        <small>estudiantes</small>
      </div>
    </header>

    <section v-if="isLoading" class="state-card">
      <div class="spinner"></div>
      <div>
        <strong>Cargando libro de notas…</strong>
        <p>Sincronizando estudiantes, tareas y evaluaciones desde Supabase.</p>
      </div>
    </section>

    
<section v-else-if="loadError" class="state-card state-card--error">
      <span class="state-icon">!</span>
      <div>
        <h2>No pudimos cargar las calificaciones</h2>
        <p>{{ loadError }}</p>
        <button type="button" class="button button--primary" @click="loadGradebook">
          Reintentar
        </button>
      </div>
    </section>

    <template v-else>
      <!-- =====================================================
           GRADEBOOK V11 · NAVEGACIÓN CONTEXTUAL
      ====================================================== -->
      <section
        v-if="!isLoading && !loadError"
        class="gradebook-context"
      >
        <div class="gradebook-context__heading">
          <div>
            <span>LIBRO DE NOTAS</span>
            <strong>Gestión académica</strong>
          </div>

          <small>
            Trabaja por área sin recorrer todo el libro.
          </small>
        </div>

        <nav
          class="gradebook-context__nav"
          aria-label="Secciones del libro de notas"
        >
          <button
            v-for="tab in gradebookTabs"
            :key="tab.id"
            type="button"
            class="gradebook-context__tab"
            :class="{
              'gradebook-context__tab--active':
                isGradebookTab(tab.id),
            }"
            :aria-current="
              isGradebookTab(tab.id)
                ? 'page'
                : undefined
            "
            @click="selectGradebookTab(tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>
      </section>

      <section
        v-if="!isLoading && !loadError"
        v-show="isGradebookTab('resumen')"
        class="gradebook-overview"
      >
        <header class="gradebook-overview__header">
          <div>
            <span>VISTA GENERAL</span>
            <h2>Estado académico del curso</h2>
          </div>
          <p>
            Accede directamente al área que necesitas revisar
            o gestionar.
          </p>
        </header>

        <div class="gradebook-overview__grid">
          <button type="button" @click="selectGradebookTab('tareas')">
            <span>Tareas</span>
            <strong>{{ assignments.length }}</strong>
            <small>Actividades del curso</small>
          </button>

          <button type="button" @click="selectGradebookTab('evaluaciones')">
            <span>Evaluaciones</span>
            <strong>{{ quizzes.length }}</strong>
            <small>Quiz y pruebas configuradas</small>
          </button>

          <button type="button" @click="selectGradebookTab('estudiantes')">
            <span>Estudiantes</span>
            <strong>{{ students.length }}</strong>
            <small>Seguimiento individual</small>
          </button>

          <button type="button" @click="selectGradebookTab('ponderaciones')">
            <span>Ponderación</span>
            <strong>{{ configuredWeight }}%</strong>
            <small>Distribución académica</small>
          </button>

          <button type="button" @click="selectGradebookTab('estudiantes')">
            <span>Con resultados</span>
            <strong>{{ gradebookEvaluatedStudents }}</strong>
            <small>{{ gradebookPendingStudents }} aún sin resultados</small>
          </button>
        </div>
      </section>


      <section class="summary-grid gradebook-legacy-summary" aria-label="Resumen del libro de notas">
        <article class="metric-card">
          <span>Estudiantes</span>
          <strong>{{ students.length }}</strong>
          <small>matrícula activa</small>
        </article>

        <article class="metric-card">
          <span>Tareas</span>
          <strong>{{ assignments.length }}</strong>
          <small>publicadas</small>
        </article>

        <article class="metric-card">
          <span>Evaluaciones</span>
          <strong>{{ quizzes.length }}</strong>
          <small>quiz y pruebas</small>
        </article>

        <article class="metric-card">
          <span>Intentos</span>
          <strong>{{ finishedQuizAttempts.length }}</strong>
          <small>entregados</small>
        </article>

        <article class="metric-card" :class="{ 'metric-card--alert': pendingManualCount }">
          <span>Por revisar</span>
          <strong>{{ pendingManualCount }}</strong>
          <small>intentos con revisión manual</small>
        </article>
      </section>

      <section class="toolbar gradebook-legacy-toolbar">
        <div class="tabs" role="tablist" aria-label="Tipo de calificación">
          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'tasks'"
            :class="{ 'tab--active': activeTab === 'tasks' }"
            @click="activeTab = 'tasks'"
          >
            <span>Tareas</span>
            <strong>{{ assignments.length }}</strong>
          </button>

          <button
            type="button"
            role="tab"
            :aria-selected="activeTab === 'quizzes'"
            :class="{ 'tab--active': activeTab === 'quizzes' }"
            @click="activeTab = 'quizzes'"
          >
            <span>Evaluaciones / Quiz</span>
            <strong>{{ quizzes.length }}</strong>
            <i v-if="pendingManualCount">{{ pendingManualCount }}</i>
          </button>
        </div>

        <label class="search-box">
          <span class="sr-only">Buscar estudiante</span>
          <span aria-hidden="true">⌕</span>
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Buscar estudiante…"
          />
        </label>
      </section>

      <!-- =====================================================
           TAREAS
      ====================================================== -->
      <section
        v-show="isGradebookTab('tareas')"
        class="workspace"
      >
        <header class="section-heading">
          <div>
            <p class="eyebrow">CALIFICACIÓN DE ACTIVIDADES</p>
            <h2>Tareas</h2>
            <p>
              Consulta entregas, revisiones y notas sin mezclar la escala
              chilena 1–7 con los porcentajes de los quiz.
            </p>
          </div>
        </header>

        <div v-if="!assignments.length" class="empty-card">
          <strong>Aún no hay tareas publicadas.</strong>
          <p>Cuando publiques actividades aparecerán automáticamente aquí.</p>
        </div>

        <div v-else class="table-shell">
          <table class="grade-table">
            <thead>
              <tr>
                <th class="student-column">Estudiante</th>
                <th v-for="assignment in assignments" :key="assignment.id">
                  <span class="column-kicker">Tarea</span>
                  {{ assignment.title }}
                </th>
                <th>Promedio</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="row in filteredTaskRows" :key="row.student.id">
                <th class="student-cell">
                  <RouterLink :to="`/aula/estudiante/${row.student.id}`">
                    <span class="avatar">{{ initials(row.student.name) }}</span>
                    <span>
                      <strong>{{ row.student.name }}</strong>
                      <small>{{ row.student.voice || 'Sin clasificar' }}</small>
                    </span>
                  </RouterLink>
                </th>

                <td v-for="cell in row.cells" :key="cell.assignment.id">
                  <RouterLink
                    v-if="cell.submission"
                    :to="`/aula/clase/${cell.assignment.lessonId}/tarea/${cell.assignment.id}/entregas/${cell.submission.id}`"
                    class="grade-cell"
                  >
                    <strong v-if="hasGrade(cell.submission)">
                      {{ formatGrade(cell.submission.grade) }}
                    </strong>
                    <strong v-else>—</strong>
                    <small :class="taskStatusClass(cell.submission)">
                      {{ taskStatusLabel(cell.submission) }}
                    </small>
                  </RouterLink>

                  <div v-else class="grade-cell grade-cell--empty">
                    <strong>—</strong>
                    <small>Sin entrega</small>
                  </div>
                </td>

                <td class="average-cell">
                  <strong>{{ row.average }}</strong>
                  <small>{{ row.reviewed }}/{{ assignments.length }} evaluadas</small>
                </td>
              </tr>
            </tbody>
          </table>

          <div v-if="!filteredTaskRows.length" class="empty-inline">
            No encontramos estudiantes con esa búsqueda.
          </div>
        </div>
      </section>

      <!-- =====================================================
           QUIZZES
      ====================================================== -->
      <section
        v-show="isGradebookTab('evaluaciones')"
        class="workspace"
      >
        <header class="section-heading section-heading--quiz">
          <div>
            <p class="eyebrow">EVALUACIÓN DEL APRENDIZAJE</p>
            <h2>Evaluaciones y quiz</h2>
            <p>
              Mejor resultado por estudiante, historial de intentos y acceso
              directo a la revisión pedagógica.
            </p>
          </div>

          <div class="legend">
            <span><i class="dot dot--success"></i> Corregida</span>
            <span><i class="dot dot--warning"></i> Por revisar</span>
            <span><i class="dot"></i> Sin realizar</span>
          </div>
        </header>

        <div v-if="!quizzes.length" class="empty-card">
          <strong>Aún no hay evaluaciones publicadas.</strong>
          <p>Los quiz y pruebas publicados aparecerán en este panel.</p>
        </div>

        <div v-else class="quiz-stack">
          <article
            v-for="quiz in filteredQuizCards"
            :key="quiz.id"
            class="quiz-card"
          >
            <header class="quiz-card__header">
              <div>
                <div class="quiz-card__meta">
                  <span>{{ assessmentLabel(quiz.assessmentType) }}</span>
                  <span>{{ lessonLabel(quiz.lessonId) }}</span>
                </div>
                <h3>{{ quiz.title }}</h3>
                <p v-if="quiz.description">{{ quiz.description }}</p>
              </div>

              <div class="quiz-card__summary">
                <div>
                  <strong>{{ quiz.studentsCompleted }}</strong>
                  <span>realizaron</span>
                </div>
                <div>
                  <strong>{{ quiz.totalAttempts }}</strong>
                  <span>intentos</span>
                </div>
                <div :class="{ 'summary-alert': quiz.pendingReviews }">
                  <strong>{{ quiz.pendingReviews }}</strong>
                  <span>por revisar</span>
                </div>
              </div>
            </header>

            <div class="quiz-table-wrap">
              <table class="quiz-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Mejor resultado</th>
                    <th>Último intento</th>
                    <th>Intentos</th>
                    <th>Estado</th>
                    <th class="action-column">Acción</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="row in quiz.rows" :key="row.student.id">
                    <td>
                      <div class="student-identity">
                        <span class="avatar avatar--small">
                          {{ initials(row.student.name) }}
                        </span>
                        <span>
                          <strong>{{ row.student.name }}</strong>
                          <small>{{ row.student.voice || 'Sin clasificar' }}</small>
                        </span>
                      </div>
                    </td>

                    <td>
                      <strong class="percentage">
                        {{ percentageLabel(row.bestAttempt?.percentage) }}
                      </strong>
                    </td>

                    <td>
                      <div v-if="row.latestAttempt" class="latest-attempt">
                        <strong>{{ percentageLabel(row.latestAttempt.percentage) }}</strong>
                        <small>{{ formatDate(row.latestAttempt.submittedAt) }}</small>
                      </div>
                      <span v-else>—</span>
                    </td>

                    <td>
                      <span class="attempt-pill">
                        {{ row.attempts.length }}
                        {{ row.attempts.length === 1 ? 'intento' : 'intentos' }}
                      </span>
                    </td>

                    <td>
                      <span
                        class="status-pill"
                        :class="quizStatusClass(row)"
                      >
                        {{ quizStatusLabel(row) }}
                      </span>
                    </td>

                    <td class="action-cell">
                      <RouterLink
                        v-if="row.latestAttempt"
                        :to="reviewRoute(quiz, row.latestAttempt)"
                        class="review-link"
                      >
                        {{
                          row.pendingManual
                            ? 'Revisar'
                            : 'Ver revisión'
                        }}
                        →
                      </RouterLink>
                      <span v-else class="muted">—</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <footer class="quiz-card__footer">
              <div>
                <span>Aprobación</span>
                <strong>
                  {{
                    quiz.passingPercentage == null
                      ? 'Sin mínimo'
                      : `${quiz.passingPercentage}%`
                  }}
                </strong>
              </div>

              <RouterLink
                :to="`/aula/clase/${quiz.lessonId}/evaluacion/${quiz.id}/intentos`"
                class="button button--secondary"
              >
                Ver todos los intentos →
              </RouterLink>
            </footer>
          </article>

          <div v-if="!filteredQuizCards.length" class="empty-card">
            <strong>No encontramos resultados.</strong>
            <p>Prueba con otro nombre de estudiante.</p>
          </div>
        </div>
      </section>

      <!-- =====================================================
           RENDIMIENTO INDIVIDUAL
      ====================================================== -->
      <section class="student-performance"
        v-show="isGradebookTab('estudiantes')"
      >
        <header class="section-heading">
          <div>
            <p class="eyebrow">SEGUIMIENTO INDIVIDUAL</p>
            <h2>Rendimiento por estudiante</h2>
            <p>
              Tareas y evaluaciones permanecen en escalas separadas para
              conservar una lectura académica correcta.
            </p>
          </div>
        </header>

        <div class="student-grid">
          <RouterLink
            v-for="row in filteredStudentPerformance"
            :key="row.student.id"
            :to="`/aula/estudiante/${row.student.id}`"
            class="student-card"
          >
            <header>
              <span class="avatar">{{ initials(row.student.name) }}</span>
              <div>
                <small>{{ row.student.voice || 'Sin clasificar' }}</small>
                <h3>{{ row.student.name }}</h3>
              </div>
            </header>

            <div class="student-card__columns">
              <section>
                <span>TAREAS</span>
                <strong>{{ row.taskAverage }}</strong>
                <small>{{ row.reviewedTasks }}/{{ assignments.length }} evaluadas</small>
              </section>

              <section>
                <span>QUIZZES</span>
                <strong>{{ row.quizAverage }}</strong>
                <small>{{ row.completedQuizzes }}/{{ quizzes.length }} realizados</small>
              </section>
            </div>

            <div class="student-card__status">
              <span v-if="row.pendingQuizReviews" class="needs-review">
                {{ row.pendingQuizReviews }} revisión(es) pendiente(s)
              </span>
              <span v-else class="all-good">
                ✓ Sin revisiones pendientes
              </span>
            </div>

            <footer>Ver ficha completa →</footer>
          </RouterLink>
        </div>
      <!-- =====================================================
           GRADEBOOK V10 · RESULTADO PONDERADO
      ====================================================== -->
      




</section>
    

<section class="weighted-gradebook"
      
        v-show="isGradebookTab('ponderaciones')"
      >
        <div
          v-if="hasWeightedResults"
          class="weighted-gradebook__content"
        >

        <header class="weighted-gradebook__header">
          <div>
            <span>RESULTADO ACADÉMICO · V10</span>
            <h2>Ponderación por estudiante</h2>
            <p>
              Calculado con la configuración académica guardada.
              Una categoría sin resultados no se convierte en cero.
            </p>
          </div>

          <RouterLink
            v-if="isTeacher"
            to="/aula/configuracion/evaluacion"
            class="weighted-gradebook__settings"
          >
            Configurar evaluación
          </RouterLink>
        </header>

        <div
          v-if="gradingConfigWarning"
          class="weighted-gradebook__warning"
        >
          {{ gradingConfigWarning }}
        </div>

        <div
          v-if="weightedStudentRows.length"
          class="weighted-students"
        >
          <article
            v-for="row in weightedStudentRows"
            :key="row.student.id"
            class="weighted-student"
          >
            <header class="weighted-student__identity">
              <div class="weighted-student__avatar">
                {{
                  (
                    row.student.name ||
                    row.student.fullName ||
                    'A'
                  )
                    .split(' ')
                    .map(part => part[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                }}
              </div>

              <div>
                <strong>
                  {{
                    row.student.name ||
                    row.student.fullName ||
                    'Estudiante'
                  }}
                </strong>

                <span>
                  {{ row.evaluatedWeight }}%
                  del programa evaluado
                </span>
              </div>
            </header>

            <div class="weighted-student__categories">
              <div
                v-for="category in row.details"
                :key="category.key"
                class="weighted-category"
                :class="{
                  'weighted-category--pending':
                    !category.evaluated,
                }"
              >
                <div>
                  <strong>{{ category.name }}</strong>
                  <span>Peso {{ category.weight }}%</span>
                </div>

                <div class="weighted-category__result">
                  <template v-if="category.evaluated">
                    <strong>
                      {{ Math.round(category.percentage) }}%
                    </strong>
                    <small>
                      Nota
                      {{ formatAcademicGrade(category.grade) }}
                    </small>
                  </template>

                  <template v-else>
                    <strong>—</strong>
                    <small>Sin evaluar</small>
                  </template>
                </div>
              </div>
            </div>

            <footer class="weighted-student__final">
              <div>
                <span>RESULTADO ACTUAL</span>
                <small v-if="row.pendingWeight > 0">
                  Queda {{ row.pendingWeight }}%
                  pendiente de evaluación
                </small>
                <small v-else>
                  Ponderación completa
                </small>
              </div>

              <div class="weighted-student__score">
                <strong>
                  {{ formatAcademicGrade(row.currentGrade) }}
                </strong>
                <span>
                  {{
                    row.currentPercentage === null
                      ? 'Sin resultados'
                      : `${Math.round(row.currentPercentage)}%`
                  }}
                </span>
              </div>

              <RouterLink
                :to="`/aula/estudiante/${row.student.id}`"
                class="weighted-student__profile"
              >
                Ver ficha
              </RouterLink>
            </footer>
          </article>
        </div>

        <div
          v-else
          class="weighted-gradebook__empty"
        >
          Todavía no hay estudiantes para calcular resultados.
        </div>
      
        </div>

        <div
          v-if="!hasWeightedResults"
          class="weighted-empty"
          role="status"
          aria-live="polite"
        >
          <div class="weighted-empty__icon" aria-hidden="true">
            %
          </div>

          <div class="weighted-empty__copy">
            <span class="weighted-empty__eyebrow">
              PONDERACIÓN ACADÉMICA
            </span>

            <h2>Aún no hay resultados ponderados</h2>

            <p>
              La configuración académica está activa, pero todavía
              no existen calificaciones suficientes para calcular
              un resultado ponderado por estudiante.
            </p>
          </div>

          <div class="weighted-empty__status">
            <div>
              <span>Configuración actual</span>
              <strong>{{ configuredWeight }}%</strong>
            </div>

            <small v-if="configuredWeight === 100">
              ✓ La distribución de categorías está completa.
            </small>

            <small v-else>
              La distribución todavía requiere ajustes.
            </small>
          </div>

          <div
            v-if="gradingCategories.length"
            class="weighted-empty__categories"
          >
            <article
              v-for="category in gradingCategories"
              :key="category.id || category.key || category.name"
            >
              <span>
                {{
                  category.label ||
                  category.name ||
                  category.title ||
                  'Categoría'
                }}
              </span>

              <strong>
                {{
                  Number(
                    category.weight ??
                    category.percentage ??
                    category.weight_percentage ??
                    0
                  )
                }}%
              </strong>
            </article>
          </div>
          <div
            v-else
            class="weighted-empty__categories-fallback"
          >
            Las categorías de evaluación están configuradas,
            pero todavía no hay resultados académicos que ponderar.
          </div>


          <div class="weighted-empty__actions">
            <RouterLink
              to="/aula/configuracion/evaluacion"
              class="weighted-empty__primary"
            >
              Configurar ponderaciones
            </RouterLink>

            <button
              type="button"
              class="weighted-empty__secondary"
              @click="selectGradebookTab('evaluaciones')"
            >
              Ver evaluaciones
            </button>
          </div>

          <p class="weighted-empty__note">
            Los resultados aparecerán aquí automáticamente cuando
            existan actividades calificadas que participen en la
            ponderación.
          </p>
        </div>

      </section>

</template>
  </main>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import {
  RouterLink,
} from 'vue-router'

import {
  fetchStudents,
} from '@/services/studentService'

import {
  fetchLessons,
} from '@/services/lessonService'

import {
  fetchAssignments,
} from '@/services/assignmentService'

import {
  fetchSubmissions,
} from '@/services/submissionService'

import {
  fetchQuizzes,
} from '@/services/quizService'

import {
  fetchTeacherQuizAttempts,
} from '@/services/teacherEvaluationService'

import {
  fetchGradingConfiguration,
  percentageToChileanGrade,
  normalizeResultToPercentage,
  calculateWeightedResult,
} from '@/services/gradingService'

import {
  useAuth,
} from '@/composables/useAuth'

const {
  isTeacher,
} = useAuth()

const students = ref([])
const lessons = ref([])
const assignments = ref([])
const submissions = ref([])
const quizzes = ref([])
const quizAttempts = ref([])

const gradingConfiguration = ref({
  settings: {
    gradingScale: 'chilean_1_7',
    minimumGrade: 1,
    maximumGrade: 7,
    passingGrade: 4,
    exigencyPercentage: 60,
    decimals: 1,
    useWeights: true,
  },
  categories: [],
})

const gradingConfigWarning = ref('')


const isLoading = ref(true)
const loadError = ref('')
const activeTab = ref('tasks')
const searchQuery = ref('')

const voiceOrder = {
  Soprano: 1,
  Alto: 2,
  Tenor: 3,
  Bajo: 4,
}

const normalizeText = value =>
  String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()

const sortStudents = list =>
  [...list].sort((a, b) => {
    const voiceA = voiceOrder[a.voice] || 99
    const voiceB = voiceOrder[b.voice] || 99

    if (voiceA !== voiceB) {
      return voiceA - voiceB
    }

    return String(a.name || '')
      .localeCompare(
        String(b.name || ''),
        'es',
        { sensitivity: 'base' },
      )
  })

const loadGradebook = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const [
      loadedStudents,
      loadedLessons,
      loadedAssignments,
      loadedSubmissions,
      loadedQuizzes,
    ] = await Promise.all([
      fetchStudents(),
      fetchLessons(),
      fetchAssignments(),
      fetchSubmissions(),
      fetchQuizzes(),
    ])

    students.value =
      sortStudents(loadedStudents || [])

    lessons.value =
      loadedLessons || []

    assignments.value =
      (loadedAssignments || [])
        .filter(
          assignment =>
            assignment.status !== 'draft',
        )
        .sort(
          (a, b) =>
            Number(a.id) -
            Number(b.id),
        )

    submissions.value =
      loadedSubmissions || []

    quizzes.value =
      (loadedQuizzes || [])
        .filter(
          quiz =>
            quiz.status !== 'draft',
        )
        .sort(
          (a, b) =>
            Number(a.lessonId || 0) -
              Number(b.lessonId || 0) ||
            Number(a.id) -
              Number(b.id),
        )

    const attemptGroups =
      await Promise.all(
        quizzes.value.map(
          async quiz => {
            try {
              const attempts =
                await fetchTeacherQuizAttempts(
                  quiz.id,
                )

              return attempts || []
            } catch (error) {
              console.error(
                `No fue posible cargar intentos del quiz ${quiz.id}:`,
                error,
              )

              return []
            }
          },
        ),
      )

    quizAttempts.value =
      attemptGroups.flat()
  } catch (error) {
    console.error(
      'Error cargando libro de notas:',
      error,
    )

    students.value = []
    lessons.value = []
    assignments.value = []
    submissions.value = []
    quizzes.value = []
    quizAttempts.value = []

    loadError.value =
      error?.message ||
      'No se pudo cargar el libro de notas desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

const studentMatchesSearch =
  student => {
    const query =
      normalizeText(
        searchQuery.value,
      )

    if (!query) {
      return true
    }

    return normalizeText(
      `${student?.name || ''} ${student?.voice || ''}`,
    ).includes(query)
  }

const studentIdOf =
  record =>
    Number(
      record?.studentId ??
      record?.student_id ??
      record?.userId ??
      record?.user_id,
    )

const assignmentIdOf =
  record =>
    Number(
      record?.assignmentId ??
      record?.assignment_id,
    )

const findSubmission =
  (studentId, assignmentId) =>
    submissions.value.find(
      submission =>
        studentIdOf(submission) ===
          Number(studentId) &&
        assignmentIdOf(submission) ===
          Number(assignmentId),
    ) || null

const hasGrade =
  submission => {
    const grade =
      Number(
        submission?.grade,
      )

    return Number.isFinite(
      grade,
    )
  }

const formatGrade =
  value => {
    const grade =
      Number(value)

    if (!Number.isFinite(grade)) {
      return '—'
    }

    return grade.toFixed(1)
  }

const taskStatusLabel =
  submission => {
    if (!submission) {
      return 'Sin entrega'
    }

    if (hasGrade(submission)) {
      return 'Evaluada'
    }

    const status =
      String(
        submission.status || '',
      ).toLowerCase()

    if (
      status === 'submitted' ||
      status === 'delivered'
    ) {
      return 'Por revisar'
    }

    return 'Entregada'
  }

const taskStatusClass =
  submission => ({
    'status-text--success':
      hasGrade(submission),
    'status-text--warning':
      submission &&
      !hasGrade(submission),
  })

const taskRows =
  computed(() =>
    students.value.map(
      student => {
        const cells =
          assignments.value.map(
            assignment => ({
              assignment,
              submission:
                findSubmission(
                  student.id,
                  assignment.id,
                ),
            }),
          )

        const grades =
          cells
            .filter(
              cell =>
                hasGrade(
                  cell.submission,
                ),
            )
            .map(
              cell =>
                Number(
                  cell.submission.grade,
                ),
            )

        return {
          student,
          cells,
          reviewed:
            grades.length,
          average:
            grades.length
              ? (
                  grades.reduce(
                    (sum, grade) =>
                      sum + grade,
                    0,
                  ) /
                  grades.length
                ).toFixed(1)
              : '—',
        }
      },
    ),
  )

const filteredTaskRows =
  computed(() =>
    taskRows.value.filter(
      row =>
        studentMatchesSearch(
          row.student,
        ),
    ),
  )

const finishedQuizAttempts =
  computed(() =>
    quizAttempts.value.filter(
      attempt =>
        [
          'submitted',
          'graded',
        ].includes(
          String(
            attempt.status || '',
          ).toLowerCase(),
        ),
    ),
  )

const pendingManualCount =
  computed(() =>
    finishedQuizAttempts.value.filter(
      attempt =>
        Number(
          attempt.pendingManual || 0,
        ) > 0,
    ).length,
  )

const attemptsForQuiz =
  quizId =>
    finishedQuizAttempts.value.filter(
      attempt =>
        Number(attempt.quizId) ===
        Number(quizId),
    )

const attemptsForStudentQuiz =
  (studentId, quizId) =>
    attemptsForQuiz(quizId)
      .filter(
        attempt =>
          Number(
            attempt.studentId,
          ) ===
          Number(studentId),
      )
      .sort(
        (a, b) =>
          Number(
            a.attemptNumber || 0,
          ) -
          Number(
            b.attemptNumber || 0,
          ),
      )

const bestAttemptOf =
  attempts =>
    attempts.reduce(
      (best, current) => {
        if (!best) {
          return current
        }

        const bestValue =
          Number(
            best.percentage,
          )

        const currentValue =
          Number(
            current.percentage,
          )

        if (
          !Number.isFinite(
            currentValue,
          )
        ) {
          return best
        }

        if (
          !Number.isFinite(
            bestValue,
          ) ||
          currentValue >
            bestValue
        ) {
          return current
        }

        return best
      },
      null,
    )

const quizCards =
  computed(() =>
    quizzes.value.map(
      quiz => {
        const allAttempts =
          attemptsForQuiz(
            quiz.id,
          )

        const rows =
          students.value.map(
            student => {
              const attempts =
                attemptsForStudentQuiz(
                  student.id,
                  quiz.id,
                )

              const latestAttempt =
                attempts.length
                  ? attempts[
                      attempts.length - 1
                    ]
                  : null

              return {
                student,
                attempts,
                latestAttempt,
                bestAttempt:
                  bestAttemptOf(
                    attempts,
                  ),
                pendingManual:
                  attempts.some(
                    attempt =>
                      Number(
                        attempt.pendingManual ||
                        0,
                      ) > 0,
                  ),
              }
            },
          )

        return {
          ...quiz,
          rows,
          totalAttempts:
            allAttempts.length,
          studentsCompleted:
            new Set(
              allAttempts.map(
                attempt =>
                  Number(
                    attempt.studentId,
                  ),
              ),
            ).size,
          pendingReviews:
            allAttempts.filter(
              attempt =>
                Number(
                  attempt.pendingManual ||
                  0,
                ) > 0,
            ).length,
        }
      },
    ),
  )

const filteredQuizCards =
  computed(() => {
    const query =
      normalizeText(
        searchQuery.value,
      )

    if (!query) {
      return quizCards.value
    }

    return quizCards.value
      .map(
        quiz => ({
          ...quiz,
          rows:
            quiz.rows.filter(
              row =>
                studentMatchesSearch(
                  row.student,
                ),
            ),
        }),
      )
      .filter(
        quiz =>
          quiz.rows.length > 0,
      )
  })

const lessonLabel =
  lessonId => {
    const lesson =
      lessons.value.find(
        item =>
          Number(item.id) ===
          Number(lessonId),
      )

    return (
      lesson?.title ||
      `Clase ${lessonId}`
    )
  }

const assessmentLabel =
  type => {
    const labels = {
      quiz: 'QUIZ',
      test: 'PRUEBA',
      exam: 'EXAMEN',
    }

    return (
      labels[
        String(type || '')
          .toLowerCase()
      ] ||
      'EVALUACIÓN'
    )
  }

const percentageLabel =
  value => {
    const number =
      Number(value)

    return Number.isFinite(
      number,
    )
      ? `${Math.round(number)}%`
      : '—'
  }

const formatDate =
  value => {
    if (!value) {
      return 'Sin fecha'
    }

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return 'Sin fecha'
    }

    return new Intl
      .DateTimeFormat(
        'es-CL',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        },
      )
      .format(date)
  }

const quizStatusLabel =
  row => {
    if (!row.latestAttempt) {
      return 'Sin realizar'
    }

    if (row.pendingManual) {
      return 'Por revisar'
    }

    if (
      row.latestAttempt.status ===
      'graded'
    ) {
      return row.latestAttempt.passed ===
        false
        ? 'Por reforzar'
        : 'Corregida'
    }

    return 'Entregada'
  }

const quizStatusClass =
  row => ({
    'status-pill--empty':
      !row.latestAttempt,
    'status-pill--warning':
      row.pendingManual,
    'status-pill--success':
      row.latestAttempt &&
      !row.pendingManual &&
      row.latestAttempt.status ===
        'graded' &&
      row.latestAttempt.passed !==
        false,
    'status-pill--danger':
      row.latestAttempt &&
      !row.pendingManual &&
      row.latestAttempt.status ===
        'graded' &&
      row.latestAttempt.passed ===
        false,
  })

const reviewRoute =
  (quiz, attempt) =>
    `/aula/clase/${quiz.lessonId}/evaluacion/${quiz.id}/intentos/${attempt.id}/revisar`

const initials =
  name =>
    String(name || '')
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(
        part =>
          part[0],
      )
      .join('')
      .toUpperCase() ||
    'ES'

const studentPerformance =
  computed(() =>
    students.value.map(
      student => {
        const taskRow =
          taskRows.value.find(
            row =>
              Number(
                row.student.id,
              ) ===
              Number(student.id),
          )

        const studentAttempts =
          finishedQuizAttempts.value.filter(
            attempt =>
              Number(
                attempt.studentId,
              ) ===
              Number(student.id),
          )

        const completedQuizIds =
          new Set(
            studentAttempts.map(
              attempt =>
                Number(
                  attempt.quizId,
                ),
            ),
          )

        const bestPercentages =
          quizzes.value
            .map(
              quiz =>
                bestAttemptOf(
                  attemptsForStudentQuiz(
                    student.id,
                    quiz.id,
                  ),
                )?.percentage,
            )
            .map(Number)
            .filter(
              Number.isFinite,
            )

        const quizAverage =
          bestPercentages.length
            ? `${Math.round(
                bestPercentages.reduce(
                  (sum, value) =>
                    sum + value,
                  0,
                ) /
                bestPercentages.length,
              )}%`
            : '—'

        return {
          student,
          taskAverage:
            taskRow?.average ||
            '—',
          reviewedTasks:
            taskRow?.reviewed ||
            0,
          quizAverage,
          completedQuizzes:
            completedQuizIds.size,
          pendingQuizReviews:
            studentAttempts.filter(
              attempt =>
                Number(
                  attempt.pendingManual ||
                  0,
                ) > 0,
            ).length,
        }
      },
    ),
  )

const filteredStudentPerformance =
  computed(() =>
    studentPerformance.value.filter(
      row =>
        studentMatchesSearch(
          row.student,
        ),
    ),
  )

onMounted(async () => {
  /*
   * La configuración académica se carga en paralelo.
   * Si falla, loadGradingConfiguration maneja su propia
   * advertencia y NO bloquea el libro de notas.
   */
  await Promise.all([
    loadGradebook(),
    loadGradingConfiguration(),
  ])
})

/* =========================================================
   GRADEBOOK V10 · MOTOR DE PONDERACIONES
   Mantiene tareas y quiz en su escala original.
========================================================= */

const gradingSettings =
  computed(() =>
    gradingConfiguration.value.settings
  )

const gradingCategories =
  computed(() =>
    gradingConfiguration.value.categories || []
  )

const activeGradingCategories =
  computed(() =>
    gradingCategories.value.filter(
      category =>
        category.enabled !== false
    )
  )

const configuredWeight =
  computed(() =>
    activeGradingCategories.value.reduce(
      (sum, category) =>
        sum + Number(category.weight || 0),
      0
    )
  )

const getStudentIdFromSubmission =
  submission =>
    Number(
      submission?.studentId ??
      submission?.student_id ??
      submission?.userId ??
      submission?.user_id
    )

const getStudentIdFromAttempt =
  attempt =>
    Number(
      attempt?.studentId ??
      attempt?.student_id ??
      attempt?.userId ??
      attempt?.user_id
    )

const getQuizByAttempt =
  attempt => {
    const quizId =
      Number(
        attempt?.quizId ??
        attempt?.quiz_id
      )

    return quizzes.value.find(
      quiz =>
        Number(quiz.id) === quizId
    ) || null
  }

const getAttemptAssessmentType =
  attempt =>
    String(
      attempt?.assessmentType ??
      attempt?.assessment_type ??
      getQuizByAttempt(attempt)?.assessmentType ??
      'quiz'
    ).toLowerCase()

const isCompletedAttempt =
  attempt =>
    Number.isFinite(
      Number(attempt?.percentage)
    )

const bestAttemptByQuizForStudent =
  studentId => {
    const grouped = new Map()

    quizAttempts.value
      .filter(
        attempt =>
          getStudentIdFromAttempt(attempt) ===
            Number(studentId) &&
          isCompletedAttempt(attempt)
      )
      .forEach(attempt => {
        const quizId =
          Number(
            attempt?.quizId ??
            attempt?.quiz_id
          )

        if (!quizId) return

        const current =
          grouped.get(quizId)

        if (
          !current ||
          Number(attempt.percentage) >
            Number(current.percentage)
        ) {
          grouped.set(
            quizId,
            attempt
          )
        }
      })

    return [...grouped.values()]
  }

const assignmentPercentagesForStudent =
  studentId =>
    submissions.value
      .filter(
        submission =>
          getStudentIdFromSubmission(submission) ===
            Number(studentId) &&
          Number.isFinite(
            Number(submission?.grade)
          )
      )
      .map(submission =>
        normalizeResultToPercentage(
          Number(submission.grade),
          'chilean_1_7',
          gradingSettings.value
        )
      )
      .filter(value =>
        Number.isFinite(value)
      )

const averageNumbers =
  values => {
    const valid =
      values.filter(value =>
        Number.isFinite(
          Number(value)
        )
      )

    if (!valid.length) {
      return null
    }

    return (
      valid.reduce(
        (sum, value) =>
          sum + Number(value),
        0
      ) /
      valid.length
    )
  }

const categoryPercentageForStudent =
  (studentId, category) => {
    const key =
      String(category?.key || '')
        .toLowerCase()

    if (
      key === 'assignments' ||
      key === 'tasks' ||
      key === 'tareas'
    ) {
      return averageNumbers(
        assignmentPercentagesForStudent(
          studentId
        )
      )
    }

    const attempts =
      bestAttemptByQuizForStudent(
        studentId
      )

    if (
      key === 'quiz' ||
      key === 'quizzes'
    ) {
      return averageNumbers(
        attempts
          .filter(
            attempt =>
              getAttemptAssessmentType(attempt) ===
              'quiz'
          )
          .map(
            attempt =>
              Number(attempt.percentage)
          )
      )
    }

    if (
      key === 'test' ||
      key === 'tests' ||
      key === 'pruebas'
    ) {
      return averageNumbers(
        attempts
          .filter(
            attempt =>
              getAttemptAssessmentType(attempt) ===
              'test'
          )
          .map(
            attempt =>
              Number(attempt.percentage)
          )
      )
    }

    /*
     * Las categorías personalizadas no se rellenan con cero.
     * Hasta que una actividad tenga category_key persistida,
     * se consideran "sin evaluar".
     */
    return null
  }

const buildStudentWeightedSummary =
  student => {
    const studentId =
      Number(student.id)

    const categoryResults = {}
    const details =
      activeGradingCategories.value.map(
        category => {
          const percentage =
            categoryPercentageForStudent(
              studentId,
              category
            )

          const evaluated =
            percentage !== null &&
            percentage !== undefined &&
            Number.isFinite(
              Number(percentage)
            )

          if (evaluated) {
            categoryResults[category.key] =
              Number(percentage)
          }

          return {
            ...category,
            evaluated,
            percentage:
              evaluated
                ? Number(
                    Number(percentage)
                      .toFixed(2)
                  )
                : null,
            grade:
              evaluated
                ? percentageToChileanGrade(
                    percentage,
                    gradingSettings.value
                  )
                : null,
          }
        }
      )

    const evaluatedWeight =
      details
        .filter(
          item =>
            item.evaluated
        )
        .reduce(
          (sum, item) =>
            sum +
            Number(item.weight || 0),
          0
        )

    const currentPercentage =
      calculateWeightedResult(
        categoryResults,
        activeGradingCategories.value
      )

    const currentGrade =
      currentPercentage !== null &&
      currentPercentage !== undefined &&
      Number.isFinite(
        Number(currentPercentage)
      )
        ? percentageToChileanGrade(
            currentPercentage,
            gradingSettings.value
          )
        : null

    return {
      student,
      details,
      evaluatedWeight,
      pendingWeight:
        Math.max(
          0,
          configuredWeight.value -
          evaluatedWeight
        ),
      currentPercentage,
      currentGrade,
    }
  }

const weightedStudentRows =
  computed(() =>
    students.value.map(
      buildStudentWeightedSummary
    )
  )

const formatAcademicGrade =
  value => {
    if (
      value === null ||
      value === undefined ||
      !Number.isFinite(
        Number(value)
      )
    ) {
      return '—'
    }

    const decimals =
      Number(
        gradingSettings.value.decimals ??
        1
      )

    return Number(value).toFixed(
      decimals
    )
  }

const loadGradingConfiguration =
  async () => {
    gradingConfigWarning.value = ''

    try {
      gradingConfiguration.value =
        await fetchGradingConfiguration()
    } catch (error) {
      console.error(
        'No fue posible cargar ponderaciones:',
        error
      )

      gradingConfigWarning.value =
        'El libro de notas está disponible, pero no fue posible cargar la configuración de ponderaciones.'
    }
  }



/* =========================================================
   GRADEBOOK V11 · CONTEXT NAVIGATION
   Patrón aprobado en StudentProfile v11.1
========================================================= */

const gradebookTabs = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'tareas', label: 'Tareas' },
  { id: 'evaluaciones', label: 'Evaluaciones' },
  { id: 'estudiantes', label: 'Estudiantes' },
  { id: 'ponderaciones', label: 'Ponderaciones' },
]

const activeGradebookTab =
  ref('resumen')

const selectGradebookTab =
  tabId => {
    if (
      !gradebookTabs.some(
        tab => tab.id === tabId
      )
    ) {
      return
    }

    activeGradebookTab.value = tabId
  }

const isGradebookTab =
  tabId =>
    activeGradebookTab.value === tabId

const gradebookEvaluatedStudents =
  computed(() =>
    weightedStudentRows.value.filter(
      row =>
        row.evaluatedWeight > 0
    ).length
  )

const gradebookPendingStudents =
  computed(() =>
    Math.max(
      0,
      students.value.length -
      gradebookEvaluatedStudents.value
    )
  )



/* =========================================================
   GRADEBOOK V11.5 · ESTADO DE PONDERACIONES
========================================================= */
const hasWeightedResults =
  computed(() =>
    weightedStudentRows.value.some(
      row =>
        Number(row.evaluatedWeight || 0) > 0
    )
  )

</script>

<style scoped>
.gradebook {
  --canvas: #f5f7fb;
  --card: #ffffff;
  --ink: #172033;
  --body: #344359;
  --muted: #667085;
  --border: #dbe3ec;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #edf8f3;
  --red: #be4856;
  --red-soft: #fff1f2;
  --warning: #a96b13;
  --warning-soft: #fff7e8;

  min-height: 100%;
  padding: 32px;
  color: var(--ink);
  background: var(--canvas);
}

.gradebook__hero {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 32px;
  padding: 36px;
  overflow: hidden;
  border-radius: 26px;
  color: #fff;
  background:
    radial-gradient(circle at 86% 10%, rgba(217, 169, 29, .22), transparent 28%),
    linear-gradient(135deg, #172033 0%, #202b43 62%, #351727 100%);
  box-shadow: 0 18px 45px rgba(23, 32, 51, .12);
}

.eyebrow {
  margin: 0 0 10px;
  color: var(--wine);
  font-size: .76rem;
  font-weight: 900;
  letter-spacing: .13em;
}

.gradebook__hero .eyebrow {
  color: #f0ca58;
}

.gradebook__hero h1 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 3.6rem);
  line-height: 1;
  letter-spacing: -.045em;
}

.hero-copy {
  max-width: 700px;
  margin: 16px 0 0;
  color: rgba(255,255,255,.78);
  font-size: 1rem;
  line-height: 1.7;
}

.hero-status {
  min-width: 180px;
  padding: 20px 24px;
  border: 1px solid rgba(255,255,255,.15);
  border-radius: 20px;
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(12px);
}

.hero-status span,
.hero-status small {
  display: block;
  color: rgba(255,255,255,.72);
}

.hero-status strong {
  display: block;
  margin: 4px 0;
  font-size: 2.25rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
  margin: 20px 0;
}

.metric-card {
  padding: 20px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: var(--card);
  box-shadow: 0 8px 24px rgba(23,32,51,.045);
}

.metric-card span,
.metric-card small {
  display: block;
  color: var(--muted);
}

.metric-card span {
  font-size: .78rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .05em;
}

.metric-card strong {
  display: block;
  margin: 8px 0 4px;
  font-size: 1.8rem;
}

.metric-card--alert {
  border-color: #efd6a9;
  background: var(--warning-soft);
}

.toolbar {
  position: sticky;
  top: 12px;
  z-index: 5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin: 22px 0;
  padding: 10px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: rgba(255,255,255,.92);
  box-shadow: 0 10px 28px rgba(23,32,51,.07);
  backdrop-filter: blur(12px);
}

.tabs {
  display: flex;
  gap: 6px;
}

.tabs button {
  position: relative;
  display: flex;
  align-items: center;
  gap: 9px;
  min-height: 48px;
  padding: 0 18px;
  border: 0;
  border-radius: 12px;
  color: var(--body);
  background: transparent;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.tabs button strong {
  min-width: 25px;
  padding: 3px 7px;
  border-radius: 999px;
  color: var(--muted);
  background: #eef2f6;
  font-size: .75rem;
}

.tabs button i {
  position: absolute;
  top: -5px;
  right: -5px;
  display: grid;
  place-items: center;
  min-width: 20px;
  height: 20px;
  padding: 0 5px;
  border-radius: 999px;
  color: #fff;
  background: var(--red);
  font-size: .68rem;
  font-style: normal;
}

.tabs .tab--active {
  color: #fff;
  background: var(--wine);
}

.tabs .tab--active strong {
  color: var(--wine);
  background: #fff;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  width: min(330px, 100%);
  min-height: 48px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: #fff;
}

.search-box input {
  width: 100%;
  border: 0;
  outline: 0;
  color: var(--ink);
  background: transparent;
  font: inherit;
}

.workspace,
.student-performance {
  margin-top: 22px;
  padding: 28px;
  border: 1px solid var(--border);
  border-radius: 24px;
  background: var(--card);
  box-shadow: 0 10px 30px rgba(23,32,51,.045);
}

.section-heading {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 22px;
}

.section-heading h2 {
  margin: 0;
  font-size: clamp(1.5rem, 2vw, 2.1rem);
  letter-spacing: -.035em;
}

.section-heading p:not(.eyebrow) {
  max-width: 720px;
  margin: 8px 0 0;
  color: var(--muted);
  line-height: 1.65;
}

.legend {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  color: var(--muted);
  font-size: .78rem;
}

.legend span {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #aab4c1;
}

.dot--success { background: var(--green); }
.dot--warning { background: var(--warning); }

.table-shell,
.quiz-table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 16px;
}

.grade-table,
.quiz-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.grade-table {
  min-width: 850px;
}

.quiz-table {
  min-width: 900px;
}

.grade-table th,
.grade-table td,
.quiz-table th,
.quiz-table td {
  padding: 15px 16px;
  border-bottom: 1px solid #edf1f5;
  text-align: left;
  vertical-align: middle;
}

.grade-table thead th,
.quiz-table thead th {
  color: #566276;
  background: #f8fafc;
  font-size: .74rem;
  font-weight: 900;
  letter-spacing: .035em;
}

.student-column {
  min-width: 220px;
}

.column-kicker {
  display: block;
  margin-bottom: 3px;
  color: var(--wine);
  font-size: .65rem;
}

.student-cell a,
.student-identity {
  display: flex;
  align-items: center;
  gap: 11px;
  color: inherit;
  text-decoration: none;
}

.student-cell small,
.student-identity small,
.latest-attempt small {
  display: block;
  margin-top: 3px;
  color: var(--muted);
  font-size: .74rem;
}

.avatar {
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 13px;
  color: #fff;
  background: linear-gradient(135deg, var(--wine), #6e1734);
  font-size: .76rem;
  font-weight: 900;
}

.avatar--small {
  width: 36px;
  height: 36px;
  border-radius: 11px;
}

.grade-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: inherit;
  text-decoration: none;
}

.grade-cell strong,
.average-cell strong,
.percentage {
  font-size: 1.05rem;
}

.grade-cell--empty,
.muted {
  color: #98a2b3;
}

.status-text--success { color: var(--green); }
.status-text--warning { color: var(--warning); }

.average-cell small {
  display: block;
  margin-top: 3px;
  color: var(--muted);
}

.quiz-stack {
  display: grid;
  gap: 18px;
}

.quiz-card {
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: #fff;
}

.quiz-card__header {
  display: flex;
  justify-content: space-between;
  gap: 28px;
  padding: 24px;
  border-bottom: 1px solid var(--border);
  background:
    linear-gradient(90deg, #fff, #fbf7f9);
}

.quiz-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.quiz-card__meta span {
  padding: 5px 9px;
  border-radius: 999px;
  color: var(--wine);
  background: #f9edf2;
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .05em;
}

.quiz-card__meta span + span {
  color: #72580a;
  background: var(--gold-soft);
}

.quiz-card h3 {
  margin: 0;
  font-size: 1.3rem;
}

.quiz-card__header p {
  margin: 7px 0 0;
  color: var(--muted);
}

.quiz-card__summary {
  display: flex;
  gap: 8px;
}

.quiz-card__summary > div {
  min-width: 86px;
  padding: 12px;
  border: 1px solid var(--border);
  border-radius: 13px;
  background: #fff;
  text-align: center;
}

.quiz-card__summary strong,
.quiz-card__summary span {
  display: block;
}

.quiz-card__summary strong {
  font-size: 1.15rem;
}

.quiz-card__summary span {
  margin-top: 2px;
  color: var(--muted);
  font-size: .68rem;
}

.quiz-card__summary .summary-alert {
  border-color: #efd6a9;
  background: var(--warning-soft);
}

.latest-attempt strong {
  display: block;
}

.attempt-pill,
.status-pill {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 4px 9px;
  border-radius: 999px;
  font-size: .72rem;
  font-weight: 800;
}

.attempt-pill {
  color: #4c5b70;
  background: #eef2f6;
}

.status-pill {
  color: #667085;
  background: #eef2f6;
}

.status-pill--success {
  color: #21694c;
  background: var(--green-soft);
}

.status-pill--warning {
  color: #85530c;
  background: var(--warning-soft);
}

.status-pill--danger {
  color: #983b47;
  background: var(--red-soft);
}

.status-pill--empty {
  color: #667085;
  background: #f1f3f6;
}

.action-column,
.action-cell {
  text-align: right !important;
}

.review-link {
  color: var(--wine);
  font-size: .82rem;
  font-weight: 900;
  text-decoration: none;
}

.review-link:hover {
  color: var(--wine-dark);
  text-decoration: underline;
}

.quiz-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  padding: 16px 20px;
  background: #fbfcfe;
}

.quiz-card__footer > div span,
.quiz-card__footer > div strong {
  display: block;
}

.quiz-card__footer > div span {
  color: var(--muted);
  font-size: .7rem;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: 11px;
  font: inherit;
  font-size: .82rem;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
}

.button--primary {
  color: #fff;
  background: var(--wine);
}

.button--secondary {
  border: 1px solid var(--border);
  color: var(--ink);
  background: #fff;
}

.student-performance {
  margin-top: 24px;
}

.student-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.student-card {
  display: block;
  overflow: hidden;
  border: 1px solid var(--border);
  border-radius: 18px;
  color: inherit;
  background: #fff;
  text-decoration: none;
  transition: transform .18s ease, box-shadow .18s ease, border-color .18s ease;
}

.student-card:hover {
  transform: translateY(-2px);
  border-color: #c8d2de;
  box-shadow: 0 14px 30px rgba(23,32,51,.08);
}

.student-card > header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px;
}

.student-card h3 {
  margin: 2px 0 0;
  font-size: 1rem;
}

.student-card header small {
  color: var(--muted);
}

.student-card__columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.student-card__columns section {
  padding: 16px 18px;
}

.student-card__columns section + section {
  border-left: 1px solid var(--border);
}

.student-card__columns span,
.student-card__columns strong,
.student-card__columns small {
  display: block;
}

.student-card__columns span {
  color: var(--muted);
  font-size: .68rem;
  font-weight: 900;
  letter-spacing: .06em;
}

.student-card__columns strong {
  margin: 5px 0 2px;
  font-size: 1.35rem;
}

.student-card__columns small {
  color: var(--muted);
}

.student-card__status {
  padding: 13px 18px;
  font-size: .78rem;
  font-weight: 800;
}

.needs-review { color: var(--warning); }
.all-good { color: var(--green); }

.student-card footer {
  padding: 13px 18px;
  color: var(--wine);
  background: #fbf7f9;
  font-size: .78rem;
  font-weight: 900;
}

.state-card,
.empty-card {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 22px;
  padding: 24px;
  border: 1px solid var(--border);
  border-radius: 18px;
  background: #fff;
}

.state-card p,
.empty-card p {
  margin: 5px 0 0;
  color: var(--muted);
}

.state-card h2 {
  margin: 0 0 6px;
}

.state-card--error {
  border-color: #efcbd0;
  background: #fff8f9;
}

.state-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  color: #fff;
  background: var(--red);
  font-weight: 900;
}

.spinner {
  width: 34px;
  height: 34px;
  border: 3px solid #e4e8ee;
  border-top-color: var(--wine);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}

.empty-inline {
  padding: 20px;
  color: var(--muted);
  text-align: center;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0,0,0,0);
  white-space: nowrap;
  border: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1100px) {
  .summary-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .student-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .quiz-card__header {
    flex-direction: column;
  }
}

@media (max-width: 760px) {
  .gradebook {
    padding: 16px;
  }

  .gradebook__hero {
    align-items: stretch;
    flex-direction: column;
    padding: 24px;
  }

  .hero-status {
    min-width: 0;
  }

  .summary-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .toolbar {
    position: static;
    align-items: stretch;
    flex-direction: column;
  }

  .tabs {
    width: 100%;
  }

  .tabs button {
    flex: 1;
    justify-content: center;
    padding: 0 10px;
  }

  .search-box {
    width: auto;
  }

  .workspace,
  .student-performance {
    padding: 18px;
  }

  .section-heading {
    flex-direction: column;
  }

  .quiz-card__summary {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
  }

  .quiz-card__summary > div {
    min-width: 0;
  }

  .quiz-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .student-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr 1fr;
  }

  .metric-card {
    padding: 16px;
  }

  .tabs button {
    font-size: .78rem;
  }

  .tabs button strong {
    display: none;
  }
}

/* =========================================================
   V9.1 · FIX CONTRASTE VISUAL
   Protege el Libro de notas de estilos globales del aula
========================================================= */

/* HERO */
.gradebook .gradebook__hero {
  color: #ffffff !important;
}

.gradebook .gradebook__hero h1 {
  color: #ffffff !important;
  opacity: 1 !important;

  text-shadow:
    0 2px 4px rgba(0, 0, 0, 0.22),
    0 8px 30px rgba(0, 0, 0, 0.16);
}

.gradebook .gradebook__hero .eyebrow {
  color: #f4c842 !important;
}

.gradebook .gradebook__hero .hero-copy {
  color: rgba(255, 255, 255, 0.9) !important;
}

.gradebook .hero-status span,
.gradebook .hero-status small {
  color: rgba(255, 255, 255, 0.82) !important;
}

.gradebook .hero-status strong {
  color: #ffffff !important;
}


/* =========================================================
   AVATARES
========================================================= */

.gradebook .avatar {
  color: #ffffff !important;
}

.gradebook .avatar,
.gradebook .avatar *,
.gradebook .student-cell .avatar,
.gradebook .student-identity .avatar,
.gradebook .student-card .avatar {
  color: #ffffff !important;
  opacity: 1 !important;
}


/* =========================================================
   TABLAS · LEGIBILIDAD
========================================================= */

.gradebook .student-cell strong,
.gradebook .student-identity strong,
.gradebook .student-card h3 {
  color: #172033 !important;
}

.gradebook .student-cell small,
.gradebook .student-identity small,
.gradebook .student-card small {
  color: #667085 !important;
}


/* =========================================================
   NOTAS Y PORCENTAJES
========================================================= */

.gradebook .grade-cell strong,
.gradebook .average-cell strong,
.gradebook .percentage,
.gradebook .latest-attempt strong {
  color: #172033 !important;
}


/* =========================================================
   ENLACES
========================================================= */

.gradebook .review-link {
  color: #9f1945 !important;
}

.gradebook .review-link:hover {
  color: #7f1237 !important;
}



/* =========================================================
   AMV LMS UI SYSTEM · ACADEMIC EXPERIENCE v1.0
   Sistema visual común para el SaaS
========================================================= */
.gradebook {
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

.gradebook :where(a, button, input, textarea, select, [role="button"]) {
  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
}

.gradebook :where(a, button, input, textarea, select, [role="button"]):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.gradebook :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.gradebook :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

.gradebook :where(table tbody tr) {
  transition: background-color .18s ease;
}

.gradebook :where(table tbody tr):hover {
  background-color: rgba(159, 25, 69, .025);
}

.gradebook :where(.card, [class*="-card"], [class*="__card"]) {
  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;
}

.gradebook :where(.card, [class*="-card"], [class*="__card"]):hover {
  border-color: rgba(159, 25, 69, .16);
}

@media (prefers-reduced-motion: reduce) {
  .gradebook *, .gradebook *::before, .gradebook *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* =========================================================
   AMV LMS · FLUID MOTION & PREMIUM INTERACTION v2.0
   Capa visual segura: no modifica lógica, datos ni estructura.
========================================================= */
.gradebook {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.gradebook :where(
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
  .gradebook :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .gradebook :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .gradebook :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .gradebook :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.gradebook :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.gradebook :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.gradebook :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.gradebook ::selection {
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
  .gradebook,
  .gradebook *,
  .gradebook *::before,
  .gradebook *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}


/* =========================================================
   GRADEBOOK V10 · PONDERACIONES
========================================================= */
.weighted-gradebook{margin-top:24px;padding:24px;border:1px solid #dbe3ec;border-radius:24px;background:#fff;box-shadow:0 12px 36px rgba(23,32,51,.06)}
.weighted-gradebook__header{display:flex;align-items:flex-start;justify-content:space-between;gap:24px;margin-bottom:18px}
.weighted-gradebook__header>div>span{color:#9f1945;font-size:.75rem;font-weight:900;letter-spacing:.08em}
.weighted-gradebook__header h2{margin:5px 0;color:#172033!important}
.weighted-gradebook__header p{max-width:700px;margin:0;color:#667085}
.weighted-gradebook__settings,.weighted-student__profile{display:inline-flex;align-items:center;justify-content:center;min-height:42px;padding:0 15px;border-radius:12px;text-decoration:none;font-weight:900;transition:.2s}
.weighted-gradebook__settings{border:1px solid rgba(159,25,69,.22);background:#fff8fa;color:#9f1945}
.weighted-gradebook__settings:hover,.weighted-student__profile:hover{transform:translateY(-2px)}
.weighted-gradebook__warning{margin-bottom:15px;padding:13px 15px;border:1px solid #ead9a5;border-radius:14px;background:#fff9e9;color:#795d08;font-weight:700}
.weighted-students{display:grid;gap:14px}
.weighted-student{overflow:hidden;border:1px solid #dbe3ec;border-radius:20px;background:#fff;transition:.22s}
.weighted-student:hover{transform:translateY(-2px);box-shadow:0 14px 34px rgba(23,32,51,.075)}
.weighted-student__identity{display:flex;align-items:center;gap:12px;padding:16px 18px;border-bottom:1px solid #e7ecf2;background:#fafbfc}
.weighted-student__avatar{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:#9f1945;color:#fff!important;font-weight:900}
.weighted-student__identity>div:last-child{display:grid;gap:2px}
.weighted-student__identity strong{color:#172033!important}
.weighted-student__identity span{color:#667085;font-size:.8rem}
.weighted-student__categories{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:10px;padding:14px}
.weighted-category{display:flex;justify-content:space-between;gap:10px;min-width:0;padding:13px;border:1px solid #e3e8ef;border-radius:15px;background:#fff}
.weighted-category>div:first-child{display:grid;align-content:start;gap:3px;min-width:0}
.weighted-category strong{color:#172033!important}
.weighted-category span,.weighted-category small{color:#667085;font-size:.76rem}
.weighted-category__result{display:grid;justify-items:end;align-content:center;flex:0 0 auto}
.weighted-category__result>strong{font-size:1.12rem}
.weighted-category--pending{background:#f7f8fa;border-style:dashed}
.weighted-category--pending strong{color:#7b8493!important}
.weighted-student__final{display:flex;align-items:center;gap:18px;padding:14px 18px;border-top:1px solid #e7ecf2;background:#f8fafc}
.weighted-student__final>div:first-child{display:grid;gap:2px;margin-right:auto}
.weighted-student__final>div:first-child>span{color:#172033;font-size:.76rem;font-weight:900;letter-spacing:.05em}
.weighted-student__final small{color:#667085}
.weighted-student__score{display:grid;justify-items:end}
.weighted-student__score strong{color:#172033!important;font-size:1.65rem;line-height:1}
.weighted-student__score span{color:#667085;font-size:.75rem}
.weighted-student__profile{background:#9f1945;color:#fff}
.weighted-gradebook__empty{padding:24px;border:1px dashed #dbe3ec;border-radius:16px;background:#fafbfc;color:#667085;text-align:center}
@media(max-width:1150px){.weighted-student__categories{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:680px){.weighted-gradebook{padding:16px}.weighted-gradebook__header{flex-direction:column}.weighted-student__categories{grid-template-columns:1fr}.weighted-student__final{align-items:stretch;flex-direction:column}.weighted-student__score{justify-items:start}.weighted-student__profile{width:100%;box-sizing:border-box}}


/* =========================================================
   GRADEBOOK V11 · CONTEXT NAVIGATION
========================================================= */
.gradebook-context{position:sticky;top:12px;z-index:18;margin:18px 0 20px;border:1px solid #dbe3ec;border-radius:20px;background:rgba(255,255,255,.95);box-shadow:0 14px 36px rgba(23,32,51,.09);backdrop-filter:blur(14px);overflow:hidden}
.gradebook-context__heading{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:12px 16px 10px;border-bottom:1px solid #e7ecf2}
.gradebook-context__heading>div{display:flex;align-items:baseline;gap:9px;min-width:0}
.gradebook-context__heading span,.gradebook-overview__header span,.gradebook-students-panel>header span{color:#9f1945;font-size:.7rem;font-weight:900;letter-spacing:.08em}
.gradebook-context__heading strong{color:#172033!important;font-size:.9rem}
.gradebook-context__heading small{color:#667085;font-size:.76rem}
.gradebook-context__nav{display:flex;align-items:center;gap:4px;padding:7px;overflow-x:auto;overscroll-behavior-x:contain;scroll-snap-type:x proximity;scrollbar-width:thin}
.gradebook-context__tab{position:relative;flex:0 0 auto;min-height:42px;padding:0 14px;border:0;border-radius:11px;background:transparent;color:#5d6879;font:inherit;font-size:.84rem;font-weight:850;white-space:nowrap;cursor:pointer;scroll-snap-align:start;transition:.2s}
.gradebook-context__tab:hover{background:#f5f7fb;color:#172033;transform:translateY(-1px)}
.gradebook-context__tab--active{background:#fff0f4;color:#9f1945}
.gradebook-context__tab--active:after{content:"";position:absolute;right:14px;bottom:4px;left:14px;height:2px;border-radius:999px;background:#9f1945}
.gradebook-overview,.gradebook-students-panel{margin:0 0 22px;padding:22px;border:1px solid #dbe3ec;border-radius:22px;background:#fff;box-shadow:0 10px 30px rgba(23,32,51,.05)}
.gradebook-overview__header,.gradebook-students-panel>header{display:flex;align-items:flex-start;justify-content:space-between;gap:22px;margin-bottom:16px}
.gradebook-overview__header h2,.gradebook-students-panel>header h2{margin:4px 0 0;color:#172033!important}
.gradebook-overview__header p,.gradebook-students-panel>header p{max-width:440px;margin:0;color:#667085}
.gradebook-overview__grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px}
.gradebook-overview__grid button{display:grid;align-content:start;gap:5px;min-height:118px;padding:15px;border:1px solid #e1e7ef;border-radius:16px;background:linear-gradient(180deg,#fff,#fbfcfe);text-align:left;cursor:pointer;transition:.22s}
.gradebook-overview__grid button:hover{transform:translateY(-2px);border-color:rgba(159,25,69,.25);box-shadow:0 12px 28px rgba(23,32,51,.07)}
.gradebook-overview__grid button span{color:#9f1945;font-size:.76rem;font-weight:900;text-transform:uppercase;letter-spacing:.045em}
.gradebook-overview__grid button strong{color:#172033!important;font-size:1.45rem}
.gradebook-overview__grid button small{color:#667085;line-height:1.4}
.gradebook-students-panel__grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
.gradebook-student-card{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:12px;padding:14px;border:1px solid #e1e7ef;border-radius:16px;background:#fff;text-decoration:none;transition:.22s}
.gradebook-student-card:hover{transform:translateY(-2px);border-color:rgba(159,25,69,.25);box-shadow:0 12px 28px rgba(23,32,51,.07)}
.gradebook-student-card__avatar{display:grid;place-items:center;width:44px;height:44px;border-radius:14px;background:#9f1945;color:#fff!important;font-weight:900}
.gradebook-student-card__copy,.gradebook-student-card__grade{display:grid;gap:2px}
.gradebook-student-card__copy strong,.gradebook-student-card__grade strong{color:#172033!important}
.gradebook-student-card__copy span,.gradebook-student-card__grade span{color:#667085;font-size:.76rem}
.gradebook-student-card__grade{justify-items:end}
.gradebook-student-card__grade strong{font-size:1.25rem}
@media(min-width:900px){.gradebook-context__nav{justify-content:space-between;overflow-x:visible}.gradebook-context__tab{flex:1 1 0}}
@media(max-width:1100px){.gradebook-overview__grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
@media(max-width:760px){.gradebook-context{top:6px;border-radius:16px}.gradebook-context__heading{align-items:flex-start;flex-direction:column;gap:4px}.gradebook-context__heading small{display:none}.gradebook-overview__header,.gradebook-students-panel>header{flex-direction:column}.gradebook-overview__grid,.gradebook-students-panel__grid{grid-template-columns:1fr}}


/* V11.2 · ContextNav es la única navegación visible del Gradebook */
.gradebook-tabs,
.tabs,
.workspace-tabs,
.gradebook__tabs {
  display: none !important;
}


/* =========================================================
   V11.3 · ESTRUCTURA CORREGIDA
   ContextNav vive dentro del v-else de carga/error.
========================================================= */
.gradebook-legacy-summary,
.gradebook-legacy-toolbar {
  display: none !important;
}


/* =========================================================
   GRADEBOOK V11.5 · EMPTY STATE PONDERACIONES
========================================================= */
.weighted-empty {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  gap: 22px;
  align-items: center;
  margin: 0;
  padding: 28px;
  border: 1px solid #dbe3ec;
  border-radius: 22px;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(159, 25, 69, 0.055),
      transparent 34%
    ),
    #ffffff;
  box-shadow: 0 12px 34px rgba(23, 32, 51, 0.06);
}

.weighted-empty__icon {
  display: grid;
  place-items: center;
  width: 68px;
  height: 68px;
  border: 1px solid rgba(159, 25, 69, 0.16);
  border-radius: 20px;
  background: #fff0f4;
  color: #9f1945 !important;
  font-size: 1.7rem;
  font-weight: 950;
}

.weighted-empty__copy {
  min-width: 0;
}

.weighted-empty__eyebrow {
  display: block;
  margin-bottom: 6px;
  color: #9f1945;
  font-size: 0.72rem;
  font-weight: 950;
  letter-spacing: 0.09em;
}

.weighted-empty__copy h2 {
  margin: 0 0 8px;
  color: #172033 !important;
  font-size: clamp(1.35rem, 2.2vw, 2rem);
  line-height: 1.12;
}

.weighted-empty__copy p {
  max-width: 720px;
  margin: 0;
  color: #667085;
  line-height: 1.65;
}

.weighted-empty__status {
  min-width: 190px;
  padding: 16px 18px;
  border: 1px solid #e1e7ef;
  border-radius: 16px;
  background: #f8fafc;
}

.weighted-empty__status > div {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
}

.weighted-empty__status span {
  color: #667085;
  font-size: 0.78rem;
  font-weight: 750;
}

.weighted-empty__status strong {
  color: #172033 !important;
  font-size: 1.5rem;
  font-weight: 950;
}

.weighted-empty__status small {
  display: block;
  margin-top: 7px;
  color: #2d8a63;
  font-size: 0.76rem;
  line-height: 1.4;
}

.weighted-empty__categories {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 10px;
}

.weighted-empty__categories article {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  min-height: 58px;
  padding: 12px 14px;
  border: 1px solid #e1e7ef;
  border-radius: 14px;
  background: #fbfcfe;
}

.weighted-empty__categories span {
  color: #526076;
  font-size: 0.82rem;
  font-weight: 750;
}

.weighted-empty__categories strong {
  color: #9f1945 !important;
  font-size: 1rem;
  font-weight: 950;
}

.weighted-empty__actions {
  grid-column: 1 / -1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding-top: 2px;
}

.weighted-empty__primary,
.weighted-empty__secondary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 16px;
  border-radius: 12px;
  font: inherit;
  font-size: 0.84rem;
  font-weight: 850;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease,
    background 0.18s ease;
}

.weighted-empty__primary {
  border: 1px solid #9f1945;
  background: #9f1945;
  color: #ffffff !important;
}

.weighted-empty__secondary {
  border: 1px solid #dbe3ec;
  background: #ffffff;
  color: #172033;
}

.weighted-empty__primary:hover,
.weighted-empty__secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 9px 20px rgba(23, 32, 51, 0.09);
}

.weighted-empty__note {
  grid-column: 1 / -1;
  margin: 0;
  padding-top: 14px;
  border-top: 1px solid #edf0f4;
  color: #7a8597;
  font-size: 0.78rem;
  line-height: 1.55;
}

@media (max-width: 900px) {
  .weighted-empty {
    grid-template-columns: auto 1fr;
  }

  .weighted-empty__status {
    grid-column: 1 / -1;
  }

  .weighted-empty__categories {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 600px) {
  .weighted-empty {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .weighted-empty__icon {
    width: 56px;
    height: 56px;
    border-radius: 16px;
  }

  .weighted-empty__status,
  .weighted-empty__categories,
  .weighted-empty__actions,
  .weighted-empty__note {
    grid-column: 1;
  }

  .weighted-empty__categories {
    grid-template-columns: 1fr;
  }

  .weighted-empty__actions {
    display: grid;
  }

  .weighted-empty__primary,
  .weighted-empty__secondary {
    width: 100%;
  }
}


.weighted-empty__categories-fallback {
  grid-column: 1 / -1;
  padding: 14px 16px;
  border: 1px dashed #dbe3ec;
  border-radius: 14px;
  background: #fbfcfe;
  color: #667085;
  font-size: .82rem;
  line-height: 1.55;
}

</style>
