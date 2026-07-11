<script setup>
import { computed } from 'vue';
import {
  Users, BookOpen, GraduationCap,
  Eye, Pencil, Trash2, ShieldCheck,
  Building2, ArrowRight
} from 'lucide-vue-next';

const props = defineProps({
  parcours: Object,
  index: Number
});

const emit = defineEmits(['view', 'edit', 'delete']);

const cardColor = computed(() => props.parcours.couleur);
const mentionColor = computed(() => props.parcours.mentionCouleur);

</script>

<template>
  <div
    class="bg-white rounded-[2rem] border border-[#BFDBFE] overflow-hidden group hover:shadow-[0_25px_60px_rgba(12,35,64,0.1)] hover:-translate-y-2 transition-all duration-500 relative flex flex-col h-full"
  >
    <!-- Border Left -->
    <div
      class="absolute left-0 top-0 bottom-0 w-1.5 transition-all duration-500 group-hover:w-2.5"
      :style="{ backgroundColor: cardColor }"
    ></div>

    <!-- Header Section -->
    <div class="p-6 pb-4 space-y-4 flex-1">
      <div class="flex justify-between items-start">
        <div
          class="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110 duration-500"
          :style="{ background: `linear-gradient(135deg, ${cardColor}20, ${mentionColor}10)` }"
        >
          {{ parcours.icone }}
        </div>
        <div class="flex flex-col items-end gap-2">
           <span
             class="px-2.5 py-1 rounded-lg text-[10px] font-black font-mono border"
             :style="{ backgroundColor: `${cardColor}10`, color: cardColor, borderColor: `${cardColor}30` }"
           >
             [{{ parcours.code }}]
           </span>
           <span
             v-if="parcours.ouvertConcours"
             class="px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-[8px] font-black uppercase tracking-wider border border-[#FDE68A] animate-pulse-slow"
           >
             🎓 Concours L1
           </span>
        </div>
      </div>

      <div class="space-y-1">
        <div class="flex items-center gap-2">
           <span
             class="text-[9px] font-black uppercase tracking-tighter"
             :style="{ color: mentionColor }"
           >
             {{ parcours.mentionIcone }} {{ parcours.mentionNom }}
           </span>
           <div class="w-1 h-1 rounded-full bg-[#BFDBFE]"></div>
           <span class="text-[9px] font-black text-[#64A8CC] uppercase">{{ parcours.niveau }}</span>
        </div>
        <h3 class="text-[#0C2340] font-black text-sm group-hover:text-[#38BDF8] transition-colors leading-tight min-h-[2.5rem] line-clamp-2">
          {{ parcours.nom }}
        </h3>
        <p class="text-[10px] font-bold text-[#64A8CC]">{{ parcours.nomCourt }}</p>
      </div>

      <div class="space-y-4 pt-2">
        <!-- Stats -->
        <div class="grid grid-cols-3 gap-2 border-y border-[#F0F7FF] py-3">
           <div class="text-center space-y-0.5">
              <p class="text-[8px] font-black text-[#64A8CC] uppercase">Étudiants</p>
              <p class="text-xs font-black text-[#0C2340]">{{ parcours.nbEtudiants }}</p>
           </div>
           <div class="text-center space-y-0.5 border-x border-[#F0F7FF]">
              <p class="text-[8px] font-black text-[#64A8CC] uppercase">Matières</p>
              <p class="text-xs font-black text-[#0C2340]">{{ parcours.nbMatieres }}</p>
           </div>
           <div class="text-center space-y-0.5">
              <p class="text-[8px] font-black text-[#64A8CC] uppercase">Profs</p>
              <p class="text-xs font-black text-[#0C2340]">{{ parcours.nbEnseignants }}</p>
           </div>
        </div>

        <!-- Responsibility -->
        <div class="flex items-center gap-3 bg-[#F8FBFF] p-3 rounded-2xl border border-[#BFDBFE]/50">
           <div
             class="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-sm"
             :style="{ background: `linear-gradient(135deg, ${cardColor}, ${mentionColor})` }"
           >
             {{ parcours.responsable.initiales }}
           </div>
           <div class="flex-1 min-w-0">
              <p class="text-[8px] font-black text-[#64A8CC] uppercase leading-none">Responsable</p>
              <p class="text-[10px] font-black text-[#1E5F8E] truncate mt-0.5">{{ parcours.responsable.prenom }} {{ parcours.responsable.nom }}</p>
           </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-[#F0F7FF] flex justify-between items-center bg-[#F8FBFF]/50">
       <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-[#059669]"></div>
          <span class="text-[9px] font-black text-[#059669] uppercase tracking-widest">Actif</span>
       </div>

       <div class="flex gap-2">
          <button
            @click="emit('view', parcours)"
            class="p-2.5 bg-white border border-[#BFDBFE] text-[#64A8CC] hover:text-[#38BDF8] hover:border-[#38BDF8] rounded-xl transition-all shadow-sm"
          >
            <Eye :size="14" />
          </button>
          <button
            @click="emit('edit', parcours)"
            class="p-2.5 bg-white border border-[#BFDBFE] text-[#64A8CC] hover:text-[#0EA5E9] hover:border-[#0EA5E9] rounded-xl transition-all shadow-sm"
          >
            <Pencil :size="14" />
          </button>
          <button
            @click="emit('delete', parcours.id)"
            class="p-2.5 bg-white border border-[#BFDBFE] text-[#64A8CC] hover:text-red-500 hover:border-red-200 rounded-xl transition-all shadow-sm"
          >
            <Trash2 :size="14" />
          </button>
       </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes pulse-slow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(0.98); }
}
.animate-pulse-slow { animation: pulse-slow 3s infinite ease-in-out; }
</style>
