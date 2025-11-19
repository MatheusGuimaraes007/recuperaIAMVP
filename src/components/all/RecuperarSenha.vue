<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';

const router = useRouter();
const { resetPassword, loading, error, clearError, validateEmail } = useAuth();

const email = ref('');
const formErrors = ref({});
const successMessage = ref('');

const validateForm = () => {
  formErrors.value = {};

  if (!email.value) {
    formErrors.value.email = 'E-mail é obrigatório';
  } else if (!validateEmail(email.value)) {
    formErrors.value.email = 'E-mail inválido';
  }

  return Object.keys(formErrors.value).length === 0;
};

const handleSubmit = async () => {
  clearError();
  successMessage.value = '';

  if (!validateForm()) return;

  const result = await resetPassword(email.value);

  if (result.success) {
    successMessage.value = result.message;
    email.value = '';

    setTimeout(() => {
      router.push('/login');
    }, 5000);
  }
};


const isFormValid = computed(() => {
  return email.value;
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
          <h2 class="text-2xl font-bold text-white mb-2">Recuperar senha</h2>
          <p class="text-gray-400 text-sm">
            Insira seu e-mail e enviaremos um link para redefinir sua senha.
          </p>
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
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              E-mail
            </label>
            <input
                id="email"
                v-model="email"
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

          <button
              type="submit"
              :disabled="!isFormValid || loading"
              class="w-full py-3 px-4 rounded-lg font-semibold text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style="background-color: var(--color-text1)"
          >
            <span v-if="!loading">Enviar link de recuperação</span>
            <span v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Enviando...
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