<script setup>
import { ref, reactive, computed } from 'vue'
import { Eye, EyeOff, ShieldCheck, Smartphone, Monitor, LogOut, Clock, History } from 'lucide-vue-next'
import ToggleSwitch from './ToggleSwitch.vue'

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const passwords = reactive({
  old: '',
  new: '',
  confirm: ''
})

const passwordStrength = computed(() => {
  if (!passwords.new) return 0
  let strength = 0
  if (passwords.new.length >= 8) strength += 25
  if (/[A-Z]/.test(passwords.new)) strength += 25
  if (/[0-9]/.test(passwords.new)) strength += 25
  if (/[^A-Za-z0-9]/.test(passwords.new)) strength += 25
  return strength
})

const strengthLabel = computed(() => {
  if (passwordStrength.value <= 25) return { text: 'Faible', color: 'bg-red-500' }
  if (passwordStrength.value <= 50) return { text: 'Moyen', color: 'bg-orange-500' }
  if (passwordStrength.value <= 75) return { text: 'Fort', color: 'bg-blue-500' }
  return { text: 'Très fort', color: 'bg-emerald-500' }
})

const twoFA = ref(true)

const sessions = [
  { id: 1, device: 'Chrome sur Windows', location: 'Antananarivo, MG', time: 'Maintenant', current: true, icon: Monitor },
  { id: 2, device: 'Safari sur iPhone 13', location: 'Antananarivo, MG', time: 'Il y a 2 heures', current: false, icon: Smartphone },
  { id: 3, device: 'Firefox sur macOS', location: 'Paris, FR', time: 'Il y a 2 jours', current: false, icon: Monitor }
]
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <!-- Password Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <div class="mb-8">
        <h3 class="text-xl font-black text-white mb-2">Changer le mot de passe</h3>
        <p class="text-sm text-gray-500">Assurez-vous d'utiliser un mot de passe fort et unique.</p>
      </div>

      <div class="max-w-xl space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Mot de passe actuel</label>
          <div class="relative">
            <input
              v-model="passwords.old"
              :type="showOldPassword ? 'text' : 'password'"
              class="w-full bg-emit-bg/50 border border-gray-700 text-white rounded-2xl p-4 pr-12 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold"
            />
            <button @click="showOldPassword = !showOldPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
              <Eye v-if="!showOldPassword" :size="18" />
              <EyeOff v-else :size="18" />
            </button>
          </div>
        </div>

        <div class="space-y-4">
          <div class="space-y-2">
            <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nouveau mot de passe</label>
            <div class="relative">
              <input
                v-model="passwords.new"
                :type="showNewPassword ? 'text' : 'password'"
                class="w-full bg-emit-bg/50 border border-gray-700 text-white rounded-2xl p-4 pr-12 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold"
              />
              <button @click="showNewPassword = !showNewPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                <Eye v-if="!showNewPassword" :size="18" />
                <EyeOff v-else :size="18" />
              </button>
            </div>
          </div>

          <!-- Strength Indicator -->
          <div v-if="passwords.new" class="space-y-2">
            <div class="flex justify-between items-center">
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-500">Force : {{ strengthLabel.text }}</span>
              <span class="text-[10px] font-black text-gray-400">{{ passwordStrength }}%</span>
            </div>
            <div class="h-1 w-full bg-gray-800 rounded-full overflow-hidden">
              <div :class="['h-full transition-all duration-500', strengthLabel.color]" :style="{ width: passwordStrength + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Confirmer le mot de passe</label>
          <input
            v-model="passwords.confirm"
            type="password"
            class="w-full bg-emit-bg/50 border border-gray-700 text-white rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emit-blue/50 font-bold"
            :class="{ 'border-red-500/50': passwords.confirm && passwords.new !== passwords.confirm }"
          />
        </div>

        <button
          :disabled="!passwords.new || passwords.new !== passwords.confirm || passwordStrength < 75"
          class="w-full py-4 bg-gray-800 text-white font-black text-xs rounded-2xl shadow-xl hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all uppercase tracking-widest"
        >
          Changer le mot de passe
        </button>
      </div>
    </section>

    <!-- Sessions Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-xl font-black text-white mb-2">Sessions actives</h3>
          <p class="text-sm text-gray-500">Consultez et gérez vos connexions actuelles.</p>
        </div>
        <button class="text-xs font-black text-red-400 uppercase tracking-widest hover:text-red-300 transition-colors">Déconnecter tout</button>
      </div>

      <div class="space-y-4">
        <div v-for="session in sessions" :key="session.id" class="p-6 bg-gray-800/40 rounded-3xl border border-gray-800 flex items-center gap-6">
          <div class="p-3 bg-gray-900 rounded-2xl text-emit-blue">
            <component :is="session.icon" :size="24" />
          </div>
          <div class="flex-1">
            <div class="flex items-center gap-3">
              <h4 class="font-bold text-white">{{ session.device }}</h4>
              <span v-if="session.current" class="px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Actuelle</span>
            </div>
            <p class="text-xs text-gray-500">{{ session.location }} · {{ session.time }}</p>
          </div>
          <button v-if="!session.current" class="p-2 text-gray-600 hover:text-red-400 transition-colors"><LogOut :size="18" /></button>
        </div>
      </div>
    </section>

    <!-- 2FA Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-6">
          <div class="p-4 bg-purple-500/10 text-purple-500 rounded-[2rem]">
            <ShieldCheck :size="32" />
          </div>
          <div>
            <h3 class="text-xl font-black text-white mb-2">Double Authentification (2FA)</h3>
            <p class="text-sm text-gray-500">Ajoutez une couche de sécurité supplémentaire à votre compte.</p>
          </div>
        </div>
        <ToggleSwitch v-model="twoFA" />
      </div>
    </section>
  </div>
</template>
