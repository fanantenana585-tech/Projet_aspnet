<script setup>
defineProps({
  label: String,
  description: String
})
</script>

<template>
  <div class="flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 border-b border-gray-800/50 last:border-0">
    <div class="max-w-md">
      <h4 class="text-sm font-bold text-white mb-1">{{ label }}</h4>
      <p class="text-xs text-gray-500 leading-relaxed">{{ description }}</p>
    </div>
    <div class="flex items-center">
      <slot />
    </div>
  </div>
</template>
