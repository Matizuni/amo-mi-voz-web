<template>
  <footer class="footer">
    <div class="container footer__container">
      <!-- =====================================================
           CABECERA DEL FOOTER
      ====================================================== -->
      <div class="footer__top">
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

          <div class="footer__brand-copy">
            <span class="footer__eyebrow">
              Academia de Talentos
            </span>

            <h2>
              Una voz se descubre.
              <br />
              También se construye.
            </h2>

            <p>
              Formación vocal, musical y escénica
              para aprender, expresarse y vivir
              experiencias reales sobre el escenario.
            </p>
          </div>
        </div>

        <RouterLink
          to="/inscripcion"
          class="footer__primary-action"
        >
          <span>
            <small>
              ¿Quieres ser parte?
            </small>

            <strong>
              Inscríbete en la Academia
            </strong>
          </span>

          <span
            class="footer__primary-arrow"
            aria-hidden="true"
          >
            →
          </span>
        </RouterLink>
      </div>

      <!-- =====================================================
           INFORMACIÓN
      ====================================================== -->
      <div class="footer__content">
        <!-- NAVEGACIÓN -->
        <nav
          class="footer__column"
          aria-label="Navegación del sitio"
        >
          <span class="footer__heading">
            Explorar
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
            Participar
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
        <div
          class="footer__column footer__contact"
        >
          <span class="footer__heading">
            Contacto
          </span>

          <a href="tel:+56959762385">
            +56 9 5976 2385
          </a>

          <a
            href="mailto:academiadetalentosamomivoz@gmail.com"
            class="footer__email"
          >
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
              <span aria-hidden="true">
                ↗
              </span>
            </a>

            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook de Amo Mi Voz"
            >
              Facebook
              <span aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>

        <!-- UBICACIÓN -->
        <div class="footer__column footer__place">
          <span class="footer__heading">
            Estamos en
          </span>

          <strong>
            La Calera
          </strong>

          <p>
            Región de Valparaíso
            <br />
            Chile
          </p>

          <div class="footer__location">
            <span
              class="footer__location-dot"
              aria-hidden="true"
            ></span>

            <span>
              Formación presencial
            </span>
          </div>
        </div>
      </div>

      <!-- =====================================================
           PIE INFERIOR
      ====================================================== -->
      <div class="footer__bottom">
        <p>
          © {{ currentYear }}
          Academia de Talentos Amo Mi Voz.
          Todos los derechos reservados.
        </p>

        <div class="footer__signature">
          <span>
            Voz
          </span>

          <i></i>

          <span>
            Música
          </span>

          <i></i>

          <span>
            Escenario
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

const currentYear = computed(
  () => new Date().getFullYear()
)
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   FOOTER
========================================================= */

.footer {
  position: relative;

  overflow: hidden;

  padding-block:
    clamp(
      5rem,
      9vw,
      8rem
    )
    2rem;

  border-top:
    1px solid
    variables.$color-border-soft;

  background:
    variables.$color-surface;
}

.footer::before {
  position: absolute;

  top: 0;
  left: 50%;

  width: min(
    900px,
    80vw
  );

  height: 1px;

  content: '';

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(
        variables.$color-primary,
        0.45
      ),
      transparent
    );

  transform:
    translateX(-50%);
}

/* =========================================================
   CONTENEDOR
========================================================= */

.footer__container {
  position: relative;
}

/* =========================================================
   TOP
========================================================= */

.footer__top {
  display: grid;

  gap:
    clamp(
      2.5rem,
      6vw,
      6rem
    );

  align-items: end;

  padding-bottom:
    clamp(
      3.5rem,
      7vw,
      6rem
    );

  border-bottom:
    1px solid
    variables.$color-border-soft;
}

/* =========================================================
   MARCA
========================================================= */

.footer__brand {
  display: grid;

  max-width:
    720px;

  gap:
    2rem;
}

.footer__logo {
  display: inline-flex;

  width:
    fit-content;

  border-radius:
    variables.$radius-sm;
}

.footer__logo img {
  width: auto;
  height: 76px;

  object-fit: contain;

  transition:
    opacity
      variables.$transition-normal,
    transform
      variables.$transition-normal;
}

.footer__logo:hover img {
  opacity: 0.9;

  transform:
    translateY(-2px);
}

.footer__brand-copy {
  max-width:
    650px;
}

.footer__eyebrow {
  display: block;

  margin-bottom:
    1rem;

  color:
    variables.$color-primary;

  font-family:
    variables.$font-family-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.14em;

  text-transform:
    uppercase;
}

.footer__brand-copy h2 {
  max-width:
    650px;

  margin-bottom:
    1.25rem;

  color:
    variables.$color-text-primary;

  font-size:
    clamp(
      2.25rem,
      5vw,
      4.5rem
    );

  line-height:
    0.98;

  letter-spacing:
    -0.04em;
}

.footer__brand-copy p {
  max-width:
    570px;

  color:
    variables.$color-text-secondary;

  font-size:
    clamp(
      1rem,
      1.5vw,
      1.075rem
    );

  line-height:
    1.75;
}

/* =========================================================
   CTA PRINCIPAL
========================================================= */

.footer__primary-action {
  display: flex;

  width: 100%;
  max-width:
    360px;

  min-height:
    88px;

  gap:
    1.5rem;

  align-items: center;
  justify-content: space-between;

  padding:
    1rem
    1.4rem;

  border-radius:
    variables.$radius-lg;

  color:
    variables.$color-black;

  background:
    variables.$color-primary;

  box-shadow:
    variables.$shadow-primary;
}

