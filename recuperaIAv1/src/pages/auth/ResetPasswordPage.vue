<template>
  <RAuthLayout show-back-button>
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
        <RErrorState
            title="Link inválido ou expirado"
            message="O link de recuperação é inválido ou já expirou. Solicite um novo link para continuar."
        />

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
        <RSuccessState
            title="Senha alterada com sucesso!"
            message="Sua senha foi redefinida. Você será redirecionado para o login em instantes."
        />

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
                show-strength
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
            <RText size="sm" class="requirements-title">
              Requisitos da senha:
            </RText>
            <ul class="requirements-list">
              <li :class="{ 'requirement-met': password.length >= 6 }">
                <RIcon
                    :name="password.length >= 6 ? 'check-circle' : 'circle'"
                    :size="16"
                />
                <span>Mínimo de 6 caracteres</span>
              </li>
              <li :class="{ 'requirement-met': hasUpperCase }">
                <RIcon
                    :name="hasUpperCase ? 'check-circle' : 'circle'"
                    :size="16"
                />
                <span>Pelo menos uma letra maiúscula</span>
              </li>
              <li :class="{ 'requirement-met': hasLowerCase }">
                <RIcon
                    :name="hasLowerCase ? 'check-circle' : 'circle'"
                    :size="16"
                />
                <span>Pelo menos uma letra minúscula</span>
              </li>
              <li :class="{ 'requirement-met': hasNumber }">
                <RIcon
                    :name="hasNumber ? 'check-circle' : 'circle'"
                    :size="16"
                />
                <span>Pelo menos um número</span>
              </li>
              <li :class="{ 'requirement-met': passwordsMatch && password.length > 0 }">
                <RIcon
                    :name="passwordsMatch && password.length > 0 ? 'check-circle' : 'circle'"
                    :size="16"
                />
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
import RIcon from '@/components/atoms/icons/RIcon.vue'

// Components - Molecules
import RPasswordInput from '@/components/molecules/forms/RPasswordInput.vue'
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'
import RLoadingState from '@/components/molecules/feedback/RLoadingState.vue'
import RErrorState from '@/components/molecules/feedback/RErrorState.vue'
import RSuccessState from '@/components/molecules/feedback/RSuccessState.vue'

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
  color: var(--text-primary);
  margin-bottom: var(--spacing-2);
}

.auth-subtitle {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
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
  background-color: var(--border-light);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  transition: all var(--duration-normal) var(--easing-out);
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
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--border-light);
}

.requirements-title {
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--spacing-2);
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
  color: var(--text-tertiary);
  font-size: var(--font-size-sm);
  transition: var(--transition-fast);
}

.requirements-list li.requirement-met {
  color: var(--color-success);
  font-weight: var(--font-weight-medium);
}

.requirements-list li :deep(svg) {
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
  gap: var(--spacing-6);
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
}
</style>