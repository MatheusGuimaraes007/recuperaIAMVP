<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  },
  formatValue: {
    type: Function,
    default: (val) => val
  }
});

const hoveredBar = ref(null);

const maxValue = computed(() => {
  if (!props.data || props.data.length === 0) return 1;
  return Math.max(...props.data.map(d => d.value), 1);
});

const chartHeight = 220;
const chartWidth = 580;
const padding = { top: 20, right: 10, bottom: 40, left: 50 };

const barWidth = computed(() => {
  if (!props.data || props.data.length === 0) return 0;
  const availableWidth = chartWidth - padding.left - padding.right;
  const spacing = 8;
  return (availableWidth - (props.data.length - 1) * spacing) / props.data.length;
});

const getBarX = (index) => {
  const spacing = 8;
  return padding.left + index * (barWidth.value + spacing);
};

const getBarHeight = (value) => {
  const availableHeight = chartHeight - padding.top - padding.bottom;
  return (value / maxValue.value) * availableHeight;
};

const getBarY = (value) => {
  return chartHeight - padding.bottom - getBarHeight(value);
};

// Função para calcular posição do tooltip (evita corte)
const getTooltipY = (value) => {
  const barY = getBarY(value);
  const tooltipHeight = 45;
  const minY = tooltipHeight + 10;

  // Se o tooltip ia ficar acima do espaço disponível, coloca abaixo da barra
  if (barY < minY) {
    return barY + getBarHeight(value) + 15; // Abaixo da barra
  }

  return barY - 10; // Acima da barra (normal)
};

const isTooltipBelow = (value) => {
  const barY = getBarY(value);
  const tooltipHeight = 45;
  const minY = tooltipHeight + 10;
  return barY < minY;
};

const handleMouseEnter = (index) => {
  hoveredBar.value = index;
};

const handleMouseLeave = () => {
  hoveredBar.value = null;
};

// Função para decidir quais labels mostrar no eixo X
const shouldShowLabel = (index) => {
  if (!props.data) return false;
  const dataLength = props.data.length;

  // Se poucos dados, mostra todos
  if (dataLength <= 7) return true;

  // Se muitos dados, mostra apenas alguns pontos estratégicos
  if (dataLength <= 15) {
    return index === 0 || index === Math.floor(dataLength / 2) || index === dataLength - 1;
  }

  // Para muitos dados (30+), mostra apenas primeiro, meio e último
  return index === 0 || index === Math.floor(dataLength / 2) || index === dataLength - 1;
};
</script>

