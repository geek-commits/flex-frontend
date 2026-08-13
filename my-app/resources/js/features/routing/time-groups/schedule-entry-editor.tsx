import { RiCloseLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ScheduleEntry } from '@/domain/routing-types';

const WEEKDAYS = [
    { value: 0, label: 'Sun' },
    { value: 1, label: 'Mon' },
    { value: 2, label: 'Tue' },
    { value: 3, label: 'Wed' },
    { value: 4, label: 'Thu' },
    { value: 5, label: 'Fri' },
    { value: 6, label: 'Sat' },
];

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1);
const MONTH_DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

export interface ScheduleEntryEditorProps {
    index: number;
    value: ScheduleEntry;
    onChange: (entry: ScheduleEntry) => void;
    onRemove?: () => void;
    removable?: boolean;
}

function toggleValue(values: number[], value: number): number[] {
    return values.includes(value) ? values.filter((v) => v !== value) : [...values, value];
}

/** A single routing schedule-entry editor (hours, weekdays, month days, months). */
export function ScheduleEntryEditor({ index, value, onChange, onRemove, removable }: ScheduleEntryEditorProps) {
    return (
        <div className="rounded-lg border border-border p-3 flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-flex-text-primary">Schedule Entry {index + 1}</p>
                {removable && onRemove && (
                    <Button variant="ghost" size="icon-xs" aria-label={`Remove schedule entry ${index + 1}`} onClick={onRemove}>
                        <RiCloseLine className="size-3.5" />
                    </Button>
                )}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-flex-text-muted">Hours</Label>
                    <div className="flex items-center gap-1.5">
                        <Input
                            type="time"
                            value={value.startTime}
                            onChange={(e) => onChange({ ...value, startTime: e.target.value })}
                            aria-label={`Entry ${index + 1} start time`}
                            className="h-9 w-32 text-xs"
                        />
                        <span className="text-xs text-flex-text-muted">to</span>
                        <Input
                            type="time"
                            value={value.endTime}
                            onChange={(e) => onChange({ ...value, endTime: e.target.value })}
                            aria-label={`Entry ${index + 1} end time`}
                            className="h-9 w-32 text-xs"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-flex-text-muted">Weekdays</Label>
                <div className="flex flex-wrap gap-1.5">
                    {WEEKDAYS.map((day) => {
                        const active = value.weekdays.includes(day.value);

                        return (
                            <button
                                key={day.value}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onChange({ ...value, weekdays: toggleValue(value.weekdays, day.value) })}
                                className={`h-8 w-9 rounded-md border text-xs font-semibold transition-colors ${
                                    active
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border bg-card text-flex-text-muted hover:bg-muted/50'
                                }`}
                            >
                                {day.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-flex-text-muted">Month Days</Label>
                <div className="flex flex-wrap gap-1">
                    {MONTH_DAYS.map((day) => {
                        const active = value.monthDays.includes(day);

                        return (
                            <button
                                key={day}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onChange({ ...value, monthDays: toggleValue(value.monthDays, day) })}
                                className={`h-7 w-7 rounded text-[11px] font-semibold transition-colors ${
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted/40 text-flex-text-muted hover:bg-muted/70'
                                }`}
                            >
                                {day}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <Label className="text-xs font-semibold text-flex-text-muted">Months of Year</Label>
                <div className="flex flex-wrap gap-1">
                    {MONTHS.map((month) => {
                        const active = value.months.includes(month);

                        return (
                            <button
                                key={month}
                                type="button"
                                aria-pressed={active}
                                onClick={() => onChange({ ...value, months: toggleValue(value.months, month) })}
                                className={`h-7 w-9 rounded text-[11px] font-semibold transition-colors ${
                                    active
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted/40 text-flex-text-muted hover:bg-muted/70'
                                }`}
                            >
                                {month}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
