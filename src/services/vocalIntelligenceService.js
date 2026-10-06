import { supabase } from '@/lib/supabase'


// =========================================================

// DIMENSIONES DE INTELIGENCIA VOCAL

// =========================================================


export const VOCAL_DIMENSIONS = [
  {
    key: 'intonation',
    label: 'Afinación',
    shortLabel: 'Afinación',
    description:
      'Precisión de altura, estabilidad del tono y comportamiento de los intervalos.',
    submetrics: [
      'pitchAccuracy',
      'pitchStability',
      'intervalAccuracy',
      'tonalCenter',
    ],
  },

  {
    key: 'rhythm',
    label: 'Ritmo y precisión temporal',
    shortLabel: 'Ritmo',
    description:
      'Relación de las entradas, duraciones y eventos vocales con el pulso o la referencia temporal.',
    submetrics: [
      'onsetTiming',
      'durationAccuracy',
      'pulseAlignment',
      'tempoStability',
    ],
  },

  {
    key: 'air_management',
    label: 'Gestión del aire y fraseo',
    shortLabel: 'Aire y fraseo',
    description:
      'Indicadores audibles relacionados con continuidad de la frase, respiraciones y estabilidad del flujo.',
    submetrics: [
      'phraseContinuity',
      'breathEvents',
      'intensityDecay',
      'phraseLength',
    ],
  },

  {
    key: 'phonation',
    label: 'Fonación y emisión',
    shortLabel: 'Fonación',
    description:
      'Características audibles del inicio, continuidad y final de la emisión vocal.',
    submetrics: [
      'onset',
      'offset',
      'voicingStability',
      'periodicity',
    ],
  },

  {
    key: 'register',
    label: 'Registro y transiciones',
    shortLabel: 'Registro',
    description:
      'Continuidad y estabilidad de la voz al desplazarse entre diferentes zonas de frecuencia.',
    submetrics: [
      'registerContinuity',
      'transitionStability',
      'breakEvents',
      'rangeUsage',
    ],
  },

  {
    key: 'resonance',
    label: 'Resonancia y calidad tímbrica',
    shortLabel: 'Resonancia',
    description:
      'Características espectrales y consistencia del timbre observables en la señal grabada.',
    submetrics: [
      'spectralBalance',
      'harmonicStructure',
      'timbreConsistency',
      'spectralEnergy',
    ],
  },

  {
    key: 'diction',
    label: 'Dicción y articulación',
    shortLabel: 'Dicción',
    description:
      'Claridad y organización temporal de vocales, consonantes y texto cantado cuando el audio lo permite.',
    submetrics: [
      'consonantClarity',
      'vowelClarity',
      'syllableTiming',
      'textIntelligibility',
    ],
  },

  {
    key: 'expression',
    label: 'Expresión y musicalidad',
    shortLabel: 'Expresión',
    description:
      'Uso musical de dinámica, fraseo, contrastes e intención expresiva observable en la interpretación.',
    submetrics: [
      'dynamicContrast',
      'phrasing',
      'musicalContrast',
      'textMusicRelationship',
    ],
  },
]

const LEGACY_DIMENSION_ALIASES = {
  breath: 'air_management',
  onset: 'phonation',
  interpretation: 'expression',
}

const mergeDimensionValues = (currentValue, incomingValue) => {
  if (
    currentValue &&
    incomingValue &&
    typeof currentValue === 'object' &&
    typeof incomingValue === 'object' &&
    !Array.isArray(currentValue) &&
    !Array.isArray(incomingValue)
  ) {
    return {
      ...currentValue,
      ...incomingValue,
      metrics: {
        ...(currentValue.metrics || {}),
        ...(incomingValue.metrics || {}),
      },
    }
  }

  return currentValue ?? incomingValue
}

const normalizeDimensions = dimensions => {
  if (
    !dimensions ||
    typeof dimensions !== 'object' ||
    Array.isArray(dimensions)
  ) {
    return {}
  }

  return Object.entries(dimensions).reduce(
    (normalized, [key, value]) => {
      const normalizedKey =
        LEGACY_DIMENSION_ALIASES[key] || key

      normalized[normalizedKey] = mergeDimensionValues(
        normalized[normalizedKey],
        value
      )

      return normalized
    },
    {}
  )
}


// =========================================================

// NORMALIZAR ANÁLISIS

// =========================================================


