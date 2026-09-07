<template>
  <section id="musicales" class="musicals">
    <div class="container">
      <header class="musicals__header">
        <div>
          <span class="eyebrow">EXPERIENCIAS ESCÉNICO-MUSICALES</span>

          <h2>
            La música también
            <strong>puede contar historias.</strong>
          </h2>
        </div>

        <p>
          Transformamos repertorio en experiencias que conectan
          canto, interpretación, narración y escenario.
        </p>
      </header>

      <div class="musicals__showcase">
        <article class="production">
          <div class="production__visual">
            <img :src="cocoFlyer" alt="Producción COCO de Amo Mi Voz" loading="lazy" />
            <span class="production__status">PRESENTADO</span>
          </div>

          <div class="production__content">
            <small>EXPERIENCIA ESCÉNICO-MUSICAL · 2026</small>
            <h3>COCO</h3>
            <p class="production__subtitle">
              Una historia de memoria, familia, música y sueños.
            </p>

            <p>
              Canciones, interpretación y narración se conectan
              para construir una experiencia continua.
            </p>

            <RouterLink to="/musicales">
              Conocer producción
              <span>→</span>
            </RouterLink>
          </div>
        </article>

        <article class="production">
          <div class="production__visual">
            <img :src="jackFlyer" alt="Producción El Extraño Mundo de Jack de Amo Mi Voz" loading="lazy" />
            <span class="production__status production__status--future">EN PREPARACIÓN</span>
          </div>

          <div class="production__content">
            <small>PRÓXIMA EXPERIENCIA ESCÉNICA · 2026</small>
            <h3>El Extraño Mundo de Jack</h3>
            <p class="production__subtitle">
              Halloween se transforma en música, personajes y escenario.
            </p>

            <p>
              Canto, actuación, narración y diseño sonoro se integran
              para crear una experiencia con identidad propia.
            </p>

            <RouterLink to="/musicales">
              Descubrir producción
              <span>→</span>
            </RouterLink>
          </div>
        </article>
      </div>

      <div class="musicals__process">
        <div class="musicals__process-copy">
          <span class="eyebrow">DEL REPERTORIO AL ESCENARIO</span>
          <h3>
            Una historia se construye
            <strong>capa por capa.</strong>
          </h3>
        </div>

        <div class="musicals__process-list">
          <article
            v-for="step in process"
            :key="step.number"
          >
            <span>{{ step.number }}</span>
            <div>
              <small>{{ step.label }}</small>
              <strong>{{ step.title }}</strong>
              <p>{{ step.description }}</p>
            </div>
          </article>
        </div>
      </div>

      <div class="musicals__actions">
        <RouterLink to="/musicales" class="button button--primary">
          Explorar musicales
          <span>→</span>
        </RouterLink>

        <RouterLink to="/galeria" class="button button--secondary">
          Ver galería
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import cocoFlyer from '@/assets/images/coco-flayer.png'
import jackFlyer from '@/assets/images/jack-flayer.png'

const process = [
  { number:'01', label:'REPERTORIO', title:'La música', description:'Seleccionamos canciones capaces de representar momentos importantes de la historia.' },
  { number:'02', label:'NARRATIVA', title:'El relato', description:'La narración conecta las canciones y permite construir un recorrido comprensible.' },
  { number:'03', label:'INTERPRETACIÓN', title:'Los personajes', description:'El estudiante trabaja intención, expresión, movimiento y presencia escénica.' },
  { number:'04', label:'PRODUCCIÓN', title:'La atmósfera', description:'Audio, efectos, transiciones y elementos visuales completan la experiencia.' }
]
</script>

