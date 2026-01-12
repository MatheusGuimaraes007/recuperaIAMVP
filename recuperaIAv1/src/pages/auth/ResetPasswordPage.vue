<template>
  <RAuthLayout show-back-button :back-route="{ name: 'login' }">
    <!-- Header Slot -->
    <template #header>
      <RHeading level="2" class="auth-title">
        Criar nova senha
      </RHeading>
      <RText class="auth-subtitle">
        Digite sua nova senha abaixo. Escolha uma senha forte e segura.
      </RText>
    </template>

    <!-- Content Slot -->
    <template #content>
      <!-- Estado: Carregando validação de token -->
      <div v-if="isValidatingToken" class="loading-container">
        <RLoadingState message="Validando link de recuperação..." />
      </div>

      <!-- Estado: Token inválido -->
      <div v-else-if="!hasValidToken" class="invalid-token-container">
        <div class="error-icon-wrapper">
          <div class="error-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#FFEBEE"/>
              <circle cx="32" cy="32" r="24" fill="#F44336"/>
              <path d="M26 26L38 38M38 26L26 38" stroke="white" stroke-width="3" stroke-linecap="round"/>
            </svg>
          </div>
        </div>

        <div class="error-content">
          <RHeading level="3" class="error-title">
            Link inválido ou expirado
          </RHeading>
          <RText size="base" class="error-description">
            O link de recuperação é inválido ou já expirou. Links de recuperação são válidos por apenas 1 hora.
          </RText>
        </div>

        <div class="button-group">
          <RButton
            variant="primary"
            size="lg"
            full-width
            @click="router.push({ name: 'forgot-password' })"
          >
            Solicitar novo link
          </RButton>

          <RButton
            variant="ghost"
            size="md"
            full-width
            @click="router.push({ name: 'login' })"
          >
            Voltar para login
          </RButton>
        </div>
      </div>

      <!-- Estado: Sucesso -->
      <div v-else-if="resetSuccess" class="success-container">
        <div class="success-icon-wrapper">
          <div class="success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#E8F5E9"/>
              <circle cx="32" cy="32" r="24" fill="#00C853"/>
              <path d="M24 32L29 37L40 26" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <div class="success-content">
          <RHeading level="3" class="success-title">
            Senha alterada com sucesso!
          </RHeading>
          <RText size="base" class="success-description">
            Sua senha foi redefinida com segurança. Você será redirecionado para o login em instantes.
          </RText>
        </div>

        <RButton
          variant="primary"
          size="lg"
          full-width
          @click="router.push({ name: 'login' })"
        >
          Ir para login agora
        </RButton>
      </div>

      <!-- Estado: Formulário -->
      <div v-else class="reset-form-container">
        <!-- Alert de erro -->
        <RAlertBanner
          v-if="resetError"
          variant="error"
          :message="resetError"
          dismissible
          @close="resetError = null"
          class="auth-alert"
        />

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="auth-form">
          <!-- Nova senha -->
          <div class="password-field-wrapper">
            <RPasswordInput
              v-model="password"
              label="Nova senha"
              name="password"
              autocomplete="new-password"
              placeholder="Digite sua nova senha"
              :error="errors.password"
              :disabled="isLoading"
              required
            />

            <!-- Indicador de força da senha -->
            <div v-if="password.length > 0" class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="passwordStrengthClass"
                  :style="{ width: `${passwordStrengthPercent}%` }"
                ></div>
              </div>
              <RText size="xs" :class="passwordStrengthClass">
                {{ passwordStrengthText }}
              </RText>
            </div>
          </div>

          <!-- Confirmar senha -->
          <RPasswordInput
            v-model="passwordConfirmation"
            label="Confirmar nova senha"
            name="password-confirmation"
            autocomplete="new-password"
            placeholder="Digite novamente sua senha"
            :error="errors.passwordConfirmation"
            :disabled="isLoading"
            required
          />

          <!-- Requisitos de senha -->
          <div class="password-requirements">
            <RText size="sm" weight="medium" class="requirements-title">
              Requisitos da senha:
            </RText>
            <ul class="requirements-list">
              <li :class="{ 'requirement-met': password.length >= 6 }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" :stroke="password.length >= 6 ? '#00C853' : '#CED4DA'" stroke-width="2"/>
                  <path v-if="password.length >= 6" d="M5 8L7 10L11 6" stroke="#00C853" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Mínimo de 6 caracteres</span>
              </li>
              <li :class="{ 'requirement-met': hasUpperCase }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" :stroke="hasUpperCase ? '#00C853' : '#CED4DA'" stroke-width="2"/>
                  <path v-if="hasUpperCase" d="M5 8L7 10L11 6" stroke="#00C853" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Pelo menos uma letra maiúscula</span>
              </li>
              <li :class="{ 'requirement-met': hasLowerCase }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" :stroke="hasLowerCase ? '#00C853' : '#CED4DA'" stroke-width="2"/>
                  <path v-if="hasLowerCase" d="M5 8L7 10L11 6" stroke="#00C853" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Pelo menos uma letra minúscula</span>
              </li>
              <li :class="{ 'requirement-met': hasNumber }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" :stroke="hasNumber ? '#00C853' : '#CED4DA'" stroke-width="2"/>
                  <path v-if="hasNumber" d="M5 8L7 10L11 6" stroke="#00C853" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Pelo menos um número</span>
              </li>
              <li :class="{ 'requirement-met': passwordsMatch && password.length > 0 }">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="7" :stroke="passwordsMatch && password.length > 0 ? '#00C853' : '#CED4DA'" stroke-width="2"/>
                  <path v-if="passwordsMatch && password.length > 0" d="M5 8L7 10L11 6" stroke="#00C853" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Senhas coincidem</span>
              </li>
            </ul>
          </div>

          <!-- Botões -->
          <div class="button-group">
            <RButton
              type="submit"
              variant="primary"
              size="lg"
              full-width
              :loading="isLoading"
              :disabled="isLoading || !isFormValid"
            >
              {{ isLoading ? 'Alterando...' : 'Alterar senha' }}
            </RButton>

            <RButton
              variant="ghost"
              size="md"
              full-width
              :disabled="isLoading"
              @click="router.push({ name: 'login' })"
            >
              Cancelar
            </RButton>
          </div>
        </form>
      </div>
    </template>
  </RAuthLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

