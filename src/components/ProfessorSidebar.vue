<script setup>
import { computed } from 'vue'
import { useProfessorsStore } from '@/stores/professors'
import { useExceptionsStore } from '@/stores/exceptions'
import { CalendarPlus } from 'lucide-vue-next'

const props = defineProps({
  selectedProfessorId: Number,
  currentWeek: Number
})

const emit = defineEmits(['selectProfessor', 'openAvailability'])

const professorsStore = useProfessorsStore()
const exceptionsStore = useExceptionsStore()

const professors = computed(() => professorsStore.professors)

const isAvailable = (profId) => {
  return !exceptionsStore.isWeekBlocked(profId, props.currentWeek)
}
</script>

<template>
  <aside class="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
    <div class="p-4 border-b border-gray-100 flex items-center justify-between">
      <h2 class="font-title font-bold text-[#0D1B3E]">Professeurs</h2>
      <button
        @click="emit('openAvailability')"
        class="p-2 bg-[#1D9E75] text-white rounded-full hover:bg-[#15805d] transition-colors shadow-md"
        title="Saisir les disponibilités"
      >
        <CalendarPlus :size="20" />
      </button>
    </div>

    <div class="flex-1 overflow-y-auto p-2">
      <div
        v-for="prof in professors"
        :key="prof.id"
        @click="emit('selectProfessor', prof.id)"
        :class="[
          'flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 mb-1',
          selectedProfessorId === prof.id ? 'bg-[#F7F9FC] border-l-4 border-[#1D9E75]' : 'hover:bg-gray-50 border-l-4 border-transparent'
        ]"
      >
        <div class="relative">
          <div class="w-10 h-10 rounded-full bg-[#0D1B3E] text-white flex items-center justify-center font-bold text-sm">
            {{ prof.initiales }}
          </div>
          <div
            :class="[
              'absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white',
              isAvailable(prof.id) ? 'bg-[#1D9E75]' : 'bg-[#E53E3E]'
            ]"
          ></div>
        </div>

        <div class="flex-1 min-w-0">
          <p class="font-bold text-sm text-[#0D1B3E] truncate">{{ prof.nom }} {{ prof.prenom }}</p>
          <p class="text-xs text-gray-700 truncate">{{ prof.specialite }}</p>
        </div>
      </div>
    </div>
  </aside>
</template>
