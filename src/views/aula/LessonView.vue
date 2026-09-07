<template>
  <section class="lesson-page lesson-page--max">
    <!-- =====================================================
         LOADING
    ====================================================== -->
    <section
      v-if="isLoading"
      class="state-screen"
    >
      <div class="state-screen__loader"></div>

      <strong>
        Preparando tu clase
      </strong>

      <p>
        Estamos cargando el contenido, materiales,
        actividades y progreso académico.
      </p>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="state-screen state-screen--error"
    >
      <div class="state-screen__error-icon">
        !
      </div>

      <h1>
        No pudimos cargar esta clase
      </h1>

      <p>
        {{ loadError }}
      </p>

      <div class="state-screen__actions">
        <button
          type="button"
          @click="loadLesson"
        >
          Reintentar
        </button>

        <RouterLink
          to="/aula/programa-formativo"
        >
          Volver al programa
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         CLASE
    ====================================================== -->
    <template v-else-if="lesson">
      <!-- ===================================================
           TOPBAR
      ==================================================== -->
      <div class="lesson-topbar">
        <RouterLink
          to="/aula/programa-formativo"
          class="back-link"
        >
          <span>←</span>
          Programa formativo
        </RouterLink>

        <div class="lesson-mode-chip" :class="{ 'lesson-mode-chip--teacher': isTeacher }">
          <span></span>
          {{ isTeacher ? 'Vista profesor' : 'Vista estudiante' }}
        </div>

        <div
          v-if="isTeacher"
          class="teacher-actions"
        >
          <RouterLink
            :to="`/aula/clase/${lesson.id}/editar`"
            class="teacher-button"
          >
            <span>✎</span>
            Editar clase
          </RouterLink>

          <RouterLink
            :to="`/aula/clase/${lesson.id}/trabajo`"
            class="teacher-button teacher-button--primary"
          >
            Contenidos y evaluaciones
          </RouterLink>
        </div>

        <div
          v-else
          class="student-topbar-status"
        >
          <span
            class="student-topbar-status__dot"
            :class="{
              'student-topbar-status__dot--complete':
                lessonCompleted
            }"
          ></span>

          {{
            lessonCompleted
              ? 'Clase completada'
              : 'Clase en progreso'
          }}
        </div>
      </div>

      <!-- ===================================================
           BREADCRUMB UNIDAD
      ==================================================== -->
      <div
        v-if="currentUnit"
        class="unit-breadcrumb"
      >
        <span>
          UNIDAD {{ currentUnit.position }}
        </span>

        <strong>
          {{ currentUnit.title }}
        </strong>

        <span>
          /
        </span>

        <small>
          Clase {{ lessonPositionInUnit }}
          de {{ unitLessons.length }}
        </small>
      </div>

      <!-- ===================================================
           HERO
      ==================================================== -->
      <header
        class="lesson-hero"
        :style="lessonHeroStyle"
        :class="{
          'lesson-hero--completed':
            !isTeacher &&
            lessonCompleted
        }"
      >
        <div class="lesson-hero__content">
          <div class="lesson-hero__eyebrow">
            <span></span>

            {{
              currentUnit
                ? `UNIDAD ${currentUnit.position}`
                : 'PROGRAMA FORMATIVO'
            }}

            ·

            CLASE
            {{ academicLessonNumberLabel }}
          </div>

          <h1>
            {{ lesson.title }}
          </h1>

          <p class="lesson-hero__description lesson-hero__description--readable">
            {{
              lesson.description ||
              'Consulta el material y completa las actividades disponibles para esta clase.'
            }}
          </p>

          <div class="lesson-hero__meta">
            <span v-if="lesson.date">
              {{ lesson.date }}
            </span>

            <span v-if="lesson.time">
              {{ lesson.time }}
            </span>

            <span v-if="lesson.duration">
              {{ lesson.duration }}
            </span>

            <span v-if="lesson.modality">
              {{ lesson.modality }}
            </span>

            <span v-if="lesson.location">
              {{ lesson.location }}
            </span>
          </div>
        </div>

        <aside class="lesson-hero__aside">
          <div
            class="lesson-number"
            :class="{
              'lesson-number--completed':
                !isTeacher &&
                lessonCompleted
            }"
          >
            <template
              v-if="
                !isTeacher &&
                lessonCompleted
              "
            >
              <span>
                COMPLETADA
              </span>

              <strong>
                ✓
              </strong>
            </template>

            <template v-else>
              <span>
                CLASE
              </span>

              <strong>
                {{ academicLessonNumberLabel }}
              </strong>
            </template>
          </div>

          <span
            class="status-badge"
            :class="`status-badge--${lesson.status || 'available'}`"
          >
            {{ getStatusLabel(lesson.status) }}
          </span>
        </aside>
      </header>

      <!-- ===================================================
           NAVEGACIÓN INTERNA · V9
      ==================================================== -->
      <nav
        class="lesson-tabs"
        aria-label="Secciones de la clase"
      >
        <a href="#ruta-clase">
          <span>01</span>
          Resumen y progreso
        </a>

        <a href="#material-principal">
          <span>02</span>
          Materiales
        </a>

        <a href="#actividades">
          <span>03</span>
          Actividades
        </a>

        <a href="#evaluaciones">
          <span>04</span>
          Evaluaciones
        </a>

        <a
          v-if="hasAcademicContent"
          href="#contenido-academico"
        >
          <span>05</span>
          Objetivos y contenidos
        </a>
      </nav>

      <!-- ===================================================
           PROGRESO DEL ALUMNO
      ==================================================== -->
      <section
        v-if="!isTeacher && currentUnit"
        class="learning-progress"
        :class="{
          'learning-progress--complete':
            unitProgress === 100
        }"
      >
        <div class="learning-progress__main">
          <div class="learning-progress__icon">
            {{
              unitProgress === 100
                ? '✓'
                : '♪'
            }}
          </div>

          <div class="learning-progress__content">
            <span>
              TU PROGRESO EN ESTA UNIDAD
            </span>

            <div class="learning-progress__heading">
              <h2>
                {{ currentUnit.title }}
              </h2>

              <strong>
                {{ unitProgress }}%
              </strong>
            </div>

            <div class="learning-progress__bar">
              <span
                :style="{
                  width: `${unitProgress}%`
                }"
              ></span>
            </div>

            <p>
              {{ unitCompletedLessons }}
              de {{ unitLessons.length }}
              {{
                unitLessons.length === 1
                  ? 'clase completada'
                  : 'clases completadas'
              }}
            </p>
          </div>
        </div>

        <div class="learning-progress__state">
          <small>
            ESTA CLASE
          </small>

          <strong>
            {{
              lessonCompleted
                ? 'Completada'
                : 'Pendiente'
            }}
          </strong>
        </div>
      </section>

      <!-- ===================================================
           QUICK INFO
      ==================================================== -->
      <section class="quick-info">
        <article>
          <span>
            Materiales
          </span>

          <strong>
            {{ lessonMaterials.length }}
          </strong>

          <small>
            recursos disponibles
          </small>
        </article>

        <article>
          <span>
            Actividades
          </span>

          <strong>
            {{ publishedAssignments.length }}
          </strong>

          <small>
            tareas publicadas
          </small>
        </article>

        <article class="quick-info__evaluation">
          <span>
            Evaluaciones
          </span>

          <strong>
            {{ visibleQuizzes.length }}
          </strong>

          <small>
            {{
              visibleQuizzes.length === 1
                ? 'quiz o prueba disponible'
                : 'quizzes y pruebas disponibles'
            }}
          </small>
        </article>

        <article>
          <span>
            Material principal
          </span>

          <strong class="quick-info__text">
            {{
              primaryMaterial
                ? 'Disponible'
                : 'Pendiente'
            }}
          </strong>

          <small>
            PDF de estudio
          </small>
        </article>

        <article>
          <span>
            {{
              isTeacher
                ? 'Estado'
                : 'Mi estado'
            }}
          </span>

          <strong class="quick-info__text">
            {{
              isTeacher
                ? getStatusLabel(lesson.status)
                : lessonCompleted
                  ? 'Completada'
                  : 'En progreso'
            }}
          </strong>

          <small>
            {{
              isTeacher
                ? 'estado académico'
                : 'progreso personal'
            }}
          </small>
        </article>
      </section>

      <!-- ===================================================
           RUTA DE APRENDIZAJE AUTOMÁTICA
      ==================================================== -->
      <section
        id="ruta-clase"
        v-if="!isTeacher"
        class="learning-path"
        :class="{
          'learning-path--complete':
            learningSummary.isComplete
        }"
      >
        <header class="learning-path__header">
          <div class="learning-path__heading">
            <div
              class="learning-path__ring"
              :style="lessonItemProgressRingStyle"
            >
              <span>
                {{ lessonItemPercentage }}%
              </span>
            </div>

            <div>
              <span>
                RUTA DE ESTA CLASE
              </span>

              <h2>
                Tu avance se guarda automáticamente
              </h2>

              <p>
                Cada material revisado, tarea entregada y evaluación completada
                queda registrada en tu cuenta.
              </p>
            </div>
          </div>

          <div class="learning-path__summary">
            <strong>
              {{ learningSummary.completed }}
              / {{ learningSummary.total }}
            </strong>

            <small>
              elementos requeridos
            </small>
          </div>
        </header>

        <div
          v-if="requiredLearningItems.length"
          class="learning-path__items"
        >
          <article
            v-for="item in requiredLearningItems"
            :key="`${item.type}-${item.id}`"
            class="learning-path-item"
            :class="`learning-path-item--${getLearningItemState(
              item.type,
              item.id
            )}`"
          >
            <div class="learning-path-item__state">
              {{
                getLearningItemStateIcon(
                  item.type,
                  item.id
                )
              }}
            </div>

            <div class="learning-path-item__copy">
              <span>
                {{ item.kind }}
              </span>

              <strong>
                {{ item.title }}
              </strong>
            </div>

            <div class="learning-path-item__status">
              {{
                getLearningItemStateLabel(
                  item.type,
                  item.id
                )
              }}
            </div>
          </article>
        </div>

        <div
          v-else
          class="learning-path__empty"
        >
          Esta clase todavía no tiene elementos requeridos.
          Puedes marcarla manualmente cuando termines de estudiarla.
        </div>

        <footer
          v-if="requiredLearningItems.length"
          class="learning-path__footer"
        >
          <span>
            {{
              learningSummary.isComplete
                ? '✓ Todos los elementos requeridos están completos.'
                : `${learningSummary.pending} elemento${learningSummary.pending === 1 ? '' : 's'} pendiente${learningSummary.pending === 1 ? '' : 's'}.`
            }}
          </span>

          <strong>
            {{
              learningSummary.isComplete
                ? 'Clase completada automáticamente'
                : nextPendingLearningItem
                  ? `Siguiente: ${nextPendingLearningItem.title}`
                  : 'Continúa con tu aprendizaje'
            }}
          </strong>
        </footer>
      </section>

      <section
        v-if="isTeacher"
        class="teacher-command"
      >
        <div class="teacher-command__copy">
          <span>CENTRO DOCENTE</span>
          <h2>Gestiona esta clase desde un solo lugar</h2>
          <p>
            Edita contenidos, revisa actividades y controla evaluaciones
            sin salir de la experiencia de la clase.
          </p>
        </div>

        <div class="teacher-command__actions">
          <RouterLink
            :to="`/aula/clase/${lesson.id}/editar`"
            class="teacher-command__button"
          >
            Editar clase
          </RouterLink>

          <RouterLink
            :to="`/aula/clase/${lesson.id}/trabajo`"
            class="teacher-command__button teacher-command__button--primary"
          >
            Contenidos y evaluaciones
          </RouterLink>
        </div>
      </section>

      <!-- ===================================================
           GRID PRINCIPAL
      ==================================================== -->
      <div class="lesson-layout">
        <!-- =================================================
             MAIN
        ================================================== -->
        <main class="lesson-main">
          <!-- ===============================================
               MATERIAL PRINCIPAL
          ================================================ -->
          <section id="material-principal" class="content-section material-section">
            <header class="section-heading">
              <div>
                <span>
                  MATERIAL DE ESTUDIO
                </span>

                <h2>
                  Material principal
                </h2>

                <p>
                  Comienza por aquí. Este es el documento
                  principal preparado para esta sesión.
                </p>
              </div>

              <span
                v-if="primaryMaterial"
                class="section-count"
              >
                PDF
              </span>
            </header>

            <article
              v-if="primaryMaterial"
              class="primary-material"
              :class="{
                'primary-material--completed':
                  !isTeacher &&
                  isMaterialCompleted(primaryMaterial)
              }"
            >
              <div class="primary-material__visual">
                <div class="pdf-icon">
                  <span>
                    PDF
                  </span>

                  <strong>
                    AMV
                  </strong>
                </div>
              </div>

              <div class="primary-material__content">
                <div class="primary-material__eyebrow">
                  DOCUMENTO PRINCIPAL

                  <span
                    v-if="!isTeacher"
                    class="learning-status"
                    :class="`learning-status--${getLearningItemState(
                      LEARNING_ITEM_TYPES.MATERIAL,
                      primaryMaterial.id
                    )}`"
                  >
                    {{
                      getLearningItemStateIcon(
                        LEARNING_ITEM_TYPES.MATERIAL,
                        primaryMaterial.id
                      )
                    }}
                    {{
                      getLearningItemStateLabel(
                        LEARNING_ITEM_TYPES.MATERIAL,
                        primaryMaterial.id
                      )
                    }}
                  </span>
                </div>

                <h3>
                  {{
                    getMaterialDisplayName(
                      primaryMaterial
                    )
                  }}
                </h3>

                <p>
                  {{
                    primaryMaterial.description ||
                    'Documento principal para estudiar y acompañar esta sesión.'
                  }}
                </p>

                <div class="primary-material__meta">
                  <span>
                    PDF
                  </span>

                  <span
                    v-if="primaryMaterial.fileSize"
                  >
                    {{
                      formatFileSize(
                        primaryMaterial.fileSize
                      )
                    }}
                  </span>

                  <span>
                    {{
                      getVoiceLabel(
                        primaryMaterial.voice
                      )
                    }}
                  </span>
                </div>

                <div class="primary-material__actions">
                  <a
                    v-if="primaryMaterial.url"
                    :href="primaryMaterial.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="material-button material-button--primary"
                    @click="
                      handleTrackedMaterialOpen(
                        primaryMaterial
                      )
                    "
                  >
                    <span>
                      ↗
                    </span>

                    Abrir PDF
                  </a>

                  <a
                    v-if="primaryMaterial.url"
                    :href="primaryMaterial.url"
                    :download="
                      primaryMaterial.fileName ||
                      undefined
                    "
                    class="material-button"
                    @click="
                      handleTrackedMaterialOpen(
                        primaryMaterial
                      )
                    "
                  >
                    ↓ Descargar
                  </a>

                  <RouterLink
                    :to="`/aula/clase/${lesson.id}/trabajo`"
                    class="material-button"
                  >
                    Ver biblioteca
                  </RouterLink>
                </div>
              </div>
            </article>

            <div
              v-else
              class="empty-material"
            >
              <div class="empty-material__icon">
                PDF
              </div>

              <div>
                <strong>
                  Material principal pendiente
                </strong>

                <p>
                  {{
                    isTeacher
                      ? 'Esta clase todavía no tiene un PDF principal. Puedes incorporarlo desde Editar clase.'
                      : 'El profesor todavía no ha publicado el documento principal de esta sesión.'
                  }}
                </p>
              </div>

              <RouterLink
                v-if="isTeacher"
                :to="`/aula/clase/${lesson.id}/editar`"
              >
                Agregar PDF
              </RouterLink>
            </div>
          </section>

          <!-- ===============================================
               RECURSOS COMPLEMENTARIOS
          ================================================ -->
          <section
            v-if="
              secondaryMaterials.length ||
              isTeacher
            "
            id="recursos"
            class="content-section"
          >
            <header class="section-heading">
              <div>
                <span>
                  BIBLIOTECA DE LA CLASE
                </span>

                <h2>
                  Recursos complementarios
                </h2>

                <p>
                  Audios, partituras, documentos y enlaces
                  que complementan el material principal.
                </p>
              </div>

              <span class="section-count">
                {{ secondaryMaterials.length }}
              </span>
            </header>

            <div
              v-if="secondaryMaterials.length"
              class="resource-list"
            >
              <a
                v-for="material in secondaryMaterials"
                :key="material.id"
                :href="material.url || undefined"
                :target="
                  material.url
                    ? '_blank'
                    : undefined
                "
                :rel="
                  material.url
                    ? 'noopener noreferrer'
                    : undefined
                "
                class="resource-item"
                :class="{
                  'resource-item--disabled':
                    !material.url,
                  'resource-item--completed':
                    !isTeacher &&
                    isMaterialCompleted(material),
                  'resource-item--viewed':
                    !isTeacher &&
                    !isMaterialCompleted(material) &&
                    isMaterialViewed(material)
                }"
                @click="
                  handleMaterialClick(
                    $event,
                    material
                  )
                "
              >
                <div class="resource-item__icon">
                  {{
                    getMaterialIcon(
                      material.type
                    )
                  }}
                </div>

                <div class="resource-item__content">
                  <span>
                    {{
                      getMaterialType(
                        material.type
                      )
                    }}
                  </span>

                  <strong>
                    {{ material.title }}
                  </strong>

                  <small>
                    {{
                      getMaterialSubtitle(
                        material
                      )
                    }}
                  </small>
                </div>

                <div class="resource-item__action">
                  <template v-if="!isTeacher && isMaterialCompleted(material)">
                    ✓ Revisado
                  </template>

                  <template v-else>
                    {{
                      material.url
                        ? 'Abrir →'
                        : 'Sin enlace'
                    }}
                  </template>
                </div>
              </a>
            </div>

            <div
              v-else
              class="section-empty"
            >
              <span>
                +
              </span>

              <div>
                <strong>
                  Sin recursos complementarios
                </strong>

                <p>
                  Puedes incorporar partituras,
                  audios, enlaces o documentos adicionales.
                </p>
              </div>
            </div>

            <RouterLink
              :to="`/aula/clase/${lesson.id}/trabajo`"
              class="view-all-link"
            >
              {{
                isTeacher
                  ? 'Administrar recursos'
                  : 'Ver todos los recursos'
              }}

              <span>
                →
              </span>
            </RouterLink>
          </section>

          <!-- ===============================================
               ACTIVIDADES
          ================================================ -->
          <section id="actividades" class="content-section">
            <header class="section-heading">
              <div>
                <span>
                  TRABAJO DE CLASE
                </span>

                <h2>
                  Actividades
                </h2>

                <p>
                  Tareas y ejercicios asociados a esta sesión.
                </p>
              </div>

              <span class="section-count">
                {{ publishedAssignments.length }}
              </span>
            </header>

            <div
              v-if="publishedAssignments.length"
              class="assignment-list"
            >
              <RouterLink
                v-for="task in publishedAssignments"
                :key="task.id"
                :to="`/aula/clase/${lesson.id}/tarea/${task.id}`"
                class="assignment-card"
                :class="{
                  'assignment-card--completed':
                    !isTeacher &&
                    isAssignmentCompleted(task),
                  'assignment-card--viewed':
                    !isTeacher &&
                    !isAssignmentCompleted(task) &&
                    isAssignmentViewed(task)
                }"
                @click="
                  handleAssignmentOpen(task)
                "
              >
                <div class="assignment-card__icon">
                  {{
                    getAssignmentIcon(
                      task.type
                    )
                  }}
                </div>

                <div class="assignment-card__content">
                  <span>
                    {{
                      getAssignmentType(
                        task.type
                      )
                    }}
                  </span>

                  <strong>
                    {{ task.title }}
                  </strong>

                  <div class="assignment-card__meta">
                    <span>
                      {{ task.points ?? 100 }}
                      pts
                    </span>

                    <span>
                      {{
                        task.dueDate
                          ? `Entrega ${formatDate(task.dueDate)}`
                          : 'Sin fecha límite'
                      }}
                    </span>
                  </div>
                </div>

                <div class="assignment-card__arrow">
                  {{
                    !isTeacher &&
                    isAssignmentCompleted(task)
                      ? '✓ Entregada'
                      : !isTeacher &&
                          isAssignmentViewed(task)
                        ? '◐ Vista'
                        : '→'
                  }}
                </div>
              </RouterLink>
            </div>

            <div
              v-else
              class="empty-assignments"
            >
              <div>
                ✓
              </div>

              <section>
                <strong>
                  No hay actividades publicadas
                </strong>

                <p>
                  {{
                    isTeacher
                      ? 'Puedes crear tareas y actividades desde Trabajo de clase.'
                      : 'Por ahora puedes concentrarte en estudiar el material de esta sesión.'
                  }}
                </p>
              </section>
            </div>

            <RouterLink
              :to="`/aula/clase/${lesson.id}/trabajo`"
              class="classwork-link"
            >
              <div>
                <span>
                  ESPACIO DE TRABAJO
                </span>

                <strong>
                  Recursos, tareas y entregas
                </strong>
              </div>

              <b>
                →
              </b>
            </RouterLink>
          </section>

          <!-- ===============================================
               EVALUACIONES
          ================================================ -->
          <section
            id="evaluaciones"
            class="content-section assessment-section"
          >
            <header class="section-heading">
              <div>
                <span>
                  EVALUACIONES
                </span>

                <h2>
                  Quiz y pruebas
                </h2>

                <p>
                  Revisa aquí las evaluaciones asociadas
                  a esta clase. No necesitas buscarlas
                  dentro de las tareas.
                </p>
              </div>

              <span class="section-count">
                {{ visibleQuizzes.length }}
              </span>
            </header>

            <div
              v-if="visibleQuizzes.length"
              class="assessment-list"
            >
              <article
                v-for="quiz in visibleQuizzes"
                :key="quiz.id"
                class="assessment-card"
                :class="{
                  'assessment-card--draft':
                    quiz.status === 'draft',
                  'assessment-card--closed':
                    quiz.status === 'closed',
                  'assessment-card--completed':
                    !isTeacher &&
                    isQuizCompleted(quiz),
                  'assessment-card--viewed':
                    !isTeacher &&
                    !isQuizCompleted(quiz) &&
                    isQuizViewed(quiz)
                }"
              >
                <div class="assessment-card__icon">
                  {{
                    quiz.assessmentType === 'test'
                      ? 'PR'
                      : 'QZ'
                  }}
                </div>

                <div class="assessment-card__content">
                  <div class="assessment-card__badges">
                    <span class="assessment-type">
                      {{ getQuizTypeLabel(quiz.assessmentType) }}
                    </span>

                    <span
                      class="assessment-status"
                      :class="`assessment-status--${quiz.status}`"
                    >
                      {{ getQuizStatusLabel(quiz.status) }}
                    </span>

                    <span
                      v-if="!isTeacher"
                      class="learning-status"
                      :class="`learning-status--${getLearningItemState(
                        LEARNING_ITEM_TYPES.QUIZ,
                        quiz.id
                      )}`"
                    >
                      {{
                        getLearningItemStateIcon(
                          LEARNING_ITEM_TYPES.QUIZ,
                          quiz.id
                        )
                      }}
                      {{
                        getLearningItemStateLabel(
                          LEARNING_ITEM_TYPES.QUIZ,
                          quiz.id
                        )
                      }}
                    </span>
                  </div>

                  <h3>
                    {{ quiz.title }}
                  </h3>

                  <p v-if="quiz.description">
                    {{ quiz.description }}
                  </p>

                  <div class="assessment-card__meta">
                    <span>
                      {{ quiz.totalPoints || 0 }} pts
                    </span>

                    <span v-if="quiz.attemptsAllowed">
                      {{
                        quiz.attemptsAllowed === 1
                          ? '1 intento'
                          : `${quiz.attemptsAllowed} intentos`
                      }}
                    </span>

                    <span v-if="quiz.timeLimitMinutes">
                      {{ quiz.timeLimitMinutes }} min
                    </span>

                    <span>
                      {{ getQuizAvailabilityLabel(quiz) }}
                    </span>
                  </div>
                </div>

                <div
                  v-if="isTeacher"
                  class="assessment-card__teacher-actions"
                >
                  <RouterLink
                    :to="
                      `/aula/clase/${lesson.id}/trabajo#evaluaciones`
                    "
                    class="
                      assessment-card__action
                      assessment-card__action--secondary
                    "
                  >
                    Gestionar
                  </RouterLink>

                  <RouterLink
                    :to="
                      `/aula/clase/${lesson.id}/evaluacion/${quiz.id}/intentos`
                    "
                    class="
                      assessment-card__action
                      assessment-card__action--review
                    "
                  >
                    Revisar intentos
                    <span>→</span>
                  </RouterLink>
                </div>

                <RouterLink
                  v-else
                  :to="
                    isQuizCompleted(quiz)
                      ? '/aula/evaluaciones'
                      : `/aula/clase/${lesson.id}/evaluacion/${quiz.id}`
                  "
                  class="assessment-card__action"
                  @click="
                    !isQuizCompleted(quiz) &&
                    handleQuizOpen(quiz)
                  "
                >
                  {{
                    isQuizCompleted(quiz)
                      ? 'Ver resultados'
                      : quiz.status === 'published'
                        ? 'Comenzar evaluación'
                        : 'Ver estado'
                  }}
                  <span>→</span>
                </RouterLink>
              </article>
            </div>

            <div
              v-else
              class="section-empty assessment-empty"
            >
              <span>
                ✓
              </span>

              <div>
                <strong>
                  No hay evaluaciones disponibles
                </strong>

                <p>
                  {{
                    isTeacher
                      ? 'Puedes crear un quiz o una prueba desde Contenidos y evaluaciones.'
                      : 'Esta clase todavía no tiene quizzes o pruebas publicadas.'
                  }}
                </p>
              </div>
            </div>

            <RouterLink
              :to="`/aula/clase/${lesson.id}/trabajo#evaluaciones`"
              class="classwork-link classwork-link--assessment"
            >
              <div>
                <span>
                  CENTRO DE EVALUACIONES
                </span>

                <strong>
                  {{
                    isTeacher
                      ? 'Crear y administrar evaluaciones'
                      : 'Ver quizzes y pruebas de la clase'
                  }}
                </strong>
              </div>

              <b>
                →
              </b>
            </RouterLink>
          </section>

          <!-- ===============================================
               FINALIZACIÓN AUTOMÁTICA
          ================================================ -->
          <section
            v-if="!isTeacher"
            class="completion-section"
            :class="{
              'completion-section--done':
                lessonCompleted
            }"
          >
            <div class="completion-section__content">
              <div
                class="completion-section__icon"
              >
                {{
                  lessonCompleted
                    ? '✓'
                    : learningSummary.total
                      ? `${lessonItemPercentage}%`
                      : '○'
                }}
              </div>

              <div>
                <span>
                  {{
                    lessonCompleted
                      ? 'CLASE COMPLETADA'
                      : learningSummary.total
                        ? 'FINALIZACIÓN AUTOMÁTICA'
                        : 'CLASE SIN REQUISITOS'
                  }}
                </span>

                <h2>
                  {{
                    lessonCompleted
                      ? 'Has completado los elementos requeridos'
                      : learningSummary.total
                        ? 'Tu clase se completará automáticamente'
                        : '¿Terminaste de estudiar esta clase?'
                  }}
                </h2>

                <p>
                  {{
                    lessonCompleted
                      ? 'Tu avance quedó guardado en tu cuenta. Puedes continuar con la siguiente sesión.'
                      : learningSummary.total
                        ? `${learningSummary.completed} de ${learningSummary.total} elementos completados. No necesitas marcar la clase manualmente.`
                        : 'Esta clase no tiene materiales, tareas ni evaluaciones requeridas. Puedes marcarla manualmente cuando termines.'
                  }}
                </p>
              </div>
            </div>

            <div class="completion-section__actions">
              <button
                v-if="learningSummary.total === 0"
                type="button"
                class="complete-button"
                :class="{
                  'complete-button--done':
                    lessonCompleted
                }"
                :disabled="isSavingProgress"
                @click="toggleProgress"
              >
                <span
                  v-if="isSavingProgress"
                  class="button-spinner"
                ></span>

                <template v-else>
                  {{
                    lessonCompleted
                      ? '✓ Completada'
                      : 'Marcar como completada'
                  }}
                </template>
              </button>

              <div
                v-else-if="!lessonCompleted"
                class="automatic-progress-badge"
              >
                <span>
                  {{ lessonItemPercentage }}%
                </span>

                <small>
                  progreso automático
                </small>
              </div>

              <RouterLink
                v-if="
                  lessonCompleted &&
                  nextLesson
                "
                :to="`/aula/clase/${nextLesson.id}`"
                class="continue-button"
              >
                Siguiente clase
                <span>→</span>
              </RouterLink>
            </div>
          </section>

          <!-- ===============================================
               INFORMACIÓN
          ================================================ -->
          <section class="content-section">
            <header class="section-heading">
              <div>
                <span>
                  INFORMACIÓN
                </span>

                <h2>
                  Sobre esta clase
                </h2>
              </div>
            </header>

            <div class="class-data">
              <article>
                <span>
                  Fecha
                </span>

                <strong>
                  {{ lesson.date || 'Por definir' }}
                </strong>
              </article>

              <article>
                <span>
                  Horario
                </span>

                <strong>
                  {{ lesson.time || 'Por definir' }}
                </strong>
              </article>

              <article>
                <span>
                  Duración
                </span>

                <strong>
                  {{ lesson.duration || 'Por definir' }}
                </strong>
              </article>

              <article>
                <span>
                  Modalidad
                </span>

                <strong>
                  {{ lesson.modality || 'Por definir' }}
                </strong>
              </article>

              <article class="class-data__wide">
                <span>
                  Lugar
                </span>

                <strong>
                  {{ lesson.location || 'Por definir' }}
                </strong>
              </article>

              <article
                v-if="currentUnit"
                class="class-data__wide"
              >
                <span>
                  Unidad formativa
                </span>

                <strong>
                  Unidad {{ currentUnit.position }}
                  · {{ currentUnit.title }}
                </strong>
              </article>
            </div>
          </section>

          <!-- ===============================================
               ACADÉMICO
          ================================================ -->
          <section
            v-if="hasAcademicContent"
            id="contenido-academico"
            class="academic-section"
          >
            <button
              type="button"
              class="academic-toggle"
              :aria-expanded="showAcademicContent"
              @click="
                showAcademicContent =
                  !showAcademicContent
              "
            >
              <div>
                <div class="academic-toggle__icon">
                  {{
                    showAcademicContent
                      ? '−'
                      : '+'
                  }}
                </div>

                <div>
                  <span>
                    CONTENIDO ADICIONAL
                  </span>

                  <strong>
                    Detalle de aprendizaje
                  </strong>

                  <small>
                    Objetivos, contenidos, práctica
                    y repertorio de la sesión.
                  </small>
                </div>
              </div>

              <span>
                {{
                  showAcademicContent
                    ? 'Ocultar'
                    : 'Ver detalle'
                }}
              </span>
            </button>

            <Transition name="academic">
              <div
                v-if="showAcademicContent"
                class="academic-content"
              >
                <article
                  v-if="lesson.focus"
                  class="academic-block academic-block--focus"
                >
                  <span>
                    FOCO PEDAGÓGICO
                  </span>

                  <h3>
                    {{ lesson.focus }}
                  </h3>
                </article>

                <article
                  v-if="objectives.length"
                  class="academic-block"
                >
                  <header>
                    <span>
                      01
                    </span>

                    <h3>
                      Objetivos
                    </h3>
                  </header>

                  <div class="academic-list">
                    <div
                      v-for="(objective, index) in objectives"
                      :key="`objective-${index}`"
                    >
                      <span>
                        {{
                          String(index + 1)
                            .padStart(2, '0')
                        }}
                      </span>

                      <p>
                        {{ objective }}
                      </p>
                    </div>
                  </div>
                </article>

                <article
                  v-if="contents.length"
                  class="academic-block"
                >
                  <header>
                    <span>
                      02
                    </span>

                    <h3>
                      Contenidos
                    </h3>
                  </header>

                  <div class="academic-tags">
                    <span
                      v-for="(content, index) in contents"
                      :key="`content-${index}`"
                    >
                      {{ content }}
                    </span>
                  </div>
                </article>

                <article
                  v-if="activities.length"
                  class="academic-block"
                >
                  <header>
                    <span>
                      03
                    </span>

                    <h3>
                      Trabajo en clase
                    </h3>
                  </header>

                  <div class="academic-list">
                    <div
                      v-for="(activity, index) in activities"
                      :key="`activity-${index}`"
                    >
                      <span>
                        ✓
                      </span>

                      <p>
                        {{ activity }}
                      </p>
                    </div>
                  </div>
                </article>

                <article
                  v-if="repertoire.length"
                  class="academic-block"
                >
                  <header>
                    <span>
                      04
                    </span>

                    <h3>
                      Repertorio
                    </h3>
                  </header>

                  <div class="repertoire-list">
                    <div
                      v-for="(song, index) in repertoire"
                      :key="`song-${index}`"
                    >
                      <span>
                        ♪
                      </span>

                      <div>
                        <small>
                          OBRA
                          {{
                            String(index + 1)
                              .padStart(2, '0')
                          }}
                        </small>

                        <strong>
                          {{ song }}
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </Transition>
          </section>

          <!-- ===============================================
               PROFESOR
          ================================================ -->
          <section
            v-if="
              isTeacher &&
              hasTeacherNotes
            "
            class="teacher-notes"
          >
            <header>
              <div>
                <span>
                  SOLO PROFESOR
                </span>

                <h2>
                  Notas docentes
                </h2>
              </div>

              <RouterLink
                :to="`/aula/clase/${lesson.id}/editar`"
              >
                Editar
              </RouterLink>
            </header>

            <div
              v-if="lesson.supportMaterials"
              class="teacher-note"
            >
              <span>
                MATERIAL DE APOYO
              </span>

              <p>
                {{ lesson.supportMaterials }}
              </p>
            </div>

            <div
              v-if="lesson.notes"
              class="teacher-note"
            >
              <span>
                OBSERVACIONES
              </span>

              <p>
                {{ lesson.notes }}
              </p>
            </div>
          </section>
        </main>

        <!-- =================================================
             SIDEBAR
        ================================================== -->
        <aside class="lesson-sidebar">
          <!-- PROGRESO PERSONAL -->
          <section
            v-if="!isTeacher && currentUnit"
            class="sidebar-card sidebar-card--progress student-progress-card"
          >
            <header class="student-progress-card__header">
              <div>
                <span class="sidebar-card__eyebrow">
                  MI PROGRESO
                </span>

                <strong>
                  Unidad {{ currentUnit.position }}
                </strong>
              </div>

              <span
                class="student-progress-card__state"
                :class="{
                  'student-progress-card__state--done':
                    unitProgress === 100
                }"
              >
                {{
                  unitProgress === 100
                    ? 'Completada'
                    : 'En curso'
                }}
              </span>
            </header>

            <div class="student-progress-card__summary">
              <div class="student-progress-card__percentage">
                <strong>
                  {{ unitProgress }}%
                </strong>

                <span>
                  completado
                </span>
              </div>

              <div class="student-progress-card__copy">
                <h3>
                  {{ currentUnit.title }}
                </h3>

                <p>
                  {{ unitCompletedLessons }}
                  de {{ unitLessons.length }}
                  {{
                    unitLessons.length === 1
                      ? 'clase completada'
                      : 'clases completadas'
                  }}
                </p>
              </div>
            </div>

            <div class="student-progress-card__track">
              <div>
                <span>Avance de la unidad</span>
                <strong>{{ unitProgress }}%</strong>
              </div>

              <div class="student-progress-card__bar">
                <span
                  :style="{
                    width: `${unitProgress}%`
                  }"
                ></span>
              </div>
            </div>

            <footer class="student-progress-card__footer">
              <div class="student-progress-card__remaining">
                <span
                  class="student-progress-card__remaining-icon"
                  :class="{
                    'student-progress-card__remaining-icon--done':
                      unitProgress === 100
                  }"
                >
                  {{
                    unitProgress === 100
                      ? '✓'
                      : '→'
                  }}
                </span>

                <p>
                  <strong>
                    {{
                      unitProgress === 100
                        ? 'Unidad terminada'
                        : `${Math.max(
                            unitLessons.length -
                            unitCompletedLessons,
                            0
                          )} ${
                            Math.max(
                              unitLessons.length -
                              unitCompletedLessons,
                              0
                            ) === 1
                              ? 'clase pendiente'
                              : 'clases pendientes'
                          }`
                    }}
                  </strong>

                  <small>
                    {{
                      unitProgress === 100
                        ? 'Tu progreso quedó guardado.'
                        : 'Continúa cuando estés listo.'
                    }}
                  </small>
                </p>
              </div>

              <RouterLink
                v-if="nextLesson"
                :to="`/aula/clase/${nextLesson.id}`"
                class="student-progress-card__continue"
              >
                Continuar
                <span>→</span>
              </RouterLink>
            </footer>
          </section>

          <!-- RESUMEN -->
          <section class="sidebar-card">
            <span class="sidebar-card__eyebrow">
              ESTA CLASE
            </span>

            <h3>
              {{ lesson.title }}
            </h3>

            <div class="sidebar-summary">
              <article>
                <span>
                  {{ lessonMaterials.length }}
                </span>

                <small>
                  Recursos
                </small>
              </article>

              <article>
                <span>
                  {{ publishedAssignments.length }}
                </span>

                <small>
                  Actividades
                </small>
              </article>

              <article>
                <span>
                  {{ visibleQuizzes.length }}
                </span>

                <small>
                  Evaluaciones
                </small>
              </article>
            </div>

            <div class="sidebar-checklist">
              <div
                v-for="item in requiredLearningItems"
                :key="`sidebar-${item.type}-${item.id}`"
              >
                <span
                  :class="{
                    'sidebar-checklist__check':
                      getLearningItemState(
                        item.type,
                        item.id
                      ) === 'completed',
                    'sidebar-checklist__viewed':
                      getLearningItemState(
                        item.type,
                        item.id
                      ) === 'viewed'
                  }"
                >
                  {{
                    getLearningItemStateIcon(
                      item.type,
                      item.id
                    )
                  }}
                </span>

                <p>
                  {{ item.title }}

                  <small>
                    {{
                      getLearningItemStateLabel(
                        item.type,
                        item.id
                      )
                    }}
                  </small>
                </p>
              </div>

              <div>
                <span
                  :class="{
                    'sidebar-checklist__check':
                      lessonCompleted
                  }"
                >
                  {{
                    lessonCompleted
                      ? '✓'
                      : '○'
                  }}
                </span>

                <p>
                  Clase completada

                  <small>
                    {{
                      lessonCompleted
                        ? 'Completada automáticamente'
                        : 'Pendiente'
                    }}
                  </small>
                </p>
              </div>
            </div>
          </section>

          <!-- ACCESOS -->
          <section class="sidebar-card">
            <span class="sidebar-card__eyebrow">
              ACCESOS RÁPIDOS
            </span>

            <nav class="sidebar-nav">
              <a
                v-if="primaryMaterial?.url"
                :href="primaryMaterial.url"
                target="_blank"
                rel="noopener noreferrer"
                @click="
                  handleTrackedMaterialOpen(
                    primaryMaterial
                  )
                "
              >
                <div>
                  <span>
                    PDF
                  </span>

                  <strong>
                    Material principal
                  </strong>
                </div>

                <b>
                  ↗
                </b>
              </a>

              <RouterLink
                :to="`/aula/clase/${lesson.id}/trabajo`"
              >
                <div>
                  <span>
                    AULA
                  </span>

                  <strong>
                    Contenidos y evaluaciones
                  </strong>
                </div>

                <b>
                  →
                </b>
              </RouterLink>

              <RouterLink
                :to="`/aula/clase/${lesson.id}/trabajo#evaluaciones`"
              >
                <div>
                  <span>
                    EVALUACIONES
                  </span>

                  <strong>
                    Quiz y pruebas
                  </strong>
                </div>

                <b>
                  →
                </b>
              </RouterLink>

              <RouterLink
                to="/aula/programa-formativo"
              >
                <div>
                  <span>
                    PROGRAMA
                  </span>

                  <strong>
                    Ver todas las unidades
                  </strong>
                </div>

                <b>
                  →
                </b>
              </RouterLink>

              <RouterLink
                v-if="isTeacher"
                :to="`/aula/clase/${lesson.id}/editar`"
              >
                <div>
                  <span>
                    PROFESOR
                  </span>

                  <strong>
                    Editar clase
                  </strong>
                </div>

                <b>
                  →
                </b>
              </RouterLink>
            </nav>
          </section>

          <!-- SIGUIENTE -->
          <section
            v-if="!isTeacher && nextLesson"
            class="next-sidebar"
          >
            <span>
              SIGUIENTE CLASE
            </span>

            <strong>
              {{ nextLesson.title }}
            </strong>

            <small v-if="nextLesson.date">
              {{ nextLesson.date }}
            </small>

            <RouterLink
              :to="`/aula/clase/${nextLesson.id}`"
            >
              Continuar
              <b>→</b>
            </RouterLink>
          </section>

          <section
            v-else-if="
              !isTeacher &&
              currentUnit &&
              unitProgress === 100
            "
            class="unit-finished-sidebar"
          >
            <div>
              ✓
            </div>

            <span>
              UNIDAD COMPLETADA
            </span>

            <strong>
              Excelente progreso
            </strong>

            <p>
              Has completado todas las clases
              disponibles de esta unidad.
            </p>
          </section>

          <section
            v-if="!isTeacher"
            class="sidebar-tip"
          >
            <span>
              ♪
            </span>

            <div>
              <strong>
                Consejo de estudio
              </strong>

              <p>
                Revisa el PDF principal, practica el
                contenido, completa las actividades y
                revisa si tienes una evaluación pendiente.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <!-- ===================================================
           NAVEGACIÓN ENTRE CLASES
      ==================================================== -->
      <nav class="lesson-navigation">
        <RouterLink
          v-if="previousLesson"
          :to="`/aula/clase/${previousLesson.id}`"
          class="lesson-navigation__item"
        >
          <span class="lesson-navigation__arrow">
            ←
          </span>

          <div>
            <small>
              CLASE ANTERIOR
            </small>

            <strong>
              {{ previousLesson.title }}
            </strong>
          </div>
        </RouterLink>

        <div
          v-else
          class="lesson-navigation__item lesson-navigation__item--disabled"
        >
          <span class="lesson-navigation__arrow">
            ←
          </span>

          <div>
            <small>
              INICIO
            </small>

            <strong>
              Primera clase de la unidad
            </strong>
          </div>
        </div>

        <RouterLink
          to="/aula/programa-formativo"
          class="lesson-navigation__program"
        >
          <span>
            PROGRAMA
          </span>

          <strong>
            Ver recorrido
          </strong>
        </RouterLink>

        <RouterLink
          v-if="nextLesson"
          :to="`/aula/clase/${nextLesson.id}`"
          class="lesson-navigation__item lesson-navigation__item--next"
        >
          <div>
            <small>
              SIGUIENTE CLASE
            </small>

            <strong>
              {{ nextLesson.title }}
            </strong>
          </div>

          <span class="lesson-navigation__arrow">
            →
          </span>
        </RouterLink>

        <div
          v-else
          class="lesson-navigation__item lesson-navigation__item--next lesson-navigation__item--disabled"
        >
          <div>
            <small>
              FINAL
            </small>

            <strong>
              Última clase de la unidad
            </strong>
          </div>

          <span class="lesson-navigation__arrow">
            ✓
          </span>
        </div>
      </nav>
    </template>

    <!-- =====================================================
         TOAST
    ====================================================== -->
    <Transition name="toast">
      <div
        v-if="toastMessage"
        class="lesson-toast"
        :class="{
          'lesson-toast--error':
            toastType === 'error'
        }"
      >
        <span>
          {{
            toastType === 'error'
              ? '!'
              : '✓'
          }}
        </span>

        <div>
          <strong>
            {{
              toastType === 'error'
                ? 'No pudimos actualizar'
                : 'Progreso actualizado'
            }}
          </strong>

          <small>
            {{ toastMessage }}
          </small>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch,
} from 'vue'

