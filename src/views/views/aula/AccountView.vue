<template>
  <section class="profile-page amv-view-shell">
    <header class="profile-hero">
      <div class="profile-hero__copy">
        <span class="profile-kicker"><i></i> MI CUENTA · AULA VIRTUAL</span>
        <h1>Tu perfil.<br><span>Tu identidad.</span></h1>
        <p>Administra los datos que aparecen en el Aula Virtual y mantén tu acceso protegido.</p>
      </div>

      <div class="profile-hero__identity">
        <button
          type="button"
          class="profile-avatar profile-avatar--hero"
          title="Cambiar foto de perfil"
          @click="chooseAvatar"
        >
          <img v-if="avatarPreview" :src="avatarPreview" alt="Foto de perfil" / decoding="async">
          <span v-else>{{ initials }}</span>
          <small>✎</small>
        </button>
        <div>
          <span>{{ roleLabel }}</span>
          <strong>{{ form.displayName || 'Usuario' }}</strong>
          <small v-if="isStudent && student?.voice">{{ student.voice }}</small>
        </div>
      </div>
    </header>

    <input
      ref="avatarInput"
      class="sr-only"
      type="file"
      accept="image/jpeg,image/png,image/webp"
      @change="handleAvatarChange"
    />

    <section class="profile-overview">
      <article class="overview-card overview-card--identity">
        <span class="overview-card__icon">👤</span>
        <div><small>NOMBRE EN EL AULA</small><strong>{{ form.displayName || 'Usuario' }}</strong><p>Se muestra en tu experiencia académica.</p></div>
      </article>
      <article>
        <span class="overview-card__icon">✉</span>
        <div><small>CORREO DE ACCESO</small><strong>{{ profile?.email || 'Sin correo' }}</strong><p>Solo lectura desde el portal.</p></div>
      </article>
      <article>
        <span class="overview-card__icon">✓</span>
        <div><small>ESTADO</small><strong>Cuenta activa</strong><p>Acceso autenticado con Supabase.</p></div>
      </article>
    </section>

    <nav class="profile-tabs" aria-label="Secciones de la cuenta">
      <a href="#profile-data">Perfil</a>
      <a href="#academic-data">Información académica</a>
      <a href="#security-data">Seguridad</a>
    </nav>

    <section id="profile-data" class="profile-section">
      <header class="profile-section__header">
        <div><span>01</span><small>IDENTIDAD</small><h2>Información de perfil</h2></div>
        <p>Edita únicamente la información que debe aparecer en la plataforma.</p>
      </header>

      <div class="profile-editor-grid">
        <article class="profile-editor-card profile-editor-card--photo">
          <div class="profile-editor-card__photo-wrap">
            <button type="button" class="profile-avatar profile-avatar--large" @click="chooseAvatar">
              <img v-if="avatarPreview" :src="avatarPreview" alt="Foto de perfil" / decoding="async">
              <span v-else>{{ initials }}</span>
              <b>✎</b>
            </button>
          </div>
          <div>
            <span>FOTOGRAFÍA</span>
            <h3>Tu foto de perfil</h3>
            <p>JPG, PNG o WEBP. Máximo 5 MB.</p>
            <div class="photo-actions">
              <button type="button" class="button button--ghost" :disabled="isUploadingAvatar" @click="chooseAvatar">
                {{ isUploadingAvatar ? 'Subiendo…' : 'Cambiar foto' }}
              </button>
              <button v-if="profile?.avatar_url" type="button" class="button button--text" :disabled="isUploadingAvatar" @click="removeAvatar">
                Quitar foto
              </button>
            </div>
          </div>
        </article>

        <form class="profile-editor-card" @submit.prevent="saveProfile">
          <div class="form-field">
            <label for="display-name">Nombre que aparece en el Aula</label>
            <input id="display-name" v-model.trim="form.displayName" maxlength="120" autocomplete="name" required />
            <small>Este nombre se sincroniza con tu perfil académico cuando corresponde.</small>
          </div>

          <div class="readonly-field">
            <span>Correo electrónico</span>
            <strong>{{ profile?.email || 'Sin correo' }}</strong>
            <small>Por seguridad, el correo de acceso no se cambia desde este portal.</small>
          </div>

          <div v-if="errorMessage" class="message message--error"><b>!</b><span>{{ errorMessage }}</span></div>
          <div v-if="successMessage" class="message message--success"><b>✓</b><span>{{ successMessage }}</span></div>

          <button class="button button--primary" type="submit" :disabled="isSavingProfile">
            {{ isSavingProfile ? 'Guardando…' : 'Guardar cambios' }}
            <span v-if="!isSavingProfile">→</span>
          </button>
        </form>
      </div>
    </section>

    <section id="academic-data" class="profile-section">
      <header class="profile-section__header">
        <div><span>02</span><small>ACADÉMICO</small><h2>Tu relación con AMO MI VOZ</h2></div>
        <p>Estos datos conectan tu identidad con el entorno académico.</p>
      </header>

      <div class="academic-grid">
        <article><span>ROL</span><strong>{{ roleLabel }}</strong><small>{{ isTeacher ? 'Gestión académica' : 'Experiencia de aprendizaje' }}</small></article>
        <article v-if="isStudent"><span>CLASIFICACIÓN VOCAL</span><strong>{{ student?.voice || 'Sin registrar' }}</strong><small>Definida por el equipo docente.</small></article>
        <article v-if="isStudent"><span>PERFIL ACADÉMICO</span><strong>{{ profile?.student_id ? 'Vinculado' : 'Pendiente' }}</strong><small>Relación con tu ficha de estudiante.</small></article>
        <article v-if="isTeacher"><span>PERMISOS</span><strong>Profesor</strong><small>Puede gestionar alumnos y contenido.</small></article>
      </div>

      <RouterLink v-if="isStudent && profile?.student_id" :to="`/aula/estudiante/${profile.student_id}`" class="academic-link">
        Abrir mi perfil académico <span>→</span>
      </RouterLink>
    </section>

    <section id="security-data" class="profile-section">
      <header class="profile-section__header">
        <div><span>03</span><small>SEGURIDAD</small><h2>Acceso protegido</h2></div>
        <p>La contraseña no se modifica desde este portal.</p>
      </header>

      <div class="security-card">
        <div class="security-card__visual"><span>✉</span><i></i><b></b></div>
        <div class="security-card__copy">
          <span>RECUPERACIÓN POR CORREO</span>
          <h3>¿Necesitas cambiar tu contraseña?</h3>
          <p>Solicita un enlace de recuperación. El cambio de contraseña se realizará únicamente a través del flujo seguro de Supabase Auth.</p>
          <button type="button" class="button button--primary" :disabled="isSendingReset" @click="sendRecovery">
            {{ isSendingReset ? 'Enviando enlace…' : 'Enviar enlace de recuperación' }}
            <span v-if="!isSendingReset">→</span>
          </button>
          <div v-if="recoveryMessage" class="message message--success"><b>✓</b><span>{{ recoveryMessage }}</span></div>
          <div v-if="recoveryError" class="message message--error"><b>!</b><span>{{ recoveryError }}</span></div>
        </div>
      </div>

      <article class="security-note">
        <span>🔒</span>
        <div><strong>La contraseña no está visible para profesores ni administradores.</strong><p>El portal tampoco ofrece un formulario directo para reemplazarla; solo envía el enlace de recuperación al correo autenticado.</p></div>
      </article>
    </section>

    <footer class="profile-footer"><span>AMO MI VOZ</span><i></i><span>IDENTIDAD · SEGURIDAD · AULA VIRTUAL</span></footer>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import { fetchMyProfile, fetchMyStudentProfile, updateMyProfile, uploadMyAvatar, requestPasswordRecovery } from '@/services/accountProfileService'
