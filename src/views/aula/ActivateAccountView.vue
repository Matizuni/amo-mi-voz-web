<template>
  <main class="activate-account">
    <section class="activate-account__panel" aria-labelledby="activation-title">
      <div class="activate-account__brand">
        <div class="activate-account__logo-wrap">
          <img
            src="@/assets/images/logo.png"
            alt="Academia de Talentos Amo Mi Voz"
            class="activate-account__logo"
          />
        </div>

        <div>
          <p class="activate-account__eyebrow">
            AULA VIRTUAL · AMO MI VOZ
          </p>
          <h1 id="activation-title">
            Activa tu cuenta
          </h1>
          <p class="activate-account__lead">
            Crea tu contraseña personal para ingresar al Aula Virtual.
          </p>
        </div>
      </div>

      <div
        v-if="isLoading"
        class="activate-account__state"
        role="status"
        aria-live="polite"
      >
        <span class="activate-account__spinner" aria-hidden="true"></span>
        <div>
          <strong>Validando tu invitación</strong>
          <p>Estamos preparando tu acceso al Aula Virtual.</p>
        </div>
      </div>

      <div
        v-else-if="loadError"
        class="activate-account__state activate-account__state--error"
        role="alert"
      >
        <span class="activate-account__state-icon" aria-hidden="true">!</span>
        <div>
          <strong>No pudimos validar esta invitación</strong>
          <p>{{ loadError }}</p>

          <RouterLink
            to="/"
            class="activate-account__secondary-button"
          >
            Volver al sitio
          </RouterLink>
        </div>
      </div>

      <div
        v-else-if="isAlreadyActive"
        class="activate-account__state activate-account__state--success"
        role="status"
      >
        <span class="activate-account__state-icon" aria-hidden="true">✓</span>
        <div>
          <strong>Tu cuenta ya está activa</strong>
          <p>
            {{ displayName ? `${displayName}, ` : '' }}
            tu acceso ya está configurado. Puedes ingresar al Aula Virtual.
          </p>

          <button
            type="button"
            class="activate-account__primary-button"
            @click="goToClassroom"
          >
            Entrar al Aula Virtual
          </button>
        </div>
      </div>

      <form
        v-else-if="canActivate"
        class="activate-account__form"
        @submit.prevent="activateAccount"
        novalidate
      >
        <div class="activate-account__welcome">
          <span class="activate-account__welcome-mark" aria-hidden="true">♪</span>
          <div>
            <strong>
              {{ displayName ? `Hola, ${displayName}` : 'Bienvenido/a' }}
            </strong>
            <p>
              Solo falta crear tu contraseña para terminar la activación.
            </p>
          </div>
        </div>

        <div class="activate-account__field">
          <label for="new-password">
            Nueva contraseña
          </label>

          <div class="activate-account__input-wrap">
            <input
              id="new-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Crea una contraseña segura"
              :disabled="isSubmitting"
              @input="clearFormError"
            />

            <button
              type="button"
              class="activate-account__toggle"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              :aria-pressed="showPassword"
              @click="showPassword = !showPassword"
            >
              {{ showPassword ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>
        </div>

        <div class="activate-account__requirements" aria-label="Requisitos de contraseña">
          <p>Tu contraseña debe incluir:</p>

          <div class="activate-account__requirement-grid">
            <span :class="{ 'is-valid': passwordChecks.length }">
              <b aria-hidden="true">{{ passwordChecks.length ? '✓' : '○' }}</b>
              8 caracteres o más
            </span>

            <span :class="{ 'is-valid': passwordChecks.uppercase }">
              <b aria-hidden="true">{{ passwordChecks.uppercase ? '✓' : '○' }}</b>
              Una mayúscula
            </span>

            <span :class="{ 'is-valid': passwordChecks.lowercase }">
              <b aria-hidden="true">{{ passwordChecks.lowercase ? '✓' : '○' }}</b>
              Una minúscula
            </span>

            <span :class="{ 'is-valid': passwordChecks.number }">
              <b aria-hidden="true">{{ passwordChecks.number ? '✓' : '○' }}</b>
              Un número
            </span>
          </div>
        </div>

        <div class="activate-account__field">
          <label for="confirm-password">
            Confirmar contraseña
          </label>

          <div class="activate-account__input-wrap">
            <input
              id="confirm-password"
              v-model="passwordConfirmation"
              :type="showConfirmation ? 'text' : 'password'"
              autocomplete="new-password"
              placeholder="Escribe nuevamente tu contraseña"
              :disabled="isSubmitting"
              @input="clearFormError"
            />

            <button
              type="button"
              class="activate-account__toggle"
              :aria-label="showConfirmation ? 'Ocultar confirmación' : 'Mostrar confirmación'"
              :aria-pressed="showConfirmation"
              @click="showConfirmation = !showConfirmation"
            >
              {{ showConfirmation ? 'Ocultar' : 'Mostrar' }}
            </button>
          </div>

          <small
            v-if="passwordConfirmation"
            :class="[
              'activate-account__match',
              passwordsMatch ? 'is-valid' : 'is-invalid',
            ]"
          >
            {{ passwordsMatch
              ? '✓ Las contraseñas coinciden.'
              : 'Las contraseñas todavía no coinciden.' }}
          </small>
        </div>

        <div
          v-if="formError"
          class="activate-account__form-error"
          role="alert"
        >
          {{ formError }}
        </div>

        <button
          type="submit"
          class="activate-account__primary-button activate-account__primary-button--wide"
          :disabled="!canSubmit"
        >
          <span
            v-if="isSubmitting"
            class="activate-account__button-spinner"
            aria-hidden="true"
          ></span>

          {{ isSubmitting ? 'Activando cuenta...' : 'Crear contraseña y activar cuenta' }}
        </button>

        <p class="activate-account__privacy">
          Tu contraseña es privada. La Academia Amo Mi Voz no puede verla.
        </p>
      </form>

      <div
        v-if="activationComplete"
        class="activate-account__success-screen"
        role="status"
        aria-live="polite"
      >
        <div class="activate-account__success-icon" aria-hidden="true">✓</div>

        <p class="activate-account__eyebrow">
          CUENTA ACTIVADA
        </p>

        <h2>¡Todo listo!</h2>

        <p>
          Tu contraseña fue creada correctamente y tu cuenta del Aula Virtual
          ya está activa.
        </p>

        <button
          type="button"
          class="activate-account__primary-button"
          @click="goToClassroom"
        >
          Entrar al Aula Virtual
        </button>
      </div>
    </section>

    <aside class="activate-account__art" aria-hidden="true">
      <div class="activate-account__art-grid"></div>
      <div class="activate-account__note activate-account__note--one">♪</div>
      <div class="activate-account__note activate-account__note--two">♫</div>

      <div class="activate-account__art-copy">
        <span>ACADEMIA DE TALENTOS</span>
        <strong>AMO MI VOZ</strong>
        <p>Formación · Música · Comunidad</p>
      </div>
    </aside>
  </main>
</template>

<script setup>
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue'

import {
  useRouter,
} from 'vue-router'

import {
  supabase,
} from '@/lib/supabase'

const router =
  useRouter()

const isLoading =
  ref(true)

const isSubmitting =
  ref(false)

const loadError =
  ref('')

const formError =
  ref('')

const password =
  ref('')

const passwordConfirmation =
  ref('')

const showPassword =
  ref(false)

const showConfirmation =
  ref(false)

const profile =
  ref(null)

const activationComplete =
  ref(false)

let authSubscription =
  null

const displayName =
  computed(() =>
    String(
      profile.value?.display_name ||
      ''
    ).trim()
  )

const accountStatus =
  computed(() =>
    String(
      profile.value?.account_status ||
      ''
    )
      .trim()
      .toLowerCase()
  )

const isAlreadyActive =
  computed(() =>
    accountStatus.value ===
      'active' &&
    !activationComplete.value
  )

const canActivate =
  computed(() =>
    accountStatus.value ===
      'invited' &&
    !activationComplete.value
  )

const passwordChecks =
  computed(() => ({
    length:
      password.value.length >= 8,

    uppercase:
      /[A-ZÁÉÍÓÚÑ]/.test(
        password.value
      ),

    lowercase:
      /[a-záéíóúñ]/.test(
        password.value
      ),

    number:
      /\d/.test(
        password.value
      ),
  }))

const passwordIsStrong =
  computed(() =>
    Object
      .values(
        passwordChecks.value
      )
      .every(Boolean)
  )

const passwordsMatch =
  computed(() =>
    Boolean(
      password.value &&
      passwordConfirmation.value &&
      password.value ===
        passwordConfirmation.value
    )
  )

const canSubmit =
  computed(() =>
    canActivate.value &&
    passwordIsStrong.value &&
    passwordsMatch.value &&
    !isSubmitting.value
  )

function clearFormError() {
  formError.value = ''
}

async function getCurrentSession() {
  const {
    data,
    error,
  } =
    await supabase.auth
      .getSession()

  if (error) {
    throw error
  }

  return (
    data?.session ||
    null
  )
}

async function loadProfile(
  userId
) {
  const {
    data,
    error,
  } =
    await supabase
      .from('profiles')
      .select(`
        id,
        role,
        student_id,
        display_name,
        account_status,
        activated_at
      `)
      .eq(
        'id',
        userId
      )
      .maybeSingle()

  if (error) {
    throw error
  }

  if (!data) {
    throw new Error(
      'No encontramos el perfil asociado a esta invitación.'
    )
  }

  if (
    data.role !==
      'student'
  ) {
    throw new Error(
      'Este enlace no corresponde a una cuenta de estudiante.'
    )
  }

  profile.value =
    data
}

async function validateInvitation() {
  isLoading.value = true
  loadError.value = ''

  try {
    const session =
      await getCurrentSession()

    if (!session?.user?.id) {
      throw new Error(
        'El enlace de activación no es válido, expiró o ya fue utilizado. Solicita una nueva invitación a la Academia.'
      )
    }

    await loadProfile(
      session.user.id
    )

    if (
      accountStatus.value ===
        'inactive'
    ) {
      throw new Error(
        'Esta cuenta está deshabilitada. Comunícate con la Academia Amo Mi Voz.'
      )
    }

    if (
      ![
        'invited',
        'active',
      ].includes(
        accountStatus.value
      )
    ) {
      throw new Error(
        'El estado de esta cuenta no permite completar la activación.'
      )
    }
  } catch (error) {
    console.error(
      'Error validando activación:',
      error
    )

    loadError.value =
      error?.message ||
      'No fue posible validar esta invitación.'
  } finally {
    isLoading.value =
      false
  }
}

async function activateAccount() {
  if (
    !canSubmit.value
  ) {
    formError.value =
      'Revisa que la contraseña cumpla todos los requisitos y que ambas contraseñas coincidan.'

    return
  }

  isSubmitting.value =
    true

  formError.value =
    ''

  try {
    const {
      data: updateData,
      error: passwordError,
    } =
      await supabase.auth
        .updateUser({
          password:
            password.value,
        })

    if (
      passwordError ||
      !updateData?.user
    ) {
      throw (
        passwordError ||
        new Error(
          'No fue posible guardar la contraseña.'
        )
      )
    }

    const {
      data: activationData,
      error: activationError,
    } =
      await supabase
        .rpc(
          'activate_my_account'
        )

    if (activationError) {
      throw activationError
    }

    const activatedProfile =
      Array.isArray(
        activationData
      )
        ? activationData[0]
        : activationData

    profile.value = {
      ...profile.value,
      ...(activatedProfile ||
        {}),
      account_status:
        'active',
      activated_at:
        activatedProfile
          ?.activated_at ||
        new Date()
          .toISOString(),
    }

    password.value = ''
    passwordConfirmation.value = ''

    activationComplete.value =
      true
  } catch (error) {
    console.error(
      'Error activando cuenta:',
      error
    )

    const message =
      String(
        error?.message ||
        ''
      ).toLowerCase()

    if (
      message.includes(
        'same password'
      )
    ) {
      formError.value =
        'Elige una contraseña diferente a la que ya utilizabas.'
    } else if (
      message.includes(
        'password'
      )
    ) {
      formError.value =
        'Supabase rechazó la contraseña. Prueba con una contraseña más segura.'
    } else {
      formError.value =
        error?.message ||
        'No fue posible activar tu cuenta. Inténtalo nuevamente.'
    }
  } finally {
    isSubmitting.value =
      false
  }
}

async function goToClassroom() {
  await router.replace(
    '/aula'
  )
}

onMounted(async () => {
  const {
    data,
  } =
    supabase.auth
      .onAuthStateChange(
        async (
          event,
          session
        ) => {
          if (
            (
              event ===
                'SIGNED_IN' ||
              event ===
                'INITIAL_SESSION'
            ) &&
            session?.user?.id &&
            isLoading.value
          ) {
            try {
              await loadProfile(
                session.user.id
              )

              isLoading.value =
                false
            } catch {
              // validateInvitation() mostrará
              // el mensaje correspondiente.
            }
          }
        }
      )

  authSubscription =
    data?.subscription ||
    null

  await validateInvitation()
})

onBeforeUnmount(() => {
  authSubscription
    ?.unsubscribe()
})
</script>

<style scoped>
.activate-account {
  --gold: #f5c451;
  --gold-soft: rgba(245, 196, 81, 0.14);
  --gold-border: rgba(245, 196, 81, 0.28);
  --surface: #111111;
  --surface-2: #181818;
  --surface-3: #202020;
  --text: #f8f6ef;
  --muted: #b9b5aa;
  --danger: #ff7b7b;
  --success: #76d39b;

  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(0, 1.05fr) minmax(360px, 0.95fr);
  background:
    radial-gradient(circle at 12% 5%, rgba(245, 196, 81, 0.08), transparent 28%),
    #090909;
  color: var(--text);
}

.activate-account__panel {
  width: min(720px, calc(100% - 64px));
  margin: auto;
  padding: 64px 0;
}

.activate-account__brand {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 38px;
}

.activate-account__logo-wrap {
  width: 94px;
  height: 94px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border: 1px solid var(--gold-border);
  border-radius: 24px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.04), rgba(245, 196, 81, 0.05));
  box-shadow: 0 20px 70px rgba(0, 0, 0, 0.28);
}

