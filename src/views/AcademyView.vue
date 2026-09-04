<template>
  <main class="academy-page">
    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="academy-hero">
      <div class="container academy-hero__layout">
        <div class="academy-hero__content">
          <span class="academy-eyebrow">
            Academia de Talentos · La Calera
          </span>

          <h1>
            Aprende música.
            <em>Encuentra tu voz.</em>
          </h1>

          <p>
            Formación vocal, musical y escénica
            para niños, jóvenes y adultos.
          </p>

          <div class="academy-hero__actions">
            <RouterLink
              to="/inscripcion"
              class="academy-button academy-button--primary"
            >
              Quiero inscribirme

              <span aria-hidden="true">
                →
              </span>
            </RouterLink>

            <RouterLink
              to="/formacion"
              class="academy-button academy-button--secondary"
            >
              Ver cómo aprendemos
            </RouterLink>
          </div>

          <div
            class="academy-hero__trust"
            aria-label="Características de la academia"
          >
            <span>
              Todas las edades
            </span>

            <i></i>

            <span>
              Formación práctica
            </span>

            <i></i>

            <span>
              Experiencia escénica
            </span>
          </div>
        </div>

        <figure class="academy-hero__visual">
          <img
            :src="student10"
            alt="Estudiante de la Academia de Talentos Amo Mi Voz"
          />

          <div class="academy-hero__overlay"></div>

          <figcaption>
            <span>
              Amo Mi Voz
            </span>

            <strong>
              Aprender haciendo.
            </strong>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- =====================================================
         QUÉ HACEMOS
    ====================================================== -->
    <section class="academy-focus section">
      <div class="container">
        <header class="academy-section-heading">
          <div>
            <span class="academy-eyebrow">
              Nuestra formación
            </span>

            <h2>
              Mucho más que
              <em>aprender canciones.</em>
            </h2>
          </div>

          <p>
            Conectamos voz, música,
            interpretación y escenario
            dentro de un mismo proceso.
          </p>
        </header>

        <div class="academy-focus__grid">
          <article
            v-for="area in areas"
            :key="area.number"
            class="academy-focus__card"
          >
            <span class="academy-focus__number">
              {{ area.number }}
            </span>

            <div class="academy-focus__icon">
              {{ area.symbol }}
            </div>

            <h3>
              {{ area.title }}
            </h3>

            <p>
              {{ area.description }}
            </p>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         MÉTODO
    ====================================================== -->
    <section class="academy-method section">
      <div class="container academy-method__layout">
        <div class="academy-method__content">
          <span class="academy-eyebrow">
            Cómo aprendemos
          </span>

          <h2>
            Comprender.
            <br />
            Practicar.
            <br />
            <em>Compartir.</em>
          </h2>

          <p>
            La teoría se transforma rápidamente
            en ejercicios, repertorio y experiencias
            musicales reales.
          </p>

          <RouterLink
            to="/formacion"
            class="academy-text-link"
          >
            Conocer el programa formativo

            <span aria-hidden="true">
              →
            </span>
          </RouterLink>
        </div>

        <div class="academy-method__steps">
          <article
            v-for="step in methodSteps"
            :key="step.number"
          >
            <span>
              {{ step.number }}
            </span>

            <div>
              <h3>
                {{ step.title }}
              </h3>

              <p>
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         EXPERIENCIA REAL
    ====================================================== -->
    <section class="academy-stage section">
      <div class="container academy-stage__layout">
        <figure class="academy-stage__image">
          <img
            :src="student11"
            alt="Estudiante participando en el proceso formativo de Amo Mi Voz"
            loading="lazy"
          />

          <div class="academy-stage__overlay"></div>

          <figcaption>
            <span>
              Del aula al escenario
            </span>

            <strong>
              La experiencia
              también enseña.
            </strong>
          </figcaption>
        </figure>

        <div class="academy-stage__content">
          <span class="academy-eyebrow">
            Experiencia Amo Mi Voz
          </span>

          <h2>
            Aprender música
            <em>viviéndola.</em>
          </h2>

          <p>
            Clases, repertorio, ensayos,
            conciertos y producciones artísticas
            forman parte del proceso.
          </p>

          <div class="academy-stage__highlights">
            <div>
              <strong>
                Aula
              </strong>

              <span>
                Aprender
              </span>
            </div>

            <div>
              <strong>
                Ensayo
              </strong>

              <span>
                Preparar
              </span>
            </div>

            <div>
              <strong>
                Escenario
              </strong>

              <span>
                Compartir
              </span>
            </div>
          </div>

          <RouterLink
            to="/musicales"
            class="academy-text-link"
          >
            Ver nuestras experiencias

            <span aria-hidden="true">
              →
            </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- =====================================================
         PARA TODAS LAS EDADES
    ====================================================== -->
    <section class="academy-people section">
      <div class="container academy-people__layout">
        <div class="academy-people__content">
          <span class="academy-eyebrow">
            Una academia para crecer
          </span>

          <h2>
            Cada persona aprende
            <em>a su ritmo.</em>
          </h2>

          <p>
            Trabajamos con niños, jóvenes y adultos,
            respetando la experiencia, los objetivos
            y el proceso de cada estudiante.
          </p>

          <div class="academy-people__audiences">
            <span>
              Niños
            </span>

            <span>
              Jóvenes
            </span>

            <span>
              Adultos
            </span>
          </div>
        </div>

        <figure class="academy-people__image">
          <img
            :src="student12"
            alt="Comunidad de estudiantes de Amo Mi Voz"
            loading="lazy"
          />

          <div class="academy-people__overlay"></div>

          <figcaption>
            Cada voz tiene
            <strong>su propio camino.</strong>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- =====================================================
         DIRECCIÓN
    ====================================================== -->
    <section class="academy-director section">
      <div class="container academy-director__layout">
        <div
          class="academy-director__identity"
          aria-hidden="true"
        >
          <span>
            MZ
          </span>
        </div>

        <div class="academy-director__content">
          <span class="academy-eyebrow">
            Dirección artística y musical
          </span>

          <h2>
            Matías Zúñiga
          </h2>

          <p>
            Dirección formativa, preparación vocal,
            repertorio, producción musical
            y experiencia escénica.
          </p>

          <blockquote>
            “Cada voz tiene una historia.
            Nuestro trabajo es ayudarla
            a ser escuchada.”
          </blockquote>

          <RouterLink
            to="/contacto"
            class="academy-text-link"
          >
            Contactar con la academia

            <span aria-hidden="true">
              →
            </span>
          </RouterLink>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CTA FINAL
    ====================================================== -->
    <section class="academy-cta">
      <div class="container academy-cta__content">
        <span class="academy-eyebrow">
          Tu proceso puede comenzar aquí
        </span>

        <h2>
          ¿Quieres descubrir
          <em>hasta dónde puede llegar tu voz?</em>
        </h2>

        <p>
          Cuéntanos sobre ti.
          Te orientaremos para comenzar.
        </p>

        <div class="academy-cta__actions">
          <RouterLink
            to="/inscripcion"
            class="academy-button academy-button--primary academy-button--large"
          >
            Inscribirme

            <span aria-hidden="true">
              →
            </span>
          </RouterLink>

          <RouterLink
            to="/contacto"
            class="academy-button academy-button--secondary academy-button--large"
          >
            Tengo una consulta
          </RouterLink>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import student10 from '@/assets/images/alumno-2.png'
