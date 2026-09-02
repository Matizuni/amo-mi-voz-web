<template>
  <!-- =====================================================
       NAVBAR PRINCIPAL
  ====================================================== -->
  <header
    class="navbar"
    :class="{
      'navbar--scrolled': isScrolled,
      'navbar--menu-open': isMenuOpen
    }"
  >
    <div class="navbar__ambient"></div>

    <div class="container navbar__container">
      <!-- =================================================
           LOGO
      ================================================== -->
      <RouterLink
        to="/"
        class="navbar__logo"
        aria-label="Ir al inicio de Amo Mi Voz"
        @click="closeMenu"
      >
        <span class="navbar__logo-glow"></span>

        <img
          :src="logo"
          alt="Academia de Talentos Amo Mi Voz"
        />
      </RouterLink>

      <!-- =================================================
           NAVEGACIÓN DESKTOP
      ================================================== -->
      <nav
        class="navbar__desktop-nav"
        aria-label="Navegación principal"
      >
        <RouterLink
          v-for="item in navigation"
          :key="item.path"
          :to="item.path"
        >
          {{ item.label }}
        </RouterLink>
      </nav>

      <!-- =================================================
           ACCIONES DESKTOP
      ================================================== -->
      <div class="navbar__actions">
        <RouterLink
          to="/aula"
          class="navbar__aula"
        >
          <span class="navbar__aula-icon">
            ♪
          </span>

          <span>
            Aula Virtual
          </span>
        </RouterLink>

        <RouterLink
          to="/inscripcion"
          class="navbar__cta"
        >
          <span>
            Inscríbete
          </span>

          <span class="navbar__cta-arrow">
            →
          </span>
        </RouterLink>
      </div>

      <!-- =================================================
           HAMBURGUESA MOBILE
      ================================================== -->
      <button
        type="button"
        class="navbar__toggle"
        :class="{
          'navbar__toggle--active':
            isMenuOpen
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
        <span class="navbar__toggle-glow"></span>

        <span class="navbar__toggle-lines">
          <i></i>
          <i></i>
          <i></i>
        </span>
      </button>
    </div>

    <div class="navbar__bottom-line"></div>
  </header>

  <!-- =====================================================
       MENÚ MOBILE

       IMPORTANTE:
       Teleport lo saca completamente del navbar
       y lo lleva directamente a <body>.
  ====================================================== -->
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
        <!-- FONDO -->
        <div
          class="mobile-menu__backdrop"
          @click="closeMenu"
        ></div>

        <div class="mobile-menu__grid"></div>
        <div class="mobile-menu__glow mobile-menu__glow--top"></div>
        <div class="mobile-menu__glow mobile-menu__glow--bottom"></div>

        <!-- PANEL -->
        <div
          class="mobile-menu__panel"
          @click.stop
        >
          <!-- =============================================
               CABECERA
          ============================================== -->
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
                <small>
                  ACADEMIA DE TALENTOS
                </small>

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

          <!-- =============================================
               CONTENIDO SCROLLEABLE
          ============================================== -->
          <div class="mobile-menu__scroll">
            <!-- STATUS -->
            <div class="mobile-menu__status">
              <span class="mobile-menu__status-dot"></span>

              <span>
                NAVEGACIÓN · AMO MI VOZ
              </span>

              <small>
                2026
              </small>
            </div>

            <!-- ===========================================
                 ENLACES
            ============================================ -->
            <nav
              class="mobile-menu__navigation"
              aria-label="Navegación móvil"
            >
              <RouterLink
                v-for="(
                  item,
                  index
                ) in navigation"
                :key="item.path"
                :to="item.path"
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

                <span class="mobile-menu__arrow">
                  →
                </span>
              </RouterLink>
            </nav>

            <!-- ===========================================
                 DIVISOR
            ============================================ -->
            <div class="mobile-menu__divider">
              <span></span>

              <small>
                ACCESOS
              </small>

              <span></span>
            </div>

            <!-- ===========================================
                 AULA VIRTUAL
            ============================================ -->
            <RouterLink
              to="/aula"
              class="mobile-menu__aula"
              @click="closeMenu"
            >
              <div class="mobile-menu__aula-icon">
                ♪
              </div>

              <div class="mobile-menu__aula-copy">
                <small>
                  ACCESO ESTUDIANTES
                </small>

                <strong>
                  Aula Virtual
                </strong>

                <span>
                  Clases, material y progreso
                </span>
              </div>

              <div class="mobile-menu__aula-arrow">
                →
              </div>
            </RouterLink>

            <!-- ===========================================
                 INSCRIPCIÓN
            ============================================ -->
            <RouterLink
              to="/inscripcion"
              class="mobile-menu__cta"
              @click="closeMenu"
            >
              <div>
                <small>
                  QUIERO SER PARTE
                </small>

                <strong>
                  Inscríbete
                </strong>
              </div>

              <span>
                →
              </span>
            </RouterLink>

            <!-- ===========================================
                 INFORMACIÓN
            ============================================ -->
            <div class="mobile-menu__info">
              <article>
                <small>
                  FORMACIÓN
                </small>

                <strong>
                  Voz · Música · Escenario
                </strong>
              </article>

              <article>
                <small>
                  UBICACIÓN
                </small>

                <strong>
                  La Calera · Chile
                </strong>
              </article>
            </div>
          </div>

          <!-- =============================================
               FOOTER FIJO
          ============================================== -->
          <footer class="mobile-menu__footer">
            <span>
              AMO MI VOZ
            </span>

            <div></div>

            <small>
              ACADEMIA DE TALENTOS
            </small>
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

