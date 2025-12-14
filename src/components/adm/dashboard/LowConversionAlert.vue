<script setup>
import { AlertTriangle, TrendingDown, Users } from 'lucide-vue-next';
import Card from '../../../shared/Card.vue';
import SkeletonBase from '../../../shared/Skeleton/SkeletonBase.vue';

defineProps({
  clients: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  formatPercent: {
    type: Function,
    required: true
  }
});
</script>

<template>
  <Card v-if="clients.length > 0 || loading" padding="md" class="mb-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center gap-4">
      <SkeletonBase width="w-10" height="h-10" rounded="rounded-lg" />
      <div class="flex-1 space-y-2">
        <SkeletonBase width="w-48" height="h-5" />
        <SkeletonBase width="w-64" height="h-4" />
      </div>
    </div>

    <!-- Alert Content -->
    <div v-else class="flex items-start gap-4">
      <!-- Icon -->
      <div class="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
        <AlertTriangle :size="20" class="text-red-500" />
      </div>

      <!-- Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 mb-2">
          <h3 class="text-base font-semibold text-red-400">
            Atenção: {{ clients.length }} cliente{{ clients.length !== 1 ? 's' : '' }} com baixa conversão
          </h3>
        </div>

        <p class="text-sm text-gray-400 mb-3">
          Os seguintes clientes apresentam taxa de conversão abaixo de 12% e podem necessitar de atenção:
        </p>

        <!-- Clients List -->
        <div class="flex flex-wrap gap-2">
          <div
              v-for="client in clients.slice(0, 5)"
              :key="client.id"
              class="inline-flex items-center gap-2 px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg"
          >
            <Users :size="14" class="text-red-400" />
            <span class="text-sm font-medium text-white">{{ client.name }}</span>
          </div>

          <!-- Show more indicator -->
          <div
              v-if="clients.length > 5"
              class="inline-flex items-center gap-2 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg"
          >
            <span class="text-sm text-gray-400">
              +{{ clients.length - 5 }} {{ clients.length - 5 === 1 ? 'outro' : 'outros' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>