<template>
  <header
    class="navbar"
    :class="{
      'navbar--scrolled': isScrolled,
      'navbar--menu-open': isMenuOpen
    }"
  >
    <div class="container navbar__container">
      <!-- =====================================================
           MARCA
      ====================================================== -->
      <RouterLink
        to="/"
        class="navbar__brand"
        aria-label="Ir al inicio de Amo Mi Voz"
        @click="closeMenu"
      >
        <img
          :src="logo"
          alt="Academia de Talentos Amo Mi Voz"
          class="navbar__logo"
        />
      </RouterLink>

      <!-- =====================================================
           NAVEGACIÓN DESKTOP
      ====================================================== -->
      <nav
        class="navbar__navigation"
        aria-label="Navegación principal"
      >
        <RouterLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
          class="navbar__link"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- =====================================================
           ACCIONES DESKTOP
      ====================================================== -->
      <div class="navbar__actions">
        <RouterLink
          to="/aula"
          class="navbar__action navbar__action--secondary"
        >
          <span
            class="navbar__action-icon"
            aria-hidden="true"
          >
            ♪
          </span>

          <span>
            Aula Virtual
          </span>
        </RouterLink>

        <RouterLink
          to="/inscripcion"
          class="navbar__action navbar__action--primary"
        >
          <span>
            Inscríbete
          </span>

          <span
            class="navbar__action-arrow"
            aria-hidden="true"
          >
            →
          </span>
        </RouterLink>
      </div>

      <!-- =====================================================
           BOTÓN MOBILE
      ====================================================== -->
      <button
        type="button"
        class="navbar__toggle"
        :class="{
          'navbar__toggle--active': isMenuOpen
        }"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-navigation"
        :aria-label="
          isMenuOpen
            ? 'Cerrar menú'
            : 'Abrir menú'
        "
        @click="toggleMenu"
      >
        <span class="navbar__toggle-lines">
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>
    </div>
  </header>

  <!-- =========================================================
       MENÚ MOBILE

       Se mantiene Teleport para evitar problemas con:
       z-index, overflow y stacking contexts del navbar.
  ========================================================== -->
  <Teleport to="body">
    <Transition name="mobile-menu">
      <div
        v-if="isMenuOpen"
        id="mobile-navigation"
        class="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menú principal"
      >
        <button
          type="button"
          class="mobile-menu__backdrop"
          aria-label="Cerrar menú"
          @click="closeMenu"
        ></button>

        <div
          class="mobile-menu__panel"
          @click.stop
        >
          <!-- ===============================================
               CABECERA
          ================================================ -->
          <header class="mobile-menu__header">
            <RouterLink
              to="/"
              class="mobile-menu__brand"
              @click="closeMenu"
            >
              <img
                :src="logo"
                alt="Academia de Talentos Amo Mi Voz"
              />

              <div class="mobile-menu__brand-copy">
                <span>
                  Academia de Talentos
                </span>

                <strong>
                  Amo Mi Voz
                </strong>
              </div>
            </RouterLink>

            <button
              type="button"
              class="mobile-menu__close"
              aria-label="Cerrar menú"
              @click="closeMenu"
            >
              <span></span>
              <span></span>
            </button>
          </header>

          <!-- ===============================================
               CONTENIDO
          ================================================ -->
          <div class="mobile-menu__content">
            <div class="mobile-menu__intro">
              <span class="mobile-menu__eyebrow">
                Navegación
              </span>

              <p>
                Formación musical,
                expresión y escenario.
              </p>
            </div>

            <!-- =============================================
                 NAVEGACIÓN
            ============================================== -->
            <nav
              class="mobile-menu__navigation"
              aria-label="Navegación móvil"
            >
              <RouterLink
                v-for="(item, index) in navigation"
                :key="item.path"
                :to="item.path"
                class="mobile-menu__link"
                @click="closeMenu"
              >
                <span class="mobile-menu__index">
                  {{
                    String(index + 1)
                      .padStart(2, '0')
                  }}
                </span>

                <span class="mobile-menu__label">
                  {{ item.label }}
                </span>

                <span
                  class="mobile-menu__arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </RouterLink>
            </nav>

            <!-- =============================================
                 ACCESOS
            ============================================== -->
            <section class="mobile-menu__access">
              <span class="mobile-menu__eyebrow">
                Accesos
              </span>

              <RouterLink
                to="/aula"
                class="mobile-menu__aula"
                @click="closeMenu"
              >
                <span
                  class="mobile-menu__aula-icon"
                  aria-hidden="true"
                >
                  ♪
                </span>

                <span class="mobile-menu__aula-copy">
                  <strong>
                    Aula Virtual
                  </strong>

                  <span>
                    Clases, materiales y progreso
                  </span>
                </span>

                <span
                  class="mobile-menu__access-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </RouterLink>

              <RouterLink
                to="/inscripcion"
                class="mobile-menu__cta"
                @click="closeMenu"
              >
                <span>
                  <small>
                    Quiero ser parte
                  </small>

                  <strong>
                    Inscríbete
                  </strong>
                </span>

                <span
                  class="mobile-menu__cta-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </RouterLink>
            </section>

            <!-- =============================================
                 INFORMACIÓN
            ============================================== -->
            <div class="mobile-menu__meta">
              <div>
                <span>
                  Formación
                </span>

                <strong>
                  Voz · Música · Escenario
                </strong>
              </div>

              <div>
                <span>
                  Ubicación
                </span>

                <strong>
                  La Calera · Chile
                </strong>
              </div>
            </div>
          </div>

          <!-- ===============================================
               PIE
          ================================================ -->
          <footer class="mobile-menu__footer">
            <span>
              Amo Mi Voz
            </span>

            <span class="mobile-menu__footer-line"></span>

            <span>
              Academia de Talentos
            </span>
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  ref,
  watch
} from 'vue'

