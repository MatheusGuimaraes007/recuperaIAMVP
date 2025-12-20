<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 1. Import Router
import Navbar from '../../../shared/Navbar.vue';
import Card from '../../../shared/Card.vue';
import Button from '../../../shared/Button.vue';
import ModalCriarBaseConhecimento from './ModalCriarBaseConhecimento.vue';
import Alert from '../../../shared/Alert.vue';
import { useBaseConhecimento } from '../../../composables/useBaseConhecimento';
import { formatDate } from '../../../utils/formatters';
import { BookOpen, User, Box, Calendar, MoreVertical, Plus, Filter, Search, Inbox, Layers, Edit, Trash2, AlertTriangle } from 'lucide-vue-next';

const props = defineProps({
  pageTitle: { type: String, default: 'Base de Conhecimento Administrativa' },
  pageDescription: { type: String, default: 'Criação da base de conhecimento para agents' },
  pageIcon: { type: String, default: 'default' }
});

const { allKnowledgeBases, fetchAllKnowledgeBases, loading, deleteKnowledgeBase } = useBaseConhecimento();
const router = useRouter(); // 2. Instância do Router

// Estados
const isModalOpen = ref(false);
const searchTerm = ref('');
const activeMenuId = ref(null);

// Estados do Alert
const isAlertVisible = ref(false);
const alertMessage = ref('');
const alertType = ref('error');

// Estados do Modal de Exclusão
const showDeleteConfirm = ref(false);
const itemToDelete = ref(null);
const isDeleting = ref(false);

const handleModalClose = async () => {
  isModalOpen.value = false;
  await fetchAllKnowledgeBases();
}

const closeClickOutside = (e) => {
  activeMenuId.value = null;
}

