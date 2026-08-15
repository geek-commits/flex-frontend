import { Link } from '@inertiajs/react';
import { RiArrowRightSLine } from '@remixicon/react';
import React from 'react';
import { FlexIcon } from '@/components/flex/iconography';
import type { ModuleEntry } from '@/domain/modules';

export interface ConsoleModuleItemProps {
    module: ModuleEntry;
}

/**
 * Compact administration module row — icon chip + name + one-line purpose.
 * The entire row is the link; destinations are internal FLEX routes.
 */
export function ConsoleModuleItem({ module }: ConsoleModuleItemProps) {

    return (
        <Link
            href={module.href}
            className="group flex flex-focus-visible items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 transition-colors duration-flex-fast hover:border-primary/40 hover:bg-muted/40 active:bg-muted/60"
        >
            <span
                className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors duration-flex-fast group-hover:bg-primary/15"
                aria-hidden="true"
            >
                <FlexIcon name={module.icon} className="size-[18px]" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[length:var(--flex-font-size-card-title)] font-semibold leading-tight text-foreground">
                    {module.title}
                </span>
                <span className="truncate text-[length:var(--flex-font-size-caption)] leading-snug text-muted-foreground">
                    {module.description}
                </span>
            </span>
            <RiArrowRightSLine
                className="size-4 shrink-0 text-muted-foreground/70 transition-colors duration-flex-fast group-hover:text-primary"
                aria-hidden="true"
            />
        </Link>
    );
}