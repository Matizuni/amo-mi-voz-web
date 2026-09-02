<template>
  <section
    id="formacion"
    class="workshops"
  >
    <div class="workshops__grid-bg" aria-hidden="true"></div>
    <div class="workshops__glow workshops__glow--left" aria-hidden="true"></div>
    <div class="workshops__glow workshops__glow--right" aria-hidden="true"></div>

    <div class="container workshops__layout">
      <!-- =========================
           VISUAL
      ========================== -->
      <div class="workshops__visual">
        <figure class="workshops__image-frame">
          <img
            :src="studentImage"
            alt="Estudiante de la Academia de Talentos Amo Mi Voz"
            class="workshops__image"
            loading="lazy"
          />

          <div class="workshops__image-overlay"></div>

          <div class="workshops__visual-status">
            <span></span>
            PROGRAMA FORMATIVO
          </div>

          <figcaption class="workshops__caption">
            <small>
              FORMACIÓN INTEGRAL
            </small>

            <strong>
              Herramientas para
              <em>entender y hacer música.</em>
            </strong>

            <p>
              Técnica, oído, interpretación y experiencia
              trabajan juntas dentro del proceso.
            </p>
          </figcaption>
        </figure>

        <div class="workshops__visual-summary">
          <article>
            <span>01</span>
            <div>
              <small>VOZ</small>
              <strong>Técnica y control</strong>
            </div>
          </article>

          <article>
            <span>02</span>
            <div>
              <small>MÚSICA</small>
              <strong>Oído y comprensión</strong>
            </div>
          </article>

          <article>
            <span>03</span>
            <div>
              <small>ESCENA</small>
              <strong>Interpretación real</strong>
            </div>
          </article>
        </div>
      </div>

      <!-- =========================
           CONTENIDO
      ========================== -->
      <div class="workshops__content">
        <p class="workshops__eyebrow">
          PROGRAMA FORMATIVO
        </p>

        <h2 class="workshops__title">
          Formación pensada para
          <span>desarrollar artistas.</span>
        </h2>

        <p class="workshops__intro">
          Nuestro programa conecta técnica vocal, teoría musical,
          entrenamiento auditivo, interpretación y trabajo escénico
          para que cada herramienta tenga una aplicación concreta.
        </p>

        <div class="workshops__stats">
          <article>
            <small>ENFOQUE</small>
            <strong>Integral</strong>
            <span>Voz + música + escena</span>
          </article>

          <article>
            <small>METODOLOGÍA</small>
            <strong>Aplicada</strong>
            <span>Comprender y utilizar</span>
          </article>

          <article>
            <small>OBJETIVO</small>
            <strong>Autonomía</strong>
            <span>Más herramientas para el estudiante</span>
          </article>
        </div>

        <div class="workshops__units-header">
          <div>
            <span>ÁREAS DE FORMACIÓN</span>
            <strong>
              Herramientas que se complementan entre sí.
            </strong>
          </div>

          <small>
            {{ trainingUnits.length }} UNIDADES
          </small>
        </div>

        <div class="workshops__grid">
          <WorkshopCard
            v-for="(unit, index) in trainingUnits"
            :key="unit.id"
            :title="unit.title"
            :description="unit.description"
            :icon="unit.icon"
            :style="{
              transitionDelay: `${index * 60}ms`
            }"
          />
        </div>

        <div class="workshops__closing">
          <div class="workshops__closing-icon">
            ♪
          </div>

          <div class="workshops__closing-copy">
            <small>
              FORMACIÓN EN CONTEXTO
            </small>

            <strong>
              Cada herramienta termina conectándose con repertorio y escenario.
            </strong>

            <p>
              Lo aprendido se utiliza en canciones, ensayos,
              conciertos, musicales y otras experiencias artísticas.
            </p>
          </div>

          <RouterLink
            to="/formacion"
            class="workshops__closing-link"
            aria-label="Ver programa formativo"
          >
            →
          </RouterLink>
        </div>

        <div class="workshops__actions">
          <RouterLink
            to="/formacion"
            class="workshops__button workshops__button--primary"
          >
            Explorar programa formativo
            <span>→</span>
          </RouterLink>

          <RouterLink
            to="/inscripcion"
            class="workshops__button workshops__button--secondary"
          >
            Quiero inscribirme
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import WorkshopCard from './WorkshopCard.vue'
import { trainingUnits } from '../../data/trainingUnits.js'
import studentImage from '@/assets/images/alumno-2.png'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.workshops {
  position: relative;
  overflow: hidden;
  padding: 105px 24px;
  color: #f5f5f5;
  background: #080808;
}