/* =========================================================
   ROUTER
========================================================= */

const route = useRoute()

/* =========================================================
   ESTADO
========================================================= */

const isMenuOpen = ref(false)
const isScrolled = ref(false)

/* =========================================================
   NAVEGACIÓN
========================================================= */

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

/* =========================================================
   MENÚ
========================================================= */

function toggleMenu() {
  isMenuOpen.value =
    !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}

/* =========================================================
   SCROLL NAVBAR
========================================================= */

function handleScroll() {
  isScrolled.value =
    window.scrollY > 30
}

/* =========================================================
   TECLADO
========================================================= */

function handleKeydown(event) {
  if (
    event.key === 'Escape' &&
    isMenuOpen.value
  ) {
    closeMenu()
  }
}

/* =========================================================
   BLOQUEAR PÁGINA DETRÁS DEL MENÚ
========================================================= */

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
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }
)

/* =========================================================
   CERRAR AL CAMBIAR RUTA
========================================================= */

watch(
  () => route.fullPath,
  () => {
    closeMenu()
  }
)

/* =========================================================
   CICLO DE VIDA
========================================================= */

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
  z-index: 9000;
  top: 0;
  right: 0;
  left: 0;
  isolation: isolate;

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.04);

  background:
    rgba(6, 6, 6, 0.58);

  backdrop-filter:
    blur(18px)
    saturate(145%);

  -webkit-backdrop-filter:
    blur(18px)
    saturate(145%);

  transition:
    background 0.35s ease,
    border-color 0.35s ease,
    box-shadow 0.35s ease;
}

.navbar--scrolled {
  border-bottom-color:
    rgba(212, 175, 55, 0.1);

  background:
    rgba(6, 6, 6, 0.94);

  box-shadow:
    0 15px 50px
    rgba(0, 0, 0, 0.42);
}

.navbar__ambient {
  position: absolute;
  z-index: -1;
  top: -140px;
  left: 50%;

  width: 600px;
  height: 200px;

  border-radius: 50%;

  pointer-events: none;

  background:
    rgba(212, 175, 55, 0.04);

  transform:
    translateX(-50%);

  filter: blur(90px);
}

.navbar__container {
  position: relative;

  display: flex;

  min-height: 92px;

  gap: 28px;

  align-items: center;
  justify-content: space-between;
}

