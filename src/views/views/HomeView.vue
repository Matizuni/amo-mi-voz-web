<template>
  <main
    id="contenido-principal"
    class="home amv-view-shell"
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


/* =========================================================
   AMV UI SYSTEM · PUBLIC EXPERIENCE v1.0
   Consistencia, accesibilidad y movimiento fluido
========================================================= */
.home {
  --amv-ink: #172033;
  --amv-body: #344359;
  --amv-muted: #667085;
  --amv-wine: #9f1945;
  --amv-wine-dark: #7f1237;
  --amv-gold: #d9a91d;
  --amv-line: #dbe3ec;
  --amv-canvas: #f5f7fb;
  --amv-card: #ffffff;
  --amv-shadow: 0 18px 48px rgba(23, 32, 51, .09);
  --amv-radius: 20px;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
}

.home :where(a, button, input, textarea, select) {
  transition: color .22s ease, background-color .22s ease, border-color .22s ease, box-shadow .22s ease, transform .22s ease, opacity .22s ease;
}

.home :where(a, button, input, textarea, select):focus-visible {
  outline: 3px solid rgba(159, 25, 69, .22) !important;
  outline-offset: 3px;
}

.home :where(button, [role="button"], .button, .btn):not(:disabled):active {
  transform: translateY(1px) scale(.99);
}

.home :where(img) {
  transition: transform .45s cubic-bezier(.2,.75,.25,1), filter .35s ease;
}

.home :where(article, .card, [class*="__card"]):hover {
  transition: transform .28s cubic-bezier(.2,.75,.25,1), box-shadow .28s ease, border-color .28s ease;
}

.home :where(input, textarea, select) {
  font-size: max(16px, 1em);
}

@media (prefers-reduced-motion: reduce) {
  .home *, .home *::before, .home *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}


/* =========================================================
   AMV LMS · FLUID MOTION & PREMIUM INTERACTION v2.0
   Capa visual segura: no modifica lógica, datos ni estructura.
========================================================= */
.home {
  animation: amvViewEnter .46s cubic-bezier(.2,.75,.25,1) both;
}

.home :where(
  article,
  [class$="__card"],
  [class*="-card"],
  [class*="_card"]
) {
  transition:
    transform .24s cubic-bezier(.2,.75,.25,1),
    box-shadow .24s ease,
    border-color .24s ease,
    background-color .24s ease;
}

@media (hover: hover) and (pointer: fine) {
  .home :where(
    article,
    [class$="__card"],
    [class*="-card"],
    [class*="_card"]
  ):hover {
    transform: translateY(-2px);
  }

  .home :where(
    button,
    .button,
    .btn,
    a[class*="button"],
    a[class*="cta"]
  ):not(:disabled):hover {
    transform: translateY(-2px);
    filter: saturate(1.04);
  }

  .home :where(img) {
    transition: transform .55s cubic-bezier(.2,.75,.25,1), filter .35s ease;
  }

  .home :where(
    [class*="cover"],
    [class*="hero"],
    [class*="visual"],
    [class*="gallery"]
  ):hover img {
    transform: scale(1.018);
  }
}

.home :where(
  button,
  .button,
  .btn,
  a[class*="button"],
  a[class*="cta"]
) {
  will-change: transform;
}

.home :where(input, textarea, select):focus {
  transform: translateY(-1px);
}

.home :where(
  [class*="progress"] > *,
  [class*="bar"] > *,
  progress
) {
  transition: width .55s cubic-bezier(.2,.75,.25,1), transform .35s ease;
}

.home ::selection {
  color: #ffffff;
  background: #9f1945;
}

@keyframes amvViewEnter {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .home,
  .home *,
  .home *::before,
  .home *::after {
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
    scroll-behavior: auto !important;
  }
}

</style>


<style lang="scss">
/* AMV UI POLISH 2026 — visual consistency, accessibility and mobile resilience. */
.amv-view-shell {
  --amv-ui-wine: #9f1945;
  --amv-ui-wine-deep: #7f1237;
  --amv-ui-gold: #d9a91d;
  --amv-ui-purple: #7657d9;
  --amv-ui-cyan: #20b8ae;
  --amv-ui-ink: #172033;
  --amv-ui-muted: #6f7c8f;
  --amv-ui-line: rgba(122, 137, 158, 0.20);
  --amv-ui-focus: rgba(159, 25, 69, 0.38);
  --amv-ui-radius-sm: 12px;
  --amv-ui-radius-md: 18px;
  --amv-ui-radius-lg: 26px;
  --amv-ui-shadow: 0 18px 55px rgba(17, 25, 39, 0.09);
  --amv-ui-shadow-hover: 0 22px 65px rgba(17, 25, 39, 0.14);
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  isolation: isolate;
  overflow-x: clip;
  -webkit-tap-highlight-color: transparent;
}

.amv-view-shell::before {
  content: '';
  position: absolute;
  inset: -150px -120px auto auto;
  width: 420px;
  height: 420px;
  pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(159, 25, 69, 0.10), transparent 52%),
    radial-gradient(circle at 68% 62%, rgba(217, 169, 29, 0.08), transparent 58%);
  filter: blur(6px);
  opacity: 0.82;
  z-index: -1;
}

.amv-view-shell :where(*, *::before, *::after) {
  box-sizing: border-box;
}

.amv-view-shell :where(img, video, svg, canvas) {
  max-width: 100%;
}

