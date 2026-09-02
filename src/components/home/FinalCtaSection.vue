<template>
  <section class="final-cta">
    <div
      class="final-cta__glow"
      aria-hidden="true"
    ></div>

    <div
      class="final-cta__line"
      aria-hidden="true"
    ></div>

    <div class="final-cta__container">
      <div class="final-cta__content">
        <span class="final-cta__eyebrow">
          ACADEMIA DE TALENTOS AMO MI VOZ
        </span>

        <h2 class="final-cta__title">
          Tu voz tiene algo que decir.
          <span>Hazla crecer.</span>
        </h2>

        <p class="final-cta__description">
          Formación musical, experiencias escénicas y una comunidad
          donde cada estudiante puede desarrollar su propia voz.
        </p>

        <div class="final-cta__actions">
          <RouterLink
            to="/inscripcion"
            class="button button--primary"
          >
            <span>Quiero comenzar</span>

            <span
              class="button__arrow"
              aria-hidden="true"
            >
              →
            </span>
          </RouterLink>

          <RouterLink
            to="/academia"
            class="button button--secondary"
          >
            Conocer la academia
          </RouterLink>
        </div>

        <div class="final-cta__meta">
          <span>Formación musical</span>

          <span
            class="final-cta__dot"
            aria-hidden="true"
          ></span>

          <span>Experiencia escénica</span>

          <span
            class="final-cta__dot"
            aria-hidden="true"
          ></span>

          <span>La Calera</span>
        </div>
      </div>

      <div
        class="final-cta__mark"
        aria-hidden="true"
      >
        <div class="final-cta__orbit final-cta__orbit--outer"></div>
        <div class="final-cta__orbit final-cta__orbit--inner"></div>

        <div class="final-cta__brand">
          <span class="final-cta__brand-main">
            AMO
          </span>

          <span class="final-cta__brand-accent">
            MI VOZ
          </span>
        </div>

        <span class="final-cta__note final-cta__note--one">
          ♪
        </span>

        <span class="final-cta__note final-cta__note--two">
          ♫
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   SECTION
========================================================= */

.final-cta {
  position: relative;
  overflow: hidden;
  padding: clamp(5rem, 8vw, 7rem) 24px;
  background:
    radial-gradient(
      circle at 82% 50%,
      rgba(244, 196, 48, 0.08),
      transparent 28%
    ),
    radial-gradient(
      circle at 50% 120%,
      rgba(244, 196, 48, 0.08),
      transparent 35%
    ),
    #070707;
}

.final-cta__glow {
  position: absolute;
  right: -220px;
  bottom: -280px;
  width: 620px;
  height: 620px;
  border-radius: 50%;
  pointer-events: none;
  background:
    rgba(244, 196, 48, 0.05);
  filter: blur(120px);
}

.final-cta__line {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(1180px, 90%);
  height: 1px;
  transform: translateX(-50%);
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(244, 196, 48, 0.3),
      transparent
    );
}

/* =========================================================
   LAYOUT
========================================================= */

.final-cta__container {
  position: relative;
  z-index: 2;
  display: grid;
  width: min(1180px, 100%);
  gap: clamp(3rem, 7vw, 7rem);
  align-items: center;
  margin: 0 auto;
}

.final-cta__content {
  max-width: 720px;
}

/* =========================================================
   TYPOGRAPHY
========================================================= */

.final-cta__eyebrow {
  display: inline-block;
  margin-bottom: 18px;
  color: variables.$color-primary;
  font-size: 0.56rem;
  font-weight: 900;
  letter-spacing: 0.2em;
}

.final-cta__title {
  margin: 0;
  color: #f0f0f0;
  font-size:
    clamp(
      3rem,
      5.3vw,
      5rem
    );
  line-height: 0.94;
  letter-spacing: -0.06em;
}

.final-cta__title span {
  display: block;
  color: variables.$color-primary;
}

.final-cta__description {
  max-width: 590px;
  margin: 24px 0 30px;
  color: #8a8a8a;
  font-size: 0.9rem;
  line-height: 1.75;
}

