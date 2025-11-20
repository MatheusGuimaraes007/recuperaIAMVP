import { supabase } from "../utils/supabase";
import { ref } from "vue";

export const useAdminDashboard = () => {
  const montlyRevenue = ref("");

  const fetchMonthlyRevenue = async () => {
    const { data: dataMonthlyRevenue, error: errorMonthlyRevenue } = await supabase.from('user_subscriptions').select('total_invested')
    if (errorMonthlyRevenue) {
      console.error('Erro ao buscar receita mensal:', errorMonthlyRevenue);
      return;
    }
    const total = dataMonthlyRevenue.reduce((acc, curr) => acc + (curr.total_invested || 0), 0);
    montlyRevenue.value = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(total);
  }

  return {
    fetchMonthlyRevenue,
    montlyRevenue
  }
}