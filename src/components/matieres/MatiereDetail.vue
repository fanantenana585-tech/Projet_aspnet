<script setup>
import { ref, computed } from 'vue';
import { useMatiereStore } from '@/stores/matiereStore';
import {
  X, BookOpen, Clock, Award, Users,
  ChevronRight, Calendar, Layout,
  FileText, BarChart3, Settings,
  MapPin, ShieldCheck
} from 'lucide-vue-next';

const store = useMatiereStore();
const activeTab = ref('presentation');

const matiere = computed(() => store.matiereSelectionnee);

const tabs = [
  { id: 'presentation', label: 'Présentation', icon: BookOpen },
  { id: 'cursus', label: 'Cursus & Volume', icon: Clock },
  { id: 'equipe', label: 'Équipe', icon: Users },
  { id: 'stats', label: 'Statistiques', icon: BarChart3 }
];

const totalHours = computed(() => {
  if (!matiere.value) return 0;
  const v = matiere.value.volumeHoraire;
  return (v.cours || 0) + (v.td || 0) + (v.tp || 0) + (v.projet || 0);
});

</script>

<template>
  <Transition name="drawer">
    <div v-if="store.drawerOuvert && matiere" class="fixed inset-0 z-[300] flex justify-end">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-[#0C2340]/20 backdrop-blur-sm" @click="store.fermerDetail()"></div>

      <!-- Drawer Content -->
      <div class="relative w-full max-w-[500px] bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col border-l border-[#BFDBFE] animate-in slide-in-from-right duration-500">

        <!-- Header -->
        <div class="p-8 border-b border-[#F0F7FF] flex justify-between items-start bg-gradient-to-br from-[#F8FBFF] to-white">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <span class="px-3 py-1 bg-[#38BDF8] text-white text-xs font-black rounded-lg shadow-sm">[{{ matiere.code }}]</span>
              <span class="px-3 py-1 bg-[#F0F9FF] border border-[#BFDBFE] text-[#1E5F8E] text-[10px] font-black uppercase tracking-widest rounded-full">{{ matiere.statut }}</span>
            </div>
            <h2 class="text-2xl font-black text-[#0C2340] leading-tight">{{ matiere.nom }}</h2>
            <div class="flex flex-wrap gap-2">
               <span class="text-[10px] font-bold text-[#64A8CC] flex items-center gap-1.5"><Layout :size="12" /> {{ matiere.parcoursNom }}</span>
               <span class="text-[10px] font-bold text-[#64A8CC] flex items-center gap-1.5"><Calendar :size="12" /> {{ matiere.niveau }} ({{ matiere.semestre }})</span>
            </div>
          </div>
          <button @click="store.fermerDetail()" class="p-3 bg-white rounded-2xl text-[#64A8CC] hover:text-red-500 shadow-sm border border-[#BFDBFE] transition-all">
            <X :size="20" />
          </button>
        </div>

        <!-- Tabs Navigation -->
        <nav class="flex border-b border-[#F0F7FF] px-8 bg-white shrink-0">
          <button
            v-for="tab in tabs" :key="tab.id"
            @click="activeTab = tab.id"
            class="flex-1 py-4 flex flex-col items-center gap-2 border-b-2 transition-all"
            :class="activeTab === tab.id ? 'border-[#38BDF8] text-[#38BDF8]' : 'border-transparent text-[#64A8CC] hover:text-[#0C2340]'"
          >
            <component :is="tab.icon" :size="18" />
            <span class="text-[9px] font-black uppercase tracking-widest">{{ tab.label }}</span>
          </button>
        </nav>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-8">

          <div v-if="activeTab === 'presentation'" class="space-y-8 animate-in fade-in">
             <div class="space-y-3">
                <h3 class="text-xs font-black text-[#0C2340] uppercase tracking-widest flex items-center gap-2">
                   <FileText :size="14" class="text-[#38BDF8]" /> Description du cours
                </h3>
                <p class="text-sm text-[#1E5F8E] leading-relaxed font-medium bg-[#F0F9FF] p-6 rounded-3xl border border-[#BFDBFE]/50">
                   {{ matiere.description }}
                </p>
             </div>

             <div class="grid grid-cols-2 gap-4">
                <div class="p-6 bg-white border border-[#BFDBFE] rounded-3xl space-y-1">
                   <span class="text-[9px] font-black text-[#64A8CC] uppercase">Mention</span>
                   <p class="text-xs font-black text-[#0C2340]">{{ matiere.mention }}</p>
                </div>
                <div class="p-6 bg-white border border-[#BFDBFE] rounded-3xl space-y-1">
                   <span class="text-[9px] font-black text-[#64A8CC] uppercase">Coefficient</span>
                   <p class="text-xs font-black text-[#0C2340]">{{ matiere.coefficient }}</p>
                </div>
             </div>

             <div class="bg-gradient-to-r from-[#0C2340] to-[#1E3A8A] p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
                <div class="flex justify-between items-center">
                   <span class="text-[10px] font-black uppercase tracking-widest opacity-60">Responsable du module</span>
                   <ShieldCheck :size="20" class="text-[#38BDF8]" />
                </div>
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-xl font-black">JR</div>
                   <div>
                      <p class="text-base font-black">Dr. Rakoto Jean</p>
                      <p class="text-[10px] font-bold opacity-60">j.rakoto@emit.mg</p>
                   </div>
                </div>
             </div>
          </div>

          <div v-if="activeTab === 'cursus'" class="space-y-8 animate-in fade-in">
             <div class="space-y-6">
                <h3 class="text-xs font-black text-[#0C2340] uppercase tracking-widest">Répartition des charges</h3>
                <div class="space-y-4">
                   <div v-for="(val, key) in matiere.volumeHoraire" :key="key" class="space-y-2">
                      <div class="flex justify-between text-[10px] font-black uppercase">
                         <span class="text-[#64A8CC]">{{ key }}</span>
                         <span class="text-[#0C2340]">{{ val }}h</span>
                      </div>
                      <div class="h-2 w-full bg-[#F0F9FF] rounded-full overflow-hidden border border-[#BFDBFE]/30">
                         <div class="h-full bg-[#38BDF8] rounded-full" :style="{ width: (val / totalHours * 100) + '%' }"></div>
                      </div>
                   </div>
                </div>
             </div>

             <div class="p-6 bg-[#F8FBFF] rounded-3xl border border-[#BFDBFE] flex items-center justify-between">
                <div>
                   <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Volume Total Semestriel</p>
                   <p class="text-2xl font-black text-[#38BDF8]">{{ totalHours }}h</p>
                </div>
                <div class="w-12 h-12 rounded-full border-4 border-[#38BDF8] border-t-transparent animate-spin-slow"></div>
             </div>
          </div>

          <!-- Other tabs placeholders -->
          <div v-if="activeTab === 'equipe'" class="text-center py-20 space-y-4 opacity-50">
             <Users :size="48" class="mx-auto text-[#BFDBFE]" />
             <p class="text-sm font-bold text-[#64A8CC]">Liste des intervenants en cours de chargement...</p>
          </div>

          <div v-if="activeTab === 'stats'" class="text-center py-20 space-y-4 opacity-50">
             <BarChart3 :size="48" class="mx-auto text-[#BFDBFE]" />
             <p class="text-sm font-bold text-[#64A8CC]">Statistiques de réussite non disponibles pour ce semestre.</p>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-[#F0F7FF] flex gap-4 bg-[#F8FBFF]">
           <button
             @click="store.ouvrirModal(matiere)"
             class="flex-1 py-4 bg-white border border-[#BFDBFE] text-[#1E5F8E] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-md transition-all"
           >
              Modifier
           </button>
           <button class="flex-1 py-4 bg-[#38BDF8] text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-[#38BDF8]/20">
              Imprimer fiche
           </button>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); opacity: 0; }

.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #BFDBFE; border-radius: 10px; }

@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow { animation: spin-slow 3s linear infinite; }
</style>