import {
  useRoute
} from 'vue-router'

import logo from '@/assets/images/logo.png'

const route = useRoute()

const isMenuOpen = ref(false)
const isScrolled = ref(false)

const navigation = [
  {
    label: 'Academia',
    path: '/academia'
  },
  {
    label: 'Formación',
    path: '/formacion'
  },
  {
    label: 'Musicales',
    path: '/musicales'
  },
  {
    label: 'Galería',
    path: '/galeria'
  },
  {
    label: 'Contacto',
    path: '/contacto'
  }
]

function toggleMenu() {
  isMenuOpen.value =
    !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

function handleScroll() {
  isScrolled.value =
    window.scrollY > 24
}

function handleKeydown(event) {
  if (
    event.key === 'Escape' &&
    isMenuOpen.value
  ) {
    closeMenu()
  }
}

watch(
  isMenuOpen,
  isOpen => {
    if (isOpen) {
      const scrollbarWidth =
        window.innerWidth -
        document.documentElement.clientWidth

      document.body.style.overflow =
        'hidden'

      if (scrollbarWidth > 0) {
        document.body.style.paddingRight =
          `${scrollbarWidth}px`
      }

      return
    }

    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }
)

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  }
)

onMounted(() => {
  handleScroll()

  window.addEventListener(
    'scroll',
    handleScroll,
    {
      passive: true
    }
  )

  window.addEventListener(
    'keydown',
    handleKeydown
  )
})