const normalizeAnalysis = analysis => {

  if (!analysis) {
    return null
  }

  return {
    id: analysis.id,
    recordingId: analysis.recording_id,
    status: analysis.status || 'pending',
    model: analysis.model || '',
    summary: analysis.summary || '',
    strengths: Array.isArray(analysis.strengths) ? analysis.strengths : [],
    priorities: Array.isArray(analysis.priorities) ? analysis.priorities : [],
    dimensions: normalizeDimensions(analysis.dimensions),
    limitations: Array.isArray(analysis.limitations) ? analysis.limitations : [],
    errorMessage: analysis.error_message || '',
    attempts: Number(analysis.attempts || 0),
    workerId: analysis.worker_id || '',
    startedAt: analysis.started_at || null,
    completedAt: analysis.completed_at || null,
    referenceProfile: analysis.reference_profile || null,
    comparison: analysis.comparison || null,
    workerResult: analysis.worker_result || null,
    createdAt: analysis.created_at || null,
    updatedAt: analysis.updated_at || null
  }
}

// =========================================================

// NORMALIZAR GRABACIÓN

// =========================================================

const normalizeRecording = recording => {

  if (!recording) {
    return null
  }

  // PostgREST puede devolver la relación como arreglo o como objeto
  // cuando recording_id tiene una restricción UNIQUE (relación 1:1).
  // AMV acepta ambas formas para no perder un análisis completado.
  const rawAnalyses = recording.vocal_ai_analyses
  const analyses = Array.isArray(rawAnalyses)
    ? rawAnalyses
    : rawAnalyses && typeof rawAnalyses === 'object'
      ? [rawAnalyses]
      : []

  return {
    id: recording.id,
    studentId: recording.student_id,
    title: recording.title || 'Grabación vocal',
    song: recording.song || '',
    artist: recording.artist || '',
    songType: recording.song_type || '',
    key: recording.key || '',
    scale: recording.scale || '',
    tonality: recording.tonality || '',
    bpm: recording.bpm ?? null,
    timeSignature: recording.time_signature || '',
    youtubeUrl: recording.youtube_url || '',
    youtubeVideoId: recording.youtube_video_id || '',
    youtubeRole: recording.youtube_role || '',
    referenceMode: recording.reference_mode || '',
    melodySource: recording.melody_source || '',
    transpositionSemitones: Number(recording.transposition_semitones || 0),
    referenceStoragePath: recording.reference_storage_path || '',
    referenceOriginalName: recording.reference_original_name || '',
    referenceMimeType: recording.reference_mime_type || '',
    referenceUploadedAt: recording.reference_uploaded_at || null,
    referenceStatus: recording.reference_status || '',
    referenceDeletedAt: recording.reference_deleted_at || null,
    storagePath: recording.storage_path || '',
    audioUrl: recording.audio_url || '',
    durationSeconds: recording.duration_seconds ?? null,
    recordedAt: recording.recorded_at || null,
    createdAt: recording.created_at || null,
    updatedAt: recording.updated_at || null,
    analysis: analyses.length > 0 ? normalizeAnalysis(analyses[0]) : null
  }
}


// =========================================================

// OBTENER GRABACIONES DEL ESTUDIANTE

// =========================================================


export const fetchVocalRecordings = async studentId => {

  const normalizedStudentId =

    Number(studentId)


  if (!Number.isFinite(normalizedStudentId)) {

    throw new Error(

      'El ID del estudiante no es válido.'

    )

  }


  const {

    data,

    error

  } = await supabase


    .from('vocal_recordings')


    .select(`

      *,

      vocal_ai_analyses (

        *

      )

    `)


    .eq(

      'student_id',

      normalizedStudentId

    )


    .order(

      'recorded_at',

      {

        ascending: false

      }

    )


  if (error) {

    console.error(

      '[VocalIntelligence] Error obteniendo grabaciones:',

      error

    )


    throw error

  }


  return (

    data || []

  ).map(

    normalizeRecording

  )

}


