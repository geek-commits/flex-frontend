import React from 'react';
import { AppShell } from '@/components/app-shell';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';

export interface AdminShellProps {
    title: string;
    subtitle?: string;
    eyebrow?: React.ReactNode;
    meta?: React.ReactNode;
    actions?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Canonical FLEX admin shell (universal inset icon-collapsible AppShell
 * adapted from @efferd/app-shell-3). Frame chrome (sidebar, header) is
 * owned by AppShell; this wrapper adds the in-content page header and
 * content container.
 */
export function AdminShell({ title, subtitle, eyebrow, meta, actions, children }: AdminShellProps) {
    return (
        <AppShell>
            <FlexPageContent className="flex flex-col gap-[var(--flex-space-section)]">
                <FlexPageHeader title={title} description={subtitle} eyebrow={eyebrow} meta={meta} actions={actions} />
                {children}
            </FlexPageContent>
        </AppShell>
    );
}
