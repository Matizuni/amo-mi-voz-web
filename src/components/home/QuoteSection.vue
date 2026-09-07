<template>
  <section class="quote" v-reveal>
    <div class="container">
      <div class="quote__hero">
        <div>
          <span class="eyebrow">NUESTRA FORMA DE ENTENDER LA MÚSICA</span>

          <blockquote>
            Cada voz tiene
            <strong>una historia.</strong>
            Nuestro trabajo es ayudarla a ser
            <em>escuchada.</em>
          </blockquote>

          <div class="quote__author">
            <span></span>
            <div>
              <strong>Matías Zúñiga</strong>
              <small>Dirección · Academia de Talentos Amo Mi Voz</small>
            </div>
          </div>
        </div>

        <div class="quote__purpose">
          <span>AMV · PROPÓSITO</span>

          <h3>Formar para expresarse.</h3>

          <p>
            Crear un espacio donde cada estudiante pueda descubrir,
            comprender y desarrollar su voz mientras construye
            herramientas musicales para expresarse con mayor seguridad.
          </p>
        </div>
      </div>

      <div class="quote__pillars">
        <article
          v-for="pillar in pillars"
          :key="pillar.number"
        >
          <span>{{ pillar.number }}</span>
          <small>{{ pillar.label }}</small>
          <strong>{{ pillar.title }}</strong>
          <p>{{ pillar.description }}</p>
        </article>
      </div>

      <div class="quote__cta">
        <div>
          <span class="eyebrow">TU PROCESO PUEDE COMENZAR AQUÍ</span>
          <h2>
            ¿Quieres descubrir hasta dónde
            <strong>puede llegar tu voz?</strong>
          </h2>
        </div>

        <div class="quote__actions">
          <RouterLink to="/inscripcion" class="button button--primary">
            Quiero inscribirme
            <span>→</span>
          </RouterLink>

          <RouterLink to="/contacto" class="button button--secondary">
            Hablar con la Academia
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'

const pillars = [
  { number:'01', label:'DESCUBRIR', title:'Tu propia voz', description:'Reconocer fortalezas, posibilidades y una identidad vocal propia.' },
  { number:'02', label:'COMPRENDER', title:'Cómo funciona la música', description:'Entender lo que escuchas, cantas y utilizas durante tu formación.' },
  { number:'03', label:'EXPRESAR', title:'Lo que quieres comunicar', description:'Transformar técnica y comprensión en interpretación y presencia.' }
]
</script>

<style scoped>
.quote {
  padding: 110px 24px;
  color: #152033;
  background: #fff;
}

.container {
  width: min(1180px,100%);
  margin-inline: auto;
}

.quote__hero {
  display: grid;
  gap: 34px;
  align-items: center;
}

.eyebrow {
  color: #916b00;
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .15em;
}

blockquote {
  max-width: 760px;
  margin: 16px 0 0;
  color: #152033;
  font-size: clamp(3rem,5.4vw,5.3rem);
  font-weight: 800;
  line-height: .96;
  letter-spacing: -.06em;
}

blockquote strong,
blockquote em {
  display: block;
  font-style: normal;
}

blockquote strong {
  color: #9f1945;
}

blockquote em {
  color: #916b00;
}

.quote__author {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 22px;
}

.quote__author > span {
  width: 36px;
  height: 2px;
  background: #9f1945;
}

.quote__author strong,
.quote__author small {
  display: block;
}

.quote__author strong {
  color: #152033;
  font-size: .72rem;
}

.quote__author small {
  margin-top: 4px;
  color: #7a8798;
  font-size: .54rem;
}

.quote__purpose {
  padding: 24px;
  border: 1px solid #dce4ed;
  border-radius: 18px;
  background: #f7f9fc;
}

.quote__purpose > span {
  color: #916b00;
  font-size: .46rem;
  font-weight: 900;
  letter-spacing: .11em;
}

.quote__purpose h3 {
  margin: 12px 0 0;
  color: #152033;
  font-size: 1.6rem;
}

.quote__purpose p {
  margin: 12px 0 0;
  color: #5f6d81;
  font-size: .72rem;
  line-height: 1.65;
}

.quote__pillars {
  display: grid;
  gap: 10px;
  margin-top: 42px;
}

.quote__pillars article {
  min-height: 170px;
  padding: 20px;
  border: 1px solid #dce4ed;
  border-radius: 16px;
  background: #fff;
}

.quote__pillars article > span,
.quote__pillars small {
  color: #916b00;
  font-size: .46rem;
  font-weight: 900;
}

.quote__pillars small {
  display: block;
  margin-top: 22px;
}

.quote__pillars strong {
  display: block;
  margin-top: 7px;
  color: #152033;
  font-size: .9rem;
}

.quote__pillars p {
  margin: 8px 0 0;
  color: #6f7c8f;
  font-size: .62rem;
  line-height: 1.55;
}

.quote__cta {
  display: grid;
  gap: 22px;
  align-items: center;
  margin-top: 42px;
  padding: 28px;
  border-radius: 20px;
  color: #fff;
  background: linear-gradient(135deg,#111b2e,#1b2941);
}

.quote__cta .eyebrow {
  color: #e3b62f;
}

.quote__cta h2 {
  max-width: 760px;
  margin: 10px 0 0;
  color: #fff;
  font-size: clamp(2rem,3.8vw,3.4rem);
  line-height: 1;
  letter-spacing: -.05em;
}

.quote__cta h2 strong {
  display: block;
  color: #f0c748;
}

.quote__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
}

.button {
  display: inline-flex;
  min-height: 46px;
  gap: 8px;
  align-items: center;
  justify-content: center;
  padding: 0 17px;
  border-radius: 10px;
  font-size: .65rem;
  font-weight: 900;
  text-decoration: none;
}

.button--primary {
  color: #fff;
  background: #9f1945;
}

.button--secondary {
  border: 1px solid rgba(255,255,255,.17);
  color: #fff;
  background: rgba(255,255,255,.05);
}

@media (min-width: 850px) {
  .quote__hero {
    grid-template-columns: minmax(0,1.1fr) minmax(320px,.9fr);
  }

  .quote__pillars {
    grid-template-columns: repeat(3,1fr);
  }

  .quote__cta {
    grid-template-columns: minmax(0,1.2fr) auto;
  }
}

@media (max-width: 700px) {
  .quote {
    padding: 78px 16px;
  }

  .quote__actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
</style>
