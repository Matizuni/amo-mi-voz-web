<template>
  <section class="grading-settings amv-view-shell">
    <header class="grading-hero">
      <div>
        <p class="eyebrow">CONFIGURACIÓN ACADÉMICA · AMO MI VOZ</p>
        <h1>Sistema de evaluación</h1>
        <p class="hero-copy">
          Define cómo se interpretan las notas y cuánto pesa cada categoría.
          Los resultados originales se conservan: aquí solo configuramos su lectura académica.
        </p>
      </div>
      <aside class="hero-status">
        <span>ESTADO</span>
        <strong>{{ totalWeight }}%</strong>
        <small>{{ weightStatus }}</small>
      </aside>
    </header>

    <div v-if="isLoading" class="state-card">Cargando configuración académica…</div>
    <div v-else-if="loadError" class="state-card state-card--error">
      <strong>No pudimos cargar la configuración</strong>
      <p>{{ loadError }}</p>
      <button type="button" @click="load">Reintentar</button>
    </div>

    <template v-else>
      <section class="settings-grid">
        <article class="panel">
          <header class="panel__header">
            <div><span>01 · ESCALA</span><h2>Escala de calificación</h2></div>
          </header>

          <div class="field-grid">
            <label class="field field--wide">
              <span>Sistema</span>
              <select v-model="form.gradingScale">
                <option value="chilean_1_7">Chile · 1,0 a 7,0</option>
              </select>
            </label>
            <label class="field"><span>Nota mínima</span><input v-model.number="form.minimumGrade" type="number" step="0.1" min="1" max="7" /></label>
            <label class="field"><span>Nota máxima</span><input v-model.number="form.maximumGrade" type="number" step="0.1" min="1" max="7" /></label>
            <label class="field"><span>Nota de aprobación</span><input v-model.number="form.passingGrade" type="number" step="0.1" min="1" max="7" /></label>
            <label class="field"><span>Exigencia</span><div class="input-suffix"><input v-model.number="form.exigencyPercentage" type="number" min="1" max="99" /><b>%</b></div></label>
          </div>

          <div class="scale-preview">
            <span>Ejemplo</span>
            <strong>60% → {{ previewGrade }}</strong>
            <small>La conversión usa la exigencia y nota de aprobación configuradas.</small>
          </div>
        </article>

        <article class="panel">
          <header class="panel__header panel__header--split">
            <div><span>02 · PONDERACIÓN</span><h2>Categorías académicas</h2></div>
            <label class="switch"><input v-model="form.useWeights" type="checkbox" /><span></span><b>Usar ponderaciones</b></label>
          </header>

          <div class="categories">
            <article v-for="(category, index) in categories" :key="category.localKey" class="category-row" :class="{ 'category-row--disabled': !category.enabled }">
              <button class="drag" type="button" aria-label="Orden de categoría">⋮⋮</button>
              <label class="category-name"><span>Categoría</span><input v-model.trim="category.name" type="text" /></label>
              <label class="category-weight"><span>Peso</span><div class="input-suffix"><input v-model.number="category.weight" type="number" min="0" max="100" :disabled="!category.enabled || !form.useWeights" /><b>%</b></div></label>
              <label class="category-enabled"><input v-model="category.enabled" type="checkbox" /><span>{{ category.enabled ? 'Activa' : 'Inactiva' }}</span></label>
              <button class="remove" type="button" :disabled="categories.length <= 1" @click="removeCategory(index)">×</button>
            </article>
          </div>

          <button class="add-category" type="button" @click="addCategory">+ Agregar categoría</button>

          <div class="weight-summary" :class="{ 'weight-summary--ok': isWeightValid, 'weight-summary--error': form.useWeights && !isWeightValid }">
            <div><span>TOTAL PONDERADO</span><strong>{{ totalWeight }}%</strong></div>
            <p v-if="!form.useWeights">Las categorías se conservarán, pero no se calculará una nota ponderada.</p>
            <p v-else-if="isWeightValid">Configuración lista. Las categorías activas suman 100%.</p>
            <p v-else>Faltan {{ Math.abs(100 - totalWeight) }} puntos porcentuales para completar el 100%.</p>
          </div>
        </article>
      </section>

      <div v-if="validationError" class="validation">{{ validationError }}</div>

      <footer class="actions">
        <p>Esta configuración no modifica las notas ni los intentos que ya existen.</p>
        <button class="save" type="button" :disabled="isSaving || !canSave" @click="save">
          {{ isSaving ? 'Guardando…' : 'Guardar configuración' }}
        </button>
      </footer>
    </template>

    <Transition name="toast"><div v-if="toast" class="toast"><strong>✓ Configuración guardada</strong><span>{{ toast }}</span></div></Transition>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { fetchGradingConfiguration, saveGradingConfiguration, percentageToChileanGrade } from '@/services/gradingService'

