<script setup>
import { computed } from 'vue';
import { useEmploiStore, ENS, SALLES } from '@/stores/emploiStore';
import { MOCK_MENTIONS, MOCK_PARCOURS } from '@/stores/filiereStore';
import { RotateCcw, LayoutGrid, List, Calendar, Grid } from 'lucide-vue-next';

const store = useEmploiStore();

const filteredParcours = computed(() => {
  if (store.filtres.mention === 'toutes') return MOCK_PARCOURS;
  return MOCK_PARCOURS.filter(p => p.mentionId === store.filtres.mention);
});

const reset = () => {
  store.filtres = {
    mention: 'toutes',
    parcours: 'tous',
    niveau: 'tous',
    groupe: 'tous',
    enseignant: 'tous',
    salle: 'toutes',
    type: 'tous'
  };
};

const activeFiltersCount = computed(() => {
  return Object.values(store.filtres).filter(v => v !== 'toutes' && v !== 'tous').length;
});
</script>

<template>
  <div class="bg-white border border-[#BFDBFE] rounded-[2rem] p-5 shadow-sm flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <!-- Mention -->
    <div class="flex flex-col gap-1.5 min-w-[180px]">
      <label class="text-[10px] font-black uppercase text-[#64A8CC] tracking-widest ml-1">Mention</label>
      <select
        v-model="store.filtres.mention"
        @change="store.filtres.parcours = 'tous'"
        class="bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0C2340] outline-none focus:border-[#38BDF8] cursor-pointer"
      >
        <option value="toutes">Toutes les mentions</option>
        <option v-for="m in MOCK_MENTIONS" :key="m.id" :value="m.id">
          {{ m.icone }} {{ m.nom }}
        </option>
      </select>
    </div>

    <!-- Parcours -->
    <div class="flex flex-col gap-1.5 min-w-[200px]">
      <label class="text-[10px] font-black uppercase text-[#64A8CC] tracking-widest ml-1">Parcours</label>
      <select v-model="store.filtres.parcours" class="bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0C2340] outline-none focus:border-[#38BDF8] cursor-pointer">
        <option value="tous">Tous les parcours</option>
        <option v-for="p in filteredParcours" :key="p.id" :value="p.id">
          [{{ p.code }}] {{ p.nomCourt }}
        </option>
      </select>
    </div>

    <!-- Niveau -->
    <div class="flex flex-col gap-1.5">
      <label class="text-[10px] font-black uppercase text-[#64A8CC] tracking-widest ml-1">Niveau</label>
      <div class="flex bg-[#F0F9FF] p-1 rounded-xl border-2 border-[#BFDBFE]">
        <button
          v-for="lvl in ['tous', 'L1', 'L2', 'L3', 'M1', 'M2']" :key="lvl"
          @click="store.filtres.niveau = lvl"
          class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all"
          :class="store.filtres.niveau === lvl ? 'bg-[#38BDF8] text-white shadow-md' : 'text-[#1E5F8E] hover:bg-white'"
        >
          {{ lvl === 'tous' ? 'Tous' : lvl }}
        </button>
      </div>
    </div>

    <!-- Groupe -->
    <div class="flex flex-col gap-1.5 min-w-[140px]">
      <label class="text-[10px] font-black uppercase text-[#64A8CC] tracking-widest ml-1">Groupe</label>
      <select v-model="store.filtres.groupe" class="bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0C2340] outline-none focus:border-[#38BDF8] cursor-pointer">
        <option value="tous">Tous les groupes</option>
        <option value="Groupe A">Groupe A</option>
        <option value="Groupe B">Groupe B</option>
      </select>
    </div>

    <div class="h-10 w-[1px] bg-[#BFDBFE]/50 mx-2"></div>

    <!-- Reset -->
    <button
      v-if="activeFiltersCount > 0"
      @click="reset"
      class="text-[#64A8CC] hover:text-[#0C2340] font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors px-2"
    >
      <RotateCcw :size="14" /> Réinitialiser
    </button>

    <div class="ml-auto flex items-center gap-6">
      <span class="bg-[#E0F2FE] text-[#0284C7] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#BFDBFE]">
        {{ store.emploisFiltres.length }} créneaux affichés
      </span>

      <!-- View Toggle -->
      <div class="flex bg-[#F0F9FF] p-1 rounded-xl border-2 border-[#BFDBFE]">
        <button
          v-for="mode in [{id:'semaine', icon:Calendar}, {id:'jour', icon:LayoutGrid}, {id:'liste', icon:List}, {id:'grille', icon:Grid}]"
          :key="mode.id"
          @click="store.modeVue = mode.id"
          class="p-2 rounded-lg transition-all"
          :class="store.modeVue === mode.id ? 'bg-white text-[#38BDF8] shadow-sm' : 'text-[#64A8CC]'"
        >
          <component :is="mode.icon" :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>
