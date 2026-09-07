<template>
  <main class="activate-account">
    <section class="activate-account__shell" aria-labelledby="activation-title">
      <header class="activate-account__header">
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
            <h1 id="activation-title">Activa tu cuenta</h1>
            <p class="activate-account__lead">
              Configura tu contraseña personal para ingresar por primera vez a tu espacio académico.
            </p>
          </div>
        </div>

        <div class="activate-account__secure-chip">
          <span>✓</span>
          <div>
            <small>ACCESO SEGURO</small>
            <strong>Cuenta protegida</strong>
          </div>
        </div>
      </header>

      <div class="activate-account__content">
        <section class="activate-account__main-card">
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
              <span class="activate-account__welcome-mark" aria-hidden="true">AMV</span>
              <div>
                <small>BIENVENIDO/A</small>
                <strong>
                  {{ displayName ? `Hola, ${displayName}` : 'Bienvenido/a' }}
                </strong>
                <p>
                  Solo falta crear tu contraseña para terminar la activación.
                </p>
              </div>
            </div>

            <div class="activate-account__field">
              <div class="activate-account__field-heading">
                <label for="new-password">Nueva contraseña</label>
                <span>Obligatorio</span>
              </div>

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
              <div class="activate-account__requirements-heading">
                <div>
                  <small>SEGURIDAD</small>
                  <strong>Requisitos de contraseña</strong>
                </div>
                <span
                  class="activate-account__strength"
                  :class="{ 'is-complete': passwordIsStrong }"
                >
                  {{ passwordIsStrong ? 'Completa' : 'En progreso' }}
                </span>
              </div>

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
              <div class="activate-account__field-heading">
                <label for="confirm-password">Confirmar contraseña</label>
                <span>Verificación</span>
              </div>

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
              <span>!</span>
              <div>
                <strong>Revisa la información</strong>
                <p>{{ formError }}</p>
              </div>
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
              <span v-if="!isSubmitting" aria-hidden="true">→</span>
            </button>

            <p class="activate-account__privacy">
              <span>✓</span>
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
            <p class="activate-account__eyebrow">CUENTA ACTIVADA</p>
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
              <span>→</span>
            </button>
          </div>
        </section>

        <aside class="activate-account__side-card" aria-label="Información sobre tu acceso">
          <div class="activate-account__side-badge">AMV</div>

          <div>
            <p class="activate-account__eyebrow">TU ESPACIO ACADÉMICO</p>
            <h2>Tu aula empieza aquí</h2>
            <p>
              Una vez activada tu cuenta podrás revisar clases, materiales,
              tareas, evaluaciones y tu progreso académico desde un solo lugar.
            </p>
          </div>

          <div class="activate-account__side-list">
            <article>
              <span>01</span>
              <div>
                <strong>Acceso personal</strong>
                <p>Tu cuenta queda asociada exclusivamente a tu perfil académico.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Contenido organizado</strong>
                <p>Clases, recursos y evaluaciones disponibles según tu curso.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <strong>Seguimiento continuo</strong>
                <p>Consulta asistencia, calificaciones y avances desde el Aula Virtual.</p>
              </div>
            </article>
          </div>

          <div class="activate-account__side-footer">
            <span class="activate-account__status-dot"></span>
            Plataforma académica Amo Mi Voz
          </div>
        </aside>
      </div>
    </section>
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
// validateInvitation() mostrará*
// el mensaje correspondiente.*

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
  --ink: #152033;
  --ink-soft: #344359;
  --muted: #6f7c8f;
  --muted-2: #8c98a9;
  --line: #dbe3ec;
  --line-strong: #cbd6e2;
  --surface: #ffffff;
  --surface-soft: #f6f8fb;
  --wine: #9f1945;
  --wine-dark: #7f1237;
  --gold: #d9a91d;
  --gold-dark: #9a7000;
  --gold-soft: #fff8e7;
  --green: #2d8a63;
  --green-soft: #edf8f3;
  --danger: #b94656;
  --danger-soft: #fff3f5;

  min-height: 100vh;
  padding: 34px;
  color: var(--ink);
  background:
    radial-gradient(circle at 90% 8%, rgba(217, 169, 29, 0.08), transparent 28%),
    linear-gradient(180deg, #f3f6fa 0%, #edf2f7 100%);
}

.activate-account__shell {
  width: min(1180px, 100%);
  margin: 0 auto;
}

