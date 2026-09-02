<template>
  <main class="gallery-page">
    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="hero">
      <div class="hero__grid"></div>
      <div class="hero__glow hero__glow--one"></div>
      <div class="hero__glow hero__glow--two"></div>

      <div class="container hero__content">
        <div class="eyebrow">
          <span></span>
          GALERÍA · AMO MI VOZ
        </div>

        <h1>
          Momentos que
          <em>se vuelven memoria.</em>
        </h1>

        <p class="hero__lead">
          Una selección de afiches, escenas, presentaciones
          y experiencias que forman parte de la historia
          artística de Amo Mi Voz.
        </p>

        <div class="hero__facts">
          <article>
            <span>01</span>

            <div>
              <small>ARCHIVO</small>
              <strong>Flyers y piezas gráficas</strong>
            </div>
          </article>

          <article>
            <span>02</span>

            <div>
              <small>ESCENA</small>
              <strong>Musicales</strong>
            </div>
          </article>

          <article>
            <span>03</span>

            <div>
              <small>EN VIVO</small>
              <strong>Presentaciones</strong>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         INTRO
    ====================================================== -->
    <section class="intro">
      <div class="container intro__grid">
        <div>
          <span class="eyebrow eyebrow--simple">
            NUESTRO ARCHIVO
          </span>

          <h2 class="display-title">
            Una academia también
            <em>se construye con recuerdos.</em>
          </h2>
        </div>

        <div class="intro__copy">
          <p class="intro__lead">
            Cada fotografía representa una etapa del proceso:
            ensayo, preparación, montaje, presentación
            y encuentro con el público.
          </p>

          <p>
            La galería reúne parte de ese recorrido visual,
            desde piezas gráficas de difusión hasta momentos
            registrados durante musicales y presentaciones.
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
         FILTROS
    ====================================================== -->
    <section class="gallery-section">
      <div class="container">
        <header class="gallery-header">
          <div>
            <span class="eyebrow eyebrow--simple">
              EXPLORA LA GALERÍA
            </span>

            <h2 class="display-title">
              Historias
              <em>en imágenes.</em>
            </h2>
          </div>

          <p>
            Selecciona una categoría para recorrer
            los distintos momentos de Amo Mi Voz.
          </p>
        </header>

        <div class="filters">
          <button
            v-for="filter in filters"
            :key="filter.value"
            type="button"
            :class="{
              active: activeFilter === filter.value
            }"
            @click="activeFilter = filter.value"
          >
            <span>
              {{ filter.label }}
            </span>

            <small>
              {{ getFilterCount(filter.value) }}
            </small>
          </button>
        </div>

        <!-- =================================================
             GRID
        ================================================== -->
        <TransitionGroup
          name="gallery"
          tag="div"
          class="gallery-grid"
        >
          <article
            v-for="(item, index) in filteredItems"
            :key="item.id"
            class="gallery-card"
            :class="{
              'gallery-card--wide':
                item.layout === 'wide',
              'gallery-card--tall':
                item.layout === 'tall'
            }"
            @click="openLightbox(index)"
          >
            <img
              :src="item.src"
              :alt="item.alt"
            />

            <div class="gallery-card__overlay"></div>

            <div class="gallery-card__top">
              <span>
                {{ item.categoryLabel }}
              </span>

              <small>
                {{ item.index }}
              </small>
            </div>

            <div class="gallery-card__content">
              <h3>
                {{ item.title }}
              </h3>

              <p>
                {{ item.description }}
              </p>

              <span class="gallery-card__action">
                Ver imagen
                <strong>↗</strong>
              </span>
            </div>
          </article>
        </TransitionGroup>
      </div>
    </section>

    <!-- =====================================================
         SECCIÓN EDITORIAL
    ====================================================== -->
    <section class="editorial">
      <div class="container editorial__grid">
        <div class="editorial__brand">
          <img
            :src="logo"
            alt="Logo Academia de Talentos Amo Mi Voz"
          />

          <div>
            <small>
              ACADEMIA DE TALENTOS
            </small>

            <strong>
              Amo Mi Voz
            </strong>
          </div>
        </div>

        <div class="editorial__content">
          <span class="eyebrow eyebrow--simple">
            MÁS QUE FOTOGRAFÍAS
          </span>

          <h2>
            Cada imagen
            <em>guarda una parte del proceso.</em>
          </h2>

          <p>
            Detrás de cada presentación existe preparación,
            ensayo, aprendizaje, nervios, trabajo colectivo
            y finalmente un momento compartido con el público.
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CTA
    ====================================================== -->
    <section class="cta">
      <div class="cta__grid"></div>
      <div class="cta__glow"></div>

      <div class="container cta__content">
        <span class="eyebrow eyebrow--simple">
          TU HISTORIA TAMBIÉN PUEDE EMPEZAR AQUÍ
        </span>

        <h2>
          La próxima fotografía
          <em>podría tener tu voz.</em>
        </h2>

        <p>
          Forma parte de Amo Mi Voz y vive
          tu propio proceso artístico.
        </p>

        <RouterLink
          to="/inscripcion"
          class="cta__button"
        >
          Solicitar inscripción
          <span>→</span>
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         LIGHTBOX
    ====================================================== -->
    <Teleport to="body">
      <Transition name="lightbox">
        <div
          v-if="isLightboxOpen"
          class="lightbox"
          @click.self="closeLightbox"
        >
          <div class="lightbox__backdrop"></div>

          <button
            type="button"
            class="lightbox__close"
            aria-label="Cerrar galería"
            @click="closeLightbox"
          >
            ×
          </button>

          <button
            v-if="filteredItems.length > 1"
            type="button"
            class="lightbox__nav lightbox__nav--prev"
            aria-label="Imagen anterior"
            @click="previousImage"
          >
            ←
          </button>

          <figure class="lightbox__content">
            <img
              :src="currentItem.src"
              :alt="currentItem.alt"
            />

            <figcaption>
              <div>
                <small>
                  {{ currentItem.categoryLabel }}
                </small>

                <strong>
                  {{ currentItem.title }}
                </strong>
              </div>

              <span>
                {{ currentLightboxIndex + 1 }}
                /
                {{ filteredItems.length }}
              </span>
            </figcaption>
          </figure>

          <button
            v-if="filteredItems.length > 1"
            type="button"
            class="lightbox__nav lightbox__nav--next"
            aria-label="Imagen siguiente"
            @click="nextImage"
          >
            →
          </button>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup>
