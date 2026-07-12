<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  salles: Array
})

const emit = defineEmits(['select'])

const currentEtage = ref(1)
const currentBatiment = ref('Bâtiment A')

const batiments = ['Bâtiment A', 'Bâtiment B', 'Bâtiment C']
const etages = [
  { label: 'RDC', value: 0 },
  { label: '1er Étage', value: 1 },
  { label: '2ème Étage', value: 2 }
]

const filteredSalles = computed(() => {
  return props.salles.filter(s => s.batiment === currentBatiment.value && s.etage === currentEtage.value)
})

const getStatusColor = (statut) => {
  switch (statut) {
    case 'disponible': return 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
    case 'occupée': return 'bg-red-500/20 border-red-500 text-red-400'
    case 'maintenance': return 'bg-orange-500/20 border-orange-500 text-orange-400'
    default: return 'bg-gray-800 border-gray-700 text-gray-700'
  }
}
</script>

<template>
  <div class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl flex flex-col gap-8 min-h-[600px]">

    <!-- Controls -->
    <div class="flex flex-col md:flex-row justify-between gap-6">
      <div class="flex p-1 bg-[#0F172A] rounded-2xl border border-gray-800">
        <button
          v-for="b in batiments"
          :key="b"
          @click="currentBatiment = b"
          class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
          :class="currentBatiment === b ? 'bg-emit-blue text-white' : 'text-gray-700 hover:text-[#0C2340]'"
        >
          {{ b }}
        </button>
      </div>

      <div class="flex p-1 bg-[#0F172A] rounded-2xl border border-gray-800">
        <button
          v-for="e in etages"
          :key="e.value"
          @click="currentEtage = e.value"
          class="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
          :class="currentEtage === e.value ? 'bg-emit-purple text-white' : 'text-gray-700 hover:text-[#0C2340]'"
        >
          {{ e.label }}
        </button>
      </div>
    </div>

    <!-- Map Area -->
    <div class="flex-1 bg-[#0F172A] rounded-3xl border-2 border-dashed border-gray-800 p-8 relative overflow-hidden flex items-center justify-center">
      <!-- Schematic grid -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
        <button
          v-for="salle in filteredSalles"
          :key="salle.id"
          @click="emit('select', salle)"
          class="aspect-square rounded-2xl border-2 transition-all hover:scale-105 flex flex-col items-center justify-center p-4 relative group"
          :class="getStatusColor(salle.statut)"
        >
          <span class="text-xl font-black mb-1">{{ salle.nom.split(' ').pop() }}</span>
          <span class="text-[10px] font-bold uppercase opacity-60">{{ salle.capacite }} places</span>

          <!-- Pulsing dot -->
          <div class="absolute top-3 right-3 flex h-2 w-2">
            <span :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              salle.statut === 'disponible' ? 'bg-emerald-500' : salle.statut === 'occupée' ? 'bg-red-500' : 'bg-orange-500']"></span>
            <span :class="['relative inline-flex rounded-full h-2 w-2',
              salle.statut === 'disponible' ? 'bg-emerald-500' : salle.statut === 'occupée' ? 'bg-red-500' : 'bg-orange-500']"></span>
          </div>
        </button>

        <div v-if="filteredSalles.length === 0" class="col-span-full py-20 text-center">
          <p class="text-gray-600 italic">Aucune salle répertoriée à cet étage pour ce bâtiment.</p>
        </div>
      </div>

      <!-- Corridor decoration -->
      <div class="absolute inset-x-0 top-1/2 -translate-y-1/2 h-8 bg-gray-900/50 -z-10 border-y border-gray-800"></div>
    </div>

    <!-- Legend -->
    <div class="flex flex-wrap items-center justify-center gap-8 pt-4 border-t border-gray-800/50 text-[10px] font-bold uppercase tracking-widest">
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-emerald-500"></div>
        <span class="text-[#0C2340]">Disponible</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-red-500"></div>
        <span class="text-[#0C2340]">Occupée</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="w-3 h-3 rounded-full bg-orange-500"></div>
        <span class="text-[#0C2340]">Maintenance</span>
      </div>
    </div>
  </div>
</template>
