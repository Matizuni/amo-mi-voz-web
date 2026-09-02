<template>
  <section
    class="quote reveal fade-up"
    v-reveal
  >
    <!-- Fondo -->
    <div class="quote__grid"></div>
    <div class="quote__glow quote__glow--left"></div>
    <div class="quote__glow quote__glow--right"></div>

    <div class="container quote__container">

      <!-- ================================================
           CABECERA
      ================================================= -->
      <header class="quote__top">
        <div class="quote__heading">
          <span class="quote__eyebrow">
            NUESTRA FORMA DE ENTENDER LA MÚSICA
          </span>

          <span class="quote__line"></span>
        </div>

        <span class="quote__index">
          AMV · IDENTIDAD
        </span>
      </header>

      <!-- ================================================
           FRASE + IDENTIDAD
      ================================================= -->
      <div class="quote__hero">

        <!-- FRASE -->
        <div class="quote__content">
          <span
            class="quote__symbol"
            aria-hidden="true"
          >
            “
          </span>

          <blockquote class="quote__text">
            Cada voz tiene
            <span>una historia.</span>

            Nuestro trabajo es
            ayudarla a ser

            <strong>escuchada.</strong>
          </blockquote>

          <div class="quote__author">
            <span class="quote__author-line"></span>

            <div class="quote__author-copy">
              <strong>Matías Zúñiga</strong>

              <span>
                Director musical
              </span>

              <small>
                Academia de Talentos Amo Mi Voz
              </small>
            </div>
          </div>
        </div>

        <!-- IDENTIDAD AMV -->
        <div
          class="quote__identity"
          aria-hidden="true"
        >
          <div class="quote__orbit quote__orbit--outer"></div>
          <div class="quote__orbit quote__orbit--middle"></div>
          <div class="quote__orbit quote__orbit--inner"></div>

          <span class="quote__orbit-dot quote__orbit-dot--one"></span>
          <span class="quote__orbit-dot quote__orbit-dot--two"></span>

          <span class="quote__note quote__note--one">
            ♪
          </span>

          <span class="quote__note quote__note--two">
            ♫
          </span>

          <div class="quote__brand">
            <span class="quote__brand-small">
              ACADEMIA DE TALENTOS
            </span>

            <div class="quote__brand-name">
              <strong>AMO</strong>
              <strong>MI</strong>
              <strong>VOZ</strong>
            </div>

            <span class="quote__brand-footer">
              MÚSICA · FORMACIÓN · ESCENA
            </span>
          </div>
        </div>
      </div>

      <!-- ================================================
           PROPÓSITO
      ================================================= -->
      <div class="quote__purpose">
        <div class="quote__purpose-label">
          <span>01</span>

          <div>
            <small>NUESTRO PROPÓSITO</small>
            <strong>Formar para expresarse.</strong>
          </div>
        </div>

        <p>
          Crear un espacio donde cada estudiante pueda
          <strong>
            descubrir, comprender y desarrollar su voz
          </strong>
          mientras construye herramientas musicales para
          expresarse con mayor seguridad dentro y fuera
          del escenario.
        </p>
      </div>

      <!-- ================================================
           PILARES
      ================================================= -->
      <div class="quote__pillars">
        <article
          v-for="pillar in pillars"
          :key="pillar.number"
          class="quote__pillar"
        >
          <div class="quote__pillar-top">
            <span class="quote__pillar-number">
              {{ pillar.number }}
            </span>

            <span class="quote__pillar-rule"></span>
          </div>

          <small>
            {{ pillar.label }}
          </small>

          <strong>
            {{ pillar.title }}
          </strong>

          <p>
            {{ pillar.description }}
          </p>
        </article>
      </div>

      <!-- ================================================
           CTA FINAL
      ================================================= -->
      <div class="quote__cta">

        <div class="quote__cta-icon" aria-hidden="true">
          ♪
        </div>

        <div class="quote__cta-copy">
          <span class="quote__eyebrow">
            TU PROCESO PUEDE COMENZAR AQUÍ
          </span>

          <h2>
            ¿Quieres descubrir hasta dónde
            <span>puede llegar tu voz?</span>
          </h2>

          <p>
            Conoce nuestra propuesta formativa y comienza
            tu proceso en la Academia de Talentos Amo Mi Voz.
          </p>
        </div>

        <div class="quote__actions">
          <RouterLink
            to="/inscripcion"
            class="quote__button quote__button--primary"
          >
            Quiero inscribirme
            <span aria-hidden="true">→</span>
          </RouterLink>

          <RouterLink
            to="/contacto"
            class="quote__button quote__button--secondary"
          >
            Hablar con la Academia
          </RouterLink>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const pillars = [
  {
    number: '01',
    label: 'DESCUBRIR',
    title: 'Tu propia voz',
    description:
      'Reconocer fortalezas, posibilidades y una identidad vocal propia.',
  },
  {
    number: '02',
    label: 'COMPRENDER',
    title: 'Cómo funciona la música',
    description:
      'Entender lo que escuchas, cantas y utilizas durante tu formación.',
  },
  {
    number: '03',
    label: 'EXPRESAR',
    title: 'Lo que quieres comunicar',
    description:
      'Transformar técnica y comprensión en interpretación y presencia.',
  },
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.quote {
  position: relative;
  overflow: hidden;
  padding: clamp(5rem, 7vw, 7.5rem) 24px clamp(4rem, 6vw, 6rem);
  color: #f4f4f4;
  background:
    radial-gradient(
      circle at 12% 25%,
      rgba(212, 175, 55, 0.035),
      transparent 28%
    ),
    linear-gradient(
      180deg,
      #080808 0%,
      #090909 55%,
      #060606 100%
    );
}

.quote__container {
  position: relative;
  z-index: 2;
}

.quote__grid {
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
  background-size: 70px 70px;
  mask-image:
    linear-gradient(
      to bottom,
      transparent,
      black 8%,
      black 92%,
      transparent
    );
}

.quote__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(150px);
}

