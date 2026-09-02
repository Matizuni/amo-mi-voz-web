<template>
  <section class="lesson">
    <!-- =====================================================
         CARGA
    ====================================================== -->
    <section
      v-if="isLoading"
      class="state-card"
    >
      <div class="loading-spinner"></div>
      <strong>Cargando clase...</strong>
      <p>Sincronizando planificación, recursos y tareas.</p>
    </section>

    <!-- =====================================================
         ERROR
    ====================================================== -->
    <section
      v-else-if="loadError"
      class="state-card state-card--error"
    >
      <div class="state-card__icon">!</div>

      <h1>No pudimos cargar la clase</h1>

      <p>{{ loadError }}</p>

      <div class="state-card__actions">
        <button
          type="button"
          @click="loadLesson"
        >
          Reintentar
        </button>

        <RouterLink to="/aula/programa-formativo">
          Volver al programa
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         CLASE
    ====================================================== -->
    <template v-else-if="lesson">
      <div class="lesson__topbar">
        <RouterLink
          to="/aula/programa-formativo"
          class="lesson__back"
        >
          ← Volver al programa
        </RouterLink>

        <div
          v-if="isTeacher"
          class="lesson__teacher-actions"
        >
          <RouterLink
            :to="`/aula/clase/${lesson.id}/editar`"
            class="teacher-button teacher-button--primary"
          >
            ✎ Editar clase
          </RouterLink>

          <RouterLink
            :to="`/aula/clase/${lesson.id}/trabajo`"
            class="teacher-button"
          >
            Recursos y tareas
          </RouterLink>
        </div>
      </div>

      <!-- ===================================================
           HERO
      ==================================================== -->
      <header class="lesson__hero">
        <div class="lesson__hero-main">
          <div class="lesson__hero-number">
            <span>CLASE</span>

            <strong>
              {{ String(lesson.id).padStart(2, '0') }}
            </strong>
          </div>

          <div class="lesson__hero-copy">
            <div class="lesson__hero-meta">
              <span>{{ lesson.date || 'Fecha por definir' }}</span>

              <span
                class="status-badge"
                :class="`status-badge--${lesson.status || 'available'}`"
              >
                {{ getStatusLabel(lesson.status) }}
              </span>
            </div>

            <h1>{{ lesson.title }}</h1>

            <p class="lesson__lead">
              {{
                lesson.description ||
                'Esta clase todavía no tiene una descripción publicada.'
              }}
            </p>

            <div class="lesson__chips">
              <span v-if="lesson.time">◷ {{ lesson.time }}</span>
              <span v-if="lesson.duration">{{ lesson.duration }}</span>
              <span v-if="lesson.modality">{{ lesson.modality }}</span>
              <span v-if="lesson.location">{{ lesson.location }}</span>
            </div>
          </div>
        </div>

        <RouterLink
          :to="`/aula/clase/${lesson.id}/trabajo`"
          class="classwork-button"
        >
          <div>
            <span>TRABAJO DE CLASE</span>
            <strong>Recursos, tareas y entregas</strong>
          </div>

          <b>→</b>
        </RouterLink>
      </header>

      <!-- ===================================================
           RESUMEN
      ==================================================== -->
      <section class="lesson__summary">
        <article>
          <span>Objetivos</span>
          <strong>{{ objectives.length }}</strong>
        </article>

        <article>
          <span>Contenidos</span>
          <strong>{{ contents.length }}</strong>
        </article>

        <article>
          <span>Actividades</span>
          <strong>{{ activities.length }}</strong>
        </article>

        <article>
          <span>Repertorio</span>
          <strong>{{ repertoire.length }}</strong>
        </article>

        <article class="lesson__summary--live">
          <span>Recursos</span>
          <strong>{{ lessonMaterials.length }}</strong>
          <small>Supabase</small>
        </article>

        <article class="lesson__summary--live">
          <span>Tareas</span>
          <strong>{{ publishedAssignments.length }}</strong>
          <small>Supabase</small>
        </article>
      </section>

      <!-- ===================================================
           FOCO
      ==================================================== -->
      <section
        v-if="lesson.focus"
        class="focus-card"
      >
        <div class="focus-card__icon">◎</div>

        <div>
          <span>FOCO PEDAGÓGICO</span>
          <h2>{{ lesson.focus }}</h2>
        </div>
      </section>

      <!-- ===================================================
           CONTENIDO
      ==================================================== -->
      <div class="lesson__layout">
        <aside class="lesson__sidebar">
          <div class="lesson__sidebar-title">
            <span>CONTENIDO</span>
            <strong>
              Clase {{ String(lesson.id).padStart(2, '0') }}
            </strong>
          </div>

          <nav>
            <a href="#overview">01 · Descripción</a>

            <a
              v-if="objectives.length"
              href="#objectives"
            >
              02 · Objetivos
            </a>

            <a
              v-if="contents.length"
              href="#contents"
            >
              03 · Contenidos
            </a>

            <a
              v-if="activities.length"
              href="#activities"
            >
              04 · Actividades
            </a>

            <a
              v-if="repertoire.length"
              href="#repertoire"
            >
              05 · Repertorio
            </a>

            <a href="#resources">
              06 · Recursos y tareas
            </a>
          </nav>

          <RouterLink
            :to="`/aula/clase/${lesson.id}/trabajo`"
            class="sidebar-classwork"
          >
            Abrir trabajo de clase
            <span>→</span>
          </RouterLink>
        </aside>

        <main class="lesson__content">
          <!-- ===============================================
               01 · DESCRIPCIÓN
          ================================================ -->
          <article
            id="overview"
            class="lesson-block lesson-block--overview"
          >
            <div class="lesson-block__number">01</div>

            <div class="lesson-block__body">
              <p class="lesson-block__category">Introducción</p>

              <h2>Sobre esta clase</h2>

              <p class="lesson-block__lead">
                {{
                  lesson.description ||
                  'Aún no se ha publicado una descripción detallada para esta clase.'
                }}
              </p>

              <div class="class-info-grid">
                <article>
                  <span>Fecha</span>
                  <strong>{{ lesson.date || 'Por definir' }}</strong>
                </article>

                <article>
                  <span>Horario</span>
                  <strong>{{ lesson.time || 'Por definir' }}</strong>
                </article>

                <article>
                  <span>Duración</span>
                  <strong>{{ lesson.duration || 'Por definir' }}</strong>
                </article>

                <article>
                  <span>Modalidad</span>
                  <strong>{{ lesson.modality || 'Por definir' }}</strong>
                </article>

                <article>
                  <span>Lugar</span>
                  <strong>{{ lesson.location || 'Por definir' }}</strong>
                </article>

                <article>
                  <span>Estado</span>
                  <strong>{{ getStatusLabel(lesson.status) }}</strong>
                </article>
              </div>
            </div>
          </article>

          <!-- ===============================================
               02 · OBJETIVOS
          ================================================ -->
          <article
            v-if="objectives.length"
            id="objectives"
            class="lesson-block"
          >
            <div class="lesson-block__number">02</div>

            <div class="lesson-block__body">
              <p class="lesson-block__category">Aprendizaje</p>
              <h2>Objetivos de aprendizaje</h2>

              <div class="objective-list">
                <article
                  v-for="(objective, index) in objectives"
                  :key="`objective-${index}`"
                >
                  <span>
                    {{ String(index + 1).padStart(2, '0') }}
                  </span>

                  <p>{{ objective }}</p>
                </article>
              </div>
            </div>
          </article>

          <!-- ===============================================
               03 · CONTENIDOS
          ================================================ -->
          <article
            v-if="contents.length"
            id="contents"
            class="lesson-block"
          >
            <div class="lesson-block__number">03</div>

            <div class="lesson-block__body">
              <p class="lesson-block__category">Formación</p>
              <h2>Contenidos de la clase</h2>

              <div class="content-grid">
                <article
                  v-for="(content, index) in contents"
                  :key="`content-${index}`"
                  class="content-card"
                >
                  <div>
                    {{ String(index + 1).padStart(2, '0') }}
                  </div>

                  <p>{{ content }}</p>
                </article>
              </div>
            </div>
          </article>

          <!-- ===============================================
               04 · ACTIVIDADES
          ================================================ -->
          <article
            v-if="activities.length"
            id="activities"
            class="lesson-block lesson-block--activities"
          >
            <div class="lesson-block__number">04</div>

            <div class="lesson-block__body">
              <p class="lesson-block__category">Práctica</p>
              <h2>Actividades</h2>

              <div class="activity-list">
                <article
                  v-for="(activity, index) in activities"
                  :key="`activity-${index}`"
                >
                  <div class="activity-list__icon">✓</div>

                  <div>
                    <span>
                      ACTIVIDAD {{ String(index + 1).padStart(2, '0') }}
                    </span>

                    <strong>{{ activity }}</strong>
                  </div>
                </article>
              </div>
            </div>
          </article>

          <!-- ===============================================
               05 · REPERTORIO
          ================================================ -->
          <article
            v-if="repertoire.length"
            id="repertoire"
            class="lesson-block lesson-block--repertoire"
          >
            <div class="lesson-block__number">05</div>

            <div class="lesson-block__body">
              <p class="lesson-block__category">Interpretación</p>
              <h2>Repertorio</h2>

              <div class="repertoire-grid">
                <article
                  v-for="(song, index) in repertoire"
                  :key="`song-${index}`"
                >
                  <div class="repertoire-grid__number">♪</div>

                  <div>
                    <span>
                      OBRA {{ String(index + 1).padStart(2, '0') }}
                    </span>

                    <strong>{{ song }}</strong>
                  </div>
                </article>
              </div>
            </div>
          </article>

          <!-- ===============================================
               06 · RECURSOS Y TAREAS
          ================================================ -->
          <article
            id="resources"
            class="lesson-block lesson-block--resources"
          >
            <div class="lesson-block__number">06</div>

            <div class="lesson-block__body">
              <p class="lesson-block__category">Aula Virtual</p>

              <h2>Recursos y trabajo de clase</h2>

              <p class="lesson-block__lead">
                Partituras, audios, documentos, actividades,
                tareas y entregas correspondientes a esta clase.
              </p>

              <div class="resource-summary">
                <article>
                  <span>RECURSOS</span>
                  <strong>{{ lessonMaterials.length }}</strong>
                  <small>archivos disponibles</small>
                </article>

                <article>
                  <span>TAREAS</span>
                  <strong>{{ publishedAssignments.length }}</strong>
                  <small>actividades publicadas</small>
                </article>
              </div>

              <div
                v-if="previewMaterials.length"
                class="materials-preview"
              >
                <article
                  v-for="material in previewMaterials"
                  :key="material.id"
                >
                  <div class="materials-preview__icon">
                    {{ getMaterialIcon(material.type) }}
                  </div>

                  <div>
                    <span>{{ getMaterialType(material.type) }}</span>
                    <strong>{{ material.title }}</strong>
                    <small>{{ getVoiceLabel(material.voice) }}</small>
                  </div>
                </article>
              </div>

              <div
                v-else
                class="no-resources"
              >
                <span>i</span>

                <p>
                  Todavía no hay archivos publicados para esta clase.
                </p>
              </div>

              <div
                v-if="previewAssignments.length"
                class="assignments-preview"
              >
                <RouterLink
                  v-for="task in previewAssignments"
                  :key="task.id"
                  :to="`/aula/clase/${lesson.id}/tarea/${task.id}`"
                >
                  <div class="assignments-preview__icon">
                    {{ getAssignmentIcon(task.type) }}
                  </div>

                  <div>
                    <span>{{ getAssignmentType(task.type) }}</span>
                    <strong>{{ task.title }}</strong>
                    <small>
                      {{ task.points ?? 100 }} pts ·
                      {{ task.dueDate ? formatDate(task.dueDate) : 'Sin fecha límite' }}
                    </small>
                  </div>

                  <b>→</b>
                </RouterLink>
              </div>

              <div
                v-else
                class="no-resources"
              >
                <span>✓</span>

                <p>
                  Todavía no hay tareas publicadas para esta clase.
                </p>
              </div>

              <RouterLink
                :to="`/aula/clase/${lesson.id}/trabajo`"
                class="open-classwork"
              >
                <div>
                  <span>ABRIR AULA DE LA CLASE</span>
                  <strong>Recursos, tareas y entregas</strong>
                </div>

                <b>→</b>
              </RouterLink>
            </div>
          </article>

          <!-- ===============================================
               PROFESOR
          ================================================ -->
          <article
            v-if="
              isTeacher &&
              (
                lesson.support_materials ||
                lesson.notes
              )
            "
            class="lesson-block lesson-block--teacher"
          >
            <div class="lesson-block__number">07</div>

            <div class="lesson-block__body">
              <p class="lesson-block__category">Solo profesor</p>
              <h2>Registro docente</h2>

              <div
                v-if="lesson.support_materials"
                class="teacher-note"
              >
                <span>MATERIAL DE APOYO</span>
                <p>{{ lesson.support_materials }}</p>
              </div>

              <div
                v-if="lesson.notes"
                class="teacher-note"
              >
                <span>OBSERVACIONES</span>
                <p>{{ lesson.notes }}</p>
              </div>

              <RouterLink
                :to="`/aula/clase/${lesson.id}/editar`"
                class="edit-planning"
              >
                ✎ Editar planificación
              </RouterLink>
            </div>
          </article>

          <section class="lesson-footer">
            <RouterLink
              to="/aula/programa-formativo"
              class="lesson-footer__back"
            >
              ← Programa completo
            </RouterLink>

            <RouterLink
              :to="`/aula/clase/${lesson.id}/trabajo`"
              class="lesson-footer__next"
            >
              <div>
                <span>SIGUIENTE</span>
                <strong>Trabajo de clase</strong>
              </div>

              <b>→</b>
            </RouterLink>
          </section>
        </main>
      </div>
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
  fetchLessonById
} from '@/services/lessonService'

