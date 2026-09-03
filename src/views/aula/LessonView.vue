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
        Cargando clase
      </strong>

      <p>
        Preparando materiales y actividades...
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
            Administrar contenidos
          </RouterLink>
        </div>
      </div>

      <!-- ===================================================
           HERO
      ==================================================== -->

      <header class="lesson-hero">
        <div class="lesson-hero__content">
          <div class="lesson-hero__eyebrow">
            <span></span>

            CLASE
            {{ String(lesson.id).padStart(2, '0') }}
          </div>

          <h1>
            {{ lesson.title }}
          </h1>

          <p class="lesson-hero__description">
            {{
              lesson.description ||
              'Consulta el material y las actividades disponibles para esta clase.'
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
          </div>
        </div>

        <aside class="lesson-hero__aside">
          <div class="lesson-number">
            <span>
              CLASE
            </span>

            <strong>
              {{ String(lesson.id).padStart(2, '0') }}
            </strong>
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
           RESUMEN RÁPIDO
      ==================================================== -->

      <section class="quick-info">
        <article>
          <span>
            Materiales
          </span>

          <strong>
            {{ lessonMaterials.length }}
          </strong>
        </article>

        <article>
          <span>
            Actividades
          </span>

          <strong>
            {{ publishedAssignments.length }}
          </strong>
        </article>

        <article>
          <span>
            Modalidad
          </span>

          <strong class="quick-info__text">
            {{ lesson.modality || '—' }}
          </strong>
        </article>

        <article>
          <span>
            Lugar
          </span>

          <strong class="quick-info__text">
            {{ lesson.location || 'Por definir' }}
          </strong>
        </article>
      </section>

      <!-- ===================================================
           GRID PRINCIPAL
      ==================================================== -->

      <div class="lesson-layout">
        <!-- =================================================
             COLUMNA PRINCIPAL
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
              </div>

              <span
                v-if="primaryMaterial"
                class="section-count"
              >
                PDF
              </span>
            </header>

            <!-- PDF PRINCIPAL -->

            <article
              v-if="primaryMaterial"
              class="primary-material"
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
                  Material principal de la clase
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

                  <span
                    v-if="primaryMaterial.voice"
                  >
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
                  >
                    <span>
                      ↗
                    </span>

                    Abrir material
                  </a>

                  <a
                    v-if="primaryMaterial.url"
                    :href="primaryMaterial.url"
                    :download="
                      primaryMaterial.fileName ||
                      undefined
                    "
                    class="material-button"
                  >
                    ↓ Descargar
                  </a>

                  <RouterLink
                    :to="`/aula/clase/${lesson.id}/trabajo`"
                    class="material-button"
                  >
                    Ver recursos
                  </RouterLink>
                </div>
              </div>
            </article>

            <!-- SIN PDF -->

            <div
              v-else
              class="empty-material"
            >
              <div class="empty-material__icon">
                PDF
              </div>

              <div>
                <strong>
                  No hay material principal publicado
                </strong>

                <p>
                  {{
                    isTeacher
                      ? 'Puedes subir el PDF principal desde la edición de la clase o desde Recursos.'
                      : 'El profesor todavía no ha publicado un PDF para esta clase.'
                  }}
                </p>
              </div>

              <RouterLink
                v-if="isTeacher"
                :to="`/aula/clase/${lesson.id}/trabajo`"
              >
                Agregar material
              </RouterLink>
            </div>
          </section>

          <!-- ===============================================
               RECURSOS COMPLEMENTARIOS
          ================================================ -->

          <section
            v-if="secondaryMaterials.length"
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
              </div>

              <span class="section-count">
                {{ secondaryMaterials.length }}
              </span>
            </header>

            <div class="resource-list">
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
                    !material.url
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
                  {{
                    material.url
                      ? 'Abrir →'
                      : 'Sin enlace'
                  }}
                </div>
              </a>
            </div>

            <RouterLink
              :to="`/aula/clase/${lesson.id}/trabajo`"
              class="view-all-link"
            >
              Ver todos los recursos

              <span>
                →
              </span>
            </RouterLink>
          </section>

          <!-- ===============================================
               ACTIVIDADES / TAREAS
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
                  →
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
                  No hay actividades pendientes
                </strong>

                <p>
                  {{
                    isTeacher
                      ? 'Puedes crear tareas o actividades desde Trabajo de clase.'
                      : 'Por ahora esta clase no tiene tareas publicadas.'
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
                  AULA DE LA CLASE
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
            </div>
          </section>

          <!-- ===============================================
               CONTENIDO PEDAGÓGICO COLAPSABLE
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
                    Objetivos, contenidos, práctica y repertorio.
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
                <!-- FOCO -->

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

                <!-- OBJETIVOS -->

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

                <!-- CONTENIDOS -->

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

                <!-- ACTIVIDADES DE PLANIFICACIÓN -->

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

                <!-- REPERTORIO -->

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
               INFORMACIÓN PRIVADA PROFESOR
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
          <section class="sidebar-card">
            <span class="sidebar-card__eyebrow">
              ESTA CLASE
            </span>

            <h3>
              {{ lesson.title }}
            </h3>

            <div class="sidebar-progress">
              <div>
                <span>
                  Material
                </span>

                <strong>
                  {{
                    primaryMaterial
                      ? 'Disponible'
                      : 'Pendiente'
                  }}
                </strong>
              </div>

              <div class="sidebar-progress__bar">
                <span
                  :style="{
                    width:
                      primaryMaterial
                        ? '100%'
                        : '15%'
                  }"
                ></span>
              </div>
            </div>

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
            </div>
          </section>

          <!-- ATAJOS -->

          <section class="sidebar-card">
            <span class="sidebar-card__eyebrow">
              ACCESOS
            </span>

            <nav class="sidebar-nav">
              <a
                v-if="primaryMaterial?.url"
                :href="primaryMaterial.url"
                target="_blank"
                rel="noopener noreferrer"
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
                    Recursos y tareas
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

          <!-- CONSEJO -->

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
                Revisa primero el material principal y
                luego completa las actividades de la clase.
              </p>
            </div>
          </section>
        </aside>
      </div>

      <!-- ===================================================
           FOOTER
      ==================================================== -->

      <footer class="lesson-footer">
        <RouterLink
          to="/aula/programa-formativo"
        >
          <span>
            ←
          </span>

          <div>
            <small>
              VOLVER
            </small>

            <strong>
              Programa formativo
            </strong>
          </div>
        </RouterLink>

        <RouterLink
          :to="`/aula/clase/${lesson.id}/trabajo`"
          class="lesson-footer__next"
        >
          <div>
            <small>
              CONTINUAR
            </small>

            <strong>
              Trabajo de clase
            </strong>
          </div>

          <span>
            →
          </span>
        </RouterLink>
      </footer>
    </template>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
  watch,
} from 'vue'

import {
  RouterLink,
  useRoute,
} from 'vue-router'

import {
  fetchLessonById,
} from '@/services/lessonService'

import {
  fetchMaterialsByLesson,
} from '@/services/materialService'

import {
  fetchAssignmentsByLesson,
} from '@/services/assignmentService'

import {
  useAuth,
} from '@/composables/useAuth'

const route = useRoute()

const {
  isTeacher,
} = useAuth()

/* =========================================================
   ESTADO
========================================================= */

const lesson = ref(null)

const lessonMaterials = ref([])
const lessonAssignments = ref([])

const isLoading = ref(true)
const loadError = ref('')

const showAcademicContent =
  ref(false)

/* =========================================================
   CARGAR CLASE
========================================================= */

const loadLesson = async () => {
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
    ] = await Promise.all([
      fetchLessonById(id),
      fetchMaterialsByLesson(id),
      fetchAssignmentsByLesson(id),
    ])

    lesson.value =
      loadedLesson

    lessonMaterials.value =
      loadedMaterials ||
      []

    lessonAssignments.value =
      loadedAssignments ||
      []
  } catch (error) {
    console.error(
      'Error cargando la clase:',
      error,
    )

    lesson.value = null

    lessonMaterials.value = []
    lessonAssignments.value = []

    loadError.value =
      error?.message ||
      'No fue posible obtener esta clase.'
  } finally {
    isLoading.value = false
  }
}

