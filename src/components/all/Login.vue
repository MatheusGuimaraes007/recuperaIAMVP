<script setup>
<<<<<<< Updated upstream
import { ref, computed, onMounted } from 'vue';
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
=======
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { login, loading, error, clearError, validateEmail, validatePassword } = useAuth();
>>>>>>> Stashed changes

const formData = ref({
  email: '',
  password: ''
});

const showPassword = ref(false);
const formErrors = ref({});

const validateForm = () => {
  formErrors.value = {};

<<<<<<< Updated upstream
  const emailError = validateRequired(formData.value.email, 'E-mail');
  if (emailError) {
    formErrors.value.email = emailError;
=======
  if (!formData.value.email) {
    formErrors.value.email = 'E-mail é obrigatório';
>>>>>>> Stashed changes
  } else if (!validateEmail(formData.value.email)) {
    formErrors.value.email = 'E-mail inválido';
  }

<<<<<<< Updated upstream
  const passwordError = validateRequired(formData.value.password, 'Senha');
  if (passwordError) {
    formErrors.value.password = passwordError;
=======
  if (!formData.value.password) {
    formErrors.value.password = 'Senha é obrigatória';
>>>>>>> Stashed changes
  } else if (!validatePassword(formData.value.password)) {
    formErrors.value.password = 'Senha deve ter no mínimo 6 caracteres';
  }

  return Object.keys(formErrors.value).length === 0;
};

const handleSubmit = async () => {
  clearError();

  if (!validateForm()) return;

  const result = await login(formData.value.email, formData.value.password);
<<<<<<< Updated upstream
  const isUserAdmin = await isAdminUser();

  if (result.success && isUserAdmin) {
    router.push('/adm/dashboard');
    return;
  }
  if (result.success && !isUserAdmin) {
    router.push('/oportunidades');
    return;
=======

  if (result.success) {
    router.push('/dashboard');
>>>>>>> Stashed changes
  }
};

const isFormValid = computed(() => {
  return formData.value.email && formData.value.password;
});
</script>

<template>
<<<<<<< Updated upstream
  <AuthFormContainer
      title="Acesse sua conta"
      subtitle="Bem-vindo de volta! Insira seus dados para continuar."
  >
    <!-- Error Alert -->
    <Alert
        v-if="error"
        type="error"
        :message="error"
        class="mb-4"
    />

    <!-- Login Form -->
    <form @submit.prevent="handleSubmit" class="space-y-4">
      <!-- Email -->
      <Input
          v-model="formData.email"
          type="email"
          label="E-mail"
          placeholder="seu@email.com"
          icon="email"
          :error="formErrors.email"
          @input="formErrors.email = ''"
      />

      <!-- Password -->
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

      <!-- Forgot Password -->
      <div class="text-right">
        <router-link
            to="/recuperar-senha"
            class="text-sm font-medium hover:underline"
            style="color: var(--color-text1)"
        >
          Esqueceu sua senha?
        </router-link>
      </div>

      <!-- Submit Button -->
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
      <!-- Additional links can go here if needed -->
    </template>
  </AuthFormContainer>
=======
  <div class="min-h-screen flex items-center justify-center px-4"
       style="background-color: var(--color-background3)">

    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold">
          <span class="text-white">recupera</span><span style="color: var(--color-text1)">.ia</span>
        </h1>
      </div>

      <div class="rounded-2xl p-8 shadow-xl border"
           style="background-color: var(--color-background4); border-color: rgba(124, 186, 16, 0.2)">

        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-2">Acesse sua conta</h2>
          <p class="text-gray-400 text-sm">Bem-vindo de volta! Insira seus dados para continuar.</p>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg border"
             style="background-color: rgba(239, 67, 67, 0.1); border-color: var(--color-text2)">
          <p class="text-sm" style="color: var(--color-text2)">{{ error }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              E-mail
            </label>
            <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="seu@email.com"
                class="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                :class="formErrors.email
                ? 'border-red-500 focus:ring-red-500'
                : 'border-gray-700 focus:ring-[#7cba10]'"
                style="background-color: var(--color-background2); color: white"
                @input="formErrors.email = ''"
            />
            <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">
              {{ formErrors.email }}
            </p>
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <div class="relative">
              <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Sua senha"
                  class="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  :class="formErrors.password
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-[#7cba10]'"
                  style="background-color: var(--color-background2); color: white"
                  @input="formErrors.password = ''"
              />
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
            </div>
            <p v-if="formErrors.password" class="mt-1 text-sm text-red-500">
              {{ formErrors.password }}
            </p>
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

          <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="w-full py-3 px-4 rounded-lg font-semibold text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style="background-color: var(--color-text1)"
          >
            <span v-if="!loading">Entrar</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Entrando...
            </span>
          </button>
        </form>
      </div>
    </div>
  </div>
>>>>>>> Stashed changes
</template>