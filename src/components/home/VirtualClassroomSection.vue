<template>
  <section class="virtual-classroom">
    <div class="container virtual-classroom__layout">
      <div class="virtual-classroom__copy">
        <span class="eyebrow">
          AULA VIRTUAL · TECNOLOGÍA EDUCATIVA
        </span>

        <h2>
          La clase termina.
          <strong>El aprendizaje continúa.</strong>
        </h2>

        <p class="virtual-classroom__lead">
          Nuestra Aula Virtual reúne clases, materiales, repertorio,
          tareas, evaluaciones y progreso en un espacio diseñado
          para acompañar a cada estudiante.
        </p>

        <div class="virtual-classroom__features">
          <article>
            <span>01</span>
            <div>
              <strong>Clases y contenidos</strong>
              <p>Programa formativo organizado y fácil de recorrer.</p>
            </div>
          </article>

          <article>
            <span>02</span>
            <div>
              <strong>Materiales y repertorio</strong>
              <p>PDF, partituras, audios y recursos en un solo lugar.</p>
            </div>
          </article>

          <article>
            <span>03</span>
            <div>
              <strong>Evaluaciones y progreso</strong>
              <p>Seguimiento claro para estudiantes y profesores.</p>
            </div>
          </article>
        </div>

        <div class="virtual-classroom__actions">
          <RouterLink to="/aula" class="button button--primary">
            Entrar al Aula Virtual
            <span>→</span>
          </RouterLink>

          <RouterLink to="/formacion" class="button button--secondary">
            Conocer la formación
          </RouterLink>
        </div>
      </div>

      <div class="virtual-classroom__visual" aria-label="Vista conceptual del Aula Virtual">
        <div class="portal">
          <header class="portal__bar">
            <div>
              <span></span><span></span><span></span>
            </div>
            <small>AULA · AMO MI VOZ</small>
          </header>

          <div class="portal__body">
            <aside class="portal__side">
              <div class="portal__brand">AMV</div>
              <span>Inicio</span>
              <span>Mi curso</span>
              <span class="is-active">Contenido</span>
              <span>Recursos</span>
              <span>Progreso</span>
            </aside>

            <main class="portal__content">
              <div class="portal__hero">
                <small>UNIDAD I · CLASE 01</small>
                <strong>Del sonido a la música</strong>
                <span>Tu recorrido académico, claro y ordenado.</span>
              </div>

              <div class="portal__cards">
                <article><strong>4</strong><span>Materiales</span></article>
                <article><strong>1</strong><span>Actividad</span></article>
                <article><strong>1</strong><span>Evaluación</span></article>
              </div>

              <div class="portal__progress">
                <div>
                  <span>Progreso de la unidad</span>
                  <strong>67%</strong>
                </div>
                <i><b></b></i>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.virtual-classroom {
  padding: 110px 24px;
  color: #fff;
  background:
    radial-gradient(circle at 86% 22%, rgba(159,25,69,.18), transparent 28%),
    linear-gradient(135deg,#101a2d,#17253c);
}

.container {
  width: min(1180px,100%);
  margin-inline: auto;
}

.virtual-classroom__layout {
  display: grid;
  gap: 42px;
  align-items: center;
}

.eyebrow {
  color: #e2b72f;
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .15em;
}

.virtual-classroom h2 {
  max-width: 740px;
  margin: 13px 0 0;
  font-size: clamp(3rem,5vw,5rem);
  line-height: .95;
  letter-spacing: -.06em;
}

.virtual-classroom h2 strong {
  display: block;
  color: #f1c647;
}

.virtual-classroom__lead {
  max-width: 620px;
  margin: 20px 0 0;
  color: rgba(255,255,255,.7);
  font-size: .9rem;
  line-height: 1.72;
}

.virtual-classroom__features {
  display: grid;
  gap: 9px;
  margin-top: 26px;
}

.virtual-classroom__features article {
  display: grid;
  grid-template-columns: auto minmax(0,1fr);
  gap: 12px;
  min-height: 88px;
  padding: 14px;
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 13px;
  background: rgba(255,255,255,.05);
}

.virtual-classroom__features article > span {
  color: #e2b72f;
  font-size: .5rem;
  font-weight: 900;
}

.virtual-classroom__features strong {
  color: #fff;
  font-size: .75rem;
}

.virtual-classroom__features p {
  margin: 5px 0 0;
  color: rgba(255,255,255,.56);
  font-size: .6rem;
  line-height: 1.5;
}

.virtual-classroom__actions {
  display: flex;
  gap: 9px;
  flex-wrap: wrap;
  margin-top: 24px;
}

.button {
  display: inline-flex;
  min-height: 48px;
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
  border: 1px solid rgba(255,255,255,.18);
  color: #fff;
  background: rgba(255,255,255,.06);
}

.virtual-classroom__visual {
  min-width: 0;
}

.portal {
  overflow: hidden;
  border: 1px solid rgba(255,255,255,.16);
  border-radius: 22px;
  background: #f5f7fa;
  box-shadow: 0 32px 70px rgba(0,0,0,.28);
  transform: perspective(1100px) rotateY(-4deg) rotateX(1deg);
}

.portal__bar {
  display: flex;
  min-height: 44px;
  align-items: center;
  justify-content: space-between;
  padding: 0 14px;
  border-bottom: 1px solid #dde4ec;
  background: #fff;
}

.portal__bar > div {
  display: flex;
  gap: 5px;
}

.portal__bar > div span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d8dfe7;
}

