<template>
  <section id="academia" class="about">
    <div class="container about__container">
      <div class="about__media">
        <img
          class="about__image"
          src="https://images.unsplash.com/photo-1524650359799-842906ca1c06?q=80&w=1200"
          alt="Estudiante desarrollando sus habilidades musicales"
        />

        <div class="about__badge">
          <strong>Formación artística</strong>
          <span>con experiencia escénica real</span>
        </div>
      </div>

      <div class="about__content">
        <p class="about__eyebrow">Nuestra Academia</p>

        <h2 class="about__title">
          Un espacio para descubrir, desarrollar y compartir tu talento
        </h2>

        <p class="about__description">
          En la Academia de Talentos Amo Mi Voz formamos artistas mediante una
          enseñanza cercana, práctica y orientada al escenario.
        </p>

        <p class="about__description">
          Trabajamos la técnica vocal, la interpretación, la confianza y el
          desarrollo musical de cada estudiante, respetando su identidad y su
          propio proceso artístico.
        </p>

        <div class="about__features">
          <article class="about__feature">
            <span class="about__feature-number">01</span>

            <div>
              <h3>Formación personalizada</h3>
              <p>
                Acompañamiento adaptado a la edad, experiencia y objetivos de
                cada estudiante.
              </p>
            </div>
          </article>

          <article class="about__feature">
            <span class="about__feature-number">02</span>

            <div>
              <h3>Experiencia escénica</h3>
              <p>
                Ensayos, conciertos y musicales que permiten aplicar lo
                aprendido frente al público.
              </p>
            </div>
          </article>
        </div>

        <a class="about__button" href="#talleres">
          Conoce nuestros talleres
        </a>
      </div>
    </div>
  </section>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;
@use '@/assets/styles/abstracts/mixins' as mixins;

.about {
  @include mixins.section-spacing;

  position: relative;
  overflow: hidden;
  background-color: variables.$color-surface;
}

.about::before {
  position: absolute;
  top: -10rem;
  right: -10rem;
  width: 24rem;
  height: 24rem;
  border-radius: 50%;
  background-color: rgba(variables.$color-primary, 0.08);
  content: '';
  filter: blur(40px);
}

.about__container {
  position: relative;
  display: grid;
  gap: variables.$spacing-3xl;
  align-items: center;

  @include mixins.respond-to(lg) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

.about__media {
  position: relative;
  min-height: 460px;
}

.about__image {
  width: 100%;
  height: 100%;
  min-height: 460px;
  border-radius: variables.$radius-lg;
  object-fit: cover;
  box-shadow: variables.$shadow-lg;
}

.about__badge {
  position: absolute;
  right: variables.$spacing-md;
  bottom: variables.$spacing-md;
  display: flex;
  max-width: 280px;
  flex-direction: column;
  padding: variables.$spacing-lg;
  border: 1px solid variables.$color-border;
  border-radius: variables.$radius-md;
  background-color: rgba(variables.$color-black, 0.78);
  backdrop-filter: blur(12px);
}

.about__badge strong {
  color: variables.$color-primary;
  font-size: variables.$font-size-md;
}

.about__badge span {
  color: variables.$color-gray-light;
  font-size: variables.$font-size-sm;
}

.about__content {
  max-width: 620px;
}

.about__eyebrow {
  margin-bottom: variables.$spacing-md;
  color: variables.$color-primary;
  font-size: variables.$font-size-sm;
  font-weight: variables.$font-weight-semibold;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.about__title {
  margin-bottom: variables.$spacing-xl;
  font-size: clamp(2.3rem, 5vw, 4rem);
}

.about__description {
  margin-bottom: variables.$spacing-md;
  font-size: variables.$font-size-md;
}

.about__features {
  display: grid;
  gap: variables.$spacing-lg;
  margin-block: variables.$spacing-2xl;
}

.about__feature {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: variables.$spacing-lg;
  padding-top: variables.$spacing-lg;
  border-top: 1px solid variables.$color-border;
}

.about__feature-number {
  color: variables.$color-primary;
  font-family: variables.$font-family-heading;
  font-size: variables.$font-size-xl;
}

.about__feature h3 {
  margin-bottom: variables.$spacing-sm;
  font-family: variables.$font-family-primary;
  font-size: variables.$font-size-lg;
}

.about__feature p {
  font-size: variables.$font-size-sm;
}

.about__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 1.75rem;
  border-radius: variables.$radius-pill;
  color: variables.$color-black;
  background-color: variables.$color-primary;
  font-weight: variables.$font-weight-semibold;
  transition:
    transform variables.$transition-fast,
    background-color variables.$transition-fast;

  @include mixins.focus-visible;
}

.about__button:hover {
  background-color: variables.$color-primary-light;
  transform: translateY(-2px);
}
</style>