/* =========================================================
   ACTIONS
========================================================= */

.final-cta__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  min-height: 46px;
  min-width: 175px;
  gap: 14px;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  border-radius: 9px;
  font-size: 0.67rem;
  font-weight: 900;
  letter-spacing: 0.02em;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button:focus-visible {
  outline:
    2px solid
    variables.$color-primary;
  outline-offset: 4px;
}

.button--primary {
  border:
    1px solid
    variables.$color-primary;
  color: #080808;
  background:
    variables.$color-primary;
}

.button--primary:hover {
  box-shadow:
    0 15px 36px
    rgba(244, 196, 48, 0.15);
}

.button--secondary {
  border: 1px solid #333;
  color: #aaa;
  background: #101010;
}

.button--secondary:hover {
  border-color:
    rgba(244, 196, 48, 0.45);
  color: variables.$color-primary;
}

.button__arrow {
  font-size: 1rem;
}

/* =========================================================
   META
========================================================= */

.final-cta__meta {
  display: flex;
  gap: 11px;
  align-items: center;
  margin-top: 32px;
  color: #505050;
  font-size: 0.54rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.final-cta__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background:
    variables.$color-primary;
}

/* =========================================================
   BRAND MARK
========================================================= */

.final-cta__mark {
  position: relative;
  display: grid;
  width:
    clamp(
      260px,
      27vw,
      370px
    );
  aspect-ratio: 1;
  place-items: center;
  justify-self: center;
}

.final-cta__orbit {
  position: absolute;
  border:
    1px solid
    rgba(244, 196, 48, 0.16);
  border-radius: 50%;
}

.final-cta__orbit--outer {
  inset: 0;
}

.final-cta__orbit--inner {
  inset: 16%;
  border-color:
    rgba(255, 255, 255, 0.07);
}

.final-cta__orbit--outer::before,
.final-cta__orbit--outer::after {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  content: '';
  background:
    variables.$color-primary;
  box-shadow:
    0 0 20px
    rgba(244, 196, 48, 0.4);
}

.final-cta__orbit--outer::before {
  top: 21%;
  left: 4%;
}

.final-cta__orbit--outer::after {
  right: 10%;
  bottom: 17%;
}

.final-cta__brand {
  position: relative;
  z-index: 2;
  text-align: center;
}

.final-cta__brand span {
  display: block;
}

.final-cta__brand-main {
  color: #f1f1f1;
  font-size:
    clamp(
      2.2rem,
      4vw,
      3.5rem
    );
  font-weight: 950;
  line-height: 0.9;
  letter-spacing: -0.055em;
}

.final-cta__brand-accent {
  margin-top: 3px;
  color: variables.$color-primary;
  font-size:
    clamp(
      1.7rem,
      3vw,
      2.6rem
    );
  font-weight: 950;
  line-height: 0.9;
  letter-spacing: -0.05em;
}

.final-cta__note {
  position: absolute;
  color:
    rgba(244, 196, 48, 0.34);
}

.final-cta__note--one {
  top: 12%;
  right: 20%;
  font-size: 1rem;
}

.final-cta__note--two {
  bottom: 14%;
  left: 19%;
  font-size: 0.8rem;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .final-cta__container {
    grid-template-columns:
      minmax(0, 1.25fr)
      minmax(280px, 0.75fr);
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (max-width: 899px) {
  .final-cta {
    padding: 80px 20px;
  }

  .final-cta__container {
    grid-template-columns: 1fr;
    gap: 55px;
  }

  .final-cta__mark {
    justify-self: start;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 600px) {
  .final-cta {
    padding: 70px 18px;
  }

  .final-cta__title {
    font-size:
      clamp(
        2.55rem,
        12vw,
        3.5rem
      );
  }

  .final-cta__description {
    font-size: 0.82rem;
  }

  .final-cta__actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }

  .final-cta__meta {
    gap: 7px;
    flex-wrap: wrap;
    line-height: 1.6;
  }

  .final-cta__mark {
    width:
      min(
        280px,
        82vw
      );
    justify-self: center;
  }
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .button {
    transition: none;
  }
}
</style>