const extractYouTubeVideoId = value => {
  const raw = String(value || '').trim()
  if (!raw) return ''

  try {
    const url = new URL(raw)

    if (url.hostname.includes('youtu.be')) {
      return url.pathname.replace(/^\//, '').split('/')[0] || ''
    }

    if (url.hostname.includes('youtube.com')) {
      const queryId = url.searchParams.get('v')
      if (queryId) return queryId

      const parts = url.pathname.split('/').filter(Boolean)
      if (parts[0] === 'shorts' || parts[0] === 'embed' || parts[0] === 'live') {
        return parts[1] || ''
      }
    }
  } catch {
    return ''
  }

  return ''
}


// =========================================================

// SUBIR GRABACIÓN VOCAL

// =========================================================


export const uploadVocalRecording = async ({
  studentId,
  file,
  title,
  song,
  artist,
  songType = 'cover',
  key,
  scale,
  bpm,
  timeSignature,
  youtubeUrl,
  referenceFile,
  transpositionSemitones = 0,
  recordedAt
}) => {

  if (!file) {
    throw new Error('Selecciona un audio antes de continuar.')
  }

  if (!referenceFile) {
    throw new Error('Selecciona también una referencia MIDI o audio para que AMV pueda comparar la interpretación.')
  }

  const normalizedStudentId = Number(studentId)

  if (!Number.isFinite(normalizedStudentId)) {
    throw new Error('El ID del estudiante no es válido.')
  }

  const originalName = String(file.name || 'audio')
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.\_-]+/g, '-')
    .replace(/-+/g, '-')

  const referenceOriginalName = String(referenceFile.name || 'referencia')
  const safeReferenceName = referenceOriginalName
    .replace(/[^a-zA-Z0-9.\_-]+/g, '-')
    .replace(/-+/g, '-')

  const referenceSuffix = referenceOriginalName.split('.').pop()?.toLowerCase() || ''
  const referenceIsMidi = ['mid', 'midi'].includes(referenceSuffix)
  const referenceMode = referenceIsMidi ? 'midi' : 'audio'
  const melodySource = referenceIsMidi ? 'midi' : 'audio'

  const uniqueId = crypto.randomUUID()
  const storagePath = `${normalizedStudentId}/${uniqueId}-${safeName}`
  const referenceStoragePath = `${normalizedStudentId}/references/${uniqueId}-${safeReferenceName}`

  const { error: uploadError } = await supabase.storage
    .from('vocal-recordings')
    .upload(storagePath, file, {
      upsert: false,
      contentType: file.type || 'audio/mpeg'
    })

  if (uploadError) {
    console.error('[VocalIntelligence] Error subiendo audio:', uploadError)
    throw uploadError
  }

  const { error: referenceUploadError } = await supabase.storage
    .from('vocal-recordings')
    .upload(referenceStoragePath, referenceFile, {
      upsert: false,
      contentType: referenceFile.type || (referenceIsMidi ? 'audio/midi' : 'audio/mpeg')
    })

  if (referenceUploadError) {
    await supabase.storage.from('vocal-recordings').remove([storagePath])
    console.error('[VocalIntelligence] Error subiendo referencia:', referenceUploadError)
    throw referenceUploadError
  }

  const numericBpm = bpm === '' || bpm === null || bpm === undefined
    ? null
    : Number(bpm)

  const numericTransposition = Number(transpositionSemitones || 0)

  const { data, error } = await supabase
    .from('vocal_recordings')
    .insert({
      student_id: normalizedStudentId,
      title: title?.trim() || originalName || 'Grabación vocal',
      song: song?.trim() || '',
      artist: artist?.trim() || '',
      song_type: songType || 'cover',
      key: key?.trim() || '',
      scale: scale?.trim() || '',
      tonality: [key?.trim(), scale?.trim()].filter(Boolean).join(' '),
      bpm: Number.isFinite(numericBpm) ? numericBpm : null,
      time_signature: timeSignature?.trim() || '',
      youtube_url: youtubeUrl?.trim() || '',
      youtube_video_id: extractYouTubeVideoId(youtubeUrl),
      youtube_role: youtubeUrl?.trim() ? 'context_and_playback' : '',
      reference_mode: referenceMode,
      melody_source: melodySource,
      transposition_semitones: Number.isFinite(numericTransposition) ? numericTransposition : 0,
      reference_storage_path: referenceStoragePath,
      reference_original_name: referenceOriginalName,
      reference_mime_type: referenceFile.type || '',
      reference_uploaded_at: new Date().toISOString(),
      reference_status: 'uploaded',
      storage_path: storagePath,
      recorded_at: recordedAt || new Date().toISOString()
    })
    .select()
    .single()

  if (error) {
    await supabase.storage.from('vocal-recordings').remove([
      storagePath,
      referenceStoragePath
    ])

    console.error('[VocalIntelligence] Error creando registro:', error)
    throw error
  }

  return normalizeRecording(data)
}


