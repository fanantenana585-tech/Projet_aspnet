<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/timetable/Sidebar.vue'
import MainGrid from '@/components/timetable/MainGrid.vue'
import AvailabilityModal from '@/components/modals/AvailabilityModal.vue'
import AddCourseDrawer from '@/components/timetable/AddCourseDrawer.vue'
import ExceptionsView from '@/views/ExceptionsView.vue'

const currentView = ref('grid') // 'grid' or 'exceptions'
const selectedPromotion = ref('L1')
const currentSemaine = ref(1)
const selectedProfId = ref(null)

const isAvailabilityModalOpen = ref(false)
const isAddCourseOpen = ref(false)

const promotions = ['L1', 'L2', 'L3', 'M1', 'M2']

const changeSemaine = (val) => {
  const next = currentSemaine.value + val
  if (next >= 1 && next <= 15) currentSemaine.value = next
}
</script>

<template>
  <div class="flex h-screen bg-[#F7F9FC] font-inter overflow-hidden">
    <!-- Sidebar -->
    <Sidebar
      :current-semaine="currentSemaine"
      :selected-prof-id="selectedProfId"
      @select-prof="(id) => selectedProfId = id"
      @open-availability="isAvailabilityModalOpen = true"
    />

    <!-- Main Content -->
    <main class="flex-1 flex flex-col h-full overflow-hidden">
      <!-- Navbar -->
      <nav class="bg-white border-b border-gray-100 px-10 py-5 flex items-center justify-between shadow-sm z-50">
        <div class="flex items-center gap-10">
          <div class="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100 shadow-inner">
             <button @click="currentView = 'grid'"
                     class="px-8 py-3 rounded-xl text-xs font-bold transition-all"
                     :class="currentView === 'grid' ? 'bg-[#0D1B3E] text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'">
               Grille hebdomadaire
             </button>
             <button @click="currentView = 'exceptions'"
                     class="px-8 py-3 rounded-xl text-xs font-bold transition-all"
                     :class="currentView === 'exceptions' ? 'bg-[#0D1B3E] text-white shadow-xl' : 'text-gray-400 hover:text-gray-600'">
               Semaines bloquées
             </button>
          </div>

          <div v-if="currentView === 'grid'" class="flex items-center gap-3">
             <button @click="changeSemaine(-1)" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#0D1B3E] transition-all flex items-center justify-center"><i class="fas fa-chevron-left"></i></button>
             <div class="bg-white px-6 py-2.5 rounded-xl border border-gray-100 font-bold text-[#0D1B3E] shadow-sm min-w-[140px] text-center">
                Semaine {{ currentSemaine }}
             </div>
             <button @click="changeSemaine(1)" class="w-10 h-10 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-[#0D1B3E] transition-all flex items-center justify-center"><i class="fas fa-chevron-right"></i></button>
          </div>
        </div>

        <div class="flex items-center gap-4">
           <div v-if="currentView === 'grid'" class="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
             <button v-for="p in promotions" :key="p"
                     @click="selectedPromotion = p"
                     class="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                     :class="selectedPromotion === p ? 'bg-white text-[#0D1B3E] shadow-md' : 'text-gray-400 hover:text-gray-600'">
               {{ p }}
             </button>
           </div>

           <button @click="isAddCourseOpen = true" class="bg-[#1D9E75] text-white px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-emerald-900/10 hover:brightness-110 active:scale-95 transition-all flex items-center gap-3">
              <i class="fas fa-plus-circle"></i> Ajouter cours
           </button>
        </div>
      </nav>

      <!-- View Area -->
      <div class="flex-1 p-10 overflow-hidden flex flex-col">
        <Transition name="fade" mode="out-in">
          <div v-if="currentView === 'grid'" key="grid" class="flex-1 flex flex-col min-h-0">
             <div class="mb-10 animate-in fade-in slide-in-from-left-4">
                <h1 class="text-4xl font-poppins font-black text-[#0D1B3E] tracking-tight">Emploi du Temps <span class="text-[#1D9E75]">EMIT</span></h1>
                <p class="text-gray-400 font-medium mt-1">Gestion académique de la promotion {{ selectedPromotion }}</p>
             </div>
             <MainGrid
               :promotion="selectedPromotion"
               :semaine="currentSemaine"
               :selected-prof-id="selectedProfId"
             />
          </div>
          <div v-else key="exceptions" class="flex-1 flex flex-col min-h-0 overflow-y-auto">
             <ExceptionsView />
          </div>
        </Transition>
      </div>
    </main>

    <!-- Modals & Drawers -->
    <AvailabilityModal
      :is-open="isAvailabilityModalOpen"
      :current-semaine="currentSemaine"
      @close="isAvailabilityModalOpen = false"
    />
    <AddCourseDrawer
      :is-open="isAddCourseOpen"
      :current-semaine="currentSemaine"
      :current-promotion="selectedPromotion"
      @close="isAddCourseOpen = false"
    />
  </div>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Poppins:wght@600;700;800;900&display=swap');

.font-inter { font-family: 'Inter', sans-serif; }
.font-poppins { font-family: 'Poppins', sans-serif; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-in { animation-duration: 0.5s; animation-fill-mode: both; }
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes slide-in-from-left-4 { from { transform: translateX(-1rem); } to { transform: translateX(0); } }

.fade-in { animation-name: fade-in; }
.slide-in-from-left-4 { animation-name: slide-in-from-left-4; }
</style>
