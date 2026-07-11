<script setup>
import { computed } from 'vue';
import { MENTIONS_EMIT } from '@/stores/matiereStore';
import {
  BookOpen, Users, Clock, Award,
  Eye, Pencil, Trash2, ChevronRight,
  Layout, Calendar
} from 'lucide-vue-next';

const props = defineProps({
  matiere: Object,
  index: Number
});

const emit = defineEmits(['view', 'edit', 'delete']);

const mention = computed(() =>
  MENTIONS_EMIT.find(m => m.id === props.matiere.mentionId) || { icone: '📚', nom: 'Transversal', couleur: '#64A8CC' }
);

const volumeTotal = computed(() => {
  const v = props.matiere.volumeHoraire;
  return (v.cours || 0) + (v.td || 0) + (v.tp || 0) + (v.projet || 0);
});

const progressWidths = computed(() => {
  const v = props.matiere.volumeHoraire;
  const total = volumeTotal.value || 1;
  return {
    cours: ((v.cours || 0) / total) * 100,
    td: ((v.td || 0) / total) * 100,
    tp: ((v.tp || 0) / total) * 100,
    projet: ((v.projet || 0) / total) * 100
  };
});
</script>

<template>
  <div
    class="bg-white rounded-[1.5rem] border border-[#BFDBFE] overflow-hidden group hover:shadow-[0_20px_50px_rgba(56,189,248,0.15)] hover:-translate-y-1.5 transition-all duration-300 relative"
  >
    <!-- Bande colorée -->
    <div
      class="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5"
      :style="{ backgroundColor: matiere.couleur }"
    ></div>

    <div class="p-6 space-y-5">
      <!-- En-tête -->
      <div class="flex justify-between items-start gap-4">
        <div class="space-y-2">
          <div class="flex flex-wrap gap-2">
            <span
              class="px-2.5 py-1 rounded-lg text-[10px] font-black font-mono border"
              :style="{
                backgroundColor: `${matiere.couleur}10`,
                color: matiere.couleur,
                borderColor: `${matiere.couleur}30`
              }"
            >
              [{{ matiere.code }}]
            </span>
            <span class="px-2.5 py-1 rounded-full bg-[#F0F9FF] text-[#1E5F8E] text-[10px] font-black uppercase tracking-wider border border-[#BFDBFE]">
              {{ matiere.niveau }}
            </span>
          </div>
          <h3 class="text-[#0C2340] font-black text-base leading-tight group-hover:text-[#38BDF8] transition-colors">
            {{ matiere.nom }}
          </h3>
        </div>

        <div
          class="flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black uppercase tracking-tight"
          :style="{ backgroundColor: `${mention.couleur}10`, color: mention.couleur }"
        >
          <span>{{ mention.icone }}</span>
          <span>{{ mention.nom }}</span>
        </div>
      </div>

      <!-- Parcours & Description -->
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-[10px] font-bold text-[#64A8CC]">
          <Layout :size="12" />
          <span>{{ matiere.parcoursNom }}</span>
        </div>
        <p class="text-xs text-[#64A8CC] line-clamp-2 leading-relaxed">
          {{ matiere.description }}
        </p>
      </div>

      <!-- Grille Info -->
      <div class="grid grid-cols-2 gap-3 p-3 bg-[#F8FBFF] rounded-2xl border border-[#BFDBFE]/50">
        <div class="flex items-center gap-2">
          <Calendar :size="14" class="text-[#38BDF8]" />
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-[#64A8CC] uppercase">Semestre</span>
            <span class="text-[10px] font-black text-[#0C2340]">{{ matiere.semestre }}</span>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <Award :size="14" class="text-[#38BDF8]" />
          <div class="flex flex-col">
            <span class="text-[8px] font-black text-[#64A8CC] uppercase">Crédits</span>
            <span class="text-[10px] font-black text-[#0C2340]">{{ matiere.credits }} ECTS</span>
          </div>
        </div>
      </div>

      <!-- Volume Horaire -->
      <div class="space-y-2">
        <div class="flex justify-between items-end">
          <span class="text-[9px] font-black text-[#64A8CC] uppercase">Volume Horaire ({{ volumeTotal }}h)</span>
          <span class="text-[9px] font-black text-[#38BDF8]">{{ matiere.coefficient }} Coeff.</span>
        </div>
        <div class="h-1.5 w-full bg-[#F0F9FF] rounded-full overflow-hidden flex">
          <div v-if="progressWidths.cours" class="h-full bg-[#38BDF8]" :style="{ width: progressWidths.cours + '%' }"></div>
          <div v-if="progressWidths.td" class="h-full bg-[#0EA5E9]" :style="{ width: progressWidths.td + '%' }"></div>
          <div v-if="progressWidths.tp" class="h-full bg-[#0284C7]" :style="{ width: progressWidths.tp + '%' }"></div>
          <div v-if="progressWidths.projet" class="h-full bg-[#2563EB]" :style="{ width: progressWidths.projet + '%' }"></div>
        </div>
        <div class="flex justify-between text-[8px] font-bold text-[#64A8CC] uppercase">
          <span>Cours</span>
          <span>TD</span>
          <span>TP</span>
          <span>Proj</span>
        </div>
      </div>

      <!-- Footer / Actions -->
      <div class="pt-4 border-t border-[#F0F7FF] flex justify-between items-center">
        <div class="flex -space-x-2">
          <div
            v-for="e in matiere.enseignants" :key="e.id"
            class="w-7 h-7 rounded-full border-2 border-white bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-[10px] font-black text-white shadow-sm"
            :title="e.prenom + ' ' + e.nom"
          >
            {{ e.initiales }}
          </div>
        </div>

        <div class="flex gap-1">
          <button
            @click="emit('view', matiere)"
            class="p-2 text-[#64A8CC] hover:text-[#38BDF8] hover:bg-[#F0F9FF] rounded-xl transition-all"
          >
            <Eye :size="16" />
          </button>
          <button
            @click="emit('edit', matiere)"
            class="p-2 text-[#64A8CC] hover:text-[#0EA5E9] hover:bg-[#F0F9FF] rounded-xl transition-all"
          >
            <Pencil :size="16" />
          </button>
          <button
            @click="emit('delete', matiere.id)"
            class="p-2 text-[#64A8CC] hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
