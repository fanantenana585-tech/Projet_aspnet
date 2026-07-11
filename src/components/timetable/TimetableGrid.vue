<script setup>
import { ref, computed } from 'vue'
import { useCoursesStore } from '@/stores/courses'
import { useProfessorsStore } from '@/stores/professors'
import { useExceptionsStore } from '@/stores/exceptions'

const props = defineProps({
  promotion: String,
  semaine: Number,
  mode: { type: String, default: 'view' }, // 'view', 'availability', 'add_course'
  activeProfId: Number
})

const emit = defineEmits(['selection-change'])

const coursesStore = useCoursesStore()
const professorsStore = useProfessorsStore()
const exceptionsStore = useExceptionsStore()

const selectedCells = ref([]) // {jour, heure}

const getCourseAt = (jour, heure) => {
  return coursesStore.getCourseAt(jour, heure, props.promotion, props.semaine)
}

const getProfessorExceptionAt = (jour, heure) => {
  // If we are looking at a specific prof's availability or adding a course for them
  if (props.activeProfId) {
    return exceptionsStore.getExceptionForProfessor(props.activeProfId, props.semaine)
  }

  // In view mode, we check if the course at this slot is blocked (by its assigned prof)
  const course = getCourseAt(jour, heure)
  if (course) {
    return exceptionsStore.getExceptionForProfessor(course.professeurId, props.semaine)
  }
  return null
}

const isCellSelected = (jour, heure) => {
  return selectedCells.value.some(c => c.jour === jour && c.heure === heure)
}

const handleCellClick = (jour, heure) => {
  if (getCourseAt(jour, heure)) return // Already occupied

  if (props.mode === 'availability' && props.activeProfId) {
    professorsStore.updateDisponibilite(props.activeProfId, jour, heure)
    return
  }

  if (props.mode === 'add_course') {
    // Can only select if professor is available and not occupied and not blocked
    if (!professorsStore.isProfessorAvailable(props.activeProfId, jour, heure)) return
    if (coursesStore.isProfessorOccupied(props.activeProfId, jour, heure, props.semaine)) return
    if (exceptionsStore.isProfessorBlocked(props.activeProfId, props.semaine)) return

    const index = selectedCells.value.findIndex(c => c.jour === jour && c.heure === heure)
    if (index === -1) {
      selectedCells.value.push({ jour, heure })
    } else {
      selectedCells.value.splice(index, 1)
    }
    emit('selection-change', selectedCells.value)
  }
}

const getCellClass = (jour, heure) => {
  const course = getCourseAt(jour, heure)
  const exception = getProfessorExceptionAt(jour, heure)

  if (exception) return 'bg-orange-striped text-orange-800'
  if (course) return 'bg-[#0D1B3E] text-white'

  if (props.mode === 'availability' && props.activeProfId) {
    if (professorsStore.isProfessorAvailable(props.activeProfId, jour, heure)) {
      return 'bg-[#2ECC71] text-white'
    }
  }

  if (props.mode === 'add_course' && props.activeProfId) {
    if (isCellSelected(jour, heure)) return 'ring-4 ring-[#3498DB] ring-inset animate-pulse-blue bg-emerald-100'
    if (professorsStore.isProfessorAvailable(props.activeProfId, jour, heure)) {
      if (coursesStore.isProfessorOccupied(props.activeProfId, jour, heure, props.semaine)) return 'bg-gray-200 cursor-not-allowed opacity-50'
      return 'bg-emerald-50 cursor-pointer hover:bg-emerald-100'
    }
    return 'bg-gray-100 cursor-not-allowed'
  }

  return 'bg-white hover:bg-blue-50 cursor-pointer'
}

const formatHour = (h) => `${h.toString().padStart(2, '0')}h–${(h+1).toString().padStart(2, '0')}h`

const resetSelection = () => {
  selectedCells.value = []
}

defineExpose({ resetSelection })
</script>

