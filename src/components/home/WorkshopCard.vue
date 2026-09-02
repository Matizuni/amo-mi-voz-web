<template>
  <article
    class="workshop-card reveal fade-up"
    v-reveal
  >
    <div class="workshop-card__top">
      <span
        class="workshop-card__icon"
        aria-hidden="true"
      >
        {{ icon }}
      </span>

      <span class="workshop-card__line" aria-hidden="true"></span>
    </div>

    <div class="workshop-card__content">
      <h3 class="workshop-card__title">
        {{ title }}
      </h3>

      <p class="workshop-card__description">
        {{ description }}
      </p>
    </div>

    <a
      class="workshop-card__link"
      href="#contacto"
    >
      <span>Consultar</span>
      <strong aria-hidden="true">→</strong>
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
  position: relative;
  display: flex;
  min-height: 235px;
  overflow: hidden;
  padding: 22px;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.035),
      rgba(255, 255, 255, 0.008)
    ),
    #111;
  box-shadow:
    0 18px 40px
    rgba(0, 0, 0, 0.18);
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    background 0.22s ease,
    box-shadow 0.22s ease;
}

.workshop-card::before {
  position: absolute;
  top: 0;
  left: 22px;
  width: 54px;
  height: 1px;
  background:
    variables.$color-primary;
  content: '';
  opacity: 0.55;
}

.workshop-card:hover {
  border-color:
    rgba(variables.$color-primary, 0.28);
  background:
    linear-gradient(
      145deg,
      rgba(variables.$color-primary, 0.045),
      rgba(255, 255, 255, 0.01)
    ),
    #111;
  box-shadow:
    0 24px 55px
    rgba(0, 0, 0, 0.28);
  transform:
    translateY(-4px);
}

/* =========================
   TOP
========================= */

.workshop-card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.workshop-card__icon {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border:
    1px solid
    rgba(variables.$color-primary, 0.22);
  border-radius: 12px;
  color:
    variables.$color-primary;
  background:
    rgba(variables.$color-primary, 0.055);
  font-size: 1.35rem;
}

.workshop-card__line {
  width: 30px;
  height: 1px;
  background:
    rgba(variables.$color-primary, 0.25);
}

/* =========================
   CONTENT
========================= */

.workshop-card__content {
  margin-top: 22px;
}

.workshop-card__title {
  max-width: 230px;
  margin: 0;
  color: #f0f0f0;
  font-family:
    variables.$font-family-primary;
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.035em;
}

.workshop-card__description {
  max-width: 250px;
  margin: 12px 0 0;
  color: #8a8a8a;
  font-size: 0.73rem;
  line-height: 1.62;
}

/* =========================
   LINK
========================= */

.workshop-card__link {
  display: inline-flex;
  gap: 9px;
  align-items: center;
  align-self: flex-start;
  margin-top: auto;
  padding-top: 20px;
  color:
    variables.$color-primary;
  font-size: 0.67rem;
  font-weight: 800;
  text-decoration: none;
  transition:
    gap 0.2s ease,
    color 0.2s ease;

  @include mixins.focus-visible;
}

.workshop-card__link strong {
  font-size: 0.9rem;
  font-weight: 500;
  transition:
    transform 0.2s ease;
}

.workshop-card__link:hover {
  gap: 13px;
}

.workshop-card__link:hover strong {
  transform:
    translateX(2px);
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1100px) {
  .workshop-card {
    min-height: 220px;
  }
}

@media (max-width: 700px) {
  .workshop-card {
    min-height: auto;
    padding: 20px;
  }

  .workshop-card__title {
    max-width: none;
    font-size: 1.12rem;
  }

  .workshop-card__description {
    max-width: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .workshop-card,
  .workshop-card__link,
  .workshop-card__link strong {
    transition: none;
  }
}
</style>