.amv-view-shell :where(h1, h2, h3, h4, h5, h6) {
  text-wrap: balance;
}

.amv-view-shell :where(p, li, td, th, label, small) {
  overflow-wrap: anywhere;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']) {
  touch-action: manipulation;
}

.amv-view-shell :where(button, input, select, textarea) {
  font: inherit;
}

.amv-view-shell :where(button) {
  min-height: 42px;
}

.amv-view-shell :where(input, select, textarea) {
  max-width: 100%;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']):focus-visible {
  outline: 3px solid var(--amv-ui-focus);
  outline-offset: 3px;
}

.amv-view-shell :where(button, [role='button']):disabled,
.amv-view-shell :where(input, select, textarea):disabled {
  cursor: not-allowed;
}

.amv-view-shell :where(.button, .btn, .lux-button, .amv-primary-btn, .amv-secondary-action,
  .primary-action, .secondary-action, .danger-action, .text-link, .action-link,
  .lightbox__close, .lightbox__nav, .today-button, .quick-action) {
  -webkit-user-select: none;
  user-select: none;
}

/* Premium surface language without changing each view's semantic palette. */
.amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
  .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
  .resource-card, .student-card, .lesson-card, .task-card, .format-card,
  .production, .sound-console, .state-card, .empty-card, .workspace,
  .profile-card, .profile-panel, .vocal-card, .weighted-student, .weighted-category) {
  border-radius: var(--amv-ui-radius-md);
}

.amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
  .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
  .task-card, .format-card, .production, .state-card, .empty-card) {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
    .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
    .task-card, .format-card, .production):not(.is-disabled):hover {
    transform: translateY(-2px);
  }
}

/* Toolbars wrap rather than squeezing controls into unreadable rows. */
.amv-view-shell :where(.toolbar, .students-toolbar, .calendar-toolbar, .resources-controls,
  .resources-controls__row, .gradebook-legacy-toolbar, .hero-actions, .actions,
  .action-row, .question-actions, .filters, .public-jump-nav, .classes-header__actions,
  .result-action-row, .form-actions, .footer-actions) {
  min-width: 0;
}

.amv-view-shell :where(.table-shell, .quiz-table-wrap, .table-wrap, .grade-table-wrap,
  .data-table-wrap, .scroll-region, .horizontal-scroll) {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.amv-view-shell :where(.table-shell table, .quiz-table-wrap table, .table-wrap table,
  .grade-table-wrap table, .data-table-wrap table) {
  max-width: none;
}

/* Prevent long controls and badges from forcing page-level horizontal overflow. */
.amv-view-shell :where(.badge, .pill, .chip, .status-pill, .source-badge, .event-chip,
  .lesson-detail, .student-card__voice, .student-card__status, .course-kicker,
  .hero-stat, .count, .filename, .meta, .eyebrow) {
  max-width: 100%;
}

/* Dialogs/lightboxes stay usable on short laptop and phone viewports. */
.amv-view-shell :where(.modal, .dialog, .drawer, .lightbox, .lightbox__content,
  .modal__content, .dialog__content, [role='dialog']) {
  max-width: min(100%, 100vw);
}

.amv-view-shell :where(.modal__content, .dialog__content, .lightbox__content,
  [role='dialog']) {
  max-height: calc(100dvh - 28px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Public pages: a cleaner editorial frame around content-heavy sections. */
.amv-view-shell :where(.hero, .hero-panel, .calendar-hero, .resources-hero, .amv-hero,
  .students__header, .gradebook__hero, .classes-header, .contact-hero, .training-hero,
  .academy-hero, .inscription-hero) {
  isolation: isolate;
}

.amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid) {
  min-width: 0;
}

/* Mobile-first resilience. Existing view-specific breakpoints still win where more
   specific rules exist, while these defaults catch edge cases and tiny screens. */
@media (max-width: 760px) {
  .amv-view-shell {
    overflow-x: clip;
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 22px;
  }

  .amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid,
    .calendar-layout, .quiz-layout, .program-layout, .student-profile__grid,
    .dashboard-grid, .content-grid, .page-grid, .split-layout) {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .amv-view-shell :where(.hero-actions, .actions, .action-row, .form-actions,
    .footer-actions, .question-actions, .students__header-actions, .hero-stat,
    .calendar-toolbar, .resources-controls__row) {
    flex-wrap: wrap;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    min-width: min(100%, 190px);
  }

  .amv-view-shell :where(.display-title, .page-title, .hero-title, .section-title,
    .hero-panel__title, .amv-hero h1, .calendar-hero h1, .students__header h1,
    .gradebook__hero h1) {
    font-size: clamp(1.8rem, 7vw, 3rem);
    line-height: 1.05;
  }

  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .amv-view-shell :where(.students-toolbar, .resources-controls, .calendar-toolbar,
    .gradebook-legacy-toolbar, .classes-header, .section-heading, .profile-actions) {
    gap: 10px;
  }

  .amv-view-shell :where(input, select, textarea, .select, .search-input) {
    min-height: 44px;
  }
}

@media (max-width: 520px) {
  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: minmax(0, 1fr);
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 18px;
  }

  .amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
    .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
    .resource-card, .student-card, .lesson-card, .task-card, .format-card,
    .production, .state-card, .empty-card) {
    border-radius: 16px;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    width: 100%;
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .amv-view-shell,
  .amv-view-shell :where(*, *::before, *::after) {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
