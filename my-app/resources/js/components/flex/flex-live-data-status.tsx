import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { LOCALE_CONFIG, useFlexLocale } from '@/i18n/locale';
import { connectionStateMap } from '@/lib/status-styles';

export type FlexLiveConnectionState = 'live' | 'stale' | 'reconnecting' | 'error';

export interface FlexLiveDataStatusProps {
    connectionState: FlexLiveConnectionState;
    lastUpdated: Date | null;
    isRefreshing: boolean;
    onRefresh?: () => void;
    title?: string;
    description?: string;
}

export function FlexLiveDataStatus({
    connectionState,
    lastUpdated,
    isRefreshing,
    onRefresh,
    title,
    description,
}: FlexLiveDataStatusProps) {
    const { t } = useTranslation('supervision');
    const { locale } = useFlexLocale();
    const tone = connectionStateMap[connectionState];
    const label = tone.labelKey ? t(tone.labelKey as string, tone.label) : tone.label;

    // Relative-time localization uses the platform Intl.RelativeTimeFormat API.
    // This provides native en/sw/fr support and avoids maintaining a custom
    // date-fns Swahili locale shim.
    const relativeTime = useMemo(() => {
        if (!lastUpdated) {
return '';
}

        const diffMs = lastUpdated.getTime() - Date.now();
        const abs = Math.abs(diffMs);
        const sec = Math.round(diffMs / 1000);
        const min = Math.round(diffMs / 60_000);
        const hour = Math.round(diffMs / 3_600_000);
        const day = Math.round(diffMs / 86_400_000);
        let value: number;
        let unit: Intl.RelativeTimeFormatUnit;

        if (abs < 60_000) {
            value = sec;
            unit = 'second';
        } else if (abs < 3_600_000) {
            value = min;
            unit = 'minute';
        } else if (abs < 86_400_000) {
            value = hour;
            unit = 'hour';
        } else {
            value = day;
            unit = 'day';
        }

        const intlLocale = LOCALE_CONFIG[locale]?.formatLocale ?? 'en-GB';

        // Map to Intl expected: en → en, sw-TZ → sw-TZ, fr-FR → fr-FR all valid
        try {
            return new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' }).format(value, unit);
        } catch {
            return new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(value, unit);
        }
    }, [lastUpdated, locale]);

    return (
        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
            {title && (
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-flex-text-primary">
                        {title}
                    </span>
                    {description && (
                        <span className="text-xs text-flex-text-muted">
                            {description}
                        </span>
                    )}
                </div>
            )}

            <div className="flex shrink-0 flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                    <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold capitalize ${tone.bgClass} ${tone.textClass}`}
                    >
                        <span
                            className={`size-1.5 rounded-full ${tone.dotClass}`}
                            aria-hidden="true"
                        />
                        {label}
                    </span>

                    {lastUpdated && !isRefreshing && (
                        <span className="text-xs text-flex-text-muted">
                            {t('dashboard.live.updated', {
                                time: relativeTime,
                                defaultValue: relativeTime,
                            })}
                        </span>
                    )}
                </div>

                {connectionState === 'error' && onRefresh && (
                    <button
                        type="button"
                        onClick={onRefresh}
                        className="rounded-md bg-primary px-2.5 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        {t('dashboard.live.retry')}
                    </button>
                )}
            </div>
        </div>
    );
}