/* =========================================================
   LOGO
========================================================= */

.navbar__logo {
  position: relative;

  display: flex;

  flex: 0 0 auto;

  align-items: center;

  text-decoration: none;
}

.navbar__logo img {
  position: relative;
  z-index: 2;

  display: block;

  width: auto;
  height: 72px;

  object-fit: contain;

  transition:
    transform 0.28s ease,
    filter 0.28s ease;
}

.navbar__logo:hover img {
  transform: scale(1.035);

  filter:
    drop-shadow(
      0 0 13px
      rgba(212, 175, 55, 0.15)
    );
}

.navbar__logo-glow {
  position: absolute;

  top: 50%;
  left: 50%;

  width: 80px;
  height: 80px;

  border-radius: 50%;

  pointer-events: none;

  background:
    rgba(212, 175, 55, 0.06);

  transform:
    translate(-50%, -50%);

  filter: blur(24px);
}

/* =========================================================
   DESKTOP NAV
========================================================= */

.navbar__desktop-nav {
  display: none;

  flex: 1;

  align-items: center;
  justify-content: center;

  gap:
    clamp(
      20px,
      2.2vw,
      37px
    );

  @include mixins.respond-to(lg) {
    display: flex;
  }
}

.navbar__desktop-nav a {
  position: relative;

  padding: 9px 0;

  color: #d7d7d7;

  font-size: 0.86rem;
  font-weight: 650;

  text-decoration: none;

  transition:
    color 0.22s ease;
}

.navbar__desktop-nav a::after {
  position: absolute;

  right: 0;
  bottom: -7px;
  left: 0;

  width: 0;
  height: 2px;

  margin: auto;

  content: '';

  border-radius: 999px;

  background:
    variables.$color-primary;

  box-shadow:
    0 0 12px
    rgba(212, 175, 55, 0.3);

  transition:
    width 0.25s ease;
}

.navbar__desktop-nav a:hover,
.navbar__desktop-nav a.router-link-active {
  color:
    variables.$color-primary;
}

.navbar__desktop-nav a:hover::after,
.navbar__desktop-nav
a.router-link-active::after {
  width: 100%;
}

/* =========================================================
   DESKTOP ACTIONS
========================================================= */

.navbar__actions {
  display: none;

  flex: 0 0 auto;

  gap: 9px;

  align-items: center;

  @include mixins.respond-to(lg) {
    display: flex;
  }
}

.navbar__aula,
.navbar__cta {
  display: flex;

  min-height: 45px;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  font-size: 0.71rem;
  font-weight: 850;

  text-decoration: none;

  white-space: nowrap;

  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    background 0.2s ease,
    box-shadow 0.2s ease;
}

.navbar__aula {
  gap: 8px;

  padding:
    0
    15px;

  border:
    1px solid
    rgba(212, 175, 55, 0.28);

  color: #d6d6d6;

  background:
    rgba(212, 175, 55, 0.025);
}

.navbar__aula:hover {
  transform:
    translateY(-2px);

  color:
    variables.$color-primary;

  border-color:
    variables.$color-primary;

  background:
    rgba(212, 175, 55, 0.055);
}

.navbar__aula-icon {
  display: grid;

  width: 25px;
  height: 25px;

  place-items: center;

  border-radius: 50%;

  color: #080808;

  background:
    variables.$color-primary;
}

.navbar__cta {
  gap: 9px;

  padding:
    0
    17px;

  color: #080808;

  background:
    variables.$color-primary;

  box-shadow:
    0 8px 25px
    rgba(212, 175, 55, 0.1);
}

.navbar__cta:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 14px 35px
    rgba(212, 175, 55, 0.17);
}

.navbar__cta-arrow {
  font-size: 0.9rem;
}

/* =========================================================
   HAMBURGER
========================================================= */

