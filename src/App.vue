<script setup>
import { RouterView } from 'vue-router'
import NotificationBell from './components/NotificationBell.vue'
</script>

<template>
  <div>
    <div class="fixed top-4 right-6 z-50">
      <NotificationBell />
    </div>
    <RouterView />
  </div>
</template>

<style>
/* Global styles in main.css */
</style>