<template>
  <div class="relative w-full overflow-visible" style="height: 320px;">
    <svg class="w-full h-full overflow-visible" viewBox="0 0 600 280" preserveAspectRatio="xMidYMid meet">
      <!-- Grid Lines -->
      <line
          v-for="i in 5"
          :key="'grid-' + i"
          :x1="padding.left"
          :y1="padding.top + ((i - 1) * (chartHeight - padding.top - padding.bottom) / 4)"
          :x2="chartWidth + padding.left"
          :y2="padding.top + ((i - 1) * (chartHeight - padding.top - padding.bottom) / 4)"
          stroke="rgba(255, 255, 255, 0.05)"
          stroke-width="1"
      />

      <!-- Y Axis Labels -->
      <text
          v-for="i in 5"
          :key="'label-y-' + i"
          :x="padding.left - 5"
          :y="chartHeight - padding.bottom - ((i - 1) * (chartHeight - padding.top - padding.bottom) / 4)"
          text-anchor="end"
          fill="rgba(255, 255, 255, 0.4)"
          font-size="10"
          dominant-baseline="middle"
      >
        {{ formatValue(maxValue * ((i - 1) / 4)) }}
      </text>

      <!-- Gradient Definitions -->
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color: rgb(124, 186, 16); stop-opacity: 1" />
          <stop offset="100%" style="stop-color: rgb(124, 186, 16); stop-opacity: 0.6" />
        </linearGradient>

        <linearGradient id="barGradientHover" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color: rgb(150, 220, 30); stop-opacity: 1" />
          <stop offset="100%" style="stop-color: rgb(124, 186, 16); stop-opacity: 0.8" />
        </linearGradient>

        <filter id="barGlow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="dropShadow">
          <feDropShadow dx="0" dy="2" stdDeviation="4" flood-opacity="0.3"/>
        </filter>
      </defs>

      <template v-if="data && data.length > 0">
        <!-- Bars -->
        <g v-for="(d, i) in data" :key="'bar-' + i">
          <!-- Background Bar (shadow effect) -->
          <rect
              :x="getBarX(i)"
              :y="getBarY(d.value) + 3"
              :width="barWidth"
              :height="getBarHeight(d.value)"
              fill="rgba(124, 186, 16, 0.1)"
              rx="6"
          />

          <!-- Main Bar -->
          <rect
              :x="getBarX(i)"
              :y="getBarY(d.value)"
              :width="barWidth"
              :height="getBarHeight(d.value)"
              :fill="hoveredBar === i ? 'url(#barGradientHover)' : 'url(#barGradient)'"
              rx="6"
              :filter="hoveredBar === i ? 'url(#barGlow)' : ''"
              class="transition-all duration-300 cursor-pointer"
              :class="{ 'opacity-50': hoveredBar !== null && hoveredBar !== i }"
              @mouseenter="handleMouseEnter(i)"
              @mouseleave="handleMouseLeave"
          />

          <!-- X Axis Labels - APENAS ALGUNS SELECIONADOS -->
          <text
              v-if="shouldShowLabel(i)"
              :x="getBarX(i) + barWidth / 2"
              :y="chartHeight - padding.bottom + 20"
              text-anchor="middle"
              fill="rgba(255, 255, 255, 0.5)"
              font-size="10"
              font-weight="500"
              class="pointer-events-none"
          >
            {{ d.date }}
          </text>
        </g>

        <!-- Tooltips (renderizados por último para ficarem sempre no topo) -->
        <g v-for="(d, i) in data" :key="'tooltip-' + i">
          <g v-if="hoveredBar === i">
            <!-- Tooltip Background -->
            <rect
                :x="getBarX(i) + barWidth / 2 - 45"
                :y="isTooltipBelow(d.value) ? getTooltipY(d.value) : getTooltipY(d.value) - 45"
                width="90"
                height="45"
                fill="rgba(17, 24, 39, 0.98)"
                stroke="rgba(124, 186, 16, 0.5)"
                stroke-width="2"
                rx="8"
                class="pointer-events-none"
                filter="url(#dropShadow)"
            />

            <!-- Tooltip Date -->
            <text
                :x="getBarX(i) + barWidth / 2"
                :y="isTooltipBelow(d.value) ? getTooltipY(d.value) + 15 : getTooltipY(d.value) - 30"
                text-anchor="middle"
                fill="rgba(255, 255, 255, 0.7)"
                font-size="10"
                font-weight="600"
                class="pointer-events-none"
            >
              {{ d.date }}
            </text>

            <!-- Tooltip Value -->
            <text
                :x="getBarX(i) + barWidth / 2"
                :y="isTooltipBelow(d.value) ? getTooltipY(d.value) + 33 : getTooltipY(d.value) - 12"
                text-anchor="middle"
                fill="rgb(124, 186, 16)"
                font-size="14"
                font-weight="700"
                class="pointer-events-none"
            >
              {{ formatValue(d.value) }}
            </text>

            <!-- Indicator line conectando tooltip à barra -->
            <line
                :x1="getBarX(i) + barWidth / 2"
                :y1="isTooltipBelow(d.value) ? getBarY(d.value) + getBarHeight(d.value) : getBarY(d.value)"
                :x2="getBarX(i) + barWidth / 2"
                :y2="isTooltipBelow(d.value) ? getTooltipY(d.value) : getTooltipY(d.value) - 45"
                stroke="rgba(124, 186, 16, 0.4)"
                stroke-width="2"
                stroke-dasharray="3,3"
                class="pointer-events-none"
            />
          </g>
        </g>
      </template>

      <!-- Empty State -->
      <text
          v-else
          x="300"
          y="140"
          text-anchor="middle"
          fill="rgba(255, 255, 255, 0.3)"
          font-size="14"
      >
        {{ loading ? 'Carregando dados...' : 'Nenhum dado disponível' }}
      </text>
    </svg>

    <!-- Legend -->
    <div class="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-2 text-xs text-gray-400">
      <div class="w-3 h-3 rounded bg-primary"></div>
      <span>Receita Total</span>
    </div>
  </div>
</template>