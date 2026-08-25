import { Head } from '@inertiajs/react';
import { RiRefreshLine } from '@remixicon/react';
import React from 'react';
import { Button } from '@/components/ui/button';
import {
    DashboardProvider,
    useDashboardData,
} from '@/features/dashboard/dashboard-context';
import { AdminShell } from '@/layouts/admin-shell';
import { ContactCenterDashboardContent } from './contact-center-dashboard-content';



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
            
            actions={
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={refresh}
                    disabled={isRefreshing}
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
