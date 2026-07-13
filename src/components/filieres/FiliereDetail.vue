<script setup>
import { ref } from 'vue'
import { X, Users, BookOpen, GraduationCap, Calendar, Star, LayoutGrid, Trash2, Edit3, Map } from 'lucide-vue-next'
import { useFiliereStore } from '@/stores/filiereStore'

const props = defineProps({
  isOpen: Boolean,
  parcours: Object
})

const emit = defineEmits(['close'])
const store = useFiliereStore()

const activeTab = ref('presentation')

const handleEdit = () => {
  if (parcours) {
    store.ouvrirModal(parcours)
    emit('close')
  }
}

const handleDelete = async () => {
  if (!parcours) return
  if (confirm('Supprimer ce parcours ? Les données associées seront perdues.')) {
    await store.supprimerParcours(parcours.id)
    emit('close')
  }
}
</script>

<template>
  <Transition name="drawer">
    <div v-if="isOpen && parcours" class="fixed inset-0 z-[250] overflow-hidden">
      <div class="absolute inset-0 bg-[#0C2340]/20 backdrop-blur-sm" @click="$emit('close')"></div>

      <div class="absolute inset-y-0 right-0 w-full max-w-[500px] bg-white shadow-[-20px_0_60px_rgba(0,0,0,0.1)] flex flex-col border-l border-[#BFDBFE]">
        <!-- Header -->
        <div class="p-10 border-b border-[#F0F7FF] relative" :style="{ background: `linear-gradient(135deg, ${parcours.couleur}15, white)` }">
          <button @click="$emit('close')" class="absolute top-6 right-6 p-2 bg-white rounded-xl text-[#64A8CC] hover:text-red-500 shadow-sm border border-[#BFDBFE] transition-all">
            <X :size="24" />
          </button>

          <div class="flex items-center gap-6">
             <div class="w-20 h-20 rounded-[2rem] bg-white border border-[#BFDBFE] flex items-center justify-center text-4xl shadow-sm">
                {{ parcours.icone }}
             </div>
             <div>
                <div class="flex items-center gap-2">
                   <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-black font-mono tracking-widest border" :style="{ backgroundColor: parcours.couleur + '15', color: parcours.couleur, borderColor: parcours.couleur + '30' }">
                     {{ parcours.code }}
                   </span>
                   <span v-if="parcours.ouvertConcours" class="px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest bg-[#FEF3C7] text-[#92400E] border border-[#D97706]/30">
                     🎓 Concours L1
                   </span>
                </div>
                <h2 class="text-2xl font-black text-[#0C2340] tracking-tight mt-2">{{ parcours.nomCourt }}</h2>
                <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest mt-1">Mention {{ parcours.mentionNom }}</p>
             </div>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-[#F0F7FF] px-8 bg-white overflow-x-auto no-scrollbar">
          <button
            v-for="tab in [{id:'presentation', label:'Présentation'}, {id:'cursus', label:'Cursus'}, {id:'enseignants', label:'Profs'}, {id:'stats', label:'Stats'}]"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-5 text-[10px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap"
            :class="activeTab === tab.id ? 'text-[#38BDF8]' : 'text-[#64A8CC]'"
          >
            {{ tab.label }}
            <div v-if="activeTab === tab.id" class="absolute bottom-0 left-0 right-0 h-1 bg-[#38BDF8] rounded-t-full shadow-[0_-4px_10px_rgba(56,189,248,0.5)]"></div>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
           <div v-if="activeTab === 'presentation'" class="space-y-8 animate-in fade-in duration-500">
              <div class="space-y-3">
                 <h4 class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Description</h4>
                 <p class="text-sm font-medium text-[#1E5F8E] leading-relaxed">{{ parcours.description }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                 <div class="bg-[#F0F9FF] p-5 rounded-[2rem] border border-[#BFDBFE]">
                    <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest mb-1">Étudiants</p>
                    <p class="text-2xl font-black text-[#0C2340]">{{ parcours.nbEtudiants }}</p>
                 </div>
                 <div class="bg-[#F0F9FF] p-5 rounded-[2rem] border border-[#BFDBFE]">
                    <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest mb-1">Matières</p>
                    <p class="text-2xl font-black text-[#0C2340]">{{ parcours.nbMatieres }}</p>
                 </div>
              </div>

              <div class="p-6 rounded-[2rem] border-2 border-[#BFDBFE] bg-white flex items-center gap-4">
                 <div class="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] text-white flex items-center justify-center font-black text-xl">
                   {{ parcours.responsable.initiales }}
                 </div>
                 <div>
                    <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Responsable</p>
                    <h5 class="font-black text-[#0C2340]">{{ parcours.responsable.nom }}</h5>
                    <p class="text-xs font-bold text-[#38BDF8]">{{ parcours.responsable.titre }}</p>
                 </div>
              </div>

              <div v-if="parcours.ouvertConcours" class="p-6 bg-[#FEF3C7]/30 border-2 border-[#D97706] rounded-[2rem] space-y-2">
                 <h4 class="text-sm font-black text-[#92400E] uppercase tracking-widest flex items-center gap-2">
                    <Star :size="16" fill="currentColor" /> Concours d'entrée
                 </h4>
                 <p class="text-xs font-bold text-[#92400E]/70 leading-relaxed">
                   Ce parcours est accessible via le concours d'entrée EMIT niveau L1.
                   Les inscriptions pour la session 2025-2026 seront ouvertes prochainement.
                 </p>
              </div>
           </div>

           <div v-if="activeTab === 'cursus'" class="space-y-6 animate-in fade-in duration-500">
              <div v-for="(semestres, level) in parcours.cursus" :key="level" class="space-y-4">
                 <h4 class="text-sm font-black text-[#0C2340] uppercase tracking-widest border-b border-[#F0F7FF] pb-2">{{ level }}</h4>
                 <div v-for="(matieres, sem) in semestres" :key="sem" class="pl-4 border-l-2 border-[#F0F9FF] space-y-2">
                    <p class="text-[10px] font-black text-[#38BDF8] uppercase tracking-widest">{{ sem }}</p>
                    <div class="flex flex-wrap gap-2">
                       <span v-for="mat in matieres" :key="mat" class="px-2 py-1 bg-[#F8FBFF] border border-[#BFDBFE] rounded-lg text-[9px] font-bold text-[#1E5F8E]">
                         {{ mat }}
                       </span>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-[#F0F7FF] flex gap-4 bg-[#F8FBFF]">
           <button @click="handleEdit" class="flex-1 bg-white border border-[#BFDBFE] text-[#1E5F8E] py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
              <Edit3 :size="20" /> Modifier
           </button>
           <button @click="handleDelete" class="flex-1 bg-red-50 border border-red-100 text-red-500 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-sm hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2">
              <Trash2 :size="20" /> Supprimer
           </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.drawer-enter-active, .drawer-leave-active { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
.drawer-enter-from, .drawer-leave-to { transform: translateX(100%); }
</style>
