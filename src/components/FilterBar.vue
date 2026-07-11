<script setup>
import { computed } from 'vue'
import { useAcademicStore } from '@/stores/academic'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const props = defineProps({
  filters: Object,
  currentWeek: Number
})

const emit = defineEmits(['updateFilters', 'updateWeek'])

const academicStore = useAcademicStore()

const paths = computed(() => {
  if (!props.filters.mentionId || !props.filters.level) return []
  return academicStore.getPaths(props.filters.mentionId, props.filters.level)
})

const handleMentionChange = (id) => {
  emit('updateFilters', { ...props.filters, mentionId: id, path: '' })
}

const handleLevelChange = (lvl) => {
  emit('updateFilters', { ...props.filters, level: lvl, path: '' })
}
</script>

<template>
  <div class="bg-white border-b border-gray-200 p-4 flex flex-wrap items-center gap-4">
    <!-- Mention -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-bold text-gray-500 uppercase">Mention</label>
      <select
        :value="filters.mentionId"
        @change="handleMentionChange($event.target.value)"
        class="bg-[#F7F9FC] border-none rounded-md px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-[#1D9E75]"
      >
        <option value="">Toutes les mentions</option>
        <option v-for="m in academicStore.mentions" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
    </div>

    <!-- Niveau -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-bold text-gray-500 uppercase">Niveau</label>
      <select
        :value="filters.level"
        @change="handleLevelChange($event.target.value)"
        class="bg-[#F7F9FC] border-none rounded-md px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-[#1D9E75]"
      >
        <option value="">Tous les niveaux</option>
        <option v-for="l in ['L1', 'L2', 'L3', 'M1', 'M2']" :key="l" :value="l">{{ l }}</option>
      </select>
    </div>

    <!-- Parcours -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-bold text-gray-500 uppercase">Parcours</label>
      <select
        :value="filters.path"
        @change="emit('updateFilters', { ...filters, path: $event.target.value })"
        :disabled="!filters.mentionId || !filters.level"
        class="bg-[#F7F9FC] border-none rounded-md px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-[#1D9E75] disabled:opacity-50"
      >
        <option value="">Tous les parcours</option>
        <option v-for="p in paths" :key="p" :value="p">{{ p }}</option>
      </select>
    </div>

    <!-- Semestre -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-bold text-gray-500 uppercase">Semestre</label>
      <select
        :value="filters.semester"
        @change="emit('updateFilters', { ...filters, semester: $event.target.value })"
        class="bg-[#F7F9FC] border-none rounded-md px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-[#1D9E75]"
      >
        <option v-for="s in academicStore.semesters" :key="s" :value="s">{{ s }}</option>
      </select>
    </div>

    <!-- Week Navigation -->
    <div class="ml-auto flex items-center gap-3">
      <button @click="emit('updateWeek', currentWeek - 1)" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronLeft :size="20" />
      </button>
      <div class="text-center min-w-[100px]">
        <span class="text-xs font-bold text-gray-500 uppercase block leading-tight">Semaine</span>
        <span class="text-lg font-title font-bold text-[#0D1B3E]">{{ currentWeek }}</span>
      </div>
      <button @click="emit('updateWeek', currentWeek + 1)" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <ChevronRight :size="20" />
      </button>
    </div>
  </div>
</template>