/* =========================================================
   PLANIFICACIÓN
========================================================= */

const normalizeArray = value => {
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
      lesson.value
        ?.objectives,
    ),
  )

const contents =
  computed(() =>
    normalizeArray(
      lesson.value
        ?.contents,
    ),
  )

const activities =
  computed(() =>
    normalizeArray(
      lesson.value
        ?.activities,
    ),
  )

const repertoire =
  computed(() =>
    normalizeArray(
      lesson.value
        ?.repertoire,
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
   MATERIALES
========================================================= */

/*
 * El PDF creado desde CreateLessonView
 * queda almacenado con:
 *
 * type: 'pdf'
 * folder: 'material-principal'
 *
 * Por eso primero buscamos ese folder.
 *
 * También dejamos fallback para PDFs antiguos.
 */

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

    const firstPdf =
      materials.find(
        material =>
          material.type ===
            'pdf' ||
          material.mimeType ===
            'application/pdf',
      )

    return (
      firstPdf ||
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
    lessonAssignments.value.filter(
      assignment =>
        assignment.status !==
        'draft',
    ),
  )

/* =========================================================
   LABELS
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
      'Realizada',

    draft:
      'Borrador',
  }

  return (
    labels[status] ||
    'Disponible'
  )
}

const getMaterialType = type => {
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

const getMaterialIcon = type => {
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

const getVoiceLabel = voice => {
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

const getAssignmentType = type => {
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

const getAssignmentIcon = type => {
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

const formatDate = value => {
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

const formatFileSize = bytes => {
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
    material?.url
  ) {
    return
  }

  event.preventDefault()
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
  margin-bottom: 1.4rem;
}

.back-link {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color: variables.$color-primary;
  font-size: 0.78rem;
  font-weight: 800;
  text-decoration: none;
}

.back-link span {
  transition: transform 0.18s ease;
}

.back-link:hover span {
  transform: translateX(-3px);
}

.teacher-actions {
  display: flex;
  gap: 0.55rem;
}

.teacher-button {
  display: inline-flex;
  min-height: 40px;
  gap: 0.4rem;
  align-items: center;
  padding: 0.65rem 0.85rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  color:
    variables.$color-white;
  font-size: 0.7rem;
  font-weight: 800;
  text-decoration: none;
}

.teacher-button--primary {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
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
  margin-bottom: 1rem;
  padding: 2.7rem;
  overflow: hidden;
  border:
    1px solid
    variables.$color-border;
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 92% 10%,
      rgba(
        255,
        196,
        0,
        0.14
      ),
      transparent 32%
    ),
    variables.$color-surface;
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

.lesson-hero__eyebrow {
  display: flex;
  gap: 0.55rem;
  align-items: center;
  color:
    variables.$color-primary;
  font-size: 0.66rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.lesson-hero__eyebrow > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background:
    variables.$color-primary;
  box-shadow:
    0 0 0 5px
    rgba(
      255,
      196,
      0,
      0.08
    );
}

.lesson-hero h1 {
  max-width: 920px;
  margin:
    1rem
    0
    0;
  font-size:
    clamp(
      2.8rem,
      7vw,
      5.6rem
    );
  line-height: 0.95;
  letter-spacing: -0.045em;
}

.lesson-hero__description {
  max-width: 730px;
  margin:
    1.3rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.52
    );
  line-height: 1.7;
}

.lesson-hero__meta {
  display: flex;
  gap: 0.45rem;
  flex-wrap: wrap;
  margin-top: 1.35rem;
}

.lesson-hero__meta span {
  padding:
    0.38rem
    0.62rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.5
    );
  font-size: 0.65rem;
}

.lesson-hero__aside {
  display: grid;
  gap: 0.75rem;
  justify-items: center;
}

.lesson-number {
  display: grid;
  width: 125px;
  height: 125px;
  place-items: center;
  align-content: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.55
    );
  border-radius: 50%;
}

.lesson-number span,
.lesson-number strong {
  display: block;
}

.lesson-number span {
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.lesson-number strong {
  color:
    variables.$color-primary;
  font-size: 2.8rem;
  line-height: 1;
}

.status-badge {
  padding:
    0.4rem
    0.65rem;
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 800;
}

.status-badge--available,
.status-badge--published {
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.4
    );
  color:
    variables.$color-primary;
}

.status-badge--planned,
.status-badge--draft {
  border:
    1px solid
    variables.$color-border;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
}

.status-badge--completed {
  background:
    variables.$color-primary;
  color: #070707;
}

/* =========================================================
   QUICK INFO
========================================================= */

.quick-info {
  display: grid;
  gap: 0.7rem;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
  margin-bottom: 1rem;
}

.quick-info article {
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 13px;
  background:
    variables.$color-surface;
}

.quick-info span,
.quick-info strong {
  display: block;
}

.quick-info span {
  margin-bottom: 0.35rem;
  color:
    rgba(
      255,
      255,
      255,
      0.32
    );
  font-size: 0.62rem;
  text-transform: uppercase;
}

.quick-info strong {
  color:
    variables.$color-primary;
  font-size: 1.35rem;
}

.quick-info__text {
  overflow-wrap: anywhere;
  color:
    variables.$color-white !important;
  font-size: 0.78rem !important;
}

/* =========================================================
   LAYOUT
========================================================= */

.lesson-layout {
  display: grid;
  gap: 1rem;
  grid-template-columns:
    minmax(0, 1fr)
    285px;
  align-items: start;
}

.lesson-main {
  display: grid;
  gap: 1rem;
}

.lesson-sidebar {
  position: sticky;
  top: 1rem;
  display: grid;
  gap: 0.8rem;
}

/* =========================================================
   SECTION
========================================================= */

.content-section,
.teacher-notes {
  padding: 1.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 18px;
  background:
    variables.$color-surface;
}

.section-heading {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.35rem;
}

.section-heading > div > span {
  color:
    variables.$color-primary;
  font-size: 0.6rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.section-heading h2 {
  margin:
    0.25rem
    0
    0;
  font-size:
    clamp(
      1.45rem,
      3vw,
      2rem
    );
}

.section-count {
  display: grid;
  min-width: 36px;
  height: 36px;
  place-items: center;
  padding:
    0
    0.55rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.3
    );
  border-radius: 999px;
  color:
    variables.$color-primary;
  font-size: 0.63rem;
  font-weight: 900;
}

/* =========================================================
   PRIMARY MATERIAL
========================================================= */

.material-section {
  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(
        255,
        196,
        0,
        0.08
      ),
      transparent 38%
    ),
    variables.$color-surface;
}

.primary-material {
  display: grid;
  gap: 1.5rem;
  grid-template-columns:
    155px
    minmax(0, 1fr);
  padding: 1.35rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.28
    );
  border-radius: 15px;
  background:
    variables.$color-background;
}

