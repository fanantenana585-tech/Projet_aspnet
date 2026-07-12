<script setup>
import { reactive } from 'vue'
import { useParametresStore } from '../../stores/parametresStore'
import SettingRow from './SettingRow.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import { Plus, Trash2, GripVertical, Calendar as CalendarIcon, Clock } from 'lucide-vue-next'

const store = useParametresStore()
const systeme = reactive({ ...store.systeme })

const save = async () => {
    await store.updateSysteme(systeme)
    alert('Paramètres académiques enregistrés !')
}
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <div class="flex justify-end">
        <button @click="save" class="bg-emit-blue text-white px-6 py-2 rounded-xl font-bold hover:brightness-110 transition-all shadow-lg shadow-emit-blue/20">Enregistrer les modifications</button>
    </div>
    <!-- Academic Year Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-8">Année scolaire</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-2">
          <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Année courante</label>
          <input v-model="systeme.anneeScolaire" type="text" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 font-bold outline-none" />
        </div>
        <div class="space-y-2">
          <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Début des cours</label>
          <input v-model="systeme.semaineDebut" type="date" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 font-bold outline-none" />
        </div>
      </div>

      <div class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 bg-gray-800/30 rounded-3xl border border-gray-800 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white uppercase tracking-widest">Semestre 1</h4>
            <CalendarIcon :size="16" class="text-gray-700" />
          </div>
          <div class="flex gap-4">
            <input type="date" class="flex-1 bg-emit-bg/40 border border-gray-700 rounded-xl p-3 text-[10px] text-white" />
            <input type="date" class="flex-1 bg-emit-bg/40 border border-gray-700 rounded-xl p-3 text-[10px] text-white" />
          </div>
        </div>
        <div class="p-6 bg-gray-800/30 rounded-3xl border border-gray-800 space-y-4">
          <div class="flex items-center justify-between">
            <h4 class="text-sm font-bold text-white uppercase tracking-widest">Semestre 2</h4>
            <CalendarIcon :size="16" class="text-gray-700" />
          </div>
          <div class="flex gap-4">
            <input type="date" class="flex-1 bg-emit-bg/40 border border-gray-700 rounded-xl p-3 text-[10px] text-white" />
            <input type="date" class="flex-1 bg-emit-bg/40 border border-gray-700 rounded-xl p-3 text-[10px] text-white" />
          </div>
        </div>
      </div>
    </section>

    <!-- Time Slots Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-xl font-black text-white mb-2">Créneaux horaires</h3>
          <p class="text-sm text-gray-700">Définissez les périodes de cours standards.</p>
        </div>
        <button class="p-3 bg-emit-blue/10 text-emit-blue rounded-xl hover:bg-emit-blue hover:text-white transition-all">
          <Plus :size="20" />
        </button>
      </div>

      <div class="space-y-3">
        <div v-for="c in systeme.creneauxHoraires" :key="c.id" class="p-4 bg-gray-800/40 rounded-2xl border border-gray-800 flex items-center gap-6 group">
          <GripVertical :size="18" class="text-gray-700 group-hover:text-gray-700 cursor-grab" />
          <div class="flex-1 grid grid-cols-3 gap-4">
            <div class="flex items-center gap-3 bg-emit-bg/30 border border-gray-700 rounded-xl px-4 py-2">
              <Clock :size="14" class="text-gray-700" />
              <input v-model="c.debut" type="time" class="bg-transparent text-white text-xs font-bold outline-none" />
            </div>
            <div class="flex items-center gap-3 bg-emit-bg/30 border border-gray-700 rounded-xl px-4 py-2">
              <Clock :size="14" class="text-gray-700" />
              <input v-model="c.fin" type="time" class="bg-transparent text-white text-xs font-bold outline-none" />
            </div>
            <input v-model="c.label" type="text" class="bg-emit-bg/30 border border-gray-700 rounded-xl px-4 py-2 text-white text-xs font-bold outline-none" />
          </div>
          <button class="p-2 text-gray-700 hover:text-red-400 transition-colors">
            <Trash2 :size="18" />
          </button>
        </div>
      </div>
    </section>

    <!-- Rules Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-6">Règles de planification</h3>
      <div class="divide-y divide-gray-800/50">
        <SettingRow label="Pause déjeuner obligatoire" description="Bloque automatiquement la plage horaire du midi.">
          <div class="flex items-center gap-4">
            <span class="text-[10px] font-bold text-gray-700">12:30 - 14:00</span>
            <ToggleSwitch :modelValue="true" />
          </div>
        </SettingRow>
        <SettingRow label="Volume horaire max" description="Nombre maximum d'heures d'enseignement par semaine pour un enseignant.">
          <div class="flex items-center gap-3">
            <input type="number" class="w-20 bg-gray-800 border border-gray-700 rounded-xl p-2 text-center text-white font-bold text-sm" value="25" />
            <span class="text-xs font-bold text-gray-700 uppercase">Heures</span>
          </div>
        </SettingRow>
      </div>
    </section>
  </div>
</template>

