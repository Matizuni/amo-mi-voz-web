<template>
  <section class="program">
    <!-- =====================================================
         HERO
    ====================================================== -->

    <header class="program-hero">
      <div class="program-hero__content">
        <div class="eyebrow">
          <span></span>
          Programa formativo
        </div>

        <h1>
          Canto, música
          <strong>e interpretación</strong>
        </h1>

        <p>
          Tu recorrido académico organizado en unidades,
          clases, materiales, actividades y progreso.
        </p>

        <div class="program-hero__meta">
          <span>
            Septiembre — Diciembre 2026
          </span>

          <span>
            Academia Amo Mi Voz
          </span>

          <span v-if="!isTeacher">
            Progreso personalizado
          </span>
        </div>
      </div>

      <!-- PROFESOR -->

      <aside
        v-if="isTeacher"
        class="hero-mode"
      >
        <div class="hero-mode__icon">
          AMV
        </div>

        <div>
          <span>
            MODO PROFESOR
          </span>

          <strong>
            Gestión académica
          </strong>

          <small>
            Administra la estructura,
            contenidos y sesiones del programa.
          </small>
        </div>
      </aside>

      <!-- ALUMNO -->

      <aside
        v-else
        class="student-progress-ring"
      >
        <div
          class="progress-ring"
          :style="progressRingStyle"
        >
          <div>
            <strong>
              {{ programProgress }}%
            </strong>

            <span>
              completado
            </span>
          </div>
        </div>

        <div>
          <span>
            MI PROGRESO
          </span>

          <strong>
            {{
              completedCount
            }}
            de
            {{
              programLessons.length
            }}
            clases
          </strong>

          <small>
            Tu avance se guarda automáticamente.
          </small>
        </div>
      </aside>
    </header>

    <!-- =====================================================
         LOADING
    ====================================================== -->

    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="loading-spinner"></div>

      <strong>
        Preparando tu programa
      </strong>

      <p>
        Estamos sincronizando unidades, clases
        y progreso desde Supabase.
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

      <h2>
        No pudimos cargar el programa
      </h2>

      <p>
        {{ loadError }}
      </p>

      <button
        type="button"
        @click="loadProgram"
      >
        Reintentar
      </button>
    </section>

    <!-- =====================================================
         PROGRAMA
    ====================================================== -->

    <template v-else>
      <!-- ===================================================
           ESTADÍSTICAS
      ==================================================== -->

      <section class="program-stats">
        <article class="stat-card">
          <span>
            Unidades
          </span>

          <strong>
            {{ visibleUnits.length }}
          </strong>

          <small>
            bloques formativos
          </small>
        </article>

        <article class="stat-card">
          <span>
            Clases
          </span>

          <strong>
            {{ programLessons.length }}
          </strong>

          <small>
            sesiones disponibles
          </small>
        </article>

        <article class="stat-card">
          <span>
            {{
              isTeacher
                ? 'Realizadas'
                : 'Completadas'
            }}
          </span>

          <strong>
            {{ completedCount }}
          </strong>

          <small>
            {{
              isTeacher
                ? 'sesiones marcadas como realizadas'
                : 'clases de tu recorrido'
            }}
          </small>
        </article>

        <article class="stat-card stat-card--progress">
          <div class="stat-progress__header">
            <div>
              <span>
                {{
                  isTeacher
                    ? 'Avance del programa'
                    : 'Mi progreso'
                }}
              </span>

              <small>
                {{
                  isTeacher
                    ? 'estado académico general'
                    : 'avance personal'
                }}
              </small>
            </div>

            <strong>
              {{ programProgress }}%
            </strong>
          </div>

          <div class="progress-bar">
            <span
              :style="{
                width: `${programProgress}%`
              }"
            ></span>
          </div>
        </article>
      </section>

      <!-- ===================================================
           CONTINUAR APRENDIENDO
           SOLO ALUMNO
      ==================================================== -->

      <section
        v-if="
          !isTeacher &&
          nextLesson
        "
        class="continue-learning"
      >
        <div class="continue-learning__icon">
          ▶
        </div>

        <div class="continue-learning__content">
          <span>
            CONTINUAR APRENDIENDO
          </span>

          <h2>
            {{ nextLesson.title }}
          </h2>

          <p>
            {{
              nextLesson.description ||
              'Continúa avanzando en tu programa formativo.'
            }}
          </p>

          <div class="continue-learning__meta">
            <span>
              {{
                getUnitName(
                  nextLesson.unitId
                )
              }}
            </span>

            <span v-if="nextLesson.date">
              {{ nextLesson.date }}
            </span>
          </div>
        </div>

        <RouterLink
          :to="`/aula/clase/${nextLesson.id}`"
          class="continue-learning__button"
        >
          Entrar a la clase
          <span>→</span>
        </RouterLink>
      </section>

      <!-- ===================================================
           PROGRAMA COMPLETADO
      ==================================================== -->

      <section
        v-if="
          !isTeacher &&
          programLessons.length &&
          programProgress === 100
        "
        class="completion-banner"
      >
        <div class="completion-banner__icon">
          ✓
        </div>

        <div>
          <span>
            PROGRAMA COMPLETADO
          </span>

          <h2>
            ¡Has completado todas las clases disponibles!
          </h2>

          <p>
            Tu progreso actual está registrado al 100%.
            Nuevas clases podrán incorporarse al programa
            más adelante.
          </p>
        </div>
      </section>

      <!-- ===================================================
           ADMIN PROFESOR
      ==================================================== -->

      <section
        v-if="isTeacher"
        class="admin-panel"
      >
        <div>
          <span>
            PANEL ACADÉMICO
          </span>

          <strong>
            Estructura del programa
          </strong>

          <p>
            Organiza unidades y clases manteniendo una
            ruta clara para tus estudiantes.
          </p>
        </div>

        <div class="admin-panel__actions">
          <button
            type="button"
            class="button button--secondary"
            @click="openCreateUnitModal"
          >
            <span>＋</span>
            Nueva unidad
          </button>

          <RouterLink
            to="/aula/clases/nueva"
            class="button button--primary"
          >
            <span>＋</span>
            Nueva clase
          </RouterLink>
        </div>
      </section>

      <!-- ===================================================
           VACÍO
      ==================================================== -->

      <section
        v-if="
          !visibleUnits.length &&
          !programLessons.length
        "
        class="empty-program"
      >
        <div class="empty-program__icon">
          ♪
        </div>

        <span>
          PROGRAMA FORMATIVO
        </span>

        <h2>
          {{
            isTeacher
              ? 'Construye tu experiencia educativa'
              : 'El programa está siendo preparado'
          }}
        </h2>

        <p>
          {{
            isTeacher
              ? 'Crea unidades formativas y organiza dentro de ellas las clases, materiales, actividades y evaluaciones.'
              : 'Pronto encontrarás aquí las unidades, materiales y actividades de tu formación.'
          }}
        </p>

        <div
          v-if="isTeacher"
          class="empty-program__actions"
        >
          <button
            type="button"
            class="button button--secondary"
            @click="openCreateUnitModal"
          >
            Crear primera unidad
          </button>

          <RouterLink
            to="/aula/clases/nueva"
            class="button button--primary"
          >
            Crear primera clase
          </RouterLink>
        </div>
      </section>

      <!-- ===================================================
           UNIDADES
      ==================================================== -->

      <section
        v-if="visibleUnits.length"
        class="units-section"
      >
        <header class="section-heading">
          <div>
            <span>
              RUTA DE APRENDIZAJE
            </span>

            <h2>
              Unidades formativas
            </h2>
          </div>

          <p>
            {{
              isTeacher
                ? 'Organiza las clases en bloques formativos claros y progresivos.'
                : 'Avanza clase a clase y registra tu progreso dentro de cada unidad.'
            }}
          </p>
        </header>

        <div class="units-list">
          <article
            v-for="(unit, unitIndex) in visibleUnits"
            :key="unit.id"
            class="unit-card"
            :class="{
              'unit-card--draft':
                unit.status === 'draft',

              'unit-card--completed':
                !isTeacher &&
                getUnitProgress(unit.id) === 100
            }"
          >
            <!-- =============================================
                 CABECERA
            ============================================== -->

            <header class="unit-header">
              <button
                type="button"
                class="unit-header__main"
                :aria-expanded="
                  !isUnitCollapsed(unit.id)
                "
                @click="toggleUnit(unit.id)"
              >
                <div class="unit-number">
                  {{
                    String(unitIndex + 1)
                      .padStart(2, '0')
                  }}
                </div>

                <div class="unit-title">
                  <div class="unit-title__eyebrow">
                    <span>
                      UNIDAD
                      {{ unitIndex + 1 }}
                    </span>

                    <span
                      v-if="isTeacher"
                      class="unit-status"
                      :class="
                        `unit-status--${unit.status}`
                      "
                    >
                      {{
                        getUnitStatusLabel(
                          unit.status
                        )
                      }}
                    </span>

                    <span
                      v-if="
                        !isTeacher &&
                        getUnitProgress(unit.id) === 100
                      "
                      class="unit-complete-badge"
                    >
                      ✓ COMPLETADA
                    </span>
                  </div>

                  <h3>
                    {{ unit.title }}
                  </h3>

                  <p v-if="unit.description">
                    {{ unit.description }}
                  </p>
                </div>

                <div class="collapse-button">
                  {{
                    isUnitCollapsed(unit.id)
                      ? '+'
                      : '−'
                  }}
                </div>
              </button>

              <!-- ===========================================
                   MÉTRICAS
              ============================================ -->

              <div class="unit-metrics">
                <article>
                  <span>
                    Clases
                  </span>

                  <strong>
                    {{
                      getLessonsForUnit(
                        unit.id
                      ).length
                    }}
                  </strong>
                </article>

                <article>
                  <span>
                    {{
                      isTeacher
                        ? 'Realizadas'
                        : 'Completadas'
                    }}
                  </span>

                  <strong>
                    {{
                      getCompletedLessonsForUnit(
                        unit.id
                      )
                    }}
                  </strong>
                </article>

                <article class="unit-progress">
                  <div>
                    <span>
                      {{
                        isTeacher
                          ? 'Avance'
                          : 'Mi progreso'
                      }}
                    </span>

                    <strong>
                      {{
                        getUnitProgress(
                          unit.id
                        )
                      }}%
                    </strong>
                  </div>

                  <div class="progress-bar">
                    <span
                      :style="{
                        width:
                          `${getUnitProgress(unit.id)}%`
                      }"
                    ></span>
                  </div>
                </article>
              </div>

              <!-- ===========================================
                   ADMIN UNIDAD
              ============================================ -->

              <footer
                v-if="isTeacher"
                class="unit-admin"
              >
                <button
                  type="button"
                  @click="openEditUnitModal(unit)"
                >
                  Editar unidad
                </button>

                <button
                  type="button"
                  class="danger-text"
                  @click="askDeleteUnit(unit)"
                >
                  Eliminar
                </button>
              </footer>
            </header>

            <!-- =============================================
                 CLASES
            ============================================== -->

            <Transition name="unit-content">
              <div
                v-if="
                  !isUnitCollapsed(unit.id)
                "
                class="unit-body"
              >
                <div
                  v-if="
                    getLessonsForUnit(unit.id)
                      .length
                  "
                  class="lessons-list"
                >
                  <article
                    v-for="(
                      lessonItem,
                      lessonIndex
                    ) in getLessonsForUnit(unit.id)"
                    :key="lessonItem.id"
                    class="lesson-card"
                    :class="{
                      'lesson-card--completed':
                        !isTeacher &&
                        isLessonCompleted(
                          lessonItem.id
                        )
                    }"
                  >
                    <!-- CLASE -->

                    <RouterLink
                      :to="
                        `/aula/clase/${lessonItem.id}`
                      "
                      class="lesson-card__main"
                    >
                      <div
                        class="lesson-index"
                        :class="{
                          'lesson-index--completed':
                            !isTeacher &&
                            isLessonCompleted(
                              lessonItem.id
                            )
                        }"
                      >
                        <span
                          v-if="
                            !isTeacher &&
                            isLessonCompleted(
                              lessonItem.id
                            )
                          "
                        >
                          ✓
                        </span>

                        <template v-else>
                          {{
                            String(
                              lessonIndex + 1
                            ).padStart(2, '0')
                          }}
                        </template>
                      </div>

                      <div class="lesson-content">
                        <div class="lesson-content__top">
                          <span class="lesson-date">
                            {{
                              lessonItem.date ||
                              'Fecha por definir'
                            }}
                          </span>

                          <span
                            class="lesson-status"
                            :class="
                              `lesson-status--${lessonItem.status}`
                            "
                          >
                            {{
                              getStatusLabel(
                                lessonItem.status
                              )
                            }}
                          </span>

                          <span
                            v-if="
                              !isTeacher &&
                              isLessonCompleted(
                                lessonItem.id
                              )
                            "
                            class="student-complete"
                          >
                            Completada
                          </span>
                        </div>

                        <h4>
                          {{ lessonItem.title }}
                        </h4>

                        <p>
                          {{
                            lessonItem.description ||
                            'Consulta los materiales y actividades de esta clase.'
                          }}
                        </p>

                        <div class="lesson-meta">
                          <span
                            v-if="lessonItem.time"
                          >
                            {{ lessonItem.time }}
                          </span>

                          <span
                            v-if="lessonItem.duration"
                          >
                            {{ lessonItem.duration }}
                          </span>

                          <span
                            v-if="lessonItem.modality"
                          >
                            {{ lessonItem.modality }}
                          </span>
                        </div>
                      </div>

                      <div class="lesson-arrow">
                        →
                      </div>
                    </RouterLink>

                    <!-- =====================================
                         PROGRESO ALUMNO
                    ====================================== -->

                    <footer
                      v-if="!isTeacher"
                      class="student-lesson-footer"
                    >
                      <div>
                        <span>
                          {{
                            isLessonCompleted(
                              lessonItem.id
                            )
                              ? 'CLASE COMPLETADA'
                              : 'PROGRESO PERSONAL'
                          }}
                        </span>

                        <small>
                          {{
                            isLessonCompleted(
                              lessonItem.id
                            )
                              ? 'Esta clase cuenta dentro de tu progreso.'
                              : 'Márcala cuando hayas revisado el contenido y terminado el trabajo.'
                          }}
                        </small>
                      </div>

                      <button
                        type="button"
                        class="completion-button"
                        :class="{
                          'completion-button--done':
                            isLessonCompleted(
                              lessonItem.id
                            )
                        }"
                        :disabled="
                          progressLoadingLessonId ===
                          lessonItem.id
                        "
                        @click="
                          toggleLessonProgress(
                            lessonItem
                          )
                        "
                      >
                        <span
                          v-if="
                            progressLoadingLessonId ===
                            lessonItem.id
                          "
                          class="button-spinner"
                        ></span>

                        <template v-else>
                          {{
                            isLessonCompleted(
                              lessonItem.id
                            )
                              ? '✓ Completada'
                              : 'Marcar como completada'
                          }}
                        </template>
                      </button>
                    </footer>

                    <!-- =====================================
                         ADMIN PROFESOR
                    ====================================== -->

                    <footer
                      v-else
                      class="lesson-admin"
                    >
                      <div class="lesson-admin__actions">
                        <RouterLink
                          :to="
                            `/aula/clase/${lessonItem.id}/editar`
                          "
                          class="lesson-admin-button lesson-admin-button--accent"
                        >
                          Editar
                        </RouterLink>

                        <RouterLink
                          :to="
                            `/aula/clase/${lessonItem.id}/trabajo`
                          "
                          class="lesson-admin-button"
                        >
                          Recursos y tareas
                        </RouterLink>

                        <button
                          type="button"
                          class="lesson-admin-button"
                          :disabled="
                            actionLoadingId ===
                            lessonItem.id
                          "
                          @click="
                            handleDuplicate(
                              lessonItem
                            )
                          "
                        >
                          {{
                            actionLoadingId ===
                            lessonItem.id
                              ? 'Procesando...'
                              : 'Duplicar'
                          }}
                        </button>

                        <button
                          type="button"
                          class="lesson-admin-button lesson-admin-button--danger"
                          :disabled="
                            actionLoadingId ===
                            lessonItem.id
                          "
                          @click="
                            askDeleteLesson(
                              lessonItem
                            )
                          "
                        >
                          Eliminar
                        </button>
                      </div>

                      <div class="lesson-unit-select">
                        <label
                          :for="
                            `lesson-unit-${lessonItem.id}`
                          "
                        >
                          Unidad
                        </label>

                        <select
                          :id="
                            `lesson-unit-${lessonItem.id}`
                          "
                          :value="
                            lessonItem.unitId ??
                            ''
                          "
                          :disabled="
                            assignmentLoadingId ===
                            lessonItem.id
                          "
                          @change="
                            handleUnitAssignment(
                              lessonItem,
                              $event.target.value
                            )
                          "
                        >
                          <option value="">
                            Sin unidad
                          </option>

                          <option
                            v-for="optionUnit in units"
                            :key="optionUnit.id"
                            :value="optionUnit.id"
                          >
                            {{ optionUnit.title }}
                          </option>
                        </select>
                      </div>
                    </footer>
                  </article>
                </div>

                <!-- SIN CLASES -->

                <section
                  v-else
                  class="unit-empty"
                >
                  <div>
                    +
                  </div>

                  <h4>
                    Esta unidad todavía
                    no tiene clases
                  </h4>

                  <p>
                    {{
                      isTeacher
                        ? 'Crea una clase nueva o asigna una existente a esta unidad.'
                        : 'El profesor todavía está preparando el contenido de esta unidad.'
                    }}
                  </p>

                  <RouterLink
                    v-if="isTeacher"
                    to="/aula/clases/nueva"
                  >
                    Crear clase
                  </RouterLink>
                </section>
              </div>
            </Transition>
          </article>
        </div>
      </section>

      <!-- ===================================================
           SIN UNIDAD
           PROFESOR
      ==================================================== -->

      <section
        v-if="
          isTeacher &&
          unassignedLessons.length
        "
        class="unassigned"
      >
        <header>
          <div>
            <span>
              ORGANIZACIÓN PENDIENTE
            </span>

            <h2>
              Clases sin unidad
            </h2>

            <p>
              Estas clases existen, pero todavía no forman
              parte de un bloque formativo.
            </p>
          </div>

          <strong>
            {{ unassignedLessons.length }}
          </strong>
        </header>

        <div class="unassigned-list">
          <article
            v-for="lessonItem in unassignedLessons"
            :key="lessonItem.id"
          >
            <div>
              <span>
                Clase {{ lessonItem.id }}
              </span>

              <strong>
                {{ lessonItem.title }}
              </strong>

              <small>
                {{
                  lessonItem.date ||
                  'Fecha por definir'
                }}
              </small>
            </div>

            <section>
              <select
                :value="
                  lessonItem.unitId ??
                  ''
                "
                :disabled="
                  assignmentLoadingId ===
                  lessonItem.id
                "
                @change="
                  handleUnitAssignment(
                    lessonItem,
                    $event.target.value
                  )
                "
              >
                <option value="">
                  Seleccionar unidad
                </option>

                <option
                  v-for="unit in units"
                  :key="unit.id"
                  :value="unit.id"
                >
                  {{ unit.title }}
                </option>
              </select>

              <RouterLink
                :to="
                  `/aula/clase/${lessonItem.id}/editar`
                "
              >
                Editar
              </RouterLink>
            </section>
          </article>
        </div>
      </section>
    </template>

    <!-- =====================================================
         MODAL UNIDAD
    ====================================================== -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="unitModalOpen"
          class="modal-backdrop"
          @click.self="closeUnitModal"
        >
          <article class="unit-modal">
            <header>
              <div>
                <span>
                  {{
                    editingUnit
                      ? 'EDITAR UNIDAD'
                      : 'NUEVA UNIDAD'
                  }}
                </span>

                <h2>
                  {{
                    editingUnit
                      ? 'Actualizar bloque formativo'
                      : 'Crear bloque formativo'
                  }}
                </h2>
              </div>

              <button
                type="button"
                class="modal-close"
                :disabled="isSavingUnit"
                @click="closeUnitModal"
              >
                ×
              </button>
            </header>

            <form
              class="unit-form"
              @submit.prevent="saveUnit"
            >
              <label>
                <span>
                  Nombre
                </span>

                <input
                  v-model.trim="unitForm.title"
                  type="text"
                  maxlength="120"
                  required
                  placeholder="Ej. Fundamentos de la voz"
                />
              </label>

              <label>
                <span>
                  Descripción
                </span>

                <textarea
                  v-model.trim="
                    unitForm.description
                  "
                  rows="5"
                  maxlength="700"
                  placeholder="Describe el propósito formativo de esta unidad."
                ></textarea>
              </label>

              <div class="unit-form__grid">
                <label>
                  <span>
                    Posición
                  </span>

                  <input
                    v-model.number="
                      unitForm.position
                    "
                    type="number"
                    min="1"
                    required
                  />
                </label>

                <label>
                  <span>
                    Estado
                  </span>

                  <select
                    v-model="
                      unitForm.status
                    "
                  >
                    <option value="published">
                      Publicada
                    </option>

                    <option value="draft">
                      Borrador
                    </option>
                  </select>
                </label>
              </div>

              <div class="unit-form__notice">
                <strong>
                  {{
                    unitForm.status === 'published'
                      ? 'Visible para estudiantes'
                      : 'Solo profesor'
                  }}
                </strong>

                <p>
                  {{
                    unitForm.status === 'published'
                      ? 'Los alumnos podrán ver esta unidad en su programa.'
                      : 'Puedes seguir preparando el contenido antes de publicarlo.'
                  }}
                </p>
              </div>

              <p
                v-if="unitFormError"
                class="form-error"
              >
                {{ unitFormError }}
              </p>

              <footer>
                <button
                  type="button"
                  class="button button--secondary"
                  :disabled="isSavingUnit"
                  @click="closeUnitModal"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  class="button button--primary"
                  :disabled="isSavingUnit"
                >
                  {{
                    isSavingUnit
                      ? 'Guardando...'
                      : editingUnit
                        ? 'Guardar cambios'
                        : 'Crear unidad'
                  }}
                </button>
              </footer>
            </form>
          </article>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         ELIMINAR UNIDAD
    ====================================================== -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="unitToDelete"
          class="modal-backdrop"
          @click.self="closeDeleteUnitModal"
        >
          <article class="delete-dialog">
            <div class="delete-dialog__icon">
              !
            </div>

            <span>
              ELIMINAR UNIDAD
            </span>

            <h2>
              ¿Eliminar esta unidad?
            </h2>

            <strong>
              {{ unitToDelete.title }}
            </strong>

            <p>
              Las clases no se eliminarán.
              Quedarán disponibles como clases sin unidad.
            </p>

            <div class="delete-dialog__warning">
              No se eliminarán materiales ni tareas de las clases.
            </div>

            <footer>
              <button
                type="button"
                class="cancel-delete"
                :disabled="isDeletingUnit"
                @click="closeDeleteUnitModal"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="confirm-delete"
                :disabled="isDeletingUnit"
                @click="confirmDeleteUnit"
              >
                {{
                  isDeletingUnit
                    ? 'Eliminando...'
                    : 'Eliminar unidad'
                }}
              </button>
            </footer>
          </article>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         ELIMINAR CLASE
    ====================================================== -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="lessonToDelete"
          class="modal-backdrop"
          @click.self="closeDeleteLessonModal"
        >
          <article class="delete-dialog">
            <div class="delete-dialog__icon">
              !
            </div>

            <span>
              ELIMINAR CLASE
            </span>

            <h2>
              ¿Eliminar esta clase?
            </h2>

            <strong>
              Clase {{ lessonToDelete.id }}
              · {{ lessonToDelete.title }}
            </strong>

            <p>
              La clase será eliminada de Supabase.
            </p>

            <div class="delete-dialog__warning">
              Revisa antes sus materiales, tareas
              y registros relacionados.
            </div>

            <footer>
              <button
                type="button"
                class="cancel-delete"
                :disabled="isDeletingLesson"
                @click="closeDeleteLessonModal"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="confirm-delete"
                :disabled="isDeletingLesson"
                @click="confirmDeleteLesson"
              >
                {{
                  isDeletingLesson
                    ? 'Eliminando...'
                    : 'Eliminar clase'
                }}
              </button>
            </footer>
          </article>
        </div>
      </Transition>
    </Teleport>

    <!-- =====================================================
         TOAST
    ====================================================== -->

    <Transition name="toast">
      <div
        v-if="toastMessage"
        class="program-toast"
        :class="{
          'program-toast--error':
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
                ? 'Ocurrió un problema'
                : 'Actualizado'
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
} from 'vue'