import student11 from '@/assets/images/alumno-11.png'
import student12 from '@/assets/images/alumno-12.png'

const areas = [
  {
    number: '01',
    symbol: '♪',
    title: 'Voz',
    description:
      'Respiración, resonancia, afinación y confianza vocal.'
  },
  {
    number: '02',
    symbol: '♬',
    title: 'Música',
    description:
      'Ritmo, oído, teoría y comprensión musical.'
  },
  {
    number: '03',
    symbol: '◇',
    title: 'Interpretación',
    description:
      'Emoción, intención, presencia y comunicación.'
  },
  {
    number: '04',
    symbol: '↗',
    title: 'Escenario',
    description:
      'Ensayos, conciertos y experiencias frente al público.'
  }
]

const methodSteps = [
  {
    number: '01',
    title: 'Comprender',
    description:
      'Entendemos qué hacemos y por qué.'
  },
  {
    number: '02',
    title: 'Experimentar',
    description:
      'Llevamos los conceptos a la voz, el cuerpo y el oído.'
  },
  {
    number: '03',
    title: 'Practicar',
    description:
      'Aplicamos las herramientas dentro del repertorio.'
  },
  {
    number: '04',
    title: 'Compartir',
    description:
      'Transformamos el aprendizaje en experiencia artística.'
  }
]
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.academy-page {
  min-height: 100vh;

  overflow: hidden;

  background:
    variables.$color-background;

  color:
    variables.$color-text-primary;
}

