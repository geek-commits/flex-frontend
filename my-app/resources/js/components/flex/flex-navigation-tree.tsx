import { hotkeysCoreFeature, syncDataLoaderFeature } from '@headless-tree/core';
import { useTree } from '@headless-tree/react';
import { Link, usePage } from '@inertiajs/react';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCapabilities } from '@/auth/capabilities';
import { FLEX_DOMAINS, deriveActiveDomain, isActiveRoute } from '@/auth/nav-domains';
import type { FlexDomain } from '@/auth/nav-domains';
import { FlexBrandLogo } from '@/components/flex/brand';
import { FlexIcon } from '@/components/flex/iconography';
import type { FlexIconName } from '@/components/flex/iconography';
import { Tree, TreeItem, TreeItemLabel } from '@/components/reui/tree';
import { useSidebar } from '@/components/ui/sidebar';
import { Sidebar001Content, Sidebar001Header, Sidebar001Separator } from '@/components/unlumen-ui/sidebar-001';
import { cn } from '@/lib/utils';

type NavigationNode = {
    label: string;
    kind: 'root' | 'domain' | 'group' | 'route';
    icon?: FlexIconName;
    href?: string;
    active?: boolean;
    children?: string[];
};

const ROOT_ID = 'flex-navigation';
const STORAGE_KEY = 'flex.navigation.tree.expanded';

function readExpandedState(): string[] {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');

        return Array.isArray(stored) ? stored.filter((item): item is string => typeof item === 'string') : [];
    } catch {
        return [];
    }
}

function addGroupNodes(domain: FlexDomain, url: string, nodes: Record<string, NavigationNode>, children: string[]) {
    domain.groups.forEach((group, groupIndex) => {
        const visibleItems = group.items;

        if (visibleItems.length === 0) {
return;
}

        if (!group.groupTitleKey && !group.groupTitle) {
            visibleItems.forEach((item) => {
                const id = `${domain.id}:route:${item.href}`;
                nodes[id] = {
                    label: item.title,
                    kind: 'route',
                    icon: item.icon,
                    href: item.href,
                    active: isActiveRoute(url, item.href),
                };
                children.push(id);
            });

            return;
        }

        const groupId = `${domain.id}:group:${groupIndex}`;
        const groupChildren = visibleItems.map((item) => {
            const id = `${domain.id}:route:${item.href}`;
            nodes[id] = {
                label: item.title,
                kind: 'route',
                icon: item.icon,
                href: item.href,
                active: isActiveRoute(url, item.href),
            };

            return id;
        });
        nodes[groupId] = {
            label: group.groupTitle ?? group.groupTitleKey ?? '',
            kind: 'group',
            children: groupChildren,
        };
        children.push(groupId);
    });
}

