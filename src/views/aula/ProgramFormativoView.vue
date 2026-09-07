<template>
  <section class="program">
    <!-- =====================================================
         HERO
    ====================================================== -->
    <header class="program-hero">
      <div class="program-hero__content">
        <div class="program-hero__eyebrow">
          <span class="program-hero__dot"></span>
          Programa formativo
        </div>

        <h1>
          Canto, música
          <span>e interpretación</span>
        </h1>

        <p class="program-hero__description">
          Un recorrido progresivo diseñado para desarrollar
          técnica vocal, musicalidad, interpretación y
          experiencia escénica.
        </p>

        <div class="program-hero__meta">
          <span>Septiembre — Diciembre 2026</span>
          <span>Academia Amo Mi Voz</span>
        </div>
      </div>

      <aside
        v-if="isTeacher"
        class="teacher-mode"
      >
        <div class="teacher-mode__icon">
          AMV
        </div>

        <div>
          <span>Modo profesor</span>
          <strong>
            Gestión académica
          </strong>
          <small>
            Administra unidades, clases y estructura
            del programa.
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
        Estamos obteniendo las unidades y clases
        desde Supabase.
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

    <template v-else>
      <!-- ===================================================
           RESUMEN
      ==================================================== -->
      <section class="program-stats">
        <article class="stat-card">
          <span class="stat-card__label">
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
          <span class="stat-card__label">
            Clases
          </span>

          <strong>
            {{ programLessons.length }}
          </strong>

          <small>
            sesiones programadas
          </small>
        </article>

        <article class="stat-card">
          <span class="stat-card__label">
            Realizadas
          </span>

          <strong>
            {{ completedCount }}
          </strong>

          <small>
            clases completadas
          </small>
        </article>

        <article class="stat-card stat-card--progress">
          <div class="stat-card__progress-top">
            <span class="stat-card__label">
              Avance del programa
            </span>

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

          <small>
            según clases marcadas como realizadas
          </small>
        </article>
      </section>

      <!-- ===================================================
           ADMINISTRACIÓN PROFESOR
      ==================================================== -->
      <section
        v-if="isTeacher"
        class="admin-panel"
      >
        <div class="admin-panel__content">
          <span>
            Panel académico
          </span>

          <strong>
            Estructura del programa
          </strong>

          <p>
            Organiza el curso en unidades y asigna
            cada clase a su bloque formativo.
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
           VACÍO ABSOLUTO
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
          Programa formativo
        </span>

        <h2>
          Comienza a construir
          tu experiencia educativa
        </h2>

        <p>
          Crea unidades formativas y organiza dentro
          de ellas las clases, contenidos, repertorio
          y evaluaciones del curso.
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
        class="units"
      >
        <div class="section-heading">
          <div>
            <span>
              Ruta de aprendizaje
            </span>

            <h2>
              Unidades formativas
            </h2>
          </div>

          <p>
            Cada unidad reúne clases que comparten
            objetivos y contenidos comunes.
          </p>
        </div>

        <article
          v-for="(unit, unitIndex) in visibleUnits"
          :key="unit.id"
          class="unit-card"
          :class="{
            'unit-card--draft':
              unit.status === 'draft'
          }"
        >
          <div
            class="unit-card__cover"
            :class="{
              'unit-card__cover--empty':
                !getUnitCover(unit)
            }"
            :style="
              getUnitCover(unit)
                ? {
                    backgroundImage:
                      `linear-gradient(90deg, rgba(15,25,40,.78), rgba(15,25,40,.18)), url(${getUnitCover(unit)})`
                  }
                : {}
            "
          >
            <div class="unit-card__cover-copy">
              <span>
                UNIDAD {{ unitIndex + 1 }}
              </span>

              <strong>
                {{ unit.title }}
              </strong>

              <small v-if="!getUnitCover(unit)">
                Añade una imagen horizontal para identificar esta unidad.
              </small>
            </div>

            <button
              v-if="isTeacher"
              type="button"
              class="unit-card__cover-action"
              @click.stop="
                openEditUnitModal(unit)
              "
            >
              {{
                getUnitCover(unit)
                  ? 'Cambiar portada'
                  : '+ Añadir portada'
              }}
            </button>
          </div>

          <!-- ===============================================
               CABECERA UNIDAD
          ================================================ -->
          <header class="unit-card__header">
            <button
              type="button"
              class="unit-card__toggle"
              :aria-expanded="!isUnitCollapsed(unit.id)"
              @click="toggleUnit(unit.id)"
            >
              <div class="unit-card__number">
                {{
                  String(unitIndex + 1)
                    .padStart(2, '0')
                }}
              </div>

              <div class="unit-card__heading">
                <div class="unit-card__eyebrow">
                  <span>
                    Unidad
                    {{ unitIndex + 1 }}
                  </span>

                  <span
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
                </div>

                <h3>
                  {{ unit.title }}
                </h3>

                <p v-if="unit.description">
                  {{ unit.description }}
                </p>
              </div>

              <div class="unit-card__toggle-icon">
                {{
                  isUnitCollapsed(unit.id)
                    ? '+'
                    : '−'
                }}
              </div>
            </button>

            <!-- =============================================
                 MÉTRICAS DE UNIDAD
            ============================================== -->
            <div class="unit-card__metrics">
              <div>
                <span>
                  Clases
                </span>

                <strong>
                  {{
                    getLessonsForUnit(unit.id)
                      .length
                  }}
                </strong>
              </div>

              <div>
                <span>
                  Realizadas
                </span>

                <strong>
                  {{
                    getCompletedLessonsForUnit(
                      unit.id
                    )
                  }}
                </strong>
              </div>

              <div class="unit-card__progress">
                <div>
                  <span>
                    Progreso
                  </span>

                  <strong>
                    {{
                      getUnitProgress(unit.id)
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
              </div>
            </div>

            <!-- =============================================
                 ADMIN UNIDAD
            ============================================== -->
            <footer
              v-if="isTeacher"
              class="unit-card__admin"
            >
              <button
                type="button"
                class="unit-card__edit"
                @click="openEditUnitModal(unit)"
              >
                Editar unidad / portada
              </button>

              <button
                type="button"
                class="unit-card__delete"
                @click="askDeleteUnit(unit)"
              >
                Eliminar
              </button>
            </footer>
          </header>

          <!-- ===============================================
               CLASES DE LA UNIDAD
          ================================================ -->
          <Transition name="unit-content">
            <div
              v-if="!isUnitCollapsed(unit.id)"
              class="unit-card__body"
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
                    lesson,
                    lessonIndex
                  ) in getLessonsForUnit(unit.id)"
                  :key="lesson.id"
                  class="lesson-card"
                >
                  <RouterLink
                    :to="
                      `/aula/clase/${lesson.id}`
                    "
                    class="lesson-card__main"
                  >
                    <div
                      class="lesson-card__cover"
                      :class="{
                        'lesson-card__cover--empty':
                          !getLessonCover(lesson)
                      }"
                      :style="
                        getLessonCover(lesson)
                          ? {
                              backgroundImage:
                                `linear-gradient(90deg, rgba(15,25,40,.28), rgba(15,25,40,.03)), url(${getLessonCover(lesson)})`
                            }
                          : {}
                      "
                    >
                      <span
                        v-if="
                          !getLessonCover(lesson)
                        "
                      >
                        Sin portada
                      </span>
                    </div>

                    <div class="lesson-card__index">
                      {{
                        String(
                          lessonIndex + 1
                        ).padStart(2, '0')
                      }}
                    </div>

                    <div class="lesson-card__content">
                      <div class="lesson-card__top">
                        <span class="lesson-card__date">
                          {{
                            lesson.date ||
                            'Fecha por definir'
                          }}
                        </span>

                        <span
                          class="lesson-status"
                          :class="
                            `lesson-status--${lesson.status}`
                          "
                        >
                          {{
                            getStatusLabel(
                              lesson.status
                            )
                          }}
                        </span>
                      </div>

                      <h4>
                        {{ lesson.title }}
                      </h4>

                      <p>
                        {{
                          lesson.description ||
                          'Esta clase todavía no tiene una descripción.'
                        }}
                      </p>

                      <div class="lesson-card__meta">
                        <span
                          v-if="lesson.time"
                        >
                          ⏱ {{ lesson.time }}
                        </span>

                        <span
                          v-if="lesson.duration"
                        >
                          {{ lesson.duration }}
                        </span>

                        <span
                          v-if="lesson.modality"
                        >
                          {{ lesson.modality }}
                        </span>
                      </div>
                    </div>

                    <div class="lesson-card__arrow">
                      →
                    </div>
                  </RouterLink>

                  <!-- =======================================
                       PROFESOR
                  ======================================== -->
                  <footer
                    v-if="isTeacher"
                    class="lesson-card__admin"
                  >
                    <div class="lesson-card__admin-main">
                      <RouterLink
                        :to="
                          `/aula/clase/${lesson.id}/editar`
                        "
                        class="lesson-admin-button lesson-admin-button--accent"
                      >
                        Editar
                      </RouterLink>

                      <RouterLink
                        :to="
                          `/aula/clase/${lesson.id}/trabajo`
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
                          lesson.id
                        "
                        @click="
                          handleDuplicate(
                            lesson
                          )
                        "
                      >
                        {{
                          actionLoadingId ===
                          lesson.id
                            ? 'Procesando...'
                            : 'Duplicar'
                        }}
                      </button>

                      <button
                        type="button"
                        class="lesson-admin-button lesson-admin-button--danger"
                        :disabled="
                          actionLoadingId ===
                          lesson.id
                        "
                        @click="
                          askDeleteLesson(
                            lesson
                          )
                        "
                      >
                        Eliminar
                      </button>
                    </div>

                    <div class="lesson-card__assignment">
                      <label
                        :for="
                          `lesson-unit-${lesson.id}`
                        "
                      >
                        Unidad
                      </label>

                      <select
                        :id="
                          `lesson-unit-${lesson.id}`
                        "
                        :value="
                          lesson.unitId ??
                          ''
                        "
                        :disabled="
                          assignmentLoadingId ===
                          lesson.id
                        "
                        @change="
                          handleUnitAssignment(
                            lesson,
                            $event.target.value
                          )
                        "
                      >
                        <option value="">
                          Sin unidad
                        </option>

                        <option
                          v-for="
                            optionUnit in units
                          "
                          :key="
                            optionUnit.id
                          "
                          :value="
                            optionUnit.id
                          "
                        >
                          {{
                            optionUnit.title
                          }}
                        </option>
                      </select>
                    </div>
                  </footer>
                </article>
              </div>

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
                  Puedes crear una nueva clase o asignar
                  una clase existente a esta unidad.
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
      </section>

      <!-- ===================================================
           CLASES SIN UNIDAD
           SOLO PROFESOR
      ==================================================== -->
      <section
        v-if="
          isTeacher &&
          unassignedLessons.length
        "
        class="unassigned"
      >
        <header class="unassigned__header">
          <div>
            <span>
              Organización pendiente
            </span>

            <h2>
              Clases sin unidad
            </h2>

            <p>
              Estas clases existen en el programa,
              pero todavía no pertenecen a una
              unidad formativa.
            </p>
          </div>

          <strong>
            {{ unassignedLessons.length }}
          </strong>
        </header>

        <div class="unassigned__list">
          <article
            v-for="lesson in unassignedLessons"
            :key="lesson.id"
            class="unassigned-lesson"
          >
            <div class="unassigned-lesson__content">
              <span>
                Clase {{ lesson.id }}
              </span>

              <strong>
                {{ lesson.title }}
              </strong>

              <small>
                {{
                  lesson.date ||
                  'Fecha por definir'
                }}
              </small>
            </div>

            <div class="unassigned-lesson__actions">
              <select
                :value="lesson.unitId ?? ''"
                :disabled="
                  assignmentLoadingId ===
                  lesson.id
                "
                @change="
                  handleUnitAssignment(
                    lesson,
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
                  `/aula/clase/${lesson.id}/editar`
                "
              >
                Editar
              </RouterLink>
            </div>
          </article>
        </div>
      </section>

      <!-- ===================================================
           ESTUDIANTE SIN UNIDADES PUBLICADAS
      ==================================================== -->
      <section
        v-if="
          !isTeacher &&
          !visibleUnits.length
        "
        class="student-empty"
      >
        <div>
          ♪
        </div>

        <h2>
          El programa está siendo preparado
        </h2>

        <p>
          Pronto encontrarás aquí las unidades,
          clases y actividades de tu formación.
        </p>
      </section>
    </template>

    <!-- =====================================================
         MODAL CREAR / EDITAR UNIDAD
    ====================================================== -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="unitModalOpen"
          class="modal-backdrop"
          @click.self="closeUnitModal"
        >
          <article class="unit-modal">
            <header class="unit-modal__header">
              <div>
                <span>
                  {{
                    editingUnit
                      ? 'Editar unidad'
                      : 'Nueva unidad'
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
                aria-label="Cerrar"
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
                  Nombre de la unidad
                </span>

                <input
                  v-model="unitForm.title"
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
                  v-model="
                    unitForm.description
                  "
                  rows="5"
                  maxlength="700"
                  placeholder="Describe los objetivos y contenidos principales de esta unidad."
                ></textarea>
              </label>

              <section class="unit-cover-editor">
                <div class="unit-cover-editor__heading">
                  <div>
                    <span>
                      PORTADA DE LA UNIDAD
                    </span>

                    <strong>
                      Banner visual
                    </strong>
                  </div>

                  <small>
                    Opcional · JPG/PNG/WebP · máx. 8 MB
                  </small>
                </div>

                <input
                  ref="unitCoverInput"
                  class="unit-cover-editor__input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  @change="handleUnitCoverInput"
                />

                <div
                  class="unit-cover-editor__preview"
                  :class="{
                    'unit-cover-editor__preview--has-image':
                      unitCoverPreviewUrl
                  }"
                  :style="
                    unitCoverPreviewUrl
                      ? {
                          backgroundImage:
                            `linear-gradient(90deg, rgba(15,25,40,.76), rgba(15,25,40,.16)), url(${unitCoverPreviewUrl})`
                        }
                      : {}
                  "
                >
                  <span>
                    UNIDAD
                  </span>

                  <strong>
                    {{
                      unitForm.title ||
                      'Vista previa de la unidad'
                    }}
                  </strong>

                  <small>
                    {{
                      unitCoverPreviewUrl
                        ? 'Así se verá el banner dentro del programa formativo.'
                        : 'Sube una imagen horizontal para identificar visualmente esta unidad.'
                    }}
                  </small>
                </div>

                <div class="unit-cover-editor__actions">
                  <button
                    type="button"
                    class="unit-cover-button unit-cover-button--primary"
                    :disabled="
                      isSavingUnit ||
                      isUploadingUnitCover
                    "
                    @click="
                      unitCoverInput?.click()
                    "
                  >
                    {{
                      unitCoverPreviewUrl
                        ? 'Cambiar imagen'
                        : 'Subir portada'
                    }}
                  </button>

                  <button
                    v-if="
                      pendingUnitCover ||
                      unitCoverPreviewUrl
                    "
                    type="button"
                    class="unit-cover-button"
                    :disabled="
                      isSavingUnit ||
                      isUploadingUnitCover
                    "
                    @click="
                      pendingUnitCover
                        ? clearPendingUnitCover()
                        : removeCurrentUnitCover()
                    "
                  >
                    {{
                      pendingUnitCover
                        ? 'Quitar selección'
                        : 'Quitar portada'
                    }}
                  </button>
                </div>

                <p
                  v-if="unitCoverError"
                  class="unit-cover-editor__error"
                >
                  {{ unitCoverError }}
                </p>
              </section>

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
                    unitForm.status ===
                    'published'
                      ? 'Visible para estudiantes'
                      : 'Solo visible para profesores'
                  }}
                </strong>

                <p>
                  {{
                    unitForm.status ===
                    'published'
                      ? 'La unidad aparecerá en el programa del estudiante.'
                      : 'Puedes seguir preparando esta unidad antes de publicarla.'
                  }}
                </p>
              </div>

              <p
                v-if="unitFormError"
                class="unit-form__error"
              >
                {{ unitFormError }}
              </p>

              <footer class="unit-form__actions">
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

            <span class="delete-dialog__eyebrow">
              Eliminar unidad
            </span>

            <h2>
              ¿Eliminar esta unidad?
            </h2>

            <strong>
              {{ unitToDelete.title }}
            </strong>

            <p>
              La unidad será eliminada. Las clases que
              contiene no se borrarán: quedarán como
              clases sin unidad.
            </p>

            <div class="delete-dialog__warning">
              Esta acción no elimina las clases,
              materiales ni tareas.
            </div>

            <footer class="delete-dialog__actions">
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

            <span class="delete-dialog__eyebrow">
              Eliminar clase
            </span>

            <h2>
              ¿Eliminar esta clase?
            </h2>

            <strong>
              Clase {{ lessonToDelete.id }}
              ·
              {{ lessonToDelete.title }}
            </strong>

            <p>
              La clase será eliminada
              directamente de Supabase.
            </p>

            <div class="delete-dialog__warning">
              Revisa antes si la clase tiene materiales,
              tareas o registros relacionados.
            </div>

            <footer class="delete-dialog__actions">
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
                : 'Cambios guardados'
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

