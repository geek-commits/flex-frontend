import { Head, Link } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { Card, CardContent } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';

export default function ExceptionsPage() {
    const { t } = useTranslation('supervision');
    // Deterministic placeholder — exceptions derived from real metrics when thresholds exist (§66)
    const exceptions: { id: string; title: string; detail: string; href: string }[] = [];

    return (
        <AppLayout breadcrumbs={[{ title: t('exceptions.breadcrumb'), href: '/supervision/exceptions' }]}>
            <Head title={t('exceptions.headTitle')} />
            <FlexPageHeader title={t('exceptions.title')} description={t('exceptions.description')} />
            <FlexPageContent>
                <Card>
                    <CardContent className="pt-6">
                        {exceptions.length === 0 ? (
                            <FlexEmptyState title={t('exceptions.empty.title')} description={t('exceptions.empty.description')} />
                        ) : (
                            <ul>
                                {exceptions.map((e) => (
                                    <li key={e.id}>
                                        <Link href={e.href}>{e.title}</Link> — {e.detail}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </FlexPageContent>
        </AppLayout>
    );
}
