<template>
  <footer class="footer">
    <div class="footer__glow" aria-hidden="true"></div>

    <div class="footer__container">

      <!-- =====================================================
           PRINCIPAL
      ====================================================== -->
      <div class="footer__main">

        <!-- MARCA -->
        <div class="footer__brand">
          <RouterLink
            to="/"
            class="footer__logo"
            aria-label="Ir al inicio de Amo Mi Voz"
          >
            <img
              :src="logo"
              alt="Academia de Talentos Amo Mi Voz"
              loading="lazy"
            />
          </RouterLink>

          <p class="footer__description">
            Formación musical, desarrollo vocal y experiencias escénicas
            para descubrir, comprender y expresar tu propia voz.
          </p>

          <div class="footer__location">
            <span class="footer__location-dot"></span>

            <span>
              La Calera · Región de Valparaíso
            </span>
          </div>
        </div>

        <!-- NAVEGACIÓN -->
        <nav
          class="footer__column"
          aria-label="Navegación del sitio"
        >
          <span class="footer__heading">
            EXPLORAR
          </span>

          <RouterLink to="/academia">
            Academia
          </RouterLink>

          <RouterLink to="/formacion">
            Formación
          </RouterLink>

          <RouterLink to="/musicales">
            Musicales
          </RouterLink>

          <RouterLink to="/galeria">
            Galería
          </RouterLink>
        </nav>

        <!-- PARTICIPAR -->
        <nav
          class="footer__column"
          aria-label="Participar en Amo Mi Voz"
        >
          <span class="footer__heading">
            PARTICIPAR
          </span>

          <RouterLink to="/inscripcion">
            Inscríbete
          </RouterLink>

          <RouterLink to="/contacto">
            Contacto
          </RouterLink>

          <RouterLink to="/aula">
            Aula Virtual
          </RouterLink>
        </nav>

        <!-- CONTACTO -->
        <div class="footer__column footer__contact">
          <span class="footer__heading">
            CONTACTO
          </span>

          <a href="tel:+56959762385">
            +56 9 5976 2385
          </a>

          <a href="mailto:academiadetalentosamomivoz@gmail.com">
            academiadetalentosamomivoz@gmail.com
          </a>

          <div class="footer__social">
            <a
              href="https://www.instagram.com/amomivoz_academia/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram de Amo Mi Voz"
            >
              Instagram
              <span aria-hidden="true">↗</span>
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Amo Mi Voz"
            >
              Facebook
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>

      </div>

      <!-- =====================================================
           DIVISOR
      ====================================================== -->
      <div class="footer__divider"></div>

      <!-- =====================================================
           PIE INFERIOR
      ====================================================== -->
      <div class="footer__bottom">

        <p>
          © {{ currentYear }} Academia de Talentos Amo Mi Voz.
          Todos los derechos reservados.
        </p>

        <div class="footer__signature">
          <span class="footer__signature-line"></span>

          <span>
            Música · Formación · Comunidad
          </span>
        </div>

      </div>

    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

import logo from '@/assets/images/logo.png'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   FOOTER
========================================================= */

.footer {
  position: relative;
  overflow: hidden;
  padding: 72px 24px 28px;
  border-top: 1px solid #1f1f1f;
  background:
    radial-gradient(
      circle at 10% 20%,
      rgba(244, 196, 48, 0.045),
      transparent 28%
    ),
    #050505;
}

.footer__glow {
  position: absolute;
  top: -250px;
  left: -180px;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  pointer-events: none;
  background:
    rgba(244, 196, 48, 0.035);
  filter: blur(110px);
}

.footer__container {
  position: relative;
  z-index: 2;
  width: min(1180px, 100%);
  margin: 0 auto;
}

/* =========================================================
   MAIN
========================================================= */

.footer__main {
  display: grid;
  gap: 48px;
}

/* =========================================================
   BRAND
========================================================= */

.footer__brand {
  max-width: 380px;
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  margin-bottom: 22px;
}

