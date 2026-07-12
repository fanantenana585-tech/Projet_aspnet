<script setup>
import { ref, reactive, watch } from 'vue'
import { X, Save, Plus, Minus, Video, Wifi, Wind, Monitor, Edit2, Maximize2, Speaker, Camera, Printer, CheckCircle2 } from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  salle: Object
})

const emit = defineEmits(['close', 'save'])

const form = reactive({
  nom: '',
  type: '',
  batiment: '',
  etage: 0,
  capacite: 30,
  disposition: 'Cours magistral',
  equipements: [],
  statut: 'disponible',
  noteMaintenance: ''
})

const types = ['Salle de cours', 'Amphithéâtre', 'Laboratoire', 'Salle TD']
const batiments = ['Bâtiment A', 'Bâtiment B', 'Bâtiment C']
const etages = [
  { label: 'Rez-de-chaussée', value: 0 },
  { label: '1er étage', value: 1 },
  { label: '2ème étage', value: 2 },
  { label: '3ème étage', value: 3 }
]
const dispositions = [
  { label: 'Amphithéâtre', icon: '🪑', value: 'Amphithéâtre' },
  { label: 'Cours magistral', icon: '📋', value: 'Cours magistral' },
  { label: 'Disposition en U', icon: '👥', value: 'U' },
  { label: 'En îlots', icon: '🔵', value: 'Îlots' },
  { label: 'Laboratoire', icon: '💻', value: 'Labo' }
]

const equipmentOptions = [
  { name: 'Vidéoprojecteur', icon: Video },
  { name: 'Tableau blanc', icon: Edit2 },
  { name: 'Tableau interactif', icon: Maximize2 },
  { name: 'Climatisation', icon: Wind },
  { name: 'WiFi', icon: Wifi },
  { name: 'Ordinateurs', icon: Monitor },
  { name: 'Sono', icon: Speaker },
  { name: 'Webcam', icon: Camera },
  { name: 'Imprimante', icon: Printer }
]

watch(() => props.salle, (newVal) => {
  if (newVal) {
    Object.assign(form, JSON.parse(JSON.stringify(newVal)))
  } else {
    Object.assign(form, {
      nom: '', type: 'Salle de cours', batiment: 'Bâtiment A',
      etage: 0, capacite: 30, disposition: 'Cours magistral',
      equipements: [], statut: 'disponible', noteMaintenance: ''
    })
  }
}, { immediate: true })

const toggleEquipment = (name) => {
  const index = form.equipements.indexOf(name)
  if (index === -1) {
    form.equipements.push(name)
  } else {
    form.equipements.splice(index, 1)
  }
}

