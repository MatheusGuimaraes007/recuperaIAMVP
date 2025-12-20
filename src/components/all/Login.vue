<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useAuthStore } from '../../stores/useAuthStore'
import { useFormValidation } from '../../composables/useFormValidation'
import Input from '../../shared/Input.vue'
import Button from '../../shared/Button.vue'
import Alert from '../../shared/Alert.vue'
import AuthFormContainer from './AuthFormContainer.vue'
const router = useRouter()
const authStore = useAuthStore()

const {
  login,
  loading,
  error,
  clearError,
} = useAuth()

const { validateRequired, validateEmail, validateMinLength } = useFormValidation()

const formData = ref({
  email: '',
  password: ''
})

const formErrors = ref({})

const validateForm = () => {
  formErrors.value = {}

  formErrors.value.email = validateRequired(formData.value.email, 'Email') ||
      validateEmail(formData.value.email)

  formErrors.value.password = validateRequired(formData.value.password, 'Senha') ||
      validateMinLength(formData.value.password, 6, 'Senha')

  Object.keys(formErrors.value).forEach(key => {
    if (!formErrors.value[key]) delete formErrors.value[key]
  })

  return Object.keys(formErrors.value).length === 0
}

const handleSubmit = async () => {
  clearError()

  if (!validateForm()) return


  const result = await login(formData.value.email, formData.value.password)

  if (result.success) {
    const isUserAdmin = await isAdminUser();
    if (isUserAdmin) {
      router.push('/admin/dashboard');
    } else {
      await router.push({ name: 'Oportunidades' })
    }
  } else {
    console.error('❌ Erro no login:', result.error)
  }
}

const isFormValid = computed(() => {
  return formData.value.email && formData.value.password
})
</script>

<template>
  <AuthFormContainer
      title="Acesse sua conta"
      subtitle="Bem-vindo de volta! Insira seus dados para continuar."
  >
    <Alert
        v-if="error"
        type="error"
        :message="error"
        class="mb-4"
    />

    <form @submit.prevent="handleSubmit" class="space-y-4">
      <Input
          v-model="formData.email"
          type="email"
          label="Email"
          placeholder="seu@email.com"
          icon="email"
          :error="formErrors.email"
          @input="delete formErrors.email"
      />

      <Input
          v-model="formData.password"
          type="password"
          label="Senha"
          placeholder="Sua senha"
          :error="formErrors.password"
          @input="delete formErrors.password"
      />

      <div class="text-right">
        <router-link
            to="/recuperar-senha"
            class="text-sm font-medium text-primary hover:text-primary-hover hover:underline transition-colors"
        >
          Esqueceu sua senha?
        </router-link>
      </div>

      <Button
          type="submit"
          variant="primary"
          size="lg"
          :disabled="!isFormValid"
          :loading="loading"
          full-width
      >
        <span v-if="!loading">Entrar</span>
        <span v-else>Entrando...</span>
      </Button>
    </form>

    <template #footer>
    </template>
  </AuthFormContainer>
</template>