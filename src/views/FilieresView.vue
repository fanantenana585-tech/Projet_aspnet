<script setup>
import { ref, computed } from 'vue';
import { useFiliereStore, MOCK_MENTIONS } from '@/stores/filiereStore';
import FiliereCard from '@/components/filieres/FiliereCard.vue';
import {
  GraduationCap, Plus, Search, ChevronDown,
  LayoutGrid, List, Landmark, TreeDeciduous,
  RotateCcw, Users, BookOpen, Award
} from 'lucide-vue-next';

const store = useFiliereStore();

const stats = computed(() => store.statsGlobales);

const resetFilters = () => {
  store.filtres = { search: '', mention: 'toutes', niveau: 'tous', statut: 'toutes', ouvertConcours: false };
};

const handleView = (p) => store.ouvrirDetail(p);
const handleEdit = (p) => store.ouvrirModal(p);
const handleDelete = (id) => {
  if (confirm("Supprimer ce parcours ? Les données associées seront perdues.")) {
    // Action in store
  }
};

const filteredParcours = computed(() => store.parcoursFiltres);

const sections = computed(() => {
  if (store.filtres.mention !== 'toutes') {
    return MOCK_MENTIONS.filter(m => m.id === store.filtres.mention);
  }
  return MOCK_MENTIONS;
});

const getParcoursForMention = (mentionId) => {
  return filteredParcours.value.filter(p => p.mentionId === mentionId);
};

</script>

