<template>
  <svg class="aula-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path v-for="(path, index) in paths" :key="index" :d="path" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ name: { type: String, default: 'home' } })

const icons = {
  home: ['M3 10.5 12 3l9 7.5', 'M5 9.8V21h14V9.8', 'M9 21v-7h6v7'],
  program: ['M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z', 'M4 5.5v16', 'M8 7h8', 'M8 11h8'],
  folder: ['M3 6.5h7l2 2H21v10.5A2 2 0 0 1 19 21H5a2 2 0 0 1-2-2z'],
  tasks: ['M8 6h12', 'M8 12h12', 'M8 18h12', 'M4 6h.01', 'M4 12h.01', 'M4 18h.01'],
  progress: ['M4 19V9', 'M10 19V5', 'M16 19v-7', 'M22 19V3'],
  users: ['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2', 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M22 21v-2a4 4 0 0 0-3-3.87', 'M16 3.13a4 4 0 0 1 0 7.75'],
  inbox: ['M4 4h16v16H4z', 'M4 14h4l2 3h4l2-3h4'],
  attendance: ['M8 3v4', 'M16 3v4', 'M4 8h16', 'M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1z', 'm8 13 2 2 4-4'],
  grades: ['M5 20V10', 'M12 20V4', 'M19 20v-7'],
  account: ['M20 21a8 8 0 0 0-16 0', 'M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10'],
  external: ['M14 3h7v7', 'M10 14 21 3', 'M21 14v7H3V3h7'],
  menu: ['M4 6h16', 'M4 12h16', 'M4 18h16'],
  close: ['m6 6 12 12', 'M18 6 6 18'],
  bell: ['M18 8a6 6 0 1 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9', 'M10 21h4'],
  search: ['M21 21l-4.35-4.35', 'M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0'],
  logout: ['M10 17l5-5-5-5', 'M15 12H3', 'M21 19V5a2 2 0 0 0-2-2h-6'],
  chevron: ['m9 18 6-6-6-6'],
  check: ['m5 12 4 4L19 6'],
  clock: ['M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20', 'M12 6v6l4 2'],
  arrow: ['M5 12h14', 'm13 6 6 6-6 6'],
  spark: ['m12 3 1.4 4.6L18 9l-4.6 1.4L12 15l-1.4-4.6L6 9l4.6-1.4z', 'm19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z'],
  calendar: ['M7 3v3', 'M17 3v3', 'M4 8h16', 'M5 5h14a2 2 0 0 1 2 2v13H3V7a2 2 0 0 1 2-2z', 'M8 12h3', 'M8 16h6'],
  announcement: ['M4 13V9l12-5v14L4 13z', 'M16 8h3a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-3', 'M6 14l1 6h4l-1-7'],
  course: ['M4 5h16v14H4z', 'M8 9h8', 'M8 13h5'],
  activity: ['M3 12h4l2-5 4 10 2-5h6']
}

const paths = computed(() => icons[props.name] || icons.home)
</script>

<style scoped>
.aula-icon { width: 1.2em; height: 1.2em; display: block; flex: 0 0 auto; }
</style>
