<script setup>
import { LayoutDashboard, ShieldAlert } from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Card from "../../../shared/Card.vue";
import SkeletonHeader from "../../../shared/Skeleton/SkeletonHeader.vue";

const props = defineProps({
  userName: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  showSystemErrorsButton: {
    type: Boolean,
    default: false
  }
});

const router = useRouter();

const goToSystemErrors = () => {
  router.push({ name: 'AdminSystemErrors' });
};
</script>

<template>
  <Card padding="lg" class="mb-6">
    <SkeletonHeader v-if="loading" />

    <div v-else class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center">
          <LayoutDashboard :size="24" class="text-white" />
        </div>
        <div>
          <h1 class="text-2xl font-bold text-white">Bem-vindo, {{ userName }}!</h1>
          <p class="text-gray-400 text-sm">Acompanhe o desempenho da sua plataforma</p>
        </div>
      </div>

      <button
        v-if="showSystemErrorsButton"
        type="button"
        class="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-400 text-red-200 hover:bg-red-500/10 transition"
        @click="goToSystemErrors"
      >
        <ShieldAlert :size="18" />
        Ver erros do sistema
      </button>
    </div>
  </Card>
</template>