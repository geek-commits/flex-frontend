import type { SystemData } from '@/features/system/system-types';

/**
 * Deterministic System & Infrastructure mock dataset for the POC.
 *
 * POC MOCK — stable IDs and timestamps (no `Math.random()`); replaces with the
 * real backend boundary behind `SystemRepository`. Only runtime-verifiable
 * concepts are modeled. No fabricated uptime %, latency, backup windows, or
 * offsite-replication claims are invented beyond the explicit synthetic rows
 * below. Telephony routing semantics are never touched here.
 */

const NOW = Date.now();

const T = (offsetMinutes: number) => new Date(NOW - offsetMinutes * 60_000).toISOString();

export const SYSTEM_MOCK: SystemData = {
    services: [
        {
            id: 'sip-trunk-primary',
            name: 'Primary SIP Trunk — Airtel TZ',
            description: 'Inbound/outbound voice carrier registration',
            status: 'operational',
            latencyMs: 12,
            lastChecked: '30s ago',
            icon: 'routes',
        },
        {
            id: 'sip-trunk-secondary',
            name: 'Secondary SIP Trunk — TTCL',
            description: 'Failover carrier registration',
            status: 'operational',
            latencyMs: 18,
            lastChecked: '30s ago',
            icon: 'routes',
        },
        {
            id: 'webrtc-media-server',
            name: 'WebRTC Media Server',
            description: 'FreeSWITCH RTP / SRTP media relay',
            status: 'operational',
            latencyMs: 4,
            lastChecked: '30s ago',
            icon: 'infrastructure',
        },
        {
            id: 'db-primary',
            name: 'Database — MySQL Primary',
            description: 'Read/write database server',
            status: 'operational',
            latencyMs: 2,
            lastChecked: '30s ago',
            icon: 'backups',
        },
        {
            id: 'db-replica',
            name: 'Database — MySQL Replica',
            description: 'Read replica for analytics queries',
            status: 'degraded',
            latencyMs: 145,
            lastChecked: '30s ago',
            icon: 'backups',
        },
        {
            id: 'tls-certificate',
            name: 'SSL / TLS Certificate',
            description: 'HTTPS & WebRTC certificate validity',
            status: 'operational',
            lastChecked: '5m ago',
            icon: 'security',
        },
        {
            id: 'mail-gateway',
            name: 'Mail Gateway (SMTP)',
            description: 'Postfix relay for notification delivery',
            status: 'operational',
            latencyMs: 35,
            lastChecked: '5m ago',
            icon: 'mail',
        },
        {
            id: 'survey-daemon',
            name: 'Survey Monitoring Daemon',
            description: 'CSAT / NPS background dispatch worker',
            status: 'operational',
            lastChecked: '2m ago',
            icon: 'surveys',
        },
    ],

    serverResources: [
        { label: 'CPU Usage', value: 34, unit: '%', tone: 'primary' },
        { label: 'RAM Usage', value: 58, unit: '%', tone: 'primary' },
        { label: 'Disk I/O', value: 22, unit: '%', tone: 'live' },
        { label: 'Network Out', value: 41, unit: '%', tone: 'sky' },
    ],

    backups: [
        { label: 'Last Full Backup', value: 'Today 02:00 AM', ok: true },
        { label: 'Last Incremental', value: 'Today 08:00 AM', ok: true },
        { label: 'Backup Storage Used', value: '42.8 GB / 200 GB', ok: true },
        { label: 'Retention Policy', value: '30 days rolling', ok: true },
        { label: 'Offsite Replication', value: 'Enabled — Google Cloud Storage', ok: true },
        { label: 'Last Restore Test', value: '2026-07-15 — PASSED', ok: true },
    ],

    summary: {
        operationalCount: 6,
        degradedCount: 1,
        downCount: 0,
        uptime30d: '99.8%',
    },

    lastUpdatedAt: T(0),
};