.navbar__toggle {
  position: relative;

  display: grid;

  width: 47px;
  height: 47px;

  flex: 0 0 auto;

  place-items: center;

  padding: 0;

  border:
    1px solid
    rgba(255, 255, 255, 0.11);

  border-radius: 12px;

  outline: none;

  background:
    rgba(255, 255, 255, 0.025);

  cursor: pointer;

  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;

  @include mixins.respond-to(lg) {
    display: none;
  }
}

.navbar__toggle:hover {
  border-color:
    rgba(212, 175, 55, 0.4);

  background:
    rgba(212, 175, 55, 0.035);
}

.navbar__toggle-glow {
  position: absolute;

  width: 35px;
  height: 35px;

  border-radius: 50%;

  background:
    rgba(212, 175, 55, 0.08);

  opacity: 0;

  filter: blur(12px);

  transition:
    opacity 0.25s ease;
}

.navbar__toggle--active
.navbar__toggle-glow {
  opacity: 1;
}

.navbar__toggle-lines {
  position: relative;

  display: flex;

  width: 23px;
  height: 18px;

  flex-direction: column;

  justify-content: space-between;
}

.navbar__toggle-lines i {
  display: block;

  width: 100%;
  height: 2px;

  border-radius: 999px;

  background: #f1f1f1;

  transition:
    width 0.25s ease,
    background 0.25s ease;
}

.navbar__toggle-lines i:nth-child(2) {
  width: 68%;

  margin-left: auto;
}

.navbar__toggle:hover
.navbar__toggle-lines i {
  background:
    variables.$color-primary;
}

/* =========================================================
   BOTTOM LINE
========================================================= */

.navbar__bottom-line {
  position: absolute;

  right: 0;
  bottom: -1px;
  left: 0;

  width: 0;
  height: 1px;

  margin: auto;

  background:
    linear-gradient(
      90deg,
      transparent,
      variables.$color-primary,
      transparent
    );

  opacity: 0;

  transition:
    width 0.4s ease,
    opacity 0.4s ease;
}

.navbar--scrolled
.navbar__bottom-line {
  width: 65%;

  opacity: 0.35;
}

/* =========================================================
   DESKTOP MEDIO
========================================================= */

@media (
  min-width: 1024px
) and (
  max-width: 1190px
) {
  .navbar__container {
    gap: 15px;
  }

  .navbar__logo img {
    height: 61px;
  }

  .navbar__desktop-nav {
    gap: 16px;
  }

  .navbar__desktop-nav a {
    font-size: 0.75rem;
  }

  .navbar__aula,
  .navbar__cta {
    padding:
      0
      12px;

    font-size: 0.64rem;
  }
}

/* =========================================================
   MOBILE NAVBAR
========================================================= */

@media (max-width: 1023px) {
  .navbar__container {
    min-height:
      calc(
        82px +
        env(safe-area-inset-top)
      );

    padding-top:
      env(safe-area-inset-top);
  }

  .navbar__logo img {
    height: 63px;
  }

  .navbar__toggle {
    /*
     * Un poco de aire respecto
     * del borde superior.
     */
    margin-top: 4px;
  }
}

@media (max-width: 520px) {
  .navbar__container {
    min-height:
      calc(
        78px +
        env(safe-area-inset-top)
      );
  }

  .navbar__logo img {
    height: 57px;
  }

  .navbar__toggle {
    width: 44px;
    height: 44px;
  }
}
</style>

<!-- =========================================================
     IMPORTANTE:
     Estos estilos NO pueden estar scoped porque el menú
     está teletransportado fuera del componente.
========================================================== -->

<style lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   MOBILE FULLSCREEN
========================================================= */

.mobile-menu {
  position: fixed;

  z-index: 50000;

  inset: 0;

  width: 100%;

  /*
   * dvh responde mucho mejor
   * a las barras móviles de Chrome/Safari.
   */
  height: 100vh;
  height: 100dvh;

  overflow: hidden;

  color: #f5f5f5;

  background: #060606;

  isolation: isolate;
}

