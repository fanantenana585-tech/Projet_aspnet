<script setup>
import { ref, computed } from 'vue'
import { useProfessorsStore } from '@/stores/professors'
import { useExceptionsStore } from '@/stores/exceptions'
import { X, Check, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  currentWeek: Number
})

const emit = defineEmits(['close'])

const professorsStore = useProfessorsStore()
const exceptionsStore = useExceptionsStore()

const selectedProfId = ref(professorsStore.professors[0]?.id)
const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const morningHours = [7, 8, 9, 10, 11]
const eveningHours = [14, 15, 16, 17]

const isWeekBlocked = computed(() => {
  return exceptionsStore.isWeekBlocked(selectedProfId.value, props.currentWeek)
})

const isAvailable = (day, hour) => {
  return professorsStore.isProfAvailable(selectedProfId.value, props.currentWeek, day, hour)
}

const toggleAvailability = (day, hour) => {
  if (isWeekBlocked.value) return
  professorsStore.updateAvailability(selectedProfId.value, props.currentWeek, day, hour)
}

const handleConfirm = () => {
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[110] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-md" @click="emit('close')"></div>

    <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100 flex items-center justify-between">
        <h2 class="font-title font-bold text-xl text-[#0D1B3E]">Saisie des disponibilités</h2>
        <button @click="emit('close')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X :size="24" />
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto p-8">
        <!-- Prof Selection -->
        <div class="flex items-center gap-4 mb-8">
          <label class="font-bold text-[#0D1B3E]">Professeur :</label>
          <select v-model="selectedProfId" class="border-gray-200 rounded-lg bg-[#F7F9FC] focus:ring-[#1D9E75] focus:border-[#1D9E75] font-medium">
            <option v-for="p in professorsStore.professors" :key="p.id" :value="p.id">{{ p.nom }} {{ p.prenom }}</option>
          </select>
        </div>

        <!-- Warning if blocked -->
        <div v-if="isWeekBlocked" class="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 flex items-start gap-3">
          <AlertCircle class="text-orange-500 shrink-0" :size="20" />
          <div>
            <p class="font-bold text-orange-800">Semaine bloquée</p>
            <p class="text-sm text-orange-700">Toutes les cellules sont verrouillées car cette semaine est marquée comme "bloquée" pour ce professeur.</p>
          </div>
        </div>

        <!-- Availability Grid -->
        <div class="grid grid-cols-[60px_repeat(6,1fr)] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
          <div class="bg-white h-10 border-b border-gray-200"></div>
          <div v-for="d in days" :key="d" class="bg-white h-10 border-b border-l border-gray-200 flex items-center justify-center font-bold text-xs uppercase text-gray-700">
            {{ d }}
          </div>

          <!-- Morning -->
          <template v-for="h in morningHours" :key="`h-${h}`">
            <div class="bg-white border-b border-gray-200 flex items-center justify-center font-bold text-xs text-[#0C2340]">{{ h }}h</div>
            <div
              v-for="d in days"
              :key="`${d}-${h}`"
              @click="toggleAvailability(d, h)"
              :class="[
                'h-12 border-b border-l border-gray-200 flex items-center justify-center transition-all',
                isWeekBlocked ? 'bg-orange-100 cursor-not-allowed' : 'cursor-pointer',
                isAvailable(d, h) ? 'bg-[#1D9E75] text-white' : (isWeekBlocked ? '' : 'bg-white hover:bg-gray-100')
              ]"
            >
              <Check v-if="isAvailable(d, h)" :size="20" />
            </div>
          </template>

          <!-- Break -->
          <div class="col-span-full h-4 bg-gray-200/50 border-b border-gray-200"></div>

          <!-- Evening -->
          <template v-for="h in eveningHours" :key="`he-${h}`">
            <div class="bg-white border-b border-gray-200 flex items-center justify-center font-bold text-xs text-[#0C2340]">{{ h }}h</div>
            <div
              v-for="d in days"
              :key="`${d}-${h}`"
              @click="toggleAvailability(d, h)"
              :class="[
                'h-12 border-b border-l border-gray-200 flex items-center justify-center transition-all',
                isWeekBlocked ? 'bg-orange-100 cursor-not-allowed' : 'cursor-pointer',
                isAvailable(d, h) ? 'bg-[#1D9E75] text-white' : (isWeekBlocked ? '' : 'bg-white hover:bg-gray-100')
              ]"
            >
              <Check v-if="isAvailable(d, h)" :size="20" />
            </div>
          </template>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 flex justify-end bg-gray-50">
        <button @click="handleConfirm" class="btn btn-primary px-8">
          Confirmer
        </button>
      </div>
    </div>
  </div>
</template>
