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

      <!-- ✅ USANDO O COMPONENTE RLoginForm PRONTO -->
      <RLoginForm
        @submit="handleSubmit"
        @forgot-password="router.push({ name: 'forgot-password' })"
      />
    </template>
  </RAuthLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue-sonner'

// Composables
import { useAuth } from '@/composables/core/useAuth'

// Components - Layout
import RAuthLayout from '@/components/templates/layouts/RAuthLayout.vue'

// Components - Atoms
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'

// Components - Molecules
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'

// Components - Organisms
import RLoginForm from '@/components/organisms/forms/RLoginForm.vue'

// ============================================================================
// SETUP
// ============================================================================

const router = useRouter()
const route = useRoute()
const { login, isLoading } = useAuth()

// ============================================================================
// STATE
// ============================================================================

const loginError = ref(null)

// ============================================================================
// METHODS
// ============================================================================

/**
 * Submeter formulário
 */
const handleSubmit = async (values) => {
  loginError.value = null

  try {
    console.log('🔑 Tentando login com:', values.email)

    // Fazer login usando composable
    const result = await login(values.email, values.password, {
      showToast: false // Vamos mostrar toast customizado
    })

    if (result.success) {
      // Toast de sucesso customizado
      toast.success('Login realizado com sucesso! 🎉', {
        description: 'Redirecionando para o painel...'
      })

      // Redirecionar
      const redirectTo = route.query.redirect || '/dashboard'

      // Limpar query params de redirect
      await router.replace(redirectTo)
    } else {
      // Mostrar erro
      loginError.value = result.error || 'Credenciais inválidas. Verifique seu e-mail e senha.'
    }
  } catch (error) {
    console.error('❌ Erro no login:', error)
    loginError.value = 'Erro inesperado ao fazer login. Tente novamente.'
  }
}
</script>

<style scoped>
/* =============================================================================
   AUTH PAGE STYLES
   ============================================================================= */

/* Títulos */
.auth-title {
  color: var(--color-text-primary, #111827);
  margin-bottom: var(--spacing-2, 8px);
}

.auth-subtitle {
  color: var(--color-text-secondary, #6b7280);
  font-size: var(--font-size-sm, 14px);
  line-height: 1.6;
}

/* Alert */
.auth-alert {
  margin-bottom: var(--spacing-6, 24px);
}
</style>