export function FlexNavigationTree() {
    const { url } = usePage();
    const { has } = useCapabilities();
    const { t } = useTranslation('navigation');
    const { isMobile, setOpenMobile } = useSidebar();
    const activeDomain = deriveActiveDomain(url);

    const { nodes, activeBranch } = useMemo(() => {
        const nextNodes: Record<string, NavigationNode> = {
            [ROOT_ID]: { label: t('aria.productDomains'), kind: 'root', children: [] },
        };
        const branch: string[] = [ROOT_ID];
        const visibleDomains = FLEX_DOMAINS.filter((domain) => has(domain.capability));

        visibleDomains.forEach((domain) => {
            const domainChildren: string[] = [];
            addGroupNodes(
                {
                    ...domain,
                    groups: domain.groups.map((group) => ({
                        ...group,
                        items: group.items.filter((item) => !item.capability || has(item.capability)),
                    })).filter((group) => group.items.length > 0),
                },
                url,
                nextNodes,
                domainChildren,
            );

            if (domainChildren.length === 0) {
return;
}

            const domainId = `domain:${domain.id}`;
            nextNodes[domainId] = {
                label: t(domain.labelKey),
                kind: 'domain',
                icon: domain.icon,
                children: domainChildren,
            };
            nextNodes[ROOT_ID].children?.push(domainId);

            if (activeDomain === domain.id) {
                branch.push(domainId);
                domainChildren.forEach((childId) => {
                    const child = nextNodes[childId];

                    if (child?.kind === 'group' && child.children?.some((routeId) => nextNodes[routeId]?.active)) {
                        branch.push(childId);
                    }
                });
            }
        });

        return { nodes: nextNodes, activeBranch: branch };
    }, [activeDomain, has, t, url]);

    const [initialExpandedItems] = useState<string[]>(() => {
        const stored = readExpandedState();
        const allowed = new Set(Object.keys(nodes));
        const persistedActive = stored.filter((id) => allowed.has(id) && (id === ROOT_ID || id.startsWith(`domain:${activeDomain}`)));

        return Array.from(new Set([...activeBranch, ...persistedActive]));
    });
    const [treeReady, setTreeReady] = useState(false);

    const tree = useTree<NavigationNode>({
        initialState: { expandedItems: initialExpandedItems },
        rootItemId: ROOT_ID,
        indent: 18,
        getItemName: (item) => item.getItemData().label,
        isItemFolder: (item) => (item.getItemData().children?.length ?? 0) > 0,
        dataLoader: {
            getItem: (itemId) => nodes[itemId],
            getChildren: (itemId) => nodes[itemId]?.children ?? [],
        },
        features: [syncDataLoaderFeature, hotkeysCoreFeature],
    });

    useEffect(() => {
        const frame = window.requestAnimationFrame(() => setTreeReady(true));

        activeBranch.forEach((id) => {
            const item = tree.getItemInstance(id);

            if (item && !item.isExpanded()) {
item.expand();
}
        });

        if (isMobile) {
            setOpenMobile(false);
        }

        return () => window.cancelAnimationFrame(frame);
    }, [activeBranch, isMobile, setOpenMobile, tree, url]);

    if (!treeReady) {
        return <Sidebar001Header><FlexBrandLogo variant="sidebar" decorative /></Sidebar001Header>;
    }

    return (
        <>
            <Sidebar001Header className="gap-3">
                <FlexBrandLogo variant="sidebar" decorative />
            </Sidebar001Header>
            <Sidebar001Separator className="mx-3" />
            <Sidebar001Content className="px-2 py-3">
                <Tree
                    tree={tree}
                    indent={18}
                    toggleIconType="chevron"
                    className="gap-0.5"
                >
                    {tree.getItems().map((item) => {
                        const data = item.getItemData();

                        if (data.kind === 'root') {
                            return (
                                <TreeItem key={item.getId()} item={item} className="sr-only">
                                    <TreeItemLabel item={item}>{data.label}</TreeItemLabel>
                                </TreeItem>
                            );
                        }

                        const label = (
                            <TreeItemLabel
                                item={item}
                                title={data.label}
                                onClick={() => {
                                    window.setTimeout(() => {
                                        localStorage.setItem(STORAGE_KEY, JSON.stringify(tree.getState().expandedItems ?? []));
                                    }, 0);
                                }}
                                className={cn(
                                    'min-h-9 rounded-md px-2.5 py-2 text-[13px] text-sidebar-foreground/75 not-in-data-[folder=true]:ps-1',
                                    data.active && 'bg-sidebar-accent font-medium text-sidebar-accent-foreground',
                                )}
                            >
                                {data.icon && <FlexIcon name={data.icon} size="sm" className="shrink-0 text-sidebar-foreground/55" />}
                                <span className="min-w-0 flex-1 truncate">{data.label}</span>
                            </TreeItemLabel>
                        );

                        if (data.kind === 'route' && data.href) {
                            return (
                                <TreeItem
                                    key={item.getId()}
                                    item={item}
                                    render={
                                        <Link
                                            href={data.href}
                                            aria-current={data.active ? 'page' : undefined}
                                            onClick={() => isMobile && setOpenMobile(false)}
                                        />
                                    }
                                >
                                    {label}
                                </TreeItem>
                            );
                        }

                        return (
                            <TreeItem key={item.getId()} item={item}>
                                {label}
                            </TreeItem>
                        );
                    })}
                </Tree>
            </Sidebar001Content>
        </>
    );
}
