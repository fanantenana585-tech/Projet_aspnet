<script setup>
import { ref } from 'vue'
import { useProfessorsStore } from '@/stores/professors'
import { useExceptionsStore } from '@/stores/exceptions'

const professorsStore = useProfessorsStore()
const exceptionsStore = useExceptionsStore()

const newException = ref({
  professeurId: null,
  semaines: [],
  raison: '',
  type: 'Semaine bloquée'
})

// Generate weeks 1 to 52
const weeks = Array.from({ length: 52 }, (_, i) => i + 1)

const toggleWeek = (w) => {
  const index = newException.value.semaines.indexOf(w)
  if (index === -1) {
    if (newException.value.semaines.length >= 2) {
      alert("Vous ne pouvez bloquer que 2 semaines consécutives au maximum.")
      return
    }
    newException.value.semaines.push(w)
  } else {
    newException.value.semaines.splice(index, 1)
  }
}

const addException = () => {
  if (!newException.value.professeurId || newException.value.semaines.length === 0) {
    alert("Veuillez sélectionner un professeur et au moins une semaine.")
    return
  }

  exceptionsStore.addException({ ...newException.value })
  newException.value = {
    professeurId: null,
    semaines: [],
    raison: '',
    type: 'Semaine bloquée'
  }
  alert("Exception de semaine bloquée enregistrée avec succès.")
}

const getProfessorName = (id) => {
  const p = professorsStore.getProfessorById(id)
  return p ? `${p.prenom} ${p.nom}` : 'Inconnu'
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in">
    <!-- Formulaire de blocage -->
    <div class="lg:col-span-1 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl flex flex-col justify-between">
      <div>
        <div class="flex items-center gap-3 mb-6">
           <div class="w-10 h-10 bg-orange-100 text-[#F39C12] rounded-xl flex items-center justify-center">
              <i class="fas fa-ban text-lg"></i>
           </div>
           <h3 class="text-lg font-poppins font-bold text-[#0D1B3E]">Déclarer un blocage</h3>
        </div>

        <div class="space-y-6">
          <div>
            <label class="block text-[10px] font-black text-[#0C2340] uppercase tracking-widest mb-2 ml-1">Professeur concerné</label>
            <select v-model="newException.professeurId" class="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-[#F39C12] outline-none transition-all font-medium text-sm">
              <option v-for="prof in professorsStore.professors" :key="prof.id" :value="prof.id">
                {{ prof.prenom }} {{ prof.nom }} ({{ prof.specialite }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#0C2340] uppercase tracking-widest mb-2 ml-1">Sélection du calendrier (Max 2 semaines)</label>
            <div class="grid grid-cols-6 gap-1.5 max-h-48 overflow-y-auto p-2 border border-gray-100 rounded-xl bg-gray-50/50">
              <button v-for="w in weeks" :key="w"
                      @click="toggleWeek(w)"
                      class="h-9 rounded-lg text-xs font-bold transition-all border flex items-center justify-center"
                      :class="newException.semaines.includes(w) ? 'bg-[#F39C12] text-white border-[#F39C12] shadow-md' : 'bg-white text-[#0C2340] border-gray-100 hover:border-gray-200'">
                S{{ w }}
              </button>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-black text-[#0C2340] uppercase tracking-widest mb-2 ml-1">Motif de l'absence / Raison</label>
            <textarea v-model="newException.raison" placeholder="Ex: Mission, Congé maladie, Séminaire..." class="w-full px-5 py-4 rounded-xl border border-gray-200 focus:border-[#F39C12] outline-none transition-all h-24 text-sm font-medium"></textarea>
          </div>
        </div>
      </div>

      <button @click="addException" class="w-full py-4 bg-[#F39C12] text-white rounded-xl font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-100 mt-6">
        Enregistrer la semaine bloquée
      </button>
    </div>

    <!-- Liste des exceptions actives -->
    <div class="lg:col-span-2 space-y-4">
      <h3 class="text-lg font-poppins font-bold text-[#0D1B3E] px-2 flex items-center gap-2">
         <span>Indisponibilités et exceptions enregistrées</span>
         <span class="bg-gray-100 text-gray-600 text-xs px-2.5 py-0.5 rounded-full font-sans">{{ exceptionsStore.exceptions.length }}</span>
      </h3>

      <div v-if="exceptionsStore.exceptions.length === 0" class="bg-white p-16 rounded-3xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-[#0C2340]">
        <i class="fas fa-calendar-times text-5xl mb-4 opacity-20"></i>
        <p class="font-medium text-sm">Aucune exception enregistrée pour le moment.</p>
      </div>

      <div v-for="exc in exceptionsStore.exceptions" :key="exc.id"
           class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-6 hover:shadow-md transition-shadow">
        <div class="w-12 h-12 rounded-xl bg-orange-50 text-[#F39C12] flex items-center justify-center text-xl shadow-inner">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="flex-1">
          <p class="font-bold text-[#0D1B3E]">{{ getProfessorName(exc.professeurId) }}</p>
          <p class="text-xs text-gray-700 mt-0.5 font-medium"><i class="far fa-comment-alt mr-1"></i> {{ exc.raison || 'Sans motif spécifié' }}</p>
        </div>
        <div class="flex flex-wrap gap-1.5 max-w-[200px] justify-end">
          <span v-for="w in exc.semaines" :key="w" class="px-3 py-1 bg-orange-100 rounded-lg text-[10px] font-bold text-[#F39C12]">Semaine {{ w }}</span>
        </div>
        <button @click="exceptionsStore.deleteException(exc.id)" class="text-[#0C2340] hover:text-red-500 transition-colors p-2">
          <i class="fas fa-trash-alt"></i>
        </button>
      </div>
    </div>
  </div>
</template>
