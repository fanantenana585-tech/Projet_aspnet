<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { useFiliereStore, MOCK_MENTIONS } from '@/stores/filiereStore'
import {
  X, ChevronRight, ChevronLeft, Check,
  GraduationCap, Hash, Layers, Users, Star,
  Plus, Trash2, Info, LayoutGrid
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  parcours: Object
})

const emit = defineEmits(['close'])
const store = useFiliereStore()

const step = ref(1)
const isLoading = ref(false)

const form = reactive({
  id: '',
  code: '',
  nom: '',
  nomCourt: '',
  mentionId: 'mention-info',
  mentionNom: 'Informatique',
  couleur: '#38BDF8',
  niveau: 'Licence',
  icone: '🌐',
  description: '',
  nbEtudiants: 0,
  anneeCreation: 2026,
  ouvertConcours: false,
  responsable: { nom: '', initiales: '', titre: 'MCF' },
  cursus: {}
})

watch(() => props.parcours, (newVal) => {
  if (newVal) {
    Object.assign(form, newVal)
  } else {
    resetForm()
  }
}, { immediate: true })

function resetForm() {
  Object.assign(form, {
    id: '',
    code: '',
    nom: '',
    nomCourt: '',
    mentionId: 'mention-info',
    mentionNom: 'Informatique',
    couleur: '#38BDF8',
    niveau: 'Licence',
    icone: '🌐',
    description: '',
    nbEtudiants: 0,
    anneeCreation: 2026,
    ouvertConcours: false,
    responsable: { nom: '', initiales: '', titre: 'MCF' },
    cursus: {}
  })
}

const submit = async () => {
  isLoading.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  // Mock save logic
  isLoading.value = false
  emit('close')
}

