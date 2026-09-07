<template>
  <div class="aula-layout">
    <!-- =====================================================
         ESTADO DE AUTENTICACIÓN
    ====================================================== -->
    <section v-if="isAuthLoading && !authReady" class="auth-screen">
      <div class="auth-loading">
        <div class="brand-mark">AMV</div>
        <div class="auth-spinner"></div>
        <strong>Preparando tu aula</strong>
        <span>Organizando tu experiencia de aprendizaje…</span>
      </div>
    </section>

    <!-- =====================================================
         LOGIN
    ====================================================== -->
    <section v-else-if="!isAuthenticated" class="login-screen">
      <div class="login-shell">
        <section class="login-brand-panel">
          <RouterLink to="/" class="login-brand">
            <div class="brand-mark brand-mark--large">AMV</div>
            <div>
              <strong>Amo Mi Voz</strong>
              <span>Academia de Talentos</span>
            </div>
          </RouterLink>

          <div class="login-copy">
            <span class="login-kicker">AULA VIRTUAL</span>
            <h1>
              Tu formación musical,
              <em>en un solo lugar.</em>
            </h1>
            <p>
              Clases, evaluaciones, repertorio, tareas, asistencia y seguimiento
              académico en una experiencia pensada para aprender sin distracciones.
            </p>
          </div>

          <div class="login-capabilities">
            <article>
              <AulaIcon name="program" />
              <div>
                <strong>Contenido ordenado</strong>
                <span>Unidades, clases y recursos siempre disponibles.</span>
              </div>
            </article>

            <article>
              <AulaIcon name="progress" />
              <div>
                <strong>Progreso visible</strong>
                <span>Evaluaciones, asistencia y seguimiento vocal.</span>
              </div>
            </article>

            <article>
              <AulaIcon name="tasks" />
              <div>
                <strong>Todo al día</strong>
                <span>Tareas y actividades reunidas en un solo espacio.</span>
              </div>
            </article>
          </div>

          <RouterLink to="/" class="login-back">
            ← Volver al sitio de Amo Mi Voz
          </RouterLink>
        </section>

        <section class="login-form-panel">
          <div class="login-card">
            <div class="login-card__header">
              <span class="eyebrow">PORTAL ACADÉMICO</span>
              <h2>Bienvenido de vuelta</h2>
              <p>Ingresa con las credenciales de tu cuenta.</p>
            </div>

            <form class="login-form" @submit.prevent="handleLogin">
              <label>
                <span>Correo electrónico</span>
                <input
                  v-model="email"
                  type="email"
                  autocomplete="email"
                  placeholder="nombre@correo.cl"
                  :disabled="isSubmitting"
                  required
                />
              </label>

              <label>
                <span>Contraseña</span>
                <div class="password-field">
                  <input
                    v-model="password"
                    :type="showPassword ? 'text' : 'password'"
                    autocomplete="current-password"
                    placeholder="Tu contraseña"
                    :disabled="isSubmitting"
                    required
                  />
                  <button type="button" @click="showPassword = !showPassword">
                    {{ showPassword ? 'Ocultar' : 'Ver' }}
                  </button>
                </div>
              </label>

              <button
                type="button"
                class="forgot-link"
                :disabled="isSendingReset"
                @click="handlePasswordReset"
              >
                {{ isSendingReset ? 'Enviando enlace…' : '¿Olvidaste tu contraseña?' }}
              </button>

              <div v-if="resetMessage" class="form-message form-message--success">
                <AulaIcon name="check" />
                <span>{{ resetMessage }}</span>
              </div>

              <div v-if="loginError" class="form-message form-message--error">
                <strong>!</strong>
                <span>{{ loginError }}</span>
              </div>

              <button type="submit" class="login-submit" :disabled="isSubmitting">
                <span>{{ isSubmitting ? 'Ingresando…' : 'Entrar al aula' }}</span>
                <AulaIcon v-if="!isSubmitting" name="arrow" />
                <span v-else class="button-spinner"></span>
              </button>
            </form>

            <div class="secure-note">
              <span>✓</span>
              <p>
                <strong>Acceso protegido.</strong>
                Tu sesión se administra con Supabase Auth.
              </p>
            </div>
          </div>

          <p class="login-help">¿Problemas para ingresar? Comunícate con la academia.</p>
        </section>
      </div>
    </section>

    <!-- =====================================================
         AULA AUTENTICADA
    ====================================================== -->
    <template v-else>
      <div
        v-if="mobileOpen"
        class="mobile-backdrop"
        @click="mobileOpen = false"
      ></div>

      <aside class="aula-sidebar" :class="{ 'is-open': mobileOpen }">
        <!-- BRAND -->
        <div class="sidebar-brand">
          <RouterLink
            to="/aula"
            class="sidebar-brand__link"
            @click="mobileOpen = false"
          >
            <div class="brand-mark brand-mark--sidebar">AMV</div>
            <div class="sidebar-brand__copy">
              <strong>Amo Mi Voz</strong>
              <span>Aula Virtual</span>
            </div>
          </RouterLink>

          <button
            class="sidebar-close"
            type="button"
            aria-label="Cerrar menú"
            @click="mobileOpen = false"
          >
            <AulaIcon name="close" />
          </button>
        </div>

        <!-- WORKSPACE -->
        <div class="workspace-card">
          <div class="workspace-card__icon">A</div>
          <div class="workspace-card__copy">
            <small>ESPACIO ACADÉMICO</small>
            <strong>Academia Amo Mi Voz</strong>
            <span><i></i> Plataforma activa</span>
          </div>
        </div>

        <!-- NAV -->
        <nav class="sidebar-nav" aria-label="Navegación del aula">
          <section
            v-for="group in navGroups"
            :key="group.label"
            class="sidebar-nav__group"
          >
            <p class="sidebar-nav__label">{{ group.label }}</p>

            <div class="sidebar-nav__items">
              <RouterLink
                v-for="item in group.items"
                :key="item.to"
                :to="item.to"
                class="sidebar-link"
                :class="{ 'is-active': isNavActive(item) }"
                active-class=""
                exact-active-class=""
                @click="mobileOpen = false"
              >
                <span class="sidebar-link__icon">
                  <AulaIcon :name="item.icon" />
                </span>

                <span class="sidebar-link__label">{{ item.label }}</span>

                <span v-if="item.badge" class="sidebar-link__badge">
                  {{ item.badge }}
                </span>

                <span v-if="isNavActive(item)" class="sidebar-link__active-dot"></span>
              </RouterLink>
            </div>
          </section>
        </nav>

        <!-- FOOTER -->
        <div class="sidebar-footer">
          <RouterLink to="/" class="sidebar-site-link">
            <span class="sidebar-site-link__icon">
              <AulaIcon name="external" />
            </span>
            <span>Ver sitio web</span>
          </RouterLink>

          <RouterLink to="/aula/cuenta" class="sidebar-profile">
            <div class="avatar avatar--sidebar">{{ initials }}</div>

            <div class="sidebar-profile__copy">
              <strong>{{ currentUser?.name }}</strong>
              <span>
                {{ roleLabel }}
                <template v-if="isStudent && currentUser?.voice">
                  · {{ currentUser.voice }}
                </template>
              </span>
            </div>

            <span class="sidebar-profile__chevron">›</span>
          </RouterLink>

          <button
            type="button"
            class="sidebar-logout"
            :disabled="isLoggingOut"
            @click="handleLogout"
          >
            <AulaIcon name="logout" />
            <span>{{ isLoggingOut ? 'Saliendo…' : 'Cerrar sesión' }}</span>
          </button>
        </div>
      </aside>

      <div class="aula-workspace">
        <!-- TOPBAR -->
        <header class="aula-topbar">
          <div class="topbar-left">
            <button
              class="mobile-menu"
              type="button"
              aria-label="Abrir menú"
              @click="mobileOpen = true"
            >
              <AulaIcon name="menu" />
            </button>

            <div class="breadcrumb">
              <span class="breadcrumb__root">Aula Virtual</span>
              <AulaIcon name="chevron" />
              <strong>{{ currentSection }}</strong>
            </div>
          </div>

          <div class="topbar-right">
            <div class="topbar-status">
              <span></span>
              Plataforma activa
            </div>

            <RouterLink to="/aula/cuenta" class="topbar-profile">
              <div class="avatar avatar--small">{{ initials }}</div>
              <div>
                <strong>{{ firstName }}</strong>
                <span>{{ roleLabel }}</span>
              </div>
            </RouterLink>
          </div>
        </header>

        <main class="aula-content">
          <RouterView />
        </main>

        <footer class="aula-footer">
          <span>© {{ new Date().getFullYear() }} Academia Amo Mi Voz</span>
          <span>Portal académico · versión SaaS</span>
        </footer>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink, RouterView, useRoute, useRouter } from 'vue-router'
