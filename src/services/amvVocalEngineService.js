const AMV_PROFILE_URL = '/amv/student_vocal_profile_v3.json'

export async function fetchAmvVocalProfile() {
  const response = await fetch(AMV_PROFILE_URL)

  if (!response.ok) {
    throw new Error(
      `No se pudo cargar el perfil AMV (${response.status})`,
    )
  }

  const profile = await response.json()

  if (!profile || typeof profile !== 'object') {
    throw new Error('El perfil AMV no tiene un formato válido.')
  }

  return profile
}
