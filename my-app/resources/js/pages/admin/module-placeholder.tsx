import { Head, Link, usePage } from '@inertiajs/react';
import { RiArrowLeftLine } from '@remixicon/react';
import React from 'react';
import { useCapabilities } from '@/auth/capabilities';
import { FlexIcon } from '@/components/flex/iconography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MODULE_INDEX } from '@/domain/modules';
import { AdminShell } from '@/layouts/admin-shell';

export default function ModulePlaceholderPage() {
    const { url } = usePage();
    const { has } = useCapabilities();

    const module = MODULE_INDEX[url];
    const isSettings = url.startsWith('/admin/settings');
    const backHref = isSettings ? '/admin/settings' : '/admin/console';

    const accessible = !module?.capability || has(module.capability);

    return (
        <AdminShell
            title={module?.title ?? 'Module'}
            subtitle={module?.description ?? 'This module is not part of the current POC.'}
        >
            <Head title={`${module?.title ?? 'Module'} — Flex Contact Center`} />

            <div className="flex flex-col gap-4 w-full">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs text-muted-foreground w-fit"
                    render={<Link href={backHref} />}
                >
                    <RiArrowLeftLine className="size-3.5" />
                    Back to {isSettings ? 'Settings' : 'Management Console'}
                </Button>

                <Card className="bg-card border-border shadow-2xs">
                    <CardContent className="p-8 flex flex-col items-center justify-center gap-4 text-center">
                        {accessible && module ? (
                            <>
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <FlexIcon name={module.icon} className="size-8" />
                                </div>
                                <div className="flex flex-col gap-1 max-w-md">
                                    <h2 className="text-base font-semibold text-foreground">Coming soon</h2>
                                    <p className="text-xs text-muted-foreground">
                                        The <span className="font-semibold text-foreground">{module.title}</span> module
                                        is planned but not yet implemented in this POC. Existing contact-center
                                        functionality is unaffected.
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="p-3 rounded-lg bg-muted text-muted-foreground">
                                    <FlexIcon name="module-placeholder" size="xl" />
                                </div>
                                <div className="flex flex-col gap-1 max-w-md">
                                    <h2 className="text-base font-semibold text-foreground">
                                        {module ? 'Not accessible' : 'Module not found'}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {module
                                            ? `You don't have permission to access ${module.title}.`
                                            : 'The requested module does not exist or its address changed.'}
                                    </p>
                                </div>
                            </>
                        )}

                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" render={<Link href={backHref} />}>
                            Return to {isSettings ? 'Settings' : 'Management Console'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
