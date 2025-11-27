<script setup>
import { useRouter } from 'vue-router'
import Card from '../../shared/Card.vue'
import { ArrowLeft } from 'lucide-vue-next'

defineProps({
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  showBackButton: {
    type: Boolean,
    default: false
  },
  backRoute: {
    type: String,
    default: '/login'
  }
})

const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12 bg-background-base">
    <div class="w-full max-w-md animate-fade-in">

      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold mb-2 cursor-default select-none">
          <span class="text-white">recupera</span><span class="text-primary">.ia</span>
        </h1>
      </div>

      <Card padding="lg" class="border-border shadow-2xl relative overflow-hidden">
        <button
            v-if="showBackButton"
            @click="router.push(backRoute)"
            class="absolute top-6 left-6 p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all group"
            title="Voltar"
        >
          <ArrowLeft :size="20" class="group-hover:-translate-x-1 transition-transform" />
        </button>

        <div class="mb-8 text-center" :class="{ 'mt-4': showBackButton }">
          <h2 class="text-2xl font-bold text-white mb-2">{{ title }}</h2>
          <p v-if="subtitle" class="text-sm text-gray-400 max-w-xs mx-auto leading-relaxed">
            {{ subtitle }}
          </p>
        </div>

        <slot />
      </Card>

      <div v-if="$slots.footer" class="mt-8 text-center">
        <slot name="footer" />
      </div>

      <p class="mt-8 text-center text-xs text-gray-600">
        &copy; {{ new Date().getFullYear() }} Recupera.ai. Todos os direitos reservados.
      </p>
    </div>
  </div>
</template>