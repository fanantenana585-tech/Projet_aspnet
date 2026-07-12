<script setup>
import { ref, computed } from 'vue'
import { X, Mail, Phone, Calendar, School, BookOpen, Clock, Activity, Edit2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  enseignant: Object
})

const emit = defineEmits(['close', 'edit'])

const activeTab = ref('infos')

const initials = computed(() => {
  if (!props.enseignant) return ''
  return `${props.enseignant.prenom.charAt(0)}${props.enseignant.nom.charAt(0)}`.toUpperCase()
})

const bgGradients = [
  'from-blue-500 to-indigo-600',
  'from-purple-500 to-pink-600',
  'from-emerald-500 to-teal-600',
  'from-orange-500 to-red-600',
  'from-cyan-500 to-blue-600'
]
const avatarGradient = props.enseignant ? bgGradients[props.enseignant.id % bgGradients.length] : 'from-gray-500 to-gray-600'

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Mock planning data
const planning = [
  { day: 'Lun', hours: '08:00 - 10:00', matiere: 'Algorithmique', room: 'S.102' },
  { day: 'Mer', hours: '14:00 - 16:00', matiere: 'C++', room: 'Labo 1' },
  { day: 'Ven', hours: '10:00 - 12:00', matiere: 'Algorithmique', room: 'Amphi A' }
]
</script>

<template>
  <Transition
    enter-active-class="transition-transform duration-300 ease-out"
    enter-from-class="translate-x-full"
    enter-to-class="translate-x-0"
    leave-active-class="transition-transform duration-200 ease-in"
    leave-from-class="translate-x-0"
    leave-to-class="translate-x-full"
  >
    <div v-if="isOpen" class="fixed inset-y-0 right-0 z-[70] w-full max-w-[420px] bg-[#1E293B] shadow-2xl border-l border-gray-800 flex flex-col">
      <!-- Header -->
      <div class="p-6 border-b border-gray-800 bg-[#1E293B] sticky top-0 z-10">
        <div class="flex items-center justify-between mb-6">
          <button @click="emit('close')" class="p-2 text-[#0C2340] hover:text-white hover:bg-gray-800 rounded-full transition-colors">
            <X :size="24" />
          </button>
          <button @click="emit('edit', enseignant)" class="flex items-center gap-2 px-4 py-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white rounded-xl transition-all text-sm font-bold">
            <Edit2 :size="16" /> Modifier
          </button>
        </div>

        <div class="flex flex-col items-center text-center" v-if="enseignant">
          <div :class="['w-24 h-24 rounded-3xl bg-gradient-to-br flex items-center justify-center text-white font-bold text-3xl shadow-2xl mb-4', avatarGradient]">
            {{ initials }}
          </div>
          <h2 class="text-2xl font-bold text-white mb-1">{{ enseignant.prenom }} {{ enseignant.nom }}</h2>
          <p class="text-[#0C2340] font-medium mb-3">{{ enseignant.grade }}</p>
          <div class="flex items-center gap-2">
            <span :class="['px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border',
              enseignant.statut === 'Actif' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20']">
              {{ enseignant.statut }}
            </span>
            <span class="px-3 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
              {{ enseignant.specialite }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex p-2 bg-gray-800/30 m-6 rounded-xl border border-gray-800">
        <button
          v-for="tab in ['infos', 'matieres', 'planning']"
          :key="tab"
          @click="activeTab = tab"
          class="flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
          :class="activeTab === tab ? 'bg-emit-blue text-white shadow-lg shadow-emit-blue/20' : 'text-gray-700 hover:text-[#0C2340]'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto px-6 pb-8 custom-scrollbar">
        <div v-if="activeTab === 'infos' && enseignant" class="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
          <div class="space-y-4">
            <h3 class="text-xs font-bold text-gray-700 uppercase tracking-widest">Coordonnées</h3>
            <div class="grid gap-4">
              <div class="flex items-center gap-4 p-4 bg-gray-800/40 rounded-2xl border border-gray-800">
                <div class="p-2 bg-blue-500/10 text-blue-400 rounded-lg"><Mail :size="18" /></div>
                <div><p class="text-xs text-gray-700">Email</p><p class="text-sm text-white font-medium">{{ enseignant.email }}</p></div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-gray-800/40 rounded-2xl border border-gray-800">
                <div class="p-2 bg-purple-500/10 text-purple-400 rounded-lg"><Phone :size="18" /></div>
                <div><p class="text-xs text-gray-700">Téléphone</p><p class="text-sm text-white font-medium">{{ enseignant.telephone }}</p></div>
              </div>
              <div class="flex items-center gap-4 p-4 bg-gray-800/40 rounded-2xl border border-gray-800">
                <div class="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg"><Calendar :size="18" /></div>
                <div><p class="text-xs text-gray-700">Recruté le</p><p class="text-sm text-white font-medium">{{ formatDate(enseignant.dateRecrutement) }}</p></div>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <h3 class="text-xs font-bold text-gray-700 uppercase tracking-widest">Charge Horaire</h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 bg-gray-800/40 rounded-2xl border border-gray-800 text-center">
                <p class="text-2xl font-bold text-white mb-1">{{ enseignant.nbHeures }}h</p>
                <p class="text-[10px] text-gray-700 font-bold uppercase tracking-wider">Effectuées</p>
              </div>
              <div class="p-4 bg-gray-800/40 rounded-2xl border border-gray-800 text-center">
                <p class="text-2xl font-bold text-white mb-1">{{ enseignant.maxHeures }}h</p>
                <p class="text-[10px] text-gray-700 font-bold uppercase tracking-wider">Maximum</p>
              </div>
            </div>
          </div>
        </div>

        <div v-else-if="activeTab === 'matieres'" class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 class="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Matières assignées</h3>
          <div v-if="enseignant?.matieres.length" class="space-y-3">
            <div
              v-for="(matiere, index) in enseignant.matieres"
              :key="index"
              class="flex items-center justify-between p-4 bg-gray-800/40 rounded-2xl border border-gray-800"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">{{ index + 1 }}</div>
                <span class="text-sm font-medium text-white">{{ matiere }}</span>
              </div>
              <span class="text-[10px] text-gray-700 font-bold uppercase">L1/L2/L3</span>
            </div>
          </div>
          <p v-else class="text-center text-gray-700 py-10 italic">Aucune matière enregistrée</p>
        </div>

        <div v-else-if="activeTab === 'planning'" class="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
          <h3 class="text-xs font-bold text-gray-700 uppercase tracking-widest mb-4">Planning Semaine</h3>
          <div class="space-y-3">
            <div
              v-for="(item, index) in planning"
              :key="index"
              class="p-4 bg-gray-800/40 rounded-2xl border border-gray-800 flex items-start gap-4"
            >
              <div class="px-3 py-1 bg-emit-blue text-white rounded-lg text-xs font-bold">{{ item.day }}</div>
              <div class="flex-1">
                <p class="text-sm font-bold text-white">{{ item.matiere }}</p>
                <div class="flex items-center gap-3 mt-1 text-[11px] text-gray-700 font-medium">
                  <span class="flex items-center gap-1"><Clock :size="12" /> {{ item.hours }}</span>
                  <span class="flex items-center gap-1"><School :size="12" /> {{ item.room }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Backdrop for Drawer -->
  <div v-if="isOpen" @click="emit('close')" class="fixed inset-0 z-[65] bg-black/40 backdrop-blur-sm"></div>
</template>
