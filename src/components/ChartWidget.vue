<script setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
} from 'chart.js'
import { Doughnut, Bar } from 'vue-chartjs'

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement
)

const props = defineProps({
  type: {
    type: String,
    required: true
  },
  title: String,
  data: {
    type: Object,
    required: true
  }
})

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#1E5F8E',
        padding: 20,
        font: {
          family: "'Inter', sans-serif",
          size: 10,
          weight: '900'
        },
        usePointStyle: true,
        pointStyle: 'circle',
        generateLabels: (chart) => {
          const data = chart.data;
          if (data.labels.length && data.datasets.length) {
            return data.labels.map((label, i) => {
              return {
                text: label.toUpperCase(),
                fillStyle: data.datasets[0].backgroundColor[i],
                strokeStyle: data.datasets[0].backgroundColor[i],
                lineWidth: 0,
                hidden: false,
                index: i
              };
            });
          }
          return [];
        }
      }
    },
    tooltip: {
      backgroundColor: '#FFFFFF',
      titleColor: '#0C2340',
      bodyColor: '#1E5F8E',
      borderColor: '#BFDBFE',
      borderWidth: 1,
      padding: 16,
      displayColors: true,
      cornerRadius: 16,
      boxPadding: 8,
      usePointStyle: true
    }
  },
  scales: props.type === 'bar' ? {
    y: {
      grid: {
        display: false,
        drawBorder: false
      },
      ticks: {
        color: '#64A8CC',
        font: { size: 10, weight: '900' }
      }
    },
    x: {
      grid: {
        color: '#F0F7FF',
        drawBorder: false
      },
      ticks: {
        color: '#64A8CC',
        font: { size: 10, weight: '900' }
      }
    }
  } : {}
}
</script>

<template>
  <div class="bg-white p-8 rounded-[2.5rem] border border-[#BFDBFE] shadow-xl flex flex-col h-full relative overflow-hidden group">
    <!-- Header -->
    <div class="flex items-center justify-between mb-8 relative z-10">
      <h3 class="text-xl font-black text-[#0C2340] tracking-tight">{{ title }}</h3>
      <div class="flex gap-2">
        <div class="w-2 h-2 rounded-full bg-[#38BDF8]"></div>
        <div class="w-2 h-2 rounded-full bg-[#BAE6FD]"></div>
      </div>
    </div>

    <div class="flex-1 relative min-h-[300px] z-10">
      <Doughnut v-if="type === 'donut'" :data="data" :options="options" />
      <Bar v-else-if="type === 'bar'" :data="data" :options="options" />
    </div>

    <!-- Decoration -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-[#F0F9FF] rounded-full -mr-16 -mt-16 opacity-50 transition-transform group-hover:scale-110"></div>
  </div>
</template>
