import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { FlexIcon } from '@/components/flex/iconography';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: Array<{ titleKey: string; href: NavItem['href']; icon: NavItem['icon'] }> = [
    {
        titleKey: 'settings.navigation.profile',
        href: edit(),
        icon: null,
    },
    {
        titleKey: 'settings.navigation.security',
        href: editSecurity(),
        icon: null,
    },
    {
        titleKey: 'settings.navigation.appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();
    const { t } = useTranslation('common');

    return (
        <div className="px-4 py-6">
            <Heading
                title={t('settings.title')}
                description={t('settings.description')}
            />

            <div className="flex flex-col lg:flex-row lg:space-x-12">
                <aside className="w-full max-w-xl lg:w-48">
                    <nav
                        className="flex flex-col space-y-1 space-x-0"
                        aria-label={t('settings.ariaLabel')}
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Button
                                key={`${toUrl(item.href)}-${index}`}
                                size="sm"
                                variant="ghost"
                                render={<Link href={item.href} />}
                                className={cn('w-full justify-start', {
                                    'bg-primary/10 text-primary font-semibold': isCurrentOrParentUrl(item.href),
                                })}
                            >
                                {typeof item.icon === 'string' ? (
                                    <FlexIcon name={item.icon} className="h-4 w-4" />
                                ) : (
                                    item.icon && <item.icon className="h-4 w-4" />
                                )}
                                {t(item.titleKey)}
                            </Button>
                        ))}
                    </nav>
                </aside>

                <Separator className="my-6 lg:hidden" />

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">
                        {children}
                    </section>
                </div>
            </div>
        </div>
    );
}