import AulaIcon from '@/components/aula/AulaIcon.vue'
import { useAuth } from '@/composables/useAuth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const route = useRoute()

const {
  currentUser,
  isAuthenticated,
  isTeacher,
  isStudent,
  isAuthLoading,
  authError,
  initializeAuth,
  login,
  logout,
} = useAuth()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isSubmitting = ref(false)
const isLoggingOut = ref(false)
const localError = ref('')
const authReady = ref(false)
const resetMessage = ref('')
const isSendingReset = ref(false)
const mobileOpen = ref(false)

const loginError = computed(
  () => localError.value || authError.value || '',
)

const roleLabel = computed(() =>
  currentUser.value?.role === 'teacher' ? 'Profesor' : 'Estudiante',
)

const firstName = computed(() =>
  String(currentUser.value?.name || 'Usuario')
    .trim()
    .split(/\s+/)[0],
)

const initials = computed(() =>
  String(currentUser.value?.name || '?')
    .split(' ')
    .filter(Boolean)
    .map(word => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase(),
)

const teacherNav = [
  { label: 'Inicio', to: '/aula', icon: 'home', exact: true },
  { label: 'Centro del curso', to: '/aula/curso', icon: 'course' },
  { label: 'Calendario', to: '/aula/calendario', icon: 'calendar' },
  { label: 'Contenido', to: '/aula/programa-formativo', icon: 'program' },
  { label: 'Recursos', to: '/aula/recursos', icon: 'folder' },
  { label: 'Alumnos', to: '/aula/alumnos', icon: 'users' },
  { label: 'Inscripciones', to: '/aula/inscripciones', icon: 'inbox' },
  { label: 'Asistencia', to: '/aula/asistencia', icon: 'attendance' },
  { label: 'Calificaciones', to: '/aula/calificaciones', icon: 'grades' },
]

const studentNav = computed(() => [
  { label: 'Inicio', to: '/aula', icon: 'home', exact: true },
  { label: 'Mi curso', to: '/aula/curso', icon: 'course' },
  { label: 'Calendario', to: '/aula/calendario', icon: 'calendar' },
  { label: 'Contenido', to: '/aula/programa-formativo', icon: 'program' },
  { label: 'Recursos', to: '/aula/recursos', icon: 'folder' },
  { label: 'Mis tareas', to: '/aula/mis-tareas', icon: 'tasks' },
  { label: 'Mis evaluaciones', to: '/aula/evaluaciones', icon: 'grades' },
  ...(currentUser.value?.studentId
    ? [
        {
          label: 'Mi progreso',
          to: `/aula/estudiante/${currentUser.value.studentId}`,
          icon: 'progress',
        },
      ]
    : []),
])

const navGroups = computed(() =>
  [
    {
      label: 'APRENDIZAJE',
      items: isTeacher.value ? teacherNav.slice(0, 5) : studentNav.value.slice(0, 7),
    },
    {
      label: isTeacher.value ? 'GESTIÓN ACADÉMICA' : 'SEGUIMIENTO',
      items: isTeacher.value ? teacherNav.slice(5) : studentNav.value.slice(7),
    },
    {
      label: 'CUENTA',
      items: [{ label: 'Mi cuenta', to: '/aula/cuenta', icon: 'account' }],
    },
  ].filter(group => group.items.length),
)

const sectionNames = {
  aula: 'Inicio',
  'aula-curso': 'Centro del curso',
  'aula-calendario': 'Calendario',
  'aula-programa': 'Contenido del curso',
  'aula-crear-clase': 'Nueva clase',
  'aula-alumnos': 'Alumnos',
  'aula-estudiante': isStudent.value ? 'Mi progreso' : 'Perfil de estudiante',
  'aula-clase': 'Clase',
  'aula-editar-clase': 'Editar clase',
  'aula-trabajo': 'Trabajo de clase',
  'aula-tarea': 'Tarea',
  'aula-crear-tarea': 'Nueva tarea',
  'aula-editar-tarea': 'Editar tarea',
  'aula-entregas': 'Entregas',
  'aula-revisar-entrega': 'Revisar entrega',
  'aula-asistencia': 'Asistencia',
  'aula-calificaciones': 'Calificaciones',
  'aula-mis-tareas': 'Mis tareas',
  'aula-recursos': 'Recursos',
  'aula-publicar-recurso': 'Publicar recurso',
  'aula-inscriptions': 'Inscripciones',
  'aula-account': 'Mi cuenta',
  'aula-crear-evaluacion': 'Nueva evaluación',
  'aula-evaluacion': 'Evaluación',
  'aula-mis-evaluaciones': 'Mis evaluaciones',
  'aula-evaluacion-revision': 'Resultado de evaluación',
}

const isNavActive = item => {
  const currentPath = route.path.replace(/\/$/, '') || '/aula'
  const targetPath = String(item.to || '').replace(/\/$/, '') || '/aula'

  if (targetPath === '/aula') {
    return currentPath === '/aula'
  }

  return currentPath === targetPath
}

const currentSection = computed(
  () => sectionNames[route.name] || 'Aula Virtual',
)

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
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
      redirectTo: `${window.location.origin}/aula/cuenta`,
    })

    if (error) throw error

    resetMessage.value = 'Te enviamos un enlace para crear una nueva contraseña.'
  } catch (error) {
    console.error(error)
    localError.value = 'No fue posible enviar el correo de recuperación.'
  } finally {
    isSendingReset.value = false
  }
}