import {
  computed,
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'

import logo from '@/assets/images/logo.png'

import musicalCoco from '@/assets/images/musical-coco.png'
import flyer1 from '@/assets/images/flayer-1.png'
import conciertoAlumnos from '@/assets/images/concierto-alumnos.png'

import coco1 from '@/assets/images/coco-1.png'
import coco2 from '@/assets/images/coco-2.png'
import coco3 from '@/assets/images/coco-3.png'
import student3 from '@/assets/images/alumno-3.png'
import jesus1 from '@/assets/images/jesus-1.png'
import student10 from '@/assets/images/alumno-10.png'

import student5 from '@/assets/images/alumno-5.png'
import student7 from '@/assets/images/alumno-7.png'
import gallery1 from '@/assets/images/galery-1.png'
import gallery2 from '@/assets/images/galery-2.png'
import gallery3 from '@/assets/images/galery-3.png'
import gallery4 from '@/assets/images/galery-4.png'
import gallery5 from '@/assets/images/galery-5.png'

const activeFilter = ref('all')
const isLightboxOpen = ref(false)
const currentLightboxIndex = ref(0)

/* =========================================================
   FILTROS
========================================================= */

const filters = [
  {
    label: 'Todo',
    value: 'all'
  },
  {
    label: 'Flyers',
    value: 'flyers'
  },
  {
    label: 'Musicales',
    value: 'musicals'
  },
  {
    label: 'Presentaciones',
    value: 'shows'
  }
]

/* =========================================================
   CONTENIDO
========================================================= */

const items = [
  /* =======================================================
     FLYERS
  ======================================================= */
  {
    id: 'flyer-coco',
    index: '01',
    category: 'flyers',
    categoryLabel: 'FLYERS',
    title: 'Musical COCO',
    description:
      'Pieza gráfica utilizada para presentar una de las producciones escénicas de Amo Mi Voz.',
    src: musicalCoco,
    alt: 'Flyer del musical COCO de Amo Mi Voz',
    layout: 'tall'
  },
  {
    id: 'flyer-1',
    index: '02',
    category: 'flyers',
    categoryLabel: 'FLYERS',
    title: 'Producción Amo Mi Voz',
    description:
      'Diseño gráfico de difusión para una de las actividades de la academia.',
    src: flyer1,
    alt: 'Flyer de una actividad de Amo Mi Voz',
    layout: 'tall'
  },
  {
    id: 'concierto-alumnos',
    index: '03',
    category: 'flyers',
    categoryLabel: 'FLYERS',
    title: 'Concierto de Alumnos',
    description:
      'Una pieza creada para anunciar uno de los encuentros escénicos de nuestros estudiantes.',
    src: conciertoAlumnos,
    alt: 'Flyer del concierto de alumnos de Amo Mi Voz',
    layout: 'tall'
  },

  /* =======================================================
     MUSICALES
  ======================================================= */
  {
    id: 'coco-1',
    index: '04',
    category: 'musicals',
    categoryLabel: 'MUSICALES',
    title: 'COCO · Escena I',
    description:
      'Uno de los momentos registrados durante nuestra experiencia escénico-musical.',
    src: coco1,
    alt: 'Escena del musical COCO de Amo Mi Voz',
    layout: 'wide'
  },
  {
    id: 'coco-2',
    index: '05',
    category: 'musicals',
    categoryLabel: 'MUSICALES',
    title: 'COCO · Escena II',
    description:
      'Interpretación, personajes y música formando parte de una misma escena.',
    src: coco2,
    alt: 'Presentación del musical COCO',
    layout: 'normal'
  },
  {
    id: 'coco-3',
    index: '06',
    category: 'musicals',
    categoryLabel: 'MUSICALES',
    title: 'COCO · Escena III',
    description:
      'Una mirada a la puesta en escena desarrollada por los estudiantes.',
    src: coco3,
    alt: 'Estudiantes durante el musical COCO',
    layout: 'normal'
  },
  {
    id: 'student-3-musical',
    index: '07',
    category: 'musicals',
    categoryLabel: 'MUSICALES',
    title: 'Interpretación escénica',
    description:
      'La actuación y el canto se integran dentro de nuestros proyectos musicales.',
    src: student3,
    alt: 'Estudiante durante una producción musical',
    layout: 'tall'
  },
  {
    id: 'jesus-1',
    index: '08',
    category: 'musicals',
    categoryLabel: 'MUSICALES',
    title: 'Jesucristo Superstar',
    description:
      'Un registro de una propuesta marcada por el rock, la interpretación y el trabajo escénico.',
    src: jesus1,
    alt: 'Producción de Jesucristo Superstar en Amo Mi Voz',
    layout: 'wide'
  },
  {
    id: 'student-10-musical',
    index: '09',
    category: 'musicals',
    categoryLabel: 'MUSICALES',
    title: 'Personaje y escena',
    description:
      'El trabajo interpretativo permite transformar una canción en una experiencia dramática.',
    src: student10,
    alt: 'Estudiante interpretando un personaje en un musical',
    layout: 'normal'
  },

  /* =======================================================
     PRESENTACIONES
  ======================================================= */
  {
    id: 'student-5-show',
    index: '10',
    category: 'shows',
    categoryLabel: 'PRESENTACIONES',
    title: 'En escena',
    description:
      'El escenario como parte real del proceso de aprendizaje.',
    src: student5,
    alt: 'Estudiante de Amo Mi Voz durante una presentación',
    layout: 'tall'
  },
  {
    id: 'student-7-show',
    index: '11',
    category: 'shows',
    categoryLabel: 'PRESENTACIONES',
    title: 'Interpretar frente al público',
    description:
      'Una experiencia que combina preparación, técnica y presencia escénica.',
    src: student7,
    alt: 'Presentación en vivo de un estudiante de Amo Mi Voz',
    layout: 'normal'
  },
  {
    id: 'gallery-1',
    index: '12',
    category: 'shows',
    categoryLabel: 'PRESENTACIONES',
    title: 'Momento en vivo I',
    description:
      'Parte del recorrido artístico de nuestros estudiantes.',
    src: gallery1,
    alt: 'Presentación de Amo Mi Voz',
    layout: 'wide'
  },
  {
    id: 'gallery-2',
    index: '13',
    category: 'shows',
    categoryLabel: 'PRESENTACIONES',
    title: 'Momento en vivo II',
    description:
      'Música, interpretación y experiencia compartida.',
    src: gallery2,
    alt: 'Presentación artística de Amo Mi Voz',
    layout: 'normal'
  },
  {
    id: 'gallery-3',
    index: '14',
    category: 'shows',
    categoryLabel: 'PRESENTACIONES',
    title: 'Momento en vivo III',
    description:
      'Una mirada a las experiencias construidas junto a nuestros estudiantes.',
    src: gallery3,
    alt: 'Escenario de Amo Mi Voz',
    layout: 'tall'
  },
  {
    id: 'gallery-4',
    index: '15',
    category: 'shows',
    categoryLabel: 'PRESENTACIONES',
    title: 'Momento en vivo IV',
    description:
      'El resultado de un proceso de ensayo y preparación.',
    src: gallery4,
    alt: 'Presentación de estudiantes de Amo Mi Voz',
    layout: 'normal'
  },
  {
    id: 'gallery-5',
    index: '16',
    category: 'shows',
    categoryLabel: 'PRESENTACIONES',
    title: 'Momento en vivo V',
    description:
      'Cada presentación deja una nueva experiencia y una nueva historia.',
    src: gallery5,
    alt: 'Experiencia escénica de Amo Mi Voz',
    layout: 'wide'
  }
]

/* =========================================================
   COMPUTED
========================================================= */

const filteredItems = computed(() => {
  if (activeFilter.value === 'all') {
    return items
  }

  return items.filter(
    item =>
      item.category === activeFilter.value
  )
})

const currentItem = computed(() => {
  return (
    filteredItems.value[
      currentLightboxIndex.value
    ] || filteredItems.value[0]
  )
})

/* =========================================================
   CONTEO
========================================================= */

function getFilterCount(filter) {
  if (filter === 'all') {
    return items.length
  }

  return items.filter(
    item => item.category === filter
  ).length
}

/* =========================================================
   LIGHTBOX
========================================================= */

function openLightbox(index) {
  currentLightboxIndex.value = index
  isLightboxOpen.value = true
}

function closeLightbox() {
  isLightboxOpen.value = false
}

function nextImage() {
  currentLightboxIndex.value =
    (
      currentLightboxIndex.value + 1
    ) %
    filteredItems.value.length
}

function previousImage() {
  currentLightboxIndex.value =
    (
      currentLightboxIndex.value -
      1 +
      filteredItems.value.length
    ) %
    filteredItems.value.length
}

/* =========================================================
   TECLADO
========================================================= */

function handleKeydown(event) {
  if (!isLightboxOpen.value) {
    return
  }

  if (event.key === 'Escape') {
    closeLightbox()
  }

  if (event.key === 'ArrowRight') {
    nextImage()
  }

  if (event.key === 'ArrowLeft') {
    previousImage()
  }
}

/* =========================================================
   BODY SCROLL
========================================================= */

watch(
  isLightboxOpen,
  open => {
    document.body.style.overflow =
      open ? 'hidden' : ''
  }
)

watch(
  activeFilter,
  () => {
    currentLightboxIndex.value = 0
  }
)

/* =========================================================
   CICLO DE VIDA
========================================================= */

onMounted(() => {
  window.addEventListener(
    'keydown',
    handleKeydown
  )
})

onUnmounted(() => {
  window.removeEventListener(
    'keydown',
    handleKeydown
  )

  document.body.style.overflow = ''
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.gallery-page {
  --surface: #0d0d0d;
  --border: #292929;

  min-height: 100vh;
  overflow: hidden;
  color: #f5f5f5;
  background: #080808;
}

.container {
  width: min(1200px, 100%);
  margin: 0 auto;
}

.eyebrow {
  display: flex;
  gap: 9px;
  align-items: center;
  color: variables.$color-primary;
  font-size: 0.62rem;
  font-weight: 900;
  letter-spacing: 0.19em;
  text-transform: uppercase;
}

.eyebrow > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: variables.$color-primary;
  box-shadow:
    0 0 15px
    rgba(212, 175, 55, 0.6);
}

.eyebrow--simple {
  display: block;
}

.display-title {
  margin: 17px 0 0;
  font-size:
    clamp(2.9rem, 5.4vw, 5.4rem);
  line-height: 0.94;
  letter-spacing: -0.06em;
}

.display-title em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

/* =========================================================
   HERO
========================================================= */

.hero {
  position: relative;
  overflow: hidden;
  padding:
    175px
    24px
    125px;
  background: #090909;
}

.hero__grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.013) 1px,
      transparent 1px
    ),
    linear-gradient(
      rgba(255, 255, 255, 0.013) 1px,
      transparent 1px
    );
  background-size: 72px 72px;
  mask-image:
    radial-gradient(
      circle at 50% 40%,
      black,
      transparent 80%
    );
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  filter: blur(150px);
}

