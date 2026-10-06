import { supabase } from '@/lib/supabase'

const AVATAR_BUCKET = 'profile-avatars'
const MAX_AVATAR_SIZE = 5 * 1024 * 1024

const ALLOWED_AVATAR_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
])

const extFromMime = mime => ({
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}[mime] || 'jpg')

const cleanText = value =>
  String(value ?? '')
    .trim()
    .replace(/\s+/g, ' ')

const getAuthenticatedUser = async () => {
  const { data, error } = await supabase.auth.getUser()

  if (error) {
    throw error
  }

  if (!data?.user?.id) {
    throw new Error('Tu sesión no es válida.')
  }

  return data.user
}

export async function fetchMyProfile() {
  const user = await getAuthenticatedUser()

  const { data, error } = await supabase
    .from('profiles')
    .select(`
      id,
      role,
      student_id,
      display_name,
      avatar_url,
      avatar_path,
      account_status,
      created_at,
      updated_at
    `)
    .eq('id', user.id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return {
    ...data,
    email: user.email || '',
    authCreatedAt: user.created_at || null,
    lastSignInAt: user.last_sign_in_at || null,
  }
}

export async function fetchMyStudentProfile(studentId) {
  const id = Number(studentId)

  if (!Number.isSafeInteger(id) || id <= 0) {
    return null
  }

  const { data, error } = await supabase
    .from('students')
    .select('id, name, voice, active, created_at')
    .eq('id', id)
    .maybeSingle()

  if (error) {
    throw error
  }

  return data || null
}

export async function updateMyProfile({ displayName }) {
  const user = await getAuthenticatedUser()
  const normalizedName = cleanText(displayName)

  if (normalizedName.length < 2) {
    throw new Error(
      'El nombre debe tener al menos 2 caracteres.',
    )
  }

  const {
    data: profile,
    error: profileError,
  } = await supabase
    .from('profiles')
    .update({
      display_name: normalizedName,
    })
    .eq('id', user.id)
    .select(`
      id,
      role,
      student_id,
      display_name,
      avatar_url,
      avatar_path
    `)
    .single()

  if (profileError) {
    throw profileError
  }

  if (
    profile?.role === 'student' &&
    profile.student_id
  ) {
    const {
      error: studentError,
    } = await supabase
      .from('students')
      .update({
        name: normalizedName,
      })
      .eq('id', profile.student_id)

    if (studentError) {
      throw studentError
    }
  }

  return profile
}

export async function uploadMyAvatar(file) {
  const user = await getAuthenticatedUser()

  if (!(file instanceof File)) {
    throw new Error(
      'Selecciona una imagen válida.',
    )
  }

  if (!ALLOWED_AVATAR_TYPES.has(file.type)) {
    throw new Error(
      'La foto debe estar en formato JPG, PNG o WEBP.',
    )
  }

  if (file.size > MAX_AVATAR_SIZE) {
    throw new Error(
      'La foto supera el máximo permitido de 5 MB.',
    )
  }

  const {
    data: currentProfile,
    error: profileReadError,
  } = await supabase
    .from('profiles')
    .select('avatar_path')
    .eq('id', user.id)
    .maybeSingle()

  if (profileReadError) {
    throw profileReadError
  }

  const extension = extFromMime(file.type)

  const storagePath =
    `${user.id}/avatar-${Date.now()}.${extension}`

  const {
    error: uploadError,
  } = await supabase
    .storage
    .from(AVATAR_BUCKET)
    .upload(
      storagePath,
      file,
      {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      },
    )

  if (uploadError) {
    throw uploadError
  }

  const {
    data: publicUrlData,
  } = supabase
    .storage
    .from(AVATAR_BUCKET)
    .getPublicUrl(storagePath)

  const avatarUrl =
    publicUrlData?.publicUrl || ''

  const {
    data,
    error: updateError,
  } = await supabase
    .from('profiles')
    .update({
      avatar_url: avatarUrl,
      avatar_path: storagePath,
    })
    .eq('id', user.id)
    .select(
      'avatar_url, avatar_path',
    )
    .single()

  if (updateError) {
    await supabase
      .storage
      .from(AVATAR_BUCKET)
      .remove([storagePath])
      .catch(() => { })

    throw updateError
  }

  if (
    currentProfile?.avatar_path &&
    currentProfile.avatar_path !== storagePath
  ) {
    await supabase
      .storage
      .from(AVATAR_BUCKET)
      .remove([
        currentProfile.avatar_path,
      ])
      .catch(() => { })
  }

  return data
}

export async function requestPasswordRecovery(
  email,
) {
  const normalizedEmail =
    cleanText(email).toLowerCase()

  if (!normalizedEmail) {
    throw new Error(
      'No encontramos un correo asociado a tu cuenta.',
    )
  }

  const { error } =
    await supabase.auth.resetPasswordForEmail(
      normalizedEmail,
      {
        redirectTo:
          `${window.location.origin}/aula/cuenta?recovery=1`,
      },
    )

  if (error) {
    throw error
  }

  return true
}

export async function updateStudentByTeacher(
  studentId,
  payload,
) {
  const id = Number(studentId)

  if (
    !Number.isSafeInteger(id) ||
    id <= 0
  ) {
    throw new Error(
      'El estudiante seleccionado no es válido.',
    )
  }

  const name = cleanText(
    payload?.name,
  )

  const voice = cleanText(
    payload?.voice,
  )

  if (name.length < 2) {
    throw new Error(
      'El nombre del estudiante debe tener al menos 2 caracteres.',
    )
  }

  const validVoices = new Set([
    'Soprano',
    'Alto',
    'Tenor',
    'Bajo',
    '',
  ])

  if (!validVoices.has(voice)) {
    throw new Error(
      'La clasificación vocal seleccionada no es válida.',
    )
  }

  const {
    data,
    error,
  } = await supabase
    .from('students')
    .update({
      name,
      voice: voice || null,
      active: payload?.active !== false,
    })
    .eq('id', id)
    .select(
      'id, name, voice, active, created_at',
    )
    .single()

  if (error) {
    throw error
  }

  // Mantener sincronizado el nombre visible en profiles
  // cuando exista la cuenta asociada.
  await supabase
    .from('profiles')
    .update({
      display_name: name,
    })
    .eq('student_id', id)
    .eq('role', 'student')
    .catch(() => { })

  return data
}