const { isTeacher } = useAuth()
const isLoading = ref(true)
const isSaving = ref(false)
const loadError = ref('')
const validationError = ref('')
const toast = ref('')
const form = ref({ gradingScale: 'chilean_1_7', minimumGrade: 1, maximumGrade: 7, passingGrade: 4, exigencyPercentage: 60, decimals: 1, useWeights: true })
const categories = ref([])
let localCounter = 0

const totalWeight = computed(() => Number(categories.value.filter(c => c.enabled).reduce((sum, c) => sum + Number(c.weight || 0), 0).toFixed(2)))
const isWeightValid = computed(() => !form.value.useWeights || Math.abs(totalWeight.value - 100) < 0.001)
const weightStatus = computed(() => !form.value.useWeights ? 'Ponderación desactivada' : isWeightValid.value ? 'Distribución completa' : 'Requiere ajuste')
const canSave = computed(() => isTeacher.value && isWeightValid.value && categories.value.length > 0 && categories.value.every(c => c.name.trim()))
const previewGrade = computed(() => percentageToChileanGrade(60, form.value).toFixed(form.value.decimals ?? 1))

function hydrateCategory(item, index) {
  return { ...item, localKey: item.id ? `db-${item.id}` : `local-${Date.now()}-${++localCounter}`, key: item.key || `category_${index + 1}` }
}

async function load() {
  isLoading.value = true; loadError.value = ''
  try {
    const data = await fetchGradingConfiguration()
    form.value = { ...form.value, ...data.settings }
    categories.value = data.categories.map(hydrateCategory)
  } catch (error) {
    console.error('Error cargando ponderaciones:', error)
    loadError.value = error?.message || 'No fue posible cargar el sistema de evaluación.'
  } finally { isLoading.value = false }
}

function addCategory() {
  categories.value.push(hydrateCategory({ key: `custom_${Date.now()}`, name: 'Nueva categoría', weight: 0, enabled: true }, categories.value.length))
}
function removeCategory(index) { if (categories.value.length > 1) categories.value.splice(index, 1) }

async function save() {
  validationError.value = ''; toast.value = ''
  if (!isTeacher.value) { validationError.value = 'Solo el profesor puede modificar esta configuración.'; return }
  if (!canSave.value) { validationError.value = 'Revisa las categorías y asegúrate de completar el 100%.'; return }
  isSaving.value = true
  try {
    const result = await saveGradingConfiguration({ settings: form.value, categories: categories.value })
    form.value = { ...form.value, ...result.settings }
    categories.value = result.categories.map(hydrateCategory)
    toast.value = 'El libro de notas ya puede utilizar esta estructura.'
    window.setTimeout(() => { toast.value = '' }, 3200)
  } catch (error) {
    console.error('Error guardando ponderaciones:', error)
    validationError.value = error?.message || 'No fue posible guardar la configuración.'
  } finally { isSaving.value = false }
}

onMounted(load)
</script>

