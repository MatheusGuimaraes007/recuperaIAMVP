import { ref } from 'vue'
import { useProducts } from './useProducts'
import { supabase } from '../utils/supabase'


export const useAdminModalBaseConhecimento = () => {
  const step = ref(0)
  const nameknowledgeBase = ref('')
  const userknowledgeBase = ref('')
  const trainingType = ref(null)
  const typesOfTraining = [
    { id: 1, value: 'links', label: 'Apenas Link' },
    { id: 2, value: 'write', label: 'Apenas Texto' },
    { id: 3, value: 'both', label: 'Link e Texto' }
  ]
  const productCategory = ref('')
  const productSelected = ref('')
  const linksList = ref([])
  const write = ref('')
  const urlCreateKnowledgeBase = import.meta.env.VITE_CREATE_BASE;
  const statusCreateKnowledgeBase = ref('')
  const {fetchCategoriesTemplate, templatesOfCategories} = useProducts();
  const knowledgeBaseId = ref('')

  async function nextStep() {
    return step.value = step.value + 1
  }
  async function previousStep() {
    step.value = step.value - 1
    if (step.value === 1) {
      linksList.value = []
      write.value = ''
    }
    if (step.value === 0) {
      trainingType.value = null
      productSelected.value = ''
    }
  }
  async function createKnowledge(){
    const {data: dataCreateKnowledge, error: errorCreateKnowledge} = await supabase.from('knowledge_bases').insert({
      user_id: userknowledgeBase.value,
      product_id: productSelected.value,
      name: nameknowledgeBase.value,
      description: '',
    }).select().single();
    if (errorCreateKnowledge) {
      console.error('Erro ao criar base de conhecimento:', errorCreateKnowledge);
      return null;
    }
    knowledgeBaseId.value = dataCreateKnowledge.id
    return dataCreateKnowledge
  }


  async function createQuestions() {
    await fetchCategoriesTemplate(productCategory.value)

    for (const template of templatesOfCategories.value) {
      const { error: errorCreateQuestion } = await supabase
        .from('product_knowledge_entries')
        .insert({
          product_id: productSelected.value,
          template_id: template.id,
          category_id: productCategory.value,
          id_knowledge_base: knowledgeBaseId.value,
          question: template.question,
          answer: '',
          is_active: true,
          writer: template.writer
        });

      if (errorCreateQuestion) {
        console.error('Erro ao criar perguntas:', errorCreateQuestion);
        return;
      }
    }
  }


  async function createKnowledgeBase() {
      await createKnowledge();
      await createQuestions();
      statusCreateKnowledgeBase.value = 'loading'
      try {
        const basePayload = {
          nameknowledgeBase: nameknowledgeBase.value,
          userknowledgeBase: userknowledgeBase.value,
          trainingType: trainingType.value,
          productSelected: productSelected.value,
          linksList: linksList.value,
          write: write.value,
          productCategory: productCategory.value,
          knowledgeBaseId: knowledgeBaseId.value
        } 
        const response = await fetch(urlCreateKnowledgeBase, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apiKey': import.meta.env.VITE_APIKEY_BACKEND
          },
          body: JSON.stringify(basePayload)
        })
        if (!response.ok) {
          throw new Error(`Erro na API: ${response.status} - ${response.statusText}`)
        }
        const data = await response.json();
        console.log('Sucesso:', data)
        statusCreateKnowledgeBase.value = 'success'
        return data;
      } catch (error) {
        console.error('Erro ao criar base de conhecimento:', error)
        statusCreateKnowledgeBase.value = 'error'
        return null; 
      }
  }

function resetState() {
    nameknowledgeBase.value = '';
    userknowledgeBase.value = '';
    trainingType.value = null;
    productCategory.value = null;
    productSelected.value = '';
    linksList.value = [];
    write.value = '';
    knowledgeBaseId.value = '';
    
    step.value = 0;
    statusCreateKnowledgeBase.value = ''; 
  }

  return {
    step,
    nextStep,
    previousStep,
    nameknowledgeBase,
    userknowledgeBase,
    trainingType,
    typesOfTraining,
    productSelected,
    linksList,
    write,
    createKnowledgeBase,
    statusCreateKnowledgeBase,
    productCategory,
    createQuestions,
    resetState
  }
}