import {
  fetchMaterialsByLesson
} from '@/services/materialService'

import {
  fetchAssignmentsByLesson
} from '@/services/assignmentService'

import {
  useAuth
} from '@/composables/useAuth'

const route = useRoute()
const { isTeacher } = useAuth()

const lesson = ref(null)
const lessonMaterials = ref([])
const lessonAssignments = ref([])

const isLoading = ref(true)
const loadError = ref('')

const loadLesson = async () => {
  isLoading.value = true
  loadError.value = ''

  try {
    const id = Number(route.params.id)

    const [
      loadedLesson,
      loadedMaterials,
      loadedAssignments
    ] = await Promise.all([
      fetchLessonById(id),
      fetchMaterialsByLesson(id),
      fetchAssignmentsByLesson(id)
    ])

    lesson.value = loadedLesson
    lessonMaterials.value = loadedMaterials || []
    lessonAssignments.value = loadedAssignments || []
  } catch (error) {
    console.error(
      'Error cargando la clase:',
      error
    )

    lesson.value = null
    lessonMaterials.value = []
    lessonAssignments.value = []

    loadError.value =
      error?.message ||
      'No se pudo obtener la clase desde Supabase.'
  } finally {
    isLoading.value = false
  }
}

const normalizeArray = value => {
  if (!Array.isArray(value)) return []

  return value
    .map(item => String(item).trim())
    .filter(Boolean)
}

