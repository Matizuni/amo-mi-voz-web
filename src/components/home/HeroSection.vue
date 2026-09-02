<template>
  <section class="hero">
    <div class="hero__background" aria-hidden="true">
      <img
        :src="heroImage"
        alt=""
      />
      <div class="hero__background-overlay"></div>
      <div class="hero__background-gradient"></div>
    </div>

    <div class="hero__grid" aria-hidden="true"></div>
    <div class="hero__glow hero__glow--top" aria-hidden="true"></div>
    <div class="hero__glow hero__glow--bottom" aria-hidden="true"></div>

    <div class="container hero__layout">
      <div class="hero__content">
        <div class="hero__eyebrow">
          <span class="hero__eyebrow-dot"></span>
          <p>ACADEMIA DE TALENTOS · AMO MI VOZ</p>
        </div>

        <div class="hero__logo-wrapper">
          <div class="hero__logo-glow"></div>

          <img
            class="hero__logo"
            :src="logo"
            alt="Academia de Talentos Amo Mi Voz"
          />
        </div>

        <div class="hero__claim">
          <span>FORMACIÓN VOCAL</span>
          <i></i>
          <span>MÚSICA</span>
          <i></i>
          <span>ESCENARIO</span>
        </div>

        <h1 class="hero__title">
          Descubre tu voz.
          <strong>Aprende a hacerla crecer.</strong>
        </h1>

        <p class="hero__description">
          Formación vocal, musical y escénica para estudiantes
          que quieren comprender su voz, desarrollar seguridad
          y transformar el aprendizaje en experiencia real.
        </p>

        <div class="hero__buttons">
          <RouterLink
            to="/inscripcion"
            class="hero__button hero__button--primary"
          >
            <span>Quiero inscribirme</span>
            <strong>→</strong>
          </RouterLink>

          <RouterLink
            to="/academia"
            class="hero__button hero__button--secondary"
          >
            Conocer la Academia
          </RouterLink>
        </div>

        <div class="hero__facts">
          <article>
            <span>01</span>

            <div>
              <small>FORMACIÓN</small>
              <strong>Vocal · Musical · Escénica</strong>
            </div>
          </article>

          <article>
            <span>02</span>

            <div>
              <small>EXPERIENCIA</small>
              <strong>Clases + escenario</strong>
            </div>
          </article>

          <article>
            <span>03</span>

            <div>
              <small>UBICACIÓN</small>
              <strong>La Calera · Chile</strong>
            </div>
          </article>
        </div>
      </div>

      <aside class="hero__panel">
        <div class="hero__panel-top">
          <div class="hero__panel-label">
            <span class="hero__panel-status"></span>
            <small>EXPERIENCIA AMO MI VOZ</small>
          </div>

          <span class="hero__panel-index">01</span>
        </div>

        <div class="hero__panel-main">
          <span class="hero__panel-kicker">
            APRENDER HACIENDO
          </span>

          <h2>
            Comprender.
            <strong>Practicar.</strong>
            Presentarse.
          </h2>

          <p>
            El aprendizaje musical cobra sentido cuando
            deja de ser solamente teoría y comienza a
            convertirse en experiencia.
          </p>
        </div>

        <div class="hero__panel-footer">
          <span>♪</span>

          <p>
            Técnica · Interpretación · Escenario
          </p>
        </div>
      </aside>
    </div>

    <a
      class="hero__scroll"
      href="#inicio-academia"
      aria-label="Continuar hacia la Academia"
    >
      <span>DESCUBRIR</span>
      <i></i>
    </a>
  </section>

  <div
    id="inicio-academia"
    class="hero-anchor"
  ></div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import gsap from 'gsap'

import logo from '@/assets/images/logo.png'
import heroImage from '@/assets/images/galery-5.png'

let context

