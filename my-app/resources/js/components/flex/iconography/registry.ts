import {
    RiAppsLine,
    RiInboxLine,
    RiBankCardLine,
    RiCalendarScheduleLine,
    RiDatabase2Line,
    RiDiscLine,
    RiEqualizerLine,
    RiFileSettingsLine,
    RiMailSettingsLine,
    RiMusic2Line,
    RiShieldKeyholeLine,
    RiStackLine,
    RiTimeLine,
    RiToolsLine,
    RiVolumeUpLine,
    RiWifiLine,
    RiBarChartBoxLine,
    RiCpuLine,
    RiHardDriveLine,
    RiCustomerService2Line,
    RiCustomerServiceLine,
    RiErrorWarningLine,
    RiFileChartLine,
    RiMegaphoneLine,
    RiMoonLine,
    RiPhoneFindLine,
    RiPhoneLine,
    RiQuestionAnswerLine,
    RiBookOpenLine,
    RiBrainLine,
    RiSparklingLine,
    RiRobotLine,
    RiSearchLine,
    RiServerLine,
    RiSettings4Line,
    RiSunLine,
    RiTeamLine,
} from '@remixicon/react';
import type React from 'react';

export type FlexIconName =
    | 'agent-workspace'
    | 'dashboard'
    | 'monitoring'
    | 'management-console'
    | 'call-records'
    | 'campaigns'
    | 'reports'
    | 'ai-center'
    | 'infrastructure'
    | 'missed-calls'
    | 'troubleshooting'
    | 'support'
    | 'settings'
    | 'search'
    | 'sun'
    | 'moon'
    | 'organizations'
    | 'agents'
    | 'users'
    | 'roles'
    | 'subscriptions'
    | 'queues'
    | 'ivr'
    | 'schedules'
    | 'recordings'
    | 'call-statistics'
    | 'charts'
    | 'surveys'
    | 'routes'
    | 'time-conditions'
    | 'mail'
    | 'security'
    | 'backups'
    | 'music'
    | 'tones'
    | 'cdr-configuration'
    | 'global-config'
    | 'empty-inbox'
    | 'error'
    | 'ai-copilot'
    | 'knowledge-base'
    | 'voice-assistants'
    | 'ai-snapshot'
    | 'server-resources'
    | 'backup-status'
    | 'service-health'
    | 'module-placeholder';

export type FlexIconComponent = React.ComponentType<{ className?: string }>;

/**
 * Semantic product icon registry. Keep names domain-meaningful; do not infer
 * semantics from source filenames or swap system-control icons into this map.
 */
export const FLEX_ICON_REGISTRY: Record<FlexIconName, FlexIconComponent> = {
    'agent-workspace': RiCustomerServiceLine,
    dashboard: RiBarChartBoxLine,
    monitoring: RiTeamLine,
    'management-console': RiAppsLine,
    'call-records': RiPhoneFindLine,
    campaigns: RiMegaphoneLine,
    reports: RiFileChartLine,
    'ai-center': RiRobotLine,
    infrastructure: RiServerLine,
    'missed-calls': RiPhoneLine,
    troubleshooting: RiErrorWarningLine,
    support: RiCustomerService2Line,
    settings: RiSettings4Line,
    search: RiSearchLine,
    sun: RiSunLine,
    moon: RiMoonLine,
    organizations: RiTeamLine,
    agents: RiCustomerServiceLine,
    users: RiTeamLine,
    roles: RiAppsLine,
    subscriptions: RiBankCardLine,
    queues: RiStackLine,
    ivr: RiAppsLine,
    schedules: RiCalendarScheduleLine,
    recordings: RiDiscLine,
    'call-statistics': RiBarChartBoxLine,
    charts: RiBarChartBoxLine,
    surveys: RiFileChartLine,
    routes: RiAppsLine,
    'time-conditions': RiTimeLine,
    mail: RiMailSettingsLine,
    security: RiShieldKeyholeLine,
    backups: RiDatabase2Line,
    music: RiMusic2Line,
    tones: RiVolumeUpLine,
    'cdr-configuration': RiFileSettingsLine,
    'global-config': RiEqualizerLine,
    'empty-inbox': RiInboxLine,
    error: RiErrorWarningLine,
    'ai-copilot': RiQuestionAnswerLine,
    'knowledge-base': RiBookOpenLine,
    'voice-assistants': RiBrainLine,
    'ai-snapshot': RiSparklingLine,
    'server-resources': RiCpuLine,
    'backup-status': RiHardDriveLine,
    'service-health': RiWifiLine,
    'module-placeholder': RiToolsLine,
};
