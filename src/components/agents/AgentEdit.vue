<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAgents } from '../../composables/useAgents';
import { useWhatsAppStore } from '../../stores/useWhatsAppStore';
import Navbar from '../../shared/Navbar.vue';
import Card from '../../shared/Card.vue';
import Button from '../../shared/Button.vue';
import Input from '../../shared/Input.vue';
import Alert from '../../shared/Alert.vue';
import LoadingState from '../../shared/LoadingState.vue';
import { Bot, ArrowLeft, Save, Sparkles, Smartphone, Settings } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();
const agentId = route.params.id;

const { 
  fetchAgentById, 
  updateAgent, 
  aiModels, 
  toneOfVoiceOptions, 
  validateAgentData,
  whatsappStatusConfig,
  loading: agentLoading,
  error: storeError
} = useAgents();

const whatsappStore = useWhatsAppStore();

const formData = ref({
  name: '',
  function: '',
  ai_model: '',
  tone_of_voice: '',
  prompt: '',
  whatsapp_number: {
    id: null,
    phone_number: '',
    phone_number_id: '',
    display_name: '',
    waba_id: '',
    api_token: '', // ✅ ADICIONADO: Token da API
    status: 'pending'
  }
});

const formError = ref('');
const isSubmitting = ref(false);
const isLoaded = ref(false);
const hadWhatsappInitially = ref(false);
const agentOwnerId = ref(null); 

const whatsappStatuses = ['active', 'pending', 'inactive', 'error'];

onMounted(async () => {
  const result = await fetchAgentById(agentId);
  
  if (result.success && result.data) {
    const agent = result.data;
    const hasWpp = !!agent.whatsapp_number;
    agentOwnerId.value = agent.user_id;
    hadWhatsappInitially.value = hasWpp;

    formData.value = {
      name: agent.name,
      function: agent.function,
      ai_model: agent.ai_model,
      tone_of_voice: agent.tone_of_voice,
      prompt: agent.prompt,
      whatsapp_number: hasWpp ? { ...agent.whatsapp_number } : { 
        id: null, 
        phone_number: '', 
        phone_number_id: '',
        display_name: '', 
        waba_id: '',
        api_token: '', // ✅ Inicializa vazio
        status: 'pending' 
      }
    };
    isLoaded.value = true;
  } else {
    formError.value = 'Agente não encontrado.';
  }
});

const goBack = () => {
  router.push('/admin/agents');
};

const handleSave = async () => {
  formError.value = '';
  
  const validation = validateAgentData(formData.value);
  if (!validation.valid) {
    formError.value = validation.errors[0];
    return;
  }

  isSubmitting.value = true;

  try {
    // 2. Atualizar dados do Agente
    const agentPayload = {
      name: formData.value.name,
      function: formData.value.function,
      ai_model: formData.value.ai_model,
      tone_of_voice: formData.value.tone_of_voice,
      prompt: formData.value.prompt,
      // Se tiver whatsapp, envia para updateAgent atualizar, caso contrário null
      whatsapp_number: hadWhatsappInitially.value ? formData.value.whatsapp_number : null
    };

    const agentResult = await updateAgent(agentId, agentPayload);

    if (!agentResult.success) {
      throw new Error(agentResult.error?.message || 'Erro ao atualizar agente');
    }

    // 3. Criar número se não existia
    const wppData = formData.value.whatsapp_number;
    const shouldCreateWpp = !hadWhatsappInitially.value && wppData.phone_number;

    if (shouldCreateWpp) {
      console.log('🆕 Criando novo vínculo de WhatsApp...');
      const wppResult = await whatsappStore.createOfficialNumber(agentId, agentOwnerId.value, {
        phone_number: wppData.phone_number,
        phone_number_id: wppData.phone_number_id,
        display_name: wppData.display_name,
        waba_id: wppData.waba_id,
        api_token: wppData.api_token // ✅ Passando o Token
      });

      if (!wppResult.success) {
        console.error('Erro ao criar WhatsApp:', wppResult.error);
        formError.value = 'Agente salvo, mas erro ao vincular WhatsApp: ' + (wppResult.error?.message || 'Erro desconhecido');
        isSubmitting.value = false;
        return; 
      }
    }

    router.push('/admin/agents');

  } catch (err) {
    console.error(err);
    formError.value = err.message || 'Erro ao processar solicitação.';
  } finally {
    isSubmitting.value = false;
  }
};

const showWhatsappForm = computed(() => true);
const isCreatingNumber = computed(() => !hadWhatsappInitially.value && formData.value.whatsapp_number.phone_number);
</script>

