<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../composables/useAuth'
import { useFormValidation } from '../../composables/useFormValidation'
import { usePlans } from '../../composables/usePlans'
import { UserPlus, User, Mail, Lock, Shield, ArrowLeft, Check, Cable, BusIcon } from 'lucide-vue-next'
import Button from '../../shared/Button.vue'
import Card from '../../shared/Card.vue'
import Navbar from '../../shared/Navbar.vue'
import Input from '../../shared/Input.vue'
import Alert from '../../shared/Alert.vue'

const router = useRouter()
const { register, loading, error, clearError } = useAuth()
const {
  validateRequired,
  validateEmail,
  validatePhone,
  validateMinLength,
  validateMatch
} = useFormValidation()

const formData = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  plan: ''
})

const formErrors = ref({})
const successMessage = ref('')

const validateForm = () => {
  formErrors.value = {}

  formErrors.value.name = validateRequired(formData.value.name, 'Nome') ||
      validateMinLength(formData.value.name, 3, 'Nome')

  formErrors.value.email = validateRequired(formData.value.email, 'Email') ||
      validateEmail(formData.value.email)

  formErrors.value.phone = validateRequired(formData.value.phone, 'Telefone') ||
      validatePhone(formData.value.phone)

  formErrors.value.password = validateRequired(formData.value.password, 'Senha') ||
      validateMinLength(formData.value.password, 6, 'Senha')

  formErrors.value.confirmPassword = validateRequired(formData.value.confirmPassword, 'Confirmação de senha') ||
      validateMatch(formData.value.password, formData.value.confirmPassword, 'Senhas')

  // Se for usuário, obrigar seleção de plano
  if (formData.value.role === 'user') {
    formErrors.value.plan = validateRequired(formData.value.plan, 'Plano')
  }

  Object.keys(formErrors.value).forEach(key => {
    if (!formErrors.value[key]) delete formErrors.value[key]
  })

  return Object.keys(formErrors.value).length === 0
}

const handleSubmit = async () => {
  clearError()
  successMessage.value = ''

  if (!validateForm()) return

  const userData = {
    name: formData.value.name,
    email: formData.value.email,
    phone: formData.value.phone,
    password: formData.value.password,
    role: formData.value.role
    ,
    plan: formData.value.role === 'user' ? formData.value.plan : null
  }

  const result = await register(userData)

  if (result.success) {
    successMessage.value = 'Usuário cadastrado com sucesso!'
    formData.value = { name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'user', plan: '' }
    setTimeout(() => router.push('/admin/dashboard'), 2000)
  }
}

const handlePhoneInput = () => {
  formData.value.phone = formData.value.phone.replace(/\D/g, '')
  delete formErrors.value.phone
}

const onRoleChange = () => {
  if (formData.value.role !== 'user') {
    formData.value.plan = ''
    delete formErrors.value.plan
  }
}

const isFormValid = computed(() => {
  return formData.value.name &&
      formData.value.email &&
      formData.value.phone &&
      formData.value.password &&
      formData.value.confirmPassword &&
      (formData.value.role !== 'user' || !!formData.value.plan)
})

const formProgress = computed(() => {
  const fields = ['name', 'email', 'phone', 'password', 'confirmPassword']
  if (formData.value.role === 'user') fields.push('plan')
  const filled = fields.filter(field => formData.value[field]).length
  return Math.round((filled / fields.length) * 100)
})

