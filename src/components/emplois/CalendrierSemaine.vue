<script setup>
import { computed } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';
import CreneauCard from './CreneauCard.vue';
import { Clock, Plus } from 'lucide-vue-next';

const props = defineProps({
  emplois: Array,
  pixelsParMinute: Number
});

const store = useEmploiStore();
const jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const heures = Array.from({ length: 14 }, (_, i) => i + 7); // 07h à 20h

const getEmploisByJour = (jour) => {
  return props.emplois.filter(e => e.jour === jour);
};

const handleSlotClick = (jour, h) => {
  const heureDebut = h.toString().padStart(2, '0') + ':00';
  store.ouvrirModal(null, { jour, heureDebut });
};
</script>

<template>
  <div class="flex flex-col h-full select-none">
    <!-- Header Jours -->
    <div class="flex border-b border-[#BFDBFE] bg-white sticky top-0 z-20 shadow-sm shrink-0">
      <div class="w-20 border-r border-[#BFDBFE] flex items-center justify-center bg-[#F8FBFF]">
         <Clock :size="20" class="text-[#64A8CC]" />
      </div>
      <div v-for="jour in jours" :key="jour" class="flex-1 border-r border-[#F0F7FF] py-6 text-center group">
         <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-[0.2em] mb-1 transition-colors group-hover:text-[#38BDF8]">{{ jour }}</p>
         <p class="text-xl font-black text-[#0C2340]">16</p> <!-- Mock date -->
      </div>
    </div>

    <!-- Grille Heures & Créneaux -->
    <div class="flex-1 overflow-y-auto custom-scrollbar relative bg-[#F0F7FF]/30">
      <div class="flex min-h-[1200px]" :style="{ height: (13 * 60 * pixelsParMinute) + 'px' }">
        <!-- Axe des heures -->
        <div class="w-20 border-r border-[#BFDBFE] bg-white relative z-10 shrink-0">
           <div
             v-for="h in heures"
             :key="h"
             class="absolute w-full flex items-center justify-center text-[10px] font-black text-[#64A8CC] border-t border-[#F0F7FF]"
             :style="{ top: ((h - 7) * 60 * pixelsParMinute) + 'px', height: (60 * pixelsParMinute) + 'px' }"
           >
              {{ h }}h00
           </div>
        </div>

        <!-- Colonnes Jours -->
        <div class="flex-1 flex relative">
           <!-- Grid Background Lines -->
           <div class="absolute inset-0 pointer-events-none">
              <div
                v-for="h in heures"
                :key="'line-'+h"
                class="absolute left-0 right-0 border-t border-[#BFDBFE]/30"
                :style="{ top: ((h - 7) * 60 * pixelsParMinute) + 'px' }"
              ></div>
           </div>

           <div v-for="jour in jours" :key="'col-'+jour" class="flex-1 border-r border-[#F0F7FF]/50 relative">
              <!-- Empty Slot Targets -->
              <div
                v-for="h in heures"
                :key="'slot-'+h"
                @click="handleSlotClick(jour, h)"
                class="absolute left-0 right-0 hover:bg-[#38BDF8]/5 transition-colors cursor-crosshair group/slot flex items-center justify-center"
                :style="{ top: ((h - 7) * 60 * pixelsParMinute) + 'px', height: (60 * pixelsParMinute) + 'px' }"
              >
                 <Plus :size="16" class="text-[#38BDF8] opacity-0 group-hover/slot:opacity-100 transition-opacity" />
              </div>

              <!-- Fixed Slots (Creneaux) -->
              <CreneauCard
                v-for="emploi in getEmploisByJour(jour)"
                :key="emploi.id"
                :creneau="emploi"
                :pixels-par-minute="pixelsParMinute"
              />
           </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 6px; }
.custom-scrollbar::-webkit-scrollbar-track { background: #F0F7FF; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #BFDBFE;
  border-radius: 10px;
}
</style>