.hero__glow--one {
  top: -150px;
  right: -140px;
  width: 620px;
  height: 620px;
  background:
    rgba(212, 175, 55, 0.08);
}

.hero__glow--two {
  bottom: -250px;
  left: -180px;
  width: 520px;
  height: 520px;
  background:
    rgba(212, 175, 55, 0.03);
}

.hero__content {
  position: relative;
  z-index: 2;
}

.hero h1 {
  max-width: 1050px;
  margin: 24px 0 0;
  font-size:
    clamp(4.2rem, 9vw, 9rem);
  line-height: 0.84;
  letter-spacing: -0.075em;
}

.hero h1 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.hero__lead {
  max-width: 690px;
  margin: 32px 0 0;
  color: #919191;
  font-size: 0.98rem;
  line-height: 1.85;
}

.hero__facts {
  display: grid;
  gap: 1px;
  overflow: hidden;
  max-width: 850px;
  margin-top: 50px;
  border: 1px solid #292929;
  border-radius: 13px;
  background: #292929;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.hero__facts article {
  display: flex;
  gap: 13px;
  padding: 17px;
  background: #0c0c0c;
}

.hero__facts article > span {
  color: variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
}

.hero__facts small,
.hero__facts strong {
  display: block;
}

.hero__facts small {
  color: #555;
  font-size: 0.43rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.hero__facts strong {
  margin-top: 4px;
  font-size: 0.63rem;
}

/* =========================================================
   INTRO
========================================================= */

.intro {
  padding:
    130px
    24px;
}

.intro__grid {
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.9fr 1.1fr;
  }
}

