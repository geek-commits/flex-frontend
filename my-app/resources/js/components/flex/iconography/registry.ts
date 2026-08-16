import {
    RiCustomerServiceLine,
    RiPhoneFindLine,
    RiPhoneLine,
    RiErrorWarningLine,
    RiCustomerService2Line,
    RiSearchLine,
    RiSunLine,
    RiMoonLine,
    RiTeamLine,
    RiAppsLine,
    RiCalendarScheduleLine,
    RiFileChartLine,
    RiTimeLine,
    RiMusic2Line,
    RiVolumeUpLine,
    RiFileSettingsLine,
    RiEqualizerLine,
    RiInboxLine,
    RiMessage2Line,
    RiChatSmileLine,
    RiBookOpenLine,
    RiBrainLine,
    RiCpuLine,
    RiToolsLine,
} from '@remixicon/react';
import type React from 'react';
import AnalyticsDashboard from '@assets/flex/icons/product/analytics-dashboard.svg?react';
import AssistantAvatar from '@assets/flex/icons/product/assistant-avatar.svg?react';
import AudioFile from '@assets/flex/icons/product/audio-file.svg?react';
import Backup from '@assets/flex/icons/product/backup.svg?react';
import Bot from '@assets/flex/icons/product/bot.svg?react';
import Campaign from '@assets/flex/icons/product/campaign.svg?react';
import CardReports from '@assets/flex/icons/product/card-reports.svg?react';
import CloudBackup from '@assets/flex/icons/product/cloud-backup.svg?react';
import Dashboard from '@assets/flex/icons/product/dashboard.svg?react';
import FaceHeadset from '@assets/flex/icons/product/face-headset.svg?react';
import Gauge from '@assets/flex/icons/product/gauge.svg?react';
import Invoice from '@assets/flex/icons/product/invoice.svg?react';
import Mail from '@assets/flex/icons/product/mail.svg?react';
import Queue from '@assets/flex/icons/product/queue.svg?react';
import ServerStack from '@assets/flex/icons/product/server-stack-icon.svg?react';
import Settings2 from '@assets/flex/icons/product/settings-2.svg?react';
import Settings from '@assets/flex/icons/product/settings.svg?react';
import ShieldForSecurity from '@assets/flex/icons/product/shield-for-security.svg?react';
import Team from '@assets/flex/icons/product/team.svg?react';


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
    | 'ai-overview'
    | 'ai-audit'
    | 'ai-providers'
    | 'ai-usage'
    | 'server-resources'
    | 'backup-status'
    | 'service-health'
    | 'social-inbox'
    | 'social-list'
    | 'module-placeholder';

export type FlexIconComponent = React.ComponentType<{ className?: string }>;

/**
 * Semantic product icon registry. Product/module concepts use the curated Koboyo
 * clean-line family; uncovered concepts, utility controls, and telephony controls
 * keep the existing precise system family. Keep names domain-meaningful; do not
 * infer semantics from source filenames or swap system-control icons into this map.
 */
export const FLEX_ICON_REGISTRY: Record<FlexIconName, FlexIconComponent> = {
    'agent-workspace': RiCustomerServiceLine,
    dashboard: Dashboard,
    monitoring: FaceHeadset,
    'management-console': Settings,
    'call-records': RiPhoneFindLine,
    campaigns: Campaign,
    reports: CardReports,
    'ai-center': Bot,
    infrastructure: ServerStack,
    'missed-calls': RiPhoneLine,
    troubleshooting: RiErrorWarningLine,
    support: RiCustomerService2Line,
    settings: Settings2,
    search: RiSearchLine,
    sun: RiSunLine,
    moon: RiMoonLine,
    organizations: RiTeamLine,
    agents: RiCustomerServiceLine,
    users: Team,
    roles: RiAppsLine,
    subscriptions: Invoice,
    queues: Queue,
    ivr: RiAppsLine,
    schedules: RiCalendarScheduleLine,
    recordings: AudioFile,
    'call-statistics': AnalyticsDashboard,
    charts: RiFileChartLine,
    surveys: RiFileChartLine,
    routes: RiAppsLine,
    'time-conditions': RiTimeLine,
    mail: Mail,
    security: ShieldForSecurity,
    backups: Backup,
    music: RiMusic2Line,
    tones: RiVolumeUpLine,
    'cdr-configuration': RiFileSettingsLine,
    'global-config': RiEqualizerLine,
    'empty-inbox': RiInboxLine,
    error: RiErrorWarningLine,
    'ai-copilot': AssistantAvatar,
    'knowledge-base': RiBookOpenLine,
    'voice-assistants': RiBrainLine,
    'ai-snapshot': RiFileChartLine,
    'ai-overview': Bot,
    'ai-audit': RiFileSettingsLine,
    'ai-providers': RiCpuLine,
    'ai-usage': RiFileChartLine,
    'server-resources': RiCpuLine,
    'backup-status': CloudBackup,
    'service-health': Gauge,
    'social-inbox': RiMessage2Line,
    'social-list': RiChatSmileLine,
    'module-placeholder': RiToolsLine,
};