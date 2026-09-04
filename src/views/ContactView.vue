<template>
  <main class="contact-page">
    <!-- =====================================================
         HERO
    ====================================================== -->

    <section class="hero">
      <div class="hero__grid"></div>
      <div class="hero__glow"></div>

      <div class="container hero__layout">
        <!-- =================================================
             TEXTO
        ================================================== -->

        <div class="hero__content">
          <p class="eyebrow">
            CONTACTO · AMO MI VOZ
          </p>

          <h1>
            Hablemos.
            <span>Estamos para ayudarte.</span>
          </h1>

          <p class="hero__lead">
            ¿Quieres inscribirte, conocer nuestras clases
            o conversar sobre un proyecto artístico?
            Elige el canal que te resulte más cómodo.
          </p>

          <div class="hero__actions">
            <a
              :href="whatsappUrl"
              class="button button--primary"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                :src="whatsappIcon"
                alt=""
                aria-hidden="true"
              />

              Hablar por WhatsApp
            </a>

            <RouterLink
              to="/inscripcion"
              class="button button--secondary"
            >
              Quiero inscribirme
              <span aria-hidden="true">→</span>
            </RouterLink>
          </div>

          <div class="hero__quick-info">
            <div>
              <small>
                UBICACIÓN
              </small>

              <strong>
                La Calera
              </strong>
            </div>

            <div>
              <small>
                REGIÓN
              </small>

              <strong>
                Valparaíso
              </strong>
            </div>

            <div>
              <small>
                ATENCIÓN
              </small>

              <strong>
                Canales oficiales
              </strong>
            </div>
          </div>
        </div>

        <!-- =================================================
             TARJETA INSTITUCIONAL
        ================================================== -->

        <aside class="academy-card">
          <div class="academy-card__top">
            <span class="status-dot"></span>
            CANAL OFICIAL
          </div>

          <div class="academy-card__brand">
            <div class="academy-card__logo">
              <img
                :src="logo"
                alt="Academia de Talentos Amo Mi Voz"
              />
            </div>

            <div>
              <small>
                ACADEMIA DE TALENTOS
              </small>

              <strong>
                Amo Mi Voz
              </strong>

              <span>
                La Calera · Chile
              </span>
            </div>
          </div>

          <div class="academy-card__divider"></div>

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="academy-card__contact"
          >
            <img
              :src="whatsappIcon"
              alt=""
              aria-hidden="true"
            />

            <div>
              <small>
                WHATSAPP
              </small>

              <strong>
                {{ academy.phoneDisplay }}
              </strong>
            </div>

            <span aria-hidden="true">
              ↗
            </span>
          </a>

          <a
            :href="`mailto:${academy.email}`"
            class="academy-card__contact"
          >
            <img
              :src="gmailIcon"
              alt=""
              aria-hidden="true"
            />

            <div>
              <small>
                CORREO
              </small>

              <strong>
                {{ academy.email }}
              </strong>
            </div>

            <span aria-hidden="true">
              ↗
            </span>
          </a>
        </aside>
      </div>
    </section>

    <!-- =====================================================
         CANALES
    ====================================================== -->

    <section class="channels">
      <div class="container">
        <header class="section-header">
          <div>
            <p class="eyebrow">
              CONTACTO DIRECTO
            </p>

            <h2>
              Elige tu canal.
            </h2>
          </div>

          <p>
            Accede directamente a nuestros medios
            oficiales sin formularios innecesarios.
          </p>
        </header>

        <div class="channels__grid">
          <!-- ===============================================
               WHATSAPP
          ================================================ -->

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-card"
          >
            <div class="channel-card__head">
              <div class="channel-card__icon">
                <img
                  :src="whatsappIcon"
                  alt="WhatsApp"
                />
              </div>

              <span>
                01
              </span>
            </div>

            <div class="channel-card__body">
              <small>
                CONTACTO RÁPIDO
              </small>

              <h3>
                WhatsApp
              </h3>

              <p>
                Para consultas sobre clases,
                inscripciones y actividades.
              </p>
            </div>

            <div class="channel-card__footer">
              <strong>
                {{ academy.phoneDisplay }}
              </strong>

              <span aria-hidden="true">
                ↗
              </span>
            </div>
          </a>

          <!-- ===============================================
               EMAIL
          ================================================ -->

          <a
            :href="`mailto:${academy.email}`"
            class="channel-card"
          >
            <div class="channel-card__head">
              <div class="channel-card__icon">
                <img
                  :src="gmailIcon"
                  alt="Gmail"
                />
              </div>

              <span>
                02
              </span>
            </div>

            <div class="channel-card__body">
              <small>
                CORREO INSTITUCIONAL
              </small>

              <h3>
                Email
              </h3>

              <p>
                Para proyectos, documentos,
                colaboraciones y consultas formales.
              </p>
            </div>

            <div class="channel-card__footer">
              <strong class="channel-card__email">
                {{ academy.email }}
              </strong>

              <span aria-hidden="true">
                ↗
              </span>
            </div>
          </a>

          <!-- ===============================================
               INSTAGRAM
          ================================================ -->

          <a
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-card"
          >
            <div class="channel-card__head">
              <div class="channel-card__icon">
                <img
                  :src="instagramIcon"
                  alt="Instagram"
                />
              </div>

              <span>
                03
              </span>
            </div>

            <div class="channel-card__body">
              <small>
                REDES SOCIALES
              </small>

              <h3>
                Instagram
              </h3>

              <p>
                Presentaciones, estudiantes,
                actividades y novedades.
              </p>
            </div>

            <div class="channel-card__footer">
              <strong>
                @{{ academy.instagram }}
              </strong>

              <span aria-hidden="true">
                ↗
              </span>
            </div>
          </a>

          <!-- ===============================================
               FACEBOOK
          ================================================ -->

          <a
            :href="facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="channel-card"
          >
            <div class="channel-card__head">
              <div class="channel-card__icon">
                <img
                  :src="facebookIcon"
                  alt="Facebook"
                />
              </div>

              <span>
                04
              </span>
            </div>

            <div class="channel-card__body">
              <small>
                COMUNIDAD
              </small>

              <h3>
                Facebook
              </h3>

              <p>
                Sigue nuestras publicaciones,
                proyectos y actividades artísticas.
              </p>
            </div>

            <div class="channel-card__footer">
              <strong>
                Amo Mi Voz
              </strong>

              <span aria-hidden="true">
                ↗
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- =====================================================
         UBICACIÓN
    ====================================================== -->

    <section class="location">
      <div class="container location__layout">
        <div class="location__content">
          <p class="eyebrow">
            DÓNDE ESTAMOS
          </p>

          <h2>
            Academia de Talentos
            <span>Amo Mi Voz</span>
          </h2>

          <p>
            Desarrollamos nuestras actividades en
            La Calera, Región de Valparaíso, Chile.
          </p>
        </div>

        <div class="location__actions">
          <div class="location__address">
            <small>
              UBICACIÓN
            </small>

            <strong>
              La Calera
            </strong>

            <span>
              Región de Valparaíso · Chile
            </span>
          </div>

          <a
            :href="mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="button button--secondary"
          >
            Abrir Google Maps
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CTA FINAL
    ====================================================== -->

    <section class="final-cta">
      <div class="container final-cta__content">
        <div>
          <p class="eyebrow">
            ¿QUIERES SER PARTE?
          </p>

          <h2>
            Da el primer paso.
          </h2>

          <p>
            Conoce nuestra academia y envía
            tu solicitud de inscripción.
          </p>
        </div>

        <div class="final-cta__actions">
          <RouterLink
            to="/inscripcion"
            class="button button--primary"
          >
            Inscribirme
            <span aria-hidden="true">→</span>
          </RouterLink>

          <a
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="button button--secondary"
          >
            Tengo una consulta
          </a>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import {
  RouterLink,
} from 'vue-router'

