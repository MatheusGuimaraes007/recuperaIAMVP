<template>
  <RAuthLayout>
    <!-- Header Slot -->
    <template #header>
      <RHeading level="2" class="auth-title">
        Entre na sua conta
      </RHeading>
      <RText class="auth-subtitle">
        Bem-vindo de volta! Insira seus dados para continuar.
      </RText>
    </template>

    <!-- Content Slot -->
    <template #content>
      <!-- Alert de erro global -->
      <RAlertBanner
          v-if="loginError"
          variant="error"
          :message="loginError"
          dismissible
          @close="loginError = null"
          class="auth-alert"
      />

      <!-- Formulário de Login -->
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

        <!-- Senha -->
        <RPasswordInput
            v-model="password"
            label="Senha"
            name="password"
            autocomplete="current-password"
            placeholder="Digite sua senha"
            :error="errors.password"
            :disabled="isLoading"
            required
        />

        <!-- Lembrar-me + Esqueceu senha -->
        <div class="auth-options">
          <div class="auth-remember">
            <RCheckbox
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                :disabled="isLoading"
            />
            <RLabel for="remember-me" class="remember-label">
              Lembrar de mim
            </RLabel>
          </div>

          <RLink
              :to="{ name: 'forgot-password' }"
              class="auth-forgot-link"
          >
            Esqueceu a senha?
          </RLink>
        </div>

        <!-- Botão de Login -->
        <RButton
            type="submit"
            variant="primary"
            size="lg"
            full-width
            :loading="isLoading"
            :disabled="isLoading || !isFormValid"
        >
          {{ isLoading ? 'Entrando...' : 'Entrar na Plataforma' }}
        </RButton>
      </form>
    </template>
  </RAuthLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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
import RCheckbox from '@/components/atoms/inputs/RCheckbox.vue'
import RLabel from '@/components/atoms/typography/RLabel.vue'

// Components - Molecules
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RPasswordInput from '@/components/molecules/forms/RPasswordInput.vue'
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'

// ============================================================================
// SETUP
// ============================================================================

const router = useRouter()
const { login, isLoading } = useAuth()

// ============================================================================
// STATE
// ============================================================================

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errors = ref({})
const loginError = ref(null)

// ============================================================================
// COMPUTED
// ============================================================================

const isFormValid = computed(() => {
  return email.value.length > 0 && password.value.length >= 6
})

// ============================================================================
// METHODS
// ============================================================================

/**
 * Validar formulário
 */
const validateForm = () => {
  errors.value = {}

  // Validar email
  if (!email.value) {
    errors.value.email = 'E-mail é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'E-mail inválido'
  }

  // Validar senha
  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
  } else if (password.value.length < 6) {
    errors.value.password = 'Senha deve ter no mínimo 6 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

/**
 * Submeter formulário
 */
const handleSubmit = async () => {
  loginError.value = null

  // Validar
  if (!validateForm()) {
    return
  }

  try {
    // Fazer login usando composable
    const result = await login(email.value, password.value, {
      showToast: false // Vamos mostrar toast customizado
    })

    if (result.success) {
      // Salvar "lembrar-me" se marcado
      if (rememberMe.value) {
        localStorage.setItem('remember_email', email.value)
      } else {
        localStorage.removeItem('remember_email')
      }

      // Toast de sucesso customizado
      toast.success('Login realizado com sucesso! 🎉', {
        description: 'Redirecionando para o painel...'
      })

      // Redirecionar (o composable já faz isso, mas garantimos aqui)
      const redirectTo = router.currentRoute.value.query.redirect || '/dashboard'
      await router.push(redirectTo)
    } else {
      // Mostrar erro
      loginError.value = result.error || 'Erro ao fazer login. Verifique suas credenciais.'
    }
  } catch (error) {
    console.error('❌ Erro no login:', error)
    loginError.value = 'Erro inesperado ao fazer login. Tente novamente.'
  }
}

// ============================================================================
// LIFECYCLE
// ============================================================================

onMounted(() => {
  // Carregar email se "lembrar-me" estava ativo
  const rememberedEmail = localStorage.getItem('remember_email')
  if (rememberedEmail) {
    email.value = rememberedEmail
    rememberMe.value = true
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

/* Opções (Lembrar-me + Esqueceu senha) */
.auth-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: calc(var(--spacing-2) * -1); /* Reduzir espaço acima */
}

.auth-remember {
  display: flex;
  align-items: center;
  gap: var(--spacing-2);
}

.remember-label {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  user-select: none;
}

.auth-forgot-link {
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  transition: var(--transition-fast);
}

.auth-forgot-link:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

@media (max-width: 640px) {
  .auth-options {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-3);
  }

  .auth-forgot-link {
    align-self: flex-end;
  }
}
</style>