<style scoped>
.grading-settings{--ink:#172033;--body:#344359;--muted:#667085;--border:#dbe3ec;--wine:#9f1945;--wine2:#7f1237;--gold:#d9a91d;max-width:1500px;margin:0 auto;padding:28px;color:var(--body);animation:viewIn .45s cubic-bezier(.2,.75,.25,1) both}.grading-hero{display:grid;grid-template-columns:1fr auto;gap:32px;padding:34px;border-radius:28px;background:linear-gradient(135deg,#152033,#24334a);box-shadow:0 24px 60px rgba(23,32,51,.15);color:#fff}.eyebrow{margin:0 0 8px;color:#f1c84c;font-size:.78rem;font-weight:900;letter-spacing:.11em}.grading-hero h1{margin:0;color:#fff!important;font-size:clamp(2rem,4vw,3.6rem);line-height:1}.hero-copy{max-width:760px;margin:16px 0 0;color:rgba(255,255,255,.86);font-size:1.02rem;line-height:1.7}.hero-status{min-width:190px;display:grid;align-content:center;padding:20px 24px;border:1px solid rgba(255,255,255,.16);border-radius:22px;background:rgba(255,255,255,.08);backdrop-filter:blur(10px)}.hero-status span,.hero-status small{color:rgba(255,255,255,.75)}.hero-status strong{margin:5px 0;color:#fff!important;font-size:2.2rem}.settings-grid{display:grid;grid-template-columns:minmax(0,.8fr) minmax(0,1.2fr);gap:20px;margin-top:22px}.panel{padding:24px;border:1px solid var(--border);border-radius:24px;background:#fff;box-shadow:0 12px 36px rgba(23,32,51,.06)}.panel__header{margin-bottom:20px}.panel__header--split{display:flex;justify-content:space-between;gap:20px;align-items:center}.panel__header span{color:var(--wine);font-size:.75rem;font-weight:900;letter-spacing:.08em}.panel__header h2{margin:4px 0 0;color:var(--ink)!important}.field-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.field--wide{grid-column:1/-1}.field{display:grid;gap:7px}.field>span,.category-row label>span{color:var(--muted);font-size:.78rem;font-weight:800}.field input,.field select,.category-row input{width:100%;min-height:48px;box-sizing:border-box;border:1px solid var(--border);border-radius:13px;background:#fff;color:var(--ink);padding:0 13px;font:inherit;outline:none;transition:.2s}.field input:focus,.field select:focus,.category-row input:focus{border-color:rgba(159,25,69,.55);box-shadow:0 0 0 4px rgba(159,25,69,.08)}.input-suffix{display:flex;align-items:center;border:1px solid var(--border);border-radius:13px;overflow:hidden}.input-suffix input{border:0!important;border-radius:0!important;box-shadow:none!important}.input-suffix b{padding:0 13px;color:var(--wine)}.scale-preview{display:grid;gap:5px;margin-top:18px;padding:18px;border-radius:18px;background:#fff8e7;border:1px solid #f1dfab}.scale-preview span{color:#80620a;font-size:.75rem;font-weight:900}.scale-preview strong{color:var(--ink)!important;font-size:1.45rem}.scale-preview small{color:var(--muted)}.switch{display:flex;align-items:center;gap:9px;cursor:pointer}.switch input{position:absolute;opacity:0}.switch>span{width:42px;height:24px;border-radius:99px;background:#ccd4df;position:relative;transition:.2s}.switch>span:after{content:"";position:absolute;width:18px;height:18px;left:3px;top:3px;border-radius:50%;background:#fff;transition:.2s}.switch input:checked+span{background:var(--wine)}.switch input:checked+span:after{transform:translateX(18px)}.switch b{color:var(--ink);font-size:.84rem}.categories{display:grid;gap:10px}.category-row{display:grid;grid-template-columns:30px minmax(150px,1fr) 105px 82px 34px;gap:10px;align-items:end;padding:12px;border:1px solid var(--border);border-radius:16px;transition:.22s}.category-row:hover{transform:translateY(-1px);box-shadow:0 8px 22px rgba(23,32,51,.06)}.category-row--disabled{opacity:.58;background:#f7f8fa}.category-name,.category-weight{display:grid;gap:5px}.drag,.remove{height:46px;border:0;background:transparent;color:var(--muted);font-size:1.1rem}.remove{color:var(--wine);font-size:1.5rem;cursor:pointer}.category-enabled{height:46px;display:flex;align-items:center;gap:6px;font-size:.78rem}.add-category{margin-top:12px;border:1px dashed rgba(159,25,69,.35);border-radius:13px;background:#fff8fa;color:var(--wine);padding:11px 15px;font-weight:900;cursor:pointer}.weight-summary{margin-top:16px;padding:17px;border-radius:18px;background:#f5f7fb;border:1px solid var(--border)}.weight-summary>div{display:flex;justify-content:space-between;align-items:center}.weight-summary span{font-size:.76rem;font-weight:900;color:var(--muted)}.weight-summary strong{font-size:1.7rem;color:var(--ink)!important}.weight-summary p{margin:5px 0 0;color:var(--muted)}.weight-summary--ok{background:#eef8f3;border-color:#cce9dc}.weight-summary--error{background:#fff4f6;border-color:#f0ccd6}.validation{margin-top:16px;padding:14px 16px;border:1px solid #f0ccd6;border-radius:14px;background:#fff4f6;color:#9f1945;font-weight:800}.actions{position:sticky;bottom:14px;z-index:4;display:flex;justify-content:space-between;align-items:center;gap:20px;margin-top:20px;padding:14px 16px 14px 20px;border:1px solid var(--border);border-radius:18px;background:rgba(255,255,255,.92);box-shadow:0 14px 40px rgba(23,32,51,.11);backdrop-filter:blur(12px)}.actions p{margin:0;color:var(--muted);font-size:.86rem}.save{min-height:48px;border:0;border-radius:13px;background:var(--wine);color:#fff;padding:0 20px;font-weight:900;cursor:pointer;transition:.2s}.save:hover:not(:disabled){transform:translateY(-2px);background:var(--wine2)}.save:disabled{opacity:.5;cursor:not-allowed}.state-card{margin-top:20px;padding:28px;border:1px solid var(--border);border-radius:22px;background:#fff}.state-card--error{color:#9f1945}.toast{position:fixed;right:24px;bottom:24px;z-index:30;display:grid;gap:3px;max-width:360px;padding:16px 18px;border-radius:16px;background:#172033;color:#fff;box-shadow:0 20px 50px rgba(23,32,51,.22)}.toast strong{color:#fff!important}.toast span{color:rgba(255,255,255,.8)}.toast-enter-active,.toast-leave-active{transition:.25s}.toast-enter-from,.toast-leave-to{opacity:0;transform:translateY(10px)}@keyframes viewIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}@media(max-width:1000px){.settings-grid{grid-template-columns:1fr}.grading-hero{grid-template-columns:1fr}.hero-status{min-width:0}.category-row{grid-template-columns:24px 1fr 100px}.category-enabled{grid-column:2}.remove{grid-column:3;grid-row:2}}@media(max-width:620px){.grading-settings{padding:14px}.grading-hero{padding:24px}.field-grid{grid-template-columns:1fr}.field--wide{grid-column:auto}.panel{padding:17px}.panel__header--split{align-items:flex-start;flex-direction:column}.category-row{grid-template-columns:1fr}.drag{display:none}.category-enabled,.remove{grid-column:auto;grid-row:auto}.actions{position:static;align-items:stretch;flex-direction:column}.save{width:100%}}@media(prefers-reduced-motion:reduce){.grading-settings,.grading-settings *{animation-duration:.01ms!important;transition-duration:.01ms!important}}
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
