<script setup>
import { useThemeStore } from '../../stores/themeStore'

const props = defineProps({
  modelValue: Boolean,
  size: {
    type: String,
    default: 'normal'
  }
})

const themeStore = useThemeStore()
const emit = defineEmits(['update:modelValue'])

const toggle = () => {
  emit('update:modelValue', !props.modelValue)
}
</script>

<template>
  <button
    @click="toggle"
    type="button"
    :class="[
      'relative inline-flex items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#1E293B]',
      modelValue ? '' : 'bg-gray-700',
      size === 'small' ? 'h-5 w-9' : 'h-6 w-11'
    ]"
    :style="{ backgroundColor: modelValue ? themeStore.couleurAccent : '' }"
  >
    <span
      :class="[
        'inline-block rounded-full bg-white transition-transform duration-300 shadow-lg',
        size === 'small' ? 'h-3 w-3' : 'h-4 w-4',
        modelValue
          ? (size === 'small' ? 'translate-x-5' : 'translate-x-6')
          : 'translate-x-1'
      ]"
    />
  </button>
</template>

