<template>
  <section class="lesson-page">
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

          <p class="lesson-hero__description">
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
          <section class="content-section material-section">
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
          <section class="content-section">
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

                <RouterLink
                  :to="
                    isTeacher
                      ? `/aula/clase/${lesson.id}/trabajo#evaluaciones`
                      : isQuizCompleted(quiz)
                        ? '/aula/evaluaciones'
                        : `/aula/clase/${lesson.id}/evaluacion/${quiz.id}`
                  "
                  class="assessment-card__action"
                  @click="
                    !isTeacher &&
                    !isQuizCompleted(quiz) &&
                    handleQuizOpen(quiz)
                  "
                >
                  {{
                    isTeacher
                      ? 'Administrar'
                      : isQuizCompleted(quiz)
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
            class="sidebar-card sidebar-card--progress"
          >
            <span class="sidebar-card__eyebrow">
              MI PROGRESO
            </span>

            <div
              class="sidebar-progress-ring"
              :style="unitProgressRingStyle"
            >
              <div>
                <strong>
                  {{ unitProgress }}%
                </strong>

                <span>
                  unidad
                </span>
              </div>
            </div>

            <h3>
              {{ currentUnit.title }}
            </h3>

            <p class="sidebar-description">
              {{ unitCompletedLessons }}
              de {{ unitLessons.length }}
              clases completadas.
            </p>

            <div class="sidebar-progress">
              <div>
                <span>
                  Avance
                </span>

                <strong>
                  {{ unitProgress }}%
                </strong>
              </div>

              <div class="sidebar-progress__bar">
                <span
                  :style="{
                    width: `${unitProgress}%`
                  }"
                ></span>
              </div>
            </div>
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

    loadLesson()
  },
)

onMounted(() => {
  loadLesson()
})

onUnmounted(() => {
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
</style>