import {
  RouterLink,
  useRouter,
} from 'vue-router'

import {
  useAuth,
} from '@/composables/useAuth'

import {
  assignLessonToUnit,
  cloneLesson,
  fetchLessons,
  removeLesson,
} from '@/services/lessonService'

import {
  fetchUnits,
  insertUnit,
  removeUnit,
  updateUnit,
} from '@/services/unitService'

import {
  calculateOverallProgress,
  calculateUnitProgress,
  fetchProgressByStudent,
  markLessonCompleted,
  markLessonPending,
} from '@/services/lessonProgressService'

const router = useRouter()

const {
  currentUser,
  isTeacher,
  isStudent,
} = useAuth()

/* =========================================================
   ESTADO
========================================================= */

const lessons = ref([])
const units = ref([])

const studentProgress =
  ref([])

const isLoading = ref(true)

const loadError =
  ref('')

const actionLoadingId =
  ref(null)

const assignmentLoadingId =
  ref(null)

const progressLoadingLessonId =
  ref(null)

const collapsedUnitIds =
  ref([])

const lessonToDelete =
  ref(null)

const unitToDelete =
  ref(null)

const isDeletingLesson =
  ref(false)

const isDeletingUnit =
  ref(false)

const unitModalOpen =
  ref(false)

const editingUnit =
  ref(null)

