<template>
  <section
    class="benefits"
    v-reveal
  >
    <div class="benefits__grid-bg" aria-hidden="true"></div>
    <div class="benefits__glow benefits__glow--left" aria-hidden="true"></div>
    <div class="benefits__glow benefits__glow--right" aria-hidden="true"></div>

    <div class="container benefits__container">
      <!-- =========================
           HEADER
      ========================== -->
      <header class="benefits__header">
        <div class="benefits__heading">
          <span class="benefits__eyebrow">
            ¿POR QUÉ AMO MI VOZ?
          </span>

          <h2 class="benefits__title">
            No se trata solamente de
            <span>cantar mejor.</span>
          </h2>
        </div>

        <div class="benefits__header-copy">
          <p class="benefits__lead">
            Buscamos que cada estudiante gane herramientas,
            seguridad y autonomía para comprender mejor lo que
            hace y expresarse con mayor libertad.
          </p>

          <p>
            El crecimiento aparece cuando técnica, escucha,
            interpretación y experiencia comienzan a trabajar juntas.
          </p>
        </div>
      </header>

      <!-- =========================
           RESULTADOS
      ========================== -->
      <div class="benefits__grid">
        <article
          v-for="(benefit, index) in benefits"
          :key="benefit.id"
          class="benefits__card"
        >
          <div class="benefits__card-top">
            <span class="benefits__number">
              {{ String(index + 1).padStart(2, '0') }}
            </span>

            <span class="benefits__dot" aria-hidden="true"></span>
          </div>

          <div class="benefits__card-content">
            <h3>
              {{ benefit.title }}
            </h3>

            <p>
              {{ benefit.description }}
            </p>
          </div>
        </article>
      </div>

      <!-- =========================
           IMPACTO
      ========================== -->
      <div class="benefits__impact">
        <div class="benefits__impact-heading">
          <span class="benefits__eyebrow">
            LO QUE BUSCAMOS DESARROLLAR
          </span>

          <h3>
            Herramientas que acompañan
            <span>todo el proceso artístico.</span>
          </h3>
        </div>

        <div class="benefits__impact-grid">
          <article
            v-for="item in impactAreas"
            :key="item.number"
          >
            <span>
              {{ item.number }}
            </span>

            <div>
              <strong>
                {{ item.title }}
              </strong>

              <small>
                {{ item.description }}
              </small>
            </div>
          </article>
        </div>
      </div>

      <!-- =========================
           CIERRE
      ========================== -->
      <div class="benefits__closing">
        <div class="benefits__closing-icon">
          ♪
        </div>

        <div class="benefits__closing-copy">
          <small>
            APRENDER PARA EXPRESARSE
          </small>

          <strong>
            La confianza crece cuando aparecen comprensión y experiencia.
          </strong>

          <p>
            Cada canción, ensayo y presentación entrega una nueva
            oportunidad para consolidar lo aprendido.
          </p>
        </div>

        <RouterLink
          to="/formacion"
          class="benefits__closing-link"
          aria-label="Conocer nuestro enfoque"
        >
          →
        </RouterLink>
      </div>

      <div class="benefits__actions">
        <RouterLink
          to="/formacion"
          class="benefits__button benefits__button--primary"
        >
          Conocer nuestro enfoque
          <span>→</span>
        </RouterLink>

        <RouterLink
          to="/inscripcion"
          class="benefits__button benefits__button--secondary"
        >
          Quiero comenzar
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { benefits } from '../../data/benefits.js'

const impactAreas = [
  {
    number: '01',
    title: 'Confianza',
    description:
      'Mayor seguridad al cantar, interpretar y presentarse.'
  },
  {
    number: '02',
    title: 'Escucha',
    description:
      'Más atención al sonido, afinación, ritmo y trabajo grupal.'
  },
  {
    number: '03',
    title: 'Comprensión',
    description:
      'Entender mejor las herramientas musicales que se utilizan.'
  },
  {
    number: '04',
    title: 'Autonomía',
    description:
      'Más recursos para estudiar y resolver desafíos musicales.'
  },
  {
    number: '05',
    title: 'Interpretación',
    description:
      'Mayor conexión entre texto, emoción y comunicación.'
  },
  {
    number: '06',
    title: 'Experiencia',
    description:
      'Ensayos y presentaciones que consolidan el aprendizaje.'
  }
]
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.benefits {
  position: relative;
  overflow: hidden;
  padding: 105px 24px;
  color: #f5f5f5;
  background: #0b0b0b;
}

.benefits__grid-bg {
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

.benefits__glow {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  filter: blur(150px);
}

.benefits__glow--left {
  top: 9%;
  left: -300px;
  width: 600px;
  height: 600px;
  background:
    rgba(212, 175, 55, 0.035);
}

.benefits__glow--right {
  right: -340px;
  bottom: -240px;
  width: 660px;
  height: 660px;
  background:
    rgba(212, 175, 55, 0.024);
}

.benefits__container {
  position: relative;
  z-index: 2;
}

/* =========================================================
   HEADER
========================================================= */

.benefits__header {
  display: grid;
  gap: 46px;
  margin-bottom: 38px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 1fr)
      minmax(320px, 0.68fr);
    align-items: end;
  }
}

