import { RiAddLine, RiSearchLine, RiCloseLine } from '@remixicon/react';
import React, { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { routingRepository } from '@/domain/routing-repository';
import type { QueueMember, QueueRecord } from '@/domain/routing-types';

export interface QueueMembersSheetProps {
    queue?: QueueRecord;
    onOpenChange: (open: boolean) => void;
    onChanged?: () => void;
}

/**
 * Queue Members — first-class membership surface. Shows current members and a
 * searchable list of available agents; add/remove with duplicate prevention.
 */
export function QueueMembersSheet({ queue, onOpenChange, onChanged }: QueueMembersSheetProps) {
    const open = !!queue;
    const [members, setMembers] = useState<QueueMember[]>(() => (queue ? routingRepository.queryMembers(queue.id) : []));
    const [search, setSearch] = useState('');

    const available = useMemo(() => {
        const memberIds = new Set(members.map((member) => member.agentId));
        const needle = search.trim().toLowerCase();

        return routingRepository
            .getAvailableAgents()
            .filter((agent) => !memberIds.has(agent.agentId))
            .filter(
                (agent) =>
                    !needle ||
                    agent.name.toLowerCase().includes(needle) ||
                    agent.department.toLowerCase().includes(needle) ||
                    agent.extension.toLowerCase().includes(needle)
            );
    }, [members, search]);

    const addMember = useCallback(
        (agent: QueueMember) => {
            if (!queue) {
                return;
            }

            const added = routingRepository.addMember(queue.id, agent);

            if (!added) {
                toast.error(`${agent.name} is already a member of this queue.`);

                return;
            }

            setMembers(routingRepository.queryMembers(queue.id));
            toast.success(`${agent.name} added to queue`);
            onChanged?.();
        },
        [queue, onChanged]
    );

    const removeMember = useCallback(
        (member: QueueMember) => {
            if (!queue) {
                return;
            }

            routingRepository.removeMember(queue.id, member.agentId);
            setMembers(routingRepository.queryMembers(queue.id));
            toast.success(`${member.name} removed from queue`);
            onChanged?.();
        },
        [queue, onChanged]
    );

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
                <SheetHeader className="border-b border-border pr-10">
                    <SheetTitle className="text-base font-semibold text-flex-text-primary">Queue Members</SheetTitle>
                    {queue && <p className="text-xs text-flex-text-muted">{queue.name}</p>}
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
                    <div>
                        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-flex-text-muted">
                            Assigned Members ({members.length})
                        </h3>
                        {members.length === 0 ? (
                            <p className="rounded-md border border-border bg-muted/30 px-3 py-4 text-center text-xs text-flex-text-muted">
                                No members assigned to this queue yet.
                            </p>
                        ) : (
                            <div className="overflow-hidden rounded-lg border border-border bg-background">
                                <table className="flex-table-grid w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-border bg-muted/40 text-left">
                                            {[
                                                { label: 'Agent', align: 'start' },
                                                { label: 'Extension', align: 'start' },
                                                { label: 'Department', align: 'start' },
                                                { label: 'Priority', align: 'end' },
                                                { label: '', align: 'center' },
                                            ].map((header, index) => (
                                                <th key={index} className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-flex-text-muted whitespace-nowrap ${header.align === 'end' ? 'text-end' : header.align === 'center' ? 'text-center' : 'text-start'}`}>
                                                    {header.label}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.map((member) => (
                                            <tr key={member.agentId} className="border-b border-border last:border-b-0">
                                                <td className="px-3 py-2 text-xs font-semibold text-flex-text-primary text-start">{member.name}</td>
                                                <td className="px-3 py-2 font-mono text-xs text-flex-text-muted text-start">{member.extension}</td>
                                                <td className="px-3 py-2 text-xs text-flex-text-primary text-start">{member.department}</td>
                                                <td className="px-3 py-2 text-xs tabular-nums text-flex-text-primary text-end">{member.priority}</td>
                                                <td className="px-3 py-2 text-center">
                                                    <Button variant="ghost" size="icon-xs" title={`Remove ${member.name}`} aria-label={`Remove ${member.name}`} onClick={() => removeMember(member)}>
                                                        <RiCloseLine className="size-3.5" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    <div>
                        <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-flex-text-muted">Add Member</h3>
                        <div className="relative mb-2">
                            <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-flex-text-muted" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search agents..."
                                aria-label="Search agents"
                                className="pl-9 h-9 text-xs"
                            />
                        </div>
                        <div className="overflow-hidden rounded-lg border border-border bg-background">
                            {available.length === 0 ? (
                                <p className="px-3 py-4 text-center text-xs text-flex-text-muted">
                                    {search ? 'No agents match your search.' : 'All available agents are assigned.'}
                                </p>
                            ) : (
                                <ul className="divide-y divide-border">
                                    {available.map((agent) => (
                                        <li key={agent.agentId} className="flex items-center justify-between gap-3 px-3 py-2 hover:bg-muted/30 transition-colors">
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-xs font-semibold text-flex-text-primary truncate">{agent.name}</span>
                                                <span className="text-[11px] text-flex-text-muted truncate">
                                                    {agent.department} · {agent.extension}
                                                </span>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="gap-1 text-xs shrink-0"
                                                aria-label={`Add ${agent.name}`}
                                                onClick={() => addMember(agent)}
                                            >
                                                <RiAddLine className="size-3.5" />
                                                Add
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
