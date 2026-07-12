<script setup>
import { ref, markRaw } from 'vue'
import {
  User, Lock, Palette, Bell, GraduationCap, Settings,
  Database, Info, ChevronRight, Camera
} from 'lucide-vue-next'
import { useParametresStore } from '../stores/parametresStore'

import ProfilTab from '../components/parametres/ProfilTab.vue'
import SecuriteTab from '../components/parametres/SecuriteTab.vue'
import ApparenceTab from '../components/parametres/ApparenceTab.vue'
import NotificationsTab from '../components/parametres/NotificationsTab.vue'
import AcademicTab from '../components/parametres/AcademicTab.vue'
import SystemeTab from '../components/parametres/SystemeTab.vue'

const store = useParametresStore()

const tabs = [
  { id: 'profil', label: 'Mon Profil', icon: markRaw(User), component: markRaw(ProfilTab) },
  { id: 'securite', label: 'Sécurité', icon: markRaw(Lock), component: markRaw(SecuriteTab) },
  { id: 'apparence', label: 'Apparence', icon: markRaw(Palette), component: markRaw(ApparenceTab) },
  { id: 'notifications', label: 'Notifications', icon: markRaw(Bell), component: markRaw(NotificationsTab) },
  { id: 'academic', label: 'Académique', icon: markRaw(GraduationCap), component: markRaw(AcademicTab) },
  { id: 'systeme', label: 'Système', icon: markRaw(Settings), component: markRaw(SystemeTab) }
]

const activeTab = ref(tabs[0])
</script>

<template>
  <div class="max-w-[1400px] mx-auto pb-20">
    <!-- Header -->
    <header class="mb-12 animate-in fade-in slide-in-from-left-4 duration-700">
      <h1 class="text-4xl font-black text-white tracking-tight mb-2">Paramètres</h1>
      <p class="text-[#0C2340] font-bold">Gérez votre compte, vos préférences et la configuration du système.</p>
    </header>

    <div class="flex flex-col lg:flex-row gap-12 items-start">
      <!-- Sidebar Navigation -->
      <aside class="w-full lg:w-[320px] shrink-0 sticky top-24 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div class="bg-[#1E293B] rounded-[2.5rem] border border-gray-800 shadow-2xl overflow-hidden">
          <!-- Profile Quick Preview -->
          <div class="p-8 border-b border-gray-800 bg-gray-800/20 text-center">
            <div class="relative inline-block mb-4">
              <div class="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emit-blue to-emit-purple flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                {{ store.profil.prenom.charAt(0) }}{{ store.profil.nom.charAt(0) }}
              </div>
              <div class="absolute -bottom-2 -right-2 p-2 bg-gray-900 border border-gray-700 rounded-xl text-[#0C2340] cursor-pointer hover:text-white transition-all shadow-xl">
                <Camera :size="16" />
              </div>
            </div>
            <h2 class="text-lg font-black text-white">{{ store.profil.prenom }} {{ store.profil.nom }}</h2>
            <p class="text-xs text-gray-700 font-bold uppercase tracking-widest mt-1">{{ store.profil.role }}</p>
          </div>

          <!-- Nav Items -->
          <nav class="p-4 space-y-2">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab"
              class="w-full flex items-center justify-between p-4 rounded-2xl transition-all group"
              :class="activeTab.id === tab.id ? 'bg-white text-gray-900 shadow-2xl' : 'text-gray-700 hover:bg-gray-800/50 hover:text-[#0C2340]'"
            >
              <div class="flex items-center gap-4">
                <div
                  class="p-2 rounded-xl transition-colors"
                  :class="activeTab.id === tab.id ? 'bg-gray-900 text-white' : 'bg-gray-800 text-gray-700 group-hover:text-white'"
                >
                  <component :is="tab.icon" :size="18" />
                </div>
                <span class="text-xs font-black uppercase tracking-widest">{{ tab.label }}</span>
              </div>
              <ChevronRight :size="16" :class="activeTab.id === tab.id ? 'opacity-100' : 'opacity-0'" />
            </button>
          </nav>

          <!-- System Badge -->
          <div class="p-6 bg-gray-900/50 border-t border-gray-800">
            <div class="flex items-center gap-3">
              <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span class="text-[9px] font-black text-emerald-500/80 uppercase tracking-[0.2em]">Système en ligne v1.0.0</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Content Area -->
      <main class="flex-1 w-full min-w-0">
        <div class="mb-8">
          <div class="flex items-center gap-4 mb-4">
            <div class="p-3 bg-white text-gray-900 rounded-2xl shadow-xl">
              <component :is="activeTab.icon" :size="24" />
            </div>
            <h2 class="text-3xl font-black text-white uppercase tracking-tight">{{ activeTab.label }}</h2>
          </div>
          <div class="h-1 w-20 bg-emit-blue rounded-full"></div>
        </div>

        <Transition
          mode="out-in"
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-4"
        >
          <component :is="activeTab.component" :key="activeTab.id" />
        </Transition>
      </main>
    </div>
  </div>
</template>