.quote__glow--left {
  top: 10%;
  left: -320px;
  width: 650px;
  height: 650px;
  background: rgba(212, 175, 55, 0.035);
}

.quote__glow--right {
  right: -300px;
  bottom: 5%;
  width: 650px;
  height: 650px;
  background: rgba(212, 175, 55, 0.04);
}

/* =========================================================
   TOP
========================================================= */

.quote__top {
  display: flex;
  gap: 24px;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 18px;
  border-bottom: 1px solid #292929;
}

.quote__heading {
  display: flex;
  gap: 16px;
  align-items: center;
}

.quote__line {
  width: 55px;
  height: 1px;
  background: rgba(212, 175, 55, 0.45);
}

.quote__eyebrow {
  color: variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.17em;
  text-transform: uppercase;
}

.quote__index {
  color: #4d4d4d;
  font-size: 0.45rem;
  font-weight: 900;
  letter-spacing: 0.15em;
  text-transform: uppercase;
}

/* =========================================================
   HERO
========================================================= */

.quote__hero {
  display: grid;
  gap: clamp(3.5rem, 6vw, 6rem);
  align-items: center;
  padding: clamp(4.5rem, 7vw, 7rem) 0;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 1.18fr)
      minmax(330px, 0.82fr);
  }
}

/* =========================================================
   FRASE
========================================================= */

.quote__content {
  position: relative;
  max-width: 900px;
}

.quote__symbol {
  position: absolute;
  top: -75px;
  left: -15px;
  color: rgba(212, 175, 55, 0.12);
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(8rem, 13vw, 12rem);
  line-height: 1;
  pointer-events: none;
}

.quote__text {
  position: relative;
  z-index: 2;
  max-width: 820px;
  margin: 0;
  color: #efefef;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(3.2rem, 5.8vw, 5.8rem);
  font-weight: 400;
  line-height: 0.96;
  letter-spacing: -0.055em;
}

.quote__text span,
.quote__text strong {
  color: variables.$color-primary;
  font-weight: 400;
}

.quote__author {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-top: 38px;
}

.quote__author-line {
  width: 60px;
  height: 1px;
  background: variables.$color-primary;
}

.quote__author-copy strong,
.quote__author-copy span,
.quote__author-copy small {
  display: block;
}

.quote__author-copy strong {
  color: #dedede;
  font-size: 0.76rem;
}

