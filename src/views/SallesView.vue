<script setup>
import { ref, onMounted } from 'vue'
import { useSalleStore } from '../stores/salleStore'
import {
  Building2, Plus, Search, LayoutGrid, List, Map as MapIcon,
  ChevronDown, RotateCcw, Edit2, Trash2, Maximize2
} from 'lucide-vue-next'

import SalleCard from '../components/salles/SalleCard.vue'
import SalleModal from '../components/salles/SalleModal.vue'
import SalleMapView from '../components/salles/SalleMapView.vue'

const store = useSalleStore()

// State
const isModalOpen = ref(false)
const selectedSalle = ref(null)
const showDeleteConfirm = ref(false)
const idToDelete = ref(null)

const types = ['Tous', 'Salle de cours', 'Amphithéâtre', 'Laboratoire', 'Salle TD']
const batiments = ['Tous', 'Bâtiment A', 'Bâtiment B', 'Bâtiment C']

onMounted(() => {
  store.fetchSalles()
})

const openAddModal = () => {
  selectedSalle.value = null
  isModalOpen.value = true
}

const openEditModal = (salle) => {
  selectedSalle.value = salle
  isModalOpen.value = true
}

const saveSalle = (data) => {
  if (selectedSalle.value) {
    store.modifierSalle(selectedSalle.value.id, data)
  } else {
    store.ajouterSalle(data)
  }
  isModalOpen.value = false
}

const confirmDelete = (id) => {
  idToDelete.value = id
  showDeleteConfirm.value = true
}

const executeDelete = () => {
  store.supprimerSalle(idToDelete.value)
  showDeleteConfirm.value = false
}

const getStatusBadge = (statut) => {
  switch (statut) {
    case 'disponible': return 'bg-emerald-50 text-emerald-600 border-emerald-100'
    case 'occupée': return 'bg-red-50 text-red-600 border-red-100'
    case 'maintenance': return 'bg-orange-50 text-orange-600 border-orange-100'
    default: return 'bg-gray-50 text-gray-500 border-gray-100'
  }
}
</script>

