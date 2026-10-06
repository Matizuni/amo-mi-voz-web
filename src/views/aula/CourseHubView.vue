<template>
  <section class="course-hub course-hub--classes">
    <header class="classes-header">
      <div class="classes-header__intro">
        <span class="course-kicker">MIS CLASES · ACADEMIA AMO MI VOZ</span>
        <h1>Mis clases</h1>
        <p>Tu recorrido de formación musical, organizado en sesiones. Explora cada portada, conoce el objetivo de la clase y entra directamente a la experiencia.</p>
      </div>

      <div class="classes-header__count">
        <strong>{{ lessons.length }}</strong>
        <span>clases publicadas</span>
      </div>
    </header>

    <section v-if="loading" class="course-state">
      <span class="course-loader"></span>
      <strong>Cargando tus clases…</strong>
    </section>

    <section v-else-if="errorMessage" class="course-state course-state--error">
      <strong>No pudimos cargar tus clases.</strong>
      <p>{{ errorMessage }}</p>
      <button type="button" @click="loadCourse">Reintentar</button>
    </section>

    <main v-else class="lessons-list" aria-label="Listado de clases">
      <article
        v-for="(lesson, index) in lessons"
        :key="lesson.id"
        class="lesson-card"
        :class="{ 'lesson-card--completed': isLessonCompleted(lesson.id) }"
      >
        <RouterLink
          :to="`/aula/clase/${lesson.id}`"
          class="lesson-card__banner"
          :style="lessonCoverStyle(lesson)"
          :aria-label="`Abrir ${lesson.title}`"
        >
          <div class="lesson-card__cover" aria-hidden="true"></div>
          <div class="lesson-card__veil" aria-hidden="true"></div>
          <div class="lesson-card__shine" aria-hidden="true"></div>
          <div class="lesson-card__glow" aria-hidden="true"></div>

          <div class="lesson-card__hero">
            <div class="lesson-card__eyebrow">
              <span class="lesson-number">
                CLASE {{ String(index + 1).padStart(2, '0') }}
              </span>

              <span v-if="lesson.date" class="lesson-date">
                {{ formatLessonDate(lesson.date) }}
              </span>
            </div>

            <h2>{{ lesson.title }}</h2>
            <span class="lesson-accent" aria-hidden="true"></span>

            <div
              v-if="isStudent"
              class="lesson-card__progress-mini"
              :class="{
                'is-complete': getLessonProgress(lesson.id) >= 100,
                'is-active': getLessonProgress(lesson.id) > 0 && getLessonProgress(lesson.id) < 100,
              }"
            >
              <div class="lesson-card__progress-head">
                <span>
                  {{
                    getLessonProgress(lesson.id) >= 100
                      ? '✓ CLASE COMPLETADA'
                      : getLessonProgress(lesson.id) > 0
                        ? 'EN PROGRESO'
                        : 'PENDIENTE'
                  }}
                </span>
                <strong>{{ getLessonProgress(lesson.id) }}%</strong>
              </div>

              <div class="lesson-card__progress-track" aria-hidden="true">
                <i
                  class="lesson-card__progress-fill"
                  :style="{ width: `${getLessonProgress(lesson.id)}%` }"
                ></i>

                <b
                  v-for="particle in 10"
                  :key="`lesson-progress-${lesson.id}-${particle}`"
                  class="lesson-card__progress-particle"
                  :style="{
                    left: `${Math.min(96, Math.max(3, getLessonProgress(lesson.id) + (particle - 5) * 3.6))}%`,
                    animationDelay: `${particle * 0.09}s`,
                  }"
                ></b>
              </div>

              <small>{{ getLessonProgressCaption(lesson.id) }}</small>
            </div>
          </div>

          <div class="lesson-card__info">
            <div class="lesson-card__description">
              <span class="body-kicker">SOBRE ESTA CLASE</span>

              <p>
                {{ lesson.description || 'Revisa el contenido, actividades y materiales preparados para esta sesión.' }}
              </p>
            </div>

            <div class="lesson-card__details">
              <div v-if="lesson.time || lesson.modality" class="lesson-detail">
                <span class="detail-icon">◷</span>
                <div>
                  <strong>{{ lesson.time || 'Por confirmar' }}</strong>
                  <span>{{ lesson.modality || 'Presencial' }}</span>
                </div>
              </div>

              <div
                v-if="totalLearningItemsForLesson(lesson.id)"
                class="lesson-detail"
              >
                <span class="detail-icon">◈</span>
                <div>
                  <strong>{{ totalLearningItemsForLesson(lesson.id) }}</strong>
                  <span>recursos y evaluaciones</span>
                </div>
              </div>
            </div>
          </div>

          <span class="lesson-card__arrow" aria-hidden="true">
            <AulaIcon name="arrow" />
          </span>

          <span class="lesson-card__enter">ENTRAR</span>
        </RouterLink>
      </article>

      <div v-if="!lessons.length" class="empty-course">
        No hay clases publicadas todavía.
      </div>
    </main>
  </section>
