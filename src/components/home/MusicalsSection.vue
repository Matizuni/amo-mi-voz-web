<template>
  <section
    id="musicales"
    class="musicals"
    v-reveal
  >
    <div class="musicals__grid-bg" aria-hidden="true"></div>
    <div class="musicals__glow musicals__glow--left" aria-hidden="true"></div>
    <div class="musicals__glow musicals__glow--right" aria-hidden="true"></div>

    <div class="container musicals__container">
      <!-- =========================
           HEADER
      ========================== -->
      <header class="musicals__header">
        <div class="musicals__heading">
          <span class="musicals__eyebrow">
            EXPERIENCIAS ESCÉNICO-MUSICALES
          </span>

          <h2 class="musicals__title">
            La música también
            <span>puede contar historias.</span>
          </h2>
        </div>

        <div class="musicals__header-copy">
          <p class="musicals__lead">
            En Amo Mi Voz transformamos repertorio en experiencias
            que conectan canto, interpretación, narración y escenario.
          </p>

          <p>
            El objetivo no es solamente presentar canciones,
            sino construir una experiencia artística con sentido.
          </p>
        </div>
      </header>

      <!-- =========================
           CONCEPTO
      ========================== -->
      <div class="musicals__concept">
        <div class="musicals__concept-mark">
          AMV
        </div>

        <div class="musicals__concept-copy">
          <small>
            MÚSICA · NARRACIÓN · INTERPRETACIÓN · ESCENA
          </small>

          <strong>
            Del repertorio a una experiencia escénica.
          </strong>
        </div>

        <div class="musicals__concept-side">
          <span>PROYECTOS</span>
          <strong>2026</strong>
        </div>
      </div>

      <!-- =========================
           PRODUCCIONES
      ========================== -->
      <div class="musicals__productions-heading">
        <div>
          <span>PRODUCCIONES</span>

          <strong>
            Historias trabajadas por nuestra Academia
          </strong>
        </div>

        <small>
          EXPERIENCIA ESCÉNICA
        </small>
      </div>

      <div class="musicals__showcase">
        <!-- COCO -->
        <article class="production production--coco">
          <div class="production__visual">
            <img
              :src="cocoFlyer"
              alt="Flyer de COCO de la Academia de Talentos Amo Mi Voz"
              class="production__poster"
              loading="lazy"
            />

            <div class="production__visual-overlay"></div>

            <div class="production__badge">
              <span></span>
              PRESENTADO
            </div>

            <div class="production__visual-number">
              01
            </div>
          </div>

          <div class="production__content">
            <div class="production__meta">
              <span>
                EXPERIENCIA ESCÉNICO-MUSICAL
              </span>

              <small>
                2026
              </small>
            </div>

            <h3>
              COCO
            </h3>

            <p class="production__subtitle">
              Una historia de memoria, familia, música y sueños.
            </p>

            <p class="production__description">
              Canciones reconocidas se conectan mediante
              interpretación, narración y trabajo escénico
              para construir una experiencia continua.
            </p>

            <div class="production__features">
              <span>Canto</span>
              <span>Interpretación</span>
              <span>Narración</span>
              <span>Escena</span>
            </div>

            <RouterLink
              to="/musicales"
              class="production__link"
            >
              <span>Conocer producción</span>
              <strong>→</strong>
            </RouterLink>
          </div>
        </article>

        <!-- JACK -->
        <article class="production production--jack">
          <div class="production__visual">
            <img
              :src="jackFlyer"
              alt="Flyer de El Extraño Mundo de Jack de la Academia Amo Mi Voz"
              class="production__poster"
              loading="lazy"
            />

            <div class="production__visual-overlay"></div>

            <div class="production__badge">
              <span></span>
              EN PREPARACIÓN
            </div>

            <div class="production__visual-number">
              02
            </div>
          </div>

          <div class="production__content">
            <div class="production__meta">
              <span>
                PRÓXIMA EXPERIENCIA ESCÉNICA
              </span>

              <small>
                2026
              </small>
            </div>

            <h3 class="production__title--jack">
              El Extraño
              <span>Mundo de Jack</span>
            </h3>

            <p class="production__subtitle">
              Halloween se transforma en música, personajes y escenario.
            </p>

            <p class="production__description">
              Canto, actuación, narración y diseño sonoro se
              integran para construir una experiencia con identidad propia.
            </p>

            <div class="production__features">
              <span>Canto</span>
              <span>Personajes</span>
              <span>Actuación</span>
              <span>Producción</span>
            </div>

            <RouterLink
              to="/musicales"
              class="production__link"
            >
              <span>Descubrir producción</span>
              <strong>→</strong>
            </RouterLink>
          </div>
        </article>
      </div>

      <!-- =========================
           PROCESO
      ========================== -->
      <div class="musicals__process">
        <div class="musicals__process-heading">
          <span class="musicals__eyebrow">
            DEL REPERTORIO AL ESCENARIO
          </span>

          <h3>
            Una historia se construye
            <span>capa por capa.</span>
          </h3>

          <p>
            Cada proyecto conecta distintas disciplinas para
            transformar canciones en una experiencia artística coherente.
          </p>
        </div>

        <div class="musicals__process-list">
          <article
            v-for="step in process"
            :key="step.number"
          >
            <span class="musicals__process-number">
              {{ step.number }}
            </span>

            <div>
              <small>
                {{ step.label }}
              </small>

              <strong>
                {{ step.title }}
              </strong>

              <p>
                {{ step.description }}
              </p>
            </div>
          </article>
        </div>
      </div>

      <!-- =========================
           CIERRE
      ========================== -->
      <div class="musicals__closing">
        <div class="musicals__closing-symbol">
          ♪
        </div>

        <div class="musicals__closing-copy">
          <small>
            APRENDER HACIENDO
          </small>

          <strong>
            El escenario también forma parte de nuestra metodología.
          </strong>

          <p>
            Presentarse permite aplicar técnica, interpretación,
            memoria, escucha y trabajo colectivo.
          </p>
        </div>

        <RouterLink
          to="/musicales"
          class="musicals__closing-arrow"
          aria-label="Ver musicales"
        >
          →
        </RouterLink>
      </div>

      <div class="musicals__actions">
        <RouterLink
          to="/musicales"
          class="musicals__button musicals__button--primary"
        >
          Explorar nuestros musicales
          <span>→</span>
        </RouterLink>

        <RouterLink
          to="/galeria"
          class="musicals__button musicals__button--secondary"
        >
          Ver experiencias en galería
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'

