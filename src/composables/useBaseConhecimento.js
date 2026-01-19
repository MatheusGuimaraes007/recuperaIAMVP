import { ref } from "vue";
import { supabase } from "../utils/supabase";

export function useBaseConhecimento() {
  const allKnowledgeBases = ref([])
  const loading = ref(false)
  const knowledgeBaseById = ref(null)
  const allQuestionsByKnowledgeBaseId = ref([])

  async function fetchAllKnowledgeBases(filters = {}) {
    loading.value = true
    let query = supabase
      .from('knowledge_bases')
      .select(`
        *,
        user:users (name),
        product:products (name)
      `)
      .order('created_at', { ascending: false })

    // filter by user/client if provided
    if (filters.userId) {
      query = query.eq('user_id', filters.userId)
    }

    if (filters.productId) {
      query = query.eq('product_id', filters.productId)
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar bases de conhecimento', error);
      loading.value = false
      return null;
    }

    allKnowledgeBases.value = data || [];
    loading.value = false
    return allKnowledgeBases.value;
  }

  async function deleteKnowledgeBase(knowledgeBaseId) {
    const { error: errorQuestions } = await supabase
        .from('product_knowledge_entries')
        .delete()
        .eq('id_knowledge_base', knowledgeBaseId)
    if (errorQuestions) {
        console.error('Erro ao limpar perguntas da base:', errorQuestions);
        return errorQuestions;
    }
    const { error } = await supabase
        .from('knowledge_bases')
        .delete()
        .eq('id', knowledgeBaseId)
    return error; 
  }

  async function fetchKnowledgeBaseById(knowledgeBaseId) {
    const { data: dataKnowledgeBaseById, error: errorKnowledgeBaseById } = await supabase
      .from('knowledge_bases')
      .select('*')
      .eq('id', knowledgeBaseId)
      .single();
    if (errorKnowledgeBaseById) {
      console.error('Erro ao buscar base de conhecimento por ID:', error);
      return null;
    }
    knowledgeBaseById.value = dataKnowledgeBaseById;
    return knowledgeBaseById.value;
  }

  async function fetchAllQuestionsByKnowledgeBaseId(knowledgeBaseId) {
    const { data: dataQuestions, error: errorQuestions } = await supabase
      .from('product_knowledge_entries')
      .select('*')
      .eq('id_knowledge_base', knowledgeBaseId)
      .order('id', { ascending: true });
    if (errorQuestions) {
      console.error('Erro ao buscar perguntas da base de conhecimento:', errorQuestions);
      return null;
    }
    allQuestionsByKnowledgeBaseId.value = dataQuestions;
    return allQuestionsByKnowledgeBaseId.value;
  }

  async function updateAnswerQuestion(questionId, newAnswer) {
    const { data, error } = await supabase
      .from('product_knowledge_entries')
      .update({ answer: newAnswer })
      .eq('id', questionId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar resposta da pergunta:', error);
      return error;
    }

    // Atualiza cache local para refletir imediatamente a alteração
    if (data) {
      allQuestionsByKnowledgeBaseId.value = allQuestionsByKnowledgeBaseId.value.map(q => {
        if (q.id === data.id) return { ...q, ...data };
        return q;
      });
    }

    return null;
  }

  return {
    allKnowledgeBases,
    fetchAllKnowledgeBases,
    loading,
    deleteKnowledgeBase,
    fetchKnowledgeBaseById,
    knowledgeBaseById,
    fetchAllQuestionsByKnowledgeBaseId,
    allQuestionsByKnowledgeBaseId,
    updateAnswerQuestion
  }
}