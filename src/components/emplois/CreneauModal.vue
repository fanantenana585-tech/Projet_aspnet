<script setup>
import { ref, reactive, watch, computed, watchEffect, onMounted, onUnmounted } from 'vue';
import { useEmploiStore } from '@/stores/emploiStore';
import { useMatiereStore } from '@/stores/matiereStore';
import { useEnseignantStore } from '@/stores/enseignantStore';
import { useSalleStore } from '@/stores/salleStore';
import { useFiliereStore } from '@/stores/filiereStore';
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
const enseignantStore = useEnseignantStore();
const salleStore = useSalleStore();
const filiereStore = useFiliereStore();

const isLoading = ref(false);
const forceSave = ref(false);
const showDeleteConfirm = ref(false);
const deleteOption = ref('only'); // 'only' or 'all'
const saveError = ref('');

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

onMounted(async () => {
    await Promise.all([
        matiereStore.fetchMatieres(),
        enseignantStore.fetchEnseignants(),
        salleStore.fetchSalles(),
        filiereStore.fetchFilieres()
    ]);
});

// Cascading data
const filteredParcours = computed(() => {
  const m = filiereStore.mentions.find(m => m.id === form.mention);
  return m ? m.parcours : [];
});

const isMaster = computed(() => {
  const p = filiereStore.parcours.find(p => p.id === form.parcours);
  return p?.niveau === 'Master';
});

const niveauxDisponibles = computed(() => isMaster.value ? ['M1', 'M2'] : ['L1', 'L2', 'L3']);

const filteredMatieres = computed(() => {
  // Parcours is intentionally NOT used to filter matieres here so the two selects remain independent.
  return matiereStore.matieres.filter(m => {
    const matchMention = !form.mention || form.mention === 'toutes' ? true : m.mentionId === form.mention;
    const matchNiveau = !form.niveau || form.niveau === 'tous' ? true : m.niveau === form.niveau;

    const q = matiereSearch.value.toLowerCase();
    const matchSearch = (m.nom || '').toLowerCase().includes(q) || (m.code || '').toLowerCase().includes(q);

    return matchMention && matchNiveau && matchSearch;
  });
});

