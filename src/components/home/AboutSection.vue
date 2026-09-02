<template>
  <section class="about">
    <div class="about__grid" aria-hidden="true"></div>
    <div class="about__glow about__glow--left" aria-hidden="true"></div>
    <div class="about__glow about__glow--right" aria-hidden="true"></div>

    <div class="container about__container">
      <!-- =========================
           VISUAL
      ========================== -->
      <div class="about__visual">
        <figure class="about__image-frame">
          <img
            :src="studentImage"
            alt="Estudiante de la Academia de Talentos Amo Mi Voz"
            class="about__image"
            loading="lazy"
          />

          <div class="about__image-overlay"></div>

          <div class="about__visual-status">
            <span></span>
            EXPERIENCIA FORMATIVA
          </div>

          <figcaption class="about__image-caption">
            <small>
              APRENDER · PRACTICAR · INTERPRETAR
            </small>

            <strong>
              La formación cobra sentido
              <em>cuando se vive.</em>
            </strong>
          </figcaption>
        </figure>

        <div class="about__floating about__floating--top">
          <span>01</span>

          <div>
            <small>PROCESO</small>
            <strong>Personal y progresivo</strong>
          </div>
        </div>

        <div class="about__floating about__floating--bottom">
          <span>♪</span>

          <div>
            <small>EXPERIENCIA</small>
            <strong>Aula + escenario</strong>
          </div>
        </div>

        <div class="about__mini-grid">
          <article
            v-for="area in miniAreas"
            :key="area.title"
          >
            <span>{{ area.number }}</span>

            <div>
              <strong>{{ area.title }}</strong>
              <small>{{ area.description }}</small>
            </div>
          </article>
        </div>
      </div>

      <!-- =========================
           CONTENIDO
      ========================== -->
      <div class="about__content">
        <span class="about__eyebrow">
          NUESTRA ACADEMIA
        </span>

        <h2>
          Aprender música es
          <span>mucho más que cantar.</span>
        </h2>

        <p class="about__lead">
          En Amo Mi Voz desarrollamos un proceso donde cada
          estudiante aprende a conocer su voz, comprender la
          música y desenvolverse con mayor seguridad.
        </p>

        <p class="about__description">
          Técnica vocal, entrenamiento auditivo, teoría musical,
          interpretación y experiencia escénica se conectan
          constantemente con el repertorio, los ensayos y las
          presentaciones.
        </p>

        <!-- =========================
             RECORRIDO
        ========================== -->
        <div class="about__journey">
          <article
            v-for="step in journey"
            :key="step.number"
            class="about__journey-step"
          >
            <span class="about__journey-number">
              {{ step.number }}
            </span>

            <div class="about__journey-copy">
              <small>{{ step.label }}</small>

              <h3>{{ step.title }}</h3>

              <p>{{ step.description }}</p>
            </div>
          </article>
        </div>

        <!-- =========================
             AULA VIRTUAL
        ========================== -->
        <div class="about__digital">
          <div class="about__digital-icon">
            ♪
          </div>

          <div class="about__digital-copy">
            <small>
              FORMACIÓN PRESENCIAL + APOYO DIGITAL
            </small>

            <strong>
              El proceso continúa fuera de la sala.
            </strong>

            <p>
              Materiales, repertorio, tareas y seguimiento
              también forman parte del aprendizaje.
            </p>
          </div>

          <RouterLink
            to="/aula"
            class="about__digital-link"
            aria-label="Ir al Aula Virtual"
          >
            →
          </RouterLink>
        </div>

        <!-- =========================
             CTA
        ========================== -->
        <div class="about__actions">
          <RouterLink
            to="/academia"
            class="about__button about__button--primary"
          >
            Conocer la Academia
            <span>→</span>
          </RouterLink>

          <RouterLink
            to="/formacion"
            class="about__button about__button--secondary"
          >
            Ver programa formativo
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import studentImage from '@/assets/images/alumno-1.png'

