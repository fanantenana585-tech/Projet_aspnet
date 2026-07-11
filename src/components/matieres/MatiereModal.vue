<script setup>
import { ref, reactive, watch, computed } from 'vue';
import { useMatiereStore, MENTIONS_EMIT } from '@/stores/matiereStore';
import {
  X, Check, ChevronRight, ChevronLeft,
  BookOpen, Clock, Award, Users,
  CheckCircle2, AlertCircle, Info,
  Layout, Palette, Type
} from 'lucide-vue-next';

const store = useMatiereStore();
const emit = defineEmits(['close']);

const step = ref(1);
const isLoading = ref(false);

const form = reactive({
  id: null,
  code: '',
  nom: '',
  description: '',
  mentionId: 'mention-info',
  parcours: 'DA2I',
  parcoursNom: 'Développement d\'Application Internet/Intranet',
  niveau: 'L1',
  semestre: 'S1',
  type: ['Cours'],
  credits: 4,
  coefficient: 3,
  volumeHoraire: {
    cours: 20,
    td: 0,
    tp: 0,
    projet: 0
  },
  couleur: '#0EA5E9',
  statut: 'actif',
  enseignants: []
});

watch(() => store.modalOuverte, (val) => {
  if (val) {
    if (store.matiereEnEdition) {
      Object.assign(form, JSON.parse(JSON.stringify(store.matiereEnEdition)));
    } else {
      resetForm();
    }
    step.value = 1;
  }
});

function resetForm() {
  Object.assign(form, {
    id: null, code: '', nom: '', description: '',
    mentionId: 'mention-info', parcours: 'DA2I', parcoursNom: 'Développement d\'Application Internet/Intranet',
    niveau: 'L1', semestre: 'S1', type: ['Cours'], credits: 4, coefficient: 3,
    volumeHoraire: { cours: 20, td: 0, tp: 0, projet: 0 },
    couleur: '#0EA5E9', statut: 'actif', enseignants: []
  });
}

const filteredParcours = computed(() => {
  const m = MENTIONS_EMIT.find(m => m.id === form.mentionId);
  return m ? m.parcours : [];
});

const handleMentionChange = () => {
  const p = filteredParcours.value[0];
  if (p) {
    form.parcours = p.id;
    form.parcoursNom = p.nom;
    form.couleur = p.couleur;
    form.niveau = p.niveau === 'Master' ? 'M1' : 'L1';
    generateCode();
  }
};

const handleParcoursChange = () => {
  const p = filteredParcours.value.find(p => p.id === form.parcours);
  if (p) {
    form.parcoursNom = p.nom;
    form.couleur = p.couleur;
    form.niveau = p.niveau === 'Master' ? 'M1' : 'L1';
    generateCode();
  }
};

const generateCode = () => {
  const num = Math.floor(Math.random() * 900) + 100;
  form.code = `${form.parcours}${num}`;
};

const totalVolume = computed(() =>
  Object.values(form.volumeHoraire).reduce((acc, val) => acc + (parseInt(val) || 0), 0)
);

const submit = async () => {
  isLoading.value = true;
  const mention = MENTIONS_EMIT.find(m => m.id === form.mentionId);
  form.mention = mention.nom;

  if (form.id) store.modifierMatiere(form.id, { ...form });
  else store.ajouterMatiere({ ...form });

  setTimeout(() => {
    isLoading.value = false;
    store.fermerModal();
  }, 500);
};

const colors = ['#0EA5E9', '#38BDF8', '#0284C7', '#2563EB', '#6D28D9', '#10B981', '#059669', '#F472B6', '#EC4899', '#DB2777', '#F43F5E', '#F59E0B'];

const canNext = computed(() => {
  if (step.value === 1) return form.nom && form.code;
  return true;
});

</script>

