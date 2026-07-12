<script setup>
import { CheckCircle2 } from 'lucide-vue-next'

defineProps({
  show: Boolean,
  message: {
    type: String,
    default: 'Action effectuée avec succès'
  }
})
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="show" class="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm overflow-hidden bg-white rounded-xl shadow-lg border border-emerald-100">
      <div class="flex items-center justify-center w-12 bg-emerald-500">
        <CheckCircle2 class="w-6 h-6 text-white" />
      </div>
      <div class="px-4 py-3">
        <span class="font-bold text-emerald-600 text-sm">Succès</span>
        <p class="text-xs text-gray-600 font-medium">{{ message }}</p>
      </div>
    </div>
  </Transition>
</template>
