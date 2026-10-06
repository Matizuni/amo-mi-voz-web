<template>
  <section class="student-profile amv-view-shell">
    <!-- =====================================================
         VOLVER
    ====================================================== -->
    <RouterLink
      to="/aula/alumnos"
      class="student-profile__back"
    >
      <span aria-hidden="true">←</span>
      Alumnos
    </RouterLink>

    <!-- =====================================================
         CARGA
    ====================================================== -->
    <section
      v-if="isLoading"
      class="state-card"
      role="status"
      aria-live="polite"
    >
      <div class="loading-spinner"></div>

      <div>
        <strong>
          Preparando ficha del estudiante
        </strong>

        <p>
          Cargando perfil vocal, asistencia
          y evaluaciones.
        </p>
      </div>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="state-card state-card--error"
      role="alert"
    >
      <span>!</span>

      <div>
        <h3>
          No pudimos cargar la ficha
        </h3>

        <p>
          {{ loadError }}
        </p>

        <button
          type="button"
          @click="loadProfile"
        >
          Reintentar
        </button>
      </div>
    </section>

    <!-- =====================================================
         PERFIL
    ====================================================== -->
    <template v-else-if="student">
      <!-- ===================================================
           HERO DEL ESTUDIANTE
      ==================================================== -->
      <header class="student-profile__hero">
        <div class="student-profile__identity">
          <div class="student-profile__avatar">
            {{ initials }}
          </div>

          <div class="student-profile__identity-copy">
            <p class="student-profile__eyebrow">
              Perfil académico
            </p>

            <h1>
              {{ student.name }}
            </h1>

            <div class="student-profile__badges">
              <span class="voice-badge">
                {{
                  vocalProfile?.voice ||
                  student.voice ||
                  'Sin clasificación'
                }}
              </span>

              <span
                class="status-badge"
                :class="{
                  'status-badge--inactive':
                    !student.active
                }"
              >
                <i></i>

                {{
                  student.active
                    ? 'Activo'
                    : 'Inactivo'
                }}
              </span>
            </div>
          </div>
        </div>

        <div class="student-profile__hero-actions">
          <button
            v-if="isTeacher"
            type="button"
            class="student-profile__edit-profile"
            @click="startEditingVocalProfile"
          >
            Editar ficha vocal
          </button>
        </div>
      </header>

      <!-- ===================================================
           RESUMEN
      ==================================================== -->
            <!-- =====================================================
           V11 · NAVEGACIÓN CONTEXTUAL
      ====================================================== -->
      <section class="student-profile__context-shell">
        <div class="student-profile__context-heading">
          <div>
            <span>EXPEDIENTE ACADÉMICO</span>
            <strong>
              {{
                student?.name ||
                student?.fullName ||
                'Estudiante'
              }}
            </strong>
          </div>

          <small>
            Selecciona un área para trabajar sin recorrer
            toda la ficha.
          </small>
        </div>

        <nav
          class="student-profile__context-nav"
          aria-label="Secciones de la ficha del estudiante"
        >
          <button
            v-for="tab in profileTabs"
            :key="tab.id"
            type="button"
            class="student-profile__context-tab"
            :class="{
              'student-profile__context-tab--active':
                isProfileTab(tab.id),
            }"
            :aria-current="
              isProfileTab(tab.id)
                ? 'page'
                : undefined
            "
            @click="selectProfileTab(tab.id)"
          >
            <span>{{ tab.label }}</span>
          </button>
        </nav>
      </section>

<section
        v-show="isProfileTab('resumen')"
        class="student-profile__summary"
        aria-label="Resumen académico"
      >
        <article class="summary-card summary-card--primary">
          <span>Promedio tareas</span>
          <strong>{{ averageGrade }}</strong>
          <small>escala de calificación</small>
        </article>

        <article>
          <span>Promedio quiz</span>
          <strong>
            {{
              quizAveragePercentage === null
                ? '—'
                : `${quizAveragePercentage}%`
            }}
          </strong>
          <small>
            {{ completedQuizAttempts.length }}
            intentos evaluados
          </small>
        </article>

        <article>
          <span>Asistencia</span>
          <strong>{{ attendancePercentage }}%</strong>
          <small>clases registradas</small>
        </article>

        <article>
          <span>Entregas</span>
          <strong>{{ studentSubmissions.length }}</strong>
          <small>
            {{ reviewedSubmissions.length }}
            revisadas
          </small>
        </article>

        <article>
          <span>Evaluaciones</span>
          <strong>{{ studentQuizAttempts.length }}</strong>
          <small>
            {{ passedQuizAttempts }}
            aprobadas
          </small>
        </article>

        <article
          :class="{
            'summary-card--attention':
              pendingQuizReviews > 0
          }"
        >
          <span>Por revisar</span>
          <strong>{{ pendingQuizReviews }}</strong>
          <small>intentos pendientes</small>
        </article>
      </section>



      <section
        v-show="isProfileTab('resumen')"
        class="student-profile__overview"
      >
        <header>
          <div>
            <span>VISTA GENERAL</span>
            <h2>Lo importante, a primera vista</h2>
          </div>

          <p>
            Desde aquí puedes entrar directamente al área
            académica que necesitas revisar.
          </p>
        </header>

        <div class="student-profile__quick-grid">
          <button
            type="button"
            class="amv-quick-card"
            @click="selectProfileTab('evaluaciones')"
          >
            <span class="amv-mini-thumb amv-mini-thumb--quiz" aria-hidden="true">
              <svg viewBox="0 0 48 48" role="img">
                <path d="M12 8h24a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Z"/>
                <path d="m15 24 5 5 13-14"/>
                <path d="M16 14h10"/>
              </svg>
            </span>
            <span>Evaluaciones</span>
            <strong>{{ studentQuizAttempts.length }}</strong>
            <small>{{ pendingQuizReviews }} pendientes de revisión</small>
          </button>

          <button
            type="button"
            class="amv-quick-card"
            @click="selectProfileTab('tareas')"
          >
            <span class="amv-mini-thumb amv-mini-thumb--tasks" aria-hidden="true">
              <svg viewBox="0 0 48 48" role="img">
                <path d="M12 9h24a3 3 0 0 1 3 3v25a3 3 0 0 1-3 3H12a3 3 0 0 1-3-3V12a3 3 0 0 1 3-3Z"/>
                <path d="M15 17h18M15 24h12M15 31h9"/>
              </svg>
            </span>
            <span>Tareas</span>
            <strong>{{ studentSubmissions.length }}</strong>
            <small>{{ reviewedSubmissions.length }} revisadas</small>
          </button>

          <button
            type="button"
            class="amv-quick-card"
            @click="selectProfileTab('asistencia')"
          >
            <span class="amv-mini-thumb amv-mini-thumb--attendance" aria-hidden="true">
              <svg viewBox="0 0 48 48" role="img">
                <circle cx="24" cy="24" r="15"/>
                <path d="M24 15v9l6 4"/>
              </svg>
            </span>
            <span>Asistencia</span>
            <strong>{{ attendancePercentage }}%</strong>
            <small>{{ pendingAttendanceCount }} clases pendientes</small>
          </button>

          <button
            type="button"
            class="amv-quick-card"
            @click="selectProfileTab('competencias')"
          >
            <span class="amv-mini-thumb amv-mini-thumb--skills" aria-hidden="true">
              <svg viewBox="0 0 48 48" role="img">
                <path d="m24 8 4.8 9.7L39 19.2l-7.5 7.3 1.8 10.3L24 31.9l-9.3 4.9 1.8-10.3L9 19.2l10.2-1.5L24 8Z"/>
              </svg>
            </span>
            <span>Competencias</span>
            <strong>{{ rubricCriteria.length }}</strong>
            <small>Afinación, ritmo, respiración y más</small>
          </button>

          <button
            type="button"
            class="amv-quick-card"
            @click="selectProfileTab('voz')"
          >
            <span class="amv-mini-thumb amv-mini-thumb--voice" aria-hidden="true">
              <svg viewBox="0 0 48 48" role="img">
                <path d="M24 10a5 5 0 0 1 5 5v10a5 5 0 1 1-10 0V15a5 5 0 0 1 5-5Z"/>
                <path d="M14 23a10 10 0 0 0 20 0M24 33v6M18 39h12"/>
              </svg>
            </span>
            <span>Perfil vocal</span>
            <strong>{{ vocalProfile?.voice || '—' }}</strong>
            <small>Tesitura, zona cómoda y observaciones</small>
          </button>
        </div>
      </section>


      <!-- ===================================================
           NAVEGACIÓN INTERNA
      ==================================================== -->
      <nav
        class="profile-nav student-profile__legacy-nav"
        aria-label="Secciones de la ficha"
      >
        <a href="#ficha-vocal">
          Ficha vocal
        </a>

        <a href="#asistencia">
          Asistencia
        </a>

        <a href="#progreso">
          Progreso
        </a>

        <a href="#evaluaciones">
          Entregas
        </a>

        <a href="#quiz-academicos">
          Quiz
        </a>
      </nav>

      <!-- =====================================================
           01 · FICHA VOCAL
      ====================================================== -->
      <section
        id="ficha-vocal"
        class="student-profile__section"
      
        v-show="isProfileTab('voz')"
      >
        <div class="student-profile__section-header">
          <div class="student-profile__section-title">
            <span class="amv-section-mark amv-section-mark--voice" title="Sección 01">
              <b>01</b>
              <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="12"/><path d="M14 20h12M20 14v12"/></svg>
            </span>

            <div>
              <p>
                Perfil técnico
              </p>

              <h2>
                Ficha vocal
              </h2>
            </div>
          </div>

          <p>
            Registro vocal, seguimiento y observaciones para acompañar el desarrollo del estudiante.
          </p>
        </div>

        <div class="vocal-card">
          <!-- ===============================================
               VISUALIZACIÓN
          ================================================ -->
          <template v-if="!isEditingVocalProfile">
            <div class="vocal-card__classification">
              <div>
                <span>
                  Clasificación vocal
                </span>

                <strong>
                  {{
                    vocalProfile?.voice ||
                    student.voice ||
                    'Sin clasificación'
                  }}
                </strong>
              </div>

              <button
                v-if="isTeacher"
                type="button"
                class="button-secondary"
                @click="startEditingVocalProfile"
              >
                Editar
              </button>
            </div>

            <div class="vocal-card__metrics">
              <article>
                <span>
                  Tesitura
                </span>

                <strong>
                  {{
                    getRangeLabel(
                      vocalProfile?.tessituraLow,
                      vocalProfile?.tessituraHigh
                    )
                  }}
                </strong>
              </article>

              <article>
                <span>
                  Zona cómoda
                </span>

                <strong>
                  {{
                    getRangeLabel(
                      vocalProfile?.comfortableLow,
                      vocalProfile?.comfortableHigh
                    )
                  }}
                </strong>
              </article>

              <article>
                <span>
                  Passaggio
                </span>

                <strong>
                  {{
                    vocalProfile?.passaggio ||
                    'Sin registrar'
                  }}
                </strong>
              </article>
            </div>

            <div class="vocal-card__observations">
              <span>
                Observaciones del profesor
              </span>

              <p>
                {{
                  vocalProfile?.observations ||
                  'Todavía no hay observaciones registradas.'
                }}
              </p>
            </div>

            <small
              v-if="vocalProfile?.updatedAt"
              class="vocal-card__updated"
            >
              Actualizada
              {{ formatDateTime(vocalProfile.updatedAt) }}
            </small>
          </template>

          <!-- ===============================================
               EDICIÓN
          ================================================ -->
          <form
            v-else
            class="vocal-form"
            @submit.prevent="saveVocalProfile"
          >
            <header class="vocal-form__header">
              <div>
                <span>
                  Profesor
                </span>

                <h3>
                  Editar ficha vocal
                </h3>
              </div>

              <strong>
                {{ student.name }}
              </strong>
            </header>

            <div class="vocal-form__grid">
              <label class="vocal-form__field">
                <span>
                  Clasificación vocal
                </span>

                <select
                  v-model="vocalForm.voice"
                  required
                >
                  <option value="Soprano">
                    Soprano
                  </option>

                  <option value="Alto">
                    Alto
                  </option>

                  <option value="Tenor">
                    Tenor
                  </option>

                  <option value="Bajo">
                    Bajo
                  </option>
                </select>
              </label>

              <label class="vocal-form__field">
                <span>
                  Passaggio
                </span>

                <input
                  v-model.trim="vocalForm.passaggio"
                  type="text"
                  placeholder="Ej: F#4 - G4"
                />
              </label>
            </div>

            <div class="vocal-form__ranges">
              <fieldset class="vocal-form__range-block">
                <legend>
                  Tesitura
                </legend>

                <div class="vocal-form__range">
                  <label class="vocal-form__field">
                    <span>
                      Nota inferior
                    </span>

                    <input
                      v-model.trim="vocalForm.tessituraLow"
                      type="text"
                      placeholder="Ej: C3"
                    />
                  </label>

                  <span
                    class="vocal-form__range-separator"
                    aria-hidden="true"
                  >
                    →
                  </span>

                  <label class="vocal-form__field">
                    <span>
                      Nota superior
                    </span>

                    <input
                      v-model.trim="vocalForm.tessituraHigh"
                      type="text"
                      placeholder="Ej: A4"
                    />
                  </label>
                </div>
              </fieldset>

              <fieldset class="vocal-form__range-block">
                <legend>
                  Zona cómoda
                </legend>

                <div class="vocal-form__range">
                  <label class="vocal-form__field">
                    <span>
                      Nota inferior
                    </span>

                    <input
                      v-model.trim="vocalForm.comfortableLow"
                      type="text"
                      placeholder="Ej: E3"
                    />
                  </label>

                  <span
                    class="vocal-form__range-separator"
                    aria-hidden="true"
                  >
                    →
                  </span>

                  <label class="vocal-form__field">
                    <span>
                      Nota superior
                    </span>

                    <input
                      v-model.trim="vocalForm.comfortableHigh"
                      type="text"
                      placeholder="Ej: G4"
                    />
                  </label>
                </div>
              </fieldset>
            </div>

            <label class="vocal-form__field">
              <span>
                Observaciones del profesor
              </span>

              <textarea
                v-model.trim="vocalForm.observations"
                rows="5"
                maxlength="1500"
                placeholder="Fortalezas, respiración, afinación, resonancia, interpretación..."
              ></textarea>
            </label>

            <div
              v-if="vocalSaveError"
              class="form-message form-message--error"
              role="alert"
            >
              {{ vocalSaveError }}
            </div>

            <footer class="vocal-form__actions">
              <button
                type="button"
                class="button-secondary"
                :disabled="isSavingVocalProfile"
                @click="cancelVocalProfileEdit"
              >
                Cancelar
              </button>

              <button
                type="submit"
                class="button-primary"
                :disabled="isSavingVocalProfile"
              >
                {{
                  isSavingVocalProfile
                    ? 'Guardando...'
                    : 'Guardar ficha'
                }}
              </button>
            </footer>
          </form>
        </div>
      </section>

      <!-- =====================================================
           02 · ASISTENCIA
      ====================================================== -->
      <section
        id="asistencia"
        class="student-profile__section"
      
        v-show="isProfileTab('asistencia')"
      >
        <div class="student-profile__section-header">
          <div class="student-profile__section-title">
            <span class="amv-section-mark amv-section-mark--attendance" title="Sección 02">
              <b>02</b>
              <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="12"/><path d="M14 20h12M20 14v12"/></svg>
            </span>

            <div>
              <p>
                Seguimiento
              </p>

              <h2>
                Asistencia
              </h2>
            </div>
          </div>

          <RouterLink
            v-if="isTeacher"
            to="/aula/asistencia"
            class="section-link"
          >
            Administrar
            <span aria-hidden="true">→</span>
          </RouterLink>
        </div>

        <div class="attendance-profile">
          <div class="attendance-profile__overview">
            <div
              class="attendance-profile__percentage"
              :class="attendanceHealthClass"
            >
              <strong>
                {{ attendancePercentage }}%
              </strong>

              <span>
                asistencia
              </span>
            </div>

            <div class="attendance-profile__progress">
              <div class="attendance-profile__progress-info">
                <span>
                  Clases con registro
                </span>

                <strong>
                  {{ registeredAttendanceCount }}
                  /
                  {{ lessons.length }}
                </strong>
              </div>

              <div class="attendance-profile__bar">
                <div
                  class="attendance-profile__fill"
                  :class="attendanceHealthClass"
                  :style="{
                    width: `${attendancePercentage}%`
                  }"
                ></div>
              </div>

              <p>
                El porcentaje se calcula sobre
                las clases donde existe un registro.
              </p>
            </div>
          </div>

          <div class="attendance-profile__stats">
            <article class="attendance-stat attendance-stat--present">
              <span>
                Presentes
              </span>

              <strong>
                {{ presentCount }}
              </strong>
            </article>

            <article class="attendance-stat attendance-stat--absent">
              <span>
                Ausencias
              </span>

              <strong>
                {{ absentCount }}
              </strong>
            </article>

            <article class="attendance-stat attendance-stat--justified">
              <span>
                Justificadas
              </span>

              <strong>
                {{ justifiedCount }}
              </strong>
            </article>

            <article>
              <span>
                Sin registrar
              </span>

              <strong>
                {{ pendingAttendanceCount }}
              </strong>
            </article>
          </div>

          <!-- ===============================================
               HISTORIAL
          ================================================ -->
          <div class="attendance-history">
            <header class="attendance-history__header">
              <div>
                <span>
                  Historial
                </span>

                <h3>
                  Clases del programa
                </h3>
              </div>
            </header>

            <div
              v-if="attendanceHistory.length"
              class="attendance-history__list"
            >
              <article
                v-for="item in attendanceHistory"
                :key="item.lesson.id"
                class="attendance-history__item"
              >
                <div class="attendance-history__lesson">
                  <span>
                    Clase
                    {{ getAcademicLessonNumber(item.lesson) }}
                  </span>

                  <strong>
                    {{ cleanLessonTitle(item.lesson.title) }}
                  </strong>

                  <small>
                    {{ formatLessonDate(item.lesson.date) }}
                  </small>
                </div>

                <div
                  class="attendance-history__status"
                  :class="
                    `attendance-history__status--${item.status}`
                  "
                >
                  {{
                    getAttendanceStatusLabel(
                      item.status
                    )
                  }}
                </div>

                <p
                  v-if="item.notes"
                  class="attendance-history__note"
                >
                  {{ item.notes }}
                </p>
              </article>
            </div>

            <div
              v-else
              class="empty-state empty-state--small"
            >
              <span>
                ♪
              </span>

              <div>
                <h3>
                  Sin clases registradas
                </h3>

                <p>
                  El historial aparecerá
                  cuando existan clases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- =====================================================
           03 · PROGRESO VOCAL
      ====================================================== -->
      <section
        id="progreso"
        class="student-profile__section"
      
        v-show="isProfileTab('competencias')"
      >
        <div class="student-profile__section-header">
          <div class="student-profile__section-title">
            <span class="amv-section-mark amv-section-mark--progress" title="Sección 03">
              <b>03</b>
              <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="12"/><path d="M14 20h12M20 14v12"/></svg>
            </span>

            <div>
              <p>
                Evaluación
              </p>

              <h2>
                Progreso vocal
              </h2>
            </div>
          </div>

          <p>
            Promedio de criterios evaluados
            mediante rúbricas.
          </p>
        </div>

        <div
          v-if="rubricProgress"
          class="rubric-overview"
        >
          <article
            v-for="criterion in rubricCriteria"
            :key="criterion.key"
            class="rubric-overview__item"
          >
            <div class="rubric-overview__top">
              <span>
                {{ criterion.label }}
              </span>

              <strong>
                {{ rubricProgress[criterion.key] }}
                <small>/ 5</small>
              </strong>
            </div>

            <div class="rubric-overview__bar">
              <div
                class="rubric-overview__fill"
                :style="{
                  width:
                    `${(
                      rubricProgress[criterion.key] /
                      5
                    ) * 100}%`
                }"
              ></div>
            </div>
          </article>
        </div>

        <div
          v-else
          class="empty-state"
        >
          <span>
            ♪
          </span>

          <div>
            <h3>
              Todavía no hay evaluaciones vocales
            </h3>

            <p>
              Los indicadores aparecerán
              cuando existan rúbricas evaluadas.
            </p>
          </div>
        </div>
      </section>

      <!-- =====================================================
           04 · ENTREGAS
      ====================================================== -->
      <section
        v-show="isProfileTab('tareas')"
        id="evaluaciones"
        class="student-profile__section"
      >
        <div class="student-profile__section-header">
          <div class="student-profile__section-title">
            <span class="amv-section-mark amv-section-mark--tasks" title="Sección 04">
              <b>04</b>
              <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="12"/><path d="M14 20h12M20 14v12"/></svg>
            </span>

            <div>
              <p>
                Historial
              </p>

              <h2>
                Entregas y evaluaciones
              </h2>
            </div>
          </div>

          <p>
            Trabajos enviados,
            calificaciones y retroalimentación.
          </p>
        </div>

        <div
          v-if="studentSubmissions.length"
          class="history"
        >
          <article
            v-for="submission in studentSubmissions"
            :key="submission.id"
            class="history-card"
          >
            <div class="amv-card-thumb amv-card-thumb--submission" aria-hidden="true">
              <svg viewBox="0 0 56 56" role="img">
                <path d="M16 8h18l8 8v31H16a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4Z"/>
                <path d="M34 8v10h8M20 28h18M20 36h13M20 20h8"/>
              </svg>
            </div>
            <div class="history-card__main">
              <div class="history-card__meta">
                <span
                  class="submission-status"
                  :class="
                    getSubmissionStatusClass(
                      submission
                    )
                  "
                >
                  {{ getStatusLabel(submission) }}
                </span>

                <span>
                  Clase
                  {{
                    getAcademicLessonNumberById(
                      submission.lessonId
                    )
                  }}
                </span>
              </div>

              <h3>
                {{
                  getTaskTitle(
                    submission.assignmentId
                  )
                }}
              </h3>

              <p>
                {{
                  submission.fileName ||
                  'Entrega registrada'
                }}
              </p>

              <small>
                {{
                  formatDate(
                    submission.submittedAt
                  )
                }}
              </small>

              <div
                v-if="submission.feedback"
                class="history-card__feedback"
              >
                <strong>
                  Retroalimentación
                </strong>

                <p>
                  {{ submission.feedback }}
                </p>
              </div>
            </div>

            <div class="history-card__actions">
              <div
                v-if="hasGrade(submission)"
                class="history-card__grade"
              >
                <span>
                  Nota
                </span>

                <strong>
                  {{ formatGrade(submission.grade) }}
                </strong>
              </div>

              <RouterLink
                v-if="isTeacher"
                :to="reviewLink(submission)"
                class="history-card__review"
              >
                Abrir revisión
              </RouterLink>

              <RouterLink
                v-else
                :to="
                  `/aula/clase/${submission.lessonId}/tarea/${submission.assignmentId}`
                "
                class="history-card__review"
              >
                Ver evaluación
              </RouterLink>
            </div>
          </article>
        </div>

        <div
          v-else
          class="empty-state"
        >
          <span>
            ✓
          </span>

          <div>
            <h3>
              Sin entregas todavía
            </h3>

            <p>
              Los trabajos enviados
              aparecerán aquí.
            </p>
          </div>
        </div>
      </section>

      <!-- =====================================================
           05 · QUIZZES Y EVALUACIONES INTERACTIVAS
      ====================================================== -->
      <section
        v-show="isProfileTab('evaluaciones')"
        id="quiz-academicos"
        class="student-profile__section"
      >
        <div class="student-profile__section-header">
          <div class="student-profile__section-title">
            <span class="amv-section-mark amv-section-mark--quiz" title="Sección 05">
              <b>05</b>
              <svg viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="12"/><path d="m14 20 4 4 8-9"/></svg>
            </span>

            <div>
              <p>Evaluación interactiva</p>
              <h2>Quiz y resultados</h2>
            </div>
          </div>

          <p>
            Intentos, porcentajes y estados de revisión
            sincronizados con el libro de notas.
          </p>
        </div>

        <div
          v-if="quizLoadWarning"
          class="academic-notice"
          role="status"
        >
          <strong>Sincronización parcial</strong>
          <p>{{ quizLoadWarning }}</p>
        </div>

        <div
          v-if="studentQuizAttempts.length"
          class="quiz-attempts"
        >
          <article
            v-for="attempt in studentQuizAttempts"
            :key="
              attempt.attemptId ??
              attempt.attempt_id ??
              attempt.id
            "
            class="quiz-attempt"
            :class="{
              'quiz-attempt--quiz':
                attempt.assessmentType === 'quiz',
              'quiz-attempt--test':
                attempt.assessmentType === 'test'
            }"
          >
            <div class="amv-card-thumb amv-card-thumb--quiz" aria-hidden="true">
              <svg viewBox="0 0 56 56" role="img">
                <circle cx="28" cy="28" r="19"/>
                <path d="m20 28 6 6 11-13"/>
              </svg>
            </div>
            <div class="quiz-attempt__main">
              <div class="quiz-attempt__meta">
                <span
                  class="quiz-attempt__status"
                  :class="
                    getQuizAttemptState(attempt)
                      .className
                  "
                >
                  {{
                    getQuizAttemptState(attempt)
                      .label
                  }}
                </span>

                <span>
                  Intento
                  {{
                    attempt.attemptNumber ??
                    attempt.attempt_number ??
                    '—'
                  }}
                </span>
              </div>

              <h3>
                {{ getQuizTitleForAttempt(attempt) }}
              </h3>

              <p>
                {{
                  attempt.lessonTitle ||
                  attempt.lesson_title ||
                  (
                    getAttemptLessonId(attempt)
                      ? `Clase ${getAcademicLessonNumberById(getAttemptLessonId(attempt))}`
                      : 'Evaluación del programa'
                  )
                }}
              </p>

              <small>
                {{
                  formatDate(
                    attempt.submittedAt ??
                    attempt.submitted_at ??
                    attempt.gradedAt ??
                    attempt.graded_at
                  )
                }}
              </small>
            </div>

            <div class="quiz-attempt__result">
              <span>Resultado</span>
              <strong>
                {{ formatQuizPercentage(attempt) }}
              </strong>

              <RouterLink
                v-if="isTeacher"
                :to="quizReviewLink(attempt)"
                class="history-card__review"
              >
                Abrir revisión
              </RouterLink>

              <RouterLink
                v-else-if="isFinishedAttempt(attempt)"
                :to="studentQuizResultLink(attempt)"
                class="history-card__review"
              >
                Ver resultado
              </RouterLink>
            </div>
          </article>
        </div>

        <div
          v-else
          class="empty-state"
        >
          <span>◎</span>

          <div>
            <h3>
              Sin evaluaciones realizadas
            </h3>

            <p>
              Los intentos de quiz del estudiante
              aparecerán aquí automáticamente.
            </p>
          </div>
        </div>
      </section>
    </template>

    <!-- =====================================================
         NO ENCONTRADO
    ====================================================== -->
    <section
      v-else
      class="empty-state"
    >
      <span>
        !
      </span>

      <div>
        <h3>
          Estudiante no encontrado
        </h3>

        <p>
          El perfil solicitado no existe
          o ya no está disponible.
        </p>

        <RouterLink
          to="/aula/alumnos"
          class="empty-state__link"
        >
          Volver a alumnos
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Transition name="toast">
      <div
        v-if="successMessage"
        class="profile-toast"
        role="status"
        aria-live="polite"
      >
        <span>
          ✓
        </span>

        {{ successMessage }}
      </div>
    </Transition>
  </section>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref
} from 'vue'

