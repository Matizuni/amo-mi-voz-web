<template>
  <div class="aula-layout">

    <!-- =====================================================
         CARGANDO AUTENTICACIÓN
    ====================================================== -->

    <section
      v-if="isAuthLoading && !authReady"
      class="auth-screen"
    >
      <div class="auth-loading">
        <div class="auth-loading__logo">
          AMV
        </div>

        <div class="auth-spinner"></div>

        <strong>
          Preparando tu aula...
        </strong>

        <span>
          Academia de Talentos Amo Mi Voz
        </span>
      </div>
    </section>

    <!-- =====================================================
         LOGIN
    ====================================================== -->

    <section
      v-else-if="!isAuthenticated"
      class="login-screen"
    >
      <div class="login-screen__background">
        <span class="login-screen__note login-screen__note--1">
          ♪
        </span>

        <span class="login-screen__note login-screen__note--2">
          ♫
        </span>

        <span class="login-screen__note login-screen__note--3">
          ♩
        </span>
      </div>

      <div class="login">

        <!-- PRESENTACIÓN -->

        <section class="login__presentation">

          <RouterLink
            to="/"
            class="login__brand"
          >
            <div class="login__brand-logo">
              AMV
            </div>

            <div>
              <strong>
                Amo Mi Voz
              </strong>

              <span>
                Academia de Talentos
              </span>
            </div>
          </RouterLink>

          <div class="login__hero">

            <p class="login__eyebrow">
              AULA VIRTUAL
            </p>

            <h1>
              Tu música continúa
              <span>fuera de la sala.</span>
            </h1>

            <p class="login__description">
              Accede a tus clases, repertorio,
              materiales, tareas, evaluaciones
              y seguimiento vocal desde un solo lugar.
            </p>

            <div class="login__features">

              <article>
                <span>01</span>

                <div>
                  <strong>
                    Formación musical
                  </strong>

                  <p>
                    Clases, contenidos y material
                    pedagógico organizado.
                  </p>
                </div>
              </article>

              <article>
                <span>02</span>

                <div>
                  <strong>
                    Seguimiento vocal
                  </strong>

                  <p>
                    Tesitura, asistencia,
                    evaluaciones y progreso.
                  </p>
                </div>
              </article>

              <article>
                <span>03</span>

                <div>
                  <strong>
                    Repertorio
                  </strong>

                  <p>
                    Audios, partituras y recursos
                    disponibles para estudiar.
                  </p>
                </div>
              </article>

            </div>

          </div>

          <RouterLink
            to="/"
            class="login__site-link"
          >
            ← Volver al sitio web
          </RouterLink>

        </section>

        <!-- FORMULARIO -->

        <section class="login__panel">

          <div class="login-card">

            <div class="login-card__header">
              <span>
                ACCESO PRIVADO
              </span>

              <h2>
                Iniciar sesión
              </h2>

              <p>
                Ingresa con la cuenta asignada
                por la Academia Amo Mi Voz.
              </p>
            </div>

            <form
              class="login-form"
              @submit.prevent="handleLogin"
            >

              <div class="login-form__group">

                <label for="email">
                  Correo electrónico
                </label>

                <input
                  id="email"
                  v-model.trim="email"
                  type="email"
                  autocomplete="email"
                  placeholder="tu@correo.cl"
                  :disabled="isSubmitting"
                  required
                >

              </div>

              <div class="login-form__group">

                <div class="login-form__label-row">
  <label for="password">
    Contraseña
  </label>

  <button
    type="button"
    class="login-form__forgot"
    :disabled="isSendingReset"
    @click="handlePasswordReset"
  >
    {{
      isSendingReset
        ? 'Enviando...'
        : '¿Olvidaste tu contraseña?'
    }}
  </button>