/* =========================================================
   BACKDROP
========================================================= */

.mobile-menu__backdrop {
  position: absolute;

  inset: 0;

  z-index: -4;

  background:
    rgba(0, 0, 0, 0.95);
}

/* =========================================================
   CYBER GRID
========================================================= */

.mobile-menu__grid {
  position: absolute;

  z-index: -3;

  inset: 0;

  pointer-events: none;

  opacity: 0.55;

  background:
    linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.014) 1px,
      transparent 1px
    ),
    linear-gradient(
      rgba(255, 255, 255, 0.014) 1px,
      transparent 1px
    );

  background-size:
    52px
    52px;

  mask-image:
    radial-gradient(
      circle at 50% 25%,
      black,
      transparent 78%
    );
}

/* =========================================================
   GLOWS
========================================================= */

.mobile-menu__glow {
  position: absolute;

  z-index: -2;

  border-radius: 50%;

  pointer-events: none;

  filter: blur(130px);
}

.mobile-menu__glow--top {
  top: -250px;
  left: 50%;

  width: 600px;
  height: 600px;

  background:
    rgba(212, 175, 55, 0.13);

  transform:
    translateX(-50%);
}

.mobile-menu__glow--bottom {
  right: -250px;
  bottom: -300px;

  width: 550px;
  height: 550px;

  background:
    rgba(212, 175, 55, 0.04);
}

/* =========================================================
   PANEL
========================================================= */

.mobile-menu__panel {
  position: relative;

  display: flex;

  width: 100%;
  height: 100%;

  flex-direction: column;

  padding-top:
    env(safe-area-inset-top);

  background:
    linear-gradient(
      180deg,
      rgba(212, 175, 55, 0.025),
      transparent 24%
    );
}

/* =========================================================
   HEADER
========================================================= */

.mobile-menu__header {
  position: relative;

  display: flex;

  min-height: 102px;

  flex: 0 0 auto;

  gap: 20px;

  align-items: center;
  justify-content: space-between;

  padding:
    18px
    max(
      22px,
      env(safe-area-inset-right)
    )
    17px
    max(
      22px,
      env(safe-area-inset-left)
    );

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.07);

  background:
    rgba(5, 5, 5, 0.55);

  backdrop-filter:
    blur(18px);

  -webkit-backdrop-filter:
    blur(18px);
}

.mobile-menu__brand {
  display: flex;

  min-width: 0;

  gap: 13px;

  align-items: center;

  color: #fff;

  text-decoration: none;
}

.mobile-menu__brand img {
  display: block;

  width: auto;
  height: 58px;

  flex: 0 0 auto;

  object-fit: contain;
}

.mobile-menu__brand-copy {
  min-width: 0;
}

.mobile-menu__brand-copy small,
.mobile-menu__brand-copy strong {
  display: block;
}

.mobile-menu__brand-copy small {
  overflow: hidden;

  margin-bottom: 3px;

  color: #5d5d5d;

  font-size: 0.42rem;
  font-weight: 900;

  letter-spacing: 0.15em;

  text-overflow: ellipsis;
  white-space: nowrap;
}

.mobile-menu__brand-copy strong {
  color: #ddd;

  font-size: 0.72rem;
}

/* =========================================================
   CLOSE BUTTON
========================================================= */

.mobile-menu__close {
  position: relative;

  display: grid;

  width: 52px;
  height: 52px;

  flex: 0 0 auto;

  place-items: center;

  border:
    1px solid
    rgba(212, 175, 55, 0.26);

  border-radius: 14px;

  background:
    rgba(212, 175, 55, 0.04);

  cursor: pointer;

  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;
}

.mobile-menu__close:hover {
  transform:
    rotate(3deg);

  border-color:
    variables.$color-primary;

  background:
    rgba(212, 175, 55, 0.075);
}

.mobile-menu__close span {
  position: absolute;

  width: 25px;
  height: 2px;

  border-radius: 999px;

  background:
    variables.$color-primary;

  box-shadow:
    0 0 10px
    rgba(212, 175, 55, 0.25);
}