const objectives = computed(() =>
  normalizeArray(lesson.value?.objectives)
)

const contents = computed(() =>
  normalizeArray(lesson.value?.contents)
)

const activities = computed(() =>
  normalizeArray(lesson.value?.activities)
)

const repertoire = computed(() =>
  normalizeArray(lesson.value?.repertoire)
)

const publishedAssignments = computed(() =>
  lessonAssignments.value.filter(
    task => task.status !== 'draft'
  )
)

const previewMaterials = computed(() =>
  lessonMaterials.value.slice(0, 4)
)

const previewAssignments = computed(() =>
  publishedAssignments.value.slice(0, 4)
)

const getStatusLabel = status => {
  const labels = {
    available: 'Disponible',
    planned: 'Planificada',
    published: 'Publicada',
    completed: 'Realizada',
    draft: 'Borrador'
  }

  return labels[status] || 'Disponible'
}

const getMaterialType = type => {
  const labels = {
    pdf: 'PDF',
    score: 'Partitura',
    audio: 'Audio',
    video: 'Video',
    image: 'Imagen',
    link: 'Enlace',
    document: 'Documento',
    other: 'Archivo'
  }

  return labels[type] || 'Material'
}

const getMaterialIcon = type => {
  const icons = {
    pdf: 'PDF',
    score: '♫',
    audio: '♪',
    video: '▶',
    image: 'IMG',
    link: '↗',
    document: 'DOC',
    other: 'FILE'
  }

  return icons[type] || '•'
}