.primary-material__visual {
  display: grid;
  place-items: center;
  min-height: 170px;
  border:
    1px solid
    variables.$color-border;
  border-radius: 12px;
  background:
    linear-gradient(
      145deg,
      rgba(
        255,
        196,
        0,
        0.07
      ),
      transparent
    );
}

.pdf-icon {
  display: grid;
  width: 80px;
  height: 100px;
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
  font-size: 0.68rem;
  font-weight: 900;
}

.pdf-icon strong {
  margin-top: 0.4rem;
  color:
    rgba(
      255,
      255,
      255,
      0.35
    );
  font-size: 0.65rem;
}

.primary-material__content {
  align-self: center;
}

.primary-material__eyebrow {
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.primary-material h3 {
  margin:
    0.5rem
    0
    0;
  overflow-wrap: anywhere;
  font-size:
    clamp(
      1.3rem,
      3vw,
      1.8rem
    );
}

.primary-material p {
  max-width: 650px;
  margin:
    0.7rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.43
    );
  font-size: 0.75rem;
  line-height: 1.6;
}

.primary-material__meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.8rem;
}

.primary-material__meta span {
  padding:
    0.3rem
    0.5rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.34
    );
  font-size: 0.6rem;
}

.primary-material__actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1.1rem;
}

.material-button {
  display: inline-flex;
  min-height: 40px;
  gap: 0.4rem;
  align-items: center;
  justify-content: center;
  padding:
    0.65rem
    0.8rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  color:
    variables.$color-white;
  font-size: 0.68rem;
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
  gap: 1rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1.2rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 14px;
}