</template>



<script setup>

import { computed, onActivated, onMounted, onUnmounted, ref } from 'vue'

import { useAuth } from '@/composables/useAuth'

import { RouterLink } from 'vue-router'

import AulaIcon from '@/components/aula/AulaIcon.vue'

import { fetchLessons } from '@/services/lessonService'

import { fetchAssignments } from '@/services/assignmentService'

import { fetchMaterials } from '@/services/materialService'

import { getLessonAppearance } from '@/services/lessonAppearanceService'

import { fetchProgressByStudent } from '@/services/lessonProgressService'

import {
  fetchMyLessonLearningProgress,
} from '@/services/learningProgressService'

import { fetchQuizzes } from '@/services/quizService'



const loading = ref(true)

const errorMessage = ref('')

const lessons = ref([])

const assignments = ref([])

const materials = ref([])

const quizzes = ref([])

const studentProgress = ref([])

const lessonLearningProgress = ref({})

const { currentUser, isStudent } = useAuth()

const getPrimaryMaterialForLesson = lessonId => {
  const items = materials.value.filter(
    item => Number(item.lessonId) === Number(lessonId),
  )

  if (!items.length) return null

  const explicitPrimary = items.find(item =>
    String(item.storagePath || '').includes('/material-principal/'),
  )

  if (explicitPrimary) return explicitPrimary

  const titledPrimary = items.find(item =>
    String(item.title || '')
      .toLowerCase()
      .includes('material principal'),
  )

  if (titledPrimary) return titledPrimary

  return (
    items.find(
      item =>
        item.type === 'pdf' ||
        item.mimeType === 'application/pdf',
    ) || null
  )
}

const getPublishedAssignmentsForLesson = lessonId =>
  assignments.value.filter(
    assignment =>
      Number(assignment.lessonId) === Number(lessonId) &&
      assignment.status !== 'draft',
  )

const getVisibleQuizzesForLesson = lessonId =>
  quizzes.value.filter(
    quiz =>
      Number(quiz.lessonId) === Number(lessonId) &&
      quiz.status === 'published',
  )

const isLessonLegacyCompleted = lessonId =>
  studentProgress.value.some(
    row =>
      Number(row.lessonId) === Number(lessonId) &&
      row.completed,
  )

const getLessonProgress = lessonId => {
  const stored = lessonLearningProgress.value?.[Number(lessonId)]
  const percentage = Number(stored?.percentage)

  // Compatibilidad con clases antiguas sin elementos granulares.
  if (Number(stored?.total) === 0) {
    return isLessonLegacyCompleted(lessonId) ? 100 : 0
  }

  if (Number.isFinite(percentage)) {
    return Math.max(0, Math.min(100, Math.round(percentage)))
  }

  return isLessonLegacyCompleted(lessonId) ? 100 : 0
}

const getLessonProgressCaption = lessonId => {
  const percentage = getLessonProgress(lessonId)

  if (percentage >= 100) {
    return 'Todos los elementos de esta clase están completados.'
  }

  if (percentage > 0) {
    return 'Tu avance se guarda automáticamente. Continúa donde quedaste.'
  }

  return 'Comienza con el material principal para iniciar esta clase.'
}

const isLessonCompleted = lessonId =>
  isStudent.value && getLessonProgress(lessonId) >= 100

