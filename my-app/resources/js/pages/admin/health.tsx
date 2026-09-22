import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { FlexStatus } from '@/components/flex/flex-status';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';

export default function HealthPage() {
    const { t } = useTranslation('administration');
    const { connection } = useWorkspaceState();
    const items = [
        { name: 'Telephony', state: connection === 'live' ? 'Operational' : 'Reconnecting' },
        { name: 'Dashboard realtime', state: 'Operational' },
        { name: 'Agent Assist', state: 'Operational' },
    ];

    return (
        <>
            <Head title={t('health.headTitle')} />
            <FlexPageContent className="flex flex-col gap-[var(--flex-space-section)]">
                <FlexPageHeader title={t('health.title')} description={t('health.description')} />
                <section className="border-y border-flex-workspace-divider">
                    <ul className="divide-y divide-flex-workspace-divider">
                        {items.map((i) => (
                            <li key={i.name} className="flex items-center justify-between gap-4 py-3 text-sm">
                                <span className="font-medium text-foreground">{i.name}</span>
                                <FlexStatus tone={i.state === 'Operational' ? 'success' : 'warning'}>{i.state}</FlexStatus>
                            </li>
                        ))}
                    </ul>
                </section>
            </FlexPageContent>
        </>
    );
}
