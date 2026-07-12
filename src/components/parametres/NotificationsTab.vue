<script setup>
import { reactive } from 'vue'
import { useParametresStore } from '../../stores/parametresStore'
import SettingRow from './SettingRow.vue'
import ToggleSwitch from './ToggleSwitch.vue'
import { Mail, Bell, Volume2 } from 'lucide-vue-next'

const store = useParametresStore()
const config = reactive({ ...store.notifications })
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <!-- Channels Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-8">Canaux de notification</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-6 bg-gray-800/40 rounded-[2rem] border border-gray-800 flex flex-col justify-between h-48">
          <div class="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
            <Mail :size="24" />
          </div>
          <div>
            <h4 class="font-bold text-white mb-1">Email</h4>
            <p class="text-[10px] text-gray-700 uppercase font-black tracking-widest mb-4">Alertes par email</p>
            <ToggleSwitch v-model="config.email" />
          </div>
        </div>

        <div class="p-6 bg-gray-800/40 rounded-[2rem] border border-gray-800 flex flex-col justify-between h-48">
          <div class="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Bell :size="24" />
          </div>
          <div>
            <h4 class="font-bold text-white mb-1">Navigateur</h4>
            <p class="text-[10px] text-gray-700 uppercase font-black tracking-widest mb-4">Notifications Push</p>
            <button v-if="!config.navigateur" class="px-4 py-1.5 bg-purple-500 text-white text-[10px] font-black uppercase rounded-lg">Activer</button>
            <ToggleSwitch v-else v-model="config.navigateur" />
          </div>
        </div>

        <div class="p-6 bg-gray-800/40 rounded-[2rem] border border-gray-800 flex flex-col justify-between h-48">
          <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Volume2 :size="24" />
          </div>
          <div>
            <h4 class="font-bold text-white mb-1">Sons</h4>
            <p class="text-[10px] text-gray-700 uppercase font-black tracking-widest mb-4">Sons d'alerte</p>
            <ToggleSwitch v-model="config.sons" />
          </div>
        </div>
      </div>
    </section>

    <!-- Types Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-6">Types de notifications</h3>
      <div class="divide-y divide-gray-800/50">
        <SettingRow label="Conflits emploi du temps" description="Recevoir une alerte immédiate en cas de chevauchement de cours.">
          <ToggleSwitch :modelValue="true" class="opacity-50 grayscale pointer-events-none" />
        </SettingRow>
        <SettingRow label="Rappels de cours" description="Notifications de rappel avant le début de chaque séance.">
          <div class="flex items-center gap-4">
            <select class="bg-white text-black border-gray-300 rounded-xl px-3 py-1.5 border border-gray-700 outline-none text-[10px] font-bold uppercase">
              <option>15 minutes avant</option>
              <option>30 minutes avant</option>
              <option>1 heure avant</option>
            </select>
            <ToggleSwitch v-model="config.rappelCours" />
          </div>
        </SettingRow>
        <SettingRow label="Nouvel enseignant" description="Alerte lorsqu'un nouvel enseignant est ajouté au département.">
          <ToggleSwitch v-model="config.conflits" />
        </SettingRow>
        <SettingRow label="Maintenance de salle" description="Notifications sur l'indisponibilité temporaire des salles.">
          <ToggleSwitch :modelValue="true" />
        </SettingRow>
      </div>
    </section>
  </div>
</template>