const parseDate = value => {

  if (!value) return null

  const raw = String(value).trim().toLowerCase()

  const iso = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? `${raw}T12:00:00` : raw

  let d = new Date(iso)

  if (!Number.isNaN(d.getTime())) return d



  const months = { enero:0, febrero:1, marzo:2, abril:3, mayo:4, junio:5, julio:6, agosto:7, septiembre:8, setiembre:8, octubre:9, noviembre:10, diciembre:11 }

  const match = raw.match(/(\d{1,2})\s+(?:de\s+)?([a-záéíóúñ]+)(?:\s+(?:de\s+)?(\d{4}))?/)

  if (!match) return null



  const monthName = match[2].normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  const month = months[monthName]

  if (month === undefined) return null

  const year = match[3] ? Number(match[3]) : new Date().getFullYear()

  d = new Date(year, month, Number(match[1]), 12, 0, 0)

  return Number.isNaN(d.getTime()) ? null : d

}



const formatLessonDate = value => {

  const d = parseDate(value)

  if (!d) return String(value || '').toUpperCase()

  return d.toLocaleDateString('es-CL', {

    day: '2-digit',

    month: 'long',

    year: 'numeric',

  }).toUpperCase()

}



const lessonCoverUrl = lesson => {

  if (!lesson) return ''



  const direct =

    lesson.cover_url ||

    lesson.coverUrl ||

    lesson.cover ||

    lesson.image_url ||

    lesson.imageUrl ||

    lesson.thumbnail_url ||

    lesson.thumbnailUrl ||

    ''



  if (direct) return direct



  const appearance = getLessonAppearance(lesson.id)

  return appearance?.coverUrl || ''

}



const lessonCoverStyle = lesson => {

  const url = lessonCoverUrl(lesson)

  return url ? { '--lesson-cover': `url("${String(url).replace(/"/g, '\\\\"')}")` } : {}

}



const materialsForLesson = id =>

  materials.value.filter(item => Number(item.lessonId) === Number(id)).length



const assignmentsForLesson = id =>

  assignments.value.filter(item => Number(item.lessonId) === Number(id)).length



const quizzesForLesson = id =>

  quizzes.value.filter(
    item =>
      Number(item.lessonId) === Number(id) &&
      item.status === 'published',
  ).length



const totalLearningItemsForLesson = id =>

  materialsForLesson(id) +
  assignmentsForLesson(id) +
  quizzesForLesson(id)



let courseLoaded = false

const refreshCourseProgress = async () => {

  if (!isStudent.value || !currentUser.value?.id || !lessons.value.length) {
    return
  }

  try {
    try {
      studentProgress.value = await fetchProgressByStudent(
        currentUser.value.id,
      )
    } catch (progressError) {
      console.warn(
        'No se pudo refrescar el progreso legado del alumno:',
        progressError,
      )
    }

    const progressEntries = await Promise.all(
      lessons.value.map(async lesson => {
        const lessonId = Number(lesson.id)

        try {
          const progress = await fetchMyLessonLearningProgress(lessonId)

          const lessonMaterials = materials.value.filter(
            item =>
              Number(item.lessonId) === Number(lessonId) &&
              item.status !== 'draft',
          )

          const normalizedProgress = Array.isArray(progress)
            ? progress
            : []

          const items = [
            ...lessonMaterials.map(material => ({
              type: 'material',
              id: Number(material.id),
            })),
            ...getPublishedAssignmentsForLesson(lessonId).map(assignment => ({
              type: 'assignment',
              id: Number(assignment.id),
            })),
            ...getVisibleQuizzesForLesson(lessonId).map(quiz => ({
              type: 'quiz',
              id: Number(quiz.id),
            })),
          ].filter(item => Number.isFinite(item.id) && item.id > 0)

          const isSeen = item =>
            normalizedProgress.some(row =>
              String(row.itemType ?? row.item_type ?? '') === String(item.type) &&
              Number(row.itemId ?? row.item_id) === item.id &&
              (row.status === 'completed' || row.status === 'viewed')
            )

          const total = items.length
          const completed = items.filter(isSeen).length

          return [
            lessonId,
            {
              total,
              completed,
              pending: Math.max(0, total - completed),
              percentage: total
                ? Math.round((completed / total) * 100)
                : (isLessonLegacyCompleted(lessonId) ? 100 : 0),
            },
          ]
        } catch (progressError) {
          console.warn(
            `No se pudo refrescar el progreso granular de la clase ${lessonId}:`,
            progressError,
          )
          return [
            lessonId,
            {
              percentage: isLessonLegacyCompleted(lessonId) ? 100 : 0,
            },
          ]
        }
      }),
    )

    lessonLearningProgress.value = Object.fromEntries(progressEntries)
  } catch (error) {
    console.warn(
      'No fue posible actualizar el progreso al volver a Mis clases:',
      error,
    )
  }
}



