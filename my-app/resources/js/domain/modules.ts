import type { Capability } from '@/auth/capabilities';
import type { FlexIconName } from '@/components/flex/iconography';

export type ModuleTitleKey =
    | 'modules.tenants.title'
    | 'modules.agents.title'
    | 'modules.users.title'
    | 'modules.roles.title'
    | 'modules.subscriptions.title'
    | 'modules.cdr.title'
    | 'modules.call-campaigns.title'
    | 'modules.queue.title'
    | 'modules.queues.title'
    | 'modules.ivr.title'
    | 'modules.time-groups.title'
    | 'modules.recordings.title'
    | 'modules.call-stats.title'
    | 'modules.reports.title'
    | 'modules.charts.title'
    | 'modules.survey-monitoring.title'
    | 'modules.inbound-routes.title'
    | 'modules.time-conditions.title'
    | 'modules.system-settings.title'
    | 'modules.mail-config.title'
    | 'modules.security.title'
    | 'modules.backups.title'
    | 'modules.global-settings.title'
    | 'modules.moh.title'
    | 'modules.tones.title'
    | 'modules.agent-states.title'
    | 'modules.departments.title'
    | 'modules.survey.title'
    | 'modules.cdr-config.title'
    | 'modules.global-config.title'
    | 'modules.outbound-routes.title';
export type ModuleDescriptionKey =
    | 'modules.tenants.description'
    | 'modules.agents.description'
    | 'modules.users.description'
    | 'modules.roles.description'
    | 'modules.subscriptions.description'
    | 'modules.cdr.description'
    | 'modules.call-campaigns.description'
    | 'modules.queue.description'
    | 'modules.queues.description'
    | 'modules.ivr.description'
    | 'modules.time-groups.description'
    | 'modules.recordings.description'
    | 'modules.call-stats.description'
    | 'modules.reports.description'
    | 'modules.charts.description'
    | 'modules.survey-monitoring.description'
    | 'modules.inbound-routes.description'
    | 'modules.time-conditions.description'
    | 'modules.system-settings.description'
    | 'modules.mail-config.description'
    | 'modules.security.description'
    | 'modules.backups.description'
    | 'modules.global-settings.description'
    | 'modules.moh.description'
    | 'modules.tones.description'
    | 'modules.agent-states.description'
    | 'modules.departments.description'
    | 'modules.survey.description'
    | 'modules.cdr-config.description'
    | 'modules.global-config.description'
    | 'modules.outbound-routes.description';
export type ModuleCategoryKey =
    | 'modules.categories.coreAdministration'
    | 'modules.categories.telephonyOperations'
    | 'modules.categories.analyticsQuality'
    | 'modules.categories.systemConfiguration'
    | 'modules.categories.telephonySettings'
    | 'modules.categories.routingTrunks'
    | 'modules.categories.mediaAudio'
    | 'modules.categories.operationalPolicies'
    | 'modules.categories.systemSecurity';

export interface ModuleEntry {
    id: string;
    href: string;
    titleKey: ModuleTitleKey;
    descriptionKey: ModuleDescriptionKey;
    icon: FlexIconName;
    categoryKey: ModuleCategoryKey;
    badge?: string;
    capability?: Capability;
    /** Search terms that describe what an administrator manages here. */
    keywords?: string[];
    /** True only for destinations outside the FLEX SPA (new tab semantics). */
    external?: boolean;
}

