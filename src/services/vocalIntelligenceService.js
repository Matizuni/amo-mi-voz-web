import { supabase } from '@/lib/supabase'

export const VOCAL_DIMENSIONS = [
  { key: 'breath', label: 'Respiración y flujo', shortLabel: 'Respiración' },
  { key: 'onset', label: 'Inicio del sonido', shortLabel: 'Onset' },
  { key: 'phonation', label: 'Eficiencia fonatoria', shortLabel: 'Fonación' },
  { key: 'register', label: 'Registro y transiciones', shortLabel: 'Registro' },
  { key: 'resonance', label: 'Resonancia y proyección', shortLabel: 'Resonancia' },
  { key: 'intonation', label: 'Afinación', shortLabel: 'Afinación' },
  { key: 'diction', label: 'Dicción y articulación', shortLabel: 'Dicción' },
  { key: 'interpretation', label: 'Interpretación y musicalidad', shortLabel: 'Interpretación' }
]

const normalizeAnalysis = analysis => ({
  id: analysis.id,
  recordingId: analysis.recording_id,
  status: analysis.status || 'pending',
  model: analysis.model || '',
  summary: analysis.summary || '',
  strengths: analysis.strengths || [],
  priorities: analysis.priorities || [],
  dimensions: analysis.dimensions || {},
  limitations: analysis.limitations || [],
  createdAt: analysis.created_at,
  updatedAt: analysis.updated_at
})

const normalizeRecording = recording => ({
  id: recording.id,
  studentId: recording.student_id,
  title: recording.title || 'Grabación vocal',
  song: recording.song || '',
  storagePath: recording.storage_path || '',
  audioUrl: recording.audio_url || '',
  durationSeconds: recording.duration_seconds,
  recordedAt: recording.recorded_at,
  createdAt: recording.created_at,
  analysis: recording.vocal_ai_analyses?.[0]
    ? normalizeAnalysis(recording.vocal_ai_analyses[0])
    : null
})

export const fetchVocalRecordings = async studentId => {
  const { data, error } = await supabase
    .from('vocal_recordings')
    .select('*, vocal_ai_analyses(*)')
    .eq('student_id', Number(studentId))
    .order('recorded_at', { ascending: false })

  if (error) throw error
  return (data || []).map(normalizeRecording)
}

export const uploadVocalRecording = async ({ studentId, file, title, song, recordedAt }) => {
  if (!file) throw new Error('Selecciona un audio antes de continuar.')

  const safeName = String(file.name || 'audio').replace(/[^a-zA-Z0-9._-]+/g, '-')
  const storagePath = `${Number(studentId)}/${crypto.randomUUID()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from('vocal-recordings')
    .upload(storagePath, file, { upsert: false, contentType: file.type || 'audio/mpeg' })

  if (uploadError) throw uploadError

  const { data, error } = await supabase
    .from('vocal_recordings')
    .insert({
      student_id: Number(studentId),
      title: title?.trim() || file.name || 'Grabación vocal',
      song: song?.trim() || '',
      storage_path: storagePath,
      recorded_at: recordedAt || new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    await supabase.storage.from('vocal-recordings').remove([storagePath])
    throw error
  }

  return normalizeRecording(data)
}

export const createVocalRecordingSignedUrl = async storagePath => {
  if (!storagePath) return ''
  const { data, error } = await supabase.storage
    .from('vocal-recordings')
    .createSignedUrl(storagePath, 60 * 60)
  if (error) throw error
  return data?.signedUrl || ''
}

export const requestVocalAnalysis = async recordingId => {
  const { data, error } = await supabase.functions.invoke('analyze-vocal-recording', {
    body: { recordingId: Number(recordingId) }
  })
  if (error) throw error
  return data
}