const loadCourse = async () => {

  loading.value = true

  errorMessage.value = ''



  try {

    const results = await Promise.allSettled([

      fetchLessons(),

      fetchAssignments(),

      fetchMaterials(),

      fetchQuizzes(),

    ])



    lessons.value = results[0].status === 'fulfilled' ? results[0].value : []

    assignments.value = results[1].status === 'fulfilled' ? results[1].value : []

    materials.value = results[2].status === 'fulfilled' ? results[2].value : []

    quizzes.value = results[3].status === 'fulfilled' ? results[3].value : []



    if (results.every(result => result.status === 'rejected')) {

      throw results[0].reason

    }



    if (results.some(result => result.status === 'rejected')) {

      console.warn('Algunos datos secundarios no pudieron cargarse.')

    }

    if (isStudent.value && currentUser.value?.id) {
      try {
        studentProgress.value = await fetchProgressByStudent(
          currentUser.value.id,
        )
      } catch (progressError) {
        console.warn('No se pudo cargar el progreso legado del alumno:', progressError)
        studentProgress.value = []
      }

      const progressEntries = await Promise.all(
        lessons.value.map(async lesson => {
          const lessonId = Number(lesson.id)

          try {
            const progress =
              await fetchMyLessonLearningProgress(lessonId)

            const lessonMaterials = materials.value.filter(
              item =>
                Number(item.lessonId) === Number(lessonId) &&
                item.status !== 'draft',
            )

            const normalizedProgress = Array.isArray(progress)
              ? progress
              : []

            const items = [
              ...lessonMaterials.map(material => ({
                type: 'material',
                id: Number(material.id),
              })),
              ...getPublishedAssignmentsForLesson(lessonId).map(assignment => ({
                type: 'assignment',
                id: Number(assignment.id),
              })),
              ...getVisibleQuizzesForLesson(lessonId).map(quiz => ({
                type: 'quiz',
                id: Number(quiz.id),
              })),
            ].filter(item => Number.isFinite(item.id) && item.id > 0)

            const isSeen = item =>
              normalizedProgress.some(row =>
                String(row.itemType ?? row.item_type ?? '') === String(item.type) &&
                Number(row.itemId ?? row.item_id) === item.id &&
                (row.status === 'completed' || row.status === 'viewed')
              )

            const total = items.length
            const completed = items.filter(isSeen).length

            const summary = {
              total,
              completed,
              pending: Math.max(0, total - completed),
              percentage: total
                ? Math.round((completed / total) * 100)
                : (isLessonLegacyCompleted(lessonId) ? 100 : 0),
            }

            return [lessonId, summary]
          } catch (progressError) {
            console.warn(
              `No se pudo cargar el progreso granular de la clase ${lessonId}:`,
              progressError,
            )

            return [
              lessonId,
              {
                percentage: isLessonLegacyCompleted(lessonId) ? 100 : 0,
              },
            ]
          }
        }),
      )

      lessonLearningProgress.value =
        Object.fromEntries(progressEntries)
    } else {
      studentProgress.value = []
      lessonLearningProgress.value = {}
    }

  } catch (error) {

    console.error(error)

    errorMessage.value = error?.message || 'Error inesperado.'

  } finally {

    loading.value = false
    courseLoaded = true

  }

}



const handleCourseWindowFocus = () => {
  if (courseLoaded) {
    refreshCourseProgress()
  }
}



const handleCourseVisibilityChange = () => {
  if (document.visibilityState === 'visible' && courseLoaded) {
    refreshCourseProgress()
  }
}



onMounted(() => {
  window.addEventListener('focus', handleCourseWindowFocus)
  document.addEventListener('visibilitychange', handleCourseVisibilityChange)
  loadCourse()
})



onActivated(() => {
  if (courseLoaded) {
    refreshCourseProgress()
  }
})



onUnmounted(() => {
  window.removeEventListener('focus', handleCourseWindowFocus)
  document.removeEventListener('visibilitychange', handleCourseVisibilityChange)
})

</script>



<style scoped>
.course-hub--classes {
  --wine: #b51652;
  --wine-dark: #7f1039;
  --magenta: #ef2b78;
  --gold: #e7bd42;
  --gold-soft: #ffe7a0;
  --ink: #101827;
  --body: #e8edf5;
  --muted: #98a4b8;
  --line: rgba(255, 255, 255, .12);

  display: grid;
  gap: 22px;
  padding-bottom: 30px;
}

