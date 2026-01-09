<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <RLogo class="mx-auto h-12 w-auto" />
        <RHeading level="2" class="mt-6 text-center">
          Recuperar senha
        </RHeading>
        <RText class="mt-2 text-center text-sm text-gray-600">
          Digite seu email e enviaremos um link para resetar sua senha
        </RText>
      </div>

      <!-- Mensagem de sucesso -->
      <RAlertBanner
          v-if="resetSuccess"
          variant="success"
          message="Email de recuperação enviado! Verifique sua caixa de entrada."
      />

      <!-- Mensagem de erro -->
      <RAlertBanner
          v-if="resetError"
          variant="error"
          :message="resetError"
          @close="resetError = null"
      />

      <!-- Formulário -->
      <form v-if="!resetSuccess" class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="space-y-4">
          <RFormField
              v-model="email"
              label="Email"
              type="email"
              name="email"
              autocomplete="email"
              placeholder="seu@email.com"
              :error="errors.email"
              :disabled="isLoading"
              required
          />
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
            Enviar link de recuperação
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

      <!-- Após sucesso -->
      <div v-if="resetSuccess" class="space-y-4">
        <RButton
            variant="primary"
            size="lg"
            class="w-full"
            @click="router.push({ name: 'login' })"
        >
          Ir para login
        </RButton>

        <RButton
            variant="ghost"
            size="md"
            class="w-full"
            @click="resetForm"
        >
          Enviar para outro email
        </RButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

import { toast } from 'vue-sonner'

// Components
import RLogo from '@/components/atoms/icons/RLogo.vue'
import RHeading from '@/components/atoms/typography/RHeading.vue'
import RText from '@/components/atoms/typography/RText.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'
import {useResetPassword} from "@api/queries/auth.js";

// Router
const router = useRouter()

// Form state
const email = ref('')
const errors = ref({})
const resetError = ref(null)
const resetSuccess = ref(false)

// TanStack Query mutation
const resetPasswordMutation = useResetPassword()

// Computed
const isLoading = computed(() => resetPasswordMutation.isPending.value)

const isFormValid = computed(() => {
  return email.value.length > 0 && /\S+@\S+\.\S+/.test(email.value)
})

// Methods
const validateForm = () => {
  errors.value = {}

  if (!email.value) {
    errors.value.email = 'Email é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Email inválido'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  resetError.value = null

  if (!validateForm()) {
    return
  }

  try {
    const result = await resetPasswordMutation.mutateAsync(email.value)

    if (result.success) {
      resetSuccess.value = true
      toast.success('Email enviado com sucesso! 📧')
    } else {
      resetError.value = result.error || 'Erro ao enviar email. Tente novamente.'
    }
  } catch (error) {
    console.error('Erro ao resetar senha:', error)
    resetError.value = 'Erro ao enviar email. Tente novamente.'
  }
}

const resetForm = () => {
  email.value = ''
  resetSuccess.value = false
  resetError.value = null
  errors.value = {}
}
</script>