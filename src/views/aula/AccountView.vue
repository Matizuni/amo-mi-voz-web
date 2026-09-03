<template>
  <section class="account-page">
    <header class="account-header">
      <div>
        <span class="eyebrow">MI CUENTA</span>
        <h1>Seguridad de la cuenta</h1>
        <p>
          Desde aquí puedes actualizar la contraseña que utilizas
          para ingresar al Aula Virtual.
        </p>
      </div>

      <div class="security-status">
        <span class="security-status__icon">✓</span>

        <div>
          <strong>Sesión protegida</strong>
          <span>Supabase Auth</span>
        </div>
      </div>
    </header>

    <div class="account-layout">
      <!-- INFORMACIÓN -->
      <aside class="info-card">
        <span class="info-card__number">01</span>

        <div>
          <span class="eyebrow">ACCESO PERSONAL</span>

          <h2>Tu contraseña es privada.</h2>

          <p>
            Si la Academia te entregó una contraseña temporal,
            puedes reemplazarla por una contraseña personal.
          </p>
        </div>

        <div class="info-card__footer">
          <span>RECOMENDACIÓN</span>

          <p>
            No compartas tu contraseña con profesores,
            compañeros ni otras personas.
          </p>
        </div>
      </aside>

      <!-- CAMBIO DE CONTRASEÑA -->
      <article class="password-card">
        <div class="password-card__header">
          <span class="eyebrow">SEGURIDAD</span>

          <h2>Cambiar contraseña</h2>

          <p>
            Crea una nueva contraseña para tu cuenta.
          </p>
        </div>

        <form
          class="password-form"
          @submit.prevent="changePassword"
        >
          <!-- NUEVA CONTRASEÑA -->
          <div class="form-field">
            <label for="password">
              Nueva contraseña
            </label>

            <div class="input-wrapper">
              <input
                id="password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Escribe tu nueva contraseña"
              />

              <button
                type="button"
                class="show-button"
                @click="showPassword = !showPassword"
              >
                {{ showPassword ? 'Ocultar' : 'Ver' }}
              </button>
            </div>
          </div>

          <!-- CONFIRMACIÓN -->
          <div class="form-field">
            <label for="confirmation">
              Confirmar nueva contraseña
            </label>

            <div class="input-wrapper">
              <input
                id="confirmation"
                v-model="confirmation"
                :type="showConfirmation ? 'text' : 'password'"
                autocomplete="new-password"
                placeholder="Repite tu nueva contraseña"
              />

              <button
                type="button"
                class="show-button"
                @click="showConfirmation = !showConfirmation"
              >
                {{ showConfirmation ? 'Ocultar' : 'Ver' }}
              </button>
            </div>
          </div>

          <!-- REQUISITOS -->
          <div class="requirements">
            <div
              class="requirement"
              :class="{ 'is-valid': passwordIsLongEnough }"
            >
              <span>
                {{ passwordIsLongEnough ? '✓' : '○' }}
              </span>

              Mínimo 8 caracteres
            </div>

            <div
              class="requirement"
              :class="{ 'is-valid': passwordsMatch }"
            >
              <span>
                {{ passwordsMatch ? '✓' : '○' }}
              </span>

              Las contraseñas coinciden
            </div>
          </div>

          <!-- ERROR -->
          <div
            v-if="errorMessage"
            class="message message--error"
          >
            <strong>No pudimos actualizar la contraseña.</strong>
            <span>{{ errorMessage }}</span>
          </div>

          <!-- ÉXITO -->
          <div
            v-if="successMessage"
            class="message message--success"
          >
            <strong>Contraseña actualizada</strong>
            <span>{{ successMessage }}</span>
          </div>

          <button
            type="submit"
            class="submit-button"
            :disabled="!formIsValid || loading"
          >
            {{ loading ? 'Actualizando...' : 'Actualizar contraseña' }}
          </button>
        </form>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { supabase } from '@/lib/supabase'

const password = ref('')
const confirmation = ref('')

const showPassword = ref(false)
const showConfirmation = ref(false)

const loading = ref(false)

const errorMessage = ref('')
const successMessage = ref('')

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
  return passwordIsLongEnough.value && passwordsMatch.value
})

async function changePassword() {
  errorMessage.value = ''
  successMessage.value = ''

  if (!formIsValid.value) {
    errorMessage.value =
      'Revisa que la contraseña tenga al menos 8 caracteres y que ambas coincidan.'

    return
  }

  try {
    loading.value = true

    const { error } = await supabase.auth.updateUser({
      password: password.value,
    })

    if (error) {
      throw error
    }

    password.value = ''
    confirmation.value = ''

    successMessage.value =
      'Tu nueva contraseña quedó guardada correctamente.'
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)

    errorMessage.value =
      error?.message ||
      'Ocurrió un problema al actualizar la contraseña.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.account-page {
  width: min(1120px, calc(100% - 40px));
  margin-inline: auto;
  padding: 48px 0 80px;
  color: #f5f5f5;
}

.account-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 30px;
  margin-bottom: 32px;
}

.eyebrow {
  display: inline-block;
  margin-bottom: 10px;
  color: #dfb92f;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 0.18em;
}