onMounted(() => {
  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches

  if (reduceMotion) {
    return
  }

  context = gsap.context(() => {
    const timeline = gsap.timeline({
      defaults: {
        ease: 'power3.out'
      }
    })

    timeline
      .from('.hero__eyebrow', {
        y: 18,
        opacity: 0,
        duration: 0.45
      })
      .from(
        '.hero__logo-wrapper',
        {
          y: 24,
          opacity: 0,
          scale: 0.97,
          duration: 0.75
        },
        '-=0.2'
      )
      .from(
        '.hero__claim',
        {
          y: 15,
          opacity: 0,
          duration: 0.4
        },
        '-=0.4'
      )
      .from(
        '.hero__title',
        {
          y: 24,
          opacity: 0,
          duration: 0.65
        },
        '-=0.3'
      )
      .from(
        '.hero__description',
        {
          y: 18,
          opacity: 0,
          duration: 0.5
        },
        '-=0.35'
      )
      .from(
        '.hero__buttons',
        {
          y: 16,
          opacity: 0,
          duration: 0.45
        },
        '-=0.3'
      )
      .from(
        '.hero__facts',
        {
          y: 14,
          opacity: 0,
          duration: 0.45
        },
        '-=0.25'
      )
      .from(
        '.hero__panel',
        {
          x: 32,
          opacity: 0,
          duration: 0.7
        },
        '-=0.6'
      )

    gsap.to('.hero__panel-status', {
      opacity: 0.35,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.inOut'
    })
  })
})

onUnmounted(() => {
  context?.revert()
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   HERO
========================================================= */

.hero {
  position: relative;
  display: flex;
  min-height: 92vh;
  align-items: center;
  overflow: hidden;
  padding: 118px 24px 66px;
  color: #f5f5f5;
  background: #070707;
}

/* =========================================================
   BACKGROUND
========================================================= */

.hero__background {
  position: absolute;
  inset: 0;
}

.hero__background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: 58% center;
  filter:
    saturate(0.74)
    contrast(1.05)
    brightness(0.78);
  transform: scale(1.015);
}

.hero__background-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(5, 5, 5, 0.98) 0%,
      rgba(5, 5, 5, 0.93) 34%,
      rgba(5, 5, 5, 0.72) 58%,
      rgba(5, 5, 5, 0.42) 100%
    );
}

.hero__background-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to bottom,
      rgba(7, 7, 7, 0.1) 55%,
      #070707 100%
    );
}

/* =========================================================
   DECORATION
========================================================= */

.hero__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
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
  background-size: 72px 72px;
  mask-image:
    radial-gradient(
      circle at 45% 42%,
      black,
      transparent 82%
    );
}

.hero__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(150px);
}

.hero__glow--top {
  top: -220px;
  right: -160px;
  width: 650px;
  height: 650px;
  background:
    rgba(212, 175, 55, 0.075);
}

.hero__glow--bottom {
  bottom: -330px;
  left: -240px;
  width: 620px;
  height: 620px;
  background:
    rgba(212, 175, 55, 0.025);
}

/* =========================================================
   LAYOUT
========================================================= */

.hero__layout {
  position: relative;
  z-index: 5;
  display: grid;
  width: min(1180px, 100%);
  gap: 60px;
  align-items: center;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 1.28fr)
      minmax(310px, 0.72fr);
  }
}

.hero__content {
  max-width: 740px;
}

/* =========================================================
   EYEBROW
========================================================= */

.hero__eyebrow {
  display: flex;
  gap: 10px;
  align-items: center;
}

.hero__eyebrow p {
  margin: 0;
  color: variables.$color-primary;
  font-size: 0.54rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.hero__eyebrow-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background:
    variables.$color-primary;
  box-shadow:
    0 0 13px
    rgba(212, 175, 55, 0.65);
}

/* =========================================================
   LOGO
========================================================= */

.hero__logo-wrapper {
  position: relative;
  width: fit-content;
  margin-top: 20px;
}

.hero__logo-glow {
  position: absolute;
  top: 50%;
  left: 45%;
  width: 330px;
  height: 130px;
  border-radius: 50%;
  background:
    rgba(212, 175, 55, 0.055);
  transform:
    translate(-50%, -50%);
  filter: blur(65px);
}