import cocoFlyer from '@/assets/images/coco-flayer.png'
import jackFlyer from '@/assets/images/jack-flayer.png'

const process = [
  {
    number: '01',
    label: 'REPERTORIO',
    title: 'La música',
    description:
      'Seleccionamos canciones capaces de representar momentos importantes de la historia.'
  },
  {
    number: '02',
    label: 'NARRATIVA',
    title: 'El relato',
    description:
      'La narración conecta las canciones y permite construir un recorrido comprensible.'
  },
  {
    number: '03',
    label: 'INTERPRETACIÓN',
    title: 'Los personajes',
    description:
      'El estudiante trabaja intención, expresión, movimiento y presencia escénica.'
  },
  {
    number: '04',
    label: 'PRODUCCIÓN',
    title: 'La atmósfera',
    description:
      'Audio, efectos, transiciones y elementos visuales completan la experiencia.'
  }
]
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.musicals {
  position: relative;
  overflow: hidden;
  padding: 105px 24px;
  color: #f5f5f5;
  background: #070707;
}

.musicals__container {
  position: relative;
  z-index: 2;
}

.musicals__grid-bg {
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

.musicals__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(150px);
}

.musicals__glow--left {
  top: 14%;
  left: -330px;
  width: 650px;
  height: 650px;
  background:
    rgba(212, 175, 55, 0.032);
}