import {
  RouterLink,
  useRoute,
} from 'vue-router'

import {
  fetchLessonById,
  fetchLessons,
} from '@/services/lessonService'

import {
  getLessonAppearance,
} from '@/services/lessonAppearanceService'

import {
  fetchMaterialsByLesson,
} from '@/services/materialService'

import {
  fetchAssignmentsByLesson,
} from '@/services/assignmentService'

import {
  fetchQuizzesByLesson,
} from '@/services/quizService'

import {
  fetchUnits,
} from '@/services/unitService'

import {
  calculateUnitProgress,
  fetchProgressByStudent,
  markLessonCompleted,
  markLessonPending,
} from '@/services/lessonProgressService'

import {
  calculateLessonItemProgress,
  fetchMyLessonLearningProgress,
  isLearningItemCompleted,
  isLearningItemViewed,
  LEARNING_ITEM_TYPES,
  markLearningItemCompleted,
  markLearningItemViewed,
} from '@/services/learningProgressService'

import {
  fetchMyEvaluationAttempts,
  isFinishedAttempt,
} from '@/services/evaluationHistoryService'

import {
  useAuth,
} from '@/composables/useAuth'

import { supabase } from '@/lib/supabase'

const route = useRoute()

const {
  currentUser,
  isTeacher,
  isStudent,
} = useAuth()

/* =========================================================
   ESTADO
========================================================= */

const lesson = ref(null)

const lessonMaterials = ref([])
const lessonAssignments = ref([])
const lessonQuizzes = ref([])

const allLessons = ref([])
const units = ref([])

const studentProgress = ref([])

/*
 * Progreso granular estilo LMS:
 * material, tarea, quiz y acceso a la clase.
 */
const learningItemProgress = ref([])
const evaluationAttempts = ref([])

const isLoading = ref(true)
const isSavingProgress = ref(false)
const isSyncingLearningProgress = ref(false)

const loadError = ref('')

const showAcademicContent =
  ref(false)

const toastMessage = ref('')
const toastType = ref('success')
const lessonAppearance = ref({
  coverUrl: '',
  focalPoint: 'center',
})

const persistentCover = ref({
  coverUrl: '',
  coverPath: '',
})

const refreshLessonAppearance = () => {
  const id =
    lesson.value?.id ||
    route.params.id

  lessonAppearance.value =
    getLessonAppearance(id)
}