// Composables
import { useAuth } from '@/composables/core/useAuth'

// Components - Layout
import RAuthLayout from '@/components/templates/layouts/RAuthLayout.vue'

// Components - Atoms
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'

// Components - Molecules
import RPasswordInput from '@/components/molecules/forms/RPasswordInput.vue'
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'
import RLoadingState from '@/components/molecules/feedback/RLoadingState.vue'

// ============================================================================
// SETUP
// ============================================================================

const router = useRouter()
const route = useRoute()
const { updatePassword, isLoading } = useAuth()

// ============================================================================
// STATE
// ============================================================================

const password = ref('')
const passwordConfirmation = ref('')
const errors = ref({})
const resetError = ref(null)
const resetSuccess = ref(false)
const hasValidToken = ref(false)
const isValidatingToken = ref(true)

// ============================================================================
// COMPUTED - Validações de senha
// ============================================================================

const hasUpperCase = computed(() => /[A-Z]/.test(password.value))
const hasLowerCase = computed(() => /[a-z]/.test(password.value))
const hasNumber = computed(() => /[0-9]/.test(password.value))
const passwordsMatch = computed(() =>
  password.value === passwordConfirmation.value && password.value.length > 0
)

const passwordStrength = computed(() => {
  let strength = 0
  if (password.value.length >= 6) strength++
  if (password.value.length >= 8) strength++
  if (hasUpperCase.value) strength++
  if (hasLowerCase.value) strength++
  if (hasNumber.value) strength++
  if (/[^A-Za-z0-9]/.test(password.value)) strength++ // Caractere especial
  return strength
})

const passwordStrengthPercent = computed(() => {
  return (passwordStrength.value / 6) * 100
})

const passwordStrengthClass = computed(() => {
  if (passwordStrength.value <= 2) return 'strength-weak'
  if (passwordStrength.value <= 4) return 'strength-medium'
  return 'strength-strong'
})

const passwordStrengthText = computed(() => {
  if (passwordStrength.value <= 2) return 'Senha fraca'
  if (passwordStrength.value <= 4) return 'Senha média'
  return 'Senha forte'
})