/* =========================================================
   ELEMENTOS COMPARTIDOS
========================================================= */

.academy-eyebrow {
  display: block;

  color:
    variables.$color-primary;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.13em;

  line-height: 1.4;

  text-transform:
    uppercase;
}

.academy-button {
  display: inline-flex;

  min-height:
    variables.$control-height-lg;

  gap:
    0.75rem;

  align-items: center;
  justify-content: center;

  padding:
    0 1.4rem;

  border:
    1px solid transparent;

  border-radius:
    variables.$radius-md;

  font-family:
    variables.$font-family-primary;

  font-size:
    0.9rem;

  font-weight:
    variables.$font-weight-semibold;

  line-height: 1;

  transition:
    transform
      variables.$transition-fast,
    background-color
      variables.$transition-fast,
    border-color
      variables.$transition-fast,
    color
      variables.$transition-fast,
    box-shadow
      variables.$transition-fast;
}

.academy-button:hover {
  transform:
    translateY(-2px);
}

.academy-button--primary {
  color:
    variables.$color-black;

  background:
    variables.$color-primary;

  box-shadow:
    variables.$shadow-primary;
}

.academy-button--primary:hover {
  background:
    variables.$color-primary-light;
}

.academy-button--secondary {
  border-color:
    variables.$color-border;

  color:
    variables.$color-text-primary;

  background:
    rgba(
      variables.$color-white,
      0.025
    );
}

.academy-button--secondary:hover {
  border-color:
    variables.$color-border-strong;

  background:
    rgba(
      variables.$color-white,
      0.05
    );
}

.academy-button--large {
  min-height: 60px;

  padding-inline:
    1.7rem;
}

.academy-text-link {
  display: inline-flex;

  width: fit-content;

  gap:
    0.7rem;

  align-items: center;

  margin-top:
    1.75rem;

  color:
    variables.$color-text-primary;

  font-size:
    0.9rem;

  font-weight:
    variables.$font-weight-semibold;
}

.academy-text-link span {
  color:
    variables.$color-primary;

  transition:
    transform
      variables.$transition-fast;
}

.academy-text-link:hover span {
  transform:
    translateX(4px);
}

/* =========================================================
   HERO
========================================================= */

.academy-hero {
  position: relative;

  padding:
    clamp(
      8.5rem,
      13vw,
      11rem
    )
    0
    clamp(
      5rem,
      9vw,
      8rem
    );

  border-bottom:
    1px solid
    variables.$color-border-soft;
}

.academy-hero::before {
  position: absolute;

  top: -25rem;
  right: -18rem;

  width: 45rem;
  height: 45rem;

  content: '';

  border-radius: 50%;

  pointer-events: none;

  background:
    rgba(
      variables.$color-primary,
      0.045
    );

  filter:
    blur(150px);
}

.academy-hero__layout {
  position: relative;

  display: grid;

  gap:
    clamp(
      3rem,
      7vw,
      6rem
    );

  align-items: center;
}

.academy-hero__content {
  position: relative;

  z-index: 2;
}