onUnmounted(() => {
  window.removeEventListener(
    'scroll',
    handleScroll
  )

  window.removeEventListener(
    'keydown',
    handleKeydown
  )

  document.body.style.overflow = ''
  document.body.style.paddingRight = ''
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

/* =========================================================
   NAVBAR
========================================================= */

.navbar {
  position: fixed;
  z-index: variables.$z-header;
  top: 0;
  right: 0;
  left: 0;

  border-bottom:
    1px solid
    transparent;

  background:
    rgba(
      variables.$color-background,
      0.62
    );

  backdrop-filter:
    blur(18px)
    saturate(120%);

  -webkit-backdrop-filter:
    blur(18px)
    saturate(120%);

  transition:
    background-color
      variables.$transition-normal,
    border-color
      variables.$transition-normal,
    box-shadow
      variables.$transition-normal;
}

.navbar--scrolled {
  border-bottom-color:
    variables.$color-border-soft;

  background:
    rgba(
      variables.$color-background,
      0.94
    );

  box-shadow:
    0 12px 35px
    rgba(
      variables.$color-black,
      0.22
    );
}

/* =========================================================
   CONTENEDOR
========================================================= */

.navbar__container {
  display: flex;
  min-height: 88px;

  gap:
    clamp(
      1rem,
      2vw,
      2rem
    );

  align-items: center;
  justify-content: space-between;
}

/* =========================================================
   MARCA
========================================================= */

.navbar__brand {
  display: flex;
  flex: 0 0 auto;
  align-items: center;

  border-radius:
    variables.$radius-sm;
}

.navbar__logo {
  width: auto;
  height: 68px;

  object-fit: contain;

  transition:
    transform
      variables.$transition-normal,
    opacity
      variables.$transition-normal;
}

.navbar__brand:hover
.navbar__logo {
  transform:
    translateY(-1px);

  opacity: 0.92;
}

/* =========================================================
   NAVEGACIÓN DESKTOP
========================================================= */

.navbar__navigation {
  display: none;
  flex: 1;

  gap:
    clamp(
      1.2rem,
      2vw,
      2.25rem
    );

  align-items: center;
  justify-content: center;

  @include mixins.respond-to(lg) {
    display: flex;
  }
}

.navbar__link {
  position: relative;

  padding:
    0.7rem
    0;

  color:
    variables.$color-text-secondary;

  font-family:
    variables.$font-family-primary;

  font-size:
    0.875rem;

  font-weight:
    variables.$font-weight-medium;

  line-height: 1;

  white-space: nowrap;

  transition:
    color
      variables.$transition-fast;
}

.navbar__link::after {
  position: absolute;

  right: 50%;
  bottom: 0.15rem;
  left: 50%;

  height: 2px;

  content: '';

  border-radius:
    variables.$radius-pill;

  background:
    variables.$color-primary;

  transition:
    right
      variables.$transition-normal,
    left
      variables.$transition-normal;
}

.navbar__link:hover,
.navbar__link.router-link-active {
  color:
    variables.$color-text-primary;
}

.navbar__link:hover::after,
.navbar__link.router-link-active::after {
  right: 0;
  left: 0;
}

/* =========================================================
   ACCIONES DESKTOP
========================================================= */

.navbar__actions {
  display: none;
  flex: 0 0 auto;

  gap:
    variables.$spacing-sm;

  align-items: center;

  @include mixins.respond-to(lg) {
    display: flex;
  }
}

.navbar__action {
  display: inline-flex;

  min-height:
    variables.$control-height-md;

  gap:
    0.65rem;

  align-items: center;
  justify-content: center;

  padding:
    0
    1rem;

  border-radius:
    variables.$radius-md;

  font-family:
    variables.$font-family-primary;

  font-size:
    0.825rem;

  font-weight:
    variables.$font-weight-semibold;

  line-height: 1;

  white-space: nowrap;
}

.navbar__action--secondary {
  border:
    1px solid
    variables.$color-border;

  color:
    variables.$color-text-primary;

  background:
    rgba(
      variables.$color-white,
      0.025
    );
}

.navbar__action--secondary:hover {
  border-color:
    variables.$color-border-strong;

  background:
    rgba(
      variables.$color-white,
      0.05
    );

  transform:
    translateY(-1px);
}

.navbar__action-icon {
  display: grid;

  width: 28px;
  height: 28px;

  place-items: center;

  border-radius:
    50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.1
    );

  font-size:
    0.9rem;
}

.navbar__action--primary {
  color:
    variables.$color-black;

  background:
    variables.$color-primary;

  box-shadow:
    variables.$shadow-primary;
}

.navbar__action--primary:hover {
  background:
    variables.$color-primary-light;

  transform:
    translateY(-1px);
}

.navbar__action-arrow {
  transition:
    transform
      variables.$transition-fast;
}

.navbar__action--primary:hover
.navbar__action-arrow {
  transform:
    translateX(3px);
}

/* =========================================================
   BOTÓN MOBILE
========================================================= */

.navbar__toggle {
  display: grid;

  width: 48px;
  height: 48px;

  flex: 0 0 auto;

  place-items: center;

  padding: 0;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  color:
    variables.$color-text-primary;

  background:
    rgba(
      variables.$color-white,
      0.025
    );

  cursor: pointer;

  @include mixins.respond-to(lg) {
    display: none;
  }
}

.navbar__toggle:hover,
.navbar__toggle--active {
  border-color:
    variables.$color-border-strong;

  background:
    rgba(
      variables.$color-white,
      0.05
    );
}

.navbar__toggle-lines {
  display: flex;

  width: 22px;
  height: 16px;

  flex-direction: column;
  justify-content: space-between;
}

.navbar__toggle-lines span {
  display: block;

  width: 100%;
  height: 2px;

  border-radius:
    variables.$radius-pill;

  background:
    currentColor;

  transition:
    transform
      variables.$transition-normal,
    opacity
      variables.$transition-fast;
}

.navbar__toggle--active
.navbar__toggle-lines
span:nth-child(1) {
  transform:
    translateY(7px)
    rotate(45deg);
}

.navbar__toggle--active
.navbar__toggle-lines
span:nth-child(2) {
  opacity: 0;
}

.navbar__toggle--active
.navbar__toggle-lines
span:nth-child(3) {
  transform:
    translateY(-7px)
    rotate(-45deg);
}

/* =========================================================
   TABLET / MOBILE
========================================================= */

@media (max-width: 1023px) {
  .navbar__container {
    min-height:
      calc(
        80px +
        env(safe-area-inset-top)
      );

    padding-top:
      env(safe-area-inset-top);
  }

  .navbar__logo {
    height: 60px;
  }
}

@media (max-width: 520px) {
  .navbar__container {
    min-height:
      calc(
        76px +
        env(safe-area-inset-top)
      );
  }

  .navbar__logo {
    height: 54px;
  }

  .navbar__toggle {
    width: 46px;
    height: 46px;
  }
}
</style>

<!-- =========================================================
     MENÚ MOBILE

     No puede ser scoped porque está dentro de Teleport.
========================================================== -->

<style lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   CONTENEDOR GENERAL
========================================================= */

.mobile-menu {
  position: fixed;
  z-index: 50000;

  inset: 0;

  width: 100%;

  height: 100vh;
  height: 100dvh;

  overflow: hidden;

  color:
    variables.$color-text-primary;

  isolation: isolate;
}

/* =========================================================
   BACKDROP
========================================================= */

.mobile-menu__backdrop {
  position: absolute;

  z-index: -1;

  inset: 0;

  width: 100%;
  height: 100%;

  padding: 0;

  border: 0;

  background:
    rgba(
      variables.$color-black,
      0.78
    );

  backdrop-filter:
    blur(8px);

  -webkit-backdrop-filter:
    blur(8px);

  cursor: default;
}

/* =========================================================
   PANEL
========================================================= */

.mobile-menu__panel {
  position: relative;

  display: flex;

  width: min(
    100%,
    560px
  );

  height: 100%;

  margin-left: auto;

  flex-direction: column;

  background:
    variables.$color-background;

  border-left:
    1px solid
    variables.$color-border-soft;

  box-shadow:
    -30px 0 80px
    rgba(
      variables.$color-black,
      0.35
    );

  padding-top:
    env(safe-area-inset-top);
}

/* =========================================================
   HEADER
========================================================= */

.mobile-menu__header {
  display: flex;

  min-height: 96px;

  flex: 0 0 auto;

  gap:
    variables.$spacing-lg;

  align-items: center;
  justify-content: space-between;

  padding:
    1rem
    max(
      1.25rem,
      env(safe-area-inset-right)
    )
    1rem
    max(
      1.25rem,
      env(safe-area-inset-left)
    );

  border-bottom:
    1px solid
    variables.$color-border-soft;
}

.mobile-menu__brand {
  display: flex;

  min-width: 0;

  gap:
    0.85rem;

  align-items: center;
}

.mobile-menu__brand img {
  width: auto;
  height: 58px;

  flex: 0 0 auto;

  object-fit: contain;
}

.mobile-menu__brand-copy {
  display: flex;

  min-width: 0;

  flex-direction: column;

  gap:
    0.15rem;
}

.mobile-menu__brand-copy span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-medium;

  letter-spacing:
    0.08em;

  text-transform:
    uppercase;
}