.activate-account__logo {
  width: 72px;
  height: 72px;
  object-fit: contain;
}

.activate-account__eyebrow {
  margin: 0 0 8px;
  color: var(--gold);
  font-size: 0.76rem;
  font-weight: 800;
  letter-spacing: 0.18em;
}

.activate-account h1,
.activate-account h2 {
  margin: 0;
  font-weight: 800;
  letter-spacing: -0.035em;
}

.activate-account h1 {
  font-size: clamp(2.3rem, 5vw, 4.3rem);
  line-height: 0.98;
}

.activate-account h2 {
  font-size: clamp(2rem, 4vw, 3.2rem);
}

.activate-account__lead {
  max-width: 560px;
  margin: 14px 0 0;
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.65;
}

.activate-account__form {
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 28px;
  background: rgba(17, 17, 17, 0.9);
  box-shadow: 0 28px 100px rgba(0, 0, 0, 0.32);
  backdrop-filter: blur(18px);
}

.activate-account__welcome {
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 28px;
  padding: 18px;
  border: 1px solid var(--gold-border);
  border-radius: 18px;
  background: var(--gold-soft);
}

.activate-account__welcome-mark {
  width: 44px;
  height: 44px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--gold);
  color: #111;
  font-size: 1.35rem;
  font-weight: 900;
}

