import { router } from '@inertiajs/react';
import {
    RiSearchLine,
    RiAppsLine,

} from '@remixicon/react';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { NAVIGATION, useCapabilities  } from '@/auth/capabilities';
import type { Role } from '@/auth/capabilities';
import { FlexIcon } from '@/components/flex/iconography';
import type { FlexIconName } from '@/components/flex/iconography';
import { SearchHighlight } from '@/components/flex/search-highlight';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import { AGENT_MOCK_ROSTER } from '@/data/agents.mock';
import { CAMPAIGN_MOCK_RECORDS } from '@/data/campaigns.mock';
import { CDR_MOCK_RECORDS } from '@/data/cdr.mock';
import { CONSOLE_MODULES } from '@/domain/modules';
import { filterModulesByPermission, filterModulesByQuery } from '@/features/management-console/use-visible-modules';

interface GlobalSearchContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const GlobalSearchContext = createContext<GlobalSearchContextValue | null>(null);

interface SearchRecord {
    kind: 'navigation' | 'action' | 'record';
    title: string;
    subtitle?: string;
    href: string;
    group: string;
    icon: FlexIconName | React.ComponentType<{ className?: string }>;
}

const ROLE_OPTIONS: { value: Role; label: string }[] = [
    { value: 'super-admin', label: 'SuperAdmin' },
    { value: 'admin', label: 'Admin' },
    { value: 'agent', label: 'Agent' },
];

function matches(text: string, query: string) {
    return text.toLocaleLowerCase().includes(query.toLocaleLowerCase());
}

function buildRecordIndex(): Omit<SearchRecord, 'group'>[] {
    const records: Omit<SearchRecord, 'group'>[] = [];

    for (const cdr of CDR_MOCK_RECORDS) {
        records.push({
            kind: 'record',
            title: cdr.customerPhone,
            subtitle: `CDR • ${cdr.agentName} • ${cdr.queueName}`,
            href: '/admin/cdr',
            icon: 'call-records',
        });
    }

    for (const campaign of CAMPAIGN_MOCK_RECORDS) {
        records.push({
            kind: 'record',
            title: campaign.title,
            subtitle: `Campaign • ${campaign.destination}`,
            href: '/admin/campaigns',
            icon: 'campaigns',
        });
    }

    for (const agent of AGENT_MOCK_ROSTER) {
        records.push({
            kind: 'record',
            title: agent.name,
            subtitle: `Agent • ext ${agent.extension} • ${agent.queue}`,
            href: '/agent',
            icon: 'agents',
        });
    }

    return records;
}

const ACTION_INDEX: Omit<SearchRecord, 'group'>[] = [
    { kind: 'action', title: 'New Campaign', subtitle: 'Create an outbound call campaign', href: '/admin/campaigns', icon: 'campaigns' },
    { kind: 'action', title: 'Manage Queues', subtitle: 'Queue strategies & SLA targets', href: '/admin/settings/queues', icon: 'routes' },
    { kind: 'action', title: 'View Reports', subtitle: 'Reports & analytics engine', href: '/admin/reports', icon: 'reports' },
];

export function GlobalSearchProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setOpen((current) => !current);
            }
        };
        window.addEventListener('keydown', onKeyDown);

        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const value = useMemo(() => ({ open, setOpen }), [open]);

    return (
        <GlobalSearchContext.Provider value={value}>
            {children}
            <GlobalSearchDialog open={open} onOpenChange={setOpen} />
        </GlobalSearchContext.Provider>
    );
}

export function useGlobalSearch(): GlobalSearchContextValue {
    const ctx = useContext(GlobalSearchContext);

    if (!ctx) {
throw new Error('useGlobalSearch must be used within a GlobalSearchProvider');
}

    return ctx;
}

function GlobalSearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const { has, role, setRole } = useCapabilities();
    const [query, setQuery] = useState('');

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            setQuery('');
        }

        onOpenChange(next);
    };

    const visibleNavigation = NAVIGATION.filter((entry) => has(entry.capability));
    const recordIndex = useMemo(() => buildRecordIndex(), []);
    const moduleIndex = useMemo(() => {
        const navigationHrefs = new Set(visibleNavigation.map((entry) => entry.href));

        return filterModulesByPermission(CONSOLE_MODULES, has).filter((module) => !navigationHrefs.has(module.href));
    }, [has, visibleNavigation]);
    const filteredModules = filterModulesByQuery(moduleIndex, query);

    const filteredRecords = recordIndex
        .filter((record) => {
            if (record.kind === 'navigation') {
return true;
}

            return query.trim().length > 0 && matches(record.title, query.trim());
        })
        .filter((record) => {
            if (record.kind !== 'record') {
return true;
}

            if (record.href.startsWith('/admin') && !has('cdr.view') && !has('campaigns.view')) {
return false;
}

            if (record.href === '/agent' && !has('agent.workspace')) {
return false;
}

            return true;
        })
        .slice(0, 8);

    const grouped = {
        navigation: visibleNavigation.map((entry) => ({
            ...entry,
            group: 'Navigation',
            kind: 'navigation' as const,
        })),
        modules: filteredModules.map((module) => ({
            kind: 'navigation' as const,
            title: module.title,
            subtitle: module.category,
            href: module.href,
            group: 'Modules',
            icon: module.icon,
        })),
        actions: ACTION_INDEX.filter((a) => {
            if (a.href.startsWith('/admin/campaigns') && !has('campaigns.view')) {
return false;
}

            if (a.href.startsWith('/admin/reports') && !has('reports.view')) {
return false;
}

            if (a.href.startsWith('/admin/settings') && !has('settings.manage')) {
return false;
}

            return true;
        }).map((a) => ({ ...a, group: 'Actions' })),
        records: filteredRecords.filter((r) => r.kind === 'record').map((r) => ({ ...r, group: 'Records' })),
    };

    const run = (href: string) => {
        onOpenChange(false);
        router.visit(href);
    };

    return (
        <CommandDialog open={open} onOpenChange={handleOpenChange} title="Search Flex" description="Search Flex modules, actions and records">
            <Command>
                <CommandInput placeholder="Search Flex..." value={query} onValueChange={setQuery} autoFocus />
                <CommandList>
                <CommandEmpty>No results found for &quot;{query}&quot;.</CommandEmpty>

                {grouped.navigation.length > 0 && (
                    <CommandGroup heading="Navigation">
                        {grouped.navigation.map((item) => {
                            return (
                                <CommandItem key={item.href} value={`nav ${item.title}`} onSelect={() => run(item.href)}>
                                    <FlexIcon name={item.icon} className="size-4 text-muted-foreground" />
                                    <SearchHighlight text={item.title} query={query} />
                                    <span className="text-[10px] text-muted-foreground uppercase">{item.badge ?? item.workspace}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                )}

                {grouped.modules.length > 0 && (
                    <CommandGroup heading="Modules">
                        {grouped.modules.map((item) => {
                            return (
                                <CommandItem key={item.href} value={`module ${item.title}`} onSelect={() => run(item.href)}>
                                    <FlexIcon name={item.icon} className="size-4 text-muted-foreground" />
                                    <SearchHighlight text={item.title} query={query} />
                                    <span className="text-[10px] text-muted-foreground uppercase">{item.subtitle}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                )}

                {grouped.actions.length > 0 && (
                    <CommandGroup heading="Actions">
                        {grouped.actions.map((item) => {
                            const Icon = item.icon;

                            return (
                                <CommandItem key={item.title} value={`action ${item.title}`} onSelect={() => run(item.href)}>
                                    {typeof Icon === 'string' ? <FlexIcon name={Icon} className="size-4 text-muted-foreground" /> : <Icon className="size-4 text-muted-foreground" />}
                                    <SearchHighlight text={item.title} query={query} />
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                )}

                {grouped.records.length > 0 && (
                    <CommandGroup heading="Records">
                        {grouped.records.map((record, index) => {
                            const Icon = record.icon;

                            return (
                                <CommandItem key={`record-${index}`} value={`record ${record.title} ${record.subtitle}`} onSelect={() => run(record.href)}>
                                    {typeof Icon === 'string' ? <FlexIcon name={Icon} className="size-4 text-muted-foreground" /> : <Icon className="size-4 text-muted-foreground" />}
                                    <div className="flex flex-col min-w-0">
                                        <span className="truncate" title={record.title}>
                                            <SearchHighlight text={record.title} query={query} />
                                        </span>
                                        {record.subtitle && (
                                            <span className="text-xs text-muted-foreground truncate" title={record.subtitle}>
                                                <SearchHighlight text={record.subtitle} query={query} />
                                            </span>
                                        )}
                                    </div>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                )}
            </CommandList>

                <CommandSeparator />
                <div className="flex items-center justify-between px-3 py-2 text-[10px] text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                        <RiAppsLine className="size-3" />
                        <span>POC role:</span>
                        <div className="flex items-center gap-0.5" role="group" aria-label="POC role switcher">
                            {ROLE_OPTIONS.map((option) => (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => setRole(option.value)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-colors ${
                                        role === option.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                                >
                                    {option.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <span className="hidden sm:inline">↑↓ navigate · ↵ open · esc close</span>
                </div>
            </Command>
        </CommandDialog>
    );
}

export function GlobalSearchTrigger() {
    const { setOpen } = useGlobalSearch();

    return (
        <Button
            variant="outline"
            size="sm"
            aria-label="Search Flex"
            className="w-9 justify-center px-0 text-xs text-muted-foreground md:w-40 md:justify-start md:px-3"
            onClick={() => setOpen(true)}
        >
            <RiSearchLine className="size-3.5" />
            <span className="hidden truncate md:inline">Search Flex</span>
            <kbd className="ml-auto hidden lg:inline-flex items-center gap-0.5 rounded border border-border bg-muted px-1 py-0.5 text-[9px] font-semibold">
                ⌘K
            </kbd>
        </Button>
    );
}
