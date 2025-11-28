<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useFormValidation } from '../../composables/useFormValidation'
import AuthFormContainer from './AuthFormContainer.vue'
import Input from '../../shared/Input.vue'
import Button from '../../shared/Button.vue'
import Alert from '../../shared/Alert.vue'

const router = useRouter()
const { resetPassword, loading, error, clearError } = useAuth()
const { validateRequired, validateEmail } = useFormValidation()

const email = ref('')
const formErrors = ref({})
const successMessage = ref('')

const validateForm = () => {
  formErrors.value = {}

  const emailError = validateRequired(email.value, 'E-mail') || validateEmail(email.value)
  if (emailError) formErrors.value.email = emailError

  return Object.keys(formErrors.value).length === 0
}

const handleSubmit = async () => {
  clearError()
  successMessage.value = ''

  if (!validateForm()) return

  const result = await resetPassword(email.value)

  if (result.success) {
    successMessage.value = 'Link de recuperação enviado! Verifique sua caixa de entrada.'
    email.value = ''

    setTimeout(() => router.push('/login'), 5000)
  }
}

const isFormValid = computed(() => !!email.value)
</script>

<template>
  <AuthFormContainer
      title="Recuperar senha"
      subtitle="Insira seu e-mail e enviaremos um link para você redefinir sua senha."
      show-back-button
      back-route="/login"
  >
    <Alert
        v-if="error"
        type="error"
        :message="error"
        class="mb-6"
    />

    <Alert
        v-if="successMessage"
        type="success"
        :message="successMessage"
        class="mb-6"
    />

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <Input
          v-model="email"
          type="email"
          label="E-mail cadastrado"
          placeholder="seu@email.com"
          icon="mail"
          :error="formErrors.email"
          @input="delete formErrors.email"
      />

      <Button
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :disabled="!isFormValid"
          :loading="loading"
      >
        <span v-if="!loading">Enviar link de recuperação</span>
        <span v-else>Enviando...</span>
      </Button>
    </form>

    <template #footer>
      <router-link
          to="/login"
          class="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center gap-2 group"
      >
        Lembrou sua senha? <span class="text-primary group-hover:underline">Entrar agora</span>
      </router-link>
    </template>
  </AuthFormContainer>
</template>