const isFormValid = computed(() => {
  return (
    password.value.length >= 6 &&
    hasUpperCase.value &&
    hasLowerCase.value &&
    hasNumber.value &&
    passwordsMatch.value
  )
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Validar formulário
 */
const validateForm = () => {
  errors.value = {}

  // Validar senha
  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
  } else if (password.value.length < 6) {
    errors.value.password = 'Senha deve ter no mínimo 6 caracteres'
  } else if (!hasUpperCase.value) {
    errors.value.password = 'Senha deve conter pelo menos uma letra maiúscula'
  } else if (!hasLowerCase.value) {
    errors.value.password = 'Senha deve conter pelo menos uma letra minúscula'
  } else if (!hasNumber.value) {
    errors.value.password = 'Senha deve conter pelo menos um número'
  }

  // Validar confirmação
  if (password.value !== passwordConfirmation.value) {
    errors.value.passwordConfirmation = 'As senhas não coincidem'
  }

  return Object.keys(errors.value).length === 0
}

/**
 * Submeter formulário
 */
const handleSubmit = async () => {
  resetError.value = null

  // Validar
  if (!validateForm()) {
    return
  }

  try {
    // Atualizar senha
    const result = await updatePassword(password.value, {
      showToast: false // Vamos mostrar feedback customizado
    })

    if (result.success) {
      resetSuccess.value = true

      toast.success('Senha alterada com sucesso! 🎉', {
        description: 'Redirecionando para o login...'
      })

      // Redirecionar após 3 segundos
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 3000)
    } else {
      resetError.value = result.error || 'Erro ao alterar senha. Tente novamente.'
    }
  } catch (error) {
    console.error('❌ Erro ao alterar senha:', error)
    resetError.value = 'Erro inesperado ao alterar senha. Tente novamente.'
  }
}

/**
 * Validar token na URL
 */
const validateToken = () => {
  // Supabase envia o access_token como hash fragment
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const accessToken = hashParams.get('access_token')

  // Ou pode vir como query parameter
  const queryToken = route.query.token || route.query.access_token

  return !!(accessToken || queryToken)
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(async () => {
  // Simular validação (pode adicionar chamada API se necessário)
  await new Promise(resolve => setTimeout(resolve, 500))

  hasValidToken.value = validateToken()
  isValidatingToken.value = false

  if (!hasValidToken.value) {
    toast.error('Link de recuperação inválido ou expirado', {
      description: 'Solicite um novo link para continuar'
    })
  }
})
</script>

<style scoped>
/* =============================================================================
   AUTH PAGE STYLES
   ============================================================================= */

/* Títulos */
.auth-title {
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-2);
}

.auth-subtitle {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.6;
}

/* Alert */
.auth-alert {
  margin-bottom: var(--spacing-6);
}

/* Formulário */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-top: var(--spacing-2);
}

/* =============================================================================
   PASSWORD STRENGTH
   ============================================================================= */

.password-field-wrapper {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.password-strength {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-1);
}

.strength-bar {
  height: 4px;
  background-color: var(--color-border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: width var(--transition-normal), background-color var(--transition-normal);
  border-radius: var(--radius-full);
}

.strength-weak {
  color: var(--color-error);
}

.strength-weak.strength-fill {
  background-color: var(--color-error);
}

.strength-medium {
  color: var(--color-warning);
}

.strength-medium.strength-fill {
  background-color: var(--color-warning);
}

.strength-strong {
  color: var(--color-success);
}

.strength-strong.strength-fill {
  background-color: var(--color-success);
}

/* =============================================================================
   PASSWORD REQUIREMENTS
   ============================================================================= */

.password-requirements {
  padding: var(--spacing-4);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.requirements-title {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-3);
}

.requirements-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.requirements-list li {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-sm);
  transition: color var(--transition-fast);
}

.requirements-list li.requirement-met {
  color: var(--color-success);
  font-weight: 500;
}

.requirements-list li svg {
  flex-shrink: 0;
}

/* =============================================================================
   STATES
   ============================================================================= */

.loading-container,
.invalid-token-container,
.success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-6);
  text-align: center;
}

.error-icon-wrapper,
.success-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-2);
}

.error-icon,
.success-icon {
  animation: scaleIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleIn {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.error-content,
.success-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.error-title {
  color: var(--color-error);
  font-weight: 700;
}

.success-title {
  color: var(--color-primary);
  font-weight: 700;
}

.error-description,
.success-description {
  color: var(--color-text-secondary);
  max-width: 400px;
  line-height: 1.6;
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */

@media (max-width: 640px) {
  .password-requirements {
    padding: var(--spacing-3);
  }

  .requirements-list {
    gap: var(--spacing-1);
  }

  .error-icon svg,
  .success-icon svg {
    width: 48px;
    height: 48px;
  }
}
</style>