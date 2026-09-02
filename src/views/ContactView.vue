<template>
  <main class="contact-page">
    <!-- =====================================================
         HERO
    ====================================================== -->
    <section class="hero">
      <div class="hero__grid"></div>

      <div class="hero__glow hero__glow--one"></div>
      <div class="hero__glow hero__glow--two"></div>

      <div class="container hero__layout">
        <div class="hero__content">
          <div class="eyebrow">
            <span></span>
            CONTACTO · AMO MI VOZ
          </div>

          <h1>
            Conversemos sobre
            <em>tu próximo paso.</em>
          </h1>

          <p class="hero__lead">
            Inscripciones, formación, presentaciones,
            proyectos, administración o cualquier consulta
            relacionada con la academia.
          </p>

          <div class="hero__actions">
            <a
              class="button button--primary"
              :href="whatsappUrl"
              target="_blank"
              rel="noopener noreferrer"
            >
              Hablar por WhatsApp

              <span>→</span>
            </a>

            <a
              class="button button--secondary"
              :href="`mailto:${academy.email}`"
            >
              Enviar correo
            </a>
          </div>

          <div class="hero__facts">
            <article>
              <span>01</span>

              <div>
                <small>UBICACIÓN</small>

                <strong>
                  La Calera
                </strong>
              </div>
            </article>

            <article>
              <span>02</span>

              <div>
                <small>REGIÓN</small>

                <strong>
                  Valparaíso
                </strong>
              </div>
            </article>

            <article>
              <span>03</span>

              <div>
                <small>ATENCIÓN</small>

                <strong>
                  Canal oficial
                </strong>
              </div>
            </article>
          </div>
        </div>

        <!-- =================================================
             TARJETA INSTITUCIONAL
        ================================================== -->
        <aside class="identity-card">
          <div class="identity-card__glow"></div>

          <div class="identity-card__top">
            <span class="status-dot"></span>

            <small>
              CANAL INSTITUCIONAL
            </small>
          </div>

          <div class="identity-card__brand">
            <img
              :src="logo"
              alt="Academia de Talentos Amo Mi Voz"
            />

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

          <div class="identity-card__divider"></div>

          <div class="identity-card__contact">
            <article>
              <small>
                WHATSAPP
              </small>

              <a
                :href="whatsappUrl"
                target="_blank"
                rel="noopener noreferrer"
              >
                +56 9 5976 2385
              </a>
            </article>

            <article>
              <small>
                CORREO
              </small>

              <a
                :href="`mailto:${academy.email}`"
              >
                {{ academy.email }}
              </a>
            </article>
          </div>

          <div class="identity-card__footer">
            <span>♪</span>

            <p>
              Formación vocal, musical,
              interpretación y experiencia escénica.
            </p>
          </div>
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
            <span class="eyebrow eyebrow--simple">
              CANALES OFICIALES
            </span>

            <h2 class="display-title">
              Elige cómo
              <em>quieres contactarnos.</em>
            </h2>
          </div>

          <p>
            Centralizamos las consultas en nuestros
            canales institucionales para entregar una
            atención ordenada y segura.
          </p>
        </header>

        <div class="channels__grid">
          <!-- WHATSAPP -->
          <a
            class="channel-card"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="channel-card__top">
              <span>01</span>

              <strong>
                WA
              </strong>
            </div>

            <small>
              CONTACTO DIRECTO
            </small>

            <h3>
              WhatsApp
            </h3>

            <p>
              Ideal para consultas rápidas sobre
              inscripciones, clases y actividades.
            </p>

            <div class="channel-card__data">
              +56 9 5976 2385
            </div>

            <div class="channel-card__action">
              Abrir WhatsApp
              <span>↗</span>
            </div>
          </a>

          <!-- EMAIL -->
          <a
            class="channel-card"
            :href="`mailto:${academy.email}`"
          >
            <div class="channel-card__top">
              <span>02</span>

              <strong>
                @
              </strong>
            </div>

            <small>
              CORREO INSTITUCIONAL
            </small>

            <h3>
              Email
            </h3>

            <p>
              Para solicitudes formales,
              colaboraciones, proyectos y documentación.
            </p>

            <div class="channel-card__data channel-card__data--email">
              {{ academy.email }}
            </div>

            <div class="channel-card__action">
              Escribir correo
              <span>↗</span>
            </div>
          </a>

          <!-- INSTAGRAM -->
          <a
            class="channel-card"
            :href="instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="channel-card__top">
              <span>03</span>

              <strong>
                IG
              </strong>
            </div>

            <small>
              REDES SOCIALES
            </small>

            <h3>
              Instagram
            </h3>

            <p>
              Conoce actividades, estudiantes,
              presentaciones y novedades de la academia.
            </p>

            <div class="channel-card__data">
              @amomivoz_academia
            </div>

            <div class="channel-card__action">
              Visitar Instagram
              <span>↗</span>
            </div>
          </a>

          <!-- FACEBOOK -->
          <a
            class="channel-card"
            :href="facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <div class="channel-card__top">
              <span>04</span>

              <strong>
                FB
              </strong>
            </div>

            <small>
              COMUNIDAD
            </small>

            <h3>
              Facebook
            </h3>

            <p>
              Sigue nuestras publicaciones,
              actividades y proyectos artísticos.
            </p>

            <div class="channel-card__data">
              Academia de Talento Musical
              “AMO MI VOZ”
            </div>

            <div class="channel-card__action">
              Visitar Facebook
              <span>↗</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- =====================================================
         ÁREAS DE CONTACTO
    ====================================================== -->
    <section class="departments">
      <div class="container departments__grid">
        <div class="departments__heading">
          <span class="eyebrow eyebrow--simple">
            ¿CON QUIÉN NECESITAS HABLAR?
          </span>

          <h2 class="display-title">
            Nosotros dirigimos
            <em>tu consulta.</em>
          </h2>

          <p>
            No necesitas conocer el teléfono personal
            de cada integrante de la academia.
          </p>

          <p>
            Escríbenos mediante nuestros canales
            institucionales y tu consulta será derivada
            al área correspondiente.
          </p>
        </div>

        <div class="departments__list">
          <article
            v-for="department in departments"
            :key="department.number"
          >
            <span class="departments__number">
              {{ department.number }}
            </span>

            <div>
              <small>
                {{ department.label }}
              </small>

              <h3>
                {{ department.title }}
              </h3>

              <p>
                {{ department.description }}
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- =====================================================
         FORMULARIO
    ====================================================== -->
    <section class="form-section">
      <div class="container form-layout">
        <div class="form-info">
          <span class="eyebrow eyebrow--simple">
            ENVÍANOS UNA CONSULTA
          </span>

          <h2 class="display-title">
            Cuéntanos
            <em>cómo podemos ayudarte.</em>
          </h2>

          <p>
            Completa los datos y prepararemos
            tu consulta para enviarla al correo
            institucional de Amo Mi Voz.
          </p>

          <div class="form-info__notice">
            <span>i</span>

            <p>
              Para solicitudes de inscripción,
              también puedes utilizar directamente
              nuestro formulario de inscripción.
            </p>
          </div>

          <RouterLink
            to="/inscripcion"
            class="form-info__link"
          >
            Ir a inscripción
            <span>→</span>
          </RouterLink>
        </div>

        <form
          class="contact-form"
          @submit.prevent="sendEmail"
        >
          <div class="contact-form__header">
            <div>
              <small>
                CONTACTO INSTITUCIONAL
              </small>

              <strong>
                Nueva consulta
              </strong>
            </div>

            <span>
              AMV
            </span>
          </div>

          <div class="contact-form__grid">
            <label class="field">
              <span>
                Nombre
              </span>

              <input
                v-model.trim="form.name"
                type="text"
                required
                maxlength="120"
                autocomplete="name"
                placeholder="Tu nombre"
              />
            </label>

            <label class="field">
              <span>
                Correo
              </span>

              <input
                v-model.trim="form.email"
                type="email"
                required
                maxlength="160"
                autocomplete="email"
                placeholder="nombre@correo.cl"
              />
            </label>

            <label class="field field--full">
              <span>
                Motivo de contacto
              </span>

              <select
                v-model="form.subject"
                required
              >
                <option
                  disabled
                  value=""
                >
                  Selecciona una opción
                </option>

                <option
                  v-for="option in subjectOptions"
                  :key="option"
                  :value="option"
                >
                  {{ option }}
                </option>
              </select>
            </label>

            <label class="field field--full">
              <span>
                Mensaje
              </span>

              <textarea
                v-model.trim="form.message"
                required
                maxlength="1500"
                rows="7"
                placeholder="Cuéntanos brevemente en qué podemos ayudarte..."
              ></textarea>

              <small class="field__counter">
                {{ form.message.length }}/1500
              </small>
            </label>
          </div>

          <button
            type="submit"
            class="contact-form__submit"
          >
            <span>
              Preparar correo
            </span>

            <span>
              →
            </span>
          </button>

          <p class="contact-form__help">
            Se abrirá tu aplicación de correo
            con el mensaje preparado.
          </p>
        </form>
      </div>
    </section>

    <!-- =====================================================
         UBICACIÓN
    ====================================================== -->
    <section class="location">
      <div class="location__grid-background"></div>

      <div class="container location__layout">
        <div>
          <span class="eyebrow eyebrow--simple">
            DÓNDE ESTAMOS
          </span>

          <h2 class="display-title">
            Desde La Calera,
            <em>creando experiencias artísticas.</em>
          </h2>

          <p>
            Academia de Talentos Amo Mi Voz desarrolla
            sus actividades en La Calera,
            Región de Valparaíso, Chile.
          </p>
        </div>

        <div class="location-card">
          <span class="location-card__number">
            05
          </span>

          <small>
            UBICACIÓN
          </small>

          <strong>
            La Calera
          </strong>

          <p>
            Región de Valparaíso
            <br />
            Chile
          </p>

          <a
            :href="mapsUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Abrir en Google Maps
            <span>↗</span>
          </a>
        </div>
      </div>
    </section>

    <!-- =====================================================
         SEGURIDAD / PROFESIONALISMO
    ====================================================== -->
    <section class="privacy">
      <div class="container privacy__grid">
        <div class="privacy__icon">
          AMV
        </div>

        <div>
          <span class="eyebrow eyebrow--simple">
            COMUNICACIÓN RESPONSABLE
          </span>

          <h2>
            Tus consultas se gestionan
            mediante canales institucionales.
          </h2>

          <p>
            Para proteger la privacidad del equipo,
            no publicamos teléfonos personales de dirección,
            administración o docentes. Toda comunicación
            puede gestionarse mediante el contacto oficial
            de la academia.
          </p>
        </div>
      </div>
    </section>

    <!-- =====================================================
         CTA FINAL
    ====================================================== -->
    <section class="cta">
      <div class="cta__grid"></div>
      <div class="cta__glow"></div>

      <div class="container cta__content">
        <span class="eyebrow eyebrow--simple">
          AMO MI VOZ · LA CALERA
        </span>

        <h2>
          Estamos a un mensaje
          <em>de distancia.</em>
        </h2>

        <p>
          Escríbenos y conversemos sobre
          formación, inscripciones, presentaciones
          o proyectos artísticos.
        </p>

        <div class="cta__actions">
          <a
            class="button button--primary button--large"
            :href="whatsappUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contactar por WhatsApp
            <span>→</span>
          </a>

          <a
            class="button button--secondary button--large"
            :href="`mailto:${academy.email}`"
          >
            Enviar correo
          </a>
        </div>

        <small>
          Academia de Talentos Amo Mi Voz
          · La Calera · Región de Valparaíso
        </small>
      </div>
    </section>
  </main>
