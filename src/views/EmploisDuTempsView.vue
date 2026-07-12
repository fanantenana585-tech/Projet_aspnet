<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';
import CalendrierSemaine from '@/components/emplois/CalendrierSemaine.vue';
import EmploiFilters from '@/components/emplois/EmploiFilters.vue';
import ConflictAlert from '@/components/emplois/ConflictAlert.vue';
import CreneauModal from '@/components/emplois/CreneauModal.vue';
import {
  Calendar, ChevronLeft, ChevronRight, Plus,
  FileOutput, Copy, ZoomIn, ZoomOut, Maximize
} from 'lucide-vue-next';

const store = useEmploiStore();

onMounted(() => {
  store.fetchEmplois();
});
</script>

<template>
  <div class="space-y-6 pb-10 max-w-[1800px] mx-auto">
    <!-- Header -->
    <header class="flex flex-col gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div class="flex justify-between items-center bg-white p-8 rounded-[2.5rem] border border-[#BFDBFE] shadow-sm relative overflow-hidden">
        <!-- Decor -->
        <div class="absolute right-0 top-0 w-64 h-64 bg-[#F0F9FF] rounded-full -mr-32 -mt-32 opacity-50"></div>

        <div class="flex items-center gap-6 relative z-10">
          <div class="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-white text-3xl shadow-lg shadow-[#38BDF8]/20">
            <Calendar :size="32" />
          </div>
          <div>
            <h1 class="text-3xl font-black text-[#0C2340] tracking-tight">Emplois du Temps EMIT</h1>
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-[#64A8CC] mt-1">Gestion des plannings académiques</p>
          </div>
        </div>

        <div class="flex items-center gap-3 relative z-10">
           <button class="bg-[#F0F9FF] border border-[#BFDBFE] text-[#1E5F8E] px-6 py-3.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all flex items-center gap-2">
              <FileOutput :size="18" class="text-[#38BDF8]" /> Exporter PDF
           </button>
           <button
             @click="store.ouvrirModal()"
             class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#38BDF8]/20 hover:-translate-y-0.5 transition-all flex items-center gap-3 active:scale-95"
           >
              <Plus :size="20" /> Nouveau créneau
           </button>
        </div>
      </div>

      <!-- Navigation & Filters -->
      <div class="flex flex-wrap items-center justify-between gap-4 bg-white/50 p-2 rounded-[2rem] border border-[#BFDBFE]/50 backdrop-blur-sm">
         <div class="flex items-center gap-3">
            <button @click="store.changerSemaine(-1)" class="w-12 h-12 rounded-2xl bg-white border border-[#BFDBFE] text-[#38BDF8] hover:shadow-md transition-all flex items-center justify-center">
               <ChevronLeft :size="20" />
            </button>
            <div class="px-8 py-3 bg-white rounded-2xl border border-[#BFDBFE] flex items-center gap-6 shadow-sm cursor-pointer hover:bg-[#F0F9FF] transition-colors">
               <span class="text-sm font-black text-[#0C2340]">Semaine du {{ store.dateDebutSemaine }} au {{ store.dateFinSemaine }}</span>
               <span class="bg-[#E0F2FE] text-[#0284C7] px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Sem. {{ store.numeroSemaine }}</span>
            </div>
            <button @click="store.changerSemaine(1)" class="w-12 h-12 rounded-2xl bg-white border border-[#BFDBFE] text-[#38BDF8] hover:shadow-md transition-all flex items-center justify-center">
               <ChevronRight :size="20" />
            </button>
         </div>

         <div class="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#BFDBFE] shadow-sm">
            <button @click="store.setZoom(store.pixelsParMinute - 0.1)" class="p-2 rounded-xl text-[#64A8CC] hover:text-[#38BDF8] hover:bg-[#F0F9FF] transition-all"><ZoomOut :size="18" /></button>
            <div class="w-[1px] h-4 bg-[#BFDBFE]"></div>
            <span class="text-[10px] font-black text-[#64A8CC] uppercase px-2">Zoom</span>
            <div class="w-[1px] h-4 bg-[#BFDBFE]"></div>
            <button @click="store.setZoom(store.pixelsParMinute + 0.1)" class="p-2 rounded-xl text-[#64A8CC] hover:text-[#38BDF8] hover:bg-[#F0F9FF] transition-all"><ZoomIn :size="18" /></button>
         </div>
      </div>
    </header>

    <main class="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
      <ConflictAlert v-if="store.conflits.length > 0" />
      <EmploiFilters />

      <div class="relative bg-white rounded-[3rem] border border-[#BFDBFE] shadow-xl overflow-hidden min-h-[600px]">
        <CalendrierSemaine
          :emplois="store.emploisFiltres"
          :pixels-par-minute="store.pixelsParMinute"
        />
      </div>
    </main>

    <CreneauModal :is-open="store.modalOuverte" :creneau="store.creneauEnEdition" @close="store.fermerModal()" />
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
