<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';
import CalendrierNiveau from './CalendrierNiveau.vue';

const props = defineProps({
  semaine: Number
});

const store = useEmploiStore();

const allNiveaux = ['L1', 'L2', 'L3', 'M1', 'M2'];
const levelColors = {
  L1: '#3B82F6',
  L2: '#8B5CF6',
  L3: '#10B981',
  M1: '#F59E0B',
  M2: '#EC4899'
};

const activeSection = ref('L1');

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activeSection.value = entry.target.id.replace('section-', '');
      }
    });
  }, {
    threshold: 0.3,
    rootMargin: '-10% 0px -70% 0px'
  });

  allNiveaux.forEach(niv => {
    const el = document.getElementById(`section-${niv}`);
    if (el) observer.observe(el);
  });
});

const scrollToLevel = (niv) => {
  const el = document.getElementById(`section-${niv}`);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    store.niveauActif = niv;
  }
};

const enseignantsUniques = computed(() => {
  const seen = new Set();
  return store.emplois
    .filter(e => e.semaine === store.numeroSemaine)
    .map(e => e.enseignant)
    .filter(e => {
      if (seen.has(e.id)) return false;
      seen.add(e.id);
      return true;
    })
    .sort((a, b) => a.nom.localeCompare(b.nom));
});

const sallesUniques = computed(() => {
  const seen = new Set();
  return store.emplois
    .filter(e => e.semaine === store.numeroSemaine)
    .map(e => e.salle)
    .filter(s => {
      if (seen.has(s.id)) return false;
      seen.add(s.id);
      return true;
    })
    .sort((a, b) => a.nom.localeCompare(b.nom));
});

const handleExportAll = async () => {
  exporting.value = true;
  exportProgress.value = 0;

  for (let i = 0; i < store.niveauxVisibles.length; i++) {
    exportProgress.value = Math.round(((i) / store.niveauxVisibles.length) * 100);
    await new Promise(r => setTimeout(r, 800)); // Simulation capture
  }

  exportProgress.value = 100;
  setTimeout(() => {
    exporting.value = false;
    alert(`EDT_TousNiveaux_Semaine${store.numeroSemaine}_2025-2026.pdf généré avec succès`);
  }, 500);
};

const exporting = ref(false);
const exportProgress = ref(0);
</script>

