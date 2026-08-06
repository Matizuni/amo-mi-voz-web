<template>
  <header class="navbar" :class="{ 'navbar--open': isMenuOpen }">
    <div class="container navbar__container">
      <a class="navbar__logo" href="#" @click="closeMenu">
        AMO MI VOZ
      </a>

      <button
        class="navbar__toggle"
        type="button"
        :aria-expanded="isMenuOpen"
        aria-controls="main-navigation"
        aria-label="Abrir o cerrar menú"
        @click="toggleMenu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav
        id="main-navigation"
        class="navbar__menu"
        aria-label="Navegación principal"
      >
        <a href="#academia" @click="closeMenu">Academia</a>
        <a href="#talleres" @click="closeMenu">Talleres</a>
        <a href="#musicales" @click="closeMenu">Musicales</a>
        <a href="#galeria" @click="closeMenu">Galería</a>
        <a href="#contacto" @click="closeMenu">Contacto</a>

        <a
          class="navbar__mobile-cta"
          href="#contacto"
          @click="closeMenu"
        >
          Inscríbete
        </a>
      </nav>

      <a class="navbar__button" href="#contacto">
        Inscríbete
      </a>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

.navbar {
  position: fixed;
  z-index: variables.$z-header;
  top: 0;
  left: 0;
  width: 100%;
  border-bottom: 1px solid variables.$color-border;
  background-color: rgba(variables.$color-black, 0.72);
  backdrop-filter: blur(14px);
}

.navbar__container {
  position: relative;
  display: flex;
  min-height: 76px;
  align-items: center;
  justify-content: space-between;
}

.navbar__logo {
  position: relative;
  z-index: 2;
  color: variables.$color-primary;
  font-family: variables.$font-family-heading;
  font-size: clamp(1.35rem, 3vw, 1.75rem);
  font-weight: variables.$font-weight-bold;
  letter-spacing: 0.06em;
}

.navbar__toggle {
  position: relative;
  z-index: 2;
  display: flex;
  width: 46px;
  height: 46px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: 1px solid variables.$color-border;
  border-radius: 50%;
  color: variables.$color-white;
  background-color: transparent;
  cursor: pointer;

  @include mixins.respond-to(lg) {
    display: none;
  }
}

.navbar__toggle span {
  width: 20px;
  height: 2px;
  background-color: currentColor;
  transition:
    transform variables.$transition-normal,
    opacity variables.$transition-normal;
}

.navbar__menu {
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 7rem variables.$container-padding 2rem;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: variables.$spacing-xl;
  background-color: rgba(variables.$color-background, 0.98);
  opacity: 0;
  pointer-events: none;
  transform: translateY(-20px);
  transition:
    opacity variables.$transition-normal,
    transform variables.$transition-normal;
}

.navbar--open .navbar__menu {
  opacity: 1;
  pointer-events: auto;
  transform: translateY(0);
}

.navbar__menu a {
  color: variables.$color-white;
  font-size: variables.$font-size-xl;
  font-weight: variables.$font-weight-medium;
  transition: color variables.$transition-fast;
}

.navbar__menu a:hover {
  color: variables.$color-primary;
}

.navbar__button {
  display: none;
}

.navbar__mobile-cta {
  display: inline-flex;
  padding: 0.9rem 1.6rem;
  border-radius: variables.$radius-pill;
  color: variables.$color-black !important;
  background-color: variables.$color-primary;
  font-size: variables.$font-size-base !important;
  font-weight: variables.$font-weight-semibold !important;
}

.navbar--open .navbar__toggle span:nth-child(1) {
  transform: translateY(7px) rotate(45deg);
}

.navbar--open .navbar__toggle span:nth-child(2) {
  opacity: 0;
}

.navbar--open .navbar__toggle span:nth-child(3) {
  transform: translateY(-7px) rotate(-45deg);
}

@include mixins.respond-to(lg) {
  .navbar__container {
    min-height: 88px;
  }

  .navbar__menu {
    position: static;
    width: auto;
    min-height: auto;
    padding: 0;
    flex-direction: row;
    gap: clamp(1.25rem, 2.5vw, 2.5rem);
    background-color: transparent;
    opacity: 1;
    pointer-events: auto;
    transform: none;
  }

  .navbar__menu a {
    font-size: variables.$font-size-base;
  }

  .navbar__button {
    display: inline-flex;
    padding: 0.9rem 1.6rem;
    align-items: center;
    justify-content: center;
    border-radius: variables.$radius-pill;
    color: variables.$color-black;
    background-color: variables.$color-primary;
    font-weight: variables.$font-weight-semibold;
    transition:
      transform variables.$transition-fast,
      background-color variables.$transition-fast;
  }

  .navbar__button:hover {
    background-color: variables.$color-primary-light;
    transform: translateY(-2px);
  }

  .navbar__mobile-cta {
    display: none;
  }
}
</style>