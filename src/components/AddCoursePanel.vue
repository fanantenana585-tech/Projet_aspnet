<script setup>
import { ref, computed, watch } from 'vue'
import { useAcademicStore } from '@/stores/academic'
import { useProfessorsStore } from '@/stores/professors'
import { useCoursesStore } from '@/stores/courses'
import { X, ChevronRight, ChevronLeft, Check } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  currentWeek: Number
})

const emit = defineEmits(['close', 'courseAdded'])

const academicStore = useAcademicStore()
const professorsStore = useProfessorsStore()
const coursesStore = useCoursesStore()

const step = ref(1)
const formData = ref({
  mentionId: '',
  level: '',
  path: '',
  professorId: null,
  courseName: '',
  room: '',
  day: '',
  hour: null
})

const error = ref('')

const paths = computed(() => {
  if (!formData.value.mentionId || !formData.value.level) return []
  return academicStore.getPaths(formData.value.mentionId, formData.value.level)
})

const filteredProfessors = computed(() => {
  if (!formData.value.mentionId) return professorsStore.professors
  return professorsStore.professors.filter(p => p.mentionId === formData.value.mentionId)
})

const selectedProfessor = computed(() => {
  return professorsStore.getProfessorById(formData.value.professorId)
})

const days = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const hours = [7, 8, 9, 10, 11, 14, 15, 16, 17]

const isProfAvailable = (day, hour) => {
  if (!formData.value.professorId) return false
  return professorsStore.isProfAvailable(formData.value.professorId, props.currentWeek, day, hour)
}

const isRoomOccupied = (day, hour, room) => {
  return coursesStore.courses.some(c => c.week === props.currentWeek && c.day === day && c.hour === hour && c.room === room)
}

const validateStep = () => {
  error.value = ''
  if (step.value === 1) {
    if (!formData.value.mentionId || !formData.value.level || !formData.value.path) {
      error.value = 'Veuillez remplir tous les champs de la classe.'
      return false
    }
  } else if (step.value === 2) {
    if (!formData.value.professorId) {
      error.value = 'Veuillez sélectionner un professeur.'
      return false
    }
  } else if (step.value === 3) {
    if (!formData.value.day || !formData.value.hour) {
      error.value = 'Veuillez sélectionner un créneau disponible.'
      return false
    }
  }
  return true
}

const nextStep = () => {
  if (validateStep()) step.value++
}

const prevStep = () => {
  step.value--
}

const handleSubmit = () => {
  if (!formData.value.courseName || !formData.value.room) {
    error.value = 'Veuillez saisir le nom du cours et la salle.'
    return
  }

  // Conflict checks
  if (isRoomOccupied(formData.value.day, formData.value.hour, formData.value.room)) {
    error.value = 'La salle est déjà occupée sur ce créneau.'
    return
  }

  const newCourse = {
    ...formData.value,
    week: props.currentWeek,
    semester: 'Semestre 1' // Default or based on week
  }

  coursesStore.addCourse(newCourse)
  emit('courseAdded')
  close()
}

