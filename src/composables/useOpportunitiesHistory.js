import { supabase } from "../utils/supabase";
import { ref } from "vue";

export const useOpportunitiesHistory = () => {
  const historyRecords = ref([]);
  const loading = ref(false);
  const error = ref(null);

  async function fetchOpportunitiesHistory(opportunityId) {
    loading.value = true;
    error.value = null; 
    const {data: dataHistory, error: errorHistory} = await supabase.from('opportunity_full_history').select('*').eq('opportunity_id', opportunityId)
    if (errorHistory) {
      error.value = 'Erro ao buscar histórico de oportunidades.';
      loading.value = false;
      return;
    }
    historyRecords.value = dataHistory;
    loading.value = false;
  }

  return {
    historyRecords,
    loading,
    error,
    fetchOpportunitiesHistory,
  }
}