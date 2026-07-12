<script setup>
import { useThemeStore } from '../../stores/themeStore'
import { Check, Sun, Moon, Sparkles } from 'lucide-vue-next'
import SettingRow from './SettingRow.vue'
import ToggleSwitch from './ToggleSwitch.vue'

const themeStore = useThemeStore()

const themes = [
  { id: 'sombre', name: 'Sombre', bg: '#0F172A', secondary: '#1E293B', icon: Moon },
  { id: 'noir', name: 'Très Sombre', bg: '#080D14', secondary: '#0F172A', icon: Sparkles },
  { id: 'clair', name: 'Clair', bg: '#F8FAFC', secondary: '#FFFFFF', icon: Sun }
]

const accentColors = [
  { name: 'Bleu', hex: '#3B82F6' },
  { name: 'Violet', hex: '#8B5CF6' },
  { name: 'Vert', hex: '#10B981' },
  { name: 'Rouge', hex: '#EF4444' },
  { name: 'Orange', hex: '#F97316' },
  { name: 'Rose', hex: '#EC4899' },
  { name: 'Cyan', hex: '#06B6D4' },
  { name: 'Gris', hex: '#FFFFFF' }
]

const polices = ['Inter', 'Poppins', 'Roboto', 'DM Sans', 'Nunito']
const densities = ['Compact', 'Normal', 'Confortable']
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-500">
    <!-- Mode Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-8">Mode d'affichage</h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <button
          v-for="theme in themes"
          :key="theme.id"
          @click="themeStore.setMode(theme.id)"
          class="relative group rounded-3xl border-2 transition-all overflow-hidden text-left"
          :class="themeStore.mode === theme.id ? 'border-emit-blue scale-[1.02] shadow-2xl' : 'border-gray-800 hover:border-gray-700'"
        >
          <div class="h-24 p-3" :style="{ backgroundColor: theme.bg }">
            <div class="w-full h-full rounded-xl border border-white/5 p-2" :style="{ backgroundColor: theme.secondary }">
              <div class="w-2/3 h-2 bg-white/10 rounded-full mb-2"></div>
              <div class="w-full h-2 bg-white/5 rounded-full mb-1"></div>
              <div class="w-1/2 h-2 bg-white/5 rounded-full"></div>
            </div>
          </div>
          <div class="p-4 bg-gray-800/80 flex items-center justify-between">
            <div class="flex items-center gap-3">
              <component :is="theme.icon" :size="16" class="text-[#0C2340]" />
              <span class="text-xs font-black uppercase tracking-widest text-white">{{ theme.name }}</span>
            </div>
            <div v-if="themeStore.mode === theme.id" class="w-5 h-5 bg-emit-blue rounded-full flex items-center justify-center">
              <Check :size="12" class="text-white" />
            </div>
          </div>
        </button>
      </div>
    </section>

    <!-- Accent Color Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-8">Couleur d'accent</h3>
      <div class="flex flex-wrap gap-4">
        <button
          v-for="color in accentColors"
          :key="color.hex"
          @click="themeStore.setCouleurAccent(color.hex)"
          class="w-12 h-12 rounded-2xl flex items-center justify-center transition-all hover:scale-110 shadow-lg"
          :style="{ backgroundColor: color.hex }"
        >
          <Check v-if="themeStore.couleurAccent === color.hex" :size="20" :class="color.hex === '#FFFFFF' ? 'text-black' : 'text-white'" />
        </button>
      </div>
    </section>

    <!-- Typography Section -->
    <section class="bg-[#1E293B] rounded-3xl border border-gray-800 p-8 shadow-xl">
      <h3 class="text-xl font-black text-white mb-6">Typographie</h3>
      <div class="divide-y divide-gray-800/50">
        <SettingRow label="Police de l'interface" description="Choisissez la famille de police globale.">
          <select v-model="themeStore.police" class="bg-white text-black border-gray-300 rounded-xl px-4 py-2 border border-gray-700 outline-none text-sm font-bold">
            <option v-for="p in polices" :key="p">{{ p }}</option>
          </select>
        </SettingRow>
        <SettingRow label="Taille de police" description="Ajustez la taille du texte pour plus de confort.">
          <div class="flex items-center gap-4 w-48">
            <span class="text-[10px] text-gray-700 font-bold uppercase">A</span>
            <input type="range" v-model="themeStore.taillePolice" min="12" max="18" class="flex-1 accent-emit-blue" />
            <span class="text-lg text-white font-bold uppercase">A</span>
          </div>
        </SettingRow>
        <SettingRow label="Densité d'affichage" description="Gérez l'espacement global entre les éléments.">
          <div class="flex p-1 bg-gray-900 rounded-xl border border-gray-800">
            <button
              v-for="d in densities"
              :key="d"
              @click="themeStore.densite = d"
              class="px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all"
              :class="themeStore.densite === d ? 'bg-white text-black border-gray-300 shadow-lg' : 'text-gray-600'"
            >
              {{ d }}
            </button>
          </div>
        </SettingRow>
      </div>
    </section>
  </div>
</template>

