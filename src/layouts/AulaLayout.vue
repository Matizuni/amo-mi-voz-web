<template>
  <div class="aula-layout">
    <section v-if="isAuthLoading && !authReady" class="auth-screen">
      <div class="auth-loading">
        <div class="brand-mark">AMV</div>
        <div class="auth-spinner"></div>
        <strong>Preparando tu aula</strong>
        <span>Organizando tu experiencia de aprendizaje…</span>
      </div>
    </section>

    <section v-else-if="!isAuthenticated" class="login-screen">
      <div class="login-shell">
        <section class="login-brand-panel">
          <RouterLink to="/" class="login-brand">
            <div class="brand-mark brand-mark--large">AMV</div>
            <div><strong>Amo Mi Voz</strong><span>Academia de Talentos</span></div>
          </RouterLink>

          <div class="login-copy">
            <span class="login-kicker">AULA VIRTUAL</span>
            <h1>Tu formación musical, <em>en un solo lugar.</em></h1>
            <p>Clases, evaluaciones, repertorio, tareas, asistencia y seguimiento académico en una experiencia pensada para aprender sin distracciones.</p>
          </div>

          <div class="login-capabilities">
            <article><AulaIcon name="program"/><div><strong>Contenido ordenado</strong><span>Unidades, clases y recursos siempre disponibles.</span></div></article>
            <article><AulaIcon name="progress"/><div><strong>Progreso visible</strong><span>Evaluaciones, asistencia y seguimiento vocal.</span></div></article>
            <article><AulaIcon name="tasks"/><div><strong>Todo al día</strong><span>Tareas y actividades reunidas en un solo espacio.</span></div></article>
          </div>

          <RouterLink to="/" class="login-back">← Volver al sitio de Amo Mi Voz</RouterLink>
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
                <input v-model="email" type="email" autocomplete="email" placeholder="nombre@correo.cl" :disabled="isSubmitting" required>
              </label>

              <label>
                <span>Contraseña</span>
                <div class="password-field">
                  <input v-model="password" :type="showPassword ? 'text' : 'password'" autocomplete="current-password" placeholder="Tu contraseña" :disabled="isSubmitting" required>
                  <button type="button" @click="showPassword = !showPassword">{{ showPassword ? 'Ocultar' : 'Ver' }}</button>
                </div>
              </label>

              <button type="button" class="forgot-link" :disabled="isSendingReset" @click="handlePasswordReset">
                {{ isSendingReset ? 'Enviando enlace…' : '¿Olvidaste tu contraseña?' }}
              </button>

              <div v-if="resetMessage" class="form-message form-message--success"><AulaIcon name="check"/><span>{{ resetMessage }}</span></div>
              <div v-if="loginError" class="form-message form-message--error"><strong>!</strong><span>{{ loginError }}</span></div>

              <button type="submit" class="login-submit" :disabled="isSubmitting">
                <span>{{ isSubmitting ? 'Ingresando…' : 'Entrar al aula' }}</span>
                <AulaIcon v-if="!isSubmitting" name="arrow"/>
                <span v-else class="button-spinner"></span>
              </button>
            </form>

            <div class="secure-note"><span>✓</span><p><strong>Acceso protegido.</strong> Tu sesión se administra con Supabase Auth.</p></div>
          </div>
          <p class="login-help">¿Problemas para ingresar? Comunícate con la academia.</p>
        </section>
      </div>
    </section>

    <template v-else>
      <div v-if="mobileOpen" class="mobile-backdrop" @click="mobileOpen = false"></div>

      <aside class="aula-sidebar" :class="{ 'is-open': mobileOpen }">
        <div class="sidebar-brand">
          <RouterLink to="/aula" class="sidebar-brand__link" @click="mobileOpen = false">
            <div class="brand-mark">AMV</div>
            <div><strong>Amo Mi Voz</strong><span>Aula Virtual</span></div>
          </RouterLink>
          <button class="sidebar-close" type="button" aria-label="Cerrar menú" @click="mobileOpen = false"><AulaIcon name="close"/></button>
        </div>

        <div class="workspace-chip"><span class="workspace-chip__dot"></span><div><small>ESPACIO ACTIVO</small><strong>Academia Amo Mi Voz</strong></div></div>

        <nav class="sidebar-nav" aria-label="Navegación del aula">
          <template v-for="group in navGroups" :key="group.label">
            <p class="sidebar-nav__label">{{ group.label }}</p>
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
              <AulaIcon :name="item.icon"/>
              <span>{{ item.label }}</span>
              <span v-if="item.badge" class="sidebar-link__badge">{{ item.badge }}</span>
            </RouterLink>
          </template>
        </nav>

        <div class="sidebar-footer">
          <RouterLink to="/" class="sidebar-site-link"><AulaIcon name="external"/><span>Ver sitio web</span></RouterLink>
          <div class="sidebar-profile">
            <div class="avatar">{{ initials }}</div>
            <div class="sidebar-profile__copy"><strong>{{ currentUser?.name }}</strong><span>{{ roleLabel }}<template v-if="isStudent && currentUser?.voice"> · {{ currentUser.voice }}</template></span></div>
            <button type="button" title="Cerrar sesión" :disabled="isLoggingOut" @click="handleLogout"><AulaIcon name="logout"/></button>
          </div>
        </div>
      </aside>

      <div class="aula-workspace">
        <header class="aula-topbar">
          <div class="topbar-left">
            <button class="mobile-menu" type="button" aria-label="Abrir menú" @click="mobileOpen = true"><AulaIcon name="menu"/></button>
            <div class="breadcrumb"><span>Aula Virtual</span><AulaIcon name="chevron"/><strong>{{ currentSection }}</strong></div>
          </div>

          <div class="topbar-right">
            <div class="topbar-status"><span></span> Plataforma activa</div>
            <RouterLink to="/aula/cuenta" class="topbar-profile">
              <div class="avatar avatar--small">{{ initials }}</div>
              <div><strong>{{ firstName }}</strong><span>{{ roleLabel }}</span></div>
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
const { currentUser, isAuthenticated, isTeacher, isStudent, isAuthLoading, authError, initializeAuth, login, logout } = useAuth()

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