const miniAreas = [
  {
    number: '01',
    title: 'Técnica vocal',
    description: 'Respiración, apoyo, afinación y resonancia.'
  },
  {
    number: '02',
    title: 'Formación musical',
    description: 'Ritmo, oído, lectura y comprensión.'
  },
  {
    number: '03',
    title: 'Interpretación',
    description: 'Expresión, presencia y comunicación.'
  }
]

const journey = [
  {
    number: '01',
    label: 'DESCUBRIR',
    title: 'Conocer la propia voz',
    description:
      'Reconocer fortalezas, hábitos y aspectos que necesitan desarrollo.'
  },
  {
    number: '02',
    label: 'COMPRENDER',
    title: 'Aprender cómo funciona la música',
    description:
      'Ritmo, afinación, oído, intervalos y herramientas de lectura.'
  },
  {
    number: '03',
    label: 'APLICAR',
    title: 'Llevar las herramientas al repertorio',
    description:
      'La técnica comienza a utilizarse dentro de canciones y ensambles.'
  },
  {
    number: '04',
    label: 'COMPARTIR',
    title: 'Transformar aprendizaje en experiencia',
    description:
      'Ensayos, conciertos, musicales y presentaciones frente al público.'
  }
]
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.about {
  position: relative;
  overflow: hidden;
  padding: 105px 24px;
  color: #f5f5f5;
  background: #0b0b0b;
}

.about__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.011) 1px,
      transparent 1px
    ),
    linear-gradient(
      rgba(255, 255, 255, 0.011) 1px,
      transparent 1px
    );
  background-size: 72px 72px;
  mask-image:
    linear-gradient(
      to bottom,
      transparent,
      black 12%,
      black 88%,
      transparent
    );
}

.about__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(150px);
}

.about__glow--left {
  top: 18%;
  left: -320px;
  width: 600px;
  height: 600px;
  background:
    rgba(212, 175, 55, 0.035);
}

.about__glow--right {
  right: -360px;
  bottom: -260px;
  width: 650px;
  height: 650px;
  background:
    rgba(212, 175, 55, 0.025);
}

/* =========================================================
   LAYOUT
========================================================= */

.about__container {
  position: relative;
  z-index: 2;
  display: grid;
  width: min(1180px, 100%);
  gap: 68px;
  margin: 0 auto;
  align-items: center;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 0.9fr)
      minmax(0, 1.1fr);
  }
}

/* =========================================================
   VISUAL
========================================================= */

.about__visual {
  position: relative;
}

.about__image-frame {
  position: relative;
  overflow: hidden;
  min-height: 570px;
  margin: 0;
  border: 1px solid #292929;
  border-radius: 21px;
  background: #111;
  box-shadow:
    0 35px 80px
    rgba(0, 0, 0, 0.38);
}

.about__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter:
    saturate(0.84)
    contrast(1.03)
    brightness(0.92);
  transition:
    transform 0.7s ease;
}

.about__image-frame:hover .about__image {
  transform: scale(1.02);
}

.about__image-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.94),
      rgba(0, 0, 0, 0.02) 62%
    );
}

/* =========================================================
   STATUS
========================================================= */

.about__visual-status {
  position: absolute;
  top: 21px;
  left: 21px;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 7px 10px;
  border:
    1px solid
    rgba(212, 175, 55, 0.2);
  border-radius: 999px;
  color:
    variables.$color-primary;
  background:
    rgba(8, 8, 8, 0.72);
  font-size: 0.4rem;
  font-weight: 900;
  letter-spacing: 0.13em;
  backdrop-filter: blur(10px);
}

.about__visual-status > span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background:
    variables.$color-primary;
  box-shadow:
    0 0 11px
    rgba(212, 175, 55, 0.5);
}

/* =========================================================
   IMAGE CAPTION
========================================================= */

.about__image-caption {
  position: absolute;
  right: 24px;
  bottom: 26px;
  left: 24px;
}