.footer__primary-action:hover {
  background:
    variables.$color-primary-light;

  transform:
    translateY(-2px);
}

.footer__primary-action small,
.footer__primary-action strong {
  display: block;
}

.footer__primary-action small {
  margin-bottom:
    0.35rem;

  color:
    rgba(
      variables.$color-black,
      0.6
    );

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.08em;

  text-transform:
    uppercase;
}

.footer__primary-action strong {
  color:
    variables.$color-black;

  font-family:
    variables.$font-family-primary;

  font-size:
    1rem;

  font-weight:
    variables.$font-weight-bold;

  line-height:
    1.3;
}

.footer__primary-arrow {
  flex:
    0 0 auto;

  font-size:
    1.4rem;

  transition:
    transform
      variables.$transition-fast;
}

.footer__primary-action:hover
.footer__primary-arrow {
  transform:
    translateX(4px);
}

/* =========================================================
   CONTENIDO
========================================================= */

.footer__content {
  display: grid;

  gap:
    3rem
    2rem;

  padding-block:
    clamp(
      3rem,
      6vw,
      5rem
    );

  border-bottom:
    1px solid
    variables.$color-border-soft;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

/* =========================================================
   COLUMNAS
========================================================= */

.footer__column {
  display: flex;

  min-width: 0;

  flex-direction: column;
  align-items: flex-start;

  gap:
    0.9rem;
}

.footer__heading {
  margin-bottom:
    0.5rem;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.12em;

  text-transform:
    uppercase;
}

.footer__column a {
  color:
    variables.$color-text-secondary;

  font-size:
    0.925rem;

  font-weight:
    variables.$font-weight-medium;

  line-height:
    1.45;

  transition:
    color
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.footer__column a:hover {
  color:
    variables.$color-text-primary;

  transform:
    translateX(3px);
}

/* =========================================================
   CONTACTO
========================================================= */

.footer__contact {
  min-width: 0;
}

.footer__email {
  max-width: 100%;

  overflow-wrap:
    anywhere;
}

.footer__social {
  display: flex;

  gap:
    1.25rem;

  flex-wrap: wrap;

  margin-top:
    0.5rem;
}

.footer__social a {
  display: inline-flex;

  gap:
    0.35rem;

  align-items: center;

  color:
    variables.$color-text-primary;
}

.footer__social a span {
  color:
    variables.$color-primary;
}

/* =========================================================
   UBICACIÓN
========================================================= */

.footer__place strong {
  color:
    variables.$color-text-primary;

  font-family:
    variables.$font-family-heading;

  font-size:
    1.5rem;

  line-height:
    1.2;
}

.footer__place p {
  color:
    variables.$color-text-secondary;

  font-size:
    0.9rem;

  line-height:
    1.65;
}

.footer__location {
  display: flex;

  gap:
    0.6rem;

  align-items: center;

  margin-top:
    0.5rem;

  color:
    variables.$color-text-muted;

  font-size:
    0.825rem;

  font-weight:
    variables.$font-weight-medium;
}

.footer__location-dot {
  width: 7px;
  height: 7px;

  flex:
    0 0 auto;

  border-radius:
    50%;

  background:
    variables.$color-primary;
}

/* =========================================================
   BOTTOM
========================================================= */

.footer__bottom {
  display: flex;

  gap:
    1.5rem;

  align-items: center;
  justify-content: space-between;

  padding-top:
    1.75rem;
}

.footer__bottom p {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  line-height:
    1.6;
}

.footer__signature {
  display: flex;

  flex: 0 0 auto;

  gap:
    0.65rem;

  align-items: center;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;

  letter-spacing:
    0.06em;

  text-transform:
    uppercase;
}

.footer__signature i {
  display: block;

  width: 3px;
  height: 3px;

  border-radius:
    50%;

  background:
    variables.$color-primary;
}

/* =========================================================
   DESKTOP
========================================================= */

@media (min-width: 900px) {
  .footer__top {
    grid-template-columns:
      minmax(0, 1fr)
      auto;
  }

  .footer__content {
    grid-template-columns:
      minmax(120px, 0.75fr)
      minmax(120px, 0.75fr)
      minmax(260px, 1.4fr)
      minmax(180px, 1fr);
  }
}

/* =========================================================
   TABLET
========================================================= */

@media (
  min-width: 600px
) and (
  max-width: 899px
) {
  .footer__primary-action {
    max-width:
      420px;
  }

  .footer__content {
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

@media (max-width: 599px) {
  .footer {
    padding-top:
      4.5rem;
  }

  .footer__logo img {
    height:
      66px;
  }

  .footer__brand {
    gap:
      1.5rem;
  }

  .footer__brand-copy h2 {
    font-size:
      clamp(
        2.2rem,
        11vw,
        3.25rem
      );
  }

  .footer__brand-copy p {
    font-size:
      0.975rem;
  }

  .footer__primary-action {
    max-width:
      none;
  }

  .footer__content {
    gap:
      2.75rem
      1.5rem;

    grid-template-columns:
      repeat(
        2,
        minmax(0, 1fr)
      );
  }

  .footer__contact,
  .footer__place {
    grid-column:
      1 / -1;
  }

  .footer__bottom {
    align-items:
      flex-start;

    flex-direction:
      column;
  }
}

/* =========================================================
   MOBILE PEQUEÑO
========================================================= */

@media (max-width: 390px) {
  .footer__content {
    grid-template-columns:
      1fr;
  }

  .footer__contact,
  .footer__place {
    grid-column:
      auto;
  }

  .footer__signature {
    flex-wrap:
      wrap;
  }
}
</style>
