<script setup>
import { computed, ref } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';
import { AlertTriangle, ChevronDown, ChevronUp, Eye, EyeOff, ShieldAlert, ArrowRight } from 'lucide-vue-next';

const store = useEmploiStore();
const expanded = ref(false);

const getIcon = (type) => {
  if (type === 'Enseignant') return '👨‍🏫';
  if (type === 'Salle') return '🏫';
  if (type === 'Groupe') return '👥';
  return '⚠️';
};

const counts = computed(() => {
  return store.conflits.length;
});
</script>

<template>
  <div v-if="counts > 0 && !store.conflitsIgnores" class="bg-[#FEF3C7] border-2 border-[#D97706] rounded-[2rem] p-6 mb-8 shadow-xl shadow-orange-100/50 animate-in fade-in slide-in-from-top-4 duration-500 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-1/4 -translate-y-1/4">
       <AlertTriangle :size="160" class="text-[#D97706]" />
    </div>

    <div class="flex items-center justify-between relative z-10">
      <div class="flex items-center gap-6">
        <div class="w-14 h-14 rounded-2xl bg-[#D97706] flex items-center justify-center text-white shadow-lg shadow-orange-300/30">
           <ShieldAlert :size="28" />
        </div>
        <div>
           <h3 class="text-[#92400E] font-black text-xl tracking-tight">⚠️ {{ counts }} conflits détectés</h3>
           <p class="text-[#92400E] opacity-70 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
             Action requise pour valider l'emploi du temps de la semaine
           </p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button
          @click="expanded = !expanded"
          class="bg-white px-5 py-3 rounded-2xl text-[#D97706] font-black text-xs uppercase tracking-widest hover:shadow-md transition-all flex items-center gap-3 border border-[#D97706]/20"
        >
          {{ expanded ? 'Masquer' : 'Voir les conflits' }}
          <component :is="expanded ? ChevronUp : ChevronDown" :size="18" />
        </button>
        <button
          @click="store.conflitsIgnores = true"
          class="text-[#92400E] font-black text-xs uppercase tracking-widest hover:underline px-4 flex items-center gap-2"
        >
          <EyeOff :size="16" /> Ignorer
        </button>
      </div>
    </div>

    <Transition name="expand">
      <div v-if="expanded" class="mt-6 space-y-3 border-t-2 border-[#D97706]/10 pt-6">
        <div v-for="conflit in store.conflits" :key="conflit.id" class="flex items-center justify-between bg-white/60 p-5 rounded-[1.5rem] text-sm border border-white group hover:bg-white transition-all shadow-sm">
          <div class="flex items-center gap-5">
            <div class="w-12 h-12 rounded-xl bg-[#FEF3C7] border-2 border-[#D97706]/20 flex items-center justify-center text-xl shadow-sm">
               <span>{{ getIcon(conflit.type) }}</span>
            </div>
            <div>
               <p class="text-[10px] font-black text-[#D97706] uppercase tracking-widest mb-1">{{ conflit.type }}</p>
               <p class="text-[#92400E] font-bold text-base leading-tight">{{ conflit.message || conflit.description }}</p>
            </div>
          </div>
          <button class="bg-[#D97706] text-white px-5 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-orange-200 transition-all opacity-0 group-hover:opacity-100 flex items-center gap-2">
            Résoudre <ArrowRight :size="14" />
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.expand-enter-active, .expand-leave-active { transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1); max-height: 1000px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; transform: translateY(-10px); }
</style>
