// Reemplaza fetchTeacherEvaluation y saveTeacherEvaluation al final
// de tu servicio actual por estas versiones. Conservan la autenticación
// y validación existentes y persisten los campos de evaluación integral.

export async function fetchTeacherEvaluation(recordingId) {
  const id = Number(recordingId)
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('El ID de la grabación no es válido.')
  }

  const { data, error } = await supabase
    .from('vocal_teacher_evaluations')
    .select('id, recording_id, student_id, teacher_id, scores, observations, strengths, priorities, exercise_plan, integrated_result, created_at, updated_at')
    .eq('recording_id', id)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function saveTeacherEvaluation({
  recordingId,
  studentId,
  scores,
  observations = '',
  strengths = '',
  priorities = '',
  exercisePlan = '',
  integratedResult = null,
}) {
  const id = Number(recordingId)
  const student = Number(studentId)

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Selecciona una grabación válida.')
  }
  if (!Number.isSafeInteger(student) || student <= 0) {
    throw new Error('El estudiante no es válido.')
  }
  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) {
    throw new Error('Las puntuaciones docentes no son válidas.')
  }

  const { data: authData, error: authError } = await supabase.auth.getUser()
  if (authError) throw authError
  const teacherId = authData?.user?.id
  if (!teacherId) throw new Error('Debes iniciar sesión para evaluar.')

  const { data: recording, error: recordingError } = await supabase
    .from('vocal_recordings')
    .select('id, student_id')
    .eq('id', id)
    .eq('student_id', student)
    .maybeSingle()

  if (recordingError) throw recordingError
  if (!recording) {
    throw new Error('La grabación no pertenece al estudiante seleccionado.')
  }

  const { data: existing, error: existingError } = await supabase
    .from('vocal_teacher_evaluations')
    .select('id')
    .eq('recording_id', id)
    .maybeSingle()

  if (existingError) throw existingError

  const payload = {
    recording_id: id,
    student_id: student,
    teacher_id: teacherId,
    scores,
    observations: observations.trim(),
    strengths: strengths.trim(),
    priorities: priorities.trim(),
    exercise_plan: exercisePlan.trim(),
    integrated_result: integratedResult,
    updated_at: new Date().toISOString(),
  }

  const query = existing
    ? supabase.from('vocal_teacher_evaluations').update(payload).eq('id', existing.id)
    : supabase.from('vocal_teacher_evaluations').insert(payload)

  const { data, error } = await query.select().single()
  if (error) throw error
  return data
}
