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

const emit = defineEmits(['toggle-sidebar'])
const route = useRoute()

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
    </div>
  </header>
</template>
