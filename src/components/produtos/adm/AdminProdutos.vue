<script setup>
import { onMounted, ref, computed } from 'vue';
import Navbar from '../../../shared/Navbar.vue';
import Card from '../../../shared/Card.vue';
import Button from '../../../shared/Button.vue';
import Alert from '../../../shared/Alert.vue';
import { useProducts } from '../../../composables/useProducts';
import { useUSers } from '../../../composables/useUsers';
import { formatDate } from '../../../utils/formatters';
import { Box, Plus, Filter, Search, Calendar, DollarSign, Package, Trash2, AlertTriangle, Edit, User, Save, X } from 'lucide-vue-next';

const { 
  allProducts, 
  fetchAlProducts, 
  deleteProductById, 
  editProductById, 
  createProduct, 
  nameProduct, 
  descriptionProduct,
  userUuid,
  productCheckoutId,
  productPlataform
} = useProducts();

const { fetchAllUsers, allUsers } = useUSers();

const props = defineProps({
  pageTitle: { type: String, default: 'Todos os Produtos' },
  pageDescription: { type: String, default: 'Base de todos os produtos dos clientes' },
  pageIcon: { type: String, default: 'default' }
});

const loading = ref(false);
const searchTerm = ref('');

const showCreateForm = ref(false);
const showDeleteConfirm = ref(false);
const showEditModal = ref(false);
const productToAction = ref(null);
const isProcessing = ref(false);

const isAlertVisible = ref(false);
const alertMessage = ref('');
const alertType = ref('success');

const showAlert = (type, message) => {
  alertType.value = type;
  alertMessage.value = message;
  isAlertVisible.value = true;
  if (type === 'success') {
    setTimeout(() => {
      isAlertVisible.value = false;
    }, 3000);
  }
};

onMounted(async () => {
  loading.value = true;
  await fetchAllUsers();
  await fetchAlProducts();
  loading.value = false;
});

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
  if (!showCreateForm.value) {
    clearForm();
  }
};

const handleCreateProduct = async () => {
  if (!userUuid.value || !nameProduct.value) {
    showAlert('error', 'Por favor, selecione um cliente e preencha o nome do produto.');
    return;
  }

  isProcessing.value = true;
  const newProduct = await createProduct();
  
  if (newProduct) {
    userUuid.value = '';
    await fetchAlProducts();
    showCreateForm.value = false;
    clearForm();
    showAlert('success', 'Produto criado com sucesso!');
  } else {
    showAlert('error', 'Erro ao criar produto. Tente novamente.');
  }
  isProcessing.value = false;
};

const clearForm = () => {
  nameProduct.value = '';
  descriptionProduct.value = '';
  userUuid.value = '';
};

const openDeleteModal = (product) => {
  productToAction.value = product;
  showDeleteConfirm.value = true;
};

const confirmDelete = async () => {
  if (!productToAction.value) return;
  isProcessing.value = true;
  const error = await deleteProductById(productToAction.value.id);
  
  if (!error) {
    await fetchAlProducts();
    showDeleteConfirm.value = false;
    productToAction.value = null;
    showAlert('success', 'Produto excluído com sucesso!');
  } else {
    showAlert('error', 'Erro ao excluir produto.');
  }
  isProcessing.value = false;
};

const openEditModal = (product) => {
  productToAction.value = product;
  nameProduct.value = product.name;
  descriptionProduct.value = product.description || '';
  showEditModal.value = true;
};

const saveEdit = async () => {
  if (!productToAction.value) return;
  isProcessing.value = true;
  const result = await editProductById(productToAction.value.id);
  
  if (result) {
    await fetchAlProducts();
    showEditModal.value = false;
    productToAction.value = null;
    clearForm();
    showAlert('success', 'Produto atualizado com sucesso!');
  } else {
    showAlert('error', 'Erro ao salvar edição.');
  }
  isProcessing.value = false;
};

const filteredProducts = computed(() => {
  if (!searchTerm.value) return allProducts.value || [];
  const term = searchTerm.value.toLowerCase();
  
  return (allProducts.value || []).filter(p => {
    const matchesName = p.name?.toLowerCase().includes(term);
    const matchesDesc = p.description?.toLowerCase().includes(term);
    const matchesClient = p.user?.name?.toLowerCase().includes(term);
    return matchesName || matchesDesc || matchesClient;
  });
});

const hasItems = computed(() => filteredProducts.value.length > 0);
</script>