const next = () => step.value < 4 && step.value++
const prev = () => step.value > 1 && step.value--
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-[#0C2340]/40 backdrop-blur-md" @click="$emit('close')"></div>

    <div class="relative bg-white w-full max-w-2xl rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-[#BFDBFE] overflow-hidden animate-in zoom-in duration-500">
      <!-- Header -->
      <div class="p-10 border-b border-[#F0F7FF] flex items-center justify-between bg-gradient-to-r from-white to-[#F0F9FF]">
        <div class="flex items-center gap-5">
          <div class="w-14 h-14 rounded-2xl bg-[#0EA5E9] text-white flex items-center justify-center shadow-lg shadow-[#0EA5E9]/20">
            <GraduationCap :size="28" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-[#0C2340] tracking-tight">
              {{ form.id ? 'Modifier le parcours' : 'Nouveau parcours EMIT' }}
            </h2>
            <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-[0.2em]">Étape {{ step }} sur 4</p>
          </div>
        </div>
        <button @click="$emit('close')" class="p-3 bg-white rounded-2xl text-[#64A8CC] hover:text-red-500 shadow-sm border border-[#BFDBFE] transition-all">
          <X :size="24" />
        </button>
      </div>

      <!-- Content -->
      <div class="p-12 max-h-[60vh] overflow-y-auto custom-scrollbar">
        <!-- Step 1: Identity -->
        <div v-if="step === 1" class="space-y-8">
           <div class="grid grid-cols-3 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Code Parcours</label>
                <input v-model="form.code" type="text" placeholder="Ex: DA2I" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] text-[#0C2340] font-black rounded-2xl p-4 focus:outline-none focus:border-[#38BDF8]" />
              </div>
              <div class="space-y-2 col-span-2">
                <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Nom Complet</label>
                <input v-model="form.nom" type="text" placeholder="Développement d'Application..." class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] text-[#0C2340] font-bold rounded-2xl p-4 focus:outline-none focus:border-[#38BDF8]" />
              </div>
           </div>

           <div class="space-y-2">
              <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Mention</label>
              <select v-model="form.mentionId" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] text-[#0C2340] font-bold rounded-2xl p-4 focus:outline-none focus:border-[#38BDF8]">
                <option v-for="m in MOCK_MENTIONS" :key="m.id" :value="m.id">{{ m.icone }} {{ m.nom }}</option>
              </select>
           </div>

           <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Niveau</label>
                <div class="flex bg-[#F0F9FF] p-2 rounded-2xl border-2 border-[#BFDBFE] gap-2">
                   <button @click="form.niveau = 'Licence'" class="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all" :class="form.niveau === 'Licence' ? 'bg-white text-[#38BDF8] shadow-sm' : 'text-[#64A8CC]'">Licence</button>
                   <button @click="form.niveau = 'Master'" class="flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all" :class="form.niveau === 'Master' ? 'bg-white text-[#38BDF8] shadow-sm' : 'text-[#64A8CC]'">Master</button>
                </div>
              </div>
              <div class="space-y-2">
                 <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Ouvert au Concours L1</label>
                 <div @click="form.ouvertConcours = !form.ouvertConcours" class="flex items-center justify-between bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-2xl p-4 cursor-pointer">
                    <span class="text-xs font-bold text-[#1E5F8E]">{{ form.ouvertConcours ? 'OUI (Doré)' : 'NON' }}</span>
                    <div class="w-12 h-6 rounded-full p-1 transition-colors" :class="form.ouvertConcours ? 'bg-[#38BDF8]' : 'bg-[#BFDBFE]'">
                       <div class="w-4 h-4 bg-white rounded-full transition-transform" :class="{ 'translate-x-6': form.ouvertConcours }"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>

        <!-- Step 2: Description & Style -->
        <div v-if="step === 2" class="space-y-8">
           <div class="space-y-2">
              <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Description du parcours</label>
              <textarea v-model="form.description" rows="4" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] text-[#0C2340] font-medium rounded-2xl p-4 focus:outline-none focus:border-[#38BDF8] resize-none"></textarea>
           </div>

           <div class="grid grid-cols-2 gap-6">
              <div class="space-y-2">
                <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Icône representative</label>
                <input v-model="form.icone" type="text" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] text-center text-2xl rounded-2xl p-4 focus:outline-none focus:border-[#38BDF8]" />
              </div>
              <div class="space-y-2">
                 <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Couleur d'identité</label>
                 <div class="flex items-center gap-3 bg-[#F0F9FF] border-2 border-[#BFDBFE] rounded-2xl p-4">
                    <input type="color" v-model="form.couleur" class="w-8 h-8 rounded-lg border-none cursor-pointer" />
                    <span class="text-xs font-black text-[#0C2340] uppercase">{{ form.couleur }}</span>
                 </div>
              </div>
           </div>
        </div>

        <!-- Step 3: Responsible -->
        <div v-if="step === 3" class="space-y-8">
           <div class="bg-[#F0F9FF] p-8 rounded-[2rem] border-2 border-[#BFDBFE] space-y-6">
              <h3 class="text-sm font-black text-[#0C2340] uppercase tracking-widest text-center">Responsable du parcours</h3>
              <div class="flex flex-col items-center gap-4">
                 <div class="w-20 h-20 rounded-3xl bg-white border-4 border-white shadow-xl flex items-center justify-center text-3xl text-[#38BDF8]">
                    {{ form.responsable.initiales || '?' }}
                 </div>
                 <div class="w-full grid grid-cols-2 gap-4">
                    <input v-model="form.responsable.nom" type="text" placeholder="Nom du responsable" class="w-full bg-white border-2 border-[#BFDBFE] text-[#0C2340] font-bold rounded-xl p-3 focus:outline-none focus:border-[#38BDF8]" />
                    <input v-model="form.responsable.titre" type="text" placeholder="Titre (MCF, Prof, ...)" class="w-full bg-white border-2 border-[#BFDBFE] text-[#0C2340] font-bold rounded-xl p-3 focus:outline-none focus:border-[#38BDF8]" />
                 </div>
              </div>
           </div>
        </div>

        <div v-if="step === 4" class="py-10 text-center space-y-6">
           <div class="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-100 border border-green-100">
              <Check :size="48" />
           </div>
           <h3 class="text-2xl font-black text-[#0C2340]">Prêt à enregistrer ?</h3>
           <p class="text-[#64A8CC] font-medium max-w-sm mx-auto">Toutes les informations du parcours {{ form.code }} ont été saisies. Le cursus pourra être configuré ultérieurement.</p>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-10 border-t border-[#F0F7FF] flex items-center justify-between bg-[#F8FBFF]">
        <button
          v-if="step > 1"
          @click="prev"
          class="flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-[#64A8CC] hover:text-[#0C2340] transition-all"
        >
          <ChevronLeft :size="24" /> Précédent
        </button>
        <div v-else></div>

        <button
          v-if="step < 4"
          @click="next"
          class="bg-gradient-to-r from-[#38BDF8] to-[#0EA5E9] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#38BDF8]/20 flex items-center gap-3 active:scale-95 transition-all"
        >
          Suivant <ChevronRight :size="24" />
        </button>

        <button
          v-else
          @click="submit"
          :disabled="isLoading"
          class="bg-gradient-to-r from-[#059669] to-[#10B981] text-white px-12 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-green-200 flex items-center gap-3 active:scale-95 transition-all disabled:opacity-50"
        >
          <Check v-if="!isLoading" :size="24" />
          <span v-if="isLoading" class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ form.id ? 'Mettre à jour' : 'Créer le parcours' }}
        </button>
      </div>
    </div>
  </div>
</template>
