<template>
  <div
    class="scroll-progress"
    :style="{ transform: `scaleX(${progress})` }"
  ></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const progress = ref(0)

const updateProgress = () => {
  const scrollTop = window.scrollY
  const docHeight =
    document.documentElement.scrollHeight - window.innerHeight

  progress.value = docHeight > 0 ? scrollTop / docHeight : 0
}

onMounted(() => {
  updateProgress()
  window.addEventListener('scroll', updateProgress)
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateProgress)
})
</script>

<style scoped lang="scss">
@use '@/assets/styles/abstracts/variables' as variables;

.scroll-progress{

    position:fixed;

    top:0;

    left:0;

    width:100%;

    height:4px;

    background:variables.$color-primary;

    transform-origin:left;

    z-index:9999;

    box-shadow:
        0 0 15px rgba(255,204,0,.7);

}
</style>