// Plans
const { allPlans, fetchAllPlans } = usePlans()
onMounted(async () => {
  const plans = await fetchAllPlans()
  console.log('Cadastro.vue: planos obtidos:', plans)
})
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <main class="p-6">
      <div class="max-w-[1400px] mx-auto">
        <!-- Header -->
        <Card padding="lg" class="mb-6 relative overflow-hidden border-primary-300">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl"></div>

          <div class="relative flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30">
                <UserPlus :size="32" class="text-background-base" />
              </div>
              <div>
                <h1 class="text-3xl font-bold text-white mb-2">Cadastrar Novo Usuário</h1>
                <p class="text-gray-400 text-sm">Preencha as informações abaixo para criar uma nova conta no sistema</p>
              </div>
            </div>

            <!-- Progress Circle -->
            <div v-if="formProgress > 0" class="flex items-center gap-3">
              <div class="text-right">
                <p class="text-sm font-medium text-gray-400">Progresso</p>
                <p class="text-2xl font-bold text-primary">{{ formProgress }}%</p>
              </div>
              <div class="w-16 h-16 relative">
                <svg class="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="rgba(124, 186, 16, 0.1)" stroke-width="6" fill="none" />
                  <circle
                      cx="32" cy="32" r="28"
                      :stroke="formProgress === 100 ? '#7cba10' : 'rgba(124, 186, 16, 0.5)'"
                      stroke-width="6"
                      fill="none"
                      :stroke-dasharray="176"
                      :stroke-dashoffset="176 - (176 * formProgress / 100)"
                      class="transition-all duration-500"
                  />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-xs font-bold text-white">{{ Math.round(formProgress / 20) }}/5</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <!-- Alerts -->
        <div v-if="successMessage || error" class="mb-6">
          <Alert
              v-if="successMessage"
              type="success"
              :message="successMessage"
              class="mb-4"
          />

          <Alert
              v-if="error"
              type="error"
              :message="error"
              class="mb-4"
          />
        </div>

        <!-- Formulário -->
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <!-- Informações Pessoais -->
          <Card padding="lg">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div class="w-10 h-10 rounded-lg bg-metric-blue-light flex items-center justify-center">
                <User :size="20" class="text-metric-blue" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Informações Pessoais</h3>
                <p class="text-sm text-gray-400">Dados básicos do usuário</p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                  v-model="formData.name"
                  type="text"
                  label="Nome Completo"
                  placeholder="João Silva"
                  icon="user"
                  :error="formErrors.name"
                  @input="delete formErrors.name"
              />

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Usuário
                </label>
                <div class="relative">
                  <select
                      v-model="formData.role"
                      @change="onRoleChange"
                      class="input-base appearance-none pr-10"
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                  </select>
                  <Shield :size="18" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div v-if="formData.role === 'user'">
                  <label class="block text-sm font-medium text-gray-300 mb-2 mt-3">Plano</label>
                  <div class="relative">
                    <select v-model="formData.plan" class="input-base appearance-none pr-10 w-full">
                      <option value="">Selecione um plano</option>
                      <option v-for="plan in allPlans" :key="plan.id" :value="plan.id">
                        {{ plan.name || plan.title || plan.id }}
                      </option>
                    </select>
                    <span class="absolute right-3 top-1/2 -translate-y-1/2 text-red-400 text-sm" v-if="formErrors.plan">{{ formErrors.plan }}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <!-- Informações de Contato -->
          <Card padding="lg">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div class="w-10 h-10 rounded-lg bg-metric-purple-light flex items-center justify-center">
                <Mail :size="20" class="text-metric-purple" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Informações de Contato</h3>
                <p class="text-sm text-gray-400">Email e telefone para comunicação</p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                  v-model="formData.email"
                  type="email"
                  label="Email"
                  placeholder="joao@email.com"
                  icon="email"
                  :error="formErrors.email"
                  @input="delete formErrors.email"
              />

              <Input
                  v-model="formData.phone"
                  type="tel"
                  label="Telefone"
                  placeholder="11912345678"
                  icon="phone"
                  maxlength="11"
                  :error="formErrors.phone"
                  @input="handlePhoneInput"
              />
            </div>
          </Card>

          <!-- Segurança -->
          <Card padding="lg">
            <div class="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div class="w-10 h-10 rounded-lg bg-metric-green-light flex items-center justify-center">
                <Lock :size="20" class="text-metric-green" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Segurança</h3>
                <p class="text-sm text-gray-400">Defina uma senha segura para acesso ao sistema</p>
              </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Input
                  v-model="formData.password"
                  type="password"
                  label="Senha"
                  placeholder="Mínimo 6 caracteres"
                  :error="formErrors.password"
                  @input="delete formErrors.password"
              />

              <Input
                  v-model="formData.confirmPassword"
                  type="password"
                  label="Confirmar Senha"
                  placeholder="Digite a senha novamente"
                  :error="formErrors.confirmPassword"
                  @input="delete formErrors.confirmPassword"
              />
            </div>

            <!-- Dica de Senha -->
            <p v-if="formData.password && !formErrors.password" class="mt-4 text-xs text-gray-500 flex items-center gap-2">
              <Check :size="14" class="text-status-success" />
              Senha válida
            </p>
          </Card>

          <!-- Planos (condicional acima) -->

          <!-- Actions -->
          <Card padding="lg">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="w-12 h-12 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <Shield :size="24" class="text-gray-400" />
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
                    @click="router.push('/admin/dashboard')"
                    class="flex-1 sm:flex-none"
                >
                  <span class="flex items-center gap-2">
                    <ArrowLeft :size="20" />
                    Cancelar
                  </span>
                </Button>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    :disabled="!isFormValid"
                    :loading="loading"
                    class="flex-1 sm:flex-none"
                >
                  <span class="flex items-center gap-2">
                    <Check :size="20" />
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