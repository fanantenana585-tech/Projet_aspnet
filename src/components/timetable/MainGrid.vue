<script setup>
import { ref, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useProfessorsStore } from '@/stores/professors'
import { useExceptionsStore } from '@/stores/exceptions'

const props = defineProps({
  promotion: String,
  semaine: Number,
  selectedProfId: Number
})

const coursesStore = useCoursesStore()
const professorsStore = useProfessorsStore()
const exceptionsStore = useExceptionsStore()

const selection = ref([]) // {day, hour}

const getCourseAt = (day, hour) => {
  return coursesStore.getCourseAt(day, hour, props.promotion, props.semaine, props.selectedProfId)
}

const isSelected = (day, hour) => selection.value.some(s => s.day === day && s.hour === hour)

const toggleCell = (day, hour) => {
  if (getCourseAt(day, hour)) return
  const index = selection.value.findIndex(s => s.day === day && s.hour === hour)
  if (index === -1) {
    selection.value.push({ day, hour })
  } else {
    selection.value.splice(index, 1)
  }
}

const clearSelection = () => selection.value = []

const isWeekBlocked = (day) => {
  if (!props.selectedProfId) return false
  return exceptionsStore.isWeekBlocked(props.selectedProfId, props.semaine)
}
</script>

<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Header Controls -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="px-4 py-2 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
          <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="text-xs font-bold text-emerald-800 uppercase tracking-widest">{{ selection.length }} Créneaux sélectionnés</span>
        </div>
        <button v-if="selection.length > 0" @click="clearSelection" class="text-xs font-bold text-red-400 hover:text-red-600 transition-colors uppercase tracking-widest">Effacer</button>
      </div>

      <div class="flex items-center gap-2 text-[#0C2340] text-xs font-bold uppercase tracking-widest">
        <i class="fas fa-info-circle text-blue-400"></i>
        <span>Cliquez sur une cellule vide pour définir une disponibilité temporaire</span>
      </div>
    </div>

    <!-- The Grid -->
    <div class="flex-1 overflow-auto bg-white rounded-[2.5rem] shadow-xl border border-gray-100">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-[#0D1B3E] text-white">
            <th class="p-5 border-b border-white/10 w-32 font-poppins text-xs uppercase tracking-[0.2em]">Heures</th>
            <th v-for="j in coursesStore.jours" :key="j" class="p-5 border-b border-white/10 font-poppins font-bold text-sm min-w-[160px]">
              <div class="flex flex-col items-center gap-1">
                <span>{{ j }}</span>
                <span v-if="isWeekBlocked(j)" class="bg-[#F39C12] text-[9px] px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Bloquée</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Matin Bloc -->
          <tr v-for="h in coursesStore.matin" :key="h">
            <td class="p-4 border-b border-r border-gray-50 bg-gray-50/50 text-center">
              <div class="flex flex-col items-center">
                <i class="fas fa-sun text-orange-400 text-[10px] mb-1"></i>
                <span class="text-xs font-bold text-[#0D1B3E]">{{ h }}h – {{ h+1 }}h</span>
              </div>
            </td>
            <td v-for="j in coursesStore.jours" :key="j"
                class="p-1.5 border-b border-r border-gray-50 h-24 relative transition-all"
                :class="getCourseAt(j, h) ? '' : 'cursor-pointer hover:bg-blue-50/30'"
                @click="toggleCell(j, h)">

              <!-- Occupied Cell -->
              <div v-if="getCourseAt(j, h)"
                   class="h-full w-full rounded-2xl p-4 flex flex-col justify-between shadow-sm border-l-4"
                   :style="{ backgroundColor: '#F7F9FC', borderLeftColor: coursesStore.departements[getCourseAt(j, h).departement] || '#0D1B3E' }">
                <div>
                  <div class="flex justify-between items-start mb-1">
                    <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                          :style="{ backgroundColor: (coursesStore.departements[getCourseAt(j, h).departement] || '#0D1B3E') + '15', color: coursesStore.departements[getCourseAt(j, h).departement] || '#0D1B3E' }">
                      {{ getCourseAt(j, h).departement }}
                    </span>
                    <span class="text-[9px] font-bold text-[#0C2340]">{{ getCourseAt(j, h).promotion }}</span>
                  </div>
                  <p class="text-xs font-poppins font-bold text-[#0D1B3E] leading-tight">{{ getCourseAt(j, h).nom }}</p>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-[10px] font-bold text-[#1D9E75]">{{ professorsStore.getProfessorById(getCourseAt(j, h).profId).nom }}</p>
                  <p class="text-[10px] font-bold text-blue-400 bg-blue-50 px-2 py-0.5 rounded-lg">{{ getCourseAt(j, h).salle }}</p>
                </div>
              </div>

              <!-- Selection Mode -->
              <div v-else-if="isSelected(j, h)" class="h-full w-full bg-emerald-50 border-2 border-[#1D9E75] rounded-2xl flex items-center justify-center text-[#1D9E75]">
                 <i class="fas fa-check-circle text-lg"></i>
              </div>

              <!-- Blocked Cell Info -->
              <div v-else-if="isWeekBlocked(j)" class="absolute inset-0 bg-[#F39C12]/5 flex items-center justify-center pointer-events-none">
                 <span class="text-[9px] font-black uppercase text-[#F39C12]/40 tracking-widest -rotate-12">Indisponible</span>
              </div>
            </td>
          </tr>

          <!-- Separation Meridienne -->
          <tr class="h-12 bg-gray-50/50">
             <td class="border-b border-gray-100"></td>
             <td :colspan="6" class="p-2 border-b border-gray-100 text-center">
                <div class="flex items-center justify-center gap-4 text-[10px] font-black text-[#0C2340] uppercase tracking-[0.5em]">
                   <div class="h-px w-20 bg-gray-200"></div>
                   <span>Pause Méridienne</span>
                   <div class="h-px w-20 bg-gray-200"></div>
                </div>
             </td>
          </tr>

          <!-- Soir Bloc -->
          <tr v-for="h in coursesStore.soir" :key="h">
            <td class="p-4 border-b border-r border-gray-50 bg-gray-50/50 text-center">
              <div class="flex flex-col items-center">
                <i class="fas fa-moon text-indigo-400 text-[10px] mb-1"></i>
                <span class="text-xs font-bold text-[#0D1B3E]">{{ h }}h – {{ h+1 }}h</span>
              </div>
            </td>
            <td v-for="j in coursesStore.jours" :key="j"
                class="p-1.5 border-b border-r border-gray-50 h-24 relative transition-all"
                @click="toggleCell(j, h)">
              <!-- Same content as morning for occupied/selected -->
              <div v-if="getCourseAt(j, h)"
                   class="h-full w-full rounded-2xl p-4 flex flex-col justify-between shadow-sm border-l-4"
                   :style="{ backgroundColor: '#F7F9FC', borderLeftColor: coursesStore.departements[getCourseAt(j, h).departement] || '#0D1B3E' }">
                <div>
                  <div class="flex justify-between items-start mb-1">
                    <span class="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md"
                          :style="{ backgroundColor: (coursesStore.departements[getCourseAt(j, h).departement] || '#0D1B3E') + '15', color: coursesStore.departements[getCourseAt(j, h).departement] || '#0D1B3E' }">
                      {{ getCourseAt(j, h).departement }}
                    </span>
                    <span class="text-[9px] font-bold text-[#0C2340]">{{ getCourseAt(j, h).promotion }}</span>
                  </div>
                  <p class="text-xs font-poppins font-bold text-[#0D1B3E] leading-tight">{{ getCourseAt(j, h).nom }}</p>
                </div>
                <div class="flex items-center justify-between mt-2">
                  <p class="text-[10px] font-bold text-[#1D9E75]">{{ professorsStore.getProfessorById(getCourseAt(j, h).profId).nom }}</p>
                  <p class="text-[10px] font-bold text-blue-400 bg-blue-50 px-2 py-0.5 rounded-lg">{{ getCourseAt(j, h).salle }}</p>
                </div>
              </div>
              <div v-else-if="isSelected(j, h)" class="h-full w-full bg-emerald-50 border-2 border-[#1D9E75] rounded-2xl flex items-center justify-center text-[#1D9E75]">
                 <i class="fas fa-check-circle text-lg"></i>
              </div>
              <div v-else-if="isWeekBlocked(j)" class="absolute inset-0 bg-[#F39C12]/5 flex items-center justify-center pointer-events-none">
                 <span class="text-[9px] font-black uppercase text-[#F39C12]/40 tracking-widest -rotate-12">Indisponible</span>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
