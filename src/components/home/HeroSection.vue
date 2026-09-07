<template>
  <section class="hero">
    <!-- =====================================================
         IMAGEN / ATMÓSFERA
    ====================================================== -->
    <div
      class="hero__background"
      aria-hidden="true"
    >
      <img
        :src="heroImage"
        alt=""
      />

      <div class="hero__veil"></div>
      <div class="hero__texture"></div>
    </div>

    <!-- =====================================================
         CONTENIDO
    ====================================================== -->
    <div class="container hero__layout">
      <div class="hero__content">
        <div class="hero__eyebrow">
          <span></span>
          <p>
            ACADEMIA DE TALENTOS · LA CALERA
          </p>
        </div>

        <img
          class="hero__logo"
          :src="logo"
          alt="Academia de Talentos Amo Mi Voz"
        />

        <div class="hero__claim">
          <span>FORMACIÓN VOCAL</span>
          <i></i>
          <span>MÚSICA</span>
          <i></i>
          <span>ESCENARIO</span>
        </div>

        <h1 class="hero__title">
          No enseñamos solo a cantar.
          <strong>Construimos artistas.</strong>
        </h1>

        <p class="hero__description">
          Formación vocal, musical y escénica para personas que
          quieren comprender su voz, ganar seguridad y vivir
          experiencias reales sobre el escenario.
        </p>

        <div class="hero__actions">
          <RouterLink
            to="/inscripcion"
            class="hero__button hero__button--primary"
          >
            Quiero comenzar
            <span>→</span>
          </RouterLink>

          <RouterLink
            to="/formacion"
            class="hero__button hero__button--secondary"
          >
            Conocer formación
          </RouterLink>

          <RouterLink
            to="/aula"
            class="hero__button hero__button--ghost"
          >
            Aula Virtual
          </RouterLink>
        </div>

        <div class="hero__trust">
          <span>
            <b>01</b>
            Técnica vocal
          </span>

          <span>
            <b>02</b>
            Teoría musical
          </span>

          <span>
            <b>03</b>
            Experiencia escénica
          </span>
        </div>
      </div>

      <!-- ===================================================
           PANEL EDITORIAL
      ==================================================== -->
      <aside class="hero__spotlight">
        <header class="hero__spotlight-header">
          <div>
            <span class="hero__live-dot"></span>
            <small>EXPERIENCIA AMO MI VOZ</small>
          </div>

          <strong>2026</strong>
        </header>

        <div class="hero__spotlight-main">
          <span class="hero__spotlight-kicker">
            APRENDER HACIENDO
          </span>

          <h2>
            Comprender.
            <strong>Practicar.</strong>
            Presentarse.
          </h2>

          <p>
            La formación cobra sentido cuando el conocimiento
            sale de la sala de clases y se transforma en una
            experiencia real.
          </p>
        </div>

        <footer class="hero__spotlight-footer">
          <div>
            <span>♪</span>

            <p>
              Técnica · Interpretación · Escenario
            </p>
          </div>

          <RouterLink to="/academia">
            Nuestra metodología
            <span>→</span>
          </RouterLink>
        </footer>
      </aside>
    </div>

    <!-- =====================================================
         SCROLL
    ====================================================== -->
    <button
      type="button"
      class="hero__scroll"
      aria-label="Continuar hacia el contenido"
      @click="scrollToContent"
    >
      <span>DESCUBRIR</span>
      <i></i>
    </button>
  </section>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
} from 'vue'

import {
  RouterLink,
} from 'vue-router'

import gsap from 'gsap'

import logo from '@/assets/images/logo.png'
import heroImage from '@/assets/images/galery-5.png'

let context

const scrollToContent = () => {
  const target =
    document.querySelector(
      '.home-proof',
    )

  target?.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  })
}

onMounted(() => {
  const reduceMotion =
    window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

  if (reduceMotion) {
    return
  }

  context =
    gsap.context(() => {
      const timeline =
        gsap.timeline({
          defaults: {
            ease: 'power3.out',
          },
        })

      timeline
        .from(
          '.hero__eyebrow',
          {
            y: 15,
            opacity: 0,
            duration: 0.45,
          },
        )
        .from(
          '.hero__logo',
          {
            y: 20,
            opacity: 0,
            duration: 0.58,
          },
          '-=0.25',
        )
        .from(
          '.hero__claim',
          {
            y: 14,
            opacity: 0,
            duration: 0.4,
          },
          '-=0.3',
        )
        .from(
          '.hero__title',
          {
            y: 22,
            opacity: 0,
            duration: 0.65,
          },
          '-=0.28',
        )
        .from(
          '.hero__description',
          {
            y: 16,
            opacity: 0,
            duration: 0.45,
          },
          '-=0.32',
        )
        .from(
          '.hero__actions',
          {
            y: 14,
            opacity: 0,
            duration: 0.4,
          },
          '-=0.28',
        )
        .from(
          '.hero__trust',
          {
            y: 12,
            opacity: 0,
            duration: 0.4,
          },
          '-=0.24',
        )
        .from(
          '.hero__spotlight',
          {
            x: 28,
            opacity: 0,
            duration: 0.65,
          },
          '-=0.5',
        )

      gsap.to(
        '.hero__live-dot',
        {
          opacity: 0.3,
          repeat: -1,
          yoyo: true,
          duration: 1.4,
          ease: 'sine.inOut',
        },
      )
    })
})