/* =========================================================
   CABECERA
========================================================= */

.classes-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 3px 2px;
}

.classes-header__intro {
  min-width: 0;
}

.course-kicker,
.body-kicker {
  display: block;
  color: #d9ad35;
  font-size: .62rem;
  font-weight: 950;
  letter-spacing: .17em;
  text-transform: uppercase;
}

.classes-header h1 {
  margin: 7px 0 7px;
  color: #f7f9fc;
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: .98;
  letter-spacing: -.045em;
  text-shadow: 0 4px 22px rgba(0, 0, 0, .22);
}

.classes-header p {
  max-width: 760px;
  margin: 0;
  color: #aab5c7;
  font-size: .82rem;
  line-height: 1.6;
}

.classes-header__count {
  min-width: 132px;
  padding: 14px 17px;
  border: 1px solid rgba(232, 189, 66, .22);
  border-radius: 15px;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, .055), rgba(255, 255, 255, .015));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .08),
    0 14px 32px rgba(0, 0, 0, .14);
  text-align: center;
  backdrop-filter: blur(12px);
}

.classes-header__count strong {
  display: block;
  color: #fff;
  font-size: 1.5rem;
  line-height: 1;
}

.classes-header__count span {
  display: block;
  margin-top: 6px;
  color: #aab5c7;
  font-size: .56rem;
  font-weight: 850;
  text-transform: uppercase;
  letter-spacing: .09em;
}

/* =========================================================
   LISTADO
========================================================= */

.lessons-list {
  display: grid;
  gap: 20px;
}

/* =========================================================
   TARJETA CINEMÁTICA
========================================================= */

.lesson-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, .13);
  border-radius: 20px;
  background: #07101d;
  box-shadow:
    0 18px 48px rgba(3, 8, 17, .24),
    0 3px 0 rgba(255, 255, 255, .025) inset;
  transition:
    transform .42s cubic-bezier(.2, .8, .2, 1),
    box-shadow .42s ease,
    border-color .42s ease;
  isolation: isolate;
}

.lesson-card:hover {
  transform: translateY(-5px);
  border-color: rgba(239, 43, 120, .52);
  box-shadow:
    0 26px 70px rgba(3, 8, 17, .36),
    0 0 0 1px rgba(239, 43, 120, .08),
    0 0 42px rgba(181, 22, 82, .16);
}

/* =========================================================
   BANNER
========================================================= */

.lesson-card__banner {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  min-height: 320px;
  overflow: hidden;
  color: #fff;
  text-decoration: none;
  isolation: isolate;
  background:
    radial-gradient(circle at 84% 20%, rgba(239, 43, 120, .2), transparent 28%),
    linear-gradient(135deg, #101b2b, #3b1029);
}

.lesson-card__cover,
.lesson-card__veil,
.lesson-card__shine,
.lesson-card__glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.lesson-card__cover {
  z-index: -4;
  background-image: var(--lesson-cover);
  background-color: #101b2b;
  background-size: cover;
  background-position: center;
  transform: scale(1.015);
  filter: saturate(1.04) contrast(1.02);
  transition:
    transform 1.2s cubic-bezier(.16, .78, .2, 1),
    filter .7s ease;
}

.lesson-card:hover .lesson-card__cover {
  transform: scale(1.075);
  filter: saturate(1.14) contrast(1.06);
}

/* Degradado cinematográfico: oscuro donde vive el texto,
   transparente hacia la fotografía. */
.lesson-card__veil {
  z-index: -3;
  background:
    linear-gradient(
      90deg,
      rgba(3, 10, 20, .94) 0%,
      rgba(5, 13, 24, .72) 32%,
      rgba(7, 16, 29, .24) 72%,
      rgba(7, 16, 29, .08) 100%
    ),
    linear-gradient(
      0deg,
      rgba(3, 8, 16, .98) 0%,
      rgba(3, 8, 16, .76) 25%,
      rgba(3, 8, 16, .08) 67%,
      rgba(3, 8, 16, .18) 100%
    );
}

/* Reflejo que recorre la tarjeta al pasar el mouse. */
.lesson-card__shine {
  z-index: 3;
  width: 38%;
  left: -55%;
  background:
    linear-gradient(
      105deg,
      transparent 0%,
      rgba(255, 255, 255, .03) 32%,
      rgba(255, 255, 255, .20) 48%,
      rgba(255, 255, 255, .04) 62%,
      transparent 100%
    );
  transform: skewX(-18deg);
  opacity: 0;
  transition: opacity .2s ease;
}

.lesson-card:hover .lesson-card__shine {
  opacity: 1;
  animation: cardShine 1.05s cubic-bezier(.2, .65, .2, 1) forwards;
}

@keyframes cardShine {
  from { left: -55%; }
  to { left: 125%; }
}

/* Aura suave en los bordes. */
.lesson-card__glow {
  z-index: 2;
  border: 1px solid transparent;
  border-radius: inherit;
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .025),
    inset 0 -45px 80px rgba(0, 0, 0, .18);
  transition: box-shadow .45s ease;
}

