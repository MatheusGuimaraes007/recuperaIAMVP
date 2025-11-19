<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { updatePassword, loading, error, clearError, validatePassword } = useAuth();

const formData = ref({
  password: '',
  confirmPassword: ''
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const formErrors = ref({});
const successMessage = ref('');
const hasRecoveryToken = ref(false);

onMounted(() => {
  const hash = window.location.hash;
  if (hash.includes('access_token') && hash.includes('type=recovery')) {
    hasRecoveryToken.value = true;
  } else {
    router.push('/recuperar-senha');
  }
});

const validateForm = () => {
  formErrors.value = {};

  if (!formData.value.password) {
    formErrors.value.password = 'Senha é obrigatória';
  } else if (!validatePassword(formData.value.password)) {
    formErrors.value.password = 'Senha deve ter no mínimo 6 caracteres';
  }

  if (!formData.value.confirmPassword) {
    formErrors.value.confirmPassword = 'Confirmação de senha é obrigatória';
  } else if (formData.value.password !== formData.value.confirmPassword) {
    formErrors.value.confirmPassword = 'As senhas não coincidem';
  }

  return Object.keys(formErrors.value).length === 0;
};

const handleSubmit = async () => {
  clearError();
  successMessage.value = '';

  if (!validateForm()) return;

  const result = await updatePassword(formData.value.password);

  if (result.success) {
    successMessage.value = result.message;

    setTimeout(() => {
      router.push('/login');
    }, 2000);
  }
};

const isFormValid = computed(() => {
  return formData.value.password && formData.value.confirmPassword;
});
</script>

<template>
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
          <h2 class="text-2xl font-bold text-white mb-2">Redefinir senha</h2>
          <p class="text-gray-400 text-sm">Crie uma nova senha para sua conta.</p>
        </div>

        <div v-if="successMessage" class="mb-4 p-3 rounded-lg border"
             style="background-color: rgba(124, 186, 16, 0.1); border-color: var(--color-text1)">
          <p class="text-sm" style="color: var(--color-text1)">{{ successMessage }}</p>
          <p class="text-xs text-gray-400 mt-1">Redirecionando para o login...</p>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg border"
             style="background-color: rgba(239, 67, 67, 0.1); border-color: var(--color-text2)">
          <p class="text-sm" style="color: var(--color-text2)">{{ error }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Nova senha
            </label>
            <div class="relative">
              <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Mínimo 6 caracteres"
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

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">
              Confirmar nova senha
            </label>
            <div class="relative">
              <input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Digite a senha novamente"
                  class="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  :class="formErrors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-700 focus:ring-[#7cba10]'"
                  style="background-color: var(--color-background2); color: white"
                  @input="formErrors.confirmPassword = ''"
              />
              <button
                  type="button"
                  @click="showConfirmPassword = !showConfirmPassword"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-500">
              {{ formErrors.confirmPassword }}
            </p>
          </div>

          <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="w-full py-3 px-4 rounded-lg font-semibold text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style="background-color: var(--color-text1)"
          >
            <span v-if="!loading">Redefinir senha</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Redefinindo...
            </span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <router-link
              to="/login"
              class="text-sm text-gray-400 hover:text-white transition-colors inline-flex items-center"
          >
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            Voltar para o login
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>