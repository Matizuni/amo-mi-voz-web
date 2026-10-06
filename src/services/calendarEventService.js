import { supabase } from '@/lib/supabase'

const TABLE = 'calendar_events'

const parseId = value => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

const normalizeEvent = row => ({
  id: parseId(row?.id),
  title: String(row?.title || '').trim(),
  description: String(row?.description || '').trim(),
  eventType: String(row?.event_type || 'other').trim().toLowerCase(),
  startsAt: row?.starts_at || null,
  endsAt: row?.ends_at || null,
  allDay: Boolean(row?.all_day),
  location: String(row?.location || '').trim(),
  scope: String(row?.scope || 'all').trim().toLowerCase(),
  createdBy: row?.created_by || null,
  createdAt: row?.created_at || null,
  updatedAt: row?.updated_at || null,
})

const throwError = (message, error) => {
  console.error(message, error)
  throw new Error(error?.message || message)
}

export async function fetchCalendarEvents() {
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .order('starts_at', { ascending: true })

  if (error) {
    throwError(
      'No fue posible cargar los eventos del calendario.',
      error,
    )
  }

  return (data || [])
    .map(normalizeEvent)
    .filter(item => item.id && item.title)
}

const VALID_TYPES = new Set([
  'audition',
  'rehearsal',
  'concert',
  'meeting',
  'announcement',
  'holiday',
  'other',
])

const VALID_SCOPES = new Set([
  'all',
  'students',
  'teachers',
])

const validatePayload = payload => {
  const title = String(payload?.title || '').trim()
  const startsAt = payload?.startsAt || null
  const eventType = String(
    payload?.eventType || 'other',
  )
    .trim()
    .toLowerCase()

  if (!title) {
    throw new Error('Escribe un título para el evento.')
  }

  if (!startsAt) {
    throw new Error('Selecciona la fecha del evento.')
  }

  if (!VALID_TYPES.has(eventType)) {
    throw new Error(
      'El tipo de evento seleccionado no es válido.',
    )
  }

  const scope =
    String(payload?.scope || 'all')
      .trim()
      .toLowerCase() || 'all'

  if (!VALID_SCOPES.has(scope)) {
    throw new Error(
      'La visibilidad seleccionada no es válida.',
    )
  }

  return {
    title,
    description:
      String(payload?.description || '').trim() || null,
    event_type: eventType,
    starts_at: startsAt,
    ends_at: payload?.endsAt || null,
    all_day: Boolean(payload?.allDay),
    location:
      String(payload?.location || '').trim() || null,
    scope,
  }
}

export async function createCalendarEvent(payload) {
  const row = validatePayload(payload)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.id) {
    throw new Error(
      'Tu sesión no es válida para crear el evento.',
    )
  }

  row.created_by = user.id

  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select('*')
    .single()

  if (error) {
    throwError(
      'No fue posible crear el evento.',
      error,
    )
  }

  return normalizeEvent(data)
}

export async function updateCalendarEvent(
  id,
  payload,
) {
  const eventId = parseId(id)

  if (!eventId) {
    throw new Error(
      'El evento seleccionado no es válido.',
    )
  }

  const row = validatePayload(payload)

  const { data, error } = await supabase
    .from(TABLE)
    .update(row)
    .eq('id', eventId)
    .select('*')
    .single()

  if (error) {
    throwError(
      'No fue posible actualizar el evento.',
      error,
    )
  }

  return normalizeEvent(data)
}

export async function deleteCalendarEvent(id) {
  const eventId = parseId(id)

  if (!eventId) {
    throw new Error(
      'El evento seleccionado no es válido.',
    )
  }

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq('id', eventId)

  if (error) {
    throwError(
      'No fue posible eliminar el evento.',
      error,
    )
  }

  return true
}
