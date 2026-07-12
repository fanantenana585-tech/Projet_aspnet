<script setup>
import { computed, ref } from 'vue'
import { useAcademicStore } from '@/stores/academic'
import { Sun, Moon, Trash2, Check } from 'lucide-vue-next'

const props = defineProps({
  courses: Array,
  selectedCells: Array,
  blockedWeek: Boolean,
  selectedProfessor: Object
})

const emit = defineEmits(['toggleCell', 'clearSelection'])

const academicStore = useAcademicStore()

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const morningHours = [7, 8, 9, 10, 11]
const eveningHours = [14, 15, 16, 17]

const getCourseAt = (day, hour) => {
  return props.courses.find(c => c.day === day && c.hour === hour)
}

const isCellSelected = (day, hour) => {
  return props.selectedCells.some(cell => cell.day === day && cell.hour === hour)
}

const getMentionColor = (mentionId) => {
  const mention = academicStore.getMentionById(mentionId)
  return mention ? mention.color : '#gray-400'
}

const getMentionShort = (mentionId) => {
  const mention = academicStore.getMentionById(mentionId)
  return mention ? mention.shortName : ''
}
</script>

<template>
  <div class="flex-1 overflow-auto bg-[#F7F9FC] p-6">
    <!-- Header with selection info -->
    <div v-if="selectedCells.length > 0" class="mb-4 flex items-center justify-between bg-[#1D9E75]/10 border border-[#1D9E75] p-3 rounded-lg">
      <div class="flex items-center gap-2 text-[#1D9E75] font-bold">
        <span>{{ selectedCells.length }} créneau(x) sélectionné(s)</span>
      </div>
      <button @click="emit('clearSelection')" class="flex items-center gap-1 text-xs font-bold uppercase hover:underline text-[#E53E3E]">
        <Trash2 :size="14" /> Effacer
      </button>
    </div>

    <div class="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden min-w-[1000px]">
      <div class="grid grid-cols-[80px_repeat(6,1fr)]">
        <!-- Day Headers -->
        <div class="bg-[#0D1B3E] h-12"></div>
        <div
          v-for="day in days"
          :key="day"
          class="bg-[#0D1B3E] text-white flex flex-col items-center justify-center border-l border-white/10"
        >
          <span class="font-bold text-sm">{{ day }}</span>
          <div v-if="blockedWeek" class="bg-[#ED8936] text-[10px] px-1.5 rounded uppercase mt-0.5">Bloquée</div>
        </div>

        <!-- Morning Section -->
        <template v-for="hour in morningHours" :key="`morning-${hour}`">
          <div class="h-24 border-t border-gray-100 flex items-center justify-center gap-1 bg-gray-50/50">
            <Sun :size="14" class="text-orange-400" />
            <span class="font-bold text-gray-700 text-sm">{{ hour }}h</span>
          </div>
          <div
            v-for="day in days"
            :key="`${day}-${hour}`"
            @click="emit('toggleCell', { day, hour })"
            :class="[
              'h-24 border-t border-l border-gray-100 relative group transition-all duration-200',
              isCellSelected(day, hour) ? 'bg-[#1D9E75]/10 !border-[#1D9E75] z-10' : 'hover:bg-gray-50',
              blockedWeek ? 'bg-orange-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
          >
            <!-- Course Card -->
            <div v-if="getCourseAt(day, hour)" class="absolute inset-1 p-2 bg-white rounded-md shadow-sm border-l-4 overflow-hidden flex flex-col justify-between"
                 :style="{ borderLeftColor: getMentionColor(getCourseAt(day, hour).mentionId) }">
              <div class="leading-tight">
                <p class="font-bold text-[11px] text-[#0D1B3E] truncate">{{ getCourseAt(day, hour).name }}</p>
                <p class="text-[10px] text-[#1D9E75] font-medium truncate">{{ getCourseAt(day, hour).professorName }}</p>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-[9px] text-blue-500 font-bold">{{ getCourseAt(day, hour).room }}</span>
                <span
                  class="px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white uppercase"
                  :style="{ backgroundColor: getMentionColor(getCourseAt(day, hour).mentionId) }"
                >
                  {{ getCourseAt(day, hour).path }} — {{ getCourseAt(day, hour).level }}
                </span>
              </div>
            </div>

            <div v-else-if="blockedWeek" class="absolute inset-0 flex items-center justify-center">
               <span class="text-[10px] text-orange-400 font-bold uppercase italic opacity-50">Indisponible</span>
            </div>

            <!-- Selection Checkmark -->
            <div v-if="isCellSelected(day, hour)" class="absolute top-1 right-1 bg-[#1D9E75] text-white rounded-full p-0.5 shadow-sm">
              <Check :size="10" />
            </div>
          </div>
        </template>

        <!-- Noon Break -->
        <div class="h-8 bg-gray-100/50 border-y-2 border-gray-200 flex items-center justify-center col-span-full">
           <span class="text-[10px] font-bold text-[#0C2340] uppercase tracking-widest">Pause Déjeuner — 12h00 à 14h00</span>
        </div>

        <!-- Evening Section -->
        <template v-for="hour in eveningHours" :key="`evening-${hour}`">
          <div class="h-24 border-t border-gray-100 flex items-center justify-center gap-1 bg-gray-50/50">
            <Moon :size="14" class="text-indigo-400" />
            <span class="font-bold text-gray-700 text-sm">{{ hour }}h</span>
          </div>
          <div
            v-for="day in days"
            :key="`${day}-${hour}`"
            @click="emit('toggleCell', { day, hour })"
            :class="[
              'h-24 border-t border-l border-gray-100 relative group transition-all duration-200',
              isCellSelected(day, hour) ? 'bg-[#1D9E75]/10 !border-[#1D9E75] z-10' : 'hover:bg-gray-50',
              blockedWeek ? 'bg-orange-50 cursor-not-allowed' : 'cursor-pointer'
            ]"
          >
            <!-- Course Card -->
            <div v-if="getCourseAt(day, hour)" class="absolute inset-1 p-2 bg-white rounded-md shadow-sm border-l-4 overflow-hidden flex flex-col justify-between"
                 :style="{ borderLeftColor: getMentionColor(getCourseAt(day, hour).mentionId) }">
              <div class="leading-tight">
                <p class="font-bold text-[11px] text-[#0D1B3E] truncate">{{ getCourseAt(day, hour).name }}</p>
                <p class="text-[10px] text-[#1D9E75] font-medium truncate">{{ getCourseAt(day, hour).professorName }}</p>
              </div>
              <div class="flex items-center justify-between mt-1">
                <span class="text-[9px] text-blue-500 font-bold">{{ getCourseAt(day, hour).room }}</span>
                <span
                  class="px-1.5 py-0.5 rounded-full text-[8px] font-bold text-white uppercase"
                  :style="{ backgroundColor: getMentionColor(getCourseAt(day, hour).mentionId) }"
                >
                  {{ getCourseAt(day, hour).path }} — {{ getCourseAt(day, hour).level }}
                </span>
              </div>
            </div>

             <div v-else-if="blockedWeek" class="absolute inset-0 flex items-center justify-center">
               <span class="text-[10px] text-orange-400 font-bold uppercase italic opacity-50">Indisponible</span>
            </div>

            <div v-if="isCellSelected(day, hour)" class="absolute top-1 right-1 bg-[#1D9E75] text-white rounded-full p-0.5 shadow-sm">
              <Check :size="10" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