export const CONSOLE_MODULES: ModuleEntry[] = [
    // Core Administration
    { id: 'tenants', href: '/admin/tenants', titleKey: 'modules.tenants.title', descriptionKey: 'modules.tenants.description', icon: 'organizations', categoryKey: 'modules.categories.coreAdministration', keywords: ['tenant', 'multi-org', 'organization', 'domain', 'account'], capability: 'tenants.manage' },
    { id: 'agents', href: '/admin/agents', titleKey: 'modules.agents.title', descriptionKey: 'modules.agents.description', icon: 'agents', categoryKey: 'modules.categories.coreAdministration', keywords: ['agent', 'proficiency', 'skill', 'extension'], capability: 'console.view' },
    { id: 'users', href: '/admin/users', titleKey: 'modules.users.title', descriptionKey: 'modules.users.description', icon: 'users', categoryKey: 'modules.categories.coreAdministration', keywords: ['users', 'accounts', 'access', 'password'], capability: 'console.view' },
    { id: 'roles', href: '/admin/roles', titleKey: 'modules.roles.title', descriptionKey: 'modules.roles.description', icon: 'roles', categoryKey: 'modules.categories.coreAdministration', keywords: ['roles', 'permissions', 'policy', 'capability'], capability: 'roles.manage' },
    { id: 'subscriptions', href: '/admin/subscription', titleKey: 'modules.subscriptions.title', descriptionKey: 'modules.subscriptions.description', icon: 'subscriptions', categoryKey: 'modules.categories.coreAdministration', keywords: ['subscription', 'plan', 'billing', 'expiry', 'seats', 'renewal'], capability: 'settings.manage' },

    // Telephony & Operations
    { id: 'cdr', href: '/admin/cdr', titleKey: 'modules.cdr.title', descriptionKey: 'modules.cdr.description', icon: 'call-records', categoryKey: 'modules.categories.telephonyOperations', keywords: ['cdr', 'call detail record', 'calls', 'telephony', 'log'], capability: 'cdr.view' },
    { id: 'call-campaigns', href: '/admin/campaigns', titleKey: 'modules.call-campaigns.title', descriptionKey: 'modules.call-campaigns.description', icon: 'campaigns', categoryKey: 'modules.categories.telephonyOperations', keywords: ['campaign', 'outbound', 'dialer', 'schedules'], capability: 'campaigns.view' },
    { id: 'queue', href: '/admin/queues', titleKey: 'modules.queue.title', descriptionKey: 'modules.queue.description', icon: 'queues', categoryKey: 'modules.categories.telephonyOperations', keywords: ['queue', 'acd', 'routing', 'wrap-up', 'sla', 'distribution'], capability: 'console.view' },
    { id: 'ivr', href: '/admin/ivr', titleKey: 'modules.ivr.title', descriptionKey: 'modules.ivr.description', icon: 'ivr', categoryKey: 'modules.categories.telephonyOperations', keywords: ['ivr', 'voice menu', 'routing', 'menu'], capability: 'console.view' },
    { id: 'time-groups', href: '/admin/time-groups', titleKey: 'modules.time-groups.title', descriptionKey: 'modules.time-groups.description', icon: 'schedules', categoryKey: 'modules.categories.telephonyOperations', keywords: ['time group', 'schedule', 'hours', 'weekdays', 'routing'], capability: 'console.view' },
    { id: 'recordings', href: '/admin/recordings', titleKey: 'modules.recordings.title', descriptionKey: 'modules.recordings.description', icon: 'recordings', categoryKey: 'modules.categories.telephonyOperations', keywords: ['recording', 'audio', 'prompts', 'greetings', 'moh', 'archive'], capability: 'console.view' },

    // Analytics & Quality
    { id: 'call-stats', href: '/admin/stats', titleKey: 'modules.call-stats.title', descriptionKey: 'modules.call-stats.description', icon: 'call-statistics', categoryKey: 'modules.categories.analyticsQuality', keywords: ['statistics', 'analytics', 'metrics', 'volume'], capability: 'reports.view' },
    { id: 'reports', href: '/admin/reports', titleKey: 'modules.reports.title', descriptionKey: 'modules.reports.description', icon: 'reports', categoryKey: 'modules.categories.analyticsQuality', keywords: ['report', 'export', 'pdf', 'excel', 'schedule'], capability: 'reports.view' },
    { id: 'charts', href: '/admin/charts', titleKey: 'modules.charts.title', descriptionKey: 'modules.charts.description', icon: 'charts', categoryKey: 'modules.categories.analyticsQuality', keywords: ['charts', 'visualization', 'analytics', 'graph'], capability: 'reports.view' },
    { id: 'survey-monitoring', href: '/admin/surveys', titleKey: 'modules.survey-monitoring.title', descriptionKey: 'modules.survey-monitoring.description', icon: 'surveys', categoryKey: 'modules.categories.analyticsQuality', keywords: ['survey', 'csat', 'nps', 'feedback', 'scorecard'], capability: 'reports.view' },

    // System Configuration
    { id: 'inbound-routes', href: '/admin/inbound-routes', titleKey: 'modules.inbound-routes.title', descriptionKey: 'modules.inbound-routes.description', icon: 'routes', categoryKey: 'modules.categories.systemConfiguration', keywords: ['inbound', 'route', 'did', 'destination', 'trunk'], capability: 'console.view' },
    { id: 'time-conditions', href: '/admin/time-conditions', titleKey: 'modules.time-conditions.title', descriptionKey: 'modules.time-conditions.description', icon: 'time-conditions', categoryKey: 'modules.categories.systemConfiguration', keywords: ['time', 'schedule', 'hours', 'holiday', 'condition'], capability: 'console.view' },
    { id: 'system-settings', href: '/admin/system', titleKey: 'modules.system-settings.title', descriptionKey: 'modules.system-settings.description', icon: 'infrastructure', categoryKey: 'modules.categories.systemConfiguration', keywords: ['system', 'infrastructure', 'health', 'backup', 'servers'], capability: 'system.view' },
    { id: 'mail-config', href: '/admin/mail-config', titleKey: 'modules.mail-config.title', descriptionKey: 'modules.mail-config.description', icon: 'mail', categoryKey: 'modules.categories.systemConfiguration', keywords: ['mail', 'smtp', 'email', 'notifications', 'host', 'port'], capability: 'settings.manage' },
    { id: 'security', href: '/admin/security', titleKey: 'modules.security.title', descriptionKey: 'modules.security.description', icon: 'security', categoryKey: 'modules.categories.systemConfiguration', keywords: ['security', 'audit', 'ip', 'firewall', 'access'], capability: 'roles.manage' },
    { id: 'backups', href: '/admin/backups', titleKey: 'modules.backups.title', descriptionKey: 'modules.backups.description', icon: 'backups', categoryKey: 'modules.categories.systemConfiguration', keywords: ['backup', 'snapshot', 'storage', 'database'], capability: 'console.view' },
    { id: 'global-settings', href: '/settings/profile', titleKey: 'modules.global-settings.title', descriptionKey: 'modules.global-settings.description', icon: 'settings', categoryKey: 'modules.categories.systemConfiguration', keywords: ['settings', 'profile', 'preferences', 'account'], capability: 'settings.manage' },
];

