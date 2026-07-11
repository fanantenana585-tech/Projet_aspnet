<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Clock,
  Search
} from 'lucide-vue-next'
import { useAuthStore } from '../stores/auth'

const emit = defineEmits(['toggle-sidebar'])
const route = useRoute()
const authStore = useAuthStore()

const currentTime = ref(new Date())
const isUserMenuOpen = ref(false)
const hasNotifications = ref(true)

const pageTitle = computed(() => route.meta.title || 'Tableau de Bord')

let timer
onMounted(() => {
  timer = setInterval(() => {
    currentTime.value = new Date()
  }, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})

const formatTime = (date) => {
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatDate = (date) => {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}
</script>

<template>
  <header class="h-20 bg-white border-b border-[#BFDBFE] flex items-center justify-between px-6 md:px-10 sticky top-0 z-30 shadow-[0_4px_24px_rgba(14,165,233,0.04)]">
    <div class="flex items-center gap-6">
      <button
        @click="emit('toggle-sidebar')"
        class="p-3 rounded-2xl bg-[#F0F9FF] text-[#38BDF8] hover:bg-[#38BDF8] hover:text-white transition-all shadow-sm"
      >
        <Menu :size="20" />
      </button>

      <div class="h-10 w-px bg-[#F0F7FF] hidden md:block"></div>

      <h1 class="text-xl font-black text-[#0C2340] tracking-tight truncate hidden md:block">
        {{ pageTitle }}
      </h1>
    </div>

    <div class="flex items-center gap-4 md:gap-8">
      <!-- Time/Date (Desktop) -->
      <div class="hidden xl:flex items-center gap-4 text-[#1E5F8E] px-6 py-2.5 bg-[#F0F9FF] rounded-full border border-[#BFDBFE] shadow-inner">
        <Clock :size="18" class="text-[#38BDF8]" />
        <span class="text-sm font-black tracking-widest">{{ formatTime(currentTime) }}</span>
        <div class="w-px h-4 bg-[#BFDBFE]"></div>
        <span class="text-[10px] font-black uppercase tracking-widest">{{ formatDate(currentTime) }}</span>
      </div>

      <!-- Search Trigger -->
      <button class="p-3 rounded-2xl text-[#64A8CC] hover:bg-[#F0F9FF] hover:text-[#38BDF8] transition-all">
        <Search :size="20" />
      </button>

      <!-- Notifications -->
      <button class="relative p-3 rounded-2xl text-[#64A8CC] hover:bg-[#F0F9FF] hover:text-[#38BDF8] transition-all">
        <Bell :size="20" />
        <span v-if="hasNotifications" class="absolute top-3 right-3 w-2.5 h-2.5 bg-[#DC2626] rounded-full ring-4 ring-white"></span>
      </button>

      <!-- User Dropdown -->
      <div class="relative">
        <button
          @click="isUserMenuOpen = !isUserMenuOpen"
          class="flex items-center gap-4 p-1.5 pr-4 rounded-[1.25rem] bg-[#F0F9FF] border border-[#BFDBFE] hover:border-[#38BDF8] transition-all group"
        >
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center text-white font-black text-sm shadow-lg shadow-[#38BDF8]/20">
            {{ authStore.user?.name?.charAt(0) || 'A' }}
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-black text-[#0C2340] uppercase tracking-widest leading-none mb-1">{{ authStore.user?.name }}</p>
            <p class="text-[8px] font-black text-[#64A8CC] uppercase tracking-[0.2em] leading-none">{{ authStore.role }}</p>
          </div>
          <ChevronDown :size="14" class="text-[#64A8CC] transition-transform duration-300" :class="{ 'rotate-180': isUserMenuOpen }" />
        </button>

        <Transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="transform scale-95 opacity-0 -translate-y-2"
          enter-to-class="transform scale-100 opacity-100 translate-y-0"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="transform scale-100 opacity-100 translate-y-0"
          leave-to-class="transform scale-95 opacity-0 -translate-y-2"
        >
          <div v-if="isUserMenuOpen" class="absolute right-0 mt-4 w-64 bg-white border border-[#BFDBFE] rounded-[2rem] shadow-[0_20px_50px_rgba(14,165,233,0.15)] py-4 z-50 overflow-hidden">
            <div class="px-6 py-4 border-b border-[#F0F7FF] mb-2 bg-[#F8FBFF]">
              <p class="text-sm font-black text-[#0C2340] truncate">{{ authStore.user?.name }}</p>
              <p class="text-[10px] font-black text-[#64A8CC] uppercase tracking-widest truncate">{{ authStore.user?.email }}</p>
            </div>

            <button class="w-full flex items-center gap-4 px-6 py-3 text-xs font-black uppercase tracking-widest text-[#1E5F8E] hover:bg-[#F0F9FF] hover:text-[#38BDF8] transition-all">
              <User :size="16" />
              Mon Profil
            </button>
            <button class="w-full flex items-center gap-4 px-6 py-3 text-xs font-black uppercase tracking-widest text-[#1E5F8E] hover:bg-[#F0F9FF] hover:text-[#38BDF8] transition-all">
              <Settings :size="16" />
              Paramètres
            </button>

            <div class="my-3 border-t border-[#F0F7FF]"></div>

            <button
              @click="authStore.logout(); $router.push('/login')"
              class="w-full flex items-center gap-4 px-6 py-4 text-xs font-black uppercase tracking-widest text-[#DC2626] hover:bg-red-50 transition-all"
            >
              <LogOut :size="16" />
              Déconnexion
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>