<template>
  <div class="space-y-10 pb-20 max-w-[1600px] mx-auto">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-8">
      <div class="animate-in fade-in slide-in-from-left-4 duration-500">
        <div class="flex items-center gap-4 mb-3">
          <div class="p-3 bg-white border border-[#BFDBFE] rounded-2xl text-[#38BDF8] shadow-xl">
            <Building2 :size="28" />
          </div>
          <h1 class="text-3xl font-black text-[#0C2340] tracking-tight uppercase">Salles</h1>
        </div>
        <p class="text-[#1E5F8E] font-bold ml-1">
          <span class="text-[#38BDF8] font-black">{{ store.salles.length }}</span> locaux répertoriés · <span class="text-emerald-500 font-black">{{ store.stats.disponible }}</span> libres
        </p>
      </div>

      <button
        @click="openAddModal"
        class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-[#38BDF8]/20 hover:brightness-110 transition-all"
      >
        <Plus :size="18" /> Ajouter une salle
      </button>
    </header>

    <!-- Quick Stats -->
    <section class="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div v-for="(val, label) in { 'Disponibles': store.stats.disponible, 'Occupées': store.stats.occupee, 'Maintenance': store.stats.maintenance, 'Occupation': store.stats.tauxMoyen + '%' }" :key="label"
        class="bg-white p-6 rounded-3xl border border-[#BFDBFE] shadow-lg flex flex-col justify-between h-28 relative overflow-hidden group hover:border-[#38BDF8] transition-all">
        <span class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest relative z-10">{{ label }}</span>
        <span class="text-3xl font-black text-[#0C2340] relative z-10" :class="{ 'text-emerald-500': label === 'Disponibles', 'text-red-500': label === 'Occupées' }">{{ val }}</span>
        <div class="absolute -right-4 -bottom-4 w-16 h-16 bg-[#F0F9FF] rounded-full group-hover:scale-110 transition-transform"></div>
      </div>
    </section>

    <!-- Filters Bar -->
    <div class="bg-white p-6 rounded-[2.5rem] border border-[#BFDBFE] shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="flex flex-col xl:flex-row gap-6">
        <div class="relative flex-1">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-[#64A8CC]" :size="22" />
          <input
            v-model="store.filtres.search"
            type="text"
            placeholder="Rechercher une salle..."
            class="w-full bg-[#F0F9FF] border-2 border-[#E1EFFF] text-[#0C2340] pl-14 pr-6 py-4 rounded-2xl focus:border-[#38BDF8] outline-none transition-all font-bold"
          />
        </div>

        <div class="flex flex-wrap gap-4">
          <div class="relative min-w-[160px]">
            <select v-model="store.filtres.type" class="w-full bg-[#F0F9FF] border-2 border-[#E1EFFF] text-[#0C2340] px-6 py-4 rounded-2xl appearance-none focus:border-[#38BDF8] outline-none cursor-pointer font-black uppercase text-[10px] tracking-widest">
              <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
            </select>
            <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-[#64A8CC] pointer-events-none" :size="18" />
          </div>

          <div class="flex p-1.5 bg-[#F0F7FF] border-2 border-[#E1EFFF] rounded-[1.25rem]">
            <button v-for="s in ['Tous', 'Disponible', 'Occupée']" :key="s" @click="store.filtres.disponibilite = s"
              class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              :class="store.filtres.disponibilite === s ? 'bg-white text-[#0284C7] shadow-lg' : 'text-[#64A8CC] hover:text-[#0284C7]'"
            >{{ s }}</button>
          </div>

          <div class="flex p-1.5 bg-[#F0F7FF] border-2 border-[#E1EFFF] rounded-[1.25rem]">
            <button @click="store.viewMode = 'grid'" class="p-2.5 rounded-xl transition-all" :class="store.viewMode === 'grid' ? 'bg-white text-[#38BDF8] shadow-md' : 'text-[#64A8CC]'">
              <LayoutGrid :size="20" />
            </button>
            <button @click="store.viewMode = 'list'" class="p-2.5 rounded-xl transition-all" :class="store.viewMode === 'list' ? 'bg-white text-[#38BDF8] shadow-md' : 'text-[#64A8CC]'">
              <List :size="20" />
            </button>
            <button @click="store.viewMode = 'map'" class="p-2.5 rounded-xl transition-all" :class="store.viewMode === 'map' ? 'bg-white text-[#38BDF8] shadow-md' : 'text-[#64A8CC]'">
              <MapIcon :size="20" />
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-8 px-4">
        <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-[0.2em] whitespace-nowrap">Capacité min : {{ store.filtres.capacite }}</label>
        <input v-model.number="store.filtres.capacite" type="range" min="0" max="200" step="10" class="flex-1 accent-[#38BDF8] h-1 bg-[#F0F7FF] rounded-full appearance-none cursor-pointer" />
      </div>
    </div>

    <!-- Main Grid -->
    <div v-if="store.viewMode === 'grid'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <TransitionGroup
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-12"
        enter-to-class="opacity-100 translate-y-0"
      >
        <SalleCard
          v-for="s in store.sallesFiltrees"
          :key="s.id"
          :salle="s"
          @edit="openEditModal"
          @delete="confirmDelete"
          @view="selectedSalle = $event"
        />
      </TransitionGroup>
    </div>

    <div v-else-if="store.viewMode === 'list'" class="bg-white rounded-[2.5rem] border border-[#BFDBFE] overflow-hidden shadow-2xl animate-in fade-in duration-700">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-[#F8FBFF] border-b border-[#BFDBFE]">
            <th class="px-10 py-6 text-[10px] font-black text-[#1E5F8E] uppercase tracking-[0.2em]">Salle</th>
            <th class="px-10 py-6 text-[10px] font-black text-[#1E5F8E] uppercase tracking-[0.2em]">Localisation</th>
            <th class="px-10 py-6 text-[10px] font-black text-[#1E5F8E] uppercase tracking-[0.2em] text-center">Places</th>
            <th class="px-10 py-6 text-[10px] font-black text-[#1E5F8E] uppercase tracking-[0.2em]">Statut</th>
            <th class="px-10 py-6 text-[10px] font-black text-[#1E5F8E] uppercase tracking-[0.2em] text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#F0F7FF]">
          <tr v-for="s in store.sallesFiltrees" :key="s.id" class="hover:bg-[#F0F9FF]/50 transition-colors">
            <td class="px-10 py-6 font-black text-[#0C2340]">{{ s.nom }}</td>
            <td class="px-10 py-6 text-sm text-[#1E5F8E] font-medium">{{ s.batiment }} · Étage {{ s.etage }}</td>
            <td class="px-10 py-6 text-sm text-center font-black text-[#0284C7]">{{ s.capacite }}</td>
            <td class="px-10 py-6">
              <div :class="['px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border inline-flex items-center gap-2', getStatusBadge(s.statut)]">
                <div class="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                {{ s.statut }}
              </div>
            </td>
            <td class="px-10 py-6 text-right">
              <div class="flex justify-end gap-3">
                <button @click="openEditModal(s)" class="p-2.5 text-[#64A8CC] hover:text-[#38BDF8] transition-colors"><Edit2 :size="20" /></button>
                <button @click="confirmDelete(s.id)" class="p-2.5 text-[#64A8CC] hover:text-red-500 transition-colors"><Trash2 :size="20" /></button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <SalleMapView v-else-if="store.viewMode === 'map'" :salles="store.salles" />

    <!-- Modals -->
    <SalleModal :is-open="isModalOpen" :salle="selectedSalle" @close="isModalOpen = false" @save="saveSalle" />
  </div>
</template>
