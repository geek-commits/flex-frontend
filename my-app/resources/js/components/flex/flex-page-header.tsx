import React from 'react';

export interface FlexPageHeaderProps {
    title: string;
    description?: string;
    eyebrow?: React.ReactNode;
    actions?: React.ReactNode;
    meta?: React.ReactNode;
}

/**
 * Canonical FLEX page header — compact, operational, in-content.
 * Rendered inside FlexPageContent by the shell; pages pass title/description/actions.
 */
export function FlexPageHeader({ title, description, eyebrow, actions, meta }: FlexPageHeaderProps) {
    return (
        <header className="flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
            <div className="flex flex-col gap-1 min-w-0">
                {eyebrow && <div className="text-xs font-medium text-flex-brand">{eyebrow}</div>}
                <h1 className="text-[length:var(--flex-font-size-page-title)] font-semibold tracking-tight text-flex-text-primary leading-tight">
                    {title}
                </h1>
                {description && (
                    <p className="text-[length:var(--flex-font-size-subtitle)] text-flex-text-muted leading-snug">
                        {description}
                    </p>
                )}
                {meta && (
                    <div className="mt-0.5 text-[length:var(--flex-font-size-caption)] text-flex-text-muted">{meta}</div>
                )}
            </div>
            {actions && <div className="flex items-center gap-2 flex-wrap shrink-0">{actions}</div>}
        </header>
    );
}
