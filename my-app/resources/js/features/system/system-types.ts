import type { FlexIconName } from '@/components/flex/iconography';

export type ServiceHealth = 'operational' | 'degraded' | 'down';

export interface ServiceStatus {
    id: string;
    name: string;
    description: string;
    status: ServiceHealth;
    latencyMs?: number;
    lastChecked: string;
    icon: FlexIconName;
}

export interface ServerResourceMetric {
    label: string;
    value: number;
    unit: string;
    tone: 'primary' | 'live' | 'sky';
}

export interface BackupStatusRow {
    label: string;
    value: string;
    ok: boolean;
}

export interface SystemSummary {
    operationalCount: number;
    degradedCount: number;
    downCount: number;
    uptime30d: string;
}

export interface SystemData {
    services: ServiceStatus[];
    serverResources: ServerResourceMetric[];
    backups: BackupStatusRow[];
    summary: SystemSummary;
    lastUpdatedAt: string;
}