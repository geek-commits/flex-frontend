import { Head } from '@inertiajs/react';
import { RiRefreshLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
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
    const { t } = useTranslation('supervision');
    const { isRefreshing, refresh } = useDashboardData();

    return (
        <AdminShell
            title={t('dashboard.title')}
            subtitle={t('dashboard.description')}
            
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
                    <span>{t('dashboard.refresh')}</span>
                    {isRefreshing && (
                        <span className="text-[10px] text-muted-foreground">
                            {t('dashboard.live.updating', { defaultValue: 'Updating…' })}
                        </span>
                    )}
                </Button>
            }
        >
            <Head title={`${t('dashboard.title')} — Flex Contact Center`} />
            <ContactCenterDashboardContent />
        </AdminShell>
    );
}
