import { formatDistanceToNow } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useFlexLocale } from '@/i18n/locale';
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

    const getDateFnsLocale = () => {
        if (locale === 'fr') return fr;
        if (locale === 'en') return enUS;
        return undefined; // sw fallback to Intl via date-fns default (en) — documented
    };

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
                                time: formatDistanceToNow(lastUpdated, {
                                    addSuffix: true,
                                    locale: getDateFnsLocale(),
                                }),
                                defaultValue: `Updated ${formatDistanceToNow(lastUpdated, { addSuffix: true, locale: getDateFnsLocale() })}`,
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
