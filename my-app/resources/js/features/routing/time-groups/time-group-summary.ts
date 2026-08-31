import type { TFunction } from 'i18next';
import type { ScheduleEntry } from '@/domain/routing-types';

type AdminT = TFunction<'administration', undefined>;

const WEEKDAY_KEYS = [
    'timeGroups.editor.weekdaysShort.sun',
    'timeGroups.editor.weekdaysShort.mon',
    'timeGroups.editor.weekdaysShort.tue',
    'timeGroups.editor.weekdaysShort.wed',
    'timeGroups.editor.weekdaysShort.thu',
    'timeGroups.editor.weekdaysShort.fri',
    'timeGroups.editor.weekdaysShort.sat',
] as const;

/** Human-readable summary of a single schedule entry. */
export function formatScheduleEntry(entry: ScheduleEntry, t: AdminT): string {
    const days =
        entry.weekdays.length > 0
            ? entry.weekdays
                  .slice()
                  .sort((a, b) => a - b)
                  .map((day) => t(WEEKDAY_KEYS[day]))
                  .join(', ')
            : entry.monthDays.length > 0
              ? t('timeGroups.summary.day', { days: entry.monthDays.slice().sort((a, b) => a - b).join(', ') })
              : entry.months.length > 0
                ? entry.months
                      .slice()
                      .sort((a, b) => a - b)
                      .map((month) => t('timeGroups.summary.monthPrefix', { month }))
                      .join(', ')
                : t('timeGroups.summary.everyDay');

    return `${days} · ${entry.startTime}–${entry.endTime}`;
}

/** Concise summary for a time group (may show "N schedule entries" for complex groups). */
export function formatTimeGroupSummary(entries: ScheduleEntry[], t: AdminT): string {
    if (entries.length === 0) {
        return t('timeGroups.summary.noEntries');
    }

    if (entries.length === 1) {
        return formatScheduleEntry(entries[0], t);
    }

    return t('timeGroups.summary.entries', { count: entries.length });
}
