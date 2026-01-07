<script setup>
/**
 * RSpacer - Espaçamento flexível
 */
const props = defineProps({
  size: {
    type: [String, Number],
    default: null
  }
})

const style = computed(() => {
  if (props.size) {
    return {
      width: '100%',
      height: typeof props.size === 'number' ? `${props.size}px` : props.size
    }
  }
  return { flex: 1 }
})
</script>

<template>
  <div class="r-spacer" :style="style" />
</template>

<style scoped>
.r-spacer {
  display: block;
}
</style>