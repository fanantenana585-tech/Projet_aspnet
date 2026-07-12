<script setup>
import { ref, computed } from 'vue'
import { useProfessorsStore } from '@/stores/professors'
import { useCoursesStore } from '@/stores/courses'
import { useExceptionsStore } from '@/stores/exceptions'

const props = defineProps({
  isOpen: Boolean,
  currentSemaine: Number,
  currentPromotion: String
})

const emit = defineEmits(['close'])

const professorsStore = useProfessorsStore()
const coursesStore = useCoursesStore()
const exceptionsStore = useExceptionsStore()

const step = ref(1)
const formData = ref({
  profId: null,
  jour: '',
  heure: null,
  nom: '',
  salle: '',
  departement: 'Informatique'
})

const error = ref('')

const nextStep = () => {
  if (step.value === 1 && formData.value.profId) step.value = 2
}

const selectSlot = (day, hour) => {
  // Conflict checks
  if (coursesStore.isProfBusy(formData.value.profId, day, hour, props.currentSemaine)) {
    error.value = "Le professeur est déjà occupé sur ce créneau."
    return
  }

  formData.value.jour = day
  formData.value.heure = hour
  error.value = ""
  step.value = 3
}

const save = () => {
  if (coursesStore.isRoomBusy(formData.value.salle, formData.value.jour, formData.value.heure, props.currentSemaine)) {
    error.value = "La salle est déjà réservée pour ce créneau."
    return
  }

  coursesStore.addCourse({
    ...formData.value,
    promotion: props.currentPromotion,
    semaine: props.currentSemaine
  })

  emit('close')
  reset()
}

const reset = () => {
  step.value = 1
  formData.value = { profId: null, jour: '', heure: null, nom: '', salle: '', departement: 'Informatique' }
  error.value = ""
}

const isAvailable = (day, hour) => professorsStore.isProfAvailable(formData.value.profId, day, hour)
const isBusy = (day, hour) => coursesStore.isProfBusy(formData.value.profId, day, hour, props.currentSemaine)

</script>