.mobile-menu__brand-copy strong {
  color:
    variables.$color-text-primary;

  font-family:
    variables.$font-family-heading;

  font-size:
    1.1rem;

  line-height:
    1.1;
}

/* =========================================================
   CERRAR
========================================================= */

.mobile-menu__close {
  position: relative;

  display: grid;

  width: 48px;
  height: 48px;

  flex: 0 0 auto;

  place-items: center;

  padding: 0;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-md;

  background:
    rgba(
      variables.$color-white,
      0.025
    );

  cursor: pointer;
}

.mobile-menu__close:hover {
  border-color:
    variables.$color-border-strong;

  background:
    rgba(
      variables.$color-white,
      0.05
    );
}

.mobile-menu__close span {
  position: absolute;

  width: 22px;
  height: 2px;

  border-radius:
    variables.$radius-pill;

  background:
    variables.$color-text-primary;
}

.mobile-menu__close
span:first-child {
  transform:
    rotate(45deg);
}

.mobile-menu__close
span:last-child {
  transform:
    rotate(-45deg);
}

/* =========================================================
   CONTENIDO
========================================================= */

.mobile-menu__content {
  width: min(
    100%,
    480px
  );

  flex: 1;

  margin:
    0
    auto;

  overflow-x: hidden;
  overflow-y: auto;

  padding:
    2rem
    1.5rem
    2.5rem;

  overscroll-behavior:
    contain;
}