.mobile-menu__close span:first-child {
  transform:
    rotate(45deg);
}

.mobile-menu__close span:last-child {
  transform:
    rotate(-45deg);
}

/* =========================================================
   SCROLL AREA
========================================================= */

.mobile-menu__scroll {
  width: min(620px, 100%);

  flex: 1;

  margin: 0 auto;

  overflow-x: hidden;
  overflow-y: auto;

  padding:
    27px
    22px
    34px;

  scrollbar-width: thin;

  scrollbar-color:
    rgba(212, 175, 55, 0.38)
    transparent;

  overscroll-behavior: contain;
}

.mobile-menu__scroll::-webkit-scrollbar {
  width: 4px;
}

.mobile-menu__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.mobile-menu__scroll::-webkit-scrollbar-thumb {
  border-radius: 999px;

  background:
    rgba(212, 175, 55, 0.38);
}

/* =========================================================
   STATUS
========================================================= */

.mobile-menu__status {
  display: flex;

  gap: 9px;

  align-items: center;

  margin-bottom: 23px;

  color: #555;

  font-size: 0.45rem;
  font-weight: 900;

  letter-spacing: 0.13em;
}

.mobile-menu__status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background:
    variables.$color-primary;

  box-shadow:
    0 0 14px
    rgba(212, 175, 55, 0.6);
}

.mobile-menu__status > span:nth-child(2) {
  flex: 1;
}

.mobile-menu__status small {
  color: #383838;
}

/* =========================================================
   NAV LINKS
========================================================= */

.mobile-menu__navigation {
  border-top:
    1px solid
    rgba(255, 255, 255, 0.075);
}

.mobile-menu__navigation a {
  position: relative;

  display: flex;

  min-height: 72px;

  gap: 17px;

  align-items: center;

  border-bottom:
    1px solid
    rgba(255, 255, 255, 0.075);

  color: #dadada;

  text-decoration: none;

  transition:
    color 0.22s ease,
    padding-left 0.22s ease,
    background 0.22s ease;
}

.mobile-menu__navigation a::before {
  position: absolute;

  top: 50%;
  left: -22px;

  width: 4px;
  height: 0;

  border-radius:
    0
    999px
    999px
    0;

  content: '';

  background:
    variables.$color-primary;

  transform:
    translateY(-50%);

  box-shadow:
    0 0 14px
    rgba(212, 175, 55, 0.38);

  transition:
    height 0.22s ease;
}

.mobile-menu__navigation
a.router-link-active {
  color:
    variables.$color-primary;

  background:
    linear-gradient(
      90deg,
      rgba(212, 175, 55, 0.035),
      transparent
    );
}

.mobile-menu__navigation
a.router-link-active::before {
  height: 31px;
}

.mobile-menu__navigation a:hover {
  padding-left: 6px;

  color:
    variables.$color-primary;
}

.mobile-menu__index {
  width: 27px;

  flex: 0 0 auto;

  color: #4c4c4c;

  font-size: 0.49rem;
  font-weight: 900;

  letter-spacing: 0.06em;
}

.mobile-menu__navigation
a.router-link-active
.mobile-menu__index {
  color:
    variables.$color-primary;
}

.mobile-menu__label {
  flex: 1;

  font-size:
    clamp(
      1.15rem,
      5vw,
      1.45rem
    );

  font-weight: 750;

  letter-spacing: -0.025em;
}

.mobile-menu__arrow {
  color: #414141;

  font-size: 1rem;

  transition:
    color 0.22s ease,
    transform 0.22s ease;
}

.mobile-menu__navigation
a:hover
.mobile-menu__arrow,
.mobile-menu__navigation
a.router-link-active
.mobile-menu__arrow {
  color:
    variables.$color-primary;

  transform:
    translateX(4px);
}

/* =========================================================
   DIVIDER
========================================================= */