.activate-account__welcome strong,
.activate-account__state strong {
  display: block;
  margin-bottom: 3px;
  font-size: 1rem;
}

.activate-account__welcome p,
.activate-account__state p {
  margin: 0;
  color: var(--muted);
  line-height: 1.55;
}

.activate-account__field + .activate-account__field {
  margin-top: 22px;
}

.activate-account__field label {
  display: block;
  margin-bottom: 9px;
  font-weight: 750;
}

.activate-account__input-wrap {
  display: flex;
  align-items: stretch;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: 15px;
  background: var(--surface-2);
  transition: border-color 160ms ease, box-shadow 160ms ease;
}

.activate-account__input-wrap:focus-within {
  border-color: var(--gold);
  box-shadow: 0 0 0 4px rgba(245, 196, 81, 0.1);
}

.activate-account__input-wrap input {
  min-width: 0;
  flex: 1;
  border: 0;
  outline: 0;
  padding: 16px 17px;
  background: transparent;
  color: var(--text);
  font: inherit;
}

.activate-account__input-wrap input::placeholder {
  color: #77736a;
}

.activate-account__toggle {
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 16px;
  background: transparent;
  color: var(--gold);
  font: inherit;
  font-size: 0.84rem;
  font-weight: 800;
  cursor: pointer;
}

