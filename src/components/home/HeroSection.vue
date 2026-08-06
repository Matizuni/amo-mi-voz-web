<template>
  <section class="hero">
    <div class="container hero__content">
      <p class="hero__subtitle">Academia de Talentos Musicales</p>

      <h1>AMO MI VOZ</h1>

      <p class="hero__description">
        Formamos artistas, desarrollamos confianza y llevamos la música al
        escenario.
      </p>

      <div class="hero__buttons">
        <button type="button">Conoce la Academia</button>
        <button type="button">Ver Talleres</button>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

.hero {

  padding-top: 76px;
  display: flex;
  min-height: 100vh;
  align-items: center;
  background:
    linear-gradient(rgba(0, 0, 0, 0.65), rgba(0, 0, 0, 0.75)),
    url('https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070');
  background-position: center;
  background-size: cover;
}

.hero__content {
  display: flex;
  max-width: 900px;
  padding-block: variables.$spacing-3xl;
  flex-direction: column;
  gap: variables.$spacing-lg;
}

.hero__subtitle {
  color: variables.$color-primary;
  text-transform: uppercase;
  letter-spacing: 3px;
}

.hero h1 {
  max-width: 100%;
  font-size: clamp(3.2rem, 12vw, 8rem);
  line-height: 0.95;
}

.hero__description {
  max-width: 650px;
  font-size: clamp(1rem, 2vw, 1.25rem);
}

.hero__buttons {
  display: flex;
  flex-wrap: wrap;
  gap: variables.$spacing-md;
  margin-top: variables.$spacing-md;
}

.hero button {
  padding: 1rem 2rem;
  border: none;
  border-radius: variables.$radius-pill;
  cursor: pointer;
  font-weight: variables.$font-weight-semibold;
  transition:
    transform variables.$transition-fast,
    background-color variables.$transition-fast;
}

.hero button:hover {
  transform: translateY(-2px);
}

.hero button:first-child {
  color: variables.$color-black;
  background-color: variables.$color-primary;
}

.hero button:last-child {
  color: variables.$color-white;
  background-color: transparent;
  border: 1px solid variables.$color-white;
}

@media (max-width: 575px) {
  .hero {
    background-position: 65% center;
  }

  .hero__buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .hero button {
    width: 100%;
  }
}

</style>

