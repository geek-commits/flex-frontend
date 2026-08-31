import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import type { DataGridFeatures } from '@/components/reui/data-grid/data-grid';
import type { CDRRecord } from '@/domain/types';
import type { QuickFilter } from '@/features/cdr/cdr-toolbar';

export interface CdrResultMetaProps {
    table: Table<DataGridFeatures, CDRRecord>;
    shown: number;
    total: number;
    quickFilter: QuickFilter;
}

export function CdrResultMeta({ shown, total, quickFilter }: CdrResultMetaProps) {
    const { t } = useTranslation('supervision');

    return (
        <div className="flex items-center justify-between gap-2">
            <span className="text-xs text-flex-text-muted">
                {t('cdr.resultMeta.shown', { shown, total })}
                {quickFilter !== 'all' && (
                    <span className="ml-2 text-flex-text-muted/70">• {t(`cdr.quickFilters.${quickFilter}` as const)}</span>
                )}
            </span>
        </div>
    );
}