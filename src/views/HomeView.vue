<template>
  <main
    id="contenido-principal"
    class="home"
  >
    <a
      class="skip-link"
      href="#inicio-home"
    >
      Ir al contenido principal
    </a>

    <HeroSection />

    <section
      id="inicio-home"
      class="home-proof"
      aria-label="Pilares de Amo Mi Voz"
    >
      <div class="home-proof__inner">
        <article>
          <span>01</span>
          <div><small>FORMACIÓN</small><strong>Voz · Música · Escenario</strong></div>
        </article>

        <article>
          <span>02</span>
          <div><small>EXPERIENCIA</small><strong>Aprender haciendo</strong></div>
        </article>

        <article>
          <span>03</span>
          <div><small>TECNOLOGÍA</small><strong>Aula Virtual propia</strong></div>
        </article>

        <article>
          <span>04</span>
          <div><small>COMUNIDAD</small><strong>La Calera · Chile</strong></div>
        </article>
      </div>
    </section>

    <AboutSection />
    <WorkshopsSection />
    <VirtualClassroomSection />
    <BenefitsSection />
    <ExperiencesSection />
    <MusicalsSection />
    <QuoteSection />
    <FinalCtaSection />

    <nav
      class="home-mobile-actions"
      aria-label="Accesos rápidos"
    >
      <RouterLink to="/inscripcion">
        Inscribirme
      </RouterLink>

      <RouterLink to="/aula">
        Aula Virtual
      </RouterLink>
    </nav>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import WorkshopsSection from '@/components/home/WorkshopsSection.vue'
import VirtualClassroomSection from '@/components/home/VirtualClassroomSection.vue'
import BenefitsSection from '@/components/home/BenefitsSection.vue'
import ExperiencesSection from '@/components/home/ExperiencesSection.vue'
import MusicalsSection from '@/components/home/MusicalsSection.vue'
import QuoteSection from '@/components/home/QuoteSection.vue'
import FinalCtaSection from '@/components/home/FinalCtaSection.vue'
</script>

<style scoped>
.home {
  min-height: 100vh;
  overflow: clip;
  color: #152033;
  background: #f5f7fa;
}

.skip-link {
  position: fixed;
  z-index: 9999;
  top: 10px;
  left: 10px;
  padding: 10px 14px;
  border-radius: 8px;
  color: #fff;
  background: #9f1945;
  font-size: .78rem;
  font-weight: 900;
  text-decoration: none;
  transform: translateY(-150%);
}

.skip-link:focus {
  transform: translateY(0);
}

.home-proof {
  position: relative;
  z-index: 7;
  padding: 0 24px;
  background: #fff;
  scroll-margin-top: 90px;
}

.home-proof__inner {
  display: grid;
  width: min(1180px,100%);
  margin: -28px auto 0;
  overflow: hidden;
  border: 1px solid #dce4ed;
  border-radius: 18px;
  background: rgba(255,255,255,.97);
  box-shadow: 0 18px 45px rgba(31,48,73,.08);
  backdrop-filter: blur(14px);
}

.home-proof article {
  display: flex;
  min-height: 94px;
  gap: 14px;
  align-items: center;
  padding: 18px 20px;
  border-bottom: 1px solid #edf1f5;
}

.home-proof article > span {
  color: #916b00;
  font-size: .62rem;
  font-weight: 900;
}

.home-proof small,
.home-proof strong {
  display: block;
}

.home-proof small {
  color: #8a96a8;
  font-size: .55rem;
  font-weight: 900;
  letter-spacing: .12em;
}

.home-proof strong {
  margin-top: 5px;
  color: #152033;
  font-size: .78rem;
}

.home-mobile-actions {
  display: none;
}

.home :deep(:focus-visible) {
  outline: 3px solid rgba(159,25,69,.3);
  outline-offset: 4px;
}

@media (min-width: 720px) {
  .home-proof__inner {
    grid-template-columns: repeat(2,1fr);
  }

  .home-proof article {
    border-right: 1px solid #edf1f5;
  }

  .home-proof article:nth-child(2n) {
    border-right: 0;
  }
}

@media (min-width: 1024px) {
  .home-proof__inner {
    grid-template-columns: repeat(4,1fr);
  }

  .home-proof article {
    border-bottom: 0;
  }

  .home-proof article:nth-child(2n) {
    border-right: 1px solid #edf1f5;
  }

  .home-proof article:last-child {
    border-right: 0;
  }
}

@media (max-width: 700px) {
  .home-proof {
    padding: 0 14px;
  }

  .home-proof__inner {
    margin-top: -14px;
    border-radius: 15px;
  }

  .home-proof article {
    min-height: 80px;
    padding: 14px 16px;
  }

  .home-mobile-actions {
    position: fixed;
    z-index: 80;
    right: 12px;
    bottom: calc(12px + env(safe-area-inset-bottom));
    left: 12px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    padding: 7px;
    border: 1px solid rgba(255,255,255,.65);
    border-radius: 14px;
    background: rgba(255,255,255,.94);
    box-shadow: 0 16px 35px rgba(31,48,73,.16);
    backdrop-filter: blur(14px);
  }

  .home-mobile-actions a {
    display: flex;
    min-height: 46px;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    color: #344359;
    font-size: .67rem;
    font-weight: 900;
    text-decoration: none;
  }

  .home-mobile-actions a:first-child {
    color: #fff;
    background: #9f1945;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home *,
  .home *::before,
  .home *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
</style>