.lesson-card:hover .lesson-card__glow {
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, .12),
    inset 0 -45px 80px rgba(0, 0, 0, .08),
    0 0 34px rgba(239, 43, 120, .10);
}

/* =========================================================
   HERO / TITULAR
========================================================= */

.lesson-card__hero {
  position: relative;
  z-index: 4;
  align-self: start;
  min-width: 0;
  padding: 58px 34px 16px;
}

.lesson-card__eyebrow {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}

.lesson-number {
  padding: 8px 14px;
  border: 1px solid rgba(255, 255, 255, .22);
  border-radius: 999px;
  background:
    linear-gradient(135deg, #c51d5d, #8e123f);
  color: #fff;
  font-size: .62rem;
  font-weight: 950;
  letter-spacing: .05em;
  box-shadow:
    0 9px 24px rgba(106, 5, 45, .34),
    inset 0 1px 0 rgba(255, 255, 255, .22);
}

.lesson-date {
  color: #fff;
  font-size: .67rem;
  font-weight: 950;
  letter-spacing: .075em;
  text-shadow: 0 2px 14px rgba(0, 0, 0, .75);
}

.lesson-card__hero h2 {
  max-width: 760px;
  margin: 0;
  color: #ffffff !important;
  -webkit-text-fill-color: #ffffff;
  font-size: clamp(1.65rem, 3vw, 2.55rem);
  font-weight: 950;
  line-height: 1.03;
  letter-spacing: -.038em;
  text-shadow:
    0 3px 7px rgba(0, 0, 0, .86),
    0 8px 28px rgba(0, 0, 0, .48);
}

.lesson-accent {
  display: block;
  width: 58px;
  height: 4px;
  margin-top: 17px;
  border-radius: 99px;
  background: linear-gradient(90deg, #ffd45d, #c88e19);
  box-shadow:
    0 0 12px rgba(255, 212, 93, .45),
    0 0 28px rgba(255, 212, 93, .16);
  transition: width .4s cubic-bezier(.2, .8, .2, 1);
}

.lesson-card:hover .lesson-accent {
  width: 92px;
}

/* =========================================================
   DESCRIPCIÓN INTEGRADA EN LA TARJETA
========================================================= */

.lesson-card__info {
  position: relative;
  z-index: 4;
  grid-column: 1 / -1;
  align-self: end;
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) auto;
  align-items: end;
  gap: 26px;
  min-width: 0;
  margin: 0;
  padding: 72px 32px 25px;
  background:
    linear-gradient(
      0deg,
      rgba(3, 8, 16, .96) 0%,
      rgba(3, 8, 16, .82) 36%,
      rgba(3, 8, 16, .30) 76%,
      transparent 100%
    );
  border-top: 1px solid rgba(255, 255, 255, .055);
  backdrop-filter: blur(1px);
}

.lesson-card__description {
  min-width: 0;
  max-width: 850px;
}

.lesson-card__description .body-kicker {
  color: #f0ca5d;
  text-shadow: 0 0 16px rgba(240, 202, 93, .20);
}

.lesson-card__description p {
  max-width: 850px;
  margin: 8px 0 0;
  color: rgba(255, 255, 255, .92);
  font-size: .79rem;
  line-height: 1.62;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow:
    0 2px 10px rgba(0, 0, 0, .75),
    0 1px 3px rgba(0, 0, 0, .7);
}

.lesson-card__details {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 1px;
}

.lesson-detail {
  display: flex;
  align-items: center;
  gap: 9px;
  min-width: 0;
  padding: 8px 10px;
  border: 1px solid rgba(255, 255, 255, .14);
  border-radius: 10px;
  background: rgba(7, 15, 27, .56);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .05),
    0 8px 20px rgba(0, 0, 0, .14);
  backdrop-filter: blur(8px);
}