onUnmounted(() => {
  context?.revert()
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.hero {
  --hero-navy: #101a2d;
  --hero-wine: #9f1945;
  --hero-wine-dark: #72112f;
  --hero-gold: #d5a720;

  position: relative;
  display: flex;
  min-height: 94vh;
  align-items: center;
  overflow: hidden;
  padding:
    126px
    24px
    94px;
  color: #fff;
  background: var(--hero-navy);
}

/* =========================================================
   FONDO
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
    saturate(0.88)
    contrast(1.04)
    brightness(0.9);
  transform: scale(1.015);
}

.hero__veil {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      90deg,
      rgba(10, 17, 30, 0.98) 0%,
      rgba(10, 17, 30, 0.93) 34%,
      rgba(10, 17, 30, 0.68) 62%,
      rgba(10, 17, 30, 0.38) 100%
    ),
    linear-gradient(
      180deg,
      rgba(8, 15, 27, 0.08) 55%,
      rgba(8, 15, 27, 0.72) 100%
    );
}

.hero__texture {
  position: absolute;
  inset: 0;
  opacity: 0.32;
  pointer-events: none;
  background:
    linear-gradient(
      90deg,
      rgba(255,255,255,.018) 1px,
      transparent 1px
    ),
    linear-gradient(
      rgba(255,255,255,.018) 1px,
      transparent 1px
    );
  background-size: 68px 68px;
  mask-image:
    radial-gradient(
      circle at 42% 42%,
      #000,
      transparent 78%
    );
}

/* =========================================================
   LAYOUT
========================================================= */

.hero__layout {
  position: relative;
  z-index: 3;
  display: grid;
  width: min(1180px, 100%);
  margin: 0 auto;
  gap: 58px;
  align-items: center;
}

@media (min-width: 980px) {
  .hero__layout {
    grid-template-columns:
      minmax(0, 1.3fr)
      minmax(300px, .7fr);
  }
}

.hero__content {
  max-width: 760px;
}

/* =========================================================
   EYEBROW / LOGO
========================================================= */

.hero__eyebrow {
  display: flex;
  gap: 10px;
  align-items: center;
}

.hero__eyebrow > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #40cf8f;
  box-shadow:
    0 0 0 5px
    rgba(64, 207, 143, 0.1);
}

.hero__eyebrow p {
  margin: 0;
  color: rgba(255,255,255,.7);
  font-size: .57rem;
  font-weight: 900;
  letter-spacing: .17em;
}

.hero__logo {
  display: block;
  width: min(390px, 72vw);
  margin-top: 22px;
  filter:
    drop-shadow(
      0 16px 32px
      rgba(0,0,0,.28)
    );
}

/* =========================================================
   CLAIM / TITLE
========================================================= */

.hero__claim {
  display: flex;
  gap: 9px;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 17px;
}

.hero__claim span {
  color: #e3b52f;
  font-size: .5rem;
  font-weight: 900;
  letter-spacing: .13em;
}

.hero__claim i {
  width: 18px;
  height: 1px;
  background:
    rgba(227,181,47,.36);
}

.hero__title {
  max-width: 760px;
  margin: 18px 0 0;
  color: #fff;
  font-size:
    clamp(
      3rem,
      5.7vw,
      5.35rem
    );
  font-weight: 850;
  line-height: .94;
  letter-spacing: -.06em;
}

.hero__title strong {
  display: block;
  margin-top: 6px;
  color: #fff;
  font-weight: inherit;
}

.hero__description {
  max-width: 610px;
  margin: 22px 0 0;
  color: rgba(255,255,255,.72);
  font-size: .93rem;
  line-height: 1.72;
}

/* =========================================================
   ACTIONS
========================================================= */

.hero__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.hero__button {
  display: inline-flex;
  min-height: 48px;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 10px;
  font-size: .68rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform .18s ease,
    border-color .18s ease,
    background .18s ease,
    color .18s ease;
}

.hero__button:hover {
  transform: translateY(-2px);
}

.hero__button--primary {
  border: 1px solid var(--hero-wine);
  color: #fff;
  background:
    linear-gradient(
      135deg,
      var(--hero-wine),
      var(--hero-wine-dark)
    );
  box-shadow:
    0 14px 34px
    rgba(159,25,69,.18);
}

.hero__button--secondary {
  border: 1px solid rgba(255,255,255,.16);
  color: #f3f5f8;
  background: rgba(255,255,255,.08);
  backdrop-filter: blur(10px);
}

.hero__button--ghost {
  border: 1px solid rgba(213,167,32,.33);
  color: #e9c756;
  background: rgba(10,17,30,.38);
}

/* =========================================================
   TRUST
========================================================= */

.hero__trust {
  display: flex;
  gap: 8px 18px;
  flex-wrap: wrap;
  margin-top: 24px;
  padding-top: 18px;
  border-top:
    1px solid
    rgba(255,255,255,.1);
}

.hero__trust span {
  color: rgba(255,255,255,.66);
  font-size: .59rem;
  font-weight: 750;
}

.hero__trust b {
  margin-right: 5px;
  color: #e0b63a;
  font-size: .5rem;
}

/* =========================================================
   SPOTLIGHT
========================================================= */

.hero__spotlight {
  display: flex;
  min-height: 390px;
  flex-direction: column;
  padding: 25px;
  border:
    1px solid
    rgba(255,255,255,.13);
  border-radius: 20px;
  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.11),
      rgba(255,255,255,.035)
    );
  box-shadow:
    0 30px 70px
    rgba(0,0,0,.28);
  backdrop-filter: blur(18px);
}