.empty-material__icon {
  display: grid;
  width: 47px;
  height: 47px;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 11px;
  color:
    variables.$color-primary;
  font-size: 0.6rem;
  font-weight: 900;
}

.empty-material strong {
  font-size: 0.78rem;
}

.empty-material p {
  margin:
    0.3rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
  font-size: 0.68rem;
}

.empty-material a {
  color:
    variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   RESOURCE LIST
========================================================= */

.resource-list,
.assignment-list {
  display: grid;
  gap: 0.6rem;
}

.resource-item {
  display: grid;
  gap: 0.85rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 0.9rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 12px;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;
}

.resource-item:hover:not(
  .resource-item--disabled
) {
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
  width: 43px;
  height: 43px;
  place-items: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.45
    );
  border-radius: 11px;
  color:
    variables.$color-primary;
  font-size: 0.61rem;
  font-weight: 900;
}

.resource-item__content span,
.resource-item__content strong,
.resource-item__content small {
  display: block;
}

.resource-item__content > span {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
  text-transform: uppercase;
}

.resource-item__content strong {
  margin-top: 0.15rem;
  overflow-wrap: anywhere;
  font-size: 0.76rem;
}

.resource-item__content small {
  margin-top: 0.15rem;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.6rem;
}

.resource-item__action {
  color:
    variables.$color-primary;
  font-size: 0.63rem;
  font-weight: 800;
}