.workshops__grid-bg {
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

.workshops__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(150px);
}

.workshops__glow--left {
  top: 14%;
  left: -320px;
  width: 620px;
  height: 620px;
  background:
    rgba(212, 175, 55, 0.035);
}

.workshops__glow--right {
  right: -360px;
  bottom: -260px;
  width: 680px;
  height: 680px;
  background:
    rgba(212, 175, 55, 0.022);
}

/* =========================================================
   LAYOUT
========================================================= */

.workshops__layout {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 68px;
  align-items: start;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(330px, 0.86fr)
      minmax(0, 1.34fr);
  }
}

/* =========================================================
   VISUAL
========================================================= */

.workshops__visual {
  position: relative;

  @include mixins.respond-to(lg) {
    position: sticky;
    top: 105px;
  }
}

.workshops__image-frame {
  position: relative;
  overflow: hidden;
  min-height: 540px;
  margin: 0;
  border: 1px solid #292929;
  border-radius: 21px;
  background: #111;
  box-shadow:
    0 36px 88px
    rgba(0, 0, 0, 0.42);
}

.workshops__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  filter:
    saturate(0.84)
    contrast(1.03)
    brightness(0.9);
  transition:
    transform 0.7s ease;
}

.workshops__image-frame:hover .workshops__image {
  transform: scale(1.02);
}

.workshops__image-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(0, 0, 0, 0.95),
      rgba(0, 0, 0, 0.03) 60%
    );
}

/* =========================================================
   VISUAL STATUS
========================================================= */

