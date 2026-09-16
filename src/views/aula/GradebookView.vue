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
      <section class="summary-grid" aria-label="Resumen del libro de notas">
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

      <section class="toolbar">
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
      <section v-if="activeTab === 'tasks'" class="workspace">
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
      <section v-else class="workspace">
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
      <section class="student-performance">
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

const students = ref([])
const lessons = ref([])
const assignments = ref([])
const submissions = ref([])
const quizzes = ref([])
const quizAttempts = ref([])

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

onMounted(
  loadGradebook,
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

</style>