import { useAuth } from '@/composables/useAuth'

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
  clearUnitCover,
  getUnitAppearance,
  uploadUnitCover,
  syncLocalUnitCoversToDatabase,
} from '@/services/unitAppearanceService'

import {
  getLessonAppearance,
  syncLocalLessonCoversToDatabase,
} from '@/services/lessonAppearanceService'

const router = useRouter()

const {
  isTeacher,
} = useAuth()

/* =========================================================
   ESTADO
========================================================= */

const lessons = ref([])
const units = ref([])

const isLoading = ref(true)
const loadError = ref('')

const actionLoadingId = ref(null)
const assignmentLoadingId = ref(null)

const collapsedUnitIds = ref([])

const lessonToDelete = ref(null)
const unitToDelete = ref(null)

const isDeletingLesson = ref(false)
const isDeletingUnit = ref(false)

const unitModalOpen = ref(false)
const editingUnit = ref(null)
const isSavingUnit = ref(false)
const unitFormError = ref('')

const unitForm = ref({
  title: '',
  description: '',
  position: 1,
  status: 'published',
})

const unitCoverInput = ref(null)
const pendingUnitCover = ref(null)
const unitCoverPreviewUrl = ref('')
const unitCoverError = ref('')
const isUploadingUnitCover = ref(false)

