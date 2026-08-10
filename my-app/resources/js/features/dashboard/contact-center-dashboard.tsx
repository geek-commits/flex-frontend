import { Head } from '@inertiajs/react';
import { RiRefreshLine, RiDashboardLine } from '@remixicon/react';
import React from 'react';
import type { ContextSidebarGroup } from '@/components/flex/context-sidebar';
import { Button } from '@/components/ui/button';
import {
    DashboardProvider,
    useDashboardData,
} from '@/features/dashboard/dashboard-context';
import { AdminShell } from '@/layouts/admin-shell';
import { ContactCenterDashboardContent } from './contact-center-dashboard-content';

const dashboardContextGroups: ContextSidebarGroup[] = [
    {
        groupTitle: 'Supervision',
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: RiDashboardLine,
                capability: 'dashboard.view',
            },
        ],
    },
    {
        groupTitle: 'Operations',
        items: [
            {
                title: 'Call Records (CDR)',
                href: '/admin/cdr',
                capability: 'cdr.view',
            },
            {
                title: 'Call Campaigns',
                href: '/admin/campaigns',
                capability: 'campaigns.view',
            },
            {
                title: 'Reports & Analytics',
                href: '/admin/reports',
                capability: 'reports.view',
            },
        ],
    },
];

export function ContactCenterDashboard() {
    return (
        <DashboardProvider>
            <ContactCenterDashboardInner />
        </DashboardProvider>
    );
}

function ContactCenterDashboardInner() {
    const { isRefreshing, refresh } = useDashboardData();

    return (
        <AdminShell
            title="Contact Center Dashboard"
            subtitle="Real-Time Operational Analytics & Telephony Monitoring"
            contextTitle="Supervision"
            contextSubtitle="Live queue, agent, and SLA monitoring"
            contextGroups={dashboardContextGroups}
            actions={
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={refresh}
                    disabled={false}
                    aria-busy={isRefreshing}
                >
                    <RiRefreshLine className="size-3.5" />
                    <span>Refresh Live Data</span>
                    {isRefreshing && (
                        <span className="text-[10px] text-muted-foreground">
                            Updating…
                        </span>
                    )}
                </Button>
            }
        >
            <Head title="Contact Center Dashboard — Flex Contact Center" />
            <ContactCenterDashboardContent />
        </AdminShell>
    );
}
