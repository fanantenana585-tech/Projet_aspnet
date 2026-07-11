<script setup>
import { ref, computed } from 'vue'
import { useExceptionsStore } from '@/stores/exceptions'
import { useProfessorsStore } from '@/stores/professors'
import { AlertTriangle, Trash2, Plus, Calendar } from 'lucide-vue-next'

const exceptionsStore = useExceptionsStore()
const professorsStore = useProfessorsStore()

const newException = ref({
  professorId: null,
  week: 1,
  reason: ''
})

const exceptionsList = computed(() => {
  return exceptionsStore.exceptions.map(e => ({
    ...e,
    professor: professorsStore.getProfessorById(e.professorId)
  }))
})

const handleAddException = () => {
  if (!newException.value.professorId || !newException.value.week) return

  exceptionsStore.addException({ ...newException.value })
  newException.value = { professorId: null, week: 1, reason: '' }
}
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-[#F7F9FC] p-8">
    <div class="max-w-4xl mx-auto">
      <header class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-[#0D1B3E]">Gestion des Exceptions</h1>
          <p class="text-gray-500">Gérez les semaines bloquées et les indisponibilités exceptionnelles des professeurs.</p>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Form -->
        <div class="md:col-span-1">
          <div class="card bg-white shadow-sm border border-gray-200 sticky top-8">
            <h2 class="font-bold text-[#0D1B3E] mb-4 flex items-center gap-2">
              <Plus :size="18" class="text-[#1D9E75]" />
              Bloquer une semaine
            </h2>

            <div class="space-y-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Professeur</label>
                <select v-model="newException.professorId" class="w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-[#1D9E75] focus:border-[#1D9E75]">
                  <option :value="null">Choisir un professeur</option>
                  <option v-for="p in professorsStore.professors" :key="p.id" :value="p.id">{{ p.nom }} {{ p.prenom }}</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Numéro de semaine</label>
                <input v-model.number="newException.week" type="number" min="1" class="w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-[#1D9E75] focus:border-[#1D9E75]">
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Raison (Optionnel)</label>
                <textarea v-model="newException.reason" rows="3" class="w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-[#1D9E75] focus:border-[#1D9E75]" placeholder="Ex: Congé maladie, Conférence..."></textarea>
              </div>

              <button @click="handleAddException" class="w-full btn btn-primary mt-2">
                Enregistrer l'exception
              </button>
            </div>
          </div>
        </div>

        <!-- List -->
        <div class="md:col-span-2">
          <div class="space-y-4">
            <div v-if="exceptionsList.length === 0" class="bg-white p-12 text-center rounded-xl border border-dashed border-gray-300">
               <Calendar :size="48" class="mx-auto text-gray-300 mb-4" />
               <p class="text-gray-500 font-medium">Aucune exception enregistrée pour le moment.</p>
            </div>

            <div
              v-for="ex in exceptionsList"
              :key="ex.id"
              class="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-orange-200 transition-colors"
            >
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                  <AlertTriangle :size="24" />
                </div>
                <div>
                  <h3 class="font-bold text-[#0D1B3E]">{{ ex.professor?.nom }} {{ ex.professor?.prenom }}</h3>
                  <div class="flex items-center gap-2 mt-0.5">
                    <span class="badge bg-orange-500 text-white">Semaine {{ ex.week }}</span>
                    <span class="text-sm text-gray-500 italic" v-if="ex.reason">— {{ ex.reason }}</span>
                  </div>
                </div>
              </div>

              <button class="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                <Trash2 :size="18" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
