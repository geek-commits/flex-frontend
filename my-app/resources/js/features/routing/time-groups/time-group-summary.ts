import type { ScheduleEntry } from '@/domain/routing-types';

const WEEKDAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Human-readable summary of a single schedule entry. */
export function formatScheduleEntry(entry: ScheduleEntry): string {
    const days =
        entry.weekdays.length > 0
            ? entry.weekdays
                  .slice()
                  .sort((a, b) => a - b)
                  .map((day) => WEEKDAYS_SHORT[day])
                  .join(', ')
            : entry.monthDays.length > 0
              ? `Day ${entry.monthDays.slice().sort((a, b) => a - b).join(', ')}`
              : entry.months.length > 0
                ? entry.months
                      .slice()
                      .sort((a, b) => a - b)
                      .map((month) => `M${month}`)
                      .join(', ')
                : 'Every day';

    return `${days} · ${entry.startTime}–${entry.endTime}`;
}

/** Concise summary for a time group (may show "N schedule entries" for complex groups). */
export function formatTimeGroupSummary(entries: ScheduleEntry[]): string {
    if (entries.length === 0) {
        return 'No schedule entries';
    }

    if (entries.length === 1) {
        return formatScheduleEntry(entries[0]);
    }

    return `${entries.length} schedule entries`;
}
