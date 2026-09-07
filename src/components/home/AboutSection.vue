<template>
  <section class="about">
    <!-- =====================================================
         CABECERA EDITORIAL
    ====================================================== -->
    <div class="container about__intro">
      <div class="about__intro-copy">
        <span class="about__eyebrow">
          NUESTRA ACADEMIA
        </span>

        <h2>
          Aprender música es
          <strong>mucho más que cantar.</strong>
        </h2>
      </div>

      <div class="about__intro-text">
        <p>
          En Amo Mi Voz desarrollamos un proceso donde cada
          estudiante aprende a conocer su voz, comprender la
          música y desenvolverse con mayor seguridad.
        </p>

        <p>
          Técnica vocal, entrenamiento auditivo, teoría musical,
          interpretación y experiencia escénica se conectan
          constantemente con el repertorio, los ensayos y las
          presentaciones.
        </p>
      </div>
    </div>

    <!-- =====================================================
         HISTORIA + PROCESO
    ====================================================== -->
    <div class="container about__experience">
      <!-- VISUAL -->
      <div class="about__visual">
        <figure class="about__image-frame">
          <img
            :src="studentImage"
            alt="Estudiante de la Academia de Talentos Amo Mi Voz"
            class="about__image"
            loading="lazy"
          />

          <div
            class="about__image-gradient"
            aria-hidden="true"
          ></div>

          <div class="about__visual-status">
            <span></span>
            FORMACIÓN EN ACCIÓN
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

        <div class="about__areas">
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

      <!-- PROCESO -->
      <div class="about__process">
        <header class="about__process-header">
          <span>
            NUESTRO PROCESO
          </span>

          <h3>
            Un recorrido claro,
            <strong>personal y progresivo.</strong>
          </h3>

          <p>
            No buscamos que todos avancen de la misma forma.
            Cada estudiante recorre etapas que conectan técnica,
            comprensión musical, repertorio y experiencia escénica.
          </p>
        </header>

        <div class="about__journey">
          <article
            v-for="step in journey"
            :key="step.number"
            class="about__journey-step"
          >
            <div class="about__journey-number">
              {{ step.number }}
            </div>

            <div class="about__journey-copy">
              <small>{{ step.label }}</small>
              <h4>{{ step.title }}</h4>
              <p>{{ step.description }}</p>
            </div>

            <span
              class="about__journey-arrow"
              aria-hidden="true"
            >
              →
            </span>
          </article>
        </div>
      </div>
    </div>

    <!-- =====================================================
         APOYO DIGITAL
    ====================================================== -->
    <div class="container about__digital">
      <div class="about__digital-copy">
        <span class="about__digital-eyebrow">
          FORMACIÓN PRESENCIAL + APOYO DIGITAL
        </span>

        <h3>
          El aprendizaje
          <strong>continúa fuera de la sala.</strong>
        </h3>

        <p>
          Materiales, repertorio, tareas y seguimiento también
          forman parte del proceso. Nuestra Aula Virtual acompaña
          al estudiante antes, durante y después de cada clase.
        </p>

        <div class="about__digital-features">
          <span>Materiales</span>
          <span>Repertorio</span>
          <span>Tareas</span>
          <span>Progreso</span>
        </div>
      </div>

      <div class="about__digital-panel">
        <div class="about__digital-icon">
          ♪
        </div>

        <div>
          <small>AULA VIRTUAL AMO MI VOZ</small>
          <strong>Tu proceso, en un solo lugar.</strong>
        </div>

        <RouterLink
          to="/aula"
          class="about__digital-link"
          aria-label="Ir al Aula Virtual"
        >
          Entrar
          <span>→</span>
        </RouterLink>
      </div>
    </div>

    <!-- =====================================================
         CTA
    ====================================================== -->
    <div class="container about__actions">
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
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import studentImage from '@/assets/images/alumno-1.png'

