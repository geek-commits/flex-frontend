import type { Capability } from '@/auth/capabilities';
import type { FlexIconName } from '@/components/flex/iconography';

export interface ModuleEntry {
    id: string;
    href: string;
    title: string;
    description: string;
    icon: FlexIconName;
    category: string;
    badge?: string;
    capability?: Capability;
    /** Search terms that describe what an administrator manages here. */
    keywords?: string[];
    /** True only for destinations outside the FLEX SPA (new tab semantics). */
    external?: boolean;
}

export const CONSOLE_MODULES: ModuleEntry[] = [
    // Core Administration
    { id: 'tenants', href: '/admin/tenants', title: 'Tenants & Multi-Org', description: 'Manage tenant accounts, organizations, and domain isolation.', icon: 'organizations', category: 'Core Administration', keywords: ['tenant', 'multi-org', 'organization', 'domain', 'account'], capability: 'roles.manage' },
    { id: 'agents', href: '/admin/agents', title: 'Agents & Proficiencies', description: 'Configure agent profiles, extension mapping, and skill routing.', icon: 'agents', category: 'Core Administration', keywords: ['agent', 'proficiency', 'skill', 'extension'], capability: 'console.view' },
    { id: 'users', href: '/admin/users', title: 'Users & Roles', description: 'Role-based access control, credentials, and security policies.', icon: 'users', category: 'Core Administration', keywords: ['users', 'accounts', 'access', 'password'], capability: 'roles.manage' },
    { id: 'roles', href: '/admin/roles', title: 'Roles & Permissions', description: 'Granular policy management for admin and supervisory roles.', icon: 'roles', category: 'Core Administration', keywords: ['roles', 'permissions', 'policy', 'capability'], capability: 'roles.manage' },
    { id: 'subscriptions', href: '/admin/subscription', title: 'Subscriptions', description: 'Track subscription status, remaining days, reminders, and renewal activity.', icon: 'subscriptions', category: 'Core Administration', keywords: ['subscription', 'plan', 'billing', 'expiry', 'seats', 'renewal'], capability: 'roles.manage' },

    // Telephony & Operations
    { id: 'cdr', href: '/admin/cdr', title: 'Call Records (CDR)', description: 'Search, filter, and inspect granular telephony logs and recordings.', icon: 'call-records', category: 'Telephony & Operations', keywords: ['cdr', 'call detail record', 'calls', 'telephony', 'log'], capability: 'cdr.view' },
    { id: 'call-campaigns', href: '/admin/campaigns', title: 'Call Campaigns', description: 'Outbound campaign management, schedules, and analytics.', icon: 'campaigns', category: 'Telephony & Operations', keywords: ['campaign', 'outbound', 'dialer', 'schedules'], capability: 'campaigns.view' },
    { id: 'queue', href: '/admin/queues', title: 'Queues & SLA', description: 'Configure inbound queues, wrap-up rules, and SLA targets.', icon: 'queues', category: 'Telephony & Operations', keywords: ['queue', 'acd', 'routing', 'wrap-up', 'sla', 'distribution'], capability: 'console.view' },
    { id: 'ivr', href: '/admin/ivr', title: 'IVR Trees', description: 'Build interactive voice response menus and keypress flows.', icon: 'ivr', category: 'Telephony & Operations', keywords: ['ivr', 'voice menu', 'routing', 'menu'], capability: 'console.view' },
    { id: 'time-groups', href: '/admin/time-groups', title: 'Time Groups', description: 'Reusable schedule definitions for time-based routing.', icon: 'schedules', category: 'Telephony & Operations', keywords: ['time group', 'schedule', 'hours', 'weekdays', 'routing'], capability: 'console.view' },
    { id: 'recordings', href: '/admin/recordings', title: 'Audio & Recordings', description: 'Manage system audio prompts, greetings, IVR recordings, and hold music.', icon: 'recordings', category: 'Telephony & Operations', keywords: ['recording', 'audio', 'prompts', 'greetings', 'moh', 'archive'], capability: 'console.view' },

    // Analytics & Quality
    { id: 'call-stats', href: '/admin/stats', title: 'Call Statistics', description: 'Real-time performance analytics, call volumes, and metrics.', icon: 'call-statistics', category: 'Analytics & Quality', keywords: ['statistics', 'analytics', 'metrics', 'volume'], capability: 'reports.view' },
    { id: 'reports', href: '/admin/reports', title: 'Reports & Analytics', description: 'Generate, schedule, and export operational PDF/Excel reports.', icon: 'reports', category: 'Analytics & Quality', keywords: ['report', 'export', 'pdf', 'excel', 'schedule'], capability: 'reports.view' },
    { id: 'charts', href: '/admin/charts', title: 'Flex Charts', description: 'Visual analytics dashboard for supervisory overview.', icon: 'charts', category: 'Analytics & Quality', keywords: ['charts', 'visualization', 'analytics', 'graph'], capability: 'reports.view' },
    { id: 'survey-monitoring', href: '/admin/surveys', title: 'Survey Monitoring', description: 'Customer CSAT/NPS survey feedback and scorecards.', icon: 'surveys', category: 'Analytics & Quality', keywords: ['survey', 'csat', 'nps', 'feedback', 'scorecard'], capability: 'reports.view' },

    // System Configuration
    { id: 'inbound-routes', href: '/admin/inbound-routes', title: 'Inbound Routes', description: 'DID pattern routing, time conditions, and destination rules.', icon: 'routes', category: 'System Configuration', keywords: ['inbound', 'route', 'did', 'destination', 'trunk'], capability: 'console.view' },
    { id: 'time-conditions', href: '/admin/time-conditions', title: 'Time Conditions', description: 'Schedule working hours, holidays, and off-hour routing.', icon: 'time-conditions', category: 'System Configuration', keywords: ['time', 'schedule', 'hours', 'holiday', 'condition'], capability: 'console.view' },
    { id: 'system-settings', href: '/admin/system', title: 'System & Infrastructure', description: 'Service health, server resources, backup status, and gateway connections.', icon: 'infrastructure', category: 'System Configuration', keywords: ['system', 'infrastructure', 'health', 'backup', 'servers'], capability: 'system.view' },
    { id: 'mail-config', href: '/admin/mail-config', title: 'Mail Configuration', description: 'Configure and test SMTP server settings for system alerts and notifications.', icon: 'mail', category: 'System Configuration', keywords: ['mail', 'smtp', 'email', 'notifications', 'host', 'port'], capability: 'system.view' },
    { id: 'security', href: '/admin/security', title: 'Security & Audit', description: 'IP access controls, firewall rules, and audit trail logs.', icon: 'security', category: 'System Configuration', keywords: ['security', 'audit', 'ip', 'firewall', 'access'], capability: 'roles.manage' },
    { id: 'backups', href: '/admin/backups', title: 'Backups & Storage', description: 'Database snapshot archives, retention, and disaster recovery.', icon: 'backups', category: 'System Configuration', keywords: ['backup', 'snapshot', 'storage', 'database'], capability: 'console.view' },
    { id: 'global-settings', href: '/settings/profile', title: 'Settings', description: 'Profile, account security, and application preferences.', icon: 'settings', category: 'System Configuration', keywords: ['settings', 'profile', 'preferences', 'account'], capability: 'settings.manage' },
];

