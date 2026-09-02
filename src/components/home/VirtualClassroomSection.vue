<template>
  <section class="virtual-classroom">
    <div class="virtual-classroom__glow" aria-hidden="true"></div>

    <div class="container virtual-classroom__container">
      <div class="virtual-classroom__content">
        <span class="section-eyebrow">
          FORMACIÓN · COMUNIDAD · TECNOLOGÍA
        </span>

        <h2>
          Tu formación continúa
          <span>más allá del escenario.</span>
        </h2>

        <p class="virtual-classroom__lead">
          Nuestra Aula Virtual reúne en un solo espacio las clases,
          materiales, repertorio, tareas y el seguimiento del proceso
          formativo de nuestros estudiantes.
        </p>

        <div class="virtual-classroom__features">
          <article class="feature">
            <span class="feature__number">01</span>

            <div>
              <strong>Clases y contenidos</strong>

              <p>
                Revisa el programa formativo y los contenidos de cada sesión.
              </p>
            </div>
          </article>

          <article class="feature">
            <span class="feature__number">02</span>

            <div>
              <strong>Material de estudio</strong>

              <p>
                Accede a repertorio, audios y recursos preparados
                para cada etapa del aprendizaje.
              </p>
            </div>
          </article>

          <article class="feature">
            <span class="feature__number">03</span>

            <div>
              <strong>Seguimiento personal</strong>

              <p>
                Cada estudiante puede consultar sus tareas
                y su propio proceso formativo.
              </p>
            </div>
          </article>
        </div>

        <RouterLink
          to="/aula"
          class="aula-button"
        >
          <span class="aula-button__icon">
            ♪
          </span>

          <span>
            <small>ACCESO ESTUDIANTES</small>
            Entrar al Aula Virtual
          </span>

          <span class="aula-button__arrow">
            →
          </span>
        </RouterLink>
      </div>

      <div class="virtual-classroom__visual">
        <div class="portal-card">
          <div class="portal-card__top">
            <span class="portal-card__dot"></span>
            <span class="portal-card__dot"></span>
            <span class="portal-card__dot"></span>

            <span class="portal-card__label">
              AULA · AMO MI VOZ
            </span>
          </div>

          <div class="portal-card__body">
            <div class="portal-card__brand">
              <span>AMV</span>
            </div>

            <p>ACADEMIA DE TALENTOS</p>

            <h3>
              Aula
              <span>Virtual</span>
            </h3>

            <div class="portal-card__line"></div>

            <div class="portal-card__stats">
              <div>
                <strong>Clases</strong>
                <small>Programa formativo</small>
              </div>

              <div>
                <strong>Recursos</strong>
                <small>Material musical</small>
              </div>

              <div>
                <strong>Progreso</strong>
                <small>Seguimiento</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

.virtual-classroom {
  position: relative;
  overflow: hidden;
  padding: 95px 24px;
  color: #fff;
  background:
    radial-gradient(
      circle at 75% 50%,
      rgba(244, 196, 48, 0.07),
      transparent 32%
    ),
    linear-gradient(
      180deg,
      #070707 0%,
      #0c0c0c 100%
    );
}

.virtual-classroom::before {
  position: absolute;
  top: 0;
  left: 50%;
  width: min(1180px, 90%);
  height: 1px;
  content: '';
  transform: translateX(-50%);
  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(244, 196, 48, 0.45),
      transparent
    );
}

.virtual-classroom__glow {
  position: absolute;
  top: 50%;
  right: -150px;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  pointer-events: none;
  background: rgba(244, 196, 48, 0.055);
  filter: blur(110px);
  transform: translateY(-50%);
}

.virtual-classroom__container {
  position: relative;
  z-index: 2;
  display: grid;
  width: min(1180px, 100%);
  gap: 70px;
  align-items: center;
  margin: 0 auto;
}

.section-eyebrow {
  display: inline-block;
  margin-bottom: 15px;
  color: variables.$color-primary;
  font-size: 0.55rem;
  font-weight: 900;
  letter-spacing: 0.18em;
}

.virtual-classroom h2 {
  max-width: 760px;
  margin: 0;
  color: #f2f2f2;
  font-size:
    clamp(
      2.8rem,
      4.8vw,
      4.6rem
    );
  line-height: 0.95;
  letter-spacing: -0.055em;
}

.virtual-classroom h2 span {
  display: block;
  color: variables.$color-primary;
}

.virtual-classroom__lead {
  max-width: 640px;
  margin: 22px 0 28px;
  color: #aaa;
  font-size: 0.9rem;
  line-height: 1.7;
}

.virtual-classroom__features {
  display: grid;
  gap: 10px;
  margin-bottom: 28px;
}