/*
 * Producción segura:
 * consultamos directamente cover_url / cover_path desde Supabase.
 * Esto evita depender de localStorage y también protege la vista
 * frente a servicios antiguos que no normalicen todavía esas columnas.
 */
const fetchPersistentLessonCover =
  async lessonId => {
    const id = Number(lessonId)

    if (
      !Number.isFinite(id) ||
      id <= 0
    ) {
      return {
        coverUrl: '',
        coverPath: '',
      }
    }

    const {
      data,
      error,
    } =
      await supabase
        .from('lessons')
        .select(
          'id, cover_url, cover_path',
        )
        .eq('id', id)
        .maybeSingle()

    if (error) {
      console.warn(
        'No fue posible consultar la portada persistente:',
        error,
      )

      return {
        coverUrl: '',
        coverPath: '',
      }
    }

    return {
      coverUrl:
        data?.cover_url || '',
      coverPath:
        data?.cover_path || '',
    }
  }

const lessonCoverUrl =
  computed(() =>
    persistentCover.value
      ?.coverUrl ||
    lesson.value?.coverUrl ||
    lesson.value?.cover_url ||
    lessonAppearance.value
      ?.coverUrl ||
    '',
  )

const lessonCoverPosition =
  computed(() =>
    lesson.value
      ?.coverPosition ||
    lesson.value
      ?.cover_position ||
    lessonAppearance.value
      ?.focalPoint ||
    'center',
  )

const lessonHeroStyle =
  computed(() => {
    const url =
      lessonCoverUrl.value

    if (!url) {
      return {}
    }

    return {
      '--lesson-cover-image':
        `url("${String(url).replace(/"/g, '\\\"')}")`,

      '--lesson-cover-position':
        lessonCoverPosition.value,

      backgroundImage: `
        linear-gradient(
          90deg,
          rgba(8, 17, 31, .96) 0%,
          rgba(8, 17, 31, .88) 34%,
          rgba(8, 17, 31, .62) 66%,
          rgba(8, 17, 31, .72) 100%
        ),
        url("${String(url).replace(/"/g, '\\\"')}")
      `,

      backgroundSize:
        'cover',

      backgroundPosition:
        lessonCoverPosition.value,

      backgroundRepeat:
        'no-repeat',
    }
  })

const onAppearanceChanged =
  async event => {
    if (
      Number(
        event?.detail
          ?.lessonId,
      ) !==
      Number(
        lesson.value?.id ||
        route.params.id,
      )
    ) {
      return
    }

    refreshLessonAppearance()

    persistentCover.value =
      await fetchPersistentLessonCover(
        lesson.value?.id ||
        route.params.id,
      )
  }

let toastTimer = null

/* =========================================================
   ALUMNO
========================================================= */

const studentId =
  computed(() => {
    if (
      isTeacher.value ||
      !isStudent.value
    ) {
      return null
    }

    const id =
      Number(
        currentUser.value?.id,
      )

    if (
      !Number.isFinite(id) ||
      id <= 0
    ) {
      return null
    }

    return id
  })

/* =========================================================
   CARGA
========================================================= */

const loadLesson =
  async () => {
    isLoading.value = true
    loadError.value = ''

    try {
      const id =
        Number(
          route.params.id,
        )

      if (
        !Number.isFinite(id) ||
        id <= 0
      ) {
        throw new Error(
          'La clase solicitada no es válida.',
        )
      }

      const [
        loadedLesson,
        loadedMaterials,
        loadedAssignments,
        loadedQuizzes,
        loadedLessons,
        loadedUnits,
      ] =
        await Promise.all([
          fetchLessonById(id),

          fetchMaterialsByLesson(
            id,
          ),

          fetchAssignmentsByLesson(
            id,
          ),

          fetchQuizzesByLesson(
            id,
          ),

          fetchLessons(),

          fetchUnits(),
        ])

      lesson.value =
        loadedLesson

      refreshLessonAppearance()

      persistentCover.value =
        await fetchPersistentLessonCover(
          id,
        )

      /*
       * También dejamos la URL dentro del objeto lesson para que
       * cualquier parte de esta vista pueda reutilizarla.
       */
      if (
        persistentCover.value
          ?.coverUrl
      ) {
        lesson.value = {
          ...lesson.value,
          coverUrl:
            persistentCover.value
              .coverUrl,
          cover_url:
            persistentCover.value
              .coverUrl,
          coverPath:
            persistentCover.value
              .coverPath,
          cover_path:
            persistentCover.value
              .coverPath,
        }
      }

      lessonMaterials.value =
        loadedMaterials || []

      lessonAssignments.value =
        loadedAssignments || []

      lessonQuizzes.value =
        loadedQuizzes || []

      allLessons.value =
        loadedLessons || []

      units.value =
        loadedUnits || []

      if (
        !isTeacher.value &&
        studentId.value
      ) {
        /*
         * Cargamos progreso general, progreso por item
         * e historial real de evaluaciones.
         */
        const [
          loadedStudentProgress,
          loadedLearningProgress,
          loadedEvaluationAttempts,
        ] =
          await Promise.all([
            fetchProgressByStudent(
              studentId.value,
            ),

            fetchMyLessonLearningProgress(
              id,
            ),

            fetchMyEvaluationAttempts(),
          ])

        studentProgress.value =
          loadedStudentProgress || []

        learningItemProgress.value =
          loadedLearningProgress || []

        evaluationAttempts.value =
          loadedEvaluationAttempts || []

        /*
         * Registrar que el alumno efectivamente entró
         * a esta clase.
         */
        await markLearningItemViewed({
          lessonId: id,
          itemType:
            LEARNING_ITEM_TYPES.LESSON,
          itemId: id,
        })

        /*
         * Si el alumno ya entregó un quiz anteriormente,
         * sincronizamos ese dato histórico con el nuevo
         * seguimiento granular.
         */
        await syncCompletedEvaluations()

        await refreshLearningProgress()

        /*
         * Finalmente sincronizamos la clase completa.
         */
        await syncAutomaticLessonCompletion()
      } else {
        studentProgress.value = []
        learningItemProgress.value = []
        evaluationAttempts.value = []
      }
    } catch (error) {
      console.error(
        'Error cargando la clase:',
        error,
      )

      lesson.value = null

      lessonMaterials.value = []
      lessonAssignments.value = []
      lessonQuizzes.value = []

      allLessons.value = []
      units.value = []

      studentProgress.value = []
      learningItemProgress.value = []
      evaluationAttempts.value = []

      loadError.value =
        error?.message ||
        'No fue posible obtener esta clase.'
    } finally {
      isLoading.value = false
    }
  }

/* =========================================================
   UNIDAD ACTUAL
========================================================= */

const currentUnit =
  computed(() => {
    const unitId =
      Number(
        lesson.value?.unitId,
      )

    if (
      !unitId
    ) {
      return null
    }

    return (
      units.value.find(
        unit =>
          Number(unit.id) ===
          unitId,
      ) ||
      null
    )
  })

/* =========================================================
   CLASES DE LA UNIDAD
========================================================= */

const unitLessons =
  computed(() => {
    if (
      !currentUnit.value
    ) {
      return []
    }

    return allLessons.value
      .filter(
        item =>
          Number(
            item.unitId,
          ) ===
          Number(
            currentUnit.value.id,
          ),
      )
      .sort(
        (
          a,
          b,
        ) =>
          Number(a.id) -
          Number(b.id),
      )
  })

const currentLessonIndex =
  computed(() => {
    return unitLessons.value
      .findIndex(
        item =>
          Number(item.id) ===
          Number(
            lesson.value?.id,
          ),
      )
  })

const lessonPositionInUnit =
  computed(() => {
    if (
      currentLessonIndex.value <
      0
    ) {
      return 1
    }

    return (
      currentLessonIndex.value +
      1
    )
  })

const academicLessonNumberLabel =
  computed(() =>
    String(
      lessonPositionInUnit.value,
    ).padStart(2, '0'),
  )

const previousLesson =
  computed(() => {
    if (
      currentLessonIndex.value <=
      0
    ) {
      return null
    }

    return (
      unitLessons.value[
        currentLessonIndex.value -
        1
      ] ||
      null
    )
  })

const nextLesson =
  computed(() => {
    const index =
      currentLessonIndex.value

    if (
      index < 0 ||
      index >=
        unitLessons.value.length -
          1
    ) {
      return null
    }

    return (
      unitLessons.value[
        index + 1
      ] ||
      null
    )
  })

/* =========================================================
   PROGRESO GRANULAR · ESTILO LMS
========================================================= */

/*
 * Solo ciertos elementos bloquean la finalización de la clase.
 *
 * - Material principal: requerido.
 * - Tareas publicadas: requeridas.
 * - Quiz/pruebas publicadas: requeridos.
 * - Recursos complementarios: se registran, pero son opcionales.
 */
const requiredLearningItems =
  computed(() => {
    const items = []

    if (
      primaryMaterial.value?.id
    ) {
      items.push({
        type:
          LEARNING_ITEM_TYPES.MATERIAL,

        id:
          Number(
            primaryMaterial.value.id,
          ),

        title:
          getMaterialDisplayName(
            primaryMaterial.value,
          ),

        kind:
          'Material principal',

        href:
          primaryMaterial.value.url ||
          null,
      })
    }

    for (
      const task of
      publishedAssignments.value
    ) {
      if (!task?.id) {
        continue
      }

      items.push({
        type:
          LEARNING_ITEM_TYPES.ASSIGNMENT,

        id:
          Number(task.id),

        title:
          task.title ||
          'Actividad',

        kind:
          getAssignmentType(
            task.type,
          ),

        href:
          `/aula/clase/${lesson.value?.id}/tarea/${task.id}`,
      })
    }

    for (
      const quiz of
      visibleQuizzes.value
    ) {
      if (!quiz?.id) {
        continue
      }

      items.push({
        type:
          LEARNING_ITEM_TYPES.QUIZ,

        id:
          Number(quiz.id),

        title:
          quiz.title ||
          'Evaluación',

        kind:
          getQuizTypeLabel(
            quiz.assessmentType,
          ),

        href:
          `/aula/clase/${lesson.value?.id}/evaluacion/${quiz.id}`,
      })
    }

    return items
  })

const learningSummary =
  computed(() =>
    calculateLessonItemProgress({
      progress:
        learningItemProgress.value,

      /*
       * Los materiales complementarios se registran,
       * pero no bloquean la finalización automática.
       */
      materials:
        primaryMaterial.value
          ? [primaryMaterial.value]
          : [],

      assignments:
        publishedAssignments.value,

      quizzes:
        visibleQuizzes.value,
    }),
  )

const lessonItemPercentage =
  computed(() =>
    learningSummary.value
      .percentage,
  )

const lessonItemProgressRingStyle =
  computed(() => ({
    background:
      `conic-gradient(
        #ffc400 ${lessonItemPercentage.value}%,
        rgba(255,255,255,.08) 0
      )`,
  }))

const getLearningItem =
  (
    itemType,
    itemId,
  ) =>
    learningItemProgress.value
      .find(
        item =>
          item.itemType ===
            itemType &&
          Number(item.itemId) ===
            Number(itemId),
      ) ||
    null

const getLearningItemState =
  (
    itemType,
    itemId,
  ) => {
    const item =
      getLearningItem(
        itemType,
        itemId,
      )

    if (
      item?.status ===
      'completed'
    ) {
      return 'completed'
    }

    if (item) {
      return 'viewed'
    }

    return 'pending'
  }

const getLearningItemStateLabel =
  (
    itemType,
    itemId,
  ) => {
    const state =
      getLearningItemState(
        itemType,
        itemId,
      )

    if (
      state === 'completed'
    ) {
      return 'Completado'
    }

    if (
      state === 'viewed'
    ) {
      return 'Visto'
    }

    return 'Pendiente'
  }

const getLearningItemStateIcon =
  (
    itemType,
    itemId,
  ) => {
    const state =
      getLearningItemState(
        itemType,
        itemId,
      )

    if (
      state === 'completed'
    ) {
      return '✓'
    }

    if (
      state === 'viewed'
    ) {
      return '◐'
    }

    return '○'
  }

const isMaterialCompleted =
  material =>
    isLearningItemCompleted(
      learningItemProgress.value,
      LEARNING_ITEM_TYPES.MATERIAL,
      material?.id,
    )

const isMaterialViewed =
  material =>
    isLearningItemViewed(
      learningItemProgress.value,
      LEARNING_ITEM_TYPES.MATERIAL,
      material?.id,
    )

const isAssignmentCompleted =
  assignment =>
    isLearningItemCompleted(
      learningItemProgress.value,
      LEARNING_ITEM_TYPES.ASSIGNMENT,
      assignment?.id,
    )

const isAssignmentViewed =
  assignment =>
    isLearningItemViewed(
      learningItemProgress.value,
      LEARNING_ITEM_TYPES.ASSIGNMENT,
      assignment?.id,
    )

const isQuizCompleted =
  quiz =>
    isLearningItemCompleted(
      learningItemProgress.value,
      LEARNING_ITEM_TYPES.QUIZ,
      quiz?.id,
    )

const isQuizViewed =
  quiz =>
    isLearningItemViewed(
      learningItemProgress.value,
      LEARNING_ITEM_TYPES.QUIZ,
      quiz?.id,
    )

const lessonCompleted =
  computed(() => {
    if (
      isTeacher.value
    ) {
      return (
        lesson.value?.status ===
        'completed'
      )
    }

    /*
     * Cuando existen elementos requeridos, la clase se
     * considera completa por evidencia real de actividad.
     */
    if (
      learningSummary.value.total >
      0
    ) {
      return (
        learningSummary.value
          .isComplete
      )
    }

    /*
     * Compatibilidad con clases antiguas sin items.
     */
    return studentProgress.value
      .some(
        row =>
          Number(
            row.lessonId,
          ) ===
            Number(
              lesson.value?.id,
            ) &&
          row.completed,
      )
  })

const unitProgressData =
  computed(() => {
    if (
      isTeacher.value
    ) {
      const total =
        unitLessons.value.length

      const completed =
        unitLessons.value.filter(
          item =>
            item.status ===
            'completed',
        ).length

      return {
        totalLessons:
          total,

        completedLessons:
          completed,

        percentage:
          total
            ? Math.round(
                (
                  completed /
                  total
                ) *
                  100,
              )
            : 0,
      }
    }

    return calculateUnitProgress({
      lessons:
        unitLessons.value,

      progressRows:
        studentProgress.value,
    })
  })

const unitProgress =
  computed(() =>
    unitProgressData.value
      .percentage,
  )

const unitCompletedLessons =
  computed(() =>
    unitProgressData.value
      .completedLessons,
  )

const unitProgressRingStyle =
  computed(() => ({
    background:
      `conic-gradient(
        #ffc400 ${unitProgress.value}%,
        rgba(255,255,255,.08) 0
      )`,
  }))

const nextPendingLearningItem =
  computed(() =>
    requiredLearningItems.value
      .find(
        item =>
          !isLearningItemCompleted(
            learningItemProgress.value,
            item.type,
            item.id,
          ),
      ) ||
    null,
  )

/* =========================================================
   SINCRONIZACIÓN DE PROGRESO
========================================================= */

const refreshLearningProgress =
  async () => {
    if (
      isTeacher.value ||
      !lesson.value?.id
    ) {
      learningItemProgress.value =
        []

      return
    }

    learningItemProgress.value =
      await fetchMyLessonLearningProgress(
        lesson.value.id,
      )
  }

const refreshLegacyProgress =
  async () => {
    if (
      !studentId.value
    ) {
      return
    }

    studentProgress.value =
      await fetchProgressByStudent(
        studentId.value,
      )
  }

/*
 * Los quiz ya entregados son una fuente de verdad.
 * Esto permite migrar intentos realizados antes de
 * crear learning_item_progress.
 */
const syncCompletedEvaluations =
  async () => {
    if (
      isTeacher.value ||
      !lesson.value?.id
    ) {
      return
    }

    const completedQuizIds =
      new Set(
        evaluationAttempts.value
          .filter(
            attempt =>
              Number(
                attempt.lessonId,
              ) ===
                Number(
                  lesson.value.id,
                ) &&
              isFinishedAttempt(
                attempt,
              ),
          )
          .map(
            attempt =>
              Number(
                attempt.quizId,
              ),
          )
          .filter(
            Number.isFinite,
          ),
      )

    for (
      const quiz of
      visibleQuizzes.value
    ) {
      if (
        completedQuizIds.has(
          Number(quiz.id),
        ) &&
        !isQuizCompleted(quiz)
      ) {
        await markLearningItemCompleted({
          lessonId:
            lesson.value.id,

          itemType:
            LEARNING_ITEM_TYPES.QUIZ,

          itemId:
            quiz.id,
        })
      }
    }
  }

/*
 * Mantiene lesson_progress sincronizado con la nueva
 * evidencia granular, para que Programa y Unidad sigan
 * mostrando el progreso correcto.
 */
const syncAutomaticLessonCompletion =
  async () => {
    if (
      isTeacher.value ||
      !studentId.value ||
      !lesson.value?.id ||
      isSyncingLearningProgress.value
    ) {
      return
    }

    if (
      learningSummary.value.total <=
      0
    ) {
      return
    }

    isSyncingLearningProgress.value =
      true

    try {
      const legacyCompleted =
        studentProgress.value
          .some(
            row =>
              Number(
                row.lessonId,
              ) ===
                Number(
                  lesson.value.id,
                ) &&
              row.completed,
          )

      if (
        learningSummary.value
          .isComplete &&
        !legacyCompleted
      ) {
        await markLessonCompleted({
          studentId:
            studentId.value,

          lessonId:
            lesson.value.id,
        })

        await markLearningItemCompleted({
          lessonId:
            lesson.value.id,

          itemType:
            LEARNING_ITEM_TYPES.LESSON,

          itemId:
            lesson.value.id,
        })

        await refreshLegacyProgress()

        showToast(
          nextLesson.value
            ? '¡Clase completada automáticamente! Ya puedes continuar.'
            : '¡Clase completada automáticamente! Terminaste los elementos requeridos.',
        )
      }

      if (
        !learningSummary.value
          .isComplete &&
        legacyCompleted
      ) {
        /*
         * Si el profesor publica un nuevo elemento requerido,
         * la clase vuelve correctamente a "en progreso".
         */
        await markLessonPending({
          studentId:
            studentId.value,

          lessonId:
            lesson.value.id,
        })

        await refreshLegacyProgress()
      }
    } catch (error) {
      console.error(
        'Error sincronizando finalización automática:',
        error,
      )
    } finally {
      isSyncingLearningProgress.value =
        false
    }
  }

/* =========================================================
   REGISTRAR INTERACCIONES
========================================================= */

const recordItemViewed =
  async (
    itemType,
    itemId,
    {
      silent = true,
    } = {},
  ) => {
    if (
      isTeacher.value ||
      !lesson.value?.id ||
      !itemId
    ) {
      return
    }

    try {
      await markLearningItemViewed({
        lessonId:
          lesson.value.id,

        itemType,

        itemId,
      })

      await refreshLearningProgress()

      if (!silent) {
        showToast(
          'Elemento registrado como visto.',
        )
      }
    } catch (error) {
      console.error(
        'Error registrando elemento visto:',
        error,
      )

      if (!silent) {
        showToast(
          error?.message ||
          'No fue posible registrar el avance.',
          'error',
        )
      }
    }
  }

const recordItemCompleted =
  async (
    itemType,
    itemId,
    {
      silent = false,
    } = {},
  ) => {
    if (
      isTeacher.value ||
      !lesson.value?.id ||
      !itemId
    ) {
      return
    }

    try {
      await markLearningItemCompleted({
        lessonId:
          lesson.value.id,

        itemType,

        itemId,
      })

      await refreshLearningProgress()

      await syncAutomaticLessonCompletion()

      if (!silent) {
        showToast(
          'Elemento completado y guardado en tu progreso.',
        )
      }
    } catch (error) {
      console.error(
        'Error completando elemento:',
        error,
      )

      if (!silent) {
        showToast(
          error?.message ||
          'No fue posible registrar el avance.',
          'error',
        )
      }
    }
  }

/*
 * Abrir/descargar un material se considera una revisión
 * consciente del recurso. Los recursos complementarios
 * quedan registrados, pero no bloquean la clase.
 */
const handleTrackedMaterialOpen =
  async material => {
    if (
      !material?.id
    ) {
      return
    }

    await recordItemCompleted(
      LEARNING_ITEM_TYPES.MATERIAL,
      material.id,
      {
        silent: true,
      },
    )
  }

const handleAssignmentOpen =
  task => {
    if (!task?.id) {
      return
    }

    /*
     * Abrir una tarea = visto.
     * La entrega real deberá marcarla como completed
     * desde el flujo de entregas.
     */
    recordItemViewed(
      LEARNING_ITEM_TYPES.ASSIGNMENT,
      task.id,
    )
  }

const handleQuizOpen =
  quiz => {
    if (!quiz?.id) {
      return
    }

    /*
     * Entrar al quiz = visto.
     * Un intento submitted/graded = completed.
     */
    recordItemViewed(
      LEARNING_ITEM_TYPES.QUIZ,
      quiz.id,
    )
  }

/*
 * Respaldo manual SOLO para clases antiguas que no tienen
 * ningún elemento requerido. En las clases modernas el
 * progreso se calcula automáticamente.
 */
const toggleProgress =
  async () => {
    if (
      learningSummary.value.total >
      0
    ) {
      return
    }

    if (
      isTeacher.value ||
      !studentId.value ||
      !lesson.value ||
      isSavingProgress.value
    ) {
      return
    }

    isSavingProgress.value =
      true

    try {
      if (
        lessonCompleted.value
      ) {
        await markLessonPending({
          studentId:
            studentId.value,

          lessonId:
            lesson.value.id,
        })

        showToast(
          'La clase volvió a quedar pendiente.',
        )
      } else {
        await markLessonCompleted({
          studentId:
            studentId.value,

          lessonId:
            lesson.value.id,
        })

        showToast(
          'Clase completada.',
        )
      }

      await refreshLegacyProgress()
    } catch (error) {
      console.error(
        'Error actualizando progreso:',
        error,
      )

      showToast(
        error?.message ||
        'No fue posible actualizar tu progreso.',
        'error',
      )
    } finally {
      isSavingProgress.value =
        false
    }
  }

/* =========================================================
   PLANIFICACIÓN
========================================================= */

const normalizeArray =
  value => {
    if (
      !Array.isArray(value)
    ) {
      return []
    }

    return value
      .map(item =>
        String(item).trim(),
      )
      .filter(Boolean)
  }

const objectives =
  computed(() =>
    normalizeArray(
      lesson.value?.objectives,
    ),
  )

const contents =
  computed(() =>
    normalizeArray(
      lesson.value?.contents,
    ),
  )

const activities =
  computed(() =>
    normalizeArray(
      lesson.value?.activities,
    ),
  )

const repertoire =
  computed(() =>
    normalizeArray(
      lesson.value?.repertoire,
    ),
  )

const hasAcademicContent =
  computed(() => {
    return Boolean(
      lesson.value?.focus ||
      objectives.value.length ||
      contents.value.length ||
      activities.value.length ||
      repertoire.value.length,
    )
  })

const hasTeacherNotes =
  computed(() => {
    return Boolean(
      lesson.value
        ?.supportMaterials ||
      lesson.value
        ?.support_materials ||
      lesson.value?.notes,
    )
  })

