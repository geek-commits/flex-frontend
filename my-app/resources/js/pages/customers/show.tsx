import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { resolveCustomerTimeline } from '@/features/customer-360/customer-360-repository';
import AppLayout from '@/layouts/app-layout';

export default function Customer360Page() {
    const { t, i18n } = useTranslation('common');
    const { props } = usePage<{ customer: string }>();
    const raw = (props.customer as unknown) ?? '';
    // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
    const customerId = decodeURIComponent(raw);
    const { displayName, phone, items } = resolveCustomerTimeline(customerId);

    const filtered = items;

    return (
        <AppLayout
            breadcrumbs={[
                // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                { title: t('customers.breadcrumb'), href: '/customers' },
                { title: displayName, href: `/customers/${encodeURIComponent(customerId)}` },
            ]}
        >
            <Head
                title={
                    // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                    t('customers.customer360Title', { name: displayName })
                }
            />
            <FlexPageHeader
                title={displayName}
                description={phone}
                actions={
                    <div className="flex gap-2">
                        <Link href="/agent" className="inline-flex h-8 items-center rounded-md border px-3 text-sm">
                            {
                                // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                t('customers.openWorkspace')
                            }
                        </Link>
                    </div>
                }
            />
            <FlexPageContent>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium">
                                {
                                    // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                    t('customers.customerId')
                                }
                            </span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{customerId}</code>
                            <Badge variant="outline" className="ml-auto capitalize">
                                {
                                    // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                    t('customers.events', { count: filtered.length })
                                }
                            </Badge>
                        </div>
                        <div className="flex gap-1 mb-4">
                            <Badge variant="secondary" className="text-xs">
                                {
                                    // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                    t('customers.allActivity')
                                }
                            </Badge>
                        </div>
                        {filtered.length === 0 ? (
                            <FlexEmptyState
                                // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                title={t('customers.noActivityTitle')}
                                // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                description={t('customers.noActivityDescription')}
                            />
                        ) : (
                            <ol className="relative border-s border-border ms-2 space-y-4">
                                {filtered.map((item) => (
                                    <li key={item.id} className="ms-6">
                                        <span className="absolute flex size-2.5 bg-primary rounded-full -start-1.5 mt-1.5" />
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="capitalize text-[10px]">
                                                {item.type}
                                            </Badge>
                                            <time className="text-xs text-muted-foreground">
                                                {new Intl.DateTimeFormat(i18n.language, {
                                                    dateStyle: 'medium',
                                                    timeStyle: 'short',
                                                }).format(new Date(item.occurredAt))}
                                            </time>
                                        </div>
                                        <p className="text-sm font-medium mt-1">{item.title}</p>
                                        {item.summary && (
                                            <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>
                                        )}
                                        {item.route && (
                                            <Link
                                                href={item.route}
                                                className="text-xs text-primary hover:underline mt-1 inline-block"
                                            >
                                                {item.type === 'call'
                                                    // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                                    ? t('customers.openCdr')
                                                    : item.type === 'social'
                                                      // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                                      ? t('customers.openConversation')
                                                      // @ts-expect-error — customers.* interim until common keys fully typed (Batch 10)
                                                      : t('customers.openRecovery')}{' '}
                                                →
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        )}
                    </CardContent>
                </Card>
            </FlexPageContent>
        </AppLayout>
    );
}