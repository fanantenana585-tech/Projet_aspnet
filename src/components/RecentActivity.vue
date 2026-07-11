<script setup>
import * as Icons from 'lucide-vue-next'

defineProps({
  activities: Array
})

const getIcon = (iconName) => Icons[iconName]
</script>

<template>
  <div class="bg-white p-8 rounded-[2.5rem] border border-[#BFDBFE] shadow-xl flex flex-col h-full relative overflow-hidden">
    <div class="flex items-center justify-between mb-10 relative z-10">
      <h3 class="text-xl font-black text-[#0C2340] tracking-tight">Activités Récentes</h3>
      <button class="text-[10px] font-black text-[#38BDF8] hover:text-[#0EA5E9] transition-colors uppercase tracking-[0.2em] bg-[#F0F9FF] px-4 py-1.5 rounded-full border border-[#BFDBFE]">
        Voir tout
      </button>
    </div>

    <div class="relative flex-1 px-2 relative z-10">
      <!-- Vertical Line -->
      <div class="absolute left-6 top-2 bottom-6 w-1 bg-[#F0F7FF] rounded-full"></div>

      <div class="space-y-10">
        <div
          v-for="activity in activities"
          :key="activity.id"
          class="relative flex items-start gap-6 group"
        >
          <!-- Icon Circle -->
          <div class="relative z-10 w-12 h-12 rounded-2xl bg-white border-2 border-[#F0F7FF] flex items-center justify-center shadow-lg group-hover:border-[#38BDF8] transition-all duration-300">
            <component :is="getIcon(activity.icon)" :size="20" class="text-[#38BDF8]" />
          </div>

          <div class="flex-1 pt-1">
            <p class="text-sm font-black text-[#0C2340] leading-tight mb-1.5 group-hover:text-[#38BDF8] transition-colors">
              {{ activity.content }}
            </p>
            <div class="flex items-center gap-2">
              <Icons.Clock :size="10" class="text-[#64A8CC]" />
              <p class="text-[10px] text-[#64A8CC] font-black uppercase tracking-widest">
                {{ activity.time }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Decoration -->
    <div class="absolute -left-12 -bottom-12 w-48 h-48 bg-[#F0F9FF] rounded-full opacity-50"></div>
  </div>
</template>