.academy-hero h1 {
  max-width:
    760px;

  margin-top:
    1.25rem;

  font-size:
    clamp(
      3.2rem,
      7vw,
      6.8rem
    );

  line-height:
    0.92;

  letter-spacing:
    -0.055em;
}

.academy-hero h1 em {
  display: block;

  color:
    variables.$color-primary;

  font-style: normal;
}

.academy-hero__content > p {
  max-width:
    560px;

  margin-top:
    1.75rem;

  color:
    variables.$color-text-secondary;

  font-size:
    clamp(
      1rem,
      1.7vw,
      1.15rem
    );

  line-height:
    1.75;
}

.academy-hero__actions {
  display: flex;

  gap:
    0.75rem;

  flex-wrap: wrap;

  margin-top:
    2rem;
}

.academy-hero__trust {
  display: flex;

  gap:
    0.85rem;

  flex-wrap: wrap;

  align-items: center;

  margin-top:
    2.25rem;

  color:
    variables.$color-text-muted;

  font-size:
    0.825rem;

  font-weight:
    variables.$font-weight-medium;
}

.academy-hero__trust i {
  width: 4px;
  height: 4px;

  border-radius: 50%;

  background:
    variables.$color-primary;
}

.academy-hero__visual {
  position: relative;

  overflow: hidden;

  min-height:
    clamp(
      480px,
      58vw,
      650px
    );

  margin: 0;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-xl;

  background:
    variables.$color-surface;

  box-shadow:
    variables.$shadow-lg;
}

.academy-hero__visual img {
  width: 100%;
  height: 100%;

  min-height: inherit;

  object-fit: cover;

  transition:
    transform
      variables.$transition-slow;
}

.academy-hero__visual:hover img {
  transform:
    scale(1.02);
}

.academy-hero__overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(
        variables.$color-black,
        0.88
      ),
      rgba(
        variables.$color-black,
        0.02
      )
      65%
    );
}

.academy-hero__visual figcaption {
  position: absolute;

  right: 2rem;
  bottom: 2rem;
  left: 2rem;
}

.academy-hero__visual figcaption span {
  display: block;

  margin-bottom:
    0.6rem;

  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.12em;

  text-transform:
    uppercase;
}

.academy-hero__visual figcaption strong {
  display: block;

  max-width:
    400px;

  color:
    variables.$color-white;

  font-family:
    variables.$font-family-heading;

  font-size:
    clamp(
      2rem,
      4vw,
      3.5rem
    );

  line-height:
    1;
}

@include mixins.respond-to(lg) {
  .academy-hero__layout {
    grid-template-columns:
      minmax(0, 1.05fr)
      minmax(390px, 0.95fr);
  }
}

/* =========================================================
   SECTION HEADING
========================================================= */

.academy-section-heading {
  display: grid;

  gap:
    2rem;

  align-items: end;

  margin-bottom:
    clamp(
      2.5rem,
      5vw,
      4.5rem
    );
}

.academy-section-heading h2,
.academy-method h2,
.academy-stage h2,
.academy-people h2 {
  margin-top:
    0.9rem;

  font-size:
    clamp(
      2.5rem,
      5vw,
      4.8rem
    );

  line-height:
    0.98;

  letter-spacing:
    -0.045em;
}

.academy-section-heading h2 em,
.academy-method h2 em,
.academy-stage h2 em,
.academy-people h2 em {
  color:
    variables.$color-primary;

  font-style: normal;
}

.academy-section-heading h2 em {
  display: block;
}

.academy-section-heading > p {
  max-width:
    430px;

  color:
    variables.$color-text-secondary;

  font-size:
    1rem;

  line-height:
    1.7;
}

@include mixins.respond-to(md) {
  .academy-section-heading {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(260px, 0.42fr);
  }
}

/* =========================================================
   FOCUS
========================================================= */

.academy-focus {
  background:
    variables.$color-background;
}

.academy-focus__grid {
  display: grid;

  gap:
    1rem;
}

