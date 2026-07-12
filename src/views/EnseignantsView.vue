<script setup>
import { ref, onMounted, computed } from 'vue'
import { useEnseignantStore } from '../stores/enseignantStore'
import {
  Users, Search, Plus, RotateCcw, LayoutGrid, List,
  ChevronDown, AlertTriangle, Eye, Edit2, Trash2
} from 'lucide-vue-next'

import EnseignantCard from '../components/enseignants/EnseignantCard.vue'
import EnseignantModal from '../components/enseignants/EnseignantModal.vue'
import EnseignantDetail from '../components/enseignants/EnseignantDetail.vue'
import EnseignantsTable from '../components/enseignants/EnseignantsTable.vue'
import FeedbackToast from '../components/ui/FeedbackToast.vue'

const store = useEnseignantStore()

// State
const isModalOpen = ref(false)
const isDetailOpen = ref(false)
const selectedEnseignant = ref(null)
const showDeleteConfirm = ref(false)
const idToDelete = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const specialites = ['Toutes', 'Informatique', 'Mathématiques', 'Management', 'Communication', 'Economie', 'Réseaux', 'Droit']

onMounted(() => {
  store.fetchEnseignants()
})

const openAddModal = () => {
  selectedEnseignant.value = null
  isModalOpen.value = true
}

const openEditModal = (enseignant) => {
  selectedEnseignant.value = enseignant
  isModalOpen.value = true
  isDetailOpen.value = false
}

const openDetail = (enseignant) => {
  selectedEnseignant.value = enseignant
  isDetailOpen.value = true
}

