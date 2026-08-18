import { RiCheckLine } from '@remixicon/react';
import React from 'react';
import { useCapabilities, ROLE_CAPABILITIES  } from '@/auth/capabilities';
import type {Capability} from '@/auth/capabilities';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useTenantContext } from '@/features/tenants/tenant-context';

const ROLE_LABELS: Record<string, string> = {
    'super-admin': 'Super Administrator',
    admin: 'Administrator',
    agent: 'Agent',
};

const CAPABILITY_LABELS: Record<string, string> = {
    'dashboard.view': 'Contact Center Dashboard',
    'monitor.view': 'Agent Monitoring',
    'console.view': 'Management Console',
    'cdr.view': 'Call Records (CDR)',
    'campaigns.view': 'Call Campaigns',
    'campaigns.manage': 'Manage Campaigns',
    'reports.view': 'Reports & Analytics',
    'ai.view': 'AI Center',
    'system.view': 'System & Infrastructure',
    'settings.manage': 'Settings & Profile',
    'security.view': 'Security',
    'roles.manage': 'Roles & Permissions',
    'agent.workspace': 'Agent Workspace',
    'agent.dashboard.view': 'Agent Dashboard',
    'social.view': 'Social Inbox',
    'call.manager': 'Call Manager',
    'missed-calls.view': 'Missed Calls',
    'troubleshooting.view': 'Troubleshooting',
    'support.view': 'Quick Support',
};

const CAPABILITY_ORDER: Capability[] = [
    'dashboard.view',
    'monitor.view',
    'console.view',
    'cdr.view',
    'campaigns.view',
    'campaigns.manage',
    'reports.view',
    'ai.view',
    'system.view',
    'settings.manage',
    'security.view',
    'roles.manage',
    'agent.workspace',
    'agent.dashboard.view',
    'social.view',
    'call.manager',
    'missed-calls.view',
    'troubleshooting.view',
    'support.view',
];

export interface MyRoleAccessProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/**
 * Read-only role & access inspection. Reflects the authoritative capability
 * registry and the current tenant/platform scope; never invents capabilities.
 */
export function MyRoleAccess({ open, onOpenChange }: MyRoleAccessProps) {
    const { role } = useCapabilities();
    const { context } = useTenantContext();

    const scopeLabel = context.mode === 'tenant' ? context.tenant.name : 'Platform';

    const capabilities = ROLE_CAPABILITIES[role] ?? [];
    const ordered = CAPABILITY_ORDER.filter((cap) => capabilities.includes(cap));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>My Role &amp; Access</DialogTitle>
                    <DialogDescription>
                        Read-only view of your assigned role and effective access.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4">
                    <div className="rounded-lg border border-border bg-muted/40 p-3 flex flex-col gap-1">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Role</span>
                            <span className="font-semibold text-foreground">
                                {ROLE_LABELS[role] ?? 'Super Administrator'}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">Scope</span>
                            <span className="font-semibold text-foreground">{scopeLabel}</span>
                        </div>
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-foreground mb-2">Effective access</div>
                        <ul className="flex flex-col gap-1">
                            {ordered.map((cap) => (
                                <li
                                    key={cap}
                                    className="flex items-center gap-2 text-xs text-muted-foreground"
                                >
                                    <RiCheckLine className="size-3.5 text-status-live shrink-0" />
                                    {CAPABILITY_LABELS[cap] ?? cap}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}