.academy-focus__card {
  position: relative;

  min-height:
    250px;

  padding:
    clamp(
      1.5rem,
      3vw,
      2rem
    );

  border:
    1px solid
    variables.$color-border-soft;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface;

  transition:
    transform
      variables.$transition-normal,
    border-color
      variables.$transition-normal,
    background-color
      variables.$transition-normal;
}

.academy-focus__card:hover {
  border-color:
    variables.$color-border-strong;

  background:
    variables.$color-surface-elevated;

  transform:
    translateY(-3px);
}

.academy-focus__number {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;
}

.academy-focus__icon {
  display: grid;

  width: 48px;
  height: 48px;

  place-items: center;

  margin-top:
    2rem;

  border-radius: 50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.09
    );

  font-size:
    1.1rem;
}

.academy-focus__card h3 {
  margin-top:
    1.35rem;

  font-family:
    variables.$font-family-primary;

  font-size:
    1.15rem;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.02em;
}

.academy-focus__card p {
  margin-top:
    0.65rem;

  color:
    variables.$color-text-secondary;

  font-size:
    0.9rem;

  line-height:
    1.65;
}

@include mixins.respond-to(md) {
  .academy-focus__grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

@include mixins.respond-to(lg) {
  .academy-focus__grid {
    grid-template-columns:
      repeat(
        4,
        minmax(0, 1fr)
      );
  }
}

/* =========================================================
   MÉTODO
========================================================= */

.academy-method {
  border-block:
    1px solid
    variables.$color-border-soft;

  background:
    variables.$color-surface;
}

.academy-method__layout {
  display: grid;

  gap:
    clamp(
      3rem,
      7vw,
      6rem
    );
}

.academy-method__content > p {
  max-width:
    500px;

  margin-top:
    1.5rem;

  color:
    variables.$color-text-secondary;

  font-size:
    1rem;

  line-height:
    1.75;
}

.academy-method__steps {
  display: grid;

  border-top:
    1px solid
    variables.$color-border;
}

.academy-method__steps article {
  display: grid;

  gap:
    1rem;

  padding:
    1.5rem
    0;

  border-bottom:
    1px solid
    variables.$color-border;

  grid-template-columns:
    42px
    minmax(
      0,
      1fr
    );
}

.academy-method__steps article > span {
  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

.academy-method__steps h3 {
  font-family:
    variables.$font-family-primary;

  font-size:
    1.05rem;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.015em;
}

.academy-method__steps p {
  margin-top:
    0.4rem;

  color:
    variables.$color-text-secondary;

  font-size:
    0.9rem;

  line-height:
    1.6;
}

@include mixins.respond-to(lg) {
  .academy-method__layout {
    grid-template-columns:
      minmax(0, 0.85fr)
      minmax(420px, 1.15fr);
  }
}

/* =========================================================
   ESCENARIO
========================================================= */

.academy-stage__layout {
  display: grid;

  gap:
    clamp(
      3rem,
      7vw,
      6rem
    );

  align-items: center;
}

.academy-stage__image {
  position: relative;

  overflow: hidden;

  min-height:
    clamp(
      460px,
      55vw,
      650px
    );

  margin: 0;

  border-radius:
    variables.$radius-xl;

  background:
    variables.$color-surface;
}

.academy-stage__image img {
  width: 100%;
  height: 100%;

  min-height: inherit;

  object-fit: cover;
}

.academy-stage__overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(
        variables.$color-black,
        0.9
      ),
      transparent
      65%
    );
}

.academy-stage__image figcaption {
  position: absolute;

  right: 2rem;
  bottom: 2rem;
  left: 2rem;
}

