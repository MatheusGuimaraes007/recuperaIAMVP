<template>
  <RAuthLayout show-back-button>
    <!-- Header Slot -->
    <template #header>
      <RHeading level="2" class="auth-title">
        Recuperar senha
      </RHeading>
      <RText class="auth-subtitle">
        Digite seu e-mail e enviaremos um link para redefinir sua senha
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
              :error="errors.email"
              :disabled="isLoading"
              required
          />

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

            <RButton
                variant="ghost"
                size="md"
                full-width
                :disabled="isLoading"
                @click="router.push({ name: 'login' })"
            >
              Voltar para login
            </RButton>
          </div>
        </form>
      </div>

      <!-- Estado: Sucesso -->
      <div v-else class="success-container">
        <!-- Alert de sucesso -->
        <RAlertBanner
            variant="success"
            dismissible
            class="auth-alert"
        >
          <template #default>
            <div class="success-content">
              <RHeading level="6" class="success-title">
                E-mail enviado com sucesso!
              </RHeading>
              <RText size="sm" class="success-text">
                Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                Se não receber em alguns minutos, verifique sua pasta de spam.
              </RText>
            </div>
          </template>
        </RAlertBanner>

        <!-- Info adicional -->
        <div class="success-info">
          <RText size="sm" class="info-text">
            E-mail enviado para: <strong>{{ email }}</strong>
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
   SUCCESS STATE
   ============================================================================= */

.success-container {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-6);
}

.success-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.success-title {
  color: var(--color-success-700);
  font-weight: var(--font-weight-semibold);
}

.success-text {
  color: var(--text-secondary);
  line-height: var(--line-height-relaxed);
}

.success-info {
  padding: var(--spacing-4);
  background-color: var(--bg-tertiary);
  border-radius: var(--radius-md);
  text-align: center;
}

.info-text {
  color: var(--text-secondary);
}

.info-text strong {
  color: var(--text-primary);
  font-weight: var(--font-weight-semibold);
}

/* =============================================================================
   FOOTER
   ============================================================================= */

.auth-footer-text {
  text-align: center;
  margin-top: var(--spacing-6);
}

.footer-text {
  color: var(--text-secondary);
}

.footer-link {
  color: var(--color-primary);
  font-weight: var(--font-weight-semibold);
  text-decoration: none;
  margin-left: var(--spacing-1);
  transition: var(--transition-fast);
}

.footer-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* =============================================================================
   RESPONSIVE
   ============================================================================= */

@media (max-width: 640px) {
  .success-info {
    padding: var(--spacing-3);
  }
}
</style>