.mobile-menu__divider {
  display: flex;

  gap: 12px;

  align-items: center;

  margin:
    31px
    0
    18px;
}

.mobile-menu__divider > span {
  height: 1px;

  flex: 1;

  background:
    linear-gradient(
      90deg,
      transparent,
      #292929
    );
}

.mobile-menu__divider > span:last-child {
  background:
    linear-gradient(
      90deg,
      #292929,
      transparent
    );
}

.mobile-menu__divider small {
  color: #4d4d4d;

  font-size: 0.43rem;
  font-weight: 900;

  letter-spacing: 0.16em;
}

/* =========================================================
   AULA
========================================================= */

.mobile-menu__aula {
  display: flex;

  gap: 14px;

  align-items: center;

  min-height: 83px;

  padding:
    14px
    16px;

  border:
    1px solid
    rgba(212, 175, 55, 0.22);

  border-radius: 15px;

  color: #eee;

  background:
    linear-gradient(
      135deg,
      rgba(212, 175, 55, 0.055),
      rgba(255, 255, 255, 0.012)
    );

  text-decoration: none;

  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease;
}

.mobile-menu__aula:hover {
  transform:
    translateY(-2px);

  border-color:
    rgba(212, 175, 55, 0.46);

  background:
    rgba(212, 175, 55, 0.06);
}

.mobile-menu__aula-icon {
  display: grid;

  width: 44px;
  height: 44px;

  flex: 0 0 auto;

  place-items: center;

  border-radius: 50%;

  color: #080808;

  background:
    variables.$color-primary;

  font-size: 1rem;

  box-shadow:
    0 0 22px
    rgba(212, 175, 55, 0.13);
}

.mobile-menu__aula-copy {
  min-width: 0;

  flex: 1;
}

.mobile-menu__aula-copy small,
.mobile-menu__aula-copy strong,
.mobile-menu__aula-copy span {
  display: block;
}

.mobile-menu__aula-copy small {
  color: #646464;

  font-size: 0.43rem;
  font-weight: 900;

  letter-spacing: 0.12em;
}

.mobile-menu__aula-copy strong {
  margin-top: 3px;

  font-size: 0.82rem;
}

.mobile-menu__aula-copy span {
  margin-top: 3px;

  color: #5f5f5f;

  font-size: 0.56rem;
}

.mobile-menu__aula-arrow {
  color:
    variables.$color-primary;

  font-size: 1.05rem;
}

/* =========================================================
   CTA
========================================================= */

.mobile-menu__cta {
  display: flex;

  min-height: 69px;

  align-items: center;
  justify-content: space-between;

  margin-top: 10px;

  padding:
    0
    20px;

  border-radius: 15px;

  color: #080808;

  background:
    variables.$color-primary;

  text-decoration: none;

  box-shadow:
    0 17px 40px
    rgba(212, 175, 55, 0.1);

  transition:
    transform 0.22s ease,
    box-shadow 0.22s ease;
}

.mobile-menu__cta:hover {
  transform:
    translateY(-2px);

  box-shadow:
    0 22px 50px
    rgba(212, 175, 55, 0.16);
}

.mobile-menu__cta small,
.mobile-menu__cta strong {
  display: block;
}

.mobile-menu__cta small {
  margin-bottom: 2px;

  color:
    rgba(0, 0, 0, 0.52);

  font-size: 0.42rem;
  font-weight: 950;

  letter-spacing: 0.12em;
}

.mobile-menu__cta strong {
  font-size: 1rem;
}

.mobile-menu__cta > span {
  font-size: 1.3rem;
}

/* =========================================================
   INFO
========================================================= */

.mobile-menu__info {
  display: grid;

  gap: 1px;

  overflow: hidden;

  margin-top: 15px;

  border:
    1px solid
    rgba(255, 255, 255, 0.065);

  border-radius: 12px;

  background:
    rgba(255, 255, 255, 0.065);

  grid-template-columns:
    repeat(2, 1fr);
}

