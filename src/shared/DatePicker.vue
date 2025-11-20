<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import CustomCalendar from './CustomCalendar.vue'; 

const props = defineProps({
  modelValue: { type: Object, default: () => ({ startDate: null, endDate: null }) },
  label: { type: String, default: 'Período' }
});

const emit = defineEmits(['update:modelValue', 'apply', 'clear']);

const isOpen = ref(false);
const containerRef = ref(null);
const startDate = ref(props.modelValue.startDate || null);
const endDate = ref(props.modelValue.endDate || null);

const today = new Date().toISOString().split('T')[0];

const formattedDateRange = computed(() => {
  if (!startDate.value && !endDate.value) return 'Selecione um período';
  const start = startDate.value ? formatDateBr(startDate.value) : '...';
  const end = endDate.value ? formatDateBr(endDate.value) : '...';
  return `${start} - ${end}`;
});

const isRangeSelected = computed(() => startDate.value && endDate.value);

const formatDateBr = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};

const handleApply = () => {
  if (isRangeSelected.value) {
    const payload = { startDate: startDate.value, endDate: endDate.value };
    emit('update:modelValue', payload);
    emit('apply', payload);
    isOpen.value = false;
  }
};

const handleClear = () => {
  startDate.value = null;
  endDate.value = null;
  emit('update:modelValue', { startDate: null, endDate: null });
  emit('clear');
  isOpen.value = false;
};

const handleClickOutside = (event) => {
  if (containerRef.value && !containerRef.value.contains(event.target)) {
    isOpen.value = false;
  }
};

onMounted(() => document.addEventListener('click', handleClickOutside));
onUnmounted(() => document.removeEventListener('click', handleClickOutside));
</script>

<template>
  <div ref="containerRef" class="relative w-full max-w-sm">
    
    <button
      @click.stop="isOpen = !isOpen"
      type="button"
      class="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-200 group"
      :class="[
        isRangeSelected || isOpen
          ? 'border-[#7cba10] bg-[#7cba10]/5 text-white shadow-[0_0_15px_rgba(124,186,16,0.15)]' 
          : 'border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-300 bg-[#1a1a1a]'
      ]"
    >
      <div class="flex items-center gap-3 overflow-hidden">
        <div 
          class="p-1.5 rounded-md transition-colors"
          :class="isRangeSelected ? 'bg-[#7cba10]/20 text-[#7cba10]' : 'bg-gray-800 text-gray-500'"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div class="flex flex-col items-start">
          <span class="text-[10px] font-bold uppercase tracking-wider opacity-60" 
                :class="isRangeSelected ? 'text-[#7cba10]' : 'text-gray-500'">
            {{ label }}
          </span>
          <span class="text-sm font-medium truncate">
            {{ formattedDateRange }}
          </span>
        </div>
      </div>
      <svg class="w-4 h-4 transition-transform duration-300 ml-2" :class="isOpen ? 'rotate-180 text-[#7cba10]' : 'text-gray-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="absolute z-50 mt-3 p-5 rounded-2xl shadow-2xl border backdrop-blur-xl"
        style="background-color: var(--color-background4, #1e1e1e); border-color: rgba(124, 186, 16, 0.3); width: max-content;"
      >
        <div class="flex flex-col md:flex-row gap-6">
          
          <div class="flex flex-col">
            <label class="text-xs font-medium text-[#7cba10] mb-2 ml-2 uppercase tracking-wide">Data Inicial</label>
            <div class="bg-black/20 rounded-xl border border-gray-800">
              <CustomCalendar 
                v-model="startDate" 
                :max-date="today"
              />
            </div>
          </div>

          <div class="hidden md:block w-[1px] bg-gray-800 my-2"></div>

          <div class="flex flex-col">
            <label class="text-xs font-medium text-[#7cba10] mb-2 ml-2 uppercase tracking-wide">Data Final</label>
            <div class="bg-black/20 rounded-xl border border-gray-800">
              <CustomCalendar 
                v-model="endDate" 
                :min-date="startDate"
                :max-date="today"
              />
            </div>
          </div>

        </div>

        <div class="flex items-center justify-between gap-3 pt-4 border-t border-gray-700/50 mt-4">
          <button
            @click="handleClear"
            class="px-4 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            Limpar Seleção
          </button>
          
          <button
            @click="handleApply"
            :disabled="!isRangeSelected"
            class="px-8 py-2 rounded-lg text-sm font-bold text-[#1a1a1a] shadow-lg transition-all transform active:scale-95 flex items-center gap-2"
            :class="isRangeSelected 
              ? 'bg-[#7cba10] hover:bg-[#8cd112] shadow-[#7cba10]/20 cursor-pointer' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'"
          >
            Aplicar
          </button>
        </div>

      </div>
    </transition>
  </div>
</template>