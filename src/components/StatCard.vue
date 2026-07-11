<script setup>
import { ref, onMounted } from 'vue'
import * as Icons from 'lucide-vue-next'

const props = defineProps({
  label: String,
  value: Number,
  icon: String,
  trend: String,
  color: String,
  gradient: String
})

const displayValue = ref(0)
const LucideIcon = Icons[props.icon]

onMounted(() => {
  const duration = 1500
  const steps = 60
  const increment = props.value / steps
  const stepTime = duration / steps

  let current = 0
  const timer = setInterval(() => {
    current += increment
    if (current >= props.value) {
      displayValue.value = props.value
      clearInterval(timer)
    } else {
      displayValue.value = Math.floor(current)
    }
  }, stepTime)
})

const colorConfig = {
  blue: { text: 'text-[#38BDF8]', bg: 'bg-[#F0F9FF]', border: 'border-[#38BDF8]' },
  purple: { text: 'text-[#7C3AED]', bg: 'bg-[#F5F3FF]', border: 'border-[#7C3AED]' },
  cyan: { text: 'text-[#0D9488]', bg: 'bg-[#F0FDFA]', border: 'border-[#0D9488]' },
  orange: { text: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', border: 'border-[#D97706]' }
}

const config = colorConfig[props.color] || colorConfig.blue
</script>

<template>
  <div class="relative bg-white p-8 rounded-[2.5rem] border border-[#BFDBFE] shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(14,165,233,0.15)] group overflow-hidden">
    <!-- Top Accent Bar -->
    <div
      class="absolute top-0 left-0 right-0 h-1.5 transition-all duration-500 group-hover:h-2"
      :style="{ background: `var(--color-gradient)` }"
    ></div>

    <div class="flex items-start justify-between relative z-10">
      <div>
        <p class="text-[#64A8CC] text-xs font-black uppercase tracking-[0.2em] mb-3">{{ label }}</p>
        <h3 class="text-4xl font-black text-[#0C2340] tracking-tighter">
          {{ displayValue }}
        </h3>
      </div>
      <div
        :class="['w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-lg', config.bg, config.text]"
        :style="{ boxShadow: `0 8px 20px -4px rgba(var(--filiere-rgb), 0.2)` }"
      >
        <component :is="LucideIcon" :size="28" />
      </div>
    </div>

    <div class="mt-8 flex items-center gap-3 relative z-10">
      <div class="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm">
        Mise à jour
      </div>
      <span class="text-xs text-[#1E5F8E] font-bold">{{ trend }}</span>
    </div>

    <!-- Decorative Circle -->
    <div class="absolute -right-8 -bottom-8 w-32 h-32 bg-[#F0F9FF] rounded-full transition-transform duration-700 group-hover:scale-125 -z-0"></div>
  </div>
</template>
