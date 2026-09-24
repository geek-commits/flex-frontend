import { Head } from '@inertiajs/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardProvider } from '@/features/dashboard/dashboard-context';
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

    return (
        <AdminShell
            title={t('dashboard.title')}
            subtitle={t('dashboard.description')}
        >
            <Head title={`${t('dashboard.title')} — Flex Contact Center`} />
            <ContactCenterDashboardContent />
        </AdminShell>
    );
}
