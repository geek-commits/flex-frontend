import { Head, Link } from '@inertiajs/react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

export default function ExceptionsPage() {
    // Deterministic placeholder — exceptions derived from real metrics when thresholds exist (§66)
    const exceptions: { id: string; title: string; detail: string; href: string }[] = [];

    return (
        <AppLayout breadcrumbs={[{ title: 'Exceptions', href: '/supervision/exceptions' }]}>
            <Head title="Exceptions — Flex" />
            <FlexPageHeader title="Exception Center" description="Problems requiring attention — derived from existing operational metrics." />
            <FlexPageContent>
                <Card>
                    <CardContent className="pt-6">
                        {exceptions.length === 0 ? (
                            <FlexEmptyState title="No exceptions" description="No threshold-backed exceptions are active. When SLA, queue backlog, or campaign failures breach authoritative thresholds, they appear here." />
                        ) : (
                            <ul>{exceptions.map((e) => (
                                <li key={e.id}><Link href={e.href}>{e.title}</Link> — {e.detail}</li>
                            ))}</ul>
                        )}
                    </CardContent>
                </Card>
            </FlexPageContent>
        </AppLayout>
    );
}