import logo
  from '@/assets/images/logo.png'

import whatsappIcon
  from '@/assets/images/whatsapp.png'

import gmailIcon
  from '@/assets/images/gmail.png'

import instagramIcon
  from '@/assets/images/instagram.png'

import facebookIcon
  from '@/assets/images/facebook.png'

/* =========================================================
   DATOS
========================================================= */

const academy = {
  phone:
    '+56959762385',

  phoneDisplay:
    '+56 9 5976 2385',

  email:
    'academiadetalentosamomivoz@gmail.com',

  instagram:
    'amomivoz_academia',

  facebook:
    'Academia de Talento Musical "AMO MI VOZ"',

  location:
    'La Calera, Región de Valparaíso, Chile',
}

/* =========================================================
   WHATSAPP
========================================================= */

const whatsappMessage =
  'Hola, me gustaría recibir información sobre la Academia de Talentos Amo Mi Voz.'

const whatsappUrl =
  `https://wa.me/${academy.phone.replace(/\D/g, '')}` +
  `?text=${encodeURIComponent(whatsappMessage)}`

/* =========================================================
   REDES
========================================================= */

const instagramUrl =
  `https://www.instagram.com/${academy.instagram}/`

const facebookUrl =
  `https://www.facebook.com/search/top/?q=${encodeURIComponent(
    academy.facebook,
  )}`