const isSavingUnit =
  ref(false)

const unitFormError =
  ref('')

const unitForm =
  ref({
    title: '',
    description: '',
    position: 1,
    status: 'published',
  })

const toastMessage =
  ref('')

const toastType =
  ref('success')

let toastTimer =
  null

/* =========================================================
   ALUMNO ACTUAL
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
        currentUser.value
          ?.id,
      )

    return (
      Number.isFinite(id) &&
      id > 0
        ? id
        : null
    )
  })

/* =========================================================
   CARGA
========================================================= */

const loadProgram =
  async () => {
    isLoading.value =
      true

    loadError.value =
      ''

    try {
      const [
        unitsData,
        lessonsData,
      ] =
        await Promise.all([
          fetchUnits(),
          fetchLessons(),
        ])

      units.value =
        unitsData || []

      lessons.value =
        lessonsData || []

      /*
       * El profesor no necesita
       * progreso personal.
       */
      if (
        !isTeacher.value &&
        studentId.value
      ) {
        studentProgress.value =
          await fetchProgressByStudent(
            studentId.value,
          )
      } else {
        studentProgress.value =
          []
      }
    } catch (error) {
      console.error(
        'Error cargando programa:',
        error,
      )

      loadError.value =
        error?.message ||
        'No fue posible conectar con la base de datos.'
    } finally {
      isLoading.value =
        false
    }
  }