onMounted(async () => {
  await fetchAllKnowledgeBases();
  document.addEventListener('click', closeClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', closeClickOutside);
});

function openModal() {
  isModalOpen.value = true;
}

function toggleMenu(id) {
  activeMenuId.value = activeMenuId.value === id ? null : id;
}

function handleEdit(kb) {
  router.push({ 
    name: 'AdminClientKnowledgeBases', 
    params: { baseId: kb.id } 
  });
  activeMenuId.value = null;
}

// --- LÓGICA DE EXCLUSÃO ---
function requestDelete(kb) {
  itemToDelete.value = kb;
  showDeleteConfirm.value = true;
  activeMenuId.value = null;
  isAlertVisible.value = false;
}

async function confirmDelete() {
  if (!itemToDelete.value) return;
  
  isDeleting.value = true;
  const error = await deleteKnowledgeBase(itemToDelete.value.id);
  isDeleting.value = false;
  showDeleteConfirm.value = false;

  if (!error) {
    await fetchAllKnowledgeBases();
    alertType.value = 'success';
    alertMessage.value = 'Base de conhecimento excluída com sucesso.';
    isAlertVisible.value = true;
    setTimeout(() => { isAlertVisible.value = false; }, 3000);
  } else {
    alertType.value = 'error';
    isAlertVisible.value = true;

    if (error.code === '23503') {
       alertMessage.value = 'Não é possível excluir esta base pois ela está vinculada a perguntas ou produtos ativos. Exclua as dependências primeiro.';
    } else {
       alertMessage.value = 'Ocorreu um erro ao tentar excluir a base. Tente novamente.';
    }
  }
}

// Filtro
const filteredKnowledgeBases = computed(() => {
  if (!searchTerm.value) return allKnowledgeBases.value;
  const term = searchTerm.value.toLowerCase();
  return allKnowledgeBases.value.filter(kb => {
    const nameMatch = kb.name?.toLowerCase().includes(term);
    const userMatch = kb.user?.name?.toLowerCase().includes(term);
    const productMatch = kb.product?.name?.toLowerCase().includes(term);
    return nameMatch || userMatch || productMatch;
  });
});

const hasAnyItem = computed(() => allKnowledgeBases.value.length > 0);
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <div v-if="isAlertVisible" class="fixed top-20 left-0 right-0 z-50 flex justify-center px-4 animate-fade-in-down">
       <div class="w-full max-w-lg shadow-2xl">
          <Alert 
            :type="alertType" 
            :message="alertMessage" 
            :dismissible="true"
            @dismiss="isAlertVisible = false" 
          />
       </div>
    </div>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <Card padding="lg" class="mb-8">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl" style="background-color: rgba(124, 186, 16, 0.1)">
            <BookOpen class="w-8 h-8" style="color: var(--color-text1)" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">{{ pageTitle }}</h2>
            <p class="text-gray-400">{{ pageDescription }}</p>
          </div>
        </div>
      </Card>

      <div class="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div class="flex gap-3 w-full md:w-auto">
          <Button variant="primary" @click="openModal" class="cursor-pointer flex items-center gap-2">
            <Plus :size="20" />
            Adicionar Novo
          </Button>
        </div>
        
        <div class="relative w-full md:w-64">
          <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por nome, cliente ou produto..."
              class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:ring-2 focus:outline-none transition-colors"
              style="background-color: var(--color-background2); color: white; border-color: var(--color-border1); --tw-ring-color: var(--color-text1)"
          />
          <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
         <svg class="animate-spin h-10 w-10" style="color: var(--color-text1)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
         <p class="text-gray-400 mt-4 animate-pulse">Carregando bases de conhecimento...</p>
      </div>

      <div v-else-if="hasAnyItem">
        
        <div class="flex items-center justify-end mb-4 px-1">
          <div class="text-sm font-medium text-gray-400 flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">
             <Layers :size="16" class="text-gray-500" />
             <span v-if="searchTerm">
                Exibindo <span class="text-white">{{ filteredKnowledgeBases.length }}</span> de <span class="text-gray-500">{{ allKnowledgeBases.length }}</span> bases
             </span>
             <span v-else>
                Total: <span class="text-white">{{ allKnowledgeBases.length }}</span> bases cadastradas
             </span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
          
          <div 
            v-for="kb in filteredKnowledgeBases" 
            :key="kb.id" 
            class="rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group relative overflow-visible flex flex-col"
            style="background-color: var(--color-background2); border-color: rgba(255,255,255,0.05)"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-[#7cba10]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"></div>

            <div class="flex justify-between items-start mb-4 relative z-10">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg bg-[#7cba10]/10 text-[#7cba10]">
                  <BookOpen :size="20" />
                </div>
                <h3 class="text-lg font-bold text-white leading-tight line-clamp-1" :title="kb.name">
                  {{ kb.name }}
                </h3>
              </div>
              
              <div class="relative">
                <button 
                  @click.stop="toggleMenu(kb.id)" 
                  class="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5 cursor-pointer"
                >
                   <MoreVertical :size="20" />
                </button>

                <div 
                  v-if="activeMenuId === kb.id" 
                  class="absolute right-0 top-8 w-40 rounded-lg shadow-2xl border overflow-hidden z-50 animate-fade-in"
                  style="background-color: #09090b; border-color: var(--color-border1)"
                >
                  <button 
                    @click.stop="handleEdit(kb)"
                    class="w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <Edit :size="16" /> Editar
                  </button>
                  <button 
                    @click.stop="requestDelete(kb)"
                    class="w-full text-left px-4 py-3 text-sm flex items-center gap-2 transition-colors cursor-pointer border-t border-white/5"
                    style="color: var(--color-text2); background-color: rgba(239, 67, 67, 0.05)"
                  >
                    <Trash2 :size="16" /> Excluir
                  </button>
                </div>
              </div>
            </div>

            <p class="text-sm text-gray-400 mb-6 line-clamp-2 min-h-[40px] relative z-10">
              {{ kb.description || 'Sem descrição definida para esta base.' }}
            </p>

            <div class="mt-auto space-y-3 pt-4 border-t border-white/5 relative z-10">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500 flex items-center gap-1.5">
                  <User :size="14" /> Cliente
                </span>
                <span class="text-gray-300 font-medium truncate max-w-[150px]">
                  {{ kb.user?.name || 'Não identificado' }}
                </span>
              </div>

              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-500 flex items-center gap-1.5">
                  <Box :size="14" /> Produto
                </span>
                <span class="text-gray-300 font-medium truncate max-w-[150px]">
                  {{ kb.product?.name || 'Não vinculado' }}
                </span>
              </div>

               <div class="flex items-center justify-between text-xs pt-2 mt-2 border-t border-white/5">
                <span class="text-gray-500 flex items-center gap-1.5">
                  <Calendar :size="14" /> Criado em
                </span>
                <span class="text-gray-400">
                  {{ formatDate(kb.created_at) }}
                </span>
              </div>
            </div>
          </div>

          <div v-if="filteredKnowledgeBases.length === 0" class="col-span-full flex flex-col items-center justify-center py-12 text-gray-500">
            <Search class="w-12 h-12 mb-3 opacity-20" />
            <p>Nenhum resultado encontrado para "{{ searchTerm }}"</p>
          </div>

        </div>
      </div>

      <Card v-else padding="none" class="overflow-hidden">
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="p-4 rounded-full mb-4" style="background-color: rgba(124, 186, 16, 0.1)">
            <Inbox class="w-12 h-12 text-gray-500" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Nenhum item encontrado</h3>
          <p class="text-gray-400 mb-6 max-w-md">
            Comece adicionando seu primeiro item clicando no botão abaixo.
          </p>
          <Button variant="ghost" class="cursor-pointer" @click="openModal">
            Criar Agora
          </Button>
        </div>
      </Card>

    </main>
    
    <ModalCriarBaseConhecimento :aberto="isModalOpen" @close="handleModalClose" /> 

    <div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div 
          class="w-full max-w-md rounded-2xl border p-6 shadow-2xl relative"
          style="background-color: #09090b; border-color: var(--color-border1)"
        >
          <div class="mb-4 flex items-center justify-center w-12 h-12 rounded-full mx-auto" style="background-color: rgba(239, 67, 67, 0.1)">
              <AlertTriangle class="w-6 h-6" style="color: var(--color-text2)" />
          </div>

          <h3 class="text-xl font-bold text-white text-center mb-2">Excluir Base de Conhecimento?</h3>
          <p class="text-gray-400 text-center mb-6 text-sm">
             Você tem certeza que deseja excluir <strong>{{ itemToDelete?.name }}</strong>? <br>
             Esta ação não pode ser desfeita.
          </p>

          <div class="flex gap-3">
             <button 
                @click="showDeleteConfirm = false"
                class="flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer"
             >
                Cancelar
             </button>
             <button 
                @click="confirmDelete"
                :disabled="isDeleting"
                class="flex-1 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg transition-all transform active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                style="background-color: var(--color-text2); box-shadow: 0 4px 12px rgba(239,67,67,0.3)"
             >
                <span v-if="isDeleting" class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                <span v-else>Sim, Excluir</span>
             </button>
          </div>
        </div>
    </div>

  </div>
</template>