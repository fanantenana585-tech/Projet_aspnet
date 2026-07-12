<script setup>
import { ref, computed, onMounted } from 'vue';
import { useMatiereStore, MENTIONS_EMIT } from '@/stores/matiereStore';
import { useFiliereStore } from '@/stores/filiereStore';
import MatiereCard from '@/components/matieres/MatiereCard.vue';
import MatiereModal from '@/components/matieres/MatiereModal.vue';
import MatiereDetail from '@/components/matieres/MatiereDetail.vue';
import {
  BookOpen, Plus, Search, Filter, X,
  Grid, List, BarChart3, RotateCcw,
  LayoutGrid, Table as TableIcon,
  ChevronDown, Eye, Pencil, Trash2
} from 'lucide-vue-next';

const store = useMatiereStore();
const filiereStore = useFiliereStore();

const selectedView = ref('grid'); // 'grid' | 'list' | 'dashboard'

onMounted(() => {
  store.fetchMatieres();
});

const stats = computed(() => store.statsGlobales);

const filteredMatieres = computed(() => store.matieresFiltrees);

const resetFilters = () => {
  store.filtres = {
    search: '',
    mention: 'toutes',
    parcours: 'tous',
    niveau: 'tous',
    semestre: 'tous',
    type: 'tous',
    statut: 'actif'
  };
};

const handleView = (m) => store.ouvrirDetail(m);
const handleEdit = (m) => store.ouvrirModal(m);
const handleDelete = (id) => {
  if (confirm("Supprimer cette matière ? Cette action est irréversible.")) {
    store.supprimerMatiere(id);
  }
};

const availableParcours = computed(() => {
  if (store.filtres.mention === 'toutes') return [];
  const m = MENTIONS_EMIT.find(m => m.id === store.filtres.mention);
  return m ? m.parcours : [];
});

</script>

