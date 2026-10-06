import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
}

const json = (body: Record<string, unknown>, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: corsHeaders,
  })

const readKey = (
  legacyName: string,
  modernName: string,
  modernKeyName = 'default',
) => {
  const modern = Deno.env.get(modernName)

  if (modern) {
    try {
      const parsed = JSON.parse(modern)
      if (typeof parsed === 'string') return parsed
      if (parsed?.[modernKeyName]) return parsed[modernKeyName]
    } catch {
      // Algunas instalaciones locales todavía exponen una cadena simple.
      return modern
    }
  }

  return Deno.env.get(legacyName) || ''
}

const getSupabaseConfig = () => {
  const url = Deno.env.get('SUPABASE_URL') || ''
  const publishableKey = readKey(
    'SUPABASE_ANON_KEY',
    'SUPABASE_PUBLISHABLE_KEYS',
  )
  const secretKey = readKey(
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPABASE_SECRET_KEYS',
  )

  if (!url || !publishableKey || !secretKey) {
    throw new Error(
      'Faltan SUPABASE_URL y/o las claves de Supabase para ejecutar la función.',
    )
  }

  return { url, publishableKey, secretKey }
}

const normalizeId = (value: unknown) => {
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return json({
      ok: false,
      error: 'Método no permitido. Usa POST.',
    }, 405)
  }

  try {
    const { url, publishableKey, secretKey } = getSupabaseConfig()
    const authorization = req.headers.get('Authorization') || ''

    if (!authorization.toLowerCase().startsWith('bearer ')) {
      return json({
        ok: false,
        error: 'Se requiere una sesión autenticada.',
      }, 401)
    }

    const userClient = createClient(url, publishableKey, {
      global: {
        headers: {
          Authorization: authorization,
        },
      },
    })

    const { data: userData, error: userError } = await userClient.auth.getUser()

    if (userError || !userData?.user?.id) {
      return json({
        ok: false,
        error: 'La sesión no pudo ser validada.',
      }, 401)
    }

    const body = await req.json().catch(() => ({}))
    const recordingId = normalizeId(body?.recordingId)

    if (!recordingId) {
      return json({
        ok: false,
        error: 'El recordingId no es válido.',
      }, 400)
    }

    // Esta consulta usa el cliente del usuario, por lo que RLS sigue siendo
    // la barrera de autorización sobre la grabación solicitada.
    const { data: recording, error: recordingError } = await userClient
      .from('vocal_recordings')
      .select(`
        id,
        student_id,
        title,
        song,
        artist,
        song_type,
        key,
        scale,
        tonality,
        bpm,
        time_signature,
        youtube_url,
        youtube_video_id,
        youtube_role,
        reference_mode,
        melody_source,
        transposition_semitones,
        reference_storage_path,
        reference_original_name,
        reference_mime_type
      `)
      .eq('id', recordingId)
      .single()

    if (recordingError || !recording) {
      console.error('[AMV] Grabación no autorizada o inexistente:', recordingError)
      return json({
        ok: false,
        error: 'No fue posible encontrar una grabación que puedas analizar.',
      }, 404)
    }

    const referenceMode = String(recording.reference_mode || '').trim().toLowerCase()
    const referencePath = String(recording.reference_storage_path || '').trim()

    if (!referencePath || !['audio', 'midi', 'hybrid'].includes(referenceMode)) {
      return json({
        ok: false,
        code: 'REFERENCE_REQUIRED',
        error: 'Esta muestra todavía no tiene una referencia AMV analizable. Sube un MIDI o un archivo de audio de referencia autorizado.',
      }, 400)
    }

    const admin = createClient(url, secretKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: existing, error: existingError } = await admin
      .from('vocal_ai_analyses')
      .select('id, status, attempts, created_at, updated_at')
      .eq('recording_id', recordingId)
      .maybeSingle()

    if (existingError) {
      console.error('[AMV] Error consultando análisis:', existingError)
      return json({
        ok: false,
        error: 'No fue posible consultar el estado del análisis.',
      }, 500)
    }

    const queuePayload = {
      recording_id: recordingId,
      status: 'pending',
      model: 'amv-worker-v1.0',
      summary: 'Análisis AMV en cola.',
      strengths: [],
      priorities: [],
      dimensions: {},
      limitations: [
        'El procesamiento se ejecuta en el AMV Worker externo.',
        'La referencia de audio es temporal y se elimina después de derivar su perfil, cuando corresponde.',
      ],
      error_message: null,
      worker_id: null,
      started_at: null,
      completed_at: null,
    }

    let analysis

    if (existing) {
      const { data, error } = await admin
        .from('vocal_ai_analyses')
        .update(queuePayload)
        .eq('id', existing.id)
        .select('*')
        .single()

      if (error) {
        console.error('[AMV] Error reencolando análisis:', error)
        return json({
          ok: false,
          error: 'No fue posible poner el análisis nuevamente en cola.',
        }, 500)
      }

      analysis = data
    } else {
      const { data, error } = await admin
        .from('vocal_ai_analyses')
        .insert(queuePayload)
        .select('*')
        .single()

      if (error) {
        console.error('[AMV] Error creando análisis:', error)
        return json({
          ok: false,
          error: 'No fue posible crear el trabajo de análisis.',
        }, 500)
      }

      analysis = data
    }

    return json({
      ok: true,
      queued: true,
      status: 'pending',
      analysisId: analysis.id,
      recordingId,
      referenceMode,
      message: 'El análisis AMV quedó en cola. El Worker procesará la muestra y actualizará este registro.',
      userId: userData.user.id,
    }, 202)
  } catch (error) {
    console.error('[AMV] Error inesperado:', error)

    return json({
      ok: false,
      error: error?.message || 'Error interno al solicitar el análisis AMV.',
    }, 500)
  }
})
