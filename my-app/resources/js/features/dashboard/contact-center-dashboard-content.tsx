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
    import('@/features/dashboard/queue-health').then((m) => ({
        default: m.QueueHealth,
    })),
);
const ActiveCalls = lazy(() =>
    import('@/features/dashboard/active-calls').then((m) => ({
        default: m.ActiveCalls,
    })),
);
const AgentWallboard = lazy(() =>
    import('@/features/dashboard/agent-wallboard').then((m) => ({
        default: m.AgentWallboard,
    })),
);

function CardSkeleton({ bodyClassName }: { bodyClassName: string }) {
    return (
        <div className="overflow-hidden rounded-lg border border-flex-workspace-divider bg-flex-workspace-surface">
            <div className="flex items-center justify-between border-b border-flex-workspace-divider px-4 py-3">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-20" />
            </div>
            <div
                className={`${bodyClassName} flex items-center justify-center p-4`}
            >
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
        <div className="flex w-full min-w-0 flex-col gap-[var(--flex-space-section)]">
            <section
                aria-label={t('dashboard.titleShort')}
                className="overflow-hidden rounded-md border border-flex-workspace-divider bg-flex-workspace-surface-muted"
            >
                <div className="border-b border-flex-workspace-divider px-4 py-2.5">
                    <OperationalException />
                </div>
                <div className="px-4 py-3">
                    <FlexLiveDataStatus
                        connectionState={connectionState}
                        lastUpdated={lastUpdated}
                        isRefreshing={isRefreshing}
                        onRefresh={refresh}
                        title={t('dashboard.titleShort')}
                        description={t('dashboard.descriptionShort')}
                    />
                </div>
            </section>

            <OperationsSummary />

            <Suspense
                fallback={
                    <CardSkeleton bodyClassName="min-h-64 sm:aspect-[3/1] sm:min-h-0" />
                }
            >
                <ContactCenterTrafficChart />
            </Suspense>

            <div className="grid min-w-0 grid-cols-1 gap-[var(--flex-space-section)] lg:grid-cols-2">
                <Suspense fallback={<CardSkeleton bodyClassName="h-56" />}>
                    <div className="min-w-0">
                        <QueueHealth />
                    </div>
                </Suspense>
                <Suspense fallback={<CardSkeleton bodyClassName="h-56" />}>
                    <div className="min-w-0">
                        <ActiveCalls />
                    </div>
                </Suspense>
            </div>

            <Suspense fallback={<CardSkeleton bodyClassName="h-96" />}>
                <AgentWallboard />
            </Suspense>
        </div>
    );
}