const MAX_UNIT_COVER_SIZE =
  8 * 1024 * 1024

const toastMessage = ref('')
const toastType = ref('success')

let toastTimer = null

/* =========================================================
   CARGAR PROGRAMA
========================================================= */

const loadProgram = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    /*
     * Migra portadas antiguas guardadas en localStorage
     * hacia Supabase. Solo hace cambios si faltan en DB.
     */
    await Promise.allSettled([
      syncLocalLessonCoversToDatabase(),
      syncLocalUnitCoversToDatabase(),
    ])

    const [
      unitsData,
      lessonsData,
    ] = await Promise.all([
      fetchUnits(),
      fetchLessons(),
    ])

    units.value = unitsData
    lessons.value = lessonsData
  } catch (error) {
    console.error(
      'Error cargando programa:',
      error,
    )

    loadError.value =
      error?.message ||
      'No fue posible conectar con la base de datos.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   UNIDADES VISIBLES
========================================================= */

const visibleUnits = computed(() => {
  if (isTeacher.value) {
    return units.value
  }

  return units.value.filter(
    unit =>
      unit.status === 'published',
  )
})

/* =========================================================
   CLASES VISIBLES
========================================================= */

const programLessons = computed(() => {
  if (isTeacher.value) {
    return lessons.value
  }

  const visibleUnitIds =
    new Set(
      visibleUnits.value.map(
        unit => Number(unit.id),
      ),
    )

  return lessons.value.filter(
    lesson =>
      lesson.unitId &&
      visibleUnitIds.has(
        Number(lesson.unitId),
      ),
  )
})

const unassignedLessons = computed(() => {
  return lessons.value.filter(
    lesson =>
      !lesson.unitId,
  )
})

/* =========================================================
   PROGRESO GENERAL
========================================================= */

const completedCount = computed(() => {
  return programLessons.value.filter(
    lesson =>
      lesson.status === 'completed',
  ).length
})

const programProgress = computed(() => {
  if (!programLessons.value.length) {
    return 0
  }

  return Math.round(
    (
      completedCount.value /
      programLessons.value.length
    ) * 100,
  )
})

/* =========================================================
   CLASES POR UNIDAD
========================================================= */

const getLessonsForUnit = unitId => {
  return lessons.value.filter(
    lesson =>
      Number(lesson.unitId) ===
      Number(unitId),
  )
}

const getCompletedLessonsForUnit =
  unitId => {
    return getLessonsForUnit(
      unitId,
    ).filter(
      lesson =>
        lesson.status ===
        'completed',
    ).length
  }

const getUnitProgress = unitId => {
  const unitLessons =
    getLessonsForUnit(unitId)

  if (!unitLessons.length) {
    return 0
  }

  const completed =
    getCompletedLessonsForUnit(
      unitId,
    )

  return Math.round(
    (
      completed /
      unitLessons.length
    ) * 100,
  )
}

/* =========================================================
   COLAPSAR UNIDADES
========================================================= */

const isUnitCollapsed = unitId => {
  return collapsedUnitIds.value.includes(
    Number(unitId),
  )
}

const toggleUnit = unitId => {
  const id = Number(unitId)

  if (
    collapsedUnitIds.value.includes(
      id,
    )
  ) {
    collapsedUnitIds.value =
      collapsedUnitIds.value.filter(
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
   ESTADOS
========================================================= */

const getStatusLabel = status => {
  const labels = {
    available: 'Disponible',
    planned: 'Planificada',
    published: 'Publicada',
    completed: 'Realizada',
  }

  return (
    labels[status] ||
    'Disponible'
  )
}

const getUnitStatusLabel = status => {
  const labels = {
    published: 'Publicada',
    draft: 'Borrador',
  }

  return (
    labels[status] ||
    'Publicada'
  )
}

/* =========================================================
   MODALES / SCROLL
========================================================= */

const lockBody = () => {
  document.body.style.overflow =
    'hidden'
}

const unlockBody = () => {
  document.body.style.overflow =
    ''
}

/* =========================================================
   CREAR UNIDAD
========================================================= */

const getNextUnitPosition = () => {
  if (!units.value.length) {
    return 1
  }

  return (
    Math.max(
      ...units.value.map(
        unit =>
          Number(
            unit.position || 0,
          ),
      ),
    ) + 1
  )
}


/* =========================================================
   PORTADAS · UNIDADES Y CLASES
========================================================= */

const getUnitCover = unit => {
  const unitId =
    typeof unit === 'object'
      ? unit?.id
      : unit

  const direct =
    typeof unit === 'object'
      ? (
          unit?.coverUrl ||
          unit?.cover_url ||
          unit?.bannerUrl ||
          unit?.banner_url ||
          unit?.imageUrl ||
          unit?.image_url ||
          ''
        )
      : ''

  if (direct) {
    return direct
  }

  return (
    getUnitAppearance(unitId)
      ?.coverUrl ||
    ''
  )
}

const getLessonCover = lesson => {
  const lessonId =
    typeof lesson === 'object'
      ? lesson?.id
      : lesson

  /*
   * Primero intentamos columnas directas por si
   * la portada ya vive en Supabase.
   */
  const direct =
    typeof lesson === 'object'
      ? (
          lesson?.coverUrl ||
          lesson?.cover_url ||
          lesson?.bannerUrl ||
          lesson?.banner_url ||
          lesson?.imageUrl ||
          lesson?.image_url ||
          lesson?.thumbnailUrl ||
          lesson?.thumbnail_url ||
          ''
        )
      : ''

  if (direct) {
    return direct
  }

  /*
   * Luego usamos el mismo servicio que EditLessonView.
   */
  const appearance =
    getLessonAppearance(
      lessonId
    )

  if (appearance?.coverUrl) {
    return appearance.coverUrl
  }

  /*
   * Fallback defensivo para versiones anteriores
   * del almacenamiento local.
   */
  try {
    const keys = [
      'amv.lesson.appearance.v1',
      'amv.lesson.appearance',
      'lesson.appearance.v1'
    ]

    for (const key of keys) {
      const parsed =
        JSON.parse(
          localStorage.getItem(key) ||
          '{}'
        )

      const stored =
        parsed?.[
          String(lessonId)
        ]

      const url =
        stored?.coverUrl ||
        stored?.cover_url ||
        stored?.bannerUrl ||
        stored?.banner_url ||
        ''

      if (url) {
        return url
      }
    }
  } catch (error) {
    console.warn(
      'No fue posible recuperar la portada local de la clase.',
      error
    )
  }

  return ''
}

const handleUnitCoverInput = event => {
  const file =
    event?.target?.files?.[0]

  unitCoverError.value = ''

  if (!file) {
    return
  }

  if (
    !String(file.type || '')
      .startsWith('image/')
  ) {
    unitCoverError.value =
      'La portada debe ser una imagen.'

    event.target.value = ''
    return
  }

  if (
    file.size >
    MAX_UNIT_COVER_SIZE
  ) {
    unitCoverError.value =
      'La portada no puede superar 8 MB.'

    event.target.value = ''
    return
  }

  pendingUnitCover.value = file

  if (unitCoverPreviewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(
      unitCoverPreviewUrl.value
    )
  }

  unitCoverPreviewUrl.value =
    URL.createObjectURL(file)
}

const clearPendingUnitCover = () => {
  pendingUnitCover.value = null
  unitCoverError.value = ''

  if (unitCoverPreviewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(
      unitCoverPreviewUrl.value
    )
  }

  unitCoverPreviewUrl.value =
    editingUnit.value
      ? getUnitCover(
          editingUnit.value.id
        )
      : ''

  if (unitCoverInput.value) {
    unitCoverInput.value.value = ''
  }
}

const removeCurrentUnitCover = () => {
  if (
    !editingUnit.value?.id
  ) {
    clearPendingUnitCover()
    return
  }

  clearUnitCover(
    editingUnit.value.id
  )

  pendingUnitCover.value = null
  unitCoverPreviewUrl.value = ''
  unitCoverError.value = ''

  if (unitCoverInput.value) {
    unitCoverInput.value.value = ''
  }

  showToast(
    'La portada de la unidad fue eliminada.'
  )
}

const resetUnitForm = () => {
  unitForm.value = {
    title: '',
    description: '',
    position:
      getNextUnitPosition(),
    status: 'published',
  }

  unitFormError.value = ''
  pendingUnitCover.value = null
  unitCoverPreviewUrl.value = ''
  unitCoverError.value = ''

  if (unitCoverInput.value) {
    unitCoverInput.value.value = ''
  }
}

const openCreateUnitModal = () => {
  editingUnit.value = null

  resetUnitForm()

  unitModalOpen.value = true
  lockBody()
}

/* =========================================================
   EDITAR UNIDAD
========================================================= */

const openEditUnitModal = unit => {
  editingUnit.value = unit

  unitForm.value = {
    title:
      unit.title || '',

    description:
      unit.description || '',

    position:
      Number(
        unit.position || 1,
      ),

    status:
      unit.status ||
      'published',
  }

  unitFormError.value = ''
  pendingUnitCover.value = null
  unitCoverPreviewUrl.value =
    getUnitCover(unit)
  unitCoverError.value = ''

  if (unitCoverInput.value) {
    unitCoverInput.value.value = ''
  }

  unitModalOpen.value = true

  lockBody()
}

const closeUnitModal = () => {
  if (isSavingUnit.value) {
    return
  }

  unitModalOpen.value = false
  editingUnit.value = null
  unitFormError.value = ''
  pendingUnitCover.value = null
  unitCoverError.value = ''

  if (unitCoverPreviewUrl.value?.startsWith('blob:')) {
    URL.revokeObjectURL(
      unitCoverPreviewUrl.value
    )
  }

  unitCoverPreviewUrl.value = ''

  if (unitCoverInput.value) {
    unitCoverInput.value.value = ''
  }

  unlockBody()
}

/* =========================================================
   GUARDAR UNIDAD
========================================================= */

const saveUnit = async () => {
  if (isSavingUnit.value) {
    return
  }

  const title =
    unitForm.value.title.trim()

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

  isSavingUnit.value = true
  unitFormError.value = ''

  try {
    const payload = {
      title,

      description:
        unitForm.value.description.trim(),

      position:
        Number(
          unitForm.value.position,
        ),

      status:
        unitForm.value.status,
    }

    let savedUnit = null

    if (editingUnit.value) {
      savedUnit =
        await updateUnit(
          editingUnit.value.id,
          payload,
        )
    } else {
      savedUnit =
        await insertUnit(payload)
    }

    /*
     * La unidad ya tiene ID.
     * Si el profesor seleccionó una portada,
     * la subimos ahora a Storage.
     */
    if (
      pendingUnitCover.value &&
      savedUnit?.id
    ) {
      isUploadingUnitCover.value = true

      try {
        await uploadUnitCover({
          unitId:
            savedUnit.id,

          file:
            pendingUnitCover.value,
        })
      } finally {
        isUploadingUnitCover.value = false
      }
    }

    showToast(
      editingUnit.value
        ? (
            pendingUnitCover.value
              ? 'La unidad y su portada fueron actualizadas correctamente.'
              : 'La unidad fue actualizada correctamente.'
          )
        : (
            pendingUnitCover.value
              ? 'La unidad fue creada con su portada.'
              : 'La unidad fue creada correctamente.'
          ),
    )

    unitModalOpen.value = false
    editingUnit.value = null
    pendingUnitCover.value = null
    unitCoverError.value = ''

    if (unitCoverPreviewUrl.value?.startsWith('blob:')) {
      URL.revokeObjectURL(
        unitCoverPreviewUrl.value
      )
    }

    unitCoverPreviewUrl.value = ''

    if (unitCoverInput.value) {
      unitCoverInput.value.value = ''
    }

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
    isSavingUnit.value = false
  }
}

/* =========================================================
   ELIMINAR UNIDAD
========================================================= */

const askDeleteUnit = unit => {
  unitToDelete.value = unit
  lockBody()
}

const closeDeleteUnitModal = () => {
  if (isDeletingUnit.value) {
    return
  }

  unitToDelete.value = null
  unlockBody()
}

const confirmDeleteUnit = async () => {
  const unit =
    unitToDelete.value

  if (
    !unit ||
    isDeletingUnit.value
  ) {
    return
  }

  isDeletingUnit.value = true

  try {
    await removeUnit(unit.id)

    unitToDelete.value = null
    unlockBody()

    await loadProgram()

    showToast(
      'La unidad fue eliminada. Sus clases quedaron sin unidad.',
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
    isDeletingUnit.value = false
  }
}

/* =========================================================
   ASIGNAR CLASE A UNIDAD
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
          ? 'La clase fue asignada a la unidad.'
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
   DUPLICAR CLASE
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
        `Clase duplicada correctamente como Clase ${duplicated.id}.`,
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

const askDeleteLesson = lesson => {
  lessonToDelete.value =
    lesson

  lockBody()
}

const closeDeleteLessonModal = () => {
  if (isDeletingLesson.value) {
    return
  }

  lessonToDelete.value = null
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

    isDeletingLesson.value = true

    try {
      await removeLesson(
        lesson.id,
      )

      lessonToDelete.value = null

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
      toastMessage.value = ''
    }, 3500)
}

/* =========================================================
   TECLADO
========================================================= */

const handleEscape = event => {
  if (event.key !== 'Escape') {
    return
  }

  if (unitModalOpen.value) {
    closeUnitModal()
    return
  }

  if (unitToDelete.value) {
    closeDeleteUnitModal()
    return
  }

  if (lessonToDelete.value) {
    closeDeleteLessonModal()
  }
}

/* =========================================================
   CICLO DE VIDA
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
  max-width: 1280px;
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
    310px;
  align-items: end;
  margin-bottom: 2rem;
  padding: 2.4rem;
  overflow: hidden;
  border: 1px solid variables.$color-border;
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 88% 12%,
      rgba(255, 196, 0, 0.12),
      transparent 32%
    ),
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.025),
      rgba(255, 255, 255, 0)
    ),
    variables.$color-surface;
}

.program-hero::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 115px;
  height: 3px;
  background: variables.$color-primary;
  content: '';
}

.program-hero__content {
  position: relative;
  z-index: 1;
}

.program-hero__eyebrow {
  display: flex;
  gap: 0.65rem;
  align-items: center;
  margin-bottom: 1rem;
  color: variables.$color-primary;
  font-size: 0.73rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.program-hero__dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: variables.$color-primary;
  box-shadow:
    0 0 0 5px
    rgba(255, 196, 0, 0.08);
}

.program-hero h1 {
  max-width: 850px;
  margin: 0;
  font-size:
    clamp(
      2.6rem,
      6vw,
      5.4rem
    );
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.program-hero h1 span {
  display: block;
  color: variables.$color-primary;
}

.program-hero__description {
  max-width: 680px;
  margin:
    1.4rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.64
    );
  line-height: 1.7;
}

.program-hero__meta {
  display: flex;
  gap: 0.65rem;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

.program-hero__meta span {
  padding:
    0.45rem
    0.75rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.55
    );
  font-size: 0.75rem;
}

/* =========================================================
   TEACHER MODE
========================================================= */

.teacher-mode {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 1rem;
  padding: 1.2rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.32
    );
  border-radius: 18px;
  background:
    rgba(
      255,
      196,
      0,
      0.045
    );
}

.teacher-mode__icon {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 14px;
  color: variables.$color-primary;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 0.08em;
}

.teacher-mode span,
.teacher-mode strong,
.teacher-mode small {
  display: block;
}

.teacher-mode span {
  margin-bottom: 0.2rem;
  color: variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.teacher-mode strong {
  font-size: 0.98rem;
}

.teacher-mode small {
  margin-top: 0.3rem;
  color:
    rgba(
      255,
      255,
      255,
      0.45
    );
  line-height: 1.45;
}

/* =========================================================
   STATES
========================================================= */

.state-card {
  display: grid;
  min-height: 360px;
  gap: 1rem;
  place-items: center;
  align-content: center;
  padding: 3rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 24px;
  background:
    variables.$color-surface;
  text-align: center;
}

.state-card p {
  max-width: 520px;
  margin: 0;
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
}

.state-card button {
  padding:
    0.8rem
    1.2rem;
  border: 0;
  border-radius: 12px;
  background: variables.$color-primary;
  color: #080808;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.state-card__icon {
  display: grid;
  width: 62px;
  height: 62px;
  place-items: center;
  border:
    1px solid
    #ef6262;
  border-radius: 50%;
  color: #ff7b7b;
  font-size: 1.6rem;
}

.loading-spinner {
  width: 46px;
  height: 46px;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin
    0.75s linear infinite;
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
  gap: 1rem;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    )
    minmax(280px, 1.5fr);
  margin-bottom: 1.5rem;
}

.stat-card {
  min-height: 145px;
  padding: 1.35rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 18px;
  background:
    variables.$color-surface;
}

.stat-card__label {
  display: block;
  margin-bottom: 0.55rem;
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
  font-size: 0.75rem;
}

.stat-card > strong {
  display: block;
  color: variables.$color-primary;
  font-size: 2.1rem;
  line-height: 1;
}

.stat-card small {
  display: block;
  margin-top: 0.55rem;
  color:
    rgba(
      255,
      255,
      255,
      0.34
    );
  font-size: 0.7rem;
}

.stat-card--progress {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.stat-card__progress-top {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
}

.stat-card__progress-top
.stat-card__label {
  margin: 0;
}

.stat-card__progress-top strong {
  color: variables.$color-primary;
  font-size: 1.45rem;
}

/* =========================================================
   PROGRESS
========================================================= */

.progress-bar {
  position: relative;
  width: 100%;
  height: 6px;
  margin-top: 0.75rem;
  overflow: hidden;
  border-radius: 999px;
  background:
    rgba(
      255,
      255,
      255,
      0.08
    );
}

.progress-bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background:
    linear-gradient(
      90deg,
      variables.$color-primary,
      #ffe37b
    );
  transition: width 0.35s ease;
}

/* =========================================================
   ADMIN PANEL
========================================================= */

.admin-panel {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 3rem;
  padding: 1.35rem 1.5rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.24
    );
  border-radius: 18px;
  background:
    linear-gradient(
      100deg,
      rgba(
        255,
        196,
        0,
        0.055
      ),
      transparent
    ),
    variables.$color-surface;
}

.admin-panel__content span,
.admin-panel__content strong {
  display: block;
}

.admin-panel__content span {
  margin-bottom: 0.2rem;
  color: variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.admin-panel__content strong {
  font-size: 1.05rem;
}

.admin-panel__content p {
  margin:
    0.35rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.44
    );
  font-size: 0.82rem;
}

.admin-panel__actions {
  display: flex;
  gap: 0.7rem;
  flex-shrink: 0;
}

/* =========================================================
   BUTTONS
========================================================= */

.button {
  display: inline-flex;
  gap: 0.45rem;
  min-height: 45px;
  align-items: center;
  justify-content: center;
  padding:
    0.75rem
    1rem;
  border-radius: 12px;
  font: inherit;
  font-size: 0.82rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
  transition:
    transform 0.18s ease,
    border-color 0.18s ease,
    background 0.18s ease;
}

.button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.button:disabled {
  opacity: 0.45;
  cursor: wait;
}

.button--primary {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #080808;
}

.button--secondary {
  border:
    1px solid
    variables.$color-border;
  background:
    transparent;
  color: variables.$color-white;
}

.button--secondary:hover {
  border-color:
    variables.$color-primary;
}

/* =========================================================
   SECTION HEADING
========================================================= */

.section-heading {
  display: flex;
  gap: 2rem;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 1.4rem;
}

.section-heading span {
  color: variables.$color-primary;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.section-heading h2 {
  margin:
    0.3rem
    0
    0;
  font-size:
    clamp(
      1.8rem,
      4vw,
      2.5rem
    );
}

.section-heading > p {
  max-width: 440px;
  margin: 0;
  color:
    rgba(
      255,
      255,
      255,
      0.42
    );
  font-size: 0.82rem;
  line-height: 1.6;
}

/* =========================================================
   UNITS
========================================================= */

.units {
  display: grid;
  gap: 1.2rem;
}

.unit-card {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 22px;
  background:
    variables.$color-surface;
  transition:
    border-color 0.2s ease;
}

.unit-card:hover {
  border-color:
    rgba(
      255,
      196,
      0,
      0.3
    );
}

.unit-card--draft {
  border-style: dashed;
}

.unit-card__header {
  position: relative;
}

.unit-card__toggle {
  display: grid;
  width: 100%;
  gap: 1.2rem;
  grid-template-columns:
    74px
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1.6rem;
  border: 0;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.unit-card__number {
  color: variables.$color-primary;
  font-family:
    variables.$font-family-heading;
  font-size: 2.45rem;
  line-height: 1;
}

.unit-card__eyebrow {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.4rem;
}

.unit-card__eyebrow > span:first-child {
  color:
    rgba(
      255,
      255,
      255,
      0.38
    );
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.unit-card__heading h3 {
  margin: 0;
  font-size:
    clamp(
      1.35rem,
      3vw,
      1.85rem
    );
}

.unit-card__heading p {
  max-width: 760px;
  margin:
    0.55rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.47
    );
  font-size: 0.84rem;
  line-height: 1.55;
}

.unit-card__toggle-icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  color: variables.$color-primary;
  font-size: 1.25rem;
}

.unit-status {
  padding:
    0.24rem
    0.5rem;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 700;
}

.unit-status--published {
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.4
    );
  color: variables.$color-primary;
}

.unit-status--draft {
  border:
    1px solid
    rgba(
      255,
      255,
      255,
      0.16
    );
  color:
    rgba(
      255,
      255,
      255,
      0.45
    );
}

/* =========================================================
   UNIT METRICS
========================================================= */

.unit-card__metrics {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    120px
    120px
    minmax(180px, 1fr);
  padding:
    1rem
    1.6rem;
  border-top:
    1px solid
    variables.$color-border;
  background:
    rgba(
      0,
      0,
      0,
      0.14
    );
}

.unit-card__metrics > div {
  padding-right: 1rem;
  border-right:
    1px solid
    variables.$color-border;
}

.unit-card__metrics
> div:last-child {
  padding-right: 0;
  border-right: 0;
}

.unit-card__metrics span,
.unit-card__metrics strong {
  display: block;
}

.unit-card__metrics span {
  color:
    rgba(
      255,
      255,
      255,
      0.36
    );
  font-size: 0.66rem;
}

.unit-card__metrics strong {
  margin-top: 0.2rem;
  color: variables.$color-primary;
  font-size: 1.05rem;
}

.unit-card__progress > div:first-child {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.unit-card__progress
> div:first-child
strong {
  margin: 0;
}

/* =========================================================
   UNIT ADMIN
========================================================= */

.unit-card__admin {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
  padding:
    0.75rem
    1.6rem;
  border-top:
    1px solid
    variables.$color-border;
}

.unit-card__admin button {
  padding:
    0.48rem
    0.7rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  background: transparent;
  color:
    rgba(
      255,
      255,
      255,
      0.65
    );
  font: inherit;
  font-size: 0.7rem;
  font-weight: 700;
  cursor: pointer;
}

.unit-card__admin button:hover {
  border-color:
    variables.$color-primary;
  color: variables.$color-primary;
}

.unit-card__admin
.unit-card__delete:hover {
  border-color: #e85c5c;
  color: #ff7474;
}

/* =========================================================
   UNIT BODY
========================================================= */

.unit-card__body {
  padding: 1.2rem;
  border-top:
    1px solid
    variables.$color-border;
  background:
    rgba(
      0,
      0,
      0,
      0.2
    );
}

.lessons-list {
  display: grid;
  gap: 0.8rem;
}

/* =========================================================
   LESSON CARD
========================================================= */

.lesson-card {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 16px;
  background:
    variables.$color-background;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;
}

.lesson-card:hover {
  border-color:
    rgba(
      255,
      196,
      0,
      0.38
    );
  transform: translateY(-1px);
}

.lesson-card__main {
  display: grid;
  gap: 1.1rem;
  grid-template-columns:
    48px
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1.15rem;
  color: inherit;
  text-decoration: none;
}

.lesson-card__index {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.25
    );
  border-radius: 12px;
  color: variables.$color-primary;
  font-size: 0.78rem;
  font-weight: 800;
}

.lesson-card__top {
  display: flex;
  gap: 0.6rem;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;
}

.lesson-card__date {
  color: variables.$color-primary;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.lesson-card__content h4 {
  margin: 0;
  font-size: 1.05rem;
}

.lesson-card__content p {
  max-width: 780px;
  margin:
    0.45rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.45
    );
  font-size: 0.78rem;
  line-height: 1.5;
}

.lesson-card__meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.7rem;
}

.lesson-card__meta span {
  padding:
    0.3rem
    0.48rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.38
    );
  font-size: 0.64rem;
}

.lesson-card__arrow {
  color: variables.$color-primary;
  font-size: 1.45rem;
}

/* =========================================================
   LESSON STATUS
========================================================= */

.lesson-status {
  padding:
    0.24rem
    0.48rem;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 700;
}

.lesson-status--available,
.lesson-status--published {
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.35
    );
  color: variables.$color-primary;
}

