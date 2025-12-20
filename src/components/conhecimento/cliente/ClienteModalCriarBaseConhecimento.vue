<script setup>
import { onMounted, ref, computed } from 'vue';
import { useUSers } from '../../../composables/useUsers';
import { useAdminModalBaseConhecimento } from '../../../composables/useAdminModalBaseConhecimento';
import Button from '../../../shared/Button.vue';
import { useProducts } from '../../../composables/useProducts';
import Alert from '../../../shared/Alert.vue';

const { allUsers, fetchAllUsers } = useUSers();
const { step, nextStep, previousStep, nameknowledgeBase, userknowledgeBase, trainingType, typesOfTraining, productSelected, linksList, write, createKnowledgeBase, statusCreateKnowledgeBase, productCategory } = useAdminModalBaseConhecimento();
const { allProducts, fetchAlProducts, userUuid, allCategoriesOfProduct, fetchCategoriesOfProduct } = useProducts();

const isAlertVisible = ref(false);
const alertMessage = ref('');
const alertType = ref('error');
const alertTime = 2000;

const totalLinks = ref(linksList.value.length);

function addLink() {
  linksList.value.push('');
}
function removeLink(index) {
  linksList.value.splice(index, 1);
}

onMounted(async () => {
  await fetchAllUsers();
  await fetchCategoriesOfProduct();
})

async function handleNextStep() {
  isAlertVisible.value = false;
  
  if (step.value == 0 && (nameknowledgeBase.value == '' || userknowledgeBase.value == 'null' || !userknowledgeBase.value || productCategory.value == '' || productCategory.value == 'null' || !productCategory.value)) {
    alertMessage.value = 'Por favor, preencha o Nome, Categoria e selecione um Cliente antes de continuar.';
    alertType.value = 'info';
    isAlertVisible.value = true;
    return;
  }
  
  if (step.value == 0) {
    userUuid.value = userknowledgeBase.value
    await fetchAlProducts();
    await nextStep();
    return;
  }
  
  if (step.value == 1 && (productSelected.value == '' || trainingType.value == '' || !trainingType.value)) {
    alertMessage.value = 'Por favor, preencha o Produto e selecione um Modelo para a base de conhecimento antes de continuar.';
    alertType.value = 'info';
    isAlertVisible.value = true;
    return;
  }
  
  if (step.value == 1) {
    await nextStep();
    return;
  }
  
  if (step.value == 2 && (trainingType.value == 1 || trainingType.value == 3) && (linksList.value.length == 0 || linksList.value[0] == '')) {
    alertMessage.value = 'Por favor, adicione pelo menos um link para continuar. Ou escolha outro modo de treinamento.';
    alertType.value = 'info';
    isAlertVisible.value = true;
    return;
  }
  
  if (step.value == 2 && (trainingType.value == 2 || trainingType.value == 3) && (write.value == '')) {
    alertMessage.value = 'Por favor, insira o texto para treinamento antes de continuar. Ou escolha outro modo de treinamento.';
    alertType.value = 'info';
    isAlertVisible.value = true;
    return;
  }
  
  if (step.value == 2) {
    await createKnowledgeBase();
    return;
  }
}