.activate-account__header {
  display: flex;
  gap: 26px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding: 24px 28px;
  border: 1px solid var(--line);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 10px 30px rgba(31, 48, 73, 0.05);
}

.activate-account__brand {
  display: flex;
  gap: 18px;
  align-items: center;
  min-width: 0;
}

.activate-account__logo-wrap {
  display: grid;
  width: 62px;
  height: 62px;
  flex: 0 0 auto;
  place-items: center;
  border: 1px solid #e5d18b;
  border-radius: 16px;
  background: var(--gold-soft);
}

.activate-account__logo {
  width: 46px;
  height: 46px;
  object-fit: contain;
}

.activate-account__eyebrow {
  margin: 0 0 6px;
  color: var(--gold-dark);
  font-size: 0.63rem;
  font-weight: 900;
  letter-spacing: 0.16em;
}

.activate-account h1,
.activate-account h2 {
  margin: 0;
  color: var(--ink);
  letter-spacing: -0.035em;
}

.activate-account h1 {
  font-size: clamp(2rem, 4vw, 3.2rem);
  line-height: 1;
}

.activate-account__lead {
  max-width: 670px;
  margin: 8px 0 0;
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

.activate-account__secure-chip {
  display: flex;
  gap: 10px;
  align-items: center;
  flex: 0 0 auto;
  padding: 11px 13px;
  border: 1px solid #cde4d6;
  border-radius: 12px;
  background: var(--green-soft);
}

.activate-account__secure-chip > span {
  display: grid;
  width: 28px;
  height: 28px;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: var(--green);
  font-size: 0.65rem;
  font-weight: 900;
}

.activate-account__secure-chip small,
.activate-account__secure-chip strong {
  display: block;
}

.activate-account__secure-chip small {
  color: #5c8c72;
  font-size: 0.48rem;
  font-weight: 900;
  letter-spacing: 0.1em;
}

.activate-account__secure-chip strong {
  margin-top: 2px;
  color: #286747;
  font-size: 0.67rem;
}

.activate-account__content {
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.65fr);
  gap: 18px;
  align-items: stretch;
}

.activate-account__main-card,
.activate-account__side-card {
  border: 1px solid var(--line);
  border-radius: 22px;
  background: #fff;
  box-shadow: 0 14px 38px rgba(31, 48, 73, 0.06);
}

.activate-account__main-card {
  padding: 28px;
}

.activate-account__form {
  display: grid;
  gap: 22px;
}

