<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAgents } from '../../composables/useAgents';
import { useUSers } from '../../composables/useUsers'; // Para buscar clientes
import Navbar from '../../shared/Navbar.vue';
import Card from '../../shared/Card.vue';
import Button from '../../shared/Button.vue';
import Input from '../../shared/Input.vue';
import Alert from '../../shared/Alert.vue';
import { Bot, ArrowLeft, Save, Sparkles, User, ChevronDown, Zap } from 'lucide-vue-next';

const router = useRouter();

// Composables
const { 
  createAgent, 
  aiModels, 
  toneOfVoiceOptions, 
  validateAgentData,
  loading: storeLoading,
  error: storeError
} = useAgents();

const { fetchAllUsers, allUsers } = useUSers();

// Estado do formulário
const formData = ref({
  user_id: '', // ID do dono do agente
  name: '',
  function: '',
  ai_model: 'gpt-4',
  tone_of_voice: 'professional',
  prompt: ''
});

const formError = ref('');
const isSubmitting = ref(false);

// Carregar usuários ao montar
onMounted(async () => {
  await fetchAllUsers();
});

const goBack = () => {
  router.push('/admin/agents'); 
};

const handleSave = async () => {
  formError.value = '';
  
  // 1. Validação básica
  if (!formData.value.user_id) {
    formError.value = 'Selecione um cliente para este agente.';
    return;
  }

  const validation = validateAgentData(formData.value);
  if (!validation.valid) {
    formError.value = validation.errors[0];
    return;
  }

  isSubmitting.value = true;

  try {
    // 2. Tenta criar o agente
    const result = await createAgent(formData.value);

    if (result.success) {
      // Sucesso total
      goBack();
    } else {
      // Erro retornado pela API/Store
      console.error('Erro na store:', result.error);
      formError.value = result.error?.message || 'Erro ao criar agente. Verifique os dados.';
    }
  } catch (err) {
    // Erro inesperado no componente
    console.error('Erro inesperado:', err);
    formError.value = 'Ocorreu um erro inesperado. Tente novamente.';
  } finally {
    // 3. GARANTE que o loading pare
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-background-base pb-20">
    <Navbar />

    <div class="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      <div class="flex items-center gap-4 mb-8">
        <button 
          @click="goBack"
          class="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft :size="24" />
        </button>
        <div>
          <h1 class="text-2xl font-bold text-white flex items-center gap-2">
            <Bot class="text-primary" />
            Novo Agente IA
          </h1>
          <p class="text-gray-400 text-sm">Configure o assistente e defina seu proprietário</p>
        </div>
      </div>

      <Alert 
        v-if="formError || storeError" 
        type="error" 
        :message="formError || storeError" 
        class="mb-6" 
      />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div class="lg:col-span-2 space-y-6">
          <Card padding="lg">
            <h2 class="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4">
              Dados do Agente
            </h2>

            <div class="space-y-5">
              
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Cliente / Dono <span class="text-red-400">*</span></label>
                <div class="relative">
                  <select 
                    v-model="formData.user_id"
                    class="w-full bg-background-base border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected>Selecione um cliente...</option>
                    <option v-for="user in allUsers" :key="user.id" :value="user.id">
                      {{ user.name }} ({{ user.email }})
                    </option>
                  </select>
                  <User class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" :size="16" />
                </div>
              </div>

              <Input
                v-model="formData.name"
                label="Nome do Agente"
                placeholder="Ex: Assistente de Vendas"
                required
              />

              <Input
                v-model="formData.function"
                label="Função / Cargo"
                placeholder="Ex: Especialista em Retenção"
              />

              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-300">
                  Prompt do Sistema <span class="text-red-400">*</span>
                </label>
                <div class="relative">
                  <textarea
                    v-model="formData.prompt"
                    rows="10"
                    class="w-full bg-background-base border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-sm leading-relaxed"
                    placeholder="Descreva detalhadamente como o agente deve se comportar..."
                  ></textarea>
                  <Sparkles class="absolute right-3 top-3 text-yellow-500/50 pointer-events-none" :size="16" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div class="space-y-6">
          <Card padding="md">
            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Zap class="w-4 h-4" /> Configurações
            </h3>

            <div class="mb-5">
              <label class="block text-sm font-medium text-gray-300 mb-2">Modelo de IA</label>
              <div class="relative">
                <select
                  v-model="formData.ai_model"
                  class="w-full bg-background-base border border-gray-700 rounded-lg px-4 py-2.5 text-white appearance-none focus:border-primary outline-none cursor-pointer"
                >
                  <option v-for="model in aiModels" :key="model.value" :value="model.value">
                    {{ model.icon }} {{ model.label }}
                  </option>
                </select>
                <div class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                  <ChevronDown :size="16" />
                </div>
              </div>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Tom de Voz</label>
              <div class="grid grid-cols-2 gap-2">
                <button
                  v-for="tone in toneOfVoiceOptions"
                  :key="tone.value"
                  type="button"
                  @click="formData.tone_of_voice = tone.value"
                  class="px-3 py-2 rounded-lg text-xs font-medium border transition-all flex flex-col items-center gap-1 cursor-pointer"
                  :class="formData.tone_of_voice === tone.value 
                    ? 'bg-primary/20 border-primary text-white' 
                    : 'bg-background-base border-gray-700 text-gray-400 hover:border-gray-500'"
                >
                  <span class="text-base">{{ tone.icon }}</span>
                  {{ tone.label }}
                </button>
              </div>
            </div>
          </Card>

          <div class="flex flex-col gap-3">
            <Button
              @click="handleSave"
              variant="primary"
              size="lg"
              full-width
              :loading="isSubmitting || storeLoading"
              class="shadow-lg shadow-primary/20"
            >
              <Save :size="18" class="mr-2" />
              Salvar Agente
            </Button>
            
            <Button
              @click="goBack"
              variant="ghost"
              size="sm"
              full-width
              :disabled="isSubmitting"
            >
              Cancelar
            </Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>