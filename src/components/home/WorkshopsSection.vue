<template>
  <section id="formacion" class="workshops">
    <div class="container workshops__header">
      <div>
        <span class="eyebrow">PROGRAMA FORMATIVO</span>

        <h2>
          Formación pensada para
          <strong>desarrollar artistas.</strong>
        </h2>
      </div>

      <div class="workshops__intro">
        <p>
          Técnica vocal, teoría musical, entrenamiento auditivo,
          interpretación y trabajo escénico se conectan para que
          cada herramienta tenga una aplicación concreta.
        </p>

        <RouterLink to="/formacion">
          Ver programa completo
          <span>→</span>
        </RouterLink>
      </div>
    </div>

    <div class="container workshops__layout">
      <div class="workshops__visual">
        <img
          :src="studentImage"
          alt="Estudiante desarrollando su formación musical en Amo Mi Voz"
          loading="lazy"
        />

        <div class="workshops__visual-overlay"></div>

        <div class="workshops__visual-copy">
          <small>FORMACIÓN INTEGRAL</small>
          <strong>
            Comprender.
            <span>Practicar.</span>
            Aplicar.
          </strong>

          <p>
            El aprendizaje se conecta con repertorio,
            ensayos, conciertos y experiencias reales.
          </p>
        </div>
      </div>

      <div class="workshops__content">
        <div class="workshops__stats">
          <article>
            <small>ENFOQUE</small>
            <strong>Integral</strong>
            <span>Voz + música + escena</span>
          </article>

          <article>
            <small>METODOLOGÍA</small>
            <strong>Aplicada</strong>
            <span>Comprender y utilizar</span>
          </article>

          <article>
            <small>OBJETIVO</small>
            <strong>Autonomía</strong>
            <span>Más herramientas para aprender</span>
          </article>
        </div>

        <div class="workshops__units-head">
          <div>
            <span>ÁREAS DE FORMACIÓN</span>
            <strong>Herramientas que se complementan.</strong>
          </div>

          <small>{{ trainingUnits.length }} UNIDADES</small>
        </div>

        <div class="workshops__grid">
          <WorkshopCard
            v-for="unit in trainingUnits"
            :key="unit.id"
            :title="unit.title"
            :description="unit.description"
            :icon="unit.icon"
          />
        </div>

        <div class="workshops__actions">
          <RouterLink
            to="/formacion"
            class="button button--primary"
          >
            Explorar formación
            <span>→</span>
          </RouterLink>

          <RouterLink
            to="/inscripcion"
            class="button button--secondary"
          >
            Quiero inscribirme
          </RouterLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import WorkshopCard from './WorkshopCard.vue'
import { trainingUnits } from '../../data/trainingUnits.js'
import studentImage from '@/assets/images/alumno-2.png'
</script>

<style scoped>
.workshops {
  padding: 105px 24px;
  color: #152033;
  background:
    radial-gradient(circle at 8% 15%, rgba(159,25,69,.04), transparent 23%),
    #f5f7fa;
}

.container {
  width: min(1180px,100%);
  margin-inline: auto;
}

.workshops__header {
  display: grid;
  gap: 28px;
  align-items: end;
  margin-bottom: 44px;
}

.eyebrow,
.workshops__units-head span {
  color: #916b00;
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .16em;
}

.workshops h2 {
  max-width: 760px;
  margin: 13px 0 0;
  color: #152033;
  font-size: clamp(3rem,5vw,5rem);
  line-height: .96;
  letter-spacing: -.06em;
}

.workshops h2 strong {
  display: block;
  color: #9f1945;
}

.workshops__intro {
  max-width: 540px;
}

.workshops__intro p {
  margin: 0;
  color: #59697f;
  font-size: .88rem;
  line-height: 1.75;
}

.workshops__intro > a {
  display: inline-flex;
  gap: 7px;
  margin-top: 14px;
  color: #9f1945;
  font-size: .68rem;
  font-weight: 900;
  text-decoration: none;
}

.workshops__layout {
  display: grid;
  gap: 32px;
  align-items: start;
}

.workshops__visual {
  position: relative;
  min-height: 600px;
  overflow: hidden;
  border-radius: 24px;
  background: #152033;
  box-shadow: 0 22px 50px rgba(31,48,73,.1);
}

.workshops__visual img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.workshops__visual-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 38%, rgba(9,18,31,.9) 100%);
}

.workshops__visual-copy {
  position: absolute;
  right: 25px;
  bottom: 26px;
  left: 25px;
}

.workshops__visual-copy small {
  color: #e7bc37;
  font-size: .45rem;
  font-weight: 900;
  letter-spacing: .13em;
}

.workshops__visual-copy strong {
  display: block;
  margin-top: 8px;
  color: #fff;
  font-size: clamp(2rem,3.5vw,3rem);
  line-height: .97;
  letter-spacing: -.05em;
}

.workshops__visual-copy strong span {
  color: #f0c747;
}

.workshops__visual-copy p {
  max-width: 500px;
  margin: 12px 0 0;
  color: rgba(255,255,255,.72);
  font-size: .7rem;
  line-height: 1.6;
}

.workshops__content {
  display: grid;
  gap: 18px;
}

.workshops__stats {
  display: grid;
  gap: 10px;
}

.workshops__stats article {
  min-height: 100px;
  padding: 16px;
  border: 1px solid #dce4ed;
  border-radius: 14px;
  background: #fff;
}

.workshops__stats small,
.workshops__stats strong,
.workshops__stats span {
  display: block;
}

.workshops__stats small {
  color: #8b98a8;
  font-size: .48rem;
  font-weight: 900;
}

.workshops__stats strong {
  margin-top: 7px;
  color: #152033;
  font-size: .92rem;
}

.workshops__stats span {
  margin-top: 4px;
  color: #6f7c8f;
  font-size: .58rem;
}

.workshops__units-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 16px;
  margin-top: 8px;
}

.workshops__units-head strong {
  display: block;
  margin-top: 5px;
  color: #152033;
  font-size: .8rem;
}

.workshops__units-head > small {
  color: #7a8798;
  font-size: .52rem;
  font-weight: 900;
}

.workshops__grid {
  display: grid;
  gap: 9px;
}

.workshops__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 4px;
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

@media (min-width: 900px) {
  .workshops__header {
    grid-template-columns: minmax(0,1.1fr) minmax(330px,.9fr);
  }

  .workshops__layout {
    grid-template-columns: minmax(0,.92fr) minmax(0,1.08fr);
    gap: 48px;
  }

  .workshops__stats {
    grid-template-columns: repeat(3,1fr);
  }

  .workshops__grid {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}

@media (max-width: 700px) {
  .workshops {
    padding: 76px 16px;
  }

  .workshops__visual {
    min-height: 470px;
  }

  .workshops__actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
    min-height: 48px;
  }
}
</style>
