import {
    RiGroupLine,
    RiUserStarLine,
    RiUser3Line,
    RiShieldUserLine,
    RiBarChartGroupedLine,
    RiPieChartLine,
    RiFileChartLine,
    RiPhoneFindLine,
    RiMegaphoneLine,
    RiStackLine,
    RiFlowChart,
    RiDiscLine,
    RiTimeLine,
    RiRouterLine,
    RiShieldKeyholeLine,
    RiDatabase2Line,
    RiEqualizerLine,
    RiServerLine,
    RiSettings3Line,
    RiSurveyLine,
    RiMusic2Line,
    RiVolumeUpLine,
    RiFileSettingsLine,
} from '@remixicon/react';
import type { ComponentType } from 'react';
import type { Capability } from '@/auth/capabilities';

export interface ModuleEntry {
    id: string;
    href: string;
    title: string;
    description: string;
    icon: ComponentType<{ className?: string }>;
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
    { id: 'tenants', href: '/admin/tenants', title: 'Tenants & Multi-Org', description: 'Manage tenant accounts, organizations, and domain isolation.', icon: RiGroupLine, category: 'Core Administration', keywords: ['tenant', 'multi-org', 'organization', 'domain', 'account'], capability: 'roles.manage' },
    { id: 'agents', href: '/admin/agents', title: 'Agents & Proficiencies', description: 'Configure agent profiles, extension mapping, and skill routing.', icon: RiUserStarLine, category: 'Core Administration', keywords: ['agent', 'proficiency', 'skill', 'extension'], capability: 'console.view' },
    { id: 'users', href: '/admin/users', title: 'Users & Roles', description: 'Role-based access control, credentials, and security policies.', icon: RiUser3Line, category: 'Core Administration', keywords: ['users', 'accounts', 'access', 'password'], capability: 'roles.manage' },
    { id: 'roles', href: '/admin/roles', title: 'Roles & Permissions', description: 'Granular policy management for admin and supervisory roles.', icon: RiShieldUserLine, category: 'Core Administration', keywords: ['roles', 'permissions', 'policy', 'capability'], capability: 'roles.manage' },

    // Telephony & Operations
    { id: 'cdr', href: '/admin/cdr', title: 'Call Records (CDR)', description: 'Search, filter, and inspect granular telephony logs and recordings.', icon: RiPhoneFindLine, category: 'Telephony & Operations', keywords: ['cdr', 'call detail record', 'calls', 'telephony', 'log'], capability: 'cdr.view' },
    { id: 'call-campaigns', href: '/admin/campaigns', title: 'Call Campaigns', description: 'Outbound campaign management, schedules, and analytics.', icon: RiMegaphoneLine, category: 'Telephony & Operations', keywords: ['campaign', 'outbound', 'dialer', 'schedules'], capability: 'campaigns.view' },
    { id: 'queue', href: '/admin/queues', title: 'Queues & SLA', description: 'Configure inbound queues, wrap-up rules, and SLA targets.', icon: RiStackLine, category: 'Telephony & Operations', keywords: ['queue', 'acd', 'routing', 'wrap-up', 'sla', 'distribution'], capability: 'console.view' },
    { id: 'ivr', href: '/admin/ivr', title: 'IVR Trees', description: 'Build interactive voice response menus and keypress flows.', icon: RiFlowChart, category: 'Telephony & Operations', keywords: ['ivr', 'voice menu', 'routing', 'menu'], capability: 'console.view' },
    { id: 'recordings', href: '/admin/recordings', title: 'Call Recordings', description: 'Manage call audio archives, retention, and playback.', icon: RiDiscLine, category: 'Telephony & Operations', keywords: ['recording', 'audio', 'prompts', 'archive'], capability: 'console.view' },

    // Analytics & Quality
    { id: 'call-stats', href: '/admin/stats', title: 'Call Statistics', description: 'Real-time performance analytics, call volumes, and metrics.', icon: RiBarChartGroupedLine, category: 'Analytics & Quality', keywords: ['statistics', 'analytics', 'metrics', 'volume'], capability: 'reports.view' },
    { id: 'reports', href: '/admin/reports', title: 'Reports & Analytics', description: 'Generate, schedule, and export operational PDF/Excel reports.', icon: RiFileChartLine, category: 'Analytics & Quality', keywords: ['report', 'export', 'pdf', 'excel', 'schedule'], capability: 'reports.view' },
    { id: 'charts', href: '/admin/charts', title: 'Flex Charts', description: 'Visual analytics dashboard for supervisory overview.', icon: RiPieChartLine, category: 'Analytics & Quality', keywords: ['charts', 'visualization', 'analytics', 'graph'], capability: 'reports.view' },
    { id: 'survey-monitoring', href: '/admin/surveys', title: 'Survey Monitoring', description: 'Customer CSAT/NPS survey feedback and scorecards.', icon: RiSurveyLine, category: 'Analytics & Quality', keywords: ['survey', 'csat', 'nps', 'feedback', 'scorecard'], capability: 'reports.view' },