.activate-account__requirements {
  margin: 15px 0 22px;
  padding: 16px;
  border-radius: 16px;
  background: var(--surface-2);
}

.activate-account__requirements > p {
  margin: 0 0 11px;
  color: var(--muted);
  font-size: 0.86rem;
}

.activate-account__requirement-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px 16px;
}

.activate-account__requirement-grid span {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #8f8b82;
  font-size: 0.84rem;
}

.activate-account__requirement-grid span.is-valid {
  color: var(--success);
}

.activate-account__requirement-grid b {
  width: 18px;
  color: currentColor;
}

.activate-account__match {
  display: block;
  margin-top: 8px;
  font-weight: 700;
}

.activate-account__match.is-valid {
  color: var(--success);
}

.activate-account__match.is-invalid {
  color: var(--danger);
}

.activate-account__form-error {
  margin-top: 18px;
  padding: 14px 16px;
  border: 1px solid rgba(255, 123, 123, 0.28);
  border-radius: 14px;
  background: rgba(255, 123, 123, 0.08);
  color: #ffb0b0;
  line-height: 1.5;
}

.activate-account__primary-button,
.activate-account__secondary-button {
  min-height: 52px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  border-radius: 14px;
  font: inherit;
  font-weight: 850;
  text-decoration: none;
  cursor: pointer;
  transition: transform 160ms ease, opacity 160ms ease, box-shadow 160ms ease;
}