const miniAreas = [
  {
    number: '01',
    title: 'Técnica vocal',
    description:
      'Respiración, apoyo, afinación y resonancia.'
  },
  {
    number: '02',
    title: 'Formación musical',
    description:
      'Ritmo, oído, lectura y comprensión.'
  },
  {
    number: '03',
    title: 'Interpretación',
    description:
      'Expresión, presencia y comunicación.'
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
/* =========================================================
   ABOUT V2 · EDITORIAL PREMIUM
========================================================= */

.about {
  --about-bg: #f4f6f9;
  --about-surface: #ffffff;
  --about-soft: #f8fafc;
  --about-ink: #152033;
  --about-copy: #344359;
  --about-muted: #6f7c8f;
  --about-line: #dbe3ec;
  --about-wine: #9f1945;
  --about-wine-dark: #761332;
  --about-wine-soft: #fff1f5;
  --about-gold: #d5a720;
  --about-gold-dark: #916b00;
  --about-green: #2d996b;

  position: relative;
  overflow: hidden;
  padding:
    110px
    24px
    105px;
  color: var(--about-ink);
  background:
    radial-gradient(
      circle at 94% 8%,
      rgba(159,25,69,.045),
      transparent 24%
    ),
    linear-gradient(
      180deg,
      #ffffff 0%,
      var(--about-bg) 100%
    );
}

.container {
  width: min(1180px, 100%);
  margin-inline: auto;
}

/* =========================================================
   INTRO
========================================================= */

.about__intro {
  display: grid;
  gap: 28px;
  align-items: end;
  margin-bottom: 48px;
}

.about__eyebrow {
  display: inline-block;
  margin-bottom: 14px;
  color: var(--about-gold-dark);
  font-size: .58rem;
  font-weight: 900;
  letter-spacing: .17em;
}

.about__intro h2 {
  max-width: 760px;
  margin: 0;
  color: var(--about-ink);
  font-size:
    clamp(
      3rem,
      5.2vw,
      5.2rem
    );
  font-weight: 850;
  line-height: .95;
  letter-spacing: -.06em;
}

.about__intro h2 strong {
  display: block;
  color: var(--about-wine);
  font-weight: inherit;
}

.about__intro-text {
  max-width: 560px;
}

.about__intro-text p {
  margin: 0;
  color: var(--about-copy);
  font-size: .92rem;
  line-height: 1.78;
}

.about__intro-text p + p {
  margin-top: 12px;
  color: var(--about-muted);
  font-size: .82rem;
}

/* =========================================================
   EXPERIENCE
========================================================= */

.about__experience {
  display: grid;
  gap: 38px;
  align-items: start;
}

.about__visual {
  min-width: 0;
}

.about__image-frame {
  position: relative;
  min-height: 620px;
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--about-line);
  border-radius: 24px;
  background: #dfe5ec;
  box-shadow:
    0 24px 55px
    rgba(31,48,73,.10);
}

.about__image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition:
    transform .65s ease;
}

.about__image-frame:hover .about__image {
  transform: scale(1.018);
}

.about__image-gradient {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      180deg,
      rgba(10,18,31,.02) 45%,
      rgba(10,18,31,.84) 100%
    );
}

.about__visual-status {
  position: absolute;
  top: 18px;
  left: 18px;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  padding: 8px 11px;
  border:
    1px solid
    rgba(255,255,255,.28);
  border-radius: 999px;
  color: #fff;
  background:
    rgba(17,28,49,.64);
  font-size: .43rem;
  font-weight: 900;
  letter-spacing: .12em;
  backdrop-filter: blur(10px);
}

.about__visual-status > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #46d18f;
  box-shadow:
    0 0 0 5px
    rgba(70,209,143,.11);
}

.about__image-caption {
  position: absolute;
  right: 24px;
  bottom: 25px;
  left: 24px;
}

.about__image-caption small {
  color: #f2c747;
  font-size: .45rem;
  font-weight: 900;
  letter-spacing: .13em;
}

.about__image-caption strong {
  display: block;
  max-width: 470px;
  margin-top: 8px;
  color: #fff;
  font-size:
    clamp(
      2rem,
      3.7vw,
      3rem
    );
  line-height: .98;
  letter-spacing: -.045em;
}

.about__image-caption strong em {
  display: block;
  color: #f2c747;
  font-style: normal;
}

/* =========================================================
   AREAS
========================================================= */

.about__areas {
  display: grid;
  gap: 10px;
  margin-top: 12px;
}