const saveEnseignant = (data) => {
  const isEditing = !!selectedEnseignant.value;
  if (isEditing) {
    store.modifierEnseignant(selectedEnseignant.value.id, data)
    toastMessage.value = 'Enseignant modifié avec succès'
  } else {
    store.ajouterEnseignant(data)
    toastMessage.value = 'Enseignant ajouté avec succès'
  }
  isModalOpen.value = false
  
  // Show toast
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const confirmDelete = (id) => {
  idToDelete.value = id
  showDeleteConfirm.value = true
}

const executeDelete = () => {
  store.supprimerEnseignant(idToDelete.value)
  showDeleteConfirm.value = false
}
</script>

<template>
  <div class="space-y-10 pb-20 max-w-[1600px] mx-auto">
    <!-- Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-8">
      <div class="animate-in fade-in slide-in-from-left-4 duration-500">
        <div class="flex items-center gap-4 mb-3">
          <div class="p-3 bg-white border border-[#BFDBFE] rounded-2xl text-[#38BDF8] shadow-xl">
            <Users :size="28" />
          </div>
          <h1 class="text-3xl font-black text-[#0C2340] tracking-tight uppercase">Enseignants</h1>
        </div>
        <p class="text-[#1E5F8E] font-bold ml-1">
          <span class="text-[#38BDF8] font-black">{{ store.totalEnseignants }}</span> collaborateurs enregistrés
        </p>
      </div>

      <button
        @click="openAddModal"
        class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-[#38BDF8]/20 hover:brightness-110 active:scale-95 transition-all"
      >
        <Plus :size="18" /> Ajouter un enseignant
      </button>
    </header>

    <!-- Filters Bar -->
    <div class="bg-white p-6 rounded-[2.5rem] border border-[#BFDBFE] shadow-2xl flex flex-col xl:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <!-- Search -->
      <div class="relative flex-1">
        <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-[#64A8CC]" :size="22" />
        <input
          v-model="store.filtres.search"
          type="text"
          placeholder="Nom, email, spécialité..."
          class="w-full bg-[#F0F9FF] border-2 border-[#E1EFFF] text-[#0C2340] pl-14 pr-6 py-4 rounded-2xl focus:border-[#38BDF8] outline-none transition-all font-bold placeholder:text-[#64A8CC]/50"
        />
      </div>

      <!-- Filters -->
      <div class="flex flex-col sm:flex-row gap-6">
        <div class="relative min-w-[200px]">
          <select
            v-model="store.filtres.specialite"
            class="w-full bg-[#F0F9FF] border-2 border-[#E1EFFF] text-[#0C2340] px-6 py-4 rounded-2xl appearance-none focus:border-[#38BDF8] outline-none cursor-pointer font-black uppercase tracking-widest text-[10px]"
          >
            <option v-for="s in specialites" :key="s" :value="s">{{ s }}</option>
          </select>
          <ChevronDown class="absolute right-4 top-1/2 -translate-y-1/2 text-[#64A8CC] pointer-events-none" :size="18" />
        </div>

        <!-- Status Toggle -->
        <div class="flex p-1.5 bg-[#F0F7FF] border-2 border-[#E1EFFF] rounded-[1.25rem]">
          <button
            v-for="s in ['Tous', 'Actif', 'Inactif']"
            :key="s"
            @click="store.filtres.statut = s"
            class="px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
            :class="store.filtres.statut === s ? 'bg-white text-[#0284C7] shadow-lg shadow-[#0EA5E9]/10' : 'text-[#64A8CC] hover:text-[#0284C7]'"
          >
            {{ s }}
          </button>
        </div>

        <!-- View Mode -->
        <div class="flex p-1.5 bg-[#F0F7FF] border-2 border-[#E1EFFF] rounded-[1.25rem]">
          <button
            @click="store.viewMode = 'grid'"
            class="p-2.5 rounded-xl transition-all"
            :class="store.viewMode === 'grid' ? 'bg-white text-[#38BDF8] shadow-md' : 'text-[#64A8CC]'"
          >
            <LayoutGrid :size="20" />
          </button>
          <button
            @click="store.viewMode = 'list'"
            class="p-2.5 rounded-xl transition-all"
            :class="store.viewMode === 'list' ? 'bg-white text-[#38BDF8] shadow-md' : 'text-[#64A8CC]'"
          >
            <List :size="20" />
          </button>
        </div>

        <button @click="store.resetFiltres" class="p-4 bg-[#F0F9FF] text-[#64A8CC] hover:text-[#DC2626] border-2 border-[#E1EFFF] rounded-2xl transition-all">
          <RotateCcw :size="20" />
        </button>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="store.error" class="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center font-bold shadow-sm animate-in fade-in duration-500">
      {{ store.error }}
    </div>

    <!-- Loading Skeleton -->
    <div v-else-if="store.loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="n in 6" :key="n" class="bg-white rounded-[2.5rem] border border-[#BFDBFE] p-8 shadow-xl animate-pulse">
        <div class="flex justify-between items-start mb-8">
          <div class="w-16 h-16 rounded-[1.25rem] bg-gray-200"></div>
          <div class="flex flex-col items-end gap-2">
            <div class="w-16 h-4 bg-gray-200 rounded-full"></div>
            <div class="w-24 h-4 bg-gray-200 rounded-full"></div>
          </div>
        </div>
        <div class="mb-8 space-y-2">
          <div class="h-6 bg-gray-200 rounded-full w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded-full w-1/2"></div>
        </div>
        <div class="space-y-4 mb-8">
          <div class="h-4 bg-gray-200 rounded-full w-full"></div>
          <div class="h-4 bg-gray-200 rounded-full w-5/6"></div>
          <div class="h-4 bg-gray-200 rounded-full w-4/6"></div>
        </div>
        <div class="flex gap-3">
          <div class="flex-1 h-12 bg-gray-200 rounded-2xl"></div>
          <div class="flex-1 h-12 bg-gray-200 rounded-2xl"></div>
          <div class="flex-1 h-12 bg-gray-200 rounded-2xl"></div>
        </div>
      </div>
    </div>

    <!-- Grid View -->
    <div v-else-if="store.viewMode === 'grid'">
      <!-- Empty State -->
      <div v-if="store.enseignantsFiltres.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-white rounded-[2.5rem] border border-[#BFDBFE] shadow-xl animate-in fade-in duration-500">
        <div class="w-24 h-24 bg-[#F0F9FF] rounded-full flex items-center justify-center mb-6 text-[#38BDF8] shadow-inner">
          <Search v-if="store.enseignants.length > 0" :size="48" />
          <Users v-else :size="48" />
        </div>
        <h3 class="text-xl font-black text-[#0C2340] mb-2 uppercase tracking-tight">
          {{ store.enseignants.length > 0 ? 'Aucun enseignant ne correspond à votre recherche' : 'Aucun enseignant enregistré pour le moment' }}
        </h3>
        <p class="text-[#64A8CC] font-bold mb-8">
          {{ store.enseignants.length > 0 ? 'Essayez de modifier vos filtres ou termes de recherche.' : 'Commencez par ajouter un nouvel enseignant dans le système.' }}
        </p>
        <button v-if="store.enseignants.length === 0" @click="openAddModal" class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white px-8 py-4 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl hover:brightness-110 transition-all">
          <Plus :size="18" /> Ajouter un enseignant
        </button>
      </div>

      <!-- Grid Content -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <TransitionGroup
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-12"
          enter-to-class="opacity-100 translate-y-0"
        >
          <EnseignantCard
            v-for="e in store.enseignantsFiltres"
            :key="e.id"
            :enseignant="e"
            @view="openDetail"
            @edit="openEditModal"
            @delete="confirmDelete"
          />
        </TransitionGroup>
      </div>
    </div>

    <!-- List View (Dark Theme Table) -->
    <div v-else class="animate-in fade-in duration-700">
      <EnseignantsTable 
        :enseignants="store.enseignantsFiltres"
        @edit="openEditModal"
        @delete="confirmDelete"
      />
    </div>

    <!-- Modals & Detail -->
    <EnseignantModal :is-open="isModalOpen" :enseignant="selectedEnseignant" @close="isModalOpen = false" @save="saveEnseignant" />
    <EnseignantDetail :is-open="isDetailOpen" :enseignant="selectedEnseignant" @close="isDetailOpen = false" @edit="openEditModal" />

    <!-- Confirmation -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showDeleteConfirm" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#0C2340]/40 backdrop-blur-md" @click="showDeleteConfirm = false"></div>
        <div class="relative bg-white max-w-sm w-full p-10 rounded-[3rem] border border-[#BFDBFE] shadow-2xl text-center">
          <div class="w-20 h-20 bg-red-50 text-red-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
            <AlertTriangle :size="40" />
          </div>
          <h3 class="text-2xl font-black text-[#0C2340] mb-3 uppercase tracking-tight">Supprimer ?</h3>
          <p class="text-[#1E5F8E] text-sm mb-10 font-medium">Cette action est définitive. Les données de l'enseignant seront effacées.</p>
          <div class="flex gap-4">
            <button @click="showDeleteConfirm = false" class="flex-1 py-4 rounded-2xl bg-[#F0F7FF] text-[#1E5F8E] font-black text-xs uppercase tracking-widest transition-all">Annuler</button>
            <button @click="executeDelete" class="flex-1 py-4 rounded-2xl bg-red-500 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-red-200 hover:bg-red-600 transition-all">Effacer</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <FeedbackToast :show="showToast" :message="toastMessage" />
  </div>
</template>
