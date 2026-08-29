import { RiCloseLine, RiSearchLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Input } from '@/components/ui/input';

export interface ConsoleSearchProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

/**
 * Management Console module search. Searches administration module metadata
 * only (label / description / keywords) — it is not a global data search.
 * Filtering happens against the already permission-filtered module set.
 */
export function ConsoleSearch({ value, onChange, placeholder }: ConsoleSearchProps) {
    const { t } = useTranslation('administration');
    const resolvedPlaceholder = placeholder ?? t('console.search.placeholder');

    return (
        <div className="relative w-full max-w-md">
            <RiSearchLine
                className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
            />
            <Input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder={resolvedPlaceholder}
                aria-label={t('console.search.ariaLabel')}
                className="h-9 pl-8 pr-8 text-xs bg-card"
            />
            {value && (
                <button
                    type="button"
                    onClick={() => onChange('')}
                    aria-label={t('console.search.clear')}
                    className="absolute right-1 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors duration-[var(--flex-duration-fast)] hover:text-foreground flex-focus-visible"
                >
                    <RiCloseLine className="size-4" aria-hidden="true" />
                </button>
            )}
        </div>
    );
}