<template>
  <div class="min-h-screen bg-[#F0F7FF] p-6 lg:p-10 space-y-10">
    <!-- Header -->
    <header class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
      <div class="flex items-center gap-6">
        <div class="w-16 h-16 rounded-[1.5rem] bg-white border border-[#BFDBFE] flex items-center justify-center shadow-sm">
          <BookOpen :size="32" class="text-[#38BDF8]" />
        </div>
        <div>
          <h1 class="text-3xl font-black text-[#0C2340] tracking-tight">Gestion des Matières</h1>
          <p class="text-sm font-bold text-[#64A8CC] mt-1">
            {{ stats.total }} matières · {{ stats.mentions }} mentions · 11 parcours
          </p>
        </div>
      </div>

      <button
        @click="store.ouvrirModal()"
        class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#38BDF8]/20 hover:-translate-y-1 transition-all flex items-center gap-3 active:scale-95"
      >
        <Plus :size="20" /> Ajouter une matière
      </button>
    </header>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white p-6 rounded-3xl border border-[#BFDBFE] border-t-[3px] border-t-[#38BDF8] shadow-sm hover:-translate-y-1 transition-all">
        <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Total matières</p>
        <p class="text-3xl font-black text-[#0C2340] mt-2">{{ stats.total }}</p>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-[#BFDBFE] border-t-[3px] border-t-[#059669] shadow-sm hover:-translate-y-1 transition-all">
        <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Actives</p>
        <p class="text-3xl font-black text-[#059669] mt-2">{{ stats.actives }}</p>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-[#BFDBFE] border-t-[3px] border-t-[#D97706] shadow-sm hover:-translate-y-1 transition-all">
        <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Crédits moyens</p>
        <p class="text-3xl font-black text-[#D97706] mt-2">{{ stats.creditsMoyens }}</p>
      </div>
      <div class="bg-white p-6 rounded-3xl border border-[#BFDBFE] border-t-[3px] border-t-[#EC4899] shadow-sm hover:-translate-y-1 transition-all">
        <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Mentions actives</p>
        <p class="text-3xl font-black text-[#EC4899] mt-2">{{ stats.mentions }}</p>
      </div>
    </div>

    <!-- Filters Bar -->
    <div class="bg-white p-6 rounded-[2rem] border border-[#BFDBFE] shadow-sm space-y-6">
      <div class="flex flex-wrap items-center gap-4">
        <!-- Search -->
        <div class="flex-1 min-w-[300px] relative group">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-[#64A8CC] group-focus-within:text-[#38BDF8] transition-colors" :size="20" />
          <input
            v-model="store.filtres.search"
            type="text"
            placeholder="Rechercher par code ou nom..."
            class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-2xl py-4 pl-12 pr-4 text-[#0C2340] font-bold focus:border-[#38BDF8] outline-none transition-all"
          >
        </div>

        <!-- Mentions Dropdown -->
        <div class="relative min-w-[200px]">
          <select
            v-model="store.filtres.mention"
            class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-2xl p-4 pr-10 text-[#0C2340] font-bold appearance-none outline-none focus:border-[#38BDF8] cursor-pointer"
          >
            <option value="toutes">Toutes les mentions</option>
            <option v-for="m in MENTIONS_EMIT" :key="m.id" :value="m.id">
              {{ m.icone }} {{ m.nom }}
            </option>
            <option value="transversal">📚 Transversal</option>
          </select>
          <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-[#64A8CC] pointer-events-none" :size="20" />
        </div>

        <!-- Parcours Dropdown (Cascaded) -->
        <div class="relative min-w-[200px]" v-if="store.filtres.mention !== 'toutes'">
          <select
            v-model="store.filtres.parcours"
            class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-2xl p-4 pr-10 text-[#0C2340] font-bold appearance-none outline-none focus:border-[#38BDF8] cursor-pointer"
          >
            <option value="tous">Tous les parcours</option>
            <option v-for="p in availableParcours" :key="p.id" :value="p.id">
              {{ p.code }} - {{ p.nom }}
            </option>
          </select>
          <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-[#64A8CC] pointer-events-none" :size="20" />
        </div>

        <!-- View Toggle -->
        <div class="flex bg-[#F0F9FF] p-1.5 rounded-2xl border-2 border-[#BFDBFE]">
          <button
            @click="selectedView = 'grid'"
            class="p-2.5 rounded-xl transition-all"
            :class="selectedView === 'grid' ? 'bg-white shadow-sm text-[#38BDF8]' : 'text-[#64A8CC] hover:text-[#0C2340]'"
          >
            <LayoutGrid :size="20" />
          </button>
          <button
            @click="selectedView = 'list'"
            class="p-2.5 rounded-xl transition-all"
            :class="selectedView === 'list' ? 'bg-white shadow-sm text-[#38BDF8]' : 'text-[#64A8CC] hover:text-[#0C2340]'"
          >
            <List :size="20" />
          </button>
          <button
            @click="selectedView = 'dashboard'"
            class="p-2.5 rounded-xl transition-all"
            :class="selectedView === 'dashboard' ? 'bg-white shadow-sm text-[#38BDF8]' : 'text-[#64A8CC] hover:text-[#0C2340]'"
          >
            <TableIcon :size="20" />
          </button>
        </div>

        <button
          @click="resetFilters"
          class="p-4 text-[#64A8CC] hover:text-red-500 transition-colors"
          title="Réinitialiser les filtres"
        >
          <RotateCcw :size="20" />
        </button>
      </div>

      <!-- Quick Pills Filters -->
      <div class="flex flex-wrap items-center gap-6 pt-4 border-t border-[#F0F7FF]">
        <div class="flex items-center gap-3">
          <span class="text-[10px] font-black text-[#64A8CC] uppercase">Niveau</span>
          <div class="flex gap-2">
            <button
              v-for="lvl in ['tous','L1','L2','L3','M1','M2']" :key="lvl"
              @click="store.filtres.niveau = lvl"
              class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all"
              :class="store.filtres.niveau === lvl ? 'bg-[#38BDF8] text-white' : 'bg-[#F0F9FF] text-[#64A8CC] hover:bg-[#BFDBFE]'"
            >
              {{ lvl }}
            </button>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-[10px] font-black text-[#64A8CC] uppercase">Type</span>
          <div class="flex gap-2">
            <button
              v-for="t in ['tous','Cours','TD','TP','Projet']" :key="t"
              @click="store.filtres.type = t"
              class="px-4 py-1.5 rounded-full text-[10px] font-black uppercase transition-all"
              :class="store.filtres.type === t ? 'bg-[#38BDF8] text-white' : 'bg-[#F0F9FF] text-[#64A8CC] hover:bg-[#BFDBFE]'"
            >
              {{ t }}
            </button>
          </div>
        </div>

        <div class="ml-auto">
          <span class="px-4 py-2 bg-[#E0F2FE] text-[#0284C7] rounded-xl text-[10px] font-black uppercase tracking-wider">
            {{ filteredMatieres.length }} matières trouvées
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <main v-if="selectedView === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
      <MatiereCard
        v-for="(m, idx) in filteredMatieres"
        :key="m.id"
        :matiere="m"
        :index="idx"
        @view="handleView"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </main>

    <!-- Table View -->
    <div v-else-if="selectedView === 'list'" class="bg-white rounded-[2.5rem] border border-[#BFDBFE] shadow-sm overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-[#F8FBFF] border-b border-[#BFDBFE]">
          <tr>
            <th class="p-6 text-[10px] font-black text-[#64A8CC] uppercase">Code</th>
            <th class="p-6 text-[10px] font-black text-[#64A8CC] uppercase">Matière</th>
            <th class="p-6 text-[10px] font-black text-[#64A8CC] uppercase">Mention</th>
            <th class="p-6 text-[10px] font-black text-[#64A8CC] uppercase">Parcours</th>
            <th class="p-6 text-[10px] font-black text-[#64A8CC] uppercase">Niveau</th>
            <th class="p-6 text-[10px] font-black text-[#64A8CC] uppercase">Crédits</th>
            <th class="p-6 text-[10px] font-black text-[#64A8CC] uppercase">Statut</th>
            <th class="p-6 text-[10px] font-black text-[#64A8CC] uppercase text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in filteredMatieres" :key="m.id" class="border-b border-[#F0F7FF] hover:bg-[#F0F9FF] transition-colors group">
            <td class="p-6 font-mono font-bold text-[#38BDF8] text-sm">[{{ m.code }}]</td>
            <td class="p-6 font-black text-[#0C2340] text-sm">{{ m.nom }}</td>
            <td class="p-6">
              <span class="px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 w-fit" :style="{ backgroundColor: m.couleur + '10', color: m.couleur }">
                {{ m.mention }}
              </span>
            </td>
            <td class="p-6">
              <span class="px-2 py-1 rounded bg-[#F0F9FF] border border-[#BFDBFE] text-[#1E5F8E] font-black text-[10px]">
                {{ m.parcours }}
              </span>
            </td>
            <td class="p-6 font-bold text-[#64A8CC] text-sm">{{ m.niveau }} ({{ m.semestre }})</td>
            <td class="p-6 font-black text-[#0C2340]">{{ m.credits }} ECTS</td>
            <td class="p-6">
              <div class="flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-[#059669]"></div>
                <span class="text-[10px] font-black text-[#059669] uppercase">Actif</span>
              </div>
            </td>
            <td class="p-6">
              <div class="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button @click="handleView(m)" class="p-2 text-[#64A8CC] hover:text-[#38BDF8]"><Eye :size="18"/></button>
                <button @click="handleEdit(m)" class="p-2 text-[#64A8CC] hover:text-[#0EA5E9]"><Pencil :size="18"/></button>
                <button @click="handleDelete(m.id)" class="p-2 text-[#64A8CC] hover:text-red-500"><Trash2 :size="18"/></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modals -->
    <MatiereModal />
    <MatiereDetail />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
