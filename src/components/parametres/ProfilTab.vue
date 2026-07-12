<script setup>
import { ref, reactive } from 'vue'
import { useParametresStore } from '../../stores/parametresStore'
import { Camera, CheckCircle2, Copy, LogIn } from 'lucide-vue-next'
import SettingRow from './SettingRow.vue'

const store = useParametresStore()
const form = reactive({ ...store.profil })
const preferences = reactive({ ...store.preferences })

const departements = ['Informatique', 'Management', 'Mathématiques', 'Communication', 'Economie', 'Droit']
const langues = ['Français', 'English', 'Malagasy']
const formatsDate = ['DD/MM/YYYY', 'YYYY-MM-DD', 'DD MMM YYYY']

const copyId = () => {
  navigator.clipboard.writeText('USR-2026-001')
  // In a real app, show a toast
}
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <!-- Section 1: Informations personnelles -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <div class="mb-8">
        <h3 class="text-xl font-black text-white mb-2">Informations personnelles</h3>
        <p class="text-sm text-gray-700">Gérez vos informations publiques et vos coordonnées.</p>
      </div>

      <div class="flex flex-col md:flex-row gap-12 items-start">
        <!-- Avatar Upload -->
        <div class="relative group">
          <div class="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-emit-blue to-emit-purple flex items-center justify-center text-4xl font-black text-white shadow-2xl overflow-hidden relative">
            <span v-if="!form.avatar">{{ form.prenom.charAt(0) }}{{ form.nom.charAt(0) }}</span>
            <img v-else :src="form.avatar" class="w-full h-full object-cover" />

            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
              <Camera :size="24" class="text-white mb-1" />
              <span class="text-[8px] font-black uppercase tracking-widest text-white text-center px-2">Changer la photo</span>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
          <div class="space-y-2">
            <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Prénom</label>
            <input v-model="form.prenom" type="text" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Nom</label>
            <input v-model="form.nom" type="text" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Email professionnel</label>
            <div class="relative">
              <input v-model="form.email" type="email" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 pr-24 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold" />
              <div class="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 px-2 py-1 rounded-lg">
                <CheckCircle2 :size="12" /> Vérifié
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Téléphone</label>
            <input v-model="form.telephone" type="text" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Poste / Fonction</label>
            <input v-model="form.poste" type="text" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Département</label>
            <select v-model="form.departement" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold appearance-none">
              <option v-for="d in departements" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div class="space-y-2 md:col-span-2">
            <div class="flex justify-between">
              <label class="text-sm font-medium text-white uppercase tracking-widest ml-1">Bio courte</label>
              <span class="text-[10px] text-gray-600">{{ form.bio.length }}/200</span>
            </div>
            <textarea v-model="form.bio" rows="3" maxlength="200" class="w-full bg-white border-gray-300 text-black rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 font-medium resize-none"></textarea>
          </div>
        </div>
      </div>

      <div class="mt-8 pt-8 border-t border-gray-800 flex justify-end">
        <button class="px-8 py-3 bg-gradient-to-r from-emit-blue to-emit-purple text-white font-black text-xs rounded-2xl shadow-xl hover:brightness-110 transition-all uppercase tracking-widest">
          Sauvegarder le profil
        </button>
      </div>
    </section>

    <!-- Section 2: Informations de compte -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-6">Informations de compte</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="p-4 bg-gray-800/40 rounded-2xl border border-gray-800">
          <p class="text-sm font-medium text-white uppercase tracking-widest mb-1">Rôle</p>
          <span class="px-3 py-1 bg-emit-blue/10 text-emit-blue rounded-full text-xs font-black uppercase tracking-widest border border-emit-blue/20">{{ form.role }}</span>
        </div>
        <div class="p-4 bg-gray-800/40 rounded-2xl border border-gray-800">
          <p class="text-sm font-medium text-white uppercase tracking-widest mb-1">Date création</p>
          <p class="text-sm font-bold text-white">15 Septembre 2024</p>
        </div>
        <div class="p-4 bg-gray-800/40 rounded-2xl border border-gray-800">
          <p class="text-sm font-medium text-white uppercase tracking-widest mb-1">Statut</p>
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <p class="text-sm font-bold text-emerald-500">Compte Actif</p>
          </div>
        </div>
        <div @click="copyId" class="p-4 bg-gray-800/40 rounded-2xl border border-gray-800 md:col-span-3 flex items-center justify-between cursor-pointer hover:bg-gray-800/60 transition-all">
          <div>
            <p class="text-sm font-medium text-white uppercase tracking-widest mb-1">ID Utilisateur</p>
            <p class="text-sm font-mono font-bold text-white">USR-2026-001</p>
          </div>
          <Copy :size="18" class="text-gray-600" />
        </div>
      </div>
    </section>

    <!-- Section 3: Préférences régionales -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-6">Préférences régionales</h3>
      <div class="divide-y divide-gray-800/50">
        <SettingRow label="Langue de l'interface" description="Choisissez votre langue d'affichage préférée.">
          <select v-model="preferences.langue" class="bg-white text-black border-gray-300 rounded-xl px-4 py-2 border border-gray-700 outline-none text-sm font-bold">
            <option v-for="l in langues" :key="l">{{ l }}</option>
          </select>
        </SettingRow>
        <SettingRow label="Fuseau horaire" description="Définit l'heure pour vos activités et plannings.">
          <span class="text-sm font-bold text-[#0C2340]">Indian/Antananarivo (GMT+3)</span>
        </SettingRow>
        <SettingRow label="Format de date" description="Comment les dates apparaissent dans l'application.">
          <div class="flex gap-2">
            <button v-for="f in formatsDate" :key="f" @click="preferences.formatDate = f" :class="['px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border transition-all', preferences.formatDate === f ? 'bg-emit-blue text-white border-emit-blue' : 'bg-gray-800 text-gray-700 border-gray-700']">{{ f }}</button>
          </div>
        </SettingRow>
      </div>
    </section>
  </div>
</template>