/* =========================================================
   UNIDADES VISIBLES
========================================================= */

const visibleUnits =
  computed(() => {
    if (
      isTeacher.value
    ) {
      return units.value
    }

    return units.value.filter(
      unit =>
        unit.status ===
        'published',
    )
  })

/* =========================================================
   CLASES DEL PROGRAMA
========================================================= */

const programLessons =
  computed(() => {
    if (
      isTeacher.value
    ) {
      return lessons.value
    }

    const visibleUnitIds =
      new Set(
        visibleUnits.value.map(
          unit =>
            Number(unit.id),
        ),
      )

    return lessons.value.filter(
      lesson =>
        lesson.unitId &&
        visibleUnitIds.has(
          Number(
            lesson.unitId,
          ),
        ),
    )
  })

const unassignedLessons =
  computed(() => {
    return lessons.value.filter(
      lesson =>
        !lesson.unitId,
    )
  })

/* =========================================================
   PROGRESO
========================================================= */

const isLessonCompleted =
  lessonId => {
    if (
      isTeacher.value
    ) {
      const lesson =
        lessons.value.find(
          item =>
            Number(item.id) ===
            Number(lessonId),
        )

      return (
        lesson?.status ===
        'completed'
      )
    }

    return studentProgress.value
      .some(
        row =>
          Number(
            row.lessonId,
          ) ===
            Number(
              lessonId,
            ) &&
          row.completed,
      )
  }

const completedCount =
  computed(() => {
    if (
      isTeacher.value
    ) {
      return programLessons.value
        .filter(
          lesson =>
            lesson.status ===
            'completed',
        )
        .length
    }

    return programLessons.value
      .filter(
        lesson =>
          isLessonCompleted(
            lesson.id,
          ),
      )
      .length
  })

const programProgress =
  computed(() => {
    if (
      isTeacher.value
    ) {
      if (
        !programLessons.value
          .length
      ) {
        return 0
      }

      return Math.round(
        (
          completedCount.value /
          programLessons.value.length
        ) *
          100,
      )
    }

    return calculateOverallProgress({
      lessons:
        programLessons.value,

      progressRows:
        studentProgress.value,
    }).percentage
  })

const progressRingStyle =
  computed(() => ({
    background:
      `conic-gradient(
        #ffc400 ${programProgress.value}%,
        rgba(255,255,255,.08) 0
      )`,
  }))

/* =========================================================
   SIGUIENTE CLASE
========================================================= */

const nextLesson =
  computed(() => {
    if (
      isTeacher.value
    ) {
      return null
    }

    return (
      programLessons.value.find(
        lesson =>
          !isLessonCompleted(
            lesson.id,
          ),
      ) ||
      null
    )
  })

/* =========================================================
   CLASES POR UNIDAD
========================================================= */

const getLessonsForUnit =
  unitId => {
    return programLessons.value
      .filter(
        lesson =>
          Number(
            lesson.unitId,
          ) ===
          Number(
            unitId,
          ),
      )
  }

const getCompletedLessonsForUnit =
  unitId => {
    return getLessonsForUnit(
      unitId,
    ).filter(
      lesson =>
        isLessonCompleted(
          lesson.id,
        ),
    ).length
  }

const getUnitProgress =
  unitId => {
    const unitLessons =
      getLessonsForUnit(
        unitId,
      )

    if (
      isTeacher.value
    ) {
      if (
        !unitLessons.length
      ) {
        return 0
      }

      return Math.round(
        (
          getCompletedLessonsForUnit(
            unitId,
          ) /
          unitLessons.length
        ) *
          100,
      )
    }

    return calculateUnitProgress({
      lessons:
        unitLessons,

      progressRows:
        studentProgress.value,
    }).percentage
  }

const getUnitName =
  unitId => {
    const unit =
      units.value.find(
        item =>
          Number(item.id) ===
          Number(unitId),
      )

    return unit
      ? `Unidad ${unit.position} · ${unit.title}`
      : 'Programa formativo'
  }

/* =========================================================
   TOGGLE PROGRESO
========================================================= */

const toggleLessonProgress =
  async lesson => {
    if (
      !lesson ||
      !studentId.value ||
      progressLoadingLessonId.value
    ) {
      return
    }

    progressLoadingLessonId.value =
      lesson.id

    const wasCompleted =
      isLessonCompleted(
        lesson.id,
      )

    try {
      if (
        wasCompleted
      ) {
        await markLessonPending({
          studentId:
            studentId.value,

          lessonId:
            lesson.id,
        })

        showToast(
          'La clase volvió a quedar pendiente.',
        )
      } else {
        await markLessonCompleted({
          studentId:
            studentId.value,

          lessonId:
            lesson.id,
        })

        showToast(
          'Clase completada. Tu progreso fue actualizado.',
        )
      }

      studentProgress.value =
        await fetchProgressByStudent(
          studentId.value,
        )
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
      progressLoadingLessonId.value =
        null
    }
  }

/* =========================================================
   COLAPSAR UNIDADES
========================================================= */

const isUnitCollapsed =
  unitId => {
    return collapsedUnitIds.value
      .includes(
        Number(unitId),
      )
  }

const toggleUnit =
  unitId => {
    const id =
      Number(unitId)

    if (
      collapsedUnitIds.value
        .includes(id)
    ) {
      collapsedUnitIds.value =
        collapsedUnitIds.value
          .filter(
            currentId =>
              currentId !== id,
          )
    } else {
      collapsedUnitIds.value = [
        ...collapsedUnitIds.value,
        id,
      ]
    }
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
    }

    return (
      labels[status] ||
      'Disponible'
    )
  }

const getUnitStatusLabel =
  status => {
    const labels = {
      published:
        'Publicada',

      draft:
        'Borrador',
    }

    return (
      labels[status] ||
      'Publicada'
    )
  }

/* =========================================================
   BODY LOCK
========================================================= */

const lockBody = () => {
  document.body.style
    .overflow = 'hidden'
}

const unlockBody = () => {
  document.body.style
    .overflow = ''
}

/* =========================================================
   UNIDADES
========================================================= */

const getNextUnitPosition =
  () => {
    if (
      !units.value.length
    ) {
      return 1
    }

    return (
      Math.max(
        ...units.value.map(
          unit =>
            Number(
              unit.position ||
              0,
            ),
        ),
      ) + 1
    )
  }

const resetUnitForm =
  () => {
    unitForm.value = {
      title: '',
      description: '',
      position:
        getNextUnitPosition(),
      status:
        'published',
    }

    unitFormError.value =
      ''
  }

