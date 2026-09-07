<template>
  <section class="benefits" v-reveal>
    <div class="container">
      <header class="benefits__header">
        <div>
          <span class="eyebrow">¿POR QUÉ AMO MI VOZ?</span>
          <h2>
            No se trata solamente de
            <strong>cantar mejor.</strong>
          </h2>
        </div>

        <div class="benefits__copy">
          <p>
            Buscamos que cada estudiante gane herramientas,
            seguridad y autonomía para comprender mejor lo que
            hace y expresarse con mayor libertad.
          </p>

          <RouterLink to="/academia">
            Conocer nuestra metodología
            <span>→</span>
          </RouterLink>
        </div>
      </header>

      <div class="benefits__grid">
        <article
          v-for="(benefit,index) in benefits"
          :key="benefit.id"
        >
          <span>{{ String(index + 1).padStart(2,'0') }}</span>
          <h3>{{ benefit.title }}</h3>
          <p>{{ benefit.description }}</p>
        </article>
      </div>

      <div class="benefits__impact">
        <div class="benefits__impact-copy">
          <span class="eyebrow">LO QUE BUSCAMOS DESARROLLAR</span>
          <h3>
            Herramientas para aprender,
            <strong>expresarse y crecer.</strong>
          </h3>
        </div>

        <div class="benefits__impact-grid">
          <article
            v-for="item in impactAreas"
            :key="item.number"
          >
            <span>{{ item.number }}</span>
            <div>
              <strong>{{ item.title }}</strong>
              <small>{{ item.description }}</small>
            </div>
          </article>
        </div>
      </div>

      <div class="benefits__actions">
        <RouterLink to="/formacion" class="button button--primary">
          Ver formación
          <span>→</span>
        </RouterLink>

        <RouterLink to="/inscripcion" class="button button--secondary">
          Quiero comenzar
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { benefits } from '../../data/benefits.js'

const impactAreas = [
  { number:'01', title:'Confianza', description:'Mayor seguridad al cantar, interpretar y presentarse.' },
  { number:'02', title:'Escucha', description:'Más atención al sonido, afinación, ritmo y trabajo grupal.' },
  { number:'03', title:'Comprensión', description:'Entender mejor las herramientas musicales que se utilizan.' },
  { number:'04', title:'Autonomía', description:'Más recursos para estudiar y resolver desafíos musicales.' },
  { number:'05', title:'Interpretación', description:'Mayor conexión entre texto, emoción y comunicación.' },
  { number:'06', title:'Experiencia', description:'Ensayos y presentaciones que consolidan el aprendizaje.' }
]
</script>

<style scoped>
.benefits {
  padding: 105px 24px;
  color: #152033;
  background: #fff;
}

.container {
  width: min(1180px,100%);
  margin-inline: auto;
}

.benefits__header {
  display: grid;
  gap: 28px;
  align-items: end;
}

.eyebrow {
  color: #916b00;
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .16em;
}

.benefits h2 {
  max-width: 760px;
  margin: 13px 0 0;
  font-size: clamp(3rem,5vw,5rem);
  line-height: .96;
  letter-spacing: -.06em;
}

.benefits h2 strong,
.benefits__impact h3 strong {
  display: block;
  color: #9f1945;
}

.benefits__copy {
  max-width: 520px;
}

.benefits__copy p {
  margin: 0;
  color: #59697f;
  font-size: .88rem;
  line-height: 1.75;
}

.benefits__copy > a {
  display: inline-flex;
  gap: 7px;
  margin-top: 14px;
  color: #9f1945;
  font-size: .67rem;
  font-weight: 900;
  text-decoration: none;
}

.benefits__grid {
  display: grid;
  gap: 10px;
  margin-top: 42px;
}

.benefits__grid article {
  min-height: 150px;
  padding: 20px;
  border: 1px solid #dce4ed;
  border-radius: 16px;
  background: #f9fbfd;
}

.benefits__grid article > span {
  color: #916b00;
  font-size: .5rem;
  font-weight: 900;
}

.benefits__grid h3 {
  margin: 22px 0 0;
  color: #152033;
  font-size: .95rem;
}

.benefits__grid p {
  margin: 8px 0 0;
  color: #6f7c8f;
  font-size: .64rem;
  line-height: 1.55;
}

.benefits__impact {
  display: grid;
  gap: 26px;
  margin-top: 52px;
  padding: 28px;
  border-radius: 20px;
  background: linear-gradient(135deg,#f6f8fb,#eef2f6);
}

.benefits__impact h3 {
  max-width: 580px;
  margin: 10px 0 0;
  color: #152033;
  font-size: clamp(2rem,3.6vw,3.2rem);
  line-height: 1;
  letter-spacing: -.05em;
}

.benefits__impact-grid {
  display: grid;
  gap: 8px;
}

.benefits__impact-grid article {
  display: flex;
  gap: 11px;
  min-height: 82px;
  padding: 14px;
  border: 1px solid #dce4ed;
  border-radius: 12px;
  background: #fff;
}

.benefits__impact-grid article > span {
  color: #916b00;
  font-size: .47rem;
  font-weight: 900;
}

.benefits__impact-grid strong,
.benefits__impact-grid small {
  display: block;
}

.benefits__impact-grid strong {
  color: #152033;
  font-size: .7rem;
}

.benefits__impact-grid small {
  margin-top: 4px;
  color: #6f7c8f;
  font-size: .55rem;
  line-height: 1.45;
}

.benefits__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 24px;
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
  border: 1px solid #d7e0e9;
  color: #344359;
  background: #fff;
}

@media (min-width: 800px) {
  .benefits__header {
    grid-template-columns: minmax(0,1.1fr) minmax(330px,.9fr);
  }

  .benefits__grid {
    grid-template-columns: repeat(3,1fr);
  }

  .benefits__impact {
    grid-template-columns: minmax(0,.8fr) minmax(0,1.2fr);
  }

  .benefits__impact-grid {
    grid-template-columns: repeat(2,1fr);
  }
}

@media (max-width: 700px) {
  .benefits {
    padding: 76px 16px;
  }

  .benefits__actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
</style>