.lesson-status--planned {
  border:
    1px solid
    variables.$color-border;
  color:
    rgba(
      255,
      255,
      255,
      0.42
    );
}

.lesson-status--completed {
  background:
    variables.$color-primary;
  color: #080808;
}

/* =========================================================
   LESSON ADMIN
========================================================= */

.lesson-card__admin {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding:
    0.8rem
    1rem;
  border-top:
    1px solid
    variables.$color-border;
  background:
    rgba(
      255,
      255,
      255,
      0.012
    );
}

.lesson-card__admin-main {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.lesson-admin-button {
  padding:
    0.45rem
    0.62rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 8px;
  background: transparent;
  color:
    rgba(
      255,
      255,
      255,
      0.64
    );
  font: inherit;
  font-size: 0.66rem;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
}

.lesson-admin-button:hover:not(:disabled) {
  border-color:
    variables.$color-primary;
  color: variables.$color-primary;
}

.lesson-admin-button:disabled {
  opacity: 0.4;
  cursor: wait;
}

.lesson-admin-button--accent {
  border-color:
    rgba(
      255,
      196,
      0,
      0.4
    );
  color: variables.$color-primary;
}

.lesson-admin-button--danger {
  color: #ff7777;
}

.lesson-admin-button--danger:hover:not(:disabled) {
  border-color: #ef6565;
  color: #ff7777;
}

.lesson-card__assignment {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  flex-shrink: 0;
}

.lesson-card__assignment label {
  color:
    rgba(
      255,
      255,
      255,
      0.38
    );
  font-size: 0.66rem;
}

.lesson-card__assignment select {
  max-width: 220px;
}

/* =========================================================
   SELECT / INPUT GENERAL
========================================================= */

select,
input,
textarea {
  border:
    1px solid
    variables.$color-border;
  outline: none;
  background:
    variables.$color-background;
  color: variables.$color-white;
  font: inherit;
}

select {
  padding:
    0.5rem
    0.65rem;
  border-radius: 9px;
  font-size: 0.7rem;
}

/* =========================================================
   EMPTY UNIT
========================================================= */

.unit-empty {
  padding: 2rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 14px;
  text-align: center;
}

.unit-empty > div {
  display: grid;
  width: 45px;
  height: 45px;
  margin:
    0 auto
    0.9rem;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
}

.unit-empty h4 {
  margin: 0;
}

.unit-empty p {
  max-width: 500px;
  margin:
    0.6rem
    auto
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.42
    );
  font-size: 0.78rem;
}

