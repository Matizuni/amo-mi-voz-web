<template>
  <section class="experiences">
    <div class="container">
      <header class="experiences__header">
        <div>
          <span class="eyebrow">EXPERIENCIAS REALES</span>
          <h2>
            Aprender música también es
            <strong>vivir el escenario.</strong>
          </h2>
        </div>

        <p>
          Ensayar, compartir y presentar el trabajo frente al público
          convierte el aprendizaje en una experiencia que se recuerda.
        </p>
      </header>

      <div class="experiences__grid">
        <article class="experience">
          <div class="experience__image">
            <img :src="conciertoImage" alt="Concierto de estudiantes de Amo Mi Voz" loading="lazy" />
            <span>CONCIERTOS</span>
          </div>

          <div class="experience__copy">
            <small>EXPERIENCIA ESCÉNICA</small>
            <h3>Conciertos de estudiantes</h3>
            <p>
              Instancias donde nuestros estudiantes llevan al escenario
              lo aprendido durante su proceso formativo.
            </p>
          </div>
        </article>

        <article class="experience experience--featured">
          <div class="experience__image">
            <img :src="cocoImage" alt="Producción escénico-musical de Amo Mi Voz" loading="lazy" />
            <span>MUSICALES</span>
          </div>

          <div class="experience__copy">
            <small>PRODUCCIÓN ARTÍSTICA</small>
            <h3>Musicales y grandes experiencias</h3>
            <p>
              Música, interpretación y puesta en escena se integran
              en experiencias artísticas construidas en comunidad.
            </p>
          </div>
        </article>
      </div>

      <div class="experiences__closing">
        <p>
          No formamos solamente voces.
          <strong>Formamos artistas capaces de vivir la música.</strong>
        </p>

        <RouterLink to="/galeria">
          Ver galería
          <span>→</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import conciertoImage from '@/assets/images/concierto-alumnos.png'
import cocoImage from '@/assets/images/musical-coco.png'
</script>

<style scoped>
.experiences {
  padding: 105px 24px;
  color: #152033;
  background: #f5f7fa;
}

.container {
  width: min(1180px,100%);
  margin-inline: auto;
}

.experiences__header {
  display: grid;
  gap: 24px;
  align-items: end;
  margin-bottom: 40px;
}

.eyebrow {
  color: #916b00;
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .16em;
}

.experiences h2 {
  max-width: 760px;
  margin: 13px 0 0;
  font-size: clamp(3rem,5vw,5rem);
  line-height: .96;
  letter-spacing: -.06em;
}

.experiences h2 strong {
  display: block;
  color: #9f1945;
}

.experiences__header > p {
  max-width: 500px;
  margin: 0;
  color: #59697f;
  font-size: .88rem;
  line-height: 1.75;
}

.experiences__grid {
  display: grid;
  gap: 14px;
}

.experience {
  overflow: hidden;
  border: 1px solid #dce4ed;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(31,48,73,.05);
}

.experience__image {
  position: relative;
  min-height: 360px;
  overflow: hidden;
}

.experience__image img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .5s ease;
}

.experience:hover .experience__image img {
  transform: scale(1.025);
}

.experience__image::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(180deg, transparent 48%, rgba(10,18,31,.72));
}

.experience__image > span {
  position: absolute;
  z-index: 2;
  top: 16px;
  left: 16px;
  padding: 7px 10px;
  border-radius: 999px;
  color: #fff;
  background: rgba(17,28,49,.68);
  font-size: .43rem;
  font-weight: 900;
  letter-spacing: .11em;
  backdrop-filter: blur(8px);
}

.experience__copy {
  padding: 20px;
}

.experience__copy small {
  color: #916b00;
  font-size: .47rem;
  font-weight: 900;
  letter-spacing: .11em;
}

.experience__copy h3 {
  margin: 7px 0 0;
  color: #152033;
  font-size: 1.15rem;
}

.experience__copy p {
  margin: 9px 0 0;
  color: #6f7c8f;
  font-size: .68rem;
  line-height: 1.6;
}

.experiences__closing {
  display: flex;
  gap: 18px;
  align-items: center;
  justify-content: space-between;
  margin-top: 24px;
  padding: 20px;
  border: 1px solid #e4d69d;
  border-radius: 16px;
  background: #fffaf0;
}

.experiences__closing p {
  margin: 0;
  color: #344359;
  font-size: .8rem;
}

.experiences__closing p strong {
  color: #9f1945;
}

.experiences__closing a {
  display: inline-flex;
  gap: 7px;
  flex: 0 0 auto;
  color: #9f1945;
  font-size: .66rem;
  font-weight: 900;
  text-decoration: none;
}

@media (min-width: 850px) {
  .experiences__header {
    grid-template-columns: minmax(0,1.1fr) minmax(320px,.9fr);
  }

  .experiences__grid {
    grid-template-columns: repeat(2,1fr);
  }
}

@media (max-width: 700px) {
  .experiences {
    padding: 76px 16px;
  }

  .experience__image {
    min-height: 300px;
  }

  .experiences__closing {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
