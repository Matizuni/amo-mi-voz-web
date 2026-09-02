import { supabase } from '@/lib/supabase'

const normalizeStudent = student => {
  if (!student) return null

  return {
    id: student.id,
    name: student.name,
    role: 'student',
    voice: student.voice || '',
    active: student.active ?? true,
    createdAt: student.created_at,
    updatedAt: student.updated_at
  }
}

export const fetchStudents = async () => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('active', true)
    .order('id', { ascending: true })

  if (error) {
    console.error(
      'Error obteniendo estudiantes:',
      error
    )

    throw error
  }

  return (data || []).map(normalizeStudent)
}

export const fetchStudentById = async studentId => {
  const { data, error } = await supabase
    .from('students')
    .select('*')
    .eq('id', Number(studentId))
    .maybeSingle()

  if (error) {
    console.error(
      'Error obteniendo estudiante:',
      error
    )

    throw error
  }

  return normalizeStudent(data)
}

export const insertStudent = async student => {
  const payload = {
    name: student.name.trim(),
    voice: student.voice,
    active: true
  }

  const { data, error } = await supabase
    .from('students')
    .insert(payload)
    .select()
    .single()

  if (error) {
    console.error(
      'Error creando estudiante:',
      error
    )

    throw error
  }

  return normalizeStudent(data)
}

export const updateStudent = async (
  studentId,
  student
) => {
  const payload = {
    name: student.name,
    voice: student.voice,
    active: student.active ?? true,
    updated_at: new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('students')
    .update(payload)
    .eq('id', Number(studentId))
    .select()
    .single()

  if (error) {
    console.error(
      'Error actualizando estudiante:',
      error
    )

    throw error
  }

  return normalizeStudent(data)
}

export const removeStudent = async studentId => {
  const { data, error } = await supabase
    .from('students')
    .update({
      active: false,
      updated_at: new Date().toISOString()
    })
    .eq('id', Number(studentId))
    .select()
    .single()

  if (error) {
    console.error(
      'Error desactivando estudiante:',
      error
    )

    throw error
  }

  return normalizeStudent(data)
}