.unit-empty a {
  display: inline-block;
  margin-top: 1rem;
  color: variables.$color-primary;
  font-size: 0.78rem;
}

/* =========================================================
   UNASSIGNED
========================================================= */

.unassigned {
  margin-top: 3rem;
  overflow: hidden;
  border:
    1px dashed
    rgba(
      255,
      196,
      0,
      0.35
    );
  border-radius: 20px;
  background:
    rgba(
      255,
      196,
      0,
      0.025
    );
}

.unassigned__header {
  display: flex;
  gap: 2rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.4rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.unassigned__header span {
  color: variables.$color-primary;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.unassigned__header h2 {
  margin:
    0.3rem
    0
    0;
  font-size: 1.35rem;
}

.unassigned__header p {
  max-width: 620px;
  margin:
    0.35rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.75rem;
}

.unassigned__header > strong {
  color: variables.$color-primary;
  font-size: 2rem;
}

.unassigned__list {
  display: grid;
}

.unassigned-lesson {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.4rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.unassigned-lesson:last-child {
  border-bottom: 0;
}

.unassigned-lesson__content span,
.unassigned-lesson__content strong,
.unassigned-lesson__content small {
  display: block;
}

.unassigned-lesson__content span {
  color: variables.$color-primary;
  font-size: 0.64rem;
  font-weight: 700;
  text-transform: uppercase;
}

.unassigned-lesson__content strong {
  margin-top: 0.2rem;
}

.unassigned-lesson__content small {
  margin-top: 0.2rem;
  color:
    rgba(
      255,
      255,
      255,
      0.34
    );
}

.unassigned-lesson__actions {
  display: flex;
  gap: 0.6rem;
  align-items: center;
}

.unassigned-lesson__actions a {
  padding:
    0.5rem
    0.7rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  color:
    variables.$color-white;
  font-size: 0.7rem;
  text-decoration: none;
}

/* =========================================================
   EMPTY PROGRAM
========================================================= */

.empty-program,
.student-empty {
  padding:
    clamp(
      2.2rem,
      7vw,
      5rem
    );
  border:
    1px dashed
    variables.$color-border;
  border-radius: 22px;
  text-align: center;
}

.empty-program__icon,
.student-empty > div {
  display: grid;
  width: 70px;
  height: 70px;
  margin:
    0 auto
    1.2rem;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 1.8rem;
}

.empty-program > span {
  color: variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

.empty-program h2,
.student-empty h2 {
  max-width: 650px;
  margin:
    0.7rem
    auto
    0;
  font-size:
    clamp(
      1.8rem,
      4vw,
      2.8rem
    );
}

.empty-program p,
.student-empty p {
  max-width: 610px;
  margin:
    1rem
    auto
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.44
    );
  line-height: 1.65;
}

.empty-program__actions {
  display: flex;
  gap: 0.7rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1.5rem;
}

/* =========================================================
   MODAL
========================================================= */

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  padding: 1.2rem;
  place-items: center;
  overflow-y: auto;
  background:
    rgba(
      0,
      0,
      0,
      0.9
    );
  backdrop-filter:
    blur(12px);
}

.unit-modal,
.delete-dialog {
  width:
    min(
      620px,
      100%
    );
  border:
    1px solid
    variables.$color-border;
  border-radius: 22px;
  background:
    variables.$color-background;
  box-shadow:
    0 28px 80px
    rgba(
      0,
      0,
      0,
      0.55
    );
}

.unit-modal {
  overflow: hidden;
}

.unit-modal__header {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom:
    1px solid
    variables.$color-border;
}

.unit-modal__header span {
  color: variables.$color-primary;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.unit-modal__header h2 {
  margin:
    0.35rem
    0
    0;
  font-size: 1.6rem;
}

.modal-close {
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  background: transparent;
  color: variables.$color-white;
  font-size: 1.3rem;
  cursor: pointer;
}

.unit-form {
  display: grid;
  gap: 1.15rem;
  padding: 1.5rem;
}

.unit-form label {
  display: grid;
  gap: 0.5rem;
}

.unit-form label > span {
  color:
    rgba(
      255,
      255,
      255,
      0.58
    );
  font-size: 0.75rem;
  font-weight: 700;
}

.unit-form input,
.unit-form textarea,
.unit-form select {
  width: 100%;
  padding:
    0.8rem
    0.9rem;
  border-radius: 11px;
}

.unit-form textarea {
  resize: vertical;
  line-height: 1.55;
}

.unit-form input:focus,
.unit-form textarea:focus,
.unit-form select:focus {
  border-color:
    variables.$color-primary;
}

.unit-form__grid {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    1fr
    1fr;
}

.unit-form__notice {
  padding: 1rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.22
    );
  border-radius: 12px;
  background:
    rgba(
      255,
      196,
      0,
      0.035
    );
}

.unit-form__notice strong {
  color: variables.$color-primary;
  font-size: 0.78rem;
}

.unit-form__notice p {
  margin:
    0.35rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.42
    );
  font-size: 0.72rem;
  line-height: 1.5;
}

.unit-form__error {
  margin: 0;
  padding: 0.8rem;
  border:
    1px solid
    rgba(
      232,
      92,
      92,
      0.35
    );
  border-radius: 10px;
  background:
    rgba(
      232,
      92,
      92,
      0.07
    );
  color: #ff7c7c;
  font-size: 0.75rem;
}

.unit-form__actions {
  display: grid;
  gap: 0.7rem;
  grid-template-columns:
    1fr
    1fr;
}

/* =========================================================
   DELETE DIALOG
========================================================= */

.delete-dialog {
  padding: 2rem;
  text-align: center;
}

.delete-dialog__icon {
  display: grid;
  width: 64px;
  height: 64px;
  margin:
    0 auto
    1rem;
  place-items: center;
  border:
    1px solid
    #e75d5d;
  border-radius: 50%;
  color: #ff7777;
  font-size: 1.55rem;
}

.delete-dialog__eyebrow {
  color: #ff7777;
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.delete-dialog h2 {
  margin:
    0.45rem
    0
    0.7rem;
}

.delete-dialog > strong {
  display: block;
  color: variables.$color-primary;
}

.delete-dialog p {
  max-width: 480px;
  margin:
    1rem
    auto
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
  line-height: 1.6;
}

.delete-dialog__warning {
  margin-top: 1.2rem;
  padding: 0.9rem;
  border:
    1px solid
    rgba(
      232,
      92,
      92,
      0.22
    );
  border-radius: 11px;
  background:
    rgba(
      232,
      92,
      92,
      0.05
    );
  color:
    rgba(
      255,
      255,
      255,
      0.5
    );
  font-size: 0.74rem;
}

.delete-dialog__actions {
  display: grid;
  gap: 0.7rem;
  grid-template-columns:
    1fr
    1fr;
  margin-top: 1.4rem;
}

.cancel-delete,
.confirm-delete {
  padding: 0.8rem;
  border-radius: 11px;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
}

.cancel-delete {
  border:
    1px solid
    variables.$color-border;
  background: transparent;
  color: variables.$color-white;
}

.confirm-delete {
  border:
    1px solid
    #d85252;
  background: #b83d3d;
  color: white;
}

.cancel-delete:disabled,
.confirm-delete:disabled {
  opacity: 0.45;
  cursor: wait;
}

/* =========================================================
   TOAST
========================================================= */

.program-toast {
  position: fixed;
  right: 1.5rem;
  bottom: 1.5rem;
  z-index: 100000;
  display: flex;
  gap: 0.8rem;
  align-items: center;
  width:
    min(
      420px,
      calc(
        100vw - 3rem
      )
    );
  padding:
    0.9rem
    1rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.4
    );
  border-radius: 14px;
  background:
    variables.$color-surface;
  box-shadow:
    0 18px 50px
    rgba(
      0,
      0,
      0,
      0.45
    );
}

.program-toast > span {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: #080808;
  font-weight: 900;
}

.program-toast strong,
.program-toast small {
  display: block;
}

.program-toast strong {
  font-size: 0.8rem;
}

.program-toast small {
  margin-top: 0.15rem;
  color:
    rgba(
      255,
      255,
      255,
      0.48
    );
}

.program-toast--error {
  border-color:
    rgba(
      232,
      92,
      92,
      0.55
    );
}

.program-toast--error > span {
  background: #e55e5e;
  color: white;
}

/* =========================================================
   TRANSITIONS
========================================================= */

.modal-enter-active,
.modal-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition:
    opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to,
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}

