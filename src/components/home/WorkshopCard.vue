<template>
  <article class="workshop-card">
    <span class="workshop-card__icon" aria-hidden="true">
      {{ icon }}
    </span>

    <h3 class="workshop-card__title">
      {{ title }}
    </h3>

    <p class="workshop-card__description">
      {{ description }}
    </p>

    <a class="workshop-card__link" href="#contacto">
      Consultar
      <span aria-hidden="true">→</span>
    </a>
  </article>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

.workshop-card {
  display: flex;
  height: 100%;
  padding: variables.$spacing-xl;
  flex-direction: column;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background:
    linear-gradient(
      145deg,
      rgba(variables.$color-white, 0.04),
      rgba(variables.$color-white, 0.01)
    ),
    variables.$color-surface;
  box-shadow: variables.$shadow-sm;
  transition:
    transform variables.$transition-normal,
    border-color variables.$transition-normal,
    box-shadow variables.$transition-normal;
}

.workshop-card:hover {
  border-color: rgba(variables.$color-primary, 0.55);
  box-shadow: variables.$shadow-md;
  transform: translateY(-8px);
}

.workshop-card__icon {
  display: grid;
  width: 58px;
  height: 58px;
  margin-bottom: variables.$spacing-xl;
  place-items: center;
  border: 1px solid rgba(variables.$color-primary, 0.25);
  border-radius: variables.$radius-md;
  background-color: rgba(variables.$color-primary, 0.08);
  font-size: variables.$font-size-2xl;
}

.workshop-card__title {
  margin-bottom: variables.$spacing-md;
  font-family: variables.$font-family-primary;
  font-size: variables.$font-size-xl;
}

.workshop-card__description {
  margin-bottom: variables.$spacing-xl;
  flex-grow: 1;
}

.workshop-card__link {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: variables.$spacing-sm;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  transition: gap variables.$transition-fast;

  @include mixins.focus-visible;
}

.workshop-card__link:hover {
  gap: variables.$spacing-md;
}
</style>