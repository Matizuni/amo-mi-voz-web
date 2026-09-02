<template>
  <section class="experiences">
    <div class="experiences__container">

      <div class="section-heading">
        <span class="section-eyebrow">
          EXPERIENCIAS REALES
        </span>

        <h2>
          Aprender música también es
          <span>vivir el escenario.</span>
        </h2>

        <p>
          En Amo Mi Voz entendemos la formación artística como una
          experiencia completa: aprender, ensayar, compartir y finalmente
          presentar el trabajo frente al público.
        </p>
      </div>

      <div class="experiences__grid">

        <article class="experience-card">
          <div class="experience-card__image">
            <img
              :src="conciertoImage"
              alt="Concierto de alumnos de la Academia de Talentos Amo Mi Voz"
              loading="lazy"
            />

            <div
              class="experience-card__overlay"
              aria-hidden="true"
            ></div>

            <span class="experience-card__tag">
              CONCIERTOS
            </span>
          </div>

          <div class="experience-card__content">
            <span class="experience-card__category">
              EXPERIENCIA ESCÉNICA
            </span>

            <h3>
              Conciertos de alumnos
            </h3>

            <p>
              Creamos instancias donde nuestros estudiantes pueden llevar
              al escenario lo aprendido durante su proceso de formación.
            </p>

            <div class="experience-card__footer">
              <span>La Calera</span>
              <span aria-hidden="true">•</span>
              <span>Amo Mi Voz</span>
            </div>
          </div>
        </article>

        <article class="experience-card experience-card--featured">
          <div class="experience-card__image">
            <img
              :src="cocoImage"
              alt="Presentación musical inspirada en COCO de la Academia de Talentos Amo Mi Voz"
              loading="lazy"
            />

            <div
              class="experience-card__overlay"
              aria-hidden="true"
            ></div>

            <span class="experience-card__tag">
              MUSICALES
            </span>
          </div>

          <div class="experience-card__content">
            <span class="experience-card__category">
              PRODUCCIÓN ARTÍSTICA
            </span>

            <h3>
              Musicales y grandes experiencias
            </h3>

            <p>
              Música, interpretación y puesta en escena se unen en
              producciones que permiten a los estudiantes vivir una
              experiencia artística integral.
            </p>

            <div class="experience-card__footer">
              <span>Presentaciones</span>
              <span aria-hidden="true">•</span>
              <span>Comunidad</span>
            </div>
          </div>
        </article>

      </div>

      <div class="experiences__statement">
        <span
          class="experiences__statement-line"
          aria-hidden="true"
        ></span>

        <p>
          No formamos solamente voces.
          <strong>
            Formamos artistas capaces de vivir la música.
          </strong>
        </p>

        <span
          class="experiences__statement-line"
          aria-hidden="true"
        ></span>
      </div>

    </div>
  </section>
</template>

<script setup>
import conciertoImage from '@/assets/images/concierto-alumnos.png'
import cocoImage from '@/assets/images/musical-coco.png'
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

.experiences {
  position: relative;
  padding: 100px 24px;
  background:
    radial-gradient(
      circle at 15% 20%,
      rgba(244, 196, 48, 0.035),
      transparent 28%
    ),
    #090909;
}

.experiences::before {
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
      rgba(244, 196, 48, 0.24),
      transparent
    );
}

.experiences__container {
  position: relative;
  z-index: 2;
  width: min(1180px, 100%);
  margin: 0 auto;
}

.section-eyebrow {
  display: inline-block;
  margin-bottom: 16px;
  color: variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.19em;
  text-transform: uppercase;
}

.section-heading {
  display: grid;
  max-width: 820px;
  margin-bottom: 48px;
}

.experiences h2 {
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

.experiences h2 span {
  display: block;
  color: variables.$color-primary;
}

.section-heading > p {
  max-width: 650px;
  margin: 22px 0 0;
  color: #8c8c8c;
  font-size: 0.9rem;
  line-height: 1.72;
}

.experiences__grid {
  display: grid;
  gap: 16px;
}

.experience-card {
  overflow: hidden;
  border: 1px solid #252525;
  border-radius: 16px;
  background: #101010;
  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.experience-card:hover {
  transform: translateY(-4px);
  border-color: rgba(244, 196, 48, 0.3);
  box-shadow:
    0 22px 50px
    rgba(0, 0, 0, 0.26);
}

.experience-card__image {
  position: relative;
  height: 390px;
  overflow: hidden;
  background: #151515;
}

.experience-card__image img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.experience-card:hover img {
  transform: scale(1.025);
}

.experience-card__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    linear-gradient(
      180deg,
      rgba(0, 0, 0, 0.02) 35%,
      rgba(0, 0, 0, 0.75) 100%
    );
}

.experience-card__tag {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 7px 10px;
  border-radius: 999px;
  color: #080808;
  background: variables.$color-primary;
  font-size: 0.52rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.experience-card__content {
  padding: 24px;
}

.experience-card__category {
  color: variables.$color-primary;
  font-size: 0.51rem;
  font-weight: 900;
  letter-spacing: 0.17em;
}

.experience-card h3 {
  margin: 9px 0 11px;
  color: #e8e8e8;
  font-size: 1.4rem;
  line-height: 1.12;
  letter-spacing: -0.03em;
}

.experience-card p {
  max-width: 540px;
  margin: 0;
  color: #797979;
  font-size: 0.72rem;
  line-height: 1.62;
}

.experience-card__footer {
  display: flex;
  gap: 8px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #242424;
  color: #606060;
  font-size: 0.58rem;
  font-weight: 700;
}

.experiences__statement {
  display: flex;
  gap: 22px;
  align-items: center;
  margin-top: 42px;
}

.experiences__statement-line {
  flex: 1;
  height: 1px;
  background:
    linear-gradient(
      90deg,
      transparent,
      #2b2b2b
    );
}

.experiences__statement-line:last-child {
  background:
    linear-gradient(
      90deg,
      #2b2b2b,
      transparent
    );
}

.experiences__statement p {
  max-width: 590px;
  margin: 0;
  color: #666;
  text-align: center;
  font-size: 0.72rem;
  line-height: 1.55;
}

.experiences__statement strong {
  display: block;
  margin-top: 3px;
  color: #d7d7d7;
}

@media (min-width: 800px) {
  .experiences__grid {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .experiences {
    padding: 82px 20px;
  }

  .experience-card__image {
    height: 470px;
  }
}

@media (max-width: 600px) {
  .experiences {
    padding: 70px 18px;
  }

  .experiences h2 {
    font-size:
      clamp(
        2.45rem,
        11vw,
        3.5rem
      );
  }

  .section-heading {
    margin-bottom: 34px;
  }

  .experience-card__image {
    height: 370px;
  }

  .experience-card__content {
    padding: 20px;
  }

  .experiences__statement {
    margin-top: 32px;
  }

  .experiences__statement-line {
    display: none;
  }
}

@media (max-width: 400px) {
  .experience-card__image {
    height: 330px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .experience-card,
  .experience-card__image img {
    transition: none;
  }
}
</style>
