import { supabase } from "../utils/supabase";
import { ref } from "vue";

export function usePlans() {
  const allPlans = ref([])

  async function fetchAllPlans() {
    try {
      const { data: dataAllPlans, error: errorAllPlans } = await supabase
        .from('plans')
        .select('id, name')
        .order('created_at', { ascending: true })

      if (errorAllPlans) {
        console.error('Erro ao buscar planos:', errorAllPlans);
        allPlans.value = []
        return [];
      }
      console.log('planos:', dataAllPlans)
      allPlans.value = dataAllPlans || []
      console.log('usePlans: planos carregados', allPlans.value)
      return allPlans.value
    } catch (err) {
      console.error('usePlans: erro inesperado ao buscar planos', err)
      allPlans.value = []
      return []
    }
  }


  return {
    allPlans,
    fetchAllPlans
  }
}