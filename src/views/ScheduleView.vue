<script setup>
import { ref, computed } from 'vue'
import ProfessorSidebar from '@/components/ProfessorSidebar.vue'
import FilterBar from '@/components/FilterBar.vue'
import ScheduleGrid from '@/components/ScheduleGrid.vue'
import AddCoursePanel from '@/components/AddCoursePanel.vue'
import AvailabilityModal from '@/components/AvailabilityModal.vue'

import { useCoursesStore } from '@/stores/courses'
import { useProfessorsStore } from '@/stores/professors'
import { useExceptionsStore } from '@/stores/exceptions'
import { Plus } from 'lucide-vue-next'

const coursesStore = useCoursesStore()
const professorsStore = useProfessorsStore()
const exceptionsStore = useExceptionsStore()

const currentWeek = ref(1)
const selectedProfessorId = ref(null)
const selectedCells = ref([])
const isAddPanelOpen = ref(false)
const isAvailabilityModalOpen = ref(false)

const filters = ref({
  mentionId: '',
  level: '',
  path: '',
  semester: 'Semestre 1'
})

const filteredCourses = computed(() => {
  const allCourses = coursesStore.courses.filter(c => c.week === currentWeek.value)

  return allCourses.filter(course => {
    if (filters.value.mentionId && course.mentionId !== filters.value.mentionId) return false
    if (filters.value.level && course.level !== filters.value.level) return false
    if (filters.value.path && course.path !== filters.value.path) return false
    if (selectedProfessorId.value && course.professorId !== selectedProfessorId.value) return false
    if (filters.value.semester && course.semester !== filters.value.semester) return false
    return true
  }).map(c => ({
    ...c,
    professorName: professorsStore.getProfessorById(c.professorId)?.nom || 'Inconnu'
  }))
})

const isBlocked = computed(() => {
  if (!selectedProfessorId.value) return false
  return exceptionsStore.isWeekBlocked(selectedProfessorId.value, currentWeek.value)
})

const handleSelectProfessor = (id) => {
  selectedProfessorId.value = selectedProfessorId.value === id ? null : id
}

const handleToggleCell = ({ day, hour }) => {
  if (isBlocked.value) return

  const index = selectedCells.value.findIndex(c => c.day === day && c.hour === hour)
  if (index === -1) {
    selectedCells.value.push({ day, hour })
  } else {
    selectedCells.value.splice(index, 1)
  }
}

const clearSelection = () => {
  selectedCells.value = []
}

const updateFilters = (newFilters) => {
  filters.value = newFilters
}

const updateWeek = (week) => {
  if (week < 1) return
  currentWeek.value = week
  selectedCells.value = []
}
</script>

<template>
  <div class="flex h-[calc(100vh-180px)] bg-white rounded-2xl shadow-xl overflow-hidden border border-[#BFDBFE]">
    <!-- Sidebar -->
    <ProfessorSidebar
      :selectedProfessorId="selectedProfessorId"
      :currentWeek="currentWeek"
      @selectProfessor="handleSelectProfessor"
      @openAvailability="isAvailabilityModalOpen = true"
    />

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <FilterBar
        :filters="filters"
        :currentWeek="currentWeek"
        @updateFilters="updateFilters"
        @updateWeek="updateWeek"
      />

      <ScheduleGrid
        :courses="filteredCourses"
        :selectedCells="selectedCells"
        :blockedWeek="isBlocked"
        @toggleCell="handleToggleCell"
        @clearSelection="clearSelection"
      />

      <!-- Floating Action Button -->
      <button
        @click="isAddPanelOpen = true"
        class="fixed bottom-8 right-8 w-14 h-14 bg-[#1D9E75] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus :size="32" />
      </button>
    </div>

    <!-- Modals & Panels -->
    <AddCoursePanel
      :isOpen="isAddPanelOpen"
      :currentWeek="currentWeek"
      @close="isAddPanelOpen = false"
    />

    <AvailabilityModal
      :isOpen="isAvailabilityModalOpen"
      :currentWeek="currentWeek"
      @close="isAvailabilityModalOpen = false"
    />
  </div>
</template>