const close = () => {
  step.value = 1
  formData.value = {
    mentionId: '',
    level: '',
    path: '',
    professorId: null,
    courseName: '',
    room: '',
    day: '',
    hour: null
  }
  error.value = ''
  emit('close')
}
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] overflow-hidden">
    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="close"></div>

    <div class="absolute inset-y-0 right-0 max-w-md w-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300">
      <div class="p-6 border-b border-gray-100 flex items-center justify-between bg-[#0D1B3E] text-white">
        <div>
          <h2 class="font-title font-bold text-lg">Ajouter un cours</h2>
          <p class="text-xs text-white/70">Étape {{ step }} sur 4</p>
        </div>
        <button @click="close" class="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X :size="24" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <!-- Error Message -->
        <div v-if="error" class="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium">
          {{ error }}
        </div>

        <!-- Step 1: Class Selection -->
        <div v-if="step === 1" class="space-y-4">
          <h3 class="font-bold text-[#0D1B3E]">Information de la classe</h3>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1 uppercase text-xs">Mention</label>
            <select v-model="formData.mentionId" class="w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-[#1D9E75] focus:border-[#1D9E75]">
              <option value="">Sélectionner une mention</option>
              <option v-for="m in academicStore.mentions" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1 uppercase text-xs">Niveau</label>
            <select v-model="formData.level" class="w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-[#1D9E75] focus:border-[#1D9E75]">
              <option value="">Sélectionner un niveau</option>
              <option v-for="l in ['L1', 'L2', 'L3', 'M1', 'M2']" :key="l" :value="l">{{ l }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1 uppercase text-xs">Parcours</label>
            <select v-model="formData.path" :disabled="!formData.mentionId || !formData.level" class="w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-[#1D9E75] focus:border-[#1D9E75] disabled:opacity-50">
              <option value="">Sélectionner un parcours</option>
              <option v-for="p in paths" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>
        </div>

        <!-- Step 2: Professor Selection -->
        <div v-if="step === 2" class="space-y-4">
          <h3 class="font-bold text-[#0D1B3E]">Sélection du professeur</h3>
          <div class="grid grid-cols-1 gap-2">
            <div
              v-for="prof in filteredProfessors"
              :key="prof.id"
              @click="formData.professorId = prof.id"
              :class="[
                'flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all',
                formData.professorId === prof.id ? 'border-[#1D9E75] bg-[#1D9E75]/5 ring-1 ring-[#1D9E75]' : 'border-gray-100 hover:bg-gray-50'
              ]"
            >
              <div class="w-10 h-10 rounded-full bg-[#0D1B3E] text-white flex items-center justify-center font-bold text-sm">
                {{ prof.initiales }}
              </div>
              <div>
                <p class="font-bold text-sm text-[#0D1B3E]">{{ prof.nom }} {{ prof.prenom }}</p>
                <p class="text-xs text-gray-700">{{ prof.specialite }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Availability Grid -->
        <div v-if="step === 3" class="space-y-4">
          <h3 class="font-bold text-[#0D1B3E]">Choisir un créneau</h3>
          <p class="text-xs text-gray-700">Seuls les créneaux en vert sont disponibles pour {{ selectedProfessor?.nom }}.</p>

          <div class="grid grid-cols-7 gap-1 bg-gray-50 p-2 rounded-lg">
            <div class="h-8"></div>
            <div v-for="d in days" :key="d" class="text-[10px] font-bold text-center uppercase text-[#0C2340]">{{ d.substring(0,3) }}</div>

            <template v-for="h in hours" :key="h">
              <div class="text-[10px] font-bold flex items-center justify-center text-[#0C2340] h-10">{{ h }}h</div>
              <div
                v-for="d in days"
                :key="`${d}-${h}`"
                @click="isProfAvailable(d, h) && (formData.day = d, formData.hour = h)"
                :class="[
                  'h-10 rounded-md border flex items-center justify-center transition-all cursor-pointer',
                  formData.day === d && formData.hour === h ? 'bg-[#1D9E75] border-[#1D9E75] text-white shadow-md scale-105 z-10' :
                  isProfAvailable(d, h) ? 'bg-green-50 border-green-200 hover:bg-green-100' : 'bg-red-50 border-red-100 opacity-30 cursor-not-allowed'
                ]"
              >
                <Check v-if="formData.day === d && formData.hour === h" :size="16" />
              </div>
            </template>
          </div>
        </div>

        <!-- Step 4: Final Details -->
        <div v-if="step === 4" class="space-y-4">
          <h3 class="font-bold text-[#0D1B3E]">Détails du cours</h3>
          <div class="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
            <p class="text-xs font-bold text-[#0C2340] uppercase mb-2">Récapitulatif</p>
            <p class="text-sm font-bold text-[#0D1B3E]">{{ formData.path }} — {{ formData.level }}</p>
            <p class="text-xs text-[#1D9E75] font-medium">{{ selectedProfessor?.nom }}</p>
            <p class="text-xs text-gray-700 mt-1">{{ formData.day }} à {{ formData.hour }}h00</p>
          </div>

          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1 uppercase text-xs">Nom du cours</label>
            <input v-model="formData.courseName" type="text" placeholder="Ex: Algorithmique 2" class="w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-[#1D9E75] focus:border-[#1D9E75]">
          </div>
          <div>
            <label class="block text-sm font-bold text-gray-700 mb-1 uppercase text-xs">Salle</label>
            <input v-model="formData.room" type="text" placeholder="Ex: Salle 1, Amphi A..." class="w-full border-gray-200 rounded-lg bg-gray-50 focus:ring-[#1D9E75] focus:border-[#1D9E75]">
          </div>
        </div>
      </div>

      <div class="p-6 border-t border-gray-100 flex items-center justify-between gap-4">
        <button
          v-if="step > 1"
          @click="prevStep"
          class="flex-1 btn border-gray-200 hover:bg-gray-50 text-gray-700"
        >
          <ChevronLeft :size="20" /> Retour
        </button>

        <button
          v-if="step < 4"
          @click="nextStep"
          class="flex-1 btn btn-primary"
        >
          Suivant <ChevronRight :size="20" />
        </button>

        <button
          v-else
          @click="handleSubmit"
          class="flex-1 btn btn-primary"
        >
          <Check :size="20" /> Confirmer
        </button>
      </div>
    </div>
  </div>
</template>
