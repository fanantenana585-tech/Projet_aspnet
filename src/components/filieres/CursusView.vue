<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useFiliereStore } from '@/stores/filiereStore';
import { useMatiereStore } from '@/stores/matiereStore';
import {
  ChevronRight, BookOpen, GraduationCap,
  MapPin, Clock, Info, ShieldCheck
} from 'lucide-vue-next';

const filiereStore = useFiliereStore();
const matiereStore = useMatiereStore();

const selectedMentionId = ref('');
const selectedParcoursId = ref('');

const selectedMention = computed(() => filiereStore.mentions.find(m => m.id === selectedMentionId.value));
const filteredParcours = computed(() => selectedMention.value?.parcours || []);
const currentParcours = computed(() => filiereStore.parcours.find(p => p.id === selectedParcoursId.value));

const initializeSelection = () => {
  if (!selectedMentionId.value && filiereStore.mentions.length > 0) {
    selectedMentionId.value = filiereStore.mentions[0].id;
  }
  if (!selectedParcoursId.value && filteredParcours.value.length > 0) {
    selectedParcoursId.value = filteredParcours.value[0].id;
  }
};

watch(
  () => filiereStore.mentions,
  () => {
    initializeSelection();
  },
  { immediate: true }
);

watch(
  filteredParcours,
  () => {
    if (!selectedParcoursId.value && filteredParcours.value.length > 0) {
      selectedParcoursId.value = filteredParcours.value[0].id;
    }
  }
);

onMounted(() => {
  initializeSelection();
});

const getMatieresBySemestre = (semestre) => {
  return matiereStore.matieres.filter(m =>
    m.parcours === selectedParcoursId.value && m.semestre === semestre
  );
};

const levels = computed(() => currentParcours.value?.niveau === 'Master' ? ['M1', 'M2'] : ['L1', 'L2', 'L3']);

</script>

<template>
  <div class="space-y-10 animate-in fade-in duration-700">
    <!-- Mention Selector -->
    <div class="flex gap-4 p-2 bg-white rounded-[2rem] border border-[#BFDBFE] w-fit mx-auto shadow-sm">
      <button
        v-for="m in filiereStore.mentions" :key="m.id"
        @click="selectedMentionId = m.id; selectedParcoursId = m.parcours[0]?.id"
        class="px-8 py-3.5 rounded-[1.5rem] flex items-center gap-3 transition-all duration-500"
        :style="{
          backgroundColor: selectedMentionId === m.id ? m.couleur : 'transparent',
          color: selectedMentionId === m.id ? 'white' : '#64A8CC'
        }"
      >
        <span class="text-xl">{{ m.icone }}</span>
        <span class="text-xs font-black uppercase tracking-widest">{{ m.nom }}</span>
      </button>
    </div>

    <!-- Parcours Tabs -->
    <div class="flex flex-wrap justify-center gap-3">
       <button
         v-for="p in filteredParcours" :key="p.id"
         @click="selectedParcoursId = p.id"
         class="px-6 py-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all duration-300"
         :style="{
            borderColor: selectedParcoursId === p.id ? p.couleur : '#BFDBFE',
            backgroundColor: selectedParcoursId === p.id ? `${p.couleur}10` : 'white',
            color: selectedParcoursId === p.id ? p.couleur : '#64A8CC'
         }"
       >
          [{{ p.code }}] {{ p.nomCourt }}
       </button>
    </div>

    <!-- Timeline Cursus -->
    <div v-if="currentParcours" class="max-w-4xl mx-auto space-y-12 relative pb-20">
       <!-- Vertical Line -->
       <div class="absolute left-[39px] top-10 bottom-20 w-0.5 bg-gradient-to-b from-[#38BDF8] via-[#BFDBFE] to-transparent"></div>

       <div v-for="lvl in levels" :key="lvl" class="space-y-12 relative">
          <!-- Level Header -->
          <div class="flex items-center gap-6 relative z-10">
             <div
               class="w-20 h-20 rounded-[2.5rem] flex items-center justify-center text-2xl font-black text-white shadow-lg"
               :style="{ backgroundColor: currentParcours.couleur }"
             >
                {{ lvl }}
             </div>
             <div>
                <h3 class="text-xl font-black text-[#0C2340]">Niveau {{ lvl }}</h3>
                <p class="text-xs font-bold text-[#64A8CC]">{{ currentParcours.nom }}</p>
             </div>
          </div>

          <!-- Semesters -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 pl-24">
             <div v-for="s in (lvl === 'L1' ? ['S1','S2'] : lvl === 'L2' ? ['S3','S4'] : lvl === 'L3' ? ['S5','S6'] : lvl === 'M1' ? ['S7','S8'] : ['S9','S10'])" :key="s" class="space-y-6">
                <div class="flex items-center justify-between border-b border-[#BFDBFE] pb-3">
                   <h4 class="text-sm font-black text-[#1E5F8E] uppercase tracking-widest">Semestre {{ s }}</h4>
                   <span class="px-3 py-1 bg-[#F0F9FF] text-[#38BDF8] rounded-full text-[10px] font-black">
                      {{ getMatieresBySemestre(s).reduce((acc, m) => acc + m.credits, 0) }} ECTS
                   </span>
                </div>

                <div class="space-y-3">
                   <div
                     v-for="m in getMatieresBySemestre(s)" :key="m.id"
                     class="p-4 bg-white border border-[#BFDBFE] rounded-2xl flex items-center gap-4 hover:border-[#38BDF8] hover:shadow-md transition-all cursor-pointer group"
                   >
                      <div class="w-10 h-10 rounded-xl flex items-center justify-center text-[10px] font-black group-hover:bg-[#38BDF8] group-hover:text-white transition-all" :style="{ backgroundColor: `${m.couleur}15`, color: m.couleur }">
                         {{ m.credits }}
                      </div>
                      <div class="flex-1 min-w-0">
                         <p class="text-[11px] font-black text-[#0C2340] truncate">{{ m.nom }}</p>
                         <p class="text-[9px] font-bold text-[#64A8CC] uppercase">{{ m.code }} · {{ m.type.join('/') }}</p>
                      </div>
                      <ChevronRight :size="16" class="text-[#BFDBFE] group-hover:text-[#38BDF8]" />
                   </div>

                   <div v-if="getMatieresBySemestre(s).length === 0" class="py-10 text-center border-2 border-dashed border-[#F0F7FF] rounded-2xl">
                      <p class="text-[10px] font-bold text-[#BFDBFE] uppercase">Aucune matière assignée</p>
                   </div>
                </div>

                <!-- MFE Marker for final semester -->
                <div v-if="(currentParcours.niveau === 'Master' && s === 'S10') || (currentParcours.niveau === 'Licence' && s === 'S6')" class="mt-4 p-5 bg-gradient-to-r from-[#F0F9FF] to-white border-2 border-dashed border-[#38BDF8]/30 rounded-2xl flex items-center gap-4">
                   <div class="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm text-[#38BDF8]"><GraduationCap :size="20" /></div>
                   <div>
                      <p class="text-[11px] font-black text-[#0C2340]">Mémoire de Fin d'Études (MFE)</p>
                      <p class="text-[9px] font-bold text-[#64A8CC] uppercase">Stage & Soutenance · 10 ECTS</p>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>
  </div>
</template>