<template>
  <div class="relative min-h-screen bg-gray-100 pb-32">
    <!-- Export Overlay -->
    <div v-if="exporting" class="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
      <div class="bg-white p-8 rounded-[32px] shadow-2xl max-w-md w-full text-center">
        <div class="w-20 h-20 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-6 text-3xl animate-bounce">
          <i class="fas fa-file-pdf"></i>
        </div>
        <h3 class="text-xl font-black text-slate-900 mb-2">Génération du PDF multi-pages</h3>
        <p class="text-slate-500 text-sm mb-6 font-bold uppercase tracking-widest">Veuillez patienter pendant la capture des {{ store.niveauxVisibles.length }} niveaux...</p>

        <div class="w-full bg-slate-100 h-4 rounded-full overflow-hidden mb-2">
          <div
            class="h-full bg-blue-600 transition-all duration-300"
            :style="{ width: exportProgress + '%' }"
          ></div>
        </div>
        <p class="text-[10px] font-black text-blue-600 uppercase">{{ exportProgress }}% complété</p>
      </div>
    </div>
    <!-- Sticky Control Bar -->
    <div class="sticky top-[144px] z-[50] bg-[#0F172A] text-white p-4 shadow-xl border-b border-slate-700 flex items-center justify-between">
      <div class="flex items-center gap-6">
        <div class="text-center px-4 border-r border-slate-700">
          <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Période actuelle</p>
          <p class="text-xs font-bold">Semaine {{ store.numeroSemaine }} — du {{ store.dateDebutSemaine.split('202')[0] }} au {{ store.dateFinSemaine }}</p>
        </div>

        <div class="flex gap-2 items-center">
          <button
            v-for="niv in allNiveaux"
            :key="niv"
            @click="store.toggleNiveauVisible(niv)"
            class="px-4 py-1.5 rounded-full text-[11px] font-black transition-all border-2"
            :style="{
              borderColor: levelColors[niv],
              backgroundColor: store.niveauxVisibles.includes(niv) ? levelColors[niv] : 'transparent',
              color: store.niveauxVisibles.includes(niv) ? 'white' : levelColors[niv]
            }"
          >
            {{ niv }}
          </button>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <!-- Dropdown Enseignant -->
        <select
          v-model="store.filtreRapideEnseignant"
          class="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-[11px] font-bold text-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="tous">👨‍🏫 Tous les enseignants</option>
          <option v-for="e in enseignantsUniques" :key="e.id" :value="e.id">
            {{ e.civilité }} {{ e.nom }}
          </option>
        </select>

        <!-- Dropdown Salle -->
        <select
          v-model="store.filtreRapideSalle"
          class="bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-[11px] font-bold text-white outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="toutes">🏫 Toutes les salles</option>
          <option v-for="s in sallesUniques" :key="s.id" :value="s.id">
            Salle {{ s.nom }}
          </option>
        </select>

        <button
          v-if="store.filtreRapideEnseignant !== 'tous' || store.filtreRapideSalle !== 'toutes'"
          @click="store.filtreRapideEnseignant = 'tous'; store.filtreRapideSalle = 'toutes'"
          class="text-slate-400 hover:text-red-400 transition-colors"
          title="Réinitialiser les filtres"
        >
          <span class="text-lg">✕</span>
        </button>

        <div class="h-8 w-[1px] bg-slate-700 mx-2"></div>

        <div class="flex flex-col items-end mr-2">
           <span class="text-[10px] text-slate-400 font-bold uppercase">{{ store.niveauxVisibles.length }} / 5 affichés</span>
           <button
             @click="handleExportAll"
             class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-[11px] font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
           >
             📤 Exporter tout en PDF
           </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-[1300px] mx-auto pt-16 px-4 space-y-24">
      <template v-for="(niv, index) in allNiveaux" :key="niv">
        <transition
          appear
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-10"
          enter-to-class="opacity-100 translate-y-0"
          :style="{ transitionDelay: (index * 120) + 'ms' }"
        >
          <div
            v-if="store.niveauxVisibles.includes(niv)"
            class="scroll-mt-[260px]"
          >
            <!-- Section Header -->
            <div class="flex items-center gap-6 mb-10">
              <div class="h-[1px] flex-1" :style="{ backgroundColor: levelColors[niv] }"></div>
              <h3
                class="text-[18px] font-bold uppercase tracking-[0.2em]"
                :style="{ color: levelColors[niv] }"
              >
                ── NIVEAU {{ niv }} ──
              </h3>
              <div class="h-[1px] flex-1" :style="{ backgroundColor: levelColors[niv] }"></div>
            </div>

            <CalendrierNiveau
              :niveau="niv"
              :emplois="store.getEmploisSemaineTousNiveaux[niv]"
              :semaine="store.numeroSemaine"
              :highlight-teacher="store.filtreRapideEnseignant"
              :highlight-room="store.filtreRapideSalle"
            />
          </div>
        </transition>
      </template>
    </div>

    <!-- Floating Level Nav -->
    <div class="fixed right-6 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-[100]">
      <button
        v-for="niv in allNiveaux"
        :key="niv"
        @click="scrollToLevel(niv)"
        class="w-11 h-11 rounded-full border-2 font-bold transition-all duration-200 flex items-center justify-center shadow-xl group relative"
        :style="{
          borderColor: levelColors[niv],
          backgroundColor: activeSection === niv ? levelColors[niv] : 'white',
          color: activeSection === niv ? 'white' : levelColors[niv],
          boxShadow: activeSection === niv ? '0 0 0 3px white, 0 0 10px rgba(0,0,0,0.2)' : '0 4px 6px rgba(0,0,0,0.1)',
          opacity: store.niveauxVisibles.includes(niv) ? 1 : 0.4,
          transform: activeSection === niv ? 'scale(1.1)' : 'scale(1)'
        }"
      >
        <span class="text-[11px]">{{ niv }}</span>

        <!-- Tooltip on hover -->
        <span class="absolute right-14 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Aller au niveau {{ niv }}
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
@media (max-width: 768px) {
  /* Accordion mode could be implemented here if needed */
}

/* Specific transitions for visibility toggle */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
  max-height: 2000px;
  overflow: hidden;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-20px);
}
</style>