.quote__author-copy span {
  margin-top: 4px;
  color: variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 850;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.quote__author-copy small {
  margin-top: 3px;
  color: #606060;
  font-size: 0.48rem;
}

/* =========================================================
   IDENTIDAD
========================================================= */

.quote__identity {
  position: relative;
  display: grid;
  width: min(390px, 100%);
  aspect-ratio: 1;
  place-items: center;
  justify-self: center;
}

.quote__orbit {
  position: absolute;
  border: 1px solid rgba(212, 175, 55, 0.13);
  border-radius: 50%;
}

.quote__orbit--outer {
  inset: 0;
}

.quote__orbit--middle {
  inset: 44px;
  border-color: rgba(212, 175, 55, 0.2);
}

.quote__orbit--inner {
  inset: 88px;
  border-color: rgba(212, 175, 55, 0.32);
  box-shadow: 0 0 80px rgba(212, 175, 55, 0.055);
}

.quote__orbit-dot {
  position: absolute;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: variables.$color-primary;
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
}

.quote__orbit-dot--one {
  top: 16%;
  right: 17%;
}

.quote__orbit-dot--two {
  bottom: 14%;
  left: 22%;
  width: 4px;
  height: 4px;
  opacity: 0.65;
}

.quote__brand {
  position: relative;
  z-index: 2;
  text-align: center;
}

.quote__brand-small {
  display: block;
  margin-bottom: 15px;
  color: #666;
  font-size: 0.43rem;
  font-weight: 900;
  letter-spacing: 0.18em;
}

.quote__brand-name strong {
  display: block;
  color: variables.$color-primary;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2.8rem, 5vw, 4.3rem);
  font-weight: 500;
  line-height: 0.76;
  letter-spacing: -0.055em;
}