<template>
  <Transition name="slide">
    <div v-if="isOpen" class="fixed inset-0 z-[150] overflow-hidden">
      <div class="absolute inset-0 bg-[#0D1B3E]/30 backdrop-blur-sm" @click="emit('close')"></div>
      <div class="absolute inset-y-0 right-0 max-w-lg w-full bg-white shadow-2xl flex flex-col">
        <!-- Header -->
        <div class="p-8 border-b border-gray-100 flex items-center justify-between bg-[#F7F9FC]">
          <div>
            <h2 class="text-2xl font-poppins font-bold text-[#0D1B3E]">Ajouter un cours</h2>
            <div class="flex items-center gap-2 mt-2">
               <div v-for="i in 3" :key="i" class="h-1.5 rounded-full transition-all"
                    :class="i <= step ? 'bg-[#1D9E75] w-8' : 'bg-gray-200 w-4'"></div>
            </div>
          </div>
          <button @click="emit('close')" class="w-12 h-12 rounded-2xl bg-white text-[#0C2340] hover:text-red-500 shadow-sm flex items-center justify-center">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-8">
          <!-- Step 1: Prof Selection -->
          <div v-if="step === 1" class="space-y-6">
            <h3 class="text-sm font-black text-[#0C2340] uppercase tracking-widest">Étape 1 : Choisir l'enseignant</h3>
            <div class="space-y-3">
               <button v-for="p in professorsStore.professors" :key="p.id"
                       @click="formData.profId = p.id; nextStep()"
                       class="w-full flex items-center p-4 rounded-3xl border-2 transition-all text-left"
                       :class="formData.profId === p.id ? 'border-[#1D9E75] bg-emerald-50' : 'border-gray-50 bg-white hover:border-gray-200'">
                  <div class="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center font-bold text-[#0D1B3E] mr-4 shadow-sm">
                    {{ p.initiales }}
                  </div>
                  <div>
                    <p class="font-bold text-[#0D1B3E]">{{ p.prenom }} {{ p.nom }}</p>
                    <p class="text-[10px] font-black uppercase tracking-widest text-[#0C2340]">{{ p.specialite }}</p>
                  </div>
                  <i v-if="formData.profId === p.id" class="fas fa-check-circle ml-auto text-[#1D9E75] text-xl"></i>
               </button>
            </div>
          </div>

          <!-- Step 2: Slot Selection -->
          <div v-if="step === 2" class="space-y-6">
            <div class="flex items-center justify-between">
               <h3 class="text-sm font-black text-[#0C2340] uppercase tracking-widest">Étape 2 : Créneau horaire</h3>
               <button @click="step = 1" class="text-[10px] font-bold text-[#1D9E75] uppercase underline">Changer prof</button>
            </div>

            <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold animate-shake">
               <i class="fas fa-exclamation-circle mr-2"></i> {{ error }}
            </div>

            <div class="grid grid-cols-1 gap-6">
               <div v-for="day in coursesStore.jours" :key="day" class="space-y-3">
                  <p class="text-[10px] font-black text-[#0D1B3E] uppercase tracking-[0.2em] ml-2">{{ day }}</p>
                  <div class="flex flex-wrap gap-2">
                     <button v-for="h in [...coursesStore.matin, ...coursesStore.soir]" :key="h"
                             @click="selectSlot(day, h)"
                             class="px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2"
                             :class="[
                               isBusy(day, h) ? 'bg-red-50 border-red-100 text-red-400 cursor-not-allowed opacity-50' :
                               isAvailable(day, h) ? 'bg-emerald-50 border-emerald-100 text-[#1D9E75] hover:scale-105' :
                               'bg-gray-50 border-gray-100 text-[#0C2340] opacity-30 cursor-not-allowed'
                             ]">
                        {{ h }}h–{{ h+1 }}h
                        <i v-if="isBusy(day, h)" class="fas fa-times ml-1"></i>
                        <i v-else-if="isAvailable(day, h)" class="fas fa-plus ml-1"></i>
                     </button>
                  </div>
               </div>
            </div>
          </div>

          <!-- Step 3: Course details -->
          <div v-if="step === 3" class="space-y-8">
             <div class="flex items-center justify-between">
                <h3 class="text-sm font-black text-[#0C2340] uppercase tracking-widest">Étape 3 : Informations</h3>
                <button @click="step = 2" class="text-[10px] font-bold text-[#1D9E75] uppercase underline">Changer créneau</button>
             </div>

             <div class="p-6 bg-[#0D1B3E] rounded-3xl text-white shadow-xl shadow-blue-900/20">
                <p class="text-[10px] font-black uppercase opacity-60 tracking-[0.2em] mb-4">Récapitulatif</p>
                <div class="flex items-center gap-4">
                   <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-xl">
                      <i class="fas fa-calendar-check"></i>
                   </div>
                   <div>
                      <p class="text-lg font-bold">{{ formData.jour }} à {{ formData.heure }}h</p>
                      <p class="text-xs opacity-70">Enseignant : {{ professorsStore.getProfessorById(formData.profId).nom }}</p>
                   </div>
                </div>
             </div>

             <div class="space-y-5">
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-[#0C2340] uppercase tracking-widest ml-4">Nom du module</label>
                   <input v-model="formData.nom" type="text" placeholder="ex: Algèbre de Boole" class="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1D9E75] font-bold text-[#0D1B3E]" />
                </div>
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-[#0C2340] uppercase tracking-widest ml-4">Salle attribuée</label>
                   <input v-model="formData.salle" type="text" placeholder="ex: A101" class="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1D9E75] font-bold text-[#0D1B3E]" />
                </div>
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-[#0C2340] uppercase tracking-widest ml-4">Département</label>
                   <select v-model="formData.departement" class="w-full px-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-[#1D9E75] font-bold text-[#0D1B3E] appearance-none">
                      <option v-for="(color, name) in coursesStore.departements" :key="name" :value="name">{{ name }}</option>
                   </select>
                </div>
             </div>

             <div v-if="error" class="p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-xs font-bold">
                {{ error }}
             </div>
          </div>
        </div>

        <!-- Footer -->
        <div v-if="step === 3" class="p-8 border-t border-gray-100 bg-white">
           <button @click="save" :disabled="!formData.nom || !formData.salle" class="w-full py-5 bg-[#1D9E75] text-white rounded-3xl font-bold shadow-xl shadow-emerald-900/10 hover:brightness-110 disabled:opacity-30 transition-all">
              Enregistrer le cours
           </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active { transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
.animate-shake { animation: shake 0.3s ease-in-out; }
</style>