const openCreateUnitModal =
  () => {
    editingUnit.value =
      null

    resetUnitForm()

    unitModalOpen.value =
      true

    lockBody()
  }

const openEditUnitModal =
  unit => {
    editingUnit.value =
      unit

    unitForm.value = {
      title:
        unit.title || '',

      description:
        unit.description || '',

      position:
        Number(
          unit.position ||
          1,
        ),

      status:
        unit.status ||
        'published',
    }

    unitFormError.value =
      ''

    unitModalOpen.value =
      true

    lockBody()
  }

const closeUnitModal =
  () => {
    if (
      isSavingUnit.value
    ) {
      return
    }

    unitModalOpen.value =
      false

    editingUnit.value =
      null

    unitFormError.value =
      ''

    unlockBody()
  }

const saveUnit =
  async () => {
    if (
      isSavingUnit.value
    ) {
      return
    }

    const title =
      unitForm.value
        .title
        .trim()

    if (!title) {
      unitFormError.value =
        'Escribe un nombre para la unidad.'

      return
    }

    if (
      !unitForm.value.position ||
      unitForm.value.position < 1
    ) {
      unitFormError.value =
        'La posición debe ser mayor o igual a 1.'

      return
    }

    isSavingUnit.value =
      true

    unitFormError.value =
      ''

    try {
      const payload = {
        title,

        description:
          unitForm.value
            .description
            .trim(),

        position:
          Number(
            unitForm.value
              .position,
          ),

        status:
          unitForm.value
            .status,
      }

      if (
        editingUnit.value
      ) {
        await updateUnit(
          editingUnit.value.id,
          payload,
        )

        showToast(
          'Unidad actualizada correctamente.',
        )
      } else {
        await insertUnit(
          payload,
        )

        showToast(
          'Unidad creada correctamente.',
        )
      }

      unitModalOpen.value =
        false

      editingUnit.value =
        null

      unlockBody()

      await loadProgram()
    } catch (error) {
      console.error(
        'Error guardando unidad:',
        error,
      )

      unitFormError.value =
        error?.message ||
        'No fue posible guardar la unidad.'
    } finally {
      isSavingUnit.value =
        false
    }
  }

/* =========================================================
   ELIMINAR UNIDAD
========================================================= */

const askDeleteUnit =
  unit => {
    unitToDelete.value =
      unit

    lockBody()
  }

const closeDeleteUnitModal =
  () => {
    if (
      isDeletingUnit.value
    ) {
      return
    }

    unitToDelete.value =
      null

    unlockBody()
  }

const confirmDeleteUnit =
  async () => {
    const unit =
      unitToDelete.value

    if (
      !unit ||
      isDeletingUnit.value
    ) {
      return
    }

    isDeletingUnit.value =
      true

    try {
      await removeUnit(
        unit.id,
      )

      unitToDelete.value =
        null

      unlockBody()

      await loadProgram()

      showToast(
        'Unidad eliminada. Sus clases quedaron sin unidad.',
      )
    } catch (error) {
      console.error(
        'Error eliminando unidad:',
        error,
      )

      showToast(
        error?.message ||
        'No fue posible eliminar la unidad.',
        'error',
      )
    } finally {
      isDeletingUnit.value =
        false
    }
  }

/* =========================================================
   ASIGNAR CLASE
========================================================= */

const handleUnitAssignment =
  async (
    lesson,
    selectedValue,
  ) => {
    if (
      !lesson ||
      assignmentLoadingId.value
    ) {
      return
    }

    assignmentLoadingId.value =
      lesson.id

    try {
      const unitId =
        selectedValue === ''
          ? null
          : Number(
              selectedValue,
            )

      await assignLessonToUnit(
        lesson.id,
        unitId,
      )

      await loadProgram()

      showToast(
        unitId
          ? 'Clase asignada a la unidad.'
          : 'La clase quedó sin unidad.',
      )
    } catch (error) {
      console.error(
        'Error asignando unidad:',
        error,
      )

      showToast(
        error?.message ||
        'No fue posible mover la clase.',
        'error',
      )
    } finally {
      assignmentLoadingId.value =
        null
    }
  }

/* =========================================================
   DUPLICAR
========================================================= */

const handleDuplicate =
  async lesson => {
    if (
      !lesson ||
      actionLoadingId.value
    ) {
      return
    }

    actionLoadingId.value =
      lesson.id

    try {
      const duplicated =
        await cloneLesson(
          lesson,
        )

      await loadProgram()

      showToast(
        `Clase duplicada como Clase ${duplicated.id}.`,
      )

      setTimeout(() => {
        router.push(
          `/aula/clase/${duplicated.id}/editar`,
        )
      }, 450)
    } catch (error) {
      console.error(
        'Error duplicando clase:',
        error,
      )

      showToast(
        error?.message ||
        'No fue posible duplicar la clase.',
        'error',
      )
    } finally {
      actionLoadingId.value =
        null
    }
  }

/* =========================================================
   ELIMINAR CLASE
========================================================= */

const askDeleteLesson =
  lesson => {
    lessonToDelete.value =
      lesson

    lockBody()
  }

const closeDeleteLessonModal =
  () => {
    if (
      isDeletingLesson.value
    ) {
      return
    }

    lessonToDelete.value =
      null

    unlockBody()
  }

const confirmDeleteLesson =
  async () => {
    const lesson =
      lessonToDelete.value

    if (
      !lesson ||
      isDeletingLesson.value
    ) {
      return
    }

    isDeletingLesson.value =
      true

    try {
      await removeLesson(
        lesson.id,
      )

      lessonToDelete.value =
        null

      unlockBody()

      await loadProgram()

      showToast(
        `Clase ${lesson.id} eliminada correctamente.`,
      )
    } catch (error) {
      console.error(
        'Error eliminando clase:',
        error,
      )

      showToast(
        error?.message ||
        'No fue posible eliminar la clase.',
        'error',
      )
    } finally {
      isDeletingLesson.value =
        false
    }
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
   ESCAPE
========================================================= */

const handleEscape =
  event => {
    if (
      event.key !==
      'Escape'
    ) {
      return
    }

    if (
      unitModalOpen.value
    ) {
      closeUnitModal()
      return
    }

    if (
      unitToDelete.value
    ) {
      closeDeleteUnitModal()
      return
    }

    if (
      lessonToDelete.value
    ) {
      closeDeleteLessonModal()
    }
  }

/* =========================================================
   MOUNT
========================================================= */

onMounted(() => {
  loadProgram()

  window.addEventListener(
    'keydown',
    handleEscape,
  )
})

onUnmounted(() => {
  clearTimeout(
    toastTimer,
  )

  window.removeEventListener(
    'keydown',
    handleEscape,
  )

  unlockBody()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.program {
  width: 100%;
  max-width: 1320px;
  margin: 0 auto;
  padding-bottom: 5rem;
}

/* =========================================================
   HERO
========================================================= */

.program-hero {
  position: relative;
  display: grid;
  gap: 2rem;
  grid-template-columns:
    minmax(0, 1fr)
    340px;
  align-items: end;
  margin-bottom: 1.2rem;
  padding: 2.5rem;
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 88% 10%,
      rgba(255, 196, 0, 0.14),
      transparent 32%
    ),
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.025),
      transparent
    ),
    variables.$color-surface;
}

.program-hero::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 115px;
  height: 3px;
  background:
    variables.$color-primary;
  content: '';
}

.program-hero__content {
  position: relative;
  z-index: 1;
}

.eyebrow {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  margin-bottom: 1rem;
  color:
    variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 900;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.eyebrow > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background:
    variables.$color-primary;
  box-shadow:
    0 0 0 5px
    rgba(255, 196, 0, 0.08);
}

.program-hero h1 {
  max-width: 850px;
  margin: 0;
  font-size:
    clamp(
      2.8rem,
      6vw,
      5.4rem
    );
  line-height: 0.94;
  letter-spacing: -0.045em;
}

.program-hero h1 strong {
  display: block;
  color:
    variables.$color-primary;
}

.program-hero__content > p {
  max-width: 680px;
  margin:
    1.25rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.55);
  line-height: 1.7;
}

.program-hero__meta {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-top: 1.35rem;
}

.program-hero__meta span {
  padding:
    0.36rem
    0.6rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.62rem;
}

/* =========================================================
   HERO MODE
========================================================= */

.hero-mode {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 0.9rem;
  padding: 1.1rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.28);
  border-radius: 16px;
  background:
    rgba(255, 196, 0, 0.035);
}

.hero-mode__icon {
  display: grid;
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 12px;
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
}

