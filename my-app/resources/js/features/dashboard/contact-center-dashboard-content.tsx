import React, { Suspense, lazy } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexLiveDataStatus } from '@/components/flex/flex-live-data-status';
import { Skeleton } from '@/components/ui/skeleton';
import { OperationalException } from '@/features/dashboard/operational-exception';
import { OperationsSummary } from '@/features/dashboard/operations-summary';
import { useDashboardData } from '@/features/dashboard/use-dashboard-data';

const ContactCenterTrafficChart = lazy(() =>
    import('@/features/dashboard/contact-center-traffic-chart').then((m) => ({
        default: m.ContactCenterTrafficChart,
    })),
);
const QueueHealth = lazy(() =>
    import('@/features/dashboard/queue-health').then((m) => ({ default: m.QueueHealth })),
);
const ActiveCalls = lazy(() =>
    import('@/features/dashboard/active-calls').then((m) => ({ default: m.ActiveCalls })),
);
const AgentWallboard = lazy(() =>
    import('@/features/dashboard/agent-wallboard').then((m) => ({ default: m.AgentWallboard })),
);

function CardSkeleton({ bodyClassName }: { bodyClassName: string }) {
    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="flex items-center justify-between border-b border-flex-workspace-divider px-4 py-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
            </div>
            <div className={`${bodyClassName} flex items-center justify-center p-4`}>
                <Skeleton className="h-full w-full" />
            </div>
        </div>
    );
}

export function ContactCenterDashboardContent() {
    const { t } = useTranslation('supervision');
    const { connectionState, lastUpdated, isRefreshing, refresh } =
        useDashboardData();

    return (
        <div className="flex w-full flex-col gap-[var(--flex-space-section)]">
            <FlexLiveDataStatus
                connectionState={connectionState}
                lastUpdated={lastUpdated}
                isRefreshing={isRefreshing}
                onRefresh={refresh}
                title={t('dashboard.titleShort')}
                description={t('dashboard.descriptionShort')}
            />

            <OperationalException />

            <OperationsSummary />

            <Suspense fallback={<CardSkeleton bodyClassName="aspect-[3/1]" />}>
                <ContactCenterTrafficChart />
            </Suspense>

            <div className="grid grid-cols-1 gap-[var(--flex-space-section)] lg:grid-cols-2">
                <Suspense fallback={<CardSkeleton bodyClassName="h-56" />}>
                    <QueueHealth />
                </Suspense>
                <Suspense fallback={<CardSkeleton bodyClassName="h-56" />}>
                    <ActiveCalls />
                </Suspense>
            </div>

            <Suspense fallback={<CardSkeleton bodyClassName="h-96" />}>
                <AgentWallboard />
            </Suspense>
        </div>
    );
}