</template>

<script setup>
import {
  reactive
} from 'vue'

import logo from '@/assets/images/logo.png'

/* =========================================================
   DATOS INSTITUCIONALES
========================================================= */

const academy = {
  phone: '+56959762385',
  phoneDisplay: '+56 9 5976 2385',

  email:
    'academiadetalentosamomivoz@gmail.com',

  instagram:
    'amomivoz_academia',

  facebook:
    'Academia de Talento Musical "AMO MI VOZ"',

  location:
    'La Calera, Región de Valparaíso, Chile'
}

/* =========================================================
   URLs
========================================================= */

const whatsappMessage =
  'Hola, me gustaría recibir información sobre la Academia de Talentos Amo Mi Voz.'

const whatsappUrl =
  `https://wa.me/56959762385?text=${encodeURIComponent(
    whatsappMessage
  )}`

const instagramUrl =
  'https://www.instagram.com/amomivoz_academia/'

/*
 * Utilizamos búsqueda de Facebook para no depender
 * de un slug que podría ser distinto al nombre visible.
 */
const facebookUrl =
  `https://www.facebook.com/search/top/?q=${encodeURIComponent(
    academy.facebook
  )}`

const mapsUrl =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    academy.location
  )}`

/* =========================================================
   ÁREAS
========================================================= */

const departments = [
  {
    number: '01',
    label: 'FORMACIÓN',
    title: 'Consultas académicas',
    description:
      'Información sobre clases, programa formativo, metodología y proceso de aprendizaje.'
  },
  {
    number: '02',
    label: 'INSCRIPCIONES',
    title: 'Nuevos estudiantes',
    description:
      'Orientación sobre solicitudes de inscripción, matrícula y acceso inicial.'
  },
  {
    number: '03',
    label: 'DIRECCIÓN',
    title: 'Dirección de la academia',
    description:
      'Proyectos, alianzas, actividades institucionales y coordinación general.'
  },
  {
    number: '04',
    label: 'ADMINISTRACIÓN',
    title: 'Administración y tesorería',
    description:
      'Consultas administrativas y materias relacionadas con la gestión de la academia.'
  },
  {
    number: '05',
    label: 'PRODUCCIÓN',
    title: 'Eventos y presentaciones',
    description:
      'Consultas sobre conciertos, musicales, presentaciones y proyectos artísticos.'
  }
]

/* =========================================================
   FORMULARIO
========================================================= */

const subjectOptions = [
  'Información sobre clases',
  'Inscripción',
  'Administración / tesorería',
  'Dirección de la academia',
  'Musicales y presentaciones',
  'Colaboraciones y proyectos',
  'Otra consulta'
]

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

function sendEmail() {
  const subject =
    `[Amo Mi Voz] ${form.subject}`

  const body = [
    'Hola Academia de Talentos Amo Mi Voz:',
    '',
    `Nombre: ${form.name}`,
    `Correo: ${form.email}`,
    `Motivo: ${form.subject}`,
    '',
    'Mensaje:',
    form.message,
    '',
    'Enviado desde el sitio web de Amo Mi Voz.'
  ].join('\n')

  const mailto =
    `mailto:${academy.email}` +
    `?subject=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`

  window.location.href = mailto
}
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   BASE
========================================================= */

.contact-page {
  --surface: #0d0d0d;
  --surface-light: #111;
  --border: #292929;

  min-height: 100vh;

  overflow: hidden;

  color: #f5f5f5;

  background: #080808;
}

.container {
  width: min(1200px, 100%);

  margin: 0 auto;
}

.eyebrow {
  display: flex;

  gap: 9px;

  align-items: center;

  color: variables.$color-primary;

  font-size: 0.62rem;
  font-weight: 900;

  letter-spacing: 0.19em;

  text-transform: uppercase;
}

.eyebrow > span {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: variables.$color-primary;

  box-shadow:
    0 0 15px
    rgba(212, 175, 55, 0.6);
}

.eyebrow--simple {
  display: block;
}

.display-title {
  margin: 17px 0 0;

  font-size:
    clamp(
      2.9rem,
      5.4vw,
      5.4rem
    );

  line-height: 0.94;

  letter-spacing: -0.06em;
}

.display-title em {
  display: block;

  color: variables.$color-primary;

  font-style: normal;
}

/* =========================================================
   BUTTONS
========================================================= */

.button {
  display: inline-flex;

  min-height: 49px;

  gap: 10px;

  align-items: center;
  justify-content: center;

  padding:
    13px
    21px;

  border-radius: 10px;

  font-size: 0.71rem;
  font-weight: 900;

  text-decoration: none;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.button:hover {
  transform: translateY(-2px);
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
    0 18px 45px
    rgba(212, 175, 55, 0.16);
}

.button--secondary {
  border: 1px solid #363636;

  color: #bbb;

  background: transparent;
}

.button--secondary:hover {
  color: #fff;

  border-color: #575757;
}

.button--large {
  min-height: 57px;

  padding-right: 27px;
  padding-left: 27px;
}

/* =========================================================
   HERO
========================================================= */

.hero {
  position: relative;

  overflow: hidden;

  padding:
    175px
    24px
    125px;

  background: #090909;
}

.hero__grid {
  position: absolute;

  inset: 0;

  pointer-events: none;

  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.013) 1px,
      transparent 1px
    ),
    linear-gradient(
      rgba(255, 255, 255, 0.013) 1px,
      transparent 1px
    );

  background-size:
    72px
    72px;

  mask-image:
    radial-gradient(
      circle at 50% 40%,
      black,
      transparent 80%
    );
}

.hero__glow {
  position: absolute;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(155px);
}

.hero__glow--one {
  top: -170px;
  right: -150px;

  width: 650px;
  height: 650px;

  background:
    rgba(212, 175, 55, 0.085);
}

.hero__glow--two {
  bottom: -300px;
  left: -200px;

  width: 550px;
  height: 550px;

  background:
    rgba(212, 175, 55, 0.03);
}

.hero__layout {
  position: relative;

  z-index: 2;

  display: grid;

  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      minmax(0, 1.1fr)
      minmax(370px, 0.9fr);

    align-items: center;
  }
}

.hero h1 {
  max-width: 850px;

  margin: 23px 0 0;

  font-size:
    clamp(
      3.8rem,
      7.5vw,
      7.4rem
    );

  line-height: 0.87;

  letter-spacing: -0.07em;
}

.hero h1 em {
  display: block;

  color: variables.$color-primary;

  font-style: normal;
}

.hero__lead {
  max-width: 680px;

  margin: 31px 0 0;

  color: #929292;

  font-size: 0.98rem;

  line-height: 1.85;
}

.hero__actions {
  display: flex;

  gap: 10px;

  flex-wrap: wrap;

  margin-top: 34px;
}

.hero__facts {
  display: grid;

  gap: 1px;

  overflow: hidden;

  margin-top: 43px;

  border: 1px solid #292929;

  border-radius: 12px;

  background: #292929;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(3, 1fr);
  }
}

.hero__facts article {
  display: flex;

  gap: 12px;

  padding: 15px;

  background: #0c0c0c;
}

.hero__facts article > span {
  color: variables.$color-primary;

  font-size: 0.48rem;
  font-weight: 900;
}

.hero__facts small,
.hero__facts strong {
  display: block;
}

.hero__facts small {
  color: #565656;

  font-size: 0.43rem;
  font-weight: 900;

  letter-spacing: 0.12em;
}

.hero__facts strong {
  margin-top: 4px;

  font-size: 0.63rem;
}

/* =========================================================
   IDENTITY CARD
========================================================= */

.identity-card {
  position: relative;

  overflow: hidden;

  padding: 29px;

  border:
    1px solid
    rgba(212, 175, 55, 0.25);

  border-radius: 24px;

  background:
    linear-gradient(
      145deg,
      rgba(212, 175, 55, 0.055),
      transparent
    ),
    #0d0d0d;

  box-shadow:
    0 45px 100px
    rgba(0, 0, 0, 0.47);
}

.identity-card__glow {
  position: absolute;

  top: -100px;
  right: -100px;

  width: 260px;
  height: 260px;

  border-radius: 50%;

  background:
    rgba(212, 175, 55, 0.07);

  filter: blur(70px);
}

.identity-card__top {
  position: relative;

  display: flex;

  gap: 9px;

  align-items: center;

  color: #626262;
}

.identity-card__top small {
  font-size: 0.48rem;
  font-weight: 900;

  letter-spacing: 0.15em;
}

.status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    variables.$color-primary;

  box-shadow:
    0 0 13px
    rgba(212, 175, 55, 0.65);
}

.identity-card__brand {
  position: relative;

  display: flex;

  gap: 16px;

  align-items: center;

  margin-top: 28px;
}

.identity-card__brand img {
  width: auto;
  height: 88px;

  object-fit: contain;
}

.identity-card__brand small,
.identity-card__brand strong,
.identity-card__brand span {
  display: block;
}

.identity-card__brand small {
  color: #555;

  font-size: 0.45rem;
  font-weight: 900;

  letter-spacing: 0.14em;
}

.identity-card__brand strong {
  margin-top: 4px;

  font-size: 1.08rem;
}

.identity-card__brand span {
  margin-top: 4px;

  color: #6a6a6a;

  font-size: 0.61rem;
}

.identity-card__divider {
  height: 1px;

  margin: 28px 0;

  background: #292929;
}

.identity-card__contact {
  display: grid;

  gap: 1px;

  overflow: hidden;

  border: 1px solid #292929;

  border-radius: 12px;

  background: #292929;
}

.identity-card__contact article {
  padding: 15px;

  background: #0b0b0b;
}

.identity-card__contact small {
  display: block;

  margin-bottom: 6px;

  color: variables.$color-primary;

  font-size: 0.43rem;
  font-weight: 900;

  letter-spacing: 0.12em;
}

.identity-card__contact a {
  display: block;

  overflow-wrap: anywhere;

  color: #d0d0d0;

  font-size: 0.67rem;
  font-weight: 750;

  text-decoration: none;

  transition:
    color 0.2s ease;
}

.identity-card__contact a:hover {
  color:
    variables.$color-primary;
}

.identity-card__footer {
  display: flex;

  gap: 10px;

  margin-top: 18px;

  padding-top: 18px;

  border-top: 1px solid #282828;
}

.identity-card__footer > span {
  color:
    variables.$color-primary;
}

.identity-card__footer p {
  margin: 0;

  color: #656565;

  font-size: 0.6rem;

  line-height: 1.55;
}

/* =========================================================
   SECTION HEADER
========================================================= */

.section-header {
  display: grid;

  gap: 30px;

  margin-bottom: 50px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      1fr
      0.42fr;

    align-items: end;
  }
}

.section-header > p {
  margin: 0;

  color: #777;

  font-size: 0.78rem;

  line-height: 1.75;
}

/* =========================================================
   CHANNELS
========================================================= */

.channels {
  padding:
    130px
    24px;
}

.channels__grid {
  display: grid;

  gap: 12px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, 1fr);
  }

  @include mixins.respond-to(lg) {
    grid-template-columns:
      repeat(4, 1fr);
  }
}

.channel-card {
  display: flex;

  min-height: 365px;

  flex-direction: column;

  padding: 25px;

  border: 1px solid #292929;

  border-radius: 17px;

  color: #f5f5f5;

  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.012),
      transparent
    ),
    #0d0d0d;

  text-decoration: none;

  transition:
    transform 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.channel-card:hover {
  transform:
    translateY(-5px);

  border-color:
    rgba(212, 175, 55, 0.3);

  box-shadow:
    0 24px 60px
    rgba(0, 0, 0, 0.25);
}

.channel-card__top {
  display: flex;

  align-items: center;
  justify-content: space-between;
}

.channel-card__top > span {
  color:
    variables.$color-primary;

  font-size: 0.49rem;
  font-weight: 900;
}

.channel-card__top > strong {
  display: grid;

  width: 39px;
  height: 39px;

  place-items: center;

  border:
    1px solid
    rgba(212, 175, 55, 0.23);

  border-radius: 50%;

  color:
    variables.$color-primary;

  font-size: 0.55rem;
}

.channel-card > small {
  margin-top: 28px;

  color: variables.$color-primary;

  font-size: 0.45rem;
  font-weight: 900;

  letter-spacing: 0.13em;
}

.channel-card h3 {
  margin: 10px 0;

  font-size: 1.12rem;
}

.channel-card > p {
  margin: 0;

  color: #747474;

  font-size: 0.66rem;

  line-height: 1.65;
}

.channel-card__data {
  margin-top: auto;

  padding-top: 25px;

  overflow-wrap: anywhere;

  color: #bbb;

  font-size: 0.68rem;
  font-weight: 750;
}

.channel-card__data--email {
  font-size: 0.59rem;
}

.channel-card__action {
  display: flex;

  gap: 8px;

  align-items: center;

  justify-content: space-between;

  margin-top: 17px;

  padding-top: 17px;

  border-top: 1px solid #282828;

  color:
    variables.$color-primary;

  font-size: 0.53rem;
  font-weight: 900;
}

.channel-card__action span {
  transition:
    transform 0.2s ease;
}

.channel-card:hover
.channel-card__action span {
  transform:
    translate(
      2px,
      -2px
    );
}

/* =========================================================
   DEPARTMENTS
========================================================= */

.departments {
  padding:
    130px
    24px;

  background: #0b0b0b;
}

.departments__grid {
  display: grid;

  gap: 70px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.8fr
      1.2fr;
  }
}

.departments__heading {
  @include mixins.respond-to(lg) {
    position: sticky;

    top: 120px;

    align-self: start;
  }
}

.departments__heading > p {
  max-width: 470px;

  color: #777;

  font-size: 0.77rem;

  line-height: 1.75;
}

.departments__list {
  display: grid;

  gap: 10px;
}

.departments__list article {
  display: flex;

  gap: 18px;

  padding: 22px;

  border: 1px solid #292929;

  border-radius: 14px;

  background: #101010;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}

.departments__list article:hover {
  transform:
    translateX(4px);

  border-color:
    rgba(212, 175, 55, 0.22);
}

.departments__number {
  display: grid;

  width: 39px;
  height: 39px;

  flex: 0 0 auto;

  place-items: center;

  border:
    1px solid
    rgba(212, 175, 55, 0.23);

  border-radius: 50%;

  color:
    variables.$color-primary;

  font-size: 0.5rem;
  font-weight: 900;
}

.departments__list small {
  color:
    variables.$color-primary;

  font-size: 0.44rem;
  font-weight: 900;

  letter-spacing: 0.12em;
}

.departments__list h3 {
  margin: 5px 0;

  font-size: 0.86rem;
}

.departments__list p {
  margin: 0;

  color: #6d6d6d;

  font-size: 0.63rem;

  line-height: 1.55;
}

/* =========================================================
   FORM
========================================================= */

.form-section {
  padding:
    135px
    24px;
}

.form-layout {
  display: grid;

  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      0.8fr
      1.2fr;

    align-items: start;
  }
}

.form-info > p {
  max-width: 500px;

  margin-top: 24px;

  color: #777;

  font-size: 0.78rem;

  line-height: 1.75;
}

.form-info__notice {
  display: flex;

  gap: 11px;

  margin-top: 28px;

  padding: 16px;

  border:
    1px solid
    rgba(212, 175, 55, 0.16);

  border-radius: 11px;

  background:
    rgba(212, 175, 55, 0.025);
}

.form-info__notice > span {
  display: grid;

  width: 25px;
  height: 25px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 50%;

  color: #080808;

  background:
    variables.$color-primary;

  font-size: 0.55rem;
  font-weight: 900;
}

.form-info__notice p {
  margin: 2px 0 0;

  color: #727272;

  font-size: 0.63rem;

  line-height: 1.55;
}

.form-info__link {
  display: inline-flex;

  gap: 9px;

  align-items: center;

  margin-top: 20px;

  color:
    variables.$color-primary;

  font-size: 0.65rem;
  font-weight: 900;

  text-decoration: none;
}

/* =========================================================
   FORM CARD
========================================================= */

.contact-form {
  overflow: hidden;

  padding: 29px;

  border: 1px solid #292929;

  border-radius: 22px;

  background: #0d0d0d;

  box-shadow:
    0 35px 90px
    rgba(0, 0, 0, 0.25);
}

.contact-form__header {
  display: flex;

  gap: 20px;

  align-items: center;
  justify-content: space-between;

  padding-bottom: 21px;

  border-bottom: 1px solid #282828;
}

.contact-form__header small,
.contact-form__header strong {
  display: block;
}

.contact-form__header small {
  color:
    variables.$color-primary;

  font-size: 0.43rem;
  font-weight: 900;

  letter-spacing: 0.13em;
}

.contact-form__header strong {
  margin-top: 5px;

  font-size: 0.9rem;
}

.contact-form__header > span {
  display: grid;

  width: 42px;
  height: 42px;

  place-items: center;

  border:
    1px solid
    rgba(212, 175, 55, 0.25);

  border-radius: 50%;

  color:
    variables.$color-primary;

  font-size: 0.58rem;
  font-weight: 950;
}

.contact-form__grid {
  display: grid;

  gap: 18px;

  margin-top: 24px;

  @include mixins.respond-to(md) {
    grid-template-columns:
      repeat(2, 1fr);
  }
}

.field {
  display: grid;

  gap: 8px;
}

.field--full {
  grid-column:
    1 / -1;
}

.field > span {
  color: #c5c5c5;

  font-size: 0.65rem;
  font-weight: 700;
}

.field input,
.field select,
.field textarea {
  width: 100%;

  padding:
    14px
    15px;

  border: 1px solid #323232;

  border-radius: 9px;

  outline: none;

  color: #eee;

  background: #080808;

  font: inherit;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.field textarea {
  min-height: 140px;

  resize: vertical;
}

.field input::placeholder,
.field textarea::placeholder {
  color: #494949;
}

.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color:
    variables.$color-primary;

  box-shadow:
    0 0 0 3px
    rgba(212, 175, 55, 0.06);
}

.field__counter {
  justify-self: end;

  color: #4e4e4e;

  font-size: 0.51rem;
}

.contact-form__submit {
  display: flex;

  width: 100%;
  min-height: 54px;

  align-items: center;
  justify-content: space-between;

  margin-top: 23px;

  padding:
    0
    19px;

  border: 0;

  border-radius: 10px;

  color: #080808;

  background:
    variables.$color-primary;

  font: inherit;

  font-size: 0.72rem;
  font-weight: 900;

  cursor: pointer;

  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.contact-form__submit:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 17px 40px
    rgba(212, 175, 55, 0.14);
}

.contact-form__help {
  margin:
    11px
    0
    0;

  color: #555;

  font-size: 0.53rem;

  text-align: center;
}

/* =========================================================
   LOCATION
========================================================= */

.location {
  position: relative;

  overflow: hidden;

  padding:
    140px
    24px;

  background: #0b0b0b;
}

.location__grid-background {
  position: absolute;

  inset: 0;

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

  background-size:
    70px
    70px;
}

.location__layout {
  position: relative;

  z-index: 2;

  display: grid;

  gap: 75px;

  @include mixins.respond-to(lg) {
    grid-template-columns:
      1.1fr
      0.9fr;

    align-items: center;
  }
}

.location__layout > div:first-child > p {
  max-width: 550px;

  margin-top: 24px;

  color: #7b7b7b;

  font-size: 0.79rem;

  line-height: 1.75;
}

.location-card {
  position: relative;

  overflow: hidden;

  padding: 32px;

  border:
    1px solid
    rgba(212, 175, 55, 0.22);

  border-radius: 20px;

  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(212, 175, 55, 0.07),
      transparent 42%
    ),
    #0d0d0d;
}

.location-card__number {
  position: absolute;

  top: -20px;
  right: 10px;

  color:
    rgba(212, 175, 55, 0.05);

  font-size: 8rem;
  font-weight: 950;

  line-height: 1;
}

.location-card > small {
  position: relative;

  color:
    variables.$color-primary;

  font-size: 0.46rem;
  font-weight: 900;

  letter-spacing: 0.14em;
}

.location-card > strong {
  position: relative;

  display: block;

  margin-top: 15px;

  font-size: 2rem;
}

.location-card > p {
  position: relative;

  margin:
    9px
    0
    25px;

  color: #777;

  font-size: 0.72rem;

  line-height: 1.6;
}

.location-card > a {
  position: relative;

  display: flex;

  align-items: center;
  justify-content: space-between;

  padding:
    13px
    14px;

  border: 1px solid #333;

  border-radius: 9px;

  color: #bbb;

  font-size: 0.61rem;
  font-weight: 800;

  text-decoration: none;

  transition:
    color 0.2s ease,
    border-color 0.2s ease;
}

.location-card > a:hover {
  color:
    variables.$color-primary;

  border-color:
    variables.$color-primary;
}

/* =========================================================
   PRIVACY
========================================================= */

.privacy {
  padding:
    105px
    24px;
}

.privacy__grid {
  display: grid;

  gap: 35px;

  align-items: center;

  padding:
    35px;

  border: 1px solid #292929;

  border-radius: 20px;

  background:
    linear-gradient(
      135deg,
      rgba(212, 175, 55, 0.035),
      transparent
    ),
    #0d0d0d;

  @include mixins.respond-to(md) {
    grid-template-columns:
      auto
      1fr;
  }
}

.privacy__icon {
  display: grid;

  width: 100px;
  height: 100px;

  place-items: center;

  border:
    1px solid
    rgba(212, 175, 55, 0.25);

  border-radius: 50%;

  color:
    variables.$color-primary;

  font-size: 1rem;
  font-weight: 950;
}

.privacy h2 {
  max-width: 750px;

  margin: 13px 0 0;

  font-size:
    clamp(
      1.8rem,
      4vw,
      3.3rem
    );

  line-height: 1;

  letter-spacing: -0.045em;
}

.privacy p {
  max-width: 760px;

  margin:
    18px
    0
    0;

  color: #727272;

  font-size: 0.71rem;

  line-height: 1.7;
}

/* =========================================================
   CTA
========================================================= */

.cta {
  position: relative;

  overflow: hidden;

  padding:
    145px
    24px;

  background: #090909;
}

.cta__grid {
  position: absolute;

  inset: 0;

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

  background-size:
    70px
    70px;
}

.cta__glow {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 800px;
  height: 500px;

  border-radius: 50%;

  background:
    rgba(212, 175, 55, 0.07);

  transform:
    translate(-50%, -50%);

  filter: blur(170px);
}

.cta__content {
  position: relative;

  z-index: 2;

  display: grid;

  justify-items: center;

  text-align: center;
}

.cta h2 {
  max-width: 950px;

  margin: 18px 0 0;

  font-size:
    clamp(
      3.4rem,
      7vw,
      6.9rem
    );

  line-height: 0.89;

  letter-spacing: -0.07em;
}

.cta h2 em {
  display: block;

  color:
    variables.$color-primary;

  font-style: normal;
}

.cta p {
  max-width: 600px;

  margin:
    25px
    0
    30px;

  color: #818181;

  font-size: 0.82rem;

  line-height: 1.7;
}

.cta__actions {
  display: flex;

  gap: 10px;

  flex-wrap: wrap;

  justify-content: center;
}

.cta__content > small {
  margin-top: 22px;

  color: #4d4d4d;

  font-size: 0.47rem;
  font-weight: 800;

  letter-spacing: 0.11em;

  text-transform: uppercase;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 900px) {
  .hero {
    padding:
      145px
      20px
      95px;
  }

  .channels,
  .departments,
  .form-section,
  .location,
  .privacy,
  .cta {
    padding:
      95px
      20px;
  }
}

@media (max-width: 700px) {
  .hero {
    padding:
      130px
      17px
      80px;
  }

  .hero h1 {
    font-size:
      clamp(
        3.3rem,
        15vw,
        5.6rem
      );
  }

  .hero__actions {
    flex-direction: column;
  }

  .hero__actions .button {
    width: 100%;
  }

  .identity-card {
    padding: 23px;
  }

  .identity-card__brand {
    align-items: flex-start;
  }

  .identity-card__brand img {
    height: 72px;
  }

  .contact-form {
    padding: 22px;
  }

  .privacy__grid {
    padding: 25px;
  }

  .privacy__icon {
    width: 80px;
    height: 80px;
  }

  .cta__actions {
    width: 100%;

    flex-direction: column;
  }

  .cta__actions .button {
    width: 100%;
  }
}

@media (max-width: 500px) {
  .hero__facts {
    grid-template-columns: 1fr;
  }

  .identity-card__brand {
    flex-direction: column;
  }

  .identity-card__brand img {
    height: 78px;
  }

  .departments__list article {
    padding: 18px;
  }
}
</style>