.about__areas article {
  display: flex;
  min-height: 86px;
  gap: 12px;
  align-items: flex-start;
  padding: 15px;
  border: 1px solid var(--about-line);
  border-radius: 14px;
  background: #fff;
  box-shadow:
    0 7px 20px
    rgba(31,48,73,.035);
}

.about__areas article > span {
  color: var(--about-gold-dark);
  font-size: .5rem;
  font-weight: 900;
}

.about__areas strong,
.about__areas small {
  display: block;
}

.about__areas strong {
  color: var(--about-ink);
  font-size: .72rem;
}

.about__areas small {
  margin-top: 5px;
  color: var(--about-muted);
  font-size: .59rem;
  line-height: 1.45;
}

/* =========================================================
   PROCESS
========================================================= */

.about__process {
  min-width: 0;
  padding-top: 8px;
}

.about__process-header > span {
  color: var(--about-gold-dark);
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .15em;
}

.about__process-header h3 {
  max-width: 620px;
  margin: 12px 0 0;
  color: var(--about-ink);
  font-size:
    clamp(
      2.2rem,
      4vw,
      3.8rem
    );
  line-height: .98;
  letter-spacing: -.05em;
}

.about__process-header h3 strong {
  display: block;
  color: var(--about-wine);
  font-weight: inherit;
}

.about__process-header p {
  max-width: 620px;
  margin: 18px 0 0;
  color: var(--about-muted);
  font-size: .81rem;
  line-height: 1.72;
}

/* =========================================================
   JOURNEY
========================================================= */

.about__journey {
  display: grid;
  gap: 10px;
  margin-top: 28px;
}

.about__journey-step {
  display: grid;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  gap: 14px;
  align-items: center;
  min-height: 112px;
  padding: 16px;
  border: 1px solid var(--about-line);
  border-radius: 15px;
  background: #fff;
  box-shadow:
    0 8px 22px
    rgba(31,48,73,.035);
  transition:
    transform .18s ease,
    border-color .18s ease,
    box-shadow .18s ease;
}

.about__journey-step:hover {
  transform:
    translateY(-2px);
  border-color: #c9d5e1;
  box-shadow:
    0 12px 28px
    rgba(31,48,73,.06);
}

.about__journey-number {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border: 1px solid #e5d38e;
  border-radius: 12px;
  color: var(--about-gold-dark);
  background: #fff9e9;
  font-size: .55rem;
  font-weight: 900;
}

.about__journey-copy small {
  color: var(--about-gold-dark);
  font-size: .42rem;
  font-weight: 900;
  letter-spacing: .11em;
}

.about__journey-copy h4 {
  margin: 4px 0 0;
  color: var(--about-ink);
  font-size: .82rem;
  line-height: 1.35;
}

.about__journey-copy p {
  margin: 6px 0 0;
  color: var(--about-muted);
  font-size: .63rem;
  line-height: 1.5;
}

.about__journey-arrow {
  color: var(--about-wine);
  font-size: .9rem;
}

/* =========================================================
   DIGITAL
========================================================= */

.about__digital {
  display: grid;
  gap: 22px;
  align-items: center;
  margin-top: 58px;
  padding: 28px;
  border:
    1px solid
    #e6dcae;
  border-radius: 20px;
  background:
    radial-gradient(
      circle at 94% 6%,
      rgba(213,167,32,.12),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      #fff,
      #fffaf0
    );
  box-shadow:
    0 12px 30px
    rgba(31,48,73,.05);
}

.about__digital-eyebrow {
  color: var(--about-gold-dark);
  font-size: .5rem;
  font-weight: 900;
  letter-spacing: .12em;
}

.about__digital-copy h3 {
  max-width: 620px;
  margin: 8px 0 0;
  color: var(--about-ink);
  font-size:
    clamp(
      1.8rem,
      3.4vw,
      3rem
    );
  line-height: 1;
  letter-spacing: -.045em;
}

.about__digital-copy h3 strong {
  display: block;
  color: var(--about-wine);
  font-weight: inherit;
}

.about__digital-copy p {
  max-width: 610px;
  margin: 14px 0 0;
  color: var(--about-muted);
  font-size: .75rem;
  line-height: 1.65;
}