export const SETTINGS_MODULES: ModuleEntry[] = [
    { id: 'ivr', href: '/admin/ivr', title: 'IVR & Menu Flow', description: 'Interactive voice response routes, keypress menus, and audio prompts.', icon: 'ivr', category: 'Telephony Settings', capability: 'settings.manage' },
    { id: 'queues', href: '/admin/queues', title: 'Queues & Wrap-up', description: 'Queue strategies, max callers, music on hold, and post-call wrap-up timers.', icon: 'queues', category: 'Telephony Settings', capability: 'settings.manage' },
    { id: 'time-conditions', href: '/admin/time-conditions', title: 'Time Conditions', description: 'Working hour schedules, holidays, and automatic after-hours routing.', icon: 'time-conditions', category: 'Telephony Settings', capability: 'settings.manage' },
    { id: 'inbound-routes', href: '/admin/settings/inbound-routes', title: 'Inbound Routes', description: 'DID pattern matching, trunk mapping, and entry point routing.', icon: 'routes', category: 'Routing & Trunks', capability: 'settings.manage' },
    { id: 'outbound-routes', href: '/admin/settings/outbound-routes', title: 'Outbound Routes', description: 'Dial plan prefixes, trunk failover priorities, and rate limits.', icon: 'routes', category: 'Routing & Trunks', capability: 'settings.manage' },
    { id: 'recordings', href: '/admin/settings/recordings', title: 'Recordings & Retention', description: 'Audio archive formats, retention policies, and cloud storage sinks.', icon: 'recordings', category: 'Media & Audio', capability: 'settings.manage' },
    { id: 'moh', href: '/admin/settings/moh', title: 'Music On Hold (MOH)', description: 'Manage audio playlists played while callers are queued or on hold.', icon: 'music', category: 'Media & Audio', capability: 'settings.manage' },
    { id: 'tones', href: '/admin/settings/tones', title: 'Tones & Frequencies', description: 'Country-specific ringback, busy, and dialtone frequency profiles.', icon: 'tones', category: 'Media & Audio', capability: 'settings.manage' },
    { id: 'agent-states', href: '/admin/settings/agent-states', title: 'Agent States & Reasons', description: 'Custom pause codes, break reasons, and wrap-up status labels.', icon: 'agents', category: 'Operational Policies', capability: 'settings.manage' },
    { id: 'departments', href: '/admin/settings/departments', title: 'Departments', description: 'Organizational units, cost center allocations, and supervisors.', icon: 'organizations', category: 'Operational Policies', capability: 'settings.manage' },
    { id: 'survey', href: '/admin/settings/surveys', title: 'CSAT / Survey Config', description: 'Post-call survey prompts, scoring rules, and rating thresholds.', icon: 'surveys', category: 'Operational Policies', capability: 'settings.manage' },
    { id: 'security', href: '/admin/settings/security', title: 'Security & Access', description: 'IP whitelists, password policies, session timeouts, and two-factor auth.', icon: 'security', category: 'System & Security', capability: 'settings.manage' },
    { id: 'cdr-config', href: '/admin/settings/cdr-config', title: 'CDR Configuration', description: 'Log storage parameters, anonymization rules, and purging schedules.', icon: 'cdr-configuration', category: 'System & Security', capability: 'settings.manage' },
    { id: 'global-config', href: '/admin/settings/global', title: 'Global System Config', description: 'Core application settings, default locale, and time zone offsets.', icon: 'global-config', category: 'System & Security', capability: 'settings.manage' },
];

export const ALL_MODULES: ModuleEntry[] = [...CONSOLE_MODULES, ...SETTINGS_MODULES];

/**
 * NOTE: a few modules intentionally appear in BOTH catalogs (ivr, queues,
 * time-conditions, inbound-routes, recordings, security) because they are
 * cross-listed from the Management Console and the Settings directory. This
 * creates duplicate keys in `MODULE_INDEX` where the later (SETTINGS) entry
 * wins. That is benign: `MODULE_INDEX` only feeds `module-placeholder` (these
 * destinations are real pages) — do not "de-duplicate" them.
 *
 * Remaining-module classification (Remaining Modules preflight): entries that
 * resolve only to `module-placeholder` are NOT_PRESENT / ALIAS / BLOCKED and
 * are intentionally not built in this POC. See FLEX_FEATURE_PARITY.md §12b.
 */
export const MODULE_INDEX: Record<string, ModuleEntry> = Object.fromEntries(
    ALL_MODULES.map((module) => [module.href, module])
);
