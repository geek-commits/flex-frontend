import { usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import { FLEX_DOMAINS, deriveActiveDomain } from '@/auth/nav-domains';
import type { FlexIconName } from '@/components/flex/iconography';
import { FlexIcon } from '@/components/flex/iconography';
import { useSidebar } from '@/components/ui/sidebar';
import { FileTree } from '@/components/unlumen-ui/file-tree';
import type { FileTreeElement } from '@/components/unlumen-ui/file-tree';

function navigationIcon(name: FlexIconName) {
    return function NavigationIcon({ className }: { className?: string }) {
        return <FlexIcon name={name} className={className} />;
    };
}

export function FlexNavigationFileTree() {
    const { url } = usePage();
    const { has } = useCapabilities();
    const { t } = useTranslation('navigation');
    const { state } = useSidebar();
    const activeDomain = deriveActiveDomain(url);

    const elements = useMemo<FileTreeElement[]>(() => {
        return FLEX_DOMAINS.filter((domain) => has(domain.capability)).flatMap((domain) => {
            const groups = domain.groups
                .map((group, groupIndex) => {
                    const items = group.items.filter((item) => !item.capability || has(item.capability));

                    if (items.length === 0) {
                        return null;
                    }

                    const children = items.map((item) => ({
                        id: `${domain.id}:${item.href}`,
                        name: t(item.titleKey),
                        href: item.href,
                        icon: navigationIcon(item.icon),
                    }));
                    const title = group.groupTitleKey ? t(group.groupTitleKey) : group.groupTitle;

                    return title
                        ? { id: `${domain.id}:group:${groupIndex}`, name: title, type: 'folder' as const, children, defaultOpen: true }
                        : children;
                })
                .filter(Boolean)
                .flat();

            return [{
                id: `domain:${domain.id}`,
                name: t(domain.labelKey),
                type: 'folder' as const,
                defaultOpen: activeDomain === domain.id,
                icon: navigationIcon(domain.icon),
                children: groups as FileTreeElement[],
            }];
        });
    }, [activeDomain, has, t]);

    if (state === 'collapsed') {
        return (
            <nav aria-label={t('aria.productDomains')} className="flex flex-col items-center gap-2 px-2 py-4">
                {FLEX_DOMAINS.filter((domain) => has(domain.capability)).map((domain) => {
                    const active = activeDomain === domain.id;

                    return (
                        <a
                            key={domain.id}
                            href={domain.landingHref}
                            aria-label={t(domain.labelKey)}
                            title={t(domain.labelKey)}
                            className={`flex size-10 items-center justify-center rounded-lg transition-colors ${active ? 'bg-sidebar-accent text-sidebar-accent-foreground' : 'text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'}`}
                        >
                            <FlexIcon name={domain.icon} size="md" />
                        </a>
                    );
                })}
            </nav>
        );
    }

    return <FileTree elements={elements} showIcons defaultOpenIds={activeDomain ? [`domain:${activeDomain}`] : []} className="px-3 py-4" />;
}
