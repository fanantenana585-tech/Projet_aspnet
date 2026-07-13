<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';
import CalendrierSemaine from '@/components/emplois/CalendrierSemaine.vue';
import EmploiFilters from '@/components/emplois/EmploiFilters.vue';
import ConflictAlert from '@/components/emplois/ConflictAlert.vue';
import CreneauModal from '@/components/emplois/CreneauModal.vue';
import EmploiPrint from '@/components/emplois/EmploiPrint.vue';
import FeedbackToast from '@/components/ui/FeedbackToast.vue';
import {
  Calendar, ChevronLeft, ChevronRight, Plus,
  FileOutput, Copy, ZoomIn, ZoomOut, Maximize
} from 'lucide-vue-next';

const store = useEmploiStore();
const showToast = ref(false);
const toastMessage = ref('');

const handleSaved = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  window.setTimeout(() => { showToast.value = false; }, 3000);
};

onMounted(() => {
  store.fetchEmplois();
});
</script>

<template>
  <div class="space-y-4 pb-6 max-w-[1800px] mx-auto">
    <!-- Header -->
    <header class="flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-700">
      <div class="flex justify-between items-center bg-white p-6 rounded-[2.5rem] border border-[#BFDBFE] shadow-sm relative overflow-hidden">
        <!-- Decor -->
        <div class="absolute right-0 top-0 w-64 h-64 bg-[#F0F9FF] rounded-full -mr-32 -mt-32 opacity-50"></div>

        <div class="flex items-center gap-5 relative z-10">
          <div class="w-14 h-14 rounded-[1.5rem] bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-white text-2xl shadow-lg shadow-[#38BDF8]/20">
            <Calendar :size="28" />
          </div>
          <div>
            <h1 class="text-2xl font-black text-[#0C2340] tracking-tight">Emplois du Temps EMIT</h1>
            <p class="text-[10px] font-black uppercase tracking-[0.15em] text-[#64A8CC] mt-0.5">Gestion des plannings académiques</p>
          </div>
        </div>

        <div class="flex items-center gap-2 relative z-10">
           <button @click="store.printModalOuverte = true" class="bg-[#F0F9FF] border border-[#BFDBFE] text-[#1E5F8E] px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
              <FileOutput :size="16" class="text-[#38BDF8]" /> Exporter PDF
           </button>
           <button
             @click="store.ouvrirModal()"
             class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#38BDF8]/20 hover:-translate-y-0.5 transition-all flex items-center gap-2 active:scale-95 text-sm"
           >
              <Plus :size="18" /> Nouveau créneau
           </button>
        </div>
      </div>

      <!-- Navigation & Filters -->
      <div class="flex flex-wrap items-center justify-between gap-3 bg-white/50 p-2 rounded-[2rem] border border-[#BFDBFE]/50 backdrop-blur-sm">
         <div class="flex items-center gap-2">
            <button @click="store.changerSemaine(-1)" class="w-10 h-10 rounded-2xl bg-white border border-[#BFDBFE] text-[#38BDF8] hover:shadow-md transition-all flex items-center justify-center">
               <ChevronLeft :size="18" />
            </button>
            <div class="px-6 py-2 bg-white rounded-2xl border border-[#BFDBFE] flex items-center gap-4 shadow-sm cursor-pointer hover:bg-[#F0F9FF] transition-colors">
               <span class="text-xs font-black text-[#0C2340]">Semaine du {{ store.dateDebutSemaine }} au {{ store.dateFinSemaine }}</span>
               <span class="bg-[#E0F2FE] text-[#0284C7] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Sem. {{ store.numeroSemaine }}</span>
            </div>
            <button @click="store.changerSemaine(1)" class="w-10 h-10 rounded-2xl bg-white border border-[#BFDBFE] text-[#38BDF8] hover:shadow-md transition-all flex items-center justify-center">
               <ChevronRight :size="18" />
            </button>
         </div>

         <div class="flex items-center gap-1 bg-white px-3 py-2 rounded-2xl border border-[#BFDBFE] shadow-sm">
            <button @click="store.setZoom(store.pixelsParMinute - 0.1)" class="p-1.5 rounded-xl text-[#64A8CC] hover:text-[#38BDF8] hover:bg-[#F0F9FF] transition-all"><ZoomOut :size="16" /></button>
            <div class="w-[1px] h-3 bg-[#BFDBFE]"></div>
            <span class="text-[9px] font-black text-[#64A8CC] uppercase px-1.5">Zoom</span>
            <div class="w-[1px] h-3 bg-[#BFDBFE]"></div>
            <button @click="store.setZoom(store.pixelsParMinute + 0.1)" class="p-1.5 rounded-xl text-[#64A8CC] hover:text-[#38BDF8] hover:bg-[#F0F9FF] transition-all"><ZoomIn :size="16" /></button>
         </div>
      </div>
    </header>

    <main class="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
      <ConflictAlert v-if="store.conflits.length > 0" />
      <EmploiFilters />

      <div id="emploi-export-zone" class="relative bg-white rounded-[3rem] border border-[#BFDBFE] shadow-xl overflow-hidden min-h-[600px]">
        <CalendrierSemaine
          :emplois="store.emploisFiltres"
          :pixels-par-minute="store.pixelsParMinute"
        />
      </div>
    </main>

    <CreneauModal
      :is-open="store.modalOuverte"
      :creneau="store.creneauEnEdition"
      @close="store.fermerModal()"
      @saved="handleSaved"
    />
    <EmploiPrint />
    <FeedbackToast :show="showToast" :message="toastMessage" />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