</div>

                <div class="password-field">

                  <input
                    id="password"
                    v-model="password"
                    :type="
                      showPassword
                        ? 'text'
                        : 'password'
                    "
                    autocomplete="current-password"
                    placeholder="Tu contraseña"
                    :disabled="isSubmitting"
                    required
                  >

                  <button
                    type="button"
                    class="password-field__toggle"
                    :disabled="isSubmitting"
                    @click="
                      showPassword =
                        !showPassword
                    "
                  >
                    {{
                      showPassword
                        ? 'Ocultar'
                        : 'Ver'
                    }}
                  </button>

                </div>

              </div>

              <div
  v-if="resetMessage"
  class="login-form__success"
>
  <span>✓</span>

  <p>
    {{ resetMessage }}
  </p>
</div>

              <div
                v-if="loginError"
                class="login-form__error"
              >
                <span>!</span>

                <p>
                  {{ loginError }}
                </p>
              </div>

              <button
                type="submit"
                class="login-form__submit"
                :disabled="isSubmitting"
              >
                <template v-if="isSubmitting">
                  <span class="button-spinner"></span>
                  Ingresando...
                </template>

                <template v-else>
                  Entrar al aula
                  <span>→</span>
                </template>
              </button>

            </form>

            <div class="login-card__security">
              <span class="login-card__security-icon">
                ✓
              </span>

              <div>
                <strong>
                  Acceso protegido
                </strong>

                <p>
                  Tu sesión es administrada de forma
                  segura mediante Supabase Auth.
                </p>
              </div>
            </div>

          </div>

          <p class="login__help">
            Si tienes problemas para ingresar,
            comunícate con tu profesor.
          </p>

        </section>

      </div>
    </section>

    <!-- =====================================================
         AULA AUTENTICADA
    ====================================================== -->

    <template v-else>

      <!-- HEADER -->

      <header class="aula-header">

        <RouterLink
          to="/aula"
          class="aula-header__brand"
        >
          <div class="aula-header__logo">
            AMV
          </div>

          <div class="aula-header__brand-text">
            <strong>
              Amo Mi Voz
            </strong>

            <span>
              Aula Virtual
            </span>
          </div>
        </RouterLink>

        <!-- NAVEGACIÓN ESCRITORIO -->

        <nav class="aula-header__nav">

          <RouterLink
            to="/aula"
            exact-active-class="is-active"
          >
            Inicio
          </RouterLink>

          <RouterLink
            to="/aula/programa-formativo"
            active-class="is-active"
          >
            Programa
          </RouterLink>

          <RouterLink
            to="/aula/recursos"
            active-class="is-active"
          >
            Recursos
          </RouterLink>

          <!-- ALUMNO -->

          <RouterLink
            v-if="isStudent"
            to="/aula/mis-tareas"
            active-class="is-active"
          >
            Mis tareas
          </RouterLink>

          <RouterLink
            v-if="
              isStudent &&
              currentUser?.studentId
            "
            :to="
              `/aula/estudiante/${currentUser.studentId}`
            "
            active-class="is-active"
          >
            Mi progreso
          </RouterLink>

          <!-- PROFESOR -->

          <RouterLink
  v-if="isTeacher"
  to="/aula/alumnos"
  active-class="is-active"
>
  Alumnos
</RouterLink>

<RouterLink
  v-if="isTeacher"
  to="/aula/inscripciones"
  active-class="is-active"
>
  Inscripciones
</RouterLink>

<RouterLink
  v-if="isTeacher"
  to="/aula/asistencia"
  active-class="is-active"
>
  Asistencia
</RouterLink>

          <RouterLink
            v-if="isTeacher"
            to="/aula/calificaciones"
            active-class="is-active"
          >
            Calificaciones
          </RouterLink>

          <RouterLink
  to="/aula/cuenta"
  active-class="is-active"
>
  Mi cuenta
</RouterLink>

        </nav>

        <!-- USUARIO -->

        <div class="aula-user">

          <div class="aula-user__info">

            <span>
              {{ roleLabel }}
            </span>

            <strong>
              {{ currentUser?.name }}
            </strong>

            <small
              v-if="
                isStudent &&
                currentUser?.voice
              "
            >
              {{ currentUser.voice }}
            </small>

          </div>

          <div class="aula-user__avatar">
            {{ initials }}
          </div>

          <RouterLink
  to="/aula/cuenta"
  active-class="is-active"
