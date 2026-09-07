<template>
  <section class="final-cta">
    <div class="final-cta__background" aria-hidden="true">
      <span></span>
      <span></span>
    </div>

    <div class="container final-cta__layout">
      <div class="final-cta__content">
        <span class="eyebrow">ACADEMIA DE TALENTOS AMO MI VOZ</span>

        <h2>
          Tu voz tiene algo que decir.
          <strong>Hazla crecer.</strong>
        </h2>

        <p>
          Formación musical, experiencias escénicas y una comunidad
          donde cada estudiante puede desarrollar su propia voz.
        </p>

        <div class="final-cta__actions">
          <RouterLink to="/inscripcion" class="button button--primary">
            Quiero comenzar
            <span>→</span>
          </RouterLink>

          <RouterLink to="/contacto" class="button button--secondary">
            Resolver una duda
          </RouterLink>

          <RouterLink to="/aula" class="button button--ghost">
            Ya soy estudiante · Aula Virtual
          </RouterLink>
        </div>
      </div>

      <aside class="final-cta__panel">
        <small>¿QUÉ QUIERES HACER?</small>

        <RouterLink to="/formacion">
          <span>01</span>
          <div>
            <strong>Conocer la formación</strong>
            <small>Programa, metodología y áreas</small>
          </div>
          <b>→</b>
        </RouterLink>

        <RouterLink to="/inscripcion">
          <span>02</span>
          <div>
            <strong>Inscribirme</strong>
            <small>Comenzar mi proceso</small>
          </div>
          <b>→</b>
        </RouterLink>

        <RouterLink to="/aula">
          <span>03</span>
          <div>
            <strong>Entrar al Aula Virtual</strong>
            <small>Acceso estudiantes y profesores</small>
          </div>
          <b>→</b>
        </RouterLink>
      </aside>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
.final-cta {
  position: relative;
  overflow: hidden;
  padding: 105px 24px;
  color: #fff;
  background: #101a2d;
}

.container {
  position: relative;
  z-index: 2;
  width: min(1180px,100%);
  margin-inline: auto;
}

.final-cta__background {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.final-cta__background span {
  position: absolute;
  border-radius: 50%;
  filter: blur(130px);
}

.final-cta__background span:first-child {
  top: -160px;
  right: -120px;
  width: 480px;
  height: 480px;
  background: rgba(159,25,69,.2);
}

.final-cta__background span:last-child {
  bottom: -220px;
  left: -180px;
  width: 520px;
  height: 520px;
  background: rgba(213,167,32,.08);
}

.final-cta__layout {
  display: grid;
  gap: 36px;
  align-items: center;
}

.eyebrow {
  color: #e2b62f;
  font-size: .56rem;
  font-weight: 900;
  letter-spacing: .15em;
}

.final-cta h2 {
  max-width: 760px;
  margin: 13px 0 0;
  font-size: clamp(3rem,5vw,5rem);
  line-height: .95;
  letter-spacing: -.06em;
}

.final-cta h2 strong {
  display: block;
  color: #f0c748;
}

.final-cta__content > p {
  max-width: 620px;
  margin: 20px 0 0;
  color: rgba(255,255,255,.68);
  font-size: .88rem;
  line-height: 1.7;
}

.final-cta__actions {
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

.button--ghost {
  color: #f0c748;
  background: transparent;
}

.final-cta__panel {
  padding: 18px;
  border: 1px solid rgba(255,255,255,.12);
  border-radius: 18px;
  background: rgba(255,255,255,.055);
  backdrop-filter: blur(12px);
}

.final-cta__panel > small {
  color: #e2b62f;
  font-size: .45rem;
  font-weight: 900;
  letter-spacing: .11em;
}

.final-cta__panel > a {
  display: grid;
  grid-template-columns: auto minmax(0,1fr) auto;
  gap: 12px;
  align-items: center;
  min-height: 80px;
  margin-top: 9px;
  padding: 13px;
  border: 1px solid rgba(255,255,255,.09);
  border-radius: 12px;
  color: #fff;
  background: rgba(255,255,255,.035);
  text-decoration: none;
}

.final-cta__panel > a > span {
  color: #e2b62f;
  font-size: .46rem;
  font-weight: 900;
}

.final-cta__panel strong,
.final-cta__panel small {
  display: block;
}

.final-cta__panel strong {
  font-size: .7rem;
}

.final-cta__panel a small {
  margin-top: 4px;
  color: rgba(255,255,255,.48);
  font-size: .52rem;
}

.final-cta__panel b {
  color: #e2b62f;
}

@media (min-width: 900px) {
  .final-cta__layout {
    grid-template-columns: minmax(0,1.15fr) minmax(340px,.85fr);
  }
}

@media (max-width: 700px) {
  .final-cta {
    padding: 78px 16px;
  }

  .final-cta__actions {
    flex-direction: column;
  }

  .button {
    width: 100%;
  }
}
</style>
