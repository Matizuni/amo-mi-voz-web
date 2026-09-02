<template>
  <div class="public-layout">
    <AppNavbar />

    <main class="public-layout__content">
      <RouterView />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'

import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppFooter from '@/components/layout/AppFooter.vue'
</script>

<style scoped>
.public-layout {
  min-height: 100vh;
  background: #070707;
}

.public-layout__content {
  min-height: 70vh;
}
</style>
