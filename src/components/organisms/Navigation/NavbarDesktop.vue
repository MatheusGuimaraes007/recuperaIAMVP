<script setup>
import { useRouter, useRoute } from 'vue-router'
import * as Icons from 'lucide-vue-next'

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

const router = useRouter()
const route = useRoute()

const isActive = (path) => {
  return route.path === path || route.path.startsWith(path + '/')
}

const navigate = (path) => {
  router.push(path)
}

const getIcon = (iconName) => {
  return Icons[iconName] || Icons.Circle
}
</script>

<template>
  <nav class="hidden md:flex items-center space-x-1">
    <button
        v-for="item in items"
        :key="item.path"
        @click="navigate(item.path)"
        :class="[
        'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
        'hover:bg-white/5',
        isActive(item.path)
          ? 'bg-primary/10 text-primary'
          : 'text-gray-400 hover:text-white'
      ]"
    >
      <component :is="getIcon(item.icon)" :size="18" />
      <span class="text-sm">{{ item.name }}</span>
    </button>
  </nav>
</template>