const handleLogin = async () => {
  if (!email.value || !password.value) {
    localError.value = 'Ingresa tu correo y contraseña.'
    return
  }

  isSubmitting.value = true
  localError.value = ''

  try {
    const user = await login(email.value, password.value)

    if (!user) {
      throw new Error('No se pudo cargar el perfil de esta cuenta.')
    }

    password.value = ''
    await router.push('/aula')
  } catch (error) {
    console.error(error)

    if (!authError.value) {
      localError.value = error?.message || 'No fue posible iniciar sesión.'
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleLogout = async () => {
  if (isLoggingOut.value) return

  isLoggingOut.value = true

  try {
    await logout()
    email.value = ''
    password.value = ''
    localError.value = ''
    mobileOpen.value = false
    await router.push('/aula')
  } catch (error) {
    console.error(error)
  } finally {
    isLoggingOut.value = false
  }
}

onMounted(async () => {
  try {
    await initializeAuth()
  } finally {
    authReady.value = true
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as v;

/* =========================================================
   TOKENS LOCALES
========================================================= */
.aula-layout {
  --sidebar-w: 286px;
  --navy-950: #0c1424;
  --navy-900: #101a2d;
  --navy-850: #142039;
  --navy-800: #18263f;
  --ink: #172033;
  --muted: #667085;
  --line: #dfe5ec;
  --wine: #9f1945;
  --wine-deep: #7d1237;
  --wine-soft: rgba(159, 25, 69, 0.16);
  --gold: #d9a91d;
  --green: #42c77a;

  min-height: 100vh;
  background: #f4f6f9;
  color: var(--ink);
}

/* =========================================================
   BRAND / LOADING
========================================================= */
.brand-mark {
  width: 42px;
  height: 42px;
  display: grid;
  place-items: center;
  border-radius: 12px;
  background: #111827;
  color: #fff;
  font-weight: 900;
  letter-spacing: 0.04em;
  box-shadow: 0 10px 24px rgba(17, 24, 39, 0.2);
}

.brand-mark--large {
  width: 52px;
  height: 52px;
  border-radius: 15px;
}

.brand-mark--sidebar {
  width: 44px;
  height: 44px;
  border-radius: 13px;
  background: linear-gradient(145deg, #0c1528, #111d33);
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.035),
    0 10px 24px rgba(0, 0, 0, 0.18);
}

.auth-screen {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: #f6f7f9;
}

.auth-loading {
  display: grid;
  justify-items: center;
  gap: 14px;
  color: var(--ink);
}

.auth-loading span {
  color: #697586;
  font-size: 0.92rem;
}

.auth-spinner,
.button-spinner {
  width: 22px;
  height: 22px;
  border: 2px solid #d9dee7;
  border-top-color: var(--wine);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* =========================================================
   LOGIN
========================================================= */
.login-screen {
  min-height: 100vh;
  padding: 24px;
  display: grid;
  place-items: center;
  background: #eef1f5;
}

.login-shell {
  width: min(1180px, 100%);
  min-height: 720px;
  display: grid;
  grid-template-columns: 1.08fr 0.92fr;
  overflow: hidden;
  border: 1px solid #dde2e8;
  border-radius: 24px;
  background: #fff;
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.12);
}

.login-brand-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 48px;
  color: #fff;
  background: linear-gradient(145deg, #101827 0%, #182233 60%, #25131a 100%);
}

.login-brand-panel::after {
  position: absolute;
  right: -180px;
  bottom: -190px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(214, 173, 50, 0.18), transparent 66%);
  content: '';
}

.login-brand {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 14px;
  align-items: center;
  color: #fff;
  text-decoration: none;
}

.login-brand strong,
.login-brand span {
  display: block;
}

.login-brand strong { font-size: 1.06rem; }
.login-brand span { color: #aeb8c6; font-size: 0.78rem; }

.login-copy {
  position: relative;
  z-index: 1;
  max-width: 610px;
  margin: auto 0 34px;
}

.login-kicker,
.eyebrow {
  display: inline-flex;
  color: #a9841e;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.15em;
}

.login-copy h1 {
  margin: 16px 0 20px;
  font-family: inherit;
  font-size: clamp(2.7rem, 5vw, 4.5rem);
  line-height: 1.03;
  letter-spacing: -0.045em;
}

.login-copy h1 em {
  display: block;
  color: #d6ad32;
  font-style: normal;
}

.login-copy p {
  max-width: 540px;
  margin: 0;
  color: #bdc5d1;
  font-size: 1.02rem;
  line-height: 1.75;
}

.login-capabilities {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.login-capabilities article {
  min-width: 0;
  padding: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.045);
}

.login-capabilities svg {
  margin-bottom: 12px;
  color: #d6ad32;
  font-size: 1.2rem;
}

.login-capabilities strong,
.login-capabilities span { display: block; }
.login-capabilities strong { font-size: 0.84rem; }
.login-capabilities span {
  margin-top: 4px;
  color: #95a1b1;
  font-size: 0.74rem;
  line-height: 1.45;
}

.login-back {
  position: relative;
  z-index: 1;
  margin-top: 26px;
  color: #98a4b4;
  font-size: 0.82rem;
  text-decoration: none;
}

.login-form-panel {
  display: grid;
  align-content: center;
  padding: 48px;
  background: #fbfcfd;
}

.login-card {
  width: min(430px, 100%);
  margin: auto;
  padding: 36px;
  border: 1px solid #e2e6eb;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 12px 35px rgba(15, 23, 42, 0.06);
}

.login-card__header h2 {
  margin: 9px 0 8px;
  color: var(--ink);
  font-family: inherit;
  font-size: 1.85rem;
  letter-spacing: -0.025em;
}

.login-card__header p {
  margin: 0 0 28px;
  color: #738092;
  font-size: 0.92rem;
}

.login-form { display: grid; gap: 17px; }
.login-form label > span {
  display: block;
  margin-bottom: 7px;
  color: #344054;
  font-size: 0.8rem;
  font-weight: 700;
}

.login-form input {
  width: 100%;
  height: 48px;
  padding: 0 13px;
  border: 1px solid #d9dee7;
  border-radius: 10px;
  outline: none;
  background: #fff;
  color: var(--ink);
  transition: 0.2s;
}

.login-form input:focus {
  border-color: var(--wine);
  box-shadow: 0 0 0 3px rgba(159, 25, 69, 0.09);
}

.password-field { position: relative; }
.password-field input { padding-right: 72px; }
.password-field button {
  position: absolute;
  top: 7px;
  right: 7px;
  height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  background: #f2f4f7;
  color: #475467;
  font-size: 0.72rem;
  font-weight: 700;
  cursor: pointer;
}

.forgot-link {
  justify-self: end;
  margin-top: -8px;
  border: 0;
  background: none;
  color: var(--wine);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
}

.form-message {
  display: flex;
  gap: 9px;
  align-items: flex-start;
  padding: 11px 12px;
  border-radius: 9px;
  font-size: 0.78rem;
  line-height: 1.45;
}
.form-message--success { background: #ecfdf3; color: #166534; }
.form-message--error { background: #fef2f2; color: #991b1b; }

.login-submit {
  height: 50px;
  display: flex;
  gap: 10px;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 10px;
  background: var(--wine);
  color: #fff;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 9px 22px rgba(159, 25, 69, 0.18);
}

.login-submit:hover { background: var(--wine-deep); }
.login-submit:disabled { opacity: 0.65; cursor: not-allowed; }
.login-submit .button-spinner {
  width: 18px;
  height: 18px;
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
}

.secure-note {
  margin-top: 24px;
  padding-top: 19px;
  display: flex;
  gap: 10px;
  align-items: flex-start;
  border-top: 1px solid #eef0f3;
  color: #667085;
  font-size: 0.76rem;
  line-height: 1.5;
}

.secure-note > span {
  width: 22px;
  height: 22px;
  display: grid;
  place-items: center;
  border-radius: 50%;
  background: #ecfdf3;
  color: #15803d;
  font-weight: 800;
}

.secure-note p { margin: 0; }
.secure-note strong { color: #344054; }
.login-help { color: #8691a1; font-size: 0.76rem; text-align: center; }

/* =========================================================
   PREMIUM SIDEBAR
========================================================= */
.aula-sidebar {
  position: fixed;
  inset: 0 auto 0 0;
  z-index: 100;
  width: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.065);
  background:
    radial-gradient(circle at 12% 8%, rgba(159, 25, 69, 0.08), transparent 28%),
    linear-gradient(180deg, #101b30 0%, #13213a 52%, #0d1729 100%);
  color: #fff;
  box-shadow: 14px 0 40px rgba(18, 30, 52, 0.08);
}

.sidebar-brand {
  min-height: 82px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.sidebar-brand__link {
  min-width: 0;
  display: flex;
  gap: 12px;
  align-items: center;
  color: #fff;
  text-decoration: none;
}

.sidebar-brand__copy {
  min-width: 0;
}

.sidebar-brand__copy strong,
.sidebar-brand__copy span {
  display: block;
  white-space: nowrap;
}

.sidebar-brand__copy strong {
  color: #f7f9fc;
  font-size: 0.93rem;
  font-weight: 750;
  letter-spacing: -0.01em;
}

.sidebar-brand__copy span {
  margin-top: 3px;
  color: #8391a7;
  font-size: 0.67rem;
}

.sidebar-close { display: none; }

.workspace-card {
  margin: 17px 14px 5px;
  padding: 11px 12px;
  display: grid;
  grid-template-columns: 34px minmax(0, 1fr);
  gap: 10px;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.075);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.042);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
}

.workspace-card__icon {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: linear-gradient(145deg, rgba(159, 25, 69, 0.55), rgba(115, 17, 50, 0.52));
  color: #fff;
  font-size: 0.72rem;
  font-weight: 900;
}

.workspace-card__copy { min-width: 0; }
.workspace-card__copy small,
.workspace-card__copy strong,
.workspace-card__copy span { display: block; }

.workspace-card__copy small {
  color: #74839b;
  font-size: 0.53rem;
  font-weight: 850;
  letter-spacing: 0.13em;
}

.workspace-card__copy strong {
  margin-top: 2px;
  overflow: hidden;
  color: #dce4ef;
  font-size: 0.71rem;
  font-weight: 650;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.workspace-card__copy span {
  margin-top: 4px;
  color: #7e8ba0;
  font-size: 0.58rem;
}

.workspace-card__copy span i {
  width: 6px;
  height: 6px;
  display: inline-block;
  margin-right: 5px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 3px rgba(66, 199, 122, 0.09);
  vertical-align: 1px;
}

.sidebar-nav {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 8px 10px 18px;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
}

.sidebar-nav::-webkit-scrollbar { width: 5px; }
.sidebar-nav::-webkit-scrollbar-track { background: transparent; }
.sidebar-nav::-webkit-scrollbar-thumb {
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.sidebar-nav__group + .sidebar-nav__group {
  margin-top: 14px;
}

.sidebar-nav__label {
  margin: 12px 10px 7px;
  color: #5f6f88;
  font-size: 0.56rem;
  font-weight: 850;
  letter-spacing: 0.16em;
}

.sidebar-nav__items {
  display: grid;
  gap: 3px;
}

.sidebar-link {
  position: relative;
  min-height: 44px;
  display: grid;
  grid-template-columns: 32px minmax(0, 1fr) auto auto;
  gap: 8px;
  align-items: center;
  padding: 0 10px;
  border: 1px solid transparent;
  border-radius: 11px;
  color: #9eabc0;
  font-size: 0.77rem;
  font-weight: 650;
  text-decoration: none;
  transition:
    background 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    transform 0.18s ease;
}

.sidebar-link:hover {
  border-color: rgba(255, 255, 255, 0.035);
  background: rgba(255, 255, 255, 0.045);
  color: #f8fafc;
}

.sidebar-link__icon {
  width: 31px;
  height: 31px;
  display: grid;
  place-items: center;
  border-radius: 9px;
  color: #8290a6;
  font-size: 1.02rem;
  transition: 0.18s ease;
}

.sidebar-link:hover .sidebar-link__icon {
  color: #c9d3e1;
}

.sidebar-link__label {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-link.is-active {
  border-color: rgba(159, 25, 69, 0.18);
  background: linear-gradient(90deg, rgba(159, 25, 69, 0.22), rgba(159, 25, 69, 0.08));
  color: #fff;
  box-shadow:
    inset 3px 0 0 var(--wine),
    0 8px 18px rgba(6, 12, 24, 0.08);
}

.sidebar-link.is-active .sidebar-link__icon {
  background: rgba(217, 169, 29, 0.08);
  color: #f4cf63;
}

.sidebar-link__active-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #f4cf63;
  box-shadow: 0 0 0 3px rgba(244, 207, 99, 0.08);
}

.sidebar-link__badge {
  min-width: 20px;
  height: 20px;
  display: grid;
  place-items: center;
  padding: 0 5px;
  border-radius: 999px;
  background: var(--wine);
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
}

.sidebar-footer {
  padding: 10px 11px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.065);
  background: rgba(6, 12, 23, 0.12);
}

.sidebar-site-link {
  min-height: 40px;
  display: flex;
  gap: 9px;
  align-items: center;
  padding: 0 10px;
  border-radius: 10px;
  color: #8290a6;
  font-size: 0.7rem;
  font-weight: 600;
  text-decoration: none;
  transition: 0.18s ease;
}

.sidebar-site-link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #fff;
}

.sidebar-site-link__icon {
  width: 28px;
  height: 28px;
  display: grid;
  place-items: center;
}

.sidebar-profile {
  margin-top: 6px;
  min-height: 61px;
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) 18px;
  gap: 10px;
  align-items: center;
  padding: 9px 10px;
  border: 1px solid rgba(255, 255, 255, 0.065);
  border-radius: 13px;
  background: rgba(255, 255, 255, 0.035);
  color: #fff;
  text-decoration: none;
  transition: 0.18s ease;
}

.sidebar-profile:hover {
  border-color: rgba(255, 255, 255, 0.11);
  background: rgba(255, 255, 255, 0.052);
}

.avatar {
  display: grid;
  place-items: center;
  background: var(--wine);
  color: #fff;
  font-weight: 850;
  letter-spacing: 0.02em;
}

.avatar--sidebar {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  background: linear-gradient(145deg, #ae2152, #82143a);
  font-size: 0.72rem;
  box-shadow: 0 8px 18px rgba(159, 25, 69, 0.16);
}

.sidebar-profile__copy { min-width: 0; }
.sidebar-profile__copy strong,
.sidebar-profile__copy span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-profile__copy strong {
  color: #edf2f8;
  font-size: 0.71rem;
  font-weight: 700;
}

.sidebar-profile__copy span {
  margin-top: 3px;
  color: #74839a;
  font-size: 0.6rem;
}

.sidebar-profile__chevron {
  color: #62718a;
  font-size: 1rem;
}

.sidebar-logout {
  width: 100%;
  min-height: 36px;
  margin-top: 5px;
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0 10px;
  border: 0;
  border-radius: 9px;
  background: transparent;
  color: #718099;
  font: inherit;
  font-size: 0.66rem;
  font-weight: 650;
  cursor: pointer;
  transition: 0.18s ease;
}

.sidebar-logout:hover {
  background: rgba(190, 72, 86, 0.09);
  color: #f0a6af;
}

.sidebar-logout:disabled { opacity: 0.55; cursor: wait; }

/* =========================================================
   WORKSPACE + TOPBAR
========================================================= */
.aula-workspace {
  min-height: 100vh;
  margin-left: var(--sidebar-w);
  display: flex;
  flex-direction: column;
}

.aula-topbar {
  position: sticky;
  top: 0;
  z-index: 60;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 clamp(20px, 3vw, 42px);
  border-bottom: 1px solid #e1e5ea;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 18px rgba(24, 39, 65, 0.025);
}

.topbar-left,
.topbar-right,
.breadcrumb,
.topbar-profile {
  display: flex;
  align-items: center;
}

.breadcrumb {
  gap: 8px;
  color: #98a2b3;
  font-size: 0.74rem;
}

.breadcrumb svg { font-size: 0.78rem; }
.breadcrumb strong { color: #27364a; font-weight: 750; }
.breadcrumb__root { color: #8a97a8; }

.topbar-right { gap: 15px; }

.topbar-status {
  display: flex;
  gap: 7px;
  align-items: center;
  color: #667085;
  font-size: 0.66rem;
  font-weight: 650;
}

.topbar-status > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #34b56f;
  box-shadow: 0 0 0 4px rgba(52, 181, 111, 0.08);
}

.topbar-profile {
  gap: 9px;
  padding: 5px 7px 5px 5px;
  border-radius: 11px;
  color: var(--ink);
  text-decoration: none;
  transition: 0.18s ease;
}

.topbar-profile:hover { background: #f3f5f8; }

.avatar--small {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  font-size: 0.65rem;
}

.topbar-profile strong,
.topbar-profile span { display: block; }
.topbar-profile strong { font-size: 0.72rem; }
.topbar-profile span {
  margin-top: 1px;
  color: #98a2b3;
  font-size: 0.6rem;
}

.mobile-menu { display: none; }

.aula-content {
  flex: 1;
  width: 100%;
  max-width: 1540px;
  margin: 0 auto;
  padding: 30px clamp(20px, 3.4vw, 52px) 48px;
}

.aula-footer {
  display: flex;
  justify-content: space-between;
  padding: 17px clamp(20px, 3.4vw, 52px);
  border-top: 1px solid #e1e5ea;
  background: #f8f9fb;
  color: #98a2b3;
  font-size: 0.64rem;
}

.mobile-backdrop { display: none; }

/* =========================================================
   RESPONSIVE
========================================================= */
@media (max-width: 980px) {
  .login-shell {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .login-brand-panel { padding: 34px; }
  .login-copy { margin: 72px 0 32px; }
  .login-copy h1 { font-size: clamp(2.4rem, 9vw, 4rem); }
  .login-capabilities { display: none; }
  .login-form-panel { padding: 30px 22px; }
  .login-card { padding: 28px; }

  .aula-sidebar {
    width: min(286px, 86vw);
    transform: translateX(-100%);
    transition: transform 0.24s ease;
    box-shadow: 20px 0 50px rgba(15, 23, 42, 0.2);
  }

  .aula-sidebar.is-open { transform: translateX(0); }

  .sidebar-close {
    width: 34px;
    height: 34px;
    margin-left: auto;
    display: grid;
    place-items: center;
    border: 0;
    border-radius: 9px;
    background: rgba(255, 255, 255, 0.06);
    color: #fff;
  }

  .mobile-backdrop {
    position: fixed;
    inset: 0;
    z-index: 90;
    display: block;
    background: rgba(15, 23, 42, 0.45);
    backdrop-filter: blur(2px);
  }

  .aula-workspace { margin-left: 0; }

  .mobile-menu {
    width: 38px;
    height: 38px;
    margin-right: 13px;
    display: grid;
    place-items: center;
    border: 1px solid #e0e5eb;
    border-radius: 9px;
    background: #fff;
    color: #344054;
  }

  .topbar-status { display: none; }
}

@media (max-width: 640px) {
  .login-screen { padding: 0; }
  .login-shell {
    min-height: 100vh;
    border: 0;
    border-radius: 0;
  }

  .login-brand-panel { padding: 26px 22px; }
  .login-copy { margin: 60px 0 12px; }
  .login-copy p { font-size: 0.92rem; }
  .login-back { margin-top: 30px; }
  .login-form-panel { padding: 25px 16px 36px; }
  .login-card { padding: 24px 20px; }

  .aula-topbar {
    height: 66px;
    padding: 0 16px;
  }

  .breadcrumb__root,
  .breadcrumb svg,
  .topbar-profile > div:last-child {
    display: none;
  }

  .aula-content { padding: 22px 14px 36px; }
  .aula-footer {
    display: block;
    padding: 14px 16px;
  }
  .aula-footer span:last-child { display: none; }
}
</style>