/* =========================================================
   MAPA
========================================================= */

const mapsUrl =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    academy.location,
  )}`
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   BASE
========================================================= */

.contact-page {
  --page-bg: #080808;
  --surface: #0e0e0e;
  --surface-hover: #121212;
  --border: #292929;
  --border-gold: rgba(212, 175, 55, 0.3);
  --muted: #8b8b8b;

  min-height: 100vh;
  overflow: hidden;
  color: #f5f5f5;
  background: var(--page-bg);
}

.container {
  width: min(1180px, calc(100% - 48px));
  margin: 0 auto;
}

.eyebrow {
  margin: 0;
  color: variables.$color-primary;
  font-size: 0.72rem;
  font-weight: 900;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

/* =========================================================
   BOTONES
========================================================= */

.button {
  min-height: 54px;
  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 0 22px;
  border-radius: 12px;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
}

.button--primary {
  border:
    1px solid
    variables.$color-primary;
  background:
    variables.$color-primary;
  color: #090909;
}

.button--primary:hover {
  box-shadow:
    0 18px 45px
    rgba(212, 175, 55, 0.14);
}

.button--primary img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.button--secondary {
  border:
    1px solid
    #353535;
  background: transparent;
  color: #eee;
}

.button--secondary:hover {
  border-color:
    variables.$color-primary;
}

/* =========================================================
   HERO
========================================================= */

.hero {
  position: relative;
  overflow: hidden;
  padding:
    clamp(130px, 15vw, 180px)
    0
    clamp(80px, 10vw, 120px);
  background: #090909;
}

.hero__grid {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.45;
  background-image:
    linear-gradient(
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.018) 1px,
      transparent 1px
    );
  background-size: 72px 72px;
  mask-image:
    linear-gradient(
      to bottom,
      black,
      transparent
    );
}

.hero__glow {
  position: absolute;
  top: -280px;
  right: -180px;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  pointer-events: none;
  background:
    rgba(212, 175, 55, 0.08);
  filter: blur(160px);
}

.hero__layout {
  position: relative;
  z-index: 2;
  display: grid;
  gap: 70px;
  align-items: center;
  grid-template-columns:
    minmax(0, 1.15fr)
    minmax(340px, 0.85fr);
}

.hero h1 {
  max-width: 820px;
  margin: 22px 0 0;
  font-size:
    clamp(
      4rem,
      7vw,
      7rem
    );
  line-height: 0.91;
  letter-spacing: -0.065em;
}

.hero h1 span {
  display: block;
  color:
    variables.$color-primary;
}

.hero__lead {
  max-width: 620px;
  margin: 28px 0 0;
  color: var(--muted);
  font-size: 1.02rem;
  line-height: 1.75;
}

.hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 32px;
}

.hero__quick-info {
  display: grid;
  gap: 1px;
  overflow: hidden;
  grid-template-columns:
    repeat(3, 1fr);
  margin-top: 40px;
  border:
    1px solid
    var(--border);
  border-radius: 14px;
  background:
    var(--border);
}

.hero__quick-info > div {
  padding: 17px;
  background: #0c0c0c;
}

.hero__quick-info small,
.hero__quick-info strong {
  display: block;
}

.hero__quick-info small {
  margin-bottom: 6px;
  color: #666;
  font-size: 0.59rem;
  font-weight: 800;
  letter-spacing: 0.11em;
}

.hero__quick-info strong {
  font-size: 0.83rem;
}

/* =========================================================
   TARJETA ACADEMIA
========================================================= */

.academy-card {
  padding: 30px;
  border:
    1px solid
    var(--border-gold);
  border-radius: 24px;
  background:
    linear-gradient(
      145deg,
      rgba(212, 175, 55, 0.055),
      transparent 55%
    ),
    var(--surface);
  box-shadow:
    0 35px 90px
    rgba(0, 0, 0, 0.4);
}

.academy-card__top {
  display: flex;
  gap: 9px;
  align-items: center;
  color: #777;
  font-size: 0.59rem;
  font-weight: 800;
  letter-spacing: 0.13em;
}

.status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background:
    variables.$color-primary;
  box-shadow:
    0 0 13px
    rgba(212, 175, 55, 0.7);
}

.academy-card__brand {
  display: flex;
  gap: 18px;
  align-items: center;
  margin-top: 27px;
}

.academy-card__logo {
  width: 90px;
  height: 90px;
  display: grid;
  flex: 0 0 auto;
  place-items: center;
  border:
    1px solid
    var(--border-gold);
  border-radius: 20px;
  background: #0a0a0a;
}

.academy-card__logo img {
  max-width: 75px;
  max-height: 75px;
  object-fit: contain;
}

.academy-card__brand small,
.academy-card__brand strong,
.academy-card__brand span {
  display: block;
}

.academy-card__brand small {
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 850;
  letter-spacing: 0.12em;
}

.academy-card__brand strong {
  margin-top: 5px;
  font-size: 1.35rem;
}

.academy-card__brand span {
  margin-top: 5px;
  color: #777;
  font-size: 0.78rem;
}

.academy-card__divider {
  height: 1px;
  margin: 26px 0 14px;
  background:
    var(--border);
}

.academy-card__contact {
  display: grid;
  gap: 14px;
  align-items: center;
  grid-template-columns:
    auto
    minmax(0, 1fr)
    auto;
  padding: 14px 0;
  color: inherit;
  text-decoration: none;
  transition:
    color 0.2s ease;
}

.academy-card__contact +
.academy-card__contact {
  border-top:
    1px solid
    var(--border);
}

.academy-card__contact:hover {
  color:
    variables.$color-primary;
}

.academy-card__contact img {
  width: 37px;
  height: 37px;
  object-fit: contain;
}

.academy-card__contact small,
.academy-card__contact strong {
  display: block;
}

.academy-card__contact small {
  margin-bottom: 4px;
  color: #666;
  font-size: 0.55rem;
  font-weight: 850;
  letter-spacing: 0.1em;
}

.academy-card__contact strong {
  overflow-wrap: anywhere;
  font-size: 0.78rem;
}

/* =========================================================
   CHANNELS
========================================================= */

.channels {
  padding:
    clamp(80px, 10vw, 125px)
    0;
}

.section-header {
  display: flex;
  gap: 40px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 45px;
}

.section-header h2 {
  margin: 12px 0 0;
  font-size:
    clamp(
      2.8rem,
      5vw,
      4.8rem
    );
  line-height: 1;
  letter-spacing: -0.055em;
}

.section-header > p {
  max-width: 380px;
  margin: 0;
  color: var(--muted);
  line-height: 1.65;
}

.channels__grid {
  display: grid;
  gap: 14px;
  grid-template-columns:
    repeat(
      4,
      minmax(0, 1fr)
    );
}

.channel-card {
  min-height: 330px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border:
    1px solid
    var(--border);
  border-radius: 18px;
  background:
    var(--surface);
  color: #f5f5f5;
  text-decoration: none;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.channel-card:hover {
  transform:
    translateY(-5px);
  border-color:
    var(--border-gold);
  background:
    var(--surface-hover);
  box-shadow:
    0 25px 60px
    rgba(0, 0, 0, 0.28);
}

.channel-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.channel-card__head > span {
  color:
    variables.$color-primary;
  font-size: 0.6rem;
  font-weight: 900;
}

.channel-card__icon {
  width: 58px;
  height: 58px;
  display: grid;
  place-items: center;
  border:
    1px solid
    var(--border);
  border-radius: 16px;
  background: #fff;
  transition:
    transform 0.22s ease;
}

.channel-card:hover
.channel-card__icon {
  transform:
    scale(1.05);
}

.channel-card__icon img {
  width: 44px;
  height: 44px;
  object-fit: contain;
}

.channel-card__body {
  margin-top: 29px;
}

.channel-card__body small {
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.channel-card__body h3 {
  margin: 9px 0 10px;
  font-size: 1.5rem;
}

.channel-card__body p {
  margin: 0;
  color: var(--muted);
  font-size: 0.82rem;
  line-height: 1.65;
}

.channel-card__footer {
  display: flex;
  gap: 15px;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 20px;
  border-top:
    1px solid
    var(--border);
}

.channel-card__footer strong {
  min-width: 0;
  overflow-wrap: anywhere;
  font-size: 0.77rem;
}

.channel-card__footer > span {
  flex: 0 0 auto;
  color:
    variables.$color-primary;
  font-weight: 900;
}

.channel-card__email {
  font-size: 0.68rem !important;
}

/* =========================================================
   LOCATION
========================================================= */

.location {
  padding:
    clamp(75px, 9vw, 105px)
    0;
  border-top:
    1px solid
    var(--border);
  border-bottom:
    1px solid
    var(--border);
  background: #0b0b0b;
}

.location__layout {
  display: grid;
  gap: 60px;
  align-items: center;
  grid-template-columns:
    minmax(0, 1fr)
    auto;
}

.location h2 {
  margin: 13px 0 0;
  font-size:
    clamp(
      2.5rem,
      5vw,
      4.3rem
    );
  line-height: 1;
  letter-spacing: -0.05em;
}

.location h2 span {
  display: block;
  color:
    variables.$color-primary;
}

.location__content > p:last-child {
  max-width: 560px;
  margin: 20px 0 0;
  color: var(--muted);
  line-height: 1.7;
}

.location__actions {
  min-width: 300px;
}

.location__address {
  margin-bottom: 20px;
}

.location__address small,
.location__address strong,
.location__address span {
  display: block;
}

.location__address small {
  color:
    variables.$color-primary;
  font-size: 0.58rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.location__address strong {
  margin-top: 8px;
  font-size: 1.4rem;
}

.location__address span {
  margin-top: 5px;
  color: var(--muted);
  font-size: 0.82rem;
}

/* =========================================================
   FINAL CTA
========================================================= */

.final-cta {
  padding:
    clamp(80px, 10vw, 120px)
    0;
}

.final-cta__content {
  display: flex;
  gap: 50px;
  align-items: flex-end;
  justify-content: space-between;
  padding: 45px;
  border:
    1px solid
    var(--border-gold);
  border-radius: 24px;
  background:
    radial-gradient(
      circle at 85% 15%,
      rgba(212, 175, 55, 0.1),
      transparent 40%
    ),
    var(--surface);
}

.final-cta h2 {
  margin: 10px 0 0;
  font-size:
    clamp(
      2.5rem,
      5vw,
      4rem
    );
  letter-spacing: -0.05em;
}

.final-cta p:last-child {
  max-width: 500px;
  margin: 13px 0 0;
  color: var(--muted);
  line-height: 1.65;
}

.final-cta__actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* =========================================================
   TABLET
========================================================= */

@media (
  max-width: 1050px
) {
  .hero__layout {
    grid-template-columns: 1fr;
  }

  .academy-card {
    max-width: 620px;
  }

  .channels__grid {
    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (
  max-width: 720px
) {
  .container {
    width:
      min(
        100% - 30px,
        1180px
      );
  }

  .hero {
    padding-top: 115px;
  }

  .hero h1 {
    font-size:
      clamp(
        3.2rem,
        15vw,
        5rem
      );
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__actions .button {
    width: 100%;
  }

  .hero__quick-info {
    grid-template-columns: 1fr;
  }

  .academy-card {
    padding: 22px;
  }

  .academy-card__brand {
    align-items: flex-start;
  }

  .academy-card__logo {
    width: 72px;
    height: 72px;
  }

  .academy-card__logo img {
    max-width: 60px;
    max-height: 60px;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .channels__grid {
    grid-template-columns: 1fr;
  }

  .channel-card {
    min-height: 290px;
  }

  .location__layout {
    grid-template-columns: 1fr;
  }

  .location__actions {
    min-width: 0;
  }

  .location__actions .button {
    width: 100%;
  }

  .final-cta__content {
    align-items: flex-start;
    flex-direction: column;
    padding: 27px;
  }

  .final-cta__actions {
    width: 100%;
    flex-direction: column;
  }

  .final-cta__actions .button {
    width: 100%;
  }
}

/* =========================================================
   ACCESIBILIDAD
========================================================= */

@media (
  prefers-reduced-motion:
  reduce
) {
  .contact-page *,
  .contact-page *::before,
  .contact-page *::after {
    animation-duration:
      0.01ms !important;
    animation-iteration-count:
      1 !important;
    transition-duration:
      0.01ms !important;
  }
}
</style>
