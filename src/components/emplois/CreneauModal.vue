<script setup>
import { ref, reactive, watch, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import { useEmploiStore, ENS, SALLES } from '@/stores/emploiStore';
import { useMatiereStore, MENTIONS_EMIT } from '@/stores/matiereStore';
import { MOCK_PARCOURS } from '@/stores/filiereStore';
import {
  X, Check, Calendar, Clock, MapPin, Users, BookOpen,
  Info, AlertTriangle, User, ShieldCheck, ShieldAlert,
  History, MessageSquare, Search, Trash2, AlertCircle,
  ChevronDown, RotateCcw, Layout
} from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean,
});

const emit = defineEmits(['close']);
const store = useEmploiStore();
const matiereStore = useMatiereStore();

const isLoading = ref(false);
const forceSave = ref(false);
const showDeleteConfirm = ref(false);
const deleteOption = ref('only'); // 'only' or 'all'

const form = reactive({
  id: null,
  matiere: null,
  enseignant: null,
  salle: null,
  mention: 'mention-info',
  parcours: 'DA2I',
  niveau: 'L1',
  groupe: null,
  jour: 'Lundi',
  heureDebut: '08:00',
  heureFin: '10:00',
  type: 'Cours',
  recurrent: false,
  dateDebut: '',
  dateFin: '',
  exceptions: [],
  note: ''
});

// Dropdown states
const showMatiereList = ref(false);
const matiereSearch = ref('');
const showEnseignantList = ref(false);
const enseignantSearch = ref('');
const showParcoursList = ref(false);

// Cascading data
const filteredParcours = computed(() => {
  const m = MENTIONS_EMIT.find(m => m.id === form.mention);
  return m ? m.parcours : [];
});

const isMaster = computed(() => {
  const p = MOCK_PARCOURS.find(p => p.id === form.parcours);
  return p?.niveau === 'Master';
});

const niveauxDisponibles = computed(() => isMaster.value ? ['M1', 'M2'] : ['L1', 'L2', 'L3']);

const filteredMatieres = computed(() => {
  return matiereStore.matieres.filter(m => {
    const matchFiltre = m.mentionId === form.mention &&
      (m.parcours === form.parcours || m.mentionId === 'transversal') &&
      m.niveau === form.niveau;

    const matchSearch = m.nom.toLowerCase().includes(matiereSearch.value.toLowerCase()) ||
                        m.code.toLowerCase().includes(matiereSearch.value.toLowerCase());

    return matchFiltre && matchSearch;
  });
});

const filteredEnseignants = computed(() => {
  return Object.values(ENS).filter(e =>
    e.nom.toLowerCase().includes(enseignantSearch.value.toLowerCase()) ||
    e.prenom.toLowerCase().includes(enseignantSearch.value.toLowerCase()) ||
    e.initiales.toLowerCase().includes(enseignantSearch.value.toLowerCase())
  );
});

// Conflict Checks
const teacherStatus = ref({ ok: true, msg: 'disponible', details: '' });
const roomStatus = ref({ ok: true, msg: 'libre', details: '' });
const groupStatus = ref({ ok: true, msg: 'pas de chevauchement' });

