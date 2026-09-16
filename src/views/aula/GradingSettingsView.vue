<template>
  <section class="grading-settings">
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
