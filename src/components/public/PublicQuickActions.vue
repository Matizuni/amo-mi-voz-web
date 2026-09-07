<template>
  <nav
    class="public-quick-actions"
    aria-label="Accesos rápidos de Amo Mi Voz"
  >
    <RouterLink
      to="/inscripcion"
      class="public-quick-actions__primary"
    >
      <span>Quiero inscribirme</span>
      <strong aria-hidden="true">→</strong>
    </RouterLink>

    <RouterLink
      to="/aula"
      class="public-quick-actions__secondary"
    >
      <span aria-hidden="true">♪</span>
      Aula Virtual
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.public-quick-actions {
  position: fixed;
  z-index: 92;
  right: 18px;
  bottom: 18px;
  display: flex;
  gap: 8px;
  padding: 7px;
  border: 1px solid rgba(219,227,236,.9);
  border-radius: 15px;
  background: rgba(255,255,255,.94);
  box-shadow: 0 16px 42px rgba(31,48,73,.15);
  backdrop-filter: blur(14px);
}

.public-quick-actions a {
  display: inline-flex;
  min-height: 44px;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 0 14px;
  border-radius: 10px;
  font-size: .7rem;
  font-weight: 900;
  text-decoration: none;
  white-space: nowrap;
}

.public-quick-actions__primary {
  color: #fff;
  background: #9f1945;
}

.public-quick-actions__primary:hover {
  background: #7d1236;
}

.public-quick-actions__secondary {
  border: 1px solid #dbe3ec;
  color: #344359;
  background: #fff;
}

.public-quick-actions__secondary > span {
  color: #b18400;
}

@media (max-width: 700px) {
  .public-quick-actions {
    right: 10px;
    bottom: calc(10px + env(safe-area-inset-bottom));
    left: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .public-quick-actions a {
    width: 100%;
    min-height: 48px;
    padding: 0 10px;
    font-size: .68rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .public-quick-actions * {
    transition: none !important;
  }
}
</style>