.activate-account__primary-button {
  border: 1px solid var(--gold);
  padding: 0 22px;
  background: var(--gold);
  color: #111;
  box-shadow: 0 14px 38px rgba(245, 196, 81, 0.14);
}

.activate-account__primary-button:hover:not(:disabled),
.activate-account__secondary-button:hover {
  transform: translateY(-1px);
}

.activate-account__primary-button:disabled {
  opacity: 0.42;
  cursor: not-allowed;
}

.activate-account__primary-button--wide {
  width: 100%;
  margin-top: 24px;
}

.activate-account__secondary-button {
  margin-top: 17px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 0 18px;
  background: var(--surface-3);
  color: var(--text);
}

.activate-account__privacy {
  margin: 15px 0 0;
  color: #88847b;
  font-size: 0.79rem;
  text-align: center;
}

.activate-account__state {
  display: flex;
  gap: 17px;
  align-items: flex-start;
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 22px;
  background: var(--surface);
}

.activate-account__state--error {
  border-color: rgba(255, 123, 123, 0.3);
}

.activate-account__state--success {
  border-color: rgba(118, 211, 155, 0.28);
}

.activate-account__state-icon,
.activate-account__spinner {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  flex: 0 0 auto;
  border-radius: 50%;
  background: var(--surface-3);
  color: var(--gold);
  font-size: 1.2rem;
  font-weight: 900;
}

.activate-account__state--error .activate-account__state-icon {
  color: var(--danger);
}

