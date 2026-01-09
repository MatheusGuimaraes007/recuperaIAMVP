<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <!-- Logo -->
      <div class="text-center">
        <RLogo class="mx-auto h-12 w-auto" />
        <RHeading level="2" class="mt-6 text-center">
          Entre na sua conta
        </RHeading>
      </div>

      <!-- Mensagem de erro global -->
      <RAlertBanner
          v-if="loginError"
          variant="error"
          :message="loginError"
          @close="loginError = null"
      />

      <!-- Formulário -->
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
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

          <RPasswordInput
              v-model="password"
              label="Senha"
              name="password"
              autocomplete="current-password"
              placeholder="••••••••"
              :error="errors.password"
              :disabled="isLoading"
              required
          />
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <RCheckbox
                id="remember-me"
                v-model="rememberMe"
                name="remember-me"
                :disabled="isLoading"
            />
            <RLabel for="remember-me" class="ml-2">
              Lembrar de mim
            </RLabel>
          </div>

          <div class="text-sm">
            <RLink
                :to="{ name: 'forgot-password' }"
                class="font-medium text-green-600 hover:text-green-500"
            >
              Esqueceu a senha?
            </RLink>
          </div>
        </div>

        <div>
          <RButton
              type="submit"
              variant="primary"
              size="lg"
              class="w-full"
              :loading="isLoading"
              :disabled="isLoading || !isFormValid"
          >
            Entrar
          </RButton>
        </div>
      </form>
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
import RLink from '@/components/atoms/typography/RLink.vue'
import RButton from '@/components/atoms/buttons/RButton.vue'
import RCheckbox from '@/components/atoms/inputs/RCheckbox.vue'
import RLabel from '@/components/atoms/typography/RLabel.vue'
import RFormField from '@/components/molecules/forms/RFormField.vue'
import RPasswordInput from '@/components/molecules/forms/RPasswordInput.vue'
import RAlertBanner from '@/components/molecules/feedback/RAlertBanner.vue'
import {useLogin} from "@api/queries/auth.js";

// Router
const router = useRouter()

// Form state
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const errors = ref({})
const loginError = ref(null)

// TanStack Query mutation
const loginMutation = useLogin()

// Computed
const isLoading = computed(() => loginMutation.isPending.value)

const isFormValid = computed(() => {
  return email.value.length > 0 && password.value.length >= 6
})

// Methods
const validateForm = () => {
  errors.value = {}

  // Email validation
  if (!email.value) {
    errors.value.email = 'Email é obrigatório'
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Email inválido'
  }

  // Password validation
  if (!password.value) {
    errors.value.password = 'Senha é obrigatória'
  } else if (password.value.length < 6) {
    errors.value.password = 'Senha deve ter no mínimo 6 caracteres'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  loginError.value = null

  if (!validateForm()) {
    return
  }

  try {
    const result = await loginMutation.mutateAsync({
      email: email.value,
      password: password.value
    })

    if (result.success) {
      // Salvar "remember me" se necessário
      if (rememberMe.value) {
        localStorage.setItem('remember_email', email.value)
      } else {
        localStorage.removeItem('remember_email')
      }

      // Toast de sucesso
      toast.success('Login realizado com sucesso! 🎉')

      // Redirecionar para dashboard
      const redirectTo = router.currentRoute.value.query.redirect || '/dashboard'
      router.push(redirectTo)
    } else {
      loginError.value = result.error || 'Erro ao fazer login. Tente novamente.'
    }
  } catch (error) {
    console.error('Erro no login:', error)
    loginError.value = 'Erro ao fazer login. Tente novamente.'
  }
}

// Load remembered email
const rememberedEmail = localStorage.getItem('remember_email')
if (rememberedEmail) {
  email.value = rememberedEmail
  rememberMe.value = true
}
</script>