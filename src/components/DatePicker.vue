<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
// import Picker, { type CalendarDay } from '../core/picker';
import CalendarHeader from './CalendarHeader.vue';
import CalendarGrid from './CalendarGrid.vue';
import {  Picker, CalendarDay  } from "datapicker-lib";

// Props for the component
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Select a date'
  }
});

// Initialize the Logic Engine
const picker = ref(new Picker(new Date()));

// UI State
const isOpen = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);
const popoverRef = ref<HTMLDivElement | null>(null);

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
        <CalendarHeader
          :month-name="currentMonthName"
          :year-string="currentYear"
          @prev="prevMonth"
          @next="nextMonth"
        />

        <CalendarGrid
          :grid="grid"
          @select="selectDate"
        />
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
