<template>
  <article class="unit-card">
    <div class="unit-card__icon" aria-hidden="true">
      {{ icon }}
    </div>

    <div class="unit-card__copy">
      <strong>{{ title }}</strong>
      <p>{{ description }}</p>
    </div>

    <span class="unit-card__arrow" aria-hidden="true">→</span>
  </article>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: '♪'
  }
})
</script>

<style scoped>
.unit-card {
  display: grid;
  grid-template-columns: auto minmax(0,1fr) auto;
  gap: 13px;
  align-items: center;
  min-height: 104px;
  padding: 16px;
  border: 1px solid #dce4ed;
  border-radius: 15px;
  background: #fff;
  box-shadow: 0 8px 22px rgba(31,48,73,.035);
  transition: transform .18s ease, border-color .18s ease, box-shadow .18s ease;
}

.unit-card:hover {
  transform: translateY(-2px);
  border-color: #c6d2df;
  box-shadow: 0 12px 28px rgba(31,48,73,.065);
}

.unit-card__icon {
  display: grid;
  width: 44px;
  height: 44px;
  place-items: center;
  border-radius: 13px;
  color: #9f1945;
  background: #fff1f5;
  font-size: 1rem;
  font-weight: 900;
}

.unit-card__copy strong {
  display: block;
  color: #152033;
  font-size: .78rem;
}

.unit-card__copy p {
  margin: 5px 0 0;
  color: #6f7c8f;
  font-size: .61rem;
  line-height: 1.5;
}

.unit-card__arrow {
  color: #9f1945;
  font-size: .9rem;
}

@media (max-width: 600px) {
  .unit-card {
    min-height: 96px;
    padding: 14px;
  }
}
</style>
