import { Head } from '@inertiajs/react';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { Card, CardContent } from '@/components/ui/card';
import { useWorkspaceState } from '@/features/agent-workspace/state/use-workspace-state';
import AppLayout from '@/layouts/app-layout';

export default function HealthPage() {
    const { connection } = useWorkspaceState();
    const items = [
        { name: 'Telephony', state: connection === 'live' ? 'Operational' : 'Reconnecting' },
        { name: 'Dashboard realtime', state: 'Operational' },
        { name: 'Agent Assist', state: 'Operational' },
    ];
    return (
        <AppLayout breadcrumbs={[{ title: 'Health', href: '/admin/health' }]}>
            <Head title="Operational Health — Flex" />
            <FlexPageHeader title="Operational Health" description="Real service status for authorized diagnostics." />
            <FlexPageContent>
                <Card><CardContent className="pt-6"><ul className="space-y-2">{items.map((i) => (<li key={i.name} className="flex justify-between text-sm"><span>{i.name}</span><span className="font-medium">{i.state}</span></li>))}</ul></CardContent></Card>
            </FlexPageContent>
        </AppLayout>
    );
}