.hero-mode span,
.hero-mode strong,
.hero-mode small {
  display: block;
}

.hero-mode span {
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.hero-mode strong {
  margin-top: 0.15rem;
  font-size: 0.8rem;
}

.hero-mode small {
  margin-top: 0.2rem;
  color:
    rgba(255, 255, 255, 0.34);
  font-size: 0.61rem;
  line-height: 1.45;
}

/* =========================================================
   STUDENT PROGRESS
========================================================= */

.student-progress-ring {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.28);
  border-radius: 17px;
  background:
    rgba(255, 196, 0, 0.035);
}

.progress-ring {
  display: grid;
  width: 96px;
  height: 96px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
}

.progress-ring > div {
  display: grid;
  width: 78px;
  height: 78px;
  place-items: center;
  align-content: center;
  border-radius: 50%;
  background:
    variables.$color-surface;
}

.progress-ring strong {
  color:
    variables.$color-primary;
  font-size: 1.25rem;
}

.progress-ring span {
  margin-top: 0.1rem;
  color:
    rgba(255, 255, 255, 0.34);
  font-size: 0.53rem;
}

.student-progress-ring > div:last-child > span,
.student-progress-ring > div:last-child > strong,
.student-progress-ring > div:last-child > small {
  display: block;
}

.student-progress-ring > div:last-child > span {
  color:
    variables.$color-primary;
  font-size: 0.54rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.student-progress-ring > div:last-child > strong {
  margin-top: 0.2rem;
  font-size: 0.75rem;
}

.student-progress-ring > div:last-child > small {
  margin-top: 0.18rem;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.57rem;
}

/* =========================================================
   STATES
========================================================= */

.state-card {
  display: grid;
  min-height: 390px;
  gap: 0.7rem;
  place-items: center;
  align-content: center;
  padding: 2rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 20px;
  background:
    variables.$color-surface;
  text-align: center;
}

.state-card p {
  max-width: 520px;
  margin: 0;
  color:
    rgba(255, 255, 255, 0.4);
}

.state-card button {
  margin-top: 0.5rem;
  padding:
    0.65rem
    0.85rem;
  border: 0;
  border-radius: 9px;
  background:
    variables.$color-primary;
  color: #070707;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 800;
  cursor: pointer;
}

.state-card__icon {
  display: grid;
  width: 55px;
  height: 55px;
  place-items: center;
  border:
    1px solid #ff7474;
  border-radius: 50%;
  color: #ff7474;
}

.loading-spinner {
  width: 44px;
  height: 44px;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   STATS
========================================================= */

.program-stats {
  display: grid;
  gap: 0.7rem;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    )
    minmax(260px, 1.5fr);
  margin-bottom: 1rem;
}

.stat-card {
  min-height: 130px;
  padding: 1.15rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 16px;
  background:
    variables.$color-surface;
}

.stat-card > span {
  display: block;
  color:
    rgba(255, 255, 255, 0.36);
  font-size: 0.64rem;
}

.stat-card > strong {
  display: block;
  margin-top: 0.45rem;
  color:
    variables.$color-primary;
  font-size: 1.9rem;
}

.stat-card > small {
  display: block;
  margin-top: 0.35rem;
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.6rem;
}

.stat-card--progress {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.stat-progress__header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.stat-progress__header span,
.stat-progress__header small {
  display: block;
}

.stat-progress__header span {
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.64rem;
}

.stat-progress__header small {
  margin-top: 0.15rem;
  color:
    rgba(255, 255, 255, 0.25);
  font-size: 0.57rem;
}

.stat-progress__header strong {
  color:
    variables.$color-primary;
  font-size: 1.35rem;
}

/* =========================================================
   PROGRESS BAR
========================================================= */

.progress-bar {
  width: 100%;
  height: 5px;
  margin-top: 0.7rem;
  overflow: hidden;
  border-radius: 999px;
  background:
    rgba(255, 255, 255, 0.07);
}

.progress-bar > span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      variables.$color-primary,
      #ffe378
    );
  transition:
    width 0.35s ease;
}

/* =========================================================
   CONTINUE
========================================================= */

.continue-learning {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1.25rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.32);
  border-radius: 17px;
  background:
    linear-gradient(
      100deg,
      rgba(255, 196, 0, 0.055),
      transparent
    ),
    variables.$color-surface;
}

.continue-learning__icon {
  display: grid;
  width: 50px;
  height: 50px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.continue-learning__content > span {
  color:
    variables.$color-primary;
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.continue-learning h2 {
  margin:
    0.25rem
    0
    0;
  font-size: 1.15rem;
}

.continue-learning p {
  max-width: 650px;
  margin:
    0.35rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.69rem;
}

.continue-learning__meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.55rem;
}

.continue-learning__meta span {
  padding:
    0.3rem
    0.48rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.34);
  font-size: 0.56rem;
}

.continue-learning__button {
  display: inline-flex;
  min-height: 42px;
  gap: 0.5rem;
  align-items: center;
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 10px;
  background:
    variables.$color-primary;
  color: #070707;
  font-size: 0.65rem;
  font-weight: 900;
  text-decoration: none;
}

/* =========================================================
   COMPLETE BANNER
========================================================= */

.completion-banner {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1.25rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 17px;
  background:
    rgba(255, 196, 0, 0.05);
}

.completion-banner__icon {
  display: grid;
  width: 55px;
  height: 55px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color: #070707;
  font-size: 1.2rem;
  font-weight: 900;
}

.completion-banner span {
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
}

.completion-banner h2 {
  margin:
    0.2rem
    0
    0;
  font-size: 1rem;
}

.completion-banner p {
  margin:
    0.25rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.65rem;
}

/* =========================================================
   ADMIN
========================================================= */

.admin-panel {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2.5rem;
  padding: 1.2rem 1.3rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.22);
  border-radius: 17px;
  background:
    rgba(255, 196, 0, 0.025);
}

.admin-panel > div:first-child > span,
.admin-panel > div:first-child > strong {
  display: block;
}

.admin-panel > div:first-child > span {
  color:
    variables.$color-primary;
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.admin-panel > div:first-child > strong {
  margin-top: 0.15rem;
  font-size: 0.82rem;
}

.admin-panel p {
  margin:
    0.25rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.36);
  font-size: 0.66rem;
}

.admin-panel__actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

/* =========================================================
   BUTTONS
========================================================= */

.button {
  display: inline-flex;
  min-height: 42px;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  padding:
    0.65rem
    0.8rem;
  border-radius: 10px;
  font: inherit;
  font-size: 0.68rem;
  font-weight: 900;
  text-decoration: none;
  cursor: pointer;
}

.button--primary {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #070707;
}

.button--secondary {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
}

/* =========================================================
   EMPTY
========================================================= */

.empty-program {
  display: grid;
  min-height: 370px;
  place-items: center;
  align-content: center;
  padding: 2rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 20px;
  text-align: center;
}

.empty-program__icon {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 1.2rem;
}

.empty-program > span {
  margin-top: 1rem;
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
}

.empty-program h2 {
  max-width: 600px;
  margin:
    0.35rem
    0
    0;
}

.empty-program > p {
  max-width: 600px;
  color:
    rgba(255, 255, 255, 0.4);
  line-height: 1.6;
}

.empty-program__actions {
  display: flex;
  gap: 0.5rem;
}

/* =========================================================
   HEADING
========================================================= */

.section-heading {
  display: flex;
  gap: 2rem;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 1.2rem;
}

