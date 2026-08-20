import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export interface MetricCardProps {
    title: string;
    value: string | number | null | undefined;
    description?: string;
    trend?: {
        value: string;
        positive?: boolean;
    };
    icon?: React.ComponentType<{ className?: string }>;
    loading?: boolean;
    className?: string;
}

export function MetricCard({
    title,
    value,
    description,
    trend,
    icon: Icon,
    loading = false,
    className = '',
}: MetricCardProps) {
    if (loading) {
        return (
            <Card className={`bg-card border-border shadow-2xs ${className}`}>
                <CardContent className="p-4 flex flex-col gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-7 w-16 my-1" />
                    <Skeleton className="h-3 w-32" />
                </CardContent>
            </Card>
        );
    }

    const formattedValue = value === null || value === undefined ? 'No data' : value;

    return (
        <Card className={`bg-card border-border shadow-2xs hover:border-primary/30 transition-all ${className}`}>
            <CardContent className="p-4 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-2">
                    <span className="flex-label text-muted-foreground uppercase tracking-wide truncate" title={title}>
                        {title}
                    </span>
                    {Icon && (
                        <div className="p-1.5 rounded-md bg-muted/60 text-muted-foreground shrink-0">
                            <Icon className="size-4" />
                        </div>
                    )}
                </div>

                <div className="mt-2 mb-1 flex items-baseline justify-between gap-2">
                    <span
                        className={`flex-metric ${
                            value === null || value === undefined
                                ? 'text-muted-foreground text-base italic'
                                : 'text-foreground'
                        }`}
                    >
                        {formattedValue}
                    </span>

                    {trend && (
                        <span
                            className={`text-xs font-semibold px-1.5 py-0.5 rounded-sm ${
                                trend.positive
                                    ? 'bg-status-live-bg text-status-live'
                                    : 'bg-status-disconnected-bg text-status-disconnected'
                            }`}
                        >
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </span>
                    )}
                </div>

                {description && <p className="text-[11px] text-muted-foreground mt-0.5 truncate" title={description}>{description}</p>}
            </CardContent>
        </Card>
    );
}

export function MetricGroup({ children, className = '' }: { children: React.ReactNode; className?: string }) {
    return <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 ${className}`}>{children}</div>;
}
