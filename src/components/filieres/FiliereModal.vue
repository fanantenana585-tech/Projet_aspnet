<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useFiliereStore } from '@/stores/filiereStore'
import { X, Save, GraduationCap, Edit2, Search } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  parcours: Object
})

const emit = defineEmits(['close'])
const store = useFiliereStore()

const isLoading = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const enseignants = ref([])
const filteredEnseignants = ref([])
const showEnseignantDropdown = ref(false)
const enseignantSearchTerm = ref('')
const mentionSearchTerm = ref('')
const filteredMentions = ref([])
const showMentionDropdown = ref(false)

const form = reactive({
  id: '',
  code: '',
  nom: '',
  nomCourt: '',
  mentionId: '',
  mentionNom: '',
  couleur: '#38BDF8',
  niveau: 'Licence',
  icone: '🌐',
  description: '',
  nbEtudiants: 0,
  anneeCreation: 2026,
  ouvertConcours: false,
  actif: true,
  responsableEnseignantId: null,
  responsableNom: '',
  responsableTitre: '',
  cursus: {}
})

onMounted(async () => {
  await Promise.all([fetchEnseignants(), ensureMentionsLoaded()])
})

watch(() => props.parcours, (newVal) => {
  if (newVal) {
    Object.assign(form, JSON.parse(JSON.stringify(newVal)))
    if (newVal.responsableEnseignant) {
      form.responsableNom = `${newVal.responsableEnseignant.prenom} ${newVal.responsableEnseignant.nom}`
      form.responsableTitre = newVal.responsableEnseignant.specialite || ''
    } else {
      form.responsableNom = ''
      form.responsableTitre = ''
    }
    if (store.mentions.length) {
      const mention = store.mentions.find(m => m.id === form.mentionId)
      form.mentionNom = mention?.nom || ''
    }
    errorMessage.value = ''
    successMessage.value = ''
  } else {
    resetForm()
  }
}, { immediate: true })

watch(() => form.nom, (newVal) => {
  if (newVal && !props.parcours) {
    form.code = generateCode(newVal)
  }
})

watch(() => enseignantSearchTerm.value, (newVal) => {
  if (newVal.trim()) {
    filteredEnseignants.value = enseignants.value.filter(e => 
      `${e.prenom} ${e.nom}`.toLowerCase().includes(newVal.toLowerCase()) ||
      e.specialite.toLowerCase().includes(newVal.toLowerCase())
    )
  } else {
    filteredEnseignants.value = []
  }
})

watch(() => mentionSearchTerm.value, (newVal) => {
  if (newVal.trim()) {
    filteredMentions.value = store.mentions.filter(m =>
      `${m.nom}`.toLowerCase().includes(newVal.toLowerCase()) ||
      `${m.icone}`.toLowerCase().includes(newVal.toLowerCase())
    )
  } else {
    filteredMentions.value = []
  }
})

watch(() => store.mentions, (newMentions) => {
  if (!form.mentionId && newMentions.length) {
    form.mentionId = newMentions[0].id
    form.mentionNom = newMentions[0].nom
  }
})

async function ensureMentionsLoaded() {
  if (!store.mentions.length) {
    await store.fetchFilieres()
  }
}


function resetForm() {
  const defaultMention = store.mentions?.[0]
  Object.assign(form, {
    id: '',
    code: '',
    nom: '',
    nomCourt: '',
    mentionId: defaultMention?.id ?? '',
    mentionNom: defaultMention?.nom ?? '',
    couleur: '#38BDF8',
    niveau: 'Licence',
    icone: '🌐',
    description: '',
    nbEtudiants: 0,
    anneeCreation: 2026,
    ouvertConcours: false,
    actif: true,
    responsableEnseignantId: null,
    responsableNom: '',
    responsableTitre: '',
    cursus: {}
  })
  errorMessage.value = ''
  successMessage.value = ''
  enseignantSearchTerm.value = ''
  mentionSearchTerm.value = ''
  filteredMentions.value = []
  filteredEnseignants.value = []
}

function generateCode(nom) {
  if (!nom) return ''
  return nom
    .trim()
    .split(/\s+/)
    .map(word => word.substring(0, 2).toUpperCase())
    .join('')
    .substring(0, 8)
}

function selectMention(mention) {
  form.mentionId = mention.id
  form.mentionNom = mention.nom
  mentionSearchTerm.value = ''
  filteredMentions.value = []
  showMentionDropdown.value = false
}