.unit-content-enter-active,
.unit-content-leave-active {
  transition:
    opacity 0.18s ease;
}

.unit-content-enter-from,
.unit-content-leave-to {
  opacity: 0;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1050px) {
  .program-hero {
    grid-template-columns: 1fr;
  }

  .teacher-mode {
    max-width: 480px;
  }

  .program-stats {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@media (max-width: 800px) {
  .program-hero {
    padding: 1.5rem;
  }

  .admin-panel,
  .section-heading,
  .unassigned__header {
    align-items: stretch;
    flex-direction: column;
  }

  .admin-panel__actions {
    width: 100%;
  }

  .admin-panel__actions
  .button {
    flex: 1;
  }

  .unit-card__metrics {
    grid-template-columns:
      1fr
      1fr;
  }

  .unit-card__progress {
    grid-column:
      1 / -1;
  }

  .unit-card__metrics
  > div:nth-child(2) {
    border-right: 0;
  }

  .unit-card__progress {
    padding-right: 0;
    border-right: 0 !important;
  }

  .lesson-card__admin {
    align-items: stretch;
    flex-direction: column;
  }

  .lesson-card__assignment {
    justify-content: space-between;
  }

  .unassigned-lesson {
    align-items: stretch;
    flex-direction: column;
  }

  .unassigned-lesson__actions {
    width: 100%;
  }

  .unassigned-lesson__actions select {
    flex: 1;
  }
}

@media (max-width: 600px) {
  .program {
    padding-bottom: 3rem;
  }

  .program-hero {
    border-radius: 18px;
  }

  .program-hero h1 {
    font-size:
      clamp(
        2.35rem,
        13vw,
        4rem
      );
  }

  .program-stats {
    grid-template-columns: 1fr;
  }

  .admin-panel__actions {
    flex-direction: column;
  }

  .unit-card__toggle {
    grid-template-columns:
      1fr
      auto;
    padding: 1.2rem;
  }

  .unit-card__number {
    display: none;
  }

  .unit-card__metrics {
    padding: 1rem 1.2rem;
  }

  .unit-card__admin {
    justify-content: stretch;
    padding:
      0.8rem
      1.2rem;
  }

  .unit-card__admin button {
    flex: 1;
  }

  .unit-card__body {
    padding: 0.75rem;
  }

  .lesson-card__main {
    grid-template-columns:
      40px
      minmax(0, 1fr);
  }

  .lesson-card__arrow {
    display: none;
  }

  .lesson-card__index {
    width: 38px;
    height: 38px;
  }

  .lesson-card__admin-main {
    display: grid;
    grid-template-columns:
      1fr
      1fr;
  }

  .lesson-admin-button {
    text-align: center;
  }

  .lesson-card__assignment {
    align-items: stretch;
    flex-direction: column;
  }

  .lesson-card__assignment select {
    width: 100%;
    max-width: none;
  }

  .unassigned-lesson__actions {
    align-items: stretch;
    flex-direction: column;
  }

  .unassigned-lesson__actions select,
  .unassigned-lesson__actions a {
    width: 100%;
  }

  .unit-form__grid,
  .unit-form__actions,
  .delete-dialog__actions {
    grid-template-columns: 1fr;
  }

  .program-toast {
    right: 0.8rem;
    bottom: 0.8rem;
    left: 0.8rem;
    width: auto;
  }
}

@media (max-width: 420px) {
  .program-hero {
    padding: 1.2rem;
  }

  .program-hero__meta {
    align-items: stretch;
    flex-direction: column;
  }

  .program-hero__meta span {
    width: fit-content;
  }

  .teacher-mode {
    align-items: flex-start;
    flex-direction: column;
  }

  .lesson-card__main {
    grid-template-columns: 1fr;
  }

  .lesson-card__index {
    width: 100%;
    height: 30px;
  }

  .lesson-card__admin-main {
    grid-template-columns: 1fr;
  }

  .unit-card__metrics {
    grid-template-columns: 1fr;
  }

  .unit-card__metrics > div {
    padding:
      0
      0
      0.7rem;
    border-right: 0;
    border-bottom:
      1px solid
      variables.$color-border;
  }

  .unit-card__metrics
  > div:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }
}


/* =========================================================
   V6.4 · PORTADAS VISUALES · UNIDADES + CLASES
========================================================= */

.program-page .unit-card__cover,
.program-formativo .unit-card__cover,
.unit-card__cover {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 6px;
  padding: 28px 30px;
  background-color: #172033;
  background-size: cover;
  background-position: center;
  color: #ffffff;
}

.unit-card__cover span {
  color: #f2c84b !important;
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .12em;
}

.unit-card__cover strong {
  max-width: 850px;
  color: #ffffff !important;
  font-size: clamp(1.25rem, 2vw, 1.8rem);
  font-weight: 900;
  line-height: 1.15;
}

/* Las portadas de clase aparecen como mini-banner lateral */
.lesson-card__main {
  grid-template-columns:
    auto
    auto
    minmax(0, 1fr)
    auto !important;
}

.lesson-card__cover {
  width: 150px;
  min-height: 112px;
  align-self: stretch;
  border-radius: 12px;
  background-color: #e9eef4;
  background-size: cover;
  background-position: center;
  box-shadow:
    inset 0 0 0 1px
    rgba(31,48,73,.08);
}

/* Editor de portada de unidad */
.unit-cover-editor {
  display: grid;
  gap: 12px;
  padding: 14px;
  border: 1px solid #dbe3ec;
  border-radius: 14px;
  background: #f8fafc;
}

.unit-cover-editor__heading {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.unit-cover-editor__heading > div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.unit-cover-editor__heading span {
  color: #987000;
  font-size: .58rem;
  font-weight: 900;
  letter-spacing: .08em;
}

.unit-cover-editor__heading strong {
  color: #152033;
  font-size: .88rem;
}

.unit-cover-editor__heading small {
  color: #6f7c8f;
  font-size: .62rem;
}

.unit-cover-editor__input {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  overflow: hidden !important;
  clip: rect(0 0 0 0) !important;
  clip-path: inset(50%) !important;
}

.unit-cover-editor__preview {
  min-height: 175px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 5px;
  padding: 22px;
  border: 1px dashed #cbd6e2;
  border-radius: 12px;
  background:
    linear-gradient(
      135deg,
      #eef2f6,
      #f8fafc
    );
  background-size: cover;
  background-position: center;
}

.unit-cover-editor__preview span {
  color: #987000;
  font-size: .58rem;
  font-weight: 900;
  letter-spacing: .10em;
}

.unit-cover-editor__preview strong {
  color: #152033;
  font-size: 1.25rem;
  font-weight: 900;
}

.unit-cover-editor__preview small {
  max-width: 600px;
  color: #667085;
  line-height: 1.45;
}

.unit-cover-editor__preview--has-image span {
  color: #f2c84b !important;
}

.unit-cover-editor__preview--has-image strong {
  color: #ffffff !important;
}

.unit-cover-editor__preview--has-image small {
  color: rgba(255,255,255,.82) !important;
}

.unit-cover-editor__actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.unit-cover-button {
  min-height: 38px;
  padding: 0 12px;
  border: 1px solid #cbd6e2;
  border-radius: 9px;
  background: #ffffff;
  color: #344359;
  font-weight: 850;
  cursor: pointer;
}

.unit-cover-button--primary {
  border-color: #9f1945;
  background: #9f1945;
  color: #ffffff;
}

.unit-cover-button--primary:hover {
  border-color: #7f1237;
  background: #7f1237;
}

.unit-cover-button:disabled {
  cursor: wait;
  opacity: .6;
}

.unit-cover-editor__error {
  margin: 0;
  color: #be4856 !important;
  font-size: .66rem;
  font-weight: 750;
}

@media (max-width: 900px) {
  .lesson-card__main {
    grid-template-columns:
      auto
      minmax(0, 1fr)
      auto !important;
  }

  .lesson-card__cover {
    grid-column: 1 / -1;
    width: 100%;
    min-height: 160px;
  }
}

@media (max-width: 620px) {
  .unit-card__cover {
    min-height: 160px;
    padding: 22px;
  }

  .unit-cover-editor__heading {
    flex-direction: column;
  }

  .unit-cover-editor__actions {
    flex-direction: column;
  }

  .unit-cover-button {
    width: 100%;
  }
}



/* =========================================================
   V6.5 · BANNERS VISIBLES + ACCESO CLARO DE EDICIÓN
========================================================= */

.unit-card__cover {
  position: relative;
  min-height: 190px;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  overflow: hidden;
  padding: 26px 28px;
  background-color: #172033;
  background-size: cover;
  background-position: center;
}

.unit-card__cover--empty {
  border-bottom: 1px solid #e4d6aa;
  background:
    radial-gradient(
      circle at 92% 18%,
      rgba(217,169,28,.18),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      #ffffff 0%,
      #fffdfa 58%,
      #fff8e8 100%
    );
}

.unit-card__cover-copy {
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 5px;
}

.unit-card__cover-copy span {
  color: #f2c84b !important;
  font-size: .62rem;
  font-weight: 900;
  letter-spacing: .12em;
}

.unit-card__cover--empty
.unit-card__cover-copy span {
  color: #987000 !important;
}

.unit-card__cover-copy strong {
  max-width: 860px;
  color: #ffffff !important;
  font-size: clamp(1.25rem,2vw,1.8rem);
  font-weight: 900;
  line-height: 1.15;
}

.unit-card__cover--empty
.unit-card__cover-copy strong {
  color: #152033 !important;
}

.unit-card__cover-copy small {
  color: #6f7c8f !important;
  font-size: .68rem;
}

.unit-card__cover-action {
  flex: 0 0 auto;
  min-height: 40px;
  padding: 0 13px;
  border: 1px solid rgba(255,255,255,.55);
  border-radius: 10px;
  background: rgba(255,255,255,.92);
  color: #152033;
  font-weight: 900;
  cursor: pointer;
}

.unit-card__cover--empty
.unit-card__cover-action {
  border-color: #9f1945;
  background: #9f1945;
  color: #ffffff;
}

.unit-card__admin .unit-card__edit {
  border: 1px solid #9f1945 !important;
  background: #fffafb !important;
  color: #9f1945 !important;
  opacity: 1 !important;
}

.unit-card__admin .unit-card__edit:hover {
  background: #9f1945 !important;
  color: #ffffff !important;
}

.lesson-card__cover {
  position: relative;
  overflow: hidden;
  background-color: #edf2f7;
}

.lesson-card__cover--empty {
  display: grid;
  place-items: center;
  border: 1px dashed #cbd6e2;
  background:
    linear-gradient(
      135deg,
      #f8fafc,
      #eef2f6
    );
}

.lesson-card__cover--empty span {
  color: #8a96a8 !important;
  font-size: .58rem;
  font-weight: 800;
  letter-spacing: .05em;
}

@media (max-width: 760px) {
  .unit-card__cover {
    min-height: 165px;
    align-items: flex-start;
    flex-direction: column;
  }

  .unit-card__cover-action {
    width: 100%;
  }
}

</style>