.view-all-link {
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 1rem;
  color:
    variables.$color-primary;
  font-size: 0.67rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   ASSIGNMENTS
========================================================= */

.assignment-card {
  display: grid;
  gap: 0.85rem;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  align-items: center;
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 12px;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
  text-decoration: none;
  transition:
    border-color 0.18s ease,
    transform 0.18s ease;
}

.assignment-card:hover {
  border-color:
    variables.$color-primary;
  transform:
    translateY(-1px);
}

.assignment-card__content > span {
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
  text-transform: uppercase;
}

.assignment-card__content > strong {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.78rem;
}

.assignment-card__meta {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-top: 0.35rem;
}

.assignment-card__meta span {
  color:
    rgba(
      255,
      255,
      255,
      0.34
    );
  font-size: 0.61rem;
}

.assignment-card__arrow {
  color:
    variables.$color-primary;
  font-size: 1.1rem;
}

.empty-assignments {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  padding: 1rem;
  border:
    1px dashed
    variables.$color-border;
  border-radius: 12px;
}

.empty-assignments > div {
  display: grid;
  width: 36px;
  height: 36px;
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
  font-size: 0.75rem;
}

.empty-assignments p {
  margin:
    0.2rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.38
    );
  font-size: 0.65rem;
}

.classwork-link {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
  padding: 1rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.35
    );
  border-radius: 12px;
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
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.classwork-link strong {
  margin-top: 0.2rem;
  font-size: 0.78rem;
}

.classwork-link b {
  color:
    variables.$color-primary;
  font-size: 1.3rem;
}

/* =========================================================
   CLASS DATA
========================================================= */

.class-data {
  display: grid;
  gap: 0.6rem;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
}

.class-data article {
  padding: 0.9rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 11px;
  background:
    variables.$color-background;
}

.class-data span,
.class-data strong {
  display: block;
}

.class-data span {
  margin-bottom: 0.3rem;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.59rem;
  text-transform: uppercase;
}

.class-data strong {
  overflow-wrap: anywhere;
  color:
    variables.$color-primary;
  font-size: 0.72rem;
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
  border-radius: 18px;
  background:
    variables.$color-surface;
}

.academic-toggle {
  display: flex;
  width: 100%;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.1rem 1.25rem;
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
  gap: 0.8rem;
  align-items: center;
}

