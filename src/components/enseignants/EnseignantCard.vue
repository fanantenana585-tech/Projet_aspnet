<script setup>
import { computed } from 'vue'
import { Mail, Phone, BookOpen, Clock, Eye, Edit2, Trash2 } from 'lucide-vue-next'

const props = defineProps({
  enseignant: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'delete'])

const initials = computed(() => {
  return `${props.enseignant.prenom.charAt(0)}${props.enseignant.nom.charAt(0)}`.toUpperCase()
})

const progressWidth = computed(() => {
  return Math.min((props.enseignant.nbHeures / props.enseignant.maxHeures) * 100, 100)
})

const progressColor = computed(() => {
  const percent = (props.enseignant.nbHeures / props.enseignant.maxHeures) * 100
  if (percent > 90) return 'bg-[#DC2626]'
  if (percent > 70) return 'bg-[#D97706]'
  return 'bg-[#38BDF8]'
})

const bgGradients = [
  'from-[#38BDF8] to-[#0EA5E9]',
  'from-[#7DD3FC] to-[#38BDF8]',
  'from-[#0EA5E9] to-[#0284C7]',
  'from-[#BAE6FD] to-[#7DD3FC]',
  'from-[#0284C7] to-[#0C2340]'
]
const avatarGradient = bgGradients[props.enseignant.id % bgGradients.length]

const specialiteClasses = {
  'Informatique': 'bg-[#F0F9FF] text-[#0284C7] border-[#BFDBFE]',
  'Management': 'bg-purple-50 text-purple-700 border-purple-100',
  'Mathématiques': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'Communication': 'bg-pink-50 text-pink-700 border-pink-100',
  'Economie': 'bg-amber-50 text-amber-700 border-amber-100',
  'Réseaux': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  'Droit': 'bg-red-50 text-red-700 border-red-100'
}
</script>

<template>
  <div class="bg-white rounded-[2.5rem] border border-[#BFDBFE] p-8 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(14,165,233,0.12)] group relative overflow-hidden">
    <!-- Header -->
    <div class="flex justify-between items-start mb-8 relative z-10">
      <div :class="['w-16 h-16 rounded-[1.25rem] bg-gradient-to-br flex items-center justify-center text-white font-black text-2xl shadow-lg', avatarGradient]">
        {{ initials }}
      </div>
      <div class="flex flex-col items-end gap-2">
        <div :class="['px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border flex items-center gap-2',
          enseignant.statut === 'Actif' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100']">
          <span :class="['w-1.5 h-1.5 rounded-full', enseignant.statut === 'Actif' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500']"></span>
          {{ enseignant.statut }}
        </div>
        <span :class="['px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border', specialiteClasses[enseignant.specialite] || 'bg-gray-50 text-gray-600 border-gray-100']">
          {{ enseignant.specialite }}
        </span>
      </div>
    </div>

    <!-- Name & Grade -->
    <div class="mb-8 relative z-10">
      <h3 class="text-2xl font-black text-[#0C2340] group-hover:text-[#38BDF8] transition-colors leading-tight mb-1">
        {{ enseignant.prenom }} {{ enseignant.nom }}
      </h3>
      <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-[0.2em]">{{ enseignant.grade }}</p>
    </div>

    <!-- Info List -->
    <div class="space-y-4 mb-8 relative z-10">
      <div class="flex items-center gap-4 text-sm text-[#1E5F8E]">
        <div class="w-8 h-8 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-[#38BDF8]">
          <Mail :size="16" />
        </div>
        <span class="font-bold truncate">{{ enseignant.email }}</span>
      </div>
      <div class="flex items-center gap-4 text-sm text-[#1E5F8E]">
        <div class="w-8 h-8 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-[#38BDF8]">
          <Phone :size="16" />
        </div>
        <span class="font-bold">{{ enseignant.telephone }}</span>
      </div>
      <div class="flex items-start gap-4 text-sm text-[#1E5F8E]">
        <div class="w-8 h-8 rounded-lg bg-[#F0F9FF] flex items-center justify-center text-[#38BDF8] shrink-0">
          <BookOpen :size="16" />
        </div>
        <div class="flex flex-wrap gap-2 pt-1">
          <span v-for="(mat, idx) in enseignant.matieres" :key="idx" class="px-2.5 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
            {{ mat }}
          </span>
          <span v-if="!enseignant.matieres || enseignant.matieres.length === 0" class="text-[10px] text-gray-400 italic pt-1">Aucune matière</span>
        </div>
      </div>
    </div>

    <!-- Progress Section -->
    <div class="mb-10 relative z-10">
      <div class="flex justify-between items-center mb-3">
        <div class="flex items-center gap-2 text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">
          <Clock :size="12" /> Charge Horaire
        </div>
        <span class="text-[10px] font-black text-[#0C2340] bg-[#F0F7FF] px-2 py-1 rounded-lg">{{ enseignant.nbHeures }}h / {{ enseignant.maxHeures }}h</span>
      </div>
      <div class="h-1.5 w-full bg-[#F0F7FF] rounded-full overflow-hidden p-[2px]">
        <div
          :class="['h-full rounded-full transition-all duration-700 ease-out', progressColor]"
          :style="{ width: `${progressWidth}%` }"
        ></div>
      </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3 relative z-10">
      <button
        @click="emit('view', enseignant)"
        class="flex-1 flex items-center justify-center h-12 rounded-2xl bg-[#F0F9FF] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white transition-all shadow-sm group/btn"
      >
        <Eye :size="20" class="transition-transform group-hover/btn:scale-110" />
      </button>
      <button
        @click="emit('edit', enseignant)"
        class="flex-1 flex items-center justify-center h-12 rounded-2xl bg-orange-50 text-orange-600 hover:bg-orange-500 hover:text-white transition-all shadow-sm group/btn"
      >
        <Edit2 :size="20" class="transition-transform group-hover/btn:scale-110" />
      </button>
      <button
        @click="emit('delete', enseignant.id)"
        class="flex-1 flex items-center justify-center h-12 rounded-2xl bg-red-50 text-red-600 hover:bg-red-500 hover:text-white transition-all shadow-sm group/btn"
      >
        <Trash2 :size="20" class="transition-transform group-hover/btn:scale-110" />
      </button>
    </div>

    <!-- Decoration -->
    <div class="absolute bottom-0 right-0 w-32 h-32 bg-[#F0F9FF] rounded-full -mb-16 -mr-16 transition-transform group-hover:scale-110"></div>
  </div>
</template>
