<template>
  <article class="musical-card">
    <img
      class="musical-card__image"
      :src="image"
      :alt="alt"
    />

    <div class="musical-card__overlay"></div>

    <div class="musical-card__top">
      <span class="musical-card__status">
        {{ status }}
      </span>

      <span class="musical-card__year">
        {{ year }}
      </span>
    </div>

    <div class="musical-card__content">
      <p class="musical-card__category">
        {{ category }}
      </p>

      <h3 class="musical-card__title">
        {{ title }}
      </h3>

      <p class="musical-card__description">
        {{ description }}
      </p>

      <a class="musical-card__link" href="#contacto">
        Conocer producción
        <span aria-hidden="true">→</span>
      </a>
    </div>
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
  category: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  alt: {
    type: String,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

.musical-card {
  position: relative;
  min-height: 520px;
  overflow: hidden;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-lg;
  background-color: variables.$color-surface;
  box-shadow: variables.$shadow-md;
}

.musical-card__image {
  position: absolute;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform variables.$transition-slow;
}

.musical-card__overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(
      to top,
      rgba(variables.$color-black, 0.98) 0%,
      rgba(variables.$color-black, 0.65) 48%,
      rgba(variables.$color-black, 0.2) 100%
    );
}

.musical-card__top {
  position: absolute;
  z-index: 1;
  top: variables.$spacing-lg;
  right: variables.$spacing-lg;
  left: variables.$spacing-lg;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.musical-card__status,
.musical-card__year {
  padding: 0.45rem 0.85rem;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-pill;
  color: variables.$color-white;
  background-color: rgba(variables.$color-black, 0.55);
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  backdrop-filter: blur(10px);
}

.musical-card__status {
  color: variables.$color-primary;
}

.musical-card__content {
  position: absolute;
  z-index: 1;
  right: variables.$spacing-xl;
  bottom: variables.$spacing-xl;
  left: variables.$spacing-xl;
}

.musical-card__category {
  margin-bottom: variables.$spacing-sm;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.musical-card__title {
  margin-bottom: variables.$spacing-md;
  font-size: clamp(2rem, 4vw, 3.4rem);
}

.musical-card__description {
  max-width: 560px;
  margin-bottom: variables.$spacing-xl;
}

.musical-card__link {
  display: inline-flex;
  align-items: center;
  gap: variables.$spacing-sm;
  color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  transition: gap variables.$transition-fast;

  @include mixins.focus-visible;
}

.musical-card__link:hover {
  gap: variables.$spacing-md;
}

.musical-card:hover .musical-card__image {
  transform: scale(1.06);
}

@media (max-width: 575px) {
  .musical-card {
    min-height: 480px;
  }

  .musical-card__content {
    right: variables.$spacing-lg;
    bottom: variables.$spacing-lg;
    left: variables.$spacing-lg;
  }

  .musical-card__description {
    font-size: variables.$font-size-sm;
  }
}
</style>