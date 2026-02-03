import { defineStore } from 'pinia';
import { ref } from 'vue';
import { supabase } from '../utils/supabase';
import ErrorHandler from '../utils/errorHandler';

export const SYSTEM_ERRORS_PAGE_SIZE = 20;

export const useSystemErrorsStore = defineStore('systemErrors', () => {
  const logs = ref([]);
  const totalCount = ref(0);
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const filters = ref({ status: 'all' });
  const stats = ref({ resolved: 0, unresolved: 0 });

  const setError = (message) => {
    error.value = message;
    if (message) {
      setTimeout(() => {
        error.value = null;
      }, 4000);
    }
  };

  const clearError = () => {
    error.value = null;
  };

  const fetchCounts = async () => {
    try {
      const [resolvedResult, unresolvedResult] = await Promise.all([
        supabase
          .from('logs_error_n8n')
          .select('id', { count: 'exact', head: true })
          .eq('resolved', true),
        supabase
          .from('logs_error_n8n')
          .select('id', { count: 'exact', head: true })
          .eq('resolved', false)
      ]);

      stats.value = {
        resolved: resolvedResult?.count || 0,
        unresolved: unresolvedResult?.count || 0
      };
    } catch (e) {
      console.warn('Não foi possível calcular os totais de erros:', e.message || e);
    }
  };

  const fetchLogs = async ({ page = currentPage.value, status = filters.value.status } = {}) => {
    loading.value = true;
    clearError();

    try {
      const from = (page - 1) * SYSTEM_ERRORS_PAGE_SIZE;
      const to = from + SYSTEM_ERRORS_PAGE_SIZE - 1;

      let query = supabase
        .from('logs_error_n8n')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (status === 'resolved') {
        query = query.eq('resolved', true);
      } else if (status === 'unresolved') {
        query = query.eq('resolved', false);
      }

      const { data, count, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      logs.value = data || [];
      totalCount.value = count || 0;
      currentPage.value = page;
      filters.value.status = status;

      await fetchCounts();

      return { success: true, data };
    } catch (err) {
      const friendly = ErrorHandler.handle(err, 'fetchSystemErrors');
      setError(friendly);
      return { success: false, error: err };
    } finally {
      loading.value = false;
    }
  };

  const updateLog = async (id, payload = {}) => {
    try {
      const updates = {
        ...payload,
        update_at: new Date().toISOString()
      };

      const { data, error: updateError } = await supabase
        .from('logs_error_n8n')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (updateError) throw updateError;

      const index = logs.value.findIndex((log) => log.id === id);
      if (index !== -1) {
        logs.value[index] = data;
      }

      await fetchCounts();

      return { success: true, data };
    } catch (err) {
      const friendly = ErrorHandler.handle(err, 'updateSystemError', { id, payload });
      setError(friendly);
      return { success: false, error: err };
    }
  };

  return {
    logs,
    totalCount,
    loading,
    error,
    currentPage,
    filters,
    stats,
    fetchLogs,
    updateLog,
    SYSTEM_ERRORS_PAGE_SIZE
  };
});
