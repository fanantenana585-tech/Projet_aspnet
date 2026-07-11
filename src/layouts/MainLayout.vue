<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'

const isSidebarOpen = ref(true)
const isMobile = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (isMobile.value) {
    isSidebarOpen.value = false
  } else {
    isSidebarOpen.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <div class="min-h-screen bg-[#F0F7FF] text-[#0C2340] flex overflow-hidden font-sans">
    <!-- Mobile Backdrop -->
    <div
      v-if="isMobile && isSidebarOpen"
      @click="isSidebarOpen = false"
      class="fixed inset-0 bg-[#0C2340]/40 backdrop-blur-md z-40 transition-opacity duration-500"
    ></div>

    <!-- Sidebar -->
    <Sidebar
      :is-open="isSidebarOpen"
      :is-mobile="isMobile"
      @close="isSidebarOpen = false"
    />

    <!-- Main Content Area -->
    <div
      class="flex-1 flex flex-col min-w-0 transition-all duration-500"
      :class="[
        !isMobile && isSidebarOpen ? 'pl-[280px]' : '',
        !isMobile && !isSidebarOpen ? 'pl-[80px]' : ''
      ]"
    >
      <Navbar @toggle-sidebar="toggleSidebar" />

      <main class="flex-1 overflow-y-auto p-6 md:p-12 custom-scrollbar">
        <router-view v-slot="{ Component }">
          <transition
            name="page-fade"
            mode="out-in"
            appear
          >
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.page-fade-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #F0F7FF;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #BFDBFE;
  border-radius: 10px;
}
</style>