.about__digital-features {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.about__digital-features span {
  padding: 7px 9px;
  border: 1px solid #e2e8ef;
  border-radius: 999px;
  color: #56657b;
  background: #fff;
  font-size: .56rem;
  font-weight: 800;
}

.about__digital-panel {
  display: grid;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  gap: 12px;
  align-items: center;
  padding: 16px;
  border:
    1px solid
    #dce4ed;
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 8px 22px
    rgba(31,48,73,.04);
}

.about__digital-icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 12px;
  color: #fff;
  background:
    linear-gradient(
      135deg,
      var(--about-wine),
      var(--about-wine-dark)
    );
}

.about__digital-panel small,
.about__digital-panel strong {
  display: block;
}

.about__digital-panel small {
  color: var(--about-gold-dark);
  font-size: .42rem;
  font-weight: 900;
  letter-spacing: .1em;
}

.about__digital-panel strong {
  margin-top: 4px;
  color: var(--about-ink);
  font-size: .72rem;
}

.about__digital-link {
  display: inline-flex;
  min-height: 40px;
  gap: 7px;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border: 1px solid var(--about-wine);
  border-radius: 10px;
  color: #fff;
  background: var(--about-wine);
  font-size: .62rem;
  font-weight: 900;
  text-decoration: none;
}

/* =========================================================
   ACTIONS
========================================================= */

.about__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 26px;
}

.about__button {
  display: inline-flex;
  min-height: 46px;
  gap: 9px;
  align-items: center;
  justify-content: center;
  padding: 0 17px;
  border-radius: 10px;
  font-size: .64rem;
  font-weight: 900;
  text-decoration: none;
  transition:
    transform .18s ease,
    border-color .18s ease,
    background .18s ease;
}

.about__button:hover {
  transform: translateY(-2px);
}

.about__button--primary {
  border: 1px solid var(--about-wine);
  color: #fff;
  background:
    linear-gradient(
      135deg,
      var(--about-wine),
      var(--about-wine-dark)
    );
}

.about__button--secondary {
  border: 1px solid var(--about-line);
  color: var(--about-copy);
  background: #fff;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .about__intro {
    grid-template-columns:
      minmax(0, 1.15fr)
      minmax(320px, .85fr);
  }

  .about__experience {
    grid-template-columns:
      minmax(0, .92fr)
      minmax(0, 1.08fr);
    gap: 54px;
  }

  .about__areas {
    grid-template-columns:
      repeat(3, 1fr);
  }

  .about__digital {
    grid-template-columns:
      minmax(0, 1.2fr)
      minmax(360px, .8fr);
  }
}

/* =========================================================
   TABLET / MOBILE
========================================================= */

@media (max-width: 899px) {
  .about {
    padding:
      88px
      20px
      82px;
  }

  .about__intro {
    margin-bottom: 38px;
  }

  .about__image-frame {
    min-height: 560px;
  }

  .about__process {
    padding-top: 0;
  }
}

@media (max-width: 700px) {
  .about {
    padding:
      72px
      16px
      68px;
  }

  .about__intro h2 {
    font-size:
      clamp(
        2.65rem,
        11vw,
        3.7rem
      );
  }

  .about__intro-text p {
    font-size: .86rem;
  }

  .about__image-frame {
    min-height: 480px;
    border-radius: 18px;
  }

  .about__image-caption strong {
    font-size: 2rem;
  }

  .about__areas {
    grid-template-columns: 1fr;
  }

  .about__journey-step {
    grid-template-columns:
      auto
      minmax(0,1fr);
  }

  .about__journey-arrow {
    display: none;
  }

  .about__digital {
    padding: 20px;
  }

  .about__digital-panel {
    grid-template-columns:
      auto
      minmax(0,1fr);
  }

  .about__digital-link {
    grid-column: 1 / -1;
    width: 100%;
    min-height: 46px;
  }

  .about__actions {
    flex-direction: column;
  }

  .about__button {
    width: 100%;
    min-height: 48px;
  }
}

@media (max-width: 480px) {
  .about__image-frame {
    min-height: 420px;
  }

  .about__image-caption {
    right: 18px;
    bottom: 20px;
    left: 18px;
  }

  .about__visual-status {
    top: 14px;
    left: 14px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .about *,
  .about *::before,
  .about *::after {
    transition: none !important;
    animation: none !important;
  }
}
</style>