import { supabase } from '@/lib/supabase'

const { currentUser, isTeacher, isStudent } = useAuth()

const profile = ref(null)
const student = ref(null)
const avatarInput = ref(null)
const avatarPreview = ref('')
const localObjectUrl = ref('')
const form = reactive({ displayName: '' })
const isSavingProfile = ref(false)
const isUploadingAvatar = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const recoveryMessage = ref('')
const recoveryError = ref('')
const isSendingReset = ref(false)

const roleLabel = computed(() => isTeacher.value ? 'Profesor' : 'Estudiante')
const initials = computed(() => {
  const value = form.displayName || currentUser.value?.name || 'Usuario'
  return String(value).split(/\s+/).filter(Boolean).map(word => word[0]).slice(0, 2).join('').toUpperCase()
})

async function loadProfile() {
  profile.value = await fetchMyProfile()
  form.displayName = profile.value?.display_name || currentUser.value?.name || ''
  if (isStudent.value && profile.value?.student_id) {
    student.value = await fetchMyStudentProfile(profile.value.student_id)
  }
  avatarPreview.value = profile.value?.avatar_url || ''
}

function chooseAvatar() {
  avatarInput.value?.click()
}

async function handleAvatarChange(event) {
  const file = event.target.files?.[0]
  if (!file) return
  errorMessage.value = ''
  successMessage.value = ''

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
    errorMessage.value = 'La foto debe estar en formato JPG, PNG o WEBP.'
    event.target.value = ''
    return
  }

  if (file.size > 5 * 1024 * 1024) {
    errorMessage.value = 'La foto supera el máximo permitido de 5 MB.'
    event.target.value = ''
    return
  }

  if (localObjectUrl.value) URL.revokeObjectURL(localObjectUrl.value)
  localObjectUrl.value = URL.createObjectURL(file)
  avatarPreview.value = localObjectUrl.value
  isUploadingAvatar.value = true

  try {
    const result = await uploadMyAvatar(file)
    avatarPreview.value = result?.avatar_url || avatarPreview.value
    await loadProfile()
    successMessage.value = 'Foto de perfil actualizada correctamente.'
    window.dispatchEvent(new CustomEvent('amv:profile-updated'))
  } catch (error) {
    console.error('Error subiendo avatar:', error)
    errorMessage.value = error?.message || 'No se pudo actualizar la foto de perfil.'
    await loadProfile().catch(() => {})
  } finally {
    isUploadingAvatar.value = false
    if (avatarInput.value) avatarInput.value.value = ''
  }
}

