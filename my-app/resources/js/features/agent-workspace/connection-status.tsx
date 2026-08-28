import { RiWifiLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { connectionStateMap } from '@/lib/status-styles';
import type { ConnectionState } from '@/types/flex';

export interface ConnectionStatusProps {
    state: ConnectionState;
    className?: string;
}

/**
 * Telephony connection indicator. Distinct from agent availability state
 * (docs/design/domain/agent-state.md §19 — Ready is not the same as Connected).
 */
export function ConnectionStatus({ state, className }: ConnectionStatusProps) {
    const { t } = useTranslation();

    if (state === 'live') {
        return null;
    }

    const cfg = connectionStateMap[state];
    const label = cfg.labelKey ? t(cfg.labelKey) : cfg.label;

    return (
        <div
            role="status"
            aria-label={`${t('common:status.connected')}: ${label}`}
            title={`${t('common:status.connected')}: ${label}`}
            className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium sm:px-2.5 ${cfg.bgClass} ${cfg.textClass} ${cfg.borderClass} ${className ?? ''}`}
        >
            <RiWifiLine className="size-3.5" />
            <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
            <span>{label}</span>
        </div>
    );
}
