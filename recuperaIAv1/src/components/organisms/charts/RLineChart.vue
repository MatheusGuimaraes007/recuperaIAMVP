<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import RCard from '@/components/atoms/layout/RCard.vue'

// Registrar componentes do Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  title: String,
  data: { type: Object, required: true }, // { labels: [], datasets: [] }
  height: { type: Number, default: 300 }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // Personalizamos a legenda fora se necessário
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: '#1F2937',
      titleColor: '#F3F4F6',
      bodyColor: '#D1D5DB',
      borderColor: '#374151',
      borderWidth: 1
    }
  },
  scales: {
    y: {
      grid: { color: 'rgba(107, 114, 128, 0.1)' },
      ticks: { color: '#9CA3AF' }
    },
    x: {
      grid: { display: false },
      ticks: { color: '#9CA3AF' }
    }
  },
  elements: {
    line: { tension: 0.4 }, // Curva suave
    point: { radius: 0, hitRadius: 10, hoverRadius: 4 }
  }
}
</script>

<template>
  <RCard :title="title" class="r-chart-card">
    <div :style="{ height: `${height}px` }">
      <Line :data="data" :options="chartOptions" />
    </div>
  </RCard>
</template>