function selectEnseignant(enseignant) {
  form.responsableEnseignantId = enseignant.id
  form.responsableNom = `${enseignant.prenom} ${enseignant.nom}`
  form.responsableTitre = enseignant.specialite || ''
  enseignantSearchTerm.value = ''
  showEnseignantDropdown.value = false
  filteredEnseignants.value = []
}

async function fetchEnseignants() {
  try {
    const res = await fetch('/api/enseignants')
    if (res.ok) {
      enseignants.value = await res.json()
    }
  } catch (err) {
    console.error('Erreur lors du chargement des enseignants:', err)
  }
}

async function checkDuplicates() {
  if (!store.parcours.length) {
    return true
  }

  const existingByCode = store.parcours.filter(p => 
    p.code.toLowerCase() === form.code.toLowerCase() && p.id !== form.id
  )
  const existingByName = store.parcours.filter(p => 
    p.nom.toLowerCase() === form.nom.toLowerCase() && 
    p.mentionId === form.mentionId && 
    p.id !== form.id
  )

  if (existingByCode.length > 0) {
    errorMessage.value = `Un parcours avec le code "${form.code}" existe déjà.`
    return false
  }

  if (existingByName.length > 0) {
    errorMessage.value = `Un parcours nommé "${form.nom}" existe déjà dans cette mention.`
    return false
  }

  return true
}

