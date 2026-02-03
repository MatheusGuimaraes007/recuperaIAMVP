<script setup>
import { onMounted, computed, reactive, watch, ref } from 'vue';
import { storeToRefs } from 'pinia';
import Navbar from '../../shared/Navbar.vue';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import EmptyState from '../../shared/EmptyState.vue';
import Pagination from '../../shared/Pagination.vue';
import { AlertTriangle, CheckCircle2, RefreshCw, ExternalLink } from 'lucide-vue-next';
import { useSystemErrorsStore, SYSTEM_ERRORS_PAGE_SIZE } from '../../stores/useSystemErrorsStore';

const store = useSystemErrorsStore();
const { logs, loading, totalCount, currentPage, filters, stats, error } = storeToRefs(store);

const editedRows = reactive({});
const savingRowId = ref(null);

const statusOptions = [
  { value: 'all', label: 'Todos' },
  { value: 'unresolved', label: 'Pendentes' },
  { value: 'resolved', label: 'Resolvidos' }
];

const totalPages = computed(() => {
  if (!totalCount.value) return 1;
  return Math.max(1, Math.ceil(totalCount.value / SYSTEM_ERRORS_PAGE_SIZE));
});

const totalErrors = computed(() => stats.value.resolved + stats.value.unresolved);

const getFilterCount = (status) => {
  switch (status) {
    case 'resolved':
      return stats.value.resolved;
    case 'unresolved':
      return stats.value.unresolved;
    default:
      return totalErrors.value;
  }
};

const syncEditedRows = () => {
  logs.value.forEach((log) => {
    editedRows[log.id] = {
      resolved: Boolean(log.resolved),
      comment: log.comment || ''
    };
  });
};

watch(logs, syncEditedRows, { immediate: true });

const fetchLogs = async (params = {}) => {
  const payload = {
    page: params.page ?? currentPage.value,
    status: params.status ?? filters.value.status
  };
  await store.fetchLogs(payload);
};

onMounted(() => {
  fetchLogs({ page: 1 });
});

const handleFilterChange = (status) => {
  if (filters.value.status === status) return;
  fetchLogs({ status, page: 1 });
};

const handlePageChange = (page) => {
  fetchLogs({ page });
};

const reload = () => {
  fetchLogs({ page: currentPage.value, status: filters.value.status });
};

const hasChanges = (log) => {
  const edited = editedRows[log.id];
  if (!edited) return false;
  return (
    edited.resolved !== Boolean(log.resolved) ||
    (edited.comment || '') !== (log.comment || '')
  );
};

const resetRow = (log) => {
  if (!editedRows[log.id]) return;
  editedRows[log.id].resolved = Boolean(log.resolved);
  editedRows[log.id].comment = log.comment || '';
};

const saveRow = async (log) => {
  const edited = editedRows[log.id];
  if (!edited || !hasChanges(log)) return;

  savingRowId.value = log.id;
  const payload = {
    resolved: edited.resolved,
    comment: edited.comment?.trim() || null
  };

  const result = await store.updateLog(log.id, payload);
  savingRowId.value = null;

  if (result?.success) {
    syncEditedRows();
  }
};