.hero__spotlight-header,
.hero__spotlight-footer,
.hero__spotlight-header > div,
.hero__spotlight-footer > div {
  display: flex;
  align-items: center;
}

.hero__spotlight-header {
  justify-content: space-between;
  gap: 16px;
}

.hero__spotlight-header > div {
  gap: 8px;
}

.hero__live-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #42d391;
  box-shadow:
    0 0 0 5px
    rgba(66,211,145,.1);
}

.hero__spotlight-header small {
  color: rgba(255,255,255,.56);
  font-size: .47rem;
  font-weight: 900;
  letter-spacing: .13em;
}

.hero__spotlight-header > strong {
  color: rgba(213,167,32,.48);
  font-size: .55rem;
}

.hero__spotlight-main {
  margin: auto 0;
}

.hero__spotlight-kicker {
  color: #e2b62f;
  font-size: .46rem;
  font-weight: 900;
  letter-spacing: .15em;
}

.hero__spotlight-main h2 {
  max-width: 390px;
  margin: 10px 0 0;
  color: #fff;
  font-size:
    clamp(
      2.15rem,
      3.6vw,
      3.25rem
    );
  line-height: .94;
  letter-spacing: -.05em;
}

.hero__spotlight-main h2 strong {
  display: block;
  color: #f0c84c;
}

.hero__spotlight-main p {
  max-width: 360px;
  margin: 16px 0 0;
  color: rgba(255,255,255,.58);
  font-size: .68rem;
  line-height: 1.68;
}

.hero__spotlight-footer {
  justify-content: space-between;
  gap: 12px;
  padding-top: 16px;
  border-top:
    1px solid
    rgba(255,255,255,.09);
}

.hero__spotlight-footer > div {
  gap: 8px;
}

.hero__spotlight-footer > div > span {
  color: #e1b437;
}

.hero__spotlight-footer p {
  margin: 0;
  color: rgba(255,255,255,.45);
  font-size: .52rem;
}

.hero__spotlight-footer > a {
  color: #fff;
  font-size: .54rem;
  font-weight: 800;
  text-decoration: none;
}

/* =========================================================
   SCROLL
========================================================= */

.hero__scroll {
  position: absolute;
  z-index: 4;
  right: 24px;
  bottom: 28px;
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 0;
  border: 0;
  color: rgba(255,255,255,.42);
  background: transparent;
  cursor: pointer;
  transform: rotate(90deg);
  transform-origin: right center;
}

.hero__scroll span {
  font-size: .4rem;
  font-weight: 900;
  letter-spacing: .15em;
}

.hero__scroll i {
  width: 32px;
  height: 1px;
  background: #d5a720;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 980px) {
  .hero {
    min-height: auto;
    padding:
      116px
      20px
      76px;
  }

  .hero__layout {
    grid-template-columns: 1fr;
  }

  .hero__spotlight {
    max-width: 620px;
    min-height: 320px;
  }

  .hero__scroll {
    display: none;
  }
}

@media (max-width: 700px) {
  .hero {
    padding:
      104px
      16px
      62px;
  }

  .hero__background img {
    object-position: 68% center;
  }

  .hero__veil {
    background:
      linear-gradient(
        180deg,
        rgba(9,16,28,.64) 0%,
        rgba(9,16,28,.90) 58%,
        rgba(9,16,28,.98) 100%
      );
  }

  .hero__logo {
    width:
      min(
        330px,
        88vw
      );
  }

  .hero__title {
    font-size:
      clamp(
        2.7rem,
        12vw,
        4rem
      );
  }

  .hero__description {
    font-size: .88rem;
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__button {
    width: 100%;
    min-height: 50px;
  }

  .hero__trust {
    display: grid;
    grid-template-columns: 1fr;
  }

  .hero__spotlight {
    min-height: 300px;
    padding: 21px;
  }
}

@media (max-width: 480px) {
  .hero__claim i {
    width: 12px;
  }

  .hero__spotlight-main h2 {
    font-size: 2.2rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero *,
  .hero *::before,
  .hero *::after {
    scroll-behavior: auto !important;
    animation: none !important;
    transition-duration: .01ms !important;
  }
}
</style>