.detail-icon {
  color: #f0ca5d;
  font-size: .95rem;
  line-height: 1;
  text-shadow: 0 0 10px rgba(240, 202, 93, .4);
}

.lesson-detail strong,
.lesson-detail span {
  display: block;
}

.lesson-detail strong {
  color: #fff;
  font-size: .66rem;
  font-weight: 850;
}

.lesson-detail span {
  margin-top: 2px;
  color: rgba(255, 255, 255, .62);
  font-size: .53rem;
}

/* =========================================================
   BOTÓN / FLECHA
========================================================= */

.lesson-card__arrow {
  position: absolute;
  z-index: 6;
  right: 24px;
  top: 24px;
  width: 52px;
  height: 52px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, .32);
  border-radius: 50%;
  background:
    linear-gradient(145deg, rgba(197, 29, 93, .78), rgba(111, 14, 55, .66));
  color: #fff;
  box-shadow:
    0 12px 28px rgba(0, 0, 0, .25),
    0 0 0 rgba(239, 43, 120, 0);
  backdrop-filter: blur(10px);
  transition:
    transform .42s cubic-bezier(.2, .8, .2, 1),
    box-shadow .42s ease,
    background .42s ease;
}

.lesson-card__arrow :deep(svg) {
  width: 19px;
  height: 19px;
}

.lesson-card:hover .lesson-card__arrow {
  transform: translateX(4px) scale(1.08);
  background:
    linear-gradient(145deg, #e52c78, #9f164b);
  box-shadow:
    0 14px 34px rgba(0, 0, 0, .3),
    0 0 26px rgba(239, 43, 120, .28);
}

.lesson-card__enter {
  position: absolute;
  z-index: 6;
  right: 29px;
  bottom: 23px;
  color: rgba(255, 255, 255, .58);
  font-size: .52rem;
  font-weight: 950;
  letter-spacing: .15em;
  opacity: .78;
  transition: color .3s ease, opacity .3s ease;
}

.lesson-card:hover .lesson-card__enter {
  color: #fff;
  opacity: 1;
}

/* =========================================================
   ESTADOS
========================================================= */

.empty-course,
.course-state {
  min-height: 180px;
  display: grid;
  place-items: center;
  align-content: center;
  gap: 10px;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, .1);
  border-radius: 18px;
  background: #0c1727;
  color: #aab5c7;
  text-align: center;
  box-shadow: 0 18px 44px rgba(0, 0, 0, .14);
}

.course-state--error button {
  padding: 8px 12px;
  border: 1px solid rgba(255, 255, 255, .15);
  border-radius: 8px;
  background: #172437;
  color: #fff;
  cursor: pointer;
}

.course-state--error p {
  margin: 0;
  color: #8e9aae;
  font-size: .7rem;
}

.course-loader {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255, 255, 255, .12);
  border-top-color: #d9ad35;
  border-radius: 99px;
  animation: spin .8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* =========================================================
   PROGRESO POR CLASE · LMS CINEMÁTICO
========================================================= */

.lesson-card--completed {
  border-color: rgba(45,138,99,.34) !important;
  box-shadow: 0 20px 54px rgba(3,8,17,.25), 0 0 0 1px rgba(45,138,99,.06), 0 0 36px rgba(45,138,99,.08);
}

.lesson-card--completed:hover {
  border-color: rgba(45,138,99,.58) !important;
  box-shadow: 0 28px 76px rgba(3,8,17,.34), 0 0 44px rgba(45,138,99,.14);
}

.lesson-card__progress-mini {
  position: relative;
  z-index: 2;
  width: min(420px, 78vw);
  margin-top: 14px;
  padding-top: 2px;
}

.lesson-card__progress-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 7px;
}

.lesson-card__progress-head span {
  color: #f0ca5d;
  font-size: .52rem;
  font-weight: 950;
  letter-spacing: .13em;
  text-transform: uppercase;
}

.lesson-card__progress-head strong {
  color: #ffffff;
  font-size: .75rem;
  font-weight: 950;
  letter-spacing: -.02em;
  text-shadow: 0 2px 12px rgba(0,0,0,.35);
}

.lesson-card__progress-track {
  position: relative;
  height: 7px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.17);
  border-radius: 999px;
  background: rgba(255,255,255,.12);
  box-shadow: inset 0 1px 2px rgba(0,0,0,.2);
}

