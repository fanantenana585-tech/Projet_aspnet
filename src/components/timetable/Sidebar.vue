<script setup>
import { useProfessorsStore } from '@/stores/professors'
import { useExceptionsStore } from '@/stores/exceptions'

const props = defineProps({
  currentSemaine: Number,
  selectedProfId: Number
})

const emit = defineEmits(['select-prof', 'open-availability'])

const professorsStore = useProfessorsStore()
const exceptionsStore = useExceptionsStore()

const isBlocked = (profId) => {
  return exceptionsStore.isWeekBlocked(profId, props.currentSemaine)
}
</script>

<template>
  <aside class="w-80 bg-white border-r border-gray-100 flex flex-col h-full shadow-sm">
    <div class="p-6 border-b border-gray-50 flex items-center justify-between">
      <h2 class="text-xl font-poppins font-bold text-[#0D1B3E]">Professeurs</h2>
      <button @click="emit('open-availability')"
              class="w-10 h-10 bg-[#1D9E75] text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-100 hover:scale-105 transition-all">
        <i class="fas fa-calendar-plus"></i>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-4 space-y-2">
      <button
        @click="emit('select-prof', null)"
        class="w-full flex items-center p-3 rounded-2xl transition-all"
        :class="!selectedProfId ? 'bg-blue-50 text-[#0D1B3E]' : 'hover:bg-gray-50 text-gray-700'"
      >
        <div class="w-10 h-10 rounded-full bg-[#0D1B3E] text-white flex items-center justify-center font-bold mr-3 shadow-sm">
          <i class="fas fa-users text-xs"></i>
        </div>
        <div class="text-left">
          <p class="text-sm font-bold">Tous les cours</p>
          <p class="text-[10px] opacity-70">Vue globale EMIT</p>
        </div>
      </button>

      <div class="h-px bg-gray-100 my-4 mx-2"></div>

      <button
        v-for="prof in professorsStore.professors"
        :key="prof.id"
        @click="emit('select-prof', prof.id)"
        class="w-full flex items-center p-3 rounded-2xl transition-all group"
        :class="selectedProfId === prof.id ? 'bg-[#0D1B3E] text-white shadow-xl' : 'hover:bg-gray-50 text-gray-700'"
      >
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-gray-100 text-[#0D1B3E] flex items-center justify-center font-poppins font-bold border-2 border-white shadow-sm transition-colors"
               :class="selectedProfId === prof.id ? 'bg-white/20 text-white' : ''">
            {{ prof.initiales }}
          </div>
          <div class="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white"
               :class="isBlocked(prof.id) ? 'bg-red-500' : 'bg-emerald-500'"></div>
        </div>
        <div class="ml-3 text-left">
          <p class="text-sm font-bold">{{ prof.prenom }} {{ prof.nom }}</p>
          <p class="text-[10px] uppercase font-black tracking-widest opacity-60">{{ prof.specialite }}</p>
        </div>
        <i v-if="selectedProfId === prof.id" class="fas fa-chevron-right ml-auto text-xs opacity-50"></i>
      </button>
    </div>
  </aside>
</template>
