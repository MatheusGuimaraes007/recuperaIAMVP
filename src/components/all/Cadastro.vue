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

const formProgress = computed(() => {
  const fields = ['name', 'email', 'phone', 'password', 'confirmPassword'];
  const filled = fields.filter(field => formData.value[field]).length;
  return Math.round((filled / fields.length) * 100);
});
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <main class="p-6">
      <div class="max-w-[1400px] mx-auto">
        <!-- Header -->
        <div class="mb-8 p-6 rounded-lg relative overflow-hidden"
             style="background-color: var(--color-background4); border: 1px solid var(--color-border1)">
          <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
            <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
          </div>
          
          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-gradient-to-br from-[#7cba10] to-[#5a8c0d] flex items-center justify-center flex-shrink-0 shadow-lg">
                <span class="text-4xl">👤</span>
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">Cadastrar Novo Usuário</h1>
                <p class="text-gray-400 text-sm">Preencha as informações abaixo para criar uma nova conta no sistema</p>
              </div>
            </div>
            
            <div v-if="formProgress > 0" class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-400">Progresso</p>
                <p class="text-2xl font-bold" style="color: var(--color-text1)">{{ formProgress }}%</p>
              </div>
              <div class="w-16 h-16 relative">
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(124, 186, 16, 0.1)" stroke-width="6" fill="none" />
                  <circle cx="32" cy="32" r="28" stroke="#7cba10" stroke-width="6" fill="none"
                          :stroke-dasharray="176" :stroke-dashoffset="176 - (176 * formProgress / 100)"
                          class="transition-all duration-500" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs font-bold text-white">{{ Math.round(formProgress / 20) }}/5</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Messages -->
        <div v-if="successMessage || error" class="mb-6">
          <Card v-if="successMessage" padding="md" class="border-2" style="background-color: rgba(124, 186, 16, 0.1); border-color: var(--color-text1)">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-[#7cba10] flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-lg" style="color: var(--color-text1)">Sucesso!</p>
                <p class="text-sm" style="color: var(--color-text1); opacity: 0.9">{{ successMessage }}</p>
              </div>
            </div>
          </Card>

          <Card v-if="error" padding="md" class="border-2" style="background-color: rgba(239, 67, 67, 0.1); border-color: var(--color-text2)">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p class="font-semibold text-lg" style="color: var(--color-text2)">Erro ao cadastrar</p>
                <p class="text-sm" style="color: var(--color-text2); opacity: 0.9">{{ error }}</p>
              </div>
            </div>
          </Card>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit">
          <!-- Informações Pessoais -->
          <Card padding="lg" class="mb-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
            </div>

            <div class="relative">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b" style="border-color: var(--color-border1)">
                <div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Informações Pessoais</h3>
                  <p class="text-sm text-gray-400">Dados básicos do usuário</p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Nome -->
                <div>
                  <label for="name" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Nome Completo
                  </label>
                  <div class="relative group">
                    <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        placeholder="João Silva"
                        class="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
                        :class="formErrors.name ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10] group-hover:border-gray-600'"
                        style="background-color: var(--color-background2); color: white"
                        @input="formErrors.name = ''"
                    />
                    <div v-if="formData.name && !formErrors.name" class="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p v-if="formErrors.name" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ formErrors.name }}
                  </p>
                </div>

                <!-- Tipo de Usuário -->
                <div>
                  <label for="role" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    Tipo de Usuário
                  </label>
                  <div class="relative group">
                    <select
                        id="role"
                        v-model="formData.role"
                        class="w-full px-4 py-3 rounded-lg border-2 border-gray-700 focus:ring-2 focus:ring-[#7cba10] focus:outline-none transition-all appearance-none group-hover:border-gray-600"
                        style="background-color: var(--color-background2); color: white"
                    >
                      <option value="user">👤 Usuário</option>
                      <option value="admin">👑 Administrador</option>
                    </select>
                    <svg class="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Contato -->
          <Card padding="lg" class="mb-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
            </div>

            <div class="relative">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b" style="border-color: var(--color-border1)">
                <div class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Informações de Contato</h3>
                  <p class="text-sm text-gray-400">E-mail e telefone para comunicação</p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Email -->
                <div>
                  <label for="email" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    E-mail
                  </label>
                  <div class="relative group">
                    <input
                        id="email"
                        v-model="formData.email"
                        type="email"
                        placeholder="joao@email.com"
                        class="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
                        :class="formErrors.email ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10] group-hover:border-gray-600'"
                        style="background-color: var(--color-background2); color: white"
                        @input="formErrors.email = ''"
                    />
                    <div v-if="formData.email && !formErrors.email && validateEmail(formData.email)" class="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p v-if="formErrors.email" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ formErrors.email }}
                  </p>
                </div>

                <!-- Telefone -->
                <div>
                  <label for="phone" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Telefone
                  </label>
                  <div class="relative group">
                    <input
                        id="phone"
                        v-model="formData.phone"
                        type="tel"
                        placeholder="11912345678"
                        maxlength="11"
                        class="w-full px-4 py-3 rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
                        :class="formErrors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10] group-hover:border-gray-600'"
                        style="background-color: var(--color-background2); color: white"
                        @input="handlePhoneInput"
                    />
                    <div v-if="formData.phone && !formErrors.phone && validatePhone(formData.phone)" class="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p v-if="formErrors.phone" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ formErrors.phone }}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <!-- Segurança -->
          <Card padding="lg" class="mb-6 relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
            </div>

            <div class="relative">
              <div class="flex items-center gap-3 mb-6 pb-4 border-b" style="border-color: var(--color-border1)">
                <div class="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-bold text-white">Segurança</h3>
                  <p class="text-sm text-gray-400">Defina uma senha segura para acesso ao sistema</p>
                </div>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Senha -->
                <div>
                  <label for="password" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                    </svg>
                    Senha
                  </label>
                  <div class="relative group">
                    <input
                        id="password"
                        v-model="formData.password"
                        :type="showPassword ? 'text' : 'password'"
                        placeholder="Mínimo 6 caracteres"
                        class="w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
                        :class="formErrors.password ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10] group-hover:border-gray-600'"
                        style="background-color: var(--color-background2); color: white"
                        @input="formErrors.password = ''"
                    />
                    <button type="button" @click="showPassword = !showPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors">
                      <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                  </div>
                  <p v-if="formErrors.password" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ formErrors.password }}
                  </p>
                  <p v-else-if="formData.password" class="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    Use no mínimo 6 caracteres
                  </p>
                </div>

                <!-- Confirmar Senha -->
                <div>
                  <label for="confirmPassword" class="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Confirmar Senha
                  </label>
                  <div class="relative group">
                    <input
                        id="confirmPassword"
                        v-model="formData.confirmPassword"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        placeholder="Digite a senha novamente"
                        class="w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all focus:outline-none focus:ring-2"
                        :class="formErrors.confirmPassword ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-[#7cba10] group-hover:border-gray-600'"
                        style="background-color: var(--color-background2); color: white"
                        @input="formErrors.confirmPassword = ''"
                    />
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors">
                      <svg v-if="!showConfirmPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    </button>
                    <div v-if="formData.confirmPassword && formData.password === formData.confirmPassword && !formErrors.confirmPassword" class="absolute right-12 top-1/2 -translate-y-1/2">
                      <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <p v-if="formErrors.confirmPassword" class="mt-2 text-sm text-red-500 flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                    </svg>
                    {{ formErrors.confirmPassword }}
                  </p>
                  <p v-else-if="formData.confirmPassword && formData.password === formData.confirmPassword" class="mt-2 text-xs text-green-500 flex items-center gap-1">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                    As senhas coincidem
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <!-- Actions -->
          <Card padding="lg" class="relative overflow-hidden">
            <div class="absolute top-0 right-0 w-64 h-64 opacity-5">
              <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, white 1px, transparent 0); background-size: 20px 20px;"></div>
            </div>

            <div class="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-300">Confira os dados antes de cadastrar</p>
                  <p class="text-xs text-gray-500">Todos os campos são obrigatórios</p>
                </div>
              </div>

              <div class="flex gap-3 w-full sm:w-auto">
                <Button 
                  type="button" 
                  variant="secondary" 
                  size="lg"
                  @click="router.push('/adm/dashboard')"
                  class="flex-1 sm:flex-none"
                >
                  <span class="flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Cancelar
                  </span>
                </Button>

                <Button 
                  type="submit" 
                  variant="primary" 
                  size="lg"
                  :disabled="!isFormValid" 
                  :loading="loading"
                  class="flex-1 sm:flex-none group relative overflow-hidden"
                >
                  <span class="relative flex items-center gap-2">
                    <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Cadastrar Usuário
                  </span>
                </Button>
              </div>
            </div>
          </Card>
        </form>
      </div>
    </main>
  </div>
</template>

<style scoped>
input:focus, select:focus {
  transform: translateY(-1px);
}

button[type="submit"]:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px -5px rgba(124, 186, 16, 0.4);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover input {
  border-color: rgba(124, 186, 16, 0.3);
}
</style>