import {
  RouterLink,
  useRoute
} from 'vue-router'

import {
  fetchStudentById
} from '@/services/studentService'

import {
  fetchVocalProfileByStudent,
  upsertVocalProfile
} from '@/services/vocalProfileService'

import {
  fetchAttendanceByStudent
} from '@/services/attendanceService'

import {
  fetchAssignments
} from '@/services/assignmentService'

import {
  fetchSubmissions
} from '@/services/submissionService'

import {
  fetchLessons
} from '@/services/lessonService'

import {
  fetchQuizzes
} from '@/services/quizService'

import {
  fetchTeacherQuizAttempts
} from '@/services/teacherEvaluationService'

import {
  isFinishedAttempt
} from '@/services/evaluationHistoryService'

import {
  supabase
} from '@/lib/supabase'

import {
  useAuth
} from '@/composables/useAuth'

/* =========================================================
   BASE
========================================================= */

const route = useRoute()

const {
  isTeacher
} = useAuth()

const studentId =
  computed(() =>
    Number(
      route.params.studentId
    )
  )

const student = ref(null)
const assignments = ref([])
const submissions = ref([])
const lessons = ref([])
const studentAttendance = ref([])
const vocalProfile = ref(null)
const quizzes = ref([])
const quizAttempts = ref([])
const quizLoadWarning = ref('')

const isLoading = ref(true)
const loadError = ref('')
const successMessage = ref('')

let successTimer = null

/* =========================================================
   IDENTIDAD
========================================================= */

const initials =
  computed(() => {
    if (!student.value?.name) {
      return '?'
    }

    return String(
      student.value.name
    )
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
  })

/* =========================================================
   CARGAR PERFIL
========================================================= */

const loadProfile =
  async () => {
    isLoading.value = true
    loadError.value = ''
    quizLoadWarning.value = ''

    try {
      const [
        loadedStudent,
        loadedAssignments,
        loadedSubmissions,
        loadedLessons,
        loadedAttendance,
        loadedVocalProfile,
        loadedQuizzes
      ] = await Promise.all([
        fetchStudentById(
          studentId.value
        ),

        fetchAssignments(),

        fetchSubmissions(),

        fetchLessons(),

        fetchAttendanceByStudent(
          studentId.value
        ),

        fetchVocalProfileByStudent(
          studentId.value
        ),

        fetchQuizzes()
      ])

      student.value =
        loadedStudent || null

      assignments.value =
        (loadedAssignments || [])
          .filter(
            assignment =>
              assignment.status !==
              'draft'
          )

      submissions.value =
        loadedSubmissions || []

      lessons.value =
        loadedLessons || []

      studentAttendance.value =
        loadedAttendance || []

      vocalProfile.value =
        loadedVocalProfile || null

      quizzes.value =
        (loadedQuizzes || [])
          .filter(
            quiz =>
              quiz.status !== 'draft'
          )

      /*
       * V12 · CORRECCIÓN CRÍTICA
       *
       * Esta pantalla es la ficha de UN alumno.
       * Aunque quien la abre sea profesor, los intentos que debemos
       * mostrar pertenecen a route.params.studentId, no al usuario
       * autenticado y tampoco deben depender únicamente de un RPC
       * por quiz.
       *
       * Primero consultamos directamente quiz_attempts por student_id.
       * Luego enriquecemos cada intento con la información de quiz y
       * clase que ya cargamos arriba. Si RLS/compatibilidad impide esa
       * consulta directa, usamos como respaldo el RPC docente existente.
       */
      const targetStudentId =
        Number(studentId.value)

      let loadedQuizAttempts = []
      let directAttemptsError = null

      if (
        Number.isFinite(targetStudentId) &&
        targetStudentId > 0
      ) {
        const {
          data: directAttempts,
          error: directError,
        } =
          await supabase
            .from('quiz_attempts')
            .select(
              [
                'id',
                'quiz_id',
                'student_id',
                'attempt_number',
                'status',
                'score',
                'max_score',
                'percentage',
                'passed',
                'started_at',
                'submitted_at',
                'graded_at',
              ].join(', ')
            )
            .eq('student_id', targetStudentId)
            .order('id', { ascending: false })

        directAttemptsError = directError || null

        if (!directError && Array.isArray(directAttempts)) {
          loadedQuizAttempts =
            directAttempts.map(attempt => {
              const quiz =
                quizzes.value.find(
                  item =>
                    Number(item.id) ===
                    Number(attempt.quiz_id)
                ) || null

              const lesson =
                lessons.value.find(
                  item =>
                    Number(item.id) ===
                    Number(quiz?.lessonId ?? quiz?.lesson_id)
                ) || null

              return {
                attemptId: attempt.id,
                id: attempt.id,
                quizId: attempt.quiz_id,
                studentId: attempt.student_id,
                attemptNumber: attempt.attempt_number,
                status: attempt.status,
                score: attempt.score,
                maxScore: attempt.max_score,
                percentage: attempt.percentage,
                passed: attempt.passed,
                startedAt: attempt.started_at,
                submittedAt: attempt.submitted_at,
                gradedAt: attempt.graded_at,
                quizTitle: quiz?.title || 'Evaluación',
                lessonId: quiz?.lessonId ?? quiz?.lesson_id ?? null,
                lessonTitle: lesson?.title || '',
                assessmentType: quiz?.assessmentType ?? quiz?.assessment_type ?? null,
              }
            })
        }
      }

      /*
       * Fallback: conservamos el RPC docente ya instalado.
       * Esto protege instalaciones donde la política RLS no permite
       * SELECT directo sobre quiz_attempts, pero sí el RPC.
       */
      if (!loadedQuizAttempts.length) {
        const settledAttempts =
          await Promise.allSettled(
            quizzes.value.map(
              quiz =>
                fetchTeacherQuizAttempts(
                  quiz.id
                )
            )
          )

        loadedQuizAttempts =
          settledAttempts
            .filter(
              result =>
                result.status === 'fulfilled'
            )
            .flatMap(
              result =>
                Array.isArray(result.value)
                  ? result.value
                  : []
            )
            .filter(
              attempt =>
                getAttemptStudentId(attempt) ===
                targetStudentId
            )

        const failedQuizLoads =
          settledAttempts.filter(
            result =>
              result.status === 'rejected'
          ).length

        if (
          failedQuizLoads &&
          !directAttemptsError
        ) {
          quizLoadWarning.value =
            `No se pudieron sincronizar ${failedQuizLoads} evaluación${failedQuizLoads === 1 ? '' : 'es'} mediante el respaldo docente.`
        }
      }

      quizAttempts.value =
        loadedQuizAttempts

      if (
        !quizAttempts.value.length &&
        directAttemptsError
      ) {
        console.error(
          'No fue posible cargar los intentos del alumno:',
          directAttemptsError
        )

        quizLoadWarning.value =
          'No fue posible sincronizar los intentos de evaluación del estudiante.'
      }
    } catch (error) {
      console.error(
        'Error cargando ficha del estudiante:',
        error
      )

      student.value = null
      assignments.value = []
      submissions.value = []
      lessons.value = []
      studentAttendance.value = []
      vocalProfile.value = null
      quizzes.value = []
      quizAttempts.value = []

      loadError.value =
        error?.message ||
        'No se pudo cargar la ficha del estudiante.'
    } finally {
      isLoading.value = false
    }
  }

/* =========================================================
   NUMERACIÓN ACADÉMICA
========================================================= */

const getLessonUnitId =
  lesson =>
    lesson?.unitId ??
    lesson?.unit_id ??
    null

/*
 * El id de Supabase identifica la fila.
 * El número académico corresponde a la
 * posición dentro de la unidad.
 */
const getAcademicLessonNumber =
  lesson => {
    if (!lesson) {
      return 0
    }

    const unitId =
      getLessonUnitId(
        lesson
      )

    const unitLessons =
      lessons.value.filter(
        item => {
          const itemUnitId =
            getLessonUnitId(
              item
            )

          if (
            unitId === null
          ) {
            return (
              itemUnitId === null
            )
          }

          return (
            String(itemUnitId) ===
            String(unitId)
          )
        }
      )

    const unitIndex =
      unitLessons.findIndex(
        item =>
          Number(item.id) ===
          Number(lesson.id)
      )

    if (unitIndex >= 0) {
      return unitIndex + 1
    }

    const globalIndex =
      lessons.value.findIndex(
        item =>
          Number(item.id) ===
          Number(lesson.id)
      )

    return globalIndex >= 0
      ? globalIndex + 1
      : 0
  }

const getAcademicLessonNumberById =
  lessonId => {
    const lesson =
      lessons.value.find(
        item =>
          Number(item.id) ===
          Number(lessonId)
      )

    return lesson
      ? getAcademicLessonNumber(
          lesson
        )
      : '—'
  }

const cleanLessonTitle =
  title => {
    if (!title) {
      return 'Clase sin título'
    }

    return String(title)
      .replace(
        /^\s*clase\s+\d+\s*[·:–—-]?\s*/i,
        ''
      )
      .trim()
  }

/* =========================================================
   ENTREGAS
========================================================= */

const studentSubmissions =
  computed(() => {
    if (!student.value) {
      return []
    }

    return submissions.value
      .filter(
        submission =>
          Number(
            submission.studentId
          ) ===
          Number(
            student.value.id
          )
      )
      .sort(
        (a, b) =>
          new Date(
            b.submittedAt ||
            b.createdAt ||
            0
          ) -
          new Date(
            a.submittedAt ||
            a.createdAt ||
            0
          )
      )
  })

const reviewedSubmissions =
  computed(() =>
    studentSubmissions.value.filter(
      submission =>
        submission.status ===
          'reviewed' ||
        submission.status ===
          'returned' ||
        Boolean(
          submission.reviewedAt
        ) ||
        hasGrade(
          submission
        )
    )
  )

const averageGrade =
  computed(() => {
    const grades =
      reviewedSubmissions.value
        .map(
          submission =>
            Number(
              submission.grade
            )
        )
        .filter(
          grade =>
            Number.isFinite(
              grade
            ) &&
            grade > 0
        )

    if (!grades.length) {
      return '—'
    }

    return (
      grades.reduce(
        (
          sum,
          grade
        ) =>
          sum + grade,
        0
      ) /
      grades.length
    ).toFixed(1)
  })

/* =========================================================
   ASISTENCIA
========================================================= */

const validAttendance =
  computed(() =>
    studentAttendance.value.filter(
      record =>
        record.status ===
          'present' ||
        record.status ===
          'absent' ||
        record.status ===
          'justified'
    )
  )

const presentCount =
  computed(() =>
    validAttendance.value.filter(
      record =>
        record.status ===
        'present'
    ).length
  )