    // System Configuration
    { id: 'inbound-routes', href: '/admin/inbound-routes', title: 'Inbound Routes', description: 'DID pattern routing, time conditions, and destination rules.', icon: RiRouterLine, category: 'System Configuration', keywords: ['inbound', 'route', 'did', 'destination', 'trunk'], capability: 'console.view' },
    { id: 'time-conditions', href: '/admin/time-conditions', title: 'Time Conditions', description: 'Schedule working hours, holidays, and off-hour routing.', icon: RiTimeLine, category: 'System Configuration', keywords: ['time', 'schedule', 'hours', 'holiday', 'condition'], capability: 'console.view' },
    { id: 'system-settings', href: '/admin/system', title: 'System & Infrastructure', description: 'Service health, server resources, backup status, and gateway connections.', icon: RiServerLine, category: 'System Configuration', keywords: ['system', 'infrastructure', 'health', 'backup', 'servers'], capability: 'system.view' },
    { id: 'security', href: '/admin/security', title: 'Security & Audit', description: 'IP access controls, firewall rules, and audit trail logs.', icon: RiShieldKeyholeLine, category: 'System Configuration', keywords: ['security', 'audit', 'ip', 'firewall', 'access'], capability: 'roles.manage' },
    { id: 'backups', href: '/admin/backups', title: 'Backups & Storage', description: 'Database snapshot archives, retention, and disaster recovery.', icon: RiDatabase2Line, category: 'System Configuration', keywords: ['backup', 'snapshot', 'storage', 'database'], capability: 'console.view' },
    { id: 'global-settings', href: '/settings/profile', title: 'Settings', description: 'Profile, account security, and application preferences.', icon: RiSettings3Line, category: 'System Configuration', keywords: ['settings', 'profile', 'preferences', 'account'], capability: 'settings.manage' },
];

export const SETTINGS_MODULES: ModuleEntry[] = [
    { id: 'ivr', href: '/admin/settings/ivr', title: 'IVR & Menu Flow', description: 'Interactive voice response routes, keypress menus, and audio prompts.', icon: RiFlowChart, category: 'Telephony Settings', capability: 'settings.manage' },
    { id: 'queues', href: '/admin/settings/queues', title: 'Queues & Wrap-up', description: 'Queue strategies, max callers, music on hold, and post-call wrap-up timers.', icon: RiStackLine, category: 'Telephony Settings', capability: 'settings.manage' },
    { id: 'time-conditions', href: '/admin/settings/time-conditions', title: 'Time Conditions', description: 'Working hour schedules, holidays, and automatic after-hours routing.', icon: RiTimeLine, category: 'Telephony Settings', capability: 'settings.manage' },
    { id: 'inbound-routes', href: '/admin/settings/inbound-routes', title: 'Inbound Routes', description: 'DID pattern matching, trunk mapping, and entry point routing.', icon: RiRouterLine, category: 'Routing & Trunks', capability: 'settings.manage' },
    { id: 'outbound-routes', href: '/admin/settings/outbound-routes', title: 'Outbound Routes', description: 'Dial plan prefixes, trunk failover priorities, and rate limits.', icon: RiRouterLine, category: 'Routing & Trunks', capability: 'settings.manage' },
    { id: 'recordings', href: '/admin/settings/recordings', title: 'Recordings & Retention', description: 'Audio archive formats, retention policies, and cloud storage sinks.', icon: RiDiscLine, category: 'Media & Audio', capability: 'settings.manage' },
    { id: 'moh', href: '/admin/settings/moh', title: 'Music On Hold (MOH)', description: 'Manage audio playlists played while callers are queued or on hold.', icon: RiMusic2Line, category: 'Media & Audio', capability: 'settings.manage' },
    { id: 'tones', href: '/admin/settings/tones', title: 'Tones & Frequencies', description: 'Country-specific ringback, busy, and dialtone frequency profiles.', icon: RiVolumeUpLine, category: 'Media & Audio', capability: 'settings.manage' },
    { id: 'agent-states', href: '/admin/settings/agent-states', title: 'Agent States & Reasons', description: 'Custom pause codes, break reasons, and wrap-up status labels.', icon: RiUserStarLine, category: 'Operational Policies', capability: 'settings.manage' },
    { id: 'departments', href: '/admin/settings/departments', title: 'Departments', description: 'Organizational units, cost center allocations, and supervisors.', icon: RiGroupLine, category: 'Operational Policies', capability: 'settings.manage' },
    { id: 'survey', href: '/admin/settings/surveys', title: 'CSAT / Survey Config', description: 'Post-call survey prompts, scoring rules, and rating thresholds.', icon: RiSurveyLine, category: 'Operational Policies', capability: 'settings.manage' },
    { id: 'security', href: '/admin/settings/security', title: 'Security & Access', description: 'IP whitelists, password policies, session timeouts, and two-factor auth.', icon: RiShieldKeyholeLine, category: 'System & Security', capability: 'settings.manage' },
    { id: 'cdr-config', href: '/admin/settings/cdr-config', title: 'CDR Configuration', description: 'Log storage parameters, anonymization rules, and purging schedules.', icon: RiFileSettingsLine, category: 'System & Security', capability: 'settings.manage' },
    { id: 'global-config', href: '/admin/settings/global', title: 'Global System Config', description: 'Core application settings, default locale, and time zone offsets.', icon: RiEqualizerLine, category: 'System & Security', capability: 'settings.manage' },
];

export const ALL_MODULES: ModuleEntry[] = [...CONSOLE_MODULES, ...SETTINGS_MODULES];

export const MODULE_INDEX: Record<string, ModuleEntry> = Object.fromEntries(
    ALL_MODULES.map((module) => [module.href, module])
);
