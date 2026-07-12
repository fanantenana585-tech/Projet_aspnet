<script setup>
import { ref, computed } from 'vue'
import { useExceptionsStore } from '@/stores/exceptions'
import { useProfessorsStore } from '@/stores/professors'
import { AlertTriangle, Trash2, Plus, Calendar, ShieldAlert } from 'lucide-vue-next'

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

const handleDelete = (id) => {
  const index = exceptionsStore.exceptions.findIndex(e => e.id === id)
  if (index !== -1) exceptionsStore.exceptions.splice(index, 1)
}
</script>

<template>
  <div class="flex-1 overflow-y-auto bg-[#0C2340] p-8 custom-scrollbar">
    <div class="max-w-[1400px] mx-auto animate-in fade-in duration-500">
      
      <!-- Header -->
      <header class="mb-12">
        <div class="flex items-center gap-6">
          <div class="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-red-500/20">
            <ShieldAlert :size="32" />
          </div>
          <div>
            <h1 class="text-3xl font-black text-white tracking-tight">Gestion des Exceptions</h1>
            <p class="text-[11px] font-black uppercase tracking-[0.2em] text-[#64A8CC] mt-1">Gérez les indisponibilités</p>
          </div>
        </div>
      </header>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Form -->
        <div class="lg:col-span-1">
          <div class="bg-[#1E293B] rounded-[2rem] border border-gray-800 p-8 shadow-2xl sticky top-8">
            <h2 class="text-xl font-black text-white mb-6 flex items-center gap-3">
              <Plus :size="20" class="text-emerald-400" />
              Bloquer une semaine
            </h2>

            <div class="space-y-6">
              <div class="space-y-2">
                <label class="text-xs font-black text-white uppercase tracking-widest ml-1">Professeur</label>
                <select v-model="newException.professorId" class="w-full bg-white border border-gray-300 text-black font-bold rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 appearance-none">
                  <option :value="null">Choisir un professeur</option>
                  <option v-for="p in professorsStore.professors" :key="p.id" :value="p.id">{{ p.nom }} {{ p.prenom }}</option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-white uppercase tracking-widest ml-1">Numéro de semaine</label>
                <input v-model.number="newException.week" type="number" min="1" max="52" class="w-full bg-white border border-gray-300 text-black font-bold rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50">
              </div>

              <div class="space-y-2">
                <label class="text-xs font-black text-white uppercase tracking-widest ml-1">Raison (Optionnel)</label>
                <textarea v-model="newException.reason" rows="3" class="w-full bg-white border border-gray-300 text-black font-medium rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 resize-none" placeholder="Ex: Congé maladie, Conférence..."></textarea>
              </div>

              <button @click="handleAddException" class="w-full py-4 mt-4 bg-gradient-to-r from-emerald-400 to-emerald-600 text-white font-black text-xs rounded-2xl shadow-xl hover:-translate-y-0.5 transition-transform uppercase tracking-widest flex items-center justify-center gap-2">
                <Plus :size="18" /> Enregistrer l'exception
              </button>
            </div>
          </div>
        </div>

        <!-- List -->
        <div class="lg:col-span-2">
          <div class="space-y-4">
            <div v-if="exceptionsList.length === 0" class="bg-[#1E293B] p-12 text-center rounded-[2rem] border border-gray-800 shadow-xl flex flex-col items-center justify-center">
               <Calendar :size="48" class="text-gray-600 mb-4" />
               <p class="text-gray-400 font-bold uppercase tracking-widest text-xs">Aucune exception enregistrée.</p>
            </div>

            <div
              v-for="ex in exceptionsList"
              :key="ex.id"
              class="bg-[#1E293B] p-6 rounded-3xl shadow-xl border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-orange-500/30 transition-colors"
            >
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20">
                  <AlertTriangle :size="24" />
                </div>
                <div>
                  <h3 class="font-black text-white text-lg">{{ ex.professor?.nom }} {{ ex.professor?.prenom }}</h3>
                  <div class="flex items-center gap-3 mt-1.5">
                    <span class="px-3 py-1 bg-orange-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest">Semaine {{ ex.week }}</span>
                    <span class="text-sm text-gray-400 font-medium" v-if="ex.reason">{{ ex.reason }}</span>
                  </div>
                </div>
              </div>

              <button @click="handleDelete(ex.id)" class="p-3 bg-gray-800/50 text-gray-400 rounded-xl hover:text-red-400 hover:bg-red-500/10 transition-colors sm:opacity-0 group-hover:opacity-100 self-end sm:self-auto">
                <Trash2 :size="20" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 8px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 20px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
</style>