const isSubmitting = ref(false)
const handleSubmit = async () => {
  isSubmitting.value = true
  await new Promise(resolve => setTimeout(resolve, 800))
  emit('save', { ...form })
  isSubmitting.value = false
}
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
      <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="emit('close')"></div>

      <div class="relative bg-[#1E293B] w-full max-w-2xl rounded-3xl shadow-2xl border border-gray-700 overflow-hidden animate-in zoom-in-95 duration-300">
        <!-- Header -->
        <div class="p-6 border-b border-gray-800 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emit-blue/10 rounded-lg text-emit-blue">
              <Edit2 v-if="salle" :size="20" />
              <Plus v-else :size="20" />
            </div>
            <h2 class="text-xl font-bold text-white">
              {{ salle ? 'Modifier la salle' : 'Ajouter une salle' }}
            </h2>
          </div>
          <button @click="emit('close')" class="p-2 text-[#0C2340] hover:text-white rounded-full hover:bg-gray-800 transition-colors">
            <X :size="24" />
          </button>
        </div>

        <!-- Form Content -->
        <form @submit.prevent="handleSubmit" class="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Colonne 1 -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Nom de la salle <span class="text-red-500">*</span></label>
                <input v-model="form.nom" type="text" placeholder="Ex: Salle A101" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all placeholder:text-[#0C2340]" />
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Bâtiment <span class="text-red-500">*</span></label>
                <select v-model="form.batiment" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option value="" disabled>Choisir un bâtiment</option>
                  <option v-for="b in batiments" :key="b" :value="b">{{ b }}</option>
                </select>
              </div>

              <div class="space-y-1.5 flex-1">
                <label class="text-sm font-medium text-white">Capacité maximale</label>
                <div class="flex items-center gap-3 bg-white border border-gray-300 rounded-xl p-1 focus-within:ring-2 focus-within:ring-emit-blue/50 transition-all">
                  <button type="button" @click="form.capacite--" class="p-2 text-[#0C2340] hover:text-gray-600"><Minus :size="20" /></button>
                  <input v-model.number="form.capacite" type="number" class="flex-1 bg-transparent text-center text-black font-bold outline-none" />
                  <button type="button" @click="form.capacite++" class="p-2 text-[#0C2340] hover:text-gray-600"><Plus :size="20" /></button>
                </div>
              </div>
              
              <div class="flex items-center justify-between p-4 bg-gray-800/30 rounded-2xl border border-gray-800">
                <label class="text-sm font-medium text-white">Statut de la salle</label>
                <button
                  type="button"
                  @click="form.statut = form.statut === 'disponible' ? 'maintenance' : 'disponible'"
                  class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-emit-blue/50"
                  :class="form.statut === 'disponible' ? 'bg-emerald-500' : 'bg-orange-500'"
                >
                  <span
                    class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                    :class="form.statut === 'disponible' ? 'translate-x-6' : 'translate-x-1'"
                  />
                </button>
              </div>
            </div>

            <!-- Colonne 2 -->
            <div class="space-y-4">
              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Type de salle <span class="text-red-500">*</span></label>
                <select v-model="form.type" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option value="" disabled>Choisir un type</option>
                  <option v-for="t in types" :key="t" :value="t">{{ t }}</option>
                </select>
              </div>

              <div class="space-y-1.5">
                <label class="text-sm font-medium text-white">Étage <span class="text-red-500">*</span></label>
                <select v-model="form.etage" class="w-full bg-white border border-gray-300 text-black rounded-xl p-3 focus:ring-2 focus:ring-emit-blue/50 outline-none transition-all appearance-none">
                  <option v-for="e in etages" :key="e.value" :value="e.value">{{ e.label }}</option>
                </select>
              </div>

              <div class="space-y-1.5 flex-1">
                <label class="text-sm font-medium text-white block mb-1">Disposition</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="d in dispositions"
                    :key="d.value"
                    type="button"
                    @click="form.disposition = d.value"
                    :class="['px-3 py-2 rounded-xl text-xs font-bold border transition-all',
                      form.disposition === d.value ? 'bg-emit-blue text-white border-emit-blue shadow-lg shadow-emit-blue/20' : 'bg-white text-black border-gray-300 hover:bg-gray-100']"
                  >
                    {{ d.icon }} {{ d.label }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Équipements Section -->
          <div class="space-y-3">
            <label class="text-sm font-medium text-white">Équipements de la salle</label>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button
                v-for="eq in equipmentOptions"
                :key="eq.name"
                type="button"
                @click="toggleEquipment(eq.name)"
                :class="['flex items-center gap-3 p-3 rounded-2xl border transition-all text-left',
                  form.equipements.includes(eq.name) ? 'bg-emit-blue/10 border-emit-blue text-emit-blue' : 'bg-gray-800/30 border-gray-800 text-gray-400 hover:bg-gray-800/50 hover:text-white']"
              >
                <component :is="eq.icon" :size="18" />
                <span class="text-xs font-bold">{{ eq.name }}</span>
              </button>
            </div>
          </div>
        </form>

        <!-- Footer -->
        <div class="p-6 border-t border-gray-800 flex justify-end gap-4 bg-gray-800/10">
          <button @click="emit('close')" class="px-6 py-2.5 rounded-xl border border-gray-700 text-[#0C2340] hover:bg-gray-800 transition-all text-sm font-medium">
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
