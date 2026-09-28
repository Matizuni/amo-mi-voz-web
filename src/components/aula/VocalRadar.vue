<template>
  <div class="vocal-radar" role="img" :aria-label="ariaLabel">
    <svg viewBox="0 0 360 360" aria-hidden="true">
      <g transform="translate(180 180)">
        <polygon
          v-for="level in 5"
          :key="level"
          :points="polygonFor(Array(stats.length).fill(level / 5))"
          class="vocal-radar__grid"
        />
        <line
          v-for="(_, index) in stats"
          :key="`axis-${index}`"
          x1="0" y1="0"
          :x2="point(index, 1).x"
          :y2="point(index, 1).y"
          class="vocal-radar__axis"
        />
        <polygon :points="polygonFor(normalizedValues)" class="vocal-radar__shape" />
        <circle
          v-for="(value, index) in normalizedValues"
          :key="`point-${index}`"
          :cx="point(index, value).x"
          :cy="point(index, value).y"
          r="4"
          class="vocal-radar__point"
        />
      </g>
    </svg>
    <span
      v-for="(stat, index) in stats"
      :key="stat.key"
      class="vocal-radar__label"
      :style="labelStyle(index)"
    >{{ stat.shortLabel || stat.label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stats: { type: Array, default: () => [] },
  max: { type: Number, default: 5 }
})

const normalizedValues = computed(() =>
  props.stats.map(stat => Math.max(0, Math.min(1, Number(stat.value || 0) / props.max)))
)

const point = (index, ratio) => {
  const count = Math.max(1, props.stats.length)
  const angle = (-Math.PI / 2) + (Math.PI * 2 * index / count)
  const radius = 122 * ratio
  return { x: Math.cos(angle) * radius, y: Math.sin(angle) * radius }
}

const polygonFor = values => values.map((value, index) => {
  const p = point(index, value)
  return `${p.x},${p.y}`
}).join(' ')

const labelStyle = index => {
  const count = Math.max(1, props.stats.length)
  const angle = (-Math.PI / 2) + (Math.PI * 2 * index / count)
  const radius = 156
  const x = 50 + Math.cos(angle) * radius / 3.6
  const y = 50 + Math.sin(angle) * radius / 3.6
  return { left: `${x}%`, top: `${y}%` }
}

const ariaLabel = computed(() =>
  props.stats.map(stat => `${stat.label}: ${stat.value || 0} de ${props.max}`).join('. ')
)
</script>

<style scoped>
.vocal-radar{position:relative;aspect-ratio:1;max-width:440px;margin:auto}.vocal-radar svg{width:100%;height:100%;overflow:visible}.vocal-radar__grid{fill:none;stroke:#dbe3ec;stroke-width:1}.vocal-radar__axis{stroke:#e7ebf1;stroke-width:1}.vocal-radar__shape{fill:rgba(159,25,69,.16);stroke:#9f1945;stroke-width:3}.vocal-radar__point{fill:#d9a91d;stroke:#fff;stroke-width:2}.vocal-radar__label{position:absolute;transform:translate(-50%,-50%);max-width:100px;text-align:center;color:#475467;font-size:.68rem;font-weight:800;line-height:1.15}
</style>
