<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useNotificationStore } from '@/stores/notificationStore'
import { Bell } from 'lucide-vue-next'

const store = useNotificationStore()
const open = ref(false)

onMounted(() => {
  store.connect().catch(() => {})
})
onUnmounted(() => store.disconnect())

function toggle() {
  open.value = !open.value
}

function clear() {
  store.markAllRead()
}
</script>

<template>
  <div class="relative">
    <button class="p-2 rounded-full bg-white/5" @click="toggle">
      <Bell :size="20" class="text-white" />
      <span v-if="store.notifications.length > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1">{{ store.notifications.length }}</span>
    </button>

    <div v-if="open" class="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-lg shadow-lg z-50">
      <div class="p-3 flex justify-between items-center">
        <div class="text-sm font-medium">Notifications</div>
        <button class="text-xs text-gray-400" @click="clear">Marquer tout lu</button>
      </div>
      <div class="max-h-64 overflow-auto">
        <div v-for="(n, i) in store.notifications" :key="i" class="p-3 border-t border-gray-800">
          <div class="text-sm font-semibold text-white">{{ n.title }}</div>
          <div class="text-xs text-gray-400">{{ n.body }}</div>
          <div class="text-[10px] text-gray-500 mt-1">{{ n.timestamp ? new Date(n.timestamp).toLocaleString() : '' }}</div>
        </div>
        <div v-if="store.notifications.length === 0" class="p-3 text-sm text-gray-400">Aucune notification</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.relative .absolute { min-width: 18rem; }
</style>