/* =========================================================
   MATERIAL PRINCIPAL
========================================================= */

const primaryMaterial =
  computed(() => {
    const materials =
      lessonMaterials.value

    if (
      !materials.length
    ) {
      return null
    }

    const explicitPrimary =
      materials.find(
        material =>
          String(
            material.storagePath ||
            '',
          ).includes(
            '/material-principal/',
          ),
      )

    if (
      explicitPrimary
    ) {
      return explicitPrimary
    }

    const titledPrimary =
      materials.find(
        material =>
          String(
            material.title ||
            '',
          )
            .toLowerCase()
            .includes(
              'material principal',
            ),
      )

    if (
      titledPrimary
    ) {
      return titledPrimary
    }

    return (
      materials.find(
        material =>
          material.type ===
            'pdf' ||
          material.mimeType ===
            'application/pdf',
      ) ||
      null
    )
  })

const secondaryMaterials =
  computed(() => {
    if (
      !primaryMaterial.value
    ) {
      return lessonMaterials.value
    }

    return lessonMaterials.value
      .filter(
        material =>
          Number(material.id) !==
          Number(
            primaryMaterial.value.id,
          ),
      )
  })

/* =========================================================
   TAREAS
========================================================= */

const publishedAssignments =
  computed(() =>
    lessonAssignments.value
      .filter(
        assignment =>
          assignment.status !==
          'draft',
      ),
  )

/* =========================================================
   EVALUACIONES
========================================================= */

const visibleQuizzes =
  computed(() => {
    if (isTeacher.value) {
      return lessonQuizzes.value
    }

    return lessonQuizzes.value
      .filter(
        quiz =>
          quiz.status ===
          'published',
      )
  })

const quizTypeLabels = {
  quiz: 'Quiz formativo',
  test: 'Prueba evaluada',
}

const quizStatusLabels = {
  draft: 'Borrador',
  published: 'Disponible',
  closed: 'Cerrada',
}

const getQuizTypeLabel =
  type =>
    quizTypeLabels[type] ||
    'Evaluación'

const getQuizStatusLabel =
  status =>
    quizStatusLabels[status] ||
    'Evaluación'

const formatDateTime =
  value => {
    if (!value) {
      return ''
    }

    const date =
      new Date(value)

    if (
      Number.isNaN(
        date.getTime(),
      )
    ) {
      return ''
    }

    return new Intl.DateTimeFormat(
      'es-CL',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    ).format(date)
  }

const getQuizAvailabilityLabel =
  quiz => {
    if (
      quiz.status === 'draft'
    ) {
      return 'Solo profesor'
    }

    if (
      quiz.status === 'closed'
    ) {
      return 'Evaluación cerrada'
    }

    const now =
      new Date()

    if (quiz.opensAt) {
      const opens =
        new Date(
          quiz.opensAt,
        )

      if (
        !Number.isNaN(
          opens.getTime(),
        ) &&
        opens > now
      ) {
        return `Abre ${formatDateTime(quiz.opensAt)}`
      }
    }

    if (quiz.closesAt) {
      const closes =
        new Date(
          quiz.closesAt,
        )

      if (
        !Number.isNaN(
          closes.getTime(),
        ) &&
        closes < now
      ) {
        return 'Plazo finalizado'
      }

      return `Cierra ${formatDateTime(quiz.closesAt)}`
    }

    return 'Disponible ahora'
  }

/* =========================================================
   LABELS
========================================================= */

const getStatusLabel =
  status => {
    const labels = {
      available:
        'Disponible',

      planned:
        'Planificada',

      published:
        'Publicada',

      completed:
        'Realizada',

      draft:
        'Borrador',
    }

    return (
      labels[status] ||
      'Disponible'
    )
  }

const getMaterialType =
  type => {
    const labels = {
      pdf:
        'PDF',

      score:
        'Partitura',

      audio:
        'Audio',

      video:
        'Video',

      image:
        'Imagen',

      link:
        'Enlace',

      document:
        'Documento',

      file:
        'Archivo',

      other:
        'Archivo',
    }

    return (
      labels[type] ||
      'Material'
    )
  }

const getMaterialIcon =
  type => {
    const icons = {
      pdf:
        'PDF',

      score:
        '♫',

      audio:
        '♪',

      video:
        '▶',

      image:
        'IMG',

      link:
        '↗',

      document:
        'DOC',

      file:
        'FILE',

      other:
        '•',
    }

    return (
      icons[type] ||
      '•'
    )
  }

const getVoiceLabel =
  voice => {
    if (
      !voice ||
      voice === 'general'
    ) {
      return 'General'
    }

    return voice
  }

const getMaterialDisplayName =
  material => {
    if (!material) {
      return ''
    }

    return (
      material.fileName ||
      material.title ||
      'Material de la clase'
    )
  }

const getMaterialSubtitle =
  material => {
    const parts = []

    if (
      material.voice &&
      material.voice !==
        'general'
    ) {
      parts.push(
        getVoiceLabel(
          material.voice,
        ),
      )
    }

    if (
      material.fileSize
    ) {
      parts.push(
        formatFileSize(
          material.fileSize,
        ),
      )
    }

    if (
      material.description
    ) {
      parts.push(
        material.description,
      )
    }

    return (
      parts.join(' · ') ||
      'Recurso de la clase'
    )
  }

/* =========================================================
   TAREAS
========================================================= */

const getAssignmentType =
  type => {
    const labels = {
      assignment:
        'Tarea',

      performance:
        'Interpretación',

      audio:
        'Entrega de audio',

      video:
        'Entrega de video',

      score:
        'Partitura',
    }

    return (
      labels[type] ||
      'Actividad'
    )
  }

const getAssignmentIcon =
  type => {
    const icons = {
      assignment:
        '✓',

      performance:
        '★',

      audio:
        '♪',

      video:
        '▶',

      score:
        '♫',
    }

    return (
      icons[type] ||
      '✓'
    )
  }

/* =========================================================
   FORMATOS
========================================================= */

const formatDate =
  value => {
    if (!value) {
      return '—'
    }

    const parts =
      String(value)
        .split('-')

    if (
      parts.length === 3
    ) {
      const [
        year,
        month,
        day,
      ] = parts

      return `${day}/${month}/${year}`
    }

    return value
  }

