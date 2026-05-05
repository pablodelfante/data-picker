<script setup lang="ts">
import type { CalendarDay } from '../core/picker';

defineProps<{
  grid: CalendarDay[];
}>();

defineEmits<{
  (e: 'select', day: CalendarDay): void;
}>();
</script>

<template>
  <div class="calendar-grid-container">
    <div class="days-header">
      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
    </div>

    <div class="grid" role="grid">
      <button
        v-for="(day, index) in grid"
        :key="index"
        class="day-cell"
        :class="{
          'is-other-month': !day.isCurrentMonth,
          'is-today': day.isToday,
          'is-selected': day.isSelected,
          'is-weekend': day.isWeekend
        }"
        @click="$emit('select', day)"
        role="gridcell"
        :aria-selected="day.isSelected"
      >
        {{ day.date.getDate() }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-weight: 600;
  font-size: 0.8rem;
  color: var(--accent);
  margin-bottom: 0.5rem;
  opacity: 0.8;
}

.grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.day-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text);
  transition: all 0.2s ease;
}

.day-cell:hover:not(.is-selected) {
  background: var(--accent-bg);
  color: var(--accent);
}

.day-cell.is-other-month {
  opacity: 0.3;
}

.day-cell.is-today {
  border: 1px solid var(--accent);
  font-weight: 700;
  color: var(--accent);
}

.day-cell.is-selected {
  background: var(--accent);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px var(--accent-bg);
}

.day-cell.is-weekend {
  /* Optional: differentiate weekends */
}
</style>