.academy-stage__image figcaption span {
  display: block;

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

.academy-stage__image figcaption strong {
  display: block;

  max-width:
    420px;

  margin-top:
    0.6rem;

  color:
    variables.$color-white;

  font-family:
    variables.$font-family-heading;

  font-size:
    clamp(
      2rem,
      4vw,
      3.5rem
    );

  line-height:
    1;
}

.academy-stage__content > p {
  max-width:
    520px;

  margin-top:
    1.5rem;

  color:
    variables.$color-text-secondary;

  font-size:
    1rem;

  line-height:
    1.75;
}

.academy-stage__highlights {
  display: grid;

  gap:
    1px;

  overflow: hidden;

  margin-top:
    2rem;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-border;
}

.academy-stage__highlights div {
  padding:
    1.25rem;

  background:
    variables.$color-surface;
}

.academy-stage__highlights strong,
.academy-stage__highlights span {
  display: block;
}

.academy-stage__highlights strong {
  color:
    variables.$color-text-primary;

  font-size:
    0.95rem;
}

.academy-stage__highlights span {
  margin-top:
    0.3rem;

  color:
    variables.$color-text-muted;

  font-size:
    0.825rem;
}

@include mixins.respond-to(sm) {
  .academy-stage__highlights {
    grid-template-columns:
      repeat(
        3,
        1fr
      );
  }
}

@include mixins.respond-to(lg) {
  .academy-stage__layout {
    grid-template-columns:
      minmax(390px, 1fr)
      minmax(0, 0.9fr);
  }
}

/* =========================================================
   EDADES
========================================================= */

.academy-people {
  background:
    variables.$color-surface;
}

.academy-people__layout {
  display: grid;

  gap:
    clamp(
      3rem,
      7vw,
      6rem
    );

  align-items: center;
}

.academy-people__content > p {
  max-width:
    530px;

  margin-top:
    1.5rem;

  color:
    variables.$color-text-secondary;

  font-size:
    1rem;

  line-height:
    1.75;
}

.academy-people__audiences {
  display: flex;

  gap:
    0.65rem;

  flex-wrap: wrap;

  margin-top:
    2rem;
}

.academy-people__audiences span {
  padding:
    0.7rem
    1rem;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-pill;

  color:
    variables.$color-text-primary;

  background:
    rgba(
      variables.$color-white,
      0.02
    );

  font-size:
    0.875rem;

  font-weight:
    variables.$font-weight-medium;
}

.academy-people__image {
  position: relative;

  overflow: hidden;

  min-height:
    clamp(
      420px,
      52vw,
      600px
    );

  margin: 0;

  border-radius:
    variables.$radius-xl;

  background:
    variables.$color-surface-light;
}

.academy-people__image img {
  width: 100%;
  height: 100%;

  min-height: inherit;

  object-fit: cover;
}

.academy-people__overlay {
  position: absolute;

  inset: 0;

  background:
    linear-gradient(
      to top,
      rgba(
        variables.$color-black,
        0.9
      ),
      transparent
      65%
    );
}

.academy-people__image figcaption {
  position: absolute;

  right: 2rem;
  bottom: 2rem;
  left: 2rem;

  max-width:
    360px;

  color:
    variables.$color-white;

  font-family:
    variables.$font-family-heading;

  font-size:
    clamp(
      1.8rem,
      4vw,
      3rem
    );

  line-height:
    1.05;
}

.academy-people__image
figcaption strong {
  display: block;

  color:
    variables.$color-primary;
}

@include mixins.respond-to(lg) {
  .academy-people__layout {
    grid-template-columns:
      minmax(0, 0.9fr)
      minmax(390px, 1fr);
  }
}

/* =========================================================
   DIRECCIÓN
========================================================= */

.academy-director {
  border-bottom:
    1px solid
    variables.$color-border-soft;
}

.academy-director__layout {
  display: grid;

  gap:
    clamp(
      2.5rem,
      6vw,
      5rem
    );

  align-items: center;
}

.academy-director__identity {
  display: grid;

  width:
    clamp(
      150px,
      22vw,
      220px
    );

  aspect-ratio: 1;

  place-items: center;

  border:
    1px solid
    variables.$color-border-primary;

  border-radius:
    50%;

  background:
    radial-gradient(
      circle,
      rgba(
        variables.$color-primary,
        0.08
      ),
      transparent
      70%
    );
}

.academy-director__identity span {
  color:
    variables.$color-primary;

  font-family:
    variables.$font-family-primary;

  font-size:
    clamp(
      2.5rem,
      5vw,
      4rem
    );

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    -0.05em;
}

.academy-director__content h2 {
  margin-top:
    0.8rem;

  font-size:
    clamp(
      2.5rem,
      5vw,
      4.5rem
    );

  line-height:
    1;
}

.academy-director__content > p {
  max-width:
    600px;

  margin-top:
    1.25rem;

  color:
    variables.$color-text-secondary;

  font-size:
    1rem;

  line-height:
    1.7;
}

.academy-director blockquote {
  max-width:
    620px;

  margin:
    1.75rem
    0
    0;

  padding:
    1.25rem
    1.5rem;

  border-left:
    2px solid
    variables.$color-primary;

  color:
    variables.$color-text-primary;

  background:
    rgba(
      variables.$color-primary,
      0.035
    );

  font-family:
    variables.$font-family-heading;

  font-size:
    clamp(
      1.2rem,
      2vw,
      1.55rem
    );

  font-style: italic;

  line-height:
    1.45;
}

@include mixins.respond-to(md) {
  .academy-director__layout {
    grid-template-columns:
      auto
      minmax(
        0,
        1fr
      );
  }
}

/* =========================================================
   CTA
========================================================= */

.academy-cta {
  position: relative;

  padding-block:
    clamp(
      6rem,
      11vw,
      10rem
    );

  overflow: hidden;

  background:
    variables.$color-background;
}

.academy-cta::before {
  position: absolute;

  top: 50%;
  left: 50%;

  width:
    min(
      850px,
      95vw
    );

  height:
    500px;

  content: '';

  border-radius:
    50%;

  pointer-events: none;

  background:
    rgba(
      variables.$color-primary,
      0.055
    );

  transform:
    translate(
      -50%,
      -50%
    );

  filter:
    blur(160px);
}

.academy-cta__content {
  position: relative;

  z-index: 2;

  display: grid;

  justify-items: center;

  text-align: center;
}

.academy-cta h2 {
  max-width:
    950px;

  margin-top:
    1rem;

  font-size:
    clamp(
      3rem,
      7vw,
      6.5rem
    );

  line-height:
    0.92;

  letter-spacing:
    -0.055em;
}

.academy-cta h2 em {
  display: block;

  color:
    variables.$color-primary;

  font-style: normal;
}

.academy-cta p {
  max-width:
    510px;

  margin-top:
    1.5rem;

  color:
    variables.$color-text-secondary;

  font-size:
    1rem;

  line-height:
    1.7;
}

.academy-cta__actions {
  display: flex;

  gap:
    0.75rem;

  flex-wrap: wrap;
  justify-content: center;

  margin-top:
    2rem;
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 700px) {
  .academy-hero__actions,
  .academy-cta__actions {
    width: 100%;

    flex-direction: column;
  }

  .academy-hero__actions
  .academy-button,
  .academy-cta__actions
  .academy-button {
    width: 100%;
  }

  .academy-hero__trust {
    gap:
      0.6rem;

    font-size:
      0.78rem;
  }

  .academy-hero__visual {
    min-height:
      470px;
  }

  .academy-hero__visual figcaption,
  .academy-stage__image figcaption,
  .academy-people__image figcaption {
    right:
      1.35rem;

    bottom:
      1.35rem;

    left:
      1.35rem;
  }

  .academy-stage__image,
  .academy-people__image {
    min-height:
      460px;
  }

  .academy-director__identity {
    width:
      145px;
  }
}

@media (max-width: 420px) {
  .academy-hero__trust i {
    display: none;
  }

  .academy-hero__trust {
    align-items:
      flex-start;

    flex-direction:
      column;
  }

  .academy-hero__visual,
  .academy-stage__image,
  .academy-people__image {
    min-height:
      410px;
  }
}
</style>