<template>
  <div class="min-h-screen" style="background-color: var(--color-background3)">
    <Navbar />

    <div v-if="isAlertVisible" class="fixed top-20 left-0 right-0 z-150 flex justify-center px-4 animate-fade-in-down">
       <div class="w-full max-w-lg shadow-2xl">
          <Alert 
            :type="alertType" 
            :message="alertMessage" 
            :dismissible="true"
            @dismiss="isAlertVisible = false" 
          />
       </div>
    </div>

    <main class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <Card padding="lg" class="mb-8">
        <div class="flex items-center gap-4">
          <div class="p-3 rounded-xl" style="background-color: rgba(124, 186, 16, 0.1)">
            <Box class="w-8 h-8" style="color: var(--color-text1)" />
          </div>
          <div>
            <h2 class="text-3xl font-bold text-white">{{ pageTitle }}</h2>
            <p class="text-gray-400">{{ pageDescription }}</p>
          </div>
        </div>
      </Card>

      <div class="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div class="flex gap-3 w-full md:w-auto">
          <Button 
            variant="primary" 
            class="cursor-pointer flex items-center gap-2"
            @click="toggleCreateForm"
          >
            <component :is="showCreateForm ? X : Plus" :size="20" />
            {{ showCreateForm ? 'Cancelar' : 'Novo Produto' }}
          </Button>
        </div>
        
        <div class="relative w-full md:w-64">
          <input
              v-model="searchTerm"
              type="text"
              placeholder="Buscar por produto ou cliente..."
              class="w-full px-4 py-2 pl-10 rounded-lg border border-gray-700 focus:ring-2 focus:outline-none transition-colors"
              style="background-color: var(--color-background2); color: white; border-color: var(--color-border1); --tw-ring-color: var(--color-text1)"
          />
          <Search class="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div v-if="showCreateForm" class="mb-8 animate-fade-in-down">
        <div class="rounded-xl border p-6" style="background-color: #09090b; border-color: var(--color-border1)">
            <h3 class="text-xl font-bold text-white mb-4">Novo Produto</h3>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Cliente / Dono</label>
                    <div class="relative">
                        <select 
                            v-model="userUuid"
                            class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none appearance-none cursor-pointer"
                        >
                            <option value="" disabled selected>Selecione um cliente...</option>
                            <option v-for="user in allUsers" :key="user.id" :value="user.id">
                                {{ user.name }} ({{ user.email }})
                            </option>
                        </select>
                        <User class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" :size="16" />
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Nome do Produto</label>
                    <input 
                        v-model="nameProduct"
                        type="text" 
                        class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none"
                        placeholder="Ex: Consultoria Financeira"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Plataforma</label>
                    <input 
                        v-model="productPlataform"
                        type="text" 
                        class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none"
                        placeholder="Ex: 123456"
                    />
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">ID do Produto - Checkout</label>
                    <input 
                        v-model="productCheckoutId"
                        type="text" 
                        class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none"
                        placeholder="Ex: 123456"
                    />
                </div>

                <div class="md:col-span-2">
                    <label class="block text-sm font-medium text-gray-300 mb-2">Descrição</label>
                    <textarea 
                        v-model="descriptionProduct"
                        rows="2" 
                        class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none resize-none"
                        placeholder="Breve descrição do produto..."
                    ></textarea>
                </div>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button 
                    @click="toggleCreateForm"
                    class="px-6 py-2.5 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors"
                >
                    Cancelar
                </button>
                <button 
                    @click="handleCreateProduct"
                    :disabled="isProcessing"
                    class="px-6 py-2.5 rounded-xl text-sm font-bold text-background4 shadow-lg hover:shadow-[#7cba10]/20 transition-all transform active:scale-95 flex items-center gap-2"
                    style="background-color: var(--color-text1)"
                >
                    <span v-if="isProcessing" class="animate-spin w-4 h-4 border-2 border-background4/30 border-t-background4 rounded-full"></span>
                    <span v-else class="flex items-center gap-2"><Save :size="18" /> Salvar Produto</span>
                </button>
            </div>
        </div>
      </div>

      <div v-if="loading" class="flex flex-col items-center justify-center py-24">
         <svg class="animate-spin h-10 w-10" style="color: var(--color-text1)" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
         </svg>
         <p class="text-gray-400 mt-4 animate-pulse">Carregando produtos...</p>
      </div>

      <div v-else-if="hasItems" class="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in">
        <div 
          v-for="product in filteredProducts" 
          :key="product.id" 
          class="rounded-xl border p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group relative overflow-hidden flex flex-col"
          style="background-color: var(--color-background2); border-color: rgba(255,255,255,0.05)"
        >
          <div class="absolute inset-0 bg-linear-to-br from-[#7cba10]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

          <div class="flex justify-between items-start mb-4 relative z-10">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-lg bg-[#7cba10]/10 text-[#7cba10]">
                <Package :size="20" />
              </div>
              <h3 class="text-lg font-bold text-white leading-tight line-clamp-1" :title="product.name">
                {{ product.name }}
              </h3>
            </div>
            
            
            <div class="flex gap-2">
              <button @click.stop="openEditModal(product)" class="text-gray-500 hover:text-blue-400 transition-colors p-2 rounded-md hover:bg-blue-500/10 cursor-pointer" title="Editar">
                 <Edit :size="20" />
              </button>
              <button @click.stop="openDeleteModal(product)" class="text-gray-500 hover:text-text2 transition-colors p-2 rounded-md hover:bg-text2/10 cursor-pointer" title="Excluir">
                 <Trash2 :size="20" />
              </button>
            </div>
          </div>
          <p class="text-sm text-gray-400 mb-6 line-clamp-2 min-h-10 relative z-10">
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg text-[#7cba10]">
                    <h3 class="text-md text-white leading-tight line-clamp-1" :title="product.name">
                  <span class="font-bold">ID:</span> {{ product.checkout_id || 'N/A' }}
                    </h3>
                </div>
              </div>
            <div class="flex items-center gap-3">
                <div class="p-2 rounded-lg text-[#7cba10]">
                    <h3 class="text-md text-white leading-tight line-clamp-1" :title="product.name">
                  Plataforma: {{ product.plataform || 'N/A' }}
                    </h3>
                </div>
              </div>
            {{ product.description || 'Sem descrição cadastrada.' }}
          </p>

          <div class="mt-auto space-y-3 pt-4 border-t border-white/5 relative z-10">
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500 flex items-center gap-1.5"><User :size="14" /> Cliente</span>
              <span class="text-white font-medium truncate max-w-[150px]">{{ product.user?.name || 'Não identificado' }}</span>
            </div>
            <div class="flex items-center justify-between text-xs">
              <span class="text-gray-500 flex items-center gap-1.5"><Calendar :size="14" /> Criado em</span>
              <span class="text-gray-400">{{ formatDate(product.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>

      <Card v-else padding="none" class="overflow-hidden">
        <div class="flex flex-col items-center justify-center py-16 text-center">
          <div class="p-4 rounded-full mb-4" style="background-color: rgba(124, 186, 16, 0.1)">
            <Package class="w-12 h-12 text-gray-500" />
          </div>
          <h3 class="text-xl font-semibold text-white mb-2">Nenhum produto encontrado</h3>
          <Button v-if="!searchTerm" variant="ghost" class="cursor-pointer" @click="toggleCreateForm">
            Cadastrar Agora
          </Button>
        </div>
      </Card>

    </main>

    <div v-if="showEditModal" class="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div class="w-full max-w-lg rounded-2xl border p-8 shadow-2xl relative" style="background-color: #09090b; border-color: var(--color-border1)">
          <div class="mb-6"><h3 class="text-2xl font-bold text-white mb-1">Editar Produto</h3><p class="text-gray-400 text-sm">Atualize as informações.</p></div>
          <div class="space-y-2 mb-4">
             <div><label class="block text-sm font-medium text-gray-300 mb-2">Nome</label><input v-model="nameProduct" type="text" class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none" /></div>
             <div><label class="block text-sm font-medium text-gray-300 mb-2">Checkout ID</label><input v-model="productCheckoutId" type="text" class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none" /></div>
             <div><label class="block text-sm font-medium text-gray-300 mb-2">Plataforma</label><input v-model="productPlataform" type="text" class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none" /></div>
             <div><label class="block text-sm font-medium text-gray-300 mb-2">Descrição</label><textarea v-model="descriptionProduct" rows="3" class="w-full bg-black/20 border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none resize-none"></textarea></div>
          </div>
          <div class="flex gap-3 pt-4 border-t border-white/10">
             <button @click="showEditModal = false" class="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors cursor-pointer">Cancelar</button>
             <button @click="saveEdit" :disabled="isProcessing" class="flex-1 py-3 rounded-xl text-sm font-bold text-background4 shadow-lg hover:shadow-[#7cba10]/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer" style="background-color: var(--color-text1)">
                <span v-if="isProcessing" class="animate-spin w-4 h-4 border-2 border-background4/30 border-t-background4 rounded-full"></span><span v-else>Salvar</span>
             </button>
          </div>
        </div>
    </div>

    <div v-if="showDeleteConfirm" class="fixed inset-0 z-100 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
        <div class="w-full max-w-md rounded-2xl border p-6 shadow-2xl relative" style="background-color: #09090b; border-color: var(--color-border1)">
          <div class="mb-4 flex items-center justify-center w-12 h-12 rounded-full mx-auto" style="background-color: rgba(239, 67, 67, 0.1)"><AlertTriangle class="w-6 h-6" style="color: var(--color-text2)" /></div>
          <h3 class="text-xl font-bold text-white text-center mb-2">Excluir Produto?</h3>
          <p class="text-gray-400 text-center mb-6 text-sm">Você tem certeza que deseja excluir <strong>{{ productToAction?.name }}</strong>?</p>
          <div class="flex gap-3">
             <button @click="showDeleteConfirm = false" class="flex-1 py-2.5 rounded-lg text-sm font-semibold text-gray-300 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10 transition-colors">Cancelar</button>
             <button @click="confirmDelete" :disabled="isProcessing" class="flex-1 py-2.5 rounded-lg text-sm font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center gap-2" style="background-color: var(--color-text2); box-shadow: 0 4px 12px rgba(239,67,67,0.3)">
                <span v-if="isProcessing" class="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span><span v-else>Sim, Excluir</span>
             </button>
          </div>
        </div>
    </div>

  </div> 
</template>