const getVoiceLabel = voice => {
  if (!voice || voice === 'general') {
    return 'General'
  }

  return voice
}

const getAssignmentType = type => {
  const labels = {
    assignment: 'Tarea',
    performance: 'Performance',
    audio: 'Audio',
    video: 'Video',
    score: 'Partitura'
  }

  return labels[type] || 'Tarea'
}

const getAssignmentIcon = type => {
  const icons = {
    assignment: '✓',
    performance: '★',
    audio: '♪',
    video: '▶',
    score: '♫'
  }

  return icons[type] || '✓'
}

const formatDate = value => {
  if (!value) return '—'

  const parts = String(value).split('-')

  if (parts.length === 3) {
    const [year, month, day] = parts
    return `${day}/${month}/${year}`
  }

  return value
}

watch(
  () => route.params.id,
  () => {
    loadLesson()
  }
)

onMounted(() => {
  loadLesson()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.lesson {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.lesson__topbar {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  justify-content: space-between;
  margin-bottom: variables.$spacing-xl;
}

.lesson__back {
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.lesson__teacher-actions {
  display: flex;
  gap: 8px;
}

.teacher-button {
  padding: 9px 12px;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  color: variables.$color-white;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.teacher-button--primary {
  border-color: variables.$color-primary;
  color: variables.$color-primary;
}

.lesson__hero {
  margin-bottom: variables.$spacing-xl;
  padding: variables.$spacing-3xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(variables.$color-primary, 0.18),
      transparent 35%
    ),
    variables.$color-surface;
}

.lesson__hero-main {
  display: grid;
  gap: variables.$spacing-2xl;
  grid-template-columns: auto 1fr;
}

.lesson__hero-number {
  display: grid;
  width: 130px;
  height: 130px;
  place-items: center;
  align-content: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
}

.lesson__hero-number span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.lesson__hero-number strong {
  color: variables.$color-primary;
  font-family: variables.$font-family-heading;
  font-size: 3rem;
}

.lesson__hero-meta {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: variables.$spacing-md;
}

.lesson__hero-meta > span:first-child {
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lesson__hero h1 {
  max-width: 950px;
  margin: 0 0 variables.$spacing-lg;
  font-size: clamp(3rem, 7vw, 6rem);
  line-height: 0.96;
}

.lesson__lead {
  max-width: 780px;
  margin: 0;
  line-height: 1.65;
  opacity: 0.65;
}

.lesson__chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: variables.$spacing-xl;
}

.lesson__chips span {
  padding: 6px 10px;
  border: 1px solid variables.$color-border;
  border-radius: 999px;
  font-size: variables.$font-size-xs;
  opacity: 0.65;
}

.status-badge {
  padding: 5px 9px;
  border-radius: 999px;
  font-size: variables.$font-size-xs;
}

.status-badge--available,
.status-badge--published {
  border: 1px solid variables.$color-primary;
  color: variables.$color-primary;
}

.status-badge--planned,
.status-badge--draft {
  border: 1px solid variables.$color-border;
  opacity: 0.55;
}

.status-badge--completed {
  background: variables.$color-primary;
  color: variables.$color-white;
}

.classwork-button {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: center;
  justify-content: space-between;
  margin-top: variables.$spacing-2xl;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  color: variables.$color-white;
  text-decoration: none;
}

.classwork-button span,
.classwork-button strong {
  display: block;
}

.classwork-button span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.1em;
}

.classwork-button b {
  color: variables.$color-primary;
  font-size: 2rem;
}

.lesson__summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  margin-bottom: variables.$spacing-xl;
}

.lesson__summary article {
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.lesson__summary span,
.lesson__summary strong,
.lesson__summary small {
  display: block;
}

.lesson__summary span {
  margin-bottom: 5px;
  font-size: variables.$font-size-xs;
  opacity: 0.45;
}

.lesson__summary strong {
  color: variables.$color-primary;
  font-size: 1.7rem;
}

.lesson__summary small {
  margin-top: 5px;
  font-size: variables.$font-size-xs;
  opacity: 0.35;
}

.lesson__summary--live {
  border-color: variables.$color-primary !important;
}

.focus-card {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
  margin-bottom: variables.$spacing-2xl;
  padding: variables.$spacing-xl;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: rgba(variables.$color-primary, 0.05);
}

.focus-card__icon {
  display: grid;
  width: 55px;
  height: 55px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 1.5rem;
}

.focus-card span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.focus-card h2 {
  margin: 5px 0 0;
}

.lesson__layout {
  display: grid;
  gap: variables.$spacing-3xl;
  grid-template-columns: 230px minmax(0, 1fr);
}

.lesson__sidebar {
  position: sticky;
  top: 2rem;
  align-self: start;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
}

.lesson__sidebar-title {
  padding-bottom: variables.$spacing-lg;
  border-bottom: 1px solid variables.$color-border;
}

.lesson__sidebar-title span,
.lesson__sidebar-title strong {
  display: block;
}

.lesson__sidebar-title span {
  margin-bottom: 5px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.12em;
}

.lesson__sidebar nav {
  display: flex;
  gap: variables.$spacing-md;
  flex-direction: column;
  margin: variables.$spacing-lg 0;
}

.lesson__sidebar nav a {
  color: variables.$color-white;
  font-size: variables.$font-size-sm;
  text-decoration: none;
  opacity: 0.6;
}

.lesson__sidebar nav a:hover {
  color: variables.$color-primary;
  opacity: 1;
}

.sidebar-classwork {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.lesson__content {
  display: grid;
  gap: variables.$spacing-xl;
}

.lesson-block {
  display: grid;
  gap: variables.$spacing-xl;
  grid-template-columns: 75px 1fr;
  padding: variables.$spacing-3xl;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-surface;
  scroll-margin-top: 2rem;
}

.lesson-block--overview,
.lesson-block--resources {
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(variables.$color-primary, 0.08),
      transparent 35%
    ),
    variables.$color-surface;
}

.lesson-block__number {
  color: variables.$color-primary;
  font-family: variables.$font-family-heading;
  font-size: 2rem;
}

.lesson-block__category {
  margin: 0 0 variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.lesson-block h2 {
  margin: 0 0 variables.$spacing-lg;
  font-size: clamp(2rem, 4vw, 3.5rem);
}

.lesson-block__lead {
  max-width: 850px;
  line-height: 1.65;
  opacity: 0.65;
}

.class-info-grid,
.content-grid,
.repertoire-grid,
.resource-summary {
  display: grid;
  gap: variables.$spacing-md;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: variables.$spacing-xl;
}

.class-info-grid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.class-info-grid article,
.content-card,
.repertoire-grid article,
.resource-summary article {
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.class-info-grid span,
.class-info-grid strong,
.resource-summary span,
.resource-summary strong,
.resource-summary small {
  display: block;
}

.class-info-grid span,
.resource-summary span {
  margin-bottom: 6px;
  font-size: variables.$font-size-xs;
  opacity: 0.45;
}

.class-info-grid strong,
.resource-summary strong {
  color: variables.$color-primary;
}

.resource-summary strong {
  margin: variables.$spacing-sm 0;
  font-size: 2rem;
}

.objective-list,
.activity-list,
.materials-preview,
.assignments-preview {
  display: grid;
  gap: variables.$spacing-md;
  margin-top: variables.$spacing-xl;
}

.objective-list article,
.activity-list article,
.materials-preview article,
.assignments-preview a {
  display: grid;
  gap: variables.$spacing-md;
  align-items: center;
  padding: variables.$spacing-md;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.objective-list article {
  grid-template-columns: auto 1fr;
}

.objective-list span {
  color: variables.$color-primary;
}

.objective-list p {
  margin: 0;
}

.content-card {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
}

.content-card > div,
.activity-list__icon,
.repertoire-grid__number,
.materials-preview__icon,
.assignments-preview__icon {
  display: grid;
  width: 45px;
  height: 45px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.content-card p {
  margin: 0;
}

.activity-list article,
.repertoire-grid article {
  display: flex;
  gap: variables.$spacing-lg;
  align-items: center;
}

.activity-list span,
.activity-list strong,
.repertoire-grid span,
.repertoire-grid strong,
.materials-preview span,
.materials-preview strong,
.materials-preview small,
.assignments-preview span,
.assignments-preview strong,
.assignments-preview small {
  display: block;
}

.activity-list span,
.repertoire-grid span,
.materials-preview span,
.assignments-preview span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.materials-preview article {
  grid-template-columns: auto 1fr;
}

.materials-preview small,
.assignments-preview small {
  margin-top: 3px;
  opacity: 0.45;
}

.assignments-preview a {
  color: variables.$color-white;
  text-decoration: none;
  grid-template-columns: auto 1fr auto;
}

.assignments-preview a:hover {
  border-color: variables.$color-primary;
}

.assignments-preview b {
  color: variables.$color-primary;
  font-size: 1.5rem;
}

.no-resources {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-top: variables.$spacing-lg;
  padding: variables.$spacing-lg;
  border: 1px dashed variables.$color-border;
  border-radius: variables.$radius-lg;
}

.no-resources > span {
  display: grid;
  width: 35px;
  height: 35px;
  flex-shrink: 0;
  place-items: center;
  border: 1px solid variables.$color-primary;
  border-radius: 50%;
  color: variables.$color-primary;
}

.no-resources p {
  margin: 0;
  opacity: 0.55;
}

.open-classwork {
  display: flex;
  gap: variables.$spacing-xl;
  align-items: center;
  justify-content: space-between;
  margin-top: variables.$spacing-xl;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  color: variables.$color-white;
  text-decoration: none;
}

.open-classwork span,
.open-classwork strong {
  display: block;
}

.open-classwork span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
  letter-spacing: 0.1em;
}

.open-classwork b {
  color: variables.$color-primary;
  font-size: 2rem;
}

.teacher-note {
  margin-top: variables.$spacing-lg;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background: variables.$color-background;
}

.teacher-note span {
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.teacher-note p {
  margin-bottom: 0;
  line-height: 1.65;
  white-space: pre-line;
}

.edit-planning {
  display: inline-block;
  margin-top: variables.$spacing-xl;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.lesson-footer {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  justify-content: space-between;
}

.lesson-footer__back {
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
}

.lesson-footer__next {
  display: flex;
  min-width: 300px;
  gap: variables.$spacing-xl;
  align-items: center;
  justify-content: space-between;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  color: variables.$color-white;
  text-decoration: none;
}

.lesson-footer__next span,
.lesson-footer__next strong {
  display: block;
}

.lesson-footer__next span {
  margin-bottom: 4px;
  color: variables.$color-primary;
  font-size: variables.$font-size-xs;
}

.lesson-footer__next b {
  color: variables.$color-primary;
}

.state-card {
  display: grid;
  min-height: 420px;
  gap: variables.$spacing-md;
  place-items: center;
  align-content: center;
  padding: variables.$spacing-3xl;
  border: 1px dashed variables.$color-border;
  border-radius: variables.$radius-lg;
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
  background: variables.$color-primary;
  color: variables.$color-white;
  font-size: 2rem;
}

.state-card__actions {
  display: flex;
  gap: variables.$spacing-md;
  align-items: center;
  margin-top: variables.$spacing-md;
}

.state-card__actions button,
.state-card__actions a {
  padding: variables.$spacing-sm variables.$spacing-md;
  border: 1px solid variables.$color-primary;
  border-radius: variables.$radius-lg;
  background: transparent;
  color: variables.$color-primary;
  font: inherit;
  font-weight: variables.$font-weight-semibold;
  text-decoration: none;
  cursor: pointer;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid variables.$color-border;
  border-top-color: variables.$color-primary;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 1100px) {
  .lesson__summary {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .lesson__layout {
    grid-template-columns: 1fr;
  }

  .lesson__sidebar {
    position: static;
  }

  .lesson__sidebar nav {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .lesson__topbar {
    align-items: stretch;
    flex-direction: column;
  }

  .lesson__teacher-actions {
    flex-direction: column;
  }

  .lesson__hero {
    padding: variables.$spacing-xl;
  }

  .lesson__hero-main {
    grid-template-columns: 1fr;
  }

  .lesson__hero-number {
    width: 90px;
    height: 90px;
  }

  .lesson__hero-number strong {
    font-size: 2.1rem;
  }

  .lesson__summary {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lesson-block {
    grid-template-columns: 1fr;
    padding: variables.$spacing-xl;
  }

  .lesson-block__number {
    font-size: 1.35rem;
  }

  .class-info-grid,
  .content-grid,
  .repertoire-grid,
  .resource-summary {
    grid-template-columns: 1fr;
  }

  .lesson__sidebar nav {
    grid-template-columns: 1fr;
  }

  .lesson-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .lesson-footer__next {
    min-width: 0;
    width: 100%;
  }
}

@media (max-width: 500px) {
  .lesson__summary {
    grid-template-columns: 1fr;
  }

  .assignments-preview a {
    grid-template-columns: auto 1fr;
  }

  .assignments-preview b {
    display: none;
  }
}
</style>
