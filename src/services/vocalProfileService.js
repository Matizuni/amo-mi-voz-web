import { supabase } from '@/lib/supabase'

const normalizeVocalProfile = profile => {
  if (!profile) return null

  return {
    id: profile.id,
    studentId: profile.student_id,
    voice: profile.voice || '',
    tessituraLow: profile.tessitura_low || '',
    tessituraHigh: profile.tessitura_high || '',
    comfortableLow: profile.comfortable_low || '',
    comfortableHigh: profile.comfortable_high || '',
    passaggio: profile.passaggio || '',
    observations: profile.observations || '',
    createdAt: profile.created_at,
    updatedAt: profile.updated_at
  }
}

export const fetchVocalProfiles = async () => {
  const { data, error } = await supabase
    .from('vocal_profiles')
    .select('*')
    .order('student_id', { ascending: true })

  if (error) {
    console.error(
      'Error obteniendo fichas vocales:',
      error
    )

    throw error
  }

  return (data || []).map(normalizeVocalProfile)
}

export const fetchVocalProfileByStudent = async studentId => {
  const { data, error } = await supabase
    .from('vocal_profiles')
    .select('*')
    .eq('student_id', Number(studentId))
    .maybeSingle()

  if (error) {
    console.error(
      'Error obteniendo ficha vocal:',
      error
    )

    throw error
  }

  return normalizeVocalProfile(data)
}

export const upsertVocalProfile = async profile => {
  const now = new Date().toISOString()

  const payload = {
    student_id: Number(profile.studentId),
    voice: profile.voice || '',
    tessitura_low: profile.tessituraLow || '',
    tessitura_high: profile.tessituraHigh || '',
    comfortable_low: profile.comfortableLow || '',
    comfortable_high: profile.comfortableHigh || '',
    passaggio: profile.passaggio || '',
    observations: profile.observations || '',
    updated_at: now
  }

  const { data, error } = await supabase
    .from('vocal_profiles')
    .upsert(
      payload,
      {
        onConflict: 'student_id'
      }
    )
    .select()
    .single()

  if (error) {
    console.error(
      'Error guardando ficha vocal:',
      error
    )

    throw error
  }

  return normalizeVocalProfile(data)
}

export const removeVocalProfile = async studentId => {
  const { error } = await supabase
    .from('vocal_profiles')
    .delete()
    .eq('student_id', Number(studentId))

  if (error) {
    console.error(
      'Error eliminando ficha vocal:',
      error
    )

    throw error
  }

  return true
}
