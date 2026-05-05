<script setup lang="ts">
defineProps<{
  monthName: string;
  yearString: string;
}>();

defineEmits<{
  (e: 'prev'): void;
  (e: 'next'): void;
}>();
</script>

<template>
  <header class="popover-header">
    <button @click="$emit('prev')" class="nav-btn" aria-label="Previous Month">‹</button>
    <div class="current-view">
      <span class="month">{{ monthName }}</span>
      <span class="year">{{ yearString }}</span>
    </div>
    <button @click="$emit('next')" class="nav-btn" aria-label="Next Month">›</button>
  </header>
</template>

<style scoped>
.popover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
}

.current-view {
  font-weight: 600;
  font-family: var(--heading);
  display: flex;
  gap: 0.5rem;
}

.month {
  color: var(--text-h);
}

.year {
  opacity: 0.6;
}

.nav-btn {
  background: var(--accent-bg);
  border: 1px solid var(--accent-border);
  color: var(--accent);
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: var(--accent);
  color: white;
}
</style>
