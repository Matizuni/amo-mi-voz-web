<template>
  <section class="quote">
    <div class="container quote__container">
      <div class="quote__content">
        <span class="quote__symbol" aria-hidden="true">“</span>

        <blockquote class="quote__text">
          Cada voz tiene una historia. Nuestro trabajo es ayudarla a ser
          escuchada.
        </blockquote>

        <div class="quote__author">
          <span class="quote__line"></span>

          <div>
            <p class="quote__name">Matías Zúñiga</p>
            <p class="quote__role">
              Director musical · Academia Amo Mi Voz
            </p>
          </div>
        </div>
      </div>

      <div class="quote__visual" aria-hidden="true">
        <div class="quote__circle">
          <span>AMO</span>
          <span>MI</span>
          <span>VOZ</span>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

.quote {
  @include mixins.section-spacing;

  position: relative;
  overflow: hidden;
  background:
    radial-gradient(
      circle at 85% 50%,
      rgba(variables.$color-primary, 0.12),
      transparent 35%
    ),
    variables.$color-surface;
}

.quote__container {
  display: grid;
  gap: variables.$spacing-3xl;
  align-items: center;

  @include mixins.respond-to(lg) {
    grid-template-columns: minmax(0, 1.2fr) minmax(320px, 0.8fr);
  }
}

.quote__content {
  position: relative;
  z-index: 1;
  max-width: 850px;
}

.quote__symbol {
  display: block;
  height: 4rem;
  color: variables.$color-primary;
  font-family: variables.$font-family-heading;
  font-size: 7rem;
  line-height: 1;
}

.quote__text {
  margin-bottom: variables.$spacing-2xl;
  font-family: variables.$font-family-heading;
  font-size: clamp(2.3rem, 5vw, 5rem);
  line-height: 1.08;
  text-wrap: balance;
}

.quote__author {
  display: flex;
  align-items: center;
  gap: variables.$spacing-lg;
}

.quote__line {
  width: 64px;
  height: 1px;
  background-color: variables.$color-primary;
}

.quote__name {
  color: variables.$color-white;
  font-weight: variables.$font-weight-semibold;
}

.quote__role {
  font-size: variables.$font-size-sm;
}

.quote__visual {
  display: none;

  @include mixins.respond-to(lg) {
    display: grid;
    place-items: center;
  }
}

.quote__circle {
  display: grid;
  width: min(28vw, 360px);
  aspect-ratio: 1;
  place-content: center;
  border: 1px solid rgba(variables.$color-primary, 0.28);
  border-radius: 50%;
  color: variables.$color-primary;
  font-family: variables.$font-family-heading;
  font-size: clamp(2rem, 5vw, 4rem);
  line-height: 0.88;
  text-align: center;
  box-shadow:
    0 0 0 28px rgba(variables.$color-primary, 0.025),
    0 0 0 56px rgba(variables.$color-primary, 0.015);
  transition:
    transform variables.$transition-slow,
    box-shadow variables.$transition-slow;
}

.quote__circle span {
  display: block;
}

.quote__circle:hover {
  box-shadow:
    0 0 0 34px rgba(variables.$color-primary, 0.04),
    0 0 0 68px rgba(variables.$color-primary, 0.02);
  transform: rotate(-3deg) scale(1.03);
}
</style>