const loginError = computed(() => localError.value || authError.value || '')
const roleLabel = computed(() => currentUser.value?.role === 'teacher' ? 'Profesor' : 'Estudiante')
const firstName = computed(() => String(currentUser.value?.name || 'Usuario').trim().split(/\s+/)[0])
const initials = computed(() => String(currentUser.value?.name || '?').split(' ').filter(Boolean).map(word => word[0]).slice(0, 2).join('').toUpperCase())

const teacherNav = [
  { label: 'Inicio', to: '/aula', icon: 'home', exact: true },
  { label: 'Centro del curso', to: '/aula/curso', icon: 'course' },
  { label: 'Calendario', to: '/aula/calendario', icon: 'calendar' },
  { label: 'Contenido', to: '/aula/programa-formativo', icon: 'program' },
  { label: 'Recursos', to: '/aula/recursos', icon: 'folder' },
  { label: 'Alumnos', to: '/aula/alumnos', icon: 'users' },
  { label: 'Inscripciones', to: '/aula/inscripciones', icon: 'inbox' },
  { label: 'Asistencia', to: '/aula/asistencia', icon: 'attendance' },
  { label: 'Calificaciones', to: '/aula/calificaciones', icon: 'grades' }
]

const studentNav = computed(() => [
  { label: 'Inicio', to: '/aula', icon: 'home', exact: true },
  { label: 'Mi curso', to: '/aula/curso', icon: 'course' },
  { label: 'Calendario', to: '/aula/calendario', icon: 'calendar' },
  { label: 'Contenido', to: '/aula/programa-formativo', icon: 'program' },
  { label: 'Recursos', to: '/aula/recursos', icon: 'folder' },
  { label: 'Mis tareas', to: '/aula/mis-tareas', icon: 'tasks' },
  { label: 'Mis evaluaciones', to: '/aula/evaluaciones', icon: 'grades' },
  ...(currentUser.value?.studentId ? [{ label: 'Mi progreso', to: `/aula/estudiante/${currentUser.value.studentId}`, icon: 'progress' }] : [])
])