async function removeAvatar() {
  if (!profile.value?.avatar_path) return
  isUploadingAvatar.value = true
  errorMessage.value = ''
  try {
    const user = await supabase.auth.getUser()
    const { error: storageError } = await supabase.storage.from('profile-avatars').remove([profile.value.avatar_path])
    if (storageError) throw storageError
    const { error } = await supabase.from('profiles').update({ avatar_url: null, avatar_path: null }).eq('id', user.data?.user?.id)
    if (error) throw error
    await loadProfile()
    successMessage.value = 'Foto de perfil eliminada.'
    window.dispatchEvent(new CustomEvent('amv:profile-updated'))
  } catch (error) {
    console.error('Error quitando avatar:', error)
    errorMessage.value = error?.message || 'No se pudo quitar la foto.'
  } finally {
    isUploadingAvatar.value = false
  }
}

async function saveProfile() {
  errorMessage.value = ''
  successMessage.value = ''
  isSavingProfile.value = true
  try {
    await updateMyProfile({ displayName: form.displayName })
    await loadProfile()
    successMessage.value = 'Tus datos de perfil fueron actualizados correctamente.'
    window.dispatchEvent(new CustomEvent('amv:profile-updated'))
  } catch (error) {
    console.error('Error guardando perfil:', error)
    errorMessage.value = error?.message || 'No se pudieron guardar tus cambios.'
  } finally {
    isSavingProfile.value = false
  }
}

async function sendRecovery() {
  recoveryMessage.value = ''
  recoveryError.value = ''
  isSendingReset.value = true
  try {
    await requestPasswordRecovery(profile.value?.email || currentUser.value?.email)
    recoveryMessage.value = `Te enviamos un enlace de recuperación a ${profile.value?.email || currentUser.value?.email}.`
  } catch (error) {
    console.error('Error enviando recuperación:', error)
    recoveryError.value = error?.message || 'No fue posible enviar el enlace de recuperación.'
  } finally {
    isSendingReset.value = false
  }
}

onMounted(() => {
  loadProfile().catch(error => {
    console.error('Error cargando perfil:', error)
    errorMessage.value = error?.message || 'No fue posible cargar tu perfil.'
  })
})

