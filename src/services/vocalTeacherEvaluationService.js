
import { supabase } from '@/lib/supabase'

const TABLE = 'vocal_teacher_evaluations'

export const AMV_DIMENSIONS = [
  {
    key: 'intonation',
    label: 'Afinación',
    prompt: 'Precisión tonal y estabilidad de la afinación.'
  },
  {
    key: 'rhythm',
    label: 'Ritmo y precisión',
    prompt: 'Pulso, coordinación rítmica y precisión de entradas.'
  },
  {
    key: 'air',
    label: 'Aire y fraseo',
    prompt: 'Gestión respiratoria, continuidad y organización de frases.'
  },
  {
    key: 'phonation',
    label: 'Fonación y emisión',
    prompt: 'Inicio vocal, coordinación y eficiencia de la emisión.'
  },
  {
    key: 'register',
    label: 'Registro y transiciones',
    prompt: 'Coordinación entre registros y comodidad en las transiciones.'
  },
  {
    key: 'resonance',
    label: 'Resonancia y timbre',
    prompt: 'Calidad tímbrica y uso vocal de la resonancia.'
  },
  {
    key: 'diction',
    label: 'Dicción y articulación',
    prompt: 'Claridad de vocales, consonantes y texto.'
  },
  {
    key: 'expression',
    label: 'Expresión y musicalidad',
    prompt: 'Intención, dinámica, fraseo expresivo e interpretación.'
  }
]

const EVALUATION_COLUMNS = [
  'id',
  'recording_id',
  'student_id',
  'teacher_id',
  'scores',
  'observations',
  'strengths',
  'priorities',
  'exercise_plan',
  'integrated_result',
  'created_at',
  'updated_at'
].join(', ')

function positiveId(value, label) {
  const id = Number(value)

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error(`${label} no es válido.`)
  }

  return id
}

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

async function requireTeacher() {
  const { data, error } = await supabase.auth.getUser()

  if (error) throw error

  if (!data?.user) {
    throw new Error('Debes iniciar sesión para continuar.')
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .maybeSingle()

  if (profileError) throw profileError

  if (profile?.role !== 'teacher') {
    throw new Error('Tu cuenta no tiene permisos de profesor.')
  }

  return data.user
}

export async function fetchTeacherEvaluation(recordingId) {
  const id = positiveId(
    recordingId,
    'El ID de la grabación'
  )

  await requireTeacher()

  const { data, error } = await supabase
    .from(TABLE)
    .select(EVALUATION_COLUMNS)
    .eq('recording_id', id)
    .maybeSingle()

  if (error) throw error

  // Compatibilidad con evaluaciones antiguas de escala 1–5.
  // La conversión se realiza en memoria, sin modificar la base de datos.
  if (data?.scores && typeof data.scores === 'object') {
    const values = Object.values(data.scores)

    if (
      values.length > 0 &&
      values.every(
        value =>
          Number.isFinite(value) &&
          value >= 1 &&
          value <= 5
      )
    ) {
      data.scores = Object.fromEntries(
        Object.entries(data.scores).map(([key, value]) => [
          key,
          Number(value) * 2
        ])
      )

      data._legacyScaleConverted = true
    }
  }

  return data
}

export async function fetchTeacherEvaluationHistory(studentId) {
  const id = positiveId(studentId, 'El ID del alumno')

  await requireTeacher()

  const { data, error } = await supabase
    .from(TABLE)
    .select(EVALUATION_COLUMNS)
    .eq('student_id', id)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data || []
}

export async function saveTeacherEvaluation({
  recordingId,
  studentId,
  scores,
  observations = '',
  strengths = '',
  priorities = '',
  exercisePlan = '',
  integratedResult = {}
}) {
  const recording = positiveId(
    recordingId,
    'El ID de la grabación'
  )

  const student = positiveId(
    studentId,
    'El ID del alumno'
  )

  const teacher = await requireTeacher()

  if (!scores || typeof scores !== 'object' || Array.isArray(scores)) {
    throw new Error('Las puntuaciones docentes no son válidas.')
  }

  // Validar las ocho dimensiones de la pauta AMV.
  const normalizedScores = {}

  for (const dimension of AMV_DIMENSIONS) {
    const score = Number(scores[dimension.key])

    if (
      !Number.isInteger(score) ||
      score < 1 ||
      score > 10
    ) {
      throw new Error(
        `Completa "${dimension.label}" con una puntuación de 1 a 10.`
      )
    }

    normalizedScores[dimension.key] = score
  }

  if (
    !integratedResult ||
    typeof integratedResult !== 'object' ||
    Array.isArray(integratedResult)
  ) {
    throw new Error(
      'El resultado integral no tiene un formato válido.'
    )
  }

  // Comprobar que la grabación corresponda al alumno seleccionado.
  const { data: vocalRecording, error: recordingError } =
    await supabase
      .from('vocal_recordings')
      .select('id, student_id')
      .eq('id', recording)
      .eq('student_id', student)
      .maybeSingle()

  if (recordingError) throw recordingError

  if (!vocalRecording) {
    throw new Error(
      'No se encontró una grabación accesible para el alumno seleccionado.'
    )
  }

  const payload = {
    recording_id: recording,
    student_id: student,
    teacher_id: teacher.id,
    scores: normalizedScores,
    observations: cleanText(observations),
    strengths: cleanText(strengths),
    priorities: cleanText(priorities),
    exercise_plan: cleanText(exercisePlan),
    integrated_result: integratedResult,
    updated_at: new Date().toISOString()
  }

  // recording_id tiene una restricción UNIQUE en Supabase.
  // Así se crea la evaluación o se actualiza la existente.
  const { data, error } = await supabase
    .from(TABLE)
    .upsert(payload, {
      onConflict: 'recording_id'
    })
    .select(EVALUATION_COLUMNS)
    .single()

  if (error) throw error

  return data
}
