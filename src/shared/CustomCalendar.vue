<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  modelValue: { type: String, default: null }, 
  minDate: { type: String, default: '' },
  maxDate: { type: String, default: '' },
});

const emit = defineEmits(['update:modelValue']);

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const now = new Date();
const currentMonth = ref(props.modelValue ? new Date(props.modelValue + 'T12:00:00').getMonth() : now.getMonth());
const currentYear = ref(props.modelValue ? new Date(props.modelValue + 'T12:00:00').getFullYear() : now.getFullYear());

const calendarDays = computed(() => {
  const days = [];
  const firstDayOfWeek = new Date(currentYear.value, currentMonth.value, 1).getDay();
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();

  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ empty: true });
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = formatDateString(currentYear.value, currentMonth.value, day);
    
    days.push({
      day,
      fullDate: dateStr,
      isSelected: props.modelValue === dateStr,
      isToday: dateStr === formatDateString(now.getFullYear(), now.getMonth(), now.getDate()),
      isDisabled: checkDisabled(dateStr)
    });
  }

  return days;
});

const prevMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
};

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
};

const selectDate = (dayObj) => {
  if (dayObj.empty || dayObj.isDisabled) return;
  emit('update:modelValue', dayObj.fullDate);
};

const formatDateString = (year, month, day) => {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
};

const checkDisabled = (dateStr) => {
  if (props.minDate && dateStr < props.minDate) return true;
  if (props.maxDate && dateStr > props.maxDate) return true;
  return false;
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const d = new Date(newVal + 'T12:00:00');
    currentMonth.value = d.getMonth();
    currentYear.value = d.getFullYear();
  }
});
</script>

<template>
  <div class="p-2 w-full max-w-[280px] select-none">
    
    <div class="flex justify-between items-center mb-4 px-1">
      <button 
        @click.stop="prevMonth" 
        class="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
      </button>
      
      <span class="text-sm font-bold text-white capitalize">
        {{ monthNames[currentMonth] }} <span class="text-gray-500 ml-1">{{ currentYear }}</span>
      </span>

      <button 
        @click.stop="nextMonth"
        class="p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
      </button>
    </div>

    <div class="grid grid-cols-7 mb-2">
      <div v-for="day in weekDays" :key="day" class="text-center text-[10px] uppercase font-medium text-gray-500">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-1">
      <template v-for="(dayObj, index) in calendarDays" :key="index">
        <div v-if="dayObj.empty" class="h-8 w-8"></div>
        
        <button
          v-else
          @click.stop="selectDate(dayObj)"
          :disabled="dayObj.isDisabled"
          class="h-8 w-8 flex items-center justify-center rounded-lg text-xs transition-all duration-200 relative"
          :class="[
            dayObj.isSelected 
              ? 'bg-[#7cba10] text-[#1a1a1a] font-bold shadow-[0_0_10px_rgba(124,186,16,0.4)]' 
              : 'text-gray-300 hover:bg-white/10',
            
            dayObj.isToday && !dayObj.isSelected 
              ? 'border border-[#7cba10]/50 text-[#7cba10]' 
              : '',

            dayObj.isDisabled 
              ? 'opacity-20 cursor-not-allowed hover:bg-transparent' 
              : 'cursor-pointer'
          ]"
        >
          {{ dayObj.day }}
        </button>
      </template>
    </div>
  </div>
</template>