<template>
  <div class="overflow-x-auto bg-white rounded-3xl shadow-xl border border-gray-100 select-none">
    <table class="w-full border-collapse">
      <thead>
        <tr>
          <th class="p-6 border-b border-r border-gray-50 bg-gray-50/50 w-40"></th>
          <th v-for="jour in coursesStore.jours" :key="jour"
              class="p-5 border-b border-r border-gray-100 bg-[#0D1B3E] text-white font-poppins font-bold text-sm tracking-wide">
            {{ jour }}
          </th>
        </tr>
      </thead>
      <tbody>
        <!-- Matin -->
        <tr v-for="h in coursesStore.matin" :key="h">
          <td class="p-4 border-b border-r border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-400 text-center">
            <span class="block text-[#0D1B3E]">{{ formatHour(h) }}</span>
          </td>
          <td v-for="jour in coursesStore.jours" :key="jour"
              class="p-1 border-b border-r border-gray-100 h-20 min-w-[160px] relative transition-all duration-200"
              :class="getCellClass(jour, h)"
              @click="handleCellClick(jour, h)">

            <!-- Contenu de la cellule -->
            <div class="h-full w-full flex flex-col items-center justify-center text-center p-2">

              <!-- Cas: Semaine Bloquée -->
              <template v-if="getProfessorExceptionAt(jour, h)">
                <i class="fas fa-lock text-orange-600 mb-1"></i>
                <span class="text-[9px] font-black uppercase tracking-tighter">Bloqué</span>
                <div class="absolute inset-0 z-50 group">
                   <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-[#0D1B3E] text-white p-3 rounded-xl text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-2xl">
                      <p class="font-bold border-b border-white/10 pb-2 mb-2">Semaine bloquée pour ce professeur</p>
                      <p class="opacity-80">{{ getProfessorExceptionAt(jour, h).raison }}</p>
                   </div>
                </div>
              </template>

              <!-- Cas: Cours Placé -->
              <template v-else-if="getCourseAt(jour, h)">
                <div class="flex flex-col h-full w-full justify-between">
                   <span class="text-[11px] font-poppins font-bold leading-tight">{{ getCourseAt(jour, h).nom }}</span>
                   <div class="space-y-1">
                      <p class="text-[9px] opacity-80 font-medium">{{ professorsStore.getProfessorById(getCourseAt(jour, h).professeurId).nom }}</p>
                      <span class="inline-block px-2 py-0.5 bg-white/10 rounded text-[9px] font-bold">{{ getCourseAt(jour, h).salle }}</span>
                   </div>
                </div>
              </template>

              <!-- Cas: Disponibilité (Mode Select) -->
              <template v-else-if="mode === 'availability' && props.activeProfId && professorsStore.isProfessorAvailable(props.activeProfId, jour, h)">
                <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2ECC71] shadow-sm">
                   <i class="fas fa-check"></i>
                </div>
              </template>

              <!-- Cas: Sélection en cours (Mode Add) -->
              <template v-else-if="isCellSelected(jour, h)">
                <div class="w-8 h-8 rounded-full bg-[#3498DB] flex items-center justify-center text-white shadow-lg">
                   <i class="fas fa-plus"></i>
                </div>
              </template>
            </div>
          </td>
        </tr>

        <!-- Pause Méridienne -->
        <tr class="bg-gray-100/80">
          <td class="p-3 border-b border-r border-gray-200 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">
            Midi
          </td>
          <td :colspan="6" class="p-3 border-b border-gray-200 text-center text-[11px] font-bold text-gray-500 uppercase tracking-[0.5em] italic">
            — Pause Méridienne —
          </td>
        </tr>

        <!-- Après-Midi -->
        <tr v-for="h in coursesStore.apresMidi" :key="h">
          <td class="p-4 border-b border-r border-gray-50 bg-gray-50/30 text-xs font-bold text-gray-400 text-center">
            <span class="block text-[#0D1B3E]">{{ formatHour(h) }}</span>
          </td>
          <td v-for="jour in coursesStore.jours" :key="jour"
              class="p-1 border-b border-r border-gray-100 h-20 min-w-[160px] relative transition-all duration-200"
              :class="getCellClass(jour, h)"
              @click="handleCellClick(jour, h)">

            <div class="h-full w-full flex flex-col items-center justify-center text-center p-2">
              <template v-if="getProfessorExceptionAt(jour, h)">
                <i class="fas fa-lock text-orange-600 mb-1"></i>
                <span class="text-[9px] font-black uppercase tracking-tighter">Bloqué</span>
              </template>

              <template v-else-if="getCourseAt(jour, h)">
                <div class="flex flex-col h-full w-full justify-between">
                   <span class="text-[11px] font-poppins font-bold leading-tight">{{ getCourseAt(jour, h).nom }}</span>
                   <div class="space-y-1">
                      <p class="text-[9px] opacity-80 font-medium">{{ professorsStore.getProfessorById(getCourseAt(jour, h).professeurId).nom }}</p>
                      <span class="inline-block px-2 py-0.5 bg-white/10 rounded text-[9px] font-bold">{{ getCourseAt(jour, h).salle }}</span>
                   </div>
                </div>
              </template>

              <template v-else-if="mode === 'availability' && props.activeProfId && professorsStore.isProfessorAvailable(props.activeProfId, jour, h)">
                <div class="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2ECC71] shadow-sm">
                   <i class="fas fa-check"></i>
                </div>
              </template>

              <template v-else-if="isCellSelected(jour, h)">
                <div class="w-8 h-8 rounded-full bg-[#3498DB] flex items-center justify-center text-white shadow-lg">
                   <i class="fas fa-plus"></i>
                </div>
              </template>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.bg-orange-striped {
  background-color: #fef9f3;
  background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(243, 156, 18, 0.1) 10px, rgba(243, 156, 18, 0.1) 20px);
  border: 1px dashed #f39c12 !important;
}

@keyframes pulse-blue {
  0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
  100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
}

.animate-pulse-blue {
  animation: pulse-blue 2s infinite;
}
</style>