const filteredEnseignants = computed(() => {
  return enseignantStore.enseignants.filter(e =>
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
    saveError.value = '';
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
  const m = filiereStore.mentions.find(m => m.id === id);
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
  tryAutoFillEnseignantForMatiere(m);
};

// Auto-fill responsable enseignant when a matiere is selected
// Tries multiple possible fields returned by backend: `responsableEnseignant` (object) or `responsableEnseignantId` (id)
// Falls back to searching the enseignants list by id
const tryAutoFillEnseignantForMatiere = (m) => {
  if (!m) return;
  // If matiere already contains full enseignant object
  if (m.responsableEnseignant && m.responsableEnseignant.id) {
    form.enseignant = m.responsableEnseignant;
    enseignantSearch.value = `${form.enseignant.prenom} ${form.enseignant.nom}`;
    return;
  }

  // If matiere exposes an id field
  const possibleId = m.responsableEnseignantId || m.responsableId || m.responsable?.id;
  if (possibleId) {
    const enseignant = enseignantStore.enseignants.find(e => String(e.id) === String(possibleId));
    if (enseignant) {
      form.enseignant = enseignant;
      enseignantSearch.value = `${enseignant.prenom} ${enseignant.nom}`;
    }
  }
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
  const diff = (h2 * 60 + m2) - (h1 * m1);
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

const submit = async () => {
  if (!canSave.value) return;
  saveError.value = '';
  isLoading.value = true;

  const m = filiereStore.mentions.find(m => m.id === form.mention);
  const p = filiereStore.parcours.find(p => p.id === form.parcours);

  const payload = {
    ...form,
    mention: { id: m.id, nom: m.nom, couleur: m.couleur },
    parcours: { id: p.id, nom: p.nom, code: p.code, couleur: p.couleur }
  };

  try {    // ===== VÉRIFICATION DES CONFLITS AVANT ENREGISTREMENT =====
    const conflictCheck = store.verifierConflitsAvantEnregistrement(payload, form.id || null);
    if (conflictCheck.hasConflict) {
      // Afficher le message du premier conflit détecté
      saveError.value = conflictCheck.firstConflict.message;
      isLoading.value = false;
      return;
    }
    if (form.id) {
      await store.modifierCreneau(form.id, payload);
      emit('saved', 'Créneau modifié avec succès');
    } else {
      await store.ajouterCreneau(payload);
      emit('saved', 'Créneau ajouté avec succès');
    }
    emit('close');
  } catch (err) {
    saveError.value = err?.message || 'Impossible d’enregistrer ce créneau.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

const confirmDeleteAction = () => {
  store.supprimerCreneau(form.id, deleteOption.value === 'all');
  showDeleteConfirm.value = false;
  emit('close');
};

const closeOnEsc = (e) => { if (e.key === 'Escape' && props.isOpen) emit('close'); };
onMounted(() => {
  window.addEventListener('keydown', closeOnEsc);
});
onUnmounted(() => {
  window.removeEventListener('keydown', closeOnEsc);
});

// Safety helpers for template blur handlers
const onMatiereBlur = () => {
  globalThis.setTimeout(() => { showMatiereList.value = false; }, 200);
};
const onEnseignantBlur = () => {
  globalThis.setTimeout(() => { showEnseignantList.value = false; }, 200);
};

</script>

<template>
  <Transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <!-- Overlay -->
      <div class="absolute inset-0 bg-[#0C2340]/40 backdrop-blur-[4px]" @click="emit('close')"></div>

      <!-- Modal Card -->
      <div class="bg-[#1E293B] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-700 relative overflow-hidden flex flex-col max-h-screen animate-modal-in">

        <!-- Header -->
        <div class="p-5 border-b border-gray-700 flex justify-between items-center shrink-0">
          <div class="flex items-center gap-3">
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
        <div class="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">

          <!-- Section 1: Cours -->
          <div v-if="saveError" class="rounded-2xl border border-red-500 bg-red-500/10 p-4 text-sm text-red-600 font-medium">
            {{ saveError }}
          </div>
          <section class="space-y-4">
            <div class="flex items-center gap-3 border-l-4 border-[#38BDF8] pl-3">
              <BookOpen class="text-[#38BDF8]" :size="18" />
              <h3 class="text-xs font-black text-white">Informations du cours</h3>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1">
                <label class="text-xs font-medium text-white ml-1">Mention</label>
                <div class="grid grid-cols-3 gap-2">
                   <button
                     v-for="m in filiereStore.mentions" :key="m.id"
                     @click="selectMention(m.id)"
                     class="flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all duration-300"
                     :style="{
                        borderColor: form.mention === m.id ? m.couleur : '#BFDBFE',
                        backgroundColor: form.mention === m.id ? `${m.couleur}10` : '#F8FBFF'
                     }"
                   >
                      <span class="text-lg">{{ m.icone }}</span>
                      <span class="text-[8px] font-black uppercase" :style="{ color: form.mention === m.id ? m.couleur : '#64A8CC' }">{{ m.nom }}</span>
                   </button>
                </div>
              </div>

              <div class="space-y-1 relative">
                <label class="text-xs font-medium text-white ml-1">Parcours</label>
                <div class="relative">
                   <button
                     @click="showParcoursList = !showParcoursList"
                     class="w-full bg-white border-2 border-gray-300 rounded-xl p-2 flex items-center justify-between font-bold text-black text-sm hover:border-[#38BDF8] transition-all"
                   >
                      <div class="flex items-center gap-3">
                         <span class="bg-[#0EA5E91A] text-[#0EA5E9] px-2 py-0.5 rounded text-[10px] font-black">[{{ filiereStore.parcours.find(p => p.id === form.parcours)?.code }}]</span>
                         <span class="truncate max-w-[200px]">{{ filiereStore.parcours.find(p => p.id === form.parcours)?.nom }}</span>
                      </div>
                      <ChevronDown :size="20" class="text-gray-400" />
                   </button>

                   <div v-if="showParcoursList" class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-700 rounded-2xl shadow-2xl z-[60] overflow-hidden">
                      <div
                        v-for="p in filteredParcours" :key="p.id"
                        @click="selectParcours(p)"
                        class="p-4 hover:bg-gray-800/40 cursor-pointer flex items-center gap-3 border-b border-gray-700 last:border-0 group"
                      >
                         <span class="px-2 py-1 rounded bg-[#0EA5E91A] text-[#0EA5E9] text-[9px] font-black group-hover:bg-[#0EA5E9] group-hover:text-white transition-all">[{{ p.code }}]</span>
                         <span class="text-xs font-bold text-black">{{ p.nom }}</span>
                      </div>
                   </div>
                </div>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4">
               <div class="space-y-1">
                <label class="text-xs font-medium text-white ml-1">Niveau</label>
                <div class="flex bg-gray-800/40 p-1 rounded-xl border-2 border-gray-700">
                  <button
                    v-for="lvl in niveauxDisponibles" :key="lvl"
                    @click="form.niveau = lvl"
                    class="flex-1 py-2 rounded-lg text-xs font-black transition-all"
                    :class="form.niveau === lvl ? 'bg-[#38BDF8] text-white shadow-md' : 'text-gray-400 hover:text-white'"
                  >
                    {{ lvl }}
                  </button>
                </div>
              </div>

              <div class="space-y-1">
                <label class="text-xs font-medium text-white ml-1">Groupe</label>
                <div class="relative">
                   <select v-model="form.groupe" class="w-full bg-white border border-gray-300 text-black font-bold rounded-xl p-2 text-sm appearance-none outline-none focus:border-[#38BDF8] transition-all">
                     <option :value="null">Tous</option>
                     <option>Groupe A</option>
                     <option>Groupe B</option>
                   </select>
                   <Users class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :size="18" />
                </div>
              </div>
            </div>

            <div class="grid grid-cols-3 gap-4">
               <div class="col-span-2 space-y-1 relative">
                 <label class="text-xs font-medium text-white ml-1">Matière</label>
                 <div class="relative">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
                    <input
                      type="text" v-model="matiereSearch"
                      @focus="showMatiereList = true"
                      @blur="onMatiereBlur"
                      placeholder="Code ou nom de la matière..."
                      class="w-full bg-white border border-gray-300 text-black font-bold rounded-xl pl-10 pr-3 py-2 text-sm focus:border-[#38BDF8] outline-none transition-all"
                    >
                    <div v-if="showMatiereList && filteredMatieres.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-700 rounded-2xl shadow-2xl z-[50] max-h-60 overflow-y-auto custom-scrollbar">
                       <div
                         v-for="m in filteredMatieres" :key="m.id"
                         @mousedown.prevent="selectMatiere(m)"
                         class="p-4 hover:bg-gray-800/40 cursor-pointer flex items-center justify-between border-b border-gray-700"
                       >
                          <div class="flex flex-col">
                             <span class="text-sm font-black text-black">{{ m.nom }}</span>
                             <span class="text-[10px] font-bold text-gray-400 uppercase">{{ m.code }}</span>
                          </div>
                          <div class="w-3 h-3 rounded-full" :style="{ backgroundColor: m.couleur }"></div>
                       </div>
                    </div>
                 </div>
               </div>

               <div class="space-y-1">
                 <label class="text-xs font-medium text-white ml-1">Type</label>
                 <div class="flex bg-gray-800/40 p-1 rounded-xl border-2 border-gray-700 overflow-x-auto no-scrollbar">
                   <button
                     v-for="t in ['Cours','TD','TP','Examen','Projet']" :key="t"
                     @click="form.type = t"
                     class="flex-1 px-2 py-2 rounded-lg text-[8px] font-black uppercase transition-all whitespace-nowrap"
                     :class="form.type === t ? 'bg-[#38BDF8] text-white shadow-md' : 'text-gray-400 hover:text-white'"
                   >
                     {{ t }}
                   </button>
                 </div>
               </div>
            </div>
          </section>

          <!-- Section 2: Intervenant -->
          <section class="space-y-3">
            <div class="flex items-center justify-between">
               <div class="flex items-center gap-4 border-l-4 border-[#0EA5E9] pl-4">
                 <User class="text-[#0EA5E9]" :size="20" />
                 <h3 class="text-sm font-black text-white">Intervenant</h3>
               </div>
            </div>

            <div class="space-y-2">
               <div class="relative">
                  <Search class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" :size="16" />
                  <input
                    type="text" v-model="enseignantSearch"
                    @focus="showEnseignantList = true"
                    @blur="onEnseignantBlur"
                    placeholder="Chercher par nom ou initiales..."
                    class="w-full bg-white border border-gray-300 text-black font-bold rounded-xl pl-10 pr-3 py-2 text-sm focus:border-[#38BDF8] outline-none transition-all"
                  >
                  <div v-if="showEnseignantList && filteredEnseignants.length > 0" class="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-gray-700 rounded-2xl shadow-2xl z-[50] max-h-60 overflow-y-auto custom-scrollbar">
                     <div
                        v-for="e in filteredEnseignants" :key="e.id"
                        @mousedown.prevent="selectEnseignant(e)"
                        class="p-4 hover:bg-gray-800/40 cursor-pointer flex items-center gap-4 border-b border-gray-700"
                     >
                        <div class="w-10 h-10 rounded-xl bg-[#0EA5E9]/10 text-[#0EA5E9] flex items-center justify-center font-black text-xs">{{ e.initiales }}</div>
                        <div class="flex flex-col">
                           <span class="text-sm font-black text-black">{{ e.prenom }} {{ e.nom }}</span>
                           <span class="text-[9px] font-bold text-gray-400">{{ e.email }}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <!-- Section 3: Lieu & Temps -->
          <section class="space-y-3">
            <div class="flex items-center gap-3 border-l-4 border-[#059669] pl-3">
              <MapPin class="text-[#059669]" :size="18" />
              <h3 class="text-xs font-black text-white">Lieu et Temps</h3>
            </div>

            <div class="space-y-3">
               <div class="flex gap-1 p-1 bg-gray-800/40 rounded-xl border-2 border-gray-700">
                  <button
                    v-for="j in ['Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi']" :key="j"
                    @click="form.jour = j"
                    class="flex-1 py-2 rounded-lg text-[9px] font-black uppercase transition-all"
                    :class="form.jour === j ? 'bg-emit-blue text-white shadow-md border-transparent' : 'text-gray-400 hover:text-white'"
                  >
                    {{ j }}
                  </button>
               </div>

               <div class="grid grid-cols-3 gap-3 items-end">
                  <div class="col-span-2 grid grid-cols-2 gap-3">
                     <div class="space-y-1">
                        <label class="text-xs font-medium text-white ml-1">Début</label>
                        <input type="time" v-model="form.heureDebut" class="w-full bg-white border-2 border-gray-300 rounded-lg p-2 font-black text-black text-sm focus:border-[#38BDF8] outline-none">
                     </div>
                     <div class="space-y-1">
                        <label class="text-xs font-medium text-white ml-1">Fin</label>
                        <input type="time" v-model="form.heureFin" class="w-full bg-white border-2 border-gray-300 rounded-lg p-2 font-black text-black text-sm focus:border-[#38BDF8] outline-none">
                     </div>
                  </div>
                  <div class="space-y-1">
                     <label class="text-xs font-medium text-white ml-1">Salle</label>
                     <div class="relative">
                        <select v-model="form.salle" class="w-full bg-white border border-gray-300 text-black font-bold rounded-lg p-2 text-sm appearance-none outline-none focus:border-[#38BDF8]">
                           <option :value="null">Sélectionner...</option>
                           <option v-for="s in salleStore.salles" :key="s.id" :value="s">
                              {{ s.nom }} - {{ s.batiment }} ({{ s.capacite }}p)
                           </option>
                        </select>
                        <MapPin class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" :size="16" />
                     </div>
                  </div>
               </div>
            </div>
          </section>

          <!-- Section 6: Note -->
          <section class="space-y-2">
            <div class="flex items-center gap-3 border-l-4 border-gray-700 pl-3">
              <MessageSquare class="text-gray-400" :size="18" />
              <h3 class="text-xs font-black text-white">Notes</h3>
            </div>
            <textarea v-model="form.note" rows="1" class="w-full bg-white border-2 border-gray-300 rounded-lg p-3 text-sm font-medium text-black focus:border-[#38BDF8] outline-none resize-none" placeholder="Ajouter une consigne..."></textarea>
          </section>
        </div>

        <!-- Footer -->
        <div class="p-4 border-t border-gray-700 flex justify-end gap-3 bg-gray-800/10">
          <button @click="emit('close')" class="px-6 py-3 rounded-lg font-black text-gray-400 uppercase text-[9px] tracking-widest hover:bg-white transition-all">Annuler</button>
          <button
             @click="submit"
             :disabled="isLoading || !canSave"
             class="min-w-[180px] px-8 py-3 bg-gradient-to-r from-emit-blue to-emit-purple text-white rounded-lg font-black uppercase tracking-widest shadow-xl shadow-[#38BDF8]/20 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 disabled:translate-y-0 text-sm"
          >
            <span v-if="!isLoading" class="flex items-center justify-center gap-2">
                <Check :size="16" /> {{ form.id ? 'Enregistrer' : 'Confirmer' }}
             </span>
             <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto"></div>
          </button>
        </div>

        <!-- Delete Confirmation -->
        <div v-if="showDeleteConfirm" class="absolute inset-0 z-[210] flex items-center justify-center p-8 bg-[#0C2340]/60 backdrop-blur-md">
           <div class="bg-[#1E293B] w-full max-w-md rounded-[2.5rem] p-10 shadow-2xl border border-gray-700">
              <div class="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6"><Trash2 :size="40" /></div>
              <h3 class="text-xl font-black text-white text-center mb-2">Supprimer ce créneau ?</h3>
              <div class="flex gap-4">
                 <button @click="showDeleteConfirm = false" class="flex-1 py-4 font-black text-[10px] uppercase text-gray-400">Annuler</button>
                 <button @click="confirmDeleteAction" class="flex-1 py-4 bg-red-500 text-white rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-red-200">Supprimer</button>
              </div>
           </div>
        </div>

      </div>
    </div>
  </Transition>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 5px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #BFDBFE; border-radius: 10px; }
.no-scrollbar::-webkit-scrollbar { display: none; }
</style>
