<template>
  <main class="home">
    <!-- HERO -->
    <HeroSection />

    <!-- ACADEMIA -->
    <AboutSection />

    <!-- FORMACIÓN -->
    <WorkshopsSection />

    <!-- AULA VIRTUAL -->
    <VirtualClassroomSection />

    <!-- BENEFICIOS -->
    <BenefitsSection />

    <!-- EXPERIENCIAS REALES -->
    <ExperiencesSection />

    <!-- EXPERIENCIAS ESCÉNICO-MUSICALES -->
    <MusicalsSection />

    <!-- IDENTIDAD / FILOSOFÍA -->
    <QuoteSection />

    <!-- LLAMADO FINAL -->
    <FinalCtaSection />
  </main>
</template>

<script setup>
import HeroSection from '@/components/home/HeroSection.vue'
import AboutSection from '@/components/home/AboutSection.vue'
import WorkshopsSection from '@/components/home/WorkshopsSection.vue'
import VirtualClassroomSection from '@/components/home/VirtualClassroomSection.vue'
import BenefitsSection from '@/components/home/BenefitsSection.vue'
import ExperiencesSection from '@/components/home/ExperiencesSection.vue'
import MusicalsSection from '@/components/home/MusicalsSection.vue'
import QuoteSection from '@/components/home/QuoteSection.vue'
import FinalCtaSection from '@/components/home/FinalCtaSection.vue'
</script>

<style scoped>
.home {
  min-height: 100vh;
  overflow: hidden;
  background: #070707;
}
</style>
