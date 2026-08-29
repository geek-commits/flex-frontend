import type { Capability } from '@/auth/capabilities';
import type { FlexIconName } from '@/components/flex/iconography';

export interface ModuleEntry {
    id: string;
    href: string;
    title: string;
    titleKey: string;
    description: string;
    descriptionKey: string;
    icon: FlexIconName;
    category: string;
    categoryKey: string;
    badge?: string;
    capability?: Capability;
    /** Search terms that describe what an administrator manages here. */
    keywords?: string[];
    /** True only for destinations outside the FLEX SPA (new tab semantics). */
    external?: boolean;
}

export const CONSOLE_MODULES: ModuleEntry[] = [
    // Core Administration
    { id: 'tenants', href: '/admin/tenants', title: 'Tenants & Multi-Org', titleKey: 'modules.tenants.title', description: 'Manage tenant accounts, organizations, and domain isolation.', descriptionKey: 'modules.tenants.description', icon: 'organizations', category: 'Core Administration', categoryKey: 'modules.categories.coreAdministration', keywords: ['tenant', 'multi-org', 'organization', 'domain', 'account'], capability: 'tenants.manage' },
    { id: 'agents', href: '/admin/agents', title: 'Agents & Proficiencies', titleKey: 'modules.agents.title', description: 'Configure agent profiles, extension mapping, and skill routing.', descriptionKey: 'modules.agents.description', icon: 'agents', category: 'Core Administration', categoryKey: 'modules.categories.coreAdministration', keywords: ['agent', 'proficiency', 'skill', 'extension'], capability: 'console.view' },
    { id: 'users', href: '/admin/users', title: 'Users & Roles', titleKey: 'modules.users.title', description: 'Role-based access control, credentials, and security policies.', descriptionKey: 'modules.users.description', icon: 'users', category: 'Core Administration', categoryKey: 'modules.categories.coreAdministration', keywords: ['users', 'accounts', 'access', 'password'], capability: 'console.view' },
    { id: 'roles', href: '/admin/roles', title: 'Roles & Permissions', titleKey: 'modules.roles.title', description: 'Granular policy management for admin and supervisory roles.', descriptionKey: 'modules.roles.description', icon: 'roles', category: 'Core Administration', categoryKey: 'modules.categories.coreAdministration', keywords: ['roles', 'permissions', 'policy', 'capability'], capability: 'roles.manage' },
    { id: 'subscriptions', href: '/admin/subscription', title: 'Subscriptions', titleKey: 'modules.subscriptions.title', description: 'Track subscription status, remaining days, reminders, and renewal activity.', descriptionKey: 'modules.subscriptions.description', icon: 'subscriptions', category: 'Core Administration', categoryKey: 'modules.categories.coreAdministration', keywords: ['subscription', 'plan', 'billing', 'expiry', 'seats', 'renewal'], capability: 'settings.manage' },

    // Telephony & Operations
    { id: 'cdr', href: '/admin/cdr', title: 'Call Records (CDR)', titleKey: 'modules.cdr.title', description: 'Search, filter, and inspect granular telephony logs and recordings.', descriptionKey: 'modules.cdr.description', icon: 'call-records', category: 'Telephony & Operations', categoryKey: 'modules.categories.telephonyOperations', keywords: ['cdr', 'call detail record', 'calls', 'telephony', 'log'], capability: 'cdr.view' },
    { id: 'call-campaigns', href: '/admin/campaigns', title: 'Call Campaigns', titleKey: 'modules.call-campaigns.title', description: 'Outbound campaign management, schedules, and analytics.', descriptionKey: 'modules.call-campaigns.description', icon: 'campaigns', category: 'Telephony & Operations', categoryKey: 'modules.categories.telephonyOperations', keywords: ['campaign', 'outbound', 'dialer', 'schedules'], capability: 'campaigns.view' },
    { id: 'queue', href: '/admin/queues', title: 'Queues & SLA', titleKey: 'modules.queue.title', description: 'Configure inbound queues, wrap-up rules, and SLA targets.', descriptionKey: 'modules.queue.description', icon: 'queues', category: 'Telephony & Operations', categoryKey: 'modules.categories.telephonyOperations', keywords: ['queue', 'acd', 'routing', 'wrap-up', 'sla', 'distribution'], capability: 'console.view' },
    { id: 'ivr', href: '/admin/ivr', title: 'IVR Trees', titleKey: 'modules.ivr.title', description: 'Build interactive voice response menus and keypress flows.', descriptionKey: 'modules.ivr.description', icon: 'ivr', category: 'Telephony & Operations', categoryKey: 'modules.categories.telephonyOperations', keywords: ['ivr', 'voice menu', 'routing', 'menu'], capability: 'console.view' },
    { id: 'time-groups', href: '/admin/time-groups', title: 'Time Groups', titleKey: 'modules.time-groups.title', description: 'Reusable schedule definitions for time-based routing.', descriptionKey: 'modules.time-groups.description', icon: 'schedules', category: 'Telephony & Operations', categoryKey: 'modules.categories.telephonyOperations', keywords: ['time group', 'schedule', 'hours', 'weekdays', 'routing'], capability: 'console.view' },
    { id: 'recordings', href: '/admin/recordings', title: 'Audio & Recordings', titleKey: 'modules.recordings.title', description: 'Manage system audio prompts, greetings, IVR recordings, and hold music.', descriptionKey: 'modules.recordings.description', icon: 'recordings', category: 'Telephony & Operations', categoryKey: 'modules.categories.telephonyOperations', keywords: ['recording', 'audio', 'prompts', 'greetings', 'moh', 'archive'], capability: 'console.view' },

    // Analytics & Quality
    { id: 'call-stats', href: '/admin/stats', title: 'Call Statistics', titleKey: 'modules.call-stats.title', description: 'Real-time performance analytics, call volumes, and metrics.', descriptionKey: 'modules.call-stats.description', icon: 'call-statistics', category: 'Analytics & Quality', categoryKey: 'modules.categories.analyticsQuality', keywords: ['statistics', 'analytics', 'metrics', 'volume'], capability: 'reports.view' },
    { id: 'reports', href: '/admin/reports', title: 'Reports & Analytics', titleKey: 'modules.reports.title', description: 'Generate, schedule, and export operational PDF/Excel reports.', descriptionKey: 'modules.reports.description', icon: 'reports', category: 'Analytics & Quality', categoryKey: 'modules.categories.analyticsQuality', keywords: ['report', 'export', 'pdf', 'excel', 'schedule'], capability: 'reports.view' },
    { id: 'charts', href: '/admin/charts', title: 'Flex Charts', titleKey: 'modules.charts.title', description: 'Visual analytics dashboard for supervisory overview.', descriptionKey: 'modules.charts.description', icon: 'charts', category: 'Analytics & Quality', categoryKey: 'modules.categories.analyticsQuality', keywords: ['charts', 'visualization', 'analytics', 'graph'], capability: 'reports.view' },
    { id: 'survey-monitoring', href: '/admin/surveys', title: 'Survey Monitoring', titleKey: 'modules.survey-monitoring.title', description: 'Customer CSAT/NPS survey feedback and scorecards.', descriptionKey: 'modules.survey-monitoring.description', icon: 'surveys', category: 'Analytics & Quality', categoryKey: 'modules.categories.analyticsQuality', keywords: ['survey', 'csat', 'nps', 'feedback', 'scorecard'], capability: 'reports.view' },

    // System Configuration
    { id: 'inbound-routes', href: '/admin/inbound-routes', title: 'Inbound Routes', titleKey: 'modules.inbound-routes.title', description: 'DID pattern routing, time conditions, and destination rules.', descriptionKey: 'modules.inbound-routes.description', icon: 'routes', category: 'System Configuration', categoryKey: 'modules.categories.systemConfiguration', keywords: ['inbound', 'route', 'did', 'destination', 'trunk'], capability: 'console.view' },
    { id: 'time-conditions', href: '/admin/time-conditions', title: 'Time Conditions', titleKey: 'modules.time-conditions.title', description: 'Schedule working hours, holidays, and off-hour routing.', descriptionKey: 'modules.time-conditions.description', icon: 'time-conditions', category: 'System Configuration', categoryKey: 'modules.categories.systemConfiguration', keywords: ['time', 'schedule', 'hours', 'holiday', 'condition'], capability: 'console.view' },
    { id: 'system-settings', href: '/admin/system', title: 'System & Infrastructure', titleKey: 'modules.system-settings.title', description: 'Service health, server resources, backup status, and gateway connections.', descriptionKey: 'modules.system-settings.description', icon: 'infrastructure', category: 'System Configuration', categoryKey: 'modules.categories.systemConfiguration', keywords: ['system', 'infrastructure', 'health', 'backup', 'servers'], capability: 'system.view' },
    { id: 'mail-config', href: '/admin/mail-config', title: 'Mail Configuration', titleKey: 'modules.mail-config.title', description: 'Configure and test SMTP server settings for system alerts and notifications.', descriptionKey: 'modules.mail-config.description', icon: 'mail', category: 'System Configuration', categoryKey: 'modules.categories.systemConfiguration', keywords: ['mail', 'smtp', 'email', 'notifications', 'host', 'port'], capability: 'settings.manage' },
    { id: 'security', href: '/admin/security', title: 'Security & Audit', titleKey: 'modules.security.title', description: 'IP access controls, firewall rules, and audit trail logs.', descriptionKey: 'modules.security.description', icon: 'security', category: 'System Configuration', categoryKey: 'modules.categories.systemConfiguration', keywords: ['security', 'audit', 'ip', 'firewall', 'access'], capability: 'roles.manage' },
    { id: 'backups', href: '/admin/backups', title: 'Backups & Storage', titleKey: 'modules.backups.title', description: 'Database snapshot archives, retention, and disaster recovery.', descriptionKey: 'modules.backups.description', icon: 'backups', category: 'System Configuration', categoryKey: 'modules.categories.systemConfiguration', keywords: ['backup', 'snapshot', 'storage', 'database'], capability: 'console.view' },
    { id: 'global-settings', href: '/settings/profile', title: 'Settings', titleKey: 'modules.global-settings.title', description: 'Profile, account security, and application preferences.', descriptionKey: 'modules.global-settings.description', icon: 'settings', category: 'System Configuration', categoryKey: 'modules.categories.systemConfiguration', keywords: ['settings', 'profile', 'preferences', 'account'], capability: 'settings.manage' },
];