<template>
  <Transition name="modal">
    <div v-if="store.modalOuverte" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-[#0C2340]/40 backdrop-blur-[4px]" @click="store.fermerModal()"></div>

      <div class="bg-white w-full max-w-[800px] rounded-[2.5rem] border border-[#BFDBFE] shadow-[0_40px_100px_rgba(0,0,0,0.2)] relative overflow-hidden flex flex-col max-h-[90vh]">

        <!-- Header -->
        <div class="p-8 border-b border-[#F0F7FF] flex justify-between items-center bg-gradient-to-r from-[#F8FBFF] to-white shrink-0">
          <div class="flex items-center gap-5">
            <div class="w-14 h-14 rounded-2xl bg-[#38BDF8] text-white flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
               <BookOpen :size="28" />
            </div>
            <div>
              <h2 class="text-[#0C2340] text-2xl font-black tracking-tight">
                {{ form.id ? 'Modifier la matière' : 'Nouvelle matière' }}
              </h2>
              <div class="flex items-center gap-3 mt-1">
                 <div v-for="s in 3" :key="s" class="h-1.5 rounded-full transition-all" :class="step >= s ? 'w-8 bg-[#38BDF8]' : 'w-4 bg-[#BFDBFE]'"></div>
                 <span class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-2">Étape {{ step }} sur 3</span>
              </div>
            </div>
          </div>
          <button @click="store.fermerModal()" class="p-3 bg-white rounded-2xl text-[#64A8CC] hover:text-red-500 shadow-sm border border-[#BFDBFE] transition-all">
            <X :size="20" />
          </button>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-10 custom-scrollbar">

          <!-- Step 1: Identification -->
          <div v-if="step === 1" class="space-y-8 animate-in fade-in slide-in-from-bottom-4">
             <div class="grid grid-cols-2 gap-8">
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Mention</label>
                   <select v-model="form.mentionId" @change="handleMentionChange" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-bold text-[#0C2340] focus:border-[#38BDF8] outline-none appearance-none cursor-pointer">
                      <option v-for="m in MENTIONS_EMIT" :key="m.id" :value="m.id">{{ m.icone }} {{ m.nom }}</option>
                      <option value="transversal">📚 Transversal</option>
                   </select>
                </div>
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Parcours</label>
                   <select v-model="form.parcours" @change="handleParcoursChange" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-bold text-[#0C2340] focus:border-[#38BDF8] outline-none appearance-none cursor-pointer">
                      <option v-for="p in filteredParcours" :key="p.id" :value="p.id">[{{ p.code }}] {{ p.nom }}</option>
                   </select>
                </div>
             </div>

             <div class="grid grid-cols-3 gap-8">
                <div class="col-span-1 space-y-2">
                   <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Code</label>
                   <input type="text" v-model="form.code" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-black text-[#38BDF8] focus:border-[#38BDF8] outline-none uppercase">
                </div>
                <div class="col-span-2 space-y-2">
                   <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Nom de la matière</label>
                   <input type="text" v-model="form.nom" placeholder="ex: Programmation Orientée Objet" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-bold text-[#0C2340] focus:border-[#38BDF8] outline-none">
                </div>
             </div>

             <div class="space-y-2">
                <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Description</label>
                <textarea v-model="form.description" rows="3" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-medium text-[#1E5F8E] focus:border-[#38BDF8] outline-none resize-none"></textarea>
             </div>

             <div class="grid grid-cols-2 gap-8">
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Niveau & Semestre</label>
                   <div class="flex gap-4">
                      <select v-model="form.niveau" class="flex-1 bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-bold text-[#0C2340] outline-none">
                         <option v-for="n in ['L1','L2','L3','M1','M2']" :key="n">{{ n }}</option>
                      </select>
                      <select v-model="form.semestre" class="flex-1 bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-bold text-[#0C2340] outline-none">
                         <option v-for="s in 10" :key="s">S{{ s }}</option>
                      </select>
                   </div>
                </div>
                <div class="space-y-2">
                   <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest ml-1">Couleur distinctive</label>
                   <div class="flex flex-wrap gap-2 pt-1">
                      <button
                         v-for="c in colors" :key="c"
                         @click="form.couleur = c"
                         class="w-8 h-8 rounded-full border-2 transition-all hover:scale-110"
                         :class="form.couleur === c ? 'border-[#0C2340]' : 'border-transparent'"
                         :style="{ backgroundColor: c }"
                      ></button>
                   </div>
                </div>
             </div>
          </div>

          <!-- Step 2: Volume & Crédits -->
          <div v-if="step === 2" class="space-y-10 animate-in fade-in slide-in-from-right-4">
             <div class="grid grid-cols-2 gap-10">
                <div class="space-y-8">
                   <div class="flex items-center gap-4 border-l-4 border-[#38BDF8] pl-4">
                      <Award class="text-[#38BDF8]" :size="20" />
                      <h3 class="text-sm font-black text-[#0C2340] uppercase tracking-widest">Valeur académique</h3>
                   </div>
                   <div class="grid grid-cols-2 gap-6">
                      <div class="space-y-2">
                         <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Crédits ECTS</label>
                         <input type="number" v-model="form.credits" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-black text-xl text-center">
                      </div>
                      <div class="space-y-2">
                         <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">Coefficient</label>
                         <input type="number" v-model="form.coefficient" class="w-full bg-[#F0F9FF] border-2 border-[#BFDBFE] p-4 rounded-2xl font-black text-xl text-center">
                      </div>
                   </div>
                </div>

                <div class="space-y-6">
                   <div class="flex items-center gap-4 border-l-4 border-[#0EA5E9] pl-4">
                      <Clock class="text-[#0EA5E9]" :size="20" />
                      <h3 class="text-sm font-black text-[#0C2340] uppercase tracking-widest">Volume Horaire</h3>
                   </div>
                   <div class="space-y-4">
                      <div v-for="(v, key) in form.volumeHoraire" :key="key" class="space-y-2">
                         <div class="flex justify-between">
                            <label class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest">{{ key }}</label>
                            <span class="text-xs font-black text-[#38BDF8]">{{ v }}h</span>
                         </div>
                         <input type="range" v-model="form.volumeHoraire[key]" min="0" max="60" class="w-full h-1.5 bg-[#F0F9FF] rounded-lg appearance-none cursor-pointer accent-[#38BDF8]">
                      </div>
                      <div class="pt-4 border-t border-[#F0F7FF] flex justify-between">
                         <span class="text-xs font-black text-[#0C2340] uppercase">Total Heures</span>
                         <span class="text-xl font-black text-[#38BDF8]">{{ totalVolume }}h</span>
                      </div>
                   </div>
                </div>
             </div>
          </div>

          <!-- Step 3: Assignation -->
          <div v-if="step === 3" class="space-y-10 animate-in fade-in slide-in-from-right-4">
             <div class="bg-[#F0F9FF] p-8 rounded-[2.5rem] border-2 border-[#BFDBFE] space-y-6">
                <div class="flex items-center gap-4">
                   <Users class="text-[#38BDF8]" :size="24" />
                   <h3 class="text-sm font-black text-[#0C2340] uppercase tracking-widest">Équipe pédagogique</h3>
                </div>
                <div class="space-y-4">
                   <p class="text-xs text-[#64A8CC] font-bold">Sélectionnez les enseignants intervenant dans cette matière.</p>
                   <div class="flex flex-wrap gap-3">
                      <div v-for="e in 4" :key="e" class="bg-white border-2 border-[#BFDBFE] p-3 rounded-2xl flex items-center gap-3 cursor-pointer hover:border-[#38BDF8] transition-all">
                         <div class="w-8 h-8 rounded-full bg-[#38BDF8] flex items-center justify-center text-white text-[10px] font-black">JR</div>
                         <span class="text-xs font-black text-[#0C2340]">Rakoto Jean</span>
                      </div>
                   </div>
                </div>
             </div>

             <div class="flex items-center justify-between p-8 bg-white border-2 border-[#BFDBFE] rounded-[2.5rem]">
                <div class="flex items-center gap-4">
                   <CheckCircle2 class="text-[#059669]" :size="24" />
                   <div>
                      <p class="text-sm font-black text-[#0C2340]">Statut de la matière</p>
                      <p class="text-xs text-[#64A8CC] font-bold">La matière sera visible dès son activation.</p>
                   </div>
                </div>
                <button
                  @click="form.statut = form.statut === 'actif' ? 'inactif' : 'actif'"
                  class="w-16 h-8 rounded-full relative transition-all"
                  :class="form.statut === 'actif' ? 'bg-[#059669]' : 'bg-[#BFDBFE]'"
                >
                   <div class="absolute top-1 w-6 h-6 bg-white rounded-full transition-all" :style="{ left: form.statut === 'actif' ? '36px' : '4px' }"></div>
                </button>
             </div>
          </div>

        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-[#F0F7FF] flex justify-between items-center bg-[#F8FBFF] shrink-0">
           <button
              v-if="step > 1"
              @click="step--"
              class="flex items-center gap-2 px-6 py-3 rounded-xl font-black text-[10px] uppercase text-[#64A8CC] hover:bg-white transition-all"
           >
              <ChevronLeft :size="16" /> Précédent
           </button>
           <div v-else></div>

           <div class="flex gap-4">
              <button @click="store.fermerModal()" class="px-8 py-4 font-black text-[10px] uppercase text-[#64A8CC]">Annuler</button>

              <button
                v-if="step < 3"
                @click="step++"
                :disabled="!canNext"
                class="px-10 py-4 bg-[#38BDF8] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#38BDF8]/20 disabled:opacity-50 flex items-center gap-3"
              >
                Suivant <ChevronRight :size="16" />
              </button>

              <button
                v-else
                @click="submit"
                :disabled="isLoading"
                class="px-10 py-4 bg-gradient-to-r from-[#059669] to-[#10B981] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-[#059669]/20 flex items-center gap-3"
              >
                <Check v-if="!isLoading" :size="18" />
                <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {{ form.id ? 'Enregistrer les modifications' : 'Confirmer la création' }}
              </button>
           </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active, .modal-leave-active { transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-enter-from, .modal-leave-to { opacity: 0; transform: scale(0.9); }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #BFDBFE; border-radius: 10px; }
</style>
