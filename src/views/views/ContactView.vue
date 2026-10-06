<template>

  <main class="contact-page amv-view-shell">
    <a class="amv-skip-link" href="#amv-main-content">
      Ir al contenido principal
    </a>

    <!-- =====================================================*
        HERO
*    ====================================================== -->

    <section id="amv-main-content" class="hero">

      <div class="hero__grid"></div>

      <div class="hero__glow"></div>

      <div class="container hero__layout">

        <!-- =================================================*
            TEXTO
*        ================================================== -->

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

              / decoding="async">

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

        <!-- =================================================*
            TARJETA INSTITUCIONAL
*        ================================================== -->

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

              / decoding="async">

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

            / decoding="async">

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

            / decoding="async">

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
    <nav class="public-jump-nav" aria-label="Explorar esta página">
      <span>EXPLORAR</span>
        <a href="#canales-contacto">Canales</a>
        <a href="#ubicacion-contacto">Ubicación</a>
        <a href="#cierre-contacto">Inscripción</a>
      <RouterLink to="/inscripcion">Inscribirme →</RouterLink>
    </nav>


    <!-- =====================================================*
        CANALES
*    ====================================================== -->

    <section id="canales-contacto" class="channels">

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

          <!-- ===============================================*
              WHATSAPP
*          ================================================ -->

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

                / decoding="async">

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

          <!-- ===============================================*
              EMAIL
*          ================================================ -->

          <a

            :href="`mailto:${academy.email}`"

            class="channel-card"

          >

            <div class="channel-card__head">

              <div class="channel-card__icon">

                <img

                  :src="gmailIcon"

                  alt="Gmail"

                / decoding="async">

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

          <!-- ===============================================*
              INSTAGRAM
*          ================================================ -->

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

                / decoding="async">

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

          <!-- ===============================================*
              FACEBOOK
*          ================================================ -->

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

                / decoding="async">

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

    <!-- =====================================================*
        UBICACIÓN
*    ====================================================== -->

    <section id="ubicacion-contacto" class="location">

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

    <!-- =====================================================*
        CTA FINAL
*    ====================================================== -->

    <section id="cierre-contacto" class="final-cta">

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

      <PublicQuickActions />
  </main>

</template>

<script setup>
import PublicQuickActions from '@/components/public/PublicQuickActions.vue'


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

/* =========================================================*
   DATOS
*========================================================= */

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

/* =========================================================*
   WHATSAPP
*========================================================= */

const whatsappMessage =

  'Hola, me gustaría recibir información sobre la Academia de Talentos Amo Mi Voz.'

const whatsappUrl =

  `https://wa.me/${academy.phone.replace(/\D/g, '')}` +

  `?text=${encodeURIComponent(whatsappMessage)}`

/* =========================================================*
   REDES
*========================================================= */

const instagramUrl =

  `https://www.instagram.com/${academy.instagram}/`

const facebookUrl =

  `https://www.facebook.com/search/top/?q=${encodeURIComponent(

    academy.facebook,

  )}`

/* =========================================================*
   MAPA
*========================================================= */