.lesson-card__progress-fill {
  display: block;
  position: relative;
  z-index: 2;
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #e6b934 0%, #f3d46e 52%, #ffffff 100%);
  box-shadow: 0 0 18px rgba(243,212,110,.42);
  transition: width .85s cubic-bezier(.18,.82,.25,1);
}

.lesson-card__progress-fill::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 -80px;
  width: 100px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,.72), transparent);
  filter: blur(2px);
  animation: lessonProgressShine 2.4s ease-in-out infinite;
}

.lesson-card__progress-particle {
  position: absolute;
  z-index: 3;
  top: 50%;
  width: 3px;
  height: 3px;
  margin-top: -1.5px;
  border-radius: 50%;
  background: #f5d66d;
  box-shadow: 0 0 9px rgba(245,214,109,.86);
  opacity: .8;
  animation: lessonProgressParticle 1.8s ease-in-out infinite;
}

.lesson-card__progress-mini.is-active .lesson-card__progress-head span {
  color: #f3d46e;
}

.lesson-card__progress-mini.is-active .lesson-card__progress-fill {
  background: linear-gradient(90deg, #a7194b 0%, #e3b83e 100%);
  box-shadow: 0 0 18px rgba(167,25,75,.35), 0 0 12px rgba(227,184,62,.3);
}

.lesson-card__progress-mini.is-complete .lesson-card__progress-head span {
  color: #74d2a5;
}

.lesson-card__progress-mini.is-complete .lesson-card__progress-fill {
  background: linear-gradient(90deg, #38a76f 0%, #9be0bd 100%);
  box-shadow: 0 0 20px rgba(69,169,118,.45);
}

.lesson-card__progress-mini > small {
  display: block;
  margin-top: 6px;
  color: rgba(255,255,255,.62);
  font-size: .49rem;
  line-height: 1.35;
}

@keyframes lessonProgressShine {
  0%, 100% { transform: translateX(0); opacity: .08; }
  45% { transform: translateX(360px); opacity: .72; }
  55% { transform: translateX(420px); opacity: .12; }
}

@keyframes lessonProgressParticle {
  0%, 100% { transform: translateY(1px) scale(.65); opacity: .26; }
  50% { transform: translateY(-4px) scale(1.35); opacity: .95; }
}

@media (max-width: 650px) {
  .lesson-card__progress-mini {
    width: min(320px, 86vw);
  }
}

@media (prefers-reduced-motion: reduce) {
  .lesson-card__progress-fill,
  .lesson-card__progress-fill::after,
  .lesson-card__progress-particle {
    animation: none !important;
    transition: none !important;
  }
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .lesson-card__banner {
    grid-template-columns: 1fr;
    min-height: 430px;
  }

  .lesson-card__hero {
    align-self: start;
    padding: 30px 28px 12px;
  }

  .lesson-card__info {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 68px 24px 20px;
  }

  .lesson-card__details {
    justify-content: flex-start;
  }
}

@media (max-width: 650px) {
  .course-hub--classes {
    gap: 16px;
  }

  .classes-header {
    align-items: flex-start;
  }

  .classes-header p {
    display: none;
  }

  .classes-header__count {
    min-width: 92px;
  }

  .lesson-card {
    border-radius: 16px;
  }

  .lesson-card__banner {
    min-height: 500px;
  }

  .lesson-card__hero {
    padding: 25px 20px 10px;
  }

  .lesson-card__hero h2 {
    font-size: 1.62rem;
  }

  .lesson-card__info {
    gap: 15px;
    padding: 64px 17px 17px;
  }

  .lesson-card__description p {
    font-size: .74rem;
    -webkit-line-clamp: 3;
  }

  .lesson-card__arrow {
    right: 16px;
    top: 16px;
    width: 46px;
    height: 46px;
  }

  .lesson-card__enter {
    display: none;
  }

  .lesson-card__details {
    display: grid;
    grid-template-columns: 1fr;
  }
}

/* =========================================================
   ACCESIBILIDAD
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .lesson-card,
  .lesson-card__cover,
  .lesson-card__side,
  .lesson-card__arrow,
  .lesson-accent {
    transition: none !important;
  }

  .lesson-card:hover .lesson-card__shine {
    animation: none;
  }

  .course-loader {
    animation: none;
  }
}
</style>