.activate-account__state--success .activate-account__state-icon {
  color: var(--success);
}

.activate-account__spinner {
  border: 3px solid rgba(245, 196, 81, 0.18);
  border-top-color: var(--gold);
  animation: activate-spin 0.8s linear infinite;
}

.activate-account__button-spinner {
  width: 17px;
  height: 17px;
  border: 2px solid rgba(17, 17, 17, 0.3);
  border-top-color: #111;
  border-radius: 50%;
  animation: activate-spin 0.7s linear infinite;
}

.activate-account__success-screen {
  padding: 38px;
  border: 1px solid rgba(118, 211, 155, 0.25);
  border-radius: 28px;
  background: linear-gradient(145deg, rgba(118, 211, 155, 0.08), rgba(17, 17, 17, 0.94));
}

.activate-account__success-screen > p:not(.activate-account__eyebrow) {
  max-width: 560px;
  margin: 14px 0 25px;
  color: var(--muted);
  line-height: 1.65;
}

.activate-account__success-icon {
  width: 62px;
  height: 62px;
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  border-radius: 50%;
  background: rgba(118, 211, 155, 0.12);
  color: var(--success);
  font-size: 1.7rem;
  font-weight: 900;
}

.activate-account__art {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  display: grid;
  place-items: end start;
  padding: 72px;
  border-left: 1px solid rgba(255, 255, 255, 0.07);
  background:
    radial-gradient(circle at 68% 25%, rgba(245, 196, 81, 0.18), transparent 25%),
    linear-gradient(155deg, #18140b 0%, #0f0f0f 48%, #070707 100%);
}

.activate-account__art-grid {
  position: absolute;
  inset: 0;
  opacity: 0.12;
  background-image:
    linear-gradient(rgba(245, 196, 81, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(245, 196, 81, 0.25) 1px, transparent 1px);
  background-size: 54px 54px;
  mask-image: linear-gradient(to bottom, black, transparent 88%);
}

.activate-account__art-copy {
  position: relative;
  z-index: 1;
}

.activate-account__art-copy span {
  display: block;
  margin-bottom: 6px;
  color: var(--gold);
  font-size: 0.76rem;
  font-weight: 850;
  letter-spacing: 0.2em;
}

.activate-account__art-copy strong {
  display: block;
  font-size: clamp(3rem, 6vw, 6.5rem);
  line-height: 0.9;
  letter-spacing: -0.06em;
}

.activate-account__art-copy p {
  margin: 16px 0 0;
  color: rgba(255, 255, 255, 0.65);
}

.activate-account__note {
  position: absolute;
  color: rgba(245, 196, 81, 0.12);
  font-weight: 900;
  line-height: 1;
  user-select: none;
}

.activate-account__note--one {
  top: 8%;
  right: 8%;
  font-size: 11rem;
  transform: rotate(12deg);
}

.activate-account__note--two {
  top: 42%;
  left: 12%;
  font-size: 8rem;
  transform: rotate(-12deg);
}

@keyframes activate-spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 980px) {
  .activate-account {
    grid-template-columns: 1fr;
  }

  .activate-account__art {
    display: none;
  }

  .activate-account__panel {
    width: min(720px, calc(100% - 40px));
  }
}

@media (max-width: 620px) {
  .activate-account__panel {
    width: min(100% - 28px, 720px);
    padding: 32px 0;
  }

  .activate-account__brand {
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 28px;
  }

  .activate-account__logo-wrap {
    width: 68px;
    height: 68px;
    border-radius: 18px;
  }

  .activate-account__logo {
    width: 52px;
    height: 52px;
  }

  .activate-account__form,
  .activate-account__success-screen {
    padding: 21px;
    border-radius: 21px;
  }

  .activate-account__requirement-grid {
    grid-template-columns: 1fr;
  }

  .activate-account__input-wrap {
    align-items: stretch;
  }

  .activate-account__toggle {
    padding: 0 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .activate-account *,
  .activate-account *::before,
  .activate-account *::after {
    scroll-behavior: auto !important;
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