.mobile-menu__intro {
  margin-bottom:
    1.75rem;
}

.mobile-menu__intro p {
  max-width:
    23rem;

  margin-top:
    0.65rem;

  color:
    variables.$color-text-secondary;

  font-size:
    1rem;

  line-height:
    1.65;
}

.mobile-menu__eyebrow {
  color:
    variables.$color-primary;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.12em;

  text-transform:
    uppercase;
}

/* =========================================================
   LINKS
========================================================= */

.mobile-menu__navigation {
  border-top:
    1px solid
    variables.$color-border-soft;
}

.mobile-menu__link {
  position: relative;

  display: flex;

  min-height: 70px;

  gap:
    1rem;

  align-items: center;

  border-bottom:
    1px solid
    variables.$color-border-soft;

  color:
    variables.$color-text-secondary;
}

.mobile-menu__link:hover,
.mobile-menu__link.router-link-active {
  color:
    variables.$color-text-primary;
}

.mobile-menu__index {
  width:
    2rem;

  flex:
    0 0 auto;

  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  font-variant-numeric:
    tabular-nums;
}

.mobile-menu__label {
  flex: 1;

  font-family:
    variables.$font-family-heading;

  font-size:
    clamp(
      1.35rem,
      5vw,
      1.8rem
    );

  font-weight:
    variables.$font-weight-bold;

  line-height:
    1.1;
}

.mobile-menu__arrow {
  color:
    variables.$color-text-muted;

  font-size:
    1.1rem;

  transition:
    color
      variables.$transition-fast,
    transform
      variables.$transition-fast;
}

.mobile-menu__link:hover
.mobile-menu__arrow,
.mobile-menu__link.router-link-active
.mobile-menu__arrow {
  color:
    variables.$color-primary;

  transform:
    translateX(4px);
}

.mobile-menu__link.router-link-active
.mobile-menu__index {
  color:
    variables.$color-primary;
}

/* =========================================================
   ACCESOS
========================================================= */

.mobile-menu__access {
  margin-top:
    2.5rem;
}

.mobile-menu__aula {
  display: flex;

  min-height:
    84px;

  gap:
    0.9rem;

  align-items: center;

  margin-top:
    1rem;

  padding:
    1rem;

  border:
    1px solid
    variables.$color-border;

  border-radius:
    variables.$radius-lg;

  background:
    variables.$color-surface-elevated;
}

.mobile-menu__aula:hover {
  border-color:
    variables.$color-border-strong;

  background:
    variables.$color-surface-light;
}

.mobile-menu__aula-icon {
  display: grid;

  width: 46px;
  height: 46px;

  flex:
    0 0 auto;

  place-items: center;

  border-radius:
    50%;

  color:
    variables.$color-primary;

  background:
    rgba(
      variables.$color-primary,
      0.1
    );

  font-size:
    1.05rem;
}

.mobile-menu__aula-copy {
  display: flex;

  min-width: 0;

  flex: 1;

  flex-direction: column;

  gap:
    0.25rem;
}

.mobile-menu__aula-copy strong {
  font-family:
    variables.$font-family-primary;

  font-size:
    1rem;

  font-weight:
    variables.$font-weight-semibold;

  color:
    variables.$color-text-primary;
}

.mobile-menu__aula-copy span {
  color:
    variables.$color-text-secondary;

  font-size:
    0.825rem;

  line-height:
    1.4;
}

.mobile-menu__access-arrow {
  color:
    variables.$color-primary;

  font-size:
    1.1rem;
}

/* =========================================================
   CTA
========================================================= */

.mobile-menu__cta {
  display: flex;

  min-height:
    74px;

  align-items: center;
  justify-content: space-between;

  margin-top:
    0.75rem;

  padding:
    0
    1.25rem;

  border-radius:
    variables.$radius-lg;

  color:
    variables.$color-black;

  background:
    variables.$color-primary;

  box-shadow:
    variables.$shadow-primary;
}