const submit = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!form.nom.trim()) {
    errorMessage.value = 'Le nom du parcours est requis.'
    return
  }
  if (!form.code.trim()) {
    errorMessage.value = 'Le code du parcours est requis.'
    return
  }
  if (!form.mentionId) {
    errorMessage.value = 'La mention est requise.'
    return
  }
  if (!form.niveau) {
    errorMessage.value = 'Le niveau est requis.'
    return
  }

  const isDuplicate = !(await checkDuplicates())
  if (isDuplicate) {
    return
  }

  isLoading.value = true
  try {
    const payload = {
      code: form.code,
      nom: form.nom,
      description: form.description,
      niveau: form.niveau,
      nbEtudiants: form.nbEtudiants,
      ouvertConcours: form.ouvertConcours,
      actif: form.actif,
      mentionId: form.mentionId,
      responsableEnseignantId: form.responsableEnseignantId
    }

    let success
    if (form.id) {
      payload.id = form.id
      success = await store.modifierParcours(payload)
      if (!success) {
        errorMessage.value = store.notification.text || "Impossible de modifier le parcours."
        return
      }
      successMessage.value = 'Parcours modifié avec succès!'
    } else {
      success = await store.ajouterParcours(payload)
      if (!success) {
        errorMessage.value = store.notification.text || "Impossible d'ajouter le parcours."
        return
      }
      successMessage.value = 'Parcours créé avec succès!'
    }

    setTimeout(() => {
      emit('close')
    }, 800)
  } catch (err) {
    console.error(err)
    errorMessage.value = 'Une erreur est survenue lors de l’ajout du parcours.'
  } finally {
    isLoading.value = false
  }
}

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
    <div v-if="isOpen" class="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="$emit('close')"></div>

      <div class="relative bg-[#1E293B] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-700 overflow-hidden animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="p-6 border-b border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emit-blue/10 rounded-lg text-emit-blue">
              <Edit2 v-if="form.id" :size="20" />
              <GraduationCap v-else :size="20" />
            </div>
            <h2 class="text-xl font-bold text-white">
              {{ form.id ? 'Modifier le parcours' : 'Ajouter un parcours' }}
            </h2>
          </div>
          <button @click="$emit('close')" class="p-2 text-[#0C2340] hover:text-white hover:bg-gray-800 rounded-full transition-colors">
            <X :size="24" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submit" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Colonne 1 -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Nom complet <span class="text-red-500">*</span></label>
                <input v-model="form.nom" type="text" placeholder="Ex: Développement d'Application..." class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]" />
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Code Parcours <span class="text-red-500">*</span></label>
                <input v-model="form.code" type="text" placeholder="Auto-généré à partir du nom" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]" />
                <p class="text-xs text-gray-400">Généré automatiquement, modifiable</p>
              </div>

              <div class="space-y-1.5 relative">
                <label class="text-sm font-medium text-white">Mention <span class="text-red-500">*</span></label>
                <div class="relative">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Search :size="16" />
                  </div>
                  <input
                    @focus="showMentionDropdown = true"
                    type="text"
                    placeholder="Sélectionnez une mention..."
                    class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 pl-10 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]"
                    :value="store.mentions.find(m => m.id === form.mentionId)?.nom || form.mentionNom"
                    readonly
                  />
                  <div v-if="showMentionDropdown" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-52 overflow-y-auto">
                    <div class="p-3">
                      <input
                        v-model="mentionSearchTerm"
                        type="text"
                        placeholder="Rechercher une mention..."
                        class="w-full bg-gray-100 border border-gray-300 rounded-xl p-3 text-black outline-none"
                      />
                    </div>
                    <div v-if="filteredMentions.length || store.mentions.length" class="space-y-1 p-2">
                      <button
                        v-for="m in filteredMentions.length ? filteredMentions : store.mentions"
                        :key="m.id"
                        type="button"
                        @click="selectMention(m)"
                        class="w-full text-left px-3 py-2 hover:bg-blue-100 rounded-lg text-sm text-black transition-colors"
                      >
                        <div class="font-medium">{{ m.icone }} {{ m.nom }}</div>
                        <div class="text-xs text-gray-600">{{ m.couleur }}</div>
                      </button>
                    </div>
                    <div v-else class="p-3 text-center text-sm text-gray-500">
                      Aucune mention trouvée
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Niveau <span class="text-red-500">*</span></label>
                <select v-model="form.niveau" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option value="Licence">Licence</option>
                  <option value="Master">Master</option>
                </select>
              </div>
            </div>

            <!-- Colonne 2 -->
            <div class="space-y-4">
              <div class="space-y-1.5 relative">
                <label class="text-sm font-medium text-white">Nom du responsable</label>
                <div class="relative">
                  <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                    <Search :size="16" />
                  </div>
                  <input 
                    v-model="enseignantSearchTerm"
                    @focus="showEnseignantDropdown = true"
                    type="text" 
                    placeholder="Rechercher un enseignant..." 
                    class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 pl-10 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]" 
                  />
                  <div v-if="showEnseignantDropdown && (enseignantSearchTerm || filteredEnseignants.length)" class="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                    <div v-if="filteredEnseignants.length" class="space-y-1 p-2">
                      <button
                        v-for="e in filteredEnseignants"
                        :key="e.id"
                        type="button"
                        @click="selectEnseignant(e)"
                        class="w-full text-left px-3 py-2 hover:bg-blue-100 rounded-lg text-sm text-black transition-colors"
                      >
                        <div class="font-medium">{{ e.prenom }} {{ e.nom }}</div>
                        <div class="text-xs text-gray-600">{{ e.specialite }}</div>
                      </button>
                    </div>
                    <div v-else class="p-3 text-center text-sm text-gray-500">
                      Aucun enseignant trouvé
                    </div>
                  </div>
                </div>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Titre du responsable</label>
                <input v-model="form.responsableTitre" type="text" placeholder="Auto-rempli avec la spécialité" class="w-full bg-gray-100 border border-gray-300 text-black rounded-xl p-3 outline-none transition-all placeholder:text-[#0C2340]" readonly />
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Statut</label>
                <select v-model="form.actif" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option :value="true">Actif</option>
                  <option :value="false">Inactif</option>
                </select>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-800">
                <label class="text-sm font-medium text-white">Ouvert au Concours</label>
                <button
                  type="button"
                  @click="form.ouvertConcours = !form.ouvertConcours"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-emit-blue/50"
                  :class="form.ouvertConcours ? 'bg-emerald-500' : 'bg-gray-600'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="form.ouvertConcours ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Couleur d'identité</label>
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
            <textarea v-model="form.description" rows="3" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340] resize-none" placeholder="Description du parcours..."></textarea>
          </div>

          <div v-if="errorMessage" class="rounded-2xl border border-red-500 bg-red-500/10 p-4 text-sm text-red-600 font-medium">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="rounded-2xl border border-emerald-500 bg-emerald-500/10 p-4 text-sm text-emerald-600 font-medium">
            {{ successMessage }}
          </div>
        </form>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-800 flex justify-end gap-4 bg-gray-800/10">
          <button
            type="button"
            @click="$emit('close')"
            class="px-6 py-2.5 rounded-xl border border-gray-700 text-[#0C2340] hover:bg-gray-800 transition-all text-sm font-medium"
          >
            Annuler
          </button>
          <button
            type="button"
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