.section-heading span {
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.section-heading h2 {
  margin:
    0.3rem
    0
    0;
  font-size:
    clamp(
      1.65rem,
      4vw,
      2.4rem
    );
}

.section-heading > p {
  max-width: 430px;
  margin: 0;
  color:
    rgba(255, 255, 255, 0.38);
  font-size: 0.72rem;
  line-height: 1.55;
}

/* =========================================================
   UNITS
========================================================= */

.units-list {
  display: grid;
  gap: 1rem;
}

.unit-card {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 20px;
  background:
    variables.$color-surface;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.unit-card:hover {
  border-color:
    rgba(255, 196, 0, 0.28);
}

.unit-card--draft {
  border-style: dashed;
}

.unit-card--completed {
  border-color:
    rgba(255, 196, 0, 0.38);
  box-shadow:
    inset 3px 0
    variables.$color-primary;
}

.unit-header__main {
  display: grid;
  width: 100%;
  gap: 1rem;
  grid-template-columns:
    65px
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1.45rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.unit-number {
  color:
    variables.$color-primary;
  font-size: 2rem;
  font-weight: 900;
}

.unit-title__eyebrow {
  display: flex;
  gap: 0.45rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.3rem;
}

.unit-title__eyebrow > span:first-child {
  color:
    rgba(255, 255, 255, 0.34);
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.unit-title h3 {
  margin: 0;
  font-size:
    clamp(
      1.2rem,
      3vw,
      1.65rem
    );
}

.unit-title p {
  max-width: 760px;
  margin:
    0.45rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.42);
  font-size: 0.72rem;
  line-height: 1.5;
}

.collapse-button {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  color:
    variables.$color-primary;
}

.unit-status,
.unit-complete-badge {
  padding:
    0.25rem
    0.45rem;
  border-radius: 999px;
  font-size: 0.53rem;
  font-weight: 900;
}

.unit-status--published,
.unit-complete-badge {
  border:
    1px solid
    rgba(255, 196, 0, 0.34);
  color:
    variables.$color-primary;
}

.unit-status--draft {
  border:
    1px solid
    variables.$color-border;
  color:
    rgba(255, 255, 255, 0.35);
}

/* =========================================================
   UNIT METRICS
========================================================= */

.unit-metrics {
  display: grid;
  gap: 0.8rem;
  grid-template-columns:
    110px
    110px
    minmax(180px, 1fr);
  padding:
    0.9rem
    1.45rem;
  border-top:
    1px solid
    variables.$color-border;
  background:
    rgba(0, 0, 0, 0.12);
}

.unit-metrics article {
  padding-right: 0.8rem;
  border-right:
    1px solid
    variables.$color-border;
}

.unit-metrics article:last-child {
  padding-right: 0;
  border-right: 0;
}

.unit-metrics span,
.unit-metrics strong {
  display: block;
}

.unit-metrics span {
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.58rem;
}

.unit-metrics strong {
  margin-top: 0.15rem;
  color:
    variables.$color-primary;
  font-size: 0.95rem;
}

.unit-progress > div:first-child {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.unit-progress > div:first-child strong {
  margin: 0;
}

/* =========================================================
   UNIT ADMIN
========================================================= */

.unit-admin {
  display: flex;
  gap: 0.4rem;
  justify-content: flex-end;
  padding:
    0.65rem
    1.45rem;
  border-top:
    1px solid
    variables.$color-border;
}

.unit-admin button {
  padding:
    0.45rem
    0.6rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  background: transparent;
  color:
    rgba(255, 255, 255, 0.55);
  font: inherit;
  font-size: 0.61rem;
  font-weight: 800;
  cursor: pointer;
}

.unit-admin .danger-text {
  color: #ff7777;
}

/* =========================================================
   UNIT BODY
========================================================= */

.unit-body {
  padding: 1rem;
  border-top:
    1px solid
    variables.$color-border;
  background:
    rgba(0, 0, 0, 0.18);
}

.lessons-list {
  display: grid;
  gap: 0.65rem;
}

/* =========================================================
   LESSON CARD
========================================================= */

.lesson-card {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 14px;
  background:
    variables.$color-background;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;
}

.lesson-card:hover {
  border-color:
    rgba(255, 196, 0, 0.34);
  transform:
    translateY(-1px);
}

.lesson-card--completed {
  border-color:
    rgba(255, 196, 0, 0.3);
}

.lesson-card__main {
  display: grid;
  gap: 0.9rem;
  grid-template-columns:
    46px
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1rem;
  color: inherit;
  text-decoration: none;
}

.lesson-index {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border:
    1px solid
    rgba(255, 196, 0, 0.25);
  border-radius: 11px;
  color:
    variables.$color-primary;
  font-size: 0.7rem;
  font-weight: 900;
}

.lesson-index--completed {
  background:
    variables.$color-primary;
  color: #070707;
}

.lesson-content__top {
  display: flex;
  gap: 0.4rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.3rem;
}

.lesson-date {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 800;
  text-transform: uppercase;
}

.lesson-status,
.student-complete {
  padding:
    0.22rem
    0.4rem;
  border-radius: 999px;
  font-size: 0.52rem;
  font-weight: 800;
}

.lesson-status--published,
.lesson-status--available {
  border:
    1px solid
    rgba(255, 196, 0, 0.3);
  color:
    variables.$color-primary;
}

.lesson-status--planned {
  border:
    1px solid
    variables.$color-border;
  color:
    rgba(255, 255, 255, 0.34);
}

.lesson-status--completed {
  background:
    variables.$color-primary;
  color: #070707;
}

.student-complete {
  border:
    1px solid
    variables.$color-primary;
  color:
    variables.$color-primary;
}

.lesson-content h4 {
  margin: 0;
  font-size: 0.95rem;
}

.lesson-content p {
  max-width: 760px;
  margin:
    0.35rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.4);
  font-size: 0.68rem;
  line-height: 1.5;
}

.lesson-meta {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-top: 0.55rem;
}

.lesson-meta span {
  padding:
    0.25rem
    0.4rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.54rem;
}

.lesson-arrow {
  color:
    variables.$color-primary;
  font-size: 1.1rem;
}

/* =========================================================
   STUDENT LESSON FOOTER
========================================================= */

.student-lesson-footer {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding:
    0.7rem
    1rem;
  border-top:
    1px solid
    variables.$color-border;
  background:
    rgba(255, 255, 255, 0.01);
}

.student-lesson-footer > div > span,
.student-lesson-footer > div > small {
  display: block;
}

.student-lesson-footer > div > span {
  color:
    variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.student-lesson-footer > div > small {
  margin-top: 0.12rem;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.56rem;
}

.completion-button {
  display: inline-flex;
  min-height: 36px;
  gap: 0.35rem;
  align-items: center;
  justify-content: center;
  padding:
    0.5rem
    0.65rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.4);
  border-radius: 9px;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-size: 0.59rem;
  font-weight: 900;
  cursor: pointer;
}

.completion-button--done {
  background:
    variables.$color-primary;
  color: #070707;
}

.completion-button:disabled {
  opacity: 0.45;
  cursor: wait;
}

.button-spinner {
  width: 12px;
  height: 12px;
  border:
    2px solid
    rgba(255, 255, 255, 0.2);
  border-top-color:
    currentColor;
  border-radius: 50%;
  animation:
    spin 0.7s linear infinite;
}

/* =========================================================
   LESSON ADMIN
========================================================= */

.lesson-admin {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding:
    0.65rem
    1rem;
  border-top:
    1px solid
    variables.$color-border;
}

.lesson-admin__actions {
  display: flex;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.lesson-admin-button {
  padding:
    0.42rem
    0.55rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  background: transparent;
  color:
    rgba(255, 255, 255, 0.55);
  font: inherit;
  font-size: 0.57rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

.lesson-admin-button--accent {
  border-color:
    rgba(255, 196, 0, 0.4);
  color:
    variables.$color-primary;
}

.lesson-admin-button--danger {
  color: #ff7777;
}

.lesson-unit-select {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.lesson-unit-select label {
  color:
    rgba(255, 255, 255, 0.28);
  font-size: 0.55rem;
}

.lesson-unit-select select {
  max-width: 210px;
  padding:
    0.4rem
    0.5rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  background:
    variables.$color-surface;
  color:
    variables.$color-white;
  font: inherit;
  font-size: 0.57rem;
}

/* =========================================================
   UNIT EMPTY
========================================================= */

.unit-empty {
  display: grid;
  place-items: center;
  padding: 2rem;
  text-align: center;
}

.unit-empty > div {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border:
    1px dashed
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.unit-empty h4 {
  margin:
    0.7rem
    0
    0;
}

.unit-empty p {
  max-width: 480px;
  color:
    rgba(255, 255, 255, 0.35);
  font-size: 0.65rem;
}

.unit-empty a {
  color:
    variables.$color-primary;
  font-size: 0.63rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   UNASSIGNED
========================================================= */

.unassigned {
  margin-top: 2rem;
  padding: 1.3rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 18px;
}

.unassigned > header {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.unassigned > header span {
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
}

.unassigned h2 {
  margin:
    0.25rem
    0
    0;
}

.unassigned p {
  margin:
    0.25rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.35);
  font-size: 0.65rem;
}

.unassigned > header > strong {
  color:
    variables.$color-primary;
  font-size: 1.8rem;
}

.unassigned-list {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
}

.unassigned-list > article {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
}

.unassigned-list span,
.unassigned-list strong,
.unassigned-list small {
  display: block;
}

.unassigned-list span {
  color:
    variables.$color-primary;
  font-size: 0.53rem;
}

.unassigned-list strong {
  margin-top: 0.12rem;
  font-size: 0.7rem;
}

.unassigned-list small {
  margin-top: 0.12rem;
  color:
    rgba(255, 255, 255, 0.3);
  font-size: 0.55rem;
}

.unassigned-list article > section {
  display: flex;
  gap: 0.4rem;
}

.unassigned-list select {
  padding:
    0.45rem
    0.5rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
  font-size: 0.57rem;
}

.unassigned-list a {
  padding:
    0.45rem
    0.55rem;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 8px;
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   MODALS
========================================================= */

.modal-backdrop {
  position: fixed;
  z-index: 1000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  background:
    rgba(0, 0, 0, 0.78);
  backdrop-filter:
    blur(8px);
}

.unit-modal,
.delete-dialog {
  width: min(100%, 540px);
  max-height: 90vh;
  overflow: auto;
  padding: 1.4rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 18px;
  background:
    variables.$color-surface;
  box-shadow:
    0 30px 80px
    rgba(0, 0, 0, 0.55);
}

.unit-modal > header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.unit-modal > header span {
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.unit-modal h2 {
  margin:
    0.25rem
    0
    0;
}

.modal-close {
  display: grid;
  width: 35px;
  height: 35px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  background: transparent;
  color:
    variables.$color-white;
  font-size: 1.1rem;
  cursor: pointer;
}

.unit-form {
  display: grid;
  gap: 0.8rem;
}

.unit-form label {
  display: grid;
  gap: 0.4rem;
}

.unit-form label > span {
  color:
    rgba(255, 255, 255, 0.65);
  font-size: 0.63rem;
  font-weight: 800;
}

.unit-form input,
.unit-form textarea,
.unit-form select {
  width: 100%;
  padding:
    0.75rem
    0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  outline: none;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  font: inherit;
}

.unit-form input:focus,
.unit-form textarea:focus,
.unit-form select:focus {
  border-color:
    variables.$color-primary;
}

.unit-form textarea {
  resize: vertical;
}

.unit-form__grid {
  display: grid;
  gap: 0.7rem;
  grid-template-columns:
    1fr
    1fr;
}

.unit-form__notice {
  padding: 0.8rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.22);
  border-radius: 10px;
  background:
    rgba(255, 196, 0, 0.025);
}

.unit-form__notice strong {
  color:
    variables.$color-primary;
  font-size: 0.64rem;
}

.unit-form__notice p {
  margin:
    0.2rem
    0
    0;
  color:
    rgba(255, 255, 255, 0.35);
  font-size: 0.59rem;
}

.form-error {
  margin: 0;
  color: #ff7474;
  font-size: 0.63rem;
}

.unit-form > footer {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  margin-top: 0.4rem;
}

/* =========================================================
   DELETE
========================================================= */

.delete-dialog {
  text-align: center;
}

.delete-dialog__icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  margin:
    0 auto
    0.8rem;
  border:
    1px solid
    #ff7474;
  border-radius: 50%;
  color: #ff7474;
  font-size: 1.2rem;
}

.delete-dialog > span {
  color: #ff7474;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.delete-dialog h2 {
  margin:
    0.3rem
    0
    0.5rem;
}

.delete-dialog > strong {
  display: block;
  color:
    variables.$color-primary;
}

.delete-dialog > p {
  color:
    rgba(255, 255, 255, 0.4);
  line-height: 1.55;
}

.delete-dialog__warning {
  padding: 0.7rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  color:
    rgba(255, 255, 255, 0.35);
  font-size: 0.61rem;
}

.delete-dialog footer {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-top: 1rem;
}

.cancel-delete,
.confirm-delete {
  padding:
    0.65rem
    0.8rem;
  border-radius: 9px;
  font: inherit;
  font-size: 0.63rem;
  font-weight: 800;
  cursor: pointer;
}

.cancel-delete {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color:
    variables.$color-white;
}

.confirm-delete {
  border:
    1px solid
    #ff7474;
  background: #ff7474;
  color: #080808;
}

/* =========================================================
   TOAST
========================================================= */

.program-toast {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 1100;
  display: flex;
  max-width: 370px;
  gap: 0.7rem;
  align-items: center;
  padding: 0.85rem;
  border:
    1px solid
    rgba(255, 196, 0, 0.35);
  border-radius: 12px;
  background:
    rgba(18, 18, 18, 0.97);
  box-shadow:
    0 20px 50px
    rgba(0, 0, 0, 0.5);
}

.program-toast > span {
  display: grid;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
}

.program-toast strong,
.program-toast small {
  display: block;
}

.program-toast strong {
  font-size: 0.66rem;
}

.program-toast small {
  margin-top: 0.12rem;
  color:
    rgba(255, 255, 255, 0.38);
  font-size: 0.59rem;
}

.program-toast--error {
  border-color:
    rgba(255, 90, 90, 0.4);
}

.program-toast--error > span {
  border-color: #ff7474;
  color: #ff7474;
}

/* =========================================================
   TRANSITIONS
========================================================= */

.unit-content-enter-active,
.unit-content-leave-active,
.modal-enter-active,
.modal-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.unit-content-enter-from,
.unit-content-leave-to {
  opacity: 0;
  transform:
    translateY(-6px);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
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

@media (max-width: 1050px) {
  .program-stats {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .stat-card--progress {
    grid-column:
      span 1;
  }
}

@media (max-width: 850px) {
  .program-hero {
    grid-template-columns: 1fr;
  }

  .hero-mode,
  .student-progress-ring {
    max-width: 480px;
  }

  .continue-learning {
    grid-template-columns:
      auto
      1fr;
  }

  .continue-learning__button {
    grid-column: 2;
    width: fit-content;
  }

  .unit-metrics {
    grid-template-columns:
      1fr
      1fr;
  }

  .unit-progress {
    grid-column:
      1 / -1;
  }

  .unit-metrics article:nth-child(2) {
    border-right: 0;
  }

  .lesson-admin {
    align-items: stretch;
    flex-direction: column;
  }

  .lesson-unit-select {
    justify-content:
      space-between;
  }
}

@media (max-width: 700px) {
  .program-hero {
    padding: 1.4rem;
  }

  .program-stats {
    grid-template-columns:
      1fr
      1fr;
  }

  .admin-panel {
    align-items: stretch;
    flex-direction: column;
  }

  .admin-panel__actions {
    width: 100%;
  }

  .admin-panel__actions > * {
    flex: 1;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
    gap: 0.5rem;
  }

  .unit-header__main {
    grid-template-columns:
      48px
      1fr
      auto;
    padding: 1rem;
  }

  .unit-number {
    font-size: 1.5rem;
  }

  .unit-metrics {
    padding:
      0.8rem
      1rem;
  }

  .student-lesson-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .completion-button {
    width: 100%;
  }

  .unassigned-list > article {
    align-items: stretch;
    flex-direction: column;
  }

  .unassigned-list article > section {
    width: 100%;
  }

  .unassigned-list select {
    flex: 1;
  }
}

@media (max-width: 520px) {
  .program-hero h1 {
    font-size:
      clamp(
        2.5rem,
        14vw,
        4rem
      );
  }

  .student-progress-ring {
    align-items: flex-start;
    flex-direction: column;
  }

  .program-stats {
    grid-template-columns: 1fr 1fr;
  }

  .stat-card {
    min-height: 110px;
  }

  .stat-card--progress {
    grid-column:
      1 / -1;
  }

  .continue-learning {
    grid-template-columns: 1fr;
  }

  .continue-learning__button {
    grid-column: 1;
    width: 100%;
    justify-content: center;
  }

  .unit-header__main {
    grid-template-columns:
      auto
      1fr;
  }

  .collapse-button {
    grid-column:
      1 / -1;
    width: 100%;
    height: 30px;
  }

  .unit-metrics {
    grid-template-columns:
      1fr
      1fr;
  }

  .lesson-card__main {
    grid-template-columns:
      40px
      1fr;
  }

  .lesson-arrow {
    grid-column: 2;
  }

  .lesson-admin__actions {
    display: grid;
    grid-template-columns:
      1fr
      1fr;
  }

  .lesson-admin-button {
    text-align: center;
  }

  .lesson-unit-select {
    align-items: stretch;
    flex-direction: column;
  }

  .lesson-unit-select select {
    max-width: none;
  }

  .unit-form__grid {
    grid-template-columns: 1fr;
  }

  .unit-form > footer,
  .delete-dialog footer {
    flex-direction: column;
  }

  .unit-form > footer button,
  .delete-dialog footer button {
    width: 100%;
  }

  .program-toast {
    right: 0.75rem;
    bottom: 0.75rem;
    left: 0.75rem;
    max-width: none;
  }
}
</style>
