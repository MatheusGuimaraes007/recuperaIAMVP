<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import { validateRequired } from '../../utils/validators';
import Input from "../../shared/Input.vue";
import Button from "../../shared/Button.vue";
import Alert from "../../shared/Alert.vue";
import AuthFormContainer from "./AuthFormContainer.vue";

const router = useRouter();

const {
  login,
  loading,
  error,
  clearError,
  validateEmail,
  validatePassword,
  isAdminUser
} = useAuth();

const formData = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const formErrors = ref({});

const validateForm = () => {
  formErrors.value = {};

  const emailError = validateRequired(formData.value.email, 'E-mail');
  if (emailError) {
    formErrors.value.email = emailError;
  } else if (!validateEmail(formData.value.email)) {
    formErrors.value.email = 'E-mail inválido';
  }

  const passwordError = validateRequired(formData.value.password, 'Senha');
  if (passwordError) {
    formErrors.value.password = passwordError;
  } else if (!validatePassword(formData.value.password)) {
    formErrors.value.password = 'Senha deve ter no mínimo 6 caracteres';
  }

  return Object.keys(formErrors.value).length === 0;
};

const handleSubmit = async () => {
  clearError();

  if (!validateForm()) return;

  const result = await login(formData.value.email, formData.value.password);
  
  if (result.success) {
    const isUserAdmin = await isAdminUser();
    if (isUserAdmin) {
      console.log('teste')
      router.push('/admin/dashboard');
    } else {
      router.push('/oportunidades');
    }
  }
};

const isFormValid = computed(() => {
  return formData.value.email && formData.value.password;
});
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
          label="E-mail"
          placeholder="seu@email.com"
          icon="email"
          :error="formErrors.email"
          @input="formErrors.email = ''"
      />

      <div>
        <Input
            v-model="formData.password"
            :type="showPassword ? 'text' : 'password'"
            label="Senha"
            placeholder="Sua senha"
            :error="formErrors.password"
            @input="formErrors.password = ''"
        >
          <template #suffix>
            <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            </button>
          </template>
        </Input>
      </div>

      <div class="text-right">
        <router-link
            to="/recuperar-senha"
            class="text-sm font-medium hover:underline"
            style="color: var(--color-text1)"
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