const formatFileSize =
  bytes => {
    const value =
      Number(bytes || 0)

    if (!value) {
      return ''
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
      (
        1024 *
        1024
      )
    ).toFixed(1)} MB`
  }

/* =========================================================
   MATERIAL SIN URL
========================================================= */

const handleMaterialClick = (
  event,
  material,
) => {
  if (
    !material?.url
  ) {
    event.preventDefault()
    return
  }

  /*
   * El enlace puede abrir inmediatamente.
   * El progreso se registra en paralelo.
   */
  handleTrackedMaterialOpen(
    material,
  )
}

/* =========================================================
   TOAST
========================================================= */

const showToast = (
  message,
  type = 'success',
) => {
  clearTimeout(
    toastTimer,
  )

  toastMessage.value =
    message

  toastType.value =
    type

  toastTimer =
    setTimeout(() => {
      toastMessage.value =
        ''
    }, 3500)
}

/* =========================================================
   ROUTE
========================================================= */

watch(
  () =>
    route.params.id,

  () => {
    showAcademicContent.value =
      false
    refreshLessonAppearance()
    loadLesson()
  },
)

onMounted(() => {
  refreshLessonAppearance()
  window.addEventListener('amv:lesson-appearance', onAppearanceChanged)
  loadLesson()
})

onUnmounted(() => {
  window.removeEventListener('amv:lesson-appearance', onAppearanceChanged)
  clearTimeout(
    toastTimer,
  )
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.lesson-page {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-bottom: 5rem;
}

/* =========================================================
   TOPBAR
========================================================= */

.lesson-topbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.back-link {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color: variables.$color-primary;
  font-size: 0.75rem;
  font-weight: 800;
  text-decoration: none;
}

.back-link span {
  transition:
    transform 0.18s ease;
}

.back-link:hover span {
  transform:
    translateX(-3px);
}

.teacher-actions {
  display: flex;
  gap: 0.5rem;
}

.teacher-button {
  display: inline-flex;
  min-height: 40px;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  padding:
    0.62rem
    0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  color:
    variables.$color-white;
  font-size: 0.66rem;
  font-weight: 800;
  text-decoration: none;
}

.teacher-button--primary {
  border-color:
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #080808;
}

.student-topbar-status {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  color:
    rgba(255, 255, 255, 0.42);
  font-size: 0.62rem;
  font-weight: 700;
}

.student-topbar-status__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background:
    rgba(255, 255, 255, 0.25);
}

.student-topbar-status__dot--complete {
  background:
    variables.$color-primary;
  box-shadow:
    0 0 0 5px
    rgba(255, 196, 0, 0.07);
}

/* =========================================================
   UNIT BREADCRUMB
========================================================= */

.unit-breadcrumb {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.8rem;
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  background:
    variables.$color-surface;
}

.unit-breadcrumb > span:first-child {
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.unit-breadcrumb strong {
  font-size: 0.65rem;
}

.unit-breadcrumb > span:nth-child(3) {
  color:
    rgba(255, 255, 255, 0.2);
}

.unit-breadcrumb small {
  color:
    rgba(255, 255, 255, 0.33);
  font-size: 0.57rem;
}

/* =========================================================
   HERO
========================================================= */

.lesson-hero {
  position: relative;
  display: grid;
  gap: 2.5rem;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  align-items: center;
  margin-bottom: 0.8rem;
  padding: 2.6rem;
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 92% 10%,
      rgba(255, 196, 0, 0.14),
      transparent 32%
    ),
    variables.$color-surface;
  transition:
    border-color 0.25s ease;
}

.lesson-hero::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 115px;
  height: 3px;
  background:
    variables.$color-primary;
  content: '';
}

.lesson-hero--completed {
  border-color:
    rgba(255, 196, 0, 0.38);
}

.lesson-hero__eyebrow {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.lesson-hero__eyebrow > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background:
    variables.$color-primary;
  box-shadow:
    0 0 0 5px
    rgba(255, 196, 0, 0.08);
}

.lesson-hero h1 {
  max-width: 920px;
  margin:
    0.9rem
    0
    0;
  font-size:
    clamp(
      2.8rem,
      7vw,
      5.5rem
    );
  line-height: 0.94;
  letter-spacing: -0.045em;
}

.lesson-hero__description {
  max-width: 730px;
  margin:
    1.2rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.52);
  line-height: 1.7;
}

.lesson-hero__meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 1.25rem;
}

.lesson-hero__meta span {
  padding:
    0.35rem
    0.55rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.42);
  font-size: 0.59rem;
}

.lesson-hero__aside {
  display: grid;
  gap: 0.7rem;
  justify-items: center;
}

.lesson-number {
  display: grid;
  width: 122px;
  height: 122px;
  place-items: center;
  align-content: center;
  border:
    1px solid
    rgba(255, 196, 0, 0.5);
  border-radius: 50%;
  transition:
    background 0.2s ease,
    color 0.2s ease;
}

.lesson-number span,
.lesson-number strong {
  display: block;
}

.lesson-number span {
  color:
    variables.$color-primary;
  font-size: 0.54rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.lesson-number strong {
  color:
    variables.$color-primary;
  font-size: 2.7rem;
  line-height: 1;
}

.lesson-number--completed {
  background:
    variables.$color-primary;
}

.lesson-number--completed span,
.lesson-number--completed strong {
  color: #080808;
}

.status-badge {
  padding:
    0.35rem
    0.6rem;
  border-radius: 999px;
  font-size: 0.58rem;
  font-weight: 800;
}

.status-badge--available,
.status-badge--published {
  border:
    1px solid
    rgba(255, 196, 0, 0.35);
  color:
    variables.$color-primary;
}

.status-badge--planned,
.status-badge--draft {
  border:
    1px solid
    variables.$color-border;
  color:
    rgba(255, 255, 255, 0.38);
}

.status-badge--completed {
  background:
    variables.$color-primary;
  color: #080808;
}

/* =========================================================
   LEARNING PROGRESS
========================================================= */

.learning-progress {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  align-items: center;
  margin-bottom: 0.8rem;
  padding: 1.15rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.23);
  border-radius: 16px;
  background:
    linear-gradient(
      100deg,
      rgba(255, 196, 0, 0.04),
      transparent
    ),
    variables.$color-surface;
}

.learning-progress--complete {
  border-color:
    rgba(255, 196, 0, 0.42);
}

.learning-progress__main {
  display: flex;
  gap: 0.9rem;
  align-items: center;
}

.learning-progress__icon {
  display: grid;
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.learning-progress__content {
  width: 100%;
}

.learning-progress__content > span {
  color:
    variables.$color-primary;
  font-size: 0.53rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.learning-progress__heading {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.15rem;
}

.learning-progress__heading h2 {
  margin: 0;
  font-size: 0.9rem;
}

.learning-progress__heading strong {
  color:
    variables.$color-primary;
  font-size: 1rem;
}

.learning-progress__bar {
  width: 100%;
  height: 5px;
  margin-top: 0.55rem;
  overflow: hidden;
  border-radius: 999px;
  background:
    rgba(255, 255, 255, 0.07);
}

.learning-progress__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      variables.$color-primary,
      #ffe379
    );
  transition:
    width 0.35s ease;
}

.learning-progress__content p {
  margin:
    0.35rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.32);
  font-size: 0.58rem;
}

.learning-progress__state {
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  text-align: right;
}

.learning-progress__state small,
.learning-progress__state strong {
  display: block;
}

.learning-progress__state small {
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.51rem;
}

.learning-progress__state strong {
  margin-top: 0.15rem;
  color:
    variables.$color-primary;
  font-size: 0.65rem;
}

/* =========================================================
   QUICK INFO
========================================================= */

.quick-info {
  display: grid;
  gap: 0.65rem;
  grid-template-columns:
    repeat(
      auto-fit,
      minmax(170px, 1fr)
    );
  margin-bottom: 0.8rem;
}

.quick-info article {
  padding: 0.9rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 12px;
  background:
    variables.$color-surface;
}

.quick-info span,
.quick-info strong,
.quick-info small {
  display: block;
}

.quick-info span {
  margin-bottom: 0.3rem;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.56rem;
  text-transform: uppercase;
}

.quick-info strong {
  color:
    variables.$color-primary;
  font-size: 1.25rem;
}

.quick-info small {
  margin-top: 0.15rem;
  color:
    rgba(255, 255, 255, 0.25);
  font-size: 0.53rem;
}

.quick-info__text {
  overflow-wrap: anywhere;
  color:
    variables.$color-white !important;
  font-size: 0.72rem !important;
}

/* =========================================================
   LAYOUT
========================================================= */

.lesson-layout {
  display: grid;
  gap: 0.9rem;
  grid-template-columns:
    minmax(0, 1fr)
    290px;
  align-items: start;
}

.lesson-main {
  display: grid;
  gap: 0.9rem;
}

.lesson-sidebar {
  position: sticky;
  top: 1rem;
  display: grid;
  gap: 0.7rem;
}

/* =========================================================
   CONTENT
========================================================= */

.content-section,
.teacher-notes {
  padding: 1.65rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 17px;
  background:
    variables.$color-surface;
}

.section-heading {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}

.section-heading > div > span {
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.section-heading h2 {
  margin:
    0.2rem
    0
    0;
  font-size:
    clamp(
      1.35rem,
      3vw,
      1.9rem
    );
}

.section-heading p {
  max-width: 650px;
  margin:
    0.35rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.35);
  font-size: 0.65rem;
  line-height: 1.5;
}

.section-count {
  display: grid;
  min-width: 34px;
  height: 34px;
  place-items: center;
  padding:
    0
    0.5rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.28);
  border-radius: 999px;
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
}

/* =========================================================
   PRIMARY MATERIAL
========================================================= */

.material-section {
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(255, 196, 0, 0.075),
      transparent 38%
    ),
    variables.$color-surface;
}

.primary-material {
  display: grid;
  gap: 1.35rem;
  grid-template-columns:
    145px
    minmax(0, 1fr);
  padding: 1.2rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.25);
  border-radius: 14px;
  background:
    variables.$color-background;
}

.primary-material__visual {
  display: grid;
  min-height: 160px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  background:
    linear-gradient(
      145deg,
      rgba(255, 196, 0, 0.065),
      transparent
    );
}

.pdf-icon {
  display: grid;
  width: 74px;
  height: 94px;
  place-items: center;
  align-content: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 8px;
}

.pdf-icon span {
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
}

.pdf-icon strong {
  margin-top: 0.35rem;
  color:
    rgba(255, 255, 255, 0.32);
  font-size: 0.6rem;
}

.primary-material__content {
  align-self: center;
}

.primary-material__eyebrow {
  color:
    variables.$color-primary;
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.primary-material h3 {
  margin:
    0.45rem
    0
    0;
  overflow-wrap: anywhere;
  font-size:
    clamp(
      1.2rem,
      3vw,
      1.65rem
    );
}

.primary-material p {
  max-width: 650px;
  margin:
    0.6rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.69rem;
  line-height: 1.55;
}

.primary-material__meta {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.7rem;
}

.primary-material__meta span {
  padding:
    0.28rem
    0.45rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.31);
  font-size: 0.55rem;
}

.primary-material__actions {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.material-button {
  display: inline-flex;
  min-height: 38px;
  gap: 0.35rem;
  align-items: center;
  justify-content: center;
  padding:
    0.6rem
    0.72rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  color:
    variables.$color-white;
  font-size: 0.62rem;
  font-weight: 800;
  text-decoration: none;
}

.material-button--primary {
  border-color:
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #070707;
}

/* =========================================================
   EMPTY MATERIAL
========================================================= */

.empty-material {
  display: grid;
  gap: 0.9rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1.1rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 13px;
}

.empty-material__icon {
  display: grid;
  width: 45px;
  height: 45px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 10px;
  color:
    variables.$color-primary;
  font-size: 0.56rem;
  font-weight: 900;
}

.empty-material strong {
  font-size: 0.72rem;
}

.empty-material p {
  margin:
    0.25rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.36);
  font-size: 0.62rem;
}

.empty-material a {
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   SECTION EMPTY
========================================================= */

.section-empty {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  padding: 0.9rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 11px;
}

.section-empty > span {
  display: grid;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.section-empty strong {
  font-size: 0.67rem;
}

.section-empty p {
  margin:
    0.18rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.58rem;
}

/* =========================================================
   RESOURCE
========================================================= */

.resource-list,
.assignment-list {
  display: grid;
  gap: 0.55rem;
}

.resource-item,
.assignment-card {
  display: grid;
  gap: 0.8rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;
}

.resource-item:hover:not(.resource-item--disabled),
.assignment-card:hover {
  border-color:
    variables.$color-primary;
  transform:
    translateY(-1px);
}

.resource-item--disabled {
  cursor: default;
}

.resource-item__icon,
.assignment-card__icon {
  display: grid;
  width: 41px;
  height: 41px;
  place-items: center;
  border:
    1px solid
    rgba(255, 196, 0, 0.4);
  border-radius: 10px;
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
}

.resource-item__content span,
.resource-item__content strong,
.resource-item__content small {
  display: block;
}

.resource-item__content > span,
.assignment-card__content > span {
  color:
    variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
  text-transform: uppercase;
}

.resource-item__content strong,
.assignment-card__content > strong {
  display: block;
  margin-top: 0.14rem;
  font-size: 0.7rem;
}

.resource-item__content small {
  margin-top: 0.12rem;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.55rem;
}

.resource-item__action,
.assignment-card__arrow {
  color:
    variables.$color-primary;
  font-size: 0.6rem;
  font-weight: 800;
}

.assignment-card__meta {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.3rem;
}

.assignment-card__meta span {
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.55rem;
}

.view-all-link {
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;
  margin-top: 0.9rem;
  color:
    variables.$color-primary;
  font-size: 0.61rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   EMPTY ASSIGNMENTS
========================================================= */

.empty-assignments {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  padding: 0.9rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 11px;
}

.empty-assignments > div {
  display: grid;
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.empty-assignments strong {
  font-size: 0.69rem;
}

.empty-assignments p {
  margin:
    0.17rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.34);
  font-size: 0.59rem;
}

.classwork-link {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.9rem;
  padding: 0.9rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.3);
  border-radius: 11px;
  color:
    variables.$color-white;
  text-decoration: none;
}

.classwork-link span,
.classwork-link strong {
  display: block;
}

.classwork-link span {
  color:
    variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.classwork-link strong {
  margin-top: 0.16rem;
  font-size: 0.71rem;
}

.classwork-link b {
  color:
    variables.$color-primary;
}

/* =========================================================
   COMPLETION
========================================================= */

.completion-section {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1.5rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.25);
  border-radius: 17px;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(255, 196, 0, 0.07),
      transparent 45%
    ),
    variables.$color-surface;
}

.completion-section--done {
  border-color:
    rgba(255, 196, 0, 0.52);
  box-shadow:
    inset 3px 0
    variables.$color-primary;
}

.completion-section__content {
  display: flex;
  gap: 0.9rem;
  align-items: center;
}

.completion-section__icon {
  display: grid;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 1rem;
}

.completion-section--done
.completion-section__icon {
  background:
    variables.$color-primary;
  color: #070707;
}

.completion-section__content span {
  color:
    variables.$color-primary;
  font-size: 0.54rem;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.completion-section h2 {
  margin:
    0.2rem
    0
    0;
  font-size: 1.1rem;
}

.completion-section p {
  max-width: 650px;
  margin:
    0.3rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.64rem;
  line-height: 1.5;
}

.completion-section__actions {
  display: flex;
  gap: 0.45rem;
  flex-direction: column;
  min-width: 190px;
}

.complete-button,
.continue-button {
  display: inline-flex;
  min-height: 40px;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  padding:
    0.6rem
    0.75rem;
  border-radius: 9px;
  font: inherit;
  font-size: 0.62rem;
  font-weight: 900;
}

.complete-button {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #070707;
  cursor: pointer;
}

.complete-button--done {
  background: transparent;
  color:
    variables.$color-primary;
}

.complete-button:disabled {
  opacity: 0.5;
  cursor: wait;
}

.continue-button {
  border:
    1px solid
    variables.$color-border;
  color:
    variables.$color-white;
  text-decoration: none;
}

/* =========================================================
   CLASS DATA
========================================================= */

.class-data {
  display: grid;
  gap: 0.55rem;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
}

.class-data article {
  padding: 0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  background:
    variables.$color-background;
}

.class-data span,
.class-data strong {
  display: block;
}

.class-data span {
  margin-bottom: 0.25rem;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.54rem;
  text-transform: uppercase;
}

.class-data strong {
  overflow-wrap: anywhere;
  color:
    variables.$color-primary;
  font-size: 0.66rem;
}

.class-data__wide {
  grid-column:
    span 2;
}

/* =========================================================
   ACADEMIC
========================================================= */

.academic-section {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 17px;
  background:
    variables.$color-surface;
}

.academic-toggle {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding:
    1rem
    1.15rem;
  border: 0;
  background: transparent;
  color:
    variables.$color-white;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.academic-toggle > div {
  display: flex;
  gap: 0.7rem;
  align-items: center;
}

.academic-toggle__icon {
  display: grid;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    rgba(255, 196, 0, 0.32);
  border-radius: 9px;
  color:
    variables.$color-primary;
}

.academic-toggle span,
.academic-toggle strong,
.academic-toggle small {
  display: block;
}

.academic-toggle
> div
> div:last-child
> span {
  color:
    variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.academic-toggle strong {
  margin-top: 0.12rem;
  font-size: 0.72rem;
}

.academic-toggle small {
  margin-top: 0.1rem;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.56rem;
}

.academic-toggle > span {
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.57rem;
}

.academic-content {
  display: grid;
  gap: 0.7rem;
  padding: 1.1rem;
  border-top:
    1px solid
    variables.$color-border;
}

.academic-block {
  padding: 0.9rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  background:
    variables.$color-background;
}

.academic-block--focus {
  border-color:
    rgba(255, 196, 0, 0.28);
}

.academic-block--focus > span {
  color:
    variables.$color-primary;
  font-size: 0.53rem;
  font-weight: 900;
}

.academic-block--focus h3 {
  margin:
    0.3rem
    0
    0;
}

.academic-block header {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  margin-bottom: 0.7rem;
}

.academic-block header > span {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
}

.academic-block h3 {
  margin: 0;
  font-size: 0.9rem;
}

.academic-list {
  display: grid;
  gap: 0.4rem;
}

.academic-list > div {
  display: flex;
  gap: 0.6rem;
  align-items: flex-start;
  padding: 0.55rem;
  border-top:
    1px solid
    variables.$color-border;
}

.academic-list > div > span {
  color:
    variables.$color-primary;
  font-size: 0.56rem;
  font-weight: 900;
}

.academic-list p {
  margin: 0;
  color:
    rgba(255, 255, 255, 0.58);
  font-size: 0.64rem;
  line-height: 1.5;
}

.academic-tags {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.academic-tags span {
  padding:
    0.4rem
    0.55rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.54);
  font-size: 0.59rem;
}

.repertoire-list {
  display: grid;
  gap: 0.4rem;
}

.repertoire-list > div {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  padding: 0.6rem;
  border-top:
    1px solid
    variables.$color-border;
}

.repertoire-list > div > span {
  display: grid;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    rgba(255, 196, 0, 0.3);
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.repertoire-list small,
.repertoire-list strong {
  display: block;
}

.repertoire-list small {
  color:
    variables.$color-primary;
  font-size: 0.5rem;
}

.repertoire-list strong {
  margin-top: 0.1rem;
  font-size: 0.65rem;
}

.academic-enter-active,
.academic-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.academic-enter-from,
.academic-leave-to {
  opacity: 0;
  transform:
    translateY(-6px);
}

/* =========================================================
   TEACHER
========================================================= */

.teacher-notes {
  border-color:
    rgba(255, 196, 0, 0.2);
}

.teacher-notes > header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.teacher-notes > header span {
  color:
    variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.teacher-notes h2 {
  margin:
    0.15rem
    0
    0;
}

.teacher-notes > header a {
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 800;
  text-decoration: none;
}

.teacher-note {
  margin-top: 0.9rem;
  padding: 0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  background:
    variables.$color-background;
}

.teacher-note span {
  color:
    variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
}

.teacher-note p {
  margin:
    0.3rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.5);
  font-size: 0.63rem;
  line-height: 1.6;
  white-space: pre-line;
}

/* =========================================================
   SIDEBAR
========================================================= */

.sidebar-card {
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 14px;
  background:
    variables.$color-surface;
}

.sidebar-card--progress {
  border-color:
    rgba(255, 196, 0, 0.25);
}

.sidebar-card__eyebrow {
  color:
    variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.sidebar-card h3 {
  margin:
    0.35rem
    0
    0;
  font-size: 0.9rem;
  line-height: 1.3;
}

.sidebar-description {
  margin:
    0.3rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.57rem;
}

/* =========================================================
   SIDEBAR RING
========================================================= */

.sidebar-progress-ring {
  display: grid;
  width: 90px;
  height: 90px;
  place-items: center;
  margin:
    0.9rem
    auto;
  border-radius: 50%;
}

.sidebar-progress-ring > div {
  display: grid;
  width: 74px;
  height: 74px;
  place-items: center;
  align-content: center;
  border-radius: 50%;
  background:
    variables.$color-surface;
}

.sidebar-progress-ring strong {
  color:
    variables.$color-primary;
  font-size: 1.1rem;
}

.sidebar-progress-ring span {
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.49rem;
}

.sidebar-progress {
  margin-top: 0.9rem;
  padding-top: 0.8rem;
  border-top:
    1px solid
    variables.$color-border;
}

.sidebar-progress > div:first-child {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
}

.sidebar-progress span,
.sidebar-progress strong {
  font-size: 0.55rem;
}

.sidebar-progress span {
  color:
    rgba(255, 255, 255, 0.3);
}

.sidebar-progress strong {
  color:
    variables.$color-primary;
}

.sidebar-progress__bar {
  height: 4px;
  margin-top: 0.45rem;
  overflow: hidden;
  border-radius: 999px;
  background:
    rgba(255, 255, 255, 0.06);
}

.sidebar-progress__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background:
    variables.$color-primary;
}

/* =========================================================
   SIDEBAR SUMMARY
========================================================= */

.sidebar-summary {
  display: grid;
  gap: 0.45rem;
  grid-template-columns:
    1fr
    1fr;
  margin-top: 0.9rem;
}

.sidebar-summary article {
  padding: 0.6rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  background:
    variables.$color-background;
}

.sidebar-summary span,
.sidebar-summary small {
  display: block;
}

.sidebar-summary span {
  color:
    variables.$color-primary;
  font-size: 1.05rem;
  font-weight: 900;
}

.sidebar-summary small {
  margin-top: 0.08rem;
  color:
    rgba(255, 255, 255, 0.27);
  font-size: 0.52rem;
}

.sidebar-checklist {
  display: grid;
  gap: 0.4rem;
  margin-top: 0.8rem;
  padding-top: 0.8rem;
  border-top:
    1px solid
    variables.$color-border;
}

.sidebar-checklist > div {
  display: flex;
  gap: 0.45rem;
  align-items: center;
}

.sidebar-checklist > div > span {
  display: grid;
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 50%;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.52rem;
}

.sidebar-checklist
.sidebar-checklist__check {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
}

.sidebar-checklist p {
  margin: 0;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.57rem;
}

/* =========================================================
   SIDEBAR NAV
========================================================= */

.sidebar-nav {
  display: grid;
  gap: 0.4rem;
  margin-top: 0.7rem;
}

.sidebar-nav a {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  color:
    variables.$color-white;
  text-decoration: none;
  transition:
    border-color 0.18s ease;
}

.sidebar-nav a:hover {
  border-color:
    variables.$color-primary;
}

.sidebar-nav span,
.sidebar-nav strong {
  display: block;
}

.sidebar-nav span {
  color:
    variables.$color-primary;
  font-size: 0.48rem;
  font-weight: 900;
}

.sidebar-nav strong {
  margin-top: 0.08rem;
  font-size: 0.61rem;
}

.sidebar-nav b {
  color:
    variables.$color-primary;
}

/* =========================================================
   NEXT SIDEBAR
========================================================= */

.next-sidebar {
  padding: 1rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.28);
  border-radius: 14px;
  background:
    rgba(255, 196, 0, 0.025);
}

.next-sidebar > span {
  color:
    variables.$color-primary;
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.next-sidebar > strong {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.72rem;
}

.next-sidebar > small {
  display: block;
  margin-top: 0.15rem;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.53rem;
}

.next-sidebar a {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.7rem;
  padding:
    0.55rem
    0.65rem;
  border-radius: 8px;
  background:
    variables.$color-primary;
  color: #070707;
  font-size: 0.58rem;
  font-weight: 900;
  text-decoration: none;
}

/* =========================================================
   FINISHED SIDEBAR
========================================================= */

.unit-finished-sidebar {
  display: grid;
  place-items: center;
  padding: 1rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 14px;
  text-align: center;
}

.unit-finished-sidebar > div {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color: #070707;
}

.unit-finished-sidebar > span {
  margin-top: 0.6rem;
  color:
    variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.unit-finished-sidebar strong {
  margin-top: 0.2rem;
  font-size: 0.69rem;
}

.unit-finished-sidebar p {
  margin:
    0.25rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.32);
  font-size: 0.55rem;
  line-height: 1.45;
}

/* =========================================================
   TIP
========================================================= */

.sidebar-tip {
  display: flex;
  gap: 0.65rem;
  padding: 0.9rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.2);
  border-radius: 13px;
  background:
    rgba(255, 196, 0, 0.02);
}

.sidebar-tip > span {
  display: grid;
  width: 31px;
  height: 31px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.sidebar-tip strong {
  font-size: 0.61rem;
}

.sidebar-tip p {
  margin:
    0.2rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.32);
  font-size: 0.55rem;
  line-height: 1.45;
}

/* =========================================================
   NAVIGATION
========================================================= */

.lesson-navigation {
  display: grid;
  gap: 0.7rem;
  grid-template-columns:
    1fr
    auto
    1fr;
  align-items: stretch;
  margin-top: 1rem;
}

.lesson-navigation__item,
.lesson-navigation__program {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  padding: 0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  color:
    variables.$color-white;
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;
}

a.lesson-navigation__item:hover,
.lesson-navigation__program:hover {
  border-color:
    variables.$color-primary;
  transform:
    translateY(-1px);
}

.lesson-navigation__item--next {
  justify-content: flex-end;
  text-align: right;
}

.lesson-navigation small,
.lesson-navigation strong,
.lesson-navigation__program span {
  display: block;
}

.lesson-navigation small,
.lesson-navigation__program span {
  color:
    variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.lesson-navigation strong,
.lesson-navigation__program strong {
  margin-top: 0.1rem;
  font-size: 0.62rem;
}

.lesson-navigation__arrow {
  color:
    variables.$color-primary;
}

.lesson-navigation__program {
  display: grid;
  min-width: 115px;
  place-items: center;
  align-content: center;
  text-align: center;
}

.lesson-navigation__item--disabled {
  opacity: 0.32;
}

/* =========================================================
   TOAST
========================================================= */

.lesson-toast {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1200;
  display: flex;
  max-width: 380px;
  gap: 0.65rem;
  align-items: center;
  padding: 0.85rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.4);
  border-radius: 12px;
  background:
    rgba(18, 18, 18, 0.97);
  box-shadow:
    0 20px 55px
    rgba(0, 0, 0, 0.55);
  backdrop-filter:
    blur(12px);
}

.lesson-toast > span {
  display: grid;
  width: 31px;
  height: 31px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.lesson-toast strong,
.lesson-toast small {
  display: block;
}

.lesson-toast strong {
  font-size: 0.63rem;
}

.lesson-toast small {
  margin-top: 0.1rem;
  color:
    rgba(255, 255, 255, 0.36);
  font-size: 0.56rem;
}

.lesson-toast--error {
  border-color:
    rgba(255, 90, 90, 0.45);
}

.lesson-toast--error > span {
  border-color: #ff7272;
  color: #ff7272;
}

.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform:
    translateY(8px);
}

/* =========================================================
   SPINNER
========================================================= */

.button-spinner {
  width: 13px;
  height: 13px;
  border:
    2px solid
    rgba(0, 0, 0, 0.22);
  border-top-color:
    currentColor;
  border-radius: 50%;
  animation:
    spinnerRotate 0.7s linear infinite;
}

/* =========================================================
   STATES
========================================================= */

.state-screen {
  display: grid;
  min-height: 430px;
  gap: 0.7rem;
  place-items: center;
  align-content: center;
  padding: 2rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 18px;
  text-align: center;
}

.state-screen p {
  max-width: 550px;
  margin: 0;
  color:
    rgba(255, 255, 255, 0.4);
}

.state-screen__loader {
  width: 45px;
  height: 45px;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spinnerRotate 0.75s linear infinite;
}

@keyframes spinnerRotate {
  to {
    transform:
      rotate(360deg);
  }
}

.state-screen__error-icon {
  display: grid;
  width: 55px;
  height: 55px;
  place-items: center;
  border:
    1px solid
    #ff6f6f;
  border-radius: 50%;
  color:
    #ff6f6f;
  font-size: 1.4rem;
}

.state-screen__actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.state-screen__actions button,
.state-screen__actions a {
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 9px;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-size: 0.64rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}


/* =========================================================
   EVALUACIONES
========================================================= */

.assessment-section {
  scroll-margin-top: 7rem;
}

.assessment-list {
  display: grid;
  gap: 0.75rem;
}

.assessment-card {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.24);
  border-radius: 14px;
  background:
    linear-gradient(
      115deg,
      rgba(255, 196, 0, 0.055),
      transparent 55%
    ),
    variables.$color-background;
}

.assessment-card--draft {
  opacity: 0.72;
}

.assessment-card--closed {
  border-color:
    variables.$color-border;
}

.assessment-card__icon {
  display: grid;
  width: 52px;
  height: 52px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 14px;
  color:
    variables.$color-primary;
  font-size: 0.78rem;
  font-weight: 900;
  letter-spacing: 0.06em;
}

.assessment-card__content {
  min-width: 0;
}

.assessment-card__badges {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;
}

.assessment-type,
.assessment-status {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding:
    0.25rem
    0.5rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
}

.assessment-type {
  color:
    variables.$color-primary;
}

.assessment-status--published {
  border-color:
    rgba(255, 196, 0, 0.34);
  color:
    variables.$color-primary;
}

.assessment-card h3 {
  margin: 0;
  overflow-wrap: anywhere;
  font-size: 1rem;
  line-height: 1.35;
}

.assessment-card p {
  margin:
    0.4rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.58);
  font-size: 0.88rem;
  line-height: 1.6;
}

.assessment-card__meta {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-top: 0.65rem;
}

.assessment-card__meta span {
  padding:
    0.25rem
    0.45rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 7px;
  color:
    rgba(255, 255, 255, 0.58);
  font-size: 0.74rem;
}

.assessment-card__action {
  display: inline-flex;
  min-height: 46px;
  gap: 0.55rem;
  align-items: center;
  justify-content: center;
  padding:
    0.75rem
    0.9rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 11px;
  color:
    variables.$color-primary;
  font-size: 0.82rem;
  font-weight: 900;
  text-decoration: none;
  white-space: nowrap;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.assessment-card__action:hover {
  background:
    variables.$color-primary;
  color: #080808;
  transform:
    translateY(-1px);
}

.classwork-link--assessment {
  margin-top: 0.9rem;
  border-color:
    rgba(255, 196, 0, 0.28);
}

.quick-info__evaluation {
  border-color:
    rgba(255, 196, 0, 0.3) !important;
}

/* =========================================================
   LEGIBILIDAD / ACCESIBILIDAD
   Pensado para niños, adultos y adultos mayores.
========================================================= */

.lesson-page a,
.lesson-page button {
  min-height: 44px;
}

.lesson-page button:focus-visible,
.lesson-page a:focus-visible {
  outline:
    3px solid
    rgba(255, 196, 0, 0.62);
  outline-offset: 3px;
}

.back-link,
.teacher-button,
.student-topbar-status,
.unit-breadcrumb,
.lesson-hero__eyebrow,
.lesson-hero__meta,
.learning-progress__content > span,
.learning-progress__content p,
.learning-progress__state small,
.learning-progress__state strong,
.quick-info span,
.quick-info small,
.section-heading > div > span,
.section-heading p,
.primary-material__eyebrow,
.primary-material p,
.primary-material__meta span,
.material-button,
.empty-material strong,
.empty-material p,
.empty-material a,
.section-empty strong,
.section-empty p,
.resource-item__content > span,
.assignment-card__content > span,
.resource-item__content strong,
.assignment-card__content > strong,
.resource-item__content small,
.resource-item__action,
.assignment-card__arrow,
.assignment-card__meta span,
.sidebar-progress span,
.sidebar-progress strong,
.sidebar-summary small,
.sidebar-checklist p,
.sidebar-nav span,
.sidebar-nav strong,
.state-screen__actions button,
.state-screen__actions a {
  font-size:
    max(
      0.78rem,
      12.5px
    );
}

.lesson-hero__description,
.section-heading p,
.primary-material p,
.section-empty p,
.resource-item__content small,
.sidebar-description,
.sidebar-tip p {
  line-height: 1.65;
}



/* =========================================================
   PROGRESO GRANULAR · BLACKBOARD INSPIRED
========================================================= */

.learning-path {
  margin-bottom: 0.8rem;
  overflow: hidden;
  border:
    1px solid
    rgba(255, 196, 0, 0.25);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(255, 196, 0, 0.07),
      transparent 32%
    ),
    variables.$color-surface;
}

.learning-path--complete {
  border-color:
    rgba(103, 217, 139, 0.4);
}

.learning-path__header {
  display: flex;
  gap: 1.4rem;
  align-items: center;
  justify-content: space-between;
  padding:
    1rem
    1.1rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.learning-path__heading {
  display: flex;
  min-width: 0;
  gap: 0.9rem;
  align-items: center;
}

.learning-path__ring {
  display: grid;
  width: 62px;
  height: 62px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
}

.learning-path__ring::before {
  grid-area: 1 / 1;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background:
    variables.$color-surface;
  content: '';
}

.learning-path__ring span {
  z-index: 1;
  grid-area: 1 / 1;
  color:
    variables.$color-primary;
  font-size: 0.72rem;
  font-weight: 900;
}

.learning-path__heading > div:last-child > span {
  color:
    variables.$color-primary;
  font-size: 0.67rem;
  font-weight: 900;
  letter-spacing: 0.11em;
}

.learning-path__heading h2 {
  margin:
    0.2rem
    0
    0;
  font-size: 1rem;
}

.learning-path__heading p {
  max-width: 700px;
  margin:
    0.22rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.46);
  font-size: 0.78rem;
  line-height: 1.55;
}

.learning-path__summary {
  flex-shrink: 0;
  text-align: right;
}

.learning-path__summary strong,
.learning-path__summary small {
  display: block;
}

.learning-path__summary strong {
  color:
    variables.$color-primary;
  font-size: 1.25rem;
}

.learning-path__summary small {
  margin-top: 0.12rem;
  color:
    rgba(255, 255, 255, 0.38);
  font-size: 0.68rem;
}

.learning-path__items {
  display: grid;
}

.learning-path-item {
  display: grid;
  gap: 0.8rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding:
    0.8rem
    1.1rem;
  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.05);
  transition:
    background 0.18s ease;
}

.learning-path-item:last-child {
  border-bottom: 0;
}

.learning-path-item--completed {
  background:
    rgba(103, 217, 139, 0.035);
}

.learning-path-item--viewed {
  background:
    rgba(255, 196, 0, 0.025);
}

.learning-path-item__state {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 50%;
  color:
    rgba(255, 255, 255, 0.36);
  font-size: 0.72rem;
  font-weight: 900;
}

.learning-path-item--completed
.learning-path-item__state {
  border-color:
    rgba(103, 217, 139, 0.55);
  background:
    rgba(103, 217, 139, 0.09);
  color:
    #8ee3a7;
}

.learning-path-item--viewed
.learning-path-item__state {
  border-color:
    rgba(255, 196, 0, 0.42);
  color:
    variables.$color-primary;
}

.learning-path-item__copy span,
.learning-path-item__copy strong {
  display: block;
}

.learning-path-item__copy span {
  color:
    rgba(255, 255, 255, 0.35);
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
}

.learning-path-item__copy strong {
  margin-top: 0.13rem;
  font-size: 0.82rem;
}

.learning-path-item__status {
  padding:
    0.35rem
    0.55rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.42);
  font-size: 0.67rem;
  font-weight: 900;
}

.learning-path-item--completed
.learning-path-item__status {
  border-color:
    rgba(103, 217, 139, 0.42);
  color:
    #8ee3a7;
}

.learning-path-item--viewed
.learning-path-item__status {
  border-color:
    rgba(255, 196, 0, 0.34);
  color:
    variables.$color-primary;
}

.learning-path__footer {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding:
    0.8rem
    1.1rem;
  border-top:
    1px solid
    variables.$color-border;
  background:
    rgba(255, 255, 255, 0.015);
}

.learning-path__footer span {
  color:
    rgba(255, 255, 255, 0.45);
  font-size: 0.72rem;
}

.learning-path__footer strong {
  color:
    variables.$color-primary;
  font-size: 0.72rem;
}

.learning-path__empty {
  padding: 1rem;
  color:
    rgba(255, 255, 255, 0.45);
  font-size: 0.78rem;
  line-height: 1.6;
}

/* =========================================================
   ESTADOS VISUALES DE CONTENIDO
========================================================= */

.learning-status {
  display: inline-flex;
  min-height: 26px;
  gap: 0.3rem;
  align-items: center;
  margin-left: 0.45rem;
  padding:
    0.2rem
    0.45rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.42);
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0;
  text-transform: none;
}

.learning-status--completed {
  border-color:
    rgba(103, 217, 139, 0.48);
  background:
    rgba(103, 217, 139, 0.06);
  color:
    #8ee3a7;
}

.learning-status--viewed {
  border-color:
    rgba(255, 196, 0, 0.38);
  background:
    rgba(255, 196, 0, 0.04);
  color:
    variables.$color-primary;
}

.primary-material--completed,
.resource-item--completed,
.assignment-card--completed,
.assessment-card--completed {
  border-color:
    rgba(103, 217, 139, 0.45) !important;
  background:
    linear-gradient(
      110deg,
      rgba(103, 217, 139, 0.045),
      transparent 60%
    ),
    variables.$color-background;
}

.resource-item--viewed,
.assignment-card--viewed,
.assessment-card--viewed {
  border-color:
    rgba(255, 196, 0, 0.33);
}

.automatic-progress-badge {
  display: grid;
  min-height: 52px;
  place-items: center;
  align-content: center;
  padding:
    0.6rem
    0.8rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.32);
  border-radius: 10px;
  background:
    rgba(255, 196, 0, 0.045);
  text-align: center;
}

.automatic-progress-badge span,
.automatic-progress-badge small {
  display: block;
}

.automatic-progress-badge span {
  color:
    variables.$color-primary;
  font-size: 1rem;
  font-weight: 900;
}

.automatic-progress-badge small {
  color:
    rgba(255, 255, 255, 0.42);
  font-size: 0.66rem;
}

/* =========================================================
   SIDEBAR CHECKLIST REAL
========================================================= */

.sidebar-checklist__viewed {
  border-color:
    rgba(255, 196, 0, 0.44) !important;
  color:
    variables.$color-primary !important;
}

.sidebar-checklist p {
  flex: 1;
}

.sidebar-checklist p small {
  display: block;
  margin-top: 0.08rem;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.62rem;
}

.sidebar-checklist
.sidebar-checklist__check {
  border-color:
    rgba(103, 217, 139, 0.55);
  background:
    rgba(103, 217, 139, 0.075);
  color:
    #8ee3a7;
}


/* =========================================================
   RESPONSIVE
========================================================= */


@media (max-width: 760px) {
  .learning-path__header,
  .learning-path__footer {
    align-items: flex-start;
    flex-direction: column;
  }

  .learning-path__summary {
    text-align: left;
  }

  .learning-path-item {
    grid-template-columns:
      auto
      minmax(0, 1fr);
  }

  .learning-path-item__status {
    grid-column: 2;
    justify-self: start;
  }
}

@media (max-width: 1050px) {
  .lesson-layout {
    grid-template-columns:
      1fr;
  }

  .lesson-sidebar {
    position: static;
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .sidebar-tip,
  .next-sidebar,
  .unit-finished-sidebar {
    grid-column:
      1 / -1;
  }
}

@media (max-width: 850px) {
  .lesson-hero {
    grid-template-columns:
      1fr;
  }

  .lesson-hero__aside {
    grid-template-columns:
      auto
      auto;
    justify-content: start;
    align-items: center;
  }

  .lesson-number {
    width: 82px;
    height: 82px;
  }

  .lesson-number strong {
    font-size: 1.8rem;
  }

  .quick-info {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .class-data {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .class-data__wide {
    grid-column:
      span 1;
  }

  .lesson-navigation {
    grid-template-columns:
      1fr
      1fr;
  }

  .lesson-navigation__program {
    grid-column:
      1 / -1;
    grid-row: 2;
  }
}

@media (max-width: 700px) {
  .lesson-topbar {
    align-items: stretch;
    flex-direction: column;
  }

  .teacher-actions {
    width: 100%;
  }

  .teacher-button {
    flex: 1;
  }

  .lesson-hero,
  .content-section,
  .teacher-notes {
    padding: 1.25rem;
  }

  .learning-progress {
    grid-template-columns:
      1fr;
  }

  .learning-progress__state {
    text-align: left;
  }

  .primary-material {
    grid-template-columns:
      1fr;
  }

  .primary-material__visual {
    min-height: 135px;
  }

  .completion-section {
    grid-template-columns:
      1fr;
  }

  .completion-section__actions {
    min-width: 0;
  }

  .lesson-sidebar {
    grid-template-columns:
      1fr;
  }

  .sidebar-tip,
  .next-sidebar,
  .unit-finished-sidebar {
    grid-column: auto;
  }
}

@media (max-width: 520px) {
  .lesson-hero {
    border-radius: 18px;
  }

  .lesson-hero h1 {
    font-size:
      clamp(
        2.4rem,
        14vw,
        4rem
      );
  }

  .quick-info {
    grid-template-columns:
      1fr
      1fr;
  }

  .class-data {
    grid-template-columns:
      1fr;
  }

  .resource-item,
  .assignment-card,
  .assessment-card {
    grid-template-columns:
      auto
      1fr;
  }

  .assessment-card__action {
    grid-column:
      1 / -1;
    width: 100%;
  }

  .resource-item__action,
  .assignment-card__arrow {
    grid-column: 2;
  }

  .primary-material__actions {
    flex-direction: column;
  }

  .material-button {
    width: 100%;
  }

  .empty-material {
    grid-template-columns:
      auto
      1fr;
  }

  .empty-material > a {
    grid-column: 2;
  }

  .academic-toggle {
    align-items: flex-start;
  }

  .academic-toggle > span {
    display: none;
  }

  .teacher-actions {
    flex-direction: column;
  }

  .completion-section__content {
    align-items: flex-start;
  }

  .lesson-navigation {
    grid-template-columns:
      1fr;
  }

  .lesson-navigation__program {
    grid-column: auto;
    grid-row: auto;
  }

  .lesson-navigation__item--next {
    text-align: left;
    justify-content: space-between;
  }

  .lesson-toast {
    right: 0.75rem;
    bottom: 0.75rem;
    left: 0.75rem;
    max-width: none;
  }
}


/* =========================================================
   V7.0 · LESSON VIEW · LIGHT LMS FINAL
   Corrección sobre el selector raíz REAL: .lesson-page
   ========================================================= */

.lesson-page {
  --amv-ink: #152033;
  --amv-ink-soft: #344359;
  --amv-muted: #6f7c8f;
  --amv-muted-2: #8b98aa;
  --amv-line: #dbe3ec;
  --amv-line-strong: #cbd6e2;
  --amv-surface: #ffffff;
  --amv-surface-soft: #f7f9fc;
  --amv-wine: #9f1945;
  --amv-wine-dark: #7f1237;
  --amv-gold: #d9a91d;
  --amv-gold-dark: #987000;
  --amv-gold-soft: #fff8e7;
  --amv-green: #2d8a63;
  --amv-green-soft: #edf8f3;
}

/* =========================================================
   QUICK INFO · CONTRASTE REAL
========================================================= */

.lesson-page .quick-info {
  gap: 12px;
  margin-bottom: 16px;
}

.lesson-page .quick-info article {
  min-height: 112px;
  padding: 18px;
  border: 1px solid var(--amv-line) !important;
  border-radius: 16px;
  background: #ffffff !important;
  box-shadow: 0 7px 20px rgba(31, 48, 73, 0.035);
}

.lesson-page .quick-info article:nth-child(3) {
  border-color: #ead797 !important;
  background: linear-gradient(145deg, #fff, #fffaf0) !important;
}

.lesson-page .quick-info span {
  color: #718096 !important;
  font-size: 0.61rem !important;
  font-weight: 800;
  letter-spacing: .07em;
}

.lesson-page .quick-info strong {
  color: var(--amv-gold-dark) !important;
  font-size: 1.2rem;
}

.lesson-page .quick-info small {
  color: #7b8797 !important;
  font-size: .6rem !important;
}

.lesson-page .quick-info__text {
  color: var(--amv-ink) !important;
  font-size: .78rem !important;
  font-weight: 800;
}

/* =========================================================
   LAYOUT PRINCIPAL
========================================================= */

.lesson-page .lesson-main {
  gap: 14px;
}

.lesson-page .lesson-sidebar {
  gap: 12px;
}

/* =========================================================
   TODAS LAS SECCIONES GRANDES
========================================================= */

.lesson-page .content-section,
.lesson-page .teacher-notes {
  padding: 26px;
  border: 1px solid var(--amv-line) !important;
  border-radius: 18px;
  background: #ffffff !important;
  box-shadow: 0 9px 26px rgba(31, 48, 73, 0.04);
}

.lesson-page .section-heading > div > span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .section-heading h2 {
  color: var(--amv-ink) !important;
}

.lesson-page .section-heading p {
  color: var(--amv-muted) !important;
}

.lesson-page .section-count {
  border-color: #e5d18a !important;
  color: var(--amv-gold-dark) !important;
  background: var(--amv-gold-soft);
}

/* =========================================================
   MATERIAL PRINCIPAL
========================================================= */

.lesson-page .material-section {
  background:
    radial-gradient(circle at 98% 3%, rgba(217,169,29,.08), transparent 31%),
    #ffffff !important;
}

.lesson-page .primary-material {
  border-color: #ead79c !important;
  background: #fffdf8 !important;
}

.lesson-page .primary-material__visual {
  border-color: #eadfb9 !important;
  background: linear-gradient(145deg, #fffaf0, #fff) !important;
}

.lesson-page .primary-material__eyebrow {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .primary-material h3 {
  color: var(--amv-ink) !important;
}

.lesson-page .primary-material p {
  color: var(--amv-muted) !important;
}

.lesson-page .primary-material__meta span {
  border-color: #dfe5ec !important;
  color: #718095 !important;
  background: #fff !important;
}

.lesson-page .pdf-icon {
  border-color: #d6ad25 !important;
  background: #fff !important;
}

.lesson-page .pdf-icon span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .pdf-icon strong {
  color: #8b97a7 !important;
}

.lesson-page .material-button {
  border-color: var(--amv-line-strong) !important;
  color: #536276 !important;
  background: #fff !important;
}

.lesson-page .material-button--primary {
  border-color: var(--amv-wine) !important;
  color: #fff !important;
  background: var(--amv-wine) !important;
}

.lesson-page .material-button--primary:hover {
  background: var(--amv-wine-dark) !important;
}

/* =========================================================
   RECURSOS / ACTIVIDADES / EVALUACIONES
========================================================= */

.lesson-page .resource-item,
.lesson-page .assignment-card,
.lesson-page .assessment-card {
  border-color: var(--amv-line) !important;
  color: var(--amv-ink) !important;
  background: #fbfcfe !important;
}

.lesson-page .resource-item:hover:not(.resource-item--disabled),
.lesson-page .assignment-card:hover,
.lesson-page .assessment-card:hover {
  border-color: #c6d2df !important;
  background: #fff !important;
}

.lesson-page .resource-item__icon,
.lesson-page .assignment-card__icon,
.lesson-page .assessment-card__icon {
  border-color: #e4cb78 !important;
  color: var(--amv-gold-dark) !important;
  background: var(--amv-gold-soft) !important;
}

.lesson-page .resource-item__content > span,
.lesson-page .assignment-card__content > span,
.lesson-page .assessment-card__content > span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .resource-item__content strong,
.lesson-page .assignment-card__content > strong,
.lesson-page .assessment-card__content > strong {
  color: var(--amv-ink) !important;
}

.lesson-page .resource-item__content small,
.lesson-page .assignment-card__content small,
.lesson-page .assessment-card__content small {
  color: var(--amv-muted) !important;
}

.lesson-page .assignment-card__meta span {
  border-color: #dfe5ec !important;
  color: #6e7c90 !important;
  background: #fff !important;
}

.lesson-page .assessment-card__action {
  border-color: var(--amv-wine) !important;
  color: #fff !important;
  background: var(--amv-wine) !important;
}

.lesson-page .assessment-card__action:hover {
  background: var(--amv-wine-dark) !important;
  color: #fff !important;
}

.lesson-page .classwork-link,
.lesson-page .classwork-link--assessment {
  border-color: #e4d18d !important;
  color: var(--amv-wine) !important;
  background: #fffdf7 !important;
}

/* =========================================================
   EMPTY STATES
========================================================= */

.lesson-page .empty-material,
.lesson-page .section-empty {
  border-color: #d6dfe8 !important;
  background: #f8fafc !important;
}

.lesson-page .empty-material__icon,
.lesson-page .section-empty > span {
  border-color: #e4c967 !important;
  color: var(--amv-gold-dark) !important;
  background: var(--amv-gold-soft) !important;
}

.lesson-page .empty-material strong,
.lesson-page .section-empty strong {
  color: var(--amv-ink) !important;
}

.lesson-page .empty-material p,
.lesson-page .section-empty p {
  color: var(--amv-muted) !important;
}

.lesson-page .empty-material a {
  color: var(--amv-wine) !important;
}

/* =========================================================
   SIDEBAR
========================================================= */

.lesson-page .sidebar-card {
  padding: 18px;
  border: 1px solid var(--amv-line) !important;
  border-radius: 16px;
  background: #fff !important;
  box-shadow: 0 8px 22px rgba(31, 48, 73, 0.035);
}

.lesson-page .sidebar-card--progress {
  border-color: #e4d18c !important;
  background:
    radial-gradient(circle at 95% 5%, rgba(217,169,29,.08), transparent 34%),
    #fff !important;
}

.lesson-page .sidebar-card__eyebrow {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .sidebar-card h3 {
  color: var(--amv-ink) !important;
}

.lesson-page .sidebar-description,
.lesson-page .sidebar-card p,
.lesson-page .sidebar-card small {
  color: var(--amv-muted) !important;
}

.lesson-page .sidebar-summary article,
.lesson-page .sidebar-checklist li {
  border-color: #e3e8ee !important;
  background: #f8fafc !important;
}

.lesson-page .sidebar-summary strong,
.lesson-page .sidebar-checklist strong {
  color: var(--amv-ink) !important;
}

.lesson-page .sidebar-summary small,
.lesson-page .sidebar-checklist p {
  color: var(--amv-muted) !important;
}

/* cajas pequeñas negras del sidebar */
.lesson-page .sidebar-card .sidebar-summary article,
.lesson-page .sidebar-card .sidebar-stat,
.lesson-page .sidebar-card .summary-item {
  color: var(--amv-ink) !important;
  background: #f8fafc !important;
}

/* =========================================================
   SOBRE ESTA CLASE
========================================================= */

.lesson-page .class-data {
  gap: 10px;
}

.lesson-page .class-data article {
  border-color: var(--amv-line) !important;
  background: #f8fafc !important;
}

.lesson-page .class-data span {
  color: #7d8999 !important;
}

.lesson-page .class-data strong {
  color: var(--amv-ink) !important;
}

/* =========================================================
   PROGRESO DE UNIDAD · ESTUDIANTE
========================================================= */

.lesson-page .learning-progress {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0,1fr) auto;
  gap: 18px;
  align-items: center;
  margin-bottom: 14px;
  padding: 18px 20px;
  overflow: hidden;
  border: 1px solid var(--amv-line) !important;
  border-radius: 17px;
  background:
    radial-gradient(circle at 94% 8%, rgba(217,169,29,.08), transparent 31%),
    #fff !important;
  box-shadow: 0 9px 26px rgba(31,48,73,.04);
}

.lesson-page .learning-progress::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 4px;
  content: '';
  background: var(--amv-gold);
}

.lesson-page .learning-progress--complete {
  border-color: #c8e1d3 !important;
}

.lesson-page .learning-progress--complete::before {
  background: var(--amv-green);
}

.lesson-page .learning-progress__icon {
  width: 46px;
  height: 46px;
  border: 1px solid #e5cf83 !important;
  border-radius: 14px;
  color: var(--amv-gold-dark) !important;
  background: var(--amv-gold-soft) !important;
}

.lesson-page .learning-progress__content > span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .learning-progress__heading h2 {
  color: var(--amv-ink) !important;
}

.lesson-page .learning-progress__heading strong {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .learning-progress__bar {
  height: 7px;
  background: #e8edf2 !important;
}

.lesson-page .learning-progress__bar span {
  background: linear-gradient(90deg, #b98a00, #d9a91d) !important;
}

.lesson-page .learning-progress--complete .learning-progress__bar span {
  background: linear-gradient(90deg, #247553, #45a977) !important;
}

.lesson-page .learning-progress__content p {
  color: var(--amv-muted) !important;
}

.lesson-page .learning-progress__state {
  min-width: 105px;
  padding: 11px 13px;
  border: 1px solid var(--amv-line) !important;
  border-radius: 11px;
  background: #f8fafc !important;
  text-align: center;
}

.lesson-page .learning-progress__state small {
  color: #8491a1 !important;
}

.lesson-page .learning-progress__state strong {
  color: var(--amv-gold-dark) !important;
}

/* =========================================================
   RUTA DE LA CLASE · ESTUDIANTE
========================================================= */

.lesson-page .learning-path {
  margin-bottom: 14px;
  overflow: hidden;
  border: 1px solid var(--amv-line) !important;
  border-radius: 18px;
  background: #fff !important;
  box-shadow: 0 9px 26px rgba(31,48,73,.04);
}

.lesson-page .learning-path--complete {
  border-color: #c8e1d3 !important;
}

.lesson-page .learning-path__header {
  gap: 18px;
  padding: 18px 20px;
  border-bottom: 1px solid #e7ecf1 !important;
  background:
    radial-gradient(circle at 95% 4%, rgba(217,169,29,.07), transparent 28%),
    #fff !important;
}

.lesson-page .learning-path__ring {
  width: 58px;
  height: 58px;
}

.lesson-page .learning-path__ring::before {
  width: 47px;
  height: 47px;
  background: #fff !important;
  box-shadow: 0 0 0 1px #e1e7ed;
}

.lesson-page .learning-path__ring span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .learning-path__heading > div:last-child > span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .learning-path__heading h2 {
  color: var(--amv-ink) !important;
}

.lesson-page .learning-path__heading p {
  color: var(--amv-muted) !important;
}

.lesson-page .learning-path__summary {
  min-width: 100px;
  padding: 10px 12px;
  border: 1px solid #e6d294;
  border-radius: 11px;
  background: var(--amv-gold-soft);
  text-align: center;
}

.lesson-page .learning-path__summary strong {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .learning-path__summary small {
  color: #82764f !important;
}

.lesson-page .learning-path__items {
  background: #fff !important;
}

.lesson-page .learning-path-item {
  padding: 13px 18px;
  border-bottom: 1px solid #edf1f4 !important;
  background: #fff !important;
}

.lesson-page .learning-path-item:hover {
  background: #fafbfd !important;
}

.lesson-page .learning-path-item--completed {
  background: #f7fcf9 !important;
}

.lesson-page .learning-path-item--viewed {
  background: #fffdf7 !important;
}

.lesson-page .learning-path-item__state {
  border-color: #d5dde6 !important;
  color: #8c98a7 !important;
  background: #fff !important;
}

.lesson-page .learning-path-item--completed .learning-path-item__state {
  border-color: #b9ddc8 !important;
  color: var(--amv-green) !important;
  background: var(--amv-green-soft) !important;
}

.lesson-page .learning-path-item--viewed .learning-path-item__state {
  border-color: #e6cf82 !important;
  color: var(--amv-gold-dark) !important;
  background: var(--amv-gold-soft) !important;
}

.lesson-page .learning-path-item__copy span {
  color: #7d8999 !important;
}

.lesson-page .learning-path-item__copy strong {
  color: var(--amv-ink) !important;
}

.lesson-page .learning-path-item__status {
  border-color: #dbe2e9 !important;
  color: #758294 !important;
  background: #f8fafc !important;
}

.lesson-page .learning-path-item--completed .learning-path-item__status {
  border-color: #bfe0cd !important;
  color: var(--amv-green) !important;
  background: var(--amv-green-soft) !important;
}

.lesson-page .learning-path-item--viewed .learning-path-item__status {
  border-color: #ead79c !important;
  color: var(--amv-gold-dark) !important;
  background: var(--amv-gold-soft) !important;
}

.lesson-page .learning-path__footer {
  padding: 13px 18px;
  border-top: 1px solid #e7ecf1 !important;
  background: #f8fafc !important;
}

.lesson-page .learning-path__footer span {
  color: var(--amv-muted) !important;
}

.lesson-page .learning-path__footer strong {
  color: var(--amv-wine) !important;
}

.lesson-page .learning-path__empty {
  color: var(--amv-muted) !important;
  background: #fbfcfe !important;
}

/* =========================================================
   STATUS
========================================================= */

.lesson-page .learning-status {
  border-color: #dbe2e9 !important;
  color: #758294 !important;
  background: #f8fafc !important;
}

.lesson-page .learning-status--completed {
  border-color: #bfe0cd !important;
  color: var(--amv-green) !important;
  background: var(--amv-green-soft) !important;
}

.lesson-page .learning-status--viewed {
  border-color: #ead79c !important;
  color: var(--amv-gold-dark) !important;
  background: var(--amv-gold-soft) !important;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 760px) {
  .lesson-page .learning-progress {
    grid-template-columns: 1fr;
  }

  .lesson-page .learning-progress__state {
    width: 100%;
    min-width: 0;
    text-align: left;
  }

  .lesson-page .learning-path__header {
    align-items: flex-start;
    flex-direction: column;
  }

  .lesson-page .learning-path__summary {
    width: 100%;
    text-align: left;
  }

  .lesson-page .quick-info {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}

@media (max-width: 480px) {
  .lesson-page .quick-info {
    grid-template-columns: 1fr;
  }
}


/* =========================================================
   V7.9 · FLUJO PROFESOR · EVALUACIONES
   Gestión separada de revisión de intentos
========================================================= */

.lesson-page .assessment-card__teacher-actions {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.lesson-page .assessment-card__teacher-actions
.assessment-card__action {
  min-height: 42px;
}

.lesson-page
.assessment-card__action--secondary {
  border-color: var(--amv-line-strong) !important;
  color: var(--amv-ink-soft) !important;
  background: #ffffff !important;
}

.lesson-page
.assessment-card__action--secondary:hover {
  border-color: #b8c5d3 !important;
  color: var(--amv-wine) !important;
  background: var(--amv-surface-soft) !important;
}

.lesson-page
.assessment-card__action--review {
  border-color: var(--amv-wine) !important;
  color: #ffffff !important;
  background: var(--amv-wine) !important;
  box-shadow:
    0 6px 14px
    rgba(159, 25, 69, 0.13);
}

.lesson-page
.assessment-card__action--review:hover {
  border-color: var(--amv-wine-dark) !important;
  background: var(--amv-wine-dark) !important;
  color: #ffffff !important;
  box-shadow:
    0 8px 18px
    rgba(127, 18, 55, 0.16);
}

.lesson-page
.assessment-card__action--review:focus-visible,
.lesson-page
.assessment-card__action--secondary:focus-visible {
  outline:
    3px solid
    rgba(159, 25, 69, 0.16);
  outline-offset: 3px;
}

/*
 * Para el profesor la tarjeta actúa como centro de gestión:
 * - Gestionar: vuelve a Contenidos y evaluaciones.
 * - Revisar intentos: abre entregas/corrección del quiz.
 *
 * Para el alumno se mantiene intacto el flujo:
 * comenzar -> completar -> ver resultados.
 */

@media (max-width: 760px) {
  .lesson-page .assessment-card__teacher-actions {
    grid-column: 1 / -1;
    width: 100%;
    justify-content: stretch;
  }

  .lesson-page .assessment-card__teacher-actions
  .assessment-card__action {
    flex: 1 1 170px;
  }
}

@media (max-width: 520px) {
  .lesson-page .assessment-card__teacher-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .lesson-page .assessment-card__teacher-actions
  .assessment-card__action {
    width: 100%;
    flex: 0 0 auto;
  }
}



/* =========================================================
   V8.0 · DETALLE ACADÉMICO + NOTAS DOCENTES · LIGHT LMS
   Corrige bloques negros heredados del tema global
========================================================= */

/* Contenedor académico */
.lesson-page .academic-section {
  overflow: hidden;
  border: 1px solid var(--amv-line) !important;
  border-radius: 18px !important;
  background: #ffffff !important;
  box-shadow: 0 9px 26px rgba(31, 48, 73, 0.04) !important;
}

/* Cabecera / acordeón */
.lesson-page .academic-toggle {
  width: 100% !important;
  padding: 20px 22px !important;
  border: 0 !important;
  border-bottom: 1px solid transparent !important;
  background: #ffffff !important;
  color: var(--amv-ink) !important;
}

.lesson-page .academic-toggle[aria-expanded="true"] {
  border-bottom-color: #ead79c !important;
  box-shadow: inset 0 -2px 0 #f1c84a !important;
}

.lesson-page .academic-toggle__icon {
  border: 1px solid #e5c35a !important;
  background: #fffaf0 !important;
  color: var(--amv-gold-dark) !important;
}

.lesson-page .academic-toggle span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .academic-toggle strong {
  color: var(--amv-ink) !important;
}

.lesson-page .academic-toggle small {
  color: var(--amv-muted) !important;
}

/* Cuerpo */
.lesson-page .academic-content {
  gap: 14px !important;
  padding: 18px 20px 22px !important;
  background: #f8fafc !important;
}

/* Tarjetas académicas */
.lesson-page .academic-block {
  border: 1px solid var(--amv-line) !important;
  border-radius: 16px !important;
  background: #ffffff !important;
  color: var(--amv-ink-soft) !important;
  box-shadow: 0 6px 18px rgba(31, 48, 73, 0.035) !important;
}

.lesson-page .academic-block--focus {
  border-color: #ead79c !important;
  background: linear-gradient(145deg, #fffdf8, #fff8e7) !important;
}

.lesson-page .academic-block--focus > span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .academic-block--focus h3 {
  color: var(--amv-ink) !important;
  line-height: 1.5 !important;
}

/* Encabezados de bloques */
.lesson-page .academic-block > header {
  border-bottom: 1px solid #edf1f5 !important;
}

.lesson-page .academic-block > header > span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .academic-block > header h3 {
  color: var(--amv-ink) !important;
}

/* Listas */
.lesson-page .academic-list > div {
  border-bottom: 1px solid #edf1f5 !important;
}

.lesson-page .academic-list > div:last-child {
  border-bottom: 0 !important;
}

.lesson-page .academic-list > div > span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .academic-list p {
  color: var(--amv-ink-soft) !important;
  line-height: 1.55 !important;
}

/* Tags de contenidos */
.lesson-page .academic-tags > span {
  border: 1px solid #dbe3ec !important;
  background: #f7f9fc !important;
  color: var(--amv-ink-soft) !important;
}

.lesson-page .academic-tags > span:hover {
  border-color: #d6b549 !important;
  background: #fff8e7 !important;
  color: var(--amv-ink) !important;
}

/* Repertorio */
.lesson-page .repertoire-list > div {
  border-bottom: 1px solid #edf1f5 !important;
}

.lesson-page .repertoire-list > div:last-child {
  border-bottom: 0 !important;
}

.lesson-page .repertoire-list > div > span {
  border: 1px solid #e5c35a !important;
  background: #fffaf0 !important;
  color: var(--amv-gold-dark) !important;
}

.lesson-page .repertoire-list small {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .repertoire-list strong {
  color: var(--amv-ink) !important;
}

/* =========================================================
   NOTAS DOCENTES
========================================================= */

.lesson-page .teacher-notes {
  padding: 24px !important;
  border: 1px solid var(--amv-line) !important;
  border-radius: 18px !important;
  background: #ffffff !important;
  box-shadow: 0 9px 26px rgba(31, 48, 73, 0.04) !important;
}

.lesson-page .teacher-notes > header {
  padding-bottom: 16px !important;
  border-bottom: 1px solid #edf1f5 !important;
}

.lesson-page .teacher-notes > header span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .teacher-notes > header h2 {
  color: var(--amv-ink) !important;
}

.lesson-page .teacher-notes > header a {
  display: inline-flex !important;
  min-height: 38px !important;
  align-items: center !important;
  justify-content: center !important;
  padding: 0 12px !important;
  border: 1px solid #d8b443 !important;
  border-radius: 9px !important;
  background: #fffaf0 !important;
  color: var(--amv-gold-dark) !important;
  font-weight: 800 !important;
  text-decoration: none !important;
}

.lesson-page .teacher-notes > header a:hover {
  border-color: #c39b22 !important;
  background: #fff4cf !important;
}

/* Cada nota */
.lesson-page .teacher-note {
  margin-top: 14px !important;
  padding: 18px !important;
  border: 1px solid var(--amv-line) !important;
  border-radius: 14px !important;
  background: #f8fafc !important;
}

.lesson-page .teacher-note > span {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .teacher-note p {
  color: var(--amv-ink-soft) !important;
  line-height: 1.65 !important;
  white-space: pre-line !important;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 760px) {
  .lesson-page .academic-content {
    padding: 14px !important;
  }

  .lesson-page .academic-block,
  .lesson-page .teacher-notes {
    border-radius: 14px !important;
  }

  .lesson-page .teacher-notes {
    padding: 18px !important;
  }
}

@media (max-width: 520px) {
  .lesson-page .academic-toggle {
    padding: 16px !important;
  }

  .lesson-page .academic-tags {
    gap: 7px !important;
  }

  .lesson-page .academic-tags > span {
    width: 100% !important;
  }

  .lesson-page .teacher-notes > header {
    align-items: flex-start !important;
    gap: 12px !important;
  }
}


/* =========================================================
   V9 · AMO MI VOZ · LESSON EXPERIENCE
   SaaS educativo premium · desktop + mobile
========================================================= */

.lesson-page {
  --amv-navy-950: #08111f;
  --amv-navy-900: #0e192b;
  --amv-navy-850: #132039;
  --amv-wine: #a6154b;
  --amv-wine-dark: #7f1038;
  --amv-wine-soft: #fff1f6;
  --amv-gold: #d9aa24;
  --amv-gold-dark: #987000;
  --amv-ink: #142033;
  --amv-ink-soft: #344359;
  --amv-muted: #6c7a90;
  --amv-line: #dce4ee;
  --amv-soft: #f6f8fb;
  --amv-success: #219567;
  --amv-success-soft: #edf9f4;
  --amv-danger: #be4357;
  color: var(--amv-ink);
}

/* TOPBAR */
.lesson-page .lesson-topbar {
  min-height: 52px !important;
  margin-bottom: 14px !important;
  padding: 0 4px !important;
}

.lesson-page .back-link {
  color: var(--amv-wine) !important;
  font-weight: 850 !important;
  text-decoration: none !important;
}

.lesson-page .teacher-button {
  min-height: 40px !important;
  padding: 0 14px !important;
  border: 1px solid var(--amv-line) !important;
  border-radius: 11px !important;
  background: #fff !important;
  color: var(--amv-ink-soft) !important;
  box-shadow: 0 5px 18px rgba(30, 45, 68, .04) !important;
}

.lesson-page .teacher-button--primary {
  border-color: var(--amv-wine) !important;
  background: var(--amv-wine) !important;
  color: #fff !important;
}

/* BREADCRUMB */
.lesson-page .unit-breadcrumb {
  margin-bottom: 14px !important;
  padding: 11px 14px !important;
  border: 1px solid var(--amv-line) !important;
  border-radius: 12px !important;
  background: rgba(255,255,255,.92) !important;
  color: var(--amv-muted) !important;
}

.lesson-page .unit-breadcrumb span:first-child {
  color: var(--amv-gold-dark) !important;
}

.lesson-page .unit-breadcrumb strong {
  color: var(--amv-ink) !important;
}

.lesson-page .unit-breadcrumb small,
.lesson-page .unit-breadcrumb > span:last-of-type {
  color: #9aa6b6 !important;
}

/* HERO CINEMÁTICO */
.lesson-page .lesson-hero {
  min-height: 440px !important;
  margin-bottom: 0 !important;
  padding: clamp(30px, 4vw, 58px) !important;
  border: 0 !important;
  border-radius: 24px 24px 0 0 !important;
  background-color: var(--amv-navy-950) !important;
  background-image:
    linear-gradient(
      90deg,
      rgba(8,17,31,.97) 0%,
      rgba(8,17,31,.90) 34%,
      rgba(8,17,31,.63) 68%,
      rgba(8,17,31,.76) 100%
    ),
    var(--lesson-cover-image) !important;
  background-size: cover !important;
  background-position: var(--lesson-cover-position, center) !important;
  box-shadow: 0 24px 60px rgba(13, 28, 49, .16) !important;
  isolation: isolate !important;
}

.lesson-page .lesson-hero::before {
  inset: 0 !important;
  width: auto !important;
  height: auto !important;
  z-index: -1 !important;
  background:
    radial-gradient(circle at 72% 38%, rgba(166,21,75,.18), transparent 34%),
    linear-gradient(180deg, transparent 55%, rgba(4,10,19,.26) 100%) !important;
}

.lesson-page .lesson-hero__content {
  max-width: 850px !important;
}

.lesson-page .lesson-hero__eyebrow {
  color: #e2b429 !important;
  font-size: .72rem !important;
  letter-spacing: .08em !important;
}

.lesson-page .lesson-hero h1 {
  max-width: 840px !important;
  margin-top: 18px !important;
  color: #fff !important;
  font-size: clamp(3rem, 6vw, 5.6rem) !important;
  line-height: .96 !important;
  letter-spacing: -.055em !important;
  text-shadow: 0 8px 34px rgba(0,0,0,.22) !important;
}

.lesson-page .lesson-hero__description {
  max-width: 820px !important;
  margin-top: 22px !important;
  color: rgba(255,255,255,.83) !important;
  font-size: clamp(.92rem, 1.15vw, 1.06rem) !important;
  line-height: 1.75 !important;
}

.lesson-page .lesson-hero__meta {
  gap: 8px !important;
  margin-top: 24px !important;
}

.lesson-page .lesson-hero__meta span {
  padding: 8px 11px !important;
  border: 1px solid rgba(255,255,255,.14) !important;
  border-radius: 10px !important;
  background: rgba(255,255,255,.08) !important;
  color: rgba(255,255,255,.9) !important;
  box-shadow: 0 6px 18px rgba(0,0,0,.08) !important;
  backdrop-filter: blur(8px) !important;
}

.lesson-page .lesson-hero__aside {
  min-width: 150px !important;
}

.lesson-page .lesson-number {
  width: 132px !important;
  height: 132px !important;
  border-color: rgba(217,170,36,.62) !important;
  background: rgba(255,255,255,.08) !important;
  color: #fff !important;
  box-shadow:
    inset 0 0 0 1px rgba(255,255,255,.08),
    0 14px 32px rgba(0,0,0,.16) !important;
  backdrop-filter: blur(12px) !important;
}

.lesson-page .lesson-number span {
  color: #e6ba37 !important;
}

.lesson-page .lesson-number strong {
  color: #f5c537 !important;
}

.lesson-page .status-badge {
  border: 1px solid rgba(255,255,255,.16) !important;
  background: rgba(255,255,255,.93) !important;
  color: #344359 !important;
  box-shadow: 0 7px 18px rgba(0,0,0,.12) !important;
}

/* TABS */
.lesson-page .lesson-tabs {
  position: sticky;
  top: 76px;
  z-index: 45;
  display: flex;
  gap: 3px;
  margin: 0 0 22px;
  padding: 8px 12px;
  overflow-x: auto;
  border: 1px solid var(--amv-line);
  border-top: 0;
  border-radius: 0 0 18px 18px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 14px 34px rgba(27, 43, 65, .08);
  backdrop-filter: blur(12px);
  scrollbar-width: none;
}

.lesson-page .lesson-tabs::-webkit-scrollbar {
  display: none;
}

.lesson-page .lesson-tabs a {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  gap: 8px;
  flex: 0 0 auto;
  padding: 0 14px;
  border-radius: 10px;
  color: #536178;
  font-size: .76rem;
  font-weight: 800;
  text-decoration: none;
  transition: .18s ease;
}

.lesson-page .lesson-tabs a:hover {
  background: var(--amv-wine-soft);
  color: var(--amv-wine);
}

.lesson-page .lesson-tabs a:first-child {
  background: var(--amv-wine-soft);
  color: var(--amv-wine);
}

.lesson-page .lesson-tabs span {
  color: var(--amv-gold-dark);
  font-size: .62rem;
  font-weight: 900;
}

/* PROGRESO / QUICK INFO */
.lesson-page .learning-progress,
.lesson-page .quick-info,
.lesson-page .learning-path {
  border: 1px solid var(--amv-line) !important;
  border-radius: 18px !important;
  background: #fff !important;
  box-shadow: 0 10px 28px rgba(31,48,73,.045) !important;
}

.lesson-page .quick-info {
  gap: 0 !important;
  overflow: hidden !important;
}

.lesson-page .quick-info article {
  min-height: 100px !important;
  border: 0 !important;
  border-right: 1px solid #edf1f5 !important;
  border-radius: 0 !important;
  background: #fff !important;
}

.lesson-page .quick-info article:last-child {
  border-right: 0 !important;
}

.lesson-page .quick-info span {
  color: var(--amv-muted) !important;
}

.lesson-page .quick-info strong {
  color: var(--amv-ink) !important;
}

.lesson-page .learning-path {
  scroll-margin-top: 150px !important;
}

/* GRID PRINCIPAL */
.lesson-page .lesson-layout {
  gap: 22px !important;
  grid-template-columns: minmax(0, 1fr) 315px !important;
  align-items: start !important;
}

.lesson-page .lesson-main {
  gap: 18px !important;
}

.lesson-page .content-section,
.lesson-page .academic-section,
.lesson-page .teacher-notes,
.lesson-page .sidebar-card,
.lesson-page .next-sidebar,
.lesson-page .unit-finished-sidebar {
  border: 1px solid var(--amv-line) !important;
  border-radius: 18px !important;
  background: #fff !important;
  box-shadow: 0 10px 30px rgba(31,48,73,.045) !important;
}

.lesson-page .content-section,
.lesson-page .academic-section {
  scroll-margin-top: 150px !important;
}

/* ENCABEZADOS */
.lesson-page .section-heading > div > span,
.lesson-page .sidebar-card__eyebrow {
  color: var(--amv-gold-dark) !important;
  letter-spacing: .08em !important;
}

.lesson-page .section-heading h2,
.lesson-page .content-section h2,
.lesson-page .sidebar-card h3 {
  color: var(--amv-ink) !important;
}

.lesson-page .section-heading p,
.lesson-page .content-section p,
.lesson-page .sidebar-description {
  color: var(--amv-muted) !important;
}

/* TARJETAS DE MATERIALES / ACTIVIDADES / EVALUACIONES */
.lesson-page .primary-material,
.lesson-page .resource-item,
.lesson-page .assignment-card,
.lesson-page .assessment-card {
  border-color: #e4eaf1 !important;
  background: #fbfcfe !important;
  box-shadow: none !important;
}

.lesson-page .resource-item:hover,
.lesson-page .assignment-card:hover,
.lesson-page .assessment-card:hover {
  border-color: #cfd9e5 !important;
  background: #fff !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 10px 24px rgba(31,48,73,.06) !important;
}

.lesson-page .material-button--primary,
.lesson-page .assessment-card__action,
.lesson-page .continue-button,
.lesson-page .complete-button {
  border-color: var(--amv-wine) !important;
  background: var(--amv-wine) !important;
  color: #fff !important;
}

.lesson-page .material-button--primary:hover,
.lesson-page .assessment-card__action:hover,
.lesson-page .continue-button:hover,
.lesson-page .complete-button:hover {
  background: var(--amv-wine-dark) !important;
}

/* SIDEBAR */
.lesson-page .lesson-sidebar {
  position: sticky !important;
  top: 150px !important;
  gap: 14px !important;
}

.lesson-page .sidebar-card {
  padding: 20px !important;
}

.lesson-page .sidebar-card--progress {
  background:
    radial-gradient(circle at 88% 5%, rgba(166,21,75,.08), transparent 32%),
    #fff !important;
}

.lesson-page .sidebar-progress-ring {
  border-color: #e7edf4 !important;
  background-color: #fff !important;
}

.lesson-page .sidebar-nav a {
  border-radius: 10px !important;
}

.lesson-page .sidebar-nav a:hover {
  background: #f7f9fc !important;
}

/* INFORMACIÓN */
.lesson-page .class-data article {
  border-color: #e4eaf1 !important;
  background: #f8fafc !important;
}

.lesson-page .class-data article span {
  color: var(--amv-muted) !important;
}

.lesson-page .class-data article strong {
  color: var(--amv-ink) !important;
}

/* NAVEGACIÓN ENTRE CLASES */
.lesson-page .lesson-navigation {
  gap: 12px !important;
  margin-top: 24px !important;
}

.lesson-page .lesson-navigation__item,
.lesson-page .lesson-navigation__program {
  border: 1px solid var(--amv-line) !important;
  border-radius: 16px !important;
  background: #fff !important;
  box-shadow: 0 8px 22px rgba(31,48,73,.04) !important;
}

/* RESPONSIVE · TABLET */
@media (max-width: 1100px) {
  .lesson-page .lesson-layout {
    grid-template-columns: 1fr !important;
  }

  .lesson-page .lesson-sidebar {
    position: static !important;
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0,1fr)) !important;
  }

  .lesson-page .lesson-hero {
    grid-template-columns: minmax(0,1fr) 120px !important;
  }
}

/* RESPONSIVE · MOBILE */
@media (max-width: 760px) {
  .lesson-page .lesson-topbar {
    align-items: flex-start !important;
    gap: 10px !important;
  }

  .lesson-page .teacher-actions {
    width: 100% !important;
    overflow-x: auto !important;
  }

  .lesson-page .unit-breadcrumb {
    gap: 6px !important;
    overflow-x: auto !important;
    white-space: nowrap !important;
  }

  .lesson-page .lesson-hero {
    min-height: 0 !important;
    grid-template-columns: 1fr !important;
    gap: 22px !important;
    padding: 28px 22px !important;
    border-radius: 18px 18px 0 0 !important;
    background-position: 67% center !important;
  }

  .lesson-page .lesson-hero::after {
    position: absolute;
    inset: 0;
    z-index: -1;
    background:
      linear-gradient(
        180deg,
        rgba(8,17,31,.76) 0%,
        rgba(8,17,31,.92) 55%,
        rgba(8,17,31,.98) 100%
      );
    content: '';
  }

  .lesson-page .lesson-hero h1 {
    max-width: 100% !important;
    font-size: clamp(2.45rem, 12vw, 4rem) !important;
    line-height: .98 !important;
  }

  .lesson-page .lesson-hero__description {
    font-size: .9rem !important;
    line-height: 1.62 !important;
  }

  .lesson-page .lesson-hero__aside {
    display: flex !important;
    min-width: 0 !important;
    align-items: center !important;
    justify-content: flex-start !important;
  }

  .lesson-page .lesson-number {
    width: 78px !important;
    height: 78px !important;
  }

  .lesson-page .lesson-number strong {
    font-size: 1.55rem !important;
  }

  .lesson-page .lesson-tabs {
    top: 66px !important;
    margin-bottom: 16px !important;
    border-radius: 0 0 14px 14px !important;
  }

  .lesson-page .lesson-tabs a {
    min-height: 40px !important;
    padding: 0 11px !important;
    font-size: .7rem !important;
  }

  .lesson-page .quick-info {
    grid-template-columns: repeat(2, minmax(0,1fr)) !important;
  }

  .lesson-page .quick-info article {
    min-height: 88px !important;
    border-right: 1px solid #edf1f5 !important;
    border-bottom: 1px solid #edf1f5 !important;
  }

  .lesson-page .lesson-sidebar {
    grid-template-columns: 1fr !important;
  }

  .lesson-page .content-section,
  .lesson-page .academic-section,
  .lesson-page .teacher-notes {
    padding: 18px !important;
    border-radius: 15px !important;
  }

  .lesson-page .primary-material {
    grid-template-columns: 1fr !important;
  }

  .lesson-page .lesson-navigation {
    grid-template-columns: 1fr !important;
  }

  .lesson-page .lesson-navigation__program {
    order: -1 !important;
  }
}

/* MOBILE PEQUEÑO */
@media (max-width: 480px) {
  .lesson-page .lesson-hero {
    padding: 24px 18px !important;
  }

  .lesson-page .lesson-hero h1 {
    font-size: 2.35rem !important;
  }

  .lesson-page .lesson-hero__meta span {
    padding: 7px 9px !important;
    font-size: .56rem !important;
  }

  .lesson-page .quick-info {
    grid-template-columns: 1fr 1fr !important;
  }

  .lesson-page .section-heading {
    gap: 10px !important;
  }

  .lesson-page .lesson-tabs {
    padding-inline: 8px !important;
  }
}


/* =========================================================
   V11 · AMO MI VOZ · MAX LEVEL / BLACKBOARD INSPIRED
   Light-first, accesible, profesional y cómodo para
   estudiantes, adultos mayores, niños y profesores.
========================================================= */

.lesson-page--max {
  --max-bg: #f3f6fa;
  --max-surface: #ffffff;
  --max-surface-soft: #f8fafc;
  --max-surface-tint: #fbfcfe;
  --max-ink: #152033;
  --max-copy: #344359;
  --max-muted: #6e7c91;
  --max-line: #dbe3ec;
  --max-line-strong: #c9d4e1;
  --max-wine: #9f1945;
  --max-wine-dark: #7e1236;
  --max-wine-soft: #fff2f6;
  --max-gold: #d7a81f;
  --max-gold-dark: #946c00;
  --max-gold-soft: #fff8e8;
  --max-green: #2c8b64;
  --max-green-soft: #edf8f3;
  --max-red: #bf4859;
  --max-blue: #3f6fa8;
  --max-shadow: 0 10px 28px rgba(31,48,73,.045);
  color: var(--max-ink) !important;
  background:
    radial-gradient(circle at 88% 2%, rgba(159,25,69,.04), transparent 22%),
    linear-gradient(180deg, #f7f9fc 0%, var(--max-bg) 100%) !important;
}

/* ---------- Accesibilidad base ---------- */
.lesson-page--max a,
.lesson-page--max button {
  min-height: 40px;
}

.lesson-page--max :focus-visible {
  outline: 3px solid rgba(159,25,69,.24) !important;
  outline-offset: 3px !important;
}

.lesson-page--max p,
.lesson-page--max li,
.lesson-page--max small,
.lesson-page--max span {
  text-rendering: optimizeLegibility;
}

.lesson-page--max .lesson-hero__description--readable {
  max-width: 830px !important;
}

/* ---------- Topbar ---------- */
.lesson-page--max .lesson-topbar {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  min-height: 56px !important;
  margin-bottom: 14px !important;
}

.lesson-page--max .back-link {
  color: var(--max-wine) !important;
  font-size: .84rem !important;
  font-weight: 850 !important;
}

.lesson-page--max .lesson-mode-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin-left: auto;
  padding: 8px 11px;
  border: 1px solid var(--max-line);
  border-radius: 999px;
  background: #fff;
  color: #56657a;
  font-size: .69rem;
  font-weight: 800;
  white-space: nowrap;
}

.lesson-page--max .lesson-mode-chip span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--max-green);
  box-shadow: 0 0 0 4px rgba(44,139,100,.10);
}

.lesson-page--max .lesson-mode-chip--teacher span {
  background: var(--max-gold);
  box-shadow: 0 0 0 4px rgba(215,168,31,.12);
}

.lesson-page--max .teacher-actions {
  margin-left: 0 !important;
}

.lesson-page--max .teacher-button {
  min-height: 42px !important;
  border: 1px solid var(--max-line) !important;
  border-radius: 11px !important;
  background: #fff !important;
  color: var(--max-copy) !important;
  font-size: .75rem !important;
  font-weight: 800 !important;
  box-shadow: none !important;
}

.lesson-page--max .teacher-button:hover {
  border-color: #b9c7d7 !important;
  background: #f9fbfd !important;
}

.lesson-page--max .teacher-button--primary {
  border-color: var(--max-wine) !important;
  background: var(--max-wine) !important;
  color: #fff !important;
}

/* ---------- Breadcrumb ---------- */
.lesson-page--max .unit-breadcrumb {
  margin-bottom: 14px !important;
  padding: 11px 14px !important;
  border: 1px solid var(--max-line) !important;
  border-radius: 12px !important;
  background: rgba(255,255,255,.96) !important;
  color: var(--max-muted) !important;
  box-shadow: 0 4px 14px rgba(31,48,73,.025) !important;
}

.lesson-page--max .unit-breadcrumb span:first-child {
  color: var(--max-gold-dark) !important;
  font-weight: 900 !important;
}

.lesson-page--max .unit-breadcrumb strong {
  color: var(--max-ink) !important;
}

/* ---------- Hero ---------- */
.lesson-page--max .lesson-hero {
  min-height: 405px !important;
  padding: clamp(30px,4vw,54px) !important;
  border: 1px solid rgba(255,255,255,.12) !important;
  border-radius: 22px 22px 0 0 !important;
  background-color: #111b2e !important;
  background-image:
    linear-gradient(
      90deg,
      rgba(10,18,31,.92) 0%,
      rgba(10,18,31,.82) 34%,
      rgba(10,18,31,.51) 64%,
      rgba(10,18,31,.58) 100%
    ),
    var(--lesson-cover-image) !important;
  background-size: cover !important;
  background-position: var(--lesson-cover-position, center) !important;
  box-shadow: 0 20px 46px rgba(30,45,68,.12) !important;
}

.lesson-page--max .lesson-hero::before {
  background:
    linear-gradient(180deg, rgba(11,20,34,.02), rgba(7,15,27,.18)),
    radial-gradient(circle at 75% 35%, rgba(159,25,69,.12), transparent 34%) !important;
}

.lesson-page--max .lesson-hero h1 {
  max-width: 790px !important;
  margin-top: 16px !important;
  color: #fff !important;
  font-size: clamp(2.8rem,5.5vw,5rem) !important;
  line-height: .98 !important;
  letter-spacing: -.05em !important;
}

.lesson-page--max .lesson-hero__eyebrow {
  color: #f0c443 !important;
  font-size: .72rem !important;
}

.lesson-page--max .lesson-hero__description {
  margin-top: 20px !important;
  color: rgba(255,255,255,.87) !important;
  font-size: clamp(.95rem,1.1vw,1.05rem) !important;
  line-height: 1.72 !important;
}

.lesson-page--max .lesson-hero__meta {
  gap: 8px !important;
  margin-top: 22px !important;
}

.lesson-page--max .lesson-hero__meta span {
  padding: 8px 11px !important;
  border: 1px solid rgba(255,255,255,.16) !important;
  border-radius: 10px !important;
  background: rgba(255,255,255,.10) !important;
  color: #fff !important;
  font-size: .66rem !important;
  backdrop-filter: blur(8px);
}

.lesson-page--max .lesson-number {
  width: 118px !important;
  height: 118px !important;
  border-color: rgba(236,193,59,.7) !important;
  background: rgba(255,255,255,.10) !important;
  backdrop-filter: blur(10px);
}

.lesson-page--max .lesson-number span {
  color: #f0c443 !important;
}

.lesson-page--max .lesson-number strong {
  color: #ffd95c !important;
}

/* ---------- Tabs tipo Blackboard ---------- */
.lesson-page--max .lesson-tabs {
  position: sticky !important;
  top: 76px !important;
  z-index: 45 !important;
  display: flex !important;
  gap: 2px !important;
  margin: 0 0 18px !important;
  padding: 7px 10px !important;
  overflow-x: auto !important;
  border: 1px solid var(--max-line) !important;
  border-top: 0 !important;
  border-radius: 0 0 16px 16px !important;
  background: rgba(255,255,255,.97) !important;
  box-shadow: 0 12px 26px rgba(31,48,73,.07) !important;
  backdrop-filter: blur(12px) !important;
  scrollbar-width: none;
}

.lesson-page--max .lesson-tabs::-webkit-scrollbar { display: none; }

.lesson-page--max .lesson-tabs a {
  min-height: 42px !important;
  padding: 0 13px !important;
  border-radius: 9px !important;
  color: #5b6980 !important;
  font-size: .72rem !important;
  font-weight: 800 !important;
  text-decoration: none !important;
}

.lesson-page--max .lesson-tabs a:first-child {
  background: var(--max-wine-soft) !important;
  color: var(--max-wine) !important;
}

.lesson-page--max .lesson-tabs a:hover {
  background: #f7f9fc !important;
  color: var(--max-ink) !important;
}

.lesson-page--max .lesson-tabs span {
  color: var(--max-gold-dark) !important;
  font-size: .59rem !important;
}

/* ---------- Resumen/progreso ---------- */
.lesson-page--max .learning-progress,
.lesson-page--max .quick-info,
.lesson-page--max .learning-path {
  border: 1px solid var(--max-line) !important;
  border-radius: 16px !important;
  background: #fff !important;
  color: var(--max-ink) !important;
  box-shadow: var(--max-shadow) !important;
}

.lesson-page--max .learning-progress {
  padding: 18px 20px !important;
}

.lesson-page--max .learning-progress__content > span {
  color: var(--max-gold-dark) !important;
}

.lesson-page--max .learning-progress h2,
.lesson-page--max .learning-progress strong,
.lesson-page--max .learning-path h2 {
  color: var(--max-ink) !important;
}

.lesson-page--max .learning-progress p,
.lesson-page--max .learning-path p {
  color: var(--max-muted) !important;
}

.lesson-page--max .quick-info {
  gap: 0 !important;
  overflow: hidden !important;
}

.lesson-page--max .quick-info article {
  min-height: 96px !important;
  padding: 17px 18px !important;
  border: 0 !important;
  border-right: 1px solid #edf1f5 !important;
  border-radius: 0 !important;
  background: #fff !important;
}

.lesson-page--max .quick-info article:last-child {
  border-right: 0 !important;
}

.lesson-page--max .quick-info span {
  color: #758297 !important;
  font-size: .61rem !important;
}

.lesson-page--max .quick-info strong {
  color: var(--max-gold-dark) !important;
}

.lesson-page--max .quick-info__text {
  color: var(--max-ink) !important;
}

/* ---------- Ruta de aprendizaje ---------- */
.lesson-page--max .learning-path {
  overflow: hidden !important;
  scroll-margin-top: 145px;
}

.lesson-page--max .learning-path__header {
  padding: 18px 20px !important;
  border-bottom: 1px solid #edf1f5 !important;
  background: #fbfcfe !important;
}

.lesson-page--max .learning-path__heading > div:last-child > span {
  color: var(--max-gold-dark) !important;
}

.lesson-page--max .learning-path__ring {
  background-color: #fff !important;
}

.lesson-page--max .learning-path__ring > span {
  color: var(--max-ink) !important;
}

.lesson-page--max .learning-path-item {
  min-height: 72px !important;
  padding: 13px 18px !important;
  border-bottom: 1px solid #edf1f5 !important;
  background: #fff !important;
}

.lesson-page--max .learning-path-item:last-child {
  border-bottom: 0 !important;
}

.lesson-page--max .learning-path-item__copy span {
  color: #748198 !important;
}

.lesson-page--max .learning-path-item__copy strong {
  color: var(--max-ink) !important;
  font-size: .82rem !important;
}

.lesson-page--max .learning-path-item__status {
  color: #56657a !important;
}

/* ---------- Centro docente ---------- */
.lesson-page--max .teacher-command {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-bottom: 18px;
  padding: 20px;
  border: 1px solid #eadca9;
  border-radius: 16px;
  background:
    radial-gradient(circle at 96% 8%, rgba(215,168,31,.10), transparent 26%),
    linear-gradient(135deg,#fff,#fffaf1);
  box-shadow: var(--max-shadow);
}

.lesson-page--max .teacher-command__copy > span {
  color: var(--max-gold-dark);
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .08em;
}

.lesson-page--max .teacher-command__copy h2 {
  margin: 5px 0 4px;
  color: var(--max-ink);
  font-size: 1.1rem;
}

.lesson-page--max .teacher-command__copy p {
  margin: 0;
  color: var(--max-muted);
  font-size: .78rem;
  line-height: 1.55;
}

.lesson-page--max .teacher-command__actions {
  display: flex;
  gap: 8px;
  flex: 0 0 auto;
}

.lesson-page--max .teacher-command__button {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border: 1px solid #d7dee7;
  border-radius: 10px;
  background: #fff;
  color: var(--max-copy);
  font-size: .72rem;
  font-weight: 800;
  text-decoration: none;
}

.lesson-page--max .teacher-command__button--primary {
  border-color: var(--max-wine);
  background: var(--max-wine);
  color: #fff;
}

/* ---------- Layout principal Blackboard ---------- */
.lesson-page--max .lesson-layout {
  grid-template-columns: minmax(0,1fr) 300px !important;
  gap: 18px !important;
  align-items: start !important;
}

.lesson-page--max .lesson-main {
  gap: 16px !important;
}

.lesson-page--max .content-section,
.lesson-page--max .academic-section,
.lesson-page--max .teacher-notes,
.lesson-page--max .sidebar-card,
.lesson-page--max .next-sidebar,
.lesson-page--max .unit-finished-sidebar {
  padding: 22px !important;
  border: 1px solid var(--max-line) !important;
  border-radius: 16px !important;
  background: #fff !important;
  color: var(--max-ink) !important;
  box-shadow: var(--max-shadow) !important;
}

.lesson-page--max .content-section,
.lesson-page--max .academic-section {
  scroll-margin-top: 145px !important;
}

.lesson-page--max .section-heading > div > span,
.lesson-page--max .sidebar-card__eyebrow,
.lesson-page--max .teacher-notes > header span {
  color: var(--max-gold-dark) !important;
  letter-spacing: .08em !important;
}

.lesson-page--max .section-heading h2,
.lesson-page--max .content-section h2,
.lesson-page--max .sidebar-card h3,
.lesson-page--max .teacher-notes h2,
.lesson-page--max .academic-section h2 {
  color: var(--max-ink) !important;
}

.lesson-page--max .section-heading p,
.lesson-page--max .content-section p,
.lesson-page--max .sidebar-description,
.lesson-page--max .academic-section p {
  color: var(--max-muted) !important;
}

.lesson-page--max .section-count {
  border-color: #e6d38f !important;
  background: var(--max-gold-soft) !important;
  color: var(--max-gold-dark) !important;
}

/* ---------- Materiales / tareas / evaluaciones ---------- */
.lesson-page--max .primary-material,
.lesson-page--max .resource-item,
.lesson-page--max .assignment-card,
.lesson-page--max .assessment-card,
.lesson-page--max .academic-block,
.lesson-page--max .teacher-note {
  border: 1px solid #e1e8f0 !important;
  border-radius: 13px !important;
  background: #fbfcfe !important;
  color: var(--max-ink) !important;
  box-shadow: none !important;
}

.lesson-page--max .primary-material {
  padding: 16px !important;
}

.lesson-page--max .primary-material__visual {
  border-color: #e7d699 !important;
  background: #fffaf0 !important;
}

.lesson-page--max .primary-material strong,
.lesson-page--max .resource-item strong,
.lesson-page--max .assignment-card strong,
.lesson-page--max .assessment-card strong,
.lesson-page--max .academic-block strong {
  color: var(--max-ink) !important;
}

.lesson-page--max .resource-item:hover,
.lesson-page--max .assignment-card:hover,
.lesson-page--max .assessment-card:hover {
  border-color: #cbd6e2 !important;
  background: #fff !important;
  box-shadow: 0 8px 20px rgba(31,48,73,.05) !important;
  transform: translateY(-1px);
}

.lesson-page--max .material-button {
  min-height: 40px !important;
  border-color: var(--max-line-strong) !important;
  background: #fff !important;
  color: var(--max-copy) !important;
}

.lesson-page--max .material-button--primary,
.lesson-page--max .assessment-card__action,
.lesson-page--max .continue-button,
.lesson-page--max .complete-button {
  border-color: var(--max-wine) !important;
  background: var(--max-wine) !important;
  color: #fff !important;
}

.lesson-page--max .material-button--primary:hover,
.lesson-page--max .assessment-card__action:hover,
.lesson-page--max .continue-button:hover,
.lesson-page--max .complete-button:hover {
  background: var(--max-wine-dark) !important;
}

/* ---------- Clases informativas ---------- */
.lesson-page--max .class-data article {
  border-color: #e1e8f0 !important;
  background: #f8fafc !important;
}

.lesson-page--max .class-data article span {
  color: #748198 !important;
}

.lesson-page--max .class-data article strong {
  color: var(--max-ink) !important;
}

/* ---------- Académico / notas profesor ---------- */
.lesson-page--max .academic-section,
.lesson-page--max .teacher-notes {
  background:
    radial-gradient(circle at 98% 3%, rgba(215,168,31,.06), transparent 25%),
    #fff !important;
}

.lesson-page--max .teacher-notes > header {
  border-bottom: 1px solid #edf1f5 !important;
}

.lesson-page--max .teacher-notes > header a {
  border-color: #e3ce80 !important;
  background: #fffaf0 !important;
  color: var(--max-gold-dark) !important;
}

/* ---------- Sidebar ---------- */
.lesson-page--max .lesson-sidebar {
  position: sticky !important;
  top: 145px !important;
  gap: 12px !important;
}

.lesson-page--max .sidebar-card {
  padding: 18px !important;
}

.lesson-page--max .sidebar-card--progress {
  background:
    radial-gradient(circle at 92% 4%, rgba(159,25,69,.06), transparent 30%),
    #fff !important;
}

.lesson-page--max .sidebar-progress-ring {
  background-color: #fff !important;
  border-color: #e3e9f0 !important;
}

.lesson-page--max .sidebar-progress-ring strong {
  color: var(--max-ink) !important;
}

.lesson-page--max .sidebar-nav a {
  border-radius: 10px !important;
  color: var(--max-copy) !important;
}

.lesson-page--max .sidebar-nav a:hover {
  background: #f7f9fc !important;
}

/* ---------- Completion ---------- */
.lesson-page--max .completion-section {
  border: 1px solid #e5d38f !important;
  border-radius: 16px !important;
  background: linear-gradient(135deg,#fff,#fffaf0) !important;
  color: var(--max-ink) !important;
}

.lesson-page--max .completion-section h2,
.lesson-page--max .completion-section strong {
  color: var(--max-ink) !important;
}

.lesson-page--max .completion-section p {
  color: var(--max-muted) !important;
}

/* ---------- Navegación inferior ---------- */
.lesson-page--max .lesson-navigation {
  gap: 10px !important;
  margin-top: 20px !important;
}

.lesson-page--max .lesson-navigation__item,
.lesson-page--max .lesson-navigation__program {
  border: 1px solid var(--max-line) !important;
  border-radius: 14px !important;
  background: #fff !important;
  color: var(--max-copy) !important;
  box-shadow: 0 7px 20px rgba(31,48,73,.035) !important;
}

.lesson-page--max .lesson-navigation__item:hover,
.lesson-page--max .lesson-navigation__program:hover {
  border-color: #cbd6e2 !important;
  background: #fbfcfe !important;
}

/* ---------- Tablet ---------- */
@media (max-width: 1100px) {
  .lesson-page--max .lesson-layout {
    grid-template-columns: 1fr !important;
  }

  .lesson-page--max .lesson-sidebar {
    position: static !important;
    display: grid !important;
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
  }

  .lesson-page--max .teacher-command {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* ---------- Mobile / niños / adultos mayores ---------- */
@media (max-width: 760px) {
  .lesson-page--max {
    font-size: 16px;
  }

  .lesson-page--max .lesson-topbar {
    align-items: flex-start !important;
    flex-wrap: wrap !important;
  }

  .lesson-page--max .lesson-mode-chip {
    margin-left: 0;
  }

  .lesson-page--max .teacher-actions {
    width: 100%;
    overflow-x: auto;
  }

  .lesson-page--max .unit-breadcrumb {
    overflow-x: auto;
    white-space: nowrap;
  }

  .lesson-page--max .lesson-hero {
    min-height: 0 !important;
    grid-template-columns: 1fr !important;
    gap: 20px !important;
    padding: 28px 22px !important;
    background-position: 68% center !important;
  }

  .lesson-page--max .lesson-hero::after {
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: inherit;
    background:
      linear-gradient(
        180deg,
        rgba(10,18,31,.55) 0%,
        rgba(10,18,31,.84) 55%,
        rgba(10,18,31,.94) 100%
      );
    content: '';
  }

  .lesson-page--max .lesson-hero h1 {
    font-size: clamp(2.35rem,11vw,3.6rem) !important;
  }

  .lesson-page--max .lesson-hero__description {
    font-size: .96rem !important;
    line-height: 1.65 !important;
  }

  .lesson-page--max .lesson-hero__aside {
    display: flex !important;
    align-items: center !important;
    justify-content: flex-start !important;
  }

  .lesson-page--max .lesson-number {
    width: 82px !important;
    height: 82px !important;
  }

  .lesson-page--max .lesson-tabs {
    top: 66px !important;
    border-radius: 0 0 13px 13px !important;
  }

  .lesson-page--max .lesson-tabs a {
    min-height: 44px !important;
    padding: 0 12px !important;
    font-size: .74rem !important;
  }

  .lesson-page--max .quick-info {
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
  }

  .lesson-page--max .quick-info article {
    min-height: 92px !important;
    border-right: 1px solid #edf1f5 !important;
    border-bottom: 1px solid #edf1f5 !important;
  }

  .lesson-page--max .teacher-command__actions {
    width: 100%;
    flex-direction: column;
  }

  .lesson-page--max .teacher-command__button {
    width: 100%;
  }

  .lesson-page--max .lesson-sidebar {
    grid-template-columns: 1fr !important;
  }

  .lesson-page--max .content-section,
  .lesson-page--max .academic-section,
  .lesson-page--max .teacher-notes,
  .lesson-page--max .sidebar-card {
    padding: 18px !important;
  }

  .lesson-page--max .primary-material {
    grid-template-columns: 1fr !important;
  }

  .lesson-page--max .lesson-navigation {
    grid-template-columns: 1fr !important;
  }

  .lesson-page--max .lesson-navigation__program {
    order: -1;
  }
}

@media (max-width: 480px) {
  .lesson-page--max .lesson-hero {
    padding: 24px 18px !important;
  }

  .lesson-page--max .lesson-hero h1 {
    font-size: 2.45rem !important;
  }

  .lesson-page--max .lesson-hero__meta {
    display: grid !important;
    grid-template-columns: repeat(2,minmax(0,1fr)) !important;
  }

  .lesson-page--max .lesson-hero__meta span {
    display: flex;
    justify-content: center;
    text-align: center;
  }

  .lesson-page--max .quick-info {
    grid-template-columns: 1fr 1fr !important;
  }
}


/* =========================================================
   V11.1 · PROGRESO DEL ALUMNO · REDISEÑO ACCESIBLE
========================================================= */

.lesson-page--max .student-progress-card {
  display: grid !important;
  gap: 16px !important;
  padding: 18px !important;
  overflow: hidden !important;
  background:
    radial-gradient(circle at 100% 0%, rgba(159,25,69,.055), transparent 32%),
    #fff !important;
}

.lesson-page--max .student-progress-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.lesson-page--max .student-progress-card__header > div {
  min-width: 0;
}

.lesson-page--max .student-progress-card__header .sidebar-card__eyebrow {
  display: block;
  margin-bottom: 5px;
}

.lesson-page--max .student-progress-card__header strong {
  display: block;
  color: var(--max-ink) !important;
  font-size: .83rem;
  line-height: 1.3;
}

.lesson-page--max .student-progress-card__state {
  display: inline-flex;
  min-height: 28px;
  align-items: center;
  flex: 0 0 auto;
  padding: 0 9px;
  border: 1px solid #ead898;
  border-radius: 999px;
  background: #fff9e9;
  color: #8e6900 !important;
  font-size: .6rem;
  font-weight: 900;
}

.lesson-page--max .student-progress-card__state--done {
  border-color: #bfe6d4;
  background: var(--max-green-soft);
  color: #217752 !important;
}

.lesson-page--max .student-progress-card__summary {
  display: grid;
  grid-template-columns: 88px minmax(0,1fr);
  gap: 14px;
  align-items: center;
}

.lesson-page--max .student-progress-card__percentage {
  display: grid;
  width: 88px;
  height: 88px;
  place-items: center;
  align-content: center;
  border: 1px solid #e5eaf0;
  border-radius: 22px;
  background:
    linear-gradient(145deg,#fff,#f8fafc);
  box-shadow:
    inset 0 0 0 6px #f4f6f9,
    0 8px 20px rgba(31,48,73,.04);
}

.lesson-page--max .student-progress-card__percentage strong {
  color: var(--max-wine) !important;
  font-size: 1.65rem;
  line-height: 1;
  letter-spacing: -.04em;
}

.lesson-page--max .student-progress-card__percentage span {
  margin-top: 4px;
  color: #7a8798 !important;
  font-size: .53rem;
  font-weight: 750;
}

.lesson-page--max .student-progress-card__copy {
  min-width: 0;
}

.lesson-page--max .student-progress-card__copy h3 {
  margin: 0 !important;
  color: var(--max-ink) !important;
  font-size: .92rem !important;
  line-height: 1.35 !important;
  letter-spacing: -.01em;
}

.lesson-page--max .student-progress-card__copy p {
  margin: 6px 0 0 !important;
  color: var(--max-muted) !important;
  font-size: .66rem !important;
  line-height: 1.5 !important;
}

.lesson-page--max .student-progress-card__track {
  display: grid;
  gap: 8px;
  padding-top: 2px;
}

.lesson-page--max .student-progress-card__track > div:first-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.lesson-page--max .student-progress-card__track span {
  color: #6e7c91 !important;
  font-size: .61rem;
  font-weight: 750;
}

.lesson-page--max .student-progress-card__track strong {
  color: var(--max-gold-dark) !important;
  font-size: .7rem;
}

.lesson-page--max .student-progress-card__bar {
  position: relative;
  height: 8px;
  overflow: hidden;
  border-radius: 999px;
  background: #edf1f5;
}

.lesson-page--max .student-progress-card__bar > span {
  display: block;
  height: 100%;
  min-width: 0;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      var(--max-wine),
      #c82f62
    );
  transition: width .35s ease;
}

.lesson-page--max .student-progress-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-top: 14px;
  border-top: 1px solid #edf1f5;
}

.lesson-page--max .student-progress-card__remaining {
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 9px;
}

.lesson-page--max .student-progress-card__remaining-icon {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 30px;
  place-items: center;
  border-radius: 9px;
  background: var(--max-wine-soft);
  color: var(--max-wine) !important;
  font-size: .8rem;
  font-weight: 900;
}

.lesson-page--max .student-progress-card__remaining-icon--done {
  background: var(--max-green-soft);
  color: var(--max-green) !important;
}

.lesson-page--max .student-progress-card__remaining p {
  min-width: 0;
  margin: 0 !important;
}

.lesson-page--max .student-progress-card__remaining strong,
.lesson-page--max .student-progress-card__remaining small {
  display: block;
}

.lesson-page--max .student-progress-card__remaining strong {
  color: var(--max-ink) !important;
  font-size: .65rem;
  line-height: 1.25;
}

.lesson-page--max .student-progress-card__remaining small {
  margin-top: 2px;
  color: #8390a1 !important;
  font-size: .55rem;
  line-height: 1.35;
}

.lesson-page--max .student-progress-card__continue {
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  flex: 0 0 auto;
  padding: 0 11px;
  border: 1px solid var(--max-wine);
  border-radius: 9px;
  background: var(--max-wine);
  color: #fff !important;
  font-size: .62rem;
  font-weight: 850;
  text-decoration: none;
}

.lesson-page--max .student-progress-card__continue:hover {
  background: var(--max-wine-dark);
}

@media (max-width: 1100px) {
  .lesson-page--max .student-progress-card {
    min-height: 100%;
  }
}

@media (max-width: 760px) {
  .lesson-page--max .student-progress-card {
    gap: 14px !important;
    padding: 17px !important;
  }

  .lesson-page--max .student-progress-card__summary {
    grid-template-columns: 78px minmax(0,1fr);
  }

  .lesson-page--max .student-progress-card__percentage {
    width: 78px;
    height: 78px;
    border-radius: 19px;
  }

  .lesson-page--max .student-progress-card__percentage strong {
    font-size: 1.45rem;
  }
}

@media (max-width: 420px) {
  .lesson-page--max .student-progress-card__footer {
    align-items: stretch;
    flex-direction: column;
  }

  .lesson-page--max .student-progress-card__continue {
    width: 100%;
    min-height: 44px;
  }
}

</style>