.activate-account__welcome {
  display: flex;
  gap: 14px;
  align-items: center;
  padding: 17px;
  border: 1px solid #ead89d;
  border-radius: 15px;
  background:
    linear-gradient(135deg, #fffdf7 0%, #fff8e7 100%);
}

.activate-account__welcome-mark {
  display: grid;
  width: 46px;
  height: 46px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 13px;
  color: #6f5200;
  background: #f2d263;
  font-size: 0.69rem;
  font-weight: 900;
}

.activate-account__welcome small,
.activate-account__welcome strong {
  display: block;
}

.activate-account__welcome small {
  margin-bottom: 3px;
  color: var(--gold-dark);
  font-size: 0.5rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.activate-account__welcome strong {
  color: var(--ink);
  font-size: 0.95rem;
}

.activate-account__welcome p {
  margin: 4px 0 0;
  color: var(--muted);
  font-size: 0.74rem;
}

.activate-account__field {
  display: grid;
  gap: 8px;
}

.activate-account__field-heading {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
}

.activate-account__field label {
  color: var(--ink-soft);
  font-size: 0.78rem;
  font-weight: 800;
}

.activate-account__field-heading span {
  color: var(--muted-2);
  font-size: 0.55rem;
  font-weight: 700;
}

.activate-account__input-wrap {
  display: flex;
  overflow: hidden;
  border: 1px solid var(--line-strong);
  border-radius: 12px;
  background: #fbfcfe;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.activate-account__input-wrap:focus-within {
  border-color: #aec0d3;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(63, 111, 168, 0.08);
}

.activate-account__input-wrap input {
  min-width: 0;
  flex: 1;
  padding: 14px 15px;
  border: 0;
  outline: 0;
  color: var(--ink);
  background: transparent;
  font: inherit;
}

.activate-account__input-wrap input::placeholder {
  color: #9aa6b7;
}

.activate-account__toggle {
  padding: 0 15px;
  border: 0;
  border-left: 1px solid #e3e8ee;
  color: var(--wine);
  background: transparent;
  font: inherit;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
}

.activate-account__requirements {
  padding: 16px;
  border: 1px solid #e3e8ee;
  border-radius: 14px;
  background: #f8fafc;
}

.activate-account__requirements-heading {
  display: flex;
  justify-content: space-between;
  gap: 15px;
  align-items: center;
  margin-bottom: 13px;
}

.activate-account__requirements-heading small,
.activate-account__requirements-heading strong {
  display: block;
}

.activate-account__requirements-heading small {
  color: var(--gold-dark);
  font-size: 0.48rem;
  font-weight: 900;
  letter-spacing: 0.12em;
}

.activate-account__requirements-heading strong {
  margin-top: 2px;
  color: var(--ink-soft);
  font-size: 0.74rem;
}

.activate-account__strength {
  padding: 5px 8px;
  border-radius: 999px;
  color: #746b4d;
  background: #fff5d6;
  font-size: 0.51rem;
  font-weight: 900;
}

.activate-account__strength.is-complete {
  color: #286747;
  background: #eaf7ef;
}

.activate-account__requirement-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 9px 14px;
}

.activate-account__requirement-grid span {
  display: flex;
  gap: 8px;
  align-items: center;
  color: #7f8997;
  font-size: 0.72rem;
}

.activate-account__requirement-grid span.is-valid {
  color: var(--green);
}

.activate-account__requirement-grid b {
  display: grid;
  width: 19px;
  height: 19px;
  place-items: center;
  border: 1px solid currentColor;
  border-radius: 50%;
  font-size: 0.5rem;
}

.activate-account__match {
  font-size: 0.68rem;
  font-weight: 750;
}

.activate-account__match.is-valid {
  color: var(--green);
}

.activate-account__match.is-invalid {
  color: var(--danger);
}

.activate-account__form-error {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 13px 14px;
  border: 1px solid #efccd2;
  border-radius: 12px;
  background: var(--danger-soft);
}

.activate-account__form-error > span {
  display: grid;
  width: 25px;
  height: 25px;
  flex: 0 0 auto;
  place-items: center;
  border-radius: 50%;
  color: #fff;
  background: var(--danger);
  font-size: 0.6rem;
  font-weight: 900;
}

.activate-account__form-error strong {
  display: block;
  color: #8f3040;
  font-size: 0.7rem;
}

.activate-account__form-error p {
  margin: 3px 0 0;
  color: #8b5e65;
  font-size: 0.65rem;
  line-height: 1.5;
}

.activate-account__primary-button,
.activate-account__secondary-button {
  display: inline-flex;
  min-height: 46px;
  gap: 9px;
  align-items: center;
  justify-content: center;
  padding: 0 18px;
  border-radius: 10px;
  font: inherit;
  font-weight: 850;
  text-decoration: none;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
}

.activate-account__primary-button {
  border: 1px solid var(--wine);
  color: #fff;
  background: var(--wine);
  box-shadow: 0 8px 20px rgba(159, 25, 69, 0.16);
}

.activate-account__primary-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: var(--wine-dark);
  box-shadow: 0 10px 24px rgba(159, 25, 69, 0.22);
}

.activate-account__primary-button:disabled {
  opacity: 0.42;
  cursor: not-allowed;
  box-shadow: none;
}

.activate-account__primary-button--wide {
  width: 100%;
}

.activate-account__secondary-button {
  margin-top: 14px;
  border: 1px solid var(--line-strong);
  color: var(--ink-soft);
  background: #fff;
}

.activate-account__privacy {
  display: flex;
  gap: 7px;
  align-items: center;
  justify-content: center;
  margin: -4px 0 0;
  color: var(--muted);
  font-size: 0.63rem;
}

.activate-account__privacy > span {
  color: var(--green);
  font-weight: 900;
}

.activate-account__state {
  display: flex;
  min-height: 240px;
  gap: 15px;
  align-items: flex-start;
  justify-content: center;
  padding: 34px;
  flex-direction: column;
}

.activate-account__state > div {
  max-width: 590px;
}

.activate-account__state strong {
  display: block;
  color: var(--ink);
  font-size: 1rem;
}

.activate-account__state p {
  margin: 5px 0 0;
  color: var(--muted);
  line-height: 1.6;
}

.activate-account__state-icon,
.activate-account__spinner {
  display: grid;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: 13px;
  color: var(--gold-dark);
  background: var(--gold-soft);
  font-size: 1rem;
  font-weight: 900;
}

