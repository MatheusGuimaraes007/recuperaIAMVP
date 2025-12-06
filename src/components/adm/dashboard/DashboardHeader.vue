<script setup>
import { LayoutDashboard } from 'lucide-vue-next';
import Card from "../../../shared/Card.vue";
import SkeletonHeader from "../../../shared/Skeleton/SkeletonHeader.vue";

defineProps({
  userName: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>

<template>
  <Card padding="lg" class="mb-6">
    <SkeletonHeader v-if="loading" />

    <div v-else class="flex items-center gap-3">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
        <LayoutDashboard :size="24" class="text-white" />
      </div>
      <div>
        <h1 class="text-2xl font-bold text-white">Bem-vindo, {{ userName }}!</h1>
        <p class="text-gray-400 text-sm">Acompanhe o desempenho da sua plataforma</p>
      </div>
    </div>
  </Card>
</template>