.academic-toggle__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.35
    );
  border-radius: 10px;
  color:
    variables.$color-primary;
}

.academic-toggle span,
.academic-toggle strong,
.academic-toggle small {
  display: block;
}

.academic-toggle > div > div:last-child > span {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.academic-toggle strong {
  margin-top: 0.15rem;
  font-size: 0.78rem;
}

.academic-toggle small {
  margin-top: 0.12rem;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.61rem;
}

.academic-toggle > span {
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.62rem;
}

.academic-content {
  display: grid;
  gap: 0.8rem;
  padding: 1.2rem;
  border-top:
    1px solid
    variables.$color-border;
}

.academic-block {
  padding: 1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 12px;
  background:
    variables.$color-background;
}

.academic-block--focus {
  border-color:
    rgba(
      255,
      196,
      0,
      0.3
    );
}

.academic-block--focus > span {
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
}

.academic-block--focus h3 {
  margin:
    0.35rem
    0
    0;
}

.academic-block header {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  margin-bottom: 0.8rem;
}

.academic-block header > span {
  color:
    variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
}

.academic-block h3 {
  margin: 0;
  font-size: 1rem;
}

.academic-list {
  display: grid;
  gap: 0.45rem;
}

.academic-list > div {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
  padding: 0.6rem;
  border-top:
    1px solid
    variables.$color-border;
}

.academic-list > div > span {
  color:
    variables.$color-primary;
  font-size: 0.61rem;
  font-weight: 900;
}

.academic-list p {
  margin: 0;
  color:
    rgba(
      255,
      255,
      255,
      0.62
    );
  font-size: 0.7rem;
  line-height: 1.5;
}

.academic-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.academic-tags span {
  padding:
    0.45rem
    0.6rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  color:
    rgba(
      255,
      255,
      255,
      0.58
    );
  font-size: 0.65rem;
}

.repertoire-list {
  display: grid;
  gap: 0.5rem;
}

.repertoire-list > div {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  padding: 0.65rem;
  border-top:
    1px solid
    variables.$color-border;
}

.repertoire-list > div > span {
  display: grid;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.35
    );
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
  font-size: 0.54rem;
}

.repertoire-list strong {
  margin-top: 0.12rem;
  font-size: 0.7rem;
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
    rgba(
      255,
      196,
      0,
      0.22
    );
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
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.teacher-notes h2 {
  margin:
    0.2rem
    0
    0;
}

.teacher-notes > header a {
  color:
    variables.$color-primary;
  font-size: 0.68rem;
  font-weight: 800;
  text-decoration: none;
}

.teacher-note {
  margin-top: 1rem;
  padding: 0.9rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 10px;
  background:
    variables.$color-background;
}

.teacher-note span {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
}

.teacher-note p {
  margin:
    0.35rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.55
    );
  font-size: 0.69rem;
  line-height: 1.6;
  white-space: pre-line;
}

/* =========================================================
   SIDEBAR
========================================================= */

.sidebar-card {
  padding: 1.1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 15px;
  background:
    variables.$color-surface;
}