export const SETTINGS_MODULES: ModuleEntry[] = [
    { id: 'ivr', href: '/admin/ivr', titleKey: 'modules.ivr.title', descriptionKey: 'modules.ivr.description', icon: 'ivr', categoryKey: 'modules.categories.telephonySettings', capability: 'settings.manage' },
    { id: 'queues', href: '/admin/queues', titleKey: 'modules.queues.title', descriptionKey: 'modules.queues.description', icon: 'queues', categoryKey: 'modules.categories.telephonySettings', capability: 'settings.manage' },
    { id: 'time-conditions', href: '/admin/time-conditions', titleKey: 'modules.time-conditions.title', descriptionKey: 'modules.time-conditions.description', icon: 'time-conditions', categoryKey: 'modules.categories.telephonySettings', capability: 'settings.manage' },
    { id: 'inbound-routes', href: '/admin/settings/inbound-routes', titleKey: 'modules.inbound-routes.title', descriptionKey: 'modules.inbound-routes.description', icon: 'routes', categoryKey: 'modules.categories.routingTrunks', capability: 'settings.manage' },
    { id: 'outbound-routes', href: '/admin/settings/outbound-routes', titleKey: 'modules.outbound-routes.title', descriptionKey: 'modules.outbound-routes.description', icon: 'routes', categoryKey: 'modules.categories.routingTrunks', capability: 'settings.manage' },
    { id: 'recordings', href: '/admin/settings/recordings', titleKey: 'modules.recordings.title', descriptionKey: 'modules.recordings.description', icon: 'recordings', categoryKey: 'modules.categories.mediaAudio', capability: 'settings.manage' },
    { id: 'moh', href: '/admin/settings/moh', titleKey: 'modules.moh.title', descriptionKey: 'modules.moh.description', icon: 'music', categoryKey: 'modules.categories.mediaAudio', capability: 'settings.manage' },
    { id: 'tones', href: '/admin/settings/tones', titleKey: 'modules.tones.title', descriptionKey: 'modules.tones.description', icon: 'tones', categoryKey: 'modules.categories.mediaAudio', capability: 'settings.manage' },
    { id: 'agent-states', href: '/admin/settings/agent-states', titleKey: 'modules.agent-states.title', descriptionKey: 'modules.agent-states.description', icon: 'agents', categoryKey: 'modules.categories.operationalPolicies', capability: 'settings.manage' },
    { id: 'departments', href: '/admin/settings/departments', titleKey: 'modules.departments.title', descriptionKey: 'modules.departments.description', icon: 'organizations', categoryKey: 'modules.categories.operationalPolicies', capability: 'settings.manage' },
    { id: 'survey', href: '/admin/settings/surveys', titleKey: 'modules.survey.title', descriptionKey: 'modules.survey.description', icon: 'surveys', categoryKey: 'modules.categories.operationalPolicies', capability: 'settings.manage' },
    { id: 'security', href: '/admin/settings/security', titleKey: 'modules.security.title', descriptionKey: 'modules.security.description', icon: 'security', categoryKey: 'modules.categories.systemSecurity', capability: 'settings.manage' },
    { id: 'cdr-config', href: '/admin/settings/cdr-config', titleKey: 'modules.cdr-config.title', descriptionKey: 'modules.cdr-config.description', icon: 'cdr-configuration', categoryKey: 'modules.categories.systemSecurity', capability: 'settings.manage' },
    { id: 'global-config', href: '/admin/settings/global', titleKey: 'modules.global-config.title', descriptionKey: 'modules.global-config.description', icon: 'global-config', categoryKey: 'modules.categories.systemSecurity', capability: 'settings.manage' },
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