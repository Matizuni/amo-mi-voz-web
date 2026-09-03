import { supabase } from '@/lib/supabase'

const normalizeUnit = unit => ({
  id: unit.id,
  title: unit.title,
  description: unit.description || '',
  position: unit.position ?? 1,
  status: unit.status || 'published',
  createdAt: unit.created_at,
  updatedAt: unit.updated_at,
})

export async function fetchUnits() {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .order('position', { ascending: true })
    .order('id', { ascending: true })

  if (error) {
    throw error
  }

  return (data || []).map(normalizeUnit)
}

export async function fetchUnitById(unitId) {
  const { data, error } = await supabase
    .from('units')
    .select('*')
    .eq('id', unitId)
    .single()

  if (error) {
    throw error
  }

  return normalizeUnit(data)
}

export async function insertUnit(unit) {
  const { data, error } = await supabase
    .from('units')
    .insert({
      title: unit.title,
      description: unit.description || null,
      position: unit.position ?? 1,
      status: unit.status || 'published',
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return normalizeUnit(data)
}

export async function updateUnit(unitId, unit) {
  const { data, error } = await supabase
    .from('units')
    .update({
      title: unit.title,
      description: unit.description || null,
      position: unit.position ?? 1,
      status: unit.status || 'published',
      updated_at: new Date().toISOString(),
    })
    .eq('id', unitId)
    .select()
    .single()

  if (error) {
    throw error
  }

  return normalizeUnit(data)
}

export async function removeUnit(unitId) {
  const { error } = await supabase
    .from('units')
    .delete()
    .eq('id', unitId)

  if (error) {
    throw error
  }

  return true
}
