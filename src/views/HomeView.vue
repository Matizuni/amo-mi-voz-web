<template>
  <AppNavbar />

  <main>
    <HeroSection />
    <AboutSection />
    <WorkshopsSection />
  </main>
</template>

<script setup>
import AppNavbar from '../components/layout/AppNavbar.vue'
import HeroSection from '../components/home/HeroSection.vue'
import AboutSection from '../components/home/AboutSection.vue'
import WorkshopsSection from '../components/home/WorkshopsSection.vue'
import BenefitsSection from '../components/home/BenefitsSection.vue'
</script>