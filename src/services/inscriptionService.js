import { supabase } from '@/lib/supabase'

function normalizeInscription(row) {
  return {
    id: row.id,

    name: row.name,
    age: row.age,
    phone: row.phone,
    email: row.email,

    guardianName: row.guardian_name,
    guardianPhone: row.guardian_phone,

    interest: row.interest,
    experience: row.experience,
    goals: row.goals,

    availability: row.availability,
    message: row.message,

    status: row.status,

    reviewedAt: row.reviewed_at,
    enrolledAt: row.enrolled_at,

    createdAt: row.created_at,
    updatedAt: row.updated_at
  }
}

export async function fetchInscriptions() {
  const { data, error } = await supabase
    .from('inscriptions')
    .select('*')
    .order('created_at', {
      ascending: false
    })

  if (error) {
    throw error
  }

  return (data ?? []).map(normalizeInscription)
}

export async function fetchInscriptionById(id) {
  const { data, error } = await supabase
    .from('inscriptions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return normalizeInscription(data)
}

export async function updateInscriptionStatus(
  id,
  status
) {
  const updates = {
    status
  }

  if (status === 'reviewed') {
    updates.reviewed_at =
      new Date().toISOString()
  }

  if (status === 'enrolled') {
    updates.enrolled_at =
      new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('inscriptions')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return normalizeInscription(data)
}

export async function deleteInscription(id) {
  const { error } = await supabase
    .from('inscriptions')
    .delete()
    .eq('id', id)

  if (error) {
    throw error
  }

  return true
}

export async function enrollInscription({
  inscriptionId,
  voice
}) {
  const { data, error } =
    await supabase.functions.invoke(
      'enroll-inscription',
      {
        body: {
          inscriptionId,
          voice
        }
      }
    )

  if (error) {
    throw error
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data
}