<template>
  <div class="min-h-screen bg-[#F0F7FF] p-6 lg:p-10 space-y-10">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-[2rem] bg-white border border-[#BFDBFE] flex items-center justify-center shadow-sm">
          <GraduationCap :size="32" class="text-[#38BDF8]" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-[#0C2340] tracking-tight">Filières & Parcours EMIT</h1>
          <p class="text-sm font-bold text-[#64A8CC] mt-1">
            3 Mentions · 11 Parcours · {{ stats.totalEtudiants }} étudiants
          </p>
        </div>
      </div>

      <button
        @click="store.ouvrirModal()"
        class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#38BDF8]/20 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
      >
        <Plus :size="20" /> Nouveau parcours
      </button>
    </header>

    <!-- Stats -->
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      <div v-for="(val, label, idx) in { 'Mentions': 3, 'Parcours': stats.totalParcours, 'Licences': stats.totalLicences, 'Masters': stats.totalMasters, 'Étudiants': stats.totalEtudiants }" :key="label"
        class="bg-white p-6 rounded-3xl border border-[#BFDBFE] shadow-sm"
      >
        <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">{{ label }}</p>
        <p class="text-2xl font-black text-[#0C2340] mt-1">{{ val }}</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white p-6 rounded-[2.5rem] border border-[#BFDBFE] shadow-sm flex flex-wrap items-center gap-6">
       <div class="flex-1 min-w-[250px] relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-[#64A8CC]" :size="18" />
          <input
            v-model="store.filtres.search"
            type="text" placeholder="Rechercher un parcours..."
            class="w-full bg-[#F8FBFF] border-2 border-[#BFDBFE] py-3.5 pl-12 pr-4 rounded-2xl font-bold text-[#0C2340] focus:border-[#38BDF8] outline-none transition-all"
          >
       </div>

       <div class="flex items-center gap-4">
          <select v-model="store.filtres.mention" class="bg-[#F8FBFF] border-2 border-[#BFDBFE] p-3.5 rounded-2xl font-bold text-[#0C2340] outline-none focus:border-[#38BDF8]">
             <option value="toutes">Toutes les mentions</option>
             <option v-for="m in MOCK_MENTIONS" :key="m.id" :value="m.id">{{ m.icone }} {{ m.nom }}</option>
          </select>

          <div class="flex bg-[#F8FBFF] p-1.5 rounded-2xl border-2 border-[#BFDBFE]">
             <button v-for="v in ['mentions','cartes','liste','cursus']" :key="v"
               @click="store.modeVue = v"
               class="p-2.5 rounded-xl transition-all"
               :class="store.modeVue === v ? 'bg-white shadow-sm text-[#38BDF8]' : 'text-[#64A8CC]'"
             >
                <component :is="v === 'mentions' ? Landmark : v === 'cartes' ? LayoutGrid : v === 'liste' ? List : TreeDeciduous" :size="20" />
             </button>
          </div>
       </div>

       <div class="flex items-center gap-3 ml-auto">
          <label class="flex items-center gap-2 cursor-pointer group">
             <input type="checkbox" v-model="store.filtres.ouvertConcours" class="hidden">
             <div class="w-10 h-6 bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-full relative transition-all group-hover:border-[#38BDF8]" :class="{ 'bg-[#38BDF8] border-[#38BDF8]': store.filtres.ouvertConcours }">
                <div class="absolute top-1 w-3 h-3 bg-[#BFDBFE] rounded-full transition-all" :style="{ left: store.filtres.ouvertConcours ? '22px' : '4px', backgroundColor: store.filtres.ouvertConcours ? 'white' : '#BFDBFE' }"></div>
             </div>
             <span class="text-[10px] font-black text-[#64A8CC] uppercase">Concours L1</span>
          </label>
          <button @click="resetFilters" class="p-2 text-[#64A8CC] hover:text-[#38BDF8]"><RotateCcw :size="20" /></button>
       </div>
    </div>

    <!-- Content: Mentions Grouped View -->
    <div v-if="store.modeVue === 'mentions'" class="space-y-12">
       <section v-for="m in sections" :key="m.id" class="space-y-6">
          <div
            class="flex items-center justify-between p-6 rounded-[2rem] border-l-[6px]"
            :style="{ backgroundColor: `${m.couleur}08`, borderLeftColor: m.couleur }"
          >
             <div class="flex items-center gap-6">
                <span class="text-3xl">{{ m.icone }}</span>
                <div>
                   <h2 class="text-xl font-black text-[#0C2340]">{{ m.nom }}</h2>
                   <p class="text-xs font-bold text-[#64A8CC]">Resp: {{ m.responsable.prenom }} {{ m.responsable.nom }}</p>
                </div>
                <div class="flex gap-2 ml-4">
                   <span class="px-3 py-1 bg-white border border-[#BFDBFE] rounded-full text-[10px] font-black text-[#1E5F8E] uppercase">{{ m.parcours.length }} Parcours</span>
                   <span class="px-3 py-1 bg-white border border-[#BFDBFE] rounded-full text-[10px] font-black text-[#1E5F8E] uppercase">{{ m.nbEtudiants }} Étudiants</span>
                </div>
             </div>
             <ChevronDown class="text-[#BFDBFE]" :size="24" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
             <FiliereCard
               v-for="(p, idx) in getParcoursForMention(m.id)" :key="p.id"
               :parcours="p" :index="idx"
               @view="handleView" @edit="handleEdit" @delete="handleDelete"
             />
          </div>
       </section>
    </div>

    <!-- Simple Grid View -->
    <div v-else-if="store.modeVue === 'cartes'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
       <FiliereCard
         v-for="(p, idx) in filteredParcours" :key="p.id"
         :parcours="p" :index="idx"
         @view="handleView" @edit="handleEdit" @delete="handleDelete"
       />
    </div>

    <!-- Table View -->
    <div v-else-if="store.modeVue === 'liste'" class="bg-white rounded-[2.5rem] border border-[#BFDBFE] shadow-sm overflow-hidden">
       <table class="w-full text-left">
          <thead class="bg-[#F8FBFF] border-b border-[#BFDBFE]">
             <tr class="text-[10px] font-black text-[#64A8CC] uppercase">
                <th class="p-6">Code</th>
                <th class="p-6">Parcours</th>
                <th class="p-6">Mention</th>
                <th class="p-6">Niveau</th>
                <th class="p-6 text-center">Étudiants</th>
                <th class="p-6">Responsable</th>
                <th class="p-6 text-right">Actions</th>
             </tr>
          </thead>
          <tbody>
             <tr v-for="p in filteredParcours" :key="p.id" class="border-b border-[#F0F7FF] hover:bg-[#F0F9FF] group transition-colors">
                <td class="p-6">
                   <span class="px-2 py-1 rounded-lg font-mono font-black text-[10px]" :style="{ backgroundColor: p.couleur + '10', color: p.couleur }">[{{ p.code }}]</span>
                </td>
                <td class="p-6 font-black text-[#0C2340] text-sm">{{ p.nom }}</td>
                <td class="p-6">
                   <span class="text-[10px] font-black uppercase" :style="{ color: p.mentionCouleur }">{{ p.mentionIcone }} {{ p.mentionNom }}</span>
                </td>
                <td class="p-6">
                   <span class="px-3 py-1 rounded-full bg-[#E0F2FE] text-[#0284C7] text-[10px] font-black uppercase">{{ p.niveau }}</span>
                </td>
                <td class="p-6 text-center font-black text-[#0C2340]">{{ p.nbEtudiants }}</td>
                <td class="p-6 text-xs font-bold text-[#64A8CC]">{{ p.responsable.prenom }} {{ p.responsable.nom }}</td>
                <td class="p-6">
                   <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button @click="handleView(p)" class="p-2 text-[#64A8CC] hover:text-[#38BDF8]"><Eye :size="18"/></button>
                      <button @click="handleEdit(p)" class="p-2 text-[#64A8CC] hover:text-[#0EA5E9]"><Pencil :size="18"/></button>
                   </div>
                </td>
             </tr>
          </tbody>
       </table>
    </div>
  </div>
</template>