.mobile-menu__info article {
  padding: 13px;

  background:
    rgba(8, 8, 8, 0.92);
}

.mobile-menu__info small,
.mobile-menu__info strong {
  display: block;
}

.mobile-menu__info small {
  margin-bottom: 5px;

  color: #4f4f4f;

  font-size: 0.39rem;
  font-weight: 900;

  letter-spacing: 0.11em;
}

.mobile-menu__info strong {
  color: #888;

  font-size: 0.55rem;
}

/* =========================================================
   FOOTER
========================================================= */

.mobile-menu__footer {
  display: flex;

  min-height:
    calc(
      57px +
      env(safe-area-inset-bottom)
    );

  flex: 0 0 auto;

  gap: 11px;

  align-items: center;

  padding:
    13px
    22px
    calc(
      13px +
      env(safe-area-inset-bottom)
    );

  border-top:
    1px solid
    rgba(255, 255, 255, 0.06);

  background:
    rgba(5, 5, 5, 0.82);

  backdrop-filter:
    blur(18px);

  -webkit-backdrop-filter:
    blur(18px);
}

.mobile-menu__footer > span,
.mobile-menu__footer small {
  color: #454545;

  font-size: 0.4rem;
  font-weight: 900;

  letter-spacing: 0.14em;
}

.mobile-menu__footer > div {
  height: 1px;

  flex: 1;

  background:
    linear-gradient(
      90deg,
      rgba(212, 175, 55, 0.23),
      transparent
    );
}

/* =========================================================
   TRANSITION
========================================================= */

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition:
    opacity 0.28s ease;
}

.mobile-menu-enter-active
.mobile-menu__panel,
.mobile-menu-leave-active
.mobile-menu__panel {
  transition:
    transform 0.35s
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
.mobile-menu__panel {
  transform:
    translateY(-18px)
    scale(0.99);
}

.mobile-menu-leave-to
.mobile-menu__panel {
  transform:
    translateY(-12px)
    scale(0.995);
}

/* =========================================================
   MOBILE PEQUEÑO
========================================================= */

@media (max-width: 500px) {
  .mobile-menu__header {
    min-height: 92px;

    padding-right: 17px;
    padding-left: 17px;
  }

  .mobile-menu__brand img {
    height: 51px;
  }

  .mobile-menu__brand-copy {
    display: none;
  }

  .mobile-menu__close {
    width: 48px;
    height: 48px;
  }

  .mobile-menu__scroll {
    padding:
      22px
      17px
      28px;
  }

  .mobile-menu__navigation a {
    min-height: 65px;
  }

  .mobile-menu__label {
    font-size: 1.15rem;
  }

  .mobile-menu__aula {
    min-height: 76px;
  }

  .mobile-menu__cta {
    min-height: 63px;
  }

  .mobile-menu__info {
    grid-template-columns: 1fr;
  }

  .mobile-menu__footer {
    padding-right: 17px;
    padding-left: 17px;
  }
}

/* =========================================================
   PANTALLA BAJA
========================================================= */

@media (
  max-width: 700px
) and (
  max-height: 700px
) {
  .mobile-menu__header {
    min-height: 80px;
  }

  .mobile-menu__brand img {
    height: 47px;
  }

  .mobile-menu__close {
    width: 44px;
    height: 44px;
  }

  .mobile-menu__scroll {
    padding-top: 16px;
  }

  .mobile-menu__status {
    margin-bottom: 14px;
  }

  .mobile-menu__navigation a {
    min-height: 56px;
  }

  .mobile-menu__divider {
    margin-top: 21px;
  }
}

/* =========================================================
   REDUCED MOTION
========================================================= */

@media (
  prefers-reduced-motion: reduce
) {
  .mobile-menu *,
  .mobile-menu *::before,
  .mobile-menu *::after {
    transition-duration:
      0.01ms !important;

    animation-duration:
      0.01ms !important;
  }
}
</style>
