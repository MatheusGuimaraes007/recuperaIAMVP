import { ref, computed } from 'vue';
import { supabase } from '../utils/supabase';
import { useAuthStore } from '../stores/useAuthStore';

export const useGuaranteeOpportunities = () => {
  const opportunities = ref([]);
  const metrics = ref({
    total: 0,
    won: 0,
    totalValue: 0,
    convertedValue: 0
  });
  const loading = ref(false);
  const error = ref(null);

  const setError = (message) => {
    error.value = message;
    setTimeout(() => {
      error.value = null;
    }, 5000);
  };

  const clearError = () => {
    error.value = null;
  };

  /**
   * NOVA FUNÇÃO: Busca apenas as métricas via RPC (Super Rápido)
   * Use esta para exibir os cards de métricas
   */
  const fetchGuaranteeMetrics = async (guaranteeId) => {
    if (!guaranteeId) {
      metrics.value = { total: 0, won: 0, totalValue: 0, convertedValue: 0 };
      return { success: true, data: metrics.value };
    }

    loading.value = true;
    clearError();

    try {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error: rpcError } = await supabase.rpc('get_guarantee_metrics', {
        p_user_id: userId,
        p_guarantee_id: guaranteeId
      });

      if (rpcError) throw rpcError;

      metrics.value = data || { total: 0, won: 0, totalValue: 0, convertedValue: 0 };
      return { success: true, data: metrics.value };
    } catch (err) {
      console.error('Erro ao buscar métricas da garantia:', err);
      setError('Erro ao carregar métricas. Tente novamente.');
      metrics.value = { total: 0, won: 0, totalValue: 0, convertedValue: 0 };
      return { success: false, error: err };
    } finally {
      loading.value = false;
    }
  };

  /**
   * MANTIDA: Busca lista completa de oportunidades (Apenas quando necessário)
   * Use esta apenas para exibir a lista/tabela de oportunidades
   */
  const fetchGuaranteeOpportunities = async (guaranteeId) => {
    if (!guaranteeId) {
      opportunities.value = [];
      return { success: true, data: [] };
    }

    loading.value = true;
    clearError();

    try {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const { data: guaranteeData, error: guaranteeError } = await supabase
        .from('guarantees')
        .select('start_date, end_date')
        .eq('id', guaranteeId)
        .eq('user_id', userId)
        .single();

      if (guaranteeError) throw guaranteeError;

      let query = supabase
        .from('opportunities')
        .select(`
          *,
          contact:contacts(id, name, phone, email),
          agent:agents(id, name),
          product:products(id, name)
        `)
        .eq('user_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (guaranteeData.start_date) {
        query = query.gte('created_at', guaranteeData.start_date);
      }
      if (guaranteeData.end_date) {
        query = query.lte('created_at', guaranteeData.end_date);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      opportunities.value = data || [];
      return { success: true, data: opportunities.value };
    } catch (err) {
      console.error('Erro ao buscar oportunidades da garantia:', err);
      setError('Erro ao carregar oportunidades. Tente novamente.');
      opportunities.value = [];
      return { success: false, error: err };
    } finally {
      loading.value = false;
    }
  };

  /**
   * Busca oportunidades ganhas (won) da garantia
   */
  const fetchWonOpportunities = async (guaranteeId) => {
    if (!guaranteeId) {
      return { success: true, data: [] };
    }

    loading.value = true;
    clearError();

    try {
      const authStore = useAuthStore();
      const userId = authStore.user?.id;

      if (!userId) {
        throw new Error('Usuário não autenticado');
      }

      const { data: guaranteeData, error: guaranteeError } = await supabase
        .from('guarantees')
        .select('start_date, end_date')
        .eq('id', guaranteeId)
        .eq('user_id', userId)
        .single();

      if (guaranteeError) throw guaranteeError;

      let query = supabase
        .from('opportunities')
        .select(`
          *,
          contact:contacts(id, name, phone, email),
          agent:agents(id, name),
          product:products(id, name)
        `)
        .eq('user_id', userId)
        .eq('status', 'won')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (guaranteeData.start_date) {
        query = query.gte('created_at', guaranteeData.start_date);
      }
      if (guaranteeData.end_date) {
        query = query.lte('created_at', guaranteeData.end_date);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      return { success: true, data: data || [] };
    } catch (err) {
      console.error('Erro ao buscar oportunidades ganhas:', err);
      setError('Erro ao carregar oportunidades ganhas.');
      return { success: false, error: err };
    } finally {
      loading.value = false;
    }
  };

  const opportunitiesMetrics = computed(() => metrics.value);

  const opportunitiesByStatus = computed(() => {
    const grouped = {
      active: [],
      won: [],
      lost: [],
      paused: []
    };

    opportunities.value.forEach(opp => {
      if (grouped[opp.status]) {
        grouped[opp.status].push(opp);
      }
    });

    return grouped;
  });

  const activeOpportunities = computed(() => 
    opportunitiesByStatus.value.active
  );

  const wonOpportunities = computed(() => 
    opportunitiesByStatus.value.won
  );

  const lostOpportunities = computed(() => 
    opportunitiesByStatus.value.lost
  );

  const hasOpportunities = computed(() => 
    opportunities.value.length > 0
  );

  return {
    opportunities,
    metrics,
    loading,
    error,

    opportunitiesMetrics,
    opportunitiesByStatus,
    activeOpportunities,
    wonOpportunities,
    lostOpportunities,
    hasOpportunities,

    fetchGuaranteeMetrics,    
    fetchGuaranteeOpportunities, 
    fetchWonOpportunities,
    clearError
  };
};