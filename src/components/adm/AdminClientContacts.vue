<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '../../shared/Navbar.vue';
import Card from '../../shared/Card.vue';
import LoadingState from '../../shared/LoadingState.vue';
import { supabase } from '../../utils/supabase';
import { formatPhone } from '../../utils/formatters';
import { useAdminClients } from '../../composables/useAdminClients.js';

const route = useRoute();
const router = useRouter();
const clientId = route.params.clientId;

const { fetchClientById, currentClient, loading: clientLoading } = useAdminClients();

const contacts = ref([]);
const loading = ref(false);
const error = ref(null);
const page = ref(1);
const pageSize = 20;
const total = ref(0);

const load = async (p = 1) => {
  loading.value = true;
  error.value = null;
  page.value = p;
  try {
    await fetchClientById(clientId);

    const from = (page.value - 1) * pageSize;
    const to = from + pageSize - 1;

    const { data: contactData, error: contactError, count } = await supabase
      .from('contacts')
      .select('id, name, phone, email', { count: 'exact' })
      .eq('user_id', clientId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (contactError) throw contactError;

    total.value = count || 0;

    // fetch opportunity counts per contact in parallel
    const enriched = await Promise.all((contactData || []).map(async (c) => {
      const { count: oppCount, error: cntErr } = await supabase
        .from('opportunities')
        .select('id', { count: 'exact', head: true })
        .eq('contact_id', c.id)
        .is('deleted_at', null);

      return {
        ...c,
        opportunities_count: cntErr ? 0 : (oppCount || 0)
      };
    }));

    contacts.value = enriched;
  } catch (err) {
    console.error('Erro ao carregar contatos do cliente', err);
    error.value = 'Erro ao carregar contatos.';
  } finally {
    loading.value = false;
  }
};

onMounted(load);

const goBack = () => {
  router.push(`/admin/dashboard/${clientId}`);
};
</script>

<template>
  <div class="min-h-screen bg-background-base">
    <Navbar />
    <div class="p-4 md:p-6">
      <div class="max-w-6xl mx-auto">
        <div class="mb-6">
          <button @click="goBack" class="group flex items-center gap-2 text-gray-400 hover:text-white transition-all duration-200 mb-4 px-3 py-2 rounded-lg hover:bg-gray-800/50">
            ← Voltar
          </button>
        </div>

        <LoadingState v-if="loading || clientLoading" message="Carregando contatos..." />

        <div v-else>
          <Card padding="lg" class="mb-6">
            <h2 class="text-2xl font-bold text-white mb-2">Contatos de {{ currentClient?.name }}</h2>
            <p class="text-gray-400">Lista de contatos do cliente e suas oportunidades associadas</p>
          </Card>
          <div class="flex items-center justify-between mb-4">
            <div class="text-sm text-gray-400">Mostrando <span class="text-white font-semibold">{{ contacts.length }}</span> de <span class="text-white font-semibold">{{ total }}</span> contatos</div>
            <div class="text-sm text-gray-400">Página <span class="text-white font-semibold">{{ page }}</span></div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card v-for="c in contacts" :key="c.id" padding="lg">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-bold text-white">{{ c.name }}</h3>
                  <p class="text-sm text-gray-400">{{ formatPhone(c.phone) }} • {{ c.email }}</p>
                </div>
                <div class="text-right">
                  <p class="text-gray-400 text-sm">Oportunidades</p>
                  <p class="text-white font-bold text-xl">{{ c.opportunities_count }}</p>
                </div>
              </div>
            </Card>
          </div>

          <div v-if="contacts.length === 0" class="mt-6 text-gray-400">Nenhum contato encontrado para este cliente.</div>
          <div v-if="error" class="mt-6 text-status-error">{{ error }}</div>

          <div class="flex items-center justify-between mt-6">
            <div class="text-sm text-gray-400">Por página: <span class="text-white font-semibold">{{ pageSize }}</span></div>
            <div class="flex items-center gap-2">
              <button class="px-3 py-1 rounded border" :disabled="page <= 1 || loading" @click="load(page - 1)">Anterior</button>
              <button class="px-3 py-1 rounded border" :disabled="(page * pageSize) >= total || loading" @click="load(page + 1)">Próxima</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
