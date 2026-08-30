import { Head, Link, usePage } from '@inertiajs/react';
import { RiArrowLeftLine } from '@remixicon/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import { FlexIcon } from '@/components/flex/iconography';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MODULE_INDEX } from '@/domain/modules';
import { AdminShell } from '@/layouts/admin-shell';

export default function ModulePlaceholderPage() {
    const { t } = useTranslation('administration');
    const { url } = usePage();
    const { has } = useCapabilities();

    const module = MODULE_INDEX[url];
    const isSettings = url.startsWith('/admin/settings');
    const backHref = isSettings ? '/admin/settings' : '/admin/console';

    const accessible = !module?.capability || has(module.capability);

    const moduleTitle = module ? t(module.titleKey) : t('placeholder.fallbackTitle');
    const moduleDescription = module ? t(module.descriptionKey) : t('placeholder.fallbackDescription');

    return (
        <AdminShell title={moduleTitle} subtitle={moduleDescription}>
            <Head title={t('placeholder.headTitle', { title: moduleTitle })} />

            <div className="flex flex-col gap-4 w-full">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1.5 text-xs text-muted-foreground w-fit"
                    render={<Link href={backHref} />}
                >
                    <RiArrowLeftLine className="size-3.5" />
                    {isSettings ? t('placeholder.backToSettings') : t('placeholder.backToConsole')}
                </Button>

                <Card className="bg-card border-border shadow-2xs">
                    <CardContent className="p-8 flex flex-col items-center justify-center gap-4 text-center">
                        {accessible && module ? (
                            <>
                                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                    <FlexIcon name={module.icon} className="size-8" />
                                </div>
                                <div className="flex flex-col gap-1 max-w-md">
                                    <h2 className="text-base font-semibold text-foreground">{t('placeholder.comingSoon')}</h2>
                                    <p className="text-xs text-muted-foreground">
                                        {t('placeholder.comingSoonDescription', { title: moduleTitle })}
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
                                        {module ? t('placeholder.notAccessible') : t('placeholder.moduleNotFound')}
                                    </h2>
                                    <p className="text-xs text-muted-foreground">
                                        {module
                                            ? t('placeholder.noPermission', { title: moduleTitle })
                                            : t('placeholder.notFoundDescription')}
                                    </p>
                                </div>
                            </>
                        )}

                        <Button variant="outline" size="sm" className="gap-1.5 text-xs" render={<Link href={backHref} />}>
                            {isSettings ? t('placeholder.returnToSettings') : t('placeholder.returnToConsole')}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AdminShell>
    );
}
