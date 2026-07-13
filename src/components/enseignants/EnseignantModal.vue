<script setup>
import { ref, reactive, watch, onMounted, onUnmounted } from 'vue'
import { X, Save, Plus, Trash2, AlertCircle, UserPlus, Edit2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  enseignant: Object
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  nom: '',
  prenom: '',
  email: '',
  telephone: '',
  grade: '',
  specialite: '',
  statut: 'Actif',
  maxHeures: 20,
  matieres: []
})

const errors = reactive({})
const isSubmitting = ref(false)

const grades = ['Assistant', 'MAA', 'MCA', 'Professeur']
const specialites = ['Informatique', 'Mathématiques', 'Management', 'Communication', 'Economie', 'Réseaux', 'Droit']

watch(() => props.enseignant, (newVal) => {
  if (newVal) {
    Object.assign(form, JSON.parse(JSON.stringify(newVal)))
  } else {
    Object.assign(form, {
      nom: '', prenom: '', email: '', telephone: '',
      grade: '', specialite: '', statut: 'Actif',
      maxHeures: 20, matieres: []
    })
  }
}, { immediate: true })

const validate = () => {
  Object.keys(errors).forEach(key => delete errors[key])
  let isValid = true

  if (!form.nom) { errors.nom = 'Le nom est requis'; isValid = false }
  if (!form.prenom) { errors.prenom = 'Le prénom est requis'; isValid = false }
  if (!form.email) {
    errors.email = 'L\'email est requis'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Format d\'email invalide'
    isValid = false
  }
  if (!form.grade) { errors.grade = 'Le grade est requis'; isValid = false }
  if (!form.specialite) { errors.specialite = 'La spécialité est requise'; isValid = false }

  return isValid
}

const handleSubmit = async () => {
  if (!validate()) return

  isSubmitting.value = true
  // Simulation de délai
  await new Promise(resolve => setTimeout(resolve, 800))

  emit('save', { ...form })
  isSubmitting.value = false
}

// Handle Escape key
const handleEsc = (e) => {
  if (e.key === 'Escape' && props.isOpen) emit('close')
}

onMounted(() => window.addEventListener('keydown', handleEsc))
onUnmounted(() => window.removeEventListener('keydown', handleEsc))
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
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>

      <!-- Modal Content -->
      <div class="relative bg-[#1E293B] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-700 overflow-hidden animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="p-6 border-b border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emit-blue/10 rounded-lg text-emit-blue">
              <UserPlus v-if="!enseignant" :size="20" />
              <Edit2 v-else :size="20" />
            </div>
            <h2 class="text-xl font-bold text-white">
              {{ enseignant ? 'Modifier l\'enseignant' : 'Ajouter un enseignant' }}
            </h2>
          </div>
          <button @click="emit('close')" class="p-2 text-[#0C2340] hover:text-white hover:bg-gray-800 rounded-full transition-colors">
            <X :size="24" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Colonne 1 -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Prénom <span class="text-red-500">*</span></label>
                <input
                  v-model="form.prenom"
                  type="text"
                  placeholder="Ex: Jean"
                  class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]"
                  :class="{ 'border-red-500/50': errors.prenom }"
                />
                <p v-if="errors.prenom" class="text-red-400 text-xs">{{ errors.prenom }}</p>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Email <span class="text-red-500">*</span></label>
                <input
                  v-model="form.email"
                  type="email"
                  placeholder="jean@emit.mg"
                  class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]"
                  :class="{ 'border-red-500/50': errors.email }"
                />
                <p v-if="errors.email" class="text-red-400 text-xs">{{ errors.email }}</p>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Téléphone</label>
                <input
                  v-model="form.telephone"
                  type="text"
                  placeholder="034 00 000 00"
                  class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]"
                />
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Grade <span class="text-red-500">*</span></label>
                <select
                  v-model="form.grade"
                  class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none"
                  :class="{ 'border-red-500/50': errors.grade }"
                >
                  <option value="" disabled>Choisir un grade</option>
                  <option v-for="g in grades" :key="g" :value="g">{{ g }}</option>
                </select>
                <p v-if="errors.grade" class="text-red-400 text-xs">{{ errors.grade }}</p>
              </div>
            </div>

            <!-- Colonne 2 -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Nom <span class="text-red-500">*</span></label>
                <input
                  v-model="form.nom"
                  type="text"
                  placeholder="Ex: RAKOTO"
                  class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]"
                  :class="{ 'border-red-500/50': errors.nom }"
                />
                <p v-if="errors.nom" class="text-red-400 text-xs">{{ errors.nom }}</p>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Spécialité <span class="text-red-500">*</span></label>
                <select
                  v-model="form.specialite"
                  class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none"
                  :class="{ 'border-red-500/50': errors.specialite }"
                >
                  <option value="" disabled>Choisir une spécialité</option>
                  <option v-for="s in specialites" :key="s" :value="s">{{ s }}</option>
                </select>
                <p v-if="errors.specialite" class="text-red-400 text-xs">{{ errors.specialite }}</p>
              </div>

              <div class="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-800">
                <label class="text-sm font-medium text-white">Statut de l'enseignant</label>
                <button
                  type="button"
                  @click="form.statut = form.statut === 'Actif' ? 'Inactif' : 'Actif'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-emit-blue/50"
                  :class="form.statut === 'Actif' ? 'bg-emerald-500' : 'bg-gray-600'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="form.statut === 'Actif' ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Charge Max (h/semaine)</label>
                <input
                  v-model.number="form.maxHeures"
                  type="number"
                  class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>

        </form>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-800 flex justify-end gap-4 bg-gray-800/10">
          <button
            @click="emit('close')"
            class="px-6 py-2.5 rounded-xl border border-gray-700 text-[#0C2340] hover:bg-gray-800 transition-all text-sm font-medium"
          >
            Annuler
          </button>
          <button
            @click="handleSubmit"
            :disabled="isSubmitting"
            class="px-8 py-2.5 rounded-xl bg-gradient-to-r from-emit-blue to-emit-purple text-white font-bold text-sm shadow-lg shadow-emit-blue/20 hover:brightness-110 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Save v-if="!isSubmitting" :size="18" />
            <div v-else class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            {{ isSubmitting ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
