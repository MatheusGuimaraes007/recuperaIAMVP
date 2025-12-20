<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from '../../../shared/Navbar.vue';
import Card from '../../../shared/Card.vue';
import Alert from '../../../shared/Alert.vue';
import { useBaseConhecimento } from '../../../composables/useBaseConhecimento';
import { BookOpen, Save, Bot, UserCheck } from 'lucide-vue-next';

const {
  fetchKnowledgeBaseById,
  knowledgeBaseById,
  fetchAllQuestionsByKnowledgeBaseId,
  allQuestionsByKnowledgeBaseId,
  updateAnswerQuestion
} = useBaseConhecimento();

const route = useRoute();
const baseId = route.params.baseId;

// Estados para controlar o Alerta
const isAlertVisible = ref(false);
const alertMessage = ref('');
const alertType = ref('error');

onMounted(async() => {
  await fetchKnowledgeBaseById(baseId);
  await fetchAllQuestionsByKnowledgeBaseId(baseId);
});

const pageTitle = computed(() => {
  if (knowledgeBaseById.value) {
    return `Edição da Base: ${knowledgeBaseById.value.name}`;
  }
  return 'Carregando Base de Conhecimento...';
});
const pageDescription = "Edite as configurações e o conteúdo desta base.";

const iaQuestions = computed(() => {
    return allQuestionsByKnowledgeBaseId.value.filter(q => q.writer === 'ia');
});

const expertQuestions = computed(() => {
    return allQuestionsByKnowledgeBaseId.value.filter(q => q.writer !== 'ia');
});

const handleSaveAnswer = async (question) => {
  isAlertVisible.value = false;

  const error = await updateAnswerQuestion(question.id, question.answer);
  
  if (error) {
    alertType.value = 'error';
    alertMessage.value = 'Erro ao salvar a resposta. Tente novamente.';
    isAlertVisible.value = true;
  } else {
    alertType.value = 'success';
    alertMessage.value = 'Resposta atualizada com sucesso!';
    isAlertVisible.value = true;
    
    setTimeout(() => {
      isAlertVisible.value = false;
    }, 3000);
  }
};
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

    <main class="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
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

      <div v-if="iaQuestions.length > 0" class="mb-12">
        <div class="flex items-center gap-3 mb-6 px-1">
            <div class="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <Bot :size="24" />
            </div>
            <div>
                <h3 class="text-xl font-bold text-white">IA Responde</h3>
                <p class="text-sm text-gray-400">Perguntas que serão respondidas automaticamente pela Inteligência Artificial</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            <div 
                v-for="question in iaQuestions" 
                :key="question.id" 
                class="bg-background2 border border-white/5 rounded-xl p-5 flex flex-col h-full hover:border-blue-500/30 transition-colors group"
            >
                <div class="flex justify-between items-start mb-3">
                    <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        IA AUTOMATION
                    </span>
                </div>

                <label class="block text-sm font-semibold text-gray-200 mb-3 min-h-10 leading-snug">
                    {{ question.question }}
                </label>
                
                <div class="flex-1 flex flex-col gap-3">
                    <textarea 
                        v-model="question.answer" 
                        placeholder="Digite a resposta modelo..."
                        class="w-full h-32 p-3 rounded-lg bg-black/20 text-white border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none text-sm leading-relaxed"
                    ></textarea>
                    
                    <button 
                        @click="handleSaveAnswer(question)"
                        class="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 mt-auto shadow-lg shadow-blue-900/20 cursor-pointer"
                        title="Salvar resposta"
                    >
                        <Save :size="16" />
                        Salvar Alteração
                    </button>
                </div>
            </div>
        </div>
      </div>

      <div v-if="expertQuestions.length > 0">
        <div class="flex items-center gap-3 mb-6 px-1 pt-6 border-t border-white/5">
            <div class="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <UserCheck :size="24" />
            </div>
            <div>
                <h3 class="text-xl font-bold text-white">Especialista (Humano)</h3>
                <p class="text-sm text-gray-400">Perguntas que necessitam de intervenção ou conhecimento técnico específico</p>
            </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
                v-for="question in expertQuestions" 
                :key="question.id" 
                class="bg-background2 border border-white/5 rounded-xl p-5 flex flex-col h-full hover:border-[#7cba10]/30 transition-colors group"
            >
                <div class="flex justify-between items-start mb-3">
                    <span class="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-400 border border-purple-500/20">
                        EXPERT MODE
                    </span>
                </div>

                <label class="block text-sm font-semibold text-gray-200 mb-3 min-h-10 leading-snug">
                    {{ question.question }}
                </label>
                
                <div class="flex-1 flex flex-col gap-3">
                    <textarea 
                        v-model="question.answer" 
                        placeholder="Digite a resposta do especialista..."
                        class="w-full h-20 p-3 rounded-lg bg-black/20 text-white border border-gray-700 focus:border-[#7cba10] focus:ring-1 focus:ring-[#7cba10] outline-none transition-all resize-none text-sm leading-relaxed"
                    ></textarea>
                    
                    <button 
                        @click="handleSaveAnswer(question)"
                        class="w-full py-2 rounded-lg bg-[#7cba10] hover:bg-[#6aa50e] text-background4 font-bold text-sm transition-colors flex items-center justify-center gap-2 mt-auto shadow-lg shadow-[#7cba10]/20 cursor-pointer"
                        title="Salvar resposta"
                    >
                        <Save :size="16" />
                        Salvar Alteração
                    </button>
                </div>
            </div>
        </div>
      </div>

    </main>
  </div>
</template>