<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import Picker, { type CalendarDay } from '../core/picker';

// Props for the component
const props = defineProps({
  modelValue: {
    type: Date,
    default: null
  },
  placeholder: {
    type: String,
    default: 'Select a date'
  }
});

const emit = defineEmits(['update:modelValue']);

// Initialize the Logic Engine
const picker = ref(new Picker(props.modelValue || new Date()));

// UI State
const isOpen = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);

// Watch for external changes to modelValue
watch(() => props.modelValue, (newDate) => {
  if (newDate) {
    // Update selection and sync the view to the new date's month
    picker.value.selectDate(newDate);
    // Reflect the month of the selected date in the navigation view
    picker.value.setViewDate(newDate); 
    updateGrid();
  }
}, { immediate: true });

// Derived state from the engine
const grid = ref<CalendarDay[]>(picker.value.getGrid());
const currentMonthName = ref(picker.value.getMonthName());
const currentYear = ref(picker.value.getYearString());
const selectedDateDisplay = ref('');

// Helper to format a date
const formatSelectedDate = (date: Date | null) => {
  if (!date) return '';
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Initialize the display label
selectedDateDisplay.value = formatSelectedDate(picker.value.getSelectedDate());

// The formatted date comes from internal state synced with the engine
const formattedDate = computed(() => selectedDateDisplay.value);

// Update the grid and labels whenever we navigate or select
const updateGrid = () => {
  grid.value = picker.value.getGrid();
  // We manually sync the engine's state with Vue reactivity
  currentMonthName.value = picker.value.getMonthName();
  currentYear.value = picker.value.getYearString();
  selectedDateDisplay.value = formatSelectedDate(picker.value.getSelectedDate());
};

// Navigation methods
const nextMonth = () => {
  picker.value.nextMonth();
  updateGrid();
};

const prevMonth = () => {
  picker.value.prevMonth();
  updateGrid();
};

const selectDate = (day: CalendarDay) => {
  picker.value.selectDate(day.date);
  // Ensure the view jumps to the month of the selected date if it was a padding day
  picker.value.setViewDate(day.date);
  emit('update:modelValue', day.date);
  updateGrid();
  isOpen.value = false; // Close after selection
};

// Toggle popover
const togglePicker = () => {
  isOpen.value = !isOpen.value;
};

// Close on click outside
const handleClickOutside = (event: MouseEvent) => {
  if (
    isOpen.value &&
    popoverRef.value &&
    !popoverRef.value.contains(event.target as Node) &&
    inputRef.value &&
    !inputRef.value.contains(event.target as Node)
  ) {
    isOpen.value = false;
  }
};

// Keyboard support
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('mousedown', handleClickOutside);
  document.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="date-picker">
    <div class="input-wrapper">
      <input
        ref="inputRef"
        type="text"
        readonly
        :value="formattedDate"
        :placeholder="placeholder"
        @click="togglePicker"
        class="picker-input"
        aria-haspopup="grid"
        :aria-expanded="isOpen"
      />
      <span class="calendar-icon">📅</span>
    </div>

    <transition name="fade">
      <div v-if="isOpen" ref="popoverRef" class="popover" role="dialog" aria-label="Calendar">
        <header class="popover-header">
          <button @click="prevMonth" class="nav-btn" aria-label="Previous Month">‹</button>
          <div class="current-view">
            <span class="month">{{ currentMonthName }}</span>
            <span class="year">{{ currentYear }}</span>
          </div>
          <button @click="nextMonth" class="nav-btn" aria-label="Next Month">›</button>
        </header>

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
            @click="selectDate(day)"
            role="gridcell"
            :aria-selected="day.isSelected"
          >
            {{ day.date.getDate() }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.date-picker {
  position: relative;
  width: 100%;
  max-width: 320px;
  font-family: var(--sans);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.picker-input {
  width: 100%;
  padding: 0.8rem 1rem;
  padding-right: 2.5rem;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg);
  color: var(--text);
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: var(--shadow);
}

.picker-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.calendar-icon {
  position: absolute;
  right: 1rem;
  pointer-events: none;
  opacity: 0.6;
}

.popover {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  width: 100%;
  background: var(--bg);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow);
  z-index: 1000;
  padding: 1.2rem;
  user-select: none;
  backdrop-filter: blur(10px);
}

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

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