.mobile-menu__cta:hover {
  background:
    variables.$color-primary-light;

  transform:
    translateY(-1px);
}

.mobile-menu__cta small,
.mobile-menu__cta strong {
  display: block;
}

.mobile-menu__cta small {
  margin-bottom:
    0.15rem;

  color:
    rgba(
      variables.$color-black,
      0.62
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

.mobile-menu__cta strong {
  color:
    variables.$color-black;

  font-family:
    variables.$font-family-primary;

  font-size:
    1rem;

  font-weight:
    variables.$font-weight-bold;
}

.mobile-menu__cta-arrow {
  font-size:
    1.35rem;

  transition:
    transform
      variables.$transition-fast;
}

.mobile-menu__cta:hover
.mobile-menu__cta-arrow {
  transform:
    translateX(4px);
}

/* =========================================================
   INFORMACIÓN
========================================================= */

.mobile-menu__meta {
  display: grid;

  gap:
    1rem;

  margin-top:
    1.5rem;

  padding-top:
    1.5rem;

  border-top:
    1px solid
    variables.$color-border-soft;

  grid-template-columns:
    repeat(
      2,
      minmax(0, 1fr)
    );
}

.mobile-menu__meta div {
  display: flex;

  min-width: 0;

  flex-direction: column;

  gap:
    0.35rem;
}

.mobile-menu__meta span {
  color:
    variables.$color-text-muted;

  font-size:
    variables.$font-size-xs;

  font-weight:
    variables.$font-weight-semibold;

  letter-spacing:
    0.08em;

  text-transform:
    uppercase;
}

.mobile-menu__meta strong {
  color:
    variables.$color-text-secondary;

  font-size:
    0.825rem;

  font-weight:
    variables.$font-weight-medium;

  line-height:
    1.5;
}

/* =========================================================
   FOOTER
========================================================= */

.mobile-menu__footer {
  display: flex;

  min-height:
    calc(
      58px +
      env(safe-area-inset-bottom)
    );

  flex:
    0 0 auto;

  gap:
    0.75rem;

  align-items: center;

  padding:
    0.9rem
    1.5rem
    calc(
      0.9rem +
      env(safe-area-inset-bottom)
    );

  border-top:
    1px solid
    variables.$color-border-soft;

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

.mobile-menu__footer-line {
  height:
    1px;

  flex:
    1;

  background:
    variables.$color-border;
}

/* =========================================================
   TRANSICIÓN
========================================================= */

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity
      0.25s ease;
}

.mobile-menu-enter-active
.mobile-menu__panel,
.mobile-menu-leave-active
.mobile-menu__panel {
  transition:
    transform
      0.35s
      cubic-bezier(
        0.22,
        1,
        0.36,
        1
      );
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from
.mobile-menu__panel,
.mobile-menu-leave-to
.mobile-menu__panel {
  transform:
    translateX(32px);
}

/* =========================================================
   MOBILE PEQUEÑO
========================================================= */

@media (max-width: 520px) {
  .mobile-menu__header {
    min-height:
      86px;

    padding-right:
      1rem;

    padding-left:
      1rem;
  }

  .mobile-menu__brand img {
    height:
      52px;
  }

  .mobile-menu__brand-copy span {
    display: none;
  }

  .mobile-menu__brand-copy strong {
    font-size:
      1rem;
  }

  .mobile-menu__content {
    padding:
      1.5rem
      1rem
      2rem;
  }

  .mobile-menu__intro {
    margin-bottom:
      1.25rem;
  }

  .mobile-menu__link {
    min-height:
      66px;
  }

  .mobile-menu__label {
    font-size:
      1.3rem;
  }

  .mobile-menu__meta {
    grid-template-columns:
      1fr;
  }

  .mobile-menu__footer {
    padding-right:
      1rem;

    padding-left:
      1rem;
  }

  .mobile-menu__footer
  span:last-child {
    display: none;
  }
}

/* =========================================================
   PANTALLAS BAJAS
========================================================= */

@media (
  max-width: 700px
) and (
  max-height: 700px
) {
  .mobile-menu__header {
    min-height:
      76px;
  }

  .mobile-menu__brand img {
    height:
      46px;
  }

  .mobile-menu__content {
    padding-top:
      1rem;
  }

  .mobile-menu__intro {
    display: none;
  }

  .mobile-menu__link {
    min-height:
      58px;
  }

  .mobile-menu__access {
    margin-top:
      1.5rem;
  }
}
</style>
