import {
  computed,
  ref
} from 'vue'

import {
  fetchStudentById
} from '@/services/studentService'

import {
  fetchProfileByUserId,
  getCurrentSession,
  onAuthStateChange,
  signInWithEmail,
  signOutUser
} from '@/services/authService'

/* =========================================================
   ESTADO GLOBAL
========================================================= */

const currentUser = ref(null)

const authSession = ref(null)

const authProfile = ref(null)

const isAuthLoading = ref(true)

const authError = ref('')

let authInitialized = false

let authSubscription = null

/* =========================================================
   ROLES
========================================================= */

const isAuthenticated =
  computed(() =>
    Boolean(
      authSession.value?.user
    )
  )

const isTeacher =
  computed(() =>
    currentUser.value?.role ===
    'teacher'
  )

const isStudent =
  computed(() =>
    currentUser.value?.role ===
    'student'
  )

/* =========================================================
   CONSTRUIR USUARIO DE LA APP
========================================================= */

const buildCurrentUser =
  async session => {
    if (!session?.user) {
      currentUser.value = null
      authProfile.value = null

      return null
    }

    const profile =
      await fetchProfileByUserId(
        session.user.id
      )

    authProfile.value =
      profile

    if (!profile) {
      currentUser.value = null

      return null
    }

    /* =====================================================
       PROFESOR
    ====================================================== */

    if (
      profile.role === 'teacher'
    ) {
      currentUser.value = {
        id:
          session.user.id,

        authId:
          session.user.id,

        email:
          session.user.email,

        name:
          profile.displayName ||
          'Profesor',

        role:
          'teacher',

        studentId:
          null
      }

      return currentUser.value
    }

    /* =====================================================
       ALUMNO SIN VINCULAR
    ====================================================== */

    if (
      profile.role === 'student' &&
      !profile.studentId
    ) {
      currentUser.value = {
        id:
          session.user.id,

        authId:
          session.user.id,

        email:
          session.user.email,

        name:
          profile.displayName ||
          session.user.email ||
          'Estudiante',

        role:
          'student',

        studentId:
          null,

        voice:
          ''
      }

      return currentUser.value
    }

    /* =====================================================
       ALUMNO VINCULADO
    ====================================================== */

    const student =
      await fetchStudentById(
        profile.studentId
      )

    currentUser.value = {
      id:
        student?.id ||
        profile.studentId,

      authId:
        session.user.id,

      email:
        session.user.email,

      name:
        student?.name ||
        profile.displayName ||
        'Estudiante',

      role:
        'student',

      studentId:
        profile.studentId,

      voice:
        student?.voice ||
        ''
    }

    return currentUser.value
  }

/* =========================================================
   INICIALIZAR AUTH
========================================================= */

const initializeAuth = async () => {
  if (authInitialized) {
    return
  }

  authInitialized = true

  isAuthLoading.value = true
  authError.value = ''

  try {
    const session =
      await getCurrentSession()

    authSession.value =
      session

    await buildCurrentUser(
      session
    )

    const {
      data
    } = onAuthStateChange(
      async (
        event,
        newSession
      ) => {
        authSession.value =
          newSession

        try {
          await buildCurrentUser(
            newSession
          )
        } catch (error) {
          console.error(
            'Error actualizando sesión:',
            error
          )

          currentUser.value =
            null
        }
      }
    )

    authSubscription =
      data?.subscription ||
      null

  } catch (error) {
    console.error(
      'Error inicializando autenticación:',
      error
    )

    currentUser.value = null
    authSession.value = null
    authProfile.value = null

    authError.value =
      error?.message ||
      'No se pudo comprobar la sesión.'
  } finally {
    isAuthLoading.value = false
  }
}

/* =========================================================
   LOGIN
========================================================= */

const login = async (
  email,
  password
) => {
  authError.value = ''

  isAuthLoading.value = true

  try {
    const data =
      await signInWithEmail(
        email,
        password
      )

    authSession.value =
      data.session

    await buildCurrentUser(
      data.session
    )

    return currentUser.value

  } catch (error) {
    console.error(
      'Error en login:',
      error
    )

    authError.value =
      translateAuthError(
        error
      )

    throw error

  } finally {
    isAuthLoading.value = false
  }
}

/* =========================================================
   LOGOUT
========================================================= */

const logout = async () => {
  authError.value = ''

  try {
    await signOutUser()

    currentUser.value = null
    authSession.value = null
    authProfile.value = null

  } catch (error) {
    authError.value =
      error?.message ||
      'No se pudo cerrar la sesión.'

    throw error
  }
}

/* =========================================================
   RECARGAR PERFIL
========================================================= */

const refreshCurrentUser =
  async () => {
    if (!authSession.value) {
      return null
    }

    return buildCurrentUser(
      authSession.value
    )
  }

/* =========================================================
   ERRORES
========================================================= */

const translateAuthError =
  error => {
    const message =
      String(
        error?.message ||
        ''
      ).toLowerCase()

    if (
      message.includes(
        'invalid login credentials'
      )
    ) {
      return (
        'Correo o contraseña incorrectos.'
      )
    }

    if (
      message.includes(
        'email not confirmed'
      )
    ) {
      return (
        'Debes confirmar tu correo antes de ingresar.'
      )
    }

    return (
      error?.message ||
      'No fue posible iniciar sesión.'
    )
  }

/* =========================================================
   COMPOSABLE
========================================================= */

export const useAuth = () => ({
  currentUser,

  authSession,

  authProfile,

  isAuthenticated,

  isTeacher,

  isStudent,

  isAuthLoading,

  authError,

  initializeAuth,

  login,

  logout,

  refreshCurrentUser
})