const checkConflicts = () => {
  if (!form.jour || !form.heureDebut || !form.heureFin) return;

  const h2m = (h) => {
    const [hh, mm] = h.split(':').map(Number);
    return hh * 60 + mm;
  };
  const start = h2m(form.heureDebut);
  const end = h2m(form.heureFin);

  const overlaps = store.emplois.filter(e => {
    if (e.id === form.id) return false;
    if (e.jour !== form.jour) return false;
    const eStart = h2m(e.heureDebut);
    const eEnd = h2m(e.heureFin);
    return Math.max(start, eStart) < Math.min(end, eEnd);
  });

  // Teacher
  if (form.enseignant) {
    const conflict = overlaps.find(e => e.enseignant.id === form.enseignant.id);
    teacherStatus.value = conflict
      ? { ok: false, msg: 'conflit', details: `avec [${conflict.matiere.code}] ${conflict.matiere.nom} ${conflict.jour} ${conflict.heureDebut}` }
      : { ok: true, msg: 'disponible', details: '' };
  } else {
     teacherStatus.value = { ok: true, msg: 'sélectionner un enseignant', details: '' };
  }

  // Room
  if (form.salle) {
    const conflict = overlaps.find(e => e.salle.id === form.salle.id);
    roomStatus.value = conflict
      ? { ok: false, msg: 'occupée', details: `par [${conflict.matiere.code}]` }
      : { ok: true, msg: 'libre', details: '' };
  } else {
     roomStatus.value = { ok: true, msg: 'sélectionner une salle', details: '' };
  }

  // Group
  const groupConflict = overlaps.find(e =>
    e.parcours.id === form.parcours &&
    e.niveau === form.niveau &&
    (e.groupe === form.groupe || !e.groupe || !form.groupe)
  );
  groupStatus.value = groupConflict
    ? { ok: false, msg: 'groupe déjà en cours' }
    : { ok: true, msg: 'pas de chevauchement' };
};

watchEffect(() => {
  checkConflicts();
});

// Weekly Load
const teacherLoad = computed(() => {
  if (!form.enseignant) return 0;
  return store.chargesEnseignants[form.enseignant.id] || 0;
});

// Modal Initialization
watch(() => props.isOpen, (val) => {
  if (val) {
    if (store.creneauEnEdition) {
      const c = store.creneauEnEdition;
      Object.assign(form, JSON.parse(JSON.stringify(c)));
      form.mention = typeof c.mention === 'object' ? c.mention.id : c.mention;
      form.parcours = typeof c.parcours === 'object' ? c.parcours.id : c.parcours;
      matiereSearch.value = c.matiere ? `[${c.matiere.code}] ${c.matiere.nom}` : '';
      enseignantSearch.value = c.enseignant ? `${c.enseignant.prenom} ${c.enseignant.nom}` : '';
    } else {
      resetForm();
      if (store.donneesParDefaut) {
        Object.assign(form, store.donneesParDefaut);
      }
    }
    forceSave.value = false;
    showDeleteConfirm.value = false;
  }
});

function resetForm() {
  Object.assign(form, {
    id: null, matiere: null, enseignant: null, salle: null,
    mention: 'mention-info', parcours: 'DA2I', niveau: 'L1', groupe: null, jour: 'Lundi',
    heureDebut: '08:00', heureFin: '10:00', type: 'Cours', recurrent: false, dateDebut: '', dateFin: '', exceptions: [], note: ''
  });
  matiereSearch.value = '';
  enseignantSearch.value = '';
}

const selectMention = (id) => {
  form.mention = id;
  const m = MENTIONS_EMIT.find(m => m.id === id);
  if (m && m.parcours.length > 0) {
    selectParcours(m.parcours[0]);
  }
};

const selectParcours = (p) => {
  form.parcours = p.id;
  form.niveau = p.niveau === 'Master' ? 'M1' : 'L1';
  form.matiere = null;
  matiereSearch.value = '';
  showParcoursList.value = false;
};

const selectMatiere = (m) => {
  form.matiere = m;
  matiereSearch.value = `[${m.code}] ${m.nom}`;
  showMatiereList.value = false;
};

const selectEnseignant = (e) => {
  form.enseignant = e;
  enseignantSearch.value = `${e.prenom} ${e.nom}`;
  showEnseignantList.value = false;
};

const dureeLabel = computed(() => {
  if (!form.heureDebut || !form.heureFin) return '0h 00min';
  const [h1, m1] = form.heureDebut.split(':').map(Number);
  const [h2, m2] = form.heureFin.split(':').map(Number);
  const diff = (h2 * 60 + m2) - (h1 * 60 + m1);
  if (diff <= 0) return '0h 00min';
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  return `${h}h ${m.toString().padStart(2, '0')}min`;
});

const canSave = computed(() => {
  const essential = form.matiere && form.enseignant && form.salle;
  if (!essential) return false;
  if (forceSave.value) return true;
  return teacherStatus.value.ok && roomStatus.value.ok;
});

