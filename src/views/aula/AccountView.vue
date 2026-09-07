<template>
  <section class="account-page">
    <!-- =====================================================
         HERO · MI CUENTA
    ====================================================== -->
    <header class="account-hero">
      <div class="account-hero__identity">
        <div class="account-avatar" aria-hidden="true">
          {{ initials }}
        </div>

        <div>
          <span class="eyebrow">MI CUENTA · AULA VIRTUAL</span>

          <h1>{{ currentUser?.name || 'Mi cuenta' }}</h1>

          <p>
            Administra tu información de acceso, revisa los datos asociados
            a tu perfil y mantén segura tu cuenta del Aula Virtual.
          </p>

          <div class="account-hero__badges">
            <span class="role-badge">
              {{ roleLabel }}
            </span>

            <span
              v-if="isStudent && currentUser?.voice"
              class="voice-badge"
            >
              {{ currentUser.voice }}
            </span>

            <span class="status-badge">
              <i></i>
              Cuenta activa
            </span>
          </div>
        </div>
      </div>

      <div class="account-hero__security">
        <span class="account-hero__security-icon">✓</span>

        <div>
          <small>SESIÓN PROTEGIDA</small>
          <strong>Acceso seguro</strong>
          <span>Supabase Auth</span>
        </div>
      </div>
    </header>

    <!-- =====================================================
         RESUMEN
    ====================================================== -->
    <section class="account-summary" aria-label="Resumen de la cuenta">
      <article>
        <span class="summary-icon">ID</span>
        <div>
          <small>TIPO DE CUENTA</small>
          <strong>{{ roleLabel }}</strong>
          <p>{{ isTeacher ? 'Gestión académica' : 'Acceso de estudiante' }}</p>
        </div>
      </article>

      <article>
        <span class="summary-icon">✉</span>
        <div>
          <small>CORREO DE ACCESO</small>
          <strong class="summary-email">{{ currentUser?.email || 'Sin correo' }}</strong>
          <p>Correo asociado a tu inicio de sesión</p>
        </div>
      </article>

      <article>
        <span class="summary-icon">✓</span>
        <div>
          <small>ESTADO</small>
          <strong>Activa</strong>
          <p>Tu cuenta puede ingresar al Aula Virtual</p>
        </div>
      </article>

      <article>
        <span class="summary-icon">↻</span>
        <div>
          <small>ÚLTIMO ACCESO</small>
          <strong>{{ lastSignInLabel }}</strong>
          <p>Última autenticación registrada</p>
        </div>
      </article>
    </section>

    <!-- =====================================================
         NAVEGACIÓN INTERNA
    ====================================================== -->
    <nav class="account-tabs" aria-label="Secciones de Mi cuenta">
      <a href="#profile">Perfil</a>
      <a href="#academic">Información académica</a>
      <a href="#security">Seguridad</a>
    </nav>

    <!-- =====================================================
         PERFIL
    ====================================================== -->
    <section id="profile" class="account-section">
      <header class="section-header">
        <div class="section-heading">
          <span>01</span>

          <div>
            <small>INFORMACIÓN PERSONAL</small>
            <h2>Perfil de la cuenta</h2>
          </div>
        </div>

        <p>
          Estos datos identifican tu cuenta dentro de la plataforma.
        </p>
      </header>

      <div class="profile-grid">
        <article class="profile-card profile-card--identity">
          <div class="profile-card__top">
            <span class="profile-avatar">{{ initials }}</span>

            <div>
              <small>NOMBRE EN EL AULA</small>
              <strong>{{ currentUser?.name || 'Usuario' }}</strong>
              <span>{{ roleLabel }}</span>
            </div>
          </div>

          <p>
            Este es el nombre que aparece en las distintas áreas del Aula Virtual.
          </p>
        </article>

        <article class="profile-card">
          <small>CORREO ELECTRÓNICO</small>
          <strong>{{ currentUser?.email || 'Sin correo asociado' }}</strong>
          <p>
            Se utiliza para iniciar sesión y recibir comunicaciones de acceso.
          </p>

          <button
            v-if="currentUser?.email"
            type="button"
            class="text-button"
            @click="copyEmail"
          >
            {{ emailCopied ? 'Correo copiado ✓' : 'Copiar correo' }}
          </button>
        </article>

        <article class="profile-card">
          <small>IDENTIFICADOR DE CUENTA</small>
          <strong class="mono-value">{{ shortAccountId }}</strong>
          <p>
            Identificador técnico de tu cuenta. No necesitas memorizarlo.
          </p>
        </article>

        <article class="profile-card">
          <small>CUENTA CREADA</small>
          <strong>{{ createdAtLabel }}</strong>
          <p>
            Fecha de creación de tu acceso en la plataforma.
          </p>
        </article>
      </div>
    </section>

    <!-- =====================================================
         INFORMACIÓN ACADÉMICA
    ====================================================== -->
    <section id="academic" class="account-section">
      <header class="section-header">
        <div class="section-heading">
          <span>02</span>

          <div>
            <small>PERFIL ACADÉMICO</small>
            <h2>Tu relación con el Aula Virtual</h2>
          </div>
        </div>

        <p>
          La información académica disponible depende del tipo de cuenta.
        </p>
      </header>

      <div class="academic-card">
        <div class="academic-card__main">
          <span class="academic-card__icon">
            {{ isTeacher ? 'P' : 'E' }}
          </span>

          <div>
            <small>ROL ACTUAL</small>
            <h3>{{ roleLabel }}</h3>
            <p v-if="isTeacher">
              Puedes administrar clases, alumnos, inscripciones, asistencia,
              evaluaciones, recursos y calificaciones.
            </p>
            <p v-else>
              Tu cuenta está vinculada a tu experiencia de aprendizaje dentro
              del curso.
            </p>
          </div>
        </div>

        <div class="academic-details">
          <article>
            <span>ESPACIO</span>
            <strong>Academia Amo Mi Voz</strong>
          </article>

          <article v-if="isStudent">
            <span>CLASIFICACIÓN VOCAL</span>
            <strong>{{ currentUser?.voice || 'Sin registrar' }}</strong>
          </article>

          <article v-if="isStudent">
            <span>PERFIL DE ESTUDIANTE</span>
            <strong>{{ currentUser?.studentId ? 'Vinculado' : 'Pendiente' }}</strong>
          </article>

          <article v-if="isTeacher">
            <span>PERMISOS</span>
            <strong>Gestión académica</strong>
          </article>
        </div>

        <RouterLink
          v-if="isStudent && currentUser?.studentId"
          :to="`/aula/estudiante/${currentUser.studentId}`"
          class="academic-link"
        >
          Abrir mi perfil académico
          <span>→</span>
        </RouterLink>
      </div>
    </section>

    <!-- =====================================================
         SEGURIDAD
    ====================================================== -->
    <section id="security" class="account-section">
      <header class="section-header">
        <div class="section-heading">
          <span>03</span>

          <div>
            <small>SEGURIDAD</small>
            <h2>Acceso y contraseña</h2>
          </div>
        </div>

        <p>
          Mantén tus credenciales actualizadas y protege el acceso a tu cuenta.
        </p>
      </header>

      <div class="security-layout">
        <aside class="security-guide">
          <span class="security-guide__icon">✓</span>

          <div>
            <small>ACCESO PERSONAL</small>
            <h3>Tu contraseña es privada</h3>
            <p>
              La Academia Amo Mi Voz no puede ver tu contraseña. Utiliza una
              clave que no compartas con profesores, compañeros ni terceros.
            </p>
          </div>

          <div class="security-guide__tips">
            <article>
              <span>01</span>
              <p>Usa al menos 8 caracteres.</p>
            </article>

            <article>
              <span>02</span>
              <p>Evita reutilizar contraseñas de otros servicios.</p>
            </article>

            <article>
              <span>03</span>
              <p>Cámbiala si sospechas que alguien más la conoce.</p>
            </article>
          </div>
        </aside>

        <article class="password-card">
          <div class="password-card__header">
            <div>
              <span class="eyebrow">CAMBIAR CONTRASEÑA</span>
              <h3>Actualiza tu clave de acceso</h3>
              <p>
                Crea una contraseña nueva para tu cuenta.
              </p>
            </div>

            <span class="password-card__badge">Seguro</span>
          </div>

          <form
            class="password-form"
            @submit.prevent="changePassword"
          >
            <div class="form-field">
              <div class="field-heading">
                <label for="password">Nueva contraseña</label>
                <span>Obligatorio</span>
              </div>

              <div class="input-wrapper">
                <input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Escribe tu nueva contraseña"
                  @input="clearMessages"
                />

                <button
                  type="button"
                  class="show-button"
                  :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  @click="showPassword = !showPassword"
                >
                  {{ showPassword ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
            </div>

            <div class="form-field">
              <div class="field-heading">
                <label for="confirmation">Confirmar contraseña</label>
                <span>Verificación</span>
              </div>

              <div class="input-wrapper">
                <input
                  id="confirmation"
                  v-model="confirmation"
                  :type="showConfirmation ? 'text' : 'password'"
                  autocomplete="new-password"
                  placeholder="Repite tu nueva contraseña"
                  @input="clearMessages"
                />

                <button
                  type="button"
                  class="show-button"
                  :aria-label="showConfirmation ? 'Ocultar contraseña' : 'Mostrar contraseña'"
                  @click="showConfirmation = !showConfirmation"
                >
                  {{ showConfirmation ? 'Ocultar' : 'Mostrar' }}
                </button>
              </div>
            </div>

            <div class="requirements">
              <div
                class="requirement"
                :class="{ 'is-valid': passwordIsLongEnough }"
              >
                <span>{{ passwordIsLongEnough ? '✓' : '○' }}</span>
                Mínimo 8 caracteres
              </div>

              <div
                class="requirement"
                :class="{ 'is-valid': passwordsMatch }"
              >
                <span>{{ passwordsMatch ? '✓' : '○' }}</span>
                Las contraseñas coinciden
              </div>
            </div>

            <div
              v-if="errorMessage"
              class="message message--error"
              role="alert"
            >
              <span>!</span>
              <div>
                <strong>No pudimos actualizar la contraseña</strong>
                <p>{{ errorMessage }}</p>
              </div>
            </div>

            <div
              v-if="successMessage"
              class="message message--success"
              role="status"
            >
              <span>✓</span>
              <div>
                <strong>Contraseña actualizada</strong>
                <p>{{ successMessage }}</p>
              </div>
            </div>

            <button
              type="submit"
              class="submit-button"
              :disabled="!formIsValid || loading"
            >
              <span v-if="loading" class="button-spinner"></span>
              {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
              <span v-if="!loading">→</span>
            </button>
          </form>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
import {
  computed,
  onMounted,
  ref,
} from 'vue'

import {
  RouterLink,
} from 'vue-router'

import {
  supabase,
} from '@/lib/supabase'

import {
  useAuth,
} from '@/composables/useAuth'

const {
  currentUser,
  isTeacher,
  isStudent,
} = useAuth()

const password = ref('')
const confirmation = ref('')

const showPassword = ref(false)
const showConfirmation = ref(false)

const loading = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

const authUser = ref(null)
const emailCopied = ref(false)

const passwordIsLongEnough = computed(() => {
  return password.value.length >= 8
})

const passwordsMatch = computed(() => {
  return (
    confirmation.value.length > 0 &&
    password.value === confirmation.value
  )
})

const formIsValid = computed(() => {
  return passwordIsLongEnough.value &&
    passwordsMatch.value
})

const roleLabel = computed(() => {
  return isTeacher.value
    ? 'Profesor'
    : 'Estudiante'
})

const initials = computed(() => {
  return String(
    currentUser.value?.name ||
    'Usuario'
  )
    .split(/\s+/)
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()
})

const shortAccountId = computed(() => {
  const id =
    currentUser.value?.authId ||
    authUser.value?.id ||
    ''

  if (!id) {
    return 'No disponible'
  }

  return `${String(id).slice(0, 8)}…${String(id).slice(-4)}`
})

const createdAtLabel = computed(() => {
  return formatAuthDate(
    authUser.value?.created_at,
    'No disponible'
  )
})

const lastSignInLabel = computed(() => {
  return formatAuthDate(
    authUser.value?.last_sign_in_at,
    'Sesión actual'
  )
})

function formatAuthDate(value, fallback) {
  if (!value) {
    return fallback
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return fallback
  }

  return new Intl.DateTimeFormat(
    'es-CL',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )
    .format(date)
    .replace('.', '')
}

function clearMessages() {
  errorMessage.value = ''
  successMessage.value = ''
}

async function loadAccountDetails() {
  try {
    const {
      data,
      error,
    } =
      await supabase.auth.getUser()

    if (error) {
      throw error
    }

    authUser.value =
      data?.user ||
      null
  } catch (error) {
    console.error(
      'Error cargando datos de la cuenta:',
      error
    )
  }
}

async function copyEmail() {
  const email =
    currentUser.value?.email

  if (!email) {
    return
  }

  try {
    await navigator.clipboard.writeText(email)

    emailCopied.value = true

    window.setTimeout(() => {
      emailCopied.value = false
    }, 1800)
  } catch (error) {
    console.error(
      'No fue posible copiar el correo:',
      error
    )
  }
}

async function changePassword() {
  clearMessages()

  if (!formIsValid.value) {
    errorMessage.value =
      'Revisa que la contraseña tenga al menos 8 caracteres y que ambas coincidan.'

    return
  }

  try {
    loading.value = true

    const {
      error,
    } =
      await supabase.auth.updateUser({
        password:
          password.value,
      })

    if (error) {
      throw error
    }

    password.value = ''
    confirmation.value = ''

    successMessage.value =
      'Tu nueva contraseña quedó guardada correctamente.'
  } catch (error) {
    console.error(
      'Error al cambiar contraseña:',
      error
    )

    errorMessage.value =
      error?.message ||
      'Ocurrió un problema al actualizar la contraseña.'
  } finally {
    loading.value = false
  }
}

onMounted(loadAccountDetails)
</script>

<style scoped>
.account-page {
  --ink: #152033;
  --ink-soft: #344359;
  --muted: #6f7c8f;
  --muted-2: #8b98aa;
  --line: #dbe3ec;
  --line-strong: #cbd6e2;
  --surface: #ffffff;
  --surface-soft: #f7f9fc;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-dark: #987000;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #edf8f3;
  --danger: #be4856;
  --danger-soft: #fff3f5;

  width: min(1180px, calc(100% - 40px));
  margin-inline: auto;
  padding: 42px 0 80px;
  color: var(--ink);
}

/* =====================================================
   HERO
===================================================== */

.account-hero {
  position: relative;
  display: flex;
  gap: 32px;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 30px 32px;
  border: 1px solid var(--line);
  border-radius: 22px;
  background:
    radial-gradient(
      circle at 90% 8%,
      rgba(217, 169, 29, 0.13),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      #ffffff 0%,
      #fbfcfe 65%,
      #fffaf0 100%
    );
  box-shadow:
    0 14px 36px
    rgba(31, 48, 73, 0.055);
}

.account-hero::before {
  position: absolute;
  top: 0;
  left: 0;
  width: 125px;
  height: 3px;
  content: '';
  background:
    linear-gradient(
      90deg,
      var(--wine),
      var(--gold)
    );
}

.account-hero__identity {
  display: flex;
  gap: 21px;
  align-items: center;
  min-width: 0;
}

.account-avatar {
  display: grid;
  width: 76px;
  height: 76px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e4c967;
  border-radius: 20px;
  color: #775900;
  background:
    linear-gradient(
      145deg,
      #fffaf0,
      #f8e6aa
    );
  box-shadow:
    0 10px 24px
    rgba(217, 169, 29, 0.1);
  font-size: 1.12rem;
  font-weight: 900;
}

.eyebrow {
  display: inline-block;
  color: var(--gold-dark);
  font-size: 0.61rem;
  font-weight: 900;
  letter-spacing: 0.15em;
}

.account-hero h1 {
  margin: 6px 0 10px;
  color: var(--ink);
  font-size:
    clamp(2.15rem, 4.6vw, 3.55rem);
  line-height: 0.98;
  letter-spacing: -0.045em;
}

.account-hero__identity p {
  max-width: 680px;
  margin: 0;
  color: var(--muted);
  font-size: 0.83rem;
  line-height: 1.65;
}

.account-hero__badges {
  display: flex;
  gap: 7px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.role-badge,
.voice-badge,
.status-badge {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  padding: 7px 10px;
  border-radius: 999px;
  font-size: 0.59rem;
  font-weight: 850;
}

.role-badge {
  border: 1px solid #d7e0e9;
  color: #536276;
  background: #fff;
}

.voice-badge {
  border: 1px solid #e5d194;
  color: #7e5e00;
  background: var(--gold-soft);
}

.status-badge {
  border: 1px solid #c7dfd1;
  color: var(--green);
  background: var(--green-soft);
}

.status-badge i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--green);
}

.account-hero__security {
  display: flex;
  gap: 11px;
  align-items: center;
  flex: 0 0 auto;
  min-width: 190px;
  padding: 14px;
  border: 1px solid #d3e5db;
  border-radius: 14px;
  background:
    rgba(255, 255, 255, 0.72);
}

.account-hero__security-icon {
  display: grid;
  width: 37px;
  height: 37px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 11px;
  color: #fff;
  background: var(--green);
  font-size: 0.7rem;
  font-weight: 900;
}

.account-hero__security small,
.account-hero__security strong,
.account-hero__security span {
  display: block;
}

.account-hero__security small {
  color: #668a76;
  font-size: 0.45rem;
  font-weight: 900;
  letter-spacing: 0.11em;
}

.account-hero__security strong {
  margin: 2px 0;
  color: #285f44;
  font-size: 0.69rem;
}

.account-hero__security div > span {
  color: var(--muted);
  font-size: 0.56rem;
}

/* =====================================================
   SUMMARY
===================================================== */

.account-summary {
  display: grid;
  grid-template-columns:
    repeat(4, minmax(0, 1fr));
  gap: 12px;
  margin-top: 16px;
}

.account-summary article {
  display: flex;
  min-width: 0;
  min-height: 108px;
  gap: 12px;
  align-items: flex-start;
  padding: 17px;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: #fff;
  box-shadow:
    0 7px 20px
    rgba(31, 48, 73, 0.03);
}

.summary-icon {
  display: grid;
  width: 34px;
  height: 34px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 10px;
  color: var(--gold-dark);
  background: var(--gold-soft);
  font-size: 0.55rem;
  font-weight: 900;
}

.account-summary small,
.account-summary strong,
.account-summary p {
  display: block;
}

.account-summary small {
  color: var(--muted-2);
  font-size: 0.46rem;
  font-weight: 850;
  letter-spacing: 0.09em;
}

.account-summary strong {
  overflow: hidden;
  margin-top: 4px;
  color: var(--ink);
  font-size: 0.72rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.account-summary p {
  margin: 5px 0 0;
  color: var(--muted);
  font-size: 0.57rem;
  line-height: 1.4;
}

.summary-email {
  max-width: 180px;
}

/* =====================================================
   TABS
===================================================== */

.account-tabs {
  position: sticky;
  top: 70px;
  z-index: 7;
  display: flex;
  gap: 4px;
  margin: 16px 0 34px;
  padding: 7px;
  overflow-x: auto;
  border: 1px solid var(--line);
  border-radius: 14px;
  background:
    rgba(255, 255, 255, 0.95);
  box-shadow:
    0 8px 22px
    rgba(31, 48, 73, 0.045);
  backdrop-filter: blur(10px);
}

.account-tabs a {
  flex: 0 0 auto;
  padding: 9px 13px;
  border-radius: 9px;
  color: #627186;
  font-size: 0.67rem;
  font-weight: 800;
  text-decoration: none;
}

.account-tabs a:hover {
  color: var(--wine);
  background: #fff5f8;
}

/* =====================================================
   SECTION
===================================================== */

.account-section {
  margin-bottom: 38px;
  scroll-margin-top: 145px;
}

.section-header {
  display: flex;
  gap: 22px;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 17px;
}

.section-heading {
  display: flex;
  gap: 12px;
  align-items: center;
}

.section-heading > span {
  display: grid;
  width: 39px;
  height: 39px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #ead17d;
  border-radius: 50%;
  color: var(--gold-dark);
  background: var(--gold-soft);
  font-size: 0.58rem;
  font-weight: 900;
}

.section-heading small {
  display: block;
  margin-bottom: 3px;
  color: var(--gold-dark);
  font-size: 0.53rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.section-heading h2 {
  margin: 0;
  color: var(--ink);
  font-size:
    clamp(1.45rem, 2.6vw, 2rem);
  letter-spacing: -0.03em;
}

.section-header > p {
  max-width: 410px;
  margin: 0;
  color: var(--muted);
  font-size: 0.69rem;
  line-height: 1.55;
  text-align: right;
}

/* =====================================================
   PROFILE
===================================================== */

.profile-grid {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.profile-card {
  min-width: 0;
  min-height: 150px;
  padding: 20px;
  border: 1px solid var(--line);
  border-radius: 17px;
  background: #fff;
  box-shadow:
    0 8px 23px
    rgba(31, 48, 73, 0.035);
}

.profile-card--identity {
  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(217, 169, 29, 0.08),
      transparent 40%
    ),
    #fff;
}

.profile-card__top {
  display: flex;
  gap: 13px;
  align-items: center;
}

.profile-avatar {
  display: grid;
  width: 47px;
  height: 47px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e6cf82;
  border-radius: 13px;
  color: #7b5c00;
  background: var(--gold-soft);
  font-size: 0.72rem;
  font-weight: 900;
}

.profile-card small,
.profile-card strong,
.profile-card__top span {
  display: block;
}

.profile-card small {
  color: var(--gold-dark);
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.09em;
}

.profile-card strong {
  overflow-wrap: anywhere;
  margin-top: 7px;
  color: var(--ink);
  font-size: 0.84rem;
}

.profile-card__top strong {
  margin-top: 2px;
}

.profile-card__top div > span {
  margin-top: 2px;
  color: var(--muted);
  font-size: 0.61rem;
}

.profile-card p {
  max-width: 480px;
  margin: 10px 0 0;
  color: var(--muted);
  font-size: 0.65rem;
  line-height: 1.55;
}

.text-button {
  margin-top: 12px;
  padding: 0;
  border: 0;
  color: var(--wine);
  background: transparent;
  font: inherit;
  font-size: 0.62rem;
  font-weight: 850;
  cursor: pointer;
}

.mono-value {
  font-family:
    ui-monospace,
    SFMono-Regular,
    Menlo,
    Monaco,
    Consolas,
    monospace;
  letter-spacing: 0.01em;
}

/* =====================================================
   ACADEMIC
===================================================== */

.academic-card {
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 18px;
  background:
    radial-gradient(
      circle at 92% 8%,
      rgba(217, 169, 29, 0.09),
      transparent 32%
    ),
    #fff;
  box-shadow:
    0 9px 25px
    rgba(31, 48, 73, 0.04);
}

.academic-card__main {
  display: flex;
  gap: 15px;
  align-items: flex-start;
  padding-bottom: 20px;
  border-bottom: 1px solid #e8edf3;
}

.academic-card__icon {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e4c75c;
  border-radius: 13px;
  color: #775800;
  background: var(--gold-soft);
  font-size: 0.74rem;
  font-weight: 900;
}

.academic-card__main small {
  color: var(--gold-dark);
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.academic-card__main h3 {
  margin: 3px 0 5px;
  color: var(--ink);
  font-size: 1.1rem;
}

.academic-card__main p {
  max-width: 720px;
  margin: 0;
  color: var(--muted);
  font-size: 0.68rem;
  line-height: 1.55;
}

.academic-details {
  display: grid;
  grid-template-columns:
    repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin-top: 17px;
}

.academic-details article {
  min-height: 82px;
  padding: 14px;
  border: 1px solid #e3e8ee;
  border-radius: 12px;
  background: #f8fafc;
}

.academic-details span,
.academic-details strong {
  display: block;
}

.academic-details span {
  color: var(--muted-2);
  font-size: 0.46rem;
  font-weight: 900;
  letter-spacing: 0.08em;
}

.academic-details strong {
  margin-top: 5px;
  color: var(--ink-soft);
  font-size: 0.69rem;
}

.academic-link {
  display: inline-flex;
  gap: 7px;
  align-items: center;
  margin-top: 18px;
  color: var(--wine);
  font-size: 0.65rem;
  font-weight: 850;
  text-decoration: none;
}

/* =====================================================
   SECURITY
===================================================== */

.security-layout {
  display: grid;
  grid-template-columns:
    minmax(270px, 0.72fr)
    minmax(0, 1.28fr);
  gap: 14px;
}

.security-guide,
.password-card {
  border: 1px solid var(--line);
  border-radius: 18px;
  background: #fff;
  box-shadow:
    0 9px 25px
    rgba(31, 48, 73, 0.04);
}

.security-guide {
  padding: 22px;
}

.security-guide__icon {
  display: grid;
  width: 43px;
  height: 43px;
  margin-bottom: 19px;
  place-items: center;
  border-radius: 13px;
  color: #fff;
  background: var(--green);
  font-size: 0.72rem;
  font-weight: 900;
}

.security-guide small {
  color: var(--gold-dark);
  font-size: 0.49rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.security-guide h3 {
  margin: 4px 0 8px;
  color: var(--ink);
  font-size: 1.15rem;
}

.security-guide > div > p {
  margin: 0;
  color: var(--muted);
  font-size: 0.67rem;
  line-height: 1.62;
}

.security-guide__tips {
  display: grid;
  gap: 9px;
  margin-top: 20px;
  padding-top: 18px;
  border-top: 1px solid #e8edf3;
}

.security-guide__tips article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 9px;
  align-items: center;
}

.security-guide__tips article > span {
  display: grid;
  width: 26px;
  height: 26px;
  place-items: center;
  border-radius: 8px;
  color: var(--gold-dark);
  background: var(--gold-soft);
  font-size: 0.49rem;
  font-weight: 900;
}

.security-guide__tips p {
  margin: 0;
  color: var(--muted);
  font-size: 0.61rem;
  line-height: 1.45;
}

.password-card {
  padding: 24px;
}

.password-card__header {
  display: flex;
  gap: 18px;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 21px;
}

.password-card__header h3 {
  margin: 4px 0 6px;
  color: var(--ink);
  font-size: 1.3rem;
  letter-spacing: -0.025em;
}

.password-card__header p {
  margin: 0;
  color: var(--muted);
  font-size: 0.67rem;
}

.password-card__badge {
  padding: 6px 9px;
  border-radius: 999px;
  color: var(--green);
  background: var(--green-soft);
  font-size: 0.5rem;
  font-weight: 900;
}

.password-form {
  display: grid;
  gap: 17px;
}

.form-field {
  display: grid;
  gap: 7px;
}

.field-heading {
  display: flex;
  gap: 10px;
  justify-content: space-between;
}

.form-field label {
  color: var(--ink-soft);
  font-size: 0.72rem;
  font-weight: 800;
}

.field-heading > span {
  color: var(--muted-2);
  font-size: 0.51rem;
}

.input-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  border-radius: 11px;
  background: #fbfcfe;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: #aec0d3;
  background: #fff;
  box-shadow:
    0 0 0 4px
    rgba(63, 111, 168, 0.08);
}

.input-wrapper input {
  width: 100%;
  min-width: 0;
  min-height: 49px;
  padding: 0 14px;
  border: 0;
  outline: 0;
  color: var(--ink);
  background: transparent;
  font: inherit;
}

.input-wrapper input::placeholder {
  color: #9aa6b7;
}

.show-button {
  min-width: 84px;
  padding: 0 13px;
  border: 0;
  border-left: 1px solid #e1e7ed;
  color: var(--wine);
  background: transparent;
  font: inherit;
  font-size: 0.64rem;
  font-weight: 850;
  cursor: pointer;
}

.requirements {
  display: grid;
  grid-template-columns:
    repeat(2, minmax(0, 1fr));
  gap: 8px;
  padding: 13px;
  border: 1px solid #e3e8ee;
  border-radius: 11px;
  background: #f8fafc;
}

.requirement {
  display: flex;
  gap: 7px;
  align-items: center;
  color: #7f8a99;
  font-size: 0.64rem;
}

.requirement span {
  display: grid;
  width: 19px;
  height: 19px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 0.45rem;
}

.requirement.is-valid {
  color: var(--green);
}

.message {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 12px 13px;
  border-radius: 11px;
}

.message > span {
  display: grid;
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  font-size: 0.55rem;
  font-weight: 900;
}

.message strong,
.message p {
  display: block;
}

.message strong {
  font-size: 0.66rem;
}

.message p {
  margin: 3px 0 0;
  font-size: 0.61rem;
  line-height: 1.45;
}

.message--error {
  border: 1px solid #efcbd1;
  background: var(--danger-soft);
}

.message--error > span {
  background: var(--danger);
}

.message--error strong,
.message--error p {
  color: #98404d;
}

.message--success {
  border: 1px solid #c8e2d3;
  background: var(--green-soft);
}

.message--success > span {
  background: var(--green);
}

.message--success strong,
.message--success p {
  color: #286747;
}

.submit-button {
  display: inline-flex;
  min-height: 47px;
  gap: 8px;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--wine);
  border-radius: 10px;
  color: #fff;
  background: var(--wine);
  font: inherit;
  font-size: 0.67rem;
  font-weight: 900;
  cursor: pointer;
  box-shadow:
    0 8px 20px
    rgba(159, 25, 69, 0.15);
}

.submit-button:hover:not(:disabled) {
  background: var(--wine-dark);
  transform: translateY(-1px);
}

.submit-button:disabled {
  border-color: #d8dee5;
  color: #98a3b0;
  background: #edf1f5;
  box-shadow: none;
  cursor: not-allowed;
}

.button-spinner {
  width: 14px;
  height: 14px;
  border: 2px solid
    rgba(255, 255, 255, 0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* =====================================================
   RESPONSIVE
===================================================== */

@media (max-width: 980px) {
  .account-summary {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }

  .security-layout {
    grid-template-columns: 1fr;
  }

  .academic-details {
    grid-template-columns:
      repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 760px) {
  .account-page {
    width:
      min(100% - 28px, 1180px);
    padding: 28px 0 55px;
  }

  .account-hero {
    align-items: flex-start;
    flex-direction: column;
    padding: 23px;
  }

  .account-hero__security {
    width: 100%;
  }

  .section-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .section-header > p {
    max-width: none;
    text-align: left;
  }

  .profile-grid,
  .account-summary,
  .academic-details,
  .requirements {
    grid-template-columns: 1fr;
  }

  .account-tabs {
    top: 58px;
  }
}

@media (max-width: 520px) {
  .account-hero__identity {
    align-items: flex-start;
  }

  .account-avatar {
    width: 60px;
    height: 60px;
    border-radius: 16px;
  }

  .password-card,
  .security-guide,
  .academic-card,
  .profile-card {
    padding: 18px;
  }

  .input-wrapper {
    grid-template-columns: 1fr;
  }

  .show-button {
    min-height: 38px;
    border-top: 1px solid #e1e7ed;
    border-left: 0;
    text-align: left;
  }
}
</style>
