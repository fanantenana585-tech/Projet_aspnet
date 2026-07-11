<script setup>
import { Save, RotateCcw } from 'lucide-vue-next'

defineProps({
  show: Boolean
})

defineEmits(['save', 'reset'])
</script>

<template>
  <Transition
    enter-active-class="transition duration-500 ease-out"
    enter-from-class="translate-y-full"
    enter-to-class="translate-y-0"
    leave-active-class="transition duration-300 ease-in"
    leave-from-class="translate-y-0"
    leave-to-class="translate-y-full"
  >
    <div v-if="show" class="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div class="bg-white text-gray-900 p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-6">
        <div class="flex items-center gap-3 ml-2">
          <div class="w-2 h-2 rounded-full bg-emit-blue animate-pulse"></div>
          <p class="text-sm font-black uppercase tracking-widest">Modifications non enregistrées</p>
        </div>

        <div class="flex gap-3">
          <button
            @click="$emit('reset')"
            class="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors flex items-center gap-2"
          >
            <RotateCcw :size="14" /> Annuler
          </button>
          <button
            @click="$emit('save')"
            class="px-6 py-2 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
          >
            <Save :size="14" /> Sauvegarder
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>