.sidebar-card__eyebrow {
  color:
    variables.$color-primary;
  font-size: 0.57rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.sidebar-card h3 {
  margin:
    0.4rem
    0
    0;
  font-size: 1rem;
  line-height: 1.3;
}

.sidebar-progress {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top:
    1px solid
    variables.$color-border;
}

.sidebar-progress > div:first-child {
  display: flex;
  gap: 0.6rem;
  justify-content: space-between;
}

.sidebar-progress span,
.sidebar-progress strong {
  font-size: 0.6rem;
}

.sidebar-progress span {
  color:
    rgba(
      255,
      255,
      255,
      0.35
    );
}

.sidebar-progress strong {
  color:
    variables.$color-primary;
}

.sidebar-progress__bar {
  height: 4px;
  margin-top: 0.55rem;
  overflow: hidden;
  border-radius: 999px;
  background:
    rgba(
      255,
      255,
      255,
      0.06
    );
}

.sidebar-progress__bar span {
  display: block;
  height: 100%;
  border-radius: inherit;
  background:
    variables.$color-primary;
}

.sidebar-summary {
  display: grid;
  gap: 0.5rem;
  grid-template-columns:
    1fr
    1fr;
  margin-top: 1rem;
}

.sidebar-summary article {
  padding: 0.65rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
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
  font-size: 1.15rem;
  font-weight: 900;
}

.sidebar-summary small {
  margin-top: 0.1rem;
  color:
    rgba(
      255,
      255,
      255,
      0.3
    );
  font-size: 0.57rem;
}

/* =========================================================
   SIDEBAR NAV
========================================================= */

.sidebar-nav {
  display: grid;
  gap: 0.45rem;
  margin-top: 0.8rem;
}

.sidebar-nav a {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem;
  border:
    1px solid
    variables.$color-border;
  border-radius: 9px;
  color:
    variables.$color-white;
  text-decoration: none;
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
  font-size: 0.52rem;
  font-weight: 900;
}

.sidebar-nav strong {
  margin-top: 0.1rem;
  font-size: 0.66rem;
}

.sidebar-nav b {
  color:
    variables.$color-primary;
}

.sidebar-tip {
  display: flex;
  gap: 0.7rem;
  padding: 1rem;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.24
    );
  border-radius: 14px;
  background:
    rgba(
      255,
      196,
      0,
      0.025
    );
}

.sidebar-tip > span {
  display: grid;
  width: 33px;
  height: 33px;
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
  font-size: 0.67rem;
}

.sidebar-tip p {
  margin:
    0.25rem
    0
    0;
  color:
    rgba(
      255,
      255,
      255,
      0.35
    );
  font-size: 0.61rem;
  line-height: 1.5;
}

/* =========================================================
   FOOTER
========================================================= */

.lesson-footer {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-top: 1rem;
}

.lesson-footer > a {
  display: flex;
  gap: 0.7rem;
  align-items: center;
  padding: 0.8rem 0;
  color:
    variables.$color-white;
  text-decoration: none;
}

.lesson-footer small,
.lesson-footer strong {
  display: block;
}

.lesson-footer small {
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
}

.lesson-footer strong {
  margin-top: 0.1rem;
  font-size: 0.7rem;
}

.lesson-footer > a > span {
  color:
    variables.$color-primary;
}

.lesson-footer__next {
  min-width: 240px;
  justify-content: space-between;
  padding:
    0.8rem
    1rem !important;
  border:
    1px solid
    rgba(
      255,
      196,
      0,
      0.35
    );
  border-radius: 11px;
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
  margin: 0;
  color:
    rgba(
      255,
      255,
      255,
      0.4
    );
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
    spinnerRotate
    0.75s
    linear
    infinite;
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
  font-size: 0.68rem;
  font-weight: 800;
  text-decoration: none;
  cursor: pointer;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1050px) {
  .lesson-layout {
    grid-template-columns: 1fr;
  }

  .lesson-sidebar {
    position: static;
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .sidebar-tip {
    grid-column:
      1 / -1;
  }
}

@media (max-width: 820px) {
  .lesson-hero {
    grid-template-columns: 1fr;
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
    grid-column: span 1;
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
    justify-content: center;
  }

  .lesson-hero,
  .content-section,
  .teacher-notes {
    padding: 1.3rem;
  }

  .primary-material {
    grid-template-columns: 1fr;
  }

  .primary-material__visual {
    min-height: 140px;
  }

  .lesson-sidebar {
    grid-template-columns: 1fr;
  }

  .sidebar-tip {
    grid-column: auto;
  }

  .lesson-footer {
    align-items: stretch;
    flex-direction: column;
  }

  .lesson-footer__next {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .lesson-hero {
    border-radius: 18px;
  }

  .lesson-hero h1 {
    font-size:
      clamp(
        2.5rem,
        14vw,
        4rem
      );
  }

  .quick-info {
    grid-template-columns: 1fr 1fr;
  }

  .class-data {
    grid-template-columns: 1fr;
  }

  .resource-item,
  .assignment-card {
    grid-template-columns:
      auto
      1fr;
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
}
</style>