>
  Mi cuenta
</RouterLink>

          <button
            type="button"
            class="aula-user__logout"
            :disabled="isLoggingOut"
            @click="handleLogout"
          >
            {{
              isLoggingOut
                ? 'Saliendo...'
                : 'Cerrar sesión'
            }}
          </button>

        </div>

      </header>

      <!-- BARRA SECUNDARIA -->

      <section class="aula-toolbar">

        <div>

          <span class="aula-toolbar__status">
            <i></i>
            Sesión activa
          </span>

          <span class="aula-toolbar__separator">
            /
          </span>

          <span>
            {{ roleLabel }}
          </span>

          <template
            v-if="
              isStudent &&
              currentUser?.voice
            "
          >
            <span class="aula-toolbar__separator">
              /
            </span>

            <span class="aula-toolbar__voice">
              {{ currentUser.voice }}
            </span>
          </template>

        </div>

        <RouterLink
          to="/"
          class="back-to-site"
        >
          ← Sitio web
        </RouterLink>

      </section>

      <!-- NAVEGACIÓN MÓVIL -->

      <nav class="aula-mobile-nav">

        <RouterLink
          to="/aula"
          exact-active-class="is-active"
        >
          Inicio
        </RouterLink>

        <RouterLink
          to="/aula/programa-formativo"
          active-class="is-active"
        >
          Programa
        </RouterLink>

        <RouterLink
          to="/aula/recursos"
          active-class="is-active"
        >
          Recursos
        </RouterLink>

        <RouterLink
          v-if="isStudent"
          to="/aula/mis-tareas"
          active-class="is-active"
        >
          Mis tareas
        </RouterLink>

        <RouterLink
          v-if="
            isStudent &&
            currentUser?.studentId
          "
          :to="
            `/aula/estudiante/${currentUser.studentId}`
          "
          active-class="is-active"
        >
          Mi progreso
        </RouterLink>

        <RouterLink
  v-if="isTeacher"
  to="/aula/alumnos"
  active-class="is-active"
>
  Alumnos
</RouterLink>

<RouterLink
  v-if="isTeacher"
  to="/aula/inscripciones"
  active-class="is-active"
>
  Inscripciones
</RouterLink>

<RouterLink
  v-if="isTeacher"
  to="/aula/asistencia"
  active-class="is-active"
>
  Asistencia
</RouterLink>

        <button
          type="button"
          class="aula-mobile-nav__logout"
          @click="handleLogout"
        >
          Salir
        </button>

      </nav>

      <!-- CONTENIDO -->

      <main class="aula-layout__content">
        <RouterView />
      </main>

    </template>

  </div>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref
} from 'vue'

import {
  RouterLink,
  RouterView,
  useRouter
} from 'vue-router'

import {
  useAuth
} from '@/composables/useAuth'

import { supabase } from '@/lib/supabase'

/* =========================================================
   ROUTER
========================================================= */

const router = useRouter()

/* =========================================================
   AUTH
========================================================= */

const {
  currentUser,
  isAuthenticated,
  isTeacher,
  isStudent,
  isAuthLoading,
  authError,
  initializeAuth,
  login,
  logout
} = useAuth()

/* =========================================================
   ESTADO LOCAL
========================================================= */

const email = ref('')

const password = ref('')

const showPassword = ref(false)

const isSubmitting = ref(false)

const isLoggingOut = ref(false)

const localError = ref('')
const authReady = ref(false)

const resetMessage = ref('')
const isSendingReset = ref(false)

/* =========================================================
   ERROR
========================================================= */

const loginError = computed(() =>
  localError.value ||
  authError.value ||
  ''
)

/* =========================================================
   ROL
========================================================= */

const roleLabel = computed(() => {
  if (!currentUser.value) {
    return ''
  }

  return currentUser.value.role ===
    'teacher'
    ? 'Profesor'
    : 'Estudiante'
})

/* =========================================================
   INICIALES
========================================================= */

