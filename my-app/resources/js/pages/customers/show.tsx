import { Head, Link, usePage } from '@inertiajs/react';
import { FlexEmptyState } from '@/components/flex/flex-empty-state';
import { FlexPageContent } from '@/components/flex/flex-page-content';
import { FlexPageHeader } from '@/components/flex/flex-page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { resolveCustomerTimeline } from '@/features/customer-360/customer-360-repository';
import AppLayout from '@/layouts/app-layout';

export default function Customer360Page() {
    const { props } = usePage<{ customer: string }>();
    const raw = (props.customer as unknown as string) ?? '';
    const customerId = decodeURIComponent(raw);
    const { displayName, phone, items } = resolveCustomerTimeline(customerId);

    const filtered = items;

    return (
        <AppLayout breadcrumbs={[{ title: 'Customers', href: '/customers' }, { title: displayName, href: `/customers/${encodeURIComponent(customerId)}` }]}>
            <Head title={`${displayName} — Customer 360`} />
            <FlexPageHeader title={displayName} description={phone} actions={
                <div className="flex gap-2">
                    <Link href="/agent" className="inline-flex h-8 items-center rounded-md border px-3 text-sm">Open Workspace</Link>
                </div>
            } />
            <FlexPageContent>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-sm font-medium">Customer ID</span>
                            <code className="text-xs bg-muted px-2 py-1 rounded">{customerId}</code>
                            <Badge variant="outline" className="ml-auto capitalize">{filtered.length} events</Badge>
                        </div>
                        <div className="flex gap-1 mb-4">
                            <Badge variant="secondary" className="text-xs">All activity</Badge>
                        </div>
                        {filtered.length === 0 ? (
                            <FlexEmptyState title="No activity yet" description="This customer has no linked calls, conversations, or callbacks in the current dataset." />
                        ) : (
                            <ol className="relative border-s border-border ms-2 space-y-4">
                                {filtered.map((item) => (
                                    <li key={item.id} className="ms-6">
                                        <span className="absolute flex size-2.5 bg-primary rounded-full -start-1.5 mt-1.5" />
                                        <div className="flex items-center gap-2">
                                            <Badge variant="secondary" className="capitalize text-[10px]">{item.type}</Badge>
                                            <time className="text-xs text-muted-foreground">{new Date(item.occurredAt).toLocaleString()}</time>
                                        </div>
                                        <p className="text-sm font-medium mt-1">{item.title}</p>
                                        {item.summary && <p className="text-xs text-muted-foreground line-clamp-2">{item.summary}</p>}
                                        {item.route && (
                                            <Link href={item.route} className="text-xs text-primary hover:underline mt-1 inline-block">
                                                Open {item.type === 'call' ? 'CDR' : item.type === 'social' ? 'Conversation' : 'Recovery'} →
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