.footer__logo:focus-visible {
  outline: 2px solid variables.$color-primary;
  outline-offset: 5px;
}

.footer__logo img {
  display: block;
  width: auto;
  max-width: 165px;
  height: 70px;
  object-fit: contain;
}

.footer__description {
  max-width: 355px;
  margin: 0;
  color: #777;
  font-size: 0.77rem;
  line-height: 1.7;
}

.footer__location {
  display: flex;
  gap: 9px;
  align-items: center;
  margin-top: 23px;
  color: #555;
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.05em;
}

.footer__location-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: variables.$color-primary;
  box-shadow:
    0 0 12px
    rgba(244, 196, 48, 0.45);
}

/* =========================================================
   COLUMNS
========================================================= */

.footer__column {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 13px;
}

.footer__heading {
  margin-bottom: 7px;
  color: variables.$color-primary;
  font-size: 0.53rem;
  font-weight: 900;
  letter-spacing: 0.19em;
}

.footer__column a {
  position: relative;
  color: #777;
  font-size: 0.7rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.footer__column a:hover {
  color: #e6e6e6;
  transform: translateX(2px);
}

.footer__column a:focus-visible {
  outline: 2px solid variables.$color-primary;
  outline-offset: 4px;
}

/* =========================================================
   CONTACT
========================================================= */

.footer__contact {
  min-width: 0;
}

.footer__contact > a {
  max-width: 100%;
  overflow-wrap: anywhere;
}

.footer__social {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.footer__social a {
  display: inline-flex;
  gap: 5px;
  align-items: center;
  color: #999;
}

.footer__social a span {
  color: variables.$color-primary;
}

/* =========================================================
   DIVIDER
========================================================= */

.footer__divider {
  height: 1px;
  margin: 54px 0 24px;
  background:
    linear-gradient(
      90deg,
      rgba(244, 196, 48, 0.25),
      #242424 22%,
      #242424 78%,
      transparent
    );
}

/* =========================================================
   BOTTOM
========================================================= */

.footer__bottom {
  display: flex;
  gap: 22px;
  align-items: center;
  justify-content: space-between;
}

.footer__bottom p {
  margin: 0;
  color: #464646;
  font-size: 0.56rem;
  line-height: 1.6;
}

.footer__signature {
  display: flex;
  gap: 11px;
  align-items: center;
  color: #444;
  font-size: 0.5rem;
  font-weight: 750;
  letter-spacing: 0.09em;
  text-transform: uppercase;
}

.footer__signature-line {
  width: 28px;
  height: 1px;
  background: variables.$color-primary;
  opacity: 0.55;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .footer__main {
    grid-template-columns:
      minmax(320px, 1.6fr)
      minmax(120px, 0.65fr)
      minmax(120px, 0.65fr)
      minmax(230px, 1fr);
    gap: 55px;
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (min-width: 600px) and (max-width: 899px) {
  .footer__main {
    grid-template-columns:
      minmax(0, 1.5fr)
      repeat(2, minmax(120px, 0.75fr));
  }

  .footer__contact {
    grid-column: 1 / -1;
  }
}

/* =========================================================
   MOBILE
========================================================= */

@media (max-width: 599px) {
  .footer {
    padding:
      58px
      18px
      24px;
  }

  .footer__main {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
    gap:
      38px
      24px;
  }

  .footer__brand,
  .footer__contact {
    grid-column: 1 / -1;
  }

  .footer__logo img {
    height: 62px;
    max-width: 150px;
  }

  .footer__divider {
    margin-top: 42px;
  }

  .footer__bottom {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* =========================================================
   SMALL MOBILE
========================================================= */

@media (max-width: 390px) {
  .footer__main {
    grid-template-columns: 1fr;
  }

  .footer__brand,
  .footer__contact {
    grid-column: auto;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (prefers-reduced-motion: reduce) {
  .footer__column a {
    transition: none;
  }
}
</style>