.intro__copy {
  max-width: 680px;
}

.intro__copy p {
  color: #797979;
  font-size: 0.86rem;
  line-height: 1.85;
}

.intro__lead {
  margin-top: 0;
  color: #c8c8c8 !important;
  font-size: 1.04rem !important;
}

/* =========================================================
   GALLERY SECTION
========================================================= */

.gallery-section {
  padding:
    125px
    24px;
  background: #0a0a0a;
}

.gallery-header {
  display: grid;
  gap: 30px;
  margin-bottom: 42px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      1fr
      0.4fr;
    align-items: end;
  }
}

.gallery-header > p {
  margin: 0;
  color: #757575;
  font-size: 0.78rem;
  line-height: 1.75;
}

/* =========================================================
   FILTERS
========================================================= */

.filters {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 40px;
}

.filters button {
  display: flex;
  gap: 10px;
  min-height: 42px;
  align-items: center;
  padding:
    0
    15px;
  border: 1px solid #303030;
  border-radius: 999px;
  color: #8b8b8b;
  background: #0d0d0d;
  font: inherit;
  font-size: 0.64rem;
  font-weight: 800;
  cursor: pointer;
  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}

.filters button:hover {
  transform: translateY(-2px);
  color: #fff;
  border-color: #484848;
}

.filters button.active {
  color: #080808;
  border-color: variables.$color-primary;
  background: variables.$color-primary;
}

