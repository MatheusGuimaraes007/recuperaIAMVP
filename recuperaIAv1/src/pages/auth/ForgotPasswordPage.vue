<template>
  <RAuthLayout show-back-button :back-route="{ name: 'login' }">
    <!-- Header Slot -->
    <template #header>
      <RHeading level="2" class="auth-title">
        Recuperar senha
      </RHeading>
      <RText class="auth-subtitle">
        Digite seu e-mail e enviaremos um link seguro para redefinir sua senha
      </RText>
    </template>

    <!-- Content Slot -->
    <template #content>
      <!-- Estado: Formulário -->
      <div v-if="!resetSuccess" class="forgot-form-container">
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
          <!-- Email -->
          <RFormField
            v-model="email"
            label="E-mail"
            type="email"
            name="email"
            autocomplete="email"
            placeholder="seu@email.com"
            icon-left="mail"
            :error="errors.email"
            :disabled="isLoading"
            required
          />

          <!-- Info Box -->
          <div class="info-box">
            <RText size="sm" class="info-text">
              💡 Enviaremos um link válido por 1 hora para o e-mail cadastrado
            </RText>
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
              {{ isLoading ? 'Enviando...' : 'Enviar link de recuperação' }}
            </RButton>
          </div>
        </form>
      </div>

      <!-- Estado: Sucesso -->
      <div v-else class="success-container">
        <!-- Success Icon -->
        <div class="success-icon-wrapper">
          <div class="success-icon">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="32" fill="#E8F5E9"/>
              <circle cx="32" cy="32" r="24" fill="#00C853"/>
              <path d="M24 32L29 37L40 26" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
        </div>

        <!-- Success Content -->
        <div class="success-content">
          <RHeading level="3" class="success-title">
            E-mail enviado com sucesso!
          </RHeading>
          <RText size="base" class="success-description">
            Enviamos um link de recuperação para:
          </RText>
          <div class="email-badge">
            <RText size="sm" weight="semibold" class="email-text">
              {{ email }}
            </RText>
          </div>
          <RText size="sm" class="success-instructions">
            Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
            Se não receber em alguns minutos, verifique sua pasta de spam.
          </RText>
        </div>

        <!-- Botões -->
        <div class="button-group">
          <RButton
            variant="primary"
            size="lg"
            full-width
            @click="router.push({ name: 'login' })"
          >
            Ir para login
          </RButton>

          <RButton
            variant="ghost"
            size="md"
            full-width
            @click="resetForm"
          >
            Enviar para outro e-mail
          </RButton>
        </div>
      </div>
    </template>

    <!-- Footer Slot -->
    <template #footer>
      <div class="auth-footer-text">
        <RText size="sm" class="footer-text">
          Lembrou sua senha?
          <RLink :to="{ name: 'login' }" class="footer-link">
            Fazer login
          </RLink>
        </RText>
      </div>
    </template>
  </RAuthLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'

// Composables
import { useAuth } from '@/composables/core/useAuth'

// Components - Layout
import RAuthLayout from '@/components/templates/layouts/RAuthLayout.vue'

// Components - Atoms
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RLink from '@/components/atoms/typography/RLink.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'

// Components - Molecules
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'

// ============================================================================
// SETUP
// ============================================================================

const router = useRouter()
const { resetPassword, isLoading } = useAuth()

// ============================================================================
// STATE
// ============================================================================

const email = ref('')
const errors = ref({})
const resetError = ref(null)
const resetSuccess = ref(false)

// ============================================================================
// COMPUTED
// ============================================================================

const isFormValid = computed(() => {
  return email.value.length > 0 && /\S+@\S+\.\S+/.test(email.value)
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Validar formulário
 */
const validateForm = () => {
  errors.value = {}

  if (!email.value) {
    errors.value.email = 'E-mail é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'E-mail inválido'
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
    // Enviar email de recuperação
    const result = await resetPassword(email.value, {
      showToast: false // Vamos mostrar feedback customizado
    })

    if (result.success) {
      resetSuccess.value = true

      toast.success('E-mail enviado! 📧', {
        description: 'Verifique sua caixa de entrada'
      })
    } else {
      resetError.value = result.error || 'Erro ao enviar e-mail. Tente novamente.'
    }
  } catch (error) {
    console.error('❌ Erro ao resetar senha:', error)
    resetError.value = 'Erro inesperado ao enviar e-mail. Tente novamente.'
  }
}

/**
 * Resetar formulário para novo envio
 */
const resetForm = () => {
  email.value = ''
  resetSuccess.value = false
  resetError.value = null
  errors.value = {}
}
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

/* Info Box */
.info-box {
  padding: var(--spacing-4);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
}

.info-text {
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.button-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
  margin-top: var(--spacing-2);
}

/* =============================================================================
   SUCCESS STATE
   ============================================================================= */

.success-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
  text-align: center;
}

.success-icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: var(--spacing-2);
}

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

.success-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.success-title {
  color: var(--color-primary);
  font-weight: 700;
}

.success-description {
  color: var(--color-text-secondary);
}

.email-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-4);
  background-color: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-primary);
  margin: var(--spacing-2) auto;
}

.email-text {
  color: var(--color-primary);
}

.success-instructions {
  color: var(--color-text-secondary);
  line-height: 1.6;
  max-width: 400px;
  margin: 0 auto;
}

/* =============================================================================
   FOOTER
   ============================================================================= */

.auth-footer-text {
  text-align: center;
  padding-top: var(--spacing-4);
}

.footer-text {
  color: var(--color-text-secondary);
}

.footer-link {
  color: var(--color-primary);
  font-weight: 600;
  text-decoration: none;
  margin-left: 4px;
  transition: all var(--transition-fast);
}

.footer-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */

@media (max-width: 640px) {
  .success-icon svg {
    width: 48px;
    height: 48px;
  }

  .info-box {
    padding: var(--spacing-3);
  }

  .success-instructions {
    font-size: var(--font-size-xs);
  }
}
</style>