.musicals__glow--right {
  right: -360px;
  bottom: 4%;
  width: 700px;
  height: 700px;
  background:
    rgba(212, 175, 55, 0.02);
}

/* =========================================================
   HEADER
========================================================= */

.musicals__header {
  display: grid;
  gap: 46px;
  margin-bottom: 34px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(320px, 0.68fr);
    align-items: end;
  }
}

.musicals__eyebrow {
  display: block;
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.musicals__title {
  max-width: 850px;
  margin: 14px 0 0;
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

.musicals__title span {
  display: block;
  color:
    variables.$color-primary;
}

.musicals__header-copy {
  max-width: 500px;
}

.musicals__header-copy p {
  margin: 12px 0 0;
  color: #747474;
  font-size: 0.76rem;
  line-height: 1.72;
}

.musicals__lead {
  margin-top: 0 !important;
  color: #c5c5c5 !important;
  font-size: 0.9rem !important;
}

/* =========================================================
   CONCEPT
========================================================= */

.musicals__concept {
  display: grid;
  grid-template-columns:
    auto
    1fr
    auto;
  gap: 14px;
  align-items: center;
  margin-bottom: 38px;
  padding: 15px;
  border:
    1px solid
    rgba(212, 175, 55, 0.18);
  border-radius: 12px;
  background:
    linear-gradient(
      120deg,
      rgba(212, 175, 55, 0.04),
      rgba(255, 255, 255, 0.006)
    );
}

.musicals__concept-mark {
  display: grid;
  width: 40px;
  height: 40px;
  place-items: center;
  border-radius: 50%;
  color: #080808;
  background:
    variables.$color-primary;
  font-size: 0.48rem;
  font-weight: 950;
}

.musicals__concept-copy small,
.musicals__concept-copy strong {
  display: block;
}

.musicals__concept-copy small {
  color:
    variables.$color-primary;
  font-size: 0.37rem;
  font-weight: 900;
  letter-spacing: 0.11em;
}

.musicals__concept-copy strong {
  margin-top: 3px;
  color: #d4d4d4;
  font-size: 0.68rem;
}

.musicals__concept-side {
  text-align: right;
}

.musicals__concept-side span,
.musicals__concept-side strong {
  display: block;
}

.musicals__concept-side span {
  color: #525252;
  font-size: 0.36rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.musicals__concept-side strong {
  margin-top: 2px;
  color:
    variables.$color-primary;
  font-size: 0.6rem;
}

/* =========================================================
   PRODUCTIONS HEADER
========================================================= */

.musicals__productions-heading {
  display: flex;
  gap: 20px;
  align-items: end;
  justify-content: space-between;
  margin-bottom: 15px;
}

.musicals__productions-heading span,
.musicals__productions-heading strong {
  display: block;
}

.musicals__productions-heading span {
  color:
    variables.$color-primary;
  font-size: 0.4rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.musicals__productions-heading strong {
  margin-top: 4px;
  color: #c4c4c4;
  font-size: 0.68rem;
}

.musicals__productions-heading > small {
  color: #4d4d4d;
  font-size: 0.4rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

/* =========================================================
   SHOWCASE
========================================================= */

.musicals__showcase {
  display: grid;
  gap: 14px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

.production {
  display: grid;
  overflow: hidden;
  border: 1px solid #292929;
  border-radius: 18px;
  background: #0c0c0c;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.production:hover {
  transform: translateY(-3px);
  border-color:
    rgba(212, 175, 55, 0.24);
  box-shadow:
    0 24px 55px
    rgba(0, 0, 0, 0.26);
}

/* =========================================================
   PRODUCTION VISUAL
========================================================= */

.production__visual {
  position: relative;
  overflow: hidden;
  min-height: 390px;
  background: #111;
}

.production__poster {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition:
    transform 0.55s ease;
}

.production:hover .production__poster {
  transform: scale(1.025);
}

.production__visual-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(5, 5, 5, 0.96),
      rgba(5, 5, 5, 0.08) 58%
    );
}

.production__badge {
  position: absolute;
  top: 18px;
  left: 18px;
  display: flex;
  gap: 7px;
  align-items: center;
  padding: 7px 9px;
  border:
    1px solid
    rgba(212, 175, 55, 0.2);
  border-radius: 999px;
  color:
    variables.$color-primary;
  background:
    rgba(8, 8, 8, 0.74);
  font-size: 0.38rem;
  font-weight: 900;
  letter-spacing: 0.09em;
  backdrop-filter: blur(10px);
}

.production__badge span {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background:
    variables.$color-primary;
}

.production__visual-number {
  position: absolute;
  right: 18px;
  bottom: 14px;
  color:
    rgba(212, 175, 55, 0.5);
  font-size: 0.47rem;
  font-weight: 900;
}

/* =========================================================
   PRODUCTION CONTENT
========================================================= */

.production__content {
  display: flex;
  min-height: 320px;
  flex-direction: column;
  padding: 23px;
}

.production__meta {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
}

.production__meta > span {
  color:
    variables.$color-primary;
  font-size: 0.39rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.production__meta small {
  color: #5d5d5d;
  font-size: 0.42rem;
  font-weight: 900;
}

.production__content h3 {
  margin: 18px 0 0;
  color: #f2f2f2;
  font-family:
    Georgia,
    'Times New Roman',
    serif;
  font-size:
    clamp(
      2.8rem,
      4.4vw,
      4.2rem
    );
  font-weight: 500;
  line-height: 0.93;
  letter-spacing: -0.055em;
}

.production__title--jack span {
  display: block;
  color:
    variables.$color-primary;
}

.production__subtitle {
  margin: 16px 0 0;
  color: #c0c0c0;
  font-size: 0.78rem;
  line-height: 1.55;
}

.production__description {
  margin: 9px 0 0;
  color: #6e6e6e;
  font-size: 0.63rem;
  line-height: 1.62;
}

.production__features {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.production__features span {
  padding: 6px 9px;
  border: 1px solid #2d2d2d;
  border-radius: 999px;
  color: #737373;
  background: #111;
  font-size: 0.43rem;
  font-weight: 800;
}

.production__link {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 17px;
  border-top: 1px solid #292929;
  color:
    variables.$color-primary;
  text-decoration: none;
}

.production__link span {
  font-size: 0.59rem;
  font-weight: 900;
}

.production__link strong {
  font-size: 0.9rem;
  transition:
    transform 0.2s ease;
}

.production__link:hover strong {
  transform: translateX(4px);
}

/* =========================================================
   PROCESS
========================================================= */

.musicals__process {
  display: grid;
  gap: 36px;
  margin-top: 42px;
  padding: 27px;
  border: 1px solid #282828;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(212, 175, 55, 0.045),
      transparent 42%
    ),
    #0c0c0c;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.7fr
      1.3fr;
  }
}

.musicals__process-heading h3 {
  max-width: 500px;
  margin: 12px 0 0;
  color: #ededed;
  font-size:
    clamp(
      1.9rem,
      3.4vw,
      3.2rem
    );
  line-height: 0.98;
  letter-spacing: -0.05em;
}

.musicals__process-heading h3 span {
  display: block;
  color:
    variables.$color-primary;
}

.musicals__process-heading > p {
  max-width: 430px;
  margin: 13px 0 0;
  color: #686868;
  font-size: 0.59rem;
  line-height: 1.6;
}

.musicals__process-list {
  display: grid;
  gap: 1px;
  overflow: hidden;
  border: 1px solid #282828;
  border-radius: 11px;
  background: #282828;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

.musicals__process-list article {
  display: flex;
  gap: 10px;
  min-height: 105px;
  padding: 14px;
  background: #0b0b0b;
}

.musicals__process-number {
  display: grid;
  width: 30px;
  height: 30px;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.22);
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size: 0.4rem;
  font-weight: 900;
}

.musicals__process-list small,
.musicals__process-list strong {
  display: block;
}

.musicals__process-list small {
  color:
    variables.$color-primary;
  font-size: 0.35rem;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.musicals__process-list strong {
  margin-top: 4px;
  color: #d1d1d1;
  font-size: 0.63rem;
}

.musicals__process-list p {
  margin: 4px 0 0;
  color: #636363;
  font-size: 0.5rem;
  line-height: 1.45;
}

/* =========================================================
   CLOSING
========================================================= */

.musicals__closing {
  display: grid;
  grid-template-columns:
    auto
    1fr
    auto;
  gap: 13px;
  align-items: center;
  margin-top: 20px;
  padding: 16px;
  border:
    1px solid
    rgba(212, 175, 55, 0.18);
  border-radius: 12px;
  background:
    linear-gradient(
      120deg,
      rgba(212, 175, 55, 0.04),
      rgba(255, 255, 255, 0.006)
    );
}

.musicals__closing-symbol {
  display: grid;
  width: 38px;
  height: 38px;
  place-items: center;
  border-radius: 50%;
  color: #080808;
  background:
    variables.$color-primary;
}

.musicals__closing-copy small,
.musicals__closing-copy strong {
  display: block;
}

.musicals__closing-copy small {
  color:
    variables.$color-primary;
  font-size: 0.36rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.musicals__closing-copy strong {
  margin-top: 3px;
  color: #d6d6d6;
  font-size: 0.67rem;
}

.musicals__closing-copy p {
  max-width: 640px;
  margin: 4px 0 0;
  color: #696969;
  font-size: 0.53rem;
  line-height: 1.48;
}

.musicals__closing-arrow {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border:
    1px solid
    rgba(212, 175, 55, 0.22);
  border-radius: 50%;
  color:
    variables.$color-primary;
  text-decoration: none;
  transition:
    transform 0.2s ease;
}

.musicals__closing-arrow:hover {
  transform: translateX(3px);
}

/* =========================================================
   ACTIONS
========================================================= */

.musicals__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 19px;
}

.musicals__button {
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

.musicals__button:hover {
  transform: translateY(-2px);
}

.musicals__button--primary {
  border:
    1px solid
    variables.$color-primary;
  color: #080808;
  background:
    variables.$color-primary;
}

.musicals__button--primary:hover {
  box-shadow:
    0 14px 35px
    rgba(212, 175, 55, 0.13);
}

.musicals__button--secondary {
  border: 1px solid #333;
  color: #aaa;
  background: transparent;
}

.musicals__button--secondary:hover {
  color: #fff;
  border-color: #505050;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .musicals {
    padding: 85px 20px;
  }

  .musicals__header {
    gap: 30px;
  }
}

@media (max-width: 700px) {
  .musicals {
    padding: 72px 18px;
  }

  .musicals__title {
    font-size:
      clamp(
        2.55rem,
        11vw,
        3.8rem
      );
  }

  .musicals__concept {
    grid-template-columns:
      auto
      1fr;
  }

  .musicals__concept-side {
    grid-column: 1 / -1;
    padding-top: 9px;
    border-top: 1px solid #282828;
    text-align: left;
  }

  .musicals__productions-heading {
    align-items: flex-start;
    flex-direction: column;
  }

  .production__visual {
    min-height: 340px;
  }

  .production__content {
    min-height: auto;
    padding: 20px;
  }

  .musicals__process {
    padding: 20px;
  }

  .musicals__closing {
    grid-template-columns:
      auto
      1fr;
  }

  .musicals__closing-arrow {
    grid-column: 1 / -1;
    width: 100%;
    border-radius: 8px;
  }

  .musicals__actions {
    flex-direction: column;
  }

  .musicals__button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .production__visual {
    min-height: 300px;
  }

  .production__content h3 {
    font-size: 2.7rem;
  }

  .musicals__process-list {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .production,
  .production__poster,
  .production__link strong,
  .musicals__closing-arrow,
  .musicals__button {
    transition: none;
  }
}
</style>