.filters button small {
  display: grid;
  min-width: 22px;
  height: 22px;
  place-items: center;
  border-radius: 50%;
  color: inherit;
  background:
    rgba(255, 255, 255, 0.07);
  font-size: 0.47rem;
}

.filters button.active small {
  background:
    rgba(0, 0, 0, 0.12);
}

/* =========================================================
   GRID
========================================================= */

.gallery-grid {
  display: grid;
  grid-auto-flow: dense;
  grid-auto-rows: 250px;
  gap: 12px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @include mixins.respond-to(lg) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.gallery-card {
  position: relative;
  overflow: hidden;
  min-height: 250px;
  border: 1px solid #292929;
  border-radius: 17px;
  background: #111;
  cursor: pointer;
  isolation: isolate;
}

.gallery-card--wide {
  @include mixins.respond-to(md) {
    grid-column: span 2;
  }
}

.gallery-card--tall {
  grid-row: span 2;
}

.gallery-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    transform 0.7s ease,
    filter 0.4s ease;
}

.gallery-card:hover img {
  transform: scale(1.035);
}

.gallery-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.94),
      rgba(0, 0, 0, 0.08) 65%
    );
}

.gallery-card__top {
  position: absolute;
  top: 17px;
  right: 17px;
  left: 17px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.gallery-card__top > span {
  padding:
    6px
    9px;
  border:
    1px solid
    rgba(212, 175, 55, 0.28);
  border-radius: 999px;
  color: variables.$color-primary;
  background:
    rgba(5, 5, 5, 0.65);
  font-size: 0.43rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  backdrop-filter: blur(10px);
}

.gallery-card__top small {
  color: #aaa;
  font-size: 0.46rem;
  font-weight: 900;
}

.gallery-card__content {
  position: absolute;
  right: 19px;
  bottom: 19px;
  left: 19px;
}

.gallery-card__content h3 {
  margin: 0;
  font-size: 1rem;
}

.gallery-card__content p {
  max-width: 460px;
  margin: 7px 0 0;
  color: #929292;
  font-size: 0.62rem;
  line-height: 1.55;
}

.gallery-card__action {
  display: flex;
  gap: 7px;
  align-items: center;
  margin-top: 13px;
  color: variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
}

.gallery-card__action strong {
  transition: transform 0.2s ease;
}

.gallery-card:hover
.gallery-card__action strong {
  transform:
    translate(
      2px,
      -2px
    );
}

/* =========================================================
   TRANSITION GRID
========================================================= */

.gallery-enter-active,
.gallery-leave-active {
  transition:
    opacity 0.25s ease,
    transform 0.25s ease;
}

.gallery-enter-from,
.gallery-leave-to {
  opacity: 0;
  transform: scale(0.98);
}

/* =========================================================
   EDITORIAL
========================================================= */

.editorial {
  padding:
    130px
    24px;
}

.editorial__grid {
  display: grid;
  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.7fr
      1.3fr;
    align-items: center;
  }
}

