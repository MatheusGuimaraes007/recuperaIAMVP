<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth } from '../../composables/useAuth';
import Button from '../../shared/Button.vue';
import Card from '../../shared/Card.vue';
import Navbar from '../../shared/Navbar.vue';

const router = useRouter();
const { register, loading, error, clearError, validateEmail, validatePassword, validatePhone } = useAuth();

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user'
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);
const formErrors = ref({});
const successMessage = ref('');

const validateForm = () => {
  formErrors.value = {};

  if (!formData.value.name) {
    formErrors.value.name = 'Nome é obrigatório';
  } else if (formData.value.name.length < 3) {
    formErrors.value.name = 'Nome deve ter no mínimo 3 caracteres';
  }

  if (!formData.value.email) {
    formErrors.value.email = 'E-mail é obrigatório';
  } else if (!validateEmail(formData.value.email)) {
    formErrors.value.email = 'E-mail inválido';
  }

  if (!formData.value.phone) {
    formErrors.value.phone = 'Telefone é obrigatório';
  } else if (!validatePhone(formData.value.phone)) {
    formErrors.value.phone = 'Telefone inválido (ex: 11912345678)';
  }

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

  const userData = {
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    password: formData.value.password,
    role: formData.value.role
  };

  const result = await register(userData);

  if (result.success) {
    successMessage.value = 'Usuário cadastrado com sucesso!';
    formData.value = { name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'user' };
    setTimeout(() => router.push('/adm/dashboard'), 2000);
  }
};

const handlePhoneInput = () => {
  formData.value.phone = formData.value.phone.replace(/\D/g, '');
  formErrors.value.phone = '';
};

const isFormValid = computed(() => {
  return formData.value.name && formData.value.email && formData.value.phone && formData.value.password && formData.value.confirmPassword;
});
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <main class="max-w-md mx-auto px-4 py-8">
      <Card padding="lg">
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-2">Cadastrar usuário</h2>
          <p class="text-gray-400 text-sm">Preencha os dados para criar uma nova conta.</p>
        </div>

        <div v-if="successMessage" class="mb-4 p-3 rounded-lg border" style="background-color: rgba(124, 186, 16, 0.1); border-color: var(--color-text1)">
          <p class="text-sm" style="color: var(--color-text1)">{{ successMessage }}</p>
        </div>

        <div v-if="error" class="mb-4 p-3 rounded-lg border" style="background-color: rgba(239, 67, 67, 0.1); border-color: var(--color-text2)">
          <p class="text-sm" style="color: var(--color-text2)">{{ error }}</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Nome -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">Nome completo</label>
            <input
                id="name"
                v-model="formData.name"
                type="text"
                placeholder="João Silva"
                class="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                :class="formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10]'"
                style="background-color: var(--color-background2); color: white"
                @input="formErrors.name = ''"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-500">{{ formErrors.name }}</p>
          </div>

          <!-- Email -->
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">E-mail</label>
            <input
                id="email"
                v-model="formData.email"
                type="email"
                placeholder="joao@email.com"
                class="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                :class="formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10]'"
                style="background-color: var(--color-background2); color: white"
                @input="formErrors.email = ''"
            />
            <p v-if="formErrors.email" class="mt-1 text-sm text-red-500">{{ formErrors.email }}</p>
          </div>

          <!-- Telefone -->
          <div>
            <label for="phone" class="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
            <input
                id="phone"
                v-model="formData.phone"
                type="tel"
                placeholder="11912345678"
                maxlength="11"
                class="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                :class="formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10]'"
                style="background-color: var(--color-background2); color: white"
                @input="handlePhoneInput"
            />
            <p v-if="formErrors.phone" class="mt-1 text-sm text-red-500">{{ formErrors.phone }}</p>
          </div>

          <!-- Tipo de usuário -->
          <div>
            <label for="role" class="block text-sm font-medium text-gray-300 mb-2">Tipo de usuário</label>
            <select
                id="role"
                v-model="formData.role"
                class="w-full px-4 py-3 rounded-lg border border-gray-700 focus:ring-2 focus:ring-[#7cba10] focus:outline-none transition-colors"
                style="background-color: var(--color-background2); color: white"
            >
              <option value="user">Usuário</option>
              <option value="admin">Administrador</option>
            </select>
          </div>

          <!-- Senha -->
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">Senha</label>
            <div class="relative">
              <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  placeholder="Mínimo 6 caracteres"
                  class="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  :class="formErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10]'"
                  style="background-color: var(--color-background2); color: white"
                  @input="formErrors.password = ''"
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="formErrors.password" class="mt-1 text-sm text-red-500">{{ formErrors.password }}</p>
          </div>

          <!-- Confirmar Senha -->
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">Confirmar senha</label>
            <div class="relative">
              <input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="Digite a senha novamente"
                  class="w-full px-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2"
                  :class="formErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10]'"
                  style="background-color: var(--color-background2); color: white"
                  @input="formErrors.confirmPassword = ''"
              />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              </button>
            </div>
            <p v-if="formErrors.confirmPassword" class="mt-1 text-sm text-red-500">{{ formErrors.confirmPassword }}</p>
          </div>

          <Button type="submit" variant="primary" size="lg" fullWidth :disabled="!isFormValid" :loading="loading">
            Cadastrar usuário
          </Button>
        </form>
      </Card>
    </main>
  </div>
</template>