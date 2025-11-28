<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useFormValidation } from '../../composables/useFormValidation'
import AuthFormContainer from './AuthFormContainer.vue'
import Input from '../../shared/Input.vue'
import Button from '../../shared/Button.vue'
import Alert from '../../shared/Alert.vue'

const router = useRouter()
const { updatePassword, loading, error, clearError } = useAuth()
const { validateRequired, validateMinLength, validateMatch } = useFormValidation()

const formData = ref({
  password: '',
  confirmPassword: ''
})

const formErrors = ref({})
const successMessage = ref('')
const hasRecoveryToken = ref(false)

onMounted(() => {
  const hash = window.location.hash

  if (hash.includes('access_token') && hash.includes('type=recovery')) {
    hasRecoveryToken.value = true
  } else {
    router.push('/recuperar-senha')
  }
})

const validateForm = () => {
  formErrors.value = {}

  formErrors.value.password = validateRequired(formData.value.password, 'Senha') ||
      validateMinLength(formData.value.password, 6, 'Senha')

  formErrors.value.confirmPassword = validateRequired(formData.value.confirmPassword, 'Confirmação') ||
      validateMatch(formData.value.password, formData.value.confirmPassword, 'Senhas')

  Object.keys(formErrors.value).forEach(key => {
    if (!formErrors.value[key]) delete formErrors.value[key]
  })

  return Object.keys(formErrors.value).length === 0
}

const handleSubmit = async () => {
  clearError()
  successMessage.value = ''

  if (!validateForm()) return

  const result = await updatePassword(formData.value.password)

  if (result.success) {
    successMessage.value = 'Senha alterada com sucesso! Redirecionando...'
    formData.value.password = ''
    formData.value.confirmPassword = ''

    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}

const isFormValid = computed(() => {
  return formData.value.password && formData.value.confirmPassword
})
</script>

<template>
  <AuthFormContainer
      title="Nova senha"
      subtitle="Crie uma nova senha segura para sua conta."
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
          v-model="formData.password"
          type="password"
          label="Nova senha"
          placeholder="Mínimo 6 caracteres"
          :error="formErrors.password"
          @input="delete formErrors.password"
      />

      <Input
          v-model="formData.confirmPassword"
          type="password"
          label="Confirmar senha"
          placeholder="Repita a nova senha"
          :error="formErrors.confirmPassword"
          @input="delete formErrors.confirmPassword"
      />

      <Button
          type="submit"
          variant="primary"
          size="lg"
          full-width
          :disabled="!isFormValid"
          :loading="loading"
      >
        <span v-if="!loading">Redefinir senha</span>
        <span v-else>Atualizando...</span>
      </Button>
    </form>
  </AuthFormContainer>
</template>