const submit = () => {
  if (!canSave.value) return;
  isLoading.value = true;

  const m = MENTIONS_EMIT.find(m => m.id === form.mention);
  const p = MOCK_PARCOURS.find(p => p.id === form.parcours);

  const payload = {
    ...form,
    mention: { id: m.id, nom: m.nom, couleur: m.couleur },
    parcours: { id: p.id, nom: p.nom, code: p.code, couleur: p.couleur }
  };

  if (form.id) store.modifierCreneau(form.id, payload);
  else store.ajouterCreneau(payload);

  setTimeout(() => {
    isLoading.value = false;
    emit('close');
  }, 400);
};

const confirmDelete = () => {
  store.supprimerCreneau(form.id, deleteOption.value === 'all');
  showDeleteConfirm.value = false;
  emit('close');
};

const closeOnEsc = (e) => { if (e.key === 'Escape' && props.isOpen) emit('close'); };
onMounted(() => window.addEventListener('keydown', closeOnEsc));
onUnmounted(() => window.removeEventListener('keydown', closeOnEsc));

</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-[#0C2340]/40 backdrop-blur-[4px]" @click="emit('close')"></div>

      <!-- Modal Card -->
      <div class="bg-[#1E293B] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden flex flex-col max-h-[92vh] animate-modal-in">

        <!-- Header -->
        <div class="p-8 border-b border-gray-700 flex justify-between items-center border-b border-gray-800 flex items-center justify-between shrink-0">
          <div class="flex items-center gap-6">
            <div class="w-14 h-14 rounded-2xl bg-[#38BDF8] text-white flex items-center justify-center shadow-lg shadow-[#38BDF8]/20 transition-transform hover:scale-110 duration-300">
               <Calendar v-if="!form.id" :size="28" />
               <RotateCcw v-else :size="28" />
            </div>
            <div>
              <h2 class="text-xl font-bold text-white tracking-tight">
                {{ form.id ? 'Modifier le créneau' : 'Nouveau créneau' }}
              </h2>
              <p class="text-sm font-medium text-white uppercase tracking-[0.2em] mt-0.5">Planning Académique EMIT</p>
            </div>
          </div>
          <div class="flex items-center gap-4">
            <button v-if="form.id" @click="showDeleteConfirm = true" class="p-3 bg-red-50 text-red-400 rounded-2xl hover:bg-red-100 hover:text-red-600 transition-all">
               <Trash2 :size="20" />
            </button>
            <button @click="emit('close')" class="p-3 bg-transparent text-white hover:text-white rounded-full hover:bg-gray-800 hover:text-red-500 shadow-sm border border-gray-700 transition-all hover:rotate-90">
              <X :size="20" />
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-y-auto p-10 space-y-12 custom-scrollbar">

          <!-- Section 1: Cours -->
          <section class="space-y-8 animate-fade-slide-up">
            <div class="flex items-center gap-4 border-l-4 border-[#38BDF8] pl-4">
              <BookOpen class="text-[#38BDF8]" :size="20" />
              <h3 class="text-sm font-black text-white font-medium">Informations du cours</h3>
            </div>

            <div class="grid grid-cols-2 gap-8">
              <!-- Mention Cascading -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white ml-1">Mention</label>
                <div class="grid grid-cols-3 gap-3">
                   <button
                     v-for="m in MENTIONS_EMIT" :key="m.id"
                     @click="selectMention(m.id)"
                     class="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300"
                     :style="{
                        borderColor: form.mention === m.id ? m.couleur : '#BFDBFE',
                        backgroundColor: form.mention === m.id ? `${m.couleur}10` : '#F8FBFF'
                     }"
                   >
                      <span class="text-2xl">{{ m.icone }}</span>
                      <span class="text-[10px] font-black uppercase" :style="{ color: form.mention === m.id ? m.couleur : '#64A8CC' }">{{ m.nom }}</span>
                   </button>
                </div>
              </div>

              <!-- Parcours Dropdown -->
              <div class="space-y-2 animate-fade-slide-down" :key="form.mention">
                <label class="text-sm font-medium text-white ml-1">Parcours</label>
                <div class="relative">
                   <button
                     @click="showParcoursList = !showParcoursList"
                     class="w-full bg-white border-2 border-gray-300 rounded-2xl p-4 flex items-center justify-between font-bold text-white hover:border-[#38BDF8] transition-all"
                   >
                      <div class="flex items-center gap-3">
                         <span class="bg-[#0EA5E91A] text-[#0EA5E9] px-2 py-0.5 rounded text-[10px] font-black">[{{ MOCK_PARCOURS.find(p => p.id === form.parcours)?.code }}]</span>
                         <span class="truncate max-w-[200px]">{{ MOCK_PARCOURS.find(p => p.id === form.parcours)?.nom }}</span>
                      </div>
                      <ChevronDown :size="20" class="text-gray-400" />
                   </button>

                   <div v-if="showParcoursList" class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-700 rounded-2xl shadow-2xl z-[60] overflow-hidden animate-fade-slide-down">
                      <div
                        v-for="p in filteredParcours" :key="p.id"
                        @click="selectParcours(p)"
                        class="p-4 hover:bg-gray-800/40 cursor-pointer flex items-center gap-3 border-b border-gray-700 last:border-0 group"
                      >
                         <span class="px-2 py-1 rounded bg-[#0EA5E91A] text-[#0EA5E9] text-[9px] font-black group-hover:bg-[#0EA5E9] group-hover:text-white transition-all">[{{ p.code }}]</span>
                         <span class="text-xs font-bold text-white">{{ p.nom }}</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-8">
               <!-- Niveau Pills -->
               <div class="space-y-2 animate-fade-slide-down" :key="form.parcours">
                <label class="text-sm font-medium text-white ml-1">Niveau</label>
                <div class="flex bg-gray-800/40 p-1.5 rounded-2xl border-2 border-gray-700">
                  <button
                    v-for="lvl in niveauxDisponibles" :key="lvl"
                    @click="form.niveau = lvl"
                    class="flex-1 py-3 rounded-xl text-xs font-black transition-all"
                    :class="form.niveau === lvl ? 'bg-[#38BDF8] text-white shadow-md' : 'text-gray-400 hover:text-white'"
                  >
                    {{ lvl }}
                  </button>
                </div>
              </div>

              <!-- Groupe Dropdown -->
              <div class="space-y-2">
                <label class="text-sm font-medium text-white ml-1">Groupe</label>
                <div class="relative">
                   <select v-model="form.groupe" class="w-full bg-white border border-gray-300 text-black font-bold rounded-2xl p-4 appearance-none outline-none focus:border-[#38BDF8] transition-all">
                     <option :value="null">Tous</option>
                     <option>Groupe A</option>
                     <option>Groupe B</option>
                   </select>
                   <Users class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :size="18" />
                </div>
              </div>
            </div>

            <!-- Matière Searchable -->
            <div class="grid grid-cols-3 gap-8">
               <div class="col-span-2 space-y-2 relative animate-fade-slide-down" :key="form.parcours + form.niveau">
                 <label class="text-sm font-medium text-white ml-1">Matière</label>
                 <div class="relative">
                    <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
                    <input
                      type="text" v-model="matiereSearch"
                      @focus="showMatiereList = true"
                      @blur="setTimeout(() => showMatiereList = false, 200)"
                      placeholder="Code ou nom de la matière..."
                      class="w-full bg-white border border-gray-300 text-black font-bold rounded-2xl pl-12 pr-4 py-4 focus:border-[#38BDF8] outline-none transition-all"
                    >
                    <div v-if="showMatiereList && filteredMatieres.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-700 rounded-2xl shadow-2xl z-[50] max-h-60 overflow-y-auto custom-scrollbar">
                       <div
                         v-for="m in filteredMatieres" :key="m.id"
                         @mousedown.prevent="selectMatiere(m)"
                         class="p-4 hover:bg-gray-800/40 cursor-pointer flex items-center justify-between border-b border-gray-700"
                       >
                          <div class="flex flex-col">
                             <span class="text-sm font-black text-white">{{ m.nom }}</span>
                             <span class="text-[10px] font-bold text-gray-400 uppercase">{{ m.code }}</span>
                          </div>
                          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: m.couleur }"></div>
                       </div>
                    </div>
                 </div>
               </div>

               <!-- Type Pills -->
               <div class="space-y-2">
                 <label class="text-sm font-medium text-white ml-1">Type</label>
                 <div class="flex bg-gray-800/40 p-1.5 rounded-2xl border-2 border-gray-700 overflow-x-auto no-scrollbar">
                   <button
                     v-for="t in ['Cours','TD','TP','Examen','Projet']" :key="t"
                     @click="form.type = t"
                     class="flex-1 px-3 py-3 rounded-xl text-[9px] font-black uppercase transition-all whitespace-nowrap"
                     :class="form.type === t ? 'bg-[#38BDF8] text-white shadow-md' : 'text-gray-400 hover:text-white'"
                   >
                     {{ t }}
                   </button>
                 </div>
               </div>
            </div>
          </section>

          <!-- Section 2: Intervenant -->
          <section class="space-y-6 animate-fade-slide-up" style="animation-delay: 0.1s">
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-4 border-l-4 border-[#0EA5E9] pl-4">
                 <User class="text-[#0EA5E9]" :size="20" />
                 <h3 class="text-sm font-black text-white font-medium">Intervenant</h3>
               </div>
               <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-white uppercase">Charge:</span>
                  <span class="text-xs font-black" :class="teacherLoad > 18 ? 'text-[#D97706]' : 'text-[#059669]'">{{ teacherLoad }}h / 20h</span>
               </div>
            </div>

            <div class="space-y-4">
               <div class="relative">
                  <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" :size="18" />
                  <input
                    type="text" v-model="enseignantSearch"
                    @focus="showEnseignantList = true"
                    @blur="setTimeout(() => showEnseignantList = false, 200)"
                    placeholder="Chercher par nom ou initiales..."
                    class="w-full bg-white border border-gray-300 text-black font-bold rounded-2xl pl-12 pr-4 py-4 focus:border-[#38BDF8] outline-none transition-all"
                  >
                  <div v-if="showEnseignantList && filteredEnseignants.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-700 rounded-2xl shadow-2xl z-[50] max-h-60 overflow-y-auto custom-scrollbar">
                     <div
                        v-for="e in filteredEnseignants" :key="e.id"
                        @mousedown.prevent="selectEnseignant(e)"
                        class="p-4 hover:bg-gray-800/40 cursor-pointer flex items-center gap-4 border-b border-gray-700"
                     >
                        <div class="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-black text-xs">{{ e.initiales }}</div>
                        <div class="flex flex-col">
                           <span class="text-sm font-black text-white">{{ e.prenom }} {{ e.nom }}</span>
                           <span class="text-[9px] font-bold text-gray-400">{{ e.email }}</span>
                        </div>
                     </div>
                  </div>
               </div>

               <div class="space-y-2">
                  <div class="h-2 w-full bg-gray-800/40 rounded-full overflow-hidden border border-gray-700/50 relative">
                     <div
                        class="h-full transition-all duration-1000"
                        :class="teacherLoad > 18 ? 'bg-[#D97706]' : 'bg-[#38BDF8]'"
                        :style="{ width: Math.min((teacherLoad/20)*100, 100) + '%' }"
                     ></div>
                  </div>
                  <p v-if="teacherLoad >= 18" class="flex items-center gap-2 text-[11px] font-bold text-[#D97706] bg-[#D97706]/5 p-3 rounded-xl border border-[#D97706]/20">
                     <AlertTriangle :size="14" /> Charge élevée : {{ teacherLoad }} h cette semaine.
                  </p>
               </div>
            </div>
          </section>

          <!-- Section 3: Lieu & Temps -->
          <section class="space-y-8 animate-fade-slide-up" style="animation-delay: 0.2s">
            <div class="flex items-center gap-4 border-l-4 border-[#059669] pl-4">
              <MapPin class="text-[#059669]" :size="20" />
              <h3 class="text-sm font-black text-white font-medium">Lieu et Temps</h3>
            </div>

            <div class="space-y-8">
               <div class="flex gap-2 p-1.5 bg-gray-800/40 rounded-[1.5rem] border-2 border-gray-700">
                  <button
                    v-for="j in ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']" :key="j"
                    @click="form.jour = j"
                    class="flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all"
                    :class="form.jour === j ? 'bg-emit-blue text-white shadow-md border-transparent' : 'text-gray-400 hover:text-white'"
                  >
                    {{ j }}
                  </button>
               </div>

               <div class="grid grid-cols-3 gap-8 items-end">
                  <div class="col-span-2 grid grid-cols-2 gap-6">
                     <div class="space-y-2">
                        <label class="text-sm font-medium text-white ml-1">Début</label>
                        <input type="time" v-model="form.heureDebut" class="w-full bg-white border-2 border-gray-300 rounded-2xl p-4 font-black text-black focus:border-[#38BDF8] outline-none">
                        <div class="flex flex-wrap gap-2 mt-2">
                           <button v-for="s in ['08:00', '10:30', '14:00', '16:00']" :key="s" @click="form.heureDebut = s" class="text-[9px] font-black bg-gray-800 border border-gray-700 text-white px-2 py-1 rounded-lg text-gray-400 hover:text-[#38BDF8] hover:border-[#38BDF8] transition-all">{{ s }}</button>
                        </div>
                     </div>
                     <div class="space-y-2">
                        <label class="text-sm font-medium text-white ml-1">Fin</label>
                        <input type="time" v-model="form.heureFin" class="w-full bg-white border-2 border-gray-300 rounded-2xl p-4 font-black text-black focus:border-[#38BDF8] outline-none">
                        <p class="text-sm font-medium text-white text-right mt-1">Durée : <span class="text-[#38BDF8]">{{ dureeLabel }}</span></p>
                     </div>
                  </div>
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-white ml-1">Salle</label>
                     <div class="relative">
                        <select v-model="form.salle" class="w-full bg-white border border-gray-300 text-black font-bold rounded-2xl p-4 appearance-none outline-none focus:border-[#38BDF8]">
                           <option :value="null">Sélectionner...</option>
                           <option v-for="s in Object.values(SALLES)" :key="s.id" :value="s">
                              {{ s.nom }} - {{ s.batiment }} ({{ s.capacite }}p)
                           </option>
                        </select>
                        <MapPin class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :size="18" />
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <!-- Section 4: Conflits -->
          <section class="bg-gray-800/40 p-8 rounded-[2.5rem] border border-gray-700 space-y-6 animate-fade-slide-up" style="animation-delay: 0.3s">
             <div class="flex items-center justify-between">
                <div class="flex items-center gap-4">
                   <ShieldCheck class="text-[#38BDF8]" :size="24" />
                   <h3 class="text-sm font-black text-white font-medium">Vérification temps réel</h3>
                </div>
                <div class="flex items-center gap-3">
                   <span class="text-sm font-medium text-white uppercase">Forcer ?</span>
                   <button @click="forceSave = !forceSave" class="w-10 h-5 rounded-full relative transition-all" :class="forceSave ? 'bg-red-500' : 'bg-[#BFDBFE]'">
                      <div class="absolute top-1 w-3 h-3 bg-white rounded-full transition-all" :style="{ left: forceSave ? '24px' : '4px' }"></div>
                   </button>
                </div>
             </div>

             <div class="space-y-3">
                <div class="flex items-center justify-between p-4 rounded-2xl transition-all duration-500" :class="teacherStatus.ok ? 'bg-green-50' : 'bg-red-50 animate-conflict-flash'">
                   <div class="flex items-center gap-3">
                      <component :is="teacherStatus.ok ? Check : ShieldAlert" :size="18" :class="teacherStatus.ok ? 'text-green-500' : 'text-red-500'" />
                      <span class="text-xs font-bold" :class="teacherStatus.ok ? 'text-green-700' : 'text-red-700'">Enseignant : {{ teacherStatus.ok ? '✅ ' + teacherStatus.msg : '⚠️ ' + teacherStatus.msg }}</span>
                   </div>
                   <span class="text-[10px] font-medium text-red-400 italic">{{ teacherStatus.details }}</span>
                </div>
                <div class="flex items-center justify-between p-4 rounded-2xl transition-all duration-500" :class="roomStatus.ok ? 'bg-green-50' : 'bg-red-50 animate-conflict-flash'">
                   <div class="flex items-center gap-3">
                      <component :is="roomStatus.ok ? Check : ShieldAlert" :size="18" :class="roomStatus.ok ? 'text-green-500' : 'text-red-500'" />
                      <span class="text-xs font-bold" :class="roomStatus.ok ? 'text-green-700' : 'text-red-700'">Salle : {{ roomStatus.ok ? '✅ ' + roomStatus.msg : '❌ ' + roomStatus.msg }}</span>
                   </div>
                   <span class="text-[10px] font-medium text-red-400 italic">{{ roomStatus.details }}</span>
                </div>
                <div class="flex items-center justify-between p-4 rounded-2xl transition-all duration-500" :class="groupStatus.ok ? 'bg-green-50' : 'bg-orange-50 animate-conflict-flash'">
                   <div class="flex items-center gap-3">
                      <component :is="groupStatus.ok ? Check : AlertTriangle" :size="18" :class="groupStatus.ok ? 'text-green-500' : 'text-orange-500'" />
                      <span class="text-xs font-bold" :class="groupStatus.ok ? 'text-green-700' : 'text-orange-700'">Groupe : {{ groupStatus.ok ? '✅ ' + groupStatus.msg : '⚠️ ' + groupStatus.msg }}</span>
                   </div>
                </div>
             </div>
          </section>

          <!-- Section 5: Récurrence -->
          <section class="space-y-6 animate-fade-slide-up" style="animation-delay: 0.4s">
            <div class="flex items-center justify-between border-l-4 border-[#EC4899] pl-4">
               <div class="flex items-center gap-4">
                 <History class="text-[#EC4899]" :size="20" />
                 <h3 class="text-sm font-black text-white font-medium">Récurrence</h3>
               </div>
               <button @click="form.recurrent = !form.recurrent" class="w-12 h-6 rounded-full relative transition-all" :class="form.recurrent ? 'bg-[#EC4899]' : 'bg-[#BFDBFE]'">
                  <div class="absolute top-1 w-4 h-4 bg-white rounded-full transition-all" :style="{ left: form.recurrent ? '26px' : '4px' }"></div>
               </button>
            </div>
            <Transition name="expand">
               <div v-if="form.recurrent" class="grid grid-cols-2 gap-8 p-8 bg-gray-800/40 rounded-[2rem] border border-gray-700">
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-white ml-1">Début</label>
                     <input type="date" v-model="form.dateDebut" class="w-full bg-white border-2 border-gray-700 rounded-2xl p-4 font-bold text-sm outline-none focus:border-[#EC4899]">
                  </div>
                  <div class="space-y-2">
                     <label class="text-sm font-medium text-white ml-1">Fin</label>
                     <input type="date" v-model="form.dateFin" class="w-full bg-white border-2 border-gray-700 rounded-2xl p-4 font-bold text-sm outline-none focus:border-[#EC4899]">
                  </div>
               </div>
            </Transition>
          </section>

          <!-- Section 6: Note -->
          <section class="space-y-4 animate-fade-slide-up" style="animation-delay: 0.5s">
            <div class="flex items-center gap-4 border-l-4 border-gray-700 pl-4">
              <MessageSquare class="text-gray-400" :size="20" />
              <h3 class="text-sm font-black text-white font-medium">Notes</h3>
            </div>
            <textarea v-model="form.note" rows="2" class="w-full bg-white border-2 border-gray-300 rounded-[1.5rem] p-6 text-sm font-medium text-[#1E5F8E] focus:border-[#38BDF8] outline-none resize-none" placeholder="Ajouter une consigne..."></textarea>
          </section>
        </div>

        <!-- Footer -->
        <div class="p-8 border-t border-gray-700 flex justify-between items-center bg-gray-800/10">
          <div class="flex flex-col">
             <div class="text-[10px] font-black uppercase text-gray-400 flex items-center gap-2">
                <div class="w-2 h-2 rounded-full" :class="canSave ? 'bg-green-500' : 'bg-red-500'"></div>
                {{ canSave ? 'Prêt à enregistrer' : 'Champs obligatoires ou conflits' }}
             </div>
          </div>

          <div class="flex gap-4">
             <button @click="emit('close')" class="px-8 py-4 rounded-2xl font-black text-gray-400 uppercase text-[10px] tracking-widest hover:bg-white transition-all">Annuler</button>
             <div class="relative group">
                <button
                   @click="submit"
                   :disabled="isLoading || !canSave"
                   class="min-w-[240px] px-10 py-4 bg-gradient-to-r from-emit-blue to-emit-purple text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#38BDF8]/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0"
                >
                   <span v-if="!isLoading" class="flex items-center justify-center gap-3">
                      <Check :size="18" /> {{ form.id ? 'Enregistrer les modifications' : 'Confirmer le créneau' }}
                   </span>
                   <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
                </button>
                <div v-if="!canSave" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2 bg-[#0C2340] text-white text-[9px] rounded-lg opacity-0 group-hover:opacity-100 transition-all pointer-events-none shadow-xl">
                   Résolvez les conflits avant d'enregistrer.
                </div>
             </div>
          </div>
        </div>

        <!-- Delete Confirmation -->
        <div v-if="showDeleteConfirm" class="absolute inset-0 z-[210] flex items-center justify-center p-8 bg-[#0C2340]/60 backdrop-blur-md animate-fade-in">
           <div class="bg-[#1E293B] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-gray-700 animate-modal-in">
              <div class="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><Trash2 :size="40" /></div>
              <h3 class="text-xl font-black text-white text-center mb-2">Supprimer ce créneau ?</h3>
              <p class="text-xs text-gray-400 text-center mb-8">Action irréversible pour <strong>{{ form.matiere?.nom }}</strong> le <strong>{{ form.jour }} à {{ form.heureDebut }}</strong>.</p>

              <div v-if="form.recurrent" class="grid grid-cols-1 gap-3 mb-8">
                 <button @click="deleteOption = 'only'" class="p-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all" :class="deleteOption === 'only' ? 'border-[#38BDF8] bg-gray-800/40 text-[#38BDF8]' : 'border-gray-700 text-gray-400'">Ce créneau uniquement</button>
                 <button @click="deleteOption = 'all'" class="p-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all" :class="deleteOption === 'all' ? 'border-[#EC4899] bg-[#FDF2F8] text-[#EC4899]' : 'border-gray-700 text-gray-400'">Tous les récurrents</button>
              </div>

              <div class="flex gap-4">
                 <button @click="showDeleteConfirm = false" class="flex-1 py-4 font-black text-[10px] uppercase text-gray-400">Annuler</button>
                 <button @click="confirmDelete" class="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-red-200">Supprimer</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active { animation: modalIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { animation: modalOut 0.18s ease-in; }

@keyframes modalIn {
  from { opacity: 0; transform: scale(0.9) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
@keyframes modalOut {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to { opacity: 0; transform: scale(0.9) translateY(10px); }
}

@keyframes fadeSlideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-slide-up { animation: fadeSlideUp 0.5s ease-out forwards; }

@keyframes fadeSlideDown {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-slide-down { animation: fadeSlideDown 0.2s ease-out forwards; }

@keyframes conflictFlash {
  0%, 100% { background-color: rgba(239, 68, 68, 0.05); }
  50% { background-color: rgba(239, 68, 68, 0.15); }
}
.animate-conflict-flash { animation: conflictFlash 0.6s ease infinite; }

.expand-enter-active, .expand-leave-active { transition: all 0.3s ease-out; max-height: 200px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; overflow: hidden; }

.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #BFDBFE; border-radius: 10px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>