const initials = computed(() => {
  const name =
    currentUser.value?.name

  if (!name) {
    return '?'
  }

  return name
    .split(' ')
    .filter(Boolean)
    .map(
      word =>
        word.charAt(0)
    )
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const handlePasswordReset = async () => {
  localError.value = ''
  resetMessage.value = ''

  if (!email.value) {
    localError.value =
      'Escribe primero tu correo electrónico para recuperar tu contraseña.'
    return
  }

  isSendingReset.value = true

  try {
    const { error } =
      await supabase.auth.resetPasswordForEmail(
        email.value,
        {
          redirectTo: `${window.location.origin}/aula/cuenta`
        }
      )

    if (error) {
      throw error
    }

    resetMessage.value =
      'Te enviamos un correo con el enlace para crear una nueva contraseña.'
  } catch (error) {
    console.error(
      'Error enviando recuperación:',
      error
    )

    localError.value =
      'No fue posible enviar el correo de recuperación.'
  } finally {
    isSendingReset.value = false
  }
}

/* =========================================================
   LOGIN
========================================================= */

const handleLogin = async () => {
  if (
    !email.value ||
    !password.value
  ) {
    localError.value =
      'Ingresa tu correo y contraseña.'

    return
  }

  isSubmitting.value = true

  localError.value = ''

  try {
    const user =
      await login(
        email.value,
        password.value
      )

    if (!user) {
      throw new Error(
        'No se pudo cargar el perfil de esta cuenta.'
      )
    }

    password.value = ''

    await router.push('/aula')

  } catch (error) {
    console.error(
      'Error iniciando sesión:',
      error
    )

    if (!authError.value) {
      localError.value =
        error?.message ||
        'No fue posible iniciar sesión.'
    }

  } finally {
    isSubmitting.value = false
  }
}

/* =========================================================
   LOGOUT
========================================================= */

const handleLogout = async () => {
  if (isLoggingOut.value) {
    return
  }

  isLoggingOut.value = true

  try {
    await logout()

    email.value = ''
    password.value = ''
    localError.value = ''

    await router.push('/aula')

  } catch (error) {
    console.error(
      'Error cerrando sesión:',
      error
    )
  } finally {
    isLoggingOut.value = false
  }
}

/* =========================================================
   INICIALIZAR
========================================================= */

onMounted(async () => {
  try {
    await initializeAuth()
  } finally {
    authReady.value = true
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as variables;

/* =========================================================
   GENERAL
========================================================= */

.aula-layout {
  min-height: 100vh;
  background:
    variables.$color-background;
  color:
    variables.$color-white;
}

/* =========================================================
   AUTH LOADING
========================================================= */

.auth-screen {
  display: grid;
  min-height: 100vh;
  place-items: center;
  padding:
    variables.$spacing-xl;
}

.auth-loading {
  display: grid;
  gap:
    variables.$spacing-md;
  justify-items: center;
  text-align: center;
}

.auth-loading__logo {
  display: grid;
  width: 78px;
  height: 78px;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
  font-family:
    variables.$font-family-heading;
  font-weight:
    variables.$font-weight-bold;
}

.auth-loading span {
  opacity: 0.45;
}

.auth-spinner {
  width: 32px;
  height: 32px;
  border:
    3px solid
    variables.$color-border;
  border-top-color:
    variables.$color-primary;
  border-radius: 50%;
  animation:
    spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =========================================================
   LOGIN
========================================================= */

.login-screen {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
}

.login-screen__background {
  position: fixed;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

.login-screen__background::before {
  position: absolute;
  width: 650px;
  height: 650px;
  top: -300px;
  right: -200px;
  border-radius: 50%;
  background:
    rgba(
      variables.$color-primary,
      0.08
    );
  content: '';
  filter: blur(20px);
}

.login-screen__background::after {
  position: absolute;
  width: 450px;
  height: 450px;
  bottom: -280px;
  left: -180px;
  border-radius: 50%;
  background:
    rgba(
      variables.$color-primary,
      0.05
    );
  content: '';
}

.login-screen__note {
  position: absolute;
  color:
    variables.$color-primary;
  font-family: serif;
  opacity: 0.035;
  user-select: none;
}

.login-screen__note--1 {
  top: 8%;
  left: 42%;
  font-size: 16rem;
  transform: rotate(-15deg);
}

.login-screen__note--2 {
  right: 4%;
  bottom: 5%;
  font-size: 22rem;
  transform: rotate(10deg);
}

.login-screen__note--3 {
  bottom: 8%;
  left: 3%;
  font-size: 12rem;
}

/* =========================================================
   LOGIN LAYOUT
========================================================= */

.login {
  position: relative;
  z-index: 2;
  display: grid;
  min-height: 100vh;
  grid-template-columns:
    minmax(0, 1.15fr)
    minmax(420px, 0.85fr);
}

.login__presentation {
  display: flex;
  flex-direction: column;
  justify-content:
    space-between;
  padding:
    clamp(2rem, 5vw, 5rem);
}

.login__brand {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  width: fit-content;
  color:
    variables.$color-white;
  text-decoration: none;
}

.login__brand-logo {
  display: grid;
  width: 58px;
  height: 58px;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
  font-family:
    variables.$font-family-heading;
  font-size: 0.95rem;
  font-weight:
    variables.$font-weight-bold;
}

.login__brand strong,
.login__brand span {
  display: block;
}

.login__brand strong {
  font-size: 1.1rem;
}

.login__brand span {
  margin-top: 3px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   HERO LOGIN
========================================================= */

.login__hero {
  max-width: 760px;
  padding:
    variables.$spacing-3xl
    0;
}

.login__eyebrow {
  margin:
    0 0
    variables.$spacing-md;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-bold;
  letter-spacing: 0.18em;
}

.login__hero h1 {
  max-width: 720px;
  margin:
    0 0
    variables.$spacing-xl;
  font-size:
    clamp(
      3.4rem,
      7vw,
      7.5rem
    );
  line-height: 0.9;
}

.login__hero h1 span {
  display: block;
  color:
    variables.$color-primary;
}

.login__description {
  max-width: 650px;
  margin:
    0 0
    variables.$spacing-2xl;
  font-size: 1.05rem;
  line-height: 1.8;
  opacity: 0.65;
}

/* =========================================================
   FEATURES
========================================================= */

.login__features {
  display: grid;
  gap:
    variables.$spacing-sm;
  max-width: 650px;
}

.login__features article {
  display: grid;
  gap:
    variables.$spacing-md;
  grid-template-columns:
    42px 1fr;
  padding:
    variables.$spacing-md
    0;
  border-top:
    1px solid
    variables.$color-border;
}

.login__features article > span {
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  font-weight:
    variables.$font-weight-bold;
}

.login__features strong {
  display: block;
  margin-bottom: 3px;
}

.login__features p {
  margin: 0;
  font-size:
    variables.$font-size-sm;
  opacity: 0.45;
}

.login__site-link {
  width: fit-content;
  color:
    variables.$color-white;
  font-size:
    variables.$font-size-sm;
  text-decoration: none;
  opacity: 0.45;
}

.login__site-link:hover {
  color:
    variables.$color-primary;
  opacity: 1;
}

/* =========================================================
   PANEL LOGIN
========================================================= */

.login__panel {
  display: flex;
  align-items: center;
  justify-content: center;
  padding:
    variables.$spacing-xl;
  border-left:
    1px solid
    variables.$color-border;
  background:
    rgba(
      variables.$color-surface,
      0.58
    );
  backdrop-filter:
    blur(20px);
  flex-direction: column;
}

.login-card {
  width: 100%;
  max-width: 480px;
  padding:
    clamp(
      1.5rem,
      4vw,
      3rem
    );
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-background;
  box-shadow:
    0 30px 80px
    rgba(0, 0, 0, 0.3);
}

.login-card__header {
  margin-bottom:
    variables.$spacing-2xl;
}

.login-card__header > span {
  display: block;
  margin-bottom:
    variables.$spacing-sm;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
  font-weight:
    variables.$font-weight-bold;
  letter-spacing: 0.15em;
}

.login-card__header h2 {
  margin:
    0 0
    variables.$spacing-sm;
  font-size:
    clamp(
      2rem,
      4vw,
      3rem
    );
}

.login-card__header p {
  margin: 0;
  line-height: 1.6;
  opacity: 0.5;
}

/* =========================================================
   FORM
========================================================= */

.login-form {
  display: grid;
  gap:
    variables.$spacing-lg;
}

.login-form__group {
  display: grid;
  gap:
    variables.$spacing-sm;
}

.login-form label {
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
}

.login-form input {
  width: 100%;
  padding:
    0.95rem
    1rem;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  outline: none;
  background:
    variables.$color-surface;
  color:
    variables.$color-white;
  font: inherit;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.login-form input:focus {
  border-color:
    variables.$color-primary;
  box-shadow:
    0 0 0 3px
    rgba(
      variables.$color-primary,
      0.1
    );
}

.login-form input::placeholder {
  color:
    variables.$color-white;
  opacity: 0.25;
}

.password-field {
  position: relative;
}

.password-field input {
  padding-right: 90px;
}

.password-field__toggle {
  position: absolute;
  top: 50%;
  right: 10px;
  padding: 5px 8px;
  border: 0;
  background: transparent;
  color:
    variables.$color-primary;
  font: inherit;
  font-size:
    variables.$font-size-xs;
  cursor: pointer;
  transform:
    translateY(-50%);
}

.login-form__error {
  display: flex;
  gap:
    variables.$spacing-sm;
  align-items: flex-start;
  padding:
    variables.$spacing-md;
  border:
    1px solid
    rgba(220, 70, 70, 0.45);
  border-radius:
    variables.$radius-lg;
  background:
    rgba(220, 70, 70, 0.08);
}

.login-form__error span {
  display: grid;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: #d94d4d;
  font-size:
    variables.$font-size-xs;
  font-weight: bold;
}

.login-form__error p {
  margin: 2px 0 0;
  font-size:
    variables.$font-size-sm;
}

.login-form__submit {
  display: flex;
  gap:
    variables.$spacing-sm;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  padding:
    variables.$spacing-md
    variables.$spacing-lg;
  border:
    1px solid
    variables.$color-primary;
  border-radius:
    variables.$radius-lg;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
  font: inherit;
  font-weight:
    variables.$font-weight-bold;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.login-form__submit:hover:not(:disabled) {
  transform:
    translateY(-2px);
}

.login-form__submit:disabled {
  cursor: wait;
  opacity: 0.65;
}

.button-spinner {
  width: 18px;
  height: 18px;
  border:
    2px solid
    rgba(255, 255, 255, 0.3);
  border-top-color:
    variables.$color-white;
  border-radius: 50%;
  animation:
    spin 0.7s linear infinite;
}

/* =========================================================
   SECURITY
========================================================= */

.login-card__security {
  display: flex;
  gap:
    variables.$spacing-sm;
  margin-top:
    variables.$spacing-xl;
  padding-top:
    variables.$spacing-lg;
  border-top:
    1px solid
    variables.$color-border;
}

.login-card__security-icon {
  display: grid;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-xs;
}

.login-card__security strong {
  display: block;
  margin-bottom: 3px;
  font-size:
    variables.$font-size-sm;
}

.login-card__security p {
  margin: 0;
  font-size:
    variables.$font-size-xs;
  line-height: 1.5;
  opacity: 0.4;
}

.login__help {
  max-width: 480px;
  margin:
    variables.$spacing-lg
    auto 0;
  font-size:
    variables.$font-size-xs;
  text-align: center;
  opacity: 0.35;
}

/* =========================================================
   HEADER
========================================================= */

.aula-header {
  position: sticky;
  top: 0;
  z-index: 100;
  display: grid;
  grid-template-columns:
    auto 1fr auto;
  gap:
    variables.$spacing-xl;
  align-items: center;
  min-height: 82px;
  padding:
    variables.$spacing-md
    variables.$spacing-xl;
  border-bottom:
    1px solid
    variables.$color-border;
  background:
    rgba(
      variables.$color-background,
      0.96
    );
  backdrop-filter:
    blur(16px);
}

.aula-header__brand {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
  color:
    variables.$color-white;
  text-decoration: none;
}

.aula-header__logo {
  display: grid;
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background:
    variables.$color-primary;
  color:
    variables.$color-white;
  font-family:
    variables.$font-family-heading;
  font-size: 0.9rem;
  font-weight:
    variables.$font-weight-bold;
}

.aula-header__brand-text strong,
.aula-header__brand-text span {
  display: block;
}

.aula-header__brand-text span {
  margin-top: 3px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
}

/* =========================================================
   NAV
========================================================= */

.aula-header__nav {
  display: flex;
  gap:
    variables.$spacing-xl;
  align-items: center;
  justify-content: center;
}

.aula-header__nav a {
  position: relative;
  padding:
    variables.$spacing-sm 0;
  color:
    variables.$color-white;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
  opacity: 0.6;
  transition:
    color 0.2s ease,
    opacity 0.2s ease;
}

.aula-header__nav a::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  height: 2px;
  border-radius: 999px;
  background:
    variables.$color-primary;
  content: '';
  opacity: 0;
  transform:
    scaleX(0);
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.aula-header__nav a:hover,
.aula-header__nav a.is-active {
  color:
    variables.$color-primary;
  opacity: 1;
}

.aula-header__nav a.is-active::after {
  opacity: 1;
  transform:
    scaleX(1);
}

/* =========================================================
   USER
========================================================= */

.aula-user {
  display: flex;
  gap:
    variables.$spacing-md;
  align-items: center;
}

.aula-user__info {
  min-width: 110px;
  text-align: right;
}

.aula-user__info span,
.aula-user__info strong,
.aula-user__info small {
  display: block;
}

.aula-user__info span {
  margin-bottom: 3px;
  color:
    variables.$color-primary;
  font-size:
    variables.$font-size-sm;
}

.aula-user__info small {
  margin-top: 3px;
  opacity: 0.5;
}

.aula-user__avatar {
  display: grid;
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  place-items: center;
  border:
    1px solid
    variables.$color-primary;
  border-radius: 50%;
  background:
    variables.$color-surface;
  color:
    variables.$color-primary;
  font-weight:
    variables.$font-weight-semibold;
}

.aula-user__logout {
  padding:
    variables.$spacing-sm
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius:
    variables.$radius-lg;
  background: transparent;
  color:
    variables.$color-white;
  font: inherit;
  font-size:
    variables.$font-size-xs;
  cursor: pointer;
}

.aula-user__logout:hover {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
}

/* =========================================================
   TOOLBAR
========================================================= */

.aula-toolbar {
  display: flex;
  gap:
    variables.$spacing-lg;
  align-items: center;
  justify-content:
    space-between;
  padding:
    variables.$spacing-sm
    variables.$spacing-xl;
  border-bottom:
    1px solid
    variables.$color-border;
  background:
    variables.$color-surface;
  font-size:
    variables.$font-size-xs;
}

.aula-toolbar > div {
  display: flex;
  gap:
    variables.$spacing-sm;
  align-items: center;
}

.aula-toolbar__status {
  display: flex;
  gap: 7px;
  align-items: center;
  color:
    variables.$color-primary;
}

.aula-toolbar__status i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background:
    variables.$color-primary;
}

.aula-toolbar__separator {
  opacity: 0.2;
}

.aula-toolbar__voice {
  color:
    variables.$color-primary;
}

.back-to-site {
  color:
    variables.$color-white;
  text-decoration: none;
  opacity: 0.45;
}

.back-to-site:hover {
  color:
    variables.$color-primary;
  opacity: 1;
}

/* =========================================================
   MOBILE NAV
========================================================= */

.aula-mobile-nav {
  display: none;
  gap:
    variables.$spacing-sm;
  padding:
    variables.$spacing-sm
    variables.$spacing-md;
  overflow-x: auto;
  border-bottom:
    1px solid
    variables.$color-border;
  background:
    variables.$color-background;
}

.aula-mobile-nav a,
.aula-mobile-nav__logout {
  flex-shrink: 0;
  padding:
    variables.$spacing-sm
    variables.$spacing-md;
  border:
    1px solid
    variables.$color-border;
  border-radius: 999px;
  background: transparent;
  color:
    variables.$color-white;
  font: inherit;
  font-size:
    variables.$font-size-sm;
  font-weight:
    variables.$font-weight-semibold;
  text-decoration: none;
  opacity: 0.65;
}

.aula-mobile-nav a.is-active {
  border-color:
    variables.$color-primary;
  color:
    variables.$color-primary;
  opacity: 1;
}

.aula-mobile-nav__logout {
  cursor: pointer;
}

/* =========================================================
   CONTENT
========================================================= */

.aula-layout__content {
  min-height:
    calc(100vh - 130px);
  padding:
    variables.$spacing-3xl
    variables.$spacing-xl;
}

/* =========================================================
   RESPONSIVE
========================================================= */

@media (max-width: 1100px) {
  .aula-header__nav {
    gap:
      variables.$spacing-md;
  }

  .aula-user__logout {
    display: none;
  }
}

@media (max-width: 900px) {
  .login {
    grid-template-columns: 1fr;
  }

  .login__presentation {
    min-height: auto;
  }

  .login__panel {
    border-top:
      1px solid
      variables.$color-border;
    border-left: 0;
    padding:
      variables.$spacing-2xl
      variables.$spacing-md;
  }

  .login__hero {
    padding:
      variables.$spacing-3xl 0;
  }

  .login__features {
    display: none;
  }

  .aula-header {
    grid-template-columns:
      1fr auto;
  }

  .aula-header__nav {
    display: none;
  }

  .aula-mobile-nav {
    display: flex;
  }
}

@media (max-width: 650px) {
  .login__presentation {
    padding:
      variables.$spacing-xl
      variables.$spacing-md;
  }

  .login__hero h1 {
    font-size:
      clamp(
        3rem,
        15vw,
        5rem
      );
  }

  .aula-header {
    min-height: 72px;
    padding:
      variables.$spacing-md;
  }

  .aula-header__logo {
    width: 42px;
    height: 42px;
  }

  .aula-user__info {
    display: none;
  }

  .aula-toolbar {
    padding:
      variables.$spacing-sm
      variables.$spacing-md;
  }

  .aula-layout__content {
    padding:
      variables.$spacing-xl
      variables.$spacing-md;
  }
}

@media (max-width: 420px) {
  .aula-header__brand-text strong {
    font-size: 0.9rem;
  }

  .aula-header__brand-text span {
    font-size: 0.75rem;
  }

  .login-card {
    padding:
      variables.$spacing-lg;
  }
}

.login-form__label-row {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.login-form__forgot {
  padding: 0;
  border: 0;
  background: transparent;
  color: variables.$color-primary;
  font: inherit;
  font-size: variables.$font-size-xs;
  font-weight: variables.$font-weight-semibold;
  cursor: pointer;
}

.login-form__forgot:hover {
  text-decoration: underline;
}

.login-form__forgot:disabled {
  cursor: wait;
  opacity: 0.5;
}

.login-form__success {
  display: flex;
  gap: variables.$spacing-sm;
  align-items: flex-start;
  padding: variables.$spacing-md;
  border:
    1px solid
    rgba(223, 185, 47, 0.35);
  border-radius: variables.$radius-lg;
  background:
    rgba(223, 185, 47, 0.07);
  color: variables.$color-white;
}

.login-form__success span {
  display: grid;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  place-items: center;
  border-radius: 50%;
  background: variables.$color-primary;
  color: #090909;
  font-size: variables.$font-size-xs;
  font-weight: bold;
}

.login-form__success p {
  margin: 2px 0 0;
  font-size: variables.$font-size-sm;
  line-height: 1.5;
}

</style>