export const SETTINGS_MODULES: ModuleEntry[] = [
    { id: 'ivr', href: '/admin/ivr', title: 'IVR & Menu Flow', titleKey: 'modules.ivr.title', description: 'Interactive voice response routes, keypress menus, and audio prompts.', descriptionKey: 'modules.ivr.description', icon: 'ivr', category: 'Telephony Settings', categoryKey: 'modules.categories.telephonySettings', capability: 'settings.manage' },
    { id: 'queues', href: '/admin/queues', title: 'Queues & Wrap-up', titleKey: 'modules.queues.title', description: 'Queue strategies, max callers, music on hold, and post-call wrap-up timers.', descriptionKey: 'modules.queues.description', icon: 'queues', category: 'Telephony Settings', categoryKey: 'modules.categories.telephonySettings', capability: 'settings.manage' },
    { id: 'time-conditions', href: '/admin/time-conditions', title: 'Time Conditions', titleKey: 'modules.time-conditions.title', description: 'Working hour schedules, holidays, and automatic after-hours routing.', descriptionKey: 'modules.time-conditions.description', icon: 'time-conditions', category: 'Telephony Settings', categoryKey: 'modules.categories.telephonySettings', capability: 'settings.manage' },
    { id: 'inbound-routes', href: '/admin/settings/inbound-routes', title: 'Inbound Routes', titleKey: 'modules.inbound-routes.title', description: 'DID pattern matching, trunk mapping, and entry point routing.', descriptionKey: 'modules.inbound-routes.description', icon: 'routes', category: 'Routing & Trunks', categoryKey: 'modules.categories.routingTrunks', capability: 'settings.manage' },
    { id: 'outbound-routes', href: '/admin/settings/outbound-routes', title: 'Outbound Routes', titleKey: 'modules.outbound-routes.title', description: 'Dial plan prefixes, trunk failover priorities, and rate limits.', descriptionKey: 'modules.outbound-routes.description', icon: 'routes', category: 'Routing & Trunks', categoryKey: 'modules.categories.routingTrunks', capability: 'settings.manage' },
    { id: 'recordings', href: '/admin/settings/recordings', title: 'Recordings & Retention', titleKey: 'modules.recordings.title', description: 'Audio archive formats, retention policies, and cloud storage sinks.', descriptionKey: 'modules.recordings.description', icon: 'recordings', category: 'Media & Audio', categoryKey: 'modules.categories.mediaAudio', capability: 'settings.manage' },
    { id: 'moh', href: '/admin/settings/moh', title: 'Music On Hold (MOH)', titleKey: 'modules.moh.title', description: 'Manage audio playlists played while callers are queued or on hold.', descriptionKey: 'modules.moh.description', icon: 'music', category: 'Media & Audio', categoryKey: 'modules.categories.mediaAudio', capability: 'settings.manage' },
    { id: 'tones', href: '/admin/settings/tones', title: 'Tones & Frequencies', titleKey: 'modules.tones.title', description: 'Country-specific ringback, busy, and dialtone frequency profiles.', descriptionKey: 'modules.tones.description', icon: 'tones', category: 'Media & Audio', categoryKey: 'modules.categories.mediaAudio', capability: 'settings.manage' },
    { id: 'agent-states', href: '/admin/settings/agent-states', title: 'Agent States & Reasons', titleKey: 'modules.agent-states.title', description: 'Custom pause codes, break reasons, and wrap-up status labels.', descriptionKey: 'modules.agent-states.description', icon: 'agents', category: 'Operational Policies', categoryKey: 'modules.categories.operationalPolicies', capability: 'settings.manage' },
    { id: 'departments', href: '/admin/settings/departments', title: 'Departments', titleKey: 'modules.departments.title', description: 'Organizational units, cost center allocations, and supervisors.', descriptionKey: 'modules.departments.description', icon: 'organizations', category: 'Operational Policies', categoryKey: 'modules.categories.operationalPolicies', capability: 'settings.manage' },
    { id: 'survey', href: '/admin/settings/surveys', title: 'CSAT / Survey Config', titleKey: 'modules.survey.title', description: 'Post-call survey prompts, scoring rules, and rating thresholds.', descriptionKey: 'modules.survey.description', icon: 'surveys', category: 'Operational Policies', categoryKey: 'modules.categories.operationalPolicies', capability: 'settings.manage' },
    { id: 'security', href: '/admin/settings/security', title: 'Security & Access', titleKey: 'modules.security.title', description: 'IP whitelists, password policies, session timeouts, and two-factor auth.', descriptionKey: 'modules.security.description', icon: 'security', category: 'System & Security', categoryKey: 'modules.categories.systemSecurity', capability: 'settings.manage' },
    { id: 'cdr-config', href: '/admin/settings/cdr-config', title: 'CDR Configuration', titleKey: 'modules.cdr-config.title', description: 'Log storage parameters, anonymization rules, and purging schedules.', descriptionKey: 'modules.cdr-config.description', icon: 'cdr-configuration', category: 'System & Security', categoryKey: 'modules.categories.systemSecurity', capability: 'settings.manage' },
    { id: 'global-config', href: '/admin/settings/global', title: 'Global System Config', titleKey: 'modules.global-config.title', description: 'Core application settings, default locale, and time zone offsets.', descriptionKey: 'modules.global-config.description', icon: 'global-config', category: 'System & Security', categoryKey: 'modules.categories.systemSecurity', capability: 'settings.manage' },
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
