import { supabase } from '@/lib/supabase'

const normalizeAttendance = record => {
  if (!record) return null

  return {
    id: record.id,
    lessonId: record.lesson_id,
    studentId: record.student_id,
    studentName: record.student_name || '',
    status: record.status || '',
    notes: record.notes || '',
    createdAt: record.created_at,
    updatedAt: record.updated_at
  }
}

export const fetchAttendance = async () => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .order('lesson_id', { ascending: true })
    .order('student_id', { ascending: true })

  if (error) {
    console.error('Error obteniendo asistencia:', error)
    throw error
  }

  return (data || []).map(normalizeAttendance)
}

export const fetchAttendanceByLesson = async lessonId => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('lesson_id', Number(lessonId))
    .order('student_id', { ascending: true })

  if (error) {
    console.error(
      'Error obteniendo asistencia de la clase:',
      error
    )
    throw error
  }

  return (data || []).map(normalizeAttendance)
}

export const fetchAttendanceByStudent = async studentId => {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('student_id', Number(studentId))
    .order('lesson_id', { ascending: true })

  if (error) {
    console.error(
      'Error obteniendo asistencia del estudiante:',
      error
    )
    throw error
  }

  return (data || []).map(normalizeAttendance)
}

export const upsertAttendanceRows = async rows => {
  if (!Array.isArray(rows) || rows.length === 0) {
    return []
  }

  const now = new Date().toISOString()

  const payload = rows.map(row => ({
    lesson_id: Number(row.lessonId),
    student_id: Number(row.studentId),
    student_name: row.studentName || '',
    status: row.status,
    notes: row.notes || '',
    updated_at: now
  }))

  const { data, error } = await supabase
    .from('attendance')
    .upsert(payload, {
      onConflict: 'lesson_id,student_id'
    })
    .select()

  if (error) {
    console.error('Error guardando asistencia:', error)
    throw error
  }

  return (data || []).map(normalizeAttendance)
}

export const removeAttendanceRecord = async attendanceId => {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('id', Number(attendanceId))

  if (error) {
    console.error(
      'Error eliminando registro de asistencia:',
      error
    )
    throw error
  }

  return true
}

export const removeAttendanceByLesson = async lessonId => {
  const { error } = await supabase
    .from('attendance')
    .delete()
    .eq('lesson_id', Number(lessonId))

  if (error) {
    console.error(
      'Error eliminando asistencia de la clase:',
      error
    )
    throw error
  }

  return true
}
