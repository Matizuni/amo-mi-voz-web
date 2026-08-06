<template>
  <section id="musicales" class="musicals">
    <div class="container">
      <div class="musicals__header">
        <div>
          <p class="musicals__eyebrow">
            Nuestros musicales
          </p>

          <h2 class="musicals__title">
            Historias que cobran vida sobre el escenario
          </h2>
        </div>

        <p class="musicals__intro">
          Cada producción reúne canto, interpretación, trabajo en equipo y una
          experiencia escénica que fortalece el desarrollo artístico de nuestros
          estudiantes.
        </p>
      </div>

      <div class="musicals__grid">
        <MusicalCard
          v-for="musical in musicals"
          :key="musical.id"
          :title="musical.title"
          :description="musical.description"
          :category="musical.category"
          :year="musical.year"
          :status="musical.status"
          :image="musical.image"
          :alt="musical.alt"
        />
      </div>
    </div>
  </section>
</template>

<script setup>
import MusicalCard from './MusicalCard.vue'
import { musicals } from '../../data/musicals.js'
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

.musicals {
  @include mixins.section-spacing;

  background-color: variables.$color-background;
}

.musicals__header {
  display: grid;
  gap: variables.$spacing-xl;
  margin-bottom: variables.$spacing-3xl;

  @include mixins.respond-to(lg) {
    grid-template-columns: minmax(0, 1.4fr) minmax(280px, 0.6fr);
    align-items: end;
  }
}

.musicals__eyebrow {
  margin-bottom: variables.$spacing-md;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.musicals__title {
  max-width: 820px;
  font-size: clamp(2.5rem, 5vw, 4.5rem);
}

.musicals__intro {
  max-width: 520px;
  font-size: variables.$font-size-md;
}

.musicals__grid {
  display: grid;
  gap: variables.$spacing-xl;

  @include mixins.respond-to(lg) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>