.workshops__visual-status {
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

.workshops__visual-status > span {
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
   CAPTION
========================================================= */

.workshops__caption {
  position: absolute;
  right: 24px;
  bottom: 25px;
  left: 24px;
}

.workshops__caption small {
  color:
    variables.$color-primary;
  font-size: 0.43rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.workshops__caption strong {
  display: block;
  max-width: 470px;
  margin-top: 8px;
  color: #f2f2f2;
  font-size:
    clamp(
      1.9rem,
      3.5vw,
      2.9rem
    );
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.workshops__caption strong em {
  display: block;
  color:
    variables.$color-primary;
  font-style: normal;
}

.workshops__caption p {
  max-width: 380px;
  margin: 12px 0 0;
  color: #8c8c8c;
  font-size: 0.59rem;
  line-height: 1.55;
}

/* =========================================================
   VISUAL SUMMARY
========================================================= */

.workshops__visual-summary {
  display: grid;
  gap: 1px;
  overflow: hidden;
  margin-top: 10px;
  border: 1px solid #272727;
  border-radius: 11px;
  background: #272727;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.workshops__visual-summary article {
  display: flex;
  gap: 9px;
  padding: 12px;
  background: #0d0d0d;
}

.workshops__visual-summary article > span {
  color:
    variables.$color-primary;
  font-size: 0.42rem;
  font-weight: 900;
}

.workshops__visual-summary small,
.workshops__visual-summary strong {
  display: block;
}

.workshops__visual-summary small {
  color: #5c5c5c;
  font-size: 0.36rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.workshops__visual-summary strong {
  margin-top: 3px;
  color: #d0d0d0;
  font-size: 0.55rem;
}

/* =========================================================
   HEADER
========================================================= */

.workshops__eyebrow {
  margin: 0 0 14px;
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.workshops__title {
  max-width: 800px;
  margin: 0;
  color: #f2f2f2;
  font-size:
    clamp(
      2.8rem,
      4.8vw,
      4.6rem
    );
  line-height: 0.94;
  letter-spacing: -0.06em;
}

.workshops__title span {
  display: block;
  color:
    variables.$color-primary;
}

.workshops__intro {
  max-width: 680px;
  margin: 22px 0 0;
  color: #929292;
  font-size: 0.82rem;
  line-height: 1.72;
}

/* =========================================================
   STATS
========================================================= */

.workshops__stats {
  display: grid;
  gap: 1px;
  overflow: hidden;
  margin-top: 24px;
  margin-bottom: 24px;
  border: 1px solid #282828;
  border-radius: 11px;
  background: #282828;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.workshops__stats article {
  padding: 13px;
  background: #0d0d0d;
}

.workshops__stats small,
.workshops__stats strong,
.workshops__stats span {
  display: block;
}

.workshops__stats small {
  color: #565656;
  font-size: 0.38rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.workshops__stats strong {
  margin-top: 4px;
  color:
    variables.$color-primary;
  font-size: 0.68rem;
}

.workshops__stats span {
  margin-top: 3px;
  color: #656565;
  font-size: 0.5rem;
}

/* =========================================================
   UNITS HEADER
========================================================= */

.workshops__units-header {
  display: flex;
  gap: 20px;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 15px;
}

.workshops__units-header span,
.workshops__units-header strong {
  display: block;
}

.workshops__units-header span {
  color:
    variables.$color-primary;
  font-size: 0.4rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.workshops__units-header strong {
  margin-top: 4px;
  color: #c9c9c9;
  font-size: 0.69rem;
}

.workshops__units-header > small {
  color: #4d4d4d;
  font-size: 0.41rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

/* =========================================================
   UNITS GRID
========================================================= */

.workshops__grid {
  display: grid;
  gap: 10px;
  grid-template-columns: 1fr;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  @include mixins.respond-to(xl) {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

/* =========================================================
   CLOSING
========================================================= */

.workshops__closing {
  display: grid;
  grid-template-columns:
    auto
    1fr
    auto;
  gap: 14px;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
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

.workshops__closing-icon {
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

.workshops__closing-copy small,
.workshops__closing-copy strong {
  display: block;
}

.workshops__closing-copy small {
  color:
    variables.$color-primary;
  font-size: 0.37rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.workshops__closing-copy strong {
  margin-top: 3px;
  color: #d7d7d7;
  font-size: 0.68rem;
}

.workshops__closing-copy p {
  max-width: 650px;
  margin: 4px 0 0;
  color: #6c6c6c;
  font-size: 0.54rem;
  line-height: 1.48;
}

.workshops__closing-link {
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

.workshops__closing-link:hover {
  transform: translateX(3px);
  background:
    rgba(212, 175, 55, 0.06);
}

/* =========================================================
   ACTIONS
========================================================= */

.workshops__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 19px;
}

.workshops__button {
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

.workshops__button:hover {
  transform: translateY(-2px);
}

.workshops__button--primary {
  border:
    1px solid
    variables.$color-primary;
  color: #080808;
  background:
    variables.$color-primary;
}

.workshops__button--primary:hover {
  box-shadow:
    0 14px 35px
    rgba(212, 175, 55, 0.13);
}

.workshops__button--secondary {
  border: 1px solid #333;
  color: #aaa;
  background: transparent;
}

.workshops__button--secondary:hover {
  color: #fff;
  border-color: #505050;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1050px) {
  .workshops {
    padding: 85px 22px;
  }

  .workshops__layout {
    grid-template-columns: 1fr;
    gap: 50px;
  }

  .workshops__visual {
    position: relative;
    top: auto;
    width: min(720px, 100%);
    margin: 0 auto;
  }

  .workshops__image-frame {
    min-height: 610px;
  }
}

@media (max-width: 700px) {
  .workshops {
    padding: 72px 18px;
  }

  .workshops__image-frame {
    min-height: 500px;
    border-radius: 17px;
  }

  .workshops__title {
    font-size:
      clamp(
        2.55rem,
        11vw,
        3.8rem
      );
  }

  .workshops__intro {
    font-size: 0.78rem;
  }

  .workshops__closing {
    grid-template-columns:
      auto
      1fr;
  }

  .workshops__closing-link {
    grid-column: 1 / -1;
    width: 100%;
    border-radius: 8px;
  }

  .workshops__actions {
    flex-direction: column;
  }

  .workshops__button {
    width: 100%;
  }
}

@media (max-width: 500px) {
  .workshops__image-frame {
    min-height: 440px;
  }

  .workshops__caption strong {
    font-size: 1.85rem;
  }

  .workshops__units-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .workshops__visual-summary {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .workshops__image,
  .workshops__button,
  .workshops__closing-link {
    transition: none;
  }
}
</style>
