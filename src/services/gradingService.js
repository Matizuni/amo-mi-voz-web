import { supabase } from '@/lib/supabase'

const SETTINGS_TABLE = 'grading_settings'
const CATEGORIES_TABLE = 'grading_categories'

const DEFAULT_CATEGORIES = [
  { key: 'assignments', name: 'Tareas', weight: 20, position: 1, enabled: true },
  { key: 'quiz', name: 'Quiz', weight: 20, position: 2, enabled: true },
  { key: 'test', name: 'Pruebas', weight: 30, position: 3, enabled: true },
  { key: 'project', name: 'Proyecto / Concierto', weight: 30, position: 4, enabled: true },
]

const normalizeSettings = row => ({
  id: row?.id ?? null,
  scopeKey: row?.scope_key || 'default',
  gradingScale: row?.grading_scale || 'chilean_1_7',
  minimumGrade: Number(row?.minimum_grade ?? 1),
  maximumGrade: Number(row?.maximum_grade ?? 7),
  passingGrade: Number(row?.passing_grade ?? 4),
  exigencyPercentage: Number(row?.exigency_percentage ?? 60),
  decimals: Number(row?.decimals ?? 1),
  useWeights: row?.use_weights !== false,
  createdAt: row?.created_at || null,
  updatedAt: row?.updated_at || null,
})

const normalizeCategory = row => ({
  id: row?.id ?? null,
  key: row?.category_key || '',
  name: row?.name || '',
  weight: Number(row?.weight ?? 0),
  position: Number(row?.position ?? 1),
  enabled: row?.enabled !== false,
  createdAt: row?.created_at || null,
  updatedAt: row?.updated_at || null,
})

export const defaultGradingCategories = () =>
  DEFAULT_CATEGORIES.map(item => ({ ...item }))

export async function fetchGradingSettings() {
  const { data, error } = await supabase
    .from(SETTINGS_TABLE)
    .select('*')
    .eq('scope_key', 'default')
    .maybeSingle()

  if (error) throw error

  return normalizeSettings(data || {
    scope_key: 'default',
    grading_scale: 'chilean_1_7',
    minimum_grade: 1,
    maximum_grade: 7,
    passing_grade: 4,
    exigency_percentage: 60,
    decimals: 1,
    use_weights: true,
  })
}

export async function fetchGradingCategories() {
  const { data, error } = await supabase
    .from(CATEGORIES_TABLE)
    .select('*')
    .eq('scope_key', 'default')
    .order('position', { ascending: true })

  if (error) throw error
  return (data || []).map(normalizeCategory)
}

export async function fetchGradingConfiguration() {
  const [settings, categories] = await Promise.all([
    fetchGradingSettings(),
    fetchGradingCategories(),
  ])

  return {
    settings,
    categories: categories.length ? categories : defaultGradingCategories(),
  }
}

export async function saveGradingConfiguration({ settings, categories }) {
  const enabled = (categories || []).filter(item => item.enabled !== false)
  const total = enabled.reduce((sum, item) => sum + Number(item.weight || 0), 0)

  if (settings.useWeights && Math.abs(total - 100) > 0.001) {
    throw new Error(`Las ponderaciones activas deben sumar 100%. Actualmente suman ${total}%.`)
  }

  const settingsPayload = {
    scope_key: 'default',
    grading_scale: settings.gradingScale || 'chilean_1_7',
    minimum_grade: Number(settings.minimumGrade ?? 1),
    maximum_grade: Number(settings.maximumGrade ?? 7),
    passing_grade: Number(settings.passingGrade ?? 4),
    exigency_percentage: Number(settings.exigencyPercentage ?? 60),
    decimals: Number(settings.decimals ?? 1),
    use_weights: Boolean(settings.useWeights),
  }

  const { error: settingsError } = await supabase
    .from(SETTINGS_TABLE)
    .upsert(settingsPayload, { onConflict: 'scope_key' })

  if (settingsError) throw settingsError

  const payload = (categories || []).map((item, index) => ({
    scope_key: 'default',
    category_key: String(item.key || `category_${index + 1}`).trim(),
    name: String(item.name || '').trim(),
    weight: Number(item.weight || 0),
    position: index + 1,
    enabled: item.enabled !== false,
  }))

  if (payload.some(item => !item.name)) {
    throw new Error('Todas las categorías necesitan un nombre.')
  }

  const { error: deleteError } = await supabase
    .from(CATEGORIES_TABLE)
    .delete()
    .eq('scope_key', 'default')

  if (deleteError) throw deleteError

  if (payload.length) {
    const { error: insertError } = await supabase
      .from(CATEGORIES_TABLE)
      .insert(payload)

    if (insertError) throw insertError
  }

  return fetchGradingConfiguration()
}

export function percentageToChileanGrade(percentage, settings) {
  const p = Math.max(0, Math.min(100, Number(percentage || 0)))
  const min = Number(settings.minimumGrade ?? 1)
  const max = Number(settings.maximumGrade ?? 7)
  const pass = Number(settings.passingGrade ?? 4)
  const exigency = Math.max(1, Math.min(99, Number(settings.exigencyPercentage ?? 60)))

  let grade
  if (p <= exigency) {
    grade = min + (p / exigency) * (pass - min)
  } else {
    grade = pass + ((p - exigency) / (100 - exigency)) * (max - pass)
  }

  const decimals = Math.max(0, Math.min(2, Number(settings.decimals ?? 1)))
  return Number(grade.toFixed(decimals))
}

export function normalizeResultToPercentage(value, sourceScale = 'percentage', settings = {}) {
  const numeric = Number(value)
  if (!Number.isFinite(numeric)) return null

  if (sourceScale === 'percentage') {
    return Math.max(0, Math.min(100, numeric))
  }

  if (sourceScale === 'chilean_1_7') {
    const min = Number(settings.minimumGrade ?? 1)
    const max = Number(settings.maximumGrade ?? 7)
    if (max <= min) return null
    return Math.max(0, Math.min(100, ((numeric - min) / (max - min)) * 100))
  }

  return null
}

export function calculateWeightedResult(categoryResults, categories) {
  const active = (categories || []).filter(category => category.enabled !== false)
  let accumulated = 0
  let usedWeight = 0

  for (const category of active) {
    const result = categoryResults?.[category.key]
    if (!Number.isFinite(Number(result))) continue
    const weight = Number(category.weight || 0)
    accumulated += Number(result) * (weight / 100)
    usedWeight += weight
  }

  if (!usedWeight) return null
  return Number((accumulated / (usedWeight / 100)).toFixed(2))
}