const formatDateTime = (value) => {
  if (!value) return '-';
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      timeZone: 'America/Sao_Paulo',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(value));
  } catch (e) {
    return value;
  }
};
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />

    <div class="p-4 md:p-6">
      <div class="max-w-[1500px] mx-auto space-y-6">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 class="text-3xl font-bold text-white">Erros do Sistema</h1>
            <p class="text-gray-400 text-sm">Monitore os workflows do n8n, registre comentários e marque o que já foi resolvido.</p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition"
            @click="reload"
            :disabled="loading"
          >
            <RefreshCw :size="18" :class="loading ? 'animate-spin' : ''" />
            Atualizar
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card padding="lg">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                <AlertTriangle :size="28" />
              </div>
              <div>
                <p class="text-sm text-gray-400">Pendentes</p>
                <p class="text-3xl font-bold text-white">{{ stats.unresolved }}</p>
              </div>
            </div>
          </Card>

          <Card padding="lg">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center">
                <CheckCircle2 :size="28" />
              </div>
              <div>
                <p class="text-sm text-gray-400">Resolvidos</p>
                <p class="text-3xl font-bold text-white">{{ stats.resolved }}</p>
              </div>
            </div>
          </Card>
        </div>

        <Card padding="lg">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="option in statusOptions"
              :key="option.value"
              type="button"
              class="px-4 py-2 rounded-full border transition text-sm"
              :class="filters.status === option.value
                ? 'border-primary text-primary bg-primary/10'
                : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-white'"
              @click="handleFilterChange(option.value)"
            >
              {{ option.label }}
              <span class="ml-2 text-xs text-gray-500">({{ getFilterCount(option.value) }})</span>
            </button>
          </div>
        </Card>

        <Card padding="lg" class="space-y-4">
          <div v-if="error" class="p-3 rounded-lg bg-red-500/10 border border-red-500/40 text-red-200 text-sm">
            {{ error }}
          </div>

          <LoadingState v-if="loading" message="Carregando erros..." />

          <EmptyState
            v-else-if="!logs.length"
            title="Nenhum erro encontrado"
            message="Ótimo! Não há erros registrados para o filtro selecionado."
            icon="shield"
          />

          <div v-else class="space-y-4">
            <div
              v-for="log in logs"
              :key="log.id"
              class="rounded-2xl border border-white/5 bg-white/5/5 p-5 space-y-4"
            >
              <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div>
                  <p class="text-sm text-gray-400">Workflow</p>
                  <p class="text-white text-lg font-semibold">{{ log.workflow_name || 'Sem nome' }}</p>
                  <div class="flex flex-wrap gap-4 text-sm text-gray-500 mt-2">
                    <span>Registrado: <span class="text-white">{{ formatDateTime(log.created_at) }}</span></span>
                    <span>Atualizado: <span class="text-white">{{ formatDateTime(log.update_at) }}</span></span>
                  </div>
                </div>
                <a
                  v-if="log.workflow_link"
                  :href="log.workflow_link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Ver workflow
                  <ExternalLink :size="16" />
                </a>
              </div>

              <div>
                <p class="text-sm text-gray-400 mb-2">Erro</p>
                <div class="bg-gray-900/60 rounded-xl p-4 text-sm text-gray-100 max-h-48 overflow-auto whitespace-pre-wrap wrap-break-word">
                  {{ log.error || 'Sem detalhes' }}
                </div>
              </div>

              <div v-if="editedRows[log.id]" class="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
                <div>
                  <p class="text-sm text-gray-400 mb-2">Status</p>
                  <label class="inline-flex items-center gap-3 cursor-pointer select-none">
                    <input type="checkbox" class="sr-only" v-model="editedRows[log.id].resolved" />
                    <span
                      class="w-12 h-6 rounded-full flex items-center p-1 transition"
                      :class="editedRows[log.id].resolved ? 'bg-green-500/70 justify-end' : 'bg-red-500/40 justify-start'"
                    >
                      <span class="w-4 h-4 rounded-full bg-white"></span>
                    </span>
                    <span :class="editedRows[log.id].resolved ? 'text-green-400' : 'text-red-300'" class="text-sm font-medium">
                      {{ editedRows[log.id].resolved ? 'Resolvido' : 'Pendente' }}
                    </span>
                  </label>
                </div>

                <div class="lg:col-span-2">
                  <p class="text-sm text-gray-400 mb-2">Comentário</p>
                  <textarea
                    v-model="editedRows[log.id].comment"
                    rows="4"
                    class="w-full rounded-xl border border-gray-700 bg-gray-900/50 text-sm text-gray-100 p-3 focus:outline-none focus:border-primary"
                    placeholder="Descreva a causa do erro, ação tomada ou próximos passos"
                  ></textarea>
                </div>
              </div>

              <div class="flex flex-wrap items-center justify-end gap-3">
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 transition"
                  @click="resetRow(log)"
                  :disabled="!hasChanges(log)"
                >
                  Descartar alterações
                </button>
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg bg-primary text-black font-semibold hover:brightness-110 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  :disabled="!hasChanges(log) || savingRowId === log.id"
                  @click="saveRow(log)"
                >
                  {{ savingRowId === log.id ? 'Salvando...' : 'Salvar' }}
                </button>
              </div>
            </div>

            <Pagination
              :current-page="currentPage"
              :total-pages="totalPages"
              :total-count="totalCount"
              :items-per-page="SYSTEM_ERRORS_PAGE_SIZE"
              entity-label="erros"
              @page-change="handlePageChange"
            />
          </div>
        </Card>
      </div>
    </div>
  </div>
</template>