.activate-account__state--error .activate-account__state-icon {
  color: #fff;
  background: var(--danger);
}

.activate-account__state--success .activate-account__state-icon {
  color: #fff;
  background: var(--green);
}

.activate-account__spinner {
  border: 3px solid #f0e6c7;
  border-top-color: var(--gold);
  animation: activate-spin 0.8s linear infinite;
}

.activate-account__button-spinner {
  width: 15px;
  height: 15px;
  border: 2px solid rgba(255,255,255,0.35);
  border-top-color: #fff;
  border-radius: 50%;
  animation: activate-spin 0.7s linear infinite;
}

.activate-account__success-screen {
  padding: 34px;
}

.activate-account__success-icon {
  display: grid;
  width: 62px;
  height: 62px;
  margin-bottom: 20px;
  place-items: center;
  border-radius: 18px;
  color: #fff;
  background: var(--green);
  font-size: 1.35rem;
  font-weight: 900;
  box-shadow: 0 10px 24px rgba(45, 138, 99, 0.18);
}

.activate-account__success-screen > p:not(.activate-account__eyebrow) {
  max-width: 590px;
  margin: 12px 0 22px;
  color: var(--muted);
  line-height: 1.65;
}

.activate-account__side-card {
  display: flex;
  flex-direction: column;
  padding: 28px;
  background:
    radial-gradient(circle at 90% 6%, rgba(217,169,29,.12), transparent 30%),
    linear-gradient(145deg, #ffffff 0%, #fbfcfe 68%, #fffaf0 100%);
}

.activate-account__side-badge {
  display: grid;
  width: 54px;
  height: 54px;
  margin-bottom: 26px;
  place-items: center;
  border: 1px solid #e3ca77;
  border-radius: 15px;
  color: #775800;
  background: var(--gold-soft);
  font-size: 0.72rem;
  font-weight: 900;
}

.activate-account__side-card h2 {
  font-size: clamp(1.7rem, 3vw, 2.35rem);
  line-height: 1;
}

.activate-account__side-card > div:nth-child(2) > p:last-child {
  margin: 12px 0 0;
  color: var(--muted);
  font-size: 0.76rem;
  line-height: 1.65;
}

.activate-account__side-list {
  display: grid;
  gap: 10px;
  margin-top: 24px;
}

.activate-account__side-list article {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 11px;
  padding: 13px;
  border: 1px solid #e3e8ee;
  border-radius: 12px;
  background: rgba(255,255,255,0.75);
}

.activate-account__side-list article > span {
  display: grid;
  width: 30px;
  height: 30px;
  place-items: center;
  border-radius: 9px;
  color: var(--gold-dark);
  background: var(--gold-soft);
  font-size: 0.54rem;
  font-weight: 900;
}

.activate-account__side-list strong {
  display: block;
  color: var(--ink-soft);
  font-size: 0.68rem;
}

.activate-account__side-list p {
  margin: 3px 0 0;
  color: var(--muted);
  font-size: 0.61rem;
  line-height: 1.5;
}

.activate-account__side-footer {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-top: auto;
  padding-top: 24px;
  color: var(--muted);
  font-size: 0.6rem;
}

.activate-account__status-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--green);
  box-shadow: 0 0 0 4px rgba(45,138,99,0.08);
}

@keyframes activate-spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 980px) {
  .activate-account {
    padding: 22px;
  }

  .activate-account__content {
    grid-template-columns: 1fr;
  }

  .activate-account__side-card {
    order: -1;
  }

  .activate-account__side-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .activate-account__side-footer {
    margin-top: 22px;
  }
}

@media (max-width: 700px) {
  .activate-account {
    padding: 14px;
  }

  .activate-account__header {
    align-items: flex-start;
    flex-direction: column;
    padding: 20px;
  }

  .activate-account__secure-chip {
    width: 100%;
  }

  .activate-account__main-card,
  .activate-account__side-card {
    border-radius: 18px;
  }

  .activate-account__main-card,
  .activate-account__side-card {
    padding: 20px;
  }

  .activate-account__requirement-grid,
  .activate-account__side-list {
    grid-template-columns: 1fr;
  }

  .activate-account__brand {
    align-items: flex-start;
  }

  .activate-account__logo-wrap {
    width: 52px;
    height: 52px;
    border-radius: 13px;
  }

  .activate-account__logo {
    width: 38px;
    height: 38px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .activate-account *,
  .activate-account *::before,
  .activate-account *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>