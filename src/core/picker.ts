/**
 * Represents a single day in the calendar grid
 */
export interface CalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
    isWeekend: boolean;
}

class Picker {
    private viewDate: Date;
    private selectedDate: Date | null = null;

    constructor(initialDate: Date = new Date()) {
        // We normalize the view date to the first day of the month
        this.viewDate = new Date(
            initialDate.getFullYear(),
            initialDate.getMonth(),
            1,
        );
    }

    /**
     * Returns the month currently being viewed
     */
    public getViewDate(): Date {
        return new Date(this.viewDate);
    }

    /**
     * Sets the month to view
     */
    public setViewDate(date: Date): void {
        this.viewDate = new Date(date.getFullYear(), date.getMonth(), 1);
    }

    /**
     * Returns the currently selected date
     */
    public getSelectedDate(): Date | null {
        return this.selectedDate ? new Date(this.selectedDate) : null;
    }

    /**
     * Updates the selected date
     */
    public selectDate(date: Date): void {
        this.selectedDate = new Date(date);
    }

    /**
     * Navigates to the next month
     */
    public nextMonth(): void {
        this.viewDate.setMonth(this.viewDate.getMonth() + 1);
    }

    /**
     * Navigates to the previous month
     */
    public prevMonth(): void {
        this.viewDate.setMonth(this.viewDate.getMonth() - 1);
    }

    /**
     * Navigates to the next year
     */
    public nextYear(): void {
        this.viewDate.setFullYear(this.viewDate.getFullYear() + 1);
    }

    /**
     * Navigates to the previous year
     */
    public prevYear(): void {
        this.viewDate.setFullYear(this.viewDate.getFullYear() - 1);
    }

    /**
     * Generates a 6x7 grid of dates for the current view month.
     * Includes leading and trailing days from adjacent months to ensure
     * the grid always has 6 complete rows.
     */
    public getGrid(): CalendarDay[] {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        // 1. Find the first day of the currently viewed month
        const firstDayOfMonth = new Date(year, month, 1);

        // 2. Determine the day of the week for the 1st (0 = Sunday, 6 = Saturday)
        // This tells us how many days from the previous month we need to show
        const firstDayOfWeek = firstDayOfMonth.getDay();

        // 3. Calculate the start date of the grid
        // We go back from the 1st of the month by 'firstDayOfWeek' days
        const startDate = new Date(firstDayOfMonth);
        startDate.setDate(startDate.getDate() - firstDayOfWeek);

        const grid: CalendarDay[] = [];
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today for comparison

        // 4. Fill a 42-day grid (6 weeks)
        // This provides a consistent UI height across all months
        for (let i = 0; i < 42; i++) {
            const currentDate = new Date(startDate);
            currentDate.setDate(startDate.getDate() + i);
            currentDate.setHours(0, 0, 0, 0);

            grid.push({
                date: currentDate,
                // Check if the day belongs to the month being viewed or is padding
                isCurrentMonth: currentDate.getMonth() === month,
                // Check if it's the current real-world date
                isToday: currentDate.getTime() === today.getTime(),
                // Check if this date matches the user's current selection
                isSelected: this.selectedDate
                    ? currentDate.getTime() === this.selectedDate.getTime()
                    : false,
                // Weekend flag for styling purposes (Sat/Sun)
                isWeekend:
                    currentDate.getDay() === 0 || currentDate.getDay() === 6,
            });
        }
        return grid;
    }

    /**
     * Helper to get the name of the month
     */
    public getMonthName(locale: string = "en-US"): string {
        return this.viewDate.toLocaleString(locale, { month: "long" });
    }

    /**
     * Helper to get the year string
     */
    public getYearString(): string {
        return this.viewDate.getFullYear().toString();
    }
}

export default Picker;