const mapsUrl =

  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(

    academy.location,

  )}`

</script>

<style scoped lang="scss">

@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================*
   BASE
*========================================================= */

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

/* =========================================================*
   BOTONES
*========================================================= */

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

/* =========================================================*
   HERO
*========================================================= */

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

/* =========================================================*
   TARJETA ACADEMIA
*========================================================= */

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

/* =========================================================*
   CHANNELS
*========================================================= */

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

/* =========================================================*
   LOCATION
*========================================================= */

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

/* =========================================================*
   FINAL CTA
*========================================================= */

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

/* =========================================================*
   TABLET
*========================================================= */

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

/* =========================================================*
   MOBILE
*========================================================= */

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

/* =========================================================*
   ACCESIBILIDAD
*========================================================= */

@media (

  prefers-reduced-motion:

  reduce

) {

  .contact-page \*,

  .contact-page \*::before,

  .contact-page \*::after {

    animation-duration:

      0.01ms !important;

    animation-iteration-count:

      1 !important;

    transition-duration:

      0.01ms !important;

  }

}



/* =========================================================
   AMV PUBLIC MAX · 2026
   Diseño institucional light-first + marketing + accesibilidad
========================================================= */

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page) {
  --amv-bg: #f4f6f9;
  --amv-surface: #ffffff;
  --amv-soft: #f8fafc;
  --amv-ink: #152033;
  --amv-copy: #344359;
  --amv-muted: #6f7c8f;
  --amv-line: #dbe3ec;
  --amv-line-strong: #c8d4e1;
  --amv-wine: #9f1945;
  --amv-wine-dark: #771333;
  --amv-wine-soft: #fff1f5;
  --amv-gold: #d5a720;
  --amv-gold-dark: #916b00;
  --amv-gold-soft: #fff8e8;
  --amv-green: #2d8f66;
  --amv-shadow: 0 12px 30px rgba(31,48,73,.055);

  min-height: 100vh !important;
  overflow: clip !important;
  color: var(--amv-ink) !important;
  background: var(--amv-bg) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  :is(a,button,input,select,textarea) {
  -webkit-tap-highlight-color: transparent;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  :focus-visible {
  outline: 3px solid rgba(159,25,69,.28) !important;
  outline-offset: 3px !important;
}

/* HERO: cinematic, pero no toda la web negra */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.hero,.academy-hero) {
  color: #fff !important;
  background:
    radial-gradient(circle at 82% 20%, rgba(159,25,69,.18), transparent 28%),
    linear-gradient(135deg,#101a2d,#18263e) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.hero,.academy-hero) :is(h1,h2,h3,strong) {
  color: #fff;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.hero,.academy-hero) :is(em,h1 span) {
  color: #f0c748;
}

/* Navegación contextual — 3 clics / orientación */
.public-jump-nav {
  position: sticky;
  z-index: 70;
  top: 76px;
  display: flex;
  min-height: 58px;
  gap: 4px;
  align-items: center;
  width: min(1180px,calc(100% - 32px));
  margin: -1px auto 0;
  padding: 7px 9px;
  overflow-x: auto;
  border: 1px solid var(--amv-line);
  border-radius: 0 0 15px 15px;
  background: rgba(255,255,255,.96);
  box-shadow: 0 12px 26px rgba(31,48,73,.07);
  backdrop-filter: blur(12px);
  scrollbar-width: none;
}

.public-jump-nav::-webkit-scrollbar { display: none; }

.public-jump-nav > span {
  flex: 0 0 auto;
  padding: 0 9px;
  color: var(--amv-gold-dark);
  font-size: .52rem;
  font-weight: 900;
  letter-spacing: .12em;
}

.public-jump-nav a {
  display: inline-flex;
  min-height: 42px;
  flex: 0 0 auto;
  align-items: center;
  padding: 0 12px;
  border-radius: 9px;
  color: #56657a;
  font-size: .68rem;
  font-weight: 850;
  text-decoration: none;
}

.public-jump-nav a:hover {
  color: var(--amv-wine);
  background: var(--amv-wine-soft);
}

.public-jump-nav a:last-child {
  margin-left: auto;
  color: #fff;
  background: var(--amv-wine);
}

/* Todas las secciones editoriales pasan a superficies claras */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero):not(.academy-cta):not(.cta):not(.final-cta) {
  color: var(--amv-ink) !important;
  background: var(--amv-surface) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:nth-of-type(odd):not(.hero):not(.academy-hero):not(.academy-cta):not(.cta):not(.final-cta) {
  background:
    linear-gradient(180deg,#f8fafc,#f3f6f9) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  :is(h2,h3,h4,strong) {
  color: var(--amv-ink);
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  :is(p,li) {
  color: var(--amv-muted);
}

/* Cards heredadas: mismo lenguaje */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  [class*="card"]:not([class*="cta"]) {
  border-color: var(--amv-line) !important;
  background: #fff !important;
  color: var(--amv-ink) !important;
  box-shadow: var(--amv-shadow) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  [class*="card"]:not([class*="cta"]) :is(h2,h3,h4,strong) {
  color: var(--amv-ink) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  [class*="card"]:not([class*="cta"]) :is(p,small) {
  color: var(--amv-muted) !important;
}

/* Eyebrows y acentos */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  [class*="eyebrow"] {
  color: var(--amv-gold-dark) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > section:not(.hero):not(.academy-hero)
  :is(h1,h2,h3) em {
  color: var(--amv-wine) !important;
}

/* CTAs finales */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.academy-cta,.cta,.final-cta) {
  color: #fff !important;
  background:
    radial-gradient(circle at 85% 10%, rgba(159,25,69,.2), transparent 30%),
    linear-gradient(135deg,#101a2d,#1b2941) !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.academy-cta,.cta,.final-cta) :is(h2,h3,strong) {
  color: #fff !important;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  > :is(.academy-cta,.cta,.final-cta) p {
  color: rgba(255,255,255,.68) !important;
}

/* Forms */
.inscription-page :is(input,select,textarea),
.contact-page :is(input,select,textarea) {
  min-height: 48px !important;
  border: 1px solid var(--amv-line-strong) !important;
  border-radius: 11px !important;
  color: var(--amv-ink) !important;
  background: #fff !important;
}

.inscription-page textarea,
.contact-page textarea {
  min-height: 130px !important;
}

.inscription-page :is(input,select,textarea):focus,
.contact-page :is(input,select,textarea):focus {
  border-color: var(--amv-wine) !important;
  box-shadow: 0 0 0 4px rgba(159,25,69,.08) !important;
}

/* Buttons */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  :is(.button,.academy-button,[class*="button--primary"]) {
  min-height: 46px;
}

:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  :is(.button--primary,.academy-button--primary,.cta__button) {
  border-color: var(--amv-wine) !important;
  color: #fff !important;
  background: var(--amv-wine) !important;
}

/* Mejora lectura en desktop */
:where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
  .container {
  width: min(1180px,100%) !important;
}

/* Scroll target */
:where(
  #formacion-academia,#metodo-academia,#experiencia-academia,#comunidad-academia,
  #canales-contacto,#ubicacion-contacto,#cierre-contacto,
  #historia-galeria,#explorar-galeria,#proceso-galeria,#cierre-galeria,
  #solicitud-inscripcion,#concepto-musicales,#formato-musicales,#producciones,
  #proceso-musicales,#programa,#pilares-formacion,#recorrido-formacion,#faq-formacion
) {
  scroll-margin-top: 150px;
}

@media (max-width: 760px) {
  .public-jump-nav {
    top: 66px;
    width: calc(100% - 20px);
    min-height: 54px;
    padding-inline: 6px;
  }

  .public-jump-nav > span {
    display: none;
  }

  .public-jump-nav a {
    min-height: 44px;
    font-size: .7rem;
  }

  .public-jump-nav a:last-child {
    margin-left: 0;
  }

  :where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page)
    :is(.button,.academy-button,a[class*="button"]) {
    min-height: 48px !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  :where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page) *,
  :where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page) *::before,
  :where(.academy-page,.contact-page,.gallery-page,.inscription-page,.musicals-page,.training-page) *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* Contact */
.channels__grid .channel-card,
.location__info,
.location__map {
  border-color: var(--amv-line) !important;
  background: #fff !important;
}
.channel-card:hover {
  transform: translateY(-3px);
  border-color: var(--amv-line-strong) !important;
}
.channel-card__body h3,
.channel-card__footer strong { color: var(--amv-ink) !important; }
.channel-card__body p { color: var(--amv-muted) !important; }


.amv-skip-link {
  position: fixed;
  z-index: 9999;
  top: 8px;
  left: 8px;
  padding: 10px 14px;
  border-radius: 9px;
  color: #fff !important;
  background: #9f1945;
  font-size: .75rem;
  font-weight: 900;
  text-decoration: none;
  transform: translateY(-150%);
}
.amv-skip-link:focus { transform: translateY(0); }



/* =========================================================
   AMV UI SYSTEM · PUBLIC EXPERIENCE v1.0
   Consistencia, accesibilidad y movimiento fluido
========================================================= */
.contact-page {
  --amv-ink: #172033;
  --amv-body: #344359;
  --amv-muted: #667085;
  --amv-wine: #9f1945;
  --amv-wine-dark: #7f1237;
  --amv-gold: #d9a91d;
  --amv-line: #dbe3ec;
  --amv-canvas: #f5f7fb;
  --amv-card: #ffffff;
  --amv-shadow: 0 18px 48px rgba(23, 32, 51, .09);
  --amv-radius: 20px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.contact-page :where(a, button, input, textarea, select) {
  transition: color .22s ease, background-color .22s ease, border-color .22s ease, box-shadow .22s ease, transform .22s ease, opacity .22s ease;
}

.contact-page :where(a, button, input, textarea, select):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.contact-page :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.contact-page :where(img) {
  transition: transform .45s cubic-bezier(.2,.75,.25,1), filter .35s ease;
}

.contact-page :where(article, .card, [class*="__card"]):hover {
  transition: transform .28s cubic-bezier(.2,.75,.25,1), box-shadow .28s ease, border-color .28s ease;
}

.contact-page :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

@media (prefers-reduced-motion: reduce) {
  .contact-page *, .contact-page *::before, .contact-page *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* =========================================================
   AMV LMS · FLUID MOTION & PREMIUM INTERACTION v2.0
   Capa visual segura: no modifica lógica, datos ni estructura.
========================================================= */
.contact-page {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.contact-page :where(
  article,
  [class$="__card"],
  [class*="-card"],
  [class*="_card"]
) {
  transition:
    transform .24s cubic-bezier(.2,.75,.25,1),
    box-shadow .24s ease,
    border-color .24s ease,
    background-color .24s ease;
}

@media (hover: hover) and (pointer: fine) {
  .contact-page :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .contact-page :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .contact-page :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .contact-page :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.contact-page :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.contact-page :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.contact-page :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.contact-page ::selection {
  color: #ffffff;
  background: #9f1945;
}

@keyframes amvViewEnter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .contact-page,
  .contact-page *,
  .contact-page *::before,
  .contact-page *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}

</style>

<style lang="scss">
/* AMV UI POLISH 2026 — visual consistency, accessibility and mobile resilience. */
.amv-view-shell {
  --amv-ui-wine: #9f1945;
  --amv-ui-wine-deep: #7f1237;
  --amv-ui-gold: #d9a91d;
  --amv-ui-purple: #7657d9;
  --amv-ui-cyan: #20b8ae;
  --amv-ui-ink: #172033;
  --amv-ui-muted: #6f7c8f;
  --amv-ui-line: rgba(122, 137, 158, 0.20);
  --amv-ui-focus: rgba(159, 25, 69, 0.38);
  --amv-ui-radius-sm: 12px;
  --amv-ui-radius-md: 18px;
  --amv-ui-radius-lg: 26px;
  --amv-ui-shadow: 0 18px 55px rgba(17, 25, 39, 0.09);
  --amv-ui-shadow-hover: 0 22px 65px rgba(17, 25, 39, 0.14);
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  isolation: isolate;
  overflow-x: clip;
  -webkit-tap-highlight-color: transparent;
}

.amv-view-shell::before {
  content: '';
  position: absolute;
  inset: -150px -120px auto auto;
  width: 420px;
  height: 420px;
  pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(159, 25, 69, 0.10), transparent 52%),
    radial-gradient(circle at 68% 62%, rgba(217, 169, 29, 0.08), transparent 58%);
  filter: blur(6px);
  opacity: 0.82;
  z-index: -1;
}

.amv-view-shell :where(*, *::before, *::after) {
  box-sizing: border-box;
}

.amv-view-shell :where(img, video, svg, canvas) {
  max-width: 100%;
}

.amv-view-shell :where(h1, h2, h3, h4, h5, h6) {
  text-wrap: balance;
}

.amv-view-shell :where(p, li, td, th, label, small) {
  overflow-wrap: anywhere;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']) {
  touch-action: manipulation;
}

.amv-view-shell :where(button, input, select, textarea) {
  font: inherit;
}

.amv-view-shell :where(button) {
  min-height: 42px;
}

.amv-view-shell :where(input, select, textarea) {
  max-width: 100%;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']):focus-visible {
  outline: 3px solid var(--amv-ui-focus);
  outline-offset: 3px;
}

.amv-view-shell :where(button, [role='button']):disabled,
.amv-view-shell :where(input, select, textarea):disabled {
  cursor: not-allowed;
}

.amv-view-shell :where(.button, .btn, .lux-button, .amv-primary-btn, .amv-secondary-action,
  .primary-action, .secondary-action, .danger-action, .text-link, .action-link,
  .lightbox__close, .lightbox__nav, .today-button, .quick-action) {
  -webkit-user-select: none;
  user-select: none;
}

/* Premium surface language without changing each view's semantic palette. */
.amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
  .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
  .resource-card, .student-card, .lesson-card, .task-card, .format-card,
  .production, .sound-console, .state-card, .empty-card, .workspace,
  .profile-card, .profile-panel, .vocal-card, .weighted-student, .weighted-category) {
  border-radius: var(--amv-ui-radius-md);
}

.amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
  .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
  .task-card, .format-card, .production, .state-card, .empty-card) {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
    .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
    .task-card, .format-card, .production):not(.is-disabled):hover {
    transform: translateY(-2px);
  }
}

/* Toolbars wrap rather than squeezing controls into unreadable rows. */
.amv-view-shell :where(.toolbar, .students-toolbar, .calendar-toolbar, .resources-controls,
  .resources-controls__row, .gradebook-legacy-toolbar, .hero-actions, .actions,
  .action-row, .question-actions, .filters, .public-jump-nav, .classes-header__actions,
  .result-action-row, .form-actions, .footer-actions) {
  min-width: 0;
}

.amv-view-shell :where(.table-shell, .quiz-table-wrap, .table-wrap, .grade-table-wrap,
  .data-table-wrap, .scroll-region, .horizontal-scroll) {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.amv-view-shell :where(.table-shell table, .quiz-table-wrap table, .table-wrap table,
  .grade-table-wrap table, .data-table-wrap table) {
  max-width: none;
}

/* Prevent long controls and badges from forcing page-level horizontal overflow. */
.amv-view-shell :where(.badge, .pill, .chip, .status-pill, .source-badge, .event-chip,
  .lesson-detail, .student-card__voice, .student-card__status, .course-kicker,
  .hero-stat, .count, .filename, .meta, .eyebrow) {
  max-width: 100%;
}

/* Dialogs/lightboxes stay usable on short laptop and phone viewports. */
.amv-view-shell :where(.modal, .dialog, .drawer, .lightbox, .lightbox__content,
  .modal__content, .dialog__content, [role='dialog']) {
  max-width: min(100%, 100vw);
}

.amv-view-shell :where(.modal__content, .dialog__content, .lightbox__content,
  [role='dialog']) {
  max-height: calc(100dvh - 28px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Public pages: a cleaner editorial frame around content-heavy sections. */
.amv-view-shell :where(.hero, .hero-panel, .calendar-hero, .resources-hero, .amv-hero,
  .students__header, .gradebook__hero, .classes-header, .contact-hero, .training-hero,
  .academy-hero, .inscription-hero) {
  isolation: isolate;
}

.amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid) {
  min-width: 0;
}

/* Mobile-first resilience. Existing view-specific breakpoints still win where more
   specific rules exist, while these defaults catch edge cases and tiny screens. */
@media (max-width: 760px) {
  .amv-view-shell {
    overflow-x: clip;
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 22px;
  }

  .amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid,
    .calendar-layout, .quiz-layout, .program-layout, .student-profile__grid,
    .dashboard-grid, .content-grid, .page-grid, .split-layout) {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .amv-view-shell :where(.hero-actions, .actions, .action-row, .form-actions,
    .footer-actions, .question-actions, .students__header-actions, .hero-stat,
    .calendar-toolbar, .resources-controls__row) {
    flex-wrap: wrap;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    min-width: min(100%, 190px);
  }

  .amv-view-shell :where(.display-title, .page-title, .hero-title, .section-title,
    .hero-panel__title, .amv-hero h1, .calendar-hero h1, .students__header h1,
    .gradebook__hero h1) {
    font-size: clamp(1.8rem, 7vw, 3rem);
    line-height: 1.05;
  }

  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .amv-view-shell :where(.students-toolbar, .resources-controls, .calendar-toolbar,
    .gradebook-legacy-toolbar, .classes-header, .section-heading, .profile-actions) {
    gap: 10px;
  }

  .amv-view-shell :where(input, select, textarea, .select, .search-input) {
    min-height: 44px;
  }
}

@media (max-width: 520px) {
  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: minmax(0, 1fr);
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 18px;
  }

  .amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
    .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
    .resource-card, .student-card, .lesson-card, .task-card, .format-card,
    .production, .state-card, .empty-card) {
    border-radius: 16px;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    width: 100%;
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .amv-view-shell,
  .amv-view-shell :where(*, *::before, *::after) {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
