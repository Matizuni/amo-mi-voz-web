<template>
  <section class="program">
    <!-- =====================================================
         HEADER
    ====================================================== -->

    <header class="program__header">
      <div class="program__intro">
        <p class="program__eyebrow">
          Programa Formativo
        </p>

        <h1>
          Canto, música e interpretación
        </h1>

        <p>
          Septiembre — Diciembre 2026
        </p>
      </div>

      <div
        v-if="isTeacher"
        class="program__teacher-panel"
      >
        <span>
          MODO PROFESOR
        </span>

        <strong>
          Gestión del programa
        </strong>

        <small>
          Clases sincronizadas con Supabase.
        </small>
      </div>
    </header>

    <!-- =====================================================
         CARGANDO
    ====================================================== -->

    <section
      v-if="isLoading"
      class="loading-state"
    >
      <div class="loading-spinner"></div>

      <strong>
        Cargando programa...
      </strong>

      <p>
        Obteniendo las clases desde Supabase.
      </p>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->

    <section
      v-else-if="loadError"
      class="error-state"
    >
      <div>
        !
      </div>

      <h2>
        No pudimos cargar las clases
      </h2>

      <p>
        {{ loadError }}
      </p>

      <button
        type="button"
        @click="loadLessons"
      >
        Reintentar
      </button>
    </section>

    <template v-else>
      <!-- ===================================================
           RESUMEN
      ==================================================== -->

      <section class="program__stats">
        <article>
          <span>
            Total de clases
          </span>

          <strong>
            {{ lessons.length }}
          </strong>
        </article>

        <article>
          <span>
            Disponibles
          </span>

          <strong>
            {{ availableCount }}
          </strong>
        </article>

        <article>
          <span>
            Realizadas
          </span>

          <strong>
            {{ completedCount }}
          </strong>
        </article>
      </section>

      <!-- ===================================================
           ADMIN PROFESOR
      ==================================================== -->

      <section
        v-if="isTeacher"
        class="program-admin"
      >
        <div>
          <span>
            ADMINISTRACIÓN
          </span>

          <strong>
            Programa de clases
          </strong>

          <small>
            {{
              lessons.length
            }}
            clases guardadas actualmente
            en la base de datos.
          </small>
        </div>

        <RouterLink
          to="/aula/clases/nueva"
          class="new-lesson-button"
        >
          + Nueva clase
        </RouterLink>
      </section>

      <!-- ===================================================
           CLASES
      ==================================================== -->

      <div
        v-if="lessons.length"
        class="program__classes"
      >
        <article
          v-for="lesson in lessons"
          :key="lesson.id"
          class="lesson-card"
        >
          <!-- VER CLASE -->

          <RouterLink
            :to="`/aula/clase/${lesson.id}`"
            class="lesson-card__main"
          >
            <div class="lesson-card__number">
              {{
                String(lesson.id)
                  .padStart(2, '0')
              }}
            </div>

            <div class="lesson-card__content">
              <div class="lesson-card__topline">
                <span>
                  {{ lesson.date }}
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

              <h2>
                {{ lesson.title }}
              </h2>

              <p>
                {{
                  lesson.description ||
                  'Sin descripción.'
                }}
              </p>

              <div class="lesson-card__meta">
                <span v-if="lesson.time">
                  {{ lesson.time }}
                </span>

                <span v-if="lesson.duration">
                  {{ lesson.duration }}
                </span>

                <span v-if="lesson.modality">
                  {{ lesson.modality }}
                </span>
              </div>
            </div>

            <div class="lesson-card__arrow">
              →
            </div>
          </RouterLink>

          <!-- =================================================
               CONTROLES PROFESOR
          ================================================== -->

          <footer
            v-if="isTeacher"
            class="lesson-card__admin"
          >
            <RouterLink
              :to="`/aula/clase/${lesson.id}/editar`"
              class="admin-button admin-button--edit"
            >
              ✎ Editar
            </RouterLink>

            <RouterLink
              :to="`/aula/clase/${lesson.id}/trabajo`"
              class="admin-button"
            >
              Recursos y tareas
            </RouterLink>

            <button
              type="button"
              class="admin-button"
              :disabled="actionLoadingId === lesson.id"
              @click="
                handleDuplicate(
                  lesson
                )
              "
            >
              {{
                actionLoadingId === lesson.id
                  ? 'Procesando...'
                  : '⧉ Duplicar'
              }}
            </button>

            <button
              type="button"
              class="admin-button admin-button--danger"
              :disabled="actionLoadingId === lesson.id"
              @click="
                askDelete(
                  lesson
                )
              "
            >
              🗑 Eliminar
            </button>
          </footer>
        </article>
      </div>

      <!-- ===================================================
           SIN CLASES
      ==================================================== -->

      <section
        v-else
        class="empty-program"
      >
        <div>
          +
        </div>

        <h2>
          Todavía no hay clases
        </h2>

        <p>
          Crea la primera clase
          del programa formativo.
        </p>

        <RouterLink
          v-if="isTeacher"
          to="/aula/clases/nueva"
        >
          + Crear primera clase
        </RouterLink>
      </section>
    </template>

    <!-- =====================================================
         ELIMINAR CLASE
    ====================================================== -->

    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="lessonToDelete"
          class="delete-modal"
          @click.self="closeDeleteModal"
        >
          <article class="delete-dialog">
            <div class="delete-dialog__icon">
              !
            </div>

            <span class="delete-dialog__eyebrow">
              ELIMINAR CLASE
            </span>

            <h2>
              ¿Eliminar esta clase?
            </h2>

            <strong>
              Clase
              {{ lessonToDelete.id }}
              ·
              {{ lessonToDelete.title }}
            </strong>

            <p>
              La clase será eliminada
              directamente de Supabase.
            </p>

            <div class="delete-dialog__warning">
              Los materiales y tareas relacionados
              todavía no se eliminarán automáticamente.
            </div>

            <footer class="delete-dialog__actions">
              <button
                type="button"
                class="cancel-delete"
                :disabled="isDeleting"
                @click="closeDeleteModal"
              >
                Cancelar
              </button>

              <button
                type="button"
                class="confirm-delete"
                :disabled="isDeleting"
                @click="confirmDelete"
              >
                {{
                  isDeleting
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
                ? 'Error'
                : 'Listo'
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
  ref
} from 'vue'

import {
  RouterLink,
  useRouter
} from 'vue-router'

import {
  useAuth
} from '@/composables/useAuth'

import {
  fetchLessons,
  cloneLesson,
  removeLesson
} from '@/services/lessonService'

const router = useRouter()

const {
  isTeacher
} = useAuth()

/* =========================================================
   ESTADO
========================================================= */

const lessons = ref([])

const isLoading = ref(true)

const loadError = ref('')

const actionLoadingId = ref(null)

const isDeleting = ref(false)

const lessonToDelete = ref(null)

const toastMessage = ref('')

const toastType = ref('success')

let toastTimer = null

/* =========================================================
   CARGAR SUPABASE
========================================================= */

const loadLessons = async () => {
  isLoading.value = true

  loadError.value = ''

  try {
    lessons.value =
      await fetchLessons()

    console.log(
      'Clases cargadas desde Supabase:',
      lessons.value
    )
  } catch (error) {
    console.error(
      'Error cargando programa:',
      error
    )

    loadError.value =
      error?.message ||
      'No se pudo conectar con la base de datos.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   CONTADORES
========================================================= */

const availableCount =
  computed(() => {
    return lessons.value.filter(
      lesson =>
        lesson.status === 'available' ||
        lesson.status === 'planned' ||
        lesson.status === 'published'
    ).length
  })

const completedCount =
  computed(() => {
    return lessons.value.filter(
      lesson =>
        lesson.status === 'completed'
    ).length
  })

/* =========================================================
   ESTADOS
========================================================= */

const getStatusLabel = status => {
  const labels = {
    available:
      'Disponible',

    planned:
      'Planificada',

    published:
      'Publicada',

    completed:
      'Realizada'
  }

  return (
    labels[status] ||
    'Disponible'
  )
}

/* =========================================================
   TOAST
========================================================= */

const showToast = (
  message,
  type = 'success'
) => {
  clearTimeout(
    toastTimer
  )

  toastMessage.value =
    message

  toastType.value =
    type

  toastTimer =
    setTimeout(() => {
      toastMessage.value = ''
    }, 3000)
}

/* =========================================================
   DUPLICAR EN SUPABASE
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
          lesson
        )

      await loadLessons()

      showToast(
        `Clase ${lesson.id} duplicada como Clase ${duplicated.id}.`
      )

      setTimeout(() => {
        router.push(
          `/aula/clase/${duplicated.id}/editar`
        )
      }, 500)
    } catch (error) {
      console.error(
        'Error duplicando clase:',
        error
      )

      showToast(
        error?.message ||
        'No se pudo duplicar la clase.',
        'error'
      )
    } finally {
      actionLoadingId.value =
        null
    }
  }

/* =========================================================
   ELIMINAR
========================================================= */

const askDelete = lesson => {
  lessonToDelete.value =
    lesson

  document.body.style.overflow =
    'hidden'
}

const closeDeleteModal = () => {
  if (isDeleting.value) {
    return
  }

  lessonToDelete.value =
    null

  document.body.style.overflow =
    ''
}

const confirmDelete = async () => {
  const lesson =
    lessonToDelete.value

  if (
    !lesson ||
    isDeleting.value
  ) {
    return
  }

  isDeleting.value = true

  try {
    await removeLesson(
      lesson.id
    )

    lessonToDelete.value =
      null

    document.body.style.overflow =
      ''

    await loadLessons()

    showToast(
      `Clase ${lesson.id} eliminada de Supabase.`
    )
  } catch (error) {
    console.error(
      'Error eliminando clase:',
      error
    )

    showToast(
      error?.message ||
      'No se pudo eliminar la clase.',
      'error'
    )
  } finally {
    isDeleting.value =
      false
  }
}

/* =========================================================
   INICIO
========================================================= */

onMounted(() => {
  loadLessons()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.program {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

/* =========================================================
   HEADER
========================================================= */

.program__header {
  display: flex;
  gap: variables.$spacing-2xl;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: variables.$spacing-2xl;
}

.program__intro {
  max-width: 850px;
}

.program__eyebrow {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.program__header h1 {
  margin-bottom: variables.$spacing-md;
  font-size:
    clamp(
      2.8rem,
      6vw,
      5rem
    );
}

.program__header p:last-child {
  opacity: 0.65;
}

/* =========================================================
   PANEL PROFESOR
========================================================= */

.program__teacher-panel {
  min-width: 250px;
  padding: variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.program__teacher-panel span,
.program__teacher-panel strong,
.program__teacher-panel small {
  display: block;
}

.program__teacher-panel span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.program__teacher-panel small {
  margin-top: 4px;
  line-height: 1.4;
  opacity: 0.5;
}

/* =========================================================
   LOADING
========================================================= */

.loading-state,
.error-state {
  display: grid;
  min-height: 350px;
  gap: variables.$spacing-md;
  place-items: center;
  align-content: center;
  padding: variables.$spacing-3xl;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  text-align: center;
}

.loading-state p,
.error-state p {
  margin: 0;
  opacity: 0.5;
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
    spin
    0.8s linear infinite;
}

@keyframes spin {
  to {
    transform:
      rotate(360deg);
  }
}

.error-state > div {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border:
    1px solid
    #e95f5f;
  border-radius: 50%;
  color: #ff7777;
  font-size: 1.8rem;
}

.error-state button {
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-primary;
  color: variables.$color-white;
  font: inherit;
  cursor: pointer;
}

/* =========================================================
   STATS
========================================================= */

.program__stats {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns:
    repeat(
      3,
      minmax(0, 1fr)
    );
  margin-bottom: variables.$spacing-xl;
}

.program__stats article {
  padding: variables.$spacing-lg;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.program__stats span,
.program__stats strong {
  display: block;
}

.program__stats span {
  margin-bottom: 5px;
  opacity: 0.45;
}

.program__stats strong {
  color: variables.$color-primary;
  font-size: 1.8rem;
}

/* =========================================================
   ADMIN
========================================================= */

.program-admin {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: center;
  justify-content: space-between;
  margin-bottom: variables.$spacing-3xl;
  padding: variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.program-admin span,
.program-admin strong,
.program-admin small {
  display: block;
}

.program-admin span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.program-admin small {
  margin-top: 4px;
  opacity: 0.5;
}

.new-lesson-button {
  flex-shrink: 0;
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-radius: variables.$radius-lg;
  background: variables.$color-primary;
  color: variables.$color-white;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

/* =========================================================
   CLASES
========================================================= */

.program__classes {
  display: grid;
  gap: variables.$spacing-lg;
}

.lesson-card {
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  transition:
    border-color 0.2s ease,
    transform 0.2s ease;
}

.lesson-card:hover {
  border-color: variables.$color-primary;
  transform: translateY(-2px);
}

.lesson-card__main {
  display: grid;
  gap: variables.$spacing-xl;
  align-items: center;
  grid-template-columns:
    auto
    1fr
    auto;
  padding: variables.$spacing-xl;
  color: inherit;
  text-decoration: none;
}

.lesson-card__number {
  min-width: 90px;
  color: variables.$color-primary;
  font-family: variables.$font-family-heading;
  font-size:
    clamp(
      2.2rem,
      5vw,
      4rem
    );
}

.lesson-card__topline {
  display: flex;
  gap: variables.$spacing-sm;
  align-items: center;
  justify-content: space-between;
  margin-bottom: variables.$spacing-sm;
}

.lesson-card__topline > span:first-child {
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  text-transform: uppercase;
}

.lesson-card__content h2 {
  margin:
    variables.$spacing-sm
    0;
  font-size: variables.$font-size-xl;
}

.lesson-card__content > p {
  margin: 0;
  line-height: 1.55;
  opacity: 0.65;
}

.lesson-card__meta {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: variables.$spacing-md;
}

.lesson-card__meta span {
  padding:
    5px
    9px;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  font-size: variables.$font-size-xs;
  opacity: 0.5;
}

.lesson-card__arrow {
  color: variables.$color-primary;
  font-size: 2rem;
}

/* =========================================================
   ESTADOS
========================================================= */

.lesson-status {
  padding:
    5px
    9px;
  border-radius: 999px;
  font-size: variables.$font-size-xs;
  text-transform: none !important;
}

.lesson-status--available,
.lesson-status--published {
  border:
    1px solid
    variables.$color-primary;
  color: variables.$color-primary;
}

.lesson-status--planned {
  border:
    1px solid
    variables.$color-border;
  color: variables.$color-white;
  opacity: 0.55;
}

.lesson-status--completed {
  background: variables.$color-primary;
  color: variables.$color-white;
}

/* =========================================================
   ADMIN CLASE
========================================================= */

.lesson-card__admin {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  flex-wrap: wrap;
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-top:
    1px solid
    variables.$color-border;
  background: variables.$color-background;
}

.admin-button {
  padding:
    8px
    11px;
  border:
    1px solid
    variables.$color-border;
  border-radius: variables.$radius-lg;
  background: transparent;
  color: variables.$color-white;
  font: inherit;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
}

.admin-button:hover:not(:disabled) {
  border-color: variables.$color-primary;
}

.admin-button:disabled {
  opacity: 0.4;
  cursor: wait;
}

.admin-button--edit {
  border-color: variables.$color-primary;
  color: variables.$color-primary;
}

.admin-button--danger {
  border-color:
    rgba(
      220,
      70,
      70,
      0.55
    );
  color: #ff7676;
}

/* =========================================================
   EMPTY
========================================================= */

.empty-program {
  padding: variables.$spacing-3xl;
  border:
    1px dashed
    variables.$color-border;
  border-radius: variables.$radius-lg;
  text-align: center;
}

.empty-program > div {
  display: grid;
  width: 70px;
  height: 70px;
  margin:
    0 auto
    variables.$spacing-lg;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 2rem;
}

.empty-program p {
  opacity: 0.55;
}

.empty-program a {
  display: inline-block;
  margin-top: variables.$spacing-lg;
  color: variables.$color-primary;
}

/* =========================================================
   ELIMINAR
========================================================= */

.delete-modal {
  position: fixed;
  inset: 0;
  z-index: 99999;
  display: grid;
  padding: 20px;
  place-items: center;
  background:
    rgba(
      0,
      0,
      0,
      0.93
    );
  backdrop-filter: blur(10px);
}

.delete-dialog {
  width:
    min(
      520px,
      95vw
    );
  padding: variables.$spacing-2xl;
  border:
    1px solid
    rgba(
      220,
      70,
      70,
      0.55
    );
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
  text-align: center;
}

.delete-dialog__icon {
  display: grid;
  width: 70px;
  height: 70px;
  margin:
    0 auto
    variables.$spacing-lg;
  place-items: center;
  border: 1px solid #e05252;
  border-radius: 50%;
  color: #ff7676;
  font-size: 2rem;
}

.delete-dialog__eyebrow {
  color: #ff7676;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.delete-dialog h2 {
  margin:
    variables.$spacing-sm
    0
    variables.$spacing-md;
}

.delete-dialog > strong {
  display: block;
  color: variables.$color-primary;
}

.delete-dialog p {
  line-height: 1.55;
  opacity: 0.6;
}

.delete-dialog__warning {
  margin:
    variables.$spacing-lg
    0;
  padding: variables.$spacing-md;
  border:
    1px solid
    rgba(
      220,
      70,
      70,
      0.2
    );
  border-radius: variables.$radius-lg;
  background:
    rgba(
      220,
      70,
      70,
      0.06
    );
  font-size: variables.$font-size-sm;
}

.delete-dialog__actions {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns:
    1fr
    1fr;
}

.cancel-delete,
.confirm-delete {
  padding: variables.$spacing-md;
  border-radius: variables.$radius-lg;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
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
    #d85151;
  background: #b93838;
  color: white;
}

/* =========================================================
   TOAST
========================================================= */

.program-toast {
  position: fixed;
  right: 25px;
  bottom: 25px;
  z-index: 99999;
  display: flex;
  gap: 10px;
  align-items: center;
  max-width: 420px;
  padding:
    variables.$spacing-md
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  color: variables.$color-primary;
}

.program-toast--error {
  border-color: #d85151;
  color: #ff7676;
}

.program-toast > span {
  display: grid;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: currentColor;
  color: variables.$color-background;
}

.program-toast strong,
.program-toast small {
  display: block;
}

.program-toast small {
  margin-top: 2px;
  opacity: 0.65;
}

.modal-enter-active,
.modal-leave-active,
.toast-enter-active,
.toast-leave-active {
  transition: opacity 0.18s ease;
}

.modal-enter-from,
.modal-leave-to,
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .program__header {
    align-items: stretch;
    flex-direction: column;
  }

  .program__teacher-panel {
    width: 100%;
  }
}

@media (max-width: 750px) {
  .program__stats {
    grid-template-columns: 1fr;
  }

  .program-admin {
    align-items: flex-start;
    flex-direction: column;
  }

  .new-lesson-button {
    width: 100%;
    text-align: center;
  }

  .lesson-card__main {
    grid-template-columns: 1fr;
  }

  .lesson-card__number {
    min-width: 0;
  }

  .lesson-card__arrow {
    display: none;
  }

  .lesson-card__admin {
    display: grid;
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .admin-button {
    text-align: center;
  }
}

@media (max-width: 500px) {
  .lesson-card__admin {
    grid-template-columns: 1fr;
  }

  .lesson-card__topline {
    align-items: flex-start;
    flex-direction: column;
  }

  .delete-dialog__actions {
    grid-template-columns: 1fr;
  }

  .program-toast {
    right: 12px;
    bottom: 12px;
    left: 12px;
    max-width: none;
  }
}
</style>