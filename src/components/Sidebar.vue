<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import {
  LayoutDashboard,
  Users,
  School,
  BookOpen,
  GraduationCap,
  Calendar,
  AlertTriangle,
  Settings,
  LogOut
} from 'lucide-vue-next'

const props = defineProps({
  isOpen: Boolean,
  isMobile: Boolean
})

const emit = defineEmits(['close'])
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Enseignants', path: '/enseignants', icon: Users },
  { name: 'Salles', path: '/salles', icon: School },
  { name: 'Matières', path: '/matieres', icon: BookOpen },
  { name: 'Filières', path: '/filieres', icon: GraduationCap },
  { name: 'Emploi du Temps', path: '/emplois-du-temps', icon: Calendar },
  { name: 'Exceptions', path: '/exceptions', icon: AlertTriangle },
  { name: 'Paramètres', path: '/parametres', icon: Settings },
]

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

const isActive = (path) => route.path === path
</script>

<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 bg-white border-r border-[#BFDBFE] flex flex-col transition-all duration-500 ease-in-out shadow-[4px_0_24px_rgba(14,165,233,0.06)]"
    :class="[
      isOpen ? 'w-[280px]' : 'w-[80px]',
      isMobile && !isOpen ? '-translate-x-full' : 'translate-x-0'
    ]"
  >
    <!-- Logo Section -->
    <div class="h-20 flex items-center px-6 border-b border-[#F0F7FF] shrink-0">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] flex items-center justify-center shadow-lg shadow-[#38BDF8]/20">
          <span class="font-black text-white text-xl tracking-tighter">E</span>
        </div>
        <div v-if="isOpen" class="flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
          <span class="text-xl font-black text-[#0C2340] tracking-tighter leading-none">EMIT</span>
          <span class="text-[9px] font-black text-[#64A8CC] uppercase tracking-[0.2em] mt-1">Timeline</span>
        </div>
      </div>
    </div>

    <!-- Navigation Menu -->
    <nav class="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="group flex items-center h-12 px-4 rounded-2xl transition-all duration-300 relative"
        :class="[
          isActive(item.path)
            ? 'bg-gradient-to-r from-[#F0F9FF] to-[#E0F2FE] text-[#0284C7]'
            : 'text-[#1E5F8E] hover:bg-[#F0F9FF] hover:text-[#0284C7]'
        ]"
      >
        <!-- Active indicator -->
        <div
          v-if="isActive(item.path)"
          class="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-[#38BDF8] rounded-r-full shadow-[2px_0_10px_rgba(56,189,248,0.5)]"
        ></div>

        <component
          :is="item.icon"
          :size="22"
          class="shrink-0 transition-transform duration-300 group-hover:scale-110"
          :class="isActive(item.path) ? 'text-[#38BDF8]' : 'text-[#64A8CC]'"
        />

        <span
          v-if="isOpen"
          class="ml-4 text-sm font-black uppercase tracking-widest whitespace-nowrap"
        >
          {{ item.name }}
        </span>

        <!-- Tooltip for closed state -->
        <div
          v-if="!isOpen && !isMobile"
          class="absolute left-full ml-6 px-4 py-2 bg-[#0C2340] text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-50 shadow-2xl border border-white/10"
        >
          {{ item.name }}
        </div>
      </router-link>
    </nav>

    <!-- Bottom User Section -->
    <div class="p-6 border-t border-[#F0F7FF] bg-gradient-to-b from-white to-[#F0F9FF]">
      <div class="flex items-center gap-4 mb-6" :class="{ 'justify-center': !isOpen }">
        <div class="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-[#38BDF8] to-[#0EA5E9] p-[2px] shadow-lg">
          <div class="w-full h-full rounded-[0.9rem] bg-white flex items-center justify-center">
            <span class="text-[#0284C7] font-black text-lg">{{ authStore.user?.name?.charAt(0) || 'A' }}</span>
          </div>
        </div>
        <div v-if="isOpen" class="flex flex-col min-w-0">
          <span class="text-sm font-black text-[#0C2340] truncate leading-none mb-1">{{ authStore.user?.name }}</span>
          <span class="text-[9px] font-black text-[#64A8CC] uppercase tracking-widest">{{ authStore.role }}</span>
        </div>
      </div>

      <button
        @click="handleLogout"
        class="w-full flex items-center h-12 px-4 rounded-2xl text-[#DC2626] hover:bg-red-50 transition-all duration-300 group"
        :class="{ 'justify-center': !isOpen }"
      >
        <LogOut :size="20" class="shrink-0 transition-transform group-hover:rotate-12" />
        <span v-if="isOpen" class="ml-4 text-xs font-black uppercase tracking-[0.2em]">Quitter</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #E1EFFF;
  border-radius: 10px;
}
.router-link-active {
  font-weight: 900;
}
</style>