.benefits__eyebrow {
  display: block;
  color:
    variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.benefits__title {
  max-width: 820px;
  margin: 14px 0 0;
  color: #f1f1f1;
  font-size:
    clamp(
      2.8rem,
      4.8vw,
      4.6rem
    );
  line-height: 0.94;
  letter-spacing: -0.06em;
}

.benefits__title span {
  display: block;
  color:
    variables.$color-primary;
}

.benefits__header-copy {
  max-width: 510px;
}

.benefits__header-copy p {
  margin: 12px 0 0;
  color: #747474;
  font-size: 0.76rem;
  line-height: 1.72;
}

.benefits__lead {
  margin-top: 0 !important;
  color: #c2c2c2 !important;
  font-size: 0.9rem !important;
}

/* =========================================================
   BENEFITS GRID
========================================================= */

.benefits__grid {
  display: grid;
  gap: 10px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  @include mixins.respond-to(xl) {
    grid-template-columns:
      repeat(3, minmax(0, 1fr));
  }
}

.benefits__card {
  position: relative;
  display: flex;
  min-height: 180px;
  overflow: hidden;
  padding: 20px;
  flex-direction: column;
  border: 1px solid #272727;
  border-radius: 14px;
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.012),
      transparent
    ),
    #101010;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.benefits__card:hover {
  transform: translateY(-3px);
  border-color:
    rgba(212, 175, 55, 0.24);
  box-shadow:
    0 20px 46px
    rgba(0, 0, 0, 0.22);
}

.benefits__card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.benefits__number {
  color:
    variables.$color-primary;
  font-size: 0.48rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.benefits__dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background:
    rgba(212, 175, 55, 0.35);
}

.benefits__card-content {
  margin-top: auto;
}

.benefits__card-content h3 {
  margin: 0;
  color: #ededed;
  font-size: 1.08rem;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.benefits__card-content p {
  max-width: 420px;
  margin: 8px 0 0;
  color: #707070;
  font-size: 0.63rem;
  line-height: 1.55;
}

/* =========================================================
   IMPACT
========================================================= */

.benefits__impact {
  display: grid;
  gap: 38px;
  margin-top: 42px;
  padding: 27px;
  border: 1px solid #282828;
  border-radius: 16px;
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(212, 175, 55, 0.05),
      transparent 43%
    ),
    #0d0d0d;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.72fr
      1.28fr;
    align-items: start;
  }
}

.benefits__impact-heading h3 {
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

.benefits__impact-heading h3 span {
  display: block;
  color:
    variables.$color-primary;
}

.benefits__impact-grid {
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

.benefits__impact-grid article {
  display: flex;
  gap: 10px;
  min-height: 84px;
  padding: 13px;
  background: #0c0c0c;
}

.benefits__impact-grid article > span {
  color:
    variables.$color-primary;
  font-size: 0.42rem;
  font-weight: 900;
}

.benefits__impact-grid strong,
.benefits__impact-grid small {
  display: block;
}

.benefits__impact-grid strong {
  color: #d5d5d5;
  font-size: 0.65rem;
}

.benefits__impact-grid small {
  margin-top: 4px;
  color: #656565;
  font-size: 0.51rem;
  line-height: 1.4;
}

/* =========================================================
   CLOSING
========================================================= */

.benefits__closing {
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
    rgba(212, 175, 55, 0.19);
  border-radius: 12px;
  background:
    linear-gradient(
      120deg,
      rgba(212, 175, 55, 0.045),
      rgba(255, 255, 255, 0.008)
    );
}

.benefits__closing-icon {
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

.benefits__closing-copy small,
.benefits__closing-copy strong {
  display: block;
}

.benefits__closing-copy small {
  color:
    variables.$color-primary;
  font-size: 0.37rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.benefits__closing-copy strong {
  margin-top: 3px;
  color: #d7d7d7;
  font-size: 0.68rem;
}

.benefits__closing-copy p {
  max-width: 640px;
  margin: 4px 0 0;
  color: #6b6b6b;
  font-size: 0.54rem;
  line-height: 1.48;
}

.benefits__closing-link {
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

.benefits__closing-link:hover {
  transform: translateX(3px);
  background:
    rgba(212, 175, 55, 0.06);
}

/* =========================================================
   ACTIONS
========================================================= */

.benefits__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 19px;
}

.benefits__button {
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

.benefits__button:hover {
  transform: translateY(-2px);
}

.benefits__button--primary {
  border:
    1px solid
    variables.$color-primary;
  color: #080808;
  background:
    variables.$color-primary;
}

.benefits__button--primary:hover {
  box-shadow:
    0 14px 35px
    rgba(212, 175, 55, 0.13);
}

.benefits__button--secondary {
  border: 1px solid #333;
  color: #aaa;
  background: transparent;
}

.benefits__button--secondary:hover {
  color: #fff;
  border-color: #505050;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .benefits {
    padding: 85px 20px;
  }

  .benefits__header {
    gap: 30px;
  }

  .benefits__impact {
    padding: 23px;
  }
}

@media (max-width: 700px) {
  .benefits {
    padding: 72px 18px;
  }

  .benefits__title {
    font-size:
      clamp(
        2.55rem,
        11vw,
        3.8rem
      );
  }

  .benefits__card {
    min-height: 160px;
    padding: 18px;
  }

  .benefits__impact {
    margin-top: 34px;
    padding: 19px;
  }

  .benefits__closing {
    grid-template-columns:
      auto
      1fr;
  }

  .benefits__closing-link {
    grid-column: 1 / -1;
    width: 100%;
    border-radius: 8px;
  }

  .benefits__actions {
    flex-direction: column;
  }

  .benefits__button {
    width: 100%;
  }
}

@media (max-width: 500px) {
  .benefits__impact-grid {
    grid-template-columns: 1fr;
  }
}

@media (prefers-reduced-motion: reduce) {
  .benefits__card,
  .benefits__closing-link,
  .benefits__button {
    transition: none;
  }
}
</style>