.editorial__brand {
  display: flex;
  gap: 17px;
  align-items: center;
  padding: 26px;
  border: 1px solid #292929;
  border-radius: 17px;
  background:
    radial-gradient(
      circle at 20% 50%,
      rgba(212, 175, 55, 0.06),
      transparent 50%
    ),
    #0d0d0d;
}

.editorial__brand img {
  width: auto;
  height: 95px;
  object-fit: contain;
}

.editorial__brand small,
.editorial__brand strong {
  display: block;
}

.editorial__brand small {
  margin-bottom: 5px;
  color: #595959;
  font-size: 0.44rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.editorial__brand strong {
  font-size: 1rem;
}

.editorial__content h2 {
  max-width: 700px;
  margin: 18px 0 0;
  font-size:
    clamp(2.8rem, 5vw, 5rem);
  line-height: 0.95;
  letter-spacing: -0.06em;
}

.editorial__content h2 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.editorial__content > p {
  max-width: 620px;
  margin-top: 24px;
  color: #797979;
  font-size: 0.8rem;
  line-height: 1.8;
}

/* =========================================================
   CTA
========================================================= */

.cta {
  position: relative;
  overflow: hidden;
  padding:
    145px
    24px;
  background: #090909;
}

.cta__grid {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.012) 1px,
      transparent 1px
    ),
    linear-gradient(
      rgba(255, 255, 255, 0.012) 1px,
      transparent 1px
    );
  background-size: 70px 70px;
}

.cta__glow {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 800px;
  height: 500px;
  border-radius: 50%;
  background:
    rgba(212, 175, 55, 0.07);
  transform:
    translate(-50%, -50%);
  filter: blur(170px);
}

.cta__content {
  position: relative;
  z-index: 2;
  display: grid;
  justify-items: center;
  text-align: center;
}

.cta h2 {
  max-width: 950px;
  margin: 18px 0 0;
  font-size:
    clamp(3.3rem, 7vw, 6.8rem);
  line-height: 0.89;
  letter-spacing: -0.07em;
}

.cta h2 em {
  display: block;
  color: variables.$color-primary;
  font-style: normal;
}

.cta p {
  max-width: 550px;
  margin:
    25px
    0
    30px;
  color: #818181;
  font-size: 0.82rem;
  line-height: 1.7;
}

.cta__button {
  display: inline-flex;
  gap: 10px;
  min-height: 56px;
  align-items: center;
  justify-content: center;
  padding:
    0
    25px;
  border-radius: 10px;
  color: #080808;
  background: variables.$color-primary;
  font-size: 0.72rem;
  font-weight: 900;
  text-decoration: none;
  box-shadow:
    0 17px 40px
    rgba(212, 175, 55, 0.12);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.cta__button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 22px 50px
    rgba(212, 175, 55, 0.18);
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .hero {
    padding:
      145px
      20px
      95px;
  }

  .intro,
  .gallery-section,
  .editorial,
  .cta {
    padding:
      95px
      20px;
  }
}