const navGroups = computed(() => [
  { label: 'APRENDIZAJE', items: isTeacher.value ? teacherNav.slice(0, 5) : studentNav.value.slice(0, 7) },
  { label: isTeacher.value ? 'GESTIÓN ACADÉMICA' : 'SEGUIMIENTO', items: isTeacher.value ? teacherNav.slice(5) : studentNav.value.slice(7) },
  { label: 'CUENTA', items: [{ label: 'Mi cuenta', to: '/aula/cuenta', icon: 'account' }] }
].filter(group => group.items.length))

const sectionNames = {
  aula: 'Inicio', 'aula-curso': 'Centro del curso', 'aula-calendario': 'Calendario', 'aula-programa': 'Contenido del curso', 'aula-crear-clase': 'Nueva clase', 'aula-alumnos': 'Alumnos',
  'aula-estudiante': isStudent.value ? 'Mi progreso' : 'Perfil de estudiante', 'aula-clase': 'Clase', 'aula-editar-clase': 'Editar clase',
  'aula-trabajo': 'Trabajo de clase', 'aula-tarea': 'Tarea', 'aula-crear-tarea': 'Nueva tarea', 'aula-editar-tarea': 'Editar tarea',
  'aula-entregas': 'Entregas', 'aula-revisar-entrega': 'Revisar entrega', 'aula-asistencia': 'Asistencia', 'aula-calificaciones': 'Calificaciones',
  'aula-mis-tareas': 'Mis tareas', 'aula-recursos': 'Recursos', 'aula-publicar-recurso': 'Publicar recurso', 'aula-inscriptions': 'Inscripciones',
  'aula-account': 'Mi cuenta', 'aula-crear-evaluacion': 'Nueva evaluación', 'aula-evaluacion': 'Evaluación', 'aula-mis-evaluaciones': 'Mis evaluaciones',
  'aula-evaluacion-revision': 'Resultado de evaluación'
}
const isNavActive = item => {
  const currentPath = route.path.replace(/\/$/, '') || '/aula'
  const targetPath = String(item.to || '').replace(/\/$/, '') || '/aula'

  // Inicio debe activarse SOLO en /aula.
  if (targetPath === '/aula') {
    return currentPath === '/aula'
  }

  // Las secciones principales se activan únicamente en su propia vista.
  // Para subrutas funcionales (crear/editar/ver) no dejamos otro item marcado.
  return currentPath === targetPath
}

const currentSection = computed(() => sectionNames[route.name] || 'Aula Virtual')

const handlePasswordReset = async () => {
  localError.value = ''; resetMessage.value = ''
  if (!email.value) { localError.value = 'Escribe primero tu correo electrónico para recuperar tu contraseña.'; return }
  isSendingReset.value = true
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email.value, { redirectTo: `${window.location.origin}/aula/cuenta` })
    if (error) throw error
    resetMessage.value = 'Te enviamos un enlace para crear una nueva contraseña.'
  } catch (error) { console.error(error); localError.value = 'No fue posible enviar el correo de recuperación.' }
  finally { isSendingReset.value = false }
}

const handleLogin = async () => {
  if (!email.value || !password.value) { localError.value = 'Ingresa tu correo y contraseña.'; return }
  isSubmitting.value = true; localError.value = ''
  try {
    const user = await login(email.value, password.value)
    if (!user) throw new Error('No se pudo cargar el perfil de esta cuenta.')
    password.value = ''
    await router.push('/aula')
  } catch (error) { console.error(error); if (!authError.value) localError.value = error?.message || 'No fue posible iniciar sesión.' }
  finally { isSubmitting.value = false }
}

const handleLogout = async () => {
  if (isLoggingOut.value) return
  isLoggingOut.value = true
  try { await logout(); email.value = ''; password.value = ''; localError.value = ''; mobileOpen.value = false; await router.push('/aula') }
  catch (error) { console.error(error) }
  finally { isLoggingOut.value = false }
}

onMounted(async () => { try { await initializeAuth() } finally { authReady.value = true } })
</script>

<style lang="scss" scoped>
@use '@/assets/styles/abstracts/variables' as v;

