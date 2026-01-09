<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <RLogo class="mx-auto h-12 w-auto" />
        <RHeading level="2" class="mt-6 text-center">
          Criar nova senha
        </RHeading>
        <RText class="mt-2 text-center text-sm text-gray-600">
          Digite sua nova senha abaixo
        </RText>
      </div>

      <!-- Mensagem de sucesso -->
      <RAlertBanner
          v-if="resetSuccess"
          variant="success"
          message="Senha alterada com sucesso! Redirecionando para login..."
      />

      <!-- Mensagem de erro -->
      <RAlertBanner
          v-if="resetError"
          variant="error"
          :message="resetError"
          @close="resetError = null"
      />

      <!-- Token inválido -->
      <RAlertBanner
          v-if="!hasValidToken && !isLoading"
          variant="error"
          message="Link de recuperação inválido ou expirado. Solicite um novo link."
      />

      <!-- Formulário -->
      <form
          v-if="hasValidToken && !resetSuccess"
          class="mt-8 space-y-6"
          @submit.prevent="handleSubmit"
      >
        <div class="space-y-4">
          <RPasswordInput
              v-model="password"
              label="Nova senha"
              name="password"
              autocomplete="new-password"
              placeholder="••••••••"
              :error="errors.password"
              :disabled="isLoading"
              required
          />

          <RPasswordInput
              v-model="passwordConfirmation"
              label="Confirmar nova senha"
              name="password-confirmation"
              autocomplete="new-password"
              placeholder="••••••••"
              :error="errors.passwordConfirmation"
              :disabled="isLoading"
              required
          />

          <!-- Requisitos de senha -->
          <div class="mt-2 text-sm text-gray-600 space-y-1">
            <RText size="sm">Sua senha deve conter:</RText>
            <ul class="list-disc list-inside space-y-1 text-xs">
              <li :class="password.length >= 6 ? 'text-green-600' : ''">
                No mínimo 6 caracteres
              </li>
              <li :class="password === passwordConfirmation && password.length > 0 ? 'text-green-600' : ''">
                Senhas devem coincidir
              </li>
            </ul>
          </div>
        </div>

        <div class="space-y-4">
          <RButton
              type="submit"
              variant="primary"
              size="lg"
              class="w-full"
              :loading="isLoading"
              :disabled="isLoading || !isFormValid"
          >
            Alterar senha
          </RButton>

          <RButton
              variant="ghost"
              size="md"
              class="w-full"
              :disabled="isLoading"
              @click="router.push({ name: 'login' })"
          >
            Voltar para login
          </RButton>
        </div>
      </form>

      <!-- Sem token válido -->
      <div v-if="!hasValidToken && !isLoading" class="space-y-4">
        <RButton
            variant="primary"
            size="lg"
            class="w-full"
            @click="router.push({ name: 'forgot-password' })"
        >
          Solicitar novo link
        </RButton>

        <RButton
            variant="ghost"
            size="md"
            class="w-full"
            @click="router.push({ name: 'login' })"
        >
          Voltar para login
        </RButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

import { toast } from 'vue-sonner'

// Components
import RLogo from '@/components/atoms/icons/RLogo.vue'
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RPasswordInput from '@/components/molecules/forms/RPasswordInput.vue'
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'
import {useUpdatePassword} from "@api/queries/auth.js";

// Router
const router = useRouter()
const route = useRoute()

// Form state
const password = ref('')
const passwordConfirmation = ref('')
const errors = ref({})
const resetError = ref(null)
const resetSuccess = ref(false)
const hasValidToken = ref(false)

// TanStack Query mutation
const updatePasswordMutation = useUpdatePassword()

// Computed
const isLoading = computed(() => updatePasswordMutation.isPending.value)

const isFormValid = computed(() => {
  return (
      password.value.length >= 6 &&
      password.value === passwordConfirmation.value
  )
})

// Methods
const validateForm = () => {
  errors.value = {}

  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
  } else if (password.value.length < 6) {
    errors.value.password = 'Senha deve ter no mínimo 6 caracteres'
  }

  if (password.value !== passwordConfirmation.value) {
    errors.value.passwordConfirmation = 'Senhas não coincidem'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  resetError.value = null

  if (!validateForm()) {
    return
  }

  try {
    const result = await updatePasswordMutation.mutateAsync(password.value)

    if (result.success) {
      resetSuccess.value = true
      toast.success('Senha alterada com sucesso! 🎉')

      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push({ name: 'login' })
      }, 2000)
    } else {
      resetError.value = result.error || 'Erro ao alterar senha. Tente novamente.'
    }
  } catch (error) {
    console.error('Erro ao alterar senha:', error)
    resetError.value = 'Erro ao alterar senha. Tente novamente.'
  }
}

// Verificar token na URL
onMounted(() => {
  // Supabase envia o access_token como hash fragment
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const accessToken = hashParams.get('access_token')

  // Ou pode vir como query parameter
  const queryToken = route.query.token || route.query.access_token

  hasValidToken.value = !!(accessToken || queryToken)

  if (!hasValidToken.value) {
    toast.error('Link de recuperação inválido ou expirado')
  }
})
</script>