const absentCount =
  computed(() =>
    validAttendance.value.filter(
      record =>
        record.status ===
        'absent'
    ).length
  )

const justifiedCount =
  computed(() =>
    validAttendance.value.filter(
      record =>
        record.status ===
        'justified'
    ).length
  )

const registeredAttendanceCount =
  computed(() =>
    validAttendance.value.length
  )

const pendingAttendanceCount =
  computed(() =>
    Math.max(
      lessons.value.length -
        registeredAttendanceCount.value,
      0
    )
  )

const attendancePercentage =
  computed(() => {
    if (
      registeredAttendanceCount.value ===
      0
    ) {
      return 0
    }

    return Math.round(
      (
        presentCount.value /
        registeredAttendanceCount.value
      ) * 100
    )
  })

const attendanceHealthClass =
  computed(() => {
    if (
      attendancePercentage.value >=
      85
    ) {
      return 'attendance-health--good'
    }

    if (
      attendancePercentage.value >=
      70
    ) {
      return 'attendance-health--warning'
    }

    return 'attendance-health--low'
  })

const attendanceHistory =
  computed(() =>
    lessons.value.map(
      lesson => {
        const record =
          studentAttendance.value.find(
            item =>
              Number(
                item.lessonId
              ) ===
              Number(
                lesson.id
              )
          )

        return {
          lesson,

          status:
            record?.status ||
            'pending',

          notes:
            record?.notes ||
            ''
        }
      }
    )
  )

/* =========================================================
   FICHA VOCAL
========================================================= */

const isEditingVocalProfile =
  ref(false)

const isSavingVocalProfile =
  ref(false)

const vocalSaveError =
  ref('')

const vocalForm =
  reactive({
    voice: '',
    tessituraLow: '',
    tessituraHigh: '',
    comfortableLow: '',
    comfortableHigh: '',
    passaggio: '',
    observations: ''
  })

const startEditingVocalProfile =
  () => {
    if (!student.value) {
      return
    }

    vocalSaveError.value = ''

    vocalForm.voice =
      vocalProfile.value?.voice ||
      student.value.voice ||
      ''

    vocalForm.tessituraLow =
      vocalProfile.value?.tessituraLow ||
      ''

    vocalForm.tessituraHigh =
      vocalProfile.value?.tessituraHigh ||
      ''

    vocalForm.comfortableLow =
      vocalProfile.value?.comfortableLow ||
      ''

    vocalForm.comfortableHigh =
      vocalProfile.value?.comfortableHigh ||
      ''

    vocalForm.passaggio =
      vocalProfile.value?.passaggio ||
      ''

    vocalForm.observations =
      vocalProfile.value?.observations ||
      ''

    isEditingVocalProfile.value =
      true
  }

const cancelVocalProfileEdit =
  () => {
    if (
      isSavingVocalProfile.value
    ) {
      return
    }

    vocalSaveError.value = ''
    isEditingVocalProfile.value =
      false
  }

const saveVocalProfile =
  async () => {
    if (
      !student.value ||
      isSavingVocalProfile.value
    ) {
      return
    }

    if (!vocalForm.voice) {
      vocalSaveError.value =
        'Selecciona una clasificación vocal.'

      return
    }

    isSavingVocalProfile.value =
      true

    vocalSaveError.value = ''

    try {
      const savedProfile =
        await upsertVocalProfile({
          studentId:
            student.value.id,

          voice:
            vocalForm.voice,

          tessituraLow:
            vocalForm.tessituraLow,

          tessituraHigh:
            vocalForm.tessituraHigh,

          comfortableLow:
            vocalForm.comfortableLow,

          comfortableHigh:
            vocalForm.comfortableHigh,

          passaggio:
            vocalForm.passaggio,

          observations:
            vocalForm.observations
        })

      vocalProfile.value =
        savedProfile

      /*
       * Mantiene visible la nueva
       * clasificación inmediatamente.
       */
      if (
        student.value &&
        vocalForm.voice
      ) {
        student.value = {
          ...student.value,
          voice:
            vocalForm.voice
        }
      }

      isEditingVocalProfile.value =
        false

      showSuccessMessage(
        'Ficha vocal guardada correctamente.'
      )
    } catch (error) {
      console.error(
        'Error guardando ficha vocal:',
        error
      )

      vocalSaveError.value =
        error?.message ||
        'No se pudo guardar la ficha vocal.'
    } finally {
      isSavingVocalProfile.value =
        false
    }
  }

/* =========================================================
   RÚBRICA
========================================================= */


/* =========================================================
   EVALUACIONES INTERACTIVAS · V10
========================================================= */

const getAttemptStudentId =
  attempt =>
    Number(
      attempt?.studentId ??
      attempt?.student_id ??
      attempt?.userId ??
      attempt?.user_id
    )

const studentQuizAttempts =
  computed(() =>
    quizAttempts.value
      .filter(
        attempt =>
          getAttemptStudentId(attempt) ===
          Number(studentId.value)
      )
      .sort(
        (a, b) =>
          new Date(
            b.submittedAt ??
            b.submitted_at ??
            b.gradedAt ??
            b.graded_at ??
            0
          ) -
          new Date(
            a.submittedAt ??
            a.submitted_at ??
            a.gradedAt ??
            a.graded_at ??
            0
          )
      )
  )

const completedQuizAttempts =
  computed(() =>
    studentQuizAttempts.value.filter(
      attempt =>
        Number.isFinite(
          Number(attempt?.percentage)
        )
    )
  )

const quizAveragePercentage =
  computed(() => {
    if (!completedQuizAttempts.value.length) {
      return null
    }

    const total =
      completedQuizAttempts.value.reduce(
        (sum, attempt) =>
          sum +
          Number(attempt.percentage || 0),
        0
      )

    return Math.round(
      total /
      completedQuizAttempts.value.length
    )
  })

const passedQuizAttempts =
  computed(() =>
    completedQuizAttempts.value.filter(
      attempt =>
        attempt?.passed === true
    ).length
  )

const pendingQuizReviews =
  computed(() =>
    studentQuizAttempts.value.filter(
      attempt => {
        const status =
          String(
            attempt?.status || ''
          ).toLowerCase()

        return (
          status === 'submitted' ||
          status === 'pending' ||
          status === 'pending_review'
        )
      }
    ).length
  )

const quizById =
  quizId =>
    quizzes.value.find(
      quiz =>
        Number(quiz.id) ===
        Number(quizId)
    ) || null

const getAttemptQuizId =
  attempt =>
    Number(
      attempt?.quizId ??
      attempt?.quiz_id
    )

const getQuizTitleForAttempt =
  attempt =>
    attempt?.quizTitle ||
    attempt?.quiz_title ||
    quizById(
      getAttemptQuizId(attempt)
    )?.title ||
    'Evaluación'

const getAttemptLessonId =
  attempt =>
    Number(
      attempt?.lessonId ??
      attempt?.lesson_id ??
      quizById(
        getAttemptQuizId(attempt)
      )?.lessonId ??
      quizById(
        getAttemptQuizId(attempt)
      )?.lesson_id
    )

const formatQuizPercentage =
  attempt => {
    const value =
      Number(attempt?.percentage)

    return Number.isFinite(value)
      ? `${Math.round(value)}%`
      : 'Pendiente'
  }

const getQuizAttemptState =
  attempt => {
    const status =
      String(
        attempt?.status || ''
      ).toLowerCase()

    if (
      status === 'submitted' ||
      status === 'pending' ||
      status === 'pending_review'
    ) {
      return {
        label: 'Por revisar',
        className:
          'quiz-attempt__status--pending'
      }
    }

    if (attempt?.passed === true) {
      return {
        label: 'Aprobada',
        className:
          'quiz-attempt__status--passed'
      }
    }

    if (
      attempt?.passed === false &&
      Number.isFinite(
        Number(attempt?.percentage)
      )
    ) {
      return {
        label: 'Por reforzar',
        className:
          'quiz-attempt__status--reinforce'
      }
    }

    return {
      label: 'Registrada',
      className:
        'quiz-attempt__status--neutral'
    }
  }

const quizReviewLink =
  attempt => {
    const lessonId =
      getAttemptLessonId(attempt)

    const quizId =
      getAttemptQuizId(attempt)

    const attemptId =
      attempt?.attemptId ??
      attempt?.attempt_id ??
      attempt?.id

    if (
      !lessonId ||
      !quizId ||
      !attemptId
    ) {
      return '/aula/calificaciones'
    }

    return (
      `/aula/clase/${lessonId}` +
      `/evaluacion/${quizId}` +
      `/intentos/${attemptId}/revisar`
    )
  }

const studentQuizResultLink =
  attempt => {
    const attemptId =
      attempt?.attemptId ??
      attempt?.attempt_id ??
      attempt?.id

    return attemptId
      ? `/aula/evaluaciones/intento/${attemptId}`
      : '/aula/evaluaciones'
  }

const rubricCriteria = [
  {
    key: 'tuning',
    label: 'Afinación'
  },
  {
    key: 'rhythm',
    label: 'Ritmo'
  },
  {
    key: 'breathing',
    label: 'Respiración'
  },
  {
    key: 'diction',
    label: 'Dicción'
  },
  {
    key: 'interpretation',
    label: 'Interpretación'
  }
]

const rubricProgress =
  computed(() => {
    const evaluated =
      reviewedSubmissions.value.filter(
        submission =>
          submission.rubric
      )

    if (!evaluated.length) {
      return null
    }

    const result = {}

    rubricCriteria.forEach(
      criterion => {
        const values =
          evaluated
            .map(
              submission =>
                Number(
                  submission.rubric?.[
                    criterion.key
                  ]
                )
            )
            .filter(
              value =>
                Number.isFinite(
                  value
                ) &&
                value > 0
            )

        if (!values.length) {
          result[
            criterion.key
          ] = 0

          return
        }

        result[
          criterion.key
        ] =
          Number(
            (
              values.reduce(
                (
                  sum,
                  value
                ) =>
                  sum + value,
                0
              ) /
              values.length
            ).toFixed(1)
          )
      }
    )

    return result
  })

/* =========================================================
   UTILIDADES
========================================================= */

const getTaskTitle =
  assignmentId => {
    const task =
      assignments.value.find(
        assignment =>
          Number(
            assignment.id
          ) ===
          Number(
            assignmentId
          )
      )

    return (
      task?.title ||
      'Tarea'
    )
  }

const reviewLink =
  submission =>
    `/aula/clase/${submission.lessonId}` +
    `/tarea/${submission.assignmentId}` +
    `/entregas/${submission.id}`

const getStatusLabel =
  submission => {
    if (
      submission.status ===
      'returned'
    ) {
      return 'Devuelto'
    }

    if (
      submission.status ===
        'reviewed' ||
      submission.reviewedAt
    ) {
      return 'Revisado'
    }

    return 'Entregado'
  }

const getSubmissionStatusClass =
  submission => {
    if (
      submission.status ===
      'returned'
    ) {
      return 'submission-status--returned'
    }

    if (
      submission.status ===
        'reviewed' ||
      submission.reviewedAt
    ) {
      return 'submission-status--reviewed'
    }

    return 'submission-status--delivered'
  }

const hasGrade =
  submission =>
    submission?.grade !== null &&
    submission?.grade !== undefined &&
    submission?.grade !== '' &&
    Number.isFinite(
      Number(
        submission.grade
      )
    )

const formatGrade =
  value => {
    const grade =
      Number(value)

    return Number.isFinite(
      grade
    )
      ? grade.toFixed(1)
      : '—'
  }

const getAttendanceStatusLabel =
  status => {
    const labels = {
      present: 'Presente',
      absent: 'Ausente',
      justified: 'Justificado',
      pending: 'Sin registrar'
    }

    return (
      labels[status] ||
      'Sin registrar'
    )
  }

const getRangeLabel =
  (
    low,
    high
  ) => {
    if (!low && !high) {
      return 'Sin registrar'
    }

    if (low && high) {
      return `${low} — ${high}`
    }

    return low || high
  }

/* =========================================================
   FECHAS
========================================================= */

const formatLessonDate =
  value => {
    if (!value) {
      return 'Sin fecha'
    }

    const raw =
      String(value).trim()

    const isoMatch =
      raw.match(
        /^(\d{4})-(\d{2})-(\d{2})$/
      )

    if (!isoMatch) {
      return raw
    }

    const [
      ,
      year,
      month,
      day
    ] = isoMatch

    const date =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day)
      )

    return new Intl.DateTimeFormat(
      'es-CL',
      {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      }
    ).format(date)
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
        date.getTime()
      )
    ) {
      return String(value)
    }

    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium'
      }
    ).format(date)
  }

const formatDateTime =
  value => {
    if (!value) {
      return ''
    }

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {
      return String(value)
    }

    return new Intl.DateTimeFormat(
      'es-CL',
      {
        dateStyle: 'medium',
        timeStyle: 'short'
      }
    ).format(date)
  }

/* =========================================================
   MENSAJES
========================================================= */

const showSuccessMessage =
  message => {
    successMessage.value =
      message

    if (successTimer) {
      window.clearTimeout(
        successTimer
      )
    }

    successTimer =
      window.setTimeout(
        () => {
          successMessage.value =
            ''
        },
        3500
      )
  }

/* =========================================================
   VIDA
========================================================= */

onMounted(
  loadProfile
)

onBeforeUnmount(() => {
  if (successTimer) {
    window.clearTimeout(
      successTimer
    )
  }
})

/* =========================================================
   V11 · CONTEXT NAVIGATION
   Una sola subvista académica visible a la vez.
========================================================= */

const profileTabs = [
  {
    id: 'resumen',
    label: 'Resumen',
    shortLabel: 'Resumen',
  },
  {
    id: 'evaluaciones',
    label: 'Evaluaciones',
    shortLabel: 'Evaluaciones',
  },
  {
    id: 'tareas',
    label: 'Tareas',
    shortLabel: 'Tareas',
  },
  {
    id: 'asistencia',
    label: 'Asistencia',
    shortLabel: 'Asistencia',
  },
  {
    id: 'competencias',
    label: 'Competencias',
    shortLabel: 'Competencias',
  },
  {
    id: 'voz',
    label: 'Perfil vocal',
    shortLabel: 'Voz',
  },
]

const activeProfileTab =
  ref('resumen')

const selectProfileTab =
  tabId => {
    if (
      !profileTabs.some(
        tab => tab.id === tabId
      )
    ) {
      return
    }

    /*
     * V11.1:
     * Cambiamos de panel sin forzar scroll.
     * La barra contextual permanece estable y sticky.
     */
    activeProfileTab.value = tabId
  }

const isProfileTab =
  tabId =>
    activeProfileTab.value === tabId


</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.student-profile {
  width: 100%;
  max-width: 1200px;

  margin: 0 auto;

  padding-bottom:
    variables.$spacing-4xl;
}

.student-profile__back {
  display: inline-flex;

  min-height: 42px;

  gap:
    variables.$spacing-sm;

  align-items: center;

  margin-bottom:
    variables.$spacing-xl;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;

  transition:
    color
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.student-profile__back:hover {
  color:
    variables.$color-primary;

  transform:
    translateX(-3px);
}

/* =========================================================
   HERO
========================================================= */

.student-profile__hero {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: center;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-lg;

  padding:
    variables.$spacing-2xl;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-xl;

  background:
    linear-gradient(
      145deg,
      variables.$color-surface-elevated,
      variables.$color-surface
    );
}

.student-profile__identity {
  display: flex;

  min-width: 0;

  gap:
    variables.$spacing-xl;

  align-items: center;
}

.student-profile__avatar {
  display: grid;

  width: 86px;
  height: 86px;

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

  font-size: 1.6rem;

  font-weight:
    variables.$font-weight-semibold;
}

.student-profile__identity-copy {
  min-width: 0;
}

.student-profile__eyebrow {
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
    0.1em;

  text-transform:
    uppercase;
}

.student-profile__identity-copy h1 {
  overflow: hidden;

  margin: 0;

  font-size:
    clamp(
      2.35rem,
      5vw,
      4.2rem
    );

  line-height: 1;

  text-overflow: ellipsis;
}

.student-profile__badges {
  display: flex;

  gap:
    variables.$spacing-sm;

  flex-wrap: wrap;

  margin-top:
    variables.$spacing-md;
}

.voice-badge,
.status-badge {
  display: inline-flex;

  min-height: 34px;

  gap: 7px;

  align-items: center;

  padding:
    0
    0.8rem;

  border-radius:
    variables.$radius-pill;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;
}

.voice-badge {
  border:
    1px solid
    variables.$color-border-primary;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.05
    );
}

.status-badge {
  border:
    1px solid
    rgba(
      variables.$color-success,
      0.25
    );

  color:
    variables.$color-success;

  background:
    variables.$color-success-soft;
}

.status-badge i {
  width: 6px;
  height: 6px;

  border-radius: 50%;

  background:
    currentColor;
}

.status-badge--inactive {
  border-color:
    variables.$color-border;

  color:
    variables.$color-text-muted;

  background:
    variables.$color-surface-light;
}