.about__image-caption small {
  color:
    variables.$color-primary;
  font-size: 0.44rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.about__image-caption strong {
  display: block;
  max-width: 480px;
  margin-top: 8px;
  color: #f3f3f3;
  font-size:
    clamp(
      1.9rem,
      3.5vw,
      2.9rem
    );
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.about__image-caption strong em {
  display: block;
  color:
    variables.$color-primary;
  font-style: normal;
}

/* =========================================================
   FLOATING CARDS
========================================================= */

.about__floating {
  position: absolute;
  z-index: 4;
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 10px 12px;
  border:
    1px solid
    rgba(212, 175, 55, 0.2);
  border-radius: 11px;
  background:
    rgba(9, 9, 9, 0.9);
  backdrop-filter: blur(12px);
}

.about__floating > span {
  display: grid;
  width: 31px;
  height: 31px;
  place-items: center;
  border-radius: 50%;
  color: #080808;
  background:
    variables.$color-primary;
  font-size: 0.48rem;
  font-weight: 900;
}

.about__floating small,
.about__floating strong {
  display: block;
}

.about__floating small {
  color: #606060;
  font-size: 0.38rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.about__floating strong {
  margin-top: 2px;
  color: #ddd;
  font-size: 0.57rem;
}

.about__floating--top {
  top: 74px;
  right: -20px;
}

.about__floating--bottom {
  right: -18px;
  bottom: 105px;
}

/* =========================================================
   MINI AREAS
========================================================= */

.about__mini-grid {
  display: grid;
  gap: 8px;
  margin-top: 10px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.about__mini-grid article {
  display: flex;
  gap: 9px;
  min-height: 78px;
  padding: 12px;
  border: 1px solid #262626;
  border-radius: 10px;
  background: #101010;
}

.about__mini-grid article > span {
  color:
    variables.$color-primary;
  font-size: 0.42rem;
  font-weight: 900;
}

.about__mini-grid strong,
.about__mini-grid small {
  display: block;
}

.about__mini-grid strong {
  margin-bottom: 4px;
  color: #d8d8d8;
  font-size: 0.62rem;
}

.about__mini-grid small {
  color: #666;
  font-size: 0.51rem;
  line-height: 1.4;
}

/* =========================================================
   CONTENT
========================================================= */

.about__eyebrow {
  display: block;
  margin-bottom: 14px;
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.18em;
}

.about__content h2 {
  max-width: 680px;
  margin: 0;
  color: #f2f2f2;
  font-size:
    clamp(
      2.8rem,
      4.8vw,
      4.6rem
    );
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.06em;
}

.about__content h2 span {
  display: block;
  color:
    variables.$color-primary;
}

.about__lead {
  max-width: 650px;
  margin: 23px 0 0;
  color: #c2c2c2;
  font-size: 0.91rem;
  line-height: 1.7;
}

.about__description {
  max-width: 650px;
  margin: 13px 0 0;
  color: #777;
  font-size: 0.76rem;
  line-height: 1.72;
}

/* =========================================================
   JOURNEY
========================================================= */

.about__journey {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 8px;
  margin-top: 27px;
}

.about__journey-step {
  display: flex;
  gap: 12px;
  min-height: 118px;
  padding: 14px;
  border: 1px solid #272727;
  border-radius: 11px;
  background: #0d0d0d;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease;
}

.about__journey-step:hover {
  transform: translateY(-2px);
  border-color:
    rgba(212, 175, 55, 0.22);
  background: #10100f;
}

.about__journey-number {
  display: grid;
  width: 32px;
  height: 32px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.22);
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 0.44rem;
  font-weight: 900;
}

.about__journey-copy {
  min-width: 0;
}

.about__journey-step small {
  color:
    variables.$color-primary;
  font-size: 0.39rem;
  font-weight: 900;
  letter-spacing: 0.11em;
}

.about__journey-step h3 {
  margin: 4px 0;
  color: #e6e6e6;
  font-size: 0.72rem;
  line-height: 1.3;
}

.about__journey-step p {
  margin: 0;
  color: #686868;
  font-size: 0.55rem;
  line-height: 1.5;
}

/* =========================================================
   AULA VIRTUAL
========================================================= */

.about__digital {
  display: grid;
  grid-template-columns:
    auto
    1fr
    auto;
  gap: 13px;
  align-items: center;
  margin-top: 18px;
  padding: 15px;
  border:
    1px solid
    rgba(212, 175, 55, 0.19);
  border-radius: 12px;
  background:
    linear-gradient(
      120deg,
      rgba(212, 175, 55, 0.045),
      rgba(255, 255, 255, 0.008)
    );
}

.about__digital-icon {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  color: #080808;
  background:
    variables.$color-primary;
  font-size: 0.9rem;
}

.about__digital-copy small,
.about__digital-copy strong {
  display: block;
}

.about__digital-copy small {
  color:
    variables.$color-primary;
  font-size: 0.37rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.about__digital-copy strong {
  margin-top: 3px;
  color: #d9d9d9;
  font-size: 0.68rem;
}

.about__digital-copy p {
  margin: 4px 0 0;
  color: #6d6d6d;
  font-size: 0.54rem;
  line-height: 1.45;
}

.about__digital-link {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.24);
  border-radius: 50%;
  color:
    variables.$color-primary;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    background 0.2s ease;
}

.about__digital-link:hover {
  transform: translateX(3px);
  background:
    rgba(212, 175, 55, 0.06);
}

/* =========================================================
   BUTTONS
========================================================= */

.about__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 20px;
}

.about__button {
  display: inline-flex;
  min-height: 44px;
  gap: 9px;
  align-items: center;
  justify-content: center;
  padding: 0 17px;
  border-radius: 8px;
  font-size: 0.61rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.about__button:hover {
  transform: translateY(-2px);
}

.about__button--primary {
  border:
    1px solid
    variables.$color-primary;
  color: #080808;
  background:
    variables.$color-primary;
}

.about__button--primary:hover {
  box-shadow:
    0 14px 35px
    rgba(212, 175, 55, 0.13);
}

.about__button--secondary {
  border: 1px solid #333;
  color: #aaa;
  background: transparent;
}

.about__button--secondary:hover {
  color: #fff;
  border-color: #505050;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1050px) {
  .about {
    padding: 85px 22px;
  }

  .about__container {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .about__visual {
    width: min(720px, 100%);
    margin: 0 auto;
  }

  .about__image-frame {
    min-height: 620px;
  }
}

@media (max-width: 700px) {
  .about {
    padding: 72px 18px;
  }

  .about__container {
    gap: 42px;
  }

  .about__image-frame {
    min-height: 500px;
    border-radius: 17px;
  }

  .about__floating--top {
    top: 62px;
    right: 12px;
  }

  .about__floating--bottom {
    right: 12px;
    bottom: 100px;
  }

  .about__content h2 {
    font-size:
      clamp(
        2.55rem,
        11vw,
        3.8rem
      );
  }

  .about__lead {
    font-size: 0.87rem;
  }

  .about__journey {
    grid-template-columns: 1fr;
  }

  .about__journey-step {
    min-height: auto;
  }

  .about__digital {
    grid-template-columns:
      auto
      1fr;
  }

  .about__digital-link {
    grid-column: 1 / -1;
    width: 100%;
    border-radius: 8px;
  }

  .about__actions {
    flex-direction: column;
  }

  .about__button {
    width: 100%;
  }
}

@media (max-width: 500px) {
  .about__image-frame {
    min-height: 440px;
  }

  .about__image-caption strong {
    font-size: 1.85rem;
  }

  .about__floating {
    padding: 8px 9px;
  }

  .about__floating > span {
    width: 27px;
    height: 27px;
  }

  .about__mini-grid {
    grid-template-columns: 1fr;
  }

  .about__mini-grid article {
    min-height: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about__image,
  .about__journey-step,
  .about__button,
  .about__digital-link {
    transition: none;
  }
}
</style>
