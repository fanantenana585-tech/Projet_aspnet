<script setup>
import { ref, computed } from 'vue'
import { useProfessorsStore } from '@/stores/professors'
import { useCoursesStore } from '@/stores/courses'
import { useExceptionsStore } from '@/stores/exceptions'

const props = defineProps({
  isOpen: Boolean,
  currentSemaine: Number
})

const emit = defineEmits(['close'])

const professorsStore = useProfessorsStore()
const coursesStore = useCoursesStore()
const exceptionsStore = useExceptionsStore()

const selectedProfId = ref(1)

const isBlocked = computed(() => {
  return exceptionsStore.isWeekBlocked(selectedProfId.value, props.currentSemaine)
})

const toggleCell = (day, hour) => {
  if (isBlocked.value) return
  professorsStore.updateAvailability(selectedProfId.value, day, hour)
}
</script>

<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-[#0D1B3E]/40 backdrop-blur-md" @click="emit('close')"></div>
      <div class="relative bg-white w-full max-w-4xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]">
        <!-- Header -->
        <div class="p-8 border-b border-gray-100 flex items-center justify-between bg-[#F7F9FC]">
          <div>
            <h2 class="text-2xl font-poppins font-bold text-[#0D1B3E]">Saisie des disponibilités</h2>
            <p class="text-sm text-gray-500 mt-1">Déclarez vos heures de présence pour la semaine {{ currentSemaine }}</p>
          </div>
          <button @click="emit('close')" class="w-12 h-12 rounded-2xl bg-white text-gray-400 hover:text-red-500 transition-colors shadow-sm flex items-center justify-center">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <!-- Filters & Status -->
        <div class="px-8 py-6 bg-white border-b border-gray-100 flex items-center justify-between">
           <div class="flex items-center gap-4">
              <label class="text-xs font-black uppercase text-gray-400 tracking-widest">Enseignant</label>
              <select v-model="selectedProfId" class="bg-gray-50 border-none rounded-xl text-sm font-bold focus:ring-0 px-4 py-2.5 min-w-[200px]">
                <option v-for="p in professorsStore.professors" :key="p.id" :value="p.id">{{ p.prenom }} {{ p.nom }}</option>
              </select>
           </div>

           <div v-if="isBlocked" class="flex items-center gap-3 px-6 py-3 bg-orange-50 rounded-2xl border border-orange-100 animate-pulse">
              <i class="fas fa-exclamation-triangle text-[#E67E22]"></i>
              <span class="text-xs font-bold text-[#E67E22] uppercase tracking-wide">Semaine bloquée pour ce professeur</span>
           </div>
        </div>

        <!-- Grid Container -->
        <div class="flex-1 overflow-y-auto p-8 bg-[#F7F9FC]">
          <div class="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <table class="w-full border-collapse">
              <thead>
                <tr>
                  <th class="p-4 border-b border-r border-gray-50 w-24"></th>
                  <th v-for="j in coursesStore.jours" :key="j" class="p-4 border-b border-r border-gray-50 text-xs font-bold text-[#0D1B3E] uppercase tracking-widest">{{ j }}</th>
                </tr>
              </thead>
              <tbody>
                <!-- Matin -->
                <tr v-for="h in coursesStore.matin" :key="h">
                  <td class="p-4 border-b border-r border-gray-50 text-center font-bold text-[#0D1B3E] text-xs">
                    <i class="fas fa-sun text-orange-400 mr-2 opacity-50"></i>{{ h }}h–{{ h+1 }}h
                  </td>
                  <td v-for="j in coursesStore.jours" :key="j"
                      @click="toggleCell(j, h)"
                      class="p-1 border-b border-r border-gray-50 h-14 relative transition-all"
                      :class="[
                        isBlocked ? 'bg-orange-50/50 cursor-not-allowed' : 'cursor-pointer hover:bg-emerald-50/30',
                        professorsStore.isProfAvailable(selectedProfId, j, h) ? 'bg-emerald-50' : ''
                      ]">
                    <div v-if="isBlocked" class="absolute inset-0 flex items-center justify-center opacity-10">
                       <span class="text-[8px] font-black uppercase -rotate-45">Bloqué</span>
                    </div>
                    <div v-else-if="professorsStore.isProfAvailable(selectedProfId, j, h)" class="w-full h-full rounded-lg border-2 border-[#1D9E75] flex items-center justify-center text-[#1D9E75]">
                       <i class="fas fa-check text-xs"></i>
                    </div>
                  </td>
                </tr>

                <!-- Séparateur invisible (Lunch) -->
                <tr class="h-4 bg-gray-50">
                  <td :colspan="7"></td>
                </tr>

                <!-- Soir -->
                <tr v-for="h in coursesStore.soir" :key="h">
                  <td class="p-4 border-b border-r border-gray-50 text-center font-bold text-[#0D1B3E] text-xs">
                    <i class="fas fa-moon text-indigo-400 mr-2 opacity-50"></i>{{ h }}h–{{ h+1 }}h
                  </td>
                  <td v-for="j in coursesStore.jours" :key="j"
                      @click="toggleCell(j, h)"
                      class="p-1 border-b border-r border-gray-50 h-14 relative transition-all"
                      :class="[
                        isBlocked ? 'bg-orange-50/50 cursor-not-allowed' : 'cursor-pointer hover:bg-emerald-50/30',
                        professorsStore.isProfAvailable(selectedProfId, j, h) ? 'bg-emerald-50' : ''
                      ]">
                    <div v-if="professorsStore.isProfAvailable(selectedProfId, j, h)" class="w-full h-full rounded-lg border-2 border-[#1D9E75] flex items-center justify-center text-[#1D9E75]">
                       <i class="fas fa-check text-xs"></i>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-gray-100 bg-white flex justify-end">
          <button @click="emit('close')" class="bg-[#0D1B3E] text-white px-10 py-4 rounded-2xl font-bold shadow-xl shadow-blue-900/10 hover:scale-105 active:scale-95 transition-all">
            Confirmer et synchroniser
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
