<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from './stores/useAuthStore';

const authStore = useAuthStore();

const handleVisibilityChange = async () => {
  if (document.visibilityState === 'visible') {
    if (authStore.session) {
      await authStore.refreshSession();
    }
  }
};

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<template>
  <router-view />
  <Toaster
      position="top-right"
      :duration="4000"
      :close-button="true"
      rich-colors
      :theme="'dark'"
  />
</template>