<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  isAdmin: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const handleLogoClick = () => {
  const route = props.isAdmin ? '/admin/dashboard' : '/dashboard'
  router.push(route)
}
</script>

<template>
  <button
      @click="handleLogoClick"
      class="flex items-center gap-2 group transition-transform hover:scale-105 active:scale-95"
  >
    <div class="flex items-center">
      <span class="text-2xl font-bold text-white group-hover:text-primary transition-colors">
        recupera
      </span>
      <span class="text-2xl font-bold text-primary">
        .ia
      </span>
    </div>
  </button>
</template>
