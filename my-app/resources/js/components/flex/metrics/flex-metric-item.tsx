import React from 'react';

export interface FlexMetricItemProps {
    label: string;
    value: string | number | null | undefined;
    description?: string;
    trend?: {
        value: string;
        positive?: boolean;
    };
    icon?: React.ComponentType<{ className?: string }>;
    loading?: boolean;
}

/**
 * Shared FLEX metric item — one value in a compact operational summary strip.
 * Number is primary; icon is supportive and never wrapped in a large tinted circle.
 */
export function FlexMetricItem({
    label,
    value,
    description,
    trend,
    icon: Icon,
    loading = false,
}: FlexMetricItemProps) {
    if (loading) {
        return (
            <div className="flex flex-col gap-1 py-1 min-w-0">
                <div className="h-3 w-20 rounded-sm bg-muted/70 animate-pulse" />
                <div className="h-6 w-12 rounded-sm bg-muted/70 animate-pulse" />
            </div>
        );
    }

    const formattedValue = value === null || value === undefined ? 'No data' : value;

    return (
        <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-1.5">
                {Icon && <Icon className="size-3.5 text-flex-text-muted shrink-0" aria-hidden="true" />}
                <span className="text-[11px] font-medium uppercase tracking-wide text-flex-text-muted truncate">
                    {label}
                </span>
            </div>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold tracking-tight text-flex-text-primary flex-numeric leading-none">
                    {formattedValue}
                </span>
                {trend && (
                    <span
                        className={`text-xs font-semibold ${
                            trend.positive ? 'text-status-live' : 'text-destructive'
                        }`}
                    >
                        {trend.positive ? '↑' : '↓'} {trend.value}
                    </span>
                )}
            </div>
            {description && <p className="text-[11px] text-flex-text-muted truncate">{description}</p>}
        </div>
    );
}