.aula-layout { min-height: 100vh; background: #f4f6f8; color: #17202a; }
.brand-mark { width: 42px; height: 42px; border-radius: 11px; display:grid; place-items:center; background:#111827; color:#fff; font-weight:800; letter-spacing:.03em; box-shadow:0 8px 20px rgba(17,24,39,.18); }
.brand-mark--large { width:50px; height:50px; border-radius:14px; }
.auth-screen { min-height:100vh; display:grid; place-items:center; background:#f6f7f9; }
.auth-loading { display:grid; justify-items:center; gap:14px; color:#17202a; }
.auth-loading span { color:#697586; font-size:.92rem; }
.auth-spinner,.button-spinner { width:22px; height:22px; border:2px solid #d9dee7; border-top-color:#8b1e3f; border-radius:50%; animation:spin .8s linear infinite; }
@keyframes spin { to { transform:rotate(360deg); } }

.login-screen { min-height:100vh; background:#eef1f5; padding:24px; display:grid; place-items:center; }
.login-shell { width:min(1180px,100%); min-height:720px; display:grid; grid-template-columns:1.08fr .92fr; background:#fff; border:1px solid #dde2e8; border-radius:24px; overflow:hidden; box-shadow:0 30px 80px rgba(15,23,42,.12); }
.login-brand-panel { position:relative; padding:48px; display:flex; flex-direction:column; color:#fff; background:linear-gradient(145deg,#101827 0%,#182233 60%,#25131a 100%); overflow:hidden; }
.login-brand-panel::after { content:''; position:absolute; width:420px; height:420px; border-radius:50%; right:-180px; bottom:-190px; background:radial-gradient(circle,rgba(214,173,50,.18),transparent 66%); }
.login-brand { display:flex; gap:14px; align-items:center; color:#fff; text-decoration:none; position:relative; z-index:1; }
.login-brand strong { display:block; font-size:1.06rem; } .login-brand span { color:#aeb8c6; font-size:.78rem; }
.login-copy { margin:auto 0 34px; max-width:610px; position:relative; z-index:1; }
.login-kicker,.eyebrow { display:inline-flex; font-size:.72rem; font-weight:800; letter-spacing:.15em; color:#a9841e; }
.login-copy h1 { margin:16px 0 20px; font-family:inherit; font-size:clamp(2.7rem,5vw,4.5rem); line-height:1.03; letter-spacing:-.045em; }
.login-copy h1 em { display:block; color:#d6ad32; font-style:normal; }
.login-copy p { margin:0; color:#bdc5d1; font-size:1.02rem; line-height:1.75; max-width:540px; }
.login-capabilities { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; position:relative; z-index:1; }
.login-capabilities article { min-width:0; padding:16px; border:1px solid rgba(255,255,255,.1); background:rgba(255,255,255,.045); border-radius:14px; }
.login-capabilities svg { color:#d6ad32; font-size:1.2rem; margin-bottom:12px; }
.login-capabilities strong { display:block; font-size:.84rem; } .login-capabilities span { display:block; margin-top:4px; color:#95a1b1; font-size:.74rem; line-height:1.45; }
.login-back { margin-top:26px; color:#98a4b4; text-decoration:none; font-size:.82rem; position:relative; z-index:1; }
.login-form-panel { padding:48px; display:grid; align-content:center; background:#fbfcfd; }
.login-card { width:min(430px,100%); margin:auto; padding:36px; background:#fff; border:1px solid #e2e6eb; border-radius:18px; box-shadow:0 12px 35px rgba(15,23,42,.06); }
.login-card__header h2 { margin:9px 0 8px; font-family:inherit; color:#17202a; font-size:1.85rem; letter-spacing:-.025em; }
.login-card__header p { margin:0 0 28px; color:#738092; font-size:.92rem; }
.login-form { display:grid; gap:17px; } .login-form label>span { display:block; margin-bottom:7px; color:#344054; font-size:.8rem; font-weight:700; }
.login-form input { width:100%; height:48px; border:1px solid #d9dee7; border-radius:10px; padding:0 13px; background:#fff; color:#17202a; outline:none; transition:.2s; }
.login-form input:focus { border-color:#8b1e3f; box-shadow:0 0 0 3px rgba(139,30,63,.09); }
.password-field { position:relative; } .password-field input { padding-right:72px; } .password-field button { position:absolute; right:7px; top:7px; height:34px; border:0; background:#f2f4f7; border-radius:7px; padding:0 10px; font-size:.72rem; font-weight:700; color:#475467; cursor:pointer; }
.forgot-link { justify-self:end; margin-top:-8px; border:0; background:none; color:#8b1e3f; font-weight:700; font-size:.78rem; cursor:pointer; }
.form-message { display:flex; gap:9px; align-items:flex-start; padding:11px 12px; border-radius:9px; font-size:.78rem; line-height:1.45; }.form-message--success{background:#ecfdf3;color:#166534}.form-message--error{background:#fef2f2;color:#991b1b}
.login-submit { height:50px; display:flex; align-items:center; justify-content:center; gap:10px; border:0; border-radius:10px; background:#8b1e3f; color:#fff; font-weight:800; cursor:pointer; box-shadow:0 9px 22px rgba(139,30,63,.18); }.login-submit:hover{background:#761933}.login-submit:disabled{opacity:.65;cursor:not-allowed}.login-submit .button-spinner{border-color:rgba(255,255,255,.3);border-top-color:#fff;width:18px;height:18px}
.secure-note { margin-top:24px; padding-top:19px; border-top:1px solid #eef0f3; display:flex; gap:10px; align-items:flex-start; color:#667085; font-size:.76rem; line-height:1.5; }.secure-note>span{width:22px;height:22px;display:grid;place-items:center;background:#ecfdf3;color:#15803d;border-radius:50%;font-weight:800}.secure-note p{margin:0}.secure-note strong{color:#344054}
.login-help { text-align:center; color:#8691a1; font-size:.76rem; }

.aula-sidebar { position:fixed; inset:0 auto 0 0; z-index:100; width:274px; display:flex; flex-direction:column; background:linear-gradient(180deg,#142036 0%,#18253c 55%,#101a2c 100%); color:#fff; border-right:1px solid rgba(255,255,255,.07); }
.sidebar-brand { height:76px; padding:0 20px; display:flex; align-items:center; border-bottom:1px solid rgba(255,255,255,.07); }.sidebar-brand__link{display:flex;align-items:center;gap:11px;color:#fff;text-decoration:none}.sidebar-brand strong{display:block;font-size:.91rem}.sidebar-brand span{display:block;color:#8e9aab;font-size:.7rem;margin-top:2px}.sidebar-close{display:none}
.workspace-chip { margin:18px 16px 8px; padding:12px; display:flex; align-items:center; gap:10px; border:1px solid rgba(255,255,255,.07); border-radius:10px; background:rgba(255,255,255,.05); }.workspace-chip__dot{width:8px;height:8px;border-radius:50%;background:#42c77a;box-shadow:0 0 0 4px rgba(66,199,122,.1)}.workspace-chip small{display:block;color:#6f7d90;font-size:.58rem;font-weight:800;letter-spacing:.11em}.workspace-chip strong{display:block;margin-top:2px;font-size:.74rem;color:#dbe1e9;font-weight:600}
.sidebar-nav { flex:1; min-height:0; overflow:auto; padding:10px 12px 18px; }.sidebar-nav__label{margin:19px 10px 7px;color:#5f6d80;font-size:.59rem;font-weight:800;letter-spacing:.13em}.sidebar-link{height:42px;padding:0 11px;display:flex;align-items:center;gap:11px;border-radius:8px;color:#aeb8c6;text-decoration:none;font-size:.79rem;font-weight:600;transition:.18s}.sidebar-link:hover{background:rgba(255,255,255,.055);color:#fff}.sidebar-link.is-active{background:linear-gradient(90deg,rgba(214,173,50,.17),rgba(214,173,50,.08));color:#ffe28a;box-shadow:inset 3px 0 0 #d6ad32}.sidebar-link.is-active{background:rgba(214,173,50,.12);color:#f3d46d}.sidebar-link__badge{margin-left:auto;min-width:20px;height:20px;display:grid;place-items:center;border-radius:999px;background:#8b1e3f;color:#fff;font-size:.62rem}
.sidebar-footer { padding:12px; border-top:1px solid rgba(255,255,255,.07); }.sidebar-site-link{height:38px;display:flex;align-items:center;gap:10px;padding:0 10px;color:#8f9bad;text-decoration:none;font-size:.74rem}.sidebar-profile{margin-top:8px;padding:10px;display:flex;align-items:center;gap:9px;background:rgba(255,255,255,.045);border-radius:10px}.avatar{width:36px;height:36px;display:grid;place-items:center;border-radius:9px;background:#8b1e3f;color:#fff;font-size:.74rem;font-weight:800;letter-spacing:.02em}.sidebar-profile__copy{min-width:0;flex:1}.sidebar-profile__copy strong,.sidebar-profile__copy span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sidebar-profile__copy strong{font-size:.73rem}.sidebar-profile__copy span{margin-top:2px;color:#7f8da0;font-size:.63rem}.sidebar-profile button{width:32px;height:32px;display:grid;place-items:center;border:0;border-radius:8px;background:transparent;color:#7f8da0;cursor:pointer}.sidebar-profile button:hover{background:rgba(255,255,255,.07);color:#fff}
.aula-workspace { min-height:100vh; margin-left:274px; display:flex; flex-direction:column; }.aula-topbar{position:sticky;top:0;z-index:60;height:76px;padding:0 clamp(20px,3vw,42px);display:flex;align-items:center;justify-content:space-between;background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-bottom:1px solid #e1e5ea}.topbar-left,.topbar-right,.breadcrumb,.topbar-profile{display:flex;align-items:center}.breadcrumb{gap:7px;color:#98a2b3;font-size:.76rem}.breadcrumb svg{font-size:.8rem}.breadcrumb strong{color:#344054;font-weight:700}.topbar-right{gap:17px}.topbar-status{display:flex;align-items:center;gap:7px;color:#667085;font-size:.69rem;font-weight:600}.topbar-status>span{width:7px;height:7px;border-radius:50%;background:#34b56f}.topbar-profile{gap:9px;color:#17202a;text-decoration:none}.avatar--small{width:34px;height:34px;border-radius:50%}.topbar-profile strong,.topbar-profile span{display:block}.topbar-profile strong{font-size:.74rem}.topbar-profile span{margin-top:1px;color:#98a2b3;font-size:.62rem}.mobile-menu{display:none}
.aula-content { flex:1; width:100%; max-width:1540px; margin:0 auto; padding:30px clamp(20px,3.4vw,52px) 48px; }.aula-footer{padding:17px clamp(20px,3.4vw,52px);display:flex;justify-content:space-between;border-top:1px solid #e1e5ea;color:#98a2b3;background:#f8f9fb;font-size:.64rem}.mobile-backdrop{display:none}

@media (max-width: 980px){
  .login-shell{grid-template-columns:1fr;min-height:auto}.login-brand-panel{padding:34px}.login-copy{margin:72px 0 32px}.login-copy h1{font-size:clamp(2.4rem,9vw,4rem)}.login-capabilities{display:none}.login-form-panel{padding:30px 22px}.login-card{padding:28px}
  .aula-sidebar{transform:translateX(-100%);transition:transform .24s ease;box-shadow:20px 0 50px rgba(15,23,42,.2)}.aula-sidebar.is-open{transform:translateX(0)}.sidebar-close{margin-left:auto;width:34px;height:34px;display:grid;place-items:center;border:0;border-radius:8px;background:rgba(255,255,255,.06);color:#fff}.mobile-backdrop{display:block;position:fixed;inset:0;z-index:90;background:rgba(15,23,42,.45);backdrop-filter:blur(2px)}.aula-workspace{margin-left:0}.mobile-menu{width:38px;height:38px;margin-right:13px;display:grid;place-items:center;border:1px solid #e0e5eb;border-radius:9px;background:#fff;color:#344054}.topbar-status{display:none}
}
@media (max-width:640px){.login-screen{padding:0}.login-shell{border:0;border-radius:0;min-height:100vh}.login-brand-panel{padding:26px 22px}.login-copy{margin:60px 0 12px}.login-copy p{font-size:.92rem}.login-back{margin-top:30px}.login-form-panel{padding:25px 16px 36px}.login-card{padding:24px 20px}.aula-topbar{height:66px;padding:0 16px}.breadcrumb>span,.breadcrumb svg,.topbar-profile>div:last-child{display:none}.aula-content{padding:22px 14px 36px}.aula-footer{padding:14px 16px;display:block}.aula-footer span:last-child{display:none}}
</style>