@media (max-width: 700px) {
  .hero {
    padding:
      130px
      17px
      80px;
  }

  .hero h1 {
    font-size:
      clamp(
        3.6rem,
        15vw,
        5.7rem
      );
  }

  .gallery-grid {
    grid-template-columns: 1fr;
    grid-auto-rows: 320px;
  }

  .gallery-card--wide,
  .gallery-card--tall {
    grid-column: auto;
    grid-row: auto;
  }

  .filters {
    overflow-x: auto;
    flex-wrap: nowrap;
    padding-bottom: 6px;
    scrollbar-width: none;
  }

  .filters::-webkit-scrollbar {
    display: none;
  }

  .filters button {
    flex: 0 0 auto;
  }
}

@media (max-width: 500px) {
  .gallery-grid {
    grid-auto-rows: 280px;
  }

  .editorial__brand {
    flex-direction: column;
    align-items: flex-start;
  }

  .editorial__brand img {
    height: 80px;
  }
}
</style>

<!-- =========================================================
     LIGHTBOX GLOBAL
========================================================== -->
<style lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

.lightbox {
  position: fixed;
  z-index: 60000;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 28px;
  color: #fff;
}

.lightbox__backdrop {
  position: absolute;
  inset: 0;
  background:
    rgba(0, 0, 0, 0.94);
  backdrop-filter:
    blur(15px);
}

.lightbox__content {
  position: relative;
  z-index: 2;
  display: grid;
  width: min(1100px, 100%);
  max-height: calc(100dvh - 100px);
  margin: 0;
  overflow: hidden;
  border: 1px solid #303030;
  border-radius: 18px;
  background: #0b0b0b;
  box-shadow:
    0 40px 120px
    rgba(0, 0, 0, 0.7);
}

.lightbox__content img {
  display: block;
  width: 100%;
  max-height:
    calc(
      100dvh - 180px
    );
  object-fit: contain;
  background: #050505;
}

.lightbox__content figcaption {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: space-between;
  padding: 17px 20px;
  border-top: 1px solid #272727;
}

.lightbox__content small,
.lightbox__content strong {
  display: block;
}

.lightbox__content small {
  color: variables.$color-primary;
  font-size: 0.46rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.lightbox__content strong {
  margin-top: 4px;
  font-size: 0.75rem;
}

.lightbox__content figcaption > span {
  color: #555;
  font-size: 0.57rem;
  font-weight: 900;
}

.lightbox__close,
.lightbox__nav {
  position: fixed;
  z-index: 5;
  display: grid;
  place-items: center;
  border:
    1px solid
    rgba(255, 255, 255, 0.12);
  color: #fff;
  background:
    rgba(12, 12, 12, 0.84);
  backdrop-filter: blur(12px);
  cursor: pointer;
  transition:
    color 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.lightbox__close:hover,
.lightbox__nav:hover {
  color: variables.$color-primary;
  border-color:
    rgba(212, 175, 55, 0.45);
  background:
    rgba(212, 175, 55, 0.06);
}

.lightbox__close {
  top:
    max(
      18px,
      env(safe-area-inset-top)
    );
  right: 18px;
  width: 48px;
  height: 48px;
  border-radius: 13px;
  font-size: 1.6rem;
}

.lightbox__nav {
  top: 50%;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  transform:
    translateY(-50%);
}

.lightbox__nav--prev {
  left: 18px;
}

.lightbox__nav--next {
  right: 18px;
}

.lightbox-enter-active,
.lightbox-leave-active {
  transition:
    opacity 0.25s ease;
}

.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}

@media (max-width: 700px) {
  .lightbox {
    padding:
      75px
      12px
      20px;
  }

  .lightbox__content {
    max-height:
      calc(
        100dvh - 100px
      );
  }

  .lightbox__content img {
    max-height:
      calc(
        100dvh - 175px
      );
  }

  .lightbox__nav {
    top: auto;
    bottom:
      calc(
        20px +
        env(safe-area-inset-bottom)
      );
    transform: none;
  }

  .lightbox__nav--prev {
    left: 20px;
  }

  .lightbox__nav--next {
    right: 20px;
  }
}
</style>