// =========================================================

// CREAR URL TEMPORAL PARA ESCUCHAR AUDIO

// =========================================================


export const createVocalRecordingSignedUrl =

  async storagePath => {

    if (!storagePath) {

      return ''

    }


    const {

      data,

      error

    } = await supabase.storage


      .from('vocal-recordings')


      .createSignedUrl(

        storagePath,

        60 * 60

      )


    if (error) {

      console.error(

        '[VocalIntelligence] Error creando URL:',

        error

      )


      throw error

    }


    return (

      data?.signedUrl || ''

    )

  }


// =========================================================

// SOLICITAR ANÁLISIS VOCAL DE IA

// =========================================================

//

// La IA no se ejecuta directamente desde el navegador.

//

// El navegador solicita:

//

// recordingId

//

// y la Edge Function:

//

// analyze-vocal-recording

//

// se encarga del procesamiento seguro.

//

// =========================================================


export const requestVocalAnalysis =

  async recordingId => {

    const normalizedRecordingId =

      Number(recordingId)


    if (

      !Number.isFinite(

        normalizedRecordingId

      )

    ) {

      throw new Error(

        'El ID de la grabación no es válido.'

      )

    }


    const {

      data,

      error

    } = await supabase.functions.invoke(

      'analyze-vocal-recording',

      {

        body: {

          recordingId:

            normalizedRecordingId

        }

      }

    )


    if (error) {

      console.error(

        '[VocalIntelligence] Error solicitando análisis:',

        error

      )


      throw error

    }


    return data

  }


// =========================================================

// OBTENER UNA GRABACIÓN ESPECÍFICA

// =========================================================


export const fetchVocalRecordingById =

  async recordingId => {

    const normalizedRecordingId =

      Number(recordingId)


    if (

      !Number.isFinite(

        normalizedRecordingId

      )

    ) {

      throw new Error(

        'El ID de la grabación no es válido.'

      )

    }


    const {

      data,

      error

    } = await supabase


      .from('vocal_recordings')


      .select(`

        *,

        vocal_ai_analyses (

          *

        )

      `)


      .eq(

        'id',

        normalizedRecordingId

      )


      .single()


    if (error) {

      console.error(

        '[VocalIntelligence] Error obteniendo grabación:',

        error

      )


      throw error

    }


    return normalizeRecording(

      data

    )

  }


// =========================================================

// ELIMINAR GRABACIÓN

// =========================================================

//

// Primero elimina el archivo de Storage.

// Luego elimina el registro de la BD.

//

// El análisis asociado se elimina automáticamente

// gracias a ON DELETE CASCADE.

// =========================================================


export const deleteVocalRecording =

  async recording => {

    if (!recording?.id) {

      throw new Error(

        'La grabación no es válida.'

      )

    }


    const storagePath =

      recording.storagePath


    // -----------------------------------------------------

    // ELIMINAR ARCHIVO

    // -----------------------------------------------------


    if (storagePath) {

      const {

        error: storageError

      } = await supabase.storage


        .from('vocal-recordings')


        .remove([

          storagePath

        ])


      if (storageError) {

        console.error(

          '[VocalIntelligence] Error eliminando audio:',

          storageError

        )


        throw storageError

      }

    }


    // -----------------------------------------------------

    // ELIMINAR REGISTRO

    // -----------------------------------------------------


    const {

      error

    } = await supabase


      .from('vocal_recordings')


      .delete()


      .eq(

        'id',

        Number(recording.id)

      )


    if (error) {

      console.error(

        '[VocalIntelligence] Error eliminando registro:',

        error

      )


      throw error

    }


    return true

  }


// =========================================================

// =========================================================

// UTILIDADES DE ANÁLISIS

// =========================================================

export const getVocalDimensionValue = (
  analysis,
  key
) => {
  const normalized = normalizeDimensions(
    analysis?.dimensions
  )

  return normalized[key] ?? null
}


// UTILIDADES

// =========================================================


export const getVocalDimension =

  key => {

    return (

      VOCAL_DIMENSIONS.find(

        dimension =>

          dimension.key === key

      ) || null

    )

  }


export const getVocalDimensionLabel =

  key => {

    return (

      getVocalDimension(key)?.label ||

      key

    )

  }


export const getVocalDimensionShortLabel =

  key => {

    return (

      getVocalDimension(key)?.shortLabel ||

      key

    )

  }