<style scoped>
.musicals {
  padding: 110px 24px;
  color: #fff;
  background:
    radial-gradient(circle at 10% 12%, rgba(213,167,32,.08), transparent 24%),
    linear-gradient(135deg,#111b2e,#18243a);
}

.container {
  width: min(1180px,100%);
  margin-inline: auto;
}

.musicals__header {
  display: grid;
  gap: 26px;
  align-items: end;
  margin-bottom: 42px;
}

.eyebrow {
  color: #e1b532;
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .15em;
}

.musicals h2 {
  max-width: 760px;
  margin: 13px 0 0;
  font-size: clamp(3rem,5vw,5rem);
  line-height: .95;
  letter-spacing: -.06em;
}

.musicals h2 strong,
.musicals__process h3 strong {
  display: block;
  color: #f0c748;
}

.musicals__header > p {
  max-width: 520px;
  margin: 0;
  color: rgba(255,255,255,.68);
  font-size: .88rem;
  line-height: 1.75;
}

.musicals__showcase {
  display: grid;
  gap: 14px;
}

.production {
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 20px;
  background: rgba(255,255,255,.05);
}

.production__visual {
  position: relative;
  min-height: 380px;
  overflow: hidden;
}

.production__visual img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.production__visual::after {
  position: absolute;
  inset: 0;
  content: '';
  background: linear-gradient(180deg, transparent 45%, rgba(10,17,29,.78));
}

.production__status {
  position: absolute;
  z-index: 2;
  top: 16px;
  left: 16px;
  padding: 7px 10px;
  border-radius: 999px;
  color: #bdebd7;
  background: rgba(26,128,87,.72);
  font-size: .42rem;
  font-weight: 900;
}

.production__status--future {
  color: #ffe797;
  background: rgba(145,107,0,.72);
}

.production__content {
  padding: 20px;
}

.production__content small {
  color: #e1b532;
  font-size: .45rem;
  font-weight: 900;
  letter-spacing: .1em;
}

.production__content h3 {
  margin: 8px 0 0;
  color: #fff;
  font-size: 1.45rem;
}

.production__subtitle {
  color: #fff !important;
  font-weight: 800;
}

.production__content p {
  margin: 9px 0 0;
  color: rgba(255,255,255,.58);
  font-size: .65rem;
  line-height: 1.55;
}

.production__content a {
  display: inline-flex;
  gap: 7px;
  margin-top: 16px;
  color: #fff;
  font-size: .62rem;
  font-weight: 900;
  text-decoration: none;
}

.musicals__process {
  display: grid;
  gap: 26px;
  margin-top: 50px;
  padding: 26px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 18px;
  background: rgba(255,255,255,.04);
}

.musicals__process h3 {
  max-width: 520px;
  margin: 10px 0 0;
  font-size: clamp(2rem,3.6vw,3rem);
  line-height: 1;
  letter-spacing: -.05em;
}

.musicals__process-list {
  display: grid;
  gap: 8px;
}

.musicals__process-list article {
  display: flex;
  gap: 11px;
  padding: 14px;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 12px;
  background: rgba(255,255,255,.035);
}

.musicals__process-list article > span {
  color: #e1b532;
  font-size: .48rem;
  font-weight: 900;
}

.musicals__process-list small,
.musicals__process-list strong {
  display: block;
}

.musicals__process-list small {
  color: #e1b532;
  font-size: .4rem;
  font-weight: 900;
}

.musicals__process-list strong {
  margin-top: 4px;
  color: #fff;
  font-size: .7rem;
}

.musicals__process-list p {
  margin: 5px 0 0;
  color: rgba(255,255,255,.5);
  font-size: .55rem;
  line-height: 1.45;
}

.musicals__actions {
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
  border: 1px solid rgba(255,255,255,.17);
  color: #fff;
  background: rgba(255,255,255,.05);
}

@media (min-width: 850px) {
  .musicals__header {
    grid-template-columns: minmax(0,1.1fr) minmax(320px,.9fr);
  }

  .musicals__showcase {
    grid-template-columns: repeat(2,1fr);
  }

  .musicals__process {
    grid-template-columns: minmax(0,.8fr) minmax(0,1.2fr);
  }

  .musicals__process-list {
    grid-template-columns: repeat(2,1fr);
  }
}

@media (max-width: 700px) {
  .musicals {
    padding: 78px 16px;
  }

  .production__visual {
    min-height: 320px;
  }

  .musicals__actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
</style>
