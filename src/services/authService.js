import {
  supabase
} from '@/lib/supabase'

/* =========================================================
   LOGIN
========================================================= */

export const signInWithEmail = async (
  email,
  password
) => {
  const {
    data,
    error
  } =
    await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    })

  if (error) {
    console.error(
      'Error iniciando sesión:',
      error
    )

    throw error
  }

  return data
}

/* =========================================================
   LOGOUT
========================================================= */

export const signOutUser = async () => {
  const {
    error
  } =
    await supabase.auth.signOut()

  if (error) {
    console.error(
      'Error cerrando sesión:',
      error
    )

    throw error
  }

  return true
}

/* =========================================================
   SESIÓN
========================================================= */

export const getCurrentSession = async () => {
  const {
    data,
    error
  } =
    await supabase.auth.getSession()

  if (error) {
    console.error(
      'Error obteniendo sesión:',
      error
    )

    throw error
  }

  return data?.session || null
}

/* =========================================================
   USUARIO AUTH
========================================================= */

export const getAuthUser = async () => {
  const {
    data,
    error
  } =
    await supabase.auth.getUser()

  if (error) {
    console.error(
      'Error obteniendo usuario:',
      error
    )

    throw error
  }

  return data?.user || null
}

/* =========================================================
   PERFIL
========================================================= */

export const fetchProfileByUserId =
  async userId => {
    if (!userId) {
      return null
    }

    const {
      data,
      error
    } =
      await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle()

    if (error) {
      console.error(
        'Error cargando perfil:',
        error
      )

      throw error
    }

    if (!data) {
      return null
    }

    return {
      id:
        data.id,

      role:
        data.role,

      studentId:
        data.student_id,

      displayName:
        data.display_name || '',

      createdAt:
        data.created_at,

      updatedAt:
        data.updated_at
    }
  }

/* =========================================================
   LISTENER
========================================================= */

export const onAuthStateChange =
  callback =>
    supabase.auth.onAuthStateChange(
      callback
    )
