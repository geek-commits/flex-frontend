import { Head } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import AppLayout from '@/layouts/app-layout';

export default function HealthPage() {
    const { t } = useTranslation('administration');
    const { connection } = useWorkspaceState();
    const items = [
        { name: 'Telephony', state: connection === 'live' ? 'Operational' : 'Reconnecting' },
        { name: 'Dashboard realtime', state: 'Operational' },
        { name: 'Agent Assist', state: 'Operational' },
    ];
    return (
        <AppLayout breadcrumbs={[{ title: t('health.title'), href: '/admin/health' }]}>
            <Head title={t('health.headTitle')} />
            <FlexPageHeader title={t('health.title')} description={t('health.description')} />
            <FlexPageContent>
                <Card><CardContent className="pt-6"><ul className="space-y-2">{items.map((i) => (<li key={i.name} className="flex justify-between text-sm"><span>{i.name}</span><span className="font-medium">{i.state}</span></li>))}</ul></CardContent></Card>
            </FlexPageContent>
        </AppLayout>
    );
}