onBeforeUnmount(() => {
  if (localObjectUrl.value) URL.revokeObjectURL(localObjectUrl.value)
})
</script>

<style scoped>
.profile-page {
  --ink:#172033; --muted:#738198; --line:#dfe6ee; --surface:#fff; --soft:#f6f8fb;
  --wine:#a6194a; --wine-deep:#7c1238; --gold:#d9a91d; --gold-deep:#9a7200; --green:#2b966d;
  width:min(1180px,calc(100% - 40px)); margin:0 auto; padding:34px 0 76px; color:var(--ink);
}
.profile-hero,.overview-card,.profile-editor-card,.academic-grid article,.security-card,.security-note {
  border:1px solid var(--line); background:var(--surface); box-shadow:0 16px 38px rgba(18,31,51,.055);
}
.profile-hero { position:relative; overflow:hidden; display:grid; grid-template-columns:1fr auto; gap:28px; padding:34px; border-radius:26px; background:
  radial-gradient(circle at 85% 10%,rgba(217,169,29,.18),transparent 26%),
  radial-gradient(circle at 72% 90%,rgba(166,25,74,.08),transparent 30%), linear-gradient(135deg,#fff,#fbfcfe 64%,#fff9ef); }
.profile-hero::before { content:''; position:absolute; inset:0; background:linear-gradient(110deg,transparent 10%,rgba(255,255,255,.7) 42%,transparent 74%); transform:translateX(-110%); animation:shine 5.5s ease-in-out infinite; pointer-events:none; }
@keyframes shine { 0%,55%{transform:translateX(-110%)} 75%,100%{transform:translateX(110%)} }
.profile-kicker { color:var(--gold-deep); font-weight:900; font-size:.68rem; letter-spacing:.18em; }
.profile-kicker i { display:inline-block; width:8px;height:8px;border-radius:50%;background:var(--green);margin-right:8px;box-shadow:0 0 14px rgba(43,150,109,.45); }
.profile-hero h1 { margin:14px 0 12px; font-size:clamp(3rem,6vw,5.2rem); line-height:.94; letter-spacing:-.06em; }
.profile-hero h1 span { color:var(--gold-deep); }
.profile-hero p { max-width:660px; margin:0; color:var(--muted); font-size:.95rem; line-height:1.7; }
.profile-hero__identity { display:flex; align-items:center; gap:15px; align-self:center; min-width:260px; }
.profile-hero__identity > div { display:flex; flex-direction:column; min-width:0; }
.profile-hero__identity span { color:var(--gold-deep); font-size:.58rem; font-weight:900; letter-spacing:.16em; text-transform:uppercase; }
.profile-hero__identity strong { font-size:1.05rem; margin-top:4px; }
.profile-hero__identity small { margin-top:3px; color:var(--muted); }
.profile-avatar { position:relative; display:grid; place-items:center; flex:0 0 auto; overflow:hidden; border:0; background:linear-gradient(145deg,#8e123e,#b62159); color:#fff; cursor:pointer; box-shadow:0 12px 28px rgba(166,25,74,.22); }
.profile-avatar img { width:100%;height:100%;object-fit:cover; }
.profile-avatar--hero { width:74px;height:74px;border-radius:24px; }
.profile-avatar--large { width:104px;height:104px;border-radius:30px; border:4px solid #fff; box-shadow:0 15px 35px rgba(166,25,74,.22); }
.profile-avatar--hero small,.profile-avatar--large b { position:absolute; right:5px; bottom:5px; display:grid;place-items:center; width:24px;height:24px;border-radius:50%;background:#fff;color:var(--wine);font-size:.7rem; }
.sr-only { position:absolute; width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap; }
.profile-overview { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:12px; margin:15px 0 16px; }
.overview-card { display:flex; gap:12px; align-items:flex-start; padding:18px; border-radius:18px; }
.overview-card__icon { width:38px;height:38px;display:grid;place-items:center;flex:0 0 auto;border-radius:12px;background:#fff5df;border:1px solid #efd895; }
.overview-card small,.academic-grid span { display:block; color:#8b96a8; font-size:.52rem;font-weight:900;letter-spacing:.13em;text-transform:uppercase; }
.overview-card strong { display:block;margin-top:5px;font-size:.9rem; }
.overview-card p { margin:4px 0 0;color:var(--muted);font-size:.66rem;line-height:1.45; }
.profile-tabs { position:sticky;top:0;z-index:30;display:grid;grid-template-columns:repeat(3,1fr);gap:6px;padding:7px;border:1px solid var(--line);border-radius:17px;background:rgba(255,255,255,.92);backdrop-filter:blur(16px);box-shadow:0 12px 30px rgba(17,31,52,.08); }
.profile-tabs a { display:flex;align-items:center;justify-content:center;min-height:42px;border-radius:12px;color:#637188;text-decoration:none;font-size:.72rem;font-weight:850;transition:.22s ease; }
.profile-tabs a:hover { color:var(--wine);background:#fbf3f6;transform:translateY(-1px); }
.profile-section { margin-top:32px; }
.profile-section__header { display:flex;justify-content:space-between;align-items:flex-end;gap:24px;margin-bottom:14px; }
.profile-section__header > div { display:grid; grid-template-columns:42px minmax(0,1fr); column-gap:12px; align-items:end; }
.profile-section__header > div > span { grid-row:1 / span 2; display:grid;place-items:center;width:42px;height:42px;border:1px solid #e5c96d;border-radius:50%;color:var(--gold-deep);font-weight:900; }
.profile-section__header small { color:var(--wine);font-size:.57rem;font-weight:900;letter-spacing:.16em; }
.profile-section__header h2 { margin:2px 0 0;font-size:2rem;letter-spacing:-.04em; }
.profile-section__header p { margin:0;color:var(--muted);max-width:470px;font-size:.75rem;line-height:1.6;text-align:right; }
.profile-editor-grid { display:grid;grid-template-columns:1fr 1fr;gap:14px; }
.profile-editor-card { padding:24px;border-radius:20px; }
.profile-editor-card--photo { display:flex;gap:20px;align-items:center;background:linear-gradient(145deg,#fff,#fbf7ff); }
.profile-editor-card--photo > div:last-child { min-width:0; }
.profile-editor-card--photo span,.security-card__copy > span { color:var(--wine);font-size:.56rem;font-weight:900;letter-spacing:.14em; }
.profile-editor-card h3 { margin:7px 0 5px;font-size:1.15rem; }
.profile-editor-card p { margin:0;color:var(--muted);font-size:.7rem;line-height:1.55; }
.photo-actions { display:flex;gap:8px;flex-wrap:wrap;margin-top:15px; }
.form-field,.readonly-field { display:grid;gap:7px;margin-bottom:14px; }
.form-field label,.readonly-field > span { color:#465468;font-size:.72rem;font-weight:800; }
.form-field input { width:100%;height:48px;padding:0 13px;border:1px solid var(--line);border-radius:12px;color:var(--ink);outline:none;background:#fff;transition:.2s ease; }
.form-field input:focus { border-color:var(--wine);box-shadow:0 0 0 3px rgba(166,25,74,.08); }
.form-field small,.readonly-field small { color:var(--muted);font-size:.63rem;line-height:1.45; }
.readonly-field { padding:14px;border:1px solid #e7ebf0;border-radius:14px;background:var(--soft); }
.readonly-field strong { font-size:.82rem;word-break:break-all; }
.button { display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:42px;padding:0 15px;border:0;border-radius:11px;font-size:.72rem;font-weight:900;cursor:pointer;transition:.22s ease; }
.button:hover:not(:disabled) { transform:translateY(-2px); }
.button:disabled { opacity:.55;cursor:not-allowed; }
.button--primary { background:var(--wine);color:#fff;box-shadow:0 10px 22px rgba(166,25,74,.18); }
.button--ghost { background:#fff;border:1px solid var(--line);color:#465468; }
.button--text { background:transparent;color:var(--wine); }
.message { display:flex;gap:9px;align-items:flex-start;padding:11px 12px;margin:10px 0;border-radius:12px;font-size:.7rem;line-height:1.45; }
.message b { width:22px;height:22px;display:grid;place-items:center;border-radius:50%;flex:0 0 auto; }
.message--success { background:#ecfdf3;color:#166534; }.message--success b{background:#d1fae5;}
.message--error { background:#fff1f2;color:#9f1239; }.message--error b{background:#ffe4e6;}
.academic-grid { display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px; }
.academic-grid article { padding:20px;border-radius:18px; }
.academic-grid strong { display:block;margin-top:7px;font-size:.9rem; }
.academic-grid small { display:block;margin-top:4px;color:var(--muted);font-size:.64rem;line-height:1.45; }
.academic-link { display:inline-flex;align-items:center;gap:8px;margin-top:12px;padding:12px 14px;border:1px solid #ead1da;border-radius:12px;background:#fff7fa;color:var(--wine);text-decoration:none;font-size:.7rem;font-weight:900; }
.security-card { display:grid;grid-template-columns:160px minmax(0,1fr);gap:28px;padding:26px;border-radius:22px;background:linear-gradient(145deg,#fff,#fff9f0);overflow:hidden; }
.security-card__visual { position:relative;display:grid;place-items:center;min-height:190px;border-radius:18px;background:radial-gradient(circle at center,rgba(217,169,29,.22),transparent 47%),linear-gradient(145deg,#f9f3df,#fff); }
.security-card__visual span { position:relative;z-index:2;width:72px;height:72px;display:grid;place-items:center;border-radius:24px;background:#fff;border:1px solid #eddda8;color:var(--gold-deep);font-size:2rem;box-shadow:0 12px 28px rgba(217,169,29,.18); }
.security-card__visual i,.security-card__visual b { position:absolute;border:1px solid rgba(217,169,29,.35);border-radius:50%;animation:orbit 4.5s linear infinite; }
.security-card__visual i { width:125px;height:125px; }.security-card__visual b { width:165px;height:165px;animation-direction:reverse;animation-duration:7s; }
@keyframes orbit { to { transform:rotate(360deg); } }
.security-card__copy { align-self:center; }
.security-card__copy h3 { margin:7px 0 8px;font-size:1.5rem;letter-spacing:-.03em; }
.security-card__copy p { max-width:690px;margin:0;color:var(--muted);font-size:.76rem;line-height:1.65; }
.security-card__copy .button { margin-top:16px; }
.security-note { display:flex;gap:12px;margin-top:12px;padding:15px 17px;border-radius:16px;background:#fbfcfe; }
.security-note > span { font-size:1.1rem; }.security-note strong{font-size:.74rem}.security-note p{margin:4px 0 0;color:var(--muted);font-size:.65rem;line-height:1.45}
.profile-footer { display:flex;justify-content:center;gap:9px;margin-top:36px;color:#8d98a9;font-size:.54rem;font-weight:900;letter-spacing:.14em; }
.profile-footer i { width:4px;height:4px;border-radius:50%;background:var(--gold); }
@media (max-width:900px){ .profile-overview,.academic-grid{grid-template-columns:repeat(2,minmax(0,1fr));}.profile-editor-grid{grid-template-columns:1fr;}.security-card{grid-template-columns:1fr;}.profile-section__header{align-items:flex-start;flex-direction:column;}.profile-section__header p{text-align:left;} }
@media (max-width:640px){ .profile-page{width:min(100% - 22px,1180px);padding-top:20px;}.profile-hero{grid-template-columns:1fr;padding:22px;border-radius:20px;}.profile-hero__identity{min-width:0;}.profile-overview,.academic-grid{grid-template-columns:1fr;}.profile-tabs{grid-template-columns:1fr;position:static;}.profile-section__header h2{font-size:1.6rem;}.profile-editor-card--photo{align-items:flex-start;flex-direction:column;}.security-card{padding:18px;}.security-card__visual{min-height:160px;} }
@media (prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;animation:none!important;transition-duration:.01ms!important;}}
</style>


<style lang="scss">
/* AMV UI POLISH 2026 — visual consistency, accessibility and mobile resilience. */
.amv-view-shell {
  --amv-ui-wine: #9f1945;
  --amv-ui-wine-deep: #7f1237;
  --amv-ui-gold: #d9a91d;
  --amv-ui-purple: #7657d9;
  --amv-ui-cyan: #20b8ae;
  --amv-ui-ink: #172033;
  --amv-ui-muted: #6f7c8f;
  --amv-ui-line: rgba(122, 137, 158, 0.20);
  --amv-ui-focus: rgba(159, 25, 69, 0.38);
  --amv-ui-radius-sm: 12px;
  --amv-ui-radius-md: 18px;
  --amv-ui-radius-lg: 26px;
  --amv-ui-shadow: 0 18px 55px rgba(17, 25, 39, 0.09);
  --amv-ui-shadow-hover: 0 22px 65px rgba(17, 25, 39, 0.14);
  position: relative;
  width: 100%;
  max-width: 100%;
  min-width: 0;
  isolation: isolate;
  overflow-x: clip;
  -webkit-tap-highlight-color: transparent;
}

.amv-view-shell::before {
  content: '';
  position: absolute;
  inset: -150px -120px auto auto;
  width: 420px;
  height: 420px;
  pointer-events: none;
  border-radius: 50%;
  background:
    radial-gradient(circle at 35% 35%, rgba(159, 25, 69, 0.10), transparent 52%),
    radial-gradient(circle at 68% 62%, rgba(217, 169, 29, 0.08), transparent 58%);
  filter: blur(6px);
  opacity: 0.82;
  z-index: -1;
}

.amv-view-shell :where(*, *::before, *::after) {
  box-sizing: border-box;
}

.amv-view-shell :where(img, video, svg, canvas) {
  max-width: 100%;
}

.amv-view-shell :where(h1, h2, h3, h4, h5, h6) {
  text-wrap: balance;
}

.amv-view-shell :where(p, li, td, th, label, small) {
  overflow-wrap: anywhere;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']) {
  touch-action: manipulation;
}

.amv-view-shell :where(button, input, select, textarea) {
  font: inherit;
}

.amv-view-shell :where(button) {
  min-height: 42px;
}

.amv-view-shell :where(input, select, textarea) {
  max-width: 100%;
}

.amv-view-shell :where(a, button, input, select, textarea, [role='button']):focus-visible {
  outline: 3px solid var(--amv-ui-focus);
  outline-offset: 3px;
}

.amv-view-shell :where(button, [role='button']):disabled,
.amv-view-shell :where(input, select, textarea):disabled {
  cursor: not-allowed;
}

.amv-view-shell :where(.button, .btn, .lux-button, .amv-primary-btn, .amv-secondary-action,
  .primary-action, .secondary-action, .danger-action, .text-link, .action-link,
  .lightbox__close, .lightbox__nav, .today-button, .quick-action) {
  -webkit-user-select: none;
  user-select: none;
}

/* Premium surface language without changing each view's semantic palette. */
.amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
  .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
  .resource-card, .student-card, .lesson-card, .task-card, .format-card,
  .production, .sound-console, .state-card, .empty-card, .workspace,
  .profile-card, .profile-panel, .vocal-card, .weighted-student, .weighted-category) {
  border-radius: var(--amv-ui-radius-md);
}

.amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
  .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
  .task-card, .format-card, .production, .state-card, .empty-card) {
  transition:
    transform 180ms ease,
    box-shadow 180ms ease,
    border-color 180ms ease,
    background-color 180ms ease;
}

@media (hover: hover) and (pointer: fine) {
  .amv-view-shell :where(.resource-card, .student-card, .lesson-card, .metric-card,
    .focus-card, .next-class-card, .summary-card, .insight-card, .quiz-card,
    .task-card, .format-card, .production):not(.is-disabled):hover {
    transform: translateY(-2px);
  }
}

/* Toolbars wrap rather than squeezing controls into unreadable rows. */
.amv-view-shell :where(.toolbar, .students-toolbar, .calendar-toolbar, .resources-controls,
  .resources-controls__row, .gradebook-legacy-toolbar, .hero-actions, .actions,
  .action-row, .question-actions, .filters, .public-jump-nav, .classes-header__actions,
  .result-action-row, .form-actions, .footer-actions) {
  min-width: 0;
}

.amv-view-shell :where(.table-shell, .quiz-table-wrap, .table-wrap, .grade-table-wrap,
  .data-table-wrap, .scroll-region, .horizontal-scroll) {
  max-width: 100%;
  overflow-x: auto;
  overflow-y: visible;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
}

.amv-view-shell :where(.table-shell table, .quiz-table-wrap table, .table-wrap table,
  .grade-table-wrap table, .data-table-wrap table) {
  max-width: none;
}

/* Prevent long controls and badges from forcing page-level horizontal overflow. */
.amv-view-shell :where(.badge, .pill, .chip, .status-pill, .source-badge, .event-chip,
  .lesson-detail, .student-card__voice, .student-card__status, .course-kicker,
  .hero-stat, .count, .filename, .meta, .eyebrow) {
  max-width: 100%;
}

/* Dialogs/lightboxes stay usable on short laptop and phone viewports. */
.amv-view-shell :where(.modal, .dialog, .drawer, .lightbox, .lightbox__content,
  .modal__content, .dialog__content, [role='dialog']) {
  max-width: min(100%, 100vw);
}

.amv-view-shell :where(.modal__content, .dialog__content, .lightbox__content,
  [role='dialog']) {
  max-height: calc(100dvh - 28px);
  overflow-y: auto;
  overscroll-behavior: contain;
}

/* Public pages: a cleaner editorial frame around content-heavy sections. */
.amv-view-shell :where(.hero, .hero-panel, .calendar-hero, .resources-hero, .amv-hero,
  .students__header, .gradebook__hero, .classes-header, .contact-hero, .training-hero,
  .academy-hero, .inscription-hero) {
  isolation: isolate;
}

.amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid) {
  min-width: 0;
}

/* Mobile-first resilience. Existing view-specific breakpoints still win where more
   specific rules exist, while these defaults catch edge cases and tiny screens. */
@media (max-width: 760px) {
  .amv-view-shell {
    overflow-x: clip;
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 22px;
  }

  .amv-view-shell :where(.hero__grid, .hero-panel__grid, .resources-hero__grid,
    .calendar-layout, .quiz-layout, .program-layout, .student-profile__grid,
    .dashboard-grid, .content-grid, .page-grid, .split-layout) {
    grid-template-columns: minmax(0, 1fr) !important;
  }

  .amv-view-shell :where(.hero-actions, .actions, .action-row, .form-actions,
    .footer-actions, .question-actions, .students__header-actions, .hero-stat,
    .calendar-toolbar, .resources-controls__row) {
    flex-wrap: wrap;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    min-width: min(100%, 190px);
  }

  .amv-view-shell :where(.display-title, .page-title, .hero-title, .section-title,
    .hero-panel__title, .amv-hero h1, .calendar-hero h1, .students__header h1,
    .gradebook__hero h1) {
    font-size: clamp(1.8rem, 7vw, 3rem);
    line-height: 1.05;
  }

  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .amv-view-shell :where(.students-toolbar, .resources-controls, .calendar-toolbar,
    .gradebook-legacy-toolbar, .classes-header, .section-heading, .profile-actions) {
    gap: 10px;
  }

  .amv-view-shell :where(input, select, textarea, .select, .search-input) {
    min-height: 44px;
  }
}

@media (max-width: 520px) {
  .amv-view-shell :where(.metric-grid, .focus-grid, .student-grid, .resource-grid,
    .lessons-list, .quiz-stack, .summary-grid, .insight-row, .calendar-insight-row,
    .format__grid, .sound__grid, .skills__grid, .productions__grid) {
    grid-template-columns: minmax(0, 1fr);
  }

  .amv-view-shell :where(.hero, .hero-panel, .amv-hero, .calendar-hero,
    .resources-hero, .classes-header, .students__header, .gradebook__hero) {
    border-radius: 18px;
  }

  .amv-view-shell :where(.card, .panel, .surface, .summary-card, .metric-card,
    .focus-card, .next-class-card, .insight-card, .agenda-card, .quiz-card,
    .resource-card, .student-card, .lesson-card, .task-card, .format-card,
    .production, .state-card, .empty-card) {
    border-radius: 16px;
  }

  .amv-view-shell :where(.hero-actions > *, .form-actions > *, .footer-actions > *,
    .question-actions > *, .result-action > *, .result-next-step__actions > *) {
    width: 100%;
    min-width: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .amv-view-shell,
  .amv-view-shell :where(*, *::before, *::after) {
    scroll-behavior: auto !important;
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
  }
}
</style>