const props = defineProps({
  aberto: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['close']);


import { useAuth } from '../../../composables/useAuth';

// 2. Desestruture o objeto 'user'
const { user } = useAuth();

// 3. Para usar no Script (ex: mandar para uma API ou logar)
// IMPORTANTE: Use .value porque 'user' é uma Ref, e ?. para segurança caso não tenha carregado ainda
const logUserId = () => {
  console.log('ID do Usuário:', user.value?.id);
  
  // Se quiser o ID do Supabase Auth (auth_uuid):
  // console.log('Auth UUID:', user.value?.auth_uuid);
};

// Exemplo prático: Usando em uma computed property
const userId = computed(() => user.value?.id);

onMounted(() => {
  logUserId();
});
</script>

<template>
  <div v-if="aberto" class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-all duration-300">
    <div v-if="isAlertVisible" class="absolute top-6 z-[60] w-full max-w-lg px-4">
      <Alert 
        :type="alertType" 
        :message="alertMessage" 
        :dismissible="true" 
        @dismiss="isAlertVisible = false" 
        :time="alertTime" 
        class="shadow-xl"
      />
    </div>

    <div class="relative w-full max-w-5xl h-[85vh] rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,1)] flex flex-col overflow-hidden border" style="background-color: var(--color-background4); border-color: var(--color-border1)">
      
      <div class="flex items-center justify-between px-8 py-6 border-b border-white/5" style="background-color: rgba(21, 34, 27, 0.3)">
        <div>
          <h1 class="text-2xl font-bold text-white tracking-wide">Criação de Base de Conhecimento</h1>
          <p class="text-xs text-gray-400 mt-1 font-medium">Configure os dados para treinamento da IA</p>
        </div>
        
        <button 
          @click="$emit('close')" 
          class="text-gray-500 transition-colors p-2 rounded-lg hover:bg-white/5 cursor-pointer"
          style="color: var(--color-text1)"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 p-8 overflow-hidden flex flex-col relative">
        <form 
          v-if="statusCreateKnowledgeBase == ''" 
          onclick="" 
          class="flex flex-col h-full w-full"
        >
          <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            
            <div v-if="step == 0" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div class="flex flex-col gap-2">
                <label for="baseName" class="text-sm font-medium text-gray-300 ml-1">Nome da Base</label>
                <input 
                  type="text" 
                  id="baseName" 
                  v-model="nameknowledgeBase" 
                  placeholder="Ex: Base Financeira 2024"
                  class="w-full border border-white/5 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:ring-1 outline-none transition-all duration-300"
                  style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
                >
              </div>
              
              <div class="flex flex-col gap-2">
                <label for="baseUser" class="text-sm font-medium text-gray-300 ml-1">Categoria de Produto</label>
                <div class="relative">
                  <select 
                    name="baseUser" 
                    id="baseUser" 
                    v-model="productCategory" 
                    class="w-full border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 outline-none appearance-none transition-all duration-300 cursor-pointer"
                    style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
                  >
                    <option value="" disabled selected>Selecione uma Categoria de Produto</option>
                    <option v-for="product in allCategoriesOfProduct" :key="product.id" :value="product.id">{{ product.name }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-2">
                <label for="baseUser" class="text-sm font-medium text-gray-300 ml-1">Cliente</label>
                <div class="relative">
                  <select 
                    name="baseUser" 
                    id="baseUser" 
                    v-model="userknowledgeBase" 
                    class="w-full border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 outline-none appearance-none transition-all duration-300 cursor-pointer"
                    style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
                  >
                    <option value="" disabled selected>Selecione um Cliente</option>
                    <option v-for="user in allUsers" :key="user.id" :value="user.id">{{ user.name }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="step == 1" class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div class="flex flex-col gap-2">
                <label for="productSelect" class="text-sm font-medium text-gray-300 ml-1">Produto Vinculado</label>
                <div class="relative">
                  <select 
                    id="productSelect" 
                    v-model="productSelected" 
                    class="w-full border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 outline-none appearance-none transition-all duration-300 cursor-pointer"
                    style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
                  >
                    <option value="" disabled selected>Selecione um Produto</option>
                    <option v-for="product in allProducts" :key="product.id" :value="product.id">{{ product.name }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
              
              <div class="flex flex-col gap-2">
                <label for="trainingMode" class="text-sm font-medium text-gray-300 ml-1">Modo de Abastecimento</label>
                <div class="relative">
                  <select 
                    id="trainingMode" 
                    v-model="trainingType" 
                    class="w-full border border-white/5 rounded-xl px-4 py-3 text-white focus:ring-1 outline-none appearance-none transition-all duration-300 cursor-pointer"
                    style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
                  >
                    <option :value="null" disabled selected>Selecione o tipo de dados</option>
                    <option v-for="type in typesOfTraining" :key="type.id" :value="type.id">{{ type.label }}</option>
                  </select>
                  <div class="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-500">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="step == 2 && trainingType == 1" class="flex flex-col h-full animate-fade-in">
              <label class="text-sm font-medium text-gray-300 mb-3 ml-1">Links para Treinamento</label>
              
              <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar rounded-xl border border-white/5 p-4" style="background-color: rgba(21, 34, 27, 0.3)">
                <div v-if="linksList.length === 0" class="h-full flex flex-col items-center justify-center text-gray-500 gap-3 min-h-[200px]">
                  <div class="p-4 bg-white/5 rounded-full">
                    <svg class="w-8 h-8 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  </div>
                  <span class="text-sm font-medium">Nenhum link adicionado. Clique no botão abaixo.</span>
                </div>

                <div 
                  v-for="(link, index) in linksList" 
                  :key="index" 
                  class="flex items-center gap-3 mb-3 group"
                >
                  <div class="flex-1">
                    <input 
                      type="text" 
                      v-model="linksList[index]" 
                      placeholder="https://seu-site.com/artigo"
                      class="w-full border border-white/10 rounded-lg px-4 py-3 text-white focus:ring-1 outline-none transition-all text-sm"
                      style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
                    >
                  </div>
                  <button 
                    @click.prevent="removeLink(index)"
                    class="p-3 text-gray-500 rounded-lg transition-all cursor-pointer"
                    style="color: var(--color-text2)"
                    title="Remover"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>

              <div class="mt-4 flex justify-center">
                <button 
                  @click.prevent="addLink" 
                  class="flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-2.5 rounded-full transition-all text-sm font-medium group cursor-pointer"
                  style="border-color: var(--color-text1)"
                >
                  <span class="rounded-full p-0.5 group-hover:scale-110 transition-transform" style="background-color: var(--color-text1); color: var(--color-background4)">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                  </span>
                  Adicionar Link
                </button>
              </div>
            </div> 

            <div v-if="step == 2 && trainingType == 2" class="flex flex-col h-full animate-fade-in">
              <label class="text-sm font-medium text-gray-300 mb-2 ml-1">Texto para Treinamento</label>
              <textarea 
                v-model="write" 
                placeholder="Cole aqui o conteúdo textual, manuais, procedimentos ou informações que a IA deve aprender..."
                class="flex-1 w-full border border-white/10 rounded-xl p-5 text-white focus:ring-1 outline-none resize-none leading-relaxed text-sm placeholder-gray-600"
                style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
              ></textarea>
            </div> 

            <div v-if="step == 2 && trainingType == 3" class="flex flex-col md:flex-row h-full gap-6 animate-fade-in">
              <div class="flex-1 flex flex-col h-full overflow-hidden">
                <label class="text-sm font-medium text-gray-300 mb-2 ml-1 flex items-center gap-2">
                  <svg class="w-4 h-4" style="color: var(--color-text1)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path></svg>
                  Texto
                </label>
                <textarea 
                  v-model="write" 
                  placeholder="Cole aqui o conteúdo textual..."
                  class="flex-1 w-full border border-white/10 rounded-xl p-4 text-white focus:ring-1 outline-none resize-none leading-relaxed text-sm placeholder-gray-600"
                  style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
                ></textarea>
              </div>

              <div class="flex-1 flex flex-col h-full overflow-hidden">
                <label class="text-sm font-medium text-gray-300 mb-2 ml-1 flex items-center gap-2">
                  <svg class="w-4 h-4" style="color: var(--color-text1)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                  Links
                </label>
                
                <div class="flex-1 overflow-y-auto pr-2 custom-scrollbar rounded-xl border border-white/5 p-4 mb-2" style="background-color: rgba(21, 34, 27, 0.3)">
                  <div v-if="linksList.length === 0" class="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                    <span class="text-sm">Nenhum link.</span>
                  </div>

                  <div 
                    v-for="(link, index) in linksList" 
                    :key="index" 
                    class="flex items-center gap-2 mb-3"
                  >
                    <button 
                      @click.prevent="removeLink(index)"
                      class="text-gray-500 transition-colors shrink-0 cursor-pointer"
                      style="color: var(--color-text2)"
                      title="Remover"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <input 
                      type="text" 
                      v-model="linksList[index]" 
                      placeholder="https://..."
                      class="w-full border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-1 outline-none text-xs"
                      style="background-color: var(--color-background2); border-color: var(--color-text1); --tw-ring-color: var(--color-text1)"
                    >
                  </div>
                </div>

                <div class="flex justify-center">
                  <button 
                    @click.prevent="addLink" 
                    class="flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-all text-xs font-medium w-full justify-center cursor-pointer"
                  >
                    <svg class="w-3 h-3" style="color: var(--color-text1)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M12 4v16m8-8H4"></path></svg>
                    Adicionar Link
                  </button>
                </div>
              </div>
            </div>

          </div>

          <div class="pt-6 mt-4 border-t border-white/5 flex items-center justify-end gap-3">
            <Button 
              v-if="step > 0" 
              @click.prevent="previousStep" 
              class="bg-transparent! border! border-white/10! text-gray-300! hover:bg-white/5! hover:border-white/20! hover:text-white! cursor-pointer"
            >
              Voltar
            </Button>
            
            <Button 
              v-if="step < 2" 
              @click.prevent="handleNextStep" 
              class="cursor-pointer font-bold!"
              style="background-color: var(--color-text1); color: var(--color-background4)"
            >
              Próximo
            </Button>
            
            <Button 
              v-if="step == 2" 
              @click.prevent="handleNextStep" 
              class="cursor-pointer font-bold!"
              style="background-color: var(--color-text1); color: var(--color-background4)"
            >
              Finalizar
            </Button>
          </div>
        </form>

        <div 
          v-if="statusCreateKnowledgeBase == 'loading'" 
          class="flex flex-col items-center justify-center h-full w-full animate-fade-in"
        >
          <div class="relative mb-8">
            <div class="absolute inset-0 blur-xl opacity-20 rounded-full animate-pulse" style="background-color: var(--color-text1)"></div>
            <svg class="animate-spin h-16 w-16 relative z-10" style="color: var(--color-text1)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"></circle>
              <path class="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>

          <h2 class="text-2xl font-bold text-white mb-3 text-center tracking-tight">
            Criando sua Base...
          </h2>
          <p class="text-gray-400 text-center max-w-md text-sm leading-relaxed">
            Estamos processando as informações. Por favor, <span class="font-semibold tracking-wide" style="color: var(--color-text2)">não feche a página</span>.
          </p>
        </div>

        <div 
          v-if="statusCreateKnowledgeBase == 'success'" 
          class="flex flex-col items-center justify-center h-full w-full animate-scale-up"
        >
          <div class="rounded-full p-6 mb-6 border shadow-[0_0_30px_var(--color-text1)] shadow-opacity-20" style="background: linear-gradient(to bottom, rgba(124, 186, 16, 0.2), transparent); border-color: rgba(124, 186, 16, 0.3)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" style="color: var(--color-text1)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 class="text-2xl font-bold text-white mb-2 text-center tracking-tight">
            Sucesso!
          </h2>
          <p class="text-gray-400 text-center max-w-sm mb-8 text-sm leading-relaxed">
            Sua base de conhecimento foi criada e já está pronta para uso imediato no sistema.
          </p>

          <button 
            @click="$emit('close')" 
            class="font-bold px-8 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
            style="background-color: var(--color-text1); color: var(--color-background4); box-shadow: 0 10px 15px -3px rgba(124, 186, 16, 0.2)"
          >
            Concluir e Fechar
          </button>
        </div>

        <div 
          v-if="statusCreateKnowledgeBase == 'error'" 
          class="flex flex-col items-center justify-center h-full w-full animate-shake"
        >
          <div class="rounded-full p-6 mb-6 border shadow-[0_0_30px_rgba(239,67,67,0.2)]" style="background: linear-gradient(to bottom, rgba(239, 67, 67, 0.2), transparent); border-color: rgba(239, 67, 67, 0.3)">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" style="color: var(--color-text2)" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>

          <h2 class="text-2xl font-bold text-white mb-2 text-center tracking-tight">
            Falha na Criação
          </h2>
          <p class="text-gray-400 text-center max-w-sm mb-8 text-sm leading-relaxed">
            Ocorreu um erro ao salvar os dados. Verifique sua conexão e tente novamente.
          </p>

          <div class="flex items-center gap-4">
            <button 
              @click="$emit('close')" 
              class="px-6 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-white/10 text-sm font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              @click="statusCreateKnowledgeBase = ''" 
              class="text-white px-6 py-2.5 rounded-lg shadow-lg transition-all duration-300 font-bold text-sm transform hover:-translate-y-0.5 cursor-pointer"
              style="background-color: var(--color-text2); box-shadow: 0 10px 15px -3px rgba(239, 67, 67, 0.2)"
            >
              Tentar Novamente
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>