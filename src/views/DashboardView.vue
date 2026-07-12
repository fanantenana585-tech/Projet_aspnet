<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMatiereStore } from '../stores/matiereStore'
import { useEnseignantStore } from '../stores/enseignantStore'
import { useSalleStore } from '../stores/salleStore'
import { useEmploiStore } from '../stores/emploiStore'
import StatCard from '../components/StatCard.vue'
import { Clock, MapPin, User, GraduationCap, ChevronRight, Activity, Calendar as CalendarIcon, BookOpen, Users, Building2 } from 'lucide-vue-next'

const matiereStore = useMatiereStore()
const enseignantStore = useEnseignantStore()
const salleStore = useSalleStore()
const emploiStore = useEmploiStore()

const isLoading = ref(true)

onMounted(async () => {
  await Promise.all([
    matiereStore.fetchMatieres(),
    enseignantStore.fetchEnseignants(),
    salleStore.fetchSalles(),
    emploiStore.fetchEmplois()
  ])
  isLoading.value = false
})

const statsData = computed(() => [
  { label: 'Matières', value: matiereStore.matieres.length, icon: BookOpen, color: '#38BDF8', trend: '+2 cette semaine' },
  { label: 'Enseignants', value: enseignantStore.enseignants.length, icon: Users, color: '#059669', trend: 'Actifs' },
  { label: 'Salles', value: salleStore.salles.length, icon: Building2, color: '#F59E0B', trend: `${salleStore.stats.disponible} libres` },
  { label: 'Cours aujourd\'hui', value: emploiStore.emplois.length, icon: Clock, color: '#EC4899', trend: 'Planning' }
])

const getStatusClass = (status) => {
  switch (status) {
    case 'En cours': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'À venir': return 'bg-blue-100 text-blue-700 border-blue-200'
    default: return 'bg-gray-100 text-gray-700'
  }
}
</script>

<template>
  <div class="max-w-[1600px] mx-auto space-y-10 pb-20">

    <!-- SECTION 1: Header -->
    <header class="flex flex-col md:flex-row md:items-center justify-between gap-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div>
        <div class="flex items-center gap-4 mb-3">
          <h1 class="text-4xl font-black text-[#0C2340] tracking-tight">
            Bonjour, <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9]">Administrateur</span> 👋
          </h1>
        </div>
        <div class="flex items-center gap-4 text-[#1E5F8E]">
          <div class="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-[#BFDBFE] shadow-sm">
            <CalendarIcon :size="14" class="text-[#38BDF8]" />
            <p class="text-[10px] font-black uppercase tracking-widest">
              {{ new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
          </div>
          <div class="flex items-center gap-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span class="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Système opérationnel</span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <button class="bg-white hover:bg-[#F0F9FF] text-[#1E5F8E] px-6 py-3 rounded-2xl border border-[#BFDBFE] transition-all flex items-center gap-3 text-xs font-black uppercase tracking-widest shadow-sm">
          <Activity :size="18" class="text-[#38BDF8]" />
          Rapports
        </button>
        <button @click="emploiStore.ouvrirModal()" class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] hover:brightness-110 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-[#38BDF8]/20 text-xs">
          Nouveau Cours
        </button>
      </div>
    </header>

    <!-- SECTION 2: StatCards -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150">
      <StatCard
        v-for="(stat, index) in statsData"
        :key="index"
        v-bind="stat"
      />
    </section>

    <!-- SECTION 4: Today's Schedule -->
    <section class="animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
      <div class="flex items-center justify-between mb-8 px-2">
        <div class="flex items-center gap-4">
          <div class="p-3 bg-[#38BDF8] text-white rounded-2xl shadow-lg shadow-[#38BDF8]/20">
            <Clock :size="24" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-[#0C2340] tracking-tight">Séances Aujourd'hui</h2>
            <p class="text-xs text-[#64A8CC] font-bold uppercase tracking-widest mt-0.5">Planning temps réel</p>
          </div>
        </div>
        <router-link to="/emplois-du-temps" class="text-xs font-black uppercase tracking-widest text-[#1E5F8E] hover:text-[#38BDF8] flex items-center gap-2 transition-colors group">
          Emploi du temps complet <ChevronRight :size="18" class="group-hover:translate-x-1 transition-transform" />
        </router-link>
      </div>

      <div v-if="emploiStore.emplois.length === 0" class="bg-white p-12 rounded-[2.5rem] border border-[#BFDBFE] text-center">
         <p class="text-[#64A8CC] font-bold uppercase tracking-widest text-xs">Aucun cours prévu pour aujourd'hui</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-6 overflow-x-auto pb-6 custom-scrollbar">
        <div
          v-for="course in emploiStore.emplois"
          :key="course.id"
          class="bg-white p-6 rounded-[2rem] border border-[#BFDBFE] shadow-xl hover:shadow-[0_20px_50px_rgba(14,165,233,0.1)] hover:border-[#38BDF8] transition-all flex flex-col justify-between min-w-[300px] relative overflow-hidden group"
        >
          <!-- Decoration -->
          <div class="absolute top-0 right-0 w-24 h-24 bg-[#F0F9FF] rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-110"></div>

          <div class="flex justify-between items-start mb-6 relative z-10">
            <span class="text-[10px] font-black text-[#38BDF8] bg-[#F0F9FF] px-3 py-1.5 rounded-xl border border-[#BFDBFE] uppercase tracking-widest">{{ course.heureDebut }}</span>
            <span :class="['text-[9px] font-black px-3 py-1.5 rounded-xl border uppercase tracking-widest', getStatusClass('À venir')]">
              À venir
            </span>
          </div>

          <h3 class="text-xl font-black text-[#0C2340] mb-6 line-clamp-1 relative z-10">{{ course.matiere.nom }}</h3>

          <div class="space-y-4 relative z-10">
            <div class="flex items-center gap-3 text-sm text-[#1E5F8E]">
              <div class="w-8 h-8 rounded-lg bg-[#F8FBFF] flex items-center justify-center text-[#64A8CC] border border-[#F0F7FF]">
                <User :size="14" />
              </div>
              <span class="font-bold truncate">{{ course.enseignant.nom }}</span>
            </div>
            <div class="flex items-center gap-3 text-sm text-[#1E5F8E]">
              <div class="w-8 h-8 rounded-lg bg-[#F8FBFF] flex items-center justify-center text-[#64A8CC] border border-[#F0F7FF]">
                <MapPin :size="14" />
              </div>
              <span class="font-bold">{{ course.salle.nom }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.delay-150 { animation-delay: 150ms; }
.delay-300 { animation-delay: 300ms; }
.delay-500 { animation-delay: 500ms; }

.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #F0F7FF;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #BFDBFE;
  border-radius: 10px;
}
</style>