.account-header h1 {
  max-width: 650px;
  margin: 0;
  color: #fff;
  font-size: clamp(2.2rem, 5vw, 3.7rem);
  line-height: 0.98;
}

.account-header > div:first-child > p {
  max-width: 620px;
  margin: 18px 0 0;
  color: #8f8f8f;
  line-height: 1.7;
}

.security-status {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
  padding: 13px 17px;
  border: 1px solid rgba(223, 185, 47, 0.18);
  border-radius: 12px;
  background: rgba(223, 185, 47, 0.045);
}

.security-status__icon {
  display: grid;
  width: 34px;
  height: 34px;
  place-items: center;
  border: 1px solid rgba(223, 185, 47, 0.45);
  border-radius: 50%;
  color: #dfb92f;
}

.security-status div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.security-status strong {
  color: #eee;
  font-size: 0.8rem;
}

.security-status div span {
  color: #666;
  font-size: 0.7rem;
}

.account-layout {
  display: grid;
  grid-template-columns: 0.72fr 1.28fr;
  gap: 22px;
}

.info-card,
.password-card {
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 22px;
  background:
    linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.035),
      rgba(255, 255, 255, 0.008)
    ),
    #0c0c0c;
}

.info-card {
  position: relative;
  display: flex;
  min-height: 480px;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 34px;
}

.info-card::after {
  position: absolute;
  top: -80px;
  right: -100px;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(223, 185, 47, 0.08);
  filter: blur(12px);
  content: '';
}

.info-card__number {
  position: relative;
  z-index: 1;
  color: #dfb92f;
  font-size: 3rem;
  font-weight: 900;
}

.info-card > div {
  position: relative;
  z-index: 1;
}

.info-card h2 {
  max-width: 300px;
  margin: 0;
  color: #fff;
  font-size: 2rem;
  line-height: 1.08;
}

.info-card p {
  margin: 16px 0 0;
  color: #898989;
  font-size: 0.9rem;
  line-height: 1.7;
}

.info-card__footer {
  padding-top: 22px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.info-card__footer > span {
  color: #626262;
  font-size: 0.65rem;
  font-weight: 900;
  letter-spacing: 0.14em;
}

.info-card__footer p {
  margin-top: 9px;
  font-size: 0.8rem;
}

.password-card {
  padding: 38px;
}

.password-card__header {
  margin-bottom: 30px;
}

.password-card__header h2 {
  margin: 0;
  color: #fff;
  font-size: 2rem;
}

.password-card__header p {
  margin: 9px 0 0;
  color: #818181;
  line-height: 1.6;
}

.password-form {
  display: flex;
  flex-direction: column;
  gap: 21px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.form-field label {
  color: #d6d6d6;
  font-size: 0.82rem;
  font-weight: 800;
}

.input-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.11);
  border-radius: 13px;
  background: rgba(0, 0, 0, 0.28);
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.input-wrapper:focus-within {
  border-color: rgba(223, 185, 47, 0.65);
  box-shadow: 0 0 0 3px rgba(223, 185, 47, 0.06);
}

.input-wrapper input {
  width: 100%;
  min-height: 57px;
  padding: 0 17px;
  border: 0;
  outline: 0;
  background: transparent;
  color: #fff;
  font: inherit;
}

.input-wrapper input::placeholder {
  color: #555;
}

.show-button {
  min-width: 82px;
  padding: 0 16px;
  border: 0;
  border-left: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
  color: #dfb92f;
  font-size: 0.76rem;
  font-weight: 900;
  cursor: pointer;
}

.requirements {
  display: grid;
  gap: 8px;
  padding: 16px 17px;
  border: 1px solid rgba(255, 255, 255, 0.055);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.018);
}

.requirement {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #686868;
  font-size: 0.8rem;
}

.requirement span {
  color: #5b5b5b;
}

.requirement.is-valid {
  color: #bcbcbc;
}

.requirement.is-valid span {
  color: #dfb92f;
}

.message {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 15px 17px;
  border-radius: 12px;
  font-size: 0.8rem;
  line-height: 1.5;
}

.message--error {
  border: 1px solid rgba(255, 88, 88, 0.18);
  background: rgba(255, 88, 88, 0.06);
  color: #ff9999;
}

.message--success {
  border: 1px solid rgba(223, 185, 47, 0.2);
  background: rgba(223, 185, 47, 0.06);
  color: #e7d57f;
}

.submit-button {
  min-height: 57px;
  margin-top: 2px;
  border: 0;
  border-radius: 12px;
  background: #dfb92f;
  color: #090909;
  font: inherit;
  font-weight: 900;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    opacity 0.2s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.32;
}

@media (max-width: 850px) {
  .account-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .account-layout {
    grid-template-columns: 1fr;
  }

  .info-card {
    min-height: 360px;
  }
}

@media (max-width: 600px) {
  .account-page {
    width: min(100% - 28px, 1120px);
    padding: 30px 0 55px;
  }

  .security-status {
    width: 100%;
  }

  .info-card,
  .password-card {
    padding: 25px;
  }

  .input-wrapper {
    grid-template-columns: 1fr;
  }

  .show-button {
    min-height: 42px;
    border-top: 1px solid rgba(255, 255, 255, 0.07);
    border-left: 0;
    text-align: left;
  }
}
</style>
