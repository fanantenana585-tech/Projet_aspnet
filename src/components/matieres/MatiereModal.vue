<script setup>
import { ref, reactive, watch, computed, onMounted } from 'vue';
import { useMatiereStore, MENTIONS_EMIT } from '@/stores/matiereStore';
import { useEnseignantStore } from '@/stores/enseignantStore';
import { X, Save, BookOpen, Edit2 } from 'lucide-vue-next';

const store = useMatiereStore();
const enseignantStore = useEnseignantStore();

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
  enseignants: [],
  responsableEnseignantId: null
});

watch(() => store.modalOuverte, (val) => {
  if (val) {
    if (store.matiereEnEdition) {
      Object.assign(form, JSON.parse(JSON.stringify(store.matiereEnEdition)));
      if (store.matiereEnEdition.responsableEnseignantId) {
        form.responsableEnseignantId = store.matiereEnEdition.responsableEnseignantId;
      }
    } else {
      resetForm();
    }
  }
});

onMounted(() => {
  enseignantStore.fetchEnseignants();
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
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="store.modalOuverte" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="store.fermerModal()"></div>

      <div class="relative bg-[#1E293B] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-700 overflow-hidden animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="p-6 border-b border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emit-blue/10 rounded-lg text-emit-blue">
              <Edit2 v-if="form.id" :size="20" />
              <BookOpen v-else :size="20" />
            </div>
            <h2 class="text-xl font-bold text-white">
              {{ form.id ? 'Modifier la matière' : 'Ajouter une matière' }}
            </h2>
          </div>
          <button @click="store.fermerModal()" class="p-2 text-[#0C2340] hover:text-white hover:bg-gray-800 rounded-full transition-colors">
            <X :size="24" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Colonne 1 -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Nom de la matière <span class="text-red-500">*</span></label>
                <input v-model="form.nom" type="text" placeholder="Ex: Algorithmique" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]" />
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Mention <span class="text-red-500">*</span></label>
                <select v-model="form.mentionId" @change="handleMentionChange" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option v-for="m in MENTIONS_EMIT" :key="m.id" :value="m.id">{{ m.icone }} {{ m.nom }}</option>
                  <option value="transversal">📚 Transversal</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Parcours <span class="text-red-500">*</span></label>
                <select v-model="form.parcours" @change="handleParcoursChange" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option v-for="p in filteredParcours" :key="p.id" :value="p.id">[{{ p.code }}] {{ p.nom }}</option>
                </select>
              </div>
              
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Niveau</label>
                <select v-model="form.niveau" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option v-for="n in ['L1','L2','L3','M1','M2']" :key="n">{{ n }}</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Semestre</label>
                <select v-model="form.semestre" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option v-for="s in 10" :key="s">S{{ s }}</option>
                </select>
              </div>
            </div>

            <!-- Colonne 2 -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Code <span class="text-red-500">*</span></label>
                <input v-model="form.code" type="text" placeholder="Ex: DA2I101" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340] uppercase" />
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Crédits ECTS</label>
                <input v-model.number="form.credits" type="number" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all" />
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Enseignant responsable</label>
                <select v-model="form.responsableEnseignantId" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option :value="null">Aucun</option>
                  <option v-for="e in enseignantStore.enseignants" :key="e.id" :value="e.id">{{ e.prenom }} {{ e.nom }} ({{ e.initiales }})</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Coefficient</label>
                <input v-model.number="form.coefficient" type="number" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all" />
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-800">
                <label class="text-sm font-medium text-white">Statut de la matière</label>
                <button
                  type="button"
                  @click="form.statut = form.statut === 'actif' ? 'inactif' : 'actif'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-emit-blue/50"
                  :class="form.statut === 'actif' ? 'bg-emerald-500' : 'bg-gray-600'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="form.statut === 'actif' ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
              
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Couleur</label>
                <div class="flex flex-wrap gap-2 pt-1">
                  <button
                    v-for="c in colors" :key="c"
                    type="button"
                    @click="form.couleur = c"
                    class="w-6 h-6 rounded-full border-2 transition-all"
                    :class="form.couleur === c ? 'border-white scale-110' : 'border-transparent hover:scale-110'"
                    :style="{ backgroundColor: c }"
                  ></button>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="text-sm font-medium text-white">Description</label>
            <textarea v-model="form.description" rows="3" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340] resize-none" placeholder="Description de la matière..."></textarea>
          </div>
        </form>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-800 flex justify-end gap-4 bg-gray-800/10">
          <button
            @click="store.fermerModal()"
            class="px-6 py-2.5 rounded-xl border border-gray-700 text-[#0C2340] hover:bg-gray-800 transition-all text-sm font-medium"
          >
            Annuler
          </button>
          <button
            @click="submit"
            :disabled="isLoading"
            class="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emit-blue to-emit-purple text-white font-bold text-sm shadow-lg shadow-emit-blue/20 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save v-if="!isLoading" :size="18" />
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