.portal__bar small {
  color: #7b8797;
  font-size: .42rem;
  font-weight: 900;
}

.portal__body {
  display: grid;
  grid-template-columns: 145px minmax(0,1fr);
  min-height: 410px;
}

.portal__side {
  display: grid;
  align-content: start;
  gap: 7px;
  padding: 16px 12px;
  color: #aab6c6;
  background: #142138;
}

.portal__brand {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  margin-bottom: 10px;
  border-radius: 12px;
  color: #fff;
  background: #9f1945;
  font-size: .7rem;
  font-weight: 900;
}

.portal__side > span {
  padding: 9px 10px;
  border-radius: 8px;
  font-size: .5rem;
  font-weight: 800;
}

.portal__side .is-active {
  color: #fff;
  background: rgba(159,25,69,.28);
}

.portal__content {
  padding: 22px;
  color: #152033;
}

.portal__hero {
  display: grid;
  gap: 6px;
  padding: 20px;
  border-radius: 15px;
  color: #fff;
  background: linear-gradient(135deg,#142138,#23324c);
}

.portal__hero small {
  color: #e7bc3b;
  font-size: .42rem;
  font-weight: 900;
}

.portal__hero strong {
  font-size: 1.2rem;
}

.portal__hero span {
  color: rgba(255,255,255,.65);
  font-size: .55rem;
}

.portal__cards {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 8px;
  margin-top: 12px;
}

.portal__cards article {
  display: grid;
  min-height: 82px;
  align-content: center;
  padding: 12px;
  border: 1px solid #dce4ed;
  border-radius: 11px;
  background: #fff;
}

.portal__cards strong {
  color: #9f1945;
  font-size: 1.05rem;
}

.portal__cards span {
  margin-top: 4px;
  color: #6f7c8f;
  font-size: .5rem;
}

.portal__progress {
  margin-top: 12px;
  padding: 14px;
  border: 1px solid #dce4ed;
  border-radius: 11px;
  background: #fff;
}

.portal__progress > div {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  color: #67768a;
  font-size: .5rem;
}

.portal__progress > div strong {
  color: #916b00;
}

.portal__progress i {
  display: block;
  height: 7px;
  margin-top: 9px;
  overflow: hidden;
  border-radius: 999px;
  background: #edf1f5;
}

.portal__progress b {
  display: block;
  width: 67%;
  height: 100%;
  border-radius: inherit;
  background: #9f1945;
}

@media (min-width: 930px) {
  .virtual-classroom__layout {
    grid-template-columns: minmax(0,.9fr) minmax(0,1.1fr);
  }
}

@media (max-width: 700px) {
  .virtual-classroom {
    padding: 78px 16px;
  }

  .portal {
    transform: none;
  }

  .portal__body {
    grid-template-columns: 95px minmax(0,1fr);
    min-height: 340px;
  }

  .portal__content {
    padding: 14px;
  }

  .portal__cards {
    grid-template-columns: 1fr;
  }

  .portal__cards article {
    min-height: 60px;
  }

  .virtual-classroom__actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
</style>