.quote__brand-footer {
  display: block;
  margin-top: 20px;
  color: #535353;
  font-size: 0.39rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.quote__note {
  position: absolute;
  color: rgba(212, 175, 55, 0.32);
  font-family: Georgia, serif;
}

.quote__note--one {
  top: 22%;
  left: 10%;
  font-size: 1.1rem;
}

.quote__note--two {
  right: 10%;
  bottom: 19%;
  font-size: 0.9rem;
}

/* =========================================================
   PROPÓSITO
========================================================= */

.quote__purpose {
  display: grid;
  gap: 28px;
  align-items: center;
  padding: 30px 0;
  border-top: 1px solid #292929;
  border-bottom: 1px solid #292929;

  @include mixins.respond-to(md) {
    grid-template-columns: 260px minmax(0, 1fr);
  }
}

.quote__purpose-label {
  display: flex;
  gap: 14px;
  align-items: center;
}

.quote__purpose-label > span {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(212, 175, 55, 0.28);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.44rem;
  font-weight: 900;
}

.quote__purpose-label small,
.quote__purpose-label strong {
  display: block;
}

.quote__purpose-label small {
  color: variables.$color-primary;
  font-size: 0.41rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.quote__purpose-label strong {
  margin-top: 5px;
  color: #bdbdbd;
  font-size: 0.7rem;
}

.quote__purpose p {
  max-width: 900px;
  margin: 0;
  color: #858585;
  font-size: clamp(0.88rem, 1.25vw, 1.05rem);
  line-height: 1.75;
}

.quote__purpose p strong {
  color: #d5d5d5;
  font-weight: 600;
}

/* =========================================================
   PILARES
========================================================= */

.quote__pillars {
  display: grid;
  gap: 12px;
  margin-top: 28px;

  @include mixins.respond-to(md) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.quote__pillar {
  position: relative;
  min-height: 190px;
  padding: 24px;
  overflow: hidden;
  border: 1px solid #292929;
  border-radius: 14px;
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.018),
      transparent 55%
    ),
    #0b0b0b;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    background 0.25s ease;
}

.quote__pillar::after {
  position: absolute;
  right: -60px;
  bottom: -60px;
  width: 130px;
  height: 130px;
  border: 1px solid rgba(212, 175, 55, 0.06);
  border-radius: 50%;
  content: '';
}

.quote__pillar:hover {
  border-color: rgba(212, 175, 55, 0.3);
  background:
    linear-gradient(
      145deg,
      rgba(212, 175, 55, 0.035),
      transparent 60%
    ),
    #0d0d0d;
  transform: translateY(-4px);
}

.quote__pillar-top {
  display: flex;
  gap: 14px;
  align-items: center;
  margin-bottom: 28px;
}

.quote__pillar-number {
  display: grid;
  width: 35px;
  height: 35px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid rgba(212, 175, 55, 0.28);
  border-radius: 50%;
  color: variables.$color-primary;
  font-size: 0.43rem;
  font-weight: 900;
}

.quote__pillar-rule {
  width: 38px;
  height: 1px;
  background: rgba(212, 175, 55, 0.28);
}

.quote__pillar small,
.quote__pillar strong {
  display: block;
}

.quote__pillar small {
  color: variables.$color-primary;
  font-size: 0.4rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.quote__pillar strong {
  max-width: 250px;
  margin-top: 8px;
  color: #e3e3e3;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(1.15rem, 1.5vw, 1.4rem);
  line-height: 1.1;
}

.quote__pillar p {
  max-width: 290px;
  margin: 13px 0 0;
  color: #686868;
  font-size: 0.65rem;
  line-height: 1.65;
}

/* =========================================================
   CTA
========================================================= */

.quote__cta {
  display: grid;
  gap: 24px;
  align-items: center;
  margin-top: clamp(2rem, 4vw, 3.5rem);
  padding: clamp(1.8rem, 3vw, 2.8rem);
  border: 1px solid rgba(212, 175, 55, 0.22);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 80% 15%,
      rgba(212, 175, 55, 0.08),
      transparent 32%
    ),
    linear-gradient(
      130deg,
      #10100e,
      #0a0a0a
    );

  @include mixins.respond-to(lg) {
    grid-template-columns:
      auto
      minmax(0, 1fr)
      auto;
  }
}

.quote__cta-icon {
  display: grid;
  width: 52px;
  height: 52px;
  place-items: center;
  border-radius: 50%;
  color: #080808;
  background: variables.$color-primary;
  font-family: Georgia, serif;
  font-size: 1rem;
  box-shadow: 0 0 40px rgba(212, 175, 55, 0.1);
}

.quote__cta-copy h2 {
  max-width: 760px;
  margin: 11px 0 0;
  color: #ededed;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: clamp(2rem, 3.5vw, 3.5rem);
  font-weight: 500;
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.quote__cta-copy h2 span {
  color: variables.$color-primary;
}

.quote__cta-copy p {
  max-width: 580px;
  margin: 14px 0 0;
  color: #717171;
  font-size: 0.67rem;
  line-height: 1.65;
}

.quote__actions {
  display: flex;
  min-width: 215px;
  gap: 8px;
  flex-direction: column;
}

.quote__button {
  display: flex;
  min-height: 49px;
  gap: 14px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 9px;
  font-size: 0.64rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;

  @include mixins.focus-visible;
}

.quote__button:hover {
  transform: translateY(-2px);
}

.quote__button--primary {
  border: 1px solid variables.$color-primary;
  color: #080808;
  background: variables.$color-primary;
}

.quote__button--primary:hover {
  box-shadow: 0 14px 35px rgba(212, 175, 55, 0.16);
}

.quote__button--secondary {
  border: 1px solid #363636;
  color: #aaa;
  background: transparent;
}

.quote__button--secondary:hover {
  color: #fff;
  border-color: #555;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .quote {
    padding:
      90px
      20px
      55px;
  }

  .quote__identity {
    width: min(340px, 80vw);
  }
}

@media (max-width: 700px) {
  .quote {
    padding:
      75px
      18px
      45px;
  }

  .quote__top {
    gap: 10px;
    align-items: flex-start;
    flex-direction: column;
  }

  .quote__heading {
    width: 100%;
  }

  .quote__line {
    flex: 1;
  }

  .quote__hero {
    gap: 55px;
    padding:
      55px
      0;
  }

  .quote__text {
    font-size: clamp(2.75rem, 12vw, 4.3rem);
  }

  .quote__symbol {
    top: -55px;
    font-size: 8rem;
  }

  .quote__identity {
    width: min(300px, 85vw);
  }

  .quote__orbit--middle {
    inset: 35px;
  }

  .quote__orbit--inner {
    inset: 70px;
  }

  .quote__purpose {
    gap: 22px;
  }

  .quote__pillar {
    min-height: auto;
  }

  .quote__cta {
    padding:
      28px
      22px;
  }

  .quote__cta-copy h2 span {
    display: block;
  }

  .quote__actions {
    width: 100%;
  }

  .quote__button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .quote__identity {
    width: min(270px, 88vw);
  }

  .quote__brand-name strong {
    font-size: 2.65rem;
  }

  .quote__author-line {
    width: 38px;
  }

  .quote__pillar {
    padding: 21px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .quote__pillar,
  .quote__button {
    transition: none;
  }

  .quote__pillar:hover,
  .quote__button:hover {
    transform: none;
  }
}
</style>