.student-profile__edit-profile {
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

.student-profile__edit-profile:hover {
  border-color:
    variables.$color-primary;
}

/* =========================================================
   SUMMARY
========================================================= */

.student-profile__summary {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  margin-bottom:
    variables.$spacing-lg;
}

.student-profile__summary article {
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

.student-profile__summary span,
.student-profile__summary strong,
.student-profile__summary small {
  display: block;
}

.student-profile__summary span {
  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.student-profile__summary strong {
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

.student-profile__summary small {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.student-profile__summary
.summary-card--primary {
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

.student-profile__summary
.summary-card--primary strong {
  color:
    variables.$color-primary;
}

/* =========================================================
   PROFILE NAV
========================================================= */

.profile-nav {
  position: sticky;

  top: 92px;

  z-index: 20;

  display: flex;

  gap:
    variables.$spacing-xs;

  overflow-x: auto;

  margin-bottom:
    variables.$spacing-3xl;

  padding:
    variables.$spacing-sm;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    rgba(
      variables.$color-surface,
      0.94
    );

  backdrop-filter:
    blur(12px);

  scrollbar-width: none;
}

.profile-nav::-webkit-scrollbar {
  display: none;
}

.profile-nav a {
  min-height: 40px;

  display: inline-flex;

  flex: 0 0 auto;

  align-items: center;

  padding:
    0
    variables.$spacing-md;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;
}

.profile-nav a:hover {
  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.06
    );
}

/* =========================================================
   SECTIONS
========================================================= */

.student-profile__section {
  scroll-margin-top: 160px;

  margin-bottom:
    variables.$spacing-4xl;
}

.student-profile__section-header {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: flex-end;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-xl;
}

.student-profile__section-title {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;
}

.student-profile__section-title > span {
  display: grid;

  width: 48px;
  height: 48px;

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
      0.04
    );

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.student-profile__section-title p {
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

.student-profile__section-title h2 {
  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    clamp(
      1.55rem,
      3vw,
      2rem
    );

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.03em;
}

.student-profile__section-header > p {
  max-width: 360px;

  margin: 0;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;

  line-height: 1.6;

  text-align: right;
}

.section-link {
  display: inline-flex;

  gap:
    variables.$spacing-sm;

  align-items: center;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

/* =========================================================
   VOCAL CARD
========================================================= */

.vocal-card,
.attendance-profile,
.rubric-overview {
  padding:
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-xl;

  background:
    variables.$color-surface;
}

.vocal-card__classification {
  display: flex;

  gap:
    variables.$spacing-xl;

  align-items: center;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-xl;

  padding-bottom:
    variables.$spacing-xl;

  border-bottom:
    1px solid
    variables.$color-border-soft;
}

.vocal-card__classification span,
.vocal-card__classification strong {
  display: block;
}

.vocal-card__classification span {
  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.vocal-card__classification strong {
  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-2xl;

  font-weight:
    variables.$font-weight-semibold;
}

.vocal-card__metrics {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );

  margin-bottom:
    variables.$spacing-xl;
}

.vocal-card__metrics article {
  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-background;
}

.vocal-card__metrics span,
.vocal-card__metrics strong {
  display: block;
}

.vocal-card__metrics span {
  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.vocal-card__metrics strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;
}

.vocal-card__observations {
  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-background;
}

.vocal-card__observations > span {
  display: block;

  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.05em;

  text-transform:
    uppercase;
}

.vocal-card__observations p {
  margin: 0;

  color:
    variables.$color-text-secondary;

  line-height: 1.7;
}

.vocal-card__updated {
  display: block;

  margin-top:
    variables.$spacing-md;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

/* =========================================================
   BUTTONS
========================================================= */

.button-primary,
.button-secondary {
  min-height:
    variables.$control-height-md;

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

.button-primary {
  border:
    1px solid
    variables.$color-primary;

  color:
    variables.$color-black;

  background:
    variables.$color-primary;
}

.button-secondary {
  border:
    1px solid
    variables.$color-border;

  color:
    variables.$color-text-primary;

  background:
    transparent;
}

.button-secondary:hover {
  border-color:
    variables.$color-primary;
}

.button-primary:disabled,
.button-secondary:disabled {
  cursor: wait;

  opacity: 0.5;
}

/* =========================================================
   VOCAL FORM
========================================================= */

.vocal-form {
  display: grid;

  gap:
    variables.$spacing-xl;
}

.vocal-form__header {
  display: flex;

  gap:
    variables.$spacing-lg;

  align-items: center;
  justify-content: space-between;

  padding-bottom:
    variables.$spacing-lg;

  border-bottom:
    1px solid
    variables.$color-border-soft;
}

.vocal-form__header span {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  text-transform:
    uppercase;
}

.vocal-form__header h3 {
  margin: 0;

  font-family:
    variables.$font-family-primary;
}

.vocal-form__header > strong {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.vocal-form__grid,
.vocal-form__ranges {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

.vocal-form__range-block {
  min-width: 0;

  margin: 0;

  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-background;
}

.vocal-form__range-block legend {
  padding:
    0
    variables.$spacing-sm;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.vocal-form__range {
  display: grid;

  gap:
    variables.$spacing-sm;

  align-items: end;

  grid-template-columns:
    1fr
    auto
    1fr;
}

.vocal-form__range-separator {
  padding-bottom:
    0.85rem;

  color:
    variables.$color-text-muted;
}

.vocal-form__field {
  display: grid;

  gap:
    variables.$spacing-sm;
}

.vocal-form__field > span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.vocal-form__field input,
.vocal-form__field select,
.vocal-form__field textarea {
  width: 100%;
  min-height:
    variables.$control-height-md;

  padding:
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

  font: inherit;

  transition:
    border-color
      variables.$transition-fast,
    box-shadow
      variables.$transition-fast;
}

.vocal-form__field textarea {
  min-height: 130px;

  resize: vertical;
}

.vocal-form__field input:focus-visible,
.vocal-form__field select:focus-visible,
.vocal-form__field textarea:focus-visible {
  border-color:
    variables.$color-primary;

  box-shadow:
    0 0 0 3px
    rgba(
      variables.$color-primary,
      0.08
    );
}

.vocal-form__actions {
  display: flex;

  gap:
    variables.$spacing-md;

  justify-content: flex-end;
}

.form-message {
  padding:
    variables.$spacing-md;

  border-radius:
    variables.$radius-md;
}

.form-message--error {
  border:
    1px solid
    rgba(
      variables.$color-danger,
      0.25
    );

  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
}

/* =========================================================
   ATTENDANCE
========================================================= */

.attendance-profile__overview {
  display: grid;

  gap:
    variables.$spacing-xl;

  align-items: center;

  grid-template-columns:
    auto
    minmax(0, 1fr);

  margin-bottom:
    variables.$spacing-xl;
}

.attendance-profile__percentage {
  display: grid;

  width: 138px;
  height: 138px;

  place-items: center;
  align-content: center;

  border:
    1px solid
    variables.$color-border;

  border-radius: 50%;

  background:
    variables.$color-background;
}

.attendance-profile__percentage strong {
  font-size:
    2.2rem;

  font-weight:
    variables.$font-weight-semibold;

  line-height: 1;

  font-variant-numeric:
    tabular-nums;
}

.attendance-profile__percentage span {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.attendance-health--good {
  color:
    variables.$color-success;
}

.attendance-health--warning {
  color:
    variables.$color-warning;
}

.attendance-health--low {
  color:
    variables.$color-danger;
}

.attendance-profile__percentage.attendance-health--good {
  border-color:
    rgba(
      variables.$color-success,
      0.25
    );
}

.attendance-profile__percentage.attendance-health--warning {
  border-color:
    rgba(
      variables.$color-warning,
      0.25
    );
}

.attendance-profile__percentage.attendance-health--low {
  border-color:
    rgba(
      variables.$color-danger,
      0.25
    );
}

.attendance-profile__progress-info {
  display: flex;

  gap:
    variables.$spacing-md;

  justify-content:
    space-between;

  margin-bottom:
    variables.$spacing-sm;
}

.attendance-profile__progress-info span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.attendance-profile__progress-info strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;
}

.attendance-profile__bar {
  overflow: hidden;

  height: 6px;

  border-radius:
    variables.$radius-pill;

  background:
    variables.$color-border;
}

.attendance-profile__fill {
  height: 100%;

  border-radius: inherit;

  background:
    currentColor;

  transition:
    width
      variables.$transition-normal;
}

.attendance-profile__progress > p {
  margin:
    variables.$spacing-sm
    0
    0;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.attendance-profile__stats {
  display: grid;

  gap:
    variables.$spacing-md;

  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );

  margin-bottom:
    variables.$spacing-2xl;
}

.attendance-profile__stats article {
  padding:
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-background;
}

.attendance-profile__stats span,
.attendance-profile__stats strong {
  display: block;
}

.attendance-profile__stats span {
  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.attendance-profile__stats strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-xl;

  font-weight:
    variables.$font-weight-semibold;
}

.attendance-stat--present strong {
  color:
    variables.$color-success;
}

.attendance-stat--absent strong {
  color:
    variables.$color-danger;
}

.attendance-stat--justified strong {
  color:
    variables.$color-warning;
}

/* =========================================================
   ATTENDANCE HISTORY
========================================================= */

.attendance-history {
  padding-top:
    variables.$spacing-xl;

  border-top:
    1px solid
    variables.$color-border-soft;
}

.attendance-history__header {
  display: flex;

  align-items: center;
  justify-content: space-between;

  margin-bottom:
    variables.$spacing-lg;
}

.attendance-history__header span {
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
    0.07em;

  text-transform:
    uppercase;
}

.attendance-history__header h3 {
  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-md;
}

.attendance-history__list {
  display: grid;

  gap:
    variables.$spacing-sm;
}

.attendance-history__item {
  display: grid;

  gap:
    variables.$spacing-md;

  align-items: center;

  grid-template-columns:
    minmax(0, 1fr)
    auto;

  padding:
    variables.$spacing-md
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-md;

  background:
    variables.$color-background;
}

.attendance-history__lesson span,
.attendance-history__lesson strong,
.attendance-history__lesson small {
  display: block;
}

.attendance-history__lesson span {
  margin-bottom: 3px;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  text-transform:
    uppercase;
}

.attendance-history__lesson strong {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;
}

.attendance-history__lesson small {
  margin-top: 4px;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.attendance-history__status {
  display: inline-flex;

  min-height: 32px;

  align-items: center;

  padding:
    0
    0.75rem;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-pill;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;

  white-space: nowrap;
}

.attendance-history__status--present {
  border-color:
    rgba(
      variables.$color-success,
      0.25
    );

  color:
    variables.$color-success;

  background:
    variables.$color-success-soft;
}

.attendance-history__status--absent {
  border-color:
    rgba(
      variables.$color-danger,
      0.25
    );

  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
}

.attendance-history__status--justified {
  border-color:
    rgba(
      variables.$color-warning,
      0.25
    );

  color:
    variables.$color-warning;

  background:
    variables.$color-warning-soft;
}

.attendance-history__status--pending {
  color:
    variables.$color-text-muted;

  background:
    variables.$color-surface;
}

.attendance-history__note {
  grid-column:
    1 / -1;

  margin: 0;

  padding-top:
    variables.$spacing-sm;

  border-top:
    1px solid
    variables.$color-border-soft;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   RUBRIC
========================================================= */

.rubric-overview {
  display: grid;

  gap:
    variables.$spacing-sm;
}

.rubric-overview__item {
  display: grid;

  gap:
    variables.$spacing-sm;

  padding:
    variables.$spacing-md
    variables.$spacing-lg;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-md;

  background:
    variables.$color-background;
}

.rubric-overview__top {
  display: flex;

  gap:
    variables.$spacing-md;

  align-items: center;
  justify-content: space-between;
}

.rubric-overview__top > span {
  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-medium;
}

.rubric-overview__top strong {
  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;
}

.rubric-overview__top small {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-regular;
}

.rubric-overview__bar {
  overflow: hidden;

  height: 5px;

  border-radius:
    variables.$radius-pill;

  background:
    variables.$color-border;
}

.rubric-overview__fill {
  height: 100%;

  border-radius: inherit;

  background:
    variables.$color-primary;

  transition:
    width
      variables.$transition-normal;
}

/* =========================================================
   HISTORY
========================================================= */

.history {
  display: grid;

  gap:
    variables.$spacing-md;
}

.history-card {
  display: grid;

  gap:
    variables.$spacing-xl;

  align-items: center;

  grid-template-columns:
    minmax(0, 1fr)
    auto;

  padding:
    variables.$spacing-xl;

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;
}

.history-card__meta {
  display: flex;

  gap:
    variables.$spacing-sm;

  flex-wrap: wrap;

  align-items: center;

  margin-bottom:
    variables.$spacing-sm;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.submission-status {
  display: inline-flex;

  min-height: 28px;

  align-items: center;

  padding:
    0
    0.65rem;

  border-radius:
    variables.$radius-pill;

  font-size:
    0.7rem;

  font-weight:
    variables.$font-weight-semibold;

  text-transform:
    uppercase;
}

.submission-status--delivered {
  color:
    variables.$color-info;

  background:
    variables.$color-info-soft;
}

.submission-status--reviewed {
  color:
    variables.$color-success;

  background:
    variables.$color-success-soft;
}

.submission-status--returned {
  color:
    variables.$color-warning;

  background:
    variables.$color-warning-soft;
}

.history-card__main h3 {
  margin:
    0
    0
    variables.$spacing-xs;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;
}

.history-card__main > p {
  margin:
    0
    0
    variables.$spacing-xs;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;
}

.history-card__main > small {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.history-card__feedback {
  margin-top:
    variables.$spacing-lg;

  padding:
    variables.$spacing-md;

  border-left:
    2px solid
    variables.$color-primary;

  border-radius:
    0
    variables.$radius-md
    variables.$radius-md
    0;

  background:
    rgba(
      variables.$color-primary,
      0.035
    );
}

.history-card__feedback strong {
  display: block;

  margin-bottom:
    variables.$spacing-xs;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  text-transform:
    uppercase;
}

.history-card__feedback p {
  margin: 0;

  color:
    variables.$color-text-secondary;

  font-size:
    variables.$font-size-sm;

  line-height: 1.6;
}

.history-card__actions {
  display: grid;

  min-width: 110px;

  gap:
    variables.$spacing-sm;
}

.history-card__grade {
  display: grid;

  place-items: center;

  padding:
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius:
    variables.$radius-md;

  background:
    rgba(
      variables.$color-primary,
      0.05
    );
}

.history-card__grade span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;
}

.history-card__grade strong {
  margin-top: 2px;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xl;

  font-weight:
    variables.$font-weight-semibold;
}

.history-card__review {
  display: inline-flex;

  min-height: 40px;

  align-items: center;
  justify-content: center;

  padding:
    0
    variables.$spacing-md;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;
}

.history-card__review:hover {
  border-color:
    variables.$color-primary;

  color:
    variables.$color-primary;
}

/* =========================================================
   STATES
========================================================= */

.empty-state,
.state-card {
  display: flex;

  gap:
    variables.$spacing-lg;

  align-items: center;

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

.empty-state > span,
.state-card > span {
  display: grid;

  width: 46px;
  height: 46px;

  flex: 0 0 auto;

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

.empty-state h3,
.state-card h3 {
  margin: 0;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-md;

  font-weight:
    variables.$font-weight-semibold;
}

.empty-state p,
.state-card p {
  margin-top:
    variables.$spacing-xs;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-sm;
}

.empty-state__link {
  display: inline-block;

  margin-top:
    variables.$spacing-md;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-sm;

  font-weight:
    variables.$font-weight-semibold;
}

.empty-state--small {
  margin-top:
    variables.$spacing-md;
}

.state-card {
  min-height: 220px;

  justify-content: center;
}

.state-card--error > span {
  color:
    variables.$color-danger;

  background:
    variables.$color-danger-soft;
}

.state-card button {
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

.loading-spinner {
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
    profile-spin
    0.8s
    linear
    infinite;
}

@keyframes profile-spin {
  to {
    transform:
      rotate(360deg);
  }
}

/* =========================================================
   TOAST
========================================================= */

.profile-toast {
  position: fixed;

  right: 2rem;
  bottom: 2rem;

  z-index: 1000;

  display: flex;

  gap:
    variables.$spacing-sm;

  align-items: center;

  padding:
    variables.$spacing-md
    variables.$spacing-lg;

  border:
    1px solid
    rgba(
      variables.$color-success,
      0.3
    );

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    variables.$color-surface-elevated;

  box-shadow:
    variables.$shadow-lg;

  font-size:
    variables.$font-size-sm;
}

.profile-toast > span {
  color:
    variables.$color-success;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;

  transform:
    translateY(8px);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .student-profile__summary,
  .attendance-profile__stats {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .vocal-card__metrics {
    grid-template-columns:
      1fr;
  }

  .vocal-form__grid,
  .vocal-form__ranges {
    grid-template-columns:
      1fr;
  }

  .vocal-form__range {
    grid-template-columns:
      1fr;
  }

  .vocal-form__range-separator {
    display: none;
  }
}

@media (max-width: 700px) {
  .student-profile {
    padding-bottom:
      variables.$spacing-3xl;
  }

  .student-profile__hero,
  .student-profile__identity,
  .student-profile__section-header,
  .vocal-card__classification,
  .vocal-form__header {
    align-items:
      flex-start;

    flex-direction:
      column;
  }

  .student-profile__hero-actions,
  .student-profile__edit-profile {
    width: 100%;
  }

  .student-profile__identity-copy h1 {
    font-size:
      clamp(
        2.5rem,
        12vw,
        3.8rem
      );
  }

  .student-profile__section-header > p {
    max-width: none;

    text-align: left;
  }

  .profile-nav {
    top: 78px;

    margin-inline:
      -0.25rem;
  }

  .attendance-profile__overview {
    grid-template-columns:
      1fr;
  }

  .attendance-profile__percentage {
    justify-self: center;
  }

  .attendance-history__item,
  .history-card {
    grid-template-columns:
      1fr;
  }

  .attendance-history__status {
    width: fit-content;
  }

  .history-card__actions {
    width: 100%;

    grid-template-columns:
      1fr 1fr;
  }

  .vocal-form__actions {
    flex-direction:
      column-reverse;
  }

  .vocal-form__actions button {
    width: 100%;
  }

  .profile-toast {
    right:
      variables.$spacing-md;

    bottom:
      variables.$spacing-md;

    left:
      variables.$spacing-md;
  }
}

@media (max-width: 480px) {
  .student-profile__hero,
  .vocal-card,
  .attendance-profile,
  .rubric-overview {
    padding:
      variables.$spacing-lg;
  }

  .student-profile__avatar {
    width: 70px;
    height: 70px;
  }

  .student-profile__summary,
  .attendance-profile__stats {
    gap:
      variables.$spacing-sm;
  }

  .student-profile__summary article,
  .attendance-profile__stats article {
    padding:
      variables.$spacing-md;
  }

  .history-card__actions {
    grid-template-columns:
      1fr;
  }
}

@media (
  prefers-reduced-motion:
  reduce
) {
  .student-profile *,
  .student-profile *::before,
  .student-profile *::after {
    scroll-behavior: auto !important;

    animation-duration:
      0.01ms !important;

    animation-iteration-count:
      1 !important;

    transition-duration:
      0.01ms !important;
  }
}


/* =========================================================
   V6.3 · STUDENT PROFILE · LIGHT LMS
   Rediseño visual completo de la ficha del estudiante.
   No modifica servicios, Supabase, datos ni eventos.
========================================================= */

.student-profile {
  --ink: #152033;
  --ink-soft: #344359;
  --muted: #6f7c8f;
  --muted-2: #8b98aa;
  --line: #dbe3ec;
  --line-strong: #cbd6e2;
  --surface: #ffffff;
  --surface-soft: #f7f9fc;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-dark: #9d7300;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #edf8f3;
  --red: #c94a57;
  --red-soft: #fff2f4;
  --blue: #3f6fa8;
  --blue-soft: #eef5fc;

  color: var(--ink);
}

/* VOLVER */
.student-profile__back {
  color: var(--wine);
  font-weight: 800;
  text-decoration: none;
}

.student-profile__back:hover {
  color: var(--wine-dark);
}

/* =========================================================
   HERO
========================================================= */

.student-profile__hero {
  position: relative;
  overflow: hidden;
  padding: 30px 32px;
  border: 1px solid var(--line);
  border-radius: 22px;
  color: var(--ink);
  background:
    radial-gradient(circle at 90% 5%, rgba(217,169,29,.13), transparent 31%),
    linear-gradient(135deg, #ffffff 0%, #fbfcfe 62%, #fffaf0 100%);
  box-shadow: 0 14px 36px rgba(31,48,73,.06);
}

.student-profile__hero::before {
  position: absolute;
  inset: 0 auto auto 0;
  width: 120px;
  height: 3px;
  content: "";
  background: linear-gradient(90deg, var(--wine), var(--gold));
}

.student-profile__identity {
  gap: 22px;
}

.student-profile__avatar {
  width: 82px;
  height: 82px;
  border: 1px solid #e3c65f;
  color: var(--gold-dark);
  background:
    linear-gradient(135deg, #fffaf0, #fff4cf);
  box-shadow: 0 10px 26px rgba(217,169,29,.10);
  font-size: 1.2rem;
  font-weight: 900;
}

.student-profile__eyebrow {
  color: var(--gold-dark);
  font-size: .66rem;
  font-weight: 900;
  letter-spacing: .14em;
  text-transform: uppercase;
}

.student-profile__identity-copy h1 {
  max-width: 850px;
  margin: 6px 0 14px;
  color: var(--ink);
  font-size: clamp(2.1rem, 4vw, 3.6rem);
  line-height: 1;
  letter-spacing: -.045em;
}

.student-profile__badges {
  gap: 8px;
}

.voice-badge {
  border: 1px solid #e5ca72;
  color: #846100;
  background: var(--gold-soft);
}

.status-badge {
  border: 1px solid #c6dfd2;
  color: var(--green);
  background: var(--green-soft);
}

.status-badge i {
  background: var(--green);
}

.status-badge--inactive {
  border-color: #e0e5eb;
  color: #7d8998;
  background: #f4f6f8;
}

.status-badge--inactive i {
  background: #98a3af;
}

.student-profile__edit-profile {
  min-height: 44px;
  padding: 0 17px;
  border: 1px solid var(--wine);
  border-radius: 11px;
  color: #fff;
  background: var(--wine);
  font-weight: 800;
  box-shadow: 0 7px 18px rgba(159,25,69,.16);
}

.student-profile__edit-profile:hover {
  background: var(--wine-dark);
  transform: translateY(-1px);
}

/* =========================================================
   SUMMARY
========================================================= */

.student-profile__summary {
  gap: 14px;
  margin-top: 18px;
}

.student-profile__summary article {
  min-height: 128px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(31,48,73,.035);
}

.student-profile__summary article:nth-child(1) {
  border-color: #e6d39a;
  background:
    radial-gradient(circle at 90% 8%, rgba(217,169,29,.11), transparent 42%),
    #fffdf7;
}

.student-profile__summary article:nth-child(2) {
  border-color: #cbe1d5;
  background: linear-gradient(135deg, #fff, #f3fbf7);
}

.student-profile__summary article:nth-child(3) {
  border-color: #d2deeb;
  background: linear-gradient(135deg, #fff, #f5f9fd);
}

.student-profile__summary article:nth-child(4) {
  border-color: #dfd6e8;
  background: linear-gradient(135deg, #fff, #faf7fc);
}

.student-profile__summary span {
  color: var(--muted);
  font-size: .72rem;
}

.student-profile__summary strong {
  margin: 10px 0 5px;
  color: var(--ink);
  font-size: 1.85rem;
  line-height: 1;
}

.student-profile__summary article:nth-child(2) strong {
  color: var(--green);
}

.student-profile__summary small {
  color: var(--muted-2);
  font-size: .66rem;
}

.summary-card--primary strong {
  color: var(--gold-dark);
}

/* =========================================================
   INTERNAL NAV
========================================================= */

.profile-nav {
  position: sticky;
  top: 70px;
  z-index: 8;
  display: flex;
  gap: 4px;
  margin: 18px 0 34px;
  padding: 7px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: rgba(255,255,255,.95);
  box-shadow: 0 8px 22px rgba(31,48,73,.05);
  backdrop-filter: blur(10px);
}

.profile-nav a {
  padding: 10px 14px;
  border-radius: 9px;
  color: #627186;
  font-size: .72rem;
  font-weight: 800;
  text-decoration: none;
  transition: color .2s ease, background .2s ease;
}

.profile-nav a:hover {
  color: var(--wine);
  background: #fff4f7;
}

/* =========================================================
   SECTION HEADERS
========================================================= */

.student-profile__section {
  scroll-margin-top: 150px;
  margin-bottom: 36px;
}

.student-profile__section-header {
  margin-bottom: 18px;
}

.student-profile__section-title > span {
  border-color: #ead17d;
  color: var(--gold-dark);
  background: var(--gold-soft);
}

.student-profile__section-title p {
  color: var(--gold-dark);
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.student-profile__section-title h2 {
  color: var(--ink);
  font-size: clamp(1.45rem, 2.4vw, 2rem);
  letter-spacing: -.03em;
}

.student-profile__section-header > p {
  max-width: 460px;
  color: var(--muted);
  line-height: 1.55;
}

/* =========================================================
   VOCAL PROFILE
========================================================= */

.vocal-card {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(31,48,73,.045);
}

.vocal-card__classification {
  padding-bottom: 22px;
  border-bottom: 1px solid #e8edf3;
}

.vocal-card__classification span {
  color: var(--muted);
}

.vocal-card__classification strong {
  color: var(--gold-dark);
  font-size: clamp(1.65rem, 3vw, 2.4rem);
}

.vocal-card__metrics {
  gap: 12px;
  margin: 22px 0;
}

.vocal-card__metrics article {
  min-height: 108px;
  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 15px;
  background: #f8fafc;
}

.vocal-card__metrics article:nth-child(1) {
  background: linear-gradient(135deg, #fff, #f5f9fd);
}

.vocal-card__metrics article:nth-child(2) {
  background: linear-gradient(135deg, #fff, #f3fbf7);
}

.vocal-card__metrics article:nth-child(3) {
  background: linear-gradient(135deg, #fff, #fffaf0);
}

.vocal-card__metrics span {
  color: var(--muted);
}

.vocal-card__metrics strong {
  color: var(--ink);
}

.vocal-card__observations {
  padding: 18px;
  border: 1px solid #e4eaf1;
  border-radius: 15px;
  background: #fbfcfe;
}

.vocal-card__observations > span {
  color: var(--gold-dark);
}

.vocal-card__observations p {
  color: var(--ink-soft);
}

.vocal-card__updated {
  color: var(--muted);
}

/* BUTTONS + FORM */
.button-secondary {
  border-color: var(--line-strong);
  color: #536276;
  background: #fff;
}

.button-secondary:hover {
  border-color: #b8c5d2;
  color: var(--wine);
  background: #fff7f9;
}

.button-primary {
  border-color: var(--wine);
  color: #fff;
  background: var(--wine);
}

.button-primary:hover:not(:disabled) {
  background: var(--wine-dark);
}

.vocal-form__header {
  border-bottom-color: #e8edf3;
}

.vocal-form__header span {
  color: var(--gold-dark);
}

.vocal-form__header h3 {
  color: var(--ink);
}

.vocal-form__header > strong {
  color: var(--muted);
}

.vocal-form__range-block {
  border-color: var(--line);
  background: #fbfcfe;
}

.vocal-form__range-block legend {
  color: var(--ink);
}

.vocal-form__field > span {
  color: var(--muted);
}

.vocal-form__field input,
.vocal-form__field select,
.vocal-form__field textarea {
  border-color: var(--line-strong);
  color: var(--ink);
  background: #fff;
}

.vocal-form__field input:focus-visible,
.vocal-form__field select:focus-visible,
.vocal-form__field textarea:focus-visible {
  border-color: #aebfd0;
  box-shadow: 0 0 0 4px rgba(63,111,168,.08);
}

/* =========================================================
   ATTENDANCE
========================================================= */

.attendance-profile {
  padding: 28px;
  border: 1px solid var(--line);
  border-radius: 19px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(31,48,73,.045);
}

.attendance-profile__percentage {
  border-color: #c7e0d3;
  color: var(--green);
  background:
    radial-gradient(circle at center, #fff 52%, transparent 53%),
    #edf8f3;
}

.attendance-profile__percentage strong {
  color: var(--green);
}

.attendance-profile__percentage span {
  color: var(--muted);
}

.attendance-profile__progress-info span {
  color: var(--muted);
}

.attendance-profile__progress-info strong {
  color: var(--ink);
}

.attendance-profile__bar {
  background: #e8edf2;
}

.attendance-profile__fill {
  background: var(--green);
}

.attendance-profile__progress > p {
  color: var(--muted);
}

.attendance-profile__stats {
  gap: 12px;
}

.attendance-profile__stats article {
  min-height: 102px;
  padding: 17px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: #f8fafc;
}

.attendance-profile__stats span {
  color: var(--muted);
}

.attendance-profile__stats strong {
  color: var(--ink);
}

.attendance-stat--present {
  background: var(--green-soft) !important;
  border-color: #c6dfd2 !important;
}

.attendance-stat--present strong {
  color: var(--green);
}

.attendance-stat--absent {
  background: var(--red-soft) !important;
  border-color: #edc9cf !important;
}

.attendance-stat--absent strong {
  color: var(--red);
}

.attendance-stat--justified {
  background: var(--gold-soft) !important;
  border-color: #e8d492 !important;
}

.attendance-stat--justified strong {
  color: var(--gold-dark);
}

.attendance-history {
  border-top-color: #e8edf3;
}

.attendance-history__header span {
  color: var(--gold-dark);
}

.attendance-history__header h3 {
  color: var(--ink);
}

.attendance-history__item {
  border-color: var(--line);
  background: #fbfcfe;
}

.attendance-history__lesson span {
  color: var(--gold-dark);
}

.attendance-history__lesson strong {
  color: var(--ink);
}

.attendance-history__lesson small {
  color: var(--muted);
}

.attendance-history__status--pending {
  color: #7b8797;
  background: #f3f5f7;
}

.attendance-history__note {
  border-top-color: #e4eaf1;
  color: var(--ink-soft);
}

/* =========================================================
   RUBRIC / PROGRESS
========================================================= */

.rubric-overview__item {
  border-color: var(--line);
  background: #fbfcfe;
}

.rubric-overview__top > span {
  color: var(--ink);
}

.rubric-overview__top strong {
  color: var(--wine);
}

.rubric-overview__top small {
  color: var(--muted);
}

.rubric-overview__bar {
  background: #e8edf2;
}

.rubric-overview__fill {
  background: linear-gradient(90deg, var(--wine), #c64b70);
}

/* =========================================================
   HISTORY / SUBMISSIONS
========================================================= */

.history-card {
  border-color: var(--line);
  background: #fff;
  box-shadow: 0 7px 20px rgba(31,48,73,.035);
}

.history-card__meta {
  color: var(--muted);
}

.history-card__main h3 {
  color: var(--ink);
}

.history-card__main > p {
  color: var(--ink-soft);
}

.history-card__main > small {
  color: var(--muted);
}

.history-card__feedback {
  border-left-color: var(--wine);
  background: #fff7f9;
}

.history-card__feedback strong {
  color: var(--wine);
}

.history-card__feedback p {
  color: var(--ink-soft);
}

.history-card__grade {
  border-color: #e4d29a;
  background: var(--gold-soft);
}

.history-card__grade span {
  color: var(--muted);
}

.history-card__grade strong {
  color: var(--gold-dark);
}

.history-card__review {
  border-color: var(--line-strong);
  color: #536276;
  background: #fff;
}

.history-card__review:hover {
  border-color: #d3a7b5;
  color: var(--wine);
  background: #fff7f9;
}

/* =========================================================
   EMPTY + LOADING STATES
========================================================= */

.empty-state,
.state-card {
  border-color: var(--line);
  background: #fff;
  box-shadow: 0 7px 20px rgba(31,48,73,.03);
}

.empty-state > span,
.state-card > span {
  color: var(--gold-dark);
  background: var(--gold-soft);
}

.empty-state h3,
.state-card h3 {
  color: var(--ink);
}

.empty-state p,
.state-card p {
  color: var(--muted);
}

.empty-state__link {
  color: var(--wine);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .student-profile__hero {
    gap: 22px;
    align-items: flex-start;
    flex-direction: column;
  }

  .student-profile__hero-actions,
  .student-profile__edit-profile {
    width: 100%;
  }

  .student-profile__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .attendance-profile__stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 700px) {
  .student-profile__hero,
  .vocal-card,
  .attendance-profile {
    padding: 22px;
  }

  .student-profile__identity {
    align-items: flex-start;
  }

  .student-profile__avatar {
    width: 66px;
    height: 66px;
  }

  .student-profile__summary,
  .vocal-card__metrics,
  .attendance-profile__stats {
    grid-template-columns: 1fr;
  }

  .profile-nav {
    overflow-x: auto;
    top: 58px;
  }

  .profile-nav a {
    flex: 0 0 auto;
  }

  .student-profile__section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .attendance-profile__overview {
    grid-template-columns: 1fr;
  }

  .attendance-profile__percentage {
    width: 112px;
    height: 112px;
  }

  .history-card {
    grid-template-columns: 1fr;
  }

  .history-card__actions {
    min-width: 0;
  }

  .vocal-form__grid,
  .vocal-form__ranges {
    grid-template-columns: 1fr;
  }
}



/* =========================================================
   AMV LMS UI SYSTEM · ACADEMIC EXPERIENCE v1.0
   Sistema visual común para el SaaS
========================================================= */
.student-profile {
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

.student-profile :where(a, button, input, textarea, select, [role="button"]) {
  transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease, transform .2s ease, opacity .2s ease;
}

.student-profile :where(a, button, input, textarea, select, [role="button"]):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.student-profile :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.student-profile :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

.student-profile :where(table tbody tr) {
  transition: background-color .18s ease;
}

.student-profile :where(table tbody tr):hover {
  background-color: rgba(159, 25, 69, .025);
}

.student-profile :where(.card, [class*="-card"], [class*="__card"]) {
  transition: transform .24s cubic-bezier(.2,.75,.25,1), box-shadow .24s ease, border-color .24s ease;
}

.student-profile :where(.card, [class*="-card"], [class*="__card"]):hover {
  border-color: rgba(159, 25, 69, .16);
}

@media (prefers-reduced-motion: reduce) {
  .student-profile *, .student-profile *::before, .student-profile *::after {
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
.student-profile {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.student-profile :where(
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
  .student-profile :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .student-profile :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .student-profile :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .student-profile :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.student-profile :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.student-profile :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.student-profile :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.student-profile ::selection {
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
  .student-profile,
  .student-profile *,
  .student-profile *::before,
  .student-profile *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}


/* =========================================================
   V10 · EXPEDIENTE ACADÉMICO INTEGRAL
========================================================= */

.student-profile__summary {
  grid-template-columns:
    repeat(6, minmax(0, 1fr));
}

.summary-card--attention {
  border-color: rgba(159, 25, 69, .22) !important;
  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #fff8fa 100%
    ) !important;
}

.summary-card--attention strong {
  color: #9f1945 !important;
}

.academic-notice {
  display: grid;
  gap: .35rem;
  margin-bottom: 1rem;
  padding: 1rem 1.1rem;
  border: 1px solid #ead9a5;
  border-radius: 16px;
  background: #fff9e9;
  color: #344359;
}

.academic-notice strong {
  color: #172033;
}

.academic-notice p {
  margin: 0;
}

.quiz-attempts {
  display: grid;
  gap: .85rem;
}

.quiz-attempt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  padding: 1.15rem;
  border: 1px solid #dbe3ec;
  border-radius: 20px;
  background: #ffffff;
  box-shadow:
    0 10px 30px rgba(23, 32, 51, .055);
  transition:
    transform .22s cubic-bezier(.2,.75,.25,1),
    box-shadow .22s ease,
    border-color .22s ease;
}

.quiz-attempt:hover {
  transform: translateY(-2px);
  border-color: rgba(159, 25, 69, .2);
  box-shadow:
    0 16px 36px rgba(23, 32, 51, .085);
}

.quiz-attempt__main {
  min-width: 0;
}

.quiz-attempt__main h3 {
  margin: .5rem 0 .25rem;
  color: #172033 !important;
}

.quiz-attempt__main p,
.quiz-attempt__main small {
  color: #667085 !important;
}

.quiz-attempt__meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: .55rem;
  color: #667085;
  font-size: .78rem;
  font-weight: 800;
}

.quiz-attempt__status {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: .25rem .65rem;
  border-radius: 999px;
  font-size: .74rem;
  font-weight: 900;
}

.quiz-attempt__status--passed {
  color: #216b4d;
  background: #eaf7f1;
}

.quiz-attempt__status--reinforce {
  color: #9f1945;
  background: #fff0f4;
}

.quiz-attempt__status--pending {
  color: #795d08;
  background: #fff8e7;
}

.quiz-attempt__status--neutral {
  color: #344359;
  background: #eef2f6;
}

.quiz-attempt__result {
  display: grid;
  justify-items: end;
  gap: .35rem;
  flex: 0 0 auto;
}

.quiz-attempt__result > span {
  color: #667085;
  font-size: .76rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: .06em;
}

.quiz-attempt__result > strong {
  color: #172033 !important;
  font-size: 1.55rem;
  line-height: 1;
}

@media (max-width: 1180px) {
  .student-profile__summary {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 720px) {
  .student-profile__summary {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .quiz-attempt {
    align-items: stretch;
    flex-direction: column;
  }

  .quiz-attempt__result {
    justify-items: start;
    padding-top: .85rem;
    border-top: 1px solid #e7ecf2;
  }
}

@media (max-width: 460px) {
  .student-profile__summary {
    grid-template-columns: 1fr;
  }
}


/* =========================================================
   V11 · CONTEXT NAVIGATION
   Menos scroll, más orientación y foco.
========================================================= */

.student-profile__legacy-nav {
  display: none !important;
}

.student-profile__context-shell {
  position: sticky;
  top: 12px;
  z-index: 18;
  margin: 18px 0 22px;
  border: 1px solid #dbe3ec;
  border-radius: 20px;
  background: rgba(255, 255, 255, .94);
  box-shadow:
    0 14px 36px rgba(23, 32, 51, .09);
  backdrop-filter: blur(14px);
  overflow: hidden;
  scroll-margin-top: 14px;
}

.student-profile__context-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 16px 10px;
  border-bottom: 1px solid #e7ecf2;
}

.student-profile__context-heading > div {
  display: flex;
  align-items: baseline;
  gap: 9px;
  min-width: 0;
}

.student-profile__context-heading span {
  color: #9f1945;
  font-size: .7rem;
  font-weight: 900;
  letter-spacing: .08em;
}

.student-profile__context-heading strong {
  overflow: hidden;
  color: #172033 !important;
  font-size: .9rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-profile__context-heading small {
  color: #667085;
  font-size: .76rem;
}

.student-profile__context-nav {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 7px;
  overflow-x: auto;
  scrollbar-width: thin;
}

.student-profile__context-tab {
  position: relative;
  flex: 0 0 auto;
  min-height: 42px;
  padding: 0 14px;
  border: 0;
  border-radius: 11px;
  background: transparent;
  color: #5d6879;
  font: inherit;
  font-size: .84rem;
  font-weight: 850;
  cursor: pointer;
  transition:
    background .2s ease,
    color .2s ease,
    transform .2s cubic-bezier(.2,.75,.25,1);
}

.student-profile__context-tab:hover {
  background: #f5f7fb;
  color: #172033;
  transform: translateY(-1px);
}

.student-profile__context-tab--active {
  background: #fff0f4;
  color: #9f1945;
}

.student-profile__context-tab--active::after {
  content: "";
  position: absolute;
  right: 14px;
  bottom: 4px;
  left: 14px;
  height: 2px;
  border-radius: 999px;
  background: #9f1945;
}

.student-profile__overview {
  display: grid;
  gap: 16px;
  margin-bottom: 22px;
  padding: 22px;
  border: 1px solid #dbe3ec;
  border-radius: 22px;
  background: #ffffff;
  box-shadow:
    0 10px 30px rgba(23, 32, 51, .05);
}

.student-profile__overview > header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 22px;
}

.student-profile__overview > header span {
  color: #9f1945;
  font-size: .72rem;
  font-weight: 900;
  letter-spacing: .08em;
}

.student-profile__overview > header h2 {
  margin: 4px 0 0;
  color: #172033 !important;
}

.student-profile__overview > header p {
  max-width: 440px;
  margin: 0;
  color: #667085;
}

.student-profile__quick-grid {
  display: grid;
  grid-template-columns:
    repeat(5, minmax(0, 1fr));
  gap: 10px;
}

.student-profile__quick-grid button {
  display: grid;
  align-content: start;
  gap: 5px;
  min-width: 0;
  min-height: 128px;
  padding: 15px;
  border: 1px solid #e1e7ef;
  border-radius: 16px;
  background:
    linear-gradient(
      180deg,
      #ffffff 0%,
      #fbfcfe 100%
    );
  text-align: left;
  cursor: pointer;
  transition:
    transform .22s cubic-bezier(.2,.75,.25,1),
    border-color .22s ease,
    box-shadow .22s ease;
}

.student-profile__quick-grid button:hover {
  transform: translateY(-2px);
  border-color: rgba(159, 25, 69, .25);
  box-shadow:
    0 12px 28px rgba(23, 32, 51, .07);
}

.student-profile__quick-grid button > span {
  color: #9f1945;
  font-size: .76rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: .045em;
}

.student-profile__quick-grid button > strong {
  overflow: hidden;
  color: #172033 !important;
  font-size: 1.35rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.student-profile__quick-grid button > small {
  color: #667085;
  line-height: 1.45;
}

@media (max-width: 1180px) {
  .student-profile__quick-grid {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .student-profile__context-shell {
    top: 6px;
    border-radius: 16px;
  }

  .student-profile__context-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 4px;
  }

  .student-profile__context-heading small {
    display: none;
  }

  .student-profile__context-nav {
    padding: 6px;
  }

  .student-profile__context-tab {
    min-height: 40px;
    padding: 0 12px;
  }

  .student-profile__overview > header {
    flex-direction: column;
  }

  .student-profile__quick-grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 480px) {
  .student-profile__overview {
    padding: 15px;
  }

  .student-profile__quick-grid {
    grid-template-columns: 1fr;
  }

  .student-profile__quick-grid button {
    min-height: 104px;
  }
}



/* =========================================================
   AMV VISUAL REDESIGN · V5 MINIMAL / PREMIUM
   Solo UI: mantiene eventos, rutas y lógica existentes.
========================================================= */
.student-profile {
  --amv-canvas: #f4f5f7;
  --amv-card: rgba(255,255,255,.94);
  --amv-card-solid: #ffffff;
  --amv-ink: #151923;
  --amv-body: #394252;
  --amv-muted: #7b8492;
  --amv-line: rgba(21,25,35,.09);
  --amv-primary: #8b2449;
  --amv-primary-deep: #64172f;
  --amv-accent: #c8a35a;
  --amv-accent-soft: #f8f1e3;
  --amv-teal: #4f7f79;
  --amv-success: #2e8963;
  --amv-danger: #b94b59;
  --amv-shadow-sm: 0 10px 26px rgba(21,25,35,.055);
  --amv-shadow-md: 0 22px 56px rgba(21,25,35,.085);
  --amv-glass: rgba(255,255,255,.76);
  background: linear-gradient(180deg, #f8f9fb 0%, var(--amv-canvas) 78%, #f6f4f2 100%);
}

.student-profile::before {
  inset: 0 -8vw auto;
  height: 560px;
  background:
    radial-gradient(circle at 14% 9%, rgba(139,36,73,.08), transparent 24%),
    radial-gradient(circle at 90% 18%, rgba(200,163,90,.10), transparent 22%),
    radial-gradient(circle at 52% 42%, rgba(79,127,121,.035), transparent 24%);
}

.student-profile__back {
  margin-bottom: 14px;
  padding: 7px 11px;
  border-color: rgba(21,25,35,.08);
  background: rgba(255,255,255,.72);
  color: #616a78;
  box-shadow: 0 5px 16px rgba(21,25,35,.035);
  transition: .2s ease;
}
.student-profile__back:hover { transform: translateX(-2px); border-color: rgba(139,36,73,.2); color: var(--amv-primary); }

.student-profile__hero {
  min-height: 230px;
  margin-bottom: 14px;
  padding: 30px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 26px;
  background:
    radial-gradient(circle at 86% 12%, rgba(200,163,90,.22), transparent 18%),
    radial-gradient(circle at 76% 92%, rgba(139,36,73,.24), transparent 30%),
    linear-gradient(120deg, #12151e 0%, #24232d 56%, #51263a 100%);
  box-shadow: 0 26px 70px rgba(27,20,25,.14);
}
.student-profile__hero::before {
  width: 300px; height: 300px; right: -90px; top: -135px;
  border-color: rgba(255,255,255,.11);
  box-shadow: 0 0 0 30px rgba(255,255,255,.018), 0 0 0 62px rgba(255,255,255,.012);
  animation: amv-orbit 18s linear infinite;
}
.student-profile__hero::after {
  left: 44%; bottom: -90px; width: 360px; height: 170px;
  background: rgba(200,163,90,.06); filter: blur(12px);
}
.student-profile__identity { gap: 20px; }
.student-profile__avatar {
  width: 94px; height: 94px; outline: 6px solid rgba(255,255,255,.045);
  border-color: rgba(255,255,255,.30);
  background: linear-gradient(145deg, rgba(255,255,255,.18), rgba(255,255,255,.055));
  box-shadow: inset 0 1px 0 rgba(255,255,255,.22), 0 15px 32px rgba(0,0,0,.20);
  position: relative;
}
.student-profile__avatar::after {
  content: '';
  position: absolute; inset: -8px; border-radius: inherit;
  border: 1px solid rgba(200,163,90,.24);
  animation: amv-pulse 3.6s ease-in-out infinite;
}
.student-profile__eyebrow { opacity: .66; letter-spacing: .12em; font-size: 10px; }
.student-profile__identity-copy h1 { font-size: clamp(2rem, 4vw, 3.3rem); letter-spacing: -.055em; }
.student-profile__badges { margin-top: 12px; gap: 7px; }
.voice-badge, .status-badge { min-height: 28px; padding: 0 10px; border-radius: 999px; }
.voice-badge { background: rgba(255,255,255,.085); border-color: rgba(255,255,255,.15); }
.status-badge { background: rgba(70,170,117,.11); border-color: rgba(100,224,155,.18); color: #bcebd2; }

.student-profile__edit-profile {
  min-height: 42px; padding: 0 15px; border-radius: 12px;
  border-color: rgba(255,255,255,.17); background: rgba(255,255,255,.08);
  box-shadow: 0 7px 20px rgba(0,0,0,.12); backdrop-filter: blur(12px);
  transition: .2s ease;
}
.student-profile__edit-profile:hover { transform: translateY(-2px); background: rgba(255,255,255,.14); border-color: rgba(200,163,90,.34); }

.student-profile__context-shell {
  top: 72px; margin-bottom: 14px; padding: 8px;
  border-color: rgba(21,25,35,.08); border-radius: 17px;
  background: rgba(248,249,251,.82); box-shadow: 0 12px 32px rgba(21,25,35,.06);
  backdrop-filter: blur(16px) saturate(125%);
}
.student-profile__context-heading { padding: 5px 10px 8px; }
.student-profile__context-heading span { color: var(--amv-primary); letter-spacing: .14em; }
.student-profile__context-heading strong { color: #252a34; font-size: 14px; }
.student-profile__context-heading small { color: #7d8692; font-size: 11px; }
.student-profile__context-nav { gap: 4px; padding: 3px; background: #eceef2; }
.student-profile__context-tab {
  min-height: 40px; border-radius: 10px; color: #697281; font-size: 12px; transition: transform .18s ease, background .18s ease, color .18s ease, box-shadow .18s ease;
}
.student-profile__context-tab:hover { color: #202631; background: rgba(255,255,255,.76); transform: translateY(-1px); }
.student-profile__context-tab--active {
  background: linear-gradient(135deg, var(--amv-primary), var(--amv-primary-deep));
  box-shadow: 0 7px 18px rgba(139,36,73,.22);
}
.student-profile__context-tab--active::after {
  content: ''; position: absolute; left: 16%; right: 16%; bottom: 4px; height: 2px; border-radius: 99px; background: rgba(255,255,255,.58); opacity: .65;
}

.student-profile__summary { gap: 10px; margin-bottom: 14px; }
.student-profile__summary article {
  min-height: 116px; padding: 16px; border: 1px solid var(--amv-line); border-radius: 16px;
  background: var(--amv-card); box-shadow: var(--amv-shadow-sm); transition: .2s ease;
}
.student-profile__summary article:hover { transform: translateY(-2px); box-shadow: var(--amv-shadow-md); }
.student-profile__summary article::before {
  content: ''; position: absolute; left: 16px; top: 16px; width: 25px; height: 2px; border-radius: 99px; background: rgba(139,36,73,.20);
}
.student-profile__summary article::after { background: rgba(200,163,90,.045); }
.student-profile__summary span { padding-top: 7px; color: #737d8b; font-size: 10px; }
.student-profile__summary strong { margin: 10px 0 3px; font-size: 25px; }
.student-profile__summary small { color: #8a929e; font-size: 10px; }
.student-profile__summary .summary-card--primary { border-color: rgba(139,36,73,.14); background: linear-gradient(145deg, #fff, #fbf3f6); }
.student-profile__summary .summary-card--primary strong { color: var(--amv-primary); }
.student-profile__summary .summary-card--attention { border-color: rgba(185,75,89,.18); background: linear-gradient(145deg, #fff, #fff7f7); }
.student-profile__summary .summary-card--attention strong { color: var(--amv-danger); }

.student-profile__overview {
  margin-bottom: 24px; padding: 20px; border: 1px solid var(--amv-line); border-radius: 20px;
  background: var(--amv-card); box-shadow: var(--amv-shadow-sm);
}
.student-profile__overview > header { margin-bottom: 14px; }
.student-profile__overview header span { color: var(--amv-primary); font-size: 9px; letter-spacing: .16em; }
.student-profile__overview header h2 { margin-top: 4px; font-size: 1.55rem; }
.student-profile__overview header > p { color: #7b8490; font-size: 12px; }
.student-profile__quick-grid { gap: 8px; grid-template-columns: repeat(5, minmax(0, 1fr)); }
.student-profile__quick-grid button.amv-quick-card {
  min-height: 118px; padding: 14px; border: 1px solid var(--amv-line); border-radius: 15px; background: #fafbfc; box-shadow: none;
  transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease, background .22s ease;
}
.student-profile__quick-grid button.amv-quick-card:hover { transform: translateY(-3px); border-color: rgba(139,36,73,.17); box-shadow: 0 14px 28px rgba(21,25,35,.07); background: #fff; }
.student-profile__quick-grid button.amv-quick-card::before { display:none; }
.amv-mini-thumb, .amv-card-thumb {
  display: grid; place-items: center; flex: 0 0 auto; border-radius: 12px; overflow: hidden;
  border: 1px solid rgba(21,25,35,.06); background: linear-gradient(135deg, #f5f2ed, #f8eaf0);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.76);
}
.amv-mini-thumb { width: 38px; height: 38px; margin-bottom: 10px; }
.amv-mini-thumb svg, .amv-card-thumb svg { width: 22px; height: 22px; fill: none; stroke: currentColor; stroke-width: 1.75; stroke-linecap: round; stroke-linejoin: round; color: var(--amv-primary); }
.amv-mini-thumb--attendance { background: linear-gradient(135deg, #eef5f3, #f9fafb); }
.amv-mini-thumb--attendance svg { color: var(--amv-teal); }
.amv-mini-thumb--skills { background: linear-gradient(135deg, #f7f1e4, #fffdfa); }
.amv-mini-thumb--skills svg { color: var(--amv-accent); }
.amv-mini-thumb--tasks { background: linear-gradient(135deg, #f2f3f5, #fbf4f7); }
.amv-mini-thumb--voice { background: linear-gradient(135deg, #f8ebf0, #fcfaf9); }
.student-profile__quick-grid button.amv-quick-card > span:not(.amv-mini-thumb) { color: #6e7785; font-size: 10px; letter-spacing: .06em; }
.student-profile__quick-grid button.amv-quick-card strong { margin: 5px 0 3px; color: #242a34; font-size: 22px; }
.student-profile__quick-grid button.amv-quick-card small { color: #8a929e; font-size: 10px; line-height: 1.35; }

.profile-nav {
  top: 140px; margin-bottom: 22px; padding: 4px; border-radius: 12px; background: rgba(255,255,255,.66); box-shadow: none;
}
.profile-nav a { min-height: 34px; border-radius: 8px; padding-inline: 10px; color: #78818e; font-size: 11px; }
.profile-nav a:hover { color: var(--amv-primary); background: rgba(139,36,73,.05); }

.student-profile__section {
  margin-bottom: 22px; padding: 22px; border: 1px solid var(--amv-line); border-radius: 20px; background: var(--amv-card); box-shadow: var(--amv-shadow-sm);
}
.student-profile__section-header { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid rgba(21,25,35,.065); }
.student-profile__section-title { gap: 12px; }
.student-profile__section-title h2 { color: #202631; font-size: 1.45rem; }
.student-profile__section-title p { color: var(--amv-primary); font-size: 10px; letter-spacing: .06em; }
.student-profile__section-header > p { color: #7a838f; font-size: 11px; line-height: 1.5; }
.amv-section-mark {
  display: grid !important; place-items: center; position: relative; width: 44px !important; height: 44px !important;
  overflow: hidden; border-radius: 13px; border: 1px solid rgba(139,36,73,.11) !important;
  color: var(--amv-primary) !important; background: linear-gradient(145deg, #fff4f7, #f7f2ed) !important; box-shadow: none !important;
}
.amv-section-mark b { position: absolute; left: 7px; top: 5px; font-size: 8px; letter-spacing: .04em; opacity: .58; }
.amv-section-mark svg { width: 21px; height: 21px; margin-top: 4px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.amv-section-mark--attendance { color: var(--amv-teal) !important; background: #f0f6f4 !important; border-color: rgba(79,127,121,.12) !important; }
.amv-section-mark--progress { color: #b38b36 !important; background: #fbf6e8 !important; border-color: rgba(200,163,90,.14) !important; }

.vocal-card, .attendance-profile, .rubric-overview { padding: 20px; border: 1px solid var(--amv-line); border-radius: 16px; background: linear-gradient(145deg, #fff, #fbfbfa); box-shadow: none; }
.vocal-card__classification strong { color: var(--amv-primary); }
.vocal-card__metrics { gap: 8px; }
.vocal-card__metrics article { border: 1px solid rgba(21,25,35,.07); border-radius: 13px; background: #fafbfc; }
.vocal-card__metrics article strong { color: #28303b; }
.vocal-card__observations { border-color: rgba(139,36,73,.08); background: #fcf8f9; }

.attendance-profile__percentage { box-shadow: inset 0 0 0 7px rgba(79,127,121,.05), 0 10px 24px rgba(21,25,35,.05); }
.attendance-profile__fill { background: linear-gradient(90deg, var(--amv-teal), #72a397) !important; box-shadow: 0 0 14px rgba(79,127,121,.18); }
.attendance-profile__stats article { border-color: rgba(21,25,35,.07); background: #fafbfc; }

.rubric-overview__item { border-color: rgba(21,25,35,.065); background: #fbfbfc; }
.rubric-overview__fill { background: linear-gradient(90deg, var(--amv-primary), #b94f70) !important; box-shadow: 0 0 12px rgba(139,36,73,.14); }

.history, .quiz-attempts { gap: 9px; }
.history-card, .quiz-attempt {
  grid-template-columns: auto 1fr auto !important; align-items: center; gap: 14px !important;
  border: 1px solid var(--amv-line) !important; border-radius: 15px !important; background: #fff !important; box-shadow: 0 8px 24px rgba(21,25,35,.045);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;
}
.history-card:hover, .quiz-attempt:hover { transform: translateY(-2px); border-color: rgba(139,36,73,.14) !important; box-shadow: 0 16px 34px rgba(21,25,35,.07); }
.amv-card-thumb { width: 54px; height: 54px; }
.amv-card-thumb--submission { background: linear-gradient(135deg, #f4f0ea, #fbf2f6); }
.amv-card-thumb--quiz { background: linear-gradient(135deg, #fbf2f5, #f8f3e8); }
.amv-card-thumb svg { width: 26px; height: 26px; }
.history-card__main h3, .quiz-attempt__main h3 { color: #202631 !important; font-size: 14px !important; }
.history-card__main > p, .quiz-attempt__main > p { color: #707a87 !important; font-size: 11px !important; }
.history-card__main > small, .quiz-attempt__main > small { color: #9098a3 !important; font-size: 10px !important; }
.history-card__meta, .quiz-attempt__meta { gap: 7px !important; }
.history-card__review { min-height: 35px; padding-inline: 11px !important; border-radius: 9px !important; background: var(--amv-primary) !important; box-shadow: 0 6px 16px rgba(139,36,73,.18) !important; font-size: 10px !important; transition: .18s ease; }
.history-card__review:hover { transform: translateY(-1px); background: var(--amv-primary-deep) !important; }
.quiz-attempt__result { min-width: 118px; padding: 11px; border: 1px solid rgba(139,36,73,.08); border-radius: 13px; background: #fcf7f9; }
.quiz-attempt__result strong { color: var(--amv-primary) !important; font-size: 23px !important; }
.quiz-attempt__status { font-size: 9px !important; }

.empty-state, .state-card { border: 1px solid var(--amv-line); border-radius: 16px; background: rgba(255,255,255,.86); box-shadow: var(--amv-shadow-sm); }
.profile-toast { border-color: rgba(139,36,73,.13); border-radius: 14px; background: rgba(255,255,255,.90); box-shadow: 0 18px 48px rgba(21,25,35,.14); }

@keyframes amv-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes amv-pulse { 0%,100% { opacity: .26; transform: scale(1); } 50% { opacity: .62; transform: scale(1.04); } }

@media (max-width: 1120px) {
  .student-profile__summary { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .student-profile__quick-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media (max-width: 760px) {
  .student-profile__hero { padding: 23px 19px; border-radius: 21px; }
  .student-profile__avatar { width: 76px; height: 76px; }
  .student-profile__context-shell { top: 6px; }
  .student-profile__summary { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .student-profile__quick-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
  .history-card, .quiz-attempt { grid-template-columns: auto 1fr !important; }
  .history-card__actions, .quiz-attempt__result { grid-column: 1 / -1; width: 100%; }
  .quiz-attempt__result { display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 8px; }
  .quiz-attempt__result span { grid-column: 1; }
  .quiz-attempt__result strong { grid-column: 2; }
  .quiz-attempt__result .history-card__review { grid-column: 1 / -1; width: 100%; }
}
@media (max-width: 480px) {
  .student-profile__summary, .student-profile__quick-grid { grid-template-columns: 1fr; }
  .student-profile__section { padding: 17px; }
  .student-profile__identity-copy h1 { font-size: 1.8rem; }
  .amv-card-thumb { width: 46px; height: 46px; }
}
@media (prefers-reduced-motion: reduce) {
  .student-profile__hero::before, .student-profile__avatar::after { animation: none !important; }
  .student-profile *, .student-profile *::before, .student-profile *::after { transition: none !important; }
}

/* =========================================================
   V11.1 · NAVEGACIÓN ESTABLE
========================================================= */
.student-profile__context-shell {
  margin-top: 18px;
}

.student-profile__context-nav {
  overscroll-behavior-x: contain;
  scroll-snap-type: x proximity;
}

.student-profile__context-tab {
  scroll-snap-align: start;
  white-space: nowrap;
}

.student-profile__section[style*="display: none"] {
  margin: 0 !important;
}

/*
 * El cambio de subvista ocurre en el mismo espacio de trabajo.
 * No animamos posición vertical ni usamos scrollIntoView.
 */
.student-profile__context-shell,
.student-profile__context-nav {
  transform: none !important;
}

@media (min-width: 900px) {
  .student-profile__context-nav {
    justify-content: space-between;
    overflow-x: visible;
  }

  .student-profile__context-tab {
    flex: 1 1 0;
  }
}


/* =========================================================
   AMV VISUAL REDESIGN · V1
   Capa visual únicamente: no modifica lógica, servicios ni rutas.
========================================================= */

.student-profile {
  --amv-ink: #111827;
  --amv-ink-soft: #526071;
  --amv-paper: #f6f8fb;
  --amv-card: rgba(255, 255, 255, 0.92);
  --amv-line: rgba(15, 23, 42, 0.09);
  --amv-primary: #5b4cf0;
  --amv-primary-deep: #3d2fc2;
  --amv-accent: #d9a441;
  --amv-success: #1f9d68;
  --amv-danger: #d65a63;
  --amv-shadow: 0 24px 70px rgba(24, 32, 56, 0.09);
  --amv-shadow-soft: 0 12px 34px rgba(24, 32, 56, 0.07);
  position: relative;
  max-width: 1280px;
  padding: 18px 18px 90px;
  color: var(--amv-ink);
}

.student-profile::before {
  content: '';
  position: absolute;
  z-index: -1;
  inset: 80px -12vw auto;
  height: 520px;
  pointer-events: none;
  background:
    radial-gradient(circle at 12% 20%, rgba(91, 76, 240, .10), transparent 28%),
    radial-gradient(circle at 88% 8%, rgba(217, 164, 65, .10), transparent 24%);
}

.student-profile__back {
  width: fit-content;
  margin: 0 0 18px;
  padding: 8px 13px;
  border: 1px solid var(--amv-line);
  border-radius: 999px;
  background: rgba(255,255,255,.72);
  box-shadow: 0 8px 24px rgba(24,32,56,.04);
  color: var(--amv-ink-soft);
  backdrop-filter: blur(12px);
}

.student-profile__hero {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: 270px;
  margin-bottom: 16px;
  padding: 34px;
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 30px;
  background:
    radial-gradient(circle at 88% 16%, rgba(217,164,65,.25), transparent 23%),
    radial-gradient(circle at 74% 82%, rgba(91,76,240,.30), transparent 31%),
    linear-gradient(135deg, #15172d 0%, #22204a 48%, #4b3bc4 100%);
  box-shadow: 0 28px 80px rgba(34, 29, 82, .20);
}

.student-profile__hero::before {
  content: '';
  position: absolute;
  z-index: -1;
  width: 360px;
  height: 360px;
  right: -110px;
  top: -150px;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 50%;
  box-shadow:
    0 0 0 38px rgba(255,255,255,.025),
    0 0 0 78px rgba(255,255,255,.018);
}

.student-profile__hero::after {
  content: '';
  position: absolute;
  left: 34%;
  bottom: -100px;
  width: 420px;
  height: 220px;
  border-radius: 50%;
  background: rgba(255,255,255,.055);
  filter: blur(8px);
}

.student-profile__identity { gap: 24px; }

.student-profile__avatar {
  width: 108px;
  height: 108px;
  border: 1px solid rgba(255,255,255,.38);
  outline: 8px solid rgba(255,255,255,.045);
  color: #fff;
  background:
    linear-gradient(145deg, rgba(255,255,255,.20), rgba(255,255,255,.06));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.25),
    0 16px 35px rgba(0,0,0,.18);
  font-size: 1.8rem;
  letter-spacing: .04em;
  backdrop-filter: blur(12px);
}

.student-profile__eyebrow,
.student-profile__identity-copy h1,
.student-profile__identity-copy p { color: #fff; }

.student-profile__eyebrow { opacity: .72; letter-spacing: .16em; }
.student-profile__identity-copy h1 { letter-spacing: -.045em; }

.student-profile__badges { margin-top: 16px; }

.voice-badge {
  border-color: rgba(255,255,255,.18);
  color: #fff;
  background: rgba(255,255,255,.10);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
  backdrop-filter: blur(12px);
}

.status-badge {
  border-color: rgba(120,255,193,.22);
  color: #aaf5d0;
  background: rgba(50, 205, 130, .12);
}

.status-badge--inactive {
  border-color: rgba(255,255,255,.14);
  color: rgba(255,255,255,.62);
  background: rgba(255,255,255,.07);
}

.student-profile__edit-profile {
  min-height: 46px;
  padding: 0 18px;
  border-color: rgba(255,255,255,.18);
  border-radius: 14px;
  color: #fff;
  background: rgba(255,255,255,.10);
  box-shadow: inset 0 1px 0 rgba(255,255,255,.10);
  backdrop-filter: blur(12px);
}

.student-profile__edit-profile:hover {
  border-color: rgba(255,255,255,.42);
  background: rgba(255,255,255,.16);
  transform: translateY(-1px);
}

.student-profile__context-shell {
  position: sticky;
  top: 76px;
  z-index: 30;
  margin: 0 0 18px;
  padding: 10px;
  border: 1px solid rgba(15,23,42,.08);
  border-radius: 20px;
  background: rgba(250,251,253,.84);
  box-shadow: 0 14px 40px rgba(24,32,56,.08);
  backdrop-filter: blur(18px) saturate(140%);
}

.student-profile__context-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 7px 12px 10px;
}

.student-profile__context-heading span {
  display: block;
  margin-bottom: 3px;
  color: var(--amv-primary);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .15em;
}

.student-profile__context-heading strong {
  color: var(--amv-ink);
  font-size: 15px;
}

.student-profile__context-heading small {
  max-width: 390px;
  color: var(--amv-ink-soft);
  font-size: 12px;
  line-height: 1.45;
  text-align: right;
}

.student-profile__context-nav {
  gap: 6px;
  padding: 4px;
  border-radius: 14px;
  background: #eef1f6;
}

.student-profile__context-tab {
  position: relative;
  min-height: 44px;
  border: 0;
  border-radius: 11px;
  color: #687385;
  background: transparent;
  font-weight: 700;
  transition: .22s ease;
}

.student-profile__context-tab:hover {
  color: var(--amv-ink);
  background: rgba(255,255,255,.66);
}

.student-profile__context-tab--active {
  color: #fff !important;
  background: linear-gradient(135deg, var(--amv-primary), var(--amv-primary-deep));
  box-shadow: 0 8px 20px rgba(91,76,240,.24);
}

.student-profile__summary {
  gap: 12px;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-bottom: 18px;
}

.student-profile__summary article {
  position: relative;
  overflow: hidden;
  min-height: 132px;
  padding: 18px;
  border: 1px solid var(--amv-line);
  border-radius: 18px;
  background: var(--amv-card);
  box-shadow: var(--amv-shadow-soft);
  transition: transform .22s ease, box-shadow .22s ease, border-color .22s ease;
}

.student-profile__summary article::after {
  content: '';
  position: absolute;
  right: -28px;
  bottom: -38px;
  width: 105px;
  height: 105px;
  border-radius: 50%;
  background: rgba(91,76,240,.055);
}

.student-profile__summary article:hover {
  transform: translateY(-3px);
  border-color: rgba(91,76,240,.18);
  box-shadow: var(--amv-shadow);
}

.student-profile__summary span {
  color: #6c7787;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .07em;
  text-transform: uppercase;
}

.student-profile__summary strong {
  position: relative;
  z-index: 1;
  margin: 12px 0 5px;
  color: var(--amv-ink);
  font-size: 28px;
  letter-spacing: -.045em;
}

.student-profile__summary small { position: relative; z-index: 1; }

.student-profile__summary .summary-card--primary {
  border-color: rgba(91,76,240,.16);
  background: linear-gradient(145deg, #fff, #f0eeff);
}

.student-profile__summary .summary-card--primary strong { color: var(--amv-primary); }

.student-profile__summary .summary-card--attention {
  border-color: rgba(214,90,99,.18);
  background: linear-gradient(145deg, #fff, #fff4f5);
}

.student-profile__summary .summary-card--attention strong { color: var(--amv-danger); }

.student-profile__overview {
  margin-bottom: 28px;
  padding: 24px;
  border: 1px solid var(--amv-line);
  border-radius: 24px;
  background: rgba(255,255,255,.82);
  box-shadow: var(--amv-shadow-soft);
}

.student-profile__overview > header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 18px;
}

.student-profile__overview header span {
  color: var(--amv-primary);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: .15em;
}

.student-profile__overview header h2 {
  margin: 6px 0 0;
  color: var(--amv-ink);
  font-size: clamp(1.45rem, 3vw, 2rem);
  letter-spacing: -.04em;
}

.student-profile__overview header > p {
  max-width: 440px;
  margin: 0;
  color: var(--amv-ink-soft);
  font-size: 13px;
  line-height: 1.55;
  text-align: right;
}

.student-profile__quick-grid {
  display: grid;
  gap: 10px;
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.student-profile__quick-grid button {
  position: relative;
  overflow: hidden;
  min-height: 128px;
  padding: 18px;
  border: 1px solid var(--amv-line);
  border-radius: 17px;
  color: var(--amv-ink);
  background: #f8fafc;
  text-align: left;
  cursor: pointer;
  transition: .22s ease;
}

.student-profile__quick-grid button::before {
  content: '';
  position: absolute;
  width: 62px;
  height: 62px;
  right: -16px;
  top: -18px;
  border-radius: 50%;
  background: rgba(91,76,240,.08);
}

.student-profile__quick-grid button:hover {
  transform: translateY(-3px);
  border-color: rgba(91,76,240,.20);
  background: #fff;
  box-shadow: 0 12px 28px rgba(24,32,56,.08);
}

.student-profile__quick-grid span,
.student-profile__quick-grid strong,
.student-profile__quick-grid small { position: relative; z-index: 1; display: block; }
.student-profile__quick-grid span { color: #697586; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: .07em; }
.student-profile__quick-grid strong { margin: 12px 0 5px; font-size: 25px; letter-spacing: -.04em; }
.student-profile__quick-grid small { color: #7a8594; font-size: 11px; line-height: 1.45; }

.profile-nav {
  top: 146px;
  margin-bottom: 26px;
  border-color: var(--amv-line);
  border-radius: 15px;
  background: rgba(255,255,255,.76);
  box-shadow: 0 8px 24px rgba(24,32,56,.05);
}

.profile-nav a { border-radius: 10px; }

.student-profile__section {
  margin-bottom: 30px;
  padding: 26px;
  border: 1px solid var(--amv-line);
  border-radius: 26px;
  background: rgba(255,255,255,.88);
  box-shadow: var(--amv-shadow-soft);
}

.student-profile__section-header {
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid rgba(15,23,42,.07);
}

.student-profile__section-title > span {
  width: 44px;
  height: 44px;
  border: 0;
  color: #fff;
  background: linear-gradient(145deg, var(--amv-primary), var(--amv-primary-deep));
  box-shadow: 0 8px 20px rgba(91,76,240,.22);
}

.student-profile__section-title p { color: var(--amv-primary); }
.student-profile__section-title h2 { color: var(--amv-ink); letter-spacing: -.045em; }

.student-profile__section-header > p { color: var(--amv-ink-soft); }

.vocal-card,
.attendance-profile,
.rubric-overview {
  padding: 24px;
  border: 1px solid var(--amv-line);
  border-radius: 20px;
  background: linear-gradient(145deg, #fff, #f8f9fc);
  box-shadow: none;
}

.vocal-card__classification strong { color: var(--amv-primary); }

.history-card,
.quiz-attempt {
  border: 1px solid var(--amv-line) !important;
  border-radius: 18px !important;
  background: #fff !important;
  box-shadow: 0 8px 24px rgba(24,32,56,.055);
  transition: .22s ease;
}

.history-card:hover,
.quiz-attempt:hover {
  transform: translateY(-2px);
  border-color: rgba(91,76,240,.18) !important;
  box-shadow: 0 16px 36px rgba(24,32,56,.09);
}

.quiz-attempts { gap: 12px; }

.quiz-attempt__result {
  min-width: 112px;
  padding: 14px;
  border-radius: 15px;
  background: linear-gradient(145deg, #f7f5ff, #f0eeff);
}

.quiz-attempt__result strong {
  color: var(--amv-primary) !important;
  font-size: 25px !important;
  letter-spacing: -.04em;
}

.quiz-attempt__status {
  border-radius: 999px !important;
  font-weight: 800 !important;
}

.history-card__review {
  border-radius: 10px !important;
  background: var(--amv-primary) !important;
  color: #fff !important;
  box-shadow: 0 7px 18px rgba(91,76,240,.20);
}

.empty-state,
.state-card {
  border: 1px solid var(--amv-line);
  border-radius: 20px;
  background: rgba(255,255,255,.9);
  box-shadow: var(--amv-shadow-soft);
}

.profile-toast {
  border: 1px solid rgba(255,255,255,.18);
  border-radius: 16px;
  box-shadow: 0 18px 50px rgba(24,32,56,.18);
  backdrop-filter: blur(18px);
}

@media (max-width: 1120px) {
  .student-profile__summary { grid-template-columns: repeat(3, minmax(0, 1fr)); }
  .student-profile__quick-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .student-profile { padding: 12px 10px 60px; }
  .student-profile__hero { min-height: 0; padding: 24px 20px; border-radius: 24px; }
  .student-profile__identity { align-items: flex-start; }
  .student-profile__avatar { width: 76px; height: 76px; }
  .student-profile__identity-copy h1 { font-size: 2.15rem; }
  .student-profile__hero-actions { width: 100%; }
  .student-profile__edit-profile { width: 100%; }
  .student-profile__context-shell { top: 8px; }
  .student-profile__context-heading { align-items: flex-start; }
  .student-profile__context-heading small { display: none; }
  .student-profile__summary { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .student-profile__overview { padding: 18px; }
  .student-profile__overview > header { align-items: flex-start; flex-direction: column; }
  .student-profile__overview header > p { text-align: left; }
  .student-profile__quick-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .student-profile__section { padding: 18px; border-radius: 20px; }
  .student-profile__section-header { align-items: flex-start; flex-direction: column; }
  .student-profile__section-header > p { text-align: left; }
  .profile-nav { display: none; }
}

@media (max-width: 480px) {
  .student-profile__summary,
  .student-profile__quick-grid { grid-template-columns: 1fr; }
  .student-profile__identity { gap: 15px; }
  .student-profile__avatar { width: 62px; height: 62px; outline-width: 5px; font-size: 1.2rem; }
  .student-profile__identity-copy h1 { font-size: 1.75rem; }
  .student-profile__badges { margin-top: 11px; }
}

@media (prefers-reduced-motion: reduce) {
  .student-profile *,
  .student-profile *::before,
  .student-profile *::after { transition: none !important; animation: none !important; }
}



/* =========================================================
   AMV VISUAL REDESIGN · V3
   CATEGORÍAS ACADÉMICAS · WINE / PURPLE / GOLD
   Efectos únicamente visuales. Clicks y rutas intactos.
========================================================= */

/* ---------------------------------------------------------
   EVALUACIONES
   Quiz = morado · Prueba = dorado
--------------------------------------------------------- */
.quiz-attempt {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border: 1px solid rgba(83,31,49,.10) !important;
  background: #fff !important;
  box-shadow: 0 10px 28px rgba(67,24,41,.055) !important;
}

.quiz-attempt::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
  background: #9f1945;
  opacity: .95;
  transition: width .22s ease, opacity .22s ease;
  z-index: -1;
}

.quiz-attempt::after {
  content: '';
  position: absolute;
  width: 180px;
  height: 180px;
  right: -85px;
  top: -105px;
  border-radius: 50%;
  background: rgba(159,25,69,.055);
  filter: blur(5px);
  pointer-events: none;
  z-index: -1;
}

.quiz-attempt:hover {
  transform: translateY(-3px) !important;
  box-shadow: 0 18px 38px rgba(67,24,41,.095) !important;
}

.quiz-attempt:hover::before {
  width: 6px;
}

.quiz-attempt--quiz {
  border-color: rgba(103,76,171,.18) !important;
  background: linear-gradient(135deg, #fff 0%, #fcfaff 72%, #f7f2ff 100%) !important;
}

.quiz-attempt--quiz::before {
  background: linear-gradient(180deg, #7f5bc6, #5b3d99);
}

.quiz-attempt--quiz::after {
  background: rgba(111,75,175,.065);
}

.quiz-attempt--quiz .amv-card-thumb--quiz {
  border-color: rgba(111,75,175,.18) !important;
  background: linear-gradient(145deg, #f7f2ff, #eee6ff) !important;
  color: #6748aa !important;
  box-shadow: inset 0 0 0 1px rgba(111,75,175,.025), 0 8px 18px rgba(111,75,175,.08);
}

.quiz-attempt--quiz .quiz-attempt__status--passed {
  color: #216b4d;
  background: #eaf7f1;
}

.quiz-attempt--quiz .quiz-attempt__result {
  border-color: rgba(111,75,175,.12) !important;
  background: linear-gradient(145deg, #f9f5ff, #f2ebff) !important;
}

.quiz-attempt--quiz .quiz-attempt__result > strong {
  color: #6748aa !important;
}

.quiz-attempt--quiz .history-card__review {
  background: linear-gradient(135deg, #6d4cae, #55358b) !important;
  box-shadow: 0 8px 20px rgba(87,56,143,.22) !important;
}

.quiz-attempt--quiz .history-card__review:hover {
  background: #55358b !important;
}

.quiz-attempt--test {
  border-color: rgba(217,169,29,.24) !important;
  background: linear-gradient(135deg, #fff 0%, #fffdf8 72%, #fff8e5 100%) !important;
}

.quiz-attempt--test::before {
  background: linear-gradient(180deg, #e2b83c, #b78a0f);
}

.quiz-attempt--test::after {
  background: rgba(217,169,29,.075);
}

.quiz-attempt--test .amv-card-thumb--quiz {
  border-color: rgba(217,169,29,.22) !important;
  background: linear-gradient(145deg, #fff9e8, #fff0c7) !important;
  color: #aa7d08 !important;
  box-shadow: inset 0 0 0 1px rgba(217,169,29,.028), 0 8px 18px rgba(190,147,28,.09);
}

.quiz-attempt--test .quiz-attempt__result {
  border-color: rgba(217,169,29,.18) !important;
  background: linear-gradient(145deg, #fffaf0, #fff4d9) !important;
}

.quiz-attempt--test .quiz-attempt__result > strong {
  color: #a87900 !important;
}

.quiz-attempt--test .history-card__review {
  background: linear-gradient(135deg, #c29513, #9b7305) !important;
  box-shadow: 0 8px 20px rgba(174,133,15,.19) !important;
  color: #fff !important;
}

.quiz-attempt--test .history-card__review:hover {
  background: #9b7305 !important;
}

/* ---------------------------------------------------------
   TAREAS · rojo AMV
--------------------------------------------------------- */
.history-card {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  border-color: rgba(159,25,69,.14) !important;
  background: linear-gradient(135deg, #fff 0%, #fffafb 100%) !important;
}

.history-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  border-radius: 4px 0 0 4px;
  background: linear-gradient(180deg, #a7194b, #821037);
  transition: width .22s ease;
}

.history-card:hover {
  border-color: rgba(159,25,69,.24) !important;
  box-shadow: 0 18px 38px rgba(110,22,54,.095) !important;
}

.history-card:hover::before {
  width: 6px;
}

.history-card .amv-card-thumb--submission {
  border-color: rgba(159,25,69,.14) !important;
  background: linear-gradient(145deg, #fff3f6, #f9e8ee) !important;
  color: #9f1945 !important;
  box-shadow: 0 8px 18px rgba(159,25,69,.08);
}

.history-card__review {
  background: linear-gradient(135deg, #a7194b, #821037) !important;
}

/* ---------------------------------------------------------
   ASISTENCIA · cada tarjeta refleja su estado
   Verde = presente · Rojo = ausente · Amarillo = justificado
--------------------------------------------------------- */
.attendance-history__item {
  position: relative;
  overflow: hidden;
  border-color: rgba(83,31,49,.10) !important;
  background: #fff !important;
  box-shadow: 0 7px 20px rgba(67,24,41,.035);
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;
}

.attendance-history__item::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  background: #c4ccd6;
  transition: width .2s ease;
}

.attendance-history__item:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px rgba(67,24,41,.075);
}

.attendance-history__item:hover::before {
  width: 6px;
}

.attendance-history__item:has(.attendance-history__status--present) {
  border-color: rgba(45,138,99,.24) !important;
  background: linear-gradient(135deg, #ffffff 0%, #f5fbf8 100%) !important;
  box-shadow: 0 8px 24px rgba(45,138,99,.065);
}

.attendance-history__item:has(.attendance-history__status--present)::before {
  background: linear-gradient(180deg, #45a976, #21704f);
}

.attendance-history__item:has(.attendance-history__status--present):hover {
  box-shadow: 0 15px 30px rgba(45,138,99,.11);
}

.attendance-history__item:has(.attendance-history__status--absent) {
  border-color: rgba(183,76,91,.25) !important;
  background: linear-gradient(135deg, #ffffff 0%, #fff7f8 100%) !important;
  box-shadow: 0 8px 24px rgba(183,76,91,.06);
}

.attendance-history__item:has(.attendance-history__status--absent)::before {
  background: linear-gradient(180deg, #d56c7a, #a53e4d);
}

.attendance-history__item:has(.attendance-history__status--absent):hover {
  box-shadow: 0 15px 30px rgba(183,76,91,.105);
}

.attendance-history__item:has(.attendance-history__status--justified) {
  border-color: rgba(217,169,29,.28) !important;
  background: linear-gradient(135deg, #ffffff 0%, #fffaf0 100%) !important;
  box-shadow: 0 8px 24px rgba(217,169,29,.065);
}

.attendance-history__item:has(.attendance-history__status--justified)::before {
  background: linear-gradient(180deg, #e6c14c, #b98d12);
}

.attendance-history__item:has(.attendance-history__status--justified):hover {
  box-shadow: 0 15px 30px rgba(217,169,29,.11);
}

.attendance-history__item:has(.attendance-history__status--present) .attendance-history__status--present,
.attendance-history__item:has(.attendance-history__status--absent) .attendance-history__status--absent,
.attendance-history__item:has(.attendance-history__status--justified) .attendance-history__status--justified {
  font-weight: 850;
}

.attendance-history__item:has(.attendance-history__status--present) .attendance-history__status--present {
  color: #227651 !important;
  border-color: rgba(45,138,99,.22) !important;
  background: rgba(45,138,99,.09) !important;
  box-shadow: 0 0 0 4px rgba(45,138,99,.035);
}

.attendance-history__item:has(.attendance-history__status--absent) .attendance-history__status--absent {
  color: #a33d4c !important;
  border-color: rgba(183,76,91,.23) !important;
  background: rgba(183,76,91,.09) !important;
  box-shadow: 0 0 0 4px rgba(183,76,91,.035);
}

.attendance-history__item:has(.attendance-history__status--justified) .attendance-history__status--justified {
  color: #9a7307 !important;
  border-color: rgba(217,169,29,.28) !important;
  background: rgba(217,169,29,.105) !important;
  box-shadow: 0 0 0 4px rgba(217,169,29,.038);
}

.attendance-history__item:has(.attendance-history__status--present) .attendance-history__lesson > span {
  color: #2a805b !important;
}

.attendance-history__item:has(.attendance-history__status--absent) .attendance-history__lesson > span {
  color: #a33d4c !important;
}

.attendance-history__item:has(.attendance-history__status--justified) .attendance-history__lesson > span {
  color: #a07a0a !important;
}

@media (max-width: 720px) {
  .quiz-attempt--quiz .quiz-attempt__result,
  .quiz-attempt--test .quiz-attempt__result {
    width: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quiz-attempt,
  .history-card,
  .attendance-history__item,
  .quiz-attempt::before,
  .history-card::before,
  .attendance-history__item::before {
    transition: none !important;
  }
}


/* =========================================================
   AMV VISUAL REDESIGN · V2
   WINE / GOLD · MINIMAL PREMIUM
   Solo capa visual: no modifica lógica, servicios ni rutas.
========================================================= */
.student-profile {
  --amv-primary: #9f1945 !important;
  --amv-primary-deep: #7f1237 !important;
  --amv-accent: #d9a91d !important;
  --amv-danger: #b74c5b !important;
  --amv-ink: #1c2028 !important;
  --amv-ink-soft: #68717f !important;
  --amv-paper: #f7f5f3 !important;
  --amv-card: rgba(255,255,255,.94) !important;
  --amv-line: rgba(83, 31, 49, .11) !important;
  --amv-shadow: 0 22px 60px rgba(67, 24, 41, .09) !important;
  --amv-shadow-soft: 0 10px 28px rgba(67, 24, 41, .055) !important;
  background:
    radial-gradient(circle at 6% 7%, rgba(159,25,69,.045), transparent 22%),
    radial-gradient(circle at 94% 15%, rgba(217,169,29,.035), transparent 20%);
}

.student-profile::before {
  background:
    radial-gradient(circle at 12% 20%, rgba(159,25,69,.075), transparent 29%),
    radial-gradient(circle at 88% 8%, rgba(217,169,29,.07), transparent 23%) !important;
}

.student-profile__back {
  border-color: rgba(159,25,69,.12) !important;
  background: rgba(255,255,255,.78) !important;
  color: #6c5b63 !important;
}

.student-profile__hero {
  background:
    radial-gradient(circle at 88% 16%, rgba(217,169,29,.20), transparent 23%),
    radial-gradient(circle at 74% 82%, rgba(159,25,69,.25), transparent 31%),
    linear-gradient(135deg, #261019 0%, #481426 50%, #7f1237 100%) !important;
  box-shadow: 0 24px 62px rgba(83,20,46,.20) !important;
}

.student-profile__hero::before {
  border-color: rgba(255,255,255,.14) !important;
  box-shadow:
    0 0 0 38px rgba(255,255,255,.022),
    0 0 0 78px rgba(217,169,29,.025) !important;
}

.student-profile__hero::after {
  background: rgba(255,246,225,.042) !important;
}

.student-profile__avatar {
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,.25),
    0 0 0 1px rgba(217,169,29,.12),
    0 16px 35px rgba(0,0,0,.18) !important;
}

.student-profile__context-shell {
  border-color: rgba(159,25,69,.09) !important;
  background: rgba(251,249,248,.88) !important;
}

.student-profile__context-heading span,
.student-profile__section-title p,
.student-profile__overview header span {
  color: var(--amv-primary) !important;
}

.student-profile__context-heading strong,
.student-profile__overview header h2,
.student-profile__section-title h2,
.student-profile__summary strong,
.student-profile__quick-grid strong,
.vocal-card__classification strong {
  color: var(--amv-ink) !important;
}

.student-profile__context-nav {
  background: #f1ecee !important;
}

.student-profile__context-tab:hover {
  color: var(--amv-primary-deep) !important;
  background: rgba(255,255,255,.76) !important;
}

.student-profile__context-tab--active {
  background: linear-gradient(135deg, #9f1945, #7f1237) !important;
  box-shadow: 0 8px 20px rgba(159,25,69,.22) !important;
}

.student-profile__summary article::after {
  background: rgba(159,25,69,.052) !important;
}

.student-profile__summary article:hover,
.student-profile__quick-grid button:hover,
.history-card:hover,
.quiz-attempt:hover {
  border-color: rgba(159,25,69,.18) !important;
}

.student-profile__summary .summary-card--primary {
  border-color: rgba(159,25,69,.15) !important;
  background: linear-gradient(145deg, #fff, #fbf1f4) !important;
}

.student-profile__summary .summary-card--primary strong,
.student-profile__section-title p,
.quiz-attempt__result strong {
  color: var(--amv-primary) !important;
}

.student-profile__overview {
  background: rgba(255,255,255,.86) !important;
}

.student-profile__quick-grid button {
  background: #fbfaf9 !important;
}

.student-profile__quick-grid button::before {
  background: rgba(159,25,69,.065) !important;
}

.student-profile__quick-grid button:hover {
  background: #fff !important;
  box-shadow: 0 12px 28px rgba(83,24,43,.075) !important;
}

.student-profile__quick-grid strong {
  color: #252b34 !important;
}

.profile-nav {
  background: rgba(255,255,255,.80) !important;
}

.student-profile__section {
  background: rgba(255,255,255,.90) !important;
  box-shadow: var(--amv-shadow-soft) !important;
}

.student-profile__section-title > span {
  background: linear-gradient(145deg, #9f1945, #7f1237) !important;
  box-shadow: 0 8px 20px rgba(159,25,69,.20) !important;
}

.vocal-card,
.attendance-profile,
.rubric-overview {
  background: linear-gradient(145deg, #fff, #fbf8f8) !important;
}

.quiz-attempt__result {
  border: 1px solid rgba(159,25,69,.08) !important;
  background: linear-gradient(145deg, #fcf4f7, #fffaf1) !important;
}

.history-card__review {
  background: linear-gradient(135deg, #9f1945, #7f1237) !important;
  box-shadow: 0 7px 18px rgba(159,25,69,.18) !important;
}

.history-card__review:hover {
  background: #7f1237 !important;
}

.status-badge {
  border-color: rgba(45,138,99,.22) !important;
  color: #247653 !important;
  background: rgba(45,138,99,.09) !important;
}

.empty-state__link,
.empty-state a {
  color: var(--amv-primary) !important;
}

.profile-toast {
  border-color: rgba(159,25,69,.10) !important;
}

/* Micro-effects: discretos y sin alterar interacción */
.student-profile__hero,
.student-profile__summary article,
.student-profile__quick-grid button,
.student-profile__section,
.history-card,
.quiz-attempt,
.vocal-card,
.attendance-profile,
.rubric-overview {
  will-change: transform;
}

.student-profile__quick-grid button,
.history-card,
.quiz-attempt,
.student-profile__summary article {
  transition:
    transform .2s ease,
    box-shadow .2s ease,
    border-color .2s ease,
    background-color .2s ease !important;
}

@media (prefers-reduced-motion: reduce) {
  .student-profile__quick-grid button,
  .history-card,
  .quiz-attempt,
  .student-profile__summary article {
    transition: none !important;
  }
}
</style>


<style lang="scss">
/* AMV UI POLISH 2026 — visual consistency, accessibility and mobile resilience. */
.amv-view-shell {
  --amv-ui-wine: #9f1945;
  --amv-ui-wine-deep: #7f1237;
  --amv-ui-gold: #d9a91d;
  --amv-ui-purple: #7657d9;
  --amv-ui-cyan: #20b8ae;
  --amv-ui-ink: #172033;
  --amv-ui-muted: #6f7c8f;
  --amv-ui-line: rgba(122, 137, 158, 0.20);
  --amv-ui-focus: rgba(159, 25, 69, 0.38);
  --amv-ui-radius-sm: 12px;
  --amv-ui-radius-md: 18px;
  --amv-ui-radius-lg: 26px;
  --amv-ui-shadow: 0 18px 55px rgba(17, 25, 39, 0.09);
  --amv-ui-shadow-hover: 0 22px 65px rgba(17, 25, 39, 0.14);
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  isolation: isolate;
  overflow-x: clip;
  -webkit-tap-highlight-color: transparent;
}

.amv-view-shell::before {
  content: '';
  position: absolute;
  inset: -150px -120px auto auto;
  width: 420px;
  height: 420px;
  pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(159, 25, 69, 0.10), transparent 52%),
    radial-gradient(circle at 68% 62%, rgba(217, 169, 29, 0.08), transparent 58%);
  filter: blur(6px);
  opacity: 0.82;
  z-index: -1;
}

.amv-view-shell :where(*, *::before, *::after) {
  box-sizing: border-box;
}

.amv-view-shell :where(img, video, svg, canvas) {
  max-width: 100%;
}

.amv-view-shell :where(h1, h2, h3, h4, h5, h6) {
  text-wrap: balance;
}

.amv-view-shell :where(p, li, td, th, label, small) {
  overflow-wrap: anywhere;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']) {
  touch-action: manipulation;
}

.amv-view-shell :where(button, input, select, textarea) {
  font: inherit;
}

.amv-view-shell :where(button) {
  min-height: 42px;
}

.amv-view-shell :where(input, select, textarea) {
  max-width: 100%;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']):focus-visible {
  outline: 3px solid var(--amv-ui-focus);
  outline-offset: 3px;
}

.amv-view-shell :where(button, [role='button']):disabled,
.amv-view-shell :where(input, select, textarea):disabled {
  cursor: not-allowed;
}

.amv-view-shell :where(.button, .btn, .lux-button, .amv-primary-btn, .amv-secondary-action,
  .primary-action, .secondary-action, .danger-action, .text-link, .action-link,
  .lightbox__close, .lightbox__nav, .today-button, .quick-action) {
  -webkit-user-select: none;
  user-select: none;
}

/* Premium surface language without changing each view's semantic palette. */
.amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
  .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
  .resource-card, .student-card, .lesson-card, .task-card, .format-card,
  .production, .sound-console, .state-card, .empty-card, .workspace,
  .profile-card, .profile-panel, .vocal-card, .weighted-student, .weighted-category) {
  border-radius: var(--amv-ui-radius-md);
}

.amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
  .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
  .task-card, .format-card, .production, .state-card, .empty-card) {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
    .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
    .task-card, .format-card, .production):not(.is-disabled):hover {
    transform: translateY(-2px);
  }
}

/* Toolbars wrap rather than squeezing controls into unreadable rows. */
.amv-view-shell :where(.toolbar, .students-toolbar, .calendar-toolbar, .resources-controls,
  .resources-controls__row, .gradebook-legacy-toolbar, .hero-actions, .actions,
  .action-row, .question-actions, .filters, .public-jump-nav, .classes-header__actions,
  .result-action-row, .form-actions, .footer-actions) {
  min-width: 0;
}

.amv-view-shell :where(.table-shell, .quiz-table-wrap, .table-wrap, .grade-table-wrap,
  .data-table-wrap, .scroll-region, .horizontal-scroll) {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.amv-view-shell :where(.table-shell table, .quiz-table-wrap table, .table-wrap table,
  .grade-table-wrap table, .data-table-wrap table) {
  max-width: none;
}

/* Prevent long controls and badges from forcing page-level horizontal overflow. */
.amv-view-shell :where(.badge, .pill, .chip, .status-pill, .source-badge, .event-chip,
  .lesson-detail, .student-card__voice, .student-card__status, .course-kicker,
  .hero-stat, .count, .filename, .meta, .eyebrow) {
  max-width: 100%;
}

/* Dialogs/lightboxes stay usable on short laptop and phone viewports. */
.amv-view-shell :where(.modal, .dialog, .drawer, .lightbox, .lightbox__content,
  .modal__content, .dialog__content, [role='dialog']) {
  max-width: min(100%, 100vw);
}

.amv-view-shell :where(.modal__content, .dialog__content, .lightbox__content,
  [role='dialog']) {
  max-height: calc(100dvh - 28px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Public pages: a cleaner editorial frame around content-heavy sections. */
.amv-view-shell :where(.hero, .hero-panel, .calendar-hero, .resources-hero, .amv-hero,
  .students__header, .gradebook__hero, .classes-header, .contact-hero, .training-hero,
  .academy-hero, .inscription-hero) {
  isolation: isolate;
}

.amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid) {
  min-width: 0;
}

/* Mobile-first resilience. Existing view-specific breakpoints still win where more
   specific rules exist, while these defaults catch edge cases and tiny screens. */
@media (max-width: 760px) {
  .amv-view-shell {
    overflow-x: clip;
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 22px;
  }

  .amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid,
    .calendar-layout, .quiz-layout, .program-layout, .student-profile__grid,
    .dashboard-grid, .content-grid, .page-grid, .split-layout) {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .amv-view-shell :where(.hero-actions, .actions, .action-row, .form-actions,
    .footer-actions, .question-actions, .students__header-actions, .hero-stat,
    .calendar-toolbar, .resources-controls__row) {
    flex-wrap: wrap;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    min-width: min(100%, 190px);
  }

  .amv-view-shell :where(.display-title, .page-title, .hero-title, .section-title,
    .hero-panel__title, .amv-hero h1, .calendar-hero h1, .students__header h1,
    .gradebook__hero h1) {
    font-size: clamp(1.8rem, 7vw, 3rem);
    line-height: 1.05;
  }

  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .amv-view-shell :where(.students-toolbar, .resources-controls, .calendar-toolbar,
    .gradebook-legacy-toolbar, .classes-header, .section-heading, .profile-actions) {
    gap: 10px;
  }

  .amv-view-shell :where(input, select, textarea, .select, .search-input) {
    min-height: 44px;
  }
}

@media (max-width: 520px) {
  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: minmax(0, 1fr);
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 18px;
  }

  .amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
    .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
    .resource-card, .student-card, .lesson-card, .task-card, .format-card,
    .production, .state-card, .empty-card) {
    border-radius: 16px;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    width: 100%;
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .amv-view-shell,
  .amv-view-shell :where(*, *::before, *::after) {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
