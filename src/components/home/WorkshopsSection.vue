<template>
  <section id="talleres" class="workshops">
    <div class="container">
      <div class="workshops__header">
        <div>
          <p class="workshops__eyebrow">Nuestros talleres</p>

          <h2 class="workshops__title">
            Formación musical para desarrollar talento, seguridad y expresión
          </h2>
        </div>

        <p class="workshops__intro">
          Cada taller combina técnica, creatividad y experiencia práctica para
          que nuestros estudiantes avancen y disfruten su proceso artístico.
        </p>
      </div>

      <div class="workshops__grid">
        <WorkshopCard
          v-for="workshop in workshops"
          :key="workshop.id"
          :title="workshop.title"
          :description="workshop.description"
          :icon="workshop.icon"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import WorkshopCard from './WorkshopCard.vue'
import { workshops } from '../../data/workshops.js'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

.workshops {
  @include mixins.section-spacing;

  background-color: variables.$color-background;
}

.workshops__header {
  display: grid;
  gap: variables.$spacing-xl;
  margin-bottom: variables.$spacing-3xl;

  @include mixins.respond-to(lg) {
    grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
    align-items: end;
  }
}

.workshops__eyebrow {
  margin-bottom: variables.$spacing-md;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.workshops__title {
  max-width: 820px;
  font-size: clamp(2.4rem, 5vw, 4.4rem);
}

.workshops__intro {
  max-width: 520px;
  font-size: variables.$font-size-md;
}

.workshops__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: variables.$spacing-lg;

  @include mixins.respond-to(md) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @include mixins.respond-to(lg) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>