.hero__logo {
  position: relative;
  z-index: 2;
  display: block;
  width: min(430px, 72vw);
  height: auto;
  object-fit: contain;
  filter:
    drop-shadow(
      0 18px 35px
      rgba(0, 0, 0, 0.38)
    );
}

/* =========================================================
   CLAIM
========================================================= */

.hero__claim {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 14px;
}

.hero__claim span {
  color: variables.$color-primary;
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.hero__claim i {
  width: 20px;
  height: 1px;
  background:
    rgba(212, 175, 55, 0.32);
}

/* =========================================================
   TITLE
========================================================= */

.hero__title {
  max-width: 730px;
  margin: 17px 0 0;
  color: #f4f4f4;
  font-size:
    clamp(
      2.7rem,
      5.2vw,
      4.65rem
    );
  font-weight: 800;
  line-height: 0.96;
  letter-spacing: -0.055em;
}

.hero__title strong {
  display: block;
  margin-top: 3px;
  color:
    variables.$color-primary;
  font-weight: 800;
}

/* =========================================================
   DESCRIPTION
========================================================= */

.hero__description {
  max-width: 590px;
  margin: 19px 0 0;
  color: #9a9a9a;
  font-size: 0.84rem;
  line-height: 1.72;
}

/* =========================================================
   BUTTONS
========================================================= */

.hero__buttons {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 23px;
}

.hero__button {
  display: inline-flex;
  min-height: 47px;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 9px;
  font-size: 0.65rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.hero__button:hover {
  transform:
    translateY(-2px);
}

.hero__button--primary {
  border:
    1px solid
    variables.$color-primary;
  color: #070707;
  background:
    variables.$color-primary;
  box-shadow:
    0 12px 32px
    rgba(212, 175, 55, 0.09);
}

.hero__button--primary:hover {
  box-shadow:
    0 17px 42px
    rgba(212, 175, 55, 0.16);
}

.hero__button--secondary {
  border:
    1px solid
    rgba(255, 255, 255, 0.14);
  color: #d0d0d0;
  background:
    rgba(7, 7, 7, 0.42);
  backdrop-filter:
    blur(10px);
}

.hero__button--secondary:hover {
  color:
    variables.$color-primary;
  border-color:
    rgba(212, 175, 55, 0.38);
}

/* =========================================================
   FACTS
========================================================= */

.hero__facts {
  display: grid;
  gap: 1px;
  overflow: hidden;
  max-width: 650px;
  margin-top: 25px;
  border:
    1px solid
    rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  background:
    rgba(255, 255, 255, 0.07);

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.hero__facts article {
  display: flex;
  gap: 9px;
  padding: 12px 13px;
  background:
    rgba(7, 7, 7, 0.75);
  backdrop-filter:
    blur(9px);
}

.hero__facts article > span {
  color:
    variables.$color-primary;
  font-size: 0.42rem;
  font-weight: 900;
}

.hero__facts small,
.hero__facts strong {
  display: block;
}

.hero__facts small {
  color: #565656;
  font-size: 0.37rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.hero__facts strong {
  margin-top: 3px;
  color: #b9b9b9;
  font-size: 0.54rem;
}

/* =========================================================
   PANEL
========================================================= */

.hero__panel {
  position: relative;
  display: flex;
  min-height: 365px;
  flex-direction: column;
  padding: 24px;
  border:
    1px solid
    rgba(212, 175, 55, 0.2);
  border-radius: 19px;
  background:
    linear-gradient(
      145deg,
      rgba(212, 175, 55, 0.05),
      rgba(255, 255, 255, 0.009)
    ),
    rgba(8, 8, 8, 0.75);
  box-shadow:
    0 35px 80px
    rgba(0, 0, 0, 0.36);
  backdrop-filter:
    blur(18px);
}

.hero__panel-top {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
}

.hero__panel-label {
  display: flex;
  gap: 8px;
  align-items: center;
}

.hero__panel-status {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background:
    variables.$color-primary;
  box-shadow:
    0 0 14px
    rgba(212, 175, 55, 0.55);
}

.hero__panel-label small {
  color: #626262;
  font-size: 0.41rem;
  font-weight: 900;
  letter-spacing: 0.13em;
}

.hero__panel-index {
  color:
    rgba(212, 175, 55, 0.34);
  font-size: 0.5rem;
  font-weight: 900;
}

.hero__panel-main {
  margin: auto 0;
}

.hero__panel-kicker {
  color:
    variables.$color-primary;
  font-size: 0.44rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.hero__panel-main h2 {
  max-width: 390px;
  margin: 9px 0 0;
  color: #ececec;
  font-size:
    clamp(
      2rem,
      3.6vw,
      3rem
    );
  line-height: 0.95;
  letter-spacing: -0.05em;
}

.hero__panel-main h2 strong {
  display: block;
  color:
    variables.$color-primary;
  font-weight: inherit;
}

.hero__panel-main p {
  max-width: 360px;
  margin: 15px 0 0;
  color: #747474;
  font-size: 0.63rem;
  line-height: 1.62;
}

.hero__panel-footer {
  display: flex;
  gap: 9px;
  align-items: center;
  padding-top: 15px;
  border-top:
    1px solid
    rgba(255, 255, 255, 0.065);
}

.hero__panel-footer > span {
  color:
    variables.$color-primary;
}

.hero__panel-footer p {
  margin: 0;
  color: #575757;
  font-size: 0.49rem;
}

/* =========================================================
   SCROLL
========================================================= */

.hero__scroll {
  position: absolute;
  z-index: 6;
  right: 26px;
  bottom: 24px;
  display: flex;
  gap: 9px;
  align-items: center;
  color: #535353;
  text-decoration: none;
  transform:
    rotate(90deg);
  transform-origin:
    right center;
}

.hero__scroll span {
  font-size: 0.39rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.hero__scroll i {
  width: 31px;
  height: 1px;
  background:
    variables.$color-primary;
}

.hero-anchor {
  position: relative;
  top: -86px;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .hero {
    min-height: auto;
    padding:
      120px
      20px
      72px;
  }

  .hero__layout {
    gap: 45px;
  }

  .hero__panel {
    min-height: 330px;
  }

  .hero__background-overlay {
    background:
      linear-gradient(
        to right,
        rgba(4, 4, 4, 0.96),
        rgba(4, 4, 4, 0.7)
      );
  }
}

@media (max-width: 900px) {
  .hero__layout {
    grid-template-columns: 1fr;
  }

  .hero__panel {
    max-width: 620px;
  }

  .hero__scroll {
    display: none;
  }
}

@media (max-width: 700px) {
  .hero {
    padding:
      108px
      17px
      60px;
  }

  .hero__logo {
    width:
      min(
        360px,
        88vw
      );
  }

  .hero__title {
    font-size:
      clamp(
        2.55rem,
        11vw,
        3.8rem
      );
  }

  .hero__description {
    font-size: 0.8rem;
  }

  .hero__buttons {
    flex-direction: column;
  }

  .hero__button {
    width: 100%;
  }

  .hero__facts {
    grid-template-columns: 1fr;
  }

  .hero__panel {
    min-height: 315px;
    padding: 21px;
  }

  .hero__background img {
    object-position: 64% center;
  }

  .hero__background-overlay {
    background:
      linear-gradient(
        to bottom,
        rgba(4, 4, 4, 0.77),
        rgba(4, 4, 4, 0.97) 67%
      );
  }
}

@media (max-width: 500px) {
  .hero__claim {
    gap: 7px;
  }

  .hero__claim i {
    width: 13px;
  }

  .hero__panel-main h2 {
    font-size: 2.15rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero *,
  .hero *::before,
  .hero *::after {
    scroll-behavior: auto !important;
    animation: none !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
