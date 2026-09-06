import { Link, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import type { Capability } from '@/auth/capabilities';
import { deriveActiveDomain, FLEX_DOMAINS, isActiveRoute } from '@/auth/nav-domains';
import type { FlexIconName } from '@/components/flex/iconography';
import { FlexIcon } from '@/components/flex/iconography';
import { useSidebar } from '@/components/ui/sidebar';

export interface ContextSidebarItem {
    title: string;
    href: string;
    icon?: FlexIconName | React.ComponentType<{ className?: string }>;
    badge?: string | number;
    capability?: Capability;
}

export interface ContextSidebarGroup {
    groupTitle?: string;
    items: ContextSidebarItem[];
}

/**
 * Contextual route navigation for the active FLEX domain. The domain tree owns
 * all labels, groups, routes, icons, and capability checks; this component only
 * renders that truth as the persistent desktop sidebar.
 */
export function ContextSidebar() {
    const { url } = usePage();
    const { has } = useCapabilities();
    const { state } = useSidebar();
    const { t } = useTranslation('navigation');
    const activeDomain = useMemo(
        () => FLEX_DOMAINS.find((domain) => domain.id === deriveActiveDomain(url)) ?? null,
        [url],
    );

    const title = activeDomain ? t(activeDomain.labelKey) : '';
    const groups = useMemo<ContextSidebarGroup[]>(
        () => activeDomain?.groups.map((group) => ({
            groupTitle: group.groupTitleKey ? t(group.groupTitleKey) : group.groupTitle,
            items: group.items,
        })) ?? [],
        [activeDomain, t],
    );

    const filteredGroups = useMemo(
        () =>
            groups
                .map((group) => ({
                    ...group,
                    items: group.items.filter((item) => !item.capability || has(item.capability)),
                }))
                .filter((group) => group.items.length > 0),
        [groups, has]
    );

    if (!activeDomain || state === 'collapsed') {
        return null;
    }

    return (
        <aside data-flex-context-sidebar className="w-[250px] bg-flex-workspace-surface border-r border-flex-workspace-divider h-screen sticky top-0 shrink-0 overflow-y-auto hidden md:flex flex-col py-4 px-3 select-none">
            <div className="mb-3 px-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                    <h2 className="text-[13px] font-semibold tracking-tight text-flex-text-primary">{title}</h2>
                </div>
            </div>

            <nav className="flex flex-col gap-4" aria-label={title}>
                {filteredGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="flex flex-col gap-1">
                        {group.groupTitle && (
                            <h3 className="px-2 text-[12px] font-medium text-flex-text-tertiary mb-1">
                                {group.groupTitle}
                            </h3>
                        )}
                        {group.items.map((item) => {
                            const isActive = isActiveRoute(url, item.href);
                            const Icon = item.icon;

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center justify-between px-2.5 h-8 rounded-md text-[13px] font-medium transition-colors duration-[var(--flex-duration-fast)] flex-focus-visible ${
                                        isActive
                                            ? 'bg-flex-layer-selected text-flex-text-primary'
                                            : 'text-flex-text-tertiary hover:text-flex-text-primary hover:bg-flex-layer-hover border border-transparent'
                                    }`}
                                >
                                    <div className="flex items-center gap-2 truncate">
                                        {typeof Icon === 'string' ? (
                                            <FlexIcon name={Icon} size="md" className="shrink-0" />
                                        ) : (
                                            Icon && <Icon className="size-4 shrink-0" />
                                        )}
                                        <span className="truncate">{item.title}</span>
                                    </div>
                                    {item.badge !== undefined && (
                                        <span className="ml-2 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-muted text-muted-foreground">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                ))}

                {filteredGroups.length === 0 && (
                    <p className="px-2 py-4 text-xs text-muted-foreground">
                        {`No accessible ${title.toLowerCase()} options for your role.`}
                    </p>
                )}
            </nav>
        </aside>
    );
}
