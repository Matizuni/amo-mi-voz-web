<template>
  <section class="benefits">
    <div class="container">
      <div class="benefits__header">
        <p class="benefits__eyebrow">¿Por qué elegirnos?</p>

        <h2 class="benefits__title">
          Más que clases de música:
          <span>creamos experiencias artísticas</span>
        </h2>

        <p class="benefits__intro">
          En Amo Mi Voz cada estudiante encuentra herramientas para desarrollar
          su talento, fortalecer su confianza y vivir la música sobre el
          escenario.
        </p>
      </div>

      <div class="benefits__grid">
        <article
          v-for="benefit in benefits"
          :key="benefit.id"
          class="benefits__item"
        >
          <span class="benefits__number">
            {{ benefit.number }}
          </span>

          <div class="benefits__content">
            <h3>{{ benefit.title }}</h3>
            <p>{{ benefit.description }}</p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { benefits } from '../../data/benefits.js'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

.benefits {
  @include mixins.section-spacing;

  position: relative;
  overflow: hidden;
  background-color: variables.$color-surface;
}

.benefits::after {
  position: absolute;
  bottom: -12rem;
  left: -12rem;
  width: 30rem;
  height: 30rem;
  border-radius: 50%;
  background-color: rgba(variables.$color-primary, 0.07);
  content: '';
  filter: blur(60px);
  pointer-events: none;
}

.benefits__header {
  position: relative;
  z-index: 1;
  display: grid;
  gap: variables.$spacing-xl;
  margin-bottom: variables.$spacing-3xl;

  @include mixins.respond-to(lg) {
    grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
    align-items: end;
  }
}

.benefits__eyebrow {
  margin-bottom: variables.$spacing-md;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.benefits__title {
  max-width: 850px;
  font-size: clamp(2.4rem, 5vw, 4.5rem);
}

.benefits__title span {
  color: variables.$color-primary;
}

.benefits__intro {
  max-width: 520px;
  font-size: variables.$font-size-md;
}

.benefits__grid {
  position: relative;
  z-index: 1;
  display: grid;
  border-top: 1px solid variables.$color-border;

  @include mixins.respond-to(lg) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.benefits__item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: variables.$spacing-lg;
  padding-block: variables.$spacing-xl;
  border-bottom: 1px solid variables.$color-border;
  transition:
    background-color variables.$transition-normal,
    padding-inline variables.$transition-normal;

  @include mixins.respond-to(lg) {
    padding: variables.$spacing-2xl;
  }
}

.benefits__item:hover {
  background-color: rgba(variables.$color-white, 0.025);

  @include mixins.respond-to(lg) {
    padding-inline: calc(variables.$spacing-2xl + 0.5rem);
  }
}

.benefits__item:nth-child(odd) {
  @include mixins.respond-to(lg) {
    border-right: 1px solid variables.$color-border;
  }
}

.benefits__number {
  color: variables.$color-primary;
  font-family: variables.$font-family-heading;
  font-size: variables.$font-size-xl;
}

.benefits__content h3 {
  margin-bottom: variables.$spacing-sm;
  font-family: variables.$font-family-primary;
  font-size: variables.$font-size-xl;
}

.benefits__content p {
  max-width: 520px;
}
</style>