<template>
  <div class="min-h-screen bg-background-base pb-20">
    <Navbar />

    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      
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
            Editar Agente
          </h1>
          <p class="text-gray-400 text-sm">Atualize as configurações e o número conectado</p>
        </div>
      </div>

      <LoadingState v-if="agentLoading && !isLoaded" message="Carregando dados do agente..." />

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
        
        <div class="lg:col-span-2 space-y-6">
          <Alert 
            v-if="formError || storeError" 
            type="error" 
            :message="formError || storeError" 
            class="mb-4" 
          />

          <Card padding="lg">
             <h2 class="text-lg font-semibold text-white mb-6 border-b border-white/10 pb-4 flex items-center gap-2">
              <Settings :size="18" /> Configurações Gerais
            </h2>

            <div class="space-y-5">
              <Input
                v-model="formData.name"
                label="Nome do Agente"
                required
              />

              <Input
                v-model="formData.function"
                label="Função / Cargo"
                placeholder="Ex: Especialista em Retenção"
              />

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Modelo de IA</label>
                  <select
                    v-model="formData.ai_model"
                    class="w-full bg-background-base border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                  >
                    <option v-for="model in aiModels" :key="model.value" :value="model.value">
                      {{ model.label }}
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">Tom de Voz</label>
                  <select
                    v-model="formData.tone_of_voice"
                    class="w-full bg-background-base border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer"
                  >
                    <option v-for="tone in toneOfVoiceOptions" :key="tone.value" :value="tone.value">
                      {{ tone.label }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="block text-sm font-medium text-gray-300">
                  Prompt do Sistema <span class="text-red-400">*</span>
                </label>
                <div class="relative">
                  <textarea
                    v-model="formData.prompt"
                    rows="12"
                    class="w-full bg-background-base border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none text-sm leading-relaxed"
                  ></textarea>
                  <Sparkles class="absolute right-3 top-3 text-yellow-500/50 pointer-events-none" :size="16" />
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div class="space-y-6">
          
          <Card padding="md" class="relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-10">
                <Smartphone :size="64" />
            </div>

            <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Smartphone class="w-4 h-4" /> 
              {{ hadWhatsappInitially ? 'WhatsApp Oficial' : 'Vincular WhatsApp' }}
            </h3>

            <div class="space-y-4">
              
              <div v-if="!hadWhatsappInitially" class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-xs text-blue-300 mb-2">
                Preencha os dados abaixo para vincular um número a este agente.
              </div>

              <div v-if="hadWhatsappInitially" class="text-xs text-gray-500 font-mono mb-2">
                ID: {{ formData.whatsapp_number.id }}
              </div>

              <Input
                v-model="formData.whatsapp_number.phone_number"
                label="Número (com DDI)"
                placeholder="Ex: 5511999999999"
              />

              <Input
                v-model="formData.whatsapp_number.phone_number_id"
                label="Phone Number ID (Meta)"
                placeholder="Ex: 1059384..."
              />

              <Input
                v-model="formData.whatsapp_number.display_name"
                label="Nome de Exibição (WABA)"
                placeholder="Ex: Recupera.ia Suporte"
              />

              <Input
                v-model="formData.whatsapp_number.waba_id"
                label="WABA ID"
                placeholder="ID da conta WhatsApp Business"
              />

              <div class="space-y-1">
                <Input
                  v-model="formData.whatsapp_number.api_token"
                  label="API Token (Permanente)"
                  type="password"
                  placeholder="EAAG..."
                />
                <p class="text-xs text-gray-500">Token de acesso da API do WhatsApp Cloud.</p>
              </div>

              <div v-if="hadWhatsappInitially">
                <label class="block text-sm font-medium text-gray-300 mb-2">Status da Conexão</label>
                <div class="grid grid-cols-2 gap-2">
                  <button
                    v-for="status in whatsappStatuses"
                    :key="status"
                    type="button"
                    @click="formData.whatsapp_number.status = status"
                    class="px-2 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center justify-center gap-1 capitalize"
                    :style="formData.whatsapp_number.status === status 
                      ? `background-color: ${whatsappStatusConfig(status).bgColor}; color: ${whatsappStatusConfig(status).color}; border-color: ${whatsappStatusConfig(status).color}`
                      : 'border-color: rgba(255,255,255,0.1); color: #9ca3af'"
                  >
                    {{ whatsappStatusConfig(status).label }}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <div class="flex flex-col gap-3">
            <Button
              @click="handleSave"
              variant="primary"
              size="lg"
              full-width
              :loading="isSubmitting"
              class="shadow-lg shadow-primary/20"
            >
              <Save :size="18" class="mr-2" />
              Salvar Alterações
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