.feature {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 14px 16px;
  border: 1px solid #252525;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.02);
  transition:
    border-color 0.22s ease,
    transform 0.22s ease,
    background 0.22s ease;
}

.feature:hover {
  border-color:
    rgba(244, 196, 48, 0.32);
  background:
    rgba(244, 196, 48, 0.025);
  transform: translateX(3px);
}

.feature__number {
  color: variables.$color-primary;
  font-size: 0.48rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.feature strong {
  display: block;
  margin-bottom: 4px;
  color: #ddd;
  font-size: 0.78rem;
}

.feature p {
  margin: 0;
  color: #737373;
  font-size: 0.64rem;
  line-height: 1.5;
}

.aula-button {
  display: inline-flex;
  min-width: 285px;
  gap: 14px;
  align-items: center;
  padding: 13px 17px;
  border-radius: 10px;
  color: #090909;
  text-decoration: none;
  background: variables.$color-primary;
  box-shadow:
    0 12px 30px
    rgba(244, 196, 48, 0.11);
  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.aula-button:hover {
  transform: translateY(-2px);
  box-shadow:
    0 17px 40px
    rgba(244, 196, 48, 0.18);
}

.aula-button__icon {
  display: grid;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: variables.$color-primary;
  background: #0a0a0a;
  font-size: 1rem;
}

.aula-button small {
  display: block;
  margin-bottom: 2px;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.aula-button > span:nth-child(2) {
  flex: 1;
  font-size: 0.72rem;
  font-weight: 900;
}

.aula-button__arrow {
  font-size: 1.1rem;
}

.portal-card {
  position: relative;
  overflow: hidden;
  border: 1px solid #292929;
  border-radius: 18px;
  background: #111;
  box-shadow:
    0 35px 80px
    rgba(0, 0, 0, 0.48);
  transform:
    perspective(1000px)
    rotateY(-3deg);
}

.portal-card::after {
  position: absolute;
  inset: 0;
  content: '';
  pointer-events: none;
  background:
    linear-gradient(
      125deg,
      transparent 30%,
      rgba(255, 255, 255, 0.025),
      transparent 65%
    );
}

.portal-card__top {
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 12px 15px;
  border-bottom: 1px solid #222;
}

.portal-card__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #424242;
}

.portal-card__label {
  margin-left: auto;
  color: #626262;
  font-size: 0.48rem;
  font-weight: 800;
  letter-spacing: 0.14em;
}

.portal-card__body {
  padding: 42px 34px 34px;
}

.portal-card__brand {
  display: grid;
  width: 54px;
  height: 54px;
  margin-bottom: 20px;
  place-items: center;
  border-radius: 14px;
  color: #080808;
  background: variables.$color-primary;
  font-size: 0.72rem;
  font-weight: 950;
}

.portal-card__body > p {
  margin: 0 0 7px;
  color: #727272;
  font-size: 0.56rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.portal-card h3 {
  margin: 0;
  color: #eee;
  font-size:
    clamp(
      2.8rem,
      4vw,
      4rem
    );
  line-height: 0.9;
  letter-spacing: -0.055em;
}

.portal-card h3 span {
  display: block;
  color: variables.$color-primary;
}

.portal-card__line {
  height: 1px;
  margin: 30px 0 20px;
  background: #292929;
}

.portal-card__stats {
  display: grid;
  grid-template-columns:
    repeat(3, 1fr);
  gap: 10px;
}

.portal-card__stats strong,
.portal-card__stats small {
  display: block;
}

.portal-card__stats strong {
  margin-bottom: 3px;
  color: #ccc;
  font-size: 0.64rem;
}

.portal-card__stats small {
  color: #626262;
  font-size: 0.53rem;
}

@media (min-width: 900px) {
  .virtual-classroom__container {
    grid-template-columns:
      1.05fr
      0.95fr;
  }
}

@media (max-width: 900px) {
  .virtual-classroom {
    padding: 82px 20px;
  }

  .virtual-classroom__container {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .portal-card {
    max-width: 620px;
    margin: 0 auto;
    transform: none;
  }
}

@media (max-width: 600px) {
  .virtual-classroom {
    padding:
      70px
      18px;
  }

  .virtual-classroom h2 {
    font-size:
      clamp(
        2.45rem,
        11vw,
        3.5rem
      );
  }

  .aula-button {
    width: 100%;
    min-width: 0;
  }

  .portal-card__body {
    padding:
      34px
      23px
      27px;
  }

  .portal-card__stats {
    grid-template-columns: 1fr;
    gap: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .feature,
